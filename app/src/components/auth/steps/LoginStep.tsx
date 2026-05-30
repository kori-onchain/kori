import React from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@/icons";
import { ArrowRightIcon } from "@components/layout/icons";
import { AuthButton } from "@components/auth/AuthButton";
import { AuthField } from "@components/auth/AuthField";
import { AuthTopBar } from "@components/auth/AuthTopBar";
import { AuthForm } from "@type/auth";

type LoginStepProps = {
  form: AuthForm;
  focusedField: keyof AuthForm | null;
  error: string | null;
  loading: boolean;
  onBack: () => void;
  onFocusField: (field: keyof AuthForm | null) => void;
  onChangeField: (field: keyof AuthForm, value: string) => void;
  onLogin: () => void;
  onCreateAccount: () => void;
};

export const LoginStep: React.FC<LoginStepProps> = ({
  form,
  focusedField,
  error,
  loading,
  onBack,
  onFocusField,
  onChangeField,
  onLogin,
  onCreateAccount,
}) => (
  <KeyboardAvoidingView behavior="padding" className="flex-1">
    <ScrollView
      contentContainerClassName="flex-grow px-[22px] pb-6 pt-11"
      showsVerticalScrollIndicator={false}
    >
      <AuthTopBar onBack={onBack} />
      <View className="mt-4">
        <Text className="font-sans-bold text-[23px] leading-[27px] tracking-[-0.6px] text-ink">
          Entrar na sua conta.
        </Text>
        <Text className="mt-2 font-sans text-[13px] leading-5 text-ink-dim">
          Use o e-mail e senha que você cadastrou.
        </Text>
      </View>

      <View className="mt-6 gap-[13px]">
        <AuthField
          label="E-mail"
          value={form.email}
          onChangeText={(value) => onChangeField("email", value)}
          placeholder="seu@email.com"
          keyboardType="email-address"
          focused={focusedField === "email"}
          onFocus={() => onFocusField("email")}
          onBlur={() => onFocusField(null)}
        />
        <AuthField
          label="Senha"
          value={form.password}
          onChangeText={(value) => onChangeField("password", value)}
          placeholder="••••••••"
          secureTextEntry
          focused={focusedField === "password"}
          onFocus={() => onFocusField("password")}
          onBlur={() => onFocusField(null)}
        />
      </View>

      {error ? (
        <View className="mt-4 flex-row items-center gap-2 rounded-[12px] border border-orange-dark bg-bg-2 p-3">
          <Ionicons name="alert-circle-outline" size={18} color="#d94d20" />
          <Text className="flex-1 font-sans-medium text-[12px] leading-4 text-orange-dark">
            {error}
          </Text>
        </View>
      ) : null}

      <View className="mt-auto pt-7">
        <AuthButton
          label="Entrar"
          onPress={onLogin}
          loading={loading}
          icon={<ArrowRightIcon size={17} color="#0a0a0a" />}
          iconPosition="right"
        />
        <Pressable onPress={onCreateAccount} className="mt-4 items-center py-2">
          <Text className="font-mono text-[10px] text-ink-mute">
            não tem conta?{" "}
            <Text className="text-ink">criar conta</Text>
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);
