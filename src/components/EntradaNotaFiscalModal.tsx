import React, { useState, useRef, useEffect } from 'react';
import { ItemEstoque, Supermercado } from '../types';
import { BrowserMultiFormatReader } from '@zxing/library';
import {
  obterStreamCameraOtimizado,
  prepararVideoElement,
  criarLeitorZXing,
  capturarRecorteCentroVideo,
  decodificarCanvasComRotacao,
  alternarLanternaCamera,
} from '../lib/barcodeScanner';
import { tocarBeepCaixa } from '../lib/soundUtils';

export interface ItemNotaProcessado {
  id: string;
  nItem: number;
  cProd: string;
  cEAN: string;
  xProd: string;
  ncm: string;
  uCom: string;
  qCom: number;
  vUnCom: number;
  vProd: number;
  produtoExistente?: ItemEstoque;
  selecionado: boolean;
  quantidadeEntrada: number;
  precoCustoFinal: number;
  margemLucroPorcentagem: number;
  precoVendaSugerido: number;
}

export interface DadosNotaFiscal {
  numeroNF: string;
  serie: string;
  dataEmissao: string;
  chaveAcesso: string;
  fornecedorNome: string;
  fornecedorCNPJ: string;
  fornecedorUF: string;
  valorTotalNF: number;
  valorProdutos: number;
  origem: 'xml_upload' | 'xml_colado' | 'chave_acesso' | 'manual';
  itens: ItemNotaProcessado[];
}

interface EntradaNotaFiscalModalProps {
  visivel: boolean;
  onFechar: () => void;
  lojaAtual: Supermercado | null;
  estoque: ItemEstoque[];
  onConfirmarEntradaEstoque: (
    itensEntrada: {
      codigo: string;
      codigo_barras?: string;
      nome: string;
      quantidadeEntrada: number;
      precoCusto: number;
      precoVenda: number;
      produtoExistente?: ItemEstoque;
    }[],
    dadosNF: {
      numeroNF: string;
      fornecedorNome: string;
      chaveAcesso: string;
      dataEmissao: string;
      valorTotal: number;
    }
  ) => void;
}

const MAPA_UF_BRASIL: Record<string, string> = {
  '11': 'RO', '12': 'AC', '13': 'AM', '14': 'RR', '15': 'PA', '16': 'AP', '17': 'TO',
  '21': 'MA', '22': 'PI', '23': 'CE', '24': 'RN', '25': 'PB', '26': 'PE', '27': 'AL', '28': 'SE', '29': 'BA',
  '31': 'MG', '32': 'ES', '33': 'RJ', '35': 'SP',
  '41': 'PR', '42': 'SC', '43': 'RS',
  '50': 'MS', '51': 'MT', '52': 'GO', '53': 'DF',
};

export function decodificarChaveAcessoNFe(chaveLimpa: string) {
  const chave = chaveLimpa.replace(/\D/g, '');
  if (chave.length !== 44) return null;
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
  };
}

