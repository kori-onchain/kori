import { useEffect, useState } from "react";
import { AuthStage, AccountType, AuthForm, AuthUserData } from "@type/auth";
import { INITIAL_AUTH_FORM, RETURNING_USER } from "@constants/authConstants";
import {
  cleanUsername,
  resolveSignupData,
  validateAuthDetails,
} from "@/utils/authUtils";

interface UseAuthLogicParams {
  onAuthSuccess: (userData: AuthUserData, isSignup: boolean) => void;
}

export const useAuthLogic = ({ onAuthSuccess }: UseAuthLogicParams) => {
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

  const handlePinDigit = (digit: string) => {
    if (pin.length >= 6) return;

    const next = [...pin, digit];
    setPin(next);

    if (next.length === 6) {
      setTimeout(() => onAuthSuccess(RETURNING_USER, false), 250);
    }
  };

  const activeUsername =
    accountType === "PF" ? form.username : form.storeUsername;

  return {
    stage,
    setStage,
    accountType,
    setAccountType,
    form,
    focusedField,
    setFocusedField,
    error,
    setError,
    pin,
    setPin,
    walletStep,
    loadingWallet,
    startSignup,
    handleBack,
    handleChangeField,
    handleCreateAccount,
    handlePinDigit,
    activeUsername,
  };
};
