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
  "ferias": `Sim, o trabalhador tem direito a férias anuais remuneradas.

De acordo com a Lei do Trabalho de Moçambique:

**Artigo 50.º** - O trabalhador tem direito a um período de férias anuais remuneradas de 30 dias úteis.

**Artigo 51.º** - O direito a férias adquire-se após um período de serviço efectivo de 12 meses.

**Artigo 52.º** - O trabalhador que não gozar a totalidade das férias tem direito à remuneração correspondente aos dias não gozados.

Fontes: Lei do Trabalho, Arts. 50-52`,

  "maternidade": `A trabalhadora tem direito a licença de maternidade.

De acordo com a legislação moçambicana:

**Artigo 76.º** - A trabalhadora tem direito a uma licença de maternidade de 60 dias, com remuneração integral.

**Artigo 77.º** - A licença pode ser alargada em caso de complicações pós-parto.

**Artigo 78.º** - A trabalhadora não pode ser despedida durante o período de licença de maternidade.

Fontes: Lei do Trabalho, Arts. 76-78`,

  "transito": `No que respeita ao Código de Estrada:

**Artigo 145.º** - Conduzir sem carta de condução constitui contra-ordenação grave.

**Artigo 146.º** - A multa para conduzir sem carta é de 10.000 a 50.000 MT.

**Artigo 147.º** - O veículo pode ser apreendido em caso de reincidência.

Fontes: Código de Estrada, Arts. 145-147`,

  "despedimento": `O despedimento deve seguir procedimentos legais:

**Artigo 144.º** - O despedimento só pode ser feito por justa causa.

**Artigo 145.º** - Justa causa inclui: falta grave, abandono de posto, conduta desonrosa.

**Artigo 146.º** - O trabalhador tem direito a aviso prévio de 30 dias.

**Artigo 147.º** - Em caso de despedimento sem justa causa, o trabalhador tem direito a compensação.

Fontes: Lei do Trabalho, Arts. 144-147`,
};

function findBestResponse(question: string): string {
  const q = question.toLowerCase();

  for (const [keyword, response] of Object.entries(MOCK_RESPONSES)) {
    if (q.includes(keyword)) {
      return response;
    }
  }

  return `Com base na legislação moçambicana, não encontrei informação específica sobre "${question}" na base de conhecimento actual.

Recomendo:
1. Consultar directamente a legislação em vigor
2. Procurar aconselhamento jurídico junto de um advogado
3. Verificar no Boletim da República a versão mais actualizada da lei

Nota: Esta é uma resposta de teste. Para respostas precisas, necessita de um modelo de IA real (Ollama com llama3.2).`;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (config.mockMode) {
    return generateDeterministicEmbedding(text, config.embeddingDimension);
  }

  const response = await fetch(`${config.ollamaUrl}/api/embed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.embeddingModel,
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama embedding error: ${response.status}`);
  }

  const data = await response.json();
  return data.embeddings[0];
}

export async function generateAnswer(prompt: string): Promise<string> {
  if (config.mockMode) {
    const questionMatch = prompt.match(/PERGUNTA:\s*(.+?)(?:\n|RESPOSTA:)/is);
    const question = questionMatch?.[1]?.trim() || "";
    return findBestResponse(question);
  }

  const response = await fetch(`${config.ollamaUrl}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.llmModel,
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama generation error: ${response.status}`);
  }

  const data = await response.json();
  return data.response;
}
