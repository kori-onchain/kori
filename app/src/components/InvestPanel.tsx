import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { useTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/tokens";
import { useFadeUp } from "../hooks/useFadeUp";
import { InvestmentsPanel } from "./InvestmentsPanel";
import { ExperiencesPanel } from "./ExperiencesPanel";

type SubView = "portfolio" | "experiencias";

const TabStrip: React.FC<{
  view: SubView;
  onChange: (v: SubView) => void;
}> = ({ view, onChange }) => {
  const { t } = useTheme();
  const tabs: { id: SubView; label: string }[] = [
    { id: "portfolio", label: "Portfólio" },
    { id: "experiencias", label: "Experiências" },
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
                { backgroundColor: active ? t.orange : "transparent" },
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

interface InvestPanelProps {
  onOpenInvestModal?: () => void;
}

export const InvestPanel: React.FC<InvestPanelProps> = ({ onOpenInvestModal }) => {
  const { t } = useTheme();
  const [view, setView] = useState<SubView>("portfolio");
  const entering = useFadeUp();

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <Animated.View entering={entering(60)}>
        <TabStrip view={view} onChange={setView} />
      </Animated.View>
      <View style={{ flex: 1 }}>
        {view === "portfolio" ? <InvestmentsPanel onOpenPool={onOpenInvestModal} /> : <ExperiencesPanel />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
