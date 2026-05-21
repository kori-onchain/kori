import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, elevation } from '../../theme/tokens';

interface SoftCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Override border radius (defaults to tokens.card = 16). */
  radius?: number;
  /** Padding inside the gradient. Pass 0 for layouts that draw their own. */
  padding?: number;
  /** Disable the Android elevation shadow when stacked inside scroll lists. */
  flat?: boolean;
}

/**
 * The DS workhorse. RN has no inset box-shadow, so we fake the "soft/glossy"
 * elevation by stacking:
 *   1. a top→bottom dark gradient (#1e1e23 → #16161a)
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
}) => {
  return (
    <View
      style={[
        styles.outer,
        {
          borderRadius: radius,
          elevation: flat ? 0 : elevation.card,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[colors.softTop, colors.softBottom]}
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
    borderColor: colors.line,
    backgroundColor: colors.bg2, // fallback under the gradient
    overflow: 'hidden',
  },
  gradient: {
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
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});
