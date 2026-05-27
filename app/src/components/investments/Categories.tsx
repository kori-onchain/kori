import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Feather } from "@/icons";
import { useTheme } from "@theme/ThemeProvider";
import { fonts, radii } from "@theme/tokens";

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_W = (SCREEN_W - 40 - 12) / 2;

export const Categories: React.FC = () => {
  const { t } = useTheme();

  const rwaCategories = [
    {
      id: "renda-fixa",
      title: "Renda Fixa",
      icon: "shield" as const,
    },
    {
      id: "fundos",
      title: "Fundos de Investimento",
      icon: "briefcase" as const,
    },
    {
      id: "tesouro-direto",
      title: "Tesouro direto",
      icon: "archive" as const,
    },
    {
      id: "acoes",
      title: "Ações",
      icon: "sliders" as const, // Bulletproof candlestick representation
      isSoon: true,
    },
    {
      id: "capitalizacao",
      title: "Capitalização",
      icon: "gift" as const,
    },
    {
      id: "factoring",
      title: "Factoring",
      icon: "file-text" as const,
    },
  ];

  const onchainCategories = [
    {
      id: "criptoativos",
      title: "Criptoativos",
      icon: "cpu" as const,
    },
    {
      id: "staking",
      title: "Staking",
      icon: "layers" as const,
    },
    {
      id: "shards",
      title: "Shards",
      icon: "share-2" as const,
      isNew: true,
    },
    {
      id: "mercados-preditivos",
      title: "Prediction Market",
      icon: "compass" as const,
      isSoon: true,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Title Header (Without "Mostrar todas") */}
      <Text style={[styles.sectionTitle, { color: t.ink }]}>Categorias</Text>

      {/* Group 1: RWA */}
      <Text style={[styles.groupTitle, { color: t.inkDim }]}>Real World Assets (RWA)</Text>
      <View style={styles.grid}>
        {rwaCategories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.8}
            style={[
              styles.card,
              { backgroundColor: t.bg2 || t.bgElev },
            ]}
          >
            <View style={styles.cardHeader}>
              <Feather name={cat.icon} size={22} color={t.ink} />
              {cat.isNew && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>Novo</Text>
                </View>
              )}
              {cat.isSoon && (
                <View style={styles.soonBadge}>
                  <Text style={styles.soonBadgeText}>Soon</Text>
                </View>
              )}
            </View>

            <Text style={[styles.cardTitle, { color: t.ink }]} numberOfLines={2}>
              {cat.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Group 2: On-Chain */}
      <Text style={[styles.groupTitle, { color: t.inkDim, marginTop: 12 }]}>On-Chain</Text>
      <View style={styles.grid}>
        {onchainCategories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.8}
            style={[
              styles.card,
              { backgroundColor: t.bg2 || t.bgElev },
            ]}
          >
            <View style={styles.cardHeader}>
              <Feather name={cat.icon} size={22} color={t.ink} />
              {cat.isNew && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>Novo</Text>
                </View>
              )}
              {cat.isSoon && (
                <View style={styles.soonBadge}>
                  <Text style={styles.soonBadgeText}>Soon</Text>
                </View>
              )}
            </View>

            <Text style={[styles.cardTitle, { color: t.ink }]} numberOfLines={2}>
              {cat.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: fonts.sans.bold,
    fontSize: 18,
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  groupTitle: {
    fontFamily: fonts.sans.bold,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  card: {
    width: CARD_W,
    borderRadius: 24,
    padding: 18,
    minHeight: 120,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  newBadge: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  newBadgeText: {
    fontFamily: fonts.sans.bold,
    fontSize: 9,
    color: "#FFFFFF",
  },
  soonBadge: {
    backgroundColor: "rgba(142, 142, 147, 0.18)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "rgba(142, 142, 147, 0.3)",
  },
  soonBadgeText: {
    fontFamily: fonts.sans.bold,
    fontSize: 9,
    color: "#8E8E93",
  },
  cardTitle: {
    fontFamily: fonts.sans.bold,
    fontSize: 13,
    letterSpacing: -0.2,
    marginTop: 12,
  },
});

export default Categories;
