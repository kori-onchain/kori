"use client"

import { useEffect, useRef } from "react"

import { DemoPhone } from "@/components/demo/demo-phone"
import { PERSONAS } from "@/components/demo/demo-personas"

export function DemoStage() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in")
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.2 },
    )
    root.querySelectorAll(".demo-reveal").forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="demo-grid" ref={ref}>
      {PERSONAS.map((persona, i) => (
        <div key={persona.id} className={`demo-reveal d${i + 1}`}>
          <DemoPhone persona={persona} />
        </div>
      ))}
    </div>
  )
}
