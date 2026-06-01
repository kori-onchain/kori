export type AccountType = "PF" | "PJ";

export type AuthStage =
  | "welcome"
  | "email"       // digitar e-mail para OTP
  | "otp"         // digitar código recebido
  | "accountType"
  | "details"
  | "wallet";

export type AuthUserData = {
  name: string;
  email: string;
  accountType: AccountType;
  username: string;
  privyUserId: string;
  businessName?: string;
  store?: { id?: string; name?: string; username?: string; category?: string } | null;
  category?: string;
};

export type AuthForm = {
  email: string;
  password: string;
  name: string;
  username: string;
  storeName: string;
  storeUsername: string;
  category: string;
};
