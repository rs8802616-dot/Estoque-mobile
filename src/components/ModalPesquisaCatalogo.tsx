import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ProdutoCatalogo } from '../types';
import { carregarCatalogoOfflineJSON, buscarProdutosCosmosBluesoft } from '../lib/bomJawaKitApi';

export interface ProdutoPesquisaItem {
  codigo: string;
  nome: string;
  marca?: string;
  categoria?: string;
  foto?: string;
  origem?: string;
}

interface ModalPesquisaCatalogoProps {
  visivel: boolean;
  onFechar: () => void;
  catalogoGlobal: ProdutoCatalogo[];
  termoInicial?: string;
  onSelecionarProduto: (produto: ProdutoPesquisaItem) => void;
}

const CATEGORIAS_RAPIDAS = [
  'Todos',
  'Carnes & Frios',
  'Bebidas',
  'Cervejas',
  'Mercearia',
  'Doces & Biscoitos',
  'Higiene & Limpeza',
  'Padaria & Congelados',
];

export const ModalPesquisaCatalogo: React.FC<ModalPesquisaCatalogoProps> = ({
  visivel,
  onFechar,
  catalogoGlobal,
  termoInicial = '',
  onSelecionarProduto,
}) => {
  const [termo, setTermo] = useState(termoInicial);
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [itensOffline, setItensOffline] = useState<ProdutoPesquisaItem[]>([]);
  const [carregandoOffline, setCarregandoOffline] = useState(false);
  const [buscandoAPIExterna, setBuscandoAPIExterna] = useState(false);
  const [resultadosExternos, setResultadosExternos] = useState<ProdutoPesquisaItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sincroniza termo inicial quando o modal abre
  useEffect(() => {
    if (visivel) {
      setTermo(termoInicial || '');
      setResultadosExternos([]);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [visivel, termoInicial]);

  // Carrega base offline de 13.357 produtos sob demanda
  useEffect(() => {
    let cancelado = false;
    if (visivel && itensOffline.length === 0) {
      setCarregandoOffline(true);
      carregarCatalogoOfflineJSON()
        .then((dados) => {
          if (!cancelado && dados?.produtos) {
            const mapeados: ProdutoPesquisaItem[] = dados.produtos.map((p) => ({
              codigo: p.ean,
              nome: p.nomeProduto,
              marca: p.marca || '',
              categoria: p.categoria || 'Geral',
              foto: p.fotoUrl || '',
              origem: 'Catálogo Oficial (Base Nacional)',
            }));
            setItensOffline(mapeados);
          }
        })
        .catch((err) => {
          console.warn('[ModalPesquisaCatalogo] Falha ao carregar catálogo offline:', err);
        })
        .finally(() => {
          if (!cancelado) setCarregandoOffline(false);
        });
    }
    return () => {
      cancelado = true;
    };
  }, [visivel, itensOffline.length]);

  // Combina produtos do Catálogo Global (memória/loja) + Base Offline (13k itens) sem duplicados
  const catalogoCombinado = useMemo(() => {
    const mapa = new Map<string, ProdutoPesquisaItem>();

    // 1. Catálogo Global existente no App (maior prioridade)
    catalogoGlobal.forEach((p) => {
      const cod = (p.codigo || '').trim();
      if (cod && !mapa.has(cod)) {
        mapa.set(cod, {
          codigo: cod,
          nome: p.nome || '',
          marca: p.marca || '',
          categoria: p.categoria || 'Geral',
          foto: p.foto || p.imagem || p.foto_url || '',
          origem: 'Catálogo do Sistema',
        });
      }
    });

    // 2. Base Oficial de 13.357 itens
    itensOffline.forEach((p) => {
      const cod = (p.codigo || '').trim();
      if (cod && !mapa.has(cod)) {
        mapa.set(cod, p);
      }
    });

    // 3. Resultados adicionais de API Externa (se consultado)
    resultadosExternos.forEach((p) => {
      const cod = (p.codigo || '').trim();
      if (cod && !mapa.has(cod)) {
        mapa.set(cod, p);
      }
    });

    return Array.from(mapa.values());
  }, [catalogoGlobal, itensOffline, resultadosExternos]);

  // Filtragem rápida em tempo real por nome, marca ou código de barras
  const produtosFiltrados = useMemo(() => {
    const termoLimpo = termo.trim().toLowerCase();
    const categoriaFiltro = categoriaAtiva.toLowerCase();

    return catalogoCombinado.filter((prod) => {
      // Filtro de categoria
      if (categoriaAtiva !== 'Todos') {
        const catProd = (prod.categoria || '').toLowerCase();
        if (!catProd.includes(categoriaFiltro)) {
          // Casos especiais de categoria
          if (categoriaAtiva === 'Carnes & Frios' && !catProd.includes('carne') && !catProd.includes('frio') && !catProd.includes('bovino') && !catProd.includes('aves')) {
            return false;
          } else if (categoriaAtiva === 'Cervejas' && !catProd.includes('cerveja') && !prod.nome.toLowerCase().includes('cerveja') && !prod.nome.toLowerCase().includes('chopp')) {
            return false;
          } else if (categoriaAtiva === 'Bebidas' && !catProd.includes('bebida') && !catProd.includes('refrigerante') && !catProd.includes('suco') && !catProd.includes('cerveja')) {
            return false;
          }
        }
      }

      // Se não digitou busca, exibe os primeiros itens da categoria
      if (!termoLimpo) return true;

      // Busca por código exato ou parcial
      if (prod.codigo.toLowerCase().includes(termoLimpo)) return true;

      // Busca por palavras no nome (suporta múltiplos termos, ex: "picanha friboi" ou "cerveja heineken")
      const termosIndividuais = termoLimpo.split(/\s+/).filter(Boolean);
      const nomeProd = prod.nome.toLowerCase();
      const marcaProd = (prod.marca || '').toLowerCase();
      const catProd = (prod.categoria || '').toLowerCase();

      const bateuTodosTermos = termosIndividuais.every(
        (t) => nomeProd.includes(t) || marcaProd.includes(t) || catProd.includes(t)
      );

      return bateuTodosTermos;
    });
  }, [catalogoCombinado, termo, categoriaAtiva]);

  // Limita a exibição a 60 itens para manter performance suave no mobile
  const itensExibidos = useMemo(() => {
    return produtosFiltrados.slice(0, 60);
  }, [produtosFiltrados]);

  // Buscar online via Bluesoft Cosmos
  const handleBuscarOnline = async () => {
    const t = termo.trim();
    if (!t) return;
    setBuscandoAPIExterna(true);
    try {
      const online = await buscarProdutosCosmosBluesoft(t);
      if (Array.isArray(online) && online.length > 0) {
        const convertidos: ProdutoPesquisaItem[] = online.map((item) => ({
          codigo: item.ean,
          nome: item.nomeProduto,
          marca: item.marca || '',
          categoria: item.categoria || 'Geral',
          foto: item.fotoUrl || '',
          origem: 'API Oficial Bluesoft Cosmos',
        }));
        setResultadosExternos(convertidos);
      } else {
        alert('Nenhum produto adicional retornado pela API externa.');
      }
    } catch (e: any) {
      console.warn('Erro ao consultar API externa:', e);
      alert('Não foi possível conectar com a API externa no momento.');
    } finally {
      setBuscandoAPIExterna(false);
    }
  };

  if (!visivel) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          backgroundColor: '#FAF7F2',
          borderRadius: '16px',
          border: '2px solid #292524',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeInModal 0.2s ease-out',
        }}
      >
        {/* CABEÇALHO */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#FFFFFF',
            borderBottom: '2px solid #E4E3E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}
            >
              🔍
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#1C1917',
                  lineHeight: 1.2,
                }}
              >
                Pesquisar Produto
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B' }}>
                Localize por nome (ex: Picanha, Heineken, Nescau...) e preencha tudo em 1 toque
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onFechar}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              color: '#475569',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            title="Fechar pesquisa"
          >
            ✕
          </button>
        </div>

        {/* CAMPO DE PESQUISA & FILTROS */}
        <div style={{ padding: '14px 20px 8px 20px', backgroundColor: '#FFFFFF' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#F8FAFC',
              border: '2px solid #292524',
              borderRadius: '10px',
              padding: '6px 12px',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
            }}
          >
            <span style={{ fontSize: '1.1rem', color: '#64748B' }}>🔎</span>
            <input
              ref={inputRef}
              type="text"
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              placeholder="Digite o nome do produto (ex: Picanha, Heineken, Nescau...)"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: '#0F172A',
                padding: '4px 0',
              }}
            />
            {termo && (
              <button
                type="button"
                onClick={() => setTermo('')}
                style={{
                  background: '#E2E8F0',
                  border: 'none',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  color: '#475569',
                  cursor: 'pointer',
                }}
                title="Limpar busca"
              >
                ✕
              </button>
            )}
          </div>

          {/* CHIPS DE CATEGORIA */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingTop: '10px',
              paddingBottom: '4px',
              scrollbarWidth: 'none',
            }}
          >
            {CATEGORIAS_RAPIDAS.map((cat) => {
              const ativo = categoriaAtiva === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoriaAtiva(cat)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    border: ativo ? '1.5px solid #0284C7' : '1px solid #CBD5E1',
                    backgroundColor: ativo ? '#0284C7' : '#F1F5F9',
                    color: ativo ? '#FFFFFF' : '#334155',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* STATUS DA BASE / CONTAGEM */}
        <div
          style={{
            padding: '6px 20px',
            backgroundColor: '#F1F5F9',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#64748B',
          }}
        >
          <span>
            {carregandoOffline ? (
              '⏳ Carregando acervo de +13.000 produtos...'
            ) : (
              <>
                📦 <b>{produtosFiltrados.length}</b> produtos encontrados
                {termo.trim() ? ` para "${termo.trim()}"` : ''}
              </>
            )}
          </span>
          <button
            type="button"
            onClick={handleBuscarOnline}
            disabled={buscandoAPIExterna || !termo.trim()}
            style={{
              background: 'none',
              border: 'none',
              color: termo.trim() ? '#0284C7' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: termo.trim() ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: 0,
            }}
            title="Consultar na API Oficial Bluesoft Cosmos na nuvem"
          >
            {buscandoAPIExterna ? '⏳ Consultando API...' : '🌐 Buscar na Nuvem (API)'}
          </button>
        </div>

        {/* LISTA DE PRODUTOS */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {itensExibidos.length === 0 ? (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: '#64748B',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔍</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>
                Nenhum produto encontrado
              </div>
              <p style={{ fontSize: '0.82rem', maxWidth: '380px', margin: '0 auto 16px auto', lineHeight: 1.4 }}>
                Não encontramos produtos com "<b>{termo}</b>". Tente palavras-chave simples como <i>picanha</i>, <i>heineken</i> ou <i>nescau</i>.
              </p>
              {termo.trim() && (
                <button
                  type="button"
                  onClick={handleBuscarOnline}
                  disabled={buscandoAPIExterna}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#0284C7',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  {buscandoAPIExterna ? 'Consultando...' : '🌐 Buscar na Nuvem (Bluesoft Cosmos)'}
                </button>
              )}
            </div>
          ) : (
            itensExibidos.map((prod) => (
              <div
                key={prod.codigo + prod.nome}
                onClick={() => {
                  onSelecionarProduto(prod);
                  onFechar();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0284C7';
                  e.currentTarget.style.backgroundColor = '#F0F9FF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                {/* FOTO OU PLACEHOLDER */}
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '8px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {prod.foto ? (
                    <img
                      src={prod.foto}
                      alt={prod.nome}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '1.5rem' }}>📦</span>
                  )}
                </div>

                {/* DADOS DO PRODUTO */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginBottom: '3px',
                    }}
                    title={prod.nome}
                  >
                    {prod.nome}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {/* CÓDIGO DE BARRAS OFICIAL */}
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        backgroundColor: '#FEF3C7',
                        color: '#92400E',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        border: '1px solid #FDE68A',
                      }}
                    >
                      🏷️ {prod.codigo}
                    </span>

                    {/* MARCA */}
                    {prod.marca && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          backgroundColor: '#EFF6FF',
                          color: '#1E40AF',
                          padding: '1px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {prod.marca}
                      </span>
                    )}

                    {/* CATEGORIA */}
                    {prod.categoria && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          padding: '1px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {prod.categoria}
                      </span>
                    )}
                  </div>
                </div>

                {/* BOTÃO DE SELEÇÃO */}
                <button
                  type="button"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#0284C7',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title="Usar este produto no cadastro"
                >
                  <span>✓</span>
                  <span>Usar</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* RODAPÉ INFORMATIVO */}
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#64748B',
          }}
        >
          <span>💡 Clique em qualquer produto para preencher o código de barras, nome e foto automaticamente.</span>
          <button
            type="button"
            onClick={onFechar}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#334155',
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
