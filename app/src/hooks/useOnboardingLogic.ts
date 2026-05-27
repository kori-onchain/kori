import { useMemo, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import { Slide } from "@hooks/useOnboardingData";

interface UseOnboardingLogicParams {
  slides: Slide[];
  onComplete: () => void;
}

export const useOnboardingLogic = ({
  slides,
  onComplete,
}: UseOnboardingLogicParams) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideOpacity = useRef(new Animated.Value(1)).current;
  const slideY = useRef(new Animated.Value(0)).current;

  const currentSlide = slides[activeIndex] || slides[0];
  const isLast = activeIndex >= slides.length - 1;

  const screenKey = useMemo(
    () => `${currentSlide?.kind || "brand"}-${activeIndex}`,
    [activeIndex, currentSlide],
  );

  const handleNext = () => {
    if (isLast) {
      onComplete();
      return;
    }

    Animated.parallel([
      Animated.timing(slideY, {
        toValue: -12,
        duration: 180,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveIndex((current) => {
        if (current >= slides.length - 1) return current;
        return current + 1;
      });
      slideY.setValue(20);
      slideOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(slideY, {
          toValue: 0,
          duration: 450,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(slideOpacity, {
          toValue: 1,
          duration: 380,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const animatedStyle = {
    opacity: slideOpacity,
    transform: [{ translateY: slideY }],
  };

  return {
    activeIndex,
    currentSlide,
    isLast,
    screenKey,
    handleNext,
    animatedStyle,
  };
};
