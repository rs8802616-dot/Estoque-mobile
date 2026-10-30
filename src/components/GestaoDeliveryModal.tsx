import React, { useState, useEffect, useMemo } from 'react';
import {
  PedidoDelivery,
  ConfiguracaoDelivery,
  StatusPedidoDelivery,
  ItemEstoque,
  Supermercado,
} from '../types';
import { tocarAlertaNovoPedidoDelivery } from '../lib/soundUtils';
import { formatCurrency } from '../utils/formatters';
import { verificarStatusFuncionamentoDelivery } from '../utils/deliveryHorarios';
import {
  X,
  Bike,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Settings,
  PlusCircle,
  ExternalLink,
  Printer,
  KeyRound,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Eye,
  Store,
  RefreshCw,
  Flame,
  Check,
  Search,
  Share2,
  Copy,
  Receipt,
  ChefHat,
  ShoppingBag,
  UtensilsCrossed,
  FileCheck,
} from 'lucide-react';

interface GestaoDeliveryModalProps {
  visivel: boolean;
  onFechar: () => void;
  pedidos: PedidoDelivery[];
  configDelivery: ConfiguracaoDelivery;
  onSalvarConfig: (novaConfig: ConfiguracaoDelivery) => void;
  onAtualizarStatusPedido: (pedidoId: string, novoStatus: StatusPedidoDelivery, motivo?: string) => void;
  onConfirmarEntregaPin: (pedidoId: string, pinDigitado: string) => boolean;
  onAbrirCardapioCliente: () => void;
  estoque: ItemEstoque[];
  lojaAtual: Supermercado | null;
  onSimularNovoPedidoTeste?: () => void;
}

