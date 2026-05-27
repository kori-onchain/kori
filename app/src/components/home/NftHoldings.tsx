import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { fonts } from "@theme/tokens";
import { useTheme } from "@theme/ThemeProvider";
import { NftPill, NftPillType } from "@components/ui/NftPill";

type NftKind = "kori" | "ticket" | "badge" | "yield";

interface NftItem {
  id: string;
  category: string;
  name: string;
  kind: NftKind;
  type?: NftPillType;
}

const HOLDINGS: NftItem[] = [
  {
    id: "founder-0271",
    category: "Founder",
    name: "Kori Founder #0271",
    kind: "kori",
    type: "founder",
  },
  {
    id: "kyc-pass",
    category: "Badge",
    name: "KYC Pass",
    kind: "badge",
    type: "default",
  },
  {
    id: "verified-human",
    category: "Identity",
    name: "Verified Human",
    kind: "badge",
    type: "human",
  },
  {
    id: "prime-payer",
    category: "Score",
    name: "Prime Payer",
    kind: "badge",
    type: "gold_payer",
  },
  {
    id: "default-degen",
    category: "Delinquent",
    name: "Default Degen",
    kind: "badge",
    type: "debt_degen",
  },
  {
    id: "yield-legend",
    category: "Investor",
    name: "Yield Legend",
    kind: "yield",
    type: "yield",
  },
];

interface NftHoldingsProps {
  onSeeAll?: () => void;
}

export const NftHoldings: React.FC<NftHoldingsProps> = ({ onSeeAll }) => {
  const { t } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: t.inkMute }]}>
          EMBLEMAS
        </Text>
        <View style={styles.seeMoreButton}>
          <Text style={[styles.seeMore, { color: t.inkMute }]}>
            {HOLDINGS.length} ativos
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroller}
        contentContainerStyle={styles.pillsRow}
        bounces={true}
        alwaysBounceHorizontal={true}
      >
        {HOLDINGS.map((item) => (
          <NftPill
            key={item.id}
            name={item.name}
            category={item.category}
            type={item.type}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: fonts.mono.medium,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  seeMoreButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeMore: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
  },
  seeMoreArrow: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
  },
  scroller: {
    marginHorizontal: -20,
  },
  pillsRow: {
    gap: 8,
    paddingHorizontal: 20,
  },
});
