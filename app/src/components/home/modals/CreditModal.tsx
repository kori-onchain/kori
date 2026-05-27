import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path, G, Line } from "react-native-svg";
import { Feather } from "@/icons";
import { useTheme } from "@theme/ThemeProvider";
import { fonts, radii } from "@theme/tokens";
import { SoftCard } from "@components/layout/SoftCard";

interface CreditModalProps {
  visible: boolean;
  onClose: () => void;
}

const FAQItem: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => {
  const { t } = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => setExpanded(!expanded)}
      style={styles.faqItemWrapper}
    >
      <SoftCard radius={radii.card} padding={16}>
        <View style={styles.faqHeader}>
          <Text style={[styles.faqQuestion, { color: t.ink }]}>{question}</Text>
          <Feather
            name={expanded ? "chevron-up" : "chevron-down"}
            size={18}
            color={t.inkMute}
          />
        </View>
        {expanded && (
          <Text style={[styles.faqAnswer, { color: t.inkDim }]}>{answer}</Text>
        )}
      </SoftCard>
    </TouchableOpacity>
  );
};

const FactorCard: React.FC<{
  title: string;
  icon: string;
}> = ({ title, icon }) => {
  const { t } = useTheme();

  return (
    <SoftCard radius={radii.card} padding={12} style={styles.factorCard}>
      <View style={styles.factorRow}>
        <View style={[styles.factorIconWrap, { backgroundColor: t.bg2 }]}>
          <Feather name={icon as any} size={15} color={t.inkDim} />
        </View>
        <Text style={[styles.factorTitle, { color: t.ink }]} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </SoftCard>
  );
};

const CategoryGroup: React.FC<{
  title: string;
  icon: string;
  count: number;
  children: React.ReactNode;
}> = ({ title, icon, count, children }) => {
  const { t } = useTheme();
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={styles.groupContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setExpanded(!expanded)}
        style={[styles.groupHeader, { borderBottomColor: t.line }]}
      >
        <View style={styles.groupHeaderLeft}>
          <Feather name={icon as any} size={18} color={t.orange} />
          <Text style={[styles.groupTitle, { color: t.ink }]}>{title}</Text>
          <View style={[styles.groupCount, { backgroundColor: t.bgElev }]}>
            <Text style={[styles.groupCountText, { color: t.inkDim }]}>{count}</Text>
          </View>
        </View>
        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={t.inkMute}
        />
      </TouchableOpacity>
      {expanded && <View style={styles.groupContent}>{children}</View>}
    </View>
  );
};


