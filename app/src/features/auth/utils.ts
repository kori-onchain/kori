import { AccountType, AuthForm, AuthUserData } from "./types";

export const cleanUsername = (value: string) =>
  value.replace(/[^a-zA-Z0-9._-]/g, "").toLowerCase();

export const validateAuthDetails = (form: AuthForm, accountType: AccountType) => {
  if (!form.email.trim()) return "O e-mail é obrigatório.";
  if (!form.email.includes("@") || !form.email.includes(".")) {
    return "Digite um e-mail válido.";
  }

  if (!form.password) return "A senha é obrigatória.";
  if (form.password.length < 6) return "A senha precisa ter pelo menos 6 caracteres.";

  if (accountType === "PF") {
    if (!form.username.trim()) return "Escolha seu @username.";
    if (form.username.trim().length < 3) {
      return "O username precisa ter pelo menos 3 caracteres.";
    }
    return null;
  }

  if (!form.storeName.trim()) return "Digite o nome da loja.";
  if (!form.storeUsername.trim()) return "Escolha o @ da loja.";
  if (form.storeUsername.trim().length < 3) {
    return "O @ da loja precisa ter pelo menos 3 caracteres.";
  }
  return null;
};

export const resolveSignupData = (form: AuthForm, accountType: AccountType): AuthUserData => {
  const isPF = accountType === "PF";
  const fallbackUsername = isPF ? "usuario" : "loja";
  const name = isPF ? form.name.trim() : form.storeName.trim();
  const username = isPF ? form.username.trim() : form.storeUsername.trim();

  return {
    name: name || (isPF ? "Usuário Kori" : "Loja Kori"),
    email: form.email.trim().toLowerCase() || "usuario@kori.app",
    accountType,
    username: username || fallbackUsername,
  };
};
