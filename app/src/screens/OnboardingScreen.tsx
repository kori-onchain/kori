import React, { ReactNode, useMemo, useState } from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Path,
  Stop,
} from "react-native-svg";

import { Button } from "../components/ds/Button";
import { ArrowRightIcon, KoraGlyph, SolanaIcon } from "../components/ds/icons";
import { SoftCard } from "../components/ds/SoftCard";
import { useTheme } from "../theme/ThemeProvider";
import { radii } from "../theme/tokens";

interface OnboardingScreenProps {
  onComplete: () => void;
}

type SlideKind = "brand" | "pay" | "yield" | "finish";

type Slide = {
  kind: SlideKind;
  eyebrow?: string;
  title: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    kind: "brand",
    title: "O banco que\nnasce on-chain.",
    body: "Sua conta vive na blockchain mais rápida do mundo. Sem agência, sem papel, sem fronteira.",
  },
  {
    kind: "pay",
    eyebrow: "01 / 02",
    title: "Dinheiro na\nvelocidade da rede.",
    body: "Transfira em segundos, com taxa que beira zero. Sem TED, sem boleto, sem horário bancário.",
  },
  {
    kind: "yield",
    eyebrow: "02 / 02",
    title: "Seu dinheiro\nnão dorme.",
    body: "Saldo parado rende on-chain, com transparência total. Você vê cada centavo render.",
  },
  {
    kind: "finish",
    title: "Sua conta on-chain\nem 30 segundos.",
    body: "Self-custody de verdade: as chaves são suas. A gente só deixa simples.",
  },
];

const ScreenShell = ({ children }: { children: ReactNode }) => (
  <View className="flex-1 bg-bg">{children}</View>
);

const PoweredBySolana = () => (
  <View className="mt-[18px] flex-row items-center justify-center gap-1.5">
    <Text className="font-mono text-[9px] uppercase tracking-[0.7px] text-ink-mute">
      powered by
    </Text>
    <SolanaIcon width={14} height={11} color="#9a9a9e" />
    <Text className="font-mono-semibold text-[9px] tracking-[0.4px] text-ink-dim">
      Solana
    </Text>
  </View>
);

const Dots = ({ active }: { active: number }) => (
  <View className="mb-5 flex-row justify-center gap-[7px]">
    {SLIDES.map((_, index) => (
      <View
        key={index}
        className={`h-[7px] rounded-full ${
          active === index ? "w-[22px] bg-ink" : "w-[7px] bg-ink-faint"
        }`}
      />
    ))}
  </View>
);

const PrimaryButton = ({
  label,
  onPress,
  showArrow = false,
}: {
  label: string;
  onPress: () => void;
  showArrow?: boolean;
}) => (
  <Button
    label={label}
    onPress={onPress}
    variant="primary"
    icon={showArrow ? <ArrowRightIcon size={16} color="#0a0a0a" strokeWidth={2} /> : undefined}
    iconPosition="right"
    style={styles.ctaButton}
  />
);

const SoftButton = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <Button
    label={label}
    onPress={onPress}
    variant="secondary"
    style={styles.secondaryCtaButton}
  />
);

const GlossCard = ({ children }: { children: ReactNode }) => (
  <SoftCard radius={radii.card} padding={18} strong style={styles.fullWidth}>
    {children}
  </SoftCard>
);

const TransactionMock = () => (
  <View className="w-full">
    <GlossCard>
      <View className="flex-row items-center gap-[11px]">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-bg-elev">
          <Text className="font-sans-bold text-[15px] text-ink">A</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="font-sans-semibold text-[13px] text-ink">
              @anaclara
            </Text>
            <View className="h-[13px] w-[13px] items-center justify-center rounded-full bg-green">
              <Text className="text-[8px] font-black text-bg">✓</Text>
            </View>
          </View>
          <Text className="mt-0.5 font-mono text-[8px] text-ink-mute">
            verificado on-chain · 9Drx...4tNm
          </Text>
        </View>
      </View>

      <Text className="my-4 text-center font-sans-bold text-[30px] tracking-[-1px] text-ink">
        R$ 240,00
      </Text>

      <View className="gap-[7px] border-t border-line pt-3.5">
        <MetaRow label="Taxa de rede" value="$0.0001" accent />
        <MetaRow label="Liquidação" value="~0,4s" />
        <MetaRow label="Rede" value="Solana" />
      </View>

      <View className="mt-3.5 flex-row items-center justify-center gap-[7px]">
        <View className="h-1.5 w-1.5 rounded-full bg-green" />
        <Text className="font-mono-medium text-[10px] text-green">
          Enviado · confirmado on-chain
        </Text>
      </View>
    </GlossCard>
  </View>
);

