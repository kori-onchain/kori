import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Clipboard from "expo-clipboard";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Feather, Ionicons } from "@/icons";
import { fonts, radii } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "@components/layout/Button";
import { SoftCard } from "@components/layout/SoftCard";
import {
  SendIcon,
  ReceiveIcon,
  SolanaIcon,
  CopyIcon,
  KoriGlyph,
} from "./icons";

export interface BalanceChip {
  /** e.g. "BRL" */
  label: string;
  /** e.g. "R$ 64.680" */
  value: string;
}

interface BalanceHeroProps {
  /** Integer portion, formatted by caller — e.g. "R$ 74.352" */
  integer: string;
  /** Cents with the leading comma — e.g. ",93" */
  decimals: string;
  onSendPress?: () => void;
  onReceivePress?: () => void;
  /** Optional sub-balance pills shown right below the value. */
  chips?: BalanceChip[];
  /** Truncated wallet hash or user handle (e.g. "7xKj...9aBc" or "@opedrooz"). */
  walletHash?: string;
  /** Drives the leading icon: 'sol' for wallet, 'kori' for user-id. */
  walletKind?: "sol" | "kori";
  onCopyWallet?: () => void;
  label?: string;
  balanceEntering?: any;
  actionsEntering?: any;
  accountType?: "PF" | "PJ";
  onSelectIdentity?: (id: "wallet" | "userId") => void;
  userHandle?: string;
  walletHashShort?: string;
  walletHashFull?: string;
  pendingIdentity?: "wallet" | "userId" | null;
}

/**
 * Total-balance hero: mono label → solid white value (decimals dimmed)
 *  → sub-balance chips → wallet line → Enviar/Receber.
 */
