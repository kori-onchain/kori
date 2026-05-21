import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PaymentRecipient } from '../../../types/payment';
import { COLORS } from '../../../constants/colors';

interface AmountScreenProps {
  recipient: PaymentRecipient;
  onContinue: (amount: string) => void;
  onBack: () => void;
  onClose: () => void;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

const formatDisplay = (raw: string): string => {
  if (!raw || raw === '0') return 'R$ 0,00';
  const num = parseFloat(raw.replace(',', '.'));
  if (isNaN(num)) return 'R$ 0,00';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const AmountScreen: React.FC<AmountScreenProps> = ({ recipient, onContinue, onBack, onClose }) => {
  const [raw, setRaw] = useState('');

  const handleKey = (key: string) => {
    if (key === '⌫') {
      setRaw((prev) => prev.slice(0, -1));
      return;
    }
    if (key === '.' && raw.includes('.')) return;
    if (raw.length >= 10) return;
    setRaw((prev) => prev + key);
  };

  const amount = raw || '0';
  const isZero = parseFloat(amount.replace(',', '.')) === 0 || !raw;

  const initials = recipient.isAnonymous
    ? '?'
    : (recipient.displayName || '').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quanto enviar?</Text>
        <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
          <Feather name="x" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Recipient chip */}
      <View style={styles.recipientChip}>
        <View style={[styles.chipAvatar, recipient.isAnonymous && styles.chipAvatarAnon]}>
          {recipient.isAnonymous
            ? <Feather name="eye-off" size={16} color="#8E8E93" />
            : <Text style={styles.chipInitials}>{initials}</Text>
          }
        </View>
        <Text style={styles.chipName} numberOfLines={1}>
          Para: {recipient.displayName}
        </Text>
        <Text style={styles.chipId} numberOfLines={1}>
          {recipient.isAnonymous
            ? `${(recipient.walletAddress ?? '').slice(0, 6)}...${(recipient.walletAddress ?? '').slice(-4)}`
            : recipient.userId}
        </Text>
      </View>

      {/* Amount display */}
      <View style={styles.amountDisplay}>
        <Text style={[styles.amountText, isZero && styles.amountTextEmpty]}>
          {formatDisplay(raw)}
        </Text>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {KEYS.map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.key, key === '⌫' && styles.keyBackspace]}
            onPress={() => handleKey(key)}
            activeOpacity={0.65}
          >
            {key === '⌫'
              ? <Feather name="delete" size={22} color="#FFF" />
              : <Text style={styles.keyText}>{key}</Text>
            }
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueBtn, isZero && styles.continueBtnDisabled]}
          onPress={() => onContinue(amount)}
          activeOpacity={0.85}
          disabled={isZero}
        >
          <Text style={styles.continueBtnText}>Continuar</Text>
          <Feather name="arrow-right" size={18} color="#FFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  headerBtn: { padding: 4, width: 36 },
  headerTitle: { color: '#FFF', fontSize: 16, fontWeight: '800', flex: 1, textAlign: 'center' },

  recipientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#161616',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#242424',
    gap: 8,
    maxWidth: '80%',
  },
  chipAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2A2040',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipAvatarAnon: { backgroundColor: '#1E1E1E' },
  chipInitials: { color: '#9B8BFF', fontSize: 11, fontWeight: '700' },
  chipName: { color: '#FFF', fontSize: 13, fontWeight: '600', flex: 1 },
  chipId: { color: '#8E8E93', fontSize: 11, fontWeight: '500' },

  amountDisplay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  amountText: {
    color: '#FFF',
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
    textAlign: 'center',
  },
  amountTextEmpty: { color: '#3A3A3A' },

  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 4,
  },
  key: {
    width: '31%',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E1E1E',
    marginBottom: 4,
  },
  keyBackspace: { backgroundColor: '#111' },
  keyText: { color: '#FFF', fontSize: 22, fontWeight: '600' },

  footer: { paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, paddingTop: 16 },
  continueBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B00',
    borderRadius: 16,
    paddingVertical: 16,
  },
  continueBtnDisabled: { opacity: 0.35 },
  continueBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
