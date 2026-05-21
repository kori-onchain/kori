import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import "./landing.css"
import { ThemeProvider } from "@/components/theme-provider"
import { KoraSymbols } from "@/components/landing/kora-symbols"
import { cn } from "@/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

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
          <KoraSymbols />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
