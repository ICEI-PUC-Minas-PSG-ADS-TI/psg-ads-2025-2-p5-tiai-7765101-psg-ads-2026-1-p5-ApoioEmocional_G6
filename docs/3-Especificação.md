
# 3. Especificações do Projeto

📌 **Pré-requisito:** Planejamento do Projeto (Cronograma e Sprints definidos).

Nesta seção serão detalhados:

- ✅ Requisitos Funcionais  
- ✅ Histórias de Usuário  
- ✅ Requisitos Não Funcionais  
- ✅ Restrições do Projeto  

O objetivo é organizar claramente as funcionalidades, qualidades e limites da solução.

---

# 3.1 Requisitos Funcionais

Os **Requisitos Funcionais (RF)** descrevem o que o sistema deve fazer.

## Tabela de Requisitos Funcionais

| ID    | Descrição do Requisito | Prioridade |
|-------|------------------------|------------|
| RF-01 | O sistema deve permitir que os usuários criem uma conta informando nome, e-mail, senha e informações sobre sua rotina (trabalho, estudo, atividade física, relacionamentos). | 🔴 ALTA |
| RF-02 | O sistema deve permitir o registro diário de emoções (mood) e uma reflexão em texto (diário/diary). | 🔴 ALTA |
| RF-03 | O sistema deve gerar um dashboard visual com a tendência de humor semanal do usuário através de gráficos de área e barras. | 🔴 ALTA |
| RF-04 | O sistema deve listar o histórico de registros em uma linha do tempo (Timeline), permitindo a expansão de textos longos. | 🟡 MÉDIA |
| RF-05 | O sistema deve filtrar o histórico de emoções por categoria (Positivos, Negativos) e períodos de tempo (Mês, Semana). | 🟡 MÉDIA |
| RF-06 | O sistema deve oferecer um Chat de Apoio Emocional para interação com o usuário. | 🔴 ALTA |
| RF-07 | O sistema deve oferecer uma sessão de respiração para o usuário. | 🟡 MÉDIA |
| RF-08 | O sistema deve oferecer ao usuário o encaminhamento para órgãos competentes em saúde mental e emocional. | 🟡 MÉDIA |

---

# 3.2 Histórias de Usuário

## Histórias do Projeto

### História 1 (Relacionada ao RF-01)
**Como** usuário,  
**eu quero** me cadastrar na plataforma informando meus dados e rotina,  
**para que** eu possa receber um apoio personalizado de acordo com o meu perfil.

### História 2 (Relacionada ao RF-02)
**Como** usuário,  
**eu quero** registrar como me sinto e escrever sobre o meu dia,  
**para que** eu possa manter um histórico das minhas reflexões e sentimentos.

### História 3 (Relacionada ao RF-03)
**Como** usuário,  
**eu quero** visualizar gráficos com a minha tendência de humor,  
**para que** eu consiga identificar padrões emocionais ao longo da minha semana.

### História 4 (Relacionada ao RF-04 e RF-05)
**Como** usuário,  
**eu quero** ver meus registros antigos em uma linha do tempo e filtrá-los,  
**para que** eu possa reler momentos específicos e entender minha evolução emocional.

### História 5 (Relacionada ao RF-06)
**Como** usuário,  
**eu quero** interagir com um chat de apoio,  
**para que** eu tenha um espaço imediato para conversar e desabafar em momentos de necessidade.

### História 6 (Relacionada ao RF-07)
**Como** usuário,  
**eu quero** realizar sessões guiadas de respiração,  
**para que** eu consiga reduzir o estresse e a ansiedade de forma prática dentro da plataforma.

### História 7 (Relacionada ao RF-08)
**Como** usuário em situação de crise,  
**eu quero** encontrar contatos de órgãos competentes de saúde mental,  
**para que** eu saiba onde buscar ajuda profissional externa de forma rápida e segura.

---

# 3.3 Requisitos Não Funcionais

Os **Requisitos Não Funcionais (RNF)** definem características de qualidade do sistema, como:

- ⚡ Desempenho  
- 🔒 Segurança  
- 🎨 Usabilidade  
- 📈 Escalabilidade  
- 🌐 Compatibilidade  

Eles garantem a qualidade da solução.

## Tabela de Requisitos Não Funcionais

| ID     | Descrição do Requisito | Prioridade |
|--------|------------------------|------------|
| RNF-01 | O sistema deve carregar as páginas em até 3 segundos. | 🟡 MÉDIA |
| RNF-02 | O sistema deve proteger as informações dos clientes por meio de criptografia. | 🔴 ALTA |
| RNF-03 | A interface deve ser responsiva, permitindo o uso em dispositivos móveis e desktops sem perda de funcionalidade. | 🔴 ALTA |
| RNF-04 | O sistema deve suportar o Modo Escuro (Dark Mode) para conforto visual do usuário em diferentes ambientes. | 🟢 BAIXA |

# 3.4 Restrições do Projeto
📌 **Restrições** são limitações externas impostas ao projeto.

Elas podem envolver:
- 📅 Prazo
- 🖥️ Tecnologia obrigatória ou proibida
- 🌐 Ambiente de execução
- 📜 Normas legais
- 🏢 Políticas institucionais

⚠️ Diferente dos RNFs, as restrições impõem **limites fixos** ao projeto.

---

## Tabela de Restrições

| ID  | Restrição |
|-----|-----------|
| R-01 | O projeto deverá ser entregue até o final do semestre 2026-1. |
| R-02 | O Frontend deve ser desenvolvido obrigatoriamente utilizando React com TypeScript. |
| R-03 | O Backend deve ser implementado em C# .NET Core com arquitetura Web API. |
| R-04 | O banco de dados deve ser obrigatoriamente o Microsoft SQL Server. |
| R-05 | O sistema deve ser acessível via navegadores web modernos (Chrome, Firefox, Edge). |

---

## 3.5 Regras de Negócio

A tabela abaixo deve ser preenchida com as regras de negócio que **impactam seu projeto**. Os textos no quadro são apenas ilustrativos.

|ID    | Regra de Negócio                                                       |
|-------|-----------------------------------------------------------------------|
|RN-01 | Um usuário só pode acessar seus próprios registros de emoções e histórico |
|RN-02 | O sistema deve impedir o cadastro de humor sem a seleção de um nível/categoria de emoção.  |
|RN-03 | Para acessar as funcionalidades de Timeline e Dashboard, o usuário deve estar obrigatoriamente autenticado. |
|RN-04 | O sistema deve destacar visualmente registros com intensidade emocional alta para facilitar a identificação de picos de estresse ou alegria. |
|RN-05 | Se o usuário tentar acessar uma rota protegida sem estar logado, então ele deve ser redirecionado para a tela de Login. |

💡 **Dica:** Explique sempre o motivo ou impacto da regra no sistema.

---
> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)
