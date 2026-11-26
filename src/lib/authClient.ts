import { signInWithCustomToken, signOut } from 'firebase/auth';
import { auth } from './firebase';
import type { OperadorCaixa, PedidoDelivery, Supermercado } from '../types';

export interface ParametrosAuthServidor {
  papel: 'master' | 'admin_loja' | 'caixa' | 'gerente' | 'garcom' | 'cozinha';
  lojaId?: string | null;
  usuarioId?: string;
}

/**
 * @deprecated Emissão direta de Custom Token sem validação de credencial foi desativada por segurança.
 * Os fluxos autenticados (`autenticarMasterServidor`, `autenticarLojaServidor`,
 * `autenticarOperadorServidor`, `redefinirSenhaRevogadaServidor`) já emitem o Custom Token diretamente.
 */
export async function autenticarSessaoServidor(_params: ParametrosAuthServidor): Promise<boolean> {
  return false;
}

export async function validarPainelLojaServidor(
  lojaSlug: string,
  tokenUrl?: string | null
): Promise<{
  fallbackLocal?: boolean;
  validado: boolean;
  loja?: Supermercado;
  papelPermitido?: string;
  erro?: string;
}> {
  if (typeof window === 'undefined') return { fallbackLocal: true, validado: false };
  const slugLimpo = String(lojaSlug || '').trim();
  if (!slugLimpo) return { fallbackLocal: false, validado: false };

  try {
    const tokenLimpo = tokenUrl ? String(tokenUrl).trim() : '';
    const resp = await fetch('/api/auth', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        tokenLimpo
          ? { acao: 'validar_painel_token', lojaSlug: slugLimpo, token: tokenLimpo }
          : { acao: 'checar_sessao_painel', lojaSlug: slugLimpo }
      ),
    });
    const data = await resp.json().catch(() => ({}));
    if (resp.status === 503 || data?.configurado === false) {
      return { fallbackLocal: true, validado: false };
    }
    if (resp.ok && data?.validado && data?.loja) {
      return {
        fallbackLocal: false,
        validado: true,
        loja: data.loja as Supermercado,
        papelPermitido: String(data.papelPermitido || 'admin'),
      };
    }
    return {
      fallbackLocal: false,
      validado: false,
      erro: data?.erro || 'Link de acesso inválido.',
    };
  } catch {
    return { fallbackLocal: true, validado: false };
  }
}

const CHAVE_ERRO_FIREBASE_AUTH = 'ultimo_erro_firebase_auth';

export function obterUltimoErroFirebaseAuth(): string | null {
  try {
    return sessionStorage.getItem(CHAVE_ERRO_FIREBASE_AUTH);
  } catch {
    return null;
  }
}

export function limparUltimoErroFirebaseAuth(): void {
  try {
    sessionStorage.removeItem(CHAVE_ERRO_FIREBASE_AUTH);
  } catch {
    // ignore
  }
}

function registrarErroFirebaseAuth(erro?: string | null): void {
  try {
    const msg = String(erro || '').trim();
    if (!msg) {
      sessionStorage.removeItem(CHAVE_ERRO_FIREBASE_AUTH);
    } else {
      sessionStorage.setItem(CHAVE_ERRO_FIREBASE_AUTH, msg);
    }
  } catch {
    // ignore
  }
}

