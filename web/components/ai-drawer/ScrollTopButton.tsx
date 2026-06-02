"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"

export function ScrollTopButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Voltar ao topo"
      tabIndex={show ? 0 : -1}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border border-ds-line-2 bg-ds-bg-2 text-ds-dim shadow-lg shadow-black/40 transition-all duration-200 hover:bg-ds-elev hover:text-ds-ink",
        show
          ? "scale-100 opacity-100"
          : "pointer-events-none translate-y-1 scale-90 opacity-0",
      )}
    >
      <ArrowUp className="size-5" />
    </button>
  )
}
