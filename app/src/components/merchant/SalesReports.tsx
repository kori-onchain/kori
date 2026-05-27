import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@theme/ThemeProvider";
import { fonts, radii } from "@theme/tokens";
import { RevenueCard } from "@components/merchant/dashboard/RevenueCard";
import { CashFlowCard } from "@components/merchant/dashboard/CashFlowCard";
import { BusinessHealthCard } from "@components/merchant/dashboard/BusinessHealthCard";
import { TopSellingList } from "@components/merchant/dashboard/TopSellingList";
import { topSellingItems } from "@/data/merchant";

type Period = "hoje" | "7d" | "30d";

const PERIOD_LABELS: Record<Period, string> = {
  hoje: "Hoje",
  "7d": "7 dias",
  "30d": "30 dias",
};

// === DASHBOARD DATA (swap with real values when wiring backend) =============
const REVENUE = {
  hoje: {
    label: "R$ 1.424,80",
    delta: "+12% vs ontem",
    trend: [10, 14, 12, 18, 17, 22, 24],
    stats: [
      { label: "Vendas", value: "4" },
      { label: "Ticket médio", value: "R$ 356" },
      { label: "Conversão", value: "2,8%" },
    ],
  },
  "7d": {
    label: "R$ 8.102,50",
    delta: "+5% vs semana anterior",
    trend: [22, 28, 24, 32, 30, 38, 42],
    stats: [
      { label: "Vendas", value: "14" },
      { label: "Ticket médio", value: "R$ 578" },
      { label: "Conversão", value: "3,2%" },
    ],
  },
  "30d": {
    label: "R$ 32.150,00",
    delta: "+8% vs mês anterior",
    trend: [120, 150, 140, 175, 160, 200, 220],
    stats: [
      { label: "Vendas", value: "120" },
      { label: "Ticket médio", value: "R$ 268" },
      { label: "Conversão", value: "3,5%" },
    ],
  },
};

const CASH_FLOW = {
  amountLabel: "R$ 3.200,00",
  nextEntryText: "próx. entrada em 12 dias",
};

const HEALTH = {
  score: 782,
  scoreMax: 900,
  fillPct: 78,
  level: "BOM",
  trending: "subindo",
  discountedRatePct: 3,
  baseRatePct: 8,
};
// ===========================================================================

export const SalesReports: React.FC = () => {
  const { t } = useTheme();
  const [period, setPeriod] = useState<Period>("7d");
  const data = REVENUE[period];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: t.ink }]}>Relatórios</Text>
        <View style={styles.segment}>
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => {
            const active = period === p;
            return (
              <TouchableOpacity
                key={p}
                activeOpacity={0.8}
                onPress={() => setPeriod(p)}
                style={[
                  styles.segBtn,
                  active && {
                    backgroundColor: t.bgElev,
                    borderColor: t.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.segText,
                    { color: active ? t.orange : t.inkMute },
                  ]}
                >
                  {PERIOD_LABELS[p]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <RevenueCard
        revenueLabel={data.label}
        delta={data.delta}
        trend={data.trend}
        stats={data.stats}
      />

      <CashFlowCard
        amountLabel={CASH_FLOW.amountLabel}
        nextEntryText={CASH_FLOW.nextEntryText}
      />

      <BusinessHealthCard
        score={HEALTH.score}
        scoreMax={HEALTH.scoreMax}
        fillPct={HEALTH.fillPct}
        level={HEALTH.level}
        trending={HEALTH.trending}
        discountedRatePct={HEALTH.discountedRatePct}
        baseRatePct={HEALTH.baseRatePct}
      />

      <View style={styles.listGap} />

      <TopSellingList items={topSellingItems} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.sans.semibold,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  segment: {
    flexDirection: "row",
    gap: 4,
  },
  segBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "transparent",
  },
  segText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 11,
    letterSpacing: 0.1,
  },
  listGap: {
    height: 6,
  },
});
