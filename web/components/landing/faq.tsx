const FAQS = [
  {
    q: "O que a Kora financia?",
    a: "Recebíveis de comércios locais: dinheiro que o comércio tem para receber no futuro e quer antecipar hoje.",
  },
  {
    q: "Por que Solana importa aqui?",
    a: "Porque fracionar uma fatura em vários tickets pequenos gera muitas microtransações. Com taxa alta, o modelo perde sentido.",
  },
  {
    q: "O que já está na demo?",
    a: "Conta self-custody, vitrine de yield, P2P em USDC e Reputation Token. Cartão, BNPL, ingressos e lounges ficam como roadmap.",
  },
  {
    q: "Os comércios da vitrine são reais?",
    a: "Nesta landing, Padaria Central, Mercado Verde e Bistrô Lisboa são exemplos de demo.",
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
          Sem enrolar.
          <span className="dim">O que o jurado vai perguntar.</span>
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
