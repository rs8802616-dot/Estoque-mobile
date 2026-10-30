import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Venda,
  ItemEstoque,
  OperadorCaixa,
  ProdutoCatalogo,
  PedidoDelivery,
} from '../types';
import { exportarVendasCSV, exportarEstoqueCSV } from '../lib/exportUtils';
import {
  X,
  TrendingUp,
  Receipt,
  Package,
  Bike,
  DollarSign,
  Download,
  Search,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Printer,
  ChevronDown,
  ChevronUp,
  Percent,
  Clock,
  MapPin,
  CheckCircle,
} from 'lucide-react';

interface CentralRelatoriosModalProps {
  visivel: boolean;
  onFechar: () => void;
  vendas: Venda[];
  estoque: ItemEstoque[];
  operadores: OperadorCaixa[];
  nomeLoja: string;
  pedidosDelivery?: PedidoDelivery[];
  catalogoGlobal?: ProdutoCatalogo[];
  onEstornarVenda: (vendaId: string, motivo: string) => void;
  onVerCupom?: (venda: Venda) => void;
  abaInicial?: 'faturamento' | 'vendas' | 'estoque' | 'delivery';
}

const CORES_PIE = ['#10B981', '#2563EB', '#D97706', '#6B7280', '#9333EA', '#DC2626'];

