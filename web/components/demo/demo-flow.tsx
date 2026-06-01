"use client"

import { useCallback, useEffect, useState } from "react"

import { DemoPhone } from "./demo-phone"
import {
  DEMO_CHARGE,
  DEMO_INSTALLMENTS,
  DEMO_INVEST,
  DEMO_PRODUCT,
  fmt,
  investimentoTotal,
  shortHash,
  solscan,
  useDemoLedger,
} from "./ledger"

type Acc = "investidor" | "loja" | "pessoa"

interface Step {
  acc: Acc
  tab: number
  cta: string
  instr: string
  run: (l: ReturnType<typeof useDemoLedger>) => void
}

const STEPS: Step[] = [
  {
    acc: "investidor",
    tab: 0,
    cta: `Investir ${fmt(DEMO_INVEST)} no pool`,
    instr: "Ana aporta no pool do Kori. O saldo dela sai da conta e vira posição no fundo.",
    run: (l) => l.invest(DEMO_INVEST),
  },
  {
    acc: "loja",
    tab: 0,
    cta: `Cobrar Ana — ${fmt(DEMO_CHARGE)} em ${DEMO_INSTALLMENTS}x`,
    instr: "A Loja Aurora cobra a Ana no crédito. Entra na fatura dela e gera recebíveis pra loja.",
    run: (l) => l.charge(DEMO_CHARGE, DEMO_INSTALLMENTS, DEMO_PRODUCT),
  },
  {
    acc: "loja",
    tab: 1,
    cta: "Antecipar recebíveis",
    instr: "A loja antecipa os recebíveis e recebe agora — líquido de 3%, financiado pelo pool.",
    run: (l) => l.advance(),
  },
  {
    acc: "pessoa",
    tab: 0,
    cta: `Pagar fatura — ${fmt(DEMO_CHARGE)}`,
    instr: "Ana paga a fatura do cartão. O principal volta ao pool com 2% de ágio.",
    run: (l) => l.payInvoice(),
  },
]

const PERSONA: Record<Acc, { name: string; role: string }> = {
  investidor: { name: "Ana Ribeiro", role: "Investidora" },
  loja: { name: "Loja Aurora", role: "Vendedor" },
  pessoa: { name: "Ana Ribeiro", role: "Cliente" },
}

const AUTO_IDLE_MS = 3000
const REVEAL_MS = 2100

type Phase = "idle" | "reveal" | "done"

export function DemoFlow({
  mode = "manual",
  onExit,
}: {
  mode?: "auto" | "manual"
  onExit?: () => void
}) {
  const ledger = useDemoLedger()
  const { state, reset } = ledger

  const [screenStep, setScreenStep] = useState(0)
  const [phase, setPhase] = useState<Phase>("idle")
  const [paused, setPaused] = useState(false)

  const doneStep = phase === "done"
  const current = STEPS[Math.min(screenStep, STEPS.length - 1)]

  // tela exibida: no fim, vai pro investidor mostrar o rendimento que voltou
  const acc: Acc = doneStep ? "investidor" : current.acc
  const tab = doneStep ? 0 : current.tab
  const persona = PERSONA[acc]

  const lastTx = state.txs[0]

  const doAction = useCallback(() => {
    if (phase !== "idle") return
    STEPS[screenStep].run(ledger)
    setPhase("reveal")
  }, [phase, screenStep, ledger])

  const restart = useCallback(() => {
    reset()
    setScreenStep(0)
    setPhase("idle")
  }, [reset])

  // motor de tempo: avança o reveal sempre; auto-play dispara a ação no idle
  // e, no fim, reinicia o ciclo (landing sempre viva).
  useEffect(() => {
    if (phase === "reveal") {
      const id = setTimeout(() => {
        if (screenStep + 1 < STEPS.length) {
          setScreenStep((s) => s + 1)
          setPhase("idle")
        } else {
          setPhase("done")
        }
      }, REVEAL_MS)
      return () => clearTimeout(id)
    }
    if (phase === "idle" && mode === "auto" && !paused) {
      const id = setTimeout(doAction, AUTO_IDLE_MS)
      return () => clearTimeout(id)
    }
    if (phase === "done" && mode === "auto" && !paused) {
      const id = setTimeout(restart, 5200)
      return () => clearTimeout(id)
    }
  }, [phase, screenStep, mode, paused, doAction, restart])

  const showCta = phase === "idle" && !doneStep
  const showToast = phase === "reveal" && lastTx
  const stepNum = Math.min(screenStep + 1, STEPS.length)

  return (
    <div className="dm-flow">
      <div className="dm-flow-stage">
        <DemoPhone id={acc} tab={tab} animated />

        {showToast ? (
          <div className="dm-flow-toast" key={lastTx.id}>
            <div className="dm-flow-toast-row">
              <span className="ok">✓</span>
              <span className="lbl">{lastTx.label}</span>
              <span className="amt">{fmt(lastTx.amount)}</span>
            </div>
            <a className="dm-flow-toast-hash" href={solscan(lastTx.hash)} target="_blank" rel="noreferrer">
              <span className="dot" />
              {shortHash(lastTx.hash)}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>
        ) : null}
      </div>

      <div className="dm-flow-guide">
        <div className="dm-flow-step">
          {doneStep ? "Ciclo completo" : `Passo ${stepNum} de ${STEPS.length}`} · <b>{persona.role}</b>
        </div>

        <div className="dm-flow-instr">
          {doneStep
            ? `O capital circulou e voltou pra Ana com +2% de ágio. Investimento agora: ${fmt(investimentoTotal(state))}.`
            : current.instr}
        </div>

        {showCta ? (
          <button className="dm-flow-action" type="button" onClick={doAction}>
            <span className="tap" />
            {current.cta}
          </button>
        ) : null}

        {phase === "reveal" ? <div className="dm-flow-action ghost">processando on-chain…</div> : null}

        {doneStep ? (
          <button className="dm-flow-action" type="button" onClick={restart}>
            ↺ Rodar de novo
          </button>
        ) : null}

        <div className="dm-flow-dots">
          {STEPS.map((_, i) => (
            <i key={i} className={i < screenStep || doneStep ? "on" : i === screenStep && phase === "reveal" ? "on" : ""} />
          ))}
        </div>

        <div className="dm-flow-controls">
          {mode === "auto" && !doneStep ? (
            <button className="dm-flow-ctl" type="button" onClick={() => setPaused((p) => !p)}>
              {paused ? "▶ retomar" : "❚❚ pausar"}
            </button>
          ) : null}
          {onExit ? (
            <button className="dm-flow-ctl" type="button" onClick={onExit}>
              ← voltar ao app
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
