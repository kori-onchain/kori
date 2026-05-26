import React, { useEffect, useState } from "react";
import { View } from "react-native";
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
import { HomeScreen } from "./src/screens/HomeScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { SecuritySetupScreen } from "./src/screens/SecuritySetupScreen";
import { SplashScreen } from "./src/screens/SplashScreen";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import { useAuth } from "./src/hooks/useAuth";
import { supabase } from "./src/lib/supabase";
import { MOCK_AUTH, MOCK_SESSION } from "./src/constants/devConfig";

interface UserSession {
  name: string;
  email: string;
  accountType: "PF" | "PJ";
  username: string;
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
  const { session: supabaseSession, loading: authLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(!MOCK_AUTH);
  const [showOnboarding, setShowOnboarding] = useState(!MOCK_AUTH);
  const [session, setSession] = useState<UserSession | null>(
    MOCK_AUTH ? MOCK_SESSION : null,
  );
  const [tempSession, setTempSession] = useState<UserSession | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(MOCK_AUTH);

  useEffect(() => {
    if (MOCK_AUTH) return;
    if (authLoading) return;

    if (supabaseSession?.user && !session && !tempSession) {
      supabase
        .from("profiles")
        .select("name, username, account_type")
        .eq("id", supabaseSession.user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setSession({
              name: data.name || "Usuário",
              email: supabaseSession.user.email || "",
              accountType: data.account_type || "PF",
              username: data.username || "",
            });
          }
          setProfileLoaded(true);
        });
    } else if (!supabaseSession) {
      setSession(null);
      setProfileLoaded(true);
    }
  }, [supabaseSession, authLoading]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#0a0a0a" }} />;
  }

  const handleSwitchAccount = (newType: "PF" | "PJ") => {
    setSession((prev) => {
      if (!prev) return null;
      const baseUsername = prev.username.replace("_pj", "");
      const baseName = prev.name
        .replace(" PJ", "")
        .replace(" PF", "")
        .replace(" Store", "")
        .replace(" Business", "")
        .replace(" Personal", "")
        .trim();

      if (newType === "PJ") {
        return {
          ...prev,
          accountType: "PJ",
          username: `${baseUsername}_pj`,
          name: `${baseName} Store`,
        };
      } else {
        return {
          ...prev,
          accountType: "PF",
          username: baseUsername,
          name: baseName,
        };
      }
    });
  };

  const handleAddAccount = () => {
    setSession(null);
    setTempSession(null);
  };

  const handleLogout = async () => {
    if (!MOCK_AUTH) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setTempSession(null);
  };

  let screen: React.ReactNode;

  if (showSplash) {
    screen = <SplashScreen onAnimationComplete={() => setShowSplash(false)} />;
  } else if (showOnboarding) {
    screen = <OnboardingScreen onComplete={() => setShowOnboarding(false)} />;
  } else if (authLoading || (!profileLoaded && supabaseSession)) {
    screen = <View style={{ flex: 1, backgroundColor: "#0a0a0a" }} />;
  } else if (session) {
    screen = (
      <HomeScreen
        userName={session.name}
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
        onComplete={(method) => {
          setSession(tempSession);
          setTempSession(null);
        }}
      />
    );
  } else {
    screen = (
      <AuthScreen
        onAuthSuccess={(userData, isSignup) => {
          if (isSignup) {
            setTempSession(userData);
          } else {
            setSession(userData);
          }
        }}
      />
    );
  }

  return <ThemeProvider>{screen}</ThemeProvider>;
}
