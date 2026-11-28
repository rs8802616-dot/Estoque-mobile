// IndexedDB storage for offline product images (safe from localStorage 5MB quota limit)

const DB_NAME = 'mercado_midia_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'imagens_produtos';
const MAX_IMAGENS_CACHE = 500;
const TTL_IMAGEM_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

async function podarCacheAntigoIndexedDB(db: IDBDatabase, removerFracaoExtra = 0): Promise<void> {
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      let removeuAlgum = false;
      req.onsuccess = () => {
        const registros: Array<{ codigo: string; timestamp?: number }> = Array.isArray(req.result) ? req.result : [];
        const agora = Date.now();
        const expirados = registros.filter((r) => r.timestamp && agora - r.timestamp > TTL_IMAGEM_MS);
        expirados.forEach((r) => {
          store.delete(r.codigo);
          cacheImagensMemoria.delete(r.codigo);
        });

        const ativos = registros
          .filter((r) => !r.timestamp || agora - r.timestamp <= TTL_IMAGEM_MS)
          .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

        const excedente = Math.max(0, ativos.length - MAX_IMAGENS_CACHE);
        const extra = removerFracaoExtra > 0 ? Math.ceil(ativos.length * removerFracaoExtra) : 0;
        const totalRemover = Math.min(ativos.length, excedente + extra);

        for (let i = 0; i < totalRemover; i++) {
          store.delete(ativos[i].codigo);
          cacheImagensMemoria.delete(ativos[i].codigo);
        }
        removeuAlgum = expirados.length > 0 || totalRemover > 0;
      };
      tx.oncomplete = () => {
        if (removeuAlgum) {
          notificarListeners();
        }
        resolve();
      };
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

// Cache em memória para consultas síncronas instantâneas (sem latência de async)
const cacheImagensMemoria = new Map<string, string>();
const listenersCache = new Set<() => void>();

function notificarListeners() {
  listenersCache.forEach((fn) => {
    try {
      fn();
    } catch (_) {}
  });
}

/**
 * Consulta síncrona imediata da foto em memória cache (retorna string Base64/URL ou undefined)
 */
export function obterFotoCache(codigo?: string): string | undefined {
  if (!codigo) return undefined;
  const cod = String(codigo).trim();
  return cacheImagensMemoria.get(cod);
}

/**
 * Insere ou atualiza uma foto no cache de memória e no IndexedDB
 */
export function definirFotoCache(codigo: string, foto: string): void {
  if (!codigo || !foto) return;
  const cod = String(codigo).trim();
  if (foto.length > 10 && cacheImagensMemoria.get(cod) !== foto) {
    salvarImagemIndexedDB(cod, foto).catch(() => {});
  }
}

/**
 * Permite que componentes React se inscrevam em alterações do cache de fotos
 */
export function subscreverCacheImagens(callback: () => void): () => void {
  listenersCache.add(callback);
  return () => {
    listenersCache.delete(callback);
  };
}

let dbPromise: Promise<IDBDatabase | null> | null = null;

function abrirDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target?.result as IDBDatabase;
        if (db && !db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'codigo' });
        }
      };

      request.onsuccess = (event: any) => {
        const db = (event.target?.result as IDBDatabase) || null;
        if (db) {
          db.onclose = () => {
            dbPromise = null;
          };
          db.onversionchange = () => {
            db.close();
            dbPromise = null;
          };
        } else {
          dbPromise = null;
        }
        resolve(db);
      };

      request.onerror = (err) => {
        console.warn('Não foi possível inicializar IndexedDB para imagens:', err);
        dbPromise = null;
        resolve(null);
      };
    } catch (e) {
      console.warn('Erro ao abrir IndexedDB:', e);
      dbPromise = null;
      resolve(null);
    }
  });

  return dbPromise;
}

/**
 * Salva uma foto/imagem de produto no IndexedDB pelo código do produto
 */
export async function salvarImagemIndexedDB(codigo: string, fotoBase64: string): Promise<void> {
  if (!codigo || !fotoBase64 || typeof fotoBase64 !== 'string') return;
  const cod = codigo.trim();
  if (!cod || fotoBase64.length < 10) return;

  // Se já está em memória com o mesmo valor exato, evita abrir transação redundante e disparar re-renders
  if (cacheImagensMemoria.get(cod) === fotoBase64) return;

  // Atualiza cache em memória imediatamente
  cacheImagensMemoria.set(cod, fotoBase64);

  try {
    const db = await abrirDB();
    if (!db) return;

    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ codigo: cod, imagem: fotoBase64, timestamp: Date.now() });

    return new Promise((resolve) => {
      tx.oncomplete = () => {
        if (cacheImagensMemoria.size > MAX_IMAGENS_CACHE) {
          podarCacheAntigoIndexedDB(db).catch(() => {});
        }
        notificarListeners();
        resolve();
      };
      tx.onerror = async (ev: any) => {
        const errName = ev?.target?.error?.name || tx.error?.name;
        if (errName === 'QuotaExceededError') {
          await podarCacheAntigoIndexedDB(db, 0.25);
          try {
            const txRetry = db.transaction(STORE_NAME, 'readwrite');
            txRetry.objectStore(STORE_NAME).put({ codigo: cod, imagem: fotoBase64, timestamp: Date.now() });
            txRetry.oncomplete = () => {
              notificarListeners();
              resolve();
            };
            txRetry.onerror = () => resolve();
            return;
          } catch {}
        }
        resolve();
      };
    });
  } catch (err) {
    console.warn(`Erro ao salvar imagem no IndexedDB para ${codigo}:`, err);
  }
}

