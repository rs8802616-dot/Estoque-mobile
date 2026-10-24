// Vercel Serverless Function: /api/buscar-produtos-externos
// Executa a busca de produtos combinando API 1 (BomJawaKit) + API 2 (Bluesoft Cosmos API)

const BOMJAWAKIT_API_BASE = 'https://produtos.bomjawakit.com.br';
const BOMJAWAKIT_API_KEY = 'sk_VZvKYX-ldCakrfALLxpzKPvmRUoawNN7hewD678CvGU';
const BOMJAWAKIT_R2_CDN = 'https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev';

const COSMOS_API_BASE = 'https://api.cosmos.bluesoft.com.br';
const COSMOS_TOKEN = '2Vu6HJqH8130Bk_YhL8Osg';
const COSMOS_CDN = 'https://cdn-cosmos.bluesoft.com.br/products';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, X-Cosmos-Token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const query = String(body.query || req.query?.query || '').trim();
    const page = Number(body.page || req.query?.page || 1) || 1;
    const cosmosToken = body.cosmosToken || process.env.COSMOS_TOKEN || COSMOS_TOKEN;
    const preferFallback = Boolean(body.preferFallback);

    if (!query) {
      return res.status(400).json({ error: 'Termo de busca não informado', produtos: [] });
    }

    // 1. Se não for chamada explícita de fallback, tenta primeiro na API 1 (BomJawaKit)
    if (!preferFallback) {
      try {
        const qSemAcento = query
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();
        const isNum = /^\d{4,}$/.test(query);
        const paramKey = isNum ? 'barcode' : 'q';
        const offset = (page - 1) * 24;
        const urlBomJawa = `${BOMJAWAKIT_API_BASE}/api/v1/produtos?${paramKey}=${encodeURIComponent(
          qSemAcento
        )}&limit=24&offset=${offset}`;

        const r1 = await fetch(urlBomJawa, {
          headers: {
            'X-API-Key': BOMJAWAKIT_API_KEY,
            Accept: 'application/json',
          },
        });
        if (r1.ok) {
          const j1 = await r1.json();
          const itens = Array.isArray(j1?.itens) ? j1.itens : [];
          if (itens.length > 0) {
            const produtos = itens.map((item) => {
              const barcode = String(item.barcode || '').trim();
              const temImg = Boolean(item.tem_imagem);
              return {
                ean: barcode,
                nomeProduto: String(item.nome || '').replace(/\|\|.*$/g, '').trim(),
                marca: String(item.dados?.marca || '').trim(),
                categoria: String(item.categoria || '')
                  .replace(/^Carrefour\s*-\s*Mercearia\s*-\s*/i, '')
                  .replace(/^Carrefour\s*-\s*/i, '')
                  .replace(/^Amig[aã]o\s*-\s*/i, '')
                  .trim(),
                fotoUrl: temImg ? `${BOMJAWAKIT_R2_CDN}/${barcode}.png` : `${COSMOS_CDN}/${barcode}`,
                ncm:
                  item.ncm && !String(item.ncm).toLowerCase().includes('não disponível')
                    ? String(item.ncm).trim()
                    : '',
                fonte: 'API BomJawaKit (produtos.bomjawakit.com.br)',
              };
            });
            return res.status(200).json({
              produtos,
              total: Number(j1?.total || produtos.length),
              page,
              query,
            });
          }
        }
      } catch {}
    }

    // 2. API 2: Bluesoft Cosmos API Oficial (https://api.cosmos.bluesoft.com.br/products?query=...)
    try {
      const rCosmos = await fetch(
        `${COSMOS_API_BASE}/products?query=${encodeURIComponent(query)}&page=${page}`,
        {
          headers: {
            'X-Cosmos-Token': cosmosToken,
            'Content-Type': 'application/json',
            'User-Agent': 'Cosmos-API-Request',
            Accept: 'application/json',
          },
        }
      );

      if (rCosmos.ok) {
        const jCosmos = await rCosmos.json();
        const listaRaw = Array.isArray(jCosmos?.products)
          ? jCosmos.products
          : Array.isArray(jCosmos)
          ? jCosmos
          : [];
        if (listaRaw.length > 0) {
          const produtos = listaRaw.map((item) => {
            const gtin = String(item.gtin || '').trim();
            const thumb = String(item.thumbnail || '').trim();
            return {
              ean: gtin,
              nomeProduto: String(item.description || '').trim(),
              marca: String(item.brand?.name || '').trim(),
              categoria: String(item.gpc?.description || item.ncm?.description || '').trim(),
              fotoUrl: thumb && !thumb.includes('default') ? thumb : `${COSMOS_CDN}/${gtin}`,
              ncm: String(item.ncm?.code || '').trim(),
              fonte: 'API Bluesoft Cosmos (cosmos.bluesoft.com.br)',
            };
          });
          return res.status(200).json({
            produtos,
            total: Number(jCosmos?.total_count || produtos.length),
            page,
            query,
          });
        }
      }
    } catch {}

    return res.status(200).json({ produtos: [], total: 0, page, query });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Erro ao buscar produtos', produtos: [] });
  }
}
