import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, radii } from '../../theme/tokens';
import { Button } from './Button';
import { SoftCard } from './SoftCard';
import {
  SendIcon,
  ReceiveIcon,
  SolanaIcon,
  CopyIcon,
  KoraGlyph,
} from './icons';

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
  /** Drives the leading icon: 'sol' for wallet, 'kora' for user-id. */
  walletKind?: 'sol' | 'kora';
  onCopyWallet?: () => void;
  label?: string;
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
  walletKind = 'sol',
  onCopyWallet,
  label = 'TOTAL BALANCE',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.valueRow}>
        <Text style={styles.valueInt}>{integer}</Text>
        <Text style={styles.valueDec}>{decimals}</Text>
      </View>

      {chips && chips.length > 0 && (
        <View style={styles.chipsRow}>
          {chips.map((c) => (
            <SoftCard key={c.label} radius={radii.pill} padding={0}>
              <View style={styles.chip}>
                <Text style={styles.chipLabel}>{c.label}</Text>
                <Text style={styles.chipValue}>{c.value}</Text>
              </View>
            </SoftCard>
          ))}
        </View>
      )}

      {walletHash && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onCopyWallet}
          style={styles.walletLine}
        >
          {walletKind === 'sol' ? (
            <SolanaIcon width={13} height={10} color={colors.inkDim} />
          ) : (
            <KoraGlyph size={11} color={colors.inkDim} />
          )}
          <Text style={styles.walletText}>{walletHash}</Text>
          <CopyIcon size={11} color={colors.inkFaint} strokeWidth={1.6} />
        </TouchableOpacity>
      )}

      <View style={styles.actionsRow}>
        <Button
          label="Enviar"
          variant="primary"
          full
          onPress={onSendPress}
          icon={<SendIcon size={16} color={colors.bg} strokeWidth={1.8} />}
        />
        <Button
          label="Receber"
          variant="secondary"
          full
          onPress={onReceivePress}
          icon={<ReceiveIcon size={16} color={colors.ink} strokeWidth={1.8} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 4,
    paddingHorizontal: 4,
  },
  label: {
    fontFamily: fonts.mono.medium,
    color: colors.inkMute,
    fontSize: 10,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  valueInt: {
    fontFamily: fonts.sans.bold,
    fontWeight: '700',
    color: colors.ink,
    fontSize: 45,
    letterSpacing: -1.8,
    lineHeight: 48,
  },
  valueDec: {
    fontFamily: fonts.sans.semibold,
    fontWeight: '600',
    color: colors.inkMute,
    fontSize: 27,
    letterSpacing: -0.5,
    lineHeight: 32,
    marginLeft: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 4,
  },
  chipLabel: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    color: colors.inkDim,
    letterSpacing: 0.3,
  },
  chipValue: {
    fontFamily: fonts.mono.semibold,
    fontSize: 9,
    color: colors.ink,
    letterSpacing: 0.3,
  },
  walletLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  walletText: {
    fontFamily: fonts.mono.medium,
    fontSize: 10,
    color: colors.inkMute,
    letterSpacing: 0.5,
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    paddingHorizontal: 4,
    marginTop: 22,
  },
});
