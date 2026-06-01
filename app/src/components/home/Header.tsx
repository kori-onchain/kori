
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { fonts, radii } from "@theme/tokens";
import { useTheme } from "@theme/ThemeProvider";
import { KoriLogo } from "@components/layout/KoriLogo";
import { AccountSwitch } from "@components/layout/AccountSwitch";
import {
  ChevronRightIcon,
  CopyIcon,
  KoriGlyph,
  SolanaIcon,
} from "@components/layout/icons";

type IdentityKind = "userId" | "wallet";

interface HeaderProps {
  onLogout?: () => void;
  userName?: string;
  username?: string;
  accountType?: "PF" | "PJ";
  onSwitchAccount?: (newType: "PF" | "PJ") => void;
  onAddAccount?: () => void;
  onProfilePress?: () => void;
  onScanPress?: () => void;
  /** Currently selected identity (User ID / Wallet) — drives the wallet line in BalanceHero. */
  identity?: IdentityKind;
  onSelectIdentity?: (id: IdentityKind) => void;
  userHandle?: string;
  walletHashFull?: string;
  walletHashShort?: string;
  accounts?: any[];
}

export const Header: React.FC<HeaderProps> = ({
  userName = "Pedro Henrique",
  accountType = "PF",
  onSwitchAccount,
  onAddAccount,
  onProfilePress,
  identity = "userId",
  onSelectIdentity,
  userHandle = "@opedrooz",
  walletHashFull = "7nxB2xT8aYqP9mZ1cR5vW4kL3jH6fD9gS8xV1nC4X1a",
  walletHashShort = "7nxB...4X1a",
  accounts = [],
}) => {
  const { t } = useTheme();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const pfAccount = accounts.find((a: any) => a.accountType === "PF");
  const pjAccount = accounts.find((a: any) => a.accountType === "PJ");

  const personalDisplayName = pfAccount?.name || userName.split(" ")[0];
  const businessDisplayName =
    pjAccount?.store?.name ||
    pjAccount?.businessName ||
    pjAccount?.name ||
    "Adicionar conta";

  const initials = personalDisplayName
    ? personalDisplayName
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "PH";

  const togglePopover = () => {
    setIsProfileDropdownOpen((v) => !v);
  };

  const copy = (text: string) => {
    Clipboard.setStringAsync(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.left}>
          <KoriLogo size={22} color={t.ink} />
        </View>

        <View style={styles.right}>
          <AccountSwitch
            initials={initials}
            expanded={isProfileDropdownOpen}
            onPress={togglePopover}
            isPJ={accountType === "PJ"}
          />
        </View>
      </View>

      {isProfileDropdownOpen && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: t.bg2,
              borderColor: t.cardBorder,
              shadowColor: "#000",
              elevation: t.cardElevStrong,
            },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: t.inkMute }]}>CONTA</Text>

          {/* VER PERFIL */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              setIsProfileDropdownOpen(false);
              onProfilePress?.();
            }}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.rowIcon,
                { backgroundColor: t.bgElev, borderColor: t.line },
              ]}
            >
              <KoriGlyph size={11} color={t.ink} />
            </View>
            <Text style={[styles.rowText, { color: t.ink }]} numberOfLines={1}>
              Ver perfil
            </Text>
            <ChevronRightIcon size={12} color={t.inkDim} />
          </TouchableOpacity>

          {/* OPÇÃO: CONTA PESSOA FÍSICA (PF) */}
          <TouchableOpacity
            style={[
              styles.row,
              accountType === "PF" && { backgroundColor: t.bgElev },
            ]}
            onPress={() => {
              if (accountType !== "PF") onSwitchAccount?.("PF");
              setIsProfileDropdownOpen(false);
            }}
            activeOpacity={0.8}
          >
            {/* Ícone customizado para PF com as iniciais */}
            <View style={[styles.rowIcon, { backgroundColor: t.bgElev, borderColor: t.line }]}>
              <Text style={[styles.dropdownInitials, { color: t.ink }]}>
                {initials}
              </Text>
            </View>
            <Text
              style={[
                styles.rowText,
                { color: accountType === "PF" ? t.ink : t.inkDim },
                accountType === "PF" && styles.rowTextActive,
              ]}
              numberOfLines={1}
            >
              {personalDisplayName}
            </Text>
            {accountType === "PF" && (
              <ChevronRightIcon size={12} color={t.orange} />
            )}
          </TouchableOpacity>

          {/* OPÇÃO: CONTA PESSOA JURÍDICA (PJ) */}
          <TouchableOpacity
            style={[
              styles.row,
              pjAccount && accountType === "PJ" && { backgroundColor: t.bgElev },
            ]}
            onPress={() => {
              if (pjAccount) {
                if (accountType !== "PJ") onSwitchAccount?.("PJ");
              } else {
                onAddAccount?.();
              }
              setIsProfileDropdownOpen(false);
            }}
            activeOpacity={0.8}
          >
            {/* Ícone customizado para PJ */}
            <View style={[styles.rowIcon, !pjAccount ? { backgroundColor: t.bgElev, borderColor: t.line } : { borderWidth: 0, overflow: "hidden" }]}>
              {pjAccount ? (
                <>
                  <LinearGradient
                    colors={[t.orangeDark, t.orange]}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <SolanaIcon size={11} color={t.ink} />
                </>
              ) : (
                <Text style={[styles.dropdownInitials, { color: t.inkDim, fontSize: 13, fontFamily: fonts.sans.bold }]}>+</Text>
              )}
            </View>
            <Text
              style={[
                styles.rowText,
                { color: pjAccount && accountType === "PJ" ? t.ink : t.inkDim },
                pjAccount && accountType === "PJ" && styles.rowTextActive,
              ]}
              numberOfLines={1}
            >
              {businessDisplayName}
            </Text>
            {pjAccount && accountType === "PJ" && (
              <ChevronRightIcon size={12} color={t.orange} />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
    position: "relative",
    zIndex: 1000,
    elevation: 1000,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
    zIndex: 1001,
    elevation: 1001,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dropdown: {
    position: "absolute",
    top: 48,
    right: 0,
    width: 270,
    borderRadius: radii.card,
    padding: 10,
    borderWidth: 1,
    zIndex: 2000,
    elevation: 2000,
  },
  sectionLabel: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
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
    position: "relative",
  },
  dropdownInitials: {
    fontFamily: fonts.sans.bold,
    fontSize: 9,
  },
  rowText: {
    flex: 1,
    fontFamily: fonts.sans.medium,
    fontSize: 13,
  },
  rowTextActive: {
    fontFamily: fonts.sans.semibold,
  },
});
