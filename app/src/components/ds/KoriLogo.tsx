import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts } from '../../theme/tokens';
import { useTheme } from '../../theme/ThemeProvider';
import { KoriGlyph } from './icons';

interface KoriLogoProps {
  /** Size of the K glyph on the left (px). */
  size?: number;
  color?: string;
  showWordmark?: boolean;
}

/**
 * Topbar lockup: K glyph (SVG, left) + "KORI" wordmark in Geist (right).
 */
export const KoriLogo: React.FC<KoriLogoProps> = ({
  size = 22,
  color,
  showWordmark = true,
}) => {
  const { t } = useTheme();
  const resolvedColor = color ?? t.ink;

  return (
    <View style={styles.row}>
      <KoriGlyph size={size} color={resolvedColor} />
      {showWordmark && (
        <Text style={[styles.wordmark, { color: resolvedColor }]}>KORI</Text>
      )}
    </View>
  );
};

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
