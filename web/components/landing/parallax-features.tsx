"use client"

import { useEffect, useRef, useState } from "react"

import {
  BottomNav,
  PhoneFrame,
  ScreenHome,
  ScreenScore,
  ScreenYield,
} from "./phone-screens"

const STEPS = [
  {
    n: 1,
    eyebrow: "SCORE 01",
    title: "Seu histórico vira reputação.",
    titleDim: "Pública, portátil, sua.",
    body: "Pagamentos e contratos cumpridos elevam seu Reputation Token. Sem bureau, sem score caixa-preta.",
    list: [
      "Reputation NFT mintado na sua carteira",
      "5 tiers (Bronze a Premium)",
      "Sobe com histórico real",
      "Base pra desbloquear limites e benefícios futuros",
    ],
  },
  {
    n: 2,
    eyebrow: "APP 02",
    title: "Conta self-custody.",
    titleDim: "Sem seed phrase no onboarding.",
    body: "Experiência de banco digital, base self-custody em Solana.",
    list: [
      "Onboarding em 30 segundos",
      "Transferência P2P em USDC",
      "Identidade onchain",
      "Controle na sua chave",
    ],
  },
  {
    n: 3,
    eyebrow: "YIELD 03",
    title: "Empreste pro comércio do bairro.",
    titleDim: "APR fixo, prazo definido.",
    body: "Você vê risco, retorno e prazo antes de investir. Settlement em USDC.",
    list: [
      "APR entre 13% e 22% a.a.",
      "Prazos de 30 a 90 dias",
      "Mínimo de R$50 por contrato",
      "Comércios verificados onchain",
    ],
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
      <span className="sec-label">S:06 / SCORE</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="parallax-grid">
        <div className="parallax-phone">
          <div ref={phoneRef} style={{ willChange: "transform" }}>
            <PhoneFrame>
              <ScreenHome active={active === 1} dataScreen="1" />
              <ScreenScore active={active === 2} dataScreen="2" />
              <ScreenYield active={active === 3} dataScreen="3" />
              <BottomNav />
            </PhoneFrame>
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
