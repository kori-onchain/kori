import React from 'react';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { colors } from '../../theme/tokens';

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

const defaults = {
  size: 20,
  color: colors.ink,
  strokeWidth: 1.7,
};

export const SendIcon: React.FC<IconProps> = ({
  size = defaults.size,
  color = defaults.color,
  strokeWidth = defaults.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 17 L17 7"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M9 7 H17 V15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ReceiveIcon: React.FC<IconProps> = ({
  size = defaults.size,
  color = defaults.color,
  strokeWidth = defaults.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 7 L7 17"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M15 17 H7 V9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const QrIcon: React.FC<IconProps> = ({
  size = defaults.size,
  color = defaults.color,
  strokeWidth = defaults.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" rx="1.2" stroke={color} strokeWidth={strokeWidth} />
    <Rect x="14" y="3" width="7" height="7" rx="1.2" stroke={color} strokeWidth={strokeWidth} />
    <Rect x="3" y="14" width="7" height="7" rx="1.2" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M14 14 H17 V17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M21 14 V17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M14 21 H17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M21 21 V20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Rect x="19" y="19" width="2" height="2" fill={color} />
  </Svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({
  size = 14,
  color = defaults.color,
  strokeWidth = defaults.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9 L12 15 L18 9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({
  size = 14,
  color = defaults.color,
  strokeWidth = defaults.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 6 L15 12 L9 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({
  size = 14,
  color = defaults.color,
  strokeWidth = defaults.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12 H19 M13 6 L19 12 L13 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const HomeIcon: React.FC<IconProps> = ({
  size = 21,
  color = defaults.color,
  strokeWidth = defaults.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 11 L12 4 L21 11 V20 A1 1 0 0 1 20 21 H15 V14 H9 V21 H4 A1 1 0 0 1 3 20 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CardIcon: React.FC<IconProps> = ({
  size = 21,
  color = defaults.color,
  strokeWidth = defaults.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2.5" y="5" width="19" height="14" rx="2.5" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M2.5 10 H21.5" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M6 15 H10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const InvestIcon: React.FC<IconProps> = ({
  size = 21,
  color = defaults.color,
  strokeWidth = defaults.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 17 L9 11 L13 15 L21 7"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M15 7 H21 V13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ShopIcon: React.FC<IconProps> = ({
  size = 21,
  color = defaults.color,
  strokeWidth = defaults.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 8 H20 L19 20 A1 1 0 0 1 18 21 H6 A1 1 0 0 1 5 20 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="M9 8 V6 A3 3 0 0 1 15 6 V8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const ExperiencesIcon: React.FC<IconProps> = ({
  size = 21,
  color = defaults.color,
  strokeWidth = defaults.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M15.5 8.5 L13 13.5 L8.5 15.5 L11 10.5 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </Svg>
);

export const PlusIcon: React.FC<IconProps> = ({
  size = 20,
  color = defaults.color,
  strokeWidth = defaults.strokeWidth,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const CopyIcon: React.FC<IconProps> = ({
  size = 12,
  color = defaults.color,
  strokeWidth = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="9" y="9" width="11" height="11" rx="2" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M5 15 V5 A2 2 0 0 1 7 3 H15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const TicketIcon: React.FC<IconProps> = ({
  size = 24,
  color = defaults.color,
  strokeWidth = 1.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 8 A2 2 0 0 1 6 6 H18 A2 2 0 0 1 20 8 A2 2 0 0 0 20 12 A2 2 0 0 1 20 16 A2 2 0 0 1 18 18 H6 A2 2 0 0 1 4 16 A2 2 0 0 0 4 12 A2 2 0 0 1 4 8 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Solana wordmark/logo (three parallelogram stripes).
 */
export const SolanaIcon: React.FC<IconProps & { width?: number; height?: number }> = ({
  size,
  width,
  height,
  color = defaults.color,
}) => {
  const w = width ?? size ?? 16;
  const h = height ?? Math.round((w * 18) / 24);
  return (
    <Svg width={w} height={h} viewBox="0 0 24 18" fill="none">
      <Path d="M5 2.5 L21.5 2.5 L19 5.2 L2.5 5.2 Z" fill={color} />
      <Path d="M2.5 7.6 L19 7.6 L21.5 10.3 L5 10.3 Z" fill={color} />
      <Path d="M5 12.8 L21.5 12.8 L19 15.5 L2.5 15.5 Z" fill={color} />
    </Svg>
  );
};

/**
 * Official KORI wordmark (text logo). Source: text-logo.svg.
 * ViewBox kept intact so spacing between letters matches the brand asset.
 */
export const KoriWordmark: React.FC<{ height?: number; color?: string }> = ({
  height = 16,
  color = defaults.color,
}) => {
  const aspect = 603 / 86;
  const width = Math.round(height * aspect);
  return (
    <Svg width={width} height={height} viewBox="0 0 603 86" fill="none">
      <Path
        d="M204.177 0.0552621C227.706 -1.13148 247.761 16.9386 249.026 40.4625C250.29 63.9874 232.288 84.1027 208.767 85.4459C185.137 86.7939 164.906 68.6883 163.636 45.0533C162.365 21.4184 180.538 1.24726 204.177 0.0552621ZM238.253 37.6236C235.443 19.9957 218.89 7.97371 201.258 10.7545C183.584 13.5415 171.527 30.1422 174.344 47.8111C177.161 65.4801 193.782 77.5105 211.447 74.6637C229.069 71.8237 241.064 55.2505 238.253 37.6236Z"
        fill={color}
      />
      <Path
        d="M357.381 1.67091C371.232 0.883914 391.121 0.478594 404.198 5.39259C416.694 10.0886 421.543 26.0413 415.542 37.6963C411.031 46.4583 404.699 48.966 395.83 51.877C403.295 61.9948 413.587 74.1513 421.667 84.0371C417.803 83.9722 410.732 84.6761 408.015 82.6133C399.748 73.8853 390.853 62.1532 383.299 52.6152L360.506 52.6895L360.499 83.8916L350.24 83.9219L350.317 1.9463L357.381 1.67091ZM402.534 16.1436C392.32 9.63357 372.134 11.3562 360.509 11.6172L360.505 43.0498C373.097 43.3968 391.704 45.1342 402.415 38.6602C407.689 32.1382 410.445 21.1855 402.534 16.1436Z"
        fill={color}
      />
      <Path
        d="M55.8318 2.01446C60.5738 1.68846 64.7518 1.84243 69.4768 1.97143C59.8478 12.9914 45.2718 26.1874 34.5008 36.3884C40.9178 45.3804 48.7678 54.6584 55.8078 63.2664C61.5358 70.0664 67.2138 76.9084 72.8398 83.7914L59.8518 83.5845L26.9427 43.4644C21.7507 48.7134 16.0388 54.0075 10.7178 59.2205L10.7148 84.0435L0.192748 84.0394C-0.0632517 56.6134 -0.0642425 29.1844 0.189758 1.75842L10.7148 1.91546L10.7468 46.0394C25.8928 32.1294 40.7588 16.3975 55.8318 2.01446Z"
        fill={color}
      />
      <Path
        d="M553.736 1.7655L566.342 1.73352C578.833 26.6215 591.663 58.0455 602.904 83.8015C598.994 83.9655 595.277 83.8665 591.366 83.7895C588.6 76.1075 584.018 66.4345 580.687 58.9175L562.439 17.7875L559.719 12.0765L528.452 84.0465L516.836 84.0305C529.423 56.7385 541.723 29.3155 553.736 1.7655Z"
        fill={color}
      />
    </Svg>
  );
};

/**
 * KORI "K" glyph from the design spec. Uses the source viewBox so the
 * proportions stay identical to the brand asset.
 */
export const KoriGlyph: React.FC<IconProps> = ({
  size = 22,
  color = defaults.color,
}) => (
  <Svg width={size} height={size} viewBox="420 260 310 370" fill="none">
    <Path
      d="M687.256 312.792L687.761 313.037C688.903 315.6 688.347 361.277 688.339 367.642C652.186 405.264 616.554 443.385 581.454 481.992C596.939 497.772 613.443 513.652 629.23 529.243L721.187 620.099C694.536 620.373 667.338 620.067 640.644 620.039L619.604 620.015C615.524 616.35 611.238 612.134 607.351 608.236C572.133 572.923 534.645 539.223 499.818 503.592C561.731 439.438 624.213 375.836 687.256 312.792Z"
      fill={color}
    />
    <Path
      d="M534.163 269.695C535.193 272.855 535.005 300.957 535.035 306.33C535.232 347.907 535.157 389.485 534.81 431.061C499.36 468.415 464.208 506.052 429.359 543.968C427.97 541.752 428.245 525.221 428.252 521.631L428.336 488.556L428.251 378.795C444.034 361.651 460.488 345.217 476.753 328.524L534.163 269.695Z"
      fill={color}
    />
  </Svg>
);
