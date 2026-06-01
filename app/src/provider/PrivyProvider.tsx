import Constants from "expo-constants";
import { PrivyProvider } from "@privy-io/expo";
import { PrivyElements } from "@privy-io/expo/ui";
import { ReactNode } from "react";

const FALLBACK_APP_ID = "cmpr1els201hw0dl4wbg6ckqw";
const FALLBACK_CLIENT_ID = "client-WY6ZaaiWzRZk9PwWwDtjpGyvhSn8WLKqa1qJ4m4RQzYc8";

export default function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  const appId =
    process.env.EXPO_PUBLIC_PRIVY_APP_ID ||
    Constants.expoConfig?.extra?.privyAppId ||
    FALLBACK_APP_ID;

  const clientId =
    process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID ||
    Constants.expoConfig?.extra?.privyClientId ||
    FALLBACK_CLIENT_ID;

  console.log("[PrivyProvider] Initializing with AppID:", appId ? "OK" : "MISSING", "ClientID:", clientId ? "OK" : "MISSING");

  return (
    <PrivyProvider
      appId={appId}
      clientId={clientId}
    >
      {children}
      <PrivyElements />
    </PrivyProvider>
  );
}

