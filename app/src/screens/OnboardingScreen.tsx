import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Easing,
  Platform,
} from "react-native";
import { Feather, Ionicons } from "../icons";
import { useTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/tokens";

const { width, height } = Dimensions.get("window");

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { t } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  // Transition values for content slide
  const slideAnimation = useRef(new Animated.Value(0)).current; // 0 to 1 transition
  const illustrationTranslateY = useRef(new Animated.Value(0)).current;

  // Slide 1 animations: pulsing dashboard bars
  const bar1ScaleY = useRef(new Animated.Value(1)).current;
  const bar2ScaleY = useRef(new Animated.Value(1)).current;
  const bar3ScaleY = useRef(new Animated.Value(1)).current;

  // Slide 2 animations: swapping cards
  const card1TranslateX = useRef(new Animated.Value(-15)).current;
  const card1TranslateY = useRef(new Animated.Value(-10)).current;
  const card1Scale = useRef(new Animated.Value(0.9)).current;
  const card1ZIndex = useRef(new Animated.Value(1)).current;
  
  const card2TranslateX = useRef(new Animated.Value(15)).current;
  const card2TranslateY = useRef(new Animated.Value(10)).current;
  const card2Scale = useRef(new Animated.Value(0.95)).current;

  // Slide 3 animations: security ripples
  const ripple1Scale = useRef(new Animated.Value(0.6)).current;
  const ripple1Opacity = useRef(new Animated.Value(0.8)).current;
  const ripple2Scale = useRef(new Animated.Value(0.6)).current;
  const ripple2Opacity = useRef(new Animated.Value(0.5)).current;

  // Bottom button width transition
  const buttonWidth = useRef(new Animated.Value(width - 48)).current;

  const slides = [
    {
      title: "Controle Inteligente",
      subtitle: "Acompanhe saldos, rendimentos e movimentações em tempo real com gráficos e relatórios minimalistas.",
    },
    {
      title: "Transição Instantânea",
      subtitle: "Alterne com um toque entre sua conta Personal e Business com total separação. Uma carteira organizada.",
    },
    {
      title: "Segurança Extrema",
      subtitle: "Sua carteira protegida com biometria facial, digital e PIN de 5 dígitos criptografados localmente.",
    },
  ];

  useEffect(() => {
    // Floating bounce for illustration area
    Animated.loop(
      Animated.sequence([
        Animated.timing(illustrationTranslateY, {
          toValue: -8,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(illustrationTranslateY, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Setup visual animations based on slide index
    startIllustrationAnimations();
  }, [activeIndex]);

  const startIllustrationAnimations = () => {
    if (activeIndex === 0) {
      // Slide 1: Pulsing Bar Graph
      const animateBar = (anim: Animated.Value, max: number) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: max,
              duration: 800 + Math.random() * 500,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 1,
              duration: 800 + Math.random() * 500,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ).start();
      };
      animateBar(bar1ScaleY, 1.6);
      animateBar(bar2ScaleY, 2.1);
      animateBar(bar3ScaleY, 1.4);
    } else if (activeIndex === 1) {
      // Slide 2: Swapping Cards loop
      Animated.loop(
        Animated.sequence([
          // Phase 1: Card 1 moves forward, Card 2 moves backward
          Animated.parallel([
            Animated.timing(card1TranslateX, { toValue: 20, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(card1TranslateY, { toValue: 12, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(card1Scale, { toValue: 1.0, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            
            Animated.timing(card2TranslateX, { toValue: -20, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(card2TranslateY, { toValue: -12, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(card2Scale, { toValue: 0.85, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          ]),
          Animated.delay(600),
          // Phase 2: Card 1 moves backward, Card 2 moves forward
          Animated.parallel([
            Animated.timing(card1TranslateX, { toValue: -20, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(card1TranslateY, { toValue: -12, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(card1Scale, { toValue: 0.85, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            
            Animated.timing(card2TranslateX, { toValue: 20, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(card2TranslateY, { toValue: 12, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(card2Scale, { toValue: 1.0, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          ]),
          Animated.delay(600),
        ])
      ).start();
    } else if (activeIndex === 2) {
      // Slide 3: Expanding radar security waves
      const animateRadar = (scale: Animated.Value, opacity: Animated.Value, delay: number) => {
        scale.setValue(0.6);
        opacity.setValue(0.8);
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(scale, {
                toValue: 2.2,
                duration: 2000,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      };
      animateRadar(ripple1Scale, ripple1Opacity, 0);
      animateRadar(ripple2Scale, ripple2Opacity, 1000);
    }
  };

  const handleNext = () => {
    if (activeIndex < 2) {
      // Slide transition fade-in effect
      slideAnimation.setValue(0);
      setActiveIndex((prev) => prev + 1);
      
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      // Last step: transition out
      onComplete();
    }
  };

  // Skip all slide onboarding
  const handleSkip = () => {
    onComplete();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} translucent={true} />
      
      {/* Top Header Row with brand logo and Skip button */}
      <View style={styles.topRow}>
        <View style={[styles.miniLogo, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
          <Text style={[styles.miniLogoText, { color: t.ink }]}>K</Text>
        </View>
        
        {activeIndex < 2 && (
          <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} style={[styles.skipBtn, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
            <Text style={[styles.skipBtnText, { color: t.inkMute }]}>Pular</Text>
            <Feather name="chevron-right" size={14} color={t.inkMute} />
          </TouchableOpacity>
        )}
      </View>

      {/* Main interactive visual area */}
      <Animated.View style={[styles.visualArea, { transform: [{ translateY: illustrationTranslateY }] }]}>
        
        {/* SLIDE 1 VISUAL: Intelligent Balance Graphic Dashboard */}
        {activeIndex === 0 && (
          <View style={styles.slide1Container}>
            <View style={[styles.dashboardCard, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.circleDot, { backgroundColor: t.green }]} />
                <View style={[styles.barPlaceholder, { backgroundColor: t.inkFaint }]} />
              </View>
              <Text style={[styles.cardBalance, { color: t.ink }]}>$2,845.50</Text>
              
              <View style={styles.barChartRow}>
                <View style={styles.chartCol}>
                  <Animated.View style={[styles.chartBar, { backgroundColor: t.inkFaint, transform: [{ scaleY: bar1ScaleY }] }]} />
                  <Text style={[styles.chartBarLabel, { color: t.inkMute }]}>SEG</Text>
                </View>
                <View style={styles.chartCol}>
                  <Animated.View style={[styles.chartBar, { backgroundColor: t.ink }, { transform: [{ scaleY: bar2ScaleY }] }]} />
                  <Text style={[styles.chartBarLabel, { color: t.inkMute }]}>TER</Text>
                </View>
                <View style={styles.chartCol}>
                  <Animated.View style={[styles.chartBar, { backgroundColor: t.inkFaint, transform: [{ scaleY: bar3ScaleY }] }]} />
                  <Text style={[styles.chartBarLabel, { color: t.inkMute }]}>QUA</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* SLIDE 2 VISUAL: Interactive Card Swapping PF and PJ */}
        {activeIndex === 1 && (
          <View style={styles.slide2Container}>
            
            {/* Business (PJ) Card */}
            <Animated.View 
              style={[
                styles.floatingCard, 
                { backgroundColor: t.bg2, borderColor: t.cardBorder },
                { 
                  transform: [
                    { translateX: card1TranslateX }, 
                    { translateY: card1TranslateY }, 
                    { scale: card1Scale }
                  ],
                }
              ]}
            >
              <View style={styles.cardRowBetween}>
                <Text style={[styles.cardBrand, { color: t.ink }]}>Business</Text>
                <Ionicons name="business-outline" size={16} color={t.inkDim} />
              </View>
              <View style={styles.cardMiddle}>
                <Text style={[styles.cardLimitText, { color: t.inkMute }]}>SALDO ATIVO</Text>
                <Text style={[styles.cardValueText, { color: t.ink }]}>$12,450.00</Text>
              </View>
            </Animated.View>

            {/* Personal (PF) Card */}
            <Animated.View 
              style={[
                styles.floatingCard, 
                { backgroundColor: t.btnPrimaryBg },
                { 
                  transform: [
                    { translateX: card2TranslateX }, 
                    { translateY: card2TranslateY }, 
                    { scale: card2Scale }
                  ],
                }
              ]}
            >
              <View style={styles.cardRowBetween}>
                <Text style={[styles.cardBrand, { color: t.btnPrimaryFg }]}>Personal</Text>
                <Ionicons name="person-outline" size={16} color={t.btnPrimaryFg} />
              </View>
              <View style={styles.cardMiddle}>
                <Text style={[styles.cardLimitTextDark, { color: t.btnPrimaryFg }]}>SALDO ATIVO</Text>
                <Text style={[styles.cardValueTextDark, { color: t.btnPrimaryFg }]}>$4,320.00</Text>
              </View>
            </Animated.View>

          </View>
        )}

        {/* SLIDE 3 VISUAL: Shield with glowing security radar ripples */}
        {activeIndex === 2 && (
          <View style={styles.slide3Container}>
            
            {/* Animated expand ripple wave 1 */}
            <Animated.View 
              style={[
                styles.rippleRing, 
                { 
                  transform: [{ scale: ripple1Scale }], 
                  opacity: ripple1Opacity 
                }
              ]} 
            />

            {/* Animated expand ripple wave 2 */}
            <Animated.View 
              style={[
                styles.rippleRing, 
                { 
                  transform: [{ scale: ripple2Scale }], 
                  opacity: ripple2Opacity 
                }
              ]} 
            />

            {/* Central glowing secure shield button */}
            <View style={[styles.shieldCenterBox, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
              <Ionicons name="shield-checkmark-outline" size={38} color={t.ink} />
            </View>

          </View>
        )}

      </Animated.View>

      {/* Slide Text Content & Page Control Indicators */}
      <View style={styles.bottomSection}>
        <View style={styles.textBlock}>
          <Text style={[styles.slideTitle, { color: t.ink }]}>{slides[activeIndex].title}</Text>
          <Text style={[styles.slideSubtitle, { color: t.inkMute }]}>{slides[activeIndex].subtitle}</Text>
        </View>

        {/* Slide Indicators: dots/capsules */}
        <View style={styles.indicatorContainer}>
          {[0, 1, 2].map((index) => {
            const isActive = index === activeIndex;
            return (
              <View 
                key={index} 
                style={[
                  styles.indicatorCapsule,
                  { backgroundColor: isActive ? t.ink : t.inkFaint, width: isActive ? 24 : 8 }
                ]} 
              />
            );
          })}
        </View>

        {/* Bottom Primary Button */}
        <Animated.View style={{ width: buttonWidth }}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: t.btnPrimaryBg }]}
            onPress={handleNext} 
            activeOpacity={0.9}
          >
            <Text style={[styles.primaryButtonText, { color: t.btnPrimaryFg }]}>
              {activeIndex === 2 ? "Começar Agora" : "Avançar"}
            </Text>
            {activeIndex < 2 && (
              <Feather name="arrow-right" size={16} color={t.btnPrimaryFg} style={{ marginLeft: 6 }} />
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: Platform.OS === "ios" ? 20 : 30,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 45 : 15,
    height: 60,
  },
  miniLogo: {
    width: 32,
    height: 32,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  miniLogoText: {
    fontFamily: fonts.sans.bold,
    fontSize: 16,
    fontWeight: "bold",
  },
  skipBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 0.5,
  },
  skipBtnText: {
    fontSize: 12,
    fontWeight: "600",
    marginRight: 2,
  },
  visualArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: height * 0.45,
  },
  
  // Slide 1 Visual styles
  slide1Container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  dashboardCard: {
    width: 250,
    height: 180,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  circleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  barPlaceholder: {
    width: 50,
    height: 6,
    borderRadius: 3,
  },
  cardBalance: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 12,
  },
  barChartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 55,
  },
  chartCol: {
    alignItems: "center",
    width: 45,
  },
  chartBar: {
    width: 14,
    height: 20,
    borderRadius: 4,
    transformOrigin: "bottom",
  },
  chartBarActive: {
  },
  chartBarLabel: {
    fontSize: 8,
    fontWeight: "bold",
    marginTop: 6,
  },

  // Slide 2 Visual styles
  slide2Container: {
    position: "relative",
    width: 280,
    height: 190,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingCard: {
    position: "absolute",
    width: 180,
    height: 110,
    borderRadius: 16,
    padding: 14,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  businessCardColor: {
    borderWidth: 1,
    zIndex: 1,
  },
  personalCardColor: {
    zIndex: 10,
  },
  cardRowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardBrand: {
    fontSize: 13,
    fontWeight: "bold",
  },
  cardMiddle: {
    marginTop: 10,
  },
  cardLimitText: {
    fontSize: 8,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  cardLimitTextDark: {
    fontSize: 8,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  cardValueText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },
  cardValueTextDark: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },

  // Slide 3 Visual styles
  slide3Container: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  rippleRing: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
    backgroundColor: "rgba(255, 255, 255, 0.005)",
  },
  shieldCenterBox: {
    width: 82,
    height: 82,
    borderRadius: 28,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },

  // Bottom text & actions block
  bottomSection: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  textBlock: {
    alignItems: "center",
    marginBottom: 28,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  slideSubtitle: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 19,
    paddingHorizontal: 12,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 32,
  },
  indicatorCapsule: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  indicatorCapsuleActive: {
    width: 24,
  },
  primaryButton: {
    height: 52,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  primaryButtonComplete: {
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  primaryButtonTextComplete: {
  },
});
