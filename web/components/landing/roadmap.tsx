const ROADMAP = [
  {
    num: "Hoje",
    title: "Transferência e antecipação on-chain",
    body: "Pagamento e factoring funcionando ponta a ponta na Solana.",
  },
  {
    num: "Depois",
    title: "BNPL e score on-chain",
    body: "Crédito com pool e escrow (em finalização) + reputação portátil.",
  },
  {
    num: "Visão",
    title: "Ecossistema financeiro completo",
    body: "Cartão real, Pix on/off-ramp e mais — sobre a mesma conta Kori.",
  },
]

export function Roadmap() {
  return (
    <section className="section">
      <span className="sec-label">S:08 / ROADMAP</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">Roadmap</div>
        <h2 className="sec-title">
          Foco agora.
          <span className="dim">Visão grande depois.</span>
        </h2>
        <p className="section-intro">
          O MVP entrega transferência e antecipação on-chain. BNPL, score e
          cartão entram como evolução natural.
        </p>
      </div>

      <div className="features">
        {ROADMAP.map((item, index) => (
          <div key={item.num} className="feat">
            <div className="feat-head">
              <span className="feat-num">0{index + 1}</span>
            </div>
            <h3 className="feat-title">{item.num}</h3>
            <p className="feat-body">
              <strong>{item.title}</strong>
              <br />
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
