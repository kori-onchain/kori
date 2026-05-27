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

interface InvestWithdrawnScreenProps {
  intent: InvestIntent;
  onDone: () => void;
}

export const InvestWithdrawnScreen: React.FC<InvestWithdrawnScreenProps> = ({
  intent,
  onDone,
}) => {
  const { t } = useTheme();

  return (
    <PaymentScreenFrame
      title=""
      footer={
        <PaymentPrimaryButton
          label="Início"
          onPress={onDone}
        />
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.center}>
          <SuccessRing icon="💰" borderColor={t.orange} />
          <Text style={[styles.title, { color: t.ink }]}>
            Rendimento sacado
          </Text>
          <MonoLabel>{`R$ ${intent.yieldNet ?? '29,70'} na sua conta`}</MonoLabel>
        </View>

        <PaymentCard style={styles.card}>
          <DetailRow
            label="Yield bruto"
            value={`R$ ${intent.yieldGross ?? '30,00'}`}
          />
          <DetailRow
            label={`Protocolo (${intent.protocolFeePct ?? 1}%)`}
            value={`-R$ ${intent.protocolFee ?? '0,30'}`}
            valueColor={t.inkMute}
          />
          <DetailRow
            label="Recebido"
            value={`R$ ${intent.yieldNet ?? '29,70'}`}
            valueColor={t.green}
          />
          <Divider />
          <DetailRow
            label="Saldo total"
            value={`R$ ${intent.finalBalanceBRL ?? '1.029,70'}`}
            valueBold
          />
        </PaymentCard>

        {intent.withdrawTxHash ? (
          <TxHashBlock
            hash={intent.withdrawTxHash}
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
