import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@theme/ThemeProvider";
import { EarningSummary } from "./EarningSummary";
import { EarningItemsList } from "./EarningItemsList";
import { Opportunities } from "./Opportunities";
import { EvolutionChart } from "./EvolutionChart";
import { Categories } from "./Categories";

export const InvestmentsPanel: React.FC = () => {
  const { t } = useTheme();
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <ScrollView
      style={{ backgroundColor: t.bg }}
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: t.bg }]}
    >
      {/* 1. Header & Earning balance (Title, Balance, Segmented bar, Investir/Resgatar buttons) */}
      <View style={{ paddingHorizontal: 20 }}>
        <EarningSummary />
      </View>

      {/* 2. Full-bleed Rentabilidade Chart positioned directly under the buttons */}
      <EvolutionChart setScrollEnabled={setScrollEnabled} />

      {/* 3. Detail list of items (Staking, Lending, Cash) and Opportunities banner */}
      <View style={{ paddingHorizontal: 20 }}>
        <EarningItemsList />
        <Opportunities />
        <Categories />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
});

export default InvestmentsPanel;
