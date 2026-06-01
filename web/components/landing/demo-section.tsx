import { DemoExperience } from "@/components/demo/demo-experience"

export function DemoSection() {
  return (
    <section className="section demo-cta">
      <span className="sec-label">S:05 / DEMO</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="demo-cta-inner">
        <div className="reveal eyebrow">
          <span className="tag">ao vivo</span>
          Demonstração interativa
        </div>

        <h2 className="reveal d1">
          Entre e
          <span className="dim">experimente.</span>
        </h2>

        <p className="reveal d2">
          Três contas, um só app. Abra um perfil e use o Kori por dentro —
          investidor, pessoa e loja — navegando pelas telas como no celular.
        </p>

        <div className="demo-cta-stage">
          <DemoExperience />
        </div>
      </div>
    </section>
  )
}
