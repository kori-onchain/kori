import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@theme/ThemeProvider";
import { fonts } from "@theme/tokens";
import { SoftCard } from "@components/layout/SoftCard";
import { mockProducts } from "@/data/merchant";
import { Feather } from "@/icons";

interface ProductsPanelProps {
  onAddProduct: () => void;
}

export const ProductsPanel: React.FC<ProductsPanelProps> = ({
  onAddProduct,
}) => {
  const { t } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.ink }]}>Meus Produtos</Text>
        <TouchableOpacity onPress={onAddProduct} style={styles.addButton}>
          <Feather name="plus" size={16} color={t.orange} />
          <Text style={[styles.addText, { color: t.orange }]}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {mockProducts.map((product) => {
          const originalPrice = product.originalPrice ?? product.price * 1.25;
          const discountPct = "20% off";

          return (
            <View key={product.id} style={styles.gridItem}>
              <SoftCard style={styles.productCard} padding={0}>
                {/* Image Area */}
                <View style={[styles.imageWrapper, { backgroundColor: t.bg2 }]}>
                  <View style={[styles.badge, { backgroundColor: t.green }]}>
                    <Text style={styles.badgeText}>Até 8% de cashback</Text>
                  </View>
                  <View
                    style={[
                      styles.imagePlaceholder,
                      { backgroundColor: t.artBg },
                    ]}
                  >
                    <Feather name="image" size={24} color={t.inkDim} />
                  </View>
                </View>

                {/* Info Area */}
                <View style={styles.productInfo}>
                  <Text
                    style={[styles.productName, { color: t.ink }]}
                    numberOfLines={2}
                  >
                    {product.name} - {product.description}
                  </Text>

                  <View style={styles.priceRow}>
                    <Text style={[styles.originalPrice, { color: t.inkDim }]}>
                      R$ {originalPrice.toFixed(2).replace(".", ",")}
                    </Text>
                    <View
                      style={[
                        styles.discountBadge,
                        { backgroundColor: t.bgElev },
                      ]}
                    >
                      <Text style={[styles.discountText, { color: t.ink }]}>
                        {discountPct}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.finalPrice, { color: t.ink }]}>
                    R$ {product.price.toFixed(2).replace(".", ",")}{" "}
                    <Text style={styles.aVista}>à vista</Text>
                  </Text>

                  <Text style={[styles.installments, { color: t.inkDim }]}>
                    até 10x de R${" "}
                    {(product.price / 10).toFixed(2).replace(".", ",")} sem
                    juros
                  </Text>

                  <View style={[styles.cashbackRow, { backgroundColor: `${t.green}26` }]}>
                    <Feather name="refresh-ccw" size={12} color={t.green} />
                    <Text style={[styles.cashbackAmount, { color: t.green }]}>
                      Até R${" "}
                      {(product.price * 0.08).toFixed(2).replace(".", ",")}
                    </Text>
                  </View>
                  <Text style={[styles.netPrice, { color: t.inkMute }]}>
                    Sai por{" "}
                    <Text style={{ color: t.ink, fontFamily: fonts.sans.bold }}>
                      R$ {(product.price * 0.92).toFixed(2).replace(".", ",")}
                    </Text>
                  </Text>
                </View>
              </SoftCard>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.sans.semibold,
    fontSize: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addText: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  gridItem: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  productCard: {
    flex: 1,
    overflow: "hidden",
  },
  imageWrapper: {
    padding: 12,
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  badgeText: {
    color: "#fff",
    fontFamily: fonts.sans.bold,
    fontSize: 9,
  },
  imagePlaceholder: {
    height: 120,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  originalPrice: {
    fontFamily: fonts.sans.regular,
    fontSize: 11,
    textDecorationLine: "line-through",
  },
  discountBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 10,
  },
  finalPrice: {
    fontFamily: fonts.sans.bold,
    fontSize: 16,
    marginBottom: 2,
  },
  aVista: {
    fontFamily: fonts.sans.regular,
    fontSize: 11,
    fontWeight: "normal",
  },
  installments: {
    fontFamily: fonts.sans.regular,
    fontSize: 11,
    marginBottom: 10,
  },
  cashbackRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
    marginBottom: 6,
  },
  cashbackAmount: {
    fontFamily: fonts.sans.semibold,
    fontSize: 11,
  },
  netPrice: {
    fontFamily: fonts.sans.regular,
    fontSize: 11,
  },
});
