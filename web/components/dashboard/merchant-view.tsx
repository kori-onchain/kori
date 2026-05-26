"use client"

import { useState } from "react"
import {
  Package,
  Search,
  SlidersHorizontal,
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
import { SoftCard } from "./shared"

/* ─── TYPES ─── */

type TabView = "dashboard" | "vitrine"
type Period = "hoje" | "7d" | "30d"
type Category = "tudo" | "smartphones" | "kitchen" | "consoles"

/* ─── MOCK DATA ─── */

const mockProducts = [
  { id: "1", brand: "APPLE", name: "iPhone 15 Pro", price: 6999, oldPrice: 7999, discount: "-12%", category: "smartphones" as const },
  { id: "2", brand: "MONDIAL", name: "AirFryer Turbo 5L", price: 349, oldPrice: 499, discount: "-30%", category: "kitchen" as const },
  { id: "3", brand: "SONY", name: "PlayStation 5 Slim", price: 3499, oldPrice: null, discount: null, category: "consoles" as const },
  { id: "4", brand: "SAMSUNG", name: "Galaxy S24 Ultra", price: 5999, oldPrice: 7499, discount: "-20%", category: "smartphones" as const },
  { id: "5", brand: "TRAMONTINA", name: "Conjunto Panelas Inox", price: 289, oldPrice: 389, discount: "-25%", category: "kitchen" as const },
  { id: "6", brand: "NINTENDO", name: "Switch OLED", price: 2199, oldPrice: 2499, discount: "-12%", category: "consoles" as const },
]

const topSelling = [
  { rank: 1, name: "iPhone 15 Pro", sales: 32, revenue: "R$ 223.968", color: "#3b82f6" },
  { rank: 2, name: "PlayStation 5 Slim", sales: 18, revenue: "R$ 62.982", color: "#8b5cf6" },
  { rank: 3, name: "Galaxy S24 Ultra", sales: 14, revenue: "R$ 83.986", color: "#f59e0b" },
  { rank: 4, name: "AirFryer Turbo 5L", sales: 12, revenue: "R$ 4.188", color: "#ef4444" },
  { rank: 5, name: "Switch OLED", sales: 8, revenue: "R$ 17.592", color: "#10b981" },
]

const recentSales = [
  { initials: "MC", name: "Maria Costa", items: 2, amount: "R$ 7.348,00", method: "Pix" },
  { initials: "JS", name: "João Silva", items: 1, amount: "R$ 3.499,00", method: "Pix" },
  { initials: "AL", name: "Ana Lima", items: 3, amount: "R$ 1.137,00", method: "Pix" },
  { initials: "PR", name: "Pedro Rocha", items: 1, amount: "R$ 5.999,00", method: "Pix" },
  { initials: "CF", name: "Carla Ferreira", items: 2, amount: "R$ 2.548,00", method: "Pix" },
]

/* ─── HELPERS ─── */

function fmtBrl(n: number) {
  return `R$ ${n.toLocaleString("pt-BR")}`
}

/* ─── TABS ─── */

const tabs: { id: TabView; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "vitrine", label: "Vitrine" },
]

const periods: { id: Period; label: string }[] = [
  { id: "hoje", label: "Hoje" },
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
]

const categories: { id: Category; label: string }[] = [
  { id: "tudo", label: "Tudo" },
  { id: "smartphones", label: "Smartphones" },
  { id: "kitchen", label: "Kitchen" },
  { id: "consoles", label: "Game Consoles" },
]

/* ─── SALES DASHBOARD TAB ─── */

