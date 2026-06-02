"use client"

import { useEffect, useState } from "react"
import {
  Package,
  Search,
  SlidersHorizontal,
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
import { formatBRL } from "@/lib/db/client"
import { listSales, addSale } from "@/lib/db/sales"
import { listProducts, addProduct } from "@/lib/db/products"
import { listReceivables } from "@/lib/db/receivables"
import type { Product, Sale } from "@/lib/db/types"

/* ─── TYPES ─── */

type TabView = "dashboard" | "vitrine"
type Period = "hoje" | "7d" | "30d"
type Category = "tudo" | "smartphones" | "kitchen" | "consoles"

const TOP_COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981"]

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
  const [sales, setSales] = useState<Sale[]>([])
  const [productCount, setProductCount] = useState(0)
  const [toReceive, setToReceive] = useState(0)
  const [registering, setRegistering] = useState(false)

  async function reload() {
    const [sa, prods, recs] = await Promise.all([
      listSales(),
      listProducts(),
      listReceivables(),
    ])
    setSales(sa)
    setProductCount(prods.length)
    setToReceive(
      recs.filter((r) => r.status === "pendente").reduce((s, r) => s + r.net_value, 0),
    )
  }

  useEffect(() => {
    let active = true
    Promise.all([listSales(), listProducts(), listReceivables()])
      .then(([sa, prods, recs]) => {
        if (!active) return
        setSales(sa)
        setProductCount(prods.length)
        setToReceive(
          recs.filter((r) => r.status === "pendente").reduce((s, r) => s + r.net_value, 0),
        )
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const revenue = sales.reduce((s, v) => s + v.amount_brl, 0)
  const ticket = sales.length ? revenue / sales.length : 0
  const topSales = [...sales].sort((a, b) => b.amount_brl - a.amount_brl).slice(0, 5)

  const handleNewSale = async () => {
    const name = window.prompt("Nome do cliente:")?.trim()
    if (!name) return
    const raw = window.prompt("Valor da venda (R$):")?.replace(",", ".")
    const amount = Number(raw)
    if (!Number.isFinite(amount) || amount <= 0) return
    setRegistering(true)
    try {
      await addSale({ customer_name: name, amount_brl: amount })
      await reload()
    } catch {
      // silencioso
    } finally {
      setRegistering(false)
    }
  }

  return (
    <div className="grid grid-cols-[1fr_318px] gap-[18px] p-5 px-6">
      {/* COL PRINCIPAL */}
      <div className="flex min-w-0 flex-col gap-[18px]">
        {/* HERO RECEITA */}
        <div className="grid grid-cols-2 gap-5 rounded-[18px] border border-ds-line bg-ds-bg-1 p-[22px]">
          <div className="flex flex-col">
            <div className="flex items-start justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ds-mute">
                Receita no período
              </span>
              <div className="flex gap-0.5 rounded-[9px] border border-ds-line bg-ds-bg p-0.5">
                {periods.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPeriod(p.id)}
                    className={cn(
                      "rounded-[7px] px-[11px] py-[5px] font-mono text-[9px] font-semibold transition-colors",
                      period === p.id
                        ? "border border-ds-line bg-ds-bg-2 text-ds-ink"
                        : "text-ds-mute"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 text-[40px] leading-none font-extrabold tracking-[-0.04em]">
              {formatBRL(revenue)}
            </div>
            <span className="mt-2.5 inline-flex w-fit items-center gap-[5px] rounded-[7px] bg-ds-green/10 px-[9px] py-1 font-mono text-[11px] font-semibold text-ds-green">
              {sales.length} {sales.length === 1 ? "venda registrada" : "vendas registradas"}
            </span>

            <div className="mt-[18px] flex">
              {[
                { label: "Vendas", value: String(sales.length), detail: undefined as string | undefined },
                { label: "Ticket médio", value: formatBRL(ticket), detail: undefined as string | undefined },
                { label: "A receber", value: formatBRL(toReceive), detail: undefined as string | undefined },
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
                  {b.detail && (
                    <div className="mt-px font-mono text-[9px] text-ds-green">
                      {b.detail}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="mb-2 font-mono text-[9px] text-ds-mute">
              Evolução de receita
            </span>
            <div className="relative min-h-[150px] flex-1">
              <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="size-full">
                <defs>
                  <linearGradient id="revenue-grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[40, 80, 120].map((y) => (
                  <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(128,128,128,0.18)" strokeDasharray="2 6" />
                ))}
                <path
                  d="M0 120 L57 112 L114 100 L171 90 L228 68 L285 55 L342 38 L400 28"
                  stroke="#4ade80"
                  strokeWidth="2.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0 120 L57 112 L114 100 L171 90 L228 68 L285 55 L342 38 L400 28 L400 150 L0 150 Z"
                  fill="url(#revenue-grad)"
                />
                <circle cx="400" cy="28" r="4.5" fill="#4ade80" />
              </svg>
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[8px] text-ds-mute">
              {["seg", "ter", "qua", "qui", "sex", "sáb", "dom"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Vendas registradas", value: String(sales.length), detail: "no total", valueColor: "text-ds-green", detailColor: "text-ds-green" },
            { label: "Ticket médio", value: formatBRL(ticket), detail: "por compra" },
            { label: "A receber", value: formatBRL(toReceive), detail: "recebíveis pendentes", detailColor: "text-ds-orange" },
            { label: "Produtos ativos", value: String(productCount), detail: "na vitrine" },
          ].map((k) => (
            <div key={k.label} className="rounded-[14px] border border-ds-line bg-ds-bg-1 p-[15px]">
              <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">{k.label}</div>
              <div className={cn("mt-2 text-[21px] font-bold tracking-tight", k.valueColor)}>{k.value}</div>
              <div className={cn("mt-[5px] font-mono text-[9px] text-ds-mute", k.detailColor)}>{k.detail}</div>
            </div>
          ))}
        </div>

        {/* MAIS VENDIDOS */}
        <div className="rounded-2xl border border-ds-line bg-ds-bg-1 p-[18px]">
          <div className="mb-3.5 flex items-center justify-between">
            <div>
              <div className="text-base font-bold tracking-tight">Maiores vendas</div>
              <div className="mt-0.5 font-mono text-[9px] text-ds-mute">
                suas vendas de maior valor
              </div>
            </div>
            <span className="font-mono text-[9px] text-ds-mute">
              ver tudo <span className="text-ds-orange">&rarr;</span>
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-ds-line hover:bg-transparent">
                {["#", "Cliente", "Itens", "Valor"].map((h) => (
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
              {topSales.map((s, i) => (
                <TableRow key={s.id} className="border-ds-line hover:bg-ds-ink/[0.03]">
                  <TableCell className="w-[26px] px-0 py-[11px] font-mono text-[11px] text-ds-mute">
                    {i + 1}
                  </TableCell>
                  <TableCell className="px-0 py-[11px]">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="size-[18px] shrink-0 rounded"
                        style={{ backgroundColor: TOP_COLORS[i % TOP_COLORS.length] }}
                      />
                      <span className="text-[13px] font-semibold">{s.customer_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-0 py-[11px] font-mono text-xs">
                    {s.items}
                  </TableCell>
                  <TableCell className="px-0 py-[11px] font-mono text-xs font-semibold">
                    {formatBRL(s.amount_brl)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {topSales.length === 0 && (
            <p className="pt-2 text-xs text-ds-dim">Nenhuma venda ainda.</p>
          )}
        </div>
      </div>

      {/* COL LATERAL */}
      <div className="flex flex-col gap-[18px]">
        {/* A RECEBER */}
        <SoftCard>
          <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">
            A receber
          </span>
          <div className="mt-2 text-[21px] font-bold">{formatBRL(toReceive)}</div>
          <div className="mt-1 font-mono text-[9px] text-ds-mute">
            recebíveis pendentes
          </div>
          <Button
            variant="ghost"
            className="mt-4 h-auto w-full gap-[7px] rounded-[11px] border border-ds-line bg-ds-bg-1 px-4 py-[9px] text-[12px] font-semibold text-ds-ink"
          >
            <Zap className="size-3.5" />
            Antecipar
          </Button>
        </SoftCard>

        {/* SCORE ON-CHAIN */}
        <SoftCard>
          <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">
            Score on-chain
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-[28px] font-bold leading-none">782</span>
            <span className="text-sm text-ds-mute">/900</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ds-bg-2">
            <div
              className="h-full rounded-full bg-ds-green"
              style={{ width: "87%" }}
            />
          </div>
          <div className="mt-2">
            <Badge
              variant="secondary"
              className="h-auto border-0 bg-ds-green/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-ds-green"
            >
              Excelente
            </Badge>
          </div>

          <div className="mt-3 border-t border-ds-line pt-3">
            {[
              { label: "Taxa descontada", value: "1,2%", green: true },
              { label: "Taxa base", value: "2,8%" },
            ].map((item, i) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center justify-between py-1.5",
                  i > 0 && "border-t border-ds-line"
                )}
              >
                <span className="font-mono text-[10px] text-ds-mute">
                  {item.label}
                </span>
                <span
                  className={cn(
                    "font-mono text-[11px] font-semibold",
                    item.green ? "text-ds-green" : "text-ds-mute"
                  )}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </SoftCard>

        {/* VENDAS RECENTES */}
        <SoftCard>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-base font-bold tracking-tight">
              Vendas recentes
            </div>
            <button
              onClick={handleNewSale}
              disabled={registering}
              className="font-mono text-[9px] font-semibold text-ds-orange transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {registering ? "..." : "+ nova venda"}
            </button>
          </div>

          {sales.length === 0 && (
            <p className="py-3 text-xs text-ds-dim">Nenhuma venda ainda.</p>
          )}

          {sales.slice(0, 6).map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "flex items-center gap-[11px] py-3",
                i > 0 && "border-t border-ds-line"
              )}
            >
              <div className="flex size-[34px] shrink-0 items-center justify-center rounded-full border border-ds-line bg-ds-bg-2 text-[11px] font-semibold text-ds-dim">
                {s.initials}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold">{s.customer_name}</div>
                <div className="mt-px font-mono text-[8px] text-ds-mute">
                  {s.items} {s.items === 1 ? "item" : "itens"} · {s.method}
                </div>
              </div>
              <div className="text-[13px] font-semibold text-ds-green">
                {formatBRL(s.amount_brl)}
              </div>
            </div>
          ))}
        </SoftCard>
      </div>
    </div>
  )
}

/* ─── VITRINE / ECOMMERCE TAB ─── */

function VitrinePanel() {
  const [category, setCategory] = useState<Category>("tudo")
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState<Product[]>([])

  async function reload() {
    setProducts(await listProducts())
  }

  useEffect(() => {
    let active = true
    listProducts()
      .then((p) => {
        if (active) setProducts(p)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const handleNewProduct = async () => {
    const name = window.prompt("Nome do produto:")?.trim()
    if (!name) return
    const raw = window.prompt("Preço (R$):")?.replace(",", ".")
    const price = Number(raw)
    if (!Number.isFinite(price) || price <= 0) return
    const brand = window.prompt("Marca (opcional):")?.trim() || null
    try {
      await addProduct({ name, price, brand, category: "tudo" })
      await reload()
    } catch {
      // silencioso
    }
  }

  const filtered = products.filter((p) => {
    const matchCategory = category === "tudo" || p.category === category
    const q = search.toLowerCase()
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(q) ||
      (p.brand ?? "").toLowerCase().includes(q)
    return matchCategory && matchSearch
  })

  return (
    <div className="grid grid-cols-[1fr_318px] gap-[18px] p-5 px-6">
      {/* COL PRINCIPAL */}
      <div className="flex min-w-0 flex-col gap-[18px]">
        {/* SEARCH + CATEGORIES */}
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-ds-line bg-ds-bg-2 px-4 py-2.5">
            <Search className="size-4 shrink-0 text-ds-mute" />
            <input
              type="text"
              placeholder="Buscar produto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[13px] text-ds-ink placeholder:text-ds-mute outline-none"
            />
            <button className="rounded-lg border border-ds-line bg-ds-bg-1 p-1.5 text-ds-mute transition-colors hover:text-ds-dim">
              <SlidersHorizontal className="size-3.5" />
            </button>
          </div>
          <div className="flex gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  "soft-card-sm whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-semibold transition-colors",
                  category === c.id ? "text-ds-ink" : "text-ds-mute"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="mb-3 size-10 text-ds-mute" />
            <span className="text-sm text-ds-mute">
              Nenhum produto encontrado
            </span>
          </div>
        )}

        {/* PRODUCT GRID (BENTO) */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {filtered[0] && (
              <div className="col-span-2 row-span-2 relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-2xl border border-ds-line bg-ds-bg-2">
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
                  <div className="mt-1 text-lg font-bold">
                    {filtered[0].name}
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-[21px] font-bold">
                      {fmtBrl(filtered[0].price)}
                    </span>
                    {filtered[0].old_price && (
                      <span className="font-mono text-[11px] text-ds-mute line-through">
                        {fmtBrl(filtered[0].old_price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {filtered.slice(1, 3).map((p) => (
              <div
                key={p.id}
                className="relative flex flex-col justify-end overflow-hidden rounded-2xl border border-ds-line bg-ds-bg-2 p-4"
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
                <div className="mt-0.5 text-[13px] font-semibold leading-tight">
                  {p.name}
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-sm font-bold">{fmtBrl(p.price)}</span>
                  {p.old_price && (
                    <span className="font-mono text-[10px] text-ds-mute line-through">
                      {fmtBrl(p.old_price)}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {filtered[3] && (
              <div className="col-span-3 flex items-center gap-5 overflow-hidden rounded-2xl border border-ds-line bg-ds-bg-2 p-4">
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
                  <div className="mt-0.5 text-[14px] font-semibold">
                    {filtered[3].name}
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-base font-bold">
                      {fmtBrl(filtered[3].price)}
                    </span>
                    {filtered[3].old_price && (
                      <span className="font-mono text-[11px] text-ds-mute line-through">
                        {fmtBrl(filtered[3].old_price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {filtered.slice(4).map((p) => (
              <div
                key={p.id}
                className="relative flex flex-col justify-end overflow-hidden rounded-2xl border border-ds-line bg-ds-bg-2 p-4"
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
                <div className="mt-0.5 text-[13px] font-semibold leading-tight">
                  {p.name}
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-sm font-bold">{fmtBrl(p.price)}</span>
                  {p.old_price && (
                    <span className="font-mono text-[10px] text-ds-mute line-through">
                      {fmtBrl(p.old_price)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COL LATERAL */}
      <div className="flex flex-col gap-[18px]">
        {/* RESUMO DA VITRINE */}
        <SoftCard>
          <div className="mb-3 text-base font-bold tracking-tight">
            Resumo da vitrine
          </div>

          {[
            { label: "Total de produtos", value: `${products.length}` },
            { label: "Com desconto", value: `${products.filter((p) => p.discount).length}` },
            { label: "Preço médio", value: products.length ? `R$ ${Math.round(products.reduce((a, p) => a + p.price, 0) / products.length).toLocaleString("pt-BR")}` : "R$ 0" },
            { label: "Categorias", value: `${new Set(products.map((p) => p.category)).size}` },
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
              <span className="font-mono text-[11px] font-semibold text-ds-dim">
                {item.value}
              </span>
            </div>
          ))}
        </SoftCard>

        {/* POR CATEGORIA */}
        <SoftCard>
          <div className="mb-2 text-base font-bold tracking-tight">
            Por categoria
          </div>

          {Array.from(
            products.reduce((map, p) => {
              map.set(p.category, (map.get(p.category) ?? 0) + 1)
              return map
            }, new Map<string, number>()),
          ).map(([name, count], i) => (
            <div
              key={name}
              className={cn(
                "flex items-center gap-[11px] py-3",
                i > 0 && "border-t border-ds-line"
              )}
            >
              <div
                className="size-[10px] shrink-0 rounded-[3px]"
                style={{ backgroundColor: TOP_COLORS[i % TOP_COLORS.length] }}
              />
              <div className="flex-1 text-[13px] font-semibold capitalize">
                {name}
              </div>
              <span className="font-mono text-[11px] text-ds-mute">
                {count} produtos
              </span>
            </div>
          ))}
          {products.length === 0 && (
            <p className="py-2 text-xs text-ds-dim">Sem produtos.</p>
          )}
        </SoftCard>

        {/* AÇÃO RÁPIDA */}
        <SoftCard>
          <div className="text-sm font-semibold">Adicionar produto</div>
          <div className="mt-[3px] mb-3.5 font-mono text-[9px] text-ds-mute">
            cadastre novos itens na vitrine
          </div>
          <Button
            onClick={handleNewProduct}
            className="h-auto w-full gap-2 rounded-xl border-0 bg-ds-ink py-3 text-[13px] font-semibold text-ds-bg shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_12px_-6px_rgba(0,0,0,0.4)]"
          >
            <Package className="size-3.5" />
            Novo produto
          </Button>
        </SoftCard>
      </div>
    </div>
  )
}

/* ─── MAIN COMPONENT ─── */

export function MerchantView() {
  const [view, setView] = useState<TabView>("dashboard")

  return (
    <div>
      {/* TAB STRIP */}
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

      {/* TAB CONTENT */}
      {view === "dashboard" && <SalesDashboard />}
      {view === "vitrine" && <VitrinePanel />}
    </div>
  )
}
