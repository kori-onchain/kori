import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { fonts, radii } from '../../../theme/tokens';
import { InvestIntent } from '../../../types/factoring';
import { MonoLabel, DetailRow, Divider, BigBalance } from '../FactoringDS';
import {
  PaymentScreenFrame,
  PaymentPrimaryButton,
  PaymentSecondaryButton,
  PaymentCard,
} from '../../payment/PaymentDS';

interface InvestPositionScreenProps {
  intent: InvestIntent;
  onWithdraw: () => void;
  onReinvest: () => void;
}

export const InvestPositionScreen: React.FC<InvestPositionScreenProps> = ({
  intent,
  onWithdraw,
  onReinvest,
}) => {
  const { t } = useTheme();

  return (
    <PaymentScreenFrame
      title=""
      footer={
        <View style={styles.footerButtons}>
          <PaymentPrimaryButton
            label="Sacar rendimento"
            onPress={onWithdraw}
            style={{ backgroundColor: t.green }}
          />
          <View style={styles.footerSpacer} />
          <PaymentSecondaryButton
            label="Reinvestir no pool"
            onPress={onReinvest}
          />
        </View>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: t.ink }]}>Sua posição</Text>
          <MonoLabel>{intent.pool.name}</MonoLabel>
        </View>

        <PaymentCard style={styles.card}>
          <DetailRow
            label="Depositado"
            value={`R$ ${intent.amountBRL}`}
          />
          <DetailRow
            label="Operações financiadas"
            value={String(intent.operationsFinanced ?? 1)}
          />
          <DetailRow
            label="Status"
            value="Liquidado ✓"
            valueColor={t.green}
          />
        </PaymentCard>

        <BigBalance
          label="Rendimento Disponível"
          value={`+ R$ ${intent.yieldNet ?? '29,70'}`}
          color={t.green}
        />

        <View style={styles.yieldHint}>
          <MonoLabel>{`~${intent.yieldPct ?? '2.97'}% NESTA OPERAÇÃO`}</MonoLabel>
        </View>
      </ScrollView>
    </PaymentScreenFrame>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
  },
  title: {
    fontFamily: fonts.sans.bold,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  card: {
    marginBottom: 8,
  },
  yieldHint: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  footerButtons: {
    gap: 10,
  },
  footerSpacer: {
    height: 0,
  },
});