/**
 * Salva em lote um lote de fotos no IndexedDB
 */
export async function salvarLoteImagensIndexedDB(itens: { codigo: string; imagem?: string; foto?: string }[]): Promise<void> {
  if (!Array.isArray(itens) || itens.length === 0) return;
  
  const itensAlterados: { cod: string; img: string }[] = [];
  itens.forEach((it) => {
    const cod = it.codigo?.trim();
    const img = it.imagem || it.foto;
    if (cod && img && typeof img === 'string' && img.length > 10) {
      if (cacheImagensMemoria.get(cod) !== img) {
        cacheImagensMemoria.set(cod, img);
        itensAlterados.push({ cod, img });
      }
    }
  });

  if (itensAlterados.length === 0) return;

  try {
    const db = await abrirDB();
    if (!db) {
      notificarListeners();
      return;
    }

    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    for (const it of itensAlterados) {
      store.put({ codigo: it.cod, imagem: it.img, timestamp: Date.now() });
    }

    return new Promise((resolve) => {
      tx.oncomplete = () => {
        if (cacheImagensMemoria.size > MAX_IMAGENS_CACHE) {
          podarCacheAntigoIndexedDB(db).catch(() => {});
        }
        notificarListeners();
        resolve();
      };
      tx.onerror = async (ev: any) => {
        const errName = ev?.target?.error?.name || tx.error?.name;
        if (errName === 'QuotaExceededError') {
          await podarCacheAntigoIndexedDB(db, 0.25);
          try {
            const txRetry = db.transaction(STORE_NAME, 'readwrite');
            const storeRetry = txRetry.objectStore(STORE_NAME);
            for (const it of itensAlterados) {
              storeRetry.put({ codigo: it.cod, imagem: it.img, timestamp: Date.now() });
            }
            txRetry.oncomplete = () => {
              notificarListeners();
              resolve();
            };
            txRetry.onerror = () => resolve();
            return;
          } catch {}
        }
        resolve();
      };
    });
  } catch (err) {
    console.warn('Erro ao salvar lote de imagens no IndexedDB:', err);
  }
}

/**
 * Carrega todas as fotos de produtos em cache local do IndexedDB
 */
export async function obterTodasImagensIndexedDB(): Promise<Map<string, string>> {
  try {
    const db = await abrirDB();
    if (!db) return cacheImagensMemoria;

    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve) => {
      request.onsuccess = (event: any) => {
        const registros: { codigo: string; imagem: string; timestamp?: number }[] =
          Array.isArray(event.target?.result) ? event.target.result : [];
        const agora = Date.now();
        let precisaPodar = false;

        const ativos = registros
          .filter((reg) => {
            if (!reg?.codigo || !reg?.imagem) return false;
            if (reg.timestamp && agora - reg.timestamp > TTL_IMAGEM_MS) {
              precisaPodar = true;
              return false;
            }
            return true;
          })
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        if (ativos.length > MAX_IMAGENS_CACHE) {
          precisaPodar = true;
        }

        const dentroLimite = ativos.slice(0, MAX_IMAGENS_CACHE);
        let novosItens = false;
        dentroLimite.forEach((reg) => {
          const cod = reg.codigo.trim();
          if (cod && !cacheImagensMemoria.has(cod)) {
            cacheImagensMemoria.set(cod, reg.imagem);
            novosItens = true;
          }
        });

        if (precisaPodar) {
          podarCacheAntigoIndexedDB(db).catch(() => {});
        }
        if (novosItens) {
          notificarListeners();
        }
        resolve(cacheImagensMemoria);
      };
      request.onerror = () => resolve(cacheImagensMemoria);
    });
  } catch (err) {
    console.warn('Erro ao carregar imagens do IndexedDB:', err);
    return cacheImagensMemoria;
  }
}

// Inicializa o carregamento do cache em segundo plano assim que a aplicação abre no navegador
if (typeof window !== 'undefined') {
  obterTodasImagensIndexedDB().catch((e) => {
    console.warn('Aviso na inicialização do cache de fotos IndexedDB:', e);
  });
}

