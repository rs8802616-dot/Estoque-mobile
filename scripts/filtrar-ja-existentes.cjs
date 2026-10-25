const fs = require('fs');
const path = require('path');

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
    const matches = conteudo.matchAll(/(?:"codigo"|codigo):\s*["']([^"']+)["']/g);
    for (const m of matches) {
      codigosExistentes.add(String(m[1]).trim());
    }
  }
}
console.log('Produtos existentes no catálogo atual do usuário:', codigosExistentes.size);

const jsonOfflinePath = path.join(process.cwd(), 'public', 'catalogo-api-offline.json');
const data = JSON.parse(fs.readFileSync(jsonOfflinePath, 'utf8'));
const produtosFiltrados = data.produtos.filter(p => !codigosExistentes.has(String(p.ean).trim()));
const removidos = data.produtos.length - produtosFiltrados.length;
console.log('Produtos que já existiam e foram REMOVIDOS da lista:', removidos);
console.log('Total final de produtos novos disponíveis no catálogo offline:', produtosFiltrados.length);

data.produtos = produtosFiltrados;
data.totalProdutos = produtosFiltrados.length;
fs.writeFileSync(jsonOfflinePath, JSON.stringify(data));
console.log('Arquivo public/catalogo-api-offline.json atualizado com sucesso!');
