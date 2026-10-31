import React, { useState, useRef } from 'react';
import { ItemEstoque, Supermercado } from '../types';

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
  // Campos de conciliação com o estoque
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

export const EntradaNotaFiscalModal: React.FC<EntradaNotaFiscalModalProps> = ({
  visivel,
  onFechar,
  lojaAtual,
  estoque = [],
  onConfirmarEntradaEstoque,
}) => {
  const [etapa, setEtapa] = useState<'upload' | 'revisao' | 'sucesso'>('upload');
  const [carregandoXML, setCarregandoXML] = useState(false);
  const [erroUpload, setErroUpload] = useState<string | null>(null);
  const [dadosNota, setDadosNota] = useState<DadosNotaFiscal | null>(null);
  const [margemPadraoGlobal, setMargemPadraoGlobal] = useState<number>(35);
  const [resumoSucesso, setResumoSucesso] = useState<{ atualizados: number; novos: number; totalItens: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!visivel) return null;

  // Parser robusto de XML de NF-e da SEFAZ (Modelo 55 e 65)
  const processarArquivoXML = (conteudoXML: string) => {
    try {
      setCarregandoXML(true);
      setErroUpload(null);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(conteudoXML, 'application/xml');

      // Verifica erro de parse no XML
      const parseError = xmlDoc.getElementsByTagName('parsererror');
      if (parseError.length > 0) {
        throw new Error('O arquivo selecionado não é um XML válido ou está corrompido.');
      }

      // Procura tag de identificação da NF-e
      const ide = xmlDoc.getElementsByTagName('ide')[0];
      const emit = xmlDoc.getElementsByTagName('emit')[0];
      const total = xmlDoc.getElementsByTagName('total')[0];
      const infNFe = xmlDoc.getElementsByTagName('infNFe')[0];

      if (!ide || !emit) {
        throw new Error('Este arquivo XML não possui a estrutura padrão de NF-e (Nota Fiscal Eletrônica).');
      }

      // Função auxiliar para ler tag XML sem se perder com namespaces
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

      // Extrai itens de detalhe (<det>)
      const detList = Array.from(xmlDoc.getElementsByTagName('det'));
      if (detList.length === 0) {
        throw new Error('Nenhum item ou produto foi encontrado no corpo deste XML.');
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

        // Tenta associar com o estoque da loja (por código de barras EAN ou código interno)
        const produtoExistente = estoque.find((e) => {
          const codE = String(e.codigo || '').trim();
          const codB = String(e.codigo_barras || '').trim();
          if (cEANLimpo && (codE === cEANLimpo || codB === cEANLimpo)) return true;
          if (codE === cProd) return true;
          return false;
        });

        // Margem de lucro padrão
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
        itens: itensProcessados,
      });

      setEtapa('revisao');
    } catch (err: any) {
      console.error('Erro ao ler XML de NF-e:', err);
      setErroUpload(err?.message || 'Falha ao processar o arquivo XML da nota fiscal.');
    } finally {
      setCarregandoXML(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.xml')) {
      setErroUpload('Por favor, selecione um arquivo no formato XML da NF-e (.xml).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        processarArquivoXML(text);
      }
    };
    reader.onerror = () => {
      setErroUpload('Erro ao abrir o arquivo no seu dispositivo.');
    };
    reader.readAsText(file, 'UTF-8');
  };

  // Alterar seleção individual de item
  const alternarSelecaoItem = (index: number) => {
    if (!dadosNota) return;
    const novos = [...dadosNota.itens];
    novos[index].selecionado = !novos[index].selecionado;
    setDadosNota({ ...dadosNota, itens: novos });
  };

  // Alterar quantidade individual a ser dada entrada
  const alterarQtdEntrada = (index: number, val: number) => {
    if (!dadosNota) return;
    const novos = [...dadosNota.itens];
    novos[index].quantidadeEntrada = Math.max(0, val);
    setDadosNota({ ...dadosNota, itens: novos });
  };

  // Alterar margem de lucro e recalcular preço sugerido
  const alterarMargemItem = (index: number, novaMargem: number) => {
    if (!dadosNota) return;
    const novos = [...dadosNota.itens];
    novos[index].margemLucroPorcentagem = novaMargem;
    novos[index].precoVendaSugerido = Number(
      (novos[index].precoCustoFinal * (1 + novaMargem / 100)).toFixed(2)
    );
    setDadosNota({ ...dadosNota, itens: novos });
  };

  // Alterar preço sugerido e recalcular margem
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

  // Aplicar margem global em todos os itens
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
    setDadosNota(null);
    setErroUpload(null);
    setEtapa('upload');
    setResumoSucesso(null);
    onFechar();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 100100 }}>
      <div
        className="modal-container"
        style={{
          maxWidth: etapa === 'revisao' ? '820px' : '520px',
          width: '95vw',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
        }}
      >
        {/* CABEÇALHO DO MODAL */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#0369a1', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📥</span>
              <span>Entrada de Nota Fiscal (XML / NF-e)</span>
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Loja: <b>{lojaAtual?.nome || 'Loja Principal'}</b>
            </span>
          </div>
          <button className="btn-fechar-modal" onClick={resetarModal}>&times;</button>
        </div>

        {/* ETAPA 1: UPLOAD DO ARQUIVO XML */}
        {etapa === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #0284c7',
                borderRadius: '12px',
                padding: '36px 20px',
                textAlign: 'center',
                background: '#f0f9ff',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '2.8rem', marginBottom: '10px' }}>📄</div>
              <h4 style={{ margin: '0 0 6px 0', color: '#0369a1', fontSize: '1.05rem' }}>
                Clique aqui para selecionar o arquivo XML da NF-e
              </h4>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
                Suporta qualquer arquivo <b>.xml</b> emitido por distribuidoras, atacadistas e fábricas (Ambev, Coca-Cola, etc.)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xml,text/xml"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            {carregandoXML && (
              <div style={{ textAlign: 'center', color: '#0284c7', fontWeight: 600, fontSize: '0.9rem' }}>
                ⏳ Lendo e processando dados da NF-e...
              </div>
            )}

            {erroUpload && (
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                ⚠️ {erroUpload}
              </div>
            )}

            {/* EXPLICAÇÃO DIDÁTICA DO FUNCIONAMENTO */}
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                💡 O que o sistema faz ao importar a nota?
              </div>
              <div>• <b>Identifica os produtos:</b> Faz o cruzamento automático com os códigos de barras do seu estoque.</div>
              <div>• <b>Atualiza quantidades:</b> Soma os itens que chegaram ao saldo atual sem você precisar contar na mão.</div>
              <div>• <b>Recalcula custo e venda:</b> Aplica sua margem de lucro (%) desejada para sugerir o preço de venda certo.</div>
            </div>
          </div>
        )}

        {/* ETAPA 2: REVISÃO DE ITENS, DE-PARA E DEFINIÇÃO DE MARGENS */}
        {etapa === 'revisao' && dadosNota && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflow: 'hidden' }}>
            {/* CABEÇALHO RESUMO DA NOTA */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: '#64748b' }}>Fornecedor:</span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{dadosNota.fornecedorNome}</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>CNPJ: {dadosNota.fornecedorCNPJ} ({dadosNota.fornecedorUF})</div>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Nota Fiscal:</span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>Nº {dadosNota.numeroNF} • Série {dadosNota.serie}</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Emissão: {dadosNota.dataEmissao}</div>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Valor Total da NF:</span>
                <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '1.05rem' }}>
                  R$ {dadosNota.valorTotalNF.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{dadosNota.itens.length} produtos listados</div>
              </div>
            </div>

            {/* APLICAÇÃO DE MARGEM EM MASSA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4', padding: '8px 12px', borderRadius: '8px', border: '1px solid #bbf7d0', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 600 }}>
                ⚡ Aplicar Margem de Lucro Padrão em Todos os Itens:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="number"
                  value={margemPadraoGlobal}
                  onChange={(e) => setMargemPadraoGlobal(Number(e.target.value) || 0)}
                  style={{ width: '65px', padding: '4px 6px', borderRadius: '4px', border: '1px solid #86efac', fontWeight: 700, textAlign: 'center', fontSize: '0.85rem' }}
                />
                <span style={{ fontWeight: 700, color: '#166534' }}>%</span>
                <button
                  type="button"
                  onClick={() => aplicarMargemGlobal(margemPadraoGlobal)}
                  style={{ background: '#16a34a', color: '#ffffff', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Aplicar em Todos
                </button>
              </div>
            </div>

            {/* TABELA DE PRODUTOS DA NOTA */}
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#ffffff' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr>
                    <th style={{ width: '30px', padding: '8px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={dadosNota.itens.every((it) => it.selecionado)}
                        onChange={(e) => {
                          const marcar = e.target.checked;
                          setDadosNota({
                            ...dadosNota,
                            itens: dadosNota.itens.map((it) => ({ ...it, selecionado: marcar })),
                          });
                        }}
                      />
                    </th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Produto na NF / Código</th>
                    <th style={{ textAlign: 'center', padding: '8px', width: '90px' }}>Status</th>
                    <th style={{ textAlign: 'center', padding: '8px', width: '90px' }}>Qtd Entrada</th>
                    <th style={{ textAlign: 'right', padding: '8px', width: '80px' }}>Custo (R$)</th>
                    <th style={{ textAlign: 'center', padding: '8px', width: '85px' }}>Margem (%)</th>
                    <th style={{ textAlign: 'right', padding: '8px', width: '90px' }}>Preço Venda</th>
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
                            {item.cEAN ? `EAN: ${item.cEAN}` : `Cód Fornec: ${item.cProd}`} • Un: {item.uCom}
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
                        <td style={{ textAlign: 'center', padding: '6px' }}>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={item.quantidadeEntrada}
                            onChange={(e) => alterarQtdEntrada(index, parseFloat(e.target.value) || 0)}
                            style={{ width: '60px', padding: '3px', textAlign: 'center', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                          />
                        </td>
                        <td style={{ textAlign: 'right', padding: '6px 8px', fontWeight: 600, color: '#475569' }}>
                          R$ {item.precoCustoFinal.toFixed(2)}
                        </td>
                        <td style={{ textAlign: 'center', padding: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                            <input
                              type="number"
                              step="0.1"
                              value={item.margemLucroPorcentagem}
                              onChange={(e) => alterarMargemItem(index, parseFloat(e.target.value) || 0)}
                              style={{ width: '50px', padding: '3px', textAlign: 'center', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', fontWeight: 600 }}
                            />
                            <span>%</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', padding: '6px 8px' }}>
                          <input
                            type="number"
                            step="0.01"
                            value={item.precoVendaSugerido}
                            onChange={(e) => alterarPrecoVendaItem(index, parseFloat(e.target.value) || 0)}
                            style={{ width: '70px', padding: '3px', textAlign: 'right', borderRadius: '4px', border: '1.5px solid #16a34a', fontWeight: 700, color: '#166534', fontSize: '0.78rem' }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* BOTÕES DE AÇÃO INFERIORES */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              <button
                type="button"
                onClick={() => setEtapa('upload')}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f1f5f9', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                ← Escolher Outro XML
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={resetarModal}
                  style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmar}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)',
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
          <div style={{ textAlign: 'center', padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
            <div style={{ fontSize: '3.5rem' }}>🎉</div>
            <h3 style={{ margin: 0, color: '#166534', fontSize: '1.25rem' }}>
              Entrada de Estoque Realizada com Sucesso!
            </h3>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}>
              Os produtos foram integrados ao estoque da loja <b>{lojaAtual?.nome}</b>.
            </p>

            <div style={{ background: '#f8fafc', padding: '14px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '360px', textAlign: 'left', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>Itens com estoque somado:</span>
                <b>{resumoSucesso.atualizados} produtos</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#16a34a' }}>
                <span>Novos produtos cadastrados:</span>
                <b>+{resumoSucesso.novos} novos</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderTop: '1px solid #e2e8f0', marginTop: '4px', fontWeight: 700 }}>
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
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '10px',
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
