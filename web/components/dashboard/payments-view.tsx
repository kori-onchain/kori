"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, ArrowRight, Check, Copy, Search, Send, Star, User, Zap } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { MOCK_CONTACTS, MOCK_TRANSACTIONS, type Contact, formatBRL } from "@/lib/mock-data"
import { getBalance, getTransactions, transferToRecipient } from "@/lib/transfer-ledger"
import { getOrCreateWallet, shortWallet } from "@/lib/wallet"

type Step = "recipient" | "amount" | "review" | "receipt"

const PRESETS = [25, 50, 100, 1000]

export function PaymentsView() {
  const [step, setStep] = useState<Step>("recipient")
  const [search, setSearch] = useState("")
  const [recipient, setRecipient] = useState<Contact | null>(null)
  const [amount, setAmount] = useState("")
  const [protocol] = useState(() => `KORI-${Math.random().toString(36).substring(2, 10).toUpperCase()}`)
  const [copied, setCopied] = useState(false)
  const [wallet, setWallet] = useState("")
  const [accountId, setAccountId] = useState("")
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS)
  const [transferError, setTransferError] = useState<string | null>(null)
  const receivePayload = `kori://pay?to=${encodeURIComponent(wallet)}`

  useEffect(() => {
    let active = true

    async function loadAccount() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!active || !user) return

      const pubkey = getOrCreateWallet(user.id)
      setAccountId(user.id)
      setWallet(pubkey)
      setBalance(getBalance(user.id))
      setTransactions(getTransactions(user.id))
      await supabase.from("profiles").update({ wallet_pubkey: pubkey }).eq("id", user.id)
    }

    loadAccount()

    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return MOCK_CONTACTS
    const q = search.toLowerCase()
    return MOCK_CONTACTS.filter(
      (c) => c.name?.toLowerCase().includes(q) || c.walletId.toLowerCase().includes(q),
    )
  }, [search])

  const amountValue = Number(amount.replace(/\D/g, "")) / 100

  const handleCopy = () => {
    if (!wallet) return
    navigator.clipboard.writeText(wallet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectManualRecipient = () => {
    const value = search.trim()
    if (!value) return

    setRecipient({
      id: `manual-${value}`,
      name: null,
      initials: value.slice(0, 2).toUpperCase(),
      walletId: value,
      isFavorite: false,
    })
    setTransferError(null)
    setStep("amount")
  }

  const confirmTransfer = () => {
    if (!recipient) return

    try {
      const result = transferToRecipient({
        amount: amountValue,
        recipientName: recipient.name || recipient.walletId,
        recipientWallet: recipient.walletId,
        initials: recipient.initials,
        accountId,
      })
      setBalance(result.balance)
      setTransactions(result.transactions)
      setTransferError(null)
      setStep("receipt")
    } catch (err) {
      setTransferError(err instanceof Error ? err.message : "Não foi possível enviar.")
    }
  }

  const resetFlow = () => {
    setStep("recipient")
    setRecipient(null)
    setAmount("")
    setSearch("")
    setTransferError(null)
  }

  return (
    <div className="grid min-h-0 flex-1 grid-cols-[1fr_320px]">
      {/* Left — Wizard */}
      <div className="flex flex-col px-6 py-6">
        {/* Step indicator */}
        <div className="mb-6 flex items-center gap-2">
          {(["recipient", "amount", "review", "receipt"] as Step[]).map((s, i) => {
            const reached =
              ["recipient", "amount", "review", "receipt"].indexOf(step) >= i
            return (
              <div key={s} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    "size-7 shrink-0 rounded-full flex items-center justify-center text-[11px] font-mono border transition-colors",
                    reached
                      ? "bg-ds-orange/15 border-ds-orange text-ds-orange"
                      : "border-ds-line text-ds-mute",
                  )}
                >
                  {i + 1}
                </div>
                {i < 3 && (
                  <div
                    className={cn(
                      "h-px flex-1 transition-colors",
                      reached ? "bg-ds-orange/40" : "bg-ds-line",
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        {step === "recipient" && (
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Para quem você quer enviar?</h1>
              <p className="mt-1 text-sm text-ds-dim">
                Saldo disponível: <span className="font-mono text-ds-ink">{formatBRL(balance)}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-[12px] border border-ds-line bg-ds-bg-2 px-3.5 py-3">
              <Search className="size-4 text-ds-mute" />
              <Input
                placeholder="Buscar @username ou endereço da wallet"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-auto flex-1 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
              />
            </div>

            {search.trim() && (
              <Button onClick={selectManualRecipient} variant="outline" className="h-11 border-ds-line">
                Usar {search.trim()} como destinatário
                <ArrowRight className="ml-2 size-4" />
              </Button>
            )}

            <div className="mt-2">
              <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.15em] text-ds-mute">
                Contatos
              </div>
              <div className="flex flex-col divide-y divide-ds-line rounded-[14px] border border-ds-line bg-ds-bg-2">
                {filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setRecipient(c)
                      setStep("amount")
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-ds-elev"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-ds-line bg-ds-elev font-mono text-xs text-ds-ink">
                      {!c.name ? <User className="size-4 text-ds-mute" /> : c.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-ds-ink">
                        {c.name || "Anônimo"}
                      </div>
                      <div className="font-mono text-[10px] text-ds-mute">{c.walletId}</div>
                    </div>
                    {c.isFavorite && <Star className="size-4 fill-ds-orange text-ds-orange" />}
                    <ArrowRight className="size-4 text-ds-mute" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === "amount" && recipient && (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setStep("recipient")}
              className="flex items-center gap-2 self-start text-sm text-ds-mute hover:text-ds-dim"
            >
              <ArrowLeft className="size-4" /> Voltar
            </button>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">Qual valor?</h1>
              <p className="mt-1 text-sm text-ds-dim">
                Enviando para{" "}
                <span className="font-mono text-ds-ink">{recipient.walletId}</span>
              </p>
            </div>

            <div className="rounded-[16px] border border-ds-line bg-ds-bg-2 p-8">
              <div className="text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ds-mute">
                  Valor a enviar
                </div>
                <div className="mt-3 text-5xl font-bold tracking-tight text-ds-ink">
                  {formatBRL(amountValue)}
                </div>
                <div className="mt-2 font-mono text-[10px] text-ds-mute">
                  Disponível {formatBRL(balance)}
                </div>
              </div>

              <Input
                type="number"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="mt-6 h-12 border-ds-line bg-ds-bg text-center text-lg"
              />

              <div className="mt-4 flex gap-2">
                {PRESETS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmount(String(v * 100))}
                    className="flex-1 rounded-full border border-ds-line py-2 text-xs font-semibold text-ds-dim transition-colors hover:border-ds-orange hover:text-ds-orange"
                  >
                    R$ {v}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep("review")}
              disabled={amountValue <= 0 || amountValue > balance}
              className="h-12 bg-ds-orange hover:bg-ds-orange/90 disabled:opacity-50"
            >
              {amountValue > balance ? "Saldo insuficiente" : "Continuar"}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        )}

        {step === "review" && recipient && (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setStep("amount")}
              className="flex items-center gap-2 self-start text-sm text-ds-mute hover:text-ds-dim"
            >
              <ArrowLeft className="size-4" /> Voltar
            </button>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">Revisar transferência</h1>
              <p className="mt-1 text-sm text-ds-dim">Confira os detalhes antes de confirmar.</p>
            </div>

            <div className="rounded-[16px] border border-ds-line bg-ds-bg-2 p-6">
              <div className="flex items-center gap-3 border-b border-ds-line pb-4">
                <div className="flex size-12 items-center justify-center rounded-full border border-ds-line bg-ds-elev font-mono text-sm">
                  {recipient.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold">{recipient.name || "Anônimo"}</div>
                  <div className="font-mono text-[10px] text-ds-mute">{recipient.walletId}</div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-ds-mute">Valor</span>
                  <span className="font-mono text-sm font-semibold text-ds-ink">{formatBRL(amountValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-ds-mute">Taxa de rede</span>
                  <span className="font-mono text-sm text-ds-dim">R$ 0,00</span>
                </div>
                <div className="flex justify-between border-t border-ds-line pt-3">
                  <span className="text-sm font-semibold text-ds-ink">Total</span>
                  <span className="font-mono text-sm font-bold text-ds-ink">{formatBRL(amountValue)}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={confirmTransfer}
              className="h-12 bg-ds-orange hover:bg-ds-orange/90"
            >
              <Zap className="mr-2 size-4" />
              Confirmar e enviar
            </Button>
            {transferError && (
              <div className="rounded-xl border border-ds-red/20 bg-ds-red/5 px-4 py-3 text-[12px] font-medium text-ds-red">
                {transferError}
              </div>
            )}
          </div>
        )}

        {step === "receipt" && recipient && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-ds-green/15">
                <Check className="size-8 text-ds-green" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Pagamento enviado</h1>
                <p className="mt-1 text-sm text-ds-dim">
                  {formatBRL(amountValue)} para {recipient.name || recipient.walletId}
                </p>
              </div>
            </div>

            <div className="rounded-[16px] border border-ds-line bg-ds-bg-2 p-6">
              <div className="space-y-3">
                <div className="flex justify-between border-b border-ds-line pb-3">
                  <span className="text-sm text-ds-mute">Protocolo</span>
                  <span className="font-mono text-xs text-ds-ink">{protocol}</span>
                </div>
                <div className="flex justify-between border-b border-ds-line pb-3">
                  <span className="text-sm text-ds-mute">Destinatário</span>
                  <span className="font-mono text-sm text-ds-ink">{recipient.walletId}</span>
                </div>
                <div className="flex justify-between border-b border-ds-line pb-3">
                  <span className="text-sm text-ds-mute">Valor</span>
                  <span className="font-mono text-sm font-semibold text-ds-ink">{formatBRL(amountValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-ds-mute">Data</span>
                  <span className="text-sm text-ds-ink">
                    {new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                </div>
              </div>
            </div>

            <Button onClick={resetFlow} variant="outline" className="h-12 border-ds-line">
              Fazer outro pagamento
            </Button>
          </div>
        )}
      </div>

      {/* Right sidebar — Receive */}
      <aside className="border-l border-ds-line bg-ds-bg-2/40 px-5 py-6">
        <div className="rounded-[16px] border border-ds-line bg-ds-bg p-5">
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-ds-mute">Receber</div>
          <div className="mt-2 text-sm font-semibold">Sua wallet Kori</div>

          <div className="mt-4 flex aspect-square items-center justify-center rounded-[12px] border border-ds-line bg-white p-4">
            <QRCodeSVG
              value={receivePayload}
              size={208}
              bgColor="#ffffff"
              fgColor="#0a0a0a"
              level="M"
              className="size-full"
            />
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-[10px] border border-ds-line bg-ds-bg-2 px-3 py-2.5">
            <span className="flex-1 truncate font-mono text-[11px] text-ds-dim">{wallet || "Carregando wallet..."}</span>
            <button
              onClick={handleCopy}
              className="text-ds-mute transition-colors hover:text-ds-ink"
              aria-label="Copiar endereço"
            >
              {copied ? <Check className="size-3.5 text-ds-green" /> : <Copy className="size-3.5" />}
            </button>
          </div>

          <Button variant="outline" className="mt-4 w-full border-ds-line">
            <Send className="mr-2 size-3.5" />
            {wallet ? shortWallet(wallet) : "Compartilhar"}
          </Button>
        </div>

        <div className="mt-6">
          <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.15em] text-ds-mute">
            Pagamentos recentes
          </div>
          <div className="space-y-2">
            {transactions.slice(0, 4).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-2.5 rounded-[10px] border border-ds-line bg-ds-bg p-2.5"
              >
                <div className="flex size-8 items-center justify-center rounded-full border border-ds-line bg-ds-elev font-mono text-[10px]">
                  {tx.initials || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] font-semibold">{tx.title}</div>
                  <div className="font-mono text-[9px] text-ds-mute">{tx.date}</div>
                </div>
                <div
                  className={cn(
                    "font-mono text-[10px] font-semibold",
                    tx.isCredit ? "text-ds-green" : "text-ds-ink",
                  )}
                >
                  {tx.isCredit ? "+" : "-"} {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}
