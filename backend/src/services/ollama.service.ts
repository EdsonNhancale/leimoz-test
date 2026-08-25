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
  "ferias": `Olá! Sim, o trabalhador moçambicano tem direito a férias anuais remuneradas, conforme a Lei n.º 13/2023 (Lei do Trabalho).

**Resumo dos seus direitos:**

📅 **Duração:**
- **Primeiro ano:** 12 dias úteis de férias.
- **A partir do segundo ano:** 30 dias corridos.
- **Contratos a prazo certo (<1 ano):** 1 dia por cada mês de serviço efectivo.

💰 **Remuneração:**
O direito a férias é **irrenunciável** — o empregador não pode negar-lhe as férias. O trabalhador que não gozar a totalidade das férias tem direito à remuneração correspondente aos dias não gozados, excepto em casos excepcionais e mediante acordo.

⚠️ **Importante:**
Se gozar de faltas injustificadas, estas são descontadas tanto nas férias como na antiguidade.

> **Nota:** Esta é uma informação jurídica geral. Para questões específicas, recomendo consultar um advogado especializado.

*Fonte: Lei n.º 13/2023 — Direitos, Deveres e Remuneração, Férias, Descanso e Ausências.*`,

  "maternidade": `Olá! A trabalhadora grávida, puérpera e lactante goza de protecção especial sob a Lei n.º 13/2023. Eis os seus direitos:

🤰 **Licença por Maternidade:**
- **Duração:** 90 dias consecutivos, podendo ter início **20 dias antes** da data provável do parto.
- **Aplicação-se:** a todos os casos, incluindo parto a termo ou prematuro, nado-vivo ou morto.
- **Remuneração:** Regida pelo regime da Segurança Social obrigatória.

👶 **Licença por Paternidade:**
- **Duração:** 7 dias, iniciada no dia seguinte ao nascimento.
- **Morte/incapacidade da mãe:** Até **60 dias**.
- **Intervalo mínimo:** 1 ano e meio entre licenças.
- **Faculdade de comutação:** Cônjuges no mesmo emprego podem trocar dias de licença, no interesse do serviço.

🍼 **Direitos especiais durante a gravidez e lactação:**
✅ Dispensa de trabalho clinicamente desaconselhado (sem diminuição de remuneração).
✅ Isenção de trabalho nocturno, excepcional ou extraordinário a partir do 3.º mês de gravidez.
✅ Pausas de **30 min** para amamentação (ou 1 hora em horário contínuo) durante **1 ano** após a licença.
✅ Protecção contra despedimento: desde a comunicação da gravidez até **1 ano após o termo da licença**.

> ⚠️ É **obrigação da trabalhadora** informar o empregador por escrito do seu estado.

*Fonte: Lei n.º 13/2023 — Protecção da Maternidade e Paternidade (Arts. 12-15).*`,

  "transito": `Olá! Em matéria do Código de Estrada moçambicano:

**Condução sem carta de condução válida:**
🚗 **Natureza:** Contra-ordenação **grave**.
💵 **Multa:** 10.000 a 50.000 MT (metros moçambicanos).
🔁 **Reincidência:** Multa duplicada.
🚓 **Carta falsa/alheia:** Constitui **crime**, com pena de prisão até 2 anos OU multa até 200.000 MT.
🔒 **Apreensão do veículo:** Sim, pode ser apreendido por até 30 dias. O proprietário arca com as despesas de guarda.
👶 **Menores de 18 anos:** Proibição absoluta. Multa de 5.000 a 25.000 MT.

**Limites de velocidade:**
🏙️ **Zonas urbanas:** 50 km/h
🛣️ **Estradas nacionais:** 80 km/h
🚄 **Autoestradas:** 120 km/h

**Multas por excesso:**
• +0–20 km/h → 1.000 a 5.000 MT
• +20–40 km/h → 5.000 a 15.000 MT
• +>40 km/h → 15.000 a 50.000 MT + apreensão da carta

Reincidência em 12 meses duplica a multa. 3.ª reincidência em 24 meses pode suspender a carta.

> ⚖️ Consulte sempre o Boletim da República para a versão actualizada.`,

  "despedimento": `Olá! Vamos explicar os seus direitos face à cessação do contrato de trabalho na Lei n.º 13/2023.

**Formas de cessação:**
1. Caducidade
2. Acordo revogatório
3. Denúncia de qualquer das partes
4. Rescisão com justa causa por qualquer das partes

**Justa causa de despedimento por parte do empregador:**
❌ Manifesta inaptidão após o período probatório.
❌ Violação culposa e grave dos deveres laborais.
❌ Detenção/prisão que prejudique o serviço.
❌ Motivos económicos, tecnológicos, estruturais ou de mercado (Art. 141).

**Aviso prévio:**
📝 Empregador: **30 dias** + 1 hora diária para procurar novo emprego (remunerada).
📝 Trabalhador: **15 dias**.
💸 Falta de aviso → indemnização igual ao período de aviso.

**Indemnizações por despedimento:**
📊 **Por despedimento do empregador (motivos estruturais/económicos/tecnológicos/market):**
• 1–7 S.M.I.: **30 dias/ano**
• 7.1–18 S.M.I.: **15 dias/ano**
• +18 S.M.I.: **5 dias/ano**

📊 **Despedimento colectivo (+8 micro/pequenas; +10 médias/grandes):**
• Base: **30 dias/ano** (mínimo 30 dias)
• +10 anos: **40 dias/ano**

📊 **Despedimento SEM justa causa (reintegração ou indemnização):**
• Opção: reintegração OU **45 dias/ano** (mínimo 45 dias)

⚠️ **Conselho:** Em caso de dúvida, consulte o Sindicato ou a Inspecção-Geral do Trabalho. Não aceite despedimentos sem documentação por escrito!`,
};

function findBestResponse(question: string, context: string): string {
  const q = question.toLowerCase();

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
            num_ctx: 4096,
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
    return data.response;
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
