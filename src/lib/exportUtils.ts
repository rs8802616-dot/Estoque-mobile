import { Venda, ItemEstoque } from '../types';
import { obterDataLocalISO } from './dateUtils';
import {
  calcularDiasParaVencer,
  calcularMetricasVenda,
  construirMapaCustoPorCodigo,
  ehProdutoEstoqueIlimitado,
  obterCustoUnitarioItem,
} from '../utils/relatoriosFinanceiros';

/**
 * Sanitiza célula CSV contra quebra de colunas/aspas e CSV Formula Injection (=, +, -, @, \t, \r).
 */
export function sanitizarCelulaCSV(val: unknown): string {
  const bruto = String(val ?? '').replace(/\r?\n/g, ' ');
  const trimEsquerda = bruto.replace(/^[ ]+/, '');
  const ehNumeroNegativoSimples = /^-\d+(?:[.,]\d+)?$/.test(trimEsquerda);
  const perigoso =
    /^[=+@\t\r]/.test(trimEsquerda) ||
    (trimEsquerda.startsWith('-') && !ehNumeroNegativoSimples);
  const seguro = perigoso ? `'${bruto}` : bruto;
  return `"${seguro.replace(/"/g, '""')}"`;
}

// Helper to trigger file download
function baixarArquivo(conteudo: string, nomeArquivo: string, mimeType: string) {
  const blob = new Blob(['\uFEFF' + conteudo], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Gera conteúdo CSV de vendas com proteção de fórmulas e estornos zerados nas colunas financeiras.
 */
export function gerarLinhasVendasCSV(vendas: Venda[], estoque?: ItemEstoque[]): string {
  const cabecalho = [
    'ID Venda',
    'Data',
    'Hora',
    'Operador',
    'Forma Pagamento',
    'Status',
    'Qtd Total Itens',
    'Valor Total Venda (R$)',
    'Custo Total Itens (R$)',
    'Lucro Real Faturado (R$)',
    'Margem Lucro (%)',
    'Itens (Qtd - Nome - Unit - Custo - Lucro - Subtotal)',
    'Motivo Estorno',
  ].join(';');

  const mapaCusto = construirMapaCustoPorCodigo(estoque);

  const linhas = (vendas || []).map((v) => {
    const metrics = calcularMetricasVenda(v, mapaCusto);

    const descItensLista = (Array.isArray(v?.itens) ? v.itens : [])
      .map((i) => {
        const q = Number(i?.quantidade) || 0;
        const pUnit = Number(i?.preco_unitario) || 0;
        const { custo: cUnit } = obterCustoUnitarioItem(i, mapaCusto);
        const cTot = cUnit * q;
        const sub = Number(i?.subtotal ?? q * pUnit) || 0;
        const luc = sub - cTot;
        const nomeSeguro = String(i?.nome || 'Produto').replace(/;/g, ' ');
        return `${q}x ${nomeSeguro} (Venda: R$ ${pUnit.toFixed(2)} | Custo: R$ ${cUnit.toFixed(2)} | Lucro: R$ ${luc.toFixed(2)})`;
      })
      .join(' | ')
      .replace(/;/g, ' ');

    const descFinal = metrics.estornada
      ? `[ESTORNADA - Valor original R$ ${metrics.valorTotal.toFixed(2)}] ${descItensLista}`.trim()
      : descItensLista;

    const valorCol = metrics.estornada ? 0 : metrics.valorTotal;
    const custoCol = metrics.estornada ? 0 : metrics.custoTotal;
    const lucroCol = metrics.estornada ? 0 : metrics.lucroReal;
    const margemCol = metrics.estornada ? 0 : metrics.margemPercentual;

    return [
      sanitizarCelulaCSV(v?.id || ''),
      sanitizarCelulaCSV(v?.data || ''),
      sanitizarCelulaCSV(v?.hora || ''),
      sanitizarCelulaCSV(v?.operadorNome || ''),
      sanitizarCelulaCSV(String(v?.formaPagamento || 'outros').toUpperCase()),
      sanitizarCelulaCSV(String(v?.status || 'concluida').toUpperCase()),
      metrics.qtdItens,
      valorCol.toFixed(2).replace('.', ','),
      custoCol.toFixed(2).replace('.', ','),
      lucroCol.toFixed(2).replace('.', ','),
      margemCol.toFixed(1).replace('.', ',') + '%',
      sanitizarCelulaCSV(descFinal),
      sanitizarCelulaCSV(v?.motivoEstorno || ''),
    ].join(';');
  });

  return [cabecalho, ...linhas].join('\n');
}

// Export Vendas to CSV
export function exportarVendasCSV(vendas: Venda[], nomeLoja: string, estoque?: ItemEstoque[]) {
  const conteudo = gerarLinhasVendasCSV(vendas, estoque);
  const dataHoje = obterDataLocalISO();
  const nomeSeguro = String(nomeLoja || 'Loja').replace(/\s+/g, '_');
  baixarArquivo(conteudo, `Vendas_${nomeSeguro}_${dataHoje}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Gera conteúdo CSV de estoque compatível com YYYY-MM-DD, DD/MM/YYYY e itens ilimitados.
 */
export function gerarLinhasEstoqueCSV(estoque: ItemEstoque[]): string {
  const cabecalho = [
    'Código/EAN',
    'Nome do Produto',
    'Quantidade Em Estoque',
    'Preço Custo (R$)',
    'Preço Venda (R$)',
    'Valor Total Estoque Venda (R$)',
    'Lote',
    'Validade',
    'Status Validade',
  ].join(';');

  const linhas = (estoque || []).map((item) => {
    const isIlimitado = ehProdutoEstoqueIlimitado(item);
    let statusValidade = isIlimitado ? 'ILIMITADO' : 'OK';

    if (!isIlimitado && item?.validade) {
      const diffDays = calcularDiasParaVencer(item.validade);
      if (diffDays !== null) {
        if (diffDays < 0) {
          statusValidade = 'VENCIDO';
        } else if (diffDays === 0) {
          statusValidade = 'VENCE HOJE';
        } else if (diffDays <= 30) {
          statusValidade = `VENCE EM ${diffDays} DIAS`;
        }
      }
    }

    const qtdNum = Number(item?.quantidade) || 0;
    const pCusto = Number(item?.preco_custo) || 0;
    const pVenda = Number(item?.preco_venda) || 0;

    const qtdExibir = isIlimitado ? sanitizarCelulaCSV('ILIMITADO') : qtdNum;
    const valorTotalEstoque = isIlimitado
      ? sanitizarCelulaCSV('SOB DEMANDA')
      : (qtdNum * pVenda).toFixed(2).replace('.', ',');

    return [
      sanitizarCelulaCSV(item?.codigo || ''),
      sanitizarCelulaCSV(item?.nome || ''),
      qtdExibir,
      pCusto.toFixed(2).replace('.', ','),
      pVenda.toFixed(2).replace('.', ','),
      valorTotalEstoque,
      sanitizarCelulaCSV(item?.lote || ''),
      sanitizarCelulaCSV(item?.validade || ''),
      sanitizarCelulaCSV(statusValidade),
    ].join(';');
  });

  return [cabecalho, ...linhas].join('\n');
}

// Export Estoque to CSV
export function exportarEstoqueCSV(estoque: ItemEstoque[], nomeLoja: string) {
  const conteudo = gerarLinhasEstoqueCSV(estoque);
  const dataHoje = obterDataLocalISO();
  const nomeSeguro = String(nomeLoja || 'Loja').replace(/\s+/g, '_');
  baixarArquivo(conteudo, `Estoque_${nomeSeguro}_${dataHoje}.csv`, 'text/csv;charset=utf-8;');
}
