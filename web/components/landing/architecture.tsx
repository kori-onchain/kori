const STEPS = [
  {
    step: "01",
    name: "Você investe",
    detail: "Escolhe uma oportunidade e confirma o aporte no app.",
    meta: "app",
  },
  {
    step: "02",
    name: "Contrato registra",
    detail: "Sua participação vira uma cota tokenizada da operação.",
    meta: "program",
  },
  {
    step: "03",
    name: "Comércio recebe",
    detail: "O capital é liberado para antecipar o recebível.",
    meta: "escrow",
  },
  {
    step: "04",
    name: "Recebível liquida",
    detail: "O pagamento do sacado retorna ao contrato em USDC.",
    meta: "USDC",
  },
  {
    step: "05",
    name: "Rendimento distribui",
    detail: "Principal e rendimento voltam proporcionalmente a você.",
    meta: "split",
  },
]

export function Architecture() {
  return (
    <section className="section">
      <span className="sec-label">S:07 / ARQUITETURA</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">Do aporte ao settlement</div>
        <h2 className="sec-title">
          Como a operação flui.
          <span className="dim">Do R$50 ao retorno proporcional.</span>
        </h2>
      </div>

      <div className="flow" aria-label="Fluxo da operação, do aporte ao settlement">
        {STEPS.map((s) => (
          <div key={s.step} className="flow-step">
            <div className="flow-head">
              <span className="flow-num">{s.step}</span>
              <span className="flow-meta">{s.meta}</span>
            </div>
            <h3 className="flow-name">{s.name}</h3>
            <p className="flow-detail">{s.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
