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
import { BusinessNameDrawer } from "./src/components/merchant/BusinessNameDrawer";
import { useAuth } from "./src/hooks/useAuth";
import { getProfile, updateProfile, signOut } from "./src/lib/authService";
import { savePin, clearPin } from "./src/lib/pinService";
import { AuthUserData, AccountType } from "./src/types/auth";
import { MOCK_AUTH } from "./src/constants/devConfig";

interface UserSession {
  name: string;
  email: string;
  accountType: "PF" | "PJ";
  username: string;
  supabaseId?: string;
  businessName?: string;
}

export default function App() {
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

  const { session: supabaseSession, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading || session || initialCheckDone) return;

    if (supabaseSession?.user) {
      (async () => {
        try {
          const { data: profile, error } = await getProfile(supabaseSession.user.id);
          if (error) throw error;
          setSession({
            name: profile?.name || supabaseSession.user.email?.split("@")[0] || "Usuário",
            email: supabaseSession.user.email || "",
            accountType: (profile?.account_type as AccountType) || "PF",
            username: profile?.username || supabaseSession.user.email?.split("@")[0] || "user",
            supabaseId: supabaseSession.user.id,
            businessName: profile?.business_name || undefined,
          });
        } catch {
          await signOut();
        }
        setInitialCheckDone(true);
      })();
    } else {
      setInitialCheckDone(true);
    }
  }, [authLoading, supabaseSession, session, initialCheckDone]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#0a0a0a" }} />;
  }

  const handleAuthSuccess = (userData: AuthUserData, isSignup: boolean) => {
    const userSession: UserSession = {
      name: userData.name,
      email: userData.email,
      accountType: userData.accountType,
      username: userData.username,
      supabaseId: userData.supabaseId,
      businessName: userData.businessName,
    };

    if (isSignup) {
      setTempSession(userSession);
    } else {
      setSession(userSession);
    }
  };

  const handleSwitchAccount = async (newType: "PF" | "PJ") => {
    const current = session;
    if (!current) return;

    const nextSession: UserSession = {
      ...current,
      accountType: newType,
      username:
        newType === "PJ" && !current.username.endsWith("_pj")
          ? `${current.username}_pj`
          : newType === "PF"
            ? current.username.replace(/_pj$/, "")
            : current.username,
      businessName: newType === "PJ" ? current.businessName : undefined,
    };

    setSession((prev) => {
      if (!prev) return null;
      return nextSession;
    });

    if (!MOCK_AUTH && current.supabaseId) {
      await updateProfile(current.supabaseId, {
        account_type: newType,
        username: nextSession.username,
        business_name: nextSession.businessName,
      });
    }
  };

  const handleLogout = async () => {
    if (!MOCK_AUTH) {
      await signOut();
    }
    await clearPin();
    setSession(null);
    setTempSession(null);
    setInitialCheckDone(false);
  };

  const handleAddAccount = async () => {
    await handleLogout();
  };

  const needsBusinessName =
    !!session && session.accountType === "PJ" && !session.businessName;

  const handleSaveBusinessName = async (businessName: string) => {
    if (!MOCK_AUTH && session?.supabaseId) {
      await updateProfile(session.supabaseId, { business_name: businessName });
    }
    setSession((prev) => (prev ? { ...prev, businessName } : prev));
  };

  let screen: React.ReactNode;

  if (showSplash || (authLoading && !initialCheckDone)) {
    screen = <SplashScreen onAnimationComplete={() => setShowSplash(false)} />;
  } else if (session) {
    screen = (
      <HomeScreen
        userName={session.businessName || session.name}
        username={session.username}
        accountType={session.accountType}
        onLogout={handleLogout}
        onSwitchAccount={handleSwitchAccount}
        onAddAccount={handleAddAccount}
      />
    );
  } else if (tempSession) {
    screen = (
      <SecuritySetupScreen
        userName={tempSession.name}
        onComplete={async (method, pinCode) => {
          if (method === "pin" && pinCode) {
            await savePin(pinCode);
          }
          setSession(tempSession);
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
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
