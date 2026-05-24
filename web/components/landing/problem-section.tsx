export function ProblemSection() {
  return (
    <section className="section">
      <span className="sec-label">S:01 / PROBLEMA</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">O problema</div>
        <h2 className="sec-title">
          O banco cobra caro
          <span className="dim">dos dois lados.</span>
        </h2>
      </div>

      <div className="problem-grid">
        <div className="problem-card">
          <span className="problem-label">Para o comércio</span>
          <p>
            Vendeu a prazo, mas precisa de caixa hoje. Antecipar no banco custa
            caro ou nem chega.
          </p>
        </div>
        <div className="problem-card">
          <span className="problem-label">Para você</span>
          <p>
            Seu dinheiro fica parado rendendo pouco. Produtos melhores exigem
            ticket alto e burocracia.
          </p>
        </div>
      </div>
    </section>
  )
}
