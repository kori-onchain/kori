import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { fonts } from '../../../theme/tokens';
import {
  MonoLabel,
  DetailRow,
  SuccessRing,
  BigBalance,
  TxHashBlock,
} from '../FactoringDS';
import {
  PaymentPrimaryButton,
  PaymentSecondaryButton,
  PaymentCard,
} from '../../payment/PaymentDS';
import type { AnticipationIntent } from '../../../types/factoring';

interface AnticipationSuccessScreenProps {
  intent: AnticipationIntent;
  onPayBills: () => void;
  onDone: () => void;
}

export const AnticipationSuccessScreen: React.FC<AnticipationSuccessScreenProps> = ({
  intent,
  onPayBills,
  onDone,
}) => {
  const { t } = useTheme();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <SuccessRing icon="⚡" borderColor={t.orange} />

      <Text style={[styles.title, { color: t.ink }]}>Dinheiro na conta!</Text>
      <MonoLabel>ANTECIPAÇÃO EM 0.4S</MonoLabel>

      <BigBalance
        label="NOVO SALDO"
        value="R$ 1.090"
        previousValue="R$ 120"
        color={t.green}
      />

      <PaymentCard>
        <DetailRow
          label="Recebido"
          value="+ R$ 970"
          valueColor={t.green}
        />
        <DetailRow
          label="Desconto"
          value="R$ 30 (3%)"
          valueColor={t.inkMute}
        />
        <DetailRow
          label="No banco seria"
          value="R$ 70 (7%)"
          valueColor={t.inkMute}
          valueStrike
        />
        <DetailRow
          label="Economizou"
          value="R$ 40"
          valueColor={t.green}
        />
      </PaymentCard>

      {intent.txHash && (
        <TxHashBlock
          hash={intent.txHash}
          caption="ninguém aprovou manualmente · contrato executou"
        />
      )}

      <View style={styles.buttons}>
        <PaymentPrimaryButton label="Pagar contas →" onPress={onPayBills} />
        <View style={{ height: 10 }} />
        <PaymentSecondaryButton label="Início" onPress={onDone} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.sans.bold,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  buttons: {
    width: '100%',
    marginTop: 20,
  },
});
