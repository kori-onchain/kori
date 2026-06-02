export type AccountType = "PF" | "PJ"

export type Account = {
  balance_brl: number
  fund_brl: number
}

export type TxKind =
  | "transfer"
  | "yield"
  | "exchange"
  | "advance"
  | "sale"
  | "deposit"
  | "card"

export type Transaction = {
  id: string
  title: string
  subtitle: string | null
  amount_brl: number
  is_credit: boolean
  initials: string | null
  is_anonymous: boolean
  kind: TxKind
  created_at: string
}

export type Contact = {
  id: string
  name: string | null
  wallet_id: string
  initials: string | null
  is_favorite: boolean
}

export type Receivable = {
  id: string
  description: string
  due_date: string | null
  gross_value: number
  net_value: number
  installments: string | null
  status: "pendente" | "antecipado"
}

export type Position = {
  id: string
  merchant_name: string
  hash: string | null
  invested_brl: number
  earned_brl: number
  apr: number
  liquidates_in_days: number
  status: "active" | "pending"
}

export type Opportunity = {
  id: string
  merchant_name: string
  hash: string | null
  receivable_brl: number
  apr: number
  risk: string
  fill_pct: number
}

export type Product = {
  id: string
  brand: string | null
  name: string
  price: number
  old_price: number | null
  discount: string | null
  category: string
}

export type Sale = {
  id: string
  customer_name: string
  initials: string | null
  items: number
  amount_brl: number
  method: string
  created_at: string
}

export type Card = {
  number: string
  expiry: string
  cvv: string
  is_frozen: boolean
  online_enabled: boolean
  international_enabled: boolean
  limit_brl: number
  invoice_brl: number
}
