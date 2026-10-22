import React, { useState, useEffect, useMemo } from 'react';
import {
  PedidoDelivery,
  ConfiguracaoDelivery,
  StatusPedidoDelivery,
  ItemEstoque,
  Supermercado,
} from '../types';
import { tocarAlertaNovoPedidoDelivery } from '../lib/soundUtils';
import {
  X,
  Bike,
  Clock,
  MapPin,
  Phone,
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
  // Filtro de status estilo AtendeJá ('todos' | 'novo' | 'em_preparo' | 'a_caminho' | 'entregue')
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

  // Formulário de configurações da loja
  const [formConfig, setFormConfig] = useState<ConfiguracaoDelivery>(configDelivery);

  // Efeito sonoro: toda vez que houver pedidos com status 'pendente', toca o alarme de delivery
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

  if (!visivel) return null;

  // Contadores por status estilo AtendeJá
  const countNovos = pedidos.filter((p) => p.status === 'pendente').length;
  const countPreparo = pedidos.filter((p) => p.status === 'em_separacao').length;
  const countACaminho = pedidos.filter((p) => p.status === 'saiu_para_entrega').length;
  const countEntregues = pedidos.filter((p) => p.status === 'entregue').length;
  const countTotal = pedidos.length;

  // Filtragem dos pedidos estilo AtendeJá
  const filteredOrders = pedidos.filter((p) => {
    // Filtro por status
    if (pedidosFilterStatus === 'novo' && p.status !== 'pendente') return false;
    if (pedidosFilterStatus === 'em_preparo' && p.status !== 'em_separacao') return false;
    if (pedidosFilterStatus === 'a_caminho' && p.status !== 'saiu_para_entrega') return false;
    if (pedidosFilterStatus === 'entregue' && p.status !== 'entregue') return false;

    // Filtro por busca
    if (pedidosSearch.trim()) {
      const b = pedidosSearch.toLowerCase();
      const nomeMatch = p.cliente?.nome?.toLowerCase().includes(b);
      const foneMatch = p.cliente?.telefone?.toLowerCase().includes(b);
      const ruaMatch = p.enderecoEntrega?.logradouro?.toLowerCase().includes(b);
      const bairroMatch = p.enderecoEntrega?.bairro?.toLowerCase().includes(b);
      const numMatch = p.numeroPedido?.toString().includes(b);
      if (!nomeMatch && !foneMatch && !ruaMatch && !bairroMatch && !numMatch) return false;
    }

    return true;
  }).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  // Copiar link do cardápio para o cliente (estilo AtendeJá com slug da loja)
  const handleCopiarLinkCardapio = () => {
    const slug = lojaAtual?.slug || lojaAtual?.id || 'loja_matriz_01';
    let url = `${window.location.origin}/?loja=${slug}`;
    if (lojaAtual?.marca) url += `&marca=${encodeURIComponent(lojaAtual.marca)}`;
    if (lojaAtual?.nome) url += `&nome=${encodeURIComponent(lojaAtual.nome)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Gerador de mensagem para o Motoboy via WhatsApp (estilo AtendeJá)
  const gerarMensagemWhatsAppMotoboy = (pedido: PedidoDelivery) => {
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

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto"
      style={{ zIndex: 9999999 }}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* CABEÇALHO DO PAINEL DE DELIVERY ESTILO ATENDEJÁ */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25 text-white">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                  Gestão de Pedidos & Delivery
                </h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                    configDelivery.ativo
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${configDelivery.ativo ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                  {configDelivery.ativo ? 'Loja Aberta' : 'Loja Fechada'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Painel integrado de pedidos com impressão de comanda, rota no Maps e despacho
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Botão Copiar Link do Cardápio (AtendeJá) */}
            <button
              onClick={handleCopiarLinkCardapio}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs shadow transition cursor-pointer ${
                copiedLink
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/40'
              }`}
              title="Copiar link para enviar aos clientes no WhatsApp"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link Cardápio'}</span>
            </button>

            {/* Botão Abrir Cardápio */}
            <button
              onClick={onAbrirCardapioCliente}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
              title="Abrir o Cardápio do Cliente para testar ou criar pedidos"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver Cardápio</span>
            </button>

            {/* Simulação de Pedido Teste */}
            {onSimularNovoPedidoTeste && (
              <button
                onClick={onSimularNovoPedidoTeste}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition border border-slate-700 cursor-pointer"
                title="Cria um pedido de teste para testar o alarme e o fluxo"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Simular Pedido</span>
              </button>
            )}

            {/* Botão de Configurações */}
            <button
              onClick={() => setModalConfigAberta(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 cursor-pointer"
              title="Configurações de Taxa, Raio e Horários"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Fechar */}
            <button
              onClick={onFechar}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition border border-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BARRA DE FILTROS POR STATUS (EXATAMENTE COMO NO ATENDEJÁ) */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPedidosFilterStatus('todos')}
              className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 font-bold cursor-pointer ${
                pedidosFilterStatus === 'todos'
                  ? 'bg-slate-200 text-slate-950 border-white shadow-xs'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              TODOS ({countTotal})
            </button>

            <button
              type="button"
              onClick={() => setPedidosFilterStatus('novo')}
              className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 font-bold cursor-pointer ${
                pedidosFilterStatus === 'novo'
                  ? 'bg-red-700 text-white border-red-800 shadow-md'
                  : 'bg-slate-900 text-red-400 border-red-900/60 hover:bg-red-950/40'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              NOVOS ({countNovos})
            </button>

            <button
              type="button"
              onClick={() => setPedidosFilterStatus('em_preparo')}
              className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 font-bold cursor-pointer ${
                pedidosFilterStatus === 'em_preparo'
                  ? 'bg-amber-600 text-white border-amber-700 shadow-md'
                  : 'bg-slate-900 text-amber-400 border-amber-900/60 hover:bg-amber-950/40'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              EM PREPARO ({countPreparo})
            </button>

            <button
              type="button"
              onClick={() => setPedidosFilterStatus('a_caminho')}
              className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 font-bold cursor-pointer ${
                pedidosFilterStatus === 'a_caminho'
                  ? 'bg-purple-600 text-white border-purple-700 shadow-md'
                  : 'bg-slate-900 text-purple-400 border-purple-900/60 hover:bg-purple-950/40'
              }`}
            >
              <Bike className="w-3.5 h-3.5 text-purple-400" />
              A CAMINHO ({countACaminho})
            </button>

            <button
              type="button"
              onClick={() => setPedidosFilterStatus('entregue')}
              className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 font-bold cursor-pointer ${
                pedidosFilterStatus === 'entregue'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                  : 'bg-slate-900 text-emerald-400 border-emerald-900/60 hover:bg-emerald-950/40'
              }`}
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              ENTREGUES ({countEntregues})
            </button>
          </div>

          {/* Barra de Busca de Pedidos (AtendeJá) */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={pedidosSearch}
              onChange={(e) => setPedidosSearch(e.target.value)}
              placeholder="Buscar cliente, endereço, fone..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* GRID DOS CARDS DE PEDIDOS (EXATAMENTE COMO NO ATENDEJÁ) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <ChefHat className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-200">
                Nenhum pedido encontrado neste filtro.
              </p>
              <p className="text-xs text-slate-400">
                Novos pedidos recebidos via cardápio de delivery aparecerão aqui em tempo real com alarme sonoro.
              </p>
              {onSimularNovoPedidoTeste && (
                <button
                  onClick={onSimularNovoPedidoTeste}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow mt-2 cursor-pointer"
                >
                  Simular um Novo Pedido Agora
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => {
                const isNovo = order.status === 'pendente';
                const isPreparo = order.status === 'em_separacao';
                const isACaminho = order.status === 'saiu_para_entrega';
                const isEntregue = order.status === 'entregue';
                const isCancelado = order.status === 'cancelado';

                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl border transition shadow-xs flex flex-col justify-between overflow-hidden ${
                      isNovo
                        ? 'bg-red-950/20 border-2 border-red-500 ring-2 ring-red-500/20'
                        : isPreparo
                        ? 'bg-amber-950/20 border-2 border-amber-500'
                        : isACaminho
                        ? 'bg-purple-950/20 border-2 border-purple-500'
                        : isEntregue
                        ? 'bg-emerald-950/20 border-2 border-emerald-500'
                        : 'bg-slate-900/60 border border-slate-800 opacity-70'
                    }`}
                  >
                    {/* Header do Card (AtendeJá) */}
                    <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 text-xs font-black uppercase bg-purple-600 text-white rounded-lg flex items-center gap-1 shadow-xs">
                          <Bike className="w-3.5 h-3.5" /> DELIVERY
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-300">
                          #{order.numeroPedido}
                        </span>
                      </div>

                      {/* Status Badge */}
                      {isNovo && (
                        <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-red-600 text-white rounded-md animate-pulse">
                          ● NOVO PEDIDO
                        </span>
                      )}
                      {isPreparo && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-500 text-slate-950 rounded-md flex items-center gap-1 font-black">
                          <Flame className="w-3 h-3 text-slate-950" /> EM PREPARO
                        </span>
                      )}
                      {isACaminho && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-purple-600 text-white rounded-md flex items-center gap-1">
                          <Bike className="w-3 h-3" /> A CAMINHO
                        </span>
                      )}
                      {isEntregue && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-600 text-white rounded-md flex items-center gap-1">
                          <Check className="w-3 h-3" /> ENTREGUE
                        </span>
                      )}
                      {isCancelado && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-rose-800 text-white rounded-md">
                          CANCELADO
                        </span>
                      )}
                    </div>

                    {/* Body: Dados do Cliente e Itens (AtendeJá) */}
                    <div className="p-4 space-y-3 flex-1 text-xs">
                      {/* Bloco do Cliente */}
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                        <div className="font-bold text-white flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="text-emerald-400">👤</span>
                            <span>Cliente: {order.cliente.nome}</span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {order.hora}
                          </span>
                        </div>

                        <div className="text-slate-300 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <a
                            href={`https://wa.me/55${order.cliente.telefone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-400 hover:underline font-semibold"
                          >
                            {order.cliente.telefone}
                          </a>
                        </div>

                        <div className="text-slate-200 flex items-start gap-1 pt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight font-medium">
                            {order.enderecoEntrega.logradouro}, {order.enderecoEntrega.numero}
                            {order.enderecoEntrega.complemento && ` - ${order.enderecoEntrega.complemento}`} ({order.enderecoEntrega.bairro})
                            {order.enderecoEntrega.referencia && (
                              <span className="block text-[10px] text-amber-300/90 mt-0.5">
                                Ref: {order.enderecoEntrega.referencia}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Lista de Itens do Pedido */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Itens ({order.itens.length}):
                        </span>
                        <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                          {order.itens.map((it, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs bg-slate-950 p-2 rounded-lg border border-slate-800"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-amber-400">{it.quantidade}x</span>
                                <span className="text-slate-200 font-medium">{it.nome}</span>
                                {it.gelado && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                    Gelada ❄️
                                  </span>
                                )}
                              </div>
                              <span className="font-semibold text-slate-100">
                                R$ {it.subtotal.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Informações Financeiras & Pagamento */}
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>Subtotal: R$ {order.subtotal.toFixed(2)}</span>
                          <span>Taxa: +R$ {order.taxaEntrega.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-black text-white pt-1 border-t border-slate-850">
                          <span>Total:</span>
                          <span className="text-amber-400 text-base">
                            R$ {order.valorTotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                          <span>Pgto: <strong className="text-slate-200 uppercase">{order.formaPagamento}</strong></span>
                          {order.trocoPara && (
                            <span className="text-amber-300">Troco para: R$ {order.trocoPara.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                          <span>Código PIN:</span>
                          <span className="font-mono font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                            PIN: {order.codigoEntregaPin}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AÇÕES DE MUDANÇA DE STATUS (BOTÕES IDÊNTICOS AO ATENDEJÁ) */}
                    <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap gap-1.5">
                      {isNovo && (
                        <>
                          <button
                            type="button"
                            onClick={() => onAtualizarStatusPedido(order.id, 'em_separacao')}
                            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>Aceitar Pedido</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const motivo = prompt('Motivo do cancelamento:');
                              if (motivo) onAtualizarStatusPedido(order.id, 'cancelado', motivo);
                            }}
                            className="py-2.5 px-3 bg-slate-800 hover:bg-rose-900/60 text-rose-300 font-bold text-xs rounded-xl transition cursor-pointer"
                          >
                            Recusar
                          </button>
                        </>
                      )}

                      {isPreparo && (
                        <>
                          <button
                            type="button"
                            onClick={() => setComandaImpressao(order)}
                            className="py-2.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1 cursor-pointer"
                            title="Imprimir comanda para a separação"
                          >
                            <Printer className="w-4 h-4" />
                            <span>Comanda</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => gerarMensagemWhatsAppMotoboy(order)}
                            className="py-2.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1 cursor-pointer"
                            title="Enviar dados e rota para o WhatsApp do motoboy"
                          >
                            <span>📲 Rota</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onAtualizarStatusPedido(order.id, 'saiu_para_entrega')}
                            className="flex-1 py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Bike className="w-4 h-4" />
                            <span>Despachar</span>
                          </button>
                        </>
                      )}

                      {isACaminho && (
                        <button
                          type="button"
                          onClick={() => {
                            setPedidoParaValidarPin(order);
                            setPinDigitado('');
                            setErroPin('');
                          }}
                          className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <KeyRound className="w-4 h-4" />
                          <span>Validar PIN & Finalizar Entrega</span>
                        </button>
                      )}

                      {isEntregue && (
                        <div className="w-full text-center text-xs text-emerald-400 font-bold bg-emerald-950/40 py-2 rounded-xl border border-emerald-900/40 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Entrega finalizada com PIN validado!</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL DE IMPRESSÃO DE COMANDA ESTILO ATENDEJÁ */}
        {comandaImpressao && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            style={{ zIndex: 10000000 }}
          >
            <div className="bg-white text-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl font-mono text-xs space-y-3">
              <div className="text-center border-b border-dashed border-slate-400 pb-3">
                <h3 className="font-black text-sm uppercase tracking-wide">
                  {lojaAtual?.nome || 'COMANDA DE ENTREGA'}
                </h3>
                <p className="text-[10px] text-slate-600">PEDIDO #{comandaImpressao.numeroPedido}</p>
                <p className="text-[10px] text-slate-600">{comandaImpressao.data} - {comandaImpressao.hora}</p>
              </div>

              <div>
                <p><strong>Cliente:</strong> {comandaImpressao.cliente.nome}</p>
                <p><strong>Telefone:</strong> {comandaImpressao.cliente.telefone}</p>
                <p><strong>Endereço:</strong> {comandaImpressao.enderecoEntrega.logradouro}, {comandaImpressao.enderecoEntrega.numero}</p>
                <p><strong>Bairro:</strong> {comandaImpressao.enderecoEntrega.bairro}</p>
                {comandaImpressao.enderecoEntrega.referencia && (
                  <p><strong>Ref:</strong> {comandaImpressao.enderecoEntrega.referencia}</p>
                )}
              </div>

              <div className="border-t border-b border-dashed border-slate-400 py-2 space-y-1">
                <p className="font-bold">ITENS:</p>
                {comandaImpressao.itens.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{it.quantidade}x {it.nome}</span>
                    <span>R$ {it.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {comandaImpressao.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Entrega:</span>
                  <span>R$ {comandaImpressao.taxaEntrega.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-slate-300">
                  <span>TOTAL A COBRAR:</span>
                  <span>R$ {comandaImpressao.valorTotal.toFixed(2)}</span>
                </div>
                <p><strong>Forma:</strong> {comandaImpressao.formaPagamento.toUpperCase()}</p>
                {comandaImpressao.trocoPara && (
                  <p><strong>Levar troco para:</strong> R$ {comandaImpressao.trocoPara.toFixed(2)}</p>
                )}
                <p className="pt-2 text-center font-bold text-sm">
                  PIN DE CONFIRMAÇÃO: {comandaImpressao.codigoEntregaPin}
                </p>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-300">
                <button
                  type="button"
                  onClick={() => setComandaImpressao(null)}
                  className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
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
            className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            style={{ zIndex: 10000000 }}
          >
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Confirmar Entrega #{pedidoParaValidarPin.numeroPedido}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
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
                  className="w-36 text-center text-3xl font-mono font-bold tracking-widest bg-slate-800 border-2 border-amber-500/50 rounded-2xl p-2.5 text-amber-400 focus:outline-none focus:border-amber-400"
                  autoFocus
                />
                {erroPin && <p className="text-xs text-rose-400 mt-2">{erroPin}</p>}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPedidoParaValidarPin(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer"
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
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
                >
                  Validar & Concluir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE CONFIGURAÇÕES DE DELIVERY DA LOJA */}
        {modalConfigAberta && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
            style={{ zIndex: 10000000 }}
          >
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Configurações de Delivery da Loja</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalConfigAberta(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* Ligar / Desligar Loja */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div>
                    <span className="font-bold text-sm text-white block">Status da Loja no Delivery:</span>
                    <span className="text-slate-400">Permite que clientes façam pedidos online</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormConfig((prev) => ({ ...prev, ativo: !prev.ativo }))}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                      formConfig.ativo
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {formConfig.ativo ? '🟢 ABERTA' : '🔴 FECHADA'}
                  </button>
                </div>

                {/* Taxa de Entrega e Raio */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Taxa de Entrega Fixa (R$):</label>
                    <input
                      type="number"
                      step="0.50"
                      value={formConfig.taxaEntregaFixa}
                      onChange={(e) => setFormConfig((prev) => ({ ...prev, taxaEntregaFixa: Number(e.target.value) }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Raio Máximo Atendido (km):</label>
                    <input
                      type="number"
                      value={formConfig.raioMaximoKm}
                      onChange={(e) => setFormConfig((prev) => ({ ...prev, raioMaximoKm: Number(e.target.value) }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                    />
                  </div>
                </div>

                {/* Tempos Estimados e Pedido Mínimo */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Tempo Mín (min):</label>
                    <input
                      type="number"
                      value={formConfig.tempoMinimoMinutos}
                      onChange={(e) => setFormConfig((prev) => ({ ...prev, tempoMinimoMinutos: Number(e.target.value) }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Tempo Máx (min):</label>
                    <input
                      type="number"
                      value={formConfig.tempoMaximoMinutos}
                      onChange={(e) => setFormConfig((prev) => ({ ...prev, tempoMaximoMinutos: Number(e.target.value) }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Ped. Mínimo (R$):</label>
                    <input
                      type="number"
                      value={formConfig.valorMinimoPedido}
                      onChange={(e) => setFormConfig((prev) => ({ ...prev, valorMinimoPedido: Number(e.target.value) }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                    />
                  </div>
                </div>

                {/* Chave PIX da Loja */}
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Chave PIX da Loja (para pagamentos online):</label>
                  <input
                    type="text"
                    value={formConfig.chavePix || ''}
                    onChange={(e) => setFormConfig((prev) => ({ ...prev, chavePix: e.target.value }))}
                    placeholder="CNPJ, E-mail, Celular ou Chave Aleatória"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                  />
                </div>

                {/* Telefone / WhatsApp da Loja */}
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">WhatsApp da Loja para Suporte:</label>
                  <input
                    type="text"
                    value={formConfig.telefoneContatoLoja || ''}
                    onChange={(e) => setFormConfig((prev) => ({ ...prev, telefoneContatoLoja: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalConfigAberta(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSalvarConfig(formConfig);
                    setModalConfigAberta(false);
                  }}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 cursor-pointer"
                >
                  Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
