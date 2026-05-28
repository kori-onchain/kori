import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@/icons";
import { useTheme } from "@theme/ThemeProvider";
import { fonts, radii } from "@theme/tokens";
import { Button } from "@components/layout/Button";

interface BusinessNameDrawerProps {
  visible: boolean;
  onSave: (businessName: string) => Promise<void>;
}

export const BusinessNameDrawer: React.FC<BusinessNameDrawerProps> = ({
  visible,
  onSave,
}) => {
  const { t } = useTheme();
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSave = async () => {
    if (!value.trim()) return;
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
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={styles.backdrop} />
        <View
          style={[
            styles.drawer,
            { backgroundColor: t.bg, borderColor: t.line },
          ]}
        >
          <View style={[styles.handleBar, { backgroundColor: t.inkFaint }]} />

          <View style={styles.body}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: "rgba(255, 107, 61, 0.12)" },
              ]}
            >
              <Feather name="briefcase" size={28} color={t.orange} />
            </View>

            <Text style={[styles.title, { color: t.ink }]}>
              Como sua empresa se chama?
            </Text>
            <Text style={[styles.description, { color: t.inkDim }]}>
              Esse será o nome exibido na sua loja e nos comprovantes que seus
              clientes recebem.
            </Text>

            <View
              style={[
                styles.field,
                {
                  backgroundColor: t.bg2,
                  borderColor: focused ? t.line2 : t.line,
                },
              ]}
            >
              <Feather name="briefcase" size={16} color={t.inkMute} />
              <TextInput
                value={value}
                onChangeText={setValue}
                placeholder="Studio Kauã"
                placeholderTextColor={t.inkMute}
                style={[styles.input, { color: t.ink }]}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!saving}
              />
            </View>

            {saving ? (
              <View style={styles.savingWrap}>
                <ActivityIndicator size="small" color={t.orange} />
                <Text style={[styles.savingText, { color: t.inkMute }]}>
                  Salvando...
                </Text>
              </View>
            ) : (
              <View style={styles.actions}>
                <Button
                  label="Continuar"
                  variant="primary"
                  onPress={handleSave}
                  full
                  icon={
                    <Feather name="arrow-right" size={16} color={t.btnPrimaryFg} />
                  }
                />
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  drawer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
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
  body: {
    paddingHorizontal: 24,
    alignItems: "center",
    paddingBottom: 8,
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
  field: {
    width: "100%",
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
    borderRadius: radii.card,
    borderWidth: 1,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontFamily: fonts.sans.medium,
    fontSize: 14,
  },
  actions: {
    width: "100%",
  },
  savingWrap: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  savingText: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
  },
});
