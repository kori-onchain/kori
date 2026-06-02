import { db } from "./client"
import type { Opportunity } from "./types"

export async function listOpportunities(): Promise<Opportunity[]> {
  const { data } = await db()
    .from("opportunities")
    .select("id, merchant_name, hash, receivable_brl, apr, risk, fill_pct")
    .order("fill_pct", { ascending: true })
  return (data ?? []).map((o) => ({
    ...o,
    receivable_brl: Number(o.receivable_brl),
    apr: Number(o.apr),
  })) as Opportunity[]
}
