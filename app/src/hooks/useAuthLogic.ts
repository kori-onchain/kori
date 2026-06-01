import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import {
  useEmbeddedSolanaWallet,
  useLoginWithEmail,
  useLoginWithOAuth,
  usePrivy,
} from "@privy-io/expo";
import { INITIAL_AUTH_FORM } from "@constants/authConstants";
import { AuthForm, AuthStage, AccountType, AuthUserData } from "@type/auth";
import { apiClient, setActiveAccountContext } from "@/lib/apiClient";
import {
  cleanUsername,
  resolveSignupData,
  validateAuthDetails,
} from "@/utils/authUtils";

interface UseAuthLogicParams {
  onAuthSuccess: (userData: AuthUserData, isSignup: boolean) => void;
  initialAccountType?: AccountType;
  initialStage?: AuthStage;
  existingPrivyUser?: { id: string; email: string } | null;
  onCancel?: () => void;
}

type BackendAccount = {
  name: string;
  email: string;
  username: string;
  accountType: AccountType;
  businessName?: string;
  store?: { name?: string; username?: string; category?: string } | null;
};

type UsernameAvailability =
  | "idle"
  | "checking"
  | "available"
  | "unavailable"
  | "error";

const usernameFromEmail = (email: string) => {
  const base = cleanUsername(email.split("@")[0] || "");
  return base.length >= 3 ? base : "user";
};

const initialFormFor = (
  accountType: AccountType,
  email = "",
  fallbackName = "",
): AuthForm => {
  const base = usernameFromEmail(email);
  return {
    ...INITIAL_AUTH_FORM,
    email,
    name: accountType === "PF" ? "" : fallbackName,
    username: accountType === "PF" ? base : "",
    storeUsername: accountType === "PJ" ? `${base}.store` : "",
  };
};

