import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import type {
  AnticipationScreen,
  AnticipationIntent,
  Receivable,
} from '../../types/factoring';
import {
  MOCK_RECEIVABLE,
  MOCK_COMPARISON,
  MOCK_PJ_BALANCE,
  generateMockTxHash,
} from '../../data/factoring';
import { ScanNotaScreen } from './merchant/ScanNotaScreen';
import { ReviewAnticipationScreen } from './merchant/ReviewAnticipationScreen';
import { MerchantBiometricScreen } from './merchant/MerchantBiometricScreen';
import { ProcessingScreen } from './merchant/ProcessingScreen';
import { AnticipationSuccessScreen } from './merchant/AnticipationSuccessScreen';
import { useTheme } from '../../theme/ThemeProvider';

const HandleBar = () => {
  const { t } = useTheme();
  return <View style={[styles.handleBar, { backgroundColor: t.inkFaint }]} />;
};

interface AnticipationModalProps {
  visible: boolean;
  onClose: () => void;
  currentBalanceBRL?: string;
}

export const AnticipationModal: React.FC<AnticipationModalProps> = ({
  visible,
  onClose,
  currentBalanceBRL = '120',
}) => {
  const { t } = useTheme();
  const [screen, setScreen] = useState<AnticipationScreen>('scan');
  const [intent, setIntent] = useState<Partial<AnticipationIntent>>({});

  useEffect(() => {
    if (visible) {
      setScreen('scan');
      setIntent({});
    }
  }, [visible]);

  const handleClose = () => {
    onClose();
  };

  const handleScanContinue = (receivable: Receivable) => {
    setIntent((prev) => ({
      ...prev,
      receivable,
      comparison: MOCK_COMPARISON,
    }));
    setScreen('review');
  };

  const handleReviewConfirm = () => {
    setScreen('biometric');
  };

  const handleBiometricComplete = () => {
    const receivedBRL = '970';
    const discountBRL = '30';
    const previousBalance = Number(currentBalanceBRL);
    const newBalance = previousBalance + Number(receivedBRL);

    setIntent((prev) => ({
      ...prev,
      receivedBRL,
      discountBRL,
      previousBalanceBRL: currentBalanceBRL,
      newBalanceBRL: String(newBalance),
      txHash: generateMockTxHash(),
      processingTimeMs: 400,
    }));
    setScreen('processing');
  };

  const handleProcessingComplete = () => {
    setScreen('success');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'scan':
        return (
          <ScanNotaScreen
            onContinue={handleScanContinue}
            onClose={handleClose}
          />
        );
      case 'review':
        if (!intent.receivable || !intent.comparison) return null;
        return (
          <ReviewAnticipationScreen
            receivable={intent.receivable}
            comparison={intent.comparison}
            onConfirm={handleReviewConfirm}
            onBack={() => setScreen('scan')}
          />
        );
      case 'biometric':
        return (
          <MerchantBiometricScreen
            receivedBRL="970"
            onComplete={handleBiometricComplete}
          />
        );
      case 'processing':
        return (
          <ProcessingScreen onComplete={handleProcessingComplete} />
        );
      case 'success':
        if (!intent.receivable || !intent.comparison) return null;
        return (
          <AnticipationSuccessScreen
            intent={intent as AnticipationIntent}
            onPayBills={handleClose}
            onDone={handleClose}
          />
        );
      default:
        return null;
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
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View
          style={[
            styles.drawer,
            { backgroundColor: t.bg, borderColor: t.line },
          ]}
        >
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
    backgroundColor: '#0a0a0a',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    zIndex: 2,
    height: '92%',
    overflow: 'hidden',
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
});
