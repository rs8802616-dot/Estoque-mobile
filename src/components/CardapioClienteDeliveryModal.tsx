import React, { useState, useMemo, useEffect } from 'react';
import {
  ItemEstoque,
  Supermercado,
  ConfiguracaoDelivery,
  PedidoDelivery,
  ItemPedidoDelivery,
  TaxaBairro,
} from '../types';
import {
  X,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  Bike,
  Sparkles,
  KeyRound,
  DollarSign,
  ArrowLeft,
  Copy,
  Check,
  Phone,
  Flame,
  Store,
  Share2,
  Send,
  Lock,
  RotateCcw,
} from 'lucide-react';

interface CardapioClienteDeliveryModalProps {
  visivel: boolean;
  onFechar: () => void;
  estoque: ItemEstoque[];
  loja: Supermercado | null;
  configDelivery: ConfiguracaoDelivery;
  onCriarPedido: (novoPedido: PedidoDelivery) => void;
  pedidosExistentes?: PedidoDelivery[];
  onTrocarParaFuncionario?: () => void;
}

interface ItemCarrinhoCliente {
  item: ItemEstoque;
  qtd: number;
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
    categoria: 'Bebidas Alcoólicas',
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
    categoria: 'Bebidas Alcoólicas',
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
    categoria: 'Bebidas Alcoólicas',
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
    categoria: 'Destilados',
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
    categoria: 'Destilados',
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
    categoria: 'Vinhos',
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
    categoria: 'Refrigerantes',
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
    categoria: 'Refrigerantes',
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
    categoria: 'Gelo & Petiscos',
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
    nome: 'Carvão Vegetal Especial Churrasco 3kg',
    marca: 'Bom de Fogo',
    categoria: 'Gelo & Petiscos',
    quantidade: 20,
    lote: 'L-CV01',
    validade: '2030-01-01',
    preco_custo: 12.00,
    preco_venda: 21.90,
    foto: 'https://images.unsplash.com/photo-1558030006-450675393462?w=300&q=80',
    tipoCadastro: 'padrao',
  },
];

