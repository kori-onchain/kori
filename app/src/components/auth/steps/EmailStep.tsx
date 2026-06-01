import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ArrowRightIcon } from "@components/layout/icons";
import { AuthButton } from "@components/auth/AuthButton";
import { AuthField } from "@components/auth/AuthField";
import { AuthTopBar } from "@components/auth/AuthTopBar";
import { AuthForm } from "@type/auth";

type EmailStepProps = {
  form: AuthForm;
  focusedField: keyof AuthForm | null;
  error: string | null;
  loading: boolean;
  onBack: () => void;
  onFocusField: (field: keyof AuthForm | null) => void;
  onChangeField: (field: keyof AuthForm, value: string) => void;
  onSend: () => void;
  onCreateAccount: () => void;
};

export const EmailStep: React.FC<EmailStepProps> = ({
  form,
  focusedField,
  error,
  loading,
  onBack,
  onFocusField,
  onChangeField,
  onSend,
  onCreateAccount,
}) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    className="flex-1"
  >
    <ScrollView
      contentContainerClassName="flex-grow px-[22px] pb-6 pt-11"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <AuthTopBar onBack={onBack} />
      <View className="mt-4">
        <Text className="font-sans-bold text-[23px] leading-[27px] tracking-[-0.6px] text-ink">
          Entrar na sua conta.
        </Text>
        <Text className="mt-2 font-sans text-[13px] leading-5 text-ink-dim">
          Você vai receber um código no e-mail.
        </Text>
      </View>

      <View className="mt-6">
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
      </View>

      {error ? (
        <View className="mt-4 flex-row items-center gap-2 rounded-[12px] border border-orange-dark bg-bg-2 p-3">
          <Text className="flex-1 font-sans-medium text-[12px] leading-4 text-orange-dark">
            {error}
          </Text>
        </View>
      ) : null}

      <View className="mt-auto pt-7">
        <AuthButton
          label="Enviar código"
          onPress={onSend}
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
