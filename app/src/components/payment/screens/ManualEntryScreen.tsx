import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '../../../icons';
import { PaymentRecipient } from '../../../types/payment';
import { MOCK_CONTACTS } from '../../../data/contacts';
import { useTheme } from '../../../theme/ThemeProvider';

const WALLET_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

interface ManualEntryScreenProps {
  onContinue: (recipient: PaymentRecipient) => void;
  onBack: () => void;
  onClose: () => void;
}

const resolveRecipient = (raw: string): PaymentRecipient | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Wallet address Solana
  if (WALLET_REGEX.test(trimmed)) {
    return {
      type: 'wallet',
      displayName: 'Anônimo',
      walletAddress: trimmed,
      isAnonymous: true,
      isFavorite: false,
    };
  }

  // ID de usuário (@handle ou sem @)
  const handle = trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
  const contact = MOCK_CONTACTS.find((c) => c.walletId === handle);

  return {
    type: 'id',
    displayName: contact?.name ?? trimmed.replace('@', ''),
    userId: handle,
    isAnonymous: false,
    isFavorite: contact?.isFavorite ?? false,
  };
};

export const ManualEntryScreen: React.FC<ManualEntryScreenProps> = ({ onContinue, onBack, onClose }) => {
  const { t } = useTheme();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const isWallet = WALLET_REGEX.test(value.trim());
  const isEmpty = value.trim().length === 0;

  const handleContinue = () => {
    const recipient = resolveRecipient(value);
    if (!recipient) {
      setError('Digite um ID válido (@usuario) ou endereço de carteira.');
      return;
    }
    setError('');
    onContinue(recipient);
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: t.bg }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: t.line }]}>
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={t.ink} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.ink }]}>Enviar para</Text>
        <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
          <Feather name="x" size={22} color={t.inkMute} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {/* Label */}
        <Text style={[styles.label, { color: t.inkMute }]}>ID ou Endereço de carteira</Text>

        {/* Input */}
        <View style={[styles.inputWrapper, { backgroundColor: t.bg2, borderColor: error ? '#FF3B30' : t.cardBorder }]}>
          <Feather
            name={isWallet ? 'shield' : 'at-sign'}
            size={18}
            color={isWallet ? t.sol : t.orange}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, { color: t.ink }]}
            placeholder="@usuario ou endereço da carteira"
            placeholderTextColor={t.inkMute}
            value={value}
            onChangeText={(t) => { setValue(t); setError(''); }}
            autoCorrect={false}
            autoCapitalize="none"
            autoFocus
          />
          {value.length > 0 && (
            <TouchableOpacity onPress={() => setValue('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="x-circle" size={18} color={t.inkMute} />
            </TouchableOpacity>
          )}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Type hint */}
        {!isEmpty && (
          <View style={[styles.typeTag, { backgroundColor: t.bg2 }]}>
            <Feather
              name={isWallet ? 'shield' : 'at-sign'}
              size={12}
              color={isWallet ? t.sol : t.orange}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.typeTagText, { color: isWallet ? t.sol : t.orange }]}>
              {isWallet ? 'Endereço de carteira (anônimo)' : 'ID de usuário'}
            </Text>
          </View>
        )}

        {isWallet && (
          <View style={[styles.anonymousNote, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
            <Feather name="eye-off" size={14} color={t.inkMute} style={{ marginRight: 8 }} />
            <Text style={[styles.anonymousNoteText, { color: t.inkMute }]}>
              Transação anônima — nenhum dado de identidade será exposto.
            </Text>
          </View>
        )}
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: t.orange }, isEmpty && styles.continueBtnDisabled]}
          onPress={handleContinue}
          activeOpacity={0.85}
          disabled={isEmpty}
        >
          <Text style={styles.continueBtnText}>Continuar</Text>
          <Feather name="arrow-right" size={18} color="#FFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 28 },
  label: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#2A2A2A',
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  inputWrapperError: { borderColor: '#FF3B30' },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 14,
  },
  errorText: { color: '#FF3B30', fontSize: 12, fontWeight: '500', marginTop: 8 },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,107,0,0.08)',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  typeTagText: { fontSize: 12, fontWeight: '600' },
  anonymousNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    padding: 14,
    backgroundColor: '#161616',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#242424',
  },
  anonymousNoteText: { flex: 1, color: '#8E8E93', fontSize: 12, lineHeight: 18 },
  footer: { paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, paddingTop: 16 },
  continueBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B00',
    borderRadius: 16,
    paddingVertical: 16,
  },
  continueBtnDisabled: { opacity: 0.4 },
  continueBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
