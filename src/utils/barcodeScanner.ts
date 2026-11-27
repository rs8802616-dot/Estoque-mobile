export interface OpcoesDetectorBipHardware {
  minLength?: number;
  maxGapMs?: number;
  maxEnterGapMs?: number;
  maxAvgMs?: number;
}

export interface EventoTeclaScanner {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  now?: number;
  targetId?: string | null;
  targetValue?: string | null;
  aceitarTab?: boolean;
}

export type ResultadoDetectorScanner =
  | { disparou: false }
  | {
      disparou: true;
      codigo: string;
      targetId: string | null;
      preValue: string | null;
    };

const TECLAS_MODIFICADORAS = new Set([
  'Shift',
  'Control',
  'Alt',
  'Meta',
  'CapsLock',
  'NumLock',
  'ScrollLock',
  'Dead',
  'Process',
]);

/**
 * Identifica códigos de barras comerciais padrão (EAN-8, UPC-A, EAN-13, GTIN-14).
 */
export function isCodigoBarrasNumerico(codigo: string): boolean {
  return /^\d{8,14}$/.test(String(codigo || '').trim());
}

/**
 * Remove caracteres digitados rapidamente pelo leitor caso o foco estivesse em outro campo.
 */
export function removerSufixoBipado(
  valorAtual: string,
  codigoLido: string,
  valorAntesDoBurst?: string | null
): string {
  const atual = String(valorAtual ?? '');
  const codigo = String(codigoLido ?? '');
  if (!codigo) return atual;

  if (typeof valorAntesDoBurst === 'string') {
    if (atual === valorAntesDoBurst) return atual;
    if (atual.endsWith(codigo) || atual.includes(codigo)) {
      return valorAntesDoBurst;
    }
    if (/^\d+$/.test(codigo)) {
      const codigoSemZeros = codigo.replace(/^0+/, '') || '0';
      if (atual.startsWith(valorAntesDoBurst)) {
        const sobra = atual.slice(valorAntesDoBurst.length);
        if (sobra === codigo || sobra === codigoSemZeros) {
          return valorAntesDoBurst;
        }
      }
      if (valorAntesDoBurst === '' && (atual === codigo || atual === codigoSemZeros)) {
        return '';
      }
      if (Number(valorAntesDoBurst) === 0 && (atual === codigo || atual === codigoSemZeros)) {
        return valorAntesDoBurst;
      }
    }
  }

  if (atual.endsWith(codigo)) {
    return atual.slice(0, atual.length - codigo.length);
  }
  return atual;
}

/**
 * Detector de rajadas rápidas de teclado emitidas por leitores de código de barras USB/Bluetooth.
 */
export function criarDetectorBipHardware(opcoes: OpcoesDetectorBipHardware = {}) {
  const minLength = opcoes.minLength ?? 4;
  const maxGapMs = opcoes.maxGapMs ?? 120;
  const maxEnterGapMs = opcoes.maxEnterGapMs ?? 140;
  const maxAvgMs = opcoes.maxAvgMs ?? 80;

  let buffer = '';
  let firstKeyTime = 0;
  let lastKeyTime = 0;
  let targetId: string | null = null;
  let preValue: string | null = null;

  const resetar = () => {
    buffer = '';
    firstKeyTime = 0;
    lastKeyTime = 0;
    targetId = null;
    preValue = null;
  };

  const processarTecla = (params: EventoTeclaScanner): ResultadoDetectorScanner => {
    const key = String(params.key || '');
    if (!key) return { disparou: false };

    if (TECLAS_MODIFICADORAS.has(key)) {
      return { disparou: false };
    }

    if (params.ctrlKey || params.altKey || params.metaKey) {
      resetar();
      return { disparou: false };
    }

    const now = typeof params.now === 'number' ? params.now : Date.now();

    if (key === 'Enter' || (params.aceitarTab && key === 'Tab')) {
      if (!buffer) {
        resetar();
        return { disparou: false };
      }
      const diff = now - lastKeyTime;
      const avg = buffer.length > 1 ? (lastKeyTime - firstKeyTime) / (buffer.length - 1) : 0;
      const tabValido = key !== 'Tab' || (buffer.length >= 6 && /^\d+$/.test(buffer));

      if (buffer.length >= minLength && diff <= maxEnterGapMs && avg <= maxAvgMs && tabValido) {
        const codigo = buffer.trim();
        const capturedTargetId = targetId;
        const capturedPreValue = preValue;
        resetar();
        if (codigo.length >= minLength) {
          return {
            disparou: true,
            codigo,
            targetId: capturedTargetId,
            preValue: capturedPreValue,
          };
        }
      }
      resetar();
      return { disparou: false };
    }

    if (key.length === 1) {
      if (!buffer || now - lastKeyTime > maxGapMs) {
        buffer = key;
        firstKeyTime = now;
        lastKeyTime = now;
        targetId = params.targetId ?? null;
        preValue = typeof params.targetValue === 'string' ? params.targetValue : null;
      } else {
        buffer += key;
        lastKeyTime = now;
      }
      return { disparou: false };
    }

    resetar();
    return { disparou: false };
  };

  return {
    processarTecla,
    resetar,
  };
}
