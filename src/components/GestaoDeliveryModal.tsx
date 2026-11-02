import React, { useState, useEffect, useMemo } from 'react';
import {
  PedidoDelivery,
  ConfiguracaoDelivery,
  StatusPedidoDelivery,
  ItemEstoque,
  Supermercado,
  obterLinksExclusivosLoja,
} from '../types';
import {
  tocarAlertaNovoPedidoDelivery,
  pararAlertaNovoPedidoDelivery,
  registrarOuvinteStatusAlerta,
  tocarSomEntregaFinalizadaMotoboy,
} from '../lib/soundUtils';
import { formatCurrency } from '../utils/formatters';
import { verificarStatusFuncionamentoDelivery } from '../utils/deliveryHorarios';
import { mascaraTelefone } from '../lib/mascaras';
import { imprimirCupomTermico } from '../utils/impressaoTermica';
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
  onRemoverItemPedido?: (pedidoId: string, indiceItem: number, motivo?: string) => void;
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
  onRemoverItemPedido,
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
  const [copiouTokenEquipe, setCopiouTokenEquipe] = useState<string | null>(null);
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

  // Modal de Cancelamento de Pedido pelo Lojista
  const [pedidoParaCancelar, setPedidoParaCancelar] = useState<PedidoDelivery | null>(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');

  // Formulário de configurações da loja
  const [formConfig, setFormConfig] = useState<ConfiguracaoDelivery>(configDelivery);

  // Monitora se o toque do sino está tocando no momento (permite silenciar com 1 clique)
  const [alertaSinoTocando, setAlertaSinoTocando] = useState(false);
  useEffect(() => {
    const unsub = registrarOuvinteStatusAlerta(setAlertaSinoTocando);
    return unsub;
  }, []);

  // Para o toque ao fechar o modal
  useEffect(() => {
    if (!visivel) {
      pararAlertaNovoPedidoDelivery();
    }
  }, [visivel]);

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
  const countCancelados = pedidos.filter((p) => p.status === 'cancelado').length;
  const countTotal = pedidos.length;

  const handleConfirmarCancelamento = (avisarWhatsApp: boolean) => {
    if (!pedidoParaCancelar) return;
    const motivoFinal = motivoCancelamento.trim() || 'Cancelado pelo estabelecimento';
    onAtualizarStatusPedido(pedidoParaCancelar.id, 'cancelado', motivoFinal);

    if (avisarWhatsApp && pedidoParaCancelar.cliente?.telefone) {
      const foneLimpo = pedidoParaCancelar.cliente.telefone.replace(/\D/g, '');
      const foneComDdi = foneLimpo.startsWith('55') ? foneLimpo : `55${foneLimpo}`;
      const texto =
        `Olá, *${pedidoParaCancelar.cliente.nome}*!\n` +
        `Infelizmente precisamos cancelar o seu *Pedido #${pedidoParaCancelar.numeroPedido}* em *${lojaAtual?.nome || 'nossa loja'}*.\n\n` +
        `📌 *Motivo:* ${motivoFinal}\n\n` +
        `Pedimos desculpas pelo transtorno! Qualquer dúvida estamos à disposição.`;
      window.open(`https://api.whatsapp.com/send?phone=${foneComDdi}&text=${encodeURIComponent(texto)}`, '_blank');
    }

    setPedidoParaCancelar(null);
    setMotivoCancelamento('');
  };

  // Filtragem dos pedidos de Delivery
  const filteredOrders = pedidos.filter((p) => {
    // Filtro por status
    if (pedidosFilterStatus === 'novo' && p.status !== 'pendente') return false;
    if (pedidosFilterStatus === 'em_preparo' && p.status !== 'em_separacao') return false;
    if (pedidosFilterStatus === 'pronto' && p.status !== 'pronto') return false;
    if (pedidosFilterStatus === 'a_caminho' && p.status !== 'saiu_para_entrega') return false;
    if (pedidosFilterStatus === 'entregue' && p.status !== 'entregue') return false;
    if (pedidosFilterStatus === 'cancelado' && p.status !== 'cancelado') return false;

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

  // Copiar link do cardápio digital (?loja=slug)
  const handleCopiarLinkCardapio = () => {
    const links = lojaAtual
      ? obterLinksExclusivosLoja(lojaAtual)
      : { cardapio: `${window.location.origin}/?loja=loja-centro` };
    navigator.clipboard.writeText(links.cardapio);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Obter ou gerar token único mto_... para o link exclusivo do motoboy
  const obterOuGerarTokenMotoboy = (pedido: PedidoDelivery): string => {
    if (pedido.motoboyToken) return pedido.motoboyToken;
    const token = 'mto_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
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

          {/* Botão Cancelar (No topo ao lado do status) + Badge de Status no Canto Direito */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!isEntregue && !isCancelado && (
              <button
                type="button"
                onClick={() => {
                  setPedidoParaCancelar(order);
                  setMotivoCancelamento('');
                }}
                className="px-2 py-0.5 rounded-md bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs transition cursor-pointer active:scale-95"
                title="Cancelar ou recusar este pedido de entrega"
              >
                <X className="w-3 h-3 stroke-[2.5] shrink-0" />
                <span>Cancelar</span>
              </button>
            )}

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
            <div className="flex items-center justify-between gap-1 text-[11px] pt-0.5">
              <a
                href={`tel:${order.cliente.telefone.replace(/\D/g, '')}`}
                className="text-slate-700 font-mono font-semibold flex items-center gap-1 hover:underline"
                title="Ligar para o cliente"
              >
                <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>{order.cliente.telefone}</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  const fone = order.cliente.telefone.replace(/\D/g, '');
                  const foneDdi = fone.startsWith('55') ? fone : `55${fone}`;
                  const msg = `Olá, ${order.cliente.nome}! Somos da loja ${lojaAtual?.nome || ''}. Estamos preparando seu pedido #${order.numeroPedido}.`;
                  window.open(`https://api.whatsapp.com/send?phone=${foneDdi}&text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                title="Conversar com o cliente no WhatsApp"
              >
                <MessageCircle className="w-3 h-3 text-emerald-600" />
                <span>WhatsApp</span>
              </button>
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

        {isCancelado && order.motivoCancelamento && (
          <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold">
            ✕ Motivo: {order.motivoCancelamento}
          </div>
        )}

        {/* ALERTA DE FALTA DE ESTOQUE PARA PEDIDOS PENDENTES */}
        {isNovo && (() => {
          const itensSemSaldo = (order.itens || []).filter((it) => {
            const codAlvo = String(it.codigo || '').trim();
            const nomeAlvo = String(it.nome || '').trim().toLowerCase();
            const lotesCorrespondentes = (estoque || []).filter(
              (e) =>
                (codAlvo && String(e.codigo || '').trim() === codAlvo) ||
                (!codAlvo && nomeAlvo && String(e.nome || '').trim().toLowerCase() === nomeAlvo)
            );
            const temIlimitado = lotesCorrespondentes.some((e) => e.estoqueIlimitado || e.tipoCadastro === 'interno');
            if (temIlimitado) return false;
            const saldoTotal = lotesCorrespondentes.reduce((acc, e) => acc + Math.max(0, Number(e.quantidade) || 0), 0);
            return saldoTotal < (Number(it.quantidade) || 1);
          });

          if (itensSemSaldo.length === 0) return null;

          return (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-[11px] font-bold space-y-0.5">
              <div className="flex items-center gap-1 text-red-700 font-black">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Estoque insuficiente para aceitar:</span>
              </div>
              {itensSemSaldo.map((it, idx) => (
                <div key={idx} className="text-[10px] text-red-700 pl-4">
                  • {it.nome} (Pedido: {it.quantidade} un)
                </div>
              ))}
            </div>
          );
        })()}

        {/* LISTA DE ITENS DO PEDIDO COM REMOÇÃO INDIVIDUAL */}
        <div className="space-y-1 text-xs">
          {order.itens.map((it, idx) => (
            <div key={idx} className="flex justify-between items-center gap-2 group">
              <span className="text-slate-800 font-medium truncate flex-1 min-w-0">
                <strong className="text-slate-900 mr-1">{it.quantidade}x</strong>
                <span>{it.nome}</span>
                {it.gelado && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-100 text-cyan-800 border border-cyan-200 ml-1">
                    Gelada ❄️
                  </span>
                )}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(it.subtotal)}
                </span>
                {isNovo && onRemoverItemPedido && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Deseja retirar o produto "${it.nome}" do Pedido #${order.numeroPedido}?\n\nO valor total do pedido será recalculado automaticamente.`)) {
                        onRemoverItemPedido(order.id, idx);
                      }
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title={`Retirar ${it.nome} do pedido`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
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
                onClick={() => {
                  pararAlertaNovoPedidoDelivery();
                  onAtualizarStatusPedido(order.id, 'em_separacao');
                }}
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
      className="fixed inset-0 flex flex-col bg-white p-0 overflow-hidden"
      style={{ zIndex: 9999999 }}
    >
      <div className="bg-white border-0 rounded-none w-screen h-screen flex flex-col overflow-hidden text-slate-800">
        
        {/* CABEÇALHO DO PAINEL DE DELIVERY EM MODO CLARO */}
        <div className="p-3 sm:p-5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
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
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl font-bold text-xs shadow-2xs transition cursor-pointer border ${
                copiedLink
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-slate-50 text-purple-700 border-purple-200'
              }`}
              title="Copiar link para enviar aos clientes no WhatsApp"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Link Copiado!' : 'Copiar Link Cardápio'}</span>
            </button>

            {/* Botão Abrir Cardápio */}
            <button
              onClick={onAbrirCardapioCliente}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-2xs transition cursor-pointer"
              title="Abrir o Cardápio do Cliente para testar ou criar pedidos"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Ver Cardápio</span>
            </button>

            {/* Botões de Alerta / Silenciar Toque */}
            {alertaSinoTocando ? (
              <button
                type="button"
                onClick={() => pararAlertaNovoPedidoDelivery()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md animate-bounce transition cursor-pointer"
                title="Silenciar toque do sino imediatamente"
              >
                <span>🔕</span>
                <span className="inline">Silenciar</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => tocarAlertaNovoPedidoDelivery(formConfig.repeticoesAlerta ?? 3)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs transition border border-amber-300 shadow-2xs cursor-pointer"
                title="Testar som do Sino de Novo Pedido (Bell 1)"
              >
                <span>🔔</span>
                <span className="inline text-[11px] sm:text-xs">Ouvir Sino</span>
              </button>
            )}

            <button
              onClick={() => tocarSomEntregaFinalizadaMotoboy()}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs transition border border-sky-300 shadow-2xs cursor-pointer"
              title="Testar som de Entrega Concluída pelo Motoboy"
            >
              <span>🛵</span>
              <span className="hidden sm:inline text-[11px] sm:text-xs">Toque Motoboy</span>
            </button>

            {/* Simulação de Pedido Teste */}
            {onSimularNovoPedidoTeste && (
              <button
                onClick={onSimularNovoPedidoTeste}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition border border-slate-200 shadow-2xs cursor-pointer"
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

            {/* CANCELADOS */}
            {countCancelados > 0 && (
              <button
                type="button"
                onClick={() => setPedidosFilterStatus('cancelado')}
                className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 font-bold cursor-pointer shadow-2xs ${
                  pedidosFilterStatus === 'cancelado'
                    ? 'bg-rose-700 text-white border border-rose-700'
                    : 'bg-white text-rose-600 border border-slate-200 hover:bg-rose-50/50'
                }`}
              >
                CANCELADOS ({countCancelados})
              </button>
            )}
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
          <div className="bg-[#f0fdf4] border border-[#a7f3d0] rounded-3xl p-4 sm:p-5 flex flex-col space-y-4 min-w-0 min-h-full shadow-2xs">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredOrders.map((order) => renderCard(order))}
              </div>
            )}
          </div>
        </div>

        {/* MODAL DE CANCELAMENTO / RECUSA DE PEDIDO */}
        {pedidoParaCancelar && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            style={{ zIndex: 10000001 }}
          >
            <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-900">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center border border-red-200">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Cancelar Pedido #{pedidoParaCancelar.numeroPedido}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cliente: {pedidoParaCancelar.cliente.nome} ({formatCurrency(pedidoParaCancelar.valorTotal)})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPedidoParaCancelar(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {pedidoParaCancelar.status !== 'pendente' && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                  ⚠️ Como este pedido já havia sido aceito, os produtos retornarão automaticamente ao estoque e a venda será estornada do caixa.
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Selecione ou digite o motivo do cancelamento:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Fora da área de entrega',
                    'Produto em falta no estoque',
                    'Sem motoboy disponível no momento',
                    'Loja encerrando expediente',
                    'Endereço não localizado',
                    'Cancelado a pedido do cliente',
                  ].map((sugestao) => (
                    <button
                      key={sugestao}
                      type="button"
                      onClick={() => setMotivoCancelamento(sugestao)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                        motivoCancelamento === sugestao
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-red-50 hover:border-red-200'
                      }`}
                    >
                      {sugestao}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={motivoCancelamento}
                  onChange={(e) => setMotivoCancelamento(e.target.value)}
                  placeholder="Ou digite outro motivo (opcional)..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPedidoParaCancelar(null)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmarCancelamento(false)}
                  className="flex-1 py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                  <span>Confirmar Cancelamento</span>
                </button>
                {pedidoParaCancelar.cliente?.telefone && (
                  <button
                    type="button"
                    onClick={() => handleConfirmarCancelamento(true)}
                    className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    title="Cancela o pedido e abre o WhatsApp com mensagem pronta para avisar o cliente"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Cancelar + WhatsApp</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE IMPRESSÃO DE COMANDA TÉRMICA */}
        {comandaImpressao && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            style={{ zIndex: 10000000 }}
          >
            <div
              id="comanda-impressao-termica"
              className="bg-white text-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl font-mono text-xs space-y-3 border border-slate-200"
            >
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

              <div className="flex gap-2 pt-3 border-t border-slate-200 no-print">
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
                    imprimirCupomTermico(
                      'comanda-impressao-termica',
                      '80mm',
                      `Comanda_Pedido_${comandaImpressao.numeroPedido}`
                    );
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

        {/* MODAL DE CONFIGURAÇÕES DE DELIVERY EM TELA CHEIA (MODO CLARO) */}
        {modalConfigAberta && (
          <div
            className="fixed inset-0 w-screen h-screen bg-slate-100 flex flex-col overflow-hidden text-slate-800"
            style={{ zIndex: 10000000 }}
          >
            {/* Header Fixo em Tela Toda */}
            <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    Configurações de Delivery da Loja
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Gerencie horários, taxas, alertas sonoros, impressão térmica e links de acesso em tela cheia
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalConfigAberta(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Voltar aos Pedidos</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSalvarConfig(formConfig);
                    setModalConfigAberta(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-sm transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Configurações</span>
                </button>
              </div>
            </div>

            {/* Corpo Rolável em Tela Cheia (Grid de 2 Colunas no Desktop) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-start text-xs">
                {/* COLUNA 1: Status, Som, Automações e Horário */}
                <div className="space-y-5">
                  {/* Ligar / Desligar Loja */}
                  {(() => {
                    const statusForm = verificarStatusFuncionamentoDelivery(formConfig);
                    const estaAberta = statusForm.aberta;
                    return (
                      <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs gap-4">
                        <div className="min-w-0 flex-1">
                          <span className="font-black text-sm sm:text-base text-slate-900 block">
                            Status da Loja no Delivery:
                          </span>
                          <span className="text-slate-500 text-xs block leading-relaxed mt-1">
                            {estaAberta
                              ? 'Permite que clientes façam pedidos online (Loja Aberta)'
                              : !formConfig.ativo
                              ? 'Pausada manualmente pelo botão (Loja Fechada)'
                              : `Fechada automaticamente (fora do horário das ${statusForm.horarioFormatado})`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormConfig((prev) => {
                              if (!estaAberta) {
                                const agora = new Date();
                                const hhmm = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
                                const foraDoHorario = prev.ativo !== false && prev.horarioFechamento && prev.horarioFechamento <= hhmm;
                                return {
                                  ...prev,
                                  ativo: true,
                                  ...(foraDoHorario ? { horarioFechamento: '23:59' } : {}),
                                };
                              } else {
                                return { ...prev, ativo: false };
                              }
                            });
                          }}
                          className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition cursor-pointer shrink-0 flex items-center gap-2 shadow-xs ${
                            estaAberta
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-rose-600 hover:bg-rose-700 text-white'
                          }`}
                          title={estaAberta ? 'Clique para fechar a loja manualmente' : 'Clique para abrir a loja agora'}
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              estaAberta ? 'bg-white animate-pulse' : 'bg-white'
                            }`}
                          />
                          <span>{estaAberta ? 'ABERTA' : 'FECHADA'}</span>
                        </button>
                      </div>
                    );
                  })()}

                  {/* Toque Sonoro do Novo Pedido & Repetições */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="font-black text-sm text-amber-950 flex items-center gap-2">
                          <span className="text-lg">🔔</span>
                          <span>Toque de Sino de Novo Pedido:</span>
                        </span>
                        <span className="text-amber-800 text-xs block mt-0.5">
                          Sino de mão clássico exclusivo (Bell 1)
                        </span>
                      </div>
                      {alertaSinoTocando ? (
                        <button
                          type="button"
                          onClick={() => pararAlertaNovoPedidoDelivery()}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0 animate-pulse"
                        >
                          <span>🔕</span>
                          <span>Parar Toque</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => tocarAlertaNovoPedidoDelivery(formConfig.repeticoesAlerta ?? 3)}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
                        >
                          <span>🔔</span>
                          <span>Testar Toque</span>
                        </button>
                      )}
                    </div>

                    {/* Quantidade de Repetições do Toque */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-amber-200/80 gap-3">
                      <label className="text-slate-800 font-bold text-xs sm:text-sm">
                        Repetir toque quantas vezes:
                      </label>
                      <select
                        value={formConfig.repeticoesAlerta ?? 3}
                        onChange={(e) =>
                          setFormConfig((prev) => ({
                            ...prev,
                            repeticoesAlerta: Number(e.target.value),
                          }))
                        }
                        className="bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-bold text-xs sm:text-sm focus:outline-none focus:border-amber-500 shadow-2xs cursor-pointer"
                      >
                        <option value={1}>1 vez (15s)</option>
                        <option value={2}>2 vezes (~30s)</option>
                        <option value={3}>3 vezes (Recomendado)</option>
                        <option value={5}>5 vezes</option>
                        <option value={10}>10 vezes</option>
                        <option value={99}>Contínuo (até aceitar o pedido)</option>
                      </select>
                    </div>
                    <p className="text-xs text-amber-900/80 leading-relaxed">
                      💡 Assim que você clicar em "Confirmar/Aceitar" no pedido, o sino para de tocar imediatamente.
                    </p>
                  </div>

                  {/* Automações ao Receber Novo Pedido: Aceite Automático & Impressão Automática */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/90 border border-sky-200 shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-sky-200/70">
                      <span className="font-black text-xs sm:text-sm text-sky-950 flex items-center gap-2 uppercase tracking-wide">
                        <span>⚡</span>
                        <span>Automações de Novos Pedidos</span>
                      </span>
                      <span className="text-[11px] bg-sky-100 text-sky-800 font-bold px-2.5 py-0.5 rounded-full">
                        Escolha as Opções
                      </span>
                    </div>

                    {/* Caixilha 1: Aceitar Pedido Automaticamente */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-sky-200/80 gap-3 shadow-2xs">
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>1. Aceitar Pedidos Automaticamente:</span>
                        </span>
                        <span className="text-slate-500 text-xs block mt-1 leading-relaxed">
                          Move o pedido direto para "Em Separação" e já baixa os produtos do estoque
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFormConfig((prev) => ({
                            ...prev,
                            aceitarAutomatico: !prev.aceitarAutomatico,
                          }))
                        }
                        className={`px-4 py-2 rounded-xl font-black text-xs transition cursor-pointer shadow-2xs shrink-0 flex items-center gap-1.5 ${
                          formConfig.aceitarAutomatico
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                        }`}
                      >
                        <span>{formConfig.aceitarAutomatico ? '✓ LIGADA' : 'DESLIGADA'}</span>
                      </button>
                    </div>

                    {/* Caixilha 2: Impressão Automática de Cupom / Comanda */}
                    <div className="p-3.5 rounded-xl bg-white border border-sky-200/80 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                            <Printer className="w-4 h-4 text-sky-600" />
                            <span>2. Impressão Automática de Cupom:</span>
                          </span>
                          <span className="text-slate-500 text-xs block mt-1 leading-relaxed">
                            Abre a comanda térmica para impressão na hora que o cliente pedir
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setFormConfig((prev) => ({
                              ...prev,
                              imprimirAutomatico: !prev.imprimirAutomatico,
                            }))
                          }
                          className={`px-4 py-2 rounded-xl font-black text-xs transition cursor-pointer shadow-2xs shrink-0 flex items-center gap-1.5 ${
                            formConfig.imprimirAutomatico
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                          }`}
                        >
                          <span>{formConfig.imprimirAutomatico ? '✓ LIGADA' : 'DESLIGADA'}</span>
                        </button>
                      </div>

                      {formConfig.imprimirAutomatico && (
                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                          <span className="text-slate-800 font-bold">Largura da Bobina Térmica:</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setFormConfig((prev) => ({ ...prev, larguraImpressao: '80mm' }))}
                              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                                (formConfig.larguraImpressao || '80mm') === '80mm'
                                  ? 'bg-sky-900 text-white shadow-2xs'
                                  : 'bg-white border border-slate-300 text-slate-700'
                              }`}
                            >
                              80mm (Padrão)
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormConfig((prev) => ({ ...prev, larguraImpressao: '58mm' }))}
                              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                                formConfig.larguraImpressao === '58mm'
                                  ? 'bg-sky-900 text-white shadow-2xs'
                                  : 'bg-white border border-slate-300 text-slate-700'
                              }`}
                            >
                              58mm (Estreita)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Horário de Início e Término do Delivery (Bloqueio Automático) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/80 border border-purple-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs sm:text-sm text-purple-950 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span>Horário de Funcionamento do Delivery:</span>
                      </span>
                      <span className="text-[11px] bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full font-bold">
                        Bloqueio Automático
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="text-slate-700 block mb-1.5 font-bold text-xs">
                          Horário de Início (Abertura):
                        </label>
                        <input
                          type="time"
                          value={formConfig.horarioAbertura || '08:00'}
                          onChange={(e) => setFormConfig((prev) => ({ ...prev, horarioAbertura: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-purple-500 shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 block mb-1.5 font-bold text-xs">
                          Horário de Término (Fechamento):
                        </label>
                        <input
                          type="time"
                          value={formConfig.horarioFechamento || '23:00'}
                          onChange={(e) => setFormConfig((prev) => ({ ...prev, horarioFechamento: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-purple-500 shadow-2xs"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-purple-800/80 leading-relaxed">
                      💡 Fora deste horário, o cliente não conseguirá enviar pedidos pelo cardápio online e verá o aviso de loja fechada.
                    </p>
                  </div>
                </div>

                {/* COLUNA 2: Taxas, Tempos, PIX, WhatsApp e Links da Loja */}
                <div className="space-y-5">
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                    <div className="border-b border-slate-100 pb-2.5">
                      <h4 className="font-black text-sm text-slate-900">
                        Taxas de Entrega, Tempos & Pagamento
                      </h4>
                      <p className="text-xs text-slate-500">
                        Defina valores de entrega, tempo médio estimado e dados de contato da loja
                      </p>
                    </div>

                    {/* Taxa de Entrega e Raio */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-700 block mb-1.5 font-bold text-xs">Taxa de Entrega Fixa (R$):</label>
                        <input
                          type="number"
                          step="0.50"
                          value={formConfig.taxaEntregaFixa}
                          onChange={(e) => setFormConfig((prev) => ({ ...prev, taxaEntregaFixa: Number(e.target.value) }))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 block mb-1.5 font-bold text-xs">Raio Máximo Atendido (km):</label>
                        <input
                          type="number"
                          value={formConfig.raioMaximoKm}
                          onChange={(e) => setFormConfig((prev) => ({ ...prev, raioMaximoKm: Number(e.target.value) }))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Tempos Estimados e Pedido Mínimo */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-700 block mb-1.5 font-bold text-xs">Tempo Mín (min):</label>
                        <input
                          type="number"
                          value={formConfig.tempoMinimoMinutos}
                          onChange={(e) => setFormConfig((prev) => ({ ...prev, tempoMinimoMinutos: Number(e.target.value) }))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 block mb-1.5 font-bold text-xs">Tempo Máx (min):</label>
                        <input
                          type="number"
                          value={formConfig.tempoMaximoMinutos}
                          onChange={(e) => setFormConfig((prev) => ({ ...prev, tempoMaximoMinutos: Number(e.target.value) }))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 block mb-1.5 font-bold text-xs">Ped. Mínimo (R$):</label>
                        <input
                          type="number"
                          value={formConfig.valorMinimoPedido}
                          onChange={(e) => setFormConfig((prev) => ({ ...prev, valorMinimoPedido: Number(e.target.value) }))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Chave PIX da Loja */}
                    <div>
                      <label className="text-slate-700 block mb-1.5 font-bold text-xs">Chave PIX da Loja (para pagamentos online):</label>
                      <input
                        type="text"
                        value={formConfig.chavePix || ''}
                        onChange={(e) => setFormConfig((prev) => ({ ...prev, chavePix: e.target.value }))}
                        placeholder="CNPJ, E-mail, Celular ou Chave Aleatória"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Telefone / WhatsApp da Loja */}
                    <div>
                      <label className="text-slate-700 block mb-1.5 font-bold text-xs">WhatsApp da Loja para Suporte:</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formConfig.telefoneContatoLoja || ''}
                        onChange={(e) => setFormConfig((prev) => ({ ...prev, telefoneContatoLoja: mascaraTelefone(e.target.value) }))}
                        placeholder="(00) 90000-0000"
                        maxLength={15}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* LINKS EXCLUSIVOS DA LOJA E CARDÁPIO DIGITAL */}
                  {lojaAtual && (() => {
                    const linksLoja = obterLinksExclusivosLoja(lojaAtual);
                    const itensLinks = [
                      {
                        id: 'cardapio',
                        label: '🛵 Cardápio Digital (Clientes - Público)',
                        url: linksLoja.cardapio,
                        cor: 'bg-emerald-50 border-emerald-200 text-emerald-900',
                        btnCor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
                      },
                      {
                        id: 'admin',
                        label: '🔑 Link Oficial da Loja (Admin & Funcionários)',
                        url: linksLoja.admin,
                        cor: 'bg-slate-50 border-slate-200 text-slate-800',
                        btnCor: 'bg-slate-800 hover:bg-slate-900 text-white',
                      },
                    ];

                    return (
                      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-slate-900 text-sm flex items-center gap-2">
                            <KeyRound className="w-4 h-4 text-purple-600" />
                            <span>Links da Loja & Cardápio</span>
                          </span>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                            Token Protegido
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          O Admin e todos os funcionários cadastrados entram pelo mesmo Link Oficial da Loja:
                        </p>
                        <div className="space-y-3">
                          {itensLinks.map((item) => (
                            <div
                              key={item.id}
                              className={`p-3.5 rounded-xl border ${item.cor} flex flex-col gap-2`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-xs">{item.label}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.url);
                                    setCopiouTokenEquipe(item.id);
                                    setTimeout(() => setCopiouTokenEquipe(null), 2200);
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${item.btnCor}`}
                                >
                                  {copiouTokenEquipe === item.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Copiado!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Copiar Link</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <input
                                type="text"
                                readOnly
                                value={item.url}
                                className="w-full bg-white/95 border border-slate-200/80 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-700 select-all focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Rodapé Fixo em Tela Toda */}
            <div className="bg-white border-t border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setModalConfigAberta(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl cursor-pointer transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onSalvarConfig(formConfig);
                  setModalConfigAberta(false);
                }}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-sm cursor-pointer transition flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
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
                    <span>Expira 5 minutos após confirmada a entrega (proteção LGPD)</span>
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
