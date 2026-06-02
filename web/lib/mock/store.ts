// ============================================================================
// MODO MOCK (MVP) — dados em JSON + localStorage, sem bater em API nem nas
// tabelas do Supabase. Espelha a superfície de lib/db/*. Ligado por
// NEXT_PUBLIC_MOCK !== "false" (default ON).
// ============================================================================
import type {
  Account,
  AccountType,
  Card,
  Contact,
  Opportunity,
  Position,
  Product,
  Receivable,
  Sale,
  Transaction,
  TxKind,
} from "@/lib/db/types"

export const MOCK_ENABLED = process.env.NEXT_PUBLIC_MOCK !== "false"

const KEY = "kori_mock_v1"
const AUTH_KEY = "kori_mock_auth"

// ── sessão mock (login local, sem bater em Supabase/Privy) ──────────────────
export type MockSession = { name: string; email: string }

export function getMockSession(): MockSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(AUTH_KEY)
    return raw ? (JSON.parse(raw) as MockSession) : null
  } catch {
    return null
  }
}
export function setMockSession(s?: Partial<MockSession>): MockSession {
  const session: MockSession = {
    name: s?.name?.trim() || "Ana Ribeiro",
    email: s?.email?.trim() || "ana.ribeiro@kori.app",
  }
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(AUTH_KEY, JSON.stringify(session))
    } catch {
      /* ignore */
    }
  }
  return session
}
export function clearMockSession(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(AUTH_KEY)
  } catch {
    /* ignore */
  }
}

type StoredTx = Transaction & { account_type: AccountType }

