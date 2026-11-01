// Audio synth for cashier beeps, sale notifications, and delivery alarms
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
}

// Instância pré-carregada do áudio do Sino Bell1 (Freesound lth_stp)
let audioSinoNovoPedido: HTMLAudioElement | null = null;

function obterAudioSino(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!audioSinoNovoPedido) {
    audioSinoNovoPedido = new Audio('/som_novo_pedido.mp3');
    audioSinoNovoPedido.preload = 'auto';
  }
  return audioSinoNovoPedido;
}

/**
 * Desbloqueia ativamente o contexto de áudio e síntese de voz na primeira interação do usuário.
 * Necessário pelas políticas de Autoplay dos navegadores (Chrome, Safari, Edge, Android).
 */
export function desbloquearAudio() {
  if (typeof window === 'undefined') return;

  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    if (ctx) {
      // Dispara um micro buffer inaudível para forçar o hardware de som do aparelho a ligar
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    }

    // Pré-carrega e desbloqueia o áudio HTML5 do sino de mão
    const audioSino = obterAudioSino();
    if (audioSino) {
      audioSino.load();
    }

    // Inicializa a síntese de voz
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }
  } catch (e) {
    console.warn('Erro ao desbloquear áudio:', e);
  }
}

// Escuta a primeira interação do usuário na página para desbloquear áudio imediatamente
if (typeof window !== 'undefined') {
  const eventos = ['click', 'touchstart', 'touchend', 'keydown', 'mousedown'];
  const handler = () => {
    desbloquearAudio();
  };
  eventos.forEach((ev) => {
    window.addEventListener(ev, handler, { passive: true });
  });
}

/**
 * Toca um bipe curto de leitor de código de barras
 */
export function tocarBeepCaixa() {
  try {
    desbloquearAudio();
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}

/**
 * Toca o som de venda confirmada no caixa
 */
export function tocarSomSucessoVenda() {
  try {
    desbloquearAudio();
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(659.25, now + 0.1); // E5
    gain2.gain.setValueAtTime(0.22, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.25);

    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(783.99, now + 0.2); // G5
    gain3.gain.setValueAtTime(0.25, now + 0.2);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.2);
    osc3.stop(now + 0.45);
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}

export function tocarSomAlerta() {
  try {
    desbloquearAudio();
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.setValueAtTime(220, now + 0.1);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch (err) {
    console.warn('Audio alert error:', err);
  }
}

/**
 * Fala texto em português com voz sintética no navegador de forma compatível
 */
export function falarTextoComVoz(texto: string, repeteVezes = 1, intervaloMs = 2000) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  // Bloqueio rigoroso: nunca falar a palavra "delivery"
  if (!texto || texto.toLowerCase().includes('delivery')) return;

  try {
    const synth = window.speechSynthesis;
    if (synth.paused) {
      synth.resume();
    }

    const vozes = synth.getVoices() || [];
    const vozPt = vozes.find((v) =>
      v.lang.toLowerCase().includes('pt') ||
      v.name.toLowerCase().includes('brazil') ||
      v.name.toLowerCase().includes('portuguese')
    );

    let vezes = 0;
    const falar = () => {
      if (vezes >= repeteVezes) return;
      vezes++;

      const utter = new SpeechSynthesisUtterance(texto);
      utter.lang = 'pt-BR';
      if (vozPt) utter.voice = vozPt;
      utter.rate = 1.05;
      utter.pitch = 1.2;
      utter.volume = 1.0;

      synth.speak(utter);

      if (vezes < repeteVezes) {
        setTimeout(falar, intervaloMs);
      }
    };

    falar();
  } catch (e) {
    console.warn('SpeechSynthesis aviso:', e);
  }
}

/**
 * Gera e toca um sinal sonoro sintetizado em WAV para garantir reprodução mesmo se o AudioContext falhar
 */
function tocarWavSintetizado(tipo: 'delivery' | 'motoboy') {
  if (typeof window === 'undefined') return;

  try {
    const sampleRate = 22050;
    const duracao = tipo === 'delivery' ? 1.4 : 1.2;
    const numSamples = Math.floor(sampleRate * duracao);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    const tons = tipo === 'delivery'
      ? [[880, 0, 0.35, 0.45], [1174, 0.14, 0.45, 0.55], [880, 0.65, 0.35, 0.45], [1174, 0.79, 0.55, 0.55]]
      : [[392, 0, 0.2, 0.4], [493, 0.12, 0.2, 0.45], [587, 0.24, 0.25, 0.5], [784, 0.38, 0.75, 0.6]];

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let s = 0;
      tons.forEach(([freq, inicio, dur, vol]) => {
        if (t >= inicio && t <= inicio + dur) {
          const env = Math.exp(-4 * (t - inicio));
          s += Math.sin(2 * Math.PI * freq * (t - inicio)) * vol * env;
        }
      });
      const val = Math.max(-32768, Math.min(32767, Math.floor(s * 32767)));
      view.setInt16(44 + i * 2, val, true);
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.volume = 1.0;
    audio.play().catch(() => {});
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  } catch (e) {
    console.warn('WAV sintético fallback aviso:', e);
  }
}

// Estado e controle de repetição do alerta de novo pedido
let alertaPedidoEmExecucao = false;
let timeoutRepeticaoAlerta: any = null;
const ouvintesStatusAlerta = new Set<(tocando: boolean) => void>();

export function registrarOuvinteStatusAlerta(cb: (tocando: boolean) => void): () => void {
  ouvintesStatusAlerta.add(cb);
  cb(alertaPedidoEmExecucao);
  return () => {
    ouvintesStatusAlerta.delete(cb);
  };
}

function notificarStatusAlerta(tocando: boolean) {
  ouvintesStatusAlerta.forEach((cb) => {
    try {
      cb(tocando);
    } catch (e) {}
  });
}

/**
 * Para IMEDIATAMENTE o toque do sino quando o lojista aceitar o pedido ou silenciar o alerta
 */
export function pararAlertaNovoPedidoDelivery() {
  alertaPedidoEmExecucao = false;
  if (timeoutRepeticaoAlerta) {
    clearTimeout(timeoutRepeticaoAlerta);
    timeoutRepeticaoAlerta = null;
  }
  const audio = obterAudioSino();
  if (audio) {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (e) {}
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  notificarStatusAlerta(false);
}

export function isAlertaNovoPedidoTocando(): boolean {
  return alertaPedidoEmExecucao;
}

/**
 * Toca EXCLUSIVAMENTE o toque de sino de mão escolhido (Bell 1 do Freesound)
 * Sem vozes nem bipes antigos.
 * Permite configurar o número de repetições (ex: 1, 2, 3, 5 ou 99 para contínuo até aceitar).
 * Para instantaneamente se o lojista aceitar o pedido ou chamar pararAlertaNovoPedidoDelivery().
 */
export function tocarAlertaNovoPedidoDelivery(repeticoes: number = 3) {
  desbloquearAudio();

  // Cancela qualquer fala ou áudio residual
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }

  // Se já estiver tocando, cancela o ciclo anterior para reiniciar limpo
  pararAlertaNovoPedidoDelivery();

  const maxRepeticoes = Number(repeticoes) > 0 ? Number(repeticoes) : 3;
  alertaPedidoEmExecucao = true;
  notificarStatusAlerta(true);

  let cicloAtual = 0;

  const tocarCiclo = () => {
    if (!alertaPedidoEmExecucao) return;

    cicloAtual++;
    const audio = obterAudioSino();
    if (!audio) {
      alertaPedidoEmExecucao = false;
      notificarStatusAlerta(false);
      return;
    }

    try {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1.0;

      const aoTerminar = () => {
        audio.removeEventListener('ended', aoTerminar);
        if (!alertaPedidoEmExecucao) return;

        // Se ainda não atingiu a quantidade máxima de repetições (99 = contínuo)
        if (maxRepeticoes >= 99 || cicloAtual < maxRepeticoes) {
          timeoutRepeticaoAlerta = setTimeout(() => {
            if (alertaPedidoEmExecucao) {
              tocarCiclo();
            }
          }, 800);
        } else {
          alertaPedidoEmExecucao = false;
          notificarStatusAlerta(false);
        }
      };

      audio.addEventListener('ended', aoTerminar);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('HTML5 Audio reprodução pendente de clique do usuário:', err);
          aoTerminar();
        });
      }
    } catch (err) {
      console.warn('Erro ao tocar audio do sino:', err);
      alertaPedidoEmExecucao = false;
      notificarStatusAlerta(false);
    }
  };

  tocarCiclo();
}

