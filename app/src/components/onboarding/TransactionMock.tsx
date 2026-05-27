import React from "react";
import { View, Text } from "react-native";
import { SoftCard } from "@components/layout/SoftCard";
import { radii } from "@theme/tokens";

interface TransactionMockProps {
  data: {
    avatarPlaceholder: string;
    username: string;
    verifiedText: string;
    amount: string;
    feeLabel: string;
    feeValue: string;
    settlementLabel: string;
    settlementValue: string;
    networkLabel: string;
    networkValue: string;
    statusText: string;
  };
}

export const TransactionMock: React.FC<TransactionMockProps> = ({ data }) => (
  <View className="w-full">
    <SoftCard radius={radii.card} padding={18} strong style={{ width: "100%" }}>
      <View className="flex-row items-center gap-[11px]">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-bg-elev">
          <Text className="font-sans-bold text-[15px] text-ink">
            {data.avatarPlaceholder}
          </Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="font-sans-semibold text-[13px] text-ink">
              {data.username}
            </Text>
            <View className="h-[13px] w-[13px] items-center justify-center rounded-full bg-green">
              <Text className="text-[8px] font-black text-bg">✓</Text>
            </View>
          </View>
          <Text className="mt-0.5 font-mono text-[8px] text-ink-mute">
            {data.verifiedText}
          </Text>
        </View>
      </View>

      <Text className="my-4 text-center font-sans-bold text-[30px] tracking-[-1px] text-ink">
        {data.amount}
      </Text>

      <View className="gap-[7px] border-t border-line pt-3.5">
        <View className="flex-row justify-between">
          <Text className="font-mono text-[9px] text-ink-mute">
            {data.feeLabel}
          </Text>
          <Text className="font-mono-medium text-[10px] text-green">
            {data.feeValue}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="font-mono text-[9px] text-ink-mute">
            {data.settlementLabel}
          </Text>
          <Text className="font-mono-medium text-[10px] text-ink">
            {data.settlementValue}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="font-mono text-[9px] text-ink-mute">
            {data.networkLabel}
          </Text>
          <Text className="font-mono-medium text-[10px] text-ink">
            {data.networkValue}
          </Text>
        </View>
      </View>

      <View className="mt-3.5 flex-row items-center justify-center gap-[7px]">
        <View className="h-1.5 w-1.5 rounded-full bg-green" />
        <Text className="font-mono-medium text-[10px] text-green">
          {data.statusText}
        </Text>
      </View>
    </SoftCard>
  </View>
);
