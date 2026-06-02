import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Sem gate server-side: o auth é client-side via Privy (preview). Se houver
  // uma sessão Supabase (fallback), aproveitamos o perfil pra preencher o header.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("name, username, account_type, business_name, wallet_pubkey")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null }

  return (
    <DashboardLayout
      userName={profile?.name || user?.email?.split("@")[0]}
      accountType={(profile?.account_type as "PF" | "PJ") || "PF"}
      businessName={profile?.business_name || undefined}
      username={profile?.username || undefined}
      walletPubkey={profile?.wallet_pubkey || undefined}
    >
      {children}
    </DashboardLayout>
  )
}
