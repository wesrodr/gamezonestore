const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const CONTEXTO_LOJA = `
Voce e o GameBot, assistente virtual da GameZone Store, uma loja gamer online.
Responda sempre de forma amigavel, direta e use emojis relacionados a games.
Limite suas respostas a 3 paragrafos no maximo.
Nao use Markdown como **negrito**, listas com asterisco ou titulos.
Escreva frases curtas e separe ideias com quebras de linha.
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
`;

function lerBody(req) {
    if (typeof req.body === "string") {
        return JSON.parse(req.body || "{}");
    }

    return req.body || {};
}

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: { message: "Metodo nao permitido." } });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: { message: "GEMINI_API_KEY nao foi configurada nas variaveis de ambiente da Vercel." }
        });
    }

    let body;
    try {
        body = lerBody(req);
    } catch (erro) {
        return res.status(400).json({ error: { message: "JSON invalido no corpo da requisicao." } });
    }

    const mensagem = String(body.mensagem || "").trim();
    const primeiraMensagem = Boolean(body.primeiraMensagem);

    if (!mensagem) {
        return res.status(400).json({ error: { message: "Mensagem vazia." } });
    }

    const prompt = CONTEXTO_LOJA
        + "\n\nEstado da conversa: "
        + (primeiraMensagem ? "primeira mensagem do usuario." : "conversa em andamento. Nao comece com ola, oi, salve ou boas-vindas.")
        + "\n\nMensagem do usuario: " + mensagem;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    try {
        const respostaGemini = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            })
        });

        const dados = await respostaGemini.json();

        if (!respostaGemini.ok) {
            return res.status(respostaGemini.status).json({
                error: {
                    message: dados.error && dados.error.message
                        ? dados.error.message
                        : "Erro retornado pela API Gemini."
                }
            });
        }

        const texto = dados.candidates
            && dados.candidates[0]
            && dados.candidates[0].content
            && dados.candidates[0].content.parts
            && dados.candidates[0].content.parts[0]
            && dados.candidates[0].content.parts[0].text;

        if (!texto) {
            return res.status(502).json({
                error: { message: "A API Gemini respondeu em um formato inesperado." }
            });
        }

        return res.status(200).json({ resposta: texto });
    } catch (erro) {
        console.error("Erro ao chamar Gemini:", erro);
        return res.status(500).json({
            error: { message: "Falha ao conectar com a API Gemini." }
        });
    }
};
