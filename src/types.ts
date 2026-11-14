export interface ProdutoCatalogo {
  codigo: string;
  nome: string;
  marca?: string;
  categoria?: string;
  unidade_medida?: string;
  imagem?: string;
  foto?: string;
  foto_url?: string;
  descricao?: string;
  ncm?: string;
  preco?: number;
  preco_custo?: number;
  preco_venda?: number;
  origem?: string;
  buscaImagem?: string;
}

export interface ItemEstoque {
  firestoreDocId?: string;
  lojaId?: string;
  codigo_barras?: string;
  codigo: string;
  nome: string;
  marca?: string;
  categoria?: string;
  descricao?: string;
  quantidade: number;
  lote: string;
  validade: string;
  preco_custo?: number;
  preco_venda: number;
  foto?: string;
  tipoCadastro?: 'padrao' | 'interno'; // 'interno' para produtos de adega/balcão sem código de barras (espetinhos, doses, etc)
  estoqueIlimitado?: boolean; // Se true, não tem limite de quantidade, sempre permite vender/dar baixa
  exclusivoLoja?: boolean; // Se true, não vai para o catálogo global compartilhado, fica 100% restrito à adega
}

export interface PermissoesLoja {
  caixa: boolean;             // 🛒 PDV & Registro de Vendas
  gestao_caixa: boolean;      // 💵 Turno de Caixa (Abertura, Sangria e Fechamento)
  estoque: boolean;           // 📦 Cadastro & Gestão de Estoque
  usuarios: boolean;          // 👥 Gestão de Operadores de Caixa & Equipe
  relatorios: boolean;        // 📊 Relatórios Financeiros & Vendas
  estorno: boolean;           // ↩️ Estorno & Cancelamento de Vendas
  graficos: boolean;          // 📈 Gráficos & Analytics de Desempenho
  devedores: boolean;         // 💳 Área de Devedores / Caderneta de Fiado
  inteligencia_estoque: boolean; // 💡 Inteligência de Compras & Giro
  ocr_ia: boolean;            // 🤖 Consulta Inteligente OCR / IA com Câmera
  etiquetas: boolean;         // 🏷️ Impressão de Etiquetas de Gôndola
  balanca: boolean;           // ⚖️ Integração & Configuração de Balança Toledo/Filizola
  alertas: boolean;           // 🔔 Alertas de Validade & Reposição
  alertas_whatsapp: boolean;  // 📱 Disparo de Alertas no WhatsApp / E-mail
  baixa_estoque: boolean;     // 🗑️ Baixa Manual & Descarte de Estoque
  exportar_dados: boolean;    // 📥 Exportação de Relatórios (Excel/PDF)
  catalogo_global: boolean;   // 🗂️ Acesso ao Catálogo Global de Produtos
  reimprimir_cupom: boolean;  // 🧾 Reemissão de 2ª Via de Cupom
  manual_ajuda: boolean;      // 📘 Manual de Instruções e Tutoriais
  delivery?: boolean;         // 🛵 Gestão de Pedidos e Delivery (Estilo Zé Delivery)
}

export interface PermissoesOperador {
  // Frente de Caixa & Vendas (PDV)
  vender: boolean;             // 🛒 Realizar Vendas no Caixa
  gestao_caixa: boolean;       // 💵 Abrir/Fechar Turno de Caixa, Suprimento e Sangria
  dar_desconto: boolean;       // 💲 Conceder Desconto na Venda
  alterar_preco: boolean;      // ✏️ Alterar Preço Unitário de Venda
  estornar_venda: boolean;     // ↩️ Estornar / Cancelar Venda com Devolução ao Estoque
  reimprimir_cupom: boolean;   // 🧾 Reemitir / Imprimir 2ª Via do Cupom de Venda
  gerenciar_delivery?: boolean;// 🛵 Aceitar e Despachar Pedidos de Delivery

  // Estoque, Produtos & Catálogo
  cadastrar_produtos: boolean; // 📦 Cadastrar & Editar Produtos e Lotes
  excluir_produtos: boolean;   // ❌ Excluir Produtos / Lotes do Estoque
  baixa_estoque: boolean;      // 🗑️ Dar Baixa Manual em Estoque (Perda / Quebra / Validade)
  catalogo_global: boolean;    // 🗂️ Consultar Catálogo Global Compartilhado

  // Crédito & Fiado
  gerenciar_devedores: boolean;// 💳 Caderneta de Fiado, Limites e Recebimento de Contas

