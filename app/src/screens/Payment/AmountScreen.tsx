import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Feather } from "@/icons";
import { PaymentRecipient } from "@type/payment";
import { useTheme } from "@theme/ThemeProvider";
import { fonts } from "@theme/tokens";

interface AmountScreenProps {
  recipient: PaymentRecipient;
  onContinue: (amount: string) => void;
  onBack: () => void;
  onClose: () => void;
}

// Phone-style keypad: [digit, sub-label]
const KEYPAD_ROWS: [string, string][][] = [
  [["1", ""], ["2", "ABC"], ["3", "DEF"]],
  [["4", "GHI"], ["5", "JKL"], ["6", "MNO"]],
  [["7", "PQRS"], ["8", "TUV"], ["9", "WXYZ"]],
  [[".", ""], ["0", ""], ["⌫", ""]],
];

const PRESETS = ["25", "50", "100", "1000"];

export const AmountScreen: React.FC<AmountScreenProps> = ({
  recipient,
  onContinue,
  onBack,
  onClose,
}) => {
  const { t, scheme } = useTheme();
  const [raw, setRaw] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const isZero = !raw || Number.parseFloat(raw.replace(",", ".")) === 0;

  const handleKey = (key: string) => {
    if (key === "⌫") {
      setRaw((prev) => prev.slice(0, -1));
      setSelectedPreset(null);
      return;
    }
    if (key === "," && raw.includes(",")) return;
    if (raw.length >= 10) return;
    setRaw((prev) => prev + key);
    setSelectedPreset(null);
  };

  const handlePreset = (value: string) => {
    setRaw(value);
    setSelectedPreset(value);
  };

  const displayAmount = raw ? `R$ ${raw}` : "R$ 0";

  const keyBg = scheme === "dark" ? "#1a1a1e" : "#e4e4e8";
  const keyBgDelete = scheme === "dark" ? "#111114" : "#d4d4d8";

  const presetActiveBg = t.btnPrimaryBg;
  const presetActiveText = t.btnPrimaryFg;
  const presetInactiveBg = scheme === "dark" ? "#1a1a1e" : "#e4e4e8";
  const presetInactiveText = t.inkDim;

  return (
    <View style={[styles.root, { backgroundColor: t.bg }]}>
      <StatusBar
        barStyle={t.statusBar}
        backgroundColor={t.bg}
        translucent={false}
      />
      <SafeAreaView style={styles.safe}>
        {/* ── Header ── */}
        <View style={[styles.header, { borderBottomColor: t.line }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack}
            style={styles.headerBtn}
          >
            <Feather name="arrow-left" size={22} color={t.ink} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: t.ink }]}>
            Enviar valor
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            style={styles.headerBtn}
          >
            <Feather name="x" size={22} color={t.inkDim} />
          </TouchableOpacity>
        </View>

        {/* ── Spacer + Amount display (grows to push keypad down) ── */}
        <View style={styles.amountArea}>
          <Text style={[styles.titleText, { color: t.ink }]}>
            Inserir valor
          </Text>
          <Text style={[styles.subtitleText, { color: t.inkMute }]}>
            Digite o valor e toque em continuar
          </Text>

          <Text
            style={[
              styles.amountText,
              { color: isZero ? t.inkFaint : t.ink },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {displayAmount}
          </Text>
        </View>

        {/* ── Bottom block: presets + button + keypad ── */}
        <View style={styles.bottomBlock}>
          {/* Preset chips */}
          <View style={styles.presetsRow}>
            {PRESETS.map((val) => {
              const active = selectedPreset === val;
              return (
                <TouchableOpacity
                  key={val}
                  activeOpacity={0.75}
                  onPress={() => handlePreset(val)}
                  style={[
                    styles.presetChip,
                    {
                      backgroundColor: active
                        ? presetActiveBg
                        : presetInactiveBg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.presetText,
                      {
                        color: active ? presetActiveText : presetInactiveText,
                      },
                    ]}
                  >
                    R${val}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Continue button */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={isZero}
            onPress={() => !isZero && onContinue(raw)}
            style={[
              styles.continueBtn,
              {
                backgroundColor: t.btnPrimaryBg,
                opacity: isZero ? 0.35 : 1,
              },
            ]}
          >
            <Text style={[styles.continueBtnText, { color: t.btnPrimaryFg }]}>
              Continuar
            </Text>
          </TouchableOpacity>

          {/* Keypad */}
          <View style={styles.keypad}>
            {KEYPAD_ROWS.map((row, rowIdx) => (
              <View key={rowIdx} style={styles.keyRow}>
                {row.map(([digit, sub]) => {
                  const isDelete = digit === "⌫";
                  return (
                    <TouchableOpacity
                      key={digit}
                      activeOpacity={0.55}
                      onPress={() => handleKey(digit)}
                      style={[
                        styles.key,
                        {
                          backgroundColor: isDelete ? keyBgDelete : keyBg,
                        },
                      ]}
                    >
                      {isDelete ? (
                        <Feather name="delete" size={22} color={t.inkDim} />
                      ) : (
                        <View style={styles.keyInner}>
                          <Text
                            style={[styles.keyDigit, { color: t.ink }]}
                          >
                            {digit}
                          </Text>
                          {sub ? (
                            <Text
                              style={[styles.keySub, { color: t.inkMute }]}
                            >
                              {sub}
                            </Text>
                          ) : null}
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  // ── Header ──
  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: fonts.sans.semibold,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  // ── Amount area (flex grow) ──
  amountArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  titleText: {
    fontFamily: fonts.sans.bold,
    fontSize: 22,
    letterSpacing: -0.4,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitleText: {
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    textAlign: "center",
    marginBottom: 28,
  },
  amountText: {
    fontFamily: fonts.sans.bold,
    fontSize: 56,
    letterSpacing: -2.5,
    textAlign: "center",
  },
  // ── Bottom block ──
  bottomBlock: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
  },
  presetsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
  },
  presetChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 50,
  },
  presetText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
  },
  continueBtn: {
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  continueBtnText: {
    fontFamily: fonts.sans.bold,
    fontSize: 16,
    letterSpacing: 0.1,
  },
  // ── Keypad ──
  keypad: {
    gap: 8,
  },
  keyRow: {
    flexDirection: "row",
    gap: 8,
  },
  key: {
    flex: 1,
    height: 58,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  keyInner: {
    alignItems: "center",
    gap: 1,
  },
  keyDigit: {
    fontFamily: fonts.sans.semibold,
    fontSize: 24,
    lineHeight: 28,
  },
  keySub: {
    fontFamily: fonts.sans.medium,
    fontSize: 8,
    letterSpacing: 0.8,
  },
});
