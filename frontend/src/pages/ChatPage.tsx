import { useState, useRef, useEffect } from "react";
import { apiPost, apiGet, type ChatResponse, type DocumentStats } from "../api/client";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: ChatResponse["sources"];
  context?: ChatResponse["context"];
  confidence?: string;
  avgSimilarity?: number;
  searchMethod?: string;
  queryKeywords?: string[];
};

const categoryLabels: Record<string, string> = {
  trabalho: "Direito do Trabalho",
  transito: "Código de Estrada",
  familia: "Direito da Família",
  penal: "Direito Penal",
  saude: "Saúde",
  administracao: "Administração Pública",
};

const suggestedQuestions = [
  "O trabalhador tem direito a férias anuais?",
  "Quantos dias de licença de maternidade tenho direito?",
  "Qual a multa por conduzir sem carta?",
  "Posso ser despedido sem justa causa?",
];

function SimilarityBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color =
    pct >= 75 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--danger)";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div
        style={{
          flex: 1,
          height: 6,
          background: "var(--border)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 3,
            transition: "width 0.3s",
          }}
        />
      </div>
      <span style={{ fontSize: "0.75rem", fontWeight: 600, color, minWidth: 36 }}>
        {pct}%
      </span>
    </div>
  );
}

function ConfidenceBadge({ level }: { level: string }) {
  const config = {
    high: { bg: "#d4edda", color: "#155724", label: "Alta confiança" },
    medium: { bg: "#fff3cd", color: "#856404", label: "Confiança moderada" },
    low: { bg: "#f8d7da", color: "#721c24", label: "Baixa confiança" },
  }[level] || { bg: "#f8d7da", color: "#721c24", label: "Desconhecido" };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: "0.25rem 0.625rem",
        borderRadius: 4,
        fontSize: "0.75rem",
        fontWeight: 600,
        background: config.bg,
        color: config.color,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: config.color,
        }}
      />
      {config.label}
    </span>
  );
}

