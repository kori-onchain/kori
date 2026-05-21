import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  StatusBar,
  Easing,
  Platform,
  Text,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants/colors";

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  // Animation hooks
  const scaleAnim = useRef(new Animated.Value(0.75)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  // Metallic breathing glow of the prateada shape
  const shineOpacity = useRef(new Animated.Value(0.15)).current;
  
  // Diagonal shimmer sweep
  const shimmerTranslateX = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    // 1. Smooth Spring Entry (Scale & Fade In)
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

    // 2. Metallic Shimmer "Breathe" (Pulse of the shiny silver layer)
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineOpacity, {
          toValue: 0.85,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shineOpacity, {
          toValue: 0.40,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Shimmer Sweep Animation (Looping diagonal sweep)
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerTranslateX, {
          toValue: 200,
          duration: 1600,
          easing: Easing.bezier(0.25, 1, 0.5, 1),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerTranslateX, {
          toValue: -150,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(1300), // Delay between sweeps
      ])
    ).start();

    // 4. Automatic transition to onboarding
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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} translucent={true} />
      
      <Animated.View 
        style={[
          styles.logoWrapper, 
          { 
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            <View style={styles.maskContainer}>
              {/* Clean, standard, premium capital letter K as a text mask */}
              <Text style={styles.maskText}>K</Text>
            </View>
          }
        >
          {/* Base layer: Dark premium silver */}
          <View style={styles.baseBranchFill} />
          
          {/* Shine layer: Glowing prateada */}
          <Animated.View style={[styles.shineBranchFill, { opacity: shineOpacity }]} />

          {/* Shimmer gloss sweep line (sweeps across the whole K) */}
          <Animated.View 
            style={[
              styles.shimmerSweep, 
              { 
                transform: [
                  { translateX: shimmerTranslateX },
                  { rotate: "22deg" }
                ] 
              }
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
    width: 120,
    height: 140,
    position: "relative",
  },
  baseBranchFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#CCCCCC", // Sleek metallic silver base
  },
  shineBranchFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF", // Radiant shining white-silver
  },
  shimmerSweep: {
    position: "absolute",
    width: 60,
    height: 250,
    top: -50,
    left: -30,
  },
  maskContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  maskText: {
    fontSize: 130,
    fontWeight: "900",
    color: "#000000",
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "System",
      android: "sans-serif-black",
      default: "sans-serif",
    }),
  },
});
