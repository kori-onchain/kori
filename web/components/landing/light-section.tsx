export function LightSection() {
  return (
    <section className="section light-section">
      <span className="sec-label">S:04 / ONCHAIN BRL</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="ls-eyebrow">
        <span className="tag">Devnet</span>
        Yield local, settled on Solana
      </div>

      <h2>
        Capital local.
        <span className="dim">Settlement onchain.</span>
      </h2>

      <p className="ls-sub">
        Conta self-custody, marketplace de recebíveis e transferências P2P em
        USDC rodando como demonstração em Solana Devnet.
      </p>

      <div className="ls-ctas">
        <a href="#" className="btn-dark">
          Baixar pra Android →
        </a>
        <a href="#" className="btn-light">
          Como funciona
        </a>
      </div>

      <div className="product-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/preview-home.png" alt="Kora app preview" />
      </div>
    </section>
  )
}
