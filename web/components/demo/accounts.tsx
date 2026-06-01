import type { ReactNode } from "react"

import { IC } from "./icons"
import { InvestidorDashboard } from "./screens/investidor-dashboard"
import { InvestidorMarket } from "./screens/investidor-market"
import { InvestidorPortfolio } from "./screens/investidor-portfolio"
import { PessoaCard } from "./screens/pessoa-card"
import { PessoaPayments } from "./screens/pessoa-payments"
import { PessoaPerks } from "./screens/pessoa-perks"
import { LojaPainel } from "./screens/loja-painel"
import { LojaRecebiveis } from "./screens/loja-recebiveis"
import { LojaVitrine } from "./screens/loja-vitrine"

export interface DemoAccount {
  id: "investidor" | "pessoa" | "loja"
  label: string
  initials: string
  avTxt: string
  who: string
  hi: string
  pj?: string
  /** [label, iconKey] — exatamente 4 abas */
  tabs: [string, string][]
}

export const ACCOUNTS: DemoAccount[] = [
  {
    id: "investidor",
    label: "Investidor",
    initials: "KM",
    avTxt: "#0a0a0b",
    who: "Kauã Miguel",
    hi: "Bom te ver,",
    tabs: [
      ["Início", "home"],
      ["Comércios", "grid"],
      ["Portfólio", "chart"],
      ["Perfil", "user"],
    ],
  },
  {
    id: "pessoa",
    label: "Pessoa",
    initials: "AR",
    avTxt: "#0a0a0b",
    who: "Ana Ribeiro",
    hi: "Bom te ver,",
    tabs: [
      ["Cartão", "card"],
      ["Pagar", "pix"],
      ["Perks", "trend"],
      ["Perfil", "user"],
    ],
  },
  {
    id: "loja",
    label: "Loja",
    initials: "LA",
    avTxt: "#0a0a0b",
    who: "Loja Aurora",
    hi: "Bom te ver,",
    pj: "PJ",
    tabs: [
      ["Painel", "home"],
      ["Recebíveis", "grid"],
      ["Vitrine", "card"],
      ["Perfil", "user"],
    ],
  },
]

export const ACC_BY_ID = Object.fromEntries(ACCOUNTS.map((a) => [a.id, a])) as Record<string, DemoAccount>

const SCREENS: Record<string, ReactNode[]> = {
  investidor: [<InvestidorDashboard key="d" />, <InvestidorMarket key="m" />, <InvestidorPortfolio key="p" />],
  pessoa: [<PessoaCard key="c" />, <PessoaPayments key="p" />, <PessoaPerks key="k" />],
  loja: [<LojaPainel key="d" />, <LojaRecebiveis key="r" />, <LojaVitrine key="v" />],
}

function ProfileBody({ a }: { a: DemoAccount }) {
  return (
    <>
      <div className="dm-profile">
        <div className="pa" style={{ background: "var(--ac)", color: a.avTxt }}>
          {a.initials}
        </div>
        <div className="pn">{a.who}</div>
        <div className="pp">Conta {a.label}</div>
      </div>
      {[
        ["user", "Dados da conta"],
        ["shield", "Segurança"],
        ["gear", "Preferências"],
        ["card", "Plano e cobrança"],
      ].map(([ico, label], i) => (
        <div className="dm-setrow" key={label} style={i === 0 ? { marginTop: 14 } : undefined}>
          <div className="si">{IC[ico]}</div>
          <div className="sl">{label}</div>
          <div className="sc">{IC.chev}</div>
        </div>
      ))}
    </>
  )
}

export function Screen({ id, tab }: { id: string; tab: number }): ReactNode {
  if (tab === 3) return <ProfileBody a={ACC_BY_ID[id]} />
  return SCREENS[id]?.[tab] ?? null
}
