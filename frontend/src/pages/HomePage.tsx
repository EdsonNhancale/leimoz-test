import { Link } from "react-router-dom";

const categories = [
  {
    id: "trabalho",
    title: "Direito do Trabalho",
    icon: "👷",
    description: "Férias, salário, contrato, despedimento e direitos laborais",
  },
  {
    id: "transito",
    title: "Código de Estrada",
    icon: "🚗",
    description: "Multas, carta de condução, sinalização e segurança rodoviária",
  },
  {
    id: "familia",
    title: "Direito da Família",
    icon: "👨‍👩‍👧",
    description: "Casamento, divórcio, pensão de alimentos e guarda de filhos",
  },
  {
    id: "penal",
    title: "Direito Penal",
    icon: "⚖️",
    description: "Crimes, penas e procedimento criminal",
  },
  {
    id: "saude",
    title: "Saúde",
    icon: "🏥",
    description: "Direitos dos pacientes, acesso a cuidados de saúde",
  },
  {
    id: "administracao",
    title: "Administração Pública",
    icon: "🏛️",
    description: "Documentos, procedimentos e direitos administrativos",
  },
];

export default function HomePage() {
  return (
    <div>
      <section
        style={{
          textAlign: "center",
          padding: "3rem 1rem",
          background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
          borderRadius: "var(--radius)",
          color: "white",
          marginBottom: "3rem",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
          Conheça os seus <span style={{ color: "var(--accent)" }}>direitos</span>.
          <br />
          Conheça os seus <span style={{ color: "var(--accent)" }}>deveres</span>.
        </h1>
        <p
          style={{
            fontSize: "1.15rem",
            maxWidth: 600,
            margin: "0 auto 2rem",
            opacity: 0.9,
          }}
        >
          Consulte a legislação moçambicana em linguagem simples.
          Sem necessidade de formação jurídica.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to="/pergunte"
            style={{
              background: "var(--accent)",
              color: "var(--primary-dark)",
              padding: "0.875rem 2rem",
              borderRadius: "var(--radius)",
              fontWeight: 700,
              fontSize: "1.1rem",
              transition: "transform 0.2s",
            }}
          >
            Pergunte à Lei
          </Link>
          <Link
            to="/documentos"
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "white",
              padding: "0.875rem 2rem",
              borderRadius: "var(--radius)",
              fontWeight: 600,
              fontSize: "1.1rem",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            Ver Documentos
          </Link>
        </div>
      </section>

      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", textAlign: "center" }}>
        Explore por Categoria
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.25rem",
          marginBottom: "3rem",
        }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/documentos?categoria=${cat.id}`}
            style={{
              background: "var(--surface)",
              borderRadius: "var(--radius)",
              padding: "1.5rem",
              boxShadow: "var(--shadow)",
              border: "1px solid var(--border)",
              transition: "all 0.2s",
              display: "block",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{cat.icon}</div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "var(--primary)" }}>
              {cat.title}
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{cat.description}</p>
          </Link>
        ))}
      </div>

      <section
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius)",
          padding: "2rem",
          boxShadow: "var(--shadow)",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "1.3rem", marginBottom: "0.75rem" }}>Como funciona?</h2>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "1.5rem",
          }}
        >
          {[
            { step: "1", text: "Faça a sua pergunta em linguagem simples" },
            { step: "2", text: "O sistema encontra os artigos relevantes" },
            { step: "3", text: "Receba a resposta com citação da lei" },
          ].map((item) => (
            <div key={item.step} style={{ maxWidth: 250 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  margin: "0 auto 0.75rem",
                }}
              >
                {item.step}
              </div>
              <p style={{ color: "var(--text-secondary)" }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
