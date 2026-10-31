import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

export const MAPA_UF_BRASIL: Record<string, string> = {
  '11': 'RO', '12': 'AC', '13': 'AM', '14': 'RR', '15': 'PA', '16': 'AP', '17': 'TO',
  '21': 'MA', '22': 'PI', '23': 'CE', '24': 'RN', '25': 'PB', '26': 'PE', '27': 'AL', '28': 'SE', '29': 'BA',
  '31': 'MG', '32': 'ES', '33': 'RJ', '35': 'SP',
  '41': 'PR', '42': 'SC', '43': 'RS',
  '50': 'MS', '51': 'MT', '52': 'GO', '53': 'DF',
};

export interface InfoChaveNotaDecodificada {
  chave: string;
  uf: string;
  ano: string;
  mes: string;
  dataEstimada: string;
  cnpjRaw: string;
  cnpjFormatado: string;
  modelo: string;
  serie: string;
  numeroNF: string;
  tipoDocumento: 'nfe' | 'nfse';
}

export function decodificarChaveNotaFiscal(chaveLimpa: string): InfoChaveNotaDecodificada | null {
  const chave = chaveLimpa.replace(/\D/g, '');

  // 1. NFS-e Nacional de Serviços (50 dígitos)
  if (chave.length === 50) {
    const cUF = chave.substring(0, 2);
    const uf = MAPA_UF_BRASIL[cUF] || 'GO';
    const cnpjRaw = chave.substring(9, 23);
    const cnpjFormatado = cnpjRaw.length === 14
      ? `${cnpjRaw.slice(0, 2)}.${cnpjRaw.slice(2, 5)}.${cnpjRaw.slice(5, 8)}/${cnpjRaw.slice(8, 12)}-${cnpjRaw.slice(12, 14)}`
      : cnpjRaw;
    const nNF = parseInt(chave.substring(23, 36), 10).toString();
    const aamm = chave.substring(36, 40);
    const ano = `20${aamm.substring(0, 2)}`;
    const mes = aamm.substring(2, 4);

    return {
      chave,
      uf,
      ano,
      mes,
      dataEstimada: `${ano}-${mes}-01`,
      cnpjRaw,
      cnpjFormatado,
      modelo: 'NFS-e Nacional (50 dígitos)',
      serie: '1',
      numeroNF: nNF,
      tipoDocumento: 'nfse',
    };
  }

  // 2. NF-e / NFC-e de Mercadorias / Produtos (44 dígitos)
  if (chave.length === 44) {
    const cUF = chave.substring(0, 2);
    const uf = MAPA_UF_BRASIL[cUF] || 'BR';
    const aamm = chave.substring(2, 6);
    const ano = `20${aamm.substring(0, 2)}`;
    const mes = aamm.substring(2, 4);
    const cnpjRaw = chave.substring(6, 20);
    const cnpjFormatado = `${cnpjRaw.slice(0, 2)}.${cnpjRaw.slice(2, 5)}.${cnpjRaw.slice(5, 8)}/${cnpjRaw.slice(8, 12)}-${cnpjRaw.slice(12, 14)}`;
    const modelo = chave.substring(20, 22);
    const serie = parseInt(chave.substring(22, 25), 10).toString();
    const nNF = parseInt(chave.substring(25, 34), 10).toString();

    return {
      chave,
      uf,
      ano,
      mes,
      dataEstimada: `${ano}-${mes}-01`,
      cnpjRaw,
      cnpjFormatado,
      modelo: modelo === '55' ? 'NF-e (Modelo 55)' : modelo === '65' ? 'NFC-e (Modelo 65)' : `Modelo ${modelo}`,
      serie,
      numeroNF: nNF,
      tipoDocumento: 'nfe',
    };
  }

  return null;
}

export interface ItemNotaExtraido {
  cProd: string;
  cEAN: string;
  xProd: string;
  ncm: string;
  uCom: string;
  qCom: number;
  vUnCom: number;
  vProd: number;
}

export interface NotaFiscalExtraida {
  chaveAcesso: string;
  numeroNF: string;
  serie: string;
  dataEmissao: string;
  fornecedorNome: string;
  fornecedorCNPJ: string;
  fornecedorUF: string;
  valorTotalNF: number;
  tipoDocumento: 'nfe' | 'nfse';
  itens: ItemNotaExtraido[];
}

