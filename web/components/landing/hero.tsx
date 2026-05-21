import { BottomNav, PhoneFrame, ScreenHeroHome } from "./phone-screens"

export function Hero() {
  return (
    <section className="hero">
      <span className="sec-label">S:00</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="reveal">
        <div className="eyebrow">
          <span className="tag">v1.1</span>
          Beta aberto · 4.200 founders
        </div>
      </div>

      <h1 className="reveal d1">
        Banking pra
        <span className="dim">quem é self-custody.</span>
      </h1>

      <p className="hero-sub reveal d2">
        Cartão Black, yield no comércio local, ingresso virando NFT, score onchain. Tudo na sua
        chave. Settled on Solana.
      </p>

      <div className="hero-ctas reveal d3">
        <a href="#" className="btn">
          Baixar app →
        </a>
        <a href="#" className="btn btn-ghost">
          Ver demo
        </a>
      </div>

      <div className="hero-phone-wrap reveal d4">
        <PhoneFrame>
          <ScreenHeroHome />
          <BottomNav active="home" />
        </PhoneFrame>
      </div>
    </section>
  )
}
