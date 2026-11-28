import React, { useState } from 'react';
import { ItemEstoque, Supermercado } from '../types';
import { useVoltarHierarquico } from '../hooks/useVoltarHierarquico';
import { filtrarAlertasValidadePorDias } from '../utils/alertasEstoque';

interface AlertasWhatsAppModalProps {
  visivel: boolean;
  onFechar: () => void;
  estoque: ItemEstoque[];
  loja: Supermercado | null;
}

export const AlertasWhatsAppModal: React.FC<AlertasWhatsAppModalProps> = ({
  visivel,
  onFechar,
  estoque,
  loja,
}) => {
  const [diasFiltro, setDiasFiltro] = useState<number>(30);
  const [copiado, setCopiado] = useState(false);

  useVoltarHierarquico(visivel, onFechar);

  if (!visivel) return null;

  const hoje = new Date();

  // Filtra itens físicos com saldo positivo vencidos ou a vencer nos próximos X dias
  const produtosAvisar = filtrarAlertasValidadePorDias(estoque, diasFiltro, hoje);

  // Formata mensagem para WhatsApp
  const nomeLoja = loja?.nome || 'SUPERMERCADO';
  const dataFormatada = hoje.toLocaleDateString('pt-BR');

  let mensagemWhatsApp = `🚨 *RELATÓRIO DE ALERTA DE VALIDADE* 🚨\n`;
  mensagemWhatsApp += `🏪 *Loja:* ${nomeLoja}\n`;
  mensagemWhatsApp += `📅 *Data do Relatório:* ${dataFormatada}\n`;
  mensagemWhatsApp += `⚠️ *Filtro:* Produtos vencendo em até ${diasFiltro} dias\n`;
  mensagemWhatsApp += `-----------------------------------\n\n`;

  if (produtosAvisar.length === 0) {
    mensagemWhatsApp += `✅ *Excelente!* Nenhum produto encontrado próximo do vencimento nos próximos ${diasFiltro} dias.\n`;
  } else {
    produtosAvisar.forEach(({ item: p, diasParaVencer: diffDays }, idx) => {
      const statusVal =
        diffDays < 0
          ? '❌ JÁ VENCIDO'
          : diffDays === 0
          ? '🔴 VENCE HOJE'
          : `⚠️ Vence em ${diffDays} dia(s)`;

      mensagemWhatsApp += `${idx + 1}. *${p.nome}*\n`;
      mensagemWhatsApp += `   • Cód: ${p.codigo} | Qtd: ${p.quantidade} un\n`;
      mensagemWhatsApp += `   • Validade: ${p.validade} (${statusVal})\n`;
      mensagemWhatsApp += `   • Preço Venda: R$ ${Number(p.preco_venda || 0).toFixed(2)}\n\n`;
    });

    mensagemWhatsApp += `-----------------------------------\n`;
    mensagemWhatsApp += `💡 *Recomendação:* Aplicar desconto promocional imediato nos itens apontados para liquidação de estoque!`;
  }

  const linkWhatsApp = `https://wa.me/?text=${encodeURIComponent(mensagemWhatsApp)}`;

  const handleCopiarTexto = async () => {
    let sucesso = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(mensagemWhatsApp);
        sucesso = true;
      }
    } catch {
      sucesso = false;
    }

    if (!sucesso && typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = mensagemWhatsApp;
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

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-container" style={{ maxWidth: '680px', width: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            📱 Alertas de Validade no WhatsApp / E-mail
          </h3>
          <button className="btn-fechar-modal" onClick={onFechar}>&times;</button>
        </div>

        <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', marginRight: '8px' }}>
              Período de Alerta:
            </label>
            <select
              className="input-padrao"
              value={diasFiltro}
              onChange={(e) => setDiasFiltro(Number(e.target.value))}
              style={{ width: 'auto', display: 'inline-block' }}
            >
              <option value={7}>🚨 Próximos 7 dias (Urgente)</option>
              <option value={15}>⚠️ Próximos 15 dias</option>
              <option value={30}>📅 Próximos 30 dias</option>
              <option value={60}>📆 Próximos 60 dias</option>
            </select>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#0369a1', fontWeight: 600 }}>
            {produtosAvisar.length} produto(s) requerem atenção
          </div>
        </div>

        {/* PRÉ-VISUALIZAÇÃO DA MENSAGEM */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
            Pré-visualização da Mensagem Pronta para Envio:
          </label>
          <textarea
            readOnly
            className="input-padrao"
            rows={10}
            value={mensagemWhatsApp}
            style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.82rem', background: '#f1f5f9', color: '#0f172a' }}
          />
        </div>

        {/* BOTOES DE DISPARO */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a
            href={linkWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              flex: '1 1 180px',
              width: '100%',
              background: '#25D366',
              color: '#fff',
              textAlign: 'center',
              padding: '12px',
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: '6px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            📲 Enviar Direto no WhatsApp
          </a>

          <button
            className="btn btn-salvar"
            style={{ flex: '1 1 180px', width: '100%', padding: '12px', fontSize: '0.95rem' }}
            onClick={handleCopiarTexto}
          >
            {copiado ? '✅ Mensagem Copiada!' : '📋 Copiar para E-mail / Clipboard'}
          </button>
        </div>
      </div>
    </div>
  );
};
