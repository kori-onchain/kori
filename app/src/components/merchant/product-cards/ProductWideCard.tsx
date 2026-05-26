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

export const ProductWideCard: React.FC<ProductCardProps> = ({
  image,
  brand,
  name,
  priceNow,
  priceOld,
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
      <LinearGradient
        colors={t.glossy}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.row}
      >
        <View
          pointerEvents="none"
          style={[styles.hairline, { backgroundColor: t.hairline }]}
        />

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

        <View style={styles.info}>
          <View style={styles.topRow}>
            <BrandLabel text={brand} size={10} />
            {rating !== undefined && <RatingTag value={rating} size={12} />}
          </View>

          <Text
            style={[styles.name, { color: t.ink }]}
            numberOfLines={2}
          >
            {name}
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.priceNow, { color: t.ink }]}>
              {formatBRL(priceNow)}
            </Text>
            {priceOld !== undefined && (
              <Text style={[styles.priceOld, { color: t.inkMute }]}>
                {formatBRL(priceOld)}
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    borderRadius: radii.card,
    borderWidth: 1,
    overflow: "hidden",
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    padding: 10,
    gap: 12,
    position: "relative",
  },
  hairline: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  imageWrap: {
    width: 120,
    height: 120,
    borderRadius: radii.cardSm,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  badgesTop: {
    position: "absolute",
    top: 6,
    left: 6,
    right: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  info: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  name: {
    fontFamily: fonts.sans.bold,
    fontSize: 15,
    letterSpacing: -0.1,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  priceNow: {
    fontFamily: fonts.sans.bold,
    fontSize: 17,
    letterSpacing: -0.1,
  },
  priceOld: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    textDecorationLine: "line-through",
  },
});
