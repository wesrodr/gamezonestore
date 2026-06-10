# 🎮 GameZone Store

> Trabalho Final — Disciplina: Desenvolvimento Web para IA

---

## 📌 Nome do Projeto

**GameZone Store** — Loja Gamer Online com Chatbot Inteligente

---

## 🎯 Objetivo do Site

Criar uma plataforma de apresentação e venda de produtos gamers com visual moderno, tecnológico e atrativo, simulando uma loja virtual completa. O site serve como entrega do trabalho final da disciplina de Desenvolvimento Web para IA.

---

## 🕹️ Tema Escolhido

**Loja Gamer** — A GameZone Store é uma loja fictícia especializada em equipamentos e acessórios para jogadores casuais, streamers e gamers competitivos.

---

## ❗ Problema que o Site Resolve

Muitos jogadores têm dificuldade em escolher os equipamentos certos para seu perfil e orçamento. A GameZone Store resolve isso com:

- Um catálogo organizado por categoria e preço
- Combos e kits pré-montados (Setup Iniciante, Kit Streamer, Setup Competitivo)
- Um chatbot com IA capaz de recomendar produtos com base nas necessidades do usuário

---

## 🛠️ Tecnologias Usadas

| Tecnologia       | Uso                              |
|------------------|----------------------------------|
| HTML5            | Estrutura e semântica do site    |
| CSS3             | Estilização e responsividade     |
| JavaScript       | Interatividade e chatbot         |
| Google Fonts     | Tipografia (Orbitron + Rajdhani) |
| Gemini API       | Inteligência artificial (chatbot)|

---

## 🗂️ Estrutura de Arquivos

```
gamezone-store/
├── index.html      ← Estrutura HTML do site
├── style.css       ← Estilos e responsividade
├── script.js       ← Interatividade e chatbot
└── README.md       ← Documentação do projeto
```

---

## ▶️ Como Executar o Projeto

1. Baixe ou clone os arquivos do projeto
2. Abra o arquivo `index.html` no seu navegador
3. O site funciona sem necessidade de servidor ou instalação

> **Dica:** Use o Live Server do VS Code para melhor experiência de desenvolvimento.

---

## 🤖 Como Configurar o Chatbot com IA (Gemini)

### Modo 1 — Sem API (já funciona por padrão)

O chatbot já funciona com respostas automáticas baseadas em palavras-chave, sem precisar de nenhuma configuração.

### Modo 2 — Com IA real (Gemini API)

Para ativar o chatbot com inteligência artificial do Google:

1. Acesse: https://aistudio.google.com/app/apikey
2. Crie uma conta Google (se não tiver) e gere uma API Key gratuita
3. Abra o arquivo `script.js`
4. Localize a linha:
   ```javascript
   const GEMINI_API_KEY = ""; // <-- INSIRA SUA API KEY AQUI
   ```
5. Substitua `""` pela sua chave:
   ```javascript
   const GEMINI_API_KEY = "AIzaSy...suachaveaqui";
   ```
6. Salve o arquivo e recarregue o site

O chatbot passará a usar o modelo **Gemini 1.5 Flash** com o contexto completo da loja.

---

## ✅ Funcionalidades do Site

| Funcionalidade            | Descrição                                               |
|---------------------------|----------------------------------------------------------|
| Menu de Navegação         | 5 itens com âncoras para cada seção                     |
| Seção Hero                | Área de entrada com título, subtítulo e botões de ação  |
| Seção Sobre               | Apresentação da loja com cards informativos             |
| Seção Produtos            | 8 produtos em grid (display:grid)                        |
| Seção Ofertas             | 4 combos em flex (display:flex) com banner de frete     |
| Seção Contato             | Formulário completo + informações e redes sociais       |
| Rodapé                    | Links rápidos, categorias e redes sociais               |
| Chatbot com IA            | Widget flutuante com Gemini API + fallback local        |
| Responsividade            | Mobile, tablet e desktop via media queries              |
| Menu Mobile               | Hambúrguer funcional para telas pequenas                |
| Efeito Scroll             | Cabeçalho com fundo ao rolar a página                   |
| Hover nos Cards           | Animações suaves nos produtos e ofertas                 |

---

## 👥 Integrantes do Grupo

| Nome | Matrícula |
|------|-----------|
| *(Preencha aqui)* | *(Preencha aqui)* |
| *(Preencha aqui)* | *(Preencha aqui)* |
| *(Preencha aqui)* | *(Preencha aqui)* |

---

## 📋 Requisitos Atendidos

- [x] HTML semântico
- [x] CSS organizado com variáveis
- [x] Menu de navegação com ≥ 4 itens
- [x] Âncoras funcionais para cada seção
- [x] Cards com `display:grid` (Produtos)
- [x] Cards com `display:flex` (Ofertas)
- [x] Paleta de cores compatível com tema gamer
- [x] Responsividade com media queries
- [x] JavaScript separado em `script.js`
- [x] Chatbot funcional com IA (Gemini API)
- [x] Código comentado e organizado
- [x] Sem erros no console do navegador

---

© 2026 GameZone Store. Todos os direitos reservados.
