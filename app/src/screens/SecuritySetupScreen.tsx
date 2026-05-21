import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Animated,
  Platform,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../constants/colors";

type SecurityMethod = "digital" | "facial" | "pin";

interface SecuritySetupProps {
  userName: string;
  onComplete: (method: SecurityMethod | "none", pinCode?: string) => void;
}

export const SecuritySetupScreen: React.FC<SecuritySetupProps> = ({ userName, onComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState<SecurityMethod>("digital");
  const [setupStep, setSetupStep] = useState<"select" | "simulating" | "pin_input">("select");
  const [loading, setLoading] = useState(false);
  
  // PIN state
  const [pin, setPin] = useState<string[]>([]);
  const [pinConfirm, setPinConfirm] = useState<string[]>([]);
  const [pinStep, setPinStep] = useState<"enter" | "confirm">("enter");
  const [pinError, setPinError] = useState<string | null>(null);

  // Simulated scan state
  const [scanProgress, setScanProgress] = useState(0);

  const handleSelectMethod = (method: SecurityMethod) => {
    setSelectedMethod(method);
    setPinError(null);
  };

  const handleNext = () => {
    if (selectedMethod === "pin") {
      setSetupStep("pin_input");
      setPinStep("enter");
      setPin([]);
    } else {
      // Simulate Biometric Scanning
      setSetupStep("simulating");
      setScanProgress(0);
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.2;
        setScanProgress(progress);
        if (progress >= 1) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete(selectedMethod);
          }, 600);
        }
      }, 300);
    }
  };

  // Custom Numerical Keypad logic for PIN setup
  const handleKeyPress = (num: string) => {
    setPinError(null);
    const activePin = pin;

    if (activePin.length < 5) {
      const newPin = [...activePin, num];
      setPin(newPin);

      // If we typed 5 digits
      if (newPin.length === 5) {
        if (pinStep === "enter") {
          // Go to confirm step
          setTimeout(() => {
            setPinStep("confirm");
            setPinConfirm(newPin); // store first pin
            setPin([]); // reset input for confirm
          }, 300);
        } else {
          // Verify confirmation
          const matching = pinConfirm.every((val, index) => val === newPin[index]);
          if (matching) {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              onComplete("pin", newPin.join(""));
            }, 1000);
          } else {
            // Error, reset confirmation
            setTimeout(() => {
              setPinError("Os PINs inseridos não coincidem. Tente novamente.");
              setPinStep("enter");
              setPin([]);
              setPinConfirm([]);
            }, 300);
          }
        }
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} translucent={true} />
      
      {/* --- SELECT METHOD STEP --- */}
      {setupStep === "select" && (
        <View style={styles.stepContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.shieldIconContainer}>
              <Feather name="shield" size={32} color={COLORS.text} />
            </View>
            <Text style={styles.title}>Proteja sua Carteira</Text>
            <Text style={styles.subtitle}>
              Olá {userName.split(" ")[0]}, escolha uma das opções abaixo para ativar a proteção no seu app.
            </Text>
          </View>

          {/* Vertical Stack of Cards */}
          <View style={styles.optionsStack}>
            
            {/* 1. Fingerprint (Digital) */}
            <TouchableOpacity
              style={[
                styles.methodCard,
                selectedMethod === "digital" && styles.methodCardActive,
              ]}
              onPress={() => handleSelectMethod("digital")}
              activeOpacity={0.8}
            >
              <View style={[styles.cardIconBox, selectedMethod === "digital" && styles.cardIconBoxActive]}>
                <Ionicons name="finger-print-outline" size={24} color={selectedMethod === "digital" ? COLORS.background : COLORS.text} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Biometria Digital</Text>
                <Text style={styles.cardDesc}>Utilize sua impressão digital para acessar o app de forma ultra rápida.</Text>
              </View>
              <View style={[styles.radioOutline, selectedMethod === "digital" && styles.radioActive]}>
                {selectedMethod === "digital" && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>

            {/* 2. Facial Scan */}
            <TouchableOpacity
              style={[
                styles.methodCard,
                selectedMethod === "facial" && styles.methodCardActive,
              ]}
              onPress={() => handleSelectMethod("facial")}
              activeOpacity={0.8}
            >
              <View style={[styles.cardIconBox, selectedMethod === "facial" && styles.cardIconBoxActive]}>
                <Ionicons name="scan-outline" size={24} color={selectedMethod === "facial" ? COLORS.background : COLORS.text} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Reconhecimento Facial</Text>
                <Text style={styles.cardDesc}>Acesse sua conta em segundos apenas olhando para o seu dispositivo.</Text>
              </View>
              <View style={[styles.radioOutline, selectedMethod === "facial" && styles.radioActive]}>
                {selectedMethod === "facial" && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>

            {/* 3. PIN code */}
            <TouchableOpacity
              style={[
                styles.methodCard,
                selectedMethod === "pin" && styles.methodCardActive,
              ]}
              onPress={() => handleSelectMethod("pin")}
              activeOpacity={0.8}
            >
              <View style={[styles.cardIconBox, selectedMethod === "pin" && styles.cardIconBoxActive]}>
                <Ionicons name="grid-outline" size={24} color={selectedMethod === "pin" ? COLORS.background : COLORS.text} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>PIN de Segurança</Text>
                <Text style={styles.cardDesc}>Defina uma senha numérica exclusiva de 5 dígitos para autorizações.</Text>
              </View>
              <View style={[styles.radioOutline, selectedMethod === "pin" && styles.radioActive]}>
                {selectedMethod === "pin" && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>

          </View>

          {/* Navigation Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleNext} activeOpacity={0.9}>
              <Text style={styles.primaryButtonText}>Configurar Segurança</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* --- SIMULATING DEVICE HARDWARE SCANNING --- */}
      {setupStep === "simulating" && (
        <View style={styles.scanContainer}>
          <View style={styles.scanBox}>
            <Ionicons
              name={selectedMethod === "digital" ? "finger-print-outline" : "scan-outline"}
              size={80}
              color={COLORS.text}
            />
            {scanProgress < 1 ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 24 }} />
            ) : (
              <View style={styles.successScanBadge}>
                <Feather name="check" size={28} color={COLORS.background} />
              </View>
            )}
          </View>
          <Text style={styles.scanTitle}>
            {scanProgress < 1 
              ? `Ativando ${selectedMethod === "digital" ? "Touch ID" : "Face ID"}...`
              : `${selectedMethod === "digital" ? "Biometria" : "Reconhecimento Facial"} Ativado!`
            }
          </Text>
          <Text style={styles.scanDesc}>
            {scanProgress < 1 
              ? "Simulando a integração segura com os sensores biométricos do seu smartphone."
              : "Sua carteira Kora está protegida com criptografia nativa de ponta."
            }
          </Text>
        </View>
      )}

      {/* --- PIN CODE NUMPAD SETUP PANEL --- */}
      {setupStep === "pin_input" && (
        <View style={styles.pinSetupContainer}>
          {/* Header */}
          <View style={styles.pinHeader}>
            <TouchableOpacity style={styles.backBtn} onPress={() => setSetupStep("select")}>
              <Feather name="arrow-left" size={22} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.pinStepTitle}>
              {pinStep === "enter" ? "Defina seu PIN" : "Confirme seu PIN"}
            </Text>
            <Text style={styles.pinStepDesc}>
              {pinStep === "enter" 
                ? "Crie uma senha numérica de 5 dígitos para acessos e transações."
                : "Insira novamente a senha numérica para confirmação."
              }
            </Text>
          </View>

          {/* PIN Indicators slots */}
          <View style={styles.pinSlotsRow}>
            {[0, 1, 2, 3, 4].map((index) => {
              const hasDigit = pin.length > index;
              return (
                <View 
                  key={index} 
                  style={[
                    styles.pinSlot, 
                    hasDigit && styles.pinSlotFilled,
                    pinError && styles.pinSlotError
                  ]} 
                />
              );
            })}
          </View>

          {/* Dynamic Error State */}
          {pinError && <Text style={styles.pinErrorText}>{pinError}</Text>}

          {/* Numerical Numpad Panel */}
          <View style={styles.numpad}>
            <View style={styles.numpadRow}>
              {["1", "2", "3"].map((num) => (
                <TouchableOpacity key={num} style={styles.numpadKey} onPress={() => handleKeyPress(num)} disabled={loading}>
                  <Text style={styles.numpadKeyText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.numpadRow}>
              {["4", "5", "6"].map((num) => (
                <TouchableOpacity key={num} style={styles.numpadKey} onPress={() => handleKeyPress(num)} disabled={loading}>
                  <Text style={styles.numpadKeyText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.numpadRow}>
              {["7", "8", "9"].map((num) => (
                <TouchableOpacity key={num} style={styles.numpadKey} onPress={() => handleKeyPress(num)} disabled={loading}>
                  <Text style={styles.numpadKeyText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.numpadRow}>
              <View style={styles.numpadKeySpacer} />
              <TouchableOpacity style={styles.numpadKey} onPress={() => handleKeyPress("0")} disabled={loading}>
                <Text style={styles.numpadKeyText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.numpadKeyDelete} onPress={handleDelete} disabled={loading}>
                <Feather name="delete" size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  shieldIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
  },
  optionsStack: {
    gap: 16,
    marginVertical: 32,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  methodCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#1D1D1D",
  },
  cardIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  cardIconBoxActive: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.text,
  },
  cardContent: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "bold",
  },
  cardDesc: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 3,
    lineHeight: 14,
  },
  radioOutline: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  radioActive: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.text,
  },
  actionsContainer: {
    gap: 12,
  },
  primaryButton: {
    height: 52,
    backgroundColor: COLORS.text,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: "bold",
  },
  skipButton: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  skipButtonText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  scanContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  scanBox: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 32,
  },
  successScanBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.text,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  scanTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  scanDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 18,
  },
  pinSetupContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 20,
  },
  pinHeader: {
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  backBtn: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: 6,
  },
  pinStepTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 6,
  },
  pinStepDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 24,
    lineHeight: 18,
  },
  pinSlotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginVertical: 24,
  },
  pinSlot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: "transparent",
  },
  pinSlotFilled: {
    borderColor: COLORS.text,
    backgroundColor: COLORS.text,
  },
  pinSlotError: {
    borderColor: "#FF3B30",
  },
  pinErrorText: {
    color: "#FF3B30",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  numpad: {
    gap: 16,
    width: "100%",
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  numpadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  numpadKey: {
    flex: 1,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  numpadKeyText: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  numpadKeySpacer: {
    flex: 1,
  },
  numpadKeyDelete: {
    flex: 1,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
