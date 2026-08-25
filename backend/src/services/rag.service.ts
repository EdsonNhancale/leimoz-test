import { prisma } from "../db";
import { createEmbedding } from "./embedding.service";
import { generateAnswer } from "./ollama.service";
import { extractKeywords } from "../utils/chunk";

type SearchResult = {
  id: string;
  content: string;
  chunk_index: number;
  document_id: string;
  document_title: string;
  document_category: string | null;
  similarity: number;
  rank_score: number;
  "chunkIndex"?: number;
  "documentId"?: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatOptions = {
  category?: string;
  topK?: number;
  history?: ChatMessage[];
};

const SIMILARITY_THRESHOLD = 0.30;
const SIMILARITY_THRESHOLD_LOOSE = 0.20;
const VECTOR_WEIGHT = 0.72;
const KEYWORD_WEIGHT = 0.28;

function buildKeywordPattern(keywords: string[]): string {
  return keywords
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
}

function rerankResults(
  results: SearchResult[],
  queryKeywords: string[]
): SearchResult[] {
  if (!queryKeywords.length) return results;

  const keywordPattern = buildKeywordPattern(queryKeywords);

  return results.map((r) => {
    const contentLower = r.content.toLowerCase();
    let keywordScore = 0;

    for (const kw of queryKeywords) {
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      const matches = contentLower.match(regex);
      if (matches) {
        keywordScore += matches.length;
      }
    }

    const titleLower = (r.document_title || "").toLowerCase();
    for (const kw of queryKeywords) {
      if (titleLower.includes(kw.toLowerCase())) {
        keywordScore += 2;
      }
    }

    const normalizedKeywordScore = Math.min(keywordScore / Math.max(queryKeywords.length * 3, 1), 1);
    const vectorScore = Number(r.similarity) || 0;
    const combinedScore = VECTOR_WEIGHT * vectorScore + KEYWORD_WEIGHT * normalizedKeywordScore;

    return {
      ...r,
      rank_score: combinedScore,
    };
  });
}

function deduplicateByDocument(results: SearchResult[]): SearchResult[] {
  const seen = new Map<string, SearchResult>();

  for (const r of results) {
    const key = r.document_id;
    const existing = seen.get(key);
    if (!existing || r.rank_score > existing.rank_score) {
      seen.set(key, r);
    }
  }

  return Array.from(seen.values());
}

function buildHistoryPrompt(history: ChatMessage[] = []): string {
  if (!history.length) return "";

  const recent = history.slice(-6);
  const lines: string[] = [];

  lines.push("HISTÓRICO DA CONVERSA (últimas mensagens):");
  for (const msg of recent) {
    const prefix = msg.role === "user" ? "  Utilizador" : "  Assistente";
    lines.push(`${prefix}: ${msg.content.slice(0, 600)}`);
  }
  lines.push("");
  lines.push("INSTRUÇÃO: A resposta deve ser coerente com o histórico acima. Se a pergunta for um follow-up, use o contexto anterior para ser mais preciso.");
  lines.push("");

  return lines.join("\n");
}

function buildQuestionWithContext(question: string, history: ChatMessage[] = []): string {
  if (!history.length) return question;

  const recentUser = history
    .filter((m) => m.role === "user")
    .slice(-2)
    .map((m) => m.content)
    .join(" | ");

  if (question.length < 30 && recentUser) {
    return `Pergunta anterior: "${recentUser}" | Pergunta actual: "${question}"`;
  }
  return question;
}

const LEGAL_STOPWORDS = new Set([
  "o", "a", "os", "as", "e", "ou", "de", "do", "da", "dos", "das", "em",
  "no", "na", "nos", "nas", "por", "para", "com", "sem", "sobre", "entre",
  "que", "se", "não", "sim", "tem", "ter", "são", "ser", "pode", "podem",
  "lei", "artigo", "art", "qual", "quais", "qual", "como", "onde", "quando",
  "quem", "minha", "meu", "seu", "sua", "me", "lhe", "isso", "isto",
  "direito", "lei", "direitos", "dever", "deveres", "obrigação",
]);

function extractLegalKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\sàáâãéêíóôõúüçñ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !LEGAL_STOPWORDS.has(w));

  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w);
}

