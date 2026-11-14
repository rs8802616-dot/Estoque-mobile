import * as Sentry from '@sentry/react';

const SENTRY_FALLBACK_DSN =
  'https://0a24fa5fd1c3ea88c7c8ff6bd735f162@o4512427242553344.ingest.us.sentry.io/4512427262869504';

let sentryInicializado = false;

function obterSentryDsn(): string {
  const envDsn = (import.meta as any).env?.VITE_SENTRY_DSN;
  if (envDsn && typeof envDsn === 'string' && envDsn.trim().startsWith('http')) {
    return envDsn.trim();
  }
  return SENTRY_FALLBACK_DSN;
}

/**
 * Inicializa o monitoramento global de erros (Sentry + captura global de exceções).
 * Envia os erros com arquivo, linha exata (via Source Maps) e contexto da loja/usuário.
 */
export function inicializarMonitoramentoErros(): void {
  if (typeof window === 'undefined' || sentryInicializado) return;
  sentryInicializado = true;

  const dsn = obterSentryDsn();
  if (dsn) {
    Sentry.init({
      dsn,
      environment: (import.meta as any).env?.MODE || 'production',
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: 0.2,
      beforeSend(event) {
        try {
          const lojaId = localStorage.getItem('supermercadoAtualId') || 'desconhecida';
          const perfil = localStorage.getItem('perfilAtivoTipo') || 'visitante';
          event.tags = {
            ...(event.tags || {}),
            lojaId,
            perfil,
          };
        } catch {}
        return event;
      },
    });
  }

  window.addEventListener('error', (event) => {
    if (event?.error) {
      capturarErroProducao(event.error, {
        origem: 'window.error',
        arquivo: event.filename,
        linha: event.lineno,
        coluna: event.colno,
      });
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const motivo = event?.reason instanceof Error
      ? event.reason
      : new Error(typeof event?.reason === 'string' ? event.reason : 'Promise rejeitada sem tratamento');
    capturarErroProducao(motivo, { origem: 'unhandledrejection' });
  });
}

export function capturarErroProducao(erro: unknown, contexto?: Record<string, unknown>): void {
  const errObj = erro instanceof Error ? erro : new Error(String(erro || 'Erro desconhecido'));
  const dsn = obterSentryDsn();

  if (dsn) {
    Sentry.withScope((scope) => {
      try {
        scope.setTag('lojaId', localStorage.getItem('supermercadoAtualId') || 'desconhecida');
        scope.setTag('perfil', localStorage.getItem('perfilAtivoTipo') || 'visitante');
      } catch {}
      if (contexto) {
        scope.setExtras(contexto);
      }
      Sentry.captureException(errObj);
    });
  }
}
