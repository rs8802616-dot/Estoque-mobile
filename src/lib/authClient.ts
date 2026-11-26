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
    if (data?.autenticado && data?.customToken && auth) {
      await signInWithCustomToken(auth, data.customToken);
    }
    return {
      fallbackLocal: false,
      autenticado: Boolean(data?.autenticado),
      operador: data?.operador as OperadorCaixa | undefined,
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
    if (data?.autenticado && data?.customToken && auth) {
      await signInWithCustomToken(auth, data.customToken);
    }
    return {
      fallbackLocal: false,
      autenticado: Boolean(data?.autenticado),
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
