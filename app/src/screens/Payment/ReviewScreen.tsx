import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, FontAwesome } from "@/icons";
import { PaymentIntent } from "@type/payment";
import { useTheme } from "@theme/ThemeProvider";
import {
  DetailRow,
  formatPaymentAmount,
  getRecipientId,
  PaymentCard,
  PaymentPrimaryButton,
  PaymentScreenFrame,
  RecipientAvatar,
  SectionTitle,
} from "@components/home/modals/PaymentDS";
import { fonts } from "@theme/tokens";

interface ReviewScreenProps {
  intent: PaymentIntent;
  onPay: () => void;
  onBack: () => void;
  onClose: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  intent,
  onPay,
  onBack,
  onClose,
}) => {
  const { t } = useTheme();
  const { recipient, amount } = intent;
  const [isFavorite, setIsFavorite] = useState(recipient.isFavorite);

  const amountFormatted = formatPaymentAmount(amount);
  const displayName = recipient.isAnonymous ? "Anônimo" : recipient.displayName;
  const displayId = getRecipientId(recipient);

  return (
    <PaymentScreenFrame
      title="Revisão"
      onBack={onBack}
      onClose={onClose}
      footer={
        <PaymentPrimaryButton
          label={`Pagar ${amountFormatted}`}
          onPress={onPay}
        />
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.summary}>
          <RecipientAvatar recipient={recipient} size={72} />
          <Text style={[styles.amount, { color: t.ink }]}>
            {amountFormatted}
          </Text>
          <Text style={[styles.name, { color: t.inkDim }]}>{displayName}</Text>
        </View>

        <PaymentCard padding={18} style={styles.card}>
          <SectionTitle>Quem vai receber</SectionTitle>
          <DetailRow label="Nome" value={displayName} />
          <DetailRow
            label={recipient.type === "wallet" ? "Tipo" : recipient.type === "pix" ? "Método" : "ID"}
            value={
              recipient.type === "wallet"
                ? "Carteira Solana"
                : recipient.type === "pix"
                  ? "Pix"
                  : (displayId ?? "")
            }
          />
          {recipient.type === "wallet" ? (
            <DetailRow label="Endereço" value={displayId ?? ""} mono />
          ) : null}
          {recipient.type === "pix" ? (
            <DetailRow label="Chave Pix" value={displayId ?? ""} />
          ) : null}
        </PaymentCard>

        {!recipient.isAnonymous ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsFavorite((prev) => !prev)}
          >
            <PaymentCard padding={16} style={styles.favoriteCard}>
              <View style={styles.favorite}>
                <View style={[styles.heartBubble, { backgroundColor: t.bgElev, borderColor: t.line }]}>
                  {isFavorite ? (
                    <FontAwesome name="heart" size={16} color={t.ink} />
                  ) : (
                    <Feather name="heart" size={16} color={t.inkDim} />
                  )}
                </View>
                <View style={styles.favoriteText}>
                  <Text style={[styles.favoriteTitle, { color: t.ink }]}>
                    {isFavorite
                      ? "Contato favoritado"
                      : "Salvar nos favoritos"}
                  </Text>
                  <Text style={[styles.favoriteSubtitle, { color: t.inkMute }]}>
                    {displayId}
                  </Text>
                </View>
              </View>
            </PaymentCard>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </PaymentScreenFrame>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 24,
  },
  summary: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 32,
  },
  amount: {
    marginTop: 20,
    fontFamily: fonts.sans.bold,
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -1.2,
  },
  name: {
    marginTop: 6,
    fontFamily: fonts.sans.semibold,
    fontSize: 15,
    fontWeight: "700",
  },
  card: {
    marginBottom: 14,
  },
  favoriteCard: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)",
  },
  favorite: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  heartBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteText: {
    flex: 1,
  },
  favoriteTitle: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    fontWeight: "700",
  },
  favoriteSubtitle: {
    marginTop: 2,
    fontFamily: fonts.mono.medium,
    fontSize: 11,
  },
});
