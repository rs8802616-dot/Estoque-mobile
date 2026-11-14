import * as Sentry from '@sentry/react';

let sentryInicializado = false;

/**
 * Inicializa o monitoramento global de erros (Sentry + captura global de exceções).
 * Se VITE_SENTRY_DSN estiver configurado nas variáveis de ambiente, envia os erros
 * com arquivo, linha exata (via Source Maps) e contexto da loja/usuário.
 */
export function inicializarMonitoramentoErros(): void {
  if (typeof window === 'undefined' || sentryInicializado) return;
  sentryInicializado = true;

  const dsn = (import.meta as any).env?.VITE_SENTRY_DSN;
  if (dsn && typeof dsn === 'string' && dsn.trim().startsWith('http')) {
    Sentry.init({
      dsn: dsn.trim(),
      environment: (import.meta as any).env?.MODE || 'production',
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
  const dsn = (import.meta as any).env?.VITE_SENTRY_DSN;

  if (dsn && typeof dsn === 'string' && dsn.trim().startsWith('http')) {
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
