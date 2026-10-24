// Motor Duplo de Consulta de Produtos (Dual-API Engine):
// 1. API Primária: BomJawaKit (https://produtos.bomjawakit.com.br/api/v1) - Header: X-API-Key
// 2. API Secundária / Contingência: Bluesoft Cosmos (https://api.cosmos.bluesoft.com.br) - Header: X-Cosmos-Token
// As duas APIs trabalham em conjunto: se uma atingir o limite (429/403) ou não tiver o produto/foto, a outra assume ou complementa os dados automaticamente.

export const BOMJAWAKIT_API_BASE = 'https://produtos.bomjawakit.com.br';
export const BOMJAWAKIT_DEFAULT_API_KEY = 'sk_VZvKYX-ldCakrfALLxpzKPvmRUoawNN7hewD678CvGU';
export const BOMJAWAKIT_R2_IMAGE_CDN = 'https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev';

export const COSMOS_BLUESOFT_API_BASE = 'https://api.cosmos.bluesoft.com.br';
export const COSMOS_BLUESOFT_DEFAULT_TOKEN = '2Vu6HJqH8130Bk_YhL8Osg';
export const COSMOS_BLUESOFT_CDN = 'https://cdn-cosmos.bluesoft.com.br/products';

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

export function construirUrlImagemBomJawaKit(barcode: string, temImagem?: boolean): string {
  const clean = (barcode || '').trim();
  if (!clean) return '';
  if (temImagem === false) {
    // Se não tem imagem no R2 da BomJawaKit, usa o CDN oficial da Bluesoft Cosmos como fallback
    return `${COSMOS_BLUESOFT_CDN}/${encodeURIComponent(clean)}`;
  }
  return `${BOMJAWAKIT_R2_IMAGE_CDN}/${encodeURIComponent(clean)}.png`;
}

export function construirUrlImagemCosmos(barcode: string): string {
  const clean = (barcode || '').trim().replace(/\D/g, '');
  if (!clean) return '';
  return `${COSMOS_BLUESOFT_CDN}/${encodeURIComponent(clean)}`;
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

/**
 * Consulta direta na API Oficial Bluesoft Cosmos (https://api.cosmos.bluesoft.com.br/gtins/{gtin}.json)
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
    const timeout = setTimeout(() => controller.abort(), 5500);

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
    // Em navegadores, caso haja bloqueio de CORS na chamada direta ao domínio api.cosmos.bluesoft.com.br,
    // prossegue automaticamente para a rota proxy do servidor/Vercel (/api/consultar-produto-codigo).
  }

  // 2. Fallback via Serverless/Backend Proxy (/api/consultar-produto-codigo) que consulta Cosmos no Node.js sem restrição de CORS
  if (typeof window !== 'undefined') {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6500);

      const resProxy = await fetch('/api/consultar-produto-codigo', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ean: cleanCode,
          cosmosToken,
          preferCosmos: true,
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
 * Busca de lista de produtos na API Oficial Bluesoft Cosmos (GET /products?query={query}&page={page})
 */
export async function buscarProdutosCosmosBluesoft(
  query: string,
  page: number = 1
): Promise<ProdutoNormalizadoBomJawaKit[]> {
  const cleanQuery = (query || '').trim();
  if (!cleanQuery) return [];

  const cosmosToken = getCosmosBluesoftToken();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

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
      return listaRaw
        .filter((item) => item && item.description)
        .map(normalizarProdutoCosmosBluesoft);
    }
  } catch {
    // Ignora falha de CORS no navegador e usa rota /api/buscar-produtos-externos
  }

  return [];
}

/**
 * Consulta Inteligente em Conjunto (BomJawaKit API + Bluesoft Cosmos API)
 * - Se não encontrar na API 1 ou se a API 1 exceder o limite, busca automaticamente na API 2 (Cosmos Bluesoft).
 * - Se encontrar na API 1 mas faltar marca/categoria/foto, complementa com a API 2.
 */
