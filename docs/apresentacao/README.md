# EmotAI — Apresentação do Projeto

## 1. Resumo rápido (para slide 1)

- **Nome do Projeto:** EmotAI
- **Propósito:** Plataforma web de apoio emocional para registro de humor, acompanhamento de padrões emocionais e suporte via chat com IA.
- **Público-alvo:** Jovens e adultos em busca de autocuidado emocional
- **ODS relacionado:** ODS 3 — Saúde e Bem-estar

## 2. Estrutura recomendada dos slides (sugestão 10-12 slides)

1. Título: nome do projeto, integrantes e logo
2. Problema: contexto e motivação (use trechos de `docs/1-Contexto.md`)
3. Objetivos e escopo (resumir `docs/1-Contexto.md#1.2`)
4. Arquitetura e tecnologias (use imagem `docs/images/diagrama-emotai.png`)
5. Principais funcionalidades (Home, Onboarding, Chat, Timeline, Profile)
6. Demonstração rápida (link para demo local + prints em `docs/images`)
7. Resultados alcançados e métricas (resuma `docs/6-Conclusão.md`)
8. Limitações e próximos passos (extraído de `docs/6-Conclusão.md`)
9. Lições aprendidas e papéis da equipe
10. Referências e agradecimentos (use `docs/7-Referências.md`)
11. Contato para dúvidas

## 3. Roteiro curto para apresentação (2-3 minutos por slide)

- Slide de abertura (30s): Apresente o problema e o time.
- Problema & Objetivos (60s): Explique por que a solução é importante.
- Solução & Demo (120s): Mostre telas e workflow principal (login → registrar humor → ver insights → chat).
- Resultados e próximo passos (60s): Impacto, limitações e roadmap.
- Perguntas (restante do tempo).

## 4. Demo (como preparar)

1. Suba o backend (veja `src/backend/backend/appsettings.Development.json` para configurar conexão):

```powershell
cd src/backend/backend
dotnet restore
dotnet build
dotnet run
```

2. Suba o frontend:

```bash
cd src/frontend
npm install
npm run dev
```

3. Acesse no navegador: `http://localhost:8080` (frontend) e verifique `http://localhost:5000/swagger` para APIs (porta do backend pode variar).

Observações:
- Ajuste `DefaultConnection` em `appsettings.Development.json` para apontar ao seu SQL Server.
- O backend aplica migrations automaticamente (`db.Database.Migrate()`), então certifique-se de que a base exista e o usuário tenha privilégios.

## 5. Arquivos que adicionar à pasta de apresentação

- `slides/EmotAI_apresentacao.pdf` — arquivo PDF ou PPTX dos slides
- `video/presentation.mp4` — gravação da apresentação (se houver)
- `images/` — capturas de tela (use os placeholders já mencionados em `docs/5-Interface-Sistema.md`)

Coloque esses arquivos dentro de `docs/apresentacao/` ou subpastas `slides/`, `video/`, `images/`.

## 6. Dicas de design e conteúdo

- Use poucos bullets por slide e uma imagem de apoio por slide.
- Não escreva tudo no slide — fale os pontos-chave.
- Use a regra 10-20-30 (10 slides, 20 minutos, fonte 30) como referência para nivelar o conteúdo.

Links úteis:
- https://rockcontent.com/blog/design-para-slides/
- https://www.ted.com/playlists/574/how_to_make_a_great_presentation

## 7. Materiais de apoio e anexos

- Arquitetura: `docs/images/diagrama-emotai.png`
- Documentação técnica: `docs/4-Projeto-Solucao.md`
- Especificações e requisitos: `docs/3-Especificação.md`
- Conclusão e aprendizados: `docs/6-Conclusão.md`
- Referências completas: `docs/7-Referências.md`

## 8. Equipe e contatos

- Melissa Baia — Facilitadora Ágil / PO — melissa@example.com
- Pedro Dias — Tech Lead — pedro@example.com
- Lucas Dias — Arquiteto de Dados — lucas@example.com
- Arthur Coelho — QA / Desenvolvedor — arthur@example.com

_(Substitua os e-mails por contatos reais antes da apresentação.)_

## 9. Observações finais

Este README serve como guia para consolidar a apresentação do projeto. Depois de preparar os slides e gravar o vídeo (se necessário), adicione os arquivos aqui e verifique se todos os links dentro dos slides apontam para imagens/rotas corretas no repositório.

Boa apresentação! 🚀
