"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

import { ACCOUNTS } from "./accounts"
import { DemoLedgerProvider } from "./ledger"
import { DemoPhone } from "./demo-phone"
import { DemoFlow } from "./demo-flow"
import "./demo.css"

export function DemoExperience() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"browse" | "flow">("browse")
  const [acc, setAcc] = useState<string>("investidor")
  const [tab, setTab] = useState(0)
  const [openCount, setOpenCount] = useState(0) // remonta o provider do modal (reset)

  const openModal = (id: string) => {
    setMode("browse")
    setAcc(id)
    setTab(0)
    setOpenCount((c) => c + 1)
    setOpen(true)
  }
  const openFlow = () => {
    setMode("flow")
    setOpenCount((c) => c + 1)
    setOpen(true)
  }
  const close = () => setOpen(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div className="dm-exp">
      {/* ── Hero: walkthrough em auto-play (o dinheiro circulando) ── */}
      <DemoLedgerProvider>
        <div className="dm-hero">
          <DemoFlow mode="auto" />
        </div>
      </DemoLedgerProvider>

      <div className="dm-hero-cta">
        <button type="button" className="dm-flow-cta" onClick={openFlow}>
          Rodar passo a passo
          <span className="hint">você controla cada clique, em tela cheia</span>
        </button>
      </div>

      {/* ── Showcase: explore cada conta por dentro ── */}
      <div className="dm-browse-label">ou explore cada conta por dentro</div>
      <DemoLedgerProvider>
        <div className="dm-row">
          {ACCOUNTS.map((a) => (
            <div className="dm-item" key={a.id}>
              <div className="dm-prev" onClick={() => openModal(a.id)} role="button" tabIndex={0}>
                <DemoPhone id={a.id} tab={0} />
              </div>
              <button className="dm-open" type="button" onClick={() => openModal(a.id)}>
                <span>Abrir demo</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </button>
              <div className="dm-lbl">
                Conta <b>{a.label}</b>
              </div>
            </div>
          ))}
        </div>
      </DemoLedgerProvider>

      {/* ── Modal (portal p/ document.body — escapa stacking da landing) ── */}
      {mounted &&
        createPortal(
          <div
            className={`dm-exp dm-modal${open ? " open" : ""}`}
            onClick={(e) => {
              if (e.target === e.currentTarget) close()
            }}
          >
            <button className="dm-close" type="button" onClick={close} aria-label="Fechar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {open ? (
              <DemoLedgerProvider key={openCount}>
                {mode === "flow" ? (
                  <DemoFlow mode="manual" onExit={() => setMode("browse")} />
                ) : (
                  <>
                    <div className="dm-holder">
                      <DemoPhone id={acc} tab={tab} interactive onTab={setTab} />
                    </div>
                    <div className="dm-switch">
                      {ACCOUNTS.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          className={a.id === acc ? "on" : ""}
                          onClick={() => {
                            setAcc(a.id)
                            setTab(0)
                          }}
                        >
                          <span className="d" />
                          {a.label}
                        </button>
                      ))}
                    </div>
                    <button type="button" className="dm-tip dm-tip-btn" onClick={() => setMode("flow")}>
                      ▶ Ver o dinheiro circulando entre as contas
                    </button>
                  </>
                )}
              </DemoLedgerProvider>
            ) : null}
          </div>,
          document.body,
        )}
    </div>
  )
}
