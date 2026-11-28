import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calcularDiasParaVencer,
  calcularMetricasVenda,
  construirMapaCustoPorCodigo,
  ehProdutoEstoqueIlimitado,
  estaNoPeriodo,
  parseDataFlexivel,
  parseDataVenda,
} from '../src/utils/relatoriosFinanceiros';
import {
  calcularAlertasEstoque,
  filtrarAlertasValidadePorDias,
} from '../src/utils/alertasEstoque';
import {
  formatDate,
  formatDateTime,
  formatTime,
  getElapsedMinutes,
} from '../src/utils/formatters';
import { obterDataLocalISO } from '../src/lib/dateUtils';
import {
  gerarLinhasEstoqueCSV,
  gerarLinhasVendasCSV,
  sanitizarCelulaCSV,
} from '../src/lib/exportUtils';
import { calcularSliceLoteRemoto } from '../src/lib/bomJawaKitApi';
import type { ItemEstoque, Venda } from '../src/types';

test('parseDataFlexivel aceita ISO e DD/MM/YYYY em horario local e rejeita datas invalidas', () => {
  const iso = parseDataFlexivel('2026-05-10');
  assert.ok(iso);
  assert.equal(iso.getFullYear(), 2026);
  assert.equal(iso.getMonth(), 4);
  assert.equal(iso.getDate(), 10);

  const br = parseDataFlexivel('10/05/2026', true);
  assert.ok(br);
  assert.equal(br.getFullYear(), 2026);
  assert.equal(br.getMonth(), 4);
  assert.equal(br.getDate(), 10);
  assert.equal(br.getHours(), 23);
  assert.equal(br.getMinutes(), 59);

  assert.equal(parseDataFlexivel('2026-02-31'), null);
  assert.equal(parseDataFlexivel('31/04/2026'), null);
  assert.equal(parseDataFlexivel('data-invalida'), null);
  assert.equal(parseDataFlexivel(''), null);
});

test('parseDataVenda preserva meia-noite (00:15) e retorna null sem data valida', () => {
  const meiaNoite = parseDataVenda({ data: '2026-05-10', hora: '00:15' });
  assert.ok(meiaNoite);
  assert.equal(meiaNoite.getHours(), 0);
  assert.equal(meiaNoite.getMinutes(), 15);

  const viaTimestamp = parseDataVenda({ timestamp: 1778425200000 });
  assert.ok(viaTimestamp);
  assert.equal(viaTimestamp.getTime(), 1778425200000);

  assert.equal(parseDataVenda({}), null);
  assert.equal(parseDataVenda({ data: 'nao-e-data', hora: '10:00' }), null);
});

test('calcularMetricasVenda usa custo real, nao inventa 70% e zera estornos', () => {
  const estoque: ItemEstoque[] = [
    {
      codigo: '7891',
      nome: 'Cerveja Lata',
      quantidade: 10,
      lote: 'L1',
      validade: '2027-01-01',
      preco_custo: 3.5,
      preco_venda: 6.0,
    },
  ];
  const mapaCusto = construirMapaCustoPorCodigo(estoque);

  const vendaConcluida: Venda = {
    id: 'v_ok',
    lojaId: 'loja_1',
    data: '2026-05-10',
    hora: '14:00',
    timestamp: Date.now(),
    operadorId: 'op1',
    formaPagamento: 'pix',
    status: 'concluida',
    valorTotal: 22.0,
    itens: [
      { codigo: '7891', nome: 'Cerveja Lata', quantidade: 2, preco_unitario: 6.0, subtotal: 12.0 },
      { codigo: 'SEM_CUSTO', nome: 'Item Novo', quantidade: 1, preco_unitario: 10.0, subtotal: 10.0 },
    ],
  };

  const mOk = calcularMetricasVenda(vendaConcluida, mapaCusto);
  assert.equal(mOk.valorTotal, 22.0);
  assert.equal(mOk.custoTotal, 7.0); // 2 * 3.50 + 0 (sem estimativa de 70%)
  assert.equal(mOk.lucroReal, 15.0);
  assert.equal(mOk.qtdItens, 3);
  assert.equal(mOk.itensSemCusto, 1);
  assert.equal(mOk.estornada, false);

  const vendaEstornada: Venda = { ...vendaConcluida, id: 'v_est', status: 'estornada' };
  const mEst = calcularMetricasVenda(vendaEstornada, mapaCusto);
  assert.equal(mEst.estornada, true);
  assert.equal(mEst.custoTotal, 0);
  assert.equal(mEst.lucroReal, 0);
  assert.equal(mEst.margemPercentual, 0);
});