  // Relatórios & Analytics
  ver_relatorios: boolean;     // 📊 Ver Relatórios de Vendas e Faturamento
  ver_graficos: boolean;       // 📈 Ver Gráficos de Desempenho e Horários de Pico
  inteligencia_estoque: boolean; // 💡 Ver Inteligência de Compras e Giro de Estoque
  exportar_relatorios: boolean;// 📥 Exportar / Baixar Relatórios em Excel/CSV/PDF

  // Equipe & Gestão
  gerenciar_equipe: boolean;   // 👥 Cadastrar e Gerenciar Outros Funcionários/Caixas

  // Etiquetas & Balança
  imprimir_etiquetas: boolean; // 🏷️ Gerar e Imprimir Etiquetas de Gôndola
  configurar_balanca: boolean; // ⚖️ Configurar Parâmetros de Balança Pesável EAN-13

  // IA, Scanner & Notificações
  usar_ocr_ia: boolean;        // 🤖 Usar Scanner OCR e Inteligência Artificial com Câmera
  alertas_validade: boolean;   // 🔔 Ver Centro de Alertas e Notificações de Validade
  alertas_whatsapp: boolean;   // 📱 Disparar Alertas de Validade no WhatsApp / E-mail

  // Ajuda & Suporte
  ver_manual_usuario: boolean; // 📘 Acessar Manual de Instruções e Tutoriais
}

export interface OperadorCaixa {
  id: string;
  lojaId: string;
  nome: string;
  cargo: 'Operador de Caixa' | 'Supervisor' | 'Administrador';
  cpfOuUsuario: string;
  pinSenha: string;
  senhaHash?: string;
  senhaSalt?: string;
  permissoes: PermissoesOperador;
  ativo: boolean;
  dataCadastro?: string;
}

export interface TaxaBairro {
  id: string;
  bairro?: string;
  nome?: string;
  valor?: number;
  taxa?: number;
}

export interface Supermercado {
  id: string;
  nome: string;
  slug?: string;
  marca?: string;
  logo_url?: string;
  cnpj: string;
  senha: string;
  senhaAdmin?: string;
  senhaHash?: string;
  senhaSalt?: string;
  senha_revogada?: boolean;
  endereco?: string;
  cidade?: string;
  telefone?: string;
  status?: 'ativo' | 'bloqueado'; // Bloqueio pelo Dono do App
  motivoBloqueio?: string;
  dataCadastro?: string;
  permissoesLoja?: PermissoesLoja;
  limiteCaixas?: number;       // Limite máximo de Operadores de Caixa (ex: 5)
  limiteSupervisores?: number; // Limite máximo de Supervisores/Admins (ex: 2)
  taxa_entrega?: number;
  tempo_estimado_entrega?: string;
  taxas_bairro?: TaxaBairro[];
  token_admin?: string;        // Token secreto exclusivo do Gerente/Admin da loja
  token_garcom?: string;       // Token secreto exclusivo do Garçom no salão
  token_cozinha?: string;      // Token secreto exclusivo da Cozinha (KDS)
  token_caixa?: string;        // Token secreto exclusivo da Operação do Caixa e Fechamento
}

export interface SessaoUsuario {
  tipo: 'dona_app' | 'admin_loja' | 'caixa';
  lojaId?: string;
  lojaNome?: string;
  operadorId?: string;
  operadorNome?: string;
  operadorCargo?: string;
  sessaoToken?: string;
  userKey?: string;
}

export interface SessaoAtivaDoc {
  userKey: string;
  sessaoToken: string;
  tipo: 'dona_app' | 'admin_loja' | 'caixa';
  usuarioNome: string;
  lojaId?: string;
  operadorId?: string;
  dataLogin: string;
  dispositivoInfo?: string;
}

export interface ItemCarrinho {
  id: string; // Ex: `${codigo}_${validade}_${lote}`
  codigo: string;
  nome: string;
  marca?: string;
  categoria?: string;
  quantidade: number;
  preco_unitario: number;
  preco_custo?: number;
  subtotal: number;
  lote: string;
  validade: string;
  foto?: string;
  estoqueDisponivel: number;
  tipoCadastro?: 'padrao' | 'interno';
  estoqueIlimitado?: boolean;
}

export interface VendaItem {
  codigo: string;
  nome: string;
  quantidade: number;
  preco_unitario: number;
  preco_custo?: number;
  subtotal: number;
  lote?: string;
  validade?: string;
  foto?: string;
  tipoCadastro?: 'padrao' | 'interno';
  estoqueIlimitado?: boolean;
}

