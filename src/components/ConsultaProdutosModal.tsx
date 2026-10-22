import React, { useState } from 'react';

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
  onBuscar: (termo?: string, pagina?: number) => void;
  carregando: boolean;
  resultados: ProdutoConsultaProdutos[];
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
  onSelecionarProduto,
}) => {
  const [termoLocal, setTermoLocal] = useState<string>(termoBusca || 'Coca cola');

  if (!visivel) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termoLocal.trim()) return;
    onTermoChange(termoLocal.trim());
    onBuscar(termoLocal.trim(), 1);
  };

  const sugestoesRapidas = [
    'Coca cola',
    'Nescau',
    'Heineken',
    'Arroz Tio João',
    'Feijão Camil',
    'Detergente Ypê',
    'Leite Piracanjuba',
    'OMO Lavagem Perfeita',
    'Café Pilão',
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
          maxWidth: '860px',
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
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
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
              🌐
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                Consulta de Produtos Online
              </h2>
              <p style={{ margin: 0, fontSize: '0.78rem', opacity: 0.9 }}>
                Buscando em <b>consultaprodutos.com.br</b> e <b>cosmos.bluesoft.com.br</b>
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

        {/* Formulário de Busca e Chips */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={termoLocal}
                onChange={(e) => setTermoLocal(e.target.value)}
                placeholder="Ex: Coca cola, Nescau, Heineken, Arroz..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.92rem',
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
            <button
              type="submit"
              disabled={carregando || !termoLocal.trim()}
              style={{
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: carregando || !termoLocal.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                opacity: carregando || !termoLocal.trim() ? 0.7 : 1,
              }}
            >
              {carregando ? '⏳ Buscando...' : '🔍 Buscar'}
            </button>
          </form>

          {/* Atalhos Rápidos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Sugestões:</span>
            {sugestoesRapidas.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => {
                  setTermoLocal(sug);
                  onTermoChange(sug);
                  onBuscar(sug, 1);
                }}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '3px 10px',
                  fontSize: '0.74rem',
                  color: '#0369a1',
                  cursor: 'pointer',
                  fontWeight: 500,
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
              <div style={{ fontWeight: 600, fontSize: '1rem', color: '#0f172a' }}>
                Consultando consultaprodutos.com.br...
              </div>
              <div style={{ fontSize: '0.84rem' }}>
                Puxando fotos em alta resolução, nomes oficiais, códigos EAN e marcas.
              </div>
            </div>
          ) : resultados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📦</div>
              <div style={{ fontWeight: 600, fontSize: '1rem', color: '#0f172a' }}>
                Nenhum produto encontrado para &quot;{termoLocal}&quot;
              </div>
              <div style={{ fontSize: '0.84rem', marginTop: '4px' }}>
                Tente digitar outro termo ou pesquisar pela marca ou código de barras.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
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
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                    <div
                      style={{
                        width: '72px',
                        height: '72px',
                        minWidth: '72px',
                        background: '#ffffff',
                        border: '1px solid #f1f5f9',
                        borderRadius: '8px',
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
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80';
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
                          fontSize: '0.88rem',
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
                              fontSize: '0.7rem',
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
                              fontSize: '0.7rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
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
                      fontSize: '0.74rem',
                      color: '#64748b',
                      marginBottom: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>
                      <b>EAN:</b> {prod.ean || 'N/D'}
                    </span>
                    {prod.ncm && (
                      <span>
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
                    📥 Preencher no Cadastro
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
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {resultados.length > 0 && (
              <>
                Exibindo página <b>{paginaAtual}</b> de resultados para &quot;<b>{termoLocal}</b>&quot;
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              disabled={paginaAtual <= 1 || carregando}
              onClick={() => onBuscar(termoLocal, paginaAtual - 1)}
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
                onClick={() => onBuscar(termoLocal, pg)}
                style={{
                  background: paginaAtual === pg ? '#0284c7' : '#ffffff',
                  color: paginaAtual === pg ? '#ffffff' : '#334155',
                  border: paginaAtual === pg ? '1px solid #0284c7' : '1px solid #cbd5e1',
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
              onClick={() => onBuscar(termoLocal, paginaAtual + 1)}
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
