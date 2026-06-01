import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Dimensions,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import ReAnimated from "react-native-reanimated";
import { Feather } from "@/icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "@theme/ThemeProvider";
import { useFadeUp } from "@hooks/useFadeUp";
import { CreditCardSection } from "@components/home/CreditCardSection";
import { Button } from "@components/layout/Button";
import { SoftCard } from "@components/layout/SoftCard";
import { fonts, radii } from "@theme/tokens";
import { formatCents, KoraInvoice } from "@/lib/koraApi";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Circle,
  Pattern,
  Rect,
  G,
  Line,
} from "react-native-svg";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.70;
const CARD_HEIGHT = 160;

interface CardsPanelProps {
  userName?: string;
  cardsState?: {
    cards: any[];
    currentInvoice?: KoraInvoice | null;
    currentInvoices?: KoraInvoice[];
    cardsError?: string | null;
    onchainStatus?: string;
    toggleFreeze: (id: string) => void | Promise<void>;
    payCurrentInvoice?: (invoiceId?: string) => Promise<any>;
  };
}

const KoriLogo = ({ scaled }: { scaled?: boolean }) => (
  <View style={styles.logoContainer}>
    <Svg width={scaled ? 40 : 60} height={scaled ? 40 : 60} viewBox="0 0 60 60">
      <Defs>
        <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#E5E5E5" stopOpacity="1" />
          <Stop offset="0.5" stopColor="#999999" stopOpacity="1" />
          <Stop offset="1" stopColor="#4A4A4A" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>
      <Path d="M 16 12 L 26 12 L 16 48 L 6 48 Z" fill="url(#grad)" />
      <Path
        d="M 23 30 L 46 12 L 56 12 L 33 30 L 56 48 L 46 48 Z"
        fill="url(#grad)"
      />
    </Svg>
    <Text style={[styles.logoText, scaled && { fontSize: 10, marginTop: 4, letterSpacing: 4 }]}>K O R A</Text>
  </View>
);

