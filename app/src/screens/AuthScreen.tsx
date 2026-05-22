import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { INITIAL_AUTH_FORM, RETURNING_USER } from "../features/auth/constants";
import { AccountTypeStep } from "../features/auth/steps/AccountTypeStep";
import { DetailsStep } from "../features/auth/steps/DetailsStep";
import { PinLoginStep } from "../features/auth/steps/PinLoginStep";
import { WalletStep } from "../features/auth/steps/WalletStep";
import { WelcomeStep } from "../features/auth/steps/WelcomeStep";
import { AccountType, AuthForm, AuthStage, AuthUserData } from "../features/auth/types";
import { cleanUsername, resolveSignupData, validateAuthDetails } from "../features/auth/utils";

interface AuthScreenProps {
  onAuthSuccess: (userData: AuthUserData, isSignup: boolean) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const { t } = useTheme();
  const [stage, setStage] = useState<AuthStage>("welcome");
  const [accountType, setAccountType] = useState<AccountType>("PF");
  const [form, setForm] = useState<AuthForm>(INITIAL_AUTH_FORM);
  const [focusedField, setFocusedField] = useState<keyof AuthForm | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pin, setPin] = useState<string[]>([]);
  const [walletStep, setWalletStep] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(false);

  useEffect(() => {
    if (stage !== "wallet") return;

    setLoadingWallet(true);
    setWalletStep(0);

    const timers = [
      setTimeout(() => setWalletStep(1), 450),
      setTimeout(() => setWalletStep(2), 950),
      setTimeout(() => setWalletStep(3), 1450),
      setTimeout(() => {
        setLoadingWallet(false);
        onAuthSuccess(resolveSignupData(form, accountType), true);
      }, 2100),
    ];

    return () => timers.forEach(clearTimeout);
  }, [accountType, form, onAuthSuccess, stage]);

  const startSignup = (emailSeed?: string) => {
    setForm((prev) => ({ ...prev, email: prev.email || emailSeed || "" }));
    setError(null);
    setStage("accountType");
  };

  const handleBack = () => {
    setError(null);

    if (stage === "pin") {
      setPin([]);
      setStage("welcome");
      return;
    }

    if (stage === "accountType") {
      setStage("welcome");
      return;
    }

    if (stage === "details") {
      setStage("accountType");
    }
  };

  const handleChangeField = (field: keyof AuthForm, value: string) => {
    const nextValue = field.toLowerCase().includes("username") ? cleanUsername(value) : value;
    setForm((prev) => ({ ...prev, [field]: nextValue }));
    setError(null);
  };

  const handleCreateAccount = () => {
    const validation = validateAuthDetails(form, accountType);
    if (validation) {
      setError(validation);
      return;
    }

    setStage("wallet");
  };

  const handlePinDigit = (digit: string) => {
    if (pin.length >= 6) return;

    const next = [...pin, digit];
    setPin(next);

    if (next.length === 6) {
      setTimeout(() => onAuthSuccess(RETURNING_USER, false), 250);
    }
  };

  const activeUsername = accountType === "PF" ? form.username : form.storeUsername;

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} translucent />

      {stage === "welcome" ? (
        <WelcomeStep
          onSignupWithApple={() => startSignup("kaua@icloud.com")}
          onSignupWithGoogle={() => startSignup("kaua@gmail.com")}
          onSignupWithEmail={() => startSignup()}
          onPinLogin={() => setStage("pin")}
        />
      ) : null}

      {stage === "pin" ? (
        <PinLoginStep
          user={RETURNING_USER}
          pin={pin}
          onDigit={handlePinDigit}
          onDelete={() => setPin((prev) => prev.slice(0, -1))}
          onBack={handleBack}
          onSwitchAccount={() => {
            setPin([]);
            setStage("welcome");
          }}
        />
      ) : null}

      {stage === "accountType" ? (
        <AccountTypeStep
          selected={accountType}
          onSelect={setAccountType}
          onBack={handleBack}
          onContinue={() => {
            setError(null);
            setStage("details");
          }}
        />
      ) : null}

      {stage === "details" ? (
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
      ) : null}

      {stage === "wallet" ? (
        <WalletStep username={activeUsername} walletStep={walletStep} loading={loadingWallet} />
      ) : null}
    </SafeAreaView>
  );
};
