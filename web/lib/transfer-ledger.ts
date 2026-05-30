import { MOCK_TRANSACTIONS, formatBRL, type Transaction } from "@/lib/mock-data"

const BALANCE_KEY = "kori_balance_brl"
const TX_KEY = "kori_transactions"
const INITIAL_BALANCE = 412.8

function storageKey(baseKey: string, accountId?: string): string {
  return accountId ? `${baseKey}:${accountId}` : baseKey
}

export function getBalance(accountId?: string): number {
  const raw = localStorage.getItem(storageKey(BALANCE_KEY, accountId))
  if (!raw) return INITIAL_BALANCE
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : INITIAL_BALANCE
}

export function setBalance(value: number, accountId?: string) {
  localStorage.setItem(storageKey(BALANCE_KEY, accountId), String(Math.max(0, value)))
}

export function getTransactions(accountId?: string): Transaction[] {
  const raw = localStorage.getItem(storageKey(TX_KEY, accountId))
  if (!raw) return MOCK_TRANSACTIONS

  try {
    const parsed = JSON.parse(raw) as Transaction[]
    return Array.isArray(parsed) ? parsed : MOCK_TRANSACTIONS
  } catch {
    return MOCK_TRANSACTIONS
  }
}

export function transferToRecipient({
  amount,
  recipientName,
  recipientWallet,
  initials,
  accountId,
}: {
  amount: number
  recipientName: string
  recipientWallet: string
  initials?: string
  accountId?: string
}) {
  const currentBalance = getBalance(accountId)
  if (amount <= 0) throw new Error("Informe um valor maior que zero.")
  if (amount > currentBalance) throw new Error("Saldo disponível insuficiente.")

  const nextBalance = currentBalance - amount
  const tx: Transaction = {
    id: crypto.randomUUID(),
    title: recipientName || recipientWallet,
    subtitle: recipientWallet,
    amount: formatBRL(amount),
    isCredit: false,
    initials,
    date: new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }

  const nextTransactions = [tx, ...getTransactions(accountId)]
  setBalance(nextBalance, accountId)
  localStorage.setItem(storageKey(TX_KEY, accountId), JSON.stringify(nextTransactions))

  return { balance: nextBalance, transaction: tx, transactions: nextTransactions }
}