test('estaNoPeriodo aplica teto em hoje e exclui datas nulas fora de todos', () => {
  const ref = new Date(2026, 4, 10, 15, 0, 0);
  const hojeCedo = new Date(2026, 4, 10, 8, 30, 0);
  const hojeTarde = new Date(2026, 4, 10, 23, 50, 0);
  const futuro = new Date(2026, 4, 11, 0, 1, 0);

  assert.equal(estaNoPeriodo(hojeCedo, 'hoje', ref), true);
  assert.equal(estaNoPeriodo(hojeTarde, 'hoje', ref), true);
  assert.equal(estaNoPeriodo(futuro, 'hoje', ref), false);
  assert.equal(estaNoPeriodo(null, 'hoje', ref), false);
  assert.equal(estaNoPeriodo(null, 'todos', ref), true);
});

test('calcularAlertasEstoque e filtrarAlertasValidadePorDias excluem ilimitados/zerados e evitam dupla contagem', () => {
  const ref = new Date(2026, 4, 10, 10, 0, 0);
  const estoque: ItemEstoque[] = [
    {
      codigo: '100',
      nome: 'Item Interno Espetinho',
      quantidade: 1,
      lote: 'INT',
      validade: '2026-05-01',
      preco_venda: 12,
      tipoCadastro: 'interno',
    },
    {
      codigo: '101',
      nome: 'Item Ilimitado Dose',
      quantidade: 0,
      lote: 'ILIM',
      validade: '2026-05-10',
      preco_venda: 15,
      estoqueIlimitado: true,
    },
    {
      codigo: '200',
      nome: 'Vencido Zerado',
      quantidade: 0,
      lote: 'Z1',
      validade: '2026-05-01',
      preco_venda: 5,
    },
    {
      codigo: '201',
      nome: 'Vence Hoje Com Saldo',
      quantidade: 4,
      lote: 'H1',
      validade: '10/05/2026',
      preco_venda: 8,
    },
    {
      codigo: '202',
      nome: 'Vence em 5 Dias',
      quantidade: 2,
      lote: 'P1',
      validade: '2026-05-15',
      preco_venda: 9,
    },
    {
      codigo: '203',
      nome: 'Estoque Negativo',
      quantidade: -1,
      lote: 'N1',
      validade: '2026-12-01',
      preco_venda: 10,
    },
  ];

  assert.equal(ehProdutoEstoqueIlimitado(estoque[0]), true);
  assert.equal(ehProdutoEstoqueIlimitado(estoque[1]), true);
  assert.equal(calcularDiasParaVencer('10/05/2026', ref), 0);

  const resumo = calcularAlertasEstoque(estoque, 3, [], ref);
  assert.equal(resumo.vencidosOuHoje.length, 1);
  assert.equal(resumo.vencidosOuHoje[0].item.codigo, '201');
  assert.equal(resumo.vencidosOuHoje[0].diasParaVencer, 0);

  assert.equal(resumo.vencendoEmAte10Dias.length, 1);
  assert.equal(resumo.vencendoEmAte10Dias[0].item.codigo, '202');
  assert.equal(resumo.alertasValidade10Dias.length, 2);

  // Baixo estoque: 200 (0 un), 202 (2 un), 203 (-1 un); exclui 100 (interno) e 101 (ilimitado)
  assert.equal(resumo.countZerados, 2); // 200 e 203
  assert.equal(resumo.produtosEstoqueBaixo.some((p) => p.codigo === '100' || p.codigo === '101'), false);

  const janela30 = filtrarAlertasValidadePorDias(estoque, 30, ref);
  assert.deepEqual(
    janela30.map((a) => a.item.codigo),
    ['201', '202']
  );
});

