const FAQS = [
  {
    q: "O rendimento é garantido?",
    a: "Não. A Kora mostra rendimento potencial com base na operação, prazo e risco.",
  },
  {
    q: "O que a Kora financia?",
    a: "Recebíveis de pequenos negócios, como vendas a prazo ou valores a receber.",
  },
  {
    q: "Por que usar blockchain?",
    a: "Para tornar custódia, participação e distribuição mais transparentes e automáticas.",
  },
  {
    q: "Por que Solana?",
    a: "Porque ticket baixo depende de transação barata. Se a taxa come o rendimento, o modelo deixa de fazer sentido.",
  },
]

export function Faq() {
  return (
    <section className="section faq-section">
      <span className="sec-label">S:08 / FAQ</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">FAQ</div>
        <h2 className="sec-title">
          Perguntas difíceis,
          <span className="dim">respostas diretas.</span>
        </h2>
      </div>

      <div className="faq-list">
        {FAQS.map((item) => (
          <details key={item.q} className="faq-item">
            <summary>{item.q}</summary>
            <div className="faq-panel">
              <div>
                <p>{item.a}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