const Chip = ({ scaled }: { scaled?: boolean }) => (
  <View style={[styles.chipContainer, scaled && { width: 32, height: 22 }]}>
    <LinearGradient
      colors={["#D4D4D4", "#9A9A9A", "#737373"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.chipGrad}
    />
    <View style={styles.chipLines}>
      <View style={styles.chipLine} />
      <View style={styles.chipLine} />
    </View>
    <View style={styles.chipLinesVertical}>
      <View style={styles.chipLineVert} />
      <View style={styles.chipLineVert} />
    </View>
  </View>
);

const MastercardLogo = ({ scaled }: { scaled?: boolean }) => (
  <Svg width={scaled ? 34 : 46} height={scaled ? 22 : 30} viewBox="0 0 46 30">
    <Defs>
      <SvgLinearGradient id="mc" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#B0B0B0" stopOpacity="0.8" />
        <Stop offset="1" stopColor="#505050" stopOpacity="0.8" />
      </SvgLinearGradient>
    </Defs>
    <Circle cx="15" cy="15" r="15" fill="url(#mc)" />
    <Circle cx="31" cy="15" r="15" fill="url(#mc)" />
  </Svg>
);

const CardPattern = () => (
  <View style={StyleSheet.absoluteFillObject}>
    <Svg height="100%" width="100%">
      <Defs>
        <Pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <Path
            d="M 24 0 L 0 0 0 24 L 24 24 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.5"
            strokeOpacity="0.04"
          />
          <Path
            d="M 0 0 L 24 24 M 24 0 L 0 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.5"
            strokeOpacity="0.03"
          />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#grid)" />
    </Svg>
  </View>
);

const FlippableCard = ({ card, displayName, isFrozen, isFlipped, t, isSelected, fullSize }: any) => {
  const flipAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const cardWidth = fullSize ? (width * 0.86) : CARD_WIDTH;
  const cardHeight = fullSize ? 200 : 148;

  const activeBorderStyle = isSelected ? {
    borderColor: t.orange,
    borderWidth: 1.5,
    shadowColor: t.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 12,
  } : {
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
  };

  return (
    <View style={[styles.cardWrapperContainer, { width: cardWidth }]}>
      <View style={[styles.cardWrapper, { width: cardWidth, height: cardHeight }]}>
        {/* Front */}
        <Animated.View
          style={[styles.card, styles.cardFace, frontAnimatedStyle, activeBorderStyle]}
        >
          <LinearGradient
            colors={["#2A2A2A", "#111111", "#050505"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <CardPattern />
          <View style={[styles.cardContent, { padding: fullSize ? 24 : 16 }]}>
            <View style={styles.cardTopRow}>
              <Chip scaled={!fullSize} />
              <Feather
                name="wifi"
                size={fullSize ? 22 : 18}
                color="#E5E5E5"
                style={{
                  transform: [{ rotate: "90deg" }],
                  opacity: 0.8,
                  marginTop: fullSize ? 4 : 2,
                }}
              />
            </View>
            <View style={styles.cardCenterRow}>
              <KoriLogo scaled={!fullSize} />
            </View>
            <View style={styles.cardBottomRow}>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: fullSize ? 12 : 10, fontFamily: fonts.mono.regular }}>
                {card.type}
              </Text>
              <MastercardLogo scaled={!fullSize} />
            </View>
          </View>

          {isFrozen && (
            <View style={styles.frozenOverlay}>
              <View style={[styles.frozenBadge, { paddingHorizontal: fullSize ? 20 : 12, paddingVertical: fullSize ? 10 : 6 }]}>
                <Feather
                  name="lock"
                  size={fullSize ? 18 : 14}
                  color={t.inkMute}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.frozenBadgeText, { color: t.inkMute, fontSize: fullSize ? 13 : 11 }]}>
                  BLOQUEADO
                </Text>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Back */}
        <Animated.View
          style={[
            styles.card,
            styles.cardFace,
            styles.cardBack,
            backAnimatedStyle,
            activeBorderStyle,
          ]}
        >
          <LinearGradient
            colors={["#1A1A1A", "#0D0D0D", "#000000"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <CardPattern />
          <View style={[styles.cardBackContent, { paddingTop: fullSize ? 24 : 16 }]}>
            <View style={[styles.magneticStripe, { height: fullSize ? 40 : 28, marginBottom: fullSize ? 20 : 12 }]} />
            <View style={[styles.cvvStrip, { height: fullSize ? 30 : 24, marginHorizontal: fullSize ? 24 : 16, marginBottom: fullSize ? 20 : 12 }]}>
              <Text style={[styles.cvvText, { fontSize: fullSize ? 14 : 12 }]}>{card.cvv}</Text>
            </View>
            <View style={[styles.backDetails, { paddingHorizontal: fullSize ? 24 : 16 }]}>
              <Text style={[styles.backCardNumber, { fontSize: fullSize ? 18 : 14, marginBottom: fullSize ? 16 : 8, letterSpacing: fullSize ? 2 : 1.5 }]}>
                {card.number}
              </Text>
              <View style={[styles.backRow, { marginBottom: 4 }]}>
                <Text style={styles.backLabel}>VALIDADE</Text>
                <Text style={styles.backValue}>{card.expiry}</Text>
              </View>
              <View style={styles.backRow}>
                <Text style={styles.backLabel}>PORTADOR</Text>
                <Text style={styles.backValue}>{displayName}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export const CardsPanel: React.FC<CardsPanelProps> = ({
  userName,
  cardsState,
}) => {
  const { t, scheme } = useTheme();
  const entering = useFadeUp();

  const [localCards] = useState([
    {
      id: "1",
      number: "5421 9843 7261 8294",
      expiry: "08/29",
      cvv: "842",
      type: "VIRTUAL",
    },
    {
      id: "2",
      number: "5421 1122 3344 5566",
      expiry: "12/30",
      cvv: "123",
      type: "FÍSICO",
    },
  ]);

  const [localFrozen, setLocalFrozen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isOnlineActive, setIsOnlineActive] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastOpacity = useState(new Animated.Value(0))[0];
  const [activeDetailCard, setActiveDetailCard] = useState<any | null>(null);
  const [activeDetailIndex, setActiveDetailIndex] = useState(0);
  const [mainActiveIndex, setMainActiveIndex] = useState(0);

  const displayName = (userName || "KAUÃ M.").toUpperCase();

  const displayCards = cardsState
    ? cardsState.cards.map((c) => ({
        ...c,
        number: c.cardNumber,
        type: c.id === "1" ? "VIRTUAL" : "FÍSICO",
      }))
    : localCards;

  const currentActiveIndex = activeDetailCard ? activeDetailIndex : mainActiveIndex;
  const activeCard = displayCards[currentActiveIndex] || displayCards[0];
  const activeCardId = activeDetailCard ? activeDetailCard.id : (activeCard?.id || "1");

  const isFrozen = cardsState
    ? (cardsState.cards.find((c) => c.id === activeCardId)?.isFrozen || false)
    : localFrozen;

  const toggleFreezeAction = () => {
    if (cardsState) {
      cardsState.toggleFreeze(activeCardId);
    } else {
      setLocalFrozen(!localFrozen);
    }
  };

  const getCardValues = (index: number) => {
    if (index === 0) {
      return {
        utilized: "R$ 12.840,00",
        available: "R$ 7.160,00",
        total: "R$ 20.000,00",
        progressWidth: "64%",
        progressColor: scheme === "dark" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.20)",
        dueDate: "24/07",
        autoDebit: true,
        invoiceTitle: "Fatura de Junho",
        invoiceBadge: "Em aberto",
        invoiceBadgeBg: "rgba(129, 140, 248, 0.15)",
        invoiceBadgeText: "#818CF8",
        pillBtnBg: scheme === "dark" ? "#1b293a" : "rgba(129, 140, 248, 0.08)",
        pillBtnText: scheme === "dark" ? "#818CF8" : "#4F46E5",
      };
    } else {
      return {
        utilized: "R$ 18.432,10",
        available: "R$ 6.567,90",
        total: "R$ 25.000,00",
        progressWidth: "74%",
        progressColor: scheme === "dark" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.20)",
        dueDate: "25/05",
        autoDebit: false,
        invoiceTitle: "Fatura de Maio",
        invoiceBadge: "Fechada",
        invoiceBadgeBg: "rgba(255, 107, 61, 0.15)",
        invoiceBadgeText: t.orange,
        pillBtnBg: scheme === "dark" ? "#301c12" : "rgba(255, 107, 61, 0.08)",
        pillBtnText: t.orange,
      };
    }
  };

  const cardVals = getCardValues(currentActiveIndex);
  const invoice =
    cardsState?.currentInvoices?.find((item) => item.card?.id === activeCardId || item.cardId === activeCardId) ||
    (cardsState?.currentInvoice &&
    ((cardsState.currentInvoice as any).card?.id === activeCardId ||
      (cardsState.currentInvoice as any).cardId === activeCardId)
      ? cardsState.currentInvoice
      : null);
  const invoicePendingCents = invoice
    ? Math.max(invoice.pendingCents ?? invoice.totalCents - invoice.paidCents, 0)
    : 0;
  const invoiceTotal = invoice
    ? formatCents(invoicePendingCents, invoice.currency)
    : formatCents(0, "BRL");
  const activeLimitTotal = displayCards[currentActiveIndex]?.limitTotal ?? 0;
  const activeLimitUsed = displayCards[currentActiveIndex]?.limitUsed ?? 0;
  const limitProgress = activeLimitTotal
    ? Math.min(100, Math.max(0, (activeLimitUsed / activeLimitTotal) * 100))
    : null;
  const invoiceLimit = activeLimitTotal
    ? formatCents(activeLimitTotal * 100, "BRL")
    : cardVals.total;
  const invoiceRemaining = activeLimitTotal
    ? formatCents(Math.max(0, activeLimitTotal - activeLimitUsed) * 100, "BRL")
    : cardVals.available;

  // Lançamentos reais da fatura (inclui cobranças geradas na Loja).
  const invoiceItems = invoice?.items ?? [];

  const showToast = (message: string) => {
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setToastMessage(null));
  };

  if (activeDetailCard) {
    return (
      <View style={[styles.container, { backgroundColor: t.bg }]}>
        {/* Custom Header for Detail Screen */}
        <View style={styles.detailHeader}>
          <TouchableOpacity
            style={[styles.detailBackBtn, { backgroundColor: t.line }]}
            onPress={() => {
              setActiveDetailCard(null);
              setIsFlipped(false);
            }}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color={t.ink} />
          </TouchableOpacity>
          <Text style={[styles.detailHeaderTitle, { color: t.ink }]}>Detalhes do Cartão</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          {/* Card swiper on detail screen */}
          <View style={styles.detailCardWrapper}>
            <CreditCardSection
              userName={userName}
              cards={displayCards}
              initialActiveIndex={activeDetailIndex}
              onActiveIndexChange={(index) => {
                setActiveDetailIndex(index);
                setActiveDetailCard(displayCards[index]);
              }}
              minimal={true}
              revealDetails={isFlipped}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.detailActionsRow}>
            <Button
              label={isFrozen ? "Desbloquear" : "Bloquear"}
              variant="primary"
              onPress={toggleFreezeAction}
              full
              icon={<Feather name={isFrozen ? "unlock" : "lock"} size={16} color={t.btnPrimaryFg} />}
            />
            <Button
              label={`${isFlipped ? "Ocultar" : "Mostrar"} dados`}
              variant="secondary"
              onPress={() => setIsFlipped(!isFlipped)}
              full
              icon={<Feather name={isFlipped ? "eye-off" : "eye"} size={16} color={t.ink} />}
            />
          </View>

          {/* Gated option list */}
          <View style={styles.controlsList}>
            <TouchableOpacity style={styles.controlRow} activeOpacity={0.7}>
              <View style={styles.controlLeft}>
                <Feather name="eye" size={22} color={t.ink} />
                <Text style={[styles.controlTitle, { color: t.ink }]}>
                  Mostrar senha do cartão
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={t.inkMute} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlRow} activeOpacity={0.7}>
              <View style={styles.controlLeft}>
                <Feather name="lock" size={22} color={t.ink} />
                <Text style={[styles.controlTitle, { color: t.ink }]}>
                  Alterar senha do cartão
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={t.inkMute} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlRow} activeOpacity={0.7}>
              <View style={styles.controlLeft}>
                <Feather name="trash-2" size={22} color={t.ink} />
                <Text style={[styles.controlTitle, { color: t.ink }]}>
                  Excluir cartão virtual
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={t.inkMute} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlRow} activeOpacity={0.7}>
              <View style={styles.controlLeft}>
                <Feather name="smartphone" size={22} color={t.ink} />
                <Text style={[styles.controlTitle, { color: t.ink }]}>
                  Google Pay
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={t.inkMute} />
            </TouchableOpacity>

            <View style={styles.controlRow}>
              <View style={styles.controlLeft}>
                <Feather name="shopping-cart" size={22} color={t.ink} />
                <Text style={[styles.controlTitle, { color: t.ink }]}>
                  Compras online
                </Text>
              </View>
              <Switch
                value={isOnlineActive}
                onValueChange={setIsOnlineActive}
                trackColor={{ false: t.inkFaint, true: t.line2 }}
                thumbColor={isOnlineActive ? t.orange : t.inkMute}
                ios_backgroundColor={t.inkFaint}
              />
          </View>
        </View>
      </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {toastMessage && (
        <Animated.View
          style={[
            styles.toast,
            { opacity: toastOpacity, backgroundColor: t.green, zIndex: 9999 },
          ]}
        >
          <Text style={[styles.toastText, { color: t.bg }]}>
            {toastMessage}
          </Text>
        </Animated.View>
      )}

      {/* Invoice + Limit Card */}
      <ReAnimated.View entering={entering(60)}>
      <SoftCard radius={20} padding={0} style={styles.refCard}>
        <View style={styles.refTop}>
          <Text style={[styles.refLabel, { color: t.inkDim }]}>Total da fatura este mês</Text>
          <Text style={[styles.refAmount, { color: t.ink }]}>{invoiceTotal}</Text>
          <Text style={[styles.refSubAmount, { color: t.inkMute }]}>
            de{" "}
            <Text style={[styles.refSubAmountBold, { color: t.orange }]}>{invoiceLimit}</Text>
          </Text>

          {/* Progress bar */}
          <View style={styles.refBarWrap}>
            <View style={[styles.refBarTrack, { backgroundColor: t.line }]}>
              <View
                style={[
                  styles.refBarFill,
                  {
                    width: limitProgress === null ? cardVals.progressWidth as `${number}%` : `${limitProgress}%`,
                    backgroundColor: t.inkFaint,
                  },
                ]}
              />
            </View>
            <View style={styles.refDots}>
              <View style={[styles.refDot, { backgroundColor: t.inkMute }]} />
              <View style={[styles.refDot, { backgroundColor: t.inkMute }]} />
              <View style={[styles.refDotLarge, { backgroundColor: t.inkDim }]} />
              <View style={[styles.refDotSmall, { backgroundColor: t.line2, borderColor: t.line }]} />
            </View>
          </View>

          {/* Progress legend */}
          <View style={styles.refLegendRow}>
            <Text style={[styles.refLegendLabel, { color: t.inkMute }]}>Sua Fatura</Text>
            <Text style={[styles.refLegendValue, { color: t.ink }]}>{invoiceRemaining} restante</Text>
          </View>

          {/* Pay invoice button */}
          <Button
            label={invoicePendingCents > 0 ? "Pagar fatura" : "Fatura em dia"}
            variant="secondary"
            onPress={async () => {
              if (!invoice || invoicePendingCents <= 0) {
                showToast("Nao ha fatura em aberto.");
                return;
              }
              if (!cardsState?.payCurrentInvoice) {
                showToast("Fatura indisponivel no momento.");
                return;
              }
              const payment = await cardsState.payCurrentInvoice(invoice.id);
              showToast(
                payment
                  ? payment.txHash
                    ? `Confirmado on-chain: ${payment.txHash.slice(0, 8)}...`
                    : cardsState.onchainStatus && cardsState.onchainStatus !== "idle"
                      ? `Status on-chain: ${cardsState.onchainStatus}`
                      : "Fatura paga com sucesso."
                  : cardsState.cardsError || "Nao foi possivel pagar agora.",
              );
            }}
            icon={<Feather name="arrow-up-circle" size={15} color={t.ink} />}
            style={invoicePendingCents <= 0 ? { opacity: 0.55 } : undefined}
            full
          />
        </View>

        {/* Savings streak banner */}
        <View style={[styles.refBanner, { backgroundColor: t.sol }]}>
          <Text style={[styles.refBannerText, { color: "rgba(255,255,255,0.85)" }]}>
            Você economizou{" "}
            <Text style={[styles.refBannerBold, { color: "#FFFFFF" }]}>R$ 1.200</Text>
            {" "}este mês
          </Text>
          <View style={styles.refBannerBadge}>
            <Feather name="trending-up" size={15} color="#FFFFFF" />
            <Text style={[styles.refBannerStreak, { color: "#FFFFFF" }]}> x 3</Text>
          </View>
        </View>
      </SoftCard>
      </ReAnimated.View>

      {/* CreditCardSection from components/home */}
      <ReAnimated.View entering={entering(120)}>
        <CreditCardSection
        userName={userName}
        cards={displayCards}
        onToggleLock={toggleFreezeAction}
        onPressCard={(card) => {
          const cardIndex = displayCards.findIndex((c) => c.id === card.id);
          setActiveDetailIndex(cardIndex >= 0 ? cardIndex : 0);
          setActiveDetailCard(card);
        }}
        minimal={true}
        horizontalBleed={20}
        initialActiveIndex={mainActiveIndex}
        onActiveIndexChange={(index) => {
          setMainActiveIndex(index);
        }}
      />
      </ReAnimated.View>

      {/* Transações da fatura (lançamentos reais — inclui cobranças da Loja) */}
      <ReAnimated.View entering={entering(180)}>
        <View style={[styles.purchasesContainer, { paddingHorizontal: 0 }]}>
          <Text style={[styles.limitTitle, { color: t.ink, marginBottom: 8 }]}>
            Transações da fatura
          </Text>

          {invoiceItems.length === 0 ? (
            <Text style={[styles.purchaseDate, { color: t.inkMute, paddingVertical: 12 }]}>
              Nenhuma transação nesta fatura ainda.
            </Text>
          ) : (
            invoiceItems.map((it) => {
              const created = it.createdAt ? new Date(it.createdAt) : null;
              const date =
                created && !isNaN(created.getTime())
                  ? `${created.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} · ${created
                      .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                      .replace(":", "h")}`
                  : "";
              const parcelas = it.installmentsCount ?? 1;
              return (
                <View
                  key={it.id}
                  style={[styles.purchaseRow, { borderBottomColor: t.cardBorder }]}
                >
                  <View style={styles.purchaseLeft}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: t.bg2,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Feather name="shopping-bag" size={18} color={t.inkDim} />
                    </View>
                    <View style={styles.purchaseDetails}>
                      <Text style={[styles.purchaseName, { color: t.ink }]} numberOfLines={1}>
                        {it.description}
                      </Text>
                      <Text style={[styles.purchaseDate, { color: t.inkMute }]}>{date}</Text>
                    </View>
                  </View>
                  <View style={styles.purchaseRight}>
                    <View style={styles.purchaseValueContainer}>
                      <Text style={[styles.purchaseValue, { color: t.ink }]}>
                        {formatCents(it.amountCents, invoice?.currency)}
                      </Text>
                      {parcelas > 1 ? (
                        <Text style={[styles.purchaseInstallments, { color: t.inkMute }]}>
                          {parcelas}x parcelas
                        </Text>
                      ) : (
                        <Text style={[styles.purchaseInstallments, { color: t.inkMute }]}>
                          à vista
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ReAnimated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  comingSoonWrapper: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 16,
  },
  comingSoonOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  comingSoonBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  comingSoonText: {
    fontFamily: fonts.sans.bold,
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  toast: {
    position: "absolute",
    top: 10,
    left: 20,
    right: 20,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  toastText: {
    fontFamily: fonts.sans.bold,
    fontSize: 13,
    textAlign: "center",
  },
  swiperContainer: {
    marginVertical: 10,
    marginBottom: 24,
  },
  cardWrapperContainer: {
    width: CARD_WIDTH,
    marginHorizontal: 8,
    alignItems: "center",
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: 220,
  },
  card: {
    width: "100%",
    height: "100%",
  },
  cardFace: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    position: "absolute",
    backfaceVisibility: "hidden",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  cardBack: {
    transform: [{ rotateY: "180deg" }],
  },
  cardContent: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    zIndex: 2,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardCenterRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#999999",
    letterSpacing: 8,
    fontSize: 14,
    marginTop: 8,
    fontFamily: fonts.sans.regular,
  },
  chipContainer: {
    width: 44,
    height: 32,
    borderRadius: 6,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "#555",
  },
  chipGrad: {
    ...StyleSheet.absoluteFillObject,
  },
  chipLines: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-evenly",
    paddingVertical: 4,
  },
  chipLine: {
    height: 1,
    backgroundColor: "#555",
    width: "100%",
  },
  chipLinesVertical: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 8,
  },
  chipLineVert: {
    width: 1,
    backgroundColor: "#555",
    height: "100%",
  },
  cardBackContent: {
    flex: 1,
    paddingTop: 24,
    zIndex: 2,
  },
  magneticStripe: {
    height: 40,
    backgroundColor: "#050505",
    width: "100%",
    marginBottom: 20,
  },
  cvvStrip: {
    height: 30,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 24,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  cvvText: {
    color: "#000",
    fontFamily: fonts.sans.bold,
    fontStyle: "italic",
  },
  backDetails: {
    paddingHorizontal: 24,
  },
  backCardNumber: {
    color: "#FFF",
    fontSize: 18,
    letterSpacing: 2,
    fontFamily: fonts.mono.semibold,
    marginBottom: 16,
  },
  backRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backLabel: {
    color: "#888",
    fontSize: 10,
    letterSpacing: 1,
  },
  backValue: {
    color: "#FFF",
    fontSize: 12,
    fontFamily: fonts.sans.semibold,
  },
  showDataBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  showDataText: {
    color: "#A0A0A0",
    fontSize: 13,
    fontFamily: fonts.sans.semibold,
  },
  frozenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(13, 13, 13, 0.82)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderRadius: 16,
  },
  frozenBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 30, 30, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 4,
  },
  frozenBadgeText: {
    fontFamily: fonts.sans.bold,
    fontSize: 14,
    letterSpacing: 1,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 26,
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 14,
  },
  primaryActionText: {
    fontSize: 14,
    fontFamily: fonts.sans.bold,
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
  },
  secondaryActionText: {
    fontSize: 14,
    fontFamily: fonts.sans.bold,
  },
  controlsList: {
    marginBottom: 26,
    paddingHorizontal: 4,
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
  },
  controlLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  controlTitle: {
    fontSize: 15,
    fontFamily: fonts.sans.medium,
  },
  limitPanel: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  limitTitle: {
    fontSize: 15,
    fontFamily: fonts.sans.medium,
    marginBottom: 16,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  limitValuesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  limitAmount: {
    fontSize: 18,
    fontFamily: fonts.sans.bold,
    marginBottom: 4,
  },
  limitLabel: {
    fontSize: 14,
    fontFamily: fonts.sans.regular,
  },
  /* ── Reference card styles ─────────────────────── */
  refCard: {
    marginBottom: 24,
    overflow: "hidden",
  },
  refTop: {
    padding: 20,
    paddingBottom: 16,
  },
  refLabel: {
    fontSize: 13,
    fontFamily: fonts.sans.medium,
    marginBottom: 8,
  },
  refAmount: {
    fontSize: 38,
    fontFamily: fonts.sans.bold,
    letterSpacing: -1,
    marginBottom: 2,
  },
  refSubAmount: {
    fontSize: 14,
    fontFamily: fonts.sans.regular,
    marginBottom: 22,
  },
  refSubAmountBold: {
    fontFamily: fonts.sans.bold,
  },
  /* progress bar */
  refBarWrap: {
    position: "relative",
    marginBottom: 14,
  },
  refBarTrack: {
    height: 10,
    borderRadius: 5,
    width: "100%",
  },
  refBarFill: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 10,
    borderRadius: 5,
  },
  refDots: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
  },
  refDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  refDotLarge: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  refDotSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.08)",
  },
  refLegendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  refLegendLabel: {
    fontSize: 13,
    fontFamily: fonts.sans.medium,
  },
  refLegendValue: {
    fontSize: 13,
    fontFamily: fonts.sans.bold,
  },
  /* pay button */
  refPayBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  refPayBtnText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    fontWeight: "700",
  },
  /* savings banner */
  refBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  refBannerText: {
    fontSize: 13,
    fontFamily: fonts.sans.medium,
    flex: 1,
  },
  refBannerBold: {
    fontFamily: fonts.sans.bold,
  },
  refBannerBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  refBannerEmoji: {
    fontSize: 15,
  },
  refBannerStreak: {
    fontFamily: fonts.sans.bold,
    fontSize: 14,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  detailBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  detailHeaderTitle: {
    fontSize: 18,
    fontFamily: fonts.sans.semibold,
  },
  detailCardWrapper: {
    width: "100%",
    height: 220,
    marginVertical: 16,
  },
  detailActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  purchasesContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
  purchaseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  purchaseLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  purchaseDetails: {
    justifyContent: "center",
  },
  purchaseName: {
    fontSize: 15,
    fontFamily: fonts.sans.bold,
    marginBottom: 4,
  },
  purchaseDate: {
    fontSize: 13,
    fontFamily: fonts.sans.regular,
  },
  purchaseRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  purchaseValueContainer: {
    alignItems: "flex-end",
  },
  purchaseValue: {
    fontSize: 16,
    fontFamily: fonts.sans.bold,
    marginBottom: 4,
  },
  purchaseInstallments: {
    fontSize: 12,
    fontFamily: fonts.sans.regular,
  },
});
