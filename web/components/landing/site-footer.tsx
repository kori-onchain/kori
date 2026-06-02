const REPO_URL = "https://github.com/kori-onchain/kori"

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Produto",
    links: [
      { label: "App", href: "/blog/o-app-da-kori" },
      { label: "Yield", href: "/blog/investidor-yield-onchain" },
      { label: "Score", href: "/blog/score-on-chain" },
      { label: "Cartão (roadmap)", href: "/blog/cartao-kori" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Documentação", href: `${REPO_URL}#readme` },
    ],
  },
  {
    title: "Hackanation",
    links: [{ label: "GitHub", href: REPO_URL }],
  },
]

export function SiteFooter() {
  return (
    <footer className="section footer">
      <span className="sec-label">S:12</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="footer-grid">
        <div className="footer-brand">
          <div className="nav-brand">
            <svg className="k">
              <use href="#kori-k" />
            </svg>
            <span className="word">KORI</span>
          </div>
          <p>
            Ecossistema financeiro Web3 que liga capital global à economia local.
            Built on Solana · Demo Hackanation 2026 (Devnet).
          </p>
        </div>

        {COLS.map((col) => (
          <div key={col.title} className="footer-col">
            <h4>{col.title}</h4>
            {col.links.map((l) => {
              const external = l.href.startsWith("http")
              return (
                <a
                  key={l.label}
                  href={l.href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {l.label}
                </a>
              )
            })}
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <span>© 2026 KORI LABS · MIT LICENSE</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          Powered by
          <svg style={{ width: 14, height: 12, color: "var(--ink-dim)" }}>
            <use href="#solana" />
          </svg>
          <span style={{ color: "var(--ink-dim)" }}>Solana</span>
        </span>
        <span>
          <span className="dot" />
          &nbsp;&nbsp;Devnet · Hackanation 2026
        </span>
      </div>
    </footer>
  )
}
