import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Feather } from "@/icons";
import { useTheme } from "@theme/ThemeProvider";
import { fonts, radii } from "@theme/tokens";
import { Button } from "@components/layout/Button";

interface IdentityNoticeDrawerProps {
  visible: boolean;
  onClose: () => void;
  identityType: "userId" | "wallet";
  onConfirm: (dontShowAgain: boolean) => void;
}

export const IdentityNoticeDrawer: React.FC<IdentityNoticeDrawerProps> = ({
  visible,
  onClose,
  identityType,
  onConfirm,
}) => {
  const { t, scheme } = useTheme();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Reset checkbox state when the drawer opens
  useEffect(() => {
    if (visible) {
      setDontShowAgain(false);
    }
  }, [visible]);

  const isWallet = identityType === "wallet";

  const config = {
    icon: isWallet ? "shield" : "user",
    title: isWallet ? "Carteira Criptográfica" : "Identidade Pública",
    description: isWallet
      ? "Endereço criptográfico descentralizado. Garante anonimato total — nenhum dado de identidade é exposto na transação."
      : "Esta carteira está associada à sua identidade pública. Seu nome de usuário ficará visível a ambas as partes ao enviar ou receber valores.",
    badgeBg: isWallet ? "rgba(99, 102, 241, 0.12)" : "rgba(245, 158, 11, 0.12)",
    iconColor: isWallet ? "#6366F1" : "#F59E0B",
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[
            styles.drawer,
            {
              backgroundColor: t.bg,
              borderColor: t.line,
            },
          ]}
        >
          <View style={[styles.handleBar, { backgroundColor: t.inkFaint }]} />

          <View style={styles.body}>
            {/* Header Icon Circle */}
            <View
              style={[styles.iconCircle, { backgroundColor: config.badgeBg }]}
            >
              <Feather name={config.icon} size={32} color={config.iconColor} />
            </View>

            {/* Title & Description */}
            <Text style={[styles.title, { color: t.ink }]}>{config.title}</Text>
            <Text style={[styles.description, { color: t.inkDim }]}>
              {config.description}
            </Text>

            {/* "Don't show again" Checkbox Row */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setDontShowAgain(!dontShowAgain)}
              style={styles.checkboxRow}
            >
              <Feather
                name={dontShowAgain ? "check-square" : "square"}
                size={18}
                color={dontShowAgain ? t.orange : t.inkMute}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.checkboxLabel, { color: t.inkDim }]}>
                Não mostrar esta mensagem novamente
              </Text>
            </TouchableOpacity>

            {/* Confirm Button */}
            <Button
              label="Confirmar"
              variant="primary"
              onPress={() => onConfirm(dontShowAgain)}
              full
            />
          </View>
        </View>
      </View>
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
    zIndex: 1,
  },
  drawer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    zIndex: 2,
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
    paddingBottom: 16,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.sans.bold,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginBottom: 24,
  },
  checkboxLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
  },
  confirmBtn: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontFamily: fonts.sans.bold,
    fontSize: 15,
    fontWeight: "700",
  },
});
