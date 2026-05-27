import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { fonts, radii } from '../../theme/tokens';
import { SoftCard } from '../ds/SoftCard';
import { MonoLabel, StatItem } from './FactoringDS';

interface PoolFactoringCardProps {
  onPress: () => void;
}

export const PoolFactoringCard: React.FC<PoolFactoringCardProps> = ({
  onPress,
}) => {
  const { t } = useTheme();

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <SoftCard
        radius={radii.card}
        padding={16}
        style={[styles.card, { borderColor: 'rgba(255,107,61,0.15)' }]}
      >
        <View style={styles.headerRow}>
          <MonoLabel color={t.orange} size={9}>
            NOVO
          </MonoLabel>
          <Text style={[styles.investCta, { color: t.orange }]}>
            invest {'→'}
          </Text>
        </View>

        <Text style={[styles.title, { color: t.ink }]}>
          Pool Factoring — Renda Real
        </Text>

        <View style={styles.statsRow}>
          <StatItem label="YIELD" value="~3%" valueColor={t.green} />
          <View style={[styles.statDivider, { borderLeftColor: t.line2 }]} />
          <StatItem label="MÍNIMO" value="R$50" />
          <View style={[styles.statDivider, { borderLeftColor: t.line2 }]} />
          <StatItem label="LASTRO" value="Recebíveis" />
        </View>
      </SoftCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  investCta: {
    fontFamily: fonts.sans.semibold,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontFamily: fonts.sans.semibold,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDivider: {
    borderLeftWidth: 1,
    height: 28,
    marginHorizontal: 2,
  },
});
