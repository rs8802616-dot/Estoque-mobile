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

export async function encerrarSessaoServidor(): Promise<void> {
  if (typeof window === 'undefined' || !auth) return;
  try {
    await signOut(auth);
  } catch {}
}
