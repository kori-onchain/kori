import { AuthForm, AuthUserData } from "../../../types";

export const RETURNING_USER: AuthUserData = {
  name: "Kauã",
  email: "kaua@kori.app",
  username: "kc1t",
  accountType: "PF",
};

export const INITIAL_AUTH_FORM: AuthForm = {
  email: "",
  name: "",
  username: "",
  storeName: "",
  storeUsername: "",
  category: "Design & Digital",
};

export const WALLET_ADDRESS_PREVIEW = "7xKj...9aBc";
export const WALLET_GENERATION_STEPS = [
  "Inicializando chaves criptográficas...",
  "Criando chave privada no dispositivo...",
  "Gerando endereço público na Solana...",
  "Carteira criada com sucesso!",
];
