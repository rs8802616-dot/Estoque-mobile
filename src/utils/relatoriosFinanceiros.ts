import { ItemEstoque, ProdutoCatalogo, Venda } from '../types';

export type PeriodoFiltroRelatorio = 'hoje' | '7dias' | '30dias' | 'mes' | 'ano' | 'todos';

export interface MetricasVendaCalculadas {
  valorTotal: number;
  custoTotal: number;
  lucroReal: number;
  margemPercentual: number;
  qtdItens: number;
  itensSemCusto: number;
  estornada: boolean;
}

const MS_POR_DIA = 24 * 60 * 60 * 1000;

function construirDataLocalValidada(
  ano: number,
  mes: number,
  dia: number,
  hora = 0,
  minuto = 0,
  segundo = 0,
  ms = 0
): Date | null {
  if (!Number.isInteger(ano) || !Number.isInteger(mes) || !Number.isInteger(dia)) return null;
  if (ano < 1900 || ano > 2200 || mes < 1 || mes > 12 || dia < 1 || dia > 31) return null;
  const d = new Date(ano, mes - 1, dia, hora, minuto, segundo, ms);
  if (
    Number.isNaN(d.getTime()) ||
    d.getFullYear() !== ano ||
    d.getMonth() !== mes - 1 ||
    d.getDate() !== dia
  ) {
    return null;
  }
  return d;
}

/**
 * Converte Date, timestamp numérico, YYYY-MM-DD, DD/MM/YYYY ou string ISO em Date local validada.
 * Retorna `null` quando a entrada for ausente ou inválida (nunca assume "hoje").
 */
