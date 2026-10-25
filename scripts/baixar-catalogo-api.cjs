const fs = require('fs');
const path = require('path');

async function main() {
  console.log('--- Iniciando download do Catálogo Geral da API ---');

  // 1. Coleta todos os códigos de barras já cadastrados no banco do usuário
  const arquivosCatalogo = [
    'src/lib/catalogoAmbev.ts',
    'src/lib/catalogoAdegaMix.ts',
    'src/lib/catalogoZeDeliveryMix.ts',
    'src/lib/catalogoChoppBrahmaExpress.ts',
    'src/lib/catalogoRissulBebidas.ts'
  ];
  const codigosExistentes = new Set();
  for (const arq of arquivosCatalogo) {
    const p = path.join(process.cwd(), arq);
    if (fs.existsSync(p)) {
      const conteudo = fs.readFileSync(p, 'utf8');
      const matches = conteudo.matchAll(/codigo:\s*["']([^"']+)["']/g);
      for (const m of matches) {
        codigosExistentes.add(String(m[1]).trim());
      }
    }
  }
  console.log('Produtos já cadastrados no seu banco (serão ignorados):', codigosExistentes.size);

  const apiKey = 'sk_VZvKYX-ldCakrfALLxpzKPvmRUoawNN7hewD678CvGU';
  const headers = { 'X-API-Key': apiKey, 'Accept': 'application/json' };

  // 2. Baixar todas as categorias
  console.log('Baixando categorias...');
  let categorias = [];
  try {
    const resCat = await fetch('https://produtos.bomjawakit.com.br/api/v1/categorias', { headers });
    categorias = await resCat.json();
    console.log(`Categorias encontradas: ${categorias.length}`);
  } catch (e) {
    console.error('Erro ao baixar categorias:', e.message);
  }

  // 3. Pegar total de produtos com foto
  const primeiroRes = await fetch('https://produtos.bomjawakit.com.br/api/v1/produtos?com_imagem=true&limit=200&offset=0', { headers });
  const primeiroJson = await primeiroRes.json();
  const totalRemoto = primeiroJson.total || 0;
  console.log(`Total de produtos com foto na API: ${totalRemoto}`);

  const todosItensRaw = [...(primeiroJson.itens || [])];
  const offsets = [];
  for (let offset = 200; offset < totalRemoto; offset += 200) {
    offsets.push(offset);
  }

  // Baixa em lotes paralelos de 10
  const CONCURRENCY = 10;
  for (let i = 0; i < offsets.length; i += CONCURRENCY) {
    const loteOffsets = offsets.slice(i, i + CONCURRENCY);
    const promessas = loteOffsets.map(async (off) => {
      for (let tentativa = 0; tentativa < 3; tentativa++) {
        try {
          const r = await fetch(`https://produtos.bomjawakit.com.br/api/v1/produtos?com_imagem=true&limit=200&offset=${off}`, { headers });
          if (r.ok) {
            const j = await r.json();
            return j.itens || [];
          }
        } catch (e) {}
        await new Promise(res => setTimeout(res, 300));
      }
      return [];
    });
    const resultadosLote = await Promise.all(promessas);
    for (const arr of resultadosLote) {
      todosItensRaw.push(...arr);
    }
    console.log(`Progresso: ${todosItensRaw.length} / ${totalRemoto}`);
  }

  console.log(`Download bruto finalizado! Total recebido: ${todosItensRaw.length}`);

  // 4. Filtrar: retirar os que o usuário já tem e deduplicar por EAN
  const vistos = new Set();
  const produtosNovos = [];
  let ignoradosJaExistentes = 0;

  for (const item of todosItensRaw) {
    const ean = String(item.barcode || '').trim();
    if (!ean) continue;

    // Se já existe no seu banco de dados, SAI DA LISTA
    if (codigosExistentes.has(ean)) {
      ignoradosJaExistentes++;
      continue;
    }
    if (vistos.has(ean)) continue;
    vistos.add(ean);

    const nomeLimpo = String(item.nome || '').replace(/\|\|.*$/g, '').trim();
    if (!nomeLimpo) continue;

    const dados = item.dados || {};
    const marca = String(dados.marca || dados.brand || dados.fabricante || dados.manufacturer || '').trim();
    const catLimpa = String(item.categoria || '')
      .replace(/^Carrefour\s*-\s*Mercearia\s*-\s*/i, '')
      .replace(/^Carrefour\s*-\s*/i, '')
      .replace(/^Amig[aã]o\s*-\s*/i, '')
      .trim();
    const catSlug = String(item.categoria_slug || '').trim();
    const ncm = item.ncm && !String(item.ncm).toLowerCase().includes('não disponível') ? String(item.ncm).trim() : '';

    produtosNovos.push({
      ean,
      nomeProduto: nomeLimpo,
      marca,
      categoria: catLimpa || 'Geral',
      categoriaSlug: catSlug,
      fotoUrl: `https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/${encodeURIComponent(ean)}.png`,
      ncm,
      fonte: 'API BomJawaKit'
    });
  }

  console.log(`Removidos (pois você já tem cadastrado): ${ignoradosJaExistentes}`);
  console.log(`Total de produtos novos prontos: ${produtosNovos.length}`);

  // Categorias atualizadas
  const contagemPorSlug = {};
  for (const p of produtosNovos) {
    if (p.categoriaSlug) contagemPorSlug[p.categoriaSlug] = (contagemPorSlug[p.categoriaSlug] || 0) + 1;
  }
  const categoriasFiltradas = (Array.isArray(categorias) ? categorias : [])
    .map(c => ({
      id: c.id,
      slug: c.slug,
      nome: String(c.nome || '').replace(/^Carrefour\s*-\s*Mercearia\s*-\s*/i, '').replace(/^Carrefour\s*-\s*/i, '').replace(/^Amig[aã]o\s*-\s*/i, '').trim(),
      produtos: contagemPorSlug[c.slug] || 0
    }))
    .filter(c => c.produtos > 0)
    .sort((a, b) => b.produtos - a.produtos);

  const payloadFinal = {
    versao: 1,
    atualizadoEm: new Date().toISOString(),
    totalProdutos: produtosNovos.length,
    categorias: categoriasFiltradas,
    produtos: produtosNovos
  };

  const destino = path.join(process.cwd(), 'public', 'catalogo-api-offline.json');
  fs.writeFileSync(destino, JSON.stringify(payloadFinal));
  const tamanhoMB = (fs.statSync(destino).size / (1024 * 1024)).toFixed(2);
  console.log(`Sucesso! Arquivo gerado em public/catalogo-api-offline.json (${tamanhoMB} MB) com ${produtosNovos.length} produtos.`);
}

main().catch(console.error);
