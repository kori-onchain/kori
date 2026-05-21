import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts } from '../../theme/tokens';
import { SoftCard } from './SoftCard';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  /** Stretch to fill grid cells / parent width. */
  full?: boolean;
}

/**
 * Kora DS button. Three variants:
 *  - primary:   subtle white→light gradient, black text + soft top hairline.
 *               The hero CTA (Enviar).
 *  - secondary: SoftCard glossy bg, white text. Paired with primary in 1fr 1fr.
 *  - ghost:     transparent, just text + icon.
 */
export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  style,
  labelStyle,
  full = false,
}) => {
  const contentColor =
    variant === 'primary' ? colors.bg : colors.ink;

  const content = (
    <View style={styles.inner}>
      {icon && iconPosition === 'left' && (
        <View style={styles.iconLeft}>{icon}</View>
      )}
      <Text style={[styles.label, { color: contentColor }, labelStyle]}>
        {label}
      </Text>
      {icon && iconPosition === 'right' && (
        <View style={styles.iconRight}>{icon}</View>
      )}
    </View>
  );

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[full && styles.full, style]}
      >
        <SoftCard radius={radii.btn} padding={14}>
          {content}
        </SoftCard>
      </TouchableOpacity>
    );
  }

  if (variant === 'ghost') {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[styles.ghost, full && styles.full, style]}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.primaryOuter, full && styles.full, style]}
    >
      <LinearGradient
        colors={['#ffffff', '#f0f0f2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.primaryGradient}
      >
        {/* "fio de luz" branco no topo (matches HTML mock inset shadow) */}
        <View pointerEvents="none" style={styles.primaryHairline} />
        {content}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
  primaryOuter: {
    borderRadius: radii.btn,
    overflow: 'hidden',
    elevation: 4,
  },
  primaryGradient: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.btn,
  },
  primaryHairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  ghost: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  label: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});
