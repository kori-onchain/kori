import { readFile } from "node:fs/promises"
import path from "node:path"
import { type NextRequest } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const logoPath = path.join(process.cwd(), "public", "logo-source.svg")

function truncate(value: string, maxLength = 1000) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value
}

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  )
}

async function notifyDiscord(request: NextRequest) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    return
  }

  const payload = {
    content: "Logo carregado",
    embeds: [
      {
        title: "Novo carregamento de logo.svg",
        color: 0x0a0a0a,
        fields: [
          {
            name: "URL",
            value: truncate(request.url),
          },
          {
            name: "Referer",
            value: truncate(request.headers.get("referer") ?? "direct"),
          },
          {
            name: "IP",
            value: getClientIp(request),
            inline: true,
          },
          {
            name: "User-Agent",
            value: truncate(request.headers.get("user-agent") ?? "unknown"),
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  }

  try {
    const signal = AbortSignal.timeout(1500)

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal,
    })
  } catch (error) {
    console.error("Failed to notify Discord logo webhook", error)
  }
}

export async function GET(request: NextRequest) {
  const [logo] = await Promise.all([readFile(logoPath), notifyDiscord(request)])

  return new Response(logo, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Type": "image/svg+xml; charset=utf-8",
    },
  })
}
