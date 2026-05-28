import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Linking from "expo-linking";
import { Feather } from "@/icons";
import { PaymentIntent } from "@type/payment";
import { useTheme } from "@theme/ThemeProvider";
import {
  DetailRow,
  formatPaymentAmount,
  getRecipientId,
  PaymentCard,
  PaymentPrimaryButton,
  PaymentScreenFrame,
  PaymentSecondaryButton,
  RecipientAvatar,
  SectionTitle,
} from "@components/home/modals/PaymentDS";
import { fonts } from "@theme/tokens";

interface ReceiptScreenProps {
  intent: PaymentIntent;
  onDone: () => void;
}

export const ReceiptScreen: React.FC<ReceiptScreenProps> = ({
  intent,
  onDone,
}) => {
  const { t } = useTheme();
  const { recipient, amount } = intent;
  const amountFormatted = formatPaymentAmount(amount);

  const txHash = useMemo(() => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 43; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `E0041696820260521${result.substring(0, 24)}`;
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeStr = now
    .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    .replace(":", "h");
  const dateFormatted = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  const displayName = recipient.isAnonymous ? "Anônimo" : recipient.displayName;
  const displayId = getRecipientId(recipient);

  const handleShare = async () => {
    await Share.share({
      message: `Comprovante Kori\n\nValor: ${amountFormatted}\nPara: ${displayName}\nData: ${dateFormatted} às ${timeStr}\nTX: ${txHash}`,
    });
  };

  const handleVerify = () => {
    Linking.openURL(`https://solscan.io/tx/${txHash}`);
  };

  return (
    <PaymentScreenFrame
      title="Comprovante"
      onBack={onDone}
      onClose={onDone}
      rightIcon="home"
      footer={
        <View style={styles.footerButtons}>
          <PaymentPrimaryButton
            label="Compartilhar comprovante"
            onPress={handleShare}
          />
          <PaymentSecondaryButton label="Concluir" onPress={onDone} />
        </View>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.success}>
          <View style={[styles.checkCircle, { backgroundColor: t.bgElev, borderColor: t.line, borderWidth: 1 }]}>
            <Feather name="check" size={28} color={t.ink} />
          </View>
          <Text style={[styles.successTitle, { color: t.ink }]}>
            Pagamento enviado
          </Text>
          <Text style={[styles.successAmount, { color: t.ink }]}>
            {amountFormatted}
          </Text>
        </View>

        <PaymentCard padding={18} style={styles.card}>
          <SectionTitle>Transação</SectionTitle>
          <DetailRow label="Data" value={dateFormatted} />
          <DetailRow label="Horário" value={timeStr} />
          <View style={styles.txBlock}>
            <Text style={[styles.txLabel, { color: t.inkMute }]}>
              ID da transação
            </Text>
            <Text style={[styles.txHash, { color: t.inkDim }]} selectable>
              {txHash}
            </Text>
            <TouchableOpacity
              style={styles.verify}
              onPress={handleVerify}
              activeOpacity={0.7}
            >
              <Text style={[styles.verifyText, { color: t.inkDim }]}>
                Verificar na blockchain
              </Text>
              <Feather name="external-link" size={13} color={t.inkDim} />
            </TouchableOpacity>
          </View>
        </PaymentCard>

        <PaymentCard padding={18} style={styles.card}>
          <SectionTitle>Quem recebeu</SectionTitle>
          <View style={styles.recipientHeader}>
            <RecipientAvatar recipient={recipient} size={44} />
            <View>
              <Text style={[styles.recipientName, { color: t.ink }]}>
                {displayName}
              </Text>
              <Text style={[styles.recipientId, { color: t.inkMute }]}>
                {displayId}
              </Text>
            </View>
          </View>
          <DetailRow
            label="Tipo"
            value={recipient.type === "wallet" ? "Carteira Solana" : recipient.type === "pix" ? "Pix" : "ID Kori"}
          />
          {recipient.type === "wallet" ? (
            <DetailRow label="Endereço" value={displayId ?? ""} mono />
          ) : null}
          {recipient.type === "pix" ? (
            <DetailRow label="Chave Pix" value={displayId ?? ""} />
          ) : null}
        </PaymentCard>
      </ScrollView>
    </PaymentScreenFrame>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 24,
  },
  success: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 32,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontFamily: fonts.sans.semibold,
    fontSize: 20,
    fontWeight: "700",
  },
  successAmount: {
    marginTop: 8,
    fontFamily: fonts.sans.bold,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.7,
  },
  card: {
    marginBottom: 14,
  },
  txBlock: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  txLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    marginBottom: 4,
  },
  txHash: {
    fontFamily: Platform.OS === "ios" ? fonts.mono.medium : "monospace",
    fontSize: 12,
    lineHeight: 18,
  },
  verify: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  verifyText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    fontWeight: "700",
  },
  recipientHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  recipientName: {
    fontFamily: fonts.sans.semibold,
    fontSize: 15,
    fontWeight: "700",
  },
  recipientId: {
    marginTop: 2,
    fontFamily: fonts.mono.medium,
    fontSize: 11,
  },
  footerButtons: {
    gap: 10,
  },
});
