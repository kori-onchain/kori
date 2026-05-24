const FEATS = [
  {
    num: "01",
    title: "Ticket baixo",
    body: "Acesso a partir de R$50, não R$25 mil.",
  },
  {
    num: "02",
    title: "Rendimento real",
    body: "Vem de antecipação de recebíveis, não de tokenomics.",
  },
  {
    num: "03",
    title: "Custo menor",
    body: "Sem estrutura bancária pesada no meio da operação.",
  },
  {
    num: "04",
    title: "Transparência",
    body: "Regras de custódia e distribuição ficam no contrato.",
  },
]

export function Capabilities() {
  return (
    <section className="section">
      <span className="sec-label">S:04 / DIFERENCIAIS</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">Por que é diferente</div>
        <h2 className="sec-title">
          Pequenos aportes,
          <span className="dim">financiamento real.</span>
        </h2>
        <p className="section-intro">
          A Kora conecta saldo parado com capital de giro local, sem depender de
          ticket alto ou de uma camada bancária pesada.
        </p>
      </div>

      <div className="features features-four">
        {FEATS.map((f) => (
          <div key={f.num} className="feat">
            <div className="feat-head">
              <span className="feat-num">{f.num}</span>
            </div>
            <h3 className="feat-title">{f.title}</h3>
            <p className="feat-body">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
