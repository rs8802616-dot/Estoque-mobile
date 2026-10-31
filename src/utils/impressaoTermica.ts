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
