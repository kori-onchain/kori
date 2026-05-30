import { createClient } from "@/lib/supabase/client"
import { getOrCreateWallet } from "@/lib/wallet"

export type AccountProfile = {
  id: string
  email?: string
  name?: string
  username?: string
  wallet_pubkey?: string
}

export function usernameFromEmail(email: string): string {
  return email
    .split("@")[0]
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .toLowerCase()
    .slice(0, 24) || "user"
}

export async function ensureAccountProfile(data?: {
  name?: string
  email?: string
}): Promise<AccountProfile> {
  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error(userError?.message || "Sessão não encontrada.")
  }

  const walletPubkey = getOrCreateWallet(user.id)
  const email = data?.email || user.email || ""
  const name = data?.name?.trim() || user.user_metadata?.name || email.split("@")[0] || "Usuário"
  const username = user.user_metadata?.username || usernameFromEmail(email)

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    name,
    username,
    account_type: user.user_metadata?.account_type || "PF",
    wallet_pubkey: walletPubkey,
  })

  if (error) {
    throw new Error(error.message || "Erro ao salvar perfil.")
  }

  return {
    id: user.id,
    email,
    name,
    username,
    wallet_pubkey: walletPubkey,
  }
}