export const EntradaNotaFiscalModal: React.FC<EntradaNotaFiscalModalProps> = ({
  visivel,
  onFechar,
  lojaAtual,
  estoque = [],
  onConfirmarEntradaEstoque,
}) => {
  // Abas de entrada
  const [abaAtiva, setAbaAtiva] = useState<'chave' | 'arquivo' | 'colar'>('chave');
  const [etapa, setEtapa] = useState<'upload' | 'revisao' | 'sucesso'>('upload');

  // Estados de entrada
  const [chaveDigitada, setChaveDigitada] = useState<string>('');
  const [xmlTextoColado, setXmlTextoColado] = useState<string>('');
  const [carregando, setCarregando] = useState(false);
  const [erroMsg, setErroMsg] = useState<string | null>(null);
  const [statusConsultaChave, setStatusConsultaChave] = useState<string | null>(null);

  // Câmera para leitura da Chave da Nota Fiscal
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const [cameraCarregando, setCameraCarregando] = useState(false);
  const [lanternaAtiva, setLanternaAtiva] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const frameScanIntervalRef = useRef<any>(null);

  // Dados da nota processada
  const [dadosNota, setDadosNota] = useState<DadosNotaFiscal | null>(null);
  const [margemPadraoGlobal, setMargemPadraoGlobal] = useState<number>(35);
  const [resumoSucesso, setResumoSucesso] = useState<{ atualizados: number; novos: number; totalItens: number } | null>(null);

  // Adicionar produto avulso à nota em revisão
  const [buscaProdAvulso, setBuscaProdAvulso] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Formatação visual da chave a cada 4 dígitos
  const formatarChaveVisual = (str: string) => {
    const limpo = str.replace(/\D/g, '').slice(0, 44);
    return limpo.replace(/(\d{4})/g, '$1 ').trim();
  };

  // Ciclo da câmera
  const pararCamera = () => {
    if (frameScanIntervalRef.current) {
      clearInterval(frameScanIntervalRef.current);
      frameScanIntervalRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      mediaStreamRef.current = null;
    }
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
      } catch (e) {}
    }
    if (videoRef.current) {
      try {
        videoRef.current.srcObject = null;
      } catch (e) {}
    }
    setLanternaAtiva(false);
    setCameraCarregando(false);
    setCameraAtiva(false);
  };

  const iniciarCameraLeituraDanfe = async () => {
    setCameraAtiva(true);
    setCameraCarregando(true);
    setErroMsg(null);

    try {
      const stream = await obterStreamCameraOtimizado('environment');
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        await prepararVideoElement(videoRef.current, stream);
      }
      setCameraCarregando(false);

      const onDetect = (rawText: string) => {
        if (!rawText) return;
        const limpo = rawText.replace(/\D/g, '');
        if (limpo.length === 44) {
          tocarBeepCaixa();
          setChaveDigitada(limpo);
          pararCamera();
          processarChaveAcesso(limpo);
        }
      };

      if (!codeReaderRef.current) {
        codeReaderRef.current = criarLeitorZXing();
      }

      if (videoRef.current) {
        try {
          const decodePromise = codeReaderRef.current.decodeFromVideoElementContinuously(
            videoRef.current,
            (result: any) => {
              if (result) {
                const txt = result.getText();
                if (txt) onDetect(txt);
              }
            }
          );
          if (decodePromise && typeof decodePromise.catch === 'function') {
            decodePromise.catch(() => {});
          }
        } catch (e) {}
      }

      frameScanIntervalRef.current = setInterval(() => {
        if (!videoRef.current || videoRef.current.readyState < 2) return;
        try {
          const cropCanvas = capturarRecorteCentroVideo(videoRef.current);
          if (cropCanvas) {
            const cod = decodificarCanvasComRotacao(cropCanvas);
            if (cod) onDetect(cod);
          }
        } catch (e) {}
      }, 140);
    } catch (err) {
      setCameraCarregando(false);
      setCameraAtiva(false);
      setErroMsg('Não foi possível abrir a câmera. Digite a chave de 44 dígitos no campo abaixo.');
    }
  };

  const alternarLanterna = async () => {
    if (!mediaStreamRef.current) return;
    const novoStatus = !lanternaAtiva;
    const ok = await alternarLanternaCamera(mediaStreamRef.current, novoStatus);
    if (ok) setLanternaAtiva(novoStatus);
  };

  useEffect(() => {
    return () => {
      pararCamera();
    };
  }, []);

  // Parser robusto de XML de NF-e da SEFAZ
  const processarTextoXML = (conteudoXML: string, origem: 'xml_upload' | 'xml_colado' = 'xml_upload') => {
    try {
      setCarregando(true);
      setErroMsg(null);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(conteudoXML, 'application/xml');

      const parseError = xmlDoc.getElementsByTagName('parsererror');
      if (parseError.length > 0) {
        throw new Error('O texto fornecido não é um XML válido ou está corrompido.');
      }

      const ide = xmlDoc.getElementsByTagName('ide')[0];
      const emit = xmlDoc.getElementsByTagName('emit')[0];
      const total = xmlDoc.getElementsByTagName('total')[0];
      const infNFe = xmlDoc.getElementsByTagName('infNFe')[0];

      if (!ide || !emit) {
        throw new Error('Este arquivo XML não possui a estrutura padrão de NF-e (Nota Fiscal Eletrônica).');
      }

      const getTagTexto = (parent: Element | null, tagName: string): string => {
        if (!parent) return '';
        const el = parent.getElementsByTagName(tagName)[0];
        return el ? el.textContent?.trim() || '' : '';
      };

      const numeroNF = getTagTexto(ide, 'nNF');
      const serie = getTagTexto(ide, 'serie');
      const dhEmiRaw = getTagTexto(ide, 'dhEmi') || getTagTexto(ide, 'dEmi');
      const dataEmissao = dhEmiRaw ? dhEmiRaw.slice(0, 10) : new Date().toISOString().slice(0, 10);
      const chaveAcesso = (infNFe?.getAttribute('Id') || getTagTexto(xmlDoc.documentElement, 'chNFe') || '').replace(/\D/g, '');

      const fornecedorNome = getTagTexto(emit, 'xNome') || getTagTexto(emit, 'xFant') || 'Fornecedor Desconhecido';
      const fornecedorCNPJ = getTagTexto(emit, 'CNPJ') || getTagTexto(emit, 'CPF');
      const fornecedorUF = getTagTexto(emit, 'UF');

      const valorTotalNF = parseFloat(getTagTexto(total, 'vNF')) || 0;
      const valorProdutos = parseFloat(getTagTexto(total, 'vProd')) || 0;

      const detList = Array.from(xmlDoc.getElementsByTagName('det'));
      if (detList.length === 0) {
        throw new Error('Nenhum produto foi encontrado no corpo deste XML.');
      }

      const itensProcessados: ItemNotaProcessado[] = detList.map((det, index) => {
        const prod = det.getElementsByTagName('prod')[0];
        const cProd = getTagTexto(prod, 'cProd');
        const cEANRaw = getTagTexto(prod, 'cEAN');
        const xProd = getTagTexto(prod, 'xProd');
        const ncm = getTagTexto(prod, 'NCM');
        const uCom = getTagTexto(prod, 'uCom') || 'UN';
        const qCom = parseFloat(getTagTexto(prod, 'qCom')) || 1;
        const vUnCom = parseFloat(getTagTexto(prod, 'vUnCom')) || 0;
        const vProd = parseFloat(getTagTexto(prod, 'vProd')) || (qCom * vUnCom);

        const cEANLimpo = (cEANRaw && cEANRaw !== 'SEM GTIN' && cEANRaw !== 'SEM_GTIN' && /^\d+$/.test(cEANRaw))
          ? cEANRaw
          : '';

        const produtoExistente = estoque.find((e) => {
          const codE = String(e.codigo || '').trim();
          const codB = String(e.codigo_barras || '').trim();
          if (cEANLimpo && (codE === cEANLimpo || codB === cEANLimpo)) return true;
          if (codE === cProd) return true;
          return false;
        });

        const margem = produtoExistente && produtoExistente.preco_custo && produtoExistente.preco_venda && produtoExistente.preco_custo > 0
          ? Number((((produtoExistente.preco_venda - produtoExistente.preco_custo) / produtoExistente.preco_custo) * 100).toFixed(1))
          : margemPadraoGlobal;

        const precoVendaSugerido = Number((vUnCom * (1 + margem / 100)).toFixed(2));

        return {
          id: `item_nfe_${index}_${cProd}`,
          nItem: index + 1,
          cProd,
          cEAN: cEANLimpo,
          xProd,
          ncm,
          uCom,
          qCom,
          vUnCom,
          vProd,
          produtoExistente,
          selecionado: true,
          quantidadeEntrada: qCom,
          precoCustoFinal: vUnCom,
          margemLucroPorcentagem: margem,
          precoVendaSugerido,
        };
      });

      setDadosNota({
        numeroNF,
        serie,
        dataEmissao,
        chaveAcesso,
        fornecedorNome,
        fornecedorCNPJ,
        fornecedorUF,
        valorTotalNF,
        valorProdutos,
        origem,
        itens: itensProcessados,
      });

      setEtapa('revisao');
    } catch (err: any) {
      setErroMsg(err?.message || 'Falha ao processar o XML da nota fiscal.');
    } finally {
      setCarregando(false);
    }
  };

  // Processar chave de acesso de 44 dígitos digitada ou bipada
  const processarChaveAcesso = async (chaveRaw: string) => {
    const chaveLimpa = chaveRaw.replace(/\D/g, '');
    if (chaveLimpa.length !== 44) {
      setErroMsg('A Chave de Acesso da NF-e deve conter exatamente 44 números.');
      return;
    }

    const info = decodificarChaveAcessoNFe(chaveLimpa);
    if (!info) {
      setErroMsg('Chave de Acesso inválida.');
      return;
    }

    setCarregando(true);
    setErroMsg(null);
    setStatusConsultaChave(`Chave decodificada: NF nº ${info.numeroNF} • Série ${info.serie} • CNPJ ${info.cnpjFormatado}. Consultando XML...`);

    // 1. Tenta buscar o XML completo na API pública
    try {
      const resp = await fetch(`https://ws.meudanfe.com.br/api/v1/get/nfe/xml/${info.chave}`, {
        method: 'GET',
        headers: { Accept: 'application/xml, text/xml, */*' },
      });

      if (resp.ok) {
        const xmlTexto = await resp.text();
        if (xmlTexto && xmlTexto.includes('<infNFe')) {
          setStatusConsultaChave('XML completo encontrado! Carregando produtos...');
          processarTextoXML(xmlTexto, 'chave_acesso');
          return;
        }
      }
    } catch (e) {
      // Falha na API pública de consulta online direta
    }

    // 2. Se a SEFAZ exigir certificado digital A1 na nuvem, montamos a nota com os dados oficiais extraídos da chave
    // e abrimos a conferência rápida para o lojista adicionar/bipar os produtos recebidos nesta nota
    setCarregando(false);
    setStatusConsultaChave(null);

    const notaInicial: DadosNotaFiscal = {
      numeroNF: info.numeroNF,
      serie: info.serie,
      dataEmissao: info.dataEstimada,
      chaveAcesso: info.chave,
      fornecedorNome: `Fornecedor CNPJ ${info.cnpjFormatado}`,
      fornecedorCNPJ: info.cnpjFormatado,
      fornecedorUF: info.uf,
      valorTotalNF: 0,
      valorProdutos: 0,
      origem: 'chave_acesso',
      itens: [],
    };

    setDadosNota(notaInicial);
    setEtapa('revisao');
  };

  // Upload via arquivo .xml
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.xml')) {
      setErroMsg('Por favor, selecione um arquivo no formato XML da NF-e (.xml).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) processarTextoXML(text, 'xml_upload');
    };
    reader.readAsText(file, 'UTF-8');
  };

  // Adicionar produto avulso à nota manualmente na revisão
  const handleAdicionarProdutoNaNota = (prod: ItemEstoque) => {
    if (!dadosNota) return;

    const margem = prod.preco_custo && prod.preco_venda && prod.preco_custo > 0
      ? Number((((prod.preco_venda - prod.preco_custo) / prod.preco_custo) * 100).toFixed(1))
      : margemPadraoGlobal;

    const custo = prod.preco_custo || 0;
    const precoVenda = prod.preco_venda || Number((custo * (1 + margem / 100)).toFixed(2));

    const novoItemNota: ItemNotaProcessado = {
      id: `manual_${Date.now()}_${prod.codigo}`,
      nItem: dadosNota.itens.length + 1,
      cProd: prod.codigo,
      cEAN: prod.codigo_barras || prod.codigo,
      xProd: prod.nome,
      ncm: '',
      uCom: 'UN',
      qCom: 1,
      vUnCom: custo,
      vProd: custo,
      produtoExistente: prod,
      selecionado: true,
      quantidadeEntrada: 1,
      precoCustoFinal: custo,
      margemLucroPorcentagem: margem,
      precoVendaSugerido: precoVenda,
    };

    tocarBeepCaixa();
    setDadosNota({
      ...dadosNota,
      itens: [...dadosNota.itens, novoItemNota],
    });
    setBuscaProdAvulso('');
  };

  // Alterar seleção individual de item
  const alternarSelecaoItem = (index: number) => {
    if (!dadosNota) return;
    const novos = [...dadosNota.itens];
    novos[index].selecionado = !novos[index].selecionado;
    setDadosNota({ ...dadosNota, itens: novos });
  };

  const alterarQtdEntrada = (index: number, val: number) => {
    if (!dadosNota) return;
    const novos = [...dadosNota.itens];
    novos[index].quantidadeEntrada = Math.max(0, val);
    setDadosNota({ ...dadosNota, itens: novos });
  };

  const alterarCustoItem = (index: number, novoCusto: number) => {
    if (!dadosNota) return;
    const novos = [...dadosNota.itens];
    novos[index].precoCustoFinal = novoCusto;
    novos[index].precoVendaSugerido = Number(
      (novoCusto * (1 + novos[index].margemLucroPorcentagem / 100)).toFixed(2)
    );
    setDadosNota({ ...dadosNota, itens: novos });
  };

  const alterarMargemItem = (index: number, novaMargem: number) => {
    if (!dadosNota) return;
    const novos = [...dadosNota.itens];
    novos[index].margemLucroPorcentagem = novaMargem;
    novos[index].precoVendaSugerido = Number(
      (novos[index].precoCustoFinal * (1 + novaMargem / 100)).toFixed(2)
    );
    setDadosNota({ ...dadosNota, itens: novos });
  };

  const alterarPrecoVendaItem = (index: number, novoPreco: number) => {
    if (!dadosNota) return;
    const novos = [...dadosNota.itens];
    novos[index].precoVendaSugerido = novoPreco;
    if (novos[index].precoCustoFinal > 0) {
      novos[index].margemLucroPorcentagem = Number(
        (((novoPreco - novos[index].precoCustoFinal) / novos[index].precoCustoFinal) * 100).toFixed(1)
      );
    }
    setDadosNota({ ...dadosNota, itens: novos });
  };

  const aplicarMargemGlobal = (margem: number) => {
    if (!dadosNota) return;
    const novos = dadosNota.itens.map((it) => {
      const precoVendaSugerido = Number((it.precoCustoFinal * (1 + margem / 100)).toFixed(2));
      return {
        ...it,
        margemLucroPorcentagem: margem,
        precoVendaSugerido,
      };
    });
    setDadosNota({ ...dadosNota, itens: novos });
  };

  // Confirmar entrada no estoque
  const handleConfirmar = () => {
    if (!dadosNota) return;

    const itensParaEntrada = dadosNota.itens
      .filter((it) => it.selecionado && it.quantidadeEntrada > 0)
      .map((it) => {
        const codigoFinal = it.cEAN || it.cProd;
        return {
          codigo: codigoFinal,
          codigo_barras: it.cEAN || undefined,
          nome: it.xProd,
          quantidadeEntrada: it.quantidadeEntrada,
          precoCusto: it.precoCustoFinal,
          precoVenda: it.precoVendaSugerido,
          produtoExistente: it.produtoExistente,
        };
      });

    if (itensParaEntrada.length === 0) {
      alert('Nenhum item marcado para dar entrada. Marque ao menos um produto da lista.');
      return;
    }

    let atualizados = 0;
    let novos = 0;

    itensParaEntrada.forEach((it) => {
      if (it.produtoExistente) atualizados++;
      else novos++;
    });

    onConfirmarEntradaEstoque(itensParaEntrada, {
      numeroNF: dadosNota.numeroNF,
      fornecedorNome: dadosNota.fornecedorNome,
      chaveAcesso: dadosNota.chaveAcesso,
      dataEmissao: dadosNota.dataEmissao,
      valorTotal: dadosNota.valorTotalNF,
    });

    setResumoSucesso({
      atualizados,
      novos,
      totalItens: itensParaEntrada.length,
    });
    setEtapa('sucesso');
  };

  const resetarModal = () => {
    pararCamera();
    setDadosNota(null);
    setErroMsg(null);
    setChaveDigitada('');
    setXmlTextoColado('');
    setEtapa('upload');
    setResumoSucesso(null);
    onFechar();
  };

  if (!visivel) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 100100 }}>
      <div
        className="modal-container"
        style={{
          maxWidth: etapa === 'revisao' ? '860px' : '560px',
          width: '95vw',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '18px',
        }}
      >
        {/* CABEÇALHO DO MODAL */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#0369a1', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📥</span>
              <span>Entrada de Nota Fiscal (NF-e / XML)</span>
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Loja: <b>{lojaAtual?.nome || 'Loja Principal'}</b>
            </span>
          </div>
          <button className="btn-fechar-modal" onClick={resetarModal}>&times;</button>
        </div>

        {/* ETAPA 1: ESCOLHA DA FORMA DE ENTRADA */}
        {etapa === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* ABAS SUPERIORES DE ENTRADA */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
              <button
                type="button"
                onClick={() => { setAbaAtiva('chave'); pararCamera(); setErroMsg(null); }}
                style={{
                  padding: '8px 4px',
                  borderRadius: '6px',
                  border: 'none',
                  background: abaAtiva === 'chave' ? '#0284c7' : 'transparent',
                  color: abaAtiva === 'chave' ? '#ffffff' : '#475569',
                  fontWeight: abaAtiva === 'chave' ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <span>🔑</span>
                <span>Digitar Chave (44)</span>
              </button>

              <button
                type="button"
                onClick={() => { setAbaAtiva('arquivo'); pararCamera(); setErroMsg(null); }}
                style={{
                  padding: '8px 4px',
                  borderRadius: '6px',
                  border: 'none',
                  background: abaAtiva === 'arquivo' ? '#0284c7' : 'transparent',
                  color: abaAtiva === 'arquivo' ? '#ffffff' : '#475569',
                  fontWeight: abaAtiva === 'arquivo' ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <span>📁</span>
                <span>Arquivo .XML</span>
              </button>

              <button
                type="button"
                onClick={() => { setAbaAtiva('colar'); pararCamera(); setErroMsg(null); }}
                style={{
                  padding: '8px 4px',
                  borderRadius: '6px',
                  border: 'none',
                  background: abaAtiva === 'colar' ? '#0284c7' : 'transparent',
                  color: abaAtiva === 'colar' ? '#ffffff' : '#475569',
                  fontWeight: abaAtiva === 'colar' ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <span>📋</span>
                <span>Colar XML</span>
              </button>
            </div>

            {/* MENSAGENS DE STATUS OU ERRO */}
            {carregando && (
              <div style={{ textAlign: 'center', color: '#0284c7', fontWeight: 600, fontSize: '0.88rem', background: '#f0f9ff', padding: '10px', borderRadius: '8px' }}>
                ⏳ {statusConsultaChave || 'Processando dados da nota...'}
              </div>
            )}

            {erroMsg && (
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600 }}>
                ⚠️ {erroMsg}
              </div>
            )}

            {/* ABA 1: DIGITAR OU BIPAR CHAVE DE ACESSO */}
            {abaAtiva === 'chave' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                      Chave de Acesso da NF-e (44 números):
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (cameraAtiva) pararCamera();
                        else iniciarCameraLeituraDanfe();
                      }}
                      style={{
                        background: cameraAtiva ? '#dc2626' : '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {cameraAtiva ? '✕ Fechar Câmera' : '📷 Bipar Código da Nota'}
                    </button>
                  </div>

                  {/* VISOR DA CÂMERA PARA LER CÓDIGO DE BARRAS DA NOTA */}
                  {cameraAtiva && (
                    <div style={{ marginBottom: '10px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #16a34a', background: '#000000', position: 'relative' }}>
                      <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                        <video ref={videoRef} playsInline muted autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div className="mira-scanner"><div className="linha-laser" /></div>
                        <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={alternarLanterna}
                            style={{ background: lanternaAtiva ? '#f59e0b' : 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '14px', padding: '3px 8px', fontSize: '0.7rem', cursor: 'pointer' }}
                          >
                            🔦 Lanterna
                          </button>
                        </div>
                      </div>
                      <div style={{ background: '#15803d', color: '#fff', padding: '4px', fontSize: '0.72rem', textAlign: 'center', fontWeight: 600 }}>
                        Aponte a câmera para o código de barras no topo do DANFE da nota fiscal
                      </div>
                    </div>
                  )}

                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000"
                    value={formatarChaveVisual(chaveDigitada)}
                    onChange={(e) => {
                      const num = e.target.value.replace(/\D/g, '').slice(0, 44);
                      setChaveDigitada(num);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        processarChaveAcesso(chaveDigitada);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #0284c7',
                      fontSize: '1rem',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      fontFamily: 'monospace',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                    <span>Digite os 44 números que ficam abaixo do código de barras da nota</span>
                    <span><b>{chaveDigitada.replace(/\D/g, '').length}</b> / 44 dígitos</span>
                  </div>
                </div>

                {/* BOTÃO PARA CONSULTAR E PUXAR AS INFORMAÇÕES */}
                <button
                  type="button"
                  disabled={carregando || chaveDigitada.replace(/\D/g, '').length !== 44}
                  onClick={() => processarChaveAcesso(chaveDigitada)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: chaveDigitada.replace(/\D/g, '').length === 44 ? '#0284c7' : '#94a3b8',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: chaveDigitada.replace(/\D/g, '').length === 44 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  <span>🔍</span>
                  <span>Consultar e Puxar Dados da Nota</span>
                </button>
              </div>
            )}

            {/* ABA 2: ARQUIVO XML (.xml) */}
            {abaAtiva === 'arquivo' && (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #0284c7',
                  borderRadius: '12px',
                  padding: '34px 20px',
                  textAlign: 'center',
                  background: '#f0f9ff',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '2.6rem', marginBottom: '8px' }}>📄</div>
                <h4 style={{ margin: '0 0 4px 0', color: '#0369a1', fontSize: '1rem' }}>
                  Clique aqui para selecionar o arquivo XML da NF-e
                </h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.82rem' }}>
                  Arquivo <b>.xml</b> enviado pelo fornecedor (Ambev, Coca-Cola, atacadistas...)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xml,text/xml"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
            )}

            {/* ABA 3: COLAR CONTEÚDO XML */}
            {abaAtiva === 'colar' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155' }}>
                  Cole o código do arquivo XML aqui (Ctrl+V):
                </label>
                <textarea
                  rows={6}
                  placeholder="Cole aqui o texto do XML que você copiou do WhatsApp ou e-mail..."
                  value={xmlTextoColado}
                  onChange={(e) => setXmlTextoColado(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.78rem',
                    fontFamily: 'monospace',
                  }}
                />
                <button
                  type="button"
                  disabled={!xmlTextoColado.trim()}
                  onClick={() => processarTextoXML(xmlTextoColado, 'xml_colado')}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: xmlTextoColado.trim() ? '#0284c7' : '#94a3b8',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: xmlTextoColado.trim() ? 'pointer' : 'not-allowed',
                  }}
                >
                  ⚡ Processar XML Colado
                </button>
              </div>
            )}

            {/* BOX EDUCATIVO */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                💡 Como funciona a entrada automática:
              </div>
              <div>• <b>Chave de 44 dígitos:</b> Extrai número da nota, data e fornecedor imediatamente.</div>
              <div>• <b>Arquivo XML:</b> Carrega todos os produtos, quantidades e custos com 1 clique.</div>
              <div>• <b>Atualização de Estoque:</b> Soma as unidades e ajusta seus preços de venda com margem de lucro.</div>
            </div>
          </div>
        )}

        {/* ETAPA 2: REVISÃO DE ITENS, DE-PARA E DEFINIÇÃO DE MARGENS */}
        {etapa === 'revisao' && dadosNota && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflow: 'hidden' }}>
            {/* CABEÇALHO RESUMO DA NOTA */}
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px', fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: '#64748b' }}>Fornecedor:</span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{dadosNota.fornecedorNome}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>CNPJ: {dadosNota.fornecedorCNPJ} ({dadosNota.fornecedorUF})</div>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Nota Fiscal:</span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>Nº {dadosNota.numeroNF} • Série {dadosNota.serie}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Emissão: {dadosNota.dataEmissao}</div>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Total da Nota:</span>
                <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '1.05rem' }}>
                  {dadosNota.valorTotalNF > 0 ? `R$ ${dadosNota.valorTotalNF.toFixed(2)}` : 'Conferência de Carga'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{dadosNota.itens.length} produtos listados</div>
              </div>
            </div>

            {/* SEÇÃO PARA ADICIONAR PRODUTO AVULSO / BIPAR COM A CÂMERA */}
            <div style={{ background: '#f0fdf4', padding: '8px 12px', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '220px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534' }}>
                  ➕ Adicionar Produto do Estoque à Nota:
                </span>
                <input
                  type="text"
                  placeholder="Buscar produto por nome ou código..."
                  value={buscaProdAvulso}
                  onChange={(e) => setBuscaProdAvulso(e.target.value)}
                  style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid #86efac', fontSize: '0.8rem' }}
                />
              </div>

              {/* APLICAÇÃO DE MARGEM GLOBAL */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>Margem Padrão:</span>
                <input
                  type="number"
                  value={margemPadraoGlobal}
                  onChange={(e) => setMargemPadraoGlobal(Number(e.target.value) || 0)}
                  style={{ width: '55px', padding: '3px 4px', borderRadius: '4px', border: '1px solid #86efac', fontWeight: 700, textAlign: 'center', fontSize: '0.82rem' }}
                />
                <span style={{ fontWeight: 700, color: '#166534', fontSize: '0.82rem' }}>%</span>
                <button
                  type="button"
                  onClick={() => aplicarMargemGlobal(margemPadraoGlobal)}
                  style={{ background: '#16a34a', color: '#ffffff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Aplicar em Todos
                </button>
              </div>
            </div>

            {/* RESULTADOS DA BUSCA AVULSA DE PRODUTO */}
            {buscaProdAvulso.trim().length >= 2 && (
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', maxHeight: '120px', overflowY: 'auto', padding: '4px' }}>
                {estoque
                  .filter((p) => p.nome.toLowerCase().includes(buscaProdAvulso.toLowerCase()) || p.codigo.includes(buscaProdAvulso))
                  .slice(0, 5)
                  .map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleAdicionarProdutoNaNota(p)}
                      style={{ padding: '6px 8px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}
                    >
                      <span><b>{p.nome}</b> (Cód: {p.codigo})</span>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>+ Incluir na Nota</span>
                    </div>
                  ))}
              </div>
            )}

            {/* TABELA DE ITENS DA NOTA */}
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#ffffff' }}>
              {dadosNota.itens.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                  📦 Nenhum item adicionado ainda nesta nota.<br />
                  Utilize o campo acima para buscar ou bipe produtos para adicioná-los à conferência desta carga!
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
                    <tr>
                      <th style={{ width: '30px', padding: '6px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={dadosNota.itens.length > 0 && dadosNota.itens.every((it) => it.selecionado)}
                          onChange={(e) => {
                            const marcar = e.target.checked;
                            setDadosNota({
                              ...dadosNota,
                              itens: dadosNota.itens.map((it) => ({ ...it, selecionado: marcar })),
                            });
                          }}
                        />
                      </th>
                      <th style={{ textAlign: 'left', padding: '6px 8px' }}>Produto / Código</th>
                      <th style={{ textAlign: 'center', padding: '6px', width: '90px' }}>Status</th>
                      <th style={{ textAlign: 'center', padding: '6px', width: '80px' }}>Qtd Entrada</th>
                      <th style={{ textAlign: 'right', padding: '6px', width: '80px' }}>Custo (R$)</th>
                      <th style={{ textAlign: 'center', padding: '6px', width: '80px' }}>Margem (%)</th>
                      <th style={{ textAlign: 'right', padding: '6px', width: '85px' }}>Preço Venda</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosNota.itens.map((item, index) => {
                      const isExistente = !!item.produtoExistente;
                      return (
                        <tr
                          key={item.id}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            background: !item.selecionado ? '#f8fafc' : isExistente ? '#ffffff' : '#f0fdf4',
                            opacity: item.selecionado ? 1 : 0.5,
                          }}
                        >
                          <td style={{ textAlign: 'center', padding: '6px' }}>
                            <input
                              type="checkbox"
                              checked={item.selecionado}
                              onChange={() => alternarSelecaoItem(index)}
                            />
                          </td>
                          <td style={{ padding: '6px 8px' }}>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.xProd}</div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                              {item.cEAN ? `EAN: ${item.cEAN}` : `Cód: ${item.cProd}`} • Un: {item.uCom}
                            </div>
                          </td>
                          <td style={{ textAlign: 'center', padding: '6px' }}>
                            {isExistente ? (
                              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '10px', fontSize: '0.68rem', fontWeight: 700 }}>
                                Estoque: {item.produtoExistente?.quantidade || 0}
                              </span>
                            ) : (
                              <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '10px', fontSize: '0.68rem', fontWeight: 700 }}>
                                🆕 Novo
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center', padding: '4px' }}>
                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={item.quantidadeEntrada}
                              onChange={(e) => alterarQtdEntrada(index, parseFloat(e.target.value) || 0)}
                              style={{ width: '55px', padding: '3px', textAlign: 'center', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                            />
                          </td>
                          <td style={{ textAlign: 'right', padding: '4px 6px' }}>
                            <input
                              type="number"
                              step="0.01"
                              value={item.precoCustoFinal}
                              onChange={(e) => alterarCustoItem(index, parseFloat(e.target.value) || 0)}
                              style={{ width: '65px', padding: '3px', textAlign: 'right', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', fontWeight: 600 }}
                            />
                          </td>
                          <td style={{ textAlign: 'center', padding: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                              <input
                                type="number"
                                step="0.1"
                                value={item.margemLucroPorcentagem}
                                onChange={(e) => alterarMargemItem(index, parseFloat(e.target.value) || 0)}
                                style={{ width: '48px', padding: '3px', textAlign: 'center', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', fontWeight: 600 }}
                              />
                              <span>%</span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'right', padding: '4px 6px' }}>
                            <input
                              type="number"
                              step="0.01"
                              value={item.precoVendaSugerido}
                              onChange={(e) => alterarPrecoVendaItem(index, parseFloat(e.target.value) || 0)}
                              style={{ width: '65px', padding: '3px', textAlign: 'right', borderRadius: '4px', border: '1.5px solid #16a34a', fontWeight: 700, color: '#166534', fontSize: '0.78rem' }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* BOTÕES DE AÇÃO INFERIORES */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={() => setEtapa('upload')}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f1f5f9', color: '#475569', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                ← Voltar
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={resetarModal}
                  style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={dadosNota.itens.filter((i) => i.selecionado).length === 0}
                  onClick={handleConfirmar}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: dadosNota.itens.filter((i) => i.selecionado).length > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>✅</span>
                  <span>Confirmar Entrada no Estoque ({dadosNota.itens.filter((i) => i.selecionado).length} itens)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 3: CONFIRMAÇÃO DE SUCESSO */}
        {etapa === 'sucesso' && resumoSucesso && (
          <div style={{ textAlign: 'center', padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <div style={{ fontSize: '3rem' }}>🎉</div>
            <h3 style={{ margin: 0, color: '#166534', fontSize: '1.2rem' }}>
              Entrada de Estoque Realizada com Sucesso!
            </h3>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem' }}>
              Os produtos foram integrados ao estoque da loja <b>{lojaAtual?.nome}</b>.
            </p>

            <div style={{ background: '#f8fafc', padding: '12px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '340px', textAlign: 'left', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                <span>Itens com estoque somado:</span>
                <b>{resumoSucesso.atualizados} produtos</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: '#16a34a' }}>
                <span>Novos produtos cadastrados:</span>
                <b>+{resumoSucesso.novos} novos</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderTop: '1px solid #e2e8f0', marginTop: '4px', fontWeight: 700 }}>
                <span>Total de itens processados:</span>
                <span>{resumoSucesso.totalItens} itens</span>
              </div>
            </div>

            <button
              type="button"
              onClick={resetarModal}
              style={{
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '9px 22px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '8px',
              }}
            >
              Concluir e Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
