import { db, requireUserId } from "./client"
import { apiClient, centsToBrl } from "@/lib/api/client"
import { MOCK_ENABLED, mock } from "@/lib/mock/store"
import type { Account, AccountType } from "./types"

const DEFAULTS: Record<AccountType, Account> = {
  PF: { balance_brl: 0, fund_brl: 0 },
  PJ: { balance_brl: 0, fund_brl: 0 },
}

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

export async function getAccount(accountType: AccountType): Promise<Account> {
  if (MOCK_ENABLED) return mock.getAccount(accountType)
  async function fallback(): Promise<Account> {
    const userId = await requireUserId()
    const { data } = await db()
      .from("accounts")
      .select("balance_brl, fund_brl")
      .eq("user_id", userId)
      .eq("account_type", accountType)
      .maybeSingle()
    if (!data) return DEFAULTS[accountType]
    return { balance_brl: Number(data.balance_brl), fund_brl: Number(data.fund_brl) }
  }

  try {
    const accounts = await apiClient.get<KoraLedgerAccount[]>("/ledger/entries")
    const wantedType = accountType === "PJ" ? "MERCHANT_BALANCE" : "USER_BALANCE"
    const match = (accounts ?? []).find(
      (a) => a.type === wantedType && a.currency === "BRL",
    )
    if (!match) return fallback()
    const fund = await fallback().then((f) => f.fund_brl).catch(() => 0)
    return { balance_brl: centsToBrl(match.balanceCents), fund_brl: fund }
  } catch {
    return fallback()
  }
}

/** Ajusta o saldo disponível (delta +/-) de forma atômica. Retorna o novo saldo. */
export async function adjustBalance(
  accountType: AccountType,
  deltaBrl: number,
): Promise<number> {
  if (MOCK_ENABLED) return mock.adjustBalance(accountType, deltaBrl)
  const { data, error } = await db().rpc("adjust_balance", {
    p_account_type: accountType,
    p_delta: deltaBrl,
  })
  if (error) throw new Error(error.message)
  return Number(data)
}

/** Move BRL do disponível para o fundo (depósito) ou o contrário (resgate). */
export async function setFund(accountType: AccountType, fundBrl: number): Promise<void> {
  if (MOCK_ENABLED) return mock.setFund(accountType, fundBrl)
  const userId = await requireUserId()
  const { error } = await db()
    .from("accounts")
    .update({ fund_brl: fundBrl })
    .eq("user_id", userId)
    .eq("account_type", accountType)
  if (error) throw new Error(error.message)
}
