import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import { BalanceHero } from "@components/layout/BalanceHero";
import { ReceiveDrawer } from "@components/home/drawers/ReceiveDrawer";

export type IdentityKind = "userId" | "wallet";

interface BalanceProps {
  onSendPress?: () => void;
  identity?: IdentityKind;
  pendingIdentity?: IdentityKind | null;
  userHandle?: string;
  walletHashFull?: string;
  walletHashShort?: string;
  balanceEntering?: any;
  actionsEntering?: any;
  accountType?: "PF" | "PJ";
  onSelectIdentity?: (id: IdentityKind) => void;
}

export const Balance: React.FC<BalanceProps> = ({
  onSendPress,
  identity = "userId",
  pendingIdentity = null,
  userHandle = "@opedrooz",
  walletHashFull = "7nxB2xT8aYqP9mZ1cR5vW4kL3jH6fD9gS8xV1nC4X1a",
  walletHashShort = "7nxB...4X1a",
  balanceEntering,
  actionsEntering,
  accountType,
  onSelectIdentity,
}) => {
  const [receiveVisible, setReceiveVisible] = useState(false);

  const activeIdentity = pendingIdentity || identity;
  const isWallet = activeIdentity === "wallet";
  const display = isWallet ? walletHashShort : userHandle;
  const copyValue = isWallet ? walletHashFull : userHandle;

  return (
    <View style={styles.container}>
      <BalanceHero
        integer="R$ 74.352"
        decimals=",93"
        walletHash={display}
        walletKind={isWallet ? "sol" : "kori"}
        onCopyWallet={() => Clipboard.setStringAsync(copyValue)}
        onSendPress={onSendPress}
        onReceivePress={() => setReceiveVisible(true)}
        balanceEntering={balanceEntering}
        actionsEntering={actionsEntering}
        accountType={accountType}
        onSelectIdentity={onSelectIdentity}
        userHandle={userHandle}
        walletHashShort={walletHashShort}
        walletHashFull={walletHashFull}
        pendingIdentity={pendingIdentity}
      />

      <ReceiveDrawer
        visible={receiveVisible}
        onClose={() => setReceiveVisible(false)}
        accountType={accountType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
});
