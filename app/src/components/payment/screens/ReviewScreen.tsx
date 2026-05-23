import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, FontAwesome } from "../../../icons";
import { PaymentIntent } from "../../../types/payment";
import { useTheme } from "../../../theme/ThemeProvider";
import {
  DetailRow,
  formatPaymentAmount,
  getRecipientId,
  PaymentCard,
  PaymentPrimaryButton,
  PaymentScreenFrame,
  RecipientAvatar,
  SectionTitle,
} from "../PaymentDS";
import { fonts } from "../../../theme/tokens";

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
          <RecipientAvatar recipient={recipient} size={68} />
          <Text style={[styles.amount, { color: t.ink }]}>
            {amountFormatted}
          </Text>
          <Text style={[styles.name, { color: t.inkDim }]}>{displayName}</Text>
        </View>

        <PaymentCard padding={16} style={styles.card}>
          <SectionTitle>Quem vai receber</SectionTitle>
          <DetailRow label="Nome" value={displayName} />
          <DetailRow
            label={recipient.type === "wallet" ? "Tipo" : "ID"}
            value={
              recipient.type === "wallet"
                ? "Carteira Solana"
                : (displayId ?? "")
            }
          />
          {recipient.type === "wallet" ? (
            <DetailRow label="Endereço" value={displayId ?? ""} mono />
          ) : null}
        </PaymentCard>

        {!recipient.isAnonymous ? (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setIsFavorite((prev) => !prev)}
          >
            <PaymentCard padding={14}>
              <View style={styles.favorite}>
                {isFavorite ? (
                  <FontAwesome name="heart" size={20} color={t.orange} />
                ) : (
                  <Feather name="heart" size={20} color={t.ink} />
                )}
                <View style={styles.favoriteText}>
                  <Text style={[styles.favoriteTitle, { color: t.ink }]}>
                    {isFavorite
                      ? "Contato favoritado"
                      : "Adicionar aos favoritos"}
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
    paddingBottom: 16,
  },
  summary: {
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 28,
  },
  amount: {
    marginTop: 18,
    fontFamily: fonts.sans.bold,
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -1,
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
  favorite: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
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
