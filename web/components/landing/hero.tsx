import Image from "next/image"

import { GlossyOrangeButton } from "./glossy-orange-button"

export function Hero() {
  return (
    <section className="hero">
      <span className="sec-label">S:00</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="reveal">
        <div className="eyebrow">
          <span className="tag">v1</span>
          Demo Hackanation 2026 · Devnet
        </div>
      </div>

      <h1 className="reveal d1">
        Renda fixa do bairro.
        <span className="dim">Caixa pro comércio local.</span>
      </h1>

      <p className="hero-sub reveal d2">
        Financie recebíveis locais a partir de R$50. Prazo definido, rendimento
        claro, settlement em USDC.
      </p>

      <div className="hero-ctas reveal d3">
        <GlossyOrangeButton href="#">
          Baixar app Android
        </GlossyOrangeButton>
        <a href="#" className="btn btn-ghost">
          Ver demo
        </a>
      </div>

      <div className="hero-phone-wrap reveal d4">
        <Image
          className="hero-phone-img"
          src="/hero-phone.png"
          alt="Preview do app Kora"
          width={481}
          height={609}
          priority
        />
      </div>
    </section>
  )
}
