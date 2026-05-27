import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SoftCard } from '../ds/SoftCard';
import { KoriGlyph as IconK } from '../ds/icons';
import { fonts } from '../../theme/tokens';
import { useTheme } from '../../theme/ThemeProvider';

export type NftPillType = 'founder' | 'ingresso' | 'vip' | 'default';

interface NftPillProps {
  name: string;
  category: string;
  type?: NftPillType;
}

const GRADIENTS: Record<Exclude<NftPillType, 'default'>, readonly [string, string]> = {
  founder: ['#ff6b3d', '#d94d20'],
  ingresso: ['#9945ff', '#5a1f9e'],
  vip: ['#9945ff', '#5a1f9e'],
};

export const NftPill: React.FC<NftPillProps> = ({
  name,
  category,
  type = 'default',
}) => {
  const { t } = useTheme();
  const gradient = type === 'default' ? null : GRADIENTS[type];

  return (
    <SoftCard radius={999} padding={0} flat>
      <View style={styles.content}>
        {gradient ? (
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.thumb}
          >
            <IconK size={13} color="#ffffff" />
          </LinearGradient>
        ) : (
          <View style={[styles.thumb, { backgroundColor: t.bgElev }]}>
            <IconK size={13} color="#ffffff" />
          </View>
        )}

        <View>
          <Text style={[styles.name, { color: t.ink }]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.category, { color: t.inkMute }]} numberOfLines={1}>
            {category.toUpperCase()}
          </Text>
        </View>
      </View>
    </SoftCard>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingLeft: 7,
    paddingRight: 12,
    paddingVertical: 7,
    flexShrink: 0,
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  name: {
    fontFamily: fonts.sans.semibold,
    fontSize: 12,
    lineHeight: 13,
  },
  category: {
    fontFamily: fonts.mono.medium,
    fontSize: 7,
    lineHeight: 9,
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
