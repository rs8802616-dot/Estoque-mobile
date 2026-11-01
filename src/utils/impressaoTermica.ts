import { PedidoDelivery, Supermercado } from '../types';

/**
 * Utilitário universal para impressão de Cupons Térmicos e Comandas (80mm e 58mm).
 *
 * Utiliza um iframe isolado temporário para garantir que:
 * 1. O documento a ser impresso contenha APENAS o cupom (sem nenhum elemento da aplicação de fundo).
 * 2. Ocupe exatamente 1 página (ou fita contínua em impressora térmica), eliminando as 5 páginas em branco.
 * 3. As informações nunca sejam partidas entre duas páginas no início do cupom.
 * 4. Funcione perfeitamente em impressoras térmicas (Epson, Elgin, Bematech, POS-80, POS-58),
 *    emuladores/redirecionadores (AnyDesk Printer) e impressoras convencionais / Microsoft Print to PDF.
 */
export function imprimirCupomTermico(
  elementoOuId: HTMLElement | string,
  larguraBobina: '80mm' | '58mm' = '80mm',
  titulo: string = 'Cupom'
): void {
  const el: HTMLElement | null =
    typeof elementoOuId === 'string'
      ? document.getElementById(elementoOuId)
      : elementoOuId;

  if (!el) {
    window.print();
    return;
  }

  // Remove eventuais iframes anteriores que possam ter sobrado
  const idIframe = 'iframe-impressao-termica-isolado';
  const iframeExistente = document.getElementById(idIframe);
  if (iframeExistente) {
    try {
      iframeExistente.remove();
    } catch (e) {}
  }

  const iframe = document.createElement('iframe');
  iframe.id = idIframe;
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  iframe.style.visibility = 'hidden';
  iframe.style.zIndex = '-99999';

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    window.print();
    return;
  }

  const larguraPage = larguraBobina === '58mm' ? '58mm' : '80mm';
  const larguraUtil = larguraBobina === '58mm' ? '52mm' : '74mm';
  const tamanhoFonte = larguraBobina === '58mm' ? '10px' : '11.5px';

  // Conteúdo HTML do cupom
  const htmlConteudo = el.innerHTML;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <title>${titulo}</title>
      <style>
        @page {
          size: ${larguraPage} auto;
          margin: 0mm !important;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        html, body {
          width: ${larguraPage};
          max-width: ${larguraPage};
          margin: 0 auto !important;
          padding: 1.5mm 1mm 3mm 1mm !important;
          background: #ffffff !important;
          color: #000000 !important;
          font-family: 'Courier New', Courier, monospace !important;
          font-size: ${tamanhoFonte} !important;
          line-height: 1.25 !important;
          overflow: visible !important;
        }
        .cupom-termico-box, .cupom-wrapper {
          width: 100% !important;
          max-width: 100% !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .cupom-header, .cupom-totais, .cupom-footer {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .cupom-divisor {
          border-bottom: 1px dashed #000000 !important;
          height: 1px !important;
          margin: 4px 0 !important;
          display: block !important;
        }
        table {
          width: 100% !important;
          border-collapse: collapse !important;
          font-size: inherit !important;
          page-break-inside: auto;
        }
        tr {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        th, td {
          padding: 2px 0 !important;
          color: #000000 !important;
        }
        h4, p, span, strong {
          color: #000000 !important;
        }
        .no-print, button {
          display: none !important;
        }
      </style>
    </head>
    <body>
      <div class="cupom-wrapper">
        ${htmlConteudo}
      </div>
    </body>
    </html>
  `);
  doc.close();

  // Aguarda 150ms para os estilos e elementos serem completamente computados pelo navegador
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.warn('Falha na impressão via iframe, usando fallback:', err);
      window.print();
    } finally {
      // Remove o iframe do DOM após a conclusão do diálogo
      setTimeout(() => {
        try {
          iframe.remove();
        } catch (e) {}
      }, 1500);
    }
  }, 150);
}

/**
 * Imprime a comanda térmica oficial de um pedido de delivery (80mm ou 58mm).
 * Usada tanto na impressão manual quanto na impressão automática ao receber novos pedidos.
 */
export function imprimirComandaPedidoDelivery(
  pedido: PedidoDelivery,
  loja?: Supermercado | null,
  larguraBobina: '80mm' | '58mm' = '80mm'
): void {
  const container = document.createElement('div');
  container.className = 'cupom-termico-box';

  const formatarMoeda = (v: number) => `R$ ${(Number(v) || 0).toFixed(2).replace('.', ',')}`;

  container.innerHTML = `
    <div class="cupom-header" style="text-align: center; margin-bottom: 6px;">
      <h3 style="font-weight: 900; font-size: 13px; text-transform: uppercase; margin: 0 0 2px 0;">${loja?.nome || 'COMANDA DE ENTREGA'}</h3>
      ${loja?.cnpj ? `<p style="font-size: 10px; margin: 0;">CNPJ: ${loja.cnpj}</p>` : ''}
      ${loja?.telefone ? `<p style="font-size: 10px; margin: 0;">Tel: ${loja.telefone}</p>` : ''}
      <div class="cupom-divisor" style="border-bottom: 1px dashed #000; margin: 5px 0;"></div>
      <p style="font-weight: 900; font-size: 12px; margin: 2px 0;">PEDIDO #${pedido.numeroPedido || (pedido.id ? pedido.id.slice(-4).toUpperCase() : '0000')}</p>
      <p style="font-size: 10px; margin: 0;">${pedido.data || ''} - ${pedido.hora || ''}</p>
      <div class="cupom-divisor" style="border-bottom: 1px dashed #000; margin: 5px 0;"></div>
    </div>

    <div style="margin-bottom: 6px; font-size: 11px;">
      <p style="margin: 1px 0;"><strong>Cliente:</strong> ${pedido.cliente?.nome || 'Consumidor'}</p>
      <p style="margin: 1px 0;"><strong>WhatsApp:</strong> ${pedido.cliente?.telefone || '-'}</p>
      ${
        pedido.tipo_pedido !== 'retirada' && pedido.tipo_pedido !== 'mesa' && pedido.enderecoEntrega
          ? `
        <p style="margin: 1px 0;"><strong>Endereço:</strong> ${pedido.enderecoEntrega.logradouro || ''}, ${pedido.enderecoEntrega.numero || 'S/N'}</p>
        <p style="margin: 1px 0;"><strong>Bairro:</strong> ${pedido.enderecoEntrega.bairro || ''}</p>
        ${pedido.enderecoEntrega.complemento ? `<p style="margin: 1px 0;"><strong>Compl:</strong> ${pedido.enderecoEntrega.complemento}</p>` : ''}
        ${pedido.enderecoEntrega.referencia ? `<p style="margin: 1px 0;"><strong>Ref:</strong> ${pedido.enderecoEntrega.referencia}</p>` : ''}
      `
          : `
        <p style="margin: 1px 0; font-weight: bold;">MODALIDADE: ${pedido.tipo_pedido === 'retirada' ? 'RETIRADA NA LOJA' : 'CONSUMO LOCAL / MESA'}</p>
      `
      }
    </div>

    <div class="cupom-divisor" style="border-bottom: 1px dashed #000; margin: 5px 0;"></div>
    <div style="margin-bottom: 6px;">
      <p style="font-weight: bold; font-size: 11px; margin-bottom: 3px;">ITENS DO PEDIDO:</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
        <tbody>
          ${(pedido.itens || [])
            .map(
              (it) => `
            <tr>
              <td style="vertical-align: top; padding: 2px 0;">${it.quantidade}x ${it.nome}</td>
              <td style="text-align: right; vertical-align: top; padding: 2px 0; white-space: nowrap;">${formatarMoeda(it.subtotal)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <div class="cupom-divisor" style="border-bottom: 1px dashed #000; margin: 5px 0;"></div>
    <div class="cupom-totais" style="font-size: 11px;">
      <div style="display: flex; justify-content: space-between; margin: 1px 0;">
        <span>Subtotal:</span>
        <span>${formatarMoeda(pedido.subtotal)}</span>
      </div>
      ${
        pedido.taxaEntrega > 0
          ? `
        <div style="display: flex; justify-content: space-between; margin: 1px 0;">
          <span>Taxa Entrega:</span>
          <span>${formatarMoeda(pedido.taxaEntrega)}</span>
        </div>
      `
          : ''
      }
      <div style="display: flex; justify-content: space-between; font-weight: 900; font-size: 13px; border-top: 1px solid #000; padding-top: 3px; margin-top: 3px;">
        <span>TOTAL:</span>
        <span>${formatarMoeda(pedido.valorTotal)}</span>
      </div>
      <p style="margin-top: 4px;"><strong>Pagamento:</strong> ${String(pedido.formaPagamento || 'N/A').toUpperCase()}</p>
      ${pedido.trocoPara ? `<p style="margin: 1px 0;"><strong>Troco para:</strong> ${formatarMoeda(pedido.trocoPara)}</p>` : ''}
      ${
        pedido.codigoEntregaPin
          ? `
        <div style="margin-top: 6px; padding: 4px; border: 1.5px solid #000; text-align: center; font-weight: 900; font-size: 13px;">
          PIN DE ENTREGA: ${pedido.codigoEntregaPin}
        </div>
      `
          : ''
      }
    </div>

    <div class="cupom-divisor" style="border-bottom: 1px dashed #000; margin: 5px 0;"></div>
    <div class="cupom-footer" style="text-align: center; font-size: 9px; margin-top: 4px;">
      <p>Estoque Mobile - Gestão de Delivery</p>
      <p>Impresso em: ${new Date().toLocaleString('pt-BR')}</p>
    </div>
  `;

  imprimirCupomTermico(container, larguraBobina, `Comanda_Pedido_${pedido.numeroPedido || 'Delivery'}`);
}
