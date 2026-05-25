export type AccountType = "PF" | "PJ";

export type AuthStage = "welcome" | "login" | "accountType" | "details" | "wallet";

export type AuthUserData = {
  name: string;
  email: string;
  accountType: AccountType;
  username: string;
};

export type AuthForm = {
  email: string;
  name: string;
  username: string;
  password: string;
  storeName: string;
  storeUsername: string;
  category: string;
};
