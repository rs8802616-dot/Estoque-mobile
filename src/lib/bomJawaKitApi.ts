// Fila de 4 Chaves em Cascata SI5 Global (100 consultas/dia por chave = 400 consultas/dia)
export const SI5_GLOBAL_TOKENS = [
  '317|Xtgp6qwYewWk5ScCiY7JPLbPHZEaFEWPuLgQ3HfV37d19db3',
  '318|DSFrciYJgudTZgumBUyGSIaoaIhDfVsBJc3wVXRb4c67fd72',
  '319|IOXdsrllJ7zTek8FQ0rJoQwpNKb7f0WSpr6yMm7M009e4aa4',
  '320|Gh303pFfHUKK8RxzZ8jDIQbalzFlIJ2FUidPrN9kbe63cec2',
];

export interface SI5ProdutoRetorno {
  ean: string;
  nomeProduto: string;
  marca: string;
  categoria: string;
  fotoUrl: string;
  ncm: string;
  descricao: string;
  fonte: string;
}

/**
 * Consulta de produtos na API SI5 Global utilizando as 4 chaves em cascata.
 * Se a Chave 1 atingir o limite diário de 100 consultas (HTTP 429), pula imediatamente para a Chave 2,
 * depois 3 e 4, garantindo até 400 consultas diárias gratuitas sem travar o usuário.
 */
export async function consultarSI5GlobalCascata(codigo: string): Promise<SI5ProdutoRetorno | null> {
  const clean = (codigo || '').trim().replace(/\D/g, '');
  if (!clean) return null;

  const dataHoje = new Date().toISOString().slice(0, 10);

  for (let i = 0; i < SI5_GLOBAL_TOKENS.length; i++) {
    const token = SI5_GLOBAL_TOKENS[i];
    const chaveStorage = `si5_token_esgotado_${i}_${dataHoje}`;

    // Pula token se já marcou cota esgotada na data de hoje
    if (typeof window !== 'undefined') {
      try {
        if (localStorage.getItem(chaveStorage) === 'true') {
          continue;
        }
      } catch {}
    }

    try {
      const ctrl = new AbortController();
      const timeoutId = setTimeout(() => ctrl.abort(), 6000);

      const res = await fetch(`https://global.si5.com.br/api/produtos/${encodeURIComponent(clean)}`, {
        method: 'GET',
        signal: ctrl.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      clearTimeout(timeoutId);

      // Cota de 100 consultas diárias atingida
      if (res.status === 429) {
        console.warn(`[SI5 Global] Token #${i + 1} atingiu limite de 100 consultas hoje. Passando para o próximo token...`);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(chaveStorage, 'true');
          } catch {}
        }
        continue;
      }

      if (res.ok) {
        const json = await res.json();
        if (json && (json.produto || json.codbar)) {
          return {
            ean: String(json.codbar || clean).trim(),
            nomeProduto: String(json.produto || '').trim(),
            marca: String(json.marca || '').trim(),
            categoria: String(json.categoria || 'Geral').trim(),
            fotoUrl: String(json.imagem_url || '').trim(),
            ncm: String(json.ncm || '').trim(),
            descricao: String(json.ncm_descricao || json.ingredientes || '').trim(),
            fonte: `API SI5 Global (Chave #${i + 1} de 4)`,
          };
        }
      }
    } catch (e: any) {
      console.warn(`[SI5 Global] Falha na Chave #${i + 1}:`, e?.message || e);
    }
  }

  return null;
}

// Motor Duplo de Consulta de Produtos (Dual-API Engine):
// 1º PRIORIDADE PRINCIPAL (API 1): Bluesoft Cosmos (https://api.cosmos.bluesoft.com.br) - Header: X-Cosmos-Token: 2Vu6HJqH8130Bk_YhL8Osg
// 2º CONTINGÊNCIA / COMPLEMENTO (API 2): BomJawaKit (https://produtos.bomjawakit.com.br/api/v1) - Header: X-API-Key: sk_VZvKYX-ldCakrfALLxpzKPvmRUoawNN7hewD678CvGU
// A Bluesoft Cosmos roda PRIMEIRO em todas as consultas. Caso atinja o limite diário (429) ou não tenha o produto, a BomJawaKit entra em ação automaticamente.

export const COSMOS_BLUESOFT_API_BASE = 'https://api.cosmos.bluesoft.com.br';
export const COSMOS_BLUESOFT_DEFAULT_TOKEN = '2Vu6HJqH8130Bk_YhL8Osg';
export const COSMOS_BLUESOFT_CDN = 'https://cdn-cosmos.bluesoft.com.br/products';

export const BOMJAWAKIT_API_BASE = 'https://produtos.bomjawakit.com.br';
export const BOMJAWAKIT_DEFAULT_API_KEY = 'sk_VZvKYX-ldCakrfALLxpzKPvmRUoawNN7hewD678CvGU';
export const BOMJAWAKIT_R2_IMAGE_CDN = 'https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev';

