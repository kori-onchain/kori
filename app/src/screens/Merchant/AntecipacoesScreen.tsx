import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Animated from "react-native-reanimated";
import { useTheme } from "@theme/ThemeProvider";
import { fonts, radii } from "@theme/tokens";
import { Header } from "@components/home/Header";
import { SoftCard } from "@components/layout/SoftCard";
import { useFadeUp } from "@hooks/useFadeUp";
import { Feather } from "@/icons";

interface AntecipacoesScreenProps {
  headerProps: React.ComponentProps<typeof Header>;
}

// REVIEW: Substituir por dados reais da API quando disponível
const RECEIVABLES = [
  {
    id: "1",
    description: "Venda #3821 — Tênis Air Pro",
    dueDate: "02 jun 2026",
    grossAmount: "R$ 1.200,00",
    netAmount: "R$ 1.164,00",
    installments: "3x de R$ 400,00",
    status: "pendente",
  },
  {
    id: "2",
    description: "Venda #3822 — Camiseta Premium",
    dueDate: "08 jun 2026",
    grossAmount: "R$ 480,00",
    netAmount: "R$ 465,60",
    installments: "2x de R$ 240,00",
    status: "pendente",
  },
  {
    id: "3",
    description: "Venda #3819 — Kit Skincare",
    dueDate: "15 jun 2026",
    grossAmount: "R$ 890,00",
    netAmount: "R$ 863,30",
    installments: "4x de R$ 222,50",
    status: "pendente",
  },
  {
    id: "4",
    description: "Venda #3815 — Fone Bluetooth",
    dueDate: "22 jun 2026",
    grossAmount: "R$ 350,00",
    netAmount: "R$ 339,50",
    installments: "1x de R$ 350,00",
    status: "pendente",
  },
  {
    id: "5",
    description: "Venda #3808 — Mochila Urban",
    dueDate: "30 jun 2026",
    grossAmount: "R$ 620,00",
    netAmount: "R$ 601,40",
    installments: "2x de R$ 310,00",
    status: "pendente",
  },
];

const TOTAL_GROSS = "R$ 3.540,00";
const TOTAL_NET = "R$ 3.433,80";
const ADVANCE_RATE = "3% a.m.";

