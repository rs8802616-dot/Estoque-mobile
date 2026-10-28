/**
 * Módulo de Integração Direta de Produtos
 * Conecta-se diretamente ao banco de dados do seu app (Firebase Firestore)
 * Funciona em qualquer lugar: Google AI Studio, Vercel, localhost ou celular, sem precisar de servidor rodando.
 */

export async function consultarProdutoPorCodigo(codigoBarras) {
  const codigoLimpo = String(codigoBarras || '').trim();
  if (!codigoLimpo) return null;

  // 1. Busca direta no seu Catálogo Global de Produtos (Firebase)
  try {
    const url = `https://firestore.googleapis.com/v1/projects/adega-delivery-pdv/databases/(default)/documents/catalogo_global/${encodeURIComponent(codigoLimpo)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const f = data.fields || {};
      const nome = f.nome?.stringValue || '';
      const foto = f.imagem?.stringValue || f.foto?.stringValue || f.foto_url?.stringValue || '';
      const marca = f.marca?.stringValue || '';
      const categoria = f.categoria?.stringValue || '';
      const descricao = f.descricao?.stringValue || nome;

      if (nome) {
        return {
          encontrado: true,
          codigo: codigoLimpo,
          nome,
          marca,
          categoria,
          fotoUrl: foto,
          descricao,
          fonte: 'Seu Catálogo (Firebase)',
        };
      }
    }
  } catch (e) {
    console.warn('[Catalogo] Erro ao consultar catalogo_global:', e);
  }

  // 2. Fallback na coleção produtos_catalogo
  try {
    const url = `https://firestore.googleapis.com/v1/projects/adega-delivery-pdv/databases/(default)/documents/produtos_catalogo/${encodeURIComponent(codigoLimpo)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const f = data.fields || {};
      const nome = f.nome?.stringValue || '';
      const foto = f.imagem?.stringValue || f.foto?.stringValue || f.foto_url?.stringValue || '';
      if (nome) {
        return {
          encontrado: true,
          codigo: codigoLimpo,
          nome,
          marca: f.marca?.stringValue || '',
          categoria: f.categoria?.stringValue || '',
          fotoUrl: foto,
          descricao: f.descricao?.stringValue || nome,
          fonte: 'Seu Catálogo (Firebase)',
        };
      }
    }
  } catch (e) {}

  // 3. Fallback no Open Food Facts (para produtos de mercado que não estejam no seu catálogo)
  try {
    const cleanEan = codigoLimpo.replace(/\D/g, '');
    if (cleanEan.length >= 8) {
      const offRes = await fetch(`https://br.openfoodfacts.org/api/v2/product/${cleanEan}.json`);
      if (offRes.ok) {
        const offData = await offRes.json();
        if (offData.status === 1 && offData.product) {
          const p = offData.product;
          const nome = p.product_name_pt || p.product_name || '';
          if (nome) {
            return {
              encontrado: true,
              codigo: cleanEan,
              nome,
              marca: p.brands || '',
              categoria: p.categories || '',
              fotoUrl: p.image_front_url || p.image_url || '',
              descricao: nome,
              fonte: 'Open Food Facts',
            };
          }
        }
      }
    }
  } catch (e) {}

  return null;
}
