import type { ComponentType } from "react"
import type { LucideIcon } from "lucide-react"
import { Store, TrendingUp, User } from "lucide-react"

import {
  ScreenCardVirtual,
  ScreenHeroHome,
  ScreenHome,
  ScreenInvestmentConfirm,
  ScreenInvestmentPortfolio,
  ScreenInvestmentStatus,
  ScreenScore,
  ScreenTicket,
  ScreenYield,
  ScreenYieldMarketplace,
} from "@/components/landing/phone-screens"
import {
  ScreenLojaAntecipar,
  ScreenLojaConfirm,
  ScreenLojaHome,
  ScreenLojaVendas,
} from "@/components/demo/loja-screens"
import type { DemoNavItem } from "@/components/demo/demo-nav"
import type { PushToast } from "@/components/demo/phone-notifications"

type ScreenComponent = ComponentType<{ active?: boolean }>

/* ScreenCardVirtual e ScreenTicket renderizam .scr-cardview (sem prop active).
   Envolvemos num .screen p/ entrar no sistema de cross-fade sem editar o original. */
const ScreenCardTab: ScreenComponent = ({ active }) => (
  <div className={`screen${active ? " active" : ""}`}>
    <ScreenCardVirtual />
  </div>
)
const ScreenTicketTab: ScreenComponent = ({ active }) => (
  <div className={`screen${active ? " active" : ""}`}>
    <ScreenTicket />
  </div>
)

export interface PersonaScreen {
  tab: string
  Component: ScreenComponent
}

export interface Persona {
  id: "investidor" | "pessoa" | "loja"
  label: string
  caption: string
  /** cor de identidade (token do DS) usada no ícone e no glow do palco */
  accent: string
  /** ícone da persona (lucide) */
  Icon: LucideIcon
  defaultTab: string
  nav: DemoNavItem[]
  screens: PersonaScreen[]
  /** Notificações automáticas por timer. Retorna cleanup. */
  schedule?: (push: PushToast) => () => void
  /** Notificação disparada ao trocar de aba. */
  onTab?: (tab: string, push: PushToast) => void
}

export const PERSONAS: Persona[] = [
  {
    id: "investidor",
    label: "Investidor",
    caption: "Capital global → economia local",
    accent: "var(--orange)",
    Icon: TrendingUp,
    defaultTab: "home",
    nav: [
      { tab: "home", icon: "i-home", label: "home" },
      { tab: "yield", icon: "i-trend", label: "yield" },
      { tab: "invest", icon: "i-check", label: "investir" },
      { tab: "status", icon: "i-ticket", label: "operação" },
      { tab: "portfolio", icon: "i-user", label: "portfólio" },
    ],
    screens: [
      { tab: "home", Component: ScreenHeroHome },
      { tab: "yield", Component: ScreenYieldMarketplace },
      { tab: "invest", Component: ScreenInvestmentConfirm },
      { tab: "status", Component: ScreenInvestmentStatus },
      { tab: "portfolio", Component: ScreenInvestmentPortfolio },
    ],
    schedule: (push) => {
      const a = setTimeout(
        () =>
          push({
            icon: "i-trend",
            tone: "in",
            title: "Rendimento distribuído",
            body: "Padaria Central · +R$ 1,40",
          }),
        3200,
      )
      const b = setInterval(
        () =>
          push({
            icon: "i-arrow-l",
            tone: "in",
            title: "Nova oportunidade",
            body: "Mercado Verde · APR 13,8%",
          }),
        11000,
      )
      return () => {
        clearTimeout(a)
        clearInterval(b)
      }
    },
    onTab: (tab, push) => {
      if (tab === "invest")
        push({ icon: "i-check", tone: "in", title: "Aporte registrado", body: "R$ 50 on-chain · Solana" })
      if (tab === "portfolio")
        push({ icon: "i-trend", tone: "in", title: "Operação liquidada", body: "Recebido R$ 51,40 em USDC" })
    },
  },
  {
    id: "pessoa",
    label: "Pessoa",
    caption: "Cara de app comum, Web3 invisível",
    accent: "var(--orange)",
    Icon: User,
    defaultTab: "home",
    nav: [
      { tab: "home", icon: "i-home", label: "home" },
      { tab: "card", icon: "i-card", label: "cartão" },
      { tab: "score", icon: "i-trend", label: "score" },
      { tab: "tickets", icon: "i-ticket", label: "tickets" },
      { tab: "yield", icon: "i-search", label: "yield" },
    ],
    screens: [
      { tab: "home", Component: ScreenHome },
      { tab: "card", Component: ScreenCardTab },
      { tab: "score", Component: ScreenScore },
      { tab: "tickets", Component: ScreenTicketTab },
      { tab: "yield", Component: ScreenYield },
    ],
    schedule: (push) => {
      const a = setTimeout(
        () => push({ icon: "i-arrow-l", tone: "in", title: "Pix recebido", body: "+R$ 240 de @anaclara" }),
        2600,
      )
      const b = setInterval(
        () => push({ icon: "i-card", title: "Compra aprovada", body: "Padaria Central · −R$ 32,50" }),
        12000,
      )
      return () => {
        clearTimeout(a)
        clearInterval(b)
      }
    },
    onTab: (tab, push) => {
      if (tab === "score")
        push({ icon: "i-check", tone: "in", title: "Score atualizado", body: "847 · Tier IV Premium (+47)" })
      if (tab === "tickets")
        push({ icon: "i-ticket", title: "Ingresso válido", body: "Lollapalooza · QR rotativo ativo" })
    },
  },
  {
    id: "loja",
    label: "Loja",
    caption: "Recebíveis viram caixa na hora",
    accent: "var(--orange)",
    Icon: Store,
    defaultTab: "home",
    nav: [
      { tab: "home", icon: "i-home", label: "loja" },
      { tab: "antecipar", icon: "i-trend", label: "antecipar" },
      { tab: "confirm", icon: "i-check", label: "adiantar" },
      { tab: "vendas", icon: "i-card", label: "vendas" },
      { tab: "score", icon: "i-user", label: "score" },
    ],
    screens: [
      { tab: "home", Component: ScreenLojaHome },
      { tab: "antecipar", Component: ScreenLojaAntecipar },
      { tab: "confirm", Component: ScreenLojaConfirm },
      { tab: "vendas", Component: ScreenLojaVendas },
      { tab: "score", Component: ScreenScore },
    ],
    schedule: (push) => {
      const a = setTimeout(
        () => push({ icon: "i-arrow-l", tone: "in", title: "Nova venda", body: "Venda #3841 · +R$ 124 (Pix)" }),
        3600,
      )
      const b = setInterval(
        () => push({ icon: "i-card", tone: "in", title: "Venda no cartão", body: "Venda #3842 · +R$ 83,50 (2x)" }),
        10000,
      )
      return () => {
        clearTimeout(a)
        clearInterval(b)
      }
    },
    onTab: (tab, push) => {
      if (tab === "confirm")
        push({ icon: "i-check", tone: "in", title: "Adiantamento aprovado", body: "R$ 2.493 liberados em USDC" })
      if (tab === "antecipar")
        push({ icon: "i-trend", title: "3 recebíveis em aberto", body: "R$ 2.570 disponíveis pra antecipar" })
    },
  },
]
