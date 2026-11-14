import React, { useState, useMemo } from 'react';
import { ItemCarrinho, ClienteDevedor } from '../types';

type FormaPagamentoPdv = 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'fiado';

interface CaixaPdvLateralPanelProps {
  carrinho: ItemCarrinho[];
  onAlterarQuantidade: (itemId: string, novaQtd: number) => void;
  onRemoverItem: (itemId: string) => void;
  onLimparCarrinho: () => void;
  onFinalizarVenda: (formaPagamento: FormaPagamentoPdv, clienteFiadoId?: string) => void;
  clientesDevedores: ClienteDevedor[];
  onAbrirCadastroCliente: () => void;
  sessaoCaixaAberta: boolean;
  onAbrirCaixaModal: () => void;
  obterFotoProduto?: (codigo: string) => string | undefined;
  onAbrirLeitorCameraContinuo?: () => void;
  ultimoItemBipadoToast?: string | null;
}

const FORMAS_PAGAMENTO: { id: FormaPagamentoPdv; label: string; icon: string }[] = [
  { id: 'pix', label: 'PIX', icon: '📱' },
  { id: 'dinheiro', label: 'Dinheiro', icon: '💵' },
  { id: 'cartao_credito', label: 'Crédito', icon: '💳' },
  { id: 'cartao_debito', label: 'Débito', icon: '🏧' },
  { id: 'fiado', label: 'Fiado', icon: '📒' },
];

