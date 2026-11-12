const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, setDoc, writeBatch } = require('firebase/firestore');

const cfgAntigo = {
  projectId: 'appestoqueprodutos-bb92d',
  apiKey: 'AIzaSyCF28plPBv7N_FxV54bF2jv-JxyBaLW3x0',
};

const cfgNovo = {
  projectId: 'adega-delivery-pdv',
  apiKey: 'AIzaSyCHr0xEmgY8qQG41xyYU7T4AK8Y3ALvDnY',
};

const appAntigo = initializeApp(cfgAntigo, 'app_origem');
const dbAntigo = getFirestore(appAntigo);

const appNovo = initializeApp(cfgNovo, 'app_destino');
const dbNovo = getFirestore(appNovo);

function limparUndefined(obj) {
  return JSON.parse(JSON.stringify(obj));
}

async function migrar() {
  console.log('=== INICIANDO MIGRACAO SEGURA (BANCO ANTIGO -> NOVO) ===');

  // 1. BACKUP LOCAL EM JSON (Garante recuperacao total)
  console.log('1. Lendo todos os dados do banco antigo...');
  const estoqSnap = await getDocs(collection(dbAntigo, 'estoque'));
  const vendasSnap = await getDocs(collection(dbAntigo, 'vendas'));
  const devedoresSnap = await getDocs(collection(dbAntigo, 'clientes_devedores'));
  const lojasSnap = await getDocs(collection(dbAntigo, 'supermercados'));

  const backup = {
    dataMigracao: new Date().toISOString(),
    supermercados: [],
    estoque: [],
    vendas: [],
    clientes_devedores: []
  };

  lojasSnap.forEach(d => backup.supermercados.push({ id: d.id, ...d.data() }));
  estoqSnap.forEach(d => backup.estoque.push({ id: d.id, ...d.data() }));
  vendasSnap.forEach(d => backup.vendas.push({ id: d.id, ...d.data() }));
  devedoresSnap.forEach(d => backup.clientes_devedores.push({ id: d.id, ...d.data() }));

  fs.writeFileSync('backup_producao_antiga.json', JSON.stringify(backup, null, 2), 'utf-8');
  console.log('Backup salvo em backup_producao_antiga.json com sucesso!');
  console.log('Dados coletados:', backup.estoque.length, 'itens de estoque,', backup.vendas.length, 'vendas,', backup.clientes_devedores.length, 'devedores,', backup.supermercados.length, 'lojas.');

  // 2. MIGRACAO DE LOJAS
  console.log('2. Migrando Supermercados/Lojas...');
  for (const loja of backup.supermercados) {
    const { id, ...dados } = loja;
    await setDoc(doc(dbNovo, 'supermercados', id), limparUndefined(dados), { merge: true });
  }
  console.log('✓ Lojas salvas no novo banco:', backup.supermercados.length);

  // 3. MIGRACAO DE CLIENTES DEVEDORES (FIADO)
  console.log('3. Migrando Clientes Devedores (Fiado)...');
  for (let i = 0; i < backup.clientes_devedores.length; i += 400) {
    const lote = backup.clientes_devedores.slice(i, i + 400);
    const batch = writeBatch(dbNovo);
    for (const dev of lote) {
      const { id, ...dados } = dev;
      batch.set(doc(dbNovo, 'clientes_devedores', id), limparUndefined(dados), { merge: true });
    }
    await batch.commit();
  }
  console.log('✓ Clientes fiado migrados com sucesso:', backup.clientes_devedores.length);

  // 4. MIGRACAO DE VENDAS (HISTORICO)
  console.log('4. Migrando Historico de Vendas...');
  for (let i = 0; i < backup.vendas.length; i += 400) {
    const lote = backup.vendas.slice(i, i + 400);
    const batch = writeBatch(dbNovo);
    for (const v of lote) {
      const { id, ...dados } = v;
      batch.set(doc(dbNovo, 'vendas', id), limparUndefined(dados), { merge: true });
    }
    await batch.commit();
    console.log('   Progresso vendas:', Math.min(i + 400, backup.vendas.length), '/', backup.vendas.length);
  }
  console.log('✓ Vendas migradas com sucesso:', backup.vendas.length);

  // 5. MIGRACAO DE ESTOQUE COM REGRA DE COPOES E CODIGO DE BARRAS
  console.log('5. Migrando Estoque (preservando fotos dos Copoes e mantendo fotos oficiais para EANs)...');
  let copoesComFoto = 0;
  let eansSemFoto = 0;

  for (let i = 0; i < backup.estoque.length; i += 400) {
    const lote = backup.estoque.slice(i, i + 400);
    const batch = writeBatch(dbNovo);

    for (const item of lote) {
      const { id, ...dados } = item;
      const cod = String(dados.codigo || dados.codigo_barras || '').trim();
      const nome = String(dados.nome || '').trim();

      const isCopaoOuBalcao = !cod || cod.length < 6 || cod.startsWith('ESP') || cod.startsWith('BAL') || cod.startsWith('COK') || /cop[aã]o|dose|drink|combo|trufa|pa[cç]oca/i.test(nome);

      const dadosParaGravar = { ...dados };

      if (isCopaoOuBalcao) {
        // Copões e itens próprios: MANTÉM A FOTO ORIGINAL E GARANTE TIPO INTERNO
        copoesComFoto++;
        dadosParaGravar.tipoCadastro = 'interno';
        dadosParaGravar.estoqueIlimitado = true;
      } else {
        // Produtos comerciais normais: Não transfere foto antiga para usar a foto oficial HD do catálogo
        eansSemFoto++;
        delete dadosParaGravar.foto;
        dadosParaGravar.tipoCadastro = 'padrao';
      }

      batch.set(doc(dbNovo, 'estoque', id), limparUndefined(dadosParaGravar), { merge: true });
    }
    await batch.commit();
  }

  console.log('✓ Itens de estoque migrados com sucesso:', backup.estoque.length);
  console.log('   -> Copões e itens especiais com foto preservada:', copoesComFoto);
  console.log('   -> Itens com código EAN vinculados ao catálogo oficial HD:', eansSemFoto);

  console.log('=== MIGRACAO CONCLUIDA COM 100% DE SUCESSO! ===');
  process.exit(0);
}

migrar().catch(err => {
  console.error('ERRO NA MIGRACAO:', err);
  process.exit(1);
});