async function autenticarFirebaseComCustomToken(
  customToken?: string | null,
  serverProjectId?: string | null
): Promise<{ ok: boolean; erro?: string }> {
  const clientProjectId = String(auth?.app?.options?.projectId || '').trim();
  if (serverProjectId && clientProjectId && serverProjectId !== clientProjectId) {
    const msg = `Projeto Firebase incompatível: servidor usa "${serverProjectId}", mas o app usa "${clientProjectId}". Ajuste FIREBASE_SERVICE_ACCOUNT_JSON na Vercel.`;
    registrarErroFirebaseAuth(msg);
    console.error('[Auth]', msg);
    return { ok: false, erro: msg };
  }
  if (!customToken || !auth) {
    const msg = !auth
      ? 'Firebase Auth não inicializado no cliente.'
      : 'Token de autenticação Firebase ausente na resposta do servidor (verifique FIREBASE_SERVICE_ACCOUNT_JSON).';
    registrarErroFirebaseAuth(msg);
    return { ok: false, erro: msg };
  }
  try {
    const cred = await signInWithCustomToken(auth, customToken);
    await cred.user.getIdToken(true);
    registrarErroFirebaseAuth(null);
    return { ok: true };
  } catch (err: any) {
    const code = String(err?.code || '');
    const msg =
      code === 'auth/custom-token-mismatch'
        ? `Token Firebase pertence a outro projeto (auth/custom-token-mismatch; cliente="${clientProjectId || 'adega-delivery-pdv'}"${serverProjectId ? `, servidor="${serverProjectId}"` : ''}). Confira FIREBASE_SERVICE_ACCOUNT_JSON na Vercel.`
        : `${code ? `${code}: ` : ''}${err?.message || 'Erro Firebase Auth'}`;
    registrarErroFirebaseAuth(msg);
    console.error('[Auth] Falha em signInWithCustomToken:', err);
    return { ok: false, erro: msg };
  }
}

export async function autenticarLojaServidor(
  lojaId: string,
  senha: string
): Promise<{
  fallbackLocal?: boolean;
  autenticado?: boolean;
  deveTrocarSenha?: boolean;
  senhaRevogada?: boolean;
  bloqueado?: boolean;
  erro?: string;
  firebaseAuthErro?: string;
}> {
  if (typeof window === 'undefined') return { fallbackLocal: true };
  try {
    const resp = await fetch('/api/auth', {
      method: 'POST',
      credentials: 'same-origin',
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
        senhaRevogada: Boolean(data?.senhaRevogada),
        bloqueado: Boolean(data?.bloqueado || resp.status === 429),
        erro: data?.erro || 'Credenciais inválidas.',
      };
    }
    let firebaseAuthErro: string | undefined = data?.customTokenErro
      ? String(data.customTokenErro)
      : undefined;
    if (firebaseAuthErro) {
      registrarErroFirebaseAuth(firebaseAuthErro);
    }
    if (data?.autenticado && data?.customToken) {
      const fb = await autenticarFirebaseComCustomToken(data.customToken, data?.firebaseProjectId);
      if (!fb.ok) firebaseAuthErro = fb.erro;
    } else if (data?.autenticado && !firebaseAuthErro) {
      firebaseAuthErro = 'Servidor autenticou, mas não retornou Firebase Custom Token.';
      registrarErroFirebaseAuth(firebaseAuthErro);
    }
    return {
      fallbackLocal: false,
      autenticado: Boolean(data?.autenticado),
      deveTrocarSenha: Boolean(data?.deveTrocarSenha),
      ...(firebaseAuthErro ? { firebaseAuthErro } : {}),
    };
  } catch {
    return { fallbackLocal: true };
  }
}

export async function autenticarOperadorServidor(
  lojaId: string,
  usuario: string,
  senha: string
): Promise<{
  fallbackLocal?: boolean;
  autenticado?: boolean;
  bloqueado?: boolean;
  erro?: string;
  operador?: OperadorCaixa;
  firebaseAuthErro?: string;
}> {
  if (typeof window === 'undefined') return { fallbackLocal: true };
  try {
    const resp = await fetch('/api/auth', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'autenticar_operador', lojaId, usuario, senha }),
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
        erro: data?.erro || 'Usuário ou senha inválidos.',
      };
    }
    let firebaseAuthErro: string | undefined = data?.customTokenErro
      ? String(data.customTokenErro)
      : undefined;
    if (firebaseAuthErro) {
      registrarErroFirebaseAuth(firebaseAuthErro);
    }
    if (data?.autenticado && data?.customToken) {
      const fb = await autenticarFirebaseComCustomToken(data.customToken, data?.firebaseProjectId);
      if (!fb.ok) firebaseAuthErro = fb.erro;
    } else if (data?.autenticado && !firebaseAuthErro) {
      firebaseAuthErro = 'Servidor autenticou, mas não retornou Firebase Custom Token.';
      registrarErroFirebaseAuth(firebaseAuthErro);
    }
    return {
      fallbackLocal: false,
      autenticado: Boolean(data?.autenticado),
      operador: data?.operador as OperadorCaixa | undefined,
      ...(firebaseAuthErro ? { firebaseAuthErro } : {}),
    };
  } catch {
    return { fallbackLocal: true };
  }
}

