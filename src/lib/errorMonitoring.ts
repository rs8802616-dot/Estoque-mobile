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

function isAmbienteProducao(): boolean {
  return Boolean((import.meta as any).env?.PROD);
}

/**
 * Inicializa o monitoramento global de erros (Sentry com GlobalHandlers integrados) apenas em produção.
 * Envia os erros com arquivo, linha exata (via Source Maps) e contexto da loja/usuário.
 */
export function inicializarMonitoramentoErros(): void {
  if (typeof window === 'undefined' || sentryInicializado) return;
  sentryInicializado = true;

  if (!isAmbienteProducao()) return;

  const dsn = obterSentryDsn();
  if (dsn) {
    Sentry.init({
      dsn,
      environment: (import.meta as any).env?.MODE || 'production',
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: 0.1,
      beforeSend(event) {
        try {
          if (event.request) {
            if (event.request.headers) {
              delete event.request.headers['Authorization'];
              delete event.request.headers['authorization'];
              delete event.request.headers['Cookie'];
              delete event.request.headers['cookie'];
            }
            delete event.request.cookies;
            if (typeof event.request.url === 'string') {
              event.request.url = event.request.url.replace(/([?&](?:token|cpf|senha|key)=)[^&]+/gi, '$1[FILTRADO]');
            }
            if (typeof event.request.query_string === 'string') {
              event.request.query_string = event.request.query_string.replace(/((?:^|&)(?:token|cpf|senha|key)=)[^&]+/gi, '$1[FILTRADO]');
            }
          }
          if (Array.isArray(event.breadcrumbs)) {
            event.breadcrumbs = event.breadcrumbs.map((b) => {
              if (b?.data && typeof b.data.url === 'string') {
                return {
                  ...b,
                  data: {
                    ...b.data,
                    url: b.data.url.replace(/([?&](?:token|cpf|senha|key)=)[^&]+/gi, '$1[FILTRADO]'),
                  },
                };
              }
              return b;
            });
          }
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
}

export function capturarErroProducao(erro: unknown, contexto?: Record<string, unknown>): void {
  if (!isAmbienteProducao()) return;
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
