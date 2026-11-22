# Política de Privacidade, Minimização e Retenção de Dados (LGPD)

## 1. Dados Coletados e Finalidade
- **Clientes Delivery:** Nome, telefone/WhatsApp e endereço de entrega são utilizados exclusivamente para separação, entrega e rastreio do pedido.
- **Clientes Fiado (Crediário):** Nome, telefone e histórico de compras/pagamentos são isolados por loja (`lojaId`) para controle de crédito do estabelecimento.
- **Operadores & Auditoria:** Identificador da loja, nome do operador e registros de auditoria operacional para rastreabilidade fiscal e de caixa.

## 2. Prazo de Retenção
- **Logs de auditoria local e tentativas de login:** mantidos por até **180 dias (6 meses)**, sendo podados automaticamente após esse período.
- **Cache de imagens offline (IndexedDB):** máximo de **500 itens** e expiração automática após **7 dias**.
- **Links de entregador (motoboy):** token aleatório com validade máxima de **12 horas**.

## 3. Direitos do Titular (Exclusão e Anonimização)
- Qualquer cliente pode solicitar a exclusão ou anonimização de seus dados cadastrais diretamente ao administrador da loja, que pode remover o registro no painel de Clientes/Devedores ou solicitar remoção definitiva no banco Firestore.
- Ao realizar **logout**, os tokens de sessão e identificadores do operador são removidos do `localStorage` e `sessionStorage` do dispositivo.
