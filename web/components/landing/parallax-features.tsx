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
    eyebrow: "FEATURE 01",
    title: "Tudo numa chave só.",
    titleDim: "Sem 12 abas abertas.",
    body: "Saldo em BRL, USDC, cashback do cartão, NFTs de evento, stake. Um app, uma seed, zero intermediários.",
    list: [
      "BRL e USDC nativos",
      "Cartão Black com cashback em USDC",
      "NFT holdings (founder, ingressos)",
      "Transações em tempo real na Solana",
    ],
  },
  {
    n: 2,
    eyebrow: "FEATURE 02",
    title: "Seu score vira NFT.",
    titleDim: "Público, portável, seu.",
    body: "Cada pagamento em dia, stake ativo e holding antigo eleva seu Reputation Token. Verificável em qualquer dapp Solana.",
    list: [
      "Reputation NFT mintado na carteira",
      "5 tiers (Bronze a Premium)",
      "Desbloqueia VIP lounges e limites",
      "Sem bureau, sem score caixa-preta",
    ],
  },
  {
    n: 3,
    eyebrow: "FEATURE 03",
    title: "Renda fixa do bloco.",
    titleDim: "APR fixo, prazo definido.",
    body: "Empreste pra padaria, mercado ou bar do bairro antecipando recebíveis. Settlement em USDC.",
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
      <span className="sec-label">S:01 / FEATURES</span>
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
