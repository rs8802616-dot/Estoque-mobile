import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
  BinaryBitmap,
  RGBLuminanceSource,
  HybridBinarizer,
  MultiFormatReader,
} from '@zxing/library';

// Formatos padrão de varejo e comércio (bebidas, alimentos, produtos industriais e internos)
// NOTA IMPORTANTE: Removidos formatos sem checksum obrigatório (ITF, CODABAR, CODE_39, CODE_93)
// que causavam leituras aleatórias falsas quando a câmera ficava apontada para texturas ou sombras.
export const FORMATOS_BARRAS_PADRAO = [
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.CODE_128,
  BarcodeFormat.QR_CODE,
  BarcodeFormat.DATA_MATRIX,
];

// Validação de Checksum EAN-13 (Dígito Verificador Oficial Modulo 10)
export function validarChecksumEAN13(codigo: string): boolean {
  if (!/^\d{13}$/.test(codigo)) return false;
  let soma = 0;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(codigo[i], 10) * (i % 2 === 0 ? 1 : 3);
  }
  const digitoEsperado = (10 - (soma % 10)) % 10;
  return digitoEsperado === parseInt(codigo[12], 10);
}

// Validação de Checksum EAN-8 (Bebidas e produtos compactos)
export function validarChecksumEAN8(codigo: string): boolean {
  if (!/^\d{8}$/.test(codigo)) return false;
  let soma = 0;
  for (let i = 0; i < 7; i++) {
    soma += parseInt(codigo[i], 10) * (i % 2 === 0 ? 3 : 1);
  }
  const digitoEsperado = (10 - (soma % 10)) % 10;
  return digitoEsperado === parseInt(codigo[7], 10);
}

// Validação de Checksum UPC-A (12 dígitos numéricos)
export function validarChecksumUPCA(codigo: string): boolean {
  if (!/^\d{12}$/.test(codigo)) return false;
  let soma = 0;
  for (let i = 0; i < 11; i++) {
    soma += parseInt(codigo[i], 10) * (i % 2 === 0 ? 3 : 1);
  }
  const digitoEsperado = (10 - (soma % 10)) % 10;
  return digitoEsperado === parseInt(codigo[11], 10);
}

// Filtro rigoroso para descartar leituras aleatórias / ruídos de imagem
export function validarCodigoBarrasConfiavel(codigo: string): boolean {
  if (!codigo) return false;
  const limpo = codigo.trim();
  if (limpo.length < 3 || limpo.length > 80) return false;

  // Se tem 13 dígitos numéricos (EAN-13 padrão Brasil)
  if (limpo.length === 13 && /^\d+$/.test(limpo)) {
    return validarChecksumEAN13(limpo);
  }

  // Se tem 8 dígitos numéricos (EAN-8 padrão latas/garrafas pequenas)
  if (limpo.length === 8 && /^\d+$/.test(limpo)) {
    return validarChecksumEAN8(limpo);
  }

  // Se tem 12 dígitos numéricos (UPC-A)
  if (limpo.length === 12 && /^\d+$/.test(limpo)) {
    return validarChecksumUPCA(limpo);
  }

  // Se tem 14 dígitos numéricos (DUN-14 caixas de transporte)
  if (limpo.length === 14 && /^\d+$/.test(limpo)) {
    return true;
  }

  // Se for código interno com letras ou traços (ex: ESP-01, DOS-01, ADG-01, PROD-12)
  if (/^[A-Za-z0-9_\-\.]+$/.test(limpo) && limpo.length >= 4) {
    return true;
  }

  return false;
}

// Suporte nativo ao BarcodeDetector do navegador (Aceleração por Hardware GPU)
let detectorNativoInstance: any = null;
let detectorNativoInicializado = false;

export function obterDetectorNativo(): any | null {
  if (detectorNativoInicializado) return detectorNativoInstance;
  detectorNativoInicializado = true;

  if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
    try {
      const formats = ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'qr_code', 'data_matrix'];
      detectorNativoInstance = new (window as any).BarcodeDetector({ formats });
    } catch {
      detectorNativoInstance = null;
    }
  }
  return detectorNativoInstance;
}

// Decodificação direta ultra-rápida via API nativa do sistema operacional (Android / Safari)
export async function decodificarComDetectorNativo(
  elemento: HTMLVideoElement | HTMLCanvasElement
): Promise<string | null> {
  const detector = obterDetectorNativo();
  if (!detector) return null;

  try {
    const barcodes = await detector.detect(elemento);
    if (barcodes && barcodes.length > 0) {
      for (const b of barcodes) {
        const val = (b.rawValue || '').trim();
        if (val && validarCodigoBarrasConfiavel(val)) {
          return val;
        }
      }
    }
  } catch {}
  return null;
}

