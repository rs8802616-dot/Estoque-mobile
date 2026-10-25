import { salvarLoteImagensIndexedDB } from './imageIndexedDB';

/**
 * Limpa chaves corrompidas ou obsoletas do localStorage,
 * especialmente resíduos de mutações do Firestore (persistentMultipleTabManager)
 * e sanitiza estoques e catálogos antigos que armazenavam megabytes de Base64 no localStorage.
 */
export function limparArmazenamentoLocalCorrompido(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const chavesParaRemover: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;

      // 1. Remove qualquer chave de cliente ou mutação interna pendente do Firestore no localStorage
      if (k.startsWith('firestore_') || k.startsWith('firestore')) {
        chavesParaRemover.push(k);
      }

      // 2. Remove logs de auditoria gigantescos ou caches temporários antigos do localStorage
      if (
        k.startsWith('logs_auditoria_') ||
        k.startsWith('estoque_sync_cache') ||
        k.startsWith('temp_') ||
        k === 'migracao_auto_banco_antigo_concluida_v1'
      ) {
        chavesParaRemover.push(k);
      }
    }

    chavesParaRemover.forEach((chave) => {
      try {
        localStorage.removeItem(chave);
      } catch (_) {}
    });

    // 3. Sanitiza estoques e catálogos existentes para liberar espaço imediatamente caso contenham Base64 pesado
    const chavesParaSanitizar: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k === 'catalogoGlobalFirebase' || k.startsWith('estoque_'))) {
        chavesParaSanitizar.push(k);
      }
    }

    chavesParaSanitizar.forEach((k) => {
      try {
        const val = localStorage.getItem(k);
        if (val && val.includes('data:image/')) {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            // Salva as fotos no IndexedDB para persistência offline de alta capacidade
            salvarLoteImagensIndexedDB(parsed).catch(() => {});

            // Salva a versão leve no localStorage (sem base64)
            const leve = parsed.map((item: any) => {
              if (item && typeof item === 'object') {
                const cp = { ...item };
                if (typeof cp.imagem === 'string' && cp.imagem.startsWith('data:image')) {
                  cp.imagem = '';
                }
                if (typeof cp.foto === 'string' && cp.foto.startsWith('data:image')) {
                  cp.foto = '';
                }
                return cp;
              }
              return item;
            });
            localStorage.setItem(k, JSON.stringify(leve));
          }
        }
      } catch (_) {}
    });
  } catch (err) {
    console.warn('Aviso durante a limpeza preventiva do localStorage:', err);
  }
}

// Executa a limpeza preventiva assim que o módulo é carregado no navegador
if (typeof window !== 'undefined') {
  limparArmazenamentoLocalCorrompido();
}

/**
 * Remove fotos em base64 pesadas de objetos salvos no localStorage,
 * garantindo que fiquem abaixo de 50-100KB em vez de 5MB+.
 */
function sanitizarValorParaLocalStorage(key: string, value: string): string {
  if (key === 'catalogoGlobalFirebase' || key.startsWith('estoque_') || key.startsWith('vendas_')) {
    if (value.includes('data:image/')) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          // Garante persistência das fotos no IndexedDB (sem limite de 5MB)
          salvarLoteImagensIndexedDB(parsed).catch(() => {});

          const versaoLeve = parsed.map((item: any) => {
            if (item && typeof item === 'object') {
              const cp = { ...item };
              if (typeof cp.imagem === 'string' && cp.imagem.startsWith('data:image')) {
                cp.imagem = '';
              }
              if (typeof cp.foto === 'string' && cp.foto.startsWith('data:image')) {
                cp.foto = '';
              }
              return cp;
            }
            return item;
          });
          return JSON.stringify(versaoLeve);
        }
      } catch (_) {
        return value;
      }
    }
  }
  return value;
}

/**
 * Grava dados no localStorage com proteção ativa contra estouro de cota (QuotaExceededError).
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;

  const valorSanitizado = sanitizarValorParaLocalStorage(key, value);

  try {
    localStorage.setItem(key, valorSanitizado);
    return true;
  } catch (err: any) {
    console.warn(`Quota excedida no localStorage ao tentar salvar "${key}". Executando limpeza emergencial...`, err);

    try {
      limparArmazenamentoLocalCorrompido();
      localStorage.setItem(key, valorSanitizado);
      return true;
    } catch (retryErr) {
      // Se for uma chave prioritária de estoque ou vendas, libera o cache de catalogoGlobalFirebase (que já existe no bundle e Firestore)
      if (key.startsWith('estoque_') || key.startsWith('vendas_')) {
        try {
          localStorage.removeItem('catalogoGlobalFirebase');
          localStorage.setItem(key, valorSanitizado);
          return true;
        } catch (_) {}
      }
      console.warn(
        `Limite de armazenamento local (localStorage) excedido para "${key}". Os dados continuam íntegros no Firestore e em memória.`
      );
      return false;
    }
  }
}

/**
 * Lê dados do localStorage de forma segura com fallback.
 */
export function safeLocalStorageGet(key: string, fallback: string | null = null): string | null {
  if (typeof window === 'undefined' || !window.localStorage) return fallback;
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch (err) {
    console.warn(`Erro ao ler localStorage para chave "${key}":`, err);
    return fallback;
  }
}
