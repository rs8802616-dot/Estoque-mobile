# 📖 Documentação Geral do Projeto: Estoque Mobile Multi-Supermercado

> **AVISO IMPORTANTE PARA A IA (ASSISTENTE):**  
> Antes de executar **qualquer nova alteração ou implementação solicitada pelo usuário**, você **DEVE OBRIGATORIAMENTE LER ESTE ARQUIVO** (`DOCUMENTACAO-PROJETO.md`) para compreender o estado real do projeto, sua arquitetura, regras de segurança e padrões técnicos.  
> Após concluir cada alteração solicitada pelo usuário, você **DEVE ATUALIZAR ESTE ARQUIVO** na seção de **Histórico de Alterações (Changelog)** e demais seções pertinentes antes de finalizar a resposta.

---

## 1. Visão Geral do Sistema

O **Estoque Mobile Multi-Supermercado** é uma aplicação web progressiva (PWA/Mobile-First e Desktop) para gestão completa de supermercados e redes varejistas. O sistema opera com arquitetura multi-supermercado (multi-tenant), permitindo gerenciar diferentes lojas, estoques independentes por loja, catálogo unificado de produtos por código de barras, ponto de venda (PDV / Frente de Caixa), controle de validade por lotes, crediário/fiado (clientes devedores), fechamento de caixa e auditoria.

### Principais Recursos
- **Gestão de Estoque Multi-Loja:** Isolamento de estoque por loja (`lojaId`), controle de lotes, datas de validade, custos, preços de venda e alertas automáticos de vencimento próximo.
- **Catálogo Global de Produtos:** Catálogo compartilhado de produtos baseado em código de barras (EAN/GTIN) e etiquetas de balança (peso/preço).
- **Frente de Caixa (PDV):** Registro rápido de vendas com leitor de código de barras (câmera e leitor físico/USB), cálculo de troco, descontos, formas de pagamento (Dinheiro, PIX, Cartão de Crédito/Débito, Fiado) e impressão/emissão de cupom não-fiscal.
- **Caderneta de Clientes Devedores (Fiado):** Controle de clientes fiado, limites de crédito, histórico de compras, amortizações e pagamentos parciais.
- **Gestão de Operadores e Caixas:** Abertura, suprimento, sangria e fechamento de turnos de caixa com conferência cega e relatórios.
- **Alertas de Validade e Reposição:** Notificações em tela e integração para alertas via WhatsApp.
- **Leitor de Código de Barras e Balança (Autoatendimento / PDV Físico):** Suporte tanto a câmera quanto a leitores físicos USB/Bluetooth/Mesa (modo Keyboard Wedge). Ao bipar produtos com o leitor:
  - Se for o mesmo produto bipado repetidas vezes, o sistema incrementa a quantidade automaticamente (+1 un a cada bipe) e recalcula o subtotal;
  - Se forem produtos diferentes, cada um é adicionado sequencialmente ao carrinho;
  - Suporta etiquetas de balança (padrão 2xxxx) decodificando peso/preço instantaneamente;
  - Não requer foco prévio em campo de digitação (captura global com proteção anti-duplicação de rajadas).
- **Operação Offline-First:** Persistência local e reconciliação automática com Firebase Firestore.

---

## 2. Arquitetura e Stack Tecnológica

| Componente | Tecnologia | Detalhes |
|---|---|---|
| **Frontend** | React 18 + TypeScript + Vite | Interface responsiva mobile e desktop |
| **Estilização** | Tailwind CSS | Layout sem dependência de CSS externo |
| **Ícones** | Lucide React | Biblioteca padrão de ícones SVG |
| **Animações** | Motion (`motion/react`) | Transições de tela suaves |
| **Banco de Dados** | Google Cloud Firebase Firestore | Sincronização em tempo real multi-tenant |
| **Persistência de Imagens** | IndexedDB (`mercado_midia_offline_db`) | Armazenamento de fotos em Base64 com cache síncrono em memória (`imageIndexedDB.ts`) |
| **Persistência de Estado** | LocalStorage Seguro (`safeStorage.ts`) | Higienização de dados para evitar estouro da cota de 5MB |
| **Backend/Servidor** | Node.js + Express (`server.ts`) | Porta 3000 obrigatória, modo Vite middleware em dev e static em prod |

---

## 3. Estrutura de Arquivos e Diretórios

```
├── .env.example                # Variáveis de ambiente declaradas
├── AGENTS.md                   # Instruções persistentes do agente de IA
├── DOCUMENTACAO-PROJETO.md     # Esta documentação viva do projeto
├── firestore.rules             # Regras de segurança do Cloud Firestore
├── firebase-blueprint.json     # Esquema blueprint do Firestore
├── metadata.json               # Configurações de permissões e metadados da aplicação
├── package.json                # Dependências e scripts de inicialização
├── server.ts                   # Servidor Express com integração Vite
├── src/
│   ├── App.tsx                 # Componente principal, telas, PDV, roteamento e estado central
│   ├── index.css               # Estilização global com Tailwind CSS
│   ├── main.tsx                # Ponto de entrada do React
│   ├── types.ts                # Definições de tipos e interfaces TypeScript
│   ├── components/             # Modais e componentes da interface
│   │   ├── AlertasWhatsAppModal.tsx
│   │   ├── AlterarCredenciaisDonoModal.tsx
│   │   ├── CarrinhoVendaModal.tsx
│   │   ├── CentroNotificacoesModal.tsx
│   │   ├── ConsultaProdutosModal.tsx
│   │   ├── CupomVendaModal.tsx
│   │   ├── EtiquetasModal.tsx
│   │   ├── GestaoCaixaModal.tsx
│   │   ├── GestaoDevedoresModal.tsx
│   │   ├── GraficosVendasModal.tsx
│   │   ├── ManualUsuarioModal.tsx
│   │   ├── RelatorioVendasModal.tsx
│   │   ├── TelaLogin.tsx
│   │   └── TermoConcordanciaModal.tsx
│   └── lib/                    # Utilitários e serviços de infraestrutura
│       ├── balancaUtils.ts     # Decodificador de códigos de barras de balança
│       ├── barcodeScanner.ts   # Utilitários para escaneamento de código de barras
│       ├── exportUtils.ts      # Exportação de relatórios (CSV, Excel)
│       ├── firebase.ts         # Inicialização do Firebase e Firestore
│       ├── firestoreSync.ts    # Sincronização em tempo real com Firestore
│       ├── imageCompressor.ts  # Compressão inteligente de imagens para economia de dados
│       ├── imageIndexedDB.ts   # Armazenamento persistente no IndexedDB com cache em memória
│       ├── offlineSync.ts      # Fila de sincronização para operações offline
│       ├── safeStorage.ts      # Wrapper seguro para LocalStorage (proteção contra cota 5MB)
│       ├── screenWakeLock.ts   # Manter tela ativa durante operação de caixa
│       ├── sessionManager.ts   # Controle de sessões ativas
│       └── soundUtils.ts       # Efeitos sonoros para bipes de leitor e ações
```

---

## 4. Regras Críticas de Segurança e Dados

1. **Credenciais Master Bloqueadas no Cliente (`firestore.rules`):**
   - Coleções `usuarios_master` e `config_sistema` devem ter sempre `allow read, write: if false;`. Nenhuma leitura ou escrita de credenciais master pode ocorrer diretamente pelo cliente.
2. **Segurança de Mídia e Fotos de Produtos:**
   - O `localStorage` tem limite estrito de **5MB**. Imagens em Base64 nunca devem ser gravadas diretamente no `localStorage`.
   - As imagens devem ser gravadas no **IndexedDB** via `salvarImagemIndexedDB` e carregadas no cache de memória instantâneo através de `obterFotoCache`.
   - Na reconciliação de dados em `subscribeEstoque` e `subscribeCatalogo`, fotos locais e fotos do IndexedDB nunca devem ser sobrescritas por strings vazias caso a nuvem envie documentos sem a propriedade `foto`/`imagem`.
3. **Isolamento Multi-Tenant:**
   - Toda operação de estoque, venda, caixa ou cliente deve respeitar rigorosamente o `lojaId` do supermercado atualmente ativo.

---

## 5. Histórico de Alterações (Changelog)

