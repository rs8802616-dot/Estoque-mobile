import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ItemCarrinho, ClienteDevedor, ItemEstoque } from '../types';
import { processarCodigoBarraBalanca, localizarMelhorLoteEstoque } from '../lib/balancaUtils';
import { tocarBeepCaixa, tocarSomAlerta } from '../lib/soundUtils';
import { BrowserMultiFormatReader } from '@zxing/library';
import {
  obterStreamCameraOtimizado,
  prepararVideoElement,
  criarLeitorZXing,
  capturarRecorteCentroVideo,
  decodificarCanvasComRotacao,
  decodificarImagemArquivo,
  alternarLanternaCamera,
  aplicarZoomCamera,
} from '../lib/barcodeScanner';

function formatarData(dataStr?: string): string {
  if (!dataStr) return '--/--/----';
  try {
    const partes = dataStr.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    const d = new Date(dataStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('pt-BR');
    }
  } catch {
    // fallback
  }
  return dataStr;
}

interface CarrinhoVendaModalProps {
  visivel: boolean;
  onFechar: () => void;
  carrinho: ItemCarrinho[];
  onAlterarQuantidade: (id: string, novaQtd: number) => void;
  onRemoverItem: (id: string) => void;
  onLimparCarrinho: () => void;
  onAdicionarOutroProduto: () => void;
  onFinalizarVenda: (
    formaPagamento: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'fiado',
    clienteFiadoId?: string
  ) => void;
  estoqueDisponivel: ItemEstoque[];
  onAdicionarItemRapido: (item: ItemEstoque, quantidade?: number) => void;
  clientesDevedores: ClienteDevedor[];
  onAbrirCadastroCliente?: () => void;
  sessaoCaixaAberta: boolean;
  onAbrirCaixaModal?: () => void;
  obterFotoProduto: (codigo: string, foto?: string) => string;
  abrirComCameraAberta?: boolean;
  onAbrirLeitorCameraContinuo?: () => void;
  ultimoItemBipadoToast?: string;
}

