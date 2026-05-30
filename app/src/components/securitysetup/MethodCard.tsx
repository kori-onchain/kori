import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@/icons";
import { SoftCard } from "@components/layout/SoftCard";
import { radii } from "@theme/tokens";
import { SecurityMethod } from "@hooks/useSecuritySetupLogic";

interface MethodCardProps {
  method: SecurityMethod;
  selectedMethod: SecurityMethod;
  title: string;
  desc: string;
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  onSelect: (method: SecurityMethod) => void;
  theme: any;
}

export const MethodCard: React.FC<MethodCardProps> = ({
  method,
  selectedMethod,
  title,
  desc,
  iconName,
  onSelect,
  theme,
}) => {
  const selected = selectedMethod === method;

  return (
    <TouchableOpacity onPress={() => onSelect(method)} activeOpacity={0.82}>
      <SoftCard
        radius={radii.card}
        padding={0}
        flat={!selected}
        style={[
          styles.methodCardShell,
          { borderColor: selected ? theme.orange : theme.cardBorder },
        ]}
      >
        <View style={styles.methodCard}>
          <SoftCard
            radius={radii.cardSm}
            padding={0}
            flat
            style={[
              styles.cardIconBox,
              selected && {
                backgroundColor: "rgba(255,107,61,0.14)",
                borderColor: theme.orange,
              },
            ]}
          >
            <View style={styles.cardIconBoxInner}>
              <Ionicons
                name={iconName}
                size={24}
                color={selected ? theme.orange : theme.ink}
              />
            </View>
          </SoftCard>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: theme.ink }]}>
              {title}
            </Text>
            <Text style={[styles.cardDesc, { color: theme.inkMute }]}>
              {desc}
            </Text>
          </View>
          <View
            style={[
              styles.radioOutline,
              { borderColor: selected ? theme.orange : theme.line2 },
            ]}
          >
            {selected && (
              <View
                style={[styles.radioDot, { backgroundColor: theme.orange }]}
              />
            )}
          </View>
        </View>
      </SoftCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  methodCardShell: {
    borderWidth: 1,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  cardIconBox: {
    width: 46,
    height: 46,
  },
  cardIconBoxInner: {
    width: 46,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Geist_600SemiBold",
  },
  cardDesc: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
    marginTop: 3,
    lineHeight: 14,
  },
  radioOutline: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
