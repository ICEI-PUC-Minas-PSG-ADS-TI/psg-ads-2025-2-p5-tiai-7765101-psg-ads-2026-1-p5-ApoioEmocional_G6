
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

📌 Cada requisito deve:
- Representar uma funcionalidade única
- Ser claro e objetivo
- Orientar diretamente o desenvolvimento

---

## Tabela de Requisitos Funcionais

| ID    | Descrição do Requisito | Prioridade |
|-------|------------------------|------------|
| RF-01 | O sistema deve permitir que os usuários criem uma conta informando nome, e-mail, senha e endereço. | 🔴 ALTA |
| RF-02 | O sistema deve permitir que os usuários adicionem produtos ao carrinho de compras. | 🟡 MÉDIA |
| RF-03 | (Descreva aqui o requisito funcional 3 do seu sistema) | (Alta/Média/Baixa) |
| RF-04 | (Descreva aqui o requisito funcional 4 do seu sistema) | (Alta/Média/Baixa) |
| RF-05 | (Descreva aqui o requisito funcional 5 do seu sistema) | (Alta/Média/Baixa) |
| RF-06 | (Descreva aqui o requisito funcional 6 do seu sistema) | (Alta/Média/Baixa) |
| RF-07 | (Descreva aqui o requisito funcional 7 do seu sistema) | (Alta/Média/Baixa) |
| RF-08 | (Descreva aqui o requisito funcional 8 do seu sistema) | (Alta/Média/Baixa) |
| RF-09 | (Descreva aqui o requisito funcional 9 do seu sistema) | (Alta/Média/Baixa) |
| RF-10 | (Descreva aqui o requisito funcional 10 do seu sistema) | (Alta/Média/Baixa) |

---

# 3.2 Histórias de Usuário

Cada história deve seguir o padrão ensinado na disciplina:

> **Como** [persona],  
> **eu quero** [funcionalidade],  
> **para que** [benefício].

⚠️ **ATENÇÃO:**  
Cada História de Usuário deve estar associada a um Requisito Funcional específico (RF-XX).

---

## Exemplos

**História 1 (relacionada ao RF-01):**  
Como usuário, quero registrar minhas tarefas para não esquecer de fazê-las.

**História 2 (relacionada ao RF-02):**  
Como administrador, quero alterar permissões para controlar o acesso ao sistema.

---

## Histórias do Projeto

---

### História 1 (relacionada ao RF-01)

Como __________________________________________  
Eu quero _______________________________________  
Para que _______________________________________

---

### História 2 (relacionada ao RF-02)

Como __________________________________________  
Eu quero _______________________________________  
Para que _______________________________________

---

### História 3 (relacionada ao RF-__)

Como __________________________________________  
Eu quero _______________________________________  
Para que _______________________________________

---

> 💡 Dica: Agrupe as histórias por módulo (Cadastro, Relatórios, Pagamentos, etc.) para melhor organização.

---

# 3.3 Requisitos Não Funcionais

Os **Requisitos Não Funcionais (RNF)** definem características de qualidade do sistema, como:

- ⚡ Desempenho  
- 🔒 Segurança  
- 🎨 Usabilidade  
- 📈 Escalabilidade  
- 🌐 Compatibilidade  

Eles garantem a qualidade da solução.

---

## Tabela de Requisitos Não Funcionais

| ID     | Descrição do Requisito | Prioridade |
|--------|------------------------|------------|
| RNF-01 | O sistema deve carregar as páginas em até 3 segundos. | 🟡 MÉDIA |
| RNF-02 | O sistema deve proteger as informações dos clientes por meio de criptografia. | 🔴 ALTA |
| RNF-03 | (Descreva aqui o requisito não funcional 3 do seu sistema) | (Alta/Média/Baixa) |
| RNF-04 | (Descreva aqui o requisito não funcional 4 do seu sistema) | (Alta/Média/Baixa) |
| RNF-05 | (Descreva aqui o requisito não funcional 5 do seu sistema) | (Alta/Média/Baixa) |
| RNF-06 | (Descreva aqui o requisito não funcional 6 do seu sistema) | (Alta/Média/Baixa) |

---

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
| R-01 | O projeto deverá ser entregue até o final do semestre. |
| R-02 | O sistema deve funcionar apenas dentro da rede interna da empresa. |
| R-03 | O software deve ser compatível com Windows e Linux. |
| R-04 | (Descreva aqui a restrição 4 do seu projeto) |
| R-05 | (Descreva aqui a restrição 5 do seu projeto) |
| R-06 | (Descreva aqui a restrição 6 do seu projeto) |
| R-07 | (Descreva aqui a restrição 7 do seu projeto) |
| R-08 | (Descreva aqui a restrição 8 do seu projeto) |

---
## 3.5 Regras de Negócio

> Regras de Negócio definem as condições e políticas que o sistema deve seguir para garantir o correto funcionamento alinhado ao negócio.  
>  
> Elas indicam **quando** e **como** certas ações devem ocorrer, usando o padrão:  
>  
> **Se (condição) for verdadeira, então (ação) deve ser tomada.**  
>  
> Exemplo:  
> - "Um usuário só poderá finalizar um cadastro se todos os dados forem inseridos e validados com sucesso."  
>  
> Também pode ser escrito assim (if/then):  
> - "Se o usuário tem saldo acima de X, então a opção de empréstimo estará liberada."

---

 A tabela abaixo deve ser preenchida com as regras de negócio que **impactam seu projeto**. Os textos no quadro são apenas ilustrativos.

|ID    | Regra de Negócio                                                       |
|-------|-----------------------------------------------------------------------|
|RN-01 | Usuário só pode cadastrar até 10 tarefas por dia.                      |
|RN-02 | Apenas administradores podem alterar permissões de usuários.           |
|RN-03 | Tarefas vencidas devem ser destacadas em vermelho no sistema.          |
|RN-04 | *(Descreva aqui a restrição 4 do seu projeto)*                         |
|RN-05 | *(Descreva aqui a restrição 5 do seu projeto)*                         |

💡 **Dica:** Explique sempre o motivo ou impacto da regra no sistema.

---
> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)
