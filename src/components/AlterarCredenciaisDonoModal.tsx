import React from 'react';
import { CredenciaisDonoApp } from '../types';

interface AlterarCredenciaisDonoModalProps {
  visivel: boolean;
  onFechar: () => void;
  credenciaisAtuais?: CredenciaisDonoApp;
  onSalvarSucesso: (novasCredenciais: CredenciaisDonoApp) => void;
}

export const AlterarCredenciaisDonoModal: React.FC<AlterarCredenciaisDonoModalProps> = ({
  visivel,
  onFechar,
  credenciaisAtuais: _credenciaisAtuais,
  onSalvarSucesso: _onSalvarSucesso,
}) => {
  React.useEffect(() => {
    if (!visivel) return;
    try {
      localStorage.removeItem('credenciais_dono_app');
      localStorage.removeItem('senha_master_dono');
      localStorage.removeItem('usuario_master_dono');
    } catch {}
  }, [visivel]);

  if (!visivel) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000010,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '500px',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          border: '1px solid #cbd5e1',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
            padding: '18px 24px',
            color: '#ffffff',
            position: 'relative',
          }}
        >
          <button
            type="button"
            onClick={onFechar}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              background: 'rgba(255,255,255,0.2)',
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
            }}
          >
            ✕
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>🔑</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                Meu Login &amp; Senha (Dono)
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', opacity: 0.9 }}>
                Autenticação Master gerenciada exclusivamente no servidor
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '14px 16px',
              color: '#1e293b',
              fontSize: '0.88rem',
              lineHeight: 1.55,
            }}
          >
            <div style={{ fontWeight: 800, color: '#6b21a8', marginBottom: '6px' }}>
              🔒 Segurança reforçada (Zero credencial Master no navegador)
            </div>
            <p style={{ margin: '0 0 10px 0' }}>
              Por segurança, o aplicativo não salva nem altera a senha Master no navegador ou no cliente.
              Toda validação é feita exclusivamente no servidor (<code>/api/auth</code>) com cookie
              <code>HttpOnly</code> assinado e bloqueio automático após 5 tentativas.
            </p>
            <p style={{ margin: 0 }}>
              Para alterar seu usuário, senha ou token secreto do Portal Master, atualize as variáveis
              de ambiente na Vercel:
            </p>
            <ul style={{ margin: '8px 0 0 18px', padding: 0, fontSize: '0.84rem', color: '#334155' }}>
              <li>
                <code>MASTER_ADMIN_USER</code> — usuário de login Master
              </li>
              <li>
                <code>MASTER_ADMIN_PASS</code> — senha secreta Master
              </li>
              <li>
                <code>MASTER_PORTAL_TOKEN</code> — token da URL exclusiva do Dono
              </li>
            </ul>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button
              type="button"
              onClick={onFechar}
              style={{
                background: '#9333ea',
                color: '#ffffff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(147, 51, 234, 0.3)',
              }}
            >
              Entendi / Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