type DB = {
  accounts: Record<AccountType, Account>
  transactions: StoredTx[]
  contacts: Contact[]
  receivables: Receivable[]
  positions: Position[]
  opportunities: Opportunity[]
  products: Product[]
  sales: Sale[]
  card: Card
}

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2)}-${Date.now()}`

const iso = (offsetMs = 0) => new Date(Date.now() - offsetMs).toISOString()
const H = 3600_000
const D = 24 * H

function seed(): DB {
  return {
    accounts: {
      PF: { balance_brl: 412.8, fund_brl: 8420.18 },
      PJ: { balance_brl: 74352.93, fund_brl: 0 },
    },
    transactions: [
      tx("PF", "Lucas Silva", "@lucas_s", 143.82, false, "LS", "transfer", 2 * H),
      tx("PF", "Câmbio BRL → USD", "Conversão de saldo", 2450.8, false, null, "exchange", 5 * H),
      { ...tx("PF", "Anônimo", "0x7a8b...291f", 389.45, true, null, "transfer", D), is_anonymous: true },
      tx("PF", "Maria Oliveira", "@mari_o", 88.2, true, "MO", "transfer", D + 6 * H),
      tx("PF", "Rafael Rocha", "@rafa_r", 250.0, false, "RR", "transfer", 9 * D),
      tx("PF", "Recebimento de yield", "Pool USDC", 12.84, true, null, "yield", 10 * D),
    ],
    contacts: [
      contact("Maria Oliveira", "@mari_o", "MO", true),
      contact("Lucas Silva", "@lucas_s", "LS", false),
      contact("Rafael Rocha", "@rafa_r", "RR", true),
      contact(null, "@anon-843", "A8", false),
      contact("Beatriz Costa", "@bia_c", "BC", false),
      contact("Gabriela Lima", "@gabi_l", "GL", true),
      contact("Thiago Martins", "@thiago_m", "TM", false),
      contact("Aline Fonseca", "@aline_f", "AF", false),
    ],
    receivables: [
      rec("Venda #3821 — Tênis Air Pro", "2026-06-02", 1200, 1164, "3x de R$ 400,00"),
      rec("Venda #3822 — Camiseta Premium", "2026-06-08", 480, 465.6, "2x de R$ 240,00"),
      rec("Venda #3819 — Kit Skincare", "2026-06-15", 890, 863.3, "4x de R$ 222,50"),
      rec("Venda #3815 — Fone Bluetooth", "2026-06-22", 350, 339.5, "1x de R$ 350,00"),
      rec("Venda #3808 — Mochila Urban", "2026-06-30", 620, 601.4, "2x de R$ 310,00"),
    ],
    positions: [
      pos("Mercado São Jorge", "9Hpb...2nQa", 2000, 18.4, 14.2, 12, "active"),
      pos("Ótica Visão", "3Fmq...8tLp", 1500, 22.6, 16.5, 28, "active"),
      pos("Café Central", "5KJp...3wWf", 1500, 14.1, 13.8, 3, "pending"),
      pos("Studio Bem-Estar", "2Wny...6kRm", 980, 9.8, 18.1, 45, "active"),
      pos("Padaria Aurora", "8Wnz...1kPm", 2440, 31.2, 15.0, 19, "active"),
    ],
    opportunities: [
      opp("Padaria Aurora", "8Wnz...1kPm", 3100, 15.0, 28),
      opp("Floricultura Bela", "6Tyu...9pLk", 1800, 14.5, 52),
      opp("Pet Shop Amigo", "4Rew...2mNb", 2300, 13.9, 71),
    ],
    products: [
      prod("APPLE", "iPhone 15 Pro", 6999, 7999, "-12%", "smartphones"),
      prod("MONDIAL", "AirFryer Turbo 5L", 349, 499, "-30%", "kitchen"),
      prod("SONY", "PlayStation 5 Slim", 3499, null, null, "consoles"),
      prod("SAMSUNG", "Galaxy S24 Ultra", 5999, 7499, "-20%", "smartphones"),
      prod("TRAMONTINA", "Conjunto Panelas Inox", 289, 389, "-25%", "kitchen"),
      prod("NINTENDO", "Switch OLED", 2199, 2499, "-12%", "consoles"),
    ],
    sales: [
      sale("Maria Costa", "MC", 2, 7348, 1 * H),
      sale("João Silva", "JS", 1, 3499, 3 * H),
      sale("Ana Lima", "AL", 3, 1137, 6 * H),
      sale("Pedro Rocha", "PR", 1, 5999, D),
      sale("Carla Ferreira", "CF", 2, 2548, 2 * D),
    ],
    card: {
      number: "5421 9843 7261 8294",
      expiry: "08/29",
      cvv: "842",
      is_frozen: false,
      online_enabled: true,
      international_enabled: true,
      limit_brl: 8000,
      invoice_brl: 1284.5,
    },
  }
}

// ── helpers de construção ────────────────────────────────────────────────
function tx(
  account_type: AccountType,
  title: string,
  subtitle: string | null,
  amount_brl: number,
  is_credit: boolean,
  initials: string | null,
  kind: TxKind,
  ageMs: number,
): StoredTx {
  return {
    id: uid(),
    account_type,
    title,
    subtitle,
    amount_brl,
    is_credit,
    initials,
    is_anonymous: false,
    kind,
    created_at: iso(ageMs),
  }
}
function contact(name: string | null, wallet_id: string, initials: string, is_favorite: boolean): Contact {
  return { id: uid(), name, wallet_id, initials, is_favorite }
}
function rec(description: string, due: string, gross: number, net: number, inst: string): Receivable {
  return { id: uid(), description, due_date: due, gross_value: gross, net_value: net, installments: inst, status: "pendente" }
}
function pos(
  merchant_name: string,
  hash: string,
  invested_brl: number,
  earned_brl: number,
  apr: number,
  days: number,
  status: "active" | "pending",
): Position {
  return { id: uid(), merchant_name, hash, invested_brl, earned_brl, apr, liquidates_in_days: days, status }
}
function opp(merchant_name: string, hash: string, receivable_brl: number, apr: number, fill_pct: number): Opportunity {
  return { id: uid(), merchant_name, hash, receivable_brl, apr, risk: "low", fill_pct }
}
function prod(
  brand: string,
  name: string,
  price: number,
  old_price: number | null,
  discount: string | null,
  category: string,
): Product {
  return { id: uid(), brand, name, price, old_price, discount, category }
}
function sale(customer_name: string, initials: string, items: number, amount_brl: number, ageMs: number): Sale {
  return { id: uid(), customer_name, initials, items, amount_brl, method: "Pix", created_at: iso(ageMs) }
}

// ── persistência ───────────────────────────────────────────────────────────
function load(): DB {
  if (typeof window === "undefined") return seed()
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  const fresh = seed()
  save(fresh)
  return fresh
}
function save(db: DB) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(db))
  } catch {
    /* ignore */
  }
}

function initialsFrom(name: string): string {
  const p = name.trim().split(/\s+/)
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || name.slice(0, 2).toUpperCase()
}

// ── API do mock (mesma superfície de lib/db) ────────────────────────────────
export const mock = {
  getAccount(accountType: AccountType): Account {
    return load().accounts[accountType]
  },
  adjustBalance(accountType: AccountType, deltaBrl: number): number {
    const db = load()
    const next = db.accounts[accountType].balance_brl + deltaBrl
    if (next < 0) throw new Error("Saldo disponível insuficiente.")
    db.accounts[accountType].balance_brl = next
    save(db)
    return next
  },
  setFund(accountType: AccountType, fundBrl: number): void {
    const db = load()
    db.accounts[accountType].fund_brl = fundBrl
    save(db)
  },
  listTransactions(accountType: AccountType, limit = 50): Transaction[] {
    return load()
      .transactions.filter((t) => t.account_type === accountType)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, limit)
      .map(({ ...t }) => t)
  },
  addTransaction(input: {
    accountType: AccountType
    title: string
    subtitle?: string | null
    amount_brl: number
    is_credit?: boolean
    initials?: string | null
    is_anonymous?: boolean
    kind?: TxKind
  }): Transaction {
    const db = load()
    const t: StoredTx = {
      id: uid(),
      account_type: input.accountType,
      title: input.title,
      subtitle: input.subtitle ?? null,
      amount_brl: input.amount_brl,
      is_credit: input.is_credit ?? false,
      initials: input.initials ?? null,
      is_anonymous: input.is_anonymous ?? false,
      kind: input.kind ?? "transfer",
      created_at: iso(),
    }
    db.transactions.unshift(t)
    save(db)
    return t
  },
  listContacts(): Contact[] {
    return [...load().contacts].sort((a, b) => Number(b.is_favorite) - Number(a.is_favorite))
  },
  addContact(input: { name?: string | null; wallet_id: string; is_favorite?: boolean }): Contact {
    const db = load()
    const c: Contact = {
      id: uid(),
      name: input.name?.trim() || null,
      wallet_id: input.wallet_id,
      initials: initialsFrom(input.name || input.wallet_id.replace(/^@/, "")),
      is_favorite: input.is_favorite ?? false,
    }
    db.contacts.push(c)
    save(db)
    return c
  },
  toggleFavorite(id: string, value: boolean): void {
    const db = load()
    const c = db.contacts.find((x) => x.id === id)
    if (c) c.is_favorite = value
    save(db)
  },
  listReceivables(): Receivable[] {
    return [...load().receivables].sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""))
  },
  advanceReceivables(ids: string[]): { net: number; balance: number } {
    if (ids.length === 0) throw new Error("Selecione ao menos um recebível.")
    const db = load()
    const pending = db.receivables.filter((r) => ids.includes(r.id) && r.status === "pendente")
    if (pending.length === 0) throw new Error("Nenhum recebível pendente selecionado.")
    const net = pending.reduce((s, r) => s + r.net_value, 0)
    pending.forEach((r) => (r.status = "antecipado"))
    db.accounts.PJ.balance_brl += net
    db.transactions.unshift({
      id: uid(),
      account_type: "PJ",
      title: "Antecipação de recebíveis",
      subtitle: `${pending.length} recebível(is)`,
      amount_brl: net,
      is_credit: true,
      initials: null,
      is_anonymous: false,
      kind: "advance",
      created_at: iso(),
    })
    save(db)
    return { net, balance: db.accounts.PJ.balance_brl }
  },
  listPositions(): Position[] {
    return [...load().positions]
  },
  listOpportunities(): Opportunity[] {
    return [...load().opportunities].sort((a, b) => a.fill_pct - b.fill_pct)
  },
  financeOpportunity(op: Opportunity, amountBrl: number): { balance: number } {
    if (amountBrl <= 0) throw new Error("Informe um valor maior que zero.")
    const db = load()
    if (db.accounts.PF.balance_brl < amountBrl) throw new Error("Saldo disponível insuficiente.")
    db.accounts.PF.balance_brl -= amountBrl
    db.positions.unshift({
      id: uid(),
      merchant_name: op.merchant_name,
      hash: op.hash,
      invested_brl: amountBrl,
      earned_brl: 0,
      apr: op.apr,
      liquidates_in_days: 30,
      status: "pending",
    })
    const o = db.opportunities.find((x) => x.id === op.id)
    if (o) o.fill_pct = Math.min(100, o.fill_pct + Math.round((amountBrl / op.receivable_brl) * 100))
    db.transactions.unshift({
      id: uid(),
      account_type: "PF",
      title: `Financiamento — ${op.merchant_name}`,
      subtitle: op.hash,
      amount_brl: amountBrl,
      is_credit: false,
      initials: null,
      is_anonymous: false,
      kind: "deposit",
      created_at: iso(),
    })
    save(db)
    return { balance: db.accounts.PF.balance_brl }
  },
  listProducts(): Product[] {
    return [...load().products]
  },
  addProduct(input: {
    brand?: string | null
    name: string
    price: number
    old_price?: number | null
    discount?: string | null
    category?: string
  }): Product {
    const db = load()
    const p: Product = {
      id: uid(),
      brand: input.brand ?? null,
      name: input.name,
      price: input.price,
      old_price: input.old_price ?? null,
      discount: input.discount ?? null,
      category: input.category ?? "tudo",
    }
    db.products.push(p)
    save(db)
    return p
  },
  listSales(limit = 50): Sale[] {
    return [...load().sales].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, limit)
  },
  addSale(input: { customer_name: string; items?: number; amount_brl: number; method?: string }): Sale {
    const db = load()
    const s: Sale = {
      id: uid(),
      customer_name: input.customer_name,
      initials: initialsFrom(input.customer_name),
      items: input.items ?? 1,
      amount_brl: input.amount_brl,
      method: input.method ?? "Pix",
      created_at: iso(),
    }
    db.sales.unshift(s)
    db.accounts.PJ.balance_brl += input.amount_brl
    db.transactions.unshift({
      id: uid(),
      account_type: "PJ",
      title: `Venda — ${input.customer_name}`,
      subtitle: `${input.items ?? 1} item(ns)`,
      amount_brl: input.amount_brl,
      is_credit: true,
      initials: s.initials,
      is_anonymous: false,
      kind: "sale",
      created_at: iso(),
    })
    save(db)
    return s
  },
  getCard(): Card | null {
    return load().card
  },
  updateCardFlags(flags: Partial<Pick<Card, "is_frozen" | "online_enabled" | "international_enabled">>): void {
    const db = load()
    db.card = { ...db.card, ...flags }
    save(db)
  },
  updateCard(patch: Partial<Card>): void {
    const db = load()
    db.card = { ...db.card, ...patch }
    save(db)
  },
  transfer(input: {
    amountBrl: number
    recipientName: string
    recipientWallet: string
    initials?: string | null
  }): { balance: number; transaction: Transaction } {
    if (input.amountBrl <= 0) throw new Error("Informe um valor maior que zero.")
    const balance = mock.adjustBalance("PF", -input.amountBrl)
    const transaction = mock.addTransaction({
      accountType: "PF",
      title: input.recipientName || input.recipientWallet,
      subtitle: input.recipientWallet,
      amount_brl: input.amountBrl,
      is_credit: false,
      initials: input.initials ?? null,
      kind: "transfer",
    })
    return { balance, transaction }
  },
}
