import { config } from "../config";

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateDeterministicEmbedding(text: string, dimension: number): number[] {
  const hash = simpleHash(text.toLowerCase().trim());
  const rng = seededRandom(hash);
  const embedding: number[] = [];

  for (let i = 0; i < dimension; i++) {
    embedding.push(rng() * 2 - 1);
  }

  const norm = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
  if (norm > 0) {
    for (let i = 0; i < dimension; i++) {
      embedding[i] /= norm;
    }
  }

  return embedding;
}

const MOCK_RESPONSES: Record<string, string> = {
  "ferias": `Boa pergunta! Vou te explicar direitinho! 😊

Pela ***Lei n.º 13/2023***, tens direito a férias anuais remuneradas. Olha só como funciona:

**Quanto tempo de férias?**
• **Primeiro ano:** 12 dias úteis
• **A partir do segundo ano:** 30 dias corridos
• **Contrato a prazo certo (<1 ano):** 1 dia por cada mês trabalhado

**E a grana?**
O direito a férias é irrenunciável — ou seja, o patrão não pode te negar! Se não gozares todos os dias, tens direito a receber por eles.

**Cuidado!**
Se faltares sem justificação, essas faltas são descontadas nas férias e na antiguidade.

📋 **Base Legal:** ***Lei n.º 13/2023, Arts. 87.º a 95.º***

**Resumo:** Sim, tens direito a férias e a receber por elas! 🎉

> Esta é uma informação geral. Para o teu caso específico, recomendo falar com um advogado.

Estou por aqui se precisar de mais alguma coisa! 🤝`,

  "maternidade": `Boa pergunta! Vou te explicar direitinho! 😊

Pela ***Lei n.º 13/2023***, a trabalhadora grávida tem direitos muito importantes!

**Licença por Maternidade:**
• **Duração:** 90 dias consecutivos
• **Pode começar:** 20 dias antes do parto
• **Remuneração:** Pela Segurança Social

**Licença por Paternidade:**
• **Duração:** 7 dias
• **Se a mãe falecer ou ficar incapacitada:** Até 60 dias

**E mais direitos! 🤰**
• Dispensa de trabalho que faz mal ao bebê (sem descontar!)
• Isenção de trabalho à noite a partir do 3.º mês
• Pausas de 30 min para amamentar (durante 1 ano)
• Protecção contra despedimento até 1 ano após o parto

📋 **Base Legal:** ***Lei n.º 13/2023, Arts. 12.º a 15.º***

**Resumo:** A trabalhadora grávida tem muitos direitos! Garanta que estão todos a ser cumpridos! 💪

> É obrigação informar o patrão por escrito do estado de gravidez.

Estou por aqui se precisar! 🤝`,

  "transito": `Boa pergunta! Vou te explicar direitinho! 😊

Pelo ***Código de Estrada moçambicano***:

**Dirigir sem carta?**
• **Multa:** 10.000 a 50.000 MT
• **Reincidência:** Multa duplica!
• **Carta falsa:** Crime! Prisão até 2 anos ou multa até 200.000 MT
• **Menor de 18 anos:** Proibido! Multa de 5.000 a 25.000 MT

**Velocidade máxima:**
• **Na cidade:** 50 km/h
• **Estrada nacional:** 80 km/h
• **Autoestrada:** 120 km/h

**Multas por excesso de velocidade:**
• +0–20 km/h → 1.000 a 5.000 MT
• +20–40 km/h → 5.000 a 15.000 MT
• +>40 km/h → 15.000 a 50.000 MT + perda da carta

📋 **Base Legal:** ***Código de Estrada, Arts. 87.º a 95.º***

**Dica:** Respeita os limites para não levar multa! 🚗💨

> Consulta o Boletim da República para a versão mais atual.

Qualquer dúvida, é só chamar! 🤝`,

  "despedimento": `Boa pergunta! Vou te explicar direitinho! 😊

Os teus direitos na ***Lei n.º 13/2023***:

**Formas de sair do trabalho:**
1. Contrato acaba (caducidade)
2. Acordo entre as partes
3. Qualquer um pode rescindir
4. Rescisão com justa causa

**O patrão pode te despedir por justa causa se:**
• Não fores competente depois do período de experiência
• Cometeres uma falta grave
• Fores preso e atrapalhar o trabalho
• Houver motivos económicos/tecnológicos (***Artigo 141.º***)

**Aviso prévio:**
• **Patrão:** 30 dias + hora por dia para procurar outro emprego
• **Trabalhador:** 15 dias
• **Não der aviso?** Paga indemnização!

**Indemnizações:**
• **Despedimento do patrão:** 30d/ano (até 10 anos), 15d/ano (10-20), 5d/ano (+20)
• **Despedimento colectivo:** 30d/ano (mínimo)
• **SEM justa causa (***Artigo 145.º***):** 45d/ano ou reintegração

📋 **Base Legal:** ***Lei n.º 13/2023, Arts. 138.º a 146.º***

**Resumo:** Não aceita despedimento sem documento! Consulta o sindicato! 💪

Estou por aqui se precisar! 🤝`,
};

