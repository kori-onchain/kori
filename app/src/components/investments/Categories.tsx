import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";
import { Feather } from "@/icons";
import { useTheme } from "@theme/ThemeProvider";
import { fonts, radii } from "@theme/tokens";

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_W = (SCREEN_W - 40 - 12) / 2;

type CategoryItem = {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  isNew?: boolean;
  isSoon?: boolean;
};

export const Categories: React.FC = () => {
  const { t } = useTheme();

  const rwaCategories: CategoryItem[] = [
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
      icon: "sliders" as const,
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

  const onchainCategories: CategoryItem[] = [
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
      <Text style={[styles.groupTitle, { color: t.inkDim, marginBottom: 12 }]}>Real World Assets (RWA)</Text>
      <View style={[styles.grid, { marginBottom: 10}]}>
        {rwaCategories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.8}
            style={[
              styles.card,
              { backgroundColor: t.bg2 },
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

      <View style={styles.poweredByContainer}>
        <Text style={[styles.poweredByText, { color: t.inkMute }]}>Provided by</Text>
        <Image 
          source={{ uri: "https://s2-valor.glbimg.com/hrZt4aAlAMl4RE03s6jUUdyOXJc=/0x0:1000x1000/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_63b422c2caee4269b8b34177e8876b93/internal_photos/bs/2023/n/8/rplZzsT3SKnpUMeZzxNw/liqi.png" }} 
          style={styles.liqiLogo} 
          resizeMode="contain"
        />
        <Text style={[styles.logoDot, { color: t.ink }]}>|</Text>
        <Image 
          source={{ uri: "https://www.drivewealth.com/wp-content/uploads/2024/03/drivewealth-favicon-1-150x150.png" }} 
          style={styles.dwLogo} 
          resizeMode="contain"
        />
      </View>

      {/* Group 2: On-Chain */}
      <View style={[styles.groupHeaderRow]}>
        <Text style={[styles.groupTitle, { color: t.inkDim }]}>On-Chain</Text>
      </View>
      <View style={styles.grid}>
        {onchainCategories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.8}
            style={[
              styles.card,
              { backgroundColor: t.bg2 },
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
  groupHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  groupTitle: {
    fontFamily: fonts.sans.bold,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  poweredByContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 8,
    gap: 10,
  },
  liqiLogo: {
    width: 46,
    height: 42,
  },
  dwLogo: {
    width: 18,
    height: 18,
  },
  poweredByText: {
    fontFamily: fonts.sans.medium,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  logoDot: {
    fontSize: 12,
    fontWeight: "900",
    opacity: 0.5
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
