import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  LineChart,
  Line,
  Legend,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { Venda, ItemEstoque, ProdutoCatalogo } from '../types';
import { obterDataLocalISO } from '../lib/dateUtils';
import { useVoltarHierarquico } from '../hooks/useVoltarHierarquico';
import {
  calcularDiasParaVencer,
  calcularMetricasVenda,
  construirMapaCustoPorCodigo,
  ehProdutoEstoqueIlimitado,
  obterCustoUnitarioItem,
  parseDataVenda,
} from '../utils/relatoriosFinanceiros';

interface GraficosVendasModalProps {
  visivel: boolean;
  onFechar: () => void;
  vendas: Venda[];
  estoque: ItemEstoque[];
  nomeLoja: string;
  catalogoGlobal?: ProdutoCatalogo[];
  erroSync?: string | null;
  onRefazerLogin?: () => void;
}

export const GraficosVendasModal: React.FC<GraficosVendasModalProps> = ({
  visivel,
  onFechar,
  vendas,
  estoque,
  nomeLoja,
  catalogoGlobal = [],
  erroSync = null,
  onRefazerLogin,
}) => {
  const [periodoGrafico, setPeriodoGrafico] = useState<'dia' | 'semana' | 'mes' | 'ano'>('mes');
  const [periodoFormaPgto, setPeriodoFormaPgto] = useState<
    'hoje' | '7dias' | '30dias' | 'mes' | 'mes_anterior' | 'ano' | 'todos'
  >('mes');
  const [periodoRanking, setPeriodoRanking] = useState<'hoje' | '7dias' | '30dias' | 'ano' | 'todos'>('todos');
  const [ordenacaoRanking, setOrdenacaoRanking] = useState<'unidades' | 'faturamento'>('unidades');
  const [tipoGrafico, setTipoGrafico] = useState<'area' | 'barras'>('area');
  const [metricaGrafico, setMetricaGrafico] = useState<'lucro_e_faturamento' | 'so_lucro' | 'faturamento'>('lucro_e_faturamento');
  const [abaAtiva, setAbaAtiva] = useState<
    'grafico' | 'formas_pgto' | 'devolucoes' | 'perdas' | 'estoque_chart' | 'ranking' | 'inteligencia'
  >('grafico');
  const [chartKey, setChartKey] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Force chart recalculation on mobile render/tab switch/period change
  useEffect(() => {
    if (visivel) {
      const timer = setTimeout(() => {
        setChartKey((k) => k + 1);
        try {
          window.dispatchEvent(new Event('resize'));
        } catch (e) {
          // ignore
        }
      }, 70);
      return () => clearTimeout(timer);
    }
  }, [visivel, abaAtiva, periodoGrafico, periodoFormaPgto]);

  // Índices O(1) para custo e catálogo
  const mapaCusto = useMemo(
    () => construirMapaCustoPorCodigo(estoque, catalogoGlobal),
    [estoque, catalogoGlobal]
  );

  const mapaCatalogoPorCodigo = useMemo(() => {
    const mapa = new Map<string, ProdutoCatalogo>();
    if (Array.isArray(catalogoGlobal)) {
      catalogoGlobal.forEach((c) => {
        const cod = String(c?.codigo || '').trim();
        if (cod && !mapa.has(cod)) mapa.set(cod, c);
      });
    }
    return mapa;
  }, [catalogoGlobal]);

  // 1. Safe arrays of sales
  const vendasValidas = useMemo(() => {
    return Array.isArray(vendas)
      ? vendas.filter((v) => v && v.status !== 'estornada' && (v.status as string) !== 'cancelada')
      : [];
  }, [vendas]);

  const vendasEstornadas = useMemo(() => {
    return Array.isArray(vendas) ? vendas.filter((v) => v && v.status === 'estornada') : [];
  }, [vendas]);

  // Formas de Pagamento com Seleção de Período e Inteligência Financeira
  const dadosFormasPagamento = useMemo(() => {
    const agora = new Date();
    const anoAtual = agora.getFullYear();
    const mesAtual = agora.getMonth();
    const nomesMeses = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    const nomeMesAtual = nomesMeses[mesAtual];
    const mesAntIndex = (mesAtual + 11) % 12;
    const anoMesAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;
    const nomeMesAnterior = nomesMeses[mesAntIndex];

    const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).getTime();
    const fimHoje = inicioHoje + 24 * 60 * 60 * 1000 - 1;
    const limite7d = agora.getTime() - 7 * 24 * 60 * 60 * 1000;
    const limite30d = agora.getTime() - 30 * 24 * 60 * 60 * 1000;

    const vendasFiltradas = vendasValidas.filter((v) => {
      if (periodoFormaPgto === 'todos') return true;
      const dt = parseDataVenda(v);
      if (!dt) return false;
      const dtTime = dt.getTime();

      if (periodoFormaPgto === 'hoje') {
        return dtTime >= inicioHoje && dtTime <= fimHoje;
      }
      if (periodoFormaPgto === '7dias') {
        return dtTime >= limite7d && dtTime <= agora.getTime() + 60000;
      }
      if (periodoFormaPgto === '30dias') {
        return dtTime >= limite30d && dtTime <= agora.getTime() + 60000;
      }
      if (periodoFormaPgto === 'mes') {
        return dt.getFullYear() === anoAtual && dt.getMonth() === mesAtual;
      }
      if (periodoFormaPgto === 'mes_anterior') {
        return dt.getFullYear() === anoMesAnterior && dt.getMonth() === mesAntIndex;
      }
      if (periodoFormaPgto === 'ano') {
        return dt.getFullYear() === anoAtual;
      }
      return true;
    });

    const totalGeral = vendasFiltradas.reduce((acc, v) => acc + (Number(v.valorTotal) || 0), 0);
    const totalQtd = vendasFiltradas.length;
    const ticketMedioGeral = totalQtd > 0 ? totalGeral / totalQtd : 0;

    // PRD Neo-Brutalista: Formas de Pagamento
    const grupos: Record<string, { nome: string; valor: number; qtd: number; cor: string; maiorVenda: number }> = {
      dinheiro: { nome: '💵 Dinheiro Físico', valor: 0, qtd: 0, cor: '#6B7280', maiorVenda: 0 },     // Cinza Neutro de Cédula
      pix: { nome: '📱 PIX (Instantâneo)', valor: 0, qtd: 0, cor: '#10B981', maiorVenda: 0 },        // Verde Esmeralda PIX
      cartao_credito: { nome: '💳 Cartão de Crédito', valor: 0, qtd: 0, cor: '#2563EB', maiorVenda: 0 }, // Azul Financeiro
      cartao_debito: { nome: '💳 Cartão de Débito', valor: 0, qtd: 0, cor: '#D97706', maiorVenda: 0 },   // Âmbar / Laranja Ouro
      fiado: { nome: '📝 Fiado (A Prazo)', valor: 0, qtd: 0, cor: '#DC2626', maiorVenda: 0 },       // Vermelho Alerta
      outros: { nome: 'Outros', valor: 0, qtd: 0, cor: '#4B5563', maiorVenda: 0 },
    };

    vendasFiltradas.forEach((v) => {
      const forma = (v.formaPagamento || 'outros') as string;
      const valor = Number(v.valorTotal) || 0;
      const grp = grupos[forma] || grupos.outros;
      grp.valor += valor;
      grp.qtd += 1;
      if (valor > grp.maiorVenda) grp.maiorVenda = valor;
    });

    const lista = Object.entries(grupos)
      .filter(([_, g]) => g.qtd > 0 || g.valor > 0)
      .map(([chave, g]) => ({
        chave,
        nome: g.nome,
        valor: g.valor,
        qtd: g.qtd,
        cor: g.cor,
        maiorVenda: g.maiorVenda,
        porcentagem: totalGeral > 0 ? (g.valor / totalGeral) * 100 : 0,
        ticketMedio: g.qtd > 0 ? g.valor / g.qtd : 0,
      }))
      .sort((a, b) => b.valor - a.valor);

    // Inteligência & Diagnóstico
    const lider = lista.length > 0 ? lista[0] : null;
    const valorAVista = grupos.pix.valor + grupos.dinheiro.valor;
    const pctAVista = totalGeral > 0 ? (valorAVista / totalGeral) * 100 : 0;
    const valorCartoes = grupos.cartao_credito.valor + grupos.cartao_debito.valor;
    const pctCartoes = totalGeral > 0 ? (valorCartoes / totalGeral) * 100 : 0;
    const valorFiado = grupos.fiado.valor;
    const pctFiado = totalGeral > 0 ? (valorFiado / totalGeral) * 100 : 0;
    const valorDinheiro = grupos.dinheiro.valor;
    const valorPix = grupos.pix.valor;

    const ordenadoPorTicket = [...lista].sort((a, b) => b.ticketMedio - a.ticketMedio);
    const maiorTicket = ordenadoPorTicket.length > 0 ? ordenadoPorTicket[0] : null;

    const labelPeriodo =
      periodoFormaPgto === 'hoje'
        ? 'Hoje'
        : periodoFormaPgto === '7dias'
        ? 'Últimos 7 dias'
        : periodoFormaPgto === '30dias'
        ? 'Últimos 30 dias'
        : periodoFormaPgto === 'mes'
        ? `Este Mês (${nomeMesAtual})`
        : periodoFormaPgto === 'mes_anterior'
        ? `Mês Anterior (${nomeMesAnterior})`
        : periodoFormaPgto === 'ano'
        ? `Este Ano (${anoAtual})`
        : 'Todo o Histórico';

    return {
      lista,
      totalGeral,
      totalQtd,
      ticketMedioGeral,
      labelPeriodo,
      nomeMesAtual,
      nomeMesAnterior,
      insights: {
        lider,
        valorAVista,
        pctAVista,
        valorCartoes,
        pctCartoes,
        valorFiado,
        pctFiado,
        valorDinheiro,
        valorPix,
        maiorTicket,
      },
    };
  }, [vendasValidas, periodoFormaPgto]);

  // Totais Gerais de Vendas: Faturamento Bruto, Custo Retirado e Lucro Real Faturado
  const totaisFinanceirosVendas = useMemo(() => {
    let valorTotalVendido = 0;
    let custoTotalVendido = 0;
    let totalItensVendidos = 0;

    vendasValidas.forEach((v) => {
      const m = calcularMetricasVenda(v, mapaCusto);
      valorTotalVendido += m.valorTotal;
      custoTotalVendido += m.custoTotal;
      totalItensVendidos += m.qtdItens;
    });

    const lucroRealFaturado = valorTotalVendido - custoTotalVendido;
    const margemLucroReal = valorTotalVendido > 0 ? (lucroRealFaturado / valorTotalVendido) * 100 : 0;

    return {
      valorTotalVendido,
      custoTotalVendido,
      lucroRealFaturado,
      margemLucroReal,
      totalItensVendidos,
      totalVendasQtd: vendasValidas.length,
    };
  }, [vendasValidas, mapaCusto]);

  // 3. Devoluções & Estornos Grouping
  const dadosGraficoDevolucoes = useMemo(() => {
    try {
      const hoje = new Date();
      const utcHoje = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
      const umDiaMs = 24 * 60 * 60 * 1000;

      if (periodoGrafico === 'dia') {
        const porDia: Record<string, { isoKey: string; label: string; estornado: number; qtdEstornos: number }> = {};

        for (let i = 9; i >= 0; i--) {
          const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - i);
          const isoKey = obterDataLocalISO(d);
          const parts = isoKey.split('-');
          const label = `${parts[2]}/${parts[1]}`;
          porDia[isoKey] = { isoKey, label, estornado: 0, qtdEstornos: 0 };
        }

        vendasEstornadas.forEach((v) => {
          const dt = parseDataVenda(v);
          if (!dt) return;
          const isoKey = obterDataLocalISO(dt);
          if (!porDia[isoKey]) return;
          const valor = Number(v.valorTotal) || 0;
          porDia[isoKey].estornado += valor;
          porDia[isoKey].qtdEstornos += 1;
        });

        return Object.values(porDia).sort((a, b) => a.isoKey.localeCompare(b.isoKey));
      }

      if (periodoGrafico === 'semana') {
        const porSemana: Record<string, { label: string; estornado: number; qtdEstornos: number }> = {
          Semana1: { label: 'Há 3 Semanas', estornado: 0, qtdEstornos: 0 },
          Semana2: { label: 'Há 2 Semanas', estornado: 0, qtdEstornos: 0 },
          Semana3: { label: 'Semana Passada', estornado: 0, qtdEstornos: 0 },
          Semana4: { label: 'Semana Atual', estornado: 0, qtdEstornos: 0 },
        };

        vendasEstornadas.forEach((v) => {
          const dt = parseDataVenda(v);
          if (!dt) return;
          const utcDt = Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate());
          const diffDias = Math.round((utcHoje - utcDt) / umDiaMs);
          const valor = Number(v.valorTotal) || 0;

          if (diffDias >= 0 && diffDias <= 6) {
            porSemana['Semana4'].estornado += valor;
            porSemana['Semana4'].qtdEstornos += 1;
          } else if (diffDias >= 7 && diffDias <= 13) {
            porSemana['Semana3'].estornado += valor;
            porSemana['Semana3'].qtdEstornos += 1;
          } else if (diffDias >= 14 && diffDias <= 20) {
            porSemana['Semana2'].estornado += valor;
            porSemana['Semana2'].qtdEstornos += 1;
          } else if (diffDias >= 21 && diffDias <= 27) {
            porSemana['Semana1'].estornado += valor;
            porSemana['Semana1'].qtdEstornos += 1;
          }
        });

        return Object.values(porSemana);
      }

      if (periodoGrafico === 'mes') {
        const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const porMes: Record<number, { index: number; label: string; estornado: number; qtdEstornos: number }> = {};
        const anoAtual = hoje.getFullYear();

        for (let i = 0; i < 12; i++) {
          porMes[i] = { index: i, label: nomesMeses[i], estornado: 0, qtdEstornos: 0 };
        }

        vendasEstornadas.forEach((v) => {
          const dt = parseDataVenda(v);
          if (!dt || dt.getFullYear() !== anoAtual) return;
          const mesIndex = dt.getMonth();
          const valor = Number(v.valorTotal) || 0;
          if (porMes[mesIndex]) {
            porMes[mesIndex].estornado += valor;
            porMes[mesIndex].qtdEstornos += 1;
          }
        });

        return Object.values(porMes).sort((a, b) => a.index - b.index);
      }

      // periodoGrafico === 'ano'
      const porAno: Record<string, { label: string; estornado: number; qtdEstornos: number }> = {};
      const anoAtual = hoje.getFullYear();

      for (let a = anoAtual - 2; a <= anoAtual; a++) {
        porAno[String(a)] = { label: String(a), estornado: 0, qtdEstornos: 0 };
      }

      vendasEstornadas.forEach((v) => {
        const dt = parseDataVenda(v);
        if (!dt) return;
        const ano = String(dt.getFullYear());
        const valor = Number(v.valorTotal) || 0;
        if (porAno[ano]) {
          porAno[ano].estornado += valor;
          porAno[ano].qtdEstornos += 1;
        } else {
          porAno[ano] = { label: ano, estornado: valor, qtdEstornos: 1 };
        }
      });

      return Object.values(porAno).sort((a, b) => a.label.localeCompare(b.label));
    } catch (err) {
      console.error('Erro ao processar devoluções:', err);
      return [];
    }
  }, [vendasEstornadas, periodoGrafico]);

  // 4. Perdas & Vencidos Analysis
  const dadosPerdas = useMemo(() => {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      let totalVencidosQtd = 0;
      let totalVencidosValor = 0;
      let totalAVencer7DiasQtd = 0;
      let totalAVencer7DiasValor = 0;
      let totalAVencer30DiasQtd = 0;
      let totalAVencer30DiasValor = 0;

      const listaVencidos: {
        codigo: string;
        nome: string;
        lote: string;
        validade: string;
        qtd: number;
        precoCusto: number;
        precoVenda: number;
        perdaTotalR$: number;
        diasParaVencer: number;
        status: 'Vencido' | 'Vence em até 7 dias' | 'Vence em até 30 dias';
      }[] = [];

      if (Array.isArray(estoque)) {
        estoque.forEach((item) => {
          if (!item) return;
          if (ehProdutoEstoqueIlimitado(item)) return;

          const qtd = Number(item.quantidade) || 0;
          if (qtd <= 0) return;

          const diffDias = calcularDiasParaVencer(item.validade, hoje);
          if (diffDias === null) return;

          const pVenda = Number(item.preco_venda) || 0;
          const pCusto = obterCustoUnitarioItem(item, mapaCusto).custo;
          const valorPerda = qtd * pVenda;

          if (diffDias < 0) {
            // Vencido
            totalVencidosQtd += qtd;
            totalVencidosValor += valorPerda;
            listaVencidos.push({
              codigo: item.codigo,
              nome: item.nome,
              lote: item.lote,
              validade: item.validade,
              qtd,
              precoCusto: pCusto,
              precoVenda: pVenda,
              perdaTotalR$: valorPerda,
              diasParaVencer: diffDias,
              status: 'Vencido',
            });
          } else if (diffDias <= 7) {
            // Vence em até 7 dias
            totalAVencer7DiasQtd += qtd;
            totalAVencer7DiasValor += valorPerda;
            listaVencidos.push({
              codigo: item.codigo,
              nome: item.nome,
              lote: item.lote,
              validade: item.validade,
              qtd,
              precoCusto: pCusto,
              precoVenda: pVenda,
              perdaTotalR$: valorPerda,
              diasParaVencer: diffDias,
              status: 'Vence em até 7 dias',
            });
          } else if (diffDias <= 30) {
            // Vence em até 30 dias
            totalAVencer30DiasQtd += qtd;
            totalAVencer30DiasValor += valorPerda;
            listaVencidos.push({
              codigo: item.codigo,
              nome: item.nome,
              lote: item.lote,
              validade: item.validade,
              qtd,
              precoCusto: pCusto,
              precoVenda: pVenda,
              perdaTotalR$: valorPerda,
              diasParaVencer: diffDias,
              status: 'Vence em até 30 dias',
            });
          }
        });
      }

      // Chart data summary of Perdas por Categoria de Risco
      const graficoRisco = [
        { label: 'Já Vencidos (Perda)', valorR$: totalVencidosValor, qtd: totalVencidosQtd, fill: '#ef4444' },
        { label: 'Vence em 7 dias', valorR$: totalAVencer7DiasValor, qtd: totalAVencer7DiasQtd, fill: '#f59e0b' },
        { label: 'Vence em 30 dias', valorR$: totalAVencer30DiasValor, qtd: totalAVencer30DiasQtd, fill: '#3b82f6' },
      ];

      return {
        totalVencidosQtd,
        totalVencidosValor,
        totalAVencer7DiasQtd,
        totalAVencer7DiasValor,
        totalAVencer30DiasQtd,
        totalAVencer30DiasValor,
        listaVencidos: listaVencidos.sort((a, b) => a.diasParaVencer - b.diasParaVencer),
        graficoRisco,
      };
    } catch (err) {
      console.error('Erro ao calcular perdas:', err);
      return {
        totalVencidosQtd: 0,
        totalVencidosValor: 0,
        totalAVencer7DiasQtd: 0,
        totalAVencer7DiasValor: 0,
        totalAVencer30DiasQtd: 0,
        totalAVencer30DiasValor: 0,
        listaVencidos: [],
        graficoRisco: [],
      };
    }
  }, [estoque, mapaCusto]);

  // Helper compartilhado de agregação por item vendido
  const agregarItensVendidos = (
    listaVendas: Venda[],
    mapaCatalogo: Map<string, ProdutoCatalogo>
  ): Record<string, { codigo: string; nome: string; qtdVendida: number; totalFaturado: number; foto?: string }> => {
    const mapaItens: Record<
      string,
      { codigo: string; nome: string; qtdVendida: number; totalFaturado: number; foto?: string }
    > = {};

    listaVendas.forEach((v) => {
      const itens = Array.isArray(v?.itens) ? v.itens : [];
      itens.forEach((item) => {
        if (!item) return;
        const cod = item.codigo || item.nome || 'SEM_CODIGO';
        if (!mapaItens[cod]) {
          const catItem = mapaCatalogo.get(String(item.codigo || cod).trim());
          mapaItens[cod] = {
            codigo: item.codigo || cod,
            nome: item.nome || catItem?.nome || 'Produto sem nome',
            qtdVendida: 0,
            totalFaturado: 0,
            foto: item.foto || catItem?.imagem,
          };
        }
        const qtd = Number(item.quantidade) || 0;
        const subtotal = Number(item.subtotal ?? qtd * (Number(item.preco_unitario) || 0)) || 0;
        mapaItens[cod].qtdVendida += qtd;
        mapaItens[cod].totalFaturado += subtotal;
      });
    });

    return mapaItens;
  };

  // 5. Resumo global de itens vendidos (correlaciona vendas reais com estoque e inteligência)
  const resumoItens = useMemo(() => {
    try {
      return agregarItensVendidos(vendasValidas, mapaCatalogoPorCodigo);
    } catch (err) {
      console.error('Erro ao calcular resumo de itens vendidos:', err);
      return {};
    }
  }, [vendasValidas, mapaCatalogoPorCodigo]);

  // 5b. Ranking Top 10 Mais e Menos Vendidos filtrado por período e critério
  const rankingVendas = useMemo(() => {
    try {
      const agora = new Date();
      const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).getTime();
      const fimHoje = inicioHoje + 24 * 60 * 60 * 1000 - 1;
      const limite7d = agora.getTime() - 7 * 24 * 60 * 60 * 1000;
      const limite30d = agora.getTime() - 30 * 24 * 60 * 60 * 1000;
      const anoAtual = agora.getFullYear();

      const vendasFiltradas = vendasValidas.filter((v) => {
        if (periodoRanking === 'todos') return true;
        const dt = parseDataVenda(v);
        if (!dt) return false;
        const dtTime = dt.getTime();
        if (periodoRanking === 'hoje') {
          return dtTime >= inicioHoje && dtTime <= fimHoje;
        }
        if (periodoRanking === '7dias') {
          return dtTime >= limite7d && dtTime <= agora.getTime() + 60000;
        }
        if (periodoRanking === '30dias') {
          return dtTime >= limite30d && dtTime <= agora.getTime() + 60000;
        }
        return dt.getFullYear() === anoAtual;
      });

      const mapaItens = agregarItensVendidos(vendasFiltradas, mapaCatalogoPorCodigo);
      const lista = Object.values(mapaItens).filter(
        (item) => item.qtdVendida > 0 || item.totalFaturado > 0
      );

      const ordenadosMais = [...lista].sort((a, b) => {
        const diff =
          ordenacaoRanking === 'faturamento'
            ? b.totalFaturado - a.totalFaturado
            : b.qtdVendida - a.qtdVendida;
        if (diff !== 0) return diff;
        return ordenacaoRanking === 'faturamento'
          ? b.qtdVendida - a.qtdVendida
          : b.totalFaturado - a.totalFaturado;
      });

      const ordenadosMenos = [...lista].sort((a, b) => {
        const diff =
          ordenacaoRanking === 'faturamento'
            ? a.totalFaturado - b.totalFaturado
            : a.qtdVendida - b.qtdVendida;
        if (diff !== 0) return diff;
        return ordenacaoRanking === 'faturamento'
          ? a.qtdVendida - b.qtdVendida
          : a.totalFaturado - b.totalFaturado;
      });

      const mais = ordenadosMais.slice(0, 10);
      const menos = ordenadosMenos.slice(0, 10);
      const valorMetrica = (item: { qtdVendida: number; totalFaturado: number }) =>
        ordenacaoRanking === 'faturamento' ? item.totalFaturado : item.qtdVendida;

      return {
        maisVendidos: mais,
        menosVendidos: menos,
        totalQtdMais: mais.reduce((acc, it) => acc + it.qtdVendida, 0),
        totalFatMais: mais.reduce((acc, it) => acc + it.totalFaturado, 0),
        maxMais: mais.length > 0 ? Math.max(...mais.map(valorMetrica), 1) : 1,
        totalQtdMenos: menos.reduce((acc, it) => acc + it.qtdVendida, 0),
        totalFatMenos: menos.reduce((acc, it) => acc + it.totalFaturado, 0),
        maxMenos: menos.length > 0 ? Math.max(...menos.map(valorMetrica), 1) : 1,
        totalProdutosDistintos: lista.length,
      };
    } catch (err) {
      console.error('Erro ao calcular ranking de vendas:', err);
      return {
        maisVendidos: [],
        menosVendidos: [],
        totalQtdMais: 0,
        totalFatMais: 0,
        maxMais: 1,
        totalQtdMenos: 0,
        totalFatMenos: 0,
        maxMenos: 1,
        totalProdutosDistintos: 0,
      };
    }
  }, [vendasValidas, catalogoGlobal, periodoRanking, ordenacaoRanking]);

  // 6. Visão Geral do Estoque Chart Data (Diferencia estoque físico real de produtos contínuos de balcão)
  const dadosEstoqueGrafico = useMemo(() => {
    try {
      const mapaProdutos: Record<
        string,
        { codigo: string; nome: string; quantidade: number; valorCustoTotal: number; valorVendaTotal: number }
      > = {};

      let totalPecasEstoque = 0;
      let totalValorVendaEstoque = 0;
      let totalValorCustoEstoque = 0;
      let totalItensBalcao = 0;
      let totalFaturadoBalcao = 0;
      let totalCustoBalcao = 0;
      let totalQtdVendidaBalcao = 0;
      const codigosIlimitadosProcessados = new Set<string>();

      if (Array.isArray(estoque)) {
        estoque.forEach((item) => {
          if (!item) return;
          const cod = item.codigo || item.nome || 'SEM_CODIGO';
          const isIlimitado = ehProdutoEstoqueIlimitado(item);

          if (isIlimitado) {
            // PRODUTO DE BALCÃO / ADEGA COM ESTOQUE ILIMITADO / SOB DEMANDA (deduplicado por código)
            if (codigosIlimitadosProcessados.has(cod)) {
              return;
            }
            codigosIlimitadosProcessados.add(cod);
            totalItensBalcao += 1;
            const vendaInfo = resumoItens[cod];
            if (vendaInfo) {
              const fat = vendaInfo.totalFaturado || 0;
              const qtdV = vendaInfo.qtdVendida || 0;
              totalFaturadoBalcao += fat;
              totalQtdVendidaBalcao += qtdV;
              const pCusto = obterCustoUnitarioItem(item, mapaCusto).custo;
              totalCustoBalcao += qtdV * pCusto;
            }
            return; // NÃO infla o estoque físico com 100.000 unidades fictícias
          }

          // PRODUTO COM ESTOQUE FÍSICO CONTROLADO
          const qtd = Number(item.quantidade) || 0;
          const pVenda = Number(item.preco_venda) || 0;
          const pCusto = obterCustoUnitarioItem(item, mapaCusto).custo;

          const vVenda = qtd * pVenda;
          const vCusto = qtd * pCusto;

          totalPecasEstoque += qtd;
          totalValorVendaEstoque += vVenda;
          totalValorCustoEstoque += vCusto;

          if (!mapaProdutos[cod]) {
            mapaProdutos[cod] = {
              codigo: item.codigo,
              nome: item.nome || 'Produto',
              quantidade: 0,
              valorCustoTotal: 0,
              valorVendaTotal: 0,
            };
          }

          mapaProdutos[cod].quantidade += qtd;
          mapaProdutos[cod].valorCustoTotal += vCusto;
          mapaProdutos[cod].valorVendaTotal += vVenda;
        });
      }

      const lista = Object.values(mapaProdutos);
      const topMaiorQtd = [...lista].sort((a, b) => b.quantidade - a.quantidade).slice(0, 10);
      const topMaiorValor = [...lista].sort((a, b) => b.valorVendaTotal - a.valorVendaTotal).slice(0, 10);

      return {
        totalPecasEstoque,
        totalValorVendaEstoque,
        totalValorCustoEstoque,
        lucroBrutoProjetado: totalValorVendaEstoque - totalValorCustoEstoque,
        topMaiorQtd,
        topMaiorValor,
        totalItensBalcao,
        totalFaturadoBalcao,
        totalCustoBalcao,
        totalLucroBalcao: totalFaturadoBalcao - totalCustoBalcao,
        totalQtdVendidaBalcao,
      };
    } catch (err) {
      console.error('Erro ao calcular gráfico de estoque:', err);
      return {
        totalPecasEstoque: 0,
        totalValorVendaEstoque: 0,
        totalValorCustoEstoque: 0,
        lucroBrutoProjetado: 0,
        topMaiorQtd: [],
        topMaiorValor: [],
        totalItensBalcao: 0,
        totalFaturadoBalcao: 0,
        totalCustoBalcao: 0,
        totalLucroBalcao: 0,
        totalQtdVendidaBalcao: 0,
      };
    }
  }, [estoque, resumoItens, mapaCusto]);

  // 7. Inventory Intelligence
  const insightsEstoque = useMemo(() => {
    try {
      const recomendacaoNaoInvestir: {
        codigo: string;
        nome: string;
        qtdEstoque: number;
        qtdVendida: number;
        precoVenda: number;
        foto?: string;
        valorParado: number;
        motivo: string;
      }[] = [];

      const recomendacaoInvestirMais: {
        codigo: string;
        nome: string;
        qtdEstoque: number;
        qtdVendida: number;
        precoVenda: number;
        foto?: string;
        motivo: string;
      }[] = [];

      const estoqueAgrupado: Record<
        string,
        { codigo: string; nome: string; qtdTotal: number; precoVenda: number; foto?: string; isIlimitado: boolean }
      > = {};

      if (Array.isArray(estoque)) {
        estoque.forEach((e) => {
          if (!e) return;
          const isIlimitado = ehProdutoEstoqueIlimitado(e);
          if (isIlimitado) return; // Produtos de balcão sob demanda não são estoque parado físico

          const cod = e.codigo || e.nome || 'SEM_CODIGO';
          if (!estoqueAgrupado[cod]) {
            const catItem = mapaCatalogoPorCodigo.get(String(cod).trim());
            estoqueAgrupado[cod] = {
              codigo: cod,
              nome: e.nome || catItem?.nome || 'Produto',
              qtdTotal: 0,
              precoVenda: Number(e.preco_venda) || 0,
              foto: e.foto || catItem?.imagem,
              isIlimitado,
            };
          }
          estoqueAgrupado[cod].qtdTotal += Number(e.quantidade) || 0;
        });
      }

      let totalCapitalParado = 0;

      Object.values(estoqueAgrupado).forEach((itemEst) => {
        const vendaInfo = resumoItens[itemEst.codigo];
        const qtdVendida = vendaInfo ? vendaInfo.qtdVendida : 0;
        const valorEstoqueParado = itemEst.qtdTotal * itemEst.precoVenda;

        if (itemEst.qtdTotal >= 3 && qtdVendida <= 2) {
          totalCapitalParado += valorEstoqueParado;
          recomendacaoNaoInvestir.push({
            codigo: itemEst.codigo,
            nome: itemEst.nome,
            qtdEstoque: itemEst.qtdTotal,
            qtdVendida,
            precoVenda: itemEst.precoVenda,
            foto: itemEst.foto,
            valorParado: valorEstoqueParado,
            motivo: `Possui ${itemEst.qtdTotal} un paradas no estoque físico (R$ ${valorEstoqueParado.toFixed(
              2
            )} em mercadoria), mas teve apenas ${qtdVendida} venda(s). Evite novas compras deste item ou realize uma promoção!`,
          });
        } else if (
          (itemEst.qtdTotal <= 5 && (qtdVendida >= 1 || itemEst.qtdTotal <= 0)) ||
          (qtdVendida >= 2 && itemEst.qtdTotal <= 10)
        ) {
          recomendacaoInvestirMais.push({
            codigo: itemEst.codigo,
            nome: itemEst.nome,
            qtdEstoque: itemEst.qtdTotal,
            qtdVendida,
            precoVenda: itemEst.precoVenda,
            foto: itemEst.foto,
            motivo: `Produto com boa procura (${qtdVendida} un vendidas) e estoque físico reduzido (${itemEst.qtdTotal} un em loja). Vale a pena reabastecer para não perder vendas!`,
          });
        }
      });

      recomendacaoNaoInvestir.sort((a, b) => b.valorParado - a.valorParado);
      recomendacaoInvestirMais.sort((a, b) => a.qtdEstoque - b.qtdEstoque);

      return {
        naoInvestir: recomendacaoNaoInvestir,
        investirMais: recomendacaoInvestirMais,
        totalCapitalParado,
      };
    } catch (err) {
      console.error('Erro ao processar inteligência de estoque:', err);
      return { naoInvestir: [], investirMais: [], totalCapitalParado: 0 };
    }
  }, [estoque, resumoItens, mapaCatalogoPorCodigo]);

  // Helper for formatting Y-Axis values compactly (e.g., R$10k, R$7.5k, R$500)
  const formatarValorYAxis = (v: any) => {
    const num = Number(v) || 0;
    if (num >= 1000000) return `R$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) {
      const k = num / 1000;
      return k % 1 === 0 ? `R$${k}k` : `R$${k.toFixed(1)}k`;
    }
    return `R$${num}`;
  };

  const truncarTexto = (txt: string, max = 13) => {
    if (!txt) return '';
    return txt.length > max ? `${txt.substring(0, max)}...` : txt;
  };

  // Overall totals
  const faturamentoTotalGeral = vendasValidas.reduce((acc, v) => acc + (Number(v.valorTotal) || 0), 0);
  const totalEstornosGeral = vendasEstornadas.reduce((acc, v) => acc + (Number(v.valorTotal) || 0), 0);

  // --- INÍCIO: CÁLCULOS DO NOVO PAINEL DE INTELIGÊNCIA & GRÁFICOS (Imagens 2, 3, 4 e 5) ---
  const [periodoFiltro, setPeriodoFiltro] = useState<'hoje' | '7dias' | '30dias' | 'ano' | 'tudo' | 'custom'>('7dias');
  const [tipoVisualizacaoCurva, setTipoVisualizacaoCurva] = useState<'area' | 'barras' | 'linha'>('area');
  const [metricaTop, setMetricaTop] = useState<'faturamento' | 'quantidade'>('faturamento');
  const [filtroCategoriaTop, setFiltroCategoriaTop] = useState<string>('todas');
  const [buscaTabela, setBuscaTabela] = useState<string>('');
  const [hoveredTopIdx, setHoveredTopIdx] = useState<number | null>(null);
  const [copiadoFeedback, setCopiadoFeedback] = useState<boolean>(false);

  // Datas padrão para filtro (atualizadas ao abrir o modal)
  const hojeObj = useMemo(() => new Date(), [visivel]);
  const hojeIsoStr = useMemo(() => obterDataLocalISO(hojeObj), [hojeObj]);
  const seteDiasAtrasIsoStr = useMemo(() => {
    const d = new Date(hojeObj);
    d.setDate(d.getDate() - 6);
    return obterDataLocalISO(d);
  }, [hojeObj]);
  const trintaDiasAtrasIsoStr = useMemo(() => {
    const d = new Date(hojeObj);
    d.setDate(d.getDate() - 29);
    return obterDataLocalISO(d);
  }, [hojeObj]);
  const inicioAnoIsoStr = useMemo(() => `${hojeObj.getFullYear()}-01-01`, [hojeObj]);

  const dataMaisAntigaObj = useMemo(() => {
    if (!vendasValidas || vendasValidas.length === 0) {
      return new Date(2020, 0, 1, 0, 0, 0, 0);
    }
    let minMs = Infinity;
    vendasValidas.forEach((v) => {
      const dt = parseDataVenda(v);
      if (!dt) return;
      const ms = dt.getTime();
      if (!isNaN(ms) && ms < minMs) minMs = ms;
    });
    if (!isFinite(minMs)) return new Date(2020, 0, 1, 0, 0, 0, 0);
    const d = new Date(minMs);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  }, [vendasValidas]);

  const [dataInicioCustom, setDataInicioCustom] = useState<string>(seteDiasAtrasIsoStr);
  const [dataFimCustom, setDataFimCustom] = useState<string>(hojeIsoStr);

  // Mantém o range exibido sincronizado com a data atual quando o modal abre sem filtro customizado
  useEffect(() => {
    if (!visivel || periodoFiltro === 'custom') return;
    if (periodoFiltro === 'hoje') {
      setDataInicioCustom(hojeIsoStr);
      setDataFimCustom(hojeIsoStr);
    } else if (periodoFiltro === '7dias') {
      setDataInicioCustom(seteDiasAtrasIsoStr);
      setDataFimCustom(hojeIsoStr);
    } else if (periodoFiltro === '30dias') {
      setDataInicioCustom(trintaDiasAtrasIsoStr);
      setDataFimCustom(hojeIsoStr);
    } else if (periodoFiltro === 'ano') {
      setDataInicioCustom(inicioAnoIsoStr);
      setDataFimCustom(hojeIsoStr);
    } else if (periodoFiltro === 'tudo') {
      setDataInicioCustom(obterDataLocalISO(dataMaisAntigaObj));
      setDataFimCustom(hojeIsoStr);
    }
  }, [visivel, periodoFiltro, hojeIsoStr, seteDiasAtrasIsoStr, trintaDiasAtrasIsoStr, inicioAnoIsoStr, dataMaisAntigaObj]);

  // Intervalo do período ativo
  const { dataInicioObj, dataFimObj, periodoLabel } = useMemo(() => {
    const agora = new Date();
    let inicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - 6, 0, 0, 0, 0);
    let fim = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999);
    let label = 'últimos 7 dias';

    if (periodoFiltro === 'hoje') {
      inicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 0, 0, 0, 0);
      fim = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999);
      label = 'hoje';
    } else if (periodoFiltro === '7dias') {
      const d = new Date(agora);
      d.setDate(d.getDate() - 6);
      inicio = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
      fim = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999);
      label = 'últimos 7 dias';
    } else if (periodoFiltro === '30dias') {
      const d = new Date(agora);
      d.setDate(d.getDate() - 29);
      inicio = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
      fim = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999);
      label = 'últimos 30 dias';
    } else if (periodoFiltro === 'ano') {
      inicio = new Date(agora.getFullYear(), 0, 1, 0, 0, 0, 0);
      fim = new Date(agora.getFullYear(), 11, 31, 23, 59, 59, 999);
      label = `ano de ${agora.getFullYear()}`;
    } else if (periodoFiltro === 'tudo') {
      inicio = new Date(dataMaisAntigaObj);
      fim = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999);
      label = 'todo o histórico';
    } else {
      const pIni = (dataInicioCustom || '').split('-');
      const pFim = (dataFimCustom || '').split('-');
      if (pIni.length === 3 && pFim.length === 3) {
        const iniCand = new Date(parseInt(pIni[0], 10), parseInt(pIni[1], 10) - 1, parseInt(pIni[2], 10), 0, 0, 0, 0);
        const fimCand = new Date(parseInt(pFim[0], 10), parseInt(pFim[1], 10) - 1, parseInt(pFim[2], 10), 23, 59, 59, 999);
        if (!isNaN(iniCand.getTime()) && !isNaN(fimCand.getTime()) && iniCand.getTime() <= fimCand.getTime()) {
          inicio = iniCand;
          fim = fimCand;
          label = `${pIni[2]}/${pIni[1]} até ${pFim[2]}/${pFim[1]}`;
        }
      }
    }

    return { dataInicioObj: inicio, dataFimObj: fim, periodoLabel: label };
  }, [periodoFiltro, dataInicioCustom, dataFimCustom, dataMaisAntigaObj]);

  // Vendas do período atual e do período anterior equivalente
  const { vendasPainel, faturamentoTotal, faturamentoAnterior, variacaoPercentual } = useMemo(() => {
    const tIni = dataInicioObj.getTime();
    const tFim = dataFimObj.getTime();
    const duracaoMs = tFim - tIni;
    const tIniAnt = tIni - duracaoMs - 1;
    const tFimAnt = tIni - 1;

    let fatAtual = 0;
    let fatAnt = 0;
    const listaAtual: Venda[] = [];

    vendasValidas.forEach((v) => {
      const dt = parseDataVenda(v);
      if (!dt) return;
      const ms = dt.getTime();
      const val = Number(v.valorTotal) || 0;
      if (ms >= tIni && ms <= tFim) {
        listaAtual.push(v);
        fatAtual += val;
      } else if (ms >= tIniAnt && ms <= tFimAnt) {
        fatAnt += val;
      }
    });

    let varPct = 0;
    if (fatAnt > 0) {
      varPct = ((fatAtual - fatAnt) / fatAnt) * 100;
    } else if (fatAtual > 0) {
      varPct = 100;
    }

    return {
      vendasPainel: listaAtual,
      faturamentoTotal: fatAtual,
      faturamentoAnterior: fatAnt,
      variacaoPercentual: varPct,
    };
  }, [vendasValidas, dataInicioObj, dataFimObj]);

  const volumePedidos = vendasPainel.length;
  const ticketMedio = volumePedidos > 0 ? faturamentoTotal / volumePedidos : 0;

  // Função para inferir / resolver categoria de forma robusta
  const obterCategoriaItem = (codigo: string, nome: string): string => {
    const normNome = (nome || '').toLowerCase();
    const codLimpo = String(codigo || '').trim();
    const catDireta = codLimpo ? mapaCatalogoPorCodigo.get(codLimpo) : undefined;
    const est = estoque.find((e) => e.codigo === codigo || (e.nome && e.nome.toLowerCase() === normNome));
    if (est && est.categoria && est.categoria.trim() && est.categoria !== 'Geral') {
      return est.categoria.trim();
    }
    const cat =
      catDireta ||
      catalogoGlobal.find((c) => (c.nome && c.nome.toLowerCase() === normNome));
    if (cat && cat.categoria && cat.categoria.trim() && cat.categoria !== 'Geral') {
      return cat.categoria.trim();
    }
    if (normNome.includes('pizza')) return 'Pizzas';
    if (
      normNome.includes('whisky') ||
      normNome.includes('vodka') ||
      normNome.includes('gin ') ||
      normNome.includes('cachaça') ||
      normNome.includes('cachaca') ||
      normNome.includes('licor') ||
      normNome.includes('vinho')
    ) return 'Destilados & Whiskies';
    if (
      normNome.includes('chopp') ||
      normNome.includes('cerveja') ||
      normNome.includes('long neck')
    ) return 'Cervejas';
    if (
      normNome.includes('refrigerante') ||
      normNome.includes('coca') ||
      normNome.includes('pepsi') ||
      normNome.includes('suco') ||
      normNome.includes('bebida') ||
      normNome.includes('energético') ||
      normNome.includes('energetico') ||
      normNome.includes('gatorade') ||
      normNome.includes('chá') ||
      normNome.includes('cha ') ||
      normNome.includes('água') ||
      normNome.includes('agua')
    ) return 'Bebidas';
    if (
      normNome.includes('arroz') ||
      normNome.includes('feijão') ||
      normNome.includes('feijao') ||
      normNome.includes('macarrão') ||
      normNome.includes('macarrao') ||
      normNome.includes('óleo') ||
      normNome.includes('oleo') ||
      normNome.includes('açúcar') ||
      normNome.includes('acucar') ||
      normNome.includes('farinha')
    ) return 'Mercearia';
    if (
      normNome.includes('nescau') ||
      normNome.includes('toddy') ||
      normNome.includes('achocolatado') ||
      normNome.includes('leite') ||
      normNome.includes('café') ||
      normNome.includes('cafe') ||
      normNome.includes('expresso') ||
      normNome.includes('cappuccino')
    ) return 'Cafés & Matinais';
    if (
      normNome.includes('isqueiro') ||
      normNome.includes('carvão') ||
      normNome.includes('carvao') ||
      normNome.includes('gelo') ||
      normNome.includes('tabaco') ||
      normNome.includes('palheiro')
    ) return 'Tabacaria & Conveniência';
    if (
      normNome.includes('batata') ||
      normNome.includes('porção') ||
      normNome.includes('porcao') ||
      normNome.includes('espeto') ||
      normNome.includes('espetinho') ||
      normNome.includes('tábua') ||
      normNome.includes('tabua') ||
      normNome.includes('mandioca') ||
      normNome.includes('pastel') ||
      normNome.includes('calabresa') ||
      normNome.includes('salgadinho') ||
      normNome.includes('fandangos')
    ) return 'Porções & Snacks';
    if (
      normNome.includes('burger') ||
      normNome.includes('hambúrguer') ||
      normNome.includes('lanche') ||
      normNome.includes('sanduíche') ||
      normNome.includes('artesanal') ||
      normNome.includes('misto')
    ) return 'Lanches';
    if (
      normNome.includes('sorvete') ||
      normNome.includes('sobremesa') ||
      normNome.includes('petit') ||
      normNome.includes('açai') ||
      normNome.includes('acai') ||
      normNome.includes('doce') ||
      normNome.includes('pudim') ||
      normNome.includes('torta')
    ) return 'Sobremesas';
    return 'Geral';
  };

  // PRD Neo-Brutalista Gourmet: Mapeamento Semântico de Categorias (Cores Vibrantes e Vivas)
  const PALETA_VIBRANTE_CATEGORIAS = [
    '#DC2626', // Vermelho Napolitano
    '#2563EB', // Azul Royal
    '#16A34A', // Verde Esmeralda
    '#D97706', // Âmbar Caramelo
    '#0284C7', // Azul PDV
    '#0891B2', // Ciano Turquesa
    '#EA580C', // Laranja Vibrante
    '#DB2777', // Rosa Gourmet
    '#0369A1', // Azul Profundo
  ];

  const mapaCoresCategorias: Record<string, string> = {
    'Pizzas': '#DC2626',                   // Vermelho Napolitano
    'Bebidas': '#0284C7',                  // Azul PDV
    'Bebidas Alcoólicas': '#EA580C',       // Laranja Malte
    'Cervejas': '#EA580C',                 // Laranja Malte
    'Destilados & Whiskies': '#D97706',    // Âmbar Ouro
    'Sobremesas': '#DB2777',               // Rosa Gourmet
    'Porções & Entradas': '#16A34A',       // Verde Esmeralda
    'Porções & Snacks': '#16A34A',         // Verde Esmeralda
    'Porções': '#16A34A',                  // Verde Esmeralda
    'Mercearia': '#10B981',                // Esmeralda Vivo
    'Lanches': '#0284C7',                  // Azul PDV
    'Tabacaria & Conveniência': '#D97706', // Âmbar
    'Cafés': '#B45309',                    // Marrom Café
    'Cafés & Matinais': '#0891B2',         // Ciano Turquesa
    'Adega': '#0369A1',                    // Azul Profundo
    'Balcão': '#E11D48',                   // Vermelho Rubi
    'Outros': '#64748B',                   // Slate Neutro
    'Geral': '#0D9488',                    // Verde-Água
    'Diversos': '#0EA5E9',                 // Sky
  };

  const obterCorVivaCategoria = (nomeCategoria: string, indexFallback: number = 0): string => {
    if (mapaCoresCategorias[nomeCategoria]) return mapaCoresCategorias[nomeCategoria];
    const norm = (nomeCategoria || '').toLowerCase();
    if (norm.includes('pizza')) return '#DC2626';
    if (norm.includes('bebida') || norm.includes('refrig') || norm.includes('suco') || norm.includes('agua')) return '#0284C7';
    if (norm.includes('cervej') || norm.includes('chopp') || norm.includes('alcool')) return '#EA580C';
    if (norm.includes('destilad') || norm.includes('whisk') || norm.includes('vinho') || norm.includes('vodka')) return '#D97706';
    if (norm.includes('mercear') || norm.includes('alimento') || norm.includes('porc') || norm.includes('snack')) return '#16A34A';
    if (norm.includes('tabacar') || norm.includes('conveni') || norm.includes('lanche')) return '#0284C7';
    if (norm.includes('cafe') || norm.includes('matina') || norm.includes('latic')) return '#0891B2';
    if (norm.includes('doce') || norm.includes('sobremesa') || norm.includes('bombon')) return '#DB2777';
    return PALETA_VIBRANTE_CATEGORIAS[indexFallback % PALETA_VIBRANTE_CATEGORIAS.length];
  };

  // Itens agregados do período
  const itensAgregados = useMemo(() => {
    const mapa: Record<string, {
      codigo: string;
      nome: string;
      categoria: string;
      qtdVendida: number;
      faturamentoTotal: number;
      precoMedio: number;
      porcentagemTotal: number;
    }> = {};

    vendasPainel.forEach((v) => {
      (v.itens || []).forEach((it) => {
        const key = it.codigo || it.nome;
        if (!mapa[key]) {
          const cat = obterCategoriaItem(it.codigo, it.nome);
          mapa[key] = {
            codigo: it.codigo,
            nome: it.nome,
            categoria: cat,
            qtdVendida: 0,
            faturamentoTotal: 0,
            precoMedio: it.preco_unitario || 0,
            porcentagemTotal: 0,
          };
        }
        mapa[key].qtdVendida += (it.quantidade || 0);
        mapa[key].faturamentoTotal += (it.subtotal || ((it.quantidade || 0) * (it.preco_unitario || 0)));
      });
    });

    const lista = Object.values(mapa).map((item) => ({
      ...item,
      precoMedio: item.qtdVendida > 0 ? item.faturamentoTotal / item.qtdVendida : item.precoMedio,
      porcentagemTotal: faturamentoTotal > 0 ? (item.faturamentoTotal / faturamentoTotal) * 100 : 0,
    }));

    lista.sort((a, b) => b.faturamentoTotal - a.faturamentoTotal);
    return lista;
  }, [vendasPainel, faturamentoTotal, estoque, catalogoGlobal]);

  const itemMaisVendido = itensAgregados[0] || null;

  // Curva de Vendas por Período
  const dadosCurvaVendas = useMemo(() => {
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    if (periodoFiltro === '7dias') {
      const pontos: { label: string; faturamento: number; pedidos: number }[] = [];
      const inicio = new Date(dataInicioObj);
      for (let i = 0; i < 7; i++) {
        const cur = new Date(inicio);
        cur.setDate(inicio.getDate() + i);
        const isoDia = obterDataLocalISO(cur);
        const diaNome = diasSemana[cur.getDay()];

        let fat = 0;
        let ped = 0;
        vendasPainel.forEach((v) => {
          const dt = parseDataVenda(v);
          if (dt && obterDataLocalISO(dt) === isoDia) {
            fat += Number(v.valorTotal) || 0;
            ped += 1;
          }
        });
        pontos.push({ label: diaNome, faturamento: fat, pedidos: ped });
      }
      return pontos;
    }

    if (periodoFiltro === 'hoje') {
      let horaMin = 8;
      vendasPainel.forEach((v) => {
        const dt = parseDataVenda(v);
        if (!dt) return;
        const h = dt.getHours();
        if (h < horaMin) horaMin = h;
      });
      const horas: string[] = [];
      for (let h = horaMin; h <= 23; h++) {
        horas.push(`${String(h).padStart(2, '0')}h`);
      }
      return horas.map((hStr) => {
        const hNum = parseInt(hStr, 10);
        let fat = 0;
        let ped = 0;
        vendasPainel.forEach((v) => {
          const dt = parseDataVenda(v);
          if (dt && dt.getHours() === hNum) {
            fat += Number(v.valorTotal) || 0;
            ped += 1;
          }
        });
        return { label: hStr, faturamento: fat, pedidos: ped };
      });
    }

    if (periodoFiltro === 'ano') {
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const anoRef = dataInicioObj.getFullYear();
      return meses.map((mes, idx) => {
        let fat = 0;
        let ped = 0;
        vendasPainel.forEach((v) => {
          const dt = parseDataVenda(v);
          if (dt && dt.getFullYear() === anoRef && dt.getMonth() === idx) {
            fat += Number(v.valorTotal) || 0;
            ped += 1;
          }
        });
        return { label: mes, faturamento: fat, pedidos: ped };
      });
    }

    if (periodoFiltro === 'tudo') {
      const tIni = dataInicioObj.getTime();
      const tFim = dataFimObj.getTime();
      const diffDias = Math.max(1, Math.round((tFim - tIni) / (24 * 60 * 60 * 1000)));
      if (diffDias > 60) {
        const mapaMeses = new Map<string, { label: string; faturamento: number; pedidos: number; sortKey: string }>();
        vendasPainel.forEach((v) => {
          const dt = parseDataVenda(v);
          if (!dt) return;
          const mes = String(dt.getMonth() + 1).padStart(2, '0');
          const ano = String(dt.getFullYear());
          const sortKey = `${ano}-${mes}`;
          const label = `${mes}/${ano}`;
          const atual = mapaMeses.get(sortKey) || { label, faturamento: 0, pedidos: 0, sortKey };
          atual.faturamento += Number(v.valorTotal) || 0;
          atual.pedidos += 1;
          mapaMeses.set(sortKey, atual);
        });
        return Array.from(mapaMeses.values())
          .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
          .map(({ label, faturamento, pedidos }) => ({ label, faturamento, pedidos }));
      }
      const mapaDiasTudo = new Map<string, { label: string; faturamento: number; pedidos: number; sortKey: string }>();
      vendasPainel.forEach((v) => {
        const dt = parseDataVenda(v);
        if (!dt) return;
        const iso = obterDataLocalISO(dt);
        const parts = iso.split('-');
        const label = `${parts[2]}/${parts[1]}`;
        const atual = mapaDiasTudo.get(iso) || { label, faturamento: 0, pedidos: 0, sortKey: iso };
        atual.faturamento += Number(v.valorTotal) || 0;
        atual.pedidos += 1;
        mapaDiasTudo.set(iso, atual);
      });
      return Array.from(mapaDiasTudo.values())
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
        .map(({ label, faturamento, pedidos }) => ({ label, faturamento, pedidos }));
    }

    // 30 dias ou custom (sem truncar em 31 dias; agrupa por mês se intervalo > 60 dias)
    const diaMs = 24 * 60 * 60 * 1000;
    const utcIni = Date.UTC(
      dataInicioObj.getFullYear(),
      dataInicioObj.getMonth(),
      dataInicioObj.getDate()
    );
    const utcFim = Date.UTC(
      dataFimObj.getFullYear(),
      dataFimObj.getMonth(),
      dataFimObj.getDate()
    );
    const numDias = Math.max(1, Math.round((utcFim - utcIni) / diaMs) + 1);

    if (numDias > 60) {
      const mapaMeses = new Map<string, { label: string; faturamento: number; pedidos: number; sortKey: string }>();
      vendasPainel.forEach((v) => {
        const dt = parseDataVenda(v);
        if (!dt) return;
        const mes = String(dt.getMonth() + 1).padStart(2, '0');
        const ano = String(dt.getFullYear());
        const sortKey = `${ano}-${mes}`;
        const label = `${mes}/${ano}`;
        const atual = mapaMeses.get(sortKey) || { label, faturamento: 0, pedidos: 0, sortKey };
        atual.faturamento += Number(v.valorTotal) || 0;
        atual.pedidos += 1;
        mapaMeses.set(sortKey, atual);
      });
      return Array.from(mapaMeses.values())
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
        .map(({ label, faturamento, pedidos }) => ({ label, faturamento, pedidos }));
    }

    const mapaDias: Record<string, { label: string; faturamento: number; pedidos: number }> = {};
    for (let i = 0; i < numDias; i++) {
      const d = new Date(
        dataInicioObj.getFullYear(),
        dataInicioObj.getMonth(),
        dataInicioObj.getDate() + i
      );
      const iso = obterDataLocalISO(d);
      const parts = iso.split('-');
      const label = `${parts[2]}/${parts[1]}`;
      mapaDias[iso] = { label, faturamento: 0, pedidos: 0 };
    }

    vendasPainel.forEach((v) => {
      const dt = parseDataVenda(v);
      if (!dt) return;
      const iso = obterDataLocalISO(dt);
      if (mapaDias[iso]) {
        mapaDias[iso].faturamento += Number(v.valorTotal) || 0;
        mapaDias[iso].pedidos += 1;
      }
    });

    return Object.values(mapaDias);
  }, [periodoFiltro, dataInicioObj, dataFimObj, vendasPainel]);

  // Categorias para Donut
  const dadosCategorias = useMemo(() => {
    const mapa: Record<string, number> = {};
    vendasPainel.forEach((v) => {
      (v.itens || []).forEach((it) => {
        const cat = obterCategoriaItem(it.codigo, it.nome);
        const sub = it.subtotal || ((it.quantidade || 0) * (it.preco_unitario || 0));
        mapa[cat] = (mapa[cat] || 0) + sub;
      });
    });

    const totalCat = Object.values(mapa).reduce((a, b) => a + b, 0);

    const entries = Object.entries(mapa);
    entries.sort((a, b) => b[1] - a[1]);

    const lista = entries.map(([nome, valor], idx) => ({
      nome,
      valor,
      porcentagem: totalCat > 0 ? Math.round((valor / totalCat) * 100) : 0,
      cor: obterCorVivaCategoria(nome, idx),
    }));

    return lista;
  }, [vendasPainel, estoque, catalogoGlobal]);

  // Horários de Pico (24h completas em 8 faixas)
  const dadosHorariosPico = useMemo(() => {
    const faixas = [
      { label: '00h-06h', inicioH: 0, fimH: 6 },
      { label: '06h-09h', inicioH: 6, fimH: 9 },
      { label: '09h-12h', inicioH: 9, fimH: 12 },
      { label: '12h-15h', inicioH: 12, fimH: 15 },
      { label: '15h-18h', inicioH: 15, fimH: 18 },
      { label: '18h-20h', inicioH: 18, fimH: 20 },
      { label: '20h-22h', inicioH: 20, fimH: 22 },
      { label: '22h-24h', inicioH: 22, fimH: 24 },
    ];

    const contagem = faixas.map((f) => {
      let pedidos = 0;
      vendasPainel.forEach((v) => {
        const dt = parseDataVenda(v);
        if (!dt) return;
        const h = dt.getHours();
        if (h >= f.inicioH && h < f.fimH) {
          pedidos += 1;
        }
      });
      return { faixa: f.label, pedidos };
    });

    const max = Math.max(...contagem.map((c) => c.pedidos), 0);
    const faixaPico =
      max > 0
        ? contagem.find((c) => c.pedidos === max)?.faixa || 'Sem pedidos'
        : 'Sem pedidos';

    return { faixas: contagem, maxPedidos: max, faixaPico };
  }, [vendasPainel]);

  // Formas de Pagamento
  const dadosFormasPagamentoPainel = useMemo(() => {
    // PRD Neo-Brutalista: Formas de Pagamento
    const formas: Record<string, { label: string; valor: number; qtd: number; cor: string; icone: string }> = {
      pix: { label: 'PIX (Instantâneo)', valor: 0, qtd: 0, cor: '#10B981', icone: '📱' },       // Verde Esmeralda PIX
      cartao_credito: { label: 'Cartão de Crédito', valor: 0, qtd: 0, cor: '#2563EB', icone: '💳' }, // Azul Financeiro
      cartao_debito: { label: 'Cartão de Débito', valor: 0, qtd: 0, cor: '#D97706', icone: '💳' },   // Âmbar / Laranja Ouro
      dinheiro: { label: 'Dinheiro Físico', valor: 0, qtd: 0, cor: '#6B7280', icone: '💵' },       // Cinza Neutro de Cédula
      fiado: { label: 'Fiado (A Prazo)', valor: 0, qtd: 0, cor: '#DC2626', icone: '📝' },          // Vermelho Alerta
      outros: { label: 'Outros Meios', valor: 0, qtd: 0, cor: '#4B5563', icone: '🔖' },
    };

    vendasPainel.forEach((v) => {
      const total = Number(v.valorTotal) || 0;
      const fNorm = (v.formaPagamento || '').toLowerCase();
      if (fNorm.includes('pix')) {
        formas.pix.valor += total;
        formas.pix.qtd += 1;
      } else if (fNorm.includes('credito') || fNorm.includes('crédito')) {
        formas.cartao_credito.valor += total;
        formas.cartao_credito.qtd += 1;
      } else if (fNorm.includes('debito') || fNorm.includes('débito')) {
        formas.cartao_debito.valor += total;
        formas.cartao_debito.qtd += 1;
      } else if (fNorm.includes('dinheiro')) {
        formas.dinheiro.valor += total;
        formas.dinheiro.qtd += 1;
      } else if (fNorm.includes('fiado')) {
        formas.fiado.valor += total;
        formas.fiado.qtd += 1;
      } else {
        formas.outros.valor += total;
        formas.outros.qtd += 1;
      }
    });

    const totalGeral = Object.values(formas).reduce((acc, f) => acc + f.valor, 0);

    const lista = Object.values(formas)
      .map((f) => ({
        ...f,
        porcentagem: totalGeral > 0 ? Math.round((f.valor / totalGeral) * 100) : 0,
      }))
      .filter((f) => f.valor > 0 || f.qtd > 0);

    lista.sort((a, b) => b.valor - a.valor);

    const lider =
      totalGeral > 0 && lista[0]
        ? lista[0]
        : { label: 'Sem vendas', porcentagem: 0 };

    return { lista, totalGeral, lider };
  }, [vendasPainel]);

  // Categorias disponíveis para Top Produtos
  const categoriasDisponiveisTop = useMemo(() => {
    const cats = new Set<string>();
    itensAgregados.forEach((it) => {
      if (it.categoria) cats.add(it.categoria);
    });
    return ['Todas', ...Array.from(cats)];
  }, [itensAgregados]);

  // Top Produtos Filtrados
  const topProdutosFiltrados = useMemo(() => {
    let itens = [...itensAgregados];
    if (filtroCategoriaTop !== 'todas' && filtroCategoriaTop !== 'Todas') {
      itens = itens.filter((it) => it.categoria.toLowerCase() === filtroCategoriaTop.toLowerCase());
    }
    if (metricaTop === 'faturamento') {
      itens.sort((a, b) => b.faturamentoTotal - a.faturamentoTotal);
    } else {
      itens.sort((a, b) => b.qtdVendida - a.qtdVendida);
    }
    return itens.slice(0, 8);
  }, [itensAgregados, filtroCategoriaTop, metricaTop]);

  // Tabela Analítica com Busca
  const itensTabelaAnalitica = useMemo(() => {
    const q = buscaTabela.toLowerCase().trim();
    if (!q) return itensAgregados;
    return itensAgregados.filter(
      (it) => it.nome.toLowerCase().includes(q) || it.categoria.toLowerCase().includes(q) || it.codigo.toLowerCase().includes(q)
    );
  }, [itensAgregados, buscaTabela]);

  // Copiar Resumo Executivo
  const copiarResumoExecutivo = () => {
    const dataIniFormatada = dataInicioObj.toLocaleDateString('pt-BR');
    const dataFimFormatada = dataFimObj.toLocaleDateString('pt-BR');

    const top3 = itensAgregados.slice(0, 3).map((it, idx) => `${idx + 1}. ${it.nome}: ${it.qtdVendida} un (R$ ${it.faturamentoTotal.toFixed(2).replace('.', ',')})`).join('\n');

    const formas = dadosFormasPagamentoPainel.lista.map((f) => `- ${f.label}: ${f.porcentagem}% (R$ ${f.valor.toFixed(2).replace('.', ',')})`).join('\n');

    const texto = `📊 *PAINEL DE INTELIGÊNCIA & GRÁFICOS DE VENDAS*
🏪 Loja: ${nomeLoja}
📅 Período: ${dataIniFormatada} até ${dataFimFormatada} (${periodoLabel})

💰 *FATURAMENTO TOTAL:* R$ ${faturamentoTotal.toFixed(2).replace('.', ',')} (${variacaoPercentual >= 0 ? '+' : ''}${variacaoPercentual.toFixed(1)}% vs período anterior)
📦 *VOLUME DE PEDIDOS:* ${volumePedidos} pedidos
🎯 *TICKET MÉDIO:* R$ ${ticketMedio.toFixed(2).replace('.', ',')}
⭐ *MAIS VENDIDO:* ${itemMaisVendido ? `${itemMaisVendido.nome} (${itemMaisVendido.qtdVendida} un - R$ ${itemMaisVendido.faturamentoTotal.toFixed(2).replace('.', ',')})` : 'Nenhum'}

💳 *FORMAS DE PAGAMENTO:*
${formas || '- Nenhuma venda registrada'}

🍴 *TOP PRODUTOS DO CARDÁPIO:*
${top3 || '- Nenhum produto vendido'}

⏰ *HORÁRIO DE PICO:* ${dadosHorariosPico.faixaPico} (${dadosHorariosPico.maxPedidos} pedidos)
`;

    try {
      navigator.clipboard.writeText(texto);
      setCopiadoFeedback(true);
      setTimeout(() => setCopiadoFeedback(false), 2500);
    } catch (err) {
      console.error('Erro ao copiar resumo:', err);
    }
  };
  // --- FIM DOS CÁLCULOS DO NOVO PAINEL ---

  // Return null if not visible AFTER all hooks
  useVoltarHierarquico(visivel, onFechar);

  if (!visivel) return null;

  return (
    <div
      ref={modalRef}
      className="tela-relatorio-cheia"
      style={{ display: 'flex', zIndex: 9999, background: '#f8fafc' }}
    >
      {/* CABEÇALHO FIXO */}
      <div className="cabecalho-relatorio">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0, fontSize: '0.92rem', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span>📈</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Gráficos & Inteligência ({nomeLoja})</span>
        </h2>
        <button className="btn-voltar-rel" onClick={onFechar} style={{ flexShrink: 0, padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.18)' }}>
          ✕ Fechar
        </button>
      </div>

      {/* BARRA DE NAVEGAÇÃO DE ABAS FIXA E ROLÁVEL HORIZONTALMENTE */}
      <div
        className="barra-abas-graficos"
        style={{
          display: 'flex',
          gap: '8px',
          padding: '10px 14px',
          background: '#ffffff',
          borderBottom: '1px solid #cbd5e1',
          overflowX: 'auto',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          width: '100%',
          boxSizing: 'border-box',
          position: 'sticky',
          top: 48,
          zIndex: 90,
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
        }}
      >
                <button
          style={{
            padding: '7px 14px',
            borderRadius: '8px',
            border: abaAtiva === 'grafico' ? '1px solid #0284c7' : '1px solid #e2e8f0',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'grafico' ? '#0284c7' : '#ffffff',
            color: abaAtiva === 'grafico' ? '#ffffff' : '#334155',
            transition: 'all 0.15s ease',
          }}
          onClick={() => setAbaAtiva('grafico')}
        >
          Painel de Inteligência & Gráficos
        </button>

        <button
          style={{
            padding: '7px 14px',
            borderRadius: '8px',
            border: abaAtiva === 'formas_pgto' ? '1px solid #0284c7' : '1px solid #e2e8f0',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'formas_pgto' ? '#0284c7' : '#ffffff',
            color: abaAtiva === 'formas_pgto' ? '#ffffff' : '#334155',
            transition: 'all 0.15s ease',
          }}
          onClick={() => setAbaAtiva('formas_pgto')}
        >
          Formas de Pagamento
        </button>

        <button
          style={{
            padding: '7px 14px',
            borderRadius: '8px',
            border: abaAtiva === 'devolucoes' ? '1px solid #0284c7' : '1px solid #e2e8f0',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'devolucoes' ? '#0284c7' : '#ffffff',
            color: abaAtiva === 'devolucoes' ? '#ffffff' : '#334155',
            transition: 'all 0.15s ease',
          }}
          onClick={() => setAbaAtiva('devolucoes')}
        >
          Devoluções & Estornos ({vendasEstornadas.length})
        </button>

        <button
          style={{
            padding: '7px 14px',
            borderRadius: '8px',
            border: abaAtiva === 'perdas' ? '1px solid #0284c7' : '1px solid #e2e8f0',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'perdas' ? '#0284c7' : '#ffffff',
            color: abaAtiva === 'perdas' ? '#ffffff' : '#334155',
            transition: 'all 0.15s ease',
          }}
          onClick={() => setAbaAtiva('perdas')}
        >
          Perdas & Vencidos
        </button>

        <button
          style={{
            padding: '7px 14px',
            borderRadius: '8px',
            border: abaAtiva === 'estoque_chart' ? '1px solid #0284c7' : '1px solid #e2e8f0',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'estoque_chart' ? '#0284c7' : '#ffffff',
            color: abaAtiva === 'estoque_chart' ? '#ffffff' : '#334155',
            transition: 'all 0.15s ease',
          }}
          onClick={() => setAbaAtiva('estoque_chart')}
        >
          Visão Geral do Estoque
        </button>

        <button
          style={{
            padding: '7px 14px',
            borderRadius: '8px',
            border: abaAtiva === 'ranking' ? '1px solid #0284c7' : '1px solid #e2e8f0',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'ranking' ? '#0284c7' : '#ffffff',
            color: abaAtiva === 'ranking' ? '#ffffff' : '#334155',
            transition: 'all 0.15s ease',
          }}
          onClick={() => setAbaAtiva('ranking')}
        >
          Ranking de Vendas
        </button>

        <button
          style={{
            padding: '7px 14px',
            borderRadius: '8px',
            border: abaAtiva === 'inteligencia' ? '1px solid #0284c7' : '1px solid #e2e8f0',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'inteligencia' ? '#0284c7' : '#ffffff',
            color: abaAtiva === 'inteligencia' ? '#ffffff' : '#334155',
            transition: 'all 0.15s ease',
          }}
          onClick={() => setAbaAtiva('inteligencia')}
        >
          💡 Inteligência (Dono)
        </button>
      </div>

      {/* CORPO COM ROLAGEM */}
      <div className="corpo-relatorio-cheio" style={{ gap: '14px', display: 'flex', flexDirection: 'column', paddingBottom: '24px', overflowX: 'hidden' }}>
        {erroSync && (
          <div
            style={{
              background: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
              color: '#92400e',
              fontSize: '0.84rem',
              fontWeight: 600,
            }}
          >
            <span>⚠️ {erroSync}</span>
            {onRefazerLogin && (
              <button
                type="button"
                onClick={onRefazerLogin}
                style={{
                  background: '#d97706',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                🔄 Refazer Login
              </button>
            )}
          </div>
        )}
                {/* ABA PRINCIPAL: NOVO PAINEL DE INTELIGÊNCIA & GRÁFICOS (IMAGENS 2, 3, 4 e 5) */}
        {abaAtiva === 'grafico' && (
          <div className="aba-conteudo-painel" style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            
            {/* CONTAINER 1: CABEÇALHO DO PAINEL DE INTELIGÊNCIA COM FILTROS E AÇÕES (PRD NEO-BRUTALISTA) */}
            <div
              style={{
                background: '#E4E3E0',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: '1rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#0f172a',
                    letterSpacing: '-0.02em',
                  }}
                >
                  <span
                    style={{
                      background: '#e0f2fe',
                      color: '#0284c7',
                      borderRadius: '6px',
                      padding: '2px 7px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    BI
                  </span>
                  PAINEL DE INTELIGÊNCIA & GRÁFICOS DE VENDAS
                </h1>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                  Visualização interativa Recharts de faturamento por período, curva de demanda e ranking de itens mais pedidos.
                </p>
              </div>

              {/* FILTROS E AÇÕES (DIREITA) */}
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                {/* Seletor de Data Manual */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    background: '#ffffff',
                    fontSize: '0.76rem',
                  }}
                >
                  <input
                    type="date"
                    value={dataInicioCustom}
                    onChange={(e) => {
                      setDataInicioCustom(e.target.value);
                      setPeriodoFiltro('custom');
                    }}
                    style={{ border: 'none', fontSize: '0.76rem', fontWeight: 600, color: '#0f172a', outline: 'none', background: 'transparent' }}
                  />
                  <span style={{ color: '#64748b' }}>até</span>
                  <input
                    type="date"
                    value={dataFimCustom}
                    onChange={(e) => {
                      setDataFimCustom(e.target.value);
                      setPeriodoFiltro('custom');
                    }}
                    style={{ border: 'none', fontSize: '0.76rem', fontWeight: 600, color: '#0f172a', outline: 'none', background: 'transparent' }}
                  />
                  <button
                    style={{
                      border: 'none',
                      background: '#f1f5f9',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      color: '#0f172a',
                    }}
                    onClick={() => setPeriodoFiltro('custom')}
                  >
                    FILTRAR
                  </button>
                </div>

                {/* Períodos Rápidos */}
                <div style={{ display: 'inline-flex', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                  {[
                    { id: 'hoje', label: 'Hoje' },
                    { id: '7dias', label: '7 Dias' },
                    { id: '30dias', label: '30 Dias' },
                    { id: 'ano', label: 'Ano' },
                    { id: 'tudo', label: 'Tudo' },
                  ].map((p, idx, arr) => {
                    const ativo = periodoFiltro === p.id;
                    return (
                      <button
                        key={p.id}
                        style={{
                          padding: '5px 12px',
                          border: 'none',
                          borderRight: idx < arr.length - 1 ? '1px solid #cbd5e1' : 'none',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          background: ativo ? '#0284c7' : '#ffffff',
                          color: ativo ? '#ffffff' : '#334155',
                          transition: 'all 0.15s ease',
                        }}
                        onClick={() => {
                          setPeriodoFiltro(p.id as any);
                          if (p.id === 'hoje') {
                            setDataInicioCustom(hojeIsoStr);
                            setDataFimCustom(hojeIsoStr);
                          } else if (p.id === '7dias') {
                            setDataInicioCustom(seteDiasAtrasIsoStr);
                            setDataFimCustom(hojeIsoStr);
                          } else if (p.id === '30dias') {
                            setDataInicioCustom(trintaDiasAtrasIsoStr);
                            setDataFimCustom(hojeIsoStr);
                          } else if (p.id === 'ano') {
                            setDataInicioCustom(inicioAnoIsoStr);
                            setDataFimCustom(hojeIsoStr);
                          } else if (p.id === 'tudo') {
                            setDataInicioCustom(obterDataLocalISO(dataMaisAntigaObj));
                            setDataFimCustom(hojeIsoStr);
                          }
                        }}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>

                {/* Copiar Resumo */}
                <button
                  style={{
                    background: copiadoFeedback ? '#059669' : '#0284c7',
                    color: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
                    padding: '6px 14px',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'background 0.2s ease',
                  }}
                  onClick={copiarResumoExecutivo}
                >
                  {copiadoFeedback ? '✓ COPIADO!' : '📥 COPIAR RESUMO'}
                </button>
              </div>
            </div>

            {vendasPainel.length === 0 && vendasValidas.length > 0 && periodoFiltro !== 'tudo' && (
              <div
                style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  flexWrap: 'wrap',
                  fontSize: '0.82rem',
                  color: '#1e40af',
                  fontWeight: 600,
                }}
              >
                <span>
                  ℹ️ Nenhuma venda neste período ({periodoLabel}) — há <b>{vendasValidas.length}</b> venda(s) no histórico total.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPeriodoFiltro('tudo');
                    setDataInicioCustom(obterDataLocalISO(dataMaisAntigaObj));
                    setDataFimCustom(hojeIsoStr);
                  }}
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Ver Todo o Histórico
                </button>
              </div>
            )}

            {/* CONTAINER 2: 4 CARDS KPIS (PRD NEO-BRUTALISTA GOURMET) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '12px',
              }}
            >
              {/* 1. FATURAMENTO TOTAL */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    FATURAMENTO TOTAL
                  </span>
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', margin: '6px 0 2px 0' }}>
                  R$ {faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: variacaoPercentual >= 0 ? '#15803d' : '#dc2626' }}>
                  {variacaoPercentual >= 0 ? '↗ +' : '↘ '}{variacaoPercentual.toFixed(1)}% vs período anterior
                </div>
              </div>

              {/* 2. VOLUME DE PEDIDOS */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    VOLUME DE PEDIDOS
                  </span>
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', margin: '6px 0 2px 0' }}>
                  {volumePedidos} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>pedidos</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700 }}>
                  100% comanda eletrônica
                </div>
              </div>

              {/* 3. TICKET MÉDIO */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    TICKET MÉDIO
                  </span>
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', margin: '6px 0 2px 0' }}>
                  R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 700 }}>
                  {ticketMedio >= 50 ? 'Meta superada (> R$ 50,00)' : 'Média por comanda'}
                </div>
              </div>

              {/* 4. ITEM CAMPEÃO */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ITEM CAMPEÃO
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    margin: '6px 0 2px 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={itemMaisVendido ? itemMaisVendido.nome : 'Sem vendas'}
                >
                  {itemMaisVendido ? itemMaisVendido.nome : 'Nenhum item'}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284c7', fontFamily: 'monospace' }}>
                  {itemMaisVendido
                    ? `${itemMaisVendido.qtdVendida} un (R$ ${itemMaisVendido.faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
                    : 'Sem vendas'}
                </div>
              </div>
            </div>

            {/* CONTAINER 3: CURVA DE VENDAS POR PERÍODO */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    CURVA DE VENDAS POR PERÍODO
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                    Faturamento consolidado ({periodoLabel}).
                  </p>
                </div>

                {/* Toggle: Área / Barras / Linha */}
                <div style={{ display: 'inline-flex', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                  {(['area', 'barras', 'linha'] as const).map((tipo) => {
                    const ativo = tipoVisualizacaoCurva === tipo;
                    const label = tipo === 'area' ? 'Área' : tipo === 'barras' ? 'Barras' : 'Linha';
                    return (
                      <button
                        key={tipo}
                        style={{
                          padding: '4px 12px',
                          border: 'none',
                          borderRight: tipo !== 'linha' ? '1px solid #cbd5e1' : 'none',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          background: ativo ? '#0284c7' : '#ffffff',
                          color: ativo ? '#ffffff' : '#334155',
                          transition: 'all 0.15s ease',
                        }}
                        onClick={() => setTipoVisualizacaoCurva(tipo)}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gráfico Recharts */}
              <div style={{ width: '100%', height: 260, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%" key={`curva_${chartKey}_${tipoVisualizacaoCurva}`}>
                  {tipoVisualizacaoCurva === 'area' ? (
                    <AreaChart data={dadosCurvaVendas} margin={{ top: 15, right: 15, left: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#DC2626" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="#DC2626" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} tick={{ fill: '#64748b', fontFamily: 'monospace' }} />
                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontFamily: 'monospace' }}
                        tickFormatter={(val) => `R$ ${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
                      />
                      <Tooltip
                        formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Faturamento']}
                        labelFormatter={(lbl) => `Período: ${lbl}`}
                        contentStyle={{ background: '#f1f5f9', color: '#334155', borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)', fontSize: '0.8rem', padding: '8px 12px' }} itemStyle={{ color: '#0369a1', fontFamily: 'monospace', fontWeight: 800 }} labelStyle={{ color: '#0f172a', fontWeight: 800 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="faturamento"
                        stroke="#DC2626"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorVendas)"
                        dot={{ r: 3, fill: '#DC2626', strokeWidth: 1, stroke: '#ffffff' }}
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  ) : tipoVisualizacaoCurva === 'barras' ? (
                    <BarChart data={dadosCurvaVendas} margin={{ top: 15, right: 15, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} tick={{ fill: '#64748b', fontFamily: 'monospace' }} />
                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontFamily: 'monospace' }}
                        tickFormatter={(val) => `R$ ${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
                      />
                      <Tooltip
                        formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Faturamento']}
                        contentStyle={{ background: '#f1f5f9', color: '#334155', borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)', fontSize: '0.8rem', padding: '8px 12px' }} itemStyle={{ color: '#0369a1', fontFamily: 'monospace', fontWeight: 800 }} labelStyle={{ color: '#0f172a', fontWeight: 800 }}
                      />
                      <Bar dataKey="faturamento" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={dadosCurvaVendas} margin={{ top: 15, right: 15, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} tick={{ fill: '#64748b', fontFamily: 'monospace' }} />
                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontFamily: 'monospace' }}
                        tickFormatter={(val) => `R$ ${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
                      />
                      <Tooltip
                        formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Faturamento']}
                        contentStyle={{ background: '#f1f5f9', color: '#334155', borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)', fontSize: '0.8rem', padding: '8px 12px' }} itemStyle={{ color: '#0369a1', fontFamily: 'monospace', fontWeight: 800 }} labelStyle={{ color: '#0f172a', fontWeight: 800 }}
                      />
                      <Line type="monotone" dataKey="faturamento" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Legenda centralizada */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.74rem', color: '#ef4444', fontWeight: 700 }}>
                <span>--o--</span> <span>Faturamento (R$)</span>
              </div>
            </div>

            {/* CONTAINER 4: LINHA DO MEIO: TOP PRODUTOS E CATEGORIAS (IMAGEM 3) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '14px',
              }}
            >
              {/* ESQUERDA: TOP PRODUTOS MAIS VENDIDOS */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '12px 16px',
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      TOP PRODUTOS MAIS VENDIDOS
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>
                      Classificação por volume de vendas e faturamento gerado.
                    </p>
                  </div>
                  <div style={{ display: 'inline-flex', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', background: '#FFFFFF' }}>
                    <button
                      style={{
                        padding: '5px 10px',
                        border: 'none',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        background: metricaTop === 'faturamento' ? '#DC2626' : '#ffffff',
                        color: metricaTop === 'faturamento' ? '#ffffff' : '#1E293B',
                      }}
                      onClick={() => setMetricaTop('faturamento')}
                    >
                      💰 Faturamento (R$)
                    </button>
                    <button
                      style={{
                        padding: '5px 10px',
                        border: 'none',
                        borderLeft: '1px solid #cbd5e1',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        background: metricaTop === 'quantidade' ? '#2563EB' : '#ffffff',
                        color: metricaTop === 'quantidade' ? '#ffffff' : '#1E293B',
                      }}
                      onClick={() => setMetricaTop('quantidade')}
                    >
                      📦 Qtd Vendida (un)
                    </button>
                  </div>
                </div>

                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Filtro por Categoria Pills */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginRight: '4px' }}>
                      CATEGORIA:
                    </span>
                    {categoriasDisponiveisTop.map((catNome, cIdx) => {
                      const ativa = filtroCategoriaTop.toLowerCase() === catNome.toLowerCase();
                      const count = catNome === 'Todas'
                        ? itensAgregados.length
                        : itensAgregados.filter((i) => i.categoria.toLowerCase() === catNome.toLowerCase()).length;
                      const corCatPill = catNome === 'Todas' ? '#DC2626' : obterCorVivaCategoria(catNome, cIdx);
                      return (
                        <button
                          key={catNome}
                          style={{
                            padding: '4px 11px',
                            borderRadius: '16px',
                            border: ativa ? `1.5px solid ${corCatPill}` : '1px solid #cbd5e1',
                            background: ativa ? corCatPill : '#F8FAFC',
                            color: ativa ? '#ffffff' : '#334155',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            boxShadow: ativa ? `0 2px 5px ${corCatPill}40` : 'none',
                          }}
                          onClick={() => setFiltroCategoriaTop(catNome)}
                        >
                          {catNome} {count > 0 ? `(${count})` : ''}
                        </button>
                      );
                    })}
                  </div>

                  {/* Barras Horizontais Vibrantes com Pódio e Tooltip escuro */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
                    {topProdutosFiltrados.map((item, idx) => {
                      const valor = metricaTop === 'faturamento' ? item.faturamentoTotal : item.qtdVendida;
                      const maxValor = topProdutosFiltrados[0]
                        ? (metricaTop === 'faturamento' ? topProdutosFiltrados[0].faturamentoTotal : topProdutosFiltrados[0].qtdVendida)
                        : 1;
                      const pct = maxValor > 0 ? (valor / maxValor) * 100 : 0;
                      const corBarra = obterCorVivaCategoria(item.categoria, idx);
                      const isHovered = hoveredTopIdx === idx;
                      const bgCardItem = idx === 0 ? '#FFFBEB' : idx === 1 ? '#F0F9FF' : idx === 2 ? '#FDF2F8' : '#F8FAFC';
                      const borderCardItem = idx === 0 ? '#FDE68A' : idx === 1 ? '#BAE6FD' : idx === 2 ? '#FBCFE8' : '#E2E8F0';
                      const medalha = idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`;
                      const bgMedalha = idx === 0 ? '#FBBF24' : idx === 1 ? '#94A3B8' : idx === 2 ? '#D97706' : '#E2E8F0';
                      const txtMedalha = idx === 2 ? '#FFFFFF' : '#0F172A';

                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                            position: 'relative',
                            background: bgCardItem,
                            border: `1.5px solid ${borderCardItem}`,
                            borderRadius: '8px',
                            padding: '8px 10px',
                          }}
                          onMouseEnter={() => setHoveredTopIdx(idx)}
                          onMouseLeave={() => setHoveredTopIdx(null)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#1e293b', gap: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
                              <span
                                style={{
                                  background: bgMedalha,
                                  color: txtMedalha,
                                  fontWeight: 900,
                                  fontSize: '0.68rem',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  flexShrink: 0,
                                  border: '1px solid rgba(0,0,0,0.12)',
                                }}
                              >
                                {medalha}
                              </span>
                              <span style={{ fontWeight: 800, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.nome}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                  background: `${corBarra}18`,
                                  color: corBarra,
                                  border: `1px solid ${corBarra}40`,
                                  padding: '1px 6px',
                                  borderRadius: '10px',
                                  whiteSpace: 'nowrap',
                                  flexShrink: 0,
                                }}
                              >
                                {item.categoria}
                              </span>
                            </div>
                            <span
                              style={{
                                fontWeight: 900,
                                color: '#047857',
                                background: '#ECFDF5',
                                border: '1px solid #A7F3D0',
                                padding: '2px 7px',
                                borderRadius: '6px',
                                fontSize: '0.76rem',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {metricaTop === 'faturamento'
                                ? `R$ ${item.faturamentoTotal.toFixed(2).replace('.', ',')}`
                                : `${item.qtdVendida} un`}
                            </span>
                          </div>
                          <div style={{ position: 'relative', width: '100%', height: '18px', background: '#FFFFFF', borderRadius: '5px', overflow: 'hidden', border: '1px solid #CBD5E1' }}>
                            <div
                              style={{
                                width: `${Math.max(pct, 4)}%`,
                                height: '100%',
                                background: `linear-gradient(90deg, ${corBarra} 0%, ${corBarra}dd 100%)`,
                                borderRadius: '4px',
                                transition: 'width 0.4s ease',
                              }}
                            />
                          </div>

                          {/* Tooltip escuro ao passar o mouse / tocar */}
                          {isHovered && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '-10px',
                                left: '20px',
                                zIndex: 100,
                                background: '#141414',
                                color: '#ffffff',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                padding: '10px 14px',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                                pointerEvents: 'none',
                                minWidth: '220px',
                              }}
                            >
                              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FBBF24', marginBottom: '6px' }}>
                                {item.nome}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#cbd5e1', margin: '2px 0' }}>
                                <span>Qtd Vendida:</span>
                                <b style={{ color: '#ffffff' }}>{item.qtdVendida} unidades</b>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#cbd5e1', margin: '2px 0' }}>
                                <span>Faturamento:</span>
                                <b style={{ color: '#34D399' }}>R$ {item.faturamentoTotal.toFixed(2).replace('.', ',')}</b>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#cbd5e1', margin: '2px 0' }}>
                                <span>Preço Médio:</span>
                                <b style={{ color: '#ffffff' }}>R$ {item.precoMedio.toFixed(2).replace('.', ',')}</b>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {topProdutosFiltrados.length === 0 && (
                      <div style={{ color: '#64748b', fontSize: '0.8rem', padding: '16px', textAlign: 'center' }}>
                        Nenhum produto vendido nesta categoria.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* DIREITA: VENDAS POR CATEGORIA (DONUT CHART) */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '12px 16px',
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    VENDAS POR CATEGORIA
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>
                    Participação de cada categoria no faturamento total.
                  </p>
                </div>

                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Donut Chart com texto central colorido */}
                  <div style={{ width: '100%', height: 195, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 5 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dadosCategorias}
                            dataKey="valor"
                            nameKey="nome"
                            innerRadius={56}
                            outerRadius={82}
                            paddingAngle={3}
                          >
                            {dadosCategorias.map((c, i) => (
                              <Cell key={i} fill={c.cor} stroke="#ffffff" strokeWidth={2} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(v: any) => [`R$ ${Number(v).toFixed(2).replace('.', ',')}`, 'Faturamento']}
                            wrapperStyle={{ zIndex: 50, pointerEvents: 'none' }}
                            contentStyle={{ background: '#f1f5f9', color: '#334155', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}
                            itemStyle={{ color: '#0f172a', fontWeight: 700 }}
                            labelStyle={{ color: '#0369a1', fontWeight: 700 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1,
                        textAlign: 'center',
                        pointerEvents: 'none',
                        background: '#EFF6FF',
                        border: '1.5px solid #BFDBFE',
                        borderRadius: '50%',
                        width: '94px',
                        height: '94px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#1D4ED8', letterSpacing: '0.5px' }}>TOTAL MIX</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#0F172A' }}>
                        R$ {faturamentoTotal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  </div>

                  {/* Lista da Legenda com % e R$ em Cards Pastel */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {dadosCategorias.map((cat, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.78rem',
                          background: `${cat.cor}10`,
                          border: `1px solid ${cat.cor}35`,
                          borderLeft: `5px solid ${cat.cor}`,
                          borderRadius: '6px',
                          padding: '6px 10px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '10px', height: '10px', background: cat.cor, borderRadius: '50%', display: 'inline-block' }} />
                          <span style={{ color: '#0F172A', fontWeight: 800 }}>{cat.nome}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontWeight: 900,
                              color: '#FFFFFF',
                              background: cat.cor,
                              padding: '1px 7px',
                              borderRadius: '10px',
                              fontSize: '0.72rem',
                            }}
                          >
                            {cat.porcentagem}%
                          </span>
                          <span style={{ color: '#0F172A', fontWeight: 800 }}>
                            R$ {cat.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    ))}
                    {dadosCategorias.length === 0 && (
                      <div style={{ color: '#64748b', fontSize: '0.8rem', padding: '12px', textAlign: 'center' }}>
                        Nenhuma categoria registrada.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CONTAINER 5: LINHA DE BAIXO: HORÁRIOS DE PICO E FORMAS DE PAGAMENTO (IMAGEM 4) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '14px',
              }}
            >
              {/* ESQUERDA: HORÁRIOS DE PICO */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '12px 16px',
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      HORÁRIOS DE PICO DA COZINHA & SALÃO
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>
                      Distribuição de pedidos por faixa horária para planejamento de equipe.
                    </p>
                  </div>
                  <span
                    style={{
                      background: dadosHorariosPico.maxPedidos > 0 ? '#DC2626' : '#64748B',
                      color: '#FFFFFF',
                      border: '1px solid #cbd5e1',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 900,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
                    }}
                  >
                    {dadosHorariosPico.maxPedidos > 0
                      ? `🔥 Pico ${dadosHorariosPico.faixaPico}`
                      : '⏱️ Sem pedidos no período'}
                  </span>
                </div>

                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Legenda rápida de cores de horário */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '0.72rem', fontWeight: 700 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FEF2F2', color: '#B91C1C', padding: '2px 8px', borderRadius: '12px', border: '1px solid #FECACA' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626' }} /> Pico Máximo
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FFFBEB', color: '#B45309', padding: '2px 8px', borderRadius: '12px', border: '1px solid #FDE68A' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} /> Movimento Alto
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }} /> Horário Regular
                    </span>
                  </div>

                  {/* Gráfico de Barras por Faixa Horária */}
                  <div style={{ width: '100%', height: 210, background: '#f8fafc', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '6px 4px 0 0' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dadosHorariosPico.faixas} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" />
                        <XAxis dataKey="faixa" stroke="#0F172A" fontSize={11} fontWeight={700} tickLine={false} />
                        <YAxis stroke="#334155" fontSize={11} fontWeight={700} tickLine={false} />
                        <Tooltip
                          formatter={(val: any) => [`${val} pedidos`, 'Volume de Pedidos']}
                          cursor={{ fill: 'rgba(148, 163, 184, 0.18)' }}
                          contentStyle={{
                            background: '#ffffff',
                            color: '#0f172a',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
                            fontSize: '0.8rem',
                            padding: '8px 12px',
                          }}
                          labelStyle={{ color: '#0f172a', fontWeight: 800, marginBottom: '3px' }}
                          itemStyle={{ color: '#0284c7', fontWeight: 700 }}
                        />
                        <Bar dataKey="pedidos" radius={[4, 4, 0, 0]}>
                          {dadosHorariosPico.faixas.map((entry, index) => {
                            let cor = '#3B82F6';
                            if (entry.pedidos >= 80 || (entry.pedidos === dadosHorariosPico.maxPedidos && entry.pedidos > 0)) {
                              cor = '#DC2626';
                            } else if (entry.pedidos >= 50 || (entry.pedidos >= dadosHorariosPico.maxPedidos * 0.6 && entry.pedidos > 0)) {
                              cor = '#F59E0B';
                            } else if (entry.pedidos === 0) {
                              cor = '#CBD5E1';
                            }
                            return <Cell key={`bar-${index}`} fill={cor} stroke="#ffffff" strokeWidth={1.5} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* DIREITA: VENDAS POR FORMA DE PAGAMENTO */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '12px 16px',
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      VENDAS POR FORMA DE PAGAMENTO
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>
                      Reconciliação dos pagamentos registrados nas comandas e faturamento bruto.
                    </p>
                  </div>
                  <span
                    style={{
                      background: '#16a34a',
                      color: '#FFFFFF',
                      border: '1px solid #15803d',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {dadosFormasPagamentoPainel.lider.label.split(' ')[0]} Lidera ({dadosFormasPagamentoPainel.lider.porcentagem}%)
                  </span>
                </div>

                {/* Cards de Formas de Pagamento */}
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {dadosFormasPagamentoPainel.lista.map((forma, idx) => {
                    const bgPastel =
                      forma.cor === '#10B981'
                        ? '#ECFDF5'
                        : forma.cor === '#2563EB'
                        ? '#EFF6FF'
                        : forma.cor === '#D97706'
                        ? '#FFFBEB'
                        : forma.cor === '#DC2626'
                        ? '#FEF2F2'
                        : forma.cor === '#6B7280'
                        ? '#F3F4F6'
                        : '#E0F2FE';
                    const borderPastel =
                      forma.cor === '#10B981'
                        ? '#A7F3D0'
                        : forma.cor === '#2563EB'
                        ? '#BFDBFE'
                        : forma.cor === '#D97706'
                        ? '#FDE68A'
                        : forma.cor === '#DC2626'
                        ? '#FECACA'
                        : forma.cor === '#6B7280'
                        ? '#D1D5DB'
                        : '#BAE6FD';
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          background: bgPastel,
                          border: `1.5px solid ${borderPastel}`,
                          borderRadius: '8px',
                          padding: '10px 12px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                          <span style={{ fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '1rem' }}>{forma.icone}</span>
                            <span>{forma.label}</span>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                background: '#FFFFFF',
                                color: '#475569',
                                border: '1px solid #CBD5E1',
                                padding: '1px 6px',
                                borderRadius: '10px',
                              }}
                            >
                              {forma.qtd} {forma.qtd === 1 ? 'venda' : 'vendas'}
                            </span>
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                background: forma.cor,
                                color: '#FFFFFF',
                                fontWeight: 900,
                                fontSize: '0.72rem',
                                padding: '2px 7px',
                                borderRadius: '10px',
                              }}
                            >
                              {forma.porcentagem}%
                            </span>
                            <span style={{ color: '#0F172A', fontWeight: 900, fontSize: '0.86rem' }}>
                              R$ {forma.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                        <div style={{ width: '100%', height: '12px', background: '#FFFFFF', borderRadius: '6px', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.min(100, Math.max(forma.porcentagem, 3))}%`,
                              height: '100%',
                              background: forma.cor,
                              transition: 'width 0.4s ease',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {dadosFormasPagamentoPainel.lista.length === 0 && (
                    <div style={{ color: '#64748b', fontSize: '0.8rem', padding: '12px', textAlign: 'center' }}>
                      Nenhum pagamento registrado no período.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CONTAINER 6: TABELA ANALÍTICA DE PERFORMANCE DE CARDÁPIO (IMAGEM 5) */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 900, color: '#111827', textTransform: 'uppercase' }}>
                    TABELA ANALÍTICA DE PERFORMANCE DE CARDÁPIO
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                    Auditoria de faturamento individual por item com ordenação decrescente de vendas.
                  </p>
                </div>

                {/* Campo de Busca */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    background: '#ffffff',
                    minWidth: '220px',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar item no ranking..."
                    value={buscaTabela}
                    onChange={(e) => setBuscaTabela(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.78rem',
                      width: '100%',
                      color: '#0f172a',
                    }}
                  />
                  {buscaTabela && (
                    <button
                      onClick={() => setBuscaTabela('')}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem', color: '#94a3b8' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Tabela Formatada Estilo Imagem 5 */}
              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', color: '#334155', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '10px 12px', width: '60px' }}>RANK</th>
                      <th style={{ padding: '10px 12px' }}>PRODUTO / SABOR</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>CATEGORIA</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>PREÇO MÉDIO</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>QTD VENDIDA</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>FATURAMENTO TOTAL</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>% DO TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itensTabelaAnalitica.map((item, index) => {
                      const rank = index + 1;
                      // PRD Neo-Brutalista: Pódios de Classificação
                      const bgRank = rank === 1 ? '#FBBF24' : rank === 2 ? '#D1D5DB' : rank === 3 ? '#B45309' : '#F1F5F9';
                      const corTextoRank = rank === 1 ? '#000000' : rank === 2 ? '#000000' : rank === 3 ? '#FFFFFF' : '#141414';
                      const corBordaCat = obterCorVivaCategoria(item.categoria, index);

                      return (
                        <tr
                          key={`${item.codigo}_${index}`}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            background: index % 2 === 0 ? '#ffffff' : '#fafafa',
                          }}
                        >
                          <td style={{ padding: '10px 12px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '22px',
                                height: '22px',
                                background: bgRank,
                                color: corTextoRank,
                                borderRadius: '4px',
                                fontWeight: 800,
                                fontSize: '0.75rem',
                              }}
                            >
                              {rank}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>
                            {item.nome}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: corBordaCat,
                                border: `1px solid ${corBordaCat}`,
                                background: `${corBordaCat}15`,
                              }}
                            >
                              {item.categoria}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', color: '#475569' }}>
                            R$ {item.precoMedio.toFixed(2).replace('.', ',')}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600, color: '#1e293b' }}>
                            {item.qtdVendida} un
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#059669' }}>
                            R$ {item.faturamentoTotal.toFixed(2).replace('.', ',')}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', minWidth: '70px' }}>
                              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155' }}>
                                {item.porcentagemTotal.toFixed(1)}%
                              </span>
                              <div style={{ width: '40px', height: '5px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min(100, Math.max(item.porcentagemTotal * 2.5, 3))}%`, height: '100%', background: '#ef4444' }} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {itensTabelaAnalitica.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                          Nenhum item localizado no cardápio para o período.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ABA: FORMAS DE PAGAMENTO & INTELIGÊNCIA */}
        {abaAtiva === 'formas_pgto' && (
          <div className="aba-conteudo-painel" style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            
            {/* SELETOR DE PERÍODO ESPECÍFICO DE FORMAS DE PAGAMENTO */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📅</span> Filtrar Período de Pagamento:
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', background: '#f8fafc', padding: '3px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  Período Atual: <b>{dadosFormasPagamento.labelPeriodo}</b>
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '6px' }}>
                {[
                  { id: 'hoje', rotulo: 'Hoje' },
                  { id: '7dias', rotulo: '7 Dias' },
                  { id: '30dias', rotulo: '30 Dias' },
                  { id: 'mes', rotulo: `Este Mês (${dadosFormasPagamento.nomeMesAtual})` },
                  { id: 'mes_anterior', rotulo: `Mês Anterior (${dadosFormasPagamento.nomeMesAnterior})` },
                  { id: 'ano', rotulo: 'Este Ano' },
                  { id: 'todos', rotulo: 'Todo Histórico' },
                ].map((item) => (
                  <button
                    key={item.id}
                    style={{
                      padding: '7px 8px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      background: periodoFormaPgto === item.id ? '#111827' : '#ffffff',
                      color: periodoFormaPgto === item.id ? '#ffffff' : '#111827',
                      transition: 'all 0.15s ease',
                      boxShadow: 'none',
                    }}
                    onClick={() => setPeriodoFormaPgto(item.id as any)}
                  >
                    {item.rotulo}
                  </button>
                ))}
              </div>
            </div>

            {/* BANNER PRINCIPAL COM MÉTRICAS DO PERÍODO */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', marginBottom: '2px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>💳</span> Formas de Pagamento & Faturamento ({dadosFormasPagamento.labelPeriodo})
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#4b5563', margin: 0, marginTop: '2px' }}>
                  Total de <b style={{ color: '#111827' }}>{dadosFormasPagamento.totalQtd} vendas</b> registradas neste período.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 700 }}>Total Faturado</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>
                    R$ {dadosFormasPagamento.totalGeral.toFixed(2).replace('.', ',')}
                  </div>
                </div>
                <div style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 700 }}>Ticket Médio</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>
                    R$ {dadosFormasPagamento.ticketMedioGeral.toFixed(2).replace('.', ',')}
                  </div>
                </div>
              </div>
            </div>

            {/* CARDS DETALHADOS DE CADA FORMA DE PAGAMENTO */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              {dadosFormasPagamento.lista.map((item) => (
                <div
                  key={item.chave}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    padding: '12px',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#111827' }}>{item.nome}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
                    R$ {item.valor.toFixed(2).replace('.', ',')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#4b5563', display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span>{item.qtd} {item.qtd === 1 ? 'venda' : 'vendas'}</span>
                    <span style={{ fontWeight: 800, color: '#111827' }}>{item.porcentagem.toFixed(1)}%</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#111827', marginTop: '4px', borderTop: '1px dashed #d1d5db', paddingTop: '4px' }}>
                    Média: <b>R$ {item.ticketMedio.toFixed(2).replace('.', ',')}</b>
                  </div>
                </div>
              ))}
            </div>

            {/* PAINEL DE INTELIGÊNCIA & DIAGNÓSTICO FINANCEIRO */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>🧠</span>
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                    Inteligência & Diagnóstico Financeiro ({dadosFormasPagamento.labelPeriodo})
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#4b5563', margin: 0 }}>
                    Análise automática do comportamento de pagamento e liquidez do seu caixa.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {/* INSIGHT 1: MÉTODO CAMPEÃO */}
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
                    🏆 Mais Utilizado pelos Clientes
                  </div>
                  {dadosFormasPagamento.insights.lider ? (
                    <div style={{ fontSize: '0.85rem', color: '#111827' }}>
                      <b>{dadosFormasPagamento.insights.lider.nome}</b> com{' '}
                      <b style={{ color: '#16a34a' }}>{dadosFormasPagamento.insights.lider.porcentagem.toFixed(1)}%</b> do faturamento total (R$ {dadosFormasPagamento.insights.lider.valor.toFixed(2).replace('.', ',')}).
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Nenhum dado registrado.</div>
                  )}
                </div>

                {/* INSIGHT 2: LIQUIDEZ IMEDIATA */}
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
                    ⚡ Liquidez Imediata (PIX + Dinheiro)
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#111827' }}>
                    <b>R$ {dadosFormasPagamento.insights.valorAVista.toFixed(2).replace('.', ',')}</b> ({dadosFormasPagamento.insights.pctAVista.toFixed(1)}% do total).
                    <div style={{ fontSize: '0.72rem', color: '#16a34a', marginTop: '2px', fontWeight: 600 }}>
                      Cai direto na conta/gaveta sem taxas de maquininha.
                    </div>
                  </div>
                </div>

                {/* INSIGHT 3: TICKET MÉDIO POR CANAL */}
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
                    🎫 Maior Ticket Médio
                  </div>
                  {dadosFormasPagamento.insights.maiorTicket ? (
                    <div style={{ fontSize: '0.85rem', color: '#111827' }}>
                      <b>{dadosFormasPagamento.insights.maiorTicket.nome}</b> tem a maior média por venda: <b>R$ {dadosFormasPagamento.insights.maiorTicket.ticketMedio.toFixed(2).replace('.', ',')}</b>.
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Nenhum dado registrado.</div>
                  )}
                </div>

                {/* INSIGHT 4: VENDAS A PRAZO / FIADO */}
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
                    📝 Vendas a Prazo / Fiado
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#111827' }}>
                    <b>R$ {dadosFormasPagamento.insights.valorFiado.toFixed(2).replace('.', ',')}</b> ({dadosFormasPagamento.insights.pctFiado.toFixed(1)}% do total).
                    {dadosFormasPagamento.insights.pctFiado > 15 ? (
                      <div style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: '2px', fontWeight: 700 }}>
                        ⚠️ Atenção: Mais de 15% das vendas foram a prazo. Mantenha as cobranças em dia!
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.72rem', color: '#4b5563', marginTop: '2px' }}>
                        Nível de fiado sob controle ({dadosFormasPagamento.insights.pctFiado.toFixed(1)}%).
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO DE GRÁFICOS: PIZZA (DISTRIBUIÇÃO) E BARRAS (FATURAMENTO) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {/* GRÁFICO 1: PIZZA DE DISTRIBUIÇÃO */}
              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '280px', minWidth: 0 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', marginBottom: '10px', margin: 0 }}>
                  🥧 Distribuição Percentual das Formas de Pgto
                </h4>
                <div style={{ width: '100%', height: 240, minHeight: 240, minWidth: 0 }}>
                  {dadosFormasPagamento.lista.length === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280', fontSize: '0.85rem' }}>
                      Nenhuma venda registrada no período ({dadosFormasPagamento.labelPeriodo}).
                    </div>
                  ) : (
                    <ResponsiveContainer key={`fp-pie-${chartKey}-${periodoFormaPgto}`} width="100%" height={240} minWidth={100} minHeight={240}>
                      <PieChart>
                        <Pie
                          data={dadosFormasPagamento.lista}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="valor"
                          nameKey="nome"
                          label={({ name, percent }: any) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                          labelLine={false}
                        >
                          {dadosFormasPagamento.lista.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.cor} stroke="#ffffff" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Total']}
                          contentStyle={{
                            background: '#ffffff',
                            color: '#0f172a',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
                            fontSize: '0.8rem',
                            padding: '8px 12px',
                          }}
                          labelStyle={{ color: '#0f172a', fontWeight: 800 }}
                          itemStyle={{ color: '#0f172a', fontWeight: 700 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* GRÁFICO 2: BARRAS DE FATURAMENTO TOTAL */}
              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '280px', minWidth: 0 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', marginBottom: '10px', margin: 0 }}>
                  📊 Volume Financeiro por Método (R$)
                </h4>
                <div style={{ width: '100%', height: 240, minHeight: 240, minWidth: 0 }}>
                  {dadosFormasPagamento.lista.length === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280', fontSize: '0.85rem' }}>
                      Nenhuma venda registrada no período ({dadosFormasPagamento.labelPeriodo}).
                    </div>
                  ) : (
                    <ResponsiveContainer key={`fp-bar-${chartKey}-${periodoFormaPgto}`} width="100%" height={240} minWidth={100} minHeight={240}>
                      <BarChart layout="vertical" data={dadosFormasPagamento.lista} margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                        <XAxis type="number" stroke="#6b7280" fontSize={10} tickFormatter={formatarValorYAxis} tick={{ fontSize: 10, fill: '#6b7280' }} />
                        <YAxis dataKey="nome" type="category" width={95} stroke="#6b7280" fontSize={10} tick={{ fontSize: 10, fill: '#6b7280' }} />
                        <Tooltip
                          formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Total']}
                          contentStyle={{
                            background: '#ffffff',
                            color: '#0f172a',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
                            fontSize: '0.8rem',
                            padding: '8px 12px',
                          }}
                          labelStyle={{ color: '#0f172a', fontWeight: 800 }}
                          itemStyle={{ color: '#0f172a', fontWeight: 700 }}
                        />
                        <Bar dataKey="valor" radius={[0, 4, 4, 0]} name="Valor (R$)">
                          {dadosFormasPagamento.lista.map((entry, index) => (
                            <Cell key={`bar-cell-${index}`} fill={entry.cor} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* TABELA DE MÉTRICAS COMPLETAS */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', marginBottom: '10px', margin: 0 }}>
                📋 Tabela Detalhada por Meio de Pagamento ({dadosFormasPagamento.labelPeriodo})
              </h4>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: '460px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', color: '#334155', textAlign: 'left' }}>
                      <th style={{ padding: '9px 12px', borderRadius: '4px 0 0 0' }}>Método</th>
                      <th style={{ padding: '9px 12px', textAlign: 'right' }}>Qtd Vendas</th>
                      <th style={{ padding: '9px 12px', textAlign: 'right' }}>Total (R$)</th>
                      <th style={{ padding: '9px 12px', textAlign: 'right' }}>Ticket Médio</th>
                      <th style={{ padding: '9px 12px', textAlign: 'right' }}>Maior Venda</th>
                      <th style={{ padding: '9px 12px', textAlign: 'right', borderRadius: '0 4px 0 0' }}>% Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosFormasPagamento.lista.map((m) => (
                      <tr key={m.chave} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 700, color: '#111827' }}>
                          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: m.cor, marginRight: '6px' }}></span>
                          {m.nome}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', color: '#4b5563' }}>{m.qtd}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 800, color: '#111827' }}>
                          R$ {m.valor.toFixed(2).replace('.', ',')}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', color: '#111827', fontWeight: 600 }}>
                          R$ {m.ticketMedio.toFixed(2).replace('.', ',')}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', color: '#16a34a', fontWeight: 700 }}>
                          R$ {m.maiorVenda.toFixed(2).replace('.', ',')}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 800, color: '#111827' }}>
                          {m.porcentagem.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: GRÁFICO DE DEVOLUÇÕES & ESTORNOS */}
        {abaAtiva === 'devolucoes' && (
          <div className="aba-conteudo-painel" style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', marginBottom: '2px', margin: 0 }}>
                  🔄 Devoluções & Vendas Estornadas
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#4b5563', margin: 0, marginTop: '2px' }}>
                  Acompanhe os valores devolvidos aos clientes ao longo do tempo.
                </p>
              </div>
              <div style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 700 }}>Total Devolvido</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#dc2626' }}>
                  R$ {totalEstornosGeral.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>

            {/* SELEÇÃO DE PERÍODO PARA DEVOLUÇÕES */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.8rem', color: '#111827', fontWeight: 800 }}>Agrupar por:</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', flex: 1 }}>
                {(['dia', 'semana', 'mes', 'ano'] as const).map((p) => (
                  <button
                    key={p}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      background: periodoGrafico === p ? '#0284c7' : '#ffffff',
                      color: periodoGrafico === p ? '#ffffff' : '#334155',
                      transition: 'all 0.15s ease',
                    }}
                    onClick={() => setPeriodoGrafico(p)}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* GRÁFICO RECHARTS DE DEVOLUÇÕES */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '280px', minWidth: 0 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', marginBottom: '10px', margin: 0 }}>
                Evolução do Valor Estornado (R$) — Por {periodoGrafico.toUpperCase()}
              </h4>
              <div style={{ width: '100%', height: 240, minHeight: 240, minWidth: 0 }}>
                <ResponsiveContainer key={`dev-${chartKey}-${periodoGrafico}`} width="100%" height={240} minWidth={100} minHeight={240}>
                  <BarChart data={dadosGraficoDevolucoes} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#6b7280" fontSize={10} tickLine={false} interval={0} tick={{ fontSize: 10, fill: '#6b7280' }} dy={4} />
                    <YAxis stroke="#6b7280" fontSize={10} width={46} tickLine={false} tickFormatter={formatarValorYAxis} tick={{ fontSize: 10, fill: '#6b7280' }} />
                    <Tooltip
                      formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Valor Estornado']}
                      labelFormatter={(lbl) => `Período: ${lbl}`}
                      cursor={{ fill: 'rgba(148, 163, 184, 0.18)' }}
                      contentStyle={{
                        background: '#ffffff',
                        color: '#0f172a',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
                        fontSize: '0.8rem',
                        padding: '8px 12px',
                      }}
                      labelStyle={{ color: '#0f172a', fontWeight: 800 }}
                      itemStyle={{ color: '#0f172a', fontWeight: 700 }}
                    />
                    <Bar dataKey="estornado" fill="#dc2626" radius={[4, 4, 0, 0]} name="Valor Estornado (R$)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* LISTA DE DEVOLUÇÕES RECENTES */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', marginBottom: '10px', margin: 0 }}>
                📋 Histórico de Transações Estornadas / Canceladas
              </h4>
              {vendasEstornadas.length === 0 ? (
                <div style={{ color: '#6b7280', fontSize: '0.82rem', padding: '14px', textAlign: 'center' }}>
                  Nenhum estorno ou devolução registrado até o momento.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {vendasEstornadas.map((v) => (
                    <div
                      key={v.id}
                      style={{
                        padding: '10px 12px',
                        background: '#ffffff',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '6px',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#111827' }}>
                          Venda #{v.id} — {v.data} {v.hora}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                          Operador: <b style={{ color: '#111827' }}>{v.operadorNome}</b> | Motivo: <i>{v.motivoEstorno || 'Não especificado'}</i>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#dc2626' }}>
                          R$ {(v.valorTotal || 0).toFixed(2)}
                        </div>
                        <span style={{ color: '#ffffff', background: '#dc2626', fontWeight: 800, fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px' }}>ESTORNADA</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA 3: GRÁFICO DE PERDAS & VENCIDOS */}
        {abaAtiva === 'perdas' && (
          <div className="aba-conteudo-painel" style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', marginBottom: '2px', margin: 0 }}>
                  🛑 Perdas & Riscos por Validade do Estoque
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#4b5563', margin: 0, marginTop: '2px' }}>
                  Mapeia produtos com validade vencida ou prestes a vencer.
                </p>
              </div>
              <div style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 700 }}>Perda em Vencidos</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#dc2626' }}>
                  R$ {dadosPerdas.totalVencidosValor.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>

            {/* RESUMO CARD DE PERDAS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 800 }}>❌ Já Vencidos</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
                  R$ {dadosPerdas.totalVencidosValor.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#4b5563', fontWeight: 600 }}>{dadosPerdas.totalVencidosQtd} un</div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 800 }}>⚠️ Até 7 dias</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>
                  R$ {dadosPerdas.totalAVencer7DiasValor.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#4b5563', fontWeight: 600 }}>{dadosPerdas.totalAVencer7DiasQtd} un</div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 800 }}>📅 Até 30 dias</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>
                  R$ {dadosPerdas.totalAVencer30DiasValor.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#4b5563', fontWeight: 600 }}>{dadosPerdas.totalAVencer30DiasQtd} un</div>
              </div>
            </div>

            {/* GRÁFICO RECHARTS DE RISCO DE PERDA */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '260px', minWidth: 0 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', marginBottom: '10px', margin: 0 }}>
                Distribuição Financeira de Perdas e Vencimentos (R$)
              </h4>
              <div style={{ width: '100%', height: 240, minHeight: 240, minWidth: 0 }}>
                <ResponsiveContainer key={`perdas-${chartKey}`} width="100%" height={240} minWidth={100} minHeight={240}>
                  <BarChart data={dadosPerdas.graficoRisco} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#6b7280" fontSize={10} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={4} />
                    <YAxis stroke="#6b7280" fontSize={10} width={46} tickLine={false} tickFormatter={formatarValorYAxis} tick={{ fontSize: 10, fill: '#6b7280' }} />
                    <Tooltip
                      formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Valor em Risco']}
                      cursor={{ fill: 'rgba(148, 163, 184, 0.18)' }}
                      contentStyle={{
                        background: '#ffffff',
                        color: '#0f172a',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
                        fontSize: '0.8rem',
                        padding: '8px 12px',
                      }}
                      labelStyle={{ color: '#0f172a', fontWeight: 800 }}
                      itemStyle={{ color: '#0f172a', fontWeight: 700 }}
                    />
                    <Bar dataKey="valorR$" radius={[4, 4, 0, 0]} name="Valor em R$ (Perda / Risco)">
                      {dadosPerdas.graficoRisco.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.label.includes('Vencido') ? '#dc2626' : entry.label.toLowerCase().includes('7 dias') ? '#d97706' : '#2563eb'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TABELA DE PRODUTOS CRÍTICOS / VENCIDOS */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', marginBottom: '10px', margin: 0 }}>
                📋 Detalhamento dos Lotes em Risco
              </h4>
              {dadosPerdas.listaVencidos.length === 0 ? (
                <div style={{ color: '#16a34a', fontSize: '0.85rem', padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  🎉 Excelente! Não há lotes vencidos ou a vencer nos próximos 30 dias.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: '460px' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', color: '#334155', textAlign: 'left' }}>
                        <th style={{ padding: '8px 10px', borderRadius: '4px 0 0 0' }}>Status</th>
                        <th style={{ padding: '8px 10px' }}>Produto</th>
                        <th style={{ padding: '8px 10px' }}>Lote</th>
                        <th style={{ padding: '8px 10px' }}>Validade</th>
                        <th style={{ padding: '8px 10px' }}>Qtd</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right', borderRadius: '0 4px 0 0' }}>Perda (R$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosPerdas.listaVencidos.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '8px 10px' }}>
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontWeight: 800,
                                fontSize: '0.7rem',
                                border: '1px solid #e2e8f0',
                                background: item.status === 'Vencido' ? '#dc2626' : '#ffffff',
                                color: item.status === 'Vencido' ? '#ffffff' : '#334155',
                              }}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td style={{ padding: '8px 10px', fontWeight: 700, color: '#111827' }}>{item.nome}</td>
                          <td style={{ padding: '8px 10px', color: '#4b5563' }}>{item.lote || '-'}</td>
                          <td style={{ padding: '8px 10px', fontWeight: 600, color: '#111827' }}>{item.validade}</td>
                          <td style={{ padding: '8px 10px', color: '#111827' }}>{item.qtd} un</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: item.status === 'Vencido' ? '#dc2626' : '#d97706' }}>
                            R$ {item.perdaTotalR$.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA 4: VISÃO GERAL DO ESTOQUE */}
        {abaAtiva === 'estoque_chart' && (
          <div className="aba-conteudo-painel" style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            {/* CARDS RESUMO DO ESTOQUE */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px 14px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Peças em Estoque Físico
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace', marginTop: '3px' }}>
                  {dadosEstoqueGrafico.totalPecasEstoque} un
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px 14px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Valor Venda (Físico)
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d', fontFamily: 'monospace', marginTop: '3px' }}>
                  R$ {dadosEstoqueGrafico.totalValorVendaEstoque.toFixed(2).replace('.', ',')}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px 14px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Custo Total (Físico)
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', marginTop: '3px' }}>
                  R$ {dadosEstoqueGrafico.totalValorCustoEstoque.toFixed(2).replace('.', ',')}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px 14px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Margem Bruta Projetada
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace', marginTop: '3px' }}>
                  R$ {dadosEstoqueGrafico.lucroBrutoProjetado.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>

            {/* CARD MASTER: VENDAS REALIZADAS RETIRANDO O CUSTO */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.3rem' }}>💰</span>
                  <b style={{ fontSize: '0.92rem', color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Vendas Realizadas (Só com o Lucro)
                  </b>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#065F46', background: '#A7F3D0', padding: '2px 8px', borderRadius: '10px', border: '1px solid #6EE7B7' }}>
                    +{totaisFinanceirosVendas.margemLucroReal.toFixed(1)}% margem
                  </span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#047857', marginTop: '3px' }}>
                  Valor total vendido retirando o custo das mercadorias vendidas
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: '#047857', display: 'block', fontWeight: 700 }}>Total Vendido:</span>
                  <b style={{ fontSize: '1rem', color: '#1E40AF', fontFamily: 'monospace', fontWeight: 800 }}>
                    R$ {totaisFinanceirosVendas.valorTotalVendido.toFixed(2).replace('.', ',')}
                  </b>
                </div>
                <div style={{ textAlign: 'right', borderLeft: '1px solid #A7F3D0', paddingLeft: '12px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#DC2626', display: 'block', fontWeight: 700 }}>(-) Custo Retirado:</span>
                  <b style={{ fontSize: '1rem', color: '#DC2626', fontFamily: 'monospace', fontWeight: 800 }}>
                    - R$ {totaisFinanceirosVendas.custoTotalVendido.toFixed(2).replace('.', ',')}
                  </b>
                </div>
                <div style={{ textAlign: 'right', borderLeft: '2px solid #34D399', paddingLeft: '14px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#065F46', fontWeight: 900, display: 'block' }}>
                    (=) Só o Lucro Real:
                  </span>
                  <b style={{ fontSize: '1.45rem', color: '#047857', fontWeight: 900, fontFamily: 'monospace' }}>
                    R$ {totaisFinanceirosVendas.lucroRealFaturado.toFixed(2).replace('.', ',')}
                  </b>
                </div>
              </div>
            </div>

            {/* DESTAQUE DE PRODUTOS DE BALCÃO E ADEGA (ESTOQUE SOB DEMANDA) */}
            {dadosEstoqueGrafico.totalItensBalcao > 0 && (
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '1.4rem', background: '#f8fafc', padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    🍢
                  </div>
                  <div>
                    <b style={{ fontSize: '0.85rem', color: '#111827', display: 'block' }}>
                      Produtos de Balcão & Adega ({dadosEstoqueGrafico.totalItensBalcao} itens com estoque sob demanda)
                    </b>
                    <span style={{ fontSize: '0.74rem', color: '#4b5563' }}>
                      Itens com estoque contínuo/ilimitado contabilizam estritamente pelo valor real vendido no caixa.
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 700, display: 'block' }}>
                      Faturamento Caixa:
                    </span>
                    <b style={{ fontSize: '0.95rem', color: '#111827' }}>
                      R$ {dadosEstoqueGrafico.totalFaturadoBalcao.toFixed(2).replace('.', ',')}
                    </b>
                  </div>
                  <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 700, display: 'block' }}>
                      (-) Custo Balcão:
                    </span>
                    <b style={{ fontSize: '0.92rem', color: '#dc2626' }}>
                      - R$ {dadosEstoqueGrafico.totalCustoBalcao.toFixed(2).replace('.', ',')}
                    </b>
                  </div>
                  <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 700, display: 'block' }}>
                      (=) Só Lucro Balcão:
                    </span>
                    <b style={{ fontSize: '1rem', color: '#16a34a', fontWeight: 900 }}>
                      R$ {dadosEstoqueGrafico.totalLucroBalcao.toFixed(2).replace('.', ',')}
                    </b>
                  </div>
                  <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 700, display: 'block' }}>
                      Vendas:
                    </span>
                    <b style={{ fontSize: '0.92rem', color: '#111827' }}>
                      {dadosEstoqueGrafico.totalQtdVendidaBalcao} un
                    </b>
                  </div>
                </div>
              </div>
            )}

            {/* GRÁFICOS DE ESTOQUE */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {/* TOP 10 MAIOR VALOR FINANCEIRO EM ESTOQUE */}
              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', minWidth: 0 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', marginBottom: '10px', margin: 0 }}>
                  💰 Top 10 Produtos por Valor Total em Estoque Físico (R$)
                </h4>
                <div style={{ width: '100%', height: 260, minHeight: 260, minWidth: 0 }}>
                  <ResponsiveContainer key={`est-val-${chartKey}`} width="100%" height={260} minWidth={100} minHeight={260}>
                    <BarChart layout="vertical" data={dadosEstoqueGrafico.topMaiorValor} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" fontSize={10} tickFormatter={formatarValorYAxis} tick={{ fontSize: 10, fill: '#6b7280' }} />
                      <YAxis dataKey="nome" type="category" width={85} stroke="#6b7280" fontSize={10} tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(n) => truncarTexto(n, 12)} />
                      <Tooltip
                        formatter={(val: any) => [`R$ ${Number(val).toFixed(2)}`, 'Valor em Loja']}
                        cursor={{ fill: 'rgba(148, 163, 184, 0.18)' }}
                        contentStyle={{
                          background: '#ffffff',
                          color: '#0f172a',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
                          fontSize: '0.8rem',
                          padding: '8px 12px',
                        }}
                        labelStyle={{ color: '#0f172a', fontWeight: 800 }}
                        itemStyle={{ color: '#0f172a', fontWeight: 700 }}
                      />
                      <Bar dataKey="valorVendaTotal" fill="#10B981" radius={[0, 4, 4, 0]} name="Valor Venda (R$)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* TOP 10 MAIOR QUANTIDADE DE UNIDADES */}
              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', minWidth: 0 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', marginBottom: '10px', margin: 0 }}>
                  📦 Top 10 Produtos por Quantidade em Estoque Físico
                </h4>
                <div style={{ width: '100%', height: 260, minHeight: 260, minWidth: 0 }}>
                  <ResponsiveContainer key={`est-qtd-${chartKey}`} width="100%" height={260} minWidth={100} minHeight={260}>
                    <BarChart layout="vertical" data={dadosEstoqueGrafico.topMaiorQtd} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" fontSize={10} tick={{ fontSize: 10, fill: '#6b7280' }} />
                      <YAxis dataKey="nome" type="category" width={85} stroke="#6b7280" fontSize={10} tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(n) => truncarTexto(n, 12)} />
                      <Tooltip
                        formatter={(val: any) => [`${val} un`, 'Quantidade']}
                        cursor={{ fill: 'rgba(148, 163, 184, 0.18)' }}
                        contentStyle={{
                          background: '#ffffff',
                          color: '#0f172a',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
                          fontSize: '0.8rem',
                          padding: '8px 12px',
                        }}
                        labelStyle={{ color: '#0f172a', fontWeight: 800 }}
                        itemStyle={{ color: '#0f172a', fontWeight: 700 }}
                      />
                      <Bar dataKey="quantidade" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Unidades" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 5: RANKING DE PRODUTOS MAIS E MENOS VENDIDOS */}
        {abaAtiva === 'ranking' && (() => {
          const opcoesPeriodoRanking: { id: 'hoje' | '7dias' | '30dias' | 'ano' | 'todos'; label: string }[] = [
            { id: 'hoje', label: 'Hoje' },
            { id: '7dias', label: '7 Dias' },
            { id: '30dias', label: '30 Dias' },
            { id: 'ano', label: 'Ano' },
            { id: 'todos', label: 'Tudo' },
          ];

          const formatarReais = (v: number) =>
            `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

          const colunasRanking = [
            {
              chave: 'mais',
              titulo: 'Produtos Mais Vendidos (Top 10)',
              icone: '🔥',
              itens: rankingVendas.maisVendidos,
              totalQtd: rankingVendas.totalQtdMais,
              totalFat: rankingVendas.totalFatMais,
              maxValor: rankingVendas.maxMais,
              bordaCard: '#BBF7D0',
              sombraCard: '0 2px 8px rgba(22, 163, 74, 0.06)',
              headerBg: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
              corTitulo: '#15803D',
              pillBg: '#DCFCE7',
              pillBorder: '#86EFAC',
              pillColor: '#166534',
              rowTopBg: '#F0FDF4',
              rowTopBorder: '#BBF7D0',
              rowRestBg: '#FAFFFC',
              rowRestBorder: '#E2F5EA',
              badgeOutrosBg: '#DCFCE7',
              badgeOutrosColor: '#15803D',
              badgeOutrosBorder: '#86EFAC',
              barraTrilho: '#DCFCE7',
              barraCor: '#10B981',
              corPrincipal: '#15803D',
              corSecundaria: '#166534',
              isPodio: true,
            },
            {
              chave: 'menos',
              titulo: 'Produtos Menos Vendidos (Top 10)',
              icone: '🧊',
              itens: rankingVendas.menosVendidos,
              totalQtd: rankingVendas.totalQtdMenos,
              totalFat: rankingVendas.totalFatMenos,
              maxValor: rankingVendas.maxMenos,
              bordaCard: '#FECACA',
              sombraCard: '0 2px 8px rgba(220, 38, 38, 0.06)',
              headerBg: 'linear-gradient(135deg, #FEF2F2 0%, #FFF1F2 100%)',
              corTitulo: '#DC2626',
              pillBg: '#FEE2E2',
              pillBorder: '#FCA5A5',
              pillColor: '#991B1B',
              rowTopBg: '#FEF2F2',
              rowTopBorder: '#FECACA',
              rowRestBg: '#FFFBFB',
              rowRestBorder: '#FEE2E2',
              badgeOutrosBg: '#FEE2E2',
              badgeOutrosColor: '#B91C1C',
              badgeOutrosBorder: '#FCA5A5',
              barraTrilho: '#FEE2E2',
              barraCor: '#F87171',
              corPrincipal: '#DC2626',
              corSecundaria: '#991B1B',
              isPodio: false,
            },
          ];

          return (
            <div
              className="aba-conteudo-painel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                width: '100%',
                maxWidth: '100%',
                minWidth: 0,
                boxSizing: 'border-box',
              }}
            >
              {/* BARRA SUPERIOR UNIFICADA E COMPACTA */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                  background: '#ffffff',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '0.84rem', color: '#0f172a', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <span>🏆</span> Ranking Top 10
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#475569',
                      background: '#f1f5f9',
                      padding: '2px 7px',
                      borderRadius: '999px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    {rankingVendas.totalProdutosDistintos} itens
                  </span>
                  <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '4px', background: '#f8fafc', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    {opcoesPeriodoRanking.map((p) => {
                      const ativo = periodoRanking === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPeriodoRanking(p.id)}
                          style={{
                            padding: '4px 9px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            background: ativo ? '#0284c7' : 'transparent',
                            color: ativo ? '#ffffff' : '#475569',
                            boxShadow: ativo ? '0 1px 2px rgba(2, 132, 199, 0.25)' : 'none',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'inline-flex', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', background: '#ffffff' }}>
                  <button
                    type="button"
                    onClick={() => setOrdenacaoRanking('unidades')}
                    style={{
                      padding: '5px 10px',
                      border: 'none',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      background: ordenacaoRanking === 'unidades' ? '#0f172a' : '#ffffff',
                      color: ordenacaoRanking === 'unidades' ? '#ffffff' : '#334155',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Qtd (un)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrdenacaoRanking('faturamento')}
                    style={{
                      padding: '5px 10px',
                      border: 'none',
                      borderLeft: '1px solid #cbd5e1',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      background: ordenacaoRanking === 'faturamento' ? '#0f172a' : '#ffffff',
                      color: ordenacaoRanking === 'faturamento' ? '#ffffff' : '#334155',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Faturamento (R$)
                  </button>
                </div>
              </div>

              {/* DUAS COLUNAS LADO A LADO (MAIS VENDIDOS X MENOS VENDIDOS) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
                  gap: '12px',
                  alignItems: 'start',
                }}
              >
                {colunasRanking.map((col) => (
                  <div
                    key={col.chave}
                    style={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      border: `1px solid ${col.bordaCard}`,
                      boxShadow: col.sombraCard,
                      overflow: 'hidden',
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '6px',
                        padding: '9px 12px',
                        background: col.headerBg,
                        borderBottom: `1px solid ${col.bordaCard}`,
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '0.88rem',
                          fontWeight: 900,
                          color: col.corTitulo,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>{col.icone}</span> {col.titulo}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          color: col.pillColor,
                          background: col.pillBg,
                          border: `1px solid ${col.pillBorder}`,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          fontFamily: 'monospace',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {col.totalQtd.toLocaleString('pt-BR')} un • {formatarReais(col.totalFat)}
                      </span>
                    </div>

                    {col.itens.length === 0 ? (
                      <div
                        style={{
                          color: '#64748b',
                          fontSize: '0.8rem',
                          padding: '24px 14px',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span>Nenhum registro de vendas no período selecionado.</span>
                        {periodoRanking !== 'todos' && (
                          <button
                            type="button"
                            onClick={() => setPeriodoRanking('todos')}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              background: '#f8fafc',
                              color: '#0f172a',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Ver Todo Histórico
                          </button>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px 10px' }}>
                        {col.itens.map((prod, index) => {
                          const isTop3 = index < 3;
                          const valorAtual =
                            ordenacaoRanking === 'faturamento' ? prod.totalFaturado : prod.qtdVendida;
                          const pctBarra = Math.max(6, Math.min(100, Math.round((valorAtual / col.maxValor) * 100)));

                          let badgeBg = col.badgeOutrosBg;
                          let badgeColor = col.badgeOutrosColor;
                          let badgeBorder = `1px solid ${col.badgeOutrosBorder}`;

                          if (isTop3) {
                            badgeBorder = 'none';
                            badgeColor = '#ffffff';
                            if (col.isPodio) {
                              badgeBg = index === 0 ? '#F59E0B' : index === 1 ? '#94A3B8' : '#B45309';
                            } else {
                              badgeBg = '#EF4444';
                            }
                          }

                          return (
                            <div
                              key={`${col.chave}_${prod.codigo || 'cod'}_${index}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '5px 8px',
                                background: isTop3 ? col.rowTopBg : col.rowRestBg,
                                border: `1px solid ${isTop3 ? col.rowTopBorder : col.rowRestBorder}`,
                                borderRadius: '8px',
                                gap: '8px',
                                minWidth: 0,
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                                <span
                                  style={{
                                    width: '28px',
                                    height: '24px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '6px',
                                    fontWeight: 900,
                                    fontSize: '0.73rem',
                                    flexShrink: 0,
                                    background: badgeBg,
                                    color: badgeColor,
                                    border: badgeBorder,
                                  }}
                                >
                                  #{index + 1}
                                </span>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div
                                    title={prod.nome}
                                    style={{
                                      fontSize: '0.8rem',
                                      fontWeight: 700,
                                      color: '#0F172A',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    {prod.nome}
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', minWidth: 0 }}>
                                    <div
                                      style={{
                                        width: '54px',
                                        height: '4px',
                                        borderRadius: '999px',
                                        background: col.barraTrilho,
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: `${pctBarra}%`,
                                          height: '100%',
                                          background: col.barraCor,
                                          borderRadius: '999px',
                                        }}
                                      />
                                    </div>
                                    <small
                                      style={{
                                        color: '#64748B',
                                        fontSize: '0.67rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      Cód: {prod.codigo}
                                    </small>
                                  </div>
                                </div>
                              </div>

                              <div style={{ textAlign: 'right', flexShrink: 0, fontFamily: 'monospace', lineHeight: 1.15 }}>
                                <div style={{ fontWeight: 900, color: col.corPrincipal, fontSize: '0.82rem' }}>
                                  {ordenacaoRanking === 'faturamento'
                                    ? formatarReais(prod.totalFaturado)
                                    : `${prod.qtdVendida.toLocaleString('pt-BR')} un`}
                                </div>
                                <div style={{ color: col.corSecundaria, fontSize: '0.68rem', fontWeight: 700 }}>
                                  {ordenacaoRanking === 'faturamento'
                                    ? `${prod.qtdVendida.toLocaleString('pt-BR')} un`
                                    : formatarReais(prod.totalFaturado)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ABA 6: INTELIGÊNCIA DE ESTOQUE E CONSELHOS AO DONO */}
        {abaAtiva === 'inteligencia' && (
          <div className="aba-conteudo-painel" style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            {/* PAINEL INFORMATIVO (COM VIDA E CORES VIBRANTES) */}
            <div style={{ background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', padding: '14px 18px', borderRadius: '12px', border: '1px solid #BAE6FD', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', boxShadow: '0 2px 6px rgba(2, 132, 199, 0.08)' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0369A1', marginBottom: '2px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🧠</span> Inteligência de Estoque (Para o Dono)
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#0C4A6E', margin: 0, marginTop: '2px' }}>
                  Identifica onde investir mais e onde pausar compras para maximizar o lucro.
                </p>
              </div>

              {insightsEstoque.totalCapitalParado > 0 && (
                <div style={{ background: '#FFFFFF', padding: '8px 14px', borderRadius: '8px', border: '1px solid #FECACA', textAlign: 'right', boxShadow: '0 2px 6px rgba(220, 38, 38, 0.08)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#991B1B', fontWeight: 800 }}>Capital em Estoque Parado</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#DC2626', fontFamily: 'monospace' }}>
                    R$ {insightsEstoque.totalCapitalParado.toFixed(2).replace('.', ',')}
                  </div>
                </div>
              )}
            </div>

            {/* SEÇÃO 1: EVITAR COMPRAR MAIS (ESTOQUE PARADO - AMBER/ORANGE VIBRANTE) */}
            <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #FDE68A', boxShadow: '0 4px 8px rgba(217, 119, 6, 0.06)' }}>
              <h3 style={{ fontSize: '0.96rem', fontWeight: 900, color: '#92400E', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <span>🛑</span> Estoque Parado / Pausar Compras
              </h3>
              {insightsEstoque.naoInvestir.length === 0 ? (
                <div style={{ color: '#16A34A', fontSize: '0.82rem', padding: '12px', background: '#F0FDF4', borderRadius: '8px', border: '1px solid #86EFAC', marginTop: '8px' }}>
                  🎉 Excelente! Nenhum produto detectado com excesso de estoque parado sem vendas.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '10px' }}>
                  {insightsEstoque.naoInvestir.map((item, idx) => (
                    <div
                      key={`nao_investir_${item.codigo}_${idx}`}
                      style={{
                        background: '#FFFBEB',
                        border: '1px solid #FDE68A',
                        borderRadius: '8px',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 4px rgba(217, 119, 6, 0.06)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', gap: '6px' }}>
                          <b style={{ fontSize: '0.88rem', color: '#78350F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.nome}</b>
                          <span style={{ fontSize: '0.7rem', background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, border: '1px solid #FCD34D', flexShrink: 0 }}>
                            Cód: {item.codigo}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#92400E', lineHeight: 1.35, margin: '6px 0' }}>
                          {item.motivo}
                        </p>
                      </div>

                      <div
                        style={{
                          marginTop: '6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          color: '#B45309',
                          borderTop: '1px dashed #FCD34D',
                          paddingTop: '6px',
                          fontFamily: 'monospace',
                        }}
                      >
                        <span>📦 Estoque: {item.qtdEstoque} un</span>
                        <span>🛒 Vendas: {item.qtdVendida} un</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEÇÃO 2: PRODUTOS PARA INVESTIR MAIS (EMERALD/GREEN VIBRANTE) */}
            <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #86EFAC', boxShadow: '0 4px 8px rgba(22, 163, 74, 0.06)' }}>
              <h3 style={{ fontSize: '0.96rem', fontWeight: 900, color: '#15803D', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <span>🚀</span> Produtos para Reposição Urgente (Alto Giro)
              </h3>
              {insightsEstoque.investirMais.length === 0 ? (
                <div style={{ color: '#4B5563', fontSize: '0.82rem', padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '8px' }}>
                  Nenhum alerta de reposição urgente no momento.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '10px' }}>
                  {insightsEstoque.investirMais.map((item, idx) => (
                    <div
                      key={`investir_${item.codigo}_${idx}`}
                      style={{
                        background: '#F0FDF4',
                        border: '1px solid #86EFAC',
                        borderRadius: '8px',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 4px rgba(22, 163, 74, 0.06)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', gap: '6px' }}>
                          <b style={{ fontSize: '0.88rem', color: '#14532D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.nome}</b>
                          <span style={{ fontSize: '0.7rem', background: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, border: '1px solid #86EFAC', flexShrink: 0 }}>
                            Cód: {item.codigo}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#166534', lineHeight: 1.35, margin: '6px 0' }}>
                          {item.motivo}
                        </p>
                      </div>

                      <div
                        style={{
                          marginTop: '6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          color: '#15803D',
                          borderTop: '1px dashed #BBF7D0',
                          paddingTop: '6px',
                          fontFamily: 'monospace',
                        }}
                      >
                        <span>📦 Estoque: {item.qtdEstoque} un</span>
                        <span>🛒 Vendas: {item.qtdVendida} un</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
