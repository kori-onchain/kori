import { db, requireUserId } from "./client"
import { apiClient, centsToBrl } from "@/lib/api/client"
import { MOCK_ENABLED, mock } from "@/lib/mock/store"
import type { AccountType, Transaction, TxKind } from "./types"

type KoraLedgerAccount = {
  id: string
  type: "USER_BALANCE" | "MERCHANT_BALANCE" | "CARD_RECEIVABLE" | "PLATFORM"
  currency: "BRL" | "USD" | "EUR" | "USDC" | "SOL"
  balanceCents: number
  entries?: Array<{
    id: string
    description?: string
    amountCents?: number
    direction?: "CREDIT" | "DEBIT"
    createdAt?: string
    type?: string
  }>
}

export async function listTransactions(
  accountType: AccountType,
  limit = 50,
): Promise<Transaction[]> {
  if (MOCK_ENABLED) return mock.listTransactions(accountType, limit)
  async function fallback(): Promise<Transaction[]> {
    const userId = await requireUserId()
    const { data } = await db()
      .from("transactions")
      .select("id, title, subtitle, amount_brl, is_credit, initials, is_anonymous, kind, created_at")
      .eq("user_id", userId)
      .eq("account_type", accountType)
      .order("created_at", { ascending: false })
      .limit(limit)
    return (data ?? []).map((t) => ({ ...t, amount_brl: Number(t.amount_brl) })) as Transaction[]
  }

  try {
    const accounts = await apiClient.get<KoraLedgerAccount[]>("/ledger/entries")
    const wantedType = accountType === "PJ" ? "MERCHANT_BALANCE" : "USER_BALANCE"
    const match = (accounts ?? []).find(
      (a) => a.type === wantedType && a.currency === "BRL",
    )
    const entries = match?.entries ?? []
    if (entries.length === 0) return fallback()
    const txs: Transaction[] = entries.map((e) => ({
      id: e.id,
      title: e.description || "Transação",
      subtitle: null,
      amount_brl: centsToBrl(e.amountCents ?? 0),
      is_credit: e.direction === "CREDIT",
      initials: null,
      is_anonymous: false,
      kind: "transfer",
      created_at: e.createdAt || new Date().toISOString(),
    }))
    txs.sort((a, b) => b.created_at.localeCompare(a.created_at))
    return txs.slice(0, limit)
  } catch {
    return fallback()
  }
}

export async function addTransaction(input: {
  accountType: AccountType
  title: string
  subtitle?: string | null
  amount_brl: number
  is_credit?: boolean
  initials?: string | null
  is_anonymous?: boolean
  kind?: TxKind
}): Promise<Transaction> {
  if (MOCK_ENABLED) return mock.addTransaction(input)
  const userId = await requireUserId()
  const { data, error } = await db()
    .from("transactions")
    .insert({
      user_id: userId,
      account_type: input.accountType,
      title: input.title,
      subtitle: input.subtitle ?? null,
      amount_brl: input.amount_brl,
      is_credit: input.is_credit ?? false,
      initials: input.initials ?? null,
      is_anonymous: input.is_anonymous ?? false,
      kind: input.kind ?? "transfer",
    })
    .select("id, title, subtitle, amount_brl, is_credit, initials, is_anonymous, kind, created_at")
    .single()
  if (error) throw new Error(error.message)
  return { ...data, amount_brl: Number(data.amount_brl) } as Transaction
}
