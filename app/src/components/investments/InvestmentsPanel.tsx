import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Animated from "react-native-reanimated";
import { useTheme } from "@theme/ThemeProvider";
import { useFadeUp } from "@hooks/useFadeUp";
import { EarningSummary } from "./EarningSummary";
import { EarningItemsList } from "./EarningItemsList";
import { Opportunities } from "./Opportunities";
import { EvolutionChart } from "./EvolutionChart";
import { Categories } from "./Categories";

export const InvestmentsPanel: React.FC = () => {
  const { t } = useTheme();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const entering = useFadeUp();

  return (
    <ScrollView
      style={{ backgroundColor: t.bg }}
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: t.bg }]}
    >
      <Animated.View entering={entering(60)} style={{ paddingHorizontal: 20 }}>
        <EarningSummary />
      </Animated.View>

      <Animated.View entering={entering(120)}>
        <EvolutionChart setScrollEnabled={setScrollEnabled} />
      </Animated.View>

      <View style={{ paddingHorizontal: 20 }}>
        <Animated.View entering={entering(180)}>
          <EarningItemsList />
        </Animated.View>
        <Animated.View entering={entering(240)}>
          <Opportunities />
        </Animated.View>
        <Animated.View entering={entering(300)}>
          <Categories />
        </Animated.View>
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
