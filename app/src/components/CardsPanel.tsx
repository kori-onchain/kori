import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { Feather } from '../icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../theme/ThemeProvider';

const { width } = Dimensions.get('window');

interface CardsPanelProps {
  userName?: string;
}

export const CardsPanel: React.FC<CardsPanelProps> = ({ userName }) => {
  const { t } = useTheme();
  const [cardNumber, setCardNumber] = useState('5421 9843 7261 8294');
  const [expiry] = useState('08/29');
  const [cvv, setCvv] = useState('842');
  const [isCvvVisible, setIsCvvVisible] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [isOnlineActive, setIsOnlineActive] = useState(true);
  const [limitUsed] = useState(1842);
  const [limitTotal, setLimitTotal] = useState(5000);
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [limitInput, setLimitInput] = useState('5000');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastOpacity = useState(new Animated.Value(0))[0];
  const cardScale = useState(new Animated.Value(1))[0];

  const displayName = (userName || 'KAUÃ M.').toUpperCase();
  const limitPercent = Math.min(1, limitUsed / limitTotal);

  const showToast = (message: string) => {
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setToastMessage(null));
  };

  const handleCopyDetails = async () => {
    const fullText = `Cartão Kora Virtual\nNome: ${displayName}\nNúmero: ${cardNumber}\nValidade: ${expiry}\nCVV: ${cvv}`;
    await Clipboard.setStringAsync(fullText);
    showToast('Dados do cartão copiados!');
  };

  const handleGenerateNewCard = () => {
    Animated.sequence([
      Animated.timing(cardScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(cardScale, { toValue: 1.02, duration: 150, useNativeDriver: true }),
      Animated.timing(cardScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    const b1 = Math.floor(1000 + Math.random() * 9000).toString();
    const b2 = Math.floor(1000 + Math.random() * 9000).toString();
    setCardNumber(`5421 ${b1} ${b2} 8294`);
    setCvv(Math.floor(100 + Math.random() * 900).toString());
    showToast('Novo cartão virtual gerado!');
  };

  const handleSaveLimit = () => {
    const val = parseInt(limitInput.replace(/[^0-9]/g, ''));
    if (!isNaN(val) && val > 0) {
      setLimitTotal(val);
      setIsEditingLimit(false);
      showToast(`Limite mensal atualizado para R$ ${val.toLocaleString('pt-BR')}`);
    } else {
      showToast('Por favor, insira um valor válido');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: t.bg }]} showsVerticalScrollIndicator={false}>
      {toastMessage && (
        <Animated.View style={[styles.toast, { opacity: toastOpacity, backgroundColor: t.green }]}>
          <Text style={[styles.toastText, { color: t.bg }]}>{toastMessage}</Text>
        </Animated.View>
      )}

      <Animated.View style={[styles.cardContainer, { transform: [{ scale: cardScale }] }]}>
        <View style={styles.card}>
          <LinearGradient
            colors={[t.bg2, t.green, t.bg]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.cardGridPattern} />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.chip} />
              <View style={styles.brandContainer}>
                <Feather name="shield" size={16} color={t.green} style={{ marginRight: 6 }} />
                <Text style={styles.brandText}>KORA • VIRTUAL</Text>
              </View>
            </View>

            <View style={styles.cardNumberContainer}>
              <Text style={styles.cardNumberText}>
                {isFrozen ? '••••  ••••  ••••  ••••' : cardNumber}
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardHolderLabel}>PORTADOR</Text>
                <Text style={styles.cardHolderName}>{displayName}</Text>
              </View>
              <View style={styles.circlesContainer}>
                <View style={[styles.circle, { backgroundColor: '#FF5F00', marginRight: -8 }]} />
                <View style={[styles.circle, { backgroundColor: '#F79E1B', opacity: 0.85 }]} />
              </View>
            </View>
          </View>

          {isFrozen && (
            <View style={styles.frozenOverlay}>
              <View style={styles.frozenBadge}>
                <Feather name="lock" size={20} color={t.green} style={{ marginRight: 8 }} />
                <Text style={[styles.frozenBadgeText, { color: t.green }]}>CONGELADO</Text>
              </View>
            </View>
          )}
        </View>
      </Animated.View>

      <View style={styles.detailsRow}>
        <View style={[styles.detailCard, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
          <Text style={[styles.detailTitle, { color: t.inkMute }]}>VALIDADE</Text>
          <Text style={[styles.detailValue, { color: t.ink }]}>{expiry}</Text>
        </View>

        <View style={[styles.detailCard, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
          <Text style={[styles.detailTitle, { color: t.inkMute }]}>CVV</Text>
          <View style={styles.cvvContainer}>
            <Text style={[styles.detailValue, { color: t.ink }]}>{isCvvVisible ? cvv : '•••'}</Text>
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setIsCvvVisible(!isCvvVisible)} activeOpacity={0.7}>
              <Feather name={isCvvVisible ? 'eye-off' : 'eye'} size={18} color={t.inkMute} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.primaryActionBtn, { backgroundColor: t.btnPrimaryBg }]} onPress={handleCopyDetails} activeOpacity={0.8}>
          <Feather name="copy" size={16} color={t.btnPrimaryFg} style={{ marginRight: 8 }} />
          <Text style={[styles.primaryActionText, { color: t.btnPrimaryFg }]}>Copiar dados</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.secondaryActionBtn, { backgroundColor: t.bg2, borderColor: t.cardBorder }]} onPress={handleGenerateNewCard} activeOpacity={0.8}>
          <Feather name="plus" size={16} color={t.ink} style={{ marginRight: 8 }} />
          <Text style={[styles.secondaryActionText, { color: t.ink }]}>Novo virtual</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionHeader, { color: t.inkMute }]}>CONTROLES</Text>

      <View style={[styles.controlsList, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
        <View style={[styles.controlRow, { borderBottomColor: t.line }]}>
          <View style={styles.controlLeft}>
            <View style={[styles.iconBox, { backgroundColor: t.bgElev }]}>
              <Feather name="globe" size={20} color={t.ink} />
            </View>
            <View>
              <Text style={[styles.controlTitle, { color: t.ink }]}>Compras online</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: isOnlineActive ? t.green : t.inkMute }]} />
                <Text style={[styles.controlSubtitle, { color: t.inkMute }]}>{isOnlineActive ? 'ativo' : 'inativo'}</Text>
              </View>
            </View>
          </View>
          <Switch
            value={isOnlineActive}
            onValueChange={setIsOnlineActive}
            trackColor={{ false: t.inkFaint, true: t.line2 }}
            thumbColor={isOnlineActive ? t.green : t.inkMute}
            ios_backgroundColor={t.inkFaint}
          />
        </View>

        <View style={[styles.controlRow, { borderBottomColor: t.line }]}>
          <View style={styles.controlLeft}>
            <View style={[styles.iconBox, { backgroundColor: t.bgElev }]}>
              <Feather name="pause" size={20} color={t.ink} />
            </View>
            <View>
              <Text style={[styles.controlTitle, { color: t.ink }]}>Bloqueio temporário</Text>
              <Text style={[styles.controlSubtitle, { color: t.inkMute }]}>{isFrozen ? 'cartão bloqueado' : 'tap pra pausar'}</Text>
            </View>
          </View>
          <Switch
            value={isFrozen}
            onValueChange={setIsFrozen}
            trackColor={{ false: t.inkFaint, true: t.line2 }}
            thumbColor={isFrozen ? t.green : t.inkMute}
            ios_backgroundColor={t.inkFaint}
          />
        </View>
      </View>

      <View style={styles.limitHeaderRow}>
        <Text style={[styles.sectionHeader, { color: t.inkMute }]}>LIMITE MENSAL</Text>
        <TouchableOpacity onPress={() => setIsEditingLimit(true)} activeOpacity={0.7}>
          <Text style={[styles.editLinkText, { color: t.orange }]}>editar ➔</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.limitPanel, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
        {isEditingLimit ? (
          <View style={styles.limitEditContainer}>
            <TextInput
              style={[styles.limitInput, { backgroundColor: t.bg, borderColor: t.line, color: t.ink }]}
              keyboardType="number-pad"
              value={limitInput}
              onChangeText={setLimitInput}
              placeholder="Digite o limite"
              placeholderTextColor={t.inkMute}
              autoFocus
            />
            <View style={styles.limitEditActions}>
              <TouchableOpacity style={styles.limitCancelBtn} onPress={() => setIsEditingLimit(false)}>
                <Text style={[styles.limitCancelText, { color: t.inkMute }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.limitSaveBtn, { backgroundColor: t.btnPrimaryBg }]} onPress={handleSaveLimit}>
                <Text style={[styles.limitSaveText, { color: t.btnPrimaryFg }]}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.limitValuesRow}>
              <Text style={[styles.limitUsedText, { color: t.inkMute }]}>
                Usado <Text style={[styles.boldText, { color: t.ink }]}>R$ {limitUsed.toLocaleString('pt-BR')}</Text> de R$ {limitTotal.toLocaleString('pt-BR')}
              </Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: t.inkFaint }]}>
              <View style={[styles.progressBarFill, { width: `${limitPercent * 100}%`, backgroundColor: t.green }]} />
            </View>
          </View>
        )}
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  toast: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    backgroundColor: '#00D09E',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  toastText: {
    color: '#0D0D0D',
    fontWeight: '800',
    fontSize: 13,
    textAlign: 'center',
  },
  cardContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  card: {
    width: '100%',
    height: 210,
    borderRadius: 24,
    backgroundColor: '#1E1E1E',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#2C2C2C',
    shadowColor: '#00D09E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  cardGridPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.04,
    borderWidth: 1,
    borderColor: '#FFF',
    borderStyle: 'dashed',
  },
  cardContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#C4C4C4',
    opacity: 0.8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  cardNumberContainer: {
    marginVertical: 14,
  },
  cardNumberText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardHolderLabel: {
    color: '#8E8E93',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardHolderName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  circlesContainer: {
    flexDirection: 'row',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  frozenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 13, 13, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  frozenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#00D09E',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#00D09E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  frozenBadgeText: {
    color: '#00D09E',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
  },
  detailTitle: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  cvvContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  eyeBtn: {
    padding: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 26,
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00D09E',
    borderRadius: 14,
    paddingVertical: 14,
  },
  primaryActionText: {
    color: '#0D0D0D',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 14,
    paddingVertical: 14,
  },
  secondaryActionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  sectionHeader: {
    color: '#8E8E93',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  controlsList: {
    backgroundColor: '#161616',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#262626',
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 26,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  controlLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8E8E93',
  },
  statusDotActive: {
    backgroundColor: '#00D09E',
  },
  controlSubtitle: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600',
  },
  limitHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editLinkText: {
    color: '#00D09E',
    fontSize: 12,
    fontWeight: '700',
  },
  limitPanel: {
    backgroundColor: '#161616',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#262626',
    padding: 20,
  },
  limitValuesRow: {
    marginBottom: 12,
  },
  limitUsedText: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '600',
  },
  boldText: {
    color: '#FFF',
    fontWeight: '800',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#262626',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00D09E',
    borderRadius: 4,
  },
  limitEditContainer: {
    gap: 12,
  },
  limitInput: {
    backgroundColor: '#262626',
    borderRadius: 12,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  limitEditActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  limitCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  limitCancelText: {
    color: '#8E8E93',
    fontWeight: '700',
  },
  limitSaveBtn: {
    backgroundColor: '#00D09E',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  limitSaveText: {
    color: '#0D0D0D',
    fontWeight: '800',
  },
});