const MetaRow = ({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) => (
  <View className="flex-row justify-between">
    <Text className="font-mono text-[9px] text-ink-mute">{label}</Text>
    <Text
      className={`font-mono-medium text-[10px] ${accent ? "text-green" : "text-ink"}`}
    >
      {value}
    </Text>
  </View>
);

const YieldChart = () => (
  <Svg width="100%" height={80} viewBox="0 0 260 80" preserveAspectRatio="none">
    <Defs>
      <SvgGradient id="yieldGradient" x1="0" x2="0" y1="0" y2="1">
        <Stop offset="0%" stopColor="#4ade80" stopOpacity={0.35} />
        <Stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
      </SvgGradient>
    </Defs>
    <Path
      d="M0 64 Q30 60 55 54 T110 42 T165 28 T215 16 T260 6"
      stroke="#4ade80"
      strokeWidth={2.4}
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d="M0 64 Q30 60 55 54 T110 42 T165 28 T215 16 T260 6 L260 80 L0 80 Z"
      fill="url(#yieldGradient)"
    />
    <Circle cx={260} cy={6} r={4} fill="#4ade80" />
  </Svg>
);

const YieldMock = () => (
  <View className="w-full">
    <GlossCard>
      <Text className="font-mono text-[9px] uppercase tracking-[1.35px] text-ink-mute">
        Rendendo agora
      </Text>
      <Text className="mt-1 font-sans-bold text-[28px] tracking-[-0.8px] text-ink">
        R$ 8.420,18
      </Text>
      <Text className="mt-0.5 font-mono-medium text-[11px] text-green">
        +R$ 412,80 · APY 15,2%
      </Text>
      <View className="mt-3.5 h-20">
        <YieldChart />
      </View>
      <View className="mt-3 flex-row justify-between border-t border-line pt-3">
        <YieldStat label="Hoje" value="+R$ 4,82" accent />
        <YieldStat label="No mês" value="+R$ 138" accent />
        <YieldStat label="Liquidez" value="imediata" />
      </View>
    </GlossCard>
  </View>
);

const YieldStat = ({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) => (
  <View>
    <Text className="font-mono text-[8px] uppercase text-ink-mute">
      {label}
    </Text>
    <Text
      className={`mt-0.5 font-sans-bold text-[14px] ${
        accent ? "text-green" : "text-ink"
      }`}
    >
      {value}
    </Text>
  </View>
);

const SlideBody = ({ slide }: { slide: Slide }) => {
  if (slide.kind === "brand" || slide.kind === "finish") {
    return (
      <View className="flex-1 items-center justify-center text-center">
        <KoraGlyph size={82} color="#fafafa" />
        {slide.kind === "brand" && (
          <Text className="mt-[30px] pl-[5px] font-sans-bold text-[14px] uppercase tracking-[5.8px] text-ink-dim">
            KORA
          </Text>
        )}
        <Text className="mt-6 text-center font-sans-bold text-[30px] leading-[34px] tracking-[-1px] text-ink">
          {slide.title}
        </Text>
        <Text className="mt-3.5 max-w-[250px] text-center font-sans text-[14px] leading-[22px] text-ink-dim">
          {slide.body}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="pt-1">
        <Text className="font-mono text-[10px] uppercase tracking-[1.2px] text-ink-mute">
          {slide.eyebrow}
        </Text>
        <Text className="mt-2.5 font-sans-bold text-[27px] leading-[31px] tracking-[-0.8px] text-ink">
          {slide.title}
        </Text>
        <Text className="mt-3 font-sans text-[13px] leading-5 text-ink-dim">
          {slide.body}
        </Text>
      </View>

      <View className="flex-1 items-center justify-center py-5">
        {slide.kind === "pay" ? <TransactionMock /> : <YieldMock />}
      </View>
    </View>
  );
};

const SlideFooter = ({
  activeIndex,
  isLast,
  onNext,
  onComplete,
}: {
  activeIndex: number;
  isLast: boolean;
  onNext: () => void;
  onComplete: () => void;
}) => (
  <View>
    <Dots active={activeIndex} />
    <PrimaryButton
      label={isLast ? "Criar conta" : activeIndex === 0 ? "Começar" : "Próximo"}
      onPress={isLast ? onComplete : onNext}
      showArrow={!isLast}
    />
    {isLast && <SoftButton label="Já tenho conta" onPress={onComplete} />}
    {(activeIndex === 0 || isLast) && <PoweredBySolana />}
  </View>
);

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
}) => {
  const { t } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const slideOpacity = React.useRef(new Animated.Value(1)).current;
  const slideX = React.useRef(new Animated.Value(0)).current;
  const slide = SLIDES[activeIndex];
  const isLast = activeIndex === SLIDES.length - 1;

  const screenKey = useMemo(
    () => `${slide.kind}-${activeIndex}`,
    [activeIndex, slide.kind],
  );

  const handleNext = () => {
    if (isLast) {
      onComplete();
      return;
    }

    Animated.parallel([
      Animated.timing(slideX, {
        toValue: -34,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(slideOpacity, {
        toValue: 0,
        duration: 130,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveIndex((current) => current + 1);
      slideX.setValue(34);
      slideOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(slideX, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(slideOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const animatedStyle = {
    opacity: slideOpacity,
    transform: [
      {
        translateX: slideX,
      },
    ],
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} translucent />
      <ScreenShell key={screenKey}>
        <Animated.View
          style={animatedStyle}
          className="flex-1 px-[26px] pb-[26px] pt-2.5"
        >
          <View className="h-6 flex-row items-center justify-end">
            {!isLast && (
              <TouchableOpacity activeOpacity={0.7} onPress={onComplete}>
                <Text className="font-mono text-[10px] uppercase tracking-[0.5px] text-ink-mute">
                  pular
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <SlideBody slide={slide} />

          <SlideFooter
            activeIndex={activeIndex}
            isLast={isLast}
            onNext={handleNext}
            onComplete={onComplete}
          />
        </Animated.View>
      </ScreenShell>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  fullWidth: {
    width: "100%",
  },
  ctaButton: {
    width: "100%",
    minHeight: 52,
  },
  secondaryCtaButton: {
    width: "100%",
    minHeight: 52,
    marginTop: 8,
  },
});
