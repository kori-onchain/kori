import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme/tokens';
import { KoraGlyph } from './icons';

interface KoraLogoProps {
  /** Size of the K glyph on the left (px). */
  size?: number;
  color?: string;
  showWordmark?: boolean;
}

/**
 * Topbar lockup: K glyph (SVG, left) + "KORA" wordmark in Geist (right).
 */
export const KoraLogo: React.FC<KoraLogoProps> = ({
  size = 22,
  color = colors.ink,
  showWordmark = true,
}) => (
  <View style={styles.row}>
    <KoraGlyph size={size} color={color} />
    {showWordmark && (
      <Text style={[styles.wordmark, { color }]}>KORA</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordmark: {
    fontFamily: fonts.sans.bold,
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
