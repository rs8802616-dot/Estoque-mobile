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
  passoNumero: number;
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
  const [topicoSelecionadoId, setTopicoSelecionadoId] = useState<string>('guia_inicial_fluxo');

  const tipoUsuario = perfilAtivo || sessao?.tipo || 'caixa';
  const isDono = tipoUsuario === 'dona_app';
  const isAdminLoja = tipoUsuario === 'admin_loja';
  const isCaixa = tipoUsuario === 'caixa' || (!isDono && !isAdminLoja);

  const topicos = useMemo(() => {
    const lista: TopicoManual[] = [];
    let contador = 1;

    // =========================================================================
    // 1. PASSO A PASSO INICIAL: COMO FUNCIONA O APLICATIVO DO ZERO
    // =========================================================================
    lista.push({
      id: 'guia_inicial_fluxo',
      passoNumero: contador++,
      icone: '🚀',
      titulo: 'Como Funciona o Aplicativo (Passo a Passo Completo)',
      categoria: '1. Comece Aqui (Visão Geral)',
      destaque: 'Rotina diária do início ao fim do expediente',
      conteudo: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)', border: '1px solid #93c5fd', borderRadius: '14px', padding: '16px', color: '#1e3a8a' }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🎯</span>
              <span>Bem-vindo ao Tutorial Completo do Sistema!</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.55 }}>
              Este aplicativo reúne <strong>Frente de Caixa (PDV)</strong>, <strong>Controle de Estoque por Lotes e Validades</strong>, <strong>Delivery Completo estilo Zé Delivery / AtendeJá</strong> e <strong>Central de Lucro Líquido Real</strong> em um só lugar. Veja abaixo a ordem exata de como usar no seu dia a dia:
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '0.98rem', color: '#0f172a', fontWeight: 800 }}>
              📋 Os 5 Passos da Rotina Diária da Loja:
            </h4>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#f8fafc', padding: '12px', borderRadius: '10px', borderLeft: '4px solid #2563eb' }}>
              <span style={{ background: '#2563eb', color: '#fff', width: '26px', height: '26px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem', flexShrink: 0 }}>1</span>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>Cadastrar o Estoque da Loja (Menu ☰ → Estoque & Produtos)</div>
                <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '3px', lineHeight: 1.5 }}>
                  Bipe ou digite o código de barras do produto, informe o <strong>Preço de Custo</strong>, o <strong>Preço de Venda</strong>, a <strong>Quantidade</strong>, o <strong>Lote</strong> e a <strong>Data de Validade</strong>. Se for um produto de produção própria sem controle de lote (ex: gelo, combo, porção), marque como <em>Cadastro Interno / Estoque Ilimitado</em>.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#f8fafc', padding: '12px', borderRadius: '10px', borderLeft: '4px solid #059669' }}>
              <span style={{ background: '#059669', color: '#fff', width: '26px', height: '26px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem', flexShrink: 0 }}>2</span>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>Abrir o Turno do Caixa (Menu ☰ → Caixa & Vendas → Gestão de Caixa)</div>
                <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '3px', lineHeight: 1.5 }}>
                  Antes de iniciar as vendas do dia, informe o <strong>Fundo de Troco Inicial</strong> (dinheiro em espécie que está na gaveta). O status mudará de <strong style={{ color: '#e11d48' }}>Fechado</strong> para <strong style={{ color: '#059669' }}>Aberto</strong>.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#f8fafc', padding: '12px', borderRadius: '10px', borderLeft: '4px solid #0284c7' }}>
              <span style={{ background: '#0284c7', color: '#fff', width: '26px', height: '26px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem', flexShrink: 0 }}>3</span>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>Atender no Balcão (PDV Principal)</div>
                <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '3px', lineHeight: 1.5 }}>
                  Na tela principal, bipe os produtos com o leitor USB/Bluetooth, câmera ou clique no card do produto. Escolha a forma de pagamento (Dinheiro com cálculo automático de troco, PIX, Cartão ou Fiado) e finalize emitindo o cupom térmico.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#fffbeb', padding: '12px', borderRadius: '10px', borderLeft: '4px solid #d97706' }}>
              <span style={{ background: '#d97706', color: '#fff', width: '26px', height: '26px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem', flexShrink: 0 }}>4</span>
              <div>
                <div style={{ fontWeight: 800, color: '#92400e', fontSize: '0.9rem' }}>Receber e Despachar Pedidos de Delivery (Coluna Lateral ou Menu Delivery)</div>
                <div style={{ fontSize: '0.84rem', color: '#78350f', marginTop: '3px', lineHeight: 1.5 }}>
                  Envie o <strong>Link do Cardápio</strong> para seus clientes. Quando um pedido chega, o sistema toca um alerta sonoro. Ao clicar em <strong>Aceitar Pedido</strong>, o estoque é baixado automaticamente (do lote que vence primeiro) e a venda entra no caixa. Use o botão <strong>🛵 Link Motoboy</strong> para enviar a rota do Google Maps no WhatsApp do entregador e confirme a entrega com o <strong>PIN de 4 dígitos</strong> do cliente.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#f5f3ff', padding: '12px', borderRadius: '10px', borderLeft: '4px solid #7c3aed' }}>
              <span style={{ background: '#7c3aed', color: '#fff', width: '26px', height: '26px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem', flexShrink: 0 }}>5</span>
              <div>
                <div style={{ fontWeight: 800, color: '#5b21b6', fontSize: '0.9rem' }}>Fechar o Caixa e Conferir o Lucro Líquido Real (Menu ☰ → Relatórios)</div>
                <div style={{ fontSize: '0.84rem', color: '#4c1d95', marginTop: '3px', lineHeight: 1.5 }}>
                  Ao fim do expediente, faça a conferência de fechamento da gaveta e acesse a <strong>Central de Relatórios & Lucro</strong> para ver exatamente quanto vendeu, qual foi o custo dos produtos vendidos e quanto sobrou de <strong>Lucro Líquido Real no bolso</strong>.
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.96rem', color: '#0f172a', fontWeight: 800 }}>
              🗂️ Como é Organizado o Menu Lateral (Botão ☰ no Topo Esquerdo):
            </h4>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#475569' }}>
              O menu lateral está dividido em <strong>5 grupos inteligentes</strong> que abrem e fecham com um clique:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '0.82rem' }}>
              <div style={{ padding: '10px', borderRadius: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e3a8a' }}>
                <strong>1. Caixa & Vendas:</strong> Gestão de Caixa/Turno, Devedores/Fiado e Histórico de Vendas & Cupons.
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46' }}>
                <strong>2. Estoque & Produtos:</strong> Adicionar Item, Posição de Estoque & Validades, Etiquetas e Catálogo Global.
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' }}>
                <strong>3. Delivery:</strong> Painel de Pedidos, Ver Cardápio do Cliente e Copiar Link do Cardápio.
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#5b21b6' }}>
                <strong>4. Relatórios:</strong> Central Unificada de Relatórios & Lucro Real (4 Abas) e Gráficos.
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155' }}>
                <strong>5. Configurações & Equipe:</strong> Caixas & Permissões, Lojas, Alertas WhatsApp e este Tutorial.
              </div>
            </div>
          </div>
        </div>
      ),
    });

    // =========================================================================
    // 2. MÓDULO DE DELIVERY COMPLETO (CARDÁPIO, PAINEL, MOTOBOY & PIN)
    // =========================================================================
    lista.push({
      id: 'modulo_delivery_completo',
      passoNumero: contador++,
      icone: '🛵',
      titulo: 'Delivery Completo: Cardápio do Cliente, Painel, Motoboy e PIN',
      categoria: '2. Delivery & Pedidos Online',
      destaque: 'Link da Loja, Baixa FEFO, Rota Maps e PIN de 4 dígitos',
      conteudo: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '14px', padding: '15px 16px', color: '#92400e' }}>
            <div style={{ fontWeight: 800, fontSize: '0.96rem', marginBottom: '4px' }}>
              🛵 Como Funciona o Seu Delivery Próprio (Sem Taxas de Aplicativos)
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', lineHeight: 1.5 }}>
              Sua loja possui um <strong>Cardápio Digital Exclusivo</strong> integrado em tempo real com o seu estoque físico e com o seu caixa.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 800 }}>
              1️⃣ Como Enviar o Cardápio para os Clientes
            </h4>
            <ul style={{ paddingLeft: '20px', lineHeight: 1.6, margin: 0, fontSize: '0.86rem', color: '#334155' }}>
              <li>
                Abra o <strong>Menu Lateral (☰) → Delivery → Copiar Link do Cardápio</strong> (ou clique no botão de compartilhar dentro do Painel Delivery).
              </li>
              <li>
                Coloque esse link na bio do Instagram, no status do WhatsApp ou na mensagem automática do WhatsApp da loja.
              </li>
              <li>
                <strong>Isolamento Total de Segurança:</strong> Quando o cliente abre o link (<code>/?loja=...</code>), ele vê <strong>exclusivamente o cardápio de compras</strong>. Não existe nenhum botão de acesso administrativo para o cliente.
              </li>
              <li>
                <strong>Estoque Inteligente no Cardápio:</strong> Produtos com estoque zerado (<code>0 un</code>) ou vencidos <strong>somem automaticamente</strong> para o cliente. E se um produto tiver vários lotes diferentes na loja, o cardápio une tudo em <strong>um único card</strong> somando as quantidades disponíveis.
              </li>
            </ul>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 800 }}>
              2️⃣ Como Atender e Despachar o Pedido no Caixa / PDV
            </h4>
            <ol style={{ paddingLeft: '20px', lineHeight: 1.65, margin: 0, fontSize: '0.86rem', color: '#334155' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Alerta Sonoro de Novo Pedido:</strong> Assim que o cliente envia o pedido, o card aparece com borda vermelha na aba <strong>Novos</strong> e o sistema toca uma campainha contínua até você aceitar.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Aceitar Pedido (Baixa Automática no Estoque):</strong> Clique em <strong style={{ color: '#059669' }}>✓ Aceitar Pedido</strong>. O sistema desconta automaticamente as unidades do seu estoque (começando pelo lote de validade mais próxima - FEFO) e já registra a venda no turno do caixa!
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>🖨️ Imprimir Comanda:</strong> Clique no ícone da impressora (<code>🖨️</code>) no rodapé do pedido para imprimir a comanda de separação e entrega na impressora térmica.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>🛵 Link Motoboy (WhatsApp + Google Maps):</strong> Clique no botão roxo <strong style={{ color: '#9333ea' }}>🛵 Link Motoboy</strong>. O sistema abre o WhatsApp com os dados do pedido, valor a cobrar/troco, telefone do cliente e o <strong>link direto da rota no Google Maps</strong> para o entregador abrir no celular com 1 toque.
              </li>
              <li>
                <strong>🔐 Confirmar Entrega com PIN de 4 Dígitos:</strong> Ao entregar o pedido, o cliente informa o código PIN de 4 dígitos gerado no celular dele. Digite o PIN para concluir a entrega com 100% de segurança.
              </li>
            </ol>
          </div>
        </div>
      ),
    });

    // =========================================================================
    // 3. FRENTE DE CAIXA (PDV & VENDAS)
    // =========================================================================
    const temPermissaoVenda = isDono || isAdminLoja || (permissoesLoja?.caixa !== false && permissoesOperador?.vender !== false);
    if (temPermissaoVenda) {
      lista.push({
        id: 'pdv_vendas',
        passoNumero: contador++,
        icone: '🛒',
        titulo: 'Frente de Caixa (PDV), Leitor de Código de Barras & Balança',
        categoria: '3. Frente de Caixa & Vendas',
        destaque: 'Bipagem contínua, Câmera, Balança e Pagamentos',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.96rem', color: '#0f172a', fontWeight: 800 }}>
                1️⃣ 3 Formas de Passar Produtos no Caixa
              </h4>
              <ul style={{ paddingLeft: '20px', lineHeight: 1.6, margin: 0, fontSize: '0.86rem', color: '#334155' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>🔫 Pistola Leitora de Código de Barras (USB ou Bluetooth):</strong> Não precisa clicar em nenhum campo antes! Basta apontar o leitor e bipar:
                  <ul style={{ marginTop: '4px', paddingLeft: '18px' }}>
                    <li>Se bipar o <strong>mesmo produto várias vezes</strong>, o sistema soma <code>+1 unidade</code> automaticamente na mesma linha e recalcula o total;</li>
                    <li>Se bipar <strong>produtos diferentes</strong>, cada um entra em sua linha no carrinho;</li>
                    <li>Se o produto tiver mais de um lote, o sistema dá baixa automaticamente no lote que vence primeiro (<strong>FEFO</strong>).</li>
                  </ul>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>📷 Câmera do Celular / Tablet:</strong> Clique no ícone da câmera na barra de pesquisa para ler códigos de barras usando a câmera com suporte a lanterna e zoom.
                </li>
                <li>
                  <strong>🔍 Pesquisa Rápida ou Clique Direto no Card:</strong> Digite qualquer parte do nome, marca ou código na barra de pesquisa superior ou clique diretamente sobre o card do produto na grade para abrir a janela de venda.
                </li>
              </ul>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.96rem', color: '#0f172a', fontWeight: 800 }}>
                2️⃣ Etiquetas Inteligentes de Balança (Padrão 2xxxx)
              </h4>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#334155', lineHeight: 1.55 }}>
                Ao bipar etiquetas geradas por balanças (Toledo, Filizola, Elgin, Urano iniciadas pelo dígito <code>2</code>), o sistema identifica automaticamente o produto pesável e calcula o peso/preço exato na hora.
              </p>
            </div>

            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '14px 16px', color: '#065f46' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '4px' }}>
                💳 Formas de Pagamento, Troco & Impressão de Cupom
              </div>
              <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.85rem', lineHeight: 1.55 }}>
                <li><strong>Dinheiro:</strong> Informe o valor recebido do cliente e veja o <strong>Troco Exato</strong> calculado na hora.</li>
                <li><strong>PIX, Cartão de Crédito e Cartão de Débito:</strong> Registro separado para bater centavo por centavo no fechamento do turno.</li>
                <li><strong>Fiado / Caderneta:</strong> Lança o valor diretamente na conta do cliente cadastrado.</li>
                <li><strong>Comprovante / Cupom:</strong> Ao finalizar, imprima em bobina térmica (58mm/80mm) ou envie pelo WhatsApp do cliente.</li>
              </ul>
            </div>
          </div>
        ),
      });
    }

    // =========================================================================
    // 4. GESTÃO DE CAIXA E TURNOS
    // =========================================================================
    const temPermissaoCaixaTurno = isDono || isAdminLoja || (permissoesLoja?.gestao_caixa !== false && permissoesOperador?.gestao_caixa !== false);
    if (temPermissaoCaixaTurno) {
      lista.push({
        id: 'gestao_caixa_turnos',
        passoNumero: contador++,
        icone: '💵',
        titulo: 'Gestão de Caixa: Abertura, Sangria, Suprimento e Fechamento',
        categoria: '3. Frente de Caixa & Vendas',
        destaque: 'Controle de gaveta, troco e conferência',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>🟢 1. Abertura de Caixa</div>
                <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                  Acesse <strong>Menu ☰ → Caixa & Vendas → Gestão de Caixa & Turno</strong> e digite o valor em dinheiro disponível na gaveta para troco no início do turno.
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: 0 }} />
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>📤 2. Sangria (Retirada de Valor da Gaveta)</div>
                <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                  Sempre que retirar dinheiro da gaveta (para pagar fornecedor ou guardar no cofre), registre uma <strong>Sangria</strong> com o valor e o motivo. Isso desconta do saldo esperado em dinheiro.
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: 0 }} />
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>📥 3. Suprimento (Reforço de Troco)</div>
                <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                  Quando colocar mais moedas ou notas de troco na gaveta durante o dia, registre um <strong>Suprimento</strong>.
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: 0 }} />
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>🔴 4. Fechamento de Turno (Conferência)</div>
                <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                  No fim do expediente, conte o dinheiro físico da gaveta e informe os valores. O sistema mostra se o caixa bateu exato ou se houve sobra/falta.
                </div>
              </div>
            </div>
          </div>
        ),
      });
    }

    // =========================================================================
    // 5. CONTROLE DE ESTOQUE, LOTES & PRODUTOS INTERNOS
    // =========================================================================
    const temPermissaoEstoque = isDono || isAdminLoja || (permissoesLoja?.estoque !== false && (permissoesOperador?.cadastrar_produtos !== false || permissoesOperador?.alterar_preco !== false));
    if (temPermissaoEstoque) {
      lista.push({
        id: 'estoque_cadastro_lotes',
        passoNumero: contador++,
        icone: '📦',
        titulo: 'Cadastro de Estoque, Lotes (FEFO) & Produtos Internos',
        categoria: '4. Estoque, Validades & Etiquetas',
        destaque: 'Como cadastrar lotes, validades, fotos e margem',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 800 }}>
                Diferença entre Produto Padrão (Com Lote) e Produto Interno:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontWeight: 800, color: '#166534', fontSize: '0.88rem', marginBottom: '4px' }}>🏷️ Produto Industrial / Com Lote</div>
                  <div style={{ fontSize: '0.82rem', color: '#14532d', lineHeight: 1.5 }}>
                    Controla quantidade exata e data de validade. Se você comprar um lote novo do mesmo produto com outra validade, cadastre normalmente: o sistema <strong>soma as quantidades em um único card</strong> e sempre dá baixa primeiro no lote que vence mais cedo (FEFO).
                  </div>
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontWeight: 800, color: '#92400e', fontSize: '0.88rem', marginBottom: '4px' }}>♾️ Produto Interno / Produção Contínua</div>
                  <div style={{ fontSize: '0.82rem', color: '#78350f', lineHeight: 1.5 }}>
                    Ideal para itens preparados na hora, gelo, copões, combos ou produtos sem validade fixa. Não exige código de barras externo e possui <strong>estoque contínuo/ilimitado</strong>.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 800 }}>
                📦 Tela "Posição de Estoque & Validades"
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.55 }}>
                Em <strong>Menu ☰ → Estoque & Produtos → Posição de Estoque & Validades</strong>, você vê todos os lotes detalhados, edita preços ou quantidades com 1 clique, exclui lotes zerados e exporta a planilha completa do inventário.
              </p>
            </div>
          </div>
        ),
      });
    }

    // =========================================================================
    // 6. CENTRAL DE RELATÓRIOS & LUCRO REAL (HUB UNIFICADO DE 4 ABAS)
    // =========================================================================
    const temPermissaoRelatorios = isDono || isAdminLoja || (permissoesLoja?.relatorios !== false && permissoesOperador?.ver_relatorios !== false);
    if (temPermissaoRelatorios) {
      lista.push({
        id: 'central_relatorios_lucro',
        passoNumero: contador++,
        icone: '📊',
        titulo: 'Central de Relatórios & Lucro Líquido Real (Hub 4 Abas)',
        categoria: '5. Relatórios, Fiado & Gestão',
        destaque: 'Faturamento Bruto, Custo (CMV) e Só Lucro Real',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '12px', padding: '14px 16px', color: '#5b21b6' }}>
              <div style={{ fontWeight: 800, fontSize: '0.94rem', marginBottom: '4px' }}>
                💎 Como Saber Exatamente Quanto Você Lucrou (Retirando o Custo)
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', lineHeight: 1.5 }}>
                Em <strong>Menu ☰ → Relatórios → Central de Relatórios & Lucro</strong>, todos os indicadores financeiros da loja estão reunidos em 4 abas:
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#334155' }}>
              <div>
                <strong style={{ color: '#0f172a' }}>📊 Aba 1 — Faturamento & Lucro Real:</strong> Exibe lado a lado a <em>Receita Bruta Vendida</em>, o <em>Custo Total dos Produtos (CMV)</em> e o card em destaque <strong>💎 Só Lucro Real (Sem Custo)</strong> com a margem líquida real da loja.
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: 0 }} />
              <div>
                <strong style={{ color: '#0f172a' }}>🧾 Aba 2 — Histórico de Vendas & Cupons:</strong> Lista cada venda de Balcão e de Delivery, mostra o custo e o lucro de cada item vendido, permite <strong>reimprimir 2ª via do cupom</strong>, exportar Excel (CSV) e realizar <strong>Estorno</strong> (devolvendo os itens automaticamente ao estoque).
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: 0 }} />
              <div>
                <strong style={{ color: '#0f172a' }}>📦 Aba 3 — Posição de Estoque & Validades:</strong> Mostra quanto dinheiro você tem investido nas prateleiras (preço de custo), quanto vai apurar ao vender tudo e quais lotes vencem nos próximos 7, 15 ou 30 dias.
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: 0 }} />
              <div>
                <strong style={{ color: '#0f172a' }}>🛵 Aba 4 — Inteligência Delivery:</strong> Total faturado no delivery, total de taxas de entrega por bairro e ranking dos produtos mais pedidos pelos clientes.
              </div>
            </div>
          </div>
        ),
      });
    }

    // =========================================================================
    // 7. ALERTAS DE VALIDADE, BAIXAS DE PERDA & ETIQUETAS
    // =========================================================================
    const temPermissaoAlertas = isDono || isAdminLoja || permissoesLoja?.alertas !== false;
    if (temPermissaoAlertas) {
      lista.push({
        id: 'validades_etiquetas_baixas',
        passoNumero: contador++,
        icone: '🔔',
        titulo: 'Alertas de Validade, Baixas de Perda & Etiquetas de Prateleira',
        categoria: '4. Estoque, Validades & Etiquetas',
        destaque: 'Prevenção de vencidos, WhatsApp e impressão de preços',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 800 }}>
                🔔 Sininho de Notificações & Alertas por WhatsApp
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.55 }}>
                O ícone de sino no topo da tela avisa automaticamente sobre produtos vencidos, que vencem em até 15/30 dias ou que estão com estoque baixo. Em <strong>Configurações & Equipe → Alertas WhatsApp</strong>, você pode disparar o relatório de validades direto para o WhatsApp da gerência.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 800 }}>
                🏷️ Impressão de Etiquetas de Prateleira
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.55 }}>
                Em <strong>Menu ☰ → Estoque & Produtos → Etiquetas de Prateleira</strong>, selecione os produtos para imprimir etiquetas de gôndola com código de barras e preço atualizado em impressoras térmicas ou folhas A4.
              </p>
            </div>
          </div>
        ),
      });
    }

    // =========================================================================
    // 8. CADERNETA DE FIADO
    // =========================================================================
    const temPermissaoFiado = isDono || isAdminLoja || (permissoesLoja?.devedores !== false && permissoesOperador?.gerenciar_devedores !== false);
    if (temPermissaoFiado) {
      lista.push({
        id: 'caderneta_fiado',
        passoNumero: contador++,
        icone: '💳',
        titulo: 'Caderneta de Clientes Devedores (Fiado) & Cobrança WhatsApp',
        categoria: '5. Relatórios, Fiado & Gestão',
        destaque: 'Limites de crédito, amortização parcial e extrato',
        conteudo: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <ul style={{ paddingLeft: '20px', lineHeight: 1.65, margin: 0, fontSize: '0.86rem', color: '#334155' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Cadastro com Limite de Crédito:</strong> Em <strong>Menu ☰ → Caixa & Vendas → Devedores / Fiado</strong>, cadastre o cliente com Nome, Telefone, CPF e limite máximo autorizado.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Recebimento Parcial ou Total:</strong> Quando o cliente vier pagar parte da dívida ou quitar tudo, clique em <em>Registrar Pagamento</em> para abater do saldo e emitir recibo.
                </li>
                <li>
                  <strong>Cobrança em 1 Clique no WhatsApp:</strong> Envie o extrato detalhado dos itens comprados e o saldo atualizado diretamente para o WhatsApp do cliente.
                </li>
              </ul>
            </div>
          </div>
        ),
      });
    }

    // =========================================================================
    // 9. EQUIPE, SESSÃO ÚNICA, MODO OFFLINE & ÁREA MASTER
    // =========================================================================
    lista.push({
      id: 'equipe_seguranca_offline',
      passoNumero: contador++,
      icone: '🛡️',
      titulo: 'Equipe, Permissões, Modo Offline & Segurança',
      categoria: '6. Segurança, Equipe & Conexão',
      destaque: 'Operadores de caixa, nuvem Firebase e sessão única',
      conteudo: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#334155' }}>
            <div>
              <strong style={{ color: '#0f172a' }}>👥 Cadastro de Caixas e Permissões:</strong> Em <strong>Configurações & Equipe → Caixas & Permissões</strong>, crie logins individuais para cada funcionário e escolha exatamente o que cada um pode acessar (ex: bloquear acesso a relatórios de lucro ou estornos).
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: 0 }} />
            <div>
              <strong style={{ color: '#0f172a' }}>📶 Funcionamento 100% Offline + Sincronização Automática:</strong> Se a internet cair, você continua vendendo normalmente. Todas as operações ficam salvas no aparelho e sincronizam com a nuvem automaticamente assim que a conexão voltar.
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: 0 }} />
            <div>
              <strong style={{ color: '#0f172a' }}>🔐 Sessão Única e Termo no 1º Acesso:</strong> Se a mesma conta fizer login em outro aparelho, o aparelho anterior é desconectado por segurança. O Termo de Uso é solicitado apenas uma única vez quando o login conecta pela primeira vez no dispositivo.
            </div>
            {isDono && (
              <>
                <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: 0 }} />
                <div>
                  <strong style={{ color: '#7c3aed' }}>👑 Funções Exclusivas da Dona do Aplicativo:</strong> Cadastro e gerenciamento de múltiplas lojas, bloqueio/desbloqueio remoto de estabelecimentos, alimentação do Catálogo Global Master e alteração de senha master.
                </div>
              </>
            )}
          </div>
        </div>
      ),
    });

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

  const indiceAtivo = useMemo(() => {
    if (!topicoAtivo) return 0;
    return topicos.findIndex((t) => t.id === topicoAtivo.id);
  }, [topicos, topicoAtivo]);

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
          maxWidth: '1020px',
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
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '16px 20px',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem' }}>📘</span>
            <div>
              <h2 style={{ fontSize: '1.12rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em', color: '#ffffff' }}>
                Tutorial Passo a Passo & Manual do Sistema
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: 'rgba(59, 130, 246, 0.25)',
                    border: '1px solid rgba(96, 165, 250, 0.4)',
                    color: '#93c5fd',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  {isDono ? '👑 Dono do App (Master)' : isAdminLoja ? '🏢 Administrador da Loja' : '🛒 Operador de Caixa'}
                </span>
                {nomeOperador && <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>• {nomeOperador}</span>}
                {nomeLoja && <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({nomeLoja})</span>}
              </div>
            </div>
          </div>

          <button
            onClick={onFechar}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}
            title="Fechar Tutorial"
          >
            ✕
          </button>
        </div>

        {/* BARRA DE BUSCA + ATALHOS RÁPIDOS DE PASSOS */}
        <div style={{ padding: '10px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="search"
              autoComplete="off"
              placeholder="🔍 Pesquisar no tutorial (ex: como começar, delivery, motoboy, leitor, caixa, lucro, lotes)..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                outline: 'none',
                background: '#ffffff',
              }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              🔍
            </span>
          </div>

          {/* PÍLULAS HORIZONTAIS PARA NAVEGAÇÃO RÁPIDA EM TELAS MENORES E DESKTOP */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {topicosFiltrados.map((topico) => {
              const ativo = topicoAtivo?.id === topico.id;
              return (
                <button
                  key={`pill_${topico.id}`}
                  type="button"
                  onClick={() => setTopicoSelecionadoId(topico.id)}
                  style={{
                    background: ativo ? '#2563eb' : '#ffffff',
                    color: ativo ? '#ffffff' : '#334155',
                    border: ativo ? '1px solid #2563eb' : '1px solid #cbd5e1',
                    borderRadius: '9999px',
                    padding: '5px 11px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    flexShrink: 0,
                  }}
                >
                  <span>{topico.icone}</span>
                  <span>Passo {topico.passoNumero}: {topico.titulo.split(':')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CORPO DO MANUAL: BARRA LATERAL + CONTEÚDO */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* BARRA LATERAL DE TÓPICOS (VISÍVEL EM TELAS MAIORES) */}
          <div
            className="hidden md:flex"
            style={{
              width: '300px',
              borderRight: '1px solid #e2e8f0',
              overflowY: 'auto',
              background: '#f8fafc',
              padding: '12px',
              flexShrink: 0,
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
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', padding: '4px 8px', letterSpacing: '0.5px' }}>
                    {catNome}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '4px' }}>
                    {itens.map((topico) => {
                      const ativo = topicoAtivo?.id === topico.id;
                      return (
                        <button
                          key={topico.id}
                          type="button"
                          onClick={() => setTopicoSelecionadoId(topico.id)}
                          style={{
                            background: ativo ? '#2563eb' : '#ffffff',
                            color: ativo ? '#ffffff' : '#1e293b',
                            border: ativo ? '1px solid #2563eb' : '1px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '9px 10px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.15s',
                            boxShadow: ativo ? '0 3px 8px rgba(37, 99, 235, 0.25)' : 'none',
                          }}
                        >
                          <span style={{ fontSize: '1.15rem' }}>{topico.icone}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {topico.passoNumero}. {topico.titulo}
                            </div>
                            {topico.destaque && (
                              <div style={{ fontSize: '0.68rem', color: ativo ? '#dbeafe' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
            {topicoAtivo ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {topicoAtivo.categoria} • Passo {topicoAtivo.passoNumero} de {topicos.length}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{topicoAtivo.icone}</span>
                      <span>{topicoAtivo.titulo}</span>
                    </h3>
                  </div>

                  <div>{topicoAtivo.conteudo}</div>
                </div>

                {/* BOTÕES DE NAVEGAÇÃO PASSO A PASSO */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #e2e8f0', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    disabled={indiceAtivo <= 0}
                    onClick={() => {
                      if (indiceAtivo > 0) setTopicoSelecionadoId(topicos[indiceAtivo - 1].id);
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: indiceAtivo <= 0 ? '#f8fafc' : '#ffffff',
                      color: indiceAtivo <= 0 ? '#94a3b8' : '#334155',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: indiceAtivo <= 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    ⬅️ Passo Anterior
                  </button>

                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                    Passo {indiceAtivo + 1} de {topicos.length}
                  </span>

                  <button
                    type="button"
                    disabled={indiceAtivo >= topicos.length - 1}
                    onClick={() => {
                      if (indiceAtivo < topicos.length - 1) setTopicoSelecionadoId(topicos[indiceAtivo + 1].id);
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      background: indiceAtivo >= topicos.length - 1 ? '#e2e8f0' : '#2563eb',
                      color: indiceAtivo >= topicos.length - 1 ? '#94a3b8' : '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: indiceAtivo >= topicos.length - 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Próximo Passo ➡️
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                Selecione um tópico para ler as instruções.
              </div>
            )}
          </div>
        </div>

        {/* RODAPÉ DO MANUAL */}
        <div
          style={{
            background: '#f8fafc',
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
            <span>Guia interativo completo • </span>
            <strong style={{ color: '#0f172a' }}>{topicos.length} passos explicativos</strong>
          </div>
          <button
            type="button"
            onClick={onFechar}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              padding: '7px 18px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Concluir Leitura
          </button>
        </div>
      </div>
    </div>
  );
};
