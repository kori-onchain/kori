import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGrad,
  Stop,
  Circle,
  Line,
} from "react-native-svg";
import { fonts, radii } from "@theme/tokens";
import { useTheme } from "@theme/ThemeProvider";

const { width: SCREEN_W } = Dimensions.get("window");
const CHART_H = 140;

interface EvolutionChartProps {
  setScrollEnabled?: (enabled: boolean) => void;
}

export const EvolutionChart: React.FC<EvolutionChartProps> = ({
  setScrollEnabled,
}) => {
  const { t } = useTheme();

  // Pinch-to-zoom state
  const [zoomScale, setZoomScale] = useState(1);
  const [initialDist, setInitialDist] = useState(0);
  const [baseScale, setBaseScale] = useState(1);

  const calcDistance = (touches: any[]) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: any) => {
    const touches = e.nativeEvent.touches;
    if (touches.length === 2) {
      if (setScrollEnabled) setScrollEnabled(false); // Disable parent scroll to avoid interference
      const dist = calcDistance(touches);
      setInitialDist(dist);
      setBaseScale(zoomScale);
    }
  };

  const handleTouchMove = (e: any) => {
    const touches = e.nativeEvent.touches;
    if (touches.length === 2 && initialDist > 0) {
      const dist = calcDistance(touches);
      const scale = (dist / initialDist) * baseScale;
      // Allow zooming between 1x and 4x
      setZoomScale(Math.max(1, Math.min(scale, 4)));
    }
  };

  const handleTouchEnd = () => {
    if (setScrollEnabled) setScrollEnabled(true); // Re-enable parent scroll
    setInitialDist(0);
  };

  // Straight line coordinates scaled by zoom factor
  const points = [
    { x: 0, y: 110 },
    { x: SCREEN_W * 0.15 * zoomScale, y: 110 },
    { x: SCREEN_W * 0.3 * zoomScale, y: 98 },
    { x: SCREEN_W * 0.48 * zoomScale, y: 84 },
    { x: SCREEN_W * 0.68 * zoomScale, y: 44 },
    { x: SCREEN_W * 0.85 * zoomScale, y: 32 },
    { x: SCREEN_W * zoomScale, y: 15 },
  ];

  // Draw straight segmented lines (as requested: "linhas mais retas, do que onduladas")
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    linePath += ` L ${points[i].x} ${points[i].y}`;
  }

  // Draw the straight area fill under the curve
  const areaPath = `${linePath} L ${SCREEN_W * zoomScale} ${CHART_H} L 0 ${CHART_H} Z`;

  // Dashed blue CDI line coordinates
  const dashedLine = {
    x1: 0,
    y1: 100,
    x2: SCREEN_W * zoomScale,
    y2: 48,
  };

  const labels = [
    { text: "ago/23" },
    { text: "nov/23" },
    { text: "fev/24" },
    { text: "mai/24" },
    { text: "ago/24" },
  ];

  const dotX = SCREEN_W * zoomScale - 20;

  return (
    <View style={styles.container}>
      {/* Header (Aligned with screen padding) */}
      <View style={styles.textHeader}>
        <Text style={[styles.title, { color: t.inkDim }]}>
          Rentabilidade • Últimos 12 meses
        </Text>

        <View style={styles.statsRow}>
          {/* Visible profit in Reais (as requested: "valor em reais do lucro") */}
          <Text style={[styles.balanceText, { color: t.ink }]}>R$ 3.004,80</Text>

          {/* Green Profit rate */}
          <View style={styles.rateWrapper}>
            <Text style={[styles.rateText, { color: t.green }]}>▲ 15,00 %</Text>
          </View>

          {/* CDI Pill */}
          <View style={[styles.cdiPill, { backgroundColor: `${t.sol || "#9945ff"}12`, borderColor: `${t.sol || "#9945ff"}22` }]}>
            <View style={[styles.cdiDot, { backgroundColor: t.sol || "#9945ff" }]} />
            <Text style={[styles.cdiText, { color: t.sol || "#9945ff" }]}>198% CDI</Text>
          </View>
        </View>
      </View>

      {/* Chart Canvas (Edge-to-Edge bleed & Pinch-to-Zoom enabled) */}
      <View
        style={styles.chartContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={zoomScale > 1}
          contentContainerStyle={{ width: SCREEN_W * zoomScale }}
        >
          <View style={{ width: SCREEN_W * zoomScale, height: CHART_H + 30 }}>
            {/* SVG graph */}
            <Svg width={SCREEN_W * zoomScale} height={CHART_H}>
              <Defs>
                <SvgGrad id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#A8A8A8" stopOpacity={0.35} />
                  <Stop offset="100%" stopColor="#A8A8A8" stopOpacity={0.02} />
                </SvgGrad>
              </Defs>

              {/* Horizontal division baseline */}
              <Line
                x1="0"
                y1={CHART_H - 1}
                x2={SCREEN_W * zoomScale}
                y2={CHART_H - 1}
                stroke={t.line}
                strokeWidth="1.5"
              />

              {/* Guidelines on the far right */}
              <Line
                x1={dotX}
                y1="15"
                x2={dotX}
                y2={CHART_H}
                stroke={t.line}
                strokeWidth="1"
                strokeDasharray="2 2"
              />

              {/* Benchmark CDI dashed line (dashed blue/purple) */}
              <Line
                x1={dashedLine.x1}
                y1={dashedLine.y1}
                x2={dashedLine.x2}
                y2={dashedLine.y2}
                stroke={t.sol || "#9945ff"}
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.85"
              />

              {/* Area Fill */}
              <Path d={areaPath} fill="url(#chartAreaGrad)" />

              {/* Main Solid Line (Straight Segments as requested) */}
              <Path
                d={linePath}
                stroke={t.ink}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Endpoint highlight dot */}
              <Circle
                cx={dotX}
                cy={15}
                r="4.5"
                fill={t.ink}
                stroke={t.bg}
                strokeWidth="1.5"
              />
            </Svg>

            {/* X-Axis labels inside the horizontal scrollable area */}
            <View style={[styles.labelsRow, { width: SCREEN_W * zoomScale }]}>
              {labels.map((lbl, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.labelContainer,
                    idx === 0 && { alignItems: "flex-start" },
                    idx === labels.length - 1 && { alignItems: "flex-end" },
                  ]}
                >
                  <Text style={[styles.label, { color: t.inkDim }]}>{lbl.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  textHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    marginBottom: 8,
    textTransform: "capitalize",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  balanceText: {
    fontFamily: fonts.sans.bold,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  rateWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  rateText: {
    fontFamily: fonts.sans.bold,
    fontSize: 13,
  },
  cdiPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  cdiDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cdiText: {
    fontFamily: fonts.mono.semibold,
    fontSize: 10,
    letterSpacing: 0.2,
  },
  chartContainer: {
    height: CHART_H + 30,
    position: "relative",
    overflow: "hidden",
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 8,
  },
  labelContainer: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    fontFamily: fonts.mono.medium,
    fontSize: 11,
    letterSpacing: 0.2,
  },
});
export default EvolutionChart;
