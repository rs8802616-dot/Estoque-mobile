import { ItemEstoque } from '../types';

export interface ResultadoBalanca {
  isBalanca: boolean;
  codigoProduto?: string;
  precoTotal?: number;
  pesoKg?: number;
  itemEncontrado?: ItemEstoque;
  quantidadeCalculada?: number;
}

/**
 * Localiza de forma inteligente o melhor lote ativo de um produto no estoque:
 * 1. Prioriza lotes com saldo disponível (quantidade > 0 ou estoque ilimitado/interno)
 * 2. Entre os lotes com saldo, prioriza os não vencidos e pelo método FIFO (validade mais próxima primeiro)
 * 3. Se nenhum tiver saldo, retorna o lote cadastrado mais recente.
 */
export function localizarMelhorLoteEstoque(
  codigoOuBarra: string,
  estoque: ItemEstoque[]
): ItemEstoque | undefined {
  if (!codigoOuBarra || !Array.isArray(estoque) || estoque.length === 0) {
    return undefined;
  }

  const codLimpo = codigoOuBarra.trim();
  const codSemZeros = codLimpo.replace(/^0+/, '');

  // 1. Encontra todos os lotes correspondentes
  const correspondentes = estoque.filter((p) => {
    if (!p) return false;
    const codProd = (p.codigo || '').trim();
    const codBarraProd = (p.codigo_barras || '').trim();

    if (codProd === codLimpo || codBarraProd === codLimpo) return true;
    if (codSemZeros) {
      if (codProd.replace(/^0+/, '') === codSemZeros) return true;
      if (codBarraProd && codBarraProd.replace(/^0+/, '') === codSemZeros) return true;
    }
    return false;
  });

  if (correspondentes.length === 0) return undefined;
  if (correspondentes.length === 1) return correspondentes[0];

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // 2. Prioriza lotes com estoque disponível (> 0 ou ilimitado/interno)
  const comEstoque = correspondentes.filter(
    (p) => p.quantidade > 0 || p.estoqueIlimitado || p.tipoCadastro === 'interno'
  );

  if (comEstoque.length > 0) {
    // Ordena por FIFO (data de validade mais próxima mas não vencida primeiro)
    const validos = comEstoque.filter((p) => {
      if (p.tipoCadastro === 'interno' || p.estoqueIlimitado) return true;
      if (!p.validade) return true;
      try {
        const dt = new Date(p.validade + 'T00:00:00');
        return !isNaN(dt.getTime()) && dt.getTime() >= hoje.getTime();
      } catch {
        return true;
      }
    });

    if (validos.length > 0) {
      validos.sort((a, b) => {
        if (!a.validade) return 1;
        if (!b.validade) return -1;
        return a.validade.localeCompare(b.validade);
      });
      return validos[0];
    }

    // Se todos estiverem com validade expirada mas têm quantidade, pega o com maior quantidade
    comEstoque.sort((a, b) => b.quantidade - a.quantidade);
    return comEstoque[0];
  }

  // 3. Se nenhum tiver estoque > 0, retorna o mais recente
  return correspondentes[0];
}

/**
 * Utilitário para decodificar códigos EAN-13 gerados por balanças (Hortifrúti e Açougue).
 * Padrão Brasileiro EAN-13 para etiquetas de balança:
 * Começa com '2'
 * Estrutura comum: 2 + CCCCC + T + VVVVV + D
 * - 2: Prefixo de balança (dígito 2)
 * - CCCCC: Código do produto (5 dígitos)
 * - T: Dígito verificador do produto ou tipo
 * - VVVVV: Valor Total da etiqueta em centavos (5 dígitos, ex: 00150 = R$ 1,50 | 01500 = R$ 15,00)
 * - D: Dígito verificador geral EAN-13
 */
export function processarCodigoBarraBalanca(codigoBarra: string, estoque: ItemEstoque[]): ResultadoBalanca {
  const limpo = (codigoBarra || '').trim().replace(/\D/g, '');

  if (limpo.length !== 13 || !limpo.startsWith('2')) {
    return { isBalanca: false };
  }

  // Extrai trecho do código do produto (posições 1 a 6 = 5 dígitos, ex: 2 CCCCC T VVVVV D)
  const codProdutoRaw = limpo.slice(1, 6); // ex: '00123'
  const codProdutoSemZeros = codProdutoRaw.replace(/^0+/, '') || codProdutoRaw; // ex: '123'
  const codProduto4 = limpo.slice(1, 5); // Suporte a balanças de 4 dígitos
  const codProduto4SemZeros = codProduto4.replace(/^0+/, '') || codProduto4;

  // Extrai valor em centavos (posições 7 a 12 = 5 dígitos)
  const valorCentavos = parseInt(limpo.slice(7, 12), 10);
  const precoTotal = isNaN(valorCentavos) ? 0 : valorCentavos / 100;

  // Procura o produto no estoque cadastrado usando a seleção inteligente de lote
  const itemEncontrado =
    localizarMelhorLoteEstoque(codProdutoRaw, estoque) ||
    localizarMelhorLoteEstoque(codProdutoSemZeros, estoque) ||
    localizarMelhorLoteEstoque(codProduto4, estoque) ||
    localizarMelhorLoteEstoque(codProduto4SemZeros, estoque);

  if (!itemEncontrado) {
    return {
      isBalanca: true,
      codigoProduto: codProdutoSemZeros,
      precoTotal,
    };
  }

  // Calcula a quantidade (peso em KG ou unidades) baseada no valor total lido da balança
  const precoUnitario = Number(itemEncontrado.preco_venda) || 1;
  const quantidadeCalculada =
    precoTotal > 0 && precoUnitario > 0
      ? parseFloat((precoTotal / precoUnitario).toFixed(3))
      : 1;

  return {
    isBalanca: true,
    codigoProduto: codProdutoSemZeros,
    precoTotal,
    itemEncontrado,
    quantidadeCalculada,
  };
}

