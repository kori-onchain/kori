"use client"

import { useState } from "react"
import {
  ArrowRight,
  Award,
  Compass,
  Gift,
  MapPin,
  Plus,
  Share2,
  Ticket,
  TrendingUp,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SoftCard } from "./shared"

/* ─── TYPES ─── */

type TabId = "portfolio" | "experiencias"
type Category = "tudo" | "viagem" | "beneficio" | "estilo"

/* ─── DATA ─── */

const tabs: { id: TabId; label: string }[] = [
  { id: "portfolio", label: "Portfólio" },
  { id: "experiencias", label: "Experiências" },
]

const cryptoAssets = [
  { name: "Solana", ticker: "SOL", value: "R$ 8.240,00", change: "+12,4%", up: true, color: "#9945ff" },
  { name: "Bitcoin", ticker: "BTC", value: "R$ 3.200,00", change: "+8,1%", up: true, color: "#F7931A" },
  { name: "Ethereum", ticker: "ETH", value: "R$ 1.800,00", change: "-2,3%", up: false, color: "#627EEA" },
  { name: "USDC", ticker: "USDC", value: "R$ 1.000,00", change: "+0,1%", up: true, color: "#2775CA" },
  { name: "Raydium", ticker: "RAY", value: "R$ 200,50", change: "+24,6%", up: true, color: "#6C5CE7" },
]

const categoryPills: { id: Category; label: string }[] = [
  { id: "tudo", label: "Tudo" },
  { id: "viagem", label: "Viagem" },
  { id: "beneficio", label: "Benefícios" },
  { id: "estilo", label: "Estilo" },
]

const experiences = [
  { id: "lounge", title: "Sala VIP Aeroportos", category: "viagem" as Category, description: "Acesso a salas parceiras com um acompanhante.", cost: "Kora Black", vip: true, icon: "MapPin" as const },
  { id: "cashback", title: "Cashback Turbo 3%", category: "beneficio" as Category, description: "Cashback elevado em compras por 30 dias.", cost: "4.500 pts", vip: false, icon: "Zap" as const },
  { id: "concierge", title: "Concierge 24/7", category: "estilo" as Category, description: "Reservas, hotéis e eventos com atendimento prioritário.", cost: "Kora VIP", vip: true, icon: "Award" as const },
  { id: "hotel", title: "Kora Collection Hotéis", category: "viagem" as Category, description: "Upgrade de quarto e café da manhã em hotéis selecionados.", cost: "8.000 pts", vip: false, icon: "Compass" as const },
  { id: "ingressos", title: "Pré-vendas Exclusivas", category: "beneficio" as Category, description: "Acesso antecipado a shows, festivais e eventos.", cost: "2.500 pts", vip: false, icon: "Gift" as const },
]

const iconMap = {
  MapPin,
  Zap,
  Award,
  Compass,
  Gift,
} as const

/* ─── INVESTMENTS PANEL ─── */

