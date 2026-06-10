// ============================================================
//   GAMEZONE STORE — script.js
//   Loja Gamer | Trabalho Final — Desenvolvimento Web para IA
// ============================================================

// ===================== MENU MOBILE =====================

let menuToggle = document.getElementById("menu-toggle");
let navPrincipal = document.querySelector(".nav-principal");

// Abre e fecha o menu hambúrguer no mobile
menuToggle.addEventListener("click", function () {
    navPrincipal.classList.toggle("aberto");
});

// Fecha o menu ao clicar em qualquer link de navegação
let linksNav = document.querySelectorAll(".nav-principal a");
linksNav.forEach(function (link) {
    link.addEventListener("click", function () {
        navPrincipal.classList.remove("aberto");
    });
});

// ===================== CABEÇALHO COM SCROLL =====================

// Adiciona sombra no cabeçalho quando o usuário rolar a página
window.addEventListener("scroll", function () {
    let cabecalho = document.querySelector(".cabecalho");
    if (window.scrollY > 50) {
        cabecalho.classList.add("scrolled");
    } else {
        cabecalho.classList.remove("scrolled");
    }
});

// ===================== BOTÃO COMPRAR (PRODUTOS) =====================

// Adiciona evento de clique nos botões de compra dos cards
let botoesComprar = document.querySelectorAll(".btn-comprar");
botoesComprar.forEach(function (btn) {
    btn.addEventListener("click", function () {
        let card = btn.closest(".produto-card");
        let nomeProduto = card.querySelector("h3").innerText;
        let preco = card.querySelector(".preco-atual").innerText;
        alert("✅ " + nomeProduto + " adicionado!\nPreço: " + preco + "\n\nFinalizar a compra pelo nosso chatbot ou formulário de contato.");
    });
});

// ===================== FORMULÁRIO DE CONTATO =====================

// Função chamada ao enviar o formulário de contato
function enviarFormulario(evento) {
    evento.preventDefault(); // Impede o envio real da página

    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;

    alert("✅ Mensagem enviada com sucesso!\n\nObrigado, " + nome + "!\nEntraremos em contato no e-mail: " + email);

    // Limpa o formulário após envio
    evento.target.reset();
}

// ===================== CHATBOT =====================
// O chatbot usa inteligência artificial via API Gemini ou respostas locais.
// Pode funcionar de duas formas:
//   1. Com API Key do Gemini (IA real)
//   2. Sem API Key (respostas automáticas programadas em JavaScript)

// ---- CONFIGURAÇÃO DA API DO GEMINI ----
// Para ativar a IA real, insira sua chave de API aqui:
// Obtenha gratuitamente em: https://aistudio.google.com/app/apikey

const GEMINI_API_KEY = "AIzaSyBzoAWvK5DLGnJPY9F_woxQDTvbRAJD5P0"; // <-- INSIRA SUA API KEY AQUI

// Modelo Gemini utilizado
const GEMINI_MODEL = "gemini-flash-latest";

// Contexto da loja enviado ao Gemini para personalizar as respostas
const CONTEXTO_LOJA = `
Você é o GameBot, assistente virtual da GameZone Store, uma loja gamer online.
Responda sempre de forma amigável, direta e use emojis relacionados a games.
Limite suas respostas a 3 parágrafos no máximo.
Não use Markdown como **negrito**, listas com asterisco ou títulos.
Escreva frases curtas e separe ideias com quebras de linha.
Cumprimente apenas na primeira resposta da conversa ou quando o usuário mandar somente uma saudação.
Nas demais mensagens, responda direto ao que foi perguntado.

Informações da loja:
- Nome: GameZone Store
- Tipo: Loja de produtos gamers online
- Contato: contato@gamezonestore.com | (86) 9 9999-9999
- Horário: Seg–Sex das 8h às 20h
- Frete grátis: acima de R$ 500,00

Produtos disponíveis:
- Teclado Mecânico RGB: R$ 249,90
- Mouse Gamer 12000 DPI: R$ 189,90
- Headset Gamer 7.1: R$ 299,90
- Cadeira Gamer Ergonômica: R$ 999,90
- Monitor Gamer 144Hz: R$ 1.299,90
- Controle Bluetooth: R$ 219,90
- Placa de Vídeo Gamer: R$ 3.499,90
- Console de Última Geração: R$ 3.899,90

Combos/Ofertas:
- Combo Teclado + Mouse: R$ 369,90 (economia de R$ 69,90)
- Kit Streamer Pro: R$ 579,90 (economia de R$ 129,80)
- Setup Iniciante: R$ 799,90 (economia de R$ 159,70)
- Setup Competitivo: R$ 1.699,90 (economia de R$ 339,70)

Como comprar: navegue pelos produtos, clique em "Comprar" ou preencha o formulário de contato.
`;

