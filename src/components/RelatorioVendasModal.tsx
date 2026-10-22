import React, { useState, useRef } from 'react';
import { Venda, ItemEstoque, OperadorCaixa, ProdutoCatalogo } from '../types';
import { exportarVendasCSV } from '../lib/exportUtils';

interface RelatorioVendasModalProps {
  visivel: boolean;
  onFechar: () => void;
  vendas: Venda[];
  onEstornarVenda: (vendaId: string, motivo: string) => void;
  operadores: OperadorCaixa[];
  nomeLoja: string;
  onVerCupom?: (venda: Venda) => void;
  catalogoGlobal?: ProdutoCatalogo[];
  estoque?: ItemEstoque[];
}

export const RelatorioVendasModal: React.FC<RelatorioVendasModalProps> = ({
  visivel,
  onFechar,
  vendas,
  onEstornarVenda,
  operadores,
  nomeLoja,
  onVerCupom,
  catalogoGlobal = [],
  estoque = [],
}) => {
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<'todas' | 'concluida' | 'estornada'>('todas');
  const [formaPagamentoFiltro, setFormaPagamentoFiltro] = useState<
    'todas' | 'dinheiro' | 'pix' | 'cartoes' | 'cartao_credito' | 'cartao_debito' | 'fiado'
  >('todas');
  const [operadorFiltro, setOperadorFiltro] = useState<string>('todos');
  const [periodoFiltro, setPeriodoFiltro] = useState<'todos' | 'hoje' | '7dias' | 'mes' | 'ano'>('todos');
  const [registrosPorPagina, setRegistrosPorPagina] = useState<number | 'todas'>(25);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);

  // Referências para controle de rolagem suave
  const modalRef = useRef<HTMLDivElement>(null);
  const corpoRef = useRef<HTMLDivElement>(null);

  // Modal de confirmação de estorno
  const [vendaEstornar, setVendaEstornar] = useState<Venda | null>(null);
  const [motivoEstorno, setMotivoEstorno] = useState('');
  const [erroEstorno, setErroEstorno] = useState('');

  // Venda expandida para ver itens detalhados
  const [vendaExpandidaId, setVendaExpandidaId] = useState<string | null>(null);

  if (!visivel) return null;

  // Helper para obter nome canônico do catálogo Master
  const obterNomeItem = (codigo?: string, nomeOriginal?: string): string => {
    if (!codigo) return nomeOriginal || 'Item sem nome';
    const cLimpo = codigo.trim();
    const cat = catalogoGlobal.find((c) => c.codigo && c.codigo.trim() === cLimpo);
    if (cat && cat.nome && cat.nome.trim().length > 0) {
      return cat.nome.trim();
    }
    return nomeOriginal || 'Item sem nome';
  };

  // Helper para obter o preço de custo real do item vendido (com fallback no estoque da loja)
  const obterCustoItem = (item: { codigo?: string; preco_custo?: number; lote?: string; validade?: string }): number => {
    if (item.preco_custo !== undefined && item.preco_custo !== null && !isNaN(Number(item.preco_custo)) && Number(item.preco_custo) > 0) {
      return Number(item.preco_custo);
    }
    if (estoque && estoque.length > 0 && item.codigo) {
      const cLimpo = item.codigo.trim();
      const noEstLote = estoque.find(
        (e) => e.codigo?.trim() === cLimpo && e.lote === item.lote && e.validade === item.validade && (e.preco_custo || 0) > 0
      );
      if (noEstLote?.preco_custo) return Number(noEstLote.preco_custo);

      const noEstGeral = estoque.find((e) => e.codigo?.trim() === cLimpo && (e.preco_custo || 0) > 0);
      if (noEstGeral?.preco_custo) return Number(noEstGeral.preco_custo);
    }
    return 0;
  };

  // Helper para calcular métricas financeiras completas de uma venda
  const calcularMetricasVenda = (venda: Venda) => {
    const valorTotal = Number(venda.valorTotal) || 0;
    let custoTotal = 0;
    let quantidadeItens = 0;

    (venda.itens || []).forEach((it) => {
      const qtd = Number(it.quantidade) || 1;
      quantidadeItens += qtd;
      const custoUnit = obterCustoItem(it);
      custoTotal += custoUnit * qtd;
    });

    const lucroReal = valorTotal - custoTotal;
    const margemPercentual = valorTotal > 0 ? (lucroReal / valorTotal) * 100 : 0;

    return {
      valorTotal,
      custoTotal,
      lucroReal,
      margemPercentual,
      quantidadeItens,
    };
  };

  // Datas para filtro de período
  const hojeDate = new Date();
  const inicioHoje = new Date(hojeDate.getFullYear(), hojeDate.getMonth(), hojeDate.getDate()).getTime();
  const ha7Dias = inicioHoje - 7 * 24 * 60 * 60 * 1000;
  const inicioMes = new Date(hojeDate.getFullYear(), hojeDate.getMonth(), 1).getTime();
  const inicioAno = new Date(hojeDate.getFullYear(), 0, 1).getTime();

  // 1. Filtragem Base (sem forma de pagamento, para KPIs e botões rápidos sincronizados)
  const vendasBase = vendas.filter((v) => {
    // Status
    if (statusFiltro !== 'todas' && v.status !== statusFiltro) return false;

    // Operador
    if (operadorFiltro !== 'todos' && v.operadorId !== operadorFiltro && v.operadorNome !== operadorFiltro) {
      return false;
    }

    // Período
    if (periodoFiltro === 'hoje' && v.timestamp < inicioHoje) return false;
    if (periodoFiltro === '7dias' && v.timestamp < ha7Dias) return false;
    if (periodoFiltro === 'mes' && v.timestamp < inicioMes) return false;
    if (periodoFiltro === 'ano' && v.timestamp < inicioAno) return false;

    // Busca textual
    if (busca.trim()) {
      const termo = busca.trim().toLowerCase();
      const emId = v.id.toLowerCase().includes(termo);
      const emOperador = (v.operadorNome || '').toLowerCase().includes(termo);
      const emForma = (v.formaPagamento || '').toLowerCase().includes(termo);
      const emItens = v.itens.some((i) => {
        const nomeFinal = obterNomeItem(i.codigo, i.nome).toLowerCase();
        return nomeFinal.includes(termo) || i.codigo.toLowerCase().includes(termo);
      });
      if (!emId && !emOperador && !emForma && !emItens) return false;
    }

    return true;
  });

  // 2. Filtragem Principal com Forma de Pagamento
  const vendasFiltradas = vendasBase.filter((v) => {
    if (formaPagamentoFiltro !== 'todas') {
      if (formaPagamentoFiltro === 'cartoes') {
        if (v.formaPagamento !== 'cartao_credito' && v.formaPagamento !== 'cartao_debito') return false;
      } else if (v.formaPagamento !== formaPagamentoFiltro) {
        return false;
      }
    }
    return true;
  });

  // 3. Cálculos e KPIs detalhados
  const vendasConcluidas = vendasFiltradas.filter((v) => v.status === 'concluida');
  const vendasEstornadas = vendasFiltradas.filter((v) => v.status === 'estornada');

  const faturamentoBruto = vendasConcluidas.reduce((acc, v) => acc + (v.valorTotal || 0), 0);
  const valorTotalEstornos = vendasEstornadas.reduce((acc, v) => acc + (v.valorTotal || 0), 0);

  // Volume total de itens faturados (quantidade física vendida)
  const totalItensVendidos = vendasConcluidas.reduce((acc, v) => {
    return acc + (v.itens || []).reduce((s, it) => s + (Number(it.quantidade) || 1), 0);
  }, 0);

  // Custo Total das Mercadorias Vendidas (CMV)
  const custoTotalMercadorias = vendasConcluidas.reduce((acc, v) => {
    return acc + (v.itens || []).reduce((s, it) => s + (obterCustoItem(it) * (Number(it.quantidade) || 1)), 0);
  }, 0);

  // O Que o Lojista Realmente Faturou (Lucro Líquido Real = Preço de Venda - Custo de Aquisição)
  const faturamentoLucroReal = faturamentoBruto - custoTotalMercadorias;
  const margemLucroMedia = faturamentoBruto > 0 ? (faturamentoLucroReal / faturamentoBruto) * 100 : 0;

  // Totais por Forma de Pagamento calculados da base do período/filtros
  const baseConcluidas = vendasBase.filter((v) => v.status === 'concluida');

  const totalDinheiro = baseConcluidas
    .filter((v) => v.formaPagamento === 'dinheiro')
    .reduce((acc, v) => acc + (v.valorTotal || 0), 0);
  const countDinheiro = baseConcluidas.filter((v) => v.formaPagamento === 'dinheiro').length;

  const totalPix = baseConcluidas
    .filter((v) => v.formaPagamento === 'pix')
    .reduce((acc, v) => acc + (v.valorTotal || 0), 0);
  const countPix = baseConcluidas.filter((v) => v.formaPagamento === 'pix').length;

  const totalCredito = baseConcluidas
    .filter((v) => v.formaPagamento === 'cartao_credito')
    .reduce((acc, v) => acc + (v.valorTotal || 0), 0);
  const countCredito = baseConcluidas.filter((v) => v.formaPagamento === 'cartao_credito').length;

  const totalDebito = baseConcluidas
    .filter((v) => v.formaPagamento === 'cartao_debito')
    .reduce((acc, v) => acc + (v.valorTotal || 0), 0);
  const countDebito = baseConcluidas.filter((v) => v.formaPagamento === 'cartao_debito').length;

  const totalFiado = baseConcluidas
    .filter((v) => v.formaPagamento === 'fiado')
    .reduce((acc, v) => acc + (v.valorTotal || 0), 0);
  const countFiado = baseConcluidas.filter((v) => v.formaPagamento === 'fiado').length;

  const totalCartoes = totalCredito + totalDebito;
  const countCartoes = countCredito + countDebito;

  // 4. Lógica de Paginação dos Registros
  const totalRegistros = vendasFiltradas.length;
  const numPorPagina = registrosPorPagina === 'todas' ? totalRegistros : Number(registrosPorPagina);
  const totalPaginas = registrosPorPagina === 'todas' || numPorPagina === 0 ? 1 : Math.max(1, Math.ceil(totalRegistros / numPorPagina));
  const paginaCorreta = Math.min(Math.max(1, paginaAtual), totalPaginas);
  const indiceInicio = registrosPorPagina === 'todas' ? 0 : (paginaCorreta - 1) * numPorPagina;
  const indiceFim = registrosPorPagina === 'todas' ? totalRegistros : Math.min(totalRegistros, indiceInicio + numPorPagina);
  const vendasPaginadas = vendasFiltradas.slice(indiceInicio, indiceFim);

  const handleConfirmarEstorno = () => {
    if (!vendaEstornar) return;
    onEstornarVenda(vendaEstornar.id, motivoEstorno || 'Solicitado pelo supervisor');
    setVendaEstornar(null);
    setMotivoEstorno('');
    setErroEstorno('');
  };

  const getBadgePagamento = (forma: string) => {
    switch (forma) {
      case 'pix':
        return (
          <span
            style={{
              background: '#dcfce7',
              color: '#15803d',
              border: '1px solid #bbf7d0',
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            📱 PIX
          </span>
        );
      case 'cartao_credito':
        return (
          <span
            style={{
              background: '#e0f2fe',
              color: '#0369a1',
              border: '1px solid #bae6fd',
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            💳 Crédito
          </span>
        );
      case 'cartao_debito':
        return (
          <span
            style={{
              background: '#fef3c7',
              color: '#b45309',
              border: '1px solid #fde68a',
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            💳 Débito
          </span>
        );
      case 'dinheiro':
        return (
          <span
            style={{
              background: '#f3e8ff',
              color: '#6b21a8',
              border: '1px solid #e9d5ff',
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            💵 Dinheiro
          </span>
        );
      case 'fiado':
        return (
          <span
            style={{
              background: '#fee2e2',
              color: '#991b1b',
              border: '1px solid #fecaca',
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            📝 Fiado / A Prazo
          </span>
        );
      default:
        return (
          <span
            style={{
              background: '#f1f5f9',
              color: '#475569',
              border: '1px solid #e2e8f0',
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {forma || 'Outros'}
          </span>
        );
    }
  };

  return (
    <div
      ref={modalRef}
      className="tela-relatorio-cheia"
      style={{ display: 'flex', zIndex: 9999 }}
    >
      {/* CABEÇALHO FIXO */}
      <div className="cabecalho-relatorio">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
          <span style={{ fontSize: '1.1rem' }}>🧾</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Relatório Geral de Vendas ({nomeLoja})
          </span>
        </h2>
        <button
          className="btn-voltar-rel"
          onClick={onFechar}
          style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)', whiteSpace: 'nowrap' }}
        >
          ✕ Fechar
        </button>
      </div>

      {/* CORPO DO RELATÓRIO COM ROLAGEM SUAVE */}
      <div
        ref={corpoRef}
        className="corpo-relatorio-cheio"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* CARDS KPIS PRINCIPAIS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
          {/* 1. Quantidade de Vendas e Volume de Itens Faturados */}
          <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total de Vendas</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              {vendasConcluidas.length} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16a34a' }}>concluídas</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 600, marginTop: '3px' }}>
              📦 <b>{totalItensVendidos}</b> un. vendidas
            </div>
          </div>

          {/* 2. Total Vendido no Caixa (Receita Bruta) */}
          <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.74rem', color: '#0369a1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Receita Bruta (Vendas)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
              R$ {faturamentoBruto.toFixed(2).replace('.', ',')}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px' }}>
              Total movimentado no caixa
            </div>
          </div>

          {/* 3. Custo das Mercadorias Vendidas (CMV) */}
          <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fed7aa', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.74rem', color: '#9a3412', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Custo dos Produtos (CMV)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c2410c', marginTop: '2px' }}>
              R$ {custoTotalMercadorias.toFixed(2).replace('.', ',')}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#7c2d12', marginTop: '3px' }}>
              Custo de aquisição dos itens
            </div>
          </div>

          {/* 4. O QUE O LOJISTA REALMENTE FATUROU (LUCRO REAL / GANHO LÍQUIDO) - CARD EM DESTAQUE */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '2px solid #86efac',
              boxShadow: '0 2px 6px rgba(22, 163, 74, 0.12)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.74rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                💰 Só com o Lucro
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#15803d', background: '#ffffff', padding: '1px 6px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                +{margemLucroMedia.toFixed(1)}%
              </span>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#15803d', marginTop: '2px' }}>
              R$ {faturamentoLucroReal.toFixed(2).replace('.', ',')}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600, marginTop: '3px' }}>
              Valor vendido retirando o custo (só o lucro)
            </div>
          </div>

          {/* 5. Em Dinheiro */}
          <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.74rem', color: '#6b21a8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>💵 Em Dinheiro</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#7e22ce', marginTop: '2px' }}>
              R$ {totalDinheiro.toFixed(2).replace('.', ',')}{' '}
              <small style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>({countDinheiro})</small>
            </div>
          </div>

          {/* 6. Em PIX */}
          <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>📱 Em PIX</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>
              R$ {totalPix.toFixed(2).replace('.', ',')}{' '}
              <small style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>({countPix})</small>
            </div>
          </div>

          {/* 7. Em Cartões */}
          <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.74rem', color: '#0369a1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>💳 Em Cartões</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
              R$ {totalCartoes.toFixed(2).replace('.', ',')}{' '}
              <small style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>({countCartoes})</small>
            </div>
          </div>

          {/* 8. Fiado (se houver) */}
          {countFiado > 0 && (
            <div style={{ background: '#fff1f2', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fecdd3', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.74rem', color: '#9f1239', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>📝 Em Fiado / A Prazo</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#e11d48', marginTop: '2px' }}>
                R$ {totalFiado.toFixed(2).replace('.', ',')}{' '}
                <small style={{ fontSize: '0.72rem', color: '#881337', fontWeight: 500 }}>({countFiado})</small>
              </div>
            </div>
          )}

          {/* 9. Estornos (se houver) */}
          {vendasEstornadas.length > 0 && (
            <div style={{ background: '#fef2f2', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fecaca', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.74rem', color: '#991b1b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>🔴 Estornos</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
                R$ {valorTotalEstornos.toFixed(2).replace('.', ',')}{' '}
                <small style={{ fontSize: '0.72rem', color: '#7f1d1d', fontWeight: 500 }}>({vendasEstornadas.length})</small>
              </div>
            </div>
          )}
        </div>

        {/* ATALHOS RÁPIDOS DE FILTRAGEM POR FORMA DE PAGAMENTO */}
        <div
          style={{
            background: '#ffffff',
            padding: '10px 12px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, marginRight: '4px', flexShrink: 0 }}>
            Filtrar Forma:
          </span>

          <button
            style={{
              padding: '5px 10px',
              borderRadius: '20px',
              border: formaPagamentoFiltro === 'todas' ? '1px solid #0284c7' : '1px solid #e2e8f0',
              background: formaPagamentoFiltro === 'todas' ? '#0284c7' : '#f8fafc',
              color: formaPagamentoFiltro === 'todas' ? '#ffffff' : '#334155',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onClick={() => {
              setFormaPagamentoFiltro('todas');
              setPaginaAtual(1);
            }}
          >
            Todas ({baseConcluidas.length})
          </button>

          <button
            style={{
              padding: '5px 10px',
              borderRadius: '20px',
              border: formaPagamentoFiltro === 'dinheiro' ? '1px solid #9333ea' : '1px solid #f3e8ff',
              background: formaPagamentoFiltro === 'dinheiro' ? '#9333ea' : '#faf5ff',
              color: formaPagamentoFiltro === 'dinheiro' ? '#ffffff' : '#6b21a8',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onClick={() => {
              setFormaPagamentoFiltro('dinheiro');
              setPaginaAtual(1);
            }}
          >
            💵 Dinheiro (R$ {totalDinheiro.toFixed(2)})
          </button>

          <button
            style={{
              padding: '5px 10px',
              borderRadius: '20px',
              border: formaPagamentoFiltro === 'pix' ? '1px solid #16a34a' : '1px solid #dcfce7',
              background: formaPagamentoFiltro === 'pix' ? '#16a34a' : '#f0fdf4',
              color: formaPagamentoFiltro === 'pix' ? '#ffffff' : '#15803d',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onClick={() => {
              setFormaPagamentoFiltro('pix');
              setPaginaAtual(1);
            }}
          >
            📱 PIX (R$ {totalPix.toFixed(2)})
          </button>

          <button
            style={{
              padding: '5px 10px',
              borderRadius: '20px',
              border: formaPagamentoFiltro === 'cartoes' ? '1px solid #0284c7' : '1px solid #e0f2fe',
              background: formaPagamentoFiltro === 'cartoes' ? '#0284c7' : '#f0f9ff',
              color: formaPagamentoFiltro === 'cartoes' ? '#ffffff' : '#0369a1',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onClick={() => {
              setFormaPagamentoFiltro('cartoes');
              setPaginaAtual(1);
            }}
          >
            💳 Todos Cartões (R$ {totalCartoes.toFixed(2)})
          </button>

          <button
            style={{
              padding: '5px 10px',
              borderRadius: '20px',
              border: formaPagamentoFiltro === 'cartao_credito' ? '1px solid #0369a1' : '1px solid #e0f2fe',
              background: formaPagamentoFiltro === 'cartao_credito' ? '#0369a1' : '#f8fafc',
              color: formaPagamentoFiltro === 'cartao_credito' ? '#ffffff' : '#0369a1',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onClick={() => {
              setFormaPagamentoFiltro('cartao_credito');
              setPaginaAtual(1);
            }}
          >
            💳 Crédito (R$ {totalCredito.toFixed(2)})
          </button>

          <button
            style={{
              padding: '5px 10px',
              borderRadius: '20px',
              border: formaPagamentoFiltro === 'cartao_debito' ? '1px solid #b45309' : '1px solid #fef3c7',
              background: formaPagamentoFiltro === 'cartao_debito' ? '#b45309' : '#fffbeb',
              color: formaPagamentoFiltro === 'cartao_debito' ? '#ffffff' : '#92400e',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onClick={() => {
              setFormaPagamentoFiltro('cartao_debito');
              setPaginaAtual(1);
            }}
          >
            💳 Débito (R$ {totalDebito.toFixed(2)})
          </button>

          {countFiado > 0 && (
            <button
              style={{
                padding: '5px 10px',
                borderRadius: '20px',
                border: formaPagamentoFiltro === 'fiado' ? '1px solid #e11d48' : '1px solid #ffe4e6',
                background: formaPagamentoFiltro === 'fiado' ? '#e11d48' : '#fff1f2',
                color: formaPagamentoFiltro === 'fiado' ? '#ffffff' : '#9f1239',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0,
              }}
              onClick={() => {
                setFormaPagamentoFiltro('fiado');
                setPaginaAtual(1);
              }}
            >
              📝 Fiado (R$ {totalFiado.toFixed(2)})
            </button>
          )}
        </div>

        {/* BARRA DE FILTROS COMPLETOS */}
        <div style={{ background: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="input-modal"
              placeholder="🔍 Buscar por operador, ID da venda, produto ou forma..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPaginaAtual(1);
              }}
              style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}
            />

            {/* SELETOR DE FORMA DE PAGAMENTO */}
            <select
              className="input-modal"
              value={formaPagamentoFiltro}
              onChange={(e) => {
                setFormaPagamentoFiltro(e.target.value as any);
                setPaginaAtual(1);
              }}
              style={{ width: 'auto', minWidth: '150px', marginBottom: 0 }}
            >
              <option value="todas">Forma: Todas</option>
              <option value="dinheiro">💵 Apenas Dinheiro</option>
              <option value="pix">📱 Apenas PIX</option>
              <option value="cartoes">💳 Todos os Cartões</option>
              <option value="cartao_credito">💳 Cartão de Crédito</option>
              <option value="cartao_debito">💳 Cartão de Débito</option>
              <option value="fiado">📝 Fiado / A Prazo</option>
            </select>

            <select
              className="input-modal"
              value={statusFiltro}
              onChange={(e) => {
                setStatusFiltro(e.target.value as any);
                setPaginaAtual(1);
              }}
              style={{ width: 'auto', minWidth: '140px', marginBottom: 0 }}
            >
              <option value="todas">Status: Todas</option>
              <option value="concluida">🟢 Apenas Concluídas</option>
              <option value="estornada">🔴 Apenas Estornadas</option>
            </select>

            <select
              className="input-modal"
              value={periodoFiltro}
              onChange={(e) => {
                setPeriodoFiltro(e.target.value as any);
                setPaginaAtual(1);
              }}
              style={{ width: 'auto', minWidth: '140px', marginBottom: 0 }}
            >
              <option value="todos">Período: Todo o Histórico</option>
              <option value="hoje">📅 Apenas Hoje</option>
              <option value="7dias">📅 Últimos 7 Dias</option>
              <option value="mes">📅 Este Mês</option>
              <option value="ano">📅 Este Ano</option>
            </select>

            <select
              className="input-modal"
              value={operadorFiltro}
              onChange={(e) => {
                setOperadorFiltro(e.target.value);
                setPaginaAtual(1);
              }}
              style={{ width: 'auto', minWidth: '150px', marginBottom: 0 }}
            >
              <option value="todos">Operador: Todos</option>
              {operadores.map((op) => (
                <option key={op.id} value={op.id}>
                  👤 {op.nome}
                </option>
              ))}
            </select>

            <button
              className="btn btn-salvar"
              style={{ padding: '6px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
              onClick={() => exportarVendasCSV(vendasFiltradas, nomeLoja, estoque)}
            >
              📥 Exportar CSV
            </button>
          </div>
        </div>

        {/* LISTA DE VENDAS */}
        <div
          className="tabela-relatorio"
          style={{
            background: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* CABEÇALHO DA LISTA DE REGISTROS */}
          <div
            style={{
              padding: '10px 14px',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              position: 'sticky',
              top: 0,
              zIndex: 10,
              borderRadius: '10px 10px 0 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                📋 Exibindo{' '}
                {totalRegistros > 0
                  ? (registrosPorPagina === 'todas'
                      ? `todos os ${totalRegistros}`
                      : `registros ${indiceInicio + 1}–${indiceFim} de ${totalRegistros}`)
                  : '0'} registro(s) de venda
              </span>
              {formaPagamentoFiltro !== 'todas' && (
                <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600, background: '#e0f2fe', padding: '2px 8px', borderRadius: '12px' }}>
                  Filtro: {formaPagamentoFiltro.replace('_', ' ').toUpperCase()} (
                  <button
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 700, padding: 0 }}
                    onClick={() => {
                      setFormaPagamentoFiltro('todas');
                      setPaginaAtual(1);
                    }}
                  >
                    ✕ remover
                  </button>
                  )
                </span>
              )}
            </div>

            {/* SELETOR DE REGISTROS POR PÁGINA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label htmlFor="select-registros-pagina" style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
                Exibir:
              </label>
              <select
                id="select-registros-pagina"
                value={registrosPorPagina}
                onChange={(e) => {
                  const val = e.target.value === 'todas' ? 'todas' : Number(e.target.value);
                  setRegistrosPorPagina(val as any);
                  setPaginaAtual(1);
                }}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  cursor: 'pointer',
                }}
              >
                <option value={10}>10 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
                <option value={100}>100 por página</option>
                <option value="todas">Todas ({totalRegistros})</option>
              </select>
            </div>
          </div>

          {/* LISTAGEM DE CARDS DE VENDAS */}
          {vendasFiltradas.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '40px 20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
              <b>Nenhuma venda encontrada para os filtros selecionados.</b>
              <p style={{ fontSize: '0.82rem', marginTop: '4px', color: '#94a3b8' }}>
                Tente alterar a forma de pagamento, período ou termo de busca.
              </p>
            </div>
          ) : (
            vendasPaginadas.map((venda) => {
              const isEstornada = venda.status === 'estornada';
              const isExpandida = vendaExpandidaId === venda.id;
              const metricasVenda = calcularMetricasVenda(venda);

              return (
                <div
                  key={venda.id}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    background: isEstornada ? '#fef2f2' : '#ffffff',
                    opacity: isEstornada ? 0.9 : 1,
                  }}
                >
                  {/* CABEÇALHO DO CARD DE VENDA */}
                  <div
                    style={{
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ flex: 1, minWidth: '180px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <b style={{ fontSize: '0.94rem', color: '#0f172a' }}>Venda #{venda.id.slice(-6)}</b>
                          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            📅 {venda.data} às {venda.hora}
                          </span>
                          {getBadgePagamento(venda.formaPagamento)}
                          {isEstornada ? (
                            <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                              🔴 Estornada
                            </span>
                          ) : (
                            <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                              🟢 Concluída
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '4px', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                          👤 <b>Vendedor/Caixa:</b> {venda.operadorNome || 'Caixa'}
                          {venda.lojaId && <span style={{ color: '#64748b', marginLeft: '6px' }}>({nomeLoja})</span>}
                        </div>

                        {isEstornada && venda.motivoEstorno && (
                          <div style={{ fontSize: '0.78rem', color: '#991b1b', marginTop: '4px', background: '#fee2e2', padding: '6px 8px', borderRadius: '4px', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                            ⚠️ Motivo do Estorno: {venda.motivoEstorno} (Por: {venda.operadorEstornoNome || 'Supervisor'}) em {venda.dataEstorno}
                          </div>
                        )}
                      </div>

                      {/* BLOCO FINANCEIRO DA VENDA: TOTAL VENDIDO, CUSTO E LUCRO REAL */}
                      <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: isEstornada ? '#991b1b' : '#0f172a' }}>
                          <small style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginRight: '4px' }}>Venda:</small>
                          R$ {(metricasVenda.valorTotal || 0).toFixed(2).replace('.', ',')}
                        </div>

                        {!isEstornada && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            {metricasVenda.custoTotal > 0 && (
                              <span style={{ fontSize: '0.72rem', color: '#64748b', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                                Custo: R$ {metricasVenda.custoTotal.toFixed(2).replace('.', ',')}
                              </span>
                            )}
                            <span
                              style={{
                                fontSize: '0.76rem',
                                fontWeight: 800,
                                color: metricasVenda.lucroReal >= 0 ? '#15803d' : '#b91c1c',
                                background: metricasVenda.lucroReal >= 0 ? '#dcfce7' : '#fee2e2',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                border: metricasVenda.lucroReal >= 0 ? '1px solid #86efac' : '1px solid #fca5a5',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                              }}
                              title="Faturamento Líquido Real desta venda (Valor Vendido - Custo dos Produtos)"
                            >
                              <span>Faturou:</span>
                              <b>{metricasVenda.lucroReal >= 0 ? '+' : ''}R$ {metricasVenda.lucroReal.toFixed(2).replace('.', ',')}</b>
                              {metricasVenda.margemPercentual > 0 && (
                                <small style={{ fontSize: '0.68rem', opacity: 0.9 }}>({metricasVenda.margemPercentual.toFixed(1)}%)</small>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', width: '100%', borderTop: '1px dashed #e2e8f0', paddingTop: '8px', marginTop: '2px' }}>
                      {onVerCupom && (
                        <button
                          className="btn-acao-rel"
                          style={{ background: '#f1f5f9', color: '#0f172a', fontWeight: 600, flex: 1, minWidth: '80px', padding: '6px 10px', textAlign: 'center', justifyContent: 'center' }}
                          onClick={() => onVerCupom(venda)}
                        >
                          🧾 Cupom
                        </button>
                      )}

                      <button
                        className="btn-acao-rel btn-editar-rel"
                        style={{ flex: 1, minWidth: '110px', padding: '6px 10px', textAlign: 'center', justifyContent: 'center' }}
                        onClick={() => setVendaExpandidaId(isExpandida ? null : venda.id)}
                      >
                        {isExpandida
                          ? '▲ Ocultar Itens'
                          : `▼ Ver Itens (${metricasVenda.quantidadeItens} un • Faturou: R$ ${metricasVenda.lucroReal.toFixed(2)})`}
                      </button>

                      {!isEstornada && (
                        <button
                          className="btn-acao-rel btn-excluir-rel"
                          style={{ background: '#fee2e2', color: '#dc2626', fontWeight: 700, flex: 1, minWidth: '100px', padding: '6px 10px', textAlign: 'center', justifyContent: 'center' }}
                          onClick={() => setVendaEstornar(venda)}
                        >
                          🔄 Estornar Venda
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ITENS DETALHADOS DA VENDA COM PREÇO DE VENDA, PREÇO DE CUSTO E FATURAMENTO REAL */}
                  {isExpandida && (
                    <div style={{ background: '#f8fafc', padding: '10px 14px', borderTop: '1px dashed #cbd5e1' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                          📋 Itens desta Venda ({venda.itens?.length || 0} produtos • {metricasVenda.quantidadeItens} un):
                        </div>
                        {!isEstornada && (
                          <div style={{ fontSize: '0.74rem', color: '#166534', fontWeight: 700, background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                            Lucro Real da Venda: +R$ {metricasVenda.lucroReal.toFixed(2).replace('.', ',')} ({metricasVenda.margemPercentual.toFixed(1)}%)
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {(venda.itens || []).map((item, idx) => {
                          const nomeResolvido = obterNomeItem(item.codigo, item.nome);
                          const fotoItem = item.foto || catalogoGlobal.find((c) => c.codigo?.trim() === item.codigo?.trim())?.imagem;
                          const qtdItem = Number(item.quantidade) || 1;
                          const precoUnit = Number(item.preco_unitario) || 0;
                          const subtotalItem = Number(item.subtotal) || (qtdItem * precoUnit);
                          const custoUnit = obterCustoItem(item);
                          const custoTotalItem = custoUnit * qtdItem;
                          const lucroItem = subtotalItem - custoTotalItem;
                          const margemItem = subtotalItem > 0 ? (lucroItem / subtotalItem) * 100 : 0;

                          return (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.82rem',
                                background: '#ffffff',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                flexWrap: 'wrap',
                                gap: '8px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '180px', flex: 1 }}>
                                {fotoItem ? (
                                  <img
                                    src={fotoItem}
                                    alt={nomeResolvido}
                                    referrerPolicy="no-referrer"
                                    style={{ width: 34, height: 34, objectFit: 'contain', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0' }}
                                  />
                                ) : (
                                  <div style={{ width: 34, height: 34, borderRadius: '4px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', border: '1px solid #e2e8f0' }}>
                                    📦
                                  </div>
                                )}
                                <div>
                                  <b style={{ color: '#0f172a' }}>{nomeResolvido}</b>
                                  <div style={{ color: '#64748b', fontSize: '0.74rem' }}>
                                    Cód: {item.codigo || 'N/D'} {item.lote ? `| Lote: ${item.lote}` : ''}
                                  </div>
                                </div>
                              </div>

                              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
                                <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                                  <span style={{ color: '#64748b' }}>{qtdItem} un × R$ {precoUnit.toFixed(2)} = </span>
                                  <b style={{ color: '#0284c7' }}>R$ {subtotalItem.toFixed(2)}</b>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                  <span style={{ color: '#64748b', background: '#f8fafc', padding: '1px 5px', borderRadius: '3px', border: '1px solid #e2e8f0' }}>
                                    Custo: R$ {custoUnit.toFixed(2)} {qtdItem > 1 ? `(Tot: R$ ${custoTotalItem.toFixed(2)})` : ''}
                                  </span>
                                  <span style={{ color: lucroItem >= 0 ? '#15803d' : '#dc2626', fontWeight: 700, background: lucroItem >= 0 ? '#dcfce7' : '#fee2e2', padding: '1px 6px', borderRadius: '3px' }}>
                                    Faturou: {lucroItem >= 0 ? '+' : ''}R$ {lucroItem.toFixed(2)} {margemItem > 0 ? `(${margemItem.toFixed(1)}%)` : ''}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* BARRA DE PAGINAÇÃO INFERIOR */}
          {totalPaginas > 1 && registrosPorPagina !== 'todas' && (
            <div
              style={{
                padding: '12px 14px',
                background: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                borderRadius: '0 0 10px 10px',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                Página <b style={{ color: '#0f172a' }}>{paginaCorreta}</b> de <b style={{ color: '#0f172a' }}>{totalPaginas}</b> ({totalRegistros} vendas filtradas)
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  type="button"
                  disabled={paginaCorreta <= 1}
                  onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: paginaCorreta <= 1 ? '#f1f5f9' : '#ffffff',
                    color: paginaCorreta <= 1 ? '#94a3b8' : '#1e293b',
                    cursor: paginaCorreta <= 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}
                >
                  ◀ Anterior
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                  .filter((pg) => pg === 1 || pg === totalPaginas || Math.abs(pg - paginaCorreta) <= 2)
                  .map((pg, idx, arr) => {
                    const anterior = arr[idx - 1];
                    const mostrarReticencias = anterior && pg - anterior > 1;

                    return (
                      <React.Fragment key={pg}>
                        {mostrarReticencias && (
                          <span style={{ padding: '0 4px', color: '#94a3b8', fontSize: '0.75rem' }}>...</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setPaginaAtual(pg)}
                          style={{
                            padding: '5px 9px',
                            borderRadius: '6px',
                            border: pg === paginaCorreta ? '1px solid #0284c7' : '1px solid #cbd5e1',
                            background: pg === paginaCorreta ? '#0284c7' : '#ffffff',
                            color: pg === paginaCorreta ? '#ffffff' : '#334155',
                            fontSize: '0.78rem',
                            fontWeight: pg === paginaCorreta ? 800 : 600,
                            cursor: 'pointer',
                            minWidth: '28px',
                          }}
                        >
                          {pg}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  type="button"
                  disabled={paginaCorreta >= totalPaginas}
                  onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: paginaCorreta >= totalPaginas ? '#f1f5f9' : '#ffffff',
                    color: paginaCorreta >= totalPaginas ? '#94a3b8' : '#1e293b',
                    cursor: paginaCorreta >= totalPaginas ? 'not-allowed' : 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}
                >
                  Próxima ▶
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE ESTORNO */}
      {vendaEstornar && (
        <div className="modal" style={{ display: 'flex', zIndex: 600 }}>
          <div className="modal-conteudo" style={{ maxWidth: '420px', borderTop: '6px solid #dc2626' }}>
            <div className="cab-modal" style={{ background: '#fee2e2', color: '#991b1b' }}>
              🔄 Confirmar Estorno de Venda
            </div>
            <div className="corpo-modal" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '0.88rem', color: '#334155', margin: 0 }}>
                Tem certeza que deseja estornar a <b>Venda #{vendaEstornar.id.slice(-6)}</b> no valor de{' '}
                <b style={{ color: '#dc2626' }}>R$ {(vendaEstornar.valorTotal || 0).toFixed(2)}</b>?
              </p>

              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', fontSize: '0.8rem', color: '#475569' }}>
                📦 <b>Resultado do Estorno:</b> Os <b>{(vendaEstornar.itens || []).reduce((a, b) => a + (b.quantidade || 1), 0)} itens</b> vendidos serão devolvidos automaticamente ao estoque da loja!
              </div>

              <div className="grupo-input" style={{ marginBottom: 0 }}>
                <label className="rotulo-campo">Motivo do Estorno / Observação</label>
                <input
                  type="text"
                  className="input-modal"
                  placeholder="Ex: Desistência do cliente / Erro no caixa"
                  value={motivoEstorno}
                  onChange={(e) => setMotivoEstorno(e.target.value)}
                />
              </div>

              <div className="grupo-botoes">
                <button
                  className="btn btn-salvar"
                  style={{ background: '#dc2626' }}
                  onClick={handleConfirmarEstorno}
                >
                  Confirmar Estorno & Devolver ao Estoque
                </button>
                <button
                  className="btn btn-cancelar"
                  onClick={() => setVendaEstornar(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

