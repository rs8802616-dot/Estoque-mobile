import React, { useState, useMemo } from 'react';
import {
  Bike,
  Search,
  Printer,
  Check,
  Flame,
  Phone,
  MapPin,
  Clock,
  Share2,
  KeyRound,
  User,
  AlertCircle,
  X,
} from 'lucide-react';
import { PedidoDelivery, StatusPedidoDelivery, Supermercado } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CaixaDeliveryPanelProps {
  pedidos: PedidoDelivery[];
  loja: Supermercado | null;
  onAtualizarStatus: (id: string, novoStatus: StatusPedidoDelivery, motivo?: string) => void;
  onConfirmarEntregaPin: (id: string, pin: string) => boolean;
  onAbrirCardapioCliente?: () => void;
  onImprimirComanda?: (pedido: PedidoDelivery) => void;
}

export const CaixaDeliveryPanel: React.FC<CaixaDeliveryPanelProps> = ({
  pedidos,
  loja,
  onAtualizarStatus,
  onConfirmarEntregaPin,
  onAbrirCardapioCliente,
  onImprimirComanda,
}) => {
  const [deliveryFilter, setDeliveryFilter] = useState<'ativos' | 'novo' | 'em_preparo' | 'a_caminho' | 'todos'>('ativos');
  const [deliverySearch, setDeliverySearch] = useState<string>('');
  const [copiedDeliveryLink, setCopiedDeliveryLink] = useState(false);

  // Modal de validação de PIN de 4 dígitos
  const [validandoPinPedido, setValidandoPinPedido] = useState<PedidoDelivery | null>(null);
  const [pinDigitado, setPinDigitado] = useState('');
  const [erroPin, setErroPin] = useState('');

  // Copiar link do cardápio digital
  const handleCopyDeliveryLink = () => {
    const slug = loja?.slug || loja?.id || 'loja_matriz_01';
    let url = `${window.location.origin}/?loja=${slug}`;
    if (loja?.marca) url += `&marca=${encodeURIComponent(loja.marca)}`;
    if (loja?.nome) url += `&nome=${encodeURIComponent(loja.nome)}`;
    navigator.clipboard.writeText(url);
    setCopiedDeliveryLink(true);
    setTimeout(() => setCopiedDeliveryLink(false), 2500);
  };

  // Despacho no WhatsApp do motoboy com link de rota do Google Maps
  const handleDespacharMotoboy = (pedido: PedidoDelivery) => {
    if (pedido.status === 'pendente' || pedido.status === 'em_separacao') {
      onAtualizarStatus(pedido.id, 'saiu_para_entrega');
    }

    const end = pedido.enderecoEntrega;
    const enderecoCompleto = `${end.logradouro}, ${end.numero}${end.complemento ? ' ' + end.complemento : ''}, ${end.bairro}, ${end.cidade}`;
    const linkMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`;

    const listaItens = (pedido.itens || [])
      .map((it) => `• ${it.quantidade}x ${it.nome} (R$ ${it.subtotal.toFixed(2)})`)
      .join('\n');

    const texto = `🛵 *PEDIDO DE DELIVERY #${pedido.numeroPedido}*\n\n` +
      `👤 *Cliente:* ${pedido.cliente.nome}\n` +
      `📱 *WhatsApp:* ${pedido.cliente.telefone}\n` +
      `📍 *Endereço:* ${enderecoCompleto}\n` +
      (end.referencia ? `🏷️ *Ref:* ${end.referencia}\n` : '') +
      `🗺️ *Rota Google Maps:* ${linkMaps}\n\n` +
      `📦 *Itens a Entregar:*\n${listaItens}\n\n` +
      `💳 *Forma de Pgto:* ${pedido.formaPagamento.toUpperCase()}\n` +
      (pedido.trocoPara ? `💵 *Troco para:* R$ ${pedido.trocoPara.toFixed(2)}\n` : '') +
      `💰 *Total a Cobrar:* R$ ${pedido.valorTotal.toFixed(2)}\n` +
      `🔐 *PIN de Confirmação:* O cliente fornecerá o PIN de 4 dígitos no ato da entrega.`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  // Confirmação de PIN
  const handleValidarPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validandoPinPedido) return;

    const ok = onConfirmarEntregaPin(validandoPinPedido.id, pinDigitado);
    if (ok) {
      setValidandoPinPedido(null);
      setPinDigitado('');
      setErroPin('');
    } else {
      setErroPin('PIN incorreto! Solicite os 4 dígitos ao cliente ou entregador.');
    }
  };

  // Contadores de pedidos
  const countAtivosDelivery = useMemo(() => {
    return pedidos.filter((p) => p.status !== 'entregue' && p.status !== 'cancelado').length;
  }, [pedidos]);

  const countNovosDelivery = useMemo(() => {
    return pedidos.filter((p) => p.status === 'pendente').length;
  }, [pedidos]);

  const countPreparoDelivery = useMemo(() => {
    return pedidos.filter((p) => p.status === 'em_separacao').length;
  }, [pedidos]);

  const countACaminhoDelivery = useMemo(() => {
    return pedidos.filter((p) => p.status === 'saiu_para_entrega').length;
  }, [pedidos]);

  // Lista filtrada de pedidos
  const filteredOrders = useMemo(() => {
    return pedidos
      .filter((p) => {
        if (deliveryFilter === 'ativos') return p.status !== 'entregue' && p.status !== 'cancelado';
        if (deliveryFilter === 'novo') return p.status === 'pendente';
        if (deliveryFilter === 'em_preparo') return p.status === 'em_separacao';
        if (deliveryFilter === 'a_caminho') return p.status === 'saiu_para_entrega';
        return true;
      })
      .filter((p) => {
        if (!deliverySearch.trim()) return true;
        const q = deliverySearch.toLowerCase();
        const nome = (p.cliente?.nome || '').toLowerCase();
        const fone = (p.cliente?.telefone || '').toLowerCase();
        const rua = (p.enderecoEntrega?.logradouro || '').toLowerCase();
        const bairro = (p.enderecoEntrega?.bairro || '').toLowerCase();
        const id = p.numeroPedido.toString();
        return nome.includes(q) || fone.includes(q) || rua.includes(q) || bairro.includes(q) || id.includes(q);
      })
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [pedidos, deliveryFilter, deliverySearch]);

  const hojeFormatado = useMemo(() => {
    const agora = new Date();
    const y = agora.getFullYear();
    const m = String(agora.getMonth() + 1).padStart(2, '0');
    const d = String(agora.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  return (
    <div className="bg-[#f0fdf4] border border-[#a7f3d0] rounded-3xl p-3.5 sm:p-4 shadow-sm space-y-3 flex-1 flex flex-col text-stone-900 w-full min-w-0">
      {/* 1. Header do Painel de Delivery */}
      <div className="flex items-center justify-between gap-2 pb-1 border-b border-[#a7f3d0]/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-[#a7f3d0]/80 text-[#047857] flex items-center justify-center border border-[#6ee7b7]/60 shadow-xs shrink-0">
            <Bike className="w-5 h-5 text-[#047857]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-stone-900 tracking-tight flex items-center gap-1">
                <span>🛵</span>
                <span>DELIVERY</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#d1fae5] text-[#065f46] text-xs font-bold border border-[#a7f3d0]">
                {countAtivosDelivery}
              </span>
            </div>
            <p className="text-[11px] text-[#065f46] font-medium leading-none truncate">
              Entrega motoboy no endereço
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Botão Copiar Link Cardápio */}
          <button
            type="button"
            onClick={handleCopyDeliveryLink}
            className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Copiar link do cardápio digital para o cliente"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-700" />
            <span>{copiedDeliveryLink ? 'Copiado!' : 'Cardápio'}</span>
          </button>
        </div>
      </div>

      {/* 2. Filtros de Status */}
      <div className="flex items-center gap-1.5 text-xs font-bold overflow-x-auto pb-0.5 scrollbar-none">
        {/* Ativos */}
        <button
          type="button"
          onClick={() => setDeliveryFilter('ativos')}
          className={`px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ${
            deliveryFilter === 'ativos'
              ? 'bg-[#047857] text-white shadow-xs'
              : 'bg-white border border-[#a7f3d0] text-[#047857] hover:bg-emerald-50/60'
          }`}
        >
          Ativos ({countAtivosDelivery})
        </button>

        {/* Novos */}
        <button
          type="button"
          onClick={() => setDeliveryFilter('novo')}
          className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer shrink-0 ${
            deliveryFilter === 'novo'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] hover:bg-red-100/70'
          }`}
        >
          <span className={`w-2 h-2 rounded-full bg-red-500 ${countNovosDelivery > 0 ? 'animate-pulse' : ''}`} />
          Novos ({countNovosDelivery})
        </button>

        {/* Preparo */}
        <button
          type="button"
          onClick={() => setDeliveryFilter('em_preparo')}
          className={`px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ${
            deliveryFilter === 'em_preparo'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-[#fffbeb] border border-[#fde68a] text-[#b45309] hover:bg-amber-100/70'
          }`}
        >
          Preparo {countPreparoDelivery > 0 ? `(${countPreparoDelivery})` : ''}
        </button>

        {/* A Caminho */}
        <button
          type="button"
          onClick={() => setDeliveryFilter('a_caminho')}
          className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 shrink-0 ${
            deliveryFilter === 'a_caminho'
              ? 'bg-[#9333ea] text-white shadow-xs'
              : 'bg-white border border-[#a7f3d0] text-[#047857] hover:bg-emerald-50/60'
          }`}
        >
          <span>A Caminho 🛵</span>
          {countACaminhoDelivery > 0 && <span>({countACaminhoDelivery})</span>}
        </button>
      </div>

      {/* 3. Barra de Pesquisa Rápida (com espaçamento corrigido sem sobreposição de ícone) */}
      <div className="relative w-full">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-stone-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={deliverySearch}
          onChange={(e) => setDeliverySearch(e.target.value)}
          placeholder="Buscar cliente, rua, fone..."
          className="w-full pl-10 pr-8 py-2 bg-white border border-[#a7f3d0] rounded-full text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#047857]/20 shadow-2xs transition"
        />
        {deliverySearch && (
          <button
            type="button"
            onClick={() => setDeliverySearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs cursor-pointer p-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* 4. Lista de Cards de Pedidos */}
      <div className="space-y-3 max-h-[68vh] overflow-y-auto pr-1 flex-1">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-[#065f46]/70 text-xs space-y-2 bg-white/70 rounded-2xl border border-dashed border-[#a7f3d0]">
            <Bike className="w-10 h-10 mx-auto text-[#047857]/50" />
            <p className="font-bold text-stone-700">Nenhum pedido encontrado nesta aba.</p>
            <p className="text-[11px] text-stone-500">
              Novos pedidos feitos no cardápio do cliente tocarão alerta e aparecerão aqui em tempo real.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isNovo = order.status === 'pendente';
            const isPreparo = order.status === 'em_separacao';
            const isACaminho = order.status === 'saiu_para_entrega';
            const isEntregue = order.status === 'entregue';
            const isDelivery = order.tipo_pedido !== 'retirada';

            // Formatação de data e verificação se é anterior ou hoje
            const partesData = (order.data || '').split('-');
            const dataFormatada = partesData.length === 3 ? `${partesData[2]}/${partesData[1]}/${partesData[0]}` : order.data;
            const isAnterior = order.data && order.data < hojeFormatado;

            const enderecoCompleto = `${order.enderecoEntrega.logradouro}, ${order.enderecoEntrega.numero}${
              order.enderecoEntrega.complemento ? ' ' + order.enderecoEntrega.complemento : ''
            }`;
            const bairroTexto = order.enderecoEntrega.bairro ? `(Bairro: ${order.enderecoEntrega.bairro})` : '';

            // Borda colorida idêntica à imagem
            const borderCardClass = isACaminho
              ? 'border-2 border-[#a855f7]'
              : isNovo
              ? 'border-2 border-red-500 ring-2 ring-red-500/10'
              : isPreparo
              ? 'border-2 border-amber-400'
              : 'border border-stone-200';

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl p-3.5 sm:p-4 text-xs transition shadow-xs space-y-2 relative ${borderCardClass}`}
              >
                {/* Cabeçalho do Card */}
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-stone-900 font-mono">
                      #{order.numeroPedido}
                    </span>
                    <span className="bg-[#047857] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                      <Bike className="w-3 h-3" />
                      <span>{isDelivery ? 'DELIVERY' : 'RETIRADA'}</span>
                    </span>
                  </div>

                  {/* Tag de Status no Topo Direito */}
                  {isNovo && (
                    <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 animate-pulse">
                      ● NOVO
                    </span>
                  )}
                  {isPreparo && (
                    <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      <span>EM PREPARO</span>
                    </span>
                  )}
                  {isACaminho && (
                    <span className="bg-[#047857] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                      <Bike className="w-3 h-3" />
                      <span>A CAMINHO</span>
                    </span>
                  )}
                  {isEntregue && (
                    <span className="bg-stone-700 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                      ✓ ENTREGUE
                    </span>
                  )}
                </div>

                {/* Dados do Cliente e Entrega */}
                <div className="space-y-0.5 text-xs text-stone-700">
                  <div className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                    <span className="truncate">{order.cliente.nome || 'Cliente'}</span>
                  </div>

                  {order.cliente.telefone && (
                    <div className="text-stone-500 font-mono flex items-center gap-1.5">
                      <Phone className="w-3 h-3 shrink-0" />
                      <span>{order.cliente.telefone}</span>
                    </div>
                  )}

                  {isDelivery && (
                    <div className="text-stone-700 flex items-start gap-1.5 leading-snug">
                      <MapPin className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                      <span>
                        {enderecoCompleto} {bairroTexto}
                      </span>
                    </div>
                  )}

                  <div className="font-semibold text-stone-800 flex items-center gap-1.5 pt-0.5">
                    <span>💰</span>
                    <span>Pgto: <strong className="uppercase">{order.formaPagamento}</strong></span>
                    {order.trocoPara && order.formaPagamento === 'dinheiro' && (
                      <span className="text-amber-700 text-[11px] font-bold">
                        (Troco p/ R$ {order.trocoPara.toFixed(2)})
                      </span>
                    )}
                  </div>

                  <div className="text-stone-400 text-[11px] font-mono flex items-center gap-1.5 pt-0.5">
                    <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                    <span>{dataFormatada} às {order.hora}</span>
                    {isAnterior ? (
                      <span className="bg-[#fef3c7] text-[#92400e] text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
                        ANTERIOR
                      </span>
                    ) : (
                      <span className="bg-[#dcfce7] text-[#166534] text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
                        HOJE
                      </span>
                    )}
                  </div>
                </div>

                {/* Divisor */}
                <div className="border-t border-[#a7f3d0]/60 my-1.5" />

                {/* Lista de Itens do Pedido */}
                <div className="space-y-1 text-xs">
                  {order.itens.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-baseline gap-2">
                      <span className="text-stone-800 font-medium truncate">
                        {it.quantidade}x {it.nome}
                      </span>
                      <span className="font-mono font-bold text-stone-900 shrink-0">
                        {formatCurrency(it.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Barra Inferior com Box TOTAL e Botões de Ação */}
                <div className="pt-2 border-t border-[#a7f3d0]/60 flex items-center justify-between gap-1.5">
                  {/* Caixa TOTAL estilo Mint */}
                  <div className="bg-[#d1fae5]/80 border border-[#6ee7b7] rounded-xl px-2.5 py-1.5 flex flex-col justify-center shrink-0 min-w-[95px]">
                    <span className="text-[9px] font-extrabold text-[#065f46] tracking-wider uppercase leading-none">
                      TOTAL
                    </span>
                    <span className="text-sm sm:text-base font-black text-stone-900 font-mono tracking-tight leading-tight mt-0.5">
                      {formatCurrency(order.valorTotal)}
                    </span>
                    <span className="text-[9px] text-[#065f46] font-medium leading-none mt-0.5">
                      {order.taxaEntrega > 0 ? `(+${formatCurrency(order.taxaEntrega)} taxa)` : 'Taxa Grátis'}
                    </span>
                  </div>

                  {/* Botões de Ação da Direita (Proporcionais e sem cortes) */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Botão Imprimir */}
                    {onImprimirComanda && (
                      <button
                        type="button"
                        onClick={() => onImprimirComanda(order)}
                        className="w-9 h-9 rounded-xl border border-[#6ee7b7] bg-white hover:bg-emerald-50 text-[#047857] flex items-center justify-center shadow-xs transition cursor-pointer shrink-0 active:scale-95"
                        title="Imprimir comanda térmica"
                      >
                        <Printer className="w-4 h-4 text-[#047857]" />
                      </button>
                    )}

                    {/* Botão para Novo Pedido: Aceitar Pedido */}
                    {isNovo && (
                      <button
                        type="button"
                        onClick={() => onAtualizarStatus(order.id, 'em_separacao')}
                        className="px-3.5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer active:scale-95 shrink-0"
                        title="Aceitar pedido e dar baixa automática no estoque via FEFO"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Aceitar Pedido</span>
                      </button>
                    )}

                    {/* Botões para Pedido em Preparo */}
                    {isPreparo && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDespacharMotoboy(order)}
                          className="px-3 py-2 rounded-xl bg-[#9333ea] hover:bg-[#7e22ce] text-white font-bold text-xs flex items-center gap-1 shadow-sm transition cursor-pointer active:scale-95 shrink-0"
                          title="Enviar dados e rota Maps para o motoboy via WhatsApp"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>Link Motoboy</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onAtualizarStatus(order.id, isDelivery ? 'saiu_para_entrega' : 'entregue')}
                          className="px-3 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center gap-1 shadow-sm transition cursor-pointer active:scale-95 shrink-0"
                          title={isDelivery ? 'Despachar entrega' : 'Finalizar retirada no balcão'}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>{isDelivery ? 'Despachar' : 'Entregue'}</span>
                        </button>
                      </>
                    )}

                    {/* Botões para Pedido A Caminho */}
                    {isACaminho && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDespacharMotoboy(order)}
                          className="px-2.5 sm:px-3 py-2 rounded-xl bg-[#9333ea] hover:bg-[#7e22ce] text-white font-bold text-xs flex items-center gap-1 shadow-sm transition cursor-pointer active:scale-95 shrink-0"
                          title="Reenviar dados e rota Maps para o motoboy no WhatsApp"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>Link Motoboy</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setValidandoPinPedido(order);
                            setPinDigitado('');
                            setErroPin('');
                          }}
                          className="px-2.5 sm:px-3 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center gap-1 shadow-sm transition cursor-pointer active:scale-95 shrink-0"
                          title="Confirmar entrega digitando o PIN de 4 dígitos do cliente"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Confirmar Entrega</span>
                        </button>
                      </>
                    )}

                    {/* Entregue */}
                    {isEntregue && (
                      <span className="px-2.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-xl">
                        ✓ Entregue
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Validação de PIN de 4 Dígitos */}
      {validandoPinPedido && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-stone-900">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold">Validar PIN da Entrega</h3>
              </div>
              <button
                type="button"
                onClick={() => setValidandoPinPedido(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Digite o código PIN de 4 dígitos fornecido pelo cliente <strong>{validandoPinPedido.cliente.nome}</strong> (Pedido #{validandoPinPedido.numeroPedido}):
            </p>

            <form onSubmit={handleValidarPinSubmit} className="space-y-3">
              <input
                type="text"
                autoFocus
                maxLength={4}
                value={pinDigitado}
                onChange={(e) => setPinDigitado(e.target.value.replace(/\D/g, ''))}
                placeholder="Ex: 4891"
                className="w-full text-center tracking-widest text-3xl font-mono font-black p-3 rounded-2xl bg-stone-50 border-2 border-emerald-500 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />

              {erroPin && (
                <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{erroPin}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setValidandoPinPedido(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={pinDigitado.length < 4}
                  className="flex-1 py-2.5 bg-[#059669] hover:bg-[#047857] disabled:opacity-40 rounded-xl text-xs font-bold text-white shadow transition cursor-pointer"
                >
                  Confirmar Entrega
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
