"use client"

import { useEffect, useState } from "react"
import {
  Activity,
  ArrowUpDown,
  Bell,
  ChevronDown,
  CircleDollarSign,
  DollarSign,
  FileText,
  Globe,
  Layers,
  LayoutGrid,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Store,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

/* ─── PRICES ─── */

type PriceData = {
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

function usePrices() {
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
          solChange:
            data.solana?.usd_24h_change ?? FALLBACK.solChange,
          btcUsd: data.bitcoin?.usd ?? FALLBACK.btcUsd,
          btcChange:
            data.bitcoin?.usd_24h_change ?? FALLBACK.btcChange,
          ethUsd: data.ethereum?.usd ?? FALLBACK.ethUsd,
          ethChange:
            data.ethereum?.usd_24h_change ?? FALLBACK.ethChange,
          usdcBrl: data["usd-coin"]?.brl ?? FALLBACK.usdcBrl,
          usdcChange:
            data["usd-coin"]?.brl_24h_change ?? FALLBACK.usdcChange,
        })
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return prices
}

function fmtUsd(n: number) {
  if (n >= 1000)
    return (
      "$" +
      n.toLocaleString("pt-BR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    )
  return (
    "$" +
    n.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  )
}

function fmtBrl(n: number) {
  return (
    "R$ " +
    n.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  )
}

function fmtPct(n: number) {
  const sign = n >= 0 ? "+" : ""
  return (
    sign +
    n.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) +
    "%"
  )
}

/* ─── DATA ─── */

const positions = [
  { name: "Mercado São Jorge", hash: "9Hpb...2nQa", invested: "R$ 2.000", earned: "+R$ 18,40", apr: "14,2%", days: "12d", status: "active" as const },
  { name: "Ótica Visão", hash: "3Fmq...8tLp", invested: "R$ 1.500", earned: "+R$ 22,60", apr: "16,5%", days: "28d", status: "active" as const },
  { name: "Café Central", hash: "5KJp...3wWf", invested: "R$ 1.500", earned: "+R$ 14,10", apr: "13,8%", days: "3d", status: "pending" as const },
  { name: "Studio Bem-Estar", hash: "2Wny...6kRm", invested: "R$ 980", earned: "+R$ 9,80", apr: "18,1%", days: "45d", status: "active" as const },
  { name: "Padaria Aurora", hash: "8Wnz...1kPm", invested: "R$ 2.440", earned: "+R$ 31,20", apr: "15,0%", days: "19d", status: "active" as const },
]

const marketplaceItems = [
  { idx: 1, name: "Padaria Aurora", hash: "8Wnz...1kPm", receivable: "R$ 3.100", apr: "15,0%", risk: "low" as const, fill: 28 },
  { idx: 2, name: "Floricultura Bela", hash: "6Tyu...9pLk", receivable: "R$ 1.800", apr: "14,5%", risk: "low" as const, fill: 52 },
  { idx: 3, name: "Pet Shop Amigo", hash: "4Rew...2mNb", receivable: "R$ 2.300", apr: "13,9%", risk: "low" as const, fill: 71 },
]

/* ─── CRYPTO LOGOS ─── */

function SolanaLogo({ size = 18 }: { size?: number }) {
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

function BitcoinLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="shrink-0">
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path fill="#fff" d="M23.19 14.02c.3-2.01-1.23-3.09-3.32-3.81l.68-2.72-1.66-.41-.66 2.65c-.44-.11-.89-.21-1.33-.31l.66-2.67-1.66-.41-.68 2.72c-.36-.08-.71-.16-1.06-.25l-2.29-.57-.44 1.77s1.23.28 1.2.3c.67.17.79.61.77.96l-.77 3.1.18.05-.18-.04-1.08 4.34c-.08.2-.29.51-.76.39.02.02-1.2-.3-1.2-.3l-.83 1.9 2.16.54c.4.1.8.21 1.18.31l-.68 2.75 1.66.41.68-2.73c.45.12.89.24 1.32.34l-.68 2.71 1.66.41.68-2.75c2.83.54 4.96.32 5.86-2.24.72-2.06-.04-3.25-1.53-4.02 1.08-.25 1.9-.97 2.12-2.44zm-3.79 5.38c-.51 2.06-3.98.94-5.1.67l.91-3.65c1.12.28 4.73.83 4.19 2.98zm.51-5.41c-.47 1.87-3.35.92-4.29.69l.83-3.31c.93.24 3.95.67 3.46 2.62z" />
    </svg>
  )
}

function UsdcLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="shrink-0">
      <circle cx="16" cy="16" r="16" fill="#2775CA" />
      <path fill="#fff" d="M20.4 18.4c0-1.8-1.1-2.4-3.3-2.7-1.6-.2-1.9-.6-1.9-1.3 0-.7.5-1.1 1.5-1.1 1 0 1.4.3 1.7 1.1.04.12.15.2.28.2h.6c.16 0 .28-.12.27-.28a2.6 2.6 0 00-2.3-2.1V11c0-.15-.12-.27-.27-.27h-.6c-.15 0-.27.12-.27.27v1.2c-1.6.2-2.6 1.2-2.6 2.4 0 1.7 1 2.3 3.2 2.6 1.5.3 2 .6 2 1.4s-.7 1.3-1.6 1.3c-1.3 0-1.8-.5-2-1.3-.03-.13-.14-.22-.27-.22h-.7c-.16 0-.28.13-.26.29.2 1.2 1 2 2.6 2.3v1.2c0 .15.12.27.27.27h.6c.15 0 .27-.12.27-.27V20c1.7-.3 2.7-1.3 2.7-2.6z" />
      <path fill="#fff" d="M13.2 23.3A8.2 8.2 0 018.5 16c0-3 1.7-5.7 4.2-7l.5-.3c.12-.07.16-.22.08-.34l-.3-.5c-.08-.13-.24-.16-.36-.08l-.5.3A9 9 0 007.7 16a9 9 0 005 8c.16.09.24.04.28.03l.5-.3c.12-.08.15-.23.07-.35l-.3-.5c-.07-.12-.2-.16-.33-.1l-.6.3-.1.15zm5.6.3l.5.3c.12.07.27.04.35-.08l.3-.5c.07-.12.04-.27-.08-.35l-.5-.3a8.2 8.2 0 004.2-7c0-3-1.7-5.7-4.2-7l-.5-.3c-.12-.08-.27-.04-.35.08l-.3.5c-.07.12-.04.27.08.35l.5.3c2.2 1.2 3.8 3.6 3.8 6.5 0 3-1.7 5.7-4.2 7l.4.2z" />
    </svg>
  )
}

function EthereumLogo({ size = 18 }: { size?: number }) {
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

function RealIcon({ size = 9 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 4h6a4 4 0 010 8H7zM7 12h4l5 8M7 4v16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ─── DS COMPONENTS ─── */

function SoftCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("soft-card rounded-2xl p-[18px]", className)}>{children}</div>
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  badge,
}: {
  href: string
  icon: typeof LayoutGrid
  label: string
  active?: boolean
  badge?: string
}) {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-[11px] py-2.5 px-3 rounded-[9px] text-[13px] font-medium relative no-underline [&_svg]:shrink-0",
        active
          ? "soft-card-sm text-ds-orange"
          : "text-ds-mute hover:text-ds-dim"
      )}
    >
      <Icon className="size-[17px]" />
      <span>{label}</span>
      {badge && (
        <Badge variant="secondary" className="ml-auto h-auto bg-ds-orange/10 px-1.5 py-0.5 font-mono text-[8px] text-ds-orange">
          {badge}
        </Badge>
      )}
    </a>
  )
}

function BizCell({ name, hash }: { name: string; hash: string }) {
  return (
    <div className="flex items-center gap-[11px]">
      <div className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] border border-ds-line bg-ds-bg-2 text-ds-dim">
        <Store className="size-3.5" />
      </div>
      <div>
        <div className="text-[13px] font-semibold">{name}</div>
        <div className="mt-px font-mono text-[8px] text-ds-mute">{hash}</div>
      </div>
    </div>
  )
}

/* ─── TICKER ─── */

