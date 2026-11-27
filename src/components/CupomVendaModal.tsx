import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  FileCode2,
  FileText,
  Package,
  Printer,
  ReceiptText,
  RefreshCw,
  Send,
  Smartphone,
  X,
} from 'lucide-react';
import { Venda, Supermercado } from '../types';
import { imprimirCupomTermico } from '../utils/impressaoTermica';
import { useVoltarHierarquico } from '../hooks/useVoltarHierarquico';

interface CupomVendaModalProps {
  visivel: boolean;
  onFechar: () => void;
  venda: Venda | null;
  loja: Supermercado | null;
  onEmitirNfce?: (venda: Venda, cpfNaNota?: string) => Promise<void> | void;
  onConsultarNfce?: (venda: Venda) => Promise<void> | void;
}

export const CupomVendaModal: React.FC<CupomVendaModalProps> = ({
  visivel,
  onFechar,
  venda,
  loja,
  onEmitirNfce,
  onConsultarNfce,
}) => {
  const [larguraBobina, setLarguraBobina] = useState<'80mm' | '58mm'>('80mm');
  const [cpfInput, setCpfInput] = useState<string>('');
  const [processandoFiscal, setProcessandoFiscal] = useState<boolean>(false);

  useVoltarHierarquico(visivel && Boolean(venda), onFechar);

  useEffect(() => {
    setCpfInput(venda?.cpfNaNota || '');
  }, [venda?.id, venda?.cpfNaNota]);

  if (!visivel || !venda) return null;

  const handleImprimir = () => {
    imprimirCupomTermico(
      'area-impressao-termica',
      larguraBobina,
      `Cupom_Venda_${venda.id.slice(-8).toUpperCase()}`
    );
  };

  const getFormaPagamentoTexto = (forma: string) => {
    switch (forma) {
      case 'pix':
        return 'PIX ONLINE / INSTANTÂNEO';
      case 'cartao_credito':
        return 'CARTÃO DE CRÉDITO';
      case 'cartao_debito':
        return 'CARTÃO DE DÉBITO';
      case 'dinheiro':
        return 'DINHEIRO (ESPÉCIE)';
      case 'fiado':
        return 'CADERNETA / FIADO';
      default:
        return forma.toUpperCase();
    }
  };

  const getFormaPagamentoCurta = (forma: string) => {
    switch (forma) {
      case 'pix':
        return 'PIX Instantâneo';
      case 'cartao_credito':
        return 'Cartão de Crédito';
      case 'cartao_debito':
        return 'Cartão de Débito';
      case 'dinheiro':
        return 'Dinheiro';
      case 'fiado':
        return 'Caderneta / Fiado';
      default:
        return forma;
    }
  };

  const larguraVisual = larguraBobina === '58mm' ? '272px' : '336px';
  const isNfceAutorizada = venda.nfce?.status === 'autorizado';
  const isEstornada = venda.status === 'estornada';
  const totalUnidades = venda.itens.reduce((acc, it) => acc + (Number(it.quantidade) || 0), 0);
  const vendaCodigo = venda.id.slice(-8).toUpperCase();
  const formaPagamentoTexto = getFormaPagamentoTexto(venda.formaPagamento);

  return (
    <div
      className="modal-overlay"
      style={{ zIndex: 100200, padding: '16px' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div
        className="modal-container"
        style={{
          maxWidth: '880px',
          width: '100%',
          maxHeight: '92vh',
          padding: 0,
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#ffffff',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.25)',
        }}
      >
        {/* CABEÇALHO FIXO */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 20px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: isEstornada ? '#fee2e2' : isNfceAutorizada ? '#dcfce7' : '#e0f2fe',
                color: isEstornada ? '#b91c1c' : isNfceAutorizada ? '#166534' : '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ReceiptText size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.2,
                }}
              >
                {isNfceAutorizada ? 'Cupom Fiscal — DANFE NFC-e' : 'Cupom Não Fiscal de Venda'}
              </h3>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginTop: '4px',
                  fontSize: '0.76rem',
                  color: '#475569',
                }}
              >
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Venda #{vendaCodigo}</span>
                <span>•</span>
                <span>
                  {venda.data} às {venda.hora}
                </span>
                {isEstornada ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: '#fee2e2',
                      color: '#b91c1c',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                    }}
                  >
                    <Ban size={11} /> Estornada
                  </span>
                ) : isNfceAutorizada ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: '#dcfce7',
                      color: '#166534',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                    }}
                  >
                    <CheckCircle2 size={11} /> NFC-e Autorizada
                  </span>
                ) : (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: '#e0f2fe',
                      color: '#0369a1',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                    }}
                  >
                    <CheckCircle2 size={11} /> Venda Concluída
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-fechar-modal"
            onClick={onFechar}
            aria-label="Fechar cupom"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* CORPO ROLÁVEL RESPONSIVO (2 COLUNAS NO DESKTOP / 1 NO MOBILE) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: '20px',
              alignItems: 'start',
            }}
          >
            {/* COLUNA ESQUERDA: PRÉ-VISUALIZAÇÃO DO CUPOM TÉRMICO */}
            <div
              style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                className="no-print"
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Printer size={14} />
                <span>Pré-visualização Térmica • Bobina {larguraBobina}</span>
              </div>

              <div
                style={{
                  width: '100%',
                  maxHeight: '54vh',
                  overflowY: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  padding: '2px 0 6px 0',
                }}
              >
                <div
                  id="area-impressao-termica"
                  className="cupom-termico-box"
                  style={{
                    width: larguraVisual,
                    maxWidth: '100%',
                    background: '#ffffff',
                    border: '1px dashed #94a3b8',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)',
                    padding: '12px 10px',
                    fontFamily: "'Courier New', Courier, monospace",
                    fontSize: larguraBobina === '58mm' ? '0.74rem' : '0.8rem',
                    color: '#000000',
                    lineHeight: 1.25,
                  }}
                >
                  {/* CABEÇALHO DO CUPOM */}
                  <div className="cupom-header" style={{ textAlign: 'center' }}>
                    <h4 style={{ margin: '0 0 3px 0', fontSize: '1rem', fontWeight: 800 }}>
                      {loja?.nome || 'SUPERMERCADO'}
                    </h4>
                    <p style={{ margin: '1px 0', fontSize: '0.75rem' }}>
                      CNPJ: {loja?.cnpj || '00.000.000/0001-00'}
                    </p>
                    {loja?.endereco && (
                      <p style={{ margin: '1px 0', fontSize: '0.72rem' }}>{loja.endereco}</p>
                    )}
                    {loja?.telefone && (
                      <p style={{ margin: '1px 0', fontSize: '0.72rem' }}>Tel: {loja.telefone}</p>
                    )}
                    {isNfceAutorizada ? (
                      <div style={{ margin: '4px 0 2px 0' }}>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: '0.78rem' }}>DANFE NFC-e</p>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.66rem' }}>
                          Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica
                        </p>
                      </div>
                    ) : (
                      <p style={{ margin: '4px 0 2px 0', fontWeight: 700, fontSize: '0.76rem' }}>
                        CUPOM NÃO FISCAL DE VENDA
                      </p>
                    )}
                    <div
                      className="cupom-divisor"
                      style={{ borderBottom: '1px dashed #000', margin: '6px 0' }}
                    />
                    <div style={{ textAlign: 'left', fontSize: '0.74rem' }}>
                      <p style={{ margin: '1px 0' }}>
                        <strong>Nº VENDA:</strong> #{vendaCodigo}
                      </p>
                      <p style={{ margin: '1px 0' }}>
                        <strong>DATA/HORA:</strong> {venda.data} {venda.hora}
                      </p>
                      <p style={{ margin: '1px 0' }}>
                        <strong>OPERADOR:</strong> {venda.operadorNome || 'Operador'}
                      </p>
                      {venda.clienteFiadoNome && (
                        <p style={{ margin: '1px 0' }}>
                          <strong>CLIENTE:</strong> {venda.clienteFiadoNome}
                        </p>
                      )}
                      {venda.origem === 'delivery' && (
                        <p style={{ margin: '1px 0' }}>
                          <strong>MODALIDADE:</strong> ENTREGA / DELIVERY
                        </p>
                      )}
                    </div>
                    <div
                      className="cupom-divisor"
                      style={{ borderBottom: '1px dashed #000', margin: '6px 0' }}
                    />
                  </div>

                  {/* TABELA DE ITENS */}
                  <table
                    className="cupom-tabela"
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      margin: '6px 0',
                      fontSize: '0.74rem',
                    }}
                  >
                    <thead>
                      <tr style={{ borderBottom: '1px solid #000' }}>
                        <th style={{ textAlign: 'left', padding: '2px 0' }}>ITEM</th>
                        <th style={{ textAlign: 'center', padding: '2px 0', width: '38px' }}>QTD</th>
                        <th style={{ textAlign: 'right', padding: '2px 0', width: '54px' }}>
                          UN(R$)
                        </th>
                        <th style={{ textAlign: 'right', padding: '2px 0', width: '58px' }}>TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {venda.itens.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px dotted #e2e8f0' }}>
                          <td style={{ textAlign: 'left', padding: '2px 0', wordBreak: 'break-word' }}>
                            <span style={{ fontWeight: 600 }}>{item.nome}</span>
                            {item.codigo && (
                              <span
                                style={{
                                  display: 'block',
                                  fontSize: '0.65rem',
                                  color: '#475569',
                                }}
                              >
                                [{item.codigo}]
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center', padding: '2px 0' }}>
                            {item.quantidade}
                          </td>
                          <td style={{ textAlign: 'right', padding: '2px 0' }}>
                            {item.preco_unitario.toFixed(2)}
                          </td>
                          <td style={{ textAlign: 'right', padding: '2px 0', fontWeight: 600 }}>
                            {item.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div
                    className="cupom-divisor"
                    style={{ borderBottom: '1px dashed #000', margin: '6px 0' }}
                  />

                  {/* TOTAIS E PAGAMENTO */}
                  <div className="cupom-totais" style={{ fontSize: '0.78rem' }}>
                    <div
                      className="cupom-linha-total"
                      style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}
                    >
                      <span>QTD TOTAL DE ITENS:</span>
                      <span>
                        <strong>{totalUnidades} un</strong>
                      </span>
                    </div>

                    {venda.taxaEntrega && venda.taxaEntrega > 0 ? (
                      <div
                        className="cupom-linha-total"
                        style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}
                      >
                        <span>TAXA DE ENTREGA:</span>
                        <span>R$ {venda.taxaEntrega.toFixed(2)}</span>
                      </div>
                    ) : null}

                    {venda.desconto && venda.desconto > 0 ? (
                      <div
                        className="cupom-linha-total"
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          margin: '2px 0',
                          color: '#16a34a',
                        }}
                      >
                        <span>DESCONTO:</span>
                        <span>- R$ {venda.desconto.toFixed(2)}</span>
                      </div>
                    ) : null}

                    <div
                      className="cupom-linha-total"
                      style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}
                    >
                      <span>FORMA DE PGTO:</span>
                      <span>
                        <strong>{getFormaPagamentoTexto(venda.formaPagamento)}</strong>
                      </span>
                    </div>

                    {venda.valorRecebido && venda.valorRecebido > 0 ? (
                      <div
                        className="cupom-linha-total"
                        style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}
                      >
                        <span>VALOR RECEBIDO:</span>
                        <span>R$ {venda.valorRecebido.toFixed(2)}</span>
                      </div>
                    ) : null}

                    {venda.troco && venda.troco > 0 ? (
                      <div
                        className="cupom-linha-total"
                        style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}
                      >
                        <span>TROCO:</span>
                        <span>R$ {venda.troco.toFixed(2)}</span>
                      </div>
                    ) : null}

                    <div
                      className="cupom-linha-total highlight-total"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        margin: '6px 0 2px 0',
                        paddingTop: '6px',
                        borderTop: '1px dashed #000',
                        fontSize: '0.96rem',
                      }}
                    >
                      <span>VALOR TOTAL:</span>
                      <span>
                        <strong>R$ {venda.valorTotal.toFixed(2)}</strong>
                      </span>
                    </div>

                    {isEstornada && (
                      <div
                        style={{
                          color: '#dc2626',
                          fontWeight: 'bold',
                          marginTop: '6px',
                          textAlign: 'center',
                          border: '1px solid #dc2626',
                          padding: '4px',
                        }}
                      >
                        VENDA CANCELADA / ESTORNADA
                      </div>
                    )}
                  </div>

                  {/* DADOS FISCAIS NO CUPOM IMPRESSO QUANDO NFC-E AUTORIZADA */}
                  {isNfceAutorizada && venda.nfce && (
                    <>
                      <div
                        className="cupom-divisor"
                        style={{ borderBottom: '1px dashed #000', margin: '6px 0' }}
                      />
                      <div style={{ textAlign: 'center', fontSize: '0.68rem', lineHeight: 1.3 }}>
                        <div style={{ fontWeight: 800 }}>
                          NFC-e Nº {venda.nfce.numero || '—'} • Série {venda.nfce.serie || '1'}
                        </div>
                        {venda.cpfNaNota && <div>Consumidor CPF/CNPJ: {venda.cpfNaNota}</div>}
                        {venda.nfce.mensagemSefaz && <div>SEFAZ: {venda.nfce.mensagemSefaz}</div>}
                        {venda.nfce.chave && (
                          <div
                            style={{ marginTop: '3px', wordBreak: 'break-all', fontSize: '0.64rem' }}
                          >
                            <b>Chave de Acesso:</b>
                            <br />
                            {venda.nfce.chave}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div
                    className="cupom-divisor"
                    style={{ borderBottom: '1px dashed #000', margin: '6px 0' }}
                  />

                  {/* RODAPÉ */}
                  <div className="cupom-footer" style={{ textAlign: 'center', marginTop: '6px' }}>
                    <p style={{ fontSize: '0.74rem', margin: '2px 0', fontWeight: 600 }}>
                      Obrigado pela preferência!
                    </p>
                    <p style={{ fontSize: '0.64rem', color: '#64748b', margin: '1px 0' }}>
                      Sistema Integrado de Gestão de Supermercados
                    </p>
                    <p style={{ fontSize: '0.62rem', color: '#94a3b8', margin: '1px 0' }}>
                      Impresso em {new Date().toLocaleDateString('pt-BR')} às{' '}
                      {new Date().toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA: RESUMO, LARGURA DA BOBINA E EMISSÃO NFC-E */}
            <div
              className="no-print"
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              {/* CARD RESUMO DA VENDA */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#475569',
                    marginBottom: '10px',
                  }}
                >
                  <Package size={14} />
                  <span>Resumo da Venda</span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                      Valor Total
                    </div>
                    <div
                      style={{
                        fontSize: '1.18rem',
                        fontWeight: 800,
                        color: isEstornada ? '#dc2626' : '#0f172a',
                        marginTop: '2px',
                      }}
                    >
                      R$ {venda.valorTotal.toFixed(2)}
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '10px 12px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: '#64748b',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <CreditCard size={12} />
                      <span>Pagamento e Itens</span>
                    </div>
                    <div
                      style={{
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginTop: '3px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={formaPagamentoTexto}
                    >
                      {getFormaPagamentoCurta(venda.formaPagamento)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1px' }}>
                      {totalUnidades} un ({venda.itens.length}{' '}
                      {venda.itens.length === 1 ? 'item' : 'itens'})
                    </div>
                  </div>
                </div>

                {(venda.clienteFiadoNome ||
                  venda.origem === 'delivery' ||
                  (venda.desconto ?? 0) > 0 ||
                  (venda.taxaEntrega ?? 0) > 0 ||
                  (venda.troco ?? 0) > 0) && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginTop: '10px',
                    }}
                  >
                    {venda.clienteFiadoNome && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#334155',
                        }}
                      >
                        Cliente: {venda.clienteFiadoNome}
                      </span>
                    )}
                    {venda.origem === 'delivery' && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: '#fff7ed',
                          border: '1px solid #fed7aa',
                          color: '#c2410c',
                        }}
                      >
                        Delivery
                      </span>
                    )}
                    {(venda.desconto ?? 0) > 0 && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          color: '#15803d',
                        }}
                      >
                        Desconto: -R$ {venda.desconto!.toFixed(2)}
                      </span>
                    )}
                    {(venda.taxaEntrega ?? 0) > 0 && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          color: '#1d4ed8',
                        }}
                      >
                        Entrega: +R$ {venda.taxaEntrega!.toFixed(2)}
                      </span>
                    )}
                    {(venda.troco ?? 0) > 0 && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#334155',
                        }}
                      >
                        Troco: R$ {venda.troco!.toFixed(2)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* SELETOR DE LARGURA DA IMPRESSORA TÉRMICA */}
              <div
                className="seletor-bobina-termica no-print"
                style={{
                  background: '#f8fafc',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <label
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                  }}
                >
                  <Printer size={14} />
                  <span>Largura da Bobina Térmica</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setLarguraBobina('80mm')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '9px 10px',
                      borderRadius: '8px',
                      border: larguraBobina === '80mm' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                      background: larguraBobina === '80mm' ? '#e0f2fe' : '#ffffff',
                      color: larguraBobina === '80mm' ? '#0369a1' : '#475569',
                      fontWeight: larguraBobina === '80mm' ? 700 : 500,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <FileText size={16} style={{ flexShrink: 0 }} />
                    <span style={{ lineHeight: 1.2 }}>
                      <strong style={{ display: 'block' }}>80mm</strong>
                      <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>Padrão PDV</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLarguraBobina('58mm')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '9px 10px',
                      borderRadius: '8px',
                      border: larguraBobina === '58mm' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                      background: larguraBobina === '58mm' ? '#e0f2fe' : '#ffffff',
                      color: larguraBobina === '58mm' ? '#0369a1' : '#475569',
                      fontWeight: larguraBobina === '58mm' ? 700 : 500,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Smartphone size={16} style={{ flexShrink: 0 }} />
                    <span style={{ lineHeight: 1.2 }}>
                      <strong style={{ display: 'block' }}>58mm</strong>
                      <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>Mini Térmica</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* PAINEL FISCAL NFC-E (FOCUS NFE) */}
              {loja?.configFiscal?.habilitado && (
                <div
                  className="no-print"
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: `1px solid ${
                      venda.nfce?.status === 'autorizado'
                        ? '#86efac'
                        : venda.nfce?.status === 'erro_autorizacao'
                          ? '#fca5a5'
                          : '#bfdbfe'
                    }`,
                    background:
                      venda.nfce?.status === 'autorizado'
                        ? '#f0fdf4'
                        : venda.nfce?.status === 'erro_autorizacao'
                          ? '#fef2f2'
                          : '#eff6ff',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <ReceiptText size={16} color="#0284c7" />
                      <span>Cupom Fiscal Eletrônico (NFC-e)</span>
                    </span>
                    <span
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '999px',
                        letterSpacing: '0.03em',
                        background:
                          loja.configFiscal.ambiente === 'producao' ? '#dcfce7' : '#fef3c7',
                        color: loja.configFiscal.ambiente === 'producao' ? '#166534' : '#92400e',
                        flexShrink: 0,
                      }}
                    >
                      {loja.configFiscal.ambiente === 'producao' ? 'PRODUÇÃO' : 'HOMOLOGAÇÃO'}
                    </span>
                  </div>

                  {venda.nfce?.status === 'autorizado' ? (
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: '#166534',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={15} />
                        <span>
                          <strong>NFC-e Autorizada</strong>
                          {venda.nfce.numero ? ` • Nº ${venda.nfce.numero}` : ''}
                          {venda.nfce.serie ? ` (Série ${venda.nfce.serie})` : ''}
                        </span>
                      </div>

                      {venda.nfce.chave && (
                        <div
                          style={{
                            fontSize: '0.7rem',
                            fontFamily: 'monospace',
                            wordBreak: 'break-all',
                            color: '#334155',
                            background: '#ffffff',
                            border: '1px solid #bbf7d0',
                            borderRadius: '8px',
                            padding: '7px 9px',
                          }}
                        >
                          Chave: {venda.nfce.chave}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                        {venda.nfce.danfeUrl && (
                          <a
                            href={venda.nfce.danfeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              flex: 1,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '9px 12px',
                              borderRadius: '8px',
                              background: '#16a34a',
                              color: '#ffffff',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              textDecoration: 'none',
                            }}
                          >
                            <ExternalLink size={14} />
                            <span>Abrir DANFE NFC-e (SEFAZ)</span>
                          </a>
                        )}
                        {venda.nfce.xmlUrl && (
                          <a
                            href={venda.nfce.xmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '9px 12px',
                              borderRadius: '8px',
                              background: '#ffffff',
                              border: '1px solid #86efac',
                              color: '#166534',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              textDecoration: 'none',
                            }}
                          >
                            <FileCode2 size={14} />
                            <span>XML</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ) : venda.nfce?.status === 'processando_autorizacao' ? (
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: '#1e40af',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={15} />
                        <span>Processando autorização na SEFAZ...</span>
                      </span>
                      {onConsultarNfce && (
                        <button
                          type="button"
                          disabled={processandoFiscal}
                          onClick={async () => {
                            setProcessandoFiscal(true);
                            try {
                              await onConsultarNfce(venda);
                            } finally {
                              setProcessandoFiscal(false);
                            }
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '7px 11px',
                            borderRadius: '8px',
                            border: '1px solid #3b82f6',
                            background: '#ffffff',
                            color: '#1d4ed8',
                            fontWeight: 700,
                            fontSize: '0.74rem',
                            cursor: processandoFiscal ? 'wait' : 'pointer',
                          }}
                        >
                          <RefreshCw size={13} />
                          <span>{processandoFiscal ? 'Consultando...' : 'Atualizar Status'}</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {venda.nfce?.mensagemSefaz && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            padding: '9px 10px',
                            borderRadius: '8px',
                            background: '#ffffff',
                            border: '1px solid #fecaca',
                            color: '#b91c1c',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            lineHeight: 1.35,
                          }}
                        >
                          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
                          <span>{venda.nfce.mensagemSefaz}</span>
                        </div>
                      )}

                      {onEmitirNfce && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label
                            htmlFor={`cpf-nota-${venda.id}`}
                            style={{ fontSize: '0.73rem', fontWeight: 700, color: '#475569' }}
                          >
                            CPF/CNPJ na nota (opcional)
                          </label>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <input
                              id={`cpf-nota-${venda.id}`}
                              name="cpf_cnpj_nota_fiscal"
                              type="text"
                              autoComplete="off"
                              data-lpignore="true"
                              data-1p-ignore="true"
                              value={cpfInput}
                              onChange={(e) => setCpfInput(e.target.value)}
                              placeholder="CPF ou CNPJ (opcional)"
                              style={{
                                flex: '1 1 160px',
                                minWidth: 0,
                                padding: '8px 10px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                background: '#ffffff',
                                color: '#0f172a',
                                fontSize: '0.8rem',
                              }}
                            />
                            <button
                              type="button"
                              disabled={processandoFiscal}
                              onClick={async () => {
                                setProcessandoFiscal(true);
                                try {
                                  await onEmitirNfce(venda, cpfInput.trim() || undefined);
                                } finally {
                                  setProcessandoFiscal(false);
                                }
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                borderRadius: '8px',
                                border: 'none',
                                background: processandoFiscal ? '#60a5fa' : '#2563eb',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                cursor: processandoFiscal ? 'wait' : 'pointer',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <Send size={14} />
                              <span>
                                {processandoFiscal ? 'Emitindo...' : 'Emitir NFC-e Agora'}
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RODAPÉ FIXO (NUNCA CORTADO) */}
        <div
          className="no-print"
          style={{
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            className="btn btn-cancelar"
            style={{
              padding: '10px 18px',
              borderRadius: '9px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontWeight: 600,
              fontSize: '0.86rem',
              cursor: 'pointer',
            }}
            onClick={onFechar}
          >
            Fechar
          </button>

          <button
            type="button"
            className="btn btn-salvar"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#0284c7',
              color: '#ffffff',
              padding: '10px 18px',
              borderRadius: '9px',
              fontWeight: 700,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
            }}
            onClick={handleImprimir}
          >
            <Printer size={17} />
            <span>Imprimir na Impressora Térmica</span>
          </button>
        </div>
      </div>
    </div>
  );
};