export const CentralRelatoriosModal: React.FC<CentralRelatoriosModalProps> = ({
  visivel,
  onFechar,
  vendas,
  estoque,
  operadores,
  nomeLoja,
  pedidosDelivery = [],
  catalogoGlobal = [],
  onEstornarVenda,
  onVerCupom,
  abaInicial = 'faturamento',
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'faturamento' | 'vendas' | 'estoque' | 'delivery'>(abaInicial);

  useEffect(() => {
    if (abaInicial) {
      setAbaAtiva(abaInicial);
    }
  }, [abaInicial, visivel]);

  // Filtros gerais de período
  const [periodoFiltro, setPeriodoFiltro] = useState<'hoje' | '7dias' | '30dias' | 'mes' | 'todos'>('mes');
  const [origemFiltro, setOrigemFiltro] = useState<'todos' | 'balcao' | 'delivery'>('todos');
  const [statusVendaFiltro, setStatusVendaFiltro] = useState<'todas' | 'concluida' | 'estornada'>('todas');
  const [buscaVendas, setBuscaVendas] = useState('');
  const [formaPgtoFiltro, setFormaPgtoFiltro] = useState<string>('todas');
  const [operadorFiltro, setOperadorFiltro] = useState<string>('todos');

  // Filtros da aba de estoque
  const [filtroEstoqueValidade, setFiltroEstoqueValidade] = useState<'todos' | 'vencidos' | 'vencendo7' | 'vencendo15' | 'vencendo30' | 'baixo'>('todos');
  const [buscaEstoque, setBuscaEstoque] = useState('');

  // Estados para estorno
  const [vendaEstornar, setVendaEstornar] = useState<Venda | null>(null);
  const [motivoEstorno, setMotivoEstorno] = useState('');
  const [erroEstorno, setErroEstorno] = useState('');

  // Venda expandida para visualização de itens
  const [vendaExpandidaId, setVendaExpandidaId] = useState<string | null>(null);

  // Paginação no histórico de vendas
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 20;

  // Helper para obter custo de um item
  const obterCustoItem = (item: { codigo?: string; preco_custo?: number; lote?: string; validade?: string }): number => {
    if (item.preco_custo !== undefined && item.preco_custo !== null && !isNaN(Number(item.preco_custo)) && Number(item.preco_custo) > 0) {
      return Number(item.preco_custo);
    }
    if (estoque && estoque.length > 0 && item.codigo) {
      const cLimpo = item.codigo.trim();
      const noEst = estoque.find((e) => e.codigo?.trim() === cLimpo && (e.preco_custo || 0) > 0);
      if (noEst?.preco_custo) return Number(noEst.preco_custo);
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

  // Filtragem de vendas por período
  const agora = new Date();
  const hojeStr = agora.toISOString().slice(0, 10);
  const data7DiasAtras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const data30DiasAtras = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const mesAtualStr = hojeStr.slice(0, 7); // YYYY-MM

  const vendasFiltradasPorPeriodo = vendas.filter((v) => {
    if (!v.data) return true;
    if (periodoFiltro === 'hoje') return v.data === hojeStr;
    if (periodoFiltro === '7dias') return v.data >= data7DiasAtras;
    if (periodoFiltro === '30dias') return v.data >= data30DiasAtras;
    if (periodoFiltro === 'mes') return v.data.startsWith(mesAtualStr);
    return true;
  });

  // Métricas Consolidadas (Cards do Topo)
  const metricasGerais = useMemo(() => {
    const concluidas = vendasFiltradasPorPeriodo.filter((v) => v.status === 'concluida');
    let faturamentoBruto = 0;
    let custoTotal = 0;
    let itensTotal = 0;
    let faturamentoDelivery = 0;
    let faturamentoBalcao = 0;
    let qtdDelivery = 0;
    let qtdBalcao = 0;

    concluidas.forEach((v) => {
      const m = calcularMetricasVenda(v);
      faturamentoBruto += m.valorTotal;
      custoTotal += m.custoTotal;
      itensTotal += m.quantidadeItens;

      if (v.origem === 'delivery') {
        faturamentoDelivery += m.valorTotal;
        qtdDelivery++;
      } else {
        faturamentoBalcao += m.valorTotal;
        qtdBalcao++;
      }
    });

    const lucroReal = faturamentoBruto - custoTotal;
    const margemGeral = faturamentoBruto > 0 ? (lucroReal / faturamentoBruto) * 100 : 0;
    const ticketMedio = concluidas.length > 0 ? faturamentoBruto / concluidas.length : 0;

    return {
      totalVendas: concluidas.length,
      faturamentoBruto,
      custoTotal,
      lucroReal,
      margemGeral,
      itensTotal,
      faturamentoDelivery,
      faturamentoBalcao,
      qtdDelivery,
      qtdBalcao,
      ticketMedio,
    };
  }, [vendasFiltradasPorPeriodo, estoque]);

  // Dados para Gráfico de Faturamento & Lucro por Dia
  const dadosGraficoEvolucao = useMemo(() => {
    const mapaDias = new Map<string, { data: string; faturamento: number; lucro: number; custo: number }>();

    vendasFiltradasPorPeriodo
      .filter((v) => v.status === 'concluida')
      .forEach((v) => {
        const dia = v.data || hojeStr;
        const m = calcularMetricasVenda(v);
        const atual = mapaDias.get(dia) || { data: dia, faturamento: 0, lucro: 0, custo: 0 };
        atual.faturamento += m.valorTotal;
        atual.lucro += m.lucroReal;
        atual.custo += m.custoTotal;
        mapaDias.set(dia, atual);
      });

    return Array.from(mapaDias.values())
      .sort((a, b) => a.data.localeCompare(b.data))
      .slice(-14) // Últimos 14 dias para visualização limpa
      .map((d) => ({
        ...d,
        dataFormatada: d.data.split('-').slice(1).reverse().join('/'),
      }));
  }, [vendasFiltradasPorPeriodo, estoque]);

  // Dados para Gráfico de Formas de Pagamento
  const dadosGraficoPagamentos = useMemo(() => {
    const mapa = new Map<string, number>();
    vendasFiltradasPorPeriodo
      .filter((v) => v.status === 'concluida')
      .forEach((v) => {
        const fp = v.formaPagamento || 'outros';
        const nomeFp =
          fp === 'pix' ? 'PIX' :
          fp === 'cartao_credito' ? 'Cartão Crédito' :
          fp === 'cartao_debito' ? 'Cartão Débito' :
          fp === 'dinheiro' ? 'Dinheiro' :
          fp === 'fiado' ? 'Fiado' : 'Outros';
        mapa.set(nomeFp, (mapa.get(nomeFp) || 0) + Number(v.valorTotal || 0));
      });

    return Array.from(mapa.entries()).map(([name, value]) => ({ name, value }));
  }, [vendasFiltradasPorPeriodo]);

  // Lista Filtrada para a Tabela de Histórico de Vendas
  const vendasHistoricoFiltradas = useMemo(() => {
    return vendasFiltradasPorPeriodo.filter((v) => {
      if (statusVendaFiltro !== 'todas' && v.status !== statusVendaFiltro) return false;
      if (origemFiltro !== 'todos') {
        const isDel = v.origem === 'delivery';
        if (origemFiltro === 'delivery' && !isDel) return false;
        if (origemFiltro === 'balcao' && isDel) return false;
      }
      if (formaPgtoFiltro !== 'todas' && v.formaPagamento !== formaPgtoFiltro) return false;
      if (operadorFiltro !== 'todos' && v.operadorId !== operadorFiltro) return false;

      if (buscaVendas.trim()) {
        const b = buscaVendas.toLowerCase();
        const idMatch = v.id.toLowerCase().includes(b);
        const opMatch = (v.operadorNome || '').toLowerCase().includes(b);
        const itemMatch = (v.itens || []).some(
          (it) => it.nome?.toLowerCase().includes(b) || it.codigo?.toLowerCase().includes(b)
        );
        if (!idMatch && !opMatch && !itemMatch) return false;
      }

      return true;
    }).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [vendasFiltradasPorPeriodo, statusVendaFiltro, origemFiltro, formaPgtoFiltro, operadorFiltro, buscaVendas]);

  // Itens paginados
  const totalPaginas = Math.ceil(vendasHistoricoFiltradas.length / itensPorPagina) || 1;
  const vendasPaginadas = vendasHistoricoFiltradas.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  // Métricas do Estoque
  const metricasEstoque = useMemo(() => {
    let valorCustoTotal = 0;
    let valorVendaTotal = 0;
    let totalItensUnicos = 0;
    let totalUnidadesFisicas = 0;

    let vencidos = 0;
    let vencendo7 = 0;
    let vencendo15 = 0;
    let vencendo30 = 0;
    let estoqueBaixo = 0;

    estoque.forEach((item) => {
      const qtd = Number(item.quantidade) || 0;
      const custo = Number(item.preco_custo) || 0;
      const venda = Number(item.preco_venda) || 0;

      totalItensUnicos++;
      totalUnidadesFisicas += qtd;
      valorCustoTotal += custo * qtd;
      valorVendaTotal += venda * qtd;

      if (qtd <= 3 && !item.estoqueIlimitado) {
        estoqueBaixo++;
      }

      if (item.validade) {
        const dataVal = new Date(item.validade + 'T23:59:59');
        const diffDias = Math.ceil((dataVal.getTime() - agora.getTime()) / (1000 * 3600 * 24));
        if (diffDias < 0) vencidos++;
        else if (diffDias <= 7) vencendo7++;
        else if (diffDias <= 15) vencendo15++;
        else if (diffDias <= 30) vencendo30++;
      }
    });

    const lucroProjetado = valorVendaTotal - valorCustoTotal;

    return {
      totalItensUnicos,
      totalUnidadesFisicas,
      valorCustoTotal,
      valorVendaTotal,
      lucroProjetado,
      vencidos,
      vencendo7,
      vencendo15,
      vencendo30,
      estoqueBaixo,
    };
  }, [estoque]);

  // Itens de Estoque Filtrados
  const estoqueFiltrado = useMemo(() => {
    return estoque.filter((item) => {
      if (buscaEstoque.trim()) {
        const b = buscaEstoque.toLowerCase();
        const matchNome = item.nome?.toLowerCase().includes(b);
        const matchCod = item.codigo?.toLowerCase().includes(b);
        const matchLote = item.lote?.toLowerCase().includes(b);
        if (!matchNome && !matchCod && !matchLote) return false;
      }

      if (filtroEstoqueValidade === 'todos') return true;

      const qtd = Number(item.quantidade) || 0;
      if (filtroEstoqueValidade === 'baixo') {
        return qtd <= 3 && !item.estoqueIlimitado;
      }

      if (!item.validade) return false;
      const dataVal = new Date(item.validade + 'T23:59:59');
      const diffDias = Math.ceil((dataVal.getTime() - agora.getTime()) / (1000 * 3600 * 24));

      if (filtroEstoqueValidade === 'vencidos') return diffDias < 0;
      if (filtroEstoqueValidade === 'vencendo7') return diffDias >= 0 && diffDias <= 7;
      if (filtroEstoqueValidade === 'vencendo15') return diffDias >= 0 && diffDias <= 15;
      if (filtroEstoqueValidade === 'vencendo30') return diffDias >= 0 && diffDias <= 30;

      return true;
    });
  }, [estoque, buscaEstoque, filtroEstoqueValidade]);

  // Métricas Exclusivas de Delivery (Estilo Zé Delivery)
  const metricasDelivery = useMemo(() => {
    const pedidos = pedidosDelivery || [];
    const entregues = pedidos.filter((p) => p.status === 'entregue');
    const cancelados = pedidos.filter((p) => p.status === 'cancelado');
    const pendentes = pedidos.filter((p) => p.status === 'pendente' || p.status === 'em_separacao' || p.status === 'saiu_para_entrega');

    let faturamento = 0;
    let taxasTotal = 0;
    const mapaBairros = new Map<string, number>();
    const mapaProdutos = new Map<string, { nome: string; qtd: number; valor: number }>();

    entregues.forEach((p) => {
      faturamento += Number(p.valorTotal) || 0;
      taxasTotal += Number(p.taxaEntrega) || 0;

      const bairro = p.enderecoEntrega?.bairro?.trim() || 'Não especificado';
      mapaBairros.set(bairro, (mapaBairros.get(bairro) || 0) + 1);

      (p.itens || []).forEach((it) => {
        const atual = mapaProdutos.get(it.codigo) || { nome: it.nome, qtd: 0, valor: 0 };
        atual.qtd += Number(it.quantidade) || 1;
        atual.valor += Number(it.subtotal) || 0;
        mapaProdutos.set(it.codigo, atual);
      });
    });

    const ticketMedio = entregues.length > 0 ? faturamento / entregues.length : 0;
    const topBairros = Array.from(mapaBairros.entries())
      .map(([bairro, total]) => ({ bairro, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const topProdutos = Array.from(mapaProdutos.values())
      .sort((a, b) => b.qtd - a.qtd)
      .slice(0, 5);

    return {
      totalPedidos: pedidos.length,
      entregues: entregues.length,
      cancelados: cancelados.length,
      pendentes: pendentes.length,
      faturamento,
      taxasTotal,
      ticketMedio,
      topBairros,
      topProdutos,
    };
  }, [pedidosDelivery]);

  if (!visivel) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-slate-50 border border-slate-200 rounded-2xl w-full max-w-6xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        
        {/* CABEÇALHO PRINCIPAL COM LOGO & ABAS */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-white">
                Central de Relatórios & Desempenho
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {nomeLoja || 'Loja Principal'}
                </span>
              </h2>
              <p className="text-xs text-[#9CA3AF]">
                Faturamento real, histórico de vendas, estoque, lote e métricas do Delivery em um único lugar
              </p>
            </div>
          </div>

          <button
            onClick={onFechar}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVEGAÇÃO ENTRE ABAS */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 overflow-x-auto px-4 gap-2 pt-2 scrollbar-none">
          <button
            onClick={() => setAbaAtiva('faturamento')}
            className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm border-b-2 transition whitespace-nowrap ${
              abaAtiva === 'faturamento'
                ? 'bg-[#141414] text-white border-2 border-[#292524] rounded-t-lg shadow-[2px_2px_0px_#292524] font-bold'
                : 'bg-white text-[#141414] border-2 border-[#292524] rounded-t-lg hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            📊 Faturamento & Lucro Real
          </button>

          <button
            onClick={() => setAbaAtiva('vendas')}
            className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm border-b-2 transition whitespace-nowrap ${
              abaAtiva === 'vendas'
                ? 'bg-[#141414] text-white border-2 border-[#292524] rounded-t-lg shadow-[2px_2px_0px_#292524] font-bold'
                : 'bg-white text-[#141414] border-2 border-[#292524] rounded-t-lg hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-4 h-4" />
            🧾 Histórico de Vendas & Cupons ({vendasHistoricoFiltradas.length})
          </button>

          <button
            onClick={() => setAbaAtiva('estoque')}
            className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm border-b-2 transition whitespace-nowrap ${
              abaAtiva === 'estoque'
                ? 'bg-[#141414] text-white border-2 border-[#292524] rounded-t-lg shadow-[2px_2px_0px_#292524] font-bold'
                : 'bg-white text-[#141414] border-2 border-[#292524] rounded-t-lg hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            📦 Estoque & Validades ({metricasEstoque.totalItensUnicos})
          </button>

          <button
            onClick={() => setAbaAtiva('delivery')}
            className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm border-b-2 transition whitespace-nowrap ${
              abaAtiva === 'delivery'
                ? 'bg-[#141414] text-white border-2 border-[#292524] rounded-t-lg shadow-[2px_2px_0px_#292524] font-bold'
                : 'bg-white text-[#141414] border-2 border-[#292524] rounded-t-lg hover:bg-slate-100'
            }`}
          >
            <Bike className="w-4 h-4" />
            🛵 Inteligência Delivery ({metricasDelivery.totalPedidos})
          </button>
        </div>

        {/* CORPO PRINCIPAL COM CONTEÚDO DA ABA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ======================================================== */}
          {/* ABA 1: FATURAMENTO & LUCRO REAL                         */}
          {/* ======================================================== */}
          {abaAtiva === 'faturamento' && (
            <div className="space-y-6">
              
              {/* Barra de Filtro de Período */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#E4E3E0] p-3 rounded-xl border-2 border-[#292524] shadow-[3px_3px_0px_#292524] shadow-sm">
                <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Filtrar período de vendas:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(['hoje', '7dias', '30dias', 'mes', 'todos'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriodoFiltro(p)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                        periodoFiltro === p
                          ? 'bg-[#141414] text-white border-2 border-[#292524] shadow-[1px_1px_0px_#292524]'
                          : 'bg-white text-[#141414] hover:bg-slate-100 border-2 border-[#292524]'
                      }`}
                    >
                      {p === 'hoje' ? 'Hoje' : p === '7dias' ? 'Últimos 7 dias' : p === '30dias' ? 'Últimos 30 dias' : p === 'mes' ? 'Este Mês' : 'Todo o Período'}
                    </button>
                  ))}
                </div>
              </div>

              {/* CARDS MASTER DE KPIS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. SÓ COM O LUCRO (DESTAQUE MÁXIMO) */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-300 p-4 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-emerald-800">
                      💰 Só com o Lucro Real
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      +{metricasGerais.margemGeral.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#059669]">
                    R$ {metricasGerais.lucroReal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-emerald-800/80 mt-1">
                    Ganho líquido retirando todo o custo das mercadorias
                  </p>
                </div>

                {/* 2. RECEITA BRUTA */}
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-700">
                      💵 Faturamento Bruto
                    </span>
                    <DollarSign className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#141414]">
                    R$ {metricasGerais.faturamentoBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {metricasGerais.totalVendas} vendas ({metricasGerais.itensTotal} itens vendidos)
                  </p>
                </div>

                {/* 3. CUSTO DAS MERCADORIAS (CMV) */}
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-rose-700">
                      🏷️ (-) Custo Produtos (CMV)
                    </span>
                    <Percent className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-600">
                    R$ {metricasGerais.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Valor de aquisição dos itens vendidos
                  </p>
                </div>

                {/* 4. BALCÃO VS DELIVERY */}
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-purple-800">
                      🛵 Delivery vs 🛒 Balcão
                    </span>
                    <Bike className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between items-center text-slate-800">
                      <span className="text-xs text-slate-400">🛵 Delivery ({metricasGerais.qtdDelivery}):</span>
                      <span className="font-bold font-mono text-purple-700">
                        R$ {metricasGerais.faturamentoDelivery.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-800">
                      <span className="text-xs text-slate-400">🛒 Balcão ({metricasGerais.qtdBalcao}):</span>
                      <span className="font-bold font-mono text-blue-700">
                        R$ {metricasGerais.faturamentoBalcao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 pt-1 border-t border-slate-200">
                    Ticket Médio: R$ {metricasGerais.ticketMedio.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* GRÁFICOS: EVOLUÇÃO E FORMAS DE PAGAMENTO */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Gráfico de Evolução de Faturamento & Lucro */}
                <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Evolução Diária: Lucro Líquido vs Faturamento Bruto
                  </h3>
                  {dadosGraficoEvolucao.length > 0 ? (
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dadosGraficoEvolucao} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="corLucro" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.5}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0.02}/>
                            </linearGradient>
                            <linearGradient id="corFat" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                          <XAxis dataKey="dataFormatada" stroke="#64748B" fontSize={11} tick={{ fill: '#334155', fontWeight: 600 }} />
                          <YAxis stroke="#64748B" fontSize={11} tick={{ fill: '#334155', fontWeight: 600 }} tickFormatter={(v) => `R${v}`} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#141414', borderColor: '#292524', color: '#FFFFFF', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            itemStyle={{ color: '#34D399', fontWeight: 700 }}
                            labelStyle={{ color: '#FBBF24', fontWeight: 800 }}
                            formatter={(value: any, name: any) => [
                              `R$ ${Number(value).toFixed(2)}`,
                              name === 'lucro' ? '💰 Só Lucro Real' : '💵 Faturamento Bruto',
                            ]}
                          />
                          <Legend
                            wrapperStyle={{ paddingTop: 8 }}
                            formatter={(v) => (
                              <span style={{ color: '#0F172A', fontWeight: 700, fontSize: '0.78rem' }}>
                                {v === 'lucro' ? '💰 Só Lucro Real' : '💵 Faturamento Bruto'}
                              </span>
                            )}
                          />
                          <Area type="monotone" dataKey="faturamento" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#corFat)" />
                          <Area type="monotone" dataKey="lucro" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#corLucro)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                      Nenhuma venda registrada no período selecionado.
                    </div>
                  )}
                </div>

                {/* Gráfico de Formas de Pagamento */}
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col">
                  <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                    Vendas por Forma de Pagamento
                  </h3>
                  {dadosGraficoPagamentos.length > 0 ? (
                    <div className="h-64 w-full flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dadosGraficoPagamentos}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {dadosGraficoPagamentos.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={CORES_PIE[index % CORES_PIE.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '0.75rem' }}
                            formatter={(v: any) => `R$ ${Number(v).toFixed(2)}`}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                      Sem dados de pagamento.
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* ABA 2: HISTÓRICO DE VENDAS & CUPONS                      */}
          {/* ======================================================== */}
          {abaAtiva === 'vendas' && (
            <div className="space-y-4">
              
              {/* FILTROS E BUSCA */}
              <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Busca */}
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={buscaVendas}
                      onChange={(e) => setBuscaVendas(e.target.value)}
                      placeholder="Buscar por código, produto, ID ou operador..."
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Exportar CSV */}
                  <button
                    onClick={() => exportarVendasCSV(vendasHistoricoFiltradas, nomeLoja)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow transition"
                  >
                    <Download className="w-4 h-4" />
                    Exportar Vendas (CSV)
                  </button>
                </div>

                {/* Filtros em linha */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                  <div>
                    <label className="text-slate-600 font-semibold mb-1 block">Origem:</label>
                    <select
                      value={origemFiltro}
                      onChange={(e) => setOrigemFiltro(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                    >
                      <option value="todos">Todas as Origens</option>
                      <option value="balcao">🛒 Balcão / PDV</option>
                      <option value="delivery">🛵 Delivery (Zé Delivery)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold mb-1 block">Status:</label>
                    <select
                      value={statusVendaFiltro}
                      onChange={(e) => setStatusVendaFiltro(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                    >
                      <option value="todas">Todos os Status</option>
                      <option value="concluida">✅ Concluídas</option>
                      <option value="estornada">↩️ Estornadas</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold mb-1 block">Pagamento:</label>
                    <select
                      value={formaPgtoFiltro}
                      onChange={(e) => setFormaPgtoFiltro(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                    >
                      <option value="todas">Todos os Pagamentos</option>
                      <option value="pix">PIX</option>
                      <option value="cartao_credito">Cartão de Crédito</option>
                      <option value="cartao_debito">Cartão de Débito</option>
                      <option value="dinheiro">Dinheiro</option>
                      <option value="fiado">Fiado</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold mb-1 block">Operador:</label>
                    <select
                      value={operadorFiltro}
                      onChange={(e) => setOperadorFiltro(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                    >
                      <option value="todos">Todos os Operadores</option>
                      {operadores.map((op) => (
                        <option key={op.id} value={op.id}>
                          {op.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* LISTA DE VENDAS */}
              <div className="space-y-3">
                {vendasPaginadas.length > 0 ? (
                  vendasPaginadas.map((venda) => {
                    const m = calcularMetricasVenda(venda);
                    const isExpandida = vendaExpandidaId === venda.id;
                    const isDelivery = venda.origem === 'delivery';

                    return (
                      <div
                        key={venda.id}
                        className={`border rounded-2xl transition overflow-hidden ${
                          venda.status === 'estornada'
                            ? 'bg-rose-50 border-rose-200 opacity-90'
                            : isDelivery
                            ? 'bg-purple-50/40 border-purple-200 shadow-sm'
                            : 'bg-white border-slate-200 shadow-sm'
                        }`}
                      >
                        {/* CABEÇALHO DO CARD DE VENDA */}
                        <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {isDelivery ? '🛵' : '🛒'}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">
                                  {isDelivery ? 'Delivery' : 'Balcão'} #{venda.id.slice(-6)}
                                </span>
                                {isDelivery && (
                                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200">
                                    Zé Delivery
                                  </span>
                                )}
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    venda.status === 'estornada'
                                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                  }`}
                                >
                                  {venda.status === 'estornada' ? 'Estornada' : 'Concluída'}
                                </span>
                              </div>
                              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                                <span>{venda.data} às {venda.hora}</span>
                                <span>•</span>
                                <span>{venda.operadorNome || 'Operador'}</span>
                                <span>•</span>
                                <span className="uppercase">{venda.formaPagamento}</span>
                              </div>
                            </div>
                          </div>

                          {/* VALORES E LUCRO */}
                          <div className="flex items-center gap-4 text-right">
                            <div>
                              <div className="text-xs text-slate-400">Total Vendido:</div>
                              <div className="text-base font-bold text-slate-900">
                                R$ {m.valorTotal.toFixed(2)}
                              </div>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl shadow-xs">
                              <div className="text-[10px] text-emerald-700 font-bold uppercase">
                                Só Lucro Real:
                              </div>
                              <div className="text-sm font-extrabold font-mono text-[#059669]">
                                R$ {m.lucroReal.toFixed(2)}{' '}
                                <span className="text-[10px] font-medium text-emerald-600">
                                  ({m.margemPercentual.toFixed(0)}%)
                                </span>
                              </div>
                            </div>

                            {/* Ações */}
                            <div className="flex items-center gap-1">
                              {onVerCupom && (
                                <button
                                  onClick={() => onVerCupom(venda)}
                                  title="Imprimir Cupom"
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                              )}

                              {venda.status !== 'estornada' && (
                                <button
                                  onClick={() => {
                                    setVendaEstornar(venda);
                                    setMotivoEstorno('');
                                    setErroEstorno('');
                                  }}
                                  title="Estornar Venda"
                                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition border border-rose-200"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                onClick={() => setVendaExpandidaId(isExpandida ? null : venda.id)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
                              >
                                {isExpandida ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* DETALHES DOS ITENS EXPANDIDOS */}
                        {isExpandida && (
                          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              Itens da Venda ({venda.itens?.length || 0}):
                            </h4>
                            <div className="space-y-1.5">
                              {(venda.itens || []).map((it, idx) => {
                                const custoUnit = obterCustoItem(it);
                                const qtd = Number(it.quantidade) || 1;
                                const subtotal = Number(it.subtotal) || 0;
                                const custoTotalItem = custoUnit * qtd;
                                const lucroItem = subtotal - custoTotalItem;
                                const margemItem = subtotal > 0 ? (lucroItem / subtotal) * 100 : 0;

                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-2 rounded-lg bg-white text-xs border border-slate-200 shadow-xs"
                                  >
                                    <div>
                                      <span className="font-semibold text-slate-800">
                                        {qtd}x {it.nome}
                                      </span>
                                      <div className="text-[10px] text-slate-400">
                                        Cód: {it.codigo} {it.lote ? `• Lote: ${it.lote}` : ''}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-right">
                                      <div>
                                        <div className="text-slate-700 font-semibold">
                                          Venda: R$ {subtotal.toFixed(2)}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-medium">
                                          Custo: R$ {custoTotalItem.toFixed(2)}
                                        </div>
                                      </div>

                                      <div className="text-emerald-700 font-bold">
                                        +R$ {lucroItem.toFixed(2)}
                                        <div className="text-[10px] text-emerald-600 font-medium">
                                          ({margemItem.toFixed(0)}%)
                                        </div>
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
                ) : (
                  <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-600 shadow-sm">
                    Nenhuma venda encontrada com os filtros selecionados.
                  </div>
                )}
              </div>

              {/* PAGINAÇÃO */}
              {totalPaginas > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    disabled={paginaAtual === 1}
                    onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs disabled:opacity-40 shadow-xs"
                  >
                    Anterior
                  </button>
                  <span className="text-xs text-slate-400">
                    Página {paginaAtual} de {totalPaginas}
                  </span>
                  <button
                    disabled={paginaAtual === totalPaginas}
                    onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs disabled:opacity-40 shadow-xs"
                  >
                    Próxima
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* ABA 3: POSIÇÃO DE ESTOQUE, LOTES & VALIDADES            */}
          {/* ======================================================== */}
          {abaAtiva === 'estoque' && (
            <div className="space-y-4">
              
              {/* KPIS DE ESTOQUE */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-200 shadow-sm p-3.5 rounded-xl">
                  <span className="text-xs text-slate-400">Itens / Lotes:</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    {metricasEstoque.totalItensUnicos} lotes
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {metricasEstoque.totalUnidadesFisicas} unidades físicas
                  </span>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm p-3.5 rounded-xl">
                  <span className="text-xs text-slate-400">Valor em Custo:</span>
                  <div className="text-xl font-bold text-rose-600 mt-1">
                    R$ {metricasEstoque.valorCustoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[11px] text-slate-400">Capital imobilizado</span>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm p-3.5 rounded-xl">
                  <span className="text-xs text-slate-400">Potencial de Venda:</span>
                  <div className="text-xl font-bold text-blue-600 mt-1">
                    R$ {metricasEstoque.valorVendaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[11px] text-slate-400">Faturamento projetado</span>
                </div>

                <div className="bg-gradient-to-br from-emerald-950/60 to-emerald-900/30 border border-emerald-500/30 p-3.5 rounded-xl">
                  <span className="text-xs text-emerald-700">Lucro Projetado Estoque:</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1">
                    R$ {metricasEstoque.lucroProjetado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[11px] text-emerald-700/80">Se vender todos os itens</span>
                </div>
              </div>

              {/* FILTROS DE ESTOQUE */}
              <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={buscaEstoque}
                    onChange={(e) => setBuscaEstoque(e.target.value)}
                    placeholder="Buscar no estoque por produto, código ou lote..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    onClick={() => setFiltroEstoqueValidade('todos')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                      filtroEstoqueValidade === 'todos' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFiltroEstoqueValidade('vencidos')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                      filtroEstoqueValidade === 'vencidos' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    ⚠️ Vencidos ({metricasEstoque.vencidos})
                  </button>
                  <button
                    onClick={() => setFiltroEstoqueValidade('vencendo7')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                      filtroEstoqueValidade === 'vencendo7' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    Vencendo em 7 dias ({metricasEstoque.vencendo7})
                  </button>
                  <button
                    onClick={() => setFiltroEstoqueValidade('baixo')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                      filtroEstoqueValidade === 'baixo' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    Estoque Baixo ({metricasEstoque.estoqueBaixo})
                  </button>
                </div>

                <button
                  onClick={() => exportarEstoqueCSV(estoqueFiltrado, nomeLoja)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Exportar Estoque (CSV)
                </button>
              </div>

              {/* LISTAGEM DE ITENS DE ESTOQUE */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">Produto</th>
                      <th className="p-3">Código / Lote</th>
                      <th className="p-3">Validade</th>
                      <th className="p-3 text-right">Saldo</th>
                      <th className="p-3 text-right">P. Custo</th>
                      <th className="p-3 text-right">P. Venda</th>
                      <th className="p-3 text-right">Lucro Unitário</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {estoqueFiltrado.length > 0 ? (
                      estoqueFiltrado.slice(0, 50).map((it, idx) => {
                        const custo = Number(it.preco_custo) || 0;
                        const venda = Number(it.preco_venda) || 0;
                        const lucro = venda - custo;

                        let badgeValidade = null;
                        if (it.validade) {
                          const dataVal = new Date(it.validade + 'T23:59:59');
                          const diffDias = Math.ceil((dataVal.getTime() - agora.getTime()) / (1000 * 3600 * 24));
                          if (diffDias < 0) {
                            badgeValidade = <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-600">Vencido ({it.validade})</span>;
                          } else if (diffDias <= 7) {
                            badgeValidade = <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700">7 dias ({it.validade})</span>;
                          } else {
                            badgeValidade = <span className="text-slate-600 font-medium">{it.validade}</span>;
                          }
                        }

                        return (
                          <tr key={idx} className="hover:bg-slate-50 transition">
                            <td className="p-3 font-semibold text-slate-900 flex items-center gap-2">
                              {it.foto ? (
                                <img src={it.foto} alt="" className="w-7 h-7 object-cover rounded-lg border border-slate-200" />
                              ) : (
                                <div className="w-7 h-7 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-xs">
                                  📦
                                </div>
                              )}
                              <span>{it.nome}</span>
                            </td>
                            <td className="p-3 text-slate-600">
                              <div>{it.codigo}</div>
                              {it.lote && <span className="text-[10px] text-slate-400">Lote: {it.lote}</span>}
                            </td>
                            <td className="p-3">{badgeValidade || '-'}</td>
                            <td className="p-3 text-right font-bold text-slate-900">
                              {it.estoqueIlimitado ? '∞ Ilimitado' : it.quantidade}
                            </td>
                            <td className="p-3 text-right text-rose-600">R$ {custo.toFixed(2)}</td>
                            <td className="p-3 text-right text-blue-600">R$ {venda.toFixed(2)}</td>
                            <td className="p-3 text-right font-semibold text-emerald-400">
                              +R$ {lucro.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-400">
                          Nenhum produto encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* ABA 4: INTELIGÊNCIA ZÉ DELIVERY                         */}
          {/* ======================================================== */}
          {abaAtiva === 'delivery' && (
            <div className="space-y-6">
              
              {/* CARDS MASTER DE DELIVERY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/60 border border-purple-300 p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-purple-700">
                      🛵 Faturamento Delivery
                    </span>
                    <Bike className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-purple-800">
                    R$ {metricasDelivery.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-purple-700/80 mt-1">
                    {metricasDelivery.entregues} pedidos entregues com sucesso
                  </p>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                      🏷️ Taxas de Entrega Arrecadadas
                    </span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                    R$ {metricasDelivery.taxasTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Repasse para entregadores / motoboys
                  </p>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
                      🎯 Ticket Médio Delivery
                    </span>
                    <Percent className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-200">
                    R$ {metricasDelivery.ticketMedio.toFixed(2)}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Média por pedido despachado
                  </p>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                      ⏱️ Status em Tempo Real
                    </span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">🟡 Pendentes / Em Curso:</span>
                      <span className="font-bold text-amber-700">{metricasDelivery.pendentes}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">🟢 Finalizados (PIN):</span>
                      <span className="font-bold text-emerald-700">{metricasDelivery.entregues}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">🔴 Cancelados:</span>
                      <span className="font-bold text-rose-600">{metricasDelivery.cancelados}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RANKINGS: BAIRROS MAIS ATENDIDOS E ITENS MAIS PEDIDOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Bairros mais atendidos */}
                <div className="bg-white border border-slate-200 shadow-sm p-5 rounded-2xl">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    Bairros com Mais Pedidos de Entrega
                  </h3>
                  {metricasDelivery.topBairros.length > 0 ? (
                    <div className="space-y-2.5">
                      {metricasDelivery.topBairros.map((b, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <span className="font-semibold text-slate-800 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-700 flex items-center justify-center font-bold text-[10px]">
                              {i + 1}
                            </span>
                            {b.bairro}
                          </span>
                          <span className="font-bold text-purple-400">
                            {b.total} {b.total === 1 ? 'entrega' : 'entregas'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Nenhum pedido de delivery concluído ainda.</p>
                  )}
                </div>

                {/* Produtos mais pedidos no delivery */}
                <div className="bg-white border border-slate-200 shadow-sm p-5 rounded-2xl">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Bebidas & Produtos Campeões no Delivery
                  </h3>
                  {metricasDelivery.topProdutos.length > 0 ? (
                    <div className="space-y-2.5">
                      {metricasDelivery.topProdutos.map((prod, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <div>
                            <span className="font-semibold text-slate-800">{prod.nome}</span>
                            <div className="text-[10px] text-slate-400">{prod.qtd} unidades entregues</div>
                          </div>
                          <span className="font-bold text-emerald-400">
                            R$ {prod.valor.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Nenhum produto entregue registrado ainda.</p>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>

        {/* MODAL DE CONFIRMAÇÃO DE ESTORNO */}
        {vendaEstornar && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-slate-800">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-base font-bold">Estornar Venda #{vendaEstornar.id.slice(-6)}?</h3>
              </div>
              <p className="text-xs text-slate-600">
                Ao estornar, o valor de <strong>R$ {vendaEstornar.valorTotal.toFixed(2)}</strong> será cancelado e todos os produtos voltarão automaticamente ao estoque da loja.
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Motivo do Cancelamento / Estorno:</label>
                <input
                  type="text"
                  value={motivoEstorno}
                  onChange={(e) => setMotivoEstorno(e.target.value)}
                  placeholder="Ex: Cliente desistiu, item incorreto, etc."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
                />
                {erroEstorno && <p className="text-xs text-rose-400 mt-1">{erroEstorno}</p>}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setVendaEstornar(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl"
                >
                  Voltar
                </button>
                <button
                  onClick={() => {
                    if (!motivoEstorno.trim()) {
                      setErroEstorno('Por favor, informe o motivo do estorno.');
                      return;
                    }
                    onEstornarVenda(vendaEstornar.id, motivoEstorno);
                    setVendaEstornar(null);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow"
                >
                  Confirmar Estorno
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
