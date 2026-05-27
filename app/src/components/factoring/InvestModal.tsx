import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { InvestScreen, InvestIntent, PoolInfo } from '../../types/factoring';
import { MOCK_POOL, generateMockTxHash, brlToUsdc } from '../../data/factoring';
import { InvestAmountScreen } from './investor/InvestAmountScreen';
import { InvestBiometricScreen } from './investor/InvestBiometricScreen';
import { InvestConfirmedScreen } from './investor/InvestConfirmedScreen';
import { InvestPositionScreen } from './investor/InvestPositionScreen';
import { InvestWithdrawnScreen } from './investor/InvestWithdrawnScreen';

const HandleBar = () => {
  const { t } = useTheme();
  return <View style={[styles.handleBar, { backgroundColor: t.inkFaint }]} />;
};

interface InvestModalProps {
  visible: boolean;
  onClose: () => void;
  pool?: PoolInfo;
  userBalanceBRL?: string;
}

export const InvestModal: React.FC<InvestModalProps> = ({
  visible,
  onClose,
  pool,
  userBalanceBRL = '1000',
}) => {
  const { t } = useTheme();
  const activePool = pool ?? MOCK_POOL;

  const [screen, setScreen] = useState<InvestScreen>('amount');
  const [intent, setIntent] = useState<Partial<InvestIntent>>({});

  useEffect(() => {
    if (visible) {
      setScreen('amount');
      setIntent({});
    }
  }, [visible]);

  const handleClose = () => {
    onClose();
  };

  const handleAmountConfirm = (amountBRL: string, amountUSDC: string) => {
    const txHash = generateMockTxHash();
    setIntent({
      pool: activePool,
      amountBRL,
      amountUSDC,
      networkFee: '0.01',
      txHash,
    });
    setScreen('biometric');
  };

  const handleBiometricComplete = () => {
    setScreen('confirmed');
  };

  const handleViewPosition = () => {
    const withdrawTxHash = generateMockTxHash();
    setIntent((prev) => ({
      ...prev,
      yieldGross: '30,00',
      protocolFeePct: 1,
      protocolFee: '0,30',
      yieldNet: '29,70',
      yieldPct: '2.97',
      participation: '100%',
      operationsFinanced: 1,
      finalBalanceBRL: '1.029,70',
      withdrawTxHash,
    }));
    setScreen('position');
  };

  const handleWithdraw = () => {
    setScreen('withdrawn');
  };

  const handleReinvest = () => {
    setScreen('amount');
    setIntent({});
  };

  const handleDone = () => {
    handleClose();
  };

  const renderScreen = () => {
    switch (screen) {
      case 'amount':
        return (
          <InvestAmountScreen
            pool={activePool}
            userBalanceBRL={userBalanceBRL}
            onConfirm={handleAmountConfirm}
            onClose={handleClose}
          />
        );
      case 'biometric':
        return (
          <InvestBiometricScreen
            amountBRL={intent.amountBRL ?? '0'}
            poolName={activePool.name}
            onComplete={handleBiometricComplete}
          />
        );
      case 'confirmed':
        return (
          <InvestConfirmedScreen
            intent={intent as InvestIntent}
            onViewPosition={handleViewPosition}
          />
        );
      case 'position':
        return (
          <InvestPositionScreen
            intent={intent as InvestIntent}
            onWithdraw={handleWithdraw}
            onReinvest={handleReinvest}
          />
        );
      case 'withdrawn':
        return (
          <InvestWithdrawnScreen
            intent={intent as InvestIntent}
            onDone={handleDone}
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
