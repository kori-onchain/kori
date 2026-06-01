import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { useTheme } from "@theme/ThemeProvider";
import { useAuthLogic } from "@hooks/useAuthLogic";
import { WelcomeStep } from "@components/auth/steps/WelcomeStep";
import { EmailStep } from "@components/auth/steps/EmailStep";
import { OtpStep } from "@components/auth/steps/OtpStep";
import { AccountTypeStep } from "@components/auth/steps/AccountTypeStep";
import { DetailsStep } from "@components/auth/steps/DetailsStep";
import { WalletStep } from "@components/auth/steps/WalletStep";
import { AuthUserData } from "@type/auth";

interface AuthScreenProps {
  onAuthSuccess: (userData: AuthUserData, isSignup: boolean) => void;
  initialAccountType?: "PF" | "PJ";
  initialStage?: "welcome" | "email" | "otp" | "accountType" | "details" | "wallet";
  existingPrivyUser?: { id: string; email: string } | null;
  onCancel?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> & {
  Container: React.FC<{ children: React.ReactNode; bg: string; barStyle: any }>;
} = ({
  onAuthSuccess,
  initialAccountType,
  initialStage,
  existingPrivyUser,
  onCancel,
}) => {
  const { t } = useTheme();

  const {
    stage,
    accountType,
    setAccountType,
    form,
    focusedField,
    setFocusedField,
    error,
    walletStep,
    loadingWallet,
    loadingOAuth,
    otpState,
    usernameAvailability,
    usernamePlaceholder,
    handleBack,
    handleChangeField,
    handleSendOtp,
    handleVerifyOtp,
    handleOAuthLogin,
    handleCreateAccount,
    setStage,
    activeUsername,
  } = useAuthLogic({
    onAuthSuccess,
    initialAccountType,
    initialStage,
    existingPrivyUser,
    onCancel,
  });

  return (
    <AuthScreen.Container bg={t.bg} barStyle={t.statusBar}>
      {stage === "welcome" && (
        <WelcomeStep
          onSignupWithEmail={() => setStage("email")}
          onGoogleLogin={() => handleOAuthLogin("google")}
          onAppleLogin={() => handleOAuthLogin("apple")}
          loadingOAuth={loadingOAuth}
        />
      )}

      {stage === "email" && (
        <EmailStep
          form={form}
          focusedField={focusedField}
          error={error}
          loading={otpState.status === "sending-code"}
          onBack={handleBack}
          onFocusField={setFocusedField}
          onChangeField={handleChangeField}
          onSend={handleSendOtp}
          onCreateAccount={handleSendOtp}
        />
      )}

      {stage === "otp" && (
        <OtpStep
          email={form.email}
          error={error}
          loading={otpState.status === "submitting-code"}
          onBack={handleBack}
          onVerify={handleVerifyOtp}
          onResend={handleSendOtp}
        />
      )}

      {stage === "accountType" && (
        <AccountTypeStep
          selected={accountType}
          onSelect={setAccountType}
          onBack={handleBack}
          onContinue={() => {
            setStage("details");
          }}
        />
      )}

      {stage === "details" && (
        <DetailsStep
          accountType={accountType}
          form={form}
          focusedField={focusedField}
          error={error}
          usernameAvailability={usernameAvailability}
          usernamePlaceholder={usernamePlaceholder}
          canContinue={usernameAvailability === "available"}
          onBack={handleBack}
          onFocusField={setFocusedField}
          onChangeField={handleChangeField}
          onContinue={handleCreateAccount}
        />
      )}

      {stage === "wallet" && (
        <WalletStep
          username={activeUsername}
          walletStep={walletStep}
          loading={loadingWallet}
        />
      )}
    </AuthScreen.Container>
  );
};

const AuthContainer: React.FC<{
  children: React.ReactNode;
  bg: string;
  barStyle: any;
}> = ({ children, bg, barStyle }) => (
  <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
    <StatusBar barStyle={barStyle} backgroundColor={bg} translucent />
    {children}
  </SafeAreaView>
);

AuthScreen.Container = AuthContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
