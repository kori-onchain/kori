"use client"

import { useEffect, useRef, useState } from "react"

const STEPS = [
  {
    n: 1,
    eyebrow: "STEP 01",
    title: "Financie o comércio local.",
    titleDim: "A partir de R$ 50.",
    body: "Aporte em recebíveis de comércios reais. Rendimento acima do CDI, tudo auditável on-chain.",
    list: ["A partir de R$ 50", "~15% a.a. · 198% CDI", "Liquidez e custódia on-chain"],
    shot: "/app-screens/tela-de-investimento.png",
    alt: "Tela de investimentos do app Kori",
  },
  {
    n: 2,
    eyebrow: "STEP 02",
    title: "O lojista recebe hoje.",
    titleDim: "Não em 30 dias.",
    body: "O comércio antecipa os recebíveis e recebe o líquido na conta na hora — financiado pelo pool de investidores.",
    list: ["Antecipação em 1 toque", "Taxa a partir de 3% a.m.", "Líquido na conta na hora"],
    shot: "/app-screens/antecipacao.png",
    alt: "Tela de antecipação de recebíveis do app Kori",
  },
  {
    n: 3,
    eyebrow: "STEP 03",
    title: "Histórico vira taxa melhor.",
    titleDim: "Tudo no painel.",
    body: "Quanto melhor o score on-chain do lojista, menor a taxa de antecipação. Relatórios e saúde do negócio em tempo real.",
    list: ["Score on-chain", "Taxa cai com reputação", "Relatórios em tempo real"],
    shot: "/app-screens/receba-de-volta.png",
    alt: "Painel de relatórios e saúde do negócio do app Kori",
  },
] as const

export function ParallaxFeatures() {
  const [active, setActive] = useState(1)
  const sectionRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const phoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const idx = Number((entry.target as HTMLElement).dataset.step)
            if (idx) setActive(idx)
          }
        })
      },
      { threshold: [0.5], rootMargin: "-10% 0px -10% 0px" }
    )
    stepRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let raf: number | null = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const section = sectionRef.current
        const phone = phoneRef.current
        if (!section || !phone) {
          raf = null
          return
        }
        const rect = section.getBoundingClientRect()
        const progress = Math.max(
          0,
          Math.min(1, -rect.top / (rect.height - window.innerHeight))
        )
        const rotY = (progress - 0.5) * 6
        const transY = Math.sin(progress * Math.PI) * -12
        phone.style.transform = `translateY(${transY}px) rotateY(${rotY}deg)`
        raf = null
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section className="section parallax" ref={sectionRef}>
      <span className="sec-label">S:04 / COMO FUNCIONA</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="parallax-grid">
        <div className="parallax-phone">
          <div ref={phoneRef} className="parallax-shots" style={{ willChange: "transform" }}>
            {STEPS.map((step) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={step.n}
                src={step.shot}
                alt={step.alt}
                className={`parallax-shot${active === step.n ? " on" : ""}`}
                loading="lazy"
                draggable={false}
              />
            ))}
          </div>
        </div>

        <div className="parallax-content">
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className="parallax-step"
              data-step={step.n}
              ref={(el) => {
                stepRefs.current[i] = el
              }}
            >
              <span className="corner tr" />
              <span className="corner br" />
              <div className="step-num">{step.eyebrow}</div>
              <h3>
                {step.title}
                <span className="dim">{step.titleDim}</span>
              </h3>
              <p>{step.body}</p>
              <ul className="feature-list">
                {step.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
