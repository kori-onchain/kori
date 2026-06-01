import React from "react";
import { Pressable, Text, View } from "react-native";
import { KoriGlyph, SolanaIcon } from "@components/layout/icons";
import { AuthTopBar } from "@components/auth/AuthTopBar";
import { PinKeypad } from "@components/auth/PinKeypad";
import { AuthUserData } from "@type/auth";

type PinLoginStepProps = {
  user: AuthUserData;
  pin: string[];
  onDigit: (digit: string) => void;
  onDelete: () => void;
  onBack: () => void;
  onSwitchAccount: () => void;
  onBiometricsPress?: () => void;
};

export const PinLoginStep: React.FC<PinLoginStepProps> = ({
  user,
  pin,
  onDigit,
  onDelete,
  onBack,
  onSwitchAccount,
  onBiometricsPress,
}) => (
  <View className="flex-1 px-[22px] pb-6 pt-11">
    <AuthTopBar onBack={onBack} />
    <View className="items-center">
      <View className="relative mb-3.5 h-16 w-16 items-center justify-center rounded-full border border-line2 bg-bg-elev">
        <KoriGlyph size={30} color="#fafafa" />
        <View className="absolute -bottom-px -right-px h-5 w-5 items-center justify-center rounded-full border border-line2 bg-bg">
          <SolanaIcon width={11} color="#9a9a9e" />
        </View>
      </View>
      <Text className="font-mono text-[10px] text-ink-mute">
        @{user.username}
      </Text>
      <Text className="mt-1 font-sans-semibold text-[18px] tracking-[-0.2px] text-ink">
        Olá de novo, {user.name}.
      </Text>
    </View>

    <View className="mb-7 mt-[30px] flex-row justify-center gap-[13px]">
      {[0, 1, 2, 3, 4].map((index) => (
        <View
          key={index}
          className={[
            "h-[13px] w-[13px] rounded-full border-[1.5px]",
            pin.length > index ? "border-ink bg-ink" : "border-ink-mute",
          ].join(" ")}
        />
      ))}
    </View>

    <PinKeypad onDigit={onDigit} onDelete={onDelete} onBiometricsPress={onBiometricsPress} />

    <Pressable onPress={onSwitchAccount} className="mt-auto items-center pt-5">
      <Text className="font-mono text-[10px] text-ink-mute">
        não é você? <Text className="text-ink-dim">trocar de conta</Text>
      </Text>
    </Pressable>
  </View>
);
