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
import { Feather, Ionicons } from "../icons";
import { useTheme } from "../theme/ThemeProvider";

type SecurityMethod = "digital" | "facial" | "pin";

interface SecuritySetupProps {
  userName: string;
  onComplete: (method: SecurityMethod | "none", pinCode?: string) => void;
}

export const SecuritySetupScreen: React.FC<SecuritySetupProps> = ({ userName, onComplete }) => {
  const { t } = useTheme();
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
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} translucent={true} />
      
      {/* --- SELECT METHOD STEP --- */}
      {setupStep === "select" && (
        <View style={styles.stepContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.shieldIconContainer, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
              <Feather name="shield" size={32} color={t.ink} />
            </View>
            <Text style={[styles.title, { color: t.ink }]}>Proteja sua Carteira</Text>
            <Text style={[styles.subtitle, { color: t.inkMute }]}>
              Olá {userName.split(" ")[0]}, escolha uma das opções abaixo para ativar a proteção no seu app.
            </Text>
          </View>

          {/* Vertical Stack of Cards */}
          <View style={styles.optionsStack}>
            
            {/* 1. Fingerprint (Digital) */}
            <TouchableOpacity
              style={[
                styles.methodCard,
                { backgroundColor: t.bg2, borderColor: t.cardBorder },
                selectedMethod === "digital" && { backgroundColor: t.bgElev, borderColor: t.orange },
              ]}
              onPress={() => handleSelectMethod("digital")}
              activeOpacity={0.8}
            >
              <View style={[styles.cardIconBox, { backgroundColor: t.bg, borderColor: t.line }, selectedMethod === "digital" && { backgroundColor: t.btnPrimaryBg, borderColor: t.btnPrimaryBg }]}>
                <Ionicons name="finger-print-outline" size={24} color={selectedMethod === "digital" ? t.btnPrimaryFg : t.ink} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: t.ink }]}>Biometria Digital</Text>
                <Text style={[styles.cardDesc, { color: t.inkMute }]}>Utilize sua impressão digital para acessar o app de forma ultra rápida.</Text>
              </View>
              <View style={[styles.radioOutline, { borderColor: selectedMethod === "digital" ? t.orange : t.line2 }]}>
                {selectedMethod === "digital" && <View style={[styles.radioDot, { backgroundColor: t.orange }]} />}
              </View>
            </TouchableOpacity>

            {/* 2. Facial Scan */}
            <TouchableOpacity
              style={[
                styles.methodCard,
                { backgroundColor: t.bg2, borderColor: t.cardBorder },
                selectedMethod === "facial" && { backgroundColor: t.bgElev, borderColor: t.orange },
              ]}
              onPress={() => handleSelectMethod("facial")}
              activeOpacity={0.8}
            >
              <View style={[styles.cardIconBox, { backgroundColor: t.bg, borderColor: t.line }, selectedMethod === "facial" && { backgroundColor: t.btnPrimaryBg, borderColor: t.btnPrimaryBg }]}>
                <Ionicons name="scan-outline" size={24} color={selectedMethod === "facial" ? t.btnPrimaryFg : t.ink} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: t.ink }]}>Reconhecimento Facial</Text>
                <Text style={[styles.cardDesc, { color: t.inkMute }]}>Acesse sua conta em segundos apenas olhando para o seu dispositivo.</Text>
              </View>
              <View style={[styles.radioOutline, { borderColor: selectedMethod === "facial" ? t.orange : t.line2 }]}>
                {selectedMethod === "facial" && <View style={[styles.radioDot, { backgroundColor: t.orange }]} />}
              </View>
            </TouchableOpacity>

            {/* 3. PIN code */}
            <TouchableOpacity
              style={[
                styles.methodCard,
                { backgroundColor: t.bg2, borderColor: t.cardBorder },
                selectedMethod === "pin" && { backgroundColor: t.bgElev, borderColor: t.orange },
              ]}
              onPress={() => handleSelectMethod("pin")}
              activeOpacity={0.8}
            >
              <View style={[styles.cardIconBox, { backgroundColor: t.bg, borderColor: t.line }, selectedMethod === "pin" && { backgroundColor: t.btnPrimaryBg, borderColor: t.btnPrimaryBg }]}>
                <Ionicons name="grid-outline" size={24} color={selectedMethod === "pin" ? t.btnPrimaryFg : t.ink} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: t.ink }]}>PIN de Segurança</Text>
                <Text style={[styles.cardDesc, { color: t.inkMute }]}>Defina uma senha numérica exclusiva de 5 dígitos para autorizações.</Text>
              </View>
              <View style={[styles.radioOutline, { borderColor: selectedMethod === "pin" ? t.orange : t.line2 }]}>
                {selectedMethod === "pin" && <View style={[styles.radioDot, { backgroundColor: t.orange }]} />}
              </View>
            </TouchableOpacity>

          </View>

          {/* Navigation Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: t.btnPrimaryBg }]} onPress={handleNext} activeOpacity={0.9}>
              <Text style={[styles.primaryButtonText, { color: t.btnPrimaryFg }]}>Configurar Segurança</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* --- SIMULATING DEVICE HARDWARE SCANNING --- */}
      {setupStep === "simulating" && (
        <View style={styles.scanContainer}>
          <View style={[styles.scanBox, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
            <Ionicons
              name={selectedMethod === "digital" ? "finger-print-outline" : "scan-outline"}
              size={80}
              color={t.ink}
            />
            {scanProgress < 1 ? (
              <ActivityIndicator size="large" color={t.orange} style={{ marginTop: 24 }} />
            ) : (
              <View style={[styles.successScanBadge, { backgroundColor: t.green, borderColor: t.bg }]}>
                <Feather name="check" size={28} color={t.bg} />
              </View>
            )}
          </View>
          <Text style={[styles.scanTitle, { color: t.ink }]}>
            {scanProgress < 1 
              ? `Ativando ${selectedMethod === "digital" ? "Touch ID" : "Face ID"}...`
              : `${selectedMethod === "digital" ? "Biometria" : "Reconhecimento Facial"} Ativado!`
            }
          </Text>
          <Text style={[styles.scanDesc, { color: t.inkMute }]}>
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
              <Feather name="arrow-left" size={22} color={t.ink} />
            </TouchableOpacity>
            <Text style={[styles.pinStepTitle, { color: t.ink }]}>
              {pinStep === "enter" ? "Defina seu PIN" : "Confirme seu PIN"}
            </Text>
            <Text style={[styles.pinStepDesc, { color: t.inkMute }]}>
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
                    { borderColor: t.line2 },
                    hasDigit && { backgroundColor: t.ink, borderColor: t.ink },
                    pinError && styles.pinSlotError
                  ]} 
                />
              );
            })}
          </View>

          {/* Dynamic Error State */}
          {pinError && <Text style={[styles.pinErrorText, { color: t.orangeDark }]}>{pinError}</Text>}

          {/* Numerical Numpad Panel */}
          <View style={styles.numpad}>
            <View style={styles.numpadRow}>
              {["1", "2", "3"].map((num) => (
                <TouchableOpacity key={num} style={[styles.numpadKey, { backgroundColor: t.bg2, borderColor: t.cardBorder }]} onPress={() => handleKeyPress(num)} disabled={loading}>
                  <Text style={[styles.numpadKeyText, { color: t.ink }]}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.numpadRow}>
              {["4", "5", "6"].map((num) => (
                <TouchableOpacity key={num} style={[styles.numpadKey, { backgroundColor: t.bg2, borderColor: t.cardBorder }]} onPress={() => handleKeyPress(num)} disabled={loading}>
                  <Text style={[styles.numpadKeyText, { color: t.ink }]}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.numpadRow}>
              {["7", "8", "9"].map((num) => (
                <TouchableOpacity key={num} style={[styles.numpadKey, { backgroundColor: t.bg2, borderColor: t.cardBorder }]} onPress={() => handleKeyPress(num)} disabled={loading}>
                  <Text style={[styles.numpadKeyText, { color: t.ink }]}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.numpadRow}>
              <View style={styles.numpadKeySpacer} />
              <TouchableOpacity style={[styles.numpadKey, { backgroundColor: t.bg2, borderColor: t.cardBorder }]} onPress={() => handleKeyPress("0")} disabled={loading}>
                <Text style={[styles.numpadKeyText, { color: t.ink }]}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.numpadKeyDelete} onPress={handleDelete} disabled={loading}>
                <Feather name="delete" size={20} color={t.ink} />
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
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
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
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  methodCardActive: {
  },
  cardIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardIconBoxActive: {
  },
  cardContent: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  cardDesc: {
    fontSize: 11,
    marginTop: 3,
    lineHeight: 14,
  },
  radioOutline: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  radioActive: {
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  actionsContainer: {
    gap: 12,
  },
  primaryButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  skipButton: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  skipButtonText: {
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
    borderWidth: 1,
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
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
  },
  scanTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  scanDesc: {
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
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 6,
  },
  pinStepDesc: {
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
    backgroundColor: "transparent",
  },
  pinSlotFilled: {
  },
  pinSlotError: {
    borderColor: "#FF3B30",
  },
  pinErrorText: {
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
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  numpadKeyText: {
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