export const CreditModal: React.FC<CreditModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTheme();

  const handleInfoPress = () => {
    Alert.alert(
      "Como funciona o score?",
      "O score da Kori avalia uma combinação de indicadores on-chain e comportamento interno: seu patrimônio cripto e reservas em stablecoins, capital em staking, volume e frequência de transações, histórico de faturas e adimplência geral do cartão.",
      [{ text: "Entendi" }]
    );
  };

  const handleWhyScorePress = () => {
    Alert.alert(
      "Por que tenho esse score?",
      "Seu score de 908 é Excelente! Ele reflete sua forte atividade on-chain, com excelente patrimônio de alta liquidez e reserva em stablecoins, consistente volume e frequência de transações na rede, além de um histórico impecável de faturas Kori pagas em dia.",
      [{ text: "Legal!" }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: t.bg }]}>
        <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} translucent />

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: t.line }]}>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.headerBtn, { backgroundColor: t.bg2 }]}
            activeOpacity={0.75}
          >
            <Feather name="arrow-left" size={22} color={t.ink} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: t.ink }]}>Meu Crédito</Text>

          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={handleInfoPress}
              style={[styles.headerBtn, { backgroundColor: t.bg2 }]}
              activeOpacity={0.75}
            >
              <Feather name="help-circle" size={20} color={t.ink} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Enhanced Circular SVG Gauge Chart */}
          <View style={styles.gaugeContainer}>
            <View style={styles.svgWrapper}>
              <Svg width={300} height={180} viewBox="0 0 300 180">
                {/* Continuous circular arc (180deg to 0deg) */}
                <Path
                  d="M 30 160 A 120 120 0 0 1 270 160"
                  fill="none"
                  stroke={t.green}
                  strokeWidth={16}
                  strokeLinecap="round"
                />

                {/* Gap 1 (at 120deg) colored as t.bg to mask/split the arc */}
                <Line
                  x1={95}
                  y1={64.7}
                  x2={85}
                  y2={47.4}
                  stroke={t.bg}
                  strokeWidth={5}
                />

                {/* Gap 2 (at 60deg) colored as t.bg to mask/split the arc */}
                <Line
                  x1={205}
                  y1={64.7}
                  x2={215}
                  y2={47.4}
                  stroke={t.bg}
                  strokeWidth={5}
                />

                {/* Multi-layered Premium Seed Indicator at R=120, angle=16.6deg */}
                <G transform="translate(265.0, 125.8) rotate(16.6)">
                  {/* Outer dark stroke mask */}
                  <Path
                    d="M0,8 C5,8 8,4 8,-2 C8,-8 0,-14 0,-14 C0,-14 -8,-8 -8,-2 C-8,4 -5,8 0,8 Z"
                    fill={t.bg}
                    transform="scale(1.4)"
                  />
                  {/* Inner green glowing rim */}
                  <Path
                    d="M0,8 C5,8 8,4 8,-2 C8,-8 0,-14 0,-14 C0,-14 -8,-8 -8,-2 C-8,4 -5,8 0,8 Z"
                    fill={t.green}
                    transform="scale(1.2)"
                  />
                  {/* Inside white leaf */}
                  <Path
                    d="M0,8 C5,8 8,4 8,-2 C8,-8 0,-14 0,-14 C0,-14 -8,-8 -8,-2 C-8,4 -5,8 0,8 Z"
                    fill="#FFF"
                  />
                </G>
              </Svg>
            </View>

            {/* Score & Badge Centered */}
            <View style={styles.scoreCenter}>
              <Text style={[styles.scoreNumber, { color: t.ink }]}>908</Text>
              <View style={[styles.badgeExcellent, { backgroundColor: "#86efac" }]}>
                <Text style={styles.badgeExcellentText}>Excelente</Text>
              </View>
            </View>
          </View>

          {/* Explanation Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleWhyScorePress}
            style={styles.whyScoreBtn}
          >
            <SoftCard radius={radii.card} padding={16} style={styles.whyScoreCard}>
              <View style={styles.whyScoreRow}>
                <Text style={[styles.whyScoreText, { color: t.ink }]}>
                  Por que tenho esse score?
                </Text>
                <Feather name="chevron-right" size={18} color={t.inkMute} />
              </View>
            </SoftCard>
          </TouchableOpacity>


          {/* Credit Indicators Grouped Catalog */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: t.ink }]}>
              Indicadores
            </Text>

            {/* Group 1: Ativos & Patrimônio */}
            <CategoryGroup title="Ativos & Patrimônio" icon="pocket" count={4}>
              <FactorCard
                title="Patrimônio de Alta Liquidez"
                icon="activity"
              />
              <FactorCard
                title="Reserva em Stablecoins"
                icon="shield"
              />
              <FactorCard
                title="Capital Alocado em Staking"
                icon="lock"
              />
              <FactorCard
                title="Garantias em Ativos Digitais (NFTs)"
                icon="image"
              />
            </CategoryGroup>

            {/* Group 2: Atividade & Relacionamento */}
            <CategoryGroup title="Atividade & Relacionamento" icon="activity" count={4}>
              <FactorCard
                title="Volume Histórico Transacionado"
                icon="bar-chart-2"
              />
              <FactorCard
                title="Frequência e Recorrência na Rede"
                icon="clock"
              />
              <FactorCard
                title="Tempo de Relacionamento (Conta Kori)"
                icon="calendar"
              />
              <FactorCard
                title="KCOINs Acumuladas no Ecossistema"
                icon="award"
              />
            </CategoryGroup>

            {/* Group 3: Reputação & Comportamento */}
            <CategoryGroup title="Reputação & Comportamento" icon="heart" count={6}>
              <FactorCard
                title="Histórico de Faturas Kori"
                icon="credit-card"
              />
              <FactorCard
                title="Índice de Adimplência Geral"
                icon="check-circle"
              />
              <FactorCard
                title="Verificação de Identidade (KYC)"
                icon="user-check"
              />
              <FactorCard
                title="Adesão ao Débito Automático"
                icon="refresh-cw"
              />
              <FactorCard
                title="Score de Comportamento Kori"
                icon="smile"
              />
            </CategoryGroup>
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: t.ink }]}>
              Dúvidas frequentes
            </Text>

            <FAQItem
              question="Como o meu score é calculado?"
              answer="Seu score Kori é calculado analisando uma série de indicadores divididos em três pilares principais: seus Ativos & Patrimônio on-chain (cripto de alta liquidez, stablecoins, staking e NFTs), sua Atividade & Relacionamento (volume e frequência de transações, idade de conta e KCOINs), além de Reputação & Comportamento (histórico de faturas, KYC, adimplência e adesão ao débito automático)."
            />

            <FAQItem
              question="Como posso aumentar meu score?"
              answer="Para aumentar seu score, continue mantendo um bom volume e frequência de transações on-chain, aloque saldos em stablecoins e staking na sua carteira Kori, ative o débito automático para suas faturas do cartão Kori e certifique-se de realizar pagamentos sempre integralmente dentro do vencimento."
            />

            <FAQItem
              question="Com que frequência o score é atualizado?"
              answer="O score da Kori é dinâmico e atualizado constantemente. A análise de transações e movimentações na rede Solana é avaliada de forma contínua on-chain, enquanto o histórico de pagamentos de faturas e outros padrões comportamentais são consolidados mensalmente de forma automática."
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

