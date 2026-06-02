"use client"

import React, { useState, useCallback, useEffect } from "react"
import {
  Eye,
  EyeOff,
  Copy,
  Plus,
  Globe,
  Pause,
  Navigation,
  Sliders,
  ChevronRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SoftCard } from "./shared"
import { formatBRL } from "@/lib/db/client"
import { getCard, updateCard, updateCardFlags } from "@/lib/db/cards"
import { listTransactions } from "@/lib/db/transactions"
import type { Transaction } from "@/lib/db/types"

function fmtTxDate(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/* ─── DIAMOND TEXTURE ─── */

const DiamondTexture = () => {
  const lines: React.ReactElement[] = []
  const sp = 18,
    W = 500,
    H = 320
  for (let i = -H; i < W + H; i += sp) {
    lines.push(
      <line
        key={`d${i}`}
        x1={i}
        y1={0}
        x2={i + H}
        y2={H}
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="0.8"
      />
    )
    lines.push(
      <line
        key={`u${i}`}
        x1={i + H}
        y1={0}
        x2={i}
        y2={H}
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="0.8"
      />
    )
  }
  return (
    <svg
      className="absolute inset-0 size-full opacity-60"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
    >
      {lines}
    </svg>
  )
}

/* ─── CHIP EMV SVG ─── */

function ChipEMV() {
  return (
    <svg width={46} height={35} viewBox="0 0 46 35" fill="none">
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d4d4d4" />
          <stop offset="30%" stopColor="#9a9a9a" />
          <stop offset="55%" stopColor="#c8c8c8" />
          <stop offset="100%" stopColor="#787878" />
        </linearGradient>
        <linearGradient id="ch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.32" />
          <stop offset="50%" stopColor="white" stopOpacity="0.06" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="46" height="35" rx="5" fill="url(#cg)" />
      <line x1="0" y1="12" x2="46" y2="12" stroke="rgba(0,0,0,0.28)" strokeWidth="0.8" />
      <line x1="0" y1="23" x2="46" y2="23" stroke="rgba(0,0,0,0.28)" strokeWidth="0.8" />
      <line x1="14" y1="0" x2="14" y2="12" stroke="rgba(0,0,0,0.28)" strokeWidth="0.8" />
      <line x1="32" y1="0" x2="32" y2="12" stroke="rgba(0,0,0,0.28)" strokeWidth="0.8" />
      <line x1="14" y1="23" x2="14" y2="35" stroke="rgba(0,0,0,0.28)" strokeWidth="0.8" />
      <line x1="32" y1="23" x2="32" y2="35" stroke="rgba(0,0,0,0.28)" strokeWidth="0.8" />
      <rect x="10" y="13" width="26" height="9" rx="1.5" stroke="rgba(0,0,0,0.28)" strokeWidth="0.8" fill="none" />
      <line x1="10" y1="17.5" x2="36" y2="17.5" stroke="rgba(0,0,0,0.28)" strokeWidth="0.8" />
      <rect x="0" y="14" width="3" height="7" rx="1" fill="rgba(0,0,0,0.12)" />
      <rect width="46" height="17" rx="5" fill="url(#ch)" />
    </svg>
  )
}

/* ─── CONTACTLESS ICON ─── */

function ContactlessIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <path d="M5 19Q5 5 19 5" stroke="#c4c4c4" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M8 19Q8 8 19 8" stroke="#c4c4c4" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M11 19Q11 11 19 11" stroke="#c4c4c4" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/* ─── MASTERCARD MONO ─── */

function MastercardMono() {
  return (
    <svg width={38} height={25} viewBox="0 0 40 26" fill="none">
      <circle cx="14" cy="13" r="11" fill="#8a8a8e" opacity="0.55" />
      <circle cx="26" cy="13" r="11" fill="#b4b4b8" opacity="0.4" />
    </svg>
  )
}

/* ─── KORI K GLYPH ─── */

function KoriKGlyph() {
  return (
    <svg width={46} height={55} className="text-[#d6d6d6]">
      <use href="#kori-k" />
    </svg>
  )
}

/* ─── PREMIUM CARD ─── */

function PremiumCard({ holder, last4 }: { holder: string; last4: string }) {
  return (
    <div
      className="aspect-[1.586/1] overflow-hidden rounded-[20px] bg-[#0c0c0d] relative"
      style={{ perspective: "1400px" }}
    >
      <div
        className="size-full relative"
        style={{ transform: "rotateX(3deg)", transformOrigin: "center top" }}
      >
        <div className="absolute inset-0 rounded-[20px] shadow-[0_14px_40px_-10px_rgba(0,0,0,0.5)]" />
        <DiamondTexture />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(118deg, transparent 20%, rgba(255,255,255,0.10) 50%, transparent 80%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-white/[0.08]" />
        <div className="relative z-10 flex size-full flex-col justify-between px-[24px] py-[22px]">
          <div className="flex items-start justify-between">
            <ChipEMV />
            <div className="flex flex-col items-end gap-1">
              <ContactlessIcon />
              <span className="font-mono text-[8px] tracking-[1.2px] text-[#9a9a9e]">Virtual</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <KoriKGlyph />
            <span className="mt-1 text-[16px] font-bold tracking-[8px] text-[#d6d6d6]">
              KORI
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="mb-0.5 font-mono text-[8px] uppercase tracking-[1.2px] text-[#5a5a5e]">
                PORTADOR
              </div>
              <div className="mb-1 text-[14px] font-bold tracking-[0.5px] text-[#fafafa]">{holder}</div>
              <div className="font-mono text-[12px] tracking-[1.5px] text-[#9a9a9e]">
                {"•••• •••• •••• "}
                {last4}
              </div>
            </div>
            <MastercardMono />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── TOGGLE ─── */

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[20px] w-[36px] shrink-0 rounded-full transition-colors duration-200",
        checked ? "bg-green-500/25" : "bg-ds-faint"
      )}
    >
      <span
        className={cn(
          "absolute top-[2px] block size-4 rounded-full shadow-sm transition-all duration-200",
          checked
            ? "translate-x-[18px] bg-ds-green"
            : "translate-x-[2px] bg-ds-mute"
        )}
      />
    </button>
  )
}

