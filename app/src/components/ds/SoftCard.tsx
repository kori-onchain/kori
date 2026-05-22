import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { radii } from '../../theme/tokens';
import { useTheme } from '../../theme/ThemeProvider';

interface SoftCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Override border radius (defaults to tokens.card = 16). */
  radius?: number;
  /** Padding inside the gradient. Pass 0 for layouts that draw their own. */
  padding?: number;
  /** Disable the Android elevation shadow when stacked inside scroll lists. */
  flat?: boolean;
  /** Stronger Android elevation for floating surfaces/popovers. */
  strong?: boolean;
}

/**
 * The DS workhorse. RN has no inset box-shadow, so we fake the "soft/glossy"
 * elevation by stacking:
 *   1. a top-to-bottom glossy surface from the active theme
 *   2. a 1px hairline at the top edge ("fio de luz")
 *   3. a hairline border + Android elevation for the outer drop shadow
 *
 * Use this as the base of every card, chip, pill and icon-container.
 */
export const SoftCard: React.FC<SoftCardProps> = ({
  children,
  style,
  radius = radii.card,
  padding,
  flat = false,
  strong = false,
}) => {
  const { t } = useTheme();
  const cardElevation = flat ? 0 : strong ? t.cardElevStrong : t.cardElev;

  return (
    <View
      style={[
        styles.outer,
        {
          borderRadius: radius,
          borderColor: t.cardBorder,
          backgroundColor: t.bg2,
          shadowColor: '#000',
          shadowOpacity: strong ? 0.22 : 0.16,
          shadowRadius: strong ? 12 : 8,
          shadowOffset: { width: 0, height: strong ? 8 : 5 },
          elevation: cardElevation,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={t.glossy}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.gradient,
          {
            borderRadius: radius,
            padding,
          },
        ]}
      >
        {/* Top hairline — the glossy edge */}
        <View
          pointerEvents="none"
          style={[
            styles.hairline,
            {
              borderTopLeftRadius: radius,
              borderTopRightRadius: radius,
              backgroundColor: t.hairline,
            },
          ]}
        />
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    borderWidth: 1,
    overflow: 'visible',
  },
  gradient: {
    overflow: 'hidden',
    // Content-sized in both axes — Yoga's default alignItems:'stretch'
    // already stretches us to the outer View's width. Setting height/width
    // to '100%' here creates a circular dependency that blows the layout up
    // when SoftCard is used inside a flex-row with siblings.
  },
  hairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
});
