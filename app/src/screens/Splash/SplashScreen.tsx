import React from "react";
import { View, StyleSheet, Animated, StatusBar } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@theme/ThemeProvider";
import { KoriGlyph } from "@components/layout/icons";
import { useSplashLogic } from "@hooks/useSplashLogic";

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const GLYPH_SIZE = 120;
const WRAPPER_SIZE = GLYPH_SIZE;

export const SplashScreen: React.FC<SplashScreenProps> & {
  Container: React.FC<{ children: React.ReactNode; bg: string; barStyle: any }>;
  LogoWrapper: React.FC<{
    children: React.ReactNode;
    opacity: any;
    scale: any;
  }>;
  ShimmerMask: React.FC<{ children: React.ReactNode }>;
  ShimmerSweep: React.FC<{ translateX: any }>;
} = ({ onAnimationComplete }) => {
  const { t } = useTheme();
  const { scaleAnim, opacityAnim, shineOpacity, shimmerTranslateX } =
    useSplashLogic({
      onAnimationComplete,
    });

  return (
    <SplashScreen.Container bg={t.bg} barStyle={t.statusBar}>
      <SplashScreen.LogoWrapper opacity={opacityAnim} scale={scaleAnim}>
        <SplashScreen.ShimmerMask>
          <View style={styles.baseFill} />
          <Animated.View
            style={[styles.shineFill, { opacity: shineOpacity }]}
          />
          <SplashScreen.ShimmerSweep translateX={shimmerTranslateX} />
        </SplashScreen.ShimmerMask>
      </SplashScreen.LogoWrapper>
    </SplashScreen.Container>
  );
};

const SplashScreenContainer: React.FC<{
  children: React.ReactNode;
  bg: string;
  barStyle: any;
}> = ({ children, bg, barStyle }) => (
  <View style={[styles.container, { backgroundColor: bg }]}>
    <StatusBar barStyle={barStyle} backgroundColor={bg} translucent />
    {children}
  </View>
);

const SplashScreenLogoWrapper: React.FC<{
  children: React.ReactNode;
  opacity: any;
  scale: any;
}> = ({ children, opacity, scale }) => (
  <Animated.View
    style={[styles.logoWrapper, { opacity, transform: [{ scale }] }]}
  >
    {children}
  </Animated.View>
);

const SplashScreenShimmerMask: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <MaskedView
    style={StyleSheet.absoluteFill}
    maskElement={
      <View style={styles.maskStack}>
        <KoriGlyph size={GLYPH_SIZE} color="#000" />
      </View>
    }
  >
    {children}
  </MaskedView>
);

const SplashScreenShimmerSweep: React.FC<{ translateX: any }> = ({
  translateX,
}) => (
  <Animated.View
    style={[
      styles.shimmerSweep,
      {
        transform: [{ translateX }, { rotate: "22deg" }],
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
);

SplashScreen.Container = SplashScreenContainer;
SplashScreen.LogoWrapper = SplashScreenLogoWrapper;
SplashScreen.ShimmerMask = SplashScreenShimmerMask;
SplashScreen.ShimmerSweep = SplashScreenShimmerSweep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoWrapper: {
    width: WRAPPER_SIZE,
    height: WRAPPER_SIZE,
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
    height: WRAPPER_SIZE + 120,
    top: -60,
    left: -40,
  },
});
