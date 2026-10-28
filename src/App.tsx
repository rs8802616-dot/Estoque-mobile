import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  Store,
  Wallet,
  Package,
  Bike,
  BarChart3,
  Settings,
  ChevronDown,
  DollarSign,
  CreditCard,
  Receipt,
  PlusCircle,
  Layers,
  Tag,
  FolderKanban,
  Crown,
  ShoppingBag,
  Link2,
  Check,
  PieChart,
  TrendingUp,
  Users,
  Building2,
  KeyRound,
  BellRing,
  BookOpen,
  FileCheck2,
  Zap,
  LogOut,
  X,
  Database,
} from 'lucide-react';
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
} from './lib/barcodeScanner';
import {
  Venda,
  VendaItem,
  ProdutoCatalogo,
  ItemEstoque,
  ItemCarrinho,
  PermissoesLoja,
  PermissoesOperador,
  OperadorCaixa,
  Supermercado,
  ClienteDevedor,
  CompraFiado,
  PagamentoFiado,
  SessaoUsuario,
  PERMISSOES_LOJA_PADRAO,
  PERMISSOES_CAIXA_PADRAO,
  PERMISSOES_ADMIN_PADRAO,
  ConfiguracaoDelivery,
  PedidoDelivery,
  StatusPedidoDelivery,
} from './types';
import { CarrinhoVendaModal } from './components/CarrinhoVendaModal';
import { RelatorioVendasModal } from './components/RelatorioVendasModal';
import { GraficosVendasModal } from './components/GraficosVendasModal';
import { CentralRelatoriosModal } from './components/CentralRelatoriosModal';
import { GestaoDeliveryModal } from './components/GestaoDeliveryModal';
import { CardapioClienteDeliveryModal } from './components/CardapioClienteDeliveryModal';
import { CustomerDeliveryView } from './components/CustomerDeliveryView';
import { CaixaDeliveryPanel } from './components/CaixaDeliveryPanel';
import { CupomVendaModal } from './components/CupomVendaModal';
import { EtiquetasModal } from './components/EtiquetasModal';
import { GestaoCaixaModal } from './components/GestaoCaixaModal';
import { AlertasWhatsAppModal } from './components/AlertasWhatsAppModal';
import { GestaoDevedoresModal } from './components/GestaoDevedoresModal';
import { CentroNotificacoesModal } from './components/CentroNotificacoesModal';
import { TelaLogin } from './components/TelaLogin';
import { TermoConcordanciaModal } from './components/TermoConcordanciaModal';
import { AlterarCredenciaisDonoModal } from './components/AlterarCredenciaisDonoModal';
import { ManualUsuarioModal } from './components/ManualUsuarioModal';
import { consultarProdutoBomJawaKitPorCodigo } from './lib/bomJawaKitApi';
import {
  CATALOGO_AMBEV_OFICIAL,
  garantirCatalogoAmbevNoBancoGlobal,
  sincronizarCatalogoAmbevLocalmente,
  sincronizarCatalogoAmbevComFirestore,
  isProdutoAmbev,
} from './lib/catalogoAmbev';
import {
  CATALOGO_ADEGA_MIX_OFICIAL,
  garantirCatalogoAdegaNoBancoGlobal,
  sincronizarCatalogoAdegaComFirestore,
} from './lib/catalogoAdegaMix';
import {
  CATALOGO_ZE_DELIVERY_MIX_OFICIAL,
  garantirCatalogoZeDeliveryNoBancoGlobal,
  sincronizarCatalogoZeDeliveryComFirestore,
} from './lib/catalogoZeDeliveryMix';
import {
  CATALOGO_CHOPP_BRAHMA_EXPRESS_OFICIAL,
  garantirCatalogoChoppBrahmaNoBancoGlobal,
  sincronizarCatalogoChoppBrahmaComFirestore,
} from './lib/catalogoChoppBrahmaExpress';
import {
  CATALOGO_RISSUL_BEBIDAS_OFICIAL,
  garantirCatalogoRissulNoBancoGlobal,
  sincronizarCatalogoRissulComFirestore,
} from './lib/catalogoRissulBebidas';
import {
  tocarBeepCaixa,
  tocarSomSucessoVenda,
  tocarSomAlerta,
  tocarAlertaNovoPedidoDelivery,
} from './lib/soundUtils';
import { exportarEstoqueCSV } from './lib/exportUtils';
import { processarCodigoBarraBalanca, localizarMelhorLoteEstoque } from './lib/balancaUtils';
import {
  obterVendasPendentesOffline,
  adicionarVendaFilaOffline,
  sincronizarVendasPendentesFirestore,
  adicionarItemFilaOffline,
  sincronizarFilaOfflinePrioritaria,
  obterEstatisticasFilaOffline,
} from './lib/offlineSync';
import {
  SessaoCaixaTurno,
  MovimentacaoCaixa,
  LogAuditoria,
  CredenciaisDonoApp,
  TermoConcordanciaRegistro,
} from './types';
import { safeLocalStorageSet, safeLocalStorageGet } from './lib/safeStorage';
import {
  obterTodasImagensIndexedDB,
  obterFotoCache,
  salvarImagemIndexedDB,
  subscreverCacheImagens,
} from './lib/imageIndexedDB';
import { comprimirImagemParaArmazenamento, calcularTamanhoImagemKB, otimizarUrlImagem } from './lib/imageCompressor';
import { screenWakeLockManager } from './lib/screenWakeLock';
import {
  subscribeSupermercados,
  subscribeEstoque,
  subscribeCatalogo,
  subscribeVendas,
  subscribeOperadores,
  subscribeClientesDevedores,
  salvarSupermercadoFirestore,
  salvarItemEstoqueFirestore,
  salvarProdutoCatalogoFirestore,
  salvarLoteProdutosCatalogoFirestore,
  buscarProdutoCatalogoFirestore,
  buscarItemEstoquePorCodigoFirestore,
  salvarVendaFirestore,
  salvarOperadorFirestore,
  salvarClienteDevedorFirestore,
  excluirItemEstoqueFirestore,
  excluirTodosLotesProdutoEstoqueFirestore,
  excluirProdutoCatalogoFirestore,
  excluirSupermercadoFirestore,
  limparTodasLojasDeTesteFirestore,
  excluirOperadorFirestore,
  excluirClienteDevedorFirestore,
  inicializarDadosIniciaisFirestore,
  migrarTodosCadastrosParaNovoBanco,
  migrarDiretamenteDoBancoAntigoParaNovo,
  salvarLogAuditoriaFirestore,
  subscribeLogsAuditoria,
  sanitizarItemEstoque,
} from './lib/firestoreSync';
import {
  gerarSessaoToken,
  obterUserKey,
  registrarSessaoAtivaNoFirestore,
  monitorarSessaoUnicaDispositivo,
  encerrarSessaoAtivaNoFirestore,
} from './lib/sessionManager';

const LISTA_CATEGORIAS = [
  'Mercearia / Grãos & Cereais',
  'Massas & Molhos',
  'Laticínios & Frios',
  'Açougue / Carnes & Aves',
  'Peixaria & Frutos do Mar',
  'Padaria & Confeitaria',
  'Hortifrúti (Frutas, Legumes & Verduras)',
  'Bebidas Não Alcoólicas (Sucos, Refrigerantes, Águas)',
  'Bebidas Alcoólicas (Cervejas, Vinhos, Destilados)',
  'Matinais & Cereais (Café, Chá, Achocolatados)',
  'Congelados & Pratos Prontos',
  'Enlatados, Conservas & Condimentos',
  'Doces, Chocolates & Bomboniere',
  'Biscoitos, Snacks & Salgadinhos',
  'Óleos, Azeites & Temperos',
  'Sobremesas & Confeitaria',
  'Alimentos Saudáveis & Diet / Light / Zero',
  'Higiene Pessoal',
  'Limpeza Doméstica',
  'Bebês & Infantil',
  'Pet Shop',
  'Outros',
];

export const PRODUTOS_PADRAO_ADEGA: ItemEstoque[] = [
  {
    codigo: '7891991000832',
    nome: 'Cerveja Heineken Long Neck 330ml (Gelada)',
    marca: 'Heineken',
    categoria: 'Bebidas Alcoólicas (Cervejas, Vinhos, Destilados)',
    quantidade: 48,
    lote: 'L-HN01',
    validade: '2027-06-30',
    preco_custo: 5.50,
    preco_venda: 8.90,
    foto: 'https://images.unsplash.com/photo-1618886614638-80e3c15cd819?w=300&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '7891149103223',
    nome: 'Cerveja Brahma Duplo Malte Lata 350ml (Gelada)',
    marca: 'Brahma',
    categoria: 'Bebidas Alcoólicas (Cervejas, Vinhos, Destilados)',
    quantidade: 72,
    lote: 'L-BR02',
    validade: '2027-04-15',
    preco_custo: 3.20,
    preco_venda: 5.49,
    foto: 'https://images.unsplash.com/photo-1608270199147-38e55e378c2e?w=300&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '7891991010831',
    nome: 'Cerveja Corona Extra 330ml (Gelada)',
    marca: 'Corona',
    categoria: 'Bebidas Alcoólicas (Cervejas, Vinhos, Destilados)',
    quantidade: 36,
    lote: 'L-CR03',
    validade: '2027-08-20',
    preco_custo: 6.00,
    preco_venda: 9.90,
    foto: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=300&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '5000281005400',
    nome: 'Whisky Johnnie Walker Red Label 1L',
    marca: 'Johnnie Walker',
    categoria: 'Bebidas Alcoólicas (Cervejas, Vinhos, Destilados)',
    quantidade: 15,
    lote: 'L-JW01',
    validade: '2030-12-31',
    preco_custo: 68.00,
    preco_venda: 99.90,
    foto: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=300&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '5010106113127',
    nome: 'Gin Tanqueray London Dry 750ml',
    marca: 'Tanqueray',
    categoria: 'Bebidas Alcoólicas (Cervejas, Vinhos, Destilados)',
    quantidade: 12,
    lote: 'L-TQ01',
    validade: '2030-12-31',
    preco_custo: 82.00,
    preco_venda: 119.90,
    foto: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '7804320743120',
    nome: 'Vinho Tinto Casillero del Diablo Cabernet 750ml',
    marca: 'Concha y Toro',
    categoria: 'Bebidas Alcoólicas (Cervejas, Vinhos, Destilados)',
    quantidade: 20,
    lote: 'L-CD01',
    validade: '2029-05-10',
    preco_custo: 35.00,
    preco_venda: 54.90,
    foto: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '7894900010015',
    nome: 'Refrigerante Coca-Cola 2 Litros (Gelada)',
    marca: 'Coca-Cola',
    categoria: 'Bebidas Não Alcoólicas (Sucos, Refrigerantes, Águas)',
    quantidade: 40,
    lote: 'L-CC01',
    validade: '2027-02-28',
    preco_custo: 7.20,
    preco_venda: 11.50,
    foto: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '9002490100070',
    nome: 'Energético Red Bull Energy Drink 250ml (Gelado)',
    marca: 'Red Bull',
    categoria: 'Bebidas Não Alcoólicas (Sucos, Refrigerantes, Águas)',
    quantidade: 50,
    lote: 'L-RB01',
    validade: '2027-09-15',
    preco_custo: 6.50,
    preco_venda: 10.90,
    foto: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '7898901234001',
    nome: 'Saco de Gelo Cubo Filtrado 5kg',
    marca: 'Gelo Cristal',
    categoria: 'Congelados & Pratos Prontos',
    quantidade: 25,
    lote: 'L-GC01',
    validade: '2027-01-01',
    preco_custo: 7.00,
    preco_venda: 14.00,
    foto: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '7898901234002',
    nome: 'Carvão Vegetal Especial para Churrasco 3kg',
    marca: 'Bom de Fogo',
    categoria: 'Mercearia / Grãos & Cereais',
    quantidade: 20,
    lote: 'L-CV01',
    validade: '2030-01-01',
    preco_custo: 12.00,
    preco_venda: 21.90,
    foto: 'https://images.unsplash.com/photo-1558030006-450675393462?w=300&q=80',
    tipoCadastro: 'padrao',
  },
];

export default function App() {
  // Detecta se a URL é exclusiva do Cardápio do Cliente (Delivery / Totem)
  const urlParamsAtivo = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const publicLojaSlugAtivo =
    urlParamsAtivo?.get('loja') ||
    urlParamsAtivo?.get('loja_id') ||
    (urlParamsAtivo?.get('delivery') === 'true' || urlParamsAtivo?.get('delivery') === '1' ? 'loja_matriz_01' : null);
  const painelParamAtivo = urlParamsAtivo?.get('painel');
  const isModoCliente = Boolean(publicLojaSlugAtivo && !painelParamAtivo);

  // Global & Store States
  const [supermercadoAtual, setSupermercadoAtual] = useState<string>(() => {
    if (publicLojaSlugAtivo) {
      return publicLojaSlugAtivo;
    }
    return (typeof window !== 'undefined' ? localStorage.getItem('supermercadoAtualId') : null) || 'loja_matriz_01';
  });
  const [nomeSupermercadoAtivo, setNomeSupermercadoAtivo] = useState<string>(
    () => localStorage.getItem('supermercadoNome') || 'Supermercado Matriz'
  );

  const [totalProdutosCadastrados, setTotalProdutosCadastrados] = useState<number>(() => {
    try {
      const salvo = localStorage.getItem('total_produtos_catalogo_banco');
      if (salvo && !isNaN(Number(salvo)) && Number(salvo) > 0) {
        return Number(salvo);
      }
      return 8849;
    } catch {
      return 8849;
    }
  });

  const [catalogoGlobal, setCatalogoGlobal] = useState<ProdutoCatalogo[]>(() => {
    const salvo = localStorage.getItem('catalogoGlobalFirebase');
    let listaBase: ProdutoCatalogo[] = [];
    if (salvo) {
      try {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed) && parsed.length > 0) {
          listaBase = parsed;
        }
      } catch (e) {}
    }
    // Garante que o catálogo oficial Ambev, Mix Adega, Mix Zé Delivery, Chopp Brahma Express e Bebidas Rissul estejam presentes
    const { catalogoCompleto: comAmbev } = garantirCatalogoAmbevNoBancoGlobal(listaBase);
    const { catalogoCompleto: comAdega } = garantirCatalogoAdegaNoBancoGlobal(comAmbev);
    const { catalogoCompleto: comZe } = garantirCatalogoZeDeliveryNoBancoGlobal(comAdega);
    const { catalogoCompleto: comChopp } = garantirCatalogoChoppBrahmaNoBancoGlobal(comZe);
    const { catalogoCompleto } = garantirCatalogoRissulNoBancoGlobal(comChopp);
    try {
      localStorage.setItem('catalogoGlobalFirebase', JSON.stringify(catalogoCompleto));
    } catch (e) {}
    return catalogoCompleto;
  });

  const [carregandoEstoqueInicial, setCarregandoEstoqueInicial] = useState<boolean>(() => {
    try {
      const currentStoreId = typeof window !== 'undefined' ? (localStorage.getItem('supermercadoAtualId') || 'loja_matriz_01') : 'loja_matriz_01';
      const salvo = typeof window !== 'undefined' ? localStorage.getItem(`estoque_${currentStoreId}`) : null;
      if (!salvo) return true;
      const parsed = JSON.parse(salvo);
      // Se tiver apenas o mock demo antigo de carvão/costela, trata como carregando
      if (Array.isArray(parsed) && parsed.some((p: any) => p.codigo === '7898901234002' || p.nome === 'Carvão Vegetal Especial para Churrasco 3kg')) {
        return true;
      }
      return false;
    } catch {
      return true;
    }
  });

  const [estoque, setEstoque] = useState<ItemEstoque[]>(() => {
    const currentStoreId = typeof window !== 'undefined' ? (localStorage.getItem('supermercadoAtualId') || 'loja_matriz_01') : 'loja_matriz_01';
    const salvo = typeof window !== 'undefined' ? localStorage.getItem(`estoque_${currentStoreId}`) : null;
    if (salvo) {
      try {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Descarta mock demo antigo de carvão/costela para não piscar fotos erradas
          const isMockDemo = parsed.some((p: any) => p.codigo === '7898901234002' || p.nome === 'Carvão Vegetal Especial para Churrasco 3kg');
          if (!isMockDemo) {
            return parsed.map(sanitizarItemEstoque);
          }
        }
      } catch (e) {}
    }
    // Inicia vazio para aguardar o Firebase carregar os produtos reais da loja
    return [];
  });

  // UI Search & Navigation States
  const [busca, setBusca] = useState<string>('');
  const [menuAtivo, setMenuAtivo] = useState<boolean>(false);
  const [grupoMenuAberto, setGrupoMenuAberto] = useState<string | null>(() => {
    try {
      return localStorage.getItem('menu_grupo_aberto') || 'caixa';
    } catch {
      return 'caixa';
    }
  });
  const [linkCardapioCopiadoMenu, setLinkCardapioCopiadoMenu] = useState<boolean>(false);

  const alternarGrupoMenu = (grupo: string) => {
    setGrupoMenuAberto((prev) => {
      const proximo = prev === grupo ? null : grupo;
      try {
        localStorage.setItem('menu_grupo_aberto', proximo || '');
      } catch {}
      return proximo;
    });
  };

  // Scanner States (Câmera & Leitor Físico USB/Bluetooth)
  const [leitorAtivo, setLeitorAtivo] = useState<boolean>(false);
  const [destinoLeitor, setDestinoLeitor] = useState<'busca' | 'cadastro' | 'lote' | 'relatorio' | 'carrinho'>('carrinho');
  const [processandoOCR, setProcessandoOCR] = useState<boolean>(false);
  const [ultimoItemBipadoToast, setUltimoItemBipadoToast] = useState<string>('');
  const [ultimoItemScaneadoInfo, setUltimoItemScaneadoInfo] = useState<{
    nome: string;
    codigo: string;
    preco: number;
    quantidadeNoCarrinho: number;
    estoqueDisponivel: number;
    status: 'sucesso' | 'erro' | 'aviso';
    mensagem?: string;
    timestamp: number;
  } | null>(null);
  const [lanternaAtiva, setLanternaAtiva] = useState<boolean>(false);
  const [zoomNivel, setZoomNivel] = useState<number>(1);
  const ultimoCodigoLidoRef = useRef<{ codigo: string; timestamp: number }>({ codigo: '', timestamp: 0 });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const frameScanIntervalRef = useRef<any>(null);
  const destinoLeitorRef = useRef<string>(destinoLeitor);

  useEffect(() => {
    destinoLeitorRef.current = destinoLeitor;
  }, [destinoLeitor]);

  // Carrega fotos cacheadas no IndexedDB (armazenamento persistente imune a QuotaExceededError do localStorage)
  useEffect(() => {
    const aplicarFotosDoCache = (mapaImagens?: Map<string, string>) => {
      setCatalogoGlobal((prev) => {
        let alterou = false;
        const novo = prev.map((p) => {
          if (!p.imagem && p.codigo) {
            const fotoCache = mapaImagens?.get(p.codigo) || obterFotoCache(p.codigo);
            if (fotoCache) {
              alterou = true;
              return { ...p, imagem: fotoCache };
            }
          }
          return p;
        });
        return alterou ? novo : prev;
      });

      setEstoque((prev) => {
        let alterou = false;
        const novo = prev.map((it) => {
          if (!it.foto && it.codigo) {
            const fotoCache = mapaImagens?.get(it.codigo) || obterFotoCache(it.codigo);
            if (fotoCache) {
              alterou = true;
              return { ...it, foto: fotoCache };
            }
          }
          return it;
        });
        return alterou ? novo : prev;
      });
    };

    obterTodasImagensIndexedDB()
      .then((mapaImagens) => {
        if (mapaImagens && mapaImagens.size > 0) {
          aplicarFotosDoCache(mapaImagens);
        }
      })
      .catch((e) => console.warn('Aviso ao sincronizar fotos do IndexedDB:', e));

    const unsubscribeCache = subscreverCacheImagens(() => {
      aplicarFotosDoCache();
    });

    return () => {
      unsubscribeCache();
    };
  }, []);

  // Screen Persistence on Reload/Refresh
  const telaSalvaInicial = (() => {
    try {
      const salva = localStorage.getItem('tela_ativa_sistema') || '';
      if (salva === 'relatorio_catalogo') {
        localStorage.removeItem('tela_ativa_sistema');
        return '';
      }
      return salva;
    } catch {
      return '';
    }
  })();

  // Modals visibility
  const [modalSupermercadoVisivel, setModalSupermercadoVisivel] = useState<boolean>(() => {
    return telaSalvaInicial === 'modal_supermercados' || telaSalvaInicial === 'modal_banco_dados_master';
  });
  const [modalCadastroVisivel, setModalCadastroVisivel] = useState<boolean>(() => {
    return telaSalvaInicial === 'modal_cadastro_estoque' || telaSalvaInicial === 'modal_cadastro_master';
  });
  const [modalVendaVisivel, setModalVendaVisivel] = useState<boolean>(false);
  const [modalNotificacoesVisivel, setModalNotificacoesVisivel] = useState<boolean>(() => {
    return telaSalvaInicial.startsWith('modal_notificacoes_');
  });
  const [abaNotificacoesInicial, setAbaNotificacoesInicial] = useState<'estoque_baixo' | 'validade' | 'resumo'>(() => {
    if (telaSalvaInicial === 'modal_notificacoes_validade') return 'validade';
    if (telaSalvaInicial === 'modal_notificacoes_resumo') return 'resumo';
    return 'estoque_baixo';
  });

  // User-Defined Low Stock Reorder Threshold
  const [limiarEstoqueMinimo, setLimiarEstoqueMinimo] = useState<number>(() => {
    const currentStoreId = localStorage.getItem('supermercadoAtualId') || 'loja_matriz_01';
    const salvo = localStorage.getItem(`limiar_estoque_minimo_${currentStoreId}`);
    return salvo ? parseInt(salvo, 10) || 5 : 5;
  });

  // Full Screen Report
  const [relatorioCheioVisivel, setRelatorioCheioVisivel] = useState<boolean>(() => {
    return telaSalvaInicial === 'relatorio_estoque';
  });
  const [modoRelatorioAtual, setModoRelatorioAtual] = useState<'estoque'>('estoque');
  const [buscaRelatorio, setBuscaRelatorio] = useState<string>(() => {
    try {
      const salva = localStorage.getItem('busca_relatorio_salva') || '';
      if (salva.toLowerCase().includes('rodrigo.souza') || salva.toLowerCase() === 'rodrigo') {
        localStorage.removeItem('busca_relatorio_salva');
        return '';
      }
      return salva;
    } catch {
      return '';
    }
  });
  const [consultandoEAN, setConsultandoEAN] = useState<boolean>(false);

  // Supermarket Form & Store List
  const [listaSupermercados, setListaSupermercados] = useState<Supermercado[]>(() => {
    const salvo = localStorage.getItem('lista_supermercados_app');
    if (salvo !== null && salvo !== undefined) {
      try {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'loja_matriz_01',
        nome: 'Adega & Delivery Matriz Express',
        cnpj: '12.345.678/0001-90',
        senha: '123',
        slug: 'loja_matriz_01',
        marca: 'Adega Express',
        logo_url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200&q=80',
        taxa_entrega: 6.90,
        tempo_estimado_entrega: '30-45 min',
        taxas_bairro: [
          { id: 'b1', nome: 'Centro', taxa: 5.00 },
          { id: 'b2', nome: 'Jardim América', taxa: 7.00 },
          { id: 'b3', nome: 'Vila Nova', taxa: 6.00 },
          { id: 'b4', nome: 'Bela Vista', taxa: 6.50 },
          { id: 'b5', nome: 'Consolação', taxa: 6.50 },
          { id: 'b6', nome: 'Pinheiros', taxa: 8.00 },
          { id: 'b7', nome: 'Outro Bairro (Taxa Padrão)', taxa: 8.00 },
        ],
        ativo: true,
      },
    ];
  });
  const [lojaEditandoId, setLojaEditandoId] = useState<string | null>(null);
  const [buscaLoja, setBuscaLoja] = useState<string>('');
  const [senhasVisiveisLista, setSenhasVisiveisLista] = useState<Record<string, boolean>>({});

  const [abaDonaApp, setAbaDonaApp] = useState<'supermercados' | 'banco_dados'>(() => {
    return telaSalvaInicial === 'modal_banco_dados_master' ? 'banco_dados' : 'supermercados';
  });
  const [buscaMasterBd, setBuscaMasterBd] = useState<string>('');
  const [filtroMasterOrigem, setFiltroMasterOrigem] = useState<'todos' | 'catalogo' | 'estoque'>('todos');
  const [paginaMasterBd, setPaginaMasterBd] = useState<number>(1);
  const [limiteRelatorioCatalogo, setLimiteRelatorioCatalogo] = useState<number>(50);

  const [regLojaNome, setRegLojaNome] = useState<string>('');
  const [regLojaCnpj, setRegLojaCnpj] = useState<string>('');
  const [regLojaSenha, setRegLojaSenha] = useState<string>('');
  const [regLojaLimiteCaixas, setRegLojaLimiteCaixas] = useState<number>(5);
  const [regLojaLimiteSupervisores, setRegLojaLimiteSupervisores] = useState<number>(2);
  const [regLojaPermissoes, setRegLojaPermissoes] = useState<PermissoesLoja>(PERMISSOES_LOJA_PADRAO);
  const [senhaVisivel, setSenhaVisivel] = useState<boolean>(false);
  const [msgRegLoja, setMsgRegLoja] = useState<React.ReactNode>('');

  // Active User Profile & Session State (Sessão persistida apenas se autenticada explicitamente)
  const [telaLoginVisivel, setTelaLoginVisivel] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const isPublicDelivery =
        urlParams.get('delivery') === 'true' ||
        urlParams.get('delivery') === '1' ||
        urlParams.get('cardapio') === 'true' ||
        urlParams.get('cardapio') === '1' ||
        urlParams.get('loja') ||
        urlParams.get('loja_id') ||
        window.location.hash.includes('cardapio') ||
        window.location.hash.includes('delivery');
      const painelParam = urlParams.get('painel');
      if (isPublicDelivery && !painelParam) {
        return false;
      }
    }
    const isAutenticado = localStorage.getItem('usuario_autenticado') === 'true';
    const perfilSalvo = localStorage.getItem('perfilAtivoTipo');
    return !isAutenticado || !perfilSalvo;
  });
  const [perfilAtivo, setPerfilAtivo] = useState<'dona_app' | 'admin_loja' | 'caixa'>(() => {
    const isAutenticado = localStorage.getItem('usuario_autenticado') === 'true';
    if (!isAutenticado) return 'dona_app';
    return (localStorage.getItem('perfilAtivoTipo') as any) || 'dona_app';
  });
  const [operadorAtivoId, setOperadorAtivoId] = useState<string | null>(() => {
    const isAutenticado = localStorage.getItem('usuario_autenticado') === 'true';
    if (!isAutenticado) return null;
    return localStorage.getItem('operadorAtivoId') || null;
  });
  const [sessaoTokenAtivo, setSessaoTokenAtivo] = useState<string>(() => {
    const isAutenticado = localStorage.getItem('usuario_autenticado') === 'true';
    if (!isAutenticado) return '';
    return localStorage.getItem('sessao_ativa_token') || '';
  });
  const [avisoDesconectadoMultiAparelho, setAvisoDesconectadoMultiAparelho] = useState<string | null>(null);

  // Modals: Termo de Concordância, Credenciais do Dono & Manual do Usuário
  const [modalTermoVisivel, setModalTermoVisivel] = useState<boolean>(false);
  const [termoApenasLeitura, setTermoApenasLeitura] = useState<boolean>(false);
  const [modalCredenciaisDonoVisivel, setModalCredenciaisDonoVisivel] = useState<boolean>(false);
  const [modalManualVisivel, setModalManualVisivel] = useState<boolean>(false);
  const [filaOfflineStats, setFilaOfflineStats] = useState(() => obterEstatisticasFilaOffline());

  // Operators / Cashiers List (Per Store)
  const [listaOperadores, setListaOperadores] = useState<OperadorCaixa[]>(() => {
    const storeId = localStorage.getItem('supermercadoAtualId') || 'loja_matriz_01';
    const salvo = localStorage.getItem(`operadores_caixa_${storeId}`);
    if (salvo) {
      try { return JSON.parse(salvo); } catch (e) {}
    }
    return [
      {
        id: 'op_padrao_01',
        lojaId: storeId,
        nome: 'João Silva (Operador Caixa)',
        cargo: 'Operador de Caixa',
        cpfOuUsuario: 'caixa01',
        pinSenha: '123',
        permissoes: PERMISSOES_CAIXA_PADRAO,
        ativo: true,
        dataCadastro: new Date().toLocaleDateString('pt-BR'),
      },
      {
        id: 'op_padrao_02',
        lojaId: storeId,
        nome: 'Maria Souza (Supervisora)',
        cargo: 'Supervisor',
        cpfOuUsuario: 'supervisor',
        pinSenha: '123',
        permissoes: PERMISSOES_ADMIN_PADRAO,
        ativo: true,
        dataCadastro: new Date().toLocaleDateString('pt-BR'),
      },
    ];
  });

  // Operator Modal & Form States
  const [modalOperadoresVisivel, setModalOperadoresVisivel] = useState<boolean>(() => {
    return telaSalvaInicial === 'modal_operadores';
  });
  const [opEditandoId, setOpEditandoId] = useState<string | null>(null);
  const [regOpNome, setRegOpNome] = useState<string>('');
  const [regOpCpf, setRegOpCpf] = useState<string>('');
  const [regOpSenha, setRegOpSenha] = useState<string>('');
  const [regOpCargo, setRegOpCargo] = useState<'Operador de Caixa' | 'Supervisor' | 'Administrador'>('Operador de Caixa');
  const [regOpPermissoes, setRegOpPermissoes] = useState<PermissoesOperador>(PERMISSOES_CAIXA_PADRAO);
  const [msgRegOp, setMsgRegOp] = useState<React.ReactNode>('');

  // Restricted Access Warning Popup
  const [avisoRestrito, setAvisoRestrito] = useState<string | null>(null);

  // Firestore Database Migration States
  const [migrandoBanco, setMigrandoBanco] = useState<boolean>(false);
  const [msgMigracao, setMsgMigracao] = useState<string | null>(null);

  // Product Form
  const [modoCadastroItem, setModoCadastroItem] = useState<'estoque' | 'master'>('estoque');
  const [tipoProdutoCadastro, setTipoProdutoCadastro] = useState<'padrao' | 'interno'>('padrao');
  const [cadEstoqueIlimitado, setCadEstoqueIlimitado] = useState<boolean>(true);
  const [filtroTipoProduto, setFiltroTipoProduto] = useState<'todos' | 'interno' | 'padrao'>('todos');
  const [codigoEditando, setCodigoEditando] = useState<{ codigo: string; validade: string; lote: string } | null>(null);
  const [cadCod, setCadCod] = useState<string>('');
  const [cadNome, setCadNome] = useState<string>('');
  const [cadMarca, setCadMarca] = useState<string>('');
  const [cadCategoria, setCadCategoria] = useState<string>('');
  const [cadQtd, setCadQtd] = useState<string>('1');
  const [cadLote, setCadLote] = useState<string>('');
  const [cadVal, setCadVal] = useState<string>('');
  const [cadCusto, setCadCusto] = useState<string>('');
  const [cadPreco, setCadPreco] = useState<string>('');
  const [fotoTemp, setFotoTemp] = useState<string>('');
  const [msgCad, setMsgCad] = useState<React.ReactNode>('');

  // Identifica se o produto já existe no Catálogo Global do Banco de Dados Central
  const itemCatalogoExistente = useMemo(() => {
    if (tipoProdutoCadastro === 'interno') return undefined;
    const codLimpo = (cadCod || '').trim();
    if (!codLimpo) return undefined;
    return catalogoGlobal.find((c) => c.codigo?.trim() === codLimpo);
  }, [cadCod, catalogoGlobal, tipoProdutoCadastro]);

  // Se o produto já existe no Catálogo Master e o usuário estiver cadastrando/editando estoque de loja,
  // bloqueia edição de Nome Oficial, Marca, Categoria e Foto para garantir integridade e padronização absoluta
  const isProdutoBloqueadoParaEdicaoMestre = Boolean(
    itemCatalogoExistente && (perfilAtivo !== 'dona_app' || modoCadastroItem === 'estoque')
  );

  // Stock Sale/Markdown Modal & Multi-Item Cart
  const [prodAtual, setProdAtual] = useState<ItemEstoque | null>(null);
  const [qtdBaixa, setQtdBaixa] = useState<number | string>(1);
  const [formaPagamento, setFormaPagamento] = useState<'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'fiado'>('pix');
  const [clienteFiadoSelecionadoId, setClienteFiadoSelecionadoId] = useState<string>('');
  const [msgVenda, setMsgVenda] = useState<React.ReactNode>('');

  // Multi-Item Shopping Cart (Carrinho de Vendas Múltiplas)
  const [modalCarrinhoVisivel, setModalCarrinhoVisivel] = useState<boolean>(() => {
    return telaSalvaInicial === 'modal_carrinho';
  });
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>(() => {
    try {
      const storeId = localStorage.getItem('supermercadoAtualId') || 'loja_matriz_01';
      const salvo = localStorage.getItem(`carrinho_vendas_${storeId}`);
      return salvo ? JSON.parse(salvo) : [];
    } catch {
      return [];
    }
  });

  // Debtors / Fiado Management States
  const [modalDevedoresVisivel, setModalDevedoresVisivel] = useState<boolean>(() => {
    return telaSalvaInicial === 'modal_devedores';
  });
  const [clientesDevedores, setClientesDevedores] = useState<ClienteDevedor[]>(() => {
    const storeId = localStorage.getItem('supermercadoAtualId') || 'loja_matriz_01';
    const salvo = localStorage.getItem(`clientes_devedores_${storeId}`);
    if (salvo) {
      try { return JSON.parse(salvo); } catch (e) {}
    }
    return [];
  });

  // Central de Relatórios Unificada & Modais
  const [modalCentralRelatoriosVisivel, setModalCentralRelatoriosVisivel] = useState<boolean>(() => {
    return (
      telaSalvaInicial === 'modal_central_relatorios' ||
      telaSalvaInicial === 'modal_relatorio_vendas' ||
      telaSalvaInicial === 'modal_graficos_vendas'
    );
  });
  const [abaRelatorioInicial, setAbaRelatorioInicial] = useState<'faturamento' | 'vendas' | 'estoque' | 'delivery'>('faturamento');

  // Módulo de Delivery (Estilo Zé Delivery)
  const [modalGestaoDeliveryVisivel, setModalGestaoDeliveryVisivel] = useState<boolean>(() => {
    return telaSalvaInicial === 'modal_gestao_delivery';
  });
  const [modalCardapioClienteVisivel, setModalCardapioClienteVisivel] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (
        urlParams.get('delivery') === 'true' ||
        urlParams.get('delivery') === '1' ||
        urlParams.get('cardapio') === 'true' ||
        urlParams.get('cardapio') === '1' ||
        urlParams.get('loja') ||
        window.location.hash.includes('cardapio') ||
        window.location.hash.includes('delivery')
      ) {
        return true;
      }
    }
    return telaSalvaInicial === 'modal_cardapio_cliente';
  });

  // Coluna de Delivery integrada no Caixa (Estilo AtendeJá CaixaView)
  const [colunaDeliveryFixaVisivel, setColunaDeliveryFixaVisivel] = useState<boolean>(() => {
    return localStorage.getItem('coluna_delivery_fixa_visivel') !== 'false';
  });

  const [configDelivery, setConfigDelivery] = useState<ConfiguracaoDelivery>(() => {
    try {
      const storeId = localStorage.getItem('supermercadoAtualId') || 'loja_matriz_01';
      const salvo = localStorage.getItem(`config_delivery_${storeId}`);
      if (salvo) return JSON.parse(salvo);
    } catch {}
    return {
      ativo: true,
      raioMaximoKm: 7,
      taxaEntregaFixa: 6.90,
      tempoMinimoMinutos: 25,
      tempoMaximoMinutos: 45,
      valorMinimoPedido: 20.00,
      chavePix: 'loja.delivery@pix.com.br',
      telefoneContatoLoja: '(11) 98765-4321',
    };
  });

  const [pedidosDelivery, setPedidosDelivery] = useState<PedidoDelivery[]>(() => {
    try {
      const storeId = localStorage.getItem('supermercadoAtualId') || 'loja_matriz_01';
      const salvo = localStorage.getItem(`pedidos_delivery_${storeId}`);
      if (salvo) {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    // Seed inicial para demonstração e teste imediato
    const hoje = new Date().toISOString().slice(0, 10);
    return [
      {
        id: 'del_1001',
        numeroPedido: 1042,
        lojaId: 'loja_matriz_01',
        data: hoje,
        hora: '20:15',
        timestamp: Date.now() - 15 * 60 * 1000,
        cliente: {
          nome: 'Rafael Mendonça',
          telefone: '(11) 99123-4567',
          maior18AnosConfirmado: true,
        },
        enderecoEntrega: {
          logradouro: 'Rua das Palmeiras',
          numero: '342',
          complemento: 'Apto 101',
          bairro: 'Jardins',
          cidade: 'São Paulo',
          referencia: 'Em frente à praça',
        },
        itens: [
          { codigo: '7891000100102', nome: 'Cerveja Heineken Long Neck 330ml (Gelada)', quantidade: 6, preco_unitario: 8.50, subtotal: 51.00, gelado: true },
          { codigo: '7891000379585', nome: 'Saco de Gelo Filtrado 5kg', quantidade: 1, preco_unitario: 14.00, subtotal: 14.00, gelado: true },
        ],
        subtotal: 65.00,
        taxaEntrega: 6.90,
        valorTotal: 71.90,
        formaPagamento: 'pix',
        status: 'pendente',
        codigoEntregaPin: '4819',
      },
      {
        id: 'del_1002',
        numeroPedido: 1041,
        lojaId: 'loja_matriz_01',
        data: hoje,
        hora: '19:40',
        timestamp: Date.now() - 50 * 60 * 1000,
        cliente: {
          nome: 'Juliana Costa',
          telefone: '(11) 98877-6655',
          maior18AnosConfirmado: true,
        },
        enderecoEntrega: {
          logradouro: 'Av. Paulista',
          numero: '1500',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
        },
        itens: [
          { codigo: '7891000100102', nome: 'Vinho Tinto Chileno Cabernet 750ml', quantidade: 2, preco_unitario: 39.90, subtotal: 79.80, gelado: false },
        ],
        subtotal: 79.80,
        taxaEntrega: 6.90,
        valorTotal: 86.70,
        formaPagamento: 'cartao_credito',
        status: 'entregue',
        codigoEntregaPin: '7392',
        dataFinalizacao: hoje,
        horaFinalizacao: '20:10',
      },
    ];
  });

  // Vendas, Estornos & Gráficos Modals
  const [modalRelatorioVendasVisivel, setModalRelatorioVendasVisivel] = useState<boolean>(() => {
    return telaSalvaInicial === 'modal_relatorio_vendas';
  });
  const [modalGraficosVendasVisivel, setModalGraficosVendasVisivel] = useState<boolean>(() => {
    return telaSalvaInicial === 'modal_graficos_vendas';
  });
  const [vendaCupomVer, setVendaCupomVer] = useState<Venda | null>(null);
  const [modalEtiquetasVisivel, setModalEtiquetasVisivel] = useState<boolean>(() => {
    return telaSalvaInicial === 'modal_etiquetas';
  });

  // New Features: Gestão de Caixa, Alertas WhatsApp, Offline & PIN
  const [modalCaixaVisivel, setModalCaixaVisivel] = useState<boolean>(() => {
    return telaSalvaInicial === 'modal_caixa';
  });
  const [abaCaixaInicial, setAbaCaixaInicial] = useState<'status' | 'sangria_suprimento' | 'fechamento'>('status');
  const [motivoCaixaObrigatorio, setMotivoCaixaObrigatorio] = useState<string | null>(null);
  const [telaSempreAtiva, setTelaSempreAtiva] = useState<boolean>(true);
  const [modalAlertasWhatsAppVisivel, setModalAlertasWhatsAppVisivel] = useState<boolean>(() => {
    return telaSalvaInicial === 'modal_alertas_whatsapp';
  });
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [vendasPendentesCount, setVendasPendentesCount] = useState<number>(0);

  // Cash Turn Session & Transactions
  const [sessaoCaixaAtiva, setSessaoCaixaAtiva] = useState<SessaoCaixaTurno | null>(() => {
    try {
      const storeId = localStorage.getItem('supermercadoAtualId') || 'loja_matriz_01';
      const opId = localStorage.getItem('operadorAtivoId') || 'op_padrao';
      const salvo = localStorage.getItem(`sessao_caixa_${storeId}_${opId}`);
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });

  const [movimentacoesCaixa, setMovimentacoesCaixa] = useState<MovimentacaoCaixa[]>(() => {
    try {
      const storeId = localStorage.getItem('supermercadoAtualId') || 'loja_matriz_01';
      const salvo = localStorage.getItem(`movimentacoes_caixa_${storeId}`);
      return salvo ? JSON.parse(salvo) : [];
    } catch {
      return [];
    }
  });

  const [logsAuditoria, setLogsAuditoria] = useState<LogAuditoria[]>(() => {
    try {
      const storeId = localStorage.getItem('supermercadoAtualId') || 'loja_matriz_01';
      const salvo = localStorage.getItem(`logs_auditoria_${storeId}`);
      return salvo ? JSON.parse(salvo) : [];
    } catch {
      return [];
    }
  });

  // Stock Filtering & Sorting
  const [filtroCategoriaEstoque, setFiltroCategoriaEstoque] = useState<string>('todas');
  const [filtroStatusEstoque, setFiltroStatusEstoque] = useState<'todos' | 'vencidos' | 'vencendo30' | 'baixo'>('todos');
  const [ordenacaoEstoque, setOrdenacaoEstoque] = useState<'nome' | 'validade' | 'maior_preco' | 'menor_preco' | 'maior_qtd' | 'menor_qtd'>('nome');

  // Sales History List (Per Store)
  const [vendas, setVendas] = useState<Venda[]>(() => {
    const storeId = localStorage.getItem('supermercadoAtualId') || 'loja_matriz_01';
    const salvo = localStorage.getItem(`vendas_${storeId}`);
    if (salvo) {
      try {
        return JSON.parse(salvo);
      } catch (e) {}
    }
    // Seed initial sales data for demonstration
    const hoje = new Date();
    const hojeIso = hoje.toISOString().slice(0, 10);
    const ontem = new Date(hoje.getTime() - 24 * 60 * 60 * 1000);
    const ontemIso = ontem.toISOString().slice(0, 10);
    const ha3dias = new Date(hoje.getTime() - 3 * 24 * 60 * 60 * 1000);
    const ha3diasIso = ha3dias.toISOString().slice(0, 10);

    const vendasIniciais: Venda[] = [
      {
        id: 'ven_1001',
        lojaId: storeId,
        data: hojeIso,
        hora: '10:15',
        timestamp: hoje.getTime() - 4 * 3600 * 1000,
        operadorId: 'op_padrao_01',
        operadorNome: 'João Silva (Operador Caixa)',
        itens: [
          { codigo: '7891000100102', nome: 'Arroz Integral 1kg', quantidade: 3, preco_unitario: 8.90, subtotal: 26.70, lote: 'L001', validade: '2027-01-15' },
          { codigo: '7891000379585', nome: 'Nescau 2.0 370g', quantidade: 2, preco_unitario: 12.50, subtotal: 25.00, lote: 'L002', validade: '2026-12-10' },
        ],
        valorTotal: 51.70,
        formaPagamento: 'pix',
        status: 'concluida',
      },
      {
        id: 'ven_1002',
        lojaId: storeId,
        data: hojeIso,
        hora: '11:42',
        timestamp: hoje.getTime() - 2 * 3600 * 1000,
        operadorId: 'op_padrao_02',
        operadorNome: 'Maria Souza (Supervisora)',
        itens: [
          { codigo: '7891000100102', nome: 'Arroz Integral 1kg', quantidade: 5, preco_unitario: 8.90, subtotal: 44.50, lote: 'L001', validade: '2027-01-15' },
        ],
        valorTotal: 44.50,
        formaPagamento: 'cartao_credito',
        status: 'concluida',
      },
      {
        id: 'ven_1003',
        lojaId: storeId,
        data: ontemIso,
        hora: '16:30',
        timestamp: ontem.getTime(),
        operadorId: 'op_padrao_01',
        operadorNome: 'João Silva (Operador Caixa)',
        itens: [
          { codigo: '7891000379585', nome: 'Nescau 2.0 370g', quantidade: 4, preco_unitario: 12.50, subtotal: 50.00, lote: 'L002', validade: '2026-12-10' },
        ],
        valorTotal: 50.00,
        formaPagamento: 'cartao_debito',
        status: 'concluida',
      },
      {
        id: 'ven_1004',
        lojaId: storeId,
        data: ha3diasIso,
        hora: '14:20',
        timestamp: ha3dias.getTime(),
        operadorId: 'op_padrao_02',
        operadorNome: 'Maria Souza (Supervisora)',
        itens: [
          { codigo: '7891000100102', nome: 'Arroz Integral 1kg', quantidade: 2, preco_unitario: 8.90, subtotal: 17.80, lote: 'L001', validade: '2027-01-15' },
        ],
        valorTotal: 17.80,
        formaPagamento: 'dinheiro',
        status: 'estornada',
        dataEstorno: ha3diasIso + ' 15:00',
        operadorEstornoNome: 'Maria Souza (Supervisora)',
        motivoEstorno: 'Desistência do cliente',
      },
    ];

    safeLocalStorageSet(`vendas_${storeId}`, JSON.stringify(vendasIniciais));
    return vendasIniciais;
  });

  // Firebase Firestore Real-time Cloud Database Sync
  useEffect(() => {
    // Subscribe to Supermercados em tempo real (reflete adições e exclusões instantaneamente)
    const unsubLojas = subscribeSupermercados((lojas) => {
      if (lojas && lojas.length > 0) {
        setListaSupermercados(lojas);
        safeLocalStorageSet('lista_supermercados_app', JSON.stringify(lojas));
        const atualSalvo = localStorage.getItem('supermercadoAtualId');
        if (!atualSalvo || !lojas.some((l) => l.id === atualSalvo)) {
          setSupermercadoAtual(lojas[0].id);
          setNomeSupermercadoAtivo(lojas[0].nome);
          safeLocalStorageSet('supermercadoAtualId', lojas[0].id);
          safeLocalStorageSet('supermercadoNome', lojas[0].nome);
        } else {
          const lojaAtualObj = lojas.find((l) => l.id === atualSalvo);
          if (lojaAtualObj) {
            setNomeSupermercadoAtivo(lojaAtualObj.nome);
          }
        }
      } else {
        // Proteção contra exclusão offline: NUNCA zera o supermercado atual nem remove do storage!
        const salvo = localStorage.getItem('lista_supermercados_app');
        if (salvo) {
          try {
            const parsed = JSON.parse(salvo);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setListaSupermercados(parsed);
              const atualSalvo = localStorage.getItem('supermercadoAtualId');
              if (atualSalvo && parsed.some((l: any) => l.id === atualSalvo)) {
                setSupermercadoAtual(atualSalvo);
                const obj = parsed.find((l: any) => l.id === atualSalvo);
                if (obj) setNomeSupermercadoAtivo(obj.nome);
              } else {
                setSupermercadoAtual(parsed[0].id);
                setNomeSupermercadoAtivo(parsed[0].nome);
              }
              return;
            }
          } catch (e) {}
        }
        // Se realmente não há nenhuma loja salva, inicializa a loja padrão
        const lojaPadrao: Supermercado = {
          id: 'loja_matriz_01',
          nome: 'Supermercado Matriz',
          cnpj: '00.000.000/0001-00',
          senha: 'admin',
          senhaAdmin: 'admin',
          status: 'ativo',
          limiteCaixas: 5,
        };
        setListaSupermercados([lojaPadrao]);
        setSupermercadoAtual(lojaPadrao.id);
        setNomeSupermercadoAtivo(lojaPadrao.nome);
        safeLocalStorageSet('lista_supermercados_app', JSON.stringify([lojaPadrao]));
        safeLocalStorageSet('supermercadoAtualId', lojaPadrao.id);
        safeLocalStorageSet('supermercadoNome', lojaPadrao.nome);
      }
    });

    // Proteção de Cota do Firebase:
    // O download em massa em tempo real do Catálogo Global (8.849 itens) foi DESATIVADO.
    // O catálogo oficial já roda 100% offline da memória/localStorage (Zero custo de leitura).
    // Itens novos são consultados individualmente sob demanda via getDoc(doc(db, 'catalogo_global', barcode)).
    return () => {
      unsubLojas();
    };
  }, []);

  const handleMigrarParaNovoBanco = async () => {
    setMigrandoBanco(true);
    setMsgMigracao('Iniciando migração de todos os cadastros para o novo banco de dados appestoqueprodutos-bb92d...');
    try {
      // 1. Migração direta banco a banco (Firestore Antigo -> Novo)
      const resDireta = await migrarDiretamenteDoBancoAntigoParaNovo();

      // 2. Coletar estoque de todas as lojas cadastradas
      let estoqueCompleto = [...estoque];
      for (const loja of listaSupermercados) {
        const salvo = localStorage.getItem(`estoque_${loja.id}`);
        if (salvo) {
          try {
            const itens = JSON.parse(salvo);
            for (const item of itens) {
              if (!estoqueCompleto.some((e) => e.codigo === item.codigo && e.validade === item.validade && e.lote === item.lote && (e.lojaId || loja.id) === loja.id)) {
                estoqueCompleto.push({ ...item, lojaId: loja.id });
              }
            }
          } catch (e) {}
        }
      }

      // Coletar operadores de todas as lojas
      let operadoresCompletos = [...listaOperadores];
      for (const loja of listaSupermercados) {
        const salvo = localStorage.getItem(`operadores_caixa_${loja.id}`);
        if (salvo) {
          try {
            const ops = JSON.parse(salvo);
            for (const op of ops) {
              if (!operadoresCompletos.some((o) => o.id === op.id)) {
                operadoresCompletos.push(op);
              }
            }
          } catch (e) {}
        }
      }

      // Coletar vendas de todas as lojas
      let vendasCompletas = [...vendas];
      for (const loja of listaSupermercados) {
        const salvo = localStorage.getItem(`vendas_${loja.id}`);
        if (salvo) {
          try {
            const vends = JSON.parse(salvo);
            for (const v of vends) {
              if (!vendasCompletas.some((vn) => vn.id === v.id)) {
                vendasCompletas.push(v);
              }
            }
          } catch (e) {}
        }
      }

      // Coletar clientes devedores de todas as lojas
      let devedoresCompletos = [...clientesDevedores];
      for (const loja of listaSupermercados) {
        const salvo = localStorage.getItem(`clientes_devedores_${loja.id}`);
        if (salvo) {
          try {
            const devs = JSON.parse(salvo);
            for (const d of devs) {
              if (!devedoresCompletos.some((dn) => dn.id === d.id)) {
                devedoresCompletos.push(d);
              }
            }
          } catch (e) {}
        }
      }

      const res = await migrarTodosCadastrosParaNovoBanco({
        supermercados: listaSupermercados,
        catalogo: catalogoGlobal,
        estoque: estoqueCompleto,
        operadores: operadoresCompletos,
        vendas: vendasCompletas,
        clientesDevedores: devedoresCompletos,
      });

      localStorage.setItem('migracao_auto_banco_antigo_concluida_v1', 'true');

      if (res.sucesso || resDireta.sucesso) {
        setMsgMigracao(`✅ Migração concluída com sucesso! Registros do banco antigo e locais transferidos para appestoqueprodutos-bb92d.`);
      } else {
        setMsgMigracao(`⚠️ ${res.detalhe || resDireta.detalhe}`);
      }
    } catch (err) {
      setMsgMigracao(`❌ Falha na migração: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setMigrandoBanco(false);
    }
  };

  useEffect(() => {
    if (!supermercadoAtual) return;

    // Carregamento imediato do cache local para resposta instantânea e suporte offline perfeito
    const estSalvoImediato = localStorage.getItem(`estoque_${supermercadoAtual}`);
    if (estSalvoImediato) {
      try {
        const parsed = JSON.parse(estSalvoImediato);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEstoque(parsed.map(sanitizarItemEstoque));
        }
      } catch (e) {}
    }

    // Subscribe to Estoque for active store (com proteção para modo offline e auto-reconciliação de nomes)
    const unsubEstoque = subscribeEstoque(supermercadoAtual, (itens) => {
      setCarregandoEstoqueInicial(false);
      if (itens && itens.length > 0) {
        if (isModoCliente) {
          setEstoque(itens);
          safeLocalStorageSet(`estoque_${supermercadoAtual}`, JSON.stringify(itens));
          return;
        }
        // Reconcilia automaticamente com o catálogo de produtos master
        const catalogoSalvo = (() => {
          try {
            const raw = localStorage.getItem('catalogoGlobalFirebase');
            return raw ? JSON.parse(raw) : [];
          } catch {
            return [];
          }
        })();
        const catBase = catalogoGlobal.length > 0 ? catalogoGlobal : catalogoSalvo;
        const mapaCat = new Map<string, ProdutoCatalogo>();
        catBase.forEach((c: ProdutoCatalogo) => {
          if (c.codigo) mapaCat.set(c.codigo, c);
        });

        const itensReconciliados = itens.map((itOrig) => {
          const it = sanitizarItemEstoque(itOrig);
          const codLimpo = it.codigo ? String(it.codigo).trim() : '';
          const cat = codLimpo ? mapaCat.get(codLimpo) : undefined;
          const fotoCache = codLimpo ? (obterFotoCache(codLimpo) || '') : '';
          const fotoFinal = (it.foto && it.foto.trim()) || (cat?.imagem && cat.imagem.trim()) || fotoCache || '';

          if (!cat) {
            return {
              ...it,
              foto: fotoFinal,
            };
          }
          return {
            ...it,
            nome: (cat.nome && cat.nome.trim()) || it.nome,
            marca: (cat.marca && cat.marca.trim()) || it.marca,
            categoria: (cat.categoria && cat.categoria.trim()) || it.categoria,
            foto: fotoFinal,
          };
        });

        setEstoque(itensReconciliados);
        safeLocalStorageSet(`estoque_${supermercadoAtual}`, JSON.stringify(itensReconciliados));
      } else {
        setCarregandoEstoqueInicial(false);
        // Se a nuvem retornou vazio (modo offline), protege o estoque salvo localmente
        const salvo = localStorage.getItem(`estoque_${supermercadoAtual}`);
        if (salvo) {
          try {
            const parsed = JSON.parse(salvo);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setEstoque(parsed.map(sanitizarItemEstoque));
              return;
            }
          } catch (e) {}
        }
      }
    });

    // Se a tela estiver sendo acessada como Cardápio do Cliente (Delivery / WhatsApp),
    // NÃO carrega vendas, operadores, devedores nem auditoria. O cliente só precisa do estoque da loja!
    if (isModoCliente) {
      return () => {
        unsubEstoque();
      };
    }

    // Subscribe to Vendas for active store (Apenas para Painel do Lojista)
    const unsubVendas = subscribeVendas(supermercadoAtual, (listaVendas) => {
      if (listaVendas && listaVendas.length > 0) {
        setVendas(listaVendas);
        safeLocalStorageSet(`vendas_${supermercadoAtual}`, JSON.stringify(listaVendas));
      } else {
        const salvo = localStorage.getItem(`vendas_${supermercadoAtual}`);
        if (salvo) {
          try {
            const parsed = JSON.parse(salvo);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setVendas(parsed);
              return;
            }
          } catch (e) {}
        }
        setVendas([]);
        safeLocalStorageSet(`vendas_${supermercadoAtual}`, JSON.stringify([]));
      }
    });

    // Subscribe to Operadores for active store
    const unsubOperadores = subscribeOperadores(supermercadoAtual, (ops) => {
      if (ops && ops.length > 0) {
        setListaOperadores(ops);
        safeLocalStorageSet(`operadores_caixa_${supermercadoAtual}`, JSON.stringify(ops));
      }
    });

    // Subscribe to Clientes Devedores for active store
    const unsubDevedores = subscribeClientesDevedores(supermercadoAtual, (clientes) => {
      if (clientes && clientes.length > 0) {
        setClientesDevedores(clientes);
        safeLocalStorageSet(`clientes_devedores_${supermercadoAtual}`, JSON.stringify(clientes));
      }
    });

    // Subscribe to Logs de Auditoria for active store
    const unsubLogs = subscribeLogsAuditoria(supermercadoAtual, (logsRemotos) => {
      if (logsRemotos && logsRemotos.length > 0) {
        setLogsAuditoria(logsRemotos);
        safeLocalStorageSet(`logs_auditoria_${supermercadoAtual}`, JSON.stringify(logsRemotos));
      }
    });

    return () => {
      unsubEstoque();
      unsubVendas();
      unsubOperadores();
      unsubDevedores();
      unsubLogs();
    };
  }, [supermercadoAtual]);

  // Identificador único desta aba para evitar que BroadcastChannel sobrescreva o próprio estado recém-salvo na mesma aba
  const tabIdRef = useRef<string>(`tab_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);

  // BroadcastChannel for Real-time Cross-Tab / Cross-Device Sync
  useEffect(() => {
    let syncChannel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      syncChannel = new BroadcastChannel('estoque_sync_channel');
      syncChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'SYNC') {
          // Ignora mensagens disparadas pela própria aba (que já atualizou o estado em memória de forma otimista)
          if (event.data.senderTabId && event.data.senderTabId === tabIdRef.current) {
            return;
          }
          recarregarDadosLocais();
        }
      };
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key?.startsWith('estoque_') || e.key === 'catalogoGlobalFirebase' || e.key === 'supermercadoAtualId') {
        recarregarDadosLocais();
      }
    };

    window.addEventListener('storage', handleStorage);

    // Online/Offline Status Listener & Priority Auto Sync
    const handleOnline = async () => {
      setIsOnline(true);
      try {
        const resultado = await sincronizarFilaOfflinePrioritaria();
        const stats = obterEstatisticasFilaOffline();
        setFilaOfflineStats(stats);
        setVendasPendentesCount(stats.total);
        if (resultado.sincronizados > 0) {
          registrarLogAuditoria(
            'Sincronização Offline Prioritária',
            `Reconexão: ${resultado.sincronizados} registros críticos (estoque/vendas) sincronizados com o Firestore.`
          );
        }
      } catch (err) {
        console.warn('Erro ao sincronizar fila prioritária offline:', err);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setFilaOfflineStats(obterEstatisticasFilaOffline());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check pending offline items on mount
    const statsIniciais = obterEstatisticasFilaOffline();
    setFilaOfflineStats(statsIniciais);
    setVendasPendentesCount(statsIniciais.total);

    return () => {
      if (syncChannel) syncChannel.close();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [supermercadoAtual]);

  // Persist Current View / Screen to Prevent Navigation Reset on Reload
  useEffect(() => {
    let telaAtual = 'home';
    if (relatorioCheioVisivel) {
      telaAtual = 'relatorio_estoque';
    } else if (modalSupermercadoVisivel) {
      telaAtual = abaDonaApp === 'banco_dados' ? 'modal_banco_dados_master' : 'modal_supermercados';
    } else if (modalRelatorioVendasVisivel) {
      telaAtual = 'modal_relatorio_vendas';
    } else if (modalGraficosVendasVisivel) {
      telaAtual = 'modal_graficos_vendas';
    } else if (modalEtiquetasVisivel) {
      telaAtual = 'modal_etiquetas';
    } else if (modalCaixaVisivel) {
      telaAtual = 'modal_caixa';
    } else if (modalDevedoresVisivel) {
      telaAtual = 'modal_devedores';
    } else if (modalAlertasWhatsAppVisivel) {
      telaAtual = 'modal_alertas_whatsapp';
    } else if (modalNotificacoesVisivel) {
      telaAtual = `modal_notificacoes_${abaNotificacoesInicial}`;
    } else if (modalOperadoresVisivel) {
      telaAtual = 'modal_operadores';
    } else if (modalCadastroVisivel) {
      telaAtual = modoCadastroItem === 'master' ? 'modal_cadastro_master' : 'modal_cadastro_estoque';
    }

    safeLocalStorageSet('tela_ativa_sistema', telaAtual);
    if (buscaRelatorio && !buscaRelatorio.toLowerCase().includes('rodrigo.souza') && buscaRelatorio.toLowerCase() !== 'rodrigo') {
      safeLocalStorageSet('busca_relatorio_salva', buscaRelatorio);
    } else {
      localStorage.removeItem('busca_relatorio_salva');
    }
  }, [
    relatorioCheioVisivel,
    modoRelatorioAtual,
    buscaRelatorio,
    modalSupermercadoVisivel,
    abaDonaApp,
    modalRelatorioVendasVisivel,
    modalGraficosVendasVisivel,
    modalEtiquetasVisivel,
    modalCaixaVisivel,
    modalDevedoresVisivel,
    modalAlertasWhatsAppVisivel,
    modalNotificacoesVisivel,
    abaNotificacoesInicial,
    modalOperadoresVisivel,
    modalCadastroVisivel,
    modoCadastroItem,
  ]);

  // Sanitização estrita contra autofill indevido do navegador em campos de busca
  useEffect(() => {
    if (buscaMasterBd && (buscaMasterBd.toLowerCase().includes('rodrigo.souza') || buscaMasterBd.toLowerCase() === 'rodrigo')) {
      setBuscaMasterBd('');
    }
  }, [buscaMasterBd]);

  useEffect(() => {
    if (busca && (busca.toLowerCase().includes('rodrigo.souza') || busca.toLowerCase() === 'rodrigo')) {
      setBusca('');
    }
  }, [busca]);

  useEffect(() => {
    if (buscaRelatorio && (buscaRelatorio.toLowerCase().includes('rodrigo.souza') || buscaRelatorio.toLowerCase() === 'rodrigo')) {
      setBuscaRelatorio('');
      try {
        localStorage.removeItem('busca_relatorio_salva');
      } catch {}
    }
  }, [buscaRelatorio]);

  useEffect(() => {
    if (buscaLoja && (buscaLoja.toLowerCase().includes('rodrigo.souza') || buscaLoja.toLowerCase() === 'rodrigo')) {
      setBuscaLoja('');
    }
  }, [buscaLoja]);

  useEffect(() => {
    if (modalSupermercadoVisivel && abaDonaApp === 'banco_dados') {
      if (buscaMasterBd && (buscaMasterBd.toLowerCase().includes('rodrigo.souza') || buscaMasterBd.toLowerCase() === 'rodrigo')) {
        setBuscaMasterBd('');
      }
    }
  }, [modalSupermercadoVisivel, abaDonaApp]);

  useEffect(() => {
    setPaginaMasterBd(1);
  }, [buscaMasterBd, filtroMasterOrigem]);

  useEffect(() => {
    setLimiteRelatorioCatalogo(50);
  }, [buscaRelatorio]);

  // Sync Cash Shift Session on Store or Operator Change
  useEffect(() => {
    try {
      const opId = operadorAtivoId || 'op_padrao';
      const salvo =
        localStorage.getItem(`sessao_caixa_${supermercadoAtual}_${opId}`) ||
        localStorage.getItem(`sessao_caixa_${supermercadoAtual}`);
      if (salvo) {
        setSessaoCaixaAtiva(JSON.parse(salvo));
      } else {
        setSessaoCaixaAtiva(null);
      }
    } catch {
      setSessaoCaixaAtiva(null);
    }
  }, [supermercadoAtual, operadorAtivoId]);

  // Keep Screen Awake (Tablet, Phone & Desktop Anti-Sleep Wake Lock)
  useEffect(() => {
    screenWakeLockManager.habilitar();
    const unsub = screenWakeLockManager.subscribe((ativo) => {
      setTelaSempreAtiva(ativo);
    });
    return () => {
      unsub();
    };
  }, []);

  // Monitoramento de Sessão Única por Aparelho (Desconecta automaticamente se a conta for aberta em outro dispositivo)
  useEffect(() => {
    if (!perfilAtivo) return;

    let token = sessaoTokenAtivo || localStorage.getItem('sessao_ativa_token');
    if (!token) {
      token = gerarSessaoToken();
      setSessaoTokenAtivo(token);
      localStorage.setItem('sessao_ativa_token', token);
    }

    const sessaoAtual: Partial<SessaoUsuario> = {
      tipo: perfilAtivo,
      lojaId: supermercadoAtual,
      operadorId: operadorAtivoId || undefined,
    };
    const userKey = obterUserKey(sessaoAtual);

    const unsub = monitorarSessaoUnicaDispositivo(userKey, token, (motivo) => {
      console.warn('Alerta de concorrência de sessão recebido:', motivo);
      setAvisoDesconectadoMultiAparelho(motivo);
      setPerfilAtivo(null as any);
      setOperadorAtivoId(null);
      localStorage.removeItem('usuario_autenticado');
      localStorage.removeItem('perfilAtivoTipo');
      localStorage.removeItem('operadorAtivoId');
      localStorage.removeItem('sessao_ativa_token');
      // Fechar quaisquer modais que estejam abertos
      setModalCarrinhoVisivel(false);
      setModalCaixaVisivel(false);
      setModalManualVisivel(false);
      setModalRelatorioVendasVisivel(false);
      setModalDevedoresVisivel(false);
      setModalEtiquetasVisivel(false);
      setModalGraficosVendasVisivel(false);
      setTelaLoginVisivel(true);
    });

    return () => {
      unsub();
    };
  }, [perfilAtivo, supermercadoAtual, operadorAtivoId, sessaoTokenAtivo]);

  // Auditoria Handler
  const registrarLogAuditoria = (acao: string, detalhes: string) => {
    const opAtivo = listaOperadores.find((op) => op.id === operadorAtivoId);
    const novoLog: LogAuditoria = {
      id: 'log_' + Date.now(),
      lojaId: supermercadoAtual,
      operadorId: operadorAtivoId || 'admin',
      operadorNome: opAtivo ? opAtivo.nome : 'Administrador',
      acao,
      detalhes,
      dataHora: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'),
    };

    const novaLista = [novoLog, ...logsAuditoria];
    setLogsAuditoria(novaLista);
    safeLocalStorageSet(`logs_auditoria_${supermercadoAtual}`, JSON.stringify(novaLista));

    // Persiste no Firestore em coleção append-only imutável para auditoria e conformidade
    salvarLogAuditoriaFirestore(novoLog);
  };

  // Funções de Validação de Credenciais do Operador
  const validarCredenciaisOperador = (usuarioInput: string, senhaInput: string): { valido: boolean; operador?: OperadorCaixa; mensagem?: string } => {
    const loginLimpo = usuarioInput.trim().toLowerCase();
    const senhaLimpa = senhaInput.trim();

    if (!loginLimpo || !senhaLimpa) {
      return { valido: false, mensagem: 'Informe seu usuário/CPF e senha para autenticar.' };
    }

    // 1. Verificar na lista de operadores cadastrados
    const opEncontrado = listaOperadores.find(
      (o) =>
        (o.cpfOuUsuario.toLowerCase() === loginLimpo || o.nome.toLowerCase().includes(loginLimpo) || o.id.toLowerCase() === loginLimpo) &&
        o.pinSenha === senhaLimpa
    );

    if (opEncontrado) {
      if (!opEncontrado.ativo) {
        return { valido: false, mensagem: 'Este operador de caixa está inativo no sistema.' };
      }
      return { valido: true, operador: opEncontrado };
    }

    // 2. Verificar credenciais administrativas master do supermercado
    const lojaAtual = listaSupermercados.find((l) => l.id === supermercadoAtual);
    const eAdminLoja = (loginLimpo === 'admin' || loginLimpo === 'supervisor' || loginLimpo === (lojaAtual?.nome.toLowerCase() || '')) &&
                       (senhaLimpa === '123' || senhaLimpa === '1234' || senhaLimpa === lojaAtual?.senhaAdmin);

    if (eAdminLoja) {
      const opAdmin: OperadorCaixa = {
        id: 'op_admin_' + Date.now(),
        lojaId: supermercadoAtual,
        nome: 'Administrador da Loja',
        cargo: 'Administrador',
        cpfOuUsuario: loginLimpo,
        pinSenha: senhaLimpa,
        permissoes: PERMISSOES_ADMIN_PADRAO,
        ativo: true,
        dataCadastro: new Date().toLocaleDateString('pt-BR'),
      };
      return { valido: true, operador: opAdmin };
    }

    return { valido: false, mensagem: 'Usuário (CPF/Login) ou Senha incorretos. Verifique os dados.' };
  };

  // Handlers para Gestão de Caixa (Abertura, Movimentação/Sangria, Fechamento)
  const handleAbrirCaixa = (valorInicial: number, usuarioInput: string, senhaInput: string): { sucesso: boolean; mensagem?: string } => {
    const validacao = validarCredenciaisOperador(usuarioInput, senhaInput);

    if (!validacao.valido || !validacao.operador) {
      return { sucesso: false, mensagem: validacao.mensagem || 'Usuário ou senha incorretos!' };
    }

    const opAtivo = validacao.operador;
    setOperadorAtivoId(opAtivo.id);
    localStorage.setItem('operadorAtivoId', opAtivo.id);

    const agora = new Date();
    const novaSessao: SessaoCaixaTurno = {
      id: 'sessao_' + Date.now(),
      lojaId: supermercadoAtual,
      operadorId: opAtivo.id,
      operadorNome: opAtivo.nome,
      dataAbertura: agora.toLocaleDateString('pt-BR'),
      horaAbertura: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      timestampAbertura: agora.getTime(),
      status: 'aberto',
      valorInicialSuprimento: valorInicial,
    };

    setSessaoCaixaAtiva(novaSessao);
    safeLocalStorageSet(`sessao_caixa_${supermercadoAtual}_${opAtivo.id}`, JSON.stringify(novaSessao));
    registrarLogAuditoria('Abertura de Caixa', `Caixa ABERTO por ${opAtivo.nome} (${opAtivo.cargo}) com troco inicial de R$ ${valorInicial.toFixed(2)}`);
    
    tocarSomSucessoVenda();
    alert(`✅ Caixa ABERTO com sucesso!\n\nOperador: ${opAtivo.nome}\nTroco Inicial: R$ ${valorInicial.toFixed(2)}`);
    return { sucesso: true };
  };

  const handleRegistrarMovimentacaoCaixa = (tipo: 'sangria' | 'suprimento', valor: number, descricao: string) => {
    if (!sessaoCaixaAtiva) return;
    const opAtivo = listaOperadores.find((op) => op.id === operadorAtivoId);
    const opNome = opAtivo ? opAtivo.nome : 'Administrador';

    const novaMov: MovimentacaoCaixa = {
      id: 'mov_' + Date.now(),
      lojaId: supermercadoAtual,
      sessaoId: sessaoCaixaAtiva.id,
      tipo,
      valor,
      descricao,
      operadorId: operadorAtivoId || 'admin',
      operadorNome: opNome,
      dataHora: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'),
    };

    const novaLista = [novaMov, ...movimentacoesCaixa];
    setMovimentacoesCaixa(novaLista);
    safeLocalStorageSet(`movimentacoes_caixa_${supermercadoAtual}`, JSON.stringify(novaLista));

    registrarLogAuditoria(
      tipo === 'sangria' ? 'Sangria de Caixa' : 'Suprimento de Caixa',
      `${tipo.toUpperCase()}: R$ ${valor.toFixed(2)} - Motivo: ${descricao}`
    );

    tocarBeepCaixa();
    alert(`✅ ${tipo === 'sangria' ? 'Sangria' : 'Suprimento'} de R$ ${valor.toFixed(2)} registrado com sucesso!`);
  };

  const handleFecharCaixa = (
    dinheiroInformado: number,
    cartaoInformado: number,
    pixInformado: number,
    obs: string,
    usuarioInput: string,
    senhaInput: string
  ): { sucesso: boolean; mensagem?: string } => {
    if (!sessaoCaixaAtiva) {
      return { sucesso: false, mensagem: 'Não há sessão de caixa aberta no momento.' };
    }

    const validacao = validarCredenciaisOperador(usuarioInput, senhaInput);
    if (!validacao.valido || !validacao.operador) {
      return { sucesso: false, mensagem: validacao.mensagem || 'Usuário ou senha incorretos para confirmar fechamento!' };
    }

    const agora = new Date();

    // Suprimentos e Sangrias deste turno
    const suprimentosSessao = movimentacoesCaixa
      .filter((m) => m.sessaoId === sessaoCaixaAtiva.id && m.tipo === 'suprimento')
      .reduce((a, b) => a + b.valor, 0);

    const sangriasSessao = movimentacoesCaixa
      .filter((m) => m.sessaoId === sessaoCaixaAtiva.id && m.tipo === 'sangria')
      .reduce((a, b) => a + b.valor, 0);

    // Filtra todas as vendas concluídas do turno deste operador nesta loja
    const vendasTurnoSessao = vendas.filter((v) => {
      if (v.status !== 'concluida') return false;
      if (v.lojaId && v.lojaId !== supermercadoAtual) return false;
      if (v.operadorId && v.operadorId !== sessaoCaixaAtiva.operadorId) return false;
      if (sessaoCaixaAtiva.timestampAbertura && v.timestamp) {
        return v.timestamp >= sessaoCaixaAtiva.timestampAbertura;
      }
      return v.data === sessaoCaixaAtiva.dataAbertura;
    });

    // Vendas por modalidade de pagamento
    const vendasDinheiroSessao = vendasTurnoSessao
      .filter((v) => v.formaPagamento === 'dinheiro')
      .reduce((a, b) => a + (b.valorTotal || 0), 0);

    const vendasPixSessao = vendasTurnoSessao
      .filter((v) => v.formaPagamento === 'pix')
      .reduce((a, b) => a + (b.valorTotal || 0), 0);

    const vendasCartaoSessao = vendasTurnoSessao
      .filter((v) => v.formaPagamento === 'cartao_credito' || v.formaPagamento === 'cartao_debito')
      .reduce((a, b) => a + (b.valorTotal || 0), 0);

    const vendasFiadoSessao = vendasTurnoSessao
      .filter((v) => v.formaPagamento === 'fiado')
      .reduce((a, b) => a + (b.valorTotal || 0), 0);

    const valorTotalVendasTurno = vendasDinheiroSessao + vendasPixSessao + vendasCartaoSessao + vendasFiadoSessao;

    // Cálculo dos valores esperados por modalidade
    // 1. Dinheiro físico esperado na gaveta = Fundo inicial + Suprimentos + Vendas em Dinheiro - Sangrias
    const dinheiroEsperado = sessaoCaixaAtiva.valorInicialSuprimento + suprimentosSessao + vendasDinheiroSessao - sangriasSessao;
    const cartaoEsperado = vendasCartaoSessao;
    const pixEsperado = vendasPixSessao;

    // Total Geral Esperado (Dinheiro na gaveta + Cartão + Pix)
    const totalEsperadoGeral = dinheiroEsperado + cartaoEsperado + pixEsperado;
    const totalInformadoGeral = (dinheiroInformado || 0) + (cartaoInformado || 0) + (pixInformado || 0);

    // Diferenças
    const diferencaDinheiro = (dinheiroInformado || 0) - dinheiroEsperado;
    const diferencaCartao = (cartaoInformado || 0) - cartaoEsperado;
    const diferencaPix = (pixInformado || 0) - pixEsperado;
    const diferencaTotalGeral = totalInformadoGeral - totalEsperadoGeral;

    const sessaoFechada: SessaoCaixaTurno = {
      ...sessaoCaixaAtiva,
      status: 'fechado',
      dataFechamento: agora.toLocaleDateString('pt-BR'),
      horaFechamento: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      timestampFechamento: agora.getTime(),
      valorDinheiroInformado: dinheiroInformado,
      valorCartaoInformado: cartaoInformado,
      valorPixInformado: pixInformado,
      valorTotalInformado: totalInformadoGeral,
      valorDinheiroEsperado: dinheiroEsperado,
      valorCartaoEsperado: cartaoEsperado,
      valorPixEsperado: pixEsperado,
      valorFiadoEsperado: vendasFiadoSessao,
      valorTotalVendasTurno: valorTotalVendasTurno,
      valorTotalEsperadoGeral: totalEsperadoGeral,
      diferencaDinheiro: diferencaDinheiro,
      diferencaCartao: diferencaCartao,
      diferencaPix: diferencaPix,
      diferencaTotalGeral: diferencaTotalGeral,
      observacoesFechamento: obs,
    };

    setSessaoCaixaAtiva(sessaoFechada);
    safeLocalStorageSet(`sessao_caixa_${supermercadoAtual}_${operadorAtivoId || 'op_padrao'}`, JSON.stringify(sessaoFechada));

    const formataDiff = (diff: number) => {
      if (Math.abs(diff) < 0.01) return 'SEM DIFERENÇA';
      return diff > 0 ? `SOBRA DE R$ ${diff.toFixed(2)}` : `FALTA DE R$ ${Math.abs(diff).toFixed(2)}`;
    };

    const statusDiffDinheiro = formataDiff(diferencaDinheiro);
    const statusDiffPix = formataDiff(diferencaPix);
    const statusDiffCartao = formataDiff(diferencaCartao);
    const statusDiffGeral = formataDiff(diferencaTotalGeral);

    registrarLogAuditoria(
      'Fechamento de Caixa',
      `Fechamento autorizado por ${validacao.operador.nome}. ` +
      `Total Esperado: R$ ${totalEsperadoGeral.toFixed(2)} (Dinheiro Gaveta: R$ ${dinheiroEsperado.toFixed(2)}, PIX: R$ ${pixEsperado.toFixed(2)}, Cartão: R$ ${cartaoEsperado.toFixed(2)}), ` +
      `Total Informado: R$ ${totalInformadoGeral.toFixed(2)} (${statusDiffGeral})`
    );

    tocarSomSucessoVenda();

    alert(
      `🔒 CAIXA FECHADO COM SUCESSO!\n` +
      `Operador Responsável: ${validacao.operador.nome}\n\n` +
      `💵 DINHEIRO NA GAVETA (Fundo R$ ${sessaoCaixaAtiva.valorInicialSuprimento.toFixed(2)} + Vendas R$ ${vendasDinheiroSessao.toFixed(2)}):\n` +
      `  • Esperado: R$ ${dinheiroEsperado.toFixed(2)}\n` +
      `  • Informado: R$ ${(dinheiroInformado || 0).toFixed(2)} (${statusDiffDinheiro})\n\n` +
      `⚡ VENDAS NO PIX:\n` +
      `  • Esperado: R$ ${pixEsperado.toFixed(2)}\n` +
      `  • Informado: R$ ${(pixInformado || 0).toFixed(2)} (${statusDiffPix})\n\n` +
      `💳 VENDAS NO CARTÃO:\n` +
      `  • Esperado: R$ ${cartaoEsperado.toFixed(2)}\n` +
      `  • Informado: R$ ${(cartaoInformado || 0).toFixed(2)} (${statusDiffCartao})\n\n` +
      `══════════════════════════════════\n` +
      `📊 BALANÇO GERAL DO TURNO (Fundo + Vendas):\n` +
      `  • Total Geral Esperado: R$ ${totalEsperadoGeral.toFixed(2)}\n` +
      `  • Total Geral Informado: R$ ${totalInformadoGeral.toFixed(2)}\n` +
      `  • Resultado Geral: ${statusDiffGeral}`
    );

    if (motivoCaixaObrigatorio) {
      setMotivoCaixaObrigatorio(null);
      setModalCaixaVisivel(false);
      setTelaLoginVisivel(true);
    }

    return { sucesso: true };
  };

  const notificarSincronizacao = () => {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const channel = new BroadcastChannel('estoque_sync_channel');
        channel.postMessage({ type: 'SYNC', storeId: supermercadoAtual, senderTabId: tabIdRef.current });
        channel.close();
      } catch (e) {
        console.log('Sync broadcast:', e);
      }
    }
  };

  const recarregarDadosLocais = () => {
    const storeId = localStorage.getItem('supermercadoAtualId') || 'loja_matriz_01';
    const storeName = localStorage.getItem('supermercadoNome') || 'Supermercado Matriz';
    setSupermercadoAtual(storeId);
    setNomeSupermercadoAtivo(storeName);

    const estSalvo = localStorage.getItem(`estoque_${storeId}`);
    if (estSalvo) {
      try {
        const parsed = JSON.parse(estSalvo);
        setEstoque(Array.isArray(parsed) ? parsed.map(sanitizarItemEstoque) : []);
      } catch {
        setEstoque([]);
      }
    } else {
      setEstoque([]);
    }

    const vendSalvo = localStorage.getItem(`vendas_${storeId}`);
    if (vendSalvo) {
      try {
        setVendas(JSON.parse(vendSalvo));
      } catch (e) {}
    }

    const catSalvo = localStorage.getItem('catalogoGlobalFirebase');
    if (catSalvo) setCatalogoGlobal(JSON.parse(catSalvo));

    const listaSalva = localStorage.getItem('lista_supermercados_app');
    if (listaSalva) {
      try {
        setListaSupermercados(JSON.parse(listaSalva));
      } catch (e) {}
    }

    const opId = localStorage.getItem('operadorAtivoId') || 'op_padrao';
    const sessSalva = localStorage.getItem(`sessao_caixa_${storeId}_${opId}`) || localStorage.getItem(`sessao_caixa_${storeId}`);
    if (sessSalva) {
      try {
        setSessaoCaixaAtiva(JSON.parse(sessSalva));
      } catch (e) {}
    }

    const movSalva = localStorage.getItem(`movimentacoes_caixa_${storeId}`);
    if (movSalva) {
      try {
        setMovimentacoesCaixa(JSON.parse(movSalva));
      } catch (e) {}
    }

    const devSalvo = localStorage.getItem(`clientes_devedores_${storeId}`);
    if (devSalvo) {
      try {
        setClientesDevedores(JSON.parse(devSalvo));
      } catch (e) {}
    }
  };

  // Helper to format date YYYY-MM-DD -> DD/MM/YYYY
  const formatarData = (d: string) => {
    if (!d) return '';
    const parts = d.split('-');
    if (parts.length !== 3) return d;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  // Menu Drawer
  const abrirMenu = () => setMenuAtivo(true);
  const fecharMenu = () => setMenuAtivo(false);

  // Supermarket Management Modal / Screen
  const abrirModalSupermercado = () => {
    fecharMenu();
    setLojaEditandoId(null);
    setRegLojaNome('');
    setRegLojaCnpj('');
    setRegLojaSenha('');
    setRegLojaLimiteCaixas(5);
    setRegLojaLimiteSupervisores(2);
    setRegLojaPermissoes(PERMISSOES_LOJA_PADRAO);
    setSenhaVisivel(false);
    setMsgRegLoja('');
    setBuscaMasterBd('');
    setModalSupermercadoVisivel(true);
  };

  const alternarVisibilidadeSenha = () => {
    setSenhaVisivel((prev) => !prev);
  };

  const alternarPermissaoLoja = (chave: keyof PermissoesLoja) => {
    setRegLojaPermissoes((prev) => ({
      ...prev,
      [chave]: !prev[chave],
    }));
  };

  const marcarTodasPermissoesLoja = (status: boolean) => {
    setRegLojaPermissoes({
      caixa: status,
      gestao_caixa: status,
      estoque: status,
      usuarios: status,
      relatorios: status,
      estorno: status,
      graficos: status,
      devedores: status,
      inteligencia_estoque: status,
      ocr_ia: status,
      etiquetas: status,
      balanca: status,
      alertas: status,
      alertas_whatsapp: status,
      baixa_estoque: status,
      exportar_dados: status,
      catalogo_global: status,
      reimprimir_cupom: status,
      manual_ajuda: status,
    });
  };

  const salvarNovoSupermercado = () => {
    const nome = regLojaNome.trim();
    const cnpj = regLojaCnpj.trim();
    const senha = regLojaSenha.trim();

    if (!nome || !cnpj || !senha) {
      setMsgRegLoja(<span style={{ color: 'var(--erro)' }}>Preencha todos os campos!</span>);
      return;
    }

    const idLoja = lojaEditandoId || 'loja_' + cnpj.replace(/\D/g, '');
    const limCaixasNum = Math.max(0, Number(regLojaLimiteCaixas) || 0);
    const limSupNum = Math.max(0, Number(regLojaLimiteSupervisores) || 0);

    const lojaExistente = listaSupermercados.find((l) => l.id === idLoja);

    const dadosLoja: Supermercado = {
      id: idLoja,
      nome,
      cnpj,
      senha,
      permissoesLoja: regLojaPermissoes,
      limiteCaixas: limCaixasNum,
      limiteSupervisores: limSupNum,
      status: lojaExistente?.status || 'ativo',
      motivoBloqueio: lojaExistente?.motivoBloqueio || '',
      dataCadastro: lojaExistente?.dataCadastro || new Date().toLocaleDateString('pt-BR'),
    };

    let novaLista = [...listaSupermercados];
    const index = novaLista.findIndex((l) => l.id === idLoja);
    if (index !== -1) {
      novaLista[index] = { 
        ...novaLista[index], 
        nome, 
        cnpj, 
        senha, 
        permissoesLoja: regLojaPermissoes,
        limiteCaixas: limCaixasNum,
        limiteSupervisores: limSupNum,
      };
    } else {
      novaLista.push(dadosLoja);
    }

    setListaSupermercados(novaLista);
    localStorage.setItem('lista_supermercados_app', JSON.stringify(novaLista));
    localStorage.setItem(`config_supermercado_${idLoja}`, JSON.stringify(dadosLoja));
    salvarSupermercadoFirestore(dadosLoja);

    setSupermercadoAtual(idLoja);
    setNomeSupermercadoAtivo(nome);

    localStorage.setItem('supermercadoAtualId', idLoja);
    localStorage.setItem('supermercadoNome', nome);

    const estSalvo = localStorage.getItem(`estoque_${idLoja}`);
    if (estSalvo) {
      try {
        const parsed = JSON.parse(estSalvo);
        setEstoque(Array.isArray(parsed) ? parsed.map(sanitizarItemEstoque) : []);
      } catch {
        setEstoque([]);
      }
    } else {
      setEstoque([]);
    }

    setMsgRegLoja(<span style={{ color: 'var(--sucesso)' }}>✅ Supermercado salvo com suas permissões!</span>);
    notificarSincronizacao();

    setLojaEditandoId(null);
    setRegLojaNome('');
    setRegLojaCnpj('');
    setRegLojaSenha('');
    setRegLojaPermissoes(PERMISSOES_LOJA_PADRAO);

    setTimeout(() => {
      setMsgRegLoja('');
    }, 2000);
  };

  // Bloquear / Desbloquear Supermercado (Exclusivo Dono do App)
  const alternarBloqueioSupermercado = (idLoja: string) => {
    const loja = listaSupermercados.find((l) => l.id === idLoja);
    if (!loja) return;

    const novoStatus: 'ativo' | 'bloqueado' = loja.status === 'bloqueado' ? 'ativo' : 'bloqueado';
    const confirmMsg =
      novoStatus === 'bloqueado'
        ? `[Dona do App] Deseja realmente BLOQUEAR o supermercado "${loja.nome}"?\n\nOs administradores e funcionários desta loja não conseguirão mais acessar ou operar o sistema.`
        : `[Dona do App] Deseja DESBLOQUEAR o supermercado "${loja.nome}"?\n\nO acesso para toda a equipe da loja será restabelecido imediatamente.`;

    if (confirm(confirmMsg)) {
      let motivo = loja.motivoBloqueio || '';
      if (novoStatus === 'bloqueado') {
        const motivoDigitado = prompt(
          'Motivo do bloqueio da loja (exibido para a equipe ao tentar entrar):',
          'Mensalidade pendente / Suspensão administrativa pelo Dono do App'
        );
        motivo = motivoDigitado ? motivoDigitado.trim() : 'Suspensão administrativa pelo Dono do App';
      }

      const novaLista = listaSupermercados.map((l) => {
        if (l.id === idLoja) {
          return {
            ...l,
            status: novoStatus,
            motivoBloqueio: novoStatus === 'bloqueado' ? motivo : '',
          };
        }
        return l;
      });

      setListaSupermercados(novaLista);
      localStorage.setItem('lista_supermercados_app', JSON.stringify(novaLista));

      const lojaAtualizada = novaLista.find((l) => l.id === idLoja);
      if (lojaAtualizada) {
        salvarSupermercadoFirestore(lojaAtualizada);
        localStorage.setItem(`config_supermercado_${idLoja}`, JSON.stringify(lojaAtualizada));
      }

      setMsgRegLoja(
        <span style={{ color: novoStatus === 'bloqueado' ? '#dc2626' : '#16a34a', fontWeight: 700 }}>
          {novoStatus === 'bloqueado'
            ? `🚫 Supermercado "${loja.nome}" BLOQUEADO com sucesso!`
            : `✅ Supermercado "${loja.nome}" DESBLOQUEADO com sucesso!`}
        </span>
      );
      setTimeout(() => setMsgRegLoja(''), 4000);
    }
  };

  const prepararEdicaoLoja = (loja: Supermercado) => {
    setLojaEditandoId(loja.id);
    setRegLojaNome(loja.nome || '');
    setRegLojaCnpj(loja.cnpj || '');
    setRegLojaSenha(loja.senha || '');
    setRegLojaLimiteCaixas(loja.limiteCaixas !== undefined && loja.limiteCaixas !== null ? loja.limiteCaixas : 5);
    setRegLojaLimiteSupervisores(loja.limiteSupervisores !== undefined && loja.limiteSupervisores !== null ? loja.limiteSupervisores : 2);
    setRegLojaPermissoes({
      ...PERMISSOES_LOJA_PADRAO,
      ...(loja.permissoesLoja || {}),
    });
    setSenhaVisivel(true);
    setMsgRegLoja(<span style={{ color: 'var(--primario)' }}>Editando: {loja.nome || ''}</span>);
  };

  const excluirSupermercado = async (idLoja: string) => {
    const lojaExcluir = listaSupermercados.find((l) => l.id === idLoja);
    if (!lojaExcluir) return;
    if (confirm(`Deseja realmente excluir o supermercado "${lojaExcluir.nome}" (${lojaExcluir.cnpj}) e todos os seus dados vinculados do banco de dados?`)) {
      const novaLista = listaSupermercados.filter((l) => l.id !== idLoja);
      setListaSupermercados(novaLista);
      localStorage.setItem('lista_supermercados_app', JSON.stringify(novaLista));

      // Limpeza de chaves locais da loja excluída
      localStorage.removeItem(`estoque_${idLoja}`);
      localStorage.removeItem(`vendas_${idLoja}`);
      localStorage.removeItem(`operadores_caixa_${idLoja}`);
      localStorage.removeItem(`clientes_devedores_${idLoja}`);
      localStorage.removeItem(`logs_auditoria_${idLoja}`);
      localStorage.removeItem(`sessao_caixa_${idLoja}`);
      localStorage.removeItem(`movimentacoes_caixa_${idLoja}`);
      localStorage.removeItem(`config_supermercado_${idLoja}`);

      // Exclusão definitiva no Firestore
      await excluirSupermercadoFirestore(idLoja);

      if (supermercadoAtual === idLoja) {
        if (novaLista.length > 0) {
          alternarLojaAtiva(novaLista[0]);
        } else {
          setSupermercadoAtual('');
          setNomeSupermercadoAtivo('');
          localStorage.removeItem('supermercadoAtualId');
          localStorage.removeItem('supermercadoNome');
        }
      }

      setMsgRegLoja(<span style={{ color: 'var(--sucesso)' }}>🗑️ Supermercado "{lojaExcluir.nome}" excluído do banco de dados!</span>);
      setTimeout(() => setMsgRegLoja(''), 3000);
    }
  };

  const limparTodasLojasDeTeste = async () => {
    if (confirm('⚠️ ATENÇÃO [Dona do App]: Deseja excluir TODAS as lojas cadastradas de teste do banco de dados para iniciar o sistema 100% limpo em produção?')) {
      for (const l of listaSupermercados) {
        localStorage.removeItem(`estoque_${l.id}`);
        localStorage.removeItem(`vendas_${l.id}`);
        localStorage.removeItem(`operadores_caixa_${l.id}`);
        localStorage.removeItem(`clientes_devedores_${l.id}`);
        localStorage.removeItem(`logs_auditoria_${l.id}`);
        localStorage.removeItem(`sessao_caixa_${l.id}`);
        localStorage.removeItem(`movimentacoes_caixa_${l.id}`);
        localStorage.removeItem(`config_supermercado_${l.id}`);
      }
      setListaSupermercados([]);
      localStorage.setItem('lista_supermercados_app', JSON.stringify([]));
      setSupermercadoAtual('');
      setNomeSupermercadoAtivo('');
      localStorage.removeItem('supermercadoAtualId');
      localStorage.removeItem('supermercadoNome');

      await limparTodasLojasDeTesteFirestore();
      setMsgRegLoja(<span style={{ color: 'var(--sucesso)' }}>🧹 Todas as lojas de teste foram removidas com sucesso! Você já pode cadastrar suas lojas reais de produção.</span>);
      setTimeout(() => setMsgRegLoja(''), 4500);
    }
  };

  const excluirProdutoCatalogoMaster = async (codigo: string) => {
    const prod = catalogoGlobal.find((c) => c.codigo === codigo);
    const nomeProd = prod ? prod.nome : codigo;
    if (confirm(`[Dona do App] Deseja excluir permanentemente o produto "${nomeProd}" (Cód: ${codigo}) do Catálogo Global e de todos os estoques da Adega/Loja?`)) {
      // 1. Remove do Catálogo Global
      const novoCat = catalogoGlobal.filter((c) => c.codigo !== codigo);
      setCatalogoGlobal(novoCat);
      safeLocalStorageSet('catalogoGlobalFirebase', JSON.stringify(novoCat));
      await excluirProdutoCatalogoFirestore(codigo);
        setTotalProdutosCadastrados((prev) => {
          const n = Math.max(0, prev - 1);
          safeLocalStorageSet('total_produtos_catalogo_banco', String(n));
          return n;
        });

      // 2. Remove também de todo o estoque da loja atual e atualiza a tela
      const novoEstoque = estoque.filter((p) => p.codigo !== codigo);
      setEstoque(novoEstoque);
      safeLocalStorageSet(`estoque_${supermercadoAtual}`, JSON.stringify(novoEstoque));
      await excluirTodosLotesProdutoEstoqueFirestore(codigo, supermercadoAtual);

      alert(`🗑️ Produto "${nomeProd}" excluído com sucesso do Catálogo e do Estoque!`);
    }
  };

  const excluirItemEstoqueMaster = async (codigo: string, validade: string, lote: string, lojaId: string) => {
    const lojaNome = listaSupermercados.find((l) => l.id === lojaId)?.nome || lojaId;
    if (confirm(`[Dona do App] Deseja excluir este item de estoque da loja "${lojaNome}"?`)) {
      if (lojaId === supermercadoAtual) {
        const novoEstoque = estoque.filter(
          (p) => !(p.codigo === codigo && p.validade === validade && p.lote === lote)
        );
        setEstoque(novoEstoque);
        safeLocalStorageSet(`estoque_${supermercadoAtual}`, JSON.stringify(novoEstoque));
      }
      await excluirItemEstoqueFirestore(codigo, validade, lote, lojaId);
      alert('🗑️ Item removido do estoque da loja!');
    }
  };

  // --- OPERATOR / CASHIER MANAGEMENT HANDLERS ---
  const abrirModalOperadores = () => {
    fecharMenu();
    setOpEditandoId(null);
    setRegOpNome('');
    setRegOpCpf('');
    setRegOpSenha('');
    setRegOpCargo('Operador de Caixa');
    setRegOpPermissoes(PERMISSOES_CAIXA_PADRAO);
    setMsgRegOp('');

    // Load operators for current active store
    const salvo = localStorage.getItem(`operadores_caixa_${supermercadoAtual}`);
    if (salvo) {
      try {
        setListaOperadores(JSON.parse(salvo));
      } catch (e) {}
    }
    setModalOperadoresVisivel(true);
  };

  const fecharModalOperadores = () => {
    setModalOperadoresVisivel(false);
  };

  const alternarPermissaoOperador = (chave: keyof PermissoesOperador) => {
    setRegOpPermissoes((prev) => ({
      ...prev,
      [chave]: !prev[chave],
    }));
  };

  const marcarTodasPermissoesOperador = (status: boolean) => {
    setRegOpPermissoes({
      vender: status,
      gestao_caixa: status,
      dar_desconto: status,
      alterar_preco: status,
      estornar_venda: status,
      reimprimir_cupom: status,
      cadastrar_produtos: status,
      excluir_produtos: status,
      baixa_estoque: status,
      catalogo_global: status,
      gerenciar_devedores: status,
      ver_relatorios: status,
      ver_graficos: status,
      inteligencia_estoque: status,
      gerenciar_equipe: status,
      imprimir_etiquetas: status,
      configurar_balanca: status,
      usar_ocr_ia: status,
      alertas_validade: status,
      alertas_whatsapp: status,
      exportar_relatorios: status,
      ver_manual_usuario: status,
    });
  };

  const aplicarPresetPermissoes = (preset: 'caixa' | 'repositor' | 'financeiro' | 'supervisor' | 'admin') => {
    if (preset === 'caixa') {
      setRegOpCargo('Operador de Caixa');
      setRegOpPermissoes({
        vender: true,
        gestao_caixa: true,
        dar_desconto: false,
        alterar_preco: false,
        estornar_venda: false,
        reimprimir_cupom: true,
        cadastrar_produtos: false,
        excluir_produtos: false,
        baixa_estoque: false,
        catalogo_global: true,
        gerenciar_devedores: true,
        ver_relatorios: false,
        ver_graficos: false,
        inteligencia_estoque: false,
        gerenciar_equipe: false,
        imprimir_etiquetas: true,
        configurar_balanca: false,
        usar_ocr_ia: true,
        alertas_validade: true,
        alertas_whatsapp: false,
        exportar_relatorios: false,
        ver_manual_usuario: true,
      });
    } else if (preset === 'repositor') {
      setRegOpCargo('Operador de Caixa');
      setRegOpPermissoes({
        vender: false,
        gestao_caixa: false,
        dar_desconto: false,
        alterar_preco: false,
        estornar_venda: false,
        reimprimir_cupom: false,
        cadastrar_produtos: true,
        excluir_produtos: false,
        baixa_estoque: true,
        catalogo_global: true,
        gerenciar_devedores: false,
        ver_relatorios: true,
        ver_graficos: false,
        inteligencia_estoque: true,
        gerenciar_equipe: false,
        imprimir_etiquetas: true,
        configurar_balanca: true,
        usar_ocr_ia: true,
        alertas_validade: true,
        alertas_whatsapp: true,
        exportar_relatorios: false,
        ver_manual_usuario: true,
      });
    } else if (preset === 'financeiro') {
      setRegOpCargo('Supervisor');
      setRegOpPermissoes({
        vender: true,
        gestao_caixa: true,
        dar_desconto: true,
        alterar_preco: false,
        estornar_venda: true,
        reimprimir_cupom: true,
        cadastrar_produtos: false,
        excluir_produtos: false,
        baixa_estoque: false,
        catalogo_global: true,
        gerenciar_devedores: true,
        ver_relatorios: true,
        ver_graficos: true,
        inteligencia_estoque: true,
        gerenciar_equipe: false,
        imprimir_etiquetas: true,
        configurar_balanca: false,
        usar_ocr_ia: true,
        alertas_validade: true,
        alertas_whatsapp: true,
        exportar_relatorios: true,
        ver_manual_usuario: true,
      });
    } else if (preset === 'supervisor') {
      setRegOpCargo('Supervisor');
      setRegOpPermissoes({
        vender: true,
        gestao_caixa: true,
        dar_desconto: true,
        alterar_preco: true,
        estornar_venda: true,
        reimprimir_cupom: true,
        cadastrar_produtos: true,
        excluir_produtos: true,
        baixa_estoque: true,
        catalogo_global: true,
        gerenciar_devedores: true,
        ver_relatorios: true,
        ver_graficos: true,
        inteligencia_estoque: true,
        gerenciar_equipe: false,
        imprimir_etiquetas: true,
        configurar_balanca: true,
        usar_ocr_ia: true,
        alertas_validade: true,
        alertas_whatsapp: true,
        exportar_relatorios: true,
        ver_manual_usuario: true,
      });
    } else {
      setRegOpCargo('Administrador');
      setRegOpPermissoes(PERMISSOES_ADMIN_PADRAO);
    }
  };

  const aplicarPermissoesPorCargo = (cargo: 'Operador de Caixa' | 'Supervisor' | 'Administrador') => {
    setRegOpCargo(cargo);
    if (cargo === 'Operador de Caixa') {
      setRegOpPermissoes(PERMISSOES_CAIXA_PADRAO);
    } else {
      setRegOpPermissoes(PERMISSOES_ADMIN_PADRAO);
    }
  };

  const salvarOperador = () => {
    const nome = regOpNome.trim();
    const cpf = regOpCpf.trim();
    const pin = regOpSenha.trim();

    if (!nome || !cpf) {
      setMsgRegOp(<span style={{ color: 'var(--erro)' }}>Preencha Nome e CPF/Usuário do operador!</span>);
      return;
    }

    const idOp = opEditandoId || 'op_' + Date.now();

    // Verificação de Limites de Cadastros configurados pela Dona do App
    const lojaAtual = listaSupermercados.find((l) => l.id === supermercadoAtual);
    const maxCaixas = lojaAtual?.limiteCaixas !== undefined ? lojaAtual.limiteCaixas : 5;
    const maxSupervisores = lojaAtual?.limiteSupervisores !== undefined ? lojaAtual.limiteSupervisores : 2;

    const caixasExistentes = listaOperadores.filter((o) => o.cargo === 'Operador de Caixa' && o.ativo && o.id !== idOp).length;
    const supervisoresExistentes = listaOperadores.filter((o) => (o.cargo === 'Supervisor' || o.cargo === 'Administrador') && o.ativo && o.id !== idOp).length;

    if (regOpCargo === 'Operador de Caixa' && maxCaixas > 0 && caixasExistentes >= maxCaixas) {
      setMsgRegOp(
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 12px', borderRadius: '8px', marginTop: '10px', fontSize: '0.88rem', fontWeight: 600 }}>
          🚫 Limite de Operadores de Caixa atingido ({caixasExistentes}/{maxCaixas})! A Dona do App definiu o limite máximo de {maxCaixas} caixa(s) para este supermercado. Entre em contato para alterar seu plano.
        </div>
      );
      return;
    }

    if ((regOpCargo === 'Supervisor' || regOpCargo === 'Administrador') && maxSupervisores > 0 && supervisoresExistentes >= maxSupervisores) {
      setMsgRegOp(
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 12px', borderRadius: '8px', marginTop: '10px', fontSize: '0.88rem', fontWeight: 600 }}>
          🚫 Limite de Supervisores atingido ({supervisoresExistentes}/{maxSupervisores})! A Dona do App definiu o limite máximo de {maxSupervisores} supervisor(es) para este supermercado. Entre em contato para alterar seu plano.
        </div>
      );
      return;
    }
    const novoOp: OperadorCaixa = {
      id: idOp,
      lojaId: supermercadoAtual,
      nome,
      cargo: regOpCargo,
      cpfOuUsuario: cpf,
      pinSenha: pin || '1234',
      permissoes: regOpPermissoes,
      ativo: true,
      dataCadastro: new Date().toLocaleDateString('pt-BR'),
    };

    let novaLista = [...listaOperadores];
    const index = novaLista.findIndex((o) => o.id === idOp);
    if (index !== -1) {
      novaLista[index] = novoOp;
    } else {
      novaLista.push(novoOp);
    }

    setListaOperadores(novaLista);
    localStorage.setItem(`operadores_caixa_${supermercadoAtual}`, JSON.stringify(novaLista));
    salvarOperadorFirestore(novoOp);

    setMsgRegOp(<span style={{ color: 'var(--sucesso)' }}>✅ Funcionário / Operador salvo com sucesso!</span>);
    setOpEditandoId(null);
    setRegOpNome('');
    setRegOpCpf('');
    setRegOpSenha('');
    setRegOpCargo('Operador de Caixa');
    setRegOpPermissoes(PERMISSOES_CAIXA_PADRAO);

    setTimeout(() => {
      setMsgRegOp('');
    }, 2000);
  };

  const prepararEdicaoOperador = (op: OperadorCaixa) => {
    setOpEditandoId(op.id);
    setRegOpNome(op.nome || '');
    setRegOpCpf(op.cpfOuUsuario || '');
    setRegOpSenha(op.pinSenha || '');
    setRegOpCargo(op.cargo || 'Operador de Caixa');
    const basePadrao = op.cargo === 'Supervisor' || op.cargo === 'Administrador' ? PERMISSOES_ADMIN_PADRAO : PERMISSOES_CAIXA_PADRAO;
    setRegOpPermissoes({
      ...basePadrao,
      ...(op.permissoes || {}),
    });
    setMsgRegOp(<span style={{ color: 'var(--primario)' }}>Editando: {op.nome || ''}</span>);
  };

  const alternarStatusOperador = (idOp: string) => {
    let opAtualizado: OperadorCaixa | null = null;
    const novaLista = listaOperadores.map((op) => {
      if (op.id === idOp) {
        opAtualizado = { ...op, ativo: !op.ativo };
        return opAtualizado;
      }
      return op;
    });
    setListaOperadores(novaLista);
    localStorage.setItem(`operadores_caixa_${supermercadoAtual}`, JSON.stringify(novaLista));
    if (opAtualizado) salvarOperadorFirestore(opAtualizado);
  };

  const excluirOperador = (idOp: string) => {
    if (confirm('Deseja excluir este operador de caixa/funcionário?')) {
      const novaLista = listaOperadores.filter((op) => op.id !== idOp);
      setListaOperadores(novaLista);
      localStorage.setItem(`operadores_caixa_${supermercadoAtual}`, JSON.stringify(novaLista));
      excluirOperadorFirestore(idOp);
    }
  };

  // Login & Session Management
  const handleLoginSucesso = async (sessao: SessaoUsuario) => {
    const novoToken = gerarSessaoToken();
    setSessaoTokenAtivo(novoToken);
    localStorage.setItem('sessao_ativa_token', novoToken);
    localStorage.setItem('usuario_autenticado', 'true');
    setAvisoDesconectadoMultiAparelho(null);

    setPerfilAtivo(sessao.tipo);
    localStorage.setItem('perfilAtivoTipo', sessao.tipo);

    if (sessao.lojaId) {
      setSupermercadoAtual(sessao.lojaId);
      setNomeSupermercadoAtivo(sessao.lojaNome || 'Supermercado');
      localStorage.setItem('supermercadoAtualId', sessao.lojaId);
      localStorage.setItem('supermercadoNome', sessao.lojaNome || 'Supermercado');

      const estSalvo = localStorage.getItem(`estoque_${sessao.lojaId}`);
      if (estSalvo) {
        try {
          const parsed = JSON.parse(estSalvo);
          setEstoque(Array.isArray(parsed) ? parsed.map(sanitizarItemEstoque) : []);
        } catch {
          setEstoque([]);
        }
      } else {
        setEstoque([]);
      }

      const opSalvo = localStorage.getItem(`operadores_caixa_${sessao.lojaId}`);
      if (opSalvo) {
        try {
          setListaOperadores(JSON.parse(opSalvo));
        } catch (e) {}
      }
    }

    if (sessao.tipo === 'caixa' && sessao.operadorId) {
      setOperadorAtivoId(sessao.operadorId);
      localStorage.setItem('operadorAtivoId', sessao.operadorId);
    } else {
      setOperadorAtivoId(null);
      localStorage.removeItem('operadorAtivoId');
    }

    // Registra sessão ativa no Firestore - Isso invalida e desloga imediatamente qualquer outro aparelho que estava nesta mesma conta
    await registrarSessaoAtivaNoFirestore(sessao, novoToken);

    setTelaLoginVisivel(false);

    // Verificar se o Termo de Uso já foi aceito na primeira vez que o login conectou neste dispositivo
    const idContaLogin =
      sessao.tipo === 'dona_app'
        ? 'dona_master'
        : sessao.tipo === 'admin_loja'
        ? `loja_${sessao.lojaId || 'padrao'}`
        : `op_${sessao.operadorId || 'caixa'}_${sessao.lojaId || 'padrao'}`;

    const userChaveTermo = `termo_aceito_${idContaLogin}`;
    const chaveTermoDispositivoLogin = `termo_unico_dispositivo_${idContaLogin}`;
    const chaveTermoDispositivoGeral = 'termo_uso_aceito_dispositivo_v1';

    const termoAceito =
      localStorage.getItem(userChaveTermo) ||
      localStorage.getItem(chaveTermoDispositivoLogin) ||
      localStorage.getItem(chaveTermoDispositivoGeral);

    if (!termoAceito) {
      localStorage.setItem('ultima_chave_termo_pendente', userChaveTermo);
      localStorage.setItem('ultima_chave_termo_disp_pendente', chaveTermoDispositivoLogin);
      setTermoApenasLeitura(false);
      setModalTermoVisivel(true);
    }
  };

  const handleLogout = async () => {
    // Se for operador de caixa e o turno ainda estiver aberto, bloquear a saída e exigir o fechamento do caixa
    if (perfilAtivo === 'caixa' && sessaoCaixaAtiva && sessaoCaixaAtiva.status === 'aberto') {
      alert(
        '⚠️ ATENÇÃO: Seu turno de Caixa ainda está ABERTO!\n\n' +
        'Para manter a segurança financeira e evitar bagunça na gaveta e no relatório, você deve FECHAR O CAIXA (conferência de valores) antes de sair ou trocar de conta.'
      );
      setAbaCaixaInicial('fechamento');
      setMotivoCaixaObrigatorio('Você solicitou sair/trocar de conta. Faça a contagem dos valores e feche seu caixa para encerrar a sessão com segurança.');
      setModalCaixaVisivel(true);
      return;
    }

    const sessaoAtual: Partial<SessaoUsuario> = {
      tipo: perfilAtivo,
      lojaId: supermercadoAtual,
      operadorId: operadorAtivoId || undefined,
    };
    const userKey = obterUserKey(sessaoAtual);
    const token = sessaoTokenAtivo || localStorage.getItem('sessao_ativa_token') || '';
    if (userKey && token) {
      encerrarSessaoAtivaNoFirestore(userKey, token);
    }

    // Limpeza total de persistência de sessão para impedir acesso indevido ao recarregar a página
    localStorage.removeItem('usuario_autenticado');
    localStorage.removeItem('perfilAtivoTipo');
    localStorage.removeItem('operadorAtivoId');
    localStorage.removeItem('sessao_ativa_token');

    setOperadorAtivoId(null);
    setSessaoTokenAtivo('');
    setMotivoCaixaObrigatorio(null);
    setTelaLoginVisivel(true);
  };

  // Active Store and Operator Resolution
  const lojaAtualObj = listaSupermercados.find((l) => l.id === supermercadoAtual);
  const isLojaBloqueadaPeloDono = lojaAtualObj?.status === 'bloqueado';
  const opAtualLogado = perfilAtivo === 'caixa' ? listaOperadores.find((o) => o.id === operadorAtivoId) : null;

  // Helper 1: Verifica se a loja possui o módulo habilitado pela Dona do App
  const temPermissaoLoja = (modulo: keyof PermissoesLoja): boolean => {
    if (perfilAtivo === 'dona_app') return true;
    if (!lojaAtualObj || lojaAtualObj.status === 'bloqueado') return false;
    const perms = lojaAtualObj.permissoesLoja || PERMISSOES_LOJA_PADRAO;
    return perms[modulo] !== false;
  };

  // Helper 2: Condição booleana rigorosa para renderizar botões e áreas na tela
  const temPermissaoOperador = (
    acao: keyof PermissoesOperador,
    moduloLoja?: keyof PermissoesLoja
  ): boolean => {
    // Dona do aplicativo tem acesso irrestrito
    if (perfilAtivo === 'dona_app') return true;

    // Se o supermercado foi bloqueado pela Dona do App, ninguém na loja acessa
    if (!lojaAtualObj || lojaAtualObj.status === 'bloqueado') return false;

    // Se a Dona do App desabilitou este módulo para o supermercado, não aparece para ninguém na loja
    if (moduloLoja) {
      const permsLoja = lojaAtualObj.permissoesLoja || PERMISSOES_LOJA_PADRAO;
      if (permsLoja[moduloLoja] === false) return false;
    }

    // Administrador do supermercado tem acesso a todos os módulos autorizados para a loja
    if (perfilAtivo === 'admin_loja') return true;

    // Funcionário / Caixa: checa se está cadastrado, ativo e se a permissão individual foi concedida
    if (perfilAtivo === 'caixa') {
      const op = listaOperadores.find((o) => o.id === operadorAtivoId);
      if (!op) {
        return !!PERMISSOES_CAIXA_PADRAO[acao];
      }
      if (op.ativo === false) return false;

      const basePadrao = op.cargo === 'Supervisor' || op.cargo === 'Administrador' ? PERMISSOES_ADMIN_PADRAO : PERMISSOES_CAIXA_PADRAO;
      const permsOp = op.permissoes || basePadrao;
      if (permsOp[acao] !== undefined) {
        return !!permsOp[acao];
      }
      return !!basePadrao[acao];
    }

    return false;
  };

  // Switch Active User / Session (Super Admin, Store Owner, Cashier)
  const trocarPerfilAtivo = (tipo: 'dona_app' | 'admin_loja' | 'caixa', opId?: string) => {
    setPerfilAtivo(tipo);
    localStorage.setItem('perfilAtivoTipo', tipo);
    if (tipo === 'caixa' && opId) {
      setOperadorAtivoId(opId);
      localStorage.setItem('operadorAtivoId', opId);
    } else {
      setOperadorAtivoId(null);
      localStorage.removeItem('operadorAtivoId');
    }
  };

  // Helper to verify permissions before triggering restricted features
  const verificarPermissaoOuAvisar = (
    tipoModuloLoja: keyof PermissoesLoja,
    acaoOperador?: keyof PermissoesOperador,
    nomeAcaoFormatado?: string
  ): boolean => {
    // 1. Super Admin (Dona do App) has full access
    if (perfilAtivo === 'dona_app') return true;

    // 2. Check Store Status (Blocked by App Owner)
    if (isLojaBloqueadaPeloDono) {
      setAvisoRestrito(
        `🛑 ACESSO SUSPENSO: O supermercado "${nomeSupermercadoAtivo}" foi bloqueado pela Dona do Aplicativo. Motivo: ${
          lojaAtualObj?.motivoBloqueio || 'Entre em contato com a administração do aplicativo.'
        }`
      );
      return false;
    }

    // 3. Check Store Permissions (configured by Dona do App)
    const permLoja = lojaAtualObj?.permissoesLoja || PERMISSOES_LOJA_PADRAO;

    if (permLoja[tipoModuloLoja] === false) {
      setAvisoRestrito(
        `🔒 Acesso Bloqueado pela Dona do Aplicativo: O módulo "${nomeAcaoFormatado || tipoModuloLoja}" está desabilitado para o supermercado "${nomeSupermercadoAtivo}".`
      );
      return false;
    }

    // 4. Store Owner / Admin has full access to enabled store modules
    if (perfilAtivo === 'admin_loja') return true;

    // 5. Cashier / Staff Operator permissions check (configured by Store Owner)
    if (perfilAtivo === 'caixa' && acaoOperador) {
      const opAtual = listaOperadores.find((o) => o.id === operadorAtivoId);
      if (opAtual && opAtual.ativo === false) {
        setAvisoRestrito('🔒 Operador inativo ou bloqueado. Peça autorização ao Administrador do Supermercado.');
        return false;
      }
      const basePadrao = (opAtual?.cargo === 'Supervisor' || opAtual?.cargo === 'Administrador') ? PERMISSOES_ADMIN_PADRAO : PERMISSOES_CAIXA_PADRAO;
      const permOp = opAtual?.permissoes || basePadrao;
      const tem = permOp[acaoOperador] !== undefined ? !!permOp[acaoOperador] : !!basePadrao[acaoOperador];
      if (!tem) {
        setAvisoRestrito(
          `🔒 Acesso Restrito: O funcionário "${opAtual?.nome || 'Operador'}" (${opAtual?.cargo || 'Caixa'}) não tem permissão para "${nomeAcaoFormatado || acaoOperador}". Solicite a liberação no cadastro de funcionários.`
        );
        return false;
      }
    }

    return true;
  };

  const alternarLojaAtiva = (loja: Supermercado) => {
    setSupermercadoAtual(loja.id);
    setNomeSupermercadoAtivo(loja.nome);
    localStorage.setItem('supermercadoAtualId', loja.id);
    localStorage.setItem('supermercadoNome', loja.nome);

    const estSalvo = localStorage.getItem(`estoque_${loja.id}`);
    if (estSalvo) {
      try {
        const parsed = JSON.parse(estSalvo);
        setEstoque(Array.isArray(parsed) ? parsed.map(sanitizarItemEstoque) : []);
      } catch {
        setEstoque([]);
      }
    } else {
      setEstoque([]);
    }
    notificarSincronizacao();
  };

  const toggleVisibilidadeSenhaLoja = (idLoja: string) => {
    setSenhasVisiveisLista((prev) => ({
      ...prev,
      [idLoja]: !prev[idLoja],
    }));
  };

  // Barcode Scanner Camera Logic
  const abrirLeitorCarrinho = () => {
    setDestinoLeitor('carrinho');
    setUltimoItemScaneadoInfo(null);
    iniciarLeitor();
  };

  const abrirLeitorGeral = () => {
    // Se o caixa estiver aberto ou estiver na tela principal/vendas, abre no modo carrinho contínuo
    if (sessaoCaixaAtiva && sessaoCaixaAtiva.status === 'aberto') {
      abrirLeitorCarrinho();
    } else {
      setDestinoLeitor('busca');
      iniciarLeitor();
    }
  };

  const abrirLeitorCadastro = () => {
    setDestinoLeitor('cadastro');
    iniciarLeitor();
  };

  const abrirLeitorLote = () => {
    setDestinoLeitor('lote');
    iniciarLeitor();
  };

  const abrirLeitorRelatorio = () => {
    setDestinoLeitor('relatorio');
    iniciarLeitor();
  };

  const toggleLanterna = async () => {
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

  // Hardware Barcode Scanner Handler (Leitor Físico USB / Bluetooth)
  const processarBipHardware = (codigoLido: string) => {
    const codLimpo = codigoLido.trim();
    if (!codLimpo) return;

    // Se o modal de cadastro estiver aberto, preenche o código e busca imediatamente
    if (modalCadastroVisivel) {
      setCadCod(codLimpo);
      buscarProdutoPeloCodigo(codLimpo);
      return;
    }

    // 1. Verificação de Balança (EAN-13 começando com '2')
    const resBalanca = processarCodigoBarraBalanca(codLimpo, estoque);
    if (resBalanca.isBalanca && resBalanca.itemEncontrado) {
      if (!sessaoCaixaAtiva || sessaoCaixaAtiva.status !== 'aberto') {
        tocarSomAlerta();
        alert('⚠️ Caixa Fechado!\n\nAbra o turno de caixa antes de bipar etiquetas de balança.');
        setModalCaixaVisivel(true);
        return;
      }
      adicionarAoCarrinho(resBalanca.itemEncontrado, resBalanca.quantidadeCalculada || 1);
      tocarBeepCaixa();
      const msg = `⚡ Leitor USB: +${resBalanca.quantidadeCalculada} un/kg ${resBalanca.itemEncontrado.nome} (R$ ${resBalanca.precoTotal?.toFixed(2)}) no carrinho!`;
      setUltimoItemBipadoToast(msg);
      setTimeout(() => setUltimoItemBipadoToast(''), 3500);
      return;
    }

    // 2. Produto no Estoque
    const achou = localizarMelhorLoteEstoque(codLimpo, estoque);
    if (achou) {
      if (!sessaoCaixaAtiva || sessaoCaixaAtiva.status !== 'aberto') {
        tocarSomAlerta();
        alert('⚠️ Caixa Fechado!\n\nAbra o turno de caixa antes de realizar vendas.');
        setModalCaixaVisivel(true);
        return;
      }
      adicionarAoCarrinho(achou, 1);
      tocarBeepCaixa();
      const msg = `⚡ Leitor USB: +1 ${achou.nome} (R$ ${Number(achou.preco_venda || 0).toFixed(2)}) no carrinho!`;
      setUltimoItemBipadoToast(msg);
      setTimeout(() => setUltimoItemBipadoToast(''), 3500);
    } else {
      tocarSomAlerta();
      const noCatalogo = catalogoGlobal.find((c) => c.codigo === codLimpo);
      const aviso = noCatalogo
        ? `⚠️ Leitor USB: "${noCatalogo.nome}" sem lote no estoque desta loja!`
        : `⚠️ Leitor USB: Código "${codLimpo}" não cadastrado no estoque!`;
      setUltimoItemBipadoToast(aviso);
      setTimeout(() => setUltimoItemBipadoToast(''), 4000);
    }
  };

  // Keyboard Wedge Listener for Barcode Scanners (USB/Bluetooth)
  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      
      const now = Date.now();
      const diff = now - lastKeyTime;
      lastKeyTime = now;

      if (e.key === 'Enter') {
        // Fast burst typical of physical barcode gun (< 80ms interval between characters)
        if (buffer.length >= 3 && diff < 85) {
          const codigoLido = buffer.trim();
          buffer = '';
          if (codigoLido) {
            if (!isInput || (target as HTMLInputElement).placeholder?.toLowerCase().includes('código') || (target as HTMLInputElement).placeholder?.toLowerCase().includes('barra')) {
              e.preventDefault();
            }
            processarBipHardware(codigoLido);
          }
        } else {
          buffer = '';
        }
        return;
      }

      if (e.key.length === 1) {
        if (diff > 120) {
          buffer = e.key; // Reset on slow typing
        } else {
          buffer += e.key; // Rapid stream from barcode reader
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [estoque, sessaoCaixaAtiva, carrinho, catalogoGlobal]);

  const processarCodigoScaneado = (codigoLido: string) => {
    const codLimpo = codigoLido.trim();
    const destino = destinoLeitorRef.current;

    // NO MODO CARRINHO CONTÍNUO NÃO FECHAMOS A CÂMERA
    if (destino === 'carrinho') {
      // 1. Verificação de Balança
      const resBalanca = processarCodigoBarraBalanca(codLimpo, estoque);
      if (resBalanca.isBalanca && resBalanca.itemEncontrado) {
        if (!sessaoCaixaAtiva || sessaoCaixaAtiva.status !== 'aberto') {
          tocarSomAlerta();
          setUltimoItemScaneadoInfo({
            nome: resBalanca.itemEncontrado.nome,
            codigo: codLimpo,
            preco: resBalanca.precoTotal || resBalanca.itemEncontrado.preco_venda,
            quantidadeNoCarrinho: 0,
            estoqueDisponivel: resBalanca.itemEncontrado.quantidade,
            status: 'erro',
            mensagem: 'Caixa Fechado! Abra o turno do caixa.',
            timestamp: Date.now(),
          });
          return;
        }

        adicionarAoCarrinho(resBalanca.itemEncontrado, resBalanca.quantidadeCalculada || 1);
        tocarBeepCaixa();
        if (navigator.vibrate) {
          try { navigator.vibrate([80, 40, 80]); } catch (e) {}
        }

        setUltimoItemScaneadoInfo({
          nome: resBalanca.itemEncontrado.nome,
          codigo: codLimpo,
          preco: resBalanca.precoTotal || resBalanca.itemEncontrado.preco_venda,
          quantidadeNoCarrinho: resBalanca.quantidadeCalculada || 1,
          estoqueDisponivel: resBalanca.itemEncontrado.quantidade,
          status: 'sucesso',
          mensagem: `⚖️ Balança: ${resBalanca.quantidadeCalculada} un/kg (R$ ${resBalanca.precoTotal?.toFixed(2)})`,
          timestamp: Date.now(),
        });
        setUltimoItemBipadoToast(`+${resBalanca.quantidadeCalculada} un/kg ${resBalanca.itemEncontrado.nome} no carrinho!`);
        return;
      }

      // 2. Produto Normal no Estoque
      const achou = localizarMelhorLoteEstoque(codLimpo, estoque);
      if (achou) {
        if (!sessaoCaixaAtiva || sessaoCaixaAtiva.status !== 'aberto') {
          tocarSomAlerta();
          setUltimoItemScaneadoInfo({
            nome: achou.nome,
            codigo: codLimpo,
            preco: achou.preco_venda,
            quantidadeNoCarrinho: 0,
            estoqueDisponivel: achou.quantidade,
            status: 'erro',
            mensagem: 'Caixa Fechado! Abra o turno do caixa.',
            timestamp: Date.now(),
          });
          return;
        }

        adicionarAoCarrinho(achou, 1);
        tocarBeepCaixa();
        if (navigator.vibrate) {
          try { navigator.vibrate([70, 30, 70]); } catch (e) {}
        }

        const qtdAtualNoCarrinho = (carrinho.find((c) => c.codigo === achou.codigo)?.quantidade || 0) + 1;
        setUltimoItemScaneadoInfo({
          nome: achou.nome,
          codigo: codLimpo,
          preco: Number(achou.preco_venda || 0),
          quantidadeNoCarrinho: qtdAtualNoCarrinho,
          estoqueDisponivel: achou.quantidade,
          status: 'sucesso',
          mensagem: `Adicionado ao Carrinho! R$ ${Number(achou.preco_venda || 0).toFixed(2)}`,
          timestamp: Date.now(),
        });
        setUltimoItemBipadoToast(`+1 ${achou.nome} (R$ ${Number(achou.preco_venda || 0).toFixed(2)}) no carrinho!`);
      } else {
        tocarSomAlerta();
        const noCatalogo = catalogoGlobal.find((c) => c.codigo === codLimpo);
        setUltimoItemScaneadoInfo({
          nome: noCatalogo ? noCatalogo.nome : `Código ${codLimpo}`,
          codigo: codLimpo,
          preco: 0,
          quantidadeNoCarrinho: 0,
          estoqueDisponivel: 0,
          status: 'erro',
          mensagem: noCatalogo ? 'Sem lote no estoque desta loja!' : 'Código não cadastrado no estoque!',
          timestamp: Date.now(),
        });
      }
      return;
    }

    // MODOS UNITÁRIOS (FECHAM A CÂMERA)
    fecharLeitor();
    tocarBeepCaixa();

    if (navigator.vibrate) {
      try {
        navigator.vibrate(120);
      } catch (e) {}
    }

    if (destino === 'busca') {
      setBusca(codLimpo);

      const resBalanca = processarCodigoBarraBalanca(codLimpo, estoque);
      if (resBalanca.isBalanca && resBalanca.itemEncontrado) {
        if (!sessaoCaixaAtiva || sessaoCaixaAtiva.status !== 'aberto') {
          alert('⚠️ O Caixa está FECHADO!\n\nPara realizar vendas e ler produtos no caixa/balança, é obrigatório abrir o turno de caixa primeiro.');
          setModalCaixaVisivel(true);
          return;
        }
        setProdAtual(resBalanca.itemEncontrado);
        setQtdBaixa(resBalanca.quantidadeCalculada || 1);
        setMsgVenda(
          <span style={{ color: 'var(--sucesso)', fontWeight: 'bold' }}>
            ⚖️ Etiqueta de Balança Lida! Peso/Qtd: {resBalanca.quantidadeCalculada} un/kg (R$ {resBalanca.precoTotal?.toFixed(2)})
          </span>
        );
        setModalVendaVisivel(true);
        return;
      }

      const achou = localizarMelhorLoteEstoque(codLimpo, estoque);
      if (achou) {
        abrirVenda(achou.codigo, achou.validade, achou.lote);
      }
    } else if (destino === 'cadastro') {
      setCadCod(codLimpo);
      buscarProdutoPeloCodigo(codLimpo);
    } else if (destino === 'lote') {
      setCadLote(codLimpo);
    } else if (destino === 'relatorio') {
      setBuscaRelatorio(codLimpo);
    }
  };

  const iniciarLeitor = async () => {
    setLeitorAtivo(true);
    setLanternaAtiva(false);
    setZoomNivel(1);

    if (frameScanIntervalRef.current) {
      clearInterval(frameScanIntervalRef.current);
      frameScanIntervalRef.current = null;
    }

    try {
      const stream = await obterStreamCameraOtimizado();
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        await prepararVideoElement(videoRef.current, stream);
      }

      let escaneou = false;
      const onDetect = (rawText: string) => {
        if (!rawText) return;
        const cod = rawText.trim();
        const destinoAtual = destinoLeitorRef.current;
        const agora = Date.now();

        if (destinoAtual === 'carrinho') {
          // Anti-duplicate protection: 1.4s cooldown on the same barcode, 650ms on a different barcode
          if (
            ultimoCodigoLidoRef.current.codigo === cod &&
            agora - ultimoCodigoLidoRef.current.timestamp < 1400
          ) {
            return;
          }
          if (agora - ultimoCodigoLidoRef.current.timestamp < 650) {
            return;
          }
          ultimoCodigoLidoRef.current = { codigo: cod, timestamp: agora };
          processarCodigoScaneado(cod);
        } else {
          if (escaneou) return;
          escaneou = true;
          processarCodigoScaneado(cod);
        }
      };

      // 1. ZXing MultiFormat Reader com TRY_HARDER e formatos 1D/2D
      if (!codeReaderRef.current) {
        codeReaderRef.current = criarLeitorZXing();
      }

      if (videoRef.current) {
        try {
          const decodePromise = codeReaderRef.current.decodeFromVideoElement(
            videoRef.current,
            (result, err) => {
              if (result) {
                const txt = result.getText();
                if (txt) onDetect(txt);
              }
            }
          );
          if (decodePromise && typeof decodePromise.catch === 'function') {
            decodePromise.catch(() => {
              // Silently handle stream closure / video end without throwing
            });
          }
        } catch (e) {
          // Ignore scanner initialization errors
        }
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
      alert('Erro ao acessar a câmera: ' + (err.message || 'Verifique as permissões de câmera no navegador'));
      fecharLeitor();
    }
  };

  const fecharLeitor = () => {
    setLeitorAtivo(false);
    setProcessandoOCR(false);
    setLanternaAtiva(false);
    setUltimoItemScaneadoInfo(null);
    if (frameScanIntervalRef.current) {
      clearInterval(frameScanIntervalRef.current);
      frameScanIntervalRef.current = null;
    }
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
      } catch (e) {}
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const capturarFotoManualEscanear = () => {
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
          processarCodigoScaneado(cod);
          return;
        }
      }
    } catch {}
    alert('Não foi possível ler o código nesta foto. Tente afastar um pouco (15-20cm), usar o zoom ou ligar a lanterna.');
  };

  const processarArquivoFotoManual = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const cod = await decodificarImagemArquivo(file);
    if (cod) {
      processarCodigoScaneado(cod);
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const b64 = ev.target?.result as string;
        if (b64) {
          processarImagemOCR(b64, true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Process image for OCR - Auto fills Product Name, Category, Lot, Expiration & Barcode
  const processarImagemOCR = async (base64Image: string, usarGemini: boolean = true) => {
    setProcessandoOCR(true);

    if (usarGemini) {
      try {
        const res = await fetch('/api/ocr-lote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image }),
        });
        const data = await res.json();
        setProcessandoOCR(false);

        if (data.error) {
          // Fallback to local if Gemini API has issue
          console.warn('Erro Gemini API, tentando local:', data.error);
          return await processarImagemOCR(base64Image, false);
        }

        const nomeEncontrado = data.nomeProduto || '';
        const catEncontrada = data.categoria || '';
        const loteEncontrado = data.lote || '';
        const validadeEncontrada = data.validade || '';
        const codBarrasEncontrado = data.codigoBarras || '';

        if (nomeEncontrado) setCadNome(nomeEncontrado);
        if (catEncontrada) {
          const catMatch = LISTA_CATEGORIAS.find(
            (c) => c.toLowerCase().includes(catEncontrada.toLowerCase()) || catEncontrada.toLowerCase().includes(c.toLowerCase())
          );
          setCadCategoria(catMatch || catEncontrada);
        }
        if (loteEncontrado) setCadLote(loteEncontrado);
        if (validadeEncontrada) setCadVal(validadeEncontrada);
        if (codBarrasEncontrado && !cadCod) setCadCod(codBarrasEncontrado);

        let msgResumo = '🤖 Leitura do Produto Concluída!\n\n';
        if (nomeEncontrado) msgResumo += `• Produto: ${nomeEncontrado}\n`;
        if (catEncontrada) msgResumo += `• Categoria: ${catEncontrada}\n`;
        if (loteEncontrado) msgResumo += `• Lote: ${loteEncontrado || 'Não identificado'}\n`;
        if (validadeEncontrada) msgResumo += `• Validade: ${formatarData(validadeEncontrada) || 'Não identificada'}\n`;
        if (codBarrasEncontrado) msgResumo += `• Cód. Barras: ${codBarrasEncontrado}\n`;

        msgResumo += `\n🔒 A foto foi analisada e os campos foram preenchidos. A imagem foi descartada imediatamente da memória!`;

        alert(msgResumo);
        fecharLeitor();
        return;
      } catch (err) {
        console.warn('Falha no Gemini, tentando local...', err);
      }
    }

    // Local Tesseract OCR fallback with Canvas Preprocessing (Grayscale + Thresholding + Scaling)
    try {
      // Create high-contrast preprocessed canvas
      const img = new Image();
      img.src = base64Image;
      await new Promise((resolve) => (img.onload = resolve));

      const scale = 2.5; // Scale up for small printed text
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;
        // Binarize / High Contrast Grayscale
        for (let i = 0; i < d.length; i += 4) {
          const avg = (d[i] + d[i + 1] + d[i + 2]) / 3;
          const v = avg > 120 ? 255 : 0;
          d[i] = v;
          d[i + 1] = v;
          d[i + 2] = v;
        }
        ctx.putImageData(imgData, 0, 0);
      }

      const processedBase64 = canvas.toDataURL('image/png');

      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('por');
      const ret = await worker.recognize(processedBase64);
      const textoLido = ret.data.text || '';
      await worker.terminate();

      setProcessandoOCR(false);

      // Regex matching for Lot and Validity
      let loteEncontrado = '';
      let validadeEncontrada = '';

      // Pattern matching for Lot
      const matchLote = textoLido.match(/(?:LOTE|LOT|L|P|DF|FAB)\s*[:.-]?\s*([A-Z0-9]{3,12})/i);
      if (matchLote && matchLote[1]) {
        loteEncontrado = matchLote[1].trim();
      }

      // Pattern matching for Validade (DD/MM/YYYY or YYYY-MM-DD or DD/MM/YY)
      const matchValData = textoLido.match(/(?:VAL|VENC|EXP|VAL\.)?\s*[:.-]?\s*(\d{2})[./\s-]?(\d{2})[./\s-]?(\d{2,4})/i);
      if (matchValData) {
        const dia = matchValData[1];
        const mes = matchValData[2];
        let ano = matchValData[3];
        if (ano.length === 2) ano = '20' + ano;

        if (parseInt(mes, 10) <= 12 && parseInt(dia, 10) <= 31) {
          validadeEncontrada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        }
      }

      if (loteEncontrado) setCadLote(loteEncontrado);
      if (validadeEncontrada) setCadVal(validadeEncontrada);

      if (!loteEncontrado && !validadeEncontrada && textoLido.trim()) {
        const palavras = textoLido.replace(/[^A-Z0-9]/gi, ' ').trim().split(/\s+/);
        if (palavras.length > 0 && palavras[0].length >= 3) {
          setCadLote(palavras[0]);
          loteEncontrado = palavras[0];
        }
      }

      alert(
        `⚡ Leitura Local Concluída!\n\n` +
          `Lote: ${loteEncontrado || 'Não identificado (pode digitar manualmente)'}\n` +
          `Validade: ${validadeEncontrada ? formatarData(validadeEncontrada) : 'Não identificada'}\n\n` +
          `🔒 Imagem descartada imediatamente!`
      );
      fecharLeitor();
    } catch (err: any) {
      setProcessandoOCR(false);
      alert('Erro ao processar imagem: ' + err.message);
    }
  };

  const capturarFotoEProcessarOCR = async (usarGemini: boolean = true) => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    await processarImagemOCR(dataUrl, usarGemini);
  };

  const processarArquivoOCR = (e: React.ChangeEvent<HTMLInputElement>, usarGemini: boolean = true) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      await processarImagemOCR(dataUrl, usarGemini);
    };
    reader.readAsDataURL(file);
  };

  // Direct client-side lookup in Open Food Facts (Works 100% on static hosts like Vercel)
  const buscarProdutoEANClientSide = async (ean: string) => {
    const cleanEan = ean.trim().replace(/\D/g, '');
    if (!cleanEan) return null;

    const urls = [
      `https://br.openfoodfacts.org/api/v2/product/${cleanEan}.json`,
      `https://world.openfoodfacts.org/api/v2/product/${cleanEan}.json`,
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && data.status === 1 && data.product) {
            const prod = data.product;
            const nome = prod.product_name_pt || prod.product_name || '';
            const marca = prod.brands || '';
            const qtd = prod.quantity || '';
            const tipo = prod.generic_name_pt || prod.generic_name || '';
            const foto = prod.image_front_url || prod.image_url || prod.image_front_small_url || prod.image_small_url || '';

            let categoria = '';
            if (prod.categories_pt) {
              const cats = prod.categories_pt.split(',').map((s: string) => s.trim()).filter(Boolean);
              categoria = cats[cats.length - 1] || cats[0] || '';
            } else if (prod.categories) {
              const cats = prod.categories.split(',').map((s: string) => s.trim()).filter(Boolean);
              categoria = cats[cats.length - 1] || cats[0] || '';
            }
            if (!categoria && prod.categories_tags && Array.isArray(prod.categories_tags)) {
              const catsStr = prod.categories_tags.join(' ').toLowerCase();
              if (catsStr.includes('beverage') || catsStr.includes('drink') || catsStr.includes('bebida') || catsStr.includes('juice') || catsStr.includes('soda')) {
                categoria = 'Bebidas Não Alcoólicas';
              } else if (catsStr.includes('dairy') || catsStr.includes('milk') || catsStr.includes('leite') || catsStr.includes('cheese') || catsStr.includes('cream')) {
                categoria = 'Laticínios & Frios';
              } else if (catsStr.includes('snack') || catsStr.includes('biscuit') || catsStr.includes('cookie') || catsStr.includes('biscoito')) {
                categoria = 'Biscoitos & Snacks';
              } else if (catsStr.includes('cleaning') || catsStr.includes('detergent') || catsStr.includes('limpeza')) {
                categoria = 'Limpeza Doméstica';
              } else {
                categoria = 'Mercearia';
              }
            }

            // Build detailed supermarket title: Tipo + Marca + Nome + Quantidade
            let partes: string[] = [];
            if (tipo && !nome.toLowerCase().includes(tipo.toLowerCase())) {
              partes.push(tipo);
            }
            if (marca && !nome.toLowerCase().includes(marca.toLowerCase())) {
              partes.push(marca);
            }
            partes.push(nome);
            if (qtd && !nome.toLowerCase().includes(qtd.toLowerCase())) {
              partes.push(qtd);
            }

            let nomeCompleto = partes.filter(Boolean).join(' ').trim();
            if (!nomeCompleto) nomeCompleto = `${marca} ${nome} ${qtd}`.trim();

            return {
              nomeProduto: nomeCompleto || nome,
              marca,
              categoria: categoria || 'Mercearia',
              fotoUrl: foto,
              fonte: 'Open Food Facts (Direto)',
            };
          }
        }
      } catch (e) {
        console.warn('Erro ao consultar Open Food Facts client-side:', e);
      }
    }

    return null;
  };


  // Query API Oficial BomJawaKit (https://produtos.bomjawakit.com.br/api/v1) + Fallbacks (ConsultaProdutos, Cosmos Bluesoft, Open Food Facts)
  const consultarEANGemini = async (codigoOpcional?: string) => {
    const codParaConsultar = (codigoOpcional || cadCod).trim();
    if (!codParaConsultar) {
      alert('Por favor, informe ou escaneie o código de barras primeiro!');
      return;
    }

    setConsultandoEAN(true);
    let data: any = null;

    // 1. Prioridade Máxima: API Oficial BomJawaKit (https://produtos.bomjawakit.com.br/api/v1) com X-API-Key
    try {
      const prodBomJawa = await consultarProdutoBomJawaKitPorCodigo(codParaConsultar);
      if (prodBomJawa && prodBomJawa.nomeProduto) {
        data = prodBomJawa;
      }
    } catch (err) {
      console.warn('Aviso ao consultar API BomJawaKit:', err);
    }

    // 2. Fallback para endpoint do servidor local (se ainda não encontrou)
    if (!data || !data.nomeProduto) {
      try {
        const res = await fetch('/api/consultar-produto-codigo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ean: codParaConsultar }),
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          data = await res.json();
        }
      } catch (err) {
        console.warn('Endpoint do servidor indisponível, usando fallback client-side...', err);
      }
    }

    // 3. Fallback direto no Open Food Facts client-side
    if (!data || !data.nomeProduto) {
      const resultClient = await buscarProdutoEANClientSide(codParaConsultar);
      if (resultClient) {
        data = resultClient;
      }
    }

    setConsultandoEAN(false);

    if (data && data.nomeProduto) {
      setCadNome(data.nomeProduto);
      if (data.marca) setCadMarca(data.marca);
      if (data.categoria) {
        setCadCategoria(data.categoria.trim());
      }
      if (data.fotoUrl) {
        setFotoTemp(data.fotoUrl);
      }

      alert(
        `✨ Dados Localizados com Sucesso!\n\n` +
          `• Produto: ${data.nomeProduto}\n` +
          (data.marca ? `• Marca: ${data.marca}\n` : '') +
          `• Categoria: ${data.categoria || 'Geral'}\n` +
          (data.ncm ? `• NCM: ${data.ncm}\n` : '') +
          (data.fotoUrl ? `• Foto Oficial: Anexada 📸\n` : '') +
          `• Fonte: ${data.fonte || 'API BomJawaKit'}\n\n` +
          `Os campos foram preenchidos automaticamente!`
      );
    } else {
      alert(
        `⚠️ Código de barras lido (${codParaConsultar}), mas o produto não foi localizado na base de dados.\n\nVocê também pode usar o botão "Buscar por Nome ou Categoria na API" abaixo ou digitar manualmente.`
      );
    }
  };

  // Obter nome do produto de forma centralizada, priorizando atualizações do Catálogo Master
  const obterNomeProduto = (codigo?: string, nomeItem?: string): string => {
    if (!codigo) return nomeItem || '';
    const codLimpo = String(codigo).trim();

    // 1. Busca no catálogo global mestre (atualizações administrativas)
    const cat = catalogoGlobal.find((c) => c.codigo === codLimpo);
    if (cat?.nome && cat.nome.trim()) {
      return cat.nome.trim();
    }

    // 2. Se o item local tiver nome válido, usa
    if (nomeItem && nomeItem.trim()) {
      return nomeItem.trim();
    }

    // 3. Fallback no cache local do catálogo
    try {
      const salvo = localStorage.getItem('catalogoGlobalFirebase');
      if (salvo) {
        const parsed: ProdutoCatalogo[] = JSON.parse(salvo);
        const achouLocal = parsed.find((p) => p.codigo === codLimpo);
        if (achouLocal?.nome && achouLocal.nome.trim()) {
          return achouLocal.nome.trim();
        }
      }
    } catch {}

    return nomeItem || 'Produto sem nome';
  };

  // Obter foto do produto de forma centralizada, ultra-resiliente e com compressão máxima de memória
  const obterFotoProduto = (codigo?: string, fotoItem?: string): string => {
    let fotoBruta = '';
    if (fotoItem && typeof fotoItem === 'string' && fotoItem.trim().length > 5) {
      fotoBruta = fotoItem.trim();
    } else if (codigo) {
      const codLimpo = String(codigo).trim();

      // 0. Cache em memória do IndexedDB (ultra-resiliente e imune a sobrescrita)
      const fotoCache = obterFotoCache(codLimpo);
      if (fotoCache && typeof fotoCache === 'string' && fotoCache.trim().length > 5) {
        fotoBruta = fotoCache.trim();
      } else {
        // 1. Busca no catálogo compartilhado em memória
        const cat = catalogoGlobal.find((c) => c.codigo === codLimpo);
        if (cat?.imagem && cat.imagem.trim().length > 5) {
          fotoBruta = cat.imagem.trim();
        } else {
          // 2. Busca em qualquer outro lote ou item com o mesmo código no estoque
          const itemEstoqueComFoto = estoque.find(
            (e) => e.codigo === codLimpo && e.foto && typeof e.foto === 'string' && e.foto.trim().length > 5
          );
          if (itemEstoqueComFoto?.foto) {
            fotoBruta = itemEstoqueComFoto.foto.trim();
          } else {
            // 3. Fallback no cache local do catálogo do navegador
            try {
              const salvo = localStorage.getItem('catalogoGlobalFirebase');
              if (salvo) {
                const parsed: ProdutoCatalogo[] = JSON.parse(salvo);
                const achouLocal = parsed.find((p) => p.codigo === codLimpo);
                if (achouLocal?.imagem && achouLocal.imagem.trim().length > 5) {
                  fotoBruta = achouLocal.imagem.trim();
                }
              }
            } catch {}
          }
        }
      }
    }

    return otimizarUrlImagem(fotoBruta);
  };

  // Product Catalog Look Up (Ordem estrita: Estoque Local -> Cache Memória -> Banco de Dados Firestore)
  const [buscandoProdutoCodigo, setBuscandoProdutoCodigo] = useState<boolean>(false);

  const buscarProdutoPeloCodigo = async (codigoInformado?: string) => {
    const codLimpo = String(codigoInformado !== undefined ? codigoInformado : cadCod).trim();
    if (!codLimpo) {
      alert('Por favor, informe ou escaneie o código de barras primeiro!');
      return;
    }

    // Se estiver editando um item existente e o código for o mesmo, preserva as edições do usuário
    if (codigoEditando && codigoEditando.codigo === codLimpo) return;

    setBuscandoProdutoCodigo(true);

    // 1. PRIMEIRO: Verifica se tem aquele produto salvo no estoque local da loja
    const itemEst = estoque.find((e) => String(e.codigo || '').trim() === codLimpo);
    if (itemEst && itemEst.nome) {
      setCadNome(itemEst.nome);
      if (itemEst.marca) setCadMarca(itemEst.marca);
      if (itemEst.categoria) setCadCategoria(itemEst.categoria);
      const fotoRef = obterFotoProduto(itemEst.codigo, itemEst.foto);
      if (fotoRef) setFotoTemp(fotoRef);
      if (itemEst.preco_venda && !cadPreco) setCadPreco(String(itemEst.preco_venda));
      if (itemEst.preco_custo && !cadCusto) setCadCusto(String(itemEst.preco_custo));
      setBuscandoProdutoCodigo(false);
      return;
    }

    // 2. SEGUNDO: Verifica no cache local de produtos em memória
    const itemCat = catalogoGlobal.find((c) => String(c.codigo || '').trim() === codLimpo);
    if (itemCat && itemCat.nome) {
      setCadNome(itemCat.nome || '');
      if (itemCat.marca) setCadMarca(itemCat.marca);
      if (itemCat.categoria) setCadCategoria(itemCat.categoria);
      if (itemCat.imagem) setFotoTemp(itemCat.imagem);
      if (itemCat.preco_venda && !cadPreco) setCadPreco(String(itemCat.preco_venda));
      if (itemCat.preco_custo && !cadCusto) setCadCusto(String(itemCat.preco_custo));
      setBuscandoProdutoCodigo(false);
      return;
    }

    // 3. TERCEIRO: Se NÃO tiver no estoque nem no cache, aí sim busca no banco de dados Firestore (apenas 1 documento)
    try {
      const prodRemoto = await buscarProdutoCatalogoFirestore(codLimpo);
      if (prodRemoto && prodRemoto.nome) {
        setCadNome(prodRemoto.nome);
        if (prodRemoto.marca) setCadMarca(prodRemoto.marca);
        if (prodRemoto.categoria) setCadCategoria(prodRemoto.categoria);
        if (prodRemoto.imagem) setFotoTemp(prodRemoto.imagem);
        if (prodRemoto.preco_venda && !cadPreco) setCadPreco(String(prodRemoto.preco_venda));
        if (prodRemoto.preco_custo && !cadCusto) setCadCusto(String(prodRemoto.preco_custo));

        // Guarda em memória para futuras pesquisas sem custo de leitura
        setCatalogoGlobal((prev) => {
          if (prev.some((p) => p.codigo === prodRemoto.codigo)) return prev;
          const novo = [...prev, prodRemoto];
          safeLocalStorageSet('catalogoGlobalFirebase', JSON.stringify(novo));
          return novo;
        });
        setBuscandoProdutoCodigo(false);
        return;
      }

      // Se nem no catálogo master existir, verifica se existe no estoque remoto de outra filial
      const itemRemotoEstoque = await buscarItemEstoquePorCodigoFirestore(codLimpo);
      if (itemRemotoEstoque && itemRemotoEstoque.nome) {
        setCadNome(itemRemotoEstoque.nome);
        if (itemRemotoEstoque.marca) setCadMarca(itemRemotoEstoque.marca);
        if (itemRemotoEstoque.categoria) setCadCategoria(itemRemotoEstoque.categoria);
        const fotoRemota = obterFotoProduto(itemRemotoEstoque.codigo, itemRemotoEstoque.foto);
        if (fotoRemota) setFotoTemp(fotoRemota);
        if (itemRemotoEstoque.preco_venda && !cadPreco) setCadPreco(String(itemRemotoEstoque.preco_venda));
        if (itemRemotoEstoque.preco_custo && !cadCusto) setCadCusto(String(itemRemotoEstoque.preco_custo));
        setBuscandoProdutoCodigo(false);
        return;
      }

      // Se não encontrou em nenhum lugar:
      alert(`ℹ️ Código "${codLimpo}" não encontrado no estoque desta loja nem no banco de dados.\n\nPreencha as informações do produto para salvá-lo.`);
    } catch (err) {
      console.warn('Erro ao consultar produto no banco de dados:', err);
    } finally {
      setBuscandoProdutoCodigo(false);
    }
  };

  // Image Upload Handling with Automatic Canvas Compression
  const carregarFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const arq = e.target.files?.[0];
    if (!arq) return;
    try {
      // Compresses to max 300px with ultra-compact WebP/JPEG (reducing 5MB raw photos down to ~15KB)
      const compressed = await comprimirImagemParaArmazenamento(arq, 300, 0.68);
      setFotoTemp(compressed);
    } catch (err) {
      console.warn('Falha na compressão de imagem, usando fallback:', err);
      const leitor = new FileReader();
      leitor.onload = (ev) => {
        const result = ev.target?.result as string;
        setFotoTemp(result);
      };
      leitor.readAsDataURL(arq);
    }
  };

  // Gerar código sequencial curto para produtos internos sem código de barras (ex: ESP-01, INT-01, ADG-01)
  const gerarCodigoInternoAutomatico = (prefixo: string = 'ESP'): string => {
    const limpoPrefixo = (prefixo || 'INT').toUpperCase().trim();
    let maxNum = 0;
    estoque.forEach((it) => {
      const cod = (it.codigo || '').toUpperCase();
      if (cod.startsWith(limpoPrefixo)) {
        const numPart = cod.replace(limpoPrefixo, '').replace(/[^0-9]/g, '');
        const n = parseInt(numPart, 10);
        if (!isNaN(n) && n > maxNum) maxNum = n;
      }
    });
    const prox = String(maxNum + 1).padStart(2, '0');
    return `${limpoPrefixo}-${prox}`;
  };

  // Add / Edit Product Modal
  const abrirCadastro = (modo: 'estoque' | 'master' = 'estoque', tipo: 'padrao' | 'interno' = 'padrao') => {
    fecharMenu();
    setModoCadastroItem(perfilAtivo === 'dona_app' ? modo : 'estoque');
    setTipoProdutoCadastro(tipo);
    setCadEstoqueIlimitado(tipo === 'interno');
    setCodigoEditando(null);
    setFotoTemp('');
    if (tipo === 'interno') {
      setCadCod(gerarCodigoInternoAutomatico('ESP'));
      setCadCategoria('🍢 Espetinhos & Churrasco');
      setCadMarca('Produção Própria / Adega');
      setCadQtd('99999');
      setCadVal('2099-12-31');
      setCadLote('PROD_INTERNA');
    } else {
      setCadCod('');
      setCadCategoria('');
      setCadMarca('');
      setCadQtd('1');
      setCadLote('');
      setCadVal('');
    }
    setCadNome('');
    setCadCusto('');
    setCadPreco('');
    setMsgCad('');
    setModalCadastroVisivel(true);
  };

  const handleSincronizarAmbev = async () => {
    try {
      const res = await sincronizarCatalogoAmbevComFirestore(catalogoGlobal);
      setCatalogoGlobal(res.catalogoFinal);
      safeLocalStorageSet('catalogoGlobalFirebase', JSON.stringify(res.catalogoFinal));
      alert(`🍺 Catálogo Ambev Sincronizado no Novo Banco!\n\n• Novos produtos gravados: ${res.totalNovos}\n• Produtos enriquecidos: ${res.totalAtualizados}\n• Total no Catálogo Geral: ${res.catalogoFinal.length} produtos.\n\nBanco Conectado: adega-delivery-pdv`);
    } catch (err: any) {
      alert(`Aviso ao atualizar catálogo: ${err?.message || err}`);
    }
  };

  const handleSincronizarMixAdega = async () => {
    try {
      const res = await sincronizarCatalogoAdegaComFirestore(catalogoGlobal);
      setCatalogoGlobal(res.catalogoFinal);
      safeLocalStorageSet('catalogoGlobalFirebase', JSON.stringify(res.catalogoFinal));
      alert(`🥃 Mix de Adega Sincronizado no Novo Banco!\n\n• Novos produtos gravados: ${res.totalNovos}\n• Produtos enriquecidos: ${res.totalAtualizados}\n• Total no Catálogo Geral: ${res.catalogoFinal.length} produtos.\n\nBanco Conectado: adega-delivery-pdv`);
    } catch (err: any) {
      alert(`Aviso ao atualizar catálogo: ${err?.message || err}`);
    }
  };

  const handleSincronizarMixZeDelivery = async () => {
    try {
      const res = await sincronizarCatalogoZeDeliveryComFirestore(catalogoGlobal);
      setCatalogoGlobal(res.catalogoFinal);
      safeLocalStorageSet('catalogoGlobalFirebase', JSON.stringify(res.catalogoFinal));
      alert(`🛵 Mix Zé Delivery Sincronizado no Novo Banco!\n\n• Novos produtos gravados: ${res.totalNovos}\n• Produtos enriquecidos: ${res.totalAtualizados}\n• Total no Catálogo Geral: ${res.catalogoFinal.length} produtos.\n\nBanco Conectado: adega-delivery-pdv`);
    } catch (err: any) {
      alert(`Aviso ao atualizar catálogo: ${err?.message || err}`);
    }
  };

  const handleSincronizarChoppBrahma = async () => {
    try {
      const res = await sincronizarCatalogoChoppBrahmaComFirestore(catalogoGlobal);
      setCatalogoGlobal(res.catalogoFinal);
      safeLocalStorageSet('catalogoGlobalFirebase', JSON.stringify(res.catalogoFinal));
      alert(`🍻 Chopp Brahma Express Sincronizado no Novo Banco!\n\n• Novos barris/equipamentos gravados: ${res.totalNovos}\n• Produtos enriquecidos com fotos compactas: ${res.totalAtualizados}\n• Total no Catálogo Geral: ${res.catalogoFinal.length} produtos.\n\nBanco Conectado: adega-delivery-pdv`);
    } catch (err: any) {
      alert(`Aviso ao atualizar catálogo: ${err?.message || err}`);
    }
  };

  const handleSincronizarRissulBebidas = async () => {
    try {
      const res = await sincronizarCatalogoRissulComFirestore(catalogoGlobal);
      setCatalogoGlobal(res.catalogoFinal);
      safeLocalStorageSet('catalogoGlobalFirebase', JSON.stringify(res.catalogoFinal));
      alert(`🥤 Bebidas Rissul Sincronizadas no Novo Banco!\n\n• Novos produtos gravados: ${res.totalNovos}\n• Produtos enriquecidos com fotos 260x260: ${res.totalAtualizados}\n• Total no Catálogo Geral: ${res.catalogoFinal.length} produtos.\n\nBanco Conectado: adega-delivery-pdv`);
    } catch (err: any) {
      alert(`Aviso ao atualizar catálogo: ${err?.message || err}`);
    }
  };

  const abrirCadastroComProdutoCatalogo = (cat: ProdutoCatalogo) => {
    fecharMenu();
    setModoCadastroItem('estoque');
    setTipoProdutoCadastro('padrao');
    setCadEstoqueIlimitado(false);
    setCodigoEditando(null);
    setCadCod(cat.codigo || '');
    setCadNome(cat.nome || '');
    setCadMarca(cat.marca || '');
    setCadCategoria(cat.categoria || '');
    setFotoTemp(cat.imagem || '');
    setCadQtd('1');
    setCadLote('LOTE01');
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    setCadVal(d.toISOString().slice(0, 10));
    setCadCusto(cat.preco_custo !== undefined && cat.preco_custo !== null ? String(cat.preco_custo) : '');
    setCadPreco(cat.preco_venda !== undefined && cat.preco_venda !== null ? String(cat.preco_venda) : '');
    setMsgCad('');
    setModalCadastroVisivel(true);
  };

  const editarProduto = (cod: string, val: string = '', lote: string = '', modoForcado?: 'master' | 'estoque') => {
    setRelatorioCheioVisivel(false);
    const p = estoque.find((item) => item.codigo === cod && item.validade === val && item.lote === lote) || estoque.find((item) => item.codigo === cod);
    const cat = catalogoGlobal.find((c) => c.codigo === cod);

    if (modoForcado === 'master' || (!p && cat)) {
      setModoCadastroItem('master');
      setTipoProdutoCadastro('padrao');
      setCadEstoqueIlimitado(false);
      setCodigoEditando({ codigo: cod, validade: val, lote });
      setCadCod(cat?.codigo || cod);
      setCadNome(cat?.nome || p?.nome || '');
      setCadMarca(cat?.marca || p?.marca || '');
      setCadCategoria(cat?.categoria || p?.categoria || '');
      setFotoTemp(cat?.imagem || p?.foto || '');
      setCadQtd(String(p?.quantidade ?? 1));
      setCadLote(p?.lote || '');
      setCadVal(p?.validade || '');
      setCadCusto(p?.preco_custo !== undefined && p?.preco_custo !== null ? String(p.preco_custo) : '');
      setCadPreco(p?.preco_venda !== undefined && p?.preco_venda !== null ? String(p.preco_venda) : '');
      setMsgCad('');
      setModalCadastroVisivel(true);
      return;
    }

    if (!p) return;

    const isInterno = p.tipoCadastro === 'interno' || p.exclusivoLoja === true;
    setModoCadastroItem('estoque');
    setTipoProdutoCadastro(isInterno ? 'interno' : 'padrao');
    setCadEstoqueIlimitado(p.estoqueIlimitado ?? isInterno);
    setCodigoEditando({ codigo: cod, validade: val, lote });
    setCadCod(p.codigo || '');
    const nomeAtual = (cat?.nome && cat.nome.trim()) || p.nome || '';
    setCadNome(nomeAtual);
    setCadMarca(cat?.marca || p.marca || '');
    setCadCategoria(cat?.categoria || p.categoria || '');
    setCadQtd(String(p.quantidade ?? 1));
    setCadLote(p.lote || '');
    setCadVal(p.validade || '');
    setCadCusto(p.preco_custo !== undefined && p.preco_custo !== null ? String(p.preco_custo) : '');
    setCadPreco(p.preco_venda !== undefined && p.preco_venda !== null ? String(p.preco_venda) : '');
    setFotoTemp(p.foto || cat?.imagem || '');
    setMsgCad('');
    setModalCadastroVisivel(true);
  };

  const excluirProduto = async (cod: string, val: string, lote: string) => {
    const item = estoque.find((p) => p.codigo === cod && p.validade === val && p.lote === lote) || estoque.find((p) => p.codigo === cod);
    const nomeItem = item?.nome || cod;
    if (confirm(`Deseja realmente excluir o produto "${nomeItem}" (Cód: ${cod}) do estoque da loja/adega atual?`)) {
      const novoEstoque = estoque.filter(
        (p) => !(p.codigo === cod && p.validade === val && p.lote === lote)
      );
      setEstoque(novoEstoque);
      safeLocalStorageSet(`estoque_${supermercadoAtual}`, JSON.stringify(novoEstoque));
      await excluirItemEstoqueFirestore(cod, val, lote, supermercadoAtual);
      notificarSincronizacao();
      setModalCadastroVisivel(false);
      setModalVendaVisivel(false);
    }
  };

  const salvarProduto = async () => {
    const codigoDigitado = cadCod.trim();
    const nomeDigitado = cadNome.trim();
    const marcaDigitada = cadMarca.trim();
    const categoriaDigitada = cadCategoria.trim();

    // MODO BANCO MASTER PURO (Catálogo Global Dono/Admin)
    if (perfilAtivo === 'dona_app' && modoCadastroItem === 'master') {
      if (!codigoDigitado || !nomeDigitado) {
        setMsgCad(<span style={{ color: 'var(--erro)' }}>Preencha o Código de Barras e o Nome do Produto!</span>);
        return;
      }

      try {
        setMsgCad(<span style={{ color: 'var(--primario)' }}>⏳ Gravando diretamente no Banco de Dados Firestore...</span>);
        let fotoFinal = fotoTemp;
        if (fotoFinal && (fotoFinal.startsWith('data:') || fotoFinal.length > 500)) {
          fotoFinal = await comprimirImagemParaArmazenamento(fotoFinal, 300, 0.68);
        }

        // Atualiza Catálogo Global
        const codDigitado = codigoDigitado.trim();
        const codOriginal = codigoEditando?.codigo ? codigoEditando.codigo.trim() : null;

        // Se estava editando e alterou o código de barras, remove o item antigo da lista
        let novoCatalogo = catalogoGlobal.filter((c) => {
          const cCod = String(c.codigo || '').trim();
          if (codOriginal && codOriginal !== codDigitado && cCod === codOriginal) {
            return false;
          }
          return true;
        });

        const indexCat = novoCatalogo.findIndex((c) => String(c.codigo || '').trim() === codDigitado);
        const dadosGlobal: ProdutoCatalogo = {
          codigo: codDigitado,
          nome: nomeDigitado,
          marca: marcaDigitada,
          categoria: categoriaDigitada || 'Geral',
          unidade_medida: 'un',
          imagem: fotoFinal,
          descricao: nomeDigitado,
        };

        if (indexCat !== -1) {
          novoCatalogo[indexCat] = dadosGlobal;
        } else {
          novoCatalogo.push(dadosGlobal);
        }
        setCatalogoGlobal(novoCatalogo);
        safeLocalStorageSet('catalogoGlobalFirebase', JSON.stringify(novoCatalogo));
        if (codDigitado && fotoFinal && fotoFinal.length > 10) {
          salvarImagemIndexedDB(codDigitado, fotoFinal).catch(() => {});
        }
        
        // Se o código de barras mudou, exclui o documento do código antigo no Firestore
        if (codOriginal && codOriginal !== codDigitado) {
          excluirProdutoCatalogoFirestore(codOriginal).catch(console.warn);
        }

        // Salva no Firestore produtos_catalogo e catalogo_global (EXCLUSIVAMENTE no Banco Master, sem criar item no estoque da loja!)
        await salvarProdutoCatalogoFirestore(dadosGlobal);

        // Se o código mudou ou o nome mudou, atualiza nos lotes existentes do estoque da loja
        setEstoque((prevEstoque) => {
          const temCorrespondente = prevEstoque.some(
            (p) => String(p.codigo || '').trim() === codDigitado || (codOriginal && String(p.codigo || '').trim() === codOriginal)
          );
          if (!temCorrespondente) return prevEstoque;

          const atualizado = prevEstoque.map((p) => {
            const pCod = String(p.codigo || '').trim();
            if (pCod === codDigitado || (codOriginal && pCod === codOriginal)) {
              return {
                ...p,
                codigo: codDigitado,
                nome: nomeDigitado,
                marca: marcaDigitada || p.marca,
                categoria: categoriaDigitada || p.categoria,
                foto: fotoFinal,
              };
            }
            return p;
          });
          safeLocalStorageSet(`estoque_${supermercadoAtual}`, JSON.stringify(atualizado));
          return atualizado;
        });

        const itensCorrespondentes = estoque.filter((p) => p.codigo?.trim() === codigoDigitado);
        if (itensCorrespondentes.length > 0) {
          const promisesSalvar: Promise<any>[] = [];
          itensCorrespondentes.forEach((p) => {
            const itemAtualizado: ItemEstoque = {
              ...p,
              nome: nomeDigitado,
              marca: marcaDigitada || p.marca,
              categoria: categoriaDigitada || p.categoria,
              foto: fotoFinal,
            };
            if (supermercadoAtual) {
              promisesSalvar.push(salvarItemEstoqueFirestore(itemAtualizado, supermercadoAtual));
            }
          });
          await Promise.all(promisesSalvar);
        }

        // Reconciliar caches locais de todos os outros supermercados/adegas
        try {
          listaSupermercados.forEach((loja) => {
            if (loja.id !== supermercadoAtual) {
              const salvoOutra = localStorage.getItem(`estoque_${loja.id}`);
              if (salvoOutra) {
                const itensOutra: ItemEstoque[] = JSON.parse(salvoOutra);
                let mudouOutra = false;
                const atualizadosOutra = itensOutra.map((it) => {
                  if (it.codigo?.trim() === codigoDigitado) {
                    mudouOutra = true;
                    return {
                      ...it,
                      nome: nomeDigitado,
                      marca: marcaDigitada || it.marca,
                      categoria: categoriaDigitada || it.categoria,
                      foto: fotoFinal,
                    };
                  }
                  return it;
                });
                if (mudouOutra) {
                  safeLocalStorageSet(`estoque_${loja.id}`, JSON.stringify(atualizadosOutra));
                }
              }
            }
          });
        } catch (e) {}

        setMsgCad(<span style={{ color: 'var(--sucesso)' }}>✅ Produto e foto atualizados com sucesso no Banco de Dados Master e propagados para todas as lojas!</span>);
        notificarSincronizacao();

        setTimeout(() => {
          setCodigoEditando(null);
          setModalCadastroVisivel(false);
        }, 700);
      } catch (err: any) {
        console.error('Erro ao salvar produto master:', err);
        setMsgCad(<span style={{ color: 'var(--erro)' }}>Erro ao salvar: {err?.message || 'Falha inesperada'}</span>);
      }
      return;
    }

    // MODO ESTOQUE DA LOJA / ADEGA
    const isInterno = tipoProdutoCadastro === 'interno';
    let codigoFinal = codigoDigitado;
    if (isInterno && !codigoFinal) {
      codigoFinal = gerarCodigoInternoAutomatico('ESP');
    }

    const qtdDigitada = isInterno && cadEstoqueIlimitado ? 99999 : (parseInt(String(cadQtd).replace(/\D/g, ''), 10) || 0);
    const loteDigitado = cadLote.trim() || (isInterno ? 'PROD_INTERNA' : `LOTE-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}`);
    const valDigitada = cadVal.trim() || (isInterno ? '2099-12-31' : '');
    const custoDigitado = typeof cadCusto === 'string' ? (parseFloat(cadCusto.replace(',', '.')) || 0) : Number(cadCusto) || 0;
    const precoDigitado = typeof cadPreco === 'string' ? parseFloat(cadPreco.replace(',', '.')) : Number(cadPreco);

    if (!codigoFinal || !nomeDigitado || qtdDigitada <= 0 || !valDigitada || isNaN(precoDigitado) || precoDigitado <= 0) {
      setMsgCad(<span style={{ color: 'var(--erro)' }}>Preencha todos os campos obrigatórios (Código, Nome, Validade e Preço de Venda)!</span>);
      return;
    }

    try {
      setMsgCad(<span style={{ color: 'var(--primario)' }}>⏳ Gravando diretamente no Banco de Dados Firestore...</span>);
      
      let fotoFinal = fotoTemp;
      if (fotoFinal && (fotoFinal.startsWith('data:') || fotoFinal.length > 500)) {
        fotoFinal = await comprimirImagemParaArmazenamento(fotoFinal, 300, 0.68);
      }

      // 1. Grava no Catálogo Global de Produtos se NÃO for produto exclusivamente interno ou se tiver código de barras padrão
      const ehCodigoComBarrasValido =
        codigoFinal &&
        !codigoFinal.startsWith('ESP') &&
        !codigoFinal.startsWith('BAL') &&
        !codigoFinal.startsWith('COK') &&
        codigoFinal.length >= 6;

      let nomeFinal = nomeDigitado;
      let marcaFinal = marcaDigitada;
      let categoriaFinal = categoriaDigitada;

      if (!isInterno || ehCodigoComBarrasValido) {
        const novoCatalogo = [...catalogoGlobal];
        const indexCat = novoCatalogo.findIndex((c) => c.codigo === codigoFinal);

        if (indexCat !== -1) {
          // PRODUTO JÁ EXISTE NO CATÁLOGO MASTER:
          // Preserva o nome oficial, marca, categoria e foto do Catálogo Global (bloqueado contra alterações por lojas)
          const catExistente = novoCatalogo[indexCat];
          nomeFinal = catExistente.nome || nomeFinal;
          marcaFinal = catExistente.marca || marcaFinal;
          categoriaFinal = catExistente.categoria || categoriaFinal;
          fotoFinal = catExistente.imagem || catExistente.foto || fotoFinal;
        } else {
          // Produto totalmente novo que ainda não existia no Catálogo Master: adiciona novo registro
          const dadosGlobal: ProdutoCatalogo = {
            codigo: codigoFinal,
            nome: nomeFinal,
            marca: marcaFinal,
            categoria: categoriaFinal || 'Geral',
            unidade_medida: 'un',
            imagem: fotoFinal,
            descricao: nomeFinal,
          };
          novoCatalogo.push(dadosGlobal);
          setCatalogoGlobal(novoCatalogo);
          safeLocalStorageSet('catalogoGlobalFirebase', JSON.stringify(novoCatalogo));
          setTotalProdutosCadastrados((prev) => {
            const n = prev + 1;
            safeLocalStorageSet('total_produtos_catalogo_banco', String(n));
            return n;
          });
          if (codigoFinal && fotoFinal && fotoFinal.length > 10) {
            salvarImagemIndexedDB(codigoFinal, fotoFinal).catch(() => {});
          }
          await salvarProdutoCatalogoFirestore(dadosGlobal);
        }
      }

        // 2. Grava no Estoque da Loja Selecionada (atualização otimista imediata sem depender de closure antiga)
        const aplicarAtualizacaoEstoque = (baseEstoque: ItemEstoque[]): ItemEstoque[] => {
          let lista = [...baseEstoque];

          const codOriginalAlvo = codigoEditando?.codigo ? String(codigoEditando.codigo).trim() : null;
          const valOriginalAlvo = codigoEditando?.validade ? String(codigoEditando.validade).trim() : '';
          const loteOriginalAlvo = codigoEditando?.lote ? String(codigoEditando.lote).trim() : '';

          if (codigoEditando && codOriginalAlvo) {
            // Remove com segurança o item que estava sendo editado para impedir duplicação
            lista = lista.filter((p) => {
              const pCod = String(p.codigo || '').trim();
              if (pCod !== codOriginalAlvo) return true; // outro produto, mantém

              const pVal = String(p.validade || '2099-12-31').trim();
              const alvoVal = valOriginalAlvo || '2099-12-31';
              const pLote = String(p.lote || '').trim();
              const alvoLote = loteOriginalAlvo;

              // Se a validade e o lote batem exatamente, remove o item antigo
              if (pVal === alvoVal && pLote === alvoLote) return false;

              // Se não havia lote/validade especificados no registro de edição, remove pelo código
              if (!valOriginalAlvo && !loteOriginalAlvo) return false;

              return true;
            });
          }

          const idx = lista.findIndex((p) => {
            const pCod = String(p.codigo || '').trim();
            const pVal = String(p.validade || '2099-12-31').trim();
            const pLote = String(p.lote || '').trim();
            return pCod === codigoFinal && pVal === (valDigitada || '2099-12-31') && pLote === loteDigitado;
          });

          const itemMontado: ItemEstoque = {
            codigo_barras: isInterno ? undefined : codigoFinal,
            codigo: codigoFinal,
            nome: nomeFinal,
            marca: marcaFinal || (isInterno ? 'Produção Própria / Adega' : ''),
            categoria: categoriaFinal || (isInterno ? '🍢 Balcão / Adega' : 'Geral'),
            quantidade:
              idx !== -1 && !codigoEditando
                ? lista[idx].quantidade + (isInterno && cadEstoqueIlimitado ? 0 : qtdDigitada)
                : qtdDigitada,
            lote: loteDigitado,
            validade: valDigitada,
            preco_custo: custoDigitado,
            preco_venda: precoDigitado,
            foto: fotoFinal,
            tipoCadastro: isInterno ? 'interno' : 'padrao',
            estoqueIlimitado: isInterno ? cadEstoqueIlimitado : false,
            exclusivoLoja: isInterno,
          };

          if (idx !== -1) {
            lista[idx] = itemMontado;
          } else {
            lista.push(itemMontado);
          }

          // Propaga nome, marca, categoria e foto para todos os lotes do mesmo código
          return lista.map((p) => {
            if (p.codigo === codigoFinal) {
              return {
                ...p,
                nome: nomeFinal,
                marca: marcaFinal || p.marca,
                categoria: categoriaFinal || p.categoria,
                foto: fotoFinal,
              };
            }
            return p;
          });
        };

        // Se estava editando e alterou chave primária (código, lote ou validade), remove o documento antigo do Firestore
        if (
          codigoEditando &&
          (String(codigoEditando.codigo || '').trim() !== codigoFinal ||
            String(codigoEditando.validade || '2099-12-31').trim() !== (valDigitada || '2099-12-31').trim() ||
            String(codigoEditando.lote || '').trim() !== (loteDigitado || '').trim())
        ) {
          excluirItemEstoqueFirestore(
            codigoEditando.codigo,
            codigoEditando.validade,
            codigoEditando.lote,
            supermercadoAtual
          ).catch(console.warn);
        }

        const indexExistenteClosure = estoque.findIndex(
          (p) => p.codigo === codigoFinal && p.validade === valDigitada && p.lote === loteDigitado
        );

        const dadosItemEstoque: ItemEstoque = {
          codigo_barras: isInterno ? undefined : codigoFinal,
          codigo: codigoFinal,
          nome: nomeFinal,
          marca: marcaFinal || (isInterno ? 'Produção Própria / Adega' : ''),
          categoria: categoriaFinal || (isInterno ? '🍢 Balcão / Adega' : 'Geral'),
          quantidade:
            indexExistenteClosure !== -1 && !codigoEditando
              ? estoque[indexExistenteClosure].quantidade + (isInterno && cadEstoqueIlimitado ? 0 : qtdDigitada)
              : qtdDigitada,
          lote: loteDigitado,
          validade: valDigitada,
          preco_custo: custoDigitado,
          preco_venda: precoDigitado,
          foto: fotoFinal,
          tipoCadastro: isInterno ? 'interno' : 'padrao',
          estoqueIlimitado: isInterno ? cadEstoqueIlimitado : false,
          exclusivoLoja: isInterno,
        };

        // Atualiza imediatamente o React State usando functional updater (garante que nenhum snapshot intermediário apague o item)
        setEstoque((prevEstoque) => {
          const atualizado = aplicarAtualizacaoEstoque(prevEstoque);
          safeLocalStorageSet(`estoque_${supermercadoAtual}`, JSON.stringify(atualizado));
          return atualizado;
        });

        // Garante que filtros de busca ou abas não escondam o produto recém-cadastrado na tela
        if (busca && busca.trim() !== '') {
          const termo = busca.toLowerCase().trim();
          if (!nomeFinal.toLowerCase().includes(termo) && !codigoFinal.toLowerCase().includes(termo)) {
            setBusca('');
          }
        }
        if (filtroTipoProduto !== 'todos') {
          const tipoSalvo = isInterno ? 'interno' : 'padrao';
          if (filtroTipoProduto !== tipoSalvo) {
            setFiltroTipoProduto('todos');
          }
        }

        // Propaga para outros lotes do mesmo código no Firestore se existirem
        estoque.forEach((p) => {
          if (p.codigo === codigoFinal && (p.validade !== valDigitada || p.lote !== loteDigitado)) {
            salvarItemEstoqueFirestore(
              {
                ...p,
                nome: nomeFinal,
                marca: marcaFinal || p.marca,
                categoria: categoriaFinal || p.categoria,
                foto: fotoFinal,
              },
              supermercadoAtual
            ).catch(console.warn);
          }
        });

        await salvarItemEstoqueFirestore(dadosItemEstoque, supermercadoAtual);

      // Reconciliar caches locais de todos os outros supermercados/adegas
      try {
        listaSupermercados.forEach((loja) => {
          if (loja.id !== supermercadoAtual) {
            const salvoOutra = localStorage.getItem(`estoque_${loja.id}`);
            if (salvoOutra) {
              const itensOutra: ItemEstoque[] = JSON.parse(salvoOutra);
              let mudouOutra = false;
              const atualizadosOutra = itensOutra.map((it) => {
                if (it.codigo?.trim() === codigoFinal) {
                  mudouOutra = true;
                  return {
                    ...it,
                    nome: nomeDigitado,
                    marca: marcaDigitada || it.marca,
                    categoria: categoriaDigitada || it.categoria,
                    foto: fotoFinal,
                  };
                }
                return it;
              });
              if (mudouOutra) {
                safeLocalStorageSet(`estoque_${loja.id}`, JSON.stringify(atualizadosOutra));
              }
            }
          }
        });
      } catch (e) {}

      setMsgCad(
        <span style={{ color: 'var(--sucesso)' }}>
          ✅ {isInterno
            ? `🍢 Produto Interno salvo com sucesso e atualizado na Área de Vendas!`
            : (codigoEditando ? 'Produto, foto e nome atualizados com sucesso no Banco de Dados Firestore!' : `Produto e foto salvos diretamente no Banco de Dados e no estoque de ${nomeSupermercadoAtivo}!`)}
        </span>
      );
      notificarSincronizacao();

      setTimeout(() => {
        setCodigoEditando(null);
        setModalCadastroVisivel(false);
      }, 700);
    } catch (err: any) {
      console.error('Erro ao salvar produto no estoque:', err);
      setMsgCad(<span style={{ color: 'var(--erro)' }}>Erro ao salvar: {err?.message || 'Falha inesperada'}</span>);
    }
  };

  // Stock Sale / Low Stock / Expiration Markdown
  const abrirVenda = (cod: string, val: string, lote: string) => {
    if (!sessaoCaixaAtiva || sessaoCaixaAtiva.status !== 'aberto') {
      alert(
        '⚠️ O Caixa está FECHADO!\n\nPara realizar vendas e baixar itens do estoque, é obrigatório abrir o turno do caixa primeiro (informando o troco inicial).'
      );
      setModalCaixaVisivel(true);
      return;
    }

    let item = estoque.find((p) => p.codigo === cod && p.validade === val && p.lote === lote);
    if (!item) {
      // If specific batch not found, prioritize an unexpired batch with positive stock
      item = estoque.find((p) => {
        const dt = new Date(p.validade + 'T00:00:00');
        return p.codigo === cod && dt.getTime() > hoje.getTime() && p.quantidade > 0;
      }) || estoque.find((p) => p.codigo === cod && p.quantidade > 0) || estoque.find((p) => p.codigo === cod);
    }
    if (!item) return;

    setProdAtual({
      ...item,
      nome: obterNomeProduto(item.codigo, item.nome),
      foto: obterFotoProduto(item.codigo, item.foto),
    });
    setQtdBaixa(1);
    setMsgVenda('');
    setModalNotificacoesVisivel(false);
    setModalVendaVisivel(true);
  };

  // Dedicated Handler for Loss Write-off (Dar Baixa por Perda / Vencimento) from Notifications
  const handleDarBaixaPerda = (
    codigo: string,
    validade: string,
    lote: string,
    qtdPerda: number,
    motivoPerda: string = 'Produto Vencido'
  ) => {
    const item = estoque.find((p) => p.codigo === codigo && p.validade === validade && p.lote === lote);
    if (!item) return;

    const qtdReal = Math.min(Math.max(1, qtdPerda), item.quantidade);
    const novaQuantidade = item.quantidade - qtdReal;
    let novoEstoque: ItemEstoque[];

    if (novaQuantidade <= 0) {
      novoEstoque = estoque.filter(
        (p) => !(p.codigo === codigo && p.validade === validade && p.lote === lote)
      );
      excluirItemEstoqueFirestore(codigo, validade, lote, supermercadoAtual).catch((err) => {
        console.warn('Aviso ao excluir item do Firestore:', err);
      });
    } else {
      novoEstoque = estoque.map((p) => {
        if (p.codigo === codigo && p.validade === validade && p.lote === lote) {
          return { ...p, quantidade: novaQuantidade };
        }
        return p;
      });
      const itemAtualizado = novoEstoque.find(
        (p) => p.codigo === codigo && p.validade === validade && p.lote === lote
      );
      if (itemAtualizado) {
        salvarItemEstoqueFirestore(itemAtualizado, supermercadoAtual).catch((err) => {
          console.warn('Aviso ao sincronizar perda no Firestore:', err);
        });
      }
    }

    setEstoque(novoEstoque);
    safeLocalStorageSet(`estoque_${supermercadoAtual}`, JSON.stringify(novoEstoque));

    const opAtivo = listaOperadores.find((op) => op.id === operadorAtivoId);
    const nomeOperador = opAtivo ? opAtivo.nome : 'Administrador do Supermercado';

    registrarLogAuditoria(
      'Baixa por Perda / Vencimento',
      `Produto: ${item.nome} (${item.codigo}) | Qtd Baixada: ${qtdReal} un | Val: ${item.validade} | Lote: ${item.lote || 'N/D'} | Motivo: ${motivoPerda} | Operador: ${nomeOperador}`
    );
    notificarSincronizacao();
  };

  // Handlers para Gestão de Clientes Devedores (Fiado)
  const handleSalvarClienteDevedor = (cliente: ClienteDevedor) => {
    let novosClientes = [...clientesDevedores];
    const index = novosClientes.findIndex((c) => c.id === cliente.id);
    if (index !== -1) {
      novosClientes[index] = cliente;
    } else {
      novosClientes.unshift(cliente);
    }
    setClientesDevedores(novosClientes);
    safeLocalStorageSet(`clientes_devedores_${supermercadoAtual}`, JSON.stringify(novosClientes));
    salvarClienteDevedorFirestore(cliente);
    notificarSincronizacao();
  };

  const handleExcluirClienteDevedor = (clienteId: string) => {
    const novosClientes = clientesDevedores.filter((c) => c.id !== clienteId);
    setClientesDevedores(novosClientes);
    safeLocalStorageSet(`clientes_devedores_${supermercadoAtual}`, JSON.stringify(novosClientes));
    excluirClienteDevedorFirestore(clienteId);
    notificarSincronizacao();
  };

  const handleRegistrarPagamentoFiado = (
    clienteId: string,
    valorPagamento: number,
    formaPagamento: 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito',
    observacao?: string
  ) => {
    const cliente = clientesDevedores.find((c) => c.id === clienteId);
    if (!cliente) return;

    const opAtivo = listaOperadores.find((op) => op.id === operadorAtivoId);
    const nomeOperador = opAtivo ? opAtivo.nome : 'Administrador do Supermercado';

    const saldoAnterior = cliente.saldoDevedorTotal;
    const novoSaldo = Math.max(0, saldoAnterior - valorPagamento);

    // Abater valor do pagamento nas compras pendentes (da mais antiga para a mais recente)
    let valorRestanteParaAbater = valorPagamento;
    const comprasOrdenadas = [...(cliente.compras || [])].sort((a, b) => a.timestamp - b.timestamp);

    const comprasAtualizadas = comprasOrdenadas.map((compra) => {
      if (compra.status === 'quitada' || valorRestanteParaAbater <= 0) {
        return compra;
      }

      const pendenteNaCompra = compra.saldoRestante;
      if (valorRestanteParaAbater >= pendenteNaCompra) {
        valorRestanteParaAbater -= pendenteNaCompra;
        return {
          ...compra,
          valorPago: compra.valorTotal,
          saldoRestante: 0,
          status: 'quitada' as const,
        };
      } else {
        const novoValorPago = compra.valorPago + valorRestanteParaAbater;
        const novoSaldoRestante = compra.valorTotal - novoValorPago;
        valorRestanteParaAbater = 0;
        return {
          ...compra,
          valorPago: novoValorPago,
          saldoRestante: novoSaldoRestante,
          status: 'parcial' as const,
        };
      }
    });

    const novoPagamentoRecord: PagamentoFiado = {
      id: 'pag_' + Date.now(),
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      valorPago: valorPagamento,
      formaPagamento,
      saldoAnterior,
      saldoRestante: novoSaldo,
      operadorNome: nomeOperador,
      observacao,
    };

    const clienteAtualizado: ClienteDevedor = {
      ...cliente,
      saldoDevedorTotal: novoSaldo,
      compras: comprasAtualizadas,
      pagamentos: [novoPagamentoRecord, ...(cliente.pagamentos || [])],
    };

    handleSalvarClienteDevedor(clienteAtualizado);

    registrarLogAuditoria(
      'Pagamento Fiado Recebido',
      `Cliente: ${cliente.nome} | Valor Recebido: R$ ${valorPagamento.toFixed(2)} (${formaPagamento.toUpperCase()}) | Novo Saldo Devedor: R$ ${novoSaldo.toFixed(2)} | Recebido por: ${nomeOperador}`
    );
  };

  const confirmarBaixa = () => {
    if (!sessaoCaixaAtiva || sessaoCaixaAtiva.status !== 'aberto') {
      setMsgVenda(
        <span style={{ color: 'var(--erro)', fontWeight: 700 }}>
          ⚠️ Caixa fechado! Abra o turno de caixa antes de concluir vendas.
        </span>
      );
      setModalCaixaVisivel(true);
      return;
    }

    const qtdNumerica = typeof qtdBaixa === 'number' ? qtdBaixa : (parseInt(qtdBaixa, 10) || 0);

    if (!prodAtual || isNaN(qtdNumerica) || qtdNumerica < 1) {
      setMsgVenda(<span style={{ color: 'var(--erro)' }}>Digite uma quantidade válida!</span>);
      return;
    }

    const itemEmEstoque = estoque.find(
      (p) => p.codigo === prodAtual.codigo && p.validade === prodAtual.validade && p.lote === prodAtual.lote
    );

    if (!itemEmEstoque || qtdNumerica > itemEmEstoque.quantidade) {
      setMsgVenda(<span style={{ color: 'var(--erro)' }}>Estoque insuficiente!</span>);
      return;
    }

    // Se a forma de pagamento for FIADO, validar seleção e limite do cliente
    let clienteFiadoEncontrado: ClienteDevedor | undefined = undefined;
    if (formaPagamento === 'fiado') {
      if (!clienteFiadoSelecionadoId) {
        setMsgVenda(<span style={{ color: 'var(--erro)' }}>Selecione um cliente fiado cadastrado para continuar!</span>);
        return;
      }
      clienteFiadoEncontrado = clientesDevedores.find((c) => c.id === clienteFiadoSelecionadoId);
      if (!clienteFiadoEncontrado) {
        setMsgVenda(<span style={{ color: 'var(--erro)' }}>Cliente selecionado não foi encontrado.</span>);
        return;
      }

      const valorTotalCompra = Number(prodAtual.preco_venda || 0) * qtdNumerica;
      if (
        clienteFiadoEncontrado.limiteFiado &&
        clienteFiadoEncontrado.limiteFiado > 0 &&
        Number(clienteFiadoEncontrado.saldoDevedorTotal || 0) + valorTotalCompra > clienteFiadoEncontrado.limiteFiado
      ) {
        const confirmarExcesso = window.confirm(
          `⚠️ ATENÇÃO: O valor desta compra (R$ ${Number(valorTotalCompra || 0).toFixed(2)}) ultrapassa o limite de fiado do cliente ${clienteFiadoEncontrado.nome} (R$ ${Number(clienteFiadoEncontrado.limiteFiado || 0).toFixed(2)}).\n\nSaldo devedor atual: R$ ${Number(clienteFiadoEncontrado.saldoDevedorTotal || 0).toFixed(2)}\n\nDeseja autorizar a compra em fiado mesmo assim?`
        );
        if (!confirmarExcesso) return;
      }
    }

    let novoEstoque: ItemEstoque[];

    if (itemEmEstoque.estoqueIlimitado || itemEmEstoque.tipoCadastro === 'interno') {
      // Produto interno de produção contínua (ex: espetinhos, doses) - não reduz a zero nem exclui do estoque
      novoEstoque = [...estoque];
    } else {
      const novaQuantidade = itemEmEstoque.quantidade - qtdNumerica;

      if (novaQuantidade <= 0) {
        novoEstoque = estoque.filter(
          (p) => !(p.codigo === prodAtual.codigo && p.validade === prodAtual.validade && p.lote === prodAtual.lote)
        );
        excluirItemEstoqueFirestore(prodAtual.codigo, prodAtual.validade, prodAtual.lote, supermercadoAtual).catch((err) => {
          console.warn('Aviso ao excluir item do Firestore:', err);
        });
      } else {
        novoEstoque = estoque.map((p) => {
          if (p.codigo === prodAtual.codigo && p.validade === prodAtual.validade && p.lote === prodAtual.lote) {
            return { ...p, quantidade: novaQuantidade };
          }
          return p;
        });
        const itemAtualizado = novoEstoque.find(
          (p) => p.codigo === prodAtual.codigo && p.validade === prodAtual.validade && p.lote === prodAtual.lote
        );
        if (itemAtualizado) {
          salvarItemEstoqueFirestore(itemAtualizado, supermercadoAtual).catch((err) => {
            console.warn('Aviso ao atualizar item no Firestore:', err);
          });
        }
      }
    }

    // Determine cashier / seller name
    const opAtivo = listaOperadores.find((op) => op.id === operadorAtivoId);
    const nomeOperador = opAtivo ? opAtivo.nome : 'Administrador do Supermercado';

    // Create Sale Object
    const novaVenda: Venda = {
      id: 'ven_' + Date.now(),
      lojaId: supermercadoAtual,
      data: new Date().toISOString().slice(0, 10),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      operadorId: operadorAtivoId || 'admin',
      operadorNome: nomeOperador,
      itens: [
        {
          codigo: prodAtual.codigo,
          nome: prodAtual.nome,
          quantidade: qtdNumerica,
          preco_unitario: prodAtual.preco_venda,
          preco_custo: prodAtual.preco_custo,
          subtotal: prodAtual.preco_venda * qtdNumerica,
          lote: prodAtual.lote,
          validade: prodAtual.validade,
          foto: prodAtual.foto,
        },
      ],
      valorTotal: prodAtual.preco_venda * qtdNumerica,
      formaPagamento: formaPagamento,
      status: 'concluida',
    };

    // Vincular cliente fiado e atualizar registro do devedor
    if (formaPagamento === 'fiado' && clienteFiadoEncontrado) {
      novaVenda.clienteFiadoId = clienteFiadoEncontrado.id;
      novaVenda.clienteFiadoNome = clienteFiadoEncontrado.nome;

      const valorTotalCompra = prodAtual.preco_venda * qtdNumerica;
      const novaCompraFiado: CompraFiado = {
        id: 'comp_' + Date.now(),
        vendaId: novaVenda.id,
        data: novaVenda.data,
        hora: novaVenda.hora,
        timestamp: novaVenda.timestamp,
        valorTotal: valorTotalCompra,
        valorPago: 0,
        saldoRestante: valorTotalCompra,
        itens: novaVenda.itens,
        operadorNome: nomeOperador,
        status: 'pendente',
      };

      const clienteAtualizado: ClienteDevedor = {
        ...clienteFiadoEncontrado,
        saldoDevedorTotal: clienteFiadoEncontrado.saldoDevedorTotal + valorTotalCompra,
        compras: [novaCompraFiado, ...(clienteFiadoEncontrado.compras || [])],
      };

      const novosClientes = clientesDevedores.map((c) => (c.id === clienteAtualizado.id ? clienteAtualizado : c));
      setClientesDevedores(novosClientes);
      safeLocalStorageSet(`clientes_devedores_${supermercadoAtual}`, JSON.stringify(novosClientes));
      salvarClienteDevedorFirestore(clienteAtualizado);
    }

    const novasVendas = [novaVenda, ...vendas];
    setVendas(novasVendas);
    safeLocalStorageSet(`vendas_${supermercadoAtual}`, JSON.stringify(novasVendas));

    // Offline Queueing & Firestore Sync
    if (!navigator.onLine) {
      adicionarVendaFilaOffline(novaVenda);
      setVendasPendentesCount(obterVendasPendentesOffline().length);
    } else {
      salvarVendaFirestore(novaVenda).catch(() => {
        adicionarVendaFilaOffline(novaVenda);
        setVendasPendentesCount(obterVendasPendentesOffline().length);
      });
    }

    registrarLogAuditoria(
      'Venda Concluída',
      `Venda ${novaVenda.id} de R$ ${novaVenda.valorTotal.toFixed(2)} (${novaVenda.formaPagamento.toUpperCase()}) por ${nomeOperador}`
    );

    setEstoque(novoEstoque);
    safeLocalStorageSet(`estoque_${supermercadoAtual}`, JSON.stringify(novoEstoque));
    tocarSomSucessoVenda();
    setMsgVenda(
      <span style={{ color: 'var(--sucesso)' }}>
        ✅ Venda realizada com sucesso!
      </span>
    );
    notificarSincronizacao();

    setTimeout(() => {
      setModalVendaVisivel(false);
      setVendaCupomVer(novaVenda);
    }, 700);
  };

  // ==========================================
  // SHOPPING CART FUNCTIONS (CARRINHO DE COMPRAS)
  // ==========================================

  const salvarCarrinho = (novoCarrinho: ItemCarrinho[]) => {
    setCarrinho(novoCarrinho);
    safeLocalStorageSet(`carrinho_vendas_${supermercadoAtual}`, JSON.stringify(novoCarrinho));
  };

  const adicionarAoCarrinho = (item: ItemEstoque, quantidade: number = 1) => {
    if (!sessaoCaixaAtiva || sessaoCaixaAtiva.status !== 'aberto') {
      alert(
        '⚠️ O Caixa está FECHADO!\n\nPara realizar vendas e adicionar itens ao carrinho, é obrigatório abrir o turno do caixa primeiro (informando o troco inicial).'
      );
      setModalCaixaVisivel(true);
      return;
    }

    if (!quantidade || quantidade <= 0) return;

    // Se o item passado estiver com saldo zerado, busca automaticamente outro lote ativo com estoque
    let itemAlvo = item;
    const isIlimitadoOriginal = item.estoqueIlimitado || item.tipoCadastro === 'interno';
    if (!isIlimitadoOriginal && item.quantidade <= 0) {
      const melhorLote = localizarMelhorLoteEstoque(item.codigo, estoque);
      if (melhorLote && (melhorLote.quantidade > 0 || melhorLote.estoqueIlimitado || melhorLote.tipoCadastro === 'interno')) {
        itemAlvo = melhorLote;
      }
    }

    const isIlimitado = itemAlvo.estoqueIlimitado || itemAlvo.tipoCadastro === 'interno';
    const itemId = `${itemAlvo.codigo}_${itemAlvo.validade}_${itemAlvo.lote}`;
    const itemExistenteIndex = carrinho.findIndex((c) => c.id === itemId);

    let novoCarrinho = [...carrinho];

    if (itemExistenteIndex >= 0) {
      const itemAtual = novoCarrinho[itemExistenteIndex];
      const novaQtd = parseFloat((itemAtual.quantidade + quantidade).toFixed(3));

      // Se a quantidade solicitada exceder o saldo deste lote individual
      if (!isIlimitado && novaQtd > itemAlvo.quantidade) {
        const estoqueTotalProduto = estoque
          .filter((e) => e.codigo === itemAlvo.codigo)
          .reduce((acc, e) => acc + e.quantidade, 0);

        const totalJaNoCarrinho = carrinho
          .filter((c) => c.codigo === itemAlvo.codigo)
          .reduce((acc, c) => acc + c.quantidade, 0);

        const outrosLotes = estoque.filter(
          (e) => e.codigo === itemAlvo.codigo && `${e.validade}_${e.lote}` !== `${itemAlvo.validade}_${itemAlvo.lote}` && e.quantidade > 0
        );

        if (outrosLotes.length > 0 && totalJaNoCarrinho + quantidade <= estoqueTotalProduto) {
          const qtdCabivelNeste = Math.max(0, itemAlvo.quantidade - itemAtual.quantidade);
          const qtdSobra = parseFloat((quantidade - qtdCabivelNeste).toFixed(3));

          if (qtdCabivelNeste > 0) {
            novoCarrinho[itemExistenteIndex] = {
              ...itemAtual,
              quantidade: itemAlvo.quantidade,
              subtotal: parseFloat((itemAlvo.quantidade * itemAtual.preco_unitario).toFixed(2)),
            };
          }

          if (qtdSobra > 0) {
            const proxLote = outrosLotes[0];
            const proxItemId = `${proxLote.codigo}_${proxLote.validade}_${proxLote.lote}`;
            const proxIdx = novoCarrinho.findIndex((c) => c.id === proxItemId);
            const catRel = catalogoGlobal.find((c) => c.codigo === proxLote.codigo);

            if (proxIdx >= 0) {
              const itemProx = novoCarrinho[proxIdx];
              const novaQtdProx = parseFloat((itemProx.quantidade + qtdSobra).toFixed(3));
              novoCarrinho[proxIdx] = {
                ...itemProx,
                quantidade: novaQtdProx,
                subtotal: parseFloat((novaQtdProx * itemProx.preco_unitario).toFixed(2)),
              };
            } else {
              novoCarrinho.push({
                id: proxItemId,
                codigo: proxLote.codigo,
                nome: obterNomeProduto(proxLote.codigo, proxLote.nome),
                marca: catRel?.marca || proxLote.marca,
                categoria: catRel?.categoria || proxLote.categoria,
                quantidade: qtdSobra,
                preco_unitario: proxLote.preco_venda,
                preco_custo: proxLote.preco_custo,
                subtotal: parseFloat((qtdSobra * proxLote.preco_venda).toFixed(2)),
                lote: proxLote.lote,
                validade: proxLote.validade,
                foto: obterFotoProduto(proxLote.codigo, proxLote.foto),
                estoqueDisponivel: proxLote.quantidade,
                tipoCadastro: proxLote.tipoCadastro,
                estoqueIlimitado: proxLote.estoqueIlimitado,
              });
            }
          }

          salvarCarrinho(novoCarrinho);
          tocarBeepCaixa();
          return;
        }

        alert(
          `⚠️ Quantidade limite atingida!\nO estoque disponível deste produto "${itemAlvo.nome}" é de ${estoqueTotalProduto} un. Você já colocou ${totalJaNoCarrinho} un no carrinho.`
        );
        return;
      }

      novoCarrinho[itemExistenteIndex] = {
        ...itemAtual,
        quantidade: novaQtd,
        subtotal: parseFloat((novaQtd * itemAtual.preco_unitario).toFixed(2)),
        estoqueDisponivel: isIlimitado ? 99999 : itemAlvo.quantidade,
        tipoCadastro: itemAlvo.tipoCadastro,
        estoqueIlimitado: isIlimitado,
      };
    } else {
      if (!isIlimitado && quantidade > itemAlvo.quantidade) {
        alert(`⚠️ Quantidade solicitada (${quantidade}) é maior que o estoque disponível (${itemAlvo.quantidade} un).`);
        return;
      }

      const catRel = catalogoGlobal.find((c) => c.codigo === itemAlvo.codigo);
      const novoItemCarrinho: ItemCarrinho = {
        id: itemId,
        codigo: itemAlvo.codigo,
        nome: obterNomeProduto(itemAlvo.codigo, itemAlvo.nome),
        marca: catRel?.marca || itemAlvo.marca,
        categoria: catRel?.categoria || itemAlvo.categoria,
        quantidade: quantidade,
        preco_unitario: itemAlvo.preco_venda,
        preco_custo: itemAlvo.preco_custo,
        subtotal: parseFloat((quantidade * itemAlvo.preco_venda).toFixed(2)),
        lote: itemAlvo.lote,
        validade: itemAlvo.validade,
        foto: obterFotoProduto(itemAlvo.codigo, itemAlvo.foto),
        estoqueDisponivel: isIlimitado ? 99999 : itemAlvo.quantidade,
        tipoCadastro: itemAlvo.tipoCadastro,
        estoqueIlimitado: isIlimitado,
      };
      novoCarrinho.push(novoItemCarrinho);
    }

    salvarCarrinho(novoCarrinho);
    tocarBeepCaixa();
  };

  const alterarQuantidadeCarrinho = (itemId: string, novaQtd: number) => {
    if (novaQtd <= 0) {
      removerItemCarrinho(itemId);
      return;
    }

    const novoCarrinho = carrinho.map((c) => {
      if (c.id === itemId) {
        const isIlimitado = c.estoqueIlimitado || c.tipoCadastro === 'interno';
        const qtdAjustada = isIlimitado ? novaQtd : Math.min(novaQtd, c.estoqueDisponivel);
        return {
          ...c,
          quantidade: qtdAjustada,
          subtotal: qtdAjustada * c.preco_unitario,
        };
      }
      return c;
    });

    salvarCarrinho(novoCarrinho);
  };

  const removerItemCarrinho = (itemId: string) => {
    const novoCarrinho = carrinho.filter((c) => c.id !== itemId);
    salvarCarrinho(novoCarrinho);
  };

  const limparCarrinho = () => {
    salvarCarrinho([]);
  };

  // FINALIZAR VENDA COMPLETA DO CARRINHO (MÚLTIPLOS PRODUTOS DE UMA VEZ)
  const finalizarVendaCarrinho = (
    formaPagamentoVenda: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'fiado',
    clienteFiadoIdEscolhido?: string
  ) => {
    if (!sessaoCaixaAtiva || sessaoCaixaAtiva.status !== 'aberto') {
      alert('⚠️ Caixa fechado! Abra o turno de caixa antes de concluir a venda.');
      setModalCaixaVisivel(true);
      return;
    }

    if (carrinho.length === 0) {
      alert('⚠️ Carrinho vazio!');
      return;
    }

    // 1. Validar estoques de todos os itens do carrinho antes de processar
    for (const itemCar of carrinho) {
      if (itemCar.estoqueIlimitado || itemCar.tipoCadastro === 'interno') {
        continue; // Produto com estoque ilimitado/contínuo nunca trava por falta de estoque
      }
      const itemEst = estoque.find(
        (p) => p.codigo === itemCar.codigo && p.validade === itemCar.validade && p.lote === itemCar.lote
      );
      if (!itemEst || itemCar.quantidade > itemEst.quantidade) {
        alert(
          `⚠️ Estoque insuficiente para o produto "${itemCar.nome}"!\nDisponível: ${itemEst ? itemEst.quantidade : 0} un | No carrinho: ${itemCar.quantidade} un.`
        );
        return;
      }
    }

    // 2. Se for fiado, validar cliente
    let clienteFiadoEncontrado: ClienteDevedor | undefined = undefined;
    const valorTotalCarrinho = carrinho.reduce((acc, it) => acc + it.subtotal, 0);

    if (formaPagamentoVenda === 'fiado') {
      if (!clienteFiadoIdEscolhido) {
        alert('Selecione um cliente cadastrado para registrar a compra em fiado.');
        return;
      }
      clienteFiadoEncontrado = clientesDevedores.find((c) => c.id === clienteFiadoIdEscolhido);
      if (!clienteFiadoEncontrado) {
        alert('Cliente fiado não encontrado!');
        return;
      }
    }

    // 3. Atualizar estoque de cada item vendido
    let novoEstoque = [...estoque];

    for (const itemCar of carrinho) {
      const idx = novoEstoque.findIndex(
        (p) => p.codigo === itemCar.codigo && p.validade === itemCar.validade && p.lote === itemCar.lote
      );
      if (idx >= 0) {
        if (novoEstoque[idx].estoqueIlimitado || novoEstoque[idx].tipoCadastro === 'interno') {
          // Produto interno de produção própria e contínua: não remove o item do estoque
          continue;
        }
        const novaQtd = novoEstoque[idx].quantidade - itemCar.quantidade;
        if (novaQtd <= 0) {
          const itemRemovido = novoEstoque[idx];
          novoEstoque.splice(idx, 1);
          excluirItemEstoqueFirestore(itemRemovido.codigo, itemRemovido.validade, itemRemovido.lote, supermercadoAtual).catch(
            (err) => console.warn('Aviso ao excluir item no Firestore:', err)
          );
        } else {
          novoEstoque[idx] = { ...novoEstoque[idx], quantidade: novaQtd };
          salvarItemEstoqueFirestore(novoEstoque[idx], supermercadoAtual).catch((err) =>
            console.warn('Aviso ao atualizar estoque no Firestore:', err)
          );
        }
      }
    }

    // 4. Determinar operador
    const opAtivo = listaOperadores.find((op) => op.id === operadorAtivoId);
    const nomeOperador = opAtivo ? opAtivo.nome : 'Administrador do Supermercado';

    // 5. Criar itens da Venda
    const itensVenda: VendaItem[] = carrinho.map((c) => ({
      codigo: c.codigo,
      nome: c.nome,
      quantidade: c.quantidade,
      preco_unitario: c.preco_unitario,
      preco_custo: c.preco_custo,
      subtotal: c.subtotal,
      lote: c.lote,
      validade: c.validade,
      foto: c.foto,
    }));

    const novaVenda: Venda = {
      id: 'ven_' + Date.now(),
      lojaId: supermercadoAtual,
      data: new Date().toISOString().slice(0, 10),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      operadorId: operadorAtivoId || 'admin',
      operadorNome: nomeOperador,
      itens: itensVenda,
      valorTotal: valorTotalCarrinho,
      formaPagamento: formaPagamentoVenda,
      status: 'concluida',
    };

    // 6. Atualizar Caderneta de Fiado caso aplicável
    if (formaPagamentoVenda === 'fiado' && clienteFiadoEncontrado) {
      novaVenda.clienteFiadoId = clienteFiadoEncontrado.id;
      novaVenda.clienteFiadoNome = clienteFiadoEncontrado.nome;

      const novaCompraFiado: CompraFiado = {
        id: 'comp_' + Date.now(),
        vendaId: novaVenda.id,
        data: novaVenda.data,
        hora: novaVenda.hora,
        timestamp: novaVenda.timestamp,
        valorTotal: valorTotalCarrinho,
        valorPago: 0,
        saldoRestante: valorTotalCarrinho,
        itens: novaVenda.itens,
        operadorNome: nomeOperador,
        status: 'pendente',
      };

      const clienteAtualizado: ClienteDevedor = {
        ...clienteFiadoEncontrado,
        saldoDevedorTotal: clienteFiadoEncontrado.saldoDevedorTotal + valorTotalCarrinho,
        compras: [novaCompraFiado, ...(clienteFiadoEncontrado.compras || [])],
      };

      const novosClientes = clientesDevedores.map((c) => (c.id === clienteAtualizado.id ? clienteAtualizado : c));
      setClientesDevedores(novosClientes);
      safeLocalStorageSet(`clientes_devedores_${supermercadoAtual}`, JSON.stringify(novosClientes));
      salvarClienteDevedorFirestore(clienteAtualizado);
    }

    // 7. Salvar Vendas
    const novasVendas = [novaVenda, ...vendas];
    setVendas(novasVendas);
    safeLocalStorageSet(`vendas_${supermercadoAtual}`, JSON.stringify(novasVendas));

    // Offline / Firestore sync
    if (!navigator.onLine) {
      adicionarVendaFilaOffline(novaVenda);
      setVendasPendentesCount(obterVendasPendentesOffline().length);
    } else {
      salvarVendaFirestore(novaVenda).catch(() => {
        adicionarVendaFilaOffline(novaVenda);
        setVendasPendentesCount(obterVendasPendentesOffline().length);
      });
    }

    registrarLogAuditoria(
      'Venda com Carrinho Concluída',
      `Venda ${novaVenda.id} com ${novaVenda.itens.length} produto(s) no total de R$ ${novaVenda.valorTotal.toFixed(2)} (${novaVenda.formaPagamento.toUpperCase()}) por ${nomeOperador}`
    );

    // 8. Aplicar novo estoque, limpar carrinho e abrir cupom
    setEstoque(novoEstoque);
    safeLocalStorageSet(`estoque_${supermercadoAtual}`, JSON.stringify(novoEstoque));
    limparCarrinho();
    tocarSomSucessoVenda();
    notificarSincronizacao();

    setModalCarrinhoVisivel(false);
    setVendaCupomVer(novaVenda);
  };

  // Sales Reversal (Estorno) Handler
  const handleEstornarVenda = (vendaId: string, motivo: string) => {
    const vendaIndex = vendas.findIndex((v) => v.id === vendaId);
    if (vendaIndex === -1) return;

    const venda = vendas[vendaIndex];
    if (venda.status === 'estornada') return;

    const opAtivo = listaOperadores.find((op) => op.id === operadorAtivoId);
    const nomeOperadorEstorno = opAtivo ? opAtivo.nome : 'Administrador do Supermercado';
    const dataHoraEstorno = `${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    // 1. Mark sale as estornada
    const novasVendas = [...vendas];
    novasVendas[vendaIndex] = {
      ...venda,
      status: 'estornada',
      dataEstorno: dataHoraEstorno,
      operadorEstornoNome: nomeOperadorEstorno,
      motivoEstorno: motivo,
    };

    // 2. Return sold items back to inventory
    let novoEstoque = [...estoque];
    venda.itens.forEach((itemVenda) => {
      const idxEst = novoEstoque.findIndex(
        (p) => p.codigo === itemVenda.codigo && p.lote === itemVenda.lote && p.validade === itemVenda.validade
      );

      if (idxEst !== -1) {
        novoEstoque[idxEst] = {
          ...novoEstoque[idxEst],
          quantidade: novoEstoque[idxEst].quantidade + itemVenda.quantidade,
        };
      } else {
        // Re-create stock entry if it was completely sold out
        novoEstoque.push({
          codigo: itemVenda.codigo,
          nome: itemVenda.nome,
          quantidade: itemVenda.quantidade,
          lote: itemVenda.lote || 'LOTE_ESTORNO',
          validade: itemVenda.validade || new Date().toISOString().slice(0, 10),
          preco_custo: itemVenda.preco_custo || 0,
          preco_venda: itemVenda.preco_unitario,
          foto: itemVenda.foto,
        });
      }
    });

    setEstoque(novoEstoque);
    safeLocalStorageSet(`estoque_${supermercadoAtual}`, JSON.stringify(novoEstoque));

    setVendas(novasVendas);
    safeLocalStorageSet(`vendas_${supermercadoAtual}`, JSON.stringify(novasVendas));

    salvarVendaFirestore(novasVendas[vendaIndex]);
    venda.itens.forEach((itemVenda) => {
      const idxEst = novoEstoque.findIndex(
        (p) => p.codigo === itemVenda.codigo && p.lote === itemVenda.lote && p.validade === itemVenda.validade
      );
      if (idxEst !== -1) {
        salvarItemEstoqueFirestore(novoEstoque[idxEst], supermercadoAtual);
      }
    });

    notificarSincronizacao();
  };

  // Helper para fechar sobreposições de tela cheia antes de abrir uma nova aba
  const fecharPaineisTelaCheia = () => {
    setRelatorioCheioVisivel(false);
    setModalCentralRelatoriosVisivel(false);
    setModalRelatorioVendasVisivel(false);
    setModalGraficosVendasVisivel(false);
    setModalGestaoDeliveryVisivel(false);
    setModalCardapioClienteVisivel(false);
  };

  // Central Única de Relatórios & Desempenho
  const abrirCentralRelatorios = (aba: 'faturamento' | 'vendas' | 'estoque' | 'delivery' = 'faturamento') => {
    fecharMenu();
    if (!verificarPermissaoOuAvisar('relatorios', 'ver_relatorios', 'Ver Central de Relatórios')) return;
    fecharPaineisTelaCheia();
    setAbaRelatorioInicial(aba);
    setModalCentralRelatoriosVisivel(true);
  };

  const abrirRelatorioVendas = () => {
    fecharMenu();
    if (!verificarPermissaoOuAvisar('relatorios', 'ver_relatorios', 'Ver Histórico de Vendas & Cupons')) return;
    fecharPaineisTelaCheia();
    setModalRelatorioVendasVisivel(true);
  };

  const abrirGraficosVendas = () => {
    fecharMenu();
    if (!verificarPermissaoOuAvisar('graficos', 'ver_graficos', 'Ver Gráficos de Lucro & Faturamento')) return;
    fecharPaineisTelaCheia();
    setModalGraficosVendasVisivel(true);
  };

  // Funções do Delivery
  const abrirGestaoDelivery = () => {
    fecharMenu();
    fecharPaineisTelaCheia();
    setModalGestaoDeliveryVisivel(true);
  };

  const abrirCardapioCliente = () => {
    fecharMenu();
    fecharPaineisTelaCheia();
    setModalCardapioClienteVisivel(true);
  };

  const handleSalvarConfigDelivery = (novaConfig: ConfiguracaoDelivery) => {
    setConfigDelivery(novaConfig);
    const storeId = supermercadoAtual || 'loja_matriz_01';
    safeLocalStorageSet(`config_delivery_${storeId}`, JSON.stringify(novaConfig));
  };

  const handleAtualizarStatusPedidoDelivery = (
    pedidoId: string,
    novoStatus: StatusPedidoDelivery,
    motivo?: string
  ) => {
    const storeId = supermercadoAtual || 'loja_matriz_01';
    const pedidoAlvo = pedidosDelivery.find((p) => p.id === pedidoId);
    if (!pedidoAlvo) return;

    // Se o pedido está sendo aceito (passando de pendente para em_separacao), baixa o estoque da loja em ordem FEFO (vencimento mais próximo primeiro)
    if (pedidoAlvo.status === 'pendente' && novoStatus === 'em_separacao') {
      let novoEstoque = [...estoque];

      pedidoAlvo.itens.forEach((it) => {
        const codAlvo = String(it.codigo || '').trim();
        let qtdRestanteAbater = Number(it.quantidade) || 0;
        if (qtdRestanteAbater <= 0) return;

        // Localiza lotes correspondentes ordenados pela validade mais próxima (FEFO)
        const indicesLotes = novoEstoque
          .map((e, idx) => ({ e, idx }))
          .filter(({ e }) => String(e.codigo || '').trim() === codAlvo)
          .sort((a, b) => (a.e.validade || '9999-12-31').localeCompare(b.e.validade || '9999-12-31'));

        for (const { e, idx } of indicesLotes) {
          if (qtdRestanteAbater <= 0) break;
          if (e.estoqueIlimitado || e.tipoCadastro === 'interno') {
            qtdRestanteAbater = 0;
            break;
          }
          const disponivelLote = Math.max(0, Number(e.quantidade) || 0);
          if (disponivelLote <= 0) continue;

          const abaterDesteLote = Math.min(disponivelLote, qtdRestanteAbater);
          const novoSaldoLote = disponivelLote - abaterDesteLote;
          qtdRestanteAbater -= abaterDesteLote;

          novoEstoque[idx] = { ...novoEstoque[idx], quantidade: novoSaldoLote };
          if (novoSaldoLote <= 0) {
            excluirItemEstoqueFirestore(e.codigo, e.validade, e.lote, storeId).catch(() => {});
          } else {
            salvarItemEstoqueFirestore(novoEstoque[idx], storeId).catch(() => {});
          }
        }
      });

      // Remove do array em memória os lotes controlados que zeraram
      novoEstoque = novoEstoque.filter(
        (e) => e.estoqueIlimitado || e.tipoCadastro === 'interno' || (Number(e.quantidade) || 0) > 0
      );

      setEstoque(novoEstoque);
      safeLocalStorageSet(`estoque_${storeId}`, JSON.stringify(novoEstoque));

      // Registra a venda oficial no histórico e no caixa
      const agora = new Date();
      const opAtivo = listaOperadores.find((op) => op.id === operadorAtivoId);
      const opId = opAtivo?.id || operadorAtivoId || 'op_delivery';
      const opNome = opAtivo?.nome || 'Operador';

      const novaVenda: Venda = {
        id: `ven_del_${pedidoAlvo.numeroPedido}`,
        lojaId: storeId,
        data: agora.toISOString().slice(0, 10),
        hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        timestamp: agora.getTime(),
        operadorId: opId,
        operadorNome: `${opNome} (Delivery)`,
        itens: pedidoAlvo.itens.map((it) => ({
          codigo: it.codigo,
          nome: it.nome,
          quantidade: it.quantidade,
          preco_unitario: it.preco_unitario,
          preco_custo: it.preco_custo,
          subtotal: it.subtotal,
          lote: it.lote,
          validade: it.validade,
          foto: it.foto,
        })),
        valorTotal: pedidoAlvo.valorTotal,
        formaPagamento: pedidoAlvo.formaPagamento === 'cartao_credito' ? 'cartao_credito' :
                        pedidoAlvo.formaPagamento === 'cartao_debito' ? 'cartao_debito' :
                        pedidoAlvo.formaPagamento === 'dinheiro' ? 'dinheiro' : 'pix',
        status: 'concluida',
        origem: 'delivery',
        taxaEntrega: pedidoAlvo.taxaEntrega,
        pedidoDeliveryId: pedidoAlvo.id,
      };

      const novasVendas = [novaVenda, ...vendas];
      setVendas(novasVendas);
      safeLocalStorageSet(`vendas_${storeId}`, JSON.stringify(novasVendas));
      salvarVendaFirestore(novaVenda);

      // Se houver sessão de caixa aberta, registra a movimentação
      if (sessaoCaixaAtiva) {
        const novaMov: MovimentacaoCaixa = {
          id: `mov_del_${Date.now()}`,
          lojaId: storeId,
          sessaoId: sessaoCaixaAtiva.id,
          tipo: 'venda',
          valor: pedidoAlvo.valorTotal,
          descricao: `Pedido Delivery #${pedidoAlvo.numeroPedido} (${pedidoAlvo.cliente.nome})`,
          operadorId: opId,
          operadorNome: opNome,
          dataHora: agora.toISOString(),
        };
        const novasMovs = [...movimentacoesCaixa, novaMov];
        setMovimentacoesCaixa(novasMovs);
        safeLocalStorageSet(`movimentacoes_caixa_${storeId}`, JSON.stringify(novasMovs));
      }

      tocarSomSucessoVenda();
    }

    // Se o pedido foi cancelado após ter sido aceito, devolve ao estoque
    if (novoStatus === 'cancelado' && (pedidoAlvo.status === 'em_separacao' || pedidoAlvo.status === 'saiu_para_entrega')) {
      const novoEstoque = [...estoque];
      pedidoAlvo.itens.forEach((it) => {
        const idx = novoEstoque.findIndex(
          (e) => e.codigo === it.codigo && (!it.lote || e.lote === it.lote)
        );
        if (idx !== -1 && !novoEstoque[idx].estoqueIlimitado) {
          novoEstoque[idx] = { ...novoEstoque[idx], quantidade: novoEstoque[idx].quantidade + it.quantidade };
          salvarItemEstoqueFirestore(novoEstoque[idx], storeId);
        }
      });
      setEstoque(novoEstoque);
      safeLocalStorageSet(`estoque_${storeId}`, JSON.stringify(novoEstoque));

      // Estorna a venda correspondente caso exista
      const vendaCorrespondente = vendas.find((v) => v.pedidoDeliveryId === pedidoAlvo.id || v.id === `ven_del_${pedidoAlvo.numeroPedido}`);
      if (vendaCorrespondente) {
        handleEstornarVenda(vendaCorrespondente.id, motivo || 'Cancelamento no painel de delivery');
      }
    }

    const novosPedidos = pedidosDelivery.map((p) => {
      if (p.id === pedidoId) {
        return {
          ...p,
          status: novoStatus,
          motivoCancelamento: motivo || p.motivoCancelamento,
        };
      }
      return p;
    });

    setPedidosDelivery(novosPedidos);
    safeLocalStorageSet(`pedidos_delivery_${storeId}`, JSON.stringify(novosPedidos));
  };

  const handleConfirmarEntregaPin = (pedidoId: string, pinDigitado: string): boolean => {
    const storeId = supermercadoAtual || 'loja_matriz_01';
    const pedidoAlvo = pedidosDelivery.find((p) => p.id === pedidoId);
    if (!pedidoAlvo) return false;

    // Confere o PIN
    if (pedidoAlvo.codigoEntregaPin.trim() !== pinDigitado.trim()) {
      return false;
    }

    const agora = new Date();
    const novosPedidos = pedidosDelivery.map((p) => {
      if (p.id === pedidoId) {
        return {
          ...p,
          status: 'entregue' as StatusPedidoDelivery,
          dataFinalizacao: agora.toISOString().slice(0, 10),
          horaFinalizacao: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return p;
    });

    setPedidosDelivery(novosPedidos);
    safeLocalStorageSet(`pedidos_delivery_${storeId}`, JSON.stringify(novosPedidos));
    tocarSomSucessoVenda();
    return true;
  };

  const handleCriarPedidoCliente = (novoPedido: PedidoDelivery) => {
    const storeId = supermercadoAtual || 'loja_matriz_01';
    const novos = [novoPedido, ...pedidosDelivery];
    setPedidosDelivery(novos);
    safeLocalStorageSet(`pedidos_delivery_${storeId}`, JSON.stringify(novos));
    tocarAlertaNovoPedidoDelivery();
  };

  const handleSimularPedidoTeste = () => {
    const storeId = supermercadoAtual || 'loja_matriz_01';
    const numPed = Math.floor(1000 + Math.random() * 9000);
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const agora = new Date();

    const itensTeste = estoque.length > 0
      ? [
          {
            codigo: estoque[0].codigo,
            nome: `${estoque[0].nome} (Gelada)`,
            quantidade: 2,
            preco_unitario: estoque[0].preco_venda,
            preco_custo: estoque[0].preco_custo || 0,
            subtotal: estoque[0].preco_venda * 2,
            gelado: true,
            foto: estoque[0].foto,
          },
        ]
      : [
          {
            codigo: '7891000100102',
            nome: 'Cerveja Heineken 330ml (Gelada)',
            quantidade: 4,
            preco_unitario: 8.50,
            preco_custo: 5.50,
            subtotal: 34.00,
            gelado: true,
          },
        ];

    const sub = itensTeste.reduce((acc, cur) => acc + cur.subtotal, 0);
    const taxa = configDelivery.taxaEntregaFixa || 6.90;

    const sim: PedidoDelivery = {
      id: `del_${Date.now()}`,
      numeroPedido: numPed,
      lojaId: storeId,
      data: agora.toISOString().slice(0, 10),
      hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: agora.getTime(),
      cliente: {
        nome: 'Cliente Delivery (Teste)',
        telefone: '(11) 99887-1122',
        maior18AnosConfirmado: true,
      },
      enderecoEntrega: {
        logradouro: 'Rua Augusta',
        numero: '780',
        bairro: 'Consolação',
        cidade: 'São Paulo',
        referencia: 'Apartamento 54',
      },
      itens: itensTeste,
      subtotal: sub,
      taxaEntrega: taxa,
      valorTotal: sub + taxa,
      formaPagamento: 'pix',
      status: 'pendente',
      codigoEntregaPin: pin,
    };

    handleCriarPedidoCliente(sim);
  };

  // Low Stock & Reorder Threshold Handler
  const alterarLimiarEstoque = (novoValor: number) => {
    const val = Math.max(1, Math.floor(novoValor));
    setLimiarEstoqueMinimo(val);
    const currentStoreId = localStorage.getItem('supermercadoAtualId') || 'loja_matriz_01';
    safeLocalStorageSet(`limiar_estoque_minimo_${currentStoreId}`, String(val));
  };

  // Quick Reorder Helper (Pre-populates new stock batch modal from notification center)
  const abrirReposicaoProduto = (prod: {
    codigo: string;
    nome: string;
    preco_custo?: number;
    preco_venda?: number;
    foto?: string;
    marca?: string;
    categoria?: string;
  }) => {
    setModalNotificacoesVisivel(false);
    fecharMenu();
    setCodigoEditando(null);
    setCadCod(prod.codigo);
    setCadNome(prod.nome);
    const cat = catalogoGlobal.find((c) => c.codigo === prod.codigo);
    setCadMarca(prod.marca || cat?.marca || '');
    setCadCategoria(prod.categoria || cat?.categoria || '');
    setFotoTemp(prod.foto || cat?.imagem || '');
    setCadQtd('10');
    setCadLote('');
    setCadVal('');
    setCadCusto(prod.preco_custo ? String(prod.preco_custo) : '');
    setCadPreco(prod.preco_venda ? String(prod.preco_venda) : '');
    setMsgCad(
      <span style={{ color: 'var(--primario)', fontWeight: 600 }}>
        📦 Adicionando novo lote de reposição para: {prod.nome}
      </span>
    );
    setModalCadastroVisivel(true);
  };

  // Notifications Modal
  const abrirNotificacoes = (aba: 'estoque_baixo' | 'validade' | 'resumo' = 'estoque_baixo') => {
    setAbaNotificacoesInicial(aba);
    setModalNotificacoesVisivel(true);
  };

  // Full Reports
  const abrirRelatorio = () => {
    fecharMenu();
    fecharPaineisTelaCheia();
    setModoRelatorioAtual('estoque');
    setBuscaRelatorio('');
    setRelatorioCheioVisivel(true);
  };


  const fecharRelatorio = () => {
    setRelatorioCheioVisivel(false);
  };

  // Calculate Expiration Alerts
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const vencidosOuHoje = estoque.filter((p) => {
    const dataVal = new Date(p.validade + 'T00:00:00');
    const dias = Math.round((dataVal.getTime() - hoje.getTime()) / 86400000);
    return dias <= 0;
  });

  const proximoVencimento = estoque.filter((p) => {
    const dataVal = new Date(p.validade + 'T00:00:00');
    const dias = Math.round((dataVal.getTime() - hoje.getTime()) / 86400000);
    return dias <= 10;
  });

  // Calculate Low Stock alerts based on user-defined threshold (aggregated by barcode)
  const agrupadosEstoqueTotal: Record<string, number> = {};
  estoque.forEach((p) => {
    agrupadosEstoqueTotal[p.codigo] = (agrupadosEstoqueTotal[p.codigo] || 0) + p.quantidade;
  });

  const produtosEstoqueBaixoCount = Object.values(agrupadosEstoqueTotal).filter(
    (qtd) => qtd <= limiarEstoqueMinimo
  ).length;

  const totalNotificacoes = proximoVencimento.length + produtosEstoqueBaixoCount;

  // Filtered Inventory List for Main View
  const termoBusca = busca.trim().toLowerCase();
  const estoqueFiltrado = estoque.filter((p) => {
    const nomeResolvido = obterNomeProduto(p.codigo, p.nome);
    const catRel = catalogoGlobal.find((c) => c.codigo === p.codigo);
    const matchBusca =
      !termoBusca ||
      p.codigo.toLowerCase().includes(termoBusca) ||
      p.nome.toLowerCase().includes(termoBusca) ||
      nomeResolvido.toLowerCase().includes(termoBusca) ||
      (p.marca && p.marca.toLowerCase().includes(termoBusca)) ||
      (catRel?.marca && catRel.marca.toLowerCase().includes(termoBusca)) ||
      (p.categoria && p.categoria.toLowerCase().includes(termoBusca)) ||
      (catRel?.categoria && catRel.categoria.toLowerCase().includes(termoBusca));
    if (!matchBusca) return false;
    if (filtroTipoProduto === 'interno') return p.tipoCadastro === 'interno';
    if (filtroTipoProduto === 'padrao') return p.tipoCadastro !== 'interno';
    return true;
  });

  const countInternos = estoque.filter((p) => p.tipoCadastro === 'interno').length;
  const countPadrao = estoque.filter((p) => p.tipoCadastro !== 'interno').length;

  // Group items by product barcode for clean main dashboard layout
  const agrupados: Record<
    string,
    {
      codigo: string;
      nome: string;
      foto?: string;
      preco_venda: number;
      qtdTotal: number;
      lotes: { validade: string; qtd: number; lote: string }[];
      tipoCadastro?: 'padrao' | 'interno';
      estoqueIlimitado?: boolean;
      categoria?: string;
    }
  > = {};

  estoqueFiltrado.forEach((p) => {
    const codLimpo = String(p.codigo || p.codigo_barras || '').trim() || p.codigo;
    const nomeFinal = obterNomeProduto(codLimpo, p.nome);
    const fotoFinal = obterFotoProduto(codLimpo, p.foto);
    const catRel = catalogoGlobal.find((c) => String(c.codigo || '').trim() === codLimpo);
    const categoriaFinal = catRel?.categoria || p.categoria;

    if (!agrupados[codLimpo]) {
      agrupados[codLimpo] = {
        codigo: codLimpo,
        nome: nomeFinal,
        foto: fotoFinal,
        preco_venda: Number(p.preco_venda) || 0,
        qtdTotal: 0,
        lotes: [],
        tipoCadastro: p.tipoCadastro,
        estoqueIlimitado: p.estoqueIlimitado,
        categoria: categoriaFinal,
      };
    } else if (agrupados[codLimpo].nome !== nomeFinal && nomeFinal) {
      agrupados[codLimpo].nome = nomeFinal;
    }
    agrupados[codLimpo].qtdTotal += Number(p.quantidade) || 0;
    agrupados[codLimpo].lotes.push({ validade: p.validade, qtd: Number(p.quantidade) || 0, lote: p.lote });
  });

  const listaAgrupada = Object.values(agrupados).sort((a, b) => {
    const nomeA = (a.nome || '').trim().toLowerCase();
    const nomeB = (b.nome || '').trim().toLowerCase();
    return nomeA.localeCompare(nomeB, 'pt-BR', { sensitivity: 'base', numeric: true });
  });

  // Helper check if item is expired for Venda Modal styling
  const isProdAtualVencido = prodAtual
    ? new Date(prodAtual.validade + 'T00:00:00').getTime() <= hoje.getTime()
    : false;

  // 1. SE O PARÂMETRO ?loja= OU ?delivery= ESTIVER PRESENTE NA URL SEM ?painel=, RENDERIZA EXCLUSIVAMENTE O CUSTOMER DELIVERY VIEW EM TELA CHEIA (IDENTICO AO ATENDEJÁ)
  if (isModoCliente && publicLojaSlugAtivo) {
    return (
      <CustomerDeliveryView
        lojaSlug={publicLojaSlugAtivo}
        lojas={listaSupermercados}
        estoque={estoque}
        configDelivery={configDelivery}
        onCriarPedido={handleCriarPedidoCliente}
        pedidos={pedidosDelivery}
        obterFotoProduto={obterFotoProduto}
        obterNomeProduto={obterNomeProduto}
        onTrocarParaFuncionario={() => setTelaLoginVisivel(true)}
        carregando={carregandoEstoqueInicial}
      />
    );
  }

  return (
    <>
      {/* HEADER */}
      <header className="cabecalho">
        <div className="container-cabecalho">
          <button className="btn-menu" onClick={abrirMenu} title="Abrir Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="barra-acoes">
            <input
              type="search"
              id="busca"
              name="search_query_estoque_pdv"
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              data-form-type="other"
              data-lpignore="true"
              data-1p-ignore="true"
              readOnly
              onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
              className="input-busca"
              placeholder="Buscar no estoque..."
              value={busca.toLowerCase().includes('rodrigo.souza') ? '' : busca}
              onChange={(e) => {
                const v = e.target.value;
                setBusca(v.toLowerCase().includes('rodrigo.souza') ? '' : v);
              }}
            />

            {temPermissaoOperador('cadastrar_produtos', 'estoque') && (
              <>
                <button
                  className="btn"
                  style={{
                    background: '#16a34a',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    padding: '7px 10px',
                    whiteSpace: 'nowrap',
                    gap: '4px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    abrirCadastro('estoque', 'padrao');
                  }}
                  title="Adicionar Produto Industrial com Código de Barras ao Estoque"
                >
                  <span>➕</span>
                  <span>Estoque</span>
                </button>

                <button
                  className="btn"
                  style={{
                    background: '#0284c7',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    padding: '7px 10px',
                    whiteSpace: 'nowrap',
                    gap: '4px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    abrirCadastro('estoque', 'interno');
                  }}
                  title="Cadastrar Produto Interno sem Código de Barras (Espetinho, Doses, Gelo, Balcão)"
                >
                  <span>🍢</span>
                  <span>+ Balcão</span>
                </button>
              </>
            )}

            {temPermissaoOperador('alertas_validade', 'alertas') && (
              <button
                className="btn btn-notif"
                onClick={() => abrirNotificacoes(produtosEstoqueBaixoCount > 0 ? 'estoque_baixo' : 'validade')}
                title={`Notificações & Alertas (${totalNotificacoes})`}
              >
                🔔
                <span
                  className="badge-notif"
                  id="badgeNotif"
                  style={{
                    display: totalNotificacoes > 0 ? 'block' : 'none',
                    background: produtosEstoqueBaixoCount > 0 ? '#ef4444' : '#f59e0b',
                  }}
                ></span>
              </button>
            )}

            {/* BOTÃO DO CARRINHO DE COMPRAS COM CONTADOR */}
            {temPermissaoOperador('vender', 'caixa') && (
              <button
                className="btn btn-carrinho-header"
                onClick={() => setModalCarrinhoVisivel(true)}
                title={`Ver Carrinho de Compras (${carrinho.reduce((a, b) => a + b.quantidade, 0)} itens)`}
                style={{
                  background: carrinho.length > 0 ? '#0f766e' : 'rgba(255, 255, 255, 0.18)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: carrinho.length > 0 ? '1.5px solid #2dd4bf' : '1px solid rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '1rem' }}>🛒</span>
                <span className="texto-carrinho-header" style={{ display: 'inline' }}>
                  Carrinho
                </span>
                {carrinho.length > 0 && (
                  <span
                    style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      padding: '2px 6px',
                      borderRadius: '10px',
                      marginLeft: '2px',
                      border: '1px solid #ffffff',
                    }}
                  >
                    {carrinho.reduce((a, b) => a + b.quantidade, 0)}
                  </span>
                )}
              </button>
            )}

            {/* BOTÃO DE DELIVERY (ZÉ DELIVERY) COM CONTADOR DE NOVOS */}
            <button
              className="btn btn-delivery-header"
              onClick={abrirGestaoDelivery}
              title={`Painel de Delivery (${pedidosDelivery.filter((p) => p.status === 'pendente').length} pedidos pendentes)`}
              style={{
                background: pedidosDelivery.some((p) => p.status === 'pendente') ? '#d97706' : '#78350f',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.82rem',
                padding: '7px 11px',
                borderRadius: '8px',
                border: '1.5px solid #f59e0b',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                position: 'relative',
                boxShadow: pedidosDelivery.some((p) => p.status === 'pendente') ? '0 0 10px rgba(245, 158, 11, 0.5)' : 'none',
              }}
            >
              <span style={{ fontSize: '1rem' }}>🛵</span>
              <span className="texto-delivery-header" style={{ display: 'inline' }}>
                Delivery
              </span>
              {pedidosDelivery.filter((p) => p.status === 'pendente').length > 0 && (
                <span
                  style={{
                    background: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    padding: '2px 6px',
                    borderRadius: '10px',
                    marginLeft: '2px',
                    border: '1px solid #ffffff',
                  }}
                >
                  {pedidosDelivery.filter((p) => p.status === 'pendente').length}
                </span>
              )}
            </button>

            {/* BOTÃO FIXAR / OCULTAR PAINEL DE DELIVERY NO CAIXA (ESTILO ATENDEJÁ) */}
            <button
              className="btn btn-coluna-delivery"
              onClick={() => {
                setColunaDeliveryFixaVisivel((prev) => {
                  const next = !prev;
                  localStorage.setItem('coluna_delivery_fixa_visivel', String(next));
                  return next;
                });
              }}
              title="Fixar/Ocultar coluna de Delivery no Caixa (AtendeJá)"
              style={{
                background: colunaDeliveryFixaVisivel ? '#7c3aed' : '#312e81',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.80rem',
                padding: '7px 10px',
                borderRadius: '8px',
                border: '1.5px solid #a855f7',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>🛵</span>
              <span>{colunaDeliveryFixaVisivel ? 'Painel Aberto' : 'Painel Lateral'}</span>
            </button>

            {/* BOTÃO CENTRAL DE RELATÓRIOS UNIFICADA */}
            {temPermissaoOperador('ver_relatorios', 'relatorios') && (
              <button
                className="btn btn-relatorios-header"
                onClick={() => abrirCentralRelatorios('faturamento')}
                title="Central de Relatórios & Lucro Real"
                style={{
                  background: '#065f46',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  padding: '7px 11px',
                  borderRadius: '8px',
                  border: '1.5px solid #10b981',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <span style={{ fontSize: '0.95rem' }}>📊</span>
                <span className="texto-relatorios-header" style={{ display: 'inline' }}>
                  Relatórios
                </span>
              </button>
            )}

            {(perfilAtivo === 'dona_app' || temPermissaoLoja('ocr_ia') || temPermissaoLoja('caixa') || temPermissaoLoja('estoque')) && (
              <button className="btn btn-cam" onClick={abrirLeitorGeral} title="Escanear Código">
                📷
              </button>
            )}
          </div>
        </div>
      </header>

      {/* SELETOR DE PERFIL E SESSÃO SEGURA */}
      <div className="seletor-perfil-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {perfilAtivo === 'dona_app' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ background: '#f3e8ff', color: '#7e22ce', padding: '4px 10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800, border: '1px solid #d8b4fe' }}>
                👑 Dona do App (Master)
              </span>
              <select
                className="select-perfil-header"
                value={supermercadoAtual}
                onChange={(e) => {
                  const lojaSel = listaSupermercados.find((l) => l.id === e.target.value);
                  if (lojaSel) alternarLojaAtiva(lojaSel);
                }}
                style={{ fontSize: '0.82rem', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}
                title="Alternar visualização de loja como Dono do App"
              >
                {listaSupermercados.map((l) => (
                  <option key={l.id} value={l.id}>
                    🏪 {l.nome} {l.status === 'bloqueado' ? '🚫 [BLOQUEADA]' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {perfilAtivo === 'admin_loja' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800, border: '1px solid #86efac' }}>
                🏢 Gerência / Dono: {nomeSupermercadoAtivo}
              </span>
            </div>
          )}

          {perfilAtivo === 'caixa' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800, border: '1px solid #7dd3fc' }}>
                🛒 {opAtualLogado ? `${opAtualLogado.nome} (${opAtualLogado.cargo})` : 'Operador de Caixa'} • {nomeSupermercadoAtivo}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            style={{
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
            title="Sair da sessão ou alternar usuário com login seguro"
          >
            <span>🚪</span>
            <span>Trocar / Sair</span>
          </button>
        </div>
      </div>

      {/* SIDEBAR (MENU DE TRÊS TRAÇOS COM ISOLAMENTO DE ACESSO) */}
      <div
        className="sidebar-overlay"
        id="sidebarOverlay"
        style={{
          display: menuAtivo ? 'block' : 'none',
          opacity: menuAtivo ? 1 : 0,
        }}
        onClick={fecharMenu}
      ></div>
      <div className={`sidebar ${menuAtivo ? 'ativo' : ''}`} id="sidebarMenu">
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
              }}
            >
              <Store size={20} strokeWidth={2.2} />
            </div>
            <div style={{ minWidth: 0 }}>
              <span
                id="labelSupermercadoAtivo"
                style={{
                  display: 'block',
                  fontWeight: 800,
                  fontSize: '0.96rem',
                  color: '#ffffff',
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {nomeSupermercadoAtivo}
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: isOnline ? '#34d399' : '#f87171',
                  background: isOnline ? 'rgba(16, 185, 129, 0.14)' : 'rgba(239, 68, 68, 0.16)',
                  border: isOnline ? '1px solid rgba(52, 211, 153, 0.25)' : '1px solid rgba(248, 113, 113, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  marginTop: '4px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isOnline ? '#10b981' : '#ef4444',
                    boxShadow: isOnline ? '0 0 6px #10b981' : '0 0 6px #ef4444',
                  }}
                />
                {isOnline ? 'Online • Sincronizado' : `Offline • Fila (${vendasPendentesCount})`}
              </span>
            </div>
          </div>
          <button className="sidebar-fechar" onClick={fecharMenu} title="Fechar menu">
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>

        <div className="sidebar-menu">
          {/* 1. CAIXA & VENDAS */}
          {(temPermissaoOperador('gestao_caixa', 'gestao_caixa') ||
            temPermissaoOperador('gerenciar_devedores', 'devedores') ||
            temPermissaoOperador('ver_relatorios', 'relatorios')) && (
            <div
              style={{
                flexShrink: 0,
                border: grupoMenuAberto === 'caixa' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                borderRadius: '14px',
                overflow: 'hidden',
                background: '#ffffff',
                boxShadow:
                  grupoMenuAberto === 'caixa'
                    ? '0 4px 14px -2px rgba(37, 99, 235, 0.08)'
                    : '0 1px 2px rgba(15, 23, 42, 0.03)',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                onClick={() => alternarGrupoMenu('caixa')}
                style={{
                  padding: '11px 12px',
                  background: grupoMenuAberto === 'caixa' ? '#eff6ff' : '#ffffff',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background: grupoMenuAberto === 'caixa' ? '#2563eb' : '#eff6ff',
                      color: grupoMenuAberto === 'caixa' ? '#ffffff' : '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Wallet size={17} strokeWidth={2.2} />
                  </div>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      color: '#0f172a',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Caixa & Vendas
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                  {temPermissaoOperador('gestao_caixa', 'gestao_caixa') && (
                    <span
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '9999px',
                        whiteSpace: 'nowrap',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background:
                          !sessaoCaixaAtiva || sessaoCaixaAtiva.status === 'fechado' ? '#fff1f2' : '#ecfdf5',
                        color:
                          !sessaoCaixaAtiva || sessaoCaixaAtiva.status === 'fechado' ? '#e11d48' : '#059669',
                        border:
                          !sessaoCaixaAtiva || sessaoCaixaAtiva.status === 'fechado'
                            ? '1px solid #ffe4e6'
                            : '1px solid #d1fae5',
                      }}
                    >
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background:
                            !sessaoCaixaAtiva || sessaoCaixaAtiva.status === 'fechado' ? '#e11d48' : '#10b981',
                        }}
                      />
                      {!sessaoCaixaAtiva || sessaoCaixaAtiva.status === 'fechado' ? 'Fechado' : 'Aberto'}
                    </span>
                  )}
                  {temPermissaoOperador('gerenciar_devedores', 'devedores') &&
                    clientesDevedores.filter((c) => c.saldoDevedorTotal > 0).length > 0 && (
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '9999px',
                          whiteSpace: 'nowrap',
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                        }}
                        title="Clientes com saldo devedor no fiado"
                      >
                        {clientesDevedores.filter((c) => c.saldoDevedorTotal > 0).length}
                      </span>
                    )}
                  <ChevronDown
                    size={16}
                    style={{
                      color: '#64748b',
                      transform: grupoMenuAberto === 'caixa' ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </div>
              </div>

              {grupoMenuAberto === 'caixa' && (
                <div
                  style={{
                    padding: '8px 10px 10px 10px',
                    background: '#f8fafc',
                    borderTop: '1px solid #dbeafe',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  {temPermissaoOperador('gestao_caixa', 'gestao_caixa') && (
                    <div
                      className="sidebar-item"
                      onClick={() => {
                        setModalCaixaVisivel(true);
                        fecharMenu();
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <DollarSign size={15} style={{ color: '#2563eb', flexShrink: 0 }} />
                        <span>Gestão de Caixa & Turno</span>
                      </span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '6px',
                          whiteSpace: 'nowrap',
                          background:
                            !sessaoCaixaAtiva || sessaoCaixaAtiva.status === 'fechado' ? '#ffe4e6' : '#d1fae5',
                          color:
                            !sessaoCaixaAtiva || sessaoCaixaAtiva.status === 'fechado' ? '#be123c' : '#047857',
                        }}
                      >
                        {!sessaoCaixaAtiva || sessaoCaixaAtiva.status === 'fechado' ? 'Fechado' : 'Aberto'}
                      </span>
                    </div>
                  )}

                  {temPermissaoOperador('gerenciar_devedores', 'devedores') && (
                    <div
                      className="sidebar-item"
                      onClick={() => {
                        setModalDevedoresVisivel(true);
                        fecharMenu();
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={15} style={{ color: '#e11d48', flexShrink: 0 }} />
                        <span>Devedores / Fiado</span>
                      </span>
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '6px',
                          whiteSpace: 'nowrap',
                          background: '#fff1f2',
                          color: '#be123c',
                        }}
                      >
                        {clientesDevedores.filter((c) => c.saldoDevedorTotal > 0).length} ativos
                      </span>
                    </div>
                  )}

                  {temPermissaoOperador('ver_relatorios', 'relatorios') && (
                    <div
                      className="sidebar-item"
                      onClick={() => {
                        abrirRelatorioVendas();
                        fecharMenu();
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Receipt size={15} style={{ color: '#64748b', flexShrink: 0 }} />
                        <span>Histórico de Vendas & Cupons</span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 2. ESTOQUE & PRODUTOS */}
          {(temPermissaoOperador('cadastrar_produtos', 'estoque') ||
            temPermissaoOperador('ver_relatorios', 'relatorios') ||
            temPermissaoOperador('imprimir_etiquetas', 'etiquetas') ||
            temPermissaoOperador('catalogo_global', 'catalogo_global') ||
            perfilAtivo === 'dona_app') && (
            <div
              style={{
                flexShrink: 0,
                border: grupoMenuAberto === 'estoque' ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                borderRadius: '14px',
                overflow: 'hidden',
                background: '#ffffff',
                boxShadow:
                  grupoMenuAberto === 'estoque'
                    ? '0 4px 14px -2px rgba(16, 185, 129, 0.08)'
                    : '0 1px 2px rgba(15, 23, 42, 0.03)',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                onClick={() => alternarGrupoMenu('estoque')}
                style={{
                  padding: '11px 12px',
                  background: grupoMenuAberto === 'estoque' ? '#ecfdf5' : '#ffffff',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background: grupoMenuAberto === 'estoque' ? '#059669' : '#ecfdf5',
                      color: grupoMenuAberto === 'estoque' ? '#ffffff' : '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Package size={17} strokeWidth={2.2} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a', whiteSpace: 'nowrap' }}>
                    Estoque & Produtos
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  style={{
                    color: '#64748b',
                    transform: grupoMenuAberto === 'estoque' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </div>

              {grupoMenuAberto === 'estoque' && (
                <div
                  style={{
                    padding: '8px 10px 10px 10px',
                    background: '#f8fafc',
                    borderTop: '1px solid #a7f3d0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  {temPermissaoOperador('cadastrar_produtos', 'estoque') && (
                    <div
                      className="sidebar-item"
                      style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }}
                      onClick={() => {
                        abrirCadastro('estoque');
                        fecharMenu();
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PlusCircle size={15} style={{ color: '#059669', flexShrink: 0 }} />
                        <span>Adicionar Item ao Estoque</span>
                      </span>
                    </div>
                  )}

                  {(temPermissaoOperador('ver_relatorios', 'relatorios') ||
                    temPermissaoOperador('cadastrar_produtos', 'estoque')) && (
                    <div
                      className="sidebar-item"
                      onClick={() => {
                        abrirRelatorio();
                        fecharMenu();
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Layers size={15} style={{ color: '#059669', flexShrink: 0 }} />
                        <span>Posição de Estoque & Validades</span>
                      </span>
                    </div>
                  )}

                  {temPermissaoOperador('imprimir_etiquetas', 'etiquetas') && (
                    <div
                      className="sidebar-item"
                      onClick={() => {
                        setModalEtiquetasVisivel(true);
                        fecharMenu();
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Tag size={15} style={{ color: '#64748b', flexShrink: 0 }} />
                        <span>Etiquetas de Prateleira</span>
                      </span>
                    </div>
                  )}

                  {perfilAtivo === 'dona_app' && (
                    <div
                      style={{
                        padding: '10px 14px',
                        margin: '4px 8px',
                        borderRadius: '10px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      title="Quantidade total de produtos cadastrados no banco de dados central"
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                        <Database size={15} style={{ color: '#0284c7', flexShrink: 0 }} />
                        <span>Produtos no Banco:</span>
                      </span>
                      <span
                        style={{
                          background: '#e0f2fe',
                          color: '#0369a1',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '12px',
                        }}
                      >
                        {totalProdutosCadastrados} itens
                      </span>
                    </div>
                  )}

                  {perfilAtivo === 'dona_app' && (
                    <div
                      className="sidebar-item"
                      onClick={() => {
                        abrirCadastro('master');
                        fecharMenu();
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Crown size={15} style={{ color: '#0284c7', flexShrink: 0 }} />
                        <span>Cadastrar no Banco Master</span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 3. DELIVERY */}
          <div
            style={{
              flexShrink: 0,
              border: grupoMenuAberto === 'delivery' ? '1px solid #fcd34d' : '1px solid #e2e8f0',
              borderRadius: '14px',
              overflow: 'hidden',
              background: '#ffffff',
              boxShadow:
                grupoMenuAberto === 'delivery'
                  ? '0 4px 14px -2px rgba(245, 158, 11, 0.1)'
                  : '0 1px 2px rgba(15, 23, 42, 0.03)',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              onClick={() => alternarGrupoMenu('delivery')}
              style={{
                padding: '11px 12px',
                background: grupoMenuAberto === 'delivery' ? '#fffbeb' : '#ffffff',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: grupoMenuAberto === 'delivery' ? '#d97706' : '#fffbeb',
                    color: grupoMenuAberto === 'delivery' ? '#ffffff' : '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Bike size={17} strokeWidth={2.2} />
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a', whiteSpace: 'nowrap' }}>
                  Delivery
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                {pedidosDelivery.filter((p) => p.status === 'pendente').length > 0 && (
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: '#ffffff',
                      borderRadius: '9999px',
                      padding: '2px 8px',
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 6px rgba(239, 68, 68, 0.35)',
                    }}
                  >
                    {pedidosDelivery.filter((p) => p.status === 'pendente').length} NOVO
                  </span>
                )}
                <ChevronDown
                  size={16}
                  style={{
                    color: '#64748b',
                    transform: grupoMenuAberto === 'delivery' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </div>
            </div>

            {grupoMenuAberto === 'delivery' && (
              <div
                style={{
                  padding: '8px 10px 10px 10px',
                  background: '#f8fafc',
                  borderTop: '1px solid #fde68a',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div
                  className="sidebar-item"
                  style={{ background: '#fffbeb', color: '#92400e', border: '1px solid #fcd34d' }}
                  onClick={() => {
                    setColunaDeliveryFixaVisivel(true);
                    abrirGestaoDelivery();
                    fecharMenu();
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bike size={15} style={{ color: '#d97706', flexShrink: 0 }} />
                    <span>Painel de Pedidos</span>
                  </span>
                  {pedidosDelivery.filter((p) => p.status === 'pendente').length > 0 && (
                    <span
                      style={{
                        background: '#ef4444',
                        color: '#ffffff',
                        borderRadius: '9999px',
                        padding: '1px 7px',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {pedidosDelivery.filter((p) => p.status === 'pendente').length} NOVO
                    </span>
                  )}
                </div>

                <div
                  className="sidebar-item"
                  onClick={() => {
                    abrirCardapioCliente();
                    fecharMenu();
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoppingBag size={15} style={{ color: '#d97706', flexShrink: 0 }} />
                    <span>Ver Cardápio do Cliente</span>
                  </span>
                </div>

                <div
                  className="sidebar-item"
                  style={
                    linkCardapioCopiadoMenu
                      ? { background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }
                      : undefined
                  }
                  onClick={() => {
                    const slug = lojaAtualObj?.slug || lojaAtualObj?.id || supermercadoAtual || 'loja_matriz_01';
                    let url = `${window.location.origin}/?loja=${slug}`;
                    if (lojaAtualObj?.marca) url += `&marca=${encodeURIComponent(lojaAtualObj.marca)}`;
                    if (lojaAtualObj?.nome) url += `&nome=${encodeURIComponent(lojaAtualObj.nome)}`;
                    navigator.clipboard.writeText(url);
                    setLinkCardapioCopiadoMenu(true);
                    setTimeout(() => setLinkCardapioCopiadoMenu(false), 2500);
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {linkCardapioCopiadoMenu ? (
                      <Check size={15} style={{ color: '#059669', flexShrink: 0 }} />
                    ) : (
                      <Link2 size={15} style={{ color: '#64748b', flexShrink: 0 }} />
                    )}
                    <span>{linkCardapioCopiadoMenu ? 'Link Copiado!' : 'Copiar Link do Cardápio'}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 4. RELATÓRIOS */}
          {(temPermissaoOperador('ver_relatorios', 'relatorios') ||
            temPermissaoOperador('ver_graficos', 'graficos')) && (
            <div
              style={{
                flexShrink: 0,
                border: grupoMenuAberto === 'relatorios' ? '1px solid #ddd6fe' : '1px solid #e2e8f0',
                borderRadius: '14px',
                overflow: 'hidden',
                background: '#ffffff',
                boxShadow:
                  grupoMenuAberto === 'relatorios'
                    ? '0 4px 14px -2px rgba(124, 58, 237, 0.08)'
                    : '0 1px 2px rgba(15, 23, 42, 0.03)',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                onClick={() => alternarGrupoMenu('relatorios')}
                style={{
                  padding: '11px 12px',
                  background: grupoMenuAberto === 'relatorios' ? '#f5f3ff' : '#ffffff',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background: grupoMenuAberto === 'relatorios' ? '#7c3aed' : '#f5f3ff',
                      color: grupoMenuAberto === 'relatorios' ? '#ffffff' : '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <BarChart3 size={17} strokeWidth={2.2} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a', whiteSpace: 'nowrap' }}>
                    Relatórios
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  style={{
                    color: '#64748b',
                    transform: grupoMenuAberto === 'relatorios' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </div>

              {grupoMenuAberto === 'relatorios' && (
                <div
                  style={{
                    padding: '8px 10px 10px 10px',
                    background: '#f8fafc',
                    borderTop: '1px solid #ddd6fe',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  {temPermissaoOperador('ver_relatorios', 'relatorios') && (
                    <div
                      className="sidebar-item"
                      style={{ background: '#f5f3ff', color: '#5b21b6', border: '1px solid #ddd6fe' }}
                      onClick={() => {
                        abrirCentralRelatorios('faturamento');
                        fecharMenu();
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PieChart size={15} style={{ color: '#7c3aed', flexShrink: 0 }} />
                        <span>Central de Relatórios & Lucro</span>
                      </span>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '6px',
                          background: '#ede9fe',
                          color: '#6d28d9',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Hub
                      </span>
                    </div>
                  )}

                  {temPermissaoOperador('ver_graficos', 'graficos') && (
                    <div
                      className="sidebar-item"
                      onClick={() => {
                        abrirGraficosVendas();
                        fecharMenu();
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={15} style={{ color: '#7c3aed', flexShrink: 0 }} />
                        <span>Gráficos de Faturamento</span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 5. CONFIGURAÇÕES & EQUIPE */}
          <div
            style={{
              flexShrink: 0,
              border: grupoMenuAberto === 'config' ? '1px solid #cbd5e1' : '1px solid #e2e8f0',
              borderRadius: '14px',
              overflow: 'hidden',
              background: '#ffffff',
              boxShadow:
                grupoMenuAberto === 'config'
                  ? '0 4px 14px -2px rgba(15, 23, 42, 0.06)'
                  : '0 1px 2px rgba(15, 23, 42, 0.03)',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              onClick={() => alternarGrupoMenu('config')}
              style={{
                padding: '11px 12px',
                background: grupoMenuAberto === 'config' ? '#f1f5f9' : '#ffffff',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: grupoMenuAberto === 'config' ? '#334155' : '#f1f5f9',
                    color: grupoMenuAberto === 'config' ? '#ffffff' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Settings size={17} strokeWidth={2.2} />
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a', whiteSpace: 'nowrap' }}>
                  Configurações & Equipe
                </span>
              </div>
              <ChevronDown
                size={16}
                style={{
                  color: '#64748b',
                  transform: grupoMenuAberto === 'config' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </div>

            {grupoMenuAberto === 'config' && (
              <div
                style={{
                  padding: '8px 10px 10px 10px',
                  background: '#f8fafc',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {temPermissaoOperador('gerenciar_equipe', 'usuarios') && (
                  <div
                    className="sidebar-item"
                    onClick={() => {
                      abrirModalOperadores();
                      fecharMenu();
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={15} style={{ color: '#475569', flexShrink: 0 }} />
                      <span>Caixas & Permissões</span>
                    </span>
                  </div>
                )}

                {perfilAtivo === 'dona_app' && (
                  <div
                    className="sidebar-item"
                    onClick={() => {
                      abrirModalSupermercado();
                      fecharMenu();
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building2 size={15} style={{ color: '#475569', flexShrink: 0 }} />
                      <span>Gerenciar Lojas (Dona)</span>
                    </span>
                  </div>
                )}

                {perfilAtivo === 'dona_app' && (
                  <div
                    className="sidebar-item"
                    onClick={() => {
                      setModalCredenciaisDonoVisivel(true);
                      fecharMenu();
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <KeyRound size={15} style={{ color: '#9333ea', flexShrink: 0 }} />
                      <span>Alterar Login / Senha Master</span>
                    </span>
                  </div>
                )}

                {temPermissaoOperador('alertas_whatsapp', 'alertas_whatsapp') && (
                  <div
                    className="sidebar-item"
                    onClick={() => {
                      setModalAlertasWhatsAppVisivel(true);
                      fecharMenu();
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BellRing size={15} style={{ color: '#16a34a', flexShrink: 0 }} />
                      <span>Alertas WhatsApp</span>
                    </span>
                  </div>
                )}

                {temPermissaoOperador('ver_manual_usuario', 'manual_ajuda') && (
                  <div
                    className="sidebar-item"
                    style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
                    onClick={() => {
                      setModalManualVisivel(true);
                      fecharMenu();
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BookOpen size={15} style={{ color: '#2563eb', flexShrink: 0 }} />
                      <span>Tutorial & Manual do Aplicativo</span>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RODAPÉ FIXO DO MENU LATERAL */}
        <div
          style={{
            padding: '12px',
            borderTop: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          {vendasPendentesCount > 0 && (
            <div
              className="sidebar-item"
              style={{
                fontWeight: 700,
                background: '#fffbeb',
                color: '#92400e',
                border: '1px solid #fde68a',
                borderRadius: '11px',
                justifyContent: 'center',
              }}
              onClick={async () => {
                const res = await sincronizarFilaOfflinePrioritaria();
                setFilaOfflineStats(obterEstatisticasFilaOffline());
                setVendasPendentesCount(obterEstatisticasFilaOffline().total);
                alert(`⚡ Sincronização Concluída!\n\n${res.sincronizados} registros prioritários gravados no Firestore.`);
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} style={{ color: '#d97706' }} />
                <span>Sincronizar Fila ({vendasPendentesCount})</span>
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              fecharMenu();
              handleLogout();
            }}
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: '12px',
              background: '#fff1f2',
              color: '#e11d48',
              border: '1px solid #ffe4e6',
              fontWeight: 700,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <LogOut size={16} strokeWidth={2.2} />
            <span>Sair da Conta / Trocar Usuário</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="espaco-topo">
        {isLojaBloqueadaPeloDono && perfilAtivo !== 'dona_app' ? (
          <div style={{ maxWidth: '600px', margin: '30px auto', padding: '16px' }}>
            <div
              style={{
                background: '#fef2f2',
                border: '2px solid #ef4444',
                borderRadius: '16px',
                padding: '32px 24px',
                textAlign: 'center',
                boxShadow: '0 10px 25px rgba(239, 68, 68, 0.15)',
              }}
            >
              <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🛑</div>
              <h2 style={{ color: '#991b1b', fontSize: '1.35rem', fontWeight: 800, marginBottom: '8px' }}>
                Acesso do Supermercado Suspenso
              </h2>
              <p style={{ color: '#7f1d1d', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '14px' }}>
                O supermercado <b>{nomeSupermercadoAtivo}</b> está temporariamente bloqueado pela <b>Dona do Aplicativo</b>.
              </p>
              {lojaAtualObj?.motivoBloqueio && (
                <div
                  style={{
                    background: '#fff',
                    border: '1px dashed #f87171',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#b91c1c',
                    fontSize: '0.88rem',
                    marginBottom: '20px',
                    textAlign: 'left',
                  }}
                >
                  <b>Motivo informado pelo Dono do App:</b>
                  <div style={{ marginTop: '4px', color: '#7f1d1d' }}>{lojaAtualObj.motivoBloqueio}</div>
                </div>
              )}
              <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '22px' }}>
                Por segurança, os módulos e acessos de equipe foram pausados para este supermercado.
              </p>
              <button
                type="button"
                className="btn"
                style={{
                  background: '#dc2626',
                  color: '#fff',
                  padding: '12px 24px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.92rem',
                }}
                onClick={handleLogout}
              >
                🚪 Sair / Trocar de Usuário
              </button>
            </div>
          </div>
        ) : perfilAtivo === 'caixa' && opAtualLogado && opAtualLogado.ativo === false ? (
          <div style={{ maxWidth: '600px', margin: '30px auto', padding: '16px' }}>
            <div
              style={{
                background: '#fef2f2',
                border: '2px solid #ef4444',
                borderRadius: '16px',
                padding: '32px 24px',
                textAlign: 'center',
                boxShadow: '0 10px 25px rgba(239, 68, 68, 0.15)',
              }}
            >
              <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🚫</div>
              <h2 style={{ color: '#991b1b', fontSize: '1.35rem', fontWeight: 800, marginBottom: '8px' }}>
                Acesso de Funcionário Desativado
              </h2>
              <p style={{ color: '#7f1d1d', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '20px' }}>
                Seu cadastro de operador (<b>{opAtualLogado.nome}</b>) foi inativado ou bloqueado pelo Administrador do <b>{nomeSupermercadoAtivo}</b>.
              </p>
              <button
                type="button"
                className="btn"
                style={{
                  background: '#dc2626',
                  color: '#fff',
                  padding: '12px 24px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.92rem',
                }}
                onClick={handleLogout}
              >
                🚪 Sair / Trocar de Usuário
              </button>
            </div>
          </div>
        ) : perfilAtivo !== 'dona_app' && !temPermissaoLoja('caixa') && !temPermissaoLoja('estoque') && !temPermissaoLoja('relatorios') && !temPermissaoLoja('usuarios') ? (
          <div style={{ maxWidth: '640px', margin: '40px auto', padding: '16px' }}>
            <div
              style={{
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '16px',
                padding: '36px 28px',
                textAlign: 'center',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.06)',
              }}
            >
              <div style={{ fontSize: '3.5rem', marginBottom: '14px' }}>📜</div>
              <h2 style={{ color: '#1e293b', fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
                Portal do Supermercado: {nomeSupermercadoAtivo}
              </h2>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '18px' }}>
                Os módulos operacionais (PDV, Estoque, Caixas e Relatórios) estão desabilitados pela Dona do Aplicativo para este cadastro.
              </p>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '24px',
                  textAlign: 'left',
                  fontSize: '0.88rem',
                  color: '#334155',
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '6px', color: '#0f172a' }}>
                  ✅ Acesso Autorizado ao Termo de Sigilo & Concordância:
                </div>
                <div>Você pode consultar e verificar o termo de sigilo, confidencialidade e regras de segurança a qualquer momento.</div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn"
                  style={{
                    background: '#0284c7',
                    color: '#fff',
                    padding: '12px 20px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.92rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  onClick={() => {
                    setTermoApenasLeitura(true);
                    setModalTermoVisivel(true);
                  }}
                >
                  <span>📜</span>
                  <span>Ver Termo de Sigilo & Concordância</span>
                </button>

                <button
                  type="button"
                  className="btn"
                  style={{
                    background: '#f1f5f9',
                    color: '#334155',
                    padding: '12px 20px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    cursor: 'pointer',
                    fontSize: '0.92rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  onClick={handleLogout}
                >
                  <span>🚪</span>
                  <span>Sair da Conta</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="painel-alertas" id="painel-alertas">
              {vencidosOuHoje.length > 0 && (
                <div className="alerta alerta-erro" onClick={() => abrirNotificacoes('validade')}>
                  ❌ {vencidosOuHoje.length} produto(s) vencido(s) ou a vencer hoje. Toque para ver.
                </div>
              )}
            </div>

            {/* CONTAINER PRINCIPAL CAIXA PDV & COLUNA DELIVERY (ESTILO ATENDEJÁ) */}
            <div
              className="layout-caixa-delivery-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: colunaDeliveryFixaVisivel ? 'minmax(0, 1fr) 465px' : 'minmax(0, 1fr)',
                gap: '16px',
                alignItems: 'start',
              }}
            >
              <div style={{ minWidth: 0 }}>
                {/* Quick Filter Pill Buttons */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0 16px 10px 16px',
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
              <button
                type="button"
                onClick={() => setFiltroTipoProduto('todos')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: filtroTipoProduto === 'todos' ? '#0f172a' : '#f1f5f9',
                  color: filtroTipoProduto === 'todos' ? '#ffffff' : '#475569',
                  whiteSpace: 'nowrap',
                  boxShadow: filtroTipoProduto === 'todos' ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                📦 Todos ({estoque.length})
              </button>

              <button
                type="button"
                onClick={() => setFiltroTipoProduto('interno')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: filtroTipoProduto === 'interno' ? '#d97706' : '#fef3c7',
                  color: filtroTipoProduto === 'interno' ? '#ffffff' : '#92400e',
                  whiteSpace: 'nowrap',
                  boxShadow: filtroTipoProduto === 'interno' ? '0 2px 4px rgba(217,119,6,0.3)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                🍢 Balcão & Adega ({countInternos})
              </button>

              <button
                type="button"
                onClick={() => setFiltroTipoProduto('padrao')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: filtroTipoProduto === 'padrao' ? '#0284c7' : '#e0f2fe',
                  color: filtroTipoProduto === 'padrao' ? '#ffffff' : '#0369a1',
                  whiteSpace: 'nowrap',
                  boxShadow: filtroTipoProduto === 'padrao' ? '0 2px 4px rgba(2,132,199,0.3)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                🏷️ Industrial / EAN ({countPadrao})
              </button>
            </div>

            <div className="grid-produtos" id="grid-produtos">
              {listaAgrupada.length === 0 ? (
                <div className="vazio">
                  {filtroTipoProduto === 'interno'
                    ? 'Nenhum produto interno/balcão cadastrado nesta loja. Toque em "+ Balcão" para cadastrar espetinhos, doses ou itens sem código de barras.'
                    : 'Nenhum produto cadastrado no estoque desta loja.'}
                </div>
              ) : (
                listaAgrupada.map((p, pIdx) => {
                  const loteValido =
                    p.lotes.find((l) => {
                      const dt = new Date(l.validade + 'T00:00:00');
                      return dt.getTime() > hoje.getTime() && l.qtd > 0;
                    }) ||
                    p.lotes.find((l) => l.qtd > 0) ||
                    p.lotes[0];

                  const primeiraValidade = loteValido?.validade || p.lotes[0]?.validade || '';
                  const primeiroLote = loteValido?.lote || p.lotes[0]?.lote || '';
                  const fotoCard = obterFotoProduto(p.codigo, p.foto);
                  const itemCompleto = estoque.find(
                    (it) => it.codigo === p.codigo && it.validade === primeiraValidade && it.lote === primeiroLote
                  ) || estoque.find((it) => it.codigo === p.codigo);
                  const isInternoCard = p.tipoCadastro === 'interno' || itemCompleto?.tipoCadastro === 'interno' || p.estoqueIlimitado;
                  const qtdNoCarrinho = carrinho
                    .filter((c) => c.codigo === p.codigo)
                    .reduce((acc, c) => acc + c.quantidade, 0);

                  return (
                    <div className="card-produto" key={`card_${p.codigo || pIdx}_${pIdx}`}>
                      <div
                        className="foto-produto"
                        onClick={() => abrirVenda(p.codigo, primeiraValidade, primeiroLote)}
                      >
                        {fotoCard ? (
                          <img
                            src={fotoCard}
                            alt={p.nome}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          'Sem imagem'
                        )}
                        {isInternoCard && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '6px',
                              left: '6px',
                              background: '#d97706',
                              color: '#fff',
                              borderRadius: '6px',
                              padding: '2px 6px',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            }}
                          >
                            🍢 Adega
                          </div>
                        )}
                        {qtdNoCarrinho > 0 && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '6px',
                              right: '6px',
                              background: '#16a34a',
                              color: '#fff',
                              borderRadius: '12px',
                              padding: '2px 7px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            }}
                          >
                            🛒 {qtdNoCarrinho} no carrinho
                          </div>
                        )}
                      </div>
                      <div className="info-card">
                        <div>
                          <div
                            className="nome-prod"
                            onClick={() => abrirVenda(p.codigo, primeiraValidade, primeiroLote)}
                          >
                            {p.nome}
                          </div>
                          <div className="detalhe" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>Cód: {p.codigo}</span>
                            {isInternoCard && (
                              <span
                                style={{
                                  background: '#fef3c7',
                                  color: '#92400e',
                                  borderRadius: '4px',
                                  padding: '1px 4px',
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                }}
                              >
                                Interno
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ marginTop: '4px' }}>
                          <div className="detalhe">
                            {isInternoCard ? (
                              <span style={{ color: '#059669', fontWeight: 700 }}>
                                ♾️ Produção Contínua (Balcão)
                              </span>
                            ) : (
                              <>
                                Estoque Total: <b>{p.qtdTotal} un</b>
                              </>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                            <div className="detalhe preco-destaque">R$ {Number(p.preco_venda || 0).toFixed(2)}</div>
                            {itemCompleto && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  adicionarAoCarrinho(itemCompleto, 1);
                                }}
                                title="Adicionar 1 unidade ao Carrinho de Vendas"
                                style={{
                                  background: '#e0f2fe',
                                  color: '#0369a1',
                                  border: '1px solid #7dd3fc',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  fontSize: '0.76rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                }}
                              >
                                <span>🛒</span>
                                <span>+ Carrinho</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
              </div>

              {/* COLUNA FIXA DE PEDIDOS DO DELIVERY (ESTILO ATENDEJÁ CAIXAVIEW) */}
              {colunaDeliveryFixaVisivel && (
                <div
                  className="coluna-delivery-fixa-lateral"
                  style={{
                    position: 'sticky',
                    top: '75px',
                    zIndex: 10,
                  }}
                >
                  <CaixaDeliveryPanel
                    pedidos={pedidosDelivery}
                    loja={listaSupermercados.find((l) => l.id === supermercadoAtual) || listaSupermercados[0] || null}
                    onAtualizarStatus={handleAtualizarStatusPedidoDelivery}
                    onConfirmarEntregaPin={handleConfirmarEntregaPin}
                    onAbrirCardapioCliente={() => setModalCardapioClienteVisivel(true)}
                    onImprimirComanda={(pedido) => {
                      const novaVendaSimulada: Venda = {
                        id: `ven_del_${pedido.numeroPedido}`,
                        pedidoDeliveryId: pedido.id,
                        numeroVenda: pedido.numeroPedido,
                        data: pedido.data,
                        hora: pedido.hora,
                        timestamp: pedido.timestamp,
                        itens: pedido.itens.map((it) => ({
                          codigo: it.codigo,
                          nome: it.nome,
                          quantidade: it.quantidade,
                          preco_unitario: it.preco_unitario,
                          preco_custo: it.preco_custo,
                          subtotal: it.subtotal,
                        })),
                        subtotal: pedido.subtotal,
                        desconto: 0,
                        acrescimo: pedido.taxaEntrega,
                        total: pedido.valorTotal,
                        formaPagamento: pedido.formaPagamento === 'pix' ? 'pix' : pedido.formaPagamento === 'dinheiro' ? 'dinheiro' : 'cartao',
                        valorRecebido: pedido.trocoPara || pedido.valorTotal,
                        troco: pedido.trocoPara ? Math.max(0, pedido.trocoPara - pedido.valorTotal) : 0,
                        status: 'concluida',
                        lojaId: pedido.lojaId,
                        operadorId: operadorAtivoId || 'caixa_delivery',
                        origem: 'delivery',
                      };
                      setVendaCupomVer(novaVendaSimulada);
                    }}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* FULL REPORT SCREEN */}
      <div
        className="tela-relatorio-cheia"
        id="telaRelatorioCheia"
        style={{ display: relatorioCheioVisivel ? 'flex' : 'none' }}
      >
        <div className="cabecalho-relatorio">
          <h2 id="tituloRelatorioCheio">
            Relatório de Estoque ({nomeSupermercadoAtivo})
          </h2>
          <button className="btn-voltar-rel" onClick={fecharRelatorio}>
            Voltar
          </button>
        </div>
        <div className="corpo-relatorio-cheio">
          {modoRelatorioAtual === 'estoque' && (() => {
            const hojeIso = new Date().toISOString().split('T')[0];
            const ehIlimitado = (i: ItemEstoque) => {
              if (!i) return false;
              if (i.estoqueIlimitado === true) return true;
              if (i.tipoCadastro === 'interno') return true;
              const qtd = Number(i.quantidade) || 0;
              if (qtd >= 99990) return true;
              const cat = (i.categoria || '').toLowerCase();
              if ((cat.includes('balcão') || cat.includes('balcao') || cat.includes('interno')) && qtd >= 9000) return true;
              return false;
            };

            const estoqueFisico = estoque.filter((i) => !ehIlimitado(i));
            const itensBalcao = estoque.filter((i) => ehIlimitado(i));

            const totalItensQtd = estoqueFisico.reduce((acc, i) => acc + (Number(i.quantidade) || 0), 0);
            const totalValorVenda = estoqueFisico.reduce((acc, i) => acc + ((Number(i.quantidade) || 0) * (Number(i.preco_venda) || 0)), 0);
            const totalValorCusto = estoqueFisico.reduce((acc, i) => acc + ((Number(i.quantidade) || 0) * (Number(i.preco_custo) || (Number(i.preco_venda) || 0) * 0.7)), 0);
            const itensVencidos = estoqueFisico.filter((i) => i.validade && i.validade < hojeIso);
            const itensBaixo = estoqueFisico.filter((i) => (Number(i.quantidade) || 0) <= 5);

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {/* KPIS DE ESTOQUE */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Total de Peças (Físico)</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                      {totalItensQtd} <small style={{ fontSize: '0.75rem', fontWeight: 400 }}>unid.</small>
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Valor de Venda (Físico)</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#16a34a' }}>
                      R$ {totalValorVenda.toFixed(2).replace('.', ',')}
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Custo Estimado (Físico)</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0284c7' }}>
                      R$ {totalValorCusto.toFixed(2).replace('.', ',')}
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Balcão / Sob Demanda</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#8b5cf6' }}>
                      {itensBalcao.length} <small style={{ fontSize: '0.75rem' }}>cadastrados</small>
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Alertas de Validade / Qtd</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: itensVencidos.length > 0 ? '#dc2626' : '#d97706' }}>
                      {itensVencidos.length} <small style={{ fontSize: '0.75rem' }}>vencidos</small> / {itensBaixo.length} <small style={{ fontSize: '0.75rem' }}>baixos</small>
                    </div>
                  </div>
                </div>

                {/* FILTROS E AÇÕES DE ESTOQUE */}
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <div className="linha-input" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
                      <input
                        type="search"
                        id="buscaRelatorio"
                        name="search_query_relatorio_estoque"
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        data-form-type="other"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        className="input-modal"
                        style={{ marginBottom: 0 }}
                        placeholder="Pesquisar por nome ou código..."
                        value={buscaRelatorio.toLowerCase().includes('rodrigo.souza') ? '' : buscaRelatorio}
                        onChange={(e) => {
                          const v = e.target.value;
                          setBuscaRelatorio(v.toLowerCase().includes('rodrigo.souza') ? '' : v);
                        }}
                      />
                      <button className="btn-cam-pequeno" onClick={abrirLeitorRelatorio} title="Escanear Código no Relatório">
                        📷
                      </button>
                    </div>

                    <select
                      className="input-modal"
                      value={filtroStatusEstoque}
                      onChange={(e) => setFiltroStatusEstoque(e.target.value as any)}
                      style={{ width: 'auto', minWidth: '130px', marginBottom: 0 }}
                    >
                      <option value="todos">Status: Todos</option>
                      <option value="vencidos">🚨 Apenas Vencidos</option>
                      <option value="vencendo30">⚠️ Vencem em 30 dias</option>
                      <option value="baixo">📉 Estoque Baixo (≤5)</option>
                    </select>

                    <select
                      className="input-modal"
                      value={ordenacaoEstoque}
                      onChange={(e) => setOrdenacaoEstoque(e.target.value as any)}
                      style={{ width: 'auto', minWidth: '140px', marginBottom: 0 }}
                    >
                      <option value="nome">Ordenar: Nome (A-Z)</option>
                      <option value="validade">Ordenar: Validade Próxima</option>
                      <option value="maior_preco">Ordenar: Maior Preço</option>
                      <option value="menor_preco">Ordenar: Menor Preço</option>
                      <option value="maior_qtd">Ordenar: Maior Quantidade</option>
                      <option value="menor_qtd">Ordenar: Menor Quantidade</option>
                    </select>

                    <button
                      className="btn btn-salvar"
                      style={{ padding: '6px 12px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => exportarEstoqueCSV(estoque, nomeSupermercadoAtivo)}
                    >
                      📥 Exportar CSV
                    </button>

                    <button
                      className="btn"
                      style={{ background: '#4f46e5', color: '#fff', padding: '6px 12px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => setModalEtiquetasVisivel(true)}
                    >
                      🏷️ Imprimir Etiquetas
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="tabela-relatorio" id="listaRelatorioCheio">
            {
              (() => {
                const t = buscaRelatorio.trim().toLowerCase();
                const hojeStr = new Date().toISOString().split('T')[0];

                let lista = estoque.filter((p) => {
                  const matchBusca = p.codigo.toLowerCase().includes(t) || p.nome.toLowerCase().includes(t);
                  if (!matchBusca) return false;

                  if (filtroStatusEstoque === 'vencidos') {
                    return p.validade && p.validade < hojeStr;
                  }
                  if (filtroStatusEstoque === 'vencendo30') {
                    if (!p.validade) return false;
                    const diffDays = Math.ceil(
                      (new Date(p.validade).getTime() - new Date(hojeStr).getTime()) / (1000 * 3600 * 24)
                    );
                    return diffDays >= 0 && diffDays <= 30;
                  }
                  if (filtroStatusEstoque === 'baixo') {
                    return p.quantidade <= 5;
                  }
                  return true;
                });

                // Ordenação
                lista.sort((a, b) => {
                  if (ordenacaoEstoque === 'nome') return a.nome.localeCompare(b.nome);
                  if (ordenacaoEstoque === 'validade') return (a.validade || '9999').localeCompare(b.validade || '9999');
                  if (ordenacaoEstoque === 'maior_preco') return b.preco_venda - a.preco_venda;
                  if (ordenacaoEstoque === 'menor_preco') return a.preco_venda - b.preco_venda;
                  if (ordenacaoEstoque === 'maior_qtd') return b.quantidade - a.quantidade;
                  if (ordenacaoEstoque === 'menor_qtd') return a.quantidade - b.quantidade;
                  return 0;
                });

                if (!lista.length) {
                  return (
                    <div style={{ textAlign: 'center', color: 'var(--texto-secundario)', padding: '30px' }}>
                      Nenhum produto encontrado com os filtros aplicados.
                    </div>
                  );
                }
                return lista.map((p, idx) => (
                  <div className="relatorio-linha-cheia" key={`rel_est_${p.codigo}_${p.validade}_${p.lote}_${idx}`}>
                    <div
                      style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                      onClick={() => {
                        fecharRelatorio();
                        abrirVenda(p.codigo, p.validade, p.lote || '');
                      }}
                    >
                      <b style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                        {obterNomeProduto(p.codigo, p.nome)}
                      </b>
                      <small style={{ color: 'var(--texto-secundario)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                        Cód: {p.codigo} | Lote: {p.lote || 'N/D'} | Val: {formatarData(p.validade)}
                      </small>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      <span>
                        Qtd: <b>{p.quantidade} un</b>
                      </span>
                      <br />
                      <span className="preco-destaque">R$ {Number(p.preco_venda || 0).toFixed(2)}</span>
                      <div className="acoes-relatorio">
                        <button
                          className="btn-acao-rel btn-editar-rel"
                          onClick={() => editarProduto(p.codigo, p.validade, p.lote || '')}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-acao-rel btn-excluir-rel"
                          onClick={() => excluirProduto(p.codigo, p.validade, p.lote || '')}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ));
              })()
            }
          </div>
        </div>
      </div>

      {/* CAMERA BARCODE SCANNER & AI VISION SCREEN */}
      <div className="leitor-tela" id="tela-leitor" style={{ display: leitorAtivo ? 'flex' : 'none', overflowY: 'auto' }}>
        {/* CABEÇALHO DO LEITOR */}
        <div style={{ textAlign: 'center', marginBottom: '10px', maxWidth: '420px', width: '100%' }}>
          {destinoLeitor === 'carrinho' ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                <h3 style={{ color: '#38bdf8', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                  Bipador Contínuo de Vendas (PDV)
                </h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: '4px 0 0 0' }}>
                Bipe os produtos um atrás do outro. A câmera continua aberta e adiciona tudo ao carrinho!
              </p>
            </div>
          ) : destinoLeitor === 'cadastro' ? (
            <h3 style={{ color: '#38bdf8', fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
              📷 Escanear Código para Cadastro
            </h3>
          ) : destinoLeitor === 'lote' ? (
            <h3 style={{ color: '#38bdf8', fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
              🤖 Leitor Inteligente de Lote & Validade (IA)
            </h3>
          ) : (
            <h3 style={{ color: '#38bdf8', fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
              🔍 Leitor Óptico de Código de Barras
            </h3>
          )}
        </div>

        {/* FEED DA CÂMERA COM MIRA */}
        <div id="video-container" style={{ position: 'relative', width: '100%', maxWidth: '380px', height: '240px' }}>
          <video id="video-webcam" ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
          <div className="mira-scanner">
            <div className="linha-laser"></div>
          </div>
        </div>

        {/* FEEDBACK VISUAL INSTANTÂNEO DE PRODUTO BIPADO */}
        {destinoLeitor === 'carrinho' && ultimoItemScaneadoInfo && (
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              marginTop: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              background: ultimoItemScaneadoInfo.status === 'sucesso' ? 'rgba(6, 95, 70, 0.92)' : 'rgba(153, 27, 27, 0.92)',
              border: ultimoItemScaneadoInfo.status === 'sucesso' ? '2px solid #34d399' : '2px solid #f87171',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
              textAlign: 'center',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            {ultimoItemScaneadoInfo.status === 'sucesso' ? (
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                  ✅ +1 {ultimoItemScaneadoInfo.nome}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#a7f3d0', marginTop: '2px' }}>
                  R$ {Number(ultimoItemScaneadoInfo.preco || 0).toFixed(2)} | No Carrinho: <b>{ultimoItemScaneadoInfo.quantidadeNoCarrinho} un</b>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                  ⚠️ {ultimoItemScaneadoInfo.nome}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#fecaca', marginTop: '2px' }}>
                  {ultimoItemScaneadoInfo.mensagem}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PAINEL RESUMO DO CARRINHO EM TEMPO REAL DENTRO DO SCANNER */}
        {destinoLeitor === 'carrinho' && (
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              marginTop: '10px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#ffffff',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                🛒 Carrinho Atual
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8' }}>
                {carrinho.reduce((a, b) => a + b.quantidade, 0)} itens | R$ {carrinho.reduce((a, b) => a + b.subtotal, 0).toFixed(2)}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                fecharLeitor();
                setModalCarrinhoVisivel(true);
              }}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
              }}
            >
              Finalizar Venda ➔
            </button>
          </div>
        )}

        {destinoLeitor === 'lote' ? (
          <div style={{ textAlign: 'center', width: '100%', maxWidth: '380px', marginTop: '10px' }}>
            <p className="aviso-leitor" style={{ marginBottom: '8px' }}>
              Aponte para a área com Lote e Validade do produto.
            </p>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '12px' }}>
              🔒 <b>Privacidade & Economia:</b> A foto NÃO é salva. Ela é descartada da memória imediatamente após a leitura!
            </p>
            {processandoOCR ? (
              <div style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem', margin: '14px 0' }}>
                ⏳ Analisando foto e extraindo lote/validade... Aguarde...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  className="btn btn-salvar"
                  onClick={() => capturarFotoEProcessarOCR(true)}
                  style={{ width: '100%', padding: '12px', fontSize: '0.92rem' }}
                >
                  🤖 Tirar Foto e Ler com IA Gemini (Alta Precisão)
                </button>
                <label
                  className="btn"
                  style={{
                    background: '#38bdf8',
                    color: '#0f172a',
                    padding: '10px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'block',
                    textAlign: 'center',
                  }}
                >
                  📁 Escolher Foto da Galeria (IA)
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => processarArquivoOCR(e, true)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => capturarFotoEProcessarOCR(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #475569',
                    color: '#cbd5e1',
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    marginTop: '4px',
                  }}
                >
                  ⚡ Usar Leitor Local Alternativo
                </button>
              </div>
            )}
          </div>
        ) : destinoLeitor !== 'carrinho' ? (
          <p className="aviso-leitor">Aponte a câmera para o código de barras.</p>
        ) : null}

        {/* DICA DE FOCO E LEITURA PARA IPHONE / CELULAR */}
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '380px', marginTop: '6px' }}>
          <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '2px 0' }}>
            📱 <b>Dica:</b> Mantenha a 15-20cm de distância. Se o código for pequeno, use o botão <b>Zoom 1.5x / 2x</b> abaixo!
          </p>
        </div>

        {/* BOTÕES DE CONTROLE E AÇÕES DO SCANNER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px', width: '100%', maxWidth: '380px' }}>
          {/* BARRA DE AÇÕES RÁPIDAS (ZOOM, LANTERNA, DISPARO MANUAL) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '8px' }}>
            <button
              type="button"
              onClick={alternarZoom}
              style={{
                background: zoomNivel > 1 ? '#0284c7' : '#334155',
                color: '#ffffff',
                border: zoomNivel > 1 ? '1px solid #38bdf8' : 'none',
                borderRadius: '8px',
                padding: '9px 10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
              }}
              title="Aumentar zoom da câmera para focar códigos pequenos"
            >
              <span>🔍</span>
              <span>{zoomNivel}x Zoom</span>
            </button>

            <button
              type="button"
              onClick={toggleLanterna}
              style={{
                background: lanternaAtiva ? '#f59e0b' : '#334155',
                color: '#ffffff',
                border: lanternaAtiva ? '1px solid #fbbf24' : 'none',
                borderRadius: '8px',
                padding: '9px 10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
              }}
              title="Ligar ou desligar lanterna"
            >
              <span>{lanternaAtiva ? '💡' : '🔦'}</span>
              <span>{lanternaAtiva ? 'Luz Ligada' : 'Lanterna'}</span>
            </button>

            <button
              type="button"
              onClick={capturarFotoManualEscanear}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)',
              }}
              title="Tirar foto do código agora e forçar leitura"
            >
              <span>📸</span>
              <span>Ler Agora</span>
            </button>
          </div>

          {/* UPLOAD DE FOTO ALTERNATIVO DA GALERIA */}
          {destinoLeitor !== 'lote' && (
            <label
              style={{
                background: 'rgba(30, 41, 59, 0.85)',
                border: '1px dashed #64748b',
                color: '#cbd5e1',
                borderRadius: '8px',
                padding: '7px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                textAlign: 'center',
              }}
            >
              <span>📁</span>
              <span>Escolher Foto ou Tirar com Câmera Nativa</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={processarArquivoFotoManual}
              />
            </label>
          )}

          {/* BOTÃO FECHAR */}
          <button
            className="btn-fechar"
            onClick={fecharLeitor}
            style={{
              margin: '2px 0 0 0',
              width: '100%',
              padding: '10px',
              fontSize: '0.9rem',
              borderRadius: '8px',
              fontWeight: 700,
            }}
          >
            Fechar Câmera
          </button>
        </div>
      </div>

      {/* SUPERMARKET REGISTRATION & MANAGEMENT FULL SCREEN */}
      <div
        className="tela-relatorio-cheia"
        id="modalSupermercado"
        style={{ display: modalSupermercadoVisivel ? 'flex' : 'none' }}
      >
        <div className="cabecalho-relatorio">
          <h2>👑 Painel Administrativo da Dona do Aplicativo</h2>
          <button className="btn-voltar-rel" onClick={() => setModalSupermercadoVisivel(false)}>
            Voltar
          </button>
        </div>
        <div className="corpo-relatorio-cheio">
          {/* ABAS DE NAVEGAÇÃO DO PAINEL DA DONA DO APP */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '2px solid #cbd5e1', paddingBottom: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                border: 'none',
                background: abaDonaApp === 'supermercados' ? 'var(--primario)' : '#f1f5f9',
                color: abaDonaApp === 'supermercados' ? '#ffffff' : '#334155',
                boxShadow: abaDonaApp === 'supermercados' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              }}
              onClick={() => setAbaDonaApp('supermercados')}
            >
              🏢 Supermercados, Planos & Limites
            </button>
            <button
              type="button"
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                border: 'none',
                background: abaDonaApp === 'banco_dados' ? 'var(--primario)' : '#f1f5f9',
                color: abaDonaApp === 'banco_dados' ? '#ffffff' : '#334155',
                boxShadow: abaDonaApp === 'banco_dados' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              }}
              onClick={() => {
                setAbaDonaApp('banco_dados');
                setBuscaMasterBd('');
              }}
            >
              🗄️ Banco de Dados Master (Editar / Excluir Itens)
            </button>
          </div>

          {abaDonaApp === 'supermercados' ? (
            <>
              {/* SEÇÃO 1: FORMULÁRIO DE CADASTRO / EDIÇÃO */}
          <div
            style={{
              background: 'var(--branco)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid var(--borda)',
              marginBottom: '20px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primario)', marginBottom: '12px' }}>
              {lojaEditandoId ? '✏️ Editar Supermercado / Redefinir Senha' : '➕ Cadastrar Novo Supermercado'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div className="grupo-input" style={{ marginBottom: 0 }}>
                <label className="rotulo-campo">Nome do Supermercado</label>
                <input
                  type="text"
                  id="reg-loja-nome"
                  className="input-modal"
                  placeholder="Ex: Supermercado Boa Vista"
                  value={regLojaNome}
                  onChange={(e) => setRegLojaNome(e.target.value)}
                  required
                />
              </div>
              <div className="grupo-input" style={{ marginBottom: 0 }}>
                <label className="rotulo-campo">CNPJ</label>
                <input
                  type="text"
                  id="reg-loja-cnpj"
                  className="input-modal"
                  placeholder="00.000.000/0001-00"
                  value={regLojaCnpj}
                  onChange={(e) => setRegLojaCnpj(e.target.value)}
                  disabled={!!lojaEditandoId}
                  required
                />
              </div>
              <div className="grupo-input" style={{ marginBottom: 0 }}>
                <label className="rotulo-campo">Senha de Acesso / Gestão</label>
                <div className="linha-input">
                  <input
                    type={senhaVisivel ? 'text' : 'password'}
                    id="reg-loja-senha"
                    className="input-modal"
                    placeholder="Senha de acesso"
                    value={regLojaSenha}
                    onChange={(e) => setRegLojaSenha(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    id="btnOlhoSenha"
                    className={`btn-olho-transparente ${!senhaVisivel ? 'olho-fechado' : ''}`}
                    onClick={alternarVisibilidadeSenha}
                    title="Ver/Ocultar Senha"
                  >
                    <svg viewBox="0 0 24 24">
                      <g className="eye-open">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </g>
                      <g className="eye-closed">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* CONFIGURAÇÃO DE LIMITES DE OPERADORES / SUPERVISORES (DONA DO APP) */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '14px', marginTop: '16px', marginBottom: '16px' }}>
              <label className="rotulo-campo" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                🛡️ Limites de Plano e Cota de Usuários (Dona do Aplicativo):
              </label>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 12px 0' }}>
                Defina a quantidade máxima de Caixas e Supervisores que o dono deste supermercado poderá cadastrar na conta dele. (Digite 0 para ilimitado).
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div className="grupo-input" style={{ marginBottom: 0 }}>
                  <label className="rotulo-campo" style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
                    🛒 Limite Máx. de Operadores de Caixa:
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input-modal"
                    placeholder="Ex: 5"
                    value={regLojaLimiteCaixas ?? 0}
                    onChange={(e) => setRegLojaLimiteCaixas(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="grupo-input" style={{ marginBottom: 0 }}>
                  <label className="rotulo-campo" style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
                    👔 Limite Máx. de Supervisores / Admins:
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input-modal"
                    placeholder="Ex: 2"
                    value={regLojaLimiteSupervisores ?? 0}
                    onChange={(e) => setRegLojaLimiteSupervisores(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            {/* QUADRADOS DE PERMISSÃO POR CATEGORIA PARA A DONA DO APLICATIVO */}
            <div style={{ marginTop: '16px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                <label className="rotulo-campo" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--texto)' }}>
                  👑 Permissões e Módulos Habilitados para este Supermercado (Dona do Aplicativo):
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    style={{ background: '#e0f2fe', color: '#0284c7', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => marcarTodasPermissoesLoja(true)}
                  >
                    Marcar Todos
                  </button>
                  <button
                    type="button"
                    style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => marcarTodasPermissoesLoja(false)}
                  >
                    Limpar
                  </button>
                </div>
              </div>

              <div className="grid-permissoes">
                {[
                  { key: 'caixa', icon: '🛒', title: 'PDV / Frente de Caixa', desc: 'Permite realizar vendas e registrar saídas no caixa' },
                  { key: 'gestao_caixa', icon: '💵', title: 'Gestão de Caixa & Sangria', desc: 'Abertura de turno, suprimento, sangria e fechamento conferido' },
                  { key: 'estoque', icon: '📦', title: 'Gestão de Estoque', desc: 'Permite cadastrar produtos, preços, marcas e lotes' },
                  { key: 'usuarios', icon: '👥', title: 'Gestão de Equipe & Caixas', desc: 'Permite cadastrar e gerenciar operadores de caixa' },
                  { key: 'devedores', icon: '💳', title: 'Área de Devedores / Fiado', desc: 'Gestão de clientes com compras fiadas, limites e pagamentos' },
                  { key: 'relatorios', icon: '📊', title: 'Relatórios de Vendas', desc: 'Acesso ao histórico de vendas e faturamento' },
                  { key: 'estorno', icon: '↩️', title: 'Estorno & Cancelamento', desc: 'Permite estornar vendas realizadas e devolver ao estoque' },
                  { key: 'reimprimir_cupom', icon: '🧾', title: '2ª Via de Cupom / Recibo', desc: 'Reimpressão e emissão de comprovantes de vendas anteriores' },
                  { key: 'graficos', icon: '📈', title: 'Gráficos & Analytics', desc: 'Acesso aos gráficos e curva de faturamento' },
                  { key: 'inteligencia_estoque', icon: '💡', title: 'Inteligência de Estoque', desc: 'Sugestões de reposição, giro de caixa e perdas' },
                  { key: 'ocr_ia', icon: '🤖', title: 'Consulta OCR / IA', desc: 'Leitura de rótulos com câmera e inteligência artificial' },
                  { key: 'etiquetas', icon: '🏷️', title: 'Impressão de Etiquetas', desc: 'Geração e impressão de etiquetas térmicas de gôndola' },
                  { key: 'balanca', icon: '⚖️', title: 'Balança & Pesáveis', desc: 'Decodificação e integração com balanças Toledo/Filizola/Elgin' },
                  { key: 'alertas', icon: '🔔', title: 'Alertas de Validade', desc: 'Notificação automática de produtos a vencer e vencidos' },
                  { key: 'alertas_whatsapp', icon: '📱', title: 'Alertas WhatsApp / E-mail', desc: 'Envio e disparo automático de relatórios de validade' },
                  { key: 'baixa_estoque', icon: '🗑️', title: 'Baixa & Descarte', desc: 'Ajuste manual e descarte por perda ou avaria' },
                  { key: 'catalogo_global', icon: '🗂️', title: 'Catálogo Global Master', desc: 'Acesso e consulta aos produtos compartilhados da rede' },
                  { key: 'exportar_dados', icon: '📥', title: 'Exportação de Dados', desc: 'Download de relatórios em Excel, CSV e PDF' },
                  { key: 'manual_ajuda', icon: '📘', title: 'Manual de Ajuda & Guia', desc: 'Acesso ao manual completo interativo do usuário' },
                ].map((item) => {
                  const marcado = regLojaPermissoes[item.key as keyof PermissoesLoja];
                  return (
                    <div
                      key={item.key}
                      className={`card-permissao ${marcado ? 'marcado' : ''}`}
                      onClick={() => alternarPermissaoLoja(item.key as keyof PermissoesLoja)}
                    >
                      <input
                        type="checkbox"
                        checked={marcado}
                        onChange={() => {}}
                      />
                      <div className="info-permissao">
                        <div className="titulo-permissao">
                          <span>{item.icon}</span>
                          <span>{item.title}</span>
                        </div>
                        <div className="desc-permissao">{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grupo-botoes" style={{ marginTop: '14px' }}>
              <button className="btn btn-salvar" onClick={salvarNovoSupermercado}>
                {lojaEditandoId ? 'Atualizar Dados e Senha' : 'Salvar Supermercado'}
              </button>
              {lojaEditandoId && (
                <button
                  className="btn btn-cancelar"
                  onClick={() => {
                    setLojaEditandoId(null);
                    setRegLojaNome('');
                    setRegLojaCnpj('');
                    setRegLojaSenha('');
                    setMsgRegLoja('');
                  }}
                >
                  Cancelar Edição
                </button>
              )}
            </div>
            <div className="msg" id="msg-reg-loja">
              {msgRegLoja}
            </div>
          </div>

          {/* SEÇÃO 2: LISTA DE LOJAS CADASTRADAS */}
          <div
            style={{
              background: 'var(--branco)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid var(--borda)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--texto)', margin: 0 }}>
                🏪 Lojas Cadastradas (Total: {listaSupermercados.length})
              </h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="search"
                  id="busca_loja_cnpj_nome_input"
                  name="search_query_loja_cnpj_nome"
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  className="input-modal"
                  style={{ maxWidth: '200px', padding: '6px 10px', fontSize: '0.85rem' }}
                  placeholder="Pesquisar loja por nome ou CNPJ..."
                  value={buscaLoja.toLowerCase().includes('rodrigo.souza') ? '' : buscaLoja}
                  onChange={(e) => {
                    const v = e.target.value;
                    setBuscaLoja(v.toLowerCase().includes('rodrigo.souza') ? '' : v);
                  }}
                />
                {listaSupermercados.length > 0 && (
                  <button
                    type="button"
                    className="btn-acao-rel"
                    style={{
                      background: '#fee2e2',
                      color: '#b91c1c',
                      border: '1px solid #fca5a5',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      padding: '6px 10px',
                    }}
                    onClick={limparTodasLojasDeTeste}
                    title="Excluir todas as lojas cadastradas para zerar o banco para produção"
                  >
                    🧹 Limpar Lojas de Teste
                  </button>
                )}
              </div>
            </div>

            <div className="tabela-relatorio">
              {(() => {
                const termo = buscaLoja.trim().toLowerCase();
                const filtradas = listaSupermercados.filter(
                  (l) => l.nome.toLowerCase().includes(termo) || l.cnpj.toLowerCase().includes(termo)
                );

                if (filtradas.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', color: 'var(--texto-secundario)', padding: '24px' }}>
                      Nenhum supermercado encontrado.
                    </div>
                  );
                }

                return filtradas.map((loja) => {
                  const isAtiva = loja.id === supermercadoAtual;
                  const verSenha = senhasVisiveisLista[loja.id] || false;

                  return (
                    <div
                      key={loja.id}
                      className="relatorio-linha-cheia"
                      style={{
                        background: isAtiva ? '#f0f9ff' : 'var(--branco)',
                        borderLeft: isAtiva ? '4px solid var(--primario)' : 'none',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <b style={{ fontSize: '0.95rem', color: 'var(--texto)' }}>{loja.nome}</b>
                          {isAtiva && (
                            <span
                              style={{
                                background: '#16a34a',
                                color: '#fff',
                                fontSize: '0.7rem',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontWeight: 600,
                              }}
                            >
                              Loja Selecionada
                            </span>
                          )}
                          {loja.status === 'bloqueado' ? (
                            <span
                              style={{
                                background: '#fee2e2',
                                color: '#991b1b',
                                fontSize: '0.72rem',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontWeight: 700,
                                border: '1px solid #fca5a5',
                              }}
                            >
                              🚫 BLOQUEADO PELO DONO DO APP
                            </span>
                          ) : (
                            <span
                              style={{
                                background: '#dcfce7',
                                color: '#15803d',
                                fontSize: '0.72rem',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontWeight: 600,
                              }}
                            >
                              🟢 Ativo / Liberado
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--texto-secundario)', marginTop: '2px' }}>
                          CNPJ: <b>{loja.cnpj}</b> | Cadastrada em: {loja.dataCadastro || 'N/A'}
                        </div>
                        {loja.status === 'bloqueado' && loja.motivoBloqueio && (
                          <div style={{ fontSize: '0.78rem', color: '#b91c1c', marginTop: '2px', background: '#fff1f2', padding: '3px 8px', borderRadius: '4px', border: '1px dashed #f87171' }}>
                            Motivo do Bloqueio: <b>{loja.motivoBloqueio}</b>
                          </div>
                        )}
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--texto-secundario)',
                            marginTop: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <span>Senha:</span>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 600,
                              background: '#f1f5f9',
                              padding: '1px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            {verSenha ? loja.senha || '(sem senha)' : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleVisibilidadeSenhaLoja(loja.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                            title="Mostrar / Ocultar Senha"
                          >
                            {verSenha ? '👁️' : '🙈'}
                          </button>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#0284c7', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                            🛒 Máx. Caixas: {loja.limiteCaixas !== undefined ? (loja.limiteCaixas === 0 ? '♾️ Ilimitado' : `${loja.limiteCaixas}`) : '5'}
                          </span>
                          <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                            👔 Máx. Supervisores: {loja.limiteSupervisores !== undefined ? (loja.limiteSupervisores === 0 ? '♾️ Ilimitado' : `${loja.limiteSupervisores}`) : '2'}
                          </span>
                        </div>
                      </div>

                      <div
                        className="acoes-relatorio"
                        style={{ flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}
                      >
                        {!isAtiva && (
                          <button
                            className="btn-acao-rel"
                            style={{ background: '#16a34a', color: '#fff' }}
                            onClick={() => alternarLojaAtiva(loja)}
                          >
                            Acessar Loja
                          </button>
                        )}
                        <button
                          className="btn-acao-rel"
                          style={{
                            background: loja.status === 'bloqueado' ? '#dcfce7' : '#fee2e2',
                            color: loja.status === 'bloqueado' ? '#15803d' : '#991b1b',
                            border: loja.status === 'bloqueado' ? '1px solid #86efac' : '1px solid #fca5a5',
                            fontWeight: 700,
                          }}
                          onClick={() => alternarBloqueioSupermercado(loja.id)}
                          title="Bloquear ou Desbloquear o acesso do supermercado"
                        >
                          {loja.status === 'bloqueado' ? '🔓 Desbloquear' : '🚫 Bloquear'}
                        </button>
                        <button
                          className="btn-acao-rel btn-editar-rel"
                          onClick={() => prepararEdicaoLoja(loja)}
                        >
                          ✏️ Editar / Trocar Senha
                        </button>
                        <button
                          className="btn-acao-rel btn-excluir-rel"
                          onClick={() => excluirSupermercado(loja.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
            </>
          ) : (
            /* SEÇÃO 2: BANCO DE DADOS MASTER - DONA DO APP */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '14px', color: '#0369a1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      👑 Acesso Exclusivo da Dona do Aplicativo - Gerenciador Geral de Banco de Dados
                    </h3>
                    <p style={{ fontSize: '0.84rem', margin: 0, color: '#0284c7' }}>
                      Conectado ao Banco de Dados Dedicado: <b>appestoqueprodutos-bb92d</b> • 🌐 <b>{catalogoGlobal.length} produtos</b> no Catálogo Global
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      className="btn-acao-rel"
                      style={{
                        background: '#0284c7',
                        color: '#ffffff',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: 'none',
                        cursor: migrandoBanco ? 'not-allowed' : 'pointer',
                      }}
                      onClick={handleMigrarParaNovoBanco}
                      disabled={migrandoBanco}
                      title="Exporta e sincroniza todos os cadastros e dados para o banco appestoqueprodutos-bb92d"
                    >
                      {migrandoBanco ? '⏳ Migrando Registros...' : '📤 Sincronizar/Migrar Todos os Cadastros'}
                    </button>
                  </div>
                </div>
                {msgMigracao && (
                  <div
                    style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      background: msgMigracao.startsWith('✅') ? '#dcfce7' : msgMigracao.startsWith('⚠️') ? '#fef3c7' : '#eff6ff',
                      color: msgMigracao.startsWith('✅') ? '#166534' : msgMigracao.startsWith('⚠️') ? '#92400e' : '#1e40af',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      border: '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    {msgMigracao}
                  </div>
                )}
              </div>

              {/* FILTROS E BUSCA DO BANCO DE DADOS */}
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '14px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="search"
                      id="busca_banco_dados_mestre_input"
                      name="search_query_banco_dados_mestre"
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      data-form-type="other"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      className="input-modal"
                      style={{ marginBottom: 0, width: '100%', paddingRight: buscaMasterBd ? '36px' : '10px' }}
                      placeholder="🔍 Pesquisar no Banco de Dados (Nome, Código EAN, Lote...)"
                      value={buscaMasterBd.toLowerCase().includes('rodrigo.souza') ? '' : buscaMasterBd}
                      onChange={(e) => {
                        const v = e.target.value;
                        setBuscaMasterBd(v.toLowerCase().includes('rodrigo.souza') ? '' : v);
                      }}
                    />
                    {buscaMasterBd && (
                      <button
                        type="button"
                        onClick={() => setBuscaMasterBd('')}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          background: '#e2e8f0',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#475569',
                          fontWeight: 'bold',
                          fontSize: '12px',
                        }}
                        title="Limpar pesquisa"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <select
                    className="input-modal"
                    style={{ marginBottom: 0, width: 'auto', minWidth: '160px' }}
                    value={filtroMasterOrigem}
                    onChange={(e) => setFiltroMasterOrigem(e.target.value as any)}
                  >
                    <option value="todos">Origem: Todos os Itens</option>
                    <option value="catalogo">🌐 Catálogo Global ({catalogoGlobal.length} produtos)</option>
                    <option value="estoque">🏪 Estoque Local ({estoque.length})</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    className="btn-acao-rel"
                    style={{ background: 'var(--primario)', color: '#fff', padding: '10px 16px', fontWeight: 600, fontSize: '0.88rem' }}
                    onClick={() => {
                      setModalSupermercadoVisivel(false);
                      abrirCadastro('master');
                    }}
                  >
                    ➕ Cadastrar Novo Item
                  </button>
                  <button
                    className="btn-acao-rel"
                    style={{ background: '#d97706', color: '#fff', padding: '10px 16px', fontWeight: 600, fontSize: '0.88rem' }}
                    onClick={handleSincronizarAmbev}
                    title="Carrega todos os 173 produtos oficiais da Ambev no seu Catálogo Geral interno do app"
                  >
                    🍺 Catálogo Ambev (173 Itens)
                  </button>
                  <button
                    className="btn-acao-rel"
                    style={{ background: '#7c3aed', color: '#fff', padding: '10px 16px', fontWeight: 600, fontSize: '0.88rem' }}
                    onClick={handleSincronizarMixAdega}
                    title="Carrega todos os produtos essenciais de adega (Whiskies, Vinhos, Salgadinhos, Bomboniere e Tabacaria) no seu Catálogo Geral interno do app"
                  >
                    🥃 Mix Adega (Whiskies, Vinhos, Salgados, Cigarros)
                  </button>
                  <button
                    className="btn-acao-rel"
                    style={{ background: '#10b981', color: '#fff', padding: '10px 16px', fontWeight: 600, fontSize: '0.88rem' }}
                    onClick={handleSincronizarMixZeDelivery}
                    title="Carrega os 80 produtos campeões de vendas do Zé Delivery (Red Bull, Monster, Baly, Coca-Cola, Destilados, Copos) no seu Catálogo Geral"
                  >
                    🛵 Mix Zé Delivery (80 Itens Campeões)
                  </button>
                  <button
                    className="btn-acao-rel"
                    style={{ background: '#b91c1c', color: '#fff', padding: '10px 16px', fontWeight: 600, fontSize: '0.88rem' }}
                    onClick={handleSincronizarChoppBrahma}
                    title="Carrega os 41 produtos oficiais do Chopp Brahma Express (Barris 30L/50L, Growlers, Chopeiras, Cilindros CO2, Copos e Calderetas)"
                  >
                    🍻 Chopp Brahma Express (41 Itens)
                  </button>
                  <button
                    className="btn-acao-rel"
                    style={{ background: '#0284c7', color: '#fff', padding: '10px 16px', fontWeight: 600, fontSize: '0.88rem' }}
                    onClick={handleSincronizarRissulBebidas}
                    title="Carrega os 465 produtos de bebidas não alcoólicas do Rissul (Refrigerantes, Sucos Integrais, Águas Minerais, Chás, Isotônicos)"
                  >
                    🥤 Bebidas Rissul (465 Itens)
                  </button>
                </div>
              </div>

              {/* TABELA DE ITENS DO BANCO DE DADOS (PAGINADA PARA MÁXIMA VELOCIDADE) */}
              <div className="tabela-relatorio">
                {(() => {
                  const termo = buscaMasterBd.trim().toLowerCase();

                  // 1. Filter Catalogo Global
                  const catalogoFiltrado = catalogoGlobal.filter((c) => {
                    if (filtroMasterOrigem === 'estoque') return false;
                    if (!termo) return true;
                    return (
                      c.codigo.toLowerCase().includes(termo) ||
                      (c.nome && c.nome.toLowerCase().includes(termo)) ||
                      (c.marca && c.marca.toLowerCase().includes(termo)) ||
                      (c.categoria && c.categoria.toLowerCase().includes(termo))
                    );
                  });

                  // 2. Filter Estoque
                  const estoqueFiltrado = estoque.filter((p) => {
                    if (filtroMasterOrigem === 'catalogo') return false;
                    if (!termo) return true;
                    return (
                      p.codigo.toLowerCase().includes(termo) ||
                      p.nome.toLowerCase().includes(termo) ||
                      (p.lote && p.lote.toLowerCase().includes(termo))
                    );
                  });

                  // Lista combinada de acordo com o filtro selecionado
                  let listaFinalMaster: (
                    | { tipo: 'catalogo'; item: ProdutoCatalogo }
                    | { tipo: 'estoque'; item: ItemEstoque }
                  )[] = [];

                  if (filtroMasterOrigem === 'catalogo') {
                    listaFinalMaster = catalogoFiltrado.map((item) => ({ tipo: 'catalogo', item }));
                  } else if (filtroMasterOrigem === 'estoque') {
                    listaFinalMaster = estoqueFiltrado.map((item) => ({ tipo: 'estoque', item }));
                  } else {
                    listaFinalMaster = [
                      ...catalogoFiltrado.map((item) => ({ tipo: 'catalogo' as const, item })),
                      ...estoqueFiltrado.map((item) => ({ tipo: 'estoque' as const, item })),
                    ];
                  }

                  const totalCount = listaFinalMaster.length;

                  if (totalCount === 0) {
                    return (
                      <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                        Nenhum item encontrado no banco de dados com os termos da busca.
                      </div>
                    );
                  }

                  const ITENS_POR_PAGINA = 30;
                  const totalPaginas = Math.max(1, Math.ceil(totalCount / ITENS_POR_PAGINA));
                  const paginaAtualClamped = Math.min(Math.max(1, paginaMasterBd), totalPaginas);

                  const itensPaginados = listaFinalMaster.slice(
                    (paginaAtualClamped - 1) * ITENS_POR_PAGINA,
                    paginaAtualClamped * ITENS_POR_PAGINA
                  );

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* BARRA SUPERIOR DE RESUMO DA PÁGINA */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          fontSize: '0.8rem',
                          color: '#475569',
                          marginBottom: '4px',
                        }}
                      >
                        <span>
                          Mostrando <b>{(paginaAtualClamped - 1) * ITENS_POR_PAGINA + 1}</b> a{' '}
                          <b>{Math.min(paginaAtualClamped * ITENS_POR_PAGINA, totalCount)}</b> de{' '}
                          <b>{totalCount.toLocaleString('pt-BR')}</b> produtos
                        </span>
                        <span>
                          Página <b>{paginaAtualClamped}</b> de <b>{totalPaginas}</b>
                        </span>
                      </div>

                      {itensPaginados.map((entry, idx) => {
                        if (entry.tipo === 'catalogo') {
                          const cat = entry.item;
                          return (
                            <div
                              key={`cat_cons_${cat.codigo}_${idx}`}
                              className="relatorio-linha-cheia"
                              style={{ background: '#fafafa', borderLeft: '4px solid #0284c7' }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#e2e8f0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  {cat.imagem ? (
                                    <img src={otimizarUrlImagem(cat.imagem)} alt={cat.nome} referrerPolicy="no-referrer" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    <span style={{ fontSize: '1.2rem' }}>📦</span>
                                  )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <b style={{ fontSize: '0.92rem', color: '#0f172a' }}>{cat.nome}</b>
                                    <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                                      🌐 Catálogo Global
                                    </span>
                                    {(isProdutoAmbev(cat.codigo) || isProdutoAmbev(cat.nome) || (cat.marca && isProdutoAmbev(cat.marca))) && (
                                      <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700, border: '1px solid #fde68a' }}>
                                        🍺 Ambev
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                                    Cód. EAN: <b>{cat.codigo}</b> | Categoria: <b>{cat.categoria || 'Geral'}</b> {cat.marca ? `| Marca: ${cat.marca}` : ''} {cat.unidade_medida ? `| Un: ${cat.unidade_medida}` : ''}
                                  </div>
                                  {cat.descricao && (
                                    <div style={{ fontSize: '0.73rem', color: '#475569', marginTop: '3px', lineHeight: 1.35, background: '#f8fafc', padding: '4px 8px', borderRadius: '4px', border: '1px solid #f1f5f9' }}>
                                      📝 {cat.descricao}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="acoes-relatorio" style={{ gap: '6px' }}>
                                <button
                                  className="btn-acao-rel"
                                  style={{ background: '#059669', color: '#fff', fontSize: '0.78rem', padding: '6px 10px', borderRadius: '6px' }}
                                  onClick={() => {
                                    setModalSupermercadoVisivel(false);
                                    abrirCadastroComProdutoCatalogo(cat);
                                  }}
                                  title="Adicionar este produto ao Estoque da Loja/Adega"
                                >
                                  + Estoque
                                </button>
                                <button
                                  className="btn-acao-rel btn-editar-rel"
                                  onClick={() => {
                                    setModalSupermercadoVisivel(false);
                                    editarProduto(cat.codigo, '', '', 'master');
                                  }}
                                  title="Editar este item no Cadastro Master"
                                >
                                  ✏️ Editar
                                </button>
                                <button
                                  className="btn-acao-rel btn-excluir-rel"
                                  onClick={() => excluirProdutoCatalogoMaster(cat.codigo)}
                                  title="Excluir do Banco de Dados"
                                >
                                  🗑️ Excluir
                                </button>
                              </div>
                            </div>
                          );
                        } else {
                          const p = entry.item;
                          const nomeLoja = listaSupermercados.find((l) => l.id === supermercadoAtual)?.nome || 'Loja Atual';
                          const nomeExibicao = obterNomeProduto(p.codigo, p.nome);
                          return (
                            <div
                              key={`est_cons_${p.codigo}_${p.validade}_${p.lote}_${idx}`}
                              className="relatorio-linha-cheia"
                              style={{ background: '#ffffff', borderLeft: '4px solid #16a34a' }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#e2e8f0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  {(() => {
                                    const fotoLinha = obterFotoProduto(p.codigo, p.foto);
                                    return fotoLinha ? (
                                      <img src={fotoLinha} alt={nomeExibicao} referrerPolicy="no-referrer" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <span style={{ fontSize: '1.2rem' }}>🛒</span>
                                    );
                                  })()}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <b style={{ fontSize: '0.92rem', color: '#0f172a' }}>{nomeExibicao}</b>
                                    <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                                      🏪 Estoque ({nomeLoja})
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                                    Cód: <b>{p.codigo}</b> | Qtd: <b style={{ color: '#0f172a' }}>{p.quantidade} un</b> | Venda: <b style={{ color: '#16a34a' }}>R$ {Number(p.preco_venda || 0).toFixed(2)}</b> | Custo: R$ {Number(p.preco_custo || 0).toFixed(2)}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1px' }}>
                                    Validade: <b>{p.validade || 'N/A'}</b> {p.lote ? `| Lote: ${p.lote}` : ''}
                                  </div>
                                </div>
                              </div>

                              <div className="acoes-relatorio" style={{ gap: '6px' }}>
                                <button
                                  className="btn-acao-rel btn-editar-rel"
                                  onClick={() => {
                                    setModalSupermercadoVisivel(false);
                                    editarProduto(p.codigo, p.validade, p.lote || '');
                                  }}
                                  title="Editar no Estoque"
                                >
                                  ✏️ Editar
                                </button>
                                <button
                                  className="btn-acao-rel btn-excluir-rel"
                                  onClick={() => excluirItemEstoqueMaster(p.codigo, p.validade, p.lote || '', supermercadoAtual)}
                                  title="Excluir do Banco de Dados"
                                >
                                  🗑️ Excluir
                                </button>
                              </div>
                            </div>
                          );
                        }
                      })}

                      {/* CONTROLES DE PAGINAÇÃO */}
                      {totalPaginas > 1 && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '16px 8px',
                            flexWrap: 'wrap',
                            marginTop: '8px',
                            borderTop: '1px solid #e2e8f0',
                          }}
                        >
                          <button
                            type="button"
                            className="btn-acao-rel"
                            style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '6px 12px' }}
                            onClick={() => setPaginaMasterBd(1)}
                            disabled={paginaAtualClamped === 1}
                          >
                            ⏮ Primeira
                          </button>
                          <button
                            type="button"
                            className="btn-acao-rel"
                            style={{ background: '#0284c7', color: '#ffffff', padding: '6px 14px', fontWeight: 600 }}
                            onClick={() => setPaginaMasterBd((prev) => Math.max(1, prev - 1))}
                            disabled={paginaAtualClamped === 1}
                          >
                            ◀ Anterior
                          </button>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', margin: '0 8px' }}>
                            Página {paginaAtualClamped} de {totalPaginas}
                          </span>
                          <button
                            type="button"
                            className="btn-acao-rel"
                            style={{ background: '#0284c7', color: '#ffffff', padding: '6px 14px', fontWeight: 600 }}
                            onClick={() => setPaginaMasterBd((prev) => Math.min(totalPaginas, prev + 1))}
                            disabled={paginaAtualClamped === totalPaginas}
                          >
                            Próxima ▶
                          </button>
                          <button
                            type="button"
                            className="btn-acao-rel"
                            style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '6px 12px' }}
                            onClick={() => setPaginaMasterBd(totalPaginas)}
                            disabled={paginaAtualClamped === totalPaginas}
                          >
                            Última ⏭
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* OPERATORS / CASHIERS & STAFF MANAGEMENT MODAL (FULL SCREEN) */}
      <div
        className="tela-relatorio-cheia"
        id="modalOperadores"
        style={{ display: modalOperadoresVisivel ? 'flex' : 'none' }}
      >
        <div className="cabecalho-relatorio">
          <h2>👥 Gestão de Caixas, Operadores & Funcionários ({nomeSupermercadoAtivo})</h2>
          <button className="btn-voltar-rel" onClick={fecharModalOperadores}>
            Voltar
          </button>
        </div>
        <div className="corpo-relatorio-cheio">
          {/* FORMULÁRIO DE CADASTRO / EDIÇÃO DE OPERADOR */}
          <div
            style={{
              background: 'var(--branco)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid var(--borda)',
              marginBottom: '20px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primario)', marginBottom: '12px' }}>
              {opEditandoId ? '✏️ Editar Operador / Permissões' : '➕ Cadastrar Novo Operador de Caixa / Funcionário'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div className="grupo-input" style={{ marginBottom: 0 }}>
                <label className="rotulo-campo">Nome do Funcionário</label>
                <input
                  type="text"
                  className="input-modal"
                  placeholder="Ex: Carlos Oliveira"
                  value={regOpNome}
                  onChange={(e) => setRegOpNome(e.target.value)}
                  required
                />
              </div>

              <div className="grupo-input" style={{ marginBottom: 0 }}>
                <label className="rotulo-campo">CPF / Login do Operador</label>
                <input
                  type="text"
                  className="input-modal"
                  placeholder="Ex: caixa01 ou 123.456.789-00"
                  value={regOpCpf}
                  onChange={(e) => setRegOpCpf(e.target.value)}
                  required
                />
              </div>

              <div className="grupo-input" style={{ marginBottom: 0 }}>
                <label className="rotulo-campo">PIN / Senha do Caixa</label>
                <input
                  type="password"
                  className="input-modal"
                  placeholder="Ex: 1234"
                  value={regOpSenha}
                  onChange={(e) => setRegOpSenha(e.target.value)}
                />
              </div>

              <div className="grupo-input" style={{ marginBottom: 0 }}>
                <label className="rotulo-campo">Cargo / Nível de Acesso</label>
                <select
                  className="input-modal"
                  value={regOpCargo}
                  onChange={(e) => aplicarPermissoesPorCargo(e.target.value as any)}
                >
                  <option value="Operador de Caixa">🛒 Operador de Caixa</option>
                  <option value="Supervisor">👔 Supervisor de Loja</option>
                  <option value="Administrador">👑 Administrador Local</option>
                </select>
              </div>
            </div>

            {/* ATALHOS E PRESETS DE PERMISSÃO */}
            <div style={{ marginTop: '16px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <label className="rotulo-campo" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--texto)', marginBottom: 0 }}>
                  🔳 Permissões Individuais do Funcionário:
                </label>
                <span
                  style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    border: '1px solid #bae6fd',
                  }}
                >
                  Liberadas: {Object.values(regOpPermissoes).filter(Boolean).length} de 17 funções
                </span>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  style={{ background: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd', padding: '5px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => aplicarPresetPermissoes('caixa')}
                  title="Permissões padrão para operador de frente de caixa"
                >
                  🛒 Perfil Caixa
                </button>
                <button
                  type="button"
                  style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '5px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => aplicarPresetPermissoes('repositor')}
                  title="Permissões para controle e reposição de estoque"
                >
                  📦 Perfil Estoquista
                </button>
                <button
                  type="button"
                  style={{ background: '#f3e8ff', color: '#7e22ce', border: '1px solid #e9d5ff', padding: '5px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => aplicarPresetPermissoes('supervisor')}
                  title="Permissões ampliadas de supervisor"
                >
                  👔 Perfil Supervisor
                </button>
                <button
                  type="button"
                  style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', padding: '5px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => aplicarPresetPermissoes('admin')}
                  title="Liberar todas as 17 funções do sistema"
                >
                  👑 Acesso Total
                </button>
                <button
                  type="button"
                  style={{ background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', padding: '5px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => marcarTodasPermissoesOperador(true)}
                  title="Marcar todas as caixas"
                >
                  ⚡ Marcar Todos
                </button>
                <button
                  type="button"
                  style={{ background: '#f8fafc', color: '#94a3b8', border: '1px solid #cbd5e1', padding: '5px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => marcarTodasPermissoesOperador(false)}
                  title="Desmarcar todas as caixas"
                >
                  ❌ Limpar
                </button>
              </div>
            </div>

            {/* QUADRADOS DE PERMISSÃO DO OPERADOR */}
            <div className="grid-permissoes">
              {[
                { key: 'vender', icon: '🛒', title: 'Realizar Vendas', desc: 'Registrar saídas no caixa do PDV e finalizar compras' },
                { key: 'gestao_caixa', icon: '💵', title: 'Gestão de Caixa / Turno', desc: 'Abrir e fechar caixa, registrar sangrias e conferir gaveta' },
                { key: 'gerenciar_devedores', icon: '💳', title: 'Área de Devedores / Fiado', desc: 'Cadastrar devedores, registrar compras fiado e receber pagamentos' },
                { key: 'dar_desconto', icon: '💲', title: 'Dar Desconto', desc: 'Aplicar desconto no valor total da venda' },
                { key: 'alterar_preco', icon: '✏️', title: 'Alterar Preço', desc: 'Mudar o valor unitário de venda do produto' },
                { key: 'estornar_venda', icon: '↩️', title: 'Estornar / Cancelar Venda', desc: 'Cancelar venda e retornar itens ao estoque' },
                { key: 'reimprimir_cupom', icon: '🧾', title: 'Reimprimir Cupom / 2ª Via', desc: 'Reimprimir comprovante de vendas anteriores' },
                { key: 'cadastrar_produtos', icon: '📦', title: 'Cadastrar Produtos', desc: 'Criar ou editar produtos e lotes no estoque' },
                { key: 'excluir_produtos', icon: '❌', title: 'Excluir Produtos', desc: 'Remover produtos do cadastro e estoque da loja' },
                { key: 'baixa_estoque', icon: '🗑️', title: 'Baixa Manual / Descarte', desc: 'Dar baixa em estoque por perda, quebra ou vencimento' },
                { key: 'ver_relatorios', icon: '📊', title: 'Ver Faturamento & Vendas', desc: 'Visualizar relatórios e histórico de vendas' },
                { key: 'ver_graficos', icon: '📈', title: 'Ver Gráficos & Analytics', desc: 'Acessar gráficos de desempenho de vendas' },
                { key: 'inteligencia_estoque', icon: '💡', title: 'Inteligência de Estoque', desc: 'Ver recomendações de reposição e itens parados' },
                { key: 'gerenciar_equipe', icon: '👥', title: 'Gerenciar Caixas', desc: 'Cadastrar e editar outros operadores e permissões' },
                { key: 'imprimir_etiquetas', icon: '🏷️', title: 'Imprimir Etiquetas', desc: 'Gerar e imprimir etiquetas térmicas de gôndola' },
                { key: 'balanca', icon: '⚖️', title: 'Balança & Pesáveis', desc: 'Decodificar etiquetas de balanças Toledo, Filizola e Elgin' },
                { key: 'alertas_validade', icon: '🔔', title: 'Alertas de Validade', desc: 'Consultar central de produtos próximos ao vencimento' },
                { key: 'alertas_whatsapp', icon: '📱', title: 'Alerta WhatsApp / E-mail', desc: 'Enviar e disparar relatórios de validade para WhatsApp/E-mail' },
                { key: 'catalogo_global', icon: '🗂️', title: 'Catálogo Global Master', desc: 'Consultar produtos cadastrados na rede de supermercados' },
                { key: 'usar_ocr_ia', icon: '🤖', title: 'Usar Leitor OCR / IA', desc: 'Scanner com inteligência artificial para ler embalagens' },
                { key: 'exportar_relatorios', icon: '📥', title: 'Exportar Relatórios', desc: 'Baixar arquivos de vendas em CSV/PDF' },
                { key: 'ver_manual_usuario', icon: '📘', title: 'Manual do Usuário', desc: 'Acessar o guia completo e manual de instruções' },
                { key: 'configurar_balanca', icon: '⚙️', title: 'Configurar Balança', desc: 'Definir padrão e dígitos de etiquetas de balança' },
              ].map((item) => {
                const marcado = regOpPermissoes[item.key as keyof PermissoesOperador];
                return (
                  <div
                    key={item.key}
                    className={`card-permissao ${marcado ? 'marcado' : ''}`}
                    onClick={() => alternarPermissaoOperador(item.key as keyof PermissoesOperador)}
                  >
                    <input
                      type="checkbox"
                      checked={marcado}
                      onChange={() => {}}
                    />
                    <div className="info-permissao">
                      <div className="titulo-permissao">
                        <span>{item.icon}</span>
                        <span>{item.title}</span>
                      </div>
                      <div className="desc-permissao">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grupo-botoes" style={{ marginTop: '14px' }}>
              <button className="btn btn-salvar" onClick={salvarOperador}>
                {opEditandoId ? 'Atualizar Operador' : 'Salvar Operador de Caixa'}
              </button>
              {opEditandoId && (
                <button
                  className="btn btn-cancelar"
                  onClick={() => {
                    setOpEditandoId(null);
                    setRegOpNome('');
                    setRegOpCpf('');
                    setRegOpSenha('');
                    setRegOpCargo('Operador de Caixa');
                    setRegOpPermissoes(PERMISSOES_CAIXA_PADRAO);
                    setMsgRegOp('');
                  }}
                >
                  Cancelar Edição
                </button>
              )}
            </div>
            <div className="msg">{msgRegOp}</div>
          </div>

          {/* LISTA DE OPERADORES CADASTRADOS NA LOJA */}
          <div
            style={{
              background: 'var(--branco)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid var(--borda)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--texto)', marginBottom: '12px' }}>
              👥 Operadores & Caixas Cadastrados no {nomeSupermercadoAtivo} (Total: {listaOperadores.length})
            </h3>

            {listaOperadores.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--texto-secundario)' }}>
                Nenhum operador de caixa cadastrado nesta loja. Use o formulário acima para adicionar um funcionário.
              </div>
            ) : (
              <div className="tabela-relatorio">
                {listaOperadores.map((op) => (
                  <div
                    key={op.id}
                    className="relatorio-linha-cheia"
                    style={{
                      background: op.ativo ? 'var(--branco)' : '#f8fafc',
                      opacity: op.ativo ? 1 : 0.7,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <b style={{ fontSize: '0.95rem', color: 'var(--texto)' }}>{op.nome}</b>
                        <span
                          className={`badge-permissao-status ${op.ativo ? 'badge-ativa' : 'badge-inativa'}`}
                        >
                          {op.ativo ? '🟢 Ativo' : '🔴 Inativo'}
                        </span>
                        <span
                          style={{
                            background: '#f1f5f9',
                            color: '#475569',
                            fontSize: '0.72rem',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontWeight: 600,
                          }}
                        >
                          {op.cargo}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--texto-secundario)', marginTop: '2px' }}>
                        Login/CPF: <b>{op.cpfOuUsuario}</b> | Cadastrado em: {op.dataCadastro || 'N/A'}
                      </div>

                      {/* BADGES DE PERMISSÕES ATIVAS */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                        {op.permissoes?.vender && <span style={{ fontSize: '0.68rem', background: '#e0f2fe', color: '#0369a1', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>🛒 Vendas</span>}
                        {op.permissoes?.dar_desconto && <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>💲 Desconto</span>}
                        {op.permissoes?.alterar_preco && <span style={{ fontSize: '0.68rem', background: '#fef3c7', color: '#b45309', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>✏️ Alterar Preço</span>}
                        {op.permissoes?.estornar_venda && <span style={{ fontSize: '0.68rem', background: '#fee2e2', color: '#991b1b', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>↩️ Estorno</span>}
                        {op.permissoes?.cadastrar_produtos && <span style={{ fontSize: '0.68rem', background: '#f3e8ff', color: '#6b21a8', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>📦 Cad. Produtos</span>}
                        {op.permissoes?.excluir_produtos && <span style={{ fontSize: '0.68rem', background: '#ffedd5', color: '#9a3412', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>❌ Excluir Produtos</span>}
                        {op.permissoes?.baixa_estoque && <span style={{ fontSize: '0.68rem', background: '#fee2e2', color: '#b91c1c', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>🗑️ Baixa Manual</span>}
                        {op.permissoes?.ver_relatorios && <span style={{ fontSize: '0.68rem', background: '#e0e7ff', color: '#3730a3', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>📊 Relatórios</span>}
                        {op.permissoes?.ver_graficos && <span style={{ fontSize: '0.68rem', background: '#ccfbf1', color: '#0f766e', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>📈 Gráficos</span>}
                        {op.permissoes?.inteligencia_estoque && <span style={{ fontSize: '0.68rem', background: '#fef9c3', color: '#854d0e', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>💡 Inteligência</span>}
                        {op.permissoes?.gerenciar_equipe && <span style={{ fontSize: '0.68rem', background: '#fae8ff', color: '#86198f', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>👥 Gerir Equipe</span>}
                        {op.permissoes?.imprimir_etiquetas && <span style={{ fontSize: '0.68rem', background: '#f1f5f9', color: '#334155', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>🏷️ Etiquetas</span>}
                        {op.permissoes?.usar_ocr_ia && <span style={{ fontSize: '0.68rem', background: '#e0f2fe', color: '#0284c7', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>🤖 OCR / IA</span>}
                        {op.permissoes?.exportar_relatorios && <span style={{ fontSize: '0.68rem', background: '#ecfdf5', color: '#047857', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>📥 Exportar</span>}
                      </div>
                    </div>

                    <div className="acoes-relatorio acoes-operador">
                      <button
                        className="btn-acao-rel btn-editar-rel"
                        onClick={() => prepararEdicaoOperador(op)}
                      >
                        ✏️ Editar Permissões
                      </button>
                      <button
                        className="btn-acao-rel"
                        style={{
                          background: op.ativo ? '#fef3c7' : '#dcfce7',
                          color: op.ativo ? '#b45309' : '#15803d',
                        }}
                        onClick={() => alternarStatusOperador(op.id)}
                      >
                        {op.ativo ? '⏸ Desativar' : '▶ Ativar'}
                      </button>
                      <button
                        className="btn-acao-rel btn-excluir-rel"
                        onClick={() => excluirOperador(op.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCT REGISTRATION MODAL */}
      <div className="modal" id="modalCadastro" style={{ display: modalCadastroVisivel ? 'flex' : 'none' }}>
        <div className="modal-conteudo">
          <div className="cab-modal" id="titulo-modal-cad">
            {tipoProdutoCadastro === 'interno'
              ? (codigoEditando ? `✏️ Editar Produto Interno / Balcão (${nomeSupermercadoAtivo})` : `🍢 Novo Produto Interno / Adega (${nomeSupermercadoAtivo})`)
              : (perfilAtivo === 'dona_app'
                  ? (modoCadastroItem === 'master'
                      ? (codigoEditando ? '👑 Editar Item no Banco de Dados Master' : '👑 Cadastrar Item no Banco Master')
                      : (codigoEditando ? `✏️ Editar Item no Estoque (${nomeSupermercadoAtivo})` : `➕ Adicionar Item ao Estoque (${nomeSupermercadoAtivo})`))
                  : (codigoEditando ? `✏️ Editar Produto (${nomeSupermercadoAtivo})` : `➕ Novo Produto no Estoque (${nomeSupermercadoAtivo})`))}
          </div>
          <div className="corpo-modal">
            {/* SELETOR DE TIPO DE CADASTRO: PADRÃO (COM EAN) VS INTERNO (ADEGA / ESPETINHO / BALCÃO) */}
            {!codigoEditando && modoCadastroItem !== 'master' && (
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '9px 6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: tipoProdutoCadastro === 'padrao' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                    background: tipoProdutoCadastro === 'padrao' ? '#dcfce7' : '#f8fafc',
                    color: tipoProdutoCadastro === 'padrao' ? '#15803d' : '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease',
                  }}
                  onClick={() => {
                    setTipoProdutoCadastro('padrao');
                    setCadEstoqueIlimitado(false);
                    setCadCod('');
                    setCadCategoria('');
                    setCadMarca('');
                    setCadQtd('1');
                    setCadLote('');
                    setCadVal('');
                  }}
                >
                  <span>📦</span>
                  <span>Industrial (com Código de Barras)</span>
                </button>

                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '9px 6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: tipoProdutoCadastro === 'interno' ? '2px solid #d97706' : '1px solid #cbd5e1',
                    background: tipoProdutoCadastro === 'interno' ? '#fef3c7' : '#f8fafc',
                    color: tipoProdutoCadastro === 'interno' ? '#92400e' : '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease',
                  }}
                  onClick={() => {
                    setTipoProdutoCadastro('interno');
                    setCadEstoqueIlimitado(true);
                    setCadCod(gerarCodigoInternoAutomatico('ESP'));
                    setCadCategoria('🍢 Espetinhos & Churrasco');
                    setCadMarca('Produção Própria / Adega');
                    setCadQtd('99999');
                    setCadVal('2099-12-31');
                    setCadLote('PROD_INTERNA');
                  }}
                >
                  <span>🍢</span>
                  <span>Interno / Balcão (Sem Código de Barras)</span>
                </button>
              </div>
            )}

            {/* SELETOR DE MODO PARA DONA DO APP (SE FOR PRODUTO PADRÃO) */}
            {perfilAtivo === 'dona_app' && !codigoEditando && tipoProdutoCadastro === 'padrao' && (
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '8px 6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: modoCadastroItem === 'estoque' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                    background: modoCadastroItem === 'estoque' ? '#dcfce7' : '#f8fafc',
                    color: modoCadastroItem === 'estoque' ? '#15803d' : '#64748b',
                    cursor: 'pointer',
                  }}
                  onClick={() => setModoCadastroItem('estoque')}
                >
                  📦 Adicionar ao Estoque da Loja
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '8px 6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: modoCadastroItem === 'master' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: modoCadastroItem === 'master' ? '#e0f2fe' : '#f8fafc',
                    color: modoCadastroItem === 'master' ? '#0369a1' : '#64748b',
                    cursor: 'pointer',
                  }}
                  onClick={() => setModoCadastroItem('master')}
                >
                  👑 Banco Master ({catalogoGlobal.length} produtos)
                </button>
              </div>
            )}

            {/* BANNER INFORMATIVO PARA PRODUTOS INTERNOS (ADEGA / BALCÃO) */}
            {tipoProdutoCadastro === 'interno' && (
              <div
                style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  marginBottom: '14px',
                  fontSize: '0.82rem',
                  color: '#92400e',
                  lineHeight: '1.4',
                }}
              >
                <b>🍢 Cadastro Interno Exclusivo ({nomeSupermercadoAtivo}):</b> Este produto <b>NÃO</b> exige código de barras e <b>NÃO</b> é enviado ao Catálogo Global. Fica gravado no banco de dados exclusivo da sua adega com <b>estoque ilimitado</b>, pronto para dar baixa de 1, 2 ou quantas unidades desejar na hora da venda!
              </div>
            )}

            {/* INFORMAÇÃO DA LOJA SELECIONADA */}
            {tipoProdutoCadastro === 'padrao' && (perfilAtivo !== 'dona_app' || modoCadastroItem === 'estoque') && (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primario)' }}>🏪 Loja Selecionada:</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--texto)' }}>{nomeSupermercadoAtivo}</span>
              </div>
            )}

            {perfilAtivo === 'dona_app' && modoCadastroItem === 'master' && tipoProdutoCadastro === 'padrao' && (
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px', fontSize: '0.82rem', color: '#0369a1' }}>
                👑 <b>Modo Banco de Dados Master:</b> Os dados deste item ficarão disponíveis para todos os supermercados utilizarem na leitura de código de barras.
              </div>
            )}

            {/* CAMPOS ESPECÍFICOS PARA PRODUTO INTERNO (ADEGA / ESPETINHO / BALCÃO) */}
            {tipoProdutoCadastro === 'interno' ? (
              <>
                <div className="grupo-input">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label className="rotulo-campo" style={{ marginBottom: 0 }}>Código Interno do Produto</label>
                    <span style={{ fontSize: '0.74rem', color: '#92400e', fontWeight: 700 }}>
                      ⚡ Código rápido para PDV
                    </span>
                  </div>
                  <div className="linha-input">
                    <input
                      type="text"
                      id="cad-cod"
                      className="input-modal"
                      placeholder="Ex: ESP-01, DOS-01, GEL-01"
                      value={cadCod}
                      onChange={(e) => setCadCod(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn"
                      style={{
                        background: '#fef3c7',
                        color: '#92400e',
                        border: '1px solid #fde68a',
                        borderRadius: '6px',
                        padding: '0 10px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                      onClick={() => setCadCod(gerarCodigoInternoAutomatico(cadCod.slice(0, 3) || 'ESP'))}
                      title="Gerar próximo código sequencial"
                    >
                      🔄 Próximo
                    </button>
                  </div>
                  {/* Atalhos Rápidos de Prefixos para Adegas */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', alignSelf: 'center', marginRight: '2px' }}>Prefixos:</span>
                    {[
                      { pref: 'ESP', label: '🍢 Espetinho', cat: '🍢 Espetinhos & Churrasco' },
                      { pref: 'DOS', label: '🥃 Dose', cat: '🥃 Doses & Destilados' },
                      { pref: 'GEL', label: '🧊 Gelo/Carvão', cat: '🧊 Gelo & Carvão' },
                      { pref: 'BAL', label: '🍬 Balcão', cat: '🍬 Balcão & Doces' },
                      { pref: 'ASS', label: '🍗 Assados', cat: '🍗 Assados & Porções' },
                      { pref: 'COK', label: '🍹 Drinks', cat: '🍹 Coquetéis & Drinks' },
                    ].map((btn) => (
                      <button
                        key={btn.pref}
                        type="button"
                        style={{
                          background: cadCod.startsWith(btn.pref) ? '#d97706' : '#f1f5f9',
                          color: cadCod.startsWith(btn.pref) ? '#ffffff' : '#334155',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '3px 7px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setCadCod(gerarCodigoInternoAutomatico(btn.pref));
                          setCadCategoria(btn.cat);
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grupo-input">
                  <label className="rotulo-campo">Nome do Produto</label>
                  <input
                    type="text"
                    id="cad-nome"
                    className="input-modal"
                    placeholder="Ex: Espetinho de Carne Bovina, Dose de Gin Tropical, Saco de Gelo 5kg..."
                    value={cadNome}
                    onChange={(e) => setCadNome(e.target.value)}
                    required
                  />
                </div>

                <div className="grupo-input">
                  <label className="rotulo-campo">Categoria</label>
                  <input
                    type="text"
                    id="cad-categoria"
                    className="input-modal"
                    placeholder="Ex: Espetinhos, Bebidas Balcão, Porções..."
                    value={cadCategoria}
                    onChange={(e) => setCadCategoria(e.target.value)}
                  />
                </div>

                <div className="grupo-input">
                  <label className="rotulo-campo">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    id="cad-preco"
                    className="input-modal"
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    value={cadPreco}
                    onChange={(e) => setCadPreco(e.target.value)}
                    required
                  />
                </div>

                <div className="grupo-input">
                  <label className="rotulo-campo">Preço de Custo (Opcional - R$)</label>
                  <input
                    type="number"
                    id="cad-custo"
                    className="input-modal"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={cadCusto}
                    onChange={(e) => setCadCusto(e.target.value)}
                  />
                </div>

                {/* Configuração de Estoque Contínuo */}
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setCadEstoqueIlimitado(!cadEstoqueIlimitado)}
                >
                  <input
                    type="checkbox"
                    checked={cadEstoqueIlimitado}
                    onChange={(e) => setCadEstoqueIlimitado(e.target.checked)}
                    style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#15803d' }}>
                      ♾️ Estoque Ilimitado / Produção Contínua
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#166534' }}>
                      Permite vender sempre 1, 2 ou mais unidades sem bloquear o caixa por falta de estoque.
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* FLUXO PADRÃO INDUSTRIAL COM CÓDIGO DE BARRAS (EAN) */
              <>
                <div className="grupo-input">
                  <label className="rotulo-campo">Código de Barras (EAN / GTIN)</label>
                  <div className="linha-input" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <input
                      type="text"
                      id="cad-cod"
                      className="input-modal"
                      placeholder="Ex: 7891000379585"
                      value={cadCod}
                      onChange={(e) => setCadCod(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          buscarProdutoPeloCodigo(cadCod);
                        }
                      }}
                      required
                    />
                    <button
                      type="button"
                      style={{
                        padding: '0 14px',
                        height: '42px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap',
                        background: 'var(--primario)',
                        color: '#fff',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                      onClick={() => buscarProdutoPeloCodigo(cadCod)}
                      disabled={buscandoProdutoCodigo || !cadCod.trim()}
                      title="Buscar produto pelo código de barras digitado"
                    >
                      {buscandoProdutoCodigo ? '⏳' : '🔍 Buscar'}
                    </button>
                    <button className="btn-cam-pequeno" onClick={abrirLeitorCadastro} title="Escanear Código de Barras com Câmera">
                      📷
                    </button>
                  </div>
                  {!isProdutoBloqueadoParaEdicaoMestre && (
                    <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <button
                        type="button"
                        style={{
                          background: 'var(--primario)',
                          color: '#fff',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 4px rgba(2,132,199,0.2)',
                        }}
                        onClick={() => consultarEANGemini()}
                        disabled={consultandoEAN || !cadCod.trim()}
                      >
                        {consultandoEAN
                          ? '⏳ Consultando...'
                          : '🌐 Buscar Código na Web (Nome, Foto, Categoria & NCM)'}
                      </button>

                    </div>
                  )}
                </div>
                <div className="grupo-input">
                  <label className="rotulo-campo">Nome Detalhado do Produto</label>
                  <input
                    type="text"
                    id="cad-nome"
                    className="input-modal"
                    placeholder="Ex: Achocolatado em Pó Nestlé Nescau 2.0 Lata 370g"
                    value={cadNome}
                    disabled={isProdutoBloqueadoParaEdicaoMestre}
                    readOnly={isProdutoBloqueadoParaEdicaoMestre}
                    style={{
                      background: isProdutoBloqueadoParaEdicaoMestre ? '#f8fafc' : '#ffffff',
                      color: isProdutoBloqueadoParaEdicaoMestre ? '#334155' : 'inherit',
                      cursor: isProdutoBloqueadoParaEdicaoMestre ? 'not-allowed' : 'text',
                      borderColor: isProdutoBloqueadoParaEdicaoMestre ? '#cbd5e1' : undefined,
                    }}
                    onChange={(e) => setCadNome(e.target.value)}
                    required
                  />
                </div>
                <div className="grupo-input">
                  <label className="rotulo-campo">Marca</label>
                  <input
                    type="text"
                    id="cad-marca"
                    className="input-modal"
                    placeholder="Ex: Nestlé, Coca-Cola, Piracanjuba"
                    value={cadMarca}
                    disabled={isProdutoBloqueadoParaEdicaoMestre}
                    readOnly={isProdutoBloqueadoParaEdicaoMestre}
                    style={{
                      background: isProdutoBloqueadoParaEdicaoMestre ? '#f8fafc' : '#ffffff',
                      color: isProdutoBloqueadoParaEdicaoMestre ? '#334155' : 'inherit',
                      cursor: isProdutoBloqueadoParaEdicaoMestre ? 'not-allowed' : 'text',
                      borderColor: isProdutoBloqueadoParaEdicaoMestre ? '#cbd5e1' : undefined,
                    }}
                    onChange={(e) => setCadMarca(e.target.value)}
                  />
                </div>
                <div className="grupo-input">
                  <label className="rotulo-campo">Categoria do Produto</label>
                  <div className="linha-input">
                    <input
                      type="text"
                      id="cad-categoria"
                      list="lista-categorias-sugestoes"
                      className="input-modal"
                      placeholder="Ex: Achocolatados em Pó, Bebidas, Laticínios, Limpeza..."
                      value={cadCategoria}
                      disabled={isProdutoBloqueadoParaEdicaoMestre}
                      readOnly={isProdutoBloqueadoParaEdicaoMestre}
                      style={{
                        marginBottom: 0,
                        background: isProdutoBloqueadoParaEdicaoMestre ? '#f8fafc' : '#ffffff',
                        color: isProdutoBloqueadoParaEdicaoMestre ? '#334155' : 'inherit',
                        cursor: isProdutoBloqueadoParaEdicaoMestre ? 'not-allowed' : 'text',
                        borderColor: isProdutoBloqueadoParaEdicaoMestre ? '#cbd5e1' : undefined,
                      }}
                      onChange={(e) => setCadCategoria(e.target.value)}
                    />
                    {!isProdutoBloqueadoParaEdicaoMestre && (
                      <select
                        className="input-modal"
                        style={{ width: 'auto', minWidth: '130px', marginBottom: 0, fontSize: '0.82rem', background: '#f8fafc' }}
                        value=""
                        onChange={(e) => {
                          if (e.target.value) setCadCategoria(e.target.value);
                        }}
                        title="Selecionar das categorias sugeridas"
                      >
                        <option value="">📂 Sugestões...</option>
                        {LISTA_CATEGORIAS.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <datalist id="lista-categorias-sugestoes">
                    {Array.from(
                      new Set([
                        ...LISTA_CATEGORIAS,
                        ...catalogoGlobal.map((c) => c.categoria).filter(Boolean),
                        ...estoque.map((e) => e.categoria).filter(Boolean),
                      ])
                    ).map((cat) => (
                      <option key={cat as string} value={cat as string} />
                    ))}
                  </datalist>
                </div>

                {/* CAMPOS DO ESTOQUE DA LOJA (Quantidade, Lote, Validade, Preço de Custo, Preço de Venda) */}
                {(perfilAtivo !== 'dona_app' || modoCadastroItem === 'estoque') && (
                  <>
                    <div className="grupo-input">
                      <label className="rotulo-campo">Quantidade em Estoque</label>
                      <input
                        type="number"
                        id="cad-qtd"
                        className="input-modal"
                        placeholder="Qtd de unidades"
                        min="1"
                        value={cadQtd}
                        onChange={(e) => setCadQtd(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grupo-input">
                      <label className="rotulo-campo">Lote do Produto</label>
                      <div className="linha-input">
                        <input
                          type="text"
                          id="cad-lote"
                          className="input-modal"
                          placeholder="Ex: LOTE-104526 (ou deixe em branco p/ gerar auto)"
                          value={cadLote}
                          onChange={(e) => setCadLote(e.target.value)}
                        />
                        <button className="btn-cam-pequeno" onClick={abrirLeitorLote} title="Fotografar Carimbo de Lote e Validade com IA">
                          📷
                        </button>
                      </div>
                    </div>
                    <div className="grupo-input">
                      <label className="rotulo-campo">Data de Validade</label>
                      <input
                        type="date"
                        id="cad-val"
                        className="input-modal"
                        value={cadVal}
                        onChange={(e) => setCadVal(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grupo-input">
                      <label className="rotulo-campo">Preço de Custo (R$)</label>
                      <input
                        type="number"
                        id="cad-custo"
                        className="input-modal"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        value={cadCusto}
                        onChange={(e) => setCadCusto(e.target.value)}
                      />
                    </div>
                    <div className="grupo-input">
                      <label className="rotulo-campo">Preço de Venda (R$)</label>
                      <input
                        type="number"
                        id="cad-preco"
                        className="input-modal"
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        value={cadPreco}
                        onChange={(e) => setCadPreco(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div className="grupo-input">
              <label className="rotulo-campo">Foto do Produto (Packshot Fundo Branco)</label>
              {!isProdutoBloqueadoParaEdicaoMestre && (
                <input
                  type="file"
                  id="cad-foto"
                  accept="image/*"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                  onChange={carregarFoto}
                />
              )}
              <div
                className="preview-foto"
                id="preview-foto"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  marginTop: '6px',
                  minHeight: '140px',
                  position: 'relative',
                }}
              >
                {fotoTemp ? (
                  <>
                    <img
                      src={fotoTemp}
                      alt="Preview Produto Fundo Branco"
                      referrerPolicy="no-referrer"
                      style={{ maxHeight: '110px', maxWidth: '100%', objectFit: 'contain' }}
                    />
                    {!isProdutoBloqueadoParaEdicaoMestre && (
                      <div
                        style={{
                          marginTop: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '0.75rem',
                          color: '#166534',
                        }}
                      >
                        <span>
                          ⚡ <b>Otimizada:</b> ~{calcularTamanhoImagemKB(fotoTemp)} KB
                        </span>
                        <button
                          type="button"
                          onClick={() => setFotoTemp('')}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc2626',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            padding: '2px 6px',
                          }}
                          title="Remover foto"
                        >
                          ✕ Remover
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '10px', color: '#94a3b8' }}>
                    <div style={{ fontSize: '0.82rem', marginBottom: '4px' }}>Sem foto vinculada</div>
                    {!isProdutoBloqueadoParaEdicaoMestre && (
                      <div style={{ fontSize: '0.73rem', color: '#64748b' }}>
                        💡 Envie fotos em qualquer resolução (celular/câmera/downloads): o sistema comprime automaticamente para o menor tamanho possível antes de salvar no banco.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="grupo-botoes" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <button className="btn btn-salvar" style={{ flex: 1 }} onClick={salvarProduto}>
                  💾 Salvar Produto
                </button>
                <button className="btn btn-cancelar" style={{ flex: 1 }} onClick={() => setModalCadastroVisivel(false)}>
                  Cancelar
                </button>
              </div>
              {codigoEditando && (
                <button
                  type="button"
                  className="btn"
                  style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: '1px solid #fca5a5',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                  onClick={() => {
                    excluirProduto(codigoEditando.codigo, codigoEditando.validade, codigoEditando.lote);
                  }}
                >
                  🗑️ Excluir Produto do Estoque
                </button>
              )}
            </div>
            <div className="msg" id="msg-cad">
              {msgCad}
            </div>
          </div>
        </div>
      </div>

      {/* STOCK REDUCTION MODAL */}
      <div className="modal" id="modalVenda" style={{ display: modalVendaVisivel ? 'flex' : 'none' }}>
        <div className="modal-conteudo">
          <div className="cab-modal" id="titulo-modal-baixa">
            🛒 Baixa de Estoque / Realizar Venda
          </div>
          {prodAtual && (
            <div className="corpo-modal" id="corpo-venda">
              <div style={{ textAlign: 'center' }}>
                <div className="preview-foto" style={{ height: '120px', margin: '0 auto 8px auto', maxWidth: '160px' }}>
                  {(() => {
                    const fotoModal = obterFotoProduto(prodAtual.codigo, prodAtual.foto);
                    return fotoModal ? (
                      <img src={fotoModal} alt={prodAtual.nome} referrerPolicy="no-referrer" loading="lazy" decoding="async" />
                    ) : (
                      'Sem imagem'
                    );
                  })()}
                </div>
                <h3 style={{ marginBottom: '2px', fontSize: '1rem' }}>{prodAtual.nome}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--texto-secundario)' }}>
                  {prodAtual.tipoCadastro === 'interno' || prodAtual.estoqueIlimitado ? (
                    <span style={{ color: '#d97706', fontWeight: 700 }}>
                      🍢 Produto Interno / Adega • Cód: {prodAtual.codigo}
                    </span>
                  ) : (
                    <>Cód: {prodAtual.codigo} | Lote: {prodAtual.lote || 'N/D'} | Val: {formatarData(prodAtual.validade)}</>
                  )}
                </p>
                <p style={{ fontSize: '0.85rem', margin: '4px 0' }}>
                  Venda: <b>R$ {Number(prodAtual.preco_venda || 0).toFixed(2)}</b> | Estoque:{' '}
                  <b>
                    {prodAtual.tipoCadastro === 'interno' || prodAtual.estoqueIlimitado
                      ? '♾️ Ilimitado (Contínuo)'
                      : `${prodAtual.quantidade} un`}
                  </b>
                </p>
                {isProdAtualVencido && !(prodAtual.tipoCadastro === 'interno' || prodAtual.estoqueIlimitado) && (
                  <div
                    style={{
                      background: '#fee2e2',
                      color: '#991b1b',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      marginTop: '4px',
                    }}
                  >
                    ⚠️ Atenção: Este lote específico está vencido ({prodAtual.validade}). Para descartar como perda, acesse a Central de Notificações.
                  </div>
                )}
              </div>

              {/* Se houver outros lotes em estoque deste mesmo produto, permitir selecionar o lote */}
              {(() => {
                const outrosLotes = estoque.filter((p) => p.codigo === prodAtual.codigo && p.quantidade > 0);
                if (outrosLotes.length > 1) {
                  return (
                    <div className="grupo-input" style={{ marginTop: '8px' }}>
                      <label className="rotulo-campo">Selecionar Lote / Validade:</label>
                      <select
                        className="input-modal"
                        value={`${prodAtual.validade}_${prodAtual.lote}`}
                        onChange={(e) => {
                          const [val, lot] = e.target.value.split('_');
                          const itemEscolhido = estoque.find(
                            (it) => it.codigo === prodAtual.codigo && it.validade === val && it.lote === (lot || '')
                          );
                          if (itemEscolhido) {
                            setProdAtual(itemEscolhido);
                            setQtdBaixa(1);
                          }
                        }}
                      >
                        {outrosLotes.map((l, lIdx) => (
                          <option key={`${l.validade}_${l.lote}_${lIdx}`} value={`${l.validade}_${l.lote}`}>
                            Val: {formatarData(l.validade)} | Lote: {l.lote || 'N/D'} ({l.quantidade} un disp.)
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }
                return null;
              })()}

              <div className="grupo-input" style={{ marginTop: '10px' }}>
                <label className="rotulo-campo">Forma de Pagamento</label>
                <select
                  className="input-modal"
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value as any)}
                >
                  <option value="pix">📱 PIX</option>
                  <option value="cartao_credito">💳 Cartão de Crédito</option>
                  <option value="cartao_debito">💳 Cartão de Débito</option>
                  <option value="dinheiro">💵 Dinheiro (Espécie)</option>
                  <option value="fiado">📝 Compra em Fiado (Caderneta de Cliente)</option>
                </select>
              </div>

              {formaPagamento === 'fiado' && (
                <div className="grupo-input" style={{ marginTop: '10px', background: '#fef2f2', padding: '12px', borderRadius: '8px', border: '1px solid #fca5a5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="rotulo-campo" style={{ color: '#991b1b', margin: 0, fontWeight: 700 }}>
                      👤 Selecione o Cliente Cadastrado:
                    </label>
                    <button
                      type="button"
                      onClick={() => setModalDevedoresVisivel(true)}
                      style={{
                        background: '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ➕ Novo Cliente
                    </button>
                  </div>
                  <select
                    className="input-modal"
                    value={clienteFiadoSelecionadoId}
                    onChange={(e) => setClienteFiadoSelecionadoId(e.target.value)}
                    style={{ marginBottom: '4px' }}
                  >
                    <option value="">-- Selecione o Cliente Devedor --</option>
                    {clientesDevedores.map((c, cIdx) => (
                      <option key={`cli_dev_${c.id || cIdx}_${cIdx}`} value={c.id}>
                        {c.nome} {c.cpfCnpj ? `(${c.cpfCnpj})` : ''} - Saldo Dev: R$ {Number(c.saldoDevedorTotal || 0).toFixed(2)}
                      </option>
                    ))}
                  </select>
                  {clientesDevedores.length === 0 && (
                    <div style={{ fontSize: '0.78rem', color: '#b91c1c', marginTop: '4px' }}>
                      ⚠️ Nenhum cliente cadastrado ainda! Clique no botão <b>"+ Novo Cliente"</b> acima para cadastrar.
                    </div>
                  )}
                  {clienteFiadoSelecionadoId && (() => {
                    const cli = clientesDevedores.find((c) => c.id === clienteFiadoSelecionadoId);
                    if (!cli) return null;
                    return (
                      <div style={{ fontSize: '0.78rem', color: '#7f1d1d', marginTop: '6px', background: '#fff', padding: '6px 10px', borderRadius: '6px' }}>
                        <div><b>Telefone:</b> {cli.telefone || 'N/D'}</div>
                        <div><b>Saldo Devedor Atual:</b> R$ {Number(cli.saldoDevedorTotal || 0).toFixed(2)}</div>
                        <div><b>Limite de Fiado:</b> {cli.limiteFiado ? `R$ ${Number(cli.limiteFiado || 0).toFixed(2)}` : 'Sem limite'}</div>
                      </div>
                    );
                  })()}
                </div>
              )}

              <div className="grupo-input" style={{ marginTop: '10px' }}>
                <label className="rotulo-campo">Quantidade para baixa / venda</label>
                <input
                  type="number"
                  id="qtd-baixa"
                  className="input-modal"
                  min="1"
                  max={prodAtual.quantidade}
                  value={qtdBaixa === '' ? '' : qtdBaixa}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setQtdBaixa('');
                      return;
                    }
                    const limpo = val.replace(/^0+(?=\d)/, '');
                    const num = parseInt(limpo, 10);
                    setQtdBaixa(isNaN(num) ? '' : num);
                  }}
                  onBlur={() => {
                    if (qtdBaixa === '' || Number(qtdBaixa) < 1) {
                      setQtdBaixa(1);
                    }
                  }}
                />
              </div>
              <div className="total-texto">
                Total: R${' '}
                <span id="total-v">
                  {(
                    Number(prodAtual.preco_venda || 0) *
                    (typeof qtdBaixa === 'number' ? qtdBaixa : parseInt(qtdBaixa, 10) || 0)
                  )
                    .toFixed(2)
                    .replace('.', ',')}
                </span>
              </div>

              {(!sessaoCaixaAtiva || sessaoCaixaAtiva.status !== 'aberto') && (
                <div
                  style={{
                    background: '#fee2e2',
                    border: '1px solid #f87171',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    margin: '10px 0',
                    textAlign: 'center',
                    color: '#991b1b',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                  }}
                >
                  <div>🔴 Caixa Fechado! Abra o turno de caixa para concluir vendas.</div>
                  <button
                    type="button"
                    className="btn btn-salvar"
                    style={{
                      background: '#dc2626',
                      marginTop: '6px',
                      padding: '6px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}
                    onClick={() => {
                      setModalVendaVisivel(false);
                      setModalCaixaVisivel(true);
                    }}
                  >
                    💵 Abrir Turno de Caixa Agora →
                  </button>
                </div>
              )}

              <div className="grupo-botoes" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <button
                    type="button"
                    className="btn"
                    style={{
                      flex: 1,
                      background: '#0284c7',
                      color: '#ffffff',
                      fontWeight: 700,
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                    }}
                    onClick={() => {
                      const qtd = typeof qtdBaixa === 'number' ? qtdBaixa : parseInt(qtdBaixa, 10) || 1;
                      adicionarAoCarrinho(prodAtual, qtd);
                      setModalVendaVisivel(false);
                      setModalCarrinhoVisivel(true);
                    }}
                  >
                    <span>🛒</span>
                    <span>Colocar no Carrinho</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-salvar"
                    style={{
                      flex: 1,
                      background: (!sessaoCaixaAtiva || sessaoCaixaAtiva.status !== 'aberto') ? '#94a3b8' : 'var(--sucesso)',
                      cursor: (!sessaoCaixaAtiva || sessaoCaixaAtiva.status !== 'aberto') ? 'not-allowed' : 'pointer',
                    }}
                    disabled={!sessaoCaixaAtiva || sessaoCaixaAtiva.status !== 'aberto'}
                    onClick={confirmarBaixa}
                  >
                    ⚡ Baixar Só Este Item
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '4px' }}>
                  <button
                    type="button"
                    className="btn"
                    style={{
                      flex: 1,
                      background: '#f8fafc',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setModalVendaVisivel(false);
                      editarProduto(prodAtual.codigo, prodAtual.validade, prodAtual.lote || '');
                    }}
                  >
                    ✏️ Editar Dados
                  </button>
                  <button
                    type="button"
                    className="btn"
                    style={{
                      flex: 1,
                      background: '#fef2f2',
                      color: '#dc2626',
                      border: '1px solid #fca5a5',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      excluirProduto(prodAtual.codigo, prodAtual.validade, prodAtual.lote || '');
                    }}
                  >
                    🗑️ Excluir Produto
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-cancelar"
                  style={{ width: '100%', marginTop: '2px' }}
                  onClick={() => setModalVendaVisivel(false)}
                >
                  Fechar
                </button>
              </div>
              <div className="msg" id="msg-venda">
                {msgVenda}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CENTRO DE NOTIFICAÇÕES & REPOSIÇÃO DE ESTOQUE MODAL */}
      <CentroNotificacoesModal
        visivel={modalNotificacoesVisivel}
        onFechar={() => setModalNotificacoesVisivel(false)}
        estoque={estoque}
        catalogoGlobal={catalogoGlobal}
        supermercado={listaSupermercados.find((s) => s.id === supermercadoAtual) || null}
        nomeSupermercado={nomeSupermercadoAtivo}
        limiarEstoqueMinimo={limiarEstoqueMinimo}
        onAlterarLimiarEstoque={alterarLimiarEstoque}
        onAbrirReposicao={abrirReposicaoProduto}
        onAbrirVenda={(cod, val, lot) => {
          setModalNotificacoesVisivel(false);
          abrirVenda(cod, val, lot);
        }}
        onDarBaixaPerda={handleDarBaixaPerda}
        onAbrirAlertasWhatsApp={() => {
          setModalNotificacoesVisivel(false);
          if (verificarPermissaoOuAvisar('alertas_whatsapp', 'alertas_whatsapp', 'Alertas WhatsApp / E-mail')) {
            setModalAlertasWhatsAppVisivel(true);
          }
        }}
        abaInicial={abaNotificacoesInicial}
      />

      {/* POPUP DE ALERTA DE ACESSO RESTRITO / PERMISSÃO NEGADA */}
      <div className="modal" style={{ display: avisoRestrito ? 'flex' : 'none', zIndex: 100950 }}>
        <div className="modal-conteudo" style={{ maxWidth: '420px', borderTop: '6px solid #ef4444' }}>
          <div className="cab-modal" style={{ background: '#fef2f2', color: '#991b1b', borderBottom: '1px solid #fee2e2' }}>
            🔒 Acesso Bloqueado / Restrição de Perfil
          </div>
          <div className="corpo-modal" style={{ textAlign: 'center', padding: '20px 16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🛑</div>
            <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.5, marginBottom: '20px' }}>
              {avisoRestrito}
            </p>
            <button
              className="btn"
              style={{ background: 'var(--primario)', color: '#fff', width: '100%', padding: '10px', fontSize: '0.9rem', fontWeight: 600 }}
              onClick={() => setAvisoRestrito(null)}
            >
              Entendido
            </button>
          </div>
        </div>
      </div>

      {/* POPUP DE SESSÃO ENCERRADA POR LOGIN EM OUTRO DISPOSITIVO */}
      <div className="modal" style={{ display: avisoDesconectadoMultiAparelho ? 'flex' : 'none', zIndex: 999999 }}>
        <div className="modal-conteudo" style={{ maxWidth: '440px', borderTop: '6px solid #f59e0b', borderRadius: '16px' }}>
          <div className="cab-modal" style={{ background: '#fffbeb', color: '#92400e', borderBottom: '1px solid #fef3c7' }}>
            📱 Desconectado por Login em Outro Aparelho
          </div>
          <div className="corpo-modal" style={{ textAlign: 'center', padding: '24px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📲</div>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: '0 0 10px 0', fontWeight: 800 }}>
              Sessão Conectada em Outro Aparelho
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, marginBottom: '22px' }}>
              {avisoDesconectadoMultiAparelho}
            </p>
            <button
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#fff',
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => {
                setAvisoDesconectadoMultiAparelho(null);
                setTelaLoginVisivel(true);
              }}
            >
              Fazer Login Novamente
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE CARRINHO DE COMPRAS / BAIXA MÚLTIPLA */}
      <CarrinhoVendaModal
        visivel={modalCarrinhoVisivel}
        onFechar={() => setModalCarrinhoVisivel(false)}
        carrinho={carrinho}
        estoqueDisponivel={estoque}
        onAlterarQuantidade={alterarQuantidadeCarrinho}
        onRemoverItem={removerItemCarrinho}
        onLimparCarrinho={limparCarrinho}
        onAdicionarOutroProduto={() => setModalCarrinhoVisivel(false)}
        onFinalizarVenda={finalizarVendaCarrinho}
        onAdicionarItemRapido={(item, qtd = 1) => adicionarAoCarrinho(item, qtd)}
        clientesDevedores={clientesDevedores}
        onAbrirCadastroCliente={() => {
          setModalCarrinhoVisivel(false);
          setModalDevedoresVisivel(true);
        }}
        sessaoCaixaAberta={!!(sessaoCaixaAtiva && sessaoCaixaAtiva.status === 'aberto')}
        onAbrirCaixaModal={() => {
          setModalCarrinhoVisivel(false);
          setModalCaixaVisivel(true);
        }}
        obterFotoProduto={obterFotoProduto}
        onAbrirLeitorCameraContinuo={abrirLeitorCarrinho}
        ultimoItemBipadoToast={ultimoItemBipadoToast}
      />

      {/* CENTRAL ÚNICA DE RELATÓRIOS & DESEMPENHO (VENDAS, LUCRO REAL, ESTOQUE & DELIVERY) */}
      <CentralRelatoriosModal
        visivel={modalCentralRelatoriosVisivel}
        onFechar={() => setModalCentralRelatoriosVisivel(false)}
        vendas={vendas}
        estoque={estoque}
        operadores={listaOperadores}
        nomeLoja={nomeSupermercadoAtivo}
        pedidosDelivery={pedidosDelivery}
        catalogoGlobal={catalogoGlobal}
        onEstornarVenda={handleEstornarVenda}
        onVerCupom={(venda) => setVendaCupomVer(venda)}
        abaInicial={abaRelatorioInicial}
      />

      {/* MÓDULO DE GESTÃO DE DELIVERY (ESTILO ZÉ DELIVERY - PAINEL LOJISTA) */}
      <GestaoDeliveryModal
        visivel={modalGestaoDeliveryVisivel}
        onFechar={() => setModalGestaoDeliveryVisivel(false)}
        pedidos={pedidosDelivery}
        configDelivery={configDelivery}
        onSalvarConfig={handleSalvarConfigDelivery}
        onAtualizarStatusPedido={handleAtualizarStatusPedidoDelivery}
        onConfirmarEntregaPin={handleConfirmarEntregaPin}
        onAbrirCardapioCliente={() => {
          setModalGestaoDeliveryVisivel(false);
          setModalCardapioClienteVisivel(true);
        }}
        estoque={estoque}
        lojaAtual={listaSupermercados.find((l) => l.id === supermercadoAtual) || null}
        onSimularNovoPedidoTeste={handleSimularPedidoTeste}
      />

      {/* CARDÁPIO ONLINE DO CLIENTE (MESMO PADRÃO DO PDV) */}
      <CardapioClienteDeliveryModal
        visivel={modalCardapioClienteVisivel}
        onFechar={() => setModalCardapioClienteVisivel(false)}
        estoque={estoque}
        loja={
          listaSupermercados.find(
            (l) => l.id === supermercadoAtual || (l.slug && l.slug === supermercadoAtual)
          ) || listaSupermercados[0] || null
        }
        configDelivery={configDelivery}
        onCriarPedido={handleCriarPedidoCliente}
        pedidosExistentes={pedidosDelivery}
        obterFotoProduto={obterFotoProduto}
        obterNomeProduto={obterNomeProduto}
        carregando={carregandoEstoqueInicial}
        onTrocarParaFuncionario={() => {
          setModalCardapioClienteVisivel(false);
          setTelaLoginVisivel(true);
        }}
      />

      {/* MODAIS DE RELATÓRIO DE VENDAS E GRÁFICOS */}
      <RelatorioVendasModal
        visivel={modalRelatorioVendasVisivel}
        onFechar={() => setModalRelatorioVendasVisivel(false)}
        vendas={vendas}
        onEstornarVenda={handleEstornarVenda}
        operadores={listaOperadores}
        nomeLoja={nomeSupermercadoAtivo}
        onVerCupom={(venda) => setVendaCupomVer(venda)}
        catalogoGlobal={catalogoGlobal}
        estoque={estoque}
      />

      <GraficosVendasModal
        visivel={modalGraficosVendasVisivel}
        onFechar={() => setModalGraficosVendasVisivel(false)}
        vendas={vendas}
        estoque={estoque}
        nomeLoja={nomeSupermercadoAtivo}
        catalogoGlobal={catalogoGlobal}
      />

      {/* MODAL DE CUPOM DE VENDA / IMPRESSÃO */}
      <CupomVendaModal
        visivel={!!vendaCupomVer}
        onFechar={() => setVendaCupomVer(null)}
        venda={vendaCupomVer}
        loja={listaSupermercados.find((l) => l.id === supermercadoAtual) || null}
      />

      {/* MODAL DE IMPRESSÃO DE ETIQUETAS DE PRATELEIRA */}
      <EtiquetasModal
        visivel={modalEtiquetasVisivel}
        onFechar={() => setModalEtiquetasVisivel(false)}
        estoque={estoque}
        loja={listaSupermercados.find((l) => l.id === supermercadoAtual) || null}
      />

      {/* MODAL DE GESTÃO DO TURNO DE CAIXA, SANGRIA E FECHAMENTO */}
      <GestaoCaixaModal
        visivel={modalCaixaVisivel}
        onFechar={() => {
          setModalCaixaVisivel(false);
          setMotivoCaixaObrigatorio(null);
          setAbaCaixaInicial('status');
        }}
        sessaoAtiva={sessaoCaixaAtiva}
        vendasSessao={vendas.filter((v) => {
          if (!sessaoCaixaAtiva) return true;
          if (v.lojaId && v.lojaId !== supermercadoAtual) return false;
          if (v.operadorId && v.operadorId !== sessaoCaixaAtiva.operadorId) return false;
          if (sessaoCaixaAtiva.timestampAbertura && v.timestamp) {
            return v.timestamp >= sessaoCaixaAtiva.timestampAbertura;
          }
          return v.data === sessaoCaixaAtiva.dataAbertura;
        })}
        movimentacoes={movimentacoesCaixa}
        onAbrirCaixa={handleAbrirCaixa}
        onRegistrarMovimentacao={handleRegistrarMovimentacaoCaixa}
        onFecharCaixa={handleFecharCaixa}
        operadorAtivo={listaOperadores.find((op) => op.id === operadorAtivoId) || null}
        loja={listaSupermercados.find((l) => l.id === supermercadoAtual) || null}
        listaOperadores={listaOperadores}
        abaInicial={abaCaixaInicial}
        motivoObrigatorio={motivoCaixaObrigatorio}
      />

      {/* MODAL DE ALERTAS DE VALIDADE NO WHATSAPP / E-MAIL */}
      <AlertasWhatsAppModal
        visivel={modalAlertasWhatsAppVisivel}
        onFechar={() => setModalAlertasWhatsAppVisivel(false)}
        estoque={estoque}
        loja={listaSupermercados.find((l) => l.id === supermercadoAtual) || null}
      />

      {/* MODAL DE GESTÃO DE ÁREA DE DEVEDORES (CADERNETA FIADO) */}
      <GestaoDevedoresModal
        visivel={modalDevedoresVisivel}
        onFechar={() => setModalDevedoresVisivel(false)}
        clientes={clientesDevedores || []}
        lojaId={supermercadoAtual}
        nomeLoja={nomeSupermercadoAtivo}
        operadorAtualNome={listaOperadores.find((op) => op.id === operadorAtivoId)?.nome || 'Operador'}
        onSalvarCliente={handleSalvarClienteDevedor}
        onExcluirCliente={handleExcluirClienteDevedor}
        onRegistrarPagamento={handleRegistrarPagamentoFiado}
      />

      {/* MODAL DO TERMO DE CONCORDÂNCIA E SIGILO DO USUÁRIO (APARECE APENAS 1 VEZ NO PRIMEIRO LOGIN DO DISPOSITIVO) */}
      <TermoConcordanciaModal
        visivel={modalTermoVisivel}
        onFechar={() => setModalTermoVisivel(false)}
        onAceitar={(registro) => {
          const idContaLogin =
            perfilAtivo === 'dona_app'
              ? 'dona_master'
              : perfilAtivo === 'admin_loja'
              ? `loja_${supermercadoAtual || 'padrao'}`
              : `op_${operadorAtivoId || 'caixa'}_${supermercadoAtual || 'padrao'}`;

          const userChaveTermo = `termo_aceito_${idContaLogin}`;
          const chaveTermoDispositivoLogin = `termo_unico_dispositivo_${idContaLogin}`;
          const chavePendente1 = localStorage.getItem('ultima_chave_termo_pendente');
          const chavePendente2 = localStorage.getItem('ultima_chave_termo_disp_pendente');

          const nomeUsuarioValido =
            registro?.usuarioNome ||
            (perfilAtivo === 'dona_app'
              ? 'Dono / Administrador Master do Aplicativo'
              : perfilAtivo === 'admin_loja'
              ? `Administrador da Loja (${nomeSupermercadoAtivo})`
              : opAtualLogado?.nome || 'Operador de Caixa');

          const perfilValido = registro?.perfil || perfilAtivo || 'caixa';
          const versaoValida = registro?.versaoTermo || '2026.2-PROD';
          const dataValida = registro?.dataAceite || new Date().toLocaleDateString('pt-BR');

          const valorSalvar = JSON.stringify(registro || { aceitou: true, dataAceite: dataValida });
          try {
            localStorage.setItem(userChaveTermo, valorSalvar);
            localStorage.setItem(chaveTermoDispositivoLogin, 'true');
            localStorage.setItem('termo_uso_aceito_dispositivo_v1', 'true');
            if (chavePendente1) localStorage.setItem(chavePendente1, valorSalvar);
            if (chavePendente2) localStorage.setItem(chavePendente2, 'true');
          } catch {}
          safeLocalStorageSet(userChaveTermo, valorSalvar);

          setModalTermoVisivel(false);
          registrarLogAuditoria(
            'Termo de Concordância Aceito',
            `Usuário ${nomeUsuarioValido} (${perfilValido}) aceitou o termo versão ${versaoValida} em ${dataValida}`
          );
        }}
        onRecusar={() => {
          alert('Para utilizar o sistema do supermercado, é necessário concordar com os termos de segurança e uso.');
          setModalTermoVisivel(false);
          handleLogout();
        }}
        usuarioNome={
          perfilAtivo === 'dona_app'
            ? 'Dono / Administrador Master do Aplicativo'
            : perfilAtivo === 'admin_loja'
            ? `Administrador da Loja (${nomeSupermercadoAtivo})`
            : opAtualLogado?.nome || 'Operador de Caixa'
        }
        usuarioPerfil={perfilAtivo}
        perfilNome={
          perfilAtivo === 'dona_app'
            ? 'Proprietário(a) Master'
            : perfilAtivo === 'admin_loja'
            ? 'Administrador da Loja'
            : opAtualLogado?.cargo || 'Operador de Caixa'
        }
        lojaId={supermercadoAtual}
        lojaNome={nomeSupermercadoAtivo}
        apenasLeitura={termoApenasLeitura}
      />

      {/* MODAL DE ALTERAÇÃO DE LOGIN E SENHA DO DONO DO APP */}
      <AlterarCredenciaisDonoModal
        visivel={modalCredenciaisDonoVisivel}
        onFechar={() => setModalCredenciaisDonoVisivel(false)}
        onSalvarSucesso={(novasCredenciais) => {
          registrarLogAuditoria(
            'Credenciais Master Alteradas',
            `Dono do App alterou login/senha master com sucesso.`
          );
        }}
      />

      {/* MODAL DO MANUAL DO USUÁRIO ISOLADO POR PERMISSÃO */}
      <ManualUsuarioModal
        visivel={modalManualVisivel}
        onFechar={() => setModalManualVisivel(false)}
        perfilAtivo={perfilAtivo}
        permissoesOperador={opAtualLogado?.permissoes || PERMISSOES_CAIXA_PADRAO}
        permissoesLoja={lojaAtualObj?.permissoesLoja || PERMISSOES_LOJA_PADRAO}
        nomeLoja={nomeSupermercadoAtivo}
        nomeOperador={opAtualLogado?.nome}
      />

      {/* TELA DE LOGIN & CONTROLE DE ACESSO */}
      <TelaLogin
        visivel={telaLoginVisivel}
        listaSupermercados={listaSupermercados}
        onLoginSucesso={handleLoginSucesso}
        onAbrirCardapioCliente={() => setModalCardapioClienteVisivel(true)}
      />
    </>
  );
}
