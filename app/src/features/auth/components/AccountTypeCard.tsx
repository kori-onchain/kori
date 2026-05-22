import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "../../../icons";
import { AccountType } from "../types";

type AccountTypeCardProps = {
  type: AccountType;
  selected: boolean;
  onPress: () => void;
};

export const AccountTypeCard: React.FC<AccountTypeCardProps> = ({ type, selected, onPress }) => {
  const isPJ = type === "PJ";

  return (
    <Pressable
      onPress={onPress}
      className={[
        "min-h-[78px] flex-row items-center overflow-hidden rounded-[15px] border bg-bg-2 p-3.5",
        selected ? "border-ink" : "border-line",
      ].join(" ")}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.99 : 1 }] }]}
    >
      <View className="h-[46px] w-[46px] items-center justify-center overflow-hidden rounded-[13px] border border-line bg-bg-elev">
        {isPJ ? (
          <LinearGradient
            pointerEvents="none"
            colors={["#d94d20", "#ff6b3d"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        <Feather name={isPJ ? "shopping-bag" : "user"} size={21} color="#fafafa" />
      </View>
      <View className="mx-3 flex-1">
        <Text className="font-sans-semibold text-[15px] text-ink">{isPJ ? "Loja" : "Pessoal"}</Text>
        <Text className="mt-0.5 font-sans text-[11px] leading-4 text-ink-dim">
          {isPJ ? "Vender produtos físicos ou digitais e receber." : "Transferências, dia a dia e privacidade."}
        </Text>
      </View>
      <View className={`h-5 w-5 items-center justify-center rounded-full border ${selected ? "border-ink" : "border-ink-mute"}`}>
        {selected ? <View className="h-2.5 w-2.5 rounded-full bg-ink" /> : null}
      </View>
    </Pressable>
  );
};
