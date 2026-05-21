import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { ReceiveDrawer } from './ReceiveDrawer';
interface BalanceProps {
  onSendPress?: () => void;
}

export const Balance: React.FC<BalanceProps> = ({ onSendPress }) => {
  const [receiveVisible, setReceiveVisible] = useState(false);
  const balanceInt = 'R$ 74.352';
  const balanceDec = ',93';

  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.label}>Total balance</Text>
        <MaskedView
          maskElement={
            <Text style={styles.value}>
              <Text style={{ color: '#000' }}>{balanceInt}</Text>
              <Text style={{ color: 'rgba(0,0,0,0.35)' }}>{balanceDec}</Text>
            </Text>
          }
        >
          <LinearGradient
            colors={['#FFFFFF', '#A0A0A0', '#EAEAEA', '#707070']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.4, 0.7, 1]}
          >
            <Text style={[styles.value, { opacity: 0 }]}>
              <Text>{balanceInt}</Text>
              <Text>{balanceDec}</Text>
            </Text>
          </LinearGradient>
        </MaskedView>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={onSendPress}>
            <View style={[styles.iconWrapper, { backgroundColor: '#00D09E' }]}>
              <Feather name="send" size={16} color="#000000" style={{ marginRight: 2, marginTop: 2 }} />
            </View>
            <Text style={styles.actionText}>Enviar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={() => setReceiveVisible(true)}>
            <View style={[styles.iconWrapper, { backgroundColor: '#00D09E' }]}>
              <Feather name="download" size={18} color="#000000" />
            </View>
            <Text style={styles.actionText}>Receber</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ReceiveDrawer visible={receiveVisible} onClose={() => setReceiveVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  balanceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  label: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    zIndex: 1,
  },
  value: {
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: -0.5,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 32,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 8,
    zIndex: 10,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 6,
    paddingRight: 16,
    borderRadius: 40,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
