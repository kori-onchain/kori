import React, { useState } from "react";
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { Feather } from "../icons";
import { useTheme } from "../theme/ThemeProvider";
import { fonts, radii } from "../theme/tokens";
import { Button } from "./ds/Button";
import { SoftCard } from "./ds/SoftCard";
import { TicketIcon } from "./ds/icons";
import { useFadeUp } from "../hooks/useFadeUp";

type Category = "tudo" | "viagem" | "estilo" | "beneficio";

interface ExperienceItem {
  id: string;
  title: string;
  category: Category;
  description: string;
  costPoints: string;
  status: "disponivel" | "vip";
  icon: React.ComponentProps<typeof Feather>["name"];
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: "lounge",
    title: "Sala VIP Aeroportos",
    category: "viagem",
    description: "Acesso a salas parceiras com um acompanhante.",
    costPoints: "Kori Black",
    status: "vip",
    icon: "map-pin",
  },
  {
    id: "cashback",
    title: "Cashback Turbo 3%",
    category: "beneficio",
    description: "Cashback elevado em compras por 30 dias.",
    costPoints: "4.500 pts",
    status: "disponivel",
    icon: "zap",
  },
  {
    id: "concierge",
    title: "Concierge 24/7",
    category: "estilo",
    description: "Reservas, hotéis e eventos com atendimento prioritário.",
    costPoints: "Kori VIP",
    status: "vip",
    icon: "award",
  },
  {
    id: "hotel",
    title: "Kori Collection Hotéis",
    category: "viagem",
    description: "Upgrade de quarto e café da manhã em hotéis selecionados.",
    costPoints: "8.000 pts",
    status: "disponivel",
    icon: "compass",
  },
  {
    id: "ingressos",
    title: "Pré-vendas Exclusivas",
    category: "beneficio",
    description: "Acesso antecipado a shows, festivais e eventos.",
    costPoints: "2.500 pts",
    status: "disponivel",
    icon: "gift",
  },
];

const FILTERS: Array<{ id: Category; label: string }> = [
  { id: "tudo", label: "Tudo" },
  { id: "viagem", label: "Viagem" },
  { id: "beneficio", label: "Benefícios" },
  { id: "estilo", label: "Estilo" },
];

