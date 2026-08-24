import { Outlet, Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "Início" },
  { path: "/documentos", label: "Documentos" },
  { path: "/pergunte", label: "Pergunte à Lei" },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          background: "var(--primary)",
          color: "white",
          padding: "0 1.5rem",
          boxShadow: "var(--shadow)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          <Link
            to="/"
            style={{
              color: "white",
              fontSize: "1.4rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ color: "var(--accent)" }}>Lei</span>Moz
          </Link>

          <nav style={{ display: "flex", gap: "0.25rem" }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  color:
                    location.pathname === item.path
                      ? "var(--accent)"
                      : "rgba(255,255,255,0.85)",
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius)",
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  background:
                    location.pathname === item.path
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                  transition: "all 0.2s",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "2rem 1.5rem",
          width: "100%",
        }}
      >
        <Outlet />
      </main>

      <footer
        style={{
          background: "var(--primary-dark)",
          color: "rgba(255,255,255,0.7)",
          textAlign: "center",
          padding: "1.5rem",
          fontSize: "0.875rem",
        }}
      >
        <p>LeiMoz — Plataforma Nacional de Literacia Jurídica de Moçambique</p>
        <p style={{ marginTop: "0.25rem", fontSize: "0.8rem" }}>
          Conheça os seus direitos. Conheça os seus deveres.
        </p>
      </footer>
    </div>
  );
}
