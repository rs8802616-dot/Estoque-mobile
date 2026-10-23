import React, { useMemo } from 'react';
import {
  ItemEstoque,
  Supermercado,
  PedidoDelivery,
  ConfiguracaoDelivery,
} from '../types';
import { CardapioClienteDeliveryModal } from './CardapioClienteDeliveryModal';

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
}

const DEFAULT_CONFIG_DELIVERY: ConfiguracaoDelivery = {
  ativo: true,
  taxaEntregaFixa: 5.0,
  pedidoMinimo: 15.0,
  tempoMedioMinutos: 35,
  aceitaPix: true,
  chavePix: '',
  aceitaCartaoEntrega: true,
  aceitaDinheiro: true,
  horarioAbertura: '08:00',
  horarioFechamento: '23:59',
  mensagemBoasVindas: 'Peça direto pelo nosso catálogo online e receba rapidinho em casa!',
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
}) => {
  const lojaAtiva = useMemo(() => {
    const slugLimpo = (lojaSlug || '').trim().toLowerCase();
    const encontrada =
      lojas.find(
        (l) =>
          l.id.toLowerCase() === slugLimpo ||
          (l.slug && l.slug.toLowerCase() === slugLimpo)
      ) ||
      lojas[0] ||
      null;

    if (encontrada) return encontrada;

    // Fallback com parâmetros da URL caso a lista de lojas ainda esteja carregando
    const params = new URLSearchParams(window.location.search);
    const nomeUrl = params.get('nome') || 'Catálogo Online & Delivery';
    const marcaUrl = params.get('marca') || '';

    return {
      id: lojaSlug || 'loja_matriz_01',
      slug: lojaSlug || 'loja_matriz_01',
      nome: nomeUrl,
      marca: marcaUrl,
      status: 'ativo',
    } as Supermercado;
  }, [lojaSlug, lojas]);

  return (
    <CardapioClienteDeliveryModal
      visivel={true}
      modoTelaCheia={true}
      onFechar={() => {
        const url = new URL(window.location.href);
        url.searchParams.delete('loja');
        url.searchParams.delete('loja_id');
        url.searchParams.delete('delivery');
        window.history.replaceState({}, '', url.pathname + url.search);
        if (onTrocarParaFuncionario) {
          onTrocarParaFuncionario();
        } else {
          window.location.href = '/';
        }
      }}
      estoque={estoque}
      loja={lojaAtiva}
      configDelivery={configDelivery || DEFAULT_CONFIG_DELIVERY}
      onCriarPedido={(novoPedido) => {
        if (onCriarPedido) onCriarPedido(novoPedido);
      }}
      pedidosExistentes={pedidos}
      obterFotoProduto={obterFotoProduto}
      obterNomeProduto={obterNomeProduto}
      onTrocarParaFuncionario={() => {
        const url = new URL(window.location.href);
        url.searchParams.delete('loja');
        url.searchParams.delete('loja_id');
        url.searchParams.delete('delivery');
        window.history.replaceState({}, '', url.pathname + url.search);
        if (onTrocarParaFuncionario) {
          onTrocarParaFuncionario();
        } else {
          window.location.href = '/';
        }
      }}
    />
  );
};

export default CustomerDeliveryView;
