const fs = require('fs');
const path = require('path');

function extrairArtigosHTML(html) {
  const resultados = [];
  const articles = [...html.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/gi)];
  for (const m of articles) {
    const art = m[1];
    
    // Extrair EAN / GTIN
    let ean = '';
    const gtinMatch = art.match(/<dt[^>]*>\s*GTIN\s*<\/dt>\s*<dd[^>]*>[\s\S]*?<span[^>]*>(\d{8,14})<\/span>/i) ||
                      art.match(/href=["']\/produto\/(\d{8,14})\//i);
    if (gtinMatch) ean = gtinMatch[1].trim();
    if (!ean || ean.length < 8) continue;

    // Extrair Nome
    let nome = '';
    const h3Match = art.match(/<h3[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
    if (h3Match) {
      nome = h3Match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    }
    if (!nome) continue;

    // Extrair Marca
    let marca = '';
    const marcaMatch = art.match(/<dt[^>]*>\s*Marca\s*<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/i);
    if (marcaMatch) {
      marca = marcaMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    }

    // Extrair Imagem
    let img = `https://consultaprodutos.com.br/assets/produtos/${ean}.webp`;
    const imgMatch = art.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      const src = imgMatch[1].trim();
      if (src.startsWith('http')) {
        img = src;
      } else if (src.startsWith('/')) {
        img = `https://consultaprodutos.com.br${src}`;
      }
    }

    // Verifica se tem imagem real (não placeholder)
    const temImgReal = !img.includes('placeholder') && !img.includes('no-image') && !img.includes('default');

    resultados.push({
      codigo: ean,
      nome,
      marca: marca || 'Salgadinhos',
      categoria: 'Salgadinhos & Snacks',
      imagem: temImgReal ? img : `https://cdn-cosmos.bluesoft.com.br/products/${ean}`,
      preco: 0,
      origem: 'Cosmos Bluesoft / Salgadinhos'
    });
  }
  return resultados;
}

async function fetchPage(query, page) {
  const url = `https://consultaprodutos.com.br/buscar?q=${encodeURIComponent(query)}&page=${page}`;
  for (let tent = 0; tent < 2; tent++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml'
        }
      });
      if (res.ok) {
        const html = await res.text();
        return extrairArtigosHTML(html);
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 250));
  }
  return [];
}

async function main() {
  console.log('--- Iniciando Varredura Completa de Salgadinhos (Cosmos Bluesoft) ---');

  // 1. Carregar todos os códigos já existentes no banco de dados do usuário
  const arquivosCatalogo = [
    'src/lib/catalogoAmbev.ts',
    'src/lib/catalogoAdegaMix.ts',
    'src/lib/catalogoZeDeliveryMix.ts',
    'src/lib/catalogoChoppBrahmaExpress.ts',
    'src/lib/catalogoRissulBebidas.ts',
    'src/lib/catalogoCocaColaFemsa.ts'
  ];

  const codigosExistentes = new Set();
  for (const arq of arquivosCatalogo) {
    const p = path.join(process.cwd(), arq);
    if (fs.existsSync(p)) {
      const conteudo = fs.readFileSync(p, 'utf8');
      const matches = conteudo.matchAll(/(?:"codigo"|codigo):\s*["']([^"']+)["']/g);
      for (const m of matches) {
        codigosExistentes.add(String(m[1]).trim());
      }
    }
  }

  // Também carrega os que já estavam no catalogo-api-offline.json original (excluindo os recém-adicionados se necessário, mas aqui queremos saber o que já existe nos 14.207 do banco)
  const jsonOfflinePath = path.join(process.cwd(), 'public', 'catalogo-api-offline.json');
  if (fs.existsSync(jsonOfflinePath)) {
    try {
      const dataOffline = JSON.parse(fs.readFileSync(jsonOfflinePath, 'utf8'));
      for (const p of (dataOffline.produtos || [])) {
        const c = String(p.ean || p.barcode || p.codigo || '').trim();
        if (c) codigosExistentes.add(c);
      }
    } catch (e) {}
  }

  console.log('Total de EANs já existentes no sistema do usuário:', codigosExistentes.size);

  const todosExtraidos = new Map();

  // 2. Buscar as 50 páginas de "salgadinho" em lotes paralelos de 5
  console.log('\nBuscando 50 páginas de "salgadinho"...');
  for (let p = 1; p <= 50; p += 5) {
    const pages = [p, p + 1, p + 2, p + 3, p + 4].filter(x => x <= 50);
    const lotes = await Promise.all(pages.map(pg => fetchPage('salgadinho', pg)));
    let adicionados = 0;
    for (const lista of lotes) {
      for (const item of lista) {
        if (!todosExtraidos.has(item.codigo)) {
          todosExtraidos.set(item.codigo, item);
          adicionados++;
        }
      }
    }
    console.log(`Páginas ${pages[0]}-${pages[pages.length - 1]}: +${adicionados} únicos (Total acumulado: ${todosExtraidos.size})`);
  }

  // 3. Buscar termos complementares da categoria Salgadinhos
  const termosExtras = [
    { q: 'doritos', maxP: 5 },
    { q: 'cheetos', maxP: 5 },
    { q: 'ruffles', maxP: 5 },
    { q: 'fandangos', maxP: 4 },
    { q: 'torcida', maxP: 5 },
    { q: 'pringles', maxP: 5 },
    { q: 'elma chips', maxP: 5 },
    { q: 'batata chips', maxP: 5 },
    { q: 'cebolitos', maxP: 2 },
    { q: 'baconzitos', maxP: 2 },
    { q: 'yokitos', maxP: 2 },
    { q: 'takis', maxP: 2 },
    { q: 'fofura', maxP: 3 }
  ];

  for (const t of termosExtras) {
    const pages = [];
    for (let i = 1; i <= t.maxP; i++) pages.push(i);
    const lotes = await Promise.all(pages.map(pg => fetchPage(t.q, pg)));
    let novosTermo = 0;
    for (const lista of lotes) {
      for (const item of lista) {
        if (!todosExtraidos.has(item.codigo)) {
          todosExtraidos.set(item.codigo, item);
          novosTermo++;
        }
      }
    }
    console.log(`Termo "${t.q}": +${novosTermo} únicos (Total acumulado: ${todosExtraidos.size})`);
  }

  // 4.Separar entre JÁ CADASTRADOS e NOVOS (que não estão no banco)
  const jaNoBanco = [];
  const novosParaCadastrar = [];

  for (const prod of todosExtraidos.values()) {
    if (codigosExistentes.has(prod.codigo)) {
      jaNoBanco.push(prod);
    } else {
      novosParaCadastrar.push(prod);
    }
  }

  console.log('\n======================================================');
  console.log(`TOTAL DE SALGADINHOS ENCONTRADOS: ${todosExtraidos.size}`);
  console.log(`✅ Já existentes no seu banco (ignorados): ${jaNoBanco.length}`);
  console.log(`🆕 NOVOS SALGADINHOS (não estavam no banco): ${novosParaCadastrar.length}`);
  console.log('======================================================');

  fs.writeFileSync('scripts/salgadinhos_novos.json', JSON.stringify(novosParaCadastrar, null, 2));
  console.log('Salvo em scripts/salgadinhos_novos.json!');
}

main().catch(e => console.error(e));
