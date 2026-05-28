import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@/icons";
import { ArrowRightIcon } from "@components/layout/icons";
import { AuthButton } from "@components/auth/AuthButton";
import { AuthField } from "@components/auth/AuthField";
import { AuthTopBar } from "@components/auth/AuthTopBar";
import { AccountType, AuthForm } from "@type/auth";

type DetailsStepProps = {
  accountType: AccountType;
  form: AuthForm;
  focusedField: keyof AuthForm | null;
  error: string | null;
  onBack: () => void;
  onFocusField: (field: keyof AuthForm | null) => void;
  onChangeField: (field: keyof AuthForm, value: string) => void;
  onContinue: () => void;
};

export const DetailsStep: React.FC<DetailsStepProps> = ({
  accountType,
  form,
  focusedField,
  error,
  onBack,
  onFocusField,
  onChangeField,
  onContinue,
}) => {
  const isPF = accountType === "PF";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerClassName="flex-grow px-[22px] pb-6 pt-11"
        showsVerticalScrollIndicator={false}
      >
        <AuthTopBar step="2 / 3" onBack={onBack} />
        <View className="mt-4">
          <Text className="font-sans-bold text-[23px] leading-[27px] tracking-[-0.6px] text-ink">
            {isPF ? "Sua conta pessoal." : "Sua loja na Kori."}
          </Text>
          <Text className="mt-2 font-sans text-[13px] leading-5 text-ink-dim">
            {isPF
              ? "Só o essencial para criar sua conta."
              : "Isso vira a vitrine que seus clientes veem."}
          </Text>
        </View>

        <View className="mt-6 gap-[13px]">
          {isPF ? (
            <>
              <AuthField
                label="Nome"
                value={form.name}
                onChangeText={(value) => onChangeField("name", value)}
                placeholder="Seu nome"
                focused={focusedField === "name"}
                onFocus={() => onFocusField("name")}
                onBlur={() => onFocusField(null)}
              />
              <AuthField
                label="E-mail"
                value={form.email}
                onChangeText={(value) => onChangeField("email", value)}
                placeholder="kaua@kori.app"
                keyboardType="email-address"
                focused={focusedField === "email"}
                onFocus={() => onFocusField("email")}
                onBlur={() => onFocusField(null)}
              />
              <AuthField
                label="Username"
                value={form.username}
                onChangeText={(value) => onChangeField("username", value)}
                placeholder="kc1t"
                prefix="@"
                focused={focusedField === "username"}
                onFocus={() => onFocusField("username")}
                onBlur={() => onFocusField(null)}
                showAvailable={form.username.length >= 3}
              />
              <AuthField
                label="Senha"
                value={form.password}
                onChangeText={(value) => onChangeField("password", value)}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                focused={focusedField === "password"}
                onFocus={() => onFocusField("password")}
                onBlur={() => onFocusField(null)}
              />
            </>
          ) : (
            <>
              <AuthField
                label="Nome da loja"
                value={form.storeName}
                onChangeText={(value) => onChangeField("storeName", value)}
                placeholder="Studio Kauã"
                focused={focusedField === "storeName"}
                onFocus={() => onFocusField("storeName")}
                onBlur={() => onFocusField(null)}
              />
              <AuthField
                label="Username da loja"
                value={form.storeUsername}
                onChangeText={(value) => onChangeField("storeUsername", value)}
                placeholder="kc1t.store"
                prefix="@"
                focused={focusedField === "storeUsername"}
                onFocus={() => onFocusField("storeUsername")}
                onBlur={() => onFocusField(null)}
                showAvailable={form.storeUsername.length >= 3}
              />
              <AuthField
                label="Categoria"
                value={form.category}
                onChangeText={(value) => onChangeField("category", value)}
                placeholder="Design & Digital"
                select
              />
              <AuthField
                label="E-mail"
                value={form.email}
                onChangeText={(value) => onChangeField("email", value)}
                placeholder="loja@kori.app"
                keyboardType="email-address"
                focused={focusedField === "email"}
                onFocus={() => onFocusField("email")}
                onBlur={() => onFocusField(null)}
              />
              <AuthField
                label="Senha"
                value={form.password}
                onChangeText={(value) => onChangeField("password", value)}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                focused={focusedField === "password"}
                onFocus={() => onFocusField("password")}
                onBlur={() => onFocusField(null)}
              />
            </>
          )}
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
            label="Continuar"
            onPress={onContinue}
            icon={<ArrowRightIcon size={17} color="#0a0a0a" />}
            iconPosition="right"
          />
          <Text className="mt-3.5 text-center font-mono text-[9px] leading-[15px] text-ink-mute">
            acesso só por biometria + PIN.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
