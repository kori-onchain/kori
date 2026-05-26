"use client"

import {
  ArrowUpDown,
  CircleDollarSign,
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
  fmtBrl,
  SolanaLogo,
  UsdcLogo,
  RealIcon,
  SoftCard,
  BizCell,
} from "./shared"

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

/* ─── COMPONENT ─── */

export function DashboardHome() {
  const prices = usePrices()
  const depositBrl = 500
  const usdcOut = depositBrl / prices.usdcBrl

  return (
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
  )
}
