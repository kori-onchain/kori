import { AccountType, AuthForm, AuthUserData } from "@type/auth";

export const cleanUsername = (value: string) =>
  value.replace(/[^a-zA-Z0-9._-]/g, "").toLowerCase();

export const validateAuthDetails = (form: AuthForm, accountType: AccountType): string | null => {
  if (accountType === "PF") {
    if (!form.name.trim()) return "O nome é obrigatório.";
    if (!form.username.trim()) return "Escolha seu @username.";
    if (form.username.trim().length < 3)
      return "O username precisa ter pelo menos 3 caracteres.";
    return null;
  }

  if (!form.storeName.trim()) return "Digite o nome da loja.";
  if (!form.storeUsername.trim()) return "Escolha o @ da loja.";
  if (form.storeUsername.trim().length < 3)
    return "O @ da loja precisa ter pelo menos 3 caracteres.";
  return null;
};

export const resolveSignupData = (
  form: AuthForm,
  accountType: AccountType,
  privyUserId: string,
  email: string,
): AuthUserData => {
  const isPF = accountType === "PF";
  const fallbackUsername = isPF ? "usuario" : "loja";
  const name = isPF ? form.name.trim() : form.storeName.trim();
  const username = isPF ? form.username.trim() : form.storeUsername.trim();

  return {
    name: name || (isPF ? "Usuário Kori" : "Loja Kori"),
    email,
    accountType,
    username: username || fallbackUsername,
    privyUserId,
    businessName: isPF ? undefined : form.storeName.trim() || undefined,
    category: isPF ? undefined : form.category || undefined,
  };
};
