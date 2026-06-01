import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";
import { PaymentIntent, PaymentScreen } from "@type/payment";
import { useContacts } from "@hooks/useContacts";
import { useModals } from "@hooks/useModals";
import { useCards } from "@hooks/useCards";
import { useTransactions } from "@hooks/useTransactions";
import { useAccountSwitcher } from "./useAccountSwitcher";
import { KoraCurrency, KoraLedgerAccount, koraApi, normalizeApiError } from "@/lib/koraApi";

interface UseHomeLogicParams {
  username?: string;
  accountType?: "PF" | "PJ";
}

export const useHomeLogic = ({ username, accountType }: UseHomeLogicParams) => {
  const { contacts, addContact } = useContacts();
  const { modals, open, close } = useModals();
  const {
    cards,
    currentInvoice,
    currentInvoices,
    cardsLoading,
    cardsError,
    onchainStatus,
    toggleFreeze,
    toggleOnline,
    updateLimit,
    regenerateVirtual,
    payCurrentInvoice,
  } = useCards();
  const { transactions, addTransaction } = useTransactions();
  const { activeWallet } = useAccountSwitcher(accountType);
  const [balanceValue, setBalanceValue] = useState(0);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("inicio");
  const [sendIntent, setSendIntent] = useState<Partial<PaymentIntent>>({});
  const [sendInitialScreen, setSendInitialScreen] =
    useState<PaymentScreen>("scan");
  const [identity, setIdentity] = useState<"userId" | "wallet">("userId");
  const [dontShowWalletAlert, setDontShowWalletAlert] = useState(false);
  const [dontShowUserIdAlert, setDontShowUserIdAlert] = useState(false);
  const [pendingIdentity, setPendingIdentity] = useState<
    "userId" | "wallet" | null
  >(null);
  const [isNoticeVisible, setIsNoticeVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (accountType === "PJ") {
      setIdentity("userId");
    }
  }, [accountType]);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) => {
        if (mounted) setReduceMotion(enabled);
      },
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const wantedType = accountType === "PJ" ? "MERCHANT_BALANCE" : "USER_BALANCE";
    const usdcBrlRate = Number(process.env.EXPO_PUBLIC_USDC_BRL_RATE || 5);

    const toBrlCents = (account: KoraLedgerAccount) => {
      const rates: Partial<Record<KoraCurrency, number>> = {
        BRL: 1,
        USDC: usdcBrlRate,
        USD: Number(process.env.EXPO_PUBLIC_USD_BRL_RATE || process.env.EXPO_PUBLIC_USDC_BRL_RATE || 5),
        EUR: Number(process.env.EXPO_PUBLIC_EUR_BRL_RATE || 5.4),
        SOL: Number(process.env.EXPO_PUBLIC_SOL_BRL_RATE || 0),
      };
      return Math.round(account.balanceCents * (rates[account.currency] ?? 0));
    };

    const loadLedgerBalance = async () => {
      const accounts = await koraApi.ledger.entries();
      const visibleAccounts = accounts.filter((account) => account.type === wantedType);
      const fallbackAccounts = accounts.filter((account) =>
        account.type === "USER_BALANCE" || account.type === "MERCHANT_BALANCE",
      );
      const source = visibleAccounts.length ? visibleAccounts : fallbackAccounts;
      return source.reduce((sum, account) => sum + toBrlCents(account), 0);
    };

    const loadBalance = async () => {
      try {
        const totalBrlCents = await loadLedgerBalance();

        if (mounted) {
          setBalanceValue(totalBrlCents / 100);
          setBalanceError(null);
        }
      } catch (err) {
        try {
          const totalBrlCents = await loadLedgerBalance();
          if (mounted) {
            setBalanceValue(totalBrlCents / 100);
            setBalanceError(normalizeApiError(err).message);
          }
        } catch (fallbackErr) {
          if (mounted) setBalanceError(normalizeApiError(fallbackErr).message);
        }
      }
    };

    loadBalance();

    return () => {
      mounted = false;
    };
  }, [accountType]);

  const handleSelectIdentity = (nextId: "userId" | "wallet") => {
    if (nextId === identity) return;
    const skip =
      nextId === "wallet" ? dontShowWalletAlert : dontShowUserIdAlert;
    if (skip) {
      setIdentity(nextId);
    } else {
      setPendingIdentity(nextId);
      setIsNoticeVisible(true);
    }
  };

  const handleConfirmNotice = (dontShowAgain: boolean) => {
    if (pendingIdentity) {
      setIdentity(pendingIdentity);
      if (dontShowAgain) {
        if (pendingIdentity === "wallet") {
          setDontShowWalletAlert(true);
        } else {
          setDontShowUserIdAlert(true);
        }
      }
    }
    setIsNoticeVisible(false);
    setPendingIdentity(null);
  };

  const handleCancelNotice = () => {
    setIsNoticeVisible(false);
    setPendingIdentity(null);
  };

  const handleContactPress = (contact: any) => {
    setSendIntent({
      recipient: {
        type: "id",
        displayName: contact.name || contact.walletId.replace("@", ""),
        userId: contact.walletId,
        isAnonymous: false,
        isFavorite: contact.isFavorite,
        id: contact.id,
      },
      currency: "BRL",
    });
    setSendInitialScreen("amount");
    open("sendPayment");
  };

  const handleScanPress = () => {
    setSendIntent({});
    setSendInitialScreen("scan");
    open("sendPayment");
  };

  const handleSendManualPress = () => {
    setSendIntent({});
    setSendInitialScreen("manual");
    open("sendPayment");
  };

  const walletHashFull = activeWallet?.address || "7nxB2xT8aYqP9mZ1cR5vW4kL3jH6fD9gS8xV1nC4X1a";
  const walletHashShort = activeWallet?.address
    ? `${activeWallet.address.slice(0, 4)}...${activeWallet.address.slice(-4)}`
    : "7nxB...4X1a";
  const userHandle = username ? `@${username}` : "@opedrooz";
  const formattedBalance = balanceValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
  const [balanceInteger = "R$ 0", balanceDecimals = ",00"] =
    formattedBalance.split(",");

  const handleInvoicePaid = async (invoiceId?: string) => {
    const payment = await payCurrentInvoice(invoiceId);
    const amountCents =
      payment && "amountCents" in payment ? payment.amountCents : undefined;
    if (amountCents) {
      setBalanceValue((prev) => prev - amountCents / 100);
    }
    return payment;
  };

  const handleInvestmentDebited = (amountCents: number) => {
    setBalanceValue((prev) => prev - amountCents / 100);
  };

  const handleAdvanceCredited = ({
    amount,
    formattedAmount,
    protocol,
  }: {
    amount: number;
    formattedAmount: string;
    protocol: string;
  }) => {
    setBalanceValue((prev) => prev + amount);
    addTransaction({
      title: "Antecipação de recebíveis",
      type: protocol,
      amount: `+${formattedAmount}`,
      amountColor: "#34C759",
      subAmount: "Creditado agora",
      subAmountColor: "#8E8E93",
      isAvatar: false,
    });
  };

  return {
    contacts,
    addContact,
    modals,
    open,
    close,
    cards,
    currentInvoice,
    currentInvoices,
    cardsLoading,
    cardsError,
    onchainStatus,
    toggleFreeze,
    toggleOnline,
    updateLimit,
    regenerateVirtual,
    payCurrentInvoice: handleInvoicePaid,
    transactions,
    activeTab,
    setActiveTab,
    sendIntent,
    sendInitialScreen,
    identity,
    pendingIdentity,
    isNoticeVisible,
    setIsNoticeVisible,
    reduceMotion,
    handleSelectIdentity,
    handleConfirmNotice,
    handleCancelNotice,
    handleContactPress,
    handleScanPress,
    handleSendManualPress,
    walletHashFull,
    walletHashShort,
    userHandle,
    balanceInteger,
    balanceDecimals: `,${balanceDecimals}`,
    balanceError,
    handleInvestmentDebited,
    handleAdvanceCredited,
  };
};
