import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { Feather } from "@/icons";
import { useTheme } from "@theme/ThemeProvider";
import { AuthButton } from "@components/auth/AuthButton";
import { fonts, radii } from "@theme/tokens";

interface SecuritySetupProps {
  userName: string;
  onComplete: () => void | Promise<void>;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "K";

export const SecuritySetupScreen: React.FC<SecuritySetupProps> & {
  Container: React.FC<{ children: React.ReactNode; bg: string; barStyle: any }>;
} = ({ userName, onComplete }) => {
  const { t } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canUseBiometrics, setCanUseBiometrics] = useState(true);

  const initials = useMemo(() => getInitials(userName), [userName]);

  const enableBiometrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setCanUseBiometrics(false);
        setError("Ative a biometria no dispositivo para continuar.");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Ativar biometria",
        fallbackLabel: "",
        disableDeviceFallback: true,
      });

      if (result.success) {
        await onComplete();
        return;
      }

      setError("Nao foi possivel validar a biometria agora.");
    } catch (e: any) {
      setError(e?.message || "Nao foi possivel ativar a biometria.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void enableBiometrics();
    // intentional one-shot auto prompt
  }, []);

  return (
    <SecuritySetupScreen.Container bg={t.bg} barStyle={t.statusBar}>
      <View style={styles.container}>
        <View style={styles.profileArea}>
          <View style={[styles.avatar, { backgroundColor: t.bg2, borderColor: t.line2 }]}>
            <Text style={[styles.avatarText, { color: t.ink }]}>{initials}</Text>
          </View>
          <Text style={[styles.name, { color: t.ink }]} numberOfLines={1}>
            {userName}
          </Text>
          <Text style={[styles.subtitle, { color: t.inkDim }]}>
            Ative a biometria para proteger o acesso ao app.
          </Text>
        </View>

        <View style={styles.body}>
          <View style={[styles.card, { backgroundColor: t.bg2, borderColor: t.line }]}>
            <View style={[styles.iconWrap, { backgroundColor: t.bgElev }]}>
              <Feather name="key" size={24} color={t.orange} />
            </View>
            <Text style={[styles.title, { color: t.ink }]}>Proteja sua carteira</Text>
            <Text style={[styles.description, { color: t.inkDim }]}>
              A biometria sera obrigatoria e esta tela nao vai aparecer novamente depois que
              for habilitada.
            </Text>

            {error ? (
              <View style={[styles.errorBox, { borderColor: t.orangeDark, backgroundColor: t.bg }]}>
                <Feather name="alert-circle" size={16} color={t.orangeDark} />
                <Text style={[styles.errorText, { color: t.orangeDark }]}>{error}</Text>
              </View>
            ) : null}

            {!canUseBiometrics ? (
              <Text style={[styles.helper, { color: t.inkMute }]}>
                Abra as configuracoes do aparelho, cadastre a biometria e volte para concluir.
              </Text>
            ) : null}

            <AuthButton
              label={loading ? "Aguardando biometria..." : "Habilitar biometria"}
              onPress={enableBiometrics}
              loading={loading}
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </SecuritySetupScreen.Container>
  );
};

const SecuritySetupContainer: React.FC<{
  children: React.ReactNode;
  bg: string;
  barStyle: any;
}> = ({ children, bg, barStyle }) => (
  <SafeAreaView
    style={[
      styles.safeArea,
      {
        backgroundColor: bg,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      },
    ]}
  >
    <StatusBar barStyle={barStyle} backgroundColor={bg} translucent />
    {children}
  </SafeAreaView>
);

SecuritySetupScreen.Container = SecuritySetupContainer;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 24,
  },
  profileArea: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 18,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarText: {
    fontFamily: fonts.sans.bold,
    fontSize: 24,
  },
  name: {
    fontFamily: fonts.sans.bold,
    fontSize: 24,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 6,
    maxWidth: 280,
  },
  body: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    borderRadius: radii.card,
    borderWidth: 1,
    padding: 18,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    fontFamily: fonts.sans.bold,
    fontSize: 20,
    marginBottom: 8,
  },
  description: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  errorText: {
    flex: 1,
    fontFamily: fonts.sans.medium,
    fontSize: 12,
  },
  helper: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
});
