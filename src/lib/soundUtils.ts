// Audio synth for cashier beeps and sale notifications using Web Audio API
let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function tocarBeepCaixa() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, ctx.currentTime); // High pitched clean beep
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}

export function tocarSomSucessoVenda() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // First note
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    // Second note
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(659.25, now + 0.1); // E5
    gain2.gain.setValueAtTime(0.18, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.25);

    // Third chord
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(783.99, now + 0.2); // G5
    gain3.gain.setValueAtTime(0.2, now + 0.2);
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
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.setValueAtTime(220, now + 0.1);
    gain.gain.setValueAtTime(0.12, now);
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
 * Reproduz voz sintética em português para alertas essenciais do lojista e entregador
 */
function falarTextoComVoz(texto: string, repeteVezes = 1, intervaloMs = 2000) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    const synth = window.speechSynthesis;
    synth.cancel();

    let vezes = 0;
    const falar = () => {
      if (vezes >= repeteVezes) return;
      vezes++;
      const utter = new SpeechSynthesisUtterance(texto);
      utter.lang = 'pt-BR';
      utter.rate = 1.05; // ritmo ágil
      utter.pitch = 1.2; // tom chamativo e nítido
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
 * Toca o som característico de NOVO PEDIDO DE DELIVERY chegando na loja (estilo Zé Delivery/iFood)
 * Toca o toque de chamada e fala "Delivery! Delivery! Novo pedido!"
 */
export function tocarAlertaNovoPedidoDelivery() {
  try {
    const ctx = getAudioContext();
    if (ctx) {
      const tocarVinheta = (atrasoSegundos: number) => {
        const now = ctx.currentTime + atrasoSegundos;

        // Ding (Tom 1)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now); // A5
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.25);

        // Dong (Tom 2 Mais Agudo)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1174.66, now + 0.12); // D6
        gain2.gain.setValueAtTime(0.35, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.45);

        // Som de Campainha Harmônica
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.type = 'triangle';
        osc3.frequency.setValueAtTime(1760, now + 0.26); // A6
        gain3.gain.setValueAtTime(0.28, now + 0.26);
        gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.start(now + 0.26);
        osc3.stop(now + 0.65);
      };

      // Toca a vinheta dupla de chamada
      tocarVinheta(0);
      tocarVinheta(1.2);
    }

    // Alerta falado "Delivery! Delivery! Novo pedido!" repetindo para chamar atenção imediata
    falarTextoComVoz('Delivery! Delivery! Novo pedido!', 2, 2200);
  } catch (err) {
    console.warn('Erro ao tocar som de delivery:', err);
  }
}

/**
 * Toca toque DIFERENTE e exclusivo para quando o motoboy FINALIZAR a entrega
 * Fanfarra confirmativa de conclusão + sino de caixa + voz "Entrega finalizada com sucesso!"
 */
export function tocarSomEntregaFinalizadaMotoboy() {
  try {
    const ctx = getAudioContext();
    if (ctx) {
      const now = ctx.currentTime;

      // Fanfarra ascendente alegre e vibrante (G4 -> B4 -> D5 -> G5)
      const notas = [
        { freq: 392.00, inicio: 0, dur: 0.12, ganho: 0.22 },
        { freq: 493.88, inicio: 0.11, dur: 0.12, ganho: 0.24 },
        { freq: 587.33, inicio: 0.22, dur: 0.14, ganho: 0.28 },
        { freq: 783.99, inicio: 0.35, dur: 0.45, ganho: 0.38 },
      ];

      notas.forEach(({ freq, inicio, dur, ganho }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + inicio);
        g.gain.setValueAtTime(ganho, now + inicio);
        g.gain.exponentialRampToValueAtTime(0.001, now + inicio + dur);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + inicio);
        osc.stop(now + inicio + dur);
      });

      // Efeito brilhante de conclusão de entrega (sino agudo)
      const oscSino = ctx.createOscillator();
      const gainSino = ctx.createGain();
      oscSino.type = 'triangle';
      oscSino.frequency.setValueAtTime(2093, now + 0.42); // C7
      gainSino.gain.setValueAtTime(0.35, now + 0.42);
      gainSino.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      oscSino.connect(gainSino);
      gainSino.connect(ctx.destination);
      oscSino.start(now + 0.42);
      oscSino.stop(now + 1.2);
    }

    // Voz de confirmação de entrega concluída
    falarTextoComVoz('Entrega finalizada com sucesso! Pedido entregue!', 1);
  } catch (err) {
    console.warn('Erro ao tocar som de entrega finalizada:', err);
  }
}
