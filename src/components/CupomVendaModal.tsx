import React, { useState } from 'react';
import { Venda, Supermercado } from '../types';
import { imprimirCupomTermico } from '../utils/impressaoTermica';

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
      case 'pix': return 'PIX ONLINE / INSTANTÂNEO';
      case 'cartao_credito': return 'CARTÃO DE CRÉDITO';
      case 'cartao_debito': return 'CARTÃO DE DÉBITO';
      case 'dinheiro': return 'DINHEIRO (ESPÉCIE)';
      case 'fiado': return 'CADERNETA / FIADO';
      default: return forma.toUpperCase();
    }
  };

  const larguraVisual = larguraBobina === '58mm' ? '280px' : '340px';

  const isNfceAutorizada = venda.nfce?.status === 'autorizado';

  return (
    <div className="modal-overlay" style={{ zIndex: 100200 }}>
      <div className="modal-container" style={{ maxWidth: '440px', padding: '18px', maxHeight: '92vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
            {isNfceAutorizada ? '🧾 Cupom Fiscal — DANFE NFC-e' : '🧾 Cupom Não Fiscal de Venda'}
          </h3>
          <button className="btn-fechar-modal" onClick={onFechar}>&times;</button>
        </div>

        {/* SELETOR DE LARGURA DA IMPRESSORA TÉRMICA */}
        <div className="seletor-bobina-termica no-print" style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
            🖨️ Largura da Bobina Térmica:
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setLarguraBobina('80mm')}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '6px',
                border: larguraBobina === '80mm' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                background: larguraBobina === '80mm' ? '#e0f2fe' : '#ffffff',
                color: larguraBobina === '80mm' ? '#0369a1' : '#475569',
                fontWeight: larguraBobina === '80mm' ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              📄 Bobina 80mm (Padrão PDV)
            </button>
            <button
              type="button"
              onClick={() => setLarguraBobina('58mm')}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '6px',
                border: larguraBobina === '58mm' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                background: larguraBobina === '58mm' ? '#e0f2fe' : '#ffffff',
                color: larguraBobina === '58mm' ? '#0369a1' : '#475569',
                fontWeight: larguraBobina === '58mm' ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              📱 Bobina 58mm (Mini Térmica)
            </button>
          </div>
        </div>

        {/* CONTAINER DO CUPOM TÉRMICO FORMATADO PARA IMPRESSÃO */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            id="area-impressao-termica"
            className="cupom-termico-box"
            style={{
              width: larguraVisual,
              maxWidth: '100%',
              background: '#ffffff',
              border: '1px dashed #94a3b8',
              padding: '12px 10px',
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: larguraBobina === '58mm' ? '0.74rem' : '0.8rem',
              color: '#000000',
              lineHeight: 1.25,
            }}
          >
            {/* CABEÇALHO */}
            <div className="cupom-header" style={{ textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 3px 0', fontSize: '1rem', fontWeight: 800 }}>{loja?.nome || 'SUPERMERCADO'}</h4>
              <p style={{ margin: '1px 0', fontSize: '0.75rem' }}>CNPJ: {loja?.cnpj || '00.000.000/0001-00'}</p>
              {loja?.endereco && <p style={{ margin: '1px 0', fontSize: '0.72rem' }}>{loja.endereco}</p>}
              {loja?.telefone && <p style={{ margin: '1px 0', fontSize: '0.72rem' }}>Tel: {loja.telefone}</p>}
              {isNfceAutorizada ? (
                <div style={{ margin: '4px 0 2px 0' }}>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: '0.78rem' }}>DANFE NFC-e</p>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.66rem' }}>
                    Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica
                  </p>
                </div>
              ) : (
                <p style={{ margin: '4px 0 2px 0', fontWeight: 700, fontSize: '0.76rem' }}>CUPOM NÃO FISCAL DE VENDA</p>
              )}
              <div className="cupom-divisor" style={{ borderBottom: '1px dashed #000', margin: '6px 0' }} />
              <div style={{ textAlign: 'left', fontSize: '0.74rem' }}>
                <p style={{ margin: '1px 0' }}><strong>Nº VENDA:</strong> #{venda.id.slice(-8).toUpperCase()}</p>
                <p style={{ margin: '1px 0' }}><strong>DATA/HORA:</strong> {venda.data} {venda.hora}</p>
                <p style={{ margin: '1px 0' }}><strong>OPERADOR:</strong> {venda.operadorNome || 'Operador'}</p>
                {venda.clienteFiadoNome && (
                  <p style={{ margin: '1px 0' }}><strong>CLIENTE:</strong> {venda.clienteFiadoNome}</p>
                )}
                {venda.origem === 'delivery' && (
                  <p style={{ margin: '1px 0' }}><strong>MODALIDADE:</strong> ENTREGA / DELIVERY 🛵</p>
                )}
              </div>
              <div className="cupom-divisor" style={{ borderBottom: '1px dashed #000', margin: '6px 0' }} />
            </div>

            {/* TABELA DE ITENS */}
            <table className="cupom-tabela" style={{ width: '100%', borderCollapse: 'collapse', margin: '6px 0', fontSize: '0.74rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #000' }}>
                  <th style={{ textAlign: 'left', padding: '2px 0' }}>ITEM</th>
                  <th style={{ textAlign: 'center', padding: '2px 0', width: '38px' }}>QTD</th>
                  <th style={{ textAlign: 'right', padding: '2px 0', width: '54px' }}>UN(R$)</th>
                  <th style={{ textAlign: 'right', padding: '2px 0', width: '58px' }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {venda.itens.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px dotted #e2e8f0' }}>
                    <td style={{ textAlign: 'left', padding: '2px 0', wordBreak: 'break-word' }}>
                      <span style={{ fontWeight: 600 }}>{item.nome}</span>
                      {item.codigo && (
                        <span style={{ display: 'block', fontSize: '0.65rem', color: '#475569' }}>
                          [{item.codigo}]
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', padding: '2px 0' }}>{item.quantidade}</td>
                    <td style={{ textAlign: 'right', padding: '2px 0' }}>{item.preco_unitario.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', padding: '2px 0', fontWeight: 600 }}>{item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cupom-divisor" style={{ borderBottom: '1px dashed #000', margin: '6px 0' }} />

            {/* TOTAIS E PAGAMENTO */}
            <div className="cupom-totais" style={{ fontSize: '0.78rem' }}>
              <div className="cupom-linha-total" style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                <span>QTD TOTAL DE ITENS:</span>
                <span><strong>{venda.itens.reduce((acc, it) => acc + (it.quantidade || 0), 0)} un</strong></span>
              </div>

              {venda.taxaEntrega && venda.taxaEntrega > 0 ? (
                <div className="cupom-linha-total" style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                  <span>TAXA DE ENTREGA:</span>
                  <span>R$ {venda.taxaEntrega.toFixed(2)}</span>
                </div>
              ) : null}

              {venda.desconto && venda.desconto > 0 ? (
                <div className="cupom-linha-total" style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0', color: '#16a34a' }}>
                  <span>DESCONTO:</span>
                  <span>- R$ {venda.desconto.toFixed(2)}</span>
                </div>
              ) : null}

              <div className="cupom-linha-total" style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                <span>FORMA DE PGTO:</span>
                <span><strong>{getFormaPagamentoTexto(venda.formaPagamento)}</strong></span>
              </div>

              {venda.valorRecebido && venda.valorRecebido > 0 ? (
                <div className="cupom-linha-total" style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                  <span>VALOR RECEBIDO:</span>
                  <span>R$ {venda.valorRecebido.toFixed(2)}</span>
                </div>
              ) : null}

              {venda.troco && venda.troco > 0 ? (
                <div className="cupom-linha-total" style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
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
                <span><strong>R$ {venda.valorTotal.toFixed(2)}</strong></span>
              </div>

              {venda.status === 'estornada' && (
                <div style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '6px', textAlign: 'center', border: '1px solid #dc2626', padding: '4px' }}>
                  ⚠️ VENDA CANCELADA / ESTORNADA
                </div>
              )}
            </div>

            {/* DADOS FISCAIS NO CUPOM IMPRESSO QUANDO NFC-E AUTORIZADA */}
            {isNfceAutorizada && venda.nfce && (
              <>
                <div className="cupom-divisor" style={{ borderBottom: '1px dashed #000', margin: '6px 0' }} />
                <div style={{ textAlign: 'center', fontSize: '0.68rem', lineHeight: 1.3 }}>
                  <div style={{ fontWeight: 800 }}>
                    NFC-e Nº {venda.nfce.numero || '—'} • Série {venda.nfce.serie || '1'}
                  </div>
                  {venda.cpfNaNota && <div>Consumidor CPF/CNPJ: {venda.cpfNaNota}</div>}
                  {venda.nfce.mensagemSefaz && <div>SEFAZ: {venda.nfce.mensagemSefaz}</div>}
                  {venda.nfce.chave && (
                    <div style={{ marginTop: '3px', wordBreak: 'break-all', fontSize: '0.64rem' }}>
                      <b>Chave de Acesso:</b><br />
                      {venda.nfce.chave}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="cupom-divisor" style={{ borderBottom: '1px dashed #000', margin: '6px 0' }} />

            {/* RODAPÉ */}
            <div className="cupom-footer" style={{ textAlign: 'center', marginTop: '6px' }}>
              <p style={{ fontSize: '0.74rem', margin: '2px 0', fontWeight: 600 }}>Obrigado pela preferência!</p>
              <p style={{ fontSize: '0.64rem', color: '#64748b', margin: '1px 0' }}>
                Sistema Integrado de Gestão de Supermercados
              </p>
              <p style={{ fontSize: '0.62rem', color: '#94a3b8', margin: '1px 0' }}>
                Impresso em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>

        {/* PAINEL FISCAL NFC-E (FOCUS NFE) */}
        {loja?.configFiscal?.habilitado && (
          <div
            className="no-print"
            style={{
              marginTop: '14px',
              padding: '12px',
              borderRadius: '10px',
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                🧾 Cupom Fiscal Eletrônico (NFC-e)
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '999px',
                  background: loja.configFiscal.ambiente === 'producao' ? '#dcfce7' : '#fef3c7',
                  color: loja.configFiscal.ambiente === 'producao' ? '#166534' : '#92400e',
                }}
              >
                {loja.configFiscal.ambiente === 'producao' ? 'PRODUÇÃO' : 'HOMOLOGAÇÃO'}
              </span>
            </div>

            {venda.nfce?.status === 'autorizado' ? (
              <div style={{ fontSize: '0.76rem', color: '#166534', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>
                  ✅ <b>NFC-e Autorizada</b>
                  {venda.nfce.numero ? ` • Nº ${venda.nfce.numero}` : ''}
                  {venda.nfce.serie ? ` (Série ${venda.nfce.serie})` : ''}
                </div>
                {venda.nfce.chave && (
                  <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', wordBreak: 'break-all', color: '#334155' }}>
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
                        textAlign: 'center',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        background: '#16a34a',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        textDecoration: 'none',
                      }}
                    >
                      🖨️ Abrir DANFE NFC-e (SEFAZ)
                    </a>
                  )}
                  {venda.nfce.xmlUrl && (
                    <a
                      href={venda.nfce.xmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        background: '#ffffff',
                        border: '1px solid #86efac',
                        color: '#166534',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        textDecoration: 'none',
                      }}
                    >
                      📄 XML
                    </a>
                  )}
                </div>
              </div>
            ) : venda.nfce?.status === 'processando_autorizacao' ? (
              <div style={{ fontSize: '0.76rem', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span>⏳ Processando autorização na SEFAZ...</span>
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
                      padding: '6px 10px',
                      borderRadius: '7px',
                      border: '1px solid #3b82f6',
                      background: '#ffffff',
                      color: '#1d4ed8',
                      fontWeight: 700,
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                    }}
                  >
                    {processandoFiscal ? '⏳...' : '🔄 Atualizar'}
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {venda.nfce?.mensagemSefaz && (
                  <div style={{ fontSize: '0.74rem', color: '#b91c1c', fontWeight: 600 }}>
                    ⚠️ {venda.nfce.mensagemSefaz}
                  </div>
                )}
                {onEmitirNfce && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={cpfInput || venda.cpfNaNota || ''}
                      onChange={(e) => setCpfInput(e.target.value)}
                      placeholder="CPF/CNPJ na nota (opcional)"
                      style={{
                        flex: '1 1 150px',
                        padding: '7px 9px',
                        borderRadius: '7px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.78rem',
                      }}
                    />
                    <button
                      type="button"
                      disabled={processandoFiscal}
                      onClick={async () => {
                        setProcessandoFiscal(true);
                        try {
                          await onEmitirNfce(venda, (cpfInput || venda.cpfNaNota || '').trim() || undefined);
                        } finally {
                          setProcessandoFiscal(false);
                        }
                      }}
                      style={{
                        padding: '7px 12px',
                        borderRadius: '7px',
                        border: 'none',
                        background: '#2563eb',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: processandoFiscal ? 'wait' : 'pointer',
                      }}
                    >
                      {processandoFiscal ? '⏳ Emitindo...' : '🧾 Emitir NFC-e Agora'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* BOTOES DE AÇÃO */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }} className="no-print">
          <button
            className="btn btn-salvar"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#0284c7',
              color: '#ffffff',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.92rem',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={handleImprimir}
          >
            🖨️ Imprimir na Impressora Térmica
          </button>
          <button
            className="btn btn-cancelar"
            style={{
              padding: '12px 18px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#f1f5f9',
              color: '#475569',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={onFechar}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
