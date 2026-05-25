import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { Ionicons } from "../../../icons";
import { ArrowRightIcon, KoraGlyph } from "../../../components/ds/icons";
import { AuthButton } from "../components/AuthButton";
import { AuthField } from "../components/AuthField";
import { AuthTopBar } from "../components/AuthTopBar";

type LoginStepProps = {
  onBack: () => void;
  onLogin: (email: string, password: string) => void;
  loading: boolean;
  error: string | null;
};

export const LoginStep: React.FC<LoginStepProps> = ({
  onBack,
  onLogin,
  loading,
  error,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(
    null,
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerClassName="flex-grow px-[22px] pb-6 pt-11"
        showsVerticalScrollIndicator={false}
      >
        <AuthTopBar onBack={onBack} />

        <View className="mt-4 items-center">
          <KoraGlyph size={44} color="#fafafa" />
          <Text className="mt-4 font-sans-bold text-[23px] leading-[27px] tracking-[-0.6px] text-ink">
            Entrar na Kora.
          </Text>
          <Text className="mt-2 max-w-[260px] text-center font-sans text-[13px] leading-5 text-ink-dim">
            Acesse sua conta com e-mail e senha.
          </Text>
        </View>

        <View className="mt-8 gap-[13px]">
          <AuthField
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            focused={focusedField === "email"}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
          />
          <AuthField
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            focused={focusedField === "password"}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
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
            onPress={() => onLogin(email, password)}
            icon={<ArrowRightIcon size={17} color="#0a0a0a" />}
            iconPosition="right"
            loading={loading}
            disabled={!email || !password}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