export const useAuthLogic = ({
  onAuthSuccess,
  initialAccountType = "PF",
  initialStage = "welcome",
  existingPrivyUser = null,
  onCancel,
}: UseAuthLogicParams) => {
  const [stage, setStage] = useState<AuthStage>(initialStage);
  const [accountType, setAccountType] = useState<AccountType>(initialAccountType);
  const [form, setForm] = useState<AuthForm>(() =>
    initialFormFor(initialAccountType, existingPrivyUser?.email || ""),
  );
  const [focusedField, setFocusedField] = useState<keyof AuthForm | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletStep, setWalletStep] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [loadingOAuth, setLoadingOAuth] = useState(false);
  const [pendingPrivyUser, setPendingPrivyUser] = useState<{
    id: string;
    email: string;
  } | null>(existingPrivyUser);
  const [usernameAvailability, setUsernameAvailability] =
    useState<UsernameAvailability>("idle");

  const { login: loginWithOAuth } = useLoginWithOAuth();
  const { sendCode, loginWithCode, state: otpState } = useLoginWithEmail();
  const { user: privyUser, logout } = usePrivy();
  const { wallets, create } = useEmbeddedSolanaWallet();

  const activeUsername =
    accountType === "PF" ? form.username : form.storeUsername;

  const usernamePlaceholder = useMemo(() => {
    const base = usernameFromEmail(form.email);
    return accountType === "PJ" ? `${base}.store` : base;
  }, [accountType, form.email]);

  useEffect(() => {
    if (!existingPrivyUser) return;
    setPendingPrivyUser(existingPrivyUser);
    setAccountType(initialAccountType);
    setStage(initialStage);
    setForm(initialFormFor(initialAccountType, existingPrivyUser.email));
  }, [existingPrivyUser, initialAccountType, initialStage]);

  useEffect(() => {
    const username = activeUsername.trim();
    if (stage !== "details" || username.length < 3) {
      setUsernameAvailability("idle");
      return;
    }

    let cancelled = false;
    setUsernameAvailability("checking");

    const timeout = setTimeout(async () => {
      try {
        const res = await apiClient.get<{ available: boolean }>(
          `/users/check-username/${username}`,
        );
        if (!cancelled) {
          setUsernameAvailability(res.available ? "available" : "unavailable");
        }
      } catch (e) {
        if (!cancelled) {
          setUsernameAvailability("error");
          console.error("[useAuthLogic] Check username failed:", e);
        }
      }
    }, 450);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [activeUsername, stage]);

  const isAlreadyLoggedInError = (err: any) => {
    const message = String(err?.message || err || "").toLowerCase();
    return (
      message.includes("already logged in") ||
      message.includes("uselinkwithemail") ||
      message.includes("use link with email")
    );
  };

  const getPrivyEmail = (user: any) => {
    const linkedAccounts = (user?.linked_accounts as any[]) || [];
    const account = linkedAccounts.find(
      (item) =>
        item.type === "email" ||
        item.type === "google_oauth" ||
        item.type === "apple_oauth",
    );
    return (account?.email ?? account?.address ?? "").trim().toLowerCase();
  };

  const prepareNewAccount = (
    privyId: string,
    email: string,
    fallbackName?: string,
    type: AccountType = "PF",
  ) => {
    setPendingPrivyUser({ id: privyId, email });
    setAccountType(type);
    setActiveAccountContext(type);
    setForm(initialFormFor(type, email, fallbackName));
    setError(null);
    setStage("details");
  };

  const continueWithBackendAccount = async (
    privyId: string,
    email: string,
    fallbackName?: string,
  ) => {
    try {
      const accounts = await apiClient.get<BackendAccount[]>("/auth/accounts");
      const profile =
        accounts.find((account) => account.accountType === "PF") || accounts[0];
      if (!profile) throw new Error("No backend profile");

      setActiveAccountContext(profile.accountType);
      onAuthSuccess(
        {
          name: profile.name,
          email: profile.email || email,
          accountType: profile.accountType,
          username: profile.username,
          privyUserId: privyId,
          businessName: profile.store?.name || profile.businessName,
          store: profile.store,
        },
        false,
      );
      return;
    } catch {
      prepareNewAccount(privyId, email, fallbackName, "PF");
    }
  };

  const continueExistingPrivySession = async (fallbackEmail: string) => {
    if (!privyUser) return false;
    const email = getPrivyEmail(privyUser) || fallbackEmail;
    await continueWithBackendAccount(privyUser.id, email);
    return true;
  };

  const handleSendOtp = async () => {
    const email = form.email.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      setError("Digite um e-mail valido.");
      return;
    }

    try {
      setError(null);

      if (privyUser) {
        const activeEmail = getPrivyEmail(privyUser);
        if (!activeEmail || activeEmail === email) {
          await continueExistingPrivySession(email);
          return;
        }
        await logout();
      }

      await sendCode({ email });
      setStage("otp");
    } catch (e: any) {
      if (isAlreadyLoggedInError(e)) {
        const continued = await continueExistingPrivySession(email);
        if (!continued) {
          setError(
            "Sessao Privy ja ativa. Feche e abra o app novamente para recarregar a sessao.",
          );
        }
        return;
      }
      setError(e?.message || "Erro ao enviar codigo.");
    }
  };

  const handleVerifyOtp = async (code: string) => {
    if (otpState.status === "submitting-code") return;
    const email = form.email.trim().toLowerCase();

    try {
      setError(null);
      const user = await loginWithCode({ code });
      if (!user) return;
      await continueWithBackendAccount(user.id, email);
    } catch (e: any) {
      setError(e?.message || "Codigo invalido.");
    }
  };

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    try {
      setLoadingOAuth(true);
      setError(null);

      if (privyUser) {
        await continueExistingPrivySession(form.email.trim().toLowerCase());
        return;
      }

      const user = await loginWithOAuth({
        provider,
        ...(provider === "apple"
          ? { isLegacyAppleIosBehaviorEnabled: Platform.OS !== "ios" }
          : {}),
      });
      if (!user) return;

      const linkedAccounts = (user.linked_accounts as any[]) || [];
      const oauthAccount = linkedAccounts.find(
        (item) => item.type === `${provider}_oauth`,
      );
      const email = (oauthAccount?.email ?? "").trim().toLowerCase();
      const name = oauthAccount?.name ?? "";

      await continueWithBackendAccount(user.id, email, name);
    } catch (e: any) {
      if (isAlreadyLoggedInError(e)) {
        const continued = await continueExistingPrivySession(
          form.email.trim().toLowerCase(),
        );
        if (!continued) {
          setError(
            "Sessao Privy ja ativa. Feche e abra o app novamente para recarregar a sessao.",
          );
        }
        return;
      }
      setError(e?.message || `Erro ao entrar com ${provider}.`);
    } finally {
      setLoadingOAuth(false);
    }
  };

  const handleCreateAccount = async () => {
    const validation = validateAuthDetails(form, accountType);
    if (validation) {
      setError(validation);
      return;
    }

    if (usernameAvailability !== "available") {
      setError(
        usernameAvailability === "checking"
          ? "Aguarde a verificacao do username."
          : "Escolha um username disponivel para continuar.",
      );
      return;
    }

    setError(null);
    setStage("wallet");
  };

  useEffect(() => {
    if (stage === "wallet") {
      handleWalletStage();
    }
  }, [stage]);

  const handleWalletStage = async () => {
    if (!pendingPrivyUser) return;
    setLoadingWallet(true);
    setWalletStep(0);

    const signupData = resolveSignupData(
      form,
      accountType,
      pendingPrivyUser.id,
      pendingPrivyUser.email,
    );

    setTimeout(() => setWalletStep(1), 450);
    setTimeout(() => setWalletStep(2), 950);
    setTimeout(() => setWalletStep(3), 1450);

    try {
      const targetIndex = accountType === "PJ" ? 1 : 0;
      setActiveAccountContext(accountType);

      let walletAddress = wallets?.[targetIndex]?.address ?? null;
      if (!walletAddress) {
        try {
          const newWallet =
            targetIndex === 1
              ? await (create as any)?.({
                  recoveryMethod: "privy",
                  createAdditional: true,
                })
              : await (create as any)?.({ recoveryMethod: "privy" });
          walletAddress =
            newWallet?.address ||
            newWallet?.publicKey?.toString?.() ||
            newWallet?._publicKey?.toString?.() ||
            null;
        } catch (walletErr) {
          console.warn("Privy wallet creation skipped/failed:", walletErr);
        }
      }

      await apiClient.post("/auth/sync", {
        name: signupData.name,
        email: signupData.email,
        username: signupData.username,
        accountType: signupData.accountType,
        storeName: accountType === "PJ" ? form.storeName : undefined,
        businessName: signupData.businessName,
        category: accountType === "PJ" ? form.category : null,
        walletAddress,
        walletIndex: targetIndex,
      });
    } catch (e: any) {
      console.warn("Backend sync failed:", e?.message);
    }

    setTimeout(() => {
      setLoadingWallet(false);
      onAuthSuccess(signupData, true);
    }, 2100);
  };

  const handleBack = () => {
    setError(null);
    if (stage === "details" && existingPrivyUser && onCancel) {
      onCancel();
      return;
    }
    const backMap: Partial<Record<AuthStage, AuthStage>> = {
      email: "welcome",
      otp: "email",
      accountType: "welcome",
      details: "welcome",
    };
    const prev = backMap[stage];
    if (prev) setStage(prev);
  };

  const handleChangeField = (field: keyof AuthForm, value: string) => {
    const next = field.toLowerCase().includes("username")
      ? cleanUsername(value)
      : value;

    setForm((prev) => ({ ...prev, [field]: next }));
    setError(null);
  };

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
    walletStep,
    loadingWallet,
    loadingOAuth,
    otpState,
    usernameAvailability,
    usernamePlaceholder,
    handleBack,
    handleChangeField,
    handleSendOtp,
    handleVerifyOtp,
    handleOAuthLogin,
    handleCreateAccount,
    handleWalletStage,
    activeUsername,
  };
};
