import { doc, setDoc, onSnapshot, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { safeLocalStorageSet } from './safeStorage';
import { SessaoUsuario, SessaoAtivaDoc } from '../types';

// Detecta nome amigável do dispositivo
export function obterDescricaoDispositivo(): string {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'Dispositivo Desconhecido';
  const ua = navigator.userAgent;

  let os = 'Dispositivo';
  if (/android/i.test(ua)) os = '📱 Celular/Tablet Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = '🍎 iPhone/iPad Apple';
  else if (/windows/i.test(ua)) os = '💻 Computador Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = '🖥️ Computador Mac';
  else if (/linux/i.test(ua)) os = '🐧 Computador Linux';

  let browser = '';
  if (/chrome|crios/i.test(ua) && !/edge|opr\//i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = 'Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/edge|edg/i.test(ua)) browser = 'Edge';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';

  return browser ? `${os} (${browser})` : os;
}

// Gera token único para a sessão do dispositivo
export function gerarSessaoToken(): string {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  const devicePart = (typeof navigator !== 'undefined' ? (navigator.userAgent.length % 999).toString(36) : 'dev');
  return `sess_${time}_${random}_${devicePart}`;
}

// Canal de comunicação entre abas no mesmo navegador
let sessionBroadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    sessionBroadcastChannel = new BroadcastChannel('supermercado_session_channel');
  }
} catch (e) {
  // Fallback
}

// Gera a chave única de identificação da conta
export function obterUserKey(sessao?: Partial<SessaoUsuario>): string {
  if (!sessao) return 'user_anonimo';
  if (sessao.tipo === 'dona_app') {
    return 'user_master';
  }
  if (sessao.tipo === 'admin_loja') {
    return `admin_loja_${sessao.lojaId || 'default'}`;
  }
  if (sessao.tipo === 'caixa') {
    return `operador_${sessao.lojaId || 'loja'}_${sessao.operadorId || 'caixa_default'}`;
  }
  return 'user_anonimo';
}

// Registra a nova sessão ativa no Firestore e desautoriza sessões anteriores deste mesmo usuário
export async function registrarSessaoAtivaNoFirestore(sessao: SessaoUsuario, sessaoToken: string): Promise<void> {
  if (!sessao) return;
  const userKey = sessao.userKey || obterUserKey(sessao);
  const infoAparelho = obterDescricaoDispositivo();
  
  // Salva localmente o token e userKey de forma segura
  safeLocalStorageSet('sessao_ativa_token', sessaoToken);
  safeLocalStorageSet('sessao_ativa_user_key', userKey);

  // Notifica outras abas locais
  if (sessionBroadcastChannel) {
    try {
      sessionBroadcastChannel.postMessage({
        type: 'NEW_LOGIN',
        userKey,
        sessaoToken,
        dispositivo: infoAparelho,
      });
    } catch (e) {}
  }

  try {
    const docRef = doc(db, 'sessoes_ativas', userKey);
    const payload: SessaoAtivaDoc = {
      userKey,
      sessaoToken,
      tipo: sessao.tipo,
      usuarioNome: sessao.operadorNome || sessao.lojaNome || 'Proprietário(a) do App',
      lojaId: sessao.lojaId,
      operadorId: sessao.operadorId,
      dataLogin: new Date().toISOString(),
      dispositivoInfo: infoAparelho,
    };

    await setDoc(docRef, payload);
    console.log(`🔒 Sessão única ativada no Firestore para [${userKey}] com token [${sessaoToken}] no ${infoAparelho}`);
  } catch (err) {
    console.warn('Aviso: Falha ao registrar sessão ativa no Firestore (operando em modo offline local):', err);
  }
}

// Ouve em tempo real o documento da sessão. Se outro aparelho fizer login com esta mesma conta, o token muda e este aparelho é desconectado!
export function monitorarSessaoUnicaDispositivo(
  userKey: string,
  sessaoTokenAtual: string,
  onDesconectarPorConcorrencia: (motivo: string) => void
): () => void {
  if (!userKey || !sessaoTokenAtual) {
    return () => {};
  }

  // Listener para outras abas locais
  const handleBroadcastMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === 'NEW_LOGIN') {
      if (event.data.userKey === userKey && event.data.sessaoToken !== sessaoTokenAtual) {
        console.warn(`🛑 Sessão invalidada via Broadcast! Conta acessada em outra aba/dispositivo.`);
        onDesconectarPorConcorrencia(
          `Você foi desconectado porque esta conta acabou de ser acessada em outro dispositivo (${event.data.dispositivo || 'Outro aparelho'}). Para sua segurança, não é permitido o mesmo usuário conectado em dois aparelhos simultaneamente.`
        );
      }
    }
  };

  if (sessionBroadcastChannel) {
    sessionBroadcastChannel.addEventListener('message', handleBroadcastMessage);
  }

  try {
    const docRef = doc(db, 'sessoes_ativas', userKey);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          return;
        }
        const data = snapshot.data() as SessaoAtivaDoc;
        if (data && data.sessaoToken && data.sessaoToken !== sessaoTokenAtual) {
          console.warn(`🛑 Sessão invalidada! Outro aparelho conectou-se à conta [${userKey}]. Token atual: ${sessaoTokenAtual}, Novo token: ${data.sessaoToken}`);
          onDesconectarPorConcorrencia(
            `Você foi desconectado porque esta conta acabou de ser acessada em outro dispositivo (${data.dispositivoInfo || 'Outro aparelho'}). Para sua segurança, não é permitido o mesmo usuário conectado em dois aparelhos simultaneamente.`
          );
        }
      },
      (error) => {
        // Fallback silencioso se offline
        console.warn('Monitoramento de sessão em espera (offline):', error);
      }
    );

    return () => {
      unsubscribe();
      if (sessionBroadcastChannel) {
        sessionBroadcastChannel.removeEventListener('message', handleBroadcastMessage);
      }
    };
  } catch (err) {
    console.warn('Erro ao inicializar monitoramento de sessão única:', err);
    return () => {
      if (sessionBroadcastChannel) {
        sessionBroadcastChannel.removeEventListener('message', handleBroadcastMessage);
      }
    };
  }
}

// Encerra a sessão ativa ao fazer logout
export async function encerrarSessaoAtivaNoFirestore(userKey: string, sessaoTokenAtual: string): Promise<void> {
  try {
    localStorage.removeItem('sessao_ativa_token');
    localStorage.removeItem('sessao_ativa_user_key');
    const docRef = doc(db, 'sessoes_ativas', userKey);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as SessaoAtivaDoc;
      if (data.sessaoToken === sessaoTokenAtual) {
        await deleteDoc(docRef);
      }
    }
  } catch (e) {
    console.warn('Aviso ao encerrar sessão no Firestore:', e);
  }
}
