import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { fonts } from '../../../theme/tokens';
import { MonoLabel } from '../FactoringDS';
import { PaymentCard } from '../../payment/PaymentDS';

interface ProcessingScreenProps {
  onComplete: () => void;
}

type StepStatus = 'pending' | 'done';

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  onComplete,
}) => {
  const { t } = useTheme();
  const [step1, setStep1] = useState<StepStatus>('pending');
  const [step2, setStep2] = useState<StepStatus>('pending');
  const [step3, setStep3] = useState<StepStatus>('pending');

  useEffect(() => {
    const t1 = setTimeout(() => setStep1('done'), 400);
    const t2 = setTimeout(() => setStep2('done'), 1000);
    const t3 = setTimeout(() => setStep3('done'), 1600);
    const tDone = setTimeout(onComplete, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tDone);
    };
  }, [onComplete]);

  const renderStep = (label: string, status: StepStatus) => (
    <View style={styles.stepRow}>
      <Text
        style={[
          styles.stepLabel,
          { color: status === 'done' ? t.green : t.inkMute },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.stepStatus,
          { color: status === 'done' ? t.green : t.inkMute },
        ]}
      >
        {status === 'done' ? 'Confirmado ✓' : 'Pendente...'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <MonoLabel>PROCESSANDO ON-CHAIN</MonoLabel>
        <View style={{ height: 16 }} />

        <Text style={[styles.timer, { color: t.green }]}>0.4s</Text>
        <MonoLabel>TEMPO DE LIQUIDAÇÃO</MonoLabel>

        <View style={{ height: 28 }} />

        <PaymentCard>
          {renderStep('Registrar nota', step1)}
          {renderStep('Transferir USDC', step2)}
          {renderStep('Atualizar saldo', step3)}
        </PaymentCard>

        <View style={{ height: 20 }} />
        <MonoLabel size={8}>2 TRANSAÇÕES · ~R$ 0,002 DE FEE</MonoLabel>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 40,
  },
  center: {
    alignItems: 'center',
  },
  timer: {
    fontFamily: fonts.sans.bold,
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: -1.5,
    marginBottom: 6,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  stepLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    fontWeight: '500',
  },
  stepStatus: {
    fontFamily: fonts.mono.medium,
    fontSize: 11,
  },
});
