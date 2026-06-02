import { db, requireUserId } from "./client"
import { adjustBalance } from "./accounts"
import { addTransaction } from "./transactions"
import { apiClient, centsToBrl, brlToCents } from "@/lib/api/client"
import { MOCK_ENABLED, mock } from "@/lib/mock/store"
import type { Sale } from "./types"

type KoraSale = {
  id: string
  buyerName: string
  amountCents: number
  currency?: string
  status: string
  createdAt: string
  items?: Array<{ id: string; qty: number; priceCents: number; product?: unknown }>
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || name.slice(0, 2).toUpperCase()
}

function mapKoraSale(s: KoraSale): Sale {
  return {
    id: s.id,
    customer_name: s.buyerName,
    initials: initialsFrom(s.buyerName).slice(0, 2),
    items: s.items?.length || 1,
    amount_brl: centsToBrl(s.amountCents),
    method: "Pix",
    created_at: s.createdAt,
  }
}

export async function listSales(limit = 50): Promise<Sale[]> {
  if (MOCK_ENABLED) return mock.listSales(limit)
  async function fallback(): Promise<Sale[]> {
    const userId = await requireUserId()
    const { data } = await db()
      .from("sales")
      .select("id, customer_name, initials, items, amount_brl, method, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)
    return (data ?? []).map((s) => ({ ...s, amount_brl: Number(s.amount_brl) })) as Sale[]
  }

  try {
    const sales = await apiClient.get<KoraSale[]>("/merchant/sales")
    if (!sales || sales.length === 0) return await fallback()
    return sales
      .map(mapKoraSale)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
  } catch {
    return await fallback()
  }
}

/** Registra uma venda, credita o saldo PJ e grava a transação. */
export async function addSale(input: {
  customer_name: string
  items?: number
  amount_brl: number
  method?: string
}): Promise<Sale> {
  if (MOCK_ENABLED) return mock.addSale(input)
  async function fallback(): Promise<Sale> {
    const userId = await requireUserId()
    const { data, error } = await db()
      .from("sales")
      .insert({
        user_id: userId,
        customer_name: input.customer_name,
        initials: initialsFrom(input.customer_name),
        items: input.items ?? 1,
        amount_brl: input.amount_brl,
        method: input.method ?? "Pix",
      })
      .select("id, customer_name, initials, items, amount_brl, method, created_at")
      .single()
    if (error) throw new Error(error.message)

    await adjustBalance("PJ", input.amount_brl)
    await addTransaction({
      accountType: "PJ",
      title: `Venda — ${input.customer_name}`,
      subtitle: `${input.items ?? 1} item(ns)`,
      amount_brl: input.amount_brl,
      is_credit: true,
      initials: data.initials,
      kind: "sale",
    })

    return { ...data, amount_brl: Number(data.amount_brl) } as Sale
  }

  try {
    const sale = await apiClient.post<KoraSale>("/merchant/sales", {
      buyerName: input.customer_name,
      installmentsCount: 1,
      items: [{ name: "Venda", qty: input.items ?? 1, priceCents: brlToCents(input.amount_brl) }],
    })
    return mapKoraSale(sale)
  } catch {
    return await fallback()
  }
}
