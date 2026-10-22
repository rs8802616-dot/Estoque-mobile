# Especificação de Segurança e Regras do Firestore (Security Spec)

Projeto: Controle de Estoque Multi-Supermercado (React + Vite + Firebase)

---

## 1. Invariantes de Dados e Princípio do Menor Privilégio

1. **Invariante 0 (Deny-by-Default Universal):** Qualquer documento ou caminho não explicitamente mapeado é estritamente bloqueado contra leitura, escrita e exclusão.
2. **Invariante 1 (Isolamento de Credenciais Master):** As coleções `usuarios_master` e `config_sistema` contêm credenciais e configurações administrativas sensíveis. O SDK Web do cliente NUNCA deve ter permissão de leitura, escrita ou exclusão nessas coleções (`allow read, write: if false;`). O acesso é restrito exclusivamente ao Firebase Admin SDK / ambiente de servidor autenticado.
3. **Invariante 2 (Isolamento Multi-Tenant por Loja):** Cada supermercado tem seus dados (`estoque`, `vendas`, `operadores`, `clientes_devedores`, `sessoes_caixa`) estritamente isolados pelo campo `lojaId`. Um usuário autenticado vinculado ao supermercado "Loja A" nunca pode ler, listar, inserir, atualizar ou apagar documentos pertencentes à "Loja B".
4. **Invariante 3 (Imutabilidade de Logs de Auditoria):** A coleção `logs_auditoria` é append-only. Um registro de auditoria, uma vez criado por um usuário autenticado daquela loja, NUNCA pode ser modificado (`allow update: if false;`) nem excluído (`allow delete: if false;`) por qualquer cliente.
5. **Invariante 4 (Proteção Histórica Financeira):** Documentos da coleção `vendas` não podem ter seu `lojaId` modificado e não podem ser excluídos por operadores ou clientes comuns (`allow delete: if isMaster();`).
6. **Invariante 5 (Integridade do Catálogo Global de Produtos):** As coleções `produtos_catalogo` e `catalogo_global` permitem leitura pública (para consulta de códigos de barras e fotos pelos caixas e terminais), porém qualquer escrita exige autenticação e validação estrita de esquema (impedindo injeção de lixo, payloads excessivos ou exclusão do catálogo).
7. **Invariante 6 (Termos de Concordância Não-Violáveis):** Registros em `termos_concordancia` são criados no aceite do usuário e nunca podem ser alterados ou apagados por clientes (`allow update, delete: if false;`).
8. **Invariante 7 (Validação de Tipos e Limites de Tamanho - Anti-Denial-of-Wallet):** Todo texto aceito possui limite máximo de caracteres (prevenindo injeções de dezenas de megabytes no banco) e valores numéricos financeiros não podem ser negativos.

---

## 2. As 12 Ameaças Bloqueadas ("Dirty Dozen" Payloads)

| # | Vetor de Ataque | Ação Tentada | Resultado Esperado |
|---|---|---|---|
| 1 | **Vazamento de Credenciais Master** | `GET /usuarios_master/dono_master` sem login | **PERMISSION_DENIED** (bloqueio total no client SDK) |
| 2 | **Escrita em Credenciais Master** | `SET /usuarios_master/admin {senha: "hacked"}` | **PERMISSION_DENIED** |
| 3 | **Leitura Cross-Tenant de Estoque** | Usuário da Loja A tenta fazer `GET /estoque/item_loja_b` | **PERMISSION_DENIED** |
| 4 | **Invasão Cross-Tenant de Vendas** | Usuário da Loja A tenta fazer `CREATE /vendas/nova {lojaId: "loja_b"}` | **PERMISSION_DENIED** |
| 5 | **Espionagem de Clientes Devedores** | Usuário anônimo ou de outra loja tenta ler `clientes_devedores` | **PERMISSION_DENIED** |
| 6 | **Exclusão Maliciosa de Venda** | Operador tenta `DELETE /vendas/venda_123` para ocultar desvio | **PERMISSION_DENIED** |
| 7 | **Adulteração de Log de Auditoria** | Usuário tenta fazer `UPDATE /logs_auditoria/log_123` | **PERMISSION_DENIED** |
| 8 | **Exclusão de Log de Auditoria** | Usuário tenta fazer `DELETE /logs_auditoria/log_123` | **PERMISSION_DENIED** |
| 9 | **Corrupção do Catálogo Global** | Usuário anônimo tenta sobrescrever `produtos_catalogo/789123` | **PERMISSION_DENIED** |
| 10 | **Injeção de Preço Negativo** | Usuário tenta cadastrar item com `preco_venda: -50.00` | **PERMISSION_DENIED** |
| 11 | **Adulteração de Termo Aceito** | Usuário tenta `UPDATE /termos_concordancia/termo_1` para `aceitou: false` | **PERMISSION_DENIED** |
| 12 | **Acesso a Coleções Não Mapeadas** | Usuário tenta acessar `/colecao_secreta/qualquer` | **PERMISSION_DENIED** |

---
