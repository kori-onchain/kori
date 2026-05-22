import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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
  const isPrimary = variant === "primary";
  const isGhost = variant === "ghost";
  const textClass = isPrimary ? "text-bg" : isGhost ? "text-ink-dim" : "text-ink";

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
          colors={isPrimary ? ["#ffffff", "#f0f0f2"] : ["#1e1e23", "#16161a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      {!isGhost && <View pointerEvents="none" className="absolute inset-x-0 top-0 h-px bg-white/10" />}
      <View className="h-full flex-row items-center justify-center px-4">
        {loading ? (
          <ActivityIndicator size="small" color={isPrimary ? "#0a0a0a" : "#fafafa"} />
        ) : (
          <>
            {icon && iconPosition === "left" && <View className="mr-2">{icon}</View>}
            <Text className={`font-sans-semibold text-[14px] ${textClass}`}>{label}</Text>
            {icon && iconPosition === "right" && <View className="ml-2">{icon}</View>}
          </>
        )}
      </View>
    </Pressable>
  );
};
