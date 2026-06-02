import { apiClient, brlToCents } from "@/lib/api/client"
import { getAccount, adjustBalance } from "./accounts"
import { addTransaction, listTransactions } from "./transactions"
import { MOCK_ENABLED, mock } from "@/lib/mock/store"
import type { Transaction } from "./types"

/**
 * Transferência API-first: tenta `/payments/transfer` (backend real) e, em
 * qualquer falha (API fora), cai no fallback Supabase (debita saldo + registra
 * a transação). Retorna o saldo novo e a transação pra UI.
 */
export async function transfer(input: {
  amountBrl: number
  recipientName: string
  recipientWallet: string
  initials?: string | null
}): Promise<{ balance: number; transaction: Transaction }> {
  if (MOCK_ENABLED) return mock.transfer(input)
  if (input.amountBrl <= 0) throw new Error("Informe um valor maior que zero.")

  async function fallback(): Promise<{ balance: number; transaction: Transaction }> {
    const balance = await adjustBalance("PF", -input.amountBrl)
    const transaction = await addTransaction({
      accountType: "PF",
      title: input.recipientName || input.recipientWallet,
      subtitle: input.recipientWallet,
      amount_brl: input.amountBrl,
      is_credit: false,
      initials: input.initials ?? null,
      kind: "transfer",
    })
    return { balance, transaction }
  }

  try {
    const isUsername = input.recipientWallet.trim().startsWith("@")
    const recipientId = isUsername
      ? input.recipientWallet.trim().replace(/^@/, "")
      : input.recipientWallet.trim()

    await apiClient.post("/payments/transfer", {
      amountCents: brlToCents(input.amountBrl),
      currency: "BRL",
      recipientType: isUsername ? "username" : "wallet",
      recipientId,
    })

    // Backend atualizou o ledger — relê saldo e última transação.
    const [account, txs] = await Promise.all([
      getAccount("PF"),
      listTransactions("PF", 1),
    ])
    const transaction: Transaction =
      txs[0] ?? {
        id: `tx-${Date.now()}`,
        title: input.recipientName || input.recipientWallet,
        subtitle: input.recipientWallet,
        amount_brl: input.amountBrl,
        is_credit: false,
        initials: input.initials ?? null,
        is_anonymous: false,
        kind: "transfer",
        created_at: new Date().toISOString(),
      }
    return { balance: account.balance_brl, transaction }
  } catch {
    return fallback()
  }
}
