import React from 'react';
import Svg, {
  Rect,
  Line,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from 'react-native-svg';

interface ChipEMVProps {
  width?: number;
  height?: number;
}

export const ChipEMV: React.FC<ChipEMVProps> = ({
  width = 46,
  height = 35,
}) => (
  <Svg width={width} height={height} viewBox="0 0 46 35">
    <Defs>
      <SvgGradient id="cg" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#d4d4d4" />
        <Stop offset="0.3" stopColor="#9a9a9a" />
        <Stop offset="0.55" stopColor="#c8c8c8" />
        <Stop offset="1" stopColor="#787878" />
      </SvgGradient>
      <SvgGradient id="ch" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#fff" stopOpacity={0.32} />
        <Stop offset="0.5" stopColor="#fff" stopOpacity={0.06} />
        <Stop offset="1" stopColor="#fff" stopOpacity={0} />
      </SvgGradient>
    </Defs>

    {/* Metallic body */}
    <Rect x={0} y={0} width={46} height={35} rx={5} fill="url(#cg)" />

    {/* ── Contact lines ── */}
    {/* Two horizontal dividers */}
    <Line x1={0} y1={12} x2={46} y2={12} stroke="rgba(0,0,0,0.28)" strokeWidth={0.8} />
    <Line x1={0} y1={23} x2={46} y2={23} stroke="rgba(0,0,0,0.28)" strokeWidth={0.8} />

    {/* Top-band verticals */}
    <Line x1={14} y1={0} x2={14} y2={12} stroke="rgba(0,0,0,0.28)" strokeWidth={0.8} />
    <Line x1={32} y1={0} x2={32} y2={12} stroke="rgba(0,0,0,0.28)" strokeWidth={0.8} />

    {/* Bottom-band verticals */}
    <Line x1={14} y1={23} x2={14} y2={35} stroke="rgba(0,0,0,0.28)" strokeWidth={0.8} />
    <Line x1={32} y1={23} x2={32} y2={35} stroke="rgba(0,0,0,0.28)" strokeWidth={0.8} />

    {/* Center pad + mid-line */}
    <Rect
      x={10} y={13} width={26} height={9}
      rx={1.5}
      fill="none"
      stroke="rgba(0,0,0,0.28)"
      strokeWidth={0.8}
    />
    <Line x1={10} y1={17.5} x2={36} y2={17.5} stroke="rgba(0,0,0,0.28)" strokeWidth={0.8} />

    {/* Left notch (common on real chips) */}
    <Rect x={0} y={14} width={3} height={7} rx={1} fill="rgba(0,0,0,0.12)" />

    {/* Specular highlight — top half */}
    <Rect x={0} y={0} width={46} height={17} rx={5} fill="url(#ch)" />
  </Svg>
);
