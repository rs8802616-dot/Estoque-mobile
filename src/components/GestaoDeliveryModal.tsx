import React, { useState, useEffect, useMemo } from 'react';
import { salvarPedidoDeliveryFirestore } from '../lib/firestoreSync';
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
import { useVoltarHierarquico } from '../hooks/useVoltarHierarquico';
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
  ExternalLink,
  Printer,
  KeyRound,
  Share2,
  Copy,
  Flame,
  Check,
  Search,
  ShoppingBag,
  UtensilsCrossed,
  FileCheck,
  Bell,
  BellOff,
  Volume2,
  User,
  CreditCard,
  LayoutGrid,
  List,
  Calendar,
  Trash2,
  Ban,
  MessageSquareText,
} from 'lucide-react';

interface GestaoDeliveryModalProps {
  visivel: boolean;
  onFechar: () => void;
  pedidos: PedidoDelivery[];
  configDelivery: ConfiguracaoDelivery;
  onSalvarConfig: (novaConfig: ConfiguracaoDelivery) => void;
  onAtualizarStatusPedido: (pedidoId: string, novoStatus: StatusPedidoDelivery, motivo?: string) => void;
  onRemoverItemPedido?: (pedidoId: string, indiceItem: number, motivo?: string) => void;
  onConfirmarEntregaPin: (
    pedidoId: string,
    pinDigitado: string
  ) => boolean | { ok: boolean; erro?: string } | Promise<boolean | { ok: boolean; erro?: string }>;
  onAbrirCardapioCliente: () => void;
  estoque: ItemEstoque[];
  lojaAtual: Supermercado | null;
}

function formatarFormaPagamento(forma?: string): string {
  switch (forma) {
    case 'pix':
      return 'PIX';
    case 'cartao_credito':
      return 'Crédito';
    case 'cartao_debito':
      return 'Débito';
    case 'dinheiro':
      return 'Dinheiro';
    default:
      return (forma || 'Não inf.').toUpperCase();
  }
}

