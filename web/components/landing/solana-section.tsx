const COMPARISON = [
  {
    title: "Chain cara",
    lines: ["R$3 de rendimento", "R$2 de taxa", "Modelo quebra"],
  },
  {
    title: "Solana",
    lines: ["R$3 de rendimento", "fração de centavo em taxa", "Ticket baixo viável"],
  },
]

export function SolanaSection() {
  return (
    <section className="section">
      <span className="sec-label">S:05 / SOLANA</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">Por que Solana</div>
        <h2 className="sec-title">
          O ticket de R$50
          <span className="dim">só fecha na Solana.</span>
        </h2>
        <p className="section-intro">
          Muitas pessoas investindo pouco geram muitas transações pequenas. Em
          redes caras, a taxa come o rendimento. Na Solana, a operação continua
          viável.
        </p>
      </div>

      <div className="solana-compare">
        {COMPARISON.map((item, index) => (
          <div key={item.title} className={`solana-panel ${index === 1 ? "is-solana" : ""}`}>
            <div className="solana-panel-head">
              <span>{index === 0 ? "A" : "B"}</span>
              {index === 1 ? (
                <svg className="solana-mark" aria-hidden="true">
                  <use href="#solana" />
                </svg>
              ) : null}
            </div>
            <h3>{item.title}</h3>
            <ul>
              {item.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
        <div className="solana-vs" aria-hidden="true">
          vs
        </div>
      </div>
    </section>
  )
}
