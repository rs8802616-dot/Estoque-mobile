import { SessaoUsuario, Supermercado, OperadorCaixa } from '../types';

export const MIN_CARACTERES_SENHA = 6;
export const MAX_TENTATIVAS_LOGIN = 5;
export const MINUTOS_BLOQUEIO_LOGIN = 15;
export const TEMPO_BLOQUEIO_LOGIN_MS = MINUTOS_BLOQUEIO_LOGIN * 60 * 1000;

export interface LogAuditoriaLogin {
  id: string;
  dataHora: string;
  timestamp: number;
  usuario: string;
  lojaId?: string;
  lojaNome?: string;
  portal: 'master' | 'loja';
  sucesso: boolean;
  motivo: string;
}

const CHAVE_AUDITORIA_LOGIN = 'auditoria_tentativas_login_v1';

/**
 * Gera um Salt aleatório de 16 bytes em formato hexadecimal (32 caracteres hex).
 */
export function gerarSaltHex(bytes = 16): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(bytes);
    window.crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
  }
  let hex = '';
  for (let i = 0; i < bytes * 2; i++) {
    hex += Math.floor(Math.random() * 16).toString(16);
  }
  return hex;
}

/**
 * Implementação SHA-256 via Web Crypto API (com fallback síncrono determinístico se Web Crypto indisponível).
 */
export async function hashSenhaSha256(senha: string, salt: string): Promise<string> {
  const payload = `${salt}:${senha}`;
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback determinístico de 64 chars hex caso executado fora de contexto seguro HTTPS/localhost
  let h1 = 0xdeadbeef ^ payload.length;
  let h2 = 0x41c6ce57 ^ payload.length;
  for (let i = 0, ch; i < payload.length; i++) {
    ch = payload.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const baseHex = (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
  return baseHex.repeat(4).slice(0, 64);
}

/**
 * Cria um novo par { senhaHash, senhaSalt } usando SHA-256 + Salt de 16 bytes.
 */
export async function criarHashComSalt(senha: string): Promise<{ senhaHash: string; senhaSalt: string }> {
  const senhaSalt = gerarSaltHex(16);
  const senhaHash = await hashSenhaSha256(senha, senhaSalt);
  return { senhaHash, senhaSalt };
}

/**
 * Verifica se a senha digitada bate com o hash + salt armazenado.
 * Caso a conta seja legada (ainda sem hash/salt), compara apenas com a senha cadastrada dessa própria conta (sem senhas coringa).
 */
export async function verificarSenhaComHash(
  senhaDigitada: string,
  senhaHash?: string,
  senhaSalt?: string,
  senhaLegadaEspecifica?: string
): Promise<boolean> {
  if (!senhaDigitada) return false;
  if (senhaHash && senhaSalt) {
    const hashCalculado = await hashSenhaSha256(senhaDigitada, senhaSalt);
    return hashCalculado === senhaHash;
  }
  if (senhaLegadaEspecifica && senhaLegadaEspecifica.trim().length > 0) {
    return senhaDigitada === senhaLegadaEspecifica;
  }
  return false;
}

/**
 * Valida a política obrigatória de senhas:
 * - Mínimo de 6 caracteres
 * - Confirmação dupla idêntica (Nova Senha === Confirmar Nova Senha)
 */
export function validarPoliticaSenha(
  novaSenha: string,
  confirmarNovaSenha?: string
): { valida: boolean; erro?: string } {
  const s1 = (novaSenha || '').trim();
  if (s1.length < MIN_CARACTERES_SENHA) {
    return {
      valida: false,
      erro: `A senha deve ter no mínimo ${MIN_CARACTERES_SENHA} caracteres por segurança.`,
    };
  }
  if (confirmarNovaSenha !== undefined) {
    const s2 = (confirmarNovaSenha || '').trim();
    if (s1 !== s2) {
      return {
        valida: false,
        erro: 'A confirmação de senha não confere! Digite exatamente a mesma senha nos dois campos.',
      };
    }
  }
  return { valida: true };
}

/**
 * Higienização de Sessão no Navegador (Zero Plaintext / Zero Hash Leak na sessão ativa).
 */
export function sanitizeUserForSession<T extends Record<string, any>>(userOrSession: T): T {
  if (!userOrSession || typeof userOrSession !== 'object') return userOrSession;
  const clone: Record<string, any> = { ...userOrSession };
  delete clone.senha;
  delete clone.senhaAdmin;
  delete clone.pinSenha;
  delete clone.senhaHash;
  delete clone.senhaSalt;
  return clone as T;
}

export function sanitizarSupermercadoSemTextoPuro(loja: Supermercado): Supermercado {
  if (loja.senhaHash && loja.senhaSalt) {
    return {
      ...loja,
      senha: '',
      senhaAdmin: '',
    };
  }
  return loja;
}

export function sanitizarOperadorSemTextoPuro(op: OperadorCaixa): OperadorCaixa {
  if (op.senhaHash && op.senhaSalt) {
    return {
      ...op,
      pinSenha: '',
    };
  }
  return op;
}

/**
 * Central de Auditoria de Tentativas de Login (visível no painel SuperAdmin do Dono)
 */
export function obterLogsAuditoriaLogin(): LogAuditoriaLogin[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CHAVE_AUDITORIA_LOGIN);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function registrarAuditoriaLogin(dados: Omit<LogAuditoriaLogin, 'id' | 'dataHora' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  try {
    const agora = new Date();
    const novo: LogAuditoriaLogin = {
      id: `aud_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      dataHora: `${agora.toLocaleDateString('pt-BR')} às ${agora.toLocaleTimeString('pt-BR')}`,
      timestamp: Date.now(),
      ...dados,
    };
    const atuais = obterLogsAuditoriaLogin();
    const atualizados = [novo, ...atuais].slice(0, 120);
    localStorage.setItem(CHAVE_AUDITORIA_LOGIN, JSON.stringify(atualizados));
  } catch {}
}

export function limparLogsAuditoriaLogin(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CHAVE_AUDITORIA_LOGIN);
}

/**
 * Controle de Lockout (5 erros consecutivos em 15 minutos) por Loja / Usuário
 */
export function obterChavesLockout(escopoId = 'global') {
  return {
    tentativas: `tentativas_falhas_login_${escopoId}`,
    primeiroErroTs: `primeiro_erro_login_ts_${escopoId}`,
    bloqueioTs: `bloqueio_login_timestamp_${escopoId}`,
  };
}

export function revogarLockoutLoja(lojaId?: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('bloqueio_login_timestamp');
  localStorage.removeItem('tentativas_falhas_login');
  if (lojaId) {
    const chaves = obterChavesLockout(lojaId);
    localStorage.removeItem(chaves.tentativas);
    localStorage.removeItem(chaves.primeiroErroTs);
    localStorage.removeItem(chaves.bloqueioTs);
  }
}
