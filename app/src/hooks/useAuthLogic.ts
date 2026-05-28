import { useEffect, useState } from "react";
import { AuthStage, AccountType, AuthForm, AuthUserData } from "@type/auth";
import { INITIAL_AUTH_FORM } from "@constants/authConstants";
import {
  cleanUsername,
  resolveSignupData,
  validateAuthDetails,
} from "@/utils/authUtils";
import {
  signUpWithEmail,
  signInWithEmail,
  resendSignupEmail,
  updateProfile,
  getProfile,
  getSession,
} from "@/lib/authService";
import { verifyPin } from "@/lib/pinService";
import { MOCK_AUTH, MOCK_SESSION } from "@constants/devConfig";

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
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingResendEmail, setLoadingResendEmail] = useState(false);

  useEffect(() => {
    if (stage !== "wallet") return;

    setLoadingWallet(true);
    setWalletStep(0);

    const signupData = resolveSignupData(form, accountType);

    if (MOCK_AUTH) {
      const timers = [
        setTimeout(() => setWalletStep(1), 450),
        setTimeout(() => setWalletStep(2), 950),
        setTimeout(() => setWalletStep(3), 1450),
        setTimeout(() => {
          setLoadingWallet(false);
          onAuthSuccess(signupData, true);
        }, 2100),
      ];
      return () => timers.forEach(clearTimeout);
    }

    const doSignup = async () => {
      const { data, error: signupError } = await signUpWithEmail(
        form.email.trim().toLowerCase(),
        form.password,
        {
          name: signupData.name,
          username: signupData.username,
          account_type: signupData.accountType,
          business_name: signupData.businessName,
        },
      );

      if (signupError || !data.user) {
        setLoadingWallet(false);
        setError(signupError?.message || "Erro ao criar conta.");
        setStage("details");
        return;
      }

      const userId = data.user.id;

      if (!data.session) {
        setLoadingWallet(false);
        setStage("confirmEmail");
        return;
      }

      const { error: profileError } = await updateProfile(userId, {
        name: signupData.name,
        username: signupData.username,
        account_type: signupData.accountType,
        business_name: signupData.businessName,
      });

      if (profileError) {
        setLoadingWallet(false);
        setError(profileError.message || "Erro ao atualizar perfil.");
        setStage("details");
        return;
      }

      setWalletStep(1);
      setTimeout(() => setWalletStep(2), 500);
      setTimeout(() => setWalletStep(3), 1000);
      setTimeout(() => {
        setLoadingWallet(false);
        onAuthSuccess(
          { ...signupData, supabaseId: userId },
          true,
        );
      }, 1600);
    };

    doSignup();
  }, [stage === "wallet"]);

  const startSignup = (emailSeed?: string) => {
    setForm((prev) => ({ ...prev, email: prev.email || emailSeed || "" }));
    setError(null);
    setStage("accountType");
  };

  const startLogin = () => {
    setError(null);
    setStage("login");
  };

  const handleBack = () => {
    setError(null);

    if (stage === "pin") {
      setPin([]);
      setStage("welcome");
      return;
    }

    if (stage === "login") {
      setStage("welcome");
      return;
    }

    if (stage === "accountType") {
      setStage("welcome");
      return;
    }

    if (stage === "details") {
      setStage("accountType");
      return;
    }

    if (stage === "confirmEmail") {
      setStage("details");
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

  const handleLogin = async () => {
    if (!form.email.trim()) {
      setError("O e-mail é obrigatório.");
      return;
    }
    if (!form.password.trim()) {
      setError("A senha é obrigatória.");
      return;
    }

    setLoadingLogin(true);
    setError(null);

    if (MOCK_AUTH) {
      setTimeout(() => {
        setLoadingLogin(false);
        onAuthSuccess(
          {
            name: MOCK_SESSION.name,
            email: form.email.trim().toLowerCase() || MOCK_SESSION.email,
            accountType: MOCK_SESSION.accountType,
            username: MOCK_SESSION.username,
            businessName: MOCK_SESSION.businessName,
          },
          false,
        );
      }, 600);
      return;
    }

    const { data, error: loginError } = await signInWithEmail(
      form.email.trim().toLowerCase(),
      form.password,
    );

    if (loginError || !data.user) {
      setLoadingLogin(false);
      setError(loginError?.message === "Invalid login credentials"
        ? "E-mail ou senha incorretos."
        : loginError?.message || "Erro ao entrar.");
      return;
    }

    const { data: profile, error: profileError } = await getProfile(data.user.id);

    if (profileError) {
      setLoadingLogin(false);
      setError("Conta acessada, mas não foi possível carregar o perfil.");
      return;
    }

    setLoadingLogin(false);

    onAuthSuccess(
      {
        name: profile?.name || data.user.email?.split("@")[0] || "Usuário",
        email: data.user.email || "",
        accountType: (profile?.account_type as AccountType) || "PF",
        username: profile?.username || data.user.email?.split("@")[0] || "user",
        supabaseId: data.user.id,
        businessName: profile?.business_name || undefined,
      },
      false,
    );
  };

  const handleResendConfirmationEmail = async () => {
    const email = form.email.trim().toLowerCase();
    if (!email) {
      setError("Informe o e-mail para reenviar a confirmação.");
      return;
    }

    setLoadingResendEmail(true);
    setError(null);

    const { error: resendError } = await resendSignupEmail(email);
    setLoadingResendEmail(false);

    if (resendError) {
      setError(resendError.message || "Erro ao reenviar confirmação.");
    }
  };

  const handlePinDigit = (digit: string) => {
    if (pin.length >= 5) return;

    const next = [...pin, digit];
    setPin(next);

    if (next.length === 5) {
      const pinStr = next.join("");

      if (MOCK_AUTH) {
        setTimeout(() => {
          onAuthSuccess(
            {
              name: MOCK_SESSION.name,
              email: MOCK_SESSION.email,
              accountType: MOCK_SESSION.accountType,
              username: MOCK_SESSION.username,
            },
            false,
          );
        }, 250);
        return;
      }

      (async () => {
        const valid = await verifyPin(pinStr);
        if (!valid) {
          setError("PIN incorreto.");
          setPin([]);
          return;
        }

        const { data } = await getSession();
        if (!data.session?.user) {
          setError("Sessão expirada. Faça login novamente.");
          setPin([]);
          setStage("login");
          return;
        }

        const { data: profile, error: profileError } = await getProfile(data.session.user.id);

        if (profileError) {
          setError("Sessão ativa, mas não foi possível carregar o perfil.");
          setPin([]);
          setStage("login");
          return;
        }

        onAuthSuccess(
          {
            name: profile?.name || data.session.user.email?.split("@")[0] || "Usuário",
            email: data.session.user.email || "",
            accountType: (profile?.account_type as AccountType) || "PF",
            username: profile?.username || "user",
            supabaseId: data.session.user.id,
            businessName: profile?.business_name || undefined,
          },
          false,
        );
      })();
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
    loadingLogin,
    loadingResendEmail,
    startSignup,
    startLogin,
    handleBack,
    handleChangeField,
    handleCreateAccount,
    handleLogin,
    handleResendConfirmationEmail,
    handlePinDigit,
    activeUsername,
  };
};
