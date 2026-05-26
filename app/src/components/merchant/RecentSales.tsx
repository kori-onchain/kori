import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { fonts, radii } from "../../theme/tokens";
import { useTheme } from "../../theme/ThemeProvider";
import { mockSales, Sale } from "../../data/merchant";
import { SoftCard } from "../ds/SoftCard";

interface RecentSalesProps {
  onSeeAll?: () => void;
}

const Row: React.FC<{ item: Sale; isLast: boolean }> = ({ item, isLast }) => {
  const { t } = useTheme();

  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: t.line },
        isLast && styles.rowLast,
      ]}
    >
      <View style={styles.info}>
        <View style={styles.iconWrap}>
          <SoftCard radius={8} padding={0} flat>
            <View style={[styles.iconInner, { backgroundColor: t.artBg }]}>
              <Text style={[styles.rowInitials, { color: t.ink }]}>
                {item.buyerName.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          </SoftCard>
        </View>

        <View style={styles.text}>
          <Text style={[styles.title, { color: t.ink }]} numberOfLines={1}>
            {item.buyerName}
          </Text>
          <Text style={[styles.sub, { color: t.inkMute }]} numberOfLines={1}>
            {item.items.length} {item.items.length === 1 ? "item" : "itens"}
          </Text>
        </View>
      </View>

      <View style={styles.amounts}>
        <Text style={[styles.amount, { color: t.green }]}>
          + R$ {item.amount.toFixed(2).replace(".", ",")}
        </Text>
        <Text style={[styles.subAmount, { color: t.inkMute }]}>Pix</Text>
      </View>
    </View>
  );
};

export const RecentSales: React.FC<RecentSalesProps> = ({ onSeeAll }) => {
  const { t } = useTheme();
  const items = mockSales;

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: t.inkMute }]}>
          VENDAS RECENTES
        </Text>
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={[styles.seeMoreText, { color: t.inkMute }]}>
            Ver tudo{" "}
            <Text style={[styles.seeMoreArrow, { color: t.orange }]}>→</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {items.map((item, i) => (
        <Row key={item.id} item={item} isLast={i === items.length - 1} />
      ))}
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
    marginBottom: 6,
  },
  sectionTitle: {
    fontFamily: fonts.mono.medium,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  seeMoreText: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  seeMoreArrow: {
    fontFamily: fonts.mono.semibold,
    fontSize: 11,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
  },
  iconInner: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.cardSm,
  },
  rowInitials: {
    fontFamily: fonts.sans.semibold,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
  },
  sub: {
    fontFamily: fonts.mono.regular,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  amounts: {
    alignItems: "flex-end",
    gap: 2,
  },
  amount: {
    fontFamily: fonts.mono.semibold,
    fontSize: 12,
    letterSpacing: 0.2,
  },
  subAmount: {
    fontFamily: fonts.mono.regular,
    fontSize: 9,
    letterSpacing: 0.3,
  },
});