export interface BomJawaKitProdutoRaw {
  barcode: string;
  nome: string;
  ncm?: string | null;
  descricao?: string | null;
  categoria?: string | null;
  categoria_slug?: string | null;
  tem_imagem?: boolean;
  imagem_url?: string | null;
  dados?: Record<string, any>;
  unidades_comerciais?: any[];
}

export interface CosmosBluesoftProdutoRaw {
  gtin: number | string;
  description: string;
  thumbnail?: string | null;
  price?: string | null;
  avg_price?: number | null;
  max_price?: number | null;
  min_price?: number | null;
  brand?: {
    name?: string;
    picture?: string;
  } | null;
  gpc?: {
    code?: string;
    description?: string;
  } | null;
  ncm?: {
    code?: string;
    description?: string;
    full_description?: string;
  } | null;
  cest?: {
    code?: string;
    description?: string;
  } | null;
}

export interface BomJawaKitCategoria {
  id: number;
  slug: string;
  nome: string;
  produtos: number;
}

export interface ProdutoNormalizadoBomJawaKit {
  ean: string;
  nomeProduto: string;
  marca: string;
  categoria: string;
  fotoUrl: string;
  ncm: string;
  descricao: string;
  temImagem: boolean;
  fonte: string;
}

export function getCosmosBluesoftToken(): string {
  if (typeof window !== 'undefined') {
    try {
      const customToken = localStorage.getItem('cosmos_bluesoft_token');
      if (customToken && customToken.trim().length > 5) {
        return customToken.trim();
      }
    } catch {}
  }
  return COSMOS_BLUESOFT_DEFAULT_TOKEN;
}

export function getBomJawaKitApiKey(): string {
  if (typeof window !== 'undefined') {
    try {
      const customKey = localStorage.getItem('bomjawakit_api_key');
      if (customKey && customKey.trim().startsWith('sk_')) {
        return customKey.trim();
      }
    } catch {}
  }
  return BOMJAWAKIT_DEFAULT_API_KEY;
}

export function construirUrlImagemCosmos(barcode: string): string {
  const clean = (barcode || '').trim().replace(/\D/g, '');
  if (!clean) return '';
  return `${COSMOS_BLUESOFT_CDN}/${encodeURIComponent(clean)}`;
}

export function construirUrlImagemBomJawaKit(barcode: string, temImagem?: boolean): string {
  const clean = (barcode || '').trim();
  if (!clean) return '';
  if (temImagem === false) {
    return construirUrlImagemCosmos(clean);
  }
  return `${BOMJAWAKIT_R2_IMAGE_CDN}/${encodeURIComponent(clean)}.png`;
}

/**
 * Busca a URL final da imagem via endpoint /api/v1/produtos/{barcode}/imagem com header X-API-Key
 */
export async function resolverImagemEndpointBomJawaKit(barcode: string): Promise<string> {
  const clean = (barcode || '').trim();
  if (!clean) return '';
  try {
    const res = await fetch(
      `${BOMJAWAKIT_API_BASE}/api/v1/produtos/${encodeURIComponent(clean)}/imagem`,
      {
        method: 'GET',
        headers: {
          'X-API-Key': getBomJawaKitApiKey(),
        },
      }
    );
    if (res.ok && res.url) {
      return res.url;
    }
  } catch {}
  return construirUrlImagemBomJawaKit(clean, true);
}

function extrairMarcaDoItem(item: BomJawaKitProdutoRaw): string {
  const dados = item.dados || {};
  const marcaDados =
    dados.marca ||
    dados.brand ||
    dados.fabricante ||
    dados.manufacturer ||
    '';
  if (marcaDados && typeof marcaDados === 'string' && marcaDados.trim()) {
    return marcaDados.trim();
  }
  return '';
}

function limparCategoriaBomJawaKit(cat?: string | null): string {
  if (!cat) return '';
  return cat
    .replace(/^Carrefour\s*-\s*Mercearia\s*-\s*/i, '')
    .replace(/^Carrefour\s*-\s*/i, '')
    .replace(/^Amig[aã]o\s*-\s*/i, '')
    .trim();
}

export function normalizarProdutoCosmosBluesoft(item: CosmosBluesoftProdutoRaw): ProdutoNormalizadoBomJawaKit {
  const gtin = String(item.gtin || '').trim();
  const nomeLimpo = String(item.description || '').trim();
  const marcaLimpa = String(item.brand?.name || '').trim();
  const categoriaLimpa = String(item.gpc?.description || item.ncm?.description || '').trim();
  const ncmLimpo = String(item.ncm?.code || '').trim();
  const thumb = String(item.thumbnail || '').trim();
  const fotoFinal =
    thumb && !thumb.includes('default') && !thumb.includes('no-image')
      ? thumb
      : construirUrlImagemCosmos(gtin);

  return {
    ean: gtin,
    nomeProduto: nomeLimpo,
    marca: marcaLimpa,
    categoria: categoriaLimpa,
    fotoUrl: fotoFinal,
    ncm: ncmLimpo,
    descricao: String(item.ncm?.full_description || item.description || '').trim(),
    temImagem: Boolean(fotoFinal),
    fonte: 'API Bluesoft Cosmos (cosmos.bluesoft.com.br)',
  };
}

