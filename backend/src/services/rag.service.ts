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
};

type ChatOptions = {
  category?: string;
  topK?: number;
};

const SIMILARITY_THRESHOLD = 0.3;
const VECTOR_WEIGHT = 0.7;
const KEYWORD_WEIGHT = 0.3;

function buildKeywordPattern(keywords: string[]): string {
  return keywords
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
}

function reresults(
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

    const normalizedKeywordScore = Math.min(keywordScore / (queryKeywords.length * 3), 1);
    const combinedScore = VECTOR_WEIGHT * r.similarity + KEYWORD_WEIGHT * normalizedKeywordScore;

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

export async function answerQuestion(
  question: string,
  options: ChatOptions = {}
) {
  const { category, topK = 8 } = options;

  const embedding = await createEmbedding(question);
  const vector = `[${embedding.join(",")}]`;
  const queryKeywords = extractKeywords(question);

  let vectorResults: SearchResult[];

  if (category) {
    vectorResults = await prisma.$queryRawUnsafe<SearchResult[]>(
      `
      SELECT
        dc.id,
        dc.content,
        dc.chunk_index,
        dc.document_id,
        d.title AS document_title,
        d.category AS document_category,
        1 - (dc.embedding <=> $1::vector) AS similarity,
        0 AS rank_score
      FROM document_chunks dc
      INNER JOIN documents d ON d.id = dc.document_id
      WHERE (1 - (dc.embedding <=> $1::vector)) >= $2
        AND d.category = $3
      ORDER BY dc.embedding <=> $1::vector
      LIMIT $4
      `,
      vector,
      SIMILARITY_THRESHOLD,
      category,
      topK * 2
    );
  } else {
    vectorResults = await prisma.$queryRawUnsafe<SearchResult[]>(
      `
      SELECT
        dc.id,
        dc.content,
        dc.chunk_index,
        dc.document_id,
        d.title AS document_title,
        d.category AS document_category,
        1 - (dc.embedding <=> $1::vector) AS similarity,
        0 AS rank_score
      FROM document_chunks dc
      INNER JOIN documents d ON d.id = dc.document_id
      WHERE (1 - (dc.embedding <=> $1::vector)) >= $2
      ORDER BY dc.embedding <=> $1::vector
      LIMIT $3
      `,
      vector,
      SIMILARITY_THRESHOLD,
      topK * 2
    );
  }

  let keywordResults: SearchResult[] = [];

  if (queryKeywords.length > 0) {
    const keywordPattern = buildKeywordPattern(queryKeywords);

    if (category) {
      keywordResults = await prisma.$queryRawUnsafe<SearchResult[]>(
        `
        SELECT
          dc.id,
          dc.content,
          dc.chunk_index,
          dc.document_id,
          d.title AS document_title,
          d.category AS document_category,
          0 AS similarity,
          similarity(dc.content, $1) AS rank_score
        FROM document_chunks dc
        INNER JOIN documents d ON d.id = dc.document_id
        WHERE dc.content ILIKE ANY($2::text[])
          AND d.category = $3
        ORDER BY rank_score DESC
        LIMIT $4
        `,
        keywordPattern,
        queryKeywords.map((k) => `%${k}%`),
        category,
        topK
      );
    } else {
      keywordResults = await prisma.$queryRawUnsafe<SearchResult[]>(
        `
        SELECT
          dc.id,
          dc.content,
          dc.chunk_index,
          dc.document_id,
          d.title AS document_title,
          d.category AS document_category,
          0 AS similarity,
          similarity(dc.content, $1) AS rank_score
        FROM document_chunks dc
        INNER JOIN documents d ON d.id = dc.document_id
        WHERE dc.content ILIKE ANY($2::text[])
        ORDER BY rank_score DESC
        LIMIT $3
        `,
        keywordPattern,
        queryKeywords.map((k) => `%${k}%`),
        topK
      );
    }
  }

  const allResults = [...vectorResults, ...keywordResults];
  const uniqueResults = deduplicateByDocument(allResults);

  const reranked = reresults(uniqueResults, queryKeywords);

  const finalResults = reranked
    .sort((a, b) => b.rank_score - a.rank_score)
    .slice(0, topK);

  if (!finalResults.length) {
    return {
      answer:
        "Não encontrei informação suficiente na base de conhecimento. Recomendo consultar um advogado ou verificar directamente a legislação em vigor.",
      sources: [],
      context: [],
      confidence: "low" as const,
      avgSimilarity: 0,
      searchMethod: "hybrid",
    };
  }

  const similarities = finalResults.map((r) => Number(r.similarity));
  const avgSimilarity =
    similarities.reduce((sum, s) => sum + s, 0) / similarities.length;
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
    .map(
      (result, index) =>
        `[Fonte ${index + 1}] Documento: ${result.document_title}${result.document_category ? ` | Categoria: ${result.document_category}` : ""}\nSimilaridade: ${(Number(result.similarity) * 100).toFixed(1)}% | Relevância: ${(result.rank_score * 100).toFixed(1)}%\nTrecho:\n${result.content}`
    )
    .join("\n\n----------------\n\n");

  const prompt = `
Você é o assistente virtual da LeiMoz — Plataforma Nacional de Literacia Jurídica de Moçambique.

Sua função é responder perguntas sobre legislação moçambicana utilizando SOMENTE a informação presente no CONTEXTO fornecido.

REGRAS OBRIGATÓRIAS:
1. Não invente informações jurídicas.
2. Não utilize conhecimento externo ao contexto.
3. Se o contexto não possuir informação suficiente, diga claramente que não encontrou informação suficiente e recomende consultar um profissional de direito.
4. Responda em português moçambicano, de forma simples e acessível.
5. Seja claro e objetivo.
6. Sempre que possível, cite o artigo e a lei especifica.
7. Formate a resposta para facil leitura.
8. Indique a confiança na resposta com base na similaridade dos documentos encontrados.
9. Os resultados foram obtidos por pesquisa híbrida (semântica + palavras-chave).

CONTEXTO (ordenado por relevância combinada — vector + keyword):
${context}

PERGUNTA:
${question}

RESPOSTA:`;

  const answer = await generateAnswer(prompt);

  return {
    answer,
    sources: finalResults.map((result) => ({
      documentId: result.document_id,
      document: result.document_title,
      category: result.document_category,
      chunk: result.chunk_index,
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
  };
}
