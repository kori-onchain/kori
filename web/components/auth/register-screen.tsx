"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Lock, Mail, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { createWallet } from "@/lib/wallet"

import {
  AuthBackground,
  AuthBrand,
  AuthCard,
  AuthDivider,
  AuthFooter,
  AuthProviders,
  FieldLabel,
} from "./auth-shared"

export function RegisterScreen() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const pubkey = createWallet()
      await supabase
        .from("profiles")
        .update({ name: name.trim(), wallet_pubkey: pubkey })
        .eq("id", data.user.id)
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#060607] p-8">
      <AuthBackground />

      <AuthCard>
        <AuthBrand />

        <div className="mb-7 text-center">
          <h1 className="mb-2 text-[27px] font-bold tracking-tight">Criar conta</h1>
          <p className="text-[13px] leading-relaxed text-ds-dim">Comece a investir no fundo on-chain</p>
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
                className="h-auto rounded-xl border-ds-line-2 bg-[#0e0e11] py-3.5 pr-4 pl-11 text-sm text-ds-ink placeholder:text-ds-mute focus-visible:border-ds-orange/40 focus-visible:ring-ds-orange/8"
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
                className="h-auto rounded-xl border-ds-line-2 bg-[#0e0e11] py-3.5 pr-4 pl-11 text-sm text-ds-ink placeholder:text-ds-mute focus-visible:border-ds-orange/40 focus-visible:ring-ds-orange/8"
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
                className="h-auto rounded-xl border-ds-line-2 bg-[#0e0e11] py-3.5 pr-4 pl-11 text-sm text-ds-ink placeholder:text-ds-mute focus-visible:border-ds-orange/40 focus-visible:ring-ds-orange/8"
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
            className="mt-1 h-auto w-full gap-2 rounded-[13px] border-0 bg-gradient-to-b from-white to-[#f0f0f2] py-[15px] text-sm font-semibold text-[#0a0a0a] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_6px_16px_-8px_rgba(0,0,0,0.5)] disabled:opacity-60"
          >
            {loading ? "Criando conta..." : "Criar conta"}
            {!loading && <ArrowRight className="size-[15px]" />}
          </Button>
        </form>

        <p className="mt-4 text-center text-[13px] text-ds-dim">
          Já tem conta?{" "}
          <a href="/login" className="font-semibold text-ds-orange no-underline">Entrar</a>
        </p>

        <AuthDivider />
        <AuthProviders />
        <AuthFooter />
      </AuthCard>
    </div>
  )
}
