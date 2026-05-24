import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../theme/ThemeProvider";

type AuthButtonProps = {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  variant?: "primary" | "soft" | "ghost";
  loading?: boolean;
  disabled?: boolean;
};

export const AuthButton: React.FC<AuthButtonProps> = ({
  label,
  onPress,
  icon,
  iconPosition = "left",
  variant = "primary",
  loading = false,
  disabled = false,
}) => {
  const { t } = useTheme();
  const isPrimary = variant === "primary";
  const isGhost = variant === "ghost";
  const textClass = isPrimary
    ? "text-bg"
    : isGhost
      ? "text-ink-dim"
      : "text-ink";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={[
        "w-full overflow-hidden rounded-btn",
        isGhost ? "h-11" : "h-[52px]",
        disabled || loading ? "opacity-70" : "opacity-100",
      ].join(" ")}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.985 : 1 }] }]}
    >
      {!isGhost && (
        <LinearGradient
          pointerEvents="none"
          colors={isPrimary ? [t.btnPrimaryBg, t.btnPrimaryBg] : t.glossy}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      {!isGhost && (
        <View
          pointerEvents="none"
          className="absolute inset-x-0 top-0 h-px bg-white/10"
        />
      )}
      <View className="h-full flex-row items-center justify-center px-4">
        <View className={loading ? "opacity-0" : "opacity-100"}>
          <View className="flex-row items-center justify-center">
            {icon && iconPosition === "left" && (
              <View className="mr-2">{icon}</View>
            )}
            <Text className={`font-sans-semibold text-[14px] ${textClass}`}>
              {label}
            </Text>
            {icon && iconPosition === "right" && (
              <View className="ml-2">{icon}</View>
            )}
          </View>
        </View>

        {loading ? (
          <View className="absolute inset-0 items-center justify-center">
            <ActivityIndicator
              size="small"
              color={isPrimary ? t.btnPrimaryFg : t.ink}
            />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};