function obterMetaCanal(order: PedidoDelivery) {
  if (order.tipo_pedido === 'retirada') {
    return {
      label: 'RETIRADA',
      Icon: ShoppingBag,
      pillClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
  }
  if (order.tipo_pedido === 'mesa') {
    return {
      label: `MESA ${order.mesaNumero || ''}`.trim(),
      Icon: UtensilsCrossed,
      pillClass: 'bg-amber-50 text-amber-800 border-amber-200',
    };
  }
  return {
    label: 'DELIVERY',
    Icon: Bike,
    pillClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
}

function obterMetaStatus(status: StatusPedidoDelivery) {
  switch (status) {
    case 'pendente':
      return {
        label: 'Novo',
        barClass: 'bg-red-500',
        badgeClass: 'bg-red-50 text-red-700 border-red-200',
        Icon: Bell,
        pulse: true,
      };
    case 'em_separacao':
      return {
        label: 'Em Preparo',
        barClass: 'bg-amber-400',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        Icon: Flame,
        pulse: false,
      };
    case 'pronto':
      return {
        label: 'Pronto',
        barClass: 'bg-teal-500',
        badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
        Icon: Check,
        pulse: false,
      };
    case 'saiu_para_entrega':
      return {
        label: 'A Caminho',
        barClass: 'bg-sky-500',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
        Icon: Bike,
        pulse: false,
      };
    case 'entregue':
      return {
        label: 'Entregue',
        barClass: 'bg-emerald-500',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        Icon: CheckCircle2,
        pulse: false,
      };
    case 'cancelado':
    default:
      return {
        label: 'Cancelado',
        barClass: 'bg-slate-400',
        badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
        Icon: Ban,
        pulse: false,
      };
  }
}

function formatarEnderecoResumo(order: PedidoDelivery): string {
  const end = order.enderecoEntrega;
  if (order.tipo_pedido === 'mesa' && !end?.logradouro) {
    return `Consumo local • Mesa ${order.mesaNumero || '-'}`;
  }
  if (order.tipo_pedido === 'retirada' && !end?.logradouro) {
    return 'Retirada no balcão da loja';
  }
  if (!end?.logradouro) return '';
  const numero = end.numero ? `, ${end.numero}` : '';
  const bairro = end.bairro ? ` — ${end.bairro}` : '';
  const ref = end.referencia ? ` (Ref: ${end.referencia})` : '';
  return `${end.logradouro}${numero}${bairro}${ref}`;
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
}) => {
  // Filtros e visualização
  const [pedidosFilterStatus, setPedidosFilterStatus] = useState<string>('todos');
  const [pedidosSearch, setPedidosSearch] = useState<string>('');
  const [apenasHoje, setApenasHoje] = useState<boolean>(false);
  const [modoVisualizacao, setModoVisualizacao] = useState<'cards' | 'lista'>(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('delivery_modo_visualizacao') === 'lista') {
        return 'lista';
      }
    } catch {}
    return 'cards';
  });

  const alternarModoVisualizacao = (modo: 'cards' | 'lista') => {
    setModoVisualizacao(modo);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('delivery_modo_visualizacao', modo);
      }
    } catch {}
  };

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

  // Modal do Link do Motoboy com token exclusivo
  const [pedidoLinkMotoboy, setPedidoLinkMotoboy] = useState<PedidoDelivery | null>(null);
  const [copiouLinkMotoboy, setCopiouLinkMotoboy] = useState(false);

  // Modal de Cancelamento de Pedido pelo Lojista
  const [pedidoParaCancelar, setPedidoParaCancelar] = useState<PedidoDelivery | null>(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');

  // Modal de Ação ao Clicar no Número do Cliente (Ligar ou WhatsApp)
  const [clienteContatoModal, setClienteContatoModal] = useState<{
    nome: string;
    telefone: string;
    numeroPedido: number;
  } | null>(null);

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

  const handleVoltarOuFechar = () => {
    if (clienteContatoModal) {
      setClienteContatoModal(null);
      return;
    }
    if (pedidoParaCancelar) {
      setPedidoParaCancelar(null);
      return;
    }
    if (pedidoLinkMotoboy) {
      setPedidoLinkMotoboy(null);
      return;
    }
    if (pedidoParaValidarPin) {
      setPedidoParaValidarPin(null);
      return;
    }
    if (comandaImpressao) {
      setComandaImpressao(null);
      return;
    }
    if (modalConfigAberta) {
      setModalConfigAberta(false);
      return;
    }
    onFechar();
  };

  useVoltarHierarquico(visivel, handleVoltarOuFechar);

  if (!visivel) return null;

  const statusLoja = verificarStatusFuncionamentoDelivery(configDelivery);
  const countHoje = pedidos.filter((p) => p.data === hojeFormatado).length;
  const pedidosEscopo = apenasHoje ? pedidos.filter((p) => p.data === hojeFormatado) : pedidos;

  // Contadores do escopo atual
  const countNovos = pedidosEscopo.filter((p) => p.status === 'pendente').length;
  const countPreparo = pedidosEscopo.filter((p) => p.status === 'em_separacao').length;
  const countProntos = pedidosEscopo.filter((p) => p.status === 'pronto').length;
  const countACaminho = pedidosEscopo.filter((p) => p.status === 'saiu_para_entrega').length;
  const pedidosEntregues = pedidosEscopo.filter((p) => p.status === 'entregue');
  const countEntregues = pedidosEntregues.length;
  const countCancelados = pedidosEscopo.filter((p) => p.status === 'cancelado').length;
  const countTotal = pedidosEscopo.length;
  const faturamentoEntregues = pedidosEntregues.reduce(
    (acc, p) => acc + (Number(p.valorTotal) || 0),
    0
  );

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

  // Filtragem dos pedidos
  const filteredOrders = pedidosEscopo
    .filter((p) => {
      if (pedidosFilterStatus === 'novo' && p.status !== 'pendente') return false;
      if (pedidosFilterStatus === 'em_preparo' && p.status !== 'em_separacao') return false;
      if (pedidosFilterStatus === 'pronto' && p.status !== 'pronto') return false;
      if (pedidosFilterStatus === 'a_caminho' && p.status !== 'saiu_para_entrega') return false;
      if (pedidosFilterStatus === 'entregue' && p.status !== 'entregue') return false;
      if (pedidosFilterStatus === 'cancelado' && p.status !== 'cancelado') return false;

      if (pedidosSearch.trim()) {
        const b = pedidosSearch.toLowerCase().trim();
        const digitsBusca = b.replace(/\D/g, '');
        const nomeMatch = p.cliente?.nome?.toLowerCase().includes(b);
        const foneMatch =
          digitsBusca.length > 0 &&
          p.cliente?.telefone?.replace(/\D/g, '').includes(digitsBusca);
        const ruaMatch = p.enderecoEntrega?.logradouro?.toLowerCase().includes(b);
        const bairroMatch = p.enderecoEntrega?.bairro?.toLowerCase().includes(b);
        const mesaMatch = p.mesaNumero?.toLowerCase().includes(b);
        const numMatch = p.numeroPedido?.toString().includes(b);
        if (!nomeMatch && !foneMatch && !ruaMatch && !bairroMatch && !mesaMatch && !numMatch) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  const temFiltroAtivo =
    pedidosFilterStatus !== 'todos' || pedidosSearch.trim().length > 0 || apenasHoje;

  const limparFiltros = () => {
    setPedidosFilterStatus('todos');
    setPedidosSearch('');
    setApenasHoje(false);
  };

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
    const token =
      'mto_' +
      Math.random().toString(36).substring(2, 10) +
      Math.random().toString(36).substring(2, 6);
    pedido.motoboyToken = token;
    salvarPedidoDeliveryFirestore(pedido).catch(() => {});
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`motoboy_pedido_${pedido.numeroPedido}`, JSON.stringify(pedido));
      } catch {}
    }
    return token;
  };

  const gerarUrlMotoboy = (pedido: PedidoDelivery): string => {
    const token = obterOuGerarTokenMotoboy(pedido);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`motoboy_pedido_${pedido.numeroPedido}`, JSON.stringify(pedido));
      } catch {}
    }
    return `${window.location.origin}/?motoboy=1&pedido=${pedido.numeroPedido}&token=${token}`;
  };

  const handleCopiarLinkMotoboy = (pedido: PedidoDelivery) => {
    const url = gerarUrlMotoboy(pedido);
    navigator.clipboard.writeText(url);
    setCopiouLinkMotoboy(true);
    setTimeout(() => setCopiouLinkMotoboy(false), 2500);
  };

  const handleEnviarWhatsAppMotoboyModal = (pedido: PedidoDelivery) => {
    const link = gerarUrlMotoboy(pedido);
    const end = pedido.enderecoEntrega;
    const enderecoCompleto = `${end?.logradouro || ''}, ${end?.numero || 'S/N'}${end?.complemento ? ' - ' + end.complemento : ''}${end?.bairro ? `, ${end.bairro}` : ''}`;
    const texto =
      `🛵 *ENTREGA DE PEDIDO #${pedido.numeroPedido}*\n\n` +
      `👤 *Cliente:* ${pedido.cliente?.nome || 'Cliente'}\n` +
      `📱 *WhatsApp:* ${pedido.cliente?.telefone || '-'}\n` +
      `📍 *Endereço:* ${enderecoCompleto}\n` +
      (end?.referencia ? `🏷️ *Ref:* ${end.referencia}\n` : '') +
      `💰 *Total a Cobrar:* ${formatCurrency(pedido.valorTotal)}\n` +
      `💳 *Forma de Pgto:* ${(pedido.formaPagamento || '').toUpperCase()}\n` +
      (pedido.trocoPara ? `💵 *Troco para:* ${formatCurrency(pedido.trocoPara)}\n` : '') +
      `\n📲 *ABRA O LINK DE ENTREGA COM GPS E DADOS COMPLETOS:*\n${link}`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  const handleVisualizarTelaMotoboy = (pedido: PedidoDelivery) => {
    const link = gerarUrlMotoboy(pedido);
    window.open(link, '_blank');
  };

  const handleDispararNfce = (pedido: PedidoDelivery) => {
    setToastNfce(`NFC-e do Pedido #${pedido.numeroPedido} pronta para emissão fiscal!`);
    setTimeout(() => setToastNfce(null), 3000);
  };

  const calcularItensSemSaldo = (order: PedidoDelivery) => {
    return (order.itens || []).filter((it) => {
      const codAlvo = String(it.codigo || '').trim();
      const nomeAlvo = String(it.nome || '').trim().toLowerCase();
      const lotesCorrespondentes = (estoque || []).filter(
        (e) =>
          (codAlvo && String(e.codigo || '').trim() === codAlvo) ||
          (!codAlvo && nomeAlvo && String(e.nome || '').trim().toLowerCase() === nomeAlvo)
      );
      const temIlimitado = lotesCorrespondentes.some(
        (e) => e.estoqueIlimitado || e.tipoCadastro === 'interno'
      );
      if (temIlimitado) return false;
      const saldoTotal = lotesCorrespondentes.reduce(
        (acc, e) => acc + Math.max(0, Number(e.quantidade) || 0),
        0
      );
      return saldoTotal < (Number(it.quantidade) || 1);
    });
  };

  const abrirConfirmarEntrega = (order: PedidoDelivery) => {
    setPedidoParaValidarPin(order);
    setPinDigitado('');
    setErroPin('');
  };

  const abrirCancelarPedido = (order: PedidoDelivery) => {
    setPedidoParaCancelar(order);
    setMotivoCancelamento('');
  };

  const abrirContatoCliente = (order: PedidoDelivery) => {
    setClienteContatoModal({
      nome: order.cliente?.nome || 'Cliente',
      telefone: order.cliente?.telefone || '',
      numeroPedido: order.numeroPedido,
    });
  };

  const formatarDataCurta = (data?: string) => {
    const partes = (data || '').split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}` : data || '';
  };

  // Renderizador de Card Individual compacto e limpo
  const renderCard = (order: PedidoDelivery) => {
    const isNovo = order.status === 'pendente';
    const isPreparo = order.status === 'em_separacao';
    const isPronto = order.status === 'pronto';
    const isACaminho = order.status === 'saiu_para_entrega';
    const isEntregue = order.status === 'entregue';
    const isCancelado = order.status === 'cancelado';

    const isAnterior = Boolean(order.data && order.data < hojeFormatado);

    const canal = obterMetaCanal(order);
    const statusMeta = obterMetaStatus(order.status);
    const CanalIcon = canal.Icon;
    const StatusIcon = statusMeta.Icon;
    const enderecoTexto = formatarEnderecoResumo(order);
    const itensSemSaldo = isNovo ? calcularItensSemSaldo(order) : [];
    const mostrarLinkMotoboy = !isNovo && !isEntregue && !isCancelado;
    const temAcaoPrincipal = isNovo || isPreparo || isPronto || isACaminho;

    return (
      <div
        key={order.id}
        className={`bg-white rounded-xl border shadow-xs hover:shadow-md transition flex flex-col overflow-hidden ${
          isNovo ? 'border-red-300 ring-2 ring-red-500/15' : 'border-slate-200'
        }`}
      >
        {/* Faixa superior de status */}
        <div className={`h-1 w-full shrink-0 ${statusMeta.barClass}`} />

        {/* Corpo compacto */}
        <div className="p-2.5 flex-1 flex flex-col gap-2">
          {/* Topo: Canal + #Pedido | Badge Status */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide shrink-0 ${canal.pillClass}`}
              >
                <CanalIcon className="w-2.5 h-2.5 shrink-0" />
                <span>{canal.label}</span>
              </span>
              <span className="font-mono font-black text-slate-900 text-[11px] shrink-0">
                #{order.numeroPedido}
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide shrink-0 ${statusMeta.badgeClass}`}
            >
              {statusMeta.pulse ? (
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              ) : (
                <StatusIcon className="w-2.5 h-2.5 shrink-0" />
              )}
              <span>{statusMeta.label}</span>
            </span>
          </div>

          {/* Cliente + Fone inline | Endereço 1 linha | Meta compacta */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1 min-w-0 flex-1">
                <User className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="font-extrabold text-xs text-slate-900 truncate">
                  {order.cliente?.nome || 'Cliente'}
                </span>
              </div>

              {order.cliente?.telefone && (
                <button
                  type="button"
                  onClick={() => abrirContatoCliente(order)}
                  className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-sky-700 hover:underline transition cursor-pointer shrink-0"
                  title="Ligar ou enviar WhatsApp para o cliente"
                >
                  <Phone className="w-2.5 h-2.5 shrink-0" />
                  <span>{order.cliente.telefone}</span>
                </button>
              )}
            </div>

            {enderecoTexto && (
              <div
                className="flex items-center gap-1 text-[11px] text-slate-600 leading-tight"
                title={enderecoTexto}
              >
                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                <span className="truncate">{enderecoTexto}</span>
              </div>
            )}

            <div className="flex items-center flex-wrap gap-1 pt-0.5 text-[10px] text-slate-500">
              <span className="inline-flex items-center gap-0.5 font-mono text-slate-500">
                <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                <span>
                  {formatarDataCurta(order.data)} {order.hora}
                </span>
              </span>

              <span
                className={`text-[9px] font-bold px-1 py-0.2 rounded uppercase ${
                  isAnterior
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isAnterior ? 'Anterior' : 'Hoje'}
              </span>

              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                <CreditCard className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                <span>{formatarFormaPagamento(order.formaPagamento)}</span>
                {order.trocoPara ? (
                  <span className="text-slate-500 font-normal">
                    (p/ {formatCurrency(order.trocoPara)})
                  </span>
                ) : null}
              </span>

              {Number(order.taxaEntrega) > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                  +{formatCurrency(order.taxaEntrega)} ent.
                </span>
              )}
            </div>

            {order.observacao && (
              <div className="flex items-start gap-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[10px]">
                <MessageSquareText className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{order.observacao}</span>
              </div>
            )}
          </div>

          {/* Motivo de cancelamento */}
          {isCancelado && order.motivoCancelamento && (
            <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[10px] font-semibold flex items-start gap-1">
              <Ban className="w-3 h-3 shrink-0 mt-0.5" />
              <span>Motivo: {order.motivoCancelamento}</span>
            </div>
          )}

          {/* Alerta de falta de estoque para pedidos pendentes */}
          {itensSemSaldo.length > 0 && (
            <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-800 text-[10px] font-bold space-y-0.5">
              <div className="flex items-center gap-1 text-red-700 font-black">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span>Estoque insuficiente para aceitar:</span>
              </div>
              {itensSemSaldo.map((it, idx) => (
                <div key={idx} className="text-[10px] text-red-700 pl-3 font-semibold">
                  • {it.nome} ({it.quantidade} un)
                </div>
              ))}
            </div>
          )}

          {/* Caixa de itens compacta (sem mt-auto para não criar vão vazio) */}
          <div className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 max-h-24 overflow-y-auto space-y-0.5 text-[11px]">
            {order.itens.map((it, idx) => (
              <div key={idx} className="flex justify-between items-start gap-1.5 leading-snug">
                <span className="text-slate-700 flex-1 min-w-0 truncate" title={`${it.quantidade}x ${it.nome}`}>
                  <strong className="text-slate-900 mr-1 font-bold">{it.quantidade}x</strong>
                  <span>{it.nome}</span>
                  {it.gelado && (
                    <span className="ml-1 inline-block text-[9px] font-bold px-1 rounded bg-cyan-100 text-cyan-800 border border-cyan-200">
                      Gelada
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {formatCurrency(it.subtotal)}
                  </span>
                  {isNovo && onRemoverItemPedido && (
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          confirm(
                            `Deseja retirar o produto "${it.nome}" do Pedido #${order.numeroPedido}?\n\nO valor total do pedido será recalculado automaticamente.`
                          )
                        ) {
                          onRemoverItemPedido(order.id, idx);
                        }
                      }}
                      className="p-0.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title={`Retirar ${it.nome} do pedido`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé compacto */}
        <div className="px-2.5 py-2 bg-slate-50/70 border-t border-slate-100 mt-auto flex flex-col gap-1.5">
          {/* Linha 1: Valor total direto + Utilitários compactos */}
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-sm font-black text-slate-900 font-mono tabular-nums">
              {formatCurrency(order.valorTotal)}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setComandaImpressao(order)}
                className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition cursor-pointer active:scale-95"
                title="Imprimir comanda térmica"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleDispararNfce(order)}
                className="h-7 px-2 rounded-lg border border-cyan-200 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-[10px] flex items-center gap-1 transition cursor-pointer active:scale-95"
                title="Emitir ou verificar NFC-e"
              >
                <FileCheck className="w-3 h-3 shrink-0" />
                <span>NFC-e</span>
              </button>

              {!isEntregue && !isCancelado && (
                <button
                  type="button"
                  onClick={() => abrirCancelarPedido(order)}
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-600 flex items-center justify-center transition cursor-pointer active:scale-95"
                  title="Cancelar ou recusar este pedido"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Linha 2: Ação Principal do Ciclo */}
          {temAcaoPrincipal && (
            <div className="w-full">
              {isNovo && (
                <button
                  type="button"
                  onClick={() => {
                    pararAlertaNovoPedidoDelivery();
                    onAtualizarStatusPedido(order.id, 'em_separacao');
                  }}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-2xs transition cursor-pointer active:scale-[0.99]"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Confirmar Pedido</span>
                </button>
              )}

              {(isPreparo || isPronto) && (
                <div className="flex gap-1.5">
                  {mostrarLinkMotoboy && (
                    <button
                      type="button"
                      onClick={() => setPedidoLinkMotoboy(order)}
                      className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer shrink-0 active:scale-[0.99]"
                      title="Abrir link do motoboy para envio no WhatsApp"
                    >
                      <Share2 className="w-3 h-3 shrink-0" />
                      <span>Link</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onAtualizarStatusPedido(order.id, 'saiu_para_entrega')}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-2xs transition cursor-pointer active:scale-[0.99]"
                    title="Despachar para o motoboy"
                  >
                    <Bike className="w-3.5 h-3.5 shrink-0" />
                    <span>Despachar</span>
                  </button>
                </div>
              )}

              {isACaminho && (
                <div className="flex gap-1.5">
                  {mostrarLinkMotoboy && (
                    <button
                      type="button"
                      onClick={() => setPedidoLinkMotoboy(order)}
                      className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer shrink-0 active:scale-[0.99]"
                      title="Abrir link do motoboy para envio no WhatsApp"
                    >
                      <Share2 className="w-3 h-3 shrink-0" />
                      <span>Link</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => abrirConfirmarEntrega(order)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-2xs transition cursor-pointer active:scale-[0.99]"
                    title="Validar PIN com o cliente e finalizar"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Confirmar Entrega</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 flex flex-col bg-slate-50 p-0 overflow-hidden"
      style={{ zIndex: 99999 }}
    >
      <div className="w-full h-full flex flex-col overflow-hidden text-slate-800">
        {/* CABEÇALHO UNIFICADO */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center shadow-xs text-white shrink-0">
              <Bike className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                  Gestão de Pedidos &amp; Delivery
                </h2>
                <button
                  type="button"
                  onClick={() => setModalConfigAberta(true)}
                  className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full font-bold border transition cursor-pointer ${
                    statusLoja.aberta
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                  }`}
                  title={
                    (statusLoja.motivo || `Delivery aberto das ${statusLoja.horarioFormatado}`) +
                    ' (clique para configurar)'
                  }
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      statusLoja.aberta ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span>{statusLoja.aberta ? 'Loja Aberta' : 'Loja Fechada'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                Painel integrado de pedidos — Delivery, Retirada e Mesas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopiarLinkCardapio}
              className={`h-9 flex items-center gap-1.5 px-3 rounded-xl font-bold text-xs transition cursor-pointer border ${
                copiedLink
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-slate-50 text-sky-700 border-sky-200'
              }`}
              title="Copiar link do cardápio digital"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
            </button>

            <button
              type="button"
              onClick={onAbrirCardapioCliente}
              className="h-9 flex items-center gap-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
              title="Abrir o Cardápio do Cliente para testar ou criar pedidos"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Ver Cardápio</span>
            </button>

            {alertaSinoTocando ? (
              <button
                type="button"
                onClick={() => pararAlertaNovoPedidoDelivery()}
                className="h-9 flex items-center gap-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm animate-bounce transition cursor-pointer"
                title="Silenciar toque do sino imediatamente"
              >
                <BellOff className="w-4 h-4" />
                <span>Silenciar</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => tocarAlertaNovoPedidoDelivery(formConfig.repeticoesAlerta ?? 3)}
                className="h-9 flex items-center gap-1.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs transition border border-amber-200 cursor-pointer"
                title="Testar som do Sino de Novo Pedido"
              >
                <Bell className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">Ouvir Sino</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => tocarSomEntregaFinalizadaMotoboy()}
              className="h-9 flex items-center gap-1.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs transition border border-sky-200 cursor-pointer"
              title="Testar som de Entrega Concluída pelo Motoboy"
            >
              <Volume2 className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">Toque Motoboy</span>
            </button>

            <button
              type="button"
              onClick={() => setModalConfigAberta(true)}
              className="h-9 flex items-center gap-1.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold text-xs transition border border-slate-200 cursor-pointer"
              title="Configurações de Taxa, Raio e Horários"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden xl:inline">Configurações</span>
            </button>

            <button
              type="button"
              onClick={handleVoltarOuFechar}
              aria-label="Fechar"
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition border border-slate-200 cursor-pointer"
              title="Fechar painel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* BARRA DE FILTROS, VISUALIZAÇÃO E BUSCA */}
        <div className="px-4 sm:px-6 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs shrink-0">
          {/* Pílulas de status */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPedidosFilterStatus('todos')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-bold cursor-pointer ${
                pedidosFilterStatus === 'todos'
                  ? 'bg-slate-900 text-white border border-slate-900'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Todos ({countTotal})
            </button>

            <button
              type="button"
              onClick={() => setPedidosFilterStatus('novo')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-bold cursor-pointer ${
                pedidosFilterStatus === 'novo'
                  ? 'bg-red-600 text-white border border-red-600'
                  : 'bg-white text-red-600 border border-slate-200 hover:bg-red-50/70'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  pedidosFilterStatus === 'novo' ? 'bg-white' : 'bg-red-500 animate-pulse'
                }`}
              />
              Novos ({countNovos})
            </button>

            <button
              type="button"
              onClick={() => setPedidosFilterStatus('em_preparo')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-bold cursor-pointer ${
                pedidosFilterStatus === 'em_preparo'
                  ? 'bg-amber-500 text-white border border-amber-500'
                  : 'bg-white text-amber-700 border border-slate-200 hover:bg-amber-50/70'
              }`}
            >
              <Flame
                className={`w-3.5 h-3.5 ${
                  pedidosFilterStatus === 'em_preparo' ? 'text-white' : 'text-amber-500'
                }`}
              />
              Em Preparo ({countPreparo})
            </button>

            <button
              type="button"
              onClick={() => setPedidosFilterStatus('pronto')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-bold cursor-pointer ${
                pedidosFilterStatus === 'pronto'
                  ? 'bg-teal-600 text-white border border-teal-600'
                  : 'bg-white text-teal-700 border border-slate-200 hover:bg-teal-50/70'
              }`}
            >
              <Check
                className={`w-3.5 h-3.5 stroke-[2.5] ${
                  pedidosFilterStatus === 'pronto' ? 'text-white' : 'text-teal-600'
                }`}
              />
              Prontos ({countProntos})
            </button>

            <button
              type="button"
              onClick={() => setPedidosFilterStatus('a_caminho')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-bold cursor-pointer ${
                pedidosFilterStatus === 'a_caminho'
                  ? 'bg-sky-600 text-white border border-sky-600'
                  : 'bg-white text-sky-700 border border-slate-200 hover:bg-sky-50/70'
              }`}
            >
              <Bike
                className={`w-3.5 h-3.5 ${
                  pedidosFilterStatus === 'a_caminho' ? 'text-white' : 'text-sky-600'
                }`}
              />
              A Caminho ({countACaminho})
            </button>

            <button
              type="button"
              onClick={() => setPedidosFilterStatus('entregue')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-bold cursor-pointer ${
                pedidosFilterStatus === 'entregue'
                  ? 'bg-emerald-600 text-white border border-emerald-600'
                  : 'bg-white text-emerald-700 border border-slate-200 hover:bg-emerald-50/70'
              }`}
            >
              Entregues ({countEntregues})
            </button>

            {countCancelados > 0 && (
              <button
                type="button"
                onClick={() => setPedidosFilterStatus('cancelado')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-bold cursor-pointer ${
                  pedidosFilterStatus === 'cancelado'
                    ? 'bg-slate-700 text-white border border-slate-700'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Cancelados ({countCancelados})
              </button>
            )}
          </div>

          {/* Direita: Só Hoje + Cards/Lista + Busca */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            <button
              type="button"
              onClick={() => setApenasHoje((prev) => !prev)}
              className={`h-8 px-2.5 rounded-lg border font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                apenasHoje
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Alternar entre todos os pedidos ou somente os pedidos de hoje"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Só Hoje ({countHoje})</span>
            </button>

            <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => alternarModoVisualizacao('cards')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                  modoVisualizacao === 'cards'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => alternarModoVisualizacao('lista')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                  modoVisualizacao === 'lista'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Lista</span>
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                type="search"
                name="busca_gestao_delivery_modal"
                autoComplete="off"
                value={pedidosSearch}
                onChange={(e) => setPedidosSearch(e.target.value)}
                placeholder="Buscar #pedido, cliente, fone, bairro..."
                className="w-full h-8 pl-8 pr-8 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
              />
              {pedidosSearch && (
                <button
                  type="button"
                  onClick={() => setPedidosSearch('')}
                  aria-label="Limpar busca"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ÁREA PRINCIPAL DE PEDIDOS */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-slate-50">
          <div className="w-full space-y-3">
            {toastNfce && (
              <div className="p-2.5 bg-cyan-50 border border-cyan-200 text-cyan-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs">
                <FileCheck className="w-4 h-4 text-cyan-700 shrink-0" />
                <span>{toastNfce}</span>
              </div>
            )}

            {/* FAIXA DE 4 KPIS COMPACTOS E CLICÁVEIS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* KPI 1: Novos p/ Confirmar */}
              <button
                type="button"
                onClick={() =>
                  setPedidosFilterStatus((prev) => (prev === 'novo' ? 'todos' : 'novo'))
                }
                className={`text-left px-3 py-2 rounded-xl border transition cursor-pointer bg-white shadow-2xs hover:shadow-sm flex items-center justify-between gap-2.5 ${
                  pedidosFilterStatus === 'novo'
                    ? 'border-red-500 ring-2 ring-red-500/15'
                    : countNovos > 0
                    ? 'border-red-200 bg-red-50/40'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      countNovos > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                      Novos p/ Confirmar
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {countNovos > 0 ? 'Aguardando aceite' : 'Nenhum aguardando'}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-lg font-black font-mono tabular-nums shrink-0 ${
                    countNovos > 0 ? 'text-red-600' : 'text-slate-900'
                  }`}
                >
                  {countNovos}
                </div>
              </button>

              {/* KPI 2: Em Preparo / Prontos */}
              <button
                type="button"
                onClick={() =>
                  setPedidosFilterStatus((prev) => {
                    if (prev === 'em_preparo' && countProntos > 0) return 'pronto';
                    if (prev === 'em_preparo' || prev === 'pronto') return 'todos';
                    return countPreparo === 0 && countProntos > 0 ? 'pronto' : 'em_preparo';
                  })
                }
                className={`text-left px-3 py-2 rounded-xl border transition cursor-pointer bg-white shadow-2xs hover:shadow-sm flex items-center justify-between gap-2.5 ${
                  pedidosFilterStatus === 'em_preparo' || pedidosFilterStatus === 'pronto'
                    ? 'border-amber-500 ring-2 ring-amber-500/15'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                      Preparo &amp; Prontos
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {countPreparo} preparo • {countProntos} pronto(s)
                    </div>
                  </div>
                </div>
                <div className="text-lg font-black text-amber-600 font-mono tabular-nums shrink-0">
                  {countPreparo + countProntos}
                </div>
              </button>

              {/* KPI 3: A Caminho */}
              <button
                type="button"
                onClick={() =>
                  setPedidosFilterStatus((prev) => (prev === 'a_caminho' ? 'todos' : 'a_caminho'))
                }
                className={`text-left px-3 py-2 rounded-xl border transition cursor-pointer bg-white shadow-2xs hover:shadow-sm flex items-center justify-between gap-2.5 ${
                  pedidosFilterStatus === 'a_caminho'
                    ? 'border-sky-500 ring-2 ring-sky-500/15'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Bike className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                      A Caminho
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {countACaminho > 0 ? 'Em rota c/ motoboy' : 'Nenhuma em rota'}
                    </div>
                  </div>
                </div>
                <div className="text-lg font-black text-sky-600 font-mono tabular-nums shrink-0">
                  {countACaminho}
                </div>
              </button>

              {/* KPI 4: Entregues (Faturamento) */}
              <button
                type="button"
                onClick={() =>
                  setPedidosFilterStatus((prev) => (prev === 'entregue' ? 'todos' : 'entregue'))
                }
                className={`text-left px-3 py-2 rounded-xl border transition cursor-pointer bg-white shadow-2xs hover:shadow-sm flex items-center justify-between gap-2.5 ${
                  pedidosFilterStatus === 'entregue'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/15'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                      Entregues ({apenasHoje ? 'Hoje' : 'Total'})
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {countEntregues} pedido(s) concluído(s)
                    </div>
                  </div>
                </div>
                <div className="text-lg font-black text-emerald-700 font-mono tabular-nums shrink-0">
                  {formatCurrency(faturamentoEntregues)}
                </div>
              </button>
            </div>

            {/* Subcabeçalho da listagem */}
            <div className="flex items-center justify-between gap-2 flex-wrap px-0.5">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="font-bold text-slate-800">
                  Exibindo {filteredOrders.length}{' '}
                  {filteredOrders.length === 1 ? 'pedido' : 'pedidos'}
                </span>
                {apenasHoje && (
                  <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 font-semibold text-[11px]">
                    Somente hoje
                  </span>
                )}
              </div>

              {temFiltroAtivo && (
                <button
                  type="button"
                  onClick={limparFiltros}
                  className="text-xs font-bold text-sky-700 hover:text-sky-800 hover:underline cursor-pointer"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {/* ESTADO VAZIO OU LISTAGEM (CARDS / LISTA) */}
            {filteredOrders.length === 0 ? (
              <div className="py-16 px-6 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800">
                    Nenhum pedido encontrado neste filtro.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Novos pedidos enviados pelo cardápio online aparecem aqui automaticamente em
                    tempo real.
                  </p>
                </div>
                {temFiltroAtivo && (
                  <button
                    type="button"
                    onClick={limparFiltros}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Limpar filtros</span>
                  </button>
                )}
              </div>
            ) : modoVisualizacao === 'lista' ? (
              <>
                {/* MODO LISTA ALINHADA (DESKTOP) */}
                <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <div className="min-w-[1000px]">
                      <div className="grid grid-cols-[120px_minmax(185px,1.1fr)_minmax(185px,1.1fr)_116px_104px_272px] gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 items-center">
                        <span>Pedido</span>
                        <span>Cliente &amp; Endereço</span>
                        <span>Itens &amp; Pagamento</span>
                        <span>Status</span>
                        <span>Total</span>
                        <span className="text-right">Ações</span>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {filteredOrders.map((order) => {
                          const isNovo = order.status === 'pendente';
                          const isPreparo = order.status === 'em_separacao';
                          const isPronto = order.status === 'pronto';
                          const isACaminho = order.status === 'saiu_para_entrega';
                          const isEntregue = order.status === 'entregue';
                          const isCancelado = order.status === 'cancelado';

                          const canal = obterMetaCanal(order);
                          const statusMeta = obterMetaStatus(order.status);
                          const CanalIcon = canal.Icon;
                          const StatusIcon = statusMeta.Icon;
                          const enderecoTexto = formatarEnderecoResumo(order);
                          const itensSemSaldo = isNovo ? calcularItensSemSaldo(order) : [];
                          const primeiroItem = order.itens[0];
                          const qtdExtra = Math.max(0, order.itens.length - 1);
                          const resumoItensTooltip = order.itens
                            .map((i) => `${i.quantidade}x ${i.nome}`)
                            .join(' • ');
                          const mostrarLinkMotoboy = !isNovo && !isEntregue && !isCancelado;

                          return (
                            <div
                              key={order.id}
                              className={`grid grid-cols-[120px_minmax(185px,1.1fr)_minmax(185px,1.1fr)_116px_104px_272px] gap-3 px-4 py-3 items-center transition hover:bg-slate-50/80 ${
                                isNovo ? 'bg-red-50/25' : ''
                              }`}
                            >
                              {/* Coluna 1: Pedido & Canal */}
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono font-black text-xs text-slate-900">
                                    #{order.numeroPedido}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400">
                                    {order.hora}
                                  </span>
                                </div>
                                <span
                                  className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide ${canal.pillClass}`}
                                >
                                  <CanalIcon className="w-2.5 h-2.5 shrink-0" />
                                  <span className="truncate">{canal.label}</span>
                                </span>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {formatarDataCurta(order.data)}
                                </div>
                              </div>

                              {/* Coluna 2: Cliente & Endereço */}
                              <div className="min-w-0 space-y-0.5">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-bold text-xs text-slate-900 truncate">
                                    {order.cliente?.nome || 'Cliente'}
                                  </span>
                                  {order.cliente?.telefone && (
                                    <button
                                      type="button"
                                      onClick={() => abrirContatoCliente(order)}
                                      className="text-[10px] font-mono font-bold text-sky-700 hover:underline shrink-0 cursor-pointer"
                                      title="Ligar ou enviar WhatsApp"
                                    >
                                      {order.cliente.telefone}
                                    </button>
                                  )}
                                </div>
                                {enderecoTexto && (
                                  <div
                                    className="text-[11px] text-slate-500 truncate"
                                    title={enderecoTexto}
                                  >
                                    {enderecoTexto}
                                  </div>
                                )}
                              </div>

                              {/* Coluna 3: Itens & Pagamento */}
                              <div className="min-w-0 space-y-1">
                                <div
                                  className="text-xs text-slate-800 truncate"
                                  title={resumoItensTooltip}
                                >
                                  {primeiroItem ? (
                                    <>
                                      <strong className="text-slate-900">
                                        {primeiroItem.quantidade}x
                                      </strong>{' '}
                                      {primeiroItem.nome}
                                      {qtdExtra > 0 ? (
                                        <span className="text-slate-400 font-semibold">
                                          {' '}
                                          (+{qtdExtra})
                                        </span>
                                      ) : null}
                                    </>
                                  ) : (
                                    <span className="text-slate-400">Sem itens</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                    <CreditCard className="w-2.5 h-2.5 text-slate-500" />
                                    <span>{formatarFormaPagamento(order.formaPagamento)}</span>
                                  </span>
                                  {itensSemSaldo.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                                      <AlertTriangle className="w-2.5 h-2.5" />
                                      <span>Sem estoque</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Coluna 4: Status */}
                              <div>
                                <span
                                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${statusMeta.badgeClass}`}
                                >
                                  {statusMeta.pulse ? (
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                                  ) : (
                                    <StatusIcon className="w-3 h-3 shrink-0" />
                                  )}
                                  <span>{statusMeta.label}</span>
                                </span>
                              </div>

                              {/* Coluna 5: Total */}
                              <div className="font-mono font-black text-xs text-slate-900 tabular-nums">
                                {formatCurrency(order.valorTotal)}
                              </div>

                              {/* Coluna 6: Ações Alinhadas (272px fixos) */}
                              <div className="w-[272px] flex items-center justify-end gap-1.5">
                                {isNovo ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      pararAlertaNovoPedidoDelivery();
                                      onAtualizarStatusPedido(order.id, 'em_separacao');
                                    }}
                                    className="w-[112px] h-8 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer shrink-0"
                                  >
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                    <span>Confirmar</span>
                                  </button>
                                ) : isPreparo || isPronto ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onAtualizarStatusPedido(order.id, 'saiu_para_entrega')
                                    }
                                    className="w-[112px] h-8 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer shrink-0"
                                  >
                                    <Bike className="w-3.5 h-3.5" />
                                    <span>Despachar</span>
                                  </button>
                                ) : isACaminho ? (
                                  <button
                                    type="button"
                                    onClick={() => abrirConfirmarEntrega(order)}
                                    className="w-[112px] h-8 px-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer shrink-0"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Entregue</span>
                                  </button>
                                ) : (
                                  <span className="w-[112px] h-8 shrink-0" aria-hidden="true" />
                                )}

                                {mostrarLinkMotoboy ? (
                                  <button
                                    type="button"
                                    onClick={() => setPedidoLinkMotoboy(order)}
                                    className="w-8 h-8 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition cursor-pointer shrink-0"
                                    title="Link do motoboy"
                                  >
                                    <Share2 className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <span className="w-8 h-8 shrink-0" aria-hidden="true" />
                                )}

                                <button
                                  type="button"
                                  onClick={() => setComandaImpressao(order)}
                                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition cursor-pointer shrink-0"
                                  title="Imprimir comanda térmica"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDispararNfce(order)}
                                  className="w-8 h-8 rounded-lg border border-cyan-200 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 flex items-center justify-center transition cursor-pointer shrink-0"
                                  title="Emitir ou verificar NFC-e"
                                >
                                  <FileCheck className="w-3.5 h-3.5" />
                                </button>

                                {!isEntregue && !isCancelado ? (
                                  <button
                                    type="button"
                                    onClick={() => abrirCancelarPedido(order)}
                                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-600 flex items-center justify-center transition cursor-pointer shrink-0"
                                    title="Cancelar pedido"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <span className="w-8 h-8 shrink-0" aria-hidden="true" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fallback Mobile para modo Lista */}
                <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredOrders.map((order) => renderCard(order))}
                </div>
              </>
            ) : (
              /* MODO CARDS (DENSO E RESPONSIVO ATÉ 5 COLUNAS) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
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
            onClick={(e) => {
              if (e.target === e.currentTarget) setPedidoParaCancelar(null);
            }}
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
                      Cliente: {pedidoParaCancelar.cliente?.nome || 'Cliente'} (
                      {formatCurrency(pedidoParaCancelar.valorTotal)})
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
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Como este pedido já havia sido aceito, os produtos retornarão automaticamente ao
                    estoque e a venda será estornada do caixa.
                  </span>
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
            onClick={(e) => {
              if (e.target === e.currentTarget) setComandaImpressao(null);
            }}
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
                <p className="text-[10px] text-slate-500">
                  {comandaImpressao.data} - {comandaImpressao.hora}
                </p>
              </div>

              <div className="space-y-0.5">
                <p>
                  <strong>Cliente:</strong> {comandaImpressao.cliente?.nome || 'Cliente'}
                </p>
                <p>
                  <strong>Telefone:</strong> {comandaImpressao.cliente?.telefone || '-'}
                </p>
                {comandaImpressao.tipo_pedido !== 'retirada' &&
                  comandaImpressao.tipo_pedido !== 'mesa' && (
                    <>
                      <p>
                        <strong>Endereço:</strong> {comandaImpressao.enderecoEntrega?.logradouro},{' '}
                        {comandaImpressao.enderecoEntrega?.numero}
                      </p>
                      <p>
                        <strong>Bairro:</strong> {comandaImpressao.enderecoEntrega?.bairro}
                      </p>
                      {comandaImpressao.enderecoEntrega?.referencia && (
                        <p>
                          <strong>Ref:</strong> {comandaImpressao.enderecoEntrega.referencia}
                        </p>
                      )}
                    </>
                  )}
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1">
                <p className="font-bold">ITENS:</p>
                {comandaImpressao.itens.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {it.quantidade}x {it.nome}
                    </span>
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
                <p>
                  <strong>Forma:</strong> {(comandaImpressao.formaPagamento || '').toUpperCase()}
                </p>
                {comandaImpressao.trocoPara && (
                  <p>
                    <strong>Levar troco para:</strong> {formatCurrency(comandaImpressao.trocoPara)}
                  </p>
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
                      configDelivery.larguraImpressao || '80mm',
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

        {/* MODAL DE VALIDAÇÃO DE PIN DE ENTREGA */}
        {pedidoParaValidarPin && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            style={{ zIndex: 10000000 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setPedidoParaValidarPin(null);
            }}
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
                  Digite o código PIN (6 dígitos ou 4 em pedidos antigos) informado pelo cliente no
                  momento da entrega:
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={pinDigitado}
                  onChange={(e) => setPinDigitado(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-44 text-center text-2xl font-mono font-bold tracking-widest bg-slate-50 border-2 border-emerald-500 rounded-2xl p-2.5 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
                  onClick={async () => {
                    if (pinDigitado.length < 4) {
                      setErroPin('Digite o PIN de confirmação (mínimo 4 dígitos).');
                      return;
                    }
                    const res = await onConfirmarEntregaPin(pedidoParaValidarPin.id, pinDigitado);
                    const sucesso = typeof res === 'boolean' ? res : Boolean(res?.ok);
                    if (sucesso) {
                      setPedidoParaValidarPin(null);
                    } else {
                      setErroPin(
                        (typeof res === 'object' && res?.erro) ||
                          'PIN incorreto! Verifique com o cliente.'
                      );
                    }
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Validar &amp; Concluir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE CONTATO: LIGAR OU ENVIAR WHATSAPP AO CLICAR NO NÚMERO */}
        {clienteContatoModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            style={{ zIndex: 10000002 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setClienteContatoModal(null);
            }}
          >
            <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 leading-tight">
                      Falar com o Cliente
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Pedido #{clienteContatoModal.numeroPedido} • {clienteContatoModal.nome}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setClienteContatoModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-base font-black font-mono text-slate-800">
                  {clienteContatoModal.telefone}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <a
                  href={`tel:${clienteContatoModal.telefone.replace(/\D/g, '')}`}
                  onClick={() => setClienteContatoModal(null)}
                  className="py-3 px-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Phone className="w-5 h-5" />
                  <span>Ligar Agora</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    const fone = clienteContatoModal.telefone.replace(/\D/g, '');
                    const foneDdi = fone.startsWith('55') ? fone : `55${fone}`;
                    const msg = `Olá, ${clienteContatoModal.nome}! Somos da loja ${lojaAtual?.nome || ''}. Estamos com seu pedido #${clienteContatoModal.numeroPedido}.`;
                    window.open(
                      `https://api.whatsapp.com/send?phone=${foneDdi}&text=${encodeURIComponent(msg)}`,
                      '_blank'
                    );
                    setClienteContatoModal(null);
                  }}
                  className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE CONFIGURAÇÕES DE DELIVERY EM TELA CHEIA */}
        {modalConfigAberta && (
          <div
            className="fixed inset-0 w-screen h-screen bg-slate-100 flex flex-col overflow-hidden text-slate-800"
            style={{ zIndex: 10000000 }}
          >
            {/* Header Fixo em Tela Toda */}
            <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    Configurações de Delivery da Loja
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Gerencie horários, taxas, alertas sonoros, impressão térmica e links de acesso em
                    tela cheia
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
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black shadow-sm transition cursor-pointer flex items-center gap-1.5"
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
                                const hhmm = agora.toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: false,
                                });
                                const foraDoHorario =
                                  prev.ativo !== false &&
                                  prev.horarioFechamento &&
                                  prev.horarioFechamento <= hhmm;
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
                          title={
                            estaAberta
                              ? 'Clique para fechar a loja manualmente'
                              : 'Clique para abrir a loja agora'
                          }
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
                          <Bell className="w-4 h-4 text-amber-600" />
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
                          <BellOff className="w-4 h-4" />
                          <span>Parar Toque</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            tocarAlertaNovoPedidoDelivery(formConfig.repeticoesAlerta ?? 3)
                          }
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
                        >
                          <Bell className="w-4 h-4" />
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
                      Assim que você clicar em &quot;Confirmar Pedido&quot;, o sino para de tocar
                      imediatamente.
                    </p>
                  </div>

                  {/* Automações ao Receber Novo Pedido */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/90 border border-sky-200 shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-sky-200/70">
                      <span className="font-black text-xs sm:text-sm text-sky-950 flex items-center gap-2 uppercase tracking-wide">
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
                          Move o pedido direto para &quot;Em Separação&quot; e já baixa os produtos do
                          estoque
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
                        <span>{formConfig.aceitarAutomatico ? 'LIGADA' : 'DESLIGADA'}</span>
                      </button>
                    </div>

                    {/* Caixilha 2: Impressão Automática */}
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
                          <span>{formConfig.imprimirAutomatico ? 'LIGADA' : 'DESLIGADA'}</span>
                        </button>
                      </div>

                      {formConfig.imprimirAutomatico && (
                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                          <span className="text-slate-800 font-bold">Largura da Bobina Térmica:</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setFormConfig((prev) => ({ ...prev, larguraImpressao: '80mm' }))
                              }
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
                              onClick={() =>
                                setFormConfig((prev) => ({ ...prev, larguraImpressao: '58mm' }))
                              }
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

                  {/* Horário de Início e Término do Delivery */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/80 border border-sky-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs sm:text-sm text-sky-950 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-sky-600" />
                        <span>Horário de Funcionamento do Delivery:</span>
                      </span>
                      <span className="text-[11px] bg-sky-100 text-sky-700 px-2.5 py-0.5 rounded-full font-bold">
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
                          onChange={(e) =>
                            setFormConfig((prev) => ({ ...prev, horarioAbertura: e.target.value }))
                          }
                          className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-sky-500 shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 block mb-1.5 font-bold text-xs">
                          Horário de Término (Fechamento):
                        </label>
                        <input
                          type="time"
                          value={formConfig.horarioFechamento || '23:00'}
                          onChange={(e) =>
                            setFormConfig((prev) => ({
                              ...prev,
                              horarioFechamento: e.target.value,
                            }))
                          }
                          className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-sky-500 shadow-2xs"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-sky-800/80 leading-relaxed">
                      Fora deste horário, o cliente não conseguirá enviar pedidos pelo cardápio
                      online e verá o aviso de loja fechada.
                    </p>
                  </div>
                </div>

                {/* COLUNA 2: Taxas, Tempos, PIX, WhatsApp e Links da Loja */}
                <div className="space-y-5">
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                    <div className="border-b border-slate-100 pb-2.5">
                      <h4 className="font-black text-sm text-slate-900">
                        Taxas de Entrega, Tempos &amp; Pagamento
                      </h4>
                      <p className="text-xs text-slate-500">
                        Defina valores de entrega, tempo médio estimado e dados de contato da loja
                      </p>
                    </div>

                    {/* Taxa de Entrega e Raio */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-700 block mb-1.5 font-bold text-xs">
                          Taxa de Entrega Fixa (R$):
                        </label>
                        <input
                          type="number"
                          step="0.50"
                          value={formConfig.taxaEntregaFixa}
                          onChange={(e) =>
                            setFormConfig((prev) => ({
                              ...prev,
                              taxaEntregaFixa: Number(e.target.value),
                            }))
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 block mb-1.5 font-bold text-xs">
                          Raio Máximo Atendido (km):
                        </label>
                        <input
                          type="number"
                          value={formConfig.raioMaximoKm}
                          onChange={(e) =>
                            setFormConfig((prev) => ({
                              ...prev,
                              raioMaximoKm: Number(e.target.value),
                            }))
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    {/* Tempos Estimados e Pedido Mínimo */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-700 block mb-1.5 font-bold text-xs">
                          Tempo Mín (min):
                        </label>
                        <input
                          type="number"
                          value={formConfig.tempoMinimoMinutos}
                          onChange={(e) =>
                            setFormConfig((prev) => ({
                              ...prev,
                              tempoMinimoMinutos: Number(e.target.value),
                            }))
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 block mb-1.5 font-bold text-xs">
                          Tempo Máx (min):
                        </label>
                        <input
                          type="number"
                          value={formConfig.tempoMaximoMinutos}
                          onChange={(e) =>
                            setFormConfig((prev) => ({
                              ...prev,
                              tempoMaximoMinutos: Number(e.target.value),
                            }))
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 block mb-1.5 font-bold text-xs">
                          Ped. Mínimo (R$):
                        </label>
                        <input
                          type="number"
                          value={formConfig.valorMinimoPedido}
                          onChange={(e) =>
                            setFormConfig((prev) => ({
                              ...prev,
                              valorMinimoPedido: Number(e.target.value),
                            }))
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    {/* Chave PIX da Loja */}
                    <div>
                      <label className="text-slate-700 block mb-1.5 font-bold text-xs">
                        Chave PIX da Loja (para pagamentos online):
                      </label>
                      <input
                        type="text"
                        value={formConfig.chavePix || ''}
                        onChange={(e) =>
                          setFormConfig((prev) => ({ ...prev, chavePix: e.target.value }))
                        }
                        placeholder="CNPJ, E-mail, Celular ou Chave Aleatória"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    {/* Telefone / WhatsApp da Loja */}
                    <div>
                      <label className="text-slate-700 block mb-1.5 font-bold text-xs">
                        WhatsApp da Loja para Suporte:
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formConfig.telefoneContatoLoja || ''}
                        onChange={(e) =>
                          setFormConfig((prev) => ({
                            ...prev,
                            telefoneContatoLoja: mascaraTelefone(e.target.value),
                          }))
                        }
                        placeholder="(00) 90000-0000"
                        maxLength={15}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  {/* LINKS EXCLUSIVOS DA LOJA E CARDÁPIO DIGITAL */}
                  {lojaAtual &&
                    (() => {
                      const linksLoja = obterLinksExclusivosLoja(lojaAtual);
                      const itensLinks = [
                        {
                          id: 'cardapio',
                          label: 'Cardápio Digital (Clientes - Público)',
                          url: linksLoja.cardapio,
                          cor: 'bg-emerald-50 border-emerald-200 text-emerald-900',
                          btnCor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
                        },
                        {
                          id: 'admin',
                          label: 'Link Oficial da Loja (Admin & Funcionários)',
                          url: linksLoja.admin,
                          cor: 'bg-slate-50 border-slate-200 text-slate-800',
                          btnCor: 'bg-slate-800 hover:bg-slate-900 text-white',
                        },
                      ];

                      return (
                        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-slate-900 text-sm flex items-center gap-2">
                              <KeyRound className="w-4 h-4 text-sky-600" />
                              <span>Links da Loja &amp; Cardápio</span>
                            </span>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                              Token Protegido
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            O Admin e todos os funcionários cadastrados entram pelo mesmo Link
                            Oficial da Loja:
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
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-sm cursor-pointer transition flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </div>
        )}

        {/* MODAL DE LINK DO MOTOBOY */}
        {pedidoLinkMotoboy && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            style={{ zIndex: 10000000 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setPedidoLinkMotoboy(null);
            }}
          >
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fadeIn">
              {/* Header do Modal */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center border border-sky-200 shrink-0">
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

              {/* Box Roxo Informativo */}
              <div className="bg-[#faf5ff] border border-[#f3e8ff] rounded-2xl p-4 text-xs text-[#581c87] space-y-2">
                <p className="font-extrabold flex items-center gap-1.5 text-[#6b21a8]">
                  <span>Esta página leve abre no celular do motoboy com:</span>
                </p>
                <ul className="space-y-1.5 pl-1 text-[11px] text-slate-700">
                  <li className="flex items-start gap-1.5">
                    <span className="text-sky-600 font-bold">•</span>
                    <span>Endereço do cliente com GPS (Google Maps e Waze)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-sky-600 font-bold">•</span>
                    <span>Telefone do cliente com botão para ligar ou abrir WhatsApp</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-sky-600 font-bold">•</span>
                    <span>Valor total a cobrar e troco exato a devolver</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-sky-600 font-bold">•</span>
                    <span>Botão &quot;Finalizar Entrega&quot; para atualizar no sistema</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-emerald-700 font-semibold pt-0.5">
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
                    {copiouLinkMotoboy ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
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
