import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { fonts, radii } from "@theme/tokens";
import { useTheme } from "@theme/ThemeProvider";
import {
  BrandLabel,
  DiscountBadge,
  Hairline,
  ImagePlaceholder,
  NftBadge,
  ProductCardProps,
  RatingTag,
  Scrim,
  formatBRL,
} from "@components/merchant/product-cards/common";

export const ProductHeroCard: React.FC<ProductCardProps> = ({
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
          backgroundColor: t.artBg,
          shadowColor: "#000",
        },
      ]}
    >
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <ImagePlaceholder size={48} />
      )}

      <Hairline radius={radii.card} />

      <Scrim height={140} />

      <View style={styles.badgesTop}>
        {discount && <DiscountBadge label={discount} />}
        {isNft && <NftBadge label={nftLabel} />}
      </View>

      <View style={styles.info}>
        <View style={styles.topRow}>
          <BrandLabel text={brand} size={10} />
          {rating !== undefined && <RatingTag value={rating} size={13} />}
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
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    height: 210,
    borderRadius: radii.card,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  badgesTop: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  info: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontFamily: fonts.sans.bold,
    fontSize: 18,
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  priceNow: {
    fontFamily: fonts.sans.bold,
    fontSize: 18,
    letterSpacing: -0.2,
  },
  priceOld: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    textDecorationLine: "line-through",
  },
});
