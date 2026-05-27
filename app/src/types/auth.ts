export type AccountType = "PF" | "PJ";

export type AuthStage = "welcome" | "pin" | "accountType" | "details" | "wallet";

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
  storeName: string;
  storeUsername: string;
  category: string;
};