/**
 * Toca toque DIFERENTE e exclusivo para quando o motoboy FINALIZAR a entrega
 * Fanfarra confirmativa de conclusão + sino de caixa + voz "Entrega finalizada com sucesso!"
 */
export function tocarSomEntregaFinalizadaMotoboy() {
  desbloquearAudio();

  // 1. Toca sinal sonoro via WAV fallback garantido
  tocarWavSintetizado('motoboy');

  // 2. Toca também via Web Audio API
  try {
    const ctx = getAudioContext();
    if (ctx) {
      const now = ctx.currentTime;

      const notas = [
        { freq: 392.00, inicio: 0, dur: 0.12, ganho: 0.3 },
        { freq: 493.88, inicio: 0.11, dur: 0.12, ganho: 0.32 },
        { freq: 587.33, inicio: 0.22, dur: 0.14, ganho: 0.35 },
        { freq: 783.99, inicio: 0.35, dur: 0.45, ganho: 0.45 },
      ];

      notas.forEach(({ freq, inicio, dur, ganho }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + inicio);
        g.gain.setValueAtTime(ganho, now + inicio);
        g.gain.exponentialRampToValueAtTime(0.001, now + inicio + dur);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + inicio);
        osc.stop(now + inicio + dur);
      });

      // Efeito brilhante de conclusão de entrega
      const oscSino = ctx.createOscillator();
      const gainSino = ctx.createGain();
      oscSino.type = 'sine';
      oscSino.frequency.setValueAtTime(2093, now + 0.4);
      gainSino.gain.setValueAtTime(0.4, now + 0.4);
      gainSino.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      oscSino.connect(gainSino);
      gainSino.connect(ctx.destination);
      oscSino.start(now + 0.4);
      oscSino.stop(now + 1.2);
    }
  } catch (err) {
    console.warn('Erro ao tocar som de entrega finalizada:', err);
  }

  // 3. Voz de confirmação de entrega concluída
  setTimeout(() => {
    falarTextoComVoz('Entrega finalizada com sucesso! Pedido entregue!', 1);
  }, 100);
}
