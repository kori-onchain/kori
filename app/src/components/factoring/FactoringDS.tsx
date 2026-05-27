import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SoftCard } from '../ds/SoftCard';
import { useTheme } from '../../theme/ThemeProvider';
import { fonts, radii } from '../../theme/tokens';
import { shortenHash } from '../../data/factoring';

export const MonoLabel: React.FC<{
  children: string;
  color?: string;
  size?: number;
}> = ({ children, color, size = 9 }) => {
  const { t } = useTheme();
  return (
    <Text
      style={[
        styles.monoLabel,
        { color: color ?? t.inkMute, fontSize: size },
      ]}
    >
      {children}
    </Text>
  );
};

export const DetailRow: React.FC<{
  label: string;
  value: string;
  valueColor?: string;
  valueBold?: boolean;
  valueStrike?: boolean;
  mono?: boolean;
}> = ({ label, value, valueColor, valueBold, valueStrike, mono }) => {
  const { t } = useTheme();
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: t.inkDim }]}>{label}</Text>
      <Text
        style={[
          styles.detailValue,
          mono && styles.mono,
          { color: valueColor ?? t.ink },
          valueBold && { fontWeight: '700', fontSize: 15 },
          valueStrike && { textDecorationLine: 'line-through' },
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

export const Divider: React.FC = () => {
  const { t } = useTheme();
  return <View style={[styles.divider, { backgroundColor: t.line }]} />;
};

export const SuccessRing: React.FC<{
  icon: string;
  borderColor?: string;
  size?: number;
}> = ({ icon, borderColor, size = 72 }) => {
  const { t } = useTheme();
  return (
    <View
      style={[
        styles.successRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: borderColor ?? t.green,
        },
      ]}
    >
      <Text style={{ fontSize: size * 0.44 }}>{icon}</Text>
    </View>
  );
};

export const BigBalance: React.FC<{
  label: string;
  value: string;
  previousValue?: string;
  color?: string;
}> = ({ label, value, previousValue, color }) => {
  const { t } = useTheme();
  return (
    <View style={styles.bigBalance}>
      <MonoLabel>{label}</MonoLabel>
      <Text
        style={[
          styles.bigBalanceVal,
          { color: color ?? t.green },
        ]}
      >
        {value}
      </Text>
      {previousValue ? (
        <Text style={styles.bigBalancePrev}>antes: {previousValue}</Text>
      ) : null}
    </View>
  );
};

export const TxHashBlock: React.FC<{
  hash: string;
  caption: string;
}> = ({ hash, caption }) => {
  const { t } = useTheme();
  const url = `https://explorer.solana.com/tx/${hash}?cluster=devnet`;

  return (
    <View style={[styles.txBlock, { backgroundColor: t.bg }]}>
      <TouchableOpacity onPress={() => Linking.openURL(url)}>
        <Text style={[styles.txHash, { color: t.orange }]}>
          {shortenHash(hash)}
        </Text>
      </TouchableOpacity>
      <Text style={[styles.txCaption, { color: t.inkFaint }]}>{caption}</Text>
    </View>
  );
};

export const BiometricScreen: React.FC<{
  title: string;
  subtitle: string;
  explanationItems: string[];
  onComplete: () => void;
}> = ({ title, subtitle, explanationItems, onComplete }) => {
  const { t } = useTheme();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();

    const timer = setTimeout(onComplete, 2000);
    return () => {
      anim.stop();
      clearTimeout(timer);
    };
  }, [onComplete, pulse]);

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.4],
  });

  return (
    <View style={styles.bioContainer}>
      <View style={styles.bioHeader}>
        <Text style={[styles.bioTitle, { color: t.ink }]}>{title}</Text>
        <MonoLabel>{subtitle}</MonoLabel>
      </View>

      <View style={styles.bioCenter}>
        <Animated.Text style={[styles.bioIcon, { opacity }]}>
          🔐
        </Animated.Text>
        <Text style={[styles.bioAction, { color: t.ink }]}>
          Confirme com sua digital
        </Text>
        <MonoLabel>CHAVE PRIVADA NUNCA SAI DO CELULAR</MonoLabel>
      </View>

      <SoftCard radius={radii.card} padding={16}>
        <View style={styles.bioExplainInner}>
          <MonoLabel>O QUE ACONTECE</MonoLabel>
          <View style={{ height: 10 }} />
          {explanationItems.map((item, i) => (
            <Text
              key={i}
              style={[styles.bioExplainItem, { color: t.inkDim }]}
            >
              {item}
            </Text>
          ))}
        </View>
      </SoftCard>
    </View>
  );
};

