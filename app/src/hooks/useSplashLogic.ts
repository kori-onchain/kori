import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface UseSplashLogicParams {
  onAnimationComplete: () => void;
}

export const useSplashLogic = ({ onAnimationComplete }: UseSplashLogicParams) => {
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
  }, [onAnimationComplete, opacityAnim, scaleAnim, shineOpacity, shimmerTranslateX]);

  return {
    scaleAnim,
    opacityAnim,
    shineOpacity,
    shimmerTranslateX,
  };
};
