"use client"

import { useEffect } from "react"

// Reveal das seções da landing conforme a rolagem ("monta" os componentes).
// Não-invasivo: observa os filhos diretos do `.frame` em vez de exigir que
// cada seção saiba do efeito. Sem JS, nada fica escondido (as classes só são
// aplicadas aqui, no cliente).
export function LandingReveal() {
  useEffect(() => {
    const frame = document.querySelector<HTMLElement>(".landing .frame")
    if (!frame) return

    const targets = Array.from(frame.children).filter((el): el is HTMLElement => {
      if (!(el instanceof HTMLElement)) return false
      if (el.classList.contains("nav-bar")) return false
      // Seções com `position: sticky` por dentro (parallax) não podem receber
      // transform — quebraria o sticky. Mantém-se visível, já tem motion própria.
      if (el.querySelector(".parallax-phone")) return false
      return true
    })

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      targets.forEach((el) => el.classList.add("scroll-reveal", "is-revealed"))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed")
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    )

    const trigger = window.innerHeight * 0.9
    for (const el of targets) {
      el.classList.add("scroll-reveal")
      // Já visível no primeiro paint (acima da dobra): revela sem animar,
      // evitando qualquer flash do herói.
      if (el.getBoundingClientRect().top < trigger) {
        el.classList.add("is-revealed")
      } else {
        io.observe(el)
      }
    }

    return () => io.disconnect()
  }, [])

  return null
}
