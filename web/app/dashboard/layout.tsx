import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { createClient } from "@/lib/supabase/server"

// Só usa Supabase no server quando NÃO está em mock E as envs existem.
// Em prod sem env (modo mock), isso evita o 500 do dashboard.
const USE_SUPABASE =
  process.env.NEXT_PUBLIC_MOCK === "false" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Sem gate server-side: o auth é client-side (mock/Privy/Supabase). Se houver
  // sessão Supabase real, aproveitamos o perfil pra preencher o header.
  let profile:
    | {
        name: string | null
        username: string | null
        account_type: string | null
        business_name: string | null
        wallet_pubkey: string | null
      }
    | null = null
  let email: string | undefined

  if (USE_SUPABASE) {
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      email = user?.email
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("name, username, account_type, business_name, wallet_pubkey")
          .eq("id", user.id)
          .maybeSingle()
        profile = data
      }
    } catch {
      /* sem Supabase configurado — segue no client (mock) */
    }
  }

  return (
    <DashboardLayout
      userName={profile?.name || email?.split("@")[0]}
      accountType={(profile?.account_type as "PF" | "PJ") || "PF"}
      businessName={profile?.business_name || undefined}
      username={profile?.username || undefined}
      walletPubkey={profile?.wallet_pubkey || undefined}
    >
      {children}
    </DashboardLayout>
  )
}
