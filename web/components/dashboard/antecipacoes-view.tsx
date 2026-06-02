"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, Calendar, Check, Loader2, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatBRL } from "@/lib/db/client"
import { getAccount } from "@/lib/db/accounts"
import { listReceivables, advanceReceivables } from "@/lib/db/receivables"
import type { Receivable } from "@/lib/db/types"

const ADVANCE_RATE = "3% a.m."

interface AdvanceReceipt {
  count: number
  gross: string
  net: string
  rate: string
  date: string
  protocol: string
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function AntecipacoesView() {
  const [receivables, setReceivables] = useState<Receivable[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [confirming, setConfirming] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [receipt, setReceipt] = useState<AdvanceReceipt | null>(null)
  const [availableBalance, setAvailableBalance] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [advanceTransactions, setAdvanceTransactions] = useState<
    { id: string; protocol: string; amount: number; date: string }[]
  >([])

  useEffect(() => {
    let active = true
    Promise.all([listReceivables(), getAccount("PJ")])
      .then(([recs, acc]) => {
        if (!active) return
        setReceivables(recs)
        setAvailableBalance(acc.balance_brl)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const pending = useMemo(
    () => receivables.filter((r) => r.status === "pendente"),
    [receivables],
  )

  const summary = useMemo(() => {
    const items = pending.filter((r) => selected.has(r.id))
    const gross = items.reduce((sum, r) => sum + r.gross_value, 0)
    const net = items.reduce((sum, r) => sum + r.net_value, 0)
    return { count: items.length, gross, net }
  }, [pending, selected])

  const totalGross = pending.reduce((sum, r) => sum + r.gross_value, 0)
  const totalNet = pending.reduce((sum, r) => sum + r.net_value, 0)

  const allSelected = selected.size === pending.length && pending.length > 0

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(pending.map((r) => r.id)))
  }

  const handleConfirm = async () => {
    setProcessing(true)
    setError(null)
    const advancedIds = Array.from(selected)
    const capturedSummary = { ...summary }

    try {
      const result = await advanceReceivables(advancedIds)
      const protocol = `ANT-${result.net.toFixed(0)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      const date = new Date().toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      })

      setReceivables((prev) =>
        prev.map((r) =>
          advancedIds.includes(r.id) ? { ...r, status: "antecipado" as const } : r,
        ),
      )
      setAvailableBalance(result.balance)
      setAdvanceTransactions((prev) => [
        { id: protocol, protocol, amount: result.net, date },
        ...prev,
      ])
      setReceipt({
        count: capturedSummary.count,
        gross: formatBRL(capturedSummary.gross),
        net: formatBRL(result.net),
        rate: ADVANCE_RATE,
        date,
        protocol,
      })
      setSelected(new Set())
      setConfirming(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível antecipar.")
    } finally {
      setProcessing(false)
    }
  }

  if (receipt) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-ds-green/15">
              <Check className="size-8 text-ds-green" />
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight">Antecipação realizada</h1>
            <p className="mt-1 text-sm text-ds-dim">
              O valor líquido será creditado na sua conta em instantes.
            </p>
          </div>

          <div className="mt-6 rounded-[16px] border border-ds-line bg-ds-bg-2 p-6">
            <div className="space-y-3">
              <RecRow label="Protocolo" value={receipt.protocol} mono />
              <RecRow label="Recebíveis" value={String(receipt.count)} />
              <RecRow label="Total bruto" value={receipt.gross} mono />
              <RecRow label="Taxa" value={receipt.rate} valueClass="text-ds-orange" />
              <div className="flex justify-between border-t border-ds-line pt-3">
                <span className="text-sm text-ds-mute">Líquido creditado</span>
                <span className="font-mono text-lg font-bold text-ds-green">{receipt.net}</span>
              </div>
              <RecRow label="Data" value={receipt.date} />
            </div>
          </div>

          <Button
            onClick={() => setReceipt(null)}
            variant="outline"
            className="mt-6 w-full border-ds-line"
          >
            <ArrowLeft className="mr-2 size-4" />
            Voltar para recebíveis
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 px-6 py-6">
      <div className="grid grid-cols-[1fr_320px] gap-4">
      {/* Hero summary */}
      <div className="rounded-[16px] border border-ds-line bg-ds-bg-2 p-6">
        <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-ds-mute">
          Total disponível para antecipar
        </div>
        <div className="mt-2 text-3xl font-bold tracking-tight">{formatBRL(totalGross)}</div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-ds-mute">
              Líquido estimado
            </div>
            <div className="mt-1 font-mono text-sm font-semibold text-ds-green">
              {formatBRL(totalNet)}
            </div>
          </div>
          <div className="border-l border-ds-line pl-4">
            <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-ds-mute">Taxa</div>
            <div className="mt-1 font-mono text-sm font-semibold text-ds-orange">{ADVANCE_RATE}</div>
          </div>
        </div>
      </div>

      <div className="rounded-[16px] border border-ds-line bg-ds-bg-2 p-6">
        <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-ds-mute">
          Saldo disponível
        </div>
        <div className="mt-2 font-mono text-2xl font-bold text-ds-ink">
          {formatBRL(availableBalance)}
        </div>
        <div className="mt-4 border-t border-ds-line pt-3">
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-ds-mute">
            Histórico de antecipações
          </div>
          {advanceTransactions.length === 0 ? (
            <p className="mt-2 text-xs text-ds-dim">Nenhum crédito nesta sessão.</p>
          ) : (
            <div className="mt-2 space-y-2">
              {advanceTransactions.slice(0, 3).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-mono text-[10px] text-ds-ink">
                      {tx.protocol}
                    </div>
                    <div className="text-[10px] text-ds-mute">{tx.date}</div>
                  </div>
                  <div className="font-mono text-xs font-bold text-ds-green">
                    +{formatBRL(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>

      {/* List */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Recebíveis pendentes</h2>
        {pending.length > 0 && (
          <button
            onClick={selectAll}
            className="text-xs font-semibold text-ds-orange hover:underline"
          >
            {allSelected ? "Desmarcar todos" : "Selecionar todos"}
          </button>
        )}
      </div>

      {pending.length === 0 ? (
        <div className="rounded-[16px] border border-ds-line bg-ds-bg-2 p-12 text-center">
          <p className="text-sm text-ds-dim">Nenhum recebível pendente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {pending.map((item) => {
            const isSel = selected.has(item.id)
            return (
              <button
                key={item.id}
                onClick={() => toggleSelect(item.id)}
                className={cn(
                  "flex flex-col gap-3 rounded-[14px] border bg-ds-bg-2 p-4 text-left transition-colors",
                  isSel ? "border-ds-orange" : "border-ds-line hover:border-ds-line-2",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-[6px] border",
                      isSel
                        ? "border-ds-orange bg-ds-orange text-white"
                        : "border-ds-mute",
                    )}
                  >
                    {isSel && <Check className="size-3" />}
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold">{formatBRL(item.gross_value)}</div>
                    <div className="font-mono text-[10px] text-ds-mute">
                      liq. {formatBRL(item.net_value)}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="truncate text-sm font-medium">{item.description}</div>
                  <div className="font-mono text-[10px] text-ds-mute">{item.installments}</div>
                </div>
                <div className="flex items-center gap-1.5 border-t border-ds-line pt-2.5 font-mono text-[10px] text-ds-mute">
                  <Calendar className="size-3" />
                  Vence em {fmtDate(item.due_date)}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Selection summary + CTA */}
      {selected.size > 0 && (
        <div className="sticky bottom-6 mt-4 rounded-[16px] border border-ds-line bg-ds-bg-2 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-ds-dim">
                {summary.count} {summary.count === 1 ? "recebível" : "recebíveis"} selecionado
                {summary.count === 1 ? "" : "s"}
              </div>
              <div className="mt-0.5 font-mono text-base font-bold">
                Líquido <span className="text-ds-green">{formatBRL(summary.net)}</span>
              </div>
            </div>
            <Button
              onClick={() => setConfirming(true)}
              className="bg-ds-orange hover:bg-ds-orange/90"
            >
              <Zap className="mr-2 size-4" />
              Antecipar {summary.count}
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-[20px] border border-ds-line bg-ds-bg p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-ds-orange/12">
                <Zap className="size-7 text-ds-orange" />
              </div>
              <h2 className="mt-3 text-lg font-bold">Confirmar antecipação</h2>
              <p className="mt-1 text-xs text-ds-dim">
                Você está antecipando {summary.count}{" "}
                {summary.count === 1 ? "recebível" : "recebíveis"}.
              </p>
            </div>

            <div className="mt-5 rounded-[12px] border border-ds-line bg-ds-bg-2 p-4">
              <RecRow label="Recebíveis" value={String(summary.count)} />
              <Divider />
              <RecRow label="Total bruto" value={formatBRL(summary.gross)} mono />
              <Divider />
              <RecRow label="Taxa" value={ADVANCE_RATE} valueClass="text-ds-orange" />
              <Divider />
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-ds-mute">Líquido a receber</span>
                <span className="font-mono text-base font-bold text-ds-green">
                  {formatBRL(summary.net)}
                </span>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-ds-red/20 bg-ds-red/5 px-4 py-3 text-[12px] font-medium text-ds-red">
                {error}
              </div>
            )}

            {processing ? (
              <div className="mt-5 flex flex-col items-center gap-2 py-3">
                <Loader2 className="size-5 animate-spin text-ds-orange" />
                <p className="text-xs text-ds-mute">Processando antecipação...</p>
              </div>
            ) : (
              <div className="mt-5 flex flex-col gap-2">
                <Button
                  onClick={handleConfirm}
                  className="h-11 bg-ds-orange hover:bg-ds-orange/90"
                >
                  <Check className="mr-2 size-4" />
                  Confirmar antecipação
                </Button>
                <Button
                  onClick={() => setConfirming(false)}
                  variant="outline"
                  className="h-11 border-ds-line"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function RecRow({
  label,
  value,
  mono,
  valueClass,
}: {
  label: string
  value: string
  mono?: boolean
  valueClass?: string
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-ds-mute">{label}</span>
      <span
        className={cn(
          "text-sm font-semibold text-ds-ink",
          mono && "font-mono",
          valueClass,
        )}
      >
        {value}
      </span>
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-ds-line" />
}