export async function consultarProdutoBomJawaKitPorCodigo(
  barcode: string
): Promise<ProdutoNormalizadoBomJawaKit | null> {
  const cleanCode = (barcode || '').trim();
  if (!cleanCode) return null;

  const apiKey = getBomJawaKitApiKey();
  let resultadoBomJawa: ProdutoNormalizadoBomJawaKit | null = null;

  // 1. Tenta endpoint direto da API 1 (BomJawaKit): GET /api/v1/produtos/{barcode}
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
        resultadoBomJawa = normalizarProdutoBomJawaKit(item);
      }
    }
  } catch (err) {
    console.warn('Aviso ao consultar detalhe de produto na API BomJawaKit:', err);
  }

  // 2. Se não achou exato na API 1, tenta busca parcial por barcode na API 1: GET /api/v1/produtos?barcode={cleanCode}&limit=5
  if (!resultadoBomJawa) {
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
          resultadoBomJawa = normalizarProdutoBomJawaKit(exato);
        }
      }
    } catch (err) {
      console.warn('Aviso ao buscar barcode parcial na API BomJawaKit:', err);
    }
  }

  // 3. Se a API 1 encontrou o produto completo (com nome e foto), mas sem marca, ou se não encontrou na API 1:
  // Aciona a API 2 (Bluesoft Cosmos) quando:
  // a) O produto NÃO foi encontrado na API 1 (ou a API 1 atingiu o limite 429)
  // b) O produto foi encontrado na API 1 mas veio sem marca ou sem categoria
  if (!resultadoBomJawa) {
    const resultadoCosmos = await consultarProdutoCosmosBluesoftPorCodigo(cleanCode);
    if (resultadoCosmos && resultadoCosmos.nomeProduto) {
      return resultadoCosmos;
    }
    return null;
  }

  // Se achou na BomJawaKit mas falta marca ou categoria, tenta enriquecer rapidamente com a Cosmos
  if (!resultadoBomJawa.marca || !resultadoBomJawa.categoria) {
    try {
      const complementoCosmos = await consultarProdutoCosmosBluesoftPorCodigo(cleanCode);
      if (complementoCosmos) {
        return {
          ...resultadoBomJawa,
          marca: resultadoBomJawa.marca || complementoCosmos.marca || '',
          categoria: resultadoBomJawa.categoria || complementoCosmos.categoria || '',
          ncm: resultadoBomJawa.ncm || complementoCosmos.ncm || '',
          fotoUrl: resultadoBomJawa.temImagem
            ? resultadoBomJawa.fotoUrl
            : complementoCosmos.fotoUrl || resultadoBomJawa.fotoUrl,
          fonte: 'BomJawaKit + Bluesoft Cosmos (Integrado)',
        };
      }
    } catch {}
  }

  return resultadoBomJawa;
}

export interface OpcoesBuscaBomJawaKit {
  query?: string;
  categoria?: string;
  comImagem?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Busca produtos paginados combinando API 1 (BomJawaKit) + API 2 (Bluesoft Cosmos)
 * Caso a API 1 atinja o limite ou não possua o produto pesquisado, a API 2 entra em ação automaticamente.
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

  let bomJawaFalhouOuLimite = false;

