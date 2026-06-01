import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Pressable,
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
  usernameAvailability: "idle" | "checking" | "available" | "unavailable" | "error";
  usernamePlaceholder: string;
  canContinue: boolean;
  onBack: () => void;
  onFocusField: (field: keyof AuthForm | null) => void;
  onChangeField: (field: keyof AuthForm, value: string) => void;
  onContinue: () => void;
};

const CATEGORIES = [
  "Design & Digital",
  "Alimentação & Bebidas",
  "Vestuário & Acessórios",
  "Beleza & Cosméticos",
  "Tecnologia & Eletrônicos",
  "Outros",
];

export const DetailsStep: React.FC<DetailsStepProps> = ({
  accountType,
  form,
  focusedField,
  error,
  usernameAvailability,
  usernamePlaceholder,
  canContinue,
  onBack,
  onFocusField,
  onChangeField,
  onContinue,
}) => {
  const isPF = accountType === "PF";
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
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
                placeholder="Jhon Doe"
                focused={focusedField === "name"}
                onFocus={() => onFocusField("name")}
                onBlur={() => onFocusField(null)}
              />
              <AuthField
                label="Username"
                value={form.username}
                onChangeText={(value) => onChangeField("username", value)}
                placeholder={usernamePlaceholder}
                prefix="@"
                focused={focusedField === "username"}
                onFocus={() => onFocusField("username")}
                onBlur={() => onFocusField(null)}
                availabilityStatus={usernameAvailability}
              />
              <AuthField
                label="E-mail"
                value={form.email}
                placeholder="kaua@kori.app"
                keyboardType="email-address"
                editable={false}
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
                placeholder={usernamePlaceholder}
                prefix="@"
                focused={focusedField === "storeUsername"}
                onFocus={() => onFocusField("storeUsername")}
                onBlur={() => onFocusField(null)}
                availabilityStatus={usernameAvailability}
              />
              <AuthField
                label="Categoria"
                value={form.category}
                placeholder="Design & Digital"
                select
                onPress={() => setShowCategoryModal(true)}
              />
              <AuthField
                label="E-mail"
                value={form.email}
                placeholder="loja@kori.app"
                keyboardType="email-address"
                editable={false}
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
            disabled={!canContinue}
            icon={<ArrowRightIcon size={17} color="#0a0a0a" />}
            iconPosition="right"
          />
          <Text className="mt-3.5 text-center font-mono text-[9px] leading-[15px] text-ink-mute">
            acesso só por biometria + PIN.
          </Text>
        </View>
      </ScrollView>

      {/* Category Dropdown Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/60"
          onPress={() => setShowCategoryModal(false)}
        >
          <View className="bg-bg rounded-t-[24px] border-t border-line p-[24px] pb-[34px]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-sans-bold text-[18px] text-ink">
                Selecione a Categoria
              </Text>
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => setShowCategoryModal(false)}
              >
                <Ionicons name="close" size={24} color="#8e8e93" />
              </TouchableOpacity>
            </View>

            <View className="gap-[10px]">
              {CATEGORIES.map((category) => {
                const isSelected = form.category === category;
                return (
                  <TouchableOpacity
                    key={category}
                    activeOpacity={0.7}
                    onPress={() => {
                      onChangeField("category", category);
                      setShowCategoryModal(false);
                    }}
                    className={[
                      "min-h-[50px] flex-row items-center justify-between rounded-[12px] border px-4",
                      isSelected ? "border-line2 bg-bg-2" : "border-line bg-bg-2/30",
                    ].join(" ")}
                  >
                    <Text
                      className={[
                        "font-sans text-[14px]",
                        isSelected ? "font-sans-bold text-ink" : "text-ink-dim",
                      ].join(" ")}
                    >
                      {category}
                    </Text>
                    {isSelected ? (
                      <Ionicons name="checkmark" size={18} color="#fafafa" />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
};
