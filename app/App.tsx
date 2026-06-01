import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";
import {
  useFonts,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from "@expo-google-fonts/geist";
import {
  GeistMono_400Regular,
  GeistMono_500Medium,
  GeistMono_600SemiBold,
} from "@expo-google-fonts/geist-mono";
import { HomeScreen } from "./src/screens/Home/HomeScreen";
import { AuthScreen } from "./src/screens/Auth/AuthScreen";
import { SecuritySetupScreen } from "./src/screens/SecuritySetup/SecuritySetupScreen";
import { SplashScreen } from "./src/screens/Splash/SplashScreen";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import { useAuth } from "./src/hooks/useAuth";
import {
  hasBiometricLockEnabled,
  saveBiometricLockEnabled,
} from "./src/lib/pinService";
import { AuthUserData, AccountType } from "./src/types/auth";
import { MOCK_AUTH } from "./src/constants/devConfig";
import { apiClient, setActiveAccountContext, setPrivyTokenGetter } from "./src/lib/apiClient";
import { usePrivy } from "@privy-io/expo";
import PrivyProvider from "./src/provider/PrivyProvider";
import PrivyUI from "@/screens/Privy";
import { useAccountSwitcher } from "./src/hooks/useAccountSwitcher";
import * as LocalAuthentication from "expo-local-authentication";
import { UnlockScreen } from "./src/screens/SecuritySetup/UnlockScreen";
import { BusinessNameDrawer } from "./src/components/merchant/BusinessNameDrawer";
import { updateProfile } from "./src/lib/authService";

interface UserSession {
  name: string;
  email: string;
  accountType: "PF" | "PJ";
  username: string;
  privyUserId?: string;
  supabaseId?: string;
  businessName?: string;
  store?: { name?: string; username?: string; category?: string } | null;
}

function AppContent() {
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    GeistMono_400Regular,
    GeistMono_500Medium,
    GeistMono_600SemiBold,
  });
  const [showSplash, setShowSplash] = useState(true);
  const [session, setSession] = useState<UserSession | null>(null);
  const [tempSession, setTempSession] = useState<UserSession | null>(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isAppUnlocked, setIsAppUnlocked] = useState(false);
  const [biometricLockEnabled, setBiometricLockEnabled] = useState(false);
  const [isSecurityCheckLoading, setIsSecurityCheckLoading] = useState(true);
  const [isAddingBusinessAccount, setIsAddingBusinessAccount] = useState(false);
  const [businessNameDismissed, setBusinessNameDismissed] = useState(false);

  const { session: privySession, loading: authLoading, logout: privyLogout } = useAuth();
  const { getAccessToken } = usePrivy();
  const { switchAccount } = useAccountSwitcher();

  useEffect(() => {
    if (session) {
      (async () => {
        setIsSecurityCheckLoading(true);
        const enabled = await hasBiometricLockEnabled();
        setBiometricLockEnabled(enabled);
        if (!enabled) {
          setIsAppUnlocked(false);
        }
        setIsSecurityCheckLoading(false);
      })();
    } else {
      setIsAppUnlocked(false);
      setIsSecurityCheckLoading(true);
    }
  }, [session]);

  const triggerBiometrics = async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Liberar acesso",
          fallbackLabel: "",
          disableDeviceFallback: true,
        });

        if (result.success) {
          setIsAppUnlocked(true);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.warn("[Biometrics] Authentication error:", err);
      return false;
    }
  };

  useEffect(() => {
    if (
      session &&
      biometricLockEnabled &&
      !isAppUnlocked &&
      !isSecurityCheckLoading
    ) {
      triggerBiometrics();
    }
  }, [session, biometricLockEnabled, isAppUnlocked, isSecurityCheckLoading]);

  useEffect(() => {
    setPrivyTokenGetter(getAccessToken);
  }, [getAccessToken]);

  useEffect(() => {
    if (authLoading || session || initialCheckDone) return;

    if (privySession?.user) {
      (async () => {
        try {
          const profiles = await apiClient.get<Array<{
            name: string;
            email: string;
            username: string;
            accountType: AccountType;
            businessName?: string;
            store?: { name?: string; username?: string; category?: string } | null;
          }>>("/auth/accounts");
          const profile = profiles.find((account) => account.accountType === "PF") || profiles[0];
          if (!profile) {
            throw new Error("No profile synchronized");
          }
          setActiveAccountContext(profile.accountType);

          setSession({
            name: profile?.name || privySession.user.email?.split("@")[0] || "Usuário",
            email: profile?.email || privySession.user.email || "",
            accountType: profile?.accountType || "PF",
            username: profile?.username || privySession.user.email?.split("@")[0] || "user",
            privyUserId: privySession.user.id,
            businessName: profile?.store?.name || profile?.businessName || undefined,
            store: profile?.store,
          });

          try {
            const list = await apiClient.get<any[]>("/auth/accounts");
            setAccounts(list);
          } catch {}
        } catch (err) {
          console.warn("[App] Failed to fetch profile from backend:", err);
        }
        setInitialCheckDone(true);
      })();
    } else {
      setInitialCheckDone(true);
    }
  }, [authLoading, privySession, session, initialCheckDone]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#0a0a0a" }} />;
  }

  const handleAuthSuccess = (userData: AuthUserData, isSignup: boolean) => {
    const userSession: UserSession = {
      name: userData.name,
      email: userData.email,
      accountType: userData.accountType,
      username: userData.username,
      privyUserId: userData.privyUserId,
      businessName: userData.businessName,
    };

    if (isSignup && userData.accountType === "PF") {
      setTempSession(userSession);
    } else if (isSignup && userData.accountType === "PJ") {
      setIsAddingBusinessAccount(false);
      setSession(userSession);
      setAccounts((prev) => {
        const withoutPJ = prev.filter((account) => account.accountType !== "PJ");
        return [...withoutPJ, userSession];
      });
      if (!MOCK_AUTH) {
        apiClient
          .get<any[]>("/auth/accounts")
          .then(setAccounts)
          .catch(() => {});
      }
    } else {
      setSession(userSession);
    }
  };

  const handleSwitchAccount = async (newType: "PF" | "PJ") => {
    const current = session;
    if (!current) return;
    const targetAccount = accounts.find((account) => account.accountType === newType);
    if (!targetAccount) {
      if (newType === "PJ") setIsAddingBusinessAccount(true);
      return;
    }

    const targetIndex = newType === "PJ" ? 1 : 0;
    try {
      setActiveAccountContext(newType);
      // 1. Switch active wallet index and derive/select wallet via Privy
      const walletAddress = await switchAccount(targetIndex);

      // 2. Fetch or sync profile on the backend using the new wallet index
      if (!MOCK_AUTH) {
        try {
          const profile = await apiClient.post<UserSession>("/auth/switch");
          setSession({
            name: profile.name,
            email: profile.email,
            accountType: profile.accountType,
            username: profile.username,
            privyUserId: current.privyUserId,
            businessName: profile.store?.name || profile.businessName || undefined,
            store: profile.store,
          });
        } catch (err) {
          // If no profile exists for target index, sync a new one (e.g. PJ)
          const nextUsername =
            newType === "PJ" && !current.username.endsWith("_pj")
              ? `${current.username}_pj`
              : newType === "PF"
                ? current.username.replace(/_pj$/, "")
                : current.username;

          const syncedProfile = await apiClient.post<{
            name: string;
            email: string;
            username: string;
            accountType: AccountType;
            businessName?: string;
            store?: { name?: string; username?: string; category?: string } | null;
          }>("/auth/sync", {
            name: current.name,
            email: current.email,
            username: nextUsername,
            accountType: newType,
            walletAddress,
            walletIndex: targetIndex,
          });

          setSession({
            name: syncedProfile.name,
            email: syncedProfile.email,
            accountType: syncedProfile.accountType,
            username: syncedProfile.username,
            privyUserId: current.privyUserId,
            businessName: syncedProfile.store?.name || syncedProfile.businessName || undefined,
            store: syncedProfile.store,
          });
        }

        // Refetch accounts list after switching/syncing
        try {
          const list = await apiClient.get<any[]>("/auth/accounts");
          setAccounts(list);
        } catch {}
      } else {
        // Mock fallback
        setSession({
          ...current,
          accountType: newType,
          username:
            newType === "PJ" && !current.username.endsWith("_pj")
              ? `${current.username}_pj`
              : newType === "PF"
                ? current.username.replace(/_pj$/, "")
                : current.username,
        });
      }
    } catch (err) {
      console.error("[App] Failed to switch account using HD Wallets:", err);
    }
  };

  const handleLogout = async () => {
    if (!MOCK_AUTH) {
      await privyLogout();
    }
    setSession(null);
    setTempSession(null);
    setIsAddingBusinessAccount(false);
    setInitialCheckDone(false);
    setAccounts([]);
  };

  const handleAddAccount = async () => {
    setIsAddingBusinessAccount(true);
  };

  const needsBusinessName =
    !!session &&
    session.accountType === "PJ" &&
    !session.businessName &&
    !businessNameDismissed;

  const handleSaveBusinessName = async (businessName: string) => {
    if (!MOCK_AUTH && session?.supabaseId) {
      await updateProfile(session.supabaseId, { business_name: businessName });
    }
    setSession((prev) => (prev ? { ...prev, businessName } : prev));
    setBusinessNameDismissed(false);
  };

  let screen: React.ReactNode;

  if (showSplash || (authLoading && !initialCheckDone) || (session && isSecurityCheckLoading)) {
    screen = <SplashScreen onAnimationComplete={() => setShowSplash(false)} />;
  } else if (isAddingBusinessAccount && session) {
    screen = (
      <AuthScreen
        initialAccountType="PJ"
        initialStage="details"
        existingPrivyUser={{
          id: session.privyUserId ?? "",
          email: session.email,
        }}
        onCancel={() => setIsAddingBusinessAccount(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  } else if (session) {
    if (!biometricLockEnabled) {
      screen = (
        <SecuritySetupScreen
          userName={session.name}
          onComplete={async () => {
            await saveBiometricLockEnabled();
            setBiometricLockEnabled(true);
            setIsAppUnlocked(true);
          }}
        />
      );
    } else if (!isAppUnlocked) {
      screen = (
        <UnlockScreen
          userName={session.businessName || session.name}
          username={session.username}
          onUnlock={triggerBiometrics}
          accountType={session.accountType}
        />
      );
    } else {
      screen = (
        <HomeScreen
          userName={session.businessName || session.name}
          username={session.username}
          accountType={session.accountType}
          onLogout={handleLogout}
          onSwitchAccount={handleSwitchAccount}
          onAddAccount={handleAddAccount}
          accounts={accounts}
        />
      );
    }
  } else if (tempSession) {
    screen = (
      <SecuritySetupScreen
        userName={tempSession.name}
        onComplete={async () => {
          await saveBiometricLockEnabled();
          setBiometricLockEnabled(true);
          setIsAppUnlocked(true);
          setSession(tempSession);
          setAccounts((prev) => {
            const withoutPF = prev.filter((account) => account.accountType !== "PF");
            return [tempSession, ...withoutPF];
          });
          if (!MOCK_AUTH) {
            apiClient
              .get<any[]>("/auth/accounts")
              .then(setAccounts)
              .catch(() => {});
          }
          setTempSession(null);
        }}
      />
    );
  } else {
    screen = <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {screen}
        <BusinessNameDrawer
          visible={needsBusinessName}
          onSave={handleSaveBusinessName}
          onClose={() => setBusinessNameDismissed(true)}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PrivyProvider>
        <AppContent />
      </PrivyProvider>
    </SafeAreaProvider>
  );
}
