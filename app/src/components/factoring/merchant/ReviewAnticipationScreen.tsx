import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import {
  MonoLabel,
  DetailRow,
  Divider,
  ComparisonGrid,
} from '../FactoringDS';
import {
  PaymentScreenFrame,
  PaymentPrimaryButton,
  PaymentCard,
} from '../../payment/PaymentDS';
import type { Receivable, AnticipationComparison } from '../../../types/factoring';

interface ReviewAnticipationScreenProps {
  receivable: Receivable;
  comparison: AnticipationComparison;
  onConfirm: () => void;
  onBack: () => void;
}

export const ReviewAnticipationScreen: React.FC<ReviewAnticipationScreenProps> = ({
  receivable,
  comparison,
  onConfirm,
  onBack,
}) => {
  const { t } = useTheme();

  return (
    <PaymentScreenFrame title="Revisar antecipação" onBack={onBack}>
      <MonoLabel>COMPARE ANTES DE CONFIRMAR</MonoLabel>
      <View style={{ height: 14 }} />

      <ComparisonGrid
        bankValue="R$ 930"
        bankDiscount="desconto 7%"
        koraValue="R$ 970"
        koraDiscount="desconto 3%"
      />

      <PaymentCard>
        <DetailRow label="Valor da nota" value="R$ 1.000,00" />
        <DetailRow
          label="Desconto (3%)"
          value="- R$ 30,00"
          valueColor={t.inkMute}
        />
        <DetailRow
          label="Você recebe"
          value="R$ 970,00"
          valueColor={t.green}
          valueBold
        />
        <Divider />
        <DetailRow
          label="Economia vs banco"
          value="+ R$ 40"
          valueColor={t.green}
        />
        <DetailRow
          label="Tempo"
          value="Instantâneo"
          valueColor={t.orange}
        />
      </PaymentCard>

      <View style={styles.footer}>
        <PaymentPrimaryButton
          label="Confirmar antecipação"
          onPress={onConfirm}
        />
      </View>
    </PaymentScreenFrame>
  );
};

const styles = StyleSheet.create({
  footer: {
    marginTop: 'auto',
    paddingTop: 14,
  },
});
