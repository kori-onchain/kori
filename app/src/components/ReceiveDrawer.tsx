import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  Share,
  Animated,
  Dimensions,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Feather } from '../icons';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../theme/ThemeProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const USER_ID = 'opedrooz';
const WALLET_ADDRESS = '7nxB2xT8aYqP9mZ1cR5vW4kL3jH6fD9gS8xV1nC4X1a';
const APP_SCHEME = 'kora://pay';

type Screen = 'menu' | 'share_id' | 'share_wallet' | 'payment_link' | 'qrcode';

interface ReceiveDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const useToast = () => {
  const [message, setMessage] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;

  const show = (msg: string) => {
    setMessage(msg);
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => setMessage(null));
  };

  return { message, opacity, show };
};

const Toast: React.FC<{ message: string | null; opacity: Animated.Value }> = ({ message, opacity }) => {
  const { t } = useTheme();
  if (!message) return null;
  return (
    <Animated.View style={[styles.toast, { opacity, backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
      <Feather name="check-circle" size={15} color={t.green} style={{ marginRight: 8 }} />
      <Text style={[styles.toastText, { color: t.ink }]}>{message}</Text>
    </Animated.View>
  );
};

const HandleBar = () => {
  const { t } = useTheme();
  return <View style={[styles.handleBar, { backgroundColor: t.inkFaint }]} />;
};

const BackHeader: React.FC<{ title: string; onBack: () => void; onClose: () => void }> = ({ title, onBack, onClose }) => {
  const { t } = useTheme();
  return (
    <View style={[styles.header, { borderBottomColor: t.line }]}>
      <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
        <Feather name="arrow-left" size={20} color={t.ink} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: t.ink }]}>{title}</Text>
      <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
        <Feather name="x" size={20} color={t.inkMute} />
      </TouchableOpacity>
    </View>
  );
};

