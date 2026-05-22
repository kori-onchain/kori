import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Share,
} from 'react-native';
import { Feather } from '../../../icons';
import * as Linking from 'expo-linking';
import { PaymentIntent } from '../../../types/payment';
import { useTheme } from '../../../theme/ThemeProvider';

interface ReceiptScreenProps {
  intent: PaymentIntent;
  onDone: () => void;
}

export const ReceiptScreen: React.FC<ReceiptScreenProps> = ({ intent, onDone }) => {
  const { t } = useTheme();
  const { recipient, amount } = intent;

  // Formatação de valor
  const formatValue = (val: string | undefined) => {
    if (!val) return 'R$ 0,00';
    const num = parseFloat(val.replace(',', '.'));
    if (isNaN(num)) return 'R$ 0,00';
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const amountFormatted = formatValue(amount);

  // Geração determinística (fake) do hash Solana baseado no tempo
  const txHash = useMemo(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 43; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `E0041696820260521${result.substring(0, 24)}`;
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
  
  // Nomes com primeira letra maiúscula para o dia da semana
  const dateFormatted = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  const displayName = recipient.isAnonymous ? 'Anônimo' : recipient.displayName;
  const displayId = recipient.isAnonymous 
    ? `${(recipient.walletAddress ?? '').substring(0, 10)}...${(recipient.walletAddress ?? '').substring((recipient.walletAddress?.length ?? 0) - 8)}`
    : recipient.userId;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Comprovante de pagamento Kora:\n\nValor: ${amountFormatted}\nPara: ${displayName}\nData: ${dateFormatted} às ${timeStr}\n\nTX Hash: ${txHash}\nVerificar na rede Solana: https://solscan.io/tx/${txHash}`,
      });
    } catch (error) {
      console.log('Share error', error);
    }
  };

  const handleVerify = () => {
    Linking.openURL(`https://solscan.io/tx/${txHash}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onDone} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={t.ink} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.ink }]}>Comprovante</Text>
        <TouchableOpacity onPress={onDone} style={styles.headerBtn}>
          <Feather name="home" size={22} color={t.ink} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Sucesso Header */}
        <View style={styles.successContainer}>
          <View style={[styles.checkCircle, { backgroundColor: t.green }]}>
            <Feather name="check" size={32} color="#FFF" />
          </View>
          <Text style={[styles.successTitle, { color: t.ink }]}>Pagamento enviado</Text>
          <Text style={[styles.successAmount, { color: t.ink }]}>{amountFormatted}</Text>
        </View>

        {/* Sobre a transação */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: t.ink }]}>Sobre a transação</Text>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: t.inkMute }]}>Data do pagamento</Text>
            <Text style={[styles.detailValue, { color: t.ink }]}>{dateFormatted}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: t.inkMute }]}>Horário</Text>
            <Text style={[styles.detailValue, { color: t.ink }]}>{timeStr}</Text>
          </View>

          <View style={styles.detailRowVertical}>
            <Text style={[styles.detailLabel, { color: t.inkMute }]}>ID da transação (Solana)</Text>
            <Text style={[styles.txHashText, { color: t.ink }]} selectable>{txHash}</Text>
          </View>

          <TouchableOpacity style={styles.verifyLink} onPress={handleVerify} activeOpacity={0.7}>
            <Text style={[styles.verifyLinkText, { color: t.sol }]}>Verificar na blockchain</Text>
            <Feather name="external-link" size={14} color={t.sol} />
          </TouchableOpacity>
        </View>

        {/* Quem enviou */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: t.ink }]}>Quem enviou</Text>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: t.inkMute }]}>Nome</Text>
            <Text style={[styles.detailValue, { color: t.ink }]}>{recipient.isAnonymous ? 'Anônimo' : 'Pedro Henrique'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: t.inkMute }]}>ID</Text>
            <Text style={[styles.detailValue, { color: t.ink }]}>
              {recipient.type === 'wallet' ? 'Endereço de Carteira' : '@opedrooz'}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: t.line, borderColor: t.line }]} />

        {/* Quem recebeu */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: t.ink }]}>Quem recebeu</Text>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: t.inkMute }]}>Nome</Text>
            <Text style={[styles.detailValue, { color: t.ink }]}>{displayName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: t.inkMute }]}>ID</Text>
            <Text style={[styles.detailValue, { color: t.ink }]}>
              {recipient.type === 'wallet' ? 'Endereço de Carteira' : displayId}
            </Text>
          </View>

          {recipient.type === 'wallet' && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: t.inkMute }]}>Endereço</Text>
              <Text style={[styles.detailValueMono, { color: t.ink }]}>{displayId}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botões Finais */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.shareBtn, { backgroundColor: t.btnPrimaryBg }]} onPress={handleShare} activeOpacity={0.85}>
          <Text style={[styles.shareBtnText, { color: t.btnPrimaryFg }]}>Compartilhar comprovante</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.newBtn, { borderColor: t.ink }]} onPress={onDone} activeOpacity={0.85}>
          <Text style={[styles.newBtnText, { color: t.ink }]}>Realizar novo pagamento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerBtn: { padding: 4, width: 36, alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },
  
  body: { paddingHorizontal: 24, paddingBottom: 40 },
  
  successContainer: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#34C759', // Verde sucesso
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: { color: '#FFF', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  successAmount: { color: '#FFF', fontSize: 24, fontWeight: '800' },
  
  section: { marginBottom: 24 },
  sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: '700', marginBottom: 16 },
  
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailRowVertical: {
    marginBottom: 12,
  },
  detailLabel: { color: '#8E8E93', fontSize: 14, fontWeight: '500', marginBottom: 4 },
  detailValue: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  detailValueMono: { color: '#FFF', fontSize: 13, fontWeight: '500', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  
  txHashText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 4,
  },
  verifyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  verifyLinkText: {
    color: '#00C9FF',
    fontSize: 14,
    fontWeight: '600',
  },
  
  divider: {
    height: 1,
    backgroundColor: '#242424',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#242424',
    marginBottom: 24,
    borderRadius: 1,
  },

  footer: { paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, paddingTop: 16 },
  shareBtn: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  shareBtnText: { color: '#000', fontSize: 16, fontWeight: '800' },
  
  newBtn: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  newBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
