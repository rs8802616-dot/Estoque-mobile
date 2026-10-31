import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import {
  obterStreamCameraOtimizado,
  prepararVideoElement,
  criarLeitorZXing,
  capturarRecorteCentroVideo,
  decodificarCanvasComRotacao,
  alternarLanternaCamera,
} from '../lib/barcodeScanner';
import { tocarBeepCaixa } from '../lib/soundUtils';
import {
  ClienteDevedor,
  CompraFiado,
  CompraFiadoItem,
  PagamentoFiado,
  ItemEstoque,
  ProdutoCatalogo,
} from '../types';
import { mascaraTelefone, mascaraCpfCnpj } from '../lib/mascaras';

interface GestaoDevedoresModalProps {
  visivel: boolean;
  onFechar: () => void;
  clientes: ClienteDevedor[];
  lojaId: string;
  nomeLoja: string;
  operadorAtualNome: string;
  estoque?: ItemEstoque[];
  catalogoGlobal?: ProdutoCatalogo[];
  onSalvarCliente: (cliente: ClienteDevedor) => void;
  onExcluirCliente: (clienteId: string) => void;
  onRegistrarPagamento: (
    clienteId: string,
    valor: number,
    formaPagamento: 'dinheiro' | 'pix' | 'cartao_debito' | 'cartao_credito',
    observacao?: string
  ) => void;
}

