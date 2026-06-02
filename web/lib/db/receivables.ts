import { db, requireUserId } from "./client"
import { adjustBalance } from "./accounts"
import { addTransaction } from "./transactions"
import { apiClient, centsToBrl } from "@/lib/api/client"
import { MOCK_ENABLED, mock } from "@/lib/mock/store"
import type { Receivable } from "./types"

type KoraReceivable = {
  id: string
  status: "PENDING" | "ANTICIPATED" | string
  currency: string
  grossAmountCents: number
  netAmountCents: number
  installmentsCount?: number
  dueDate: string
  sale?: { items?: Array<{ product?: { name?: string }; name?: string }> }
}

export async function listReceivables(): Promise<Receivable[]> {
  if (MOCK_ENABLED) return mock.listReceivables()
  async function fallback(): Promise<Receivable[]> {
    const userId = await requireUserId()
    const { data } = await db()
      .from("receivables")
      .select("id, description, due_date, gross_value, net_value, installments, status")
      .eq("user_id", userId)
      .order("due_date", { ascending: true })
    return (data ?? []).map((r) => ({
      ...r,
      gross_value: Number(r.gross_value),
      net_value: Number(r.net_value),
    })) as Receivable[]
  }

  try {
    const list = await apiClient.get<KoraReceivable[]>("/receivables")
    if (!Array.isArray(list) || list.length === 0) return fallback()
    return list.map((r) => ({
      id: r.id,
      description:
        r.sale?.items?.[0]?.product?.name || r.sale?.items?.[0]?.name || "Recebível",
      due_date: r.dueDate ? r.dueDate.slice(0, 10) : null,
      gross_value: centsToBrl(r.grossAmountCents),
      net_value: centsToBrl(r.netAmountCents),
      installments: r.installmentsCount ? `${r.installmentsCount}x` : null,
      status: r.status === "ANTICIPATED" ? "antecipado" : "pendente",
    }))
  } catch {
    return fallback()
  }
}

/**
 * Antecipa os recebíveis selecionados: marca como `antecipado`, credita o
 * valor líquido no saldo PJ e registra a transação. Retorna o total creditado.
 */
export async function advanceReceivables(ids: string[]): Promise<{ net: number; balance: number }> {
  if (MOCK_ENABLED) return mock.advanceReceivables(ids)
  if (ids.length === 0) throw new Error("Selecione ao menos um recebível.")
  const userId = await requireUserId()

  const { data: rows } = await db()
    .from("receivables")
    .select("id, net_value, status")
    .in("id", ids)
    .eq("user_id", userId)
    .eq("status", "pendente")

  const pending = (rows ?? []) as { id: string; net_value: number }[]
  if (pending.length === 0) throw new Error("Nenhum recebível pendente selecionado.")

  const net = pending.reduce((sum, r) => sum + Number(r.net_value), 0)

  const { error } = await db()
    .from("receivables")
    .update({ status: "antecipado" })
    .in(
      "id",
      pending.map((r) => r.id),
    )
    .eq("user_id", userId)
  if (error) throw new Error(error.message)

  const balance = await adjustBalance("PJ", net)
  await addTransaction({
    accountType: "PJ",
    title: "Antecipação de recebíveis",
    subtitle: `${pending.length} recebível(is)`,
    amount_brl: net,
    is_credit: true,
    kind: "advance",
  })

  return { net, balance }
}
