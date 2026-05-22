import React from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "../../../icons";

type AuthTopBarProps = {
  step?: string;
  onBack?: () => void;
};

export const AuthTopBar: React.FC<AuthTopBarProps> = ({ step, onBack }) => (
  <View className="mb-4 min-h-[38px] flex-row items-center">
    {onBack ? (
      <Pressable
        onPress={onBack}
        className="h-[34px] w-[34px] items-center justify-center overflow-hidden rounded-full border border-line bg-bg-2"
      >
        <Feather name="chevron-left" size={16} color="#fafafa" />
      </Pressable>
    ) : null}
    {step ? <Text className="ml-auto font-mono-semibold text-[9px] tracking-[1px] text-ink-mute">{step}</Text> : null}
  </View>
);
