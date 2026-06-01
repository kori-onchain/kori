"use client"

import { useState } from "react"

import { Sys } from "./icons"

type Actor = "investidor" | "loja" | "pessoa"

interface SimState {
  invest: { saldo: number; aplicado: number; rend: number }
  loja: { caixa: number; aReceber: number }
  user: { saldo: number; fatura: number }
  pool: number
}

const INIT: SimState = {
  invest: { saldo: 5000, aplicado: 0, rend: 0 },
  loja: { caixa: 3482.9, aReceber: 0 },
  user: { saldo: 4280, fatura: 0 },
  pool: 0,
}

const STEPS: {
  actor: Actor
  label: string
  instr: string
  confirm: string
  apply: (s: SimState) => SimState
}[] = [
  {
    actor: "investidor",
    label: "Investir R$ 100 no fundo",
    instr: "O investidor aplica R$ 100 no pool do fundo Kori.",
    confirm: "+R$ 100 aplicados no pool",
    apply: (s) => ({ ...s, invest: { ...s.invest, saldo: s.invest.saldo - 100, aplicado: s.invest.aplicado + 100 }, pool: s.pool + 100 }),
  },
  {
    actor: "loja",
    label: "Cobrar cliente — R$ 102 no crédito",
    instr: "O vendedor cobra o cliente em 1x no cartão de crédito.",
    confirm: "Cobrança de R$ 102 enviada ao cliente",
    apply: (s) => ({ ...s, loja: { ...s.loja, aReceber: s.loja.aReceber + 102 } }),
  },
  {
    actor: "pessoa",
    label: "Pagar no crédito",
    instr: "O cliente paga no crédito — o valor entra na fatura do cartão.",
    confirm: "Compra aprovada · fatura +R$ 102",
    apply: (s) => ({ ...s, user: { ...s.user, fatura: s.user.fatura + 102 } }),
  },
  {
    actor: "loja",
    label: "Antecipar recebível",
    instr: "O vendedor antecipa o recebível e recebe agora — financiado pelo pool.",
    confirm: "Antecipação liberada · +R$ 100 no caixa",
    apply: (s) => ({ ...s, loja: { caixa: s.loja.caixa + 100, aReceber: s.loja.aReceber - 102 }, pool: s.pool - 100 }),
  },
  {
    actor: "pessoa",
    label: "Pagar fatura (R$ 102)",
    instr: "O cliente paga a fatura do cartão — o dinheiro vai para o pool.",
    confirm: "Fatura paga · –R$ 102",
    apply: (s) => ({ ...s, user: { saldo: s.user.saldo - 102, fatura: s.user.fatura - 102 }, pool: s.pool + 102 }),
  },
  {
    actor: "investidor",
    label: "Receber rendimento",
    instr: "O pool devolve ao investidor o principal + ágio de 2%.",
    confirm: "Liquidado · +R$ 102 no saldo (ágio 2%)",
    apply: (s) => ({ ...s, invest: { saldo: s.invest.saldo + 102, aplicado: s.invest.aplicado - 100, rend: s.invest.rend + 2 }, pool: s.pool - 102 }),
  },
]

const ACTOR_META: Record<Actor, { name: string; role: string; initials: string }> = {
  investidor: { name: "Kauã Miguel", role: "Investidor", initials: "KM" },
  loja: { name: "Loja Aurora", role: "Vendedor", initials: "LA" },
  pessoa: { name: "Ana Ribeiro", role: "Cliente", initials: "AR" },
}

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`

export function DemoFlow({ onExit }: { onExit: () => void }) {
  const [sim, setSim] = useState<SimState>(INIT)
  const [step, setStep] = useState(0)
  const [confirm, setConfirm] = useState<string>("")

  const done = step >= STEPS.length
  const current = done ? STEPS[STEPS.length - 1] : STEPS[step]
  const actor = current.actor

  const advance = () => {
    const s = STEPS[step]
    setSim((prev) => s.apply(prev))
    setConfirm(s.confirm)
    setStep((p) => p + 1)
  }

  const reset = () => {
    setSim(INIT)
    setStep(0)
    setConfirm("")
  }

  const meta = ACTOR_META[actor]

  // valor "grande" + linhas por ator
  let big = ""
  let lines: [string, string, boolean?][] = []
  if (actor === "investidor") {
    big = fmt(sim.invest.saldo)
    lines = [
      ["Aplicado no pool", fmt(sim.invest.aplicado)],
      ["Rendimento", `+${fmt(sim.invest.rend)}`, true],
    ]
  } else if (actor === "loja") {
    big = fmt(sim.loja.caixa)
    lines = [
      ["A receber", fmt(sim.loja.aReceber)],
      ["Pool disponível", fmt(sim.pool)],
    ]
  } else {
    big = fmt(sim.user.saldo)
    lines = [
      ["Fatura do cartão", fmt(sim.user.fatura)],
      ["Limite", fmt(6000 - sim.user.fatura)],
    ]
  }

  return (
    <div className="dm-flow">
      <div className="dm-phone">
        <div className="dm-screen">
          <div className="dm-island" />
          <div className="dm-statusbar">
            <span className="time">9:41</span>
            <span className="sys">
              <Sys />
            </span>
          </div>
          <div className="dm-app">
            <div className="dm-appbody">
              <div className="dm-approw">
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div className="dm-avatar" style={{ background: "var(--ac)", color: "#0a0a0b" }}>
                    {meta.initials}
                  </div>
                  <div className="dm-hi">
                    {meta.role}
                    <b>{meta.name}</b>
                  </div>
                </div>
                <span className="dm-flow-tag">{meta.role}</span>
              </div>

              <div className="dm-balcard">
                <div className="lab">{actor === "loja" ? "Caixa da loja" : "Saldo disponível"}</div>
                <div className="big dm-flowbig" key={big}>
                  {big}
                </div>
              </div>

              <div className="dm-stat2" style={{ marginTop: 11 }}>
                {lines.map(([l, v, up]) => (
                  <div className="s" key={l}>
                    <div className="l">{l}</div>
                    <div className="v" key={v} style={up ? { color: "var(--ac)" } : undefined}>
                      {v}
                    </div>
                  </div>
                ))}
              </div>

              {confirm ? <div className="dm-flow-confirm">✓ {confirm}</div> : null}

              {done ? (
                <>
                  <div className="dm-flow-done">Ciclo completo — o capital circulou e voltou com rendimento.</div>
                  <button className="dm-cta" onClick={reset}>
                    Rodar de novo
                  </button>
                </>
              ) : (
                <button className="dm-cta" onClick={advance}>
                  {current.label}
                </button>
              )}
            </div>
            <div className="dm-homebar" />
          </div>
        </div>
      </div>

      <div className="dm-flow-guide">
        <div className="dm-flow-step">
          {done ? "Fluxo concluído" : `Passo ${step + 1} de ${STEPS.length}`} · <b>{meta.role}</b>
        </div>
        <div className="dm-flow-instr">{done ? "Investidor recebeu o principal + 2% de ágio." : current.instr}</div>
        <div className="dm-flow-dots">
          {STEPS.map((_, i) => (
            <i key={i} className={i < step ? "on" : ""} />
          ))}
        </div>
        <button className="dm-flow-exit" type="button" onClick={onExit}>
          ← voltar ao app
        </button>
      </div>
    </div>
  )
}
