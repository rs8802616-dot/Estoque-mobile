import React, { useMemo, useState } from 'react';
import { ComandaLocal, ItemComanda, ItemEstoque, PagamentoComanda, Supermercado } from '../types';
import { imprimirCupomTermico } from '../utils/impressaoTermica';

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
}) => {
  const [filtroStatus, setFiltroStatus] = useState<'aberta' | 'fechada'>('aberta');
  const [buscaComanda, setBuscaComanda] = useState<string>('');
  const [comandaSelecionadaId, setComandaSelecionadaId] = useState<string | null>(null);
  const [visaoLateral, setVisaoLateral] = useState<'lista' | 'detalhe'>('lista');

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
  const [larguraBobina, setLarguraBobina] = useState<'80mm' | '58mm'>('80mm');

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
      data: agora.toISOString().slice(0, 10),
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

              <input
                type="text"
                value={buscaComanda}
                onChange={(e) => setBuscaComanda(e.target.value)}
                placeholder="🔍 Buscar comanda por nome ou mesa..."
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  background: '#f8fafc',
                }}
              />
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
                {/* CABEÇALHO DA COMANDA SELECIONADA */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '12px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>
                      Comanda #{String(comandaAtiva.numeroComanda).padStart(2, '0')} — {comandaAtiva.nomeCliente}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {comandaAtiva.mesaOuReferencia ? `${comandaAtiva.mesaOuReferencia} • ` : ''}
                      Aberta em {new Date(comandaAtiva.abertaEm).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <select
                      value={larguraBobina}
                      onChange={(e) => setLarguraBobina(e.target.value as '80mm' | '58mm')}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '7px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      <option value="80mm">80mm</option>
                      <option value="58mm">58mm</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleImprimirComanda}
                      style={{
                        padding: '7px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#0284c7',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      🖨️ Imprimir Comanda
                    </button>
                    {comandaAtiva.status === 'aberta' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Cancelar a comanda de ${comandaAtiva.nomeCliente}?`)) {
                            onCancelarComanda(comandaAtiva.id);
                          }
                        }}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '8px',
                          border: '1px solid #fecaca',
                          background: '#fef2f2',
                          color: '#dc2626',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                        }}
                      >
                        🗑️ Cancelar
                      </button>
                    )}
                  </div>
                </div>

                {/* LANÇAR PRODUTOS NA COMANDA (SOMENTE ABERTA) */}
                {comandaAtiva.status === 'aberta' && (
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                      📦 Lançar Produto do Estoque na Comanda:
                    </div>
                    <input
                      type="text"
                      value={buscaProduto}
                      onChange={(e) => setBuscaProduto(e.target.value)}
                      placeholder="🔍 Digite o nome ou código do produto..."
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.84rem',
                        boxSizing: 'border-box',
                        marginBottom: '8px',
                      }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '6px', maxHeight: '175px', overflowY: 'auto' }}>
                      {produtosFiltrados.map((prod) => {
                        const foto = obterFotoProduto ? obterFotoProduto(prod.codigo) : prod.foto;
                        return (
                          <button
                            key={`${prod.codigo}_${prod.lote || ''}`}
                            type="button"
                            onClick={() => handleAdicionarProdutoNaComanda(prod)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '7px 9px',
                              borderRadius: '9px',
                              border: '1px solid #e2e8f0',
                              background: '#f8fafc',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            {foto ? (
                              <img src={foto} alt="" style={{ width: '30px', height: '30px', objectFit: 'contain', borderRadius: '6px', background: '#fff', flexShrink: 0 }} />
                            ) : (
                              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>🍾</span>
                            )}
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {prod.nome}
                              </div>
                              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#15803d' }}>
                                R$ {(prod.preco_venda || 0).toFixed(2).replace('.', ',')}
                              </div>
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#2563eb' }}>+</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ITENS CONSUMIDOS NA COMANDA */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                    🍺 Itens Consumidos ({comandaAtiva.itens.length})
                  </div>
                  {comandaAtiva.itens.length === 0 ? (
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', padding: '10px 0' }}>
                      Nenhum produto lançado nesta comanda ainda.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {comandaAtiva.itens.map((it) => (
                        <div
                          key={it.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px',
                            padding: '7px 9px',
                            borderRadius: '8px',
                            background: '#f8fafc',
                            border: '1px solid #f1f5f9',
                          }}
                        >
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{it.nome}</div>
                            <div style={{ fontSize: '0.71rem', color: '#64748b' }}>
                              R$ {it.preco_unitario.toFixed(2).replace('.', ',')} un • {it.adicionadoEm}
                            </div>
                          </div>
                          {comandaAtiva.status === 'aberta' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <button
                                type="button"
                                onClick={() => handleAlterarQtdItem(it.id, -1)}
                                style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 800, cursor: 'pointer' }}
                              >
                                -
                              </button>
                              <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 800, fontSize: '0.82rem' }}>{it.quantidade}</span>
                              <button
                                type="button"
                                onClick={() => handleAlterarQtdItem(it.id, 1)}
                                style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 800, cursor: 'pointer' }}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>{it.quantidade}x</span>
                          )}
                          <div style={{ minWidth: '72px', textAlign: 'right', fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>
                            R$ {it.subtotal.toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* DIVISÃO DE CONTA POR PESSOAS (RATEIO) */}
                <div
                  style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '12px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e3a8a' }}>
                      👥 Dividir Conta por Pessoas:
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => handleAlterarDivisaoPessoas(n)}
                          style={{
                            padding: '4px 9px',
                            borderRadius: '7px',
                            border: pessoasDivisao === n ? '1.5px solid #1d4ed8' : '1px solid #93c5fd',
                            background: pessoasDivisao === n ? '#2563eb' : '#ffffff',
                            color: pessoasDivisao === n ? '#ffffff' : '#1e3a8a',
                            fontWeight: 800,
                            fontSize: '0.76rem',
                            cursor: 'pointer',
                          }}
                        >
                          {n}x
                        </button>
                      ))}
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={pessoasDivisao}
                        onChange={(e) => handleAlterarDivisaoPessoas(Number(e.target.value))}
                        style={{
                          width: '50px',
                          padding: '4px 6px',
                          borderRadius: '7px',
                          border: '1px solid #93c5fd',
                          textAlign: 'center',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '10px', fontSize: '0.84rem' }}>
                    <span>
                      Total: <b style={{ color: '#0f172a' }}>R$ {comandaAtiva.valorTotal.toFixed(2).replace('.', ',')}</b>
                      {(comandaAtiva.valorPago || 0) > 0 && (
                        <> • Pago: <b style={{ color: '#15803d' }}>R$ {(comandaAtiva.valorPago || 0).toFixed(2).replace('.', ',')}</b> • Falta: <b style={{ color: '#b45309' }}>R$ {saldoRestante.toFixed(2).replace('.', ',')}</b></>
                      )}
                    </span>
                    <span style={{ fontWeight: 900, color: '#1d4ed8', fontSize: '0.92rem' }}>
                      Por Pessoa (÷ {pessoasDivisao}): R$ {valorPorPessoaTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* PAGAMENTOS JÁ REGISTRADOS */}
                {comandaAtiva.pagamentos && comandaAtiva.pagamentos.length > 0 && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '10px', fontSize: '0.76rem' }}>
                    <div style={{ fontWeight: 800, color: '#166534', marginBottom: '4px' }}>💳 Pagamentos Registrados:</div>
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

                {/* DAR BAIXA / FECHAR COMANDA */}
                {comandaAtiva.status === 'aberta' && (
                  <div style={{ background: '#ffffff', border: '1.5px solid #86efac', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#14532d' }}>
                      💰 Dar Baixa / Fechar Comanda (Restante: R$ {saldoRestante.toFixed(2).replace('.', ',')})
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      {FORMAS_PAGAMENTO.map((fp) => (
                        <button
                          key={fp.id}
                          type="button"
                          onClick={() => setFormaPagamento(fp.id)}
                          style={{
                            padding: '7px 6px',
                            borderRadius: '8px',
                            border: formaPagamento === fp.id ? '2px solid #16a34a' : '1px solid #cbd5e1',
                            background: formaPagamento === fp.id ? '#dcfce7' : '#f8fafc',
                            color: formaPagamento === fp.id ? '#166534' : '#334155',
                            fontWeight: 700,
                            fontSize: '0.76rem',
                            cursor: 'pointer',
                          }}
                        >
                          {fp.icon} {fp.label}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        value={nomePagador}
                        onChange={(e) => setNomePagador(e.target.value)}
                        placeholder="Nome de quem está pagando (opcional)"
                        style={{ flex: '1 1 160px', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                      />
                      <input
                        type="text"
                        value={valorPagamentoStr}
                        onChange={(e) => setValorPagamentoStr(e.target.value)}
                        placeholder={`Valor (padrão: ${saldoRestante.toFixed(2).replace('.', ',')})`}
                        style={{ flex: '1 1 140px', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}
                      />
                      {pessoasDivisao > 1 && (
                        <button
                          type="button"
                          onClick={() => setValorPagamentoStr(valorPorPessoaRestante.toFixed(2).replace('.', ','))}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: '1px solid #93c5fd',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          1 Parte (R$ {valorPorPessoaRestante.toFixed(2).replace('.', ',')})
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setValorPagamentoStr(saldoRestante.toFixed(2).replace('.', ','))}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#f1f5f9',
                          color: '#334155',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        Tudo
                      </button>
                    </div>

                    {loja?.configFiscal?.habilitado && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', background: '#eff6ff', padding: '7px 10px', borderRadius: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', cursor: 'pointer' }}>
                          <input type="checkbox" checked={emitirNfce} onChange={(e) => setEmitirNfce(e.target.checked)} />
                          <span>🧾 Emitir NFC-e ao quitar</span>
                        </label>
                        {emitirNfce && (
                          <input
                            type="text"
                            value={cpfNaNota}
                            onChange={(e) => setCpfNaNota(e.target.value)}
                            placeholder="CPF/CNPJ na nota (opcional)"
                            style={{ flex: 1, minWidth: '150px', padding: '5px 8px', borderRadius: '6px', border: '1px solid #bfdbfe', fontSize: '0.76rem' }}
                          />
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleRegistrarPagamento}
                      style={{
                        width: '100%',
                        padding: '11px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#16a34a',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                      }}
                    >
                      ✅ Dar Baixa / Receber Pagamento
                    </button>
                  </div>
                )}

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
        if (e.target === e.currentTarget) onFechar();
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
            onClick={onFechar}
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

        <ComandasPanel {...panelProps} modoLateral={false} />
      </div>
    </div>
  );
};
