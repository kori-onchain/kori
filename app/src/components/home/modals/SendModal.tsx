import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
} from "react-native";
import { useEmbeddedSolanaWallet } from "@privy-io/expo";
import {
  PaymentIntent,
  PaymentResult,
  PaymentScreen,
  PaymentRecipient,
} from "@type/payment";
import { ScanScreen } from "@screens/Payment/ScanScreen";
import { ManualEntryScreen } from "@screens/Payment/ManualEntryScreen";
import { AmountScreen } from "@screens/Payment/AmountScreen";
import { ReviewScreen } from "@screens/Payment/ReviewScreen";
import { PayingScreen } from "@screens/Payment/PayingScreen";
import { ReceiptScreen } from "@screens/Payment/ReceiptScreen";

import { useTheme } from "@theme/ThemeProvider";
import { executeSolanaPayment } from "@/lib/solanaPayments";
import { fonts } from "@theme/tokens";

const HandleBar = () => {
  const { t } = useTheme();
  return <View style={[styles.handleBar, { backgroundColor: t.inkFaint }]} />;
};

import { Contact } from "@/data/contacts";

interface SendModalProps {
  visible: boolean;
  onClose: () => void;
  initialScreen?: PaymentScreen;
  initialIntent?: Partial<PaymentIntent>;
  contacts: Contact[];
  onAddContact: (name: string, walletId: string) => void;
  accountType?: "PF" | "PJ";
}

export const SendModal: React.FC<SendModalProps> = ({
  visible,
  onClose,
  initialScreen = "scan",
  initialIntent,
  contacts,
  onAddContact,
  accountType = "PF",
}) => {
  const { t } = useTheme();
  const solanaWallet = useEmbeddedSolanaWallet();
  const [screen, setScreen] = useState<PaymentScreen>(initialScreen);
  const [intent, setIntent] = useState<Partial<PaymentIntent>>(
    initialIntent || {},
  );
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setScreen(initialScreen);
      setIntent(initialIntent || {});
      setPaymentResult(null);
      setPaymentError(null);
    }
  }, [visible, initialScreen, initialIntent]);

  const handleClose = () => {
    onClose();
  };

  const handleScanResult = (recipient: PaymentRecipient, amount?: string) => {
    setIntent({ recipient, amount, currency: "BRL" });
    if (amount) {
      setScreen("review");
    } else {
      setScreen("amount");
    }
  };

  const handleManualResult = (recipient: PaymentRecipient) => {
    setIntent((prev) => ({ ...prev, recipient, currency: "BRL" }));
    setScreen("amount");
  };


  const handleAmountResult = (amount: string) => {
    setIntent((prev) => ({ ...prev, amount }));
    setScreen("review");
  };

  const runPayment = async () => {
    if (!intent.recipient || !intent.amount) {
      throw new Error("Pagamento incompleto.");
    }
    return executeSolanaPayment({
      intent: intent as PaymentIntent,
      walletState: solanaWallet,
      walletIndex: accountType === "PJ" ? 1 : 0,
    });
  };

  const renderScreen = () => {
    switch (screen) {
      case "scan":
        return <ScanScreen onResult={handleScanResult} onClose={handleClose} />;
      case "manual":
        return (
          <ManualEntryScreen
            onContinue={handleManualResult}
            onBack={initialScreen === "manual" ? handleClose : () => setScreen("scan")}
            onClose={handleClose}
            contacts={contacts}
            onAddContact={onAddContact}
          />
        );
      case "amount":
        if (!intent.recipient) return null;
        return (
          <AmountScreen
            recipient={intent.recipient}
            onContinue={handleAmountResult}
            onBack={() => {
              if (initialScreen === "manual") {
                setScreen("manual");
              } else {
                setScreen("scan");
              }
            }}
            onClose={handleClose}
          />
        );
      case "review":
        if (!intent.recipient || !intent.amount) return null;
        return (
          <ReviewScreen
            intent={intent as PaymentIntent}
            onPay={() => setScreen("paying")}
            onBack={() => setScreen("amount")}
            onClose={handleClose}
          />
        );
      case "paying":
        return (
          <>
            <PayingScreen
              paymentTask={runPayment}
              onError={(message) => setPaymentError(message)}
              onComplete={(result) => {
                setPaymentResult(result || null);
                setScreen("receipt");
              }}
            />
            {paymentError ? (
              <View style={[styles.errorToast, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
                <Text style={[styles.errorText, { color: t.ink }]}>
                  {paymentError}
                </Text>
              </View>
            ) : null}
          </>
        );
      case "receipt":
        if (!intent.recipient || !intent.amount) return null;
        return (
          <ReceiptScreen
            intent={intent as PaymentIntent}
            result={paymentResult}
            onDone={handleClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={[styles.drawer, { backgroundColor: t.bg }]}>
        {renderScreen()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
  },
  errorToast: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 34,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  errorText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 12,
    textAlign: "center",
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 6,
  },
});
