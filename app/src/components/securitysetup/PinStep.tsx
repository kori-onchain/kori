import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Feather } from "@/icons";
import { SoftCard } from "@components/layout/SoftCard";

interface PinStepProps {
  pin: string[];
  pinStep: "enter" | "confirm";
  pinError: string | null;
  loading: boolean;
  onKeyPress: (num: string) => void;
  onDelete: () => void;
  onBack: () => void;
  strings: any;
  theme: any;
}

export const PinStep: React.FC<PinStepProps> = ({
  pin,
  pinStep,
  pinError,
  loading,
  onKeyPress,
  onDelete,
  onBack,
  strings,
  theme,
}) => {
  const isEnter = pinStep === "enter";
  const title = isEnter
    ? strings.pinSetup.enterTitle
    : strings.pinSetup.confirmTitle;
  const desc = isEnter
    ? strings.pinSetup.enterDesc
    : strings.pinSetup.confirmDesc;

  return (
    <View style={styles.pinSetupContainer}>
      <View style={styles.pinHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Feather name="arrow-left" size={22} color={theme.ink} />
        </TouchableOpacity>
        <Text style={[styles.pinStepTitle, { color: theme.ink }]}>{title}</Text>
        <Text style={[styles.pinStepDesc, { color: theme.inkMute }]}>
          {desc}
        </Text>
      </View>

      <View style={styles.pinSlotsRow}>
        {[0, 1, 2, 3, 4].map((index) => {
          const hasDigit = pin.length > index;
          return (
            <View
              key={index}
              style={[
                styles.pinSlot,
                { borderColor: theme.line2 },
                hasDigit && {
                  backgroundColor: theme.ink,
                  borderColor: theme.ink,
                },
                pinError && { borderColor: theme.orangeDark },
              ]}
            />
          );
        })}
      </View>

      {pinError && (
        <Text style={[styles.pinErrorText, { color: theme.orangeDark }]}>
          {pinError}
        </Text>
      )}

      <View style={styles.numpad}>
        <View style={styles.numpadRow}>
          {["1", "2", "3"].map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => onKeyPress(num)}
              disabled={loading}
              style={styles.numpadKeyTouch}
            >
              <SoftCard radius={30} padding={0} flat style={styles.numpadKey}>
                <View style={styles.numpadKeyInner}>
                  <Text style={[styles.numpadKeyText, { color: theme.ink }]}>
                    {num}
                  </Text>
                </View>
              </SoftCard>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.numpadRow}>
          {["4", "5", "6"].map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => onKeyPress(num)}
              disabled={loading}
              style={styles.numpadKeyTouch}
            >
              <SoftCard radius={30} padding={0} flat style={styles.numpadKey}>
                <View style={styles.numpadKeyInner}>
                  <Text style={[styles.numpadKeyText, { color: theme.ink }]}>
                    {num}
                  </Text>
                </View>
              </SoftCard>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.numpadRow}>
          {["7", "8", "9"].map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => onKeyPress(num)}
              disabled={loading}
              style={styles.numpadKeyTouch}
            >
              <SoftCard radius={30} padding={0} flat style={styles.numpadKey}>
                <View style={styles.numpadKeyInner}>
                  <Text style={[styles.numpadKeyText, { color: theme.ink }]}>
                    {num}
                  </Text>
                </View>
              </SoftCard>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.numpadRow}>
          <View style={styles.numpadKeySpacer} />
          <TouchableOpacity
            style={styles.numpadKeyTouch}
            onPress={() => onKeyPress("0")}
            disabled={loading}
          >
            <SoftCard radius={30} padding={0} flat style={styles.numpadKey}>
              <View style={styles.numpadKeyInner}>
                <Text style={[styles.numpadKeyText, { color: theme.ink }]}>
                  0
                </Text>
              </View>
            </SoftCard>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numpadKeyDelete}
            onPress={onDelete}
            disabled={loading}
          >
            <Feather name="delete" size={20} color={theme.ink} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontFamily: "Geist_700Bold",
    marginTop: 6,
  },
  pinStepDesc: {
    fontSize: 13,
    fontFamily: "Geist_500Medium",
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
  pinErrorText: {
    fontSize: 12,
    fontFamily: "Geist_500Medium",
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
  numpadKeyTouch: {
    flex: 1,
    height: 60,
  },
  numpadKey: {
    height: 60,
    borderRadius: 30,
  },
  numpadKeyInner: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  numpadKeyText: {
    fontSize: 20,
    fontFamily: "Geist_700Bold",
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
