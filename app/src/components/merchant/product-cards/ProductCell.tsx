import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { fonts, radii } from "../../../theme/tokens";
import { useTheme } from "../../../theme/ThemeProvider";
import {
  BrandLabel,
  DiscountBadge,
  ImagePlaceholder,
  NftBadge,
  ProductCardProps,
  RatingTag,
  formatBRL,
} from "./common";

export const ProductCell: React.FC<ProductCardProps> = ({
  image,
  brand,
  name,
  priceNow,
  rating,
  discount,
  isNft,
  nftLabel = "NFT",
}) => {
  const { t } = useTheme();

  return (
    <View
      style={[
        styles.outer,
        {
          borderColor: t.cardBorder,
          backgroundColor: t.bg2,
          shadowColor: "#000",
        },
      ]}
    >
      <View style={[styles.imageWrap, { backgroundColor: t.artBg }]}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <ImagePlaceholder />
        )}

        <View style={styles.badgesTop}>
          {discount && <DiscountBadge label={discount} />}
          {isNft && <NftBadge label={nftLabel} />}
        </View>
      </View>

      <LinearGradient
        colors={t.glossy}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.info}
      >
        <View
          pointerEvents="none"
          style={[styles.hairline, { backgroundColor: t.hairline }]}
        />
        <View style={styles.topRow}>
          <BrandLabel text={brand} size={9} />
          {rating !== undefined && <RatingTag value={rating} size={11} />}
        </View>

        <Text
          style={[styles.name, { color: t.ink }]}
          numberOfLines={1}
        >
          {name}
        </Text>

        <Text style={[styles.priceNow, { color: t.ink }]}>
          {formatBRL(priceNow)}
        </Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    borderRadius: radii.card,
    borderWidth: 1,
    overflow: "hidden",
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  imageWrap: {
    aspectRatio: 1.1,
    position: "relative",
    overflow: "hidden",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  badgesTop: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  info: {
    padding: 10,
    position: "relative",
  },
  hairline: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    letterSpacing: -0.1,
    marginBottom: 4,
  },
  priceNow: {
    fontFamily: fonts.sans.bold,
    fontSize: 15,
    letterSpacing: -0.1,
  },
});
