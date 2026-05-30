export function LightSection() {
  return (
    <section className="section light-section">
      <span className="sec-label">S:05 / PRODUTO</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="ls-eyebrow">
        <span className="tag">Devnet</span>
        Web3 invisível
      </div>

      <h2>
        Toda a complexidade Web3,
        <span className="dim">atrás de um toque.</span>
      </h2>

      <p className="ls-sub">
        Carteira, chaves e taxas de rede ficam nos bastidores. Você só clica em
        Pagar, Receber ou Investir.
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
