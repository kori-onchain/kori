import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { Feather } from "../icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "../theme/ThemeProvider";
import { Button } from "./ds/Button";
import { SoftCard } from "./ds/SoftCard";
import { colors, fonts, radii } from "../theme/tokens";

const { width } = Dimensions.get("window");

interface CardsPanelProps {
  userName?: string;
}

export const CardsPanel: React.FC<CardsPanelProps> = ({ userName }) => {
  const { t } = useTheme();
  const [cardNumber, setCardNumber] = useState("5421 9843 7261 8294");
  const [expiry] = useState("08/29");
  const [cvv, setCvv] = useState("842");
  const [isCvvVisible, setIsCvvVisible] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [isOnlineActive, setIsOnlineActive] = useState(true);
  const [limitUsed] = useState(1842);
  const [limitTotal, setLimitTotal] = useState(5000);
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [limitInput, setLimitInput] = useState("5000");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastOpacity = useState(new Animated.Value(0))[0];
  const cardScale = useState(new Animated.Value(1))[0];

  const displayName = (userName || "KAUÃ M.").toUpperCase();
  const limitPercent = Math.min(1, limitUsed / limitTotal);

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

  const handleCopyDetails = async () => {
    const fullText = `Cartão Kora Virtual\nNome: ${displayName}\nNúmero: ${cardNumber}\nValidade: ${expiry}\nCVV: ${cvv}`;
    await Clipboard.setStringAsync(fullText);
    showToast("Dados do cartão copiados!");
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

    const b1 = Math.floor(1000 + Math.random() * 9000).toString();
    const b2 = Math.floor(1000 + Math.random() * 9000).toString();
    setCardNumber(`5421 ${b1} ${b2} 8294`);
    setCvv(Math.floor(100 + Math.random() * 900).toString());
    showToast("Novo cartão virtual gerado!");
  };

  const handleSaveLimit = () => {
    const val = parseInt(limitInput.replace(/[^0-9]/g, ""));
    if (!isNaN(val) && val > 0) {
      setLimitTotal(val);
      setIsEditingLimit(false);
      showToast(
        `Limite mensal atualizado para R$ ${val.toLocaleString("pt-BR")}`,
      );
    } else {
      showToast("Por favor, insira um valor válido");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      showsVerticalScrollIndicator={false}
    >
      {toastMessage && (
        <Animated.View
          style={[
            styles.toast,
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
          <Text style={[styles.toastText, { color: t.ink }]}>
            {toastMessage}
          </Text>
        </Animated.View>
      )}

      <Animated.View
        style={[styles.cardContainer, { transform: [{ scale: cardScale }] }]}
      >
        <View style={styles.card}>
          <LinearGradient
            colors={[t.orangeDark, t.orange, t.bg2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.cardGridPattern} />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.chip} />
              <View style={styles.brandContainer}>
                <Feather
                  name="shield"
                  size={16}
                  color={t.ink}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.brandText}>KORA • VIRTUAL</Text>
              </View>
            </View>

            <View style={styles.cardNumberContainer}>
              <Text style={styles.cardNumberText}>
                {isFrozen ? "••••  ••••  ••••  ••••" : cardNumber}
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardHolderLabel}>PORTADOR</Text>
                <Text style={styles.cardHolderName}>{displayName}</Text>
              </View>
              <View style={styles.circlesContainer}>
                <View
                  style={[
                    styles.circle,
                    { backgroundColor: "#FF5F00", marginRight: -8 },
                  ]}
                />
                <View
                  style={[
                    styles.circle,
                    { backgroundColor: "#F79E1B", opacity: 0.85 },
                  ]}
                />
              </View>
            </View>
          </View>

          {isFrozen && (
            <View style={styles.frozenOverlay}>
              <View style={styles.frozenBadge}>
                <Feather
                  name="lock"
                  size={20}
                  color={t.orange}
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.frozenBadgeText, { color: t.orange }]}>
                  CONGELADO
                </Text>
              </View>
            </View>
          )}
        </View>
      </Animated.View>

      <View style={styles.detailsRow}>
        <SoftCard radius={radii.card} padding={16} style={styles.detailCard}>
          <Text style={[styles.detailTitle, { color: t.inkMute }]}>
            VALIDADE
          </Text>
          <Text style={[styles.detailValue, { color: t.ink }]}>{expiry}</Text>
        </SoftCard>

        <SoftCard radius={radii.card} padding={16} style={styles.detailCard}>
          <Text style={[styles.detailTitle, { color: t.inkMute }]}>CVV</Text>
          <View style={styles.cvvContainer}>
            <Text style={[styles.detailValue, { color: t.ink }]}>
              {isCvvVisible ? cvv : "•••"}
            </Text>
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setIsCvvVisible(!isCvvVisible)}
              activeOpacity={0.7}
            >
              <Feather
                name={isCvvVisible ? "eye-off" : "eye"}
                size={18}
                color={t.inkMute}
              />
            </TouchableOpacity>
          </View>
        </SoftCard>
      </View>

      <View style={styles.actionsRow}>
        <Button
          label="Copiar dados"
          onPress={handleCopyDetails}
          full
          icon={<Feather name="copy" size={16} color={t.btnPrimaryFg} />}
        />

        <Button
          label="Novo virtual"
          variant="secondary"
          onPress={handleGenerateNewCard}
          full
          icon={<Feather name="plus" size={16} color={t.ink} />}
        />
      </View>

      <Text style={[styles.sectionHeader, { color: t.inkMute }]}>
        CONTROLES
      </Text>

      <SoftCard radius={radii.card} padding={0} style={styles.controlsList}>
        <View style={[styles.controlRow, { borderBottomColor: t.line }]}>
          <View style={styles.controlLeft}>
            <SoftCard
              radius={radii.cardSm}
              padding={0}
              flat
              style={styles.iconBox}
            >
              <View style={styles.iconBoxInner}>
                <Feather name="globe" size={19} color={t.ink} />
              </View>
            </SoftCard>
            <View>
              <Text style={[styles.controlTitle, { color: t.ink }]}>
                Compras online
              </Text>
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: isOnlineActive ? t.green : t.inkMute },
                  ]}
                />
                <Text style={[styles.controlSubtitle, { color: t.inkMute }]}>
                  {isOnlineActive ? "ativo" : "inativo"}
                </Text>
              </View>
            </View>
          </View>
          <Switch
            value={isOnlineActive}
            onValueChange={setIsOnlineActive}
            trackColor={{ false: t.inkFaint, true: t.line2 }}
            thumbColor={isOnlineActive ? t.green : t.inkMute}
            ios_backgroundColor={t.inkFaint}
          />
        </View>

        <View style={[styles.controlRow, { borderBottomColor: t.line }]}>
          <View style={styles.controlLeft}>
            <SoftCard
              radius={radii.cardSm}
              padding={0}
              flat
              style={styles.iconBox}
            >
              <View style={styles.iconBoxInner}>
                <Feather name="pause" size={19} color={t.ink} />
              </View>
            </SoftCard>
            <View>
              <Text style={[styles.controlTitle, { color: t.ink }]}>
                Bloqueio temporário
              </Text>
              <Text style={[styles.controlSubtitle, { color: t.inkMute }]}>
                {isFrozen ? "cartão bloqueado" : "tap pra pausar"}
              </Text>
            </View>
          </View>
          <Switch
            value={isFrozen}
            onValueChange={setIsFrozen}
            trackColor={{ false: t.inkFaint, true: t.line2 }}
            thumbColor={isFrozen ? t.green : t.inkMute}
            ios_backgroundColor={t.inkFaint}
          />
        </View>
      </SoftCard>

      <View style={styles.limitHeaderRow}>
        <Text style={[styles.sectionHeader, { color: t.inkMute }]}>
          LIMITE MENSAL
        </Text>
        <TouchableOpacity
          onPress={() => setIsEditingLimit(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.editLinkText, { color: t.orange }]}>
            editar ➔
          </Text>
        </TouchableOpacity>
      </View>

      <SoftCard radius={radii.card} padding={20} style={styles.limitPanel}>
        {isEditingLimit ? (
          <View style={styles.limitEditContainer}>
            <TextInput
              style={[
                styles.limitInput,
                { backgroundColor: t.bg, borderColor: t.line, color: t.ink },
              ]}
              keyboardType="number-pad"
              value={limitInput}
              onChangeText={setLimitInput}
              placeholder="Digite o limite"
              placeholderTextColor={t.inkMute}
              autoFocus
            />
            <View style={styles.limitEditActions}>
              <TouchableOpacity
                style={styles.limitCancelBtn}
                onPress={() => setIsEditingLimit(false)}
              >
                <Text style={[styles.limitCancelText, { color: t.inkMute }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <Button label="Salvar" onPress={handleSaveLimit} />
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.limitValuesRow}>
              <Text style={[styles.limitUsedText, { color: t.inkMute }]}>
                Usado{" "}
                <Text style={[styles.boldText, { color: t.ink }]}>
                  R$ {limitUsed.toLocaleString("pt-BR")}
                </Text>{" "}
                de R$ {limitTotal.toLocaleString("pt-BR")}
              </Text>
            </View>
            <View
              style={[styles.progressBarBg, { backgroundColor: t.inkFaint }]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${limitPercent * 100}%`, backgroundColor: t.green },
                ]}
              />
            </View>
          </View>
        )}
      </SoftCard>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  toast: {
    position: "absolute",
    top: 10,
    left: 20,
    right: 20,
    backgroundColor: colors.green,
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
    color: colors.bg,
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    textAlign: "center",
  },
  cardContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  card: {
    width: "100%",
    height: 210,
    borderRadius: 24,
    backgroundColor: colors.bgElev,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: colors.line2,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  cardGridPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.04,
    borderWidth: 1,
    borderColor: colors.ink,
    borderStyle: "dashed",
  },
  cardContent: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    zIndex: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chip: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.inkDim,
    opacity: 0.8,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandText: {
    color: colors.ink,
    fontSize: 13.5,
    fontFamily: fonts.sans.bold,
    letterSpacing: 1.5,
  },
  cardNumberContainer: {
    marginVertical: 14,
  },
  cardNumberText: {
    color: colors.ink,
    fontSize: 22,
    fontFamily: fonts.mono.medium,
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardHolderLabel: {
    color: colors.inkDim,
    fontSize: 9,
    fontFamily: fonts.mono.medium,
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardHolderName: {
    color: colors.ink,
    fontSize: 13,
    fontFamily: fonts.sans.semibold,
    letterSpacing: 1,
  },
  circlesContainer: {
    flexDirection: "row",
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  frozenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(13, 13, 13, 0.82)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  frozenBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgElev,
    borderWidth: 1,
    borderColor: colors.orange,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  frozenBadgeText: {
    color: colors.orange,
    fontFamily: fonts.mono.semibold,
    fontSize: 14,
    letterSpacing: 1,
  },
  detailsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  detailCard: {
    flex: 1,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.inkFaint,
    borderRadius: 16,
    padding: 16,
    justifyContent: "center",
  },
  detailTitle: {
    color: colors.inkDim,
    fontSize: 10,
    fontFamily: fonts.mono.medium,
    letterSpacing: 1,
    marginBottom: 6,
  },
  cvvContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailValue: {
    color: colors.ink,
    fontSize: 18,
    fontFamily: fonts.sans.bold,
  },
  eyeBtn: {
    padding: 4,
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
    backgroundColor: colors.green,
    borderRadius: 14,
    paddingVertical: 14,
  },
  primaryActionText: {
    color: colors.bg,
    fontSize: 14,
    fontFamily: fonts.sans.semibold,
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.inkFaint,
    borderRadius: 14,
    paddingVertical: 14,
  },
  secondaryActionText: {
    color: colors.ink,
    fontSize: 14,
    fontFamily: fonts.sans.semibold,
  },
  sectionHeader: {
    color: colors.inkDim,
    fontSize: 11.5,
    fontFamily: fonts.mono.semibold,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  controlsList: {
    backgroundColor: colors.bg2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inkFaint,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 26,
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.line,
  },
  controlLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
  },
  iconBoxInner: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  controlTitle: {
    color: colors.ink,
    fontSize: 14,
    fontFamily: fonts.sans.semibold,
    marginBottom: 2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.inkDim,
  },
  statusDotActive: {
    backgroundColor: colors.green,
  },
  controlSubtitle: {
    color: colors.inkDim,
    fontSize: 12,
    fontFamily: fonts.sans.medium,
  },
  limitHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  editLinkText: {
    color: colors.orange,
    fontSize: 12,
    fontFamily: fonts.sans.semibold,
  },
  limitPanel: {
    backgroundColor: colors.bg2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inkFaint,
    padding: 20,
  },
  limitValuesRow: {
    marginBottom: 12,
  },
  limitUsedText: {
    color: colors.inkDim,
    fontSize: 13,
    fontFamily: fonts.sans.medium,
  },
  boldText: {
    color: colors.ink,
    fontFamily: fonts.sans.bold,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.inkFaint,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.green,
    borderRadius: 4,
  },
  limitEditContainer: {
    gap: 12,
  },
  limitInput: {
    backgroundColor: colors.inkFaint,
    borderRadius: 12,
    color: colors.ink,
    fontSize: 16,
    fontFamily: fonts.sans.semibold,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.line2,
  },
  limitEditActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  limitCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  limitCancelText: {
    color: colors.inkDim,
    fontFamily: fonts.sans.semibold,
  },
  limitSaveBtn: {
    backgroundColor: colors.green,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  limitSaveText: {
    color: colors.bg,
    fontFamily: fonts.sans.bold,
  },
});
