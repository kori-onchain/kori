import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { INITIAL_AUTH_FORM } from "../features/auth/constants";
import { AccountTypeStep } from "../features/auth/steps/AccountTypeStep";
import { DetailsStep } from "../features/auth/steps/DetailsStep";
import { LoginStep } from "../features/auth/steps/LoginStep";
import { WalletStep } from "../features/auth/steps/WalletStep";
import { WelcomeStep } from "../features/auth/steps/WelcomeStep";
import {
  AccountType,
  AuthForm,
  AuthStage,
  AuthUserData,
} from "../features/auth/types";
import {
  cleanUsername,
  resolveSignupData,
  validateAuthDetails,
} from "../features/auth/utils";
import { supabase } from "../lib/supabase";
import { createWallet, hasWallet } from "../lib/wallet";

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
  const [walletStep, setWalletStep] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (stage !== "wallet") return;

    let cancelled = false;
    setLoadingWallet(true);
    setWalletStep(0);

    async function doSignup() {
      const userData = resolveSignupData(form, accountType);

      try {
        setWalletStep(1);
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        });
        if (signUpError) throw signUpError;
        if (cancelled) return;

        setWalletStep(2);
        const pubkey = await createWallet();
        if (cancelled) return;

        setWalletStep(3);
        await supabase
          .from("profiles")
          .update({
            name: userData.name,
            username: userData.username,
            account_type: userData.accountType,
            wallet_pubkey: pubkey,
          })
          .eq("id", data.user!.id);
        if (cancelled) return;

        setLoadingWallet(false);
        onAuthSuccess(userData, true);
      } catch (err: any) {
        if (cancelled) return;
        setLoadingWallet(false);
        setError(err.message || "Erro ao criar conta.");
        setStage("details");
      }
    }

    doSignup();
    return () => {
      cancelled = true;
    };
  }, [stage]);

  const startSignup = (emailSeed?: string) => {
    setForm((prev) => ({ ...prev, email: prev.email || emailSeed || "" }));
    setError(null);
    setStage("accountType");
  };

  const handleBack = () => {
    setError(null);

    if (stage === "login") {
      setLoginError(null);
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
    const nextValue = field.toLowerCase().includes("username")
      ? cleanUsername(value)
      : value;
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

  const handleLogin = async (email: string, password: string) => {
    if (!email.trim() || !password) {
      setLoginError("Preencha e-mail e senha.");
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
      if (signInError) throw signInError;

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, username, account_type")
        .eq("id", data.user.id)
        .single();

      const userData: AuthUserData = {
        name: profile?.name || "Usuário",
        email: data.user.email || email,
        accountType: profile?.account_type || "PF",
        username: profile?.username || "",
      };

      const walletExists = await hasWallet();
      if (!walletExists) {
        const pubkey = await createWallet();
        await supabase
          .from("profiles")
          .update({ wallet_pubkey: pubkey })
          .eq("id", data.user.id);
      }

      onAuthSuccess(userData, false);
    } catch (err: any) {
      const msg = err.message || "Erro ao entrar.";
      setLoginError(
        msg.includes("Invalid login")
          ? "E-mail ou senha incorretos."
          : msg,
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const activeUsername =
    accountType === "PF" ? form.username : form.storeUsername;

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} translucent />

      {stage === "welcome" ? (
        <WelcomeStep
          onSignupWithApple={() => startSignup("kaua@icloud.com")}
          onSignupWithGoogle={() => startSignup("kaua@gmail.com")}
          onSignupWithEmail={() => startSignup()}
          onPinLogin={() => setStage("login")}
        />
      ) : null}

      {stage === "login" ? (
        <LoginStep
          onBack={handleBack}
          onLogin={handleLogin}
          loading={loginLoading}
          error={loginError}
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
        <WalletStep
          username={activeUsername}
          walletStep={walletStep}
          loading={loadingWallet}
        />
      ) : null}
    </SafeAreaView>
  );
};
