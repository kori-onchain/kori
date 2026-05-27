import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { BalanceHero } from './ds/BalanceHero';
import { ReceiveDrawer } from './ReceiveDrawer';

export type IdentityKind = 'userId' | 'wallet';

interface BalanceProps {
  onSendPress?: () => void;
  identity?: IdentityKind;
  userHandle?: string;
  walletHashFull?: string;
  walletHashShort?: string;
  balanceEntering?: any;
  actionsEntering?: any;
}

export const Balance: React.FC<BalanceProps> = ({
  onSendPress,
  identity = 'wallet',
  userHandle = '@opedrooz',
  walletHashFull = '7nxB2xT8aYqP9mZ1cR5vW4kL3jH6fD9gS8xV1nC4X1a',
  walletHashShort = '7nxB...4X1a',
  balanceEntering,
  actionsEntering,
}) => {
  const [receiveVisible, setReceiveVisible] = useState(false);

  const isWallet = identity === 'wallet';
  const display = isWallet ? walletHashShort : userHandle;
  const copyValue = isWallet ? walletHashFull : userHandle;

  return (
    <View style={styles.container}>
      <BalanceHero
        integer="R$ 74.352"
        decimals=",93"
        walletHash={display}
        walletKind={isWallet ? 'sol' : 'kori'}
        onCopyWallet={() => Clipboard.setStringAsync(copyValue)}
        onSendPress={onSendPress}
        onReceivePress={() => setReceiveVisible(true)}
        balanceEntering={balanceEntering}
        actionsEntering={actionsEntering}
      />

      <ReceiveDrawer
        visible={receiveVisible}
        onClose={() => setReceiveVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
});
