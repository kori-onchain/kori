import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts, radii } from '../../theme/tokens';
import { useTheme } from '../../theme/ThemeProvider';
import { SoftCard } from './SoftCard';
import { ChevronDownIcon, KoraGlyph, SolanaIcon } from './icons';

interface AccountSwitchProps {
  /** e.g. "TS" — derived from the active account name */
  initials: string;
  /** Tap handler (toggles the PF/PJ dropdown). */
  onPress?: () => void;
  /** Visual state of the dropdown (rotates the chevron if you want later). */
  expanded?: boolean;
  /** Show the small Solana badge on the avatar. */
  showWalletBadge?: boolean;
  /** Business accounts get the orange gradient avatar. */
  isPJ?: boolean;
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
  isPJ = false,
}) => {
  const { t } = useTheme();

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <SoftCard radius={radii.pill} padding={0}>
        <View style={styles.row}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: t.bgElev, borderColor: t.line },
            ]}
          >
            {isPJ && (
              <LinearGradient
                colors={[t.orangeDark, t.orange]}
                style={StyleSheet.absoluteFillObject}
              />
            )}
            {isPJ ? (
              <KoraGlyph size={14} color={t.ink} />
            ) : (
              <Text style={[styles.avatarText, { color: t.ink }]}>
                {initials}
              </Text>
            )}
            {showWalletBadge && (
              <View
                style={[
                  styles.solBadge,
                  { backgroundColor: t.bg, borderColor: t.line2 },
                ]}
              >
                <SolanaIcon width={8} height={6} color={t.inkDim} />
              </View>
            )}
          </View>
          <View style={styles.chevron}>
            <ChevronDownIcon
              size={13}
              color={t.inkDim}
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  avatarText: {
    fontFamily: fonts.sans.bold,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  solBadge: {
    position: 'absolute',
    bottom: -2,
    right: -3,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    // No additional offset — gap on row handles spacing.
  },
});
