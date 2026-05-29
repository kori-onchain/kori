const FAQS = [
  {
    q: "O Kori é um banco?",
    a: "Não. É a ponte entre capital global e economia local — um ecossistema financeiro com Web3 invisível.",
  },
  {
    q: "Preciso entender de cripto?",
    a: "Não. Carteira, chaves e taxas de rede ficam nos bastidores. Você só usa o app.",
  },
  {
    q: "O rendimento é garantido?",
    a: "Não. É potencial e varia por operação, prazo e risco.",
  },
  {
    q: "E a regulação?",
    a: "Operamos com parceiros regulados (BaaS e RWA). O MVP roda em Devnet e o Pix está mockado nesta fase.",
  },
  {
    q: "Por que Solana?",
    a: "Ticket baixo só fecha com taxa barata. E tudo fica auditável on-chain.",
  },
]

export function Faq() {
  return (
    <section className="section faq-section">
      <span className="sec-label">S:09 / FAQ</span>
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
