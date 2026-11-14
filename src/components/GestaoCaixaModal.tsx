import React, { useState } from 'react';
import { SessaoCaixaTurno, MovimentacaoCaixa, Venda, Supermercado, OperadorCaixa } from '../types';

interface GestaoCaixaModalProps {
  visivel: boolean;
  onFechar: () => void;
  sessaoAtiva: SessaoCaixaTurno | null;
  vendasSessao: Venda[];
  movimentacoes: MovimentacaoCaixa[];
  onAbrirCaixa: (valorInicial: number, usuario: string, senha: string) => Promise<{ sucesso: boolean; mensagem?: string }> | { sucesso: boolean; mensagem?: string };
  onRegistrarMovimentacao: (tipo: 'sangria' | 'suprimento', valor: number, descricao: string) => void;
  onFecharCaixa: (dinheiroInformado: number, cartaoInformado: number, pixInformado: number, obs: string, usuario: string, senha: string) => Promise<{ sucesso: boolean; mensagem?: string }> | { sucesso: boolean; mensagem?: string };
  operadorAtivo: OperadorCaixa | null;
  loja: Supermercado | null;
  listaOperadores?: OperadorCaixa[];
  abaInicial?: 'status' | 'sangria_suprimento' | 'fechamento';
  motivoObrigatorio?: string | null;
}

