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
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          maxWidth: isDesktop ? '1120px' : '660px',
          height: isDesktop ? '88vh' : undefined,
          maxHeight: '92vh',
          backgroundColor: '#FAF7F2',
          borderRadius: isDesktop ? '20px' : '16px',
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
            padding: isDesktop ? '20px 28px' : '16px 20px',
            backgroundColor: '#FFFFFF',
            borderBottom: '2px solid #E4E3E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? '14px' : '10px' }}>
            <div
              style={{
                width: isDesktop ? '52px' : '42px',
                height: isDesktop ? '52px' : '42px',
                borderRadius: isDesktop ? '12px' : '10px',
                backgroundColor: '#EFF6FF',
                border: '1.5px solid #3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isDesktop ? '1.65rem' : '1.35rem',
              }}
            >
              🌐
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: isDesktop ? '1.28rem' : '1.05rem',
                    fontWeight: 800,
                    color: '#1C1917',
                    lineHeight: 1.2,
                  }}
                >
                  Pesquisar Produto na API Oficial
                </h3>
                <span
                  style={{
                    fontSize: isDesktop ? '0.78rem' : '0.68rem',
                    fontWeight: 700,
                    backgroundColor: '#ECFDF5',
                    color: '#047857',
                    border: '1px solid #A7F3D0',
                    padding: isDesktop ? '3px 10px' : '2px 6px',
                    borderRadius: '12px',
                  }}
                >
                  SI5 Global
                </span>
              </div>
              <p style={{ margin: isDesktop ? '3px 0 0 0' : 0, fontSize: isDesktop ? '0.88rem' : '0.78rem', color: '#64748B' }}>
                Busca oficial em tempo real (Nome, Foto, Marca e Código de Barras EAN)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onFechar}
            style={{
              width: isDesktop ? '40px' : '34px',
              height: isDesktop ? '40px' : '34px',
              borderRadius: isDesktop ? '10px' : '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              color: '#475569',
              fontSize: isDesktop ? '1.15rem' : '1rem',
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
        <div style={{ padding: isDesktop ? '18px 28px 14px 28px' : '14px 20px 10px 20px', backgroundColor: '#FFFFFF' }}>
          <form onSubmit={handleSubmeterBusca} style={{ display: 'flex', gap: isDesktop ? '12px' : '8px' }}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: isDesktop ? '10px' : '8px',
                backgroundColor: '#F8FAFC',
                border: '2px solid #292524',
                borderRadius: isDesktop ? '12px' : '10px',
                padding: isDesktop ? '10px 16px' : '6px 12px',
              }}
            >
              <span style={{ fontSize: isDesktop ? '1.25rem' : '1.1rem', color: '#64748B' }}>🔍</span>
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
                  fontSize: isDesktop ? '1.05rem' : '0.92rem',
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
                    width: isDesktop ? '26px' : '22px',
                    height: isDesktop ? '26px' : '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isDesktop ? '0.8rem' : '0.72rem',
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
                padding: isDesktop ? '0 24px' : '0 18px',
                borderRadius: isDesktop ? '12px' : '10px',
                backgroundColor: '#0284C7',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: isDesktop ? '0.98rem' : '0.88rem',
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
              gap: isDesktop ? '8px' : '6px',
              overflowX: 'auto',
              paddingTop: isDesktop ? '12px' : '10px',
              paddingBottom: '2px',
              scrollbarWidth: 'none',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: isDesktop ? '0.82rem' : '0.72rem', color: '#64748B', fontWeight: 700, whiteSpace: 'nowrap' }}>
              Exemplos:
            </span>
            {SUGESTOES_RAPIDAS.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => handleSelecionarSugestao(sug)}
                style={{
                  padding: isDesktop ? '5px 12px' : '3px 8px',
                  borderRadius: '14px',
                  fontSize: isDesktop ? '0.82rem' : '0.74rem',
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
            padding: isDesktop ? '10px 28px' : '7px 20px',
            backgroundColor: '#F1F5F9',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: isDesktop ? '0.86rem' : '0.76rem',
            color: '#475569',
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

        {/* LISTA DE RESULTADOS RETORNADOS PELA API */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: isDesktop ? '18px 28px' : '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: isDesktop ? '12px' : '8px',
          }}
        >
          {carregando && produtosAPI.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>⏳</div>
              <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>
                Consultando API Oficial SI5 Global...
              </div>
              <p style={{ fontSize: '0.82rem', margin: 0, color: '#64748B' }}>
                Buscando cadastros nacionais oficiais para "<b>{termo}</b>". Aguarde um instante...
              </p>
            </div>
          ) : !jaPesquisou ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🥩 🍺 🛒</div>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                Pesquisa Direta na API Oficial SI5 Global
              </div>
              <p style={{ fontSize: '0.84rem', maxWidth: '420px', margin: '0 auto', lineHeight: 1.45 }}>
                Digite o nome de qualquer produto (como <b>Picanha</b>, <b>Heineken</b>, <b>Nescau</b>, etc.) para buscar diretamente na API oficial e preencher o código de barras, foto e dados no cadastro.
              </p>
            </div>
          ) : produtosAPI.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B' }}>
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
              {produtosAPI.map((prod) => (
                <div
                  key={prod.ean + prod.nomeProduto}
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: isDesktop ? '18px' : '12px',
                    padding: isDesktop ? '16px 22px' : '10px 14px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: isDesktop ? '16px' : '12px',
                    border: '1.5px solid #E2E8F0',
                    boxShadow: isDesktop ? '0 2px 6px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.05)',
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
                  {/* FOTO RETORNADA PELA API */}
                  <div
                    style={{
                      width: isDesktop ? '86px' : '54px',
                      height: isDesktop ? '86px' : '54px',
                      borderRadius: isDesktop ? '12px' : '8px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0,
                      padding: isDesktop ? '6px' : 0,
                    }}
                  >
                    {prod.fotoUrl ? (
                      <img
                        src={prod.fotoUrl}
                        alt={prod.nomeProduto}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: isDesktop ? '2.2rem' : '1.5rem' }}>📦</span>
                    )}
                  </div>

                  {/* INFORMAÇÕES DO PRODUTO NA API */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: isDesktop ? '1.12rem' : '0.88rem',
                        fontWeight: 700,
                        color: '#0F172A',
                        whiteSpace: isDesktop ? 'normal' : 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: isDesktop ? '8px' : '4px',
                        lineHeight: isDesktop ? 1.35 : undefined,
                      }}
                      title={prod.nomeProduto}
                    >
                      {prod.nomeProduto}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? '8px' : '6px', flexWrap: 'wrap' }}>
                      {/* CÓDIGO DE BARRAS OFICIAL EAN */}
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: isDesktop ? '0.88rem' : '0.76rem',
                          fontWeight: 700,
                          backgroundColor: '#FEF3C7',
                          color: '#92400E',
                          padding: isDesktop ? '4px 10px' : '1px 7px',
                          borderRadius: isDesktop ? '6px' : '4px',
                          border: '1px solid #FDE68A',
                        }}
                      >
                        🏷️ {prod.ean}
                      </span>

                      {/* MARCA */}
                      {prod.marca && (
                        <span
                          style={{
                            fontSize: isDesktop ? '0.84rem' : '0.72rem',
                            fontWeight: 600,
                            backgroundColor: '#EFF6FF',
                            color: '#1E40AF',
                            padding: isDesktop ? '4px 10px' : '1px 6px',
                            borderRadius: isDesktop ? '6px' : '4px',
                          }}
                        >
                          {prod.marca}
                        </span>
                      )}

                      {/* FONTE OFICIAL */}
                      <span
                        style={{
                          fontSize: isDesktop ? '0.82rem' : '0.70rem',
                          fontWeight: 600,
                          backgroundColor: '#F1F5F9',
                          color: '#047857',
                          padding: isDesktop ? '4px 10px' : '1px 6px',
                          borderRadius: isDesktop ? '6px' : '4px',
                        }}
                      >
                        ✓ SI5 Global
                      </span>
                    </div>
                  </div>

                  {/* BOTÃO USAR */}
                  <button
                    type="button"
                    style={{
                      padding: isDesktop ? '12px 24px' : '8px 14px',
                      borderRadius: isDesktop ? '10px' : '8px',
                      backgroundColor: '#0284C7',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: isDesktop ? '0.96rem' : '0.80rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: isDesktop ? '6px' : '4px',
                    }}
                    title="Usar este produto no cadastro"
                  >
                    <span>✓</span>
                    <span>Usar</span>
                  </button>
                </div>
              ))}

              {/* BOTÃO CARREGAR MAIS PRODUTOS DA API */}
              {paginaAtual < totalPaginas && (
                <div style={{ textAlign: 'center', padding: isDesktop ? '14px 0' : '10px 0' }}>
                  <button
                    type="button"
                    onClick={handleCarregarMais}
                    disabled={carregando}
                    style={{
                      padding: isDesktop ? '12px 24px' : '9px 18px',
                      borderRadius: isDesktop ? '10px' : '8px',
                      backgroundColor: '#FFFFFF',
                      color: '#0369A1',
                      border: '2px solid #0284C7',
                      fontWeight: 700,
                      fontSize: isDesktop ? '0.92rem' : '0.82rem',
                      cursor: carregando ? 'wait' : 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    }}
                  >
                    {carregando ? '⏳ Carregando mais produtos...' : `⬇️ Puxar mais 20 produtos da API (Pág. ${paginaAtual + 1} de ${totalPaginas})`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* RODAPÉ */}
        <div
          style={{
            padding: isDesktop ? '14px 28px' : '10px 16px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: isDesktop ? '0.85rem' : '0.75rem',
            color: '#64748B',
          }}
        >
          <span>💡 Clique em qualquer produto retornado pela API para preencher os dados automaticamente.</span>
          <button
            type="button"
            onClick={onFechar}
            style={{
              padding: isDesktop ? '8px 18px' : '6px 14px',
              borderRadius: isDesktop ? '8px' : '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              fontWeight: 600,
              fontSize: isDesktop ? '0.88rem' : undefined,
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