function SearchMethodBadge({ method }: { method: string }) {
  const config = {
    hybrid: { bg: "#cce5ff", color: "#004085", label: "Pesquisa Híbrida" },
    vector: { bg: "#d4edda", color: "#155724", label: "Pesquisa Semântica" },
    keyword: { bg: "#fff3cd", color: "#856404", label: "Pesquisa por Palavras-chave" },
  }[method] || { bg: "#e2e3e5", color: "#383d41", label: method };

  return (
    <span
      style={{
        padding: "0.15rem 0.5rem",
        borderRadius: 4,
        fontSize: "0.7rem",
        fontWeight: 600,
        background: config.bg,
        color: config.color,
      }}
    >
      {config.label}
    </span>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedContext, setExpandedContext] = useState<Record<number, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiGet<DocumentStats>("/documents/stats")
      .then(setStats)
      .catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(question?: string) {
    const q = question || input.trim();
    if (!q || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setLoading(true);

    try {
      const res = await apiPost<ChatResponse>("/chat", {
        question: q,
        category: selectedCategory || undefined,
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.answer,
          sources: res.sources,
          context: res.context,
          confidence: res.confidence,
          avgSimilarity: res.avgSimilarity,
          searchMethod: res.searchMethod,
          queryKeywords: res.queryKeywords,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Desculpe, ocorreu um erro ao processar a sua pergunta. Tente novamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function toggleContext(idx: number) {
    setExpandedContext((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px - 80px)" }}>
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem" }}>Pergunte à Lei</h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Faça perguntas sobre legislação moçambicana em linguagem simples
            </p>
          </div>
          {stats && (
            <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              <span>{stats.totalDocuments} documentos</span>
              <span>{stats.totalChunks} chunks indexados</span>
            </div>
          )}
        </div>

        <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
            Filtrar por:
          </span>
          <button
            onClick={() => setSelectedCategory("")}
            style={{
              padding: "0.35rem 0.75rem",
              borderRadius: "var(--radius)",
              fontSize: "0.8rem",
              fontWeight: 500,
              background: !selectedCategory ? "var(--primary)" : "var(--surface)",
              color: !selectedCategory ? "white" : "var(--text)",
              border: "1px solid var(--border)",
            }}
          >
            Todas
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "var(--radius)",
                fontSize: "0.8rem",
                fontWeight: 500,
                background: selectedCategory === key ? "var(--primary)" : "var(--surface)",
                color: selectedCategory === key ? "white" : "var(--text)",
                border: "1px solid var(--border)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "var(--surface)",
          borderRadius: "var(--radius)",
          boxShadow: "var(--shadow)",
          padding: "1.5rem",
          marginBottom: "1rem",
        }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <p style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "var(--text-secondary)" }}>
              Como posso ajudá-lo(a)?
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                maxWidth: 500,
                margin: "0 auto",
              }}
            >
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "0.875rem 1.25rem",
                    textAlign: "left",
                    fontSize: "0.95rem",
                    color: "var(--text)",
                    transition: "all 0.2s",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                background: msg.role === "user" ? "var(--primary)" : "var(--bg)",
                color: msg.role === "user" ? "white" : "var(--text)",
                padding: "1rem 1.25rem",
                borderRadius: "var(--radius)",
                border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
              }}
            >
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                {msg.content}
              </div>

              {msg.role === "assistant" && msg.confidence && (
                <div
                  style={{
                    marginTop: "1rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <ConfidenceBadge level={msg.confidence} />
                    {msg.searchMethod && <SearchMethodBadge method={msg.searchMethod} />}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.75rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {msg.avgSimilarity !== undefined && msg.avgSimilarity > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                          Similaridade média:
                        </span>
                        <SimilarityBar value={msg.avgSimilarity} />
                      </div>
                    )}
                  </div>

                  {msg.queryKeywords && msg.queryKeywords.length > 0 && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        Palavras-chave:{" "}
                      </span>
                      {msg.queryKeywords.map((kw, k) => (
                        <span
                          key={k}
                          style={{
                            display: "inline-block",
                            padding: "0.1rem 0.4rem",
                            margin: "0.1rem",
                            background: "var(--border)",
                            borderRadius: 3,
                            fontSize: "0.7rem",
                            fontFamily: "monospace",
                          }}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}

                  {msg.context && msg.context.length > 0 && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <button
                        onClick={() => toggleContext(i)}
                        style={{
                          background: "none",
                          color: "var(--primary)",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          padding: "0.25rem 0",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.375rem",
                        }}
                      >
                        {expandedContext[i] ? "▼" : "▶"} Contexto encontrado ({msg.context.length} trecho{msg.context.length > 1 ? "s" : ""})
                      </button>

                      {expandedContext[i] && (
                        <div style={{ marginTop: "0.5rem", display: "grid", gap: "0.5rem" }}>
                          {msg.context.map((ctx, j) => (
                            <div
                              key={j}
                              style={{
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderRadius: "var(--radius)",
                                padding: "0.75rem",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "0.375rem",
                                  flexWrap: "wrap",
                                  gap: "0.25rem",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    color: "var(--primary)",
                                  }}
                                >
                                  {ctx.document}
                                  {ctx.category && ` — ${categoryLabels[ctx.category] || ctx.category}`}
                                </span>
                              </div>
                              <div style={{ display: "flex", gap: "1rem", marginBottom: "0.375rem" }}>
                                <div style={{ flex: 1 }}>
                                  <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>Similaridade: </span>
                                  <SimilarityBar value={ctx.similarity} />
                                </div>
                                {ctx.rankScore > 0 && (
                                  <div style={{ flex: 1 }}>
                                    <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>Relevância: </span>
                                    <SimilarityBar value={ctx.rankScore} />
                                  </div>
                                )}
                              </div>
                              <p
                                style={{
                                  fontSize: "0.8rem",
                                  color: "var(--text-secondary)",
                                  marginTop: "0.375rem",
                                  lineHeight: 1.5,
                                  maxHeight: 80,
                                  overflow: "hidden",
                                }}
                              >
                                {ctx.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {msg.sources && msg.sources.length > 0 && (
                    <div>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "var(--text-secondary)",
                          marginBottom: "0.375rem",
                        }}
                      >
                        Fontes citadas:
                      </p>
                      {msg.sources.map((s, j) => (
                        <div
                          key={j}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.8rem",
                            color: "var(--text-secondary)",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <span
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              background: "var(--primary)",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {j + 1}
                          </span>
                          <span>
                            {s.document}
                            {s.category && ` (${categoryLabels[s.category] || s.category})`}
                          </span>
                          <SimilarityBar value={s.similarity} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "1rem 1.25rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--text-secondary)",
              }}
            >
              <span style={{ animation: "pulse 1.5s infinite" }}>🔍</span>
              A pesquisar na base de conhecimento...
              {selectedCategory && (
                <span style={{ fontSize: "0.8rem", color: "var(--primary)" }}>
                  (categoria: {categoryLabels[selectedCategory] || selectedCategory})
                </span>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          display: "flex",
          gap: "0.75rem",
          background: "var(--surface)",
          borderRadius: "var(--radius)",
          boxShadow: "var(--shadow)",
          padding: "0.75rem",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            selectedCategory
              ? `Perguntar sobre ${categoryLabels[selectedCategory] || selectedCategory}...`
              : "Faça a sua pergunta sobre legislação..."
          }
          disabled={loading}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            fontSize: "1rem",
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            background: loading || !input.trim() ? "var(--text-secondary)" : "var(--primary)",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "var(--radius)",
            fontWeight: 600,
            fontSize: "1rem",
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
