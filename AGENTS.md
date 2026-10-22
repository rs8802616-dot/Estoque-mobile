# Regras Permanentes de Desenvolvimento (AGENTS.md)

Este arquivo é injetado automaticamente nas instruções de todo agente de IA que atua neste repositório.

## 📌 Regra Obrigatória de Leitura Prévia
Antes de executar qualquer nova alteração, refatoração ou implementação solicitada pelo usuário:
1. Você **DEVE OBRIGATORIAMENTE LER** o arquivo `/DOCUMENTACAO-PROJETO.md`.
2. Essa leitura garante que você sempre parta do **estado real do projeto**, respeitando a arquitetura estabelecida, os limites de armazenamento (IndexedDB vs LocalStorage 5MB), as regras de segurança do Firestore e os componentes existentes.

## 📝 Regra Obrigatória de Atualização Contínua
Após concluir as alterações solicitadas pelo usuário:
1. Você **DEVE OBRIGATORIAMENTE ATUALIZAR** o arquivo `/DOCUMENTACAO-PROJETO.md`.
2. Registre na seção **Histórico de Alterações (Changelog)** o resumo das modificações realizadas (data, escopo e arquivos afetados).
3. Caso tenham sido adicionados novos componentes, arquivos em `/src/lib/` ou regras de negócio, atualize a seção correspondente na documentação antes de finalizar a resposta.
