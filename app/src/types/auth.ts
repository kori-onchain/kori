export type AccountType = "PF" | "PJ";

export type AuthStage = "welcome" | "login" | "pin" | "accountType" | "details" | "wallet";

export type AuthUserData = {
  name: string;
  email: string;
  accountType: AccountType;
  username: string;
  supabaseId?: string;
  businessName?: string;
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
