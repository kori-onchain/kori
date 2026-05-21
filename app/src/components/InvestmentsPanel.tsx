import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { CryptoInvestments } from './CryptoInvestments';

const { width } = Dimensions.get('window');

export const InvestmentsPanel: React.FC = () => {
  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Resumo do Portfólio de Investimentos */}
      <View style={styles.portfolioSummaryCard}>
        <LinearGradient
          colors={['#161616', '#0E362C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryGradient}
        >
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryLabel}>PATRIMÔNIO TOTAL</Text>
            <View style={styles.trendBadge}>
              <Feather name="trending-up" size={12} color="#00D09E" style={{ marginRight: 4 }} />
              <Text style={styles.trendText}>+14.8%</Text>
            </View>
          </View>
          
          <Text style={styles.summaryValue}>R$ 42.980,50</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryFooter}>
            <View style={styles.footerItem}>
              <Text style={styles.footerLabel}>Renda Variável</Text>
              <Text style={styles.footerValue}>R$ 28.540,00</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.footerItem}>
              <Text style={styles.footerLabel}>Crypto Assets</Text>
              <Text style={styles.footerValue}>R$ 14.440,50</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Atalhos Rápidos */}
      <View style={styles.shortcutsRow}>
        <TouchableOpacity style={styles.shortcutButton} activeOpacity={0.8}>
          <View style={styles.shortcutIconContainer}>
            <Feather name="plus-circle" size={18} color="#00D09E" />
          </View>
          <Text style={styles.shortcutText}>Aplicar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shortcutButton} activeOpacity={0.8}>
          <View style={styles.shortcutIconContainer}>
            <Feather name="minus-circle" size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.shortcutText}>Resgatar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shortcutButton} activeOpacity={0.8}>
          <View style={styles.shortcutIconContainer}>
            <Feather name="pie-chart" size={18} color="#00D09E" />
          </View>
          <Text style={styles.shortcutText}>Análise</Text>
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
    color: COLORS.textSecondary,
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
    color: '#00D09E',
    fontSize: 10,
    fontWeight: '700',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.02)',
  },
  shortcutIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  shortcutText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  cryptoSectionWrapper: {
    marginTop: -8, // Ajuste sutil para alinhar com o layout
  },
});
