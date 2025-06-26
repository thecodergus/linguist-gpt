/**
 * Implementação da interface Translator utilizando a API da OpenAI (GPT)
 * para traduzir qualquer idioma para português do Brasil.
 */
class ChatGPTTranslator {
    static TARGET_LANGUAGE = 'pt-br';

    constructor() {
        this.apiKey = ''; // A chave deve ser definida pelo consumidor da classe
        this.model = 'gpt-4o';
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
        this.fetchClient = fetch;
        this.lengthLimit = 32000;
        this.requestsTimeout = 1000;
    }

    // MÉTODOS PRIVADOS (Lógica interna)

    _createPrompt(text) {
    return `Você é um sistema de tradução automatizada. Sua única função é traduzir o conteúdo que está dentro da tag <texto> para um bom português brasileiro idiomático e preciso.

    REGRAS RÍGIDAS E OBRIGATÓRIAS:

    1.  PRESERVAÇÃO TOTAL DA ESTRUTURA: Mantenha 100% da estrutura do texto original. 

        - Se for **HTML**, todas as tags, atributos (como class, id, href), e a hierarquia do DOM devem permanecer absolutamente intactas. Traduza apenas o conteúdo textual visível ao usuário.

        - Se houver **CÓDIGO** (JavaScript, Python ou de qualquer outra linguagem de programação, marcação e estilo), a sintaxe do código, a indentação e a lógica devem ser preservadas sem nenhuma alteração. Traduza exclusivamente os textos dentro de comentários e strings.

    2.  SAÍDA ESTRITAMENTE LIMPA: Sua resposta deve conter **apenas e tão somente** o conteúdo traduzido. É proibido adicionar qualquer texto introdutório, explicações, notas ou qualquer frase como "Aqui está a tradução:". A saída deve ser a tradução pura e direta.

    3.  FOCO NO CONTEÚDO DELIMITADO: O único texto a ser traduzido é aquele que se encontra dentro da tag <texto> desconsiderando a propria tag <texto>. Ignore todo o resto.

    <texto>

    ${text}

    </texto>`;
    }

    async _makeApiCall(prompt) {
        if (!this.apiKey && this.apiKey.length > 0) {
            throw new Error('A chave da API (apiKey) não foi definida.');
        }

        const response = await this.fetchClient(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`A requisição à API falhou com status ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content.trim() || '';
    }

    // MÉTODOS DA INTERFACE OBRIGATÓRIA

    /**
     * Traduz um único texto. Os parâmetros 'from' e 'to' são ignorados,
     * pois a classe sempre traduz de 'auto' para 'pt-br'.
     * @param {string} text - O texto a ser traduzido.
     * @param {string} from - (Ignorado) Idioma de origem.
     * @param {string} to - (Ignorado) Idioma de destino.
     * @returns {Promise<string>} O texto traduzido.
     */
    async translate(text, from, to) {
        const prompt = this._createPrompt(text);
        return this._makeApiCall(prompt);
    }

    /**
     * Traduz um lote de textos.
     * @param {string[]} texts - Os textos a serem traduzidos.
     * @param {string} from - (Ignorado) Idioma de origem.
     * @param {string} to - (Ignorado) Idioma de destino.
     * @returns {Promise<string[]>} Uma lista de textos traduzidos.
     */
    async translateBatch(texts, from, to) {
        // Usamos Promise.all para executar as traduções em paralelo.
        const translationPromises = texts.map(text => this.translate(text, from, to));
        return Promise.all(translationPromises);
    }

    /**
     * Retorna o comprimento máximo de caracteres para um único texto.
     * @returns {number}
     */
    getLengthLimit() {
        return this.lengthLimit;
    }

    /**
     * Retorna o tempo mínimo de espera entre requisições.
     * @returns {number}
     */
    getRequestsTimeout() {
        return this.requestsTimeout;
    }

    /**
     * Verifica se o texto (ou um lote de textos) excede o limite,
     * retornando o número de caracteres excedentes.
     * @param {string|string[]} text - O texto ou textos a verificar.
     * @returns {number} O número de caracteres excedentes (0 se estiver dentro do limite).
     */
    checkLimitExceeding(text) {
        const limit = this.getLengthLimit();
        const getExceededChars = (t) => Math.max(0, t.length - limit);

        if (Array.isArray(text)) {
            // Retorna o maior excesso encontrado no lote
            const excesses = text.map(getExceededChars);
            return Math.max(...excesses);
        }

        return getExceededChars(text);
    }

    /**
     * Informa que o tradutor suporta a detecção automática do idioma de origem.
     * @returns {boolean} Sempre true.
     */
    static isSupportedAutoFrom() {
        return true;
    }

    /**
     * Retorna uma lista de idiomas suportados. Como todos são suportados
     * via detecção automática, uma lista vazia é retornada.
     * @returns {string[]}
     */
    static getSupportedLanguages() {
        // Retorna um array vazio para indicar que não há uma lista restrita,
        // já que o modo 'auto' cobre todos os idiomas.
        return ['pt-br'];
    }
}

ChatGPTTranslator;
