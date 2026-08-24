import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiGet, apiDelete, type Document } from "../api/client";

const categoryLabels: Record<string, string> = {
  trabalho: "Direito do Trabalho",
  transito: "Código de Estrada",
  familia: "Direito da Família",
  penal: "Direito Penal",
  saude: "Saúde",
  administracao: "Administração Pública",
};

export default function DocumentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const activeCategory = searchParams.get("categoria") || "";

  useEffect(() => {
    apiGet<Document[]>("/documents")
      .then(setDocuments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory
    ? documents.filter((d) => d.category === activeCategory)
    : documents;

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Eliminar "${title}"?`)) return;
    try {
      await apiDelete(`/documents/${id}`);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert("Erro ao eliminar documento");
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem" }}>Documentos</h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Legislação indexada na base de conhecimento
          </p>
        </div>
        <Link
          to="/documentos/novo"
          style={{
            background: "var(--primary)",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "var(--radius)",
            fontWeight: 600,
          }}
        >
          + Adicionar
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        <button
          onClick={() => setSearchParams({})}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "var(--radius)",
            fontWeight: 500,
            background: !activeCategory ? "var(--primary)" : "var(--surface)",
            color: !activeCategory ? "white" : "var(--text)",
            border: "1px solid var(--border)",
          }}
        >
          Todos
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSearchParams({ categoria: key })}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius)",
              fontWeight: 500,
              background: activeCategory === key ? "var(--primary)" : "var(--surface)",
              color: activeCategory === key ? "white" : "var(--text)",
              border: "1px solid var(--border)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "3rem" }}>
          A carregar documentos...
        </p>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow)",
          }}
        >
          <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
            Nenhum documento encontrado
          </p>
          <p style={{ color: "var(--text-secondary)" }}>
            <Link to="/documentos/novo">Adicione o primeiro documento</Link> para começar.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "1rem",
          }}
        >
          {filtered.map((doc) => (
            <div
              key={doc.id}
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius)",
                padding: "1.25rem 1.5rem",
                boxShadow: "var(--shadow)",
                border: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <Link
                  to={`/documentos/${doc.id}`}
                  style={{ fontSize: "1.1rem", fontWeight: 600 }}
                >
                  {doc.title}
                </Link>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginTop: "0.375rem",
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    flexWrap: "wrap",
                  }}
                >
                  {doc.category && (
                    <span
                      style={{
                        background: "var(--primary)",
                        color: "white",
                        padding: "0.15rem 0.5rem",
                        borderRadius: 4,
                        fontSize: "0.75rem",
                      }}
                    >
                      {categoryLabels[doc.category] || doc.category}
                    </span>
                  )}
                  <span>{new Date(doc.createdAt).toLocaleDateString("pt-MZ")}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(doc.id, doc.title)}
                style={{
                  background: "none",
                  color: "var(--danger)",
                  padding: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
