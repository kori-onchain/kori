"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <div style={{ color: "#ff6b3d", fontWeight: 800, fontSize: 40, letterSpacing: -1 }}>
          KORI
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          <span style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: 4, color: "#ff6b3d" }}>
            ERRO 500
          </span>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>Algo deu errado</h1>
          <p style={{ margin: 0, maxWidth: 420, fontSize: 14, lineHeight: 1.6, color: "#9a9a9e" }}>
            Tivemos um problema inesperado. Tente recarregar a página.
          </p>
          {error?.digest ? (
            <span style={{ fontFamily: "monospace", fontSize: 11, color: "#5a5a5e" }}>
              ref: {error.digest}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={reset}
          style={{
            border: "none",
            borderRadius: 12,
            background: "#ff6b3d",
            color: "#0a0a0a",
            fontSize: 14,
            fontWeight: 600,
            padding: "12px 20px",
            cursor: "pointer",
          }}
        >
          Tentar novamente
        </button>
      </body>
    </html>
  )
}
