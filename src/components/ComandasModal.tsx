import React, { useMemo, useRef, useState } from 'react';
import { ComandaLocal, ItemComanda, ItemEstoque, PagamentoComanda, Supermercado } from '../types';
import { imprimirCupomTermico } from '../utils/impressaoTermica';
import { obterDataLocalISO } from '../lib/dateUtils';
import { useVoltarHierarquico } from '../hooks/useVoltarHierarquico';

type FormaPagamentoComanda = 'pix' | 'dinheiro' | 'cartao_credito' | 'cartao_debito';

export interface ComandasPanelProps {
  comandas: ComandaLocal[];
  estoque: ItemEstoque[];
  loja: Supermercado | null;
  sessaoCaixaAberta: boolean;
  onAbrirCaixaModal: () => void;
  onCriarComanda: (dados: { nomeCliente: string; mesaOuReferencia?: string; telefone?: string }) => ComandaLocal;
  onAtualizarComanda: (comanda: ComandaLocal) => void;
  onFecharComandaComVenda: (
    comanda: ComandaLocal,
    formaPagamento: FormaPagamentoComanda,
    opcoesFiscais?: { emitirNfce?: boolean; cpfNaNota?: string }
  ) => void;
  onCancelarComanda: (comandaId: string) => void;
  obterFotoProduto?: (codigo: string) => string | undefined;
  modoLateral?: boolean;
  onExpandir?: () => void;
  comandaSelecionadaId?: string | null;
  onSelectComandaId?: (id: string | null) => void;
  visaoLateral?: 'lista' | 'detalhe';
  onChangeVisaoLateral?: (visao: 'lista' | 'detalhe') => void;
  onAbrirLeitorCamera?: () => void;
  voltarInternoRef?: React.MutableRefObject<(() => boolean) | null>;
}

interface ComandasModalProps extends Omit<ComandasPanelProps, 'modoLateral' | 'onExpandir'> {
  visivel: boolean;
  onFechar: () => void;
}

const FORMAS_PAGAMENTO: { id: FormaPagamentoComanda; label: string; icon: string }[] = [
  { id: 'pix', label: 'PIX', icon: '📱' },
  { id: 'dinheiro', label: 'Dinheiro', icon: '💵' },
  { id: 'cartao_credito', label: 'Crédito', icon: '💳' },
  { id: 'cartao_debito', label: 'Débito', icon: '🏧' },
];

