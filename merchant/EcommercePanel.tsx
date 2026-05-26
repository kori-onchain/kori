import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { fonts } from "@theme/tokens";
import { Feather } from "@/icons";
import { mockProducts } from "@/data/merchant";
import { useTheme } from "@theme/ThemeProvider";

export const EcommercePanel: React.FC = () => {
  const { t } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = [
    { id: "All", name: "All", isIcon: true },
    {
      id: "Smartphones",
      name: "Smartphones",
      image:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=200&h=200",
    },
    {
      id: "Kitchen",
      name: "Kitchen",
      image:
        "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=200&h=200",
    },
    {
      id: "Game Consoles",
      name: "Game Consoles",
      image:
        "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=200&h=200",
    },
  ];

  const filteredProducts = mockProducts.filter(
    (p) => activeCategory === "All" || p.category === activeCategory,
  );

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      {/* Header - Search and Menu */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#9a9a9e" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products"
            placeholderTextColor="#9a9a9e"
          />
          <Feather name="sliders" size={20} color="#9a9a9e" />
        </View>

        <TouchableOpacity style={styles.menuButton}>
          <Feather name="menu" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesWrapper}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryItem}
                  onPress={() => setActiveCategory(cat.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.categoryCircle,
                      isActive && styles.categoryCircleActive,
                    ]}
                  >
                    {cat.isIcon ? (
                      <Feather name="grid" size={24} color="#fff" />
                    ) : (
                      <Image
                        source={{ uri: cat.image }}
                        style={styles.categoryImage}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.categoryText,
                      isActive && styles.categoryTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Product Grid */}
        <View style={styles.grid}>
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.gridItem}>
              <View style={styles.productCard}>
                {/* Badge */}
                {product.discountBadge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {product.discountBadge}
                    </Text>
                  </View>
                )}

                {/* Image */}
                <View style={styles.imageContainer}>
                  {product.imageUrl ? (
                    <Image
                      source={{ uri: product.imageUrl }}
                      style={styles.productImage}
                    />
                  ) : (
                    <Feather name="image" size={32} color="#5a5a5e" />
                  )}
                </View>
              </View>

              {/* Product Info below card */}
              <View style={styles.productInfo}>
                <View style={styles.brandRow}>
                  <Text style={styles.brandText}>{product.description}</Text>
                  <View style={styles.ratingRow}>
                    <Feather name="star" size={12} color="#CCFF00" />
                    <Text style={styles.ratingText}>
                      {product.rating?.toFixed(1) || "0.0"}
                    </Text>
                  </View>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>
                    ${product.price.toFixed(2)}
                  </Text>
                  {product.originalPrice && (
                    <Text style={styles.originalPriceText}>
                      ${product.originalPrice.toFixed(2)}
                    </Text>
                  )}
                </View>

                <Text style={styles.productTitle} numberOfLines={1}>
                  {product.name}
                </Text>
              </View>
            </View>
          ))}

          {filteredProducts.length === 0 && (
            <View style={styles.emptyState}>
              <Feather name="inbox" size={48} color="#2f2f33" />
              <Text style={styles.emptyStateText}>No products found.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16161a",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: "#2f2f33",
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontFamily: fonts.sans.regular,
    fontSize: 15,
    marginHorizontal: 12,
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#16161a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2f2f33",
  },
  content: {
    flex: 1,
  },
  categoriesWrapper: {
    paddingVertical: 20,
  },
  categoriesContent: {
    paddingHorizontal: 8, // Adds padding inside the scroller to prevent cutoffs
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 12,
  },
  categoryCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1C1C1E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  categoryCircleActive: {
    borderWidth: 2,
    borderColor: "#CCFF00",
    backgroundColor: "#16161a",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryText: {
    color: "#9a9a9e",
    fontFamily: fonts.sans.medium,
    fontSize: 13,
  },
  categoryTextActive: {
    color: "#CCFF00",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  gridItem: {
    width: "50%",
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  productCard: {
    backgroundColor: "#16161a",
    borderRadius: 16,
    height: 180,
    position: "relative",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2f2f33",
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#CCFF00",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1,
  },
  badgeText: {
    color: "#000",
    fontFamily: fonts.mono.semibold,
    fontSize: 11,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  productInfo: {
    paddingHorizontal: 4,
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  brandText: {
    color: "#5a5a5e",
    fontFamily: fonts.sans.semibold,
    fontSize: 11,
    textTransform: "uppercase",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    color: "#fff",
    fontFamily: fonts.mono.medium,
    fontSize: 11,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  priceText: {
    color: "#fff",
    fontFamily: fonts.sans.bold,
    fontSize: 18,
  },
  originalPriceText: {
    color: "#5a5a5e",
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  productTitle: {
    color: "#fff",
    fontFamily: fonts.sans.medium,
    fontSize: 14,
  },
  emptyState: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    color: "#5a5a5e",
    fontFamily: fonts.sans.medium,
    fontSize: 16,
    marginTop: 16,
  },
});
