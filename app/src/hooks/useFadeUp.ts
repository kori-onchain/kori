import { useEffect, useMemo, useState } from "react";
import { AccessibilityInfo } from "react-native";
import { Easing, FadeInDown } from "react-native-reanimated";

export const useFadeUp = () => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (mounted) setReduceMotion(v);
    });
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return useMemo(
    () =>
      (delay: number) =>
        reduceMotion
          ? undefined
          : FadeInDown.duration(550)
              .delay(delay)
              .easing(Easing.bezier(0.16, 1, 0.3, 1)),
    [reduceMotion],
  );
};
