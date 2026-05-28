const ROADMAP = [
  {
    num: "Hoje",
    title: "Fundo coletivo + conta digital base",
    body: "Recebíveis locais, carteira em stablecoin, pagamentos e portfolio do investidor.",
  },
  {
    num: "Depois",
    title: "Score onchain e BNPL",
    body: "Histórico de uso virando reputação portátil para limites e crédito futuro.",
  },
  {
    num: "Visão",
    title: "Ecossistema financeiro onchain para a economia local",
    body: "Cartão, pagamentos expandidos e benefícios em cima da mesma conta Kori.",
  },
]

export function Roadmap() {
  return (
    <section className="section">
      <span className="sec-label">S:07 / ROADMAP</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">Roadmap</div>
        <h2 className="sec-title">
          Foco agora.
          <span className="dim">Visão grande depois.</span>
        </h2>
        <p className="section-intro">
          O MVP vende uma coisa só: pequenos aportes financiam recebíveis
          locais. Cartão, BNPL e score entram como evolução natural.
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
