import { ItemEstoque, ProdutoCatalogo } from '../types';
import { calcularDiasParaVencer, ehProdutoEstoqueIlimitado } from './relatoriosFinanceiros';

export interface ProdutoEstoqueBaixoCalculado {
  codigo: string;
  nome: string;
  marca?: string;
  categoria?: string;
  foto?: string;
  preco_custo?: number;
  preco_venda: number;
  qtdTotal: number;
  lotes: { validade: string; qtd: number; lote: string }[];
  statusEstoque: 'zerado' | 'critico' | 'baixo';
  qtdSugeridaRepor: number;
}

export interface ItemAlertaValidade {
  item: ItemEstoque;
  diasParaVencer: number;
}

export interface ResumoAlertasEstoque {
  produtosEstoqueBaixo: ProdutoEstoqueBaixoCalculado[];
  countZerados: number;
  countCriticos: number;
  countBaixos: number;
  vencidosOuHoje: ItemAlertaValidade[];
  vencendoEmAte10Dias: ItemAlertaValidade[];
  alertasValidade10Dias: ItemAlertaValidade[];
  totalNotificacoes: number;
}

/**
 * Filtra itens físicos com saldo positivo (`quantidade > 0`) vencidos ou a vencer em até `diasMax`.
 * Exclui itens ilimitados/internos e datas ausentes ou inválidas.
 */
export function filtrarAlertasValidadePorDias(
  estoque: ItemEstoque[],
  diasMax: number,
  referencia: Date = new Date()
): ItemAlertaValidade[] {
  if (!Array.isArray(estoque)) return [];

  const resultados: ItemAlertaValidade[] = [];
  estoque.forEach((item) => {
    if (!item || ehProdutoEstoqueIlimitado(item)) return;
    if ((Number(item.quantidade) || 0) <= 0) return;
    const dias = calcularDiasParaVencer(item.validade, referencia);
    if (dias === null) return;
    if (dias <= diasMax) {
      resultados.push({ item, diasParaVencer: dias });
    }
  });

  resultados.sort((a, b) => a.diasParaVencer - b.diasParaVencer);
  return resultados;
}

/**
 * Engine única de alertas usada pelo sino do cabeçalho (`App.tsx`) e por `CentroNotificacoesModal`.
 * - Ignora produtos internos/ilimitados no cálculo de estoque baixo e validade.
 * - Mantém contagens disjuntas entre `vencidosOuHoje` (`dias <= 0`) e `vencendoEmAte10Dias` (`1 <= dias <= 10`).
 */
export function calcularAlertasEstoque(
  estoque: ItemEstoque[],
  limiarEstoqueMinimo: number,
  catalogoGlobal: ProdutoCatalogo[] = [],
  referencia: Date = new Date()
): ResumoAlertasEstoque {
  const limiarSeguro = Math.max(1, Math.floor(Number(limiarEstoqueMinimo) || 1));

  const mapaCatalogo = new Map<string, ProdutoCatalogo>();
  if (Array.isArray(catalogoGlobal)) {
    catalogoGlobal.forEach((c) => {
      const cod = String(c?.codigo || '').trim();
      if (cod && !mapaCatalogo.has(cod)) {
        mapaCatalogo.set(cod, c);
      }
    });
  }

  const agrupados: Record<
    string,
    {
      codigo: string;
      nome: string;
      marca?: string;
      categoria?: string;
      foto?: string;
      preco_custo?: number;
      preco_venda: number;
      qtdTotal: number;
      lotes: { validade: string; qtd: number; lote: string }[];
    }
  > = {};

  if (Array.isArray(estoque)) {
    estoque.forEach((item) => {
      if (!item || ehProdutoEstoqueIlimitado(item)) return;
      const cod = String(item.codigo || item.codigo_barras || '').trim();
      if (!cod) return;

      const catRel = mapaCatalogo.get(cod);
      const qtd = Number(item.quantidade) || 0;

      if (!agrupados[cod]) {
        agrupados[cod] = {
          codigo: cod,
          nome: item.nome || catRel?.nome || 'Produto sem nome',
          marca: catRel?.marca || item.marca || '',
          categoria: catRel?.categoria || item.categoria || '',
          foto: item.foto || catRel?.imagem || '',
          preco_custo: Number(item.preco_custo) || 0,
          preco_venda: Number(item.preco_venda) || 0,
          qtdTotal: 0,
          lotes: [],
        };
      }

      agrupados[cod].qtdTotal += qtd;
      agrupados[cod].lotes.push({
        validade: item.validade || '',
        qtd,
        lote: item.lote || '',
      });

      if (item.foto && !agrupados[cod].foto) {
        agrupados[cod].foto = item.foto;
      }
      if (item.preco_venda) {
        agrupados[cod].preco_venda = Number(item.preco_venda) || 0;
      }
      if (item.preco_custo) {
        agrupados[cod].preco_custo = Number(item.preco_custo) || 0;
      }
    });
  }

  const limiarCritico = Math.max(1, Math.floor(limiarSeguro / 2));
  const produtosEstoqueBaixo: ProdutoEstoqueBaixoCalculado[] = Object.values(agrupados)
    .filter((prod) => prod.qtdTotal <= limiarSeguro)
    .map((prod) => {
      let statusEstoque: 'zerado' | 'critico' | 'baixo' = 'baixo';
      if (prod.qtdTotal <= 0) {
        statusEstoque = 'zerado';
      } else if (prod.qtdTotal <= limiarCritico) {
        statusEstoque = 'critico';
      }

      const qtdSugeridaRepor = Math.max(
        limiarSeguro * 2 - Math.max(0, prod.qtdTotal),
        limiarSeguro
      );

      return {
        ...prod,
        statusEstoque,
        qtdSugeridaRepor,
      };
    })
    .sort((a, b) => a.qtdTotal - b.qtdTotal);

  const countZerados = produtosEstoqueBaixo.filter((p) => p.qtdTotal <= 0).length;
  const countCriticos = produtosEstoqueBaixo.filter((p) => p.statusEstoque === 'critico').length;
  const countBaixos = produtosEstoqueBaixo.filter((p) => p.statusEstoque === 'baixo').length;

  const alertasValidade10Dias = filtrarAlertasValidadePorDias(estoque, 10, referencia);
  const vencidosOuHoje = alertasValidade10Dias.filter((a) => a.diasParaVencer <= 0);
  const vencendoEmAte10Dias = alertasValidade10Dias.filter(
    (a) => a.diasParaVencer > 0 && a.diasParaVencer <= 10
  );

  return {
    produtosEstoqueBaixo,
    countZerados,
    countCriticos,
    countBaixos,
    vencidosOuHoje,
    vencendoEmAte10Dias,
    alertasValidade10Dias,
    totalNotificacoes: alertasValidade10Dias.length + produtosEstoqueBaixo.length,
  };
}
