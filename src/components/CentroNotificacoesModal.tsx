import React, { useState, useMemo } from 'react';
import {
  Bell,
  Package,
  AlertTriangle,
  BarChart3,
  X,
  Search,
  SlidersHorizontal,
  Copy,
  Check,
  MessageCircle,
  Plus,
  Trash2,
  ShoppingCart,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { ItemEstoque, Supermercado, ProdutoCatalogo } from '../types';
import { useVoltarHierarquico } from '../hooks/useVoltarHierarquico';
import { calcularAlertasEstoque } from '../utils/alertasEstoque';

export interface ProdutoEstoqueBaixoAgrupado {
  codigo: string;
  nome: string;
  marca?: string;
  categoria?: string;
  foto?: string;
  preco_custo?: number;
  preco_venda: number;
  qtdTotal: number;
  statusEstoque: 'zerado' | 'critico' | 'baixo';
  qtdSugeridaRepor: number;
  lotes: { validade: string; qtd: number; lote: string }[];
}

interface CentroNotificacoesModalProps {
  visivel: boolean;
  onFechar: () => void;
  estoque: ItemEstoque[];
  catalogoGlobal: ProdutoCatalogo[];
  supermercado: Supermercado | null;
  nomeSupermercado: string;
  limiarEstoqueMinimo: number;
  onAlterarLimiarEstoque: (novoLimiar: number) => void;
  onAbrirReposicao: (produto: {
    codigo: string;
    nome: string;
    preco_custo?: number;
    preco_venda?: number;
    foto?: string;
    marca?: string;
    categoria?: string;
  }) => void;
  onAbrirVenda: (codigo: string, validade: string, lote: string) => void;
  onDarBaixaPerda?: (codigo: string, validade: string, lote: string, qtdPerda: number, motivo?: string) => void;
  onAbrirAlertasWhatsApp: () => void;
  abaInicial?: 'estoque_baixo' | 'validade' | 'resumo';
}

export const CentroNotificacoesModal: React.FC<CentroNotificacoesModalProps> = ({
  visivel,
  onFechar,
  estoque,
  catalogoGlobal,
  nomeSupermercado,
  limiarEstoqueMinimo,
  onAlterarLimiarEstoque,
  onAbrirReposicao,
  onAbrirVenda,
  onDarBaixaPerda,
  onAbrirAlertasWhatsApp,
  abaInicial = 'estoque_baixo',
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'estoque_baixo' | 'validade' | 'resumo'>(abaInicial);
  const [busca, setBusca] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'zerados' | 'criticos' | 'baixos'>('todos');
  const [copiado, setCopiado] = useState<boolean>(false);
  const [limiarInput, setLimiarInput] = useState<string>(String(limiarEstoqueMinimo));
  const [itemPerdaModal, setItemPerdaModal] = useState<ItemEstoque | null>(null);
  const [qtdPerdaInput, setQtdPerdaInput] = useState<string | number>(1);
  const [motivoPerdaInput, setMotivoPerdaInput] = useState<string>('Produto Vencido');
  const [msgPerda, setMsgPerda] = useState<string>('');

  React.useEffect(() => {
    setLimiarInput(String(limiarEstoqueMinimo));
  }, [limiarEstoqueMinimo]);

  React.useEffect(() => {
    if (visivel) {
      setAbaAtiva(abaInicial);
    }
  }, [visivel, abaInicial]);

  const handleVoltarOuFechar = () => {
    if (itemPerdaModal) {
      setItemPerdaModal(null);
      return;
    }
    onFechar();
  };

  const mapaCatalogoPorCodigo = useMemo(() => {
    const mapa = new Map<string, ProdutoCatalogo>();
    catalogoGlobal.forEach((c) => {
      const cod = String(c?.codigo || '').trim();
      if (cod && !mapa.has(cod)) mapa.set(cod, c);
    });
    return mapa;
  }, [catalogoGlobal]);

  useVoltarHierarquico(visivel, handleVoltarOuFechar);

  if (!visivel) return null;

  // Engine unificada de estoque baixo e validades (exclui internos/ilimitados e sem saldo)
  const {
    produtosEstoqueBaixo,
    countZerados,
    countCriticos,
    countBaixos,
    vencidosOuHoje: vencidos,
    vencendoEmAte10Dias,
    alertasValidade10Dias: proximoVencimento,
  } = calcularAlertasEstoque(estoque, limiarEstoqueMinimo, catalogoGlobal);

  const termoBusca = busca.trim().toLowerCase();
  const produtosBaixosFiltrados = produtosEstoqueBaixo.filter((p) => {
    const matchBusca = p.nome.toLowerCase().includes(termoBusca) || p.codigo.toLowerCase().includes(termoBusca);
    if (!matchBusca) return false;

    if (filtroStatus === 'zerados') return p.qtdTotal <= 0;
    if (filtroStatus === 'criticos') return p.statusEstoque === 'critico';
    if (filtroStatus === 'baixos') return p.statusEstoque === 'baixo';
    return true;
  });

  const gerarMensagemWhatsAppReposicao = () => {
    const dataFormatada = new Date().toLocaleDateString('pt-BR');
    let msg = `📦 *PEDIDO DE REPOSIÇÃO DE ESTOQUE (ESTOQUE BAIXO)* 📦\n`;
    msg += `🏪 *Loja:* ${nomeSupermercado || 'SUPERMERCADO'}\n`;
    msg += `📅 *Data da Solicitação:* ${dataFormatada}\n`;
    msg += `⚠️ *Limiar de Alerta Definido:* ≤ ${limiarEstoqueMinimo} unidades\n`;
    msg += `📊 *Total de Itens para Repor:* ${produtosEstoqueBaixo.length} produtos\n`;
    msg += `-----------------------------------\n\n`;

    if (produtosEstoqueBaixo.length === 0) {
      msg += `✅ *Excelente!* Nenhum item com estoque abaixo de ${limiarEstoqueMinimo} unidades no momento.\n`;
    } else {
      produtosEstoqueBaixo.forEach((p, idx) => {
        const statusTxt = p.qtdTotal <= 0 ? '🔴 ESGOTADO (0 un)' : `⚠️ Restam apenas ${p.qtdTotal} un`;
        msg += `${idx + 1}. *${p.nome}*\n`;
        msg += `   • Cód: ${p.codigo}\n`;
        msg += `   • Estoque Atual: ${p.qtdTotal} un (${statusTxt})\n`;
        msg += `   • Pedido Sugerido: *+${p.qtdSugeridaRepor} un*\n`;
        if (p.preco_custo && p.preco_custo > 0) {
          msg += `   • Último Custo: R$ ${p.preco_custo.toFixed(2)}\n`;
        }
        msg += `\n`;
      });
    }

    msg += `-----------------------------------\n`;
    msg += `Solicitação gerada via Central de Notificações do Supermercado.`;
    return msg;
  };

  const copiarListaReposicao = async () => {
    const texto = gerarMensagemWhatsAppReposicao();
    let sucesso = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(texto);
        sucesso = true;
      }
    } catch {
      sucesso = false;
    }

    if (!sucesso && typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = texto;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        sucesso = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        sucesso = false;
      }
    }

    if (sucesso) {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  const enviarWhatsAppReposicao = () => {
    const texto = gerarMensagemWhatsAppReposicao();
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  const aplicarNovoLimiar = (valor: number) => {
    const val = Math.max(1, Math.floor(valor));
    onAlterarLimiarEstoque(val);
    setLimiarInput(String(val));
  };

  return (
    <div
      className="modal"
      style={{ display: 'flex', zIndex: 10050 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleVoltarOuFechar();
      }}
    >
      <div
        className="modal-conteudo"
        style={{
          maxWidth: '920px',
          width: '96%',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          background: '#ffffff',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.28)',
        }}
      >
        {/* CABEÇALHO COMPACTO */}
        <div
          className="cab-modal"
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#ffffff',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 0,
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Bell size={18} strokeWidth={2.2} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.96rem', lineHeight: 1.2 }}>
                Central de Notificações & Alertas
              </div>
              <div style={{ fontSize: '0.73rem', opacity: 0.9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {nomeSupermercado}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleVoltarOuFechar}
            aria-label="Fechar Central de Notificações"
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '8px',
              width: '30px',
              height: '30px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ABAS SEGMENTADAS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '6px 12px',
            gap: '6px',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={() => setAbaAtiva('estoque_baixo')}
            style={{
              width: '100%',
              minWidth: 0,
              whiteSpace: 'nowrap',
              padding: '7px 8px',
              border: abaAtiva === 'estoque_baixo' ? '1px solid #cbd5e1' : '1px solid transparent',
              background: abaAtiva === 'estoque_baixo' ? '#ffffff' : 'transparent',
              color: abaAtiva === 'estoque_baixo' ? '#0369a1' : '#64748b',
              fontWeight: abaAtiva === 'estoque_baixo' ? 700 : 600,
              fontSize: '0.78rem',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: abaAtiva === 'estoque_baixo' ? '0 1px 2px rgba(15,23,42,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
            }}
          >
            <Package size={14} style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Estoque Baixo</span>
            <span
              style={{
                background: produtosEstoqueBaixo.length > 0 ? '#ef4444' : '#e2e8f0',
                color: produtosEstoqueBaixo.length > 0 ? '#ffffff' : '#64748b',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '999px',
                flexShrink: 0,
              }}
            >
              {produtosEstoqueBaixo.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('validade')}
            style={{
              width: '100%',
              minWidth: 0,
              whiteSpace: 'nowrap',
              padding: '7px 8px',
              border: abaAtiva === 'validade' ? '1px solid #cbd5e1' : '1px solid transparent',
              background: abaAtiva === 'validade' ? '#ffffff' : 'transparent',
              color: abaAtiva === 'validade' ? '#b45309' : '#64748b',
              fontWeight: abaAtiva === 'validade' ? 700 : 600,
              fontSize: '0.78rem',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: abaAtiva === 'validade' ? '0 1px 2px rgba(15,23,42,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
            }}
          >
            <AlertTriangle size={14} style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Validade</span>
            <span
              style={{
                background: proximoVencimento.length > 0 ? '#f59e0b' : '#e2e8f0',
                color: proximoVencimento.length > 0 ? '#ffffff' : '#64748b',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '999px',
                flexShrink: 0,
              }}
            >
              {proximoVencimento.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('resumo')}
            style={{
              width: '100%',
              minWidth: 0,
              whiteSpace: 'nowrap',
              padding: '7px 8px',
              border: abaAtiva === 'resumo' ? '1px solid #cbd5e1' : '1px solid transparent',
              background: abaAtiva === 'resumo' ? '#ffffff' : 'transparent',
              color: abaAtiva === 'resumo' ? '#0f172a' : '#64748b',
              fontWeight: abaAtiva === 'resumo' ? 700 : 600,
              fontSize: '0.78rem',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: abaAtiva === 'resumo' ? '0 1px 2px rgba(15,23,42,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
            }}
          >
            <BarChart3 size={14} style={{ flexShrink: 0 }} />
            <span>Resumo</span>
          </button>
        </div>

        {/* CORPO DO MODAL */}
        <div className="corpo-modal" style={{ padding: '14px 16px', overflowY: 'auto', flex: 1, background: '#f8fafc' }}>
          {/* ========================================================================= */}
          {/* ABA 1: ESTOQUE BAIXO & REPOSIÇÃO                                         */}
          {/* ========================================================================= */}
          {abaAtiva === 'estoque_baixo' && (
            <div>
              {/* TOOLBAR COMPACTA DE 2 LINHAS */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  marginBottom: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {/* Linha 1: Limiar de Reposição + Ações em lote */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 700,
                        fontSize: '0.76rem',
                        color: '#166534',
                      }}
                    >
                      <SlidersHorizontal size={14} />
                      <span>Mínimo:</span>
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="9999"
                      value={limiarInput}
                      onChange={(e) => setLimiarInput(e.target.value)}
                      onBlur={() => {
                        const num = parseInt(limiarInput, 10);
                        if (!isNaN(num) && num > 0) {
                          aplicarNovoLimiar(num);
                        } else {
                          setLimiarInput(String(limiarEstoqueMinimo));
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const num = parseInt(limiarInput, 10);
                          if (!isNaN(num) && num > 0) {
                            aplicarNovoLimiar(num);
                          }
                        }
                      }}
                      style={{
                        width: '52px',
                        height: '28px',
                        padding: '2px 6px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        borderRadius: '6px',
                        border: '1px solid #86efac',
                        background: '#f0fdf4',
                        color: '#15803d',
                      }}
                      title="Digite o limite de unidades para alerta de reposição"
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                      {[2, 3, 5, 10, 15, 20].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => aplicarNovoLimiar(val)}
                          style={{
                            padding: '2px 7px',
                            fontSize: '0.7rem',
                            fontWeight: limiarEstoqueMinimo === val ? 700 : 600,
                            background: limiarEstoqueMinimo === val ? '#16a34a' : '#f0fdf4',
                            color: limiarEstoqueMinimo === val ? '#ffffff' : '#15803d',
                            border: '1px solid #bbf7d0',
                            borderRadius: '999px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {val} un
                        </button>
                      ))}
                    </div>
                  </div>

                  {produtosEstoqueBaixo.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={enviarWhatsAppReposicao}
                        style={{
                          background: '#16a34a',
                          color: '#ffffff',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '7px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          height: '28px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <MessageCircle size={13} />
                        <span>Enviar WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={copiarListaReposicao}
                        style={{
                          background: copiado ? '#15803d' : '#f8fafc',
                          color: copiado ? '#ffffff' : '#334155',
                          border: '1px solid #cbd5e1',
                          padding: '5px 10px',
                          borderRadius: '7px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          height: '28px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {copiado ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiado ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Linha 2: Busca + Filtros de Severidade */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                    paddingTop: '8px',
                    borderTop: '1px solid #f1f5f9',
                  }}
                >
                  <div style={{ position: 'relative', flex: 1, minWidth: '170px' }}>
                    <Search
                      size={14}
                      style={{
                        position: 'absolute',
                        left: '9px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Buscar produto ou código..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      style={{
                        width: '100%',
                        height: '30px',
                        padding: '4px 10px 4px 28px',
                        fontSize: '0.78rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '7px',
                        boxSizing: 'border-box',
                        background: '#ffffff',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setFiltroStatus('todos')}
                      style={{
                        padding: '4px 9px',
                        fontSize: '0.71rem',
                        borderRadius: '7px',
                        border: filtroStatus === 'todos' ? '1px solid #0284c7' : '1px solid #cbd5e1',
                        background: filtroStatus === 'todos' ? '#0284c7' : '#ffffff',
                        color: filtroStatus === 'todos' ? '#ffffff' : '#475569',
                        fontWeight: filtroStatus === 'todos' ? 700 : 600,
                        cursor: 'pointer',
                      }}
                    >
                      Todos ({produtosEstoqueBaixo.length})
                    </button>
                    {countZerados > 0 && (
                      <button
                        type="button"
                        onClick={() => setFiltroStatus('zerados')}
                        style={{
                          padding: '4px 9px',
                          fontSize: '0.71rem',
                          borderRadius: '7px',
                          border: '1px solid #fca5a5',
                          background: filtroStatus === 'zerados' ? '#dc2626' : '#fef2f2',
                          color: filtroStatus === 'zerados' ? '#ffffff' : '#b91c1c',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Zerados ({countZerados})
                      </button>
                    )}
                    {countCriticos > 0 && (
                      <button
                        type="button"
                        onClick={() => setFiltroStatus('criticos')}
                        style={{
                          padding: '4px 9px',
                          fontSize: '0.71rem',
                          borderRadius: '7px',
                          border: '1px solid #fed7aa',
                          background: filtroStatus === 'criticos' ? '#ea580c' : '#fff7ed',
                          color: filtroStatus === 'criticos' ? '#ffffff' : '#c2410c',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Críticos ({countCriticos})
                      </button>
                    )}
                    {countBaixos > 0 && (
                      <button
                        type="button"
                        onClick={() => setFiltroStatus('baixos')}
                        style={{
                          padding: '4px 9px',
                          fontSize: '0.71rem',
                          borderRadius: '7px',
                          border: '1px solid #fde68a',
                          background: filtroStatus === 'baixos' ? '#ca8a04' : '#fefce8',
                          color: filtroStatus === 'baixos' ? '#ffffff' : '#a16207',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Baixos ({countBaixos})
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* LISTA EM GRADE 2 COLUNAS NO DESKTOP */}
              {produtosBaixosFiltrados.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '32px 16px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px dashed #cbd5e1',
                    color: '#64748b',
                  }}
                >
                  <CheckCircle2 size={32} style={{ color: '#16a34a', margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                    Nenhum item com estoque baixo
                  </div>
                  <p style={{ fontSize: '0.78rem', marginTop: '4px' }}>
                    Todos os produtos filtrados estão acima de {limiarEstoqueMinimo} unidades.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                    gap: '10px',
                  }}
                >
                  {produtosBaixosFiltrados.map((prod, idx) => {
                    const isZerado = prod.qtdTotal <= 0;
                    const isCritico = prod.statusEstoque === 'critico';

                    const corSeveridade = isZerado ? '#dc2626' : isCritico ? '#ea580c' : '#d97706';
                    const bgBadge = isZerado ? '#fef2f2' : isCritico ? '#fff7ed' : '#fefce8';
                    const textBadge = isZerado ? '#b91c1c' : isCritico ? '#c2410c' : '#a16207';
                    const borderBadge = isZerado ? '#fecaca' : isCritico ? '#fed7aa' : '#fde68a';
                    const textoBadge = isZerado
                      ? `Esgotado • ${prod.qtdTotal} un`
                      : isCritico
                      ? `Crítico • ${prod.qtdTotal} un`
                      : `Baixo • ${prod.qtdTotal} un`;

                    return (
                      <div
                        key={`estoque_baixo_${prod.codigo}_${idx}`}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderLeft: `4px solid ${corSeveridade}`,
                          borderRadius: '10px',
                          padding: '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '8px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
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
                                referrerPolicy="no-referrer"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              />
                            ) : (
                              <Package size={18} style={{ color: '#94a3b8' }} />
                            )}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
                              <div
                                style={{
                                  fontSize: '0.84rem',
                                  color: '#0f172a',
                                  fontWeight: 700,
                                  lineHeight: 1.3,
                                  wordBreak: 'break-word',
                                }}
                              >
                                {prod.nome}
                              </div>
                              <span
                                style={{
                                  background: bgBadge,
                                  color: textBadge,
                                  border: `1px solid ${borderBadge}`,
                                  fontSize: '0.66rem',
                                  fontWeight: 700,
                                  padding: '2px 6px',
                                  borderRadius: '999px',
                                  whiteSpace: 'nowrap',
                                  flexShrink: 0,
                                }}
                              >
                                {textoBadge}
                              </span>
                            </div>

                            <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '3px', lineHeight: 1.35 }}>
                              Cód: <b style={{ color: '#334155' }}>{prod.codigo}</b> | Venda:{' '}
                              <b style={{ color: '#334155' }}>R$ {Number(prod.preco_venda || 0).toFixed(2)}</b>
                              {prod.preco_custo ? ` | Custo: R$ ${Number(prod.preco_custo || 0).toFixed(2)}` : ''}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                              <div
                                style={{
                                  flex: 1,
                                  height: '5px',
                                  background: '#e2e8f0',
                                  borderRadius: '999px',
                                  overflow: 'hidden',
                                }}
                              >
                                <div
                                  style={{
                                    width: `${Math.min(100, (prod.qtdTotal / Math.max(1, limiarEstoqueMinimo)) * 100)}%`,
                                    height: '100%',
                                    background: corSeveridade,
                                  }}
                                ></div>
                              </div>
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#334155', whiteSpace: 'nowrap' }}>
                                Repor: +{prod.qtdSugeridaRepor} un
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            gap: '6px',
                            paddingTop: '6px',
                            borderTop: '1px solid #f1f5f9',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => onAbrirReposicao(prod)}
                            style={{
                              flex: 1.4,
                              height: '30px',
                              background: '#0284c7',
                              color: '#ffffff',
                              border: 'none',
                              padding: '0 10px',
                              borderRadius: '7px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                            }}
                            title="Entrada rápida de novo lote / reposição"
                          >
                            <Plus size={14} />
                            <span>Repor Estoque</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const msgItem = `📦 *PEDIDO DE REPOSIÇÃO*\n🏪 *Loja:* ${nomeSupermercado}\n📦 *Produto:* ${prod.nome}\n🔢 *Cód:* ${prod.codigo}\n📊 *Estoque Atual:* ${prod.qtdTotal} un\n🛒 *Pedido Sugerido:* +${prod.qtdSugeridaRepor} un`;
                              window.open(`https://wa.me/?text=${encodeURIComponent(msgItem)}`, '_blank');
                            }}
                            style={{
                              flex: 1,
                              height: '30px',
                              background: '#16a34a',
                              color: '#ffffff',
                              border: 'none',
                              padding: '0 10px',
                              borderRadius: '7px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                            }}
                            title="Enviar pedido individual no WhatsApp"
                          >
                            <MessageCircle size={13} />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* ABA 2: ALERTAS DE VALIDADE & VENCIMENTO                                   */}
          {/* ========================================================================= */}
          {abaAtiva === 'validade' && (
            <div>
              {/* FAIXA COMPACTA DE 1 LINHA */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} style={{ color: '#d97706', flexShrink: 0 }} />
                  <div style={{ fontSize: '0.78rem', color: '#334155' }}>
                    <b style={{ color: '#0f172a' }}>Monitor de Validades:</b> {vencidos.length} vencido(s)/hoje e{' '}
                    {vencendoEmAte10Dias.length} a vencer nos próximos 10 dias
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onAbrirAlertasWhatsApp}
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '7px',
                    padding: '5px 10px',
                    height: '28px',
                    fontWeight: 700,
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <MessageCircle size={13} />
                  <span>Relatório WhatsApp</span>
                </button>
              </div>

              {proximoVencimento.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    color: '#64748b',
                    padding: '32px 16px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px dashed #cbd5e1',
                  }}
                >
                  <CheckCircle2 size={32} style={{ color: '#16a34a', margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                    Nenhum alerta de validade nos próximos 10 dias
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                    gap: '10px',
                  }}
                >
                  {proximoVencimento.map(({ item: p, diasParaVencer: dias }, idx) => {
                    const isUrgente = dias <= 0;
                    const corSeveridade = isUrgente ? '#dc2626' : '#d97706';
                    const bgBadge = isUrgente ? '#fef2f2' : '#fef3c7';
                    const textBadge = isUrgente ? '#b91c1c' : '#92400e';
                    const borderBadge = isUrgente ? '#fecaca' : '#fde68a';

                    let textoStatus = '';
                    if (dias < 0) {
                      textoStatus = `Vencido há ${Math.abs(dias)}d`;
                    } else if (dias === 0) {
                      textoStatus = 'Vence HOJE';
                    } else {
                      textoStatus = `Vence em ${dias}d`;
                    }

                    const fotoItem = p.foto || (p.codigo ? mapaCatalogoPorCodigo.get(p.codigo.trim())?.imagem : undefined);

                    return (
                      <div
                        key={`val_${p.codigo}_${p.validade}_${p.lote}_${idx}`}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderLeft: `4px solid ${corSeveridade}`,
                          padding: '10px 12px',
                          borderRadius: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '8px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              flexShrink: 0,
                            }}
                          >
                            {fotoItem ? (
                              <img
                                src={fotoItem}
                                alt={p.nome}
                                referrerPolicy="no-referrer"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              />
                            ) : (
                              <Package size={18} style={{ color: '#94a3b8' }} />
                            )}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
                              <div
                                style={{
                                  color: '#0f172a',
                                  fontSize: '0.84rem',
                                  fontWeight: 700,
                                  lineHeight: 1.3,
                                  wordBreak: 'break-word',
                                }}
                              >
                                {p.nome}
                              </div>
                              <span
                                style={{
                                  background: bgBadge,
                                  color: textBadge,
                                  border: `1px solid ${borderBadge}`,
                                  fontSize: '0.66rem',
                                  fontWeight: 700,
                                  padding: '2px 6px',
                                  borderRadius: '999px',
                                  whiteSpace: 'nowrap',
                                  flexShrink: 0,
                                }}
                              >
                                {textoStatus}
                              </span>
                            </div>

                            <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '3px', lineHeight: 1.35 }}>
                              Lote: <b style={{ color: '#334155' }}>{p.lote || 'N/D'}</b> | Val:{' '}
                              <b style={{ color: '#334155' }}>{p.validade}</b> | Qtd:{' '}
                              <b style={{ color: '#334155' }}>{p.quantidade} un</b>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            gap: '6px',
                            flexWrap: 'wrap',
                            paddingTop: '6px',
                            borderTop: '1px solid #f1f5f9',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              const msgItem = `🚨 *ALERTA DE VALIDADE*\n🏪 *Loja:* ${nomeSupermercado}\n📦 *Produto:* ${p.nome}\n🔢 *Cód:* ${p.codigo}\n📅 *Validade:* ${p.validade} (${textoStatus})\n📊 *Estoque:* ${p.quantidade} un`;
                              window.open(`https://wa.me/?text=${encodeURIComponent(msgItem)}`, '_blank');
                            }}
                            style={{
                              flex: '1 1 85px',
                              height: '30px',
                              background: '#16a34a',
                              color: '#ffffff',
                              border: 'none',
                              padding: '0 8px',
                              borderRadius: '7px',
                              fontSize: '0.73rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                            }}
                          >
                            <MessageCircle size={13} />
                            <span>WhatsApp</span>
                          </button>

                          {dias <= 0 && onDarBaixaPerda && (
                            <button
                              type="button"
                              onClick={() => {
                                setItemPerdaModal(p);
                                setQtdPerdaInput(p.quantidade);
                                setMotivoPerdaInput('Produto Vencido');
                                setMsgPerda('');
                              }}
                              style={{
                                flex: '1.1 1 95px',
                                height: '30px',
                                background: '#dc2626',
                                color: '#ffffff',
                                border: 'none',
                                padding: '0 8px',
                                borderRadius: '7px',
                                fontSize: '0.73rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                              }}
                              title="Dar baixa de descarte / perda neste produto vencido"
                            >
                              <Trash2 size={13} />
                              <span>Baixa Perda</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onAbrirVenda(p.codigo, p.validade, p.lote || '')}
                            style={{
                              flex: '1.1 1 95px',
                              height: '30px',
                              background: '#0284c7',
                              color: '#ffffff',
                              border: 'none',
                              padding: '0 8px',
                              borderRadius: '7px',
                              fontSize: '0.73rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                            }}
                          >
                            <ShoppingCart size={13} />
                            <span>Vender / Ver</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* ABA 3: RESUMO GERAL DE ALERTAS (4 KPIs EM LINHA RESPONSIVA)               */}
          {/* ========================================================================= */}
          {abaAtiva === 'resumo' && (
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '10px',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #fecaca',
                    borderTop: '4px solid #dc2626',
                    borderRadius: '10px',
                    padding: '14px 12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setAbaAtiva('estoque_baixo');
                    setFiltroStatus('zerados');
                  }}
                >
                  <AlertCircle size={20} style={{ color: '#dc2626', margin: '0 auto 6px auto' }} />
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#991b1b', lineHeight: 1.1 }}>
                    {countZerados}
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#7f1d1d', marginTop: '4px' }}>
                    Itens Esgotados (0 un)
                  </div>
                </div>

                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #fed7aa',
                    borderTop: '4px solid #ea580c',
                    borderRadius: '10px',
                    padding: '14px 12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setAbaAtiva('estoque_baixo');
                    setFiltroStatus('todos');
                  }}
                >
                  <Package size={20} style={{ color: '#ea580c', margin: '0 auto 6px auto' }} />
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#c2410c', lineHeight: 1.1 }}>
                    {produtosEstoqueBaixo.length}
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#9a3412', marginTop: '4px' }}>
                    Abaixo do Limiar (≤ {limiarEstoqueMinimo})
                  </div>
                </div>

                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #fca5a5',
                    borderTop: '4px solid #b91c1c',
                    borderRadius: '10px',
                    padding: '14px 12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => setAbaAtiva('validade')}
                >
                  <Trash2 size={20} style={{ color: '#b91c1c', margin: '0 auto 6px auto' }} />
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#991b1b', lineHeight: 1.1 }}>
                    {vencidos.length}
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#7f1d1d', marginTop: '4px' }}>
                    Itens Vencidos / Hoje
                  </div>
                </div>

                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #fde68a',
                    borderTop: '4px solid #d97706',
                    borderRadius: '10px',
                    padding: '14px 12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => setAbaAtiva('validade')}
                >
                  <Clock size={20} style={{ color: '#d97706', margin: '0 auto 6px auto' }} />
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#b45309', lineHeight: 1.1 }}>
                    {vencendoEmAte10Dias.length}
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#78350f', marginTop: '4px' }}>
                    Vencendo em até 10 dias
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '0.78rem',
                  color: '#475569',
                  lineHeight: 1.45,
                }}
              >
                <b style={{ color: '#0f172a' }}>Dica do Gerente:</b> Mantenha o limiar de estoque mínimo ajustado ao
                giro da sua loja para receber sugestões automáticas de reposição antes de faltar mercadoria na gôndola.
              </div>
            </div>
          )}
        </div>

        {/* RODAPÉ ENXUTO */}
        <div
          style={{
            padding: '10px 16px',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
            {produtosEstoqueBaixo.length} item(ns) para repor • {proximoVencimento.length} alerta(s) de validade
          </span>
          <button
            type="button"
            onClick={handleVoltarOuFechar}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#334155',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Fechar
          </button>
        </div>
      </div>

      {/* DIÁLOGO DE CONFIRMAÇÃO DE BAIXA POR PERDA / VENCIMENTO */}
      {itemPerdaModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.72)',
            zIndex: 1000010,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: '#dc2626',
                color: '#ffffff',
                padding: '12px 16px',
                fontWeight: 700,
                fontSize: '0.94rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Trash2 size={16} />
              <span>Registro de Baixa por Perda</span>
            </div>

            <div style={{ padding: '16px' }}>
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fca5a5',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                }}
              >
                <b style={{ color: '#991b1b', fontSize: '0.88rem', display: 'block' }}>
                  {itemPerdaModal.nome}
                </b>
                <div style={{ fontSize: '0.76rem', color: '#7f1d1d', marginTop: '4px' }}>
                  <b>Cód:</b> {itemPerdaModal.codigo} | <b>Lote:</b> {itemPerdaModal.lote || 'N/D'}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#7f1d1d', marginTop: '2px' }}>
                  <b>Validade:</b> {itemPerdaModal.validade} (Vencido)
                </div>
                <div style={{ fontSize: '0.8rem', color: '#991b1b', marginTop: '4px', fontWeight: 700 }}>
                  Estoque disponível no lote: {itemPerdaModal.quantidade} un
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Quantidade para descartar / dar baixa:
                </label>
                <input
                  type="number"
                  min="1"
                  max={itemPerdaModal.quantidade}
                  value={qtdPerdaInput === '' ? '' : qtdPerdaInput}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setQtdPerdaInput('');
                      return;
                    }
                    const limpo = val.replace(/^0+(?=\d)/, '');
                    const num = parseInt(limpo, 10);
                    setQtdPerdaInput(isNaN(num) ? '' : num);
                  }}
                  onBlur={() => {
                    if (qtdPerdaInput === '' || Number(qtdPerdaInput) < 1) {
                      setQtdPerdaInput(1);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    fontSize: '0.9rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Motivo da Perda / Descarte:
                </label>
                <select
                  value={motivoPerdaInput}
                  onChange={(e) => setMotivoPerdaInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    fontSize: '0.84rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="Produto Vencido">Produto Vencido (Prazo de Validade Expirado)</option>
                  <option value="Avaria / Embalagem Violada">Avaria / Embalagem Violada ou Danificada</option>
                  <option value="Quebra / Degradação">Quebra ou Degradação Física</option>
                  <option value="Descarte Sanitário">Descarte Sanitário / Vigilância</option>
                </select>
              </div>

              {msgPerda && (
                <div style={{ marginBottom: '10px', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>
                  {msgPerda}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const qtdNum = typeof qtdPerdaInput === 'number' ? qtdPerdaInput : (parseInt(qtdPerdaInput, 10) || 0);
                    if (isNaN(qtdNum) || qtdNum < 1) {
                      setMsgPerda('Digite uma quantidade válida!');
                      return;
                    }
                    if (qtdNum > itemPerdaModal.quantidade) {
                      setMsgPerda('Quantidade maior que o estoque no lote!');
                      return;
                    }

                    if (onDarBaixaPerda) {
                      onDarBaixaPerda(
                        itemPerdaModal.codigo,
                        itemPerdaModal.validade,
                        itemPerdaModal.lote,
                        qtdNum,
                        motivoPerdaInput
                      );
                    }

                    setMsgPerda('Baixa de perda registrada com sucesso!');
                    setTimeout(() => {
                      setItemPerdaModal(null);
                      setMsgPerda('');
                    }, 700);
                  }}
                  style={{
                    flex: 1,
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                  }}
                >
                  Confirmar Baixa de Perda
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setItemPerdaModal(null);
                    setMsgPerda('');
                  }}
                  style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
