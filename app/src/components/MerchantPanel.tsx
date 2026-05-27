import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/tokens";
import { useFadeUp } from "../hooks/useFadeUp";
import { SalesReports } from "./merchant/SalesReports";
import { EcommercePanel } from "./merchant/EcommercePanel";

type SubView = "dashboard" | "ecommerce";

const TabStrip: React.FC<{
  view: SubView;
  onChange: (v: SubView) => void;
}> = ({ view, onChange }) => {
  const { t } = useTheme();
  const tabs: { id: SubView; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "ecommerce", label: "Vitrine" },
  ];

  return (
    <View style={[styles.tabStrip, { borderBottomColor: t.line }]}>
      {tabs.map((tab) => {
        const active = view === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.7}
            onPress={() => onChange(tab.id)}
            style={styles.tabBtn}
          >
            <Text
              style={[
                styles.tabLabel,
                { color: active ? t.ink : t.inkMute },
              ]}
            >
              {tab.label}
            </Text>
            <View
              style={[
                styles.tabUnderline,
                {
                  backgroundColor: active ? t.orange : "transparent",
                },
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

interface MerchantPanelProps {
  onAnticipate?: () => void;
}

export const MerchantPanel: React.FC<MerchantPanelProps> = ({ onAnticipate }) => {
  const { t } = useTheme();
  const [view, setView] = useState<SubView>("dashboard");
  const entering = useFadeUp();

  if (view === "ecommerce") {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg }}>
        <Animated.View entering={entering(60)}>
          <TabStrip view={view} onChange={setView} />
        </Animated.View>
        <Animated.View entering={entering(140)} style={{ flex: 1 }}>
          <EcommercePanel />
        </Animated.View>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: t.bg }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: t.bg }]}
    >
      <Animated.View entering={entering(60)}>
        <TabStrip view={view} onChange={setView} />
      </Animated.View>
      <Animated.View entering={entering(140)}>
        <SalesReports onAnticipate={onAnticipate} />
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  tabStrip: {
    flexDirection: "row",
    gap: 24,
    borderBottomWidth: 1,
    marginBottom: 18,
  },
  tabBtn: {
    paddingTop: 4,
    paddingBottom: 0,
    alignItems: "center",
  },
  tabLabel: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    letterSpacing: 0.1,
    paddingBottom: 10,
  },
  tabUnderline: {
    height: 2,
    width: "100%",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
});
