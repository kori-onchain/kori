import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { fonts, radii } from "@theme/tokens";
import { useTheme } from "@theme/ThemeProvider";

export const InvestBanner: React.FC = () => {
  const { t } = useTheme();

  return (
    <View style={styles.wrapper}>
      {/* Left card — text CTA */}
      <View
        style={[
          styles.leftCard,
          { backgroundColor: t.bg2, borderColor: t.cardBorder },
        ]}
      >
        <View
          style={[styles.badge, { backgroundColor: "rgba(255,165,0,0.15)" }]}
        >
          <Text style={[styles.badgeText, { color: "#F59E0B" }]}>
            Não tenha dúvidas!
          </Text>
        </View>

        <Text style={[styles.title, { color: t.ink }]}>
          {"Guarde seu\ndinheiro por\nobjetivo aqui"}
        </Text>

        <TouchableOpacity activeOpacity={0.8} style={styles.ctaRow}>
          <View
            style={[
              styles.ctaArrow,
              { backgroundColor: "rgba(255,107,61,0.2)" },
            ]}
          >
            <Text style={{ color: t.orange, fontSize: 16, fontWeight: "700" }}>
              →
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Right card — decorative piggy */}
      <LinearGradient
        colors={["#F59E0B", "#E67E22"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.rightCard}
      >
        {/* Floating decorative items */}
        <View style={styles.decoTopRight}>
          <Text style={styles.decoEmoji}>🏠</Text>
        </View>
        <View style={styles.decoTopLeft}>
          <Text style={styles.decoEmoji}>🧳</Text>
        </View>
        <View style={styles.decoBottomLeft}>
          <Text style={styles.decoEmoji}>🚗</Text>
        </View>
        <View style={styles.decoBottomRight}>
          <Text style={styles.decoEmoji}>🛂</Text>
        </View>

        {/* Central piggy */}
        <Text style={styles.piggy}>🐷</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  leftCard: {
    flex: 1.1,
    borderRadius: radii.card,
    borderWidth: 1,
    padding: 16,
    justifyContent: "space-between",
    minHeight: 160,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  badgeText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  title: {
    fontFamily: fonts.sans.bold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ctaArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  rightCard: {
    flex: 0.9,
    borderRadius: radii.card,
    minHeight: 160,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  piggy: {
    fontSize: 64,
  },
  decoTopRight: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  decoTopLeft: {
    position: "absolute",
    top: 12,
    left: 10,
  },
  decoBottomLeft: {
    position: "absolute",
    bottom: 12,
    left: 12,
  },
  decoBottomRight: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  decoEmoji: {
    fontSize: 20,
  },
});
