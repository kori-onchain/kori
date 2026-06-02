"use client"

// Fallback quando o próprio root layout quebra: não há acesso ao landing.css
// nem aos símbolos SVG, então a logo real (K) e os tokens do DS vão inline.
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
          gap: 28,
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        {/* Reload completo é o desejado aqui: o app shell quebrou. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            color: "#fafafa",
            textDecoration: "none",
          }}
        >
          <svg
            viewBox="420 260 310 370"
            width={24}
            height={29}
            aria-hidden="true"
          >
            <path
              d="M687.256 312.792L687.761 313.037C688.903 315.6 688.347 361.277 688.339 367.642C652.186 405.264 616.554 443.385 581.454 481.992C596.939 497.772 613.443 513.652 629.23 529.243L721.187 620.099C694.536 620.373 667.338 620.067 640.644 620.039L619.604 620.015C615.524 616.35 611.238 612.134 607.351 608.236C572.133 572.923 534.645 539.223 499.818 503.592C561.731 439.438 624.213 375.836 687.256 312.792Z"
              fill="currentColor"
            />
            <path
              d="M534.163 269.695C535.193 272.855 535.005 300.957 535.035 306.33C535.232 347.907 535.157 389.485 534.81 431.061C499.36 468.415 464.208 506.052 429.359 543.968C427.97 541.752 428.245 525.221 428.252 521.631L428.336 488.556L428.251 378.795C444.034 361.651 460.488 345.217 476.753 328.524L534.163 269.695Z"
              fill="currentColor"
            />
          </svg>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>
            KORI
          </span>
        </a>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", maxWidth: 460 }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#ff6b3d" }}>
            Erro 500
          </span>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: "-0.03em" }}>
            Algo deu errado
          </h1>
          <p style={{ margin: 0, maxWidth: 420, fontSize: 15, lineHeight: 1.7, color: "#9a9a9e" }}>
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
            borderRadius: 10,
            background: "#ff6b3d",
            color: "#0a0a0a",
            fontSize: 14,
            fontWeight: 600,
            padding: "11px 20px",
            cursor: "pointer",
          }}
        >
          Tentar novamente
        </button>
      </body>
    </html>
  )
}
