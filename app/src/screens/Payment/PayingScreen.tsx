import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { Feather } from "@/icons";
import { useTheme } from "@theme/ThemeProvider";
import { PaymentCard } from "@components/home/modals/PaymentDS";
import { fonts } from "@theme/tokens";

interface PayingScreenProps {
  onComplete: (result?: any) => void;
  onError?: (message: string) => void;
  paymentTask?: () => Promise<any>;
}

export const PayingScreen: React.FC<PayingScreenProps> = ({
  onComplete,
  onError,
  paymentTask,
}) => {
  const { t } = useTheme();
  const pulse = useRef(new Animated.Value(0)).current;
  const [message, setMessage] = useState("Confirmando a transacao na Solana.");

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

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const run = async () => {
      try {
        if (paymentTask) {
          const result = await paymentTask();
          if (!cancelled) onComplete(result);
          return;
        }

        timer = setTimeout(() => {
          if (!cancelled) onComplete();
        }, 1800);
      } catch (error: any) {
        if (!cancelled) {
          const nextMessage =
            error?.message || "Nao foi possivel enviar o pagamento.";
          setMessage(nextMessage);
          onError?.(nextMessage);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
      loop.stop();
      if (timer) clearTimeout(timer);
    };
  }, [onComplete, onError, paymentTask, pulse]);

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
              backgroundColor: t.ink,
              opacity,
              transform: [{ scale }],
            },
          ]}
        />
        <PaymentCard
          padding={0}
          style={[
            styles.iconCard,
            { backgroundColor: t.bgElev, borderColor: t.line, borderWidth: 1 },
          ]}
        >
          <View style={styles.iconCenter}>
            <Feather name="send" size={28} color={t.ink} />
          </View>
        </PaymentCard>
      </View>
      <Text style={[styles.title, { color: t.ink }]}>Enviando pagamento</Text>
      <Text style={[styles.subtitle, { color: t.inkDim }]}>{message}</Text>
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
    textAlign: "center",
  },
});