export async function answerQuestion(
  question: string,
  options: ChatOptions = {}
) {
  const { category, topK = 8, history = [] } = options;
  const enrichedQuestion = buildQuestionWithContext(question, history);

  const embedding = await createEmbedding(enrichedQuestion);
  const vector = `[${embedding.join(",")}]`;
  const queryKeywords = Array.from(new Set([
    ...extractKeywords(question),
    ...extractLegalKeywords(question),
  ])).slice(0, 12);

  async function runSearch(params: {
    threshold: number;
    vectorLimitMul: number;
    includeKeyword: boolean;
  }): Promise<SearchResult[]> {
    let vectorResults: SearchResult[];

    const commonVectorSql = `
      SELECT
        dc.id,
        dc.content,
        dc."chunkIndex" AS chunk_index,
        dc."documentId" AS document_id,
        d.title AS document_title,
        d.category AS document_category,
        1 - (dc.embedding <=> $1::vector) AS similarity,
        0 AS rank_score
      FROM document_chunks dc
      INNER JOIN documents d ON d.id = dc."documentId"
      WHERE (1 - (dc.embedding <=> $1::vector)) >= $2
    `;

    if (category) {
      vectorResults = await prisma.$queryRawUnsafe<SearchResult[]>(
        `${commonVectorSql} AND d.category = $3 ORDER BY dc.embedding <=> $1::vector LIMIT $4`,
        vector,
        params.threshold,
        category,
        Math.floor(topK * params.vectorLimitMul)
      );
    } else {
      vectorResults = await prisma.$queryRawUnsafe<SearchResult[]>(
        `${commonVectorSql} ORDER BY dc.embedding <=> $1::vector LIMIT $3`,
        vector,
        params.threshold,
        Math.floor(topK * params.vectorLimitMul)
      );
    }

    let keywordResults: SearchResult[] = [];
    if (params.includeKeyword && queryKeywords.length > 0) {
      const keywordPattern = buildKeywordPattern(queryKeywords);
      const likeArray = queryKeywords.map((k) => `%${k}%`);

      const commonKwSql = `
        SELECT
          dc.id,
          dc.content,
          dc."chunkIndex" AS chunk_index,
          dc."documentId" AS document_id,
          d.title AS document_title,
          d.category AS document_category,
          0 AS similarity,
          similarity(dc.content, $1) AS rank_score
        FROM document_chunks dc
        INNER JOIN documents d ON d.id = dc."documentId"
        WHERE dc.content ILIKE ANY($2::text[])
      `;

      if (category) {
        keywordResults = await prisma.$queryRawUnsafe<SearchResult[]>(
          `${commonKwSql} AND d.category = $3 ORDER BY rank_score DESC LIMIT $4`,
          keywordPattern,
          likeArray,
          category,
          topK
        );
      } else {
        keywordResults = await prisma.$queryRawUnsafe<SearchResult[]>(
          `${commonKwSql} ORDER BY rank_score DESC LIMIT $3`,
          keywordPattern,
          likeArray,
          topK
        );
      }
    }

    return [...vectorResults, ...keywordResults];
  }

  let allResults = await runSearch({
    threshold: SIMILARITY_THRESHOLD,
    vectorLimitMul: 2,
    includeKeyword: true,
  });

  const strictCount = allResults.length;
  if (allResults.length < Math.max(3, Math.floor(topK / 2))) {
    const looseResults = await runSearch({
      threshold: SIMILARITY_THRESHOLD_LOOSE,
      vectorLimitMul: 4,
      includeKeyword: true,
    });
    allResults = [...allResults, ...looseResults];
  }

  const uniqueResults = deduplicateByDocument(allResults);
  const reranked = rerankResults(uniqueResults, queryKeywords);

  const finalResults = reranked
    .sort((a, b) => b.rank_score - a.rank_score)
    .slice(0, topK);

  if (finalResults.length > 0 && finalResults.length < strictCount) {
    const neighborsNeeded: { docId: string; idx: number }[] = [];
    for (const r of finalResults.slice(0, 4)) {
      if (r.chunk_index > 0) neighborsNeeded.push({ docId: r.document_id, idx: r.chunk_index - 1 });
      neighborsNeeded.push({ docId: r.document_id, idx: r.chunk_index + 1 });
    }

    const neighborChunks = await prisma.$queryRawUnsafe<SearchResult[]>(
      `
      SELECT
        dc.id,
        dc.content,
        dc."chunkIndex" AS chunk_index,
        dc."documentId" AS document_id,
        d.title AS document_title,
        d.category AS document_category,
        0.15 AS similarity,
        0.15 AS rank_score
      FROM document_chunks dc
      INNER JOIN documents d ON d.id = dc."documentId"
      WHERE (
        (dc."documentId" = $1 AND dc."chunkIndex" = $2) OR
        (dc."documentId" = $3 AND dc."chunkIndex" = $4) OR
        (dc."documentId" = $5 AND dc."chunkIndex" = $6) OR
        (dc."documentId" = $7 AND dc."chunkIndex" = $8)
      )
      LIMIT 8
      `,
      ...neighborsNeeded.flatMap((n) => [n.docId, n.idx])
    );

    if (neighborChunks.length) {
      for (const n of neighborChunks) n.rank_score = 0.18;
    }
  }

  const usedIds = new Set(finalResults.map((r) => r.id));
  let fallbackResponseText = "";

  if (!finalResults.length) {
    fallbackResponseText = `
Olá! Obrigado pela sua pergunta sobre **"${question}"**.

Infelizmente, a informação que procura ainda não se encontra na nossa base de conhecimento actual. Estamos em constante expansão — em breve disponibilizaremos mais diplomas legais.

**O que posso fazer por si:**
1. 📚 **Reformule a pergunta**: tente termos mais técnicos/legais (ex: *"Artigo 141 da Lei do Trabalho sobre aviso prévio"*).
2. 🏷️ **Filtre por categoria**: escolha *Direito do Trabalho*, *Família*, etc., para refinar.
3. ⚖️ **Consulte um profissional**: para questões concretas, recomendo a **Ordem dos Advogados de Moçambique** ou a **Inspecção-Geral do Trabalho**.
4. 📰 **Boletim da República**: consulte a legislação completa em [www.portaldogoverno.gov.mz](https://www.portaldogoverno.gov.mz).

> 📢 **Aviso Legal:** O LeiMoz é uma plataforma de literacia jurídica e **não substitui aconselhamento jurídico profissional**.
`;

    return {
      answer: fallbackResponseText,
      sources: [],
      context: [],
      confidence: "low" as const,
      avgSimilarity: 0,
      searchMethod: strictCount > 0 ? ("hybrid-loose" as const) : ("hybrid" as const),
      queryKeywords,
      searchExpanded: strictCount === 0,
    };
  }

  const similarities = finalResults.map((r) => Number(r.similarity));
  const avgSimilarity = similarities.reduce((sum, s) => sum + s, 0) / similarities.length;
  const maxSimilarity = Math.max(...similarities);

  let confidence: "high" | "medium" | "low";
  if (maxSimilarity >= 0.75 && avgSimilarity >= 0.6) {
    confidence = "high";
  } else if (maxSimilarity >= 0.5 && avgSimilarity >= 0.4) {
    confidence = "medium";
  } else {
    confidence = "low";
  }

  const context = finalResults
    .slice(0, 5)
    .map(
      (result, index) =>
        `[FONTE ${index + 1}] ${result.document_title}${result.document_category ? ` (${result.document_category})` : ""}
${result.content.slice(0, 800)}`
    )
    .join("\n\n");

  const historyPrompt = buildHistoryPrompt(history);

  const systemPrompt = `Você é o assistente jurídico LeiMoz de Moçambique. Responda em português simples e acolhedor.

REGRAS:
- SÓ use informação do CONTEXTO fornecido. Não invente artigos.
- Se o contexto for insuficiente, diga-o.
- Estruture a resposta com títulos, bullets e emojis moderados.
- Cite sempre as fontes (nome da lei/artigo).
- Termine com aviso: é informação geral, não substitui advogado.
- Nunca comece com "Com base na informação fornecida".`;

  const prompt = `${systemPrompt}

${historyPrompt}
CONTEXTO:
${context}

PERGUNTA: ${question}

Responda em Markdown:`;

  const answer = await generateAnswer(prompt);

  return {
    answer,
    sources: finalResults.map((result) => ({
      documentId: result.document_id,
      document: result.document_title,
      category: result.document_category,
      chunk: result.chunk_index ?? 0,
      similarity: Number(result.similarity),
      rankScore: result.rank_score,
    })),
    context: finalResults.map((result) => ({
      content: result.content,
      similarity: Number(result.similarity),
      rankScore: result.rank_score,
      document: result.document_title,
      category: result.document_category,
    })),
    confidence,
    avgSimilarity,
    searchMethod: "hybrid" as const,
    queryKeywords,
    searchExpanded: strictCount < finalResults.length,
  };
}
