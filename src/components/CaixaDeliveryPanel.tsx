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
  ExternalLink,
  Receipt,
  User,
  AlertCircle,
} from 'lucide-react';
import { PedidoDelivery, StatusPedidoDelivery, Supermercado } from '../types';
import { formatCurrency, formatTime } from '../utils/formatters';

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
  const [deliveryFilter, setDeliveryFilter] = useState<'todos' | 'novo' | 'em_preparo' | 'a_caminho' | 'entregue'>('todos');
  const [deliverySearch, setDeliverySearch] = useState<string>('');
  const [copiedDeliveryLink, setCopiedDeliveryLink] = useState(false);

  // PIN validation modal state
  const [validandoPinPedido, setValidandoPinPedido] = useState<PedidoDelivery | null>(null);
  const [pinDigitado, setPinDigitado] = useState('');
  const [erroPin, setErroPin] = useState('');

  // Copy Link (AtendeJá)
  const handleCopyDeliveryLink = () => {
    const slug = loja?.slug || loja?.id || 'loja_matriz_01';
    let url = `${window.location.origin}/?loja=${slug}`;
    if (loja?.marca) url += `&marca=${encodeURIComponent(loja.marca)}`;
    if (loja?.nome) url += `&nome=${encodeURIComponent(loja.nome)}`;
    navigator.clipboard.writeText(url);
    setCopiedDeliveryLink(true);
    setTimeout(() => setCopiedDeliveryLink(false), 2500);
  };

  // WhatsApp motoboy dispatch with Google Maps route (AtendeJá)
  const handleDespacharMotoboy = (pedido: PedidoDelivery) => {
    onAtualizarStatus(pedido.id, 'saiu_para_entrega');

    const end = pedido.enderecoEntrega;
    const enderecoCompleto = `${end.logradouro}, ${end.numero}${end.complemento ? ' - ' + end.complemento : ''}, ${end.bairro}, ${end.cidade}`;
    const linkMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`;

    const listaItens = (pedido.itens || [])
      .map((it) => `• ${it.quantidade}x ${it.nome} (R$ ${it.subtotal.toFixed(2)})`)
      .join('\n');

    const texto = `🛵 *PEDIDO DE DELIVERY #${pedido.numeroPedido}*\n\n` +
      `👤 *Cliente:* ${pedido.cliente.nome}\n` +
      `📱 *WhatsApp:* ${pedido.cliente.telefone}\n` +
      `📍 *Endereço:* ${enderecoCompleto}\n` +
      (end.referencia ? `🏷️ *Ref:* ${end.referencia}\n` : '') +
      `🗺️ *Rota Maps:* ${linkMaps}\n\n` +
      `📦 *Itens a Entregar:*\n${listaItens}\n\n` +
      `💳 *Forma de Pgto:* ${pedido.formaPagamento.toUpperCase()}\n` +
      (pedido.trocoPara ? `💵 *Troco para:* R$ ${pedido.trocoPara.toFixed(2)}\n` : '') +
      `💰 *Total a Cobrar:* R$ ${pedido.valorTotal.toFixed(2)}\n` +
      `🔐 *PIN de Confirmação:* O cliente fornecerá o PIN de 4 dígitos na entrega.`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  // Validate PIN Submit
  const handleValidarPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validandoPinPedido) return;

    const ok = onConfirmarEntregaPin(validandoPinPedido.id, pinDigitado);
    if (ok) {
      setValidandoPinPedido(null);
      setPinDigitado('');
      setErroPin('');
    } else {
      setErroPin('PIN incorreto! Confirme os 4 dígitos com o cliente ou motoboy.');
    }
  };

  // Delivery Counts (AtendeJá)
  const countNovosDelivery = useMemo(() => {
    return pedidos.filter((p) => p.status === 'pendente').length;
  }, [pedidos]);

  const countPreparoDelivery = useMemo(() => {
    return pedidos.filter((p) => p.status === 'em_separacao').length;
  }, [pedidos]);

  const countACaminhoDelivery = useMemo(() => {
    return pedidos.filter((p) => p.status === 'saiu_para_entrega').length;
  }, [pedidos]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return pedidos
      .filter((p) => {
        if (deliveryFilter === 'novo') return p.status === 'pendente';
        if (deliveryFilter === 'em_preparo') return p.status === 'em_separacao';
        if (deliveryFilter === 'a_caminho') return p.status === 'saiu_para_entrega';
        if (deliveryFilter === 'entregue') return p.status === 'entregue';
        return true;
      })
      .filter((p) => {
        if (!deliverySearch.trim()) return true;
        const q = deliverySearch.toLowerCase();
        const nome = (p.cliente.nome || '').toLowerCase();
        const fone = (p.cliente.telefone || '').toLowerCase();
        const rua = (p.enderecoEntrega.logradouro || '').toLowerCase();
        const bairro = (p.enderecoEntrega.bairro || '').toLowerCase();
        const id = p.numeroPedido.toString();
        return nome.includes(q) || fone.includes(q) || rua.includes(q) || bairro.includes(q) || id.includes(q);
      })
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [pedidos, deliveryFilter, deliverySearch]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl shadow-xs p-3.5 space-y-3 flex-1 flex flex-col text-stone-900 dark:text-slate-100">
      {/* Header da Coluna */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-lg">
            <Bike className="w-4 h-4" />
          </span>
          <h2 className="text-xs font-bold uppercase tracking-wider">
            Delivery / Pedidos de Casa
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Botão Copiar Link Cardápio */}
          <button
            type="button"
            onClick={handleCopyDeliveryLink}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer shadow-xs ${
              copiedDeliveryLink
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-300 border-stone-200 dark:border-slate-700'
            }`}
            title="Copiar link do cardápio online com marca e logo da loja para enviar no WhatsApp"
          >
            <Share2 className="w-3 h-3 text-amber-500" />
            <span>{copiedDeliveryLink ? 'Copiado!' : 'Link Cardápio'}</span>
          </button>

          {/* Botão Abrir Cardápio */}
          {onAbrirCardapioCliente && (
            <button
              type="button"
              onClick={onAbrirCardapioCliente}
              className="p-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700 rounded-lg text-[10px] cursor-pointer"
              title="Abrir Cardápio do Cliente no navegador"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          )}

          {countNovosDelivery > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-red-600 text-white rounded-full animate-pulse shadow-xs">
              {countNovosDelivery} {countNovosDelivery === 1 ? 'novo' : 'novos'}
            </span>
          )}
        </div>
      </div>

      {/* Status Chips (Exatamente como no AtendeJá) */}
      <div className="flex flex-wrap items-center gap-1 text-[11px] font-bold">
        <button
          type="button"
          onClick={() => setDeliveryFilter('todos')}
          className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
            deliveryFilter === 'todos'
              ? 'bg-stone-900 dark:bg-slate-800 text-white border-stone-900 dark:border-slate-700 shadow-2xs'
              : 'bg-stone-50 dark:bg-slate-950 text-stone-600 dark:text-slate-400 border-stone-200 dark:border-slate-800 hover:bg-stone-100 dark:hover:bg-slate-900'
          }`}
        >
          Todos ({pedidos.length})
        </button>

        <button
          type="button"
          onClick={() => setDeliveryFilter('novo')}
          className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
            deliveryFilter === 'novo'
              ? 'bg-red-600 text-white border-red-700 shadow-2xs'
              : 'bg-red-50 dark:bg-slate-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-100/70'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Novos ({countNovosDelivery})
        </button>

        <button
          type="button"
          onClick={() => setDeliveryFilter('em_preparo')}
          className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
            deliveryFilter === 'em_preparo'
              ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
              : 'bg-amber-50 dark:bg-slate-950 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900/50 hover:bg-amber-100/70'
          }`}
        >
          Preparo ({countPreparoDelivery})
        </button>

        <button
          type="button"
          onClick={() => setDeliveryFilter('a_caminho')}
          className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
            deliveryFilter === 'a_caminho'
              ? 'bg-purple-600 text-white border-purple-700 shadow-2xs'
              : 'bg-purple-50 dark:bg-slate-950 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-900/50 hover:bg-purple-100/70'
          }`}
        >
          A Caminho ({countACaminhoDelivery})
        </button>
      </div>

      {/* Quick Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 dark:text-slate-500" />
        <input
          type="text"
          value={deliverySearch}
          onChange={(e) => setDeliverySearch(e.target.value)}
          placeholder="Buscar cliente, rua, fone..."
          className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-xl text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-500 focus:outline-none transition"
        />
      </div>

      {/* Delivery Orders List */}
      <div className="space-y-2.5 max-h-[68vh] overflow-y-auto pr-1 flex-1">
        {filteredOrders.length === 0 ? (
          <div className="py-10 text-center text-stone-400 dark:text-slate-500 text-xs space-y-1.5">
            <Bike className="w-8 h-8 mx-auto opacity-40 text-purple-400" />
            <p className="font-semibold text-stone-600 dark:text-slate-400">Nenhum pedido de delivery encontrado.</p>
            <p className="text-[11px]">Novos pedidos de clientes aparecerão aqui automaticamente.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isNovo = order.status === 'pendente';
            const isPreparo = order.status === 'em_separacao';
            const isACaminho = order.status === 'saiu_para_entrega';
            const isEntregue = order.status === 'entregue';
            const isDelivery = order.tipo_pedido !== 'retirada';

            const endereco = `${order.enderecoEntrega.logradouro}, ${order.enderecoEntrega.numero} (${order.enderecoEntrega.bairro})`;
            const telefone = order.cliente.telefone;

            return (
              <div
                key={order.id}
                className={`p-3 rounded-xl border text-xs transition shadow-2xs space-y-2 relative ${
                  isNovo
                    ? 'bg-red-50/50 dark:bg-slate-950 border-2 border-red-500 ring-2 ring-red-500/20'
                    : isPreparo
                    ? 'bg-amber-50/40 dark:bg-slate-950 border-2 border-amber-400/90'
                    : isACaminho
                    ? 'bg-purple-50/30 dark:bg-slate-950 border-2 border-purple-500'
                    : 'bg-stone-50/70 dark:bg-slate-950 border border-stone-200 dark:border-slate-800'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-stone-900 dark:text-white">
                      #{order.numeroPedido}
                    </span>
                    {isDelivery ? (
                      <span className="px-1.5 py-0.5 text-[9px] font-black uppercase bg-purple-600 text-white rounded">
                        DELIVERY 🛵
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 text-[9px] font-black uppercase bg-amber-600 text-white rounded">
                        RETIRADA 🛍️
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  {isNovo && (
                    <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-red-600 text-white rounded-md animate-pulse">
                      ● NOVO
                    </span>
                  )}
                  {isPreparo && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-amber-500 text-white rounded-md flex items-center gap-1">
                      <Flame className="w-2.5 h-2.5" /> PREPARO
                    </span>
                  )}
                  {isACaminho && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-purple-600 text-white rounded-md flex items-center gap-1">
                      <Bike className="w-2.5 h-2.5" /> A CAMINHO
                    </span>
                  )}
                  {isEntregue && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-stone-700 text-stone-300 rounded-md">
                      ENTREGUE
                    </span>
                  )}
                </div>

                {/* Customer Info */}
                <div className="space-y-0.5 text-[11px] leading-tight">
                  <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1">
                    <User className="w-3 h-3 text-emerald-500" />
                    <span className="truncate">{order.cliente.nome || 'Cliente'}</span>
                  </div>
                  {telefone && (
                    <div className="text-stone-500 dark:text-slate-400 flex items-center gap-1">
                      <Phone className="w-2.5 h-2.5" />
                      <span>{telefone}</span>
                    </div>
                  )}
                  {isDelivery && (
                    <div className="text-stone-700 dark:text-slate-300 flex items-start gap-1">
                      <MapPin className="w-2.5 h-2.5 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-[10px] leading-tight font-medium truncate">{endereco}</span>
                    </div>
                  )}
                  <div className="text-[10px] text-stone-400 font-mono pt-0.5 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{order.hora}</span>
                  </div>
                </div>

                {/* Items mini list */}
                <div className="pt-1.5 border-t border-stone-200 dark:border-slate-800 space-y-1">
                  {order.itens.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-baseline text-[11px]">
                      <span className="truncate text-stone-800 dark:text-slate-200">
                        {it.quantidade}x {it.nome}
                      </span>
                      <span className="font-mono text-stone-600 dark:text-slate-400 text-[10px] ml-1">
                        {formatCurrency(it.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total & Action Buttons */}
                <div className="pt-1.5 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between gap-1">
                  <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
                    {formatCurrency(order.valorTotal)}
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Imprimir Comanda */}
                    {onImprimirComanda && (
                      <button
                        type="button"
                        onClick={() => onImprimirComanda(order)}
                        className="p-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-slate-200 rounded-lg text-xs transition cursor-pointer"
                        title="Imprimir comanda térmica"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-500" />
                      </button>
                    )}

                    {/* Botão Confirmar Pedido */}
                    {isNovo && (
                      <button
                        type="button"
                        onClick={() => onAtualizarStatus(order.id, 'em_separacao')}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs active:scale-95"
                        title="Aceitar pedido e dar baixa automática no estoque"
                      >
                        <Check className="w-3 h-3 text-amber-300" />
                        <span>Confirmar</span>
                      </button>
                    )}

                    {/* Botão Despachar Motoboy */}
                    {isPreparo && isDelivery && (
                      <button
                        type="button"
                        onClick={() => handleDespacharMotoboy(order)}
                        className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs active:scale-95"
                        title="Despachar para o motoboy com rota no Google Maps via WhatsApp"
                      >
                        <Bike className="w-3 h-3" />
                        <span>Despachar</span>
                      </button>
                    )}

                    {/* Botão Concluir Retirada */}
                    {isPreparo && !isDelivery && (
                      <button
                        type="button"
                        onClick={() => onAtualizarStatus(order.id, 'entregue')}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs active:scale-95"
                      >
                        <Check className="w-3 h-3" />
                        <span>Entregue</span>
                      </button>
                    )}

                    {/* Botão Validar PIN (A Caminho) */}
                    {isACaminho && (
                      <button
                        type="button"
                        onClick={() => {
                          setValidandoPinPedido(order);
                          setPinDigitado('');
                          setErroPin('');
                        }}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs active:scale-95"
                        title="Confirmar entrega digitando o PIN de 4 dígitos"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>Validar PIN</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Validação de PIN */}
      {validandoPinPedido && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold">Validar PIN da Entrega</h3>
              </div>
              <button
                type="button"
                onClick={() => setValidandoPinPedido(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
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
                className="w-full text-center tracking-widest text-2xl font-mono font-black p-3 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 focus:outline-none focus:border-amber-500"
              />

              {erroPin && (
                <div className="p-2 rounded-lg bg-red-900/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{erroPin}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setValidandoPinPedido(null)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={pinDigitado.length < 4}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-xl text-xs font-bold text-white shadow"
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
