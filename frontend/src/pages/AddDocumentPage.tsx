import { useState } from "react";
import { Link } from "react-router-dom";
import { apiPost, type Document } from "../api/client";

export default function AddDocumentPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    id: string;
    chunks: number;
  } | null>(null);
  const [error, setError] = useState("");

  const categories = [
    { value: "trabalho", label: "Direito do Trabalho" },
    { value: "transito", label: "Código de Estrada" },
    { value: "familia", label: "Direito da Família" },
    { value: "penal", label: "Direito Penal" },
    { value: "saude", label: "Saúde" },
    { value: "administracao", label: "Administração Pública" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiPost<{ id: string; chunks: number }>(
        "/documents",
        {
          title,
          content,
          category: category || undefined,
        }
      );
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar documento");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            background: "#d4edda",
            border: "1px solid #c3e6cb",
            borderRadius: "var(--radius)",
            padding: "2rem",
          }}
        >
          <h2 style={{ color: "var(--success)", marginBottom: "1rem" }}>
            Documento criado com sucesso!
          </h2>
          <p style={{ marginBottom: "0.5rem" }}>
            <strong>{title}</strong>
          </p>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            {result.chunks} chunk(s) processado(s) e indexado(s)
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link
              to={`/documentos/${result.id}`}
              style={{
                background: "var(--primary)",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "var(--radius)",
                fontWeight: 600,
              }}
            >
              Ver Documento
            </Link>
            <button
              onClick={() => {
                setTitle("");
                setCategory("");
                setContent("");
                setResult(null);
              }}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                padding: "0.75rem 1.5rem",
                borderRadius: "var(--radius)",
                fontWeight: 600,
              }}
            >
              Adicionar Outro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
        Adicionar Documento
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Adicione textos de legislação para indexar na base de conhecimento.
      </p>

      {error && (
        <div
          style={{
            background: "#f8d7da",
            border: "1px solid #f5c6cb",
            color: "#721c24",
            padding: "1rem",
            borderRadius: "var(--radius)",
            marginBottom: "1.5rem",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius)",
          padding: "2rem",
          boxShadow: "var(--shadow)",
        }}
      >
        <div style={{ marginBottom: "1.25rem" }}>
          <label
            htmlFor="title"
            style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}
          >
            Título *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Lei do Trabalho — Arts. 50-80"
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              fontSize: "1rem",
            }}
          />
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label
            htmlFor="category"
            style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}
          >
            Categoria
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              fontSize: "1rem",
              background: "white",
            }}
          >
            <option value="">Sem categoria</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="content"
            style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}
          >
            Conteúdo *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Cole aqui o texto da legislação..."
            required
            rows={12}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              fontSize: "1rem",
              resize: "vertical",
              lineHeight: 1.6,
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "var(--text-secondary)" : "var(--primary)",
            color: "white",
            padding: "0.875rem 2rem",
            borderRadius: "var(--radius)",
            fontWeight: 700,
            fontSize: "1rem",
            width: "100%",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "A processar e indexar..." : "Adicionar Documento"}
        </button>
      </form>
    </div>
  );
}
