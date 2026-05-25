"use client"

import { ArrowRight, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#060607] p-8">
      <AuthBackground />

      <AuthCard>
        <AuthBrand />

        <div className="mb-7 text-center">
          <h1 className="mb-2 text-[27px] font-bold tracking-tight">Bem-vindo</h1>
          <p className="text-[13px] leading-relaxed text-ds-dim">Entre pra acessar seu fundo on-chain</p>
        </div>

        <div className="mb-3.5">
          <FieldLabel>Email</FieldLabel>
          <div className="relative">
            <Mail className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ds-mute" />
            <Input
              type="email"
              placeholder="voce@email.com"
              className="h-auto rounded-xl border-ds-line-2 bg-[#0e0e11] py-3.5 pr-4 pl-11 text-sm text-ds-ink placeholder:text-ds-mute focus-visible:border-ds-orange/40 focus-visible:ring-ds-orange/8"
            />
          </div>
        </div>

        <Button className="mt-1 h-auto w-full gap-2 rounded-[13px] border-0 bg-gradient-to-b from-white to-[#f0f0f2] py-[15px] text-sm font-semibold text-[#0a0a0a] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_6px_16px_-8px_rgba(0,0,0,0.5)]">
          Continuar
          <ArrowRight className="size-[15px]" />
        </Button>

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
