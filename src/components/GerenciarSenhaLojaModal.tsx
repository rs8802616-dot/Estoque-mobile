import React, { useState } from 'react';
import { Supermercado, obterLinksExclusivosLoja } from '../types';
import {
  MIN_CARACTERES_SENHA,
  criarHashComSalt,
  validarPoliticaSenha,
  revogarLockoutLoja,
} from '../utils/security';

interface GerenciarSenhaLojaModalProps {
  loja: Supermercado | null;
  onFechar: () => void;
  onAtualizarLoja: (lojaAtualizada: Supermercado, resumoAcao: string) => void;
}

export const GerenciarSenhaLojaModal: React.FC<GerenciarSenhaLojaModalProps> = ({
  loja,
  onFechar,
  onAtualizarLoja,
}) => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucessoMsg, setSucessoMsg] = useState('');
  const [mensagemWhatsAppPronta, setMensagemWhatsAppPronta] = useState('');
  const [copiouMsg, setCopiouMsg] = useState(false);

  React.useEffect(() => {
    setNovaSenha('');
    setConfirmarNovaSenha('');
    setMostrarSenha(false);
    setSalvando(false);
    setErro('');
    setSucessoMsg('');
    setMensagemWhatsAppPronta('');
    setCopiouMsg(false);
  }, [loja?.id]);

  if (!loja) return null;

  const links = obterLinksExclusivosLoja(loja);

  // Opção 1: Revogar Tempo de Bloqueio (Lockout 15 min)
  const handleRevogarTempoBloqueio = () => {
    setErro('');
    revogarLockoutLoja(loja.id);
    setSucessoMsg(
      `🔓 Tempo de bloqueio (15 min) e contador de falhas da loja "${loja.nome}" foram zerados imediatamente!`
    );
  };

  // Opção 2: Revogar Senha Atual do Lojista (senha_revogada: true)
  const handleRevogarSenhaAtual = () => {
    setErro('');
    const lojaAtualizada: Supermercado = {
      ...loja,
      senha: '',
      senhaAdmin: '',
      senhaHash: '',
      senhaSalt: '',
      senha_revogada: true,
    };
    revogarLockoutLoja(loja.id);
    onAtualizarLoja(lojaAtualizada, `🔑 Senha revogada para "${loja.nome}" (redefinição obrigatória ativada)`);

    const msgWpp =
      `Olá! A senha de acesso da loja *${loja.nome}* foi liberada para recadastramento.\n\n` +
      `🔗 Acesse o Link Oficial da sua loja para cadastrar sua *Nova Senha* (mínimo 6 caracteres):\n` +
      `${links.admin}`;

    setMensagemWhatsAppPronta(msgWpp);
    setSucessoMsg(
      '✅ Senha atual revogada! Ao abrir o link da loja, o lojista verá automaticamente a tela "Cadastrar Nova Senha".'
    );
  };

  // Opção 3: Definir Nova Senha Diretamente (SHA-256 + Salt)
  const handleDefinirNovaSenhaDireta = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucessoMsg('');

    const validacao = validarPoliticaSenha(novaSenha, confirmarNovaSenha);
    if (!validacao.valida) {
      setErro(validacao.erro || 'Senha inválida.');
      return;
    }

    setSalvando(true);
    try {
      const sLimpa = novaSenha.trim();
      const { senhaHash, senhaSalt } = await criarHashComSalt(sLimpa);

      const lojaAtualizada: Supermercado = {
        ...loja,
        senha: '', // Zero Plaintext no banco/localStorage
        senhaAdmin: '',
        senhaHash,
        senhaSalt,
        senha_revogada: false,
      };
      revogarLockoutLoja(loja.id);
      onAtualizarLoja(lojaAtualizada, `✍️ Nova senha criptografada (SHA-256 + Salt) definida para "${loja.nome}"`);

      const msgWpp =
        `Olá! Seguem os dados de acesso atualizados da loja *${loja.nome}*:\n\n` +
        `🔗 *Link Oficial da Loja:* ${links.admin}\n` +
        `👤 *Login:* ${loja.nome} (ou CNPJ ${loja.cnpj})\n` +
        `🔑 *Nova Senha:* ${sLimpa}`;

      setMensagemWhatsAppPronta(msgWpp);
      setNovaSenha('');
      setConfirmarNovaSenha('');
      setSucessoMsg('✅ Nova senha criptografada com SHA-256 + Salt salva com sucesso!');
    } catch (err) {
      setErro('Erro ao criptografar a nova senha.');
    } finally {
      setSalvando(false);
    }
  };

  const abrirWhatsAppComMensagem = () => {
    if (!mensagemWhatsAppPronta) return;
    const foneLimpo = (loja.telefone || '').replace(/\D/g, '');
    const url = foneLimpo
      ? `https://wa.me/55${foneLimpo}?text=${encodeURIComponent(mensagemWhatsAppPronta)}`
      : `https://wa.me/?text=${encodeURIComponent(mensagemWhatsAppPronta)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '580px',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          border: '1px solid #cbd5e1',
          overflow: 'hidden',
          margin: 'auto',
        }}
      >
        {/* CABEÇALHO */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
            padding: '18px 22px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🔑</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800 }}>
                Gerenciar Senha & Acesso — {loja.nome}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#93c5fd' }}>
                Criptografia Bancária SHA-256 + Salt (Zero Plaintext)
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onFechar}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontWeight: 800,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sucessoMsg && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #86efac',
                color: '#166534',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '0.84rem',
                fontWeight: 700,
              }}
            >
              {sucessoMsg}
            </div>
          )}

          {erro && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '11px 14px',
                borderRadius: '12px',
                fontSize: '0.84rem',
                fontWeight: 700,
              }}
            >
              ⚠️ {erro}
            </div>
          )}

          {/* OPÇÃO 1 E OPÇÃO 2 EM CARDS RÁPIDOS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
            {/* OPÇÃO 1: REVOGAR TEMPO DE BLOQUEIO */}
            <div
              style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0369a1' }}>
                  Opção 1: 🔓 Revogar Tempo
                </div>
                <p style={{ fontSize: '0.74rem', color: '#334155', margin: '4px 0 0 0', lineHeight: 1.35 }}>
                  Se o lojista errou a senha 5 vezes seguidas, zera imediatamente o bloqueio de 15 minutos.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRevogarTempoBloqueio}
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                🔓 Revogar Tempo de Bloqueio
              </button>
            </div>

            {/* OPÇÃO 2: REVOGAR SENHA ATUAL DO LOJISTA (RECOMENDADO) */}
            <div
              style={{
                background: '#f5f3ff',
                border: '1px solid #ddd6fe',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#6d28d9' }}>
                    Opção 2: 🔑 Revogar Senha
                  </span>
                  <span style={{ fontSize: '0.65rem', background: '#ddd6fe', color: '#5b21b6', padding: '2px 6px', borderRadius: '999px', fontWeight: 800 }}>
                    Recomendado
                  </span>
                </div>
                <p style={{ fontSize: '0.74rem', color: '#334155', margin: '4px 0 0 0', lineHeight: 1.35 }}>
                  Ativa <code>senha_revogada: true</code>. Ao abrir o link da loja, o próprio lojista cadastra sua nova senha.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRevogarSenhaAtual}
                style={{
                  background: '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                🔑 Revogar Senha Atual do Lojista
              </button>
            </div>
          </div>

          {/* OPÇÃO 3: DEFINIR NOVA SENHA DIRETAMENTE */}
          <form
            onSubmit={handleDefinirNovaSenhaDireta}
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                Opção 3: ✍️ Definir Nova Senha Diretamente
              </div>
              <p style={{ fontSize: '0.74rem', color: '#475569', margin: '2px 0 0 0' }}>
                Digite e confirme uma nova senha (mínimo {MIN_CARACTERES_SENHA} caracteres). O sistema gera o hash SHA-256 + Salt e prepara a mensagem para o WhatsApp.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Nova Senha (mín. {MIN_CARACTERES_SENHA} caracteres):
                </label>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Digite a nova senha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  minLength={MIN_CARACTERES_SENHA}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 11px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Confirmar Nova Senha:
                </label>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Confirme a nova senha"
                  value={confirmarNovaSenha}
                  onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                  minLength={MIN_CARACTERES_SENHA}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 11px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#475569', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={mostrarSenha}
                  onChange={(e) => setMostrarSenha(e.target.checked)}
                />
                Mostrar senhas
              </label>

              <button
                type="submit"
                disabled={salvando}
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '9px 16px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: salvando ? 'wait' : 'pointer',
                }}
              >
                {salvando ? 'Criptografando...' : '✍️ Salvar Nova Senha da Loja'}
              </button>
            </div>
          </form>

          {/* MENSAGEM PRONTA PARA WHATSAPP QUANDO SENHA É REVOGADA OU REDEFINIDA */}
          {mensagemWhatsAppPronta && (
            <div
              style={{
                background: '#ecfdf5',
                border: '1.5px solid #6ee7b7',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#065f46' }}>
                📲 Mensagem Pronta para Enviar ao Lojista (WhatsApp):
              </div>
              <textarea
                readOnly
                value={mensagemWhatsAppPronta}
                rows={4}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #a7f3d0',
                  padding: '8px 10px',
                  fontSize: '0.76rem',
                  fontFamily: 'monospace',
                  color: '#064e3b',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                  resize: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={abrirWhatsAppComMensagem}
                  style={{
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  📲 Enviar no WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(mensagemWhatsAppPronta);
                    setCopiouMsg(true);
                    setTimeout(() => setCopiouMsg(false), 2200);
                  }}
                  style={{
                    background: '#ffffff',
                    color: '#065f46',
                    border: '1px solid #6ee7b7',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {copiouMsg ? '✓ Mensagem Copiada!' : '📋 Copiar Mensagem'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
