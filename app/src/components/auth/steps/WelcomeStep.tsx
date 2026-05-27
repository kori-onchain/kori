import React from "react";
import { Pressable, Text, View } from "react-native";
import { Feather, Ionicons } from "@/icons";
import { KoriGlyph } from "@components/layout/icons";
import { AuthButton } from "@components/auth/AuthButton";

type WelcomeStepProps = {
  onSignupWithApple: () => void;
  onSignupWithGoogle: () => void;
  onSignupWithEmail: () => void;
  onPinLogin: () => void;
};

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  onSignupWithApple,
  onSignupWithGoogle,
  onSignupWithEmail,
  onPinLogin,
}) => (
  <View className="flex-1 px-[22px] pb-6 pt-11">
    <View className="flex-1 items-center justify-center pb-3">
      <KoriGlyph size={68} color="#fafafa" />
      <Text className="mt-5 text-center font-sans-bold text-[28px] leading-8 tracking-[-0.8px] text-ink">
        Bem-vindo{"\n"}à Kori.
      </Text>
      <Text className="mt-2.5 max-w-[270px] text-center font-sans text-[13px] leading-5 text-ink-dim">
        Sua conta on-chain em 30 segundos. Sem agência, sem burocracia.
      </Text>
    </View>

    <View className="gap-2.5">
      <AuthButton
        label="Continuar com Apple"
        onPress={onSignupWithApple}
        icon={<Ionicons name="logo-apple" size={18} color="#0a0a0a" />}
      />
      <AuthButton
        label="Continuar com Google"
        variant="soft"
        onPress={onSignupWithGoogle}
        icon={<Ionicons name="logo-google" size={18} color="#fafafa" />}
      />
      <AuthButton
        label="Continuar com e-mail"
        variant="soft"
        onPress={onSignupWithEmail}
        icon={<Feather name="mail" size={17} color="#fafafa" />}
      />
      <Pressable onPress={onPinLogin} className="items-center py-2">
        <Text className="font-mono text-[10px] text-ink-mute">
          já tem conta? <Text className="text-ink">entrar com PIN</Text>
        </Text>
      </Pressable>
    </View>

    <Text className="mt-3.5 text-center font-mono text-[9px] leading-[15px] text-ink-mute">
      ao continuar você aceita os <Text className="text-ink-dim">Termos</Text> e
      a <Text className="text-ink-dim">Privacidade</Text>.
    </Text>
  </View>
);