export interface Venda {
  id: string;
  numeroVenda?: number | string;
  lojaId: string;
  data: string; // ISO YYYY-MM-DD
  hora: string; // HH:mm
  timestamp: number;
  operadorId: string;
  operadorNome?: string;
  itens: VendaItem[];
  valorTotal: number;
  total?: number;
  subtotal?: number;
  desconto?: number;
  acrescimo?: number;
  formaPagamento: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'fiado' | 'outros';
  valorRecebido?: number;
  troco?: number;
  status: 'concluida' | 'estornada';
  dataEstorno?: string;
  operadorEstornoNome?: string;
  motivoEstorno?: string;
  clienteFiadoId?: string;
  clienteFiadoNome?: string;
  origem?: 'balcao' | 'delivery';
  taxaEntrega?: number;
  pedidoDeliveryId?: string;
}

export interface CompraFiadoItem {
  codigo: string;
  nome: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

export interface CompraFiado {
  id: string; // ID único da compra
  vendaId: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:mm
  timestamp: number;
  valorTotal: number;
  valorPago: number; // Abatimentos aplicados
  saldoRestante: number;
  itens: CompraFiadoItem[];
  operadorNome: string;
  status: 'pendente' | 'parcial' | 'quitada';
}

export interface PagamentoFiado {
  id: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:mm
  timestamp: number;
  valorPago: number;
  formaPagamento: 'dinheiro' | 'pix' | 'cartao_debito' | 'cartao_credito';
  operadorNome: string;
  saldoAnterior: number;
  saldoRestante: number;
  observacao?: string;
}

export interface ClienteDevedor {
  id: string;
  lojaId: string;
  nome: string;
  cpfOuCnpj?: string;
  telefone?: string;
  endereco?: string;
  observacoes?: string;
  limiteFiado?: number; // Ex: 500.00 (0 ou undefined = sem limite)
  dataCadastro: string; // YYYY-MM-DD
  saldoDevedorTotal: number; // Valor acumulado que ainda deve
  compras: CompraFiado[];
  pagamentos: PagamentoFiado[];
  ativo: boolean;
}

export interface MovimentacaoCaixa {
  id: string;
  lojaId: string;
  sessaoId: string;
  tipo: 'suprimento' | 'sangria' | 'venda' | 'estorno';
  valor: number;
  descricao: string;
  operadorId: string;
  operadorNome: string;
  dataHora: string;
}

export interface SessaoCaixaTurno {
  id: string;
  lojaId: string;
  operadorId: string;
  operadorNome: string;
  dataAbertura: string;
  horaAbertura: string;
  timestampAbertura?: number;
  status: 'aberto' | 'fechado';
  valorInicialSuprimento: number;
  dataFechamento?: string;
  horaFechamento?: string;
  timestampFechamento?: number;
  // Valores informados pelo operador na conferência cega
  valorDinheiroInformado?: number;
  valorCartaoInformado?: number;
  valorPixInformado?: number;
  valorTotalInformado?: number;
  // Valores calculados pelo sistema
  valorDinheiroEsperado?: number;
  valorCartaoEsperado?: number;
  valorPixEsperado?: number;
  valorFiadoEsperado?: number;
  valorTotalVendasTurno?: number;
  valorTotalEsperadoGeral?: number; // Fundo + Suprimentos - Sangrias + Todas as Vendas (Dinheiro + Cartão + Pix)
  // Balanço e divergências
  diferencaDinheiro?: number; // positivo = sobra, negativo = falta
  diferencaCartao?: number;
  diferencaPix?: number;
  diferencaTotalGeral?: number;
  observacoesFechamento?: string;
}

export interface CredenciaisDonoApp {
  usuario: string;
  senha: string;
  senhaHash?: string;
  senhaSalt?: string;
  nomeExibicao?: string;
  dataAtualizacao?: string;
}

export interface TermoConcordanciaRegistro {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  perfil: string;
  lojaId?: string;
  lojaNome?: string;
  dataAceite: string;
  horaAceite: string;
  timestamp: number;
  versaoTermo: string;
  aceitou: boolean;
}

export interface LogAuditoria {
  id: string;
  lojaId: string;
  operadorId: string;
  operadorNome: string;
  acao: string;
  detalhes: string;
  dataHora: string;
}

export const PERMISSOES_LOJA_PADRAO: PermissoesLoja = {
  caixa: true,
  gestao_caixa: true,
  estoque: true,
  usuarios: true,
  relatorios: true,
  estorno: true,
  graficos: true,
  devedores: true,
  inteligencia_estoque: true,
  ocr_ia: true,
  etiquetas: true,
  balanca: true,
  alertas: true,
  alertas_whatsapp: true,
  baixa_estoque: true,
  exportar_dados: true,
  catalogo_global: true,
  reimprimir_cupom: true,
  manual_ajuda: true,
  delivery: true,
};

export const PERMISSOES_CAIXA_PADRAO: PermissoesOperador = {
  vender: true,
  gestao_caixa: true,
  dar_desconto: false,
  alterar_preco: false,
  estornar_venda: false,
  reimprimir_cupom: true,
  gerenciar_delivery: true,
  cadastrar_produtos: false,
  excluir_produtos: false,
  baixa_estoque: false,
  catalogo_global: true,
  gerenciar_devedores: true,
  ver_relatorios: false,
  ver_graficos: false,
  inteligencia_estoque: false,
  gerenciar_equipe: false,
  imprimir_etiquetas: true,
  configurar_balanca: false,
  usar_ocr_ia: true,
  alertas_validade: true,
  alertas_whatsapp: false,
  exportar_relatorios: false,
  ver_manual_usuario: true,
};

export const PERMISSOES_ADMIN_PADRAO: PermissoesOperador = {
  vender: true,
  gestao_caixa: true,
  dar_desconto: true,
  alterar_preco: true,
  estornar_venda: true,
  reimprimir_cupom: true,
  gerenciar_delivery: true,
  cadastrar_produtos: true,
  excluir_produtos: true,
  baixa_estoque: true,
  catalogo_global: true,
  gerenciar_devedores: true,
  ver_relatorios: true,
  ver_graficos: true,
  inteligencia_estoque: true,
  gerenciar_equipe: true,
  imprimir_etiquetas: true,
  configurar_balanca: true,
  usar_ocr_ia: true,
  alertas_validade: true,
  alertas_whatsapp: true,
  exportar_relatorios: true,
  ver_manual_usuario: true,
};

// ==========================================
// ESTRUTURA DO DELIVERY (ESTILO ZÉ DELIVERY)
// ==========================================

export interface ConfiguracaoDelivery {
  ativo: boolean;
  extensaoContratada?: boolean; // Controlado pela Dona do App (Extensão Paga do PDV) // Loja aberta para delivery
  raioMaximoKm: number; // Raio em km atendido (ex: 7)
  taxaEntregaFixa: number; // Taxa padrão em R$ (ex: 6.90)
  taxaPorKm?: number; // Opcional adicional por km
  tempoMinimoMinutos: number; // Ex: 25
  tempoMaximoMinutos: number; // Ex: 45
  valorMinimoPedido: number; // Ex: 20.00
  pedidoMinimo?: number; // Alias para compatibilidade
  tempoMedioMinutos?: number; // Alias para compatibilidade
  aceitaPix?: boolean;
  aceitaCartaoEntrega?: boolean;
  aceitaDinheiro?: boolean;
  horarioAbertura?: string;
  horarioFechamento?: string;
  mensagemBoasVindas?: string;
  chavePix?: string; // Chave PIX da loja para pagamento
  telefoneContatoLoja?: string;
  repeticoesAlerta?: number; // Quantidade de repetições do toque do sino (1 a 10, ou 99 para contínuo)
  aceitarAutomatico?: boolean; // Aceita o pedido automaticamente movendo para 'em_separacao' e abatendo estoque
  imprimirAutomatico?: boolean; // Imprime cupom/comanda automaticamente na impressora térmica ao chegar novo pedido
  larguraImpressao?: '80mm' | '58mm';
  enderecoLoja?: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep?: string;
  };
}

