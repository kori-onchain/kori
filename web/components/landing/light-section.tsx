export function LightSection() {
  return (
    <section className="section light-section">
      <span className="sec-label">S:03 / PRODUTO</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="ls-eyebrow">
        <span className="tag">Devnet</span>
        Conta digital + recebíveis locais
      </div>

      <h2>
        Uma conta onde o dinheiro
        <span className="dim">não fica parado.</span>
      </h2>

      <p className="ls-sub">
        Saldo em stablecoin, oportunidades de recebíveis locais e pagamentos
        instantâneos em uma experiência simples de conta digital.
      </p>

      <div className="ls-ctas">
        <a href="#" className="btn-dark">
          Ver oportunidades →
        </a>
        <a href="#" className="btn-light">
          Entender a tecnologia
        </a>
      </div>

      <div className="product-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/preview-home.png" alt="Kori app preview" />
      </div>
    </section>
  )
}
