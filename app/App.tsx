import React, { useState } from "react";
import { HomeScreen } from "./src/screens/HomeScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { SecuritySetupScreen } from "./src/screens/SecuritySetupScreen";
import { SplashScreen } from "./src/screens/SplashScreen";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";

interface UserSession {
  name: string;
  email: string;
  accountType: "PF" | "PJ";
  username: string;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [session, setSession] = useState<UserSession | null>(null);
  const [tempSession, setTempSession] = useState<UserSession | null>(null);

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

  if (showSplash) {
    return <SplashScreen onAnimationComplete={() => setShowSplash(false)} />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />;
  }

  // If a session is active, go straight to HomeScreen
  if (session) {
    return (
      <HomeScreen
        userName={session.name}
        username={session.username}
        accountType={session.accountType}
        onLogout={() => setSession(null)}
        onSwitchAccount={handleSwitchAccount}
        onAddAccount={handleAddAccount}
      />
    );
  }

  // If we just signed up, route through Security Setup onboarding step
  if (tempSession) {
    return (
      <SecuritySetupScreen
        userName={tempSession.name}
        onComplete={(method) => {
          // Finalize session upon completing security onboarding
          setSession(tempSession);
          setTempSession(null);
        }}
      />
    );
  }

  // Otherwise, display the main Authentication Screen (Login / Signup)
  return (
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
