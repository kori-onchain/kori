"use client"

/**
 * Ledger mockado do demo (web) — porte do app/src/lib/mockDemoLedger.ts.
 *
 * Modela o mesmo loop econômico do Kori entre as 2 personas que vivem no app:
 *   - Ana Ribeiro (PF) → conta + cartão/fatura + aba de investimento (mesmo saldo).
 *   - Loja Aurora (PJ) → cobra a Ana no cartão e antecipa recebíveis.
 *
 * Loop:
 *   1. Ana investe no pool        → saldo ↓, posição no fundo ↑.
 *   2. Loja cobra a Ana (cartão)  → parcelas na fatura + limite trava + recebíveis.
 *   3. Loja antecipa recebíveis   → caixa da loja ↑ (líquido, −3%), financiado pelo pool.
 *   4. Ana paga a fatura          → saldo ↓, principal volta ao pool + ágio 2% → rendimento ↑.
 *
 * As telas (browse + walkthrough) leem deste estado, então tudo é "ao vivo".
 */
import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react"

// ─── Constantes de roteiro (em reais — espelham mockDemoLedger) ──────────────
export const ANA_SALDO_START = 1000 // R$ 1.000,00
export const LOJA_CAIXA_START = 0 // R$ 0,00
export const POOL_TOTAL_START = 50000 // R$ 50.000,00
export const POOL_DEPLOYED_START = 20000 // R$ 20.000,00 já implantado
export const CARD_LIMIT_TOTAL = 8000 // R$ 8.000,00
export const ADVANCE_FEE_PCT = 0.03 // 3% antecipação (pool)
export const AGIO_PCT = 0.02 // 2% ágio que volta ao pool ao pagar a fatura

// Valores usados pelo walkthrough (história limpa: Ana fica solvente).
export const DEMO_INVEST = 100 // Ana aporta R$ 100
export const DEMO_CHARGE = 600 // Loja cobra R$ 600
export const DEMO_INSTALLMENTS = 3 // em 3x de R$ 200
export const DEMO_PRODUCT = "Tênis Air Pro"

// ─── Helpers ─────────────────────────────────────────────────────────────────
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

export const genTxHash = (): string => {
  let out = ""
  for (let i = 0; i < 44; i++) out += BASE58.charAt(Math.floor(Math.random() * BASE58.length))
  return out
}

/** Link estilo explorer (solana devnet). */
export const solscan = (hash: string) => `https://solscan.io/tx/${hash}?cluster=devnet`

export const fmt = (v: number) =>
  `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/** Versão curta de hash pra UI (4…4). */
export const shortHash = (hash: string) => `${hash.slice(0, 4)}…${hash.slice(-4)}`

/** Quebra um valor em [inteiro "R$ X", centavos ",00"] — p/ centavos coloridos. */
export const splitBRL = (v: number): [string, string] => {
  const neg = v < 0
  const abs = Math.abs(v)
  const i = Math.floor(abs)
  const c = Math.round((abs - i) * 100)
  return [`${neg ? "-" : ""}R$ ${i.toLocaleString("pt-BR")}`, `,${String(c).padStart(2, "0")}`]
}

// ─── Estado ──────────────────────────────────────────────────────────────────
export interface Receivable {
  id: string
  label: string
  bruto: number
  liquido: number
  status: "PENDING" | "ANTICIPATED"
}

export interface InvoiceItem {
  id: string
  label: string
  amount: number
  installments: number
}

export type TxKind = "INVESTMENT" | "CARD_CHARGE" | "RECEIVABLE_ADVANCE" | "INVOICE_PAYMENT"

export interface Tx {
  id: string
  hash: string
  kind: TxKind
  label: string
  amount: number
}

export interface LedgerState {
  ana: { saldo: number; investido: number; rendimento: number }
  loja: { caixa: number }
  card: { limiteTotal: number; usado: number }
  fatura: { total: number; pendente: number; itens: InvoiceItem[] }
  pool: { total: number; deployed: number }
  receivables: Receivable[]
  txs: Tx[] // mais recente primeiro
  ops: number // nº de operações já aplicadas (id estável p/ animações)
}

const seed = (): LedgerState => ({
  ana: { saldo: ANA_SALDO_START, investido: 0, rendimento: 0 },
  loja: { caixa: LOJA_CAIXA_START },
  card: { limiteTotal: CARD_LIMIT_TOTAL, usado: 0 },
  fatura: { total: 0, pendente: 0, itens: [] },
  pool: { total: POOL_TOTAL_START, deployed: POOL_DEPLOYED_START },
  receivables: [],
  txs: [],
  ops: 0,
})

// ─── Derivados ───────────────────────────────────────────────────────────────
export const cardDisponivel = (s: LedgerState) => Math.max(s.card.limiteTotal - s.card.usado, 0)
export const poolDisponivel = (s: LedgerState) => Math.max(s.pool.total - s.pool.deployed, 0)
export const investimentoTotal = (s: LedgerState) => s.ana.investido + s.ana.rendimento
export const recebivelPendente = (s: LedgerState) =>
  s.receivables.filter((r) => r.status === "PENDING").reduce((t, r) => t + r.bruto, 0)

// ─── Ações (reducer) ─────────────────────────────────────────────────────────
type Action =
  | { type: "invest"; amount: number }
  | { type: "charge"; amount: number; installments: number; productName: string }
  | { type: "advance" }
  | { type: "payInvoice" }
  | { type: "reset" }

const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 9)}`