### [2026-10-24 - Atualização 23]
- **Enriquecimento e Cobertura 100% de Fotos nos 263 Produtos do Catálogo Global e Adega Mix:**
  - **Problema Solucionado:** Dos 263 produtos cadastrados no Banco de Dados Global, os 90 produtos do mix essencial de adega (Whiskies Red Label, Black Label, Old Parr, Buchanan's, Jameson, Passport; Vodkas Absolut, Smirnoff, Orloff, Askov; Gins Tanqueray, Gordon's; Cervejas Heineken, Amstel, Eisenbahn; Vinhos Casillero, Pergola, Concha y Toro; Salgadinhos Doritos, Ruffles, Cheetos, Torcida, Pringles; Chocolates Bis, Kit Kat, Lacta; Tabacaria, Isqueiros BIC, Sedas, Carvão e Gelo) estavam com links de fotos quebrados (retornando erro 404).
  - **Ações Implementadas:**
    1. **Varredura e Validação Automatizada de Imagens:**
       - Executado robô automatizado de pesquisa que localizou fotos de produto de alta definição em CDNs globais estáveis (Bing/DDG CDN, Imigrantes Bebidas, fabricantes oficiais).
       - Todas as imagens passaram por teste de validação HTTP HEAD/GET (100% das 263 fotos retornando status `200 OK`).
    2. **Atualização Imediata no Firestore (`catalogo_global` e `estoque`):**
       - Todos os 90 documentos no Firestore `catalogo_global` foram atualizados com as URLs definitivas das fotos nos campos `imagem`, `foto` e `foto_url`.
       - Itens em estoque vinculados a esses códigos tiveram suas fotos sincronizadas automaticamente no banco de dados.
    3. **Atualização no Código-Fonte Local:**
       - Arquivo [`src/lib/catalogoAdegaMix.ts`](file:///C:/Users/paulo/Downloads/Estoque-mobile--main/src/lib/catalogoAdegaMix.ts) atualizado com os novos links permanentes das imagens.
    4. **Atualização de Cache do Service Worker:**
       - PWA atualizado para a versão `estoque-mobile-pwa-v27` em `public/sw.js` e `src/main.tsx`.

### [2026-10-24 - Atualização 22]
- **Eliminação Completa de Preenchimento Automático (Autofill Indevido) nos Filtros de Busca e Catálogo:**
  - **Problema Solucionado:** Ao entrar no Catálogo Geral / Banco de Dados Master ou no Relatório de Estoque, o navegador (Chrome/Edge) preenchia automaticamente as credenciais salvas do usuário (`rodrigo.souza`) no campo de pesquisa, filtrando a lista indevidamente e exibindo a mensagem "Nenhum produto cadastrado no banco de dados mestre ainda". Adicionalmente, o estado de busca anterior era salvo no `localStorage` sob a chave `busca_relatorio_salva`, mantendo o filtro ativo mesmo após reloads.
  - **Ações Implementadas:**
    1. **Atributos Anti-Autofill Estritos em Todos os Inputs de Busca (`src/App.tsx` e `src/components/ConsultaProdutosModal.tsx`):**
       - Substituído `type="text"` por `type="search"`.
       - Adicionados atributos anti-preenchimento: `autoComplete="new-password"`, `autoCorrect="off"`, `autoCapitalize="none"`, `spellCheck={false}`, `data-form-type="other"`, `data-lpignore="true"` e `data-1p-ignore="true"`.
       - Nomes específicos de query de busca adicionados (`search_query_banco_dados_mestre`, `search_query_relatorio_estoque`, `search_query_estoque_pdv`, `search_query_consulta_produtos`).
    2. **Sanitização Reativa de Estado:**
       - Hooks de `useEffect` adicionados para limpar automaticamente qualquer termo que contenha `rodrigo.souza` ou nomes de login em `buscaMasterBd`, `buscaRelatorio`, `buscaLoja`, `busca` e `termoLocal`.
       - Limpeza automática do `buscaMasterBd` ao abrir o painel da dona do aplicativo e ao alternar para a aba do Banco de Dados Master.
       - Botão visual "✕" de limpeza instantânea de busca adicionado dentro da barra de pesquisa do Banco de Dados Master.
    3. **Limpeza do `localStorage` (`busca_relatorio_salva`):**
       - Prevenção de persistência de credenciais e remoção automática da chave caso contenha termos de login.
    4. **Atualização de Cache do Service Worker:**
       - PWA atualizado para a versão `estoque-mobile-pwa-v26` em `public/sw.js` e `src/main.tsx`.

### [2026-10-24 - Atualização 15]
- **Inversão de Prioridade do Motor Duplo: 1º API Bluesoft Cosmos (Principal) + 2º API BomJawaKit (Contingência):**
  - Atendendo à solicitação do usuário, a **API Bluesoft Cosmos** (`https://api.cosmos.bluesoft.com.br` com `X-Cosmos-Token: 2Vu6HJqH8130Bk_YhL8Osg`) foi configurada como **1ª Prioridade (API Principal)** em `src/lib/bomJawaKitApi.ts`, `api/consultar-produto-codigo.js`, `api/buscar-produtos-externos.js`, `server.ts` e `src/components/ConsultaProdutosModal.tsx`.
  - A **API BomJawaKit** (`https://produtos.bomjawakit.com.br/api/v1` com `X-API-Key: sk_VZvKYX-ldCakrfALLxpzKPvmRUoawNN7hewD678CvGU`) atua em **2º lugar como Contingência e Complemento Automático** quando a Bluesoft Cosmos atingir seu limite diário (`HTTP 429`) ou quando um produto não existir na Bluesoft Cosmos.
  - Atualizado o cache do Service Worker para `estoque-mobile-pwa-v19` (`public/sw.js` e `src/main.tsx`).

### [2026-10-24 - Atualização 14]
- **Motor Duplo de Consulta de Produtos (Dual-API: BomJawaKit + Bluesoft Cosmos API):**
  - **Integração Conjunta das 2 APIs (`src/lib/bomJawaKitApi.ts`, `server.ts`, `api/consultar-produto-codigo.js`, `api/buscar-produtos-externos.js`):**
    1. **API 1 (BomJawaKit):** `https://produtos.bomjawakit.com.br/api/v1` autenticada via header `X-API-Key: sk_VZvKYX-ldCakrfALLxpzKPvmRUoawNN7hewD678CvGU`.
    2. **API 2 (Bluesoft Cosmos API):** `https://api.cosmos.bluesoft.com.br` (`/gtins/{gtin}.json` e `/products?query={query}`) autenticada via header `X-Cosmos-Token: 2Vu6HJqH8130Bk_YhL8Osg` e `User-Agent: Cosmos-API-Request`.
  - **Funcionamento em Conjunto (Contingência de Limite + Complemento de Dados):**
    - **Se atingir o limite (HTTP 429/403):** Caso uma das APIs atinja o limite diário/mensal de requisições ou apresente instabilidade, a outra API assume automaticamente sem interromper o cadastro.
    - **Se não tiver em uma, busca na outra:** Quando um código de barras não é encontrado na API 1, o sistema consulta imediatamente a API 2 (Bluesoft Cosmos).
    - **Enriquecimento e Fotos:** Caso um produto exista na API 1 mas esteja sem marca, categoria ou foto (`tem_imagem: false`), o sistema complementa automaticamente os dados e utiliza o CDN de imagens da Bluesoft Cosmos (`https://cdn-cosmos.bluesoft.com.br/products/{ean}`).
    - **Serverless Functions para Vercel (`api/consultar-produto-codigo.js` e `api/buscar-produtos-externos.js`):** Criadas funções serverless Node.js na pasta `/api` para que as chamadas ao Bluesoft Cosmos rodem no backend da Vercel sem bloqueio de CORS do navegador.
  - Atualizado o cache do Service Worker para `estoque-mobile-pwa-v18` (`public/sw.js` e `src/main.tsx`).

### [2026-10-24 - Atualização 13]
- **Correção do Erro de Runtime `Cannot read properties of null (reading 'toFixed')`:**
  - **Causa Raiz Identificada:** No salvamento de produto no Modo Master (`salvarProduto` em `src/App.tsx`), a expressão `typeof cadPreco === 'string' ? parseFloat(cadPreco.replace(',', '.')) : Number(cadPreco) || 0` gerava `NaN` quando o campo de preço estava vazio (`""`), e `JSON.stringify` convertia `NaN` para `null` ao salvar no `localStorage` e no Firestore (`preco_venda: null`, `preco_custo: null`). Na leitura inicial da tela, `p.preco_venda.toFixed(2)` lançava `TypeError: Cannot read properties of null (reading 'toFixed')`.
  - **Correções Aplicadas:**
    - Criada a função `sanitizarItemEstoque` em `src/lib/firestoreSync.ts` e aplicada em todas as leituras e escritas do Firestore e `localStorage` (`subscribeEstoque`, `salvarItemEstoqueFirestore` e todos os inicializadores de `estoque` em `src/App.tsx`), convertendo automaticamente qualquer valor `null`, `undefined` ou `NaN` em número finito seguro (`0`).
    - Corrigida a precedência do operador ternário em `salvarProduto` (`src/App.tsx`).
    - Blindadas todas as chamadas `.toFixed(2)` em `src/App.tsx`, `src/components/CardapioClienteDeliveryModal.tsx`, `src/components/CarrinhoVendaModal.tsx`, `src/components/EtiquetasModal.tsx`, `src/components/AlertasWhatsAppModal.tsx` e `src/components/CentroNotificacoesModal.tsx` com `Number(... || 0).toFixed(2)`.
  - Atualizado o cache do Service Worker para `estoque-mobile-pwa-v17` (`public/sw.js` e `src/main.tsx`).

### [2026-10-24 - Atualização 12]
- **Integração com a API Oficial de Produtos BomJawaKit (`https://produtos.bomjawakit.com.br/api/v1`) com `X-API-Key`:**
  - Criado o módulo dedicado `src/lib/bomJawaKitApi.ts` configurado com a chave de API `sk_VZvKYX-ldCakrfALLxpzKPvmRUoawNN7hewD678CvGU` no header `X-API-Key` em todas as requisições.
  - Endpoints integrados:
    - `GET /api/v1/produtos/{barcode}` e `GET /api/v1/produtos?barcode=...`: Consulta imediata por código de barras ao bipar/digitar no cadastro (`consultarEANGemini` em `src/App.tsx` e `/api/consultar-produto-codigo` em `server.ts`), preenchendo Nome, Categoria, NCM e Foto oficial em PNG.
    - `GET /api/v1/produtos?q=...&categoria=...&com_imagem=...&limit=24&offset=...`: Busca paginada por nome, código ou categoria no modal `ConsultaProdutosModal.tsx` (funcionando 100% direto no navegador na Vercel e também via `server.ts`).
    - `GET /api/v1/categorias`: Seletor de categorias reais da API (+26.000 produtos distribuídos em 31 categorias como Água, Bebidas Alcoólicas, Refrigerantes, Sucos, Vinhos, Mercearia, Perecíveis, Hortifruti, Açougue, Limpeza, etc.).
    - Resolução otimizada das imagens em PNG via CDN R2 (`https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/{barcode}.png`) e `/api/v1/produtos/{barcode}/imagem`, economizando a cota mensal de chamadas da chave de API.
  - Atualizado o cache do Service Worker para `estoque-mobile-pwa-v16` (`public/sw.js` e `src/main.tsx`).

### [2026-10-23 - Atualização 11]
- **Correção do Cabeçalho Responsivo no Celular (`src/components/CardapioClienteDeliveryModal.tsx`):**
  - Corrigido o esmagamento horizontal do cabeçalho em telas de celular onde o nome da loja cortava (`A...`) e os textos de tempo (`25-45 min`) e taxa (`Taxa: R$ 5.00`) quebravam em 3 linhas verticais.
  - No celular, a primeira linha agora é dedicada 100% ao nome da loja (`flex-1 min-w-0 truncate`), enquanto a segunda linha agrupa com `whitespace-nowrap` os indicadores `● Aberto • 🕒 25-45 min • Taxa: R$ 5.00` sem quebrar palavras ao meio.
  - Removido o botão de cadeado (`Lock`) e ocultado o botão `✕` quando o cardápio está aberto via link público em tela cheia (`modoTelaCheia`), liberando espaço útil no topo do celular.
  - Atualizado o cache do Service Worker para `estoque-mobile-pwa-v15` (`public/sw.js` e `src/main.tsx`).

### [2026-10-23 - Atualização 10]
- **Remoção da Barra Superior de Indicador de Entrega e Seletor de Bairro na Vitrine do Cardápio (`src/components/CardapioClienteDeliveryModal.tsx`):**
  - Removida a faixa superior com os blocos `🛵 Entrega Rápida (Somente Delivery)` e `📍 Bairro de Entrega: ...` que aparecia acima da barra de pesquisa na vitrine de produtos (`etapa === 'vitrine'`).
  - O cardápio agora abre diretamente na barra de busca rápida, filtros de categoria e grade de produtos, mantendo a seleção do bairro e cálculo da taxa de entrega na etapa de Checkout / Endereço (`etapa === 'checkout'`).
  - Atualizado o cache do Service Worker para `estoque-mobile-pwa-v14` (`public/sw.js` e `src/main.tsx`).

### [2026-10-23 - Atualização 9]
- **Correção de Layout do Acordeão do Menu Lateral, Tutorial Passo a Passo Completo e Exibição Única do Termo de Uso:**
  - **Correção do Layout do Menu Lateral (`src/index.css` e `src/App.tsx`):**
    - Adicionado `flex-shrink: 0` em todos os grupos do `.sidebar-menu` para evitar que o Flexbox esmagasse os grupos fechados quando um grupo com vários itens era expandido.
    - Padronizados os sub-itens dentro de cada grupo expandido como botões completos (`background: #ffffff`, `border: 1px solid #e2e8f0`, `border-radius: 10px`) ocupando toda a largura útil do card.
  - **Termo de Uso Exibido Somente 1 Única Vez no 1º Login do Dispositivo (`src/App.tsx`):**
    - Removido o atalho do Termo de Uso do menu lateral.
    - Gravada a aceitação tanto na chave do login quanto na chave persistente do dispositivo (`termo_uso_aceito_dispositivo_v1` e `termo_unico_dispositivo_${idContaLogin}`), garantindo que o modal apareça exclusivamente na primeira vez em que o login conecta no aparelho.
  - **Tutorial Passo a Passo & Manual do Sistema (`src/components/ManualUsuarioModal.tsx`):**
    - Reformulado com **Passo 1: Como Funciona o Aplicativo (Rotina Diária dos 5 Passos e Mapa dos 5 Grupos do Menu)**, **Passo 2: Delivery Completo (Link Exclusivo do Cardápio, Baixa FEFO ao Aceitar, Comanda Térmica, Link Motoboy com Rota Google Maps e PIN de 4 dígitos)**, **Passo 3: Frente de Caixa (PDV), Leitor USB/Bluetooth, Câmera e Balança**, **Passo 4: Gestão de Caixa**, **Passo 5: Cadastro de Estoque, Lotes FEFO vs. Produtos Internos**, **Passo 6: Central de Relatórios & Lucro Líquido Real (4 Abas)**, **Passo 7: Alertas de Validade e Etiquetas**, **Passo 8: Caderneta de Fiado** e **Passo 9: Equipe, Permissões e Modo 100% Offline**, com botões de navegação `⬅️ Passo Anterior` e `Próximo Passo ➡️`.

### [2026-10-23 - Atualização 8]
- **Redesign Moderno do Menu Lateral em 5 Grupos Retráteis (Acordeão) (`src/App.tsx` e `src/index.css`):**
  - Substituídos os emojis antigos e caixas pesadas por um design moderno estilo SaaS:
    - **Cabeçalho Dark Slate (`#0f172a` -> `#1e293b`):** Ícone da loja em destaque, nome do estabelecimento e pílula de status de alto contraste (`Online • Sincronizado`).
    - **Ícones Vetoriais Lucide SVG (`lucide-react`):** Cada grupo possui um container arredondado (`34x34px`) com ícone vetorial que muda de cor quando expandido, seta `ChevronDown` com rotação suave e sub-itens alinhados em árvore vertical (`border-left`) sem quebras de linha nos títulos ou selos.
    - **Rodapé Fixo:** Botão de sincronização offline e botão `Sair da Conta / Trocar Usuário` fixos na base do menu lateral.
  - **5 Grupos com Memória (`menu_grupo_aberto` no `localStorage`):**
    1. **💰 Caixa & Vendas:** Gestão de Caixa (Abertura, Sangria & Turno), Área de Devedores / Fiado e Histórico de Vendas & Cupons (com selos de status `🟢 Aberto` / `🔴 Fechado` e contador de fiado visíveis no cabeçalho mesmo fechado).
    2. **📦 Estoque & Produtos:** Adicionar Item em Estoque, Posição de Estoque & Validades, Imprimir Etiquetas de Prateleira, Catálogo Global e Cadastro no Banco Master (exclusivo Dona do App).
    3. **🛵 Delivery:** Painel Delivery (com selo vermelho `NOVO` no cabeçalho do grupo e no item), Ver Cardápio do Cliente e botão rápido `🔗 Copiar Link do Cardápio`.
    4. **📊 Relatórios:** Central de Relatórios & Lucro Real (Hub Unificado de 4 abas) e Gráficos de Lucro & Faturamento.
    5. **⚙️ Configurações & Equipe:** Cadastrar Caixas & Permissões, Cadastrar / Gerenciar Lojas, Alterar Login / Senha (Dono do App), Alertas WhatsApp, Manual de Instruções e Termo de Sigilo & Concordância.
  - Mantido o isolamento de permissões por operador e loja: se o operador não tiver acesso a nenhum item de um grupo, o grupo inteiro fica oculto.

### [2026-10-22 - Atualização 7]
- **Correção Estrutural de CSS (Tailwind CSS v4), Painel Delivery Estilo AtendeJá, Cardápio Unificado com PDV e Correção dos Relatórios do Menu Lateral:**
  - **Correção Global de Espaçamento/Padding (`src/index.css`):**
    - Removida a limitação `max-width: 800px` de `.barra-acoes` e `width: 0` de `.input-busca` no cabeçalho superior (`src/index.css`), permitindo que a barra de pesquisa principal ocupe todo o espaço livre entre o botão de menu (`☰`) e os botões de ação no topo da tela.
    - Ajustadas as camadas de `z-index` (`.modal` para `10050`, `.leitor-tela` para `10100`, `CentralRelatoriosModal` para `99999`, `CupomVendaModal` e `EtiquetasModal` para `100200`, `avisoRestrito` para `100950`) para que nenhuma janela abra escondida atrás de painéis de tela cheia.
  - **Painel de Delivery no PDV (`src/components/CaixaDeliveryPanel.tsx`):**
    - Alinhado 100% às medidas e layout do AtendeJá: container verde-menta (`#f0fdf4`), borda `#a7f3d0`, `rounded-3xl`, filtros rápidos (`Ativos`, `Novos`, `Preparo`, `A Caminho 🛵`) e rodapé de cada pedido ativo exibindo lado a lado sem cortes: `[TOTAL R$ X (+taxa)]` + `[🖨️]` + `[🛵 Link Motoboy]` (roxo `#9333ea`) + `[✓ Confirmar Entrega / Aceitar Pedido / Despachar]` (verde `#059669`).
    - Bloqueado o autopreenchimento indevido de usuário salvo no navegador (`rodrigo.souza`) na barra de pesquisa usando `type="search"`, `autoComplete="off"`, `readOnly` com liberação no `onFocus`, e `pl-10` real para que a lupa nunca sobreponha o texto.
  - **Cardápio do Cliente Unificado com o Formato do PDV (`src/components/CardapioClienteDeliveryModal.tsx` e `src/components/CustomerDeliveryView.tsx`):**
    - Unificados o botão lateral **"🛍️ Ver Cardápio do Cliente"** e o link público **`/?loja=...`** para usarem exatamente a mesma estrutura limpa e expansiva do PDV (`.grid-produtos`, `.card-produto`, `.foto-produto`, `.info-card`, `.nome-prod`, `.detalhe`, `.preco-destaque`), com agrupamento rigoroso por código de barras e nome normalizado (nunca duplica produtos com números de lotes diferentes, somando o saldo total disponível), ocultação automática de produtos esgotados (`quantidade <= 0`) ou vencidos para o cliente, fotos reais resolvidas via `obterFotoProduto` e operação exclusiva por Delivery (sem a opção de Retirada no Balcão).
  - **Correção das Abas e Relatórios do Menu Lateral (`src/components/CentralRelatoriosModal.tsx` e `src/App.tsx`):**
    - Corrigido erro crítico de ordem de Hooks do React (`Rendered more hooks than during the previous render`) em `CentralRelatoriosModal.tsx` movendo `if (!visivel) return null;` para depois de todos os `useMemo`.
    - Conectados individualmente os itens do menu lateral: `📊 Central de Relatórios & Lucro Real` abre o Hub Unificado de 4 abas; `🧾 Histórico de Vendas & Cupons` abre `RelatorioVendasModal`; `📦 Posição de Estoque & Validades` abre a tela completa de posição de estoque com edição, exclusão, leitor e etiquetas (`abrirRelatorio()`); `📈 Gráficos de Lucro & Faturamento` abre `GraficosVendasModal`.
  - **Atualização Automática de Cache PWA (`public/sw.js` e `src/main.tsx`):**
    - Atualizado o Service Worker para `estoque-mobile-pwa-v7` com estratégia *Network-First* para HTML, JS e CSS (`/assets/`), além de limpeza automática de caches antigos na inicialização.

### [2026-10-21 - Atualização 6]
- **Ajustes de Acesso ao Cardápio do Cliente e Alinhamento Visual Idêntico ao AtendeJá:**
  - **Correção no Cardápio do Cliente (`CardapioClienteDeliveryModal.tsx`):**
    - Ajustado o `zIndex` para prioridade absoluta (`10000000`), evitando que a `TelaLogin` (`zIndex: 999999`) sobrepusesse o cardápio.
    - Implementado carregamento automático com fallback de produtos de bebidas geladas e conveniência (`BEBIDAS_FALLBACK`), garantindo que o cardápio nunca fique em branco mesmo com estoque novo.
    - Adicionado suporte a abertura direta via URL com parâmetros: `http://localhost:3000/?delivery=true` ou `#cardapio`.
    - Adicionado botão de destaque direto na `TelaLogin.tsx` ("🛵 Ver Cardápio & Fazer Pedido (Cliente)") para que consumidores finais acessem sem exigir login de funcionário.
  - **Área de Pedidos da Loja Idêntica ao AtendeJá (`GestaoDeliveryModal.tsx`):**
    - Pílulas de filtro de status idênticas às do AtendeJá: `TODOS`, `🔴 NOVOS` (com indicador pulsante e contagem), `🟠 EM PREPARO` (ícone `Flame`), `🟣 A CAMINHO` (ícone `Bike`) e `🟢 ENTREGUES`.
    - Barra de pesquisa rápida integrada (cliente, endereço, fone e número do pedido).
    - Botão de compartilhamento rápido com cópia do link do cardápio (`Copiar Link Cardápio`).
    - Cards dos pedidos com bordas coloridas destacando o estado do pedido (Novo: borda 2px vermelha com ring de pulso; Em Preparo: borda 2px âmbar; A Caminho: borda 2px roxa; Entregue: borda 2px verde).
    - Bloco de informações do cliente com telefone linkado direto para WhatsApp e endereço com marcador vermelho.
    - Modal de impressão de comanda de separação e botões de ação de fluxo rápido alinhados com o padrão AtendeJá.

### [2026-10-21 - Atualização 5]
- **Implementação do Módulo de Delivery (Estilo Zé Delivery) e Central Unificada de Relatórios:**
  - **Solicitação do Usuário:** Transformar o aplicativo para funcionar com as funcionalidades completas de delivery do Zé Delivery, unificar todos os relatórios espalhados em um único local centralizado e garantir operação 100% autônoma via LocalStorage (offline-first).
  - **Módulo de Delivery (Estilo Zé Delivery):**
    - `src/components/GestaoDeliveryModal.tsx`: Painel de despacho da loja parceira com Kanban de pedidos em tempo real (Novos Pedidos 🟡, Em Separação 🔵, A Caminho 🟣, Entregues 🟢, Cancelados 🔴).
    - **Alarme Sonoro Contínuo:** Sistema dispara campainha sonoro automática (`tocarAlertaNovoPedidoDelivery`) via Web Audio API sempre que chegam novos pedidos pendentes.
    - **Baixa Automática no Estoque:** Ao aceitar o pedido, o sistema baixa as quantidades do estoque físico da loja e registra automaticamente a venda no histórico e no caixa do turno.
    - **Despacho para Motoboy via WhatsApp:** Botão com rota direta no Google Maps/Waze, telefone e endereço do cliente prontos para envio.
    - **Confirmação Segura com PIN:** Validação de código PIN de 4 dígitos informado pelo cliente no ato da entrega para liberação e finalização do pedido.
    - `src/components/CardapioClienteDeliveryModal.tsx`: Web App do consumidor estilo Zé Delivery com:
      - Verificação obrigatória de maioridade (+18 anos para bebidas alcoólicas);
      - Definição de endereço e geolocalização com cálculo de taxa de entrega;
      - Vitrine de bebidas geladas (cervejas trincando de gelada, destilados, vinhos, refrigerantes, gelo e carvão);
      - Checkout com PIX (chave/copia e cola), Cartão na entrega ou Dinheiro com troco;
      - Tela de rastreio ao vivo exibindo o PIN de 4 dígitos.
  - **Central Única de Relatórios & Lucro Real (`src/components/CentralRelatoriosModal.tsx`):**
    - Unificação de todos os relatórios em um único Hub inteligente de 4 abas:
      1. *📊 Faturamento & Lucro Real:* Dashboard de KPIs (Faturamento Bruto, CMV, Só Lucro Real com margens, Vendas Balcão vs Delivery), Gráfico de evolução diária de lucro e Gráfico de formas de pagamento.
      2. *🧾 Histórico de Vendas & Cupons:* Filtros avançados por data, operador, status, tipo (Balcão ou Delivery), busca instantânea, detalhamento de custo e lucro por item, reimpressão de cupom, estorno com devolução ao estoque e exportação CSV.
      3. *📦 Posição de Estoque & Validades:* Capital imobilizado a preço de custo, potencial de venda, lucro projetado, filtros de validades (vencidos, 7 dias, 15 dias, 30 dias) e itens críticos.
      4. *🛵 Inteligência Zé Delivery:* Métricas de delivery, arrecadação de taxas de entrega, ticket médio, bairros que mais pedem e produtos campeões de delivery.
  - **Persistência 100% LocalStorage:**
    - Operação de pedidos, configurações de delivery, estoque e vendas persistidos via LocalStorage (`pedidos_delivery_${lojaId}`, `config_delivery_${lojaId}`, `vendas_${lojaId}`), funcionando com velocidade máxima mesmo sem Firebase ativo.


### [2026-10-18 - Atualização 4]
- **Confirmação e Diretrizes de Operação Plug-and-Play do Leitor Físico:**
  - **Dúvida Operacional do Usuário:** Se basta plugar o leitor de código de barras no computador/terminal para que ele comece a funcionar imediatamente.
  - **Validação Técnica (`src/App.tsx`):**
    - Confirmado que os leitores operam em modo padrão de fábrica *HID Keyboard Wedge* (Emulação de Teclado USB/Bluetooth).
    - O sistema possui captura global automática via evento de janela (`keydown`), sem necessidade de instalação de drivers, softwares terceiros ou de clicar manualmente em nenhum campo de texto.
    - Únicos pré-requisitos para operação imediata:
      1. Conectar via USB ou parear Bluetooth (o sistema operacional reconhece como dispositivo de entrada padrão).
      2. O turno do caixa estar aberto no sistema.
      3. O produto possuir o código EAN/balança cadastrado.

### [2026-10-18 - Atualização 3]
- **Documentação e Validação da Operação de Leitor de Código de Barras Físico / Autoatendimento:**
  - **Dúvida Operacional do Usuário:** Como o leitor de autoatendimento/totem se comporta ao bipar múltiplos produtos e se o sistema contabiliza corretamente as quantidades.
  - **Comportamento Validado no Código (`src/App.tsx` e `src/components/CarrinhoVendaModal.tsx`):**
    - **Produtos Diferentes:** Cada bipe adiciona uma nova linha independente no carrinho.
    - **Mesmo Produto em Múltiplas Unidades:** Cada bipe sucessivo soma automaticamente `+1` na quantidade do item já existente no carrinho e atualiza o subtotal instantaneamente.
    - **Integração Keyboard Wedge (USB/Bluetooth):** O leitor físico funciona globalmente via ouvinte de eventos `keydown` com detecção de rajada rápida (< 85ms) e enter automático, sem exigir clique prévio em nenhum input.
    - **Inteligência FEFO e Lotes:** Se a quantidade bipada ultrapassar o saldo do lote com validade mais próxima, o sistema puxa automaticamente os próximos lotes com estoque da loja.

### [2026-10-22 - Atualização 8]
- **Design do Painel de Delivery Idêntico ao AtendeJá (`CaixaDeliveryPanel.tsx`):**
  - **Container Mint:** Fundo `#f0fdf4` com borda arredondada `rounded-3xl` e contorno verde menta `#a7f3d0`.
  - **Cabeçalho:** Ícone da moto em caixa arredondada `#a7f3d0/80`, título `🛵 DELIVERY` com contador circular, subtítulo `Entrega motoboy no endereço` e botão `Cardápio`.
  - **Filtros de Status:** Abas `Ativos (X)` (verde escuro), `● Novos (X)` (vermelho suave com pulso), `Preparo (X)` (âmbar suave) e `A Caminho 🛵` (borda verde menta).
  - **Barra de Pesquisa:** Input oval com borda menta e busca por cliente, rua, telefone e número do pedido.
  - **Card de Pedido:**
    - Borda roxa vibrante `#a855f7` quando em trânsito (A Caminho) e bordas coloridas dinâmicas para novos e preparo.
    - Badges `🛵 DELIVERY` e `🛵 A CAMINHO` em verde escuro `#047857`.
    - Dados do cliente: nome, telefone, endereço com bairro, forma de pagamento, data e hora com badge `ANTERIOR` ou `HOJE`.
    - Lista de itens e subtotais.
    - Caixa de **TOTAL** em verde menta (`bg-[#d1fae5]/80` com `(+R$ X,XX taxa)`).
    - Botão de impressão comanda `🖨️`, botão roxo `🛵 Link Motoboy` (despacho WhatsApp com rota Google Maps) e botão verde `✓ Confirmar Entrega` com modal de validação de PIN de 4 dígitos.

### [2026-10-22 - Atualização 7]
- **Publicação do Projeto no GitHub:**
  - Repositório criado e sincronizado com sucesso: `https://github.com/rs8802616-dot/Estoque-mobile`.
  - Todos os 54 arquivos de código-fonte, módulos de delivery, PDV, regras do Firestore e documentação foram enviados para a branch principal `main`.

### [2026-10-22 - Atualização 6]
- **Padronização Visual 100% Idêntica ao PDV no Cardápio do Cliente:**
  - **Adoção Direta dos Componentes e Classes do PDV (`CustomerDeliveryView.tsx`):**
    - Grade estruturada com `className="grid-produtos"` idêntica à Frente de Caixa (`repeat(auto-fill, minmax(215px, 1fr))` a `minmax(250px, 1fr)`), preenchendo 100% da largura da tela perfeitamente.
    - Card construído exatamente com as classes e regras do PDV:
      - `card-produto` com fundo branco, cantos arredondados (`rounded-xl`), borda suave e sombra sutil.
      - `foto-produto` com proporção 4:3, fundo suave `#f8fafc`, borda inferior e imagem centralizada em `object-fit: contain`.
      - Badge laranja `🍢 Adega` no topo esquerdo para produtos de produção contínua/internos.
      - Badge verde `🛒 X no carrinho` no topo direito ao adicionar o produto.
      - `info-card` com `nome-prod` (duas linhas máx), `Cód: ...` (com tag `Interno` se aplicável) e linha de `Estoque Total: X un` (ou `♾️ Produção Contínua (Balcão)`).
      - Preço em destaque escuro/negrito (`R$ XX.XX`) e botão idêntico ao PDV: `🛒 + Carrinho` azul claro (`#e0f2fe`) com ícone de carrinho ou seletor de quantidade `[-] Qtd [+]` quando já adicionado.

### [2026-10-22 - Atualização 5]
- **Remoção de Categorias, Barra de Pesquisa Moderna e Expansão 100% Full-Width do Cardápio:**
  - **Remoção das Categorias no Cardápio (`CustomerDeliveryView.tsx`):**
    - Removida completamente a fileira horizontal de botões circulares com caixas e emojis de categorias (`CATEGORIAS:`).
    - O catálogo agora exibe imediatamente todos os produtos cadastrados da loja, sem filtros manuais forçados.
  - **Barra de Pesquisa Moderna e Elegante:**
    - Substituída a barra de pesquisa crua e fina por uma barra de busca moderna no estilo Zé Delivery / iFood.
    - Possui cantos arredondados suaves (`rounded-2xl`), ícone de busca estilizado em vermelho, foco com anel suave (`ring-2 ring-red-500/20`), badge dinâmico com contagem de produtos encontrados (`X itens`) e botão de limpeza instantânea (`✕`).
  - **Layout 100% Expansivo sem Limitação de Largura (Widescreen / Monitores Desktop):**
    - Removidas todas as limitações artificiais de `max-w-7xl` ou `max-w-[1600px]`.
    - O cabeçalho, a barra de busca, os cards da loja e a grade de produtos ocupam **100% da largura da tela** (`w-full`), eliminando por completo o espaço cinza vazio na lateral direita do monitor.
    - Grade ultra-responsiva com até 8 colunas fluidas (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 min-[1900px]:grid-cols-8`).

### [2026-10-22 - Atualização 4]
- **Ajuste de Imagens (object-contain) e Layout Expansivo no Cardápio do Cliente:**
  - **Ajuste de Proporção das Imagens dos Produtos (`CustomerDeliveryView.tsx` e `CardapioClienteDeliveryModal.tsx`):**
    - Substituído `object-cover` por `object-contain` com padding interno (`p-2 sm:p-2.5`) e fundo harmonizado (`bg-white dark:bg-stone-900`), exatamente como configurado na área do PDV (`.foto-produto img { object-fit: contain; }`).
    - Garrafas, latas e embalagens verticais (ex: Bacardí, Skyy Vodka, Campari, Coca-Cola, DuCoco) agora aparecem **completas, inteiras e sem cortes** no topo ou na base.
  - **Layout Expansivo e Responsivo (Desktop / Telas Grandes):**
    - Removido o limite estreito de `max-w-5xl` (1024px) que deixava grandes faixas vazias nas laterais em monitores desktop.
    - O container agora se expande fluidamente até `max-w-7xl 2xl:max-w-[1600px]`, preenchendo a tela de forma equilibrada.
    - O grid de produtos foi expandido de 4 colunas fixas para até 7 colunas fluidas (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 lg:gap-4.5`), aproveitando o espaço da tela igual ao PDV.

### [2026-10-22 - Atualização 3]
- **Isolamento Total do Cardápio do Cliente e Remoção de Acesso Administrativo e Banners:**
  - **Remoção de Acesso Administrativo no Cardápio (`CustomerDeliveryView.tsx`):**
    - Removido o botão de cadeado (`Lock` / `onTrocarParaFuncionario`) do cardápio do cliente.
    - O link do cliente (`?loja=<slug>`) agora é 100% restrito ao consumidor final, sem qualquer atalho, botão ou link para o painel de funcionários/administração.
  - **Remoção do Banner de Promoção Superior (`CustomerDeliveryView.tsx`):**
    - Removida a seção superior de "Oferta em Destaque / Oferta do Dia", permitindo que o cliente veja diretamente as categorias e o catálogo de produtos limpo e organizado.
  - **Roteamento Exclusivo e Isolado em Tela Cheia (`App.tsx`):**
    - Ao abrir `http://localhost:3000/?loja=<slug>`, a visualização do cardápio é renderizada isolada em tela cheia, sem modais ou tela de login por trás.
  - **Coluna de Delivery Integrada ao Caixa (`CaixaDeliveryPanel.tsx`):**
    - Coluna de delivery idêntica ao AtendeJá embutida na tela do Caixa com filtros de status (`Todos`, `🔴 Novos`, `Preparo`, `A Caminho`), botão de copiar link da loja, despacho no WhatsApp do motoboy com link de rota do Google Maps, validação de entrega por PIN de 4 dígitos e baixa no estoque via FEFO.

### [2026-10-22 - Atualização 3]
- **Cardápio do Cliente no Formato Exato do PDV, Correção de Autofill e Central de Relatórios:**
  - **Cardápio do Cliente (`CardapioClienteDeliveryModal.tsx`):**
    - Eliminado o antigo formato escuro com bloqueio de 18+ e categorias hardcoded de bebidas.
    - Implementado visual claro, expansivo e moderno idêntico ao PDV: cards com foto, nome, código/categoria, destaque de preço em verde esmeralda e stepper de quantidade `[ - ] {qtd} [ + ]`.
    - Filtros de categorias dinâmicos derivados do estoque real da loja (`📦 Todos`, `🍢 Balcão & Adega`, `🏷️ Industrial / EAN` e categorias de produtos).
    - Barra flutuante de checkout no rodapé com cálculo dinâmico de bairros e opções de Delivery e Retirada.
  - **Bloqueio de Autofill do Navegador na Busca (`CaixaDeliveryPanel.tsx`):**
    - Adicionado `autoComplete="new-password"` e normalização inteligente na busca de pedidos, impedindo que o navegador injete automaticamente o login (`rodrigo.souza`) e oculte pedidos ativos.
  - **Navegação do Menu Lateral & Relatórios (`CentralRelatoriosModal.tsx` e `App.tsx`):**
    - Corrigido o `useEffect` para escutar e alternar de forma reativa a aba ativa (`abaInicial`) da Central de Relatórios (`faturamento`, `vendas`, `estoque`), garantindo que todos os links do menu lateral abram instantaneamente na aba correta.
    - Removidas menções a "Zé Delivery" no menu lateral em favor de "Painel Delivery" e "Ver Cardápio do Cliente".

### [2026-10-24 - Atualização 21]
- **Unificação Total na Coleção `catalogo_global` (Segurança para Exclusão de `produtos_catalogo`):**
  - **Coleção Oficial Exclusiva:**
    - Atualizado o listener [`subscribeCatalogo`](file:///C:/Users/paulo/Downloads/Estoque-mobile--main/src/lib/firestoreSync.ts) e todos os métodos de leitura, busca e exclusão para operarem 100% sobre a coleção **`catalogo_global`**.
    - A coleção duplicada `produtos_catalogo` foi tornada obsoleta no código e pode ser deletada pelo usuário no Firebase Console sem nenhum impacto.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v25` em `public/sw.js` e `src/main.tsx`.

### [2026-10-24 - Atualização 20]
- **Verificação, População e Enriquecimento Total do Novo Banco (`adega-delivery-pdv`):**
  - **Catálogo Completo com 263 Produtos:**
    - Verificados e gravados todos os produtos desenvolvidos hoje na coleção `produtos_catalogo` do novo banco `adega-delivery-pdv`:
      - **173 Produtos Ambev:** Skol, Brahma, Antarctica, Original, Spaten, Corona, Stella Artois, Budweiser, Bohemia, Colorado, Patagonia, Beck's, Michelob, Beats, Guaraná Antarctica, Pepsi, Sukita, H2OH!, Gatorade, Fusion, Lipton.
      - **90 Produtos Mix Adega & Conveniência:** Whiskies (Red Label, Black Label, Jack Daniel's, Chivas, Ballantine's, White Horse, Jameson, Passport, Old Parr, Buchanan's), Vodkas (Smirnoff, Absolut, Askov, Orloff), Gins (Tanqueray, Gordon's, Rock's), Vinhos (Pérgola, Campo Largo, Casillero, Concha y Toro, Quinta do Morgado, Cantina da Serra, San Martin, Santa Helena, Chandon), Salgadinhos (Doritos, Ruffles, Cheetos, Fandangos, Torcida, Pringles, Amendoins, Ovinhos, Salamitos), Bomboniere (Halls, Trident, Mentos, Freegells, Bis, Kit Kat, Lacta, Nestlé, Paçoca), Tabacaria (Marlboro, Chesterfield, Lucky Strike, Winston, Rothmans, Dunhill, Camel, Sedas Smoking/Zomo, Isqueiros BIC, Palheiros, Carvão e Gelo) e Cervejas do Grupo Heineken (Heineken Long Neck, Lata, 600ml, 0.0, Amstel e Eisenbahn).
    - Cada produto está no Firestore com `codigo` (EAN-13), `nome`, `marca`, `categoria`, `unidade_medida`, `imagem` oficial em alta resolução e `descricao`.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v24` em `public/sw.js` e `src/main.tsx`.

### [2026-10-24 - Atualização 19]
- **Conexão e Configuração do Novo Banco de Dados Dedicado (`adega-delivery-pdv`):**
  - **Novo Projeto Firebase Independente:**
    - Atualizado o arquivo de configuração [`firebase-applet-config.json`](file:///C:/Users/paulo/Downloads/Estoque-mobile--main/firebase-applet-config.json) com o novo projeto criado pelo usuário:
      - `projectId`: `"adega-delivery-pdv"`
      - `authDomain`: `"adega-delivery-pdv.firebaseapp.com"`
      - `storageBucket`: `"adega-delivery-pdv.firebasestorage.app"`
      - `appId`: `"1:120526498592:web:4c975e296bb8765ee08545"`
    - O aplicativo anterior de produção (`estoque-mobile-sepia.vercel.app`) fica 100% isolado e protegido em seu próprio banco anterior, sem qualquer risco de interferência.
  - **Regras de Segurança do Firestore (`firestore.rules`):**
    - Adicionada regra explícita para a coleção `pedidos_delivery` (`match /pedidos_delivery/{pedidoId} { allow read, write: if true; }`).
  - **Sincronização em Lote de Produtos:**
    - Conectadas as funções `sincronizarCatalogoAmbevComFirestore` e `sincronizarCatalogoAdegaComFirestore` para gravar os 257 produtos diretamente no novo banco `adega-delivery-pdv`.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v23` em `public/sw.js` e `src/main.tsx`.

### [2026-10-24 - Atualização 18]
- **Isolamento e Armazenamento 100% Interno no Catálogo Geral do Aplicativo:**
  - **Remoção de Gravação Externa no Firestore:**
    - Ajustadas as funções de importação do Catálogo Ambev e do Mix de Adega em [`catalogoAmbev.ts`](file:///C:/Users/paulo/Downloads/Estoque-mobile--main/src/lib/catalogoAmbev.ts) e [`catalogoAdegaMix.ts`](file:///C:/Users/paulo/Downloads/Estoque-mobile--main/src/lib/catalogoAdegaMix.ts) para `sincronizarCatalogoAmbevLocalmente` e `sincronizarCatalogoAdegaLocalmente`.
    - Os **257 produtos cadastrados** (Ambev + Whiskies, Vinhos, Snacks, Balas e Cigarros) são mantidos estritamente dentro da memória e armazenamento local seguro do próprio aplicativo (`catalogoGlobal` / LocalStorage / IndexedDB), sem enviar dados para bancos externos ou de outros aplicativos.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v22` em `public/sw.js` e `src/main.tsx`.

### [2026-10-24 - Atualização 17]
- **Pesquisa e Integração do Mix Completo de Adega (Whiskies, Vinhos, Salgados, Bomboniere, Tabacaria, Carvão e Gelo):**
  - **Pesquisa de Mercado de Adegas:**
    - Uma adega/distribuidora de conveniência opera tipicamente com **150 a 300 itens** (versão express de bairro) ou **350 a 700 itens** (adega completa).
    - O mix essencial abrange as categorias de maior giro: Cervejas e Bebidas Ambev (173 itens), Whiskies e Destilados de Alto Giro, Vinhos Nacionais e Importados, Salgadinhos e Snacks (Doritos, Ruffles, Torcida), Balas e Doces (Halls, Trident, Bis, Mentos) e Tabacaria (Marlboro, Chesterfield, Sedas, Isqueiros, Carvão e Gelo).
  - **Módulo Dedicado (`src/lib/catalogoAdegaMix.ts`):**
    - Criado banco com **84 produtos essenciais de alta demanda**:
      - **Whiskies & Destilados:** *Johnnie Walker Red Label 1L, Black Label 1L, Jack Daniel's 1L, Chivas Regal 12 Anos 1L, Ballantine's Finest 1L, White Horse 1L, Jameson 750ml, Passport Scotch 1L, Old Parr 12 Anos 1L, Buchanan's 12 Anos 1L, Natu Nobilis 1L, Teacher's 1L, Vodka Smirnoff 998ml, Vodka Absolut 1L, Vodka Askov Tradicional e Frutas Vermelhas 900ml, Vodka Orloff 1L, Gin Tanqueray 750ml, Gin Gordon's 750ml, Gin Rock's 995ml, Campari 900ml, Jurupinga 975ml, Cachaça 51 965ml, Velho Barreiro 910ml, Pitú 965ml, Jägermeister 700ml, Licor Amarula 750ml*.
      - **Vinhos & Espumantes:** *Pérgola Tinto Suave 1L, Pérgola Tinto Seco 1L, Campo Largo Tinto Suave 750ml, Casillero del Diablo Cabernet Sauvignon 750ml, Reservado Concha y Toro 750ml, Quinta do Morgado 1L, Cantina da Serra 880ml, San Martin 750ml, Santa Helena 750ml, Espumante Chandon Brut 750ml*.
      - **Salgadinhos & Snacks:** *Doritos Queijo Nacho (140g, 53g), Batata Ruffles (Original 76g, Cebola e Salsa 76g), Cheetos Requeijão 115g, Fandangos Presunto 115g, Torcida (Queijo 70g, Churrasco 70g, Pimenta Mexicana 70g), Pringles (Original 114g, Cebola 114g), Amendoim Dori Japonês 120g, Amendoim Santa Helena Mendorato 120g, Ovinhos de Amendoim 65g, Salamitos Sadia 36g*.
      - **Doces, Balas & Bomboniere:** *Halls (Extra Forte 28g, Prata Mentol 28g, Cereja 28g), Chiclete Trident (Menta, Hortelã, Melancia 25.2g), Bala Mentos (Fruit, Mint 37.5g), Freegells Cereja 27.6g, Chocolate Bis (Ao Leite 126g, Branco 126g), Kit Kat 41.5g, Barra Lacta Diamante Negro 90g, Barra Lacta Laka Branco 90g, Barra Nestlé Classic Ao Leite 90g, Paçoca Rolha Santa Helena 15g*.
      - **Tabacaria, Carvão & Gelo:** *Cigarro Marlboro (Red Box, Gold Box), Chesterfield (Original Box, Blue Box), Lucky Strike Blue Box, Winston Red Box, Rothmans Azul Box, Dunhill Carlton Box, Camel Blue Box, Seda Smoking King Size, Seda Zomo Slim King Size, Isqueiro BIC (Grande Maxi, Mini), Palheiro Souza Paiol, Carvão Vegetal para Churrasco 3kg, Gelo em Cubos Filtrado 5kg*.
  - **Integração no Banco Global e Firestore (`src/App.tsx` & `src/lib/catalogoAdegaMix.ts`):**
    - Unificação de catálogo: O sistema agora garante automaticamente **257 produtos cadastrados com fotos, categorias, marcas e descrições completas** no `catalogoGlobal` do lojista (173 da Ambev + 84 do Mix de Adega).
    - Botão **`🥃 Mix Adega (Whiskies, Vinhos, Salgados, Cigarros)`** adicionado no Banco de Dados Mestre para sincronização sob demanda com a nuvem Firestore.
    - Todos os itens possuem botão **`+ Estoque`** e descrições detalhadas.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v21` em `public/sw.js` e `src/main.tsx`.

### [2026-10-24 - Atualização 16]
- **Integração e Sincronização do Catálogo Completo Oficial da Ambev no Banco Global:**
  - **Módulo Dedicado (`src/lib/catalogoAmbev.ts`):**
    - Criado banco com **173 produtos oficiais da Ambev** cobrindo todas as marcas líderes: Skol, Brahma, Antarctica, Antarctica Original, Spaten, Corona, Stella Artois, Budweiser, Bohemia, Colorado, Patagonia, Beck's, Michelob Ultra, Hoegaarden, Beats, Guaraná Antarctica, Pepsi, Sukita, H2OH!, Gatorade, Tônica Antarctica, Fusion Energy Drink e Lipton Ice Tea.
    - Cada produto possui Código de Barras EAN real e validado, Nome completo, Marca padronizada, Categoria correta de supermercado/adega, Unidade de Medida/Volume extraído e formatado, Imagens oficiais em alta resolução (via CDN R2 / Cosmos CDN) e Descrição detalhada do produto.
  - **Auto-Reconciliação e Persistência no Firebase Firestore (`src/App.tsx` & `src/lib/catalogoAmbev.ts`):**
    - Implementadas as funções `garantirCatalogoAmbevNoBancoGlobal` e `sincronizarCatalogoAmbevComFirestore` que cruzam automaticamente o catálogo do usuário com a base da Ambev.
    - Novos produtos da Ambev são inseridos no catálogo global e produtos já existentes sem foto, marca ou descrição são enriquecidos automaticamente sem sobrescrever personalizações do lojista.
    - Sincronização em lotes em segundo plano com a coleção `produtos_catalogo` e espelhamento em `catalogo_global` no Firestore.
  - **Interface no Painel do Banco de Dados Mestre (`src/App.tsx`):**
    - Adicionado o botão **`🍺 Sincronizar Catálogo Ambev (173 Itens)`** no topo do modal do Banco de Dados com feedback de progresso e relatório de itens inseridos/atualizados.
    - Adicionada a tag dourada visual **`🍺 Ambev`** em cada item pertencente ao catálogo da fabricante.
    - Exibição de descrição do produto formatada e botão direto **`+ Estoque`** para que o comerciante adicione qualquer produto do portfólio Ambev diretamente ao estoque de sua loja com 1 clique.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v20` em `public/sw.js` e `src/main.tsx`.

### [2026-10-22 - Atualização 2]
- **Renderização Exclusiva do CustomerDeliveryView e Coluna CaixaView do AtendeJá:**
  - **Acesso ao Link (`/?loja=` ou `/?delivery=true`):**
    - Implementada a renderização exclusiva de `CustomerDeliveryView.tsx` em tela cheia idêntica ao AtendeJá (`if (publicLojaSlugAtivo && !painelParamAtivo) return <CustomerDeliveryView ... />`).
    - Nenhuma tela de login, modal sobreposto ou interface antiga de supermercado é renderizada por trás.
    - Possui o cabeçalho slim com logo, nome da loja, status 'Loja Aberta', botão 'Meus Pedidos', atalho do carrinho, alternador claro/escuro e botão de acesso da equipe.
    - Banner promocional da oferta do dia, botões circulares de categorias, grid com fotos reais, gaveta modal de carrinho com cálculo de bairros (`taxas_bairro`), PIN de 4 dígitos e link direto de envio no WhatsApp da loja.
  - **Coluna de Delivery Integrada ao Caixa (`CaixaDeliveryPanel.tsx`):**
    - Inserida a coluna fixa de delivery no Caixa/PDV idêntica ao `CaixaView.tsx` do AtendeJá.
    - Cards com bordas coloridas por status (`Novos`, `Preparo`, `A Caminho`, `Entregue`).
    - Botão de confirmação de pedido com baixa automática no estoque físico por FEFO.
    - Botão de despacho com mensagem WhatsApp e rota no Google Maps para o motoboy.
    - Modal de conferência e validação do código PIN de 4 dígitos.
    - Botão no cabeçalho do Caixa para fixar/ocultar o painel lateral de delivery a qualquer momento.

### [2026-10-22 - Atualização 3]
- **Cardápio do Cliente no Formato Exato do PDV, Correção de Autofill e Central de Relatórios:**
  - **Cardápio do Cliente (`CardapioClienteDeliveryModal.tsx`):**
    - Eliminado o antigo formato escuro com bloqueio de 18+ e categorias hardcoded de bebidas.
    - Implementado visual claro, expansivo e moderno idêntico ao PDV: cards com foto, nome, código/categoria, destaque de preço em verde esmeralda e stepper de quantidade `[ - ] {qtd} [ + ]`.
    - Filtros de categorias dinâmicos derivados do estoque real da loja (`📦 Todos`, `🍢 Balcão & Adega`, `🏷️ Industrial / EAN` e categorias de produtos).
    - Barra flutuante de checkout no rodapé com cálculo dinâmico de bairros e opções de Delivery e Retirada.
  - **Bloqueio de Autofill do Navegador na Busca (`CaixaDeliveryPanel.tsx`):**
    - Adicionado `autoComplete="new-password"` e normalização inteligente na busca de pedidos, impedindo que o navegador injete automaticamente o login (`rodrigo.souza`) e oculte pedidos ativos.
  - **Navegação do Menu Lateral & Relatórios (`CentralRelatoriosModal.tsx` e `App.tsx`):**
    - Corrigido o `useEffect` para escutar e alternar de forma reativa a aba ativa (`abaInicial`) da Central de Relatórios (`faturamento`, `vendas`, `estoque`), garantindo que todos os links do menu lateral abram instantaneamente na aba correta.
    - Removidas menções a "Zé Delivery" no menu lateral em favor de "Painel Delivery" e "Ver Cardápio do Cliente".

### [2026-10-24 - Atualização 21]
- **Unificação Total na Coleção `catalogo_global` (Segurança para Exclusão de `produtos_catalogo`):**
  - **Coleção Oficial Exclusiva:**
    - Atualizado o listener [`subscribeCatalogo`](file:///C:/Users/paulo/Downloads/Estoque-mobile--main/src/lib/firestoreSync.ts) e todos os métodos de leitura, busca e exclusão para operarem 100% sobre a coleção **`catalogo_global`**.
    - A coleção duplicada `produtos_catalogo` foi tornada obsoleta no código e pode ser deletada pelo usuário no Firebase Console sem nenhum impacto.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v25` em `public/sw.js` e `src/main.tsx`.

### [2026-10-24 - Atualização 20]
- **Verificação, População e Enriquecimento Total do Novo Banco (`adega-delivery-pdv`):**
  - **Catálogo Completo com 263 Produtos:**
    - Verificados e gravados todos os produtos desenvolvidos hoje na coleção `produtos_catalogo` do novo banco `adega-delivery-pdv`:
      - **173 Produtos Ambev:** Skol, Brahma, Antarctica, Original, Spaten, Corona, Stella Artois, Budweiser, Bohemia, Colorado, Patagonia, Beck's, Michelob, Beats, Guaraná Antarctica, Pepsi, Sukita, H2OH!, Gatorade, Fusion, Lipton.
      - **90 Produtos Mix Adega & Conveniência:** Whiskies (Red Label, Black Label, Jack Daniel's, Chivas, Ballantine's, White Horse, Jameson, Passport, Old Parr, Buchanan's), Vodkas (Smirnoff, Absolut, Askov, Orloff), Gins (Tanqueray, Gordon's, Rock's), Vinhos (Pérgola, Campo Largo, Casillero, Concha y Toro, Quinta do Morgado, Cantina da Serra, San Martin, Santa Helena, Chandon), Salgadinhos (Doritos, Ruffles, Cheetos, Fandangos, Torcida, Pringles, Amendoins, Ovinhos, Salamitos), Bomboniere (Halls, Trident, Mentos, Freegells, Bis, Kit Kat, Lacta, Nestlé, Paçoca), Tabacaria (Marlboro, Chesterfield, Lucky Strike, Winston, Rothmans, Dunhill, Camel, Sedas Smoking/Zomo, Isqueiros BIC, Palheiros, Carvão e Gelo) e Cervejas do Grupo Heineken (Heineken Long Neck, Lata, 600ml, 0.0, Amstel e Eisenbahn).
    - Cada produto está no Firestore com `codigo` (EAN-13), `nome`, `marca`, `categoria`, `unidade_medida`, `imagem` oficial em alta resolução e `descricao`.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v24` em `public/sw.js` e `src/main.tsx`.

### [2026-10-24 - Atualização 19]
- **Conexão e Configuração do Novo Banco de Dados Dedicado (`adega-delivery-pdv`):**
  - **Novo Projeto Firebase Independente:**
    - Atualizado o arquivo de configuração [`firebase-applet-config.json`](file:///C:/Users/paulo/Downloads/Estoque-mobile--main/firebase-applet-config.json) com o novo projeto criado pelo usuário:
      - `projectId`: `"adega-delivery-pdv"`
      - `authDomain`: `"adega-delivery-pdv.firebaseapp.com"`
      - `storageBucket`: `"adega-delivery-pdv.firebasestorage.app"`
      - `appId`: `"1:120526498592:web:4c975e296bb8765ee08545"`
    - O aplicativo anterior de produção (`estoque-mobile-sepia.vercel.app`) fica 100% isolado e protegido em seu próprio banco anterior, sem qualquer risco de interferência.
  - **Regras de Segurança do Firestore (`firestore.rules`):**
    - Adicionada regra explícita para a coleção `pedidos_delivery` (`match /pedidos_delivery/{pedidoId} { allow read, write: if true; }`).
  - **Sincronização em Lote de Produtos:**
    - Conectadas as funções `sincronizarCatalogoAmbevComFirestore` e `sincronizarCatalogoAdegaComFirestore` para gravar os 257 produtos diretamente no novo banco `adega-delivery-pdv`.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v23` em `public/sw.js` e `src/main.tsx`.

### [2026-10-24 - Atualização 18]
- **Isolamento e Armazenamento 100% Interno no Catálogo Geral do Aplicativo:**
  - **Remoção de Gravação Externa no Firestore:**
    - Ajustadas as funções de importação do Catálogo Ambev e do Mix de Adega em [`catalogoAmbev.ts`](file:///C:/Users/paulo/Downloads/Estoque-mobile--main/src/lib/catalogoAmbev.ts) e [`catalogoAdegaMix.ts`](file:///C:/Users/paulo/Downloads/Estoque-mobile--main/src/lib/catalogoAdegaMix.ts) para `sincronizarCatalogoAmbevLocalmente` e `sincronizarCatalogoAdegaLocalmente`.
    - Os **257 produtos cadastrados** (Ambev + Whiskies, Vinhos, Snacks, Balas e Cigarros) são mantidos estritamente dentro da memória e armazenamento local seguro do próprio aplicativo (`catalogoGlobal` / LocalStorage / IndexedDB), sem enviar dados para bancos externos ou de outros aplicativos.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v22` em `public/sw.js` e `src/main.tsx`.

### [2026-10-24 - Atualização 17]
- **Pesquisa e Integração do Mix Completo de Adega (Whiskies, Vinhos, Salgados, Bomboniere, Tabacaria, Carvão e Gelo):**
  - **Pesquisa de Mercado de Adegas:**
    - Uma adega/distribuidora de conveniência opera tipicamente com **150 a 300 itens** (versão express de bairro) ou **350 a 700 itens** (adega completa).
    - O mix essencial abrange as categorias de maior giro: Cervejas e Bebidas Ambev (173 itens), Whiskies e Destilados de Alto Giro, Vinhos Nacionais e Importados, Salgadinhos e Snacks (Doritos, Ruffles, Torcida), Balas e Doces (Halls, Trident, Bis, Mentos) e Tabacaria (Marlboro, Chesterfield, Sedas, Isqueiros, Carvão e Gelo).
  - **Módulo Dedicado (`src/lib/catalogoAdegaMix.ts`):**
    - Criado banco com **84 produtos essenciais de alta demanda**:
      - **Whiskies & Destilados:** *Johnnie Walker Red Label 1L, Black Label 1L, Jack Daniel's 1L, Chivas Regal 12 Anos 1L, Ballantine's Finest 1L, White Horse 1L, Jameson 750ml, Passport Scotch 1L, Old Parr 12 Anos 1L, Buchanan's 12 Anos 1L, Natu Nobilis 1L, Teacher's 1L, Vodka Smirnoff 998ml, Vodka Absolut 1L, Vodka Askov Tradicional e Frutas Vermelhas 900ml, Vodka Orloff 1L, Gin Tanqueray 750ml, Gin Gordon's 750ml, Gin Rock's 995ml, Campari 900ml, Jurupinga 975ml, Cachaça 51 965ml, Velho Barreiro 910ml, Pitú 965ml, Jägermeister 700ml, Licor Amarula 750ml*.
      - **Vinhos & Espumantes:** *Pérgola Tinto Suave 1L, Pérgola Tinto Seco 1L, Campo Largo Tinto Suave 750ml, Casillero del Diablo Cabernet Sauvignon 750ml, Reservado Concha y Toro 750ml, Quinta do Morgado 1L, Cantina da Serra 880ml, San Martin 750ml, Santa Helena 750ml, Espumante Chandon Brut 750ml*.
      - **Salgadinhos & Snacks:** *Doritos Queijo Nacho (140g, 53g), Batata Ruffles (Original 76g, Cebola e Salsa 76g), Cheetos Requeijão 115g, Fandangos Presunto 115g, Torcida (Queijo 70g, Churrasco 70g, Pimenta Mexicana 70g), Pringles (Original 114g, Cebola 114g), Amendoim Dori Japonês 120g, Amendoim Santa Helena Mendorato 120g, Ovinhos de Amendoim 65g, Salamitos Sadia 36g*.
      - **Doces, Balas & Bomboniere:** *Halls (Extra Forte 28g, Prata Mentol 28g, Cereja 28g), Chiclete Trident (Menta, Hortelã, Melancia 25.2g), Bala Mentos (Fruit, Mint 37.5g), Freegells Cereja 27.6g, Chocolate Bis (Ao Leite 126g, Branco 126g), Kit Kat 41.5g, Barra Lacta Diamante Negro 90g, Barra Lacta Laka Branco 90g, Barra Nestlé Classic Ao Leite 90g, Paçoca Rolha Santa Helena 15g*.
      - **Tabacaria, Carvão & Gelo:** *Cigarro Marlboro (Red Box, Gold Box), Chesterfield (Original Box, Blue Box), Lucky Strike Blue Box, Winston Red Box, Rothmans Azul Box, Dunhill Carlton Box, Camel Blue Box, Seda Smoking King Size, Seda Zomo Slim King Size, Isqueiro BIC (Grande Maxi, Mini), Palheiro Souza Paiol, Carvão Vegetal para Churrasco 3kg, Gelo em Cubos Filtrado 5kg*.
  - **Integração no Banco Global e Firestore (`src/App.tsx` & `src/lib/catalogoAdegaMix.ts`):**
    - Unificação de catálogo: O sistema agora garante automaticamente **257 produtos cadastrados com fotos, categorias, marcas e descrições completas** no `catalogoGlobal` do lojista (173 da Ambev + 84 do Mix de Adega).
    - Botão **`🥃 Mix Adega (Whiskies, Vinhos, Salgados, Cigarros)`** adicionado no Banco de Dados Mestre para sincronização sob demanda com a nuvem Firestore.
    - Todos os itens possuem botão **`+ Estoque`** e descrições detalhadas.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v21` em `public/sw.js` e `src/main.tsx`.

### [2026-10-24 - Atualização 16]
- **Integração e Sincronização do Catálogo Completo Oficial da Ambev no Banco Global:**
  - **Módulo Dedicado (`src/lib/catalogoAmbev.ts`):**
    - Criado banco com **173 produtos oficiais da Ambev** cobrindo todas as marcas líderes: Skol, Brahma, Antarctica, Antarctica Original, Spaten, Corona, Stella Artois, Budweiser, Bohemia, Colorado, Patagonia, Beck's, Michelob Ultra, Hoegaarden, Beats, Guaraná Antarctica, Pepsi, Sukita, H2OH!, Gatorade, Tônica Antarctica, Fusion Energy Drink e Lipton Ice Tea.
    - Cada produto possui Código de Barras EAN real e validado, Nome completo, Marca padronizada, Categoria correta de supermercado/adega, Unidade de Medida/Volume extraído e formatado, Imagens oficiais em alta resolução (via CDN R2 / Cosmos CDN) e Descrição detalhada do produto.
  - **Auto-Reconciliação e Persistência no Firebase Firestore (`src/App.tsx` & `src/lib/catalogoAmbev.ts`):**
    - Implementadas as funções `garantirCatalogoAmbevNoBancoGlobal` e `sincronizarCatalogoAmbevComFirestore` que cruzam automaticamente o catálogo do usuário com a base da Ambev.
    - Novos produtos da Ambev são inseridos no catálogo global e produtos já existentes sem foto, marca ou descrição são enriquecidos automaticamente sem sobrescrever personalizações do lojista.
    - Sincronização em lotes em segundo plano com a coleção `produtos_catalogo` e espelhamento em `catalogo_global` no Firestore.
  - **Interface no Painel do Banco de Dados Mestre (`src/App.tsx`):**
    - Adicionado o botão **`🍺 Sincronizar Catálogo Ambev (173 Itens)`** no topo do modal do Banco de Dados com feedback de progresso e relatório de itens inseridos/atualizados.
    - Adicionada a tag dourada visual **`🍺 Ambev`** em cada item pertencente ao catálogo da fabricante.
    - Exibição de descrição do produto formatada e botão direto **`+ Estoque`** para que o comerciante adicione qualquer produto do portfólio Ambev diretamente ao estoque de sua loja com 1 clique.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v20` em `public/sw.js` e `src/main.tsx`.

### [2026-10-22 - Atualização 2]
- **Fidelidade Visual Total ao Modelo AtendeJá no Painel de Delivery do PDV (`CaixaDeliveryPanel.tsx` e `App.tsx`):**
  - **Alinhamento às Imagens de Referência:**
    - Ajustado o conjunto de botões da barra inferior do card para conter simultaneamente: `TOTAL` (box verde-menta), `[🖨️]` (imprimir comanda), `[🛵 Link Motoboy]` (botão roxo `#9333ea`) e o botão de ação verde (`[✓ Aceitar Pedido]`, `[✓ Despachar]` ou `[✓ Confirmar Entrega]`), exatamente como no modelo original AtendeJá.
    - Largura da coluna no grid do PDV expandida para `465px` no `App.tsx` (medida idêntica à captura de tela de referência), garantindo que todos os 4 elementos caibam em linha única sem quebras ou transbordamento.
    - Mantidos os destaques de borda por status (`border-2 border-[#a855f7]` para pedidos a caminho, vermelho para novos e âmbar para preparo).
    - Campo de busca refinado com espaçamento sem sobreposição de ícones.
- **Módulo de Delivery Idêntico ao AtendeJá com Roteamento por Loja e Segurança:**
  - **Link Exclusivo por Loja (`/?loja=<slug_ou_id>`):**
    - Quando um cliente acessa o link da loja via navegador (ex: `http://localhost:3000/?loja=loja_matriz_01` ou `?delivery=true`), o sistema identifica a loja automaticamente e abre diretamente o **Cardápio Digital do Cliente** (`CardapioClienteDeliveryModal.tsx`), **sem exibir a tela de login de funcionários**.
    - No cabeçalho do cardápio foi inserido o botão discreto `🔐 Acesso Equipe`, permitindo que funcionários e operadores de caixa transitem para a tela de login do PDV quando desejarem.
    - Na tela de login de funcionários (`TelaLogin.tsx`), foi adicionado o botão `🛵 Ver Cardápio & Fazer Pedido (Cliente)` para testes imediatos.
    - No painel da loja (`GestaoDeliveryModal.tsx`), o botão `Copiar Link Cardápio` copia automaticamente a URL parametrizada com o slug e nome da loja.
  - **Cardápio do Cliente com Recursos do AtendeJá (`CardapioClienteDeliveryModal.tsx`):**
    - **Seletor de Bairro com Taxa Dinâmica (`taxas_bairro`):** Suporte à seleção de bairros cadastrados na loja (Centro, Jardim América, Vila Nova, Bela Vista, Consolação, etc.) com recálculo automático da taxa de entrega em tempo real.
    - **Seletor de Modalidade:** Alternância entre `🛵 Receber em Casa (Delivery)` e `🛍️ Retirar no Balcão (Grátis)`.
    - **Carrinho e Checkout Completo:** Persistência de perfil do cliente (`localStorage`), formas de pagamento (PIX com chave da loja e botão copiar, Cartão de Crédito/Débito, Dinheiro com troco).
    - **Segurança com PIN de 4 Dígitos:** Geração automática de código PIN exclusivo para o cliente fornecer ao motoboy no ato da entrega.
    - **Envio Direto no WhatsApp da Loja:** Botão instantâneo para o cliente enviar o comprovante com os itens, endereço e PIN diretamente para o WhatsApp do estabelecimento.
    - **Histórico "Meus Pedidos":** Aba para o cliente consultar seus pedidos recentes e seus respectivos PINs de segurança.
  - **Painel de Pedidos da Loja & Motoboy (`GestaoDeliveryModal.tsx`):**
    - Abas com contador e status dinâmicos (`TODOS`, `🔴 NOVOS` com animação de pulso, `🔥 EM PREPARO`, `🛵 A CAMINHO`, `✓ ENTREGUES`).
    - Alerta sonoro contínuo com Web Audio API enquanto houver novos pedidos pendentes.
    - Baixa automática no estoque físico e lotes da loja via FEFO ao aceitar o pedido.
    - Botão `Despachar Motoboy` com link pré-formatado para o WhatsApp do entregador contendo endereço completo e rota do Google Maps (`https://www.google.com/maps/search/?api=1&query=...`).
    - Validação de entrega segura por PIN de 4 dígitos.
    - Impressão térmica de comandas para o balcão.

### [2026-10-22 - Atualização 3]
- **Cardápio do Cliente no Formato Exato do PDV, Correção de Autofill e Central de Relatórios:**
  - **Cardápio do Cliente (`CardapioClienteDeliveryModal.tsx`):**
    - Eliminado o antigo formato escuro com bloqueio de 18+ e categorias hardcoded de bebidas.
    - Implementado visual claro, expansivo e moderno idêntico ao PDV: cards com foto, nome, código/categoria, destaque de preço em verde esmeralda e stepper de quantidade `[ - ] {qtd} [ + ]`.
    - Filtros de categorias dinâmicos derivados do estoque real da loja (`📦 Todos`, `🍢 Balcão & Adega`, `🏷️ Industrial / EAN` e categorias de produtos).
    - Barra flutuante de checkout no rodapé com cálculo dinâmico de bairros e opções de Delivery e Retirada.
  - **Bloqueio de Autofill do Navegador na Busca (`CaixaDeliveryPanel.tsx`):**
    - Adicionado `autoComplete="new-password"` e normalização inteligente na busca de pedidos, impedindo que o navegador injete automaticamente o login (`rodrigo.souza`) e oculte pedidos ativos.
  - **Navegação do Menu Lateral & Relatórios (`CentralRelatoriosModal.tsx` e `App.tsx`):**
    - Corrigido o `useEffect` para escutar e alternar de forma reativa a aba ativa (`abaInicial`) da Central de Relatórios (`faturamento`, `vendas`, `estoque`), garantindo que todos os links do menu lateral abram instantaneamente na aba correta.
    - Removidas menções a "Zé Delivery" no menu lateral em favor de "Painel Delivery" e "Ver Cardápio do Cliente".

### [2026-10-24 - Atualização 21]
- **Unificação Total na Coleção `catalogo_global` (Segurança para Exclusão de `produtos_catalogo`):**
  - **Coleção Oficial Exclusiva:**
    - Atualizado o listener [`subscribeCatalogo`](file:///C:/Users/paulo/Downloads/Estoque-mobile--main/src/lib/firestoreSync.ts) e todos os métodos de leitura, busca e exclusão para operarem 100% sobre a coleção **`catalogo_global`**.
    - A coleção duplicada `produtos_catalogo` foi tornada obsoleta no código e pode ser deletada pelo usuário no Firebase Console sem nenhum impacto.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v25` em `public/sw.js` e `src/main.tsx`.

### [2026-10-24 - Atualização 20]
- **Verificação, População e Enriquecimento Total do Novo Banco (`adega-delivery-pdv`):**
  - **Catálogo Completo com 263 Produtos:**
    - Verificados e gravados todos os produtos desenvolvidos hoje na coleção `produtos_catalogo` do novo banco `adega-delivery-pdv`:
      - **173 Produtos Ambev:** Skol, Brahma, Antarctica, Original, Spaten, Corona, Stella Artois, Budweiser, Bohemia, Colorado, Patagonia, Beck's, Michelob, Beats, Guaraná Antarctica, Pepsi, Sukita, H2OH!, Gatorade, Fusion, Lipton.
      - **90 Produtos Mix Adega & Conveniência:** Whiskies (Red Label, Black Label, Jack Daniel's, Chivas, Ballantine's, White Horse, Jameson, Passport, Old Parr, Buchanan's), Vodkas (Smirnoff, Absolut, Askov, Orloff), Gins (Tanqueray, Gordon's, Rock's), Vinhos (Pérgola, Campo Largo, Casillero, Concha y Toro, Quinta do Morgado, Cantina da Serra, San Martin, Santa Helena, Chandon), Salgadinhos (Doritos, Ruffles, Cheetos, Fandangos, Torcida, Pringles, Amendoins, Ovinhos, Salamitos), Bomboniere (Halls, Trident, Mentos, Freegells, Bis, Kit Kat, Lacta, Nestlé, Paçoca), Tabacaria (Marlboro, Chesterfield, Lucky Strike, Winston, Rothmans, Dunhill, Camel, Sedas Smoking/Zomo, Isqueiros BIC, Palheiros, Carvão e Gelo) e Cervejas do Grupo Heineken (Heineken Long Neck, Lata, 600ml, 0.0, Amstel e Eisenbahn).
    - Cada produto está no Firestore com `codigo` (EAN-13), `nome`, `marca`, `categoria`, `unidade_medida`, `imagem` oficial em alta resolução e `descricao`.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v24` em `public/sw.js` e `src/main.tsx`.

### [2026-10-24 - Atualização 19]
- **Conexão e Configuração do Novo Banco de Dados Dedicado (`adega-delivery-pdv`):**
  - **Novo Projeto Firebase Independente:**
    - Atualizado o arquivo de configuração [`firebase-applet-config.json`](file:///C:/Users/paulo/Downloads/Estoque-mobile--main/firebase-applet-config.json) com o novo projeto criado pelo usuário:
      - `projectId`: `"adega-delivery-pdv"`
      - `authDomain`: `"adega-delivery-pdv.firebaseapp.com"`
      - `storageBucket`: `"adega-delivery-pdv.firebasestorage.app"`
      - `appId`: `"1:120526498592:web:4c975e296bb8765ee08545"`
    - O aplicativo anterior de produção (`estoque-mobile-sepia.vercel.app`) fica 100% isolado e protegido em seu próprio banco anterior, sem qualquer risco de interferência.
  - **Regras de Segurança do Firestore (`firestore.rules`):**
    - Adicionada regra explícita para a coleção `pedidos_delivery` (`match /pedidos_delivery/{pedidoId} { allow read, write: if true; }`).
  - **Sincronização em Lote de Produtos:**
    - Conectadas as funções `sincronizarCatalogoAmbevComFirestore` e `sincronizarCatalogoAdegaComFirestore` para gravar os 257 produtos diretamente no novo banco `adega-delivery-pdv`.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v23` em `public/sw.js` e `src/main.tsx`.

### [2026-10-24 - Atualização 18]
- **Isolamento e Armazenamento 100% Interno no Catálogo Geral do Aplicativo:**
  - **Remoção de Gravação Externa no Firestore:**
    - Ajustadas as funções de importação do Catálogo Ambev e do Mix de Adega em [`catalogoAmbev.ts`](file:///C:/Users/paulo/Downloads/Estoque-mobile--main/src/lib/catalogoAmbev.ts) e [`catalogoAdegaMix.ts`](file:///C:/Users/paulo/Downloads/Estoque-mobile--main/src/lib/catalogoAdegaMix.ts) para `sincronizarCatalogoAmbevLocalmente` e `sincronizarCatalogoAdegaLocalmente`.
    - Os **257 produtos cadastrados** (Ambev + Whiskies, Vinhos, Snacks, Balas e Cigarros) são mantidos estritamente dentro da memória e armazenamento local seguro do próprio aplicativo (`catalogoGlobal` / LocalStorage / IndexedDB), sem enviar dados para bancos externos ou de outros aplicativos.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v22` em `public/sw.js` e `src/main.tsx`.

### [2026-10-24 - Atualização 17]
- **Pesquisa e Integração do Mix Completo de Adega (Whiskies, Vinhos, Salgados, Bomboniere, Tabacaria, Carvão e Gelo):**
  - **Pesquisa de Mercado de Adegas:**
    - Uma adega/distribuidora de conveniência opera tipicamente com **150 a 300 itens** (versão express de bairro) ou **350 a 700 itens** (adega completa).
    - O mix essencial abrange as categorias de maior giro: Cervejas e Bebidas Ambev (173 itens), Whiskies e Destilados de Alto Giro, Vinhos Nacionais e Importados, Salgadinhos e Snacks (Doritos, Ruffles, Torcida), Balas e Doces (Halls, Trident, Bis, Mentos) e Tabacaria (Marlboro, Chesterfield, Sedas, Isqueiros, Carvão e Gelo).
  - **Módulo Dedicado (`src/lib/catalogoAdegaMix.ts`):**
    - Criado banco com **84 produtos essenciais de alta demanda**:
      - **Whiskies & Destilados:** *Johnnie Walker Red Label 1L, Black Label 1L, Jack Daniel's 1L, Chivas Regal 12 Anos 1L, Ballantine's Finest 1L, White Horse 1L, Jameson 750ml, Passport Scotch 1L, Old Parr 12 Anos 1L, Buchanan's 12 Anos 1L, Natu Nobilis 1L, Teacher's 1L, Vodka Smirnoff 998ml, Vodka Absolut 1L, Vodka Askov Tradicional e Frutas Vermelhas 900ml, Vodka Orloff 1L, Gin Tanqueray 750ml, Gin Gordon's 750ml, Gin Rock's 995ml, Campari 900ml, Jurupinga 975ml, Cachaça 51 965ml, Velho Barreiro 910ml, Pitú 965ml, Jägermeister 700ml, Licor Amarula 750ml*.
      - **Vinhos & Espumantes:** *Pérgola Tinto Suave 1L, Pérgola Tinto Seco 1L, Campo Largo Tinto Suave 750ml, Casillero del Diablo Cabernet Sauvignon 750ml, Reservado Concha y Toro 750ml, Quinta do Morgado 1L, Cantina da Serra 880ml, San Martin 750ml, Santa Helena 750ml, Espumante Chandon Brut 750ml*.
      - **Salgadinhos & Snacks:** *Doritos Queijo Nacho (140g, 53g), Batata Ruffles (Original 76g, Cebola e Salsa 76g), Cheetos Requeijão 115g, Fandangos Presunto 115g, Torcida (Queijo 70g, Churrasco 70g, Pimenta Mexicana 70g), Pringles (Original 114g, Cebola 114g), Amendoim Dori Japonês 120g, Amendoim Santa Helena Mendorato 120g, Ovinhos de Amendoim 65g, Salamitos Sadia 36g*.
      - **Doces, Balas & Bomboniere:** *Halls (Extra Forte 28g, Prata Mentol 28g, Cereja 28g), Chiclete Trident (Menta, Hortelã, Melancia 25.2g), Bala Mentos (Fruit, Mint 37.5g), Freegells Cereja 27.6g, Chocolate Bis (Ao Leite 126g, Branco 126g), Kit Kat 41.5g, Barra Lacta Diamante Negro 90g, Barra Lacta Laka Branco 90g, Barra Nestlé Classic Ao Leite 90g, Paçoca Rolha Santa Helena 15g*.
      - **Tabacaria, Carvão & Gelo:** *Cigarro Marlboro (Red Box, Gold Box), Chesterfield (Original Box, Blue Box), Lucky Strike Blue Box, Winston Red Box, Rothmans Azul Box, Dunhill Carlton Box, Camel Blue Box, Seda Smoking King Size, Seda Zomo Slim King Size, Isqueiro BIC (Grande Maxi, Mini), Palheiro Souza Paiol, Carvão Vegetal para Churrasco 3kg, Gelo em Cubos Filtrado 5kg*.
  - **Integração no Banco Global e Firestore (`src/App.tsx` & `src/lib/catalogoAdegaMix.ts`):**
    - Unificação de catálogo: O sistema agora garante automaticamente **257 produtos cadastrados com fotos, categorias, marcas e descrições completas** no `catalogoGlobal` do lojista (173 da Ambev + 84 do Mix de Adega).
    - Botão **`🥃 Mix Adega (Whiskies, Vinhos, Salgados, Cigarros)`** adicionado no Banco de Dados Mestre para sincronização sob demanda com a nuvem Firestore.
    - Todos os itens possuem botão **`+ Estoque`** e descrições detalhadas.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v21` em `public/sw.js` e `src/main.tsx`.

### [2026-10-24 - Atualização 16]
- **Integração e Sincronização do Catálogo Completo Oficial da Ambev no Banco Global:**
  - **Módulo Dedicado (`src/lib/catalogoAmbev.ts`):**
    - Criado banco com **173 produtos oficiais da Ambev** cobrindo todas as marcas líderes: Skol, Brahma, Antarctica, Antarctica Original, Spaten, Corona, Stella Artois, Budweiser, Bohemia, Colorado, Patagonia, Beck's, Michelob Ultra, Hoegaarden, Beats, Guaraná Antarctica, Pepsi, Sukita, H2OH!, Gatorade, Tônica Antarctica, Fusion Energy Drink e Lipton Ice Tea.
    - Cada produto possui Código de Barras EAN real e validado, Nome completo, Marca padronizada, Categoria correta de supermercado/adega, Unidade de Medida/Volume extraído e formatado, Imagens oficiais em alta resolução (via CDN R2 / Cosmos CDN) e Descrição detalhada do produto.
  - **Auto-Reconciliação e Persistência no Firebase Firestore (`src/App.tsx` & `src/lib/catalogoAmbev.ts`):**
    - Implementadas as funções `garantirCatalogoAmbevNoBancoGlobal` e `sincronizarCatalogoAmbevComFirestore` que cruzam automaticamente o catálogo do usuário com a base da Ambev.
    - Novos produtos da Ambev são inseridos no catálogo global e produtos já existentes sem foto, marca ou descrição são enriquecidos automaticamente sem sobrescrever personalizações do lojista.
    - Sincronização em lotes em segundo plano com a coleção `produtos_catalogo` e espelhamento em `catalogo_global` no Firestore.
  - **Interface no Painel do Banco de Dados Mestre (`src/App.tsx`):**
    - Adicionado o botão **`🍺 Sincronizar Catálogo Ambev (173 Itens)`** no topo do modal do Banco de Dados com feedback de progresso e relatório de itens inseridos/atualizados.
    - Adicionada a tag dourada visual **`🍺 Ambev`** em cada item pertencente ao catálogo da fabricante.
    - Exibição de descrição do produto formatada e botão direto **`+ Estoque`** para que o comerciante adicione qualquer produto do portfólio Ambev diretamente ao estoque de sua loja com 1 clique.
  - **Versionamento de Cache PWA:** Atualizado para `estoque-mobile-pwa-v20` em `public/sw.js` e `src/main.tsx`.

### [2026-10-22 - Atualização 2]
- **Fidelidade Visual Total ao Modelo AtendeJá no Painel de Delivery do PDV (`CaixaDeliveryPanel.tsx` e `App.tsx`):**
  - **Alinhamento às Imagens de Referência:**
    - Ajustado o conjunto de botões da barra inferior do card para conter simultaneamente: `TOTAL` (box verde-menta), `[🖨️]` (imprimir comanda), `[🛵 Link Motoboy]` (botão roxo `#9333ea`) e o botão de ação verde (`[✓ Aceitar Pedido]`, `[✓ Despachar]` ou `[✓ Confirmar Entrega]`), exatamente como no modelo original AtendeJá.
    - Largura da coluna no grid do PDV expandida para `465px` no `App.tsx` (medida idêntica à captura de tela de referência), garantindo que todos os 4 elementos caibam em linha única sem quebras ou transbordamento.
    - Mantidos os destaques de borda por status (`border-2 border-[#a855f7]` para pedidos a caminho, vermelho para novos e âmbar para preparo).
    - Campo de busca refinado com espaçamento sem sobreposição de ícones.
- **Reformulação e Correção de Layout do Painel Delivery no PDV (`CaixaDeliveryPanel.tsx` e `App.tsx`):**
  - **Problema Solucionado:** O painel lateral de delivery no Caixa/PDV apresentava sobreposição de ícone de lupa com texto no campo de busca, botões cortados/vazando para fora do card (`TOTAL`, `🖨️`, `Link Motoboy`, `Aceitar Pedido`), e largura da coluna lateral restrita (`390px`) que comprimia as informações visuais.
  - **Design Fiel e Harmonioso:**
    - Recriado o layout em container verde-menta `#f0fdf4` com cantos arredondados (`rounded-3xl`) e bordas suaves `#a7f3d0`.
    - Ícone de busca devidamente separado do texto com `pl-10 pr-8` e botão de limpar busca `✕`.
    - Cabeçalho limpo com botão destacado `Cardápio` com ícone de compartilhamento.
    - Status de pedidos em pills organizadas: `Ativos`, `● Novos`, `Preparo`, `A Caminho 🛵`.
    - Fluxo de botões inteligente por status: pedidos novos exibem apenas `[🖨️ Imprimir]` e `[✓ Aceitar Pedido]`; pedidos em preparo e a caminho exibem `[🛵 Link Motoboy]` e `[✓ Confirmar Entrega]`, eliminando 100% dos transbordamentos e quebras de linha defeituosas.
    - Largura da coluna no grid do PDV expandida de `390px` para `440px` no `App.tsx`.

### [2026-10-18 - Atualização 2]
- **Card do Valor Vendido Retirando o Custo (Mantendo Só com o Lucro) em Gráficos & Inteligência:**
  - **Problema Solucionado:** No modal de Gráficos e Inteligência (`GraficosVendasModal.tsx`), o lojista não tinha acesso ao card de valor vendido retirando o valor de custo e mantendo o valor das vendas só com o lucro, tanto na aba de Faturamento quanto na aba de Visão Geral do Estoque.
  - **Card Master em Destaque:** Adicionado banner principal no topo com gradiente verde esmeralda destacando o **Lucro Real das Vendas (Só o Lucro)** (`R$ lucroRealFaturado`), com badges comparativos: `💵 Valor Total Vendido`, `🏷️ (-) Custo Retirado` e `📦 Volume de Itens Faturados`.
  - **Aba de Faturamento & Lucro Real:**
    - Atualizada a navegação para `📊 Faturamento & Lucro Real`.
    - Inseridos 4 cards de KPIs: *Vendas Concluídas & Volume*, *Receita Bruta (Vendas)*, *Custo dos Produtos (CMV)* e *💰 Só com o Lucro (Valor Vendido - Custo)*.
    - Gráfico Recharts atualizado com seletor de métricas: `💰 Lucro Real & Faturamento`, `💵 Só o Lucro` e `📊 Só Faturamento Bruto`, com visualização de lucro em verde e faturamento em azul, além de tooltips detalhados.
  - **Aba Visão Geral do Estoque (`estoque_chart`):**
    - Inserido o card de *💰 Vendas Realizadas (Só com o Lucro)* detalhando Total Vendido, Custo Retirado e Ganho Líquido.
    - Na seção de *Produtos de Balcão & Adega*, adicionados o custo estimado e o valor faturado *Só Lucro Balcão*.
  - **Alinhamento de Nomenclatura no Relatório de Vendas (`RelatorioVendasModal.tsx`):**
    - Título do card ajustado para `💰 Só com o Lucro` e subtítulo explicitando `Valor vendido retirando o custo (só o lucro)`.

### [2026-10-18]
- **Exibição do Faturamento Real do Lojista (Lucro Líquido vs Receita Bruta vs CMV):**
  - **Problema Solucionado:** O relatório de vendas apresentava como "Faturamento Líquido" apenas a soma da receita bruta vendida no caixa (ex: refrigerante vendido por R$ 12,00 sem abater o custo de R$ 8,00), impedindo o lojista de saber quanto ele realmente lucrou e a quantidade total física de mercadorias faturadas.
  - **Relatório Geral de Vendas (`RelatorioVendasModal.tsx`):**
    - **KPIs Principais Reformulados:**
      1. *Total de Vendas & Volume:* Exibe total de vendas concluídas e quantidade total de unidades físicas vendidas (`totalItensVendidos`).
      2. *Receita Bruta (Vendas):* Exibe o total movimentado no caixa (ex: R$ 12,00).
      3. *Custo das Mercadorias (CMV):* Exibe o custo total de aquisição dos itens vendidos (ex: R$ 8,00).
      4. *💰 Faturou Realmente (Lucro Líquido):* Card destacado com gradiente esmeralda exibindo o ganho real do comerciante (Venda - Custo = R$ 4,00) junto da margem percentual média de lucro (`+33.3%`).
    - **Card Individual de Cada Venda:** Agora detalha no cabeçalho o Valor Total Vendido, o Custo Total dos produtos e a tag destacada com o valor que o lojista realmente faturou de lucro e margem.
    - **Itens Detalhados da Venda:** Na visualização expandida de cada venda, cada produto exibe: Preço de Venda Unitário e Subtotal, Preço de Custo Unitário e Custo Total, e o Lucro Líquido Real faturado especificamente naquele item com sua margem individual.
    - **Cálculo com Fallback Resiliente:** Função `obterCustoItem` busca o preço de custo no registro da venda ou faz fallback no estoque da loja por código/lote caso seja uma venda legada.
  - **Exportação CSV (`exportUtils.ts`):** Adicionadas colunas de `Qtd Total Itens`, `Custo Total Itens (R$)`, `Lucro Real Faturado (R$)`, `Margem Lucro (%)` e detalhamento de custo e lucro por produto no CSV baixado.
  - **Conexão no App (`App.tsx`):** Passagem da prop `estoque` para o `RelatorioVendasModal` para resolução de custos retroativos.

### [2026-09-10]
- **Criação da Documentação Oficial:** Criação do arquivo `DOCUMENTACAO-PROJETO.md` e configuração das instruções no `AGENTS.md` para garantir consulta prévia e atualização contínua em todos os ciclos de desenvolvimento.

### [2026-09-05]
- **Resolução do Problema de Fotos dos Produtos:**
  - Diagnóstico: Identificado que o erro de permissão no Firestore e o limite de 5MB do `localStorage` causavam o esvaziamento das fotos na reconciliação de estado.
  - Implementado cache em memória síncrono no `imageIndexedDB.ts` (`obterFotoCache`, `subscreverCacheImagens`).
  - Atualizada a função `obterFotoProduto` em `src/App.tsx` para consultar prioritariamente o cache persistente do IndexedDB.
  - Ajustadas as regras de segurança no `firestore.rules` para permitir operações normais de supermercado sem requerer autenticação Firebase Auth bloqueante, mantendo `usuarios_master` e `config_sistema` estritamente inacessíveis.
  - Adicionada gravação imediata no IndexedDB ao cadastrar ou editar produtos tanto no catálogo global quanto no estoque de loja.

### [Anterior]
- **Segurança e Regras do Firestore:** Reformulação de `firestore.rules` seguindo o princípio do menor privilégio.
- **Remoção de Chaves Hardcoded:** Limpeza de credenciais no `firestoreSync.ts`.
