import React from "react";
import { View, Text } from "react-native";
import { SolanaIcon } from "@components/layout/icons";

interface PoweredBySolanaProps {
  label: string;
}

export const PoweredBySolana: React.FC<PoweredBySolanaProps> = ({ label }) => (
  <View className="mt-[18px] flex-row items-center justify-center gap-1.5">
    <Text className="font-mono text-[9px] uppercase tracking-[0.7px] text-ink-mute">
      {label}
    </Text>
    <SolanaIcon width={14} height={11} color="#9a9a9e" />
    <Text className="font-mono-semibold text-[9px] tracking-[0.4px] text-ink-dim">
      Solana
    </Text>
  </View>
);
