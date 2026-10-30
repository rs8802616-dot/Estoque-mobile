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

interface GraficosVendasModalProps {
  visivel: boolean;
  onFechar: () => void;
  vendas: Venda[];
  estoque: ItemEstoque[];
  nomeLoja: string;
  catalogoGlobal?: ProdutoCatalogo[];
}

export const GraficosVendasModal: React.FC<GraficosVendasModalProps> = ({
  visivel,
  onFechar,
  vendas,
  estoque,
  nomeLoja,
  catalogoGlobal = [],
}) => {
  const [periodoGrafico, setPeriodoGrafico] = useState<'dia' | 'semana' | 'mes' | 'ano'>('mes');
  const [periodoFormaPgto, setPeriodoFormaPgto] = useState<
    'hoje' | '7dias' | '30dias' | 'mes' | 'mes_anterior' | 'ano' | 'todos'
  >('mes');
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

  // Helper for safe Date parsing
  const parseDataVenda = (v: Venda): Date => {
    try {
      if (v && v.timestamp && typeof v.timestamp === 'number') {
        const d = new Date(v.timestamp);
        if (!isNaN(d.getTime())) return d;
      }
      if (v && v.data && typeof v.data === 'string') {
        if (v.data.includes('-')) {
          const parts = v.data.split('-');
          if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            let hours = 12;
            let mins = 0;
            if (v.hora && typeof v.hora === 'string' && v.hora.includes(':')) {
              const hParts = v.hora.split(':');
              hours = parseInt(hParts[0], 10) || 12;
              mins = parseInt(hParts[1], 10) || 0;
            }
            const d = new Date(year, month, day, hours, mins, 0);
            if (!isNaN(d.getTime())) return d;
          }
        }
        const dataStr = v.data.includes('T') ? v.data : `${v.data}T12:00:00`;
        const d = new Date(dataStr);
        if (!isNaN(d.getTime())) return d;
      }
    } catch (err) {
      console.error('Erro ao converter data da venda:', err);
    }
    return new Date();
  };

  // 1. Safe arrays of sales
  const vendasValidas = useMemo(() => {
    return Array.isArray(vendas) ? vendas.filter((v) => v && v.status === 'concluida') : [];
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

    const grupos: Record<string, { nome: string; valor: number; qtd: number; cor: string; maiorVenda: number }> = {
      dinheiro: { nome: '💵 Dinheiro', valor: 0, qtd: 0, cor: '#9333ea', maiorVenda: 0 },
      pix: { nome: '📱 PIX', valor: 0, qtd: 0, cor: '#16a34a', maiorVenda: 0 },
      cartao_credito: { nome: '💳 Cartão Crédito', valor: 0, qtd: 0, cor: '#0284c7', maiorVenda: 0 },
      cartao_debito: { nome: '💳 Cartão Débito', valor: 0, qtd: 0, cor: '#d97706', maiorVenda: 0 },
      fiado: { nome: '📝 Fiado (A Prazo)', valor: 0, qtd: 0, cor: '#e11d48', maiorVenda: 0 },
      outros: { nome: 'Outros', valor: 0, qtd: 0, cor: '#64748b', maiorVenda: 0 },
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

  // Helper para obter custo do item vendido
  const obterCustoItem = (it: any): number => {
    if (!it) return 0;
    if (typeof it.preco_custo === 'number' && it.preco_custo > 0) {
      return it.preco_custo;
    }
    const cod = it.codigo || it.ean;
    if (cod && Array.isArray(estoque)) {
      const match = estoque.find((e) => e.codigo === cod && typeof e.preco_custo === 'number' && e.preco_custo > 0);
      if (match && match.preco_custo) return match.preco_custo;
    }
    if (cod && Array.isArray(catalogoGlobal)) {
      const matchCat = catalogoGlobal.find((c) => c.codigo === cod && typeof c.preco_custo === 'number' && c.preco_custo > 0);
      if (matchCat && matchCat.preco_custo) return matchCat.preco_custo;
    }
    const pVenda = Number(it.preco_unitario) || Number(it.preco_venda) || 0;
    return pVenda > 0 ? pVenda * 0.7 : 0;
  };

  // Cálculo de métricas financeiras detalhadas por venda (Receita, Custo e Lucro Real)
  const calcularMetricasVenda = (v: Venda) => {
    const valorVenda = Number(v?.valorTotal) || 0;
    const itens = Array.isArray(v?.itens) ? v.itens : [];
    let custoVenda = 0;
    let qtdItens = 0;

    itens.forEach((it) => {
      const q = Number(it.quantidade) || 0;
      qtdItens += q;
      const c = obterCustoItem(it);
      custoVenda += q * c;
    });

    if (custoVenda === 0 && valorVenda > 0) {
      custoVenda = valorVenda * 0.7;
    }

    const lucroVenda = valorVenda - custoVenda;
    return {
      valorVenda,
      custoVenda,
      lucroVenda,
      qtdItens,
      margem: valorVenda > 0 ? (lucroVenda / valorVenda) * 100 : 0,
    };
  };

  // Totais Gerais de Vendas: Faturamento Bruto, Custo Retirado e Lucro Real Faturado
  const totaisFinanceirosVendas = useMemo(() => {
    let valorTotalVendido = 0;
    let custoTotalVendido = 0;
    let totalItensVendidos = 0;

    vendasValidas.forEach((v) => {
      const m = calcularMetricasVenda(v);
      valorTotalVendido += m.valorVenda;
      custoTotalVendido += m.custoVenda;
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
  }, [vendasValidas, estoque, catalogoGlobal]);

  // 2. Faturamento & Lucro Real Grouping by Period
  const dadosGraficoFaturamento = useMemo(() => {
    try {
      const hoje = new Date();

      if (periodoGrafico === 'dia') {
        const porDia: Record<string, { isoKey: string; label: string; faturamento: number; custo: number; lucro: number; qtdVendas: number; qtdItens: number }> = {};

        for (let i = 9; i >= 0; i--) {
          const d = new Date();
          d.setDate(hoje.getDate() - i);
          const isoKey = d.toISOString().slice(0, 10);
          const parts = isoKey.split('-');
          const label = `${parts[2]}/${parts[1]}`;
          porDia[isoKey] = { isoKey, label, faturamento: 0, custo: 0, lucro: 0, qtdVendas: 0, qtdItens: 0 };
        }

        vendasValidas.forEach((v) => {
          const dt = parseDataVenda(v);
          const isoKey = dt.toISOString().slice(0, 10);
          const m = calcularMetricasVenda(v);

          if (porDia[isoKey]) {
            porDia[isoKey].faturamento += m.valorVenda;
            porDia[isoKey].custo += m.custoVenda;
            porDia[isoKey].lucro += m.lucroVenda;
            porDia[isoKey].qtdVendas += 1;
            porDia[isoKey].qtdItens += m.qtdItens;
          } else {
            const parts = isoKey.split('-');
            const label = `${parts[2]}/${parts[1]}`;
            porDia[isoKey] = { isoKey, label, faturamento: m.valorVenda, custo: m.custoVenda, lucro: m.lucroVenda, qtdVendas: 1, qtdItens: m.qtdItens };
          }
        });

        return Object.values(porDia).sort((a, b) => a.isoKey.localeCompare(b.isoKey));
      }

      if (periodoGrafico === 'semana') {
        const porSemana: Record<string, { label: string; faturamento: number; custo: number; lucro: number; qtdVendas: number; qtdItens: number }> = {
          Semana1: { label: 'Há 3 Semanas', faturamento: 0, custo: 0, lucro: 0, qtdVendas: 0, qtdItens: 0 },
          Semana2: { label: 'Há 2 Semanas', faturamento: 0, custo: 0, lucro: 0, qtdVendas: 0, qtdItens: 0 },
          Semana3: { label: 'Semana Passada', faturamento: 0, custo: 0, lucro: 0, qtdVendas: 0, qtdItens: 0 },
          Semana4: { label: 'Semana Atual', faturamento: 0, custo: 0, lucro: 0, qtdVendas: 0, qtdItens: 0 },
        };

        const agora = hoje.getTime();
        const umDiaMs = 24 * 60 * 60 * 1000;

        vendasValidas.forEach((v) => {
          const dt = parseDataVenda(v);
          const diffDias = Math.floor((agora - dt.getTime()) / umDiaMs);
          const m = calcularMetricasVenda(v);

          let alvo = '';
          if (diffDias >= 0 && diffDias <= 7) {
            alvo = 'Semana4';
          } else if (diffDias > 7 && diffDias <= 14) {
            alvo = 'Semana3';
          } else if (diffDias > 14 && diffDias <= 21) {
            alvo = 'Semana2';
          } else if (diffDias > 21 && diffDias <= 30) {
            alvo = 'Semana1';
          }

          if (alvo && porSemana[alvo]) {
            porSemana[alvo].faturamento += m.valorVenda;
            porSemana[alvo].custo += m.custoVenda;
            porSemana[alvo].lucro += m.lucroVenda;
            porSemana[alvo].qtdVendas += 1;
            porSemana[alvo].qtdItens += m.qtdItens;
          }
        });

        return Object.values(porSemana);
      }

      if (periodoGrafico === 'mes') {
        const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const porMes: Record<number, { index: number; label: string; faturamento: number; custo: number; lucro: number; qtdVendas: number; qtdItens: number }> = {};

        for (let i = 0; i < 12; i++) {
          porMes[i] = { index: i, label: nomesMeses[i], faturamento: 0, custo: 0, lucro: 0, qtdVendas: 0, qtdItens: 0 };
        }

        vendasValidas.forEach((v) => {
          const dt = parseDataVenda(v);
          const mesIndex = dt.getMonth();
          const m = calcularMetricasVenda(v);
          if (porMes[mesIndex]) {
            porMes[mesIndex].faturamento += m.valorVenda;
            porMes[mesIndex].custo += m.custoVenda;
            porMes[mesIndex].lucro += m.lucroVenda;
            porMes[mesIndex].qtdVendas += 1;
            porMes[mesIndex].qtdItens += m.qtdItens;
          }
        });

        return Object.values(porMes).sort((a, b) => a.index - b.index);
      }

      // periodoGrafico === 'ano'
      const porAno: Record<string, { label: string; faturamento: number; custo: number; lucro: number; qtdVendas: number; qtdItens: number }> = {};
      const anoAtual = hoje.getFullYear();

      for (let a = anoAtual - 2; a <= anoAtual; a++) {
        porAno[String(a)] = { label: String(a), faturamento: 0, custo: 0, lucro: 0, qtdVendas: 0, qtdItens: 0 };
      }

      vendasValidas.forEach((v) => {
        const dt = parseDataVenda(v);
        const ano = String(dt.getFullYear());
        const m = calcularMetricasVenda(v);
        if (porAno[ano]) {
          porAno[ano].faturamento += m.valorVenda;
          porAno[ano].custo += m.custoVenda;
          porAno[ano].lucro += m.lucroVenda;
          porAno[ano].qtdVendas += 1;
          porAno[ano].qtdItens += m.qtdItens;
        } else {
          porAno[ano] = { label: ano, faturamento: m.valorVenda, custo: m.custoVenda, lucro: m.lucroVenda, qtdVendas: 1, qtdItens: m.qtdItens };
        }
      });

      return Object.values(porAno).sort((a, b) => a.label.localeCompare(b.label));
    } catch (err) {
      console.error('Erro ao processar faturamento e lucro:', err);
      return [];
    }
  }, [vendasValidas, periodoGrafico, estoque, catalogoGlobal]);

  // 3. Devoluções & Estornos Grouping
  const dadosGraficoDevolucoes = useMemo(() => {
    try {
      const hoje = new Date();

      if (periodoGrafico === 'dia') {
        const porDia: Record<string, { isoKey: string; label: string; estornado: number; qtdEstornos: number }> = {};

        for (let i = 9; i >= 0; i--) {
          const d = new Date();
          d.setDate(hoje.getDate() - i);
          const isoKey = d.toISOString().slice(0, 10);
          const parts = isoKey.split('-');
          const label = `${parts[2]}/${parts[1]}`;
          porDia[isoKey] = { isoKey, label, estornado: 0, qtdEstornos: 0 };
        }

        vendasEstornadas.forEach((v) => {
          const dt = parseDataVenda(v);
          const isoKey = dt.toISOString().slice(0, 10);
          const valor = Number(v.valorTotal) || 0;

          if (porDia[isoKey]) {
            porDia[isoKey].estornado += valor;
            porDia[isoKey].qtdEstornos += 1;
          } else {
            const parts = isoKey.split('-');
            const label = `${parts[2]}/${parts[1]}`;
            porDia[isoKey] = { isoKey, label, estornado: valor, qtdEstornos: 1 };
          }
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

        const agora = hoje.getTime();
        const umDiaMs = 24 * 60 * 60 * 1000;

        vendasEstornadas.forEach((v) => {
          const dt = parseDataVenda(v);
          const diffDias = Math.floor((agora - dt.getTime()) / umDiaMs);
          const valor = Number(v.valorTotal) || 0;

          if (diffDias >= 0 && diffDias <= 7) {
            porSemana['Semana4'].estornado += valor;
            porSemana['Semana4'].qtdEstornos += 1;
          } else if (diffDias > 7 && diffDias <= 14) {
            porSemana['Semana3'].estornado += valor;
            porSemana['Semana3'].qtdEstornos += 1;
          } else if (diffDias > 14 && diffDias <= 21) {
            porSemana['Semana2'].estornado += valor;
            porSemana['Semana2'].qtdEstornos += 1;
          } else if (diffDias > 21 && diffDias <= 30) {
            porSemana['Semana1'].estornado += valor;
            porSemana['Semana1'].qtdEstornos += 1;
          }
        });

        return Object.values(porSemana);
      }

      if (periodoGrafico === 'mes') {
        const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const porMes: Record<number, { index: number; label: string; estornado: number; qtdEstornos: number }> = {};

        for (let i = 0; i < 12; i++) {
          porMes[i] = { index: i, label: nomesMeses[i], estornado: 0, qtdEstornos: 0 };
        }

        vendasEstornadas.forEach((v) => {
          const dt = parseDataVenda(v);
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

  // Helper para identificar produtos de balcão / adega / estoque contínuo sob demanda
  const ehProdutoEstoqueIlimitado = (item: any): boolean => {
    if (!item) return false;
    if (item.estoqueIlimitado === true) return true;
    if (item.tipoCadastro === 'interno') return true;
    const qtd = Number(item.quantidade) || 0;
    if (qtd >= 99990) return true;
    const cat = (item.categoria || '').toLowerCase();
    if ((cat.includes('balcão') || cat.includes('balcao') || cat.includes('interno')) && qtd >= 9000) {
      return true;
    }
    return false;
  };

  // 4. Perdas & Vencidos Analysis
  const dadosPerdas = useMemo(() => {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const hojeIso = hoje.toISOString().slice(0, 10);

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
          if (ehProdutoEstoqueIlimitado(item)) return; // Produtos com estoque sob demanda/balcão não entram em perdas fictícias

          const valStr = item.validade;
          if (!valStr) return;

          const dtVal = new Date(valStr + 'T23:59:59');
          if (isNaN(dtVal.getTime())) return;

          const diffMs = dtVal.getTime() - hoje.getTime();
          const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

          const qtd = Number(item.quantidade) || 0;
          const pVenda = Number(item.preco_venda) || 0;
          const pCusto = Number(item.preco_custo) || pVenda * 0.7;
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
  }, [estoque]);

  // 5. Ranking of Sales (Calculado antes do estoque para correlacionar vendas reais de balcão)
  const { maisVendidos, menosVendidos, resumoItens } = useMemo(() => {
    try {
      const mapaItens: Record<
        string,
        { codigo: string; nome: string; qtdVendida: number; totalFaturado: number; foto?: string }
      > = {};

      vendasValidas.forEach((v) => {
        const itens = Array.isArray(v?.itens) ? v.itens : [];
        itens.forEach((item) => {
          if (!item) return;
          const cod = item.codigo || item.nome || 'SEM_CODIGO';
          if (!mapaItens[cod]) {
            const catItem = catalogoGlobal.find((c) => c.codigo === (item.codigo || cod));
            mapaItens[cod] = {
              codigo: item.codigo || cod,
              nome: item.nome || catItem?.nome || 'Produto sem nome',
              qtdVendida: 0,
              totalFaturado: 0,
              foto: item.foto || catItem?.imagem,
            };
          }
          const qtd = Number(item.quantidade) || 0;
          const subtotal = Number(item.subtotal) || qtd * (Number(item.preco_unitario) || 0) || 0;
          mapaItens[cod].qtdVendida += qtd;
          mapaItens[cod].totalFaturado += subtotal;
        });
      });

      const lista = Object.values(mapaItens);
      const ordenadosMais = [...lista].sort((a, b) => b.qtdVendida - a.qtdVendida);
      const ordenadosMenos = [...lista].sort((a, b) => a.qtdVendida - b.qtdVendida);

      return {
        maisVendidos: ordenadosMais.slice(0, 10),
        menosVendidos: ordenadosMenos.slice(0, 10),
        resumoItens: mapaItens,
      };
    } catch (err) {
      console.error('Erro ao calcular ranking de vendas:', err);
      return { maisVendidos: [], menosVendidos: [], resumoItens: {} };
    }
  }, [vendasValidas, catalogoGlobal]);

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

      if (Array.isArray(estoque)) {
        estoque.forEach((item) => {
          if (!item) return;
          const cod = item.codigo || item.nome || 'SEM_CODIGO';
          const isIlimitado = ehProdutoEstoqueIlimitado(item);

          if (isIlimitado) {
            // PRODUTO DE BALCÃO / ADEGA COM ESTOQUE ILIMITADO / SOB DEMANDA
            totalItensBalcao += 1;
            const vendaInfo = resumoItens[cod];
            if (vendaInfo) {
              const fat = vendaInfo.totalFaturado || 0;
              const qtdV = vendaInfo.qtdVendida || 0;
              totalFaturadoBalcao += fat;
              totalQtdVendidaBalcao += qtdV;
              const pCusto = Number(item.preco_custo) || (Number(item.preco_venda) || 0) * 0.7;
              totalCustoBalcao += qtdV * pCusto;
            }
            return; // NÃO infla o estoque físico com 100.000 unidades fictícias
          }

          // PRODUTO COM ESTOQUE FÍSICO CONTROLADO
          const qtd = Number(item.quantidade) || 0;
          const pVenda = Number(item.preco_venda) || 0;
          const pCusto = Number(item.preco_custo) || pVenda * 0.7;

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
        totalQtdVendidaBalcao: 0,
      };
    }
  }, [estoque, resumoItens]);

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
            const catItem = catalogoGlobal.find((c) => c.codigo === cod);
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
        }

        if (itemEst.qtdTotal <= 5 || (qtdVendida >= 2 && itemEst.qtdTotal <= 10)) {
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
  }, [estoque, resumoItens, catalogoGlobal]);

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
  const [periodoFiltro, setPeriodoFiltro] = useState<'hoje' | '7dias' | '30dias' | 'ano' | 'custom'>('7dias');
  const [tipoVisualizacaoCurva, setTipoVisualizacaoCurva] = useState<'area' | 'barras' | 'linha'>('area');
  const [metricaTop, setMetricaTop] = useState<'faturamento' | 'quantidade'>('faturamento');
  const [filtroCategoriaTop, setFiltroCategoriaTop] = useState<string>('todas');
  const [buscaTabela, setBuscaTabela] = useState<string>('');
  const [hoveredTopIdx, setHoveredTopIdx] = useState<number | null>(null);
  const [copiadoFeedback, setCopiadoFeedback] = useState<boolean>(false);

  // Datas padrão para filtro
  const hojeObj = useMemo(() => new Date(), []);
  const hojeIsoStr = useMemo(() => hojeObj.toISOString().slice(0, 10), [hojeObj]);
  const seteDiasAtrasIsoStr = useMemo(() => {
    const d = new Date(hojeObj);
    d.setDate(d.getDate() - 6);
    return d.toISOString().slice(0, 10);
  }, [hojeObj]);

  const [dataInicioCustom, setDataInicioCustom] = useState<string>(seteDiasAtrasIsoStr);
  const [dataFimCustom, setDataFimCustom] = useState<string>(hojeIsoStr);

  // Intervalo do período ativo
  const { dataInicioObj, dataFimObj, periodoLabel } = useMemo(() => {
    const agora = new Date();
    let inicio = new Date();
    let fim = new Date();
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
    } else {
      const pIni = (dataInicioCustom || '').split('-');
      const pFim = (dataFimCustom || '').split('-');
      if (pIni.length === 3 && pFim.length === 3) {
        inicio = new Date(parseInt(pIni[0]), parseInt(pIni[1]) - 1, parseInt(pIni[2]), 0, 0, 0, 0);
        fim = new Date(parseInt(pFim[0]), parseInt(pFim[1]) - 1, parseInt(pFim[2]), 23, 59, 59, 999);
        label = `${pIni[2]}/${pIni[1]} até ${pFim[2]}/${pFim[1]}`;
      }
    }

    return { dataInicioObj: inicio, dataFimObj: fim, periodoLabel: label };
  }, [periodoFiltro, dataInicioCustom, dataFimCustom]);

  // Vendas do período atual e do período anterior equivalente
  const { vendasPainel, faturamentoTotal, faturamentoAnterior, variacaoPercentual } = useMemo(() => {
    const tIni = dataInicioObj.getTime();
    const tFim = dataFimObj.getTime();
    const duracaoMs = tFim - tIni;
    const tIniAnt = tIni - duracaoMs;
    const tFimAnt = tIni - 1;

    let fatAtual = 0;
    let fatAnt = 0;
    const listaAtual: Venda[] = [];

    vendasValidas.forEach((v) => {
      const dt = parseDataVenda(v);
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
    const est = estoque.find((e) => e.codigo === codigo || (e.nome && e.nome.toLowerCase() === normNome));
    if (est && est.categoria && est.categoria.trim() && est.categoria !== 'Geral') {
      return est.categoria.trim();
    }
    const cat = catalogoGlobal.find((c) => c.codigo === codigo || (c.nome && c.nome.toLowerCase() === normNome));
    if (cat && cat.categoria && cat.categoria.trim() && cat.categoria !== 'Geral') {
      return cat.categoria.trim();
    }
    if (normNome.includes('pizza')) return 'Pizzas';
    if (
      normNome.includes('chopp') ||
      normNome.includes('cerveja') ||
      normNome.includes('refrigerante') ||
      normNome.includes('coca') ||
      normNome.includes('suco') ||
      normNome.includes('vinho') ||
      normNome.includes('whisky') ||
      normNome.includes('bebida') ||
      normNome.includes('água') ||
      normNome.includes('agua') ||
      normNome.includes('long neck')
    ) return 'Bebidas';
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
      normNome.includes('calabresa')
    ) return 'Porções & Entradas';
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
    if (normNome.includes('café') || normNome.includes('cafe') || normNome.includes('expresso') || normNome.includes('cappuccino')) return 'Cafés';
    return 'Geral';
  };

  const mapaCoresCategorias: Record<string, string> = {
    'Pizzas': '#ef4444',
    'Bebidas': '#3b82f6',
    'Porções & Entradas': '#22c55e',
    'Porções': '#22c55e',
    'Sobremesas': '#f97316',
    'Lanches': '#8b5cf6',
    'Cafés': '#78350f',
    'Adega': '#ec4899',
    'Balcão': '#eab308',
    'Geral': '#64748b',
    'Diversos': '#64748b',
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
        const isoDia = cur.toISOString().slice(0, 10);
        const diaNome = diasSemana[cur.getDay()];

        let fat = 0;
        let ped = 0;
        vendasPainel.forEach((v) => {
          const dt = parseDataVenda(v);
          if (dt.toISOString().slice(0, 10) === isoDia) {
            fat += Number(v.valorTotal) || 0;
            ped += 1;
          }
        });
        pontos.push({ label: diaNome, faturamento: fat, pedidos: ped });
      }
      return pontos;
    }

    if (periodoFiltro === 'hoje') {
      const horas = ['10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h'];
      return horas.map((hStr) => {
        const hNum = parseInt(hStr, 10);
        let fat = 0;
        let ped = 0;
        vendasPainel.forEach((v) => {
          const dt = parseDataVenda(v);
          if (dt.getHours() === hNum) {
            fat += Number(v.valorTotal) || 0;
            ped += 1;
          }
        });
        return { label: hStr, faturamento: fat, pedidos: ped };
      });
    }

    if (periodoFiltro === 'ano') {
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return meses.map((mes, idx) => {
        let fat = 0;
        let ped = 0;
        vendasPainel.forEach((v) => {
          const dt = parseDataVenda(v);
          if (dt.getMonth() === idx) {
            fat += Number(v.valorTotal) || 0;
            ped += 1;
          }
        });
        return { label: mes, faturamento: fat, pedidos: ped };
      });
    }

    // 30 dias ou custom
    const mapaDias: Record<string, { label: string; faturamento: number; pedidos: number }> = {};
    const tIni = dataInicioObj.getTime();
    const tFim = dataFimObj.getTime();
    const diaMs = 24 * 60 * 60 * 1000;
    const numDias = Math.min(31, Math.max(1, Math.round((tFim - tIni) / diaMs)));

    for (let i = 0; i < numDias; i++) {
      const d = new Date(tIni + i * diaMs);
      const iso = d.toISOString().slice(0, 10);
      const parts = iso.split('-');
      const label = `${parts[2]}/${parts[1]}`;
      mapaDias[iso] = { label, faturamento: 0, pedidos: 0 };
    }

    vendasPainel.forEach((v) => {
      const dt = parseDataVenda(v);
      const iso = dt.toISOString().slice(0, 10);
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

    const lista = Object.entries(mapa).map(([nome, valor]) => ({
      nome,
      valor,
      porcentagem: totalCat > 0 ? Math.round((valor / totalCat) * 100) : 0,
      cor: mapaCoresCategorias[nome] || '#64748b',
    }));

    lista.sort((a, b) => b.valor - a.valor);
    return lista;
  }, [vendasPainel, estoque, catalogoGlobal]);

  // Horários de Pico Cozinha & Salão
  const dadosHorariosPico = useMemo(() => {
    const faixas = [
      { label: '18h-19h', inicioH: 18, fimH: 19 },
      { label: '19h-20h', inicioH: 19, fimH: 20 },
      { label: '20h-21h', inicioH: 20, fimH: 21 },
      { label: '21h-22h', inicioH: 21, fimH: 22 },
      { label: '22h-23h', inicioH: 22, fimH: 23 },
      { label: '23h+', inicioH: 23, fimH: 24 },
    ];

    const contagem = faixas.map((f) => {
      let pedidos = 0;
      vendasPainel.forEach((v) => {
        const dt = parseDataVenda(v);
        const h = dt.getHours();
        if (f.fimH === 24 ? h >= 23 : h >= f.inicioH && h < f.fimH) {
          pedidos += 1;
        }
      });
      return { faixa: f.label, pedidos };
    });

    const max = Math.max(...contagem.map((c) => c.pedidos), 0);
    const faixaPico = contagem.find((c) => c.pedidos === max && max > 0)?.faixa || '20h - 21h30';

    return { faixas: contagem, maxPedidos: max, faixaPico };
  }, [vendasPainel]);

  // Formas de Pagamento
  const dadosFormasPagamentoPainel = useMemo(() => {
    const formas: Record<string, { label: string; valor: number; qtd: number; cor: string; icone: string }> = {
      pix: { label: 'PIX (Instantâneo)', valor: 0, qtd: 0, cor: '#10b981', icone: '📱' },
      cartao_credito: { label: 'Cartão de Crédito', valor: 0, qtd: 0, cor: '#3b82f6', icone: '💳' },
      cartao_debito: { label: 'Cartão de Débito', valor: 0, qtd: 0, cor: '#f97316', icone: '💳' },
      dinheiro: { label: 'Dinheiro Físico', valor: 0, qtd: 0, cor: '#9ca3af', icone: '💵' },
      outros: { label: 'Outros Meios', valor: 0, qtd: 0, cor: '#64748b', icone: '🔖' },
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
      .filter((f) => f.valor > 0 || totalGeral === 0);

    lista.sort((a, b) => b.valor - a.valor);

    const lider = lista[0] || { label: 'PIX', porcentagem: 0 };

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
  if (!visivel) return null;

  return (
    <div
      ref={modalRef}
      className="tela-relatorio-cheia"
      style={{ display: 'flex', zIndex: 9999 }}
    >
      {/* CABEÇALHO FIXO */}
      <div className="cabecalho-relatorio">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0, fontSize: '0.92rem', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span>📈</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Gráficos & Inteligência ({nomeLoja})</span>
        </h2>
        <button className="btn-voltar-rel" onClick={onFechar} style={{ flexShrink: 0, padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)' }}>
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
          borderBottom: '1px solid #e2e8f0',
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
            borderRadius: '6px',
            border: '1px solid #111827',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'grafico' ? '#111827' : '#ffffff',
            color: abaAtiva === 'grafico' ? '#ffffff' : '#111827',
            boxShadow: 'none',
            transition: 'all 0.15s ease',
          }}
          onClick={() => setAbaAtiva('grafico')}
        >
          📊 Painel de Inteligência & Gráficos
        </button>

        <button
          style={{
            padding: '7px 14px',
            borderRadius: '6px',
            border: '1px solid #111827',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'formas_pgto' ? '#111827' : '#ffffff',
            color: abaAtiva === 'formas_pgto' ? '#ffffff' : '#111827',
            boxShadow: 'none',
            transition: 'all 0.15s ease',
          }}
          onClick={() => setAbaAtiva('formas_pgto')}
        >
          💳 Formas de Pagamento
        </button>

        <button
          style={{
            padding: '7px 14px',
            borderRadius: '6px',
            border: '1px solid #111827',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'devolucoes' ? '#111827' : '#ffffff',
            color: abaAtiva === 'devolucoes' ? '#ffffff' : '#111827',
            boxShadow: 'none',
            transition: 'all 0.15s ease',
          }}
          onClick={() => setAbaAtiva('devolucoes')}
        >
          🔄 Devoluções & Estornos ({vendasEstornadas.length})
        </button>

        <button
          style={{
            padding: '7px 14px',
            borderRadius: '6px',
            border: '1px solid #111827',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'perdas' ? '#111827' : '#ffffff',
            color: abaAtiva === 'perdas' ? '#ffffff' : '#111827',
            boxShadow: 'none',
            transition: 'all 0.15s ease',
          }}
          onClick={() => setAbaAtiva('perdas')}
        >
          🛑 Perdas & Vencidos
        </button>

        <button
          style={{
            padding: '7px 14px',
            borderRadius: '6px',
            border: '1px solid #111827',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'estoque_chart' ? '#111827' : '#ffffff',
            color: abaAtiva === 'estoque_chart' ? '#ffffff' : '#111827',
            boxShadow: 'none',
            transition: 'all 0.15s ease',
          }}
          onClick={() => setAbaAtiva('estoque_chart')}
        >
          📦 Visão Geral do Estoque
        </button>

        <button
          style={{
            padding: '7px 14px',
            borderRadius: '6px',
            border: '1px solid #111827',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'ranking' ? '#111827' : '#ffffff',
            color: abaAtiva === 'ranking' ? '#ffffff' : '#111827',
            boxShadow: 'none',
            transition: 'all 0.15s ease',
          }}
          onClick={() => setAbaAtiva('ranking')}
        >
          🏆 Ranking de Vendas
        </button>

        <button
          style={{
            padding: '7px 14px',
            borderRadius: '6px',
            border: '1px solid #111827',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'inteligencia' ? '#111827' : '#ffffff',
            color: abaAtiva === 'inteligencia' ? '#ffffff' : '#111827',
            boxShadow: 'none',
            transition: 'all 0.15s ease',
          }}
          onClick={() => setAbaAtiva('inteligencia')}
        >
          💡 Inteligência (Dono)
        </button>
      </div>

      {/* CORPO COM ROLAGEM */}
      <div className="corpo-relatorio-cheio" style={{ gap: '14px', display: 'flex', flexDirection: 'column', paddingBottom: '24px', overflowX: 'hidden' }}>
                {/* ABA PRINCIPAL: NOVO PAINEL DE INTELIGÊNCIA & GRÁFICOS (IMAGENS 2, 3, 4 e 5) */}
        {abaAtiva === 'grafico' && (
          <div className="aba-conteudo-painel" style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            
            {/* CONTAINER 1: CABEÇALHO DO PAINEL DE INTELIGÊNCIA COM FILTROS E AÇÕES (IMAGEM 2) */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #111827',
                borderRadius: '8px',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
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
                      background: '#111827',
                      color: '#ffffff',
                      borderRadius: '4px',
                      padding: '2px 5px',
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    📊
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
                    border: '1px solid #111827',
                    borderRadius: '4px',
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
                <div style={{ display: 'inline-flex', border: '1px solid #111827', borderRadius: '4px', overflow: 'hidden' }}>
                  {[
                    { id: 'hoje', label: 'Hoje' },
                    { id: '7dias', label: '7 Dias' },
                    { id: '30dias', label: '30 Dias' },
                    { id: 'ano', label: 'Ano' },
                  ].map((p) => {
                    const ativo = periodoFiltro === p.id;
                    return (
                      <button
                        key={p.id}
                        style={{
                          padding: '5px 12px',
                          border: 'none',
                          borderRight: '1px solid #111827',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: ativo ? '#111827' : '#ffffff',
                          color: ativo ? '#ffffff' : '#111827',
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
                    background: copiadoFeedback ? '#16a34a' : '#111827',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
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

            {/* CONTAINER 2: 4 CARDS KPIS (IMAGEM 2) */}
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
                  background: '#ffffff',
                  border: '1px solid #111827',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    FATURAMENTO TOTAL
                  </span>
                  <span style={{ color: '#10b981', fontWeight: 900, fontSize: '0.95rem' }}>$</span>
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: '6px 0 2px 0' }}>
                  R$ {faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: variacaoPercentual >= 0 ? '#16a34a' : '#dc2626' }}>
                  {variacaoPercentual >= 0 ? '↗ +' : '↘ '}{variacaoPercentual.toFixed(1)}% vs período anterior
                </div>
              </div>

              {/* 2. VOLUME DE PEDIDOS */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #111827',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    VOLUME DE PEDIDOS
                  </span>
                  <span style={{ color: '#3b82f6', fontWeight: 900, fontSize: '0.95rem' }}>📅</span>
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: '6px 0 2px 0' }}>
                  {volumePedidos} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>pedidos</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                  100% comanda eletrônica
                </div>
              </div>

              {/* 3. TICKET MÉDIO */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #111827',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    TICKET MÉDIO
                  </span>
                  <span style={{ color: '#f59e0b', fontWeight: 900, fontSize: '0.95rem' }}>🎖️</span>
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: '6px 0 2px 0' }}>
                  R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>
                  {ticketMedio >= 50 ? 'Meta superada (> R$ 50,00)' : 'Média por comanda'}
                </div>
              </div>

              {/* 4. MAIS VENDIDO */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #111827',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    MAIS VENDIDO
                  </span>
                  <span style={{ color: '#ef4444', fontWeight: 900, fontSize: '0.95rem' }}>✨</span>
                </div>
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: 900,
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
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444' }}>
                  {itemMaisVendido
                    ? `${itemMaisVendido.qtdVendida} un (R$ ${itemMaisVendido.faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
                    : 'Sem vendas'}
                </div>
              </div>
            </div>

            {/* CONTAINER 3: CURVA DE VENDAS POR PERÍODO (IMAGEM 2) */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #111827',
                borderRadius: '8px',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#ef4444' }}>📈</span> CURVA DE VENDAS POR PERÍODO
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                    Faturamento consolidado ({periodoLabel}).
                  </p>
                </div>

                {/* Toggle: Área / Barras / Linha */}
                <div style={{ display: 'inline-flex', border: '1px solid #111827', borderRadius: '4px', overflow: 'hidden' }}>
                  {(['area', 'barras', 'linha'] as const).map((tipo) => {
                    const ativo = tipoVisualizacaoCurva === tipo;
                    const label = tipo === 'area' ? 'Área' : tipo === 'barras' ? 'Barras' : 'Linha';
                    return (
                      <button
                        key={tipo}
                        style={{
                          padding: '4px 12px',
                          border: 'none',
                          borderRight: tipo !== 'linha' ? '1px solid #111827' : 'none',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: ativo ? '#111827' : '#ffffff',
                          color: ativo ? '#ffffff' : '#111827',
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
                        <linearGradient id="corFaturamentoRed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" stroke="#475569" fontSize={11} tickLine={false} />
                      <YAxis
                        stroke="#475569"
                        fontSize={11}
                        tickLine={false}
                        tickFormatter={(val) => `R$ ${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
                      />
                      <Tooltip
                        formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Faturamento']}
                        labelFormatter={(lbl) => `Período: ${lbl}`}
                        contentStyle={{ background: '#111827', color: '#ffffff', borderRadius: '6px', border: 'none', fontSize: '0.8rem' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="faturamento"
                        stroke="#ef4444"
                        strokeWidth={2.8}
                        fillOpacity={1}
                        fill="url(#corFaturamentoRed)"
                        dot={{ r: 3, fill: '#ef4444', strokeWidth: 1, stroke: '#ffffff' }}
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  ) : tipoVisualizacaoCurva === 'barras' ? (
                    <BarChart data={dadosCurvaVendas} margin={{ top: 15, right: 15, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" stroke="#475569" fontSize={11} tickLine={false} />
                      <YAxis
                        stroke="#475569"
                        fontSize={11}
                        tickLine={false}
                        tickFormatter={(val) => `R$ ${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
                      />
                      <Tooltip
                        formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Faturamento']}
                        contentStyle={{ background: '#111827', color: '#ffffff', borderRadius: '6px', border: 'none', fontSize: '0.8rem' }}
                      />
                      <Bar dataKey="faturamento" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={dadosCurvaVendas} margin={{ top: 15, right: 15, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" stroke="#475569" fontSize={11} tickLine={false} />
                      <YAxis
                        stroke="#475569"
                        fontSize={11}
                        tickLine={false}
                        tickFormatter={(val) => `R$ ${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
                      />
                      <Tooltip
                        formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Faturamento']}
                        contentStyle={{ background: '#111827', color: '#ffffff', borderRadius: '6px', border: 'none', fontSize: '0.8rem' }}
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '14px',
              }}
            >
              {/* ESQUERDA: TOP PRODUTOS MAIS VENDIDOS */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #111827',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid #111827', paddingBottom: '10px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 900, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🍴</span> TOP PRODUTOS MAIS VENDIDOS
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                      Classificação por volume de vendas e faturamento gerado.
                    </p>
                  </div>
                  <div style={{ display: 'inline-flex', border: '1px solid #111827', borderRadius: '4px', overflow: 'hidden' }}>
                    <button
                      style={{
                        padding: '4px 10px',
                        border: 'none',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: metricaTop === 'faturamento' ? '#111827' : '#ffffff',
                        color: metricaTop === 'faturamento' ? '#ffffff' : '#111827',
                      }}
                      onClick={() => setMetricaTop('faturamento')}
                    >
                      Faturamento (R$)
                    </button>
                    <button
                      style={{
                        padding: '4px 10px',
                        border: 'none',
                        borderLeft: '1px solid #111827',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: metricaTop === 'quantidade' ? '#111827' : '#ffffff',
                        color: metricaTop === 'quantidade' ? '#ffffff' : '#111827',
                      }}
                      onClick={() => setMetricaTop('quantidade')}
                    >
                      Qtd Vendida (un)
                    </button>
                  </div>
                </div>

                {/* Filtro por Categoria Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginRight: '4px' }}>
                    CATEGORIA:
                  </span>
                  {categoriasDisponiveisTop.map((catNome) => {
                    const ativa = filtroCategoriaTop.toLowerCase() === catNome.toLowerCase();
                    const count = catNome === 'Todas'
                      ? itensAgregados.length
                      : itensAgregados.filter((i) => i.categoria.toLowerCase() === catNome.toLowerCase()).length;
                    return (
                      <button
                        key={catNome}
                        style={{
                          padding: '3px 10px',
                          borderRadius: '16px',
                          border: ativa ? 'none' : '1px solid #cbd5e1',
                          background: ativa ? '#dc2626' : '#ffffff',
                          color: ativa ? '#ffffff' : '#334155',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          boxShadow: ativa ? '0 1px 3px rgba(220, 38, 38, 0.3)' : 'none',
                        }}
                        onClick={() => setFiltroCategoriaTop(catNome)}
                      >
                        {catNome} {count > 0 ? `(${count})` : ''}
                      </button>
                    );
                  })}
                </div>

                {/* Barras Horizontais com Tooltip escuro */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px', position: 'relative' }}>
                  {topProdutosFiltrados.map((item, idx) => {
                    const valor = metricaTop === 'faturamento' ? item.faturamentoTotal : item.qtdVendida;
                    const maxValor = topProdutosFiltrados[0]
                      ? (metricaTop === 'faturamento' ? topProdutosFiltrados[0].faturamentoTotal : topProdutosFiltrados[0].qtdVendida)
                      : 1;
                    const pct = maxValor > 0 ? (valor / maxValor) * 100 : 0;
                    const corBarra = mapaCoresCategorias[item.categoria] || '#ef4444';
                    const isHovered = hoveredTopIdx === idx;

                    return (
                      <div
                        key={idx}
                        style={{ display: 'flex', flexDirection: 'column', gap: '3px', position: 'relative' }}
                        onMouseEnter={() => setHoveredTopIdx(idx)}
                        onMouseLeave={() => setHoveredTopIdx(null)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#1e293b' }}>
                          <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                            {item.nome}
                          </span>
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>
                            {metricaTop === 'faturamento'
                              ? `R$ ${item.faturamentoTotal.toFixed(2).replace('.', ',')}`
                              : `${item.qtdVendida} un`}
                          </span>
                        </div>
                        <div style={{ position: 'relative', width: '100%', height: '22px', background: '#f8fafc', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                          <div
                            style={{
                              width: `${Math.max(pct, 2)}%`,
                              height: '100%',
                              background: corBarra,
                              borderRadius: '3px',
                              border: '1px solid rgba(0,0,0,0.15)',
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
                              background: '#18181b',
                              color: '#ffffff',
                              border: '1px solid #3f3f46',
                              borderRadius: '6px',
                              padding: '10px 14px',
                              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                              pointerEvents: 'none',
                              minWidth: '220px',
                            }}
                          >
                            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f59e0b', marginBottom: '6px' }}>
                              {item.nome}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#cbd5e1', margin: '2px 0' }}>
                              <span>Qtd Vendida:</span>
                              <b style={{ color: '#ffffff' }}>{item.qtdVendida} unidades</b>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#cbd5e1', margin: '2px 0' }}>
                              <span>Faturamento:</span>
                              <b style={{ color: '#4ade80' }}>R$ {item.faturamentoTotal.toFixed(2).replace('.', ',')}</b>
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

              {/* DIREITA: VENDAS POR CATEGORIA (DONUT CHART) */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #111827',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ borderBottom: '1px solid #111827', paddingBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 900, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🕒</span> VENDAS POR CATEGORIA
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                    Participação de cada categoria no faturamento total.
                  </p>
                </div>

                {/* Donut Chart com texto central */}
                <div style={{ width: '100%', height: 190, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosCategorias}
                        dataKey="valor"
                        nameKey="nome"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={2}
                      >
                        {dadosCategorias.map((c, i) => (
                          <Cell key={i} fill={c.cor} stroke="#ffffff" strokeWidth={1.5} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: any) => [`R$ ${Number(v).toFixed(2).replace('.', ',')}`, 'Faturamento']}
                        contentStyle={{ background: '#111827', color: '#ffffff', borderRadius: '6px', border: 'none', fontSize: '0.78rem' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.5px' }}>TOTAL MIX</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a' }}>
                      R$ {faturamentoTotal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>

                {/* Lista da Legenda com % e R$ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                  {dadosCategorias.map((cat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', background: cat.cor, borderRadius: '2px', display: 'inline-block' }} />
                        <span style={{ color: '#1e293b', fontWeight: 600 }}>{cat.nome}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', color: '#475569' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{cat.porcentagem}%</span>
                        <span style={{ color: '#64748b' }}>
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

            {/* CONTAINER 5: LINHA DE BAIXO: HORÁRIOS DE PICO E FORMAS DE PAGAMENTO (IMAGEM 4) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '14px',
              }}
            >
              {/* ESQUERDA: HORÁRIOS DE PICO */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #111827',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid #111827', paddingBottom: '10px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 900, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🕒</span> HORÁRIOS DE PICO DA COZINHA & SALÃO
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                      Distribuição de pedidos por faixa horária para planejamento de equipe e pré-preparo de massas.
                    </p>
                  </div>
                  <span
                    style={{
                      background: '#f3e8ff',
                      color: '#6b21a8',
                      border: '1px solid #d8b4fe',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Pico {dadosHorariosPico.faixaPico}
                  </span>
                </div>

                {/* Gráfico de Barras por Faixa Horária */}
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosHorariosPico.faixas} margin={{ top: 20, right: 15, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="faixa" stroke="#475569" fontSize={11} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                      <Tooltip
                        formatter={(val: any) => [`${val} pedidos`, 'Volume de Pedidos']}
                        contentStyle={{
                          background: '#ffffff',
                          color: '#0f172a',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.8rem',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Bar dataKey="pedidos" radius={[2, 2, 0, 0]}>
                        {dadosHorariosPico.faixas.map((entry, index) => {
                          let cor = '#3b82f6';
                          if (entry.pedidos === dadosHorariosPico.maxPedidos && entry.pedidos > 0) {
                            cor = '#dc2626'; // Pico em Vermelho
                          } else if (entry.pedidos >= dadosHorariosPico.maxPedidos * 0.7 && entry.pedidos > 0) {
                            cor = '#f59e0b'; // Alto em Laranja
                          } else if (entry.pedidos === 0) {
                            cor = '#cbd5e1'; // Zero em cinza
                          }
                          return <Cell key={`bar-${index}`} fill={cor} stroke="#111827" strokeWidth={1} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* DIREITA: VENDAS POR FORMA DE PAGAMENTO */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #111827',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid #111827', paddingBottom: '10px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 900, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>💳</span> VENDAS POR FORMA DE PAGAMENTO
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                      Reconciliação dos pagamentos registrados nas comandas e faturamento bruto.
                    </p>
                  </div>
                  <span
                    style={{
                      background: '#dcfce7',
                      color: '#15803d',
                      border: '1px solid #86efac',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {dadosFormasPagamentoPainel.lider.label.split(' ')[0]} Lidera ({dadosFormasPagamentoPainel.lider.porcentagem}%)
                  </span>
                </div>

                {/* Barras de progresso elegantes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
                  {dadosFormasPagamentoPainel.lista.map((forma, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                        <span style={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{forma.icone}</span>
                          <span>{forma.label}</span>
                        </span>
                        <span style={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem' }}>
                          <span style={{ marginRight: '8px' }}>{forma.porcentagem}%</span>
                          <span style={{ color: '#0f172a' }}>
                            R$ {forma.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '2px', border: '1px solid #111827', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${Math.min(100, Math.max(forma.porcentagem, 1))}%`,
                            height: '100%',
                            background: forma.cor,
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  ))}
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
                border: '1px solid #111827',
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
              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#111827', color: '#ffffff', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
                      const bgRank = rank === 1 ? '#f59e0b' : rank === 2 ? '#94a3b8' : rank === 3 ? '#b45309' : '#f1f5f9';
                      const corTextoRank = rank <= 3 ? '#ffffff' : '#475569';
                      const corBordaCat = mapaCoresCategorias[item.categoria] || '#94a3b8';

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
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📅</span> Filtrar Período de Pagamento:
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', background: '#f8fafc', padding: '3px 8px', borderRadius: '6px', border: '1px solid #111827' }}>
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
                      border: '1px solid #111827',
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
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', marginBottom: '2px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>💳</span> Formas de Pagamento & Faturamento ({dadosFormasPagamento.labelPeriodo})
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#4b5563', margin: 0, marginTop: '2px' }}>
                  Total de <b style={{ color: '#111827' }}>{dadosFormasPagamento.totalQtd} vendas</b> registradas neste período.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #111827', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 700 }}>Total Faturado</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>
                    R$ {dadosFormasPagamento.totalGeral.toFixed(2).replace('.', ',')}
                  </div>
                </div>
                <div style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #111827', textAlign: 'right' }}>
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
                    border: '1px solid #111827',
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
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #111827' }}>
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
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #111827' }}>
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
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #111827' }}>
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
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #111827' }}>
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
              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827', minHeight: '280px', minWidth: 0 }}>
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
                        <Tooltip formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Total']} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* GRÁFICO 2: BARRAS DE FATURAMENTO TOTAL */}
              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827', minHeight: '280px', minWidth: 0 }}>
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
                        <Tooltip formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Total']} />
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
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', marginBottom: '10px', margin: 0 }}>
                📋 Tabela Detalhada por Meio de Pagamento ({dadosFormasPagamento.labelPeriodo})
              </h4>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: '460px' }}>
                  <thead>
                    <tr style={{ background: '#111827', color: '#ffffff', textAlign: 'left' }}>
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
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', marginBottom: '2px', margin: 0 }}>
                  🔄 Devoluções & Vendas Estornadas
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#4b5563', margin: 0, marginTop: '2px' }}>
                  Acompanhe os valores devolvidos aos clientes ao longo do tempo.
                </p>
              </div>
              <div style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #111827', textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 700 }}>Total Devolvido</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#dc2626' }}>
                  R$ {totalEstornosGeral.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>

            {/* SELEÇÃO DE PERÍODO PARA DEVOLUÇÕES */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #111827' }}>
              <span style={{ fontSize: '0.8rem', color: '#111827', fontWeight: 800 }}>Agrupar por:</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', flex: 1 }}>
                {(['dia', 'semana', 'mes', 'ano'] as const).map((p) => (
                  <button
                    key={p}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid #111827',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      background: periodoGrafico === p ? '#111827' : '#ffffff',
                      color: periodoGrafico === p ? '#ffffff' : '#111827',
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
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827', minHeight: '280px', minWidth: 0 }}>
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
                      contentStyle={{ background: '#ffffff', borderRadius: '6px', border: '1px solid #111827', fontSize: '0.8rem', padding: '6px 10px', color: '#111827' }}
                    />
                    <Bar dataKey="estornado" fill="#dc2626" radius={[4, 4, 0, 0]} name="Valor Estornado (R$)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* LISTA DE DEVOLUÇÕES RECENTES */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827' }}>
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
                        border: '1px solid #111827',
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
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', marginBottom: '2px', margin: 0 }}>
                  🛑 Perdas & Riscos por Validade do Estoque
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#4b5563', margin: 0, marginTop: '2px' }}>
                  Mapeia produtos com validade vencida ou prestes a vencer.
                </p>
              </div>
              <div style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #111827', textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 700 }}>Perda em Vencidos</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#dc2626' }}>
                  R$ {dadosPerdas.totalVencidosValor.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>

            {/* RESUMO CARD DE PERDAS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #111827', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 800 }}>❌ Já Vencidos</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
                  R$ {dadosPerdas.totalVencidosValor.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#4b5563', fontWeight: 600 }}>{dadosPerdas.totalVencidosQtd} un</div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #111827', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 800 }}>⚠️ Até 7 dias</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>
                  R$ {dadosPerdas.totalAVencer7DiasValor.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#4b5563', fontWeight: 600 }}>{dadosPerdas.totalAVencer7DiasQtd} un</div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #111827', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 800 }}>📅 Até 30 dias</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>
                  R$ {dadosPerdas.totalAVencer30DiasValor.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#4b5563', fontWeight: 600 }}>{dadosPerdas.totalAVencer30DiasQtd} un</div>
              </div>
            </div>

            {/* GRÁFICO RECHARTS DE RISCO DE PERDA */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827', minHeight: '260px', minWidth: 0 }}>
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
                      contentStyle={{ background: '#ffffff', borderRadius: '6px', border: '1px solid #111827', fontSize: '0.8rem', padding: '6px 10px', color: '#111827' }}
                    />
                    <Bar dataKey="valorR$" radius={[4, 4, 0, 0]} name="Valor em R$ (Perda / Risco)">
                      {dadosPerdas.graficoRisco.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.label.includes('Vencido') ? '#dc2626' : entry.label.includes('7 Dias') ? '#d97706' : '#2563eb'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TABELA DE PRODUTOS CRÍTICOS / VENCIDOS */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', marginBottom: '10px', margin: 0 }}>
                📋 Detalhamento dos Lotes em Risco
              </h4>
              {dadosPerdas.listaVencidos.length === 0 ? (
                <div style={{ color: '#16a34a', fontSize: '0.85rem', padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #111827' }}>
                  🎉 Excelente! Não há lotes vencidos ou a vencer nos próximos 30 dias.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: '460px' }}>
                    <thead>
                      <tr style={{ background: '#111827', color: '#ffffff', textAlign: 'left' }}>
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
                                border: '1px solid #111827',
                                background: item.status === 'Vencido' ? '#111827' : '#ffffff',
                                color: item.status === 'Vencido' ? '#ffffff' : '#111827',
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #111827', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 800 }}>📦 Peças em Estoque Físico</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
                  {dadosEstoqueGrafico.totalPecasEstoque} un
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #111827', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 800 }}>💵 Valor Venda (Físico)</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
                  R$ {dadosEstoqueGrafico.totalValorVendaEstoque.toFixed(2).replace('.', ',')}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #111827', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 800 }}>🏷️ Custo Total (Físico)</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
                  R$ {dadosEstoqueGrafico.totalValorCustoEstoque.toFixed(2).replace('.', ',')}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #111827', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 800 }}>✨ Margem Bruta Projetada</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
                  R$ {dadosEstoqueGrafico.lucroBrutoProjetado.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>

            {/* CARD MASTER: VENDAS REALIZADAS RETIRANDO O CUSTO (MANTENDO SÓ COM O LUCRO) */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #111827',
                borderRadius: '8px',
                padding: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>💰</span>
                  <b style={{ fontSize: '0.9rem', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Vendas Realizadas (Só com o Lucro)
                  </b>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#111827', background: '#f8fafc', padding: '2px 8px', borderRadius: '6px', border: '1px solid #111827' }}>
                    +{totaisFinanceirosVendas.margemLucroReal.toFixed(1)}% margem
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '3px' }}>
                  Valor total vendido retirando o custo das mercadorias vendidas
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: '#6b7280', display: 'block', fontWeight: 700 }}>Total Vendido:</span>
                  <b style={{ fontSize: '0.95rem', color: '#111827' }}>
                    R$ {totaisFinanceirosVendas.valorTotalVendido.toFixed(2).replace('.', ',')}
                  </b>
                </div>
                <div style={{ textAlign: 'right', borderLeft: '1px solid #111827', paddingLeft: '10px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#6b7280', display: 'block', fontWeight: 700 }}>(-) Custo Retirado:</span>
                  <b style={{ fontSize: '0.95rem', color: '#dc2626' }}>
                    - R$ {totaisFinanceirosVendas.custoTotalVendido.toFixed(2).replace('.', ',')}
                  </b>
                </div>
                <div style={{ textAlign: 'right', borderLeft: '1px solid #111827', paddingLeft: '12px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#111827', fontWeight: 800, display: 'block' }}>
                    (=) Só o Lucro:
                  </span>
                  <b style={{ fontSize: '1.35rem', color: '#16a34a', fontWeight: 900 }}>
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
                  border: '1px solid #111827',
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
                  <div style={{ fontSize: '1.4rem', background: '#f8fafc', padding: '6px 8px', borderRadius: '6px', border: '1px solid #111827' }}>
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
                    border: '1px solid #111827',
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
                  <div style={{ borderLeft: '1px solid #111827', paddingLeft: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 700, display: 'block' }}>
                      (-) Custo Balcão:
                    </span>
                    <b style={{ fontSize: '0.92rem', color: '#dc2626' }}>
                      - R$ {dadosEstoqueGrafico.totalCustoBalcao.toFixed(2).replace('.', ',')}
                    </b>
                  </div>
                  <div style={{ borderLeft: '1px solid #111827', paddingLeft: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 700, display: 'block' }}>
                      (=) Só Lucro Balcão:
                    </span>
                    <b style={{ fontSize: '1rem', color: '#16a34a', fontWeight: 900 }}>
                      R$ {dadosEstoqueGrafico.totalLucroBalcao.toFixed(2).replace('.', ',')}
                    </b>
                  </div>
                  <div style={{ borderLeft: '1px solid #111827', paddingLeft: '8px' }}>
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
              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827', minWidth: 0 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', marginBottom: '10px', margin: 0 }}>
                  💰 Top 10 Produtos por Valor Total em Estoque Físico (R$)
                </h4>
                <div style={{ width: '100%', height: 260, minHeight: 260, minWidth: 0 }}>
                  <ResponsiveContainer key={`est-val-${chartKey}`} width="100%" height={260} minWidth={100} minHeight={260}>
                    <BarChart layout="vertical" data={dadosEstoqueGrafico.topMaiorValor} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" fontSize={10} tickFormatter={formatarValorYAxis} tick={{ fontSize: 10, fill: '#6b7280' }} />
                      <YAxis dataKey="nome" type="category" width={85} stroke="#6b7280" fontSize={10} tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(n) => truncarTexto(n, 12)} />
                      <Tooltip formatter={(val: any) => [`R$ ${Number(val).toFixed(2)}`, 'Valor em Loja']} />
                      <Bar dataKey="valorVendaTotal" fill="#111827" radius={[0, 4, 4, 0]} name="Valor Venda (R$)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* TOP 10 MAIOR QUANTIDADE DE UNIDADES */}
              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827', minWidth: 0 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', marginBottom: '10px', margin: 0 }}>
                  📦 Top 10 Produtos por Quantidade em Estoque Físico
                </h4>
                <div style={{ width: '100%', height: 260, minHeight: 260, minWidth: 0 }}>
                  <ResponsiveContainer key={`est-qtd-${chartKey}`} width="100%" height={260} minWidth={100} minHeight={260}>
                    <BarChart layout="vertical" data={dadosEstoqueGrafico.topMaiorQtd} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" fontSize={10} tick={{ fontSize: 10, fill: '#6b7280' }} />
                      <YAxis dataKey="nome" type="category" width={85} stroke="#6b7280" fontSize={10} tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(n) => truncarTexto(n, 12)} />
                      <Tooltip formatter={(val: any) => [`${val} un`, 'Quantidade']} />
                      <Bar dataKey="quantidade" fill="#4b5563" radius={[0, 4, 4, 0]} name="Unidades" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 5: RANKING DE PRODUTOS MAIS E MENOS VENDIDOS */}
        {abaAtiva === 'ranking' && (
          <div className="aba-conteudo-painel" style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            {/* SELEÇÃO DE PERÍODO PARA O RANKING */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #111827' }}>
              <span style={{ fontSize: '0.8rem', color: '#111827', fontWeight: 800 }}>Período do Ranking:</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', flex: 1 }}>
                {(['dia', 'semana', 'mes', 'ano'] as const).map((p) => (
                  <button
                    key={p}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid #111827',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      background: periodoGrafico === p ? '#111827' : '#ffffff',
                      color: periodoGrafico === p ? '#ffffff' : '#111827',
                      transition: 'all 0.15s ease',
                    }}
                    onClick={() => setPeriodoGrafico(p)}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* MAIS VENDIDOS */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                🔥 Produtos Mais Vendidos
              </h3>
              {maisVendidos.length === 0 ? (
                <div style={{ color: '#6b7280', fontSize: '0.82rem', padding: '16px', textAlign: 'center' }}>
                  Nenhum registro de vendas no período.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  {maisVendidos.map((prod, index) => (
                    <div
                      key={`mais_vendido_${prod.codigo || 'cod'}_${index}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        background: '#ffffff',
                        borderRadius: '6px',
                        border: '1px solid #111827',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                        <span style={{ fontWeight: 800, color: '#ffffff', background: '#111827', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', flexShrink: 0 }}>
                          #{index + 1}
                        </span>
                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                          <b style={{ fontSize: '0.85rem', color: '#111827', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prod.nome}</b>
                          <small style={{ color: '#4b5563', fontSize: '0.72rem' }}>Cód: {prod.codigo}</small>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.88rem' }}>{prod.qtdVendida} un</div>
                        <small style={{ color: '#6b7280', fontSize: '0.72rem', fontWeight: 600 }}>R$ {prod.totalFaturado.toFixed(2)}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* MENOS VENDIDOS */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                🧊 Produtos Menos Vendidos
              </h3>
              {menosVendidos.length === 0 ? (
                <div style={{ color: '#6b7280', fontSize: '0.82rem', padding: '16px', textAlign: 'center' }}>
                  Nenhum registro de vendas no período.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  {menosVendidos.map((prod, index) => (
                    <div
                      key={`menos_vendido_${prod.codigo || 'cod'}_${index}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        background: '#ffffff',
                        borderRadius: '6px',
                        border: '1px solid #111827',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                        <span style={{ fontWeight: 800, color: '#111827', background: '#f1f5f9', border: '1px solid #111827', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', flexShrink: 0 }}>
                          #{index + 1}
                        </span>
                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                          <b style={{ fontSize: '0.85rem', color: '#111827', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prod.nome}</b>
                          <small style={{ color: '#4b5563', fontSize: '0.72rem' }}>Cód: {prod.codigo}</small>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontWeight: 800, color: '#dc2626', fontSize: '0.88rem' }}>{prod.qtdVendida} un</div>
                        <small style={{ color: '#6b7280', fontSize: '0.72rem', fontWeight: 600 }}>R$ {prod.totalFaturado.toFixed(2)}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA 6: INTELIGÊNCIA DE ESTOQUE E CONSELHOS AO DONO */}
        {abaAtiva === 'inteligencia' && (
          <div className="aba-conteudo-painel" style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            {/* PAINEL INFORMATIVO */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', marginBottom: '2px', margin: 0 }}>
                  🧠 Inteligência de Estoque (Para o Dono)
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#4b5563', margin: 0, marginTop: '2px' }}>
                  Identifica onde investir mais e onde pausar compras.
                </p>
              </div>

              {insightsEstoque.totalCapitalParado > 0 && (
                <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #111827', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 700 }}>Capital em Estoque Parado</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#dc2626' }}>
                    R$ {insightsEstoque.totalCapitalParado.toFixed(2).replace('.', ',')}
                  </div>
                </div>
              )}
            </div>

            {/* SEÇÃO 1: EVITAR COMPRAR MAIS (ESTOQUE PARADO) */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#111827', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                🛑 Estoque Parado / Pausar Compras
              </h3>
              {insightsEstoque.naoInvestir.length === 0 ? (
                <div style={{ color: '#16a34a', fontSize: '0.82rem', padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #111827', marginTop: '8px' }}>
                  🎉 Excelente! Nenhum produto detectado com excesso de estoque parado sem vendas.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginTop: '10px' }}>
                  {insightsEstoque.naoInvestir.map((item, idx) => (
                    <div
                      key={`nao_investir_${item.codigo}_${idx}`}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #111827',
                        borderRadius: '6px',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', gap: '6px' }}>
                          <b style={{ fontSize: '0.85rem', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.nome}</b>
                          <span style={{ fontSize: '0.7rem', background: '#f8fafc', color: '#111827', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, border: '1px solid #111827', flexShrink: 0 }}>
                            Cód: {item.codigo}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#4b5563', lineHeight: 1.35, margin: '4px 0' }}>
                          {item.motivo}
                        </p>
                      </div>

                      <div
                        style={{
                          marginTop: '6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#111827',
                          borderTop: '1px dashed #d1d5db',
                          paddingTop: '6px',
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

            {/* SEÇÃO 2: PRODUTOS PARA INVESTIR MAIS */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #111827' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#111827', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                🚀 Produtos para Reposição Urgente (Alto Giro)
              </h3>
              {insightsEstoque.investirMais.length === 0 ? (
                <div style={{ color: '#4b5563', fontSize: '0.82rem', padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #111827', marginTop: '8px' }}>
                  Nenhum alerta de reposição urgente no momento.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginTop: '10px' }}>
                  {insightsEstoque.investirMais.map((item, idx) => (
                    <div
                      key={`investir_${item.codigo}_${idx}`}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #111827',
                        borderRadius: '6px',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', gap: '6px' }}>
                          <b style={{ fontSize: '0.85rem', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.nome}</b>
                          <span style={{ fontSize: '0.7rem', background: '#f8fafc', color: '#111827', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, border: '1px solid #111827', flexShrink: 0 }}>
                            Cód: {item.codigo}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#4b5563', lineHeight: 1.35, margin: '4px 0' }}>
                          {item.motivo}
                        </p>
                      </div>

                      <div
                        style={{
                          marginTop: '6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#16a34a',
                          borderTop: '1px dashed #d1d5db',
                          paddingTop: '6px',
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
