import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import {
  PaymentIntent,
  PaymentScreen,
  PaymentRecipient,
} from "../../types/payment";
import { ScanScreen } from "./screens/ScanScreen";
import { ManualEntryScreen } from "./screens/ManualEntryScreen";
import { AmountScreen } from "./screens/AmountScreen";
import { ReviewScreen } from "./screens/ReviewScreen";
import { PayingScreen } from "./screens/PayingScreen";
import { ReceiptScreen } from "./screens/ReceiptScreen";
import { useTheme } from "../../theme/ThemeProvider";

const HandleBar = () => {
  const { t } = useTheme();
  return <View style={[styles.handleBar, { backgroundColor: t.inkFaint }]} />;
};

interface SendModalProps {
  visible: boolean;
  onClose: () => void;
  initialScreen?: PaymentScreen;
  initialIntent?: Partial<PaymentIntent>;
}

export const SendModal: React.FC<SendModalProps> = ({
  visible,
  onClose,
  initialScreen = "scan",
  initialIntent,
}) => {
  const { t } = useTheme();
  const [screen, setScreen] = useState<PaymentScreen>(initialScreen);
  const [intent, setIntent] = useState<Partial<PaymentIntent>>(
    initialIntent || {},
  );

  // Reset state when modal opens/closes
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
      setScreen("review"); // Já tem valor, vai pra revisão
    } else {
      setScreen("amount"); // Falta valor, pede pra digitar
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
            onBack={() => setScreen("scan")}
            onClose={handleClose}
          />
        );
      case "amount":
        if (!intent.recipient) return null;
        return (
          <AmountScreen
            recipient={intent.recipient}
            onContinue={handleAmountResult}
            onBack={() => setScreen("scan")}
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
      transparent
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View
          style={[
            styles.drawer,
            { backgroundColor: t.bg, borderColor: t.line },
          ]}
        >
          <HandleBar />
          {renderScreen()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  drawer: {
    backgroundColor: "#0a0a0a",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    zIndex: 2,
    height: "92%",
    overflow: "hidden",
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#333",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 6,
  },
});