export function parseDataFlexivel(
  valor?: string | number | Date | null,
  fimDoDia = false
): Date | null {
  if (valor === null || valor === undefined || valor === '') return null;

  if (valor instanceof Date) {
    return Number.isNaN(valor.getTime()) ? null : new Date(valor.getTime());
  }

  if (typeof valor === 'number') {
    if (!Number.isFinite(valor) || valor <= 0) return null;
    const d = new Date(valor);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const texto = String(valor).trim();
  if (!texto) return null;

  const h = fimDoDia ? 23 : 0;
  const m = fimDoDia ? 59 : 0;
  const s = fimDoDia ? 59 : 0;
  const ms = fimDoDia ? 999 : 0;

  const matchIsoPuro = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  if (matchIsoPuro) {
    return construirDataLocalValidada(
      Number(matchIsoPuro[1]),
      Number(matchIsoPuro[2]),
      Number(matchIsoPuro[3]),
      h,
      m,
      s,
      ms
    );
  }

  const matchBrPuro = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (matchBrPuro) {
    return construirDataLocalValidada(
      Number(matchBrPuro[3]),
      Number(matchBrPuro[2]),
      Number(matchBrPuro[1]),
      h,
      m,
      s,
      ms
    );
  }

  const matchIsoPrefixo = /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/.exec(texto);
  if (matchIsoPrefixo && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(texto)) {
    return construirDataLocalValidada(
      Number(matchIsoPrefixo[1]),
      Number(matchIsoPrefixo[2]),
      Number(matchIsoPrefixo[3]),
      Number(matchIsoPrefixo[4]),
      Number(matchIsoPrefixo[5]),
      Number(matchIsoPrefixo[6] || 0),
      0
    );
  }

  const d = new Date(texto);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Converte os dados temporais de uma venda (ou pedido com `timestamp`/`data`/`hora`) para Date local.
 * Preserva horários como `00:15` sem substituí-los por 12h e retorna `null` se não houver data válida.
 */
export function parseDataVenda(
  v?: { timestamp?: number; data?: string; hora?: string } | null
): Date | null {
  if (!v) return null;

  if (typeof v.timestamp === 'number' && Number.isFinite(v.timestamp) && v.timestamp > 0) {
    const d = new Date(v.timestamp);
    if (!Number.isNaN(d.getTime())) return d;
  }

  if (typeof v.data === 'string' && v.data.trim()) {
    const dataLimpa = v.data.trim();
    const baseData = parseDataFlexivel(dataLimpa, false);
    if (!baseData) return null;

    if (typeof v.hora === 'string' && v.hora.trim()) {
      const mHora = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(v.hora.trim());
      if (mHora) {
        const hh = Number(mHora[1]);
        const mm = Number(mHora[2]);
        const ss = Number(mHora[3] || 0);
        if (
          Number.isFinite(hh) &&
          Number.isFinite(mm) &&
          Number.isFinite(ss) &&
          hh >= 0 &&
          hh <= 23 &&
          mm >= 0 &&
          mm <= 59 &&
          ss >= 0 &&
          ss <= 59
        ) {
          return new Date(
            baseData.getFullYear(),
            baseData.getMonth(),
            baseData.getDate(),
            hh,
            mm,
            ss,
            0
          );
        }
      }
    }

    // Data pura sem hora explícita: usa meio-dia local para evitar deslocamentos de borda
    if (/^(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})$/.test(dataLimpa)) {
      return new Date(
        baseData.getFullYear(),
        baseData.getMonth(),
        baseData.getDate(),
        12,
        0,
        0,
        0
      );
    }

    return baseData;
  }

  return null;
}

/**
 * Identifica itens sob demanda / internos / de estoque contínuo (balcão, adega, etc.).
 */
export function ehProdutoEstoqueIlimitado(item?: Partial<ItemEstoque> | null): boolean {
  if (!item) return false;
  if (item.estoqueIlimitado === true) return true;
  if (item.tipoCadastro === 'interno') return true;
  const qtd = Number(item.quantidade) || 0;
  if (qtd >= 99000) return true;
  const cat = String(item.categoria || '').toLowerCase();
  if ((cat.includes('balcão') || cat.includes('balcao') || cat.includes('interno')) && qtd >= 9000) {
    return true;
  }
  return false;
}

/**
 * Calcula a diferença exata em dias civis entre a data de validade e a data de referência.
 * `< 0` = já vencido, `0` = vence hoje, `> 0` = dias restantes, `null` = sem validade válida.
 */
export function calcularDiasParaVencer(
  validade?: string | null,
  referencia: Date = new Date()
): number | null {
  const dtVal = parseDataFlexivel(validade, false);
  if (!dtVal) return null;

  const refValida =
    referencia instanceof Date && !Number.isNaN(referencia.getTime()) ? referencia : new Date();

  const utcVal = Date.UTC(dtVal.getFullYear(), dtVal.getMonth(), dtVal.getDate());
  const utcRef = Date.UTC(refValida.getFullYear(), refValida.getMonth(), refValida.getDate());
  return Math.round((utcVal - utcRef) / MS_POR_DIA);
}

/**
 * Constrói índice O(1) de `codigo -> preco_custo (> 0)`, priorizando o estoque local e fallback no catálogo.
 */
export function construirMapaCustoPorCodigo(
  estoque?: ItemEstoque[],
  catalogoGlobal?: ProdutoCatalogo[]
): Map<string, number> {
  const mapa = new Map<string, number>();

  if (Array.isArray(catalogoGlobal)) {
    catalogoGlobal.forEach((c) => {
      const cod = String(c?.codigo || '').trim();
      const custo = Number(c?.preco_custo);
      if (cod && Number.isFinite(custo) && custo > 0 && !mapa.has(cod)) {
        mapa.set(cod, custo);
      }
    });
  }

  if (Array.isArray(estoque)) {
    estoque.forEach((e) => {
      const cod = String(e?.codigo || '').trim();
      const custo = Number(e?.preco_custo);
      if (cod && Number.isFinite(custo) && custo > 0) {
        mapa.set(cod, custo);
      }
    });
  }

  return mapa;
}

/**
 * Obtém o custo unitário real cadastrado para o item (0 se não houver custo cadastrado — sem estimativa fictícia).
 */
export function obterCustoUnitarioItem(
  item?: { codigo?: string; ean?: string; preco_custo?: number } | null,
  mapaCusto?: Map<string, number>
): { custo: number; cadastrado: boolean } {
  if (!item) return { custo: 0, cadastrado: false };

  const custoItem = Number(item.preco_custo);
  if (Number.isFinite(custoItem) && custoItem > 0) {
    return { custo: custoItem, cadastrado: true };
  }

  const cod = String(item.codigo || item.ean || '').trim();
  if (cod && mapaCusto) {
    const custoMapa = mapaCusto.get(cod);
    if (typeof custoMapa === 'number' && Number.isFinite(custoMapa) && custoMapa > 0) {
      return { custo: custoMapa, cadastrado: true };
    }
  }

  return { custo: 0, cadastrado: false };
}

/**
 * Calcula métricas financeiras consistentes de uma venda (receita, CMV real, lucro e margem).
 * Vendas estornadas/canceladas têm custo, lucro e margem zerados.
 */
export function calcularMetricasVenda(
  venda: Venda,
  mapaCusto?: Map<string, number>
): MetricasVendaCalculadas {
  const valorTotal = Number(venda?.valorTotal) || 0;
  const statusStr = String(venda?.status || '').toLowerCase();
  const estornada = statusStr === 'estornada' || statusStr === 'cancelada';

  let qtdItens = 0;
  let custoTotal = 0;
  let itensSemCusto = 0;

  const itens = Array.isArray(venda?.itens) ? venda.itens : [];
  itens.forEach((it) => {
    const q = Number(it?.quantidade) || 0;
    qtdItens += q;
    const { custo, cadastrado } = obterCustoUnitarioItem(it, mapaCusto);
    if (!cadastrado && q > 0) {
      itensSemCusto += 1;
    }
    custoTotal += custo * q;
  });

  if (estornada) {
    return {
      valorTotal,
      custoTotal: 0,
      lucroReal: 0,
      margemPercentual: 0,
      qtdItens,
      itensSemCusto,
      estornada: true,
    };
  }

  const lucroReal = valorTotal - custoTotal;
  const margemPercentual = valorTotal > 0 ? (lucroReal / valorTotal) * 100 : 0;

  return {
    valorTotal,
    custoTotal,
    lucroReal,
    margemPercentual,
    qtdItens,
    itensSemCusto,
    estornada: false,
  };
}

/**
 * Verifica se uma Date pertence ao período selecionado usando limites locais completos (inclusive teto em 'hoje').
 */
export function estaNoPeriodo(
  dt: Date | null,
  periodo: PeriodoFiltroRelatorio,
  referencia: Date = new Date()
): boolean {
  if (periodo === 'todos') return true;
  if (!dt || Number.isNaN(dt.getTime())) return false;

  const ref =
    referencia instanceof Date && !Number.isNaN(referencia.getTime()) ? referencia : new Date();
  const inicioHoje = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate(), 0, 0, 0, 0);
  const fimHoje = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate(), 23, 59, 59, 999);
  const ms = dt.getTime();

  if (periodo === 'hoje') {
    return ms >= inicioHoje.getTime() && ms <= fimHoje.getTime();
  }
  if (periodo === '7dias') {
    const inicio7 = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - 6, 0, 0, 0, 0);
    return ms >= inicio7.getTime() && ms <= fimHoje.getTime();
  }
  if (periodo === '30dias') {
    const inicio30 = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - 29, 0, 0, 0, 0);
    return ms >= inicio30.getTime() && ms <= fimHoje.getTime();
  }
  if (periodo === 'mes') {
    return dt.getFullYear() === ref.getFullYear() && dt.getMonth() === ref.getMonth();
  }
  if (periodo === 'ano') {
    return dt.getFullYear() === ref.getFullYear();
  }
  return true;
}
