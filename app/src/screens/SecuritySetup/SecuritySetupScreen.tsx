import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { useTheme } from "@theme/ThemeProvider";
import {
  useSecuritySetupLogic,
  SecurityMethod,
} from "@hooks/useSecuritySetupLogic";
import { SelectStep } from "@components/securitysetup/SelectStep";
import { SimulateStep } from "@components/securitysetup/SimulateStep";
import { PinStep } from "@components/securitysetup/PinStep";

interface SecuritySetupProps {
  userName: string;
  onComplete: (method: SecurityMethod | "none", pinCode?: string) => void;
}

export const SecuritySetupScreen: React.FC<SecuritySetupProps> & {
  Container: React.FC<{ children: React.ReactNode; bg: string; barStyle: any }>;
} = ({ userName, onComplete }) => {
  const { t } = useTheme();
  const {
    selectedMethod,
    setupStep,
    setSetupStep,
    loading,
    pin,
    pinStep,
    pinError,
    scanProgress,
    handleSelectMethod,
    handleNext,
    handleKeyPress,
    handleDelete,
    strings,
  } = useSecuritySetupLogic({ userName, onComplete });

  return (
    <SecuritySetupScreen.Container bg={t.bg} barStyle={t.statusBar}>
      {setupStep === "select" && (
        <SelectStep
          selectedMethod={selectedMethod}
          onSelectMethod={handleSelectMethod}
          onNext={handleNext}
          strings={strings}
          theme={t}
        />
      )}

      {setupStep === "simulating" && (
        <SimulateStep
          selectedMethod={selectedMethod}
          scanProgress={scanProgress}
          strings={strings}
          theme={t}
        />
      )}

      {setupStep === "pin_input" && (
        <PinStep
          pin={pin}
          pinStep={pinStep}
          pinError={pinError}
          loading={loading}
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onBack={() => setSetupStep("select")}
          strings={strings}
          theme={t}
        />
      )}
    </SecuritySetupScreen.Container>
  );
};

const SecuritySetupContainer: React.FC<{
  children: React.ReactNode;
  bg: string;
  barStyle: any;
}> = ({ children, bg, barStyle }) => (
  <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
    <StatusBar barStyle={barStyle} backgroundColor={bg} translucent />
    {children}
  </SafeAreaView>
);

SecuritySetupScreen.Container = SecuritySetupContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
