import React, { useMemo } from 'react';
import {
  ItemEstoque,
  Supermercado,
  PedidoDelivery,
  ConfiguracaoDelivery,
  normalizarSlugLoja,
} from '../types';
import { CardapioClienteDeliveryModal } from './CardapioClienteDeliveryModal';
import { UnrecognizedLinkView } from './UnrecognizedLinkView';

export interface CustomerDeliveryViewProps {
  lojaSlug: string;
  lojas?: Supermercado[];
  estoque?: ItemEstoque[];
  onCriarPedido?: (pedido: PedidoDelivery) => void;
  pedidos?: PedidoDelivery[];
  configDelivery?: ConfiguracaoDelivery;
  obterFotoProduto?: (codigo: string, fotoFallback?: string) => string;
  obterNomeProduto?: (codigo: string, nomeFallback?: string) => string;
  onTrocarParaFuncionario?: () => void;
  carregando?: boolean;
}

const DEFAULT_CONFIG_DELIVERY: ConfiguracaoDelivery = {
  ativo: true,
  raioMaximoKm: 7,
  taxaEntregaFixa: 5.0,
  valorMinimoPedido: 15.0,
  pedidoMinimo: 15.0,
  tempoMinimoMinutos: 25,
  tempoMaximoMinutos: 45,
  tempoMedioMinutos: 35,
  aceitaPix: true,
  chavePix: '',
  aceitaCartaoEntrega: true,
  aceitaDinheiro: true,
  horarioAbertura: '08:00',
  horarioFechamento: '23:59',
  mensagemBoasVindas: 'Peça direto pelo nosso catálogo online e receba rapidinho em casa!',
  repeticoesAlerta: 3,
  aceitarAutomatico: false,
  imprimirAutomatico: false,
  larguraImpressao: '80mm',
};

export const CustomerDeliveryView: React.FC<CustomerDeliveryViewProps> = ({
  lojaSlug,
  lojas = [],
  estoque = [],
  onCriarPedido,
  pedidos = [],
  configDelivery,
  obterFotoProduto,
  obterNomeProduto,
  onTrocarParaFuncionario,
  carregando = false,
}) => {
  const lojaAtiva = useMemo(() => {
    const slugLimpo = (lojaSlug || '').trim().toLowerCase();
    if (!slugLimpo) return null;

    const encontrada = lojas.find(
      (l) =>
        l.id.toLowerCase() === slugLimpo ||
        (l.slug && l.slug.toLowerCase() === slugLimpo) ||
        normalizarSlugLoja(l.nome) === slugLimpo
    );

    if (encontrada) return encontrada;

    // Se a lista de lojas ainda não carregou, aguarda com fallback temporário
    if (lojas.length === 0 && carregando) {
      const params = new URLSearchParams(window.location.search);
      const nomeUrl = params.get('nome') || 'Catálogo Online & Delivery';
      const marcaUrl = params.get('marca') || '';

      return {
        id: lojaSlug,
        slug: lojaSlug,
        nome: nomeUrl,
        marca: marcaUrl,
        status: 'ativo',
      } as Supermercado;
    }

    return null;
  }, [lojaSlug, lojas, carregando]);

  if (!lojaAtiva) {
    return <UnrecognizedLinkView />;
  }

  return (
    <CardapioClienteDeliveryModal
      visivel={true}
      modoTelaCheia={true}
      onFechar={() => {}}
      estoque={estoque}
      loja={lojaAtiva}
      configDelivery={configDelivery || DEFAULT_CONFIG_DELIVERY}
      onCriarPedido={(novoPedido) => {
        if (onCriarPedido) onCriarPedido(novoPedido);
      }}
      pedidosExistentes={pedidos}
      obterFotoProduto={obterFotoProduto}
      obterNomeProduto={obterNomeProduto}
      carregando={carregando}
    />
  );
};

export default CustomerDeliveryView;