function findBestResponse(question: string, context: string): string {
  const q = question.toLowerCase().trim();

  const greetings = [
    "olá", "ola", "oi", "bom dia", "boa tarde", "boa noite",
    "hello", "hi", "hey", "e aí", "eaí", "salve", "saudações",
    "bom dia", "boa tarde", "boa noite", "como vai", "tudo bem",
    "oi tudo bem", "olá tudo bem", "hello how are you"
  ];

  if (greetings.some(g => q === g || q.startsWith(g + " ") || q.endsWith(" " + g) || q.length < 5)) {
    return `Olá! Tudo bem? 😊

Sou o assistente jurídico do LeiMoz. Como posso te ajudar hoje?

Posso esclarecer dúvidas sobre:
• Direito do Trabalho (despedimento, indemnizações, férias)
• Gravidez e licença de maternidade
• Contratos de trabalho
• E muito mais!

É só perguntar, tô por aqui! 🤝`;
  }

  for (const [keyword, response] of Object.entries(MOCK_RESPONSES)) {
    if (q.includes(keyword)) {
      return response;
    }
  }

  if (context && context.trim().length > 20) {
    return `Olá! Com base na legislação moçambicana consultada, aqui vai a resposta à sua pergunta sobre **"${question}"**:

A informação encontra-se descrita na base de conhecimento. Por favor consulte as fontes abaixo para detalhes.

> ⚖️ **Lembre-se:** O LeiMoz fornece informação geral. Para aconselhamento jurídico personalizado, procure um advogado ou a Ordem dos Advogados de Moçambique.

**Dica:** Seja mais específico(a) — por exemplo: *"quantos dias de aviso prévio para despedimento?"*`;
  }

  return `Olá! Agradeço a sua pergunta sobre **"${question}"**.

Infelizmente, não encontrei informação suficiente na base de conhecimento actual para responder com confiança elevada.

**Recomendações:**
1. 📚 **Consulte directamente a legislação em vigor** no [Boletim da República](https://www.portaldogoverno.gov.mz).
2. ⚖️ **Procure aconselhamento jurídico** junto de um advogado inscrito na Ordem dos Advogados de Moçambique.
3. 🏛️ **Contacte a Inspecção-Geral do Trabalho** (para questões laborais) ou outros órgãos competentes.

**Dicas para melhores resultados:**
- Tente reformular a pergunta com termos mais específicos (ex: *"Artigo sobre aviso prévio"* em vez de *"como sair do emprego"*).
- Utilize o **filtrar por categoria** (Trabalho, Família, etc.) para refinar a pesquisa.
- Seja concreto: indique o contexto (ex: despedimento, férias, maternidade).

> 📢 **Nota:** Este assistente está em fase de expansão. Brevemente terá mais diplomas legais indexados. Obrigado pela compreensão!`;
}

