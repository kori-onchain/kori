import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { colors, fonts, radii } from '../../theme/tokens';
import { SoftCard } from './SoftCard';
import { ChevronDownIcon, SolanaIcon } from './icons';

interface AccountSwitchProps {
  /** e.g. "TS" — derived from the active account name */
  initials: string;
  /** Tap handler (toggles the PF/PJ dropdown). */
  onPress?: () => void;
  /** Visual state of the dropdown (rotates the chevron if you want later). */
  expanded?: boolean;
  /** Show the small Solana badge on the avatar. */
  showWalletBadge?: boolean;
}

/**
 * Right-side header pill. Avatar (with optional Solana badge) + chevron.
 * No handle text — keeps the topbar visually clean. The PF/PJ switching
 * logic stays in Header.tsx.
 */
export const AccountSwitch: React.FC<AccountSwitchProps> = ({
  initials,
  onPress,
  showWalletBadge = true,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <SoftCard radius={radii.pill} padding={0}>
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
            {showWalletBadge && (
              <View style={styles.solBadge}>
                <SolanaIcon width={8} height={6} color={colors.inkDim} />
              </View>
            )}
          </View>
          <View style={styles.chevron}>
            <ChevronDownIcon
              size={13}
              color={colors.inkDim}
              strokeWidth={2}
            />
          </View>
        </View>
      </SoftCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 10,
    paddingVertical: 4,
    gap: 7,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bgElev,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    fontFamily: fonts.sans.bold,
    fontSize: 11,
    color: colors.ink,
    letterSpacing: 0.3,
  },
  solBadge: {
    position: 'absolute',
    bottom: -2,
    right: -3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    // No additional offset — gap on row handles spacing.
  },
});
