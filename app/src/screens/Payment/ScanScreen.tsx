import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Feather } from "@/icons";
import { PaymentRecipient } from "@type/payment";
import { MOCK_CONTACTS } from "@/data/contacts";
import { useTheme } from "@theme/ThemeProvider";
import { fonts } from "@theme/tokens";

const APP_SCHEME = "kori://pay";

interface ScanScreenProps {
  onResult: (recipient: PaymentRecipient, amount?: string) => void;
  onClose: () => void;
}

const parseSolanaOrKoriQR = (
  raw: string,
): { recipient: PaymentRecipient; amount?: string } | null => {
  try {
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
    // URL inválida
  }
  return null;
};

export const ScanScreen: React.FC<ScanScreenProps> = ({ onResult, onClose }) => {
  const { t } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const scanLine = useState(new Animated.Value(0))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
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
      setScanned(false);
    }
  };

  /* ── Sem permissão ─────────────────────────────────── */
  if (!permission) return <View style={styles.root} />;

  if (!permission.granted) {
    return (
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <Feather name="x" size={20} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Escanear QR</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Permission card centered */}
        <View style={styles.permCenter}>
          <View style={styles.permIconWrap}>
            <Feather name="camera-off" size={28} color="rgba(255,255,255,0.35)" />
          </View>
          <Text style={styles.permTitle}>Câmera necessária</Text>
          <Text style={styles.permDesc}>
            Para escanear QR Codes da Kori, precisamos de acesso à câmera do dispositivo.
          </Text>
          <TouchableOpacity
            style={styles.permBtn}
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <Text style={styles.permBtnText}>Permitir câmera</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const scanLineY = scanLine.interpolate({
    inputRange: [0, 1],
    outputRange: [0, WINDOW_SIZE - 2],
  });

  return (
    <View style={styles.root}>
      {/* Camera */}
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />

      {/* Dark overlay with cutout */}
      <View style={styles.overlay}>
        {/* Top dark */}
        <View style={styles.overlayTop} />

        {/* Middle row */}
        <View style={styles.overlayMiddle}>
          <View style={styles.overlaySide} />

          {/* Scan window */}
          <Animated.View style={[styles.window, { transform: [{ scale: pulseAnim }] }]}>
            {/* Corner marks */}
            <View style={[styles.corner, styles.cTL]} />
            <View style={[styles.corner, styles.cTR]} />
            <View style={[styles.corner, styles.cBL]} />
            <View style={[styles.corner, styles.cBR]} />

            {/* Scan line */}
            <Animated.View
              style={[styles.scanLine, { transform: [{ translateY: scanLineY }] }]}
            />
          </Animated.View>

          <View style={styles.overlaySide} />
        </View>

        {/* Bottom dark */}
        <View style={styles.overlayBottom}>
          <Text style={styles.hint}>Aponte para um QR Code da Kori</Text>
          {scanned && (
            <TouchableOpacity
              onPress={() => setScanned(false)}
              style={styles.retryBtn}
              activeOpacity={0.7}
            >
              <Feather name="refresh-cw" size={14} color="rgba(255,255,255,0.5)" />
              <Text style={styles.retryText}>Escanear novamente</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Floating header */}
      <View style={[styles.header, styles.headerAbsolute]}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
          <Feather name="x" size={20} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escanear QR</Text>
        <View style={styles.headerSpacer} />
      </View>
    </View>
  );
};

const WINDOW_SIZE = 230;
const CORNER = 22;
const THICK = 2.5;
const CORNER_COLOR = "rgba(255,255,255,0.55)";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 56 : 20,
    paddingBottom: 16,
  },
  headerAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "rgba(255,255,255,0.75)",
    fontFamily: fonts.sans.semibold,
    fontSize: 15,
  },
  headerSpacer: { width: 36 },

  /* Overlay */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
  },
  overlayTop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.70)",
  },
  overlayMiddle: {
    flexDirection: "row",
    height: WINDOW_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.70)",
  },

  /* Scan window */
  window: {
    width: WINDOW_SIZE,
    height: WINDOW_SIZE,
    overflow: "hidden",
  },
  corner: {
    position: "absolute",
    width: CORNER,
    height: CORNER,
    borderColor: CORNER_COLOR,
  },
  cTL: { top: 0, left: 0, borderTopWidth: THICK, borderLeftWidth: THICK, borderTopLeftRadius: 3 },
  cTR: { top: 0, right: 0, borderTopWidth: THICK, borderRightWidth: THICK, borderTopRightRadius: 3 },
  cBL: { bottom: 0, left: 0, borderBottomWidth: THICK, borderLeftWidth: THICK, borderBottomLeftRadius: 3 },
  cBR: { bottom: 0, right: 0, borderBottomWidth: THICK, borderRightWidth: THICK, borderBottomRightRadius: 3 },

  scanLine: {
    position: "absolute",
    left: 10,
    right: 10,
    height: 1.5,
    backgroundColor: "rgba(255,255,255,0.30)",
    borderRadius: 1,
  },

  /* Bottom section */
  overlayBottom: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.70)",
    alignItems: "center",
    paddingTop: 28,
    gap: 14,
  },
  hint: {
    color: "rgba(255,255,255,0.45)",
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  retryText: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: fonts.sans.medium,
    fontSize: 13,
  },

  /* Permission */
  permCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  permIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  permTitle: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: fonts.sans.bold,
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  permDesc: {
    color: "rgba(255,255,255,0.35)",
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 28,
  },
  permBtn: {
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  permBtnText: {
    color: "rgba(255,255,255,0.75)",
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
  },
});