export function parseTextoNotaFiscal(textoCompleto: string): NotaFiscalExtraida {
  const texto = textoCompleto.replace(/\r\n/g, '\n');

  // 1. Chave de acesso (50 dígitos para NFS-e ou 44 dígitos para NF-e)
  const chave50Match = texto.match(/(\d{50})/);
  const chave44Match = texto.match(/(?:CHAVE DE ACESSO(?: DA NFS-e)?\s*[:\s]*)?(\d{44})/i) || texto.match(/(\d{44})/);
  const chaveAcesso = chave50Match ? chave50Match[1] : (chave44Match ? chave44Match[1] : '');

  const infoDecodificada = chaveAcesso ? decodificarChaveNotaFiscal(chaveAcesso) : null;

  // 2. Número da Nota
  const numNFSMatch = texto.match(/N[ÚU]MERO DA NFS-e\s*[:\s]*(\d+)/i) || texto.match(/N[°º]\s*NFS-e\s*[\/:]\s*(\d+)/i);
  const numNFEMatch = texto.match(/N[º°]\s*([\d\.]+)/i);
  const numeroNF = numNFSMatch
    ? numNFSMatch[1]
    : (infoDecodificada?.numeroNF || (numNFEMatch ? numNFEMatch[1].replace(/\D/g, '') : '1'));

  // 3. Série
  const serieMatch = texto.match(/S[ÉE]RIE(?: DA DPS)?\s*[:\s]*(\d+)/i);
  const serie = serieMatch ? serieMatch[1] : (infoDecodificada?.serie || '1');

  // 4. Data de emissão
  const dataMatch = texto.match(/DATA E HORA DA EMISS[ÃA]O(?: DA NFS-e)?\s*[:\s]*(\d{2}\/\d{2}\/\d{4})/i) ||
                    texto.match(/DATA DA EMISS[ÃA]O\s*[:\s]*(\d{2}\/\d{2}\/\d{4})/i) ||
                    texto.match(/COMPET[ÊE]NCIA DA NFS-e\s*[:\s]*(\d{2}\/\d{2}\/\d{4})/i) ||
                    texto.match(/(\d{2}\/\d{2}\/\d{4})/);
  let dataEmissao = new Date().toISOString().slice(0, 10);
  if (dataMatch) {
    const [dia, mes, ano] = dataMatch[1].split('/');
    dataEmissao = `${ano}-${mes}-${dia}`;
  } else if (infoDecodificada?.dataEstimada) {
    dataEmissao = infoDecodificada.dataEstimada;
  }

  // 5. CNPJ do fornecedor
  const cnpjMatch = texto.match(/(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/);
  const fornecedorCNPJ = cnpjMatch ? cnpjMatch[1] : (infoDecodificada?.cnpjFormatado || '');

  // 6. Nome / Razão social do fornecedor
  let fornecedorNome = '';
  const nomeEmpMatch = texto.match(/Nome\s*(?:\/\s*Nome Empresarial)?\s*[:\s]*([^\n\r]+?)(?=\s+Munic[íi]pio|\s+Sigla|\s+C[óo]digo|\s+Endere[çc]o|$)/i);
  const razaoSocialMatch = texto.match(/RAZ[ÃA]O SOCIAL\s*[:\s]*([^\n\r]+?)(?=\s+CNPJ|\s+ENDERE[ÇC]O|$)/i);
  const emitenteMatch = texto.match(/EMITENTE\s*[:\s]*([^\n\r]+?)(?=\s+CNPJ|$)/i);

  if (nomeEmpMatch && nomeEmpMatch[1].trim().length > 2) {
    fornecedorNome = nomeEmpMatch[1].trim();
  } else if (razaoSocialMatch && razaoSocialMatch[1].trim().length > 2) {
    fornecedorNome = razaoSocialMatch[1].trim();
  } else if (emitenteMatch && emitenteMatch[1].trim().length > 2) {
    fornecedorNome = emitenteMatch[1].trim();
  } else if (fornecedorCNPJ) {
    fornecedorNome = `Fornecedor CNPJ ${fornecedorCNPJ}`;
  } else {
    fornecedorNome = 'Fornecedor da Nota';
  }

  // 7. UF
  const ufMatch = texto.match(/Munic[íi]pio\s*\/\s*Sigla UF\s*[:\s]*[^\/]+\/\s*([A-Z]{2})/i) ||
                  texto.match(/UF\s*[:\s]*([A-Z]{2})/i);
  const fornecedorUF = ufMatch ? ufMatch[1] : (infoDecodificada?.uf || 'BR');

  // 8. Valor Total da Nota
  const valorMatch = texto.match(/VALOR DA OPERA[ÇC][ÃA]O\s*(?:\/\s*SERVIÇO)?\s*R\$\s*([\d\.,]+)/i) ||
                     texto.match(/VALOR L[ÍI]QUIDO DA NFS-e\s*R\$\s*([\d\.,]+)/i) ||
                     texto.match(/VALOR TOTAL DA NOTA\s*R\$\s*([\d\.,]+)/i) ||
                     texto.match(/VALOR TOTAL DOS PRODUTOS\s*R\$\s*([\d\.,]+)/i);
  const valorTotalNF = valorMatch
    ? parseFloat(valorMatch[1].replace(/\./g, '').replace(',', '.'))
    : 0;

  // 9. Extração de Itens / Produtos / Serviços
  const itens: ItemNotaExtraido[] = [];

  // Se for NFS-e: busca o serviço descrito
  const servMatch = texto.match(/Descri[çc][ãa]o do Servi[çc]o\s*([^\n\r]+?)(?=\s+TRIBUTA[ÇC][ÃA]O|\s+VALOR|\s+Total|$)/i);
  if (servMatch && servMatch[1].trim()) {
    const descServ = servMatch[1].trim();
    itens.push({
      cProd: 'SERV_001',
      cEAN: '',
      xProd: descServ,
      ncm: '',
      uCom: 'UN',
      qCom: 1,
      vUnCom: valorTotalNF > 0 ? valorTotalNF : 0,
      vProd: valorTotalNF > 0 ? valorTotalNF : 0,
    });
  }

  return {
    chaveAcesso,
    numeroNF,
    serie,
    dataEmissao,
    fornecedorNome,
    fornecedorCNPJ,
    fornecedorUF,
    valorTotalNF,
    tipoDocumento: chaveAcesso.length === 50 ? 'nfse' : 'nfe',
    itens,
  };
}

export async function extrairTextoDePDFArrayBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
  const data = new Uint8Array(arrayBuffer);
  const loadingTask = pdfjsLib.getDocument({ data });
  const doc = await loadingTask.promise;
  let fullText = '';

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((it: any) => it.str || '');
    fullText += strings.join(' ') + '\n';
  }

  return fullText;
}
