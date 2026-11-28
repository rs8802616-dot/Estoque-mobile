import React, { useState, useRef, useMemo } from 'react';
import {
  AlertTriangle,
  Ban,
  Banknote,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Package,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  Search,
  Smartphone,
  TrendingUp,
  User,
  Wallet,
  X,
} from 'lucide-react';
import { Venda, ItemEstoque, OperadorCaixa, ProdutoCatalogo } from '../types';
import { exportarVendasCSV } from '../lib/exportUtils';
import { useVoltarHierarquico } from '../hooks/useVoltarHierarquico';
import {
  calcularMetricasVenda,
  construirMapaCustoPorCodigo,
  estaNoPeriodo,
  MetricasVendaCalculadas,
  obterCustoUnitarioItem,
  parseDataVenda,
} from '../utils/relatoriosFinanceiros';

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
  erroSync?: string | null;
  onRefazerLogin?: () => void;
}

function formatarMoeda(valor: number): string {
  return `R$ ${(Number(valor) || 0).toFixed(2).replace('.', ',')}`;
}

function formatarDataExibicao(data?: string): string {
  const s = String(data || '').trim();
  const partes = s.split('-');
  if (partes.length === 3 && partes[0].length === 4) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return s || '--/--/----';
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
  erroSync = null,
  onRefazerLogin,
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

  const modalRef = useRef<HTMLDivElement>(null);
  const corpoRef = useRef<HTMLDivElement>(null);

  // Modal de confirmação de estorno
  const [vendaEstornar, setVendaEstornar] = useState<Venda | null>(null);
  const [motivoEstorno, setMotivoEstorno] = useState('');

  // Venda expandida para ver itens detalhados
  const [vendaExpandidaId, setVendaExpandidaId] = useState<string | null>(null);

  const handleVoltarOuFechar = () => {
    if (vendaEstornar) {
      setVendaEstornar(null);
      return;
    }
    if (vendaExpandidaId) {
      setVendaExpandidaId(null);
      return;
    }
    onFechar();
  };

  const mapaCusto = useMemo(
    () => construirMapaCustoPorCodigo(estoque, catalogoGlobal),
    [estoque, catalogoGlobal]
  );

  const mapaCatalogoPorCodigo = useMemo(() => {
    const mapa = new Map<string, ProdutoCatalogo>();
    catalogoGlobal.forEach((c) => {
      const cod = String(c?.codigo || '').trim();
      if (cod && !mapa.has(cod)) mapa.set(cod, c);
    });
    return mapa;
  }, [catalogoGlobal]);

  useVoltarHierarquico(visivel, handleVoltarOuFechar);

  if (!visivel) return null;

  // Helper para obter nome canônico do catálogo Master (O(1))
  const obterNomeItem = (codigo?: string, nomeOriginal?: string): string => {
    if (!codigo) return nomeOriginal || 'Item sem nome';
    const cat = mapaCatalogoPorCodigo.get(codigo.trim());
    if (cat && cat.nome && cat.nome.trim().length > 0) {
      return cat.nome.trim();
    }
    return nomeOriginal || 'Item sem nome';
  };

  // 1. Filtragem Base (sem forma de pagamento, para KPIs e botões rápidos sincronizados)
  const vendasBase = vendas.filter((v) => {
    if (statusFiltro !== 'todas' && v.status !== statusFiltro) return false;

    if (
      operadorFiltro !== 'todos' &&
      v.operadorId !== operadorFiltro &&
      v.operadorNome !== operadorFiltro
    ) {
      return false;
    }

    if (!estaNoPeriodo(parseDataVenda(v), periodoFiltro)) return false;

    if (busca.trim()) {
      const termo = busca.trim().toLowerCase();
      const emId = (v.id || '').toLowerCase().includes(termo);
      const emOperador = (v.operadorNome || '').toLowerCase().includes(termo);
      const emForma = (v.formaPagamento || '').toLowerCase().includes(termo);
      const emItens = (v.itens || []).some((i) => {
        const nomeFinal = obterNomeItem(i.codigo, i.nome).toLowerCase();
        return nomeFinal.includes(termo) || (i.codigo || '').toLowerCase().includes(termo);
      });
      if (!emId && !emOperador && !emForma && !emItens) return false;
    }

    return true;
  });

  // 2. Filtragem Principal com Forma de Pagamento
  const vendasFiltradas = vendasBase.filter((v) => {
    if (formaPagamentoFiltro !== 'todas') {
      if (formaPagamentoFiltro === 'cartoes') {
        if (v.formaPagamento !== 'cartao_credito' && v.formaPagamento !== 'cartao_debito') {
          return false;
        }
      } else if (v.formaPagamento !== formaPagamentoFiltro) {
        return false;
      }
    }
    return true;
  });

  // 3. Cálculos e KPIs detalhados usando motor unificado
  const vendasConcluidas = vendasFiltradas.filter((v) => v.status === 'concluida');
  const vendasEstornadas = vendasFiltradas.filter((v) => v.status === 'estornada');

  const metricasConcluidas = vendasConcluidas.map((v) => calcularMetricasVenda(v, mapaCusto));
  const faturamentoBruto = metricasConcluidas.reduce((acc, m) => acc + m.valorTotal, 0);
  const valorTotalEstornos = vendasEstornadas.reduce((acc, v) => acc + (Number(v.valorTotal) || 0), 0);
  const ticketMedio = vendasConcluidas.length > 0 ? faturamentoBruto / vendasConcluidas.length : 0;

  const totalItensVendidos = metricasConcluidas.reduce((acc, m) => acc + m.qtdItens, 0);
  const custoTotalMercadorias = metricasConcluidas.reduce((acc, m) => acc + m.custoTotal, 0);

  const faturamentoLucroReal = faturamentoBruto - custoTotalMercadorias;
  const margemLucroMedia =
    faturamentoBruto > 0 ? (faturamentoLucroReal / faturamentoBruto) * 100 : 0;

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
  const totalPaginas =
    registrosPorPagina === 'todas' || numPorPagina === 0
      ? 1
      : Math.max(1, Math.ceil(totalRegistros / numPorPagina));
  const paginaCorreta = Math.min(Math.max(1, paginaAtual), totalPaginas);
  const indiceInicio = registrosPorPagina === 'todas' ? 0 : (paginaCorreta - 1) * numPorPagina;
  const indiceFim =
    registrosPorPagina === 'todas'
      ? totalRegistros
      : Math.min(totalRegistros, indiceInicio + numPorPagina);
  const vendasPaginadas = vendasFiltradas.slice(indiceInicio, indiceFim);

  const temFiltroAtivo =
    statusFiltro !== 'todas' ||
    formaPagamentoFiltro !== 'todas' ||
    operadorFiltro !== 'todos' ||
    periodoFiltro !== 'todos' ||
    busca.trim().length > 0;

  const limparFiltros = () => {
    setBusca('');
    setStatusFiltro('todas');
    setFormaPagamentoFiltro('todas');
    setOperadorFiltro('todos');
    setPeriodoFiltro('todos');
    setPaginaAtual(1);
  };

  const handleConfirmarEstorno = () => {
    if (!vendaEstornar) return;
    onEstornarVenda(vendaEstornar.id, motivoEstorno || 'Solicitado pelo supervisor');
    setVendaEstornar(null);
    setMotivoEstorno('');
  };

  const getBadgePagamento = (forma: string) => {
    switch (forma) {
      case 'pix':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
            <Smartphone className="w-3 h-3 shrink-0" />
            <span>PIX</span>
          </span>
        );
      case 'cartao_credito':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200 whitespace-nowrap">
            <CreditCard className="w-3 h-3 shrink-0" />
            <span>Crédito</span>
          </span>
        );
      case 'cartao_debito':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
            <CreditCard className="w-3 h-3 shrink-0" />
            <span>Débito</span>
          </span>
        );
      case 'dinheiro':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-violet-50 text-violet-700 border border-violet-200 whitespace-nowrap">
            <Banknote className="w-3 h-3 shrink-0" />
            <span>Dinheiro</span>
          </span>
        );
      case 'fiado':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
            <FileText className="w-3 h-3 shrink-0" />
            <span>Fiado</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
            {forma || 'Outros'}
          </span>
        );
    }
  };

  const renderDetalhesItens = (
    venda: Venda,
    isEstornada: boolean,
    metricasVenda: MetricasVendaCalculadas
  ) => (
    <div className="bg-slate-50 px-4 py-3 border-t border-slate-200/80 space-y-2.5">
      {isEstornada && venda.motivoEstorno && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong>Motivo do Estorno:</strong> {venda.motivoEstorno}{' '}
            <span className="text-red-700/80">
              (Por: {venda.operadorEstornoNome || 'Supervisor'}
              {venda.dataEstorno ? ` em ${venda.dataEstorno}` : ''})
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-bold text-slate-600">
          Itens da venda ({venda.itens?.length || 0} produtos • {metricasVenda.qtdItens} un)
        </span>
        {!isEstornada && (
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 font-mono">
            Lucro Real: +{formatarMoeda(metricasVenda.lucroReal)} (
            {metricasVenda.margemPercentual.toFixed(1)}%)
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {(venda.itens || []).map((item, idx) => {
          const nomeResolvido = obterNomeItem(item.codigo, item.nome);
          const fotoItem =
            item.foto || (item.codigo ? mapaCatalogoPorCodigo.get(item.codigo.trim())?.imagem : undefined);
          const qtdItem = Number(item.quantidade) || 0;
          const precoUnit = Number(item.preco_unitario) || 0;
          const subtotalItem = Number(item.subtotal ?? qtdItem * precoUnit) || 0;
          const { custo: custoUnit } = obterCustoUnitarioItem(item, mapaCusto);
          const custoTotalItem = custoUnit * qtdItem;
          const lucroItem = subtotalItem - custoTotalItem;
          const margemItem = subtotalItem > 0 ? (lucroItem / subtotalItem) * 100 : 0;

          return (
            <div
              key={idx}
              className="flex items-center justify-between flex-wrap gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-[180px] flex-1">
                {fotoItem ? (
                  <img
                    src={fotoItem}
                    alt={nomeResolvido}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 object-contain rounded bg-slate-50 border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate">{nomeResolvido}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Cód: {item.codigo || 'N/D'}
                    {item.lote ? ` • Lote: ${item.lote}` : ''}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="font-mono text-xs text-slate-700">
                  <span className="text-slate-500">
                    {qtdItem} × {formatarMoeda(precoUnit)} ={' '}
                  </span>
                  <strong className="text-sky-700">{formatarMoeda(subtotalItem)}</strong>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap justify-end text-[11px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    Custo: {formatarMoeda(custoUnit)}
                    {qtdItem > 1 ? ` (Tot: ${formatarMoeda(custoTotalItem)})` : ''}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded font-bold border ${
                      lucroItem >= 0
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    Faturou: {lucroItem >= 0 ? '+' : ''}
                    {formatarMoeda(lucroItem)}
                    {margemItem > 0 ? ` (${margemItem.toFixed(1)}%)` : ''}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div ref={modalRef} className="tela-relatorio-cheia" style={{ display: 'flex', zIndex: 9999 }}>
      {/* CABEÇALHO FIXO */}
      <div className="cabecalho-relatorio">
        <h2
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <ReceiptText size={20} style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Relatório Geral de Vendas ({nomeLoja})
          </span>
        </h2>
        <button
          type="button"
          className="btn-voltar-rel"
          onClick={handleVoltarOuFechar}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.16)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          <X size={15} />
          <span>Fechar</span>
        </button>
      </div>

      {/* CORPO COM ROLAGEM SUAVE */}
      <div
        ref={corpoRef}
        className="corpo-relatorio-cheio bg-slate-50"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '14px 18px',
        }}
      >
        {erroSync && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center justify-between flex-wrap gap-3 text-amber-900 text-xs font-semibold">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{erroSync}</span>
            </span>
            {onRefazerLogin && (
              <button
                type="button"
                onClick={onRefazerLogin}
                className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refazer Login</span>
              </button>
            )}
          </div>
        )}

        {/* FAIXA COMPACTA DE KPIS HORIZONTAIS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '10px',
          }}
        >
          {/* KPI 1: Receita Bruta */}
          <div className="bg-white rounded-xl border border-slate-200 px-3 py-2.5 flex items-center justify-between gap-2.5 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                  Receita Bruta
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {vendasConcluidas.length} concluídas • {totalItensVendidos} un
                </div>
              </div>
            </div>
            <div className="text-base sm:text-lg font-black text-sky-700 font-mono tabular-nums shrink-0">
              {formatarMoeda(faturamentoBruto)}
            </div>
          </div>

          {/* KPI 2: Lucro Líquido Real */}
          <div className="bg-white rounded-xl border border-emerald-300 px-3 py-2.5 flex items-center justify-between gap-2.5 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 truncate">
                  Lucro Líquido Real
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold truncate">
                  +{margemLucroMedia.toFixed(1)}% margem média
                </div>
              </div>
            </div>
            <div className="text-base sm:text-lg font-black text-emerald-700 font-mono tabular-nums shrink-0">
              {formatarMoeda(faturamentoLucroReal)}
            </div>
          </div>

          {/* KPI 3: Custo (CMV) */}
          <div className="bg-white rounded-xl border border-slate-200 px-3 py-2.5 flex items-center justify-between gap-2.5 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                  Custo (CMV)
                </div>
                <div className="text-[11px] text-slate-500 truncate">Custo dos produtos</div>
              </div>
            </div>
            <div className="text-base sm:text-lg font-black text-orange-700 font-mono tabular-nums shrink-0">
              {formatarMoeda(custoTotalMercadorias)}
            </div>
          </div>

          {/* KPI 4: Ticket Médio */}
          <div className="bg-white rounded-xl border border-slate-200 px-3 py-2.5 flex items-center justify-between gap-2.5 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                  Ticket Médio
                </div>
                <div className="text-[11px] text-slate-500 truncate">Média por venda</div>
              </div>
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 font-mono tabular-nums shrink-0">
              {formatarMoeda(ticketMedio)}
            </div>
          </div>

          {/* KPI 5: Estornos (quando houver) */}
          {vendasEstornadas.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setStatusFiltro((prev) => (prev === 'estornada' ? 'todas' : 'estornada'));
                setPaginaAtual(1);
              }}
              className={`text-left rounded-xl border px-3 py-2.5 flex items-center justify-between gap-2.5 shadow-2xs transition cursor-pointer ${
                statusFiltro === 'estornada'
                  ? 'bg-red-50 border-red-400 ring-2 ring-red-500/15'
                  : 'bg-white border-red-200 hover:bg-red-50/40'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-red-700 truncate">
                    Estornos
                  </div>
                  <div className="text-[11px] text-red-600 truncate">
                    {vendasEstornadas.length} venda(s) estornada(s)
                  </div>
                </div>
              </div>
              <div className="text-base sm:text-lg font-black text-red-600 font-mono tabular-nums shrink-0">
                {formatarMoeda(valorTotalEstornos)}
              </div>
            </button>
          )}
        </div>

        {/* BARRA ÚNICA DE FILTROS E FORMAS DE PAGAMENTO */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2.5 shadow-2xs">
          {/* Linha 1: Pílulas de pagamento com totalizadores */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-slate-500 mr-1">Pagamento:</span>

            <button
              type="button"
              onClick={() => {
                setFormaPagamentoFiltro('todas');
                setPaginaAtual(1);
              }}
              className={`px-2.5 py-1 rounded-full font-bold transition cursor-pointer border ${
                formaPagamentoFiltro === 'todas'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Todas ({baseConcluidas.length})
            </button>

            <button
              type="button"
              onClick={() => {
                setFormaPagamentoFiltro('pix');
                setPaginaAtual(1);
              }}
              className={`px-2.5 py-1 rounded-full font-bold transition cursor-pointer border inline-flex items-center gap-1 ${
                formaPagamentoFiltro === 'pix'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Smartphone className="w-3 h-3 shrink-0" />
              <span>
                PIX • {formatarMoeda(totalPix)} ({countPix})
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setFormaPagamentoFiltro('cartoes');
                setPaginaAtual(1);
              }}
              className={`px-2.5 py-1 rounded-full font-bold transition cursor-pointer border inline-flex items-center gap-1 ${
                formaPagamentoFiltro === 'cartoes'
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
              }`}
            >
              <CreditCard className="w-3 h-3 shrink-0" />
              <span>
                Cartões • {formatarMoeda(totalCartoes)} ({countCartoes})
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setFormaPagamentoFiltro('cartao_credito');
                setPaginaAtual(1);
              }}
              className={`px-2.5 py-1 rounded-full font-semibold transition cursor-pointer border ${
                formaPagamentoFiltro === 'cartao_credito'
                  ? 'bg-sky-700 text-white border-sky-700'
                  : 'bg-white text-sky-700 border-sky-200 hover:bg-sky-50'
              }`}
            >
              Crédito • {formatarMoeda(totalCredito)}
            </button>

            <button
              type="button"
              onClick={() => {
                setFormaPagamentoFiltro('cartao_debito');
                setPaginaAtual(1);
              }}
              className={`px-2.5 py-1 rounded-full font-semibold transition cursor-pointer border ${
                formaPagamentoFiltro === 'cartao_debito'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              Débito • {formatarMoeda(totalDebito)}
            </button>

            <button
              type="button"
              onClick={() => {
                setFormaPagamentoFiltro('dinheiro');
                setPaginaAtual(1);
              }}
              className={`px-2.5 py-1 rounded-full font-semibold transition cursor-pointer border inline-flex items-center gap-1 ${
                formaPagamentoFiltro === 'dinheiro'
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100'
              }`}
            >
              <Banknote className="w-3 h-3 shrink-0" />
              <span>
                Dinheiro • {formatarMoeda(totalDinheiro)} ({countDinheiro})
              </span>
            </button>

            {countFiado > 0 && (
              <button
                type="button"
                onClick={() => {
                  setFormaPagamentoFiltro('fiado');
                  setPaginaAtual(1);
                }}
                className={`px-2.5 py-1 rounded-full font-bold transition cursor-pointer border inline-flex items-center gap-1 ${
                  formaPagamentoFiltro === 'fiado'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                }`}
              >
                <FileText className="w-3 h-3 shrink-0" />
                <span>
                  Fiado • {formatarMoeda(totalFiado)} ({countFiado})
                </span>
              </button>
            )}
          </div>

          {/* Linha 2: Busca + Selects compactos + Limpar + Exportar CSV */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative flex-[1_1_220px] min-w-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                name="busca_relatorio_vendas"
                autoComplete="off"
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPaginaAtual(1);
                }}
                placeholder="Buscar #ID, operador, produto ou pagamento..."
                className="w-full h-9 pl-8 pr-8 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
              />
              {busca && (
                <button
                  type="button"
                  onClick={() => {
                    setBusca('');
                    setPaginaAtual(1);
                  }}
                  aria-label="Limpar busca"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={periodoFiltro}
              onChange={(e) => {
                setPeriodoFiltro(e.target.value as any);
                setPaginaAtual(1);
              }}
              className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold cursor-pointer focus:outline-none focus:border-sky-400"
            >
              <option value="todos">Período: Todo o Histórico</option>
              <option value="hoje">Apenas Hoje</option>
              <option value="7dias">Últimos 7 Dias</option>
              <option value="mes">Este Mês</option>
              <option value="ano">Este Ano</option>
            </select>

            <select
              value={statusFiltro}
              onChange={(e) => {
                setStatusFiltro(e.target.value as any);
                setPaginaAtual(1);
              }}
              className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold cursor-pointer focus:outline-none focus:border-sky-400"
            >
              <option value="todas">Status: Todos</option>
              <option value="concluida">Concluídas</option>
              <option value="estornada">Estornadas</option>
            </select>

            <select
              value={operadorFiltro}
              onChange={(e) => {
                setOperadorFiltro(e.target.value);
                setPaginaAtual(1);
              }}
              className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold cursor-pointer focus:outline-none focus:border-sky-400"
            >
              <option value="todos">Operador: Todos</option>
              {operadores.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.nome}
                </option>
              ))}
            </select>

            {temFiltroAtivo && (
              <button
                type="button"
                onClick={limparFiltros}
                className="h-9 px-2.5 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer shrink-0 transition"
              >
                Limpar filtros
              </button>
            )}

            <button
              type="button"
              onClick={() => exportarVendasCSV(vendasFiltradas, nomeLoja, estoque)}
              className="h-9 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shrink-0 transition shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* LISTAGEM DE REGISTROS (TABELA ALINHADA NO DESKTOP + CARDS NO MOBILE) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col overflow-visible">
          {/* Subcabeçalho sticky da tabela */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 sticky top-0 z-10 rounded-t-xl">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold text-slate-700">
                Exibindo{' '}
                {totalRegistros > 0
                  ? registrosPorPagina === 'todas'
                    ? `todos os ${totalRegistros}`
                    : `${indiceInicio + 1}–${indiceFim} de ${totalRegistros}`
                  : '0'}{' '}
                registro(s) de venda
              </span>
              {formaPagamentoFiltro !== 'todas' && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full">
                  <span>Filtro: {formaPagamentoFiltro.replace('_', ' ').toUpperCase()}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormaPagamentoFiltro('todas');
                      setPaginaAtual(1);
                    }}
                    className="text-red-600 hover:text-red-700 font-bold cursor-pointer"
                    aria-label="Remover filtro de pagamento"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <label htmlFor="select-registros-pagina" className="font-bold text-slate-500">
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
                className="h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 cursor-pointer"
              >
                <option value={10}>10 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
                <option value={100}>100 por página</option>
                <option value="todas">Todas ({totalRegistros})</option>
              </select>
            </div>
          </div>

          {vendasFiltradas.length === 0 ? (
            <div className="py-12 px-5 text-center text-slate-500 space-y-2">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-bold text-sm text-slate-700">
                Nenhuma venda encontrada para os filtros selecionados.
              </div>
              <p className="text-xs text-slate-400">
                Tente alterar a forma de pagamento, período ou termo de busca.
              </p>
              {temFiltroAtivo && (
                <button
                  type="button"
                  onClick={limparFiltros}
                  className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Limpar filtros</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* TABELA ALINHADA (DESKTOP) */}
              <div className="hidden md:block overflow-x-auto">
                <div className="min-w-[1020px]">
                  <div className="grid grid-cols-[148px_minmax(145px,1.1fr)_122px_102px_102px_170px_212px] gap-2.5 px-4 py-2 bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500 items-center">
                    <span>Venda &amp; Data</span>
                    <span>Operador</span>
                    <span>Pagamento</span>
                    <span>Status</span>
                    <span className="text-right">Valor</span>
                    <span className="text-right">Custo / Lucro Real</span>
                    <span className="text-right">Ações</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {vendasPaginadas.map((venda) => {
                      const isEstornada = venda.status === 'estornada';
                      const isExpandida = vendaExpandidaId === venda.id;
                      const metricasVenda = calcularMetricasVenda(venda, mapaCusto);

                      return (
                        <div key={venda.id} className={isEstornada ? 'bg-red-50/40' : ''}>
                          <div className="grid grid-cols-[148px_minmax(145px,1.1fr)_122px_102px_102px_170px_212px] gap-2.5 px-4 py-2.5 items-center hover:bg-slate-50/80 transition">
                            {/* Col 1: Venda & Data */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-black text-xs text-slate-900">
                                  #{venda.id.slice(-6).toUpperCase()}
                                </span>
                                <span className="text-[10px] text-slate-400 font-semibold">
                                  • {metricasVenda.qtdItens} un
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono mt-0.5">
                                <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">
                                  {formatarDataExibicao(venda.data)} {venda.hora}
                                </span>
                              </div>
                            </div>

                            {/* Col 2: Operador */}
                            <div className="flex items-center gap-1.5 min-w-0 text-xs text-slate-700">
                              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-semibold truncate" title={venda.operadorNome}>
                                {venda.operadorNome || 'Caixa'}
                              </span>
                            </div>

                            {/* Col 3: Pagamento */}
                            <div>{getBadgePagamento(venda.formaPagamento)}</div>

                            {/* Col 4: Status */}
                            <div>
                              {isEstornada ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 whitespace-nowrap">
                                  <Ban className="w-3 h-3 shrink-0" />
                                  <span>Estornada</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                                  <span>Concluída</span>
                                </span>
                              )}
                            </div>

                            {/* Col 5: Valor */}
                            <div
                              className={`text-right font-mono font-black text-xs tabular-nums ${
                                isEstornada ? 'text-red-700 line-through' : 'text-slate-900'
                              }`}
                            >
                              {formatarMoeda(metricasVenda.valorTotal)}
                            </div>

                            {/* Col 6: Custo / Lucro Real */}
                            <div className="flex flex-col items-end gap-0.5 min-w-0">
                              {isEstornada ? (
                                <span className="text-[11px] font-semibold text-red-600 truncate">
                                  Venda estornada
                                </span>
                              ) : (
                                <>
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold font-mono tabular-nums border whitespace-nowrap ${
                                      metricasVenda.lucroReal >= 0
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-red-50 text-red-700 border-red-200'
                                    }`}
                                    title="Lucro líquido desta venda (Venda - Custo)"
                                  >
                                    <span>
                                      {metricasVenda.lucroReal >= 0 ? '+' : ''}
                                      {formatarMoeda(metricasVenda.lucroReal)}
                                    </span>
                                    {metricasVenda.margemPercentual > 0 && (
                                      <span className="text-[10px] opacity-85">
                                        ({metricasVenda.margemPercentual.toFixed(0)}%)
                                      </span>
                                    )}
                                  </span>
                                  {metricasVenda.custoTotal > 0 && (
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      Custo {formatarMoeda(metricasVenda.custoTotal)}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>

                            {/* Col 7: Ações Alinhadas (212px fixos) */}
                            <div className="w-[212px] flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setVendaExpandidaId(isExpandida ? null : venda.id)}
                                className={`w-[104px] h-8 px-2 rounded-lg text-[11px] font-bold inline-flex items-center justify-center gap-1 border transition cursor-pointer shrink-0 ${
                                  isExpandida
                                    ? 'bg-sky-600 text-white border-sky-600'
                                    : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200'
                                }`}
                              >
                                {isExpandida ? (
                                  <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                                )}
                                <span>
                                  {isExpandida
                                    ? 'Ocultar'
                                    : `Itens (${metricasVenda.qtdItens})`}
                                </span>
                              </button>

                              {onVerCupom && (
                                <button
                                  type="button"
                                  onClick={() => onVerCupom(venda)}
                                  className="w-[64px] h-8 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-[11px] font-bold inline-flex items-center justify-center gap-1 transition cursor-pointer shrink-0"
                                  title="Ver ou imprimir cupom"
                                >
                                  <ReceiptText className="w-3.5 h-3.5 shrink-0" />
                                  <span>Cupom</span>
                                </button>
                              )}

                              {!isEstornada ? (
                                <button
                                  type="button"
                                  onClick={() => setVendaEstornar(venda)}
                                  className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 inline-flex items-center justify-center transition cursor-pointer shrink-0"
                                  title="Estornar venda"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span className="w-8 h-8 shrink-0" aria-hidden="true" />
                              )}
                            </div>
                          </div>

                          {isExpandida && renderDetalhesItens(venda, isEstornada, metricasVenda)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CARDS COMPACTOS (MOBILE) */}
              <div className="md:hidden divide-y divide-slate-200">
                {vendasPaginadas.map((venda) => {
                  const isEstornada = venda.status === 'estornada';
                  const isExpandida = vendaExpandidaId === venda.id;
                  const metricasVenda = calcularMetricasVenda(venda, mapaCusto);

                  return (
                    <div key={venda.id} className={isEstornada ? 'bg-red-50/40' : 'bg-white'}>
                      <div className="p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono font-black text-xs text-slate-900">
                                #{venda.id.slice(-6).toUpperCase()}
                              </span>
                              {isEstornada ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                                  Estornada
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                  Concluída
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {formatarDataExibicao(venda.data)} às {venda.hora}
                            </div>
                          </div>

                          <div className="text-right">
                            <div
                              className={`font-mono font-black text-sm ${
                                isEstornada ? 'text-red-700 line-through' : 'text-slate-900'
                              }`}
                            >
                              {formatarMoeda(metricasVenda.valorTotal)}
                            </div>
                            {!isEstornada && (
                              <div className="text-[10px] font-mono font-bold text-emerald-700">
                                Lucro: +{formatarMoeda(metricasVenda.lucroReal)}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                          <span className="text-slate-700 flex items-center gap-1 truncate">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{venda.operadorNome || 'Caixa'}</span>
                          </span>
                          {getBadgePagamento(venda.formaPagamento)}
                        </div>

                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => setVendaExpandidaId(isExpandida ? null : venda.id)}
                            className="flex-1 h-8 px-2 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold inline-flex items-center justify-center gap-1 cursor-pointer"
                          >
                            {isExpandida ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {isExpandida ? 'Ocultar' : `Itens (${metricasVenda.qtdItens})`}
                            </span>
                          </button>

                          {onVerCupom && (
                            <button
                              type="button"
                              onClick={() => onVerCupom(venda)}
                              className="h-8 px-3 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <ReceiptText className="w-3.5 h-3.5" />
                              <span>Cupom</span>
                            </button>
                          )}

                          {!isEstornada && (
                            <button
                              type="button"
                              onClick={() => setVendaEstornar(venda)}
                              className="h-8 px-2.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Estornar</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {isExpandida && renderDetalhesItens(venda, isEstornada, metricasVenda)}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* BARRA DE PAGINAÇÃO INFERIOR */}
          {totalPaginas > 1 && registrosPorPagina !== 'todas' && (
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3 rounded-b-xl">
              <div className="text-xs text-slate-600 font-semibold">
                Página <strong className="text-slate-900">{paginaCorreta}</strong> de{' '}
                <strong className="text-slate-900">{totalPaginas}</strong> ({totalRegistros} vendas
                filtradas)
              </div>

              <div className="flex items-center gap-1 flex-wrap justify-center">
                <button
                  type="button"
                  disabled={paginaCorreta <= 1}
                  onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white disabled:bg-slate-100 disabled:text-slate-400 text-slate-800 text-xs font-bold cursor-pointer disabled:cursor-not-allowed"
                >
                  Anterior
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                  .filter(
                    (pg) => pg === 1 || pg === totalPaginas || Math.abs(pg - paginaCorreta) <= 2
                  )
                  .map((pg, idx, arr) => {
                    const anterior = arr[idx - 1];
                    const mostrarReticencias = anterior && pg - anterior > 1;

                    return (
                      <React.Fragment key={pg}>
                        {mostrarReticencias && (
                          <span className="px-1 text-slate-400 text-xs">...</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setPaginaAtual(pg)}
                          className={`min-w-[28px] px-2 py-1 rounded-lg border text-xs cursor-pointer ${
                            pg === paginaCorreta
                              ? 'border-sky-600 bg-sky-600 text-white font-extrabold'
                              : 'border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50'
                          }`}
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
                  className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white disabled:bg-slate-100 disabled:text-slate-400 text-slate-800 text-xs font-bold cursor-pointer disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE ESTORNO */}
      {vendaEstornar && (
        <div
          className="modal"
          style={{ display: 'flex', zIndex: 100250 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setVendaEstornar(null);
          }}
        >
          <div
            className="modal-conteudo"
            style={{ maxWidth: '430px', borderTop: '5px solid #dc2626' }}
          >
            <div
              className="cab-modal"
              style={{
                background: '#fee2e2',
                color: '#991b1b',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <RotateCcw size={16} />
              <span>Confirmar Estorno de Venda</span>
            </div>
            <div
              className="corpo-modal"
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <p style={{ fontSize: '0.88rem', color: '#334155', margin: 0 }}>
                Tem certeza que deseja estornar a{' '}
                <b>Venda #{vendaEstornar.id.slice(-6).toUpperCase()}</b> no valor de{' '}
                <b style={{ color: '#dc2626' }}>{formatarMoeda(vendaEstornar.valorTotal || 0)}</b>?
              </p>

              <div
                style={{
                  background: '#f8fafc',
                  padding: '9px 11px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                }}
              >
                <b>Resultado do Estorno:</b> Os{' '}
                <b>{(vendaEstornar.itens || []).reduce((a, b) => a + (b.quantidade || 1), 0)} itens</b>{' '}
                vendidos serão devolvidos automaticamente ao estoque da loja.
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
                  type="button"
                  className="btn btn-salvar"
                  style={{ background: '#dc2626' }}
                  onClick={handleConfirmarEstorno}
                >
                  Confirmar Estorno &amp; Devolver ao Estoque
                </button>
                <button
                  type="button"
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