export function normalizarProdutoBomJawaKit(item: BomJawaKitProdutoRaw): ProdutoNormalizadoBomJawaKit {
  const barcode = String(item.barcode || '').trim();
  const nomeLimpo = String(item.nome || '')
    .replace(/\|\|.*$/g, '')
    .trim();
  const ncmLimpo =
    item.ncm && !String(item.ncm).toLowerCase().includes('não disponível')
      ? String(item.ncm).trim()
      : '';
  const temImg = Boolean(item.tem_imagem);
  const fotoUrl = temImg
    ? `${BOMJAWAKIT_R2_IMAGE_CDN}/${encodeURIComponent(barcode)}.png`
    : construirUrlImagemCosmos(barcode);

  return {
    ean: barcode,
    nomeProduto: nomeLimpo,
    marca: extrairMarcaDoItem(item),
    categoria: limparCategoriaBomJawaKit(item.categoria),
    fotoUrl,
    ncm: ncmLimpo,
    descricao: String(item.descricao || '').trim(),
    temImagem: temImg,
    fonte: 'API BomJawaKit (produtos.bomjawakit.com.br)',
  };
}

/**
 * 1º PRIORIDADE: Consulta na API Oficial Bluesoft Cosmos (https://api.cosmos.bluesoft.com.br/gtins/{gtin}.json)
 * Autenticação via X-Cosmos-Token: 2Vu6HJqH8130Bk_YhL8Osg
 */
export async function consultarProdutoCosmosBluesoftPorCodigo(
  barcode: string
): Promise<ProdutoNormalizadoBomJawaKit | null> {
  const cleanCode = (barcode || '').trim().replace(/\D/g, '');
  if (!cleanCode) return null;

  const cosmosToken = getCosmosBluesoftToken();

  // 1. Tenta chamada direta à API REST Oficial Bluesoft Cosmos
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      `${COSMOS_BLUESOFT_API_BASE}/gtins/${encodeURIComponent(cleanCode)}.json`,
      {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'X-Cosmos-Token': cosmosToken,
          'Content-Type': 'application/json',
          'User-Agent': 'Cosmos-API-Request',
          Accept: 'application/json',
        },
      }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const item: CosmosBluesoftProdutoRaw = await res.json();
      if (item && item.description) {
        return normalizarProdutoCosmosBluesoft(item);
      }
    }
  } catch {
    // Em navegadores com bloqueio de CORS no domínio api.cosmos.bluesoft.com.br,
    // prossegue imediatamente para a rota Serverless/Backend (/api/consultar-produto-codigo).
  }

  // 2. Consulta via Serverless/Backend Proxy (/api/consultar-produto-codigo) com prioridade para Bluesoft Cosmos
  if (typeof window !== 'undefined') {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const resProxy = await fetch('/api/consultar-produto-codigo', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ean: cleanCode,
          cosmosToken,
          onlyCosmos: true,
        }),
      });
      clearTimeout(timeout);

      const contentType = resProxy.headers.get('content-type') || '';
      if (resProxy.ok && contentType.includes('application/json')) {
        const d = await resProxy.json();
        if (d && d.nomeProduto && d.nomeProduto !== 'Produto Sem Título' && d.nomeProduto !== 'Produto Cadastrado') {
          return {
            ean: cleanCode,
            nomeProduto: d.nomeProduto,
            marca: d.marca || '',
            categoria: d.categoria || '',
            fotoUrl: d.fotoUrl || construirUrlImagemCosmos(cleanCode),
            ncm: d.ncm || '',
            descricao: d.descricao || '',
            temImagem: Boolean(d.fotoUrl),
            fonte: d.fonte || 'API Bluesoft Cosmos (cosmos.bluesoft.com.br)',
          };
        }
      }
    } catch {}
  }

  return null;
}

/**
 * 2º CONTINGÊNCIA: Consulta na API BomJawaKit (GET /api/v1/produtos/{barcode})
 */