function TickerItem({ logo, name, price, change, up }: { logo: React.ReactNode; name: string; price: string; change: string; up: boolean }) {
  return (
    <div className="flex items-center gap-[9px] whitespace-nowrap border-r border-ds-line px-[18px] py-2.5">
      {logo}
      <span className="font-mono text-[10px] text-ds-dim">{name}</span>
      <span className="font-mono text-[11px] font-semibold">{price}</span>
      <span className={cn("font-mono text-[9px]", up ? "text-ds-green" : "text-ds-red")}>{change}</span>
    </div>
  )
}

function FundIcon({ icon: Icon }: { icon: typeof Activity }) {
  return (
    <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-ds-orange/10 text-ds-orange">
      <Icon className="size-[11px]" />
    </span>
  )
}

function Ticker({ prices }: { prices: PriceData }) {
  const items = [
    { id: "sol", logo: <SolanaLogo size={18} />, name: "SOL/USD", price: fmtUsd(prices.solUsd), change: fmtPct(prices.solChange), up: prices.solChange >= 0 },
    { id: "usdc", logo: <UsdcLogo size={18} />, name: "USDC/BRL", price: fmtBrl(prices.usdcBrl), change: fmtPct(prices.usdcChange), up: prices.usdcChange >= 0 },
    { id: "tvl", logo: <FundIcon icon={CircleDollarSign} />, name: "TVL DO FUNDO", price: "R$ 1,82M", change: "+4,2%", up: true },
    { id: "btc", logo: <BitcoinLogo size={18} />, name: "BTC/USD", price: fmtUsd(prices.btcUsd), change: fmtPct(prices.btcChange), up: prices.btcChange >= 0 },
    { id: "apr", logo: <FundIcon icon={Activity} />, name: "APR MÉDIO", price: "14,8%", change: "+0,3%", up: true },
    { id: "eth", logo: <EthereumLogo size={18} />, name: "ETH/USD", price: fmtUsd(prices.ethUsd), change: fmtPct(prices.ethChange), up: prices.ethChange >= 0 },
    { id: "comercios", logo: <FundIcon icon={Store} />, name: "COMÉRCIOS ATIVOS", price: "42", change: "+3 esta semana", up: true },
    { id: "recebiveis", logo: <FundIcon icon={FileText} />, name: "RECEBÍVEIS POOL", price: "R$ 890K", change: "12 abertos", up: true },
  ]

  return (
    <div className="relative overflow-hidden border-b border-ds-line before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-10 before:bg-gradient-to-r before:from-ds-bg before:to-transparent before:content-[''] after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-10 after:bg-gradient-to-l after:from-ds-bg after:to-transparent after:content-['']">
      <div className="flex w-max animate-ticker hover:[animation-play-state:paused]">
        {items.map((t) => <TickerItem key={t.id} {...t} />)}
        {items.map((t) => <TickerItem key={`d-${t.id}`} {...t} />)}
      </div>
    </div>
  )
}

/* ─── DASHBOARD ─── */

