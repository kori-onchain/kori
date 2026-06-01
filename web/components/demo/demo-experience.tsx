"use client"

import { useEffect, useState } from "react"

import { ACCOUNTS } from "./accounts"
import { DemoPhone } from "./demo-phone"
import "./demo.css"

export function DemoExperience() {
  const [open, setOpen] = useState(false)
  const [acc, setAcc] = useState<string>("investidor")
  const [tab, setTab] = useState(0)

  const openModal = (id: string) => {
    setAcc(id)
    setTab(0)
    setOpen(true)
  }
  const close = () => setOpen(false)

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

      <div
        className={`dm-modal${open ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        <button className="dm-close" type="button" onClick={close} aria-label="Fechar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <div className="dm-holder">
          {open ? <DemoPhone id={acc} tab={tab} interactive onTab={setTab} /> : null}
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
        <div className="dm-tip">Toque na barra inferior para navegar pelo app</div>
      </div>
    </div>
  )
}