export interface ItemPedidoDelivery {
  codigo: string;
  nome: string;
  quantidade: number;
  preco_unitario: number;
  preco_custo?: number;
  subtotal: number;
  foto?: string;
  gelado?: boolean; // Tag característica de bebida trincando de gelada
  lote?: string;
  validade?: string;
}

export type StatusPedidoDelivery =
  | 'pendente'          // Novo pedido aguardando a loja aceitar
  | 'em_separacao'      // Loja aceitou, separando produtos
  | 'pronto'            // Pronto para retirada ou envio
  | 'saiu_para_entrega' // Com o entregador/motoboy a caminho
  | 'entregue'          // Finalizado com validação de PIN / Retirado
  | 'cancelado';        // Recusado ou cancelado

export interface PedidoDelivery {
  id: string; // Ex: del_1042
  numeroPedido: number; // Ex: 1042
  lojaId: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:mm
  timestamp: number;
  cliente: {
    nome: string;
    telefone: string; // WhatsApp
    cpf?: string;
    maior18AnosConfirmado: boolean;
  };
  enderecoEntrega: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    referencia?: string;
    cep?: string;
  };
  itens: ItemPedidoDelivery[];
  subtotal: number;
  taxaEntrega: number;
  valorTotal: number;
  formaPagamento: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro';
  trocoPara?: number;
  status: StatusPedidoDelivery;
  tipo_pedido?: 'delivery' | 'retirada' | 'mesa';
  mesaNumero?: string;
  atendenteNome?: string;
  observacao?: string;
  codigoEntregaPin: string; // Ex: '4912' (PIN de 4 dígitos para confirmação de entrega segura)
  motivoCancelamento?: string;
  dataFinalizacao?: string;
  horaFinalizacao?: string;
  entregadorNome?: string;
  motoboyToken?: string;
  chegouAoEndereco?: boolean;
  entregueEmTimestamp?: number;
}

