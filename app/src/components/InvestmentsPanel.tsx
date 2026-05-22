import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Feather } from '../icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeProvider';
import { CryptoInvestments } from './CryptoInvestments';

const { width } = Dimensions.get('window');

export const InvestmentsPanel: React.FC = () => {
  const { t } = useTheme();
  return (
    <ScrollView 
      style={{ backgroundColor: t.bg }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: t.bg }]}
    >
      {/* Resumo do Portfólio de Investimentos */}
      <View style={[styles.portfolioSummaryCard, { borderColor: t.cardBorder }]}>
        <LinearGradient
          colors={[t.bg2, t.bgElev]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryGradient}
        >
          <View style={styles.summaryHeader}>
            <Text style={[styles.summaryLabel, { color: t.inkMute }]}>PATRIMÔNIO TOTAL</Text>
            <View style={[styles.trendBadge, { backgroundColor: t.line }]}>
              <Feather name="trending-up" size={12} color={t.green} style={{ marginRight: 4 }} />
              <Text style={[styles.trendText, { color: t.green }]}>+14.8%</Text>
            </View>
          </View>
          
          <Text style={[styles.summaryValue, { color: t.ink }]}>R$ 42.980,50</Text>
          
          <View style={[styles.divider, { backgroundColor: t.line }]} />
          
          <View style={styles.summaryFooter}>
            <View style={styles.footerItem}>
              <Text style={[styles.footerLabel, { color: t.inkMute }]}>Renda Variável</Text>
              <Text style={[styles.footerValue, { color: t.ink }]}>R$ 28.540,00</Text>
            </View>
            <View style={[styles.verticalDivider, { backgroundColor: t.line2 }]} />
            <View style={styles.footerItem}>
              <Text style={[styles.footerLabel, { color: t.inkMute }]}>Crypto Assets</Text>
              <Text style={[styles.footerValue, { color: t.ink }]}>R$ 14.440,50</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Atalhos Rápidos */}
      <View style={styles.shortcutsRow}>
        <TouchableOpacity style={[styles.shortcutButton, { backgroundColor: t.bg2, borderColor: t.cardBorder }]} activeOpacity={0.8}>
          <View style={[styles.shortcutIconContainer, { backgroundColor: t.bgElev }]}>
            <Feather name="plus-circle" size={18} color={t.green} />
          </View>
          <Text style={[styles.shortcutText, { color: t.ink }]}>Aplicar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.shortcutButton, { backgroundColor: t.bg2, borderColor: t.cardBorder }]} activeOpacity={0.8}>
          <View style={[styles.shortcutIconContainer, { backgroundColor: t.bgElev }]}>
            <Feather name="minus-circle" size={18} color={t.ink} />
          </View>
          <Text style={[styles.shortcutText, { color: t.ink }]}>Resgatar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.shortcutButton, { backgroundColor: t.bg2, borderColor: t.cardBorder }]} activeOpacity={0.8}>
          <View style={[styles.shortcutIconContainer, { backgroundColor: t.bgElev }]}>
            <Feather name="pie-chart" size={18} color={t.green} />
          </View>
          <Text style={[styles.shortcutText, { color: t.ink }]}>Análise</Text>
        </TouchableOpacity>
      </View>

      {/* Renderiza o componente existente de CryptoInvestments */}
      <View style={styles.cryptoSectionWrapper}>
        <CryptoInvestments />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  portfolioSummaryCard: {
    marginTop: 12,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  summaryGradient: {
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 208, 158, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '700',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6,
  },
  divider: {
    height: 1,
    marginVertical: 15,
  },
  summaryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 9,
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  verticalDivider: {
    width: 1,
    height: 30,
    marginHorizontal: 16,
  },
  shortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  shortcutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  shortcutIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  shortcutText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cryptoSectionWrapper: {
    marginTop: -8, // Ajuste sutil para alinhar com o layout
  },
});
