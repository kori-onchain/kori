import React from "react";
import { Text, TextInput, TextInputProps, View, TouchableOpacity } from "react-native";
import { ChevronDownIcon } from "@components/layout/icons";

type AuthFieldProps = {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder: string;
  focused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  prefix?: string;
  select?: boolean;
  showAvailable?: boolean;
  availabilityStatus?: "idle" | "checking" | "available" | "unavailable" | "error";
  keyboardType?: TextInputProps["keyboardType"];
  secureTextEntry?: boolean;
  editable?: boolean;
  onPress?: () => void;
  maxLength?: number;
};

export const AuthField: React.FC<AuthFieldProps> = ({
  label,
  value,
  onChangeText = () => {},
  placeholder,
  focused = false,
  onFocus,
  onBlur,
  prefix,
  select = false,
  showAvailable = false,
  availabilityStatus = "idle",
  keyboardType = "default",
  secureTextEntry = false,
  editable = true,
  onPress,
  maxLength,
}) => {
  const isEditable = editable && !select && !onPress;

  const renderInner = () => (
    <View
      className={[
        "min-h-[50px] flex-row items-center overflow-hidden rounded-[12px] border bg-bg-2 px-3.5",
        focused ? "border-line2" : "border-line",
        !isEditable ? "opacity-60" : "",
      ].join(" ")}
    >
      {prefix ? (
        <Text className="mr-1 font-sans-medium text-[14px] text-ink-mute">
          {prefix}
        </Text>
      ) : null}
      <TextInput
        className="min-h-[50px] flex-1 p-0 font-sans text-[14px] text-ink"
        placeholder={placeholder}
        placeholderTextColor="#5a5a5e"
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardType={keyboardType}
        editable={isEditable}
        secureTextEntry={secureTextEntry}
        autoCapitalize={
          prefix || keyboardType === "email-address" || secureTextEntry ? "none" : "words"
        }
        autoCorrect={false}
        pointerEvents={onPress ? "none" : "auto"}
        maxLength={maxLength}
      />
      {select ? <ChevronDownIcon size={14} color="#5a5a5e" /> : null}
    </View>
  );

  return (
    <View className="w-full">
      <Text className="mb-1.5 font-mono-medium text-[9px] uppercase tracking-[1.1px] text-ink-mute">
        {label}
      </Text>
      {onPress ? (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
          {renderInner()}
        </TouchableOpacity>
      ) : (
        renderInner()
      )}
      {availabilityStatus !== "idle" || showAvailable ? (
        <Text
          className={[
            "mt-1.5 font-mono-medium text-[9px]",
            availabilityStatus === "unavailable" || availabilityStatus === "error"
              ? "text-orange-dark"
              : availabilityStatus === "checking"
                ? "text-ink-mute"
                : "text-green",
          ].join(" ")}
        >
          {availabilityStatus === "checking"
            ? "verificando..."
            : availabilityStatus === "unavailable"
              ? "indisponivel"
              : availabilityStatus === "error"
                ? "nao foi possivel verificar"
                : "disponivel"}
        </Text>
      ) : null}
    </View>
  );
};
