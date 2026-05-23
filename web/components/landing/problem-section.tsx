export function ProblemSection() {
  return (
    <section className="section">
      <span className="sec-label">S:01 / PROBLEMA</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">O problema</div>
        <h2 className="sec-title">
          Dois lados,
          <span className="dim">o mesmo intermediário caro.</span>
        </h2>
      </div>

      <div className="problem-grid">
        <div className="problem-card">
          <span className="problem-label">A padaria</span>
          <p>
            Vendeu a prazo. Recebe depois. Precisa de caixa agora. No banco,
            antecipar custa caro.
          </p>
        </div>
        <div className="problem-card">
          <span className="problem-label">Você</span>
          <p>
            Tem dinheiro parado. Quer rendimento melhor, mas os produtos bons
            não foram feitos pra ticket pequeno.
          </p>
        </div>
      </div>
    </section>
  )
}
