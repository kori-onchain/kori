export function ProblemSection() {
  return (
    <section className="section">
      <span className="sec-label">S:01 / PROBLEMA</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">O problema</div>
        <h2 className="sec-title">
          O problema não é a tela.
          <span className="dim">É a estrutura por trás dela.</span>
        </h2>
        <p className="section-intro">
          A tela melhorou. A estrutura por trás não: adquirente, bandeira,
          emissor, câmara. Cada camada cobra a sua parte.
        </p>
      </div>

      <div className="problem-grid">
        <div className="problem-card">
          <span className="problem-label">Para o consumidor</span>
          <p>
            <b>8% a 15% ao mês</b> só pra acessar crédito.
          </p>
        </div>
        <div className="problem-card">
          <span className="problem-label">Para o lojista</span>
          <p>
            Perde <b>2% a 5%</b> por venda e espera <b>30 dias</b> pra receber.
          </p>
        </div>
      </div>
    </section>
  )
}
