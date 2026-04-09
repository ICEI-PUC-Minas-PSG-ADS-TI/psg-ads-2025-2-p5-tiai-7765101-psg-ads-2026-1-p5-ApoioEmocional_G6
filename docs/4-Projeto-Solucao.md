
# 4. Projeto da Solução

## 4.1 Arquitetura da Solução (Sprint 1 e 2)

**Front-end → API (Back-end) → Banco de Dados**

![Exemplo de Arquitetura](images/diagrama-emotai.png)

---

## 4.2 Tecnologias Utilizadas (Sprint 1)

| Dimensão | Tecnologia Escolhida |
|----------|----------------------|
| Banco de Dados (SGBD) | SQL Server |
| Back-end (API) | C# (.NET Core) |
| Front-end / Mobile | React + TypeScript |
| Hospedagem / Deploy |  |
| Gestão e Versionamento | GitHub e GitHub Projects (Kanban) |

---

##  4.3 Wireframes ou Mockups (A partir da Sprint 2)

## 📌 Tela de Cadastro (RF-01)

**História associada:** Como usuário, quero me cadastrar na plataforma para que eu possa receber apoio emocional
**Descrição:** A interface contempla todos os campos exigidos pelo RF-01 e permite persistência no banco após validação no backend.

[Colocar wireframe aqui]

## 4.4 Modelagem de Dados (Sprint 2 e 3)

### 4.4.1 Script Físico (Entrega na Sprint 2 - MVP)

```sql
USE [master]
GO

/****** Object:  Database [EmotIA]    Script Date: 08/04/2026 22:38:10 ******/
CREATE DATABASE [EmotIA]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'EmotIA', FILENAME = N'D:\Arquivos de Programas\MSSQL15.SQLEXPRESS\MSSQL\DATA\EmotIA.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'EmotIA_log', FILENAME = N'D:\Arquivos de Programas\MSSQL15.SQLEXPRESS\MSSQL\DATA\EmotIA_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO

IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [EmotIA].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO

ALTER DATABASE [EmotIA] SET ANSI_NULL_DEFAULT OFF 
GO

ALTER DATABASE [EmotIA] SET ANSI_NULLS OFF 
GO

ALTER DATABASE [EmotIA] SET ANSI_PADDING OFF 
GO

ALTER DATABASE [EmotIA] SET ANSI_WARNINGS OFF 
GO

ALTER DATABASE [EmotIA] SET ARITHABORT OFF 
GO

ALTER DATABASE [EmotIA] SET AUTO_CLOSE OFF 
GO

ALTER DATABASE [EmotIA] SET AUTO_SHRINK OFF 
GO

ALTER DATABASE [EmotIA] SET AUTO_UPDATE_STATISTICS ON 
GO

ALTER DATABASE [EmotIA] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO

ALTER DATABASE [EmotIA] SET CURSOR_DEFAULT  GLOBAL 
GO

ALTER DATABASE [EmotIA] SET CONCAT_NULL_YIELDS_NULL OFF 
GO

ALTER DATABASE [EmotIA] SET NUMERIC_ROUNDABORT OFF 
GO

ALTER DATABASE [EmotIA] SET QUOTED_IDENTIFIER OFF 
GO

ALTER DATABASE [EmotIA] SET RECURSIVE_TRIGGERS OFF 
GO

ALTER DATABASE [EmotIA] SET  DISABLE_BROKER 
GO

ALTER DATABASE [EmotIA] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO

ALTER DATABASE [EmotIA] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO

ALTER DATABASE [EmotIA] SET TRUSTWORTHY OFF 
GO

ALTER DATABASE [EmotIA] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO

ALTER DATABASE [EmotIA] SET PARAMETERIZATION SIMPLE 
GO

ALTER DATABASE [EmotIA] SET READ_COMMITTED_SNAPSHOT OFF 
GO

ALTER DATABASE [EmotIA] SET HONOR_BROKER_PRIORITY OFF 
GO

ALTER DATABASE [EmotIA] SET RECOVERY SIMPLE 
GO

ALTER DATABASE [EmotIA] SET  MULTI_USER 
GO

ALTER DATABASE [EmotIA] SET PAGE_VERIFY CHECKSUM  
GO

ALTER DATABASE [EmotIA] SET DB_CHAINING OFF 
GO

ALTER DATABASE [EmotIA] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO

ALTER DATABASE [EmotIA] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO

ALTER DATABASE [EmotIA] SET DELAYED_DURABILITY = DISABLED 
GO

ALTER DATABASE [EmotIA] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO

ALTER DATABASE [EmotIA] SET QUERY_STORE = OFF
GO

ALTER DATABASE [EmotIA] SET  READ_WRITE 
GO
```

### 📁 Arquivo .sql

O arquivo .sql ou .js está salvo na pasta: src/bd

### 4.4.2 Representação do Modelo Físico de Dados (Entrega na Sprint 3 - Core)

> **Fundamentação:** Os modelos de dados físicos fornecem detalhes minuciosos que auxiliam administradores e desenvolvedores na implementação da lógica de negócios em um banco de dados real.
> Eles incluem elementos não especificados no modelo lógico, como:
> - Tipos de dados específicos da plataforma
> - Restrições
> - Índices
> - Triggers (quando aplicável)
> - Procedimentos armazenados (quando aplicável)
>
>Por representarem um banco real, devem respeitar:
> - Convenções de nomenclatura
> - Restrições da plataforma
> - Uso adequado de palavras reservadas <br>


**Exemplo:**

<img src="https://d2908q01vomqb2.cloudfront.net/b6692ea5df920cad691c20319a6fffd7a4a766b8/2021/11/09/BDB-1321-image005.png" width="85%">

**FONTE:** <https://aws.amazon.com/pt/compare/the-difference-between-logical-and-physical-data-model/>

<br>O grupo deverá gerar um diagrama físico do banco de dados (estrutura real das tabelas), evidenciando PKs, FKs e relacionamentos, conforme implementado no código.

Este modelo deve exibir:
- Tabelas ou coleções existentes
- Atributos com seus respectivos tipos de dados
- Chaves Primárias (PK)
- Chaves Estrangeiras (FK)
- Relacionamentos entre tabelas
- Restrições implementadas (quando aplicável)

---

### 📌 Requisitos Obrigatórios

- O diagrama deve representar fielmente o banco já implementado.
- Deve refletir exatamente o que foi criado nas Sprints 2 e 3.
- Não incluir tabelas que não existam no código.
- Deve contemplar o controle de acesso de usuários, quando implementado.
- Deve respeitar as convenções e restrições da plataforma utilizada.

---

### 📎 Representação do Modelo Físico de Dados
🚨 O grupo deverá inserir aqui a imagem do diagrama físico de dados.

---
🔧**Ferramentas Sugeridas**
- MySQL Workbench (engenharia reversa automática)
- DbDesigner
- Lucidchart