export const GestaoCaixaModal: React.FC<GestaoCaixaModalProps> = ({
  visivel,
  onFechar,
  sessaoAtiva,
  vendasSessao = [],
  movimentacoes = [],
  onAbrirCaixa,
  onRegistrarMovimentacao,
  onFecharCaixa,
  operadorAtivo,
  loja,
  listaOperadores = [],
  abaInicial = 'status',
  motivoObrigatorio = null,
}) => {
  const [aba, setAba] = useState<'status' | 'sangria_suprimento' | 'fechamento'>(abaInicial);

  React.useEffect(() => {
    if (visivel) {
      setAba(abaInicial);
    }
  }, [visivel, abaInicial]);

  // Form Abertura
  const [loginAbrir, setLoginAbrir] = useState<string>(operadorAtivo?.cpfOuUsuario || '');
  const [senhaAbrir, setSenhaAbrir] = useState<string>('');
  const [valorInicialStr, setValorInicialStr] = useState<string>('100.00');
  const [msgErroAbertura, setMsgErroAbertura] = useState<string>('');

  // Form Movimentação (Sangria/Suprimento)
  const [tipoMov, setTipoMov] = useState<'sangria' | 'suprimento'>('sangria');
  const [valorMovStr, setValorMovStr] = useState<string>('');
  const [descMov, setDescMov] = useState<string>('');

  // Form Fechamento (Conferência Cega + Login/Senha)
  const [dinheiroInfStr, setDinheiroInfStr] = useState<string>('');
  const [cartaoInfStr, setCartaoInfStr] = useState<string>('');
  const [pixInfStr, setPixInfStr] = useState<string>('');
  const [obsFechamento, setObsFechamento] = useState<string>('');
  const [loginFechar, setLoginFechar] = useState<string>(operadorAtivo?.cpfOuUsuario || '');
  const [senhaFechar, setSenhaFechar] = useState<string>('');
  const [msgErroFechamento, setMsgErroFechamento] = useState<string>('');

  React.useEffect(() => {
    if (operadorAtivo?.cpfOuUsuario) {
      setLoginAbrir((prev) => (prev ? prev : operadorAtivo.cpfOuUsuario));
      setLoginFechar((prev) => (prev ? prev : operadorAtivo.cpfOuUsuario));
    }
  }, [operadorAtivo?.cpfOuUsuario]);

  if (!visivel) return null;

  // Filtrar estritamente apenas as vendas concluídas DESTA SESSÃO ESPECÍFICA DO OPERADOR
  const vendasConcluidas = vendasSessao.filter((v) => {
    if (v.status !== 'concluida') return false;
    if (sessaoAtiva?.operadorId && v.operadorId && v.operadorId !== sessaoAtiva.operadorId) return false;
    if (sessaoAtiva?.lojaId && v.lojaId && v.lojaId !== sessaoAtiva.lojaId) return false;
    return true;
  });

  const totalSuprimentos = movimentacoes
    .filter((m) => m.tipo === 'suprimento')
    .reduce((acc, m) => acc + m.valor, 0);

  const totalSangrias = movimentacoes
    .filter((m) => m.tipo === 'sangria')
    .reduce((acc, m) => acc + m.valor, 0);

  const totalVendasDinheiro = vendasConcluidas
    .filter((v) => v.formaPagamento === 'dinheiro')
    .reduce((acc, v) => acc + (v.valorTotal || 0), 0);

  const totalVendasCredito = vendasConcluidas
    .filter((v) => v.formaPagamento === 'cartao_credito')
    .reduce((acc, v) => acc + (v.valorTotal || 0), 0);

  const totalVendasDebito = vendasConcluidas
    .filter((v) => v.formaPagamento === 'cartao_debito')
    .reduce((acc, v) => acc + (v.valorTotal || 0), 0);

  const totalVendasCartao = totalVendasCredito + totalVendasDebito;

  const totalVendasPix = vendasConcluidas
    .filter((v) => v.formaPagamento === 'pix')
    .reduce((acc, v) => acc + (v.valorTotal || 0), 0);

  const totalVendasFiado = vendasConcluidas
    .filter((v) => v.formaPagamento === 'fiado')
    .reduce((acc, v) => acc + (v.valorTotal || 0), 0);

  const totalFaturadoNesteTurno = totalVendasDinheiro + totalVendasCartao + totalVendasPix + totalVendasFiado;

  const saldoDinheiroEmEspecieEsperado =
    (sessaoAtiva?.valorInicialSuprimento || 0) + totalSuprimentos + totalVendasDinheiro - totalSangrias;

  const fmtBRL = (v: number) => `R$ ${Number(v || 0).toFixed(2).replace('.', ',')}`;

  const handleSubmeterAbertura = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgErroAbertura('');
    const val = parseFloat(valorInicialStr.replace(',', '.')) || 0;

    if (!loginAbrir.trim() || !senhaAbrir.trim()) {
      setMsgErroAbertura('Informe o login/CPF e a senha para abrir o caixa.');
      return;
    }

    const resultado = await onAbrirCaixa(val, loginAbrir, senhaAbrir);
    if (resultado.sucesso) {
      setSenhaAbrir('');
      setMsgErroAbertura('');
    } else {
      setMsgErroAbertura(resultado.mensagem || 'Usuário ou senha incorretos! Verifique suas credenciais.');
    }
  };

  const handleSubmeterMovimentacao = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(valorMovStr.replace(',', '.')) || 0;
    if (val <= 0) {
      alert('Informe um valor válido maior que zero.');
      return;
    }
    if (!descMov.trim()) {
      alert('Informe o motivo ou descrição da movimentação.');
      return;
    }
    onRegistrarMovimentacao(tipoMov, val, descMov);
    setValorMovStr('');
    setDescMov('');
    setAba('status');
  };

  const handleSubmeterFechamento = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgErroFechamento('');
    const din = parseFloat(dinheiroInfStr.replace(',', '.')) || 0;
    const car = parseFloat(cartaoInfStr.replace(',', '.')) || 0;
    const pix = parseFloat(pixInfStr.replace(',', '.')) || 0;

    if (!loginFechar.trim() || !senhaFechar.trim()) {
      setMsgErroFechamento('Informe seu usuário e senha para autorizar o encerramento do caixa.');
      return;
    }

    const resultado = await onFecharCaixa(din, car, pix, obsFechamento, loginFechar, senhaFechar);
    if (resultado.sucesso) {
      setSenhaFechar('');
      setMsgErroFechamento('');
      setAba('status');
    } else {
      setMsgErroFechamento(resultado.mensagem || 'Usuário ou senha incorretos para autorizar o fechamento!');
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-container" style={{ maxWidth: '650px', width: '92%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem' }}>
            💵 Gestão do Turno de Caixa & Prestação de Contas
          </h3>
          <button className="btn-fechar-modal" onClick={onFechar}>&times;</button>
        </div>

        {/* MENSAGEM SE NÃO HOUVER CAIXA ABERTO */}
        {!sessaoAtiva || sessaoAtiva.status === 'fechado' ? (
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '20px', borderRadius: '12px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h4 style={{ color: '#0f172a', margin: '0 0 6px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                🔑 Autenticação do Operador & Abertura de Caixa
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                Informe seu Login (CPF ou Usuário) e Senha/PIN para abrir a gaveta e iniciar suas vendas no <strong>{loja?.nome}</strong>.
              </p>
            </div>

            {msgErroAbertura && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem', fontWeight: 600 }}>
                ⚠️ {msgErroAbertura}
              </div>
            )}

            <form onSubmit={handleSubmeterAbertura} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '420px', margin: '0 auto' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px', color: '#334155' }}>
                  👤 Login ou CPF do Operador:
                </label>
                <input
                  type="text"
                  className="input-padrao"
                  placeholder="Digite seu login cadastrado"
                  value={loginAbrir}
                  onChange={(e) => {
                    setLoginAbrir(e.target.value);
                    setMsgErroAbertura('');
                  }}
                  required
                  autoCapitalize="none"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px', color: '#334155' }}>
                  🔑 Senha / PIN do Caixa:
                </label>
                <input
                  type="password"
                  className="input-padrao"
                  placeholder="Digite sua senha ou PIN"
                  value={senhaAbrir}
                  onChange={(e) => {
                    setSenhaAbrir(e.target.value);
                    setMsgErroAbertura('');
                  }}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px', color: '#334155' }}>
                  💵 Fundo de Troco Inicial Conferido na Gaveta (R$):
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="input-padrao"
                  value={valorInicialStr}
                  onChange={(e) => setValorInicialStr(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-salvar"
                style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700, marginTop: '6px' }}
              >
                🔓 Autenticar & Abrir Turno de Caixa
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* TABS DE NAVEGAÇÃO INTERNA DO CAIXA */}
            {motivoObrigatorio && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #f87171',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  marginBottom: '12px',
                  color: '#991b1b',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                <div>
                  <strong>Fechamento de Caixa Obrigatório:</strong>
                  <div>{motivoObrigatorio}</div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '6px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button
                className={`btn ${aba === 'status' ? 'btn-salvar' : ''}`}
                style={{ flex: '1 1 120px', padding: '8px 10px', fontSize: '0.82rem', background: aba === 'status' ? undefined : '#f1f5f9', color: aba === 'status' ? undefined : '#334155' }}
                onClick={() => setAba('status')}
              >
                📊 Resumo do Meu Turno
              </button>
              <button
                className={`btn ${aba === 'sangria_suprimento' ? 'btn-salvar' : ''}`}
                style={{ flex: '1 1 130px', padding: '8px 10px', fontSize: '0.82rem', background: aba === 'sangria_suprimento' ? undefined : '#f1f5f9', color: aba === 'sangria_suprimento' ? undefined : '#334155' }}
                onClick={() => setAba('sangria_suprimento')}
              >
                💸 Sangria / Suprimento
              </button>
              <button
                className={`btn ${aba === 'fechamento' ? 'btn-salvar' : ''}`}
                style={{ flex: '1 1 120px', padding: '8px 10px', fontSize: '0.82rem', background: aba === 'fechamento' ? undefined : '#f1f5f9', color: aba === 'fechamento' ? undefined : '#334155' }}
                onClick={() => setAba('fechamento')}
              >
                🔒 Fechar Caixa
              </button>
            </div>

            {/* ABA 1: RESUMO DO TURNO ISOLADO DESTE OPERADOR */}
            {aba === 'status' && (
              <div>
                {/* CABEÇALHO DO TURNO ESTILO PDV */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    border: '1px solid #86efac',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    marginBottom: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          background: '#16a34a',
                          color: '#ffffff',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          letterSpacing: '0.03em',
                        }}
                      >
                        🟢 CAIXA ABERTO
                      </span>
                      <span style={{ fontSize: '0.76rem', color: '#166534', fontWeight: 600 }}>
                        Troco Inicial: <b>{fmtBRL(sessaoAtiva.valorInicialSuprimento)}</b>
                      </span>
                    </div>
                    <strong style={{ fontSize: '1.08rem', color: '#14532d', display: 'block' }}>{sessaoAtiva.operadorNome}</strong>
                    <span style={{ fontSize: '0.76rem', color: '#15803d', display: 'block' }}>
                      Aberto às {sessaoAtiva.horaAbertura} em {sessaoAtiva.dataAbertura}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Faturamento do Turno</span>
                    <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#14532d', whiteSpace: 'nowrap' }}>
                      {fmtBRL(totalFaturadoNesteTurno)}
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#166534' }}>
                      {vendasConcluidas.length} {vendasConcluidas.length === 1 ? 'venda realizada' : 'vendas realizadas'}
                    </span>
                  </div>
                </div>

                {/* RESUMO POR FORMA DE PAGAMENTO (5 COLUNAS LIMPAS) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>💵 Dinheiro</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16a34a', marginTop: '3px', whiteSpace: 'nowrap' }}>{fmtBRL(totalVendasDinheiro)}</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>📱 PIX</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0d9488', marginTop: '3px', whiteSpace: 'nowrap' }}>{fmtBRL(totalVendasPix)}</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>💳 Crédito</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2563eb', marginTop: '3px', whiteSpace: 'nowrap' }}>{fmtBRL(totalVendasCredito)}</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>🏧 Débito</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#4f46e5', marginTop: '3px', whiteSpace: 'nowrap' }}>{fmtBRL(totalVendasDebito)}</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>📒 Fiado</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#d97706', marginTop: '3px', whiteSpace: 'nowrap' }}>{fmtBRL(totalVendasFiado)}</div>
                  </div>
                </div>

                {/* GAVETA DE DINHEIRO FÍSICO */}
                <div
                  style={{
                    background: '#f8fafc',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', display: 'block' }}>
                      💰 Saldo Esperado na Gaveta (Dinheiro Físico)
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                      Abertura {fmtBRL(sessaoAtiva.valorInicialSuprimento)} + Dinheiro {fmtBRL(totalVendasDinheiro)} + Suprimentos {fmtBRL(totalSuprimentos)} − Sangrias {fmtBRL(totalSangrias)}
                    </span>
                  </div>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0284c7', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {fmtBRL(saldoDinheiroEmEspecieEsperado)}
                  </span>
                </div>

                {/* ATALHOS RÁPIDOS DE PDV */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setTipoMov('suprimento');
                      setAba('sangria_suprimento');
                    }}
                    style={{
                      flex: 1,
                      minWidth: '120px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #bbf7d0',
                      background: '#f0fdf4',
                      color: '#15803d',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    📥 + Suprimento
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTipoMov('sangria');
                      setAba('sangria_suprimento');
                    }}
                    style={{
                      flex: 1,
                      minWidth: '120px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #fecaca',
                      background: '#fef2f2',
                      color: '#b91c1c',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    📤 − Sangria
                  </button>
                  <button
                    type="button"
                    onClick={() => setAba('fechamento')}
                    style={{
                      flex: 1,
                      minWidth: '120px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    🔒 Conferir & Fechar
                  </button>
                </div>

                {/* HISTÓRICO DE SANGRIAS E SUPRIMENTOS DO TURNO */}
                <h4 style={{ fontSize: '0.84rem', margin: '0 0 6px 0', color: '#334155', fontWeight: 700 }}>
                  Histórico de Sangrias e Suprimentos do Turno:
                </h4>
                <div style={{ maxHeight: '140px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff' }}>
                  {movimentacoes.length === 0 ? (
                    <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                      Nenhuma sangria ou suprimento registrado neste turno.
                    </div>
                  ) : (
                    movimentacoes.map((m) => (
                      <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid #f1f5f9', fontSize: '0.82rem' }}>
                        <div>
                          <strong style={{ color: m.tipo === 'sangria' ? '#dc2626' : '#16a34a' }}>
                            {m.tipo === 'sangria' ? '🔻 SANGRIA' : '🟢 SUPRIMENTO'}
                          </strong>
                          <span style={{ color: '#64748b', marginLeft: '6px' }}>({m.descricao})</span>
                        </div>
                        <div style={{ whiteSpace: 'nowrap' }}>
                          <strong>{fmtBRL(m.valor)}</strong>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginLeft: '6px' }}>{m.dataHora.split(' ')[1]}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ABA 2: REGISTRO DE SANGRIA / SUPRIMENTO */}
            {aba === 'sangria_suprimento' && (
              <form onSubmit={handleSubmeterMovimentacao} style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>Lançamento de Sangria ou Suprimento de Troco</h4>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tipo de Movimentação:</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="tipoMov"
                        value="sangria"
                        checked={tipoMov === 'sangria'}
                        onChange={() => setTipoMov('sangria')}
                      />
                      🔻 Sangria (Retirada de Dinheiro para Cofre/Depósito)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="tipoMov"
                        value="suprimento"
                        checked={tipoMov === 'suprimento'}
                        onChange={() => setTipoMov('suprimento')}
                      />
                      🟢 Suprimento (Entrada Adicional de Troco na Gaveta)
                    </label>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Valor (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-padrao"
                    placeholder="0.00"
                    value={valorMovStr}
                    onChange={(e) => setValorMovStr(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Motivo / Descrição:</label>
                  <input
                    type="text"
                    className="input-padrao"
                    placeholder="Ex: Recolhimento de nota alta para o cofre / Troco extra em moedas"
                    value={descMov}
                    onChange={(e) => setDescMov(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <button type="submit" className="btn btn-salvar" style={{ width: '100%', padding: '10px', fontWeight: 600 }}>
                  Confirmar Lançamento de {tipoMov === 'sangria' ? 'Sangria' : 'Suprimento'}
                </button>
              </form>
            )}

            {/* ABA 3: FECHAMENTO DE CAIXA COM CONFERÊNCIA CEGA + LOGIN/SENHA */}
            {aba === 'fechamento' && (
              <form onSubmit={handleSubmeterFechamento} style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#1e293b' }}>🔒 Fechamento de Turno do Operador (Conferência Cega)</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>
                  Digite os valores contados fisicamente na sua gaveta neste turno e confirme seu Login e Senha para autorizar o encerramento.
                </p>

                {msgErroFechamento && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem', fontWeight: 600 }}>
                    ⚠️ {msgErroFechamento}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: '#1e293b' }}>
                      💵 Dinheiro Físico na Gaveta (R$):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="input-padrao"
                      placeholder="0.00"
                      value={dinheiroInfStr}
                      onChange={(e) => setDinheiroInfStr(e.target.value)}
                      required
                      style={{ width: '100%' }}
                    />
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                      (Fundo inicial + vendas em dinheiro)
                    </span>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: '#1e293b' }}>
                      💳 Comprovantes Cartão (R$):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="input-padrao"
                      placeholder="0.00"
                      value={cartaoInfStr}
                      onChange={(e) => setCartaoInfStr(e.target.value)}
                      style={{ width: '100%' }}
                    />
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                      (Total maquininhas débito/crédito)
                    </span>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: '#1e293b' }}>
                      ⚡ Total PIX do Turno (R$):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="input-padrao"
                      placeholder="0.00"
                      value={pixInfStr}
                      onChange={(e) => setPixInfStr(e.target.value)}
                      style={{ width: '100%' }}
                    />
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                      (Extrato/comprovantes PIX)
                    </span>
                  </div>
                </div>

                {/* SOMATÓRIO TOTAL INFORMADO EM TEMPO REAL */}
                <div
                  style={{
                    background: '#f1f5f9',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                      📊 Total Geral Informado (Prestação de Contas):
                    </span>
                    <strong style={{ fontSize: '1.15rem', color: '#0284c7' }}>
                      R$ {((parseFloat(dinheiroInfStr.replace(',', '.')) || 0) + (parseFloat(cartaoInfStr.replace(',', '.')) || 0) + (parseFloat(pixInfStr.replace(',', '.')) || 0)).toFixed(2)}
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Soma: Dinheiro R$ {(parseFloat(dinheiroInfStr.replace(',', '.')) || 0).toFixed(2)} + Cartão R$ {(parseFloat(cartaoInfStr.replace(',', '.')) || 0).toFixed(2)} + PIX R$ {(parseFloat(pixInfStr.replace(',', '.')) || 0).toFixed(2)}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Observações do Fechamento:
                  </label>
                  <textarea
                    className="input-padrao"
                    rows={2}
                    placeholder="Alguma observação importante sobre seu turno..."
                    value={obsFechamento}
                    onChange={(e) => setObsFechamento(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                  <h5 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#0f172a' }}>🔑 Confirmação de Segurança do Operador</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Login / CPF:</label>
                      <input
                        type="text"
                        className="input-padrao"
                        placeholder="Seu login"
                        value={loginFechar}
                        onChange={(e) => {
                          setLoginFechar(e.target.value);
                          setMsgErroFechamento('');
                        }}
                        required
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Senha / PIN:</label>
                      <input
                        type="password"
                        className="input-padrao"
                        placeholder="Sua senha"
                        value={senhaFechar}
                        onChange={(e) => {
                          setSenhaFechar(e.target.value);
                          setMsgErroFechamento('');
                        }}
                        required
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn"
                  style={{ width: '100%', padding: '12px', background: '#dc2626', color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}
                >
                  🔒 Encerrar Turno e Finalizar Caixa
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
