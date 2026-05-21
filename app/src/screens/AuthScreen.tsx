import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../constants/colors";

const { width } = Dimensions.get("window");

interface AuthScreenProps {
  onAuthSuccess: (
    userData: { name: string; email: string; accountType: "PF" | "PJ"; username: string },
    isSignup: boolean
  ) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  // Mode: 'login' | 'signup'
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  // Common Fields
  const [email, setEmail] = useState("");

  // Signup Specific Fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [accountType, setAccountType] = useState<"PF" | "PJ">("PF");

  // Form error state
  const [error, setError] = useState<string | null>(null);

  // Focus states for input styling
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleModeChange = (newMode: "login" | "signup") => {
    setMode(newMode);
    setError(null);
    setEmail("");
    setUsername("");
    setName("");
    setAccountType("PF");
  };

  const handleAuth = async () => {
    setError(null);

    // Validation
    if (!email) {
      setError("O e-mail é obrigatório.");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }

    if (mode === "signup") {
      if (!username) {
        setError("O username é obrigatório.");
        return;
      }
      const cleanUsername = username.replace("@", "").trim().toLowerCase();
      if (cleanUsername.length < 3) {
        setError("O username deve conter pelo menos 3 caracteres.");
        return;
      }
      if (!name) {
        setError(accountType === "PF" ? "O nome completo é obrigatório." : "A Razão Social é obrigatória.");
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
      let resolvedName = name;
      let resolvedUsername = username.replace("@", "").trim().toLowerCase();
      const resolvedAccountType = accountType;

      if (mode === "login") {
        // Smart fallback: extract name and username from email
        const emailPart = email.split("@")[0];
        resolvedUsername = emailPart.toLowerCase().replace(/[^a-zA-Z0-9._-]/g, "");
        resolvedName = emailPart.charAt(0).toUpperCase() + emailPart.slice(1);
      }

      onAuthSuccess({
        name: resolvedName || "Usuário Kora",
        email: email.trim().toLowerCase(),
        accountType: resolvedAccountType,
        username: resolvedUsername || "usuario",
      }, mode === "signup");
    }, 1200);
  };

  const handleUsernameChange = (text: string) => {
    const clean = text.replace(/[^a-zA-Z0-9._-]/g, "").toLowerCase();
    setUsername(clean);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} translucent={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Branding */}
          <View style={styles.brandContainer}>
            <View style={styles.logoSquare}>
              <Text style={styles.logoText}>K</Text>
            </View>
            <Text style={styles.brandName}>KORA</Text>
            <Text style={styles.brandSubtitle}>Sua carteira digital inteligente</Text>
          </View>

