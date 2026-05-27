import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SoftCard } from '../ds/SoftCard';
import { useTheme } from '../../theme/ThemeProvider';
import { fonts, radii } from '../../theme/tokens';
import { MonoLabel } from './FactoringDS';

interface AnticipationCTACardProps {
  onPress: () => void;
}

export const AnticipationCTACard: React.FC<AnticipationCTACardProps> = ({
  onPress,
}) => {
  const { t } = useTheme();

  return (
    <SoftCard
      radius={radii.card}
      padding={20}
      style={[styles.card, { borderColor: 'rgba(255,107,61,0.2)' }]}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>⚡</Text>
        <Text style={[styles.title, { color: t.ink }]}>
          Precisa de capital hoje?
        </Text>
        <MonoLabel color={t.orange} size={9}>
          ANTECIPE SEU RECEBÍVEL EM SEGUNDOS
        </MonoLabel>
        <View style={{ height: 14 }} />
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onPress}
          style={[styles.button, { backgroundColor: t.orange }]}
        >
          <Text style={styles.buttonText}>Antecipar →</Text>
        </TouchableOpacity>
      </View>
    </SoftCard>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  content: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  title: {
    fontFamily: fonts.sans.semibold,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  button: {
    borderRadius: radii.btn,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});
