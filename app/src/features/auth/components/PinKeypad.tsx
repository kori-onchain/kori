import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "../../../icons";

type PinKeypadProps = {
  onDigit: (digit: string) => void;
  onDelete: () => void;
};

export const PinKeypad: React.FC<PinKeypadProps> = ({ onDigit, onDelete }) => (
  <View className="w-[248px] flex-row flex-wrap gap-2.5 self-center">
    {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
      <Pressable
        key={num}
        onPress={() => onDigit(num)}
        className="h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-full border border-line bg-bg-2"
        style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }] }]}
      >
        <Text className="font-sans-medium text-[22px] text-ink">{num}</Text>
      </Pressable>
    ))}
    <Pressable className="h-[76px] w-[76px] items-center justify-center rounded-full">
      <Ionicons name="scan-outline" size={24} color="#fafafa" />
    </Pressable>
    <Pressable
      onPress={() => onDigit("0")}
      className="h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-full border border-line bg-bg-2"
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }] }]}
    >
      <Text className="font-sans-medium text-[22px] text-ink">0</Text>
    </Pressable>
    <Pressable onPress={onDelete} className="h-[76px] w-[76px] items-center justify-center rounded-full">
      <Text className="font-mono-medium text-[10px] text-orange">apagar</Text>
    </Pressable>
  </View>
);