// ---- ELEMENTOS DO CHATBOT ----
let chatToggle  = document.getElementById("chat-toggle");
let chatWidget  = document.getElementById("chat-widget");
let chatFechar  = document.getElementById("chat-fechar");
let chatEnviar  = document.getElementById("chat-enviar");
let chatInput   = document.getElementById("chat-input");
let chatBox     = document.getElementById("chat-box");
let totalMensagensUsuario = 0;

let iconeAberto  = document.querySelector(".chat-icone-aberto");
let iconeFechado = document.querySelector(".chat-icone-fechado");

// ---- ABRIR E FECHAR O CHAT ----

chatToggle.addEventListener("click", function () {
    chatWidget.classList.toggle("hidden");

    // Alterna os ícones do botão
    if (!chatWidget.classList.contains("hidden")) {
        iconeAberto.classList.remove("hidden");
        iconeFechado.classList.add("hidden");
        chatInput.focus();
    } else {
        iconeAberto.classList.add("hidden");
        iconeFechado.classList.remove("hidden");
    }
});

chatFechar.addEventListener("click", function () {
    chatWidget.classList.add("hidden");
    iconeAberto.classList.add("hidden");
    iconeFechado.classList.remove("hidden");
});

// ---- ENVIAR MENSAGEM ----

chatEnviar.addEventListener("click", enviarMensagem);

chatInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        enviarMensagem();
    }
});

// Função principal de envio de mensagem
function enviarMensagem() {
    let texto = chatInput.value.trim();

    if (texto === "") return;

    let primeiraMensagem = totalMensagensUsuario === 0;
    totalMensagensUsuario++;

    // Exibe a mensagem do usuário no chat
    adicionarMensagem(texto, "usuario");
    chatInput.value = "";

    // Exibe o indicador de "digitando..."
    let digitando = adicionarDigitando();

    // Decide se usa IA (Gemini API) ou respostas locais
    if (GEMINI_API_KEY !== "") {
        // Usa a API Gemini com IA real
        chamarGemini(texto, digitando, primeiraMensagem);
    } else {
        // Usa as respostas automáticas programadas
        setTimeout(function () {
            digitando.remove();
            let resposta = responderLocal(texto);
            adicionarMensagem(resposta, "bot");
        }, 800);
    }
}

// ---- FUNÇÃO: ADICIONAR MENSAGEM AO CHAT ----
// Cria um elemento de mensagem e adiciona ao chat-box
function adicionarMensagem(texto, tipo) {
    let div = document.createElement("div");
    div.classList.add("mensagem", tipo);

    let avatar = tipo === "bot" ? "🤖" : "👤";

    div.innerHTML = `
        <span class="msg-avatar">${avatar}</span>
        <div class="msg-balao"></div>
    `;

    let balao = div.querySelector(".msg-balao");
    if (tipo === "bot") {
        try {
            balao.innerHTML = formatarTextoBot(texto);
        } catch (erro) {
            console.error("Erro ao formatar mensagem do bot:", erro);
            balao.textContent = texto;
        }
    } else {
        balao.textContent = texto;
    }

    chatBox.appendChild(div);

    // Rola para o final automaticamente
    chatBox.scrollTop = chatBox.scrollHeight;

    return div;
}

