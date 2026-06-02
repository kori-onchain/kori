import "server-only" // a URL do webhook é segredo de servidor — nunca vai pro client

/** Detalhes coletados no client (best-effort). */
export type TrackPayload = {
  path?: string
  url?: string
  referrer?: string
  userAgent?: string
  language?: string
  languages?: string[]
  screen?: string
  viewport?: string
  dpr?: number
  timezone?: string
  platform?: string
  utm?: Record<string, string>
  connection?: string
  cores?: number
  memory?: number
  darkMode?: boolean
  reducedMotion?: boolean
}

/** Contexto adicionado no servidor a partir da request. */
export type ServerContext = {
  ip: string
  ua?: string
  geo?: {
    country?: string
    region?: string
    city?: string
    isp?: string
    org?: string
    asn?: string
    lat?: number
    lon?: number
    flag?: string
    proxy?: boolean
    mobile?: boolean
  }
}

const ORANGE = 0xff6b3d

const isPublicIp = (ip: string) =>
  Boolean(ip) &&
  ip !== "desconhecido" &&
  ip !== "::1" &&
  ip !== "127.0.0.1" &&
  !ip.startsWith("10.") &&
  !ip.startsWith("192.168.") &&
  !ip.startsWith("172.16.") &&
  !ip.startsWith("fc") &&
  !ip.startsWith("fd")

/**
 * Enriquece o IP com geolocalização via ipwho.is (free, https, sem chave).
 * Best-effort com timeout curto — falha silenciosa.
 */
export async function lookupGeo(ip: string): Promise<ServerContext["geo"]> {
  if (!isPublicIp(ip)) return undefined
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 2000)
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: ctrl.signal,
      cache: "no-store",
    })
    clearTimeout(t)
    if (!res.ok) return undefined
    const d = await res.json()
    if (!d?.success) return undefined
    return {
      country: d.country,
      region: d.region,
      city: d.city,
      isp: d.connection?.isp,
      org: d.connection?.org,
      asn: d.connection?.asn ? String(d.connection.asn) : undefined,
      lat: d.latitude,
      lon: d.longitude,
      flag: d.flag?.emoji,
      proxy: d.security?.proxy,
      mobile: d.security?.mobile,
    }
  } catch {
    return undefined
  }
}

function field(name: string, value: string | undefined | null, inline = true) {
  if (!value) return null
  return { name, value: value.slice(0, 1024), inline }
}

/** Monta e envia o embed pro Discord. No-op se DISCORD_WEBHOOK_URL não existir. */
export async function sendVisitToDiscord(
  payload: TrackPayload,
  ctx: ServerContext,
): Promise<void> {
  const webhook = process.env.DISCORD_WEBHOOK_URL
  if (!webhook) return

  const geo = ctx.geo
  const local = geo
    ? [geo.flag, [geo.city, geo.region, geo.country].filter(Boolean).join(", ")]
        .filter(Boolean)
        .join(" ")
    : undefined

  const device = [
    payload.platform,
    payload.cores ? `${payload.cores} núcleos` : null,
    payload.memory ? `${payload.memory} GB RAM` : null,
  ]
    .filter(Boolean)
    .join(" · ")

  const flags = [
    payload.darkMode != null ? (payload.darkMode ? "🌙 dark" : "☀️ light") : null,
    payload.reducedMotion ? "♿ reduced-motion" : null,
    geo?.proxy ? "🛡️ proxy/VPN" : null,
    geo?.mobile ? "📶 mobile carrier" : null,
  ]
    .filter(Boolean)
    .join(" · ")

  const fields = [
    field("📄 Página", payload.path),
    field("↩️ Referrer", payload.referrer || "(direto / sem referrer)"),
    field("📍 Local", local || "(não resolvido)"),
    field("🛰️ IP", ctx.ip),
    field(
      "🏢 Conexão",
      [geo?.isp, geo?.org, geo?.asn].filter(Boolean).join(" · ") || undefined,
    ),
    field("🖥️ Dispositivo", device || undefined),
    field("📐 Tela / Viewport", [payload.screen, payload.viewport].filter(Boolean).join(" / ") || undefined),
    field("🔎 DPR / Rede", [payload.dpr ? `${payload.dpr}x` : null, payload.connection].filter(Boolean).join(" · ") || undefined),
    field("🌍 Idioma", payload.languages?.join(", ") || payload.language),
    field("🕒 Timezone", payload.timezone),
    field(
      "🎯 UTM",
      payload.utm
        ? Object.entries(payload.utm)
            .map(([k, v]) => `${k}=${v}`)
            .join("\n")
        : undefined,
    ),
    field("⚙️ Estado", flags || undefined),
    field(
      "🗺️ Geo",
      geo?.lat != null && geo?.lon != null
        ? `[${geo.lat}, ${geo.lon}](https://maps.google.com/?q=${geo.lat},${geo.lon})`
        : undefined,
    ),
  ].filter(Boolean)

  const embed = {
    title: "👀 Nova visita — Kori",
    url: payload.url,
    description: payload.userAgent
      ? `\`\`\`${payload.userAgent.slice(0, 300)}\`\`\``
      : undefined,
    color: ORANGE,
    fields,
    footer: { text: "kori · visitor tracker" },
    timestamp: new Date().toISOString(),
  }

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Kori Tracker",
        embeds: [embed],
      }),
    })
  } catch {
    // best-effort; não quebra a request do usuário
  }
}
