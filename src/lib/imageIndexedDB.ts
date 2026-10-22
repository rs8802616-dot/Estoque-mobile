// IndexedDB storage for offline product images (safe from localStorage 5MB quota limit)

const DB_NAME = 'mercado_midia_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'imagens_produtos';

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
  if (foto.length > 10) {
    const mudou = cacheImagensMemoria.get(cod) !== foto;
    cacheImagensMemoria.set(cod, foto);
    if (mudou) {
      salvarImagemIndexedDB(cod, foto).catch(() => {});
      notificarListeners();
    }
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

function abrirDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target?.result as IDBDatabase;
        if (db && !db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'codigo' });
        }
      };

      request.onsuccess = (event: any) => {
        resolve(event.target?.result || null);
      };

      request.onerror = (err) => {
        console.warn('Não foi possível inicializar IndexedDB para imagens:', err);
        resolve(null);
      };
    } catch (e) {
      console.warn('Erro ao abrir IndexedDB:', e);
      resolve(null);
    }
  });
}

/**
 * Salva uma foto/imagem de produto no IndexedDB pelo código do produto
 */
export async function salvarImagemIndexedDB(codigo: string, fotoBase64: string): Promise<void> {
  if (!codigo || !fotoBase64 || typeof fotoBase64 !== 'string') return;
  const cod = codigo.trim();
  if (!cod || fotoBase64.length < 10) return;

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
        notificarListeners();
        resolve();
      };
      tx.onerror = () => resolve();
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
  
  let algumaAdicionada = false;
  itens.forEach((it) => {
    const cod = it.codigo?.trim();
    const img = it.imagem || it.foto;
    if (cod && img && typeof img === 'string' && img.length > 10) {
      cacheImagensMemoria.set(cod, img);
      algumaAdicionada = true;
    }
  });

  try {
    const db = await abrirDB();
    if (!db) {
      if (algumaAdicionada) notificarListeners();
      return;
    }

    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    for (const it of itens) {
      const cod = it.codigo?.trim();
      const img = it.imagem || it.foto;
      if (cod && img && typeof img === 'string' && img.length > 10) {
        store.put({ codigo: cod, imagem: img, timestamp: Date.now() });
      }
    }

    return new Promise((resolve) => {
      tx.oncomplete = () => {
        notificarListeners();
        resolve();
      };
      tx.onerror = () => resolve();
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
        const registros: { codigo: string; imagem: string }[] = event.target?.result || [];
        let novosItens = false;
        registros.forEach((reg) => {
          if (reg.codigo && reg.imagem) {
            cacheImagensMemoria.set(reg.codigo.trim(), reg.imagem);
            novosItens = true;
          }
        });
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

