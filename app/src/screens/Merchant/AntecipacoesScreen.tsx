import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import Animated from "react-native-reanimated";
import { useTheme } from "@theme/ThemeProvider";
import { fonts, radii } from "@theme/tokens";
import { Header } from "@components/home/Header";
import { SoftCard } from "@components/layout/SoftCard";
import { Button } from "@components/layout/Button";
import { useFadeUp } from "@hooks/useFadeUp";
import { useReceivables, Receivable } from "@hooks/useReceivables";
import { Feather } from "@/icons";

interface AntecipacoesScreenProps {
  headerProps: React.ComponentProps<typeof Header>;
}

export const AntecipacoesScreen: React.FC<AntecipacoesScreenProps> = ({
  headerProps,
}) => {
  const { t } = useTheme();
  const entering = useFadeUp();
  const {
    receivables,
    isLoading,
    selected,
    toggleSelect,
    selectAll,
    allSelected,
    selectedSummary,
    totalGross,
    totalNet,
    advanceRate,
    confirmAdvance,
    showConfirmation,
    setShowConfirmation,
    isProcessing,
    receipt,
    dismissReceipt,
  } = useReceivables();

  return (
    <View style={[styles.root, { backgroundColor: t.bg }]}>
      <View style={[styles.safeArea, { backgroundColor: t.bg }]}>
        <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} translucent />
        <View style={styles.headerLayer}>
          <Header {...headerProps} />
        </View>

        {receipt ? (
          <ScrollView
            style={{ backgroundColor: t.bg }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.receiptContainer}
          >
            <Animated.View entering={entering(60)} style={styles.receiptIconWrap}>
              <View style={[styles.receiptIconCircle, { backgroundColor: t.green + "18" }]}>
                <Feather name="check-circle" size={48} color={t.green} />
              </View>
            </Animated.View>

            <Animated.View entering={entering(120)}>
              <Text style={[styles.receiptTitle, { color: t.ink }]}>
                Antecipação realizada
              </Text>
              <Text style={[styles.receiptSubtitle, { color: t.inkMute }]}>
                O valor líquido será creditado na sua conta em instantes.
              </Text>
            </Animated.View>

            <Animated.View entering={entering(180)}>
              <SoftCard radius={radii.card} padding={20}>
                <View style={styles.receiptRow}>
                  <Text style={[styles.receiptLabel, { color: t.inkDim }]}>Protocolo</Text>
                  <Text style={[styles.receiptValue, { color: t.ink }]}>{receipt.protocol}</Text>
                </View>
                <View style={[styles.receiptDivider, { backgroundColor: t.line }]} />
                <View style={styles.receiptRow}>
                  <Text style={[styles.receiptLabel, { color: t.inkDim }]}>Recebíveis</Text>
                  <Text style={[styles.receiptValue, { color: t.ink }]}>{receipt.count}</Text>
                </View>
                <View style={[styles.receiptDivider, { backgroundColor: t.line }]} />
                <View style={styles.receiptRow}>
                  <Text style={[styles.receiptLabel, { color: t.inkDim }]}>Total bruto</Text>
                  <Text style={[styles.receiptValue, { color: t.ink }]}>{receipt.gross}</Text>
                </View>
                <View style={[styles.receiptDivider, { backgroundColor: t.line }]} />
                <View style={styles.receiptRow}>
                  <Text style={[styles.receiptLabel, { color: t.inkDim }]}>Taxa</Text>
                  <Text style={[styles.receiptValue, { color: t.orange }]}>{receipt.rate}</Text>
                </View>
                <View style={[styles.receiptDivider, { backgroundColor: t.line }]} />
                <View style={styles.receiptRow}>
                  <Text style={[styles.receiptLabel, { color: t.inkDim }]}>Líquido creditado</Text>
                  <Text style={[styles.receiptValueBig, { color: t.green }]}>{receipt.net}</Text>
                </View>
                <View style={[styles.receiptDivider, { backgroundColor: t.line }]} />
                <View style={styles.receiptRow}>
                  <Text style={[styles.receiptLabel, { color: t.inkDim }]}>Data</Text>
                  <Text style={[styles.receiptValue, { color: t.ink }]}>{receipt.date}</Text>
                </View>
              </SoftCard>
            </Animated.View>

            <Animated.View entering={entering(240)} style={styles.receiptBtnWrap}>
              <Button
                label="Voltar para recebíveis"
                variant="primary"
                onPress={dismissReceipt}
                full
                icon={<Feather name="arrow-left" size={16} color={t.btnPrimaryFg} />}
              />
            </Animated.View>
          </ScrollView>
        ) : isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={t.orange} />
          </View>
        ) : receivables.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color={t.inkFaint} />
            <Text style={[styles.emptyTitle, { color: t.ink }]}>
              Nenhum recebível pendente
            </Text>
            <Text style={[styles.emptySubtitle, { color: t.inkMute }]}>
              Seus recebíveis aparecerão aqui quando você tiver vendas
              parceladas.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{ backgroundColor: t.bg }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
          >
            {/* Hero summary card */}
            <Animated.View entering={entering(60)}>
              <SoftCard
                radius={radii.card}
                padding={20}
                style={styles.heroCard}
              >
                <Text style={[styles.heroLabel, { color: t.inkMute }]}>
                  TOTAL DISPONÍVEL PARA ANTECIPAR
                </Text>
                <Text style={[styles.heroAmount, { color: t.ink }]}>
                  {totalGross}
                </Text>
                <View style={styles.heroRow}>
                  <View style={styles.heroStat}>
                    <Text style={[styles.heroStatLabel, { color: t.inkMute }]}>
                      Líquido estimado
                    </Text>
                    <Text style={[styles.heroStatValue, { color: t.green }]}>
                      {totalNet}
                    </Text>
                  </View>
                  <View
                    style={[styles.heroDivider, { backgroundColor: t.line }]}
                  />
                  <View style={styles.heroStat}>
                    <Text style={[styles.heroStatLabel, { color: t.inkMute }]}>
                      Taxa
                    </Text>
                    <Text style={[styles.heroStatValue, { color: t.orange }]}>
                      {advanceRate}
                    </Text>
                  </View>
                </View>
              </SoftCard>
            </Animated.View>

            {/* List header */}
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

            {/* Receivables list */}
            {receivables.map((item: Receivable, i: number) => {
              const isSelected = selected.has(item.id);
              return (
                <Animated.View
                  key={item.id}
                  entering={entering(160 + i * 40)}
                >
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
                                borderColor: isSelected
                                  ? t.orange
                                  : t.inkMute,
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
                              style={[
                                styles.cardInstall,
                                { color: t.inkMute },
                              ]}
                            >
                              {item.installments}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.cardRight}>
                          <Text style={[styles.cardGross, { color: t.ink }]}>
                            {item.grossAmount}
                          </Text>
                          <Text style={[styles.cardNet, { color: t.inkMute }]}>
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

            {/* Selection summary + CTA */}
            {selected.size > 0 && (
              <Animated.View entering={entering(60)} style={styles.ctaWrapper}>
                <SoftCard radius={radii.card} padding={16}>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: t.inkDim }]}>
                      {selectedSummary.count}{" "}
                      {selectedSummary.count === 1
                        ? "recebível"
                        : "recebíveis"}
                    </Text>
                    <Text style={[styles.summaryValue, { color: t.ink }]}>
                      {selectedSummary.gross}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: t.inkDim }]}>
                      Líquido estimado
                    </Text>
                    <Text style={[styles.summaryValue, { color: t.green }]}>
                      {selectedSummary.net}
                    </Text>
                  </View>
                </SoftCard>

                <View style={styles.ctaBtnWrap}>
                  <Button
                    label={`Antecipar ${selectedSummary.count} ${selectedSummary.count === 1 ? "recebível" : "recebíveis"}`}
                    variant="primary"
                    onPress={() => setShowConfirmation(true)}
                    full
                    icon={
                      <Feather
                        name="zap"
                        size={16}
                        color={t.btnPrimaryFg}
                      />
                    }
                  />
                </View>
              </Animated.View>
            )}
          </ScrollView>
        )}

        {/* Confirmation Drawer */}
        <Modal
          visible={showConfirmation}
          transparent
          animationType="slide"
          onRequestClose={() => !isProcessing && setShowConfirmation(false)}
          statusBarTranslucent
        >
          <View style={styles.drawerOverlay}>
            <TouchableOpacity
              style={styles.drawerBackdrop}
              activeOpacity={1}
              onPress={() => !isProcessing && setShowConfirmation(false)}
            >
              <View style={{ flex: 1 }} />
            </TouchableOpacity>
            <View
              style={[
                styles.drawer,
                { backgroundColor: t.bg, borderColor: t.line },
              ]}
            >
              <View style={[styles.handleBar, { backgroundColor: t.inkFaint }]} />

              <View style={styles.drawerBody}>
                <View
                  style={[
                    styles.drawerIconCircle,
                    { backgroundColor: "rgba(255, 107, 61, 0.12)" },
                  ]}
                >
                  <Feather name="zap" size={28} color={t.orange} />
                </View>

                <Text style={[styles.drawerTitle, { color: t.ink }]}>
                  Confirmar antecipação
                </Text>
                <Text style={[styles.drawerDesc, { color: t.inkDim }]}>
                  Você está antecipando {selectedSummary.count}{" "}
                  {selectedSummary.count === 1 ? "recebível" : "recebíveis"}.
                  Confira os detalhes abaixo.
                </Text>

                <View
                  style={[
                    styles.drawerCard,
                    { backgroundColor: t.bgElev, borderColor: t.line },
                  ]}
                >
                  <View style={styles.drawerRow}>
                    <Text style={[styles.drawerLabel, { color: t.inkDim }]}>
                      Recebíveis
                    </Text>
                    <Text style={[styles.drawerValue, { color: t.ink }]}>
                      {selectedSummary.count}
                    </Text>
                  </View>
                  <View style={[styles.drawerDivider, { backgroundColor: t.line }]} />
                  <View style={styles.drawerRow}>
                    <Text style={[styles.drawerLabel, { color: t.inkDim }]}>
                      Total bruto
                    </Text>
                    <Text style={[styles.drawerValue, { color: t.ink }]}>
                      {selectedSummary.gross}
                    </Text>
                  </View>
                  <View style={[styles.drawerDivider, { backgroundColor: t.line }]} />
                  <View style={styles.drawerRow}>
                    <Text style={[styles.drawerLabel, { color: t.inkDim }]}>
                      Taxa
                    </Text>
                    <Text style={[styles.drawerValue, { color: t.orange }]}>
                      {advanceRate}
                    </Text>
                  </View>
                  <View style={[styles.drawerDivider, { backgroundColor: t.line }]} />
                  <View style={styles.drawerRow}>
                    <Text style={[styles.drawerLabel, { color: t.inkDim }]}>
                      Líquido a receber
                    </Text>
                    <Text style={[styles.drawerValueBig, { color: t.green }]}>
                      {selectedSummary.net}
                    </Text>
                  </View>
                </View>

                {isProcessing ? (
                  <View style={styles.processingWrap}>
                    <ActivityIndicator size="small" color={t.orange} />
                    <Text style={[styles.processingText, { color: t.inkMute }]}>
                      Processando antecipação...
                    </Text>
                  </View>
                ) : (
                  <View style={styles.drawerActions}>
                    <Button
                      label="Confirmar antecipação"
                      variant="primary"
                      onPress={confirmAdvance}
                      full
                      icon={<Feather name="check" size={16} color={t.btnPrimaryFg} />}
                    />
                    <Button
                      label="Cancelar"
                      variant="secondary"
                      onPress={() => setShowConfirmation(false)}
                      full
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  headerLayer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    zIndex: 1000,
    elevation: 1000,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 12,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: fonts.sans.semibold,
    fontSize: 18,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  emptySubtitle: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },

  // Hero
  heroCard: { marginBottom: 24 },
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

  // Summary + CTA
  ctaWrapper: { marginTop: 12, gap: 12 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  summaryLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
  },
  summaryValue: {
    fontFamily: fonts.sans.bold,
    fontSize: 14,
  },
  ctaBtnWrap: {
    marginTop: 4,
  },

  // Confirmation drawer
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  drawerBackdrop: {
    flex: 1,
  },
  drawer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    overflow: "hidden",
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  drawerBody: {
    paddingHorizontal: 24,
    alignItems: "center",
    paddingBottom: 8,
  },
  drawerIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  drawerTitle: {
    fontFamily: fonts.sans.bold,
    fontSize: 20,
    letterSpacing: -0.4,
    textAlign: "center",
    marginBottom: 8,
  },
  drawerDesc: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  drawerCard: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  drawerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  drawerDivider: {
    height: 1,
  },
  drawerLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
  },
  drawerValue: {
    fontFamily: fonts.mono.semibold,
    fontSize: 14,
    letterSpacing: 0.2,
  },
  drawerValueBig: {
    fontFamily: fonts.sans.bold,
    fontSize: 18,
    letterSpacing: -0.3,
  },
  drawerActions: {
    width: "100%",
    gap: 10,
  },
  processingWrap: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 20,
  },
  processingText: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
  },

  // Receipt / success screen
  receiptContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    gap: 24,
    alignItems: "center",
  },
  receiptIconWrap: {
    alignItems: "center",
    marginBottom: 4,
  },
  receiptIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  receiptTitle: {
    fontFamily: fonts.sans.bold,
    fontSize: 22,
    letterSpacing: -0.4,
    textAlign: "center",
  },
  receiptSubtitle: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 6,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  receiptDivider: {
    height: 1,
  },
  receiptLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
  },
  receiptValue: {
    fontFamily: fonts.mono.semibold,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  receiptValueBig: {
    fontFamily: fonts.sans.bold,
    fontSize: 18,
    letterSpacing: -0.3,
  },
  receiptBtnWrap: {
    width: "100%",
    marginTop: 8,
  },
});
