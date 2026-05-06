# 2. Planejamento do Projeto

## 2.1 Sprints do Projeto

O projeto será realizado em **4 Sprints**, com entregas contínuas de código e documentação.

---

### 📅 Visão Geral

### 🟢 Sprint 1 – Setup, Hello World e Visão do Produto

- README com descrição do projeto
- ODS escolhida
- Backlog macro
- Repositório criado
- Banco de dados instanciado (vazio)
- Tela "Hello World" conectada à API

---

### 🟡 Sprint 2 – MVP (Primeira Fatia Vertical)

- Requisitos Funcionais documentados
- Script do Banco de Dados
- 1ª funcionalidade completa funcionando
- Dados sendo salvos no banco

---

### 🔵 Sprint 3 – Core e Regras de Negócio

- Implementação das regras de negócio
- Validações no backend
- DER atualizado via Engenharia Reversa
- Diagrama de Classes atualizado

---

### 🔴 Sprint 4 – Finalização e Deploy

- Correção de bugs
- Testes finais ponta a ponta
- Documentação final consolidada
- Relatório preenchido no APC
- Sistema pronto para Arguição

---

## 👥 Papéis de Gestão

- 👨‍💻 **Tech Lead (Git Master)**  
Responsável pelo repositório e merges.
- 🗄️ **Arquiteto de Dados (DBA Guard)**  
Responsável pela modelagem e padronização do banco.
- 🧪 **Gerente de Qualidade (QA & Code Reviewer)**  
Responsável por revisar código e validar testes.
- 📋 **Facilitador Ágil (PO / Scrum Master)**  
Responsável por prazos, Kanban e priorização do backlog.

---

### Definição dos Papéis – Sprint 1

- 👨‍💻 Tech Lead: Pedro Dias
- 🗄️ Arquiteto de Dados: Lucas Dias
- 🧪 Gerente de Qualidade: Arthur Coelho
- 📋 Facilitador Ágil: Melissa Baia

---

## 2.2 Execução e Controle

### 🗂️ Kanban (Projects)

## 📋 Acompanhamento das Sprints

### Legenda de Status

- ✔️ Concluído
- 📝 Em andamento
- ⌛ Atrasado
- ❌ Não iniciado

---

# 🟢 Sprint 1 – Setup


| Responsável   | Papel                | Tarefa                                              | Início | Prazo | Status |
| ------------- | -------------------- | --------------------------------------------------- | ------ | ----- | ------ |
| Melissa Baia  | Facilitador Ágil     | Preencher Visão do Produto, ODS e Backlog no README | 12/03  | 15/03 | ✔️      |
| Lucas Dias    | Arquiteto de Dados   | Criar instância do Banco de Dados                   | 12/03  | 16/03 | ✔️      |
| Pedro Dias    | Tech Lead            | Criar repositório e estruturar pastas               | 12/03  | 18/03 | ✔️      |
| Arthur Coelho | Gerente de Qualidade | Criar tela Hello World conectada à API              | 15/03  | 20/03 | ✔️      |


---

# 🟡 Sprint 2 – MVP


| Responsável   | Papel                | Tarefa                                                                            | Início | Prazo | Status |
| ------------- | -------------------- | --------------------------------------------------------------------------------- | ------ | ----- | ------ |
| Lucas Dias    | Arquiteto de Dados   | Gerar Script do Banco de Dados (entidades: usuário, registro de humor, desabafos) | 21/03  | 24/03 | ✔️      |
| Pedro Dias    | Tech Lead            | Desenvolver Fatia 1: registro de humor + desabafo (BD + API + Tela)               | 22/03  | 30/03 | ✔️      |
| Melissa Baia  | Facilitador Ágil     | Documentar Requisitos do MVP                                                      | 25/03  | 02/04 | ✔️      |
| Arthur Coelho | Gerente de Qualidade | Revisão técnica e Merge                                                           | 02/04  | 05/04 | ✔️      |


---

# 🔵 Sprint 3 – Core


| Responsável   | Papel                | Tarefa                                                                                         | Início | Prazo | Status |
| ------------- | -------------------- | ---------------------------------------------------------------------------------------------- | ------ | ----- | ------ |
| Arthur Coelho | Gerente de Qualidade | Inspecionar as funcionalidades e corrigir bugs                        | 06/04  | 15/04 | ✔️      |
| Pedro Dias    | Tech Lead            | Correção da lógica de ordenação do gráfico de insights | 06/04  | 15/04 | ✔️      |
| Lucas Dias    | Arquiteto de Dados   | Atualizar diagramas via Engenharia Reversa                                                           | 16/04  | 20/04 | ✔️      |
| Melissa Baia  | Facilitador Ágil     | Preencher documentação (Requisitos, histórias, etc)                                                                   | 16/04  | 23/04 | ✔️      |
| Arthur Coelho | Desenvolvedor | Implementar feature da Sessão de Respiração                         | 06/04  | 15/04 | ✔️      |
| Pedro Dias    | Desenvolvedor | Implementar chat IA com o usuário - desenvolver a tela | 06/04  | 15/04 | ✔️      |
| Lucas Dias    | Desenvolvedor | Registro de Emoções e Diário (Backend e Frontend)                                                           | 16/04  | 20/04 | ✔️      |
| Melissa Baia  | Desenvolvedor | Funcionalidade de Insights Emocionais (Dashboard) + Exibição na linha do tempo                                                          | 16/04  | 23/04 | ✔️      |


---

# 🔴 Sprint 4 – Finalização


| Responsável   | Papel                | Tarefa                            | Início | Prazo | Status |
| ------------- | -------------------- | --------------------------------- | ------ | ----- | ------ |
| Arthur Coelho | Gerente de Qualidade | Correção de bugs                  | 22/05  | 05/06 | ❌      |
| Pedro Dias    | Tech Lead            | Finalizar relatórios e dashboards | 01/06  | 15/06 | ❌      |
| Melissa Baia  | Facilitador Ágil     | Preencher Relatório APC           | 10/06  | 20/06 | ❌      |
| Lucas Dias    | Arquiteto de Dados   | Testes finais e consolidar README | 15/06  | 25/06 | ❌      |


---

