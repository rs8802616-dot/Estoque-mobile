// Cliente oficial da API BomJawaKit (https://produtos.bomjawakit.com.br/api/v1)
// Autenticação via header X-API-Key em todas as requisições

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

export function construirUrlImagemBomJawaKit(barcode: string, temImagem?: boolean): string {
  const clean = (barcode || '').trim();
  if (!clean || temImagem === false) return '';
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
  // Remove prefixos de varejistas como "Carrefour - Mercearia - " ou "Amigão - "
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
  const fotoUrl = temImg ? construirUrlImagemBomJawaKit(barcode, true) : '';

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
 * Consulta um produto pelo código de barras exato ou parcial na API BomJawaKit
 * Endpoint: GET /api/v1/produtos/{barcode}
 */
export async function consultarProdutoBomJawaKitPorCodigo(
  barcode: string
): Promise<ProdutoNormalizadoBomJawaKit | null> {
  const cleanCode = (barcode || '').trim();
  if (!cleanCode) return null;

  const apiKey = getBomJawaKitApiKey();

  // 1. Tenta endpoint direto de detalhe: GET /api/v1/produtos/{barcode}
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

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

  // 2. Fallback: busca parcial por barcode: GET /api/v1/produtos?barcode={cleanCode}&limit=5
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

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

export interface OpcoesBuscaBomJawaKit {
  query?: string;
  categoria?: string;
  comImagem?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Busca produtos paginados na API BomJawaKit
 * Endpoint: GET /api/v1/produtos
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

  const executarFetch = async (params: URLSearchParams) => {
    const url = `${BOMJAWAKIT_API_BASE}/api/v1/produtos?${params.toString()}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

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
        // Remove acentos conforme documentação da API ("Texto no nome (sem acento, 'contém')")
        const qSemAcento = rawQuery
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();
        baseParams.set('q', qSemAcento);
      }
    }

    let resultado = await executarFetch(baseParams);

    // Se a busca por texto com espaço ("Coca cola") retornou 0, tenta variação com hífen ("Coca-cola")
    if (resultado.itens.length === 0 && rawQuery && !isNumericBarcode && rawQuery.includes(' ')) {
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
    if (resultado.itens.length === 0 && opcoes.comImagem === true && rawQuery) {
      const paramsSemFiltroImg = new URLSearchParams(baseParams);
      paramsSemFiltroImg.delete('com_imagem');
      resultado = await executarFetch(paramsSemFiltroImg);
    }

    // Normaliza e prioriza itens que possuem imagem no topo
    const normalizados = resultado.itens.map(normalizarProdutoBomJawaKit);
    normalizados.sort((a, b) => Number(b.temImagem) - Number(a.temImagem));

    return {
      produtos: normalizados,
      total: resultado.total,
      page,
      query: rawQuery,
    };
  } catch (err) {
    console.warn('Erro ao buscar lista de produtos na API BomJawaKit:', err);
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
