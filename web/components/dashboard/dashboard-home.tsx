"use client"

import { useEffect, useState } from "react"
import {
  Activity,
  ArrowUpDown,
  CircleDollarSign,
  FileText,
  MoreHorizontal,
  Plus,
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
import {
  usePrices,
  fmtUsd,
  fmtBrl,
  fmtPct,
  SolanaLogo,
  BitcoinLogo,
  UsdcLogo,
  EthereumLogo,
  RealIcon,
  SoftCard,
  BizCell,
} from "./shared"
import { getAccount, setFund } from "@/lib/db/accounts"
import { addTransaction } from "@/lib/db/transactions"
import { listPositions, financeOpportunity } from "@/lib/db/positions"
import { listOpportunities } from "@/lib/db/opportunities"
import type { Account, Opportunity, Position } from "@/lib/db/types"

/* ─── HELPERS ─── */

const fmtApr = (n: number) => `${n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`

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

function Ticker({ prices }: { prices: ReturnType<typeof usePrices> }) {
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

/* ─── COMPONENT ─── */

export function DashboardHome() {
  const prices = usePrices()
  const depositBrl = 500
  const usdcOut = depositBrl / prices.usdcBrl

  const [account, setAccount] = useState<Account>({ balance_brl: 0, fund_brl: 0 })
  const [positions, setPositions] = useState<Position[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [depositing, setDepositing] = useState(false)

  async function reload() {
    const [acc, pos, ops] = await Promise.all([
      getAccount("PF"),
      listPositions(),
      listOpportunities(),
    ])
    setAccount(acc)
    setPositions(pos)
    setOpportunities(ops)
  }

  useEffect(() => {
    let active = true
    Promise.all([getAccount("PF"), listPositions(), listOpportunities()])
      .then(([acc, pos, ops]) => {
        if (!active) return
        setAccount(acc)
        setPositions(pos)
        setOpportunities(ops)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const totalEarned = positions.reduce((s, p) => s + p.earned_brl, 0)
  const patrimonio = account.fund_brl + account.balance_brl
  const activeCount = positions.filter((p) => p.status === "active").length

  const handleFinance = async (op: Opportunity) => {
    setError(null)
    setBusyId(op.id)
    try {
      const amount = Math.min(100, account.balance_brl)
      if (amount <= 0) throw new Error("Saldo disponível insuficiente para financiar.")
      await financeOpportunity(op, amount)
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível financiar.")
    } finally {
      setBusyId(null)
    }
  }

  const handleDeposit = async () => {
    setError(null)
    setDepositing(true)
    try {
      await setFund("PF", account.fund_brl + depositBrl)
      await addTransaction({
        accountType: "PF",
        title: "Depósito no fundo",
        subtitle: "Entrada via Pix",
        amount_brl: depositBrl,
        is_credit: true,
        kind: "deposit",
      })
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível depositar.")
    } finally {
      setDepositing(false)
    }
  }

  return (
    <>
      <Ticker prices={prices} />
      <div className="grid grid-cols-[1fr_318px] gap-[18px] p-5 px-6">
      {/* COL PRINCIPAL */}
      <div className="flex min-w-0 flex-col gap-[18px]">
        {/* HERO PATRIMÔNIO */}
        <div className="grid grid-cols-2 gap-5 rounded-[18px] border border-ds-line bg-ds-bg-1 p-[22px]">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ds-mute">Patrimônio total</span>
            <div className="mt-2 text-[40px] leading-none font-extrabold tracking-[-0.04em]">
              {fmtBrl(patrimonio)}
            </div>
            <span className="mt-2.5 inline-flex w-fit items-center gap-[5px] rounded-[7px] bg-ds-green/10 px-[9px] py-1 font-mono text-[11px] font-semibold text-ds-green">
              ↑ +{fmtBrl(totalEarned)} · rendimento
            </span>
            <div className="mt-[18px] flex">
              {[
                { label: "No fundo", value: fmtBrl(account.fund_brl) },
                { label: "Disponível", value: fmtBrl(account.balance_brl) },
                { label: "Rendimento total", value: `+${fmtBrl(totalEarned)}`, green: true },
              ].map((b, i, arr) => (
                <div key={b.label} className={cn("pr-5 mr-5", i < arr.length - 1 && "border-r border-ds-line")}>
                  <div className="font-mono text-[8px] uppercase tracking-[0.05em] text-ds-mute">{b.label}</div>
                  <div className={cn("mt-[5px] text-base font-bold", b.green && "text-ds-green")}>{b.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-auto flex gap-[9px] pt-5">
              <Button
                onClick={handleDeposit}
                disabled={depositing}
                className="h-auto gap-[7px] rounded-[11px] border-0 bg-ds-ink px-5 py-[11px] text-[13px] font-semibold text-ds-bg shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_12px_-6px_rgba(0,0,0,0.4)] disabled:opacity-60"
              >
                <Plus className="size-3.5" />
                {depositing ? "Depositando..." : "Depositar"}
              </Button>
              <Button variant="ghost" className="h-auto rounded-[11px] border border-ds-line bg-ds-bg-1 px-5 py-[11px] text-[13px] font-semibold text-ds-ink">
                Resgatar
              </Button>
            </div>
            {error && (
              <div className="mt-3 rounded-xl border border-ds-red/20 bg-ds-red/5 px-3 py-2 text-[11px] font-medium text-ds-red">
                {error}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[9px] text-ds-mute">Evolução do patrimônio</span>
              <div className="flex gap-0.5 rounded-[9px] border border-ds-line bg-ds-bg p-0.5">
                {["1M", "6M", "Tudo"].map((t) => (
                  <span key={t} className={cn("rounded-md px-2 py-1 font-mono text-[9px]", t === "6M" ? "border border-ds-line bg-ds-bg-2 text-ds-ink" : "text-ds-mute")}>{t}</span>
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
                {[40, 80, 120].map((y) => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(128,128,128,0.18)" strokeDasharray="2 6" />)}
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
            { label: "Rendimento total", value: `+${fmtBrl(totalEarned)}`, detail: "acumulado", valueColor: "text-ds-green", detailColor: "text-ds-green" },
            { label: "APR da carteira", value: "15,1%", detail: "acima da média", detailColor: "text-ds-orange" },
            { label: "Posições ativas", value: String(activeCount), detail: "comércios" },
            { label: "Disponível", value: fmtBrl(account.balance_brl), detail: "para investir" },
          ].map((k) => (
            <div key={k.label} className="rounded-[14px] border border-ds-line bg-ds-bg-1 p-[15px]">
              <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">{k.label}</div>
              <div className={cn("mt-2 text-[21px] font-bold tracking-tight", k.valueColor)}>{k.value}</div>
              <div className={cn("mt-[5px] font-mono text-[9px] text-ds-mute", k.detailColor)}>{k.detail}</div>
            </div>
          ))}
        </div>

        {/* MINHAS POSIÇÕES */}
        <div className="rounded-2xl border border-ds-line bg-ds-bg-1 p-[18px]">
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
                <TableRow key={p.id} className="border-ds-line hover:bg-ds-ink/[0.03]">
                  <TableCell className="px-0 py-[11px]"><BizCell name={p.merchant_name} hash={p.hash ?? ""} /></TableCell>
                  <TableCell className="px-0 py-[11px] font-mono text-xs">{fmtBrl(p.invested_brl)}</TableCell>
                  <TableCell className="px-0 py-[11px] font-mono text-xs font-semibold text-ds-green">+{fmtBrl(p.earned_brl)}</TableCell>
                  <TableCell className="px-0 py-[11px] font-mono text-xs font-semibold text-ds-green">{fmtApr(p.apr)}</TableCell>
                  <TableCell className="px-0 py-[11px] font-mono text-xs">{p.liquidates_in_days}d</TableCell>
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
        <div className="rounded-2xl border border-ds-line bg-ds-bg-1 p-[18px]">
          <div className="mb-3.5 flex items-center justify-between">
            <div>
              <div className="text-base font-bold tracking-tight">Explorar mais oportunidades</div>
              <div className="mt-0.5 font-mono text-[9px] text-ds-mute">recebíveis abertos no marketplace</div>
            </div>
            <div className="flex gap-0.5 rounded-[9px] border border-ds-line bg-ds-bg p-0.5">
              <span className="rounded-md border border-ds-line bg-ds-bg-2 px-[11px] py-1.5 font-mono text-[10px] text-ds-ink">Risco baixo</span>
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
              {opportunities.map((m, i) => (
                <TableRow key={m.id} className="border-ds-line hover:bg-ds-ink/[0.03]">
                  <TableCell className="w-[26px] px-0 py-[11px] font-mono text-[11px] text-ds-mute">{i + 1}</TableCell>
                  <TableCell className="px-0 py-[11px]"><BizCell name={m.merchant_name} hash={m.hash ?? ""} /></TableCell>
                  <TableCell className="px-0 py-[11px] font-mono text-xs">{fmtBrl(m.receivable_brl)}</TableCell>
                  <TableCell className="px-0 py-[11px] font-mono text-xs font-semibold text-ds-green">{fmtApr(m.apr)}</TableCell>
                  <TableCell className="px-0 py-[11px]">
                    <Badge variant="secondary" className="h-auto border-0 bg-ds-green/10 font-mono text-[8px] uppercase text-ds-green">baixo</Badge>
                  </TableCell>
                  <TableCell className="px-0 py-[11px]">
                    <div className="flex items-center gap-2">
                      <div className="h-1 min-w-[44px] flex-1 overflow-hidden rounded-sm bg-ds-bg-2">
                        <div className="h-full rounded-sm bg-ds-orange" style={{ width: `${m.fill_pct}%` }} />
                      </div>
                      <span className="font-mono text-[9px] text-ds-dim">{m.fill_pct}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-0 py-[11px] text-right">
                    <Button
                      onClick={() => handleFinance(m)}
                      disabled={busyId === m.id}
                      variant="ghost"
                      size="sm"
                      className="h-auto rounded-[11px] border border-ds-line bg-ds-bg-1 px-3.5 py-1.5 text-[11px] font-semibold text-ds-ink disabled:opacity-60"
                    >
                      {busyId === m.id ? "..." : "Financiar"}
                    </Button>
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
            { logo: <div className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-ds-orange/10 text-ds-orange"><CircleDollarSign className="size-[17px]" /></div>, name: "Cota do fundo", detail: "aplicado", value: fmtBrl(account.fund_brl) },
            { logo: <UsdcLogo size={34} />, name: "USDC", detail: "disponível", value: fmtBrl(account.balance_brl) },
            { logo: <SolanaLogo size={34} />, name: "SOL", detail: "pra taxa de rede", value: "R$ 24,00" },
          ].map((a, i) => (
            <div key={a.name} className={cn("flex items-center gap-[11px] py-3", i > 0 && "border-t border-ds-line")}>
              {a.logo}
              <div className="flex-1">
                <div className="text-[13px] font-semibold">{a.name}</div>
                <div className="mt-px font-mono text-[8px] text-ds-mute">{a.detail}</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-semibold">{a.value}</div>
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

          <div className="mb-3 flex gap-0.5 rounded-[10px] border border-ds-line bg-ds-bg p-0.5">
            <button className="soft-card-sm flex-1 rounded-[7px] py-[7px] text-[11px] font-semibold text-ds-ink">Depositar</button>
            <button className="flex-1 rounded-[7px] py-[7px] text-[11px] font-semibold text-ds-mute">Resgatar</button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-ds-line bg-ds-bg p-[11px] px-[13px]">
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

          <div className="flex items-center justify-between rounded-xl border border-ds-line bg-ds-bg p-[11px] px-[13px]">
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

          <Button
            onClick={handleDeposit}
            disabled={depositing}
            className="h-auto w-full gap-2 rounded-xl border-0 bg-ds-ink py-3 text-[13px] font-semibold text-ds-bg shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_12px_-6px_rgba(0,0,0,0.4)] disabled:opacity-60"
          >
            <Plus className="size-3.5" />
            {depositing ? "Processando..." : "Confirmar depósito"}
          </Button>
        </SoftCard>
      </div>
    </div>
    </>
  )
}
