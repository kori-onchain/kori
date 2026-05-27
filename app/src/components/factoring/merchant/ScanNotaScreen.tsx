import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { fonts, radii } from '../../../theme/tokens';
import { MonoLabel, DetailRow } from '../FactoringDS';
import {
  PaymentScreenFrame,
  PaymentPrimaryButton,
  PaymentCard,
} from '../../payment/PaymentDS';
import type { Receivable } from '../../../types/factoring';
import { MOCK_RECEIVABLE } from '../../../data/factoring';

interface ScanNotaScreenProps {
  onContinue: (receivable: Receivable) => void;
  onClose: () => void;
}

export const ScanNotaScreen: React.FC<ScanNotaScreenProps> = ({
  onContinue,
  onClose,
}) => {
  const { t } = useTheme();
  const [detected, setDetected] = useState(false);
  const scanLineY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(scanLineY, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    );
    anim.start();

    const timer = setTimeout(() => {
      setDetected(true);
      anim.stop();
    }, 2500);

    return () => {
      anim.stop();
      clearTimeout(timer);
    };
  }, [scanLineY]);

  const translateY = scanLineY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 178],
  });

  return (
    <PaymentScreenFrame title="Registrar nota" onClose={onClose}>
      <MonoLabel>ESCANEIE OU PREENCHA</MonoLabel>
      <View style={{ height: 14 }} />

      <View style={styles.scanBox}>
        {!detected && (
          <Animated.View
            style={[
              styles.scanLine,
              { backgroundColor: t.orange, transform: [{ translateY }] },
            ]}
          />
        )}
      </View>

      {detected && (
        <>
          <View style={styles.detectedRow}>
            <View style={[styles.checkDot, { borderColor: t.green }]}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
            <View style={styles.detectedText}>
              <Text style={[styles.detectedTitle, { color: t.ink }]}>
                Nota detectada
              </Text>
              <MonoLabel color={t.inkMute} size={8}>
                {MOCK_RECEIVABLE.source}
              </MonoLabel>
            </View>
          </View>

          <View style={{ height: 14 }} />

          <PaymentCard>
            <DetailRow label="Valor" value="R$ 1.000,00" />
            <DetailRow label="Vencimento" value="25/jun/2026" />
            <DetailRow label="Pagador" value="Cielo S.A." />
          </PaymentCard>
        </>
      )}

      {detected && (
        <View style={styles.footer}>
          <PaymentPrimaryButton
            label="Continuar →"
            onPress={() => onContinue(MOCK_RECEIVABLE)}
          />
        </View>
      )}
    </PaymentScreenFrame>
  );
};

const styles = StyleSheet.create({
  scanBox: {
    height: 180,
    backgroundColor: '#000',
    borderRadius: radii.card,
    overflow: 'hidden',
    marginBottom: 16,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
  },
  detectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  checkDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: '#0a1a0f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 14,
    color: '#4ade80',
  },
  detectedText: {
    flex: 1,
    gap: 2,
  },
  detectedTitle: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 14,
  },
});
