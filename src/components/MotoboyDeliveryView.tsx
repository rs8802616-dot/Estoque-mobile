import React, { useState, useEffect } from 'react';
import {
  Bike,
  Phone,
  MessageCircle,
  MapPin,
  Navigation,
  Copy,
  Check,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  ChevronLeft,
  X,
  KeyRound,
  Lock,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import { PedidoDelivery, StatusPedidoDelivery, Supermercado } from '../types';
import { formatCurrency } from '../utils/formatters';

interface MotoboyDeliveryViewProps {
  pedido: PedidoDelivery;
  loja?: Supermercado | null;
  onAtualizarStatus?: (pedidoId: string, novoStatus: StatusPedidoDelivery) => void;
  onConfirmarEntregaPin?: (pedidoId: string, pin: string) => boolean;
}

export const MotoboyDeliveryView: React.FC<MotoboyDeliveryViewProps> = ({
  pedido,
  loja,
  onAtualizarStatus,
  onConfirmarEntregaPin,
}) => {
  const [copiouEndereco, setCopiouEndereco] = useState(false);
  const [chegouNoLocal, setChegouNoLocal] = useState(pedido.chegouAoEndereco || false);
  const [modalPinAberto, setModalPinAberto] = useState(false);
  const [pinDigitado, setPinDigitado] = useState('');
  const [erroPin, setErroPin] = useState('');
  const [entregaSucesso, setEntregaSucesso] = useState(pedido.status === 'entregue');

  // Regra LGPD: O link do motoboy é desativado após 3 minutos da confirmação da entrega
  const EXPIRACAO_MINUTOS = 3;
  const EXPIRACAO_MS = EXPIRACAO_MINUTOS * 60 * 1000;

  const [entregueTimestamp, setEntregueTimestamp] = useState<number | null>(() => {
    if (pedido.entregueEmTimestamp) return pedido.entregueEmTimestamp;
    if (typeof window !== 'undefined') {
      const salvo = localStorage.getItem(`motoboy_entregue_ts_${pedido.numeroPedido}`);
      if (salvo) return Number(salvo);
      if (pedido.status === 'entregue') {
        const agora = Date.now();
        localStorage.setItem(`motoboy_entregue_ts_${pedido.numeroPedido}`, String(agora));
        return agora;
      }
    }
    return null;
  });

  const [tempoRestanteSegundos, setTempoRestanteSegundos] = useState<number>(() => {
    if (!entregueTimestamp) return EXPIRACAO_MINUTOS * 60;
    const diff = Math.floor((entregueTimestamp + EXPIRACAO_MS - Date.now()) / 1000);
    return Math.max(0, diff);
  });

  useEffect(() => {
    if (!entregueTimestamp) return;

    const timer = setInterval(() => {
      const diff = Math.floor((entregueTimestamp + EXPIRACAO_MS - Date.now()) / 1000);
      if (diff <= 0) {
        setTempoRestanteSegundos(0);
        clearInterval(timer);
      } else {
        setTempoRestanteSegundos(diff);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [entregueTimestamp]);

  const end = pedido.enderecoEntrega;
  const enderecoCompleto = `${end.logradouro}, ${end.numero}${end.complemento ? ' ' + end.complemento : ''}, ${end.bairro}, ${end.cidade || ''}`;
  const telefoneLimpo = (pedido.cliente.telefone || '').replace(/\D/g, '');

  const handleCopiarEndereco = () => {
    navigator.clipboard.writeText(enderecoCompleto);
    setCopiouEndereco(true);
    setTimeout(() => setCopiouEndereco(false), 2000);
  };

  const handleAbrirGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enderecoCompleto)}`;
    window.open(url, '_blank');
  };

  const handleAbrirWhatsApp = () => {
    const texto = `Olá ${pedido.cliente.nome}, aqui é o entregador da loja ${loja?.nome || ''}! Estou a caminho do seu endereço com o seu pedido #${pedido.numeroPedido}.`;
    window.open(`https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(texto)}`, '_blank');
  };

  const handleLigarCliente = () => {
    window.location.href = `tel:${telefoneLimpo}`;
  };

  const handleChegueiAoEndereco = () => {
    setChegouNoLocal(true);
  };

  const handleConfirmarEntregaClick = () => {
    if (pedido.status === 'entregue' || entregaSucesso) return;
    setModalPinAberto(true);
    setPinDigitado('');
    setErroPin('');
  };

  const registrarConclusaoEntrega = () => {
    const agora = Date.now();
    setEntregaSucesso(true);
    setEntregueTimestamp(agora);
    setTempoRestanteSegundos(EXPIRACAO_MINUTOS * 60);
    setModalPinAberto(false);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`motoboy_entregue_ts_${pedido.numeroPedido}`, String(agora));
        const salvoPedido = localStorage.getItem(`motoboy_pedido_${pedido.numeroPedido}`);
        if (salvoPedido) {
          const p = JSON.parse(salvoPedido);
          p.status = 'entregue';
          p.entregueEmTimestamp = agora;
          localStorage.setItem(`motoboy_pedido_${pedido.numeroPedido}`, JSON.stringify(p));
        }
      } catch {}
    }
  };

  const handleFinalizarEntregaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onConfirmarEntregaPin) {
      if (pinDigitado.length !== 4) {
        setErroPin('Digite o PIN de 4 dígitos informado pelo cliente.');
        return;
      }
      const ok = onConfirmarEntregaPin(pedido.id, pinDigitado);
      if (ok) {
        registrarConclusaoEntrega();
      } else {
        setErroPin('PIN incorreto! Solicite o código ao cliente.');
      }
    } else if (onAtualizarStatus) {
      onAtualizarStatus(pedido.id, 'entregue');
      registrarConclusaoEntrega();
    } else {
      registrarConclusaoEntrega();
    }
  };

  const isEntregue = pedido.status === 'entregue' || entregaSucesso;
  const isExpirado = Boolean(entregueTimestamp && tempoRestanteSegundos <= 0);

  // Formatação do tempo restante mm:ss
  const minRestantes = Math.floor(tempoRestanteSegundos / 60);
  const segRestantes = tempoRestanteSegundos % 60;
  const timerTexto = `${String(minRestantes).padStart(2, '0')}:${String(segRestantes).padStart(2, '0')}`;

  // TELA DE LINK EXPIRADO (PROTEÇÃO LGPD APÓS 3 MINUTOS)
  if (isExpirado) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col items-center justify-center p-4 text-center select-none font-sans">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-slate-200 shadow-xl space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-700 mx-auto flex items-center justify-center border-2 border-slate-200">
            <Lock className="w-8 h-8 text-slate-700" />
          </div>

          <div className="space-y-1">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide inline-block">
              ✓ Entrega Finalizada
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight pt-1">
              Link Desativado
            </h1>
            <p className="text-xs font-mono font-bold text-slate-500">
              Pedido #{pedido.numeroPedido} • {loja?.nome || 'Filial'}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1.5 text-left">
            <div className="flex items-center gap-1.5 font-black text-amber-800">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-700" />
              <span>Privacidade & LGPD</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800/90">
              Por segurança e proteção da privacidade do cliente, este link foi <strong>desativado automaticamente 3 minutos</strong> após a confirmação da entrega.
            </p>
            <p className="text-[10px] text-amber-700 pt-0.5 font-medium">
              Os dados de contato, endereço e itens do cliente não estão mais acessíveis.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                if (window.opener) {
                  window.close();
                } else {
                  window.location.href = '/';
                }
              }}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
            >
              Concluir e Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans select-none pb-56">
      {/* 1. BARRA SUPERIOR (HEADER) */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
            title="Voltar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center border border-orange-200 shrink-0">
            <Bike className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <h1 className="text-sm font-black text-slate-900 tracking-tight truncate">
              ENTREGADOR #{pedido.numeroPedido}
            </h1>
            <p className="text-[11px] text-slate-500 font-medium truncate">
              {loja?.nome || 'Filial — Shopping'}
            </p>
          </div>
        </div>

        <div>
          {isEntregue ? (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span className="font-mono">{timerTexto}</span>
            </span>
          ) : (
            <span className="bg-amber-50 text-amber-700 border border-amber-300 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs animate-pulse">
              <Bike className="w-3.5 h-3.5" />
              <span>A CAMINHO</span>
            </span>
          )}
        </div>
      </header>

      {/* 2. CONTEÚDO PRINCIPAL (CARDS EMPILHADOS ESTILO ATENDEJÁ) */}
      <main className="max-w-md w-full mx-auto p-4 space-y-3.5 flex-1">
        
        {/* SUCESSO DE ENTREGA (BANNER COM CONTAGEM REGRESSIVA LGPD) */}
        {isEntregue && (
          <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-md space-y-2.5 animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 text-white shrink-0" />
              <div>
                <h2 className="font-black text-sm">Entrega Concluída com Sucesso!</h2>
                <p className="text-xs text-emerald-100">
                  O pedido foi finalizado e baixado no sistema da loja.
                </p>
              </div>
            </div>

            <div className="bg-emerald-600/70 border border-emerald-400/40 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-100 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                <span>Link desativa em (LGPD):</span>
              </span>
              <span className="font-mono font-black text-white bg-black/25 px-2.5 py-0.5 rounded-lg text-xs tracking-wider">
                ⏱️ {timerTexto}
              </span>
            </div>
          </div>
        )}

        {/* CARD 1: CLIENTE */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
              <span className="text-lg">👤</span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                CLIENTE
              </span>
              <h2 className="text-base font-black text-slate-900 truncate">
                {pedido.cliente.nome || 'Cliente'}
              </h2>
              <p className="text-xs font-mono text-slate-500">
                {pedido.cliente.telefone}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleAbrirWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleLigarCliente}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition cursor-pointer active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Ligar</span>
            </button>
          </div>
        </div>

        {/* CARD 2: ENDEREÇO DE ENTREGA COM MINI MAPA */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
            ENDEREÇO DE ENTREGA
          </span>

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-black text-slate-900 leading-tight">
                  {end.logradouro}, {end.numero}
                  {end.complemento ? ` - ${end.complemento}` : ''}
                </p>
                <p className="text-xs text-slate-600">
                  Bairro: <strong className="text-slate-800">{end.bairro || 'Centro'}</strong>
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
                    🏠 Residencial
                  </span>
                  {end.referencia && (
                    <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200 truncate max-w-[200px]">
                      Ref: {end.referencia}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Miniatura do Mapa (Estilo AtendeJá) */}
            <div
              onClick={handleAbrirGoogleMaps}
              className="w-20 h-16 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-1 cursor-pointer shrink-0 hover:border-blue-400 transition relative overflow-hidden group"
              title="Abrir no Google Maps"
            >
              <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-600 flex items-center justify-center animate-bounce">
                <MapPin className="w-3.5 h-3.5 fill-red-600" />
              </div>
              <span className="text-[9px] font-black text-blue-600 mt-1 flex items-center gap-0.5 underline">
                Ver no mapa
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={handleAbrirGoogleMaps}
              className="py-2.5 px-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95"
            >
              <Navigation className="w-4 h-4 fill-white" />
              <span>Navegar Google Maps</span>
            </button>

            <button
              type="button"
              onClick={handleCopiarEndereco}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 shadow-2xs transition cursor-pointer active:scale-95"
            >
              {copiouEndereco ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiouEndereco ? 'Copiado!' : 'Copiar endereço'}</span>
            </button>
          </div>
        </div>

        {/* CARD 3: COBRANÇA */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-700 tracking-wider uppercase flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>COBRANÇA</span>
            </span>

            <span className="bg-slate-100 text-slate-800 text-[11px] font-black px-2.5 py-0.5 rounded-lg border border-slate-200 uppercase">
              ◆ {pedido.formaPagamento.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">
                Total a cobrar
              </span>
              <span className="text-2xl font-black text-emerald-600 font-mono tracking-tight">
                {formatCurrency(pedido.valorTotal)}
              </span>
              {pedido.trocoPara && pedido.formaPagamento === 'dinheiro' && (
                <span className="text-[11px] text-amber-700 font-bold block mt-0.5">
                  Troco p/ {formatCurrency(pedido.trocoPara)}
                </span>
              )}
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>A receber</span>
              </span>
              <p className="text-[10px] text-emerald-700 leading-tight mt-0.5">
                Confirmar com o cliente na entrega.
              </p>
            </div>
          </div>
        </div>

        {/* CARD 4: ITENS DO PEDIDO */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-purple-700 tracking-wider uppercase">
              ITENS DO PEDIDO ({pedido.itens.length})
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              Ver detalhes &gt;
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {pedido.itens.map((it, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="min-w-0 pr-2">
                  <span className="text-slate-800 font-medium truncate block">
                    <strong className="text-slate-900 mr-1.5 font-black">{it.quantidade}x</strong>
                    {it.nome}
                    {it.gelado && (
                      <span className="ml-1.5 text-[9px] px-1 py-0.2 rounded bg-cyan-100 text-cyan-800">
                        ❄️
                      </span>
                    )}
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900 shrink-0">
                  {formatCurrency(it.subtotal)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* 3. BARRA INFERIOR FIXA COM BOTÕES DE CHEGADA E CONFIRMAÇÃO (ESTILO ATENDEJÁ) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 z-40 shadow-lg">
        <div className="max-w-md mx-auto space-y-2">
          
          {/* Linha superior: Chegou no local */}
          {!isEntregue && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-medium">
                Chegou no local? Confirme que está no endereço do cliente.
              </span>
              <button
                type="button"
                onClick={handleChegueiAoEndereco}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                  chegouNoLocal
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
                <span>{chegouNoLocal ? 'No endereço' : 'Cheguei ao endereço'}</span>
              </button>
            </div>
          )}

          {/* Botão Principal Verde Gigante */}
          {isEntregue ? (
            <div className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>Entrega Finalizada!</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-black bg-emerald-700/80 px-2.5 py-1 rounded-xl">
                <Clock className="w-3.5 h-3.5" />
                <span>Expira em {timerTexto}</span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConfirmarEntregaClick}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-sm flex items-center justify-between shadow-md transition cursor-pointer active:scale-98"
            >
              <div className="flex items-center gap-2 text-left">
                <Bike className="w-5 h-5 text-emerald-200" />
                <div>
                  <span className="block leading-tight text-sm font-black">
                    Confirmar entrega
                  </span>
                  <span className="text-[10px] text-emerald-200 font-medium block">
                    Finalize apenas ao entregar o pedido.
                  </span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-200" />
            </button>
          )}
        </div>
      </div>

      {/* 4. MODAL DE CONFIRMAÇÃO DE PIN PELO MOTOBOY */}
      {modalPinAberto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">
                Confirmar Entrega #{pedido.numeroPedido}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Solicite o PIN de 4 dígitos ao cliente <strong>{pedido.cliente.nome}</strong>:
              </p>
            </div>

            <form onSubmit={handleFinalizarEntregaSubmit} className="space-y-3">
              <input
                type="text"
                autoFocus
                maxLength={4}
                value={pinDigitado}
                onChange={(e) => setPinDigitado(e.target.value.replace(/\D/g, ''))}
                placeholder="0000"
                className="w-36 text-center text-3xl font-mono font-black tracking-widest bg-slate-50 border-2 border-emerald-500 text-emerald-800 rounded-2xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />

              {erroPin && (
                <p className="text-xs text-rose-500 font-semibold">{erroPin}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalPinAberto(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={pinDigitado.length < 4}
                  className="flex-1 py-2.5 bg-[#059669] hover:bg-[#047857] disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
