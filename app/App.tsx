import React, { useState } from "react";
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
  const [showSplash, setShowSplash] = useState(true);
  const [session, setSession] = useState<UserSession | null>(null);
  const [tempSession, setTempSession] = useState<UserSession | null>(null);

  if (!fontsLoaded) {
    // Keep the screen black while the Geist family is loading — avoids the
    // brief Roboto/system flash on cold start.
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

  let screen: React.ReactNode;

  if (showSplash) {
    screen = <SplashScreen onAnimationComplete={() => setShowSplash(false)} />;
  } else if (session) {
    // If a session is active, go straight to HomeScreen
    screen = (
      <HomeScreen
        userName={session.name}
        username={session.username}
        accountType={session.accountType}
        onLogout={() => setSession(null)}
        onSwitchAccount={handleSwitchAccount}
        onAddAccount={handleAddAccount}
      />
    );
  } else if (tempSession) {
    // If we just signed up, route through Security Setup onboarding step
    screen = (
      <SecuritySetupScreen
        userName={tempSession.name}
        onComplete={(method) => {
          // Finalize session upon completing security onboarding
          setSession(tempSession);
          setTempSession(null);
        }}
      />
    );
  } else {
    // Otherwise, display the main Authentication Screen (Login / Signup)
    screen = (
      <AuthScreen
        onAuthSuccess={(userData, isSignup) => {
          if (isSignup) {
            // If it was a signup, go to security setup
            setTempSession(userData);
          } else {
            // If it was a login, go straight to home screen
            setSession(userData);
          }
        }}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>{screen}</ThemeProvider>
    </SafeAreaProvider>
  );
}
