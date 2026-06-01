import { Play } from "lucide-react"

import { ScreenHeroHome, ScreenHome, PhoneFrame } from "./phone-screens"
import { ScreenLojaHome } from "@/components/demo/loja-screens"
import { GlossyOrangeButton } from "./glossy-orange-button"

export function DemoSection() {
  return (
    <section className="section demo-cta">
      <span className="sec-label">S:05 / DEMO</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="demo-cta-inner">
        <div className="reveal eyebrow">
          <span className="tag">ao vivo</span>
          Demo interativa
        </div>

        <h2 className="reveal d1">
          O sistema inteiro,
          <span className="dim">numa tela só.</span>
        </h2>

        <p className="reveal d2">
          Três contas reais — investidor, pessoa e loja — pré-logadas e
          navegáveis. Abra e explore cada fluxo como se já estivesse com o app na
          mão.
        </p>

        <div className="reveal d2 demo-cta-stats">
          <div className="dcs">
            <span className="n">3</span>
            <span className="l">contas pré-logadas</span>
          </div>
          <span className="dcs-sep" />
          <div className="dcs">
            <span className="n">13</span>
            <span className="l">telas navegáveis</span>
          </div>
          <span className="dcs-sep" />
          <div className="dcs">
            <span className="n">∞</span>
            <span className="l">notificações ao vivo</span>
          </div>
        </div>

        <div className="reveal d3 demo-cta-actions">
          <GlossyOrangeButton href="/demo" icon={<Play />}>
            Abrir demo interativo
          </GlossyOrangeButton>
        </div>

        <div className="reveal d3 demo-cta-phones" aria-hidden="true">
          <div className="dcp dcp-1">
            <PhoneFrame>
              <ScreenHome active />
            </PhoneFrame>
          </div>
          <div className="dcp dcp-2">
            <PhoneFrame>
              <ScreenHeroHome active />
            </PhoneFrame>
          </div>
          <div className="dcp dcp-3">
            <PhoneFrame>
              <ScreenLojaHome active />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  )
}
