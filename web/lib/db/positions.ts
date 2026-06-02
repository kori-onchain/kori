import { db, requireUserId } from "./client"
import { adjustBalance } from "./accounts"
import { addTransaction } from "./transactions"
import { MOCK_ENABLED, mock } from "@/lib/mock/store"
import type { Opportunity, Position } from "./types"

export async function listPositions(): Promise<Position[]> {
  if (MOCK_ENABLED) return mock.listPositions()
  const userId = await requireUserId()
  const { data } = await db()
    .from("positions")
    .select("id, merchant_name, hash, invested_brl, earned_brl, apr, liquidates_in_days, status")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  return (data ?? []).map((p) => ({
    ...p,
    invested_brl: Number(p.invested_brl),
    earned_brl: Number(p.earned_brl),
    apr: Number(p.apr),
  })) as Position[]
}

/**
 * Financia uma oportunidade do marketplace: debita o saldo PF, cria uma
 * posição, aumenta a captação da oportunidade e registra a transação.
 */
export async function financeOpportunity(
  op: Opportunity,
  amountBrl: number,
): Promise<{ balance: number }> {
  if (MOCK_ENABLED) return mock.financeOpportunity(op, amountBrl)
  if (amountBrl <= 0) throw new Error("Informe um valor maior que zero.")
  const userId = await requireUserId()

  const balance = await adjustBalance("PF", -amountBrl)

  const { error } = await db().from("positions").insert({
    user_id: userId,
    merchant_name: op.merchant_name,
    hash: op.hash,
    invested_brl: amountBrl,
    earned_brl: 0,
    apr: op.apr,
    liquidates_in_days: 30,
    status: "pending",
  })
  if (error) throw new Error(error.message)

  const pct = Math.min(100, Math.round((amountBrl / op.receivable_brl) * 100))
  await db().rpc("bump_opportunity", { p_id: op.id, p_pct: pct })

  await addTransaction({
    accountType: "PF",
    title: `Financiamento — ${op.merchant_name}`,
    subtitle: op.hash,
    amount_brl: amountBrl,
    is_credit: false,
    kind: "deposit",
  })

  return { balance }
}
