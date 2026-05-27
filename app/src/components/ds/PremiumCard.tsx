import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Line, Path, Circle } from 'react-native-svg';
import { fonts } from '../../theme/tokens';
import { KoriGlyph } from './icons';
import { ChipEMV } from './ChipEMV';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface PremiumCardProps {
  holder: string;
  last4: string;
  isVirtual?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Internal sub-components (card-specific, not exported)              */
/* ------------------------------------------------------------------ */

const DiamondTexture: React.FC = () => {
  const sp = 18;
  const W = 500;
  const H = 320;
  const lines: React.ReactElement[] = [];

  for (let i = -H; i < W + H; i += sp) {
    lines.push(
      <Line key={`d${i}`} x1={i} y1={0} x2={i + H} y2={H}
        stroke="rgba(255,255,255,0.05)" strokeWidth={0.8} />,
    );
    lines.push(
      <Line key={`u${i}`} x1={i + H} y1={0} x2={i} y2={H}
        stroke="rgba(255,255,255,0.05)" strokeWidth={0.8} />,
    );
  }

  return (
    <Svg
      width="100%" height="100%"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      style={StyleSheet.absoluteFillObject}
    >
      {lines}
    </Svg>
  );
};

const ContactlessIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 22,
  color = '#c4c4c4',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 19 Q5 5 19 5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M8 19 Q8 8 19 8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M11 19 Q11 11 19 11" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const MastercardMono: React.FC<{ size?: number }> = ({ size = 38 }) => (
  <Svg width={size} height={size * 0.65} viewBox="0 0 40 26">
    <Circle cx="14" cy="13" r="11" fill="#8a8a8e" opacity={0.55} />
    <Circle cx="26" cy="13" r="11" fill="#b4b4b8" opacity={0.4} />
  </Svg>
);

/* ------------------------------------------------------------------ */
/*  PremiumCard                                                        */
/* ------------------------------------------------------------------ */

export const PremiumCard: React.FC<PremiumCardProps> = ({
  holder,
  last4,
  isVirtual = true,
}) => (
  <View style={styles.shadow}>
    <View style={styles.card}>
      {/* L1 — diamond mesh texture */}
      <View style={[StyleSheet.absoluteFillObject, { opacity: 0.6 }]} pointerEvents="none">
        <DiamondTexture />
      </View>

      {/* L2 — diagonal sheen (metallic light reflection) */}
      <LinearGradient
        colors={[
          'transparent',
          'rgba(255,255,255,0.04)',
          'rgba(255,255,255,0.10)',
          'rgba(255,255,255,0.04)',
          'transparent',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.8 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      {/* L3 — inner edge highlights (fio de luz + base shadow) */}
      <View style={styles.edgeTop} pointerEvents="none" />
      <View style={styles.edgeBot} pointerEvents="none" />

      {/* ── Content (3 vertical zones) ── */}
      <View style={styles.content}>
        {/* TOP — chip + contactless/virtual */}
        <View style={styles.top}>
          <ChipEMV />
          <View style={styles.topRight}>
            <ContactlessIcon />
            {isVirtual && <Text style={styles.virtualTxt}>Virtual</Text>}
          </View>
        </View>

        {/* MID — K glyph + wordmark */}
        <View style={styles.mid}>
          <KoriGlyph size={55} color="#d6d6d6" />
          <Text style={styles.koriTxt}>KORI</Text>
        </View>

        {/* BOT — holder info + mastercard */}
        <View style={styles.bot}>
          <View>
            <Text style={styles.holderLbl}>PORTADOR</Text>
            <Text style={styles.holderName}>{holder.toUpperCase()}</Text>
            <Text style={styles.maskedNum}>{'•••• •••• •••• '}{last4}</Text>
          </View>
          <View style={styles.botRight}>
            <MastercardMono />
          </View>
        </View>
      </View>
    </View>
  </View>
);

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 20,
    backgroundColor: '#0c0c0d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  card: {
    width: '100%',
    aspectRatio: 1.586,
    borderRadius: 20,
    backgroundColor: '#0c0c0d',
    overflow: 'hidden',
    transformOrigin: 'center top',
    transform: [{ perspective: 1400 }, { rotateX: '3deg' }],
  },
  edgeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    zIndex: 2,
  },
  edgeBot: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 2,
  },
  content: {
    flex: 1,
    paddingVertical: 22,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    zIndex: 3,
  },

  /* TOP */
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  topRight: { alignItems: 'flex-end' },
  virtualTxt: {
    fontFamily: fonts.mono.regular,
    fontSize: 8,
    color: '#9a9a9e',
    letterSpacing: 1.2,
    marginTop: 4,
  },

  /* MID */
  mid: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  koriTxt: {
    fontFamily: fonts.sans.bold,
    fontSize: 16,
    color: '#d6d6d6',
    letterSpacing: 8,
    marginTop: 4,
  },

  /* BOT */
  bot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  botRight: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  holderLbl: {
    fontFamily: fonts.mono.regular,
    fontSize: 8,
    color: '#5a5a5e',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  holderName: {
    fontFamily: fonts.sans.bold,
    fontSize: 14,
    color: '#fafafa',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  maskedNum: {
    fontFamily: fonts.mono.regular,
    fontSize: 12,
    color: '#9a9a9e',
    letterSpacing: 1.5,
  },
});
