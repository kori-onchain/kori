import React from 'react';
import {
  Animated,
  Easing,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
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
  expanded = false,
  showWalletBadge = true,
  isPJ = false,
}) => {
  const { t } = useTheme();
  const openProgress = React.useRef(new Animated.Value(expanded ? 1 : 0)).current;
  const pressScale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(openProgress, {
      toValue: expanded ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [expanded, openProgress]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(pressScale, {
        toValue: 0.96,
        duration: 70,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(pressScale, {
        toValue: 1,
        speed: 18,
        bounciness: 5,
        useNativeDriver: true,
      }),
    ]).start();
    onPress?.();
  };

  const rotate = openProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const lift = openProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1],
  });

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
      <Animated.View
        style={{
          transform: [{ scale: pressScale }, { translateY: lift }],
        }}
      >
      <SoftCard
        radius={radii.pill}
        padding={0}
        style={[
          expanded && {
            borderColor: t.line2,
            shadowColor: t.orange,
            shadowOpacity: 0.18,
          },
        ]}
      >
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
          <Animated.View
            style={[styles.chevron, { transform: [{ rotate }] }]}
          >
            <ChevronDownIcon
              size={13}
              color={t.inkDim}
              strokeWidth={2}
            />
          </Animated.View>
        </View>
      </SoftCard>
      </Animated.View>
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
