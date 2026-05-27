import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Feather } from '../../../icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { fonts, radii } from '../../../theme/tokens';
import { PoolInfo } from '../../../types/factoring';
import { brlToUsdc, BRL_TO_USDC_RATE } from '../../../data/factoring';
import { MonoLabel, DetailRow, Divider } from '../FactoringDS';
import {
  PaymentScreenFrame,
  PaymentPrimaryButton,
  PaymentCard,
} from '../../payment/PaymentDS';

interface InvestAmountScreenProps {
  pool: PoolInfo;
  userBalanceBRL: string;
  onConfirm: (amountBRL: string, amountUSDC: string) => void;
  onClose: () => void;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

const QUICK_AMOUNTS = [
  { label: 'R$50', value: '50' },
  { label: 'R$100', value: '100' },
  { label: 'R$500', value: '500' },
];

function formatBRL(raw: string): string {
  if (!raw) return 'R$ 0,00';
  const num = parseFloat(raw);
  if (isNaN(num)) return 'R$ 0,00';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatBalanceBRL(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return 'R$ 0,00';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export const InvestAmountScreen: React.FC<InvestAmountScreenProps> = ({
  pool,
  userBalanceBRL,
  onConfirm,
  onClose,
}) => {
  const { t } = useTheme();
  const [raw, setRaw] = useState('');

  const amount = raw || '0';
  const numericAmount = parseFloat(amount) || 0;
  const isZero = numericAmount === 0;
  const balanceNum = parseFloat(userBalanceBRL) || 0;

  const handleKey = (key: string) => {
    if (key === '⌫') {
      setRaw((prev) => prev.slice(0, -1));
      return;
    }
    if (key === '.' && raw.includes('.')) return;
    if (raw.length >= 10) return;
    setRaw((prev) => prev + key);
  };

  const handleQuickAmount = (value: string) => {
    setRaw(value);
  };

  const handleAll = () => {
    setRaw(String(balanceNum));
  };

  const usdcAmount = brlToUsdc(numericAmount);

  return (
    <PaymentScreenFrame
      title="Quanto investir?"
      onClose={onClose}
      footer={
        <PaymentPrimaryButton
          label="Confirmar"
          disabled={isZero}
          onPress={() => onConfirm(amount, usdcAmount)}
          icon={<Feather name="arrow-right" size={16} color={t.btnPrimaryFg} />}
        />
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.poolLabel}>
          <MonoLabel>Pool Factoring — Renda Real</MonoLabel>
        </View>

        <View style={styles.amountArea}>
          <Text style={[styles.amount, { color: isZero ? t.inkFaint : t.ink }]}>
            {formatBRL(raw)}
          </Text>
        </View>

        <View style={styles.keypad}>
          {KEYS.map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.key,
                {
                  backgroundColor: key === '⌫' ? t.bgElev : t.bg2,
                  borderColor: t.cardBorder,
                },
              ]}
              onPress={() => handleKey(key)}
              activeOpacity={0.7}
            >
              {key === '⌫' ? (
                <Feather name="delete" size={22} color={t.ink} />
              ) : (
                <Text style={[styles.keyText, { color: t.ink }]}>{key}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickRow}>
          {QUICK_AMOUNTS.map((qa) => (
            <TouchableOpacity
              key={qa.value}
              style={[styles.quickPill, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}
              onPress={() => handleQuickAmount(qa.value)}
              activeOpacity={0.75}
            >
              <Text style={[styles.quickPillText, { color: t.ink }]}>
                {qa.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.quickPill, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}
            onPress={handleAll}
            activeOpacity={0.75}
          >
            <Text style={[styles.quickPillText, { color: t.orange }]}>Tudo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.balanceRow}>
          <Text style={[styles.balanceLabel, { color: t.inkMute }]}>
            SALDO DISPON{'Í'}VEL: {formatBalanceBRL(userBalanceBRL)}
          </Text>
        </View>

        <PaymentCard style={styles.detailCard}>
          <DetailRow label="Depósito" value={formatBRL(raw)} />
          <DetailRow
            label="Convertido"
            value={`${usdcAmount} USDC`}
            valueColor={t.sol}
          />
          <DetailRow
            label="Fee da rede"
            value="~R$ 0,01"
            valueColor={t.inkMute}
          />
        </PaymentCard>
      </ScrollView>
    </PaymentScreenFrame>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 8,
  },
  poolLabel: {
    alignItems: 'center',
    marginBottom: 8,
  },
  amountArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  amount: {
    fontFamily: fonts.sans.bold,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1.2,
    textAlign: 'center',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    paddingBottom: 10,
  },
  key: {
    width: '31.8%',
    minHeight: 50,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 22,
    fontWeight: '700',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    marginBottom: 10,
  },
  quickPill: {
    flex: 1,
    borderRadius: radii.btn,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  quickPillText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    fontWeight: '700',
  },
  balanceRow: {
    alignItems: 'center',
    marginBottom: 14,
  },
  balanceLabel: {
    fontFamily: fonts.mono.semibold,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  detailCard: {
    marginBottom: 4,
  },
});