export const CaixaPdvLateralPanel: React.FC<CaixaPdvLateralPanelProps> = ({
  carrinho,
  onAlterarQuantidade,
  onRemoverItem,
  onLimparCarrinho,
  onFinalizarVenda,
  clientesDevedores,
  onAbrirCadastroCliente,
  sessaoCaixaAberta,
  onAbrirCaixaModal,
  obterFotoProduto,
  onAbrirLeitorCameraContinuo,
  ultimoItemBipadoToast,
}) => {
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamentoPdv>('pix');
  const [clienteFiadoId, setClienteFiadoId] = useState<string>('');
  const [valorRecebidoDinheiro, setValorRecebidoDinheiro] = useState<string>('');

  const totalVenda = useMemo(
    () => carrinho.reduce((acc, item) => acc + (item.subtotal || item.preco_unitario * item.quantidade), 0),
    [carrinho]
  );

  const totalUnidades = useMemo(
    () => carrinho.reduce((acc, item) => acc + item.quantidade, 0),
    [carrinho]
  );

  const valorRecebidoNum = parseFloat(valorRecebidoDinheiro.replace(',', '.'));
  const trocoCalculado =
    formaPagamento === 'dinheiro' && !isNaN(valorRecebidoNum) && valorRecebidoNum > totalVenda
      ? valorRecebidoNum - totalVenda
      : 0;

  const podeFinalizar =
    sessaoCaixaAberta &&
    carrinho.length > 0 &&
    (formaPagamento !== 'fiado' || Boolean(clienteFiadoId));

  const handleFinalizar = () => {
    if (!sessaoCaixaAberta) {
      onAbrirCaixaModal();
      return;
    }
    if (!podeFinalizar) return;
    onFinalizarVenda(formaPagamento, formaPagamento === 'fiado' ? clienteFiadoId : undefined);
    setValorRecebidoDinheiro('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        border: '1px solid #cbd5e1',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
        overflow: 'hidden',
      }}
    >
      {/* CABEÇALHO DO CAIXA PDV */}
      <div
        style={{
          padding: '10px 12px',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={onAbrirCaixaModal}
          title={sessaoCaixaAberta ? 'Caixa aberto — clique para gerenciar' : 'Caixa fechado — clique para abrir'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '999px',
            border: `1px solid ${sessaoCaixaAberta ? '#86efac' : '#fca5a5'}`,
            background: sessaoCaixaAberta ? '#dcfce7' : '#fee2e2',
            color: sessaoCaixaAberta ? '#166534' : '#991b1b',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <span>{sessaoCaixaAberta ? '🟢 Caixa Aberto' : '🔴 Caixa Fechado'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {onAbrirLeitorCameraContinuo && (
            <button
              type="button"
              onClick={onAbrirLeitorCameraContinuo}
              title="Bipar produtos pela câmera"
              style={{
                padding: '5px 9px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#0f172a',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              📷 Bipar
            </button>
          )}
          {carrinho.length > 0 && (
            <button
              type="button"
              onClick={onLimparCarrinho}
              title="Limpar todos os itens do carrinho"
              style={{
                padding: '5px 9px',
                borderRadius: '8px',
                border: '1px solid #fecaca',
                background: '#fff1f2',
                color: '#be123c',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🗑️ Limpar
            </button>
          )}
        </div>
      </div>

      {/* TOAST DE ÚLTIMO ITEM BIPADO */}
      {ultimoItemBipadoToast && (
        <div
          style={{
            padding: '6px 12px',
            background: '#ecfdf5',
            borderBottom: '1px solid #a7f3d0',
            color: '#065f46',
            fontSize: '12px',
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          ✅ {ultimoItemBipadoToast}
        </div>
      )}

      {/* LISTA DE ITENS DA VENDA */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: '#f8fafc',
        }}
      >
        {carrinho.length === 0 ? (
          <div
            style={{
              margin: 'auto',
              textAlign: 'center',
              padding: '28px 16px',
              color: '#64748b',
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🛒</div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#334155', marginBottom: '4px' }}>
              Caixa Livre
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.45 }}>
              Clique em <strong>+ Carrinho</strong> nos produtos ao lado ou bipe o código de barras para iniciar a venda.
            </div>
          </div>
        ) : (
          carrinho.map((item) => {
            const foto = obterFotoProduto?.(item.codigo) || item.foto;
            const subtotal = item.subtotal || item.preco_unitario * item.quantidade;
            return (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                {foto ? (
                  <img
                    src={foto}
                    alt={item.nome}
                    style={{
                      width: '38px',
                      height: '38px',
                      objectFit: 'contain',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      border: '1px solid #f1f5f9',
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '6px',
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      flexShrink: 0,
                    }}
                  >
                    📦
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 700,
                      color: '#0f172a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={item.nome}
                  >
                    {item.nome}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                    R$ {item.preco_unitario.toFixed(2).replace('.', ',')} un
                  </div>
                </div>

                {/* CONTROLES DE QUANTIDADE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => onAlterarQuantidade(item.id, Number((item.quantidade - 1).toFixed(3)))}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      color: '#0f172a',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: 'pointer',
                      lineHeight: 1,
                    }}
                    title="Diminuir quantidade"
                  >
                    −
                  </button>
                  <span
                    style={{
                      minWidth: '24px',
                      textAlign: 'center',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      color: '#0f172a',
                    }}
                  >
                    {Number.isInteger(item.quantidade) ? item.quantidade : item.quantidade.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onAlterarQuantidade(item.id, Number((item.quantidade + 1).toFixed(3)))}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      color: '#0f172a',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: 'pointer',
                      lineHeight: 1,
                    }}
                    title="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>

                {/* SUBTOTAL + REMOVER */}
                <div style={{ textAlign: 'right', minWidth: '64px', flexShrink: 0 }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>
                    R$ {subtotal.toFixed(2).replace('.', ',')}
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoverItem(item.id)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#ef4444',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      marginTop: '1px',
                    }}
                  >
                    Remover
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RODAPÉ: FORMA DE PAGAMENTO + TOTAL + FINALIZAR */}
      <div
        style={{
          padding: '12px',
          borderTop: '1px solid #cbd5e1',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          flexShrink: 0,
        }}
      >
        {/* SELETOR RÁPIDO DE FORMA DE PAGAMENTO */}
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '6px',
            }}
          >
            Forma de Pagamento
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: '5px',
            }}
          >
            {FORMAS_PAGAMENTO.map((fp) => {
              const ativo = formaPagamento === fp.id;
              return (
                <button
                  key={fp.id}
                  type="button"
                  onClick={() => setFormaPagamento(fp.id)}
                  style={{
                    padding: '6px 4px',
                    borderRadius: '8px',
                    border: `1.5px solid ${ativo ? '#2563eb' : '#e2e8f0'}`,
                    background: ativo ? '#eff6ff' : '#f8fafc',
                    color: ativo ? '#1d4ed8' : '#334155',
                    fontSize: '11px',
                    fontWeight: ativo ? 800 : 600,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <span style={{ fontSize: '14px', lineHeight: 1 }}>{fp.icon}</span>
                  <span>{fp.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TROCO OPCIONAL QUANDO DINHEIRO */}
        {formaPagamento === 'dinheiro' && carrinho.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '6px 10px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
            }}
          >
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>
              Recebido (R$):
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder={totalVenda.toFixed(2).replace('.', ',')}
              value={valorRecebidoDinheiro}
              onChange={(e) => setValorRecebidoDinheiro(e.target.value)}
              style={{
                width: '90px',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '12.5px',
                fontWeight: 700,
                textAlign: 'right',
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 700, color: trocoCalculado > 0 ? '#15803d' : '#64748b' }}>
              Troco: R$ {trocoCalculado.toFixed(2).replace('.', ',')}
            </span>
          </div>
        )}

        {/* SELETOR DE CLIENTE QUANDO FIADO */}
        {formaPagamento === 'fiado' && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <select
              value={clienteFiadoId}
              onChange={(e) => setClienteFiadoId(e.target.value)}
              style={{
                flex: 1,
                padding: '7px 8px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '12.5px',
                background: '#ffffff',
              }}
            >
              <option value="">Selecione o cliente do Fiado...</option>
              {clientesDevedores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} {c.telefone ? `(${c.telefone})` : ''}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onAbrirCadastroCliente}
              style={{
                padding: '7px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              + Cliente
            </button>
          </div>
        )}

        {/* RESUMO DO TOTAL */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            paddingTop: '2px',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
            Total ({Number.isInteger(totalUnidades) ? totalUnidades : totalUnidades.toFixed(2)} {totalUnidades === 1 ? 'item' : 'itens'})
          </span>
          <span style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>
            R$ {totalVenda.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {/* BOTÃO PRINCIPAL FINALIZAR / ABRIR CAIXA */}
        {!sessaoCaixaAberta ? (
          <button
            type="button"
            onClick={onAbrirCaixaModal}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: '#f59e0b',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            🔓 Abrir Caixa para Vender
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinalizar}
            disabled={!podeFinalizar}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: podeFinalizar ? '#16a34a' : '#cbd5e1',
              color: podeFinalizar ? '#ffffff' : '#64748b',
              fontSize: '14.5px',
              fontWeight: 800,
              cursor: podeFinalizar ? 'pointer' : 'not-allowed',
              boxShadow: podeFinalizar ? '0 4px 12px rgba(22, 163, 74, 0.25)' : 'none',
            }}
          >
            ✅ Finalizar Venda
          </button>
        )}
      </div>
    </div>
  );
};
