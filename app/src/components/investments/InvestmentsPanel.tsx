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
  onRedeemed?: (amountCents: number) => void;
}> = ({ onInvested, onRedeemed }) => {
  const { t } = useTheme();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [pool, setPool] = useState<KoraInvestmentPool | null>(null);
  const [investVisible, setInvestVisible] = useState(false);
  const [investAmount, setInvestAmount] = useState("");
  const [investing, setInvesting] = useState(false);
  const [investError, setInvestError] = useState<string | null>(null);
  const [redeemVisible, setRedeemVisible] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const entering = useFadeUp();

  const positionCents = (pool?.userInvestedCents ?? 0) + (pool?.userYieldCents ?? 0);

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

  const confirmRedeem = async () => {
    const amountCents = koraApi.money.centsFromMoney(redeemAmount);
    if (amountCents <= 0) {
      setRedeemError("Digite um valor para resgatar.");
      return;
    }
    if (amountCents > positionCents) {
      setRedeemError(
        `Você só tem ${koraApi.money.formatCents(positionCents)} para resgatar.`,
      );
      return;
    }
    setRedeeming(true);
    setRedeemError(null);
    try {
      const result = await koraApi.investments.redeem(amountCents);
      setPool(result.pool);
      onRedeemed?.(result.amountCents);
      setRedeemAmount("");
      setRedeemVisible(false);
    } catch (err: any) {
      setRedeemError(err?.message || "Nao foi possivel resgatar agora.");
    } finally {
      setRedeeming(false);
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
        <EarningSummary
          pool={pool}
          onInvestPress={() => setInvestVisible(true)}
          onRedeemPress={() => {
            setRedeemError(null);
            setRedeemAmount("");
            setRedeemVisible(true);
          }}
        />
      </Animated.View>

      <Animated.View entering={entering(120)}>
        <EvolutionChart setScrollEnabled={setScrollEnabled} pool={pool} />
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

      <Modal
        visible={redeemVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRedeemVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => !redeeming && setRedeemVisible(false)}
          />
          <View style={[styles.sheet, { backgroundColor: t.bg, borderColor: t.line }]}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={[styles.sheetTitle, { color: t.ink }]}>Resgatar do pool</Text>
                <Text style={[styles.sheetSubtitle, { color: t.inkDim }]}>
                  Disponível para resgate: {koraApi.money.formatCents(positionCents)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setRedeemVisible(false)} disabled={redeeming}>
                <Feather name="x" size={22} color={t.inkDim} />
              </TouchableOpacity>
            </View>
            <TextInput
              value={redeemAmount}
              onChangeText={setRedeemAmount}
              placeholder="R$ 0,00"
              placeholderTextColor={t.inkMute}
              keyboardType="decimal-pad"
              style={[styles.amountInput, { color: t.ink, borderColor: t.line, backgroundColor: t.bg2 }]}
            />
            <TouchableOpacity
              onPress={() =>
                setRedeemAmount((positionCents / 100).toFixed(2).replace(".", ","))
              }
              disabled={redeeming || positionCents <= 0}
            >
              <Text style={[styles.maxText, { color: t.orange }]}>Resgatar tudo</Text>
            </TouchableOpacity>
            {redeemError ? (
              <Text style={[styles.errorText, { color: t.orange }]}>{redeemError}</Text>
            ) : null}
            <Button
              label={redeeming ? "Resgatando..." : "Confirmar resgate"}
              variant="primary"
              onPress={confirmRedeem}
              icon={
                redeeming ? (
                  <ActivityIndicator size="small" color={t.btnPrimaryFg} />
                ) : (
                  <Feather name="arrow-down-circle" size={16} color={t.btnPrimaryFg} />
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
  maxText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 12,
    marginTop: -4,
  },
});

export default InvestmentsPanel;
