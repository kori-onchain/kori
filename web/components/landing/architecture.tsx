const STEPS = [
  {
    step: "01",
    name: "Intent",
    detail: "Usuário escolhe valor, destino e tipo de operação.",
    meta: "mobile",
    active: true,
  },
  {
    step: "02",
    name: "Risk check",
    detail: "Score e regras da conta validam limite, reputação e wallet.",
    meta: "offchain + onchain",
  },
  {
    step: "03",
    name: "Transaction",
    detail: "App assina e envia a instrução para Solana Devnet.",
    meta: "solana",
  },
  {
    step: "04",
    name: "Settlement",
    detail: "USDC liquida a operação e atualiza os saldos.",
    meta: "atomic",
  },
  {
    step: "05",
    name: "Reputation",
    detail: "Histórico entra no Reputation Token para próximos limites.",
    meta: "profile",
  },
]

const NODES = [
  {
    id: "app",
    title: "Kora App",
    sub: "intent + assinatura",
    position: "node-app",
  },
  {
    id: "score",
    title: "Score Engine",
    sub: "risco, limite, reputação",
    position: "node-score",
  },
  {
    id: "program",
    title: "Solana Program",
    sub: "instruções + escrow",
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
    title: "Reputation Token",
    sub: "histórico portátil",
    position: "node-rep",
  },
]

export function Architecture() {
  return (
    <section className="section">
      <span className="sec-label">S:06 / ARCHITECTURE</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">Architecture</div>
        <h2 className="sec-title">
          Como uma transação flui.
          <span className="dim">Do tap ao settlement em Devnet.</span>
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
            <b>Devnet transaction path</b>
          </div>

          <div className="arch-map" aria-label="Diagrama da arquitetura Kora">
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
              <b>USDC + reputation update</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
