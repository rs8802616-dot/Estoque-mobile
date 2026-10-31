import React, { useState, useMemo, useEffect } from 'react';
import {
  ItemEstoque,
  Supermercado,
  ConfiguracaoDelivery,
  PedidoDelivery,
  ItemPedidoDelivery,
  TaxaBairro,
} from '../types';
import { verificarStatusFuncionamentoDelivery } from '../utils/deliveryHorarios';
import { mascaraTelefone } from '../lib/mascaras';
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
  ArrowLeft,
  Copy,
  Check,
  Phone,
  Store,
  Send,
  Lock,
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
  modoTelaCheia?: boolean;
  obterFotoProduto?: (codigo: string, fotoFallback?: string) => string;
  obterNomeProduto?: (codigo: string, nomeFallback?: string) => string;
  carregando?: boolean;
}

interface ItemCarrinhoCliente {
  item: ItemEstoque;
  qtd: number;
}

const BAIRROS_PADRAO: TaxaBairro[] = [
  { id: 'b1', nome: 'Centro', bairro: 'Centro', taxa: 5.00, valor: 5.00 },
  { id: 'b2', nome: 'Jardim América', bairro: 'Jardim América', taxa: 7.00, valor: 7.00 },
  { id: 'b3', nome: 'Vila Nova', bairro: 'Vila Nova', taxa: 6.00, valor: 6.00 },
  { id: 'b4', nome: 'Bela Vista', bairro: 'Bela Vista', taxa: 6.50, valor: 6.50 },
  { id: 'b5', nome: 'Consolação', bairro: 'Consolação', taxa: 6.50, valor: 6.50 },
  { id: 'b6', nome: 'Pinheiros', bairro: 'Pinheiros', taxa: 8.00, valor: 8.00 },
  { id: 'b7', nome: 'Outro Bairro (Taxa Padrão)', bairro: 'Outro Bairro (Taxa Padrão)', taxa: 8.00, valor: 8.00 },
];