/* ─── CARD VIEW ─── */

export function CardView() {
  const [cardNumber, setCardNumber] = useState("5421 9843 7261 8294")
  const [expiry, setExpiry] = useState("08/29")
  const [cvv, setCvv] = useState("842")
  const [isRevealed, setIsRevealed] = useState(false)
  const [isFrozen, setIsFrozen] = useState(false)
  const [isOnlineActive, setIsOnlineActive] = useState(true)
  const [isInternationalActive, setIsInternationalActive] = useState(true)
  const [limitBrl, setLimitBrl] = useState(6000)
  const [invoiceBrl, setInvoiceBrl] = useState(1720)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    let active = true
    Promise.all([getCard(), listTransactions("PF")])
      .then(([card, txs]) => {
        if (!active) return
        if (card) {
          setCardNumber(card.number)
          setExpiry(card.expiry)
          setCvv(card.cvv)
          setIsFrozen(card.is_frozen)
          setIsOnlineActive(card.online_enabled)
          setIsInternationalActive(card.international_enabled)
          setLimitBrl(card.limit_brl)
          setInvoiceBrl(card.invoice_brl)
        }
        setTransactions(txs)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const last4 = cardNumber.replace(/\s/g, "").slice(-4)
  const availableBrl = Math.max(0, limitBrl - invoiceBrl)
  const usedPct = limitBrl > 0 ? Math.round((invoiceBrl / limitBrl) * 100) : 0

  const handleCopy = useCallback(() => {
    const text = `Numero: ${cardNumber}\nValidade: ${expiry}\nCVV: ${cvv}`
    navigator.clipboard.writeText(text)
  }, [cardNumber, expiry, cvv])

  const handleNewVirtual = useCallback(() => {
    const rand = () => Math.floor(1000 + Math.random() * 9000).toString()
    const next = `5421 ${rand()} ${rand()} ${last4}`
    setCardNumber(next)
    updateCard({ number: next }).catch(() => {})
  }, [last4])

  const setFrozen = useCallback((v: boolean) => {
    setIsFrozen(v)
    updateCardFlags({ is_frozen: v }).catch(() => {})
  }, [])

  const setOnline = useCallback((v: boolean) => {
    setIsOnlineActive(v)
    updateCardFlags({ online_enabled: v }).catch(() => {})
  }, [])

  const setInternational = useCallback((v: boolean) => {
    setIsInternationalActive(v)
    updateCardFlags({ international_enabled: v }).catch(() => {})
  }, [])

  return (
    <div className="grid grid-cols-[1fr_318px] gap-[18px] p-5 px-6">
      {/* COL PRINCIPAL */}
      <div className="flex min-w-0 flex-col gap-[18px]">
        {/* HERO: CARTÃO + SALDO */}
        <div className="grid grid-cols-2 gap-5 rounded-[18px] border border-ds-line bg-ds-bg-1 p-[22px]">
          <div className="relative">
            <PremiumCard holder="KAUA MIGUEL" last4={last4} />
            {isFrozen && (
              <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[20px] bg-black/60 backdrop-blur-sm">
                <span className="rounded-full border border-white/10 bg-white/10 px-5 py-2 font-mono text-sm font-bold tracking-[0.12em] text-white">
                  CONGELADO
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ds-mute">
              Virtual · Mastercard
            </span>
            <div className="mt-2 text-[40px] leading-none font-extrabold tracking-[-0.04em]">
              {formatBRL(availableBrl)}
            </div>
            <span className="mt-2.5 inline-flex w-fit items-center gap-[5px] rounded-[7px] bg-ds-green/10 px-[9px] py-1 font-mono text-[11px] font-semibold text-ds-green">
              disponível para uso
            </span>

            <div className="mt-[18px] flex">
              {[
                { label: "Gasto no mês", value: formatBRL(invoiceBrl) },
                { label: "Limite total", value: formatBRL(limitBrl) },
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
              <Button
                onClick={handleCopy}
                className="h-auto gap-[7px] rounded-[11px] border-0 bg-ds-ink px-5 py-[11px] text-[13px] font-semibold text-ds-bg shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_12px_-6px_rgba(0,0,0,0.4)]"
              >
                <Copy className="size-3.5" />
                Copiar dados
              </Button>
              <Button
                variant="ghost"
                onClick={handleNewVirtual}
                className="h-auto rounded-[11px] border border-ds-line bg-ds-bg-1 px-5 py-[11px] text-[13px] font-semibold text-ds-ink"
              >
                <Plus className="size-3.5" />
                Novo virtual
              </Button>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Disponível", value: formatBRL(availableBrl), detail: `${100 - usedPct}% do limite`, valueColor: "text-ds-green" },
            { label: "Gasto no mês", value: formatBRL(invoiceBrl), detail: `${usedPct}% utilizado` },
            { label: "Status", value: isFrozen ? "Congelado" : "Ativo", detail: isFrozen ? "bloqueado" : "operando normalmente", valueColor: isFrozen ? "text-ds-red" : "text-ds-green" },
            { label: "Fecha fatura", value: "15 dias", detail: "venc. 10 jul" },
          ].map((k) => (
            <div key={k.label} className="rounded-[14px] border border-ds-line bg-ds-bg-1 p-[15px]">
              <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ds-mute">{k.label}</div>
              <div className={cn("mt-2 text-[21px] font-bold tracking-tight", k.valueColor)}>{k.value}</div>
              <div className="mt-[5px] font-mono text-[9px] text-ds-mute">{k.detail}</div>
            </div>
          ))}
        </div>

        {/* CONTROLES */}
        <div className="rounded-2xl border border-ds-line bg-ds-bg-1 p-[18px]">
          <div className="mb-3.5 flex items-center justify-between">
            <div>
              <div className="text-base font-bold tracking-tight">Controles do cartão</div>
              <div className="mt-0.5 font-mono text-[9px] text-ds-mute">
                gerencie segurança e limites
              </div>
            </div>
          </div>

          {[
            {
              icon: <Globe className="size-[14px]" />,
              title: "Compras online",
              subtitle: isOnlineActive ? "ativo" : "inativo",
              subtitleColor: isOnlineActive ? "text-ds-green" : undefined,
              trailing: <Toggle checked={isOnlineActive} onChange={setOnline} />,
            },
            {
              icon: <Pause className="size-[14px]" />,
              title: "Bloqueio temporário",
              subtitle: isFrozen ? "congelado" : "cartão ativo",
              subtitleColor: isFrozen ? "text-ds-red" : "text-ds-green",
              trailing: <Toggle checked={isFrozen} onChange={setFrozen} />,
            },
            {
              icon: <Navigation className="size-[14px]" />,
              title: "Compras internacionais",
              subtitle: isInternationalActive ? "ativo" : "inativo",
              subtitleColor: isInternationalActive ? "text-ds-green" : undefined,
              trailing: <Toggle checked={isInternationalActive} onChange={setInternational} />,
            },
            {
              icon: <Sliders className="size-[14px]" />,
              title: "Limite por compra",
              subtitle: "R$ 2.000,00",
              trailing: <ChevronRight className="size-4 text-ds-mute" />,
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className={cn(
                "flex items-center gap-3 py-[14px]",
                i > 0 && "border-t border-ds-line"
              )}
            >
              <div className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] border border-ds-line bg-ds-bg-2 text-ds-dim">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold">{item.title}</div>
                <div className={cn("text-xs text-ds-mute", item.subtitleColor)}>
                  {item.subtitle}
                </div>
              </div>
              {item.trailing}
            </div>
          ))}
        </div>
      </div>

      {/* COL LATERAL */}
      <div className="flex flex-col gap-[18px]">
        {/* DADOS DO CARTÃO */}
        <SoftCard>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-base font-bold tracking-tight">Dados do cartão</div>
            <button
              type="button"
              onClick={() => setIsRevealed(!isRevealed)}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-ds-dim transition-colors hover:text-ds-ink"
            >
              {isRevealed ? (
                <>
                  <EyeOff className="size-3.5" />
                  Ocultar
                </>
              ) : (
                <>
                  <Eye className="size-3.5" />
                  Mostrar
                </>
              )}
            </button>
          </div>

          {[
            { label: "Número", value: isRevealed ? cardNumber : "•••• •••• •••• " + last4 },
            { label: "Validade", value: isRevealed ? expiry : "••/••" },
            { label: "CVV", value: isRevealed ? cvv : "•••" },
            { label: "Portador", value: "KAUA MIGUEL" },
          ].map((item, i) => (
            <div
              key={item.label}
              className={cn("py-3", i > 0 && "border-t border-ds-line")}
            >
              <div className="font-mono text-[8px] uppercase tracking-[0.05em] text-ds-mute">
                {item.label}
              </div>
              <div className="mt-[5px] font-mono text-[13px] font-semibold">
                {item.value}
              </div>
            </div>
          ))}
        </SoftCard>

        {/* ÚLTIMAS COMPRAS */}
        <SoftCard>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-base font-bold tracking-tight">Últimas compras</div>
            <span className="font-mono text-[9px] text-ds-mute">
              ver tudo <span className="text-ds-orange">&rarr;</span>
            </span>
          </div>

          {transactions.length === 0 && (
            <p className="py-3 text-xs text-ds-dim">Nenhuma transação ainda.</p>
          )}

          {transactions.slice(0, 5).map((tx, i) => (
            <div
              key={tx.id}
              className={cn(
                "flex items-center gap-[11px] py-3",
                i > 0 && "border-t border-ds-line"
              )}
            >
              <div className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] border border-ds-line bg-ds-bg-2 font-mono text-[11px] font-semibold text-ds-dim">
                {tx.initials || tx.title.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold">{tx.title}</div>
                <div className="mt-px font-mono text-[8px] text-ds-mute">
                  {fmtTxDate(tx.created_at)}
                </div>
              </div>
              <div className={cn("text-[13px] font-semibold", tx.is_credit ? "text-ds-green" : "text-ds-ink")}>
                {tx.is_credit ? "+" : "-"} {formatBRL(tx.amount_brl)}
              </div>
            </div>
          ))}
        </SoftCard>
      </div>
    </div>
  )
}
