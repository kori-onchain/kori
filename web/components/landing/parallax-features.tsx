"use client"

import { useEffect, useRef, useState } from "react"

import {
  BottomNav,
  PhoneFrame,
  ScreenInvestmentConfirm,
  ScreenInvestmentPortfolio,
  ScreenInvestmentStatus,
  ScreenYieldMarketplace,
} from "./phone-screens"

const STEPS = [
  {
    n: 1,
    eyebrow: "STEP 01",
    title: "Escolha.",
    titleDim: "Prazo, risco, potencial.",
    body: "Recebíveis de comércios reais. Tudo claro antes do aporte.",
    list: ["Recebíveis locais", "Risco antes de entrar", "Mínimo por contrato"],
  },
  {
    n: 2,
    eyebrow: "STEP 02",
    title: "Aporte R$50.",
    titleDim: "Sua cota fica on-chain.",
    body: "Você confirma no app. O programa na Solana registra a cota.",
    list: ["Aporte fracionado", "Cota registrada", "Liquidação em USDC"],
  },
  {
    n: 3,
    eyebrow: "STEP 03",
    title: "O lojista recebe.",
    titleDim: "Caixa no mesmo dia.",
    body: "O capital chega direto no comércio. Sem banco no meio.",
    list: ["Capital liberado", "Programa neutro", "Status em tempo real"],
  },
  {
    n: 4,
    eyebrow: "STEP 04",
    title: "Receba de volta.",
    titleDim: "Principal + rendimento.",
    body: "No vencimento, o contrato distribui o retorno. Automático.",
    list: ["Distribuição automática", "Taxa de fração de centavo", "Saldo na conta"],
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
          <div ref={phoneRef} style={{ willChange: "transform" }}>
            <PhoneFrame>
              <ScreenYieldMarketplace active={active === 1} dataScreen="1" />
              <ScreenInvestmentConfirm active={active === 2} dataScreen="2" />
              <ScreenInvestmentStatus active={active === 3} dataScreen="3" />
              <ScreenInvestmentPortfolio active={active === 4} dataScreen="4" />
              <BottomNav active="yield" />
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
