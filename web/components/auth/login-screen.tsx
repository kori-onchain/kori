"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Lock, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { createWallet, hasWallet } from "@/lib/wallet"

import {
  AuthBackground,
  AuthBrand,
  AuthCard,
  AuthDivider,
  AuthFooter,
  AuthProviders,
  FieldLabel,
} from "./auth-shared"

export function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Preencha e-mail e senha.")
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (signInError) {
      setError(
        signInError.message.includes("Invalid login")
          ? "E-mail ou senha incorretos."
          : signInError.message,
      )
      setLoading(false)
      return
    }

    if (!hasWallet()) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const pubkey = createWallet()
        await supabase
          .from("profiles")
          .update({ wallet_pubkey: pubkey })
          .eq("id", user.id)
      }
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-ds-bg p-8">
      <AuthBackground />

      <AuthCard>
        <AuthBrand />

        <div className="mb-7 text-center">
          <h1 className="mb-2 text-[27px] font-bold tracking-tight">Bem-vindo</h1>
          <p className="text-[13px] leading-relaxed text-ds-dim">Entre pra acessar seu fundo on-chain</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3.5">
            <FieldLabel>Email</FieldLabel>
            <div className="relative">
              <Mail className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ds-mute" />
              <Input
                type="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
                className="h-auto rounded-xl border-ds-line-2 bg-ds-bg-1 py-3.5 pr-4 pl-11 text-sm text-ds-ink placeholder:text-ds-mute focus-visible:border-ds-orange/40 focus-visible:ring-ds-orange/8"
              />
            </div>
          </div>

          <div className="mb-3.5">
            <FieldLabel>Senha</FieldLabel>
            <div className="relative">
              <Lock className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ds-mute" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                className="h-auto rounded-xl border-ds-line-2 bg-ds-bg-1 py-3.5 pr-4 pl-11 text-sm text-ds-ink placeholder:text-ds-mute focus-visible:border-ds-orange/40 focus-visible:ring-ds-orange/8"
              />
            </div>
          </div>

          {error && (
            <div className="mb-3 rounded-xl border border-ds-red/20 bg-ds-red/5 px-4 py-3 text-[12px] font-medium text-ds-red">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="mt-1 h-auto w-full gap-2 rounded-[13px] border-0 bg-ds-ink py-[15px] text-sm font-semibold text-ds-bg shadow-[0_6px_16px_-8px_rgba(0,0,0,0.5)] hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Continuar"}
            {!loading && <ArrowRight className="size-[15px]" />}
          </Button>
        </form>

        <p className="mt-4 text-center text-[13px] text-ds-dim">
          Não tem conta?{" "}
          <a href="/register" className="font-semibold text-ds-orange no-underline">Criar agora</a>
        </p>

        <AuthDivider />
        <AuthProviders />
        <AuthFooter />
      </AuthCard>
    </div>
  )
}