// ============================================================================
// CONSTANTES E HELPERS DE LINKS EXCLUSIVOS & TOKENS DE SEGURANÇA
// ============================================================================

export const MASTER_PORTAL_TOKEN = 'master_9k2m8x7p';

export function normalizarSlugLoja(nomeOuId: string): string {
  const limpo = (nomeOuId || 'loja-centro')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return limpo || 'loja-centro';
}

function hashCurtoDeterministico(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0).toString(36).slice(0, 4).padEnd(4, '9');
}

export function garantirTokensLoja(loja: Supermercado, forcarNovoRandom = false): Supermercado {
  const slugBase = loja.slug ? normalizarSlugLoja(loja.slug) : normalizarSlugLoja(loja.nome || loja.id);
  const partes = slugBase.split('-').filter((p) => p && p !== 'loja' && p !== 'supermercado');
  const identificadorCurto = (partes[0] || slugBase.split('-')[0] || 'centro').slice(0, 10);

  const gerarSufixo = (tipo: string) =>
    forcarNovoRandom
      ? Math.random().toString(36).substring(2, 6).padEnd(4, 'x')
      : hashCurtoDeterministico(`${loja.id}_${tipo}_tok_2026`);

  return {
    ...loja,
    slug: loja.slug || slugBase,
    token_admin:
      !forcarNovoRandom && loja.token_admin
        ? loja.token_admin
        : `adm_${identificadorCurto}_${gerarSufixo('adm')}`,
    token_garcom:
      !forcarNovoRandom && loja.token_garcom
        ? loja.token_garcom
        : `gar_${identificadorCurto}_${gerarSufixo('gar')}`,
    token_cozinha:
      !forcarNovoRandom && loja.token_cozinha
        ? loja.token_cozinha
        : `coz_${identificadorCurto}_${gerarSufixo('coz')}`,
    token_caixa:
      !forcarNovoRandom && loja.token_caixa
        ? loja.token_caixa
        : `cx_${identificadorCurto}_${gerarSufixo('cx')}`,
  };
}

export function obterLinksExclusivosLoja(lojaInput: Supermercado, originOverride?: string) {
  const loja = garantirTokensLoja(lojaInput);
  const origin =
    originOverride ||
    (typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://seusite.com/');
  const base = origin.endsWith('/') ? origin.slice(0, -1) : origin;
  const slug = encodeURIComponent(loja.slug || loja.id);

  return {
    cardapio: `${base}/?loja=${slug}`,
    admin: `${base}/?loja=${slug}&painel=admin&token=${encodeURIComponent(loja.token_admin!)}`,
    garcom: `${base}/?loja=${slug}&painel=garcom&token=${encodeURIComponent(loja.token_garcom!)}`,
    cozinha: `${base}/?loja=${slug}&painel=cozinha&token=${encodeURIComponent(loja.token_cozinha!)}`,
    caixa: `${base}/?loja=${slug}&painel=caixa&token=${encodeURIComponent(loja.token_caixa!)}`,
    tokens: {
      token_admin: loja.token_admin!,
      token_garcom: loja.token_garcom!,
      token_cozinha: loja.token_cozinha!,
      token_caixa: loja.token_caixa!,
    },
  };
}

export function obterLinkPortalMaster(originOverride?: string): string {
  const origin =
    originOverride ||
    (typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://seusite.com/');
  const base = origin.endsWith('/') ? origin.slice(0, -1) : origin;
  return `${base}/?portal=master&token=${MASTER_PORTAL_TOKEN}`;
}