export async function redefinirSenhaRevogadaServidor(
  lojaId: string,
  novaSenha: string,
  senhaHash: string,
  senhaSalt: string,
  senhaAtual?: string
): Promise<{
  fallbackLocal?: boolean;
  autenticado?: boolean;
  erro?: string;
  firebaseAuthErro?: string;
}> {
  if (typeof window === 'undefined') return { fallbackLocal: true };
  try {
    const resp = await fetch('/api/auth', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        acao: 'redefinir_senha_revogada',
        lojaId,
        novaSenha,
        senhaHash,
        senhaSalt,
        senhaAtual: senhaAtual || '',
      }),
    });
    const data = await resp.json().catch(() => ({}));
    if (resp.status === 503 || data?.configurado === false) {
      return { fallbackLocal: true };
    }
    if (!resp.ok) {
      return {
        fallbackLocal: false,
        autenticado: false,
        erro: data?.erro || 'Erro ao salvar nova senha no servidor.',
      };
    }
    let firebaseAuthErro: string | undefined = data?.customTokenErro
      ? String(data.customTokenErro)
      : undefined;
    if (firebaseAuthErro) {
      registrarErroFirebaseAuth(firebaseAuthErro);
    }
    if (data?.autenticado && data?.customToken) {
      const fb = await autenticarFirebaseComCustomToken(data.customToken, data?.firebaseProjectId);
      if (!fb.ok) firebaseAuthErro = fb.erro;
    } else if (data?.autenticado && !firebaseAuthErro) {
      firebaseAuthErro = 'Servidor autenticou, mas não retornou Firebase Custom Token.';
      registrarErroFirebaseAuth(firebaseAuthErro);
    }
    return {
      fallbackLocal: false,
      autenticado: Boolean(data?.autenticado),
      ...(firebaseAuthErro ? { firebaseAuthErro } : {}),
    };
  } catch {
    return { fallbackLocal: true };
  }
}

export async function autenticarMasterServidor(
  usuario: string,
  senha: string
): Promise<{
  fallbackLocal?: boolean;
  autenticado?: boolean;
  erro?: string;
  firebaseAuthErro?: string;
}> {
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
    let firebaseAuthErro: string | undefined = data?.customTokenErro
      ? String(data.customTokenErro)
      : undefined;
    if (firebaseAuthErro) {
      registrarErroFirebaseAuth(firebaseAuthErro);
    }
    if (data?.autenticado && data?.customToken) {
      const fb = await autenticarFirebaseComCustomToken(data.customToken, data?.firebaseProjectId);
      if (!fb.ok) firebaseAuthErro = fb.erro;
    } else if (data?.autenticado && !firebaseAuthErro) {
      firebaseAuthErro = 'Servidor autenticou, mas não retornou Firebase Custom Token.';
      registrarErroFirebaseAuth(firebaseAuthErro);
    }
    return {
      fallbackLocal: false,
      autenticado: Boolean(data?.autenticado),
      ...(firebaseAuthErro ? { firebaseAuthErro } : {}),
    };
  } catch {
    return { fallbackLocal: true };
  }
}