export async function consultarApenasBomJawaKitPorCodigo(
  barcode: string
): Promise<ProdutoNormalizadoBomJawaKit | null> {
  const cleanCode = (barcode || '').trim();
  if (!cleanCode) return null;

  const apiKey = getBomJawaKitApiKey();

  // 1. Detalhe direto: GET /api/v1/produtos/{barcode}
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5500);

    const res = await fetch(
      `${BOMJAWAKIT_API_BASE}/api/v1/produtos/${encodeURIComponent(cleanCode)}`,
      {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'X-API-Key': apiKey,
          Accept: 'application/json',
        },
      }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const item: BomJawaKitProdutoRaw = await res.json();
      if (item && item.nome) {
        return normalizarProdutoBomJawaKit(item);
      }
    }
  } catch (err) {
    console.warn('Aviso ao consultar detalhe de produto na API BomJawaKit:', err);
  }

  // 2. Busca parcial por barcode: GET /api/v1/produtos?barcode={cleanCode}&limit=5
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5500);

    const resLista = await fetch(
      `${BOMJAWAKIT_API_BASE}/api/v1/produtos?barcode=${encodeURIComponent(cleanCode)}&limit=5`,
      {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'X-API-Key': apiKey,
          Accept: 'application/json',
        },
      }
    );
    clearTimeout(timeout);

    if (resLista.ok) {
      const dados = await resLista.json();
      const itens: BomJawaKitProdutoRaw[] = Array.isArray(dados?.itens) ? dados.itens : [];
      if (itens.length > 0) {
        const exato = itens.find((i) => String(i.barcode) === cleanCode) || itens[0];
        return normalizarProdutoBomJawaKit(exato);
      }
    }
  } catch (err) {
    console.warn('Aviso ao buscar barcode parcial na API BomJawaKit:', err);
  }

  return null;
}

/**
 * Consulta Inteligente em Conjunto:
 * 1º Roda PRIMEIRO a API Bluesoft Cosmos (Token: 2Vu6HJqH8130Bk_YhL8Osg).
 * 2º Caso a Bluesoft Cosmos exceda o limite (429) ou não tenha o produto, aciona automaticamente a API BomJawaKit.
 * 3º Se encontrar na Bluesoft Cosmos mas faltar categoria/NCM/foto, complementa com a BomJawaKit.
 */
export async function consultarProdutoBomJawaKitPorCodigo(
  barcode: string
): Promise<ProdutoNormalizadoBomJawaKit | null> {
  const cleanCode = (barcode || '').trim();
  if (!cleanCode) return null;

  if (cachePorCodigoMemoria.has(cleanCode)) {
    return cachePorCodigoMemoria.get(cleanCode)!;
  }

  // 1º PRIORIDADE MÁXIMA: API Bluesoft Cosmos
  const resultadoCosmos = await consultarProdutoCosmosBluesoftPorCodigo(cleanCode);

  if (resultadoCosmos && resultadoCosmos.nomeProduto) {
    // Se a Bluesoft Cosmos trouxe tudo (nome, marca, categoria e foto), retorna imediatamente!
    if (resultadoCosmos.categoria && resultadoCosmos.fotoUrl) {
      cachePorCodigoMemoria.set(cleanCode, resultadoCosmos);
      return resultadoCosmos;
    }

    // Se faltou categoria ou NCM na Bluesoft Cosmos, tenta complementar silenciosamente na BomJawaKit
    try {
      const complementoBomJawa = await consultarApenasBomJawaKitPorCodigo(cleanCode);
      if (complementoBomJawa) {
        const combinado = {
          ...resultadoCosmos,
          marca: resultadoCosmos.marca || complementoBomJawa.marca || '',
          categoria: resultadoCosmos.categoria || complementoBomJawa.categoria || '',
          ncm: resultadoCosmos.ncm || complementoBomJawa.ncm || '',
          fotoUrl: complementoBomJawa.temImagem
            ? complementoBomJawa.fotoUrl
            : resultadoCosmos.fotoUrl || complementoBomJawa.fotoUrl,
          temImagem: Boolean(complementoBomJawa.temImagem || resultadoCosmos.temImagem),
          fonte: 'Bluesoft Cosmos + BomJawaKit (Integrado)',
        };
        cachePorCodigoMemoria.set(cleanCode, combinado);
        return combinado;
      }
    } catch {}

    cachePorCodigoMemoria.set(cleanCode, resultadoCosmos);
    return resultadoCosmos;
  }

  // 2º CONTINGÊNCIA AUTOMÁTICA: Se não tinha na Bluesoft Cosmos ou se a Bluesoft excedeu o limite, busca na BomJawaKit
  const resultadoBomJawa = await consultarApenasBomJawaKitPorCodigo(cleanCode);
  if (resultadoBomJawa && resultadoBomJawa.nomeProduto) {
    cachePorCodigoMemoria.set(cleanCode, resultadoBomJawa);
    return resultadoBomJawa;
  }

  return null;
}

/**
 * Busca de lista de produtos na API Oficial Bluesoft Cosmos (GET /products?query={query}&page={page})
 * Usa chamada direta + fallback via Serverless/Backend (/api/buscar-produtos-externos)
 */
