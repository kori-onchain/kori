import { createClient } from "@/lib/supabase/client"

/** Cliente Supabase (browser) + helpers compartilhados pela camada de dados. */
export function db() {
  return createClient()
}

/** Id do usuário logado (ou erro se a sessão sumiu). */
export async function requireUserId(): Promise<string> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Sessão não encontrada.")
  return user.id
}

export const formatBRL = (value: number): string =>
  `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
