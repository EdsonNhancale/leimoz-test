const API_BASE = "/api";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error: ${res.status}`);
  }
  return res.json();
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
}

export type Document = {
  id: string;
  title: string;
  category: string | null;
  metadata: unknown;
  createdAt: string;
};

export type DocumentDetail = Document & {
  content: string;
  chunks: { id: string; content: string; chunkIndex: number }[];
};

export type ChatResponse = {
  answer: string;
  sources: {
    documentId: string;
    document: string;
    category: string | null;
    chunk: number;
    similarity: number;
    rankScore: number;
  }[];
  context: {
    content: string;
    similarity: number;
    rankScore: number;
    document: string;
    category: string | null;
  }[];
  confidence: "high" | "medium" | "low";
  avgSimilarity: number;
  searchMethod: "hybrid" | "vector" | "keyword";
  queryKeywords: string[];
};

export type DocumentStats = {
  totalDocuments: number;
  totalChunks: number;
  categories: { category: string; count: number }[];
};
