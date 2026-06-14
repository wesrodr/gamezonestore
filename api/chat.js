const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

const CONTEXTO_LOJA = `
Voce e o GameBot, assistente virtual da GameZone Store, uma loja gamer online.
Responda de forma objetiva e direta.
Fale com personalidade gamer, em tom animado, amigavel e descontraido.
Use expressoes gamer leves como "bora", "mandou bem", "GG" ou "pronto para a partida",
somente quando combinarem naturalmente com a resposta.
Use no maximo 2 frases curtas e 45 palavras.
Informe somente o que o usuario perguntou, sem textos promocionais ou detalhes extras.
Use no maximo 1 emoji relacionado a games quando fizer sentido.
Nao use Markdown como **negrito**, listas com asterisco ou titulos.
Cumprimente apenas na primeira resposta da conversa ou quando o usuario mandar somente uma saudacao.
Nas demais mensagens, responda direto ao que foi perguntado.

Informacoes da loja:
- Nome: GameZone Store
- Tipo: Loja de produtos gamers online
- Contato: contato@gamezonestore.com | (86) 9 9999-9999
- Horario: Seg-Sex das 8h as 20h
- Frete gratis: acima de R$ 500,00

Produtos disponiveis:
- Teclado Mecanico RGB: R$ 249,90
- Mouse Gamer 12000 DPI: R$ 189,90
- Headset Gamer 7.1: R$ 299,90
- Cadeira Gamer Ergonomica: R$ 999,90
- Monitor Gamer 144Hz: R$ 1.299,90
- Controle Bluetooth: R$ 219,90
- Placa de Video Gamer: R$ 3.499,90
- Console de Ultima Geracao: R$ 3.899,90

Combos/Ofertas:
- Combo Teclado + Mouse: R$ 369,90 (economia de R$ 69,90)
- Kit Streamer Pro: R$ 579,90 (economia de R$ 129,80)
- Setup Iniciante: R$ 799,90 (economia de R$ 159,70)
- Setup Competitivo: R$ 1.699,90 (economia de R$ 339,70)

Como comprar: navegue pelos produtos, clique em "Comprar" ou preencha o formulario de contato.

Use o historico recente para entender referencias como "ele", "esse", "quero o anterior"
e outras continuacoes. Quando o usuario confirmar que quer um item citado anteriormente,
considere esse item como o produto de interesse e explique como concluir a compra.
`;

function lerBody(req) {
    if (typeof req.body === "string") {
        return JSON.parse(req.body || "{}");
    }

    return req.body || {};
}

function normalizarHistorico(historico) {
    if (!Array.isArray(historico)) {
        return [];
    }

    return historico
        .filter((item) => item && (item.role === "user" || item.role === "assistant"))
        .map((item) => ({
            role: item.role,
            content: String(item.content || "").trim().slice(0, 1000)
        }))
        .filter((item) => item.content)
        .slice(-12);
}

function montarConversa(historico, mensagem) {
    const conversa = [...historico];
    const ultimaMensagem = conversa[conversa.length - 1];

    if (!ultimaMensagem || ultimaMensagem.role !== "user" || ultimaMensagem.content !== mensagem) {
        conversa.push({ role: "user", content: mensagem });
    }

    return conversa
        .map((item) => `${item.role === "assistant" ? "Assistente" : "Usuario"}: ${item.content}`)
        .join("\n");
}

async function chamarGemini(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY nao configurada.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const resposta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 100
            },
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ]
        })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        const mensagem = dados.error && dados.error.message
            ? dados.error.message
            : "Erro retornado pela API Gemini.";

        throw new Error(`Gemini ${resposta.status}: ${mensagem}`);
    }

    const texto = dados.candidates
        && dados.candidates[0]
        && dados.candidates[0].content
        && dados.candidates[0].content.parts
        && dados.candidates[0].content.parts[0]
        && dados.candidates[0].content.parts[0].text;

    if (!texto) {
        throw new Error("Gemini respondeu em um formato inesperado.");
    }

    return texto;
}

async function chamarChatCompativelOpenAI({ nome, apiKey, url, model, prompt, headersExtras }) {
    if (!apiKey) {
        throw new Error(`${nome}: chave de API nao configurada.`);
    }

    const resposta = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            ...(headersExtras || {})
        },
        body: JSON.stringify({
            model,
            temperature: 0.3,
            max_tokens: 100,
            messages: [
                { role: "system", content: CONTEXTO_LOJA },
                { role: "user", content: prompt }
            ]
        })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        const mensagem = dados.error && dados.error.message
            ? dados.error.message
            : `Erro retornado pela API ${nome}.`;

        throw new Error(`${nome} ${resposta.status}: ${mensagem}`);
    }

    const texto = dados.choices
        && dados.choices[0]
        && dados.choices[0].message
        && dados.choices[0].message.content;

    if (!texto) {
        throw new Error(`${nome} respondeu em um formato inesperado.`);
    }

    return texto;
}

function criarProvedores(prompt) {
    return [
        {
            nome: "Gemini",
            chamar: () => chamarGemini(prompt)
        },
        {
            nome: "Groq",
            chamar: () => chamarChatCompativelOpenAI({
                nome: "Groq",
                apiKey: process.env.GROQ_API_KEY,
                url: "https://api.groq.com/openai/v1/chat/completions",
                model: GROQ_MODEL,
                prompt
            })
        },
        {
            nome: "OpenRouter",
            chamar: () => chamarChatCompativelOpenAI({
                nome: "OpenRouter",
                apiKey: process.env.OPENROUTER_API_KEY,
                url: "https://openrouter.ai/api/v1/chat/completions",
                model: OPENROUTER_MODEL,
                prompt,
                headersExtras: {
                    "HTTP-Referer": process.env.SITE_URL || "https://gamezonestore.vercel.app",
                    "X-Title": "GameZone Store"
                }
            })
        }
    ];
}

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: { message: "Metodo nao permitido." } });
    }

    let body;
    try {
        body = lerBody(req);
    } catch (erro) {
        return res.status(400).json({ error: { message: "JSON invalido no corpo da requisicao." } });
    }

    const mensagem = String(body.mensagem || "").trim();
    const primeiraMensagem = Boolean(body.primeiraMensagem);
    const historico = normalizarHistorico(body.historico);

    if (!mensagem) {
        return res.status(400).json({ error: { message: "Mensagem vazia." } });
    }

    const prompt = CONTEXTO_LOJA
        + "\n\nEstado da conversa: "
        + (primeiraMensagem ? "primeira mensagem do usuario." : "conversa em andamento. Nao comece com ola, oi, salve ou boas-vindas.")
        + "\n\nHistorico recente:\n"
        + montarConversa(historico, mensagem)
        + "\n\nResponda a ultima mensagem do usuario considerando todo o historico acima.";

    const erros = [];

    for (const provedor of criarProvedores(prompt)) {
        try {
            const texto = await provedor.chamar();
            return res.status(200).json({
                resposta: texto,
                provedor: provedor.nome
            });
        } catch (erro) {
            erros.push(`${provedor.nome}: ${erro.message}`);
            console.error(`Falha no provedor ${provedor.nome}:`, erro.message);
        }
    }

    return res.status(502).json({
        error: {
            message: "Nao foi possivel gerar uma resposta agora. Tente novamente em alguns instantes.",
            details: erros
        }
    });
};
