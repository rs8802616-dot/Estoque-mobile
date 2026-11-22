// Vercel Serverless Function / Express Handler: /api/si5
// Proxy seguro para consultas na API SI5 Global sem expor tokens no bundle do navegador.

const TIMEOUT_MS = 8500;

function getTokensServidor() {
  const raw = process.env.SI5_TOKENS || '';
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ erro: 'Método não permitido. Use GET.' });
  }

  const tokens = getTokensServidor();
  if (tokens.length === 0) {
    return res.status(503).json({
      erro: 'SI5_TOKENS não configurado no servidor.',
      produtos: [],
    });
  }

  const queryObj = req.query || {};
  const ean = String(queryObj.ean || '').replace(/\D/g, '').slice(0, 18);
  const termo = String(queryObj.q || '').trim().slice(0, 120);
  const page = Math.max(1, Number(queryObj.page || 1) || 1);

  if (!ean && termo.length < 3) {
    return res.status(400).json({ erro: 'Informe ?ean= válido ou ?q= com ao menos 3 caracteres.' });
  }

  const targetUrl = ean
    ? `https://global.si5.com.br/api/produtos/${encodeURIComponent(ean)}`
    : `https://global.si5.com.br/api/produtos?q=${encodeURIComponent(termo)}&page=${page}`;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const resp = await fetch(targetUrl, {
        method: 'GET',
        signal: ctrl.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      clearTimeout(timer);

      if (resp.status === 429 || resp.status === 401) {
        continue;
      }

      if (!resp.ok) {
        return res.status(resp.status).json({ erro: 'Produto não encontrado na SI5 Global.' });
      }

      const json = await resp.json();
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');

      if (ean) {
        if (json && (json.produto || json.codbar)) {
          return res.status(200).json({
            ean: String(json.codbar || ean).trim(),
            nomeProduto: String(json.produto || '').trim(),
            marca: String(json.marca || '').trim(),
            categoria: String(json.categoria || 'Geral').trim(),
            fotoUrl: String(json.imagem_url || '').trim(),
            ncm: String(json.ncm || '').trim(),
            descricao: String(json.ncm_descricao || json.ingredientes || '').trim(),
            fonte: `API SI5 Global (Proxy #${i + 1})`,
          });
        }
        return res.status(404).json({ erro: 'Produto não encontrado.' });
      }

      const listaRaw = Array.isArray(json?.data) ? json.data : [];
      const produtos = listaRaw.map((item) => ({
        ean: String(item.codbar || '').trim(),
        nomeProduto: String(item.produto || '').trim(),
        marca: String(item.marca || '').trim(),
        categoria: String(item.categoria || 'Geral').trim(),
        fotoUrl: String(item.imagem_url || item.codigo_barras_url || '').trim(),
        ncm: String(item.ncm || '').trim(),
        descricao: String(item.peso || item.embalagem || item.ncm_descricao || '').trim(),
        fonte: 'API Oficial SI5 Global',
      }));

      return res.status(200).json({
        produtos,
        total: Number(json?.meta?.total || listaRaw.length),
        currentPage: Number(json?.meta?.current_page || page),
        lastPage: Number(json?.meta?.last_page || 1),
        chaveUtilizada: i + 1,
      });
    } catch {
      clearTimeout(timer);
    }
  }

  return res.status(502).json({ erro: 'SI5 Global indisponível ou cota esgotada no momento.' });
}