export async function buscarProdutosCosmosBluesoft(
  query: string,
  page: number = 1
): Promise<ProdutoNormalizadoBomJawaKit[]> {
  const cleanQuery = (query || '').trim();
  if (!cleanQuery) return [];

  const cosmosToken = getCosmosBluesoftToken();

  // 1. Tenta chamada direta à API REST Oficial Bluesoft Cosmos
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5500);

    const url = `${COSMOS_BLUESOFT_API_BASE}/products?query=${encodeURIComponent(cleanQuery)}&page=${page}`;
    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'X-Cosmos-Token': cosmosToken,
        'Content-Type': 'application/json',
        'User-Agent': 'Cosmos-API-Request',
        Accept: 'application/json',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const listaRaw: CosmosBluesoftProdutoRaw[] = Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data)
        ? data
        : [];
      if (listaRaw.length > 0) {
        return listaRaw
          .filter((item) => item && item.description)
          .map(normalizarProdutoCosmosBluesoft);
      }
    }
  } catch {
    // Em navegadores onde o CORS bloqueia api.cosmos.bluesoft.com.br, usa a rota Serverless/Backend abaixo
  }

  // 2. Chama rota Serverless/Backend (/api/buscar-produtos-externos) com onlyCosmos=true
  if (typeof window !== 'undefined') {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6500);

      const resServer = await fetch('/api/buscar-produtos-externos', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: cleanQuery,
          page,
          cosmosToken,
          onlyCosmos: true,
        }),
      });
      clearTimeout(timeout);

      const cType = resServer.headers.get('content-type') || '';
      if (resServer.ok && cType.includes('application/json')) {
        const jsonServer = await resServer.json();
        if (Array.isArray(jsonServer?.produtos) && jsonServer.produtos.length > 0) {
          return jsonServer.produtos.map((p: any) => ({
            ean: String(p.ean || ''),
            nomeProduto: String(p.nomeProduto || ''),
            marca: String(p.marca || ''),
            categoria: String(p.categoria || ''),
            fotoUrl: String(p.fotoUrl || construirUrlImagemCosmos(String(p.ean || ''))),
            ncm: String(p.ncm || ''),
            descricao: String(p.descricao || ''),
            temImagem: Boolean(p.fotoUrl),
            fonte: String(p.fonte || 'API Bluesoft Cosmos (cosmos.bluesoft.com.br)'),
          }));
        }
      }
    } catch {}
  }

  return [];
}

export interface OpcoesBuscaBomJawaKit {
  query?: string;
  categoria?: string;
  comImagem?: boolean;
  page?: number;
  limit?: number;
  forcarAtualizacao?: boolean;
  catalogoLocalExtra?: Array<{
    codigo: string;
    nome: string;
    marca?: string;
    categoria?: string;
    imagem?: string;
    foto?: string;
  }>;
}

// ============================================================================
// CACHE PERSISTENTE EM MEMÓRIA + INDEXEDDB (ZERO REQUISIÇÕES REPETIDAS)
// ============================================================================
interface EntradaCacheConsulta {
  produtos: ProdutoNormalizadoBomJawaKit[];
  totalRemoto: number;
  timestamp: number;
}

const cacheConsultasMemoria = new Map<string, EntradaCacheConsulta>();
const cachePorCodigoMemoria = new Map<string, ProdutoNormalizadoBomJawaKit>();
let cacheCategoriasMemoria: BomJawaKitCategoria[] | null = null;
const CACHE_DB_NAME = 'EstoqueMobileApiCacheDB';
const CACHE_STORE_CONSULTAS = 'consultas_api';
const CACHE_STORE_META = 'meta_api';

function abrirCacheApiDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(CACHE_DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(CACHE_STORE_CONSULTAS)) {
          db.createObjectStore(CACHE_STORE_CONSULTAS);
        }
        if (!db.objectStoreNames.contains(CACHE_STORE_META)) {
          db.createObjectStore(CACHE_STORE_META);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function lerConsultaCachePersistente(chave: string): Promise<EntradaCacheConsulta | null> {
  if (cacheConsultasMemoria.has(chave)) {
    return cacheConsultasMemoria.get(chave)!;
  }
  const db = await abrirCacheApiDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(CACHE_STORE_CONSULTAS, 'readonly');
      const store = tx.objectStore(CACHE_STORE_CONSULTAS);
      const req = store.get(chave);
      req.onsuccess = () => {
        const val = req.result as EntradaCacheConsulta | undefined;
        if (val && Array.isArray(val.produtos) && val.produtos.length > 0) {
          cacheConsultasMemoria.set(chave, val);
          val.produtos.forEach((p) => {
            if (p.ean) cachePorCodigoMemoria.set(p.ean, p);
          });
          resolve(val);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function salvarConsultaCachePersistente(chave: string, entrada: EntradaCacheConsulta): Promise<void> {
  cacheConsultasMemoria.set(chave, entrada);
  entrada.produtos.forEach((p) => {
    if (p.ean) cachePorCodigoMemoria.set(p.ean, p);
  });
  const db = await abrirCacheApiDB();
  if (!db) return;
  try {
    const tx = db.transaction(CACHE_STORE_CONSULTAS, 'readwrite');
    tx.objectStore(CACHE_STORE_CONSULTAS).put(entrada, chave);
  } catch {}
}

function normalizarTextoComparacao(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// ============================================================================
// CATÁLOGO COMPLETO OFFLINE (+13.300 PRODUTOS E 31 CATEGORIAS SALVOS LOCALMENTE)
// ============================================================================
export interface ItemCatalogoOffline {
  ean: string;
  nomeProduto: string;
  marca: string;
  categoria: string;
  categoriaSlug: string;
  fotoUrl: string;
  ncm: string;
  fonte: string;
}

let catalogoOfflineMemoria: {
  categorias: BomJawaKitCategoria[];
  produtos: ItemCatalogoOffline[];
} | null = null;

let carregandoCatalogoOfflinePromessa: Promise<{
  categorias: BomJawaKitCategoria[];
  produtos: ItemCatalogoOffline[];
}> | null = null;

export async function carregarCatalogoOfflineJSON(): Promise<{
  categorias: BomJawaKitCategoria[];
  produtos: ItemCatalogoOffline[];
}> {
  if (catalogoOfflineMemoria && catalogoOfflineMemoria.produtos.length > 0) {
    return catalogoOfflineMemoria;
  }
  if (carregandoCatalogoOfflinePromessa) {
    return carregandoCatalogoOfflinePromessa;
  }

  carregandoCatalogoOfflinePromessa = (async () => {
    try {
      const res = await fetch('/catalogo-api-offline.json');
      if (res.ok) {
        const data = await res.json();
        catalogoOfflineMemoria = {
          categorias: data.categorias || [],
          produtos: Array.isArray(data.produtos) ? data.produtos : [],
        };
        cacheCategoriasMemoria = catalogoOfflineMemoria.categorias;
        return catalogoOfflineMemoria;
      }
    } catch (e) {
      console.warn('Catálogo offline local ainda não disponível, usando fallback dinâmico:', e);
    }
    return { categorias: [], produtos: [] };
  })();

  const resultado = await carregandoCatalogoOfflinePromessa;
  carregandoCatalogoOfflinePromessa = null;
  return resultado;
}

/**
 * Obtém estatísticas do Catálogo Offline e produtos pendentes para sincronização ao Firebase
 */
export async function obterEstatisticasCatalogoOffline(codigosJaNoBanco: Set<string> | string[]): Promise<{
  totalOffline: number;
  totalPendentes: number;
  totalJaNoBanco: number;
}> {
  const offline = await carregarCatalogoOfflineJSON();
  const setExistentes = codigosJaNoBanco instanceof Set ? codigosJaNoBanco : new Set(codigosJaNoBanco);
  const pendentes = offline.produtos.filter((p) => !setExistentes.has(p.ean));
  return {
    totalOffline: offline.produtos.length,
    totalPendentes: pendentes.length,
    totalJaNoBanco: setExistentes.size,
  };
}

/**
 * Retorna o próximo lote de produtos pendentes (ex: 1.000 itens) para o Dono do App enviar ao Firestore
 */
export async function obterProximoLoteParaFirestore(
  codigosJaNoBanco: Set<string> | string[],
  tamanhoLote = 1000
): Promise<ItemCatalogoOffline[]> {
  const offline = await carregarCatalogoOfflineJSON();
  const setExistentes = codigosJaNoBanco instanceof Set ? codigosJaNoBanco : new Set(codigosJaNoBanco);
  const pendentes = offline.produtos.filter((p) => !setExistentes.has(p.ean));
  return pendentes.slice(0, tamanhoLote);
}

/**
 * Busca produtos priorizando o Catálogo Geral Offline (+13.300 produtos já baixados localmente)
 * com 0 requisições externas e garantindo que produtos já cadastrados saiam da lista.
 */
export async function buscarProdutosBomJawaKit(opcoes: OpcoesBuscaBomJawaKit): Promise<{
  produtos: ProdutoNormalizadoBomJawaKit[];
  total: number;
  page: number;
  query: string;
  veioDoCache?: boolean;
  totalEmCache?: number;
}> {
  const rawQuery = (opcoes.query || '').trim();
  const page = opcoes.page && opcoes.page > 0 ? opcoes.page : 1;
  const pageSize = opcoes.limit && opcoes.limit <= 100 ? opcoes.limit : 24;
  const catSelecionada = (opcoes.categoria || '').trim();
  const termoNorm = normalizarTextoComparacao(rawQuery);

  // Conjunto de códigos que o usuário já tem no estoque/banco central (devem sair da lista)
  const codigosUsuario = new Set<string>();
  if (Array.isArray(opcoes.catalogoLocalExtra)) {
    opcoes.catalogoLocalExtra.forEach((p) => {
      if (p.codigo) codigosUsuario.add(String(p.codigo).trim());
    });
  }

  // 1. CARREGAMENTO DO CATÁLOGO GERAL OFFLINE (13.357 produtos locais com 0 requisições!)
  const offline = await carregarCatalogoOfflineJSON();
  if (offline.produtos.length > 0) {
    const listaFiltradaOffline = offline.produtos.filter((p) => {
      // 1. Se o usuário já tem o produto no banco dele, SAI DA LISTA
      if (codigosUsuario.has(p.ean)) return false;

      // 2. Filtro por Categoria / Slug
      if (catSelecionada) {
        const bateSlug = p.categoriaSlug === catSelecionada;
        const bateNomeCat = normalizarTextoComparacao(p.categoria).includes(normalizarTextoComparacao(catSelecionada));
        if (!bateSlug && !bateNomeCat) return false;
      }

      // 3. Filtro por Termo de Busca (Nome, Marca ou EAN)
      if (termoNorm) {
        const nomeNorm = normalizarTextoComparacao(p.nomeProduto);
        const marcaNorm = normalizarTextoComparacao(p.marca);
        const catNorm = normalizarTextoComparacao(p.categoria);
        const bateu =
          p.ean.includes(termoNorm) ||
          nomeNorm.includes(termoNorm) ||
          marcaNorm.includes(termoNorm) ||
          catNorm.includes(termoNorm);
        if (!bateu) return false;
      }

      return true;
    });

    const inicio = (page - 1) * pageSize;
    const fim = inicio + pageSize;
    const paginados = listaFiltradaOffline.slice(inicio, fim).map((p) => ({
      ean: p.ean,
      nomeProduto: p.nomeProduto,
      marca: p.marca || '',
      categoria: p.categoria || 'Geral',
      fotoUrl: p.fotoUrl,
      ncm: p.ncm || '',
      descricao: p.nomeProduto,
      temImagem: true,
      fonte: 'Catálogo Offline Local (0 requisições gastas)',
    }));

    // Retorna SEMPRE os produtos filtrados do acervo local (mesmo que sejam 0 resultados encontrados para a busca)
    return {
      produtos: paginados,
      total: listaFiltradaOffline.length,
      page,
      query: rawQuery,
      veioDoCache: true,
      totalEmCache: listaFiltradaOffline.length,
    };
  }

  // 2. Fallback remoto de contingência (somente se o catálogo offline ainda não foi baixado)
  const BATCH_SIZE_UNICA_REQUISICAO = 200;
  const batchIndex = Math.floor(((page - 1) * pageSize) / BATCH_SIZE_UNICA_REQUISICAO);
  const batchOffset = batchIndex * BATCH_SIZE_UNICA_REQUISICAO;
  const catNormalizada = catSelecionada;
  const comImg = opcoes.comImagem;
  const isNumericBarcode = /^\d{6,14}$/.test(rawQuery);
  const chaveCache = `bjk_${termoNorm || 'all'}_${catNormalizada || 'all'}_b${batchIndex}`;
  let totalBomJawa = 0;
  const eansAdicionados = new Set<string>();
  const listaCombinada: ProdutoNormalizadoBomJawaKit[] = [];

  const apiKey = getBomJawaKitApiKey();
  const executarFetchBomJawa = async (params: URLSearchParams) => {
    const url = `${BOMJAWAKIT_API_BASE}/api/v1/produtos?${params.toString()}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8500);

    try {
      const r = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'X-API-Key': apiKey,
          Accept: 'application/json',
        },
      });
      clearTimeout(timeout);
      if (!r.ok) return { total: 0, itens: [] as BomJawaKitProdutoRaw[] };
      const json = await r.json();
      return {
        total: Number(json?.total || 0),
        itens: (Array.isArray(json?.itens) ? json.itens : []) as BomJawaKitProdutoRaw[],
      };
    } catch {
      clearTimeout(timeout);
      return { total: 0, itens: [] as BomJawaKitProdutoRaw[] };
    }
  };

  try {
    const baseParams = new URLSearchParams();
    baseParams.set('limit', String(BATCH_SIZE_UNICA_REQUISICAO));
    baseParams.set('offset', String(batchOffset));

    if (catNormalizada) {
      baseParams.set('categoria', catNormalizada);
    }
    if (comImg === true) {
      baseParams.set('com_imagem', 'true');
    }

    if (rawQuery) {
      if (isNumericBarcode) {
        baseParams.set('barcode', rawQuery);
      } else {
        const qSemAcento = rawQuery
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();
        baseParams.set('q', qSemAcento);
      }
    }

    let resultadoBJ = await executarFetchBomJawa(baseParams);

    if (resultadoBJ.itens.length === 0 && rawQuery && !isNumericBarcode && rawQuery.includes(' ')) {
      const paramsHifen = new URLSearchParams(baseParams);
      paramsHifen.set(
        'q',
        rawQuery
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim()
          .replace(/\s+/g, '-')
      );
      resultadoBJ = await executarFetchBomJawa(paramsHifen);
    }

    if (resultadoBJ.itens.length === 0 && comImg === true && rawQuery) {
      const paramsSemFiltroImg = new URLSearchParams(baseParams);
      paramsSemFiltroImg.delete('com_imagem');
      resultadoBJ = await executarFetchBomJawa(paramsSemFiltroImg);
    }

    totalBomJawa = resultadoBJ.total;
    const normalizadosBJ = resultadoBJ.itens.map(normalizarProdutoBomJawaKit);

    for (const itemBJ of normalizadosBJ) {
      const chave = itemBJ.ean || itemBJ.nomeProduto;
      if (chave && !eansAdicionados.has(chave)) {
        listaCombinada.push(itemBJ);
        eansAdicionados.add(chave);
      }
    }
  } catch (err) {
    console.warn('Erro ao consultar lote de produtos na API BomJawaKit:', err);
  }

  // Só aciona a Bluesoft Cosmos se a busca acima não retornou produtos (economizando requisições!)
  if (listaCombinada.length === 0 && rawQuery && !catNormalizada) {
    try {
      let resultadosCosmos: ProdutoNormalizadoBomJawaKit[] = [];
      if (isNumericBarcode) {
        const itemUnico = await consultarProdutoCosmosBluesoftPorCodigo(rawQuery);
        if (itemUnico) resultadosCosmos = [itemUnico];
      } else {
        resultadosCosmos = await buscarProdutosCosmosBluesoft(rawQuery, page);
      }

      for (const itemC of resultadosCosmos) {
        const chave = itemC.ean || itemC.nomeProduto;
        if (chave && !eansAdicionados.has(chave)) {
          listaCombinada.push(itemC);
          eansAdicionados.add(chave);
        }
      }
    } catch (err) {
      console.warn('Aviso ao consultar Bluesoft Cosmos:', err);
    }
  }

  // Mescla com o cache anterior (caso esteja carregando a partir do item 201+) e persiste no IndexedDB
  const cacheAnterior = await lerConsultaCachePersistente(chaveCache);
  let listaAcumulada = listaCombinada;
  if (batchIndex > 0 && cacheAnterior && cacheAnterior.produtos.length > 0) {
    const mapaAcumulado = new Map<string, ProdutoNormalizadoBomJawaKit>();
    cacheAnterior.produtos.forEach((p) => mapaAcumulado.set(p.ean || p.nomeProduto, p));
    listaCombinada.forEach((p) => mapaAcumulado.set(p.ean || p.nomeProduto, p));
    listaAcumulada = Array.from(mapaAcumulado.values());
  }

  const totalFinal = Math.max(totalBomJawa, listaAcumulada.length);

  if (listaAcumulada.length > 0) {
    await salvarConsultaCachePersistente(chaveCache, {
      produtos: listaAcumulada,
      totalRemoto: totalFinal,
      timestamp: Date.now(),
    });
  }

  const inicio = (page - 1) * pageSize;
  const fim = inicio + pageSize;

  return {
    produtos: listaAcumulada.slice(inicio, fim),
    total: totalFinal,
    page,
    query: rawQuery,
    veioDoCache: false,
    totalEmCache: listaAcumulada.length,
  };
}

/**
 * Lista todas as categorias disponíveis na API BomJawaKit com cache permanente
 * Endpoint: GET /api/v1/categorias
 */
export async function listarCategoriasBomJawaKit(): Promise<BomJawaKitCategoria[]> {
  if (cacheCategoriasMemoria && cacheCategoriasMemoria.length > 0) {
    return cacheCategoriasMemoria;
  }

  // 1. Tenta carregar as categorias do catálogo offline (0 requisições)
  try {
    const offline = await carregarCatalogoOfflineJSON();
    if (offline.categorias && offline.categorias.length > 0) {
      cacheCategoriasMemoria = offline.categorias;
      return offline.categorias;
    }
  } catch {}

  // Tenta ler do localStorage primeiro para não gastar requisição ao reabrir o modal
  if (typeof window !== 'undefined') {
    try {
      const salvo = localStorage.getItem('cache_categorias_bomjawakit_v1');
      if (salvo) {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cacheCategoriasMemoria = parsed;
          return parsed;
        }
      }
    } catch {}
  }

  try {
    const r = await fetch(`${BOMJAWAKIT_API_BASE}/api/v1/categorias`, {
      method: 'GET',
      headers: {
        'X-API-Key': getBomJawaKitApiKey(),
        Accept: 'application/json',
      },
    });
    if (!r.ok) return [];
    const dados = await r.json();
    if (Array.isArray(dados) && dados.length > 0) {
      cacheCategoriasMemoria = dados;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('cache_categorias_bomjawakit_v1', JSON.stringify(dados));
        } catch {}
      }
      return dados;
    }
    return [];
  } catch (err) {
    console.warn('Erro ao listar categorias da API BomJawaKit:', err);
    return [];
  }
}
