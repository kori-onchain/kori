import { db, requireUserId } from "./client"
import type { Contact } from "./types"

export async function listContacts(): Promise<Contact[]> {
  const userId = await requireUserId()
  const { data } = await db()
    .from("contacts")
    .select("id, name, wallet_id, initials, is_favorite")
    .eq("user_id", userId)
    .order("is_favorite", { ascending: false })
    .order("created_at", { ascending: true })
  return (data ?? []) as Contact[]
}

function initialsFrom(name: string | null, wallet: string): string {
  const base = (name || wallet.replace(/^@/, "")).trim()
  const parts = base.split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || base.slice(0, 2).toUpperCase()
}

export async function addContact(input: {
  name?: string | null
  wallet_id: string
  is_favorite?: boolean
}): Promise<Contact> {
  const userId = await requireUserId()
  const { data, error } = await db()
    .from("contacts")
    .insert({
      user_id: userId,
      name: input.name?.trim() || null,
      wallet_id: input.wallet_id,
      initials: initialsFrom(input.name ?? null, input.wallet_id),
      is_favorite: input.is_favorite ?? false,
    })
    .select("id, name, wallet_id, initials, is_favorite")
    .single()
  if (error) throw new Error(error.message)
  return data as Contact
}

export async function toggleFavorite(id: string, value: boolean): Promise<void> {
  const userId = await requireUserId()
  await db().from("contacts").update({ is_favorite: value }).eq("id", id).eq("user_id", userId)
}
