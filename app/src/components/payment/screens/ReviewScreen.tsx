import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Feather, FontAwesome } from '../../../icons';
import { PaymentIntent } from '../../../types/payment';
import { useTheme } from '../../../theme/ThemeProvider';

interface ReviewScreenProps {
  intent: PaymentIntent;
  onPay: () => void;
  onBack: () => void;
  onClose: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({ intent, onPay, onBack, onClose }) => {
  const { t } = useTheme();
  const { recipient, amount } = intent;
  const [isFavorite, setIsFavorite] = useState(recipient.isFavorite);

  // Formatação de valor
  const formatValue = (val: string | undefined) => {
    if (!val) return 'R$ 0,00';
    const num = parseFloat(val.replace(',', '.'));
    if (isNaN(num)) return 'R$ 0,00';
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const amountFormatted = formatValue(amount);
  
  // Formatadores de display
  const displayName = recipient.isAnonymous ? 'Anônimo' : recipient.displayName;
  const displayId = recipient.isAnonymous 
    ? `${(recipient.walletAddress ?? '').substring(0, 10)}...${(recipient.walletAddress ?? '').substring((recipient.walletAddress?.length ?? 0) - 8)}`
    : recipient.userId;

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={t.ink} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.ink }]}>Revisão</Text>
        <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
          <Feather name="x" size={22} color={t.inkMute} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Avatar Centralizado */}
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: t.bg2 }]}>
            <Feather name="more-horizontal" size={24} color={t.inkMute} />
          </View>
        </View>

        {/* Valor e Nome Resumido */}
        <View style={styles.summaryContainer}>
          <Text style={[styles.amountText, { color: t.ink }]}>{amountFormatted}</Text>
          <Text style={[styles.nameSubtitle, { color: t.ink }]}>{displayName}</Text>
        </View>

        {/* Detalhes de Quem vai receber */}
        <View style={styles.detailsCard}>
          <Text style={[styles.sectionTitle, { color: t.ink }]}>Quem vai receber</Text>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: t.inkMute }]}>Nome</Text>
            <Text style={[styles.detailValue, { color: t.ink }]} numberOfLines={1}>{displayName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: t.inkMute }]}>ID</Text>
            <Text style={[styles.detailValue, { color: t.ink }]} numberOfLines={1}>
              {recipient.type === 'wallet' ? 'Endereço de Carteira' : displayId}
            </Text>
          </View>

          {recipient.type === 'wallet' && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: t.inkMute }]}>Endereço</Text>
              <Text style={[styles.detailValueMono, { color: t.ink }]} numberOfLines={1}>{displayId}</Text>
            </View>
          )}
        </View>

        {/* Botão de Favorito */}
        {!recipient.isAnonymous && (
          <TouchableOpacity 
            style={styles.favoriteRow} 
            onPress={() => setIsFavorite(!isFavorite)}
            activeOpacity={0.7}
          >
            <View style={styles.favoriteIconWrap}>
              {isFavorite ? (
                <FontAwesome name="heart" size={22} color={t.orange} />
              ) : (
                <Feather name="heart" size={22} color={t.ink} />
              )}
            </View>
            <View style={styles.favoriteTextWrap}>
              <Text style={[styles.favoriteTitle, { color: t.ink }]}>
                {isFavorite ? 'Contato já favoritado' : 'Adicionar aos favoritos'}
              </Text>
              <Text style={[styles.favoriteSubtitle, { color: t.inkMute }]}>{displayId}</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payBtn, { backgroundColor: t.btnPrimaryBg }]}
          onPress={onPay}
          activeOpacity={0.85}
        >
          <Text style={[styles.payBtnText, { color: t.btnPrimaryFg }]}>Pagar {amountFormatted}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' }, // Fundo mais escuro/cinza escuro como na imagem
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
  
  avatarContainer: { alignItems: 'center', marginTop: 24, marginBottom: 16 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#242424', // Círculo escuro com reticências
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  summaryContainer: { alignItems: 'center', marginBottom: 40 },
  amountText: { color: '#FFF', fontSize: 36, fontWeight: '800', marginBottom: 8 },
  nameSubtitle: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  
  detailsCard: { marginBottom: 32 },
  sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: '700', marginBottom: 20 },
  
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabel: { color: '#8E8E93', fontSize: 14, fontWeight: '500' },
  detailValue: { color: '#FFF', fontSize: 14, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  detailValueMono: { color: '#FFF', fontSize: 13, fontWeight: '500', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', maxWidth: '65%', textAlign: 'right' },

  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  favoriteIconWrap: { marginRight: 16, width: 32, alignItems: 'center' },
  favoriteTextWrap: { flex: 1 },
  favoriteTitle: { color: '#FFF', fontSize: 15, fontWeight: '600', marginBottom: 2 },
  favoriteSubtitle: { color: '#8E8E93', fontSize: 13 },

  footer: { paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, paddingTop: 16 },
  payBtn: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: { color: '#000', fontSize: 16, fontWeight: '800' },
});
