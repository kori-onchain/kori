import { db, requireUserId } from "./client"
import { apiClient, centsToBrl } from "@/lib/api/client"
import { MOCK_ENABLED, mock } from "@/lib/mock/store"
import type { Card } from "./types"

type KoraCard = {
  id: string
  name: string
  network: string
  currency: string
  last4: string
  cardNumber?: string
  expiry?: string
  cvv?: string
  isFrozen: boolean
  isOnlineEnabled: boolean
  limitTotalCents: number
  limitUsedCents?: number
  openPrincipalCents?: number
  availableLimitCents?: number
}

export async function getCard(): Promise<Card | null> {
  if (MOCK_ENABLED) return mock.getCard()
  async function fallback(): Promise<Card | null> {
    const userId = await requireUserId()
    const { data } = await db()
      .from("cards")
      .select("number, expiry, cvv, is_frozen, online_enabled, international_enabled, limit_brl, invoice_brl")
      .eq("user_id", userId)
      .maybeSingle()
    if (!data) return null
    return {
      ...data,
      limit_brl: Number(data.limit_brl),
      invoice_brl: Number(data.invoice_brl),
    } as Card
  }

  try {
    const cards = await apiClient.get<KoraCard[]>("/cards")
    const c = cards?.[0]
    if (!c) return fallback()
    return {
      number: c.cardNumber || "•••• •••• •••• " + c.last4,
      expiry: c.expiry || "",
      cvv: c.cvv || "",
      is_frozen: c.isFrozen,
      online_enabled: c.isOnlineEnabled,
      international_enabled: true,
      limit_brl: centsToBrl(c.limitTotalCents),
      invoice_brl: centsToBrl(c.openPrincipalCents ?? c.limitUsedCents ?? 0),
    }
  } catch {
    return fallback()
  }
}

export async function updateCardFlags(
  flags: Partial<Pick<Card, "is_frozen" | "online_enabled" | "international_enabled">>,
): Promise<void> {
  if (MOCK_ENABLED) return mock.updateCardFlags(flags)
  async function fallback(): Promise<void> {
    const userId = await requireUserId()
    const { error } = await db().from("cards").update(flags).eq("user_id", userId)
    if (error) throw new Error(error.message)
  }

  // international_enabled has no API endpoint. When it's the only field being
  // changed, there is nothing to send to the API → use the fallback directly.
  const touchesFreeze = flags.is_frozen !== undefined
  const touchesOnline = flags.online_enabled !== undefined
  if (!touchesFreeze && !touchesOnline) return fallback()

  try {
    const cards = await apiClient.get<KoraCard[]>("/cards")
    const c = cards?.[0]
    if (!c) return fallback()
    if (touchesFreeze) await apiClient.patch<KoraCard>(`/cards/${c.id}/freeze`)
    if (touchesOnline) await apiClient.patch<KoraCard>(`/cards/${c.id}/online`)
  } catch {
    return fallback()
  }
}

export async function updateCard(
  patch: Partial<Pick<Card, "number" | "expiry" | "cvv" | "is_frozen" | "online_enabled" | "international_enabled">>,
): Promise<void> {
  if (MOCK_ENABLED) return mock.updateCard(patch)
  async function fallback(): Promise<void> {
    const userId = await requireUserId()
    const { error } = await db().from("cards").update(patch).eq("user_id", userId)
    if (error) throw new Error(error.message)
  }

  // Only the card-number regeneration flow has a real API endpoint.
  if (patch.number === undefined) return fallback()

  try {
    const cards = await apiClient.get<KoraCard[]>("/cards")
    const c = cards?.[0]
    if (!c) return fallback()
    await apiClient.post<KoraCard>(`/cards/${c.id}/regenerate`)
  } catch {
    return fallback()
  }
}
