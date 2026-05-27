const STEPS = [
  {
    step: "01",
    name: "Você investe",
    detail: "Escolhe uma oportunidade e confirma o aporte.",
    meta: "app",
    active: true,
  },
  {
    step: "02",
    name: "Contrato registra",
    detail: "Sua participação vira uma cota/token de participação.",
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
    detail: "O pagamento retorna ao contrato.",
    meta: "USDC",
  },
  {
    step: "05",
    name: "Rendimento distribui",
    detail: "Principal e rendimento são enviados proporcionalmente.",
    meta: "split",
  },
]

const NODES = [
  {
    id: "app",
    title: "KORI App",
    sub: "intent + assinatura",
    position: "node-app",
  },
  {
    id: "score",
    title: "Risk Rules",
    sub: "prazo, risco, elegibilidade",
    position: "node-score",
  },
  {
    id: "program",
    title: "Solana Program",
    sub: "cotas + escrow",
    position: "node-program",
    featured: true,
  },
  {
    id: "usdc",
    title: "USDC Settlement",
    sub: "split + liquidação",
    position: "node-usdc",
  },
  {
    id: "rep",
    title: "Investor Share",
    sub: "participação da operação",
    position: "node-rep",
  },
]

export function Architecture() {
  return (
    <section className="section">
      <span className="sec-label">S:06 / ARQUITETURA</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">Do aporte ao settlement</div>
        <h2 className="sec-title">
          Como a operação flui.
          <span className="dim">Do R$50 ao retorno proporcional.</span>
        </h2>
      </div>

      <div className="arch">
        <div className="arch-list" aria-label="Fluxo da transação">
          {STEPS.map((s) => (
            <article key={s.step} className={s.active ? "active" : ""}>
              <span className="step-index">{s.step}</span>
              <div className="step-copy">
                <div className="step-top">
                  <span className="name">{s.name}</span>
                  <span className="meta">{s.meta}</span>
                </div>
                <p>{s.detail}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="arch-canvas">
          <div className="arch-canvas-head">
            <span>Runtime map</span>
            <b>Receivable settlement path</b>
          </div>

          <div className="arch-map" aria-label="Diagrama da arquitetura Kori">
            <span className="flow-line line-app-program" />
            <span className="flow-line line-score-program" />
            <span className="flow-line line-program-usdc" />
            <span className="flow-line line-program-rep" />

            {NODES.map((node) => (
              <div
                className={`arch-node ${node.position} ${node.featured ? "featured" : ""}`}
                key={node.id}
              >
                <span className="node-kicker">{node.id}</span>
                <strong>{node.title}</strong>
                <span>{node.sub}</span>
              </div>
            ))}
          </div>

          <div className="arch-payloads">
            <div>
              <span>payload</span>
              <b>amount, receiver, nonce</b>
            </div>
            <div>
              <span>settlement</span>
              <b>USDC + investor split</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