test('formatDate, formatTime, formatDateTime, getElapsedMinutes e obterDataLocalISO evitam shift UTC e NaN', () => {
  assert.equal(formatDate('2026-05-10'), '10/05/2026');
  assert.equal(formatDate('invalido'), '--/--/----');
  assert.equal(formatTime('invalido'), '--:--');
  assert.equal(formatDateTime('invalido'), '--/--/---- --:--');
  assert.equal(getElapsedMinutes('invalido'), 0);

  const isoInvalido = obterDataLocalISO(new Date('data-ruim'));
  assert.match(isoInvalido, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(isoInvalido.includes('NaN'), false);
});

test('exportUtils sanitiza formula injection, zera estornos e trata DD/MM/YYYY + ilimitados', () => {
  assert.equal(sanitizarCelulaCSV('=CMD()'), `"'=CMD()"`);
  assert.equal(sanitizarCelulaCSV('+1+1'), `"'+1+1"`);
  assert.equal(sanitizarCelulaCSV('-1+1'), `"'-1+1"`);
  assert.equal(sanitizarCelulaCSV('@SUM(A1)'), `"'@SUM(A1)"`);
  assert.equal(sanitizarCelulaCSV('\t=1'), `"'\t=1"`);
  assert.equal(sanitizarCelulaCSV('-15.50'), `"-15.50"`);

  const vendas: Venda[] = [
    {
      id: '=v_est',
      lojaId: 'loja_1',
      data: '2026-05-10',
      hora: '12:00',
      timestamp: 1,
      operadorId: 'op1',
      operadorNome: '+Malicioso',
      formaPagamento: undefined as any,
      status: 'estornada',
      valorTotal: 50,
      itens: [
        {
          codigo: '1',
          nome: 'Produto',
          quantidade: 2,
          preco_unitario: undefined as any,
          subtotal: 50,
        },
      ],
    },
  ];

  const csvVendas = gerarLinhasVendasCSV(vendas);
  const linhaVenda = csvVendas.split('\n')[1];
  assert.ok(linhaVenda.startsWith(`"'=v_est";`));
  assert.ok(linhaVenda.includes(`"'+Malicioso"`));
  assert.ok(linhaVenda.includes(`;2;0,00;0,00;0,00;0,0%;`));
  assert.ok(linhaVenda.includes('[ESTORNADA - Valor original R$ 50.00]'));

  const estoque: ItemEstoque[] = [
    {
      codigo: 'A1',
      nome: 'Dose Whisky',
      quantidade: 99999,
      lote: 'INF',
      validade: '10/05/2020',
      preco_venda: 20,
      tipoCadastro: 'interno',
    },
    {
      codigo: 'A2',
      nome: 'Fardo Agua',
      quantidade: 5,
      lote: 'L2',
      validade: '31/12/2099',
      preco_venda: 12,
    },
  ];
  const csvEstoque = gerarLinhasEstoqueCSV(estoque);
  const linhasEst = csvEstoque.split('\n');
  assert.ok(linhasEst[1].includes(`"ILIMITADO";0,00;20,00;"SOB DEMANDA";`));
  assert.ok(linhasEst[1].endsWith(`"ILIMITADO"`));
  assert.ok(linhasEst[2].endsWith(`"OK"`));
});

test('calcularSliceLoteRemoto calcula offset e fatia do lote para paginas > 200', () => {
  const lote0Pag1 = calcularSliceLoteRemoto(1, 20, 200);
  assert.deepEqual(lote0Pag1, {
    batchIndex: 0,
    batchOffset: 0,
    inicioNoLote: 0,
    fimNoLote: 20,
  });

  const lote1Pag11 = calcularSliceLoteRemoto(11, 20, 200);
  assert.deepEqual(lote1Pag11, {
    batchIndex: 1,
    batchOffset: 200,
    inicioNoLote: 0,
    fimNoLote: 20,
  });

  const lote1Pag12 = calcularSliceLoteRemoto(12, 20, 200);
  assert.deepEqual(lote1Pag12, {
    batchIndex: 1,
    batchOffset: 200,
    inicioNoLote: 20,
    fimNoLote: 40,
  });
});
