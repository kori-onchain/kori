import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useLoginWithOAuth, useLoginWithEmail, usePrivy } from "@privy-io/expo";
import { Feather } from "@/icons";

export default function PrivyUI() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login: loginWithOAuth } = useLoginWithOAuth();
  const { sendCode, loginWithCode, state: otpState } = useLoginWithEmail();
  const { user, logout } = usePrivy();

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    try {
      setLoading(true);
      setError("");
      if (user) {
        await logout();
      }
      const loggedUser = await loginWithOAuth({
        provider,
        ...(provider === "apple" ? { isLegacyAppleIosBehaviorEnabled: Platform.OS !== "ios" } : {}),
      });
      console.log(`OAuth login success (${provider}):`, loggedUser);
    } catch (err: any) {
      setError(err?.message || `Erro ao fazer login com ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    const formattedEmail = email.trim().toLowerCase();
    if (!formattedEmail || !formattedEmail.includes("@")) {
      setError("Por favor, digite um e-mail válido.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      if (user) {
        await logout();
      }
      await sendCode({ email: formattedEmail });
      setCodeSent(true);
    } catch (err: any) {
      setError(err?.message || "Erro ao enviar código de verificação.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const formattedEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();
    if (!cleanCode || cleanCode.length < 4) {
      setError("Por favor, digite o código completo.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const user = await loginWithCode({ code: cleanCode });
      console.log("OTP login success:", user);
    } catch (err: any) {
      setError(err?.message || "Código inválido ou expirado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#0a0a0a]"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="flex-1 px-6 py-12 justify-center"
      >
        <View className="items-center mb-10">
          <View className="w-16 h-16 bg-[#1a1a1a] rounded-full items-center justify-center mb-4 border border-[#2a2a2a]">
            <Feather name="shield" size={32} color="#fafafa" />
          </View>
          <Text className="text-center font-sans-bold text-[28px] tracking-[-0.8px] text-[#fafafa]">
            Acesse sua Conta
          </Text>
          <Text className="mt-2 text-center font-sans text-[13px] leading-5 text-[#8a8a8a] max-w-[280px]">
            Conecte-se com sua identidade digital on-chain e acesse seu perfil de forma segura.
          </Text>
        </View>

        <View className="space-y-4 gap-4">
          {error ? (
            <View className="bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl mb-2 flex-row items-center gap-2.5">
              <Feather name="alert-circle" size={16} color="#ef4444" />
              <Text className="text-red-500 font-sans text-xs flex-1">{error}</Text>
            </View>
          ) : null}

          {!codeSent ? (
            // Email Input Step
            <View className="gap-3.5">
              <View className="bg-[#121212] border border-[#262626] rounded-xl flex-row items-center px-4 py-3.5">
                <Feather name="mail" size={18} color="#525252" className="mr-3" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Seu endereço de e-mail"
                  placeholderTextColor="#525252"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="flex-1 text-[#fafafa] font-sans text-[14px]"
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                onPress={handleSendOtp}
                disabled={loading}
                className="bg-[#fafafa] py-3.5 rounded-xl items-center justify-center active:bg-[#e4e4e7] disabled:opacity-50"
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#0a0a0a" />
                ) : (
                  <Text className="text-[#0a0a0a] font-sans-bold text-[14px]">
                    Enviar Código de Login
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            // OTP Code Input Step
            <View className="gap-3.5">
              <View className="bg-[#121212] border border-[#262626] rounded-xl flex-row items-center px-4 py-3.5">
                <Feather name="key" size={18} color="#525252" className="mr-3" />
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder="Digite o código OTP"
                  placeholderTextColor="#525252"
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={6}
                  className="flex-1 text-[#fafafa] font-sans text-[14px]"
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                onPress={handleVerifyOtp}
                disabled={loading}
                className="bg-[#fafafa] py-3.5 rounded-xl items-center justify-center active:bg-[#e4e4e7] disabled:opacity-50"
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#0a0a0a" />
                ) : (
                  <Text className="text-[#0a0a0a] font-sans-bold text-[14px]">
                    Verificar e Acessar
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setCode("");
                  setCodeSent(false);
                  setError("");
                }}
                disabled={loading}
                className="py-2 items-center"
              >
                <Text className="text-[#8a8a8a] font-sans text-xs underline">
                  Alterar endereço de e-mail
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="flex-row items-center my-4">
            <View className="flex-1 h-[1px] bg-[#262626]" />
            <Text className="mx-4 text-[#525252] font-sans text-xs">ou continue com</Text>
            <View className="flex-1 h-[1px] bg-[#262626]" />
          </View>

          <View className="gap-3">
            {/* Custom Google Button */}
            <TouchableOpacity
              onPress={() => handleOAuthLogin("google")}
              disabled={loading}
              className="bg-[#121212] border border-[#262626] py-3.5 rounded-xl flex-row items-center justify-center gap-2.5 active:bg-[#1a1a1a] disabled:opacity-50"
            >
              <Feather name="chrome" size={17} color="#fafafa" />
              <Text className="text-[#fafafa] font-sans text-[14px]">
                Entrar com o Google
              </Text>
            </TouchableOpacity>

            {/* Custom Apple Button */}
            {Platform.OS === "ios" ? (
              <TouchableOpacity
                onPress={() => handleOAuthLogin("apple")}
                disabled={loading}
                className="bg-[#121212] border border-[#262626] py-3.5 rounded-xl flex-row items-center justify-center gap-2.5 active:bg-[#1a1a1a] disabled:opacity-50"
              >
                <Feather name="command" size={17} color="#fafafa" />
                <Text className="text-[#fafafa] font-sans text-[14px]">
                  Entrar com a Apple
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <Text className="mt-8 text-center font-sans text-[10px] text-[#525252]">
          Kora utiliza infraestrutura Privy altamente segura.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
