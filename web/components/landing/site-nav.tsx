const links = [
  { label: "App", href: "#" },
  { label: "Cartão", href: "#" },
  { label: "Yield", href: "#" },
  { label: "Score", href: "#" },
  { label: "Docs", href: "#" },
]

export function SiteNav() {
  return (
    <nav className="nav-bar">
      <div className="nav-brand">
        <svg className="k">
          <use href="#kora-k" />
        </svg>
        <span className="word">KORA</span>
      </div>
      <ul className="nav-links">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
      <div className="nav-right">
        <span className="pill">
          <span className="dot" /> MAINNET
        </span>
        <a href="#" className="btn">
          Baixar app
        </a>
      </div>
    </nav>
  )
}
