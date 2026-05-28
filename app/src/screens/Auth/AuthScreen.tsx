import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { useTheme } from "@theme/ThemeProvider";
import { useAuthLogic } from "@hooks/useAuthLogic";
import { WelcomeStep } from "@components/auth/steps/WelcomeStep";
import { LoginStep } from "@components/auth/steps/LoginStep";
import { PinLoginStep } from "@components/auth/steps/PinLoginStep";
import { AccountTypeStep } from "@components/auth/steps/AccountTypeStep";
import { DetailsStep } from "@components/auth/steps/DetailsStep";
import { WalletStep } from "@components/auth/steps/WalletStep";
import { AuthUserData } from "@type/auth";
import { RETURNING_USER } from "@constants/authConstants";
import { hasPin } from "@/lib/pinService";
import { getSession } from "@/lib/authService";
import { MOCK_AUTH } from "@constants/devConfig";

interface AuthScreenProps {
  onAuthSuccess: (userData: AuthUserData, isSignup: boolean) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> & {
  Container: React.FC<{ children: React.ReactNode; bg: string; barStyle: any }>;
} = ({ onAuthSuccess }) => {
  const { t } = useTheme();
  const [hasSavedPin, setHasSavedPin] = useState(false);

  useEffect(() => {
    (async () => {
      const pinExists = await hasPin();
      if (MOCK_AUTH) {
        setHasSavedPin(pinExists);
        return;
      }
      const { data } = await getSession();
      setHasSavedPin(pinExists && !!data.session);
    })();
  }, []);

  const {
    stage,
    accountType,
    setAccountType,
    form,
    focusedField,
    setFocusedField,
    error,
    pin,
    walletStep,
    loadingWallet,
    loadingLogin,
    startSignup,
    startLogin,
    handleBack,
    handleChangeField,
    handleCreateAccount,
    handleLogin,
    handlePinDigit,
    setPin,
    setStage,
    activeUsername,
  } = useAuthLogic({ onAuthSuccess });

  return (
    <AuthScreen.Container bg={t.bg} barStyle={t.statusBar}>
      {stage === "welcome" && (
        <WelcomeStep
          onSignupWithApple={() => startSignup()}
          onSignupWithGoogle={() => startSignup()}
          onSignupWithEmail={() => startSignup()}
          onPinLogin={() => {
            if (hasSavedPin) {
              setStage("pin");
            } else {
              startLogin();
            }
          }}
        />
      )}

      {stage === "login" && (
        <LoginStep
          form={form}
          focusedField={focusedField}
          error={error}
          loading={loadingLogin}
          onBack={handleBack}
          onFocusField={setFocusedField}
          onChangeField={handleChangeField}
          onLogin={handleLogin}
          onCreateAccount={() => startSignup()}
        />
      )}

      {stage === "pin" && (
        <PinLoginStep
          user={RETURNING_USER}
          pin={pin}
          onDigit={handlePinDigit}
          onDelete={() => setPin((prev) => prev.slice(0, -1))}
          onBack={handleBack}
          onSwitchAccount={() => {
            setPin([]);
            startLogin();
          }}
        />
      )}

      {stage === "accountType" && (
        <AccountTypeStep
          selected={accountType}
          onSelect={setAccountType}
          onBack={handleBack}
          onContinue={() => {
            setStage("details");
          }}
        />
      )}

      {stage === "details" && (
        <DetailsStep
          accountType={accountType}
          form={form}
          focusedField={focusedField}
          error={error}
          onBack={handleBack}
          onFocusField={setFocusedField}
          onChangeField={handleChangeField}
          onContinue={handleCreateAccount}
        />
      )}

      {stage === "wallet" && (
        <WalletStep
          username={activeUsername}
          walletStep={walletStep}
          loading={loadingWallet}
        />
      )}
    </AuthScreen.Container>
  );
};

const AuthContainer: React.FC<{
  children: React.ReactNode;
  bg: string;
  barStyle: any;
}> = ({ children, bg, barStyle }) => (
  <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
    <StatusBar barStyle={barStyle} backgroundColor={bg} translucent />
    {children}
  </SafeAreaView>
);

AuthScreen.Container = AuthContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
