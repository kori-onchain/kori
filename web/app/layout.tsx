import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import "./landing.css"
import { ThemeProvider } from "@/components/theme-provider"
import { KoriSymbols } from "@/components/landing/kori-symbols"
import { cn } from "@/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

// Override em produção via NEXT_PUBLIC_SITE_URL (ex.: https://kori.app)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kori.app"

const title = "Kori — A ponte entre capital global e economia local"
const description =
  "Kori é o ecossistema financeiro Web3 que conecta capital global à economia local: pagamentos, antecipação de recebíveis, yield local e benefícios tokenizados na Solana — com cara de app comum e Web3 invisível."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Kori",
  },
  description,
  applicationName: "Kori",
  keywords: [
    "Kori",
    "Solana",
    "Web3",
    "DeFi",
    "pagamentos",
    "Pix",
    "antecipação de recebíveis",
    "yield local",
    "USDC",
    "tokenização",
    "fintech",
    "Brasil",
    "carteira on-chain",
  ],
  authors: [{ name: "Kori Labs", url: "https://github.com/kori-onchain" }],
  creator: "Kori Labs",
  publisher: "Kori Labs",
  category: "finance",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Kori",
    title,
    description,
    images: [
      {
        url: "/banner.png",
        width: 2002,
        height: 1184,
        alt: "Kori — Onde o dinheiro encontra quem precisa dele. Built on Solana.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
  ],
  colorScheme: "dark light",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, fontMono.variable)}
    >
      <body>
        <ThemeProvider>
          <KoriSymbols />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