export const BalanceHero: React.FC<BalanceHeroProps> = ({
  integer,
  decimals,
  onSendPress,
  onReceivePress,
  chips,
  walletHash,
  walletKind = "sol",
  onCopyWallet,
  label = "TOTAL BALANCE",
  balanceEntering,
  actionsEntering,
  accountType = "PF",
  onSelectIdentity,
  userHandle = "@opedrooz",
  walletHashShort = "7nxB...4X1a",
  walletHashFull = "",
  pendingIdentity = null,
}) => {
  const { t, scheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const activeIdentity = pendingIdentity || (walletKind === "sol" ? "wallet" : "userId");
  const opacity = useSharedValue(walletKind === "sol" ? 0.04 : 0);


  useEffect(() => {
    opacity.value = withTiming(walletKind === "sol" ? 0.04 : 0, {
      duration: 600,
    });
  }, [walletKind]);

  const animatedWatermarkStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const copy = (text: string) => {
      Clipboard.setStringAsync(text);
    };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: -200,
            bottom: -200,
            left: 0,
            right: -20,
            zIndex: -1,
            overflow: "hidden",
          },
          animatedWatermarkStyle,
        ]}
      >
        <Feather
          name="eye-off"
          size={260}
          color={t.ink}
          style={{
            position: "absolute",
            right: -95,
            top: "50%",
            transform: [{ translateY: -130 }],
          }}
        />
      </Animated.View>
      <Animated.View entering={balanceEntering} style={styles.balanceBlock}>
        <Text style={[styles.label, { color: t.inkMute }]}>{label}</Text>

        <View style={styles.valueRow}>
          <Text style={[styles.valueInt, { color: t.ink }]}>{integer}</Text>
          <Text style={[styles.valueDec, { color: t.inkMute }]}>
            {decimals}
          </Text>
        </View>

        {chips && chips.length > 0 && (
          <View style={styles.chipsRow}>
            {chips.map((c) => (
              <SoftCard key={c.label} radius={radii.pill} padding={0}>
                <View style={styles.chip}>
                  <Text style={[styles.chipLabel, { color: t.inkDim }]}>
                    {c.label}
                  </Text>
                  <Text style={[styles.chipValue, { color: t.ink }]}>
                    {c.value}
                  </Text>
                </View>
              </SoftCard>
            ))}
          </View>
        )}

        {walletHash && (
          <View style={{ position: "relative", alignItems: "center", zIndex: 1000, overflow: "visible" }}>
            <View style={styles.walletLineRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (accountType === "PF") {
                    setShowDropdown(!showDropdown);
                  } else {
                    onCopyWallet?.();
                  }
                }}
                onLongPress={onCopyWallet}
                style={styles.walletLine}
              >
                {walletKind === "sol" ? (
                  <Ionicons name="wallet-outline" size={15} color={t.inkDim} style={{ marginRight: 6 }} />
                ) : (
                  <Feather name="at-sign" size={14} color={t.inkDim} style={{ marginRight: 6 }} />
                )}
                
                <Text style={[styles.walletText, { color: t.ink }]}>
                  {walletKind === "kori" ? walletHash.replace("@", "") : walletHash}
                </Text>

                {accountType === "PF" && (
                  <Feather name="chevron-down" size={13} color={t.inkDim} style={{ marginLeft: 6 }} />
                )}
              </TouchableOpacity>
            </View>

            {/* Dropdown Menu (PF only) - Float above everything */}
            {showDropdown && accountType === "PF" && (
              <View
                style={[
                  styles.inlineDropdown,
                  {
                    backgroundColor: t.bg,
                    borderColor: t.inkFaint,
                    borderWidth: 1.2,
                    shadowColor: "#000",
                    shadowOpacity: 0.15,
                    shadowOffset: { width: 0, height: 6 },
                    shadowRadius: 12,
                    elevation: 10,
                  }
                ]}
              >

          <TouchableOpacity
            style={[
              styles.row,
              activeIdentity === "userId"
                ? { backgroundColor: `${t.orange}08`, borderColor: `${t.orange}30`, borderWidth: 1 }
                : { backgroundColor: "transparent", borderColor: "transparent", borderWidth: 1 }
            ]}
            onPress={() => {
              onSelectIdentity?.("userId");
              setShowDropdown(false);
            }}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.rowIcon,
                { backgroundColor: t.bgElev, borderColor: activeIdentity === "userId" ? `${t.orange}40` : t.line },
              ]}
            >
              <KoriGlyph size={14} color={activeIdentity === "userId" ? t.orange : t.ink} />
            </View>
            <View style={styles.identityText}>
              <Text style={[styles.identityLabel, { color: activeIdentity === "userId" ? t.orange : t.inkMute }]}>
                USER ID
              </Text>
              <Text
                style={[styles.identityValue, { color: t.ink }]}
                numberOfLines={1}
              >
                {userHandle}
              </Text>
            </View>
            {activeIdentity === "userId" ? (
              <Feather name="check" size={15} color={t.orange} style={{ marginRight: 6 }} />
            ) : (
              <TouchableOpacity
                hitSlop={8}
                onPress={() => copy(userHandle)}
                style={styles.copyBtn}
                activeOpacity={0.7}
              >
                <CopyIcon size={14} color={t.inkDim} strokeWidth={1.6} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.row,
              activeIdentity === "wallet"
                ? { backgroundColor: `${t.orange}08`, borderColor: `${t.orange}30`, borderWidth: 1 }
                : { backgroundColor: "transparent", borderColor: "transparent", borderWidth: 1 }
            ]}
            onPress={() => {
              onSelectIdentity?.("wallet");
              setShowDropdown(false);
            }}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.rowIcon,
                { backgroundColor: t.bgElev, borderColor: activeIdentity === "wallet" ? `${t.orange}40` : t.line },
              ]}
            >
              <SolanaIcon width={14} height={11} color={activeIdentity === "wallet" ? t.orange : t.ink} />
            </View>
            <View style={styles.identityText}>
              <Text style={[styles.identityLabel, { color: activeIdentity === "wallet" ? t.orange : t.inkMute }]}>
                WALLET
              </Text>
              <Text
                style={[styles.identityValue, { color: t.ink }]}
                numberOfLines={1}
              >
                {walletHashShort}
              </Text>
            </View>
            {activeIdentity === "wallet" ? (
              <Feather name="check" size={15} color={t.orange} style={{ marginRight: 6 }} />
            ) : (
              <TouchableOpacity
                hitSlop={8}
                onPress={() => copy(walletHashFull)}
                style={styles.copyBtn}
                activeOpacity={0.7}
              >
                <CopyIcon size={14} color={t.inkDim} strokeWidth={1.6} />
              </TouchableOpacity> 
            )}
          </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </Animated.View>

      <Animated.View entering={actionsEntering} style={styles.actionsRow}>
        {/* Enviar Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onSendPress}
          style={[
            styles.customActionBtn,
            {
              backgroundColor: scheme === "dark" ? "#1A1A1E" : "#101012",
            },
          ]}
        >
          <View style={styles.customActionCircleLeft}>
            <Feather
              name="arrow-up"
              size={16}
              color={scheme === "dark" ? "#1A1A1E" : "#101012"}
            />
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 32,
            }}
          >
            <Text style={styles.customActionText}>Send</Text>
          </View>
        </TouchableOpacity>

        {/* Receber Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onReceivePress}
          style={[
            styles.customActionBtn,
            {
              backgroundColor: scheme === "dark" ? "#1A1A1E" : "#101012",
            },
          ]}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingRight: 32,
            }}
          >
            <Text style={styles.customActionText}>Receive</Text>
          </View>
          <View style={styles.customActionCircleRight}>
            <Feather
              name="arrow-down"
              size={16}
              color={scheme === "dark" ? "#1A1A1E" : "#101012"}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 22,
    paddingBottom: 4,
    paddingHorizontal: 4,
  },
  balanceBlock: {
    alignItems: "center",
    zIndex: 999,
    overflow: "visible",
  },
  label: {
    fontFamily: fonts.mono.medium,
    fontSize: 10,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  valueInt: {
    fontFamily: fonts.sans.bold,
    fontWeight: "700",
    fontSize: 45,
    letterSpacing: -1.8,
    lineHeight: 48,
  },
  valueDec: {
    fontFamily: fonts.sans.semibold,
    fontWeight: "600",
    fontSize: 27,
    letterSpacing: -0.5,
    lineHeight: 32,
    marginLeft: 1,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 4,
  },
  chipLabel: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    letterSpacing: 0.3,
  },
  chipValue: {
    fontFamily: fonts.mono.semibold,
    fontSize: 9,
    letterSpacing: 0.3,
  },
  walletLineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    zIndex: 1000,
  },
  walletLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  walletText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  inlineDropdown: {
    position: "absolute",
    top: 42,
    width: 220,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 6,
    gap: 4,
    zIndex: 9999,
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    overflow: "hidden",
  },
  dropdownClickArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  dropdownItemText: {
    fontFamily: fonts.mono.medium,
    fontSize: 11,
    letterSpacing: 0.2,
  },
  dropdownCopyBtn: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 22,
    width: "100%",
  },
  customActionBtn: {
    width: 145,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  customActionCircleLeft: {
    position: "absolute",
    left: 7,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  customActionCircleRight: {
    position: "absolute",
    right: 7,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  customActionText: {
    color: "#FFFFFF",
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    fontWeight: "600",
  },
row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 2,
    gap: 8,
  },
   rowIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  identityText: {
    flex: 1,
  },
  identityLabel: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    letterSpacing: 1.0,
  },
  identityValue: {
    fontFamily: fonts.mono.medium,
    fontSize: 12,
    marginTop: 1,
    letterSpacing: 0.3,
  },
  copyBtn: {
    padding: 6,
  },
});
