export function LightSection() {
  return (
    <section className="section light-section">
      <span className="sec-label">S:04 / ONCHAIN BRL</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="ls-eyebrow">
        <span className="tag">BRL</span>
        Real digital, settled on Solana
      </div>

      <h2>
        Seu real, agora onchain.
        <span className="dim">Sem perder o controle.</span>
      </h2>

      <p className="ls-sub">
        Gaste em BRL, guarde em USDC, renda em yield. O cartão Kora converte na hora, sem IOF
        escondido, sem spread surpresa.
      </p>

      <div className="ls-ctas">
        <a href="#" className="btn-dark">
          Pedir meu cartão →
        </a>
        <a href="#" className="btn-light">
          Como funciona
        </a>
      </div>

      <div className="product-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://placehold.co/720x460/ececff/9a9a9e?text=Kora+Product+Hero"
          alt="Kora product hero"
        />
      </div>
    </section>
  )
}
