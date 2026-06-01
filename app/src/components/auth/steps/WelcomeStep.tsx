import React from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { Feather } from "@/icons";
import { KoriGlyph } from "@components/layout/icons";
import { AuthButton } from "@components/auth/AuthButton";

type WelcomeStepProps = {
  onSignupWithEmail: () => void;
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  loadingOAuth: boolean;
};

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  onSignupWithEmail,
  onGoogleLogin,
  onAppleLogin,
  loadingOAuth,
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
        label="Continuar com e-mail"
        onPress={onSignupWithEmail}
        icon={<Feather name="mail" size={17} color="#0a0a0a" />}
        disabled={loadingOAuth}
      />

      <AuthButton
        label="Continuar com Google"
        onPress={onGoogleLogin}
        variant="soft"
        loading={loadingOAuth}
        icon={
          <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: "#fafafa", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 11, fontWeight: "bold", color: "#0a0a0a", marginTop: -1 }}>G</Text>
          </View>
        }
      />

      {Platform.OS === "ios" && (
        <AuthButton
          label="Continuar com Apple"
          onPress={onAppleLogin}
          variant="soft"
          loading={loadingOAuth}
          icon={<Feather name="command" size={17} color="#fafafa" />}
        />
      )}
    </View>

    <Text className="mt-3.5 text-center font-mono text-[9px] leading-[15px] text-ink-mute">
      ao continuar você aceita os <Text className="text-ink-dim">Termos</Text> e
      a <Text className="text-ink-dim">Privacidade</Text>.
    </Text>
  </View>
);
