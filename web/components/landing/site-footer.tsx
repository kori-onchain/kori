const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Produto",
    links: [
      { label: "App", href: "#" },
      { label: "Cartão Black", href: "#" },
      { label: "Yield", href: "#" },
      { label: "Score", href: "#" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Documentação", href: "#" },
      { label: "Whitepaper", href: "#" },
      { label: "Auditorias", href: "#" },
      { label: "Bug Bounty", href: "#" },
    ],
  },
  {
    title: "Comunidade",
    links: [
      { label: "Discord", href: "#" },
      { label: "Twitter", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "Mirror", href: "#" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="section footer">
      <span className="sec-label">S:08</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="footer-grid">
        <div className="footer-brand">
          <div className="nav-brand">
            <svg className="k">
              <use href="#kora-k" />
            </svg>
            <span className="word">KORA</span>
          </div>
          <p>
            Banking onchain pra quem mora no Brasil. Settled on Solana. Open source, governado pela
            comunidade.
          </p>
        </div>

        {COLS.map((col) => (
          <div key={col.title} className="footer-col">
            <h4>{col.title}</h4>
            {col.links.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <span>© 2026 KORA LABS · MIT LICENSE</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          Powered by
          <svg style={{ width: 14, height: 12, color: "var(--ink-dim)" }}>
            <use href="#solana" />
          </svg>
          <span style={{ color: "var(--ink-dim)" }}>Solana</span>
        </span>
        <span>
          <span className="dot" />
          &nbsp;&nbsp;Mainnet · live
        </span>
      </div>
    </footer>
  )
}
