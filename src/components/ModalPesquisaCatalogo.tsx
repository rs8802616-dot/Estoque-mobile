import React, { useState, useEffect, useRef } from 'react';
import { pesquisarSI5GlobalPorNome, SI5ProdutoRetorno } from '../lib/bomJawaKitApi';

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
  termoInicial?: string;
  onSelecionarProduto: (produto: ProdutoPesquisaItem) => void;
}

const SUGESTOES_RAPIDAS = [
  'Picanha',
  'Heineken',
  'Brahma',
  'Coca-Cola',
  'Arroz',
  'Feijão',
  'Vodka',
  'Red Bull',
  'Amendoim',
  'Carvão',
];

export const ModalPesquisaCatalogo: React.FC<ModalPesquisaCatalogoProps> = ({
  visivel,
  onFechar,
  termoInicial = '',
  onSelecionarProduto,
}) => {
  const [termo, setTermo] = useState(termoInicial);
  const [produtosAPI, setProdutosAPI] = useState<SI5ProdutoRetorno[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItens, setTotalItens] = useState(0);
  const [jaPesquisou, setJaPesquisou] = useState(false);
  const [erroMensagem, setErroMensagem] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Executa busca direta e exclusivamente na API Oficial https://global.si5.com.br
  const executarBuscaAPI = async (termoParaBuscar: string, pagina: number = 1, anexar: boolean = false) => {
    const limpo = (termoParaBuscar || '').trim();
    if (limpo.length < 3) {
      alert('Por favor, digite pelo menos 3 letras para pesquisar na API Oficial SI5 Global (ex: Picanha, Cerveja, Nescau).');
      return;
    }

    setCarregando(true);
    setErroMensagem(null);
    setJaPesquisou(true);

    try {
      const res = await pesquisarSI5GlobalPorNome(limpo, pagina);
      if (res && Array.isArray(res.produtos)) {
        if (anexar) {
          setProdutosAPI((prev) => [...prev, ...res.produtos]);
        } else {
          setProdutosAPI(res.produtos);
        }
        setTotalItens(res.total);
        setPaginaAtual(res.currentPage);
        setTotalPaginas(res.lastPage);
      } else {
        if (!anexar) setProdutosAPI([]);
        setErroMensagem('Nenhum resultado retornado pela API ou limite de consultas temporariamente atingido.');
      }
    } catch (err: any) {
      console.warn('[ModalPesquisaCatalogo] Erro ao consultar SI5 Global:', err);
      setErroMensagem('Falha ao comunicar com a API Oficial SI5 Global. Verifique sua conexão.');
    } finally {
      setCarregando(false);
    }
  };

  // Quando o modal abre, foca no input e executa se já tiver termo
  useEffect(() => {
    if (visivel) {
      const t = (termoInicial || '').trim();
      setTermo(t);
      setProdutosAPI([]);
      setJaPesquisou(false);
      setErroMensagem(null);
      setPaginaAtual(1);
      setTotalPaginas(1);
      setTotalItens(0);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 120);

      // Se já veio com nome do produto do formulário (com pelo menos 3 caracteres), busca direto na API
      if (t.length >= 3) {
        executarBuscaAPI(t, 1, false);
      }
    }
  }, [visivel, termoInicial]);

  const handleSubmeterBusca = (e: React.FormEvent) => {
    e.preventDefault();
    executarBuscaAPI(termo, 1, false);
  };

  const handleCarregarMais = () => {
    if (paginaAtual < totalPaginas && !carregando) {
      executarBuscaAPI(termo, paginaAtual + 1, true);
    }
  };

  const handleSelecionarSugestao = (sugestao: string) => {
    setTermo(sugestao);
    executarBuscaAPI(sugestao, 1, false);
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
        backgroundColor: 'rgba(15, 23, 42, 0.78)',
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
          maxWidth: '1120px',
          maxHeight: '92vh',
          backgroundColor: '#F4F7FB',
          borderRadius: '16px',
          border: '2px solid #292524',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.35)',
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
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                border: '1.5px solid #3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.35rem',
              }}
            >
              🌐
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#1C1917',
                    lineHeight: 1.2,
                  }}
                >
                  Pesquisar Produto na API Oficial
                </h3>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    backgroundColor: '#ECFDF5',
                    color: '#047857',
                    border: '1px solid #A7F3D0',
                    padding: '2px 6px',
                    borderRadius: '12px',
                  }}
                >
                  SI5 Global
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B' }}>
                Busca oficial em tempo real (Nome, Foto, Marca e Código de Barras EAN)
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
            }}
            title="Fechar pesquisa"
          >
            ✕
          </button>
        </div>

        {/* CAMPO DE BUSCA DIRETO NA API */}
        <div style={{ padding: '14px 20px 10px 20px', backgroundColor: '#FFFFFF' }}>
          <form onSubmit={handleSubmeterBusca} style={{ display: 'flex', gap: '8px' }}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#F8FAFC',
                border: '2px solid #292524',
                borderRadius: '10px',
                padding: '6px 12px',
              }}
            >
              <span style={{ fontSize: '1.1rem', color: '#64748B' }}>🔍</span>
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

            <button
              type="submit"
              disabled={carregando || termo.trim().length < 3}
              style={{
                padding: '0 18px',
                borderRadius: '10px',
                backgroundColor: '#0284C7',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: carregando || termo.trim().length < 3 ? 'not-allowed' : 'pointer',
                opacity: carregando || termo.trim().length < 3 ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
              }}
            >
              {carregando ? '⏳ Buscando...' : '🔍 Buscar na API'}
            </button>
          </form>

          {/* SUGESTÕES RÁPIDAS DE CONSULTA */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingTop: '10px',
              paddingBottom: '2px',
              scrollbarWidth: 'none',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, whiteSpace: 'nowrap' }}>
              Exemplos:
            </span>
            {SUGESTOES_RAPIDAS.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => handleSelecionarSugestao(sug)}
                style={{
                  padding: '3px 8px',
                  borderRadius: '14px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#F1F5F9',
                  color: '#334155',
                }}
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* BARRA DE STATUS DA CONSULTA */}
        <div
          style={{
            padding: '7px 20px',
            backgroundColor: '#E2E8F0',
            borderBottom: '1px solid #CBD5E1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.76rem',
            color: '#334155',
          }}
        >
          <span>
            {carregando ? (
              '⏳ Consultando API Oficial SI5 Global (https://global.si5.com.br)...'
            ) : jaPesquisou ? (
              <>
                🌐 <b>{totalItens}</b> produtos encontrados na API para "<b>{termo}</b>" (Página {paginaAtual} de {totalPaginas})
              </>
            ) : (
              '💡 Digite o nome do produto e clique em Buscar para consultar a base nacional'
            )}
          </span>
          {jaPesquisou && totalItens > 0 && (
            <span style={{ color: '#0369A1', fontWeight: 700 }}>
              {produtosAPI.length} itens carregados
            </span>
          )}
        </div>

        {/* ÁREA DE RESULTADOS RETORNADOS PELA API EM GRADE DE CARDS (ESTILO VITRINE TABLET/PC) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
          }}
        >
          {carregando && produtosAPI.length === 0 ? (
            <div style={{ padding: '50px 20px', textAlign: 'center', color: '#64748B' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>⏳</div>
              <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>
                Consultando API Oficial SI5 Global...
              </div>
              <p style={{ fontSize: '0.82rem', margin: 0, color: '#64748B' }}>
                Buscando cadastros nacionais oficiais para "<b>{termo}</b>". Aguarde um instante...
              </p>
            </div>
          ) : !jaPesquisou ? (
            <div style={{ padding: '50px 20px', textAlign: 'center', color: '#64748B' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🥩 🍺 🛒</div>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                Pesquisa Direta na API Oficial SI5 Global
              </div>
              <p style={{ fontSize: '0.84rem', maxWidth: '420px', margin: '0 auto', lineHeight: 1.45 }}>
                Digite o nome de qualquer produto (como <b>Picanha</b>, <b>Heineken</b>, <b>Nescau</b>, etc.) para buscar diretamente na API oficial e preencher o código de barras, foto e dados no cadastro.
              </p>
            </div>
          ) : produtosAPI.length === 0 ? (
            <div style={{ padding: '50px 20px', textAlign: 'center', color: '#64748B' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔍</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>
                Nenhum produto retornado pela API
              </div>
              <p style={{ fontSize: '0.82rem', maxWidth: '380px', margin: '0 auto', lineHeight: 1.4 }}>
                {erroMensagem || `Não encontramos produtos com "${termo}" na API oficial. Tente palavras mais simples como "picanha", "cerveja" ou "leite".`}
              </p>
            </div>
          ) : (
            <>
              {/* GRADE DE CARDS IGUAL À VITRINE NO TABLET E PC */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
                  gap: '14px',
                }}
              >
                {produtosAPI.map((prod, idx) => (
                  <div
                    key={`${prod.ean}_${idx}`}
                    onClick={() => {
                      onSelecionarProduto({
                        codigo: prod.ean,
                        nome: prod.nomeProduto,
                        marca: prod.marca || '',
                        categoria: prod.categoria || 'Geral',
                        foto: prod.fotoUrl || '',
                        origem: prod.fonte || 'API Oficial SI5 Global',
                      });
                      onFechar();
                    }}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#38BDF8';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(2, 132, 199, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.04)';
                    }}
                  >
                    {/* ÁREA SUPERIOR DA FOTO (FUNDO BRANCO LIMPO IGUAL IMAGEM 2) */}
                    <div
                      style={{
                        width: '100%',
                        height: '160px',
                        backgroundColor: '#FFFFFF',
                        borderBottom: '1px solid #F1F5F9',
                        padding: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      {prod.fotoUrl ? (
                        <img
                          src={prod.fotoUrl}
                          alt={prod.nomeProduto}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '132px',
                            objectFit: 'contain',
                          }}
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector('.fallback-icon')) {
                              const span = document.createElement('span');
                              span.className = 'fallback-icon';
                              span.style.fontSize = '2.8rem';
                              span.innerText = '📦';
                              parent.appendChild(span);
                            }
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '2.8rem' }}>📦</span>
                      )}
                    </div>

                    {/* ÁREA INFERIOR DE INFORMAÇÕES DO CARD */}
                    <div
                      style={{
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        {/* TÍTULO DO PRODUTO (2 LINHAS) */}
                        <div
                          style={{
                            fontSize: '0.88rem',
                            fontWeight: 800,
                            color: '#0F172A',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            minHeight: '2.28em',
                          }}
                          title={prod.nomeProduto}
                        >
                          {prod.nomeProduto}
                        </div>

                        {/* CÓDIGO DE BARRAS */}
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: '#64748B',
                            marginTop: '4px',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          Cód: {prod.ean}
                        </div>

                        {/* MARCA / ORIGEM */}
                        <div
                          style={{
                            fontSize: '0.74rem',
                            color: '#64748B',
                            marginTop: '8px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          Marca: <b style={{ color: '#0F172A' }}>{prod.marca || prod.categoria || 'Oficial SI5'}</b>
                        </div>
                      </div>

                      {/* RODAPÉ DO CARD (ESTILO R$ + BOTÃO AZUL CLARO IGUAL IMAGEM 2) */}
                      <div
                        style={{
                          marginTop: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '6px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.88rem',
                            fontWeight: 900,
                            color: '#0F172A',
                            letterSpacing: '-0.3px',
                          }}
                        >
                          EAN Oficial
                        </span>

                        <button
                          type="button"
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            backgroundColor: '#F0F9FF',
                            color: '#0369A1',
                            border: '1px solid #BAE6FD',
                            fontWeight: 700,
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#0284C7';
                            e.currentTarget.style.color = '#FFFFFF';
                            e.currentTarget.style.borderColor = '#0284C7';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#F0F9FF';
                            e.currentTarget.style.color = '#0369A1';
                            e.currentTarget.style.borderColor = '#BAE6FD';
                          }}
                          title="Usar este produto no cadastro"
                        >
                          <span>🛒</span>
                          <span>+ Usar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* BOTÃO CARREGAR MAIS PRODUTOS DA API */}
              {paginaAtual < totalPaginas && (
                <div style={{ textAlign: 'center', padding: '18px 0 6px 0' }}>
                  <button
                    type="button"
                    onClick={handleCarregarMais}
                    disabled={carregando}
                    style={{
                      padding: '10px 22px',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      color: '#0369A1',
                      border: '2px solid #0284C7',
                      fontWeight: 800,
                      fontSize: '0.84rem',
                      cursor: carregando ? 'wait' : 'pointer',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                    }}
                  >
                    {carregando
                      ? '⏳ Carregando mais produtos...'
                      : `⬇️ Puxar mais 20 produtos da API (Pág. ${paginaAtual + 1} de ${totalPaginas})`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* RODAPÉ */}
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
          <span>💡 Clique em qualquer card da vitrine para preencher código, nome e foto automaticamente.</span>
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
