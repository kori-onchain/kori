"use client"

import { useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"

import { setPrivyTokenGetter, setActiveAccountContext } from "@/lib/api/client"
import { createClient } from "@/lib/supabase/client"

/**
 * Liga o web ao stack real:
 *  - registra o token do Privy no apiClient (Bearer pra API NestJS);
 *  - mantém o contexto de conta (PF/PJ → X-Wallet-Index / X-Account-Type);
 *  - garante uma sessão Supabase (anônima) pro fallback de dados quando a
 *    API real não estiver no ar (modo preview).
 */
export function ApiBridge({ accountType }: { accountType: "PF" | "PJ" }) {
  const { getAccessToken, ready, authenticated } = usePrivy()

  // Token getter do apiClient (uma vez).
  useEffect(() => {
    setPrivyTokenGetter(async () => {
      try {
        return await getAccessToken()
      } catch {
        return null
      }
    })
  }, [getAccessToken])

  // Contexto de conta a cada troca PF/PJ.
  useEffect(() => {
    setActiveAccountContext(accountType)
  }, [accountType])

  // Sessão Supabase pro fallback (anônima se ainda não houver sessão).
  useEffect(() => {
    if (!ready) return
    let active = true
    ;(async () => {
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!active || session) return
        await supabase.auth.signInAnonymously()
      } catch {
        // anon auth pode estar desabilitado — fallback fica vazio (preview)
      }
    })()
    return () => {
      active = false
    }
  }, [ready, authenticated])

  return null
}
