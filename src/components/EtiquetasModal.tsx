import React, { useMemo, useState } from 'react';
import {
  LayoutGrid,
  ListPlus,
  Minus,
  Palette,
  Plus,
  Printer,
  Search,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { ItemEstoque, Supermercado } from '../types';
import { useVoltarHierarquico } from '../hooks/useVoltarHierarquico';

interface EtiquetasModalProps {
  visivel: boolean;
  onFechar: () => void;
  estoque: ItemEstoque[];
  loja: Supermercado | null;
}

interface SegmentoBarra {
  x: number;
  w: number;
}

function escHtml(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatarPrecoEtiqueta(valor: unknown): string {
  return (Number(valor) || 0).toFixed(2).replace('.', ',');
}

function gerarBarrasSvg(codigo: string): SegmentoBarra[] {
  const texto = String(codigo || '000000000000').trim() || '000000000000';
  const barras: SegmentoBarra[] = [
    { x: 2, w: 1.6 },
    { x: 5, w: 1.6 },
  ];
  let cursor = 9;
  const maxCursor = 111;
  let i = 0;

  while (cursor < maxCursor) {
    const ch = texto.charCodeAt(i % texto.length) + i * 7;
    const largura = (ch % 3) + 1.1;
    const espaco = ((ch >> 2) % 3) + 1.2;
    if (cursor + largura > maxCursor) break;
    barras.push({ x: Number(cursor.toFixed(1)), w: Number(largura.toFixed(1)) });
    cursor += largura + espaco;
    i += 1;
  }

  barras.push({ x: 113.4, w: 1.6 }, { x: 116.4, w: 1.6 });
  return barras;
}

function gerarHtmlBarrasSvg(codigo: string): string {
  const rects = gerarBarrasSvg(codigo)
    .map((b) => `<rect x="${b.x}" y="0" width="${b.w}" height="22" fill="#0f172a" />`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 22" preserveAspectRatio="none" style="width:100%;height:20px;display:block;">${rects}</svg>`;
}

export const EtiquetasModal: React.FC<EtiquetasModalProps> = ({
  visivel,
  onFechar,
  estoque,
  loja,
}) => {
  const [itensSelecionados, setItensSelecionados] = useState<
    { item: ItemEstoque; copias: number }[]
  >([]);
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const [estiloEtiqueta, setEstiloEtiqueta] = useState<'oferta' | 'classica'>('oferta');
  const [colunasImpressao, setColunasImpressao] = useState<2 | 3>(3);

  // Agrupa produtos únicos pelo código para não duplicar na lista de seleção
  const produtosUnicos = useMemo(() => {
    const mapa = new Map<string, ItemEstoque>();
    estoque.forEach((it) => {
      if (it.codigo && !mapa.has(it.codigo)) {
        mapa.set(it.codigo, it);
      }
    });
    return Array.from(mapa.values());
  }, [estoque]);

  const categoriasDisponiveis = useMemo(() => {
    const set = new Set<string>();
    produtosUnicos.forEach((p) => {
      const cat = String(p.categoria || '').trim();
      if (cat) set.add(cat);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [produtosUnicos]);

  useVoltarHierarquico(visivel, onFechar);

  if (!visivel) return null;

  const termoBusca = busca.trim().toLowerCase();
  const estoqueFiltrado = produtosUnicos.filter((p) => {
    if (categoriaFiltro !== 'todas' && String(p.categoria || '').trim() !== categoriaFiltro) {
      return false;
    }
    if (!termoBusca) return true;
    return (
      p.nome.toLowerCase().includes(termoBusca) ||
      p.codigo.toLowerCase().includes(termoBusca) ||
      String(p.codigo_barras || '').toLowerCase().includes(termoBusca)
    );
  });

  const copiasPorCodigo = new Map<string, number>();
  itensSelecionados.forEach((sel) => {
    copiasPorCodigo.set(sel.item.codigo, (copiasPorCodigo.get(sel.item.codigo) || 0) + sel.copias);
  });

  const totalEtiquetas = itensSelecionados.reduce((acc, i) => acc + i.copias, 0);

  const handleAdicionarEtiqueta = (item: ItemEstoque) => {
    setItensSelecionados((prev) => {
      const idx = prev.findIndex((i) => i.item.codigo === item.codigo);
      if (idx === -1) return [...prev, { item, copias: 1 }];
      return prev.map((entry, i) =>
        i === idx ? { ...entry, copias: entry.copias + 1 } : entry
      );
    });
  };

  const handleIncluirFiltrados = () => {
    const lote = estoqueFiltrado.slice(0, 40);
    if (lote.length === 0) return;

    setItensSelecionados((prev) => {
      const codigosExistentes = new Set(prev.map((e) => e.item.codigo));
      const novos = lote.filter((p) => !codigosExistentes.has(p.codigo));
      if (novos.length > 0) {
        return [...prev, ...novos.map((item) => ({ item, copias: 1 }))];
      }
      const codigosLote = new Set(lote.map((p) => p.codigo));
      return prev.map((entry) =>
        codigosLote.has(entry.item.codigo) ? { ...entry, copias: entry.copias + 1 } : entry
      );
    });
  };

  const handleAlterarCopias = (index: number, delta: number) => {
    setItensSelecionados((prev) =>
      prev
        .map((entry, idx) => (idx === index ? { ...entry, copias: entry.copias + delta } : entry))
        .filter((entry) => entry.copias > 0)
    );
  };

  const handleRemoverDaFila = (index: number) => {
    setItensSelecionados((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleImprimirEtiquetas = () => {
    if (itensSelecionados.length === 0) return;

    const nomeLojaSeguro = escHtml(loja?.nome || 'SUPERMERCADO');
    const isOferta = estiloEtiqueta === 'oferta';
    const etiquetasExpandidas = itensSelecionados.flatMap((itemObj) =>
      Array.from({ length: itemObj.copias }).map(() => itemObj.item)
    );

    const htmlCards = etiquetasExpandidas
      .map((item) => {
        const codigoTexto = item.codigo_barras || item.codigo || '';
        return `
          <div class="etiqueta">
            <div class="etiqueta-topo">
              <span class="etiqueta-loja">${nomeLojaSeguro}</span>
              ${isOferta ? '<span class="etiqueta-selo">OFERTA</span>' : ''}
            </div>
            <div class="etiqueta-nome">${escHtml(item.nome)}</div>
            <div class="etiqueta-preco">
              <span class="etiqueta-rs">R$</span>
              <span class="etiqueta-valor">${formatarPrecoEtiqueta(item.preco_venda)}</span>
            </div>
            <div class="etiqueta-rodape">
              ${gerarHtmlBarrasSvg(codigoTexto)}
              <div class="etiqueta-cod">${escHtml(codigoTexto)}</div>
            </div>
          </div>
        `;
      })
      .join('');

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      iframe.remove();
      window.print();
      return;
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>Etiquetas de Prateleira — ${nomeLojaSeguro}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: Arial, Helvetica, sans-serif;
            background: #ffffff;
            color: #0f172a;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(${colunasImpressao}, minmax(0, 1fr));
            gap: 4mm;
          }
          .etiqueta {
            border: 1.5px solid #0f172a;
            border-radius: 3mm;
            overflow: hidden;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            break-inside: avoid;
            page-break-inside: avoid;
            min-height: ${colunasImpressao === 2 ? '50mm' : '42mm'};
          }
          .etiqueta-topo {
            background: ${isOferta ? '#0f172a' : '#f1f5f9'};
            color: ${isOferta ? '#ffffff' : '#334155'};
            padding: 1.5mm 2.5mm;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 2mm;
            border-bottom: 1px solid ${isOferta ? '#0f172a' : '#cbd5e1'};
          }
          .etiqueta-loja {
            font-size: 7pt;
            font-weight: 800;
            text-transform: uppercase;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .etiqueta-selo {
            background: #facc15;
            color: #0f172a;
            font-size: 6.5pt;
            font-weight: 900;
            padding: 0.4mm 1.5mm;
            border-radius: 1mm;
            flex-shrink: 0;
          }
          .etiqueta-nome {
            padding: 2mm 2.5mm 1mm 2.5mm;
            font-size: ${colunasImpressao === 2 ? '9.5pt' : '8.5pt'};
            font-weight: 700;
            line-height: 1.2;
            text-align: center;
            color: #0f172a;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .etiqueta-preco {
            margin: 1mm 2.5mm;
            padding: 1.8mm 2mm;
            border-radius: 2mm;
            background: ${isOferta ? '#facc15' : '#ffffff'};
            border: ${isOferta ? '1px solid #eab308' : '1.5px solid #0f172a'};
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: 1.5mm;
            color: #0f172a;
          }
          .etiqueta-rs {
            font-size: ${colunasImpressao === 2 ? '11pt' : '9.5pt'};
            font-weight: 800;
          }
          .etiqueta-valor {
            font-size: ${colunasImpressao === 2 ? '22pt' : '18pt'};
            font-weight: 900;
            line-height: 1;
            font-family: monospace;
          }
          .etiqueta-rodape {
            padding: 1.2mm 2.5mm 1.8mm 2.5mm;
            text-align: center;
          }
          .etiqueta-cod {
            font-family: monospace;
            font-size: 7pt;
            color: #334155;
            margin-top: 0.6mm;
            letter-spacing: 0.5px;
          }
        </style>
      </head>
      <body>
        <div class="grid">${htmlCards}</div>
      </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      const limpar = () => {
        try {
          iframe.remove();
        } catch {}
      };
      try {
        if (iframe.contentWindow) {
          iframe.contentWindow.onafterprint = limpar;
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        }
      } catch {
        window.print();
      } finally {
        setTimeout(limpar, 15000);
      }
    }, 150);
  };

  // Lista de preview (itens da fila ou exemplo didático quando vazia)
  const itemExemplo: ItemEstoque = produtosUnicos[0] || {
    codigo: '7891000100103',
    nome: 'Exemplo de Produto na Gôndola',
    quantidade: 10,
    lote: 'L1',
    validade: '',
    preco_venda: 19.9,
  };

  const itensPreview =
    itensSelecionados.length > 0
      ? itensSelecionados.flatMap((itemObj) =>
          Array.from({ length: itemObj.copias }).map((_, cIdx) => ({
            key: `${itemObj.item.codigo}-${cIdx}`,
            item: itemObj.item,
          }))
        )
      : [{ key: 'exemplo', item: itemExemplo }];

  const isOferta = estiloEtiqueta === 'oferta';

  return (
    <div
      className="modal-overlay"
      style={{ zIndex: 100200, padding: '14px' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div
        className="modal-container"
        style={{
          maxWidth: '1080px',
          width: '96%',
          maxHeight: '92vh',
          padding: 0,
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#ffffff',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.25)',
        }}
      >
        {/* CABEÇALHO FIXO */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 20px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#fef3c7',
                color: '#b45309',
                border: '1px solid #fde68a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Tag size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.2,
                }}
              >
                Gerador e Impressor de Etiquetas de Prateleira
              </h3>
              <div
                style={{
                  fontSize: '0.76rem',
                  color: '#475569',
                  marginTop: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <span>
                  <strong style={{ color: '#0f172a' }}>{loja?.nome || 'Loja'}</strong> •{' '}
                  {produtosUnicos.length} produtos disponíveis
                </span>
                <span
                  style={{
                    padding: '1px 8px',
                    borderRadius: '999px',
                    background: totalEtiquetas > 0 ? '#dcfce7' : '#e2e8f0',
                    color: totalEtiquetas > 0 ? '#166534' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                  }}
                >
                  {totalEtiquetas} etiqueta(s) na fila
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-fechar-modal"
            onClick={onFechar}
            aria-label="Fechar gerador de etiquetas"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* CORPO RESPONSIVO EM 2 COLUNAS */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
              gap: '18px',
              alignItems: 'start',
            }}
          >
            {/* COLUNA ESQUERDA: 1. ESCOLHER PRODUTOS */}
            <div
              style={{
                background: '#f8fafc',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                  1. Escolher Produtos do Estoque
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                  {estoqueFiltrado.length} encontrado(s)
                </span>
              </div>

              {/* Busca */}
              <div style={{ position: 'relative' }}>
                <Search
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="search"
                  name="busca_etiquetas_prateleira"
                  autoComplete="off"
                  placeholder="Buscar por nome ou código de barras..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 30px 8px 32px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    fontSize: '0.82rem',
                  }}
                />
                {busca && (
                  <button
                    type="button"
                    onClick={() => setBusca('')}
                    aria-label="Limpar busca"
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Categoria + Incluir Filtrados */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <select
                  value={categoriaFiltro}
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                  style={{
                    flex: '1 1 160px',
                    padding: '7px 9px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#334155',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <option value="todas">Todas as categorias ({produtosUnicos.length})</option>
                  {categoriasDisponiveis.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={estoqueFiltrado.length === 0}
                  onClick={handleIncluirFiltrados}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 10px',
                    borderRadius: '8px',
                    border: '1px solid #0284c7',
                    background: '#e0f2fe',
                    color: '#0369a1',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: estoqueFiltrado.length === 0 ? 'not-allowed' : 'pointer',
                    opacity: estoqueFiltrado.length === 0 ? 0.5 : 1,
                  }}
                  title="Adicionar os produtos visíveis na lista (até 40 por clique)"
                >
                  <ListPlus size={14} />
                  <span>Incluir filtrados ({Math.min(40, estoqueFiltrado.length)})</span>
                </button>
              </div>

              {/* Lista de produtos */}
              <div
                style={{
                  maxHeight: '48vh',
                  overflowY: 'auto',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  background: '#ffffff',
                }}
              >
                {estoqueFiltrado.length === 0 ? (
                  <div
                    style={{
                      padding: '28px 16px',
                      textAlign: 'center',
                      color: '#64748b',
                      fontSize: '0.82rem',
                    }}
                  >
                    Nenhum produto encontrado neste filtro.
                  </div>
                ) : (
                  estoqueFiltrado.map((prod, idx) => {
                    const qtdNaFila = copiasPorCodigo.get(prod.codigo) || 0;
                    return (
                      <div
                        key={`etiq_prod_${prod.codigo}_${idx}`}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderBottom: '1px solid #f1f5f9',
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              fontSize: '0.84rem',
                              fontWeight: 700,
                              color: '#0f172a',
                              lineHeight: 1.25,
                              wordBreak: 'break-word',
                            }}
                          >
                            {prod.nome}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '6px',
                              marginTop: '3px',
                              fontSize: '0.74rem',
                            }}
                          >
                            <span style={{ color: '#64748b', fontFamily: 'monospace' }}>
                              Cód: {prod.codigo}
                            </span>
                            <span style={{ fontWeight: 800, color: '#0284c7' }}>
                              R$ {formatarPrecoEtiqueta(prod.preco_venda)}
                            </span>
                            {qtdNaFila > 0 && (
                              <span
                                style={{
                                  padding: '1px 6px',
                                  borderRadius: '999px',
                                  background: '#dcfce7',
                                  color: '#166534',
                                  fontWeight: 800,
                                  fontSize: '0.68rem',
                                }}
                              >
                                {qtdNaFila}x na fila
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAdicionarEtiqueta(prod)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '7px 11px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#16a34a',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.76rem',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            cursor: 'pointer',
                          }}
                        >
                          <Plus size={14} />
                          <span>Incluir</span>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* COLUNA DIREITA: 2. FILA + PRÉ-VISUALIZAÇÃO A4 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Card Fila + Opções de Layout */}
              <div
                style={{
                  background: '#f8fafc',
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                    2. Fila e Configuração ({totalEtiquetas} un)
                  </h4>

                  {itensSelecionados.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setItensSelecionados([])}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 9px',
                        borderRadius: '7px',
                        border: '1px solid #fecaca',
                        background: '#fef2f2',
                        color: '#dc2626',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={12} />
                      <span>Limpar fila</span>
                    </button>
                  )}
                </div>

                {/* Seletores de Estilo & Colunas na Folha A4 */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '9px',
                      padding: '8px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginBottom: '5px',
                      }}
                    >
                      <Palette size={12} />
                      <span>Estilo Visual</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setEstiloEtiqueta('oferta')}
                        style={{
                          padding: '5px 6px',
                          borderRadius: '6px',
                          border:
                            estiloEtiqueta === 'oferta'
                              ? '1.5px solid #ca8a04'
                              : '1px solid #cbd5e1',
                          background: estiloEtiqueta === 'oferta' ? '#fef08a' : '#ffffff',
                          color: '#0f172a',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Oferta
                      </button>
                      <button
                        type="button"
                        onClick={() => setEstiloEtiqueta('classica')}
                        style={{
                          padding: '5px 6px',
                          borderRadius: '6px',
                          border:
                            estiloEtiqueta === 'classica'
                              ? '1.5px solid #0f172a'
                              : '1px solid #cbd5e1',
                          background: estiloEtiqueta === 'classica' ? '#0f172a' : '#ffffff',
                          color: estiloEtiqueta === 'classica' ? '#ffffff' : '#334155',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Clássica
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '9px',
                      padding: '8px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginBottom: '5px',
                      }}
                    >
                      <LayoutGrid size={12} />
                      <span>Folha A4</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setColunasImpressao(3)}
                        style={{
                          padding: '5px 6px',
                          borderRadius: '6px',
                          border:
                            colunasImpressao === 3 ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                          background: colunasImpressao === 3 ? '#e0f2fe' : '#ffffff',
                          color: colunasImpressao === 3 ? '#0369a1' : '#334155',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        3 p/ linha
                      </button>
                      <button
                        type="button"
                        onClick={() => setColunasImpressao(2)}
                        style={{
                          padding: '5px 6px',
                          borderRadius: '6px',
                          border:
                            colunasImpressao === 2 ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                          background: colunasImpressao === 2 ? '#e0f2fe' : '#ffffff',
                          color: colunasImpressao === 2 ? '#0369a1' : '#334155',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        2 p/ linha
                      </button>
                    </div>
                  </div>
                </div>

                {/* Itens na fila */}
                {itensSelecionados.length === 0 ? (
                  <div
                    style={{
                      padding: '16px 12px',
                      textAlign: 'center',
                      color: '#64748b',
                      fontSize: '0.78rem',
                      background: '#ffffff',
                      borderRadius: '8px',
                      border: '1px dashed #cbd5e1',
                    }}
                  >
                    Nenhuma etiqueta selecionada. Clique em <strong>Incluir</strong> ao lado para
                    montar a folha A4.
                  </div>
                ) : (
                  <div
                    style={{
                      maxHeight: '22vh',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    {itensSelecionados.map((itemObj, idx) => (
                      <div
                        key={itemObj.item.codigo || idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '7px 10px',
                          background: '#ffffff',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: '#0f172a',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {itemObj.item.nome}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 700 }}>
                            R$ {formatarPrecoEtiqueta(itemObj.item.preco_venda)}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={() => handleAlterarCopias(idx, -1)}
                            aria-label="Diminuir cópias"
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              background: '#f8fafc',
                              color: '#334155',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Minus size={12} />
                          </button>
                          <span
                            style={{
                              minWidth: '22px',
                              textAlign: 'center',
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              color: '#0f172a',
                            }}
                          >
                            {itemObj.copias}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAlterarCopias(idx, 1)}
                            aria-label="Aumentar cópias"
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              background: '#f8fafc',
                              color: '#334155',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoverDaFila(idx)}
                            aria-label="Remover item da fila"
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              border: '1px solid #fecaca',
                              background: '#fef2f2',
                              color: '#dc2626',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              marginLeft: '2px',
                            }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Pré-visualização Real da Etiqueta */}
              <div
                style={{
                  background: '#f1f5f9',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: '#475569',
                  }}
                >
                  <span>Pré-visualização na gôndola</span>
                  <span style={{ color: '#64748b' }}>
                    {itensSelecionados.length === 0
                      ? 'Modelo de exemplo'
                      : `${totalEtiquetas} etiqueta(s) • ${colunasImpressao} por linha`}
                  </span>
                </div>

                <div
                  style={{
                    maxHeight: '26vh',
                    overflowY: 'auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))',
                    gap: '10px',
                    padding: '2px',
                  }}
                >
                  {itensPreview.map(({ key, item }) => {
                    const codigoTexto = item.codigo_barras || item.codigo || '';
                    const barras = gerarBarrasSvg(codigoTexto);
                    return (
                      <div
                        key={key}
                        style={{
                          background: '#ffffff',
                          border: '1.5px solid #0f172a',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.08)',
                        }}
                      >
                        <div
                          style={{
                            background: isOferta ? '#0f172a' : '#f1f5f9',
                            color: isOferta ? '#ffffff' : '#334155',
                            padding: '4px 7px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '4px',
                            borderBottom: `1px solid ${isOferta ? '#0f172a' : '#cbd5e1'}`,
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.62rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {loja?.nome || 'SUPERMERCADO'}
                          </span>
                          {isOferta && (
                            <span
                              style={{
                                background: '#facc15',
                                color: '#0f172a',
                                fontSize: '0.58rem',
                                fontWeight: 900,
                                padding: '1px 4px',
                                borderRadius: '3px',
                                flexShrink: 0,
                              }}
                            >
                              OFERTA
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            padding: '6px 7px 4px 7px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            lineHeight: 1.2,
                            textAlign: 'center',
                            color: '#0f172a',
                            minHeight: '34px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {item.nome}
                          </span>
                        </div>

                        <div
                          style={{
                            margin: '2px 7px',
                            padding: '4px 6px',
                            borderRadius: '6px',
                            background: isOferta ? '#facc15' : '#ffffff',
                            border: isOferta ? '1px solid #eab308' : '1.5px solid #0f172a',
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'center',
                            gap: '3px',
                            color: '#0f172a',
                          }}
                        >
                          <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>R$</span>
                          <span
                            style={{
                              fontSize: '1.22rem',
                              fontWeight: 900,
                              lineHeight: 1,
                              fontFamily: 'monospace',
                            }}
                          >
                            {formatarPrecoEtiqueta(item.preco_venda)}
                          </span>
                        </div>

                        <div style={{ padding: '4px 7px 6px 7px', textAlign: 'center' }}>
                          <svg
                            viewBox="0 0 120 22"
                            preserveAspectRatio="none"
                            style={{ width: '100%', height: '16px', display: 'block' }}
                          >
                            {barras.map((b, bi) => (
                              <rect
                                key={bi}
                                x={b.x}
                                y={0}
                                width={b.w}
                                height={22}
                                fill="#0f172a"
                              />
                            ))}
                          </svg>
                          <div
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.62rem',
                              color: '#334155',
                              marginTop: '2px',
                            }}
                          >
                            {codigoTexto}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RODAPÉ FIXO */}
        <div
          style={{
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '0.76rem', color: '#475569', fontWeight: 600 }}>
            Folha A4 • {itensSelecionados.length} produto(s) • {totalEtiquetas} etiqueta(s)
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-cancelar"
              onClick={onFechar}
              style={{
                padding: '9px 18px',
                borderRadius: '9px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
              }}
            >
              Fechar
            </button>

            <button
              type="button"
              disabled={totalEtiquetas === 0}
              onClick={handleImprimirEtiquetas}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '9px',
                border: 'none',
                background: totalEtiquetas === 0 ? '#94a3b8' : '#0284c7',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: totalEtiquetas === 0 ? 'not-allowed' : 'pointer',
                boxShadow:
                  totalEtiquetas === 0 ? 'none' : '0 2px 8px rgba(2, 132, 199, 0.25)',
              }}
            >
              <Printer size={16} />
              <span>Imprimir Etiquetas (A4)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
