import React, { useState, useMemo } from 'react';
import { PermissoesOperador, PermissoesLoja, SessaoUsuario } from '../types';

interface ManualUsuarioModalProps {
  visivel: boolean;
  onFechar: () => void;
  perfilAtivo?: 'dona_app' | 'admin_loja' | 'caixa';
  sessao?: SessaoUsuario | null;
  permissoesOperador?: PermissoesOperador;
  permissoesLoja?: PermissoesLoja;
  nomeLoja?: string;
  nomeOperador?: string;
}

interface TopicoManual {
  id: string;
  icone: string;
  titulo: string;
  categoria: string;
  destaque?: string;
  conteudo: React.ReactNode;
}

export const ManualUsuarioModal: React.FC<ManualUsuarioModalProps> = ({
  visivel,
  onFechar,
  perfilAtivo,
  sessao,
  permissoesOperador,
  permissoesLoja,
  nomeLoja,
  nomeOperador,
}) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [topicoSelecionadoId, setTopicoSelecionadoId] = useState<string>('pdv_vendas');

  const tipoUsuario = perfilAtivo || sessao?.tipo || 'caixa';
  const isDono = tipoUsuario === 'dona_app';
  const isAdminLoja = tipoUsuario === 'admin_loja';
  const isCaixa = tipoUsuario === 'caixa' || (!isDono && !isAdminLoja);

  // Geração dinâmica e estritamente filtrada por permissões dos tópicos do manual
  const topicos = useMemo(() => {
    const lista: TopicoManual[] = [];

    // =========================================================================
    // 1. FRENTE DE CAIXA (PDV & VENDAS)
    // =========================================================================
    const temPermissaoVenda = isDono || isAdminLoja || (permissoesLoja?.caixa !== false && permissoesOperador?.vender !== false);
    if (temPermissaoVenda) {
      lista.push({
        id: 'pdv_vendas',
        icone: '🛒',
        titulo: 'Frente de Caixa (PDV) & Registro de Vendas',
        categoria: 'Frente de Caixa (PDV)',
        destaque: 'Bipagem, Balança e Operação',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '14px 16px', color: '#0369a1' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>💡</span>
                <span>Visão Geral do PDV</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5 }}>
                O módulo de Frente de Caixa foi projetado para máxima velocidade e agilidade no atendimento de balcão. Ele funciona de forma sincronizada e contínua em computadores com leitores USB, celulares ou tablets.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#0284c7', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>1</span>
                <span>Como Adicionar Itens ao Carrinho (3 Maneiras)</span>
              </h4>
              <ul style={{ paddingLeft: '20px', lineHeight: 1.6, margin: 0, fontSize: '0.88rem', color: '#334155' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>🔫 Leitor de Código de Barras Físico (USB / Bluetooth):</strong> O cursor permanece pronto no campo de bipagem. Ao passar o leitor no produto, o item entra no carrinho instantaneamente com foto, preço e cálculo de subtotal.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>📷 Câmera Integrada de Bipagem Contínua:</strong> Clique no botão <em>"📷 Abrir Câmera"</em>. A câmera permanece aberta e ativa na tela permitindo bipar múltiplos produtos seguidos com lanterna/flash, virar câmera e som de bipe de caixa a cada leitura.
                </li>
                <li>
                  <strong>🔍 Busca Manual Inteligente:</strong> Digite o nome, marca, categoria ou código do produto no campo de busca para selecioná-lo rapidamente com um toque.
                </li>
              </ul>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#0284c7', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>2</span>
                <span>Produtos Pesáveis & Etiquetas de Balança (KG)</span>
              </h4>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                O sistema possui decodificador nativo de balança no padrão nacional <strong>EAN-13 iniciado em '2'</strong> (Toledo, Filizola, Elgin, Urano):
              </p>
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', color: '#1e293b' }}>
                ⚖️ Ao bipar uma etiqueta de balança (ex: queijo, carnes, pães, frios), o PDV identifica o código interno do item no estoque, calcula o peso líquido em gramas e insere o valor total exato na compra automaticamente.
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#0284c7', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>3</span>
                <span>Ajuste de Quantidades, Exclusão de Itens e Descontos</span>
              </h4>
              <ul style={{ paddingLeft: '20px', lineHeight: 1.6, margin: 0, fontSize: '0.88rem', color: '#334155' }}>
                <li><strong>Multiplicar Quantidade:</strong> Use os botões <code>[+]</code> e <code>[-]</code> ou digite o número exato no carrinho.</li>
                <li><strong>Remover Item:</strong> Clique no botão 🗑️ ao lado do produto se o cliente desistir do item.</li>
                {(!isCaixa || permissoesOperador?.dar_desconto) && (
                  <li><strong>Conceder Desconto:</strong> É possível aplicar desconto percentual (%) ou valor em reais (R$) antes de finalizar.</li>
                )}
              </ul>
            </div>
          </div>
        ),
      });

      lista.push({
        id: 'formas_pagamento',
        icone: '💳',
        titulo: 'Formas de Pagamento, Troco & Emissão de Comprovante',
        categoria: 'Frente de Caixa (PDV)',
        destaque: 'Dinheiro, PIX, Cartão e Cupom',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#0f172a' }}>Como Finalizar a Venda no Caixa:</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
              Após bipar todos os produtos do cliente, selecione o meio de pagamento desejado:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.9rem', marginBottom: '4px' }}>💵 Dinheiro (Espécie)</div>
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                  Digite o valor em cédulas entregue pelo cliente. O sistema calcula e destaca o <strong>Troco Exato</strong> em verde na tela.
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontWeight: 800, color: '#0284c7', fontSize: '0.9rem', marginBottom: '4px' }}>📱 PIX Instantâneo</div>
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                  Apresenta o valor exato a ser cobrado. O operador confere a notificação no aplicativo bancário e confirma a venda.
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontWeight: 800, color: '#7c3aed', fontSize: '0.9rem', marginBottom: '4px' }}>💳 Cartão de Crédito / Débito</div>
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                  Insira ou aproxime o cartão na maquininha física da sua loja e confirme a transação no PDV.
                </div>
              </div>

              {(!isCaixa || permissoesOperador?.gerenciar_devedores) && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontWeight: 800, color: '#dc2626', fontSize: '0.9rem', marginBottom: '4px' }}>📝 Compra em Fiado</div>
                  <div style={{ fontSize: '0.82rem', color: '#991b1b' }}>
                    Vincula a compra ao cliente cadastrado. O sistema valida o limite de crédito e lança o débito na caderneta.
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '14px 16px', color: '#065f46' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🖨️</span>
                <span>Emissão e Impressão de Cupom Térmico (58mm / 80mm)</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', lineHeight: 1.5 }}>
                Ao concluir a venda, o cupom é gerado na tela com a relação de itens, subtotais, forma de pagamento e dados do supermercado. É possível:
              </p>
              <ul style={{ paddingLeft: '18px', marginTop: '6px', marginBottom: 0, fontSize: '0.84rem' }}>
                <li><strong>Imprimir na Impressora Térmica:</strong> Compatível com qualquer impressora de bobina USB, Wi-Fi ou Bluetooth.</li>
                <li><strong>Salvar em PDF:</strong> Guarda uma cópia digital do comprovante.</li>
                <li><strong>Enviar por WhatsApp:</strong> Envia o cupom formatado diretamente para o número do cliente.</li>
              </ul>
            </div>
          </div>
        ),
      });
    }

    // =========================================================================
    // 2. GESTÃO DE CAIXA E TURNOS (APENAS SE PERMITIDO)
    // =========================================================================
    const temPermissaoCaixaTurno = isDono || isAdminLoja || (permissoesLoja?.gestao_caixa !== false && permissoesOperador?.gestao_caixa !== false);
    if (temPermissaoCaixaTurno) {
      lista.push({
        id: 'gestao_caixa_turnos',
        icone: '💵',
        titulo: 'Abertura, Sangria, Suprimento e Fechamento de Caixa',
        categoria: 'Gestão de Caixa & Gaveta',
        destaque: 'Conferência Cega e Fundo de Troco',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px 16px', color: '#166534' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '4px' }}>🔒 Controle Rigoroso de Gaveta</div>
              <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5 }}>
                Cada operador tem seu turno individual e isolado. O sistema controla todas as entradas e saídas de valores para garantir total transparência no fechamento.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                <h5 style={{ margin: '0 0 6px 0', fontSize: '0.92rem', color: '#0f172a', fontWeight: 800 }}>1. Abertura do Turno de Caixa</h5>
                <p style={{ margin: 0, fontSize: '0.86rem', color: '#334155', lineHeight: 1.5 }}>
                  Ao iniciar o dia de trabalho, acesse <strong>"💵 Caixa / Turno"</strong>, informe o valor físico do <em>Fundo de Troco Inicial</em> (ex: R$ 100,00) que está na gaveta e confirme com seu PIN.
                </p>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                <h5 style={{ margin: '0 0 6px 0', fontSize: '0.92rem', color: '#0f172a', fontWeight: 800 }}>2. Sangria (Retirada de Dinheiro)</h5>
                <p style={{ margin: 0, fontSize: '0.86rem', color: '#334155', lineHeight: 1.5 }}>
                  Quando a gaveta acumular muitas notas, lance uma sangria com o valor retirado e a justificativa (ex: <em>"Envio ao cofre da gerência"</em>). O valor é subtraído do saldo em espécie da gaveta.
                </p>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                <h5 style={{ margin: '0 0 6px 0', fontSize: '0.92rem', color: '#0f172a', fontWeight: 800 }}>3. Suprimento (Entrada de Troco Extra)</h5>
                <p style={{ margin: 0, fontSize: '0.86rem', color: '#334155', lineHeight: 1.5 }}>
                  Utilize sempre que a gerência fornecer moedas ou notas extras de troco durante o expediente.
                </p>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                <h5 style={{ margin: '0 0 6px 0', fontSize: '0.92rem', color: '#0f172a', fontWeight: 800 }}>4. Fechamento de Caixa (Conferência Cega)</h5>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.86rem', color: '#334155', lineHeight: 1.5 }}>
                  No final do dia, conte fisicamente as cédulas, moedas e canhotos de cartão. Digite os valores conferidos. O sistema compara o valor esperado pelo sistema com o valor digitado e emite o resumo com sobras ou faltas.
                </p>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', color: '#92400e' }}>
                  ⚠️ <strong>Regra de Segurança:</strong> O sistema não permite deslogar ou sair do terminal enquanto o caixa estiver aberto para evitar perda de controle da gaveta.
                </div>
              </div>
            </div>
          </div>
        ),
      });
    }

    // =========================================================================
    // 3. CONTROLE DE ESTOQUE & LOTES (APENAS SE PERMITIDO)
    // =========================================================================
    const temPermissaoEstoque = isDono || isAdminLoja || (permissoesLoja?.estoque !== false && (permissoesOperador?.cadastrar_produtos !== false || permissoesOperador?.alterar_preco !== false));
    if (temPermissaoEstoque) {
      lista.push({
        id: 'estoque_cadastro_lotes',
        icone: '📦',
        titulo: 'Cadastro de Produtos, Lotes, Fotos & Margem de Lucro',
        categoria: 'Estoque & Mercadorias',
        destaque: 'Múltiplos Lotes e Catálogo Global',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#0f172a' }}>Como Cadastrar e Gerenciar Produtos no Estoque</h4>
              <ol style={{ paddingLeft: '20px', lineHeight: 1.6, margin: 0, fontSize: '0.88rem', color: '#334155' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Código de Barras (EAN):</strong> Bipe o código de barras com o leitor ou digite o número. Se for um produto conhecido, o sistema preenche o nome e a foto do <em>Catálogo Global</em> automaticamente.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Preço de Custo e Preço de Venda:</strong> Ao preencher o custo e a venda, o sistema calcula a <strong>Margem de Lucro (%)</strong> e o lucro bruto em reais instantaneamente.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Múltiplos Lotes e Validades:</strong> Um mesmo produto pode ter lotes separados com datas de vencimento diferentes (ex: Lote 1 vence em 10 dias, Lote 2 vence em 90 dias).
                </li>
                <li>
                  <strong>Fotos do Produto:</strong> Adicione fotos pela câmera do celular, galeria ou aproveite a foto do banco master.
                </li>
              </ol>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px' }}>
              <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>📦 Estoque Mínimo e Reposição</strong>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                Defina a quantidade mínima de segurança para cada mercadoria. Quando o estoque atingir esse patamar, o sistema sinaliza com alerta amarelo para que novas compras sejam feitas antes da ruptura.
              </p>
            </div>
          </div>
        ),
      });
    }

    // =========================================================================
    // 4. PAINEL DE VALIDADES & ALERTAS (APENAS SE PERMITIDO)
    // =========================================================================
    const temPermissaoAlertas = isDono || isAdminLoja || permissoesLoja?.alertas !== false;
    if (temPermissaoAlertas) {
      lista.push({
        id: 'validades_alertas',
        icone: '🔔',
        titulo: 'Monitor de Validades Próximas & Prevenção de Prejuízos',
        categoria: 'Validades & Prevenção de Perdas',
        destaque: '15, 30 e 60 Dias para Vencer',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
              O sistema classifica automaticamente todas as mercadorias por proximidade de vencimento:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>🚨</div>
                <div style={{ fontWeight: 800, color: '#dc2626', fontSize: '0.92rem' }}>Até 15 Dias</div>
                <div style={{ fontSize: '0.78rem', color: '#991b1b', marginTop: '4px' }}>
                  <strong>Ação Imediata:</strong> Colocar em gôndola de promoção relâmpago ou negociar troca com o fornecedor.
                </div>
              </div>

              <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>⚠️</div>
                <div style={{ fontWeight: 800, color: '#d97706', fontSize: '0.92rem' }}>Até 30 Dias</div>
                <div style={{ fontSize: '0.78rem', color: '#92400e', marginTop: '4px' }}>
                  <strong>Atenção:</strong> Reposicionar na frente da prateleira (conceito PEPS: Primeiro que Vence, Primeiro que Sai).
                </div>
              </div>

              <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>📅</div>
                <div style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.92rem' }}>Até 60 Dias</div>
                <div style={{ fontSize: '0.78rem', color: '#1e40af', marginTop: '4px' }}>
                  <strong>Planejamento:</strong> Monitoramento de giro e ajuste nos pedidos de compras futuras.
                </div>
              </div>
            </div>
          </div>
        ),
      });
    }

    // =========================================================================
    // 5. BAIXA MANUAL DE ESTOQUE (APENAS SE PERMITIDO)
    // =========================================================================
    const temPermissaoBaixa = isDono || isAdminLoja || (permissoesLoja?.baixa_estoque !== false && permissoesOperador?.baixa_estoque !== false);
    if (temPermissaoBaixa) {
      lista.push({
        id: 'baixa_manual_estoque',
        icone: '🗑️',
        titulo: 'Baixa Manual de Estoque (Perdas, Avarias & Vencidos)',
        categoria: 'Estoque & Mercadorias',
        destaque: 'Auditoria de Perdas',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '14px 16px', color: '#991b1b' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '4px' }}>🗑️ Registro Oficial de Baixas</div>
              <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5 }}>
                Quando uma mercadoria quebrar, sofrer avaria ou atingir a data de validade, ela deve ter sua baixa registrada no sistema para manter o inventário 100% fiel ao estoque físico.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#0f172a' }}>Motivos Disponíveis para Lançamento:</h4>
              <ul style={{ paddingLeft: '20px', lineHeight: 1.6, margin: 0, fontSize: '0.88rem', color: '#334155' }}>
                <li><strong>Produto Vencido:</strong> Item atingiu a data de validade e foi descartado.</li>
                <li><strong>Embalagem Avariada / Quebrada:</strong> Dano físico que inviabiliza a venda ao consumidor.</li>
                <li><strong>Consumo Interno:</strong> Material utilizado pela própria equipe ou padaria/cozinha da loja.</li>
                <li><strong>Extravio / Furto:</strong> Divergência identificada durante contagem de inventário.</li>
              </ul>
            </div>
          </div>
        ),
      });
    }

    // =========================================================================
    // 6. CADERNETA DE FIADO (APENAS SE PERMITIDO)
    // =========================================================================
    const temPermissaoFiado = isDono || isAdminLoja || (permissoesLoja?.devedores !== false && permissoesOperador?.gerenciar_devedores !== false);
    if (temPermissaoFiado) {
      lista.push({
        id: 'caderneta_fiado',
        icone: '📖',
        titulo: 'Caderneta Digital de Fiado & Cobrança WhatsApp',
        categoria: 'Clientes & Fiado',
        destaque: 'Limite de Crédito e Extrato',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#0f172a' }}>Controle Seguro de Compras a Prazo</h4>
              <ul style={{ paddingLeft: '20px', lineHeight: 1.6, margin: 0, fontSize: '0.88rem', color: '#334155' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Cadastro do Cliente:</strong> Registre Nome, Telefone com WhatsApp, CPF e o <strong>Limite Máximo de Fiado</strong> autorizado para o cliente.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Venda no Fiado:</strong> No momento da venda, selecione "Fiado" e escolha o cliente. O saldo devedor atualiza instantaneamente. Se a compra ultrapassar o limite, o sistema emite um alerta de confirmação.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Baixa e Recebimento de Pagamentos:</strong> Quando o cliente comparecer para pagar, clique em <em>"Registrar Pagamento"</em> e informe o valor recebido (parcial ou quitação total). O comprovante de quitação é emitido na hora.
                </li>
                <li>
                  <strong>📲 Lembrete Amigável por WhatsApp:</strong> Clique no botão do WhatsApp ao lado do cliente para enviar o extrato detalhado com as compras e o saldo devido em apenas 1 clique.
                </li>
              </ul>
            </div>
          </div>
        ),
      });
    }

    // =========================================================================
    // 7. IMPRESSÃO DE ETIQUETAS (APENAS SE PERMITIDO)
    // =========================================================================
    const temPermissaoEtiquetas = isDono || isAdminLoja || (permissoesLoja?.etiquetas !== false && permissoesOperador?.imprimir_etiquetas !== false);
    if (temPermissaoEtiquetas) {
      lista.push({
        id: 'etiquetas_gondola',
        icone: '🏷️',
        titulo: 'Impressão de Etiquetas de Gôndola & Cartazes',
        categoria: 'Etiquetas & Preços',
        destaque: 'Impressoras Térmicas e Folhas A4',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#0f172a' }}>Padronização dos Preços nas Prateleiras</h4>
              <ul style={{ paddingLeft: '20px', lineHeight: 1.6, margin: 0, fontSize: '0.88rem', color: '#334155' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Modelos Disponíveis:</strong> Etiqueta de Gôndola Pequena, Etiqueta Média com Código de Barras e Cartaz Grande de Oferta Promocional.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Seleção em Massa:</strong> Filtre por categoria ou selecione os itens que tiveram reajuste recente de preço para imprimir apenas as etiquetas alteradas.
                </li>
                <li>
                  <strong>Compatibilidade:</strong> Imprime diretamente em impressoras térmicas de etiqueta (Zebra, Elgin, Argox) ou em folhas adesivas comuns A4 (Pimaco).
                </li>
              </ul>
            </div>
          </div>
        ),
      });
    }

    // =========================================================================
    // 8. RELATÓRIOS GERENCIAIS & CURVA ABC (APENAS SE PERMITIDO)
    // =========================================================================
    const temPermissaoRelatorios = isDono || isAdminLoja || (permissoesLoja?.relatorios !== false && permissoesOperador?.ver_relatorios !== false);
    if (temPermissaoRelatorios) {
      lista.push({
        id: 'relatorios_faturamento',
        icone: '📊',
        titulo: 'Relatórios de Vendas, Faturamento, Curva ABC & Estornos',
        categoria: 'Gestão & Relatórios',
        destaque: 'Faturamento, Lucratividade e Estorno',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#0f172a' }}>Recursos do Módulo de Relatórios:</h4>
              <ul style={{ paddingLeft: '20px', lineHeight: 1.6, margin: 0, fontSize: '0.88rem', color: '#334155' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Filtro por Período:</strong> Consulte o faturamento de Hoje, dos últimos 7 dias, do Mês ou defina um intervalo de datas personalizado.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Divisão por Forma de Pagamento:</strong> Veja o total arrecadado discriminado por Dinheiro, PIX, Cartão de Crédito, Débito e Fiado.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Curva ABC (Mais Vendidos):</strong> Identifique com precisão quais são os produtos responsáveis pela maior parte do faturamento e do lucro da sua loja.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Exportação em Excel (.CSV):</strong> Baixe planilhas completas com um clique para enviar ao escritório de contabilidade.
                </li>
                {(isDono || isAdminLoja || permissoesOperador?.estornar_venda) && (
                  <li>
                    <strong>↩️ Estorno e Cancelamento de Vendas:</strong> Permite cancelar uma venda com erro. Ao confirmar o estorno, os produtos retornam automaticamente ao estoque e um log de auditoria é gravado com o nome do operador e motivo.
                  </li>
                )}
              </ul>
            </div>
          </div>
        ),
      });
    }

    // =========================================================================
    // 9. INTELIGÊNCIA DE ESTOQUE (APENAS SE PERMITIDO)
    // =========================================================================
    const temPermissaoInteligencia = isDono || isAdminLoja || (permissoesLoja?.inteligencia_estoque !== false && permissoesOperador?.inteligencia_estoque !== false);
    if (temPermissaoInteligencia) {
      lista.push({
        id: 'inteligencia_compras',
        icone: '💡',
        titulo: 'Inteligência de Compras, Giro de Estoque & Sugestão de Pedidos',
        categoria: 'Inteligência & Giro',
        destaque: 'Previsão de Ruptura',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px 16px', color: '#166534' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '4px' }}>💡 Compras Otimizadas Sem Prejuízo</div>
              <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5 }}>
                O algoritmo analisa o histórico de vendas diárias e prevê com quantos dias o estoque de cada mercadoria irá se esgotar.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <ul style={{ paddingLeft: '20px', lineHeight: 1.6, margin: 0, fontSize: '0.88rem', color: '#334155' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Sugestão Automática de Reposição:</strong> Calcula a quantidade exata que você deve pedir ao fornecedor para manter a loja abastecida pelo período desejado.
                </li>
                <li>
                  <strong>Alerta de Itens Parados (Sem Giro):</strong> Detecta mercadorias com estoque alto e pouca saída para que você faça promoções e recupere o capital de giro.
                </li>
              </ul>
            </div>
          </div>
        ),
      });
    }

    // =========================================================================
    // 10. GESTÃO DE EQUIPE & PERMISSÕES (APENAS SE PERMITIDO)
    // =========================================================================
    const temPermissaoEquipe = isDono || isAdminLoja || (permissoesLoja?.usuarios !== false && permissoesOperador?.gerenciar_equipe !== false);
    if (temPermissaoEquipe) {
      lista.push({
        id: 'gestao_equipe_permissoes',
        icone: '👥',
        titulo: 'Cadastro de Operadores & Controle de Permissões Granulares',
        categoria: 'Equipe & Usuários',
        destaque: 'RBAC e Segurança de Acesso',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#0f172a' }}>Como Gerenciar Acessos dos Funcionários:</h4>
              <ul style={{ paddingLeft: '20px', lineHeight: 1.6, margin: 0, fontSize: '0.88rem', color: '#334155' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Cadastro de Operador:</strong> Clique em <em>"👥 Operadores / Equipe"</em>, informe o Nome, CPF ou Login e defina a Senha/PIN de 4 dígitos.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Perfis Prontos (1 Clique):</strong> Aplique modelos automáticos como <em>Operador de Caixa</em>, <em>Repositor</em>, <em>Supervisor</em> ou <em>Administrador</em>.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Permissões Específicas:</strong> Habilite ou restrinja recursos sensíveis (ex: aplicar descontos, abrir/fechar caixa, estornar vendas, dar baixa em perdas, ver relatórios financeiros).
                </li>
                <li>
                  <strong>Bloqueio Imediato:</strong> Ao inativar um operador, o acesso dele é revogado instantaneamente em qualquer terminal.
                </li>
              </ul>
            </div>
          </div>
        ),
      });
    }

    // =========================================================================
    // 11. SESSÃO ÚNICA POR DISPOSITIVO (TODOS OS USUÁRIOS)
    // =========================================================================
    lista.push({
      id: 'sessao_unica_dispositivo',
      icone: '📱',
      titulo: 'Sessão Única por Conta & Desconexão Automática Multi-Aparelhos',
      categoria: 'Segurança & Acesso',
      destaque: 'Proteção Anti-Fraude e Sessão Ativa',
      conteudo: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '12px', padding: '14px 16px', color: '#92400e' }}>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🔐</span>
              <span>Como Funciona a Desconexão Automática de Segurança</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5 }}>
              Para garantir total integridade nas vendas, responsabilidade financeira do operador de caixa e segurança das senhas, o sistema aplica a <strong>Regra de Sessão Única Concorrente</strong>.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#0f172a' }}>Exemplo Prático de Funcionamento:</h4>
            <ol style={{ paddingLeft: '20px', lineHeight: 1.6, margin: 0, fontSize: '0.88rem', color: '#334155' }}>
              <li style={{ marginBottom: '8px' }}>
                Você faz login com o seu usuário e senha no <strong>Celular</strong>. O celular passa a ser o dispositivo ativo.
              </li>
              <li style={{ marginBottom: '8px' }}>
                Posteriormente, você vai até o <strong>Computador</strong> e entra com a <em>mesma conta de usuário e mesma senha</em>.
              </li>
              <li>
                <strong>Desconexão Imediata:</strong> O sistema detecta o novo acesso e <strong>encerra automaticamente a sessão do Celular</strong>, exibindo na tela do celular a mensagem informativa: <em>"Sessão Conectada em Outro Aparelho"</em>.
              </li>
            </ol>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px 14px', fontSize: '0.84rem', color: '#334155' }}>
            🛡️ <strong>Proteção Contra Força Bruta:</strong> Após 5 tentativas incorretas consecutivas de senha, o sistema bloqueia tentativas pelo período de 5 minutos com contador regressivo em tempo real.
          </div>
        </div>
      ),
    });

    // =========================================================================
    // 12. MODO 100% OFFLINE & NUVEM FIREBASE (TODOS OS USUÁRIOS)
    // =========================================================================
    lista.push({
      id: 'modo_offline_nuvem',
      icone: '📶',
      titulo: 'Funcionamento 100% Offline & Sincronização em Nuvem Firebase',
      categoria: 'Conexão & Nuvem',
      destaque: 'Fila Prioritária de Sincronização',
      conteudo: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px 16px', color: '#166534' }}>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '4px' }}>✅ O Supermercado Nunca Para!</div>
            <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5 }}>
              Mesmo em casos de queda no provedor de internet, corte de sinal de Wi-Fi ou instabilidades na rede, o sistema continua registrando vendas, bipando produtos e calculando troco normalmente.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#0f172a' }}>Ciclo da Sincronização Automática:</h4>
            <ol style={{ paddingLeft: '20px', lineHeight: 1.6, margin: 0, fontSize: '0.88rem', color: '#334155' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Durante a Ausência de Internet:</strong> As vendas são salvas na memória local criptografada do dispositivo com status <em>"Pendente de Sincronização"</em>.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Ao Retornar o Sinal:</strong> O sistema detecta a conexão em segundo plano e processa a <strong>Fila Prioritária</strong>, enviando todas as vendas acumuladas para a nuvem Firebase sem travar o operador.
              </li>
              <li>
                <strong>Indicador de Status:</strong> O ícone no cabeçalho sinaliza em verde (Online & Sincronizado) ou em laranja (Offline / Sincronizando fila pendente).
              </li>
            </ol>
          </div>
        </div>
      ),
    });

    // =========================================================================
    // 13. ATALHOS DE TECLADO NO PDV (TODOS OS USUÁRIOS)
    // =========================================================================
    lista.push({
      id: 'atalhos_teclado',
      icone: '⌨️',
      titulo: 'Guia Rápido de Teclas de Atalho no PDV',
      categoria: 'Agilidade & Atalhos',
      destaque: 'Atendimento Rápido no Balcão',
      conteudo: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
            Utilize os atalhos de teclado para agilizar o atendimento nas filas do caixa:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>Focar Campo de Código de Barras / Bipar</div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Coloca o cursor no campo para receber leitura da pistola</div>
              </div>
              <kbd style={{ background: '#0284c7', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.82rem' }}>Enter ou F2</kbd>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>Finalizar Venda / Ir para Pagamento</div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Abre o modal de seleção de forma de pagamento</div>
              </div>
              <kbd style={{ background: '#16a34a', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.82rem' }}>F4 ou Espaço</kbd>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>Buscar Produto por Nome / Catálogo</div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Abre o catálogo de busca rápida</div>
              </div>
              <kbd style={{ background: '#7c3aed', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.82rem' }}>F3</kbd>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>Cancelar Venda Atual / Fechar Modal</div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Cancela os itens bipados ou fecha a tela aberta</div>
              </div>
              <kbd style={{ background: '#dc2626', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.82rem' }}>Esc</kbd>
            </div>
          </div>
        </div>
      ),
    });

    // =========================================================================
    // 14. EXCLUSIVO: DONA DO APLICATIVO (RODRIGO SOUZA / MASTER)
    // =========================================================================
    if (isDono) {
      lista.push({
        id: 'gestao_master_lojas',
        icone: '👑',
        titulo: 'Licenciamento Multi-Lojas, Bloqueio Remoto & Catálogo Master',
        categoria: 'Área Master (Proprietária)',
        destaque: 'Exclusivo Proprietário(a) do App',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#fdf4ff', border: '1px solid #f0abfc', borderRadius: '12px', padding: '14px 16px', color: '#86198f' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '4px' }}>👑 Gestão Central de Todos os Supermercados</div>
              <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5 }}>
                Como administradora geral do sistema, você possui acesso total a todos os módulos, controle de franquias e gestão do banco central de dados.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#0f172a' }}>Funções Exclusivas Master:</h4>
              <ul style={{ paddingLeft: '20px', lineHeight: 1.6, margin: 0, fontSize: '0.88rem', color: '#334155' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Cadastrar Supermercado Parceiro:</strong> Crie novas contas de lojas com Nome, CNPJ, limites de caixas contratados e módulos liberados.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Bloqueio e Desbloqueio Remoto:</strong> Suspenda o acesso de qualquer supermercado inadimplente com 1 clique. O bloqueio propaga em tempo real impedindo acessos de toda a equipe daquela loja.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Catálogo Global de Produtos:</strong> Cadastre produtos de referência com fotos e códigos de barras pré-configurados que ficam automaticamente disponíveis para todos os clientes.
                </li>
                <li>
                  <strong>Alterar Credenciais Master:</strong> Atualize seu usuário e senha master no menu <em>"🔑 Alterar Senha Master"</em>.
                </li>
              </ul>
            </div>
          </div>
        ),
      });
    }

    return lista;
  }, [isDono, isAdminLoja, isCaixa, permissoesLoja, permissoesOperador]);

  // Filtragem por busca
  const topicosFiltrados = useMemo(() => {
    if (!termoBusca.trim()) return topicos;
    const termo = termoBusca.toLowerCase();
    return topicos.filter(
      (t) =>
        t.titulo.toLowerCase().includes(termo) ||
        t.categoria.toLowerCase().includes(termo) ||
        (t.destaque && t.destaque.toLowerCase().includes(termo))
    );
  }, [topicos, termoBusca]);

  // Tópico ativo
  const topicoAtivo = useMemo(() => {
    const achou = topicos.find((t) => t.id === topicoSelecionadoId);
    if (achou) return achou;
    return topicosFiltrados.length > 0 ? topicosFiltrados[0] : null;
  }, [topicos, topicoSelecionadoId, topicosFiltrados]);

  // Agrupamento por categorias
  const categorias = useMemo(() => {
    const map = new Map<string, TopicoManual[]>();
    topicosFiltrados.forEach((t) => {
      if (!map.has(t.categoria)) {
        map.set(t.categoria, []);
      }
      map.get(t.categoria)!.push(t);
    });
    return Array.from(map.entries());
  }, [topicosFiltrados]);

  if (!visivel) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '980px',
          height: '90vh',
          borderRadius: '18px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
          border: '1px solid #cbd5e1',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* CABEÇALHO DO MANUAL */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            padding: '16px 20px',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem' }}>📘</span>
            <div>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em', color: '#ffffff' }}>
                Manual do Usuário & Guia Operacional
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.22)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                  }}
                >
                  {isDono ? '👑 Dono do App (Master)' : isAdminLoja ? '🏢 Administrador da Loja' : '🛒 Operador de Caixa'}
                </span>
                {nomeOperador && <span style={{ fontSize: '0.76rem', color: '#e0f2fe' }}>• {nomeOperador}</span>}
                {nomeLoja && <span style={{ fontSize: '0.76rem', color: '#bae6fd' }}>({nomeLoja})</span>}
              </div>
            </div>
          </div>

          <button
            onClick={onFechar}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}
            title="Fechar Manual"
          >
            ✕
          </button>
        </div>

        {/* CAMPO DE BUSCA RÁPIDA */}
        <div style={{ padding: '12px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="🔍 Digite para pesquisar tópicos no manual (ex: bipar, troco, caixa, balança, offline, sessão)..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem',
                outline: 'none',
                background: '#ffffff',
              }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              🔍
            </span>
            {termoBusca && (
              <button
                type="button"
                onClick={() => setTermoBusca('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#e2e8f0',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  fontWeight: 800,
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* CORPO DO MANUAL: BARRA LATERAL + CONTEÚDO */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* BARRA LATERAL DE TÓPICOS */}
          <div
            style={{
              width: '320px',
              borderRight: '1px solid #e2e8f0',
              overflowY: 'auto',
              background: '#f8fafc',
              padding: '10px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {topicosFiltrados.length === 0 ? (
              <div style={{ padding: '20px 10px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                Nenhum tópico encontrado para <strong>"{termoBusca}"</strong>.
              </div>
            ) : (
              categorias.map(([catNome, itens]) => (
                <div key={catNome}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', padding: '4px 8px', letterSpacing: '0.5px' }}>
                    {catNome}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                    {itens.map((topico) => {
                      const ativo = topicoAtivo?.id === topico.id;
                      return (
                        <button
                          key={topico.id}
                          type="button"
                          onClick={() => setTopicoSelecionadoId(topico.id)}
                          style={{
                            background: ativo ? '#0284c7' : '#ffffff',
                            color: ativo ? '#ffffff' : '#1e293b',
                            border: ativo ? '1px solid #0284c7' : '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '8px 10px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.15s',
                            boxShadow: ativo ? '0 2px 6px rgba(2, 132, 199, 0.25)' : 'none',
                          }}
                        >
                          <span style={{ fontSize: '1.1rem' }}>{topico.icone}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {topico.titulo}
                            </div>
                            {topico.destaque && (
                              <div style={{ fontSize: '0.7rem', color: ativo ? '#e0f2fe' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {topico.destaque}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ÁREA DE LEITURA DO TÓPICO ATIVO */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: '#ffffff' }}>
            {topicoAtivo ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {topicoAtivo.categoria}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{topicoAtivo.icone}</span>
                    <span>{topicoAtivo.titulo}</span>
                  </h3>
                </div>

                <div>{topicoAtivo.conteudo}</div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                Selecione um tópico na barra lateral para ler as instruções.
              </div>
            )}
          </div>
        </div>

        {/* RODAPÉ DO MANUAL */}
        <div
          style={{
            background: '#f1f5f9',
            borderTop: '1px solid #e2e8f0',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            fontSize: '0.8rem',
            color: '#64748b',
          }}
        >
          <div>
            <span>Manual atualizado • </span>
            <strong style={{ color: '#0f172a' }}>{topicos.length} módulos disponíveis</strong> para seu perfil
          </div>
          <button
            type="button"
            onClick={onFechar}
            style={{
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Fechar Manual
          </button>
        </div>
      </div>
    </div>
  );
};
