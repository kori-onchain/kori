import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { useTheme } from "@theme/ThemeProvider";
import { Header } from "@components/home/Header";
import { MerchantPanel } from "@components/merchant/MerchantPanel";
import { Transaction } from "@/data/transactions";
import { IdentityKind } from "@components/home/Balance";

interface MerchantScreenProps {
  headerProps: React.ComponentProps<typeof Header>;
  /** Starts on dashboard (default) or ecommerce */
  initialView?: "dashboard" | "ecommerce";
  onSendPress?: () => void;
  onSeeAllTransactions?: () => void;
  transactions?: Transaction[];
  identity?: IdentityKind;
  userHandle?: string;
  walletHashFull?: string;
  walletHashShort?: string;
  balanceInteger?: string;
  balanceDecimals?: string;
}

export const MerchantScreen: React.FC<MerchantScreenProps> = ({
  headerProps,
  initialView = "dashboard",
  onSendPress,
  onSeeAllTransactions,
  transactions,
  identity,
  userHandle,
  walletHashFull,
  walletHashShort,
  balanceInteger,
  balanceDecimals,
}) => {
  const { t } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: t.bg }]}>
      <View style={[styles.safeArea, { backgroundColor: t.bg }]}>
        <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} translucent />
        <View style={styles.headerLayer}>
          <Header {...headerProps} />
        </View>
        <View style={styles.content}>
          <MerchantPanel
            initialView={initialView}
            onSendPress={onSendPress}
            onSeeAllTransactions={onSeeAllTransactions}
            transactions={transactions}
            identity={identity}
            userHandle={userHandle}
            walletHashFull={walletHashFull}
            walletHashShort={walletHashShort}
            balanceInteger={balanceInteger}
            balanceDecimals={balanceDecimals}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerLayer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    zIndex: 1000,
    elevation: 1000,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