export const AntecipacoesScreen: React.FC<AntecipacoesScreenProps> = ({
  headerProps,
}) => {
  const { t, scheme } = useTheme();
  const entering = useFadeUp();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === RECEIVABLES.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(RECEIVABLES.map((r) => r.id)));
    }
  };

  const allSelected = selected.size === RECEIVABLES.length;

  return (
    <View style={[styles.root, { backgroundColor: t.bg }]}>
      <View style={[styles.safeArea, { backgroundColor: t.bg }]}>
        <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} translucent />
        <View style={styles.headerLayer}>
          <Header {...headerProps} />
        </View>

        <ScrollView
          style={{ backgroundColor: t.bg }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          {/* Hero summary card */}
          <Animated.View entering={entering(60)}>
            <SoftCard radius={radii.card} padding={20} style={styles.heroCard}>
              <Text style={[styles.heroLabel, { color: t.inkMute }]}>
                TOTAL DISPONÍVEL PARA ANTECIPAR
              </Text>
              <Text style={[styles.heroAmount, { color: t.ink }]}>
                {TOTAL_GROSS}
              </Text>
              <View style={styles.heroRow}>
                <View style={styles.heroStat}>
                  <Text style={[styles.heroStatLabel, { color: t.inkMute }]}>
                    Líquido estimado
                  </Text>
                  <Text style={[styles.heroStatValue, { color: t.green }]}>
                    {TOTAL_NET}
                  </Text>
                </View>
                <View style={[styles.heroDivider, { backgroundColor: t.line }]} />
                <View style={styles.heroStat}>
                  <Text style={[styles.heroStatLabel, { color: t.inkMute }]}>
                    Taxa
                  </Text>
                  <Text style={[styles.heroStatValue, { color: t.orange }]}>
                    {ADVANCE_RATE}
                  </Text>
                </View>
              </View>
            </SoftCard>
          </Animated.View>

          {/* Header da lista */}
          <Animated.View entering={entering(120)} style={styles.listHeader}>
            <Text style={[styles.sectionTitle, { color: t.ink }]}>
              Recebíveis pendentes
            </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={selectAll}>
              <Text style={[styles.selectAll, { color: t.orange }]}>
                {allSelected ? "Desmarcar todos" : "Selecionar todos"}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Lista de recebíveis */}
          {RECEIVABLES.map((item, i) => {
            const isSelected = selected.has(item.id);
            return (
              <Animated.View key={item.id} entering={entering(160 + i * 40)}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => toggleSelect(item.id)}
                >
                  <SoftCard
                    radius={radii.card}
                    padding={16}
                    style={[
                      styles.receivableCard,
                      isSelected && {
                        borderColor: t.orange,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.cardLeft}>
                        <View
                          style={[
                            styles.checkbox,
                            {
                              borderColor: isSelected ? t.orange : t.inkMute,
                              backgroundColor: isSelected
                                ? t.orange
                                : "transparent",
                            },
                          ]}
                        >
                          {isSelected && (
                            <Feather name="check" size={11} color="#fff" />
                          )}
                        </View>
                        <View style={styles.cardInfo}>
                          <Text
                            style={[styles.cardDesc, { color: t.ink }]}
                            numberOfLines={1}
                          >
                            {item.description}
                          </Text>
                          <Text
                            style={[styles.cardInstall, { color: t.inkMute }]}
                          >
                            {item.installments}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.cardRight}>
                        <Text style={[styles.cardGross, { color: t.ink }]}>
                          {item.grossAmount}
                        </Text>
                        <Text
                          style={[styles.cardNet, { color: t.inkMute }]}
                        >
                          liq. {item.netAmount}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.cardFooter,
                        { borderTopColor: t.line },
                      ]}
                    >
                      <Feather
                        name="calendar"
                        size={11}
                        color={t.inkMute}
                      />
                      <Text
                        style={[styles.cardDate, { color: t.inkMute }]}
                      >
                        Vence em {item.dueDate}
                      </Text>
                    </View>
                  </SoftCard>
                </TouchableOpacity>
              </Animated.View>
            );
          })}

          {/* CTA antecipar */}
          {selected.size > 0 && (
            <Animated.View entering={entering(60)} style={styles.ctaWrapper}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.ctaBtn,
                  {
                    backgroundColor:
                      scheme === "dark" ? "#1A1A1E" : "#101012",
                  },
                ]}
              >
                <Feather name="zap" size={16} color="#ff6b3d" />
                <Text style={styles.ctaText}>
                  Antecipar {selected.size}{" "}
                  {selected.size === 1 ? "recebível" : "recebíveis"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: {
    flex: 1,
  },
  headerLayer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    zIndex: 1000,
    elevation: 1000,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 10,
  },

  // Hero
  heroCard: { marginBottom: 4 },
  heroLabel: {
    fontFamily: fonts.mono.semibold,
    fontSize: 9,
    letterSpacing: 1.6,
    marginBottom: 8,
  },
  heroAmount: {
    fontFamily: fonts.sans.bold,
    fontSize: 32,
    letterSpacing: -1,
    marginBottom: 16,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  heroStat: { flex: 1, gap: 3 },
  heroStatLabel: {
    fontFamily: fonts.mono.regular,
    fontSize: 10,
    letterSpacing: 0.4,
  },
  heroStatValue: {
    fontFamily: fonts.mono.semibold,
    fontSize: 14,
    letterSpacing: 0.2,
  },
  heroDivider: { width: 1, height: 32 },

  // List header
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 2,
  },
  sectionTitle: {
    fontFamily: fonts.sans.semibold,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  selectAll: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
  },

  // Receivable card
  receivableCard: { marginBottom: 0 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: { flex: 1, gap: 2 },
  cardDesc: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    letterSpacing: -0.1,
  },
  cardInstall: {
    fontFamily: fonts.mono.regular,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  cardRight: { alignItems: "flex-end", gap: 2 },
  cardGross: {
    fontFamily: fonts.mono.semibold,
    fontSize: 13,
    letterSpacing: 0.1,
  },
  cardNet: {
    fontFamily: fonts.mono.regular,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  cardDate: {
    fontFamily: fonts.mono.regular,
    fontSize: 10,
    letterSpacing: 0.4,
  },

  // CTA
  ctaWrapper: { marginTop: 8 },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: radii.btn,
  },
  ctaText: {
    color: "#FFFFFF",
    fontFamily: fonts.sans.semibold,
    fontSize: 15,
    fontWeight: "600",
  },
});
