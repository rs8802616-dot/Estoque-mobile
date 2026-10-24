// Vercel Serverless Function: /api/consultar-produto-codigo
// Roda em Node.js na Vercel (sem restrição de CORS do navegador)
// Ordem de Prioridade:
// 1º PRIORIDADE PRINCIPAL (API 1): Bluesoft Cosmos (https://api.cosmos.bluesoft.com.br/gtins/{ean}.json) - X-Cosmos-Token: 2Vu6HJqH8130Bk_YhL8Osg
// 2º CONTINGÊNCIA / COMPLEMENTO (API 2): BomJawaKit (https://produtos.bomjawakit.com.br/api/v1) - X-API-Key

const COSMOS_API_BASE = 'https://api.cosmos.bluesoft.com.br';
const COSMOS_TOKEN = '2Vu6HJqH8130Bk_YhL8Osg';
const COSMOS_CDN = 'https://cdn-cosmos.bluesoft.com.br/products';

const BOMJAWAKIT_API_BASE = 'https://produtos.bomjawakit.com.br';
const BOMJAWAKIT_API_KEY = 'sk_VZvKYX-ldCakrfALLxpzKPvmRUoawNN7hewD678CvGU';
const BOMJAWAKIT_R2_CDN = 'https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev';

async function consultarCosmosApi(ean, customToken) {
  const token = (customToken && customToken.trim()) || process.env.COSMOS_TOKEN || COSMOS_TOKEN;
  const cleanEan = String(ean || '').replace(/\D/g, '');
  if (!cleanEan) return null;

  // 1. API Oficial Bluesoft Cosmos (X-Cosmos-Token)
  try {
    const res = await fetch(`${COSMOS_API_BASE}/gtins/${encodeURIComponent(cleanEan)}.json`, {
      headers: {
        'X-Cosmos-Token': token,
        'Content-Type': 'application/json',
        'User-Agent': 'Cosmos-API-Request',
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const item = await res.json();
      if (item && item.description) {
        const thumb = String(item.thumbnail || '').trim();
        const fotoUrl =
          thumb && !thumb.includes('default') && !thumb.includes('no-image')
            ? thumb
            : `${COSMOS_CDN}/${cleanEan}`;

        return {
          nomeProduto: String(item.description || '').trim(),
          marca: String(item.brand?.name || '').trim(),
          categoria: String(item.gpc?.description || item.ncm?.description || '').trim(),
          fotoUrl,
          ncm: String(item.ncm?.code || '').trim(),
          descricao: String(item.ncm?.full_description || item.description || '').trim(),
          fonte: 'API Bluesoft Cosmos (cosmos.bluesoft.com.br)',
        };
      }
    }
  } catch {}

  // 2. Fallback direto Bluesoft Cosmos Web caso o limite diário do token (429) tenha sido atingido
  try {
    const webRes = await fetch(`https://cosmos.bluesoft.com.br/produtos/${cleanEan}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
    });
    if (webRes.ok) {
      const html = await webRes.text();
      if (html && !html.includes('404 Not Found')) {
        const matchNome =
          html.match(/id=["']product_description["'][^>]*>([\s\S]*?)<\/h1>/i) ||
          html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);
        const nome = matchNome
          ? matchNome[1]
              .replace(/<[^>]+>/g, '')
              .replace(/\|\s*Cosmos.*$/i, '')
              .replace(/-\s*Cosmos.*$/i, '')
              .trim()
          : '';
        if (nome && nome.length > 2) {
          const matchMarca = html.match(/href=["']\/marcas\/[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
          const matchCat = html.match(/href=["']\/gpc\/[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
          const matchNcm = html.match(/href=["']\/ncms\/[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
          return {
            nomeProduto: nome,
            marca: matchMarca ? matchMarca[1].replace(/<[^>]+>/g, '').trim() : '',
            categoria: matchCat ? matchCat[1].replace(/<[^>]+>/g, '').trim() : '',
            fotoUrl: `${COSMOS_CDN}/${cleanEan}`,
            ncm: matchNcm ? matchNcm[1].replace(/<[^>]+>/g, '').split('-')[0].trim() : '',
            descricao: nome,
            fonte: 'Bluesoft Cosmos (cosmos.bluesoft.com.br)',
          };
        }
      }
    }
  } catch {}

  return null;
}

async function consultarBomJawaKit(ean) {
  try {
    const res = await fetch(`${BOMJAWAKIT_API_BASE}/api/v1/produtos/${encodeURIComponent(ean)}`, {
      headers: {
        'X-API-Key': BOMJAWAKIT_API_KEY,
        Accept: 'application/json',
      },
    });
    if (res.ok) {
      const item = await res.json();
      if (item && item.nome) {
        const barcode = String(item.barcode || ean).trim();
        const temImg = Boolean(item.tem_imagem);
        return {
          nomeProduto: String(item.nome || '').replace(/\|\|.*$/g, '').trim(),
          marca: String(item.dados?.marca || item.dados?.brand || '').trim(),
          categoria: String(item.categoria || '')
            .replace(/^Carrefour\s*-\s*Mercearia\s*-\s*/i, '')
            .replace(/^Carrefour\s*-\s*/i, '')
            .replace(/^Amig[aã]o\s*-\s*/i, '')
            .trim(),
          fotoUrl: temImg ? `${BOMJAWAKIT_R2_CDN}/${barcode}.png` : `${COSMOS_CDN}/${barcode}`,
          ncm: item.ncm && !String(item.ncm).toLowerCase().includes('não disponível') ? String(item.ncm).trim() : '',
          descricao: String(item.descricao || '').trim(),
          fonte: 'API BomJawaKit (produtos.bomjawakit.com.br)',
        };
      }
    }
  } catch {}
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, X-Cosmos-Token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const ean = String(body.ean || req.query?.ean || '').trim();
    const cosmosToken = body.cosmosToken || req.headers['x-cosmos-token'];
    const onlyCosmos = Boolean(body.onlyCosmos);

    if (!ean) {
      return res.status(400).json({ error: 'Código de barras não informado' });
    }

    // 1º PRIORIDADE PRINCIPAL: Bluesoft Cosmos API
    const prodCosmos = await consultarCosmosApi(ean, cosmosToken);
    if (prodCosmos && prodCosmos.nomeProduto) {
      return res.status(200).json(prodCosmos);
    }

    if (onlyCosmos) {
      return res.status(404).json({ error: 'Produto não encontrado no Bluesoft Cosmos' });
    }

    // 2º CONTINGÊNCIA: BomJawaKit API
    const prodBomJawa = await consultarBomJawaKit(ean);
    if (prodBomJawa && prodBomJawa.nomeProduto) {
      return res.status(200).json(prodBomJawa);
    }

    return res.status(404).json({ error: 'Produto não encontrado nas APIs' });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Erro interno ao consultar APIs' });
  }
}
