"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Lock, Mail, User, Wallet } from "lucide-react"
import { usePrivy } from "@privy-io/react-auth"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ensureAccountProfile, usernameFromEmail } from "@/lib/account"
import { createClient } from "@/lib/supabase/client"

import {
  AuthBackground,
  AuthBrand,
  AuthCard,
  AuthFooter,
  FieldLabel,
} from "./auth-shared"

export function RegisterScreen() {
  const router = useRouter()
  const { login, authenticated, ready } = usePrivy()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard")
      router.refresh()
    }
  }, [ready, authenticated, router])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Nome é obrigatório.")
      return
    }
    if (!email.trim()) {
      setError("E-mail é obrigatório.")
      return
    }
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.")
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          name: name.trim(),
          username: usernameFromEmail(email.trim().toLowerCase()),
          account_type: "PF",
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (!data.session) {
      setError("Conta criada. Confirme seu e-mail antes de entrar.")
      setLoading(false)
      return
    }

    try {
      await ensureAccountProfile({
        name: name.trim(),
        email: email.trim().toLowerCase(),
      })
    } catch (profileError) {
      setError(profileError instanceof Error ? profileError.message : "Erro ao criar perfil.")
      setLoading(false)
      return
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
          <h1 className="mb-2 text-[27px] font-bold tracking-tight">Criar conta</h1>
          <p className="text-[13px] leading-relaxed text-ds-dim">Comece a investir no fundo on-chain</p>
        </div>

        <button
          type="button"
          onClick={() => login()}
          disabled={!ready}
          className="glossy-orange-btn glossy-orange-btn--full mb-4 py-[14px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="glossy-orange-btn__icon" aria-hidden="true">
            <Wallet />
          </span>
          <span>Criar conta com carteira Kori</span>
        </button>

        <div className="my-2 flex items-center gap-3.5">
          <span className="h-px flex-1 bg-ds-line" />
          <span className="font-mono text-[10px] tracking-[0.1em] text-ds-mute">OU E-MAIL (PREVIEW)</span>
          <span className="h-px flex-1 bg-ds-line" />
        </div>

        <form onSubmit={handleRegister}>
          <div className="mb-3.5">
            <FieldLabel>Nome completo</FieldLabel>
            <div className="relative">
              <User className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ds-mute" />
              <Input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError(null)
                }}
                className="h-auto rounded-xl border-ds-line-2 bg-ds-bg-1 py-3.5 pr-4 pl-11 text-sm text-ds-ink placeholder:text-ds-mute focus-visible:border-ds-orange/40 focus-visible:ring-ds-orange/8"
              />
            </div>
          </div>

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
                placeholder="Mínimo 6 caracteres"
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
            {loading ? "Criando conta..." : "Criar conta"}
            {!loading && <ArrowRight className="size-[15px]" />}
          </Button>
        </form>

        <p className="mt-4 text-center text-[13px] text-ds-dim">
          Já tem conta?{" "}
          <a href="/login" className="font-semibold text-ds-orange no-underline">Entrar</a>
        </p>

        <AuthFooter />
      </AuthCard>
    </div>
  )
}
