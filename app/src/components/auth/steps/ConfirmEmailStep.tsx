import React from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@/icons";
import { AuthButton } from "@components/auth/AuthButton";
import { AuthTopBar } from "@components/auth/AuthTopBar";

type ConfirmEmailStepProps = {
  email: string;
  error: string | null;
  loading: boolean;
  onBack: () => void;
  onResend: () => void;
  onLogin: () => void;
};

export const ConfirmEmailStep: React.FC<ConfirmEmailStepProps> = ({
  email,
  error,
  loading,
  onBack,
  onResend,
  onLogin,
}) => (
  <View className="flex-1 px-[22px] pb-6 pt-11">
    <AuthTopBar onBack={onBack} />

    <View className="flex-1 items-center justify-center">
      <View className="mb-6 h-20 w-20 items-center justify-center rounded-[24px] border border-line bg-bg-2">
        <Feather name="mail" size={34} color="#ff6b3d" />
      </View>
      <Text className="text-center font-sans-bold text-[23px] leading-[27px] tracking-[-0.6px] text-ink">
        Confirme seu e-mail.
      </Text>
      <Text className="mt-3 max-w-[290px] text-center font-sans text-[13px] leading-5 text-ink-dim">
        Enviamos um link para {email}. Depois de confirmar, volte e entre com
        e-mail e senha.
      </Text>

      {error ? (
        <View className="mt-5 flex-row items-center gap-2 rounded-[12px] border border-orange-dark bg-bg-2 p-3">
          <Feather name="alert-circle" size={18} color="#d94d20" />
          <Text className="flex-1 font-sans-medium text-[12px] leading-4 text-orange-dark">
            {error}
          </Text>
        </View>
      ) : null}
    </View>

    <View className="gap-2.5">
      <AuthButton
        label="Reenviar e-mail"
        variant="soft"
        loading={loading}
        onPress={onResend}
        icon={<Feather name="refresh-cw" size={17} color="#fafafa" />}
      />
      <AuthButton
        label="Entrar"
        onPress={onLogin}
        icon={<Feather name="log-in" size={17} color="#0a0a0a" />}
        iconPosition="right"
      />
      <Pressable onPress={onBack} className="items-center py-2">
        <Text className="font-mono text-[10px] text-ink-mute">
          usar outro e-mail
        </Text>
      </Pressable>
    </View>
  </View>
);
