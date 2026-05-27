import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Animated,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as LocalAuthentication from "expo-local-authentication";
import { Feather } from "../icons";
import { useTheme } from "../theme/ThemeProvider";
import { PremiumCard } from "./ds/PremiumCard";
import { Button } from "./ds/Button";
import { SoftCard } from "./ds/SoftCard";
import { CopyIcon, PlusIcon, ChevronRightIcon } from "./ds/icons";
import { fonts, radii } from "../theme/tokens";

interface CardsPanelProps {
  userName?: string;
}

export const CardsPanel: React.FC<CardsPanelProps> = ({ userName }) => {
  const { t } = useTheme();

  const [cardNumber, setCardNumber] = useState("5421 9843 7261 8294");
  const [expiry] = useState("08/29");
  const [cvv, setCvv] = useState("842");

  const [isRevealed, setIsRevealed] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [isOnlineActive, setIsOnlineActive] = useState(true);
  const [isInternationalActive, setIsInternationalActive] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastOpacity] = useState(() => new Animated.Value(0));
  const [cardScale] = useState(() => new Animated.Value(1));

  const displayName = (userName || "KAUÃ MIGUEL").toUpperCase();
  const last4 = cardNumber.slice(-4);

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

  const handleReveal = async () => {
    if (isRevealed) {
      setIsRevealed(false);
      return;
    }
    const hasHW = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHW || !enrolled) {
      setIsRevealed(true);
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Autentique para ver os dados do cartão",
      fallbackLabel: "Usar PIN",
    });
    if (result.success) setIsRevealed(true);
  };

  const handleCopyDetails = async () => {
    const text = [
      "Cartão Kori Virtual",
      `Nome: ${displayName}`,
      `Número: ${cardNumber}`,
      `Validade: ${expiry}`,
      `CVV: ${cvv}`,
    ].join("\n");
    await Clipboard.setStringAsync(text);
    showToast("Dados copiados!");
  };

  const handleGenerateNewCard = () => {
    Animated.sequence([
      Animated.timing(cardScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1.02,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    const b1 = Math.floor(1000 + Math.random() * 9000);
    const b2 = Math.floor(1000 + Math.random() * 9000);
    setCardNumber(`5421 ${b1} ${b2} 8294`);
    setCvv(Math.floor(100 + Math.random() * 900).toString());
    setIsRevealed(false);
    showToast("Novo cartão virtual gerado!");
  };

  const toggleTrack = { false: t.inkFaint, true: "rgba(74,222,128,0.25)" };

  return (
    <ScrollView
      style={[s.scroller, { backgroundColor: t.bg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Toast ── */}
      {toastMessage && (
        <Animated.View
          style={[
            s.toast,
            {
              opacity: toastOpacity,
              backgroundColor: t.bg2,
              borderColor: t.cardBorder,
            },
          ]}
        >
          <Feather
            name="check-circle"
            size={15}
            color={t.green}
            style={{ marginRight: 8 }}
          />
          <Text style={[s.toastTxt, { color: t.ink }]}>{toastMessage}</Text>
        </Animated.View>
      )}

      {/* ── 2. Title ── */}
      <View style={s.titleWrap}>
        <Text style={[s.title, { color: t.ink }]}>Meu cartão</Text>
        <Text style={[s.subtitle, { color: t.inkDim }]}>
          Virtual · Mastercard
        </Text>
      </View>

      {/* ── 3. PremiumCard ── */}
      <Animated.View
        style={[s.cardWrap, { transform: [{ scale: cardScale }] }]}
      >
        <PremiumCard holder={displayName} last4={last4} isVirtual />

        {isFrozen && (
          <View style={s.frozenOverlay}>
            <View
              style={[
                s.frozenBadge,
                { backgroundColor: t.bgElev, borderColor: t.inkMute },
              ]}
            >
              <Feather
                name="lock"
                size={18}
                color={t.ink}
                style={{ marginRight: 8 }}
              />
              <Text style={[s.frozenTxt, { color: t.ink }]}>CONGELADO</Text>
            </View>
          </View>
        )}
      </Animated.View>

      {/* ── 4. Balance ── */}
      <SoftCard radius={radii.card} padding={20} style={s.section}>
        <View style={s.balRow}>
          <View style={s.balCol}>
            <Text style={[s.balLbl, { color: t.inkMute }]}>DISPONÍVEL</Text>
            <Text style={[s.balVal, { color: t.ink }]}>R$ 4.280,00</Text>
          </View>
          <View style={[s.balDivider, { backgroundColor: t.line }]} />
          <View style={s.balCol}>
            <Text style={[s.balLbl, { color: t.inkMute }]}>GASTO NO MÊS</Text>
            <Text style={[s.balVal, { color: t.inkDim }]}>R$ 1.720,00</Text>
          </View>
        </View>
      </SoftCard>

      {/* ── 5. Hidden data ── */}
      <SoftCard radius={radii.card} padding={16} style={s.section}>
        <View style={s.dataRow}>
          <View style={s.dataCell}>
            <Text style={[s.dataLbl, { color: t.inkMute }]}>VALIDADE</Text>
            <Text style={[s.dataVal, { color: t.ink }]}>{expiry}</Text>
          </View>

          <View style={s.dataCell}>
            <Text style={[s.dataLbl, { color: t.inkMute }]}>CVV</Text>
            <Text style={[s.dataVal, { color: t.ink }]}>
              {isRevealed ? cvv : "•••"}
            </Text>
          </View>

          {isRevealed && (
            <View style={s.dataCellWide}>
              <Text style={[s.dataLbl, { color: t.inkMute }]}>NÚMERO</Text>
              <Text
                style={[s.dataNumRevealed, { color: t.ink }]}
                numberOfLines={1}
              >
                {cardNumber}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={s.revealBtn}
            onPress={handleReveal}
            activeOpacity={0.7}
          >
            <Feather
              name={isRevealed ? "eye-off" : "eye"}
              size={16}
              color={t.inkDim}
            />
            <Text style={[s.revealTxt, { color: t.inkDim }]}>
              {isRevealed ? "Ocultar" : "Mostrar"}
            </Text>
          </TouchableOpacity>
        </View>
      </SoftCard>

      {/* ── 6. Actions ── */}
      <View style={s.actionsRow}>
        <Button
          label="Copiar dados"
          onPress={handleCopyDetails}
          full
          icon={<CopyIcon size={14} color={t.btnPrimaryFg} />}
        />
        <Button
          label="Novo virtual"
          variant="secondary"
          onPress={handleGenerateNewCard}
          full
          icon={<PlusIcon size={16} color={t.ink} />}
        />
      </View>

      {/* ── 7. Controls ── */}
      <Text style={[s.sectionTitle, { color: t.inkMute }]}>CONTROLES</Text>

      <SoftCard radius={radii.card} padding={0}>
        <View style={s.ctrlList}>
          {/* Compras online */}
          <View style={[s.ctrlRow, { borderBottomColor: t.line }]}>
            <View style={s.ctrlLeft}>
              <SoftCard
                radius={radii.cardSm}
                padding={0}
                flat
                style={s.iconBox}
              >
                <View style={s.iconBoxInner}>
                  <Feather name="globe" size={19} color={t.ink} />
                </View>
              </SoftCard>
              <View>
                <Text style={[s.ctrlTitle, { color: t.ink }]}>
                  Compras online
                </Text>
                <View style={s.statusRow}>
                  <View
                    style={[
                      s.statusDot,
                      {
                        backgroundColor: isOnlineActive ? t.green : t.inkMute,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      s.ctrlSub,
                      { color: isOnlineActive ? t.green : t.inkMute },
                    ]}
                  >
                    {isOnlineActive ? "ativo" : "inativo"}
                  </Text>
                </View>
              </View>
            </View>
            <Switch
              value={isOnlineActive}
              onValueChange={setIsOnlineActive}
              trackColor={toggleTrack}
              thumbColor={isOnlineActive ? t.green : t.inkMute}
            />
          </View>

          {/* Bloqueio temporário */}
          <View style={[s.ctrlRow, { borderBottomColor: t.line }]}>
            <View style={s.ctrlLeft}>
              <SoftCard
                radius={radii.cardSm}
                padding={0}
                flat
                style={s.iconBox}
              >
                <View style={s.iconBoxInner}>
                  <Feather name="pause" size={19} color={t.ink} />
                </View>
              </SoftCard>
              <View>
                <Text style={[s.ctrlTitle, { color: t.ink }]}>
                  Bloqueio temporário
                </Text>
                <Text style={[s.ctrlSub, { color: t.inkMute }]}>
                  {isFrozen ? "cartão bloqueado" : "pausa o cartão na hora"}
                </Text>
              </View>
            </View>
            <Switch
              value={isFrozen}
              onValueChange={setIsFrozen}
              trackColor={toggleTrack}
              thumbColor={isFrozen ? t.green : t.inkMute}
            />
          </View>

          {/* Compras internacionais */}
          <View style={[s.ctrlRow, { borderBottomColor: t.line }]}>
            <View style={s.ctrlLeft}>
              <SoftCard
                radius={radii.cardSm}
                padding={0}
                flat
                style={s.iconBox}
              >
                <View style={s.iconBoxInner}>
                  <Feather name="navigation" size={19} color={t.ink} />
                </View>
              </SoftCard>
              <View>
                <Text style={[s.ctrlTitle, { color: t.ink }]}>
                  Compras internacionais
                </Text>
                <View style={s.statusRow}>
                  <View
                    style={[
                      s.statusDot,
                      {
                        backgroundColor: isInternationalActive
                          ? t.green
                          : t.inkMute,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      s.ctrlSub,
                      {
                        color: isInternationalActive ? t.green : t.inkMute,
                      },
                    ]}
                  >
                    {isInternationalActive ? "ativo" : "inativo"}
                  </Text>
                </View>
              </View>
            </View>
            <Switch
              value={isInternationalActive}
              onValueChange={setIsInternationalActive}
              trackColor={toggleTrack}
              thumbColor={isInternationalActive ? t.green : t.inkMute}
            />
          </View>

          {/* Limite por compra */}
          <TouchableOpacity
            style={[s.ctrlRow, { borderBottomWidth: 0 }]}
            activeOpacity={0.7}
          >
            <View style={s.ctrlLeft}>
              <SoftCard
                radius={radii.cardSm}
                padding={0}
                flat
                style={s.iconBox}
              >
                <View style={s.iconBoxInner}>
                  <Feather name="sliders" size={19} color={t.ink} />
                </View>
              </SoftCard>
              <View>
                <Text style={[s.ctrlTitle, { color: t.ink }]}>
                  Limite por compra
                </Text>
                <Text style={[s.ctrlSub, { color: t.inkMute }]}>
                  R$ 2.000,00
                </Text>
              </View>
            </View>
            <ChevronRightIcon size={16} color={t.inkMute} />
          </TouchableOpacity>
        </View>
      </SoftCard>

      {/* Bottom nav clearance */}
      <View style={s.bottomSpacer} />
    </ScrollView>
  );
};

const s = StyleSheet.create({
  scroller: { flex: 1 },

  /* Toast */
  toast: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  toastTxt: { fontFamily: fonts.sans.semibold, fontSize: 13 },

  /* Title */
  titleWrap: { marginTop: 8, marginBottom: 18 },
  title: {
    fontFamily: fonts.sans.bold,
    fontSize: 19,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  subtitle: { fontFamily: fonts.sans.medium, fontSize: 13 },

  /* Card wrapper */
  cardWrap: { marginBottom: 20, position: "relative" },
  frozenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(12,12,13,0.82)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  frozenBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 4,
  },
  frozenTxt: {
    fontFamily: fonts.mono.semibold,
    fontSize: 14,
    letterSpacing: 1.5,
  },

  /* Balance */
  section: { marginBottom: 12 },
  balRow: { flexDirection: "row", alignItems: "center" },
  balCol: { flex: 1 },
  balDivider: { width: 1, height: 38, marginHorizontal: 16 },
  balLbl: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  balVal: { fontFamily: fonts.sans.bold, fontSize: 17, letterSpacing: -0.4 },

  /* Hidden data */
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 20,
  },
  dataCell: {},
  dataCellWide: { flexShrink: 1 },
  dataLbl: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  dataVal: { fontFamily: fonts.mono.medium, fontSize: 15 },
  dataNumRevealed: {
    fontFamily: fonts.mono.regular,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  revealBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  revealTxt: { fontFamily: fonts.sans.semibold, fontSize: 12 },

  /* Actions */
  actionsRow: { flexDirection: "row", gap: 12, marginBottom: 26 },

  /* Controls */
  sectionTitle: {
    fontFamily: fonts.mono.semibold,
    fontSize: 11.5,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  ctrlList: { paddingHorizontal: 16, paddingVertical: 6 },
  ctrlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  ctrlLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  iconBox: { width: 44, height: 44 },
  iconBoxInner: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  ctrlTitle: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    marginBottom: 2,
  },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  ctrlSub: { fontFamily: fonts.sans.medium, fontSize: 12 },

  /* Spacer */
  bottomSpacer: { height: 80 },
});