// Configuração otimizada de Hints do ZXing com TRY_HARDER para iOS Safari e Android
export function criarHintsLeitor(): Map<DecodeHintType, any> {
  const hints = new Map<DecodeHintType, any>();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, FORMATOS_BARRAS_PADRAO);
  hints.set(DecodeHintType.TRY_HARDER, true);
  return hints;
}

// Cria instância do BrowserMultiFormatReader com alta sensibilidade
export function criarLeitorZXing(): BrowserMultiFormatReader {
  const hints = criarHintsLeitor();
  return new BrowserMultiFormatReader(hints, 120);
}

// Leitor puro de memória para decodificar Canvas e Imagens com rotação
export function criarMultiFormatReaderPuro(): MultiFormatReader {
  const hints = criarHintsLeitor();
  const reader = new MultiFormatReader();
  reader.setHints(hints);
  return reader;
}

// Solicita a câmera com parâmetros otimizados e altamente compatíveis com Android e iPhone
export async function obterStreamCameraOtimizado(
  facingMode: 'environment' | 'user' = 'environment'
): Promise<MediaStream> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Câmera não suportada neste navegador ou ambiente sem HTTPS.');
  }

  // 1. Tenta câmera traseira com resolução ideal (sem min rígido que falhe em celulares)
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    });
    configurarTrackCamera(stream);
    return stream;
  } catch (err1) {
    console.warn('Tentativa 1 getUserMedia com resolução ideal falhou, tentando modo ideal simples:', err1);
  }

  // 2. Tenta apenas facingMode ideal sem constraints de dimensão
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: facingMode },
      },
    });
    configurarTrackCamera(stream);
    return stream;
  } catch (err2) {
    console.warn('Tentativa 2 getUserMedia falhou, tentando fallback genérico:', err2);
  }

  // 3. Fallback genérico para qualquer câmera disponível
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  configurarTrackCamera(stream);
  return stream;
}

// Configura foco contínuo e parâmetros do sensor
export function configurarTrackCamera(stream: MediaStream) {
  const track = stream.getVideoTracks()[0];
  if (!track || !track.getCapabilities) return;
  try {
    // @ts-ignore
    const capabilities = track.getCapabilities() || {};
    const advancedConstraints: any = {};

    // @ts-ignore
    if (capabilities.focusMode && Array.isArray(capabilities.focusMode) && capabilities.focusMode.includes('continuous')) {
      advancedConstraints.focusMode = 'continuous';
    }

    // @ts-ignore
    if (capabilities.exposureMode && Array.isArray(capabilities.exposureMode) && capabilities.exposureMode.includes('continuous')) {
      advancedConstraints.exposureMode = 'continuous';
    }

    // Zoom leve de 1.4x para permitir manter o celular a 15-20cm com foco nítido em latas e pacotes
    // @ts-ignore
    if (capabilities.zoom) {
      // @ts-ignore
      const min = capabilities.zoom.min || 1;
      // @ts-ignore
      const max = capabilities.zoom.max || 5;
      advancedConstraints.zoom = Math.min(max, Math.max(min, 1.4));
    }

    if (Object.keys(advancedConstraints).length > 0) {
      // @ts-ignore
      track.applyConstraints({ advanced: [advancedConstraints] }).catch(() => {});
    }
  } catch {}
}

// Aplica zoom digital ou óptico na câmera (ajuda muito em iPhone para focar códigos pequenos)
export async function aplicarZoomCamera(stream: MediaStream | null, nivelZoom: number): Promise<boolean> {
  if (!stream) return false;
  const track = stream.getVideoTracks()[0];
  if (!track || !track.getCapabilities) return false;

  try {
    // @ts-ignore
    const capabilities = track.getCapabilities() || {};
    // @ts-ignore
    if (capabilities.zoom) {
      // @ts-ignore
      const min = capabilities.zoom.min || 1;
      // @ts-ignore
      const max = capabilities.zoom.max || 5;
      const targetZoom = Math.max(min, Math.min(max, nivelZoom));
      // @ts-ignore
      await track.applyConstraints({ advanced: [{ zoom: targetZoom }] });
      return true;
    }
  } catch {}
  return false;
}