export const ComandasPanel: React.FC<ComandasPanelProps> = ({
  comandas,
  estoque,
  loja,
  sessaoCaixaAberta,
  onAbrirCaixaModal,
  onCriarComanda,
  onAtualizarComanda,
  onFecharComandaComVenda,
  onCancelarComanda,
  obterFotoProduto,
  modoLateral = false,
  onExpandir,
  comandaSelecionadaId: comandaSelecionadaIdProp,
  onSelectComandaId,
  visaoLateral: visaoLateralProp,
  onChangeVisaoLateral,
  onAbrirLeitorCamera,
  voltarInternoRef,
}) => {
  const [filtroStatus, setFiltroStatus] = useState<'aberta' | 'fechada'>('aberta');
  const [buscaComanda, setBuscaComanda] = useState<string>('');
  const [comandaSelecionadaLocalId, setComandaSelecionadaLocalId] = useState<string | null>(null);
  const comandaSelecionadaId = comandaSelecionadaIdProp !== undefined ? comandaSelecionadaIdProp : comandaSelecionadaLocalId;
  const setComandaSelecionadaId = (id: string | null) => {
    setComandaSelecionadaLocalId(id);
    onSelectComandaId?.(id);
  };
  const [visaoLateralLocal, setVisaoLateralLocal] = useState<'lista' | 'detalhe'>('lista');
  const visaoLateral = visaoLateralProp !== undefined ? visaoLateralProp : visaoLateralLocal;
  const setVisaoLateral = (v: 'lista' | 'detalhe') => {
    setVisaoLateralLocal(v);
    onChangeVisaoLateral?.(v);
  };

  // Nova comanda
  const [formNovaAberto, setFormNovaAberto] = useState<boolean>(false);
  const [novoNomeCliente, setNovoNomeCliente] = useState<string>('');
  const [novaMesa, setNovaMesa] = useState<string>('');
  const [novoTelefone, setNovoTelefone] = useState<string>('');

  // Busca de produtos para lançar na comanda
  const [buscaProduto, setBuscaProduto] = useState<string>('');

  // Pagamento / Baixa
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamentoComanda>('pix');
  const [valorPagamentoStr, setValorPagamentoStr] = useState<string>('');
  const [nomePagador, setNomePagador] = useState<string>('');
  const [emitirNfce, setEmitirNfce] = useState<boolean>(Boolean(loja?.configFiscal?.emitirAutomaticoNoPdv));
  const [cpfNaNota, setCpfNaNota] = useState<string>('');

  // Impressão térmica
  const [larguraBobina] = useState<'80mm' | '58mm'>('80mm');
  const [mostrarPagParcial, setMostrarPagParcial] = useState<boolean>(false);

  if (voltarInternoRef) {
    voltarInternoRef.current = () => {
      if (formNovaAberto) {
        setFormNovaAberto(false);
        return true;
      }
      if (mostrarPagParcial) {
        setMostrarPagParcial(false);
        return true;
      }
      if (modoLateral && visaoLateral === 'detalhe') {
        setVisaoLateral('lista');
        return true;
      }
      return false;
    };
  }

  const comandasFiltradas = useMemo(() => {
    const termo = buscaComanda.trim().toLowerCase();
    return comandas
      .filter((c) => c.status === filtroStatus)
      .filter((c) => {
        if (!termo) return true;
        return (
          c.nomeCliente.toLowerCase().includes(termo) ||
          (c.mesaOuReferencia || '').toLowerCase().includes(termo) ||
          String(c.numeroComanda).includes(termo)
        );
      });
  }, [comandas, filtroStatus, buscaComanda]);

  const comandaAtiva = useMemo(() => {
    const encontrada = comandas.find((c) => c.id === comandaSelecionadaId);
    if (encontrada) return encontrada;
    return comandasFiltradas[0] || null;
  }, [comandas, comandaSelecionadaId, comandasFiltradas]);

  const produtosFiltrados = useMemo(() => {
    const termo = buscaProduto.trim().toLowerCase();
    const disponiveis = estoque.filter((p) => p.estoqueIlimitado || p.tipoCadastro === 'interno' || (p.quantidade || 0) > 0);
    if (!termo) return disponiveis.slice(0, 12);
    return disponiveis
      .filter(
        (p) =>
          (p.nome || '').toLowerCase().includes(termo) ||
          (p.codigo || '').toLowerCase().includes(termo) ||
          (p.marca || '').toLowerCase().includes(termo)
      )
      .slice(0, 20);
  }, [estoque, buscaProduto]);

  const totalAbertas = comandas.filter((c) => c.status === 'aberta').length;

  const handleCriarNovaComanda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNomeCliente.trim()) {
      alert('Informe o nome do cliente para abrir a comanda.');
      return;
    }
    const criada = onCriarComanda({
      nomeCliente: novoNomeCliente.trim(),
      mesaOuReferencia: novaMesa.trim() || undefined,
      telefone: novoTelefone.trim() || undefined,
    });
    setComandaSelecionadaId(criada.id);
    setVisaoLateral('detalhe');
    setFiltroStatus('aberta');
    setFormNovaAberto(false);
    setNovoNomeCliente('');
    setNovaMesa('');
    setNovoTelefone('');
  };

  const recalcularComanda = (cmd: ComandaLocal, novosItens: ItemComanda[]): ComandaLocal => {
    const valorTotal = Number(
      novosItens.reduce((acc, it) => acc + it.preco_unitario * it.quantidade, 0).toFixed(2)
    );
    return {
      ...cmd,
      itens: novosItens,
      valorTotal,
    };
  };

  const handleAdicionarProdutoNaComanda = (prod: ItemEstoque) => {
    if (!comandaAtiva || comandaAtiva.status !== 'aberta') return;
    const jaExisteIdx = comandaAtiva.itens.findIndex(
      (it) => it.codigo === prod.codigo && (it.lote || '') === (prod.lote || '')
    );

    const novosItens = [...comandaAtiva.itens];
    if (jaExisteIdx >= 0) {
      const atual = novosItens[jaExisteIdx];
      const novaQtd = atual.quantidade + 1;
      if (!prod.estoqueIlimitado && prod.tipoCadastro !== 'interno' && novaQtd > (prod.quantidade || 0)) {
        alert(`Estoque disponível insuficiente para "${prod.nome}" (Máx: ${prod.quantidade}).`);
        return;
      }
      novosItens[jaExisteIdx] = {
        ...atual,
        quantidade: novaQtd,
        subtotal: Number((novaQtd * atual.preco_unitario).toFixed(2)),
      };
    } else {
      novosItens.push({
        id: `itcmd_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        codigo: prod.codigo,
        nome: prod.nome,
        quantidade: 1,
        preco_unitario: prod.preco_venda || 0,
        preco_custo: prod.preco_custo,
        subtotal: Number((prod.preco_venda || 0).toFixed(2)),
        lote: prod.lote,
        validade: prod.validade,
        tipoCadastro: prod.tipoCadastro,
        estoqueIlimitado: prod.estoqueIlimitado,
        adicionadoEm: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      });
    }

    onAtualizarComanda(recalcularComanda(comandaAtiva, novosItens));
  };

  const handleAlterarQtdItem = (itemId: string, delta: number) => {
    if (!comandaAtiva || comandaAtiva.status !== 'aberta') return;
    const alvo = comandaAtiva.itens.find((i) => i.id === itemId);
    if (!alvo) return;

    const novaQtd = Number((alvo.quantidade + delta).toFixed(3));
    if (novaQtd <= 0) {
      const filtrados = comandaAtiva.itens.filter((i) => i.id !== itemId);
      onAtualizarComanda(recalcularComanda(comandaAtiva, filtrados));
      return;
    }

    const prodEst = estoque.find((p) => p.codigo === alvo.codigo);
    if (
      prodEst &&
      !prodEst.estoqueIlimitado &&
      prodEst.tipoCadastro !== 'interno' &&
      novaQtd > (prodEst.quantidade || 0)
    ) {
      alert(`Estoque disponível máximo para "${alvo.nome}": ${prodEst.quantidade}`);
      return;
    }

    const atualizados = comandaAtiva.itens.map((i) =>
      i.id === itemId
        ? { ...i, quantidade: novaQtd, subtotal: Number((novaQtd * i.preco_unitario).toFixed(2)) }
        : i
    );
    onAtualizarComanda(recalcularComanda(comandaAtiva, atualizados));
  };

  const handleAlterarDivisaoPessoas = (qtd: number) => {
    if (!comandaAtiva) return;
    const clamped = Math.max(1, Math.min(50, Math.round(qtd || 1)));
    onAtualizarComanda({
      ...comandaAtiva,
      qtdPessoasDivisao: clamped,
    });
  };

  const handleImprimirComanda = () => {
    if (!comandaAtiva) return;
    imprimirCupomTermico(
      'area-impressao-comanda',
      larguraBobina,
      `Comanda_${comandaAtiva.numeroComanda}_${comandaAtiva.nomeCliente.replace(/\s+/g, '_')}`
    );
  };

  const saldoRestante = comandaAtiva
    ? Math.max(0, Number((comandaAtiva.valorTotal - (comandaAtiva.valorPago || 0)).toFixed(2)))
    : 0;
  const pessoasDivisao = Math.max(1, comandaAtiva?.qtdPessoasDivisao || 1);
  const valorPorPessoaTotal = comandaAtiva ? comandaAtiva.valorTotal / pessoasDivisao : 0;
  const valorPorPessoaRestante = saldoRestante / pessoasDivisao;

  const handleRegistrarPagamento = () => {
    if (!comandaAtiva || comandaAtiva.status !== 'aberta') return;
    if (comandaAtiva.itens.length === 0) {
      alert('Adicione pelo menos 1 produto na comanda antes de fechar.');
      return;
    }
    if (!sessaoCaixaAberta) {
      alert('⚠️ Caixa fechado! Abra o turno de caixa para dar baixa na comanda.');
      onAbrirCaixaModal();
      return;
    }

    const valorDigitado = parseFloat(valorPagamentoStr.replace(',', '.'));
    const valorAReceber = !isNaN(valorDigitado) && valorDigitado > 0 ? Math.min(valorDigitado, saldoRestante) : saldoRestante;

    if (valorAReceber <= 0) {
      alert('Informe um valor válido para receber.');
      return;
    }

    const agora = new Date();
    const novoPag: PagamentoComanda = {
      id: `pagcmd_${Date.now()}`,
      pagador: nomePagador.trim() || undefined,
      valor: Number(valorAReceber.toFixed(2)),
      formaPagamento,
      data: obterDataLocalISO(agora),
      hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    const novoValorPago = Number(((comandaAtiva.valorPago || 0) + valorAReceber).toFixed(2));
    const quitouTudo = novoValorPago >= comandaAtiva.valorTotal - 0.01;

    const comandaAtualizada: ComandaLocal = {
      ...comandaAtiva,
      pagamentos: [...(comandaAtiva.pagamentos || []), novoPag],
      valorPago: novoValorPago,
    };

    setValorPagamentoStr('');
    setNomePagador('');

    if (quitouTudo) {
      onFecharComandaComVenda(
        comandaAtualizada,
        formaPagamento,
        loja?.configFiscal?.habilitado ? { emitirNfce, cpfNaNota: cpfNaNota.trim() || undefined } : undefined
      );
      setCpfNaNota('');
      if (modoLateral) {
        setVisaoLateral('lista');
      }
    } else {
      onAtualizarComanda(comandaAtualizada);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        height: modoLateral ? '100%' : undefined,
        minHeight: 0,
        display: 'grid',
        gridTemplateColumns: modoLateral ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        overflow: 'hidden',
        backgroundColor: modoLateral ? '#ffffff' : 'transparent',
        borderRadius: modoLateral ? '14px' : undefined,
        border: modoLateral ? '1px solid #cbd5e1' : undefined,
        boxShadow: modoLateral ? '0 4px 16px rgba(15, 23, 42, 0.06)' : undefined,
      }}
    >
      {/* COLUNA ESQUERDA: LISTA DE COMANDAS */}
      {(!modoLateral || visaoLateral === 'lista') && (
      <div
        style={{
          borderRight: modoLateral ? 'none' : '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {modoLateral && (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>🍽️ Comandas / Mesas</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  background: '#dcfce7',
                  color: '#166534',
                  padding: '2px 7px',
                  borderRadius: '999px',
                }}
              >
                {totalAbertas} abertas
              </span>
            </div>
            {onExpandir && (
              <button
                type="button"
                onClick={onExpandir}
                title="Abrir em tela cheia"
                style={{
                  padding: '4px 8px',
                  borderRadius: '7px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                ⛶ Expandir
              </button>
            )}
          </div>
        )}
            <div style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setFormNovaAberto((v) => !v)}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: '9px',
                    border: 'none',
                    background: '#16a34a',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                  }}
                >
                  {formNovaAberto ? '✕ Fechar Formulário' : '➕ Abrir Nova Comanda'}
                </button>
              </div>

              {formNovaAberto && (
                <form
                  onSubmit={handleCriarNovaComanda}
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: '10px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '7px',
                  }}
                >
                  <input
                    type="text"
                    name="comanda_nome_cliente"
                    autoComplete="off"
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    value={novoNomeCliente}
                    onChange={(e) => setNovoNomeCliente(e.target.value)}
                    placeholder="Nome do cliente * (ex: João)"
                    autoFocus
                    style={{
                      padding: '8px 10px',
                      borderRadius: '7px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.84rem',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      name="comanda_mesa_ref"
                      autoComplete="off"
                      data-form-type="other"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      value={novaMesa}
                      onChange={(e) => setNovaMesa(e.target.value)}
                      placeholder="Mesa / Local (ex: Mesa 03)"
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '7px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.82rem',
                      }}
                    />
                    <input
                      type="text"
                      value={novoTelefone}
                      onChange={(e) => setNovoTelefone(e.target.value)}
                      placeholder="Telefone (opcional)"
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '7px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.82rem',
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#15803d',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                    }}
                  >
                    ✓ Confirmar Abertura
                  </button>
                </form>
              )}

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setFiltroStatus('aberta')}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: '8px',
                    border: filtroStatus === 'aberta' ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                    background: filtroStatus === 'aberta' ? '#eff6ff' : '#f8fafc',
                    color: filtroStatus === 'aberta' ? '#1d4ed8' : '#64748b',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  🟢 Abertas ({comandas.filter((c) => c.status === 'aberta').length})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroStatus('fechada')}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: '8px',
                    border: filtroStatus === 'fechada' ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                    background: filtroStatus === 'fechada' ? '#eff6ff' : '#f8fafc',
                    color: filtroStatus === 'fechada' ? '#1d4ed8' : '#64748b',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  ✅ Fechadas ({comandas.filter((c) => c.status === 'fechada').length})
                </button>
              </div>

              <form
                role="search"
                autoComplete="off"
                onSubmit={(e) => e.preventDefault()}
                style={{ margin: 0, display: 'flex', width: '100%' }}
              >
                <input
                  type="search"
                  name="filtro_comanda_pesquisa"
                  role="searchbox"
                  aria-autocomplete="none"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  inputMode="search"
                  enterKeyHint="search"
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  value={buscaComanda}
                  onChange={(e) => setBuscaComanda(e.target.value)}
                  placeholder="🔍 Buscar comanda por nome ou mesa..."
                  style={{
                    flex: 1,
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    background: '#f8fafc',
                  }}
                />
              </form>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {comandasFiltradas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '28px 14px', color: '#94a3b8', fontSize: '0.84rem' }}>
                  {filtroStatus === 'aberta'
                    ? 'Nenhuma comanda aberta no momento. Clique em "➕ Abrir Nova Comanda".'
                    : 'Nenhuma comanda fechada registrada.'}
                </div>
              ) : (
                comandasFiltradas.map((cmd) => {
                  const selecionada = comandaAtiva?.id === cmd.id;
                  const falta = Math.max(0, cmd.valorTotal - (cmd.valorPago || 0));
                  return (
                    <div
                      key={cmd.id}
                      onClick={() => {
                        setComandaSelecionadaId(cmd.id);
                        setVisaoLateral('detalhe');
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '11px',
                        border: selecionada ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: selecionada ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                          #{String(cmd.numeroComanda).padStart(2, '0')} • {cmd.nomeCliente}
                        </span>
                        <span style={{ fontWeight: 900, fontSize: '0.9rem', color: '#15803d' }}>
                          R$ {cmd.valorTotal.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.73rem', color: '#64748b' }}>
                        <span>
                          {cmd.mesaOuReferencia ? `${cmd.mesaOuReferencia} • ` : ''}
                          {cmd.itens.reduce((a, b) => a + b.quantidade, 0)} un
                          {(cmd.qtdPessoasDivisao || 1) > 1 ? ` • ÷ ${cmd.qtdPessoasDivisao} pessoas` : ''}
                        </span>
                        {cmd.status === 'aberta' && (cmd.valorPago || 0) > 0 && (
                          <span style={{ color: '#b45309', fontWeight: 700 }}>
                            Falta R$ {falta.toFixed(2).replace('.', ',')}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
      )}

          {/* COLUNA DIREITA: DETALHES DA COMANDA ATIVA */}
      {(!modoLateral || visaoLateral === 'detalhe') && (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto', padding: '12px', gap: '12px', background: '#f8fafc' }}>
            {modoLateral && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setVisaoLateral('lista')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ← Lista de Comandas
                </button>
                {onExpandir && (
                  <button
                    type="button"
                    onClick={onExpandir}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#334155',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ⛶ Expandir
                  </button>
                )}
              </div>
            )}
            {!comandaAtiva ? (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🧾</div>
                <p style={{ fontWeight: 700, margin: 0 }}>Selecione uma comanda ou abra uma nova para começar.</p>
              </div>
            ) : (
              <>
                {/* CABEÇALHO COMPACTO DA COMANDA */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      #{String(comandaAtiva.numeroComanda).padStart(2, '0')} • {comandaAtiva.nomeCliente}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {comandaAtiva.mesaOuReferencia ? `${comandaAtiva.mesaOuReferencia} • ` : ''}
                      {new Date(comandaAtiva.abertaEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    {comandaAtiva.status === 'aberta' && onAbrirLeitorCamera && (
                      <button
                        type="button"
                        onClick={onAbrirLeitorCamera}
                        title="Bipar produto com a câmera para esta comanda"
                        style={{
                          padding: '6px 9px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#0f172a',
                          fontWeight: 700,
                          fontSize: '0.76rem',
                          cursor: 'pointer',
                        }}
                      >
                        📷 Bipar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleImprimirComanda}
                      title="Imprimir conferência da comanda"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#0284c7',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                      }}
                    >
                      🖨️ Imprimir
                    </button>
                    {comandaAtiva.status === 'aberta' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Cancelar a comanda de ${comandaAtiva.nomeCliente}?`)) {
                            onCancelarComanda(comandaAtiva.id);
                            if (modoLateral) {
                              setVisaoLateral('lista');
                            }
                          }
                        }}
                        title="Cancelar comanda"
                        style={{
                          padding: '6px 8px',
                          borderRadius: '8px',
                          border: '1px solid #fecaca',
                          background: '#fef2f2',
                          color: '#dc2626',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                        }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>

                {/* BUSCA LIMPA PARA ADICIONAR PRODUTO (MOSTRA RESULTADOS SÓ AO DIGITAR) */}
                {comandaAtiva.status === 'aberta' && (
                  <div style={{ position: 'relative' }}>
                    <form
                      role="search"
                      autoComplete="off"
                      onSubmit={(e) => e.preventDefault()}
                      style={{ display: 'flex', gap: '6px', alignItems: 'center', margin: 0 }}
                    >
                      <input
                        type="search"
                        name="filtro_produto_comanda_pesquisa"
                        role="searchbox"
                        aria-autocomplete="none"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        inputMode="search"
                        enterKeyHint="search"
                        data-form-type="other"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        value={buscaProduto}
                        onChange={(e) => setBuscaProduto(e.target.value)}
                        placeholder="🔍 Adicionar produto (nome ou código)..."
                        style={{
                          flex: 1,
                          padding: '9px 12px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '0.84rem',
                          boxSizing: 'border-box',
                        }}
                      />
                      {buscaProduto.trim() && (
                        <button
                          type="button"
                          onClick={() => setBuscaProduto('')}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#64748b',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </form>

                    {buscaProduto.trim().length > 0 && (
                      <div
                        style={{
                          marginTop: '6px',
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '10px',
                          maxHeight: '190px',
                          overflowY: 'auto',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        {produtosFiltrados.length === 0 ? (
                          <div style={{ padding: '10px 12px', fontSize: '0.8rem', color: '#94a3b8' }}>
                            Nenhum produto encontrado.
                          </div>
                        ) : (
                          produtosFiltrados.slice(0, 8).map((prod) => (
                            <button
                              key={`${prod.codigo}_${prod.lote || ''}`}
                              type="button"
                              onClick={() => {
                                handleAdicionarProdutoNaComanda(prod);
                                setBuscaProduto('');
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                                padding: '8px 12px',
                                border: 'none',
                                borderBottom: '1px solid #f1f5f9',
                                background: '#ffffff',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                            >
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {prod.nome}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#15803d' }}>
                                  R$ {(prod.preco_venda || 0).toFixed(2).replace('.', ',')}
                                </span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#2563eb' }}>+</span>
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ITENS CONSUMIDOS */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Itens ({comandaAtiva.itens.length})
                  </div>
                  {comandaAtiva.itens.length === 0 ? (
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', padding: '8px 0' }}>
                      Use a busca acima para lançar produtos nesta comanda.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {comandaAtiva.itens.map((it) => {
                        const horaLimpa = it.adicionadoEm?.includes('T')
                          ? new Date(it.adicionadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                          : it.adicionadoEm;
                        return (
                          <div
                            key={it.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '8px',
                              padding: '6px 0',
                              borderBottom: '1px solid #f1f5f9',
                            }}
                          >
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{it.nome}</div>
                              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                R$ {it.preco_unitario.toFixed(2).replace('.', ',')} un{horaLimpa ? ` • ${horaLimpa}` : ''}
                              </div>
                            </div>
                            {comandaAtiva.status === 'aberta' ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleAlterarQtdItem(it.id, -1)}
                                  style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 800, cursor: 'pointer' }}
                                >
                                  -
                                </button>
                                <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 800, fontSize: '0.82rem' }}>{it.quantidade}</span>
                                <button
                                  type="button"
                                  onClick={() => handleAlterarQtdItem(it.id, 1)}
                                  style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 800, cursor: 'pointer' }}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>{it.quantidade}x</span>
                            )}
                            <div style={{ minWidth: '68px', textAlign: 'right', fontWeight: 800, fontSize: '0.84rem', color: '#0f172a' }}>
                              R$ {it.subtotal.toFixed(2).replace('.', ',')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* PAGAMENTOS JÁ REGISTRADOS (SÓ QUANDO HOUVER) */}
                {comandaAtiva.pagamentos && comandaAtiva.pagamentos.length > 0 && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '8px 12px', fontSize: '0.75rem' }}>
                    <div style={{ fontWeight: 800, color: '#166534', marginBottom: '4px' }}>Pagamentos parciais</div>
                    {comandaAtiva.pagamentos.map((p) => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#14532d' }}>
                        <span>
                          {p.pagador ? `${p.pagador} • ` : ''}
                          {p.formaPagamento.toUpperCase()} ({p.hora})
                        </span>
                        <b>R$ {p.valor.toFixed(2).replace('.', ',')}</b>
                      </div>
                    ))}
                  </div>
                )}

                {/* RESUMO, DIVISÃO POR PESSOAS & FECHAMENTO UNIFICADO */}
                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* TOTAL + DIVISÃO COMPACTA */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>
                        {(comandaAtiva.valorPago || 0) > 0
                          ? `Total R$ ${comandaAtiva.valorTotal.toFixed(2).replace('.', ',')} • Pago R$ ${(comandaAtiva.valorPago || 0).toFixed(2).replace('.', ',')}`
                          : 'Total da Comanda'}
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                        R$ {saldoRestante.toFixed(2).replace('.', ',')}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569' }}>👥 Dividir:</span>
                        <button
                          type="button"
                          onClick={() => handleAlterarDivisaoPessoas(Math.max(1, pessoasDivisao - 1))}
                          style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 800, cursor: 'pointer' }}
                        >
                          -
                        </button>
                        <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 800, fontSize: '0.84rem', color: '#1d4ed8' }}>
                          {pessoasDivisao}x
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAlterarDivisaoPessoas(pessoasDivisao + 1)}
                          style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 800, cursor: 'pointer' }}
                        >
                          +
                        </button>
                      </div>
                      {pessoasDivisao > 1 && (
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1d4ed8' }}>
                          R$ {valorPorPessoaTotal.toFixed(2).replace('.', ',')} / pessoa
                        </div>
                      )}
                    </div>
                  </div>

                  {comandaAtiva.status === 'aberta' && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
                        {FORMAS_PAGAMENTO.map((fp) => (
                          <button
                            key={fp.id}
                            type="button"
                            onClick={() => setFormaPagamento(fp.id)}
                            style={{
                              padding: '7px 4px',
                              borderRadius: '8px',
                              border: formaPagamento === fp.id ? '2px solid #16a34a' : '1px solid #cbd5e1',
                              background: formaPagamento === fp.id ? '#dcfce7' : '#f8fafc',
                              color: formaPagamento === fp.id ? '#166534' : '#334155',
                              fontWeight: 700,
                              fontSize: '0.74rem',
                              cursor: 'pointer',
                            }}
                          >
                            {fp.icon} {fp.label}
                          </button>
                        ))}
                      </div>

                      {mostrarPagParcial && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <input
                            type="text"
                            value={nomePagador}
                            onChange={(e) => setNomePagador(e.target.value)}
                            placeholder="Nome de quem paga (opcional)"
                            style={{ flex: '1 1 130px', padding: '7px 9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                          />
                          <input
                            type="text"
                            value={valorPagamentoStr}
                            onChange={(e) => setValorPagamentoStr(e.target.value)}
                            placeholder={`Valor (padrão ${saldoRestante.toFixed(2).replace('.', ',')})`}
                            style={{ flex: '1 1 110px', padding: '7px 9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', fontWeight: 700 }}
                          />
                        </div>
                      )}

                      {loja?.configFiscal?.habilitado && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', background: '#eff6ff', padding: '6px 10px', borderRadius: '8px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', fontWeight: 700, color: '#1e3a8a', cursor: 'pointer' }}>
                            <input type="checkbox" checked={emitirNfce} onChange={(e) => setEmitirNfce(e.target.checked)} />
                            <span>🧾 Emitir NFC-e ao quitar</span>
                          </label>
                          {emitirNfce && (
                            <input
                              type="text"
                              value={cpfNaNota}
                              onChange={(e) => setCpfNaNota(e.target.value)}
                              placeholder="CPF/CNPJ na nota (opcional)"
                              style={{ flex: 1, minWidth: '140px', padding: '5px 8px', borderRadius: '6px', border: '1px solid #bfdbfe', fontSize: '0.75rem' }}
                            />
                          )}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {pessoasDivisao > 1 && (() => {
                          const valorUmaParte = Number(Math.min(saldoRestante, valorPorPessoaTotal).toFixed(2));
                          return (
                          <button
                            type="button"
                            onClick={() => {
                              setValorPagamentoStr(valorUmaParte.toFixed(2).replace('.', ','));
                              setMostrarPagParcial(true);
                            }}
                            style={{
                              padding: '10px 10px',
                              borderRadius: '9px',
                              border: '1px solid #93c5fd',
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              fontWeight: 800,
                              fontSize: '0.76rem',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            1 Parte (R$ {valorUmaParte.toFixed(2).replace('.', ',')})
                          </button>
                          );
                        })()}
                        <button
                          type="button"
                          onClick={handleRegistrarPagamento}
                          style={{
                            flex: 1,
                            padding: '10px 12px',
                            borderRadius: '9px',
                            border: 'none',
                            background: '#16a34a',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                          }}
                        >
                          ✅ {valorPagamentoStr.trim() ? 'Receber Valor' : `Fechar Comanda (R$ ${saldoRestante.toFixed(2).replace('.', ',')})`}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setMostrarPagParcial((v) => !v)}
                        style={{
                          alignSelf: 'center',
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0,
                          textDecoration: 'underline',
                        }}
                      >
                        {mostrarPagParcial ? 'Ocultar pagamento parcial' : 'Informar pagamento parcial / nome do pagador'}
                      </button>
                    </>
                  )}
                </div>

                {/* ÁREA OCULTA PARA IMPRESSÃO TÉRMICA DA COMANDA */}
                <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                  <div id="area-impressao-comanda" style={{ width: larguraBobina === '58mm' ? '260px' : '320px', fontFamily: 'monospace', fontSize: '12px', color: '#000' }}>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>{loja?.nome || 'ESTABELECIMENTO'}</div>
                    <div style={{ textAlign: 'center', marginBottom: '6px' }}>CONFERÊNCIA DE COMANDA</div>
                    <hr />
                    <div><b>COMANDA:</b> #{String(comandaAtiva.numeroComanda).padStart(2, '0')}</div>
                    <div><b>CLIENTE:</b> {comandaAtiva.nomeCliente}</div>
                    {comandaAtiva.mesaOuReferencia && <div><b>MESA/REF:</b> {comandaAtiva.mesaOuReferencia}</div>}
                    <div><b>ABERTURA:</b> {new Date(comandaAtiva.abertaEm).toLocaleString('pt-BR')}</div>
                    <hr />
                    {comandaAtiva.itens.map((it) => (
                      <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span>{it.quantidade}x {it.nome}</span>
                        <span>R$ {it.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' }}>
                      <span>TOTAL:</span>
                      <span>R$ {comandaAtiva.valorTotal.toFixed(2)}</span>
                    </div>
                    {(comandaAtiva.valorPago || 0) > 0 && (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>JÁ PAGO:</span>
                          <span>R$ {(comandaAtiva.valorPago || 0).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                          <span>RESTANTE:</span>
                          <span>R$ {saldoRestante.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    {pessoasDivisao > 1 && (
                      <div style={{ marginTop: '6px', fontWeight: 'bold', textAlign: 'center' }}>
                        DIVISÃO P/ {pessoasDivisao} PESSOAS: R$ {valorPorPessoaTotal.toFixed(2)} / pessoa
                      </div>
                    )}
                    <hr />
                    <div style={{ textAlign: 'center', fontSize: '10px' }}>Documento sem valor fiscal</div>
                  </div>
                </div>
              </>
            )}
          </div>
      )}
    </div>
  );
};

export const ComandasModal: React.FC<ComandasModalProps> = ({
  visivel,
  onFechar,
  ...panelProps
}) => {
  const voltarInternoRef = useRef<(() => boolean) | null>(null);
  const handleVoltarOuFechar = () => {
    if (voltarInternoRef.current?.()) return;
    onFechar();
  };

  useVoltarHierarquico(visivel, handleVoltarOuFechar);

  if (!visivel) return null;

  const totalAbertas = panelProps.comandas.filter((c) => c.status === 'aberta').length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 100050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 10px 44px 10px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleVoltarOuFechar();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1120px',
          height: 'calc(100dvh - 54px)',
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 24px 48px rgba(15, 23, 42, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)',
            color: '#ffffff',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexShrink: 0,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🧾</span>
              <span>Comandas & Mesas (Consumo Local)</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  background: '#22c55e',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}
              >
                {totalAbertas} abertas
              </span>
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#cbd5e1' }}>
              Lance produtos no nome do cliente, divida a conta por pessoas, imprima a comanda e dê baixa ao fechar.
            </p>
          </div>
          <button
            type="button"
            onClick={handleVoltarOuFechar}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.1)',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        <ComandasPanel {...panelProps} modoLateral={false} voltarInternoRef={voltarInternoRef} />
      </div>
    </div>
  );
};