export const CarrinhoVendaModal: React.FC<CarrinhoVendaModalProps> = ({
  visivel,
  onFechar,
  carrinho,
  onAlterarQuantidade,
  onRemoverItem,
  onLimparCarrinho,
  onAdicionarOutroProduto,
  onFinalizarVenda,
  estoqueDisponivel,
  onAdicionarItemRapido,
  clientesDevedores,
  onAbrirCadastroCliente,
  sessaoCaixaAberta,
  onAbrirCaixaModal,
  obterFotoProduto,
  abrirComCameraAberta = false,
  ultimoItemBipadoToast,
}) => {
  const [formaPagamento, setFormaPagamento] = useState<'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'fiado'>('pix');
  const [clienteFiadoId, setClienteFiadoId] = useState<string>('');
  const [buscaRapida, setBuscaRapida] = useState<string>('');
  const [processando, setProcessando] = useState<boolean>(false);
  const [erroMsg, setErroMsg] = useState<string>('');

  // Scanner States (Câmera Integrada no Carrinho)
  const [cameraAtiva, setCameraAtiva] = useState<boolean>(abrirComCameraAberta);
  const [cameraCarregando, setCameraCarregando] = useState<boolean>(false);
  const [erroCamera, setErroCamera] = useState<string>('');
  const [lanternaAtiva, setLanternaAtiva] = useState<boolean>(false);
  const [zoomNivel, setZoomNivel] = useState<number>(1);
  const [modoCamera, setModoCamera] = useState<'environment' | 'user'>('environment');
  const [ultimoItemScaneado, setUltimoItemScaneado] = useState<{
    nome: string;
    codigo: string;
    preco: number;
    quantidade: number;
    status: 'sucesso' | 'erro' | 'aviso';
    mensagem?: string;
    timestamp: number;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const frameScanIntervalRef = useRef<any>(null);
  const ultimoCodigoLidoRef = useRef<{ codigo: string; timestamp: number }>({ codigo: '', timestamp: 0 });

  // Update initial camera state when opened with abrirComCameraAberta
  useEffect(() => {
    if (visivel && abrirComCameraAberta) {
      setCameraAtiva(true);
    }
  }, [visivel, abrirComCameraAberta]);

  // Handle Camera Lifecycle
  useEffect(() => {
    if (!visivel) {
      pararCamera();
      return;
    }

    if (cameraAtiva) {
      iniciarCamera();
    } else {
      pararCamera();
    }

    return () => {
      pararCamera();
    };
  }, [visivel, cameraAtiva, modoCamera]);

  // Sugestões rápidas de produtos para adicionar ao carrinho via busca manual
  const produtosFiltrados = useMemo(() => {
    if (!buscaRapida.trim()) return [];
    const termo = buscaRapida.toLowerCase().trim();
    const matches = estoqueDisponivel.filter((p) => {
      return (
        p.nome.toLowerCase().includes(termo) ||
        p.codigo.toLowerCase().includes(termo) ||
        (p.codigo_barras && p.codigo_barras.toLowerCase().includes(termo)) ||
        (p.marca && p.marca.toLowerCase().includes(termo)) ||
        (p.categoria && p.categoria.toLowerCase().includes(termo))
      );
    });

    // Prioriza itens com estoque disponível (> 0 ou ilimitado)
    matches.sort((a, b) => {
      const aTem = a.quantidade > 0 || a.estoqueIlimitado || a.tipoCadastro === 'interno';
      const bTem = b.quantidade > 0 || b.estoqueIlimitado || b.tipoCadastro === 'interno';
      if (aTem && !bTem) return -1;
      if (!aTem && bTem) return 1;
      return b.quantidade - a.quantidade;
    });

    return matches.slice(0, 10);
  }, [buscaRapida, estoqueDisponivel]);

  const pararCamera = () => {
    if (frameScanIntervalRef.current) {
      clearInterval(frameScanIntervalRef.current);
      frameScanIntervalRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      mediaStreamRef.current = null;
    }
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
      } catch (e) {}
    }
    if (videoRef.current) {
      try {
        videoRef.current.srcObject = null;
      } catch (e) {}
    }
    setLanternaAtiva(false);
    setCameraCarregando(false);
  };

  const iniciarCamera = async () => {
    setCameraCarregando(true);
    setErroCamera('');
    setZoomNivel(1);

    if (frameScanIntervalRef.current) {
      clearInterval(frameScanIntervalRef.current);
      frameScanIntervalRef.current = null;
    }

    // Stop previous stream if any
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
      } catch (e) {}
    }

    try {
      const stream = await obterStreamCameraOtimizado(modoCamera);
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        await prepararVideoElement(videoRef.current, stream);
      }

      setCameraCarregando(false);

      // Setup Barcode Scanner Logic
      const onDetect = (rawText: string) => {
        if (!rawText) return;
        const cod = rawText.trim();
        const agora = Date.now();

        // Anti-duplicate protection: 1.3s cooldown on the exact same barcode, 550ms on a different barcode
        if (
          ultimoCodigoLidoRef.current.codigo === cod &&
          agora - ultimoCodigoLidoRef.current.timestamp < 1300
        ) {
          return;
        }
        if (agora - ultimoCodigoLidoRef.current.timestamp < 550) {
          return;
        }
        ultimoCodigoLidoRef.current = { codigo: cod, timestamp: agora };
        processarBip(cod);
      };

      // 1. ZXing MultiFormatReader com TRY_HARDER
      if (!codeReaderRef.current) {
        codeReaderRef.current = criarLeitorZXing();
      }

      if (videoRef.current) {
        try {
          const decodePromise = codeReaderRef.current.decodeFromVideoElementContinuously(
            videoRef.current,
            (result: any, err: any) => {
              if (result) {
                const txt = result.getText();
                if (txt) onDetect(txt);
              }
            }
          );
          if (decodePromise && typeof decodePromise.catch === 'function') {
            decodePromise.catch(() => {});
          }
        } catch (e) {}
      }

      // 2. Loop de Escaneamento Ativo em Canvas com Rotação (Garante leitura no iPhone e Safari)
      frameScanIntervalRef.current = setInterval(() => {
        if (!videoRef.current || videoRef.current.readyState < 2) return;
        try {
          const cropCanvas = capturarRecorteCentroVideo(videoRef.current);
          if (cropCanvas) {
            const cod = decodificarCanvasComRotacao(cropCanvas);
            if (cod) {
              onDetect(cod);
            }
          }
        } catch (e) {}
      }, 140);

    } catch (err: any) {
      console.error('Erro ao acessar a câmera:', err);
      setCameraCarregando(false);
      setErroCamera(
        'Não foi possível acessar a câmera. Verifique as permissões de vídeo do seu navegador ou celular.'
      );
    }
  };

  const alternarLanterna = async () => {
    const novoEstado = !lanternaAtiva;
    const sucesso = await alternarLanternaCamera(mediaStreamRef.current, novoEstado);
    if (sucesso) {
      setLanternaAtiva(novoEstado);
    } else {
      alert('Lanterna / Flash não disponível nesta câmera ou dispositivo.');
    }
  };

  const alternarZoom = async () => {
    const niveis = [1, 1.5, 2, 2.5];
    const idx = niveis.indexOf(zoomNivel);
    const proxNivel = niveis[(idx + 1) % niveis.length];
    setZoomNivel(proxNivel);
    await aplicarZoomCamera(mediaStreamRef.current, proxNivel);
  };

  const capturarFotoManual = () => {
    if (!videoRef.current || videoRef.current.readyState < 2) {
      alert('Aguarde a câmera iniciar o vídeo...');
      return;
    }
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 1280;
      canvas.height = videoRef.current.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const cod = decodificarCanvasComRotacao(canvas);
        if (cod) {
          processarBip(cod);
          return;
        }
      }
    } catch {}
    alert('Não foi possível ler o código nesta foto. Tente afastar um pouco (15-20cm), usar o zoom ou ligar a lanterna.');
  };

  const processarArquivoFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const cod = await decodificarImagemArquivo(file);
    if (cod) {
      processarBip(cod);
    } else {
      alert('Não foi possível reconhecer o código de barras nesta imagem.');
    }
  };

  const alternarCamera = () => {
    setModoCamera((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const processarBip = (codigoLido: string) => {
    const codLimpo = codigoLido.trim();
    if (!codLimpo) return;

    if (!sessaoCaixaAberta) {
      tocarSomAlerta();
      setUltimoItemScaneado({
        nome: 'Caixa Fechado!',
        codigo: codLimpo,
        preco: 0,
        quantidade: 0,
        status: 'erro',
        mensagem: 'Abra o turno do caixa antes de bipar vendas.',
        timestamp: Date.now(),
      });
      return;
    }

    // 1. Verificação de Código de Balança (EAN-13 iniciando com '2')
    const resBalanca = processarCodigoBarraBalanca(codLimpo, estoqueDisponivel);
    if (resBalanca.isBalanca && resBalanca.itemEncontrado) {
      const qtdCalc = resBalanca.quantidadeCalculada || 1;
      onAdicionarItemRapido(resBalanca.itemEncontrado, qtdCalc);
      tocarBeepCaixa();

      if (navigator.vibrate) {
        try {
          navigator.vibrate([60, 30, 60]);
        } catch (e) {}
      }

      setUltimoItemScaneado({
        nome: resBalanca.itemEncontrado.nome,
        codigo: codLimpo,
        preco: resBalanca.precoTotal || resBalanca.itemEncontrado.preco_venda,
        quantidade: qtdCalc,
        status: 'sucesso',
        mensagem: `⚖️ Balança: ${qtdCalc} un/kg (R$ ${resBalanca.precoTotal?.toFixed(2)})`,
        timestamp: Date.now(),
      });
      return;
    }

    // 2. Produto Normal no Estoque
    const achou = localizarMelhorLoteEstoque(codLimpo, estoqueDisponivel);
    if (achou) {
      onAdicionarItemRapido(achou, 1);
      tocarBeepCaixa();

      if (navigator.vibrate) {
        try {
          navigator.vibrate([60, 30, 60]);
        } catch (e) {}
      }

      const qtdNoCarrinho = (carrinho.find((c) => c.codigo === achou.codigo)?.quantidade || 0) + 1;
      setUltimoItemScaneado({
        nome: achou.nome,
        codigo: codLimpo,
        preco: Number(achou.preco_venda || 0),
        quantidade: qtdNoCarrinho,
        status: 'sucesso',
        mensagem: `+1 Adicionado! (R$ ${Number(achou.preco_venda || 0).toFixed(2)})`,
        timestamp: Date.now(),
      });
    } else {
      tocarSomAlerta();
      setUltimoItemScaneado({
        nome: `Código ${codLimpo}`,
        codigo: codLimpo,
        preco: 0,
        quantidade: 0,
        status: 'erro',
        mensagem: 'Produto não encontrado no estoque!',
        timestamp: Date.now(),
      });
    }
  };

  const totalGeral = carrinho.reduce((acc, item) => acc + item.subtotal, 0);
  const totalItensQtd = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  const handleConfirmar = (e: React.FormEvent) => {
    e.preventDefault();
    setErroMsg('');

    if (carrinho.length === 0) {
      setErroMsg('O carrinho está vazio! Adicione pelo menos um produto.');
      return;
    }

    if (!sessaoCaixaAberta) {
      setErroMsg('⚠️ Caixa Fechado! É necessário abrir o caixa antes de realizar vendas.');
      if (onAbrirCaixaModal) onAbrirCaixaModal();
      return;
    }

    if (formaPagamento === 'fiado') {
      if (!clienteFiadoId) {
        setErroMsg('Selecione um cliente cadastrado para registrar a compra em fiado.');
        return;
      }
      const cli = clientesDevedores.find((c) => c.id === clienteFiadoId);
      if (cli && cli.limiteFiado && cli.limiteFiado > 0) {
        if (cli.saldoDevedorTotal + totalGeral > cli.limiteFiado) {
          const confirma = window.confirm(
            `⚠️ ATENÇÃO: O total desta compra (R$ ${totalGeral.toFixed(2)}) ultrapassa o limite de fiado do cliente ${cli.nome} (R$ ${cli.limiteFiado.toFixed(2)}).\n\nSaldo atual: R$ ${cli.saldoDevedorTotal.toFixed(2)}\nDeseja continuar mesmo assim?`
          );
          if (!confirma) return;
        }
      }
    }

    setProcessando(true);
    try {
      onFinalizarVenda(formaPagamento, formaPagamento === 'fiado' ? clienteFiadoId : undefined);
    } finally {
      setProcessando(false);
    }
  };

  if (!visivel) return null;

  return (
    <div className="carrinho-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onFechar(); }}>
      <div
        className="carrinho-modal-container"
        style={{
          maxWidth: cameraAtiva ? '760px' : '680px',
        }}
      >
        {/* CABEÇALHO DO CARRINHO */}
        <div className="carrinho-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>🛒</span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>
                  Carrinho de Vendas
                </h2>
                <span
                  style={{
                    fontSize: '0.72rem',
                    background: '#38bdf8',
                    color: '#082f49',
                    padding: '2px 7px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {totalItensQtd} {totalItensQtd === 1 ? 'item' : 'itens'}
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#e0f2fe', margin: '1px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Bipe múltiplos produtos com a câmera ou leitor USB
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {/* BOTÃO TOGGLE DA CÂMERA NO CABEÇALHO */}
            <button
              type="button"
              onClick={() => setCameraAtiva(!cameraAtiva)}
              style={{
                background: cameraAtiva
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                border: cameraAtiva ? '1.5px solid #6ee7b7' : '1px solid rgba(255, 255, 255, 0.3)',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: cameraAtiva ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none',
                minHeight: '34px',
              }}
              title={cameraAtiva ? 'Ocultar leitor de câmera' : 'Abrir câmera para bipagem contínua'}
            >
              <span>📷</span>
              <span>{cameraAtiva ? 'Câmera Ativa' : 'Câmera'}</span>
            </button>

            <button
              onClick={onFechar}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#ffffff',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              title="Fechar Carrinho"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CORPO DO MODAL (ROLAGEM SUAVE COM SAFE AREA) */}
        <div className="carrinho-body">
          
          {/* CÂMERA DE BIPAGEM CONTÍNUA INTEGRADA NO CARRINHO */}
          {cameraAtiva && (
            <div
              style={{
                background: '#090d16',
                border: '2px solid #0284c7',
                borderRadius: '12px',
                padding: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Barra de controle superior da câmera */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  flexWrap: 'wrap',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#34d399', fontSize: '0.85rem' }}>⚡</span>
                  <span style={{ fontWeight: 800, color: '#38bdf8' }}>Bipador de Vendas</span>
                </div>

                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={alternarZoom}
                    style={{
                      background: zoomNivel > 1 ? '#0284c7' : 'rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      border: zoomNivel > 1 ? '1px solid #38bdf8' : 'none',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      minHeight: '30px',
                    }}
                    title="Aumentar zoom da câmera para focar códigos pequenos"
                  >
                    <span>🔍</span>
                    <span>{zoomNivel}x Zoom</span>
                  </button>

                  <button
                    type="button"
                    onClick={alternarLanterna}
                    style={{
                      background: lanternaAtiva ? '#f59e0b' : 'rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      minHeight: '30px',
                    }}
                    title="Ligar ou Desligar Lanterna"
                  >
                    <span>{lanternaAtiva ? '💡' : '🔦'}</span>
                    <span>{lanternaAtiva ? 'Luz ON' : 'Lanterna'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={capturarFotoManual}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      minHeight: '30px',
                    }}
                    title="Tirar foto do código agora e forçar leitura"
                  >
                    <span>📸</span>
                    <span>Ler Agora</span>
                  </button>

                  <button
                    type="button"
                    onClick={alternarCamera}
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      minHeight: '30px',
                    }}
                    title="Trocar entre câmera traseira e frontal"
                  >
                    <span>🔄</span>
                    <span>Virar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCameraAtiva(false)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#fca5a5',
                      border: '1px solid #ef4444',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      minHeight: '30px',
                    }}
                  >
                    Ocultar
                  </button>
                </div>
              </div>

              {/* Viewfinder da Câmera */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '480px',
                  height: '170px',
                  position: 'relative',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: '#000000',
                  border: '1.5px solid #22c55e',
                  boxSizing: 'border-box',
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: cameraCarregando ? 'none' : 'block',
                  }}
                  onLoadedMetadata={(e) => {
                    const el = e.currentTarget;
                    el.play().catch(() => {});
                  }}
                />

                {cameraCarregando && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                      background: '#0f172a',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      gap: '8px',
                    }}
                  >
                    <div style={{ fontSize: '1.4rem', animation: 'spin 1s infinite linear' }}>🔄</div>
                    <span>Iniciando câmera...</span>
                  </div>
                )}

                {erroCamera && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fca5a5',
                      background: '#450a0a',
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '0.78rem',
                    }}
                  >
                    <span>⚠️ {erroCamera}</span>
                    <button
                      type="button"
                      onClick={iniciarCamera}
                      style={{
                        marginTop: '8px',
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Tentar Novamente
                    </button>
                  </div>
                )}

                {/* Laser & Moldura de Foco do Scanner */}
                {!cameraCarregando && !erroCamera && (
                  <div className="mira-scanner">
                    <div className="linha-laser"></div>
                  </div>
                )}
              </div>

              {/* Toast de Confirmação Sobreposto do Item Bipado */}
              {ultimoItemScaneado && (
                <div
                  style={{
                    width: '100%',
                    maxWidth: '480px',
                    marginTop: '6px',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    background:
                      ultimoItemScaneado.status === 'sucesso'
                        ? 'rgba(6, 95, 70, 0.95)'
                        : 'rgba(153, 27, 27, 0.95)',
                    border:
                      ultimoItemScaneado.status === 'sucesso'
                        ? '1.5px solid #34d399'
                        : '1.5px solid #f87171',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: '0.78rem',
                    animation: 'fadeIn 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                >
                  {ultimoItemScaneado.status === 'sucesso' ? (
                    <div>
                      <span style={{ fontWeight: 800 }}>✅ +1 {ultimoItemScaneado.nome}</span>
                      <span style={{ color: '#a7f3d0', marginLeft: '6px' }}>
                        (R$ {ultimoItemScaneado.preco.toFixed(2)}) • Total:{' '}
                        <b>{ultimoItemScaneado.quantidade} un</b>
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontWeight: 700 }}>⚠️ {ultimoItemScaneado.nome}</span>
                      <span style={{ color: '#fecaca', marginLeft: '6px' }}>
                        {ultimoItemScaneado.mensagem}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '6px', width: '100%' }}>
                <p
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.72rem',
                    margin: '0',
                    textAlign: 'center',
                  }}
                >
                  📱 <b>Dica iPhone:</b> Distância de 15-20cm. Para códigos pequenos, use <b>Zoom 1.5x / 2x</b> ou <b>Ler Agora</b>!
                </p>

                <label
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px dashed #64748b',
                    color: '#cbd5e1',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '2px',
                  }}
                >
                  <span>📁</span>
                  <span>Escanear de Foto da Galeria / Câmera Nativa</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={processarArquivoFoto}
                  />
                </label>
              </div>
            </div>
          )}

          {/* TOAST DE ITEM BIPADO RECENTEMENTE (GLOBAL) */}
          {ultimoItemBipadoToast && !cameraAtiva && (
            <div
              style={{
                background: '#ecfdf5',
                color: '#065f46',
                border: '1.5px solid #6ee7b7',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                animation: 'fadeIn 0.2s ease',
                boxSizing: 'border-box',
              }}
            >
              <span>🔔</span>
              <span>{ultimoItemBipadoToast}</span>
            </div>
          )}

          {/* PAINEL DE BIPAGEM / BUSCA RÁPIDA MANUAL & LEITOR USB */}
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '10px 12px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#334155',
                }}
              >
                <span>🔍</span>
                <span>Buscar ou bipar produto (Pistola USB / Manual):</span>
              </label>

              {!cameraAtiva && (
                <button
                  type="button"
                  onClick={() => setCameraAtiva(true)}
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    minHeight: '28px',
                  }}
                >
                  <span>📷</span>
                  <span>Abrir Câmera</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '6px', width: '100%', boxSizing: 'border-box' }}>
              <input
                type="text"
                placeholder="Nome, cód. barras ou pistola USB..."
                value={buscaRapida}
                onChange={(e) => setBuscaRapida(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  minWidth: 0,
                }}
              />
              {buscaRapida && (
                <button
                  type="button"
                  onClick={() => setBuscaRapida('')}
                  style={{
                    background: '#e2e8f0',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0 10px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Limpar
                </button>
              )}
            </div>

            {/* LISTA DE SUGESTÕES RÁPIDAS ENCONTRADAS */}
            {buscaRapida.trim() !== '' && (
              <div
                style={{
                  marginTop: '8px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  boxSizing: 'border-box',
                }}
              >
                {produtosFiltrados.length === 0 ? (
                  <div style={{ padding: '10px', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
                    Nenhum produto encontrado com "{buscaRapida}".
                  </div>
                ) : (
                  produtosFiltrados.map((item, idx) => {
                    const fotoItem = obterFotoProduto(item.codigo, item.foto);
                    return (
                      <div
                        key={`busca_rapida_${item.codigo}_${item.validade}_${item.lote}_${idx}`}
                        onClick={() => {
                          onAdicionarItemRapido(item, 1);
                          setBuscaRapida('');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer',
                          gap: '8px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '6px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {fotoItem ? (
                              <img src={fotoItem} alt={item.nome} referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontSize: '0.85rem' }}>📦</span>
                            )}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.nome}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              Cód: {item.codigo} • Val: {formatarData(item.validade)} • Disp: <b>{item.quantidade} un</b>
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0284c7' }}>
                            R$ {Number(item.preco_venda || 0).toFixed(2)}
                          </div>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              color: '#16a34a',
                              fontWeight: 700,
                              background: '#dcfce7',
                              padding: '2px 5px',
                              borderRadius: '4px',
                              display: 'inline-block',
                            }}
                          >
                            + Adicionar
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* LISTA DE PRODUTOS NO CARRINHO (ESTRUTURA RESPONSIVA PERFEITA) */}
          <div style={{ width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>
                Itens no Carrinho ({carrinho.length} tipo{carrinho.length > 1 ? 's' : ''} • {totalItensQtd} un)
              </span>
              {carrinho.length > 0 && (
                <button
                  type="button"
                  onClick={onLimparCarrinho}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#dc2626',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: '2px',
                  }}
                >
                  Esvaziar Carrinho
                </button>
              )}
            </div>

            {carrinho.length === 0 ? (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px 14px',
                  textAlign: 'center',
                  color: '#64748b',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🛒</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>
                  Nenhum produto adicionado ao carrinho
                </div>
                <p style={{ fontSize: '0.78rem', marginTop: '4px', maxWidth: '360px', margin: '4px auto 10px auto' }}>
                  Aponte a câmera acima para bipar ou selecione produtos na lista da loja.
                </p>
                <button
                  type="button"
                  onClick={onAdicionarOutroProduto}
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Explorar Estoque
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                {carrinho.map((item, index) => {
                  const fotoItem = obterFotoProduto(item.codigo, item.foto);
                  return (
                    <div
                      key={item.id || `${item.codigo}_${item.validade}_${index}`}
                      className="carrinho-item-card"
                    >
                      {/* Linha Superior / Bloco Principal */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', width: '100%', minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '6px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {fotoItem ? (
                              <img src={fotoItem} alt={item.nome} referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontSize: '1rem' }}>📦</span>
                            )}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                color: '#0f172a',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                              title={item.nome}
                            >
                              {item.nome}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              Unit: <b>R$ {Number(item.preco_unitario || 0).toFixed(2)}</b> • Val: {formatarData(item.validade)}
                            </div>
                          </div>
                        </div>

                        {/* Subtotal do Item & Botão Remover */}
                        <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <div style={{ fontWeight: 900, fontSize: '0.92rem', color: '#0f172a' }}>
                            R$ {Number(item.subtotal || 0).toFixed(2)}
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoverItem(item.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              padding: '2px 0',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '2px',
                            }}
                            title="Remover produto do carrinho"
                          >
                            <span>🗑️</span>
                            <span>Excluir</span>
                          </button>
                        </div>
                      </div>

                      {/* Linha Inferior: Controles de Quantidade (Touch-Friendly) */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: '1px dashed #f1f5f9',
                          paddingTop: '6px',
                          width: '100%',
                        }}
                      >
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Estoque disp: <b>{item.estoqueDisponivel} un</b>
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => onAlterarQuantidade(item.id, item.quantidade - 1)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              background: '#f8fafc',
                              fontWeight: 800,
                              fontSize: '1rem',
                              cursor: 'pointer',
                              color: '#334155',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            aria-label="Diminuir quantidade"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantidade}
                            min="1"
                            max={item.estoqueDisponivel}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10);
                              if (!isNaN(v)) {
                                onAlterarQuantidade(item.id, v);
                              }
                            }}
                            style={{
                              width: '46px',
                              height: '32px',
                              textAlign: 'center',
                              fontWeight: 800,
                              fontSize: '0.9rem',
                              padding: '2px',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              background: '#fff',
                              boxSizing: 'border-box',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => onAlterarQuantidade(item.id, item.quantidade + 1)}
                            disabled={item.quantidade >= item.estoqueDisponivel}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              background: item.quantidade >= item.estoqueDisponivel ? '#e2e8f0' : '#f8fafc',
                              fontWeight: 800,
                              fontSize: '1rem',
                              cursor: item.quantidade >= item.estoqueDisponivel ? 'not-allowed' : 'pointer',
                              color: '#334155',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            aria-label="Aumentar quantidade"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FORMA DE PAGAMENTO E CLIENTE FIADO */}
          {carrinho.length > 0 && (
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '10px 12px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <div className="grupo-input" style={{ margin: 0 }}>
                <label
                  className="rotulo-campo"
                  style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1e293b', marginBottom: '4px' }}
                >
                  💳 Forma de Pagamento da Venda
                </label>
                <select
                  className="input-modal"
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="pix">📱 PIX</option>
                  <option value="cartao_credito">💳 Cartão de Crédito</option>
                  <option value="cartao_debito">💳 Cartão de Débito</option>
                  <option value="dinheiro">💵 Dinheiro (Espécie)</option>
                  <option value="fiado">📝 Compra em Fiado (Caderneta de Cliente)</option>
                </select>
              </div>

              {formaPagamento === 'fiado' && (
                <div
                  style={{
                    marginTop: '8px',
                    background: '#fef2f2',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #fca5a5',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ color: '#991b1b', margin: 0, fontWeight: 700, fontSize: '0.78rem' }}>
                      👤 Selecione o Cliente Fiado:
                    </label>
                    {onAbrirCadastroCliente && (
                      <button
                        type="button"
                        onClick={onAbrirCadastroCliente}
                        style={{
                          background: '#dc2626',
                          color: '#ffffff',
                          border: 'none',
                          padding: '3px 6px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        ➕ Novo Cliente
                      </button>
                    )}
                  </div>
                  <select
                    className="input-modal"
                    value={clienteFiadoId}
                    onChange={(e) => setClienteFiadoId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 9px',
                      borderRadius: '6px',
                      border: '1px solid #fca5a5',
                      fontSize: '0.8rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="">-- Selecione o Cliente Devedor --</option>
                    {clientesDevedores.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome} {c.cpfOuCnpj ? `(${c.cpfOuCnpj})` : ''} - Saldo Dev: R$ {c.saldoDevedorTotal.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* MENSAGEM DE ERRO OU AVISO */}
          {erroMsg && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #f87171',
                borderRadius: '8px',
                padding: '8px 10px',
                color: '#991b1b',
                fontSize: '0.82rem',
                fontWeight: 600,
                boxSizing: 'border-box',
              }}
            >
              {erroMsg}
            </div>
          )}
        </div>

        {/* RODAPÉ COM TOTAL E BOTÃO DE FINALIZAR RESPONSIVO */}
        <div className="carrinho-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Total a Pagar</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
                R$ {totalGeral.toFixed(2).replace('.', ',')}
              </div>
            </div>

            <div className="carrinho-footer-actions" style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={onFechar}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  minHeight: '40px',
                }}
              >
                Continuar
              </button>
              <button
                type="button"
                onClick={handleConfirmar}
                disabled={carrinho.length === 0 || processando}
                style={{
                  background:
                    carrinho.length === 0 || processando
                      ? '#94a3b8'
                      : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 14px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: carrinho.length === 0 || processando ? 'not-allowed' : 'pointer',
                  boxShadow: carrinho.length > 0 ? '0 4px 12px rgba(22, 163, 74, 0.3)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  minHeight: '40px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{processando ? 'Processando...' : '✅ Concluir Venda'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
