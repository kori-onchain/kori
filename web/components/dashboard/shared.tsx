"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

/* ─── PRICES ─── */

export type PriceData = {
  solUsd: number
  solChange: number
  btcUsd: number
  btcChange: number
  ethUsd: number
  ethChange: number
  usdcBrl: number
  usdcChange: number
}

const FALLBACK: PriceData = {
  solUsd: 176.34,
  solChange: 1.09,
  btcUsd: 109687,
  btcChange: -0.4,
  ethUsd: 2584.2,
  ethChange: 1.74,
  usdcBrl: 5.43,
  usdcChange: 0.12,
}

export function usePrices() {
  const [prices, setPrices] = useState<PriceData>(FALLBACK)

  useEffect(() => {
    let active = true
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana,bitcoin,ethereum,usd-coin&vs_currencies=usd,brl&include_24hr_change=true"
    )
      .then((r) => r.json())
      .then((data) => {
        if (!active) return
        setPrices({
          solUsd: data.solana?.usd ?? FALLBACK.solUsd,
          solChange: data.solana?.usd_24h_change ?? FALLBACK.solChange,
          btcUsd: data.bitcoin?.usd ?? FALLBACK.btcUsd,
          btcChange: data.bitcoin?.usd_24h_change ?? FALLBACK.btcChange,
          ethUsd: data.ethereum?.usd ?? FALLBACK.ethUsd,
          ethChange: data.ethereum?.usd_24h_change ?? FALLBACK.ethChange,
          usdcBrl: data["usd-coin"]?.brl ?? FALLBACK.usdcBrl,
          usdcChange: data["usd-coin"]?.brl_24h_change ?? FALLBACK.usdcChange,
        })
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return prices
}

/* ─── FORMAT ─── */

export function fmtUsd(n: number) {
  if (n >= 1000)
    return "$" + n.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  return "$" + n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtBrl(n: number) {
  return "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtPct(n: number) {
  const sign = n >= 0 ? "+" : ""
  return sign + n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%"
}

/* ─── CRYPTO LOGOS ─── */

export function SolanaLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0">
      <circle cx="32" cy="32" r="32" fill="#0D0D12" />
      <g transform="translate(12 15) scale(0.1)">
        <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#sol-gradient)" />
        <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#sol-gradient)" />
        <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.6z" fill="url(#sol-gradient)" />
      </g>
    </svg>
  )
}

export function BitcoinLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="shrink-0">
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path fill="#fff" d="M23.19 14.02c.3-2.01-1.23-3.09-3.32-3.81l.68-2.72-1.66-.41-.66 2.65c-.44-.11-.89-.21-1.33-.31l.66-2.67-1.66-.41-.68 2.72c-.36-.08-.71-.16-1.06-.25l-2.29-.57-.44 1.77s1.23.28 1.2.3c.67.17.79.61.77.96l-.77 3.1.18.05-.18-.04-1.08 4.34c-.08.2-.29.51-.76.39.02.02-1.2-.3-1.2-.3l-.83 1.9 2.16.54c.4.1.8.21 1.18.31l-.68 2.75 1.66.41.68-2.73c.45.12.89.24 1.32.34l-.68 2.71 1.66.41.68-2.75c2.83.54 4.96.32 5.86-2.24.72-2.06-.04-3.25-1.53-4.02 1.08-.25 1.9-.97 2.12-2.44zm-3.79 5.38c-.51 2.06-3.98.94-5.1.67l.91-3.65c1.12.28 4.73.83 4.19 2.98zm.51-5.41c-.47 1.87-3.35.92-4.29.69l.83-3.31c.93.24 3.95.67 3.46 2.62z" />
    </svg>
  )
}

export function UsdcLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="shrink-0">
      <circle cx="16" cy="16" r="16" fill="#2775CA" />
      <path fill="#fff" d="M20.4 18.4c0-1.8-1.1-2.4-3.3-2.7-1.6-.2-1.9-.6-1.9-1.3 0-.7.5-1.1 1.5-1.1 1 0 1.4.3 1.7 1.1.04.12.15.2.28.2h.6c.16 0 .28-.12.27-.28a2.6 2.6 0 00-2.3-2.1V11c0-.15-.12-.27-.27-.27h-.6c-.15 0-.27.12-.27.27v1.2c-1.6.2-2.6 1.2-2.6 2.4 0 1.7 1 2.3 3.2 2.6 1.5.3 2 .6 2 1.4s-.7 1.3-1.6 1.3c-1.3 0-1.8-.5-2-1.3-.03-.13-.14-.22-.27-.22h-.7c-.16 0-.28.13-.26.29.2 1.2 1 2 2.6 2.3v1.2c0 .15.12.27.27.27h.6c.15 0 .27-.12.27-.27V20c1.7-.3 2.7-1.3 2.7-2.6z" />
      <path fill="#fff" d="M13.2 23.3A8.2 8.2 0 018.5 16c0-3 1.7-5.7 4.2-7l.5-.3c.12-.07.16-.22.08-.34l-.3-.5c-.08-.13-.24-.16-.36-.08l-.5.3A9 9 0 007.7 16a9 9 0 005 8c.16.09.24.04.28.03l.5-.3c.12-.08.15-.23.07-.35l-.3-.5c-.07-.12-.2-.16-.33-.1l-.6.3-.1.15zm5.6.3l.5.3c.12.07.27.04.35-.08l.3-.5c.07-.12.04-.27-.08-.35l-.5-.3a8.2 8.2 0 004.2-7c0-3-1.7-5.7-4.2-7l-.5-.3c-.12-.08-.27-.04-.35.08l-.3.5c-.07.12-.04.27.08.35l.5.3c2.2 1.2 3.8 3.6 3.8 6.5 0 3-1.7 5.7-4.2 7l.4.2z" />
    </svg>
  )
}

export function EthereumLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="shrink-0">
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <path fill="#fff" opacity=".6" d="M16.5 4v8.87l7.5 3.35z" />
      <path fill="#fff" d="M16.5 4L9 16.22l7.5-3.35z" />
      <path fill="#fff" opacity=".6" d="M16.5 21.97v6.02L24 17.62z" />
      <path fill="#fff" d="M16.5 27.99v-6.02L9 17.62z" />
      <path fill="#fff" opacity=".2" d="M16.5 20.57l7.5-4.35-7.5-3.35z" />
      <path fill="#fff" opacity=".6" d="M9 16.22l7.5 4.35v-7.7z" />
    </svg>
  )
}

export function RealIcon({ size = 9 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 4h6a4 4 0 010 8H7zM7 12h4l5 8M7 4v16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ─── DS COMPONENTS ─── */

export function SoftCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("soft-card rounded-2xl p-[18px]", className)}>{children}</div>
}

export function BizCell({ name, hash }: { name: string; hash: string }) {
  return (
    <div className="flex items-center gap-[11px]">
      <div className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] border border-ds-line bg-ds-bg-2 text-ds-dim">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8 H20 L19 20 A1 1 0 0 1 18 21 H6 A1 1 0 0 1 5 20 Z" /><path d="M9 8 V6 A3 3 0 0 1 15 6 V8" /></svg>
      </div>
      <div>
        <div className="text-[13px] font-semibold">{name}</div>
        <div className="mt-px font-mono text-[8px] text-ds-mute">{hash}</div>
      </div>
    </div>
  )
}