// Alterna a lanterna/flash da câmera traseira
export async function alternarLanternaCamera(stream: MediaStream | null, ligar: boolean): Promise<boolean> {
  if (!stream) return false;
  const track = stream.getVideoTracks()[0];
  if (!track || !track.getCapabilities) return false;

  try {
    // @ts-ignore
    const capabilities = track.getCapabilities() || {};
    // @ts-ignore
    if (capabilities.torch) {
      // @ts-ignore
      await track.applyConstraints({ advanced: [{ torch: ligar }] });
      return true;
    }
  } catch {}
  return false;
}

// Vincula o stream ao elemento de vídeo garantindo compatibilidade com iOS Webkit
export async function prepararVideoElement(video: HTMLVideoElement, stream: MediaStream): Promise<void> {
  video.setAttribute('playsinline', 'true');
  video.setAttribute('webkit-playsinline', 'true');
  video.muted = true;
  video.autoplay = true;
  video.srcObject = stream;

  try {
    await video.play();
  } catch {}

  // Aguarda o vídeo ter dimensões válidas no iOS Safari
  await new Promise<void>((resolve) => {
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      resolve();
      return;
    }
    const onMetadata = () => {
      video.removeEventListener('loadedmetadata', onMetadata);
      video.removeEventListener('canplay', onMetadata);
      resolve();
    };
    video.addEventListener('loadedmetadata', onMetadata);
    video.addEventListener('canplay', onMetadata);
    setTimeout(resolve, 600);
  });
}

// Decodifica imagem de Canvas usando ZXing com alta tolerância
export function decodificarCanvasZXing(canvas: HTMLCanvasElement): string | null {
  try {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const rgba = imageData.data;

    // Converte RGBA para Luminance Array
    const luminances = new Uint8ClampedArray(width * height);
    for (let i = 0; i < luminances.length; i++) {
      const offset = i * 4;
      // Formula de luminância padrão perceptiva
      luminances[i] = (rgba[offset] * 306 + rgba[offset + 1] * 601 + rgba[offset + 2] * 117) >> 10;
    }

    const source = new RGBLuminanceSource(luminances, width, height);
    const bitmap = new BinaryBitmap(new HybridBinarizer(source));
    const reader = criarMultiFormatReaderPuro();
    const result = reader.decode(bitmap);
    if (result && result.getText()) {
      return result.getText().trim();
    }
  } catch {}
  return null;
}

// Decodifica com rotação de 90° caso o usuário esteja segurando o celular em pé (Retrato)
export function decodificarCanvasComRotacao(canvas: HTMLCanvasElement): string | null {
  // 1. Tenta orientação normal
  const codNormal = decodificarCanvasZXing(canvas);
  if (codNormal) return codNormal;

  // 2. Tenta orientação rotacionada em 90 graus (crítico para iPhone segurado na vertical)
  try {
    const rotatedCanvas = document.createElement('canvas');
    rotatedCanvas.width = canvas.height;
    rotatedCanvas.height = canvas.width;
    const rCtx = rotatedCanvas.getContext('2d', { willReadFrequently: true });
    if (rCtx) {
      rCtx.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
      rCtx.rotate((90 * Math.PI) / 180);
      rCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

      const codRot = decodificarCanvasZXing(rotatedCanvas);
      if (codRot) return codRot;
    }
  } catch {}

  return null;
}

// Captura um recorte de alto contraste do centro do vídeo (onde fica a mira laser vermelha)
export function capturarRecorteCentroVideo(video: HTMLVideoElement): HTMLCanvasElement | null {
  if (!video || video.videoWidth === 0 || video.videoHeight === 0) return null;

  try {
    const vw = video.videoWidth;
    const vh = video.videoHeight;

    // Foca na região central (65% de largura, 45% de altura)
    const cropW = Math.floor(vw * 0.70);
    const cropH = Math.floor(vh * 0.50);
    const cropX = Math.floor((vw - cropW) / 2);
    const cropY = Math.floor((vh - cropH) / 2);

    const canvas = document.createElement('canvas');
    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    // Desenha recorte central
    ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    return canvas;
  } catch {
    return null;
  }
}

// Decodifica imagem estática vinda de arquivo ou foto da galeria
export async function decodificarImagemArquivo(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        resolve(null);
        return;
      }
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const cod = decodificarCanvasComRotacao(canvas);
            resolve(cod);
            return;
          }
        } catch {}
        resolve(null);
      };
      img.onerror = () => resolve(null);
      img.src = dataUrl;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}
