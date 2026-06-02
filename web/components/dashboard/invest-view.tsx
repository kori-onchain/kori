"use client"

import { useEffect, useState } from "react"
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
import { SoftCard, BizCell } from "./shared"
import { formatBRL } from "@/lib/db/client"
import { getAccount } from "@/lib/db/accounts"
import { listPositions } from "@/lib/db/positions"
import type { Account, Position } from "@/lib/db/types"

const fmtApr = (n: number) => `${n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`

/* ─── TYPES ─── */

type TabId = "portfolio" | "experiencias"
type Category = "tudo" | "viagem" | "beneficio" | "estilo"

/* ─── DATA ─── */

const tabs: { id: TabId; label: string }[] = [
  { id: "portfolio", label: "Portfólio" },
  { id: "experiencias", label: "Experiências" },
]

const POS_COLORS = ["#9945ff", "#F7931A", "#627EEA", "#2775CA", "#6C5CE7", "#10b981"]

const categoryPills: { id: Category; label: string }[] = [
  { id: "tudo", label: "Tudo" },
  { id: "viagem", label: "Viagem" },
  { id: "beneficio", label: "Benefícios" },
  { id: "estilo", label: "Estilo" },
]

const experiences = [
  { id: "lounge", title: "Sala VIP Aeroportos", category: "viagem" as Category, description: "Acesso a salas parceiras com um acompanhante.", cost: "KORI Black", vip: true, icon: "MapPin" as const },
  { id: "cashback", title: "Cashback Turbo 3%", category: "beneficio" as Category, description: "Cashback elevado em compras por 30 dias.", cost: "4.500 pts", vip: false, icon: "Zap" as const },
  { id: "concierge", title: "Concierge 24/7", category: "estilo" as Category, description: "Reservas, hotéis e eventos com atendimento prioritário.", cost: "KORI VIP", vip: true, icon: "Award" as const },
  { id: "hotel", title: "KORI Collection Hotéis", category: "viagem" as Category, description: "Upgrade de quarto e café da manhã em hotéis selecionados.", cost: "8.000 pts", vip: false, icon: "Compass" as const },
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
  const [account, setAccount] = useState<Account>({ balance_brl: 0, fund_brl: 0 })
  const [positions, setPositions] = useState<Position[]>([])

  useEffect(() => {
    let active = true
    Promise.all([getAccount("PF"), listPositions()])
      .then(([acc, pos]) => {
        if (!active) return
        setAccount(acc)
        setPositions(pos)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const investedTotal = positions.reduce((s, p) => s + p.invested_brl, 0)
  const earnedTotal = positions.reduce((s, p) => s + p.earned_brl, 0)
  const patrimonio = account.fund_brl + account.balance_brl
  const activeCount = positions.filter((p) => p.status === "active").length
  const avgApr = positions.length ? positions.reduce((s, p) => s + p.apr, 0) / positions.length : 0
  const best = positions.reduce<Position | null>((b, p) => (!b || p.apr > b.apr ? p : b), null)

  return (
    <div className="grid grid-cols-[1fr_318px] gap-[18px] p-5 px-6">
      {/* COL PRINCIPAL */}
      <div className="flex min-w-0 flex-col gap-[18px]">
        {/* HERO PATRIMÔNIO */}
        <div className="grid grid-cols-2 gap-5 rounded-[18px] border border-ds-line bg-ds-bg-1 p-[22px]">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ds-mute">
              Patrimônio total
            </span>
            <div className="mt-2 text-[40px] leading-none font-extrabold tracking-[-0.04em]">
              {formatBRL(patrimonio)}
            </div>
            <span className="mt-2.5 inline-flex w-fit items-center gap-[5px] rounded-[7px] bg-ds-green/10 px-[9px] py-1 font-mono text-[11px] font-semibold text-ds-green">
              <TrendingUp className="size-3" />
              +{formatBRL(earnedTotal)} rendimento
            </span>

            <div className="mt-[18px] flex">
              {[
                { label: "No fundo", value: formatBRL(account.fund_brl) },
                { label: "Disponível", value: formatBRL(account.balance_brl) },
              ].map((b, i, arr) => (
                <div
                  key={b.label}
                  className={cn(
                    "pr-5 mr-5",
                    i < arr.length - 1 && "border-r border-ds-line"
                  )}
                >
                  <div className="font-mono text-[8px] uppercase tracking-[0.05em] text-ds-mute">
                    {b.label}
                  </div>
                  <div className="mt-[5px] text-base font-bold">{b.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-auto flex gap-[9px] pt-5">
              <Button className="h-auto gap-[7px] rounded-[11px] border-0 bg-ds-ink px-5 py-[11px] text-[13px] font-semibold text-ds-bg shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_12px_-6px_rgba(0,0,0,0.4)]">
                <Plus className="size-3.5" />
                Aplicar
              </Button>
              <Button
                variant="ghost"
                className="h-auto gap-[7px] rounded-[11px] border border-ds-line bg-ds-bg-1 px-5 py-[11px] text-[13px] font-semibold text-ds-ink"
              >
                <ArrowRight className="size-3.5" />
                Resgatar
              </Button>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[9px] text-ds-mute">Evolução do portfólio</span>
              <div className="flex gap-0.5 rounded-[9px] border border-ds-line bg-ds-bg p-0.5">
                {["1M", "6M", "Tudo"].map((t) => (
                  <span
                    key={t}
                    className={cn(
                      "rounded-md px-2 py-1 font-mono text-[9px]",
                      t === "6M"
                        ? "border border-ds-line bg-ds-bg-2 text-ds-ink"
                        : "text-ds-mute"
                    )}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative min-h-[150px] flex-1">
              <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="size-full">
                <defs>
                  <linearGradient id="invest-grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[40, 80, 120].map((y) => (
                  <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(128,128,128,0.18)" strokeDasharray="2 6" />
                ))}
                <path
                  d="M0 130 L50 120 L100 105 L150 115 L200 90 L250 80 L300 55 L350 40 L400 25"
                  stroke="#4ade80"
                  strokeWidth="2.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0 130 L50 120 L100 105 L150 115 L200 90 L250 80 L300 55 L350 40 L400 25 L400 150 L0 150 Z"
                  fill="url(#invest-grad)"
                />
                <circle cx="400" cy="25" r="4.5" fill="#4ade80" />
              </svg>
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[8px] text-ds-mute">
              {["dez", "jan", "fev", "mar", "abr", "mai"].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Rendimento total", value: `+${formatBRL(earnedTotal)}`, detail: "acumulado", valueColor: "text-ds-green", detailColor: "text-ds-green" },
            { label: "Melhor posição", value: best?.merchant_name?.split(" ")[0] ?? "—", detail: best ? fmtApr(best.apr) : "", detailColor: "text-ds-green" },
            { label: "Posições ativas", value: String(activeCount), detail: "comércios" },
            { label: "APR média", value: fmtApr(avgApr), detail: "da carteira", detailColor: "text-ds-orange" },
          ].map((k) => (
            <div key={k.label} className="rounded-[14px] border border-ds-line bg-ds-bg-1 p-[15px]">
              <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">{k.label}</div>
              <div className={cn("mt-2 text-[21px] font-bold tracking-tight", k.valueColor)}>{k.value}</div>
              <div className={cn("mt-[5px] font-mono text-[9px] text-ds-mute", k.detailColor)}>{k.detail}</div>
            </div>
          ))}
        </div>

        {/* TABELA INVESTIMENTOS */}
        <div className="rounded-2xl border border-ds-line bg-ds-bg-1 p-[18px]">
          <div className="mb-3.5 flex items-center justify-between">
            <div>
              <div className="text-base font-bold tracking-tight">Meus investimentos</div>
              <div className="mt-0.5 font-mono text-[9px] text-ds-mute">
                posições abertas no portfólio
              </div>
            </div>
            <span className="font-mono text-[9px] text-ds-mute">
              ver tudo <span className="text-ds-orange">&rarr;</span>
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-ds-line hover:bg-transparent">
                {["Comércio", "Meu aporte", "Já rendeu", "APR", "Liquida em"].map(
                  (h) => (
                    <TableHead
                      key={h}
                      className="h-auto px-0 pb-3 font-mono text-[9px] font-normal uppercase tracking-[0.08em] text-ds-mute"
                    >
                      {h}
                    </TableHead>
                  )
                )}
                <TableHead className="h-auto px-0 pb-3 text-right font-mono text-[9px] font-normal uppercase tracking-[0.08em] text-ds-mute">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((p) => (
                <TableRow
                  key={p.id}
                  className="border-ds-line hover:bg-ds-ink/[0.03]"
                >
                  <TableCell className="px-0 py-[11px]">
                    <BizCell name={p.merchant_name} hash={p.hash ?? ""} />
                  </TableCell>
                  <TableCell className="px-0 py-[11px] font-mono text-xs">
                    {formatBRL(p.invested_brl)}
                  </TableCell>
                  <TableCell className="px-0 py-[11px] font-mono text-xs font-semibold text-ds-green">
                    +{formatBRL(p.earned_brl)}
                  </TableCell>
                  <TableCell className="px-0 py-[11px] font-mono text-xs font-semibold text-ds-green">
                    {fmtApr(p.apr)}
                  </TableCell>
                  <TableCell className="px-0 py-[11px] font-mono text-xs">
                    {p.liquidates_in_days}d
                  </TableCell>
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
      </div>

      {/* COL LATERAL */}
      <div className="flex flex-col gap-[18px]">
        {/* ALOCAÇÃO */}
        <SoftCard>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-base font-bold tracking-tight">Alocação</div>
            <span className="font-mono text-[9px] text-ds-mute">
              detalhes <span className="text-ds-orange">&rarr;</span>
            </span>
          </div>

          {positions.map((p, i) => {
            const pct = investedTotal ? Math.round((p.invested_brl / investedTotal) * 100) : 0
            return (
              <div
                key={p.id}
                className={cn(
                  "flex items-center gap-[11px] py-3",
                  i > 0 && "border-t border-ds-line"
                )}
              >
                <div
                  className="flex size-[34px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ backgroundColor: POS_COLORS[i % POS_COLORS.length] }}
                >
                  {p.merchant_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold">{p.merchant_name}</div>
                  <div className="mt-px font-mono text-[8px] text-ds-mute">{pct}% da carteira</div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-semibold">{formatBRL(p.invested_brl)}</div>
                  <div className="mt-px font-mono text-[8px] text-ds-green">+{formatBRL(p.earned_brl)}</div>
                </div>
              </div>
            )
          })}
        </SoftCard>

        {/* RESUMO RÁPIDO */}
        <SoftCard>
          <div className="text-sm font-semibold">Resumo da carteira</div>
          <div className="mt-[3px] mb-3.5 font-mono text-[9px] text-ds-mute">
            performance geral do portfólio
          </div>

          {[
            { label: "Investido total", value: formatBRL(investedTotal), green: false },
            { label: "Rendimento acumulado", value: `+${formatBRL(earnedTotal)}`, green: true },
            { label: "No fundo", value: formatBRL(account.fund_brl), green: true },
            { label: "Disponível", value: formatBRL(account.balance_brl), green: false },
            { label: "Melhor APR", value: best ? `${best.merchant_name.split(" ")[0]} ${fmtApr(best.apr)}` : "—", green: false },
          ].map((item, i) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center justify-between py-2.5",
                i > 0 && "border-t border-ds-line"
              )}
            >
              <span className="font-mono text-[10px] text-ds-mute">
                {item.label}
              </span>
              <span
                className={cn(
                  "font-mono text-[11px] font-semibold",
                  item.green ? "text-ds-green" : "text-ds-dim"
                )}
              >
                {item.value}
              </span>
            </div>
          ))}
        </SoftCard>
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
    <div className="grid grid-cols-[1fr_318px] gap-[18px] p-5 px-6">
      {/* COL PRINCIPAL */}
      <div className="flex min-w-0 flex-col gap-[18px]">
        {/* PILLS + TÍTULO */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold tracking-tight">
            Experiências disponíveis
          </div>
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
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((exp) => {
            const Icon = iconMap[exp.icon]
            return (
              <div
                key={exp.id}
                className="rounded-2xl border border-ds-line bg-ds-bg-1 p-[18px]"
              >
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
                          ? "border border-ds-line bg-ds-bg-1 text-ds-ink"
                          : "border-0 bg-ds-ink text-ds-bg shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_12px_-6px_rgba(0,0,0,0.4)]"
                      )}
                    >
                      {exp.vip ? "Ver" : "Resgatar"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-auto rounded-[11px] border border-ds-line bg-ds-bg-1 p-1.5 text-ds-dim"
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

      {/* COL LATERAL */}
      <div className="flex flex-col gap-[18px]">
        {/* PONTOS + TIER */}
        <SoftCard>
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
              Próximo nível:{" "}
              <strong className="font-medium text-ds-dim">KORI Private</strong>
            </span>
            <span className="text-xs text-ds-mute">faltam 5.150 pts</span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ds-bg-2">
            <div
              className="h-full rounded-full bg-ds-orange"
              style={{ width: "83%" }}
            />
          </div>
        </SoftCard>

        {/* BENEFÍCIOS DO TIER */}
        <SoftCard>
          <div className="mb-2 text-base font-bold tracking-tight">
            Benefícios Black
          </div>

          {[
            { label: "Cashback padrão", value: "2,5%" },
            { label: "Salas VIP", value: "ilimitado", green: true },
            { label: "Concierge", value: "24/7", green: true },
            { label: "Seguro viagem", value: "incluso", green: true },
            { label: "Pontos por R$", value: "3x" },
          ].map((item, i) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center justify-between py-2.5",
                i > 0 && "border-t border-ds-line"
              )}
            >
              <span className="font-mono text-[10px] text-ds-mute">
                {item.label}
              </span>
              <span
                className={cn(
                  "font-mono text-[11px] font-semibold",
                  item.green ? "text-ds-green" : "text-ds-dim"
                )}
              >
                {item.value}
              </span>
            </div>
          ))}
        </SoftCard>
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
      <div className="flex gap-6 border-b border-ds-line px-6 pt-3">
        {tabs.map((tab) => {
          const active = view === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className="pb-0 pt-1"
            >
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
