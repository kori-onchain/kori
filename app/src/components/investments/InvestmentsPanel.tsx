import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { KoraInvestmentPool, koraApi } from "@/lib/koraApi";
import Animated from "react-native-reanimated";
import { useTheme } from "@theme/ThemeProvider";
import { useFadeUp } from "@hooks/useFadeUp";
import { EarningSummary } from "./EarningSummary";
import { EarningItemsList } from "./EarningItemsList";
import { Opportunities } from "./Opportunities";
import { EvolutionChart } from "./EvolutionChart";
import { Categories } from "./Categories";
import { Button } from "@components/layout/Button";
import { fonts } from "@theme/tokens";
import { Feather } from "@/icons";

export const InvestmentsPanel: React.FC<{
  onInvested?: (amountCents: number) => void;
}> = ({ onInvested }) => {
  const { t } = useTheme();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [pool, setPool] = useState<KoraInvestmentPool | null>(null);
  const [investVisible, setInvestVisible] = useState(false);
  const [investAmount, setInvestAmount] = useState("");
  const [investing, setInvesting] = useState(false);
  const [investError, setInvestError] = useState<string | null>(null);
  const entering = useFadeUp();

  const refreshPool = React.useCallback(() => {
    let mounted = true;
    koraApi.investments
      .pool()
      .then((summary) => {
        if (mounted) setPool(summary);
      })
      .catch(() => {
        if (mounted) setPool(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => refreshPool(), [refreshPool]);

  const confirmInvest = async () => {
    const amountCents = koraApi.money.centsFromMoney(investAmount);
    if (amountCents <= 0) {
      setInvestError("Digite um valor para investir.");
      return;
    }
    setInvesting(true);
    setInvestError(null);
    try {
      const result = await koraApi.investments.invest(amountCents);
      setPool(result.pool);
      onInvested?.(amountCents);
      setInvestAmount("");
      setInvestVisible(false);
    } catch (err: any) {
      setInvestError(err?.message || "Nao foi possivel investir agora.");
    } finally {
      setInvesting(false);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: t.bg }}
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: t.bg }]}
    >
      <Animated.View entering={entering(60)} style={{ paddingHorizontal: 20 }}>
        <EarningSummary pool={pool} onInvestPress={() => setInvestVisible(true)} />
      </Animated.View>

      <Animated.View entering={entering(120)}>
        <EvolutionChart setScrollEnabled={setScrollEnabled} />
      </Animated.View>

      <View style={{ paddingHorizontal: 20 }}>
        <Animated.View entering={entering(180)}>
          <EarningItemsList />
        </Animated.View>
        <Animated.View entering={entering(240)}>
          <Opportunities />
        </Animated.View>
        <Animated.View entering={entering(300)}>
          <Categories />
        </Animated.View>
      </View>
      <Modal
        visible={investVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setInvestVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => !investing && setInvestVisible(false)}
          />
          <View style={[styles.sheet, { backgroundColor: t.bg, borderColor: t.line }]}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={[styles.sheetTitle, { color: t.ink }]}>Investir no pool</Text>
                <Text style={[styles.sheetSubtitle, { color: t.inkDim }]}>
                  Escolha quanto alocar em recebiveis Kori.
                </Text>
              </View>
              <TouchableOpacity onPress={() => setInvestVisible(false)} disabled={investing}>
                <Feather name="x" size={22} color={t.inkDim} />
              </TouchableOpacity>
            </View>
            <TextInput
              value={investAmount}
              onChangeText={setInvestAmount}
              placeholder="R$ 0,00"
              placeholderTextColor={t.inkMute}
              keyboardType="decimal-pad"
              style={[styles.amountInput, { color: t.ink, borderColor: t.line, backgroundColor: t.bg2 }]}
            />
            {investError ? (
              <Text style={[styles.errorText, { color: t.orange }]}>{investError}</Text>
            ) : null}
            <Button
              label={investing ? "Investindo..." : "Confirmar investimento"}
              variant="primary"
              onPress={confirmInvest}
              icon={
                investing ? (
                  <ActivityIndicator size="small" color={t.btnPrimaryFg} />
                ) : (
                  <Feather name="trending-up" size={16} color={t.btnPrimaryFg} />
                )
              }
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.68)",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  sheetTitle: {
    fontFamily: fonts.sans.bold,
    fontSize: 20,
  },
  sheetSubtitle: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    marginTop: 4,
  },
  amountInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fonts.sans.bold,
    fontSize: 24,
  },
  errorText: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
  },
});

export default InvestmentsPanel;
