import { ThemeToggle } from "@/components/landing/theme-toggle"

const links = [
  { label: "App", href: "#" },
  { label: "Yield", href: "#" },
  { label: "Score", href: "#" },
  { label: "Cartão", href: "#" },
  { label: "Docs", href: "#" },
]

export function SiteNav() {
  return (
    <nav className="nav-bar">
      <div className="nav-brand">
        <svg className="k">
          <use href="#kori-k" />
        </svg>
        <span className="word">KORI</span>
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
          <span className="dot" /> DEVNET · Hackanation 2026
        </span>
        <ThemeToggle />
        <a href="#" className="nav-social" aria-label="GitHub">
          <svg aria-hidden="true" viewBox="0 0 24 24" role="img">
            <path
              fill="currentColor"
              d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C18 5.5 19 5.8 19 5.8c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.1c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z"
            />
          </svg>
        </a>
        <a href="#" className="nav-social" aria-label="YouTube">
          <svg aria-hidden="true" viewBox="0 0 24 24" role="img">
            <path
              fill="currentColor"
              d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z"
            />
          </svg>
        </a>
      </div>
    </nav>
  )
}