function escaparHTML(texto) {
    let div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

function formatarTextoBot(texto) {
    let textoSeguro = escaparHTML(String(texto));

    return textoSeguro
        .replace(
            /(https?:\/\/[^\s<>"']+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        )
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/&lt;strong&gt;/g, "<strong>")
        .replace(/&lt;\/strong&gt;/g, "</strong>")
        .replace(/&lt;br\s*\/?&gt;/gi, "<br>")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/\n\n/g, "<br><br>")
        .replace(/\n/g, "<br>");
}

// ---- FUNÇÃO: INDICADOR DE DIGITANDO ----
function adicionarDigitando() {
    let div = document.createElement("div");
    div.classList.add("mensagem", "bot", "digitando");
    div.innerHTML = `<span class="msg-avatar">🤖</span><div class="msg-balao"></div>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    return div;
}

// ---- FUNÇÃO: CHAMADA À API GEMINI ----
// Esta função envia a mensagem do usuário para a IA do Google e retorna a resposta.
// Para funcionar, é necessário ter uma API Key válida inserida em GEMINI_API_KEY.

async function chamarGemini(mensagemUsuario, elementoDigitando, primeiraMensagem) {

    // URL da API do Gemini
    let url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    // Corpo da requisição enviado ao Gemini
    let corpo = {
        contents: [
            {
                parts: [
                    {
                        // Envia o contexto da loja + a mensagem do usuário
                        text: CONTEXTO_LOJA
                            + "\n\nEstado da conversa: "
                            + (primeiraMensagem ? "primeira mensagem do usuário." : "conversa em andamento. Não comece com olá, oi, salve ou boas-vindas.")
                            + "\n\nMensagem do usuário: " + mensagemUsuario
                    }
                ]
            }
        ]
    };

    try {
        // Faz a requisição POST para a API do Gemini
        let resposta = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpo)
        });

        let dados = await resposta.json();

        // Remove o indicador de digitando
        elementoDigitando.remove();

        if (!resposta.ok) {
            console.error("Erro retornado pela API Gemini:", dados);
            adicionarMensagem("Tive um problema ao consultar a IA agora. Confira a chave da API e tente novamente.", "bot");
            return;
        }

        // Extrai o texto da resposta da IA
        if (dados.candidates && dados.candidates[0] && dados.candidates[0].content && dados.candidates[0].content.parts && dados.candidates[0].content.parts[0]) {
            let textoResposta = dados.candidates[0].content.parts[0].text;
            adicionarMensagem(textoResposta, "bot");
        } else {
            console.error("Resposta inesperada da API Gemini:", dados);
            adicionarMensagem("Desculpe, tive um problema ao processar sua mensagem. Tente novamente! 😅", "bot");
        }

    } catch (erro) {
        // Em caso de erro na requisição
        elementoDigitando.remove();
        console.error("Erro ao chamar a API Gemini:", erro);
        adicionarMensagem("Ops! Não consegui me conectar ao servidor. Tente novamente mais tarde. 🔌", "bot");
    }
}

// ---- FUNÇÃO: RESPOSTAS LOCAIS (SEM API) ----
// Quando não há API Key configurada, o chatbot responde com base em palavras-chave.
// Este sistema simula um chatbot básico de loja gamer.

function responderLocal(texto) {

    // Normaliza o texto: minúsculas, sem acentos, sem pontuação
    let t = texto.toLowerCase()
                 .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                 .replace(/[.,!?]/g, "");

    let palavras = t.split(" ");

    // ---- Respostas por palavras-chave ----

    // Saudações
    if (palavras.length <= 3 && contem(palavras, ["oi", "ola", "hello", "hey", "bom", "boa"])) {
        return "Olá! 👋 Seja bem-vindo(a) à <strong>GameZone Store</strong>! Como posso te ajudar hoje? Quer conhecer nossos produtos, ver ofertas ou tirar alguma dúvida? 🎮";
    }

    // O que é a loja
    if (contem(palavras, ["gamezone", "loja", "quem", "voces", "sobre"])) {
        return "🏪 A <strong>GameZone Store</strong> é uma loja gamer online especializada em equipamentos de alta performance para jogadores casuais, streamers e gamers competitivos. Trabalhamos com os melhores produtos do mercado com preços justos e suporte rápido!";
    }

    // Produtos em geral
    if (contem(palavras, ["produto", "produtos", "vendem", "vende", "catalogo", "tem"])) {
        return "🛒 Nosso catálogo inclui:<br>⌨️ Teclados Mecânicos<br>🖱️ Mouses Gamers<br>🎧 Headsets<br>🪑 Cadeiras Gamers<br>🖥️ Monitores 144Hz<br>🎮 Controles<br>💻 Placas de Vídeo<br>🕹️ Consoles<br><br>Role a página para ver todos os detalhes e preços!";
    }

    // Teclado
    if (contem(palavras, ["teclado", "mecanico", "rgb", "switch"])) {
        return "⌨️ Temos o <strong>Teclado Mecânico RGB</strong> por apenas <strong>R$ 249,90</strong>! Switches mecânicos, iluminação RGB 16M cores e alta durabilidade. É uma das peças mais populares para gamers competitivos. Quer saber mais ou comprar?";
    }

    // Mouse
    if (contem(palavras, ["mouse", "dpi", "raton"])) {
        return "🖱️ Nosso <strong>Mouse Gamer 12.000 DPI</strong> está por <strong>R$ 189,90</strong>! Sensor óptico preciso, 7 botões programáveis e design ergonômico anti-suor. Ótimo para quem quer precisão nos jogos!";
    }

    // Headset / fone
    if (contem(palavras, ["headset", "fone", "audio", "microfone", "mic", "surround"])) {
        return "🎧 O <strong>Headset Gamer 7.1</strong> está por <strong>R$ 299,90</strong>! Som surround virtual 7.1, microfone com cancelamento de ruído e almofadas de memória. Perfeito para comunicação em equipe e imersão nos jogos!";
    }

    // Cadeira
    if (contem(palavras, ["cadeira", "assento", "ergonomica"])) {
        return "🪑 A <strong>Cadeira Gamer Ergonômica</strong> está por <strong>R$ 999,90</strong> (de R$ 1.299,90)! Estrutura em aço, encosto reclinável até 180°, apoio lombar e almofada cervical. Ideal para longas sessões de jogo sem desconforto!";
    }

    // Monitor
    if (contem(palavras, ["monitor", "tela", "hz", "144hz", "freesync"])) {
        return "🖥️ O <strong>Monitor Gamer 144Hz</strong> está por <strong>R$ 1.299,90</strong>! Full HD 24\", 1ms de resposta e AMD FreeSync. Imagens ultra-suaves que fazem toda a diferença nos jogos rápidos!";
    }

    // Controle
    if (contem(palavras, ["controle", "joystick", "gamepad", "bluetooth"])) {
        return "🎮 O <strong>Controle Bluetooth</strong> está por <strong>R$ 219,90</strong>! Compatível com PC e console, vibração dupla e bateria de longa duração. Ótimo para jogos mais tranquilos e plataformers!";
    }

    // Placa de vídeo / GPU
    if (contem(palavras, ["placa", "video", "gpu", "grafica", "rtx", "ray"])) {
        return "💻 Nossa <strong>Placa de Vídeo Gamer</strong> está por <strong>R$ 3.499,90</strong>! 8GB GDDR6, suporte a Ray Tracing e DLSS 3.0. Perfeita para jogos em 4K Ultra com frames altíssimos!";
    }

    // Console
    if (contem(palavras, ["console", "videogame", "playstation", "xbox", "nintendo"])) {
        return "🕹️ O <strong>Console de Última Geração</strong> está por <strong>R$ 3.899,90</strong>! 4K a 120fps, SSD ultrarrápido e retrocompatível. A experiência definitiva de gaming em TV!";
    }

    // Ofertas / promoções / combo
    if (contem(palavras, ["oferta", "ofertas", "promocao", "desconto", "combo", "kit", "barato"])) {
        return "🔥 Temos ofertas incríveis:<br>🖱️⌨️ <strong>Combo Teclado + Mouse</strong>: R$ 369,90<br>🎙️ <strong>Kit Streamer Pro</strong>: R$ 579,90<br>🎮 <strong>Setup Iniciante</strong>: R$ 799,90<br>🏆 <strong>Setup Competitivo</strong>: R$ 1.699,90<br><br>Vá à seção Ofertas para mais detalhes!";
    }

    // Setup iniciante
    if (contem(palavras, ["iniciante", "primeiro", "comecar", "basico", "começar"])) {
        return "🎮 Para quem está começando, recomendo o <strong>Setup Iniciante</strong> por R$ 799,90! Inclui Mouse Gamer, Teclado Mecânico, Headset 7.1 e Controle Bluetooth — tudo que você precisa para uma boa experiência gamer!";
    }

    // Setup competitivo / profissional
    if (contem(palavras, ["competitivo", "profissional", "pro", "torneio", "esport"])) {
        return "🏆 Para jogadores competitivos, o <strong>Setup Competitivo</strong> por R$ 1.699,90 é a escolha ideal! Monitor 144Hz + Teclado + Mouse + Headset + Cadeira Gamer. Tudo otimizado para performance máxima!";
    }

    // Frete / entrega
    if (contem(palavras, ["frete", "entrega", "envio", "prazo"])) {
        return "🚚 Oferecemos <strong>FRETE GRÁTIS</strong> em compras acima de <strong>R$ 500,00</strong> para todo o Brasil! Abaixo disso, o frete é calculado por região na finalização. O prazo médio de entrega é de 5 a 10 dias úteis.";
    }

    // Compra / pagamento / como comprar
    if (contem(palavras, ["como", "comprar", "pagar", "pagamento", "parcelar", "parcela", "cartao", "pix"])) {
        return "💳 Para comprar na GameZone Store, basta clicar em <strong>\"Comprar\"</strong> no produto desejado ou preencher o <strong>formulário de contato</strong>. Aceitamos Pix, boleto e cartão de crédito em até 12x. Nossa equipe entrará em contato para finalizar o pedido!";
    }

    // Contato / email / telefone
    if (contem(palavras, ["contato", "email", "telefone", "whatsapp", "falar"])) {
        return "📞 Você pode nos contatar por:<br>📧 <strong>contato@gamezonestore.com</strong><br>📱 <strong>(86) 9 9999-9999</strong><br>🕐 Atendimento: Seg–Sex, das 8h às 20h<br><br>Ou preencha o formulário na seção Contato da nossa página!";
    }

    // Preço / preços
    if (contem(palavras, ["preco", "precos", "valor", "quanto", "custa"])) {
        return "💰 Nossos preços:<br>⌨️ Teclado: R$ 249,90<br>🖱️ Mouse: R$ 189,90<br>🎧 Headset: R$ 299,90<br>🪑 Cadeira: R$ 999,90<br>🖥️ Monitor: R$ 1.299,90<br>🎮 Controle: R$ 219,90<br>💻 Placa de Vídeo: R$ 3.499,90<br>🕹️ Console: R$ 3.899,90";
    }

    // Recomendação genérica
    if (contem(palavras, ["recomendar", "recomenda", "sugere", "sugira", "melhor", "indicar"])) {
        return "🌟 Minha recomendação depende do seu perfil:<br>🆕 <strong>Iniciante</strong>: Setup Iniciante por R$ 799,90<br>📺 <strong>Streamer</strong>: Kit Streamer Pro por R$ 579,90<br>🏆 <strong>Competitivo</strong>: Setup Competitivo por R$ 1.699,90<br><br>Qual é o seu perfil? Posso ajudar mais!";
    }

    // Agradecimento
    if (contem(palavras, ["obrigado", "obrigada", "valeu", "thanks", "grato"])) {
        return "😊 Fico feliz em ajudar! Se precisar de mais alguma coisa, pode perguntar. Bons jogos e boa sorte no setup! 🎮⚡";
    }

    // Resposta padrão (nenhuma palavra-chave reconhecida)
    return "🤔 Não entendi bem sua pergunta. Você pode me perguntar sobre:<br>• Produtos e preços<br>• Ofertas e combos<br>• Como comprar<br>• Frete e entrega<br>• Contato e suporte<br><br>Como posso te ajudar?";
}

// ---- FUNÇÃO AUXILIAR: VERIFICAR PALAVRAS ----
// Verifica se alguma das palavras-chave está presente no texto do usuário
function contem(palavras, chaves) {
    return chaves.some(function (chave) {
        return palavras.some(function (palavra) {
            return palavra.includes(chave);
        });
    });
}
