const FEATS = [
  {
    num: "01",
    title: "Open-loop",
    body: "Você é dono das chaves. O rendimento vai pro seu bolso, não pro intermediário.",
  },
  {
    num: "02",
    title: "Global → local",
    body: "USDC captado lá fora financia crédito brasileiro aqui.",
  },
  {
    num: "03",
    title: "Web3 invisível",
    body: "A cripto roda nos bastidores. O usuário comum nunca vê.",
  },
  {
    num: "04",
    title: "Sem intermediários",
    body: "Liquidação on-chain corta as camadas entre quem precisa e quem fornece.",
  },
]

export function Capabilities() {
  return (
    <section className="section">
      <span className="sec-label">S:06 / DIFERENCIAIS</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">Por que é diferente</div>
        <h2 className="sec-title">
          Estrutural,
          <span className="dim">não cosmético.</span>
        </h2>
        <p className="section-intro">
          A diferença não está na tela. Está em cortar os intermediários e ligar
          capital global direto à economia local.
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
