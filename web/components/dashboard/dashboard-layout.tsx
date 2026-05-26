"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  Bell,
  CreditCard,
  Layers,
  LayoutGrid,
  LogOut,
  Search,
  Store,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { SolanaLogo } from "./shared"

/* ─── NAV ─── */

function NavItem({
  href,
  icon: Icon,
  label,
  badge: badgeText,
}: {
  href: string
  icon: typeof LayoutGrid
  label: string
  badge?: string
}) {
  const pathname = usePathname()
  const active = href !== "#" && pathname === href
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-[11px] py-2.5 px-3 rounded-[9px] text-[13px] font-medium relative no-underline [&_svg]:shrink-0",
        active ? "soft-card-sm text-ds-orange" : "text-ds-mute hover:text-ds-dim"
      )}
    >
      <Icon className="size-[17px]" />
      <span>{label}</span>
      {badgeText && (
        <Badge variant="secondary" className="ml-auto h-auto bg-ds-orange/10 px-1.5 py-0.5 font-mono text-[8px] text-ds-orange">
          {badgeText}
        </Badge>
      )}
    </a>
  )
}

/* ─── LAYOUT ─── */

export function DashboardLayout({ userName, children }: { userName?: string; children: React.ReactNode }) {
  const router = useRouter()

  return (
    <main className="grid min-h-svh grid-cols-[224px_1fr] bg-ds-bg text-ds-ink">
      {/* ─── SIDEBAR ─── */}
      <aside className="sticky top-0 flex h-svh flex-col overflow-y-auto border-r border-ds-line p-5 px-3.5">
        <div className="mb-2 flex items-center gap-2.5 px-2">
          <svg width={22} height={26} className="text-ds-ink"><use href="#kora-k" /></svg>
          <div>
            <span className="text-base font-bold">Kora</span>
            <span className="mt-px block font-mono text-[7px] tracking-[0.1em] text-ds-mute">FUNDO ON-CHAIN</span>
          </div>
        </div>

        <div className="mx-1 mt-3.5 mb-5 flex gap-0.5 rounded-[10px] border border-ds-line bg-[#0e0e11] p-0.5">
          <button className="soft-card-sm flex-1 rounded-[7px] py-[7px] text-center text-[11px] font-semibold text-ds-ink">Investidor</button>
          <button className="flex-1 rounded-[7px] py-[7px] text-center text-[11px] font-semibold text-ds-mute">Comércio</button>
        </div>

        <div className="mb-[7px] mt-4 px-2.5 font-mono text-[8px] uppercase tracking-[0.15em] text-ds-faint">Geral</div>
        <NavItem href="/dashboard" icon={LayoutGrid} label="Dashboard" />
        <NavItem href="/dashboard/cartao" icon={CreditCard} label="Meu cartão" />
        <NavItem href="/dashboard/invest" icon={Layers} label="Portfólio" />

        <div className="mb-[7px] mt-4 px-2.5 font-mono text-[8px] uppercase tracking-[0.15em] text-ds-faint">Operação</div>
        <NavItem href="/dashboard/loja" icon={Store} label="Comércios" badge="42" />

        <div className="mt-auto">
          <div className="soft-card-sm flex items-center gap-[9px] rounded-[11px] p-2.5">
            <div className="relative flex size-[30px] shrink-0 items-center justify-center rounded-full border border-ds-line bg-ds-elev">
              <svg width={13} height={16}><use href="#kora-k" /></svg>
              <span className="absolute -right-[3px] -bottom-0.5 flex size-3.5 items-center justify-center rounded-full border border-ds-line-2 bg-ds-bg">
                <SolanaLogo size={12} />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold">{userName || "Usuário"}</div>
              <div className="font-mono text-[8px] text-ds-mute">7nxB...4X1a</div>
            </div>
            <button
              aria-label="Sair"
              onClick={async () => {
                const supabase = createClient()
                await supabase.auth.signOut()
                router.push("/login")
                router.refresh()
              }}
              className="rounded-md p-1 text-ds-mute transition-colors hover:text-ds-red"
            >
              <LogOut className="size-[13px]" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between border-b border-ds-line px-6 py-4">
          <div>
            <div className="text-lg font-bold tracking-tight">Bom te ver, {userName?.split(" ")[0] || "Investidor"}</div>
            <div className="mt-0.5 font-mono text-[9px] text-ds-mute">último acesso: hoje, 09:12</div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex w-[230px] items-center gap-2 rounded-full border border-white/5 bg-ds-bg-2 px-3.5 py-2">
              <Search className="size-3.5 text-ds-mute" />
              <span className="text-xs text-ds-mute">Buscar comércio, tx...</span>
            </div>
            <Button variant="ghost" size="icon" className="relative size-9 rounded-full border border-white/5 bg-ds-bg-2 text-ds-dim" aria-label="Notificações">
              <Bell className="size-[15px]" />
              <span className="absolute top-2 right-[9px] size-1.5 rounded-full border-[1.5px] border-ds-bg bg-ds-orange" />
            </Button>
          </div>
        </div>

        {children}
      </div>
    </main>
  )
}
