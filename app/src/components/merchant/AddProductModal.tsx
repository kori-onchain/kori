import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Feather } from "@/icons";
import { useTheme } from "@theme/ThemeProvider";
import { fonts } from "@theme/tokens";
import { Button } from "@components/layout/Button";

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (product: any) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const { t } = useTheme();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastOpacity] = useState(new Animated.Value(0));

  const showToast = (message: string) => {
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1800),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setToastMessage(null));
  };

  const handleSave = () => {
    if (!name.trim() || !price.trim()) {
      showToast("Por favor, informe o nome e o preço.");
      return;
    }

    if (onSave) {
      onSave({ name, price, stock });
    }

    showToast("Produto cadastrado com sucesso!");

    setTimeout(() => {
      setName("");
      setPrice("");
      setStock("");
      onClose();
    }, 800);
  };

  const handleBack = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleBack}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdropPressable}
          activeOpacity={1}
          onPress={onClose}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          <View
            style={[
              styles.modalCard,
              { backgroundColor: t.bg2, borderColor: t.cardBorder },
            ]}
          >
            <View style={[styles.handleBar, { backgroundColor: t.inkFaint }]} />

            <View style={[styles.header, { borderBottomColor: t.line }]}>
              <TouchableOpacity onPress={handleBack} style={styles.headerBtn}>
                <Feather name="x" size={20} color={t.ink} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: t.ink }]}>
                Cadastrar Produto
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.formContainer}>
              <Text style={[styles.subTitle, { color: t.inkMute }]}>
                Informações do Produto:
              </Text>

              <Text style={[styles.inputLabel, { color: t.ink }]}>
                Nome do Produto *
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: t.bgElev, borderColor: t.cardBorder },
                ]}
              >
                <Feather
                  name="box"
                  size={16}
                  color={t.inkMute}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  placeholder="ex: Camiseta Kori Premium"
                  placeholderTextColor={t.inkMute}
                  value={name}
                  onChangeText={setName}
                  style={[styles.input, { color: t.ink }]}
                />
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.inputLabel, { color: t.ink }]}>
                    Preço *
                  </Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      { backgroundColor: t.bgElev, borderColor: t.cardBorder },
                    ]}
                  >
                    <Text
                      style={{
                        color: t.inkMute,
                        marginRight: 8,
                        fontFamily: fonts.mono.regular,
                      }}
                    >
                      R$
                    </Text>
                    <TextInput
                      placeholder="0,00"
                      placeholderTextColor={t.inkMute}
                      value={price}
                      onChangeText={setPrice}
                      style={[styles.input, { color: t.ink }]}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={[styles.inputLabel, { color: t.ink }]}>
                    Estoque (Opcional)
                  </Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      { backgroundColor: t.bgElev, borderColor: t.cardBorder },
                    ]}
                  >
                    <TextInput
                      placeholder="0"
                      placeholderTextColor={t.inkMute}
                      value={stock}
                      onChangeText={setStock}
                      style={[styles.input, { color: t.ink }]}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              <Button
                label="Salvar Produto"
                variant="primary"
                onPress={handleSave}
                full
              />
            </View>
          </View>
        </KeyboardAvoidingView>

        {toastMessage && (
          <Animated.View style={[styles.toast, { opacity: toastOpacity, backgroundColor: t.bgElev, borderColor: t.cardBorder }]}>
            <Feather
              name="check-circle"
              size={16}
              color={t.green}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.toastText, { color: t.ink }]}>
              {toastMessage}
            </Text>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "flex-end",
  },
  backdropPressable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  keyboardContainer: {
    width: "100%",
    zIndex: 2,
  },
  modalCard: {
    width: "100%",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: fonts.sans.bold,
  },
  subTitle: {
    fontSize: 13,
    fontFamily: fonts.sans.medium,
    marginBottom: 16,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  row: {
    flexDirection: "row",
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: fonts.sans.bold,
    marginBottom: 8,
    marginTop: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.sans.medium,
    padding: 0,
  },
  saveBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveBtnText: {
    fontFamily: fonts.sans.bold,
    fontSize: 14,
  },
  toast: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    zIndex: 999,
  },
  toastText: {
    fontSize: 13,
    fontFamily: fonts.sans.semibold,
  },
});
