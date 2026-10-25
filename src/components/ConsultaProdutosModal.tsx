import React, { useState, useEffect } from 'react';
import {
  listarCategoriasBomJawaKit,
  BomJawaKitCategoria,
} from '../lib/bomJawaKitApi';

export interface ProdutoConsultaProdutos {
  ean: string;
  nomeProduto: string;
  marca: string;
  categoria: string;
  fotoUrl: string;
  ncm: string;
  href?: string;
  fonte?: string;
}

interface ConsultaProdutosModalProps {
  visivel: boolean;
  onFechar: () => void;
  termoBusca: string;
  onTermoChange: (novoTermo: string) => void;
  paginaAtual: number;
  onBuscar: (
    termo?: string,
    pagina?: number,
    opcoes?: { categoria?: string; comImagem?: boolean; forcarAtualizacao?: boolean }
  ) => void;
  carregando: boolean;
  resultados: ProdutoConsultaProdutos[];
  totalEncontrados?: number;
  veioDoCache?: boolean;
  totalEmCache?: number;
  onSelecionarProduto: (produto: ProdutoConsultaProdutos) => void;
}

export const ConsultaProdutosModal: React.FC<ConsultaProdutosModalProps> = ({
  visivel,
  onFechar,
  termoBusca,
  onTermoChange,
  paginaAtual,
  onBuscar,
  carregando,
  resultados,
  totalEncontrados,
  veioDoCache,
  totalEmCache,
  onSelecionarProduto,
}) => {
  const [termoLocal, setTermoLocal] = useState<string>(termoBusca || 'Cerveja');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>(() => {
    try {
      return localStorage.getItem('filtro_cat_consulta_api') || '';
    } catch {
      return '';
    }
  });
  const [somenteComImagem, setSomenteComImagem] = useState<boolean>(() => {
    try {
      const salvo = localStorage.getItem('filtro_img_consulta_api');
      return salvo !== null ? salvo === 'true' : true;
    } catch {
      return true;
    }
  });
  const [categoriasApi, setCategoriasApi] = useState<BomJawaKitCategoria[]>([]);

  useEffect(() => {
    if (termoBusca && !termoBusca.toLowerCase().includes('rodrigo.souza')) {
      setTermoLocal(termoBusca);
    }
  }, [termoBusca]);

  // Anti-autofill sanitization
  useEffect(() => {
    if (termoLocal && (termoLocal.toLowerCase().includes('rodrigo.souza') || termoLocal.toLowerCase() === 'rodrigo')) {
      setTermoLocal('');
    }
  }, [termoLocal]);

  useEffect(() => {
    if (visivel && categoriasApi.length === 0) {
      listarCategoriasBomJawaKit()
        .then((cats) => {
          if (cats.length > 0) {
            setCategoriasApi(cats.filter((c) => c.produtos > 0));
          }
        })
        .catch(() => {});
    }
  }, [visivel, categoriasApi.length]);

  if (!visivel) return null;

  const dispararBusca = (
    novoTermo: string,
    novaPagina: number = 1,
    novaCategoria: string = categoriaSelecionada,
    novoComImagem: boolean = somenteComImagem,
    forcarAtualizacao: boolean = false
  ) => {
    try {
      localStorage.setItem('filtro_cat_consulta_api', novaCategoria);
      localStorage.setItem('filtro_img_consulta_api', String(novoComImagem));
    } catch {}
    onTermoChange(novoTermo);
    onBuscar(novoTermo, novaPagina, {
      categoria: novaCategoria,
      comImagem: novoComImagem,
      forcarAtualizacao,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispararBusca(termoLocal.trim(), 1);
  };

  const sugestoesRapidas = [
    'Cerveja',
    'Agua com gas',
    'Refrigerante',
    'Vinho',
    'Suco',
    'Arroz',
    'Feijao',
    'Leite',
    'Cafe',
    'Energetico',
  ];

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
      onClick={onFechar}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div
          style={{
            padding: '14px 20px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '8px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
              }}
            >
              📦
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                Catálogo Oficial Multi-API de Produtos & Códigos EAN
              </h2>
              <p style={{ margin: 0, fontSize: '0.76rem', opacity: 0.92 }}>
                Motor Duplo Ativo: <b>1º API Bluesoft Cosmos (Principal)</b> + <b>2º API BomJawaKit (Contingência)</b>
              </p>
            </div>
          </div>
          <button
            onClick={onFechar}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Formulário de Busca, Filtros da API e Chips */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 240px' }}>
              <input
                type="search"
                id="busca_consulta_produtos_modal_input"
                name="search_query_consulta_produtos"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore="true"
                value={termoLocal.toLowerCase().includes('rodrigo.souza') ? '' : termoLocal}
                onChange={(e) => {
                  const val = e.target.value;
                  setTermoLocal(val.toLowerCase().includes('rodrigo.souza') ? '' : val);
                }}
                placeholder="Digite nome do produto (ex: cerveja, agua com gas) ou código de barras..."
                style={{
                  width: '100%',
                  padding: '10px 32px 10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                autoFocus
              />
              {termoLocal && (
                <button
                  type="button"
                  onClick={() => setTermoLocal('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {categoriasApi.length > 0 && (
              <select
                value={categoriaSelecionada}
                onChange={(e) => {
                  const novaCat = e.target.value;
                  setCategoriaSelecionada(novaCat);
                  dispararBusca(termoLocal.trim(), 1, novaCat, somenteComImagem);
                }}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  maxWidth: '220px',
                }}
                title="Filtrar por Categoria da API"
              >
                <option value="">📂 Todas as Categorias</option>
                {categoriasApi.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.nome} ({c.produtos})
                  </option>
                ))}
              </select>
            )}

            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: somenteComImagem ? '#eff6ff' : '#ffffff',
                border: somenteComImagem ? '1.5px solid #3b82f6' : '1.5px solid #cbd5e1',
                color: somenteComImagem ? '#1d4ed8' : '#475569',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={somenteComImagem}
                onChange={(e) => {
                  const novoVal = e.target.checked;
                  setSomenteComImagem(novoVal);
                  dispararBusca(termoLocal.trim(), 1, categoriaSelecionada, novoVal);
                }}
                style={{ cursor: 'pointer' }}
              />
              <span>📸 Só com foto</span>
            </label>

            <button
              type="submit"
              disabled={carregando}
              style={{
                background: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: carregando ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                opacity: carregando ? 0.7 : 1,
              }}
            >
              {carregando ? '⏳ Buscando...' : '🔍 Buscar'}
            </button>
          </form>

          {/* Atalhos Rápidos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Sugestões rápidas:</span>
            {sugestoesRapidas.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => {
                  setTermoLocal(sug);
                  dispararBusca(sug, 1, categoriaSelecionada, somenteComImagem);
                }}
                style={{
                  background: termoLocal.toLowerCase() === sug.toLowerCase() ? '#e0e7ff' : '#ffffff',
                  border: termoLocal.toLowerCase() === sug.toLowerCase() ? '1px solid #6366f1' : '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '3px 10px',
                  fontSize: '0.74rem',
                  color: '#4338ca',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Resultados da Pesquisa */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', background: '#f1f5f9' }}>
          {carregando ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⏳</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
                Consultando 1º Bluesoft Cosmos + 2º BomJawaKit...
              </div>
              <div style={{ fontSize: '0.84rem' }}>
                A Bluesoft Cosmos é consultada primeiro; se atingir o limite ou faltar item, a BomJawaKit assume automaticamente.
              </div>
            </div>
          ) : resultados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📦</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
                Nenhum produto encontrado para &quot;{termoLocal}&quot;
              </div>
              <div style={{ fontSize: '0.84rem', marginTop: '4px' }}>
                Tente digitar sem acento (ex: &quot;agua com gas&quot;), escolher outra categoria ou desmarcar &quot;Só com foto&quot;.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '12px',
              }}
            >
              {resultados.map((prod, idx) => (
                <div
                  key={`${prod.ean || idx}-${idx}`}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                    <div
                      style={{
                        width: '72px',
                        height: '72px',
                        minWidth: '72px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        padding: '4px',
                      }}
                    >
                      {prod.fotoUrl ? (
                        <img
                          src={prod.fotoUrl}
                          alt={prod.nomeProduto}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                          onError={(e) => {
                            const imgEl = e.target as HTMLImageElement;
                            const fallbackCosmos = prod.ean
                              ? `https://cdn-cosmos.bluesoft.com.br/products/${prod.ean.trim()}`
                              : '';
                            if (fallbackCosmos && imgEl.src !== fallbackCosmos && !imgEl.dataset.triedCosmos) {
                              imgEl.dataset.triedCosmos = 'true';
                              imgEl.src = fallbackCosmos;
                            } else {
                              imgEl.style.display = 'none';
                            }
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '1.8rem' }}>📦</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          margin: '0 0 4px 0',
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          color: '#0f172a',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                        title={prod.nomeProduto}
                      >
                        {prod.nomeProduto}
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {prod.marca && (
                          <span
                            style={{
                              background: '#e0f2fe',
                              color: '#0369a1',
                              fontSize: '0.68rem',
                              fontWeight: 600,
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            🏷️ {prod.marca}
                          </span>
                        )}
                        {prod.categoria && (
                          <span
                            style={{
                              background: '#f1f5f9',
                              color: '#475569',
                              fontSize: '0.68rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 600,
                            }}
                          >
                            📂 {prod.categoria}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Detalhes Fiscais / EAN */}
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: '6px',
                      padding: '6px 8px',
                      fontSize: '0.73rem',
                      color: '#64748b',
                      marginBottom: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <b>EAN:</b> {prod.ean || 'N/D'}
                    </span>
                    {prod.ncm && (
                      <span style={{ whiteSpace: 'nowrap' }}>
                        <b>NCM:</b> {prod.ncm}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelecionarProduto(prod)}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    📥 Usar Produto no Cadastro
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rodapé com Paginação */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {resultados.length > 0 && (
              <>
                <span>
                  Página <b>{paginaAtual}</b>
                  {typeof totalEncontrados === 'number' && totalEncontrados > 0
                    ? ` • ${totalEncontrados} produto(s) encontrado(s)`
                    : ''}
                </span>
                <span
                  style={{
                    background: '#dcfce7',
                    color: '#166534',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                  title="Todos os produtos desta busca ficam salvos na memória do seu dispositivo: você pode fechar, cadastrar e voltar ou trocar de página sem gastar nenhuma requisição!"
                >
                  ⚡ {veioDoCache ? 'Memória Local (0 requisições)' : `Lote salvo na memória (${totalEmCache || resultados.length} itens)`}
                </span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              disabled={paginaAtual <= 1 || carregando}
              onClick={() => dispararBusca(termoLocal, paginaAtual - 1)}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: paginaAtual <= 1 || carregando ? 'not-allowed' : 'pointer',
                opacity: paginaAtual <= 1 ? 0.5 : 1,
              }}
            >
              ⏮️ Anterior
            </button>

            {[1, 2, 3, 4, 5].map((pg) => (
              <button
                key={pg}
                type="button"
                disabled={carregando}
                onClick={() => dispararBusca(termoLocal, pg)}
                style={{
                  background: paginaAtual === pg ? '#4f46e5' : '#ffffff',
                  color: paginaAtual === pg ? '#ffffff' : '#334155',
                  border: paginaAtual === pg ? '1px solid #4f46e5' : '1px solid #cbd5e1',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: carregando ? 'not-allowed' : 'pointer',
                  minWidth: '32px',
                }}
              >
                {pg}
              </button>
            ))}

            <button
              type="button"
              disabled={carregando}
              onClick={() => dispararBusca(termoLocal, paginaAtual + 1)}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: carregando ? 'not-allowed' : 'pointer',
              }}
            >
              Próxima ⏭️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