export function DashboardShell() {
  const prices = usePrices()
  const depositBrl = 500
  const usdcOut = depositBrl / prices.usdcBrl

  return (
    <main className="grid min-h-svh grid-cols-[224px_1fr] bg-ds-bg text-ds-ink">
      {/* ─── SIDEBAR ─── */}
      <aside className="sticky top-0 flex h-svh flex-col overflow-y-auto border-r border-ds-line p-5 px-3.5">
        <div className="mb-2 flex items-center gap-2.5 px-2">
          <svg width={22} height={26} className="text-ds-ink"><use href="#kora-k" /></svg>
          <div>
            <span className="text-base font-bold">Kora</span>
            <span className="mt-px block font-mono text-[7px] tracking-[0.1em] text-ds-mute">FUNDO ON-CHAIN</span>
          </div>
        </div>

        <div className="mx-1 mt-3.5 mb-5 flex gap-0.5 rounded-[10px] border border-ds-line bg-[#0e0e11] p-0.5">
          <button className="soft-card-sm flex-1 rounded-[7px] py-[7px] text-center text-[11px] font-semibold text-ds-ink">Investidor</button>
          <button className="flex-1 rounded-[7px] py-[7px] text-center text-[11px] font-semibold text-ds-mute">Comércio</button>
        </div>

        <div className="mb-[7px] mt-4 px-2.5 font-mono text-[8px] uppercase tracking-[0.15em] text-ds-faint">Geral</div>
        <NavItem href="#" icon={LayoutGrid} label="Dashboard" active />
        <NavItem href="#" icon={CircleDollarSign} label="O Fundo" />
        <NavItem href="#" icon={Layers} label="Meu portfólio" />

        <div className="mb-[7px] mt-4 px-2.5 font-mono text-[8px] uppercase tracking-[0.15em] text-ds-faint">Operação</div>
        <NavItem href="#" icon={Store} label="Comércios" badge="42" />
        <NavItem href="#" icon={FileText} label="Recebíveis" />
        <NavItem href="#" icon={Activity} label="Transações" />
        <NavItem href="#" icon={Globe} label="Explorer" />

        <div className="mb-[7px] mt-4 px-2.5 font-mono text-[8px] uppercase tracking-[0.15em] text-ds-faint">Outros</div>
        <NavItem href="#" icon={Settings} label="Ajustes" />

        <div className="mt-auto">
          <div className="soft-card-sm flex items-center gap-[9px] rounded-[11px] p-2.5">
            <div className="relative flex size-[30px] shrink-0 items-center justify-center rounded-full border border-ds-line bg-ds-elev">
              <svg width={13} height={16}><use href="#kora-k" /></svg>
              <span className="absolute -right-[3px] -bottom-0.5 flex size-3.5 items-center justify-center rounded-full border border-ds-line-2 bg-ds-bg">
                <SolanaLogo size={12} />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold">Kauã Miguel</div>
              <div className="font-mono text-[8px] text-ds-mute">7nxB...4X1a</div>
            </div>
            <ChevronDown className="size-[13px] text-ds-dim" />
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <div className="flex min-w-0 flex-col">
        {/* TOPBAR */}
        <div className="flex items-center justify-between border-b border-ds-line px-6 py-4">
          <div>
            <div className="text-lg font-bold tracking-tight">Bom te ver, Kauã</div>
            <div className="mt-0.5 font-mono text-[9px] text-ds-mute">último acesso: hoje, 09:12</div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex w-[230px] items-center gap-2 rounded-full border border-white/5 bg-ds-bg-2 px-3.5 py-2">
              <Search className="size-3.5 text-ds-mute" />
              <span className="text-xs text-ds-mute">Buscar comércio, tx...</span>
            </div>
            <Button variant="ghost" size="icon" className="relative size-9 rounded-full border border-white/5 bg-ds-bg-2 text-ds-dim" aria-label="Notificações">
              <Bell className="size-[15px]" />
              <span className="absolute top-2 right-[9px] size-1.5 rounded-full border-[1.5px] border-ds-bg bg-ds-orange" />
            </Button>
          </div>
        </div>

        {/* TICKER */}
        <Ticker prices={prices} />

        {/* ─── BODY ─── */}
        <div className="grid grid-cols-[1fr_318px] gap-[18px] p-5 px-6">
          {/* COL PRINCIPAL */}
          <div className="flex min-w-0 flex-col gap-[18px]">
            {/* HERO PATRIMÔNIO */}
            <div className="grid grid-cols-2 gap-5 rounded-[18px] border border-white/5 bg-ds-bg-1 p-[22px]">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ds-mute">Patrimônio total</span>
                <div className="mt-2 text-[40px] leading-none font-extrabold tracking-[-0.04em]">
                  R$ 8.832<span className="text-2xl text-ds-mute">,98</span>
                </div>
                <span className="mt-2.5 inline-flex w-fit items-center gap-[5px] rounded-[7px] bg-ds-green/10 px-[9px] py-1 font-mono text-[11px] font-semibold text-ds-green">
                  ↑ +R$ 412,80 · +4,9%
                </span>
                <div className="mt-[18px] flex">
                  {[
                    { label: "No fundo", value: "R$ 8.420,18" },
                    { label: "Disponível", value: "R$ 412,80" },
                    { label: "Rendimento total", value: "+R$ 412,80", green: true },
                  ].map((b, i, arr) => (
                    <div key={b.label} className={cn("pr-5 mr-5", i < arr.length - 1 && "border-r border-ds-line")}>
                      <div className="font-mono text-[8px] uppercase tracking-[0.05em] text-ds-mute">{b.label}</div>
                      <div className={cn("mt-[5px] text-base font-bold", b.green && "text-ds-green")}>{b.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-auto flex gap-[9px] pt-5">
                  <Button className="h-auto gap-[7px] rounded-[11px] border-0 bg-gradient-to-b from-white to-[#f0f0f2] px-5 py-[11px] text-[13px] font-semibold text-[#0a0a0a] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_12px_-6px_rgba(0,0,0,0.4)]">
                    <Plus className="size-3.5" />
                    Depositar
                  </Button>
                  <Button variant="ghost" className="h-auto rounded-[11px] border border-white/5 bg-ds-bg-1 px-5 py-[11px] text-[13px] font-semibold text-ds-ink">
                    Resgatar
                  </Button>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[9px] text-ds-mute">Evolução do patrimônio</span>
                  <div className="flex gap-0.5 rounded-[9px] border border-ds-line bg-[#0e0e11] p-0.5">
                    {["1M", "6M", "Tudo"].map((t) => (
                      <span key={t} className={cn("rounded-md px-2 py-1 font-mono text-[9px]", t === "6M" ? "border border-white/5 bg-ds-bg-2 text-ds-ink" : "text-ds-mute")}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="relative min-h-[150px] flex-1">
                  <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="size-full">
                    <defs>
                      <linearGradient id="chart-grad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#4ade80" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[40, 80, 120].map((y) => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.04)" strokeDasharray="2 6" />)}
                    <path d="M0 124 L66 118 L132 108 L198 92 L264 70 L330 46 L400 22" stroke="#4ade80" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M0 124 L66 118 L132 108 L198 92 L264 70 L330 46 L400 22 L400 150 L0 150 Z" fill="url(#chart-grad)" />
                    <circle cx="400" cy="22" r="4.5" fill="#4ade80" />
                  </svg>
                </div>
                <div className="mt-1.5 flex justify-between font-mono text-[8px] text-ds-mute">
                  {["dez", "jan", "fev", "mar", "abr", "mai"].map((m) => <span key={m}>{m}</span>)}
                </div>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Rendimento no mês", value: "+R$ 138,40", detail: "↑ +1,6%", valueColor: "text-ds-green", detailColor: "text-ds-green" },
                { label: "APR da carteira", value: "15,1%", detail: "acima da média", detailColor: "text-ds-orange" },
                { label: "Posições ativas", value: "12", detail: "comércios" },
                { label: "Próx. liquidação", value: "3 dias", detail: "Café Central" },
              ].map((k) => (
                <div key={k.label} className="rounded-[14px] border border-white/5 bg-ds-bg-1 p-[15px]">
                  <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">{k.label}</div>
                  <div className={cn("mt-2 text-[21px] font-bold tracking-tight", k.valueColor)}>{k.value}</div>
                  <div className={cn("mt-[5px] font-mono text-[9px] text-ds-mute", k.detailColor)}>{k.detail}</div>
                </div>
              ))}
            </div>

            {/* MINHAS POSIÇÕES */}
            <div className="rounded-2xl border border-white/5 bg-ds-bg-1 p-[18px]">
              <div className="mb-3.5 flex items-center justify-between">
                <div>
                  <div className="text-base font-bold tracking-tight">Minhas posições</div>
                  <div className="mt-0.5 font-mono text-[9px] text-ds-mute">onde seu capital está aplicado</div>
                </div>
                <span className="font-mono text-[9px] text-ds-mute">portfólio completo <span className="text-ds-orange">→</span></span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-ds-line hover:bg-transparent">
                    {["Comércio", "Meu aporte", "Já rendeu", "APR", "Liquida em"].map((h) => (
                      <TableHead key={h} className="h-auto px-0 pb-3 font-mono text-[9px] font-normal uppercase tracking-[0.08em] text-ds-mute">{h}</TableHead>
                    ))}
                    <TableHead className="h-auto px-0 pb-3 text-right font-mono text-[9px] font-normal uppercase tracking-[0.08em] text-ds-mute">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.map((p) => (
                    <TableRow key={p.hash} className="border-ds-line hover:bg-white/[0.02]">
                      <TableCell className="px-0 py-[11px]"><BizCell name={p.name} hash={p.hash} /></TableCell>
                      <TableCell className="px-0 py-[11px] font-mono text-xs">{p.invested}</TableCell>
                      <TableCell className="px-0 py-[11px] font-mono text-xs font-semibold text-ds-green">{p.earned}</TableCell>
                      <TableCell className="px-0 py-[11px] font-mono text-xs font-semibold text-ds-green">{p.apr}</TableCell>
                      <TableCell className="px-0 py-[11px] font-mono text-xs">{p.days}</TableCell>
                      <TableCell className="px-0 py-[11px] text-right">
                        <Badge variant="secondary" className={cn("h-auto border-0 font-mono text-[8px] uppercase", p.status === "active" ? "bg-ds-green/10 text-ds-green" : "bg-ds-bg-2 text-ds-dim")}>
                          {p.status === "active" ? "ativo" : "liquidando"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* MARKETPLACE */}
            <div className="rounded-2xl border border-white/5 bg-ds-bg-1 p-[18px]">
              <div className="mb-3.5 flex items-center justify-between">
                <div>
                  <div className="text-base font-bold tracking-tight">Explorar mais oportunidades</div>
                  <div className="mt-0.5 font-mono text-[9px] text-ds-mute">recebíveis abertos no marketplace</div>
                </div>
                <div className="flex gap-0.5 rounded-[9px] border border-ds-line bg-[#0e0e11] p-0.5">
                  <span className="rounded-md border border-white/5 bg-ds-bg-2 px-[11px] py-1.5 font-mono text-[10px] text-ds-ink">Risco baixo</span>
                  <span className="rounded-md px-[11px] py-1.5 font-mono text-[10px] text-ds-mute">Maior APR</span>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-ds-line hover:bg-transparent">
                    {["#", "Comércio", "Recebível", "APR", "Risco", "Captação"].map((h) => (
                      <TableHead key={h} className="h-auto px-0 pb-3 font-mono text-[9px] font-normal uppercase tracking-[0.08em] text-ds-mute">{h}</TableHead>
                    ))}
                    <TableHead className="h-auto px-0 pb-3" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketplaceItems.map((m) => (
                    <TableRow key={m.hash} className="border-ds-line hover:bg-white/[0.02]">
                      <TableCell className="w-[26px] px-0 py-[11px] font-mono text-[11px] text-ds-mute">{m.idx}</TableCell>
                      <TableCell className="px-0 py-[11px]"><BizCell name={m.name} hash={m.hash} /></TableCell>
                      <TableCell className="px-0 py-[11px] font-mono text-xs">{m.receivable}</TableCell>
                      <TableCell className="px-0 py-[11px] font-mono text-xs font-semibold text-ds-green">{m.apr}</TableCell>
                      <TableCell className="px-0 py-[11px]">
                        <Badge variant="secondary" className="h-auto border-0 bg-ds-green/10 font-mono text-[8px] uppercase text-ds-green">baixo</Badge>
                      </TableCell>
                      <TableCell className="px-0 py-[11px]">
                        <div className="flex items-center gap-2">
                          <div className="h-1 min-w-[44px] flex-1 overflow-hidden rounded-sm bg-ds-bg-2">
                            <div className="h-full rounded-sm bg-ds-orange" style={{ width: `${m.fill}%` }} />
                          </div>
                          <span className="font-mono text-[9px] text-ds-dim">{m.fill}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-0 py-[11px] text-right">
                        <Button variant="ghost" size="sm" className="h-auto rounded-[11px] border border-white/5 bg-ds-bg-1 px-3.5 py-1.5 text-[11px] font-semibold text-ds-ink">Financiar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* COL LATERAL */}
          <div className="flex flex-col gap-[18px]">
            {/* MEUS ATIVOS */}
            <SoftCard>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-base font-bold tracking-tight">Meus ativos</div>
                <span className="font-mono text-[9px] text-ds-mute">tudo <span className="text-ds-orange">→</span></span>
              </div>
              {[
                { logo: <div className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-ds-orange/10 text-ds-orange"><CircleDollarSign className="size-[17px]" /></div>, name: "Cota do fundo", detail: "498,2 KFND", value: "R$ 8.420,18", pct: "95,3%" },
                { logo: <UsdcLogo size={34} />, name: "USDC", detail: "disponível", value: "R$ 412,80", pct: "4,4%" },
                { logo: <SolanaLogo size={34} />, name: "SOL", detail: "pra taxa de rede", value: "R$ 24,00", pct: "0,3%" },
              ].map((a, i) => (
                <div key={a.name} className={cn("flex items-center gap-[11px] py-3", i > 0 && "border-t border-ds-line")}>
                  {a.logo}
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold">{a.name}</div>
                    <div className="mt-px font-mono text-[8px] text-ds-mute">{a.detail}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-semibold">{a.value}</div>
                    <div className="mt-px font-mono text-[8px] text-ds-mute">{a.pct}</div>
                  </div>
                </div>
              ))}
            </SoftCard>

            {/* APLICAR NO FUNDO */}
            <SoftCard>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Aplicar no fundo</span>
                <button className="text-ds-mute"><MoreHorizontal className="size-3.5" /></button>
              </div>
              <div className="mt-[3px] mb-3.5 font-mono text-[9px] text-ds-mute">entre com Pix, aplique em USDC</div>

              <div className="mb-3 flex gap-0.5 rounded-[10px] border border-ds-line bg-[#0e0e11] p-0.5">
                <button className="soft-card-sm flex-1 rounded-[7px] py-[7px] text-[11px] font-semibold text-ds-ink">Depositar</button>
                <button className="flex-1 rounded-[7px] py-[7px] text-[11px] font-semibold text-ds-mute">Resgatar</button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-ds-line bg-[#0e0e11] p-[11px] px-[13px]">
                <div>
                  <div className="font-mono text-[8px] uppercase text-ds-mute">Você paga</div>
                  <div className="mt-[3px] text-lg font-bold tracking-tight">{depositBrl.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-ds-line bg-ds-bg-2 px-2.5 py-1.5 font-mono text-[11px] text-ds-dim">
                  <span className="flex size-4 items-center justify-center rounded-full bg-ds-green/10 text-ds-green"><RealIcon /></span>
                  BRL
                </div>
              </div>

              <div className="relative z-[2] -my-[7px] flex justify-center">
                <button className="flex size-[30px] items-center justify-center rounded-[9px] border border-ds-line-2 bg-ds-elev text-ds-dim shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                  <ArrowUpDown className="size-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-ds-line bg-[#0e0e11] p-[11px] px-[13px]">
                <div>
                  <div className="font-mono text-[8px] uppercase text-ds-mute">Aplica no fundo</div>
                  <div className="mt-[3px] text-lg font-bold tracking-tight">{usdcOut.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-ds-line bg-ds-bg-2 px-2.5 py-1.5 font-mono text-[11px] text-ds-dim">
                  <UsdcLogo size={16} />
                  USDC
                </div>
              </div>

              <div className="mx-0.5 mt-3 flex justify-between font-mono text-[10px] text-ds-mute">
                <span>1 USDC = <strong className="font-medium text-ds-dim">{fmtBrl(prices.usdcBrl)}</strong></span>
                <span>≈ {Math.round(usdcOut).toLocaleString("pt-BR")} KFND</span>
              </div>

              <div className="mx-0.5 mt-3 mb-3.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-ds-mute">
                  <span className="size-[5px] rounded-full bg-ds-orange" />
                  Taxa de rede
                </span>
                <span className="font-mono text-[11px] font-semibold text-ds-green">$0.0001</span>
              </div>

              <Button className="h-auto w-full gap-2 rounded-xl border-0 bg-gradient-to-b from-white to-[#f0f0f2] py-3 text-[13px] font-semibold text-[#0a0a0a] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_12px_-6px_rgba(0,0,0,0.4)]">
                <Plus className="size-3.5" />
                Confirmar depósito
              </Button>
            </SoftCard>
          </div>
        </div>
      </div>
    </main>
  )
}