function InvestmentsPanel() {
  return (
    <div className="flex flex-col gap-[18px] p-5 px-6">
      {/* SUMMARY CARD */}
      <SoftCard className="p-[22px]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">
            Patrimônio total
          </span>
          <span className="inline-flex items-center gap-[5px] rounded-[7px] bg-ds-green/10 px-[9px] py-1 font-mono text-[11px] font-semibold text-ds-green">
            <TrendingUp className="size-3" />
            +14.8%
          </span>
        </div>
        <div className="mt-2 text-[32px] font-extrabold tracking-[-0.04em]">
          R$ 42.980,50
        </div>

        <div className="my-4 border-t border-ds-line" />

        <div className="grid grid-cols-2">
          <div className="border-r border-ds-line pr-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">
              Renda variável
            </span>
            <div className="mt-1.5 text-base font-bold">R$ 28.540,00</div>
          </div>
          <div className="pl-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">
              Crypto assets
            </span>
            <div className="mt-1.5 text-base font-bold">R$ 14.440,50</div>
          </div>
        </div>
      </SoftCard>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3">
        <Button className="h-auto gap-[7px] rounded-[11px] border-0 bg-gradient-to-b from-white to-[#f0f0f2] px-5 py-[11px] text-[13px] font-semibold text-[#0a0a0a] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_12px_-6px_rgba(0,0,0,0.4)]">
          <Plus className="size-3.5" />
          Aplicar
        </Button>
        <Button
          variant="ghost"
          className="h-auto gap-[7px] rounded-[11px] border border-white/5 bg-ds-bg-1 px-5 py-[11px] text-[13px] font-semibold text-ds-ink"
        >
          <ArrowRight className="size-3.5" />
          Resgatar
        </Button>
      </div>

      {/* CRYPTO INVESTMENTS */}
      <div className="rounded-2xl border border-white/5 bg-ds-bg-1 p-[18px]">
        <div className="mb-3.5 flex items-center justify-between">
          <div className="text-base font-bold tracking-tight">Meus investimentos</div>
          <span className="font-mono text-[9px] text-ds-mute">
            ver tudo <span className="text-ds-orange">&rarr;</span>
          </span>
        </div>

        {cryptoAssets.map((asset, i) => (
          <div
            key={asset.ticker}
            className={cn(
              "flex items-center gap-[11px] py-3",
              i > 0 && "border-t border-ds-line"
            )}
          >
            {/* Logo */}
            <div
              className="flex size-[34px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ backgroundColor: asset.color }}
            >
              {asset.name.charAt(0)}
            </div>

            {/* Name + ticker */}
            <div className="flex-1">
              <div className="text-[13px] font-semibold">{asset.name}</div>
              <div className="mt-px font-mono text-[8px] text-ds-mute">
                {asset.ticker}
              </div>
            </div>

            {/* Value + change */}
            <div className="text-right">
              <div className="text-[13px] font-semibold">{asset.value}</div>
              <div
                className={cn(
                  "mt-px font-mono text-[9px]",
                  asset.up ? "text-ds-green" : "text-ds-red"
                )}
              >
                {asset.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── EXPERIENCES PANEL ─── */

function ExperiencesPanel() {
  const [category, setCategory] = useState<Category>("tudo")

  const filtered =
    category === "tudo"
      ? experiences
      : experiences.filter((e) => e.category === category)

  return (
    <div className="flex flex-col gap-[18px] p-5 px-6">
      {/* POINTS CARD */}
      <SoftCard className="p-[22px]">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">
              Reputation points
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[32px] font-extrabold tracking-[-0.04em]">
                24.850
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">
                PTS
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-ds-line-2 px-2.5 py-1.5">
            <Ticket className="size-3.5 text-ds-orange" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ds-orange">
              BLACK
            </span>
          </div>
        </div>

        <div className="my-4 border-t border-ds-line" />

        <div className="flex items-center justify-between">
          <span className="text-xs text-ds-mute">
            Próximo nível: <strong className="font-medium text-ds-dim">Kora Private</strong>
          </span>
          <span className="text-xs text-ds-mute">faltam 5.150 pts</span>
        </div>
      </SoftCard>

      {/* CATEGORY PILLS */}
      <div className="flex gap-2">
        {categoryPills.map((pill) => (
          <button
            key={pill.id}
            onClick={() => setCategory(pill.id)}
            className={cn(
              "soft-card-sm cursor-pointer rounded-full px-4 py-2 text-[12px] font-semibold",
              category === pill.id ? "text-ds-ink" : "text-ds-mute"
            )}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* SECTION TITLE */}
      <div className="text-lg font-bold tracking-tight">Experiências disponíveis</div>

      {/* EXPERIENCE CARDS */}
      <div className="flex flex-col gap-3">
        {filtered.map((exp) => {
          const Icon = iconMap[exp.icon]
          return (
            <div
              key={exp.id}
              className="rounded-2xl border border-white/5 bg-ds-bg-1 p-4"
            >
              {/* Top row */}
              <div className="flex gap-3">
                <div className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] border border-ds-line bg-ds-bg-2">
                  <Icon className="size-[17px] text-ds-dim" />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold">{exp.title}</div>
                  <div className="mt-1 line-clamp-2 text-xs text-ds-mute">
                    {exp.description}
                  </div>
                </div>
              </div>

              {/* Bottom row */}
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={cn(
                    "font-mono text-[10px]",
                    exp.vip ? "text-ds-orange" : "text-ds-mute"
                  )}
                >
                  {exp.cost}
                </span>
                <div className="flex gap-2">
                  <Button
                    className={cn(
                      "h-auto rounded-[11px] px-3.5 py-1.5 text-[11px] font-semibold",
                      exp.vip
                        ? "border border-white/5 bg-ds-bg-1 text-ds-ink"
                        : "border-0 bg-gradient-to-b from-white to-[#f0f0f2] text-[#0a0a0a] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_12px_-6px_rgba(0,0,0,0.4)]"
                    )}
                  >
                    {exp.vip ? "Ver" : "Resgatar"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-auto rounded-[11px] border border-white/5 bg-ds-bg-1 p-1.5 text-ds-dim"
                  >
                    <Share2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── MAIN VIEW ─── */

export function InvestView() {
  const [view, setView] = useState<TabId>("portfolio")

  return (
    <div>
      {/* Tab strip */}
      <div className="flex gap-6 border-b border-ds-line px-6 pt-5">
        {tabs.map((tab) => {
          const active = view === tab.id
          return (
            <button key={tab.id} onClick={() => setView(tab.id)} className="pb-0 pt-1">
              <span
                className={cn(
                  "block pb-2.5 text-[14px] font-semibold",
                  active ? "text-ds-ink" : "text-ds-mute"
                )}
              >
                {tab.label}
              </span>
              <div
                className={cn(
                  "h-0.5 w-full rounded-t",
                  active ? "bg-ds-orange" : "bg-transparent"
                )}
              />
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {view === "portfolio" ? <InvestmentsPanel /> : <ExperiencesPanel />}
    </div>
  )
}
