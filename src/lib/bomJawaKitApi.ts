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

  // 1º PRIORIDADE MÁXIMA: API Bluesoft Cosmos
  const resultadoCosmos = await consultarProdutoCosmosBluesoftPorCodigo(cleanCode);

  if (resultadoCosmos && resultadoCosmos.nomeProduto) {
    // Se a Bluesoft Cosmos trouxe tudo (nome, marca, categoria e foto), retorna imediatamente!
    if (resultadoCosmos.categoria && resultadoCosmos.fotoUrl) {
      return resultadoCosmos;
    }

    // Se faltou categoria ou NCM na Bluesoft Cosmos, tenta complementar silenciosamente na BomJawaKit
    try {
      const complementoBomJawa = await consultarApenasBomJawaKitPorCodigo(cleanCode);
      if (complementoBomJawa) {
        return {
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
      }
    } catch {}

    return resultadoCosmos;
  }

  // 2º CONTINGÊNCIA AUTOMÁTICA: Se não tinha na Bluesoft Cosmos ou se a Bluesoft excedeu o limite, busca na BomJawaKit
  const resultadoBomJawa = await consultarApenasBomJawaKitPorCodigo(cleanCode);
  if (resultadoBomJawa && resultadoBomJawa.nomeProduto) {
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
}

/**
 * Busca produtos paginados priorizando PRIMEIRO a API 1 (Bluesoft Cosmos) e em seguida a API 2 (BomJawaKit)
 * - Se a Bluesoft Cosmos exceder o limite ou não tiver todos os produtos, a BomJawaKit complementa automaticamente.
 */
export async function buscarProdutosBomJawaKit(opcoes: OpcoesBuscaBomJawaKit): Promise<{
  produtos: ProdutoNormalizadoBomJawaKit[];
  total: number;
  page: number;
  query: string;
}> {
  const rawQuery = (opcoes.query || '').trim();
  const page = opcoes.page && opcoes.page > 0 ? opcoes.page : 1;
  const limit = opcoes.limit && opcoes.limit <= 200 ? opcoes.limit : 24;
  const offset = (page - 1) * limit;
  const apiKey = getBomJawaKitApiKey();
  const isNumericBarcode = /^\d{4,}$/.test(rawQuery);

  const listaCombinada: ProdutoNormalizadoBomJawaKit[] = [];
  const eansAdicionados = new Set<string>();

  // 1º PRIORIDADE PRINCIPAL: Consultar PRIMEIRO a API Bluesoft Cosmos (quando houver termo de busca e sem filtro exclusivo de slug de categoria da BomJawaKit)
  if (rawQuery && !opcoes.categoria) {
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
      console.warn('Aviso ao consultar Bluesoft Cosmos na busca principal:', err);
    }
  }

  // 2º CONTINGÊNCIA E COMPLEMENTO: Consultar a API BomJawaKit para:
  // - Assumir integralmente caso a Bluesoft Cosmos tenha atingido o limite diário (listaCombinada vazia)
  // - Complementar com produtos que não existem na Bluesoft Cosmos ou quando filtrar por categoria específica
  let totalBomJawa = 0;

  const executarFetchBomJawa = async (params: URLSearchParams) => {
    const url = `${BOMJAWAKIT_API_BASE}/api/v1/produtos?${params.toString()}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7500);

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
    baseParams.set('limit', String(limit));
    baseParams.set('offset', String(offset));

    if (opcoes.categoria && opcoes.categoria.trim()) {
      baseParams.set('categoria', opcoes.categoria.trim());
    }
    if (opcoes.comImagem === true) {
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

    if (resultadoBJ.itens.length === 0 && opcoes.comImagem === true && rawQuery) {
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
    console.warn('Erro ao complementar busca com API BomJawaKit:', err);
  }

  return {
    produtos: listaCombinada,
    total: Math.max(totalBomJawa, listaCombinada.length),
    page,
    query: rawQuery,
  };
}

/**
 * Lista todas as categorias disponíveis na API BomJawaKit
 * Endpoint: GET /api/v1/categorias
 */
export async function listarCategoriasBomJawaKit(): Promise<BomJawaKitCategoria[]> {
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
    return Array.isArray(dados) ? dados : [];
  } catch (err) {
    console.warn('Erro ao listar categorias da API BomJawaKit:', err);
    return [];
  }
}
