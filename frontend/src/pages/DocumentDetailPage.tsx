import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGet, type DocumentDetail } from "../api/client";

const categoryLabels: Record<string, string> = {
  trabalho: "Direito do Trabalho",
  transito: "Código de Estrada",
  familia: "Direito da Família",
  penal: "Direito Penal",
  saude: "Saúde",
  administracao: "Administração Pública",
};

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    apiGet<DocumentDetail>(`/documents/${id}`)
      .then(setDoc)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "3rem" }}>
        A carregar documento...
      </p>
    );
  }

  if (error || !doc) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <p style={{ color: "var(--danger)", marginBottom: "1rem" }}>
          {error || "Documento não encontrado"}
        </p>
        <Link to="/documentos">Voltar à lista</Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/documentos"
        style={{
          color: "var(--text-secondary)",
          fontSize: "0.9rem",
          display: "inline-block",
          marginBottom: "1rem",
        }}
      >
        ← Voltar à lista
      </Link>

      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius)",
          padding: "2rem",
          boxShadow: "var(--shadow)",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{doc.title}</h1>
          <div style={{ display: "flex", gap: "1rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {doc.category && (
              <span
                style={{
                  background: "var(--primary)",
                  color: "white",
                  padding: "0.2rem 0.6rem",
                  borderRadius: 4,
                  fontSize: "0.8rem",
                }}
              >
                {categoryLabels[doc.category] || doc.category}
              </span>
            )}
            <span>Criado: {new Date(doc.createdAt).toLocaleDateString("pt-MZ")}</span>
          </div>
        </div>

        <div
          style={{
            background: "var(--bg)",
            borderRadius: "var(--radius)",
            padding: "1.5rem",
            marginBottom: "2rem",
            whiteSpace: "pre-wrap",
            lineHeight: 1.8,
          }}
        >
          {doc.content}
        </div>

        <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
          Chunks Indexados ({doc.chunks.length})
        </h2>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {doc.chunks.map((chunk) => (
            <div
              key={chunk.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "1rem",
                fontSize: "0.9rem",
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  color: "var(--primary)",
                  marginRight: "0.5rem",
                }}
              >
                Chunk {chunk.chunkIndex + 1}:
              </span>
              {chunk.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
