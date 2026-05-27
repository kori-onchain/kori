import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { fonts } from '../../../theme/tokens';
import { InvestIntent } from '../../../types/factoring';
import {
  MonoLabel,
  DetailRow,
  Divider,
  SuccessRing,
  TxHashBlock,
} from '../FactoringDS';
import {
  PaymentScreenFrame,
  PaymentPrimaryButton,
  PaymentCard,
} from '../../payment/PaymentDS';

interface InvestConfirmedScreenProps {
  intent: InvestIntent;
  onViewPosition: () => void;
}

export const InvestConfirmedScreen: React.FC<InvestConfirmedScreenProps> = ({
  intent,
  onViewPosition,
}) => {
  const { t } = useTheme();

  return (
    <PaymentScreenFrame
      title=""
      footer={
        <PaymentPrimaryButton
          label="Ver posição →"
          onPress={onViewPosition}
        />
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.center}>
          <SuccessRing icon="✓" borderColor={t.green} />
          <Text style={[styles.title, { color: t.ink }]}>
            Depósito confirmado
          </Text>
          <MonoLabel>Transação on-chain</MonoLabel>
        </View>

        <PaymentCard style={styles.card}>
          <DetailRow
            label="Investido"
            value={`R$ ${intent.amountBRL}`}
          />
          <DetailRow
            label="Pool"
            value={intent.pool.name}
          />
          <DetailRow
            label="Participação"
            value={intent.participation ?? '100%'}
            valueColor={t.sol}
          />
          <DetailRow
            label="Status"
            value="Ativo"
            valueColor={t.green}
          />
        </PaymentCard>

        {intent.txHash ? (
          <TxHashBlock
            hash={intent.txHash}
            caption="verificável no solana explorer"
          />
        ) : null}
      </ScrollView>
    </PaymentScreenFrame>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 8,
  },
  center: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 12,
  },
  title: {
    fontFamily: fonts.sans.bold,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: 6,
    marginTop: 4,
  },
  card: {
    marginBottom: 4,
  },
});
