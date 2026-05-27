import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";
import { PaymentIntent, PaymentScreen } from "@type/payment";
import { useContacts } from "@hooks/useContacts";
import { useModals } from "@hooks/useModals";
import { useCards } from "@hooks/useCards";
import { useTransactions } from "@hooks/useTransactions";

interface UseHomeLogicParams {
  username?: string;
  accountType?: "PF" | "PJ";
}

export const useHomeLogic = ({ username, accountType }: UseHomeLogicParams) => {
  const { contacts, addContact } = useContacts();
  const { modals, open, close } = useModals();
  const { cards, toggleFreeze } = useCards();
  const { transactions } = useTransactions();

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

  const walletHashFull = "7nxB2xT8aYqP9mZ1cR5vW4kL3jH6fD9gS8xV1nC4X1a";
  const walletHashShort = "7nxB...4X1a";
  const userHandle = username ? `@${username}` : "@opedrooz";

  return {
    contacts,
    addContact,
    modals,
    open,
    close,
    cards,
    toggleFreeze,
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
  };
};
