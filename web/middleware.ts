import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

// /dashboard NÃO é mais gated no middleware — o auth passou a ser client-side
// via Privy (preview). Mantemos só o redirect de usuários Supabase já logados
// saindo de /login e /register.
export const config = {
  matcher: ["/login", "/register"],
}
