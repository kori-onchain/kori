import { usePrivy } from "@privy-io/expo";

export function useAuth() {
  const { user, isReady, logout } = usePrivy();

  const linkedAccounts = (user?.linked_accounts as any[]) || [];
  const emailAccount = linkedAccounts.find(
    (a) => a.type === "email" || a.type === "google_oauth" || a.type === "apple_oauth"
  );
  const email = emailAccount?.email ?? emailAccount?.address ?? "";

  const session = user
    ? {
        user: {
          id: user.id,
          email: email,
        },
      }
    : null;

  return {
    session,
    loading: !isReady,
    isAuthenticated: !!user,
    logout,
  };
}
