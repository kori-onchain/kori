import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTheme } from "@theme/ThemeProvider";
import { fonts, radii } from "@theme/tokens";
import { Feather } from "@/icons";
import { SoftCard } from "@/components/layout/SoftCard";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { topSellingItems } from "@/data/merchant";

type FilterType = "hoje" | "7d" | "30d";

export const SalesReports: React.FC = () => {
  const { t } = useTheme();
  const [filter, setFilter] = useState<FilterType>("7d");

  // Simulated data based on filter
  const getSalesData = () => {
    switch (filter) {
      case "hoje":
        return {
          revenue: "1.424,80",
          orders: 4,
          growth: "+12% vs ontem",
          pending: "850,00",
        };
      case "30d":
        return {
          revenue: "32.150,00",
          orders: 120,
          growth: "+8% vs mês ant.",
          pending: "12.400,00",
        };
      case "7d":
      default:
        return {
          revenue: "8.102,50",
          orders: 14,
          growth: "+5% vs sem. ant.",
          pending: "3.200,00",
        };
    }
  };

  const data = getSalesData();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: t.ink }]}>Relatórios</Text>
        <View style={[styles.filters, { backgroundColor: t.bg2 }]}>
          {(["hoje", "7d", "30d"] as FilterType[]).map((f) => {
            const isActive = filter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterBtn,
                  isActive && { backgroundColor: t.bgElev },
                ]}
                onPress={() => setFilter(f)}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: isActive ? t.ink : t.inkMute },
                  ]}
                >
                  {f === "hoje" ? "Hoje" : f === "7d" ? "7 Dias" : "30 Dias"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.row}>
        {/* Main Revenue Card */}
        <SoftCard style={styles.card} padding={16}>
          <View style={styles.cardHeader}>
            <Text style={[styles.period, { color: t.inkDim }]}>
              Faturamento
            </Text>
            <Feather name="bar-chart-2" size={16} color={t.orange} />
          </View>
          <Text style={[styles.amount, { color: t.ink }]}>
            R$ {data.revenue}
          </Text>
          <Text style={[styles.subtitle, { color: t.green }]}>
            {data.growth}
          </Text>

          <View style={styles.chartContainer}>
            <Svg height="40" width="100%" viewBox="0 0 100 40">
              <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={t.orange} stopOpacity="0.3" />
                  <Stop offset="1" stopColor={t.orange} stopOpacity="0.0" />
                </LinearGradient>
              </Defs>
              <Path
                d="M0,40 L0,30 C20,10 30,35 50,20 C70,5 80,25 100,5 L100,40 Z"
                fill="url(#grad)"
              />
              <Path
                d="M0,30 C20,10 30,35 50,20 C70,5 80,25 100,5"
                fill="none"
                stroke={t.orange}
                strokeWidth="2"
              />
            </Svg>
          </View>
        </SoftCard>
      </View>

      <View style={styles.row}>
        {/* Orders */}
        <SoftCard style={styles.halfCard} padding={16}>
          <View style={styles.cardHeader}>
            <Text style={[styles.period, { color: t.inkDim }]}>Pedidos</Text>
            <Feather name="shopping-bag" size={16} color={t.inkDim} />
          </View>
          <Text style={[styles.amountSmall, { color: t.ink }]}>
            {data.orders}
          </Text>
        </SoftCard>

        {/* Pending Balance */}
        <SoftCard style={styles.halfCard} padding={16}>
          <View style={styles.cardHeader}>
            <Text style={[styles.period, { color: t.inkDim }]}>A Receber</Text>
            <Feather name="clock" size={16} color={t.inkDim} />
          </View>
          <Text style={[styles.amountSmall, { color: t.ink }]}>
            R$ {data.pending}
          </Text>
        </SoftCard>
      </View>

      <Text style={[styles.sectionTitle, { color: t.ink }]}>
        Itens Mais Vendidos
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topItemsScroll}
      >
        {topSellingItems.map((item, index) => (
          <SoftCard key={item.id} style={styles.topItemCard} padding={0}>
            <View style={styles.topItemImageContainer}>
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.topItemImage}
                />
              ) : (
                <View
                  style={[styles.topItemImage, { backgroundColor: t.artBg }]}
                />
              )}
              <View style={[styles.rankBadge, { backgroundColor: t.ink }]}>
                <Text style={[styles.rankText, { color: t.bg }]}>
                  #{index + 1}
                </Text>
              </View>
            </View>
            <View style={styles.topItemInfo}>
              <Text
                style={[styles.topItemName, { color: t.ink }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text style={[styles.topItemAmount, { color: t.inkDim }]}>
                {item.amount} vendas
              </Text>
              <Text style={[styles.topItemRevenue, { color: t.green }]}>
                R$ {item.revenue.toFixed(2).replace(".", ",")}
              </Text>
            </View>
          </SoftCard>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
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
  },
  filters: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 2,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  filterText: {
    fontFamily: fonts.sans.medium,
    fontSize: 11,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    overflow: "hidden",
  },
  halfCard: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  period: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
  },
  amount: {
    fontFamily: fonts.sans.bold,
    fontSize: 22,
    marginBottom: 4,
  },
  amountSmall: {
    fontFamily: fonts.sans.bold,
    fontSize: 16,
    marginTop: 4,
  },
  subtitle: {
    fontFamily: fonts.sans.medium,
    fontSize: 11,
  },
  chartContainer: {
    marginTop: 12,
    marginHorizontal: -16,
    marginBottom: -16,
  },
  sectionTitle: {
    fontFamily: fonts.sans.semibold,
    fontSize: 15,
    marginTop: 12,
    marginBottom: 12,
  },
  topItemsScroll: {
    gap: 12,
    paddingRight: 20,
  },
  topItemCard: {
    width: 140,
    overflow: "hidden",
  },
  topItemImageContainer: {
    height: 100,
    position: "relative",
  },
  topItemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  rankBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rankText: {
    fontFamily: fonts.sans.bold,
    fontSize: 10,
  },
  topItemInfo: {
    padding: 12,
  },
  topItemName: {
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    marginBottom: 4,
  },
  topItemAmount: {
    fontFamily: fonts.sans.regular,
    fontSize: 11,
    marginBottom: 4,
  },
  topItemRevenue: {
    fontFamily: fonts.sans.bold,
    fontSize: 13,
  },
});
