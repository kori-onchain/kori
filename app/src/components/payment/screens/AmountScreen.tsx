import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "../../../icons";
import { PaymentRecipient } from "../../../types/payment";
import { useTheme } from "../../../theme/ThemeProvider";
import {
  formatPaymentAmount,
  getRecipientId,
  PaymentCard,
  PaymentPrimaryButton,
  PaymentScreenFrame,
  RecipientAvatar,
} from "../PaymentDS";
import { fonts } from "../../../theme/tokens";

interface AmountScreenProps {
  recipient: PaymentRecipient;
  onContinue: (amount: string) => void;
  onBack: () => void;
  onClose: () => void;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

export const AmountScreen: React.FC<AmountScreenProps> = ({
  recipient,
  onContinue,
  onBack,
  onClose,
}) => {
  const { t } = useTheme();
  const [raw, setRaw] = useState("");
  const amount = raw || "0";
  const isZero = Number.parseFloat(amount.replace(",", ".")) === 0 || !raw;

  const handleKey = (key: string) => {
    if (key === "⌫") {
      setRaw((prev) => prev.slice(0, -1));
      return;
    }
    if (key === "." && raw.includes(".")) return;
    if (raw.length >= 10) return;
    setRaw((prev) => prev + key);
  };

  return (
    <PaymentScreenFrame
      title="Quanto enviar?"
      onBack={onBack}
      onClose={onClose}
      footer={
        <PaymentPrimaryButton
          label="Continuar"
          disabled={isZero}
          onPress={() => onContinue(amount)}
          icon={<Feather name="arrow-right" size={16} color={t.btnPrimaryFg} />}
        />
      }
    >
      <PaymentCard style={styles.recipientCard} padding={12}>
        <View style={styles.recipientRow}>
          <RecipientAvatar recipient={recipient} size={38} />
          <View style={styles.recipientText}>
            <Text style={[styles.toLabel, { color: t.inkMute }]}>Para</Text>
            <Text
              style={[styles.recipientName, { color: t.ink }]}
              numberOfLines={1}
            >
              {recipient.displayName}
            </Text>
          </View>
          <Text
            style={[styles.recipientId, { color: t.inkMute }]}
            numberOfLines={1}
          >
            {getRecipientId(recipient)}
          </Text>
        </View>
      </PaymentCard>

      <View style={styles.amountArea}>
        <Text style={[styles.amount, { color: isZero ? t.inkFaint : t.ink }]}>
          {formatPaymentAmount(raw)}
        </Text>
      </View>

      <View style={styles.keypad}>
        {KEYS.map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.key,
              {
                backgroundColor: key === "⌫" ? t.bgElev : t.bg2,
                borderColor: t.cardBorder,
              },
            ]}
            onPress={() => handleKey(key)}
            activeOpacity={0.7}
          >
            {key === "⌫" ? (
              <Feather name="delete" size={22} color={t.ink} />
            ) : (
              <Text style={[styles.keyText, { color: t.ink }]}>{key}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </PaymentScreenFrame>
  );
};

const styles = StyleSheet.create({
  recipientCard: {
    alignSelf: "center",
    width: "100%",
  },
  recipientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  recipientText: {
    flex: 1,
  },
  toLabel: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  recipientName: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    fontWeight: "700",
  },
  recipientId: {
    maxWidth: 92,
    fontFamily: fonts.mono.medium,
    fontSize: 10,
  },
  amountArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  amount: {
    fontFamily: fonts.sans.bold,
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: -1.2,
    textAlign: "center",
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    paddingBottom: 4,
  },
  key: {
    width: "31.8%",
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 22,
    fontWeight: "700",
  },
});
