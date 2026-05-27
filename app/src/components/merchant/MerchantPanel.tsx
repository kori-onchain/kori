import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useTheme } from "@theme/ThemeProvider";
import { fonts } from "@theme/tokens";
import { useFadeUp } from "@hooks/useFadeUp";
import { SalesReports } from "@components/merchant/SalesReports";
import { EcommercePanel } from "@components/merchant/EcommercePanel";
import { Balance, IdentityKind } from "@components/home/Balance";
import { Transactions } from "@components/home/Transactions";
import { Transaction } from "@/data/transactions";

type SubView = "dashboard" | "ecommerce";

interface MerchantPanelProps {
  initialView?: SubView;
  onSendPress?: () => void;
  onSeeAllTransactions?: () => void;
  transactions?: Transaction[];
  identity?: IdentityKind;
  userHandle?: string;
  walletHashFull?: string;
  walletHashShort?: string;
}

export const MerchantPanel: React.FC<MerchantPanelProps> = ({
  initialView = "dashboard",
  onSendPress,
  onSeeAllTransactions,
  transactions,
  identity,
  userHandle,
  walletHashFull,
  walletHashShort,
}) => {
  const { t } = useTheme();
  const entering = useFadeUp();

  if (initialView === "ecommerce") {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg }}>
        <Animated.View entering={entering(140)} style={{ flex: 1 }}>
          <EcommercePanel />
        </Animated.View>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: t.bg }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: t.bg }]}
    >
      {/* Balance com botões de receber e pagar */}
      <Animated.View entering={entering(100)}>
        <Balance
          identity={identity}
          userHandle={userHandle}
          walletHashFull={walletHashFull}
          walletHashShort={walletHashShort}
          onSendPress={onSendPress}
          accountType="PJ"
        />
      </Animated.View>

      {/* Relatórios + mais vendidos */}
      <Animated.View entering={entering(160)}>
        <SalesReports />
      </Animated.View>

      {/* Transações recentes */}
      <Animated.View entering={entering(240)}>
        <Transactions
          transactions={transactions}
          onSeeAll={onSeeAllTransactions}
        />
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  tabStrip: {
    flexDirection: "row",
    gap: 24,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  tabBtn: {
    paddingTop: 4,
    paddingBottom: 0,
    alignItems: "center",
  },
  tabLabel: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    letterSpacing: 0.1,
    paddingBottom: 10,
  },
  tabUnderline: {
    height: 2,
    width: "100%",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
});