          {/* Form Container Card - Clean minimalist style matching COLORS.surface and COLORS.border */}
          <View style={styles.formCard}>
            {/* Tab Switched Header */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabButton, mode === "login" && styles.activeTabButton]}
                onPress={() => handleModeChange("login")}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, mode === "login" && styles.activeTabText]}>
                  Entrar
                </Text>
                {mode === "login" && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabButton, mode === "signup" && styles.activeTabButton]}
                onPress={() => handleModeChange("signup")}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, mode === "signup" && styles.activeTabText]}>
                  Cadastrar
                </Text>
                {mode === "signup" && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={18} color="#FF3B30" style={styles.errorIcon} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Inputs Block */}
            <View style={styles.inputsBlock}>
              
              {/* --- SIGNUP MODE FIELDS --- */}
              {mode === "signup" && (
                <>
                  {/* 1. Account Type Selector (Large Cards) - Ordered First! */}
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Tipo de Conta</Text>
                    <View style={styles.cardsRow}>
                      
                      {/* PF Card */}
                      <TouchableOpacity
                        style={[
                          styles.typeCardBlock,
                          accountType === "PF" && styles.typeCardBlockActive,
                        ]}
                        onPress={() => setAccountType("PF")}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="person-outline"
                          size={22}
                          color={accountType === "PF" ? COLORS.text : COLORS.textSecondary}
                        />
                        <Text style={[styles.cardTitle, accountType === "PF" && styles.cardTitleActive]}>
                          Pessoa Física
                        </Text>
                        <Text style={styles.cardSubtitle}>Para você movimentar</Text>
                        {accountType === "PF" && (
                          <View style={styles.checkBadge}>
                            <Feather name="check" size={10} color={COLORS.background} />
                          </View>
                        )}
                      </TouchableOpacity>

                      {/* PJ Card */}
                      <TouchableOpacity
                        style={[
                          styles.typeCardBlock,
                          accountType === "PJ" && styles.typeCardBlockActive,
                        ]}
                        onPress={() => setAccountType("PJ")}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="business-outline"
                          size={22}
                          color={accountType === "PJ" ? COLORS.text : COLORS.textSecondary}
                        />
                        <Text style={[styles.cardTitle, accountType === "PJ" && styles.cardTitleActive]}>
                          Pessoa Jurídica
                        </Text>
                        <Text style={styles.cardSubtitle}>Para sua empresa</Text>
                        {accountType === "PJ" && (
                          <View style={styles.checkBadge}>
                            <Feather name="check" size={10} color={COLORS.background} />
                          </View>
                        )}
                      </TouchableOpacity>

                    </View>
                  </View>

                  {/* 2. Username - Placed ABOVE Name/Razão Social and Email! */}
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <View
                      style={[
                        styles.inputContainer,
                        focusedField === "username" && styles.inputContainerFocused,
                      ]}
                    >
                      <Text
                        style={[
                          styles.usernamePrefix,
                          focusedField === "username" && styles.usernamePrefixActive,
                        ]}
                      >
                        @
                      </Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="opedrooz"
                        placeholderTextColor={COLORS.textSecondary}
                        value={username}
                        onChangeText={handleUsernameChange}
                        onFocus={() => setFocusedField("username")}
                        onBlur={() => setFocusedField(null)}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                  </View>

                  {/* 3. Full Name / Corporate Name */}
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>
                      {accountType === "PF" ? "Nome Completo" : "Razão Social"}
                    </Text>
                    <View
                      style={[
                        styles.inputContainer,
                        focusedField === "name" && styles.inputContainerFocused,
                      ]}
                    >
                      <Feather
                        name={accountType === "PF" ? "user" : "briefcase"}
                        size={18}
                        color={focusedField === "name" ? COLORS.text : COLORS.textSecondary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.textInput}
                        placeholder={accountType === "PF" ? "Ex: Pedro Henrique" : "Ex: Kora Ltda"}
                        placeholderTextColor={COLORS.textSecondary}
                        value={name}
                        onChangeText={setName}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        autoCapitalize={accountType === "PF" ? "words" : "characters"}
                      />
                    </View>
                  </View>
                </>
              )}

              {/* 4. E-mail (Common to both modes; at the bottom of Signup) */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>E-mail</Text>
                <View
                  style={[
                    styles.inputContainer,
                    focusedField === "email" && styles.inputContainerFocused,
                  ]}
                >
                  <Feather name="mail" size={18} color={focusedField === "email" ? COLORS.text : COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ex: seuemail@kora.com"
                    placeholderTextColor={COLORS.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

            </View>

            {/* Premium Minimal Solid Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAuth}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.background} />
              ) : (
                <Text style={styles.submitButtonText}>
                  {mode === "login" ? "Entrar na Carteira" : "Criar Minha Conta"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Switch Mode Helper Link */}
            <TouchableOpacity
              style={styles.switchModeLink}
              onPress={() => handleModeChange(mode === "login" ? "signup" : "login")}
              activeOpacity={0.7}
            >
              <Text style={styles.switchModeSubText}>
                {mode === "login" ? "Novo por aqui? " : "Já tem uma conta? "}
                <Text style={styles.switchModeHighlight}>
                  {mode === "login" ? "Crie uma conta" : "Faça Login"}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer security tag */}
          <View style={styles.footer}>
            <Feather name="shield" size={12} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
            <Text style={styles.footerText}>Conexão criptografada segura</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 40,
    justifyContent: "center",
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoSquare: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoText: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "bold",
  },
  brandName: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  brandSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },
  activeTabText: {
    color: COLORS.text,
    fontWeight: "700",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  errorContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 59, 48, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.15)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  inputsBlock: {
    gap: 16,
  },
  inputWrapper: {
    width: "100%",
  },
  inputLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111111",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    height: 52,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    backgroundColor: "#151515",
  },
  inputIcon: {
    marginRight: 12,
  },
  usernamePrefix: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 4,
  },
  usernamePrefixActive: {
    color: COLORS.text,
  },
  textInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    height: "100%",
  },
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2,
  },
  typeCardBlock: {
    flex: 1,
    backgroundColor: "#111111",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: "relative",
    minHeight: 110,
    justifyContent: "center",
  },
  typeCardBlockActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#151515",
  },
  cardTitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 8,
  },
  cardTitleActive: {
    color: COLORS.text,
  },
  cardSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 2,
    lineHeight: 12,
  },
  checkBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: COLORS.text,
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  submitButton: {
    height: 52,
    backgroundColor: COLORS.text,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  switchModeLink: {
    alignItems: "center",
    marginTop: 16,
  },
  switchModeSubText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  switchModeHighlight: {
    color: COLORS.text,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});
