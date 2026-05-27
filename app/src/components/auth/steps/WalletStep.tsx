import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@/icons";
import { KoriGlyph, SolanaIcon } from "@components/layout/icons";
import { WALLET_ADDRESS_PREVIEW } from "@constants/authConstants";

type WalletStepProps = {
  username: string;
  walletStep: number;
  loading: boolean;
};

export const WalletStep: React.FC<WalletStepProps> = ({
  username,
  walletStep,
  loading,
}) => {
  const checklist = [
    "E-mail verificado",
    "Carteira Solana criada",
    `Vinculando @${username || "usuario"} à carteira`,
    "Configurando biometria + PIN",
  ];

  return (
    <View className="flex-1 px-[22px] pb-6 pt-11">
      <View className="min-h-[38px] justify-center">
        <Text className="ml-auto font-mono-semibold text-[9px] tracking-[1px] text-ink-mute">
          3 / 3
        </Text>
      </View>

      <View className="flex-1 items-center justify-center pt-3">
        <View className="mb-[26px] h-24 w-24 items-center justify-center overflow-hidden rounded-[26px]">
          <LinearGradient
            pointerEvents="none"
            colors={["#d94d20", "#ff6b3d", "#9945ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <KoriGlyph size={48} color="#fafafa" />
        </View>
        <Text className="text-center font-sans-bold text-[23px] leading-[27px] tracking-[-0.6px] text-ink">
          Preparando sua{"\n"}conta on-chain.
        </Text>
        <Text className="mt-2.5 max-w-[270px] text-center font-sans text-[13px] leading-5 text-ink-dim">
          Sua carteira Solana criada com segurança. Nada pra anotar, guardamos
          com criptografia.
        </Text>
      </View>

      <View className="mb-5 gap-[9px]">
        {checklist.map((item, index) => {
          const done = walletStep > index;
          const isLoading = walletStep === index && loading;
          return (
            <View
              key={item}
              className="flex-row items-center gap-[11px] rounded-[12px] border border-line bg-bg-2 p-3"
            >
              <View
                className={[
                  "h-5 w-5 items-center justify-center rounded-full border",
                  done
                    ? "border-green bg-green"
                    : isLoading
                      ? "border-orange bg-transparent"
                      : "border-line bg-bg-elev",
                ].join(" ")}
              >
                {done ? (
                  <Feather name="check" size={12} color="#0a0a0a" />
                ) : null}
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ff6b3d" />
                ) : null}
              </View>
              <Text
                className={`flex-1 font-sans-medium text-[12px] ${done || isLoading ? "text-ink" : "text-ink-mute"}`}
              >
                {item}
              </Text>
            </View>
          );
        })}
      </View>

      <View className="flex-row items-center justify-center gap-1.5">
        <SolanaIcon width={13} color="#9a9a9e" />
        <Text className="font-mono text-[9px] text-ink-mute">
          carteira ·{" "}
          <Text className="text-ink-dim">{WALLET_ADDRESS_PREVIEW}</Text>
        </Text>
      </View>
    </View>
  );
};
