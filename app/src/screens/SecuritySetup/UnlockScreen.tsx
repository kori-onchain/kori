import React, { useEffect, useMemo, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@theme/ThemeProvider";
import { fonts } from "@theme/tokens";

interface UnlockScreenProps {
  userName: string;
  username: string;
  onUnlock: () => Promise<boolean> | boolean;
  accountType?: "PF" | "PJ";
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "K";

export const UnlockScreen: React.FC<UnlockScreenProps> & {
  Container: React.FC<{ children: React.ReactNode; bg: string; barStyle: any }>;
} = ({ userName, username, onUnlock, accountType = "PF" }) => {
  const { t } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = useMemo(() => getInitials(userName), [userName]);

  const handleUnlock = async () => {
    try {
      setLoading(true);
      setError(null);
      const ok = await onUnlock();
      if (!ok) {
        setError("Toque na tela para autenticar");
      }
    } catch (e: any) {
      setError(e?.message || "Não foi possível liberar o acesso.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void handleUnlock();
  }, []);

  return (
    <UnlockScreen.Container bg={t.bg} barStyle={t.statusBar}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={handleUnlock}
        disabled={loading}
      >
        <View style={styles.content}>
          {/* User initials logo circle */}
          <View style={[styles.avatar, { backgroundColor: t.bg2, borderColor: t.line2 }]}>
            <Text style={[styles.avatarText, { color: t.ink }]}>{initials}</Text>
          </View>

          {/* Account Type Tag */}
          <View style={[styles.tag, { backgroundColor: t.bgElev }]}>
            <Text style={[styles.tagText, { color: t.inkDim }]}>
              {accountType === "PJ" ? "Comercial" : "Pessoal"}
            </Text>
          </View>

          {/* User Display Name */}
          <Text style={[styles.name, { color: t.ink }]} numberOfLines={1}>
            {userName}
          </Text>

          {/* Masked/Dimmed Username in CPF position */}
          <Text style={[styles.username, { color: t.inkDim }]} numberOfLines={1}>
            @{username}
          </Text>

          {/* discreet error text in case biometric fails */}
          {error ? (
            <Text style={[styles.errorText, { color: t.orange }]}>
              {error}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    </UnlockScreen.Container>
  );
};

const UnlockContainer: React.FC<{
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

UnlockScreen.Container = UnlockContainer;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  avatarText: {
    fontFamily: fonts.mono.semibold,
    fontSize: 32,
    letterSpacing: -1,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 16,
  },
  tagText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 12,
  },
  name: {
    fontFamily: fonts.sans.bold,
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  username: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
  },
  errorText: {
    marginTop: 24,
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    textAlign: "center",
    maxWidth: 260,
  },
});
