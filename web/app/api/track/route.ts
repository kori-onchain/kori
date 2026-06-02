import type { NextRequest } from "next/server"

import {
  lookupGeo,
  sendVisitToDiscord,
  type ServerContext,
  type TrackPayload,
} from "@/lib/track/discord"

/**
 * Tracker de visitas → Discord webhook.
 *
 * O client (components/track/visitor-tracker.tsx) coleta detalhes e faz POST
 * aqui. O servidor adiciona IP + geolocalização e dispara o webhook.
 *
 * A URL do webhook (DISCORD_WEBHOOK_URL) é segredo de servidor: NUNCA use
 * prefixo NEXT_PUBLIC_, senão vaza pro bundle do front.
 *
 * A env é o liga/desliga: com ela presente, dispara; sem ela, é no-op.
 * Então deixe DISCORD_WEBHOOK_URL só no .env.local pra ver localmente, e
 * NÃO configure em produção — assim em prod ele simplesmente não roda.
 */
export const runtime = "nodejs"

function clientIp(req: NextRequest): string {
  const h = req.headers
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "desconhecido"
  )
}

const dec = (v: string | null) => {
  if (!v) return undefined
  try {
    return decodeURIComponent(v)
  } catch {
    return v
  }
}

export async function POST(req: NextRequest) {
  let payload: TrackPayload = {}
  try {
    payload = (await req.json()) as TrackPayload
  } catch {
    // payload vazio ainda registra a visita
  }

  const h = req.headers
  const ip = clientIp(req)

  // Geo: usa headers da plataforma (Vercel/Cloudflare) quando houver;
  // senão, faz lookup por IP (ipwho.is) como fallback.
  const headerGeo = {
    country: h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || undefined,
    region: dec(h.get("x-vercel-ip-country-region")),
    city: dec(h.get("x-vercel-ip-city")),
  }
  const geo =
    headerGeo.country || headerGeo.city
      ? headerGeo
      : await lookupGeo(ip)

  const ctx: ServerContext = {
    ip,
    ua: h.get("user-agent") || undefined,
    geo,
  }

  await sendVisitToDiscord(payload, ctx)

  return new Response(null, { status: 204 })
}
