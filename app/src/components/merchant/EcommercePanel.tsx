import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { fonts, radii } from "@theme/tokens";
import { Feather } from "@/icons";
import { useTheme } from "@theme/ThemeProvider";
import { mockProducts, Product } from "@/data/merchant";
import { ProductHeroCard } from "@components/merchant/product-cards/ProductHeroCard";
import { ProductCell } from "@components/merchant/product-cards/ProductCell";
import { ProductWideCard } from "@components/merchant/product-cards/ProductWideCard";
import { AddProductModal } from "@components/merchant/AddProductModal";

const CATEGORIES = [
  "Tudo",
  "Smartphones",
  "Kitchen",
  "Game Consoles",
] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

const productToCardProps = (p: Product) => ({
  image: p.imageUrl,
  brand: p.description,
  name: p.name,
  priceNow: p.price,
  priceOld: p.originalPrice,
  rating: p.rating,
  discount: p.discountBadge,
  isNft: p.isNft,
  nftLabel: p.nftLabel,
});

export const EcommercePanel: React.FC = () => {
  const { t } = useTheme();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("Tudo");
  const [addModalVisible, setAddModalVisible] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category !== "Tudo" && p.category !== category) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.description.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [category, query, products]);

  const handleSaveProduct = (newProdData: any) => {
    const newProduct: Product = {
      id: "p_" + Date.now(),
      name: newProdData.name,
      description: "Vendedor",
      category: "Other" as any,
      price: parseFloat(newProdData.price.replace(",", ".")) || 0.0,
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400",
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const [hero, c1, c2, wide, c3, c4, ...others] = filtered;

  return (
    <ScrollView
      style={{ backgroundColor: t.bg }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {/* Title and Add Button Row */}
      <View style={styles.titleRow}>
        <Text style={[styles.titleText, { color: t.ink }]}>Vitrine de Produtos</Text>
        <TouchableOpacity
          style={[styles.addNewBtn, { backgroundColor: t.orange }]}
          activeOpacity={0.8}
          onPress={() => setAddModalVisible(true)}
        >
          <Feather name="plus" size={16} color="#FFF" style={{ marginRight: 4 }} />
          <Text style={styles.addNewBtnText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      {/* Search row */}
      <View style={styles.searchRow}>
        <View
          style={[
            styles.searchInputWrap,
            { backgroundColor: t.bg2, borderColor: t.cardBorder },
          ]}
        >
          <Feather name="search" size={18} color={t.inkMute} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar produtos"
            placeholderTextColor={t.inkMute}
            style={[styles.searchInput, { color: t.ink }]}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            { backgroundColor: t.bg2, borderColor: t.cardBorder },
          ]}
          activeOpacity={0.8}
        >
          <Feather name="sliders" size={18} color={t.ink} />
        </TouchableOpacity>
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {CATEGORIES.map((cat) => {
          const active = category === cat;
          return (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.8}
              onPress={() => setCategory(cat)}
              style={[
                styles.chip,
                active
                  ? { backgroundColor: t.ink, borderColor: t.ink }
                  : { backgroundColor: "transparent", borderColor: t.cardBorder },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: active ? t.bg : t.inkMute },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Bento grid */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="inbox" size={42} color={t.inkFaint} />
          <Text style={[styles.emptyText, { color: t.inkMute }]}>
            Nenhum produto encontrado.
          </Text>
        </View>
      ) : (
        <View style={styles.bento}>
          {hero && (
            <ProductHeroCard {...productToCardProps(hero)} />
          )}

          {(c1 || c2) && (
            <View style={styles.row}>
              {c1 && <ProductCell {...productToCardProps(c1)} />}
              {c2 && <ProductCell {...productToCardProps(c2)} />}
            </View>
          )}

          {wide && <ProductWideCard {...productToCardProps(wide)} />}

          {(c3 || c4) && (
            <View style={styles.row}>
              {c3 && <ProductCell {...productToCardProps(c3)} />}
              {c4 && <ProductCell {...productToCardProps(c4)} />}
            </View>
          )}

          {/* Render extra products in 2-column rows */}
          {others.length > 0 && (
            <View style={{ gap: 12 }}>
              {Array.from({ length: Math.ceil(others.length / 2) }).map((_, rowIndex) => {
                const item1 = others[rowIndex * 2];
                const item2 = others[rowIndex * 2 + 1];
                return (
                  <View key={`row-${rowIndex}`} style={styles.row}>
                    {item1 && <ProductCell {...productToCardProps(item1)} />}
                    {item2 && <ProductCell {...productToCardProps(item2)} />}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}

      {/* Product Creation Modal */}
      <AddProductModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={handleSaveProduct}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 40,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleText: {
    fontFamily: fonts.sans.bold,
    fontSize: 18,
  },
  addNewBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
  },
  addNewBtnText: {
    fontFamily: fonts.sans.bold,
    fontSize: 12,
    color: "#FFF",
  },
  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    padding: 0,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chipsRow: {
    gap: 8,
    paddingRight: 20,
    marginBottom: 18,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  chipText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    letterSpacing: 0.1,
  },
  bento: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
  },
});