const OLLAMA_TIMEOUT_MS = 300000;
const OLLAMA_MAX_RETRIES = 2;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class OllamaError extends Error {
  public type: "connection" | "model" | "response" | "timeout";
  constructor(message: string, type: "connection" | "model" | "response" | "timeout") {
    super(message);
    this.name = "OllamaError";
    this.type = type;
  }
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new OllamaError(`O pedido ao Ollama excedeu o tempo limite (${timeoutMs / 1000}s). O modelo pode estar a ser carregado. Tente novamente.`, "timeout");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchWithRetry(url: string, init: RequestInit, retries = OLLAMA_MAX_RETRIES): Promise<Response> {
  let lastErr: unknown = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchWithTimeout(url, init, OLLAMA_TIMEOUT_MS);
    } catch (err) {
      lastErr = err;
      if (attempt < retries && !(err instanceof OllamaError && err.type === "timeout")) {
        await delay(1000 * (attempt + 1));
      } else {
        throw err;
      }
    }
  }
  throw lastErr;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (config.mockMode) {
    return generateDeterministicEmbedding(text, config.embeddingDimension);
  }

  try {
    const response = await fetchWithRetry(
      `${config.ollamaUrl}/api/embed`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: config.embeddingModel,
          input: text,
        }),
      }
    );

    if (!response.ok) {
      throw new OllamaError(
        `Ollama embedding falhou: HTTP ${response.status}. Verifique se o modelo '${config.embeddingModel}' está disponível.`,
        response.status === 404 ? "model" : "response"
      );
    }

    const data = await response.json();
    if (!data.embeddings || !data.embeddings[0]) {
      throw new OllamaError("Ollama não devolveu embeddings na resposta.", "response");
    }
    return data.embeddings[0];
  } catch (err) {
    if (err instanceof OllamaError) throw err;
    throw new OllamaError(
      `Não foi possível conectar ao Ollama em ${config.ollamaUrl}. Verifique se o serviço está em execução.`,
      "connection"
    );
  }
}

export async function generateAnswer(prompt: string): Promise<string> {
  const questionMatch = prompt.match(/PERGUNTA:\s*(.+?)(?:\n|RESPOSTA:)/is);
  const question = questionMatch?.[1]?.trim() || "";
  const contextMatch = prompt.match(/CONTEXTO \(ordenado por relevância[\s\S]*?:\n([\s\S]*?)\n\nPERGUNTA:/i);
  const context = contextMatch?.[1]?.trim() || "";

  if (config.mockMode) {
    return findBestResponse(question, context);
  }

  try {
    const response = await fetchWithRetry(
      `${config.ollamaUrl}/api/generate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: config.llmModel,
          prompt,
          stream: false,
          options: {
            temperature: 0.3,
            top_p: 0.85,
            num_ctx: 6144,
            num_predict: 512,
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new OllamaError(
          `Modelo '${config.llmModel}' não encontrado. Execute: ollama pull ${config.llmModel}`,
          "model"
        );
      }
      throw new OllamaError(
        `Ollama generation falhou: HTTP ${response.status}`,
        "response"
      );
    }

    const data = await response.json();
    if (!data.response) {
      throw new OllamaError("Ollama não devolveu resposta.", "response");
    }

    let answer = data.response;

    const sentences = answer.split(/(?<=[.!?])\s+/);
    if (sentences.length > 3) {
      const lastThree = sentences.slice(-3).join(" ");
      const count = (answer.match(new RegExp(lastThree.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
      if (count >= 3) {
        const firstOccurrence = answer.indexOf(lastThree);
        answer = answer.substring(0, firstOccurrence + lastThree.length);
      }
    }

    if (answer.length > 2000) {
      const lastPeriod = answer.lastIndexOf(".", 2000);
      if (lastPeriod > 1000) {
        answer = answer.substring(0, lastPeriod + 1);
      } else {
        answer = answer.substring(0, 2000);
      }
    }

    return answer;
  } catch (err) {
    console.warn("[Ollama] Fallback para mock mode devido a:", err instanceof Error ? err.message : err);
    return findBestResponse(question, context) + `\n\n⚠️ *Nota: resposta gerada em modo de contingência (sem IA real).*`;
  }
}

export async function checkOllamaHealth(): Promise<{
  ok: boolean;
  status: "online" | "offline" | "degraded";
  models?: string[];
  message?: string;
}> {
  try {
    const res = await fetchWithTimeout(`${config.ollamaUrl}/api/tags`, { method: "GET" }, 5000);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const models = (data.models || []).map((m: { name: string }) => m.name.split(":")[0]);
    const hasRequired = models.includes(config.llmModel.split(":")[0]) && models.includes(config.embeddingModel.split(":")[0]);
    return {
      ok: hasRequired,
      status: hasRequired ? "online" : "degraded",
      models,
      message: hasRequired
        ? `OK: modelos ${config.llmModel} e ${config.embeddingModel} disponíveis`
        : `Aviso: faltam modelos. Necessário: ${config.llmModel}, ${config.embeddingModel}. Disponíveis: ${models.join(", ")}`,
    };
  } catch (err) {
    return {
      ok: false,
      status: "offline",
      message: err instanceof Error ? err.message : "Sem conexão com Ollama",
    };
  }
}