  const executarFetch = async (params: URLSearchParams) => {
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
      if (r.status === 429 || r.status === 403 || r.status === 401) {
        bomJawaFalhouOuLimite = true;
        return { total: 0, itens: [] as BomJawaKitProdutoRaw[] };
      }
      if (!r.ok) return { total: 0, itens: [] as BomJawaKitProdutoRaw[] };
      const json = await r.json();
      return {
        total: Number(json?.total || 0),
        itens: (Array.isArray(json?.itens) ? json.itens : []) as BomJawaKitProdutoRaw[],
      };
    } catch {
      clearTimeout(timeout);
      bomJawaFalhouOuLimite = true;
      return { total: 0, itens: [] as BomJawaKitProdutoRaw[] };
    }
  };

  try {
    const isNumericBarcode = /^\d{4,}$/.test(rawQuery);
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

    let resultado = await executarFetch(baseParams);

    // Se a busca por texto com espaço ("Coca cola") retornou 0, tenta variação com hífen ("Coca-cola")
    if (!bomJawaFalhouOuLimite && resultado.itens.length === 0 && rawQuery && !isNumericBarcode && rawQuery.includes(' ')) {
      const paramsHifen = new URLSearchParams(baseParams);
      paramsHifen.set(
        'q',
        rawQuery
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim()
          .replace(/\s+/g, '-')
      );
      resultado = await executarFetch(paramsHifen);
    }

    // Se estava com filtro com_imagem=true e mesmo assim deu 0, tenta sem restringir imagem
    if (!bomJawaFalhouOuLimite && resultado.itens.length === 0 && opcoes.comImagem === true && rawQuery) {
      const paramsSemFiltroImg = new URLSearchParams(baseParams);
      paramsSemFiltroImg.delete('com_imagem');
      resultado = await executarFetch(paramsSemFiltroImg);
    }

    const normalizados = resultado.itens.map(normalizarProdutoBomJawaKit);

    // CONTINGÊNCIA E COMPLEMENTO COM A API 2 (BLUESOFT COSMOS):
    // Se a API 1 atingiu o limite, falhou, ou retornou menos de 4 itens para a pesquisa do usuário,
    // consulta automaticamente a Bluesoft Cosmos e junta os resultados sem duplicar EAN!
    if ((bomJawaFalhouOuLimite || normalizados.length < 4) && rawQuery && !opcoes.categoria) {
      let itensCosmos: ProdutoNormalizadoBomJawaKit[] = [];

      if (isNumericBarcode) {
        const unicoCosmos = await consultarProdutoCosmosBluesoftPorCodigo(rawQuery);
        if (unicoCosmos) itensCosmos = [unicoCosmos];
      } else {
        itensCosmos = await buscarProdutosCosmosBluesoft(rawQuery, page);

        // Se no navegador o CORS bloqueou a busca direta no Cosmos, tenta via endpoint /api/buscar-produtos-externos
        if (itensCosmos.length === 0 && typeof window !== 'undefined') {
          try {
            const resServer = await fetch('/api/buscar-produtos-externos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: rawQuery,
                page,
                cosmosToken: getCosmosBluesoftToken(),
                preferFallback: true,
              }),
            });
            const cType = resServer.headers.get('content-type') || '';
            if (resServer.ok && cType.includes('application/json')) {
              const jsonServer = await resServer.json();
              if (Array.isArray(jsonServer?.produtos)) {
                itensCosmos = jsonServer.produtos.map((p: any) => ({
                  ean: String(p.ean || ''),
                  nomeProduto: String(p.nomeProduto || ''),
                  marca: String(p.marca || ''),
                  categoria: String(p.categoria || ''),
                  fotoUrl: String(p.fotoUrl || construirUrlImagemCosmos(String(p.ean || ''))),
                  ncm: String(p.ncm || ''),
                  descricao: String(p.descricao || ''),
                  temImagem: Boolean(p.fotoUrl),
                  fonte: String(p.fonte || 'API Bluesoft Cosmos'),
                }));
              }
            }
          } catch {}
        }
      }

      const eansExistentes = new Set(normalizados.map((p) => p.ean));
      for (const itemC of itensCosmos) {
        if (itemC.ean && !eansExistentes.has(itemC.ean)) {
          normalizados.push(itemC);
          eansExistentes.add(itemC.ean);
        }
      }
    }

    normalizados.sort((a, b) => Number(b.temImagem) - Number(a.temImagem));

    return {
      produtos: normalizados,
      total: Math.max(resultado.total, normalizados.length),
      page,
      query: rawQuery,
    };
  } catch (err) {
    console.warn('Erro ao buscar lista de produtos nas APIs:', err);
    return {
      produtos: [],
      total: 0,
      page,
      query: rawQuery,
    };
  }
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
