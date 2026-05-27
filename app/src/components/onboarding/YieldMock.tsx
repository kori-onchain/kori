import React from "react";
import { View, Text } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Path,
  Stop,
} from "react-native-svg";
import { SoftCard } from "@components/layout/SoftCard";
import { radii } from "@theme/tokens";

interface YieldMockProps {
  data: {
    eyebrow: string;
    amount: string;
    apyText: string;
    todayLabel: string;
    todayValue: string;
    monthLabel: string;
    monthValue: string;
    liquidityLabel: string;
    liquidityValue: string;
  };
}

export const YieldMock: React.FC<YieldMockProps> = ({ data }) => (
  <View className="w-full">
    <SoftCard radius={radii.card} padding={18} strong style={{ width: "100%" }}>
      <Text className="font-mono text-[9px] uppercase tracking-[1.35px] text-ink-mute">
        {data.eyebrow}
      </Text>
      <Text className="mt-1 font-sans-bold text-[28px] tracking-[-0.8px] text-ink">
        {data.amount}
      </Text>
      <Text className="mt-0.5 font-mono-medium text-[11px] text-green">
        {data.apyText}
      </Text>

      <View className="mt-3.5 h-20">
        <Svg
          width="100%"
          height={80}
          viewBox="0 0 260 80"
          preserveAspectRatio="none"
        >
          <Defs>
            <SvgGradient id="yieldGradient" x1="0" x2="0" y1="0" y2="1">
              <Stop offset="0%" stopColor="#4ade80" stopOpacity={0.35} />
              <Stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
            </SvgGradient>
          </Defs>
          <Path
            d="M0 64 Q30 60 55 54 T110 42 T165 28 T215 16 T260 6"
            stroke="#4ade80"
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M0 64 Q30 60 55 54 T110 42 T165 28 T215 16 T260 6 L260 80 L0 80 Z"
            fill="url(#yieldGradient)"
          />
          <Circle cx={260} cy={6} r={4} fill="#4ade80" />
        </Svg>
      </View>

      <View className="mt-3 flex-row justify-between border-t border-line pt-3">
        <View>
          <Text className="font-mono text-[8px] uppercase text-ink-mute">
            {data.todayLabel}
          </Text>
          <Text className="mt-0.5 font-sans-bold text-[14px] text-green">
            {data.todayValue}
          </Text>
        </View>

        <View>
          <Text className="font-mono text-[8px] uppercase text-ink-mute">
            {data.monthLabel}
          </Text>
          <Text className="mt-0.5 font-sans-bold text-[14px] text-green">
            {data.monthValue}
          </Text>
        </View>

        <View>
          <Text className="font-mono text-[8px] uppercase text-ink-mute">
            {data.liquidityLabel}
          </Text>
          <Text className="mt-0.5 font-sans-bold text-[14px] text-ink">
            {data.liquidityValue}
          </Text>
        </View>
      </View>
    </SoftCard>
  </View>
);
