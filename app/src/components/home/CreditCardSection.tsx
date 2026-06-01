import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import Svg, { Path, G } from "react-native-svg";
import { Feather } from "@/icons";
import { KoriGlyph } from "@components/layout/icons";
import { useTheme } from "@theme/ThemeProvider";
import { fonts, radii } from "@theme/tokens";
import { SoftCard } from "@components/layout/SoftCard";
import { KoraInvoice, formatCents } from "@/lib/koraApi";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 68;

interface CreditCardSectionProps {
  userName?: string;
  cards?: any[];
  onToggleLock?: (id: string) => void;
  onPressCard?: (card: any) => void;
  minimal?: boolean;
  initialActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  revealDetails?: boolean;
  horizontalBleed?: number;
  onSeeMore?: () => void;
  onInvoicePress?: () => void;
  invoice?: KoraInvoice | null;
}

// concentric elegant curves representing premium texture on the card
const CardCurvesPattern = () => (
  <View style={StyleSheet.absoluteFillObject}>
    <Svg height="100%" width="100%">
      <G opacity={0.15}>
        {Array.from({ length: 15 }).map((_, i) => {
          const offset = i * 16;
          return (
            <Path
              key={i}
              d={`M ${140 + offset} -60 C ${190 + offset} 30, ${280 + offset} 110, ${310 + offset} 220`}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.8"
            />
          );
        })}
      </G>
    </Svg>
  </View>
);

