import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  StatusBar,
  Easing,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants/colors";
import { KoraGlyph, KoraWordmark } from "../components/ds/icons";

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const GLYPH_SIZE = 110;
const WORDMARK_HEIGHT = 22;
const STACK_GAP = 16;
const WRAPPER_WIDTH = 170;
const WRAPPER_HEIGHT = GLYPH_SIZE + STACK_GAP + WORDMARK_HEIGHT;

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onAnimationComplete,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.75)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const shineOpacity = useRef(new Animated.Value(0.15)).current;
  const shimmerTranslateX = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.0,
        friction: 6,
        tension: 30,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(shineOpacity, {
          toValue: 0.85,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shineOpacity, {
          toValue: 0.4,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerTranslateX, {
          toValue: 240,
          duration: 1600,
          easing: Easing.bezier(0.25, 1, 0.5, 1),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerTranslateX, {
          toValue: -150,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(1300),
      ])
    ).start();

    const timeout = setTimeout(() => {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onAnimationComplete();
      });
    }, 3900);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
        translucent={true}
      />

      <Animated.View
        style={[
          styles.logoWrapper,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            <View style={styles.maskStack}>
              <KoraGlyph size={GLYPH_SIZE} color="#000" />
              <View style={{ height: STACK_GAP }} />
              <KoraWordmark height={WORDMARK_HEIGHT} color="#000" />
            </View>
          }
        >
          {/* Base layer — premium silver */}
          <View style={styles.baseFill} />

          {/* Shine layer — radiant white, breathing */}
          <Animated.View
            style={[styles.shineFill, { opacity: shineOpacity }]}
          />

          {/* Diagonal shimmer sweep */}
          <Animated.View
            style={[
              styles.shimmerSweep,
              {
                transform: [
                  { translateX: shimmerTranslateX },
                  { rotate: "22deg" },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={[
                "rgba(255, 255, 255, 0.0)",
                "rgba(255, 255, 255, 0.06)",
                "rgba(255, 255, 255, 0.28)",
                "rgba(255, 255, 255, 0.38)",
                "rgba(255, 255, 255, 0.28)",
                "rgba(255, 255, 255, 0.06)",
                "rgba(255, 255, 255, 0.0)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </MaskedView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  logoWrapper: {
    width: WRAPPER_WIDTH,
    height: WRAPPER_HEIGHT,
    position: "relative",
  },
  maskStack: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  baseFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#CCCCCC",
  },
  shineFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
  },
  shimmerSweep: {
    position: "absolute",
    width: 70,
    height: WRAPPER_HEIGHT + 120,
    top: -60,
    left: -40,
  },
});
