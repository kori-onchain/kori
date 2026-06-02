import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          // Em Server Components não é permitido gravar cookies durante o
          // render — o Next lança "Cookies can only be modified in a Server
          // Action or Route Handler". A sessão é renovada no proxy/middleware,
          // então aqui é seguro ignorar a falha (evita o 500 no dashboard).
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch {
            /* ignore: chamado de um Server Component */
          }
        },
      },
    },
  )
}