export const GestaoDeliveryModal: React.FC<GestaoDeliveryModalProps> = ({
  visivel,
  onFechar,
  pedidos,
  configDelivery,
  onSalvarConfig,
  onAtualizarStatusPedido,
  onConfirmarEntregaPin,
  onAbrirCardapioCliente,
  estoque,
  lojaAtual,
  onSimularNovoPedidoTeste,
}) => {
  // Filtros de status estilo AtendeJá / Imagem de referência
  // 'todos' | 'novo' | 'em_preparo' | 'pronto' | 'a_caminho' | 'entregue'
  const [pedidosFilterStatus, setPedidosFilterStatus] = useState<string>('todos');
  const [pedidosSearch, setPedidosSearch] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [modalConfigAberta, setModalConfigAberta] = useState(false);

  // Impressão de comanda
  const [comandaImpressao, setComandaImpressao] = useState<PedidoDelivery | null>(null);

  // Validação de PIN de entrega
  const [pedidoParaValidarPin, setPedidoParaValidarPin] = useState<PedidoDelivery | null>(null);
  const [pinDigitado, setPinDigitado] = useState('');
  const [erroPin, setErroPin] = useState('');

  // Notificação toast para NFC-e
  const [toastNfce, setToastNfce] = useState<string | null>(null);

  // Modal do Link do Motoboy com token exclusivo (Estilo AtendeJá)
  const [pedidoLinkMotoboy, setPedidoLinkMotoboy] = useState<PedidoDelivery | null>(null);
  const [copiouLinkMotoboy, setCopiouLinkMotoboy] = useState(false);

  // Formulário de configurações da loja
  const [formConfig, setFormConfig] = useState<ConfiguracaoDelivery>(configDelivery);

  // Efeito sonoro: alerta sempre que houver novos pedidos pendentes
  useEffect(() => {
    if (!visivel) return;

    const temNovos = pedidos.some((p) => p.status === 'pendente');
    if (temNovos) {
      tocarAlertaNovoPedidoDelivery();
      const interval = setInterval(() => {
        tocarAlertaNovoPedidoDelivery();
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [visivel, pedidos]);

  useEffect(() => {
    setFormConfig(configDelivery);
  }, [configDelivery]);

  const hojeFormatado = useMemo(() => {
    const agora = new Date();
    const y = agora.getFullYear();
    const m = String(agora.getMonth() + 1).padStart(2, '0');
    const d = String(agora.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  if (!visivel) return null;

  // Contadores globais
  const countNovos = pedidos.filter((p) => p.status === 'pendente').length;
  const countPreparo = pedidos.filter((p) => p.status === 'em_separacao').length;
  const countProntos = pedidos.filter((p) => p.status === 'pronto').length;
  const countACaminho = pedidos.filter((p) => p.status === 'saiu_para_entrega').length;
  const countEntregues = pedidos.filter((p) => p.status === 'entregue').length;
  const countTotal = pedidos.length;

  // Filtragem dos pedidos de Delivery
  const filteredOrders = pedidos.filter((p) => {
    // Filtro por status
    if (pedidosFilterStatus === 'novo' && p.status !== 'pendente') return false;
    if (pedidosFilterStatus === 'em_preparo' && p.status !== 'em_separacao') return false;
    if (pedidosFilterStatus === 'pronto' && p.status !== 'pronto') return false;
    if (pedidosFilterStatus === 'a_caminho' && p.status !== 'saiu_para_entrega') return false;
    if (pedidosFilterStatus === 'entregue' && p.status !== 'entregue') return false;

    // Filtro por busca
    if (pedidosSearch.trim()) {
      const b = pedidosSearch.toLowerCase().trim();
      const nomeMatch = p.cliente?.nome?.toLowerCase().includes(b);
      const foneMatch = p.cliente?.telefone?.replace(/\D/g, '').includes(b.replace(/\D/g, ''));
      const ruaMatch = p.enderecoEntrega?.logradouro?.toLowerCase().includes(b);
      const bairroMatch = p.enderecoEntrega?.bairro?.toLowerCase().includes(b);
      const numMatch = p.numeroPedido?.toString().includes(b);
      if (!nomeMatch && !foneMatch && !ruaMatch && !bairroMatch && !numMatch) return false;
    }

    return true;
  }).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  // Copiar link do cardápio digital
  const handleCopiarLinkCardapio = () => {
    const slug = lojaAtual?.slug || lojaAtual?.id || 'loja_matriz_01';
    let url = `${window.location.origin}/?loja=${slug}`;
    if (lojaAtual?.marca) url += `&marca=${encodeURIComponent(lojaAtual.marca)}`;
    if (lojaAtual?.nome) url += `&nome=${encodeURIComponent(lojaAtual.nome)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Obter ou gerar token único de 16 caracteres para o link exclusivo do motoboy
  const obterOuGerarTokenMotoboy = (pedido: PedidoDelivery): string => {
    if (pedido.motoboyToken) return pedido.motoboyToken;
    const token = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    pedido.motoboyToken = token;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`motoboy_pedido_${pedido.numeroPedido}`, JSON.stringify(pedido));
      } catch {}
    }
    return token;
  };

  // Gerador de URL exclusiva do Motoboy (?motoboy=1&pedido=209&token=...)
  const gerarUrlMotoboy = (pedido: PedidoDelivery): string => {
    const token = obterOuGerarTokenMotoboy(pedido);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`motoboy_pedido_${pedido.numeroPedido}`, JSON.stringify(pedido));
      } catch {}
    }
    return `${window.location.origin}/?motoboy=1&pedido=${pedido.numeroPedido}&token=${token}`;
  };

  // Copiar link exclusivo do motoboy
  const handleCopiarLinkMotoboy = (pedido: PedidoDelivery) => {
    const url = gerarUrlMotoboy(pedido);
    navigator.clipboard.writeText(url);
    setCopiouLinkMotoboy(true);
    setTimeout(() => setCopiouLinkMotoboy(false), 2500);
  };

  // Enviar link no WhatsApp do motoboy
  const handleEnviarWhatsAppMotoboyModal = (pedido: PedidoDelivery) => {
    const link = gerarUrlMotoboy(pedido);
    const end = pedido.enderecoEntrega;
    const enderecoCompleto = `${end.logradouro}, ${end.numero}${end.complemento ? ' - ' + end.complemento : ''}, ${end.bairro}`;
    const texto = `🛵 *ENTREGA DE PEDIDO #${pedido.numeroPedido}*\n\n` +
      `👤 *Cliente:* ${pedido.cliente.nome}\n` +
      `📱 *WhatsApp:* ${pedido.cliente.telefone}\n` +
      `📍 *Endereço:* ${enderecoCompleto}\n` +
      (end.referencia ? `🏷️ *Ref:* ${end.referencia}\n` : '') +
      `💰 *Total a Cobrar:* ${formatCurrency(pedido.valorTotal)}\n` +
      `💳 *Forma de Pgto:* ${pedido.formaPagamento.toUpperCase()}\n` +
      (pedido.trocoPara ? `💵 *Troco para:* ${formatCurrency(pedido.trocoPara)}\n` : '') +
      `\n📲 *ABRA O LINK DE ENTREGA COM GPS E DADOS COMPLETOS:*\n${link}`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  // Visualizar tela do motoboy em nova aba
  const handleVisualizarTelaMotoboy = (pedido: PedidoDelivery) => {
    const link = gerarUrlMotoboy(pedido);
    window.open(link, '_blank');
  };

  const handleDispararNfce = (pedido: PedidoDelivery) => {
    setToastNfce(`NFC-e do Pedido #${pedido.numeroPedido} pronta para emissão fiscal!`);
    setTimeout(() => setToastNfce(null), 3000);
  };

  // Renderizador de Card Individual de Pedido de Delivery
  const renderCard = (order: PedidoDelivery) => {
    const isNovo = order.status === 'pendente';
    const isPreparo = order.status === 'em_separacao';
    const isPronto = order.status === 'pronto';
    const isACaminho = order.status === 'saiu_para_entrega';
    const isEntregue = order.status === 'entregue';
    const isCancelado = order.status === 'cancelado';

    const partesData = (order.data || '').split('-');
    const dataFormatada = partesData.length === 3 ? `${partesData[2]}/${partesData[1]}/${partesData[0]}` : order.data;
    const isAnterior = order.data && order.data < hojeFormatado;

    // Borda do card:
    // Delivery a caminho tem borda verde destacada. Novo tem borda vermelha 2px.
    let cardBorder = 'border border-slate-200';
    if (isNovo) cardBorder = 'border-2 border-red-500 shadow-sm ring-2 ring-red-500/10';
    else if (isACaminho) cardBorder = 'border-2 border-[#10b981] shadow-sm';
    else if (isPreparo) cardBorder = 'border-2 border-amber-400 shadow-sm';
    else if (isPronto) cardBorder = 'border-2 border-emerald-500 shadow-sm';

    return (
      <div
        key={order.id}
        className={`bg-white rounded-2xl p-3.5 sm:p-4 text-xs transition shadow-xs flex flex-col justify-between gap-3 relative ${cardBorder}`}
      >
        {/* TOPO DO CARD: TAG DO CANAL + BADGE DE STATUS */}
        <div className="flex items-center justify-between gap-2">
          {/* Tag DELIVERY */}
          <div className="flex items-center gap-1.5">
            <span className="bg-[#059669] text-white text-[11px] font-black px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-xs uppercase">
              <Bike className="w-3.5 h-3.5" />
              <span>DELIVERY</span>
            </span>
            <span className="font-mono font-bold text-slate-800 text-xs">
              #{order.numeroPedido}
            </span>
          </div>

          {/* Badge de Status no Canto Direito */}
          <div>
            {isNovo && (
              <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-xs animate-pulse">
                ● NOVO
              </span>
            )}
            {isPreparo && (
              <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <Flame className="w-3 h-3 text-white" />
                <span>EM PREPARO</span>
              </span>
            )}
            {isPronto && (
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <Check className="w-3 h-3 text-white stroke-[3]" />
                <span>PRONTO</span>
              </span>
            )}
            {isACaminho && (
              <span className="bg-[#059669] text-white text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <Bike className="w-3 h-3 text-white" />
                <span>A CAMINHO</span>
              </span>
            )}
            {isEntregue && (
              <span className="bg-[#334155] text-white text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <Check className="w-3 h-3 text-white stroke-[3]" />
                <span>ENTREGUE</span>
              </span>
            )}
            {isCancelado && (
              <span className="bg-slate-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                CANCELADO
              </span>
            )}
          </div>
        </div>

        {/* INFORMAÇÕES DO CLIENTE / ORIGEM / DATA */}
        <div className="space-y-1 text-xs text-slate-700">
          <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
            <span className="text-slate-600">👤</span>
            <span className="truncate">{order.cliente.nome || 'Cliente'}</span>
          </div>

          {order.cliente.telefone && (
            <div className="text-slate-600 font-mono flex items-center gap-1.5 text-[11px]">
              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              <a
                href={`https://wa.me/55${order.cliente.telefone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-slate-700 font-semibold"
              >
                {order.cliente.telefone}
              </a>
            </div>
          )}

          <div className="text-slate-600 flex items-start gap-1 text-[11px] leading-snug">
            <MapPin className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
            <span className="truncate">
              {order.enderecoEntrega.logradouro}, {order.enderecoEntrega.numero}
              {order.enderecoEntrega.bairro ? ` (${order.enderecoEntrega.bairro})` : ''}
              {order.enderecoEntrega.referencia ? ` - Ref: ${order.enderecoEntrega.referencia}` : ''}
            </span>
          </div>

          {/* Data e Hora + Badge Anterior / Hoje */}
          <div className="text-slate-400 text-[11px] font-mono flex items-center gap-1.5 pt-0.5">
            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{dataFormatada} às {order.hora}</span>
            {isAnterior ? (
              <span className="bg-[#fef3c7] text-[#92400e] text-[9px] font-black px-1.5 py-0.5 rounded border border-[#fde68a] uppercase tracking-wide">
                ANTERIOR
              </span>
            ) : (
              <span className="bg-[#dcfce7] text-[#166534] text-[9px] font-black px-1.5 py-0.5 rounded border border-[#bbf7d0] uppercase tracking-wide">
                HOJE
              </span>
            )}
          </div>
        </div>

        {/* DIVISOR SUTIL */}
        <div className="border-t border-slate-100 my-0.5" />

        {/* LISTA DE ITENS DO PEDIDO */}
        <div className="space-y-1 text-xs">
          {order.itens.map((it, idx) => (
            <div key={idx} className="flex justify-between items-baseline gap-2">
              <span className="text-slate-800 font-medium truncate">
                <strong className="text-slate-900 mr-1">{it.quantidade}x</strong>
                <span>{it.nome}</span>
                {it.gelado && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-100 text-cyan-800 border border-cyan-200 ml-1">
                    Gelada ❄️
                  </span>
                )}
              </span>
              <span className="font-mono font-bold text-slate-900 shrink-0">
                {formatCurrency(it.subtotal)}
              </span>
            </div>
          ))}
        </div>

        {/* BARRA INFERIOR: TOTAL + BOTÕES DE AÇÃO */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 mt-auto">
          {/* Caixa de TOTAL com badge colorido */}
          <div className="bg-[#d1fae5]/80 border border-[#a7f3d0] rounded-xl px-2.5 py-1.5 flex items-center gap-1 shrink-0">
            <span className="text-xs sm:text-sm font-black text-[#065f46] font-mono">
              {formatCurrency(order.valorTotal)}
            </span>
          </div>

          {/* BOTÕES DE AÇÃO NA DIREITA */}
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Botão Imprimir Comanda */}
            <button
              type="button"
              onClick={() => setComandaImpressao(order)}
              className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-2xs transition cursor-pointer active:scale-95 shrink-0"
              title="Imprimir comanda térmica"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            {/* Botão Link Motoboy com Token e GPS (Exibido apenas após o pedido ser aceito) */}
            {order.status !== 'pendente' && order.status !== 'entregue' && order.status !== 'cancelado' && (
              <button
                type="button"
                onClick={() => setPedidoLinkMotoboy(order)}
                className="px-2.5 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
                title="Abrir link do motoboy para envio no WhatsApp"
              >
                <Share2 className="w-3 h-3" />
                <span>Link</span>
              </button>
            )}

            {/* Botões de Ação do Ciclo de Vida */}
            {isNovo && (
              <button
                type="button"
                onClick={() => onAtualizarStatusPedido(order.id, 'em_separacao')}
                className="px-3 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
                title="Confirmar pedido e iniciar separação"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Confirmar</span>
              </button>
            )}

            {isPreparo && (
              <button
                type="button"
                onClick={() => onAtualizarStatusPedido(order.id, 'saiu_para_entrega')}
                className="px-3 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
                title="Despachar para o motoboy"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Despachar</span>
              </button>
            )}

            {isACaminho && (
              <button
                type="button"
                onClick={() => {
                  setPedidoParaValidarPin(order);
                  setPinDigitado('');
                  setErroPin('');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
                title="Validar PIN com o cliente e finalizar"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Entregue</span>
              </button>
            )}

            {/* Botão NFC-e ✓ idêntico à imagem de referência */}
            <button
              type="button"
              onClick={() => handleDispararNfce(order)}
              className="px-2 py-1.5 rounded-xl bg-[#a5f3fc] hover:bg-[#67e8f9] text-[#0e7490] border border-[#67e8f9] font-bold text-xs flex items-center gap-1 shadow-2xs transition cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
              title="Emitir ou verificar NFC-e"
            >
              <FileCheck className="w-3.5 h-3.5 text-[#0e7490]" />
              <span>NFC-e ✓</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto"
      style={{ zIndex: 9999999 }}
    >
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-7xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        
        {/* CABEÇALHO DO PAINEL DE DELIVERY EM MODO CLARO */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-500/20 text-white">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Gestão de Pedidos & Delivery
                </h2>
                {(() => {
                  const status = verificarStatusFuncionamentoDelivery(configDelivery);
                  return (
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 ${
                        status.aberta
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                      title={status.motivo || `Delivery aberto das ${status.horarioFormatado}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${status.aberta ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      {status.aberta ? 'Loja Aberta' : 'Loja Fechada'}
                    </span>
                  );
                })()}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Painel integrado de pedidos com canais de Delivery, Retirada e Mesas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Botão Copiar Link do Cardápio */}
            <button
              onClick={handleCopiarLinkCardapio}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs shadow-2xs transition cursor-pointer border ${
                copiedLink
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-slate-50 text-purple-700 border-purple-200'
              }`}
              title="Copiar link para enviar aos clientes no WhatsApp"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link Cardápio'}</span>
            </button>

            {/* Botão Abrir Cardápio */}
            <button
              onClick={onAbrirCardapioCliente}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-2xs transition cursor-pointer"
              title="Abrir o Cardápio do Cliente para testar ou criar pedidos"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver Cardápio</span>
            </button>

            {/* Simulação de Pedido Teste */}
            {onSimularNovoPedidoTeste && (
              <button
                onClick={onSimularNovoPedidoTeste}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition border border-slate-200 shadow-2xs cursor-pointer"
                title="Cria um pedido de teste para testar o alarme e o fluxo"
              >
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>Simular Pedido</span>
              </button>
            )}

            {/* Botão de Configurações */}
            <button
              onClick={() => setModalConfigAberta(true)}
              className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition border border-slate-200 shadow-2xs cursor-pointer"
              title="Configurações de Taxa, Raio e Horários"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Fechar */}
            <button
              onClick={onFechar}
              className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition border border-slate-200 shadow-2xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BARRA DE FILTROS POR STATUS (EXATAMENTE IDÊNTICA À SEGUNDA FOTO DE REFERÊNCIA) */}
        <div className="px-4 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* TODOS (20) - Selecionado fica com fundo preto/dark conforme foto */}
            <button
              type="button"
              onClick={() => setPedidosFilterStatus('todos')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 font-bold cursor-pointer shadow-2xs ${
                pedidosFilterStatus === 'todos'
                  ? 'bg-slate-900 text-white border border-slate-900'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              TODOS ({countTotal})
            </button>

            {/* NOVOS (1) */}
            <button
              type="button"
              onClick={() => setPedidosFilterStatus('novo')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 font-bold cursor-pointer shadow-2xs ${
                pedidosFilterStatus === 'novo'
                  ? 'bg-red-600 text-white border border-red-600'
                  : 'bg-white text-red-600 border border-slate-200 hover:bg-red-50/50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              NOVOS ({countNovos})
            </button>

            {/* EM PREPARO (0) */}
            <button
              type="button"
              onClick={() => setPedidosFilterStatus('em_preparo')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 font-bold cursor-pointer shadow-2xs ${
                pedidosFilterStatus === 'em_preparo'
                  ? 'bg-amber-500 text-white border border-amber-500'
                  : 'bg-white text-amber-600 border border-slate-200 hover:bg-amber-50/50'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              EM PREPARO ({countPreparo})
            </button>

            {/* PRONTOS (0) */}
            <button
              type="button"
              onClick={() => setPedidosFilterStatus('pronto')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 font-bold cursor-pointer shadow-2xs ${
                pedidosFilterStatus === 'pronto'
                  ? 'bg-emerald-600 text-white border border-emerald-600'
                  : 'bg-white text-emerald-600 border border-slate-200 hover:bg-emerald-50/50'
              }`}
            >
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              PRONTOS ({countProntos})
            </button>

            {/* A CAMINHO (1) */}
            <button
              type="button"
              onClick={() => setPedidosFilterStatus('a_caminho')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 font-bold cursor-pointer shadow-2xs ${
                pedidosFilterStatus === 'a_caminho'
                  ? 'bg-purple-600 text-white border border-purple-600'
                  : 'bg-white text-purple-600 border border-slate-200 hover:bg-purple-50/50'
              }`}
            >
              <Bike className="w-3.5 h-3.5 text-purple-600" />
              A CAMINHO ({countACaminho})
            </button>

            {/* ENTREGUES (1) */}
            <button
              type="button"
              onClick={() => setPedidosFilterStatus('entregue')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 font-bold cursor-pointer shadow-2xs ${
                pedidosFilterStatus === 'entregue'
                  ? 'bg-slate-700 text-white border border-slate-700'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              ENTREGUES ({countEntregues})
            </button>
          </div>

          {/* Barra de Busca arredondada (Buscar cliente, mesa, fone...) */}
          <div className="relative w-full sm:w-72 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="search"
              name="busca_gestao_delivery_modal"
              autoComplete="off"
              value={pedidosSearch}
              onChange={(e) => setPedidosSearch(e.target.value)}
              placeholder="Buscar cliente, mesa, fone..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white border border-slate-200 rounded-full text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 shadow-2xs"
            />
            {pedidosSearch && (
              <button
                type="button"
                onClick={() => setPedidosSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ÁREA DE PEDIDOS DE DELIVERY */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 bg-slate-50/70">
          {toastNfce && (
            <div className="mb-3 p-3 bg-cyan-50 border border-cyan-300 text-cyan-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
              <FileCheck className="w-4 h-4 text-cyan-700" />
              <span>{toastNfce}</span>
            </div>
          )}

          {/* PAINEL PRINCIPAL DE DELIVERY (VERDE/MINT CONFORME FOTO) */}
          <div className="bg-[#f0fdf4] border border-[#a7f3d0] rounded-3xl p-4 sm:p-5 flex flex-col space-y-4 min-w-0 shadow-2xs">
            {/* Header da Seção de Delivery */}
            <div className="flex items-center justify-between pb-3 border-b border-[#a7f3d0]/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#d1fae5] text-[#059669] flex items-center justify-center border border-[#a7f3d0] shadow-2xs shrink-0">
                  <Bike className="w-5 h-5 text-[#059669]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900 tracking-tight">
                      PEDIDOS DE DELIVERY
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#d1fae5] text-[#065f46] text-xs font-bold border border-[#a7f3d0]">
                      {filteredOrders.length}
                    </span>
                  </div>
                  <p className="text-xs text-[#065f46] font-medium mt-0.5">
                    Entregas motoboy com histórico, rota no Maps e despacho integrado
                  </p>
                </div>
              </div>
            </div>

            {/* Grid dos Cards de Delivery */}
            {filteredOrders.length === 0 ? (
              <div className="py-16 text-center bg-white/80 border border-dashed border-[#a7f3d0] rounded-2xl text-xs text-[#065f46] space-y-2">
                <Bike className="w-10 h-10 mx-auto text-[#059669]/60" />
                <p className="font-bold text-sm text-slate-800">Nenhum pedido de delivery encontrado neste filtro.</p>
                <p className="text-xs text-slate-500">
                  Novos pedidos feitos no cardápio do cliente tocarão alerta e aparecerão aqui em tempo real.
                </p>
                {onSimularNovoPedidoTeste && (
                  <button
                    type="button"
                    onClick={onSimularNovoPedidoTeste}
                    className="mt-2 px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Simular Pedido de Teste</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {filteredOrders.map((order) => renderCard(order))}
              </div>
            )}
          </div>
        </div>

        {/* MODAL DE IMPRESSÃO DE COMANDA TÉRMICA */}
        {comandaImpressao && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            style={{ zIndex: 10000000 }}
          >
            <div className="bg-white text-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl font-mono text-xs space-y-3 border border-slate-200">
              <div className="text-center border-b border-dashed border-slate-300 pb-3">
                <h3 className="font-black text-sm uppercase tracking-wide">
                  {lojaAtual?.nome || 'COMANDA DE ENTREGA'}
                </h3>
                <p className="text-[10px] text-slate-500">PEDIDO #{comandaImpressao.numeroPedido}</p>
                <p className="text-[10px] text-slate-500">{comandaImpressao.data} - {comandaImpressao.hora}</p>
              </div>

              <div className="space-y-0.5">
                <p><strong>Cliente:</strong> {comandaImpressao.cliente.nome}</p>
                <p><strong>Telefone:</strong> {comandaImpressao.cliente.telefone}</p>
                {comandaImpressao.tipo_pedido !== 'retirada' && comandaImpressao.tipo_pedido !== 'mesa' && (
                  <>
                    <p><strong>Endereço:</strong> {comandaImpressao.enderecoEntrega.logradouro}, {comandaImpressao.enderecoEntrega.numero}</p>
                    <p><strong>Bairro:</strong> {comandaImpressao.enderecoEntrega.bairro}</p>
                    {comandaImpressao.enderecoEntrega.referencia && (
                      <p><strong>Ref:</strong> {comandaImpressao.enderecoEntrega.referencia}</p>
                    )}
                  </>
                )}
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1">
                <p className="font-bold">ITENS:</p>
                {comandaImpressao.itens.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{it.quantidade}x {it.nome}</span>
                    <span>{formatCurrency(it.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(comandaImpressao.subtotal)}</span>
                </div>
                {comandaImpressao.taxaEntrega > 0 && (
                  <div className="flex justify-between">
                    <span>Taxa de Entrega:</span>
                    <span>{formatCurrency(comandaImpressao.taxaEntrega)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-slate-200">
                  <span>TOTAL A COBRAR:</span>
                  <span>{formatCurrency(comandaImpressao.valorTotal)}</span>
                </div>
                <p><strong>Forma:</strong> {comandaImpressao.formaPagamento.toUpperCase()}</p>
                {comandaImpressao.trocoPara && (
                  <p><strong>Levar troco para:</strong> {formatCurrency(comandaImpressao.trocoPara)}</p>
                )}
                {comandaImpressao.codigoEntregaPin && (
                  <p className="pt-2 text-center font-bold text-sm text-emerald-800">
                    PIN DE CONFIRMAÇÃO: {comandaImpressao.codigoEntregaPin}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setComandaImpressao(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE VALIDAÇÃO DE PIN DE ENTREGA (MODO CLARO) */}
        {pedidoParaValidarPin && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            style={{ zIndex: 10000000 }}
          >
            <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center text-slate-900">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center border border-amber-200">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Confirmar Entrega #{pedidoParaValidarPin.numeroPedido}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Digite o código PIN de 4 dígitos informado pelo cliente no momento da entrega:
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={4}
                  value={pinDigitado}
                  onChange={(e) => setPinDigitado(e.target.value.replace(/\D/g, ''))}
                  placeholder="0000"
                  className="w-36 text-center text-3xl font-mono font-bold tracking-widest bg-slate-50 border-2 border-emerald-500 rounded-2xl p-2.5 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  autoFocus
                />
                {erroPin && <p className="text-xs text-rose-500 mt-2 font-semibold">{erroPin}</p>}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPedidoParaValidarPin(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (pinDigitado.length !== 4) {
                      setErroPin('O PIN deve conter exatamente 4 dígitos.');
                      return;
                    }
                    const sucesso = onConfirmarEntregaPin(pedidoParaValidarPin.id, pinDigitado);
                    if (sucesso) {
                      setPedidoParaValidarPin(null);
                    } else {
                      setErroPin('PIN incorreto! Verifique com o cliente.');
                    }
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Validar & Concluir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE CONFIGURAÇÕES DE DELIVERY (MODO CLARO) */}
        {modalConfigAberta && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
            style={{ zIndex: 10000000 }}
          >
            <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-800">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base font-bold text-slate-900">Configurações de Delivery da Loja</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalConfigAberta(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* Ligar / Desligar Loja */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">Status da Loja no Delivery:</span>
                    <span className="text-slate-500">Permite que clientes façam pedidos online</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormConfig((prev) => ({ ...prev, ativo: !prev.ativo }))}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                      formConfig.ativo
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-rose-600 text-white shadow-xs'
                    }`}
                  >
                    {formConfig.ativo ? '🟢 ABERTA' : '🔴 FECHADA'}
                  </button>
                </div>

                {/* Horário de Início e Término do Delivery (Bloqueio Automático) */}
                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-purple-950 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>Horário de Funcionamento do Delivery:</span>
                    </span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                      Bloqueio Automático
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-0.5">
                    <div>
                      <label className="text-slate-700 block mb-1 font-semibold text-[11px]">
                        Horário de Início (Abertura):
                      </label>
                      <input
                        type="time"
                        value={formConfig.horarioAbertura || '08:00'}
                        onChange={(e) => setFormConfig((prev) => ({ ...prev, horarioAbertura: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:border-purple-500 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 block mb-1 font-semibold text-[11px]">
                        Horário de Término (Fechamento):
                      </label>
                      <input
                        type="time"
                        value={formConfig.horarioFechamento || '23:00'}
                        onChange={(e) => setFormConfig((prev) => ({ ...prev, horarioFechamento: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:border-purple-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-purple-800/80 leading-tight">
                    💡 Fora deste horário, o cliente não conseguirá enviar pedidos pelo cardápio online e verá o aviso de loja fechada.
                  </p>
                </div>

                {/* Taxa de Entrega e Raio */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Taxa de Entrega Fixa (R$):</label>
                    <input
                      type="number"
                      step="0.50"
                      value={formConfig.taxaEntregaFixa}
                      onChange={(e) => setFormConfig((prev) => ({ ...prev, taxaEntregaFixa: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Raio Máximo Atendido (km):</label>
                    <input
                      type="number"
                      value={formConfig.raioMaximoKm}
                      onChange={(e) => setFormConfig((prev) => ({ ...prev, raioMaximoKm: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Tempos Estimados e Pedido Mínimo */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Tempo Mín (min):</label>
                    <input
                      type="number"
                      value={formConfig.tempoMinimoMinutos}
                      onChange={(e) => setFormConfig((prev) => ({ ...prev, tempoMinimoMinutos: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Tempo Máx (min):</label>
                    <input
                      type="number"
                      value={formConfig.tempoMaximoMinutos}
                      onChange={(e) => setFormConfig((prev) => ({ ...prev, tempoMaximoMinutos: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Ped. Mínimo (R$):</label>
                    <input
                      type="number"
                      value={formConfig.valorMinimoPedido}
                      onChange={(e) => setFormConfig((prev) => ({ ...prev, valorMinimoPedido: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Chave PIX da Loja */}
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Chave PIX da Loja (para pagamentos online):</label>
                  <input
                    type="text"
                    value={formConfig.chavePix || ''}
                    onChange={(e) => setFormConfig((prev) => ({ ...prev, chavePix: e.target.value }))}
                    placeholder="CNPJ, E-mail, Celular ou Chave Aleatória"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Telefone / WhatsApp da Loja */}
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">WhatsApp da Loja para Suporte:</label>
                  <input
                    type="text"
                    value={formConfig.telefoneContatoLoja || ''}
                    onChange={(e) => setFormConfig((prev) => ({ ...prev, telefoneContatoLoja: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalConfigAberta(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSalvarConfig(formConfig);
                    setModalConfigAberta(false);
                  }}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE LINK DO MOTOBOY (EXATAMENTE COMO NA FOTO DE REFERÊNCIA) */}
        {pedidoLinkMotoboy && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            style={{ zIndex: 10000000 }}
          >
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fadeIn">
              {/* Header do Modal */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 shrink-0">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      Link do Motoboy • Pedido #{pedidoLinkMotoboy.numeroPedido}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Acesso direto sem necessidade de login ou senha
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPedidoLinkMotoboy(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Box Roxo Informativo (Idêntico à Imagem) */}
              <div className="bg-[#faf5ff] border border-[#f3e8ff] rounded-2xl p-4 text-xs text-[#581c87] space-y-2">
                <p className="font-extrabold flex items-center gap-1.5 text-[#6b21a8]">
                  <span>📱</span>
                  <span>Esta página leve abre no celular do motoboy com:</span>
                </p>
                <ul className="space-y-1.5 pl-1 text-[11px] text-slate-700">
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Endereço do cliente com GPS (Google Maps e Waze)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Telefone do cliente com botão para ligar ou abrir WhatsApp</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Valor total a cobrar e troco exato a devolver</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Botão &quot;Finalizar Entrega&quot; para atualizar no sistema</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-emerald-700 font-semibold pt-0.5">
                    <span>🛡️</span>
                    <span>Expira 3 minutos após confirmada a entrega (proteção LGPD)</span>
                  </li>
                </ul>
              </div>

              {/* Campo do Link com Botão Copiar */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Link de Entrega Exclusivo:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={gerarUrlMotoboy(pedidoLinkMotoboy)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 select-all focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopiarLinkMotoboy(pedidoLinkMotoboy)}
                    className="px-4 py-2 bg-[#1e293b] hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                  >
                    {copiouLinkMotoboy ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiouLinkMotoboy ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Botões de Ação na Parte Inferior */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleEnviarWhatsAppMotoboyModal(pedidoLinkMotoboy)}
                  className="py-2.5 px-3 bg-[#059669] hover:bg-[#047857] text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Enviar no WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleVisualizarTelaMotoboy(pedidoLinkMotoboy)}
                  className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-800 font-black text-xs rounded-xl border border-slate-300 shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Visualizar Tela</span>
                </button>
              </div>

              {/* Botão Fechar no rodapé */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setPedidoLinkMotoboy(null)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
