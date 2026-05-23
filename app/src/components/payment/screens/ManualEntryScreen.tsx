import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "../../../icons";
import { MOCK_CONTACTS } from "../../../data/contacts";
import { PaymentRecipient } from "../../../types/payment";
import { useTheme } from "../../../theme/ThemeProvider";
import {
  PaymentCard,
  PaymentPrimaryButton,
  PaymentScreenFrame,
} from "../PaymentDS";
import { fonts } from "../../../theme/tokens";

const WALLET_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

interface ManualEntryScreenProps {
  onContinue: (recipient: PaymentRecipient) => void;
  onBack: () => void;
  onClose: () => void;
}

const resolveRecipient = (raw: string): PaymentRecipient | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (WALLET_REGEX.test(trimmed)) {
    return {
      type: "wallet",
      displayName: "Anônimo",
      walletAddress: trimmed,
      isAnonymous: true,
      isFavorite: false,
    };
  }

  const handle = trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
  const contact = MOCK_CONTACTS.find((c) => c.walletId === handle);

  return {
    type: "id",
    displayName: contact?.name ?? trimmed.replace("@", ""),
    userId: handle,
    isAnonymous: false,
    isFavorite: contact?.isFavorite ?? false,
  };
};

export const ManualEntryScreen: React.FC<ManualEntryScreenProps> = ({
  onContinue,
  onBack,
  onClose,
}) => {
  const { t } = useTheme();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const isWallet = WALLET_REGEX.test(value.trim());
  const isEmpty = value.trim().length === 0;

  const handleContinue = () => {
    const recipient = resolveRecipient(value);
    if (!recipient) {
      setError("Digite um ID válido ou endereço de carteira.");
      return;
    }
    setError("");
    onContinue(recipient);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <PaymentScreenFrame
        title="Enviar para"
        onBack={onBack}
        onClose={onClose}
        footer={
          <PaymentPrimaryButton
            label="Continuar"
            onPress={handleContinue}
            disabled={isEmpty}
            icon={
              <Feather name="arrow-right" size={16} color={t.btnPrimaryFg} />
            }
          />
        }
      >
        <Text style={[styles.label, { color: t.inkMute }]}>ID ou carteira</Text>
        <PaymentCard padding={14}>
          <View style={styles.inputRow}>
            <Feather
              name={isWallet ? "shield" : "at-sign"}
              size={18}
              color={isWallet ? t.sol : t.orange}
            />
            <TextInput
              style={[styles.input, { color: t.ink }]}
              placeholder="@usuario ou endereço da carteira"
              placeholderTextColor={t.inkMute}
              value={value}
              onChangeText={(next) => {
                setValue(next);
                setError("");
              }}
              autoCorrect={false}
              autoCapitalize="none"
              autoFocus
            />
            {value.length > 0 ? (
              <TouchableOpacity onPress={() => setValue("")} hitSlop={12}>
                <Feather name="x-circle" size={18} color={t.inkMute} />
              </TouchableOpacity>
            ) : null}
          </View>
        </PaymentCard>

        {error ? (
          <Text style={[styles.error, { color: t.orange }]}>{error}</Text>
        ) : null}

        {!isEmpty ? (
          <View
            style={[
              styles.pill,
              { backgroundColor: t.bg2, borderColor: t.cardBorder },
            ]}
          >
            <Feather
              name={isWallet ? "shield" : "at-sign"}
              size={13}
              color={isWallet ? t.sol : t.orange}
            />
            <Text
              style={[styles.pillText, { color: isWallet ? t.sol : t.orange }]}
            >
              {isWallet ? "Carteira anônima" : "ID Kora"}
            </Text>
          </View>
        ) : null}

        {isWallet ? (
          <PaymentCard style={styles.note} padding={14}>
            <View style={styles.noteRow}>
              <Feather name="eye-off" size={15} color={t.inkMute} />
              <Text style={[styles.noteText, { color: t.inkMute }]}>
                Nenhum dado de identidade será exposto nessa transferência.
              </Text>
            </View>
          </PaymentCard>
        ) : null}
      </PaymentScreenFrame>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.mono.semibold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    fontFamily: fonts.sans.medium,
    fontSize: 16,
    paddingVertical: 4,
  },
  error: {
    marginTop: 10,
    fontFamily: fonts.sans.medium,
    fontSize: 12,
  },
  pill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginTop: 14,
  },
  pillText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 12,
  },
  note: {
    marginTop: 16,
  },
  noteRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  noteText: {
    flex: 1,
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    lineHeight: 18,
  },
});
