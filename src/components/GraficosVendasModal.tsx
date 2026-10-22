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
            padding: '7px 12px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'grafico' ? '#0284c7' : '#f1f5f9',
            color: abaAtiva === 'grafico' ? '#ffffff' : '#475569',
            boxShadow: abaAtiva === 'grafico' ? '0 2px 4px rgba(2, 132, 199, 0.25)' : 'none',
          }}
          onClick={() => setAbaAtiva('grafico')}
        >
          📊 Faturamento & Lucro Real
        </button>

        <button
          style={{
            padding: '7px 12px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'formas_pgto' ? '#16a34a' : '#f1f5f9',
            color: abaAtiva === 'formas_pgto' ? '#ffffff' : '#475569',
            boxShadow: abaAtiva === 'formas_pgto' ? '0 2px 4px rgba(22, 163, 74, 0.25)' : 'none',
          }}
          onClick={() => setAbaAtiva('formas_pgto')}
        >
          💳 Formas de Pagamento
        </button>

        <button
          style={{
            padding: '7px 12px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'devolucoes' ? '#dc2626' : '#f1f5f9',
            color: abaAtiva === 'devolucoes' ? '#ffffff' : '#475569',
            boxShadow: abaAtiva === 'devolucoes' ? '0 2px 4px rgba(220, 38, 38, 0.25)' : 'none',
          }}
          onClick={() => setAbaAtiva('devolucoes')}
        >
          🔄 Devoluções & Estornos ({vendasEstornadas.length})
        </button>

        <button
          style={{
            padding: '7px 12px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'perdas' ? '#d97706' : '#f1f5f9',
            color: abaAtiva === 'perdas' ? '#ffffff' : '#475569',
            boxShadow: abaAtiva === 'perdas' ? '0 2px 4px rgba(217, 119, 6, 0.25)' : 'none',
          }}
          onClick={() => setAbaAtiva('perdas')}
        >
          🛑 Perdas & Vencidos
        </button>

        <button
          style={{
            padding: '7px 12px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'estoque_chart' ? '#4f46e5' : '#f1f5f9',
            color: abaAtiva === 'estoque_chart' ? '#ffffff' : '#475569',
            boxShadow: abaAtiva === 'estoque_chart' ? '0 2px 4px rgba(79, 70, 229, 0.25)' : 'none',
          }}
          onClick={() => setAbaAtiva('estoque_chart')}
        >
          📦 Visão Geral do Estoque
        </button>

        <button
          style={{
            padding: '7px 12px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'ranking' ? '#0284c7' : '#f1f5f9',
            color: abaAtiva === 'ranking' ? '#ffffff' : '#475569',
            boxShadow: abaAtiva === 'ranking' ? '0 2px 4px rgba(2, 132, 199, 0.25)' : 'none',
          }}
          onClick={() => setAbaAtiva('ranking')}
        >
          🏆 Ranking de Vendas
        </button>

        <button
          style={{
            padding: '7px 12px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
            flexShrink: 0,
            background: abaAtiva === 'inteligencia' ? '#16a34a' : '#f1f5f9',
            color: abaAtiva === 'inteligencia' ? '#ffffff' : '#475569',
            boxShadow: abaAtiva === 'inteligencia' ? '0 2px 4px rgba(22, 163, 74, 0.25)' : 'none',
          }}
          onClick={() => setAbaAtiva('inteligencia')}
        >
          💡 Inteligência (Dono)
        </button>
      </div>

      {/* CORPO COM ROLAGEM */}
      <div className="corpo-relatorio-cheio" style={{ gap: '14px', display: 'flex', flexDirection: 'column', paddingBottom: '24px', overflowX: 'hidden' }}>
        {/* CARD MASTER EM DESTAQUE: VALOR VENDIDO RETIRANDO O CUSTO (MANTENDO SÓ COM O LUCRO) */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)',
            borderRadius: '12px',
            padding: '14px 16px',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(6, 78, 59, 0.25)',
            border: '1px solid #059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
            <div
              style={{
                fontSize: '2rem',
                background: 'rgba(255, 255, 255, 0.16)',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              💰
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#a7f3d0',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Lucro Real das Vendas (Só o Lucro)
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    color: '#064e3b',
                    background: '#a7f3d0',
                    padding: '1px 6px',
                    borderRadius: '10px',
                  }}
                >
                  +{totaisFinanceirosVendas.margemLucroReal.toFixed(1)}%
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.15, marginTop: '2px' }}>
                R$ {totaisFinanceirosVendas.lucroRealFaturado.toFixed(2).replace('.', ',')}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#d1fae5', marginTop: '2px' }}>
                Valor vendido retirando o valor de custo das mercadorias
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
                minWidth: '95px',
              }}
            >
              <span style={{ fontSize: '0.68rem', color: '#a7f3d0', display: 'block', fontWeight: 700 }}>
                💵 Valor Vendido
              </span>
              <b style={{ fontSize: '0.95rem', color: '#ffffff' }}>
                R$ {totaisFinanceirosVendas.valorTotalVendido.toFixed(2).replace('.', ',')}
              </b>
            </div>

            <div
              style={{
                background: 'rgba(220, 38, 38, 0.3)',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(248, 113, 113, 0.4)',
                textAlign: 'center',
                minWidth: '95px',
              }}
            >
              <span style={{ fontSize: '0.68rem', color: '#fca5a5', display: 'block', fontWeight: 700 }}>
                🏷️ (-) Custo Retirado
              </span>
              <b style={{ fontSize: '0.95rem', color: '#ffffff' }}>
                - R$ {totaisFinanceirosVendas.custoTotalVendido.toFixed(2).replace('.', ',')}
              </b>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
                minWidth: '95px',
              }}
            >
              <span style={{ fontSize: '0.68rem', color: '#a7f3d0', display: 'block', fontWeight: 700 }}>
                📦 Itens Faturados
              </span>
              <b style={{ fontSize: '0.95rem', color: '#ffffff' }}>
                {totaisFinanceirosVendas.totalItensVendidos} un ({totaisFinanceirosVendas.totalVendasQtd} vendas)
              </b>
            </div>
          </div>
        </div>

        {/* ABA 1: GRÁFICOS DE FATURAMENTO & LUCRO */}
        {abaAtiva === 'grafico' && (
          <div className="aba-conteudo-painel" style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            {/* CARDS KPIS DE FATURAMENTO E LUCRO REAL */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
              {/* 1. Quantidade de Vendas & Volume */}
              <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Vendas Concluídas
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  {totaisFinanceirosVendas.totalVendasQtd} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16a34a' }}>vendas</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 600, marginTop: '3px' }}>
                  📦 <b>{totaisFinanceirosVendas.totalItensVendidos}</b> un. faturadas
                </div>
              </div>

              {/* 2. Valor Total Vendido (Receita Bruta) */}
              <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '0.74rem', color: '#0369a1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Receita Bruta (Vendas)
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
                  R$ {totaisFinanceirosVendas.valorTotalVendido.toFixed(2).replace('.', ',')}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px' }}>
                  Total movimentado no caixa
                </div>
              </div>

              {/* 3. Custo das Mercadorias Retirado (CMV) */}
              <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fed7aa', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '0.74rem', color: '#9a3412', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Custo dos Produtos (CMV)
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c2410c', marginTop: '2px' }}>
                  R$ {totaisFinanceirosVendas.custoTotalVendido.toFixed(2).replace('.', ',')}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#7c2d12', marginTop: '3px' }}>
                  Valor retirado para repor estoque
                </div>
              </div>

              {/* 4. VALOR DAS VENDAS SÓ COM O LUCRO (LUCRO REAL) */}
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
                    +{totaisFinanceirosVendas.margemLucroReal.toFixed(1)}%
                  </span>
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#15803d', marginTop: '2px' }}>
                  R$ {totaisFinanceirosVendas.lucroRealFaturado.toFixed(2).replace('.', ',')}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600, marginTop: '3px' }}>
                  Ganho líquido (Vendido - Custo)
                </div>
              </div>
            </div>

            {/* CONTROLES E SELETORES */}
            <div className="painel-filtros-grafico" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div className="grupo-filtro-periodo" style={{ flex: 1, minWidth: '220px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Período:</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', width: '100%' }}>
                    {(['dia', 'semana', 'mes', 'ano'] as const).map((p) => (
                      <button
                        key={p}
                        style={{
                          padding: '7px 4px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          background: periodoGrafico === p ? '#0284c7' : '#ffffff',
                          color: periodoGrafico === p ? '#ffffff' : '#334155',
                        }}
                        onClick={() => setPeriodoGrafico(p)}
                      >
                        {p === 'dia' && 'Por Dia'}
                        {p === 'semana' && 'Por Sem.'}
                        {p === 'mes' && 'Por Mês'}
                        {p === 'ano' && 'Por Ano'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grupo-filtro-vis" style={{ minWidth: '150px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Visualização:</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', width: '100%' }}>
                    <button
                      style={{
                        padding: '7px 8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        background: tipoGrafico === 'area' ? '#e0f2fe' : '#ffffff',
                        color: tipoGrafico === 'area' ? '#0369a1' : '#475569',
                      }}
                      onClick={() => setTipoGrafico('area')}
                    >
                      📈 Área
                    </button>
                    <button
                      style={{
                        padding: '7px 8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        background: tipoGrafico === 'barras' ? '#e0f2fe' : '#ffffff',
                        color: tipoGrafico === 'barras' ? '#0369a1' : '#475569',
                      }}
                      onClick={() => setTipoGrafico('barras')}
                    >
                      📊 Colunas
                    </button>
                  </div>
                </div>
              </div>

              {/* SELETOR DE MÉTRICA: LUCRO REAL VS FATURAMENTO BRUTO */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '4px', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700 }}>Exibir no Gráfico:</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: metricaGrafico === 'lucro_e_faturamento' ? '2px solid #059669' : '1px solid #cbd5e1',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: metricaGrafico === 'lucro_e_faturamento' ? '#f0fdf4' : '#ffffff',
                      color: metricaGrafico === 'lucro_e_faturamento' ? '#15803d' : '#475569',
                    }}
                    onClick={() => setMetricaGrafico('lucro_e_faturamento')}
                  >
                    💰 Lucro Real & Faturamento
                  </button>
                  <button
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: metricaGrafico === 'so_lucro' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: metricaGrafico === 'so_lucro' ? '#16a34a' : '#ffffff',
                      color: metricaGrafico === 'so_lucro' ? '#ffffff' : '#475569',
                    }}
                    onClick={() => setMetricaGrafico('so_lucro')}
                  >
                    💵 Só o Lucro (Vendas - Custo)
                  </button>
                  <button
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: metricaGrafico === 'faturamento' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: metricaGrafico === 'faturamento' ? '#0284c7' : '#ffffff',
                      color: metricaGrafico === 'faturamento' ? '#ffffff' : '#475569',
                    }}
                    onClick={() => setMetricaGrafico('faturamento')}
                  >
                    📊 Só Faturamento Bruto
                  </button>
                </div>
              </div>
            </div>

            {/* CONTAINER DO GRÁFICO PRINCIPAL */}
            <div
              className="card-grafico-container"
              style={{
                background: '#ffffff',
                padding: '14px 10px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                minWidth: 0,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Evolução de Vendas & Lucro Real — Vista por {periodoGrafico.toUpperCase()}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 800, background: '#f0fdf4', padding: '4px 10px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    💰 Só com o Lucro: R$ {totaisFinanceirosVendas.lucroRealFaturado.toFixed(2).replace('.', ',')}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#0284c7', fontWeight: 700, background: '#f0f9ff', padding: '4px 8px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                    Vendido: R$ {totaisFinanceirosVendas.valorTotalVendido.toFixed(2).replace('.', ',')}
                  </div>
                </div>
              </div>

              <div style={{ width: '100%', height: 270, minHeight: 270, minWidth: 0 }}>
                {dadosGraficoFaturamento.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', fontSize: '0.85rem' }}>
                    Nenhum dado registrado para o período selecionado.
                  </div>
                ) : (
                  <ResponsiveContainer key={`fat-${chartKey}-${periodoGrafico}-${tipoGrafico}-${metricaGrafico}`} width="100%" height={270} minWidth={100} minHeight={270}>
                    {tipoGrafico === 'area' ? (
                      <AreaChart data={dadosGraficoFaturamento} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                        <defs>
                          <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0284c7" stopOpacity={0.7} />
                            <stop offset="95%" stopColor="#0284c7" stopOpacity={0.05} />
                          </linearGradient>
                          <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} interval={0} tick={{ fontSize: 10, fill: '#64748b' }} dy={4} />
                        <YAxis stroke="#64748b" fontSize={10} width={46} tickLine={false} tickFormatter={formatarValorYAxis} tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip
                          formatter={(val: any, name: any) => [
                            `R$ ${Number(val).toFixed(2).replace('.', ',')}`,
                            name === 'lucro'
                              ? '💰 Lucro Real (Só o Lucro)'
                              : name === 'faturamento'
                              ? '💵 Valor Total Vendido'
                              : '🏷️ Custo dos Produtos',
                          ]}
                          labelFormatter={(lbl) => `Período: ${lbl}`}
                          contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', padding: '6px 10px' }}
                          wrapperStyle={{ zIndex: 1000 }}
                        />
                        <Legend wrapperStyle={{ fontSize: '0.78rem', paddingTop: '6px' }} />
                        {(metricaGrafico === 'lucro_e_faturamento' || metricaGrafico === 'faturamento') && (
                          <Area
                            type="monotone"
                            dataKey="faturamento"
                            stroke="#0284c7"
                            strokeWidth={2}
                            dot={{ r: 2.5, fill: '#0284c7' }}
                            fillOpacity={1}
                            fill="url(#colorFaturamento)"
                            name="Valor Vendido (R$)"
                          />
                        )}
                        {(metricaGrafico === 'lucro_e_faturamento' || metricaGrafico === 'so_lucro') && (
                          <Area
                            type="monotone"
                            dataKey="lucro"
                            stroke="#15803d"
                            strokeWidth={2.8}
                            dot={{ r: 3.5, fill: '#15803d', stroke: '#ffffff', strokeWidth: 1.5 }}
                            activeDot={{ r: 6 }}
                            fillOpacity={1}
                            fill="url(#colorLucro)"
                            name="Lucro Real (Só o Lucro R$)"
                          />
                        )}
                      </AreaChart>
                    ) : (
                      <BarChart data={dadosGraficoFaturamento} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} interval={0} tick={{ fontSize: 10, fill: '#64748b' }} dy={4} />
                        <YAxis stroke="#64748b" fontSize={10} width={46} tickLine={false} tickFormatter={formatarValorYAxis} tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip
                          formatter={(val: any, name: any) => [
                            `R$ ${Number(val).toFixed(2).replace('.', ',')}`,
                            name === 'lucro'
                              ? '💰 Lucro Real (Só o Lucro)'
                              : name === 'faturamento'
                              ? '💵 Valor Total Vendido'
                              : '🏷️ Custo dos Produtos',
                          ]}
                          labelFormatter={(lbl) => `Período: ${lbl}`}
                          contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', padding: '6px 10px' }}
                          wrapperStyle={{ zIndex: 1000 }}
                        />
                        <Legend wrapperStyle={{ fontSize: '0.78rem', paddingTop: '6px' }} />
                        {(metricaGrafico === 'lucro_e_faturamento' || metricaGrafico === 'faturamento') && (
                          <Bar dataKey="faturamento" fill="#0284c7" radius={[4, 4, 0, 0]} name="Valor Vendido (R$)" />
                        )}
                        {(metricaGrafico === 'lucro_e_faturamento' || metricaGrafico === 'so_lucro') && (
                          <Bar dataKey="lucro" fill="#16a34a" radius={[4, 4, 0, 0]} name="Lucro Real (Só o Lucro R$)" />
                        )}
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ABA: FORMAS DE PAGAMENTO & INTELIGÊNCIA */}
        {abaAtiva === 'formas_pgto' && (
          <div className="aba-conteudo-painel" style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            
            {/* SELETOR DE PERÍODO ESPECÍFICO DE FORMAS DE PAGAMENTO */}
            <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📅</span> Filtrar Período de Pagamento:
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0284c7', background: '#e0f2fe', padding: '3px 8px', borderRadius: '6px' }}>
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
                      padding: '8px 6px',
                      borderRadius: '8px',
                      border: periodoFormaPgto === item.id ? '2px solid #0284c7' : '1px solid #cbd5e1',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      background: periodoFormaPgto === item.id ? '#0284c7' : '#ffffff',
                      color: periodoFormaPgto === item.id ? '#ffffff' : '#475569',
                      transition: 'all 0.15s ease',
                      boxShadow: periodoFormaPgto === item.id ? '0 2px 5px rgba(2,132,199,0.25)' : 'none',
                    }}
                    onClick={() => setPeriodoFormaPgto(item.id as any)}
                  >
                    {item.rotulo}
                  </button>
                ))}
              </div>
            </div>

            {/* BANNER PRINCIPAL COM MÉTRICAS DO PERÍODO */}
            <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '12px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#166534', marginBottom: '2px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>💳</span> Formas de Pagamento & Faturamento ({dadosFormasPagamento.labelPeriodo})
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#15803d', margin: 0, marginTop: '2px' }}>
                  Total de <b>{dadosFormasPagamento.totalQtd} vendas</b> registradas neste período.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '8px', border: '1px solid #86efac', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 600 }}>Total Faturado</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803d' }}>
                    R$ {dadosFormasPagamento.totalGeral.toFixed(2).replace('.', ',')}
                  </div>
                </div>
                <div style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '8px', border: '1px solid #86efac', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 600 }}>Ticket Médio</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7' }}>
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
                    border: `1px solid ${item.cor}33`,
                    borderLeft: `4px solid ${item.cor}`,
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: item.cor }}>{item.nome}</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    R$ {item.valor.toFixed(2).replace('.', ',')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span>{item.qtd} {item.qtd === 1 ? 'venda' : 'vendas'}</span>
                    <span style={{ fontWeight: 700, color: item.cor }}>{item.porcentagem.toFixed(1)}%</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#0284c7', marginTop: '2px', borderTop: '1px dashed #e2e8f0', paddingTop: '3px' }}>
                    Média: <b>R$ {item.ticketMedio.toFixed(2).replace('.', ',')}</b>
                  </div>
                </div>
              ))}
            </div>

            {/* PAINEL DE INTELIGÊNCIA & DIAGNÓSTICO FINANCEIRO */}
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>🧠</span>
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Inteligência & Diagnóstico Financeiro ({dadosFormasPagamento.labelPeriodo})
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                    Análise automática do comportamento de pagamento e liquidez do seu caixa.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {/* INSIGHT 1: MÉTODO CAMPEÃO */}
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', marginBottom: '2px' }}>
                    🏆 Mais Utilizado pelos Clientes
                  </div>
                  {dadosFormasPagamento.insights.lider ? (
                    <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>
                      <b>{dadosFormasPagamento.insights.lider.nome}</b> com{' '}
                      <b style={{ color: '#16a34a' }}>{dadosFormasPagamento.insights.lider.porcentagem.toFixed(1)}%</b> do faturamento total (R$ {dadosFormasPagamento.insights.lider.valor.toFixed(2).replace('.', ',')}).
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Nenhum dado registrado.</div>
                  )}
                </div>

                {/* INSIGHT 2: LIQUIDEZ IMEDIATA */}
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', marginBottom: '2px' }}>
                    ⚡ Liquidez Imediata (PIX + Dinheiro)
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>
                    <b>R$ {dadosFormasPagamento.insights.valorAVista.toFixed(2).replace('.', ',')}</b> ({dadosFormasPagamento.insights.pctAVista.toFixed(1)}% do total).
                    <div style={{ fontSize: '0.72rem', color: '#15803d', marginTop: '2px' }}>
                      Cai direto na conta/gaveta sem taxas de maquininha.
                    </div>
                  </div>
                </div>

                {/* INSIGHT 3: TICKET MÉDIO POR CANAL */}
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', marginBottom: '2px' }}>
                    🎫 Maior Ticket Médio
                  </div>
                  {dadosFormasPagamento.insights.maiorTicket ? (
                    <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>
                      <b>{dadosFormasPagamento.insights.maiorTicket.nome}</b> tem a maior média por venda: <b>R$ {dadosFormasPagamento.insights.maiorTicket.ticketMedio.toFixed(2).replace('.', ',')}</b>.
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Nenhum dado registrado.</div>
                  )}
                </div>

                {/* INSIGHT 4: VENDAS A PRAZO / FIADO */}
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', marginBottom: '2px' }}>
                    📝 Vendas a Prazo / Fiado
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>
                    <b>R$ {dadosFormasPagamento.insights.valorFiado.toFixed(2).replace('.', ',')}</b> ({dadosFormasPagamento.insights.pctFiado.toFixed(1)}% do total).
                    {dadosFormasPagamento.insights.pctFiado > 15 ? (
                      <div style={{ fontSize: '0.72rem', color: '#b91c1c', marginTop: '2px', fontWeight: 600 }}>
                        ⚠️ Atenção: Mais de 15% das vendas foram a prazo. Mantenha as cobranças em dia!
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                        Nível de fiado sob controle no período.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* GRÁFICOS DE FORMAS DE PAGAMENTO */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {/* GRÁFICO DE PIZZA / ROSCA */}
              <div style={{ background: '#ffffff', padding: '14px 10px', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '280px', minWidth: 0 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '10px', margin: 0 }}>
                  🥧 Participação Percentual (%)
                </h4>
                <div style={{ width: '100%', height: 240, minHeight: 240, minWidth: 0 }}>
                  {dadosFormasPagamento.lista.length === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', fontSize: '0.85rem' }}>
                      Nenhuma venda registrada no período ({dadosFormasPagamento.labelPeriodo}).
                    </div>
                  ) : (
                    <ResponsiveContainer key={`fp-pie-${chartKey}-${periodoFormaPgto}`} width="100%" height={240} minWidth={100} minHeight={240}>
                      <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <Pie
                          data={dadosFormasPagamento.lista}
                          dataKey="valor"
                          nameKey="nome"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          innerRadius={35}
                          paddingAngle={3}
                        >
                          {dadosFormasPagamento.lista.map((entry, index) => (
                            <Cell key={`cell-fp-${index}`} fill={entry.cor} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Faturamento']} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '0.74rem', paddingTop: '6px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* GRÁFICO DE BARRAS DE FORMAS DE PGTO */}
              <div style={{ background: '#ffffff', padding: '14px 10px', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '280px', minWidth: 0 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '10px', margin: 0 }}>
                  📊 Volume Financeiro por Método (R$)
                </h4>
                <div style={{ width: '100%', height: 240, minHeight: 240, minWidth: 0 }}>
                  {dadosFormasPagamento.lista.length === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', fontSize: '0.85rem' }}>
                      Nenhuma venda registrada no período ({dadosFormasPagamento.labelPeriodo}).
                    </div>
                  ) : (
                    <ResponsiveContainer key={`fp-bar-${chartKey}-${periodoFormaPgto}`} width="100%" height={240} minWidth={100} minHeight={240}>
                      <BarChart layout="vertical" data={dadosFormasPagamento.lista} margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" stroke="#64748b" fontSize={10} tickFormatter={formatarValorYAxis} tick={{ fontSize: 10, fill: '#64748b' }} />
                        <YAxis dataKey="nome" type="category" width={95} stroke="#64748b" fontSize={10} tick={{ fontSize: 10, fill: '#64748b' }} />
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
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '10px', margin: 0 }}>
                📋 Tabela Detalhada por Meio de Pagamento ({dadosFormasPagamento.labelPeriodo})
              </h4>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: '460px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                      <th style={{ padding: '8px 10px' }}>Método</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Qtd Vendas</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Total (R$)</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Ticket Médio</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Maior Venda</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>% Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosFormasPagamento.lista.map((m) => (
                      <tr key={m.chave} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: '#1e293b' }}>
                          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: m.cor, marginRight: '6px' }}></span>
                          {m.nome}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', color: '#475569' }}>{m.qtd}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                          R$ {m.valor.toFixed(2).replace('.', ',')}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0284c7', fontWeight: 600 }}>
                          R$ {m.ticketMedio.toFixed(2).replace('.', ',')}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>
                          R$ {m.maiorVenda.toFixed(2).replace('.', ',')}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: m.cor }}>
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
            <div style={{ background: '#fef2f2', padding: '14px', borderRadius: '10px', border: '1px solid #fecaca', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#991b1b', marginBottom: '2px', margin: 0 }}>
                  🔄 Devoluções & Vendas Estornadas
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#7f1d1d', margin: 0, marginTop: '2px' }}>
                  Acompanhe os valores devolvidos aos clientes ao longo do tempo.
                </p>
              </div>
              <div style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '8px', border: '1px solid #fca5a5', textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#991b1b', fontWeight: 600 }}>Total Devolvido</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#dc2626' }}>
                  R$ {totalEstornosGeral.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>

            {/* SELEÇÃO DE PERÍODO PARA DEVOLUÇÕES */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Agrupar por:</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', flex: 1 }}>
                {(['dia', 'semana', 'mes', 'ano'] as const).map((p) => (
                  <button
                    key={p}
                    style={{
                      padding: '5px 4px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      background: periodoGrafico === p ? '#dc2626' : '#ffffff',
                      color: periodoGrafico === p ? '#ffffff' : '#334155',
                    }}
                    onClick={() => setPeriodoGrafico(p)}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* GRÁFICO RECHARTS DE DEVOLUÇÕES */}
            <div style={{ background: '#ffffff', padding: '14px 10px', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '280px', minWidth: 0 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#991b1b', marginBottom: '10px', margin: 0 }}>
                Evolução do Valor Estornado (R$) — Por {periodoGrafico.toUpperCase()}
              </h4>
              <div style={{ width: '100%', height: 240, minHeight: 240, minWidth: 0 }}>
                <ResponsiveContainer key={`dev-${chartKey}-${periodoGrafico}`} width="100%" height={240} minWidth={100} minHeight={240}>
                  <BarChart data={dadosGraficoDevolucoes} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} interval={0} tick={{ fontSize: 10, fill: '#64748b' }} dy={4} />
                    <YAxis stroke="#64748b" fontSize={10} width={46} tickLine={false} tickFormatter={formatarValorYAxis} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip
                      formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Valor Estornado']}
                      labelFormatter={(lbl) => `Período: ${lbl}`}
                      contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #fca5a5', fontSize: '0.8rem', padding: '6px 10px' }}
                    />
                    <Bar dataKey="estornado" fill="#ef4444" radius={[4, 4, 0, 0]} name="Valor Estornado (R$)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* LISTA DE DEVOLUÇÕES RECENTES */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '10px', margin: 0 }}>
                📋 Histórico de Transações Estornadas / Canceladas
              </h4>
              {vendasEstornadas.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '0.82rem', padding: '14px', textAlign: 'center' }}>
                  Nenhum estorno ou devolução registrado até o momento.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {vendasEstornadas.map((v) => (
                    <div
                      key={v.id}
                      style={{
                        padding: '8px 10px',
                        background: '#fef2f2',
                        borderRadius: '8px',
                        border: '1px solid #fecaca',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '6px',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#991b1b' }}>
                          Venda #{v.id} — {v.data} {v.hora}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                          Operador: <b>{v.operadorNome}</b> | Motivo: <i>{v.motivoEstorno || 'Não especificado'}</i>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#dc2626' }}>
                          R$ {(v.valorTotal || 0).toFixed(2)}
                        </div>
                        <small style={{ color: '#991b1b', fontWeight: 600, fontSize: '0.7rem' }}>ESTORNADA</small>
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
            <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '10px', border: '1px solid #fde68a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#92400e', marginBottom: '2px', margin: 0 }}>
                  🛑 Perdas & Riscos por Validade do Estoque
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#78350f', margin: 0, marginTop: '2px' }}>
                  Mapeia produtos com validade vencida ou prestes a vencer.
                </p>
              </div>
              <div style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '8px', border: '1px solid #fcd34d', textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#92400e', fontWeight: 600 }}>Perda em Vencidos</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#b45309' }}>
                  R$ {dadosPerdas.totalVencidosValor.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>

            {/* RESUMO CARD DE PERDAS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#991b1b', fontWeight: 700 }}>❌ Já Vencidos</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
                  R$ {dadosPerdas.totalVencidosValor.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#7f1d1d' }}>{dadosPerdas.totalVencidosQtd} un</div>
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#92400e', fontWeight: 700 }}>⚠️ Até 7 dias</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>
                  R$ {dadosPerdas.totalAVencer7DiasValor.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#78350f' }}>{dadosPerdas.totalAVencer7DiasQtd} un</div>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 700 }}>📅 Até 30 dias</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>
                  R$ {dadosPerdas.totalAVencer30DiasValor.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#1e3a8a' }}>{dadosPerdas.totalAVencer30DiasQtd} un</div>
              </div>
            </div>

            {/* GRÁFICO RECHARTS DE RISCO DE PERDA */}
            <div style={{ background: '#ffffff', padding: '14px 10px', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '260px', minWidth: 0 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '10px', margin: 0 }}>
                Distribuição Financeira de Perdas e Vencimentos (R$)
              </h4>
              <div style={{ width: '100%', height: 240, minHeight: 240, minWidth: 0 }}>
                <ResponsiveContainer key={`perdas-${chartKey}`} width="100%" height={240} minWidth={100} minHeight={240}>
                  <BarChart data={dadosPerdas.graficoRisco} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={4} />
                    <YAxis stroke="#64748b" fontSize={10} width={46} tickLine={false} tickFormatter={formatarValorYAxis} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip
                      formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Valor em Risco']}
                      contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', padding: '6px 10px' }}
                    />
                    <Bar dataKey="valorR$" radius={[4, 4, 0, 0]} name="Valor em R$ (Perda / Risco)">
                      {dadosPerdas.graficoRisco.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TABELA DE PRODUTOS CRÍTICOS / PERDAS */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '10px', margin: 0 }}>
                🚨 Produtos Críticos Vencidos ou a Vencer
              </h4>
              {dadosPerdas.listaVencidos.length === 0 ? (
                <div style={{ color: '#16a34a', fontSize: '0.82rem', padding: '14px', textAlign: 'center', background: '#f0fdf4', borderRadius: '8px' }}>
                  🎉 Excelente! Nenhum produto vencido ou com validade próxima no estoque.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', minWidth: '400px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                        <th style={{ padding: '6px 8px' }}>Status</th>
                        <th style={{ padding: '6px 8px' }}>Produto</th>
                        <th style={{ padding: '6px 8px' }}>Lote</th>
                        <th style={{ padding: '6px 8px' }}>Validade</th>
                        <th style={{ padding: '6px 8px' }}>Qtd</th>
                        <th style={{ padding: '6px 8px', textAlign: 'right' }}>Perda (R$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosPerdas.listaVencidos.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '6px 8px' }}>
                            <span
                              style={{
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                background:
                                  item.status === 'Vencido'
                                    ? '#fef2f2'
                                    : item.status === 'Vence em até 7 dias'
                                    ? '#fffbeb'
                                    : '#eff6ff',
                                color:
                                  item.status === 'Vencido'
                                    ? '#dc2626'
                                    : item.status === 'Vence em até 7 dias'
                                    ? '#b45309'
                                    : '#2563eb',
                              }}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td style={{ padding: '6px 8px', fontWeight: 600 }}>{item.nome}</td>
                          <td style={{ padding: '6px 8px', color: '#64748b' }}>{item.lote || '-'}</td>
                          <td style={{ padding: '6px 8px', fontWeight: 600 }}>{item.validade}</td>
                          <td style={{ padding: '6px 8px' }}>{item.qtd} un</td>
                          <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: item.status === 'Vencido' ? '#dc2626' : '#d97706' }}>
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
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>📦 Peças em Estoque Físico</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#3b82f6', marginTop: '2px' }}>
                  {dadosEstoqueGrafico.totalPecasEstoque} un
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>💵 Valor Venda (Físico)</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>
                  R$ {dadosEstoqueGrafico.totalValorVendaEstoque.toFixed(2).replace('.', ',')}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>🏷️ Custo Total (Físico)</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#6366f1', marginTop: '2px' }}>
                  R$ {dadosEstoqueGrafico.totalValorCustoEstoque.toFixed(2).replace('.', ',')}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>✨ Margem Bruta Projetada</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0d9488', marginTop: '2px' }}>
                  R$ {dadosEstoqueGrafico.lucroBrutoProjetado.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>

            {/* CARD MASTER: VENDAS REALIZADAS RETIRANDO O CUSTO (MANTENDO SÓ COM O LUCRO) */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '2px solid #86efac',
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.12)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>💰</span>
                  <b style={{ fontSize: '0.88rem', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Vendas Realizadas (Só com o Lucro)
                  </b>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#15803d', background: '#ffffff', padding: '1px 7px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                    +{totaisFinanceirosVendas.margemLucroReal.toFixed(1)}% margem
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#14532d', marginTop: '3px' }}>
                  Valor total vendido retirando o custo das mercadorias vendidas
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Total Vendido:</span>
                  <b style={{ fontSize: '0.92rem', color: '#0284c7' }}>
                    R$ {totaisFinanceirosVendas.valorTotalVendido.toFixed(2).replace('.', ',')}
                  </b>
                </div>
                <div style={{ textAlign: 'right', borderLeft: '1px solid #bbf7d0', paddingLeft: '10px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontWeight: 600 }}>(-) Custo Retirado:</span>
                  <b style={{ fontSize: '0.92rem', color: '#dc2626' }}>
                    - R$ {totaisFinanceirosVendas.custoTotalVendido.toFixed(2).replace('.', ',')}
                  </b>
                </div>
                <div style={{ textAlign: 'right', borderLeft: '2px solid #86efac', paddingLeft: '12px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 800, display: 'block' }}>
                    (=) Só o Lucro:
                  </span>
                  <b style={{ fontSize: '1.35rem', color: '#15803d', fontWeight: 900 }}>
                    R$ {totaisFinanceirosVendas.lucroRealFaturado.toFixed(2).replace('.', ',')}
                  </b>
                </div>
              </div>
            </div>

            {/* DESTAQUE DE PRODUTOS DE BALCÃO E ADEGA (ESTOQUE SOB DEMANDA) */}
            {dadosEstoqueGrafico.totalItensBalcao > 0 && (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '1.4rem', background: '#eff6ff', padding: '6px 8px', borderRadius: '8px', border: '1px solid #dbeafe' }}>
                    🍢
                  </div>
                  <div>
                    <b style={{ fontSize: '0.85rem', color: '#1e293b', display: 'block' }}>
                      Produtos de Balcão & Adega ({dadosEstoqueGrafico.totalItensBalcao} itens com estoque sob demanda)
                    </b>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
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
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'block' }}>
                      Faturamento Caixa:
                    </span>
                    <b style={{ fontSize: '0.92rem', color: '#0284c7' }}>
                      R$ {dadosEstoqueGrafico.totalFaturadoBalcao.toFixed(2).replace('.', ',')}
                    </b>
                  </div>
                  <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'block' }}>
                      (-) Custo Balcão:
                    </span>
                    <b style={{ fontSize: '0.92rem', color: '#dc2626' }}>
                      - R$ {dadosEstoqueGrafico.totalCustoBalcao.toFixed(2).replace('.', ',')}
                    </b>
                  </div>
                  <div style={{ borderLeft: '2px solid #86efac', paddingLeft: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 800, display: 'block' }}>
                      (=) Só Lucro Balcão:
                    </span>
                    <b style={{ fontSize: '1rem', color: '#15803d', fontWeight: 900 }}>
                      R$ {dadosEstoqueGrafico.totalLucroBalcao.toFixed(2).replace('.', ',')}
                    </b>
                  </div>
                  <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'block' }}>
                      Vendas:
                    </span>
                    <b style={{ fontSize: '0.92rem', color: '#3b82f6' }}>
                      {dadosEstoqueGrafico.totalQtdVendidaBalcao} un
                    </b>
                  </div>
                </div>
              </div>
            )}

            {/* GRÁFICOS DE ESTOQUE */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {/* TOP 10 MAIOR VALOR FINANCEIRO EM ESTOQUE */}
              <div style={{ background: '#ffffff', padding: '14px 10px', borderRadius: '12px', border: '1px solid #e2e8f0', minWidth: 0 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '10px', margin: 0 }}>
                  💰 Top 10 Produtos por Valor Total em Estoque Físico (R$)
                </h4>
                <div style={{ width: '100%', height: 260, minHeight: 260, minWidth: 0 }}>
                  <ResponsiveContainer key={`est-val-${chartKey}`} width="100%" height={260} minWidth={100} minHeight={260}>
                    <BarChart layout="vertical" data={dadosEstoqueGrafico.topMaiorValor} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" stroke="#64748b" fontSize={10} tickFormatter={formatarValorYAxis} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis dataKey="nome" type="category" width={85} stroke="#64748b" fontSize={10} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(n) => truncarTexto(n, 12)} />
                      <Tooltip formatter={(val: any) => [`R$ ${Number(val).toFixed(2)}`, 'Valor em Loja']} />
                      <Bar dataKey="valorVendaTotal" fill="#10b981" radius={[0, 4, 4, 0]} name="Valor Venda (R$)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* TOP 10 MAIOR QUANTIDADE DE UNIDADES */}
              <div style={{ background: '#ffffff', padding: '14px 10px', borderRadius: '12px', border: '1px solid #e2e8f0', minWidth: 0 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '10px', margin: 0 }}>
                  📦 Top 10 Produtos por Quantidade em Estoque Físico
                </h4>
                <div style={{ width: '100%', height: 260, minHeight: 260, minWidth: 0 }}>
                  <ResponsiveContainer key={`est-qtd-${chartKey}`} width="100%" height={260} minWidth={100} minHeight={260}>
                    <BarChart layout="vertical" data={dadosEstoqueGrafico.topMaiorQtd} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" stroke="#64748b" fontSize={10} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis dataKey="nome" type="category" width={85} stroke="#64748b" fontSize={10} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(n) => truncarTexto(n, 12)} />
                      <Tooltip formatter={(val: any) => [`${val} un`, 'Quantidade']} />
                      <Bar dataKey="quantidade" fill="#6366f1" radius={[0, 4, 4, 0]} name="Unidades" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 5: MAIS E MENOS VENDIDOS */}
        {abaAtiva === 'ranking' && (
          <div className="aba-conteudo-painel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            {/* MAIS VENDIDOS */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#16a34a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                🔥 Produtos Mais Vendidos
              </h3>
              {maisVendidos.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '0.82rem', padding: '16px', textAlign: 'center' }}>
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
                        padding: '8px 10px',
                        background: '#f0fdf4',
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                        <span style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.9rem', width: '22px', flexShrink: 0 }}>#{index + 1}</span>
                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                          <b style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prod.nome}</b>
                          <small style={{ color: '#475569', fontSize: '0.72rem' }}>Cód: {prod.codigo}</small>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontWeight: 700, color: '#16a34a', fontSize: '0.85rem' }}>{prod.qtdVendida} un</div>
                        <small style={{ color: '#64748b', fontSize: '0.72rem' }}>R$ {prod.totalFaturado.toFixed(2)}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* MENOS VENDIDOS */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#dc2626', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                🧊 Produtos Menos Vendidos
              </h3>
              {menosVendidos.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '0.82rem', padding: '16px', textAlign: 'center' }}>
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
                        padding: '8px 10px',
                        background: '#fef2f2',
                        borderRadius: '8px',
                        border: '1px solid #fecaca',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                        <span style={{ fontWeight: 800, color: '#dc2626', fontSize: '0.9rem', width: '22px', flexShrink: 0 }}>#{index + 1}</span>
                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                          <b style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prod.nome}</b>
                          <small style={{ color: '#475569', fontSize: '0.72rem' }}>Cód: {prod.codigo}</small>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontWeight: 700, color: '#dc2626', fontSize: '0.85rem' }}>{prod.qtdVendida} un</div>
                        <small style={{ color: '#64748b', fontSize: '0.72rem' }}>R$ {prod.totalFaturado.toFixed(2)}</small>
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
            <div style={{ background: '#f0f9ff', padding: '14px', borderRadius: '10px', border: '1px solid #bae6fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0369a1', marginBottom: '2px', margin: 0 }}>
                  🧠 Inteligência de Estoque (Para o Dono)
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#0c4a6e', margin: 0, marginTop: '2px' }}>
                  Identifica onde investir mais e onde pausar compras.
                </p>
              </div>

              {insightsEstoque.totalCapitalParado > 0 && (
                <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #7dd3fc', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#0369a1', fontWeight: 600 }}>Capital em Estoque Parado</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#b45309' }}>
                    R$ {insightsEstoque.totalCapitalParado.toFixed(2).replace('.', ',')}
                  </div>
                </div>
              )}
            </div>

            {/* SEÇÃO 1: EVITAR COMPRAR MAIS (ESTOQUE PARADO) */}
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#b45309', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                🛑 Estoque Parado / Pausar Compras
              </h3>
              {insightsEstoque.naoInvestir.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '0.82rem', padding: '12px', background: '#f8fafc', borderRadius: '8px', marginTop: '8px' }}>
                  🎉 Excelente! Nenhum produto detectado com excesso de estoque parado sem vendas.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginTop: '10px' }}>
                  {insightsEstoque.naoInvestir.map((item, idx) => (
                    <div
                      key={`nao_investir_${item.codigo}_${idx}`}
                      style={{
                        background: '#fffbeb',
                        border: '1px solid #fde68a',
                        borderRadius: '8px',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', gap: '6px' }}>
                          <b style={{ fontSize: '0.85rem', color: '#78350f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.nome}</b>
                          <span style={{ fontSize: '0.7rem', background: '#fef3c7', color: '#92400e', padding: '1px 5px', borderRadius: '4px', fontWeight: 600, flexShrink: 0 }}>
                            Cód: {item.codigo}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#92400e', lineHeight: 1.35, margin: '4px 0' }}>
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
                          color: '#b45309',
                          borderTop: '1px dashed #fcd34d',
                          paddingTop: '4px',
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
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#15803d', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                🚀 Produtos para Reposição Urgente (Alto Giro)
              </h3>
              {insightsEstoque.investirMais.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '0.82rem', padding: '12px', background: '#f8fafc', borderRadius: '8px', marginTop: '8px' }}>
                  Nenhum alerta de reposição urgente no momento.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginTop: '10px' }}>
                  {insightsEstoque.investirMais.map((item, idx) => (
                    <div
                      key={`investir_${item.codigo}_${idx}`}
                      style={{
                        background: '#f0fdf4',
                        border: '1px solid #86efac',
                        borderRadius: '8px',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', gap: '6px' }}>
                          <b style={{ fontSize: '0.85rem', color: '#14532d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.nome}</b>
                          <span style={{ fontSize: '0.7rem', background: '#dcfce7', color: '#166534', padding: '1px 5px', borderRadius: '4px', fontWeight: 600, flexShrink: 0 }}>
                            Cód: {item.codigo}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#166534', lineHeight: 1.35, margin: '4px 0' }}>
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
                          color: '#15803d',
                          borderTop: '1px dashed #bbf7d0',
                          paddingTop: '4px',
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