const pushTx = (s: LedgerState, kind: TxKind, label: string, amount: number): Tx[] => {
  const tx: Tx = { id: uid("tx"), hash: genTxHash(), kind, label, amount }
  return [tx, ...s.txs].slice(0, 12)
}

function reducer(s: LedgerState, a: Action): LedgerState {
  switch (a.type) {
    case "invest": {
      const amount = Math.min(a.amount, s.ana.saldo)
      return {
        ...s,
        ana: { ...s.ana, saldo: s.ana.saldo - amount, investido: s.ana.investido + amount },
        pool: { ...s.pool, total: s.pool.total + amount },
        txs: pushTx(s, "INVESTMENT", "Aporte no pool", amount),
        ops: s.ops + 1,
      }
    }

    case "charge": {
      const amount = a.amount
      const n = Math.max(a.installments, 1)
      const base = Math.round((amount / n) * 100) / 100
      const novos: Receivable[] = Array.from({ length: n }, (_, i) => {
        const bruto = i === 0 ? amount - base * (n - 1) : base
        const liquido = Math.round(bruto * (1 - ADVANCE_FEE_PCT) * 100) / 100
        return { id: uid("rec"), label: `${a.productName} · ${i + 1}/${n}`, bruto, liquido, status: "PENDING" }
      })
      const item: InvoiceItem = { id: uid("it"), label: a.productName, amount, installments: n }
      return {
        ...s,
        fatura: {
          total: s.fatura.total + amount,
          pendente: s.fatura.pendente + amount,
          itens: [item, ...s.fatura.itens],
        },
        card: { ...s.card, usado: s.card.usado + amount },
        receivables: [...novos, ...s.receivables],
        txs: pushTx(s, "CARD_CHARGE", `Cobrança ${a.productName} · ${n}x`, amount),
        ops: s.ops + 1,
      }
    }

    case "advance": {
      const pend = s.receivables.filter((r) => r.status === "PENDING")
      if (pend.length === 0) return s
      const net = pend.reduce((t, r) => t + r.liquido, 0)
      const bruto = pend.reduce((t, r) => t + r.bruto, 0)
      return {
        ...s,
        loja: { caixa: s.loja.caixa + net },
        pool: { ...s.pool, deployed: s.pool.deployed + net },
        receivables: s.receivables.map((r) => (r.status === "PENDING" ? { ...r, status: "ANTICIPATED" } : r)),
        txs: pushTx(s, "RECEIVABLE_ADVANCE", `Antecipação −${ADVANCE_FEE_PCT * 100}% · pool`, net),
        ops: s.ops + 1,
      }
    }

    case "payInvoice": {
      const pending = s.fatura.pendente
      if (pending <= 0) return s
      const returned = Math.min(s.pool.deployed, pending)
      const agio = Math.round(returned * AGIO_PCT * 100) / 100
      return {
        ...s,
        ana: { ...s.ana, saldo: Math.max(s.ana.saldo - pending, 0), rendimento: s.ana.rendimento + agio },
        card: { ...s.card, usado: Math.max(s.card.usado - pending, 0) },
        fatura: { ...s.fatura, pendente: 0 },
        pool: { total: s.pool.total + agio, deployed: Math.max(s.pool.deployed - returned, 0) },
        txs: pushTx(s, "INVOICE_PAYMENT", "Fatura paga · ágio 2% ao pool", pending),
        ops: s.ops + 1,
      }
    }

    case "reset":
      return seed()

    default:
      return s
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────
interface LedgerCtx {
  state: LedgerState
  invest: (amount: number) => void
  charge: (amount: number, installments: number, productName: string) => void
  advance: () => void
  payInvoice: () => void
  reset: () => void
}

const Ctx = createContext<LedgerCtx | null>(null)

export function DemoLedgerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, seed)

  const value = useMemo<LedgerCtx>(
    () => ({
      state,
      invest: (amount) => dispatch({ type: "invest", amount }),
      charge: (amount, installments, productName) => dispatch({ type: "charge", amount, installments, productName }),
      advance: () => dispatch({ type: "advance" }),
      payInvoice: () => dispatch({ type: "payInvoice" }),
      reset: () => dispatch({ type: "reset" }),
    }),
    [state],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useDemoLedger(): LedgerCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useDemoLedger precisa estar dentro de <DemoLedgerProvider>")
  return ctx
}
