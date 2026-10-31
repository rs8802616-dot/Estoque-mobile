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

/**
 * Toca o som característico de NOVO PEDIDO DE DELIVERY chegando na loja (estilo Zé Delivery/iFood)
 * Toca o toque de campainha de alta intensidade e fala "Delivery! Delivery! Novo pedido!"
 */
export function tocarAlertaNovoPedidoDelivery() {
  desbloquearAudio();

  // 1. Toca sinal sonoro via WAV fallback garantido
  tocarWavSintetizado('delivery');

  // 2. Toca também via Web Audio API para timbre cristalino de alta fidelidade
  try {
    const ctx = getAudioContext();
    if (ctx) {
      const tocarVinheta = (atrasoSegundos: number) => {
        const now = ctx.currentTime + atrasoSegundos;

        // Ding (Tom 1)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now);
        gain1.gain.setValueAtTime(0.4, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.25);

        // Dong (Tom 2 Mais Agudo)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1174.66, now + 0.12);
        gain2.gain.setValueAtTime(0.45, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.45);

        // Campainha
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(1760, now + 0.26);
        gain3.gain.setValueAtTime(0.35, now + 0.26);
        gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.start(now + 0.26);
        osc3.stop(now + 0.65);
      };

      tocarVinheta(0);
      tocarVinheta(0.65);
    }
  } catch (err) {
    console.warn('Erro ao tocar Web Audio de delivery:', err);
  }

  // 3. Alerta falado "Delivery! Delivery! Novo pedido!"
  setTimeout(() => {
    falarTextoComVoz('Delivery! Delivery! Novo pedido!', 2, 2000);
  }, 100);
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
