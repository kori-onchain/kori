import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';
import { KoraGlyph, KoraWordmark } from './icons';

interface KoraLogoProps {
  /** Size of the K mark on the left (px). The wordmark on the right scales relative to it. */
  size?: number;
  color?: string;
  showWordmark?: boolean;
}

/**
 * Topbar lockup: the K glyph mark (left) + the official KORA text logo (right).
 * Both come straight from the brand SVG assets so spacing matches the spec.
 */
export const KoraLogo: React.FC<KoraLogoProps> = ({
  size = 22,
  color = colors.ink,
  showWordmark = true,
}) => (
  <View style={styles.row}>
    <KoraGlyph size={size} color={color} />
    {showWordmark && (
      <KoraWordmark height={Math.round(size * 0.55)} color={color} />
    )}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
});
