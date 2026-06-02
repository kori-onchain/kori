"use client"

import { useEffect } from "react"

// Extensões não-padrão do navigator (suporte parcial entre browsers).
type NavigatorExt = Navigator & {
  connection?: { effectiveType?: string }
  deviceMemory?: number
  userAgentData?: { platform?: string }
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "ref",
]

const SESSION_KEY = "kori-tracked"

/**
 * Coleta detalhes do visitante e envia uma vez por sessão para /api/track,
 * que enriquece com IP/geo e dispara o webhook do Discord no servidor.
 * Não renderiza nada.
 */
export function VisitorTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return
      sessionStorage.setItem(SESSION_KEY, "1")
    } catch {
      // sessionStorage indisponível (modo privado) → segue e envia mesmo assim
    }

    const nav = navigator as NavigatorExt
    const url = new URL(window.location.href)

    const utm: Record<string, string> = {}
    for (const k of UTM_KEYS) {
      const v = url.searchParams.get(k)
      if (v) utm[k] = v
    }

    const mm = (q: string) =>
      typeof window.matchMedia === "function" ? window.matchMedia(q).matches : undefined

    const payload = {
      path: url.pathname,
      url: url.href,
      referrer: document.referrer || undefined,
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages ? Array.from(navigator.languages) : undefined,
      screen: `${window.screen.width}×${window.screen.height}`,
      viewport: `${window.innerWidth}×${window.innerHeight}`,
      dpr: window.devicePixelRatio,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      platform: nav.userAgentData?.platform || navigator.platform,
      utm: Object.keys(utm).length ? utm : undefined,
      connection: nav.connection?.effectiveType,
      cores: navigator.hardwareConcurrency,
      memory: nav.deviceMemory,
      darkMode: mm("(prefers-color-scheme: dark)"),
      reducedMotion: mm("(prefers-reduced-motion: reduce)"),
    }

    const body = JSON.stringify(payload)

    // sendBeacon não bloqueia a navegação; fetch keepalive é o fallback.
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/track",
          new Blob([body], { type: "application/json" }),
        )
        return
      }
    } catch {
      // cai no fetch
    }
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {})
  }, [])

  return null
}
