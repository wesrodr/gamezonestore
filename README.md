# GameZone Store

> Trabalho final da disciplina de Desenvolvimento Web para IA.

A **GameZone Store** é uma loja gamer fictícia com catálogo de produtos, ofertas, formulário de contato e um assistente virtual integrado a serviços de inteligência artificial.

## Funcionalidades

- Navegação por âncoras entre as seções da página
- Menu responsivo para dispositivos móveis
- Catálogo com oito produtos e imagens locais
- Área de ofertas com quatro combos
- Simulação de adição de produtos
- Formulário de contato com validação do navegador
- Chat flutuante com indicador de digitação
- Integração serverless com Gemini, Groq e OpenRouter
- Layout responsivo para desktop, tablet e celular
- Animações, efeitos de hover e cabeçalho reativo ao scroll

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| HTML5 | Estrutura e conteúdo da página |
| CSS3 | Layout, animações e responsividade |
| JavaScript | Interações, formulário e chatbot |
| Vercel Functions | Endpoint seguro do chatbot |
| Gemini API | Primeiro provedor de IA |
| Groq API | Segundo provedor de IA |
| OpenRouter API | Terceiro provedor de IA |
| Google Fonts | Fontes Orbitron e Rajdhani |

## Estrutura do projeto

```text
gamezonestore/
├── api/
│   └── chat.js          # Função serverless e integração com os provedores de IA
├── assets/
│   ├── cadeira.png
│   ├── console.png
│   ├── controle.png
│   ├── fone.png
│   ├── monitor.png
│   ├── mouse.png
│   ├── placa.png
│   └── teclado.png      # Imagens dos produtos
├── .gitignore           # Arquivos ignorados pelo Git
├── index.html           # Estrutura da loja
├── logo.png             # Logo utilizada no cabeçalho e no rodapé
├── script.js            # Interações da interface e comunicação com /api/chat
├── style.css            # Estilos, animações e media queries
└── README.md            # Documentação do projeto
```

## Como executar

### Apenas a interface

Abra o arquivo `index.html` no navegador ou utilize a extensão Live Server do VS Code.

Nesse modo, a página, o menu, os produtos e o formulário funcionam normalmente. O chatbot com IA depende do endpoint `/api/chat` e, portanto, precisa ser executado em um ambiente compatível com Vercel Functions.

### Projeto completo com o chatbot

1. Instale a [Vercel CLI](https://vercel.com/docs/cli).
2. Crie um arquivo `.env.local` na raiz do projeto.
3. Configure pelo menos uma chave de API.
4. Execute:

```bash
vercel dev
```

5. Acesse o endereço local exibido no terminal, normalmente `http://localhost:3000`.

Os arquivos `.env` e `.env.local` estão no `.gitignore` e não devem ser enviados ao repositório.

## Configuração da IA

O front-end envia as mensagens para `POST /api/chat`. A função tenta os provedores nesta ordem:

1. Gemini
2. Groq
3. OpenRouter

Se um provedor não estiver configurado ou retornar erro, a função tenta o próximo. É necessário configurar ao menos uma destas variáveis:

```env
GEMINI_API_KEY=sua_chave_gemini
GROQ_API_KEY=sua_chave_groq
OPENROUTER_API_KEY=sua_chave_openrouter
```

Os modelos possuem valores padrão, mas podem ser alterados:

```env
GEMINI_MODEL=gemini-2.5-flash
GROQ_MODEL=llama-3.3-70b-versatile
OPENROUTER_MODEL=openai/gpt-4o-mini
SITE_URL=https://gamezonestore.vercel.app
```

As chaves ficam somente no ambiente da função serverless. Não coloque credenciais em `script.js`, `index.html` ou qualquer outro arquivo público.

## Implantação na Vercel

1. Importe o repositório na Vercel.
2. Se necessário, selecione `gamezonestore` como diretório raiz do projeto.
3. Cadastre as variáveis de ambiente em **Settings > Environment Variables**.
4. Faça o deploy.

A Vercel publica os arquivos estáticos e disponibiliza automaticamente `api/chat.js` como o endpoint `/api/chat`.

## Integrantes

| Nome | 
| WESLEY RUAN RODRIGUES DE PAULA |   
| LUAN VITOR COSTA SILVA LOPES   |   

## Observação

Este projeto simula uma loja virtual para fins acadêmicos. Os botões de compra e o formulário exibem confirmações na interface, mas não processam pagamentos nem enviam dados para um banco de dados.

© 2026 GameZone Store. Todos os direitos reservados.