export async function renovarSessaoFirebaseServidor(): Promise<{
  autenticado: boolean;
  fallbackLocal?: boolean;
  erro?: string;
}> {
  if (typeof window === 'undefined') return { autenticado: false, fallbackLocal: true };
  try {
    const resp = await fetch('/api/auth', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'renovar_custom_token' }),
    });
    const data = await resp.json().catch(() => ({}));
    if (resp.status === 503 || data?.configurado === false) {
      const msg = String(
        data?.erro || 'FIREBASE_SERVICE_ACCOUNT_JSON não configurado no servidor.'
      );
      registrarErroFirebaseAuth(msg);
      return { autenticado: false, fallbackLocal: true, erro: msg };
    }
    if (!resp.ok || !data?.autenticado || !data?.customToken) {
      const msg = String(
        data?.customTokenErro || data?.erro || 'Sessão de servidor expirada. Faça login novamente.'
      );
      registrarErroFirebaseAuth(msg);
      return {
        autenticado: false,
        fallbackLocal: false,
        erro: msg,
      };
    }
    const fb = await autenticarFirebaseComCustomToken(data.customToken, data?.firebaseProjectId);
    if (!fb.ok) {
      return {
        autenticado: false,
        fallbackLocal: false,
        erro: fb.erro || 'Falha ao autenticar token no Firebase.',
      };
    }
    return { autenticado: true, fallbackLocal: false };
  } catch {
    return { autenticado: false, fallbackLocal: true };
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
  limparUltimoErroFirebaseAuth();
  if (typeof window === 'undefined') return;
  try {
    await fetch('/api/auth', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'logout_sessao' }),
    }).catch(() => {});
  } catch {}
  if (!auth) return;
  try {
    await signOut(auth);
  } catch {}
}

export async function buscarPedidoMotoboyServidor(
  numeroPedido: string,
  motoboyToken: string
): Promise<{
  fallbackLocal?: boolean;
  sucesso: boolean;
  expirado?: boolean;
  pedido?: PedidoDelivery;
  loja?: Partial<Supermercado> | null;
  erro?: string;
}> {
  if (typeof window === 'undefined') return { fallbackLocal: true, sucesso: false };
  try {
    const resp = await fetch('/api/motoboy', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'buscar_pedido', numeroPedido, motoboyToken }),
    });
    const data = await resp.json().catch(() => ({}));
    if (resp.status === 503 || data?.configurado === false) {
      return { fallbackLocal: true, sucesso: false };
    }
    if (!resp.ok || !data?.sucesso) {
      return {
        fallbackLocal: false,
        sucesso: false,
        expirado: Boolean(data?.expirado),
        erro: data?.erro || 'Pedido de entrega não encontrado.',
      };
    }
    return {
      fallbackLocal: false,
      sucesso: true,
      pedido: data.pedido as PedidoDelivery,
      loja: (data.loja as Partial<Supermercado>) || null,
    };
  } catch {
    return { fallbackLocal: true, sucesso: false };
  }
}

export async function confirmarPinEntregaMotoboyServidor(
  pedidoId: string,
  numeroPedido: string,
  motoboyToken: string,
  pin: string
): Promise<{
  fallbackLocal?: boolean;
  sucesso: boolean;
  bloqueado?: boolean;
  tentativasPinEntrega?: number;
  pedido?: PedidoDelivery;
  erro?: string;
}> {
  if (typeof window === 'undefined') return { fallbackLocal: true, sucesso: false };
  try {
    const resp = await fetch('/api/motoboy', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'confirmar_pin', pedidoId, numeroPedido, motoboyToken, pin }),
    });
    const data = await resp.json().catch(() => ({}));
    if (resp.status === 503 || data?.configurado === false) {
      return { fallbackLocal: true, sucesso: false };
    }
    if (!resp.ok || !data?.sucesso) {
      return {
        fallbackLocal: false,
        sucesso: false,
        bloqueado: Boolean(data?.bloqueado || resp.status === 429),
        tentativasPinEntrega:
          typeof data?.tentativasPinEntrega === 'number' ? data.tentativasPinEntrega : undefined,
        erro: data?.erro || 'PIN incorreto.',
      };
    }
    return {
      fallbackLocal: false,
      sucesso: true,
      pedido: data.pedido as PedidoDelivery | undefined,
    };
  } catch {
    return { fallbackLocal: true, sucesso: false };
  }
}
