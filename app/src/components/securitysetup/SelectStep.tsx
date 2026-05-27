import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Feather } from "@/icons";
import { Button } from "@components/layout/Button";
import { MethodCard } from "@components/securitysetup/MethodCard";
import { SecurityMethod } from "@/hooks/useSecuritySetupLogic";

interface SelectStepProps {
  selectedMethod: SecurityMethod;
  onSelectMethod: (method: SecurityMethod) => void;
  onNext: () => void;
  strings: any;
  theme: any;
}

export const SelectStep: React.FC<SelectStepProps> = ({
  selectedMethod,
  onSelectMethod,
  onNext,
  strings,
  theme,
}) => {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        <View
          style={[
            styles.shieldIconContainer,
            { backgroundColor: theme.bg2, borderColor: theme.cardBorder },
          ]}
        >
          <Feather name="shield" size={32} color={theme.ink} />
        </View>
        <Text style={[styles.title, { color: theme.ink }]}>
          {strings.title}
        </Text>
        <Text style={[styles.subtitle, { color: theme.inkMute }]}>
          {strings.subtitle}
        </Text>
      </View>

      <View style={styles.optionsStack}>
        <MethodCard
          method="digital"
          selectedMethod={selectedMethod}
          title={strings.biometrics.digitalTitle}
          desc={strings.biometrics.digitalDesc}
          iconName="finger-print-outline"
          onSelect={onSelectMethod}
          theme={theme}
        />
        <MethodCard
          method="facial"
          selectedMethod={selectedMethod}
          title={strings.biometrics.facialTitle}
          desc={strings.biometrics.facialDesc}
          iconName="scan-outline"
          onSelect={onSelectMethod}
          theme={theme}
        />
        <MethodCard
          method="pin"
          selectedMethod={selectedMethod}
          title={strings.biometrics.pinTitle}
          desc={strings.biometrics.pinDesc}
          iconName="grid-outline"
          onSelect={onSelectMethod}
          theme={theme}
        />
      </View>

      <View style={styles.actionsContainer}>
        <Button label={strings.buttonLabel} onPress={onNext} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: "Geist_700Bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Geist_500Medium",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
  },
  optionsStack: {
    gap: 16,
    marginVertical: 32,
  },
  actionsContainer: {
    gap: 12,
  },
});
