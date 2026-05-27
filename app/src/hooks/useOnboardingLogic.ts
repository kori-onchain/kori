import { useMemo, useRef, useState } from "react";
import { Animated } from "react-native";
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
  const slideX = useRef(new Animated.Value(0)).current;

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
      setActiveIndex((current) => {
        if (current >= slides.length - 1) return current;
        return current + 1;
      });
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

  return {
    activeIndex,
    currentSlide,
    isLast,
    screenKey,
    handleNext,
    animatedStyle,
  };
};
