import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { Feather } from "../../../icons";
import { useTheme } from "../../../theme/ThemeProvider";
import { PaymentCard } from "../PaymentDS";
import { fonts } from "../../../theme/tokens";

interface PayingScreenProps {
  onComplete: () => void;
}

export const PayingScreen: React.FC<PayingScreenProps> = ({ onComplete }) => {
  const { t } = useTheme();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    const timer = setTimeout(onComplete, 1800);

    return () => {
      loop.stop();
      clearTimeout(timer);
    };
  }, [onComplete, pulse]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.18],
  });
  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.22, 0.06],
  });

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <View style={styles.iconWrap}>
        <Animated.View
          style={[
            styles.pulse,
            {
              backgroundColor: t.btnPrimaryBg,
              opacity,
              transform: [{ scale }],
            },
          ]}
        />
        <PaymentCard padding={0} style={styles.iconCard}>
          <View style={styles.iconCenter}>
            <Feather name="send" size={30} color={t.orange} />
          </View>
        </PaymentCard>
      </View>
      <Text style={[styles.title, { color: t.ink }]}>Enviando pagamento</Text>
      <Text style={[styles.subtitle, { color: t.inkMute }]}>
        Confirmando a transação na Solana.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  iconWrap: {
    width: 112,
    height: 112,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  pulse: {
    position: "absolute",
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  iconCard: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  iconCenter: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: fonts.sans.semibold,
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 8,
    fontFamily: fonts.sans.medium,
    fontSize: 13,
  },
});
