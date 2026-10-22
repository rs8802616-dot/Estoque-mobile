import React, { useState, useMemo, useEffect } from 'react';
import {
  Pizza,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  MapPin,
  Phone,
  Clock,
  Send,
  X,
  Search,
  Sun,
  Moon,
  Flame,
  ChevronRight,
  Heart,
  ShieldCheck,
  History,
  RotateCcw,
  Sparkles,
  Lock,
  Store,
  Copy,
  Check,
} from 'lucide-react';
import { ItemEstoque, Supermercado, PedidoDelivery, ItemPedidoDelivery, TaxaBairro } from '../types';
import { formatCurrency, formatTime, formatDate } from '../utils/formatters';

const CUSTOMER_PROFILE_KEY = 'atendeja_customer_profile_v1';
const CUSTOMER_ORDERS_KEY = 'atendeja_customer_orders_v1';

export interface CustomerDeliveryViewProps {
  lojaSlug: string;
  lojas?: Supermercado[];
  estoque?: ItemEstoque[];
  onCriarPedido?: (pedido: PedidoDelivery) => void;
  pedidos?: PedidoDelivery[];
}

const BAIRROS_PADRAO: TaxaBairro[] = [
  { id: 'b1', nome: 'Centro', taxa: 5.00 },
  { id: 'b2', nome: 'Jardim América', taxa: 7.00 },
  { id: 'b3', nome: 'Vila Nova', taxa: 6.00 },
  { id: 'b4', nome: 'Bela Vista', taxa: 6.50 },
  { id: 'b5', nome: 'Consolação', taxa: 6.50 },
  { id: 'b6', nome: 'Pinheiros', taxa: 8.00 },
  { id: 'b7', nome: 'Outro Bairro (Taxa Padrão)', taxa: 8.00 },
];

const BEBIDAS_FALLBACK: ItemEstoque[] = [
  {
    codigo: '7891991000832',
    nome: 'Cerveja Heineken Long Neck 330ml (Gelada)',
    marca: 'Heineken',
    categoria: 'Cervejas Geladas',
    quantidade: 48,
    lote: 'L-HN01',
    validade: '2027-06-30',
    preco_custo: 5.50,
    preco_venda: 8.90,
    foto: 'https://images.unsplash.com/photo-1618886614638-80e3c15cd819?w=400&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '7891149103223',
    nome: 'Cerveja Brahma Duplo Malte Lata 350ml (Gelada)',
    marca: 'Brahma',
    categoria: 'Cervejas Geladas',
    quantidade: 72,
    lote: 'L-BR02',
    validade: '2027-04-15',
    preco_custo: 3.20,
    preco_venda: 5.49,
    foto: 'https://images.unsplash.com/photo-1608270199147-38e55e378c2e?w=400&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '7891991010831',
    nome: 'Cerveja Corona Extra 330ml (Gelada)',
    marca: 'Corona',
    categoria: 'Cervejas Geladas',
    quantidade: 36,
    lote: 'L-CR03',
    validade: '2027-08-20',
    preco_custo: 6.00,
    preco_venda: 9.90,
    foto: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=400&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '5000281005400',
    nome: 'Whisky Johnnie Walker Red Label 1L',
    marca: 'Johnnie Walker',
    categoria: 'Destilados & Drinks',
    quantidade: 15,
    lote: 'L-JW01',
    validade: '2030-12-31',
    preco_custo: 68.00,
    preco_venda: 99.90,
    foto: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '5010106113127',
    nome: 'Gin Tanqueray London Dry 750ml',
    marca: 'Tanqueray',
    categoria: 'Destilados & Drinks',
    quantidade: 12,
    lote: 'L-TQ01',
    validade: '2030-12-31',
    preco_custo: 82.00,
    preco_venda: 119.90,
    foto: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '7804320743120',
    nome: 'Vinho Tinto Casillero del Diablo Cabernet 750ml',
    marca: 'Concha y Toro',
    categoria: 'Vinhos',
    quantidade: 20,
    lote: 'L-CD01',
    validade: '2029-05-10',
    preco_custo: 35.00,
    preco_venda: 54.90,
    foto: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '7894900010015',
    nome: 'Refrigerante Coca-Cola 2 Litros (Gelada)',
    marca: 'Coca-Cola',
    categoria: 'Refrigerantes & Sucos',
    quantidade: 40,
    lote: 'L-CC01',
    validade: '2027-02-28',
    preco_custo: 7.20,
    preco_venda: 11.50,
    foto: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '9002490100070',
    nome: 'Energético Red Bull Energy Drink 250ml (Gelado)',
    marca: 'Red Bull',
    categoria: 'Refrigerantes & Sucos',
    quantidade: 50,
    lote: 'L-RB01',
    validade: '2027-09-15',
    preco_custo: 6.50,
    preco_venda: 10.90,
    foto: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '7898901234001',
    nome: 'Saco de Gelo Cubo Filtrado 5kg',
    marca: 'Gelo Cristal',
    categoria: 'Gelo & Petiscos',
    quantidade: 25,
    lote: 'L-GC01',
    validade: '2027-01-01',
    preco_custo: 7.00,
    preco_venda: 14.00,
    foto: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80',
    tipoCadastro: 'padrao',
  },
  {
    codigo: '7898901234002',
    nome: 'Carvão Vegetal Especial Churrasco 3kg',
    marca: 'Bom de Fogo',
    categoria: 'Gelo & Petiscos',
    quantidade: 20,
    lote: 'L-CV01',
    validade: '2030-01-01',
    preco_custo: 12.00,
    preco_venda: 21.90,
    foto: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80',
    tipoCadastro: 'padrao',
  },
];