export const CardapioClienteDeliveryModal: React.FC<CardapioClienteDeliveryModalProps> = ({
  visivel,
  onFechar,
  estoque = [],
  loja,
  configDelivery,
  onCriarPedido,
  pedidosExistentes = [],
  onTrocarParaFuncionario,
  modoTelaCheia = false,
  obterFotoProduto,
  obterNomeProduto,
  carregando = false,
}) => {
  // Etapa atual: 'vitrine' | 'carrinho' | 'checkout' | 'rastreio' | 'meus_pedidos'
  const [etapa, setEtapa] = useState<'vitrine' | 'carrinho' | 'checkout' | 'rastreio' | 'meus_pedidos'>('vitrine');

  // Tipo de Pedido: 'delivery' ou 'retirada' (estilo AtendeJá)
  const [tipoPedido, setTipoPedido] = useState<'delivery' | 'retirada'>('delivery');

  // Pedido ativo em acompanhamento
  const [pedidoAtivoRastreio, setPedidoAtivoRastreio] = useState<PedidoDelivery | null>(null);

  // Sincroniza o pedido em acompanhamento em tempo real quando o status muda na loja/motoboy
  useEffect(() => {
    if (!pedidoAtivoRastreio) return;
    const atualizado = pedidosExistentes.find((p) => p.id === pedidoAtivoRastreio.id);
    if (
      atualizado &&
      (atualizado.status !== pedidoAtivoRastreio.status ||
        atualizado.motivoCancelamento !== pedidoAtivoRastreio.motivoCancelamento ||
        atualizado.entregueEmTimestamp !== pedidoAtivoRastreio.entregueEmTimestamp)
    ) {
      setPedidoAtivoRastreio(atualizado);
    }
  }, [pedidosExistentes, pedidoAtivoRastreio]);

  // Busca e categoria
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('todos');

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
      const salvo = localStorage.getItem('delivery_cliente_endereco');
      return salvo ? JSON.parse(salvo) : {
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: loja?.cidade || 'São Paulo',
        referencia: '',
      };
    } catch {
      return { logradouro: '', numero: '', complemento: '', bairro: '', cidade: loja?.cidade || 'São Paulo', referencia: '' };
    }
  });

  // Dados do cliente
  const [nomeCliente, setNomeCliente] = useState(() => localStorage.getItem('delivery_cliente_nome') || '');
  const [telefoneCliente, setTelefoneCliente] = useState(() => localStorage.getItem('delivery_cliente_telefone') || '');
  const [observacaoGeral, setObservacaoGeral] = useState('');

  // Carrinho do cliente
  const [carrinho, setCarrinho] = useState<Record<string, ItemCarrinhoCliente>>({});

  // Forma de pagamento
  const [formaPagamento, setFormaPagamento] = useState<'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro'>('pix');
  const [trocoPara, setTrocoPara] = useState<string>('');
  const [pixCopiado, setPixCopiado] = useState(false);

  // Calcula a taxa de entrega baseada no bairro selecionado e tipo de pedido
  const taxaEntregaCalculada = useMemo(() => {
    if (tipoPedido === 'retirada') return 0;
    const bairroEncontrado = listaBairros.find((b) => b.id === bairroSelecionadoId || (b.nome || b.bairro || '').toLowerCase() === (endereco.bairro || '').toLowerCase());
    if (bairroEncontrado) return Number(bairroEncontrado.taxa ?? bairroEncontrado.valor) || 0;
    return Number(configDelivery?.taxaEntregaFixa ?? loja?.taxa_entrega ?? 6.00) || 0;
  }, [tipoPedido, listaBairros, bairroSelecionadoId, endereco.bairro, configDelivery, loja]);

  // Atualizar bairro selecionado no endereço
  useEffect(() => {
    const bairroObj = listaBairros.find((b) => b.id === bairroSelecionadoId);
    const nomeBairro = bairroObj?.nome || bairroObj?.bairro || '';
    if (nomeBairro && !nomeBairro.includes('Outro')) {
      setEndereco((prev: any) => ({ ...prev, bairro: nomeBairro }));
    }
  }, [bairroSelecionadoId, listaBairros]);

  // Agrupa produtos por código de barras e nome normalizado (nunca duplica por lote diferente) e oculta esgotados
  const estoqueAgrupado = useMemo(() => {
    const mapaPorCodigo = new Map<string, ItemEstoque>();
    const mapaNomeParaChave = new Map<string, string>();
    const hojeIso = new Date().toISOString().slice(0, 10);

    estoque.forEach((p) => {
      if (!p) return;
      const codLimpo = String(p.codigo || p.codigo_barras || '').trim();
      const nomeResolvido = (obterNomeProduto ? obterNomeProduto(codLimpo, p.nome) : p.nome || '').trim();
      const fotoResolvida = (obterFotoProduto ? obterFotoProduto(codLimpo, p.foto) : p.foto || '').trim();
      const nomeChave = nomeResolvido.toLowerCase();

      const isIlimitado = Boolean(p.estoqueIlimitado || p.tipoCadastro === 'interno');
      // Se o lote estiver vencido (e não for produção contínua/ilimitado), não soma como saldo disponível para o cliente
      const loteVencido = !isIlimitado && p.validade && p.validade < hojeIso;
      const qtdValidaLote = loteVencido ? 0 : Math.max(0, Number(p.quantidade) || 0);

      // Determina chave única (une lotes de mesmo código ou de mesmo nome exato)
      let chave = codLimpo || nomeChave;
      if (!chave) return;
      if (!mapaPorCodigo.has(chave) && nomeChave && mapaNomeParaChave.has(nomeChave)) {
        chave = mapaNomeParaChave.get(nomeChave)!;
      }

      const existente = mapaPorCodigo.get(chave);
      if (!existente) {
        mapaPorCodigo.set(chave, {
          ...p,
          codigo: codLimpo || p.codigo,
          nome: nomeResolvido || p.nome,
          foto: fotoResolvida || p.foto,
          preco_venda: Number(p.preco_venda) || 0,
          preco_custo: Number(p.preco_custo) || 0,
          quantidade: isIlimitado ? 99999 : qtdValidaLote,
          estoqueIlimitado: isIlimitado,
        });
        if (nomeChave) {
          mapaNomeParaChave.set(nomeChave, chave);
        }
      } else {
        const ilimitadoCombinado = Boolean(existente.estoqueIlimitado || isIlimitado);
        mapaPorCodigo.set(chave, {
          ...existente,
          nome: existente.nome || nomeResolvido,
          foto: existente.foto || fotoResolvida,
          preco_venda: Number(existente.preco_venda) > 0 ? Number(existente.preco_venda) : (Number(p.preco_venda) || 0),
          quantidade: ilimitadoCombinado
            ? 99999
            : (Number(existente.quantidade) || 0) + qtdValidaLote,
          estoqueIlimitado: ilimitadoCombinado,
          tipoCadastro: ilimitadoCombinado ? 'interno' : existente.tipoCadastro,
        });
      }
    });

    // Filtra produtos esgotados (saldo <= 0) para que NUNCA apareçam para o cliente no cardápio
    return Array.from(mapaPorCodigo.values())
      .filter((item) => {
        const isIlimitado = Boolean(item.estoqueIlimitado || item.tipoCadastro === 'interno');
        return isIlimitado || (Number(item.quantidade) || 0) > 0;
      })
      .sort((a, b) =>
        (a.nome || '').localeCompare(b.nome || '', 'pt-BR', { sensitivity: 'base', numeric: true })
      );
  }, [estoque, obterFotoProduto, obterNomeProduto]);

  // Categorias únicas baseadas no estoque real
  const categoriasDisponiveis = useMemo(() => {
    const setCat = new Set<string>();
    estoqueAgrupado.forEach((p) => {
      if (p.categoria && p.categoria.trim()) {
        setCat.add(p.categoria.trim());
      }
    });
    return Array.from(setCat).sort();
  }, [estoqueAgrupado]);

  // Contadores por tipo no estilo do PDV
  const countInternos = useMemo(() => {
    return estoqueAgrupado.filter((p) => p.tipoCadastro === 'interno' || p.estoqueIlimitado).length;
  }, [estoqueAgrupado]);

  const countPadrao = useMemo(() => {
    return estoqueAgrupado.filter((p) => p.tipoCadastro !== 'interno' && !p.estoqueIlimitado).length;
  }, [estoqueAgrupado]);

  // Filtragem de produtos idêntica ao PDV
  const produtosDisponiveis = useMemo(() => {
    return estoqueAgrupado.filter((p) => {
      // Busca
      if (busca.trim()) {
        const b = busca.toLowerCase().trim();
        const bNormalized = b.replace(/[.\-_]/g, ' ');
        const nome = (p.nome || '').toLowerCase();
        const nomeNormalized = nome.replace(/[.\-_]/g, ' ');
        const marca = (p.marca || '').toLowerCase();
        const cod = (p.codigo || '').toLowerCase();
        if (!nome.includes(b) && !nomeNormalized.includes(bNormalized) && !marca.includes(b) && !cod.includes(b)) {
          return false;
        }
      }

      // Filtro de Categoria / Tipo (Igual ao PDV)
      if (categoriaSelecionada === 'todos') return true;
      if (categoriaSelecionada === 'interno') {
        return p.tipoCadastro === 'interno' || p.estoqueIlimitado;
      }
      if (categoriaSelecionada === 'padrao') {
        return p.tipoCadastro !== 'interno' && !p.estoqueIlimitado;
      }
      return p.categoria === categoriaSelecionada;
    });
  }, [estoqueAgrupado, busca, categoriaSelecionada]);

  // Adicionar ao carrinho respeitando o estoque disponível somado dos lotes
  const adicionarAoCarrinho = (item: ItemEstoque) => {
    const isIlimitado = Boolean(item.estoqueIlimitado || item.tipoCadastro === 'interno');
    const maxDisponivel = isIlimitado ? 99999 : (Number(item.quantidade) || 0);
    if (maxDisponivel <= 0) return;

    setCarrinho((prev) => {
      const atual = prev[item.codigo]?.qtd || 0;
      if (!isIlimitado && atual >= maxDisponivel) {
        alert(`⚠️ Quantidade máxima disponível em estoque atingida (${maxDisponivel} un).`);
        return prev;
      }
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
  const totalItensQtd: number = itensCarrinho.reduce((acc, cur) => acc + (Number(cur.qtd) || 0), 0);
  const subtotalCarrinho: number = itensCarrinho.reduce((acc, cur) => acc + ((Number(cur.item.preco_venda) || 0) * (Number(cur.qtd) || 0)), 0);
  const valorTotalFinal: number = subtotalCarrinho + (totalItensQtd > 0 ? (Number(taxaEntregaCalculada) || 0) : 0);

  // Copiar chave PIX
  const handleCopiarPix = (chave: string) => {
    navigator.clipboard.writeText(chave);
    setPixCopiado(true);
    setTimeout(() => setPixCopiado(false), 2500);
  };

  // Status de funcionamento do delivery (aberto/fechado por horário e botão)
  const statusLoja = useMemo(() => {
    return verificarStatusFuncionamentoDelivery(configDelivery);
  }, [configDelivery]);

  // Finalizar Pedido
  const handleFinalizarPedido = () => {
    if (!statusLoja.aberta) {
      alert(statusLoja.motivo || 'A loja está fechada para delivery no momento!');
      return;
    }
    if (!nomeCliente.trim() || !telefoneCliente.trim()) {
      alert('Por favor, informe seu nome e WhatsApp para contato.');
      return;
    }
    if (tipoPedido === 'delivery' && (!endereco.logradouro.trim() || !endereco.numero.trim() || !endereco.bairro.trim())) {
      alert('Por favor, preencha o endereço completo de entrega (Rua, Número e Bairro).');
      return;
    }
    if (subtotalCarrinho < (configDelivery.valorMinimoPedido || 0)) {
      alert(`O pedido mínimo desta loja é de R$ ${configDelivery.valorMinimoPedido.toFixed(2)}.`);
      return;
    }

    localStorage.setItem('delivery_cliente_nome', nomeCliente);
    localStorage.setItem('delivery_cliente_telefone', telefoneCliente);
    localStorage.setItem('delivery_cliente_endereco', JSON.stringify(endereco));
    localStorage.setItem('delivery_bairro_selecionado', bairroSelecionadoId);

    const pinGerado = Math.floor(1000 + Math.random() * 9000).toString();
    const numeroPedido = Math.floor(100 + Math.random() * 900);
    const agora = new Date();

    const itensPedido: ItemPedidoDelivery[] = itensCarrinho.map((c) => ({
      codigo: c.item.codigo,
      nome: c.item.nome,
      quantidade: c.qtd,
      preco_unitario: c.item.preco_venda,
      preco_custo: c.item.preco_custo || 0,
      subtotal: c.item.preco_venda * c.qtd,
      foto: c.item.foto,
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

  // Enviar pedido no WhatsApp da loja
  const handleEnviarPedidoWhatsAppLoja = (pedido: PedidoDelivery) => {
    const end = pedido.enderecoEntrega;
    const enderecoCompleto = pedido.tipo_pedido === 'retirada' 
      ? '🛍️ *RETIRADA NO BALCÃO DA LOJA*'
      : `${end.logradouro}, ${end.numero}${end.complemento ? ' - ' + end.complemento : ''}, ${end.bairro}`;

    const listaItens = (pedido.itens || [])
      .map((it) => `• ${it.quantidade}x ${it.nome} - R$ ${it.subtotal.toFixed(2)}`)
      .join('\n');

    const texto = `🛵 *NOVO PEDIDO DELIVERY #${pedido.numeroPedido}*\n\n` +
      `🏪 *Estabelecimento:* ${loja?.marca || loja?.nome || 'Supermercado'}\n` +
      `👤 *Cliente:* ${pedido.cliente.nome}\n` +
      `📱 *WhatsApp:* ${pedido.cliente.telefone}\n` +
      `📍 *Endereço:* ${enderecoCompleto}\n` +
      (end.referencia ? `🏷️ *Ref:* ${end.referencia}\n` : '') +
      (pedido.observacao ? `📝 *Obs:* ${pedido.observacao}\n` : '') +
      `\n📦 *Itens do Pedido:*\n${listaItens}\n\n` +
      `🛵 *Taxa de Entrega:* R$ ${pedido.taxaEntrega.toFixed(2)}\n` +
      `💰 *VALOR TOTAL:* R$ ${pedido.valorTotal.toFixed(2)}\n` +
      `💳 *Forma de Pagamento:* ${pedido.formaPagamento.toUpperCase()}\n` +
      (pedido.trocoPara ? `💵 *Troco para:* R$ ${pedido.trocoPara.toFixed(2)}\n` : '') +
      `\n🔐 *PIN de Segurança da Entrega:* ${pedido.codigoEntregaPin}\n` +
      `Aguardando confirmação e preparo!`;

    const foneLoja = (loja?.telefone || '5511999999999').replace(/\D/g, '');
    const url = `https://api.whatsapp.com/send?phone=${foneLoja}&text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  // Pedidos anteriores do cliente
  const pedidosDoCliente = useMemo(() => {
    return pedidosExistentes.filter((p) => {
      const matchNome = nomeCliente && p.cliente.nome.toLowerCase() === nomeCliente.toLowerCase();
      const matchFone = telefoneCliente && p.cliente.telefone.replace(/\D/g, '') === telefoneCliente.replace(/\D/g, '');
      return matchNome || matchFone;
    }).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [pedidosExistentes, nomeCliente, telefoneCliente]);

  if (!visivel) return null;

  return (
    <div
      className={
        modoTelaCheia
          ? 'fixed inset-0 flex flex-col bg-[#f1f5f9] overflow-hidden'
          : 'fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200'
      }
      style={{ zIndex: 10000000 }}
    >
      <div
        className={
          modoTelaCheia
            ? 'bg-[#f1f5f9] w-full h-full flex flex-col overflow-hidden text-stone-900'
            : 'bg-[#f1f5f9] border border-stone-200 rounded-3xl max-w-7xl w-full h-[94vh] max-h-[940px] flex flex-col shadow-2xl overflow-hidden text-stone-900'
        }
      >
        
        {/* HEADER MODERNO ESTILO PDV (OTIMIZADO PARA CELULAR E DESKTOP) */}
        <div className="bg-white border-b border-stone-200 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            {loja?.logo_url ? (
              <img
                src={loja.logo_url}
                alt={loja.nome}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl object-cover border border-stone-200 shadow-2xs shrink-0"
              />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black text-base sm:text-lg shrink-0">
                🛵
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="font-black text-sm sm:text-base text-stone-900 truncate leading-tight">
                  {loja?.marca || loja?.nome || 'Cardápio Digital'}
                </h1>
                <span className="hidden sm:inline-flex text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Aberto
                </span>
              </div>

              <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 text-[11px] text-stone-500 leading-tight mt-0.5">
                <span className="inline-flex sm:hidden items-center gap-1 text-[10px] font-extrabold text-emerald-700 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Aberto
                </span>
                <span className="sm:hidden text-stone-300">•</span>
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                  <span>{loja?.tempo_estimado_entrega || `${configDelivery.tempoMinimoMinutos || 25}-${configDelivery.tempoMaximoMinutos || 45} min`}</span>
                </span>
                <span className="text-stone-300">•</span>
                <span className="whitespace-nowrap font-medium text-stone-600">
                  Taxa: R$ {taxaEntregaCalculada.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Meus Pedidos */}
            <button
              type="button"
              onClick={() => setEtapa('meus_pedidos')}
              title="Meus Pedidos"
              className={`h-9 px-2.5 sm:px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                etapa === 'meus_pedidos'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Meus Pedidos</span>
              {pedidosDoCliente.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center">
                  {pedidosDoCliente.length}
                </span>
              )}
            </button>

            {/* Sacola / Carrinho */}
            <button
              type="button"
              onClick={() => setEtapa(etapa === 'carrinho' ? 'vitrine' : 'carrinho')}
              title="Sacola de Compras"
              className={`h-9 px-2.5 sm:px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                totalItensQtd > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Sacola</span>
              {totalItensQtd > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white text-emerald-800 text-[10px] font-black">
                  {totalItensQtd}
                </span>
              )}
            </button>

            {/* Fechar (Exibido apenas quando aberto como modal dentro do PDV) */}
            {!modoTelaCheia && (
              <button
                type="button"
                onClick={onFechar}
                className="w-9 h-9 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs transition flex items-center justify-center cursor-pointer"
                title="Fechar Cardápio"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* CORPO EXPANSIVO DO CARDÁPIO */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">

          {/* ======================================================== */}
          {/* ETAPA 1: VITRINE DE PRODUTOS NO FORMATO DO PDV           */}
          {/* ======================================================== */}
          {etapa === 'vitrine' && (
            <div className="space-y-3.5">

              {/* AVISO DE LOJA FECHADA / FORA DO HORÁRIO */}
              {!statusLoja.aberta && (
                <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3.5 text-rose-900 flex items-start gap-3 shadow-xs animate-fadeIn">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-rose-900">🔴 Loja Fechada no Momento</span>
                      <span className="text-[10px] font-bold bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full uppercase">
                        Fora do Horário
                      </span>
                    </div>
                    <p className="text-xs text-rose-800 mt-1 leading-snug">
                      {statusLoja.motivo}
                    </p>
                    <p className="text-[11px] text-rose-700 font-medium mt-1">
                      Você pode navegar pelo catálogo, mas o envio de novos pedidos está pausado até o início do atendimento.
                    </p>
                  </div>
                </div>
              )}

              {/* BARRA DE PESQUISA RÁPIDA (SEM AUTOFILL INDESEJADO) */}
              <div className="relative w-full">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-stone-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="search"
                  name="cardapio_pesquisa_cliente_input"
                  id="cardapio_pesquisa_cliente_input"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  readOnly
                  onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar produto por nome, marca ou código..."
                  className="w-full pl-10 pr-9 py-2.5 bg-white border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs transition"
                />
                {busca && (
                  <button
                    type="button"
                    onClick={() => setBusca('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* PILLS DE FILTROS IDÊNTICAS AO PDV */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setCategoriaSelecionada('todos')}
                  className={`px-3 py-1.5 rounded-2xl transition whitespace-nowrap cursor-pointer shrink-0 ${
                    categoriaSelecionada === 'todos'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  📦 Todos ({estoqueAgrupado.length})
                </button>

                {countInternos > 0 && (
                  <button
                    type="button"
                    onClick={() => setCategoriaSelecionada('interno')}
                    className={`px-3 py-1.5 rounded-2xl transition whitespace-nowrap cursor-pointer shrink-0 ${
                      categoriaSelecionada === 'interno'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100'
                    }`}
                  >
                    🍢 Balcão & Adega ({countInternos})
                  </button>
                )}

                {countPadrao > 0 && (
                  <button
                    type="button"
                    onClick={() => setCategoriaSelecionada('padrao')}
                    className={`px-3 py-1.5 rounded-2xl transition whitespace-nowrap cursor-pointer shrink-0 ${
                      categoriaSelecionada === 'padrao'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-sky-50 border border-sky-200 text-sky-900 hover:bg-sky-100'
                    }`}
                  >
                    🏷️ Industrial / EAN ({countPadrao})
                  </button>
                )}

                {categoriasDisponiveis.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoriaSelecionada(cat)}
                    className={`px-3 py-1.5 rounded-2xl transition whitespace-nowrap cursor-pointer shrink-0 ${
                      categoriaSelecionada === cat
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* GRID DE PRODUTOS IDÊNTICO AO FORMATO DO PDV (.grid-produtos / .card-produto) */}
              <div className="grid-produtos">
                {carregando && produtosDisponiveis.length === 0 ? (
                  <div
                    style={{
                      gridColumn: '1 / -1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '60px 20px',
                      textAlign: 'center',
                      color: '#57534e',
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        border: '4px solid #e7e5e4',
                        borderTopColor: '#059669',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '16px',
                      }}
                    />
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1c1917' }}>
                      Carregando cardápio da loja...
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#78716c', marginTop: '4px' }}>
                      Sincronizando produtos e fotos em tempo real
                    </div>
                  </div>
                ) : produtosDisponiveis.length === 0 ? (
                  <div className="vazio">
                    Nenhum produto encontrado nesta categoria. Tente buscar por outro termo ou selecione Todos.
                  </div>
                ) : (
                  produtosDisponiveis.map((prod, pIdx) => {
                    const qtdNoCarrinho = carrinho[prod.codigo]?.qtd || 0;
                    const isInternoCard = prod.tipoCadastro === 'interno' || prod.estoqueIlimitado;
                    const esgotado = !isInternoCard && (prod.quantidade || 0) <= 0;

                    return (
                      <div
                        key={`cli_card_${prod.codigo}_${pIdx}`}
                        className="card-produto"
                      >
                        <div
                          className="foto-produto"
                          onClick={() => {
                            if (!esgotado) adicionarAoCarrinho(prod);
                          }}
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
                              🛒 {qtdNoCarrinho} na sacola
                            </div>
                          )}
                        </div>

                        <div className="info-card">
                          <div>
                            <div
                              className="nome-prod"
                              onClick={() => {
                                if (!esgotado) adicionarAoCarrinho(prod);
                              }}
                            >
                              {prod.nome}
                            </div>
                            <div className="detalhe" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>{prod.categoria || prod.marca || `Cód: ${prod.codigo}`}</span>
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
                                  Balcão
                                </span>
                              )}
                            </div>
                          </div>

                          <div style={{ marginTop: '4px' }}>
                            <div className="detalhe">
                              {isInternoCard ? (
                                <span style={{ color: '#059669', fontWeight: 700 }}>
                                  ♾️ Disponível (Balcão)
                                </span>
                              ) : esgotado ? (
                                <span style={{ color: '#dc2626', fontWeight: 700 }}>
                                  Indisponível no momento
                                </span>
                              ) : (
                                <>
                                  Disponível: <b>{prod.quantidade} un</b>
                                </>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', gap: '4px', flexWrap: 'wrap' }}>
                              <div className="detalhe preco-destaque" style={{ whiteSpace: 'nowrap' }}>R$ {Number(prod.preco_venda).toFixed(2)}</div>

                              {esgotado ? (
                                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Esgotado</span>
                              ) : qtdNoCarrinho > 0 ? (
                                <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-0.5 font-black shadow-2xs shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => removerDoCarrinho(prod.codigo)}
                                    className="w-6 h-6 rounded-lg bg-white hover:bg-emerald-100 flex items-center justify-center text-emerald-800 transition cursor-pointer"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-xs px-1 font-mono">{qtdNoCarrinho}</span>
                                  <button
                                    type="button"
                                    onClick={() => adicionarAoCarrinho(prod)}
                                    className="w-6 h-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => adicionarAoCarrinho(prod)}
                                  style={{
                                    background: '#e0f2fe',
                                    color: '#0369a1',
                                    border: '1px solid #7dd3fc',
                                    borderRadius: '6px',
                                    padding: '4px 7px',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    whiteSpace: 'nowrap',
                                  }}
                                  title="Adicionar produto à sacola"
                                >
                                  <span>🛒</span>
                                  <span>+ Sacola</span>
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

              {/* BARRA FLUTUANTE DE FINALIZAÇÃO NO RODAPÉ */}
              {totalItensQtd > 0 && (
                <div className="sticky bottom-0 z-20 pt-2">
                  <div className="p-3.5 rounded-2xl bg-emerald-700 text-white shadow-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white text-emerald-800 font-black text-sm flex items-center justify-center shadow-xs">
                        {totalItensQtd}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-100 block leading-tight">
                          Total ({tipoPedido === 'retirada' ? 'Retirada' : 'com Entrega'}):
                        </span>
                        <span className="text-lg font-black font-mono leading-none">
                          R$ {valorTotalFinal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEtapa('carrinho')}
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
                    >
                      <span>Ver Carrinho</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* ETAPA 2: CARRINHO / SACOLA DO CLIENTE                    */}
          {/* ======================================================== */}
          {etapa === 'carrinho' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h2 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  <span>Sua Sacola ({totalItensQtd} itens)</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setEtapa('vitrine')}
                  className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  + Continuar Comprando
                </button>
              </div>

              {itensCarrinho.length > 0 ? (
                <div className="space-y-2.5">
                  {itensCarrinho.map(({ item, qtd }) => (
                    <div
                      key={item.codigo}
                      className="p-3 bg-white border border-stone-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.foto ? (
                          <img
                            src={item.foto}
                            alt=""
                            className="w-12 h-12 object-contain p-1 bg-stone-50 rounded-xl border border-stone-100 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-400 shrink-0">
                            Sem foto
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-stone-900 truncate">{item.nome}</h4>
                          <span className="text-xs text-emerald-700 font-black font-mono">
                            R$ {((Number(item.preco_venda) || 0) * (Number(qtd) || 0)).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-stone-100 px-2 py-1 rounded-xl shrink-0">
                        <button
                          type="button"
                          onClick={() => removerDoCarrinho(item.codigo)}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer shadow-2xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold font-mono w-4 text-center">{qtd}</span>
                        <button
                          type="button"
                          onClick={() => adicionarAoCarrinho(item)}
                          className="w-6 h-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Resumo Financeiro */}
                  <div className="p-4 bg-white border border-stone-200 rounded-2xl space-y-2 text-xs shadow-2xs">
                    <div className="flex justify-between text-stone-600">
                      <span>Subtotal Itens:</span>
                      <span className="font-mono font-bold">R$ {subtotalCarrinho.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Taxa de Entrega:</span>
                      <span className={`font-mono font-bold ${tipoPedido === 'retirada' ? 'text-emerald-700' : 'text-stone-800'}`}>
                        {tipoPedido === 'retirada' ? 'Grátis (Retirada)' : `+ R$ ${taxaEntregaCalculada.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-black text-base text-stone-900 pt-2 border-t border-stone-100">
                      <span>Total do Pedido:</span>
                      <span className="text-emerald-700 font-mono">R$ {valorTotalFinal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEtapa('checkout')}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>Ir para o Endereço & Pagamento</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-12 text-center text-stone-400 space-y-3 bg-white rounded-3xl border border-stone-200">
                  <ShoppingCart className="w-12 h-12 mx-auto text-stone-300" />
                  <p className="font-bold text-stone-700 text-sm">Sua sacola está vazia.</p>
                  <button
                    type="button"
                    onClick={() => setEtapa('vitrine')}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Escolher Produtos
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* ETAPA 3: CHECKOUT (ENDEREÇO & FORMA DE PAGAMENTO)         */}
          {/* ======================================================== */}
          {etapa === 'checkout' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h2 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>{tipoPedido === 'delivery' ? 'Dados para Entrega' : 'Dados para Retirada'}</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setEtapa('carrinho')}
                  className="text-xs font-bold text-stone-500 hover:underline cursor-pointer"
                >
                  Voltar ao Carrinho
                </button>
              </div>

              <div className="p-4 bg-white border border-stone-200 rounded-2xl space-y-3 text-xs shadow-2xs">
                {/* Nome e WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-600 block mb-1 font-bold">Seu Nome Completo:</label>
                    <input
                      type="text"
                      value={nomeCliente}
                      onChange={(e) => setNomeCliente(e.target.value)}
                      placeholder="Ex: Carlos Silva"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-stone-600 block mb-1 font-bold">WhatsApp para Contato:</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={telefoneCliente}
                      onChange={(e) => setTelefoneCliente(mascaraTelefone(e.target.value))}
                      placeholder="(00) 90000-0000"
                      maxLength={15}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Se for Delivery -> Campos de endereço */}
                {tipoPedido === 'delivery' ? (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="text-stone-600 block mb-1 font-bold">Rua / Avenida:</label>
                        <input
                          type="text"
                          value={endereco.logradouro}
                          onChange={(e) => setEndereco({ ...endereco, logradouro: e.target.value })}
                          placeholder="Ex: Rua das Flores"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-stone-600 block mb-1 font-bold">Número:</label>
                        <input
                          type="text"
                          value={endereco.numero}
                          onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
                          placeholder="123"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-stone-600 block mb-1 font-bold">Bairro (Taxa R$ {taxaEntregaCalculada.toFixed(2)}):</label>
                        <select
                          value={bairroSelecionadoId}
                          onChange={(e) => setBairroSelecionadoId(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-900 font-bold focus:outline-none focus:border-emerald-500"
                        >
                          {listaBairros.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.nome || b.bairro} (R$ {Number(b.taxa ?? b.valor ?? 0).toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-stone-600 block mb-1 font-bold">Complemento / Apto:</label>
                        <input
                          type="text"
                          value={endereco.complemento}
                          onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
                          placeholder="Apto 42 Bloco B"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-stone-600 block mb-1 font-bold">Ponto de Referência (opcional):</label>
                      <input
                        type="text"
                        value={endereco.referencia}
                        onChange={(e) => setEndereco({ ...endereco, referencia: e.target.value })}
                        placeholder="Próximo à padaria, portão branco..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                    <Store className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>
                      Você escolheu <strong>Retirar no Balcão</strong> da loja ({loja?.nome || 'Loja Física'}). Seu pedido estará pronto em aproximadamente 15-20 minutos!
                    </span>
                  </div>
                )}

                <div>
                  <label className="text-stone-600 block mb-1 font-bold">Observações do Pedido:</label>
                  <input
                    type="text"
                    value={observacaoGeral}
                    onChange={(e) => setObservacaoGeral(e.target.value)}
                    placeholder="Ex: Não tocar campainha, ligar quando chegar..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Formas de Pagamento */}
              <div className="p-4 bg-white border border-stone-200 rounded-2xl space-y-3 text-xs shadow-2xs">
                <span className="font-bold text-sm text-stone-900 block">Forma de Pagamento:</span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormaPagamento('pix')}
                    className={`p-3 rounded-xl border text-left font-bold transition flex items-center gap-2 cursor-pointer ${
                      formaPagamento === 'pix'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    <span className="text-base">⚡</span>
                    <div>
                      <div>PIX</div>
                      <span className="text-[10px] font-normal text-stone-500">Chave na tela</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormaPagamento('cartao_credito')}
                    className={`p-3 rounded-xl border text-left font-bold transition flex items-center gap-2 cursor-pointer ${
                      formaPagamento === 'cartao_credito'
                        ? 'bg-sky-50 border-sky-500 text-sky-800 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    <span className="text-base">💳</span>
                    <div>
                      <div>Cartão Crédito</div>
                      <span className="text-[10px] font-normal text-stone-500">Na maquininha</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormaPagamento('cartao_debito')}
                    className={`p-3 rounded-xl border text-left font-bold transition flex items-center gap-2 cursor-pointer ${
                      formaPagamento === 'cartao_debito'
                        ? 'bg-sky-50 border-sky-500 text-sky-800 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    <span className="text-base">💳</span>
                    <div>
                      <div>Cartão Débito</div>
                      <span className="text-[10px] font-normal text-stone-500">Na maquininha</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormaPagamento('dinheiro')}
                    className={`p-3 rounded-xl border text-left font-bold transition flex items-center gap-2 cursor-pointer ${
                      formaPagamento === 'dinheiro'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    <span className="text-base">💵</span>
                    <div>
                      <div>Dinheiro</div>
                      <span className="text-[10px] font-normal text-stone-500">No ato da entrega</span>
                    </div>
                  </button>
                </div>

                {formaPagamento === 'dinheiro' && (
                  <div className="pt-2">
                    <label className="text-stone-600 block mb-1 font-bold">Troco para quanto? (R$):</label>
                    <input
                      type="number"
                      value={trocoPara}
                      onChange={(e) => setTrocoPara(e.target.value)}
                      placeholder="Ex: 50.00 (deixe vazio se não precisar)"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-900"
                    />
                  </div>
                )}

                {formaPagamento === 'pix' && configDelivery.chavePix && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[10px] text-emerald-700 uppercase font-black">Chave PIX da Loja:</div>
                      <span className="font-mono font-bold truncate block">{configDelivery.chavePix}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopiarPix(configDelivery.chavePix || '')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {pixCopiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{pixCopiado ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Botão de Finalizar Pedido */}
              <button
                type="button"
                onClick={handleFinalizarPedido}
                disabled={!statusLoja.aberta}
                className={`w-full py-4 text-white font-black text-base rounded-2xl shadow-xl transition transform active:scale-98 ${
                  statusLoja.aberta
                    ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
                    : 'bg-rose-600 opacity-90 cursor-not-allowed'
                }`}
              >
                {statusLoja.aberta
                  ? `CONFIRMAR PEDIDO (R$ ${valorTotalFinal.toFixed(2)})`
                  : `🚫 LOJA FECHADA (${statusLoja.horarioFormatado})`}
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* ETAPA 4: RASTREIO DO PEDIDO AO VIVO (COM CÓDIGO PIN)     */}
          {/* ======================================================== */}
          {etapa === 'rastreio' && pedidoAtivoRastreio && (
            <div className="space-y-4 max-w-lg mx-auto text-center py-2">
              {pedidoAtivoRastreio.status === 'cancelado' ? (
                <>
                  <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center mx-auto border border-red-200">
                    <X className="w-10 h-10 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-red-600">
                      Pedido Cancelado pelo Estabelecimento
                    </span>
                    <h2 className="text-2xl font-black text-stone-900 mt-1 font-mono">
                      Pedido #{pedidoAtivoRastreio.numeroPedido}
                    </h2>
                    {pedidoAtivoRastreio.motivoCancelamento && (
                      <div className="mt-3 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
                        Motivo: {pedidoAtivoRastreio.motivoCancelamento}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700">
                      Pedido Recebido com Sucesso!
                    </span>
                    <h2 className="text-2xl font-black text-stone-900 mt-1 font-mono">
                      Pedido #{pedidoAtivoRastreio.numeroPedido}
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      Tempo estimado: <strong>{loja?.tempo_estimado_entrega || `${configDelivery.tempoMinimoMinutos || 25} a ${configDelivery.tempoMaximoMinutos || 45} min`}</strong>
                    </p>
                  </div>

                  {/* CARD DE DESTAQUE DO PIN DE ENTREGA (ESTILO ATENDEJÁ) */}
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-5 rounded-3xl text-white shadow-xl space-y-2">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-100">
                      <KeyRound className="w-4 h-4" />
                      <span>Código de Segurança (PIN de Entrega)</span>
                    </div>
                    <div className="text-4xl font-mono font-black tracking-widest py-1">
                      {pedidoAtivoRastreio.codigoEntregaPin}
                    </div>
                    <p className="text-xs text-emerald-100 font-medium">
                      Informe este código de 4 dígitos para o entregador para confirmar o recebimento!
                    </p>
                  </div>
                </>
              )}

              {/* BOTÃO ENVIAR PEDIDO NO WHATSAPP DA LOJA */}
              <button
                type="button"
                onClick={() => handleEnviarPedidoWhatsAppLoja(pedidoAtivoRastreio)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Confirmação no WhatsApp da Loja</span>
              </button>

              {/* LINHA DO TEMPO DO STATUS AO VIVO */}
              <div className="bg-white border border-stone-200 p-4 rounded-2xl text-left space-y-3 shadow-2xs">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Status do Pedido:
                </h4>

                {pedidoAtivoRastreio.status === 'cancelado' ? (
                  <div className="flex items-center gap-3 text-red-600 font-bold text-xs">
                    <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shrink-0">✕</div>
                    <span>Pedido cancelado ({pedidoAtivoRastreio.motivoCancelamento || 'Cancelado pelo estabelecimento'})</span>
                  </div>
                ) : (
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center gap-3 text-emerald-700 font-bold">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">✓</div>
                      <span>1. Pedido Recebido na Loja</span>
                    </div>

                    <div className={`flex items-center gap-3 ${pedidoAtivoRastreio.status !== 'pendente' ? 'text-amber-700 font-bold' : 'text-stone-400'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${pedidoAtivoRastreio.status !== 'pendente' ? 'bg-amber-500 text-white font-bold' : 'bg-stone-200 text-stone-500'}`}>
                        2
                      </div>
                      <span>2. Em Preparo e Separação</span>
                    </div>

                    <div className={`flex items-center gap-3 ${pedidoAtivoRastreio.status === 'saiu_para_entrega' || pedidoAtivoRastreio.status === 'entregue' ? 'text-purple-700 font-bold' : 'text-stone-400'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${pedidoAtivoRastreio.status === 'saiu_para_entrega' || pedidoAtivoRastreio.status === 'entregue' ? 'bg-purple-600 text-white font-bold' : 'bg-stone-200 text-stone-500'}`}>
                        3
                      </div>
                      <span>3. Motoboy a Caminho do Endereço</span>
                    </div>

                    <div className={`flex items-center gap-3 ${pedidoAtivoRastreio.status === 'entregue' ? 'text-emerald-700 font-bold' : 'text-stone-400'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${pedidoAtivoRastreio.status === 'entregue' ? 'bg-emerald-600 text-white font-bold' : 'bg-stone-200 text-stone-500'}`}>
                        4
                      </div>
                      <span>4. Entregue com Sucesso via PIN</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Resumo dos Itens */}
              <div className="p-4 bg-white border border-stone-200 rounded-2xl text-left space-y-2 text-xs shadow-2xs">
                <span className="font-bold text-stone-900 block">Itens do Pedido:</span>
                {pedidoAtivoRastreio.itens.map((it, i) => (
                  <div key={i} className="flex justify-between text-stone-700">
                    <span>{it.quantidade}x {it.nome}</span>
                    <span className="font-mono font-bold text-stone-900">R$ {Number(it.subtotal || 0).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total ({pedidoAtivoRastreio.tipo_pedido === 'retirada' ? 'Retirada' : 'com taxa'}):</span>
                  <span className="text-emerald-700 text-sm font-black font-mono">
                    R$ {Number(pedidoAtivoRastreio.valorTotal || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEtapa('vitrine')}
                className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Voltar ao Cardápio
              </button>

            </div>
          )}

          {/* ======================================================== */}
          {/* ETAPA 5: MEUS PEDIDOS ANTERIORES                          */}
          {/* ======================================================== */}
          {etapa === 'meus_pedidos' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h2 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span>Histórico de Pedidos</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setEtapa('vitrine')}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Voltar ao Cardápio
                </button>
              </div>

              {pedidosDoCliente.length === 0 ? (
                <div className="p-10 text-center text-stone-500 space-y-2 bg-white rounded-3xl border border-stone-200">
                  <Bike className="w-8 h-8 mx-auto opacity-40 text-emerald-600" />
                  <p className="font-bold text-stone-800 text-sm">Nenhum pedido recente encontrado.</p>
                  <p className="text-xs text-stone-400">Seus pedidos e PINs de entrega aparecerão aqui para fácil consulta.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pedidosDoCliente.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 bg-white border border-stone-200 rounded-2xl space-y-2 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-sm text-stone-900">
                          #{p.numeroPedido}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                          p.status === 'cancelado'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : p.status === 'pendente'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : p.status === 'em_separacao'
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : p.status === 'saiu_para_entrega'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                          {p.status === 'cancelado'
                            ? '✕ Cancelado'
                            : p.status === 'pendente'
                            ? '● Pendente'
                            : p.status === 'em_separacao'
                            ? '🔥 Em Preparo'
                            : p.status === 'saiu_para_entrega'
                            ? '🛵 A Caminho'
                            : '✓ Entregue'}
                        </span>
                      </div>

                      {p.status === 'cancelado' && p.motivoCancelamento && (
                        <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold">
                          Motivo: {p.motivoCancelamento}
                        </div>
                      )}

                      <div className="flex items-center justify-between bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                        <span className="text-emerald-900 font-bold">PIN de Entrega:</span>
                        <span className="font-mono font-black text-lg text-emerald-800 tracking-wider">
                          {p.codigoEntregaPin}
                        </span>
                      </div>

                      <div className="text-stone-500 text-[11px] font-mono">
                        Data: {p.data} às {p.hora} • Total: <strong className="text-stone-900">R$ {Number(p.valorTotal || 0).toFixed(2)}</strong>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setPedidoAtivoRastreio(p);
                          setEtapa('rastreio');
                        }}
                        className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-emerald-800 font-bold text-xs rounded-xl transition cursor-pointer"
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