export const CreditCardSection: React.FC<CreditCardSectionProps> = ({
  userName,
  cards: propCards,
  onToggleLock,
  onPressCard,
  minimal = false,
  initialActiveIndex = 0,
  onActiveIndexChange,
  revealDetails = false,
  horizontalBleed = 20,
  onSeeMore,
  onInvoicePress,
  invoice,
}) => {
  const { t, scheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [localLocked, setLocalLocked] = useState(false);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: initialActiveIndex * (CARD_WIDTH + 12),
          animated: false,
        });
      }, 50);
    }
  }, []);

  const localCards = [
    {
      id: "1",
      cardNumber: "5421 9843 7261 1256",
      expiry: "08/29",
      cvv: "842",
      isFrozen: localLocked,
    },
  ];

  const displayCards = propCards || localCards;
  const activeCard = displayCards[activeIndex] || displayCards[0];

  const handleScroll = (event: any) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / (CARD_WIDTH + 12));
    if (index !== activeIndex && index >= 0 && index < displayCards.length) {
      setActiveIndex(index);
      if (onActiveIndexChange) {
        onActiveIndexChange(index);
      }
    }
  };

  const handleToggleLock = () => {
    if (onToggleLock) {
      onToggleLock(activeCard.id);
    } else {
      setLocalLocked(!localLocked);
    }
  };

  const displayHolderName = userName || "Leonardo Vasconselos";

  const invoiceIconBg = t.line;
  const invoiceMonth = invoice?.cycleEnd || invoice?.cycleMonth
    ? new Date(invoice.cycleEnd || `${invoice.cycleMonth}-01`).toLocaleDateString("pt-BR", { month: "long" })
    : "atual";
  const invoiceStatus =
    invoice?.status === "PAID"
      ? "Paga"
      : invoice?.status === "OVERDUE"
        ? "Atrasada"
        : "Em aberto";
  const invoiceAmount = invoice
    ? formatCents(invoice.pendingCents ?? invoice.totalCents, invoice.currency)
    : "Sem fatura";
  const closeDate = invoice?.closingDate || invoice?.closeDate;
  const invoiceClose = closeDate
    ? new Date(closeDate).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })
    : "--/--";

  return (
    <View style={styles.container}>
      {/* Header Row */}
      {!minimal && (
        <View style={styles.headerRow}>
          <Text style={[styles.sectionTitle, { color: t.ink }]}>
            Cartões
          </Text>
          <TouchableOpacity activeOpacity={0.7} style={styles.seeMoreRow} onPress={onSeeMore}>
            <Text style={[styles.seeMoreText, { color: t.inkMute }]}>
              Mostrar mais{" "}
              <Text style={[styles.seeMoreArrow, { color: t.orange }]}>→</Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cards Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 12}
        snapToAlignment="start"
        decelerationRate="fast"
        style={{ marginHorizontal: -horizontalBleed, paddingBottom: 8 }}
        contentContainerStyle={{ paddingHorizontal: horizontalBleed, gap: 12 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {displayCards.map((card, index) => {
          const cardLast4 = card.cardNumber.replace(/\s/g, "").slice(-4);
          const handleCopyThisCardNumber = async () => {
            await Clipboard.setStringAsync(card.cardNumber.replace(/\s/g, ""));
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          };

          return (
            <TouchableOpacity
              key={card.id || index}
              activeOpacity={0.9}
              onPress={() => onPressCard && onPressCard(card)}
              style={[
                styles.cardShadow,
                { shadowColor: "#000", width: CARD_WIDTH },
              ]}
            >
              <LinearGradient
                colors={["#1F1F24", "#0A0A0C", "#040405"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <CardCurvesPattern />

                <View style={styles.cardInner}>
                  {/* Top row with XP-like Kori logo and digital credit badge */}
                  <View style={styles.cardTopRow}>
                    <KoriGlyph size={18} color="#FFFFFF" />
                    <View style={styles.digitalCreditBadge}>
                      <Text style={styles.digitalCreditText}>
                        Crédito digital
                      </Text>
                    </View>
                  </View>

                  {/* Holder Name */}
                  <Text style={styles.holderName} numberOfLines={1}>
                    {displayHolderName}
                  </Text>

                  {/* Card Details Block */}
                  <View style={styles.cardBottomBlock}>
                    <View style={styles.cardDetailsRow}>
                      {/* Number row */}
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>
                          {copied && activeIndex === index
                            ? "Número copiado!"
                            : "Número"}
                        </Text>
                        <View style={styles.numberWithCopy}>
                          <Text style={styles.detailValue}>
                            {revealDetails ? card.cardNumber : `•••••• ${cardLast4}`}
                          </Text>
                          <TouchableOpacity
                            onPress={handleCopyThisCardNumber}
                            activeOpacity={0.7}
                            style={styles.copyButton}
                          >
                            <Feather
                              name={
                                copied && activeIndex === index
                                  ? "check"
                                  : "copy"
                              }
                              size={11}
                              color="#FFF"
                              style={{ opacity: 0.9 }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    <View style={styles.validityCvvRow}>
                      {/* Validity */}
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Validade</Text>
                        <Text style={styles.detailValue}>{card.expiry}</Text>
                      </View>

                      {/* CVV */}
                      <View style={[styles.detailItem, { marginLeft: 24 }]}>
                        <Text style={styles.detailLabel}>CVV</Text>
                        <Text style={styles.detailValue}>
                          {revealDetails ? card.cvv : "•••"}
                        </Text>
                      </View>

                      {/* Visa brand */}
                      <View style={styles.brandContainer}>
                        <Text style={styles.visaText}>VISA</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {card.isFrozen && (
                  <View style={styles.frozenOverlay}>
                    <View style={styles.frozenBadge}>
                      <Feather
                        name="lock"
                        size={16}
                        color={t.inkMute}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={[styles.frozenBadgeText, { color: t.inkMute }]}
                      >
                        BLOQUEADO
                      </Text>
                    </View>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Invoice Block */}
      {!minimal && (
        <SoftCard radius={radii.card} padding={0} style={styles.invoiceCard}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onInvoicePress}
            style={styles.invoiceContainer}
          >
            <View style={styles.invoiceLeft}>
              <View
                style={[
                  styles.invoiceIconCircle,
                  { backgroundColor: invoiceIconBg },
                ]}
              >
                <Feather name="credit-card" size={16} color={t.inkMute} />
              </View>
              <View style={styles.invoiceDetails}>
                <Text style={[styles.invoiceLabel, { color: t.inkMute }]}>
                  Fatura {invoiceMonth}
                </Text>
                <Text style={[styles.invoiceAmount, { color: t.ink }]}>
                  {invoiceAmount}
                </Text>
                <Text style={[styles.invoiceDate, { color: t.inkMute }]}>
                  Fecha em {invoiceClose}
                </Text>
              </View>
            </View>

            <View style={styles.invoiceRight}>
              <View
                style={[styles.statusBadge, { backgroundColor: `${t.orange}1A` }]}
              >
                <View
                  style={[styles.statusDot, { backgroundColor: t.orange }]}
                />
                <Text style={[styles.statusText, { color: t.orange }]}>
                  {invoiceStatus}
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={14}
                color={t.inkDim}
                style={{ marginLeft: 8 }}
              />
            </View>
          </TouchableOpacity>
        </SoftCard>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: fonts.sans.semibold,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  seeMoreRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeMoreText: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
  },
  seeMoreArrow: {
    fontFamily: fonts.sans.bold,
    fontSize: 13,
  },
  cardShadow: {
    borderRadius: 22,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
    overflow: "hidden",
  },
  cardGradient: {
    height: 200,
    borderRadius: 22,
    position: "relative",
    overflow: "hidden",
  },
  cardInner: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    zIndex: 2,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  digitalCreditBadge: {
    backgroundColor: "#FFFFFF",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  digitalCreditText: {
    color: "#000000",
    fontFamily: fonts.sans.bold,
    fontSize: 9.5,
  },
  holderName: {
    color: "#FFFFFF",
    fontFamily: fonts.sans.semibold,
    fontSize: 16,
    letterSpacing: 0.2,
    marginTop: 18,
  },
  cardBottomBlock: {
    marginTop: "auto",
    gap: 8,
  },
  cardDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  validityCvvRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailItem: {
    flexDirection: "column",
  },
  detailLabel: {
    color: "rgba(255, 255, 255, 0.45)",
    fontFamily: fonts.sans.regular,
    fontSize: 9,
    marginBottom: 2,
  },
  detailValue: {
    color: "#FFFFFF",
    fontFamily: fonts.mono.medium,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  numberWithCopy: {
    flexDirection: "row",
    alignItems: "center",
  },
  copyButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  brandContainer: {
    marginLeft: "auto",
    alignSelf: "flex-end",
  },
  visaText: {
    color: "#FFFFFF",
    fontFamily: fonts.sans.bold,
    fontSize: 16,
    fontStyle: "italic",
    letterSpacing: 0.5,
  },
  walletButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: 15,
    marginTop: 12,
  },
  walletButtonText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 13.5,
  },
  invoiceCard: {
    marginTop: 12,
  },
  invoiceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  invoiceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  invoiceIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  invoiceDetails: {
    flexDirection: "column",
    gap: 2,
  },
  invoiceLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
  },
  invoiceAmount: {
    fontFamily: fonts.sans.bold,
    fontSize: 18,
    letterSpacing: -0.4,
  },
  invoiceDate: {
    fontFamily: fonts.sans.regular,
    fontSize: 12,
  },
  invoiceRight: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4.5,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 5,
  },
  statusText: {
    fontFamily: fonts.sans.bold,
    fontSize: 10,
  },
  frozenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 10, 0.88)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderRadius: 22,
  },
  frozenBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  frozenBadgeText: {
    color: "#FFF",
    fontFamily: fonts.sans.bold,
    fontSize: 12,
    letterSpacing: 1,
  },
});
