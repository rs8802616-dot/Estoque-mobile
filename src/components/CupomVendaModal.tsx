import React, { useState } from 'react';
import { Venda, Supermercado } from '../types';

interface CupomVendaModalProps {
  visivel: boolean;
  onFechar: () => void;
  venda: Venda | null;
  loja: Supermercado | null;
}

export const CupomVendaModal: React.FC<CupomVendaModalProps> = ({
  visivel,
  onFechar,
  venda,
  loja,
}) => {
  const [larguraBobina, setLarguraBobina] = useState<'80mm' | '58mm'>('80mm');

  if (!visivel || !venda) return null;

  const handleImprimir = () => {
    // Injeta estilo CSS específico de impressão térmica no documento para garantir
    // que a impressora de bobina (Epson, Elgin, Bematech, POS-80, POS-58) imprima
    // em folha única contínua SEM gerar 2ª página em branco e SEM margens de folha A4.
    let estilo = document.getElementById('estilo-impressao-termica-dinamico');
    if (!estilo) {
      estilo = document.createElement('style');
      estilo.id = 'estilo-impressao-termica-dinamico';
      document.head.appendChild(estilo);
    }

    const larguraPage = larguraBobina === '58mm' ? '58mm' : '80mm';
    const larguraUtil = larguraBobina === '58mm' ? '52mm' : '74mm';
    const tamanhoFonte = larguraBobina === '58mm' ? '9.5px' : '11px';

    estilo.innerHTML = `
      @media print {
        @page {
          size: ${larguraPage} auto !important;
          margin: 0mm !important;
        }
        html, body {
          width: ${larguraPage} !important;
          max-width: ${larguraPage} !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          color: #000000 !important;
          height: auto !important;
          min-height: 0 !important;
          overflow: visible !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body * {
          visibility: hidden !important;
        }
        #area-impressao-termica,
        #area-impressao-termica * {
          visibility: visible !important;
        }
        #area-impressao-termica {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: ${larguraUtil} !important;
          max-width: ${larguraUtil} !important;
          margin: 0 auto !important;
          padding: 2mm 1mm 4mm 1mm !important;
          box-sizing: border-box !important;
          font-family: 'Courier New', Courier, monospace !important;
          font-size: ${tamanhoFonte} !important;
          line-height: 1.25 !important;
          color: #000000 !important;
          background: #ffffff !important;
          page-break-inside: avoid !important;
          page-break-after: avoid !important;
          page-break-before: avoid !important;
          break-inside: avoid !important;
        }
        .cupom-divisor {
          border-bottom: 1px dashed #000000 !important;
          height: 1px !important;
          margin: 4px 0 !important;
          line-height: 1px !important;
          overflow: hidden !important;
          color: transparent !important;
        }
        .modal-overlay, .modal-container {
          position: static !important;
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
          width: auto !important;
          height: auto !important;
          overflow: visible !important;
        }
        .no-print, button, .btn-fechar-modal, .seletor-bobina-termica {
          display: none !important;
        }
      }
    `;

    setTimeout(() => {
      window.print();
    }, 60);
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

  return (
    <div className="modal-overlay" style={{ zIndex: 100200 }}>
      <div className="modal-container" style={{ maxWidth: '440px', padding: '18px', maxHeight: '92vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
            🧾 Cupom Não Fiscal de Venda
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
              <p style={{ margin: '4px 0 2px 0', fontWeight: 700, fontSize: '0.76rem' }}>CUPOM NÃO FISCAL DE VENDA</p>
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