export const GestaoDevedoresModal: React.FC<GestaoDevedoresModalProps> = ({
  visivel,
  onFechar,
  clientes = [],
  lojaId = '',
  nomeLoja = '',
  operadorAtualNome = '',
  estoque = [],
  catalogoGlobal = [],
  onSalvarCliente,
  onExcluirCliente,
  onRegistrarPagamento,
}) => {
  const listaClientes = clientes || [];

  // Estados principais
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'pendentes' | 'quitados'>('pendentes');
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteDevedor | null>(null);

  // Modal de cadastro/edição de cliente
  const [modalNovoCliente, setModalNovoCliente] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<ClienteDevedor | null>(null);
  const [formNome, setFormNome] = useState('');
  const [formTelefone, setFormTelefone] = useState('');
  const [formCpf, setFormCpf] = useState('');
  const [formEndereco, setFormEndereco] = useState('');
  const [formLimite, setFormLimite] = useState('');
  const [formObservacoes, setFormObservacoes] = useState('');
  const [erroForm, setErroForm] = useState('');

  // Modal de abate de dívida (pagamento)
  const [modalPagamento, setModalPagamento] = useState(false);
  const [valorAbatimento, setValorAbatimento] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<'dinheiro' | 'pix' | 'cartao_debito' | 'cartao_credito'>('dinheiro');
  const [obsPagamento, setObsPagamento] = useState('');
  const [erroPagamento, setErroPagamento] = useState('');

  // Modal de lançamento de compra avulsa / manual na retaguarda / caderneta
  const [modalNovaCompra, setModalNovaCompra] = useState(false);
  const [valorNovaCompra, setValorNovaCompra] = useState('');
  const [descricaoNovaCompra, setDescricaoNovaCompra] = useState('');
  const [dataNovaCompra, setDataNovaCompra] = useState(new Date().toISOString().split('T')[0]);
  const [obsNovaCompra, setObsNovaCompra] = useState('');
  const [erroNovaCompra, setErroNovaCompra] = useState('');

  // Itens da compra avulsa / caderneta (Lista de Produtos & Bipagem Contínua)
  const [itensNovaCompra, setItensNovaCompra] = useState<CompraFiadoItem[]>([]);
  const [buscaProdutoCompra, setBuscaProdutoCompra] = useState('');
  const [cameraScannerAtiva, setCameraScannerAtiva] = useState(false);
  const [cameraCarregando, setCameraCarregando] = useState(false);
  const [erroCamera, setErroCamera] = useState('');
  const [lanternaAtiva, setLanternaAtiva] = useState(false);
  const [modoCamera, setModoCamera] = useState<'environment' | 'user'>('environment');
  const [ultimoItemBipado, setUltimoItemBipado] = useState<{
    nome: string;
    preco: number;
    quantidade: number;
  } | null>(null);

  // Modal para adicionar item avulso manual (sem código ou produto pesável/balcão)
  const [modalItemManual, setModalItemManual] = useState(false);
  const [manualNome, setManualNome] = useState('');
  const [manualQtd, setManualQtd] = useState('1');
  const [manualPreco, setManualPreco] = useState('');

  // Refs de Câmera e Barcode Scanner
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const frameScanIntervalRef = useRef<any>(null);
  const ultimoCodigoLidoRef = useRef<{ codigo: string; timestamp: number }>({ codigo: '', timestamp: 0 });

  // Compra expandida no extrato
  const [compraExpandidaId, setCompraExpandidaId] = useState<string | null>(null);

  // Recibo/Comprovante de Pagamento para visualização/impressão
  const [reciboVisualizar, setReciboVisualizar] = useState<{ cliente: ClienteDevedor; pagamento: PagamentoFiado } | null>(null);

  // Aba ativa na ficha do cliente
  const [abaFicha, setAbaFicha] = useState<'compras' | 'pagamentos'>('compras');

  // KPI Calculations
  const totalDevedoresComDebito = listaClientes.filter((c) => (c.saldoDevedorTotal || 0) > 0).length;
  const totalDividasAberto = listaClientes.reduce((acc, c) => acc + (c.saldoDevedorTotal || 0), 0);

  // Filtragem de clientes
  const clientesFiltrados = listaClientes.filter((c) => {
    const termo = busca.toLowerCase().trim();
    const bateBusca =
      !termo ||
      c.nome.toLowerCase().includes(termo) ||
      (c.telefone && c.telefone.includes(termo)) ||
      (c.cpfOuCnpj && c.cpfOuCnpj.includes(termo));

    if (!bateBusca) return false;

    if (filtroStatus === 'pendentes') return (c.saldoDevedorTotal || 0) > 0;
    if (filtroStatus === 'quitados') return (c.saldoDevedorTotal || 0) === 0;
    return true;
  });

  // Abrir modal de novo cliente ou editar
  const handleAbrirModalCadastro = (cliente?: ClienteDevedor) => {
    if (cliente) {
      setClienteEditando(cliente);
      setFormNome(cliente.nome);
      setFormTelefone(cliente.telefone || '');
      setFormCpf(cliente.cpfOuCnpj || '');
      setFormEndereco(cliente.endereco || '');
      setFormLimite(cliente.limiteFiado ? cliente.limiteFiado.toString() : '');
      setFormObservacoes(cliente.observacoes || '');
    } else {
      setClienteEditando(null);
      setFormNome('');
      setFormTelefone('');
      setFormCpf('');
      setFormEndereco('');
      setFormLimite('');
      setFormObservacoes('');
    }
    setErroForm('');
    setModalNovoCliente(true);
  };

  // Salvar Cliente
  const handleSalvarClienteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNome.trim()) {
      setErroForm('Por favor, informe o nome do cliente.');
      return;
    }

    const hoje = new Date().toISOString().split('T')[0];
    const limiteNum = formLimite ? parseFloat(formLimite.replace(',', '.')) || 0 : 0;

    const clienteNovoOuEditado: ClienteDevedor = {
      id: clienteEditando ? clienteEditando.id : `cli_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      lojaId,
      nome: formNome.trim(),
      telefone: formTelefone.trim() || undefined,
      cpfOuCnpj: formCpf.trim() || undefined,
      endereco: formEndereco.trim() || undefined,
      limiteFiado: limiteNum > 0 ? limiteNum : undefined,
      observacoes: formObservacoes.trim() || undefined,
      dataCadastro: clienteEditando ? clienteEditando.dataCadastro : hoje,
      saldoDevedorTotal: clienteEditando ? clienteEditando.saldoDevedorTotal : 0,
      compras: clienteEditando ? clienteEditando.compras : [],
      pagamentos: clienteEditando ? clienteEditando.pagamentos : [],
      ativo: true,
    };

    onSalvarCliente(clienteNovoOuEditado);
    if (clienteSelecionado && clienteSelecionado.id === clienteNovoOuEditado.id) {
      setClienteSelecionado(clienteNovoOuEditado);
    }
    setModalNovoCliente(false);
  };

  // Confirmar Abatimento de Dívida
  const handleConfirmarPagamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteSelecionado) return;

    const valor = parseFloat(valorAbatimento.replace(',', '.'));
    if (isNaN(valor) || valor <= 0) {
      setErroPagamento('Informe um valor válido maior que R$ 0,00');
      return;
    }

    if (valor > clienteSelecionado.saldoDevedorTotal + 0.01) {
      setErroPagamento(`O valor informado (R$ ${valor.toFixed(2)}) é maior que o saldo devedor atual (R$ ${clienteSelecionado.saldoDevedorTotal.toFixed(2)}).`);
      return;
    }

    onRegistrarPagamento(clienteSelecionado.id, valor, formaPagamento, obsPagamento);

    // Atualizar visualização do cliente selecionado localmente
    const clienteAtualizado = clientes.find((c) => c.id === clienteSelecionado.id);
    if (clienteAtualizado) {
      setClienteSelecionado(clienteAtualizado);
    }

    setModalPagamento(false);
    setValorAbatimento('');
    setObsPagamento('');
    setErroPagamento('');
  };

  // ================= CONTROLE DE CÂMERA & LEITOR DE CÓDIGO DE BARRAS =================
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

    pararCamera();

    try {
      const stream = await obterStreamCameraOtimizado(modoCamera);
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        await prepararVideoElement(videoRef.current, stream);
      }
      setCameraCarregando(false);

      const onDetect = (rawText: string) => {
        if (!rawText) return;
        const cod = rawText.trim();
        const agora = Date.now();

        // Evita ler o mesmo produto repetidamente em menos de 1.3s
        if (
          ultimoCodigoLidoRef.current.codigo === cod &&
          agora - ultimoCodigoLidoRef.current.timestamp < 1300
        ) {
          return;
        }
        if (agora - ultimoCodigoLidoRef.current.timestamp < 500) {
          return;
        }
        ultimoCodigoLidoRef.current = { codigo: cod, timestamp: agora };
        adicionarProdutoPorCodigoOuBip(cod);
      };

      if (!codeReaderRef.current) {
        codeReaderRef.current = criarLeitorZXing();
      }

      if (videoRef.current) {
        try {
          const decodePromise = codeReaderRef.current.decodeFromVideoElementContinuously(
            videoRef.current,
            (result: any) => {
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

      // Loop em Canvas com rotação para leitura em múltiplos ângulos
      frameScanIntervalRef.current = setInterval(() => {
        if (!videoRef.current || videoRef.current.readyState < 2) return;
        try {
          const cropCanvas = capturarRecorteCentroVideo(videoRef.current);
          if (cropCanvas) {
            const cod = decodificarCanvasComRotacao(cropCanvas);
            if (cod) onDetect(cod);
          }
        } catch (e) {}
      }, 140);

    } catch (err: any) {
      console.error('Erro ao acessar a câmera no módulo devedores:', err);
      setCameraCarregando(false);
      setErroCamera('Não foi possível acessar a câmera do aparelho. Verifique as permissões de vídeo.');
    }
  };

  const alternarLanterna = async () => {
    if (!mediaStreamRef.current) return;
    const novoStatus = !lanternaAtiva;
    const ok = await alternarLanternaCamera(mediaStreamRef.current, novoStatus);
    if (ok) setLanternaAtiva(novoStatus);
  };

  // Ciclo de vida da câmera do scanner
  useEffect(() => {
    if (modalNovaCompra && cameraScannerAtiva) {
      iniciarCamera();
    } else {
      pararCamera();
    }
    return () => {
      pararCamera();
    };
  }, [modalNovaCompra, cameraScannerAtiva, modoCamera]);

  // Adicionar produto pelo código de barras ou bip da câmera
  const adicionarProdutoPorCodigoOuBip = (codigoRaw: string) => {
    const cod = String(codigoRaw || '').trim();
    if (!cod) return;

    tocarBeepCaixa();

    // 1. Procura no estoque local da loja
    const pEstoque = (estoque || []).find((e) => {
      const c1 = String(e.codigo || '').trim();
      const c2 = String(e.codigo_barras || '').trim();
      return c1 === cod || c2 === cod;
    });

    // 2. Procura no catálogo global
    const pCat = (catalogoGlobal || []).find((c) => String(c.codigo || '').trim() === cod);

    const nome = pEstoque?.nome || pCat?.nome || `Produto Cód. ${cod}`;
    const precoUnitario = pEstoque?.preco_venda || pCat?.preco_venda || pCat?.preco || 0;

    setItensNovaCompra((prev) => {
      const idx = prev.findIndex((it) => it.codigo === cod);
      if (idx >= 0) {
        const novo = [...prev];
        const novaQtd = (novo[idx].quantidade || 1) + 1;
        novo[idx] = {
          ...novo[idx],
          quantidade: novaQtd,
          subtotal: Number((novaQtd * novo[idx].preco_unitario).toFixed(2)),
        };
        setUltimoItemBipado({
          nome: novo[idx].nome,
          preco: novo[idx].preco_unitario,
          quantidade: novaQtd,
        });
        return novo;
      } else {
        const novoItem: CompraFiadoItem = {
          codigo: cod,
          nome,
          quantidade: 1,
          preco_unitario: precoUnitario,
          subtotal: precoUnitario,
        };
        setUltimoItemBipado({
          nome,
          preco: precoUnitario,
          quantidade: 1,
        });
        return [...prev, novoItem];
      }
    });

    setTimeout(() => {
      setUltimoItemBipado(null);
    }, 2500);
  };

  // Sugestões de produtos do estoque ao digitar
  const sugestoesProdutos = useMemo(() => {
    if (!buscaProdutoCompra.trim() || buscaProdutoCompra.trim().length < 2) return [];
    const termo = buscaProdutoCompra.toLowerCase().trim();
    return (estoque || []).filter((e) => {
      return (
        e.nome.toLowerCase().includes(termo) ||
        e.codigo.toLowerCase().includes(termo) ||
        (e.codigo_barras && e.codigo_barras.toLowerCase().includes(termo)) ||
        (e.marca && e.marca.toLowerCase().includes(termo))
      );
    }).slice(0, 8);
  }, [buscaProdutoCompra, estoque]);

  // Manipulação de itens da compra
  const alterarQtdItem = (index: number, delta: number) => {
    setItensNovaCompra((prev) => {
      const novo = [...prev];
      const item = novo[index];
      if (!item) return prev;
      const novaQtd = item.quantidade + delta;
      if (novaQtd <= 0) {
        novo.splice(index, 1);
      } else {
        novo[index] = {
          ...item,
          quantidade: novaQtd,
          subtotal: Number((novaQtd * item.preco_unitario).toFixed(2)),
        };
      }
      return novo;
    });
  };

  const alterarPrecoItem = (index: number, novoPrecoStr: string) => {
    const preco = parseFloat(novoPrecoStr.replace(',', '.')) || 0;
    setItensNovaCompra((prev) => {
      const novo = [...prev];
      if (!novo[index]) return prev;
      novo[index] = {
        ...novo[index],
        preco_unitario: preco,
        subtotal: Number((novo[index].quantidade * preco).toFixed(2)),
      };
      return novo;
    });
  };

  const removerItem = (index: number) => {
    setItensNovaCompra((prev) => prev.filter((_, i) => i !== index));
  };

  // Sincroniza automaticamente o total e a descrição da compra conforme itens são adicionados/alterados
  useEffect(() => {
    if (itensNovaCompra.length > 0) {
      const soma = itensNovaCompra.reduce((acc, it) => acc + (it.subtotal || 0), 0);
      setValorNovaCompra(soma.toFixed(2));
      const resumo = itensNovaCompra.map((it) => `${it.quantidade}x ${it.nome}`).join(', ');
      setDescricaoNovaCompra(resumo);
    }
  }, [itensNovaCompra]);

  // Adicionar item avulso manual (para produtos pesáveis, balcão de frios ou sem código de barras)
  const handleAdicionarItemManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualNome.trim()) return;
    const qtd = parseFloat(manualQtd.replace(',', '.')) || 1;
    const preco = parseFloat(manualPreco.replace(',', '.')) || 0;
    const sub = Number((qtd * preco).toFixed(2));

    const novoItem: CompraFiadoItem = {
      codigo: `AVULSO_${Date.now()}`,
      nome: manualNome.trim(),
      quantidade: qtd,
      preco_unitario: preco,
      subtotal: sub,
    };

    tocarBeepCaixa();
    setItensNovaCompra((prev) => [...prev, novoItem]);
    setManualNome('');
    setManualQtd('1');
    setManualPreco('');
    setModalItemManual(false);
  };

  // Abrir Modal de Nova Compra resetando estados
  const handleAbrirNovaCompra = (cliente: ClienteDevedor) => {
    setClienteSelecionado(cliente);
    setItensNovaCompra([]);
    setBuscaProdutoCompra('');
    setCameraScannerAtiva(false);
    setValorNovaCompra('');
    setDescricaoNovaCompra('');
    setObsNovaCompra('');
    setDataNovaCompra(new Date().toISOString().split('T')[0]);
    setErroNovaCompra('');
    setModalNovaCompra(true);
  };

  // Confirmar Lançamento de Compra Avulsa / Manual na Retaguarda
  const handleConfirmarNovaCompraManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteSelecionado) return;

    const valor = parseFloat(valorNovaCompra.replace(',', '.'));
    if (isNaN(valor) || valor <= 0) {
      setErroNovaCompra('Informe um valor de compra válido maior que R$ 0,00 ou bipe produtos na lista.');
      return;
    }

    const agora = new Date();
    const horaAtual = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dataEscolhida = dataNovaCompra || agora.toISOString().split('T')[0];

    // Se tiver itens bipados, utiliza os itens exatos com código, quantidade e preço
    const itensFinal: CompraFiadoItem[] =
      itensNovaCompra.length > 0
        ? itensNovaCompra
        : [
            {
              codigo: 'MANUAL_RETAGUARDA',
              nome: descricaoNovaCompra.trim() || 'Compras diversas / Itens da caderneta',
              quantidade: 1,
              preco_unitario: valor,
              subtotal: valor,
            },
          ];

    const novaCompra: CompraFiado = {
      id: `comp_man_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      vendaId: `venda_man_${Date.now()}`,
      data: dataEscolhida,
      hora: horaAtual,
      timestamp: Date.now(),
      valorTotal: valor,
      valorPago: 0,
      saldoRestante: valor,
      operadorNome: operadorAtualNome || 'Administrador do Supermercado',
      status: 'pendente',
      itens: itensFinal,
    };

    const novoSaldo = Number(((clienteSelecionado.saldoDevedorTotal || 0) + valor).toFixed(2));
    const comprasAtualizadas = [novaCompra, ...(clienteSelecionado.compras || [])];

    const clienteAtualizado: ClienteDevedor = {
      ...clienteSelecionado,
      saldoDevedorTotal: novoSaldo,
      compras: comprasAtualizadas,
    };

    onSalvarCliente(clienteAtualizado);
    setClienteSelecionado(clienteAtualizado);

    pararCamera();
    setModalNovaCompra(false);
    setItensNovaCompra([]);
    setBuscaProdutoCompra('');
    setCameraScannerAtiva(false);
    setValorNovaCompra('');
    setDescricaoNovaCompra('');
    setObsNovaCompra('');
    setErroNovaCompra('');
  };

  // Gerar mensagem formatada para WhatsApp de cobrança
  const handleEnviarWhatsApp = (cliente: ClienteDevedor) => {
    if (!cliente.telefone) {
      alert('Este cliente não possui telefone/WhatsApp cadastrado.');
      return;
    }

    const numLimpo = cliente.telefone.replace(/\D/g, '');
    const numComDDI = numLimpo.startsWith('55') ? numLimpo : `55${numLimpo}`;

    const texto = `Olá *${cliente.nome}*! 👋%0A%0APassando para informar o resumo da sua caderneta na loja *${nomeLoja}*:%0A%0A💰 *Saldo Devedor Atual:* R$ ${cliente.saldoDevedorTotal.toFixed(2).replace('.', ',')}%0A%0AQualquer dúvida sobre os itens ou se desejar realizar o pagamento via PIX, estamos à disposição! Obrigado! 🙏`;

    window.open(`https://wa.me/${numComDDI}?text=${texto}`, '_blank');
  };

  if (!visivel) return null;

  return (
    <div className="tela-relatorio-cheia" style={{ display: 'flex', zIndex: 400 }}>
      {/* CABEÇALHO */}
      <div
        className="cabecalho-relatorio"
        style={{
          padding: '8px 12px',
          height: 'auto',
          minHeight: '46px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
          <h2 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            💳 Devedores / Caderneta
          </h2>
          <span style={{ fontSize: '0.7rem', color: '#64748b', background: '#ffffff', padding: '1px 6px', borderRadius: '10px', whiteSpace: 'nowrap', fontWeight: 600 }}>
            {nomeLoja}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
          <button
            style={{
              background: '#16a34a',
              color: '#ffffff',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap',
            }}
            onClick={() => handleAbrirModalCadastro()}
          >
            ➕ Cadastrar Cliente
          </button>

          <button
            className="btn-voltar-rel"
            style={{ padding: '6px 10px', fontSize: '0.8rem', fontWeight: 600, background: 'rgba(255,255,255,0.15)', borderRadius: '6px' }}
            onClick={onFechar}
          >
            ✕ Fechar
          </button>
        </div>
      </div>

      {/* CORPO PRINCIPAL */}
      <div className="corpo-relatorio-cheio" style={{ gap: '10px', padding: '10px 12px', display: 'flex', flexDirection: 'column' }}>
        {/* CARDS KPIS DE DEVEDORES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Com Débito
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
              {totalDevedoresComDebito} <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#991b1b' }}>cli</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #fca5a5', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.68rem', color: '#991b1b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Fiado Aberto
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
              R$ {totalDividasAberto.toFixed(2).replace('.', ',')}
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Cadastrados
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              {listaClientes.length} <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#16a34a' }}>total</span>
            </div>
          </div>
        </div>

        {/* MODO FICHA DO CLIENTE OU LISTA DE CLIENTES */}
        {clienteSelecionado ? (
          /* ================= DETALHES DO CLIENTE / CADERNETA ================= */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* BARRA SUPERIOR DE AÇÕES DO CLIENTE */}
            <div
              style={{
                background: '#ffffff',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div>
                <button
                  style={{
                    background: '#f1f5f9',
                    color: '#0f172a',
                    border: '1px solid #cbd5e1',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    marginBottom: '4px',
                  }}
                  onClick={() => setClienteSelecionado(null)}
                >
                  ⬅️ Voltar para Lista
                </button>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  👤 {clienteSelecionado.nome}
                  {(clienteSelecionado.saldoDevedorTotal || 0) > 0 ? (
                    <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '8px' }}>
                      🔴 Em Débito
                    </span>
                  ) : (
                    <span style={{ background: '#dcfce7', color: '#166534', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '8px' }}>
                      🟢 Quitado
                    </span>
                  )}
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1px' }}>
                  📞 {clienteSelecionado.telefone || 'Sem tel'} | CPF/CNPJ: {clienteSelecionado.cpfOuCnpj || 'Não informado'}
                </div>
              </div>

              {/* BOTOES DE ACAO DO CLIENTE */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  onClick={() => handleAbrirNovaCompra(clienteSelecionado)}
                  title="Lançar compra / bipar produtos anotados na caderneta"
                >
                  <span>📝</span>
                  <span>Lançar Compra / Retaguarda</span>
                </button>

                {(clienteSelecionado.saldoDevedorTotal || 0) > 0 && (
                  <>
                    <button
                      style={{
                        background: '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setValorAbatimento('');
                        setObsPagamento('');
                        setErroPagamento('');
                        setModalPagamento(true);
                      }}
                    >
                      💲 Abater Dívida
                    </button>

                    <button
                      style={{
                        background: '#25d366',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      onClick={() => handleEnviarWhatsApp(clienteSelecionado)}
                    >
                      📱 Cobrar WhatsApp
                    </button>
                  </>
                )}

                <button
                  style={{
                    background: '#f8fafc',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleAbrirModalCadastro(clienteSelecionado)}
                >
                  ✏️ Editar Dados
                </button>
              </div>
            </div>

            {/* PAINEL DE RESUMO DE CONTA */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Saldo Devedor</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: (clienteSelecionado.saldoDevedorTotal || 0) > 0 ? '#dc2626' : '#16a34a' }}>
                  R$ {(clienteSelecionado.saldoDevedorTotal || 0).toFixed(2).replace('.', ',')}
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Limite Fiado</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '1px' }}>
                  {clienteSelecionado.limiteFiado && clienteSelecionado.limiteFiado > 0
                    ? `R$ ${clienteSelecionado.limiteFiado.toFixed(2).replace('.', ',')}`
                    : 'Sem limite'}
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Total Comprado</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0284c7', marginTop: '1px' }}>
                  R$ {(clienteSelecionado.compras || []).reduce((a, c) => a + c.valorTotal, 0).toFixed(2).replace('.', ',')}
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Total Pagamentos</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#16a34a', marginTop: '1px' }}>
                  R$ {(clienteSelecionado.pagamentos || []).reduce((a, p) => a + p.valorPago, 0).toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>

            {/* ABAS DA FICHA (COMPRAS VS PAGAMENTOS) */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0', paddingBottom: '2px' }}>
              <button
                style={{
                  padding: '8px 16px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  borderBottom: abaFicha === 'compras' ? '3px solid #0284c7' : 'none',
                  color: abaFicha === 'compras' ? '#0284c7' : '#64748b',
                }}
                onClick={() => setAbaFicha('compras')}
              >
                🛒 Compras Fiado ({(clienteSelecionado.compras || []).length})
              </button>
              <button
                style={{
                  padding: '8px 16px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  borderBottom: abaFicha === 'pagamentos' ? '3px solid #16a34a' : 'none',
                  color: abaFicha === 'pagamentos' ? '#16a34a' : '#64748b',
                }}
                onClick={() => setAbaFicha('pagamentos')}
              >
                🧾 Histórico de Pagamentos Recebidos ({(clienteSelecionado.pagamentos || []).length})
              </button>
            </div>

            {/* CONTEÚDO DAS ABAS DA FICHA */}
            {abaFicha === 'compras' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {clienteSelecionado.compras.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', background: '#ffffff', borderRadius: '10px', color: '#64748b' }}>
                    Nenhuma compra fiado registrada para este cliente.
                  </div>
                ) : (
                  clienteSelecionado.compras
                    .slice()
                    .reverse()
                    .map((compra) => {
                      const isExpandida = compraExpandidaId === compra.id;
                      return (
                        <div
                          key={compra.id}
                          style={{
                            background: '#ffffff',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            overflow: 'hidden',
                          }}
                        >
                          <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <b style={{ fontSize: '0.9rem', color: '#0f172a' }}>Compra #{compra.id.slice(-6)}</b>
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                  📅 {compra.data} às {compra.hora}
                                </span>
                                {compra.status === 'quitada' && (
                                  <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                                    🟢 Quitada
                                  </span>
                                )}
                                {compra.status === 'parcial' && (
                                  <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                                    🟡 Abatida Parcial
                                  </span>
                                )}
                                {compra.status === 'pendente' && (
                                  <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                                    🔴 Pendente Total
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px' }}>
                                👤 Atendido por: <b>{compra.operadorNome}</b>
                              </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                                Total: R$ {compra.valorTotal.toFixed(2).replace('.', ',')}
                              </div>
                              <div style={{ fontSize: '0.82rem', color: compra.saldoRestante > 0 ? '#dc2626' : '#16a34a', fontWeight: 700 }}>
                                Resta: R$ {compra.saldoRestante.toFixed(2).replace('.', ',')}
                              </div>
                            </div>
                          </div>

                          <div style={{ padding: '0 14px 10px 14px', display: 'flex', justifyContent: 'flex-start' }}>
                            <button
                              style={{
                                background: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                              onClick={() => setCompraExpandidaId(isExpandida ? null : compra.id)}
                            >
                              {isExpandida ? '▲ Ocultar Itens Comprados' : `▼ Ver Itens Comprados (${compra.itens?.length || 0})`}
                            </button>
                          </div>

                          {/* LISTA EXPANDIDA DOS ITENS COMPRADOS */}
                          {isExpandida && (
                            <div style={{ background: '#f8fafc', padding: '12px 14px', borderTop: '1px solid #e2e8f0' }}>
                              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                📦 Produtos Adquiridos nesta Compra:
                              </div>
                              <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr style={{ background: '#e2e8f0', color: '#334155', textAlign: 'left' }}>
                                    <th style={{ padding: '6px' }}>Produto</th>
                                    <th style={{ padding: '6px', textAlign: 'center' }}>Qtd</th>
                                    <th style={{ padding: '6px', textAlign: 'right' }}>Unit. (R$)</th>
                                    <th style={{ padding: '6px', textAlign: 'right' }}>Subtotal (R$)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {compra.itens && compra.itens.length > 0 ? (
                                    compra.itens.map((it, idx) => (
                                      <tr key={idx} style={{ borderBottom: '1px solid #cbd5e1' }}>
                                        <td style={{ padding: '6px' }}>{it.nome}</td>
                                        <td style={{ padding: '6px', textAlign: 'center' }}>{it.quantidade}</td>
                                        <td style={{ padding: '6px', textAlign: 'right' }}>{it.preco_unitario.toFixed(2)}</td>
                                        <td style={{ padding: '6px', textAlign: 'right', fontWeight: 600 }}>{it.subtotal.toFixed(2)}</td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={4} style={{ padding: '8px', textAlign: 'center', color: '#64748b' }}>
                                        Itens não especificados nesta venda antiga.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })
                )}
              </div>
            ) : (
              /* ABA DE HISTÓRICO DE PAGAMENTOS */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {clienteSelecionado.pagamentos.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', background: '#ffffff', borderRadius: '10px', color: '#64748b' }}>
                    Nenhum pagamento registrado até o momento.
                  </div>
                ) : (
                  clienteSelecionado.pagamentos
                    .slice()
                    .reverse()
                    .map((pag) => (
                      <div
                        key={pag.id}
                        style={{
                          background: '#ffffff',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '10px',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#16a34a' }}>
                              💵 Abatimento de R$ {pag.valorPago.toFixed(2).replace('.', ',')}
                            </span>
                            <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                              {pag.formaPagamento.toUpperCase()}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                              📅 {pag.data} às {pag.hora}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
                            👤 Recebido por: <b>{pag.operadorNome}</b>
                            {pag.observacao && <span> | Obs: <i>{pag.observacao}</i></span>}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                            Saldo Antes: R$ {pag.saldoAnterior.toFixed(2)} ➔ <b>Restou Devendo: R$ {pag.saldoRestante.toFixed(2)}</b>
                          </div>
                        </div>

                        <button
                          style={{
                            background: '#f1f5f9',
                            color: '#0f172a',
                            border: '1px solid #cbd5e1',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          onClick={() => setReciboVisualizar({ cliente: clienteSelecionado, pagamento: pag })}
                        >
                          🧾 Recibo
                        </button>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>
        ) : (
          /* ================= LISTA DE CLIENTES E BUSCA ================= */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* PAINEL DE BUSCA E FILTROS */}
            <div
              style={{
                background: '#ffffff',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="🔍 Buscar por nome, telefone ou CPF..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '150px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                  }}
                />

                {/* FILTROS DE STATUS */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    style={{
                      padding: '5px 8px',
                      borderRadius: '6px',
                      border: '1px solid',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      background: filtroStatus === 'pendentes' ? '#fee2e2' : '#ffffff',
                      color: filtroStatus === 'pendentes' ? '#991b1b' : '#475569',
                      borderColor: filtroStatus === 'pendentes' ? '#fca5a5' : '#cbd5e1',
                    }}
                    onClick={() => setFiltroStatus('pendentes')}
                  >
                    🔴 Débito ({listaClientes.filter((c) => (c.saldoDevedorTotal || 0) > 0).length})
                  </button>

                  <button
                    style={{
                      padding: '5px 8px',
                      borderRadius: '6px',
                      border: '1px solid',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      background: filtroStatus === 'quitados' ? '#dcfce7' : '#ffffff',
                      color: filtroStatus === 'quitados' ? '#166534' : '#475569',
                      borderColor: filtroStatus === 'quitados' ? '#86efac' : '#cbd5e1',
                    }}
                    onClick={() => setFiltroStatus('quitados')}
                  >
                    🟢 Quitados ({listaClientes.filter((c) => (c.saldoDevedorTotal || 0) === 0).length})
                  </button>

                  <button
                    style={{
                      padding: '5px 8px',
                      borderRadius: '6px',
                      border: '1px solid',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      background: filtroStatus === 'todos' ? '#0284c7' : '#ffffff',
                      color: filtroStatus === 'todos' ? '#ffffff' : '#475569',
                      borderColor: filtroStatus === 'todos' ? '#0284c7' : '#cbd5e1',
                    }}
                    onClick={() => setFiltroStatus('todos')}
                  >
                    Todos ({listaClientes.length})
                  </button>
                </div>
              </div>
            </div>

            {/* LISTAGEM DE CLIENTES */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px' }}>
              {clientesFiltrados.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '20px 14px', textAlign: 'center', background: '#ffffff', borderRadius: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                  Nenhum cliente fiado encontrado para os filtros selecionados.
                </div>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <div
                    key={cliente.id}
                    style={{
                      background: '#ffffff',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: (cliente.saldoDevedorTotal || 0) > 0 ? '1px solid #fca5a5' : '1px solid #e2e8f0',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#0f172a', fontWeight: 700 }}>
                            👤 {cliente.nome}
                          </h4>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1px' }}>
                            📞 {cliente.telefone || 'Sem telefone'}
                          </div>
                        </div>

                        {(cliente.saldoDevedorTotal || 0) > 0 ? (
                          <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '8px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            🔴 Débito
                          </span>
                        ) : (
                          <span style={{ background: '#dcfce7', color: '#166534', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '8px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            🟢 Quitado
                          </span>
                        )}
                      </div>

                      {/* VALOR DEVENDO */}
                      <div style={{ marginTop: '8px', background: (cliente.saldoDevedorTotal || 0) > 0 ? '#fef2f2' : '#f0fdf4', padding: '6px 8px', borderRadius: '6px', border: (cliente.saldoDevedorTotal || 0) > 0 ? '1px solid #fecaca' : '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Saldo Devedor:</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: (cliente.saldoDevedorTotal || 0) > 0 ? '#dc2626' : '#16a34a' }}>
                            R$ {(cliente.saldoDevedorTotal || 0).toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                        {cliente.limiteFiado && cliente.limiteFiado > 0 ? (
                          <div style={{ fontSize: '0.7rem', color: '#475569', textAlign: 'right' }}>
                            Lim: R$ {cliente.limiteFiado.toFixed(2)}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* BOTOES DE ACAO CARD CLIENTE */}
                    <div style={{ display: 'flex', gap: '4px', borderTop: '1px dashed #e2e8f0', paddingTop: '8px' }}>
                      <button
                        style={{
                          flex: 1,
                          background: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'center',
                        }}
                        onClick={() => setClienteSelecionado(cliente)}
                      >
                        📂 Caderneta
                      </button>

                      {(cliente.saldoDevedorTotal || 0) > 0 && (
                        <button
                          style={{
                            background: '#16a34a',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            setClienteSelecionado(cliente);
                            setValorAbatimento('');
                            setObsPagamento('');
                            setErroPagamento('');
                            setModalPagamento(true);
                          }}
                        >
                          💲 Abater
                        </button>
                      )}

                      <button
                        style={{
                          background: '#f1f5f9',
                          color: '#334155',
                          border: '1px solid #cbd5e1',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleAbrirModalCadastro(cliente)}
                        title="Editar Dados do Cliente"
                      >
                        ✏️
                      </button>

                      <button
                        style={{
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: '1px solid #fca5a5',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                        title="Excluir Cliente"
                        onClick={() => {
                          if ((cliente.saldoDevedorTotal || 0) > 0) {
                            alert(`Não é possível excluir o cliente ${cliente.nome} pois ele possui saldo devedor pendente de R$ ${(cliente.saldoDevedorTotal || 0).toFixed(2)}.`);
                            return;
                          }
                          if (confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`)) {
                            onExcluirCliente(cliente.id);
                          }
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL DE FORMULÁRIO DE CADASTRO/EDIÇÃO DE CLIENTE ================= */}
      {modalNovoCliente && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div className="modal-container" style={{ maxWidth: '480px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0 }}>
                {clienteEditando ? '✏️ Editar Cliente Fiado' : '➕ Novo Cliente Fiado'}
              </h3>
              <button className="btn-fechar-modal" onClick={() => setModalNovoCliente(false)}>&times;</button>
            </div>

            <form onSubmit={handleSalvarClienteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {erroForm && (
                <div style={{ background: '#fee2e2', color: '#dc2626', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600 }}>
                  ⚠️ {erroForm}
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>Telefone / WhatsApp</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="(00) 90000-0000"
                    value={formTelefone}
                    onChange={(e) => setFormTelefone(mascaraTelefone(e.target.value))}
                    maxLength={15}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>CPF / CNPJ (Opcional)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    value={formCpf}
                    onChange={(e) => setFormCpf(mascaraCpfCnpj(e.target.value))}
                    maxLength={18}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>Limite Autorizado de Fiado (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 500.00 (Deixe em branco para sem limite)"
                  value={formLimite}
                  onChange={(e) => setFormLimite(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>Endereço (Opcional)</label>
                <input
                  type="text"
                  placeholder="Rua, Número, Bairro"
                  value={formEndereco}
                  onChange={(e) => setFormEndereco(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>Observações / Anotações</label>
                <textarea
                  rows={2}
                  placeholder="Anotações internas..."
                  value={formObservacoes}
                  onChange={(e) => setFormObservacoes(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600 }}
                  onClick={() => setModalNovoCliente(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', background: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 700 }}
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DE LANÇAR COMPRA AVULSA / RETAGUARDA (CADERNETA) ================= */}
      {modalNovaCompra && clienteSelecionado && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div className="modal-container" style={{ maxWidth: '640px', width: '95vw', maxHeight: '92vh', overflowY: 'auto', padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem' }}>
                <span>📝</span>
                <span>Lançar Compra / Caderneta</span>
              </h3>
              <button
                className="btn-fechar-modal"
                onClick={() => {
                  pararCamera();
                  setModalNovaCompra(false);
                }}
              >
                &times;
              </button>
            </div>

            {/* CARD RESUMO DO CLIENTE */}
            <div style={{ background: '#f0f9ff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #bae6fd', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.88rem', color: '#0369a1' }}>
                Cliente: <b>{clienteSelecionado.nome}</b>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '3px' }}>
                Saldo Devedor Atual: <b>R$ {(clienteSelecionado.saldoDevedorTotal || 0).toFixed(2).replace('.', ',')}</b>
                {clienteSelecionado.limiteFiado && clienteSelecionado.limiteFiado > 0 ? (
                  <span> | Limite: R$ {clienteSelecionado.limiteFiado.toFixed(2)}</span>
                ) : null}
              </div>
            </div>

            <form onSubmit={handleConfirmarNovaCompraManual} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {erroNovaCompra && (
                <div style={{ background: '#fee2e2', color: '#dc2626', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600 }}>
                  ⚠️ {erroNovaCompra}
                </div>
              )}

              {/* SEÇÃO 1: BIPAGEM / BUSCA DE PRODUTO COM CÂMERA INTEGRADA */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>📷</span>
                    <span>Bipar Produtos da Compra:</span>
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setCameraScannerAtiva((prev) => !prev)}
                      style={{
                        background: cameraScannerAtiva ? '#dc2626' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      {cameraScannerAtiva ? '✕ Fechar Câmera' : '📷 Abrir Câmera'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalItemManual(true)}
                      style={{
                        background: '#ffffff',
                        color: '#0369a1',
                        border: '1px solid #7dd3fc',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                      title="Adicionar item sem código (balcão/pesável)"
                    >
                      ➕ Item Balcão
                    </button>
                  </div>
                </div>

                {/* VISUALIZADOR DA CÂMERA COM SCANNER EM TEMPO REAL */}
                {cameraScannerAtiva && (
                  <div style={{ marginBottom: '10px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #059669', background: '#000000', position: 'relative' }}>
                    <div style={{ position: 'relative', width: '100%', height: '220px', background: '#000000' }}>
                      <video
                        ref={videoRef}
                        playsInline
                        muted
                        autoPlay
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />

                      {/* Mira e Laser */}
                      {!cameraCarregando && !erroCamera && (
                        <div className="mira-scanner">
                          <div className="linha-laser" />
                        </div>
                      )}

                      {/* Controles da Câmera (Lanterna e Alternar) */}
                      <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '6px', zIndex: 10 }}>
                        <button
                          type="button"
                          onClick={alternarLanterna}
                          style={{
                            background: lanternaAtiva ? '#f59e0b' : 'rgba(0,0,0,0.6)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '4px 8px',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          🔦 {lanternaAtiva ? 'Lanterna ON' : 'Lanterna'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setModoCamera((prev) => (prev === 'environment' ? 'user' : 'environment'))}
                          style={{
                            background: 'rgba(0,0,0,0.6)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '4px 8px',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          🔄 Girar
                        </button>
                      </div>

                      {/* Spinner ou Mensagem de Erro da Câmera */}
                      {cameraCarregando && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', color: '#ffffff', fontSize: '0.85rem' }}>
                          🔄 Iniciando câmera com foco contínuo...
                        </div>
                      )}
                      {erroCamera && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.85)', color: '#fca5a5', fontSize: '0.82rem', textAlign: 'center' }}>
                          ⚠️ {erroCamera}
                        </div>
                      )}

                      {/* Toast de Confirmação do Item Bipado sobre a Câmera */}
                      {ultimoItemBipado && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '8px',
                            right: '8px',
                            background: 'rgba(5, 150, 105, 0.95)',
                            color: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            zIndex: 15,
                            border: '1px solid #34d399',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          }}
                        >
                          <span>✅ +1 {ultimoItemBipado.nome}</span>
                          <span>(R$ {ultimoItemBipado.preco.toFixed(2)}) • Total: {ultimoItemBipado.quantidade} un</span>
                        </div>
                      )}
                    </div>
                    <div style={{ background: '#047857', color: '#ffffff', padding: '4px 8px', fontSize: '0.72rem', textAlign: 'center', fontWeight: 600 }}>
                      ⚡ Leitor ativo: aponte para os produtos sucessivamente para somar à lista!
                    </div>
                  </div>
                )}

                {/* BARRA DE DIGITAÇÃO / BUSCA DE PRODUTO */}
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      placeholder="Bipar ou digitar código de barras / nome..."
                      value={buscaProdutoCompra}
                      onChange={(e) => setBuscaProdutoCompra(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (buscaProdutoCompra.trim()) {
                            adicionarProdutoPorCodigoOuBip(buscaProdutoCompra);
                            setBuscaProdutoCompra('');
                          }
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.88rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (buscaProdutoCompra.trim()) {
                          adicionarProdutoPorCodigoOuBip(buscaProdutoCompra);
                          setBuscaProdutoCompra('');
                        }
                      }}
                      style={{
                        background: '#0284c7',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0 14px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      Inserir
                    </button>
                  </div>

                  {/* SUGESTÕES DE PRODUTOS ENCONTRADOS AO DIGITAR */}
                  {sugestoesProdutos.length > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: '#ffffff',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 200,
                        maxHeight: '180px',
                        overflowY: 'auto',
                        marginTop: '3px',
                      }}
                    >
                      {sugestoesProdutos.map((prod, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            adicionarProdutoPorCodigoOuBip(prod.codigo);
                            setBuscaProdutoCompra('');
                          }}
                          style={{
                            padding: '8px 10px',
                            borderBottom: '1px solid #f1f5f9',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.82rem',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#f0fdf4')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                        >
                          <div>
                            <span style={{ fontWeight: 600 }}>{prod.nome}</span>
                            <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>
                              Cód: {prod.codigo} {prod.codigo_barras ? `• Barras: ${prod.codigo_barras}` : ''}
                            </span>
                          </div>
                          <span style={{ fontWeight: 700, color: '#16a34a' }}>
                            R$ {(prod.preco_venda || 0).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SEÇÃO 2: LISTA DE PRODUTOS LANÇADOS NESTA COMPRA */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                    📋 Itens Desta Compra ({itensNovaCompra.reduce((acc, it) => acc + (it.quantidade || 0), 0)} un):
                  </label>
                  {itensNovaCompra.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setItensNovaCompra([])}
                      style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.74rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Limpar Lista
                    </button>
                  )}
                </div>

                {itensNovaCompra.length === 0 ? (
                  <div
                    style={{
                      padding: '16px',
                      textAlign: 'center',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px dashed #cbd5e1',
                      color: '#64748b',
                      fontSize: '0.82rem',
                    }}
                  >
                    📦 Nenhum produto bipado ainda. Use a câmera 📷 ou digite acima para adicionar itens à caderneta.
                  </div>
                ) : (
                  <div
                    style={{
                      maxHeight: '190px',
                      overflowY: 'auto',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      background: '#ffffff',
                    }}
                  >
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                      <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '6px 8px' }}>Produto</th>
                          <th style={{ textAlign: 'center', padding: '6px 4px', width: '90px' }}>Qtd</th>
                          <th style={{ textAlign: 'right', padding: '6px 4px', width: '75px' }}>Unit (R$)</th>
                          <th style={{ textAlign: 'right', padding: '6px 4px', width: '80px' }}>Total (R$)</th>
                          <th style={{ textAlign: 'center', padding: '6px 4px', width: '32px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {itensNovaCompra.map((item, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '6px 8px', wordBreak: 'break-word' }}>
                              <span style={{ fontWeight: 600 }}>{item.nome}</span>
                              <span style={{ display: 'block', fontSize: '0.68rem', color: '#64748b' }}>
                                Cód: {item.codigo}
                              </span>
                            </td>
                            <td style={{ padding: '4px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                                <button
                                  type="button"
                                  onClick={() => alterarQtdItem(index, -1)}
                                  style={{
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '4px',
                                    border: '1px solid #cbd5e1',
                                    background: '#f1f5f9',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  -
                                </button>
                                <span style={{ fontWeight: 700, minWidth: '22px', textAlign: 'center' }}>
                                  {item.quantidade}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => alterarQtdItem(index, 1)}
                                  style={{
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '4px',
                                    border: '1px solid #cbd5e1',
                                    background: '#f1f5f9',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td style={{ padding: '4px', textAlign: 'right' }}>
                              <input
                                type="number"
                                step="0.01"
                                value={item.preco_unitario}
                                onChange={(e) => alterarPrecoItem(index, e.target.value)}
                                style={{
                                  width: '65px',
                                  padding: '3px',
                                  fontSize: '0.78rem',
                                  borderRadius: '4px',
                                  border: '1px solid #cbd5e1',
                                  textAlign: 'right',
                                }}
                              />
                            </td>
                            <td style={{ padding: '6px 4px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                              R$ {item.subtotal.toFixed(2)}
                            </td>
                            <td style={{ padding: '4px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => removerItem(index)}
                                style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.85rem' }}
                                title="Remover item"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* VALOR DA COMPRA E DESCRIÇÃO SINCORNIZADOS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                    Valor Total (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0,00"
                    value={valorNovaCompra}
                    onChange={(e) => setValorNovaCompra(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #0284c7',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      marginTop: '4px',
                      color: '#0369a1',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                    Descrição Resumida dos Itens
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 2x Cerveja, 1x Picanha..."
                    value={descricaoNovaCompra}
                    onChange={(e) => setDescricaoNovaCompra(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                      marginTop: '4px',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>Data do Lançamento</label>
                  <input
                    type="date"
                    value={dataNovaCompra}
                    onChange={(e) => setDataNovaCompra(e.target.value)}
                    style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>Registrado por</label>
                  <input
                    type="text"
                    disabled
                    value={operadorAtualNome || 'Administrador'}
                    style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.85rem', marginTop: '4px', color: '#64748b' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>Observações (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Anotado na caderneta / balcão de frios"
                  value={obsNovaCompra}
                  onChange={(e) => setObsNovaCompra(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '4px' }}
                />
              </div>

              {/* SIMULAÇÃO DO NOVO SALDO */}
              {valorNovaCompra && !isNaN(parseFloat(valorNovaCompra)) && (
                <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '6px', border: '1px solid #fecaca', fontSize: '0.82rem', color: '#991b1b' }}>
                  Novo Saldo Devedor: <b>R$ {((clienteSelecionado.saldoDevedorTotal || 0) + parseFloat(valorNovaCompra)).toFixed(2).replace('.', ',')}</b>
                  {clienteSelecionado.limiteFiado && clienteSelecionado.limiteFiado > 0 && ((clienteSelecionado.saldoDevedorTotal || 0) + parseFloat(valorNovaCompra) > clienteSelecionado.limiteFiado) ? (
                    <div style={{ marginTop: '4px', fontWeight: 700, color: '#dc2626' }}>
                      ⚠️ Atenção: Ultrapassará o limite estipulado de R$ {clienteSelecionado.limiteFiado.toFixed(2)}.
                    </div>
                  ) : null}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600 }}
                  onClick={() => {
                    pararCamera();
                    setModalNovaCompra(false);
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ flex: 1.5, padding: '10px', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 700 }}
                >
                  Confirmar Lançamento {valorNovaCompra ? `(R$ ${parseFloat(valorNovaCompra || '0').toFixed(2)})` : ''}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MINI-MODAL PARA ADICIONAR ITEM AVULSO / MANUAL */}
      {modalItemManual && (
        <div className="modal-overlay" style={{ zIndex: 10005 }}>
          <div className="modal-container" style={{ maxWidth: '360px', padding: '18px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.96rem', color: '#0f172a' }}>
              ➕ Adicionar Item Balcão / Pesável
            </h4>
            <form onSubmit={handleAdicionarItemManual} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>Nome do Produto / Item *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 1kg Queijo Minas, Gelo, Espetinho..."
                  value={manualNome}
                  onChange={(e) => setManualNome(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '3px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>Quantidade *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    min="0.001"
                    placeholder="1"
                    value={manualQtd}
                    onChange={(e) => setManualQtd(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '3px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>Preço Unitário (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0,00"
                    value={manualPreco}
                    onChange={(e) => setManualPreco(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '3px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setModalItemManual(false)}
                  style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f1f5f9', color: '#475569', fontWeight: 600 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: '#0284c7', color: '#ffffff', fontWeight: 700 }}
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DE ABATER DÍVIDA / REGISTRAR PAGAMENTO ================= */}
      {modalPagamento && clienteSelecionado && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div className="modal-container" style={{ maxWidth: '440px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, color: '#16a34a' }}>
                💲 Registrar Abatimento / Pagamento
              </h3>
              <button className="btn-fechar-modal" onClick={() => setModalPagamento(false)}>&times;</button>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Cliente: <b>{clienteSelecionado.nome}</b></div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
                Dívida Atual: R$ {clienteSelecionado.saldoDevedorTotal.toFixed(2).replace('.', ',')}
              </div>
            </div>

            <form onSubmit={handleConfirmarPagamento} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {erroPagamento && (
                <div style={{ background: '#fee2e2', color: '#dc2626', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600 }}>
                  ⚠️ {erroPagamento}
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>Valor Entregue pelo Cliente (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0,00"
                  value={valorAbatimento}
                  onChange={(e) => setValorAbatimento(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #16a34a', fontSize: '1.3rem', fontWeight: 800, marginTop: '4px' }}
                />
                {/* BOTÕES RÁPIDOS DE VALOR */}
                <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                  <button
                    type="button"
                    style={{ flex: 1, padding: '4px', background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => setValorAbatimento(clienteSelecionado.saldoDevedorTotal.toFixed(2))}
                  >
                    Quitar Tudo (R$ {clienteSelecionado.saldoDevedorTotal.toFixed(2)})
                  </button>
                  {clienteSelecionado.saldoDevedorTotal > 10 && (
                    <button
                      type="button"
                      style={{ padding: '4px 8px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => setValorAbatimento((clienteSelecionado.saldoDevedorTotal / 2).toFixed(2))}
                    >
                      50% (R$ {(clienteSelecionado.saldoDevedorTotal / 2).toFixed(2)})
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>Forma de Recebimento</label>
                <select
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value as any)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', marginTop: '4px' }}
                >
                  <option value="dinheiro">💵 Dinheiro</option>
                  <option value="pix">📱 PIX</option>
                  <option value="cartao_debito">💳 Cartão de Débito</option>
                  <option value="cartao_credito">💳 Cartão de Crédito</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>Observação (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Abatimento parcial da compra do mês"
                  value={obsPagamento}
                  onChange={(e) => setObsPagamento(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '4px' }}
                />
              </div>

              {/* CALCULO DE RESULTADO */}
              {valorAbatimento && !isNaN(parseFloat(valorAbatimento)) && (
                <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '0.82rem', color: '#166534' }}>
                  Saldo Restante após Pagamento: <b>R$ {Math.max(0, clienteSelecionado.saldoDevedorTotal - parseFloat(valorAbatimento)).toFixed(2).replace('.', ',')}</b>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600 }}
                  onClick={() => setModalPagamento(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', background: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 700 }}
                >
                  Confirmar Pagamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DE RECIBO / COMPROVANTE DE PAGAMENTO ================= */}
      {reciboVisualizar && (
        <div className="modal-overlay" style={{ zIndex: 10001 }}>
          <div className="modal-container" style={{ maxWidth: '380px', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🧾</span>
                <span>Recibo de Abatimento</span>
              </h3>
              <button className="btn-fechar-modal" onClick={() => setReciboVisualizar(null)}>&times;</button>
            </div>

            <div id="area-impressao-termica" className="cupom-termico-box">
              <div className="cupom-header" style={{ textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 800 }}>{nomeLoja}</h4>
                <p style={{ margin: '2px 0', fontSize: '0.74rem' }}>RECIBO DE PAGAMENTO DE CADERNETA / FIADO</p>
                <div className="cupom-divisor" style={{ borderBottom: '1px dashed #000', margin: '6px 0' }} />
                <div style={{ textAlign: 'left', fontSize: '0.74rem' }}>
                  <p style={{ margin: '1px 0' }}><strong>CLIENTE:</strong> {reciboVisualizar.cliente.nome}</p>
                  <p style={{ margin: '1px 0' }}><strong>DATA/HORA:</strong> {reciboVisualizar.pagamento.data} {reciboVisualizar.pagamento.hora}</p>
                  <p style={{ margin: '1px 0' }}><strong>RECEBIDO POR:</strong> {reciboVisualizar.pagamento.operadorNome}</p>
                  <p style={{ margin: '1px 0' }}><strong>FORMA PGTO:</strong> {reciboVisualizar.pagamento.formaPagamento.toUpperCase()}</p>
                  {reciboVisualizar.pagamento.observacao && (
                    <p style={{ margin: '1px 0' }}><strong>OBS:</strong> {reciboVisualizar.pagamento.observacao}</p>
                  )}
                </div>
                <div className="cupom-divisor" style={{ borderBottom: '1px dashed #000', margin: '6px 0' }} />
              </div>

              <div className="cupom-totais" style={{ fontSize: '0.78rem' }}>
                <div className="cupom-linha-total" style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                  <span>DÍVIDA ANTERIOR:</span>
                  <span>R$ {reciboVisualizar.pagamento.saldoAnterior.toFixed(2)}</span>
                </div>
                <div
                  className="cupom-linha-total highlight-total"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#16a34a',
                    borderTop: '1px dashed #000',
                    paddingTop: '6px',
                    margin: '4px 0',
                    fontSize: '0.94rem',
                  }}
                >
                  <span>VALOR PAGO:</span>
                  <span><strong>R$ {reciboVisualizar.pagamento.valorPago.toFixed(2)}</strong></span>
                </div>
                <div className="cupom-linha-total" style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                  <span>SALDO RESTANTE:</span>
                  <span><strong>R$ {reciboVisualizar.pagamento.saldoRestante.toFixed(2)}</strong></span>
                </div>
              </div>

              <div className="cupom-divisor" style={{ borderBottom: '1px dashed #000', margin: '6px 0' }} />
              <div className="cupom-footer" style={{ textAlign: 'center', marginTop: '6px' }}>
                <p style={{ fontSize: '0.72rem', margin: '2px 0' }}>Comprovante emitido com sucesso.</p>
                <p style={{ fontSize: '0.62rem', color: '#64748b', margin: '1px 0' }}>
                  Impresso em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }} className="no-print">
              <button
                style={{ flex: 1, padding: '10px', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => {
                  let estilo = document.getElementById('estilo-impressao-termica-dinamico');
                  if (!estilo) {
                    estilo = document.createElement('style');
                    estilo.id = 'estilo-impressao-termica-dinamico';
                    document.head.appendChild(estilo);
                  }
                  estilo.innerHTML = `
                    @media print {
                      @page {
                        size: 80mm auto !important;
                        margin: 0mm !important;
                      }
                      html, body {
                        width: 80mm !important;
                        max-width: 80mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #fff !important;
                        height: auto !important;
                        min-height: 0 !important;
                      }
                      body * {
                        visibility: hidden !important;
                      }
                      #area-impressao-termica, #area-impressao-termica * {
                        visibility: visible !important;
                      }
                      #area-impressao-termica {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 74mm !important;
                        max-width: 74mm !important;
                        margin: 0 auto !important;
                        padding: 2mm 1mm 4mm 1mm !important;
                        font-family: 'Courier New', Courier, monospace !important;
                        font-size: 11px !important;
                        line-height: 1.25 !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                      }
                    }
                  `;
                  setTimeout(() => {
                    window.print();
                  }, 50);
                }}
              >
                🖨️ Imprimir Térmica
              </button>
              <button
                style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setReciboVisualizar(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
