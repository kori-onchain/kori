import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@/icons";
import { fonts, radii } from "@theme/tokens";
import { useTheme } from "@theme/ThemeProvider";
import { SolanaIcon } from "@/components/layout/icons";

export interface ProductCardProps {
  image?: string;
  brand: string;
  name: string;
  priceNow: number;
  priceOld?: number;
  rating?: number;
  discount?: string;
  isNft?: boolean;
  nftLabel?: "NFT" | "cNFT";
}

const fmtBRL = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

export const DiscountBadge: React.FC<{ label: string }> = ({ label }) => {
  const { t } = useTheme();
  return (
    <View style={[badgeStyles.discount, { backgroundColor: t.green }]}>
      <Text style={[badgeStyles.discountText, { color: "#0a0a0a" }]}>
        {label}
      </Text>
    </View>
  );
};

export const NftBadge: React.FC<{ label: "NFT" | "cNFT" }> = ({ label }) => {
  const { t } = useTheme();
  return (
    <View style={[badgeStyles.nft, { backgroundColor: t.sol }]}>
      <SolanaIcon width={12} height={9} color="#fff" />
      <Text style={badgeStyles.nftText}>{label}</Text>
    </View>
  );
};

export const RatingTag: React.FC<{
  value: number;
  size?: number;
  /** Override quando o texto fica sobre a imagem/scrim (precisa ser claro nos dois temas). */
  color?: string;
}> = ({ value, size = 12, color }) => {
  const { t } = useTheme();
  return (
    <View style={badgeStyles.rating}>
      <Feather name="star" size={size} color={t.orange} />
      <Text
        style={[
          badgeStyles.ratingText,
          { color: color ?? t.ink, fontSize: size - 1 },
        ]}
      >
        {value.toFixed(1)}
      </Text>
    </View>
  );
};

export const BrandLabel: React.FC<{
  text: string;
  size?: number;
  /** Override quando o texto fica sobre a imagem/scrim. */
  color?: string;
}> = ({ text, size = 10, color }) => {
  const { t } = useTheme();
  return (
    <Text
      style={[
        badgeStyles.brand,
        { color: color ?? t.inkMute, fontSize: size, letterSpacing: 1 },
      ]}
    >
      {text.toUpperCase()}
    </Text>
  );
};

export const Scrim: React.FC<{ height?: number }> = ({ height = 130 }) => (
  <LinearGradient
    colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.85)"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={[scrimStyle.scrim, { height }]}
    pointerEvents="none"
  />
);

export const Hairline: React.FC<{ radius?: number }> = ({
  radius = radii.card,
}) => {
  const { t } = useTheme();
  return (
    <View
      pointerEvents="none"
      style={[
        hairlineStyle.hairline,
        {
          backgroundColor: t.hairline,
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
        },
      ]}
    />
  );
};

export const ImagePlaceholder: React.FC<{ size?: number }> = ({
  size = 28,
}) => {
  const { t } = useTheme();
  return (
    <View
      style={[
        placeholderStyle.fill,
        { backgroundColor: t.artBg },
      ]}
    >
      <Feather name="image" size={size} color={t.inkFaint} />
    </View>
  );
};

export const formatBRL = fmtBRL;

const badgeStyles = StyleSheet.create({
  discount: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    fontFamily: fonts.mono.semibold,
    fontSize: 11,
    letterSpacing: 0.2,
  },
  nft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
  },
  nftText: {
    color: "#fff",
    fontFamily: fonts.mono.semibold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingText: {
    fontFamily: fonts.mono.semibold,
    letterSpacing: 0.2,
  },
  brand: {
    fontFamily: fonts.mono.medium,
    textTransform: "uppercase",
  },
});

const scrimStyle = StyleSheet.create({
  scrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const hairlineStyle = StyleSheet.create({
  hairline: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    zIndex: 2,
  },
});

const placeholderStyle = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
