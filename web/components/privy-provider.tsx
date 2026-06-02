"use client"

import { PrivyProvider } from "@privy-io/react-auth"

const APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmpr1els201hw0dl4wbg6ckqw"
const CLIENT_ID =
  process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID ||
  "client-WY6ZaaiWzRZk9PwWwDtjpGyvhSn8WLKqa1qJ4m4RQzYc8"

/**
 * Provider do Privy (mesmo app do mobile). Dá auth real + embedded wallet Solana.
 * Envolve a árvore inteira; só inicializa o SDK, sem bloquear o render.
 */
export function PrivyAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={APP_ID}
      clientId={CLIENT_ID}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#ff6b3d",
          walletChainType: "solana-only",
          showWalletLoginFirst: false,
        },
        loginMethods: ["email", "google"],
        embeddedWallets: {
          solana: { createOnLogin: "users-without-wallets" },
          showWalletUIs: true,
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