const ShareIdScreen: React.FC<{ onBack: () => void; onClose: () => void }> = ({ onBack, onClose }) => {
  const { t } = useTheme();
  const toast = useToast();
  const deepLink = `${APP_SCHEME}?to=${USER_ID}`;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(`@${USER_ID}`);
    toast.show('ID copiado!');
  };

  const handleShare = async () => {
    await Share.share({
      message: `Me pague pelo Kora! Acesse o link para transferir: ${deepLink}`,
      url: deepLink,
    });
  };

  return (
    <View style={styles.screenContainer}>
      <BackHeader title="Compartilhar ID" onBack={onBack} onClose={onClose} />
      <Toast message={toast.message} opacity={toast.opacity} />

      <View style={styles.body}>
        <View style={[styles.infoCard, { backgroundColor: t.bgElev, borderColor: t.cardBorder }]}>
          <View style={styles.infoIconRow}>
            <Feather name="at-sign" size={28} color={t.orange} />
          </View>
          <Text style={[styles.infoLabel, { color: t.inkMute }]}>Seu ID de usuário</Text>
          <Text style={[styles.infoValue, { color: t.ink }]}>@{USER_ID}</Text>
          <Text style={[styles.infoDesc, { color: t.inkDim }]}>
            Quem receber esse link poderá te enviar um valor diretamente. Basta clicar, inserir o montante e confirmar.
          </Text>
        </View>

        <TouchableOpacity style={[styles.actionRow, { backgroundColor: t.bg2, borderColor: t.cardBorder }]} onPress={handleCopy} activeOpacity={0.75}>
          <View style={[styles.actionIcon, { backgroundColor: t.bgElev }]}>
            <Feather name="copy" size={20} color={t.sol} />
          </View>
          <View style={styles.actionText}>
            <Text style={[styles.actionTitle, { color: t.ink }]}>Copiar ID</Text>
            <Text style={[styles.actionDesc, { color: t.inkMute }]}>Copia @{USER_ID} para a área de transferência</Text>
          </View>
          <Feather name="chevron-right" size={18} color={t.inkMute} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionRow, { backgroundColor: t.bg2, borderColor: t.cardBorder }]} onPress={handleShare} activeOpacity={0.75}>
          <View style={[styles.actionIcon, { backgroundColor: t.bgElev }]}>
            <Feather name="share-2" size={20} color={t.green} />
          </View>
          <View style={styles.actionText}>
            <Text style={[styles.actionTitle, { color: t.ink }]}>Compartilhar link</Text>
            <Text style={[styles.actionDesc, { color: t.inkMute }]}>Abre direto na transferência para você</Text>
          </View>
          <Feather name="chevron-right" size={18} color={t.inkMute} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ShareWalletScreen: React.FC<{ onBack: () => void; onClose: () => void }> = ({ onBack, onClose }) => {
  const { t } = useTheme();
  const toast = useToast();
  const shortAddress = `${WALLET_ADDRESS.substring(0, 6)}...${WALLET_ADDRESS.substring(WALLET_ADDRESS.length - 6)}`;
  const deepLink = `${APP_SCHEME}?wallet=${WALLET_ADDRESS}`;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(WALLET_ADDRESS);
    toast.show('Endereço copiado!');
  };

  const handleShare = async () => {
    await Share.share({
      message: `Me pague pelo Kora! Use meu endereço de carteira: ${deepLink}`,
      url: deepLink,
    });
  };

  return (
    <View style={styles.screenContainer}>
      <BackHeader title="Compartilhar Wallet" onBack={onBack} onClose={onClose} />
      <Toast message={toast.message} opacity={toast.opacity} />

      <View style={styles.body}>
        <View style={[styles.infoCard, { backgroundColor: t.bgElev, borderColor: t.cardBorder }]}>
          <View style={styles.infoIconRow}>
            <Feather name="shield" size={28} color={t.sol} />
          </View>
          <Text style={[styles.infoLabel, { color: t.inkMute }]}>Endereço da carteira</Text>
          <Text style={[styles.infoValue, styles.monoText, { color: t.ink }]} numberOfLines={1} ellipsizeMode="middle">
            {WALLET_ADDRESS}
          </Text>
          <Text style={[styles.infoDesc, { color: t.inkDim }]}>
            Endereço criptográfico descentralizado. Garante anonimato total — nenhum dado de identidade é exposto na transação.
          </Text>
        </View>

        <TouchableOpacity style={[styles.actionRow, { backgroundColor: t.bg2, borderColor: t.cardBorder }]} onPress={handleCopy} activeOpacity={0.75}>
          <View style={[styles.actionIcon, { backgroundColor: t.bgElev }]}>
            <Feather name="copy" size={20} color={t.sol} />
          </View>
          <View style={styles.actionText}>
            <Text style={[styles.actionTitle, { color: t.ink }]}>Copiar endereço</Text>
            <Text style={[styles.actionDesc, { color: t.inkMute }]}>{shortAddress}</Text>
          </View>
          <Feather name="chevron-right" size={18} color={t.inkMute} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionRow, { backgroundColor: t.bg2, borderColor: t.cardBorder }]} onPress={handleShare} activeOpacity={0.75}>
          <View style={[styles.actionIcon, { backgroundColor: t.bgElev }]}>
            <Feather name="share-2" size={20} color={t.green} />
          </View>
          <View style={styles.actionText}>
            <Text style={[styles.actionTitle, { color: t.ink }]}>Compartilhar link</Text>
            <Text style={[styles.actionDesc, { color: t.inkMute }]}>Abre direto no pagamento para você</Text>
          </View>
          <Feather name="chevron-right" size={18} color={t.inkMute} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PaymentLinkScreen: React.FC<{ onBack: () => void; onClose: () => void }> = ({ onBack, onClose }) => {
  const { t } = useTheme();
  const toast = useToast();
  const [mode, setMode] = useState<'free' | 'fixed'>('free');
  const [amount, setAmount] = useState('');
  const [generated, setGenerated] = useState(false);

  const buildLink = () => {
    const base = `${APP_SCHEME}?to=${USER_ID}`;
    return mode === 'fixed' && amount ? `${base}&amount=${amount.replace(',', '.')}` : base;
  };

  const handleGenerate = () => setGenerated(true);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(buildLink());
    toast.show('Link copiado!');
  };

  const handleShare = async () => {
    const link = buildLink();
    const amountText = mode === 'fixed' && amount ? ` de R$ ${amount}` : '';
    await Share.share({
      message: `Me pague${amountText} pelo Kora! Acesse: ${link}`,
      url: link,
    });
  };

  return (
    <View style={styles.screenContainer}>
      <BackHeader title="Link de Pagamento" onBack={onBack} onClose={onClose} />
      <Toast message={toast.message} opacity={toast.opacity} />

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionLabel, { color: t.inkMute }]}>TIPO DE COBRANÇA</Text>
        <View style={[styles.segmentRow, { backgroundColor: t.bgElev }]}>
          <TouchableOpacity
            style={[styles.segment, mode === 'free' && { backgroundColor: t.btnPrimaryBg }]}
            onPress={() => { setMode('free'); setGenerated(false); }}
            activeOpacity={0.75}
          >
            <Text style={[styles.segmentText, { color: mode === 'free' ? t.btnPrimaryFg : t.inkMute }]}>Valor livre</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, mode === 'fixed' && { backgroundColor: t.btnPrimaryBg }]}
            onPress={() => { setMode('fixed'); setGenerated(false); }}
            activeOpacity={0.75}
          >
            <Text style={[styles.segmentText, { color: mode === 'fixed' ? t.btnPrimaryFg : t.inkMute }]}>Valor fixo</Text>
          </TouchableOpacity>
        </View>

        {mode === 'fixed' && (
          <View style={[styles.amountRow, { backgroundColor: t.bgElev, borderColor: t.cardBorder }]}>
            <Text style={[styles.currencyPrefix, { color: t.inkMute }]}>R$</Text>
            <TextInput
              style={[styles.amountInput, { color: t.ink }]}
              keyboardType="decimal-pad"
              placeholder="0,00"
              placeholderTextColor={t.inkMute}
              value={amount}
              onChangeText={(t) => { setAmount(t); setGenerated(false); }}
            />
          </View>
        )}

        {!generated ? (
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: t.btnPrimaryBg }, mode === 'fixed' && !amount && styles.primaryBtnDisabled]}
            onPress={handleGenerate}
            activeOpacity={0.8}
            disabled={mode === 'fixed' && !amount}
          >
            <Feather name="link" size={16} color={t.btnPrimaryFg} style={{ marginRight: 8 }} />
            <Text style={[styles.primaryBtnText, { color: t.btnPrimaryFg }]}>Gerar link</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.generatedBox, { backgroundColor: t.bgElev, borderColor: t.cardBorder }]}>
            <Text style={[styles.generatedLabel, { color: t.inkMute }]}>Link gerado</Text>
            <Text style={[styles.generatedLink, { color: t.ink }]} numberOfLines={2}>{buildLink()}</Text>

            <View style={styles.shareRow}>
              <TouchableOpacity style={[styles.shareBtn, { backgroundColor: t.bg2, borderColor: t.cardBorder }]} onPress={handleCopy} activeOpacity={0.75}>
                <Feather name="copy" size={16} color={t.ink} />
                <Text style={[styles.shareBtnText, { color: t.ink }]}>Copiar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.shareBtn, { backgroundColor: t.green }]} onPress={handleShare} activeOpacity={0.75}>
                <Feather name="share-2" size={16} color="#000" />
                <Text style={[styles.shareBtnText, { color: '#000' }]}>Compartilhar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const QRCodeScreen: React.FC<{ onBack: () => void; onClose: () => void }> = ({ onBack, onClose }) => {
  const { t } = useTheme();
  const toast = useToast();
  const [mode, setMode] = useState<'free' | 'fixed'>('free');
  const [amount, setAmount] = useState('');
  const [generated, setGenerated] = useState(false);
  const qrRef = useRef<any>(null);

  const buildQRValue = () => {
    const base = `${APP_SCHEME}?to=${USER_ID}`;
    return mode === 'fixed' && amount ? `${base}&amount=${amount.replace(',', '.')}` : base;
  };

  const handleGenerate = () => setGenerated(true);

  const handleShare = async () => {
    const link = buildQRValue();
    const amountText = mode === 'fixed' && amount ? ` de R$ ${amount}` : '';
    await Share.share({
      message: `Me pague${amountText} pelo Kora! Acesse: ${link}`,
      url: link,
    });
  };

  return (
    <View style={styles.screenContainer}>
      <BackHeader title="QR Code" onBack={onBack} onClose={onClose} />
      <Toast message={toast.message} opacity={toast.opacity} />

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={[styles.sectionLabel, { color: t.inkMute }]}>TIPO DE COBRANÇA</Text>
        <View style={[styles.segmentRow, { backgroundColor: t.bgElev }]}>
          <TouchableOpacity
            style={[styles.segment, mode === 'free' && { backgroundColor: t.btnPrimaryBg }]}
            onPress={() => { setMode('free'); setGenerated(false); }}
            activeOpacity={0.75}
          >
            <Text style={[styles.segmentText, { color: mode === 'free' ? t.btnPrimaryFg : t.inkMute }]}>Valor livre</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, mode === 'fixed' && { backgroundColor: t.btnPrimaryBg }]}
            onPress={() => { setMode('fixed'); setGenerated(false); }}
            activeOpacity={0.75}
          >
            <Text style={[styles.segmentText, { color: mode === 'fixed' ? t.btnPrimaryFg : t.inkMute }]}>Valor fixo</Text>
          </TouchableOpacity>
        </View>

        {mode === 'fixed' && (
          <View style={[styles.amountRow, { backgroundColor: t.bgElev, borderColor: t.cardBorder }]}>
            <Text style={[styles.currencyPrefix, { color: t.inkMute }]}>R$</Text>
            <TextInput
              style={[styles.amountInput, { color: t.ink }]}
              keyboardType="decimal-pad"
              placeholder="0,00"
              placeholderTextColor={t.inkMute}
              value={amount}
              onChangeText={(t) => { setAmount(t); setGenerated(false); }}
            />
          </View>
        )}

        {!generated ? (
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: t.btnPrimaryBg }, mode === 'fixed' && !amount && styles.primaryBtnDisabled]}
            onPress={handleGenerate}
            activeOpacity={0.8}
            disabled={mode === 'fixed' && !amount}
          >
            <Feather name="grid" size={16} color={t.btnPrimaryFg} style={{ marginRight: 8 }} />
            <Text style={[styles.primaryBtnText, { color: t.btnPrimaryFg }]}>Gerar QR Code</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.qrContainer, { backgroundColor: t.bgElev, borderColor: t.cardBorder }]}>
            {mode === 'fixed' && amount && (
              <Text style={[styles.qrAmount, { color: t.ink }]}>R$ {amount}</Text>
            )}

            <View style={styles.qrBox}>
              <QRCode
                value={buildQRValue()}
                size={200}
              color={t.ink}
              backgroundColor={t.bg2}
                getRef={(ref) => (qrRef.current = ref)}
              />
            </View>

            <Text style={[styles.qrCaption, { color: t.inkMute }]}>
              {mode === 'free'
                ? 'Quem escanear pode pagar qualquer valor'
                : `Pagamento de R$ ${amount} ao escanear`}
            </Text>

            <View style={styles.shareRow}>
              <TouchableOpacity style={[styles.shareBtn, { backgroundColor: t.green }]} onPress={handleShare} activeOpacity={0.75}>
                <Feather name="share-2" size={16} color="#000" />
                <Text style={[styles.shareBtnText, { color: '#000' }]}>Compartilhar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const MenuScreen: React.FC<{ onSelect: (s: Screen) => void; onClose: () => void }> = ({ onSelect, onClose }) => {
  const { t } = useTheme();
  const options = [
    {
      screen: 'share_id' as Screen,
      icon: 'at-sign' as const,
      color: t.sol,
      bg: t.bgElev,
      title: 'Compartilhar ID',
      desc: 'Compartilha seu @usuário para receber qualquer valor',
    },
    {
      screen: 'share_wallet' as Screen,
      icon: 'shield' as const,
      color: t.sol,
      bg: t.bgElev,
      title: 'Wallet Address',
      desc: 'Endereço criptográfico com anonimato total',
    },
    {
      screen: 'payment_link' as Screen,
      icon: 'link' as const,
      color: t.orange,
      bg: t.bgElev,
      title: 'Link de Pagamento',
      desc: 'Crie um link com valor livre ou fixo',
    },
    {
      screen: 'qrcode' as Screen,
      icon: 'grid' as const,
      color: t.green,
      bg: t.bgElev,
      title: 'QR Code',
      desc: 'Gere e compartilhe um QR Code de cobrança',
    },
  ];

  return (
    <View style={[styles.screenContainer, { backgroundColor: t.bg2 }]}>
      <View style={[styles.header, { borderBottomColor: t.line }]}>
        <Text style={[styles.headerTitle, { color: t.ink }]}>Receber</Text>
        <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
          <Feather name="x" size={20} color={t.inkMute} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={[styles.menuSubtitle, { color: t.inkMute }]}>Escolha como deseja receber:</Text>
        {options.map((opt) => (
          <TouchableOpacity key={opt.screen} style={[styles.menuCard, { backgroundColor: t.bgElev, borderColor: t.cardBorder }]} onPress={() => onSelect(opt.screen)} activeOpacity={0.75}>
            <View style={[styles.menuIcon, { backgroundColor: opt.bg }]}>
              <Feather name={opt.icon} size={22} color={opt.color} />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuTitle, { color: t.ink }]}>{opt.title}</Text>
              <Text style={[styles.menuDesc, { color: t.inkMute }]}>{opt.desc}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={t.inkMute} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export const ReceiveDrawer: React.FC<ReceiveDrawerProps> = ({ visible, onClose }) => {
  const { t } = useTheme();
  const [screen, setScreen] = useState<Screen>('menu');

  const handleClose = () => {
    onClose();
    setTimeout(() => setScreen('menu'), 300);
  };

  const renderScreen = () => {
    switch (screen) {
      case 'share_id':
        return <ShareIdScreen onBack={() => setScreen('menu')} onClose={handleClose} />;
      case 'share_wallet':
        return <ShareWalletScreen onBack={() => setScreen('menu')} onClose={handleClose} />;
      case 'payment_link':
        return <PaymentLinkScreen onBack={() => setScreen('menu')} onClose={handleClose} />;
      case 'qrcode':
        return <QRCodeScreen onBack={() => setScreen('menu')} onClose={handleClose} />;
      default:
        return <MenuScreen onSelect={setScreen} onClose={handleClose} />;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />
        <View style={[styles.drawer, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
          <HandleBar />
          {renderScreen()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  drawer: {
    backgroundColor: '#111',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#242424',
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    zIndex: 2,
    maxHeight: '88%',
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  screenContainer: {
    flex: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  headerBtn: {
    padding: 4,
    width: 32,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  toast: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2C2C2C',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    zIndex: 999,
  },
  toastText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },

  menuSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 16,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    gap: 14,
  },
  menuIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  menuDesc: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },

  infoCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#242424',
  },
  infoIconRow: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#242424',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  infoValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  monoText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
  },
  infoDesc: {
    color: '#666',
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#242424',
    gap: 12,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 12,
  },

  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#242424',
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#2A2A2A',
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#FFF',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
    paddingVertical: 14,
    padding: 0,
  },
  primaryBtn: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  primaryBtnDisabled: {
    opacity: 0.4,
  },
  primaryBtnText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '800',
  },
  generatedBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#242424',
    marginBottom: 16,
  },
  generatedLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  generatedLink: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 16,
    lineHeight: 18,
  },
  shareRow: {
    flexDirection: 'row',
    gap: 10,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  shareBtnGreen: {
    backgroundColor: '#00D09E',
  },
  shareBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },

  qrContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  qrAmount: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  qrBox: {
    backgroundColor: '#161616',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: 16,
    shadowColor: '#00D09E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  qrCaption: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
});