function SalesDashboard() {
  const [period, setPeriod] = useState<Period>("7d")

  return (
    <div className="flex flex-col gap-[18px] p-5 px-6">
      {/* REVENUE CARD */}
      <div className="rounded-2xl border border-white/5 bg-ds-bg-1 p-[22px]">
        <div className="flex items-start justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">
            Receita no per&iacute;odo
          </span>
          <div className="flex gap-0.5 rounded-[10px] border border-ds-line bg-[#0e0e11] p-0.5">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={cn(
                  "rounded-[7px] px-[11px] py-[7px] text-[11px] font-semibold transition-colors",
                  period === p.id
                    ? "soft-card-sm text-ds-ink"
                    : "text-ds-mute"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 text-[32px] font-extrabold tracking-[-0.04em]">
          R$ 12.840<span className="text-xl text-ds-mute">,00</span>
        </div>

        <span className="mt-2 inline-flex w-fit items-center gap-[5px] rounded-[7px] bg-ds-green/10 px-[9px] py-1 font-mono text-[11px] font-semibold text-ds-green">
          +18,2% vs per&iacute;odo anterior
        </span>

        {/* MINI CHART */}
        <div className="relative mt-4 h-[100px]">
          <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="size-full">
            <defs>
              <linearGradient id="revenue-grad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[25, 50, 75].map((y) => (
              <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.04)" strokeDasharray="2 6" />
            ))}
            <path
              d="M0 78 L57 72 L114 65 L171 58 L228 42 L285 35 L342 24 L400 18"
              stroke="#4ade80"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M0 78 L57 72 L114 65 L171 58 L228 42 L285 35 L342 24 L400 18 L400 100 L0 100 Z"
              fill="url(#revenue-grad)"
            />
            <circle cx="400" cy="18" r="4" fill="#4ade80" />
          </svg>
        </div>

        {/* STATS GRID */}
        <div className="mt-4 grid grid-cols-3 border-t border-ds-line pt-4">
          <div>
            <div className="font-mono text-[8px] uppercase tracking-[0.05em] text-ds-mute">Vendas</div>
            <div className="mt-[5px] text-[18px] font-bold">84</div>
            <span className="font-mono text-[9px] text-ds-green">+12</span>
          </div>
          <div>
            <div className="font-mono text-[8px] uppercase tracking-[0.05em] text-ds-mute">Ticket m&eacute;dio</div>
            <div className="mt-[5px] text-[18px] font-bold">R$ 152,86</div>
          </div>
          <div>
            <div className="font-mono text-[8px] uppercase tracking-[0.05em] text-ds-mute">Convers&atilde;o</div>
            <div className="mt-[5px] text-[18px] font-bold">3,8%</div>
            <span className="font-mono text-[9px] text-ds-green">&uarr; 0,4%</span>
          </div>
        </div>
      </div>

      {/* TWO CARDS SIDE BY SIDE */}
      <div className="grid grid-cols-2 gap-[18px]">
        {/* CASH FLOW */}
        <div className="rounded-2xl border border-white/5 bg-ds-bg-1 p-[18px]">
          <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">A receber</span>
          <div className="mt-2 text-[21px] font-bold">R$ 8.420,00</div>
          <div className="mt-1 font-mono text-[9px] text-ds-mute">pr&oacute;xima entrada: 28 mai</div>
          <Button
            variant="ghost"
            className="mt-4 h-auto gap-[7px] rounded-[11px] border border-white/5 bg-ds-bg-1 px-4 py-[9px] text-[12px] font-semibold text-ds-ink"
          >
            <Zap className="size-3.5" />
            Antecipar
          </Button>
        </div>

        {/* BUSINESS HEALTH / ON-CHAIN SCORE */}
        <div className="rounded-2xl border border-white/5 bg-ds-bg-1 p-[18px]">
          <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">Score on-chain</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-[28px] font-bold leading-none">782</span>
            <span className="text-sm text-ds-mute">/900</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ds-bg-2">
            <div className="h-full rounded-full bg-ds-green" style={{ width: "87%" }} />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <Badge variant="secondary" className="h-auto border-0 bg-ds-green/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-ds-green">
              Excelente
            </Badge>
          </div>
          <div className="mt-3 flex flex-col gap-1">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-ds-mute">Taxa descontada</span>
              <span className="font-semibold text-ds-green">1,2%</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-ds-mute">Taxa base</span>
              <span className="text-ds-mute">2,8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOP SELLING */}
      <div className="rounded-2xl border border-white/5 bg-ds-bg-1 p-[18px]">
        <div className="mb-3.5 flex items-center justify-between">
          <div className="text-base font-bold tracking-tight">Mais vendidos</div>
          <span className="font-mono text-[9px] text-ds-mute">
            ver tudo <span className="text-ds-orange">&rarr;</span>
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-ds-line hover:bg-transparent">
              {["#", "Produto", "Vendas", "Receita"].map((h) => (
                <TableHead
                  key={h}
                  className="h-auto px-0 pb-3 font-mono text-[9px] font-normal uppercase tracking-[0.08em] text-ds-mute"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {topSelling.map((p) => (
              <TableRow key={p.rank} className="border-ds-line hover:bg-white/[0.02]">
                <TableCell className="w-[26px] px-0 py-[11px] font-mono text-[11px] text-ds-mute">
                  {p.rank}
                </TableCell>
                <TableCell className="px-0 py-[11px]">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="size-[18px] shrink-0 rounded"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-[13px] font-semibold">{p.name}</span>
                  </div>
                </TableCell>
                <TableCell className="px-0 py-[11px] font-mono text-xs">
                  {p.sales}
                </TableCell>
                <TableCell className="px-0 py-[11px] font-mono text-xs font-semibold">
                  {p.revenue}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* RECENT SALES */}
      <div className="rounded-2xl border border-white/5 bg-ds-bg-1 p-[18px]">
        <div className="mb-3.5 flex items-center justify-between">
          <div className="text-base font-bold tracking-tight">Vendas recentes</div>
          <span className="font-mono text-[9px] text-ds-mute">
            ver tudo <span className="text-ds-orange">&rarr;</span>
          </span>
        </div>
        <div className="flex flex-col">
          {recentSales.map((s, i) => (
            <div
              key={s.name}
              className={cn(
                "flex items-center gap-3 py-3",
                i > 0 && "border-t border-ds-line"
              )}
            >
              <div className="flex size-[34px] shrink-0 items-center justify-center rounded-full border border-ds-line bg-ds-bg-2 text-[11px] font-semibold text-ds-dim">
                {s.initials}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold">{s.name}</div>
                <div className="mt-px font-mono text-[9px] text-ds-mute">
                  {s.items} {s.items === 1 ? "item" : "itens"}
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[13px] font-semibold text-ds-green">{s.amount}</span>
                <Badge
                  variant="secondary"
                  className="h-auto border-0 bg-ds-bg-2 px-2 py-0.5 font-mono text-[8px] uppercase text-ds-dim"
                >
                  {s.method}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── VITRINE / ECOMMERCE TAB ─── */

function VitrinePanel() {
  const [category, setCategory] = useState<Category>("tudo")
  const [search, setSearch] = useState("")

  const filtered = mockProducts.filter((p) => {
    const matchCategory = category === "tudo" || p.category === category
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="flex flex-col gap-[18px] p-5 px-6">
      {/* SEARCH BAR */}
      <div className="flex items-center gap-2 rounded-full border border-white/5 bg-ds-bg-2 px-4 py-2.5">
        <Search className="size-4 shrink-0 text-ds-mute" />
        <input
          type="text"
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-[13px] text-ds-ink placeholder:text-ds-mute outline-none"
        />
        <button className="rounded-lg border border-white/5 bg-ds-bg-1 p-1.5 text-ds-mute transition-colors hover:text-ds-dim">
          <SlidersHorizontal className="size-3.5" />
        </button>
      </div>

      {/* CATEGORY PILLS */}
      <div className="flex gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={cn(
              "soft-card-sm rounded-full px-4 py-2 text-[12px] font-semibold transition-colors",
              category === c.id ? "text-ds-ink" : "text-ds-mute"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="mb-3 size-10 text-ds-mute" />
          <span className="text-sm text-ds-mute">Nenhum produto encontrado</span>
        </div>
      )}

      {/* PRODUCT GRID (BENTO) */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {/* HERO CARD - first product, col-span-2 row-span-2 */}
          {filtered[0] && (
            <div className="col-span-2 row-span-2 relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-2xl border border-white/5 bg-ds-bg-2">
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="size-20 text-ds-mute/20" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ds-bg via-ds-bg/60 to-transparent" />
              <div className="relative z-10 p-5">
                {filtered[0].discount && (
                  <span className="mb-2 inline-block rounded bg-ds-green/10 px-1.5 py-0.5 font-mono text-[8px] font-semibold text-ds-green">
                    {filtered[0].discount}
                  </span>
                )}
                <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">
                  {filtered[0].brand}
                </div>
                <div className="mt-1 text-lg font-bold">{filtered[0].name}</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[21px] font-bold">{fmtBrl(filtered[0].price)}</span>
                  {filtered[0].oldPrice && (
                    <span className="font-mono text-[11px] text-ds-mute line-through">
                      {fmtBrl(filtered[0].oldPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SMALL CELLS - products 2 and 3 */}
          {filtered.slice(1, 3).map((p) => (
            <div
              key={p.id}
              className="relative flex flex-col justify-end overflow-hidden rounded-2xl border border-white/5 bg-ds-bg-2 p-4"
            >
              <div className="mb-auto flex items-center justify-center py-6">
                <Package className="size-10 text-ds-mute/20" />
              </div>
              {p.discount && (
                <span className="mb-2 inline-block w-fit rounded bg-ds-green/10 px-1.5 py-0.5 font-mono text-[8px] font-semibold text-ds-green">
                  {p.discount}
                </span>
              )}
              <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">
                {p.brand}
              </div>
              <div className="mt-0.5 text-[13px] font-semibold leading-tight">{p.name}</div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-sm font-bold">{fmtBrl(p.price)}</span>
                {p.oldPrice && (
                  <span className="font-mono text-[10px] text-ds-mute line-through">
                    {fmtBrl(p.oldPrice)}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* WIDE CARD - product 4 (col-span-3, horizontal) */}
          {filtered[3] && (
            <div className="col-span-3 flex items-center gap-5 overflow-hidden rounded-2xl border border-white/5 bg-ds-bg-2 p-4">
              <div className="flex size-[80px] shrink-0 items-center justify-center rounded-xl bg-ds-bg-1">
                <Package className="size-8 text-ds-mute/20" />
              </div>
              <div className="flex-1">
                {filtered[3].discount && (
                  <span className="mb-1 inline-block rounded bg-ds-green/10 px-1.5 py-0.5 font-mono text-[8px] font-semibold text-ds-green">
                    {filtered[3].discount}
                  </span>
                )}
                <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">
                  {filtered[3].brand}
                </div>
                <div className="mt-0.5 text-[14px] font-semibold">{filtered[3].name}</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-base font-bold">{fmtBrl(filtered[3].price)}</span>
                  {filtered[3].oldPrice && (
                    <span className="font-mono text-[11px] text-ds-mute line-through">
                      {fmtBrl(filtered[3].oldPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* REMAINING SMALL CELLS - products 5 and 6 */}
          {filtered.slice(4).map((p) => (
            <div
              key={p.id}
              className="relative flex flex-col justify-end overflow-hidden rounded-2xl border border-white/5 bg-ds-bg-2 p-4"
            >
              <div className="mb-auto flex items-center justify-center py-6">
                <Package className="size-10 text-ds-mute/20" />
              </div>
              {p.discount && (
                <span className="mb-2 inline-block w-fit rounded bg-ds-green/10 px-1.5 py-0.5 font-mono text-[8px] font-semibold text-ds-green">
                  {p.discount}
                </span>
              )}
              <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">
                {p.brand}
              </div>
              <div className="mt-0.5 text-[13px] font-semibold leading-tight">{p.name}</div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-sm font-bold">{fmtBrl(p.price)}</span>
                {p.oldPrice && (
                  <span className="font-mono text-[10px] text-ds-mute line-through">
                    {fmtBrl(p.oldPrice)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── MAIN COMPONENT ─── */

export function MerchantView() {
  const [view, setView] = useState<TabView>("dashboard")

  return (
    <div>
      {/* TAB STRIP */}
      <div className="flex gap-6 border-b border-ds-line px-6 pt-1">
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

      {/* TAB CONTENT */}
      {view === "dashboard" && <SalesDashboard />}
      {view === "vitrine" && <VitrinePanel />}
    </div>
  )
}
