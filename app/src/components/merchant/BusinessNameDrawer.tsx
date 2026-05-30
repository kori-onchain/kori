import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@/icons";
import { useTheme } from "@theme/ThemeProvider";
import { fonts } from "@theme/tokens";
import { PaymentCard, PaymentPrimaryButton } from "@components/home/modals/PaymentDS";

interface BusinessNameDrawerProps {
  visible: boolean;
  onSave: (businessName: string) => Promise<void>;
  onClose?: () => void;
}

export const BusinessNameDrawer: React.FC<BusinessNameDrawerProps> = ({
  visible,
  onSave,
  onClose,
}) => {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === "ios" ? 28 : 18);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!value.trim() || saving) return;
    setSaving(true);
    try {
      await onSave(value.trim());
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.keyboardContainer}
        >
          <View
            style={[
              styles.drawer,
              { backgroundColor: t.bg, borderColor: t.line, paddingBottom: bottomPadding },
            ]}
          >
            <View style={[styles.handleBar, { backgroundColor: t.inkFaint }]} />

            {onClose ? (
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.75}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={[styles.closeBtn, { backgroundColor: t.bgElev, borderColor: t.line }]}
              >
                <Feather name="x" size={18} color={t.inkDim} />
              </TouchableOpacity>
            ) : null}

            <View style={styles.body}>
              <View
                style={[styles.iconCircle, { backgroundColor: "rgba(255, 107, 61, 0.12)" }]}
              >
                <Feather name="briefcase" size={26} color={t.orange} />
              </View>

              <Text style={[styles.title, { color: t.ink }]}>
                Como sua empresa se chama?
              </Text>
              <Text style={[styles.description, { color: t.inkDim }]}>
                Esse será o nome exibido na sua loja e nos comprovantes que seus
                clientes recebem.
              </Text>

              <PaymentCard padding={0} style={styles.fieldCard}>
                <View style={styles.inputRow}>
                  <Feather name="briefcase" size={16} color={t.inkMute} />
                  <TextInput
                    value={value}
                    onChangeText={setValue}
                    placeholder="Studio Kauã"
                    placeholderTextColor={t.inkMute}
                    style={[styles.input, { color: t.ink }]}
                    autoCapitalize="words"
                    autoCorrect={false}
                    editable={!saving}
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={handleSave}
                  />
                </View>
              </PaymentCard>

              <PaymentPrimaryButton
                label={saving ? "Salvando..." : "Continuar"}
                onPress={handleSave}
                disabled={saving || !value.trim()}
                full
                icon={
                  saving ? undefined : (
                    <Feather name="arrow-right" size={16} color={t.btnPrimaryFg} />
                  )
                }
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
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
    overflow: "hidden",
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  body: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.sans.bold,
    fontSize: 20,
    letterSpacing: -0.4,
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  fieldCard: {
    width: "100%",
    marginBottom: 16,
  },
  inputRow: {
    minHeight: 52,
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
