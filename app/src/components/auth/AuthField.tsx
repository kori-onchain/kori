import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { ChevronDownIcon } from "@components/layout/icons";

type AuthFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  focused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  prefix?: string;
  select?: boolean;
  showAvailable?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
};

export const AuthField: React.FC<AuthFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  focused = false,
  onFocus,
  onBlur,
  prefix,
  select = false,
  showAvailable = false,
  keyboardType = "default",
}) => (
  <View className="w-full">
    <Text className="mb-1.5 font-mono-medium text-[9px] uppercase tracking-[1.1px] text-ink-mute">
      {label}
    </Text>
    <View
      className={[
        "min-h-[50px] flex-row items-center overflow-hidden rounded-[12px] border bg-bg-2 px-3.5",
        focused ? "border-line2" : "border-line",
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
        editable={!select}
        autoCapitalize={
          prefix || keyboardType === "email-address" ? "none" : "words"
        }
        autoCorrect={false}
      />
      {select ? <ChevronDownIcon size={14} color="#5a5a5e" /> : null}
    </View>
    {showAvailable ? (
      <Text className="mt-1.5 font-mono-medium text-[9px] text-green">
        disponível
      </Text>
    ) : null}
  </View>
);
