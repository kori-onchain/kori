import { redirect } from "next/navigation"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, username, account_type, business_name")
    .eq("id", user.id)
    .single()

  return (
    <DashboardLayout
      userName={profile?.name || user.email?.split("@")[0]}
      accountType={(profile?.account_type as "PF" | "PJ") || "PF"}
      businessName={profile?.business_name || undefined}
      username={profile?.username || undefined}
    >
      {children}
    </DashboardLayout>
  )
}