export const ComparisonGrid: React.FC<{
  bankValue: string;
  bankDiscount: string;
  koraValue: string;
  koraDiscount: string;
}> = ({ bankValue, bankDiscount, koraValue, koraDiscount }) => {
  const { t } = useTheme();
  return (
    <View style={styles.compareRow}>
      <View style={[styles.compareBox, styles.compareBad]}>
        <MonoLabel>BANCO</MonoLabel>
        <Text style={[styles.compareValue, { color: '#f87171' }]}>
          {bankValue}
        </Text>
        <MonoLabel>{bankDiscount}</MonoLabel>
      </View>
      <View
        style={[
          styles.compareBox,
          styles.compareGood,
        ]}
      >
        <MonoLabel>KORA</MonoLabel>
        <Text style={[styles.compareValue, { color: t.green }]}>
          {koraValue}
        </Text>
        <MonoLabel>{koraDiscount}</MonoLabel>
      </View>
    </View>
  );
};

export const StatItem: React.FC<{
  label: string;
  value: string;
  valueColor?: string;
  hint?: string;
  hintColor?: string;
}> = ({ label, value, valueColor, hint, hintColor }) => {
  const { t } = useTheme();
  return (
    <View style={styles.statItem}>
      <MonoLabel size={8}>{label}</MonoLabel>
      <Text
        style={[
          styles.statValue,
          { color: valueColor ?? t.ink },
        ]}
      >
        {value}
      </Text>
      {hint ? (
        <Text style={[styles.statHint, { color: hintColor ?? t.inkMute }]}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  monoLabel: {
    fontFamily: fonts.mono.semibold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
  },
  detailValue: {
    fontFamily: fonts.mono.medium,
    fontSize: 12,
    fontWeight: '500',
  },
  mono: {
    fontFamily: fonts.mono.medium,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  successRing: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  bigBalance: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  bigBalanceVal: {
    fontFamily: fonts.sans.bold,
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: -1.5,
    marginTop: 6,
  },
  bigBalancePrev: {
    fontFamily: fonts.mono.regular,
    fontSize: 12,
    color: '#5a5a5e',
    textDecorationLine: 'line-through',
    marginTop: 4,
  },
  txBlock: {
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  txHash: {
    fontFamily: fonts.mono.medium,
    fontSize: 11,
  },
  txCaption: {
    fontFamily: fonts.mono.regular,
    fontSize: 9,
    marginTop: 4,
  },
  bioContainer: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  bioHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  bioTitle: {
    fontFamily: fonts.sans.bold,
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  bioCenter: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  bioIcon: {
    fontSize: 56,
    marginBottom: 14,
  },
  bioAction: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  bioExplainInner: {
    alignItems: 'center',
  },
  bioExplainItem: {
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    lineHeight: 22,
    textAlign: 'center',
  },
  compareRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  compareBox: {
    flex: 1,
    borderRadius: radii.cardSm,
    padding: 14,
    alignItems: 'center',
  },
  compareBad: {
    backgroundColor: '#1a0a0a',
    borderWidth: 1,
    borderColor: '#3b1520',
  },
  compareGood: {
    backgroundColor: '#0a1a0f',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.15)',
  },
  compareValue: {
    fontFamily: fonts.sans.bold,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginVertical: 6,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  statValue: {
    fontFamily: fonts.sans.bold,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 5,
    letterSpacing: -0.4,
  },
  statHint: {
    fontFamily: fonts.mono.regular,
    fontSize: 8,
    marginTop: 2,
  },
});
