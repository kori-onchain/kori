const STEPS = [
  {
    num: "01",
    title: "Comércio antecipa",
    body: "Uma fatura a receber entra na vitrine com desconto.",
  },
  {
    num: "02",
    title: "Você financia",
    body: "Você escolhe risco, prazo e retorno antes de entrar.",
  },
  {
    num: "03",
    title: "Todos recebem",
    body: "No pagamento final, o contrato distribui principal e rendimento.",
  },
]

export function HowItWorks() {
  return (
    <section className="section">
      <span className="sec-label">S:02 / COMO FUNCIONA</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">Como funciona</div>
        <h2 className="sec-title">
          Do recebível ao rendimento,
          <span className="dim">em 3 passos.</span>
        </h2>
      </div>

      <div className="features">
        {STEPS.map((step) => (
          <div key={step.num} className="feat">
            <div className="feat-head">
              <span className="feat-num">{step.num}</span>
            </div>
            <h3 className="feat-title">{step.title}</h3>
            <p className="feat-body">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
