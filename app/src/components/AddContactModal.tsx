import React, { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Feather } from "../icons";
import { useTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/tokens";
import {
  PaymentActionCard,
  PaymentCard,
  PaymentPrimaryButton,
  PaymentScreenFrame,
  PaymentToast,
  SectionTitle,
} from "./payment/PaymentDS";

interface AddContactModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, username: string) => void;
}

type Step = "options" | "add_id";

const Field: React.FC<{
  label: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}> = ({ label, icon, value, placeholder, onChangeText, autoCapitalize }) => {
  const { t } = useTheme();
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: t.inkMute }]}>{label}</Text>
      <PaymentCard padding={0}>
        <View style={styles.inputRow}>
          <Feather name={icon} size={16} color={t.inkMute} />
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={t.inkMute}
            style={[styles.input, { color: t.ink }]}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
          />
        </View>
      </PaymentCard>
    </View>
  );
};

export const AddContactModal: React.FC<AddContactModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const { t } = useTheme();
  const [step, setStep] = useState<Step>("options");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const showToast = (message: string) => {
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => setToastMessage(null));
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setStep("options"), 300);
  };

  const handleBack = () => {
    if (step === "add_id") {
      setStep("options");
      return;
    }
    handleClose();
  };

  const handleCopyLink = async () => {
    const inviteLink = `https://kora.app/invite/user_${Math.random().toString(36).slice(2, 9)}`;
    await Clipboard.setStringAsync(inviteLink);
    showToast("Link copiado");
    await Share.share({
      message: `Participe do Kora: ${inviteLink}`,
      url: inviteLink,
    });
  };

  const handleSave = () => {
    const cleanUsername = username.trim();
    if (!cleanUsername) {
      showToast("Informe o ID do contato");
      return;
    }

    const formattedUsername = cleanUsername.startsWith("@")
      ? cleanUsername
      : `@${cleanUsername}`;

    onSave(name.trim(), formattedUsername);
    showToast("Contato adicionado");

    setTimeout(() => {
      setName("");
      setUsername("");
      handleClose();
    }, 650);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleBack}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          <View
            style={[
              styles.drawer,
              { backgroundColor: t.bg, borderColor: t.line },
            ]}
          >
            <View style={[styles.handleBar, { backgroundColor: t.inkFaint }]} />
            <PaymentScreenFrame
              title={
                step === "add_id" ? "Adicionar por ID" : "Adicionar contato"
              }
              onBack={step === "add_id" ? handleBack : undefined}
              onClose={handleClose}
              footer={
                step === "add_id" ? (
                  <PaymentPrimaryButton
                    label="Adicionar contato"
                    onPress={handleSave}
                    icon={
                      <Feather
                        name="user-plus"
                        size={16}
                        color={t.btnPrimaryFg}
                      />
                    }
                  />
                ) : undefined
              }
            >
              <PaymentToast message={toastMessage} opacity={toastOpacity} />
              {step === "options" ? (
                <View style={styles.content}>
                  <Text style={[styles.subtitle, { color: t.inkMute }]}>
                    Escolha como deseja adicionar uma pessoa.
                  </Text>
                  <PaymentActionCard
                    title="Enviar convite"
                    description="Copia um link para compartilhar fora da Kora"
                    icon="share-2"
                    onPress={handleCopyLink}
                    style={styles.action}
                  />
                  <PaymentActionCard
                    title="Adicionar pelo ID"
                    description="Use o @usuario Kora para salvar o contato"
                    icon="user-plus"
                    onPress={() => setStep("add_id")}
                    style={styles.action}
                  />
                </View>
              ) : (
                <View style={styles.content}>
                  <SectionTitle>Dados do contato</SectionTitle>
                  <Field
                    label="ID KORA"
                    icon="at-sign"
                    value={username}
                    placeholder="ex: joao_silva"
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                  <Field
                    label="NOME"
                    icon="user"
                    value={name}
                    placeholder="ex: Joao Silva"
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              )}
            </PaymentScreenFrame>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  keyboardContainer: {
    width: "100%",
    zIndex: 2,
  },
  drawer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: "72%",
    overflow: "hidden",
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 6,
  },
  content: {
    paddingBottom: 18,
  },
  subtitle: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    marginBottom: 18,
  },
  action: {
    marginBottom: 10,
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontFamily: fonts.mono.semibold,
    fontSize: 9,
    letterSpacing: 1.1,
    marginBottom: 8,
  },
  inputRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    paddingVertical: 0,
  },
});
