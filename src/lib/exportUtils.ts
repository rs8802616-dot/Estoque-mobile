import { Venda, ItemEstoque } from '../types';

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
  URL.revokeObjectURL(url);
}

// Export Vendas to CSV
export function exportarVendasCSV(vendas: Venda[], nomeLoja: string, estoque?: ItemEstoque[]) {
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

  const obterCusto = (item: any): number => {
    if (item.preco_custo !== undefined && item.preco_custo !== null && !isNaN(Number(item.preco_custo)) && Number(item.preco_custo) > 0) {
      return Number(item.preco_custo);
    }
    if (estoque && estoque.length > 0 && item.codigo) {
      const achou = estoque.find((e) => e.codigo === item.codigo && (e.preco_custo || 0) > 0);
      if (achou?.preco_custo) return Number(achou.preco_custo);
    }
    return 0;
  };

  const linhas = vendas.map((v) => {
    let custoVenda = 0;
    let qtdItens = 0;

    const descItens = (v.itens || [])
      .map((i) => {
        const q = i.quantidade || 1;
        qtdItens += q;
        const cUnit = obterCusto(i);
        const cTot = cUnit * q;
        custoVenda += cTot;
        const sub = i.subtotal || q * (i.preco_unitario || 0);
        const luc = sub - cTot;
        return `${q}x ${i.nome} (Venda: R$ ${i.preco_unitario.toFixed(2)} | Custo: R$ ${cUnit.toFixed(2)} | Lucro: R$ ${luc.toFixed(2)})`;
      })
      .join(' | ')
      .replace(/;/g, ' ');

    const valorVenda = v.valorTotal || 0;
    const lucroVenda = valorVenda - custoVenda;
    const margem = valorVenda > 0 ? (lucroVenda / valorVenda) * 100 : 0;

    return [
      `"${v.id}"`,
      `"${v.data}"`,
      `"${v.hora}"`,
      `"${v.operadorNome}"`,
      `"${v.formaPagamento.toUpperCase()}"`,
      `"${v.status.toUpperCase()}"`,
      qtdItens,
      valorVenda.toFixed(2).replace('.', ','),
      custoVenda.toFixed(2).replace('.', ','),
      lucroVenda.toFixed(2).replace('.', ','),
      margem.toFixed(1).replace('.', ',') + '%',
      `"${descItens}"`,
      `"${v.motivoEstorno || ''}"`,
    ].join(';');
  });

  const conteudo = [cabecalho, ...linhas].join('\n');
  const dataHoje = new Date().toISOString().split('T')[0];
  baixarArquivo(conteudo, `Vendas_${nomeLoja.replace(/\s+/g, '_')}_${dataHoje}.csv`, 'text/csv;charset=utf-8;');
}

// Export Estoque to CSV
export function exportarEstoqueCSV(estoque: ItemEstoque[], nomeLoja: string) {
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

  const hoje = new Date().toISOString().split('T')[0];

  const linhas = estoque.map((item) => {
    let statusValidade = 'OK';
    if (item.validade) {
      if (item.validade < hoje) {
        statusValidade = 'VENCIDO';
      } else {
        const diffDays = Math.ceil(
          (new Date(item.validade).getTime() - new Date(hoje).getTime()) / (1000 * 3600 * 24)
        );
        if (diffDays <= 30) {
          statusValidade = `VENCE EM ${diffDays} DIAS`;
        }
      }
    }

    const isIlimitado = item.estoqueIlimitado || item.tipoCadastro === 'interno' || Number(item.quantidade) >= 99990;
    const qtdExibir = isIlimitado ? '"ILIMITADO"' : item.quantidade;
    const valorTotalEstoque = isIlimitado
      ? '"SOB DEMANDA"'
      : ((Number(item.quantidade) || 0) * (Number(item.preco_venda) || 0)).toFixed(2).replace('.', ',');

    return [
      `"${item.codigo}"`,
      `"${item.nome}"`,
      qtdExibir,
      (item.preco_custo || 0).toFixed(2).replace('.', ','),
      item.preco_venda.toFixed(2).replace('.', ','),
      valorTotalEstoque,
      `"${item.lote || ''}"`,
      `"${item.validade || ''}"`,
      `"${statusValidade}"`,
    ].join(';');
  });

  const conteudo = [cabecalho, ...linhas].join('\n');
  const dataHoje = new Date().toISOString().split('T')[0];
  baixarArquivo(conteudo, `Estoque_${nomeLoja.replace(/\s+/g, '_')}_${dataHoje}.csv`, 'text/csv;charset=utf-8;');
}