/* ── Credit Card Summary Styles ──────────────────────── */
const ccStyles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    overflow: "hidden",
  },
  cardInner: {
    padding: 20,
  },
  label: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    marginBottom: 6,
  },
  amount: {
    fontFamily: fonts.sans.bold,
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginBottom: 2,
  },
  subAmount: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    marginBottom: 20,
  },
  /* Progress bar */
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(128,128,128,0.12)",
    position: "relative",
    marginBottom: 10,
  },
  progressFill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 4,
  },
  progressDot: {
    position: "absolute",
    top: -3,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
    marginLeft: -7,
  },
  progressDotMid: {
    position: "absolute",
    top: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    marginLeft: -4,
  },
  /* Legend */
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  legendLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
  },
  legendValue: {
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    fontWeight: "700",
  },
  /* Savings streak */
  streakBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  streakText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 12.5,
    fontWeight: "700",
    flex: 1,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  streakEmoji: {
    fontSize: 14,
  },
  streakCount: {
    fontFamily: fonts.sans.bold,
    fontSize: 13,
    fontWeight: "800",
  },
  /* Quick actions */
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionWrap: {
    flex: 1,
  },
  actionCard: {
    overflow: "hidden",
  },
  actionInner: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 8,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontFamily: fonts.sans.semibold,
    fontSize: 11.5,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 15,
  },
  /* Due date */
  dueCard: {
    overflow: "hidden",
  },
  dueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dueLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dueLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 11,
  },
  dueDate: {
    fontFamily: fonts.sans.bold,
    fontSize: 13.5,
    fontWeight: "700",
  },
  dueBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dueBadgeText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 11,
    fontWeight: "700",
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: fonts.sans.bold,
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 44,
  },
  gaugeContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    position: "relative",
  },
  svgWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  scoreCenter: {
    position: "absolute",
    bottom: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreNumber: {
    fontSize: 48,
    fontFamily: fonts.sans.bold,
    letterSpacing: -0.7,
    marginBottom: 4,
  },
  badgeExcellent: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeExcellentText: {
    color: "#064e3b",
    fontSize: 11,
    fontFamily: fonts.sans.semibold,
  },
  whyScoreBtn: {
    marginTop: 22,
    marginBottom: 10,
  },
  whyScoreCard: {
    overflow: "hidden",
  },
  whyScoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  whyScoreText: {
    fontSize: 14,
    fontFamily: fonts.sans.semibold,
  },
  section: {
    marginTop: 26,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.sans.bold,
    marginBottom: 14,
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  groupHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  groupTitle: {
    fontSize: 15,
    fontFamily: fonts.sans.bold,
  },
  groupCount: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  groupCountText: {
    fontSize: 11,
    fontFamily: fonts.sans.semibold,
  },
  groupContent: {
    gap: 8,
  },
  factorCard: {
    overflow: "hidden",
  },
  factorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  factorIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.cardSm,
    alignItems: "center",
    justifyContent: "center",
  },
  factorDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  factorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 3,
  },
  factorTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.sans.semibold,
  },
  factorValue: {
    fontSize: 12,
    fontFamily: fonts.mono.medium,
  },
  factorBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  factorBadgeText: {
    fontSize: 9.5,
    fontFamily: fonts.sans.bold,
  },
  badgeRed: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeRedText: {
    color: "#7f1d1d",
    fontSize: 10,
    fontFamily: fonts.sans.semibold,
  },
  badgeOrange: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeOrangeText: {
    color: "#7c2d12",
    fontSize: 10,
    fontFamily: fonts.sans.semibold,
  },
  faqItemWrapper: {
    marginBottom: 10,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.sans.semibold,
    marginRight: 12,
    lineHeight: 20,
  },
  faqAnswer: {
    fontSize: 13,
    fontFamily: fonts.sans.medium,
    lineHeight: 19,
    marginTop: 12,
  },
});
