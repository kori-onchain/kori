import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Polyline } from "react-native-svg";
import { fonts, radii } from "../../../theme/tokens";
import { useTheme } from "../../../theme/ThemeProvider";
import { SoftCard } from "../../ds/SoftCard";

export interface RevenueCardProps {
  revenueLabel: string;
  delta: string;
  trend: number[];
  stats: {
    label: string;
    value: string;
  }[];
}

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { t } = useTheme();
  return (
    <View style={styles.stat}>
      <Text style={[styles.statLabel, { color: t.inkMute }]}>{label}</Text>
      <Text style={[styles.statValue, { color: t.ink }]}>{value}</Text>
    </View>
  );
};

const TrendLine: React.FC<{ data: number[] }> = ({ data }) => {
  const { t } = useTheme();

  const W = 100;
  const H = 40;
  const padX = 0;
  const padY = 4;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = padX + ((W - padX * 2) * i) / (data.length - 1);
      const y = padY + (H - padY * 2) * (1 - (v - min) / range);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <Svg height={48} width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <Polyline
        points={points}
        fill="none"
        stroke={t.green}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </Svg>
  );
};

export const RevenueCard: React.FC<RevenueCardProps> = ({
  revenueLabel,
  delta,
  trend,
  stats,
}) => {
  const { t } = useTheme();

  return (
    <SoftCard radius={radii.card} padding={20} style={styles.card}>
      <Text style={[styles.label, { color: t.inkMute }]}>FATURAMENTO</Text>
      <Text style={[styles.amount, { color: t.ink }]}>{revenueLabel}</Text>
      <Text style={[styles.delta, { color: t.green }]}>{delta}</Text>

      <View style={styles.chartWrap}>
        <TrendLine data={trend} />
      </View>

      <View style={[styles.divider, { backgroundColor: t.line }]} />

      <View style={styles.statsRow}>
        {stats.map((s, i) => (
          <React.Fragment key={s.label}>
            <Stat label={s.label} value={s.value} />
            {i < stats.length - 1 && (
              <View
                style={[styles.vDivider, { backgroundColor: t.line2 }]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </SoftCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  label: {
    fontFamily: fonts.mono.semibold,
    fontSize: 9,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  amount: {
    fontFamily: fonts.sans.bold,
    fontSize: 38,
    letterSpacing: -1.2,
    lineHeight: 42,
  },
  delta: {
    fontFamily: fonts.mono.semibold,
    fontSize: 11,
    letterSpacing: 0.2,
    marginTop: 6,
  },
  chartWrap: {
    marginTop: 14,
    marginHorizontal: -4,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  stat: {
    flex: 1,
    alignItems: "flex-start",
    gap: 4,
  },
  statLabel: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  statValue: {
    fontFamily: fonts.sans.semibold,
    fontSize: 15,
    letterSpacing: -0.2,
  },
  vDivider: {
    width: 1,
    alignSelf: "stretch",
    marginHorizontal: 12,
  },
});
