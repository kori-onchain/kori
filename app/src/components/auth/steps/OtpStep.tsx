import React, { useState, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  TextInput,
} from "react-native";
import { ArrowRightIcon } from "@components/layout/icons";
import { AuthButton } from "@components/auth/AuthButton";
import { AuthTopBar } from "@components/auth/AuthTopBar";

type OtpStepProps = {
  email: string;
  error: string | null;
  loading: boolean;
  onBack: () => void;
  onVerify: (code: string) => void;
  onResend: () => void;
};

export const OtpStep: React.FC<OtpStepProps> = ({
  email,
  error,
  loading,
  onBack,
  onVerify,
  onResend,
}) => {
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = () => {
    if (code.trim().length === 6) {
      onVerify(code.trim());
    }
  };

  const codeArray = code.split("");
  const boxes = Array(6).fill("");

  return (
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
            Digite o código.
          </Text>
          <Text className="mt-2 font-sans text-[13px] leading-5 text-ink-dim">
            Enviamos um código de verificação para:
          </Text>
          <Text className="font-sans-medium text-ink text-[13px] mt-1" numberOfLines={2}>
            {email}
          </Text>
        </View>

        {/* Custom 6-Digit OTP Grid */}
        <View className="mt-8">
          <Text className="mb-2 font-mono-medium text-[9px] uppercase tracking-[1.1px] text-ink-mute">
            Código de Verificação
          </Text>
          <Pressable
            onPress={() => inputRef.current?.focus()}
            className="flex-row justify-between w-full"
          >
            {boxes.map((_, index) => {
              const char = codeArray[index] || "";
              const isFocused = focused && code.length === index;

              return (
                <View
                  key={index}
                  className={[
                    "w-[46px] h-[52px] justify-center items-center rounded-[12px] border bg-bg-2",
                    isFocused ? "border-line2" : "border-line",
                  ].join(" ")}
                >
                  <Text className="font-sans-bold text-[18px] text-ink">
                    {char}
                  </Text>
                </View>
              );
            })}
          </Pressable>

          {/* Hidden input to receive keyboard events */}
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={(val) => {
              if (loading) return;
              const cleanVal = val.replace(/[^0-9]/g, "");
              setCode(cleanVal);
              if (cleanVal.length === 6) {
                onVerify(cleanVal);
              }
            }}
            keyboardType="number-pad"
            maxLength={6}
            className="absolute w-0 h-0 opacity-0"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoFocus
            editable={!loading}
          />
        </View>

        {error ? (
          <View className="mt-6 flex-row items-center gap-2 rounded-[12px] border border-orange-dark bg-bg-2 p-3">
            <Text className="flex-1 font-sans-medium text-[12px] leading-4 text-orange-dark">
              {error}
            </Text>
          </View>
        ) : null}

        <View className="mt-auto pt-7">
          <AuthButton
            label="Confirmar"
            onPress={handleSubmit}
            loading={loading}
            disabled={code.trim().length !== 6 || loading}
            icon={<ArrowRightIcon size={17} color="#0a0a0a" />}
            iconPosition="right"
          />
          <Pressable onPress={onResend} className="mt-4 items-center py-2">
            <Text className="font-mono text-[10px] text-ink-mute">
              não recebeu o e-mail? <Text className="text-ink">reenviar código</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