export const ExperiencesPanel: React.FC = () => {
  const { t } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<Category>("tudo");
  const entering = useFadeUp();
  const userPoints = "24.850";

  const filteredExperiences =
    selectedCategory === "tudo"
      ? EXPERIENCES
      : EXPERIENCES.filter((item) => item.category === selectedCategory);

  const handleShareBenefit = async (benefitTitle: string) => {
    await Share.share({
      message: `Olha esse benefício do Kori: ${benefitTitle}`,
    });
  };

  return (
    <ScrollView
      style={{ backgroundColor: t.bg }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: t.bg }]}
    >
      <Animated.View entering={entering(60)}>
        <SoftCard
          radius={radii.card}
          padding={20}
          strong
          style={styles.pointsCard}
        >
          <View style={styles.pointsRow}>
            <View>
              <Text style={[styles.pointsLabel, { color: t.inkMute }]}>
                REPUTATION POINTS
              </Text>
              <Text style={[styles.pointsValue, { color: t.ink }]}>
                {userPoints}
                <Text style={[styles.pointsUnit, { color: t.inkMute }]}>
                  {" "}
                  PTS
                </Text>
              </Text>
            </View>
            <View style={[styles.tierInline, { borderColor: t.line2 }]}>
              <TicketIcon size={14} color={t.orange} />
              <Text style={[styles.tierText, { color: t.orange }]}>BLACK</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: t.line }]} />

          <View style={styles.pointsFooter}>
            <Text style={[styles.footerText, { color: t.inkMute }]}>
              Próximo nível: <Text style={{ color: t.ink }}>Kori Private</Text>
            </Text>
            <Text style={[styles.footerText, { color: t.inkMute }]}>
              faltam 5.150 pts
            </Text>
          </View>
        </SoftCard>
      </Animated.View>

      <Animated.View entering={entering(140)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {FILTERS.map((filter) => {
            const active = selectedCategory === filter.id;
            return (
              <TouchableOpacity
                key={filter.id}
                activeOpacity={0.75}
                onPress={() => setSelectedCategory(filter.id)}
              >
                <SoftCard radius={radii.pill} padding={0} flat>
                  <View style={styles.categoryPill}>
                    <Text
                      style={[
                        styles.categoryText,
                        { color: active ? t.ink : t.inkMute },
                      ]}
                    >
                      {filter.label}
                    </Text>
                  </View>
                </SoftCard>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      <Animated.View entering={entering(220)}>
        <View style={styles.listSection}>
          <Text style={[styles.sectionTitle, { color: t.ink }]}>
            Experiências disponíveis
          </Text>

          {filteredExperiences.map((item) => (
            <SoftCard
              key={item.id}
              radius={radii.card}
              padding={16}
              style={styles.experienceCard}
            >
              <View style={styles.cardHeader}>
                <SoftCard
                  radius={radii.cardSm}
                  padding={0}
                  flat
                  style={styles.iconCard}
                >
                  <View style={styles.iconInner}>
                    <Feather
                      name={item.icon}
                      size={19}
                      color={item.status === "vip" ? t.orange : t.ink}
                    />
                  </View>
                </SoftCard>
                <View style={styles.cardCopy}>
                  <Text style={[styles.cardTitle, { color: t.ink }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.cardDescription, { color: t.inkMute }]}>
                    {item.description}
                  </Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text
                  style={[
                    styles.costText,
                    { color: item.status === "vip" ? t.orange : t.inkMute },
                  ]}
                >
                  {item.costPoints}
                </Text>
                <View style={styles.cardActions}>
                  <Button
                    label={item.status === "vip" ? "Ver" : "Resgatar"}
                    variant={item.status === "vip" ? "secondary" : "primary"}
                    icon={
                      <Feather
                        name="arrow-right"
                        size={14}
                        color={item.status === "vip" ? t.ink : t.btnPrimaryFg}
                      />
                    }
                  />
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => handleShareBenefit(item.title)}
                  >
                    <SoftCard
                      radius={radii.btn}
                      padding={0}
                      flat
                      style={styles.shareButton}
                    >
                      <View style={styles.shareInner}>
                        <Feather name="share-2" size={17} color={t.inkMute} />
                      </View>
                    </SoftCard>
                  </TouchableOpacity>
                </View>
              </View>
            </SoftCard>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  pointsCard: {
    marginTop: 12,
    marginBottom: 16,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  pointsLabel: {
    fontFamily: fonts.mono.semibold,
    fontSize: 9,
    letterSpacing: 1.4,
  },
  pointsValue: {
    marginTop: 6,
    fontFamily: fonts.sans.bold,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  pointsUnit: {
    fontFamily: fonts.mono.semibold,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  tierInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  tierText: {
    fontFamily: fonts.mono.semibold,
    fontSize: 10,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  pointsFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  footerText: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
  },
  categoriesContainer: {
    gap: 8,
    paddingRight: 20,
    marginBottom: 20,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  categoryText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    fontWeight: "700",
  },
  listSection: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: fonts.sans.bold,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  experienceCard: {
    marginBottom: 2,
  },
  cardHeader: {
    flexDirection: "row",
    gap: 12,
  },
  iconCard: {
    width: 44,
    height: 44,
  },
  iconInner: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  cardCopy: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontFamily: fonts.sans.semibold,
    fontSize: 15,
    fontWeight: "700",
  },
  cardDescription: {
    marginTop: 5,
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    lineHeight: 17,
  },
  cardFooter: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  costText: {
    flex: 1,
    fontFamily: fonts.mono.semibold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  shareButton: {
    width: 44,
    height: 44,
  },
  shareInner: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
