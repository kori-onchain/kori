export function ProblemSection() {
  return (
    <section className="section">
      <span className="sec-label">S:01 / PROBLEMA</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">O problema</div>
        <h2 className="sec-title">
          A tela ficou simples.
          <span className="dim">O dinheiro continuou caro.</span>
        </h2>
        <p className="section-intro">
          Por trás de cada pagamento ainda existe uma fila de intermediários.
          Cada camada segura prazo, cobra spread e repassa a conta.
        </p>
      </div>

      <div className="problem-split">
        <div className="problem-flow" aria-label="Camadas do sistema atual">
          <div className="problem-flow-head">
            <span>Venda de R$ 100</span>
            <b>D+30</b>
          </div>
          {[
            ["Adquirente", "-2,2%"],
            ["Bandeira", "-0,8%"],
            ["Emissor", "-1,4%"],
            ["Antecipação", "-3,0%"],
          ].map(([layer, fee]) => (
            <div key={layer} className="problem-layer">
              <span>{layer}</span>
              <b>{fee}</b>
            </div>
          ))}
          <div className="problem-flow-total">
            <span>Lojista recebe hoje</span>
            <strong>R$ 92,60</strong>
          </div>
        </div>

        <div className="problem-grid">
          <div className="problem-card">
            <span className="problem-label">Consumidor</span>
            <p>
              <b>8% a 15% a.m.</b>
              <span> para acessar crédito.</span>
            </p>
          </div>
          <div className="problem-card">
            <span className="problem-label">Lojista</span>
            <p>
              <b>2% a 5%</b>
              <span> por venda e até 30 dias para receber.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
