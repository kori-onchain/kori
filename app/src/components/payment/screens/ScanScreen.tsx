import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Feather } from "../../../icons";
import { PaymentRecipient } from "../../../types/payment";
import { MOCK_CONTACTS } from "../../../data/contacts";
import { useTheme } from "../../../theme/ThemeProvider";
import {
  PaymentCard,
  PaymentPrimaryButton,
  PaymentScreenFrame,
} from "../PaymentDS";
import { fonts } from "../../../theme/tokens";

const APP_SCHEME = "kori://pay";

interface ScanScreenProps {
  onResult: (recipient: PaymentRecipient, amount?: string) => void;
  onClose: () => void;
}

const parseSolanaOrKoriQR = (
  raw: string,
): { recipient: PaymentRecipient; amount?: string } | null => {
  try {
    // kori://pay?to=@handle&amount=10.00  OR  kori://pay?wallet=ADDRESS&amount=...
    if (raw.startsWith("kori://pay")) {
      const url = new URL(raw);
      const to = url.searchParams.get("to");
      const wallet = url.searchParams.get("wallet");
      const amount = url.searchParams.get("amount") ?? undefined;

      if (wallet) {
        return {
          recipient: {
            type: "wallet",
            displayName: "Anônimo",
            walletAddress: wallet,
            isAnonymous: true,
            isFavorite: false,
          },
          amount,
        };
      }

      if (to) {
        const handle = to.replace("@", "");
        const contact = MOCK_CONTACTS.find(
          (c) => c.walletId === `@${handle}` || c.walletId === handle,
        );
        return {
          recipient: {
            type: "id",
            displayName: contact?.name ?? handle,
            userId: `@${handle}`,
            isAnonymous: false,
            isFavorite: contact?.isFavorite ?? false,
          },
          amount,
        };
      }
    }
  } catch {
    // não é URL válida
  }
  return null;
};

export const ScanScreen: React.FC<ScanScreenProps> = ({
  onResult,
  onClose,
}) => {
  const { t } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const scanLine = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    const parsed = parseSolanaOrKoriQR(data);
    if (parsed) {
      onResult(parsed.recipient, parsed.amount);
    } else {
      // QR desconhecido — trata como ID raw
      setScanned(false);
    }
  };

  if (!permission)
    return <View style={[styles.container, { backgroundColor: t.bg }]} />;

  if (!permission.granted) {
    return (
      <PaymentScreenFrame
        title="Escanear QR"
        onClose={onClose}
        footer={
          <PaymentPrimaryButton
            label="Permitir câmera"
            onPress={requestPermission}
          />
        }
      >
        <View style={styles.permissionCenter}>
          <PaymentCard padding={24}>
            <View style={styles.permissionCard}>
              <View
                style={[styles.permIconCircle, { backgroundColor: t.bgElev }]}
              >
                <Feather name="camera" size={32} color={t.ink} />
              </View>
              <Text style={[styles.permTitle, { color: t.ink }]}>
                Permissão de câmera
              </Text>
              <Text style={[styles.permDesc, { color: t.inkMute }]}>
                Para escanear QR Codes da Kori, precisamos de acesso à sua
                câmera.
              </Text>
            </View>
          </PaymentCard>
        </View>
      </PaymentScreenFrame>
    );
  }

  const scanLineTranslate = scanLine.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
          <Feather name="x" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escanear QR</Text>
        <View style={styles.headerBtnPlaceholder} />
      </View>

      {/* Camera */}
      <View style={styles.cameraWrapper}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />

        {/* Overlay escuro com janela de scan */}
        <View style={styles.overlay}>
          <View style={styles.overlayTop} />
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.scanWindow}>
              {/* Cantos decorativos */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              {/* Linha de scan animada */}
              <Animated.View
                style={[
                  styles.scanLineBar,
                  { transform: [{ translateY: scanLineTranslate }] },
                ]}
              />
            </View>
            <View style={styles.overlaySide} />
          </View>
          <View style={styles.overlayBottom}>
            <Text style={styles.scanHint}>Aponte para um QR Code da Kori</Text>
            {scanned && (
              <TouchableOpacity
                onPress={() => setScanned(false)}
                style={styles.retryBtn}
              >
                <Text style={styles.retryText}>Escanear novamente</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const WINDOW_SIZE = 240;
const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 24,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 10,
  },
  headerBtn: { padding: 6, width: 34 },
  headerBtnPlaceholder: { width: 34 },
  headerTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cameraWrapper: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
  },
  overlayTop: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)" },
  overlayMiddle: { flexDirection: "row" },
  overlaySide: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)" },
  scanWindow: {
    width: WINDOW_SIZE,
    height: WINDOW_SIZE,
    overflow: "hidden",
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    paddingTop: 32,
    gap: 16,
  },
  scanHint: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    fontWeight: "500",
  },
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: "#ff6b3d",
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 4,
  },
  scanLineBar: {
    position: "absolute",
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: "#ff6b3d",
    borderRadius: 1,
    shadowColor: "#ff6b3d",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  retryBtn: { paddingVertical: 8 },
  retryText: { color: "#8E8E93", fontSize: 13, fontWeight: "500" },

  permissionCenter: {
    flex: 1,
    justifyContent: "center",
  },
  permissionCard: {
    alignItems: "center",
  },
  permIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#242424",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  permTitle: {
    fontFamily: fonts.sans.bold,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },
  permDesc: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 24,
  },
});
