import { useState, useEffect } from "react";
import { useEmbeddedSolanaWallet } from "@privy-io/expo";
import { setActiveAccountContext, setWalletIndexGetter } from "@/lib/apiClient";

export const useAccountSwitcher = (accountType?: "PF" | "PJ") => {
  const desiredIndex = accountType === "PJ" ? 1 : 0;
  const [activeWalletIndex, setActiveWalletIndex] = useState<number>(desiredIndex);
  const { wallets, create } = useEmbeddedSolanaWallet();
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  useEffect(() => {
    setWalletIndexGetter(() => activeWalletIndex);
  }, [activeWalletIndex]);

  useEffect(() => {
    if (accountType) {
      setActiveWalletIndex(desiredIndex);
      setActiveAccountContext(accountType);
    }
  }, [accountType, desiredIndex]);

  const switchAccount = async (targetIndex: number): Promise<string> => {
    if (targetIndex === 1 && (!wallets || wallets.length < 2)) {
      setIsCreatingWallet(true);
      try {
        console.log("[useAccountSwitcher] Deriving index 1 wallet using Privy...");
        const newWallet = await (create as any)?.({
          recoveryMethod: "privy",
          createAdditional: true,
        });
        const address =
          newWallet?.address ||
          newWallet?.publicKey?.toString?.() ||
          newWallet?._publicKey?.toString?.() ||
          "";
        console.log("[useAccountSwitcher] Derived wallet:", address);
        setActiveWalletIndex(1);
        setActiveAccountContext("PJ");
        setIsCreatingWallet(false);
        return address;
      } catch (err) {
        setIsCreatingWallet(false);
        console.error("[useAccountSwitcher] Failed to derive second wallet:", err);
        throw err;
      }
    }

    setActiveWalletIndex(targetIndex);
    setActiveAccountContext(targetIndex === 1 ? "PJ" : "PF");
    const wallet = wallets && wallets[targetIndex];
    return wallet?.address || "";
  };

  const activeWallet = wallets ? wallets[activeWalletIndex] : null;

  return {
    activeWalletIndex,
    activeWallet,
    allWallets: wallets || [],
    switchAccount,
    isCreatingWallet,
  };
};
