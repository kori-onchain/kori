import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { fonts, radii } from "@theme/tokens";
import { useTheme } from "@theme/ThemeProvider";
import { TopSellingItem } from "@/data/merchant";

export interface TopSellingListProps {
  items: TopSellingItem[];
  onSeeAll?: () => void;
}

const fmtBRL = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;
const fmtRank = (i: number) => String(i + 1).padStart(2, "0");

export const TopSellingList: React.FC<TopSellingListProps> = ({
  items,
  onSeeAll,
}) => {
  const { t } = useTheme();

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: t.ink }]}>
          Mais vendidos
        </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={onSeeAll}>
          <Text style={[styles.seeAll, { color: t.inkMute }]}>
            ver tudo{" "}
            <Text style={[styles.seeAllArrow, { color: t.inkMute }]}>→</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <View
              key={item.id}
              style={[
                styles.row,
                !isLast && {
                  borderBottomColor: t.line,
                  borderBottomWidth: 1,
                },
              ]}
            >
              <Text style={[styles.rank, { color: t.inkMute }]}>
                {fmtRank(i)}
              </Text>

              <View style={[styles.thumb, { backgroundColor: t.artBg }]}>
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.thumbImage}
                  />
                ) : null}
              </View>

              <View style={styles.info}>
                <Text
                  style={[styles.name, { color: t.ink }]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text style={[styles.sales, { color: t.inkMute }]}>
                  {item.amount} vendas
                </Text>
              </View>

              <Text style={[styles.revenue, { color: t.green }]}>
                {fmtBRL(item.revenue)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    letterSpacing: -0.1,
  },
  seeAll: {
    fontFamily: fonts.mono.medium,
    fontSize: 10,
    letterSpacing: 0.4,
  },
  seeAllArrow: {
    fontFamily: fonts.mono.semibold,
    fontSize: 11,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  rank: {
    fontFamily: fonts.mono.semibold,
    fontSize: 11,
    letterSpacing: 0.8,
    width: 22,
  },
  thumb: {
    width: 36,
    height: 36,
    borderRadius: radii.cardSm,
    overflow: "hidden",
  },
  thumbImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  info: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  name: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    letterSpacing: -0.1,
  },
  sales: {
    fontFamily: fonts.mono.regular,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  revenue: {
    fontFamily: fonts.mono.semibold,
    fontSize: 12,
    letterSpacing: 0.1,
  },
});