export const CardapioClienteDeliveryModal: React.FC<CardapioClienteDeliveryModalProps> = ({
  visivel,
  onFechar,
  estoque,
  loja,
  configDelivery,
  onCriarPedido,
  pedidosExistentes = [],
  onTrocarParaFuncionario,
}) => {
  // Verificação de maioridade (+18 anos)
  const [maior18Confirmado, setMaior18Confirmado] = useState<boolean>(() => {
    return localStorage.getItem('ze_delivery_maior_18') === 'true';
  });

  // Etapa atual: 'vitrine' | 'carrinho' | 'checkout' | 'rastreio' | 'meus_pedidos'
  const [etapa, setEtapa] = useState<'vitrine' | 'carrinho' | 'checkout' | 'rastreio' | 'meus_pedidos'>('vitrine');

  // Tipo de Pedido: 'delivery' ou 'retirada' (estilo AtendeJá)
  const [tipoPedido, setTipoPedido] = useState<'delivery' | 'retirada'>('delivery');

  // Pedido ativo em acompanhamento
  const [pedidoAtivoRastreio, setPedidoAtivoRastreio] = useState<PedidoDelivery | null>(null);

  // Busca e categoria
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('todas');

  // Lista de bairros disponíveis para cálculo de taxa (AtendeJá)
  const listaBairros = useMemo(() => {
    if (loja?.taxas_bairro && loja.taxas_bairro.length > 0) {
      return loja.taxas_bairro;
    }
    return BAIRROS_PADRAO;
  }, [loja]);

  // Bairro Selecionado (ID ou Nome)
  const [bairroSelecionadoId, setBairroSelecionadoId] = useState<string>(() => {
    return localStorage.getItem('delivery_bairro_selecionado') || (listaBairros[0]?.id || 'b1');
  });

  // Endereço de entrega do cliente
  const [endereco, setEndereco] = useState(() => {
    try {
      const salvo = localStorage.getItem('ze_delivery_cliente_endereco');
      return salvo ? JSON.parse(salvo) : {
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: 'São Paulo',
        referencia: '',
      };
    } catch {
      return { logradouro: '', numero: '', complemento: '', bairro: '', cidade: 'São Paulo', referencia: '' };
    }
  });

  // Dados do cliente
  const [nomeCliente, setNomeCliente] = useState(() => localStorage.getItem('ze_delivery_cliente_nome') || '');
  const [telefoneCliente, setTelefoneCliente] = useState(() => localStorage.getItem('ze_delivery_cliente_telefone') || '');
  const [observacaoGeral, setObservacaoGeral] = useState('');

  // Carrinho do cliente
  const [carrinho, setCarrinho] = useState<Record<string, ItemCarrinhoCliente>>({});

  // Forma de pagamento
  const [formaPagamento, setFormaPagamento] = useState<'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro'>('pix');
  const [trocoPara, setTrocoPara] = useState<string>('');
  const [pixCopiado, setPixCopiado] = useState(false);

  // Calcula a taxa de entrega baseada no bairro selecionado e tipo de pedido (AtendeJá)
  const taxaEntregaCalculada = useMemo(() => {
    if (tipoPedido === 'retirada') return 0;
    const bairroEncontrado = listaBairros.find((b) => b.id === bairroSelecionadoId || b.nome.toLowerCase() === endereco.bairro.toLowerCase());
    if (bairroEncontrado) return bairroEncontrado.taxa;
    return configDelivery.taxaEntregaFixa || loja?.taxa_entrega || 6.90;
  }, [tipoPedido, listaBairros, bairroSelecionadoId, endereco.bairro, configDelivery, loja]);

  // Se o usuário selecionou um bairro na lista, atualiza o nome do bairro no endereço
  useEffect(() => {
    const bairroObj = listaBairros.find((b) => b.id === bairroSelecionadoId);
    if (bairroObj && !bairroObj.nome.includes('Outro')) {
      setEndereco((prev: any) => ({ ...prev, bairro: bairroObj.nome }));
    }
  }, [bairroSelecionadoId, listaBairros]);

  if (!visivel) return null;

  // Lista base de produtos: usa o estoque real se houver itens disponíveis; senão, usa o catálogo padrão de bebidas
  const produtosBase = estoque && estoque.length > 0 ? estoque : BEBIDAS_FALLBACK;

  // Filtragem de produtos disponíveis no estoque
  const produtosDisponiveis = produtosBase.filter((p) => {
    if (busca.trim()) {
      const b = busca.toLowerCase();
      const nomeMatch = p.nome?.toLowerCase().includes(b);
      const marcaMatch = p.marca?.toLowerCase().includes(b);
      const codMatch = p.codigo?.toLowerCase().includes(b);
      if (!nomeMatch && !marcaMatch && !codMatch) return false;
    }

    if (categoriaSelecionada !== 'todas') {
      const cat = (p.categoria || '').toLowerCase();
      const nome = (p.nome || '').toLowerCase();
      if (categoriaSelecionada === 'cervejas') {
        if (!cat.includes('cervej') && !cat.includes('alcoólic') && !nome.includes('cerveja') && !nome.includes('heineken') && !nome.includes('brahma') && !nome.includes('corona')) return false;
      }
      if (categoriaSelecionada === 'destilados') {
        if (!cat.includes('destilad') && !cat.includes('whisky') && !cat.includes('gin') && !cat.includes('vodka') && !nome.includes('whisky') && !nome.includes('gin') && !nome.includes('vodka')) return false;
      }
      if (categoriaSelecionada === 'vinhos') {
        if (!cat.includes('vinho') && !cat.includes('espumante') && !nome.includes('vinho')) return false;
      }
      if (categoriaSelecionada === 'refrigerantes') {
        if (!cat.includes('não alcoólic') && !cat.includes('refrigerante') && !cat.includes('suco') && !cat.includes('água') && !nome.includes('coca') && !nome.includes('red bull') && !nome.includes('água')) return false;
      }
      if (categoriaSelecionada === 'gelo_petiscos') {
        if (!cat.includes('congelado') && !cat.includes('mercearia') && !cat.includes('snack') && !nome.includes('gelo') && !nome.includes('carvão') && !nome.includes('amendoim')) return false;
      }
    }

    return true;
  });

  // Adicionar ao carrinho
  const adicionarAoCarrinho = (item: ItemEstoque) => {
    setCarrinho((prev) => {
      const atual = prev[item.codigo]?.qtd || 0;
      return {
        ...prev,
        [item.codigo]: { item, qtd: atual + 1 },
      };
    });
  };

  // Remover do carrinho
  const removerDoCarrinho = (codigo: string) => {
    setCarrinho((prev) => {
      const atual = prev[codigo]?.qtd || 0;
      if (atual <= 1) {
        const copia = { ...prev };
        delete copia[codigo];
        return copia;
      }
      return {
        ...prev,
        [codigo]: { ...prev[codigo], qtd: atual - 1 },
      };
    });
  };

  // Cálculos do carrinho
  const itensCarrinho: ItemCarrinhoCliente[] = Object.values(carrinho);
  const totalItensQtd: number = itensCarrinho.reduce((acc, cur) => acc + cur.qtd, 0);
  const subtotalCarrinho: number = itensCarrinho.reduce((acc, cur) => acc + (cur.item.preco_venda * cur.qtd), 0);
  const valorTotalFinal: number = subtotalCarrinho + (totalItensQtd > 0 ? taxaEntregaCalculada : 0);

  // Copiar chave PIX
  const handleCopiarPix = (chave: string) => {
    navigator.clipboard.writeText(chave);
    setPixCopiado(true);
    setTimeout(() => setPixCopiado(false), 2500);
  };

  // Finalizar Pedido
  const handleFinalizarPedido = () => {
    if (!nomeCliente.trim() || !telefoneCliente.trim()) {
      alert('Por favor, informe seu nome e WhatsApp para contato.');
      return;
    }
    if (tipoPedido === 'delivery' && (!endereco.logradouro.trim() || !endereco.numero.trim() || !endereco.bairro.trim())) {
      alert('Por favor, preencha o endereço completo de entrega (Rua, Número e Bairro).');
      return;
    }
    if (subtotalCarrinho < configDelivery.valorMinimoPedido) {
      alert(`O pedido mínimo desta loja é de R$ ${configDelivery.valorMinimoPedido.toFixed(2)}.`);
      return;
    }

    // Salvar preferências no localStorage
    localStorage.setItem('ze_delivery_cliente_nome', nomeCliente);
    localStorage.setItem('ze_delivery_cliente_telefone', telefoneCliente);
    localStorage.setItem('ze_delivery_cliente_endereco', JSON.stringify(endereco));
    localStorage.setItem('delivery_bairro_selecionado', bairroSelecionadoId);

    // Gerar PIN de 4 dígitos aleatório para entrega segura
    const pinGerado = Math.floor(1000 + Math.random() * 9000).toString();
    const numeroPedido = Math.floor(1000 + Math.random() * 9000);
    const agora = new Date();

    const itensPedido: ItemPedidoDelivery[] = itensCarrinho.map((c) => ({
      codigo: c.item.codigo,
      nome: c.item.nome,
      quantidade: c.qtd,
      preco_unitario: c.item.preco_venda,
      preco_custo: c.item.preco_custo || 0,
      subtotal: c.item.preco_venda * c.qtd,
      foto: c.item.foto,
      gelado: true,
      lote: c.item.lote,
      validade: c.item.validade,
    }));

    const novoPedido: PedidoDelivery = {
      id: `del_${Date.now()}`,
      numeroPedido,
      lojaId: loja?.id || 'loja_matriz_01',
      data: agora.toISOString().slice(0, 10),
      hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: agora.getTime(),
      cliente: {
        nome: nomeCliente,
        telefone: telefoneCliente,
        maior18AnosConfirmado: true,
      },
      enderecoEntrega: tipoPedido === 'retirada' ? {
        logradouro: 'Retirada no Balcão da Loja',
        numero: 'S/N',
        bairro: 'Loja Física',
        cidade: loja?.nome || 'Balcão',
        referencia: 'Cliente irá retirar pessoalmente',
      } : endereco,
      itens: itensPedido,
      subtotal: subtotalCarrinho,
      taxaEntrega: taxaEntregaCalculada,
      valorTotal: valorTotalFinal,
      formaPagamento,
      trocoPara: formaPagamento === 'dinheiro' && trocoPara ? Number(trocoPara) : undefined,
      status: 'pendente',
      tipo_pedido: tipoPedido,
      observacao: observacaoGeral,
      codigoEntregaPin: pinGerado,
    };

    onCriarPedido(novoPedido);
    setPedidoAtivoRastreio(novoPedido);
    setCarrinho({});
    setEtapa('rastreio');
  };

  // Abrir WhatsApp da loja com resumo do pedido (AtendeJá)
  const handleEnviarPedidoWhatsAppLoja = (pedido: PedidoDelivery) => {
    const end = pedido.enderecoEntrega;
    const enderecoCompleto = pedido.tipo_pedido === 'retirada' 
      ? '🛍️ *RETIRADA NO BALCÃO DA LOJA*'
      : `${end.logradouro}, ${end.numero}${end.complemento ? ' - ' + end.complemento : ''}, ${end.bairro}`;

    const listaItens = (pedido.itens || [])
      .map((it) => `• ${it.quantidade}x ${it.nome} - R$ ${it.subtotal.toFixed(2)}`)
      .join('\n');

    const texto = `⚡ *NOVO PEDIDO DELIVERY #${pedido.numeroPedido}*\n\n` +
      `🏪 *Loja:* ${loja?.nome || 'Adega Express'}\n` +
      `👤 *Cliente:* ${pedido.cliente.nome}\n` +
      `📱 *WhatsApp:* ${pedido.cliente.telefone}\n` +
      `📍 *Endereço:* ${enderecoCompleto}\n` +
      (end.referencia ? `🏷️ *Referência:* ${end.referencia}\n` : '') +
      (pedido.observacao ? `📝 *Observação:* ${pedido.observacao}\n` : '') +
      `\n📦 *Itens Solicitados:*\n${listaItens}\n\n` +
      `🛵 *Taxa de Entrega:* R$ ${pedido.taxaEntrega.toFixed(2)}\n` +
      `💰 *VALOR TOTAL:* R$ ${pedido.valorTotal.toFixed(2)}\n` +
      `💳 *Forma de Pagamento:* ${pedido.formaPagamento.toUpperCase()}\n` +
      (pedido.trocoPara ? `💵 *Troco para:* R$ ${pedido.trocoPara.toFixed(2)}\n` : '') +
      `\n🔐 *PIN de Segurança:* ${pedido.codigoEntregaPin}\n` +
      `Aguardando confirmação da loja!`;

    const foneLoja = (loja?.telefone || '5511999999999').replace(/\D/g, '');
    const url = `https://api.whatsapp.com/send?phone=${foneLoja}&text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  // Se o usuário ainda não confirmou +18 anos (obrigatório Zé Delivery)
  if (!maior18Confirmado) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        style={{ zIndex: 10000001 }}
      >
        <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-500 text-slate-950 font-black text-3xl flex items-center justify-center mx-auto shadow-xl shadow-amber-500/30">
            18+
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wide">
              Você tem 18 anos ou mais?
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              De acordo com a Lei 8.069/90 e as regras de delivery de bebidas alcoólicas, a comercialização é restrita para maiores de 18 anos.
            </p>
          </div>
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                setMaior18Confirmado(true);
                localStorage.setItem('ze_delivery_maior_18', 'true');
              }}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/25 transition cursor-pointer"
            >
              SIM, TENHO MAIS DE 18 ANOS
            </button>
            <button
              onClick={onFechar}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-xs rounded-2xl transition cursor-pointer"
            >
              Não, quero sair
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Meus pedidos anteriores deste cliente
  const pedidosDoCliente = pedidosExistentes.filter((p) => {
    if (telefoneCliente && p.cliente.telefone) {
      const clean1 = telefoneCliente.replace(/\D/g, '');
      const clean2 = p.cliente.telefone.replace(/\D/g, '');
      if (clean1 && clean2 && (clean1.includes(clean2) || clean2.includes(clean1))) return true;
    }
    return false;
  });

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md p-1 sm:p-4 overflow-y-auto"
      style={{ zIndex: 10000000 }}
    >
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-7xl 2xl:max-w-[1600px] max-h-[96vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 relative">
        
        {/* CABEÇALHO DO CARDÁPIO DIGITAL ESTILO ATENDEJÁ / ZÉ DELIVERY */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            {etapa !== 'vitrine' && (
              <button
                onClick={() => setEtapa('vitrine')}
                className="p-1.5 rounded-xl bg-black/10 hover:bg-black/20 transition text-slate-950 font-bold cursor-pointer"
                title="Voltar ao cardápio"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            {/* Logo da Loja ou Ícone */}
            {loja?.logo_url ? (
              <img
                src={loja.logo_url}
                alt={loja.nome}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-slate-950/20 shadow"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-slate-950 text-amber-400 font-black text-2xl flex items-center justify-center shadow">
                ⚡
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-lg tracking-tight leading-none text-slate-950">
                  {loja?.marca || loja?.nome || 'Zé Delivery Express'}
                </h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-950 text-amber-400 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${configDelivery.ativo ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                  {configDelivery.ativo ? 'Aberto' : 'Fechado'}
                </span>
              </div>
              <div className="text-[11px] font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {loja?.tempo_estimado_entrega || `${configDelivery.tempoMinimoMinutos}-${configDelivery.tempoMaximoMinutos} min`}
                </span>
                <span>•</span>
                <span>Taxa: {tipoPedido === 'retirada' ? 'Grátis (Retirada)' : `R$ ${taxaEntregaCalculada.toFixed(2)}`}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Botão Meus Pedidos */}
            <button
              onClick={() => setEtapa('meus_pedidos')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 font-bold text-xs transition cursor-pointer"
              title="Acompanhar meus pedidos anteriores"
            >
              <span>Meus Pedidos</span>
              {pedidosDoCliente.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-slate-950 text-amber-400 text-[10px] font-black flex items-center justify-center">
                  {pedidosDoCliente.length}
                </span>
              )}
            </button>

            {/* Botão de Carrinho no Topo */}
            {etapa === 'vitrine' && (
              <button
                onClick={() => setEtapa('carrinho')}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 text-amber-400 font-black text-xs shadow-md transition hover:bg-slate-900 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Sacola</span>
                {totalItensQtd > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                    {totalItensQtd}
                  </span>
                )}
              </button>
            )}

            {/* Botão de Acesso Funcionário / PDV */}
            {onTrocarParaFuncionario && (
              <button
                onClick={onTrocarParaFuncionario}
                className="p-2 rounded-xl bg-black/10 hover:bg-black/20 text-slate-950 transition font-bold cursor-pointer"
                title="Acesso da Equipe da Loja / Caixa PDV"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onFechar}
              className="p-2 rounded-xl bg-black/10 hover:bg-black/20 text-slate-950 transition font-bold cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CORPO DO CARDÁPIO */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">

          {/* ======================================================== */}
          {/* ETAPA 1: VITRINE DE PRODUTOS                            */}
          {/* ======================================================== */}
          {etapa === 'vitrine' && (
            <div className="space-y-4">
              
              {/* SELETOR: ENTREGA VS RETIRADA NO BALCÃO (ATENDEJÁ) */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setTipoPedido('delivery')}
                  className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
                    tipoPedido === 'delivery'
                      ? 'bg-amber-500 text-slate-950 font-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>Receber em Casa (Delivery)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTipoPedido('retirada')}
                  className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
                    tipoPedido === 'retirada'
                      ? 'bg-amber-500 text-slate-950 font-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Retirar no Balcão (Grátis)</span>
                </button>
              </div>

              {/* SELETOR DE BAIRRO E TAXA DINÂMICA (ATENDEJÁ) */}
              {tipoPedido === 'delivery' && (
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 font-bold text-white">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      Selecione seu bairro para entrega:
                    </span>
                    <span className="font-mono text-amber-400 font-extrabold text-xs">
                      Taxa: R$ {taxaEntregaCalculada.toFixed(2)}
                    </span>
                  </div>

                  <select
                    value={bairroSelecionadoId}
                    onChange={(e) => setBairroSelecionadoId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-amber-500"
                  >
                    {listaBairros.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nome} — R$ {b.taxa.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Busca de Produtos */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar cerveja trincando, carvão, gelo, destilados..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Carrossel de Categorias */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
                <button
                  onClick={() => setCategoriaSelecionada('todas')}
                  className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
                    categoriaSelecionada === 'todas'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  ✨ Tudo
                </button>
                <button
                  onClick={() => setCategoriaSelecionada('cervejas')}
                  className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
                    categoriaSelecionada === 'cervejas'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  🍺 Cervejas Geladas
                </button>
                <button
                  onClick={() => setCategoriaSelecionada('destilados')}
                  className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
                    categoriaSelecionada === 'destilados'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  🍸 Destilados & Drinks
                </button>
                <button
                  onClick={() => setCategoriaSelecionada('vinhos')}
                  className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
                    categoriaSelecionada === 'vinhos'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  🍷 Vinhos
                </button>
                <button
                  onClick={() => setCategoriaSelecionada('refrigerantes')}
                  className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
                    categoriaSelecionada === 'refrigerantes'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  🥤 Refrescos & Sucos
                </button>
                <button
                  onClick={() => setCategoriaSelecionada('gelo_petiscos')}
                  className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
                    categoriaSelecionada === 'gelo_petiscos'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  🧊 Gelo & Petiscos
                </button>
              </div>

              {/* GRID DE PRODUTOS EXPANSIVO */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {produtosDisponiveis.map((prod) => {
                  const qtdNoCarrinho = carrinho[prod.codigo]?.qtd || 0;
                  const esgotado = !prod.estoqueIlimitado && (prod.quantidade || 0) <= 0;

                  return (
                    <div
                      key={prod.codigo}
                      className={`bg-slate-900/90 border rounded-2xl p-3 flex flex-col justify-between transition-all group shadow-sm ${
                        esgotado ? 'opacity-50 border-slate-800' : 'border-slate-800 hover:border-amber-500/50'
                      }`}
                    >
                      <div>
                        {/* Imagem do Produto com Tag Gelada e Ajuste Contain sem corte */}
                        <div className="relative w-full aspect-square bg-slate-950 rounded-xl overflow-hidden mb-2.5 flex items-center justify-center border border-slate-800 p-2 sm:p-2.5">
                          {prod.foto ? (
                            <img
                              src={prod.foto}
                              alt={prod.nome}
                              className="w-full h-full max-w-full max-h-full object-contain group-hover:scale-105 transition duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-3xl">🍺</span>
                          )}
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 text-[9px] font-black uppercase tracking-wider backdrop-blur-sm">
                            Trincando ❄️
                          </span>
                          {esgotado && (
                            <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs font-black text-red-400">
                              Esgotado
                            </span>
                          )}
                        </div>

                        {/* Nome e Preço */}
                        <h3 className="font-bold text-xs sm:text-sm text-slate-100 line-clamp-2 leading-tight">
                          {prod.nome}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {prod.marca || prod.categoria || 'Gelada'}
                        </p>
                      </div>

                      <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block -mb-0.5">Por:</span>
                          <span className="text-base font-black text-amber-400">
                            R$ {Number(prod.preco_venda).toFixed(2)}
                          </span>
                        </div>

                        {/* Botões de Quantidade */}
                        {esgotado ? (
                          <span className="text-[10px] text-slate-500 font-bold">Sem estoque</span>
                        ) : qtdNoCarrinho > 0 ? (
                          <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 rounded-xl p-1 font-black shadow">
                            <button
                              onClick={() => removerDoCarrinho(prod.codigo)}
                              className="p-1 hover:bg-black/10 rounded-lg transition cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs px-1">{qtdNoCarrinho}</span>
                            <button
                              onClick={() => adicionarAoCarrinho(prod)}
                              className="p-1 hover:bg-black/10 rounded-lg transition cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => adicionarAoCarrinho(prod)}
                            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition shadow-md shadow-amber-500/20 cursor-pointer"
                            title="Adicionar à sacola"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Barra Flutuante de Sacola no Rodapé */}
              {totalItensQtd > 0 && (
                <div className="sticky bottom-2 z-20">
                  <button
                    onClick={() => setEtapa('carrinho')}
                    className="w-full p-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 flex items-center justify-between transition transform active:scale-98 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center font-black text-xs">
                        {totalItensQtd}
                      </div>
                      <span>Ver Sacola ({tipoPedido === 'retirada' ? 'Retirada' : 'Entrega'})</span>
                    </div>

                    <div className="flex items-center gap-1 text-base">
                      <span>R$ {valorTotalFinal.toFixed(2)}</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* ETAPA 2: SACOLA / CARRINHO DO CLIENTE                   */}
          {/* ======================================================== */}
          {etapa === 'carrinho' && (
            <div className="space-y-4 max-w-lg mx-auto">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                Sua Sacola de Bebidas ({totalItensQtd})
              </h2>

              {itensCarrinho.length > 0 ? (
                <div className="space-y-2">
                  {itensCarrinho.map(({ item, qtd }) => (
                    <div
                      key={item.codigo}
                      className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        {item.foto ? (
                          <img src={item.foto} alt="" className="w-12 h-12 object-contain p-1 bg-slate-950 rounded-xl border border-slate-800" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
                            🍺
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-xs text-white line-clamp-1">{item.nome}</h4>
                          <span className="text-xs text-amber-400 font-extrabold">
                            R$ {(item.preco_venda * qtd).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-800 px-2 py-1 rounded-xl">
                        <button
                          onClick={() => removerDoCarrinho(item.codigo)}
                          className="p-1 text-slate-300 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{qtd}</span>
                        <button
                          onClick={() => adicionarAoCarrinho(item)}
                          className="p-1 text-amber-400 hover:text-amber-300 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Resumo Financeiro */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal Itens:</span>
                      <span>R$ {subtotalCarrinho.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Taxa de Entrega:</span>
                      <span className={tipoPedido === 'retirada' ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                        {tipoPedido === 'retirada' ? 'Grátis (Retirada)' : `+ R$ ${taxaEntregaCalculada.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-black text-base text-white pt-2 border-t border-slate-800">
                      <span>Total do Pedido:</span>
                      <span className="text-amber-400">R$ {valorTotalFinal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setEtapa('checkout')}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Ir para o Endereço & Pagamento</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 space-y-3">
                  <span className="text-4xl block">🛍️</span>
                  <p>Sua sacola está vazia.</p>
                  <button
                    onClick={() => setEtapa('vitrine')}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Escolher Bebidas
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* ETAPA 3: CHECKOUT (ENDEREÇO & FORMA DE PAGAMENTO)       */}
          {/* ======================================================== */}
          {etapa === 'checkout' && (
            <div className="space-y-4 max-w-lg mx-auto">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                {tipoPedido === 'delivery' ? 'Dados para Entrega Rápida' : 'Dados para Retirada no Balcão'}
              </h2>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-xs">
                {/* Nome e WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Seu Nome:</label>
                    <input
                      type="text"
                      value={nomeCliente}
                      onChange={(e) => setNomeCliente(e.target.value)}
                      placeholder="Ex: Carlos Silva"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">WhatsApp para contato:</label>
                    <input
                      type="text"
                      value={telefoneCliente}
                      onChange={(e) => setTelefoneCliente(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                {/* Se for Delivery -> Campos de endereço */}
                {tipoPedido === 'delivery' ? (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="text-slate-400 block mb-1 font-semibold">Rua / Avenida:</label>
                        <input
                          type="text"
                          value={endereco.logradouro}
                          onChange={(e) => setEndereco({ ...endereco, logradouro: e.target.value })}
                          placeholder="Ex: Rua das Flores"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1 font-semibold">Número:</label>
                        <input
                          type="text"
                          value={endereco.numero}
                          onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
                          placeholder="123"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1 font-semibold">Bairro (Taxa: R$ {taxaEntregaCalculada.toFixed(2)}):</label>
                        <select
                          value={bairroSelecionadoId}
                          onChange={(e) => setBairroSelecionadoId(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                        >
                          {listaBairros.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.nome} (R$ {b.taxa.toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1 font-semibold">Complemento / Ap:</label>
                        <input
                          type="text"
                          value={endereco.complemento}
                          onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
                          placeholder="Apto 42 Bloco B"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1 font-semibold">Ponto de Referência (opcional):</label>
                      <input
                        type="text"
                        value={endereco.referencia}
                        onChange={(e) => setEndereco({ ...endereco, referencia: e.target.value })}
                        placeholder="Próximo à padaria, portão branco, etc."
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                      />
                    </div>
                  </>
                ) : (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                    <Store className="w-4 h-4 shrink-0" />
                    <span>
                      Você escolheu <strong>Retirar no Balcão</strong> da loja ({loja?.nome || 'Matriz'}). Seu pedido estará pronto em aproximadamente 15-20 minutos!
                    </span>
                  </div>
                )}

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Observações do Pedido:</label>
                  <input
                    type="text"
                    value={observacaoGeral}
                    onChange={(e) => setObservacaoGeral(e.target.value)}
                    placeholder="Ex: Mandar cerveja bem gelada, não tocar campainha, etc."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              {/* Formas de Pagamento */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-xs">
                <span className="font-bold text-sm text-white block">Forma de Pagamento:</span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormaPagamento('pix')}
                    className={`p-3 rounded-xl border text-left font-bold transition flex items-center gap-2 cursor-pointer ${
                      formaPagamento === 'pix'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-base">⚡</span>
                    <div>
                      <div>PIX</div>
                      <span className="text-[10px] font-normal text-slate-400">Aprovação imediata</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormaPagamento('cartao_credito')}
                    className={`p-3 rounded-xl border text-left font-bold transition flex items-center gap-2 cursor-pointer ${
                      formaPagamento === 'cartao_credito'
                        ? 'bg-blue-950/40 border-blue-500 text-blue-400 shadow'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-base">💳</span>
                    <div>
                      <div>Cartão Crédito</div>
                      <span className="text-[10px] font-normal text-slate-400">Na maquininha</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormaPagamento('cartao_debito')}
                    className={`p-3 rounded-xl border text-left font-bold transition flex items-center gap-2 cursor-pointer ${
                      formaPagamento === 'cartao_debito'
                        ? 'bg-blue-950/40 border-blue-500 text-blue-400 shadow'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-base">💳</span>
                    <div>
                      <div>Cartão Débito</div>
                      <span className="text-[10px] font-normal text-slate-400">Na maquininha</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormaPagamento('dinheiro')}
                    className={`p-3 rounded-xl border text-left font-bold transition flex items-center gap-2 cursor-pointer ${
                      formaPagamento === 'dinheiro'
                        ? 'bg-amber-950/40 border-amber-500 text-amber-400 shadow'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-base">💵</span>
                    <div>
                      <div>Dinheiro</div>
                      <span className="text-[10px] font-normal text-slate-400">No ato da entrega</span>
                    </div>
                  </button>
                </div>

                {/* Se Dinheiro -> Troco para quanto */}
                {formaPagamento === 'dinheiro' && (
                  <div className="pt-2">
                    <label className="text-slate-400 block mb-1 font-semibold">Precisa de troco para quanto? (R$):</label>
                    <input
                      type="number"
                      value={trocoPara}
                      onChange={(e) => setTrocoPara(e.target.value)}
                      placeholder="Ex: 50.00 (deixe vazio se não precisar)"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                )}

                {/* Se PIX -> Chave PIX da loja */}
                {formaPagamento === 'pix' && configDelivery.chavePix && (
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] text-emerald-400 uppercase font-black">Chave PIX da Loja:</div>
                      <span className="font-mono font-bold">{configDelivery.chavePix}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopiarPix(configDelivery.chavePix || '')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      {pixCopiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{pixCopiado ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Botão de Finalizar Pedido */}
              <button
                onClick={handleFinalizarPedido}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-emerald-500/25 transition transform active:scale-98 cursor-pointer"
              >
                CONFIRMAR PEDIDO (R$ {valorTotalFinal.toFixed(2)})
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* ETAPA 4: RASTREIO DO PEDIDO AO VIVO (COM CÓDIGO PIN)    */}
          {/* ======================================================== */}
          {etapa === 'rastreio' && pedidoAtivoRastreio && (
            <div className="space-y-4 max-w-lg mx-auto text-center py-2">
              
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
                  Pedido Recebido com Sucesso!
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Pedido #{pedidoAtivoRastreio.numeroPedido}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Tempo estimado: <strong>{loja?.tempo_estimado_entrega || `${configDelivery.tempoMinimoMinutos} a ${configDelivery.tempoMaximoMinutos} min`}</strong>
                </p>
              </div>

              {/* CARD DE DESTAQUE DO PIN DE ENTREGA (ESTILO ZÉ DELIVERY / ATENDEJÁ) */}
              <div className="bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-500 p-5 rounded-3xl text-slate-950 shadow-2xl space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider">
                  <KeyRound className="w-4 h-4" />
                  <span>Código de Segurança (PIN de Entrega)</span>
                </div>
                <div className="text-4xl font-mono font-black tracking-widest py-1">
                  {pedidoAtivoRastreio.codigoEntregaPin}
                </div>
                <p className="text-xs font-bold text-slate-900">
                  Diga este código de 4 dígitos para o entregador assim que ele chegar com suas bebidas!
                </p>
              </div>

              {/* BOTÃO ENVIAR PEDIDO NO WHATSAPP DA LOJA (ATENDEJÁ) */}
              <button
                type="button"
                onClick={() => handleEnviarPedidoWhatsAppLoja(pedidoAtivoRastreio)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Confirmação no WhatsApp da Loja</span>
              </button>

              {/* LINHA DO TEMPO DO STATUS AO VIVO */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-left space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Status do Pedido:
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-3 text-emerald-400 font-bold">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs">✓</div>
                    <span>1. Pedido Recebido na Loja</span>
                  </div>

                  <div className={`flex items-center gap-3 ${pedidoAtivoRastreio.status !== 'pendente' ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${pedidoAtivoRastreio.status !== 'pendente' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-500'}`}>
                      2
                    </div>
                    <span>2. Em Separação de Bebidas Geladas</span>
                  </div>

                  <div className={`flex items-center gap-3 ${pedidoAtivoRastreio.status === 'saiu_para_entrega' || pedidoAtivoRastreio.status === 'entregue' ? 'text-purple-400 font-bold' : 'text-slate-500'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${pedidoAtivoRastreio.status === 'saiu_para_entrega' || pedidoAtivoRastreio.status === 'entregue' ? 'bg-purple-600 text-white font-bold' : 'bg-slate-800 text-slate-500'}`}>
                      3
                    </div>
                    <span>3. Motoboy a Caminho do Endereço</span>
                  </div>

                  <div className={`flex items-center gap-3 ${pedidoAtivoRastreio.status === 'entregue' ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${pedidoAtivoRastreio.status === 'entregue' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-500'}`}>
                      4
                    </div>
                    <span>4. Entregue com Sucesso via PIN</span>
                  </div>
                </div>
              </div>

              {/* Resumo dos Itens */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-left space-y-2 text-xs">
                <span className="font-bold text-white block">Resumo do Pedido:</span>
                {pedidoAtivoRastreio.itens.map((it, i) => (
                  <div key={i} className="flex justify-between text-slate-300">
                    <span>{it.quantidade}x {it.nome}</span>
                    <span className="font-bold">R$ {it.subtotal.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total ({pedidoAtivoRastreio.tipo_pedido === 'retirada' ? 'Retirada' : 'com taxa'}):</span>
                  <span className="text-amber-400 text-sm font-black">
                    R$ {pedidoAtivoRastreio.valorTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setEtapa('vitrine')}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
              >
                Fazer Outro Pedido
              </button>

            </div>
          )}

          {/* ======================================================== */}
          {/* ETAPA 5: MEUS PEDIDOS ANTERIORES (ATENDEJÁ)              */}
          {/* ======================================================== */}
          {etapa === 'meus_pedidos' && (
            <div className="space-y-4 max-w-lg mx-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Histórico de Pedidos
                </h2>
                <button
                  onClick={() => setEtapa('vitrine')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Voltar ao Cardápio
                </button>
              </div>

              {pedidosDoCliente.length === 0 ? (
                <div className="p-10 text-center text-slate-400 space-y-2 bg-slate-900/60 rounded-2xl border border-slate-800">
                  <Bike className="w-8 h-8 mx-auto opacity-40 text-amber-400" />
                  <p className="font-bold text-white text-sm">Nenhum pedido recente encontrado.</p>
                  <p className="text-xs">Seus pedidos e PINs de entrega aparecerão aqui para fácil consulta.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pedidosDoCliente.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-sm text-white">
                          #{p.numeroPedido}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                          p.status === 'pendente'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : p.status === 'em_separacao'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : p.status === 'saiu_para_entrega'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}>
                          {p.status === 'pendente' ? '● Pendente' : p.status === 'em_separacao' ? '🔥 Em Preparo' : p.status === 'saiu_para_entrega' ? '🛵 A Caminho' : '✓ Entregue'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400">PIN de Entrega:</span>
                        <span className="font-mono font-black text-base text-amber-400">
                          {p.codigoEntregaPin}
                        </span>
                      </div>

                      <div className="text-slate-400 text-[11px]">
                        Data: {p.data} às {p.hora} • Total: <strong className="text-white">R$ {p.valorTotal.toFixed(2)}</strong>
                      </div>

                      <button
                        onClick={() => {
                          setPedidoAtivoRastreio(p);
                          setEtapa('rastreio');
                        }}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        Ver Detalhes do Rastreio
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