export const CustomerDeliveryView: React.FC<CustomerDeliveryViewProps> = ({
  lojaSlug,
  lojas = [],
  estoque = [],
  onCriarPedido,
  pedidos = [],
}) => {
  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('atendeja_theme_dark') === 'true';
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('atendeja_theme_dark', String(next));
      return next;
    });
  };

  // Target Loja
  const targetLoja: Supermercado = useMemo(() => {
    const slugLower = (lojaSlug || '').toLowerCase();
    const found =
      lojas.find((l) => (l.slug || '').toLowerCase() === slugLower) ||
      lojas.find((l) => l.id.toLowerCase() === slugLower) ||
      lojas[0] || {
        id: 'loja_matriz_01',
        nome: 'Adega & Delivery Matriz Express',
        cnpj: '12.345.678/0001-90',
        senha: '123',
        slug: 'loja_matriz_01',
        marca: 'Adega Express',
        logo_url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200&q=80',
        taxa_entrega: 6.90,
        tempo_estimado_entrega: '30-45 min',
        taxas_bairro: BAIRROS_PADRAO,
        ativo: true,
      };

    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const paramMarca = urlParams?.get('marca');
    const paramNome = urlParams?.get('nome');
    const paramLogo = urlParams?.get('logo');

    return {
      ...found,
      marca: paramMarca || found.marca,
      nome: paramNome || found.nome,
      logo_url: paramLogo || found.logo_url,
    };
  }, [lojas, lojaSlug]);

  // Set document title
  useEffect(() => {
    const brand = targetLoja.marca ? `${targetLoja.marca} - ${targetLoja.nome}` : targetLoja.nome;
    document.title = `${brand} | Cardápio Digital & Delivery`;
  }, [targetLoja]);

  // Bairro Selecionado State
  const listaBairros = useMemo(() => {
    if (targetLoja.taxas_bairro && targetLoja.taxas_bairro.length > 0) {
      return targetLoja.taxas_bairro;
    }
    return BAIRROS_PADRAO;
  }, [targetLoja]);

  const [selectedBairroId, setSelectedBairroId] = useState<string>(() => {
    return localStorage.getItem('atendeja_customer_bairro_id') || (listaBairros[0]?.id || 'b1');
  });

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Products base
  const produtosBase = estoque && estoque.length > 0 ? estoque : BEBIDAS_FALLBACK;

  // Active Category Filter
  const [activeCategory, setActiveCategory] = useState<string>('todos');

  // Categories list extracted from products
  const categories = useMemo(() => {
    const catsMap = new Map<string, string>();
    produtosBase.forEach((p) => {
      const cat = p.categoria || 'Geral';
      if (!catsMap.has(cat)) {
        let icone = '🍺';
        const lower = cat.toLowerCase();
        if (lower.includes('cervej')) icone = '🍺';
        else if (lower.includes('destilad') || lower.includes('whisky') || lower.includes('gin')) icone = '🍸';
        else if (lower.includes('vinho')) icone = '🍷';
        else if (lower.includes('refrigerante') || lower.includes('suco') || lower.includes('água')) icone = '🥤';
        else if (lower.includes('gelo') || lower.includes('carvão') || lower.includes('snack')) icone = '🧊';
        else if (lower.includes('açougue') || lower.includes('carne')) icone = '🥩';
        else if (lower.includes('mercearia') || lower.includes('grão')) icone = '🌾';
        else icone = '📦';
        catsMap.set(cat, icone);
      }
    });

    return [
      { id: 'todos', nome: 'Todos', icone: '✨' },
      ...Array.from(catsMap.entries()).map(([nome, icone]) => ({
        id: nome,
        nome,
        icone,
      })),
    ];
  }, [produtosBase]);

  // Cart State (map by product id/codigo)
  const [cart, setCart] = useState<ItemPedidoDelivery[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Checkout Form State
  const [tipoPedido, setTipoPedido] = useState<'delivery' | 'retirada'>('delivery');
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [clienteEndereco, setClienteEndereco] = useState('');
  const [clienteNumero, setClienteNumero] = useState('');
  const [clienteComplemento, setClienteComplemento] = useState('');
  const [clienteReferencia, setClienteReferencia] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro'>('pix');
  const [trocoPara, setTrocoPara] = useState('');
  const [observacaoGeral, setObservacaoGeral] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState<PedidoDelivery | null>(null);
  const [showOrderHistoryModal, setShowOrderHistoryModal] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [pixCopiado, setPixCopiado] = useState(false);

  // Customer order history IDs saved locally
  const [customerOrderIds, setCustomerOrderIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(CUSTOMER_ORDERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Load saved customer profile on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(CUSTOMER_PROFILE_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.nome) setClienteNome(parsed.nome);
        if (parsed.telefone) setClienteTelefone(parsed.telefone);
        if (parsed.endereco) setClienteEndereco(parsed.endereco);
        if (parsed.numero) setClienteNumero(parsed.numero);
        if (parsed.complemento) setClienteComplemento(parsed.complemento);
        if (parsed.selectedBairroId) setSelectedBairroId(parsed.selectedBairroId);
        if (parsed.tipoPedido) setTipoPedido(parsed.tipoPedido);
        setProfileLoaded(true);
      }
    } catch (e) {
      console.warn('Erro ao carregar perfil salvo:', e);
    }
  }, []);

  // Filtered orders belonging to this customer
  const customerOrders = useMemo(() => {
    const cleanPhone = clienteTelefone.replace(/\D/g, '');
    return pedidos
      .filter((o) => {
        if (customerOrderIds.includes(o.id)) return true;
        if (cleanPhone.length >= 8 && o.cliente.telefone) {
          const ordPhone = o.cliente.telefone.replace(/\D/g, '');
          if (ordPhone && (ordPhone.includes(cleanPhone) || cleanPhone.includes(ordPhone))) {
            return true;
          }
        }
        return false;
      })
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [pedidos, customerOrderIds, clienteTelefone]);

  // Check active order
  const activeOrder = useMemo(() => {
    return customerOrders.find((o) => ['pendente', 'em_separacao', 'saiu_para_entrega'].includes(o.status));
  }, [customerOrders]);

  // Delivery fee calculation
  const selectedBairro = useMemo(() => {
    return listaBairros.find((b) => b.id === selectedBairroId) || listaBairros[0];
  }, [listaBairros, selectedBairroId]);

  const deliveryFee = useMemo(() => {
    if (tipoPedido === 'retirada') return 0;
    if (selectedBairro) return selectedBairro.taxa;
    return targetLoja.taxa_entrega || 6.90;
  }, [tipoPedido, selectedBairro, targetLoja.taxa_entrega]);

  // Cart Subtotal & Total
  const cartSubtotal = useMemo(() => cart.reduce((acc, it) => acc + it.subtotal, 0), [cart]);
  const cartTotal = cartSubtotal + (cart.length > 0 ? deliveryFee : 0);

  // Filter products by search (all products visible by default)
  const filteredProducts = useMemo(() => {
    return produtosBase.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nomeMatch = (p.nome || '').toLowerCase().includes(q);
        const marcaMatch = (p.marca || '').toLowerCase().includes(q);
        const codMatch = (p.codigo || '').toLowerCase().includes(q);
        const catMatch = (p.categoria || '').toLowerCase().includes(q);
        return nomeMatch || marcaMatch || codMatch || catMatch;
      }
      return true;
    });
  }, [produtosBase, searchQuery]);

  // Add product to cart
  const handleAddProduct = (item: ItemEstoque) => {
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.codigo === item.codigo);
      if (idx >= 0) {
        const updated = [...prev];
        const newQty = updated[idx].quantidade + 1;
        updated[idx] = {
          ...updated[idx],
          quantidade: newQty,
          subtotal: newQty * updated[idx].preco_unitario,
        };
        return updated;
      }
      const newItem: ItemPedidoDelivery = {
        codigo: item.codigo,
        nome: item.nome,
        quantidade: 1,
        preco_unitario: item.preco_venda,
        preco_custo: item.preco_custo || 0,
        subtotal: item.preco_venda,
        foto: item.foto,
        gelado: true,
        lote: item.lote,
        validade: item.validade,
      };
      return [...prev, newItem];
    });
  };

  const handleUpdateQuantity = (codigo: string, delta: number) => {
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.codigo === codigo);
      if (idx < 0) return prev;
      const updated = [...prev];
      const newQty = updated[idx].quantidade + delta;
      if (newQty <= 0) {
        return updated.filter((c) => c.codigo !== codigo);
      }
      updated[idx] = {
        ...updated[idx],
        quantidade: newQty,
        subtotal: newQty * updated[idx].preco_unitario,
      };
      return updated;
    });
  };

  const handleRemoveItem = (codigo: string) => {
    setCart((prev) => prev.filter((c) => c.codigo !== codigo));
  };

  // Submit Order
  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!clienteNome.trim() || !clienteTelefone.trim()) {
      alert('Por favor, informe seu Nome e WhatsApp.');
      return;
    }
    if (tipoPedido === 'delivery' && (!clienteEndereco.trim() || !clienteNumero.trim())) {
      alert('Por favor, informe a Rua e o Número de entrega.');
      return;
    }

    const pinGerado = Math.floor(1000 + Math.random() * 9000).toString();
    const numeroPedido = Math.floor(1000 + Math.random() * 9000);
    const agora = new Date();

    const novoPedido: PedidoDelivery = {
      id: `del_${Date.now()}`,
      numeroPedido,
      lojaId: targetLoja.id,
      data: agora.toISOString().slice(0, 10),
      hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: agora.getTime(),
      cliente: {
        nome: clienteNome,
        telefone: clienteTelefone,
        maior18AnosConfirmado: true,
      },
      enderecoEntrega: tipoPedido === 'retirada' ? {
        logradouro: 'Retirada no Balcão da Loja',
        numero: 'S/N',
        bairro: 'Balcão',
        cidade: targetLoja.nome,
        referencia: 'Cliente irá retirar pessoalmente',
      } : {
        logradouro: clienteEndereco,
        numero: clienteNumero,
        complemento: clienteComplemento,
        bairro: selectedBairro?.nome || 'Centro',
        cidade: 'Cidade',
        referencia: clienteReferencia,
      },
      itens: cart,
      subtotal: cartSubtotal,
      taxaEntrega: deliveryFee,
      valorTotal: cartTotal,
      formaPagamento,
      trocoPara: formaPagamento === 'dinheiro' && trocoPara ? parseFloat(trocoPara.replace(',', '.')) : undefined,
      status: 'pendente',
      tipo_pedido: tipoPedido,
      observacao: observacaoGeral,
      codigoEntregaPin: pinGerado,
    };

    // Save profile locally
    try {
      localStorage.setItem(
        CUSTOMER_PROFILE_KEY,
        JSON.stringify({
          nome: clienteNome,
          telefone: clienteTelefone,
          endereco: clienteEndereco,
          numero: clienteNumero,
          complemento: clienteComplemento,
          selectedBairroId,
          tipoPedido,
        })
      );
      const updatedIds = [novoPedido.id, ...customerOrderIds].slice(0, 50);
      localStorage.setItem(CUSTOMER_ORDERS_KEY, JSON.stringify(updatedIds));
      setCustomerOrderIds(updatedIds);
    } catch (err) {}

    if (onCriarPedido) {
      onCriarPedido(novoPedido);
    }

    setSubmittedOrder(novoPedido);
    setCart([]);
    setShowCartModal(false);
  };

  // WhatsApp order dispatch message (AtendeJá)
  const handleEnviarPedidoWhatsAppLoja = (pedido: PedidoDelivery) => {
    const end = pedido.enderecoEntrega;
    const enderecoCompleto = pedido.tipo_pedido === 'retirada' 
      ? '🛍️ *RETIRADA NO BALCÃO DA LOJA*'
      : `${end.logradouro}, ${end.numero}${end.complemento ? ' - ' + end.complemento : ''}, ${end.bairro}`;

    const listaItens = (pedido.itens || [])
      .map((it) => `• ${it.quantidade}x ${it.nome} - R$ ${it.subtotal.toFixed(2)}`)
      .join('\n');

    const texto = `⚡ *NOVO PEDIDO DELIVERY #${pedido.numeroPedido}*\n\n` +
      `🏪 *Loja:* ${targetLoja.nome}\n` +
      `👤 *Cliente:* ${pedido.cliente.nome}\n` +
      `📱 *WhatsApp:* ${pedido.cliente.telefone}\n` +
      `📍 *Endereço:* ${enderecoCompleto}\n` +
      (end.referencia ? `🏷️ *Referência:* ${end.referencia}\n` : '') +
      (pedido.observacao ? `📝 *Observação:* ${pedido.observacao}\n` : '') +
      `\n📦 *Itens do Pedido:*\n${listaItens}\n\n` +
      `🛵 *Taxa de Entrega:* R$ ${pedido.taxaEntrega.toFixed(2)}\n` +
      `💰 *VALOR TOTAL:* R$ ${pedido.valorTotal.toFixed(2)}\n` +
      `💳 *Forma de Pagamento:* ${pedido.formaPagamento.toUpperCase()}\n` +
      (pedido.trocoPara ? `💵 *Troco para:* R$ ${pedido.trocoPara.toFixed(2)}\n` : '') +
      `\n🔐 *PIN de Segurança:* ${pedido.codigoEntregaPin}\n` +
      `Aguardando confirmação da loja!`;

    const fone = (targetLoja.telefone || '5511999999999').replace(/\D/g, '');
    const url = `https://api.whatsapp.com/send?phone=${fone}&text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  // Theme Classes
  const bgClass = isDarkMode ? 'bg-[#121216] text-white' : 'bg-[#FAF7F2] text-stone-900';
  const cardBgClass = isDarkMode ? 'bg-[#1A1A22] border-stone-800' : 'bg-white border-stone-200';
  const inputBgClass = isDarkMode
    ? 'bg-[#242430] border-2 border-stone-600 text-white placeholder-stone-400 focus:border-red-500'
    : 'bg-white border-2 border-stone-300 text-stone-900 placeholder-stone-400 focus:border-red-600';
  const headerBgClass = isDarkMode ? 'bg-[#181820] border-stone-800' : 'bg-stone-900 text-white border-stone-800';

  return (
    <div className={`w-full min-w-full min-h-screen font-sans pb-28 transition-colors duration-200 ${bgClass}`}>
      {/* 1. Slim Sticky Top Bar (Identical to AtendeJá) */}
      <header className={`sticky top-0 z-30 shadow-sm border-b px-4 sm:px-6 lg:px-10 py-2.5 w-full ${headerBgClass}`}>
        <div className="w-full flex items-center justify-between gap-3">
          {/* Store Mini Identity */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-xs shrink-0 overflow-hidden">
              {targetLoja.logo_url ? (
                <img
                  src={targetLoja.logo_url}
                  alt={targetLoja.marca || targetLoja.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Pizza className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-black tracking-tight text-white uppercase truncate">
                {targetLoja.marca || targetLoja.nome}
              </h1>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>Loja Aberta</span>
              </span>
            </div>
          </div>

          {/* Quick Actions: Meus Pedidos + Cart + Theme + Staff Access */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Meus Pedidos Button */}
            <button
              onClick={() => setShowOrderHistoryModal(true)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                activeOrder
                  ? 'bg-amber-500 hover:bg-amber-600 text-stone-950 border-amber-400 animate-pulse'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
              }`}
              title="Ver histórico de pedidos e acompanhar status"
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] sm:text-xs">
                {activeOrder ? 'Acompanhar' : 'Meus Pedidos'}
              </span>
              {customerOrders.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-stone-900 text-amber-300 font-mono text-[10px] font-black">
                  {customerOrders.length}
                </span>
              )}
            </button>

            {/* Cart Shortcut */}
            {cart.length > 0 && (
              <button
                onClick={() => setShowCartModal(true)}
                className="px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Abrir carrinho"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="font-mono text-xs">{cart.reduce((a, c) => a + c.quantidade, 0)}</span>
              </button>
            )}

            {/* Light / Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 sm:p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 transition cursor-pointer border border-stone-700 shadow-2xs"
              title={isDarkMode ? 'Tema Claro' : 'Tema Escuro'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area - 100% Expansive */}
      <main className="w-full px-4 sm:px-6 lg:px-10 pt-3 sm:pt-5 space-y-5">
        {/* 2. Store Information Card */}
        <div className={`p-4 sm:p-5 rounded-3xl border shadow-sm transition ${cardBgClass}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-red-600 via-amber-500 to-red-500 flex items-center justify-center text-white shadow-md shrink-0 overflow-hidden border border-stone-700">
                {targetLoja.logo_url ? (
                  <img
                    src={targetLoja.logo_url}
                    alt={targetLoja.marca || targetLoja.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Pizza className="w-8 h-8" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    🛵 Delivery Oficial
                  </span>
                  <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Aberto Agora
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight leading-tight">
                  {targetLoja.marca ? (
                    <>
                      <span>{targetLoja.marca}</span>
                      <span className="text-xs sm:text-sm font-medium text-stone-400 ml-2">
                        📍 {targetLoja.nome}
                      </span>
                    </>
                  ) : (
                    targetLoja.nome
                  )}
                </h2>
                <p className="text-xs text-stone-500 flex flex-wrap items-center gap-2">
                  <span>📍 {targetLoja.endereco || 'Atendimento Delivery e Balcão'}</span>
                  {targetLoja.telefone && (
                    <>
                      <span>•</span>
                      <a
                        href={`tel:${targetLoja.telefone.replace(/\D/g, '')}`}
                        className="text-red-600 hover:underline font-semibold"
                      >
                        📞 {targetLoja.telefone}
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Delivery Stats Chips */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200 dark:border-stone-800">
              <div className="flex-1 sm:flex-initial px-3 py-2 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center sm:text-left">
                <span className="text-[9px] uppercase font-bold text-stone-500 block">
                  Taxa de Entrega
                </span>
                <span className="text-xs sm:text-sm font-black text-emerald-600 font-mono">
                  {deliveryFee > 0 ? formatCurrency(deliveryFee) : 'Grátis'}
                </span>
              </div>

              <div className="flex-1 sm:flex-initial px-3 py-2 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center sm:text-left">
                <span className="text-[9px] uppercase font-bold text-stone-500 block">
                  Tempo Médio
                </span>
                <span className="text-xs sm:text-sm font-bold text-amber-600 flex items-center justify-center sm:justify-start gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {targetLoja.tempo_estimado_entrega || '30 - 45 min'}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Welcome Chip */}
          {profileLoaded && clienteNome && (
            <div className="mt-3 pt-3 border-t border-dashed border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300 min-w-0">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate">
                  Olá, <strong>{clienteNome.split(' ')[0]}</strong>! Seus dados de entrega já estão salvos.
                </span>
              </div>
              <button
                onClick={() => setShowOrderHistoryModal(true)}
                className="text-red-600 font-bold hover:underline shrink-0 text-[11px] cursor-pointer"
              >
                Ver meus {customerOrders.length} pedidos ➔
              </button>
            </div>
          )}
        </div>

        {/* Barra de Pesquisa Moderna, Elegante e Expansiva */}
        <div className="relative w-full">
          <div className="relative flex items-center">
            <div className="absolute left-4.5 flex items-center pointer-events-none text-red-600 dark:text-red-400">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O que você quer pedir hoje? (ex: Heineken, Vodka, Gin, Gelo, Whiskies...)"
              className={`w-full pl-12.5 pr-28 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm font-semibold shadow-xs hover:shadow-sm focus:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
                isDarkMode
                  ? 'bg-[#1e1e28] text-white border border-stone-700 placeholder-stone-400 focus:border-red-500'
                  : 'bg-white text-stone-900 border border-stone-300/80 placeholder-stone-400 focus:border-red-600'
              }`}
            />
            {searchQuery ? (
              <div className="absolute right-3.5 flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-300 font-mono">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'itens'}
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
                  title="Limpar busca"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="absolute right-4 hidden sm:flex items-center text-stone-400 text-xs pointer-events-none">
                <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-[10px] text-stone-500">
                  Cardápio Completo
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Order Submitted Success View */}
        {submittedOrder !== null ? (
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl text-center space-y-4 max-w-md mx-auto my-6 animate-in zoom-in-95 ${cardBgClass}`}>
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black">Pedido Recebido com Sucesso!</h2>
            <p className="text-xs text-stone-500">
              Seu pedido <span className="font-mono font-bold text-red-600">#{submittedOrder.numeroPedido}</span> foi enviado diretamente para a equipe da <strong className="text-white">{targetLoja.marca ? `${targetLoja.marca} - ${targetLoja.nome}` : targetLoja.nome}</strong>.
            </p>

            {/* PIN Card */}
            <div className="bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-950 p-4 rounded-2xl shadow space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider">Seu Código de Confirmação (PIN):</div>
              <div className="text-3xl font-mono font-black">{submittedOrder.codigoEntregaPin}</div>
              <div className="text-[11px] font-medium">Informe este código ao entregador no ato da entrega!</div>
            </div>

            {/* WhatsApp notification */}
            <button
              onClick={() => handleEnviarPedidoWhatsAppLoja(submittedOrder)}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar no WhatsApp da Loja</span>
            </button>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setSubmittedOrder(null);
                  setShowOrderHistoryModal(true);
                }}
                className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <History className="w-3.5 h-3.5" />
                <span>Acompanhar Pedido</span>
              </button>

              <button
                onClick={() => setSubmittedOrder(null)}
                className="flex-1 py-3 px-4 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Fazer Outro Pedido
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Products Grid - 100% Expansive across full screen */}
            <div className="space-y-3 pt-1 w-full">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-black tracking-tight uppercase flex items-center gap-1.5">
                  <span>Itens Disponíveis ({filteredProducts.length})</span>
                </h3>
              </div>

              <div className="grid-produtos" id="grid-produtos-cliente">
                {filteredProducts.map((prod, pIdx) => {
                  const cartItem = cart.find((c) => c.codigo === prod.codigo);
                  const inCartQty = cartItem?.quantidade || 0;
                  const esgotado = !prod.estoqueIlimitado && (prod.quantidade || 0) <= 0;
                  const isInternoCard = prod.tipoCadastro === 'interno';

                  return (
                    <div className="card-produto" key={`card_cliente_${prod.codigo || pIdx}_${pIdx}`}>
                      <div
                        className="foto-produto"
                        onClick={() => !esgotado && handleAddProduct(prod)}
                      >
                        {prod.foto ? (
                          <img
                            src={prod.foto}
                            alt={prod.nome}
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
                        {inCartQty > 0 && (
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
                            🛒 {inCartQty} no carrinho
                          </div>
                        )}
                        {esgotado && (
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'rgba(0,0,0,0.6)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#f87171',
                              fontSize: '0.85rem',
                              fontWeight: 800,
                            }}
                          >
                            Esgotado
                          </div>
                        )}
                      </div>

                      <div className="info-card">
                        <div>
                          <div
                            className="nome-prod"
                            onClick={() => !esgotado && handleAddProduct(prod)}
                          >
                            {prod.nome}
                          </div>
                          <div className="detalhe" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>Cód: {prod.codigo}</span>
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
                                Estoque Total: <b>{prod.quantidade || 0} un</b>
                              </>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                            <div className="detalhe preco-destaque" style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                              R$ {Number(prod.preco_venda).toFixed(2)}
                            </div>

                            {esgotado ? (
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                                Indisponível
                              </span>
                            ) : inCartQty > 0 ? (
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: '#16a34a',
                                  color: '#ffffff',
                                  borderRadius: '6px',
                                  padding: '3px 6px',
                                  fontWeight: 700,
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateQuantity(prod.codigo, -1);
                                  }}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontWeight: 800,
                                    fontSize: '0.85rem',
                                    padding: '0 4px',
                                  }}
                                >
                                  -
                                </button>
                                <span style={{ fontSize: '0.78rem' }}>{inCartQty} un</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateQuantity(prod.codigo, 1);
                                  }}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontWeight: 800,
                                    fontSize: '0.85rem',
                                    padding: '0 4px',
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddProduct(prod);
                                }}
                                title="Adicionar 1 unidade ao Carrinho"
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
                })}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && !showCartModal && (
        <div className="fixed bottom-3 left-0 right-0 z-40 px-3 sm:px-4 max-w-lg mx-auto">
          <button
            onClick={() => setShowCartModal(true)}
            className="w-full p-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-xl flex items-center justify-between transition transform active:scale-98 cursor-pointer border border-red-500"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white text-red-600 flex items-center justify-center font-black text-xs font-mono">
                {cart.reduce((a, c) => a + c.quantidade, 0)}
              </div>
              <span>Ver Carrinho ({tipoPedido === 'retirada' ? 'Retirada' : 'Entrega'})</span>
            </div>

            <div className="flex items-center gap-1.5 text-base font-mono">
              <span>{formatCurrency(cartTotal)}</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}

      {/* Cart / Checkout Modal */}
      {showCartModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl border ${cardBgClass} max-h-[92vh] flex flex-col`}>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-black">Meu Carrinho & Finalização</h3>
              </div>
              <button
                onClick={() => setShowCartModal(false)}
                className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 flex-1 pr-1">
              {/* Items List */}
              <div className="space-y-2">
                {cart.map((item) => (
                  <div
                    key={item.codigo}
                    className="p-3 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 bg-stone-50 dark:bg-stone-900"
                  >
                    <div className="flex items-center gap-3">
                      {item.foto ? (
                        <img src={item.foto} alt="" className="w-12 h-12 rounded-xl object-contain p-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center text-xl">🍺</div>
                      )}
                      <div>
                        <div className="text-xs font-bold line-clamp-1">{item.nome}</div>
                        <div className="text-xs font-mono font-bold text-amber-500">
                          {formatCurrency(item.subtotal)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-stone-200 dark:bg-stone-800 px-2 py-1 rounded-xl">
                        <button
                          onClick={() => handleUpdateQuantity(item.codigo, -1)}
                          className="p-1 text-stone-400 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold font-mono px-1">{item.quantidade}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.codigo, 1)}
                          className="p-1 text-red-500 hover:text-red-400 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.codigo)}
                        className="p-1.5 text-stone-400 hover:text-red-500 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery vs Retirada */}
              <div className="grid grid-cols-2 gap-2 bg-stone-100 dark:bg-stone-900 p-1 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setTipoPedido('delivery')}
                  className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    tipoPedido === 'delivery' ? 'bg-red-600 text-white shadow' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>Entrega (Delivery)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTipoPedido('retirada')}
                  className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    tipoPedido === 'retirada' ? 'bg-red-600 text-white shadow' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Retirada (Balcão)</span>
                </button>
              </div>

              {/* Customer Details Form */}
              <form onSubmit={handleConfirmOrder} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-stone-400 block mb-1 font-semibold">Seu Nome:</label>
                    <input
                      type="text"
                      required
                      value={clienteNome}
                      onChange={(e) => setClienteNome(e.target.value)}
                      placeholder="Ex: Paulo Silva"
                      className={`w-full p-2.5 rounded-xl ${inputBgClass}`}
                    />
                  </div>
                  <div>
                    <label className="text-stone-400 block mb-1 font-semibold">WhatsApp:</label>
                    <input
                      type="text"
                      required
                      value={clienteTelefone}
                      onChange={(e) => setClienteTelefone(e.target.value)}
                      placeholder="(11) 99887-6655"
                      className={`w-full p-2.5 rounded-xl ${inputBgClass}`}
                    />
                  </div>
                </div>

                {tipoPedido === 'delivery' && (
                  <>
                    <div>
                      <label className="text-stone-400 block mb-1 font-semibold">
                        Selecione seu Bairro (Taxa: {formatCurrency(deliveryFee)}):
                      </label>
                      <select
                        value={selectedBairroId}
                        onChange={(e) => setSelectedBairroId(e.target.value)}
                        className={`w-full p-2.5 rounded-xl ${inputBgClass}`}
                      >
                        {listaBairros.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.nome} — {formatCurrency(b.taxa)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="text-stone-400 block mb-1 font-semibold">Rua / Logradouro:</label>
                        <input
                          type="text"
                          required
                          value={clienteEndereco}
                          onChange={(e) => setClienteEndereco(e.target.value)}
                          placeholder="Rua Augusta"
                          className={`w-full p-2.5 rounded-xl ${inputBgClass}`}
                        />
                      </div>
                      <div>
                        <label className="text-stone-400 block mb-1 font-semibold">Número:</label>
                        <input
                          type="text"
                          required
                          value={clienteNumero}
                          onChange={(e) => setClienteNumero(e.target.value)}
                          placeholder="780"
                          className={`w-full p-2.5 rounded-xl ${inputBgClass}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-stone-400 block mb-1 font-semibold">Complemento / Ap:</label>
                        <input
                          type="text"
                          value={clienteComplemento}
                          onChange={(e) => setClienteComplemento(e.target.value)}
                          placeholder="Apto 54"
                          className={`w-full p-2.5 rounded-xl ${inputBgClass}`}
                        />
                      </div>
                      <div>
                        <label className="text-stone-400 block mb-1 font-semibold">Ponto de Referência:</label>
                        <input
                          type="text"
                          value={clienteReferencia}
                          onChange={(e) => setClienteReferencia(e.target.value)}
                          placeholder="Próximo à padaria"
                          className={`w-full p-2.5 rounded-xl ${inputBgClass}`}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="text-stone-400 block mb-1 font-semibold">Observações:</label>
                  <input
                    type="text"
                    value={observacaoGeral}
                    onChange={(e) => setObservacaoGeral(e.target.value)}
                    placeholder="Mandar cerveja trincando de gelada"
                    className={`w-full p-2.5 rounded-xl ${inputBgClass}`}
                  />
                </div>

                {/* Formas de Pagamento */}
                <div>
                  <label className="text-stone-400 block mb-1 font-semibold">Forma de Pagamento:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'pix', label: 'PIX', icon: '⚡' },
                      { id: 'cartao_credito', label: 'Cartão Crédito', icon: '💳' },
                      { id: 'cartao_debito', label: 'Cartão Débito', icon: '💳' },
                      { id: 'dinheiro', label: 'Dinheiro', icon: '💵' },
                    ].map((pg) => (
                      <button
                        key={pg.id}
                        type="button"
                        onClick={() => setFormaPagamento(pg.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                          formaPagamento === pg.id
                            ? 'bg-red-600 text-white border-red-500 shadow'
                            : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-300'
                        }`}
                      >
                        <span>{pg.icon}</span>
                        <span>{pg.label}</span>
                      </button>
                    ))}
                  </div>

                  {formaPagamento === 'dinheiro' && (
                    <div className="mt-2">
                      <label className="text-stone-400 block mb-1 font-semibold">Precisa de troco para quanto? (R$):</label>
                      <input
                        type="text"
                        value={trocoPara}
                        onChange={(e) => setTrocoPara(e.target.value)}
                        placeholder="Ex: 50,00"
                        className={`w-full p-2.5 rounded-xl ${inputBgClass}`}
                      />
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-400">
                    <span>Subtotal dos itens:</span>
                    <span className="font-mono">{formatCurrency(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Taxa de entrega:</span>
                    <span className="font-mono">{tipoPedido === 'retirada' ? 'Grátis' : formatCurrency(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-white pt-1.5 border-t border-stone-700">
                    <span>Total a Pagar:</span>
                    <span className="text-amber-400 font-mono text-base">{formatCurrency(cartTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-2xl shadow-xl transition cursor-pointer active:scale-98"
                >
                  CONFIRMAR E ENVIAR PEDIDO
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Meus Pedidos History Modal */}
      {showOrderHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl border ${cardBgClass} max-h-[90vh] flex flex-col`}>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-white">Meus Pedidos Anteriores</h3>
              </div>
              <button
                onClick={() => setShowOrderHistoryModal(false)}
                className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {customerOrders.length === 0 ? (
                <div className="py-8 text-center text-stone-400 text-xs">
                  Você ainda não realizou pedidos nesta loja.
                </div>
              ) : (
                customerOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 space-y-2.5 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-white">
                        Pedido #{ord.numeroPedido}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          ord.status === 'pendente'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : ord.status === 'em_separacao'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : ord.status === 'saiu_para_entrega'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {ord.status === 'pendente'
                          ? '● Pendente'
                          : ord.status === 'em_separacao'
                          ? '🔥 Em Preparo'
                          : ord.status === 'saiu_para_entrega'
                          ? '🛵 A Caminho'
                          : '✓ Entregue'}
                      </span>
                    </div>

                    {/* PIN Display */}
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                      <span className="text-amber-400 font-bold">PIN de Entrega:</span>
                      <span className="font-mono font-black text-base text-amber-400">
                        {ord.codigoEntregaPin}
                      </span>
                    </div>

                    <div className="text-xs text-stone-400">
                      Data: {ord.data} às {ord.hora} • Total:{' '}
                      <strong className="text-white font-mono">{formatCurrency(ord.valorTotal)}</strong>
                    </div>

                    <button
                      onClick={() => handleEnviarPedidoWhatsAppLoja(ord)}
                      className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Falar com a Loja no WhatsApp</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
