import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@/icons";
import { useTheme } from "@theme/ThemeProvider";
import { fonts } from "@theme/tokens";
import Svg, { Circle, G } from "react-native-svg";

export const EarningItemsList: React.FC = () => {
  const { t } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<string>("produto");

  const items = [
    {
      id: "renda-fixa",
      title: "Renda fixa (Bonds)",
      subtitle: "40%",
      value: "US$ 10.000,00",
      change: "▲ 10,00%",
      changeVal: 10.0,
      color: "#00A896", // Teal/cyan matching segment
    },
    {
      id: "fundos",
      title: "Fundos (Mutual Funds)",
      subtitle: "30%",
      value: "US$ 10.000,00",
      change: "▲ 9,50%",
      changeVal: 9.5,
      color: "#9945ff", // Purple matching segment
    },
    {
      id: "acoes",
      title: "Ações (Stocks)",
      subtitle: "15%",
      value: "US$ 10.000,00",
      change: "▲ 12,80%",
      changeVal: 12.8,
      color: "#FF8C00", // Orange matching segment
    },
    {
      id: "previdencia",
      title: "Previdência (Pension)",
      subtitle: "10%",
      value: "US$ 10.000,00",
      change: "▲ 7,20%",
      changeVal: 7.2,
      color: "#FF2D55", // Pink matching segment
    },
    {
      id: "cripto",
      title: "Cripto (Crypto)",
      subtitle: "5%",
      value: "US$ 10.000,00",
      change: "▲ 24,50%",
      changeVal: 24.5,
      color: "#007AFF", // Blue matching segment
    },
  ];

  const filterOptions = [
    { id: "produto", label: "Produto" },
    { id: "classe", label: "Classe" },
    { id: "liquidez", label: "Liquidez" },
    { id: "ativos", label: "Ativos" },
    { id: "objetivos", label: "Objetivos" },
    { id: "risco", label: "Risco" },
    { id: "maior-rentabilidade", label: "Maior rentabilidade" },
  ];

  // Segment calculation for Donut Chart
  const segments = [
    { percentage: 0.40, color: "#00A896" },
    { percentage: 0.30, color: "#9945ff" },
    { percentage: 0.15, color: "#FF8C00" },
    { percentage: 0.10, color: "#FF2D55" },
    { percentage: 0.05, color: "#007AFF" },
  ];

  const radius = 26;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius; // ~163.36
  let cumulativeCircumference = 0;

  // Smart dynamic filtering/sorting based on selected filter
  let filteredItems = [...items];

  if (selectedFilter === "maior-rentabilidade") {
    filteredItems.sort((a, b) => b.changeVal - a.changeVal);
  } else if (selectedFilter === "risco") {
    // Sort by risk profile (Cripto high, Renda Fixa low)
    const riskOrder = ["cripto", "acoes", "fundos", "previdencia", "renda-fixa"];
    filteredItems.sort((a, b) => riskOrder.indexOf(a.id) - riskOrder.indexOf(b.id));
  } else if (selectedFilter === "liquidez") {
    // Sort by typical liquidity duration (Renda Fixa/Cripto/Ações first)
    const liquidityOrder = ["renda-fixa", "cripto", "acoes", "fundos", "previdencia"];
    filteredItems.sort((a, b) => liquidityOrder.indexOf(a.id) - liquidityOrder.indexOf(b.id));
  }

  return (
    <View style={styles.card}>
      {/* Horizontal Scrollable Filters (Positioned above the chart and ignoring page padding) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
        style={styles.filtersScrollView}
      >
        {filterOptions.map((opt) => {
          const isActive = selectedFilter === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              activeOpacity={0.8}
              onPress={() => setSelectedFilter(opt.id)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? t.ink : t.bgElev,
                  borderColor: isActive ? t.ink : t.cardBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: isActive ? t.bg : t.inkDim },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Header Row with Segmented Chart & Total Invested Info */}
      <View style={styles.headerRow}>
        <View style={styles.chartWrapper}>
          <Svg width={64} height={64} viewBox="0 0 64 64">
            <G transform="rotate(-90 32 32)">
              {segments.map((seg, idx) => {
                const strokeLength = circumference * seg.percentage;
                // Subtract 3.5 units for a clean visible gap with rounded caps
                const gapLength = circumference - strokeLength;
                const offset = -cumulativeCircumference;
                cumulativeCircumference += strokeLength;

                return (
                  <Circle
                    key={idx}
                    cx={32}
                    cy={32}
                    r={radius}
                    stroke={seg.color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${strokeLength - 3.5} ${gapLength + 3.5}`}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                  />
                );
              })}
            </G>
          </Svg>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerSubtitle, { color: t.inkDim }]}>
            Total Investido • 5 produtos
          </Text>
          <Text style={[styles.headerTitle, { color: t.ink }]}>
            R$ 1.000.000,00
          </Text>
        </View>
      </View>

      {/* Detail list of items (Filtered) */}
      <View style={styles.itemsList}>
        {filteredItems.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.itemRow,
              { borderBottomColor: index === filteredItems.length - 1 ? "transparent" : t.line },
            ]}
          >
            {/* Left dot indicator */}
            <View style={[styles.dot, { backgroundColor: item.color }]} />

            {/* Middle left: Title & Percentage */}
            <View style={styles.itemLeftInfo}>
              <Text style={[styles.itemTitle, { color: t.ink }]}>{item.title}</Text>
              <Text style={[styles.itemSubtitle, { color: t.inkDim }]}>{item.subtitle}</Text>
            </View>

            {/* Middle right: Value & Positive yield change */}
            <View style={styles.itemRightInfo}>
              <Text style={[styles.itemValue, { color: t.ink }]}>{item.value}</Text>
              <Text style={[styles.itemChange, { color: t.green }]}>{item.change}</Text>
            </View>

            {/* Chevron Right */}
            <Feather name="chevron-right" size={16} color={t.inkDim} style={styles.chevron} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 6,
  },
  chartWrapper: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  headerSubtitle: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: fonts.sans.bold,
    fontSize: 22,
    letterSpacing: -0.5,
  },
  filtersScrollView: {
    marginHorizontal: -20,
    marginVertical: 10,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  filterText: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
  },
  itemsList: {
    marginTop: 4,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  itemLeftInfo: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
  },
  itemRightInfo: {
    alignItems: "flex-end",
    marginRight: 8,
  },
  itemValue: {
    fontFamily: fonts.sans.bold,
    fontSize: 14,
    marginBottom: 2,
  },
  itemChange: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
  },
  chevron: {
    marginLeft: 4,
  },
});

export default EarningItemsList;

