import React from "react";
import { View } from "react-native";

interface DotsProps {
  total: number;
  active: number;
}

export const Dots: React.FC<DotsProps> = ({ total, active }) => (
  <View className="mb-5 flex-row justify-center gap-[7px]">
    {Array.from({ length: total }).map((_, index) => (
      <View
        key={index}
        className={`h-[7px] rounded-full ${
          active === index ? "w-[22px] bg-ink" : "w-[7px] bg-ink-faint"
        }`}
      />
    ))}
  </View>
);
