import { signInWithCustomToken, signOut } from 'firebase/auth';
import { auth } from './firebase';

export interface ParametrosAuthServidor {
  papel: 'master' | 'admin_loja' | 'caixa' | 'gerente' | 'garcom' | 'cozinha';
  lojaId?: string | null;
  usuarioId?: string;
}

/**
 * Solicita ao backend (/api/auth) um Custom Token do Firebase Auth com Custom Claims
 * (role, lojaId, sessaoId, is_master) e autentica a sessão no SDK do Firebase.
 * Se o servidor ainda não tiver FIREBASE_SERVICE_ACCOUNT_JSON configurado (HTTP 503),
 * retorna false silenciosamente sem interromper a operação atual.
 */
export async function autenticarSessaoServidor(params: ParametrosAuthServidor): Promise<boolean> {
  if (typeof window === 'undefined' || !auth) return false;
  try {
    const resp = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        papel: params.papel,
        lojaId: params.lojaId || null,
        usuarioId: params.usuarioId || 'usuario',
      }),
    });
    if (!resp.ok) return false;
    const data = await resp.json();
    if (data?.configurado && typeof data?.customToken === 'string' && data.customToken.length > 20) {
      await signInWithCustomToken(auth, data.customToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function autenticarLojaServidor(
  lojaId: string,
  senha: string
): Promise<{
  fallbackLocal?: boolean;
  autenticado?: boolean;
  deveTrocarSenha?: boolean;
  bloqueado?: boolean;
  erro?: string;
}> {
  if (typeof window === 'undefined') return { fallbackLocal: true };
  try {
    const resp = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'autenticar_loja', lojaId, senha }),
    });
    const data = await resp.json().catch(() => ({}));
    if (resp.status === 503 || data?.configurado === false) {
      return { fallbackLocal: true };
    }
    if (!resp.ok) {
      return {
        fallbackLocal: false,
        autenticado: false,
        bloqueado: Boolean(data?.bloqueado || resp.status === 429),
        erro: data?.erro || 'Credenciais inválidas.',
      };
    }
    if (data?.autenticado && data?.customToken && auth) {
      await signInWithCustomToken(auth, data.customToken);
    }
    return {
      fallbackLocal: false,
      autenticado: Boolean(data?.autenticado),
      deveTrocarSenha: Boolean(data?.deveTrocarSenha),
    };
  } catch {
    return { fallbackLocal: true };
  }
}

export async function autenticarMasterServidor(
  usuario: string,
  senha: string
): Promise<{ fallbackLocal?: boolean; autenticado?: boolean; erro?: string }> {
  if (typeof window === 'undefined') return { fallbackLocal: true };
  try {
    const resp = await fetch('/api/auth', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'autenticar_master', usuario, senha }),
    });
    const data = await resp.json().catch(() => ({}));
    if (resp.status === 503 || data?.configurado === false) {
      return { fallbackLocal: true };
    }
    if (!resp.ok) {
      return {
        fallbackLocal: false,
        autenticado: false,
        erro: data?.erro || 'Credenciais Master inválidas.',
      };
    }
    if (data?.autenticado && data?.customToken && auth) {
      await signInWithCustomToken(auth, data.customToken);
    }
    return { fallbackLocal: false, autenticado: Boolean(data?.autenticado) };
  } catch {
    return { fallbackLocal: true };
  }
}

export async function validarSessaoMasterServidor(tokenUrl?: string | null): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const resp = await fetch('/api/auth', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        tokenUrl
          ? { acao: 'validar_master_token', token: tokenUrl }
          : { acao: 'checar_sessao_master' }
      ),
    });
    if (!resp.ok) return false;
    const data = await resp.json().catch(() => ({}));
    return Boolean(data?.validado);
  } catch {
    return false;
  }
}

export async function encerrarSessaoServidor(): Promise<void> {
  if (typeof window === 'undefined' || !auth) return;
  try {
    await signOut(auth);
  } catch {}
}
