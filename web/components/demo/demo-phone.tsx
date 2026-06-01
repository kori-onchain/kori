"use client"

import { useEffect, useState } from "react"
import type { CSSProperties } from "react"
import { Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PhoneFrame } from "@/components/landing/phone-screens"
import { DemoNav } from "@/components/demo/demo-nav"
import { NotificationLayer, usePhoneNotifications } from "@/components/demo/phone-notifications"
import type { Persona } from "@/components/demo/demo-personas"

export function DemoPhone({ persona }: { persona: Persona }) {
  const [tab, setTab] = useState(persona.defaultTab)
  const [started, setStarted] = useState(false)
  const { toasts, push } = usePhoneNotifications()

  useEffect(() => {
    if (!started) return
    return persona.schedule?.(push)
  }, [started, persona, push])

  const handleSelect = (next: string) => {
    setTab(next)
    persona.onTab?.(next, push)
  }

  const handleStart = () => {
    setStarted(true)
    push({ icon: "i-check", tone: "in", title: "Sessão iniciada", body: persona.caption })
  }

  const activeLabel = persona.nav.find((n) => n.tab === tab)?.label ?? ""

  return (
    <div className="demo-unit" style={{ "--accent": persona.accent } as CSSProperties}>
      <div className="demo-device">
        <PhoneFrame>
          {persona.screens.map(({ tab: t, Component }) => (
            <Component key={t} active={tab === t} />
          ))}
          <NotificationLayer toasts={toasts} />
          <DemoNav items={persona.nav} active={tab} onSelect={handleSelect} />

          {!started ? (
            <div className="demo-cover">
              <div className="demo-cover-card soft-card">
                <span className="demo-cover-icon">
                  <persona.Icon />
                </span>
                <span className="demo-cover-kicker">Experiência</span>
                <span className="demo-cover-name">{persona.label}</span>
                <span className="demo-cover-desc">{persona.caption}</span>
                <Button
                  type="button"
                  onClick={handleStart}
                  className="demo-cover-btn h-auto gap-1.5 rounded-[11px] border-0 bg-ds-ink px-5 py-2.5 text-[13px] font-semibold text-ds-bg shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_12px_-6px_rgba(0,0,0,0.45)]"
                >
                  <Play />
                  Começar experiência
                </Button>
              </div>
            </div>
          ) : null}
        </PhoneFrame>
      </div>

      <div className="demo-id soft-card-sm">
        <persona.Icon className="demo-id-icon" />
        <span className="demo-id-name">{persona.label}</span>
        <span className="demo-id-sep">/</span>
        <span className="demo-id-screen">{started ? activeLabel : "em espera"}</span>
      </div>
      <span className="demo-id-caption">{persona.caption}</span>
    </div>
  )
}
