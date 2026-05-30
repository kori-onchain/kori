import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Feather, Ionicons } from "@/icons";
import { SoftCard } from "@components/layout/SoftCard";

interface SimulateStepProps {
  selectedMethod: "digital" | "facial" | "pin";
  scanProgress: number;
  strings: any;
  theme: any;
}

export const SimulateStep: React.FC<SimulateStepProps> = ({
  selectedMethod,
  scanProgress,
  strings,
  theme,
}) => {
  const isDigital = selectedMethod === "digital";
  const iconName = isDigital ? "finger-print-outline" : "scan-outline";
  const scanning = scanProgress < 1;

  const title = scanning
    ? isDigital
      ? strings.simulating.activatingDigital
      : strings.simulating.activatingFacial
    : isDigital
      ? strings.simulating.activatedDigital
      : strings.simulating.activatedFacial;

  const desc = scanning
    ? strings.simulating.descSimulating
    : strings.simulating.descActivated;

  return (
    <View style={styles.scanContainer}>
      <SoftCard radius={70} padding={0} strong style={styles.scanBox}>
        <View style={styles.scanBoxInner}>
          <Ionicons name={iconName} size={80} color={theme.ink} />
        </View>
      </SoftCard>

      <View style={styles.statusSlot}>
        {scanning ? (
          <ActivityIndicator size="large" color={theme.orange} />
        ) : (
          <View
            style={[
              styles.successScanBadge,
              { backgroundColor: theme.green, borderColor: theme.bg },
            ]}
          >
            <Feather name="check" size={28} color={theme.bg} />
          </View>
        )}
      </View>

      <Text style={[styles.scanTitle, { color: theme.ink }]}>{title}</Text>
      <Text style={[styles.scanDesc, { color: theme.inkMute }]}>{desc}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  scanContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  scanBox: {
    width: 140,
    height: 140,
    marginBottom: 24,
  },
  scanBoxInner: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  statusSlot: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successScanBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
  },
  scanTitle: {
    fontSize: 20,
    fontFamily: "Geist_700Bold",
    textAlign: "center",
  },
  scanDesc: {
    fontSize: 13,
    fontFamily: "Geist_500Medium",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 18,
  },
});
