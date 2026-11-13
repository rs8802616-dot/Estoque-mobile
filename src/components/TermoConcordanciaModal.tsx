import React, { useState } from 'react';
import { TermoConcordanciaRegistro } from '../types';

interface TermoConcordanciaModalProps {
  visivel: boolean;
  onAceitar: (registro: TermoConcordanciaRegistro) => void;
  onRecusar?: () => void;
  usuarioNome: string;
  usuarioPerfil?: string;
  perfilNome?: string;
  lojaId?: string;
  lojaNome?: string;
  apenasLeitura?: boolean;
  onFechar?: () => void;
}

export const TermoConcordanciaModal: React.FC<TermoConcordanciaModalProps> = ({
  visivel,
  onAceitar,
  onRecusar,
  usuarioNome,
  usuarioPerfil,
  perfilNome,
  lojaId,
  lojaNome,
  apenasLeitura = false,
  onFechar,
}) => {
  const [concordo, setConcordo] = useState<boolean>(false);

  if (!visivel) return null;

  const nomeExibicaoPerfil =
    perfilNome ||
    (usuarioPerfil === 'dona_app'
      ? 'Proprietário(a) Master'
      : usuarioPerfil === 'admin_loja'
      ? 'Administrador da Loja'
      : 'Operador de Caixa');

  const handleConfirmar = () => {
    if (!concordo && !apenasLeitura) {
      alert('Por favor, marque a caixa de confirmação para aceitar o termo e continuar.');
      return;
    }

    const agora = new Date();
    const registro: TermoConcordanciaRegistro = {
      id: `termo_aceite_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      usuarioId: usuarioPerfil || 'usuario',
      usuarioNome: usuarioNome || 'Usuário do Sistema',
      perfil: nomeExibicaoPerfil,
      lojaId: lojaId,
      lojaNome: lojaNome,
      dataAceite: agora.toLocaleDateString('pt-BR'),
      horaAceite: agora.toLocaleTimeString('pt-BR'),
      timestamp: agora.getTime(),
      versaoTermo: '2026.2-PROD',
      aceitou: true,
    };

    onAceitar(registro);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(8px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '560px',
          borderRadius: '18px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
          border: '1px solid #cbd5e1',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '88vh',
        }}
      >
        {/* CABEÇALHO DO TERMO */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '18px 20px',
            color: '#ffffff',
            borderBottom: '3px solid #0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>📜</span>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em', color: '#ffffff' }}>
                Termo de Uso, Privacidade e Segurança
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Aceite único de boas práticas operacionais e proteção de dados (1º acesso)
              </p>
            </div>
          </div>
          {apenasLeitura && onFechar && (
            <button
              onClick={onFechar}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              title="Fechar"
            >
              ✕
            </button>
          )}
        </div>

        {/* IDENTIFICAÇÃO SIMPLES DO USUÁRIO */}
        <div
          style={{
            background: '#f1f5f9',
            padding: '8px 16px',
            borderBottom: '1px solid #e2e8f0',
            fontSize: '0.82rem',
            color: '#334155',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '6px',
          }}
        >
          <div>
            <strong>👤 Usuário:</strong> {usuarioNome} <span style={{ color: '#0284c7' }}>({nomeExibicaoPerfil})</span>
          </div>
          {lojaNome && (
            <div>
              <strong>🏪 Loja:</strong> {lojaNome}
            </div>
          )}
        </div>

        {/* CORPO DO TERMO RESPONSIVO E LEGÍVEL */}
        <div
          style={{
            padding: '16px 18px',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            color: '#1e293b',
            flex: 1,
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* BLOCO 1 */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.2rem' }}>🔒</span>
              <strong style={{ fontSize: '0.94rem', color: '#0f172a' }}>1. Privacidade, Sigilo e LGPD</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569' }}>
              As informações comerciais da loja — incluindo preços de custo, margens de lucro, faturamento, cadastros e dados de clientes — são confidenciais e protegidas pela LGPD, sendo proibido copiá-las ou compartilhá-las sem autorização.
            </p>
          </div>

          {/* BLOCO 2 */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.2rem' }}>🔑</span>
              <strong style={{ fontSize: '0.94rem', color: '#0f172a' }}>2. Acesso Pessoal e Sessão Única</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569' }}>
              Seu usuário e senha são pessoais e intransferíveis. Para segurança da operação, cada conta permanece ativa em um dispositivo por vez e todas as movimentações realizadas ficam vinculadas ao seu perfil.
            </p>
          </div>

          {/* BLOCO 3 */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.2rem' }}>💵</span>
              <strong style={{ fontSize: '0.94rem', color: '#0f172a' }}>3. Integridade de Caixa, Estoque e Delivery</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569' }}>
              Aberturas e fechamentos de turno, vendas, estornos, entregas e ajustes de estoque devem refletir fielmente a movimentação real da loja, com conferência de valores e justificativa em caso de perdas ou cancelamentos.
            </p>
          </div>

          {/* BLOCO 4 */}
          <div
            style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '12px',
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.2rem' }}>📋</span>
              <strong style={{ fontSize: '0.94rem', color: '#0c4a6e' }}>4. Auditoria Digital & Aceite Único</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#0369a1' }}>
              Ações críticas (vendas, sangrias, estornos e alterações de estoque) são registradas automaticamente com data, hora e usuário. Este termo é exibido <strong>apenas uma única vez</strong> no primeiro acesso da sua conta.
            </p>
          </div>
        </div>

        {/* RODAPÉ COM CHECKBOX E BOTÃO RESPONSIVO */}
        <div
          style={{
            padding: '14px 18px',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {!apenasLeitura && (
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.88rem',
                color: '#0f172a',
                cursor: 'pointer',
                fontWeight: 600,
                background: '#ffffff',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
              }}
            >
              <input
                type="checkbox"
                checked={concordo}
                onChange={(e) => setConcordo(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer', flexShrink: 0 }}
              />
              <span>Li e concordo com os termos de uso, sigilo e segurança.</span>
            </label>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            {apenasLeitura && onFechar ? (
              <button
                type="button"
                onClick={onFechar}
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Fechar Visualização
              </button>
            ) : (
              <button
                type="button"
                disabled={!concordo}
                onClick={handleConfirmar}
                style={{
                  background: concordo ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' : '#94a3b8',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.96rem',
                  cursor: concordo ? 'pointer' : 'not-allowed',
                  boxShadow: concordo ? '0 4px 14px rgba(22, 163, 74, 0.35)' : 'none',
                  transition: 'all 0.2s ease',
                  width: '100%',
                }}
              >
                {concordo ? '✅ Aceitar e Iniciar Sessão' : 'Marque a caixa acima para continuar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
