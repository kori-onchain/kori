import React from "react";
import {
  Animated,
  Easing,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { fonts, radii } from "@theme/tokens";
import { useTheme } from "@theme/ThemeProvider";
import { SoftCard } from "@components/layout/SoftCard";
import {
  ChevronDownIcon,
  KoriGlyph,
  SolanaIcon,
} from "@components/layout/icons";

interface AccountSwitchProps {
  initials: string;
  onPress?: () => void;
  expanded?: boolean;
  showWalletBadge?: boolean;
  isPJ?: boolean;
}

export const AccountSwitch: React.FC<AccountSwitchProps> = ({
  initials,
  onPress,
  expanded = false,
  showWalletBadge = true,
  isPJ = false,
}) => {
  const { t } = useTheme();
  const openProgress = React.useRef(
    new Animated.Value(expanded ? 1 : 0),
  ).current;
  const pressScale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(openProgress, {
      toValue: expanded ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [expanded, openProgress]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(pressScale, {
        toValue: 0.96,
        duration: 70,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(pressScale, {
        toValue: 1,
        speed: 18,
        bounciness: 5,
        useNativeDriver: true,
      }),
    ]).start();
    onPress?.();
  };

  const rotate = openProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const lift = openProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1],
  });

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
      <Animated.View
        style={{
          transform: [{ scale: pressScale }, { translateY: lift }],
        }}
      >
        <SoftCard
          radius={radii.pill}
          padding={0}
          style={[
            expanded && {
              borderColor: t.line2,
              shadowColor: t.orange,
              shadowOpacity: 0.18,
            },
          ]}
        >
          <View style={styles.row}>
            {/* Removemos o overflow: 'hidden' para permitir a sobreposição */}
            <View
              style={[
                styles.avatar,
                { overflow: "visible", borderWidth: 0, backgroundColor: "transparent" }
              ]}
            >
              <View style={styles.stackedContainer}>
                {isPJ ? (
                  <>
                    {/* Avatar de Trás (Conta Secundária: PF com iniciais) */}
                    <View style={[styles.miniAvatar, { backgroundColor: t.bgElev, borderColor: t.bg, zIndex: 1 }]}>
                      <Text style={[styles.avatarText, { color: t.inkDim, fontSize: 8 }]}>
                        {initials}
                      </Text>
                    </View>
                    
                    {/* Avatar da Frente (Conta Ativa: PJ com Gradiente) */}
                    <View style={[styles.miniAvatar, { borderColor: t.bg, zIndex: 2, marginLeft: -8 }]}>
                      <LinearGradient
                        colors={[t.orangeDark, t.orange]}
                        style={StyleSheet.absoluteFillObject}
                      />
                      <SolanaIcon size={12} color={t.ink} />
                    </View>
                  </>
                ) : (
                  <>
                    {/* Avatar de Trás (Conta Secundária: PJ com Gradiente) */}
                    <View style={[styles.miniAvatar, { borderColor: t.bg, zIndex: 1 }]}>
                      <LinearGradient
                        colors={[t.orangeDark, t.orange]}
                        style={StyleSheet.absoluteFillObject}
                      />
                      <SolanaIcon size={12} color={t.ink} />
                    </View>
                    
                    {/* Avatar da Frente (Conta Ativa: PF com iniciais) */}
                    <View style={[styles.miniAvatar, { backgroundColor: t.bgElev, borderColor: t.line, zIndex: 2, marginLeft: -8 }]}>
                      <Text style={[styles.avatarText, { color: t.ink, fontSize: 8 }]}>
                        {initials}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
            <Animated.View
              style={[styles.chevron, { transform: [{ rotate }] }]}
            >
              <ChevronDownIcon size={13} color={t.inkDim} strokeWidth={2} />
            </Animated.View>
          </View>
        </SoftCard>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 4,
    gap: 7,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  stackedContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 28,
    height: 28,
    justifyContent: "center",
  },
  miniAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  avatarText: {
    fontFamily: fonts.sans.bold,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  solBadge: {
    position: "absolute",
    bottom: -2,
    right: -3,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3, 
  },
  chevron: {
  },
});