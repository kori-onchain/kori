/* Dados mockados compartilhados (portados do mobile) */

export interface Contact {
  id: string
  name: string | null
  walletId: string
  initials: string
  isFavorite: boolean
}

export const MOCK_CONTACTS: Contact[] = [
  { id: "1", name: "Maria Oliveira", initials: "MO", walletId: "@mari_o", isFavorite: true },
  { id: "2", name: "Lucas Silva", initials: "LS", walletId: "@lucas_s", isFavorite: false },
  { id: "3", name: "Rafael Rocha", initials: "RR", walletId: "@rafa_r", isFavorite: true },
  { id: "4", name: null, walletId: "@anon-843", initials: "A8", isFavorite: false },
  { id: "5", name: "Beatriz Costa", initials: "BC", walletId: "@bia_c", isFavorite: false },
  { id: "6", name: "Gabriela Lima", initials: "GL", walletId: "@gabi_l", isFavorite: true },
  { id: "7", name: "Thiago Martins", initials: "TM", walletId: "@thiago_m", isFavorite: false },
  { id: "8", name: "Aline Fonseca", initials: "AF", walletId: "@aline_f", isFavorite: false },
]

export interface Transaction {
  id: string
  title: string
  subtitle: string
  amount: string
  isCredit: boolean
  initials?: string
  isAnonymous?: boolean
  date: string
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "1", title: "Lucas Silva", subtitle: "@lucas_s", amount: "R$ 143,82", isCredit: false, initials: "LS", date: "Hoje, 14:30" },
  { id: "2", title: "Câmbio BRL → USD", subtitle: "Conversão de saldo", amount: "R$ 2.450,80", isCredit: false, date: "Hoje, 12:08" },
  { id: "3", title: "Anônimo", subtitle: "0x7a8b...291f", amount: "R$ 389,45", isCredit: true, isAnonymous: true, date: "Ontem, 16:15" },
  { id: "4", title: "Maria Oliveira", subtitle: "@mari_o", amount: "R$ 88,20", isCredit: true, initials: "MO", date: "Ontem, 09:15" },
  { id: "5", title: "Rafael Rocha", subtitle: "@rafa_r", amount: "R$ 250,00", isCredit: false, initials: "RR", date: "22/05" },
  { id: "6", title: "Recebimento de yield", subtitle: "Pool USDC", amount: "R$ 12,84", isCredit: true, date: "21/05" },
]

export interface Receivable {
  id: string
  description: string
  dueDate: string
  grossAmount: string
  grossValue: number
  netAmount: string
  netValue: number
  installments: string
  status: "pendente" | "antecipado"
}

export const MOCK_RECEIVABLES: Receivable[] = [
  {
    id: "1",
    description: "Venda #3821 — Tênis Air Pro",
    dueDate: "02 jun 2026",
    grossAmount: "R$ 1.200,00",
    grossValue: 1200,
    netAmount: "R$ 1.164,00",
    netValue: 1164,
    installments: "3x de R$ 400,00",
    status: "pendente",
  },
  {
    id: "2",
    description: "Venda #3822 — Camiseta Premium",
    dueDate: "08 jun 2026",
    grossAmount: "R$ 480,00",
    grossValue: 480,
    netAmount: "R$ 465,60",
    netValue: 465.6,
    installments: "2x de R$ 240,00",
    status: "pendente",
  },
  {
    id: "3",
    description: "Venda #3819 — Kit Skincare",
    dueDate: "15 jun 2026",
    grossAmount: "R$ 890,00",
    grossValue: 890,
    netAmount: "R$ 863,30",
    netValue: 863.3,
    installments: "4x de R$ 222,50",
    status: "pendente",
  },
  {
    id: "4",
    description: "Venda #3815 — Fone Bluetooth",
    dueDate: "22 jun 2026",
    grossAmount: "R$ 350,00",
    grossValue: 350,
    netAmount: "R$ 339,50",
    netValue: 339.5,
    installments: "1x de R$ 350,00",
    status: "pendente",
  },
  {
    id: "5",
    description: "Venda #3808 — Mochila Urban",
    dueDate: "30 jun 2026",
    grossAmount: "R$ 620,00",
    grossValue: 620,
    netAmount: "R$ 601,40",
    netValue: 601.4,
    installments: "2x de R$ 310,00",
    status: "pendente",
  },
]

export const formatBRL = (value: number): string =>
  `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
