import React from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "@components/layout/Button";
import { ArrowRightIcon, KoriGlyph } from "@components/layout/icons";
import { useTheme } from "@theme/ThemeProvider";
import { useOnboardingData, Slide } from "@hooks/useOnboardingData";
import { useOnboardingLogic } from "@hooks/useOnboardingLogic";
import { Dots } from "@components/onboarding/Dots";
import { PoweredBySolana } from "@components/onboarding/PoweredBySolana";
import { TransactionMock } from "@components/onboarding/TransactionMock";
import { YieldMock } from "@components/onboarding/YieldMock";

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> & {
  Container: React.FC<{ children: React.ReactNode; bg: string; barStyle: any }>;
  SkipButton: React.FC<{ onSkip: () => void; show: boolean; label: string }>;
  SlideBody: React.FC<{
    slide: Slide;
    transactionMock: any;
    yieldMock: any;
    brandLabel: string;
  }>;
  Footer: React.FC<{ children: React.ReactNode }>;
} = ({ onComplete }) => {
  const { t } = useTheme();
  const { slides, transactionMock, yieldMock, actions } = useOnboardingData();
  const {
    activeIndex,
    currentSlide,
    isLast,
    screenKey,
    handleNext,
    animatedStyle,
  } = useOnboardingLogic({ slides, onComplete });

  return (
    <OnboardingScreen.Container bg={t.bg} barStyle={t.statusBar}>
      <Animated.View
        style={[animatedStyle, styles.flexContainer]}
        key={screenKey}
      >
        <OnboardingScreen.SkipButton
          onSkip={onComplete}
          show={!isLast}
          label={actions.skipText}
        />

        <OnboardingScreen.SlideBody
          slide={currentSlide}
          transactionMock={transactionMock}
          yieldMock={yieldMock}
          brandLabel={actions.brandLabel}
        />

        <OnboardingScreen.Footer>
          <Dots total={slides.length} active={activeIndex} />
          <Button
            label={
              isLast
                ? actions.createAccountButton
                : activeIndex === 0
                  ? actions.startButton
                  : actions.nextButton
            }
            onPress={isLast ? onComplete : handleNext}
            variant="primary"
            icon={
              !isLast ? (
                <ArrowRightIcon size={16} color="#0a0a0a" strokeWidth={2} />
              ) : undefined
            }
            iconPosition="right"
            style={styles.ctaButton}
          />
          {isLast && (
            <Button
              label={actions.hasAccountButton}
              onPress={onComplete}
              variant="secondary"
              style={styles.secondaryCtaButton}
            />
          )}
          {(activeIndex === 0 || isLast) && (
            <PoweredBySolana label={actions.poweredBy} />
          )}
        </OnboardingScreen.Footer>
      </Animated.View>
    </OnboardingScreen.Container>
  );
};

const OnboardingContainer: React.FC<{
  children: React.ReactNode;
  bg: string;
  barStyle: any;
}> = ({ children, bg, barStyle }) => (
  <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
    <StatusBar barStyle={barStyle} backgroundColor={bg} translucent />
    <View className="flex-1 bg-bg">{children}</View>
  </SafeAreaView>
);

const OnboardingSkipButton: React.FC<{
  onSkip: () => void;
  show: boolean;
  label: string;
}> = ({ onSkip, show, label }) => (
  <View className="h-6 flex-row items-center justify-end">
    {show && (
      <TouchableOpacity activeOpacity={0.7} onPress={onSkip}>
        <Text className="font-mono text-[10px] uppercase tracking-[0.5px] text-ink-mute">
          {label}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

const OnboardingSlideBody: React.FC<{
  slide: Slide;
  transactionMock: any;
  yieldMock: any;
  brandLabel: string;
}> = ({ slide, transactionMock, yieldMock, brandLabel }) => {
  if (!slide) return null;
  if (slide.kind === "brand" || slide.kind === "finish") {
    return (
      <View className="flex-1 items-center justify-center text-center">
        <KoriGlyph size={82} color="#fafafa" />
        {slide.kind === "brand" && (
          <Text className="mt-[30px] pl-[5px] font-sans-bold text-[14px] uppercase tracking-[5.8px] text-ink-dim">
            {brandLabel}
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
        {slide.eyebrow && (
          <Text className="font-mono text-[10px] uppercase tracking-[1.2px] text-ink-mute">
            {slide.eyebrow}
          </Text>
        )}
        <Text className="mt-2.5 font-sans-bold text-[27px] leading-[31px] tracking-[-0.8px] text-ink">
          {slide.title}
        </Text>
        <Text className="mt-3 font-sans text-[13px] leading-5 text-ink-dim">
          {slide.body}
        </Text>
      </View>

      <View className="flex-1 items-center justify-center py-5">
        {slide.kind === "pay" ? (
          <TransactionMock data={transactionMock} />
        ) : (
          <YieldMock data={yieldMock} />
        )}
      </View>
    </View>
  );
};

const OnboardingFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <View>{children}</View>;

OnboardingScreen.Container = OnboardingContainer;
OnboardingScreen.SkipButton = OnboardingSkipButton;
OnboardingScreen.SlideBody = OnboardingSlideBody;
OnboardingScreen.Footer = OnboardingFooter;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
    paddingHorizontal: 26,
    paddingBottom: 26,
    paddingTop: 10,
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
