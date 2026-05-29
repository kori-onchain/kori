"use client"

import { useCallback, useEffect } from "react"
import { CheckCircle2, Download } from "lucide-react"

import { AuthBackground, AuthBrand, AuthCard } from "@/components/auth/auth-shared"

// Quando o APK estiver disponível, basta colocá-lo em /public e ajustar aqui.
const APK_URL = "/kori.apk"

export function DownloadThanks() {
  const startDownload = useCallback(() => {
    const a = document.createElement("a")
    a.href = APK_URL
    a.download = ""
    document.body.appendChild(a)
    a.click()
    a.remove()
  }, [])

  useEffect(() => {
    startDownload()
  }, [startDownload])

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#060607] p-8">
      <AuthBackground />

      <AuthCard>
        <AuthBrand />

        <div className="mb-7 flex flex-col items-center text-center">
          <span className="mb-5 flex size-14 items-center justify-center rounded-full border border-ds-orange/25 bg-ds-orange/10 text-ds-orange">
            <CheckCircle2 className="size-7" />
          </span>
          <h1 className="mb-2 text-[27px] font-bold tracking-tight">
            Obrigado por baixar
          </h1>
          <p className="max-w-[300px] text-[13px] leading-relaxed text-ds-dim">
            O download do app Kori para Android deve começar automaticamente. Se
            não iniciar, tente novamente abaixo.
          </p>
        </div>

        <button
          type="button"
          onClick={startDownload}
          className="glossy-orange-btn glossy-orange-btn--full"
        >
          <span className="glossy-orange-btn__icon" aria-hidden="true">
            <Download />
          </span>
          <span>Tentar novamente</span>
        </button>

        <p className="mt-4 text-center text-[13px] text-ds-dim">
          <a href="/" className="font-semibold text-ds-orange no-underline">
            Voltar ao início
          </a>
        </p>
      </AuthCard>
    </div>
  )
}
