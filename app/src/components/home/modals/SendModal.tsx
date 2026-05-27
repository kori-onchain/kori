import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { PaymentIntent, PaymentScreen, PaymentRecipient } from "@type/payment";
import { ScanScreen } from "@screens/Payment/ScanScreen";
import { ManualEntryScreen } from "@screens/Payment/ManualEntryScreen";
import { AmountScreen } from "@screens/Payment/AmountScreen";
import { ReviewScreen } from "@screens/Payment/ReviewScreen";
import { PayingScreen } from "@screens/Payment/PayingScreen";
import { ReceiptScreen } from "@screens/Payment/ReceiptScreen";
import { useTheme } from "@theme/ThemeProvider";

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
}

export const SendModal: React.FC<SendModalProps> = ({
  visible,
  onClose,
  initialScreen = "scan",
  initialIntent,
  contacts,
  onAddContact,
}) => {
  const { t } = useTheme();
  const [screen, setScreen] = useState<PaymentScreen>(initialScreen);
  const [intent, setIntent] = useState<Partial<PaymentIntent>>(
    initialIntent || {},
  );

  useEffect(() => {
    if (visible) {
      setScreen(initialScreen);
      setIntent(initialIntent || {});
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
            onBack={initialScreen === "manual" ? () => setScreen("manual") : () => setScreen("scan")}
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
        return <PayingScreen onComplete={() => setScreen("receipt")} />;
      case "receipt":
        if (!intent.recipient || !intent.amount) return null;
        return (
          <ReceiptScreen
            intent={intent as PaymentIntent}
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
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 6,
  },
});
