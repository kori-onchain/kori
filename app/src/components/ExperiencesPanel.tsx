import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  Platform,
  Share
} from 'react-native';
import { Feather } from '../icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeProvider';

const { width } = Dimensions.get('window');

interface ExperienceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  costPoints: string;
  status: 'disponivel' | 'resgatado' | 'vip';
  icon: keyof typeof Feather.glyphMap;
  gradient: [string, string];
}

export const ExperiencesPanel: React.FC = () => {
  const { t } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<'tudo' | 'viagem' | 'estilo' | 'beneficio'>('tudo');
  const [userPoints] = useState('24.850');

  const experiences: ExperienceItem[] = [
    {
      id: 'lounge',
      title: 'Sala VIP Aeroportos',
      category: 'viagem',
      description: 'Acesso ilimitado às salas VIP parceiras em aeroportos internacionais com um acompanhante grátis.',
      costPoints: 'Kora Black Exclusive',
      status: 'vip',
      icon: 'map-pin',
      gradient: ['#0E362C', '#111111'],
    },
    {
      id: 'cashback',
      title: 'Cashback Turbo 3%',
      category: 'beneficio',
      description: 'Ative o cashback de 3% em todas as compras no cartão virtual Kora durante 30 dias.',
      costPoints: '4.500 pts',
      status: 'disponivel',
      icon: 'zap',
      gradient: ['#161616', '#0E362C'],
    },
    {
      id: 'concierge',
      title: 'Concierge Pessoal 24/7',
      category: 'estilo',
      description: 'Assistência exclusiva para reservas de restaurantes de alta gastronomia, hotéis de luxo e eventos globais.',
      costPoints: 'Kora VIP Access',
      status: 'vip',
      icon: 'award',
      gradient: ['#1A1A1A', '#2E200C'], // Elegant gold-dark vibe
    },
    {
      id: 'hotel',
      title: 'Kora Collection Hotéis',
      category: 'viagem',
      description: 'Diárias com upgrade de quarto automático, café da manhã incluso e early check-in em hotéis selecionados.',
      costPoints: '8.000 pts',
      status: 'disponivel',
      icon: 'compass',
      gradient: ['#0C2336', '#111111'], // Elegant dark blue
    },
    {
      id: 'ingressos',
      title: 'Pré-vendas Exclusivas',
      category: 'beneficio',
      description: 'Acesso prioritário a ingressos para shows internacionais, festivais de música e eventos de moda de luxo.',
      costPoints: '2.500 pts',
      status: 'disponivel',
      icon: 'gift',
      gradient: ['#1E1E1E', '#161616'],
    },
  ];

  const handleShareBenefit = async (benefitTitle: string) => {
    try {
      await Share.share({
        message: `Olha esse benefício incrível do Kora: ${benefitTitle}! Acesse e experimente uma nova era financeira.`,
      });
    } catch (error) {
      console.log('Error sharing benefit:', error);
    }
  };

  const filteredExperiences = selectedCategory === 'tudo'
    ? experiences
    : experiences.filter(item => item.category === selectedCategory);

  return (
    <ScrollView 
      style={{ backgroundColor: t.bg }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: t.bg }]}
    >
      {/* Cabeçalho de Pontos/Nível */}
      <View style={[styles.pointsCard, { borderColor: t.cardBorder }]}>
        <LinearGradient
          colors={[t.bg2, t.bgElev]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.pointsGradient}
        >
          <View style={styles.pointsRow}>
            <View>
              <Text style={[styles.pointsLabel, { color: t.inkMute }]}>SEUS PONTOS ACUMULADOS</Text>
              <Text style={[styles.pointsValue, { color: t.ink }]}>{userPoints} <Text style={[styles.pointsUnit, { color: t.green }]}>PTS</Text></Text>
            </View>
            <View style={[styles.tierBadge, { backgroundColor: t.line, borderColor: t.line2 }]}>
              <Feather name="award" size={14} color={t.green} style={{ marginRight: 4 }} />
              <Text style={[styles.tierText, { color: t.green }]}>BLACK</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: t.line }]} />

          <View style={styles.pointsFooter}>
            <Text style={[styles.footerText, { color: t.inkMute }]}>Próximo nível: <Text style={[styles.boldText, { color: t.ink }]}>Kora Private</Text></Text>
            <Text style={[styles.progressText, { color: t.green }]}>Faltam 5.150 pts</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Filtros de Categorias (Pílulas) */}
      <View style={styles.categoriesWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          <TouchableOpacity 
            style={[styles.categoryPill, { backgroundColor: t.bg2, borderColor: t.cardBorder }, selectedCategory === 'tudo' && { backgroundColor: t.bgElev, borderColor: t.orange }]}
            onPress={() => setSelectedCategory('tudo')}
            activeOpacity={0.7}
          >
            <Text style={[styles.categoryText, { color: selectedCategory === 'tudo' ? t.orange : t.inkMute }]}>
              Tudo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.categoryPill, { backgroundColor: t.bg2, borderColor: t.cardBorder }, selectedCategory === 'viagem' && { backgroundColor: t.bgElev, borderColor: t.orange }]}
            onPress={() => setSelectedCategory('viagem')}
            activeOpacity={0.7}
          >
            <Text style={[styles.categoryText, { color: selectedCategory === 'viagem' ? t.orange : t.inkMute }]}>
              Viagem & Lazer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.categoryPill, { backgroundColor: t.bg2, borderColor: t.cardBorder }, selectedCategory === 'beneficio' && { backgroundColor: t.bgElev, borderColor: t.orange }]}
            onPress={() => setSelectedCategory('beneficio')}
            activeOpacity={0.7}
          >
            <Text style={[styles.categoryText, { color: selectedCategory === 'beneficio' ? t.orange : t.inkMute }]}>
              Benefícios
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.categoryPill, { backgroundColor: t.bg2, borderColor: t.cardBorder }, selectedCategory === 'estilo' && { backgroundColor: t.bgElev, borderColor: t.orange }]}
            onPress={() => setSelectedCategory('estilo')}
            activeOpacity={0.7}
          >
            <Text style={[styles.categoryText, { color: selectedCategory === 'estilo' ? t.orange : t.inkMute }]}>
              Estilo de Vida
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Lista de Experiências */}
      <View style={styles.listSection}>
        <Text style={[styles.sectionTitle, { color: t.ink }]}>Experiências Disponíveis</Text>
        
        {filteredExperiences.map((item) => (
          <View key={item.id} style={[styles.experienceCard, { borderColor: t.cardBorder }]}>
            <LinearGradient
              colors={[t.bg2, t.bgElev]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Feather name={item.icon} size={20} color={t.green} />
                </View>
                
                <View style={[styles.statusBadge, { backgroundColor: t.line, borderColor: t.line2 }]}>
                  <Text style={[styles.statusText, { color: t.green }]}>
                    {item.status === 'vip' ? 'EXCLUSIVO' : item.costPoints}
                  </Text>
                </View>
              </View>

              <Text style={[styles.cardTitle, { color: t.ink }]}>{item.title}</Text>
              <Text style={[styles.cardDescription, { color: t.inkMute }]}>{item.description}</Text>

              <View style={styles.cardFooter}>
                <TouchableOpacity 
                  style={[
                    styles.actionButton,
                    item.status === 'vip'
                      ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: t.green }
                      : { backgroundColor: t.btnPrimaryBg }
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.actionButtonText,
                    { color: item.status === 'vip' ? t.green : t.btnPrimaryFg }
                  ]}>
                    {item.status === 'vip' ? 'Ver Benefício VIP' : 'Resgatar Agora'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.shareButton, { backgroundColor: t.bgElev }]}
                  onPress={() => handleShareBenefit(item.title)}
                  activeOpacity={0.7}
                >
                  <Feather name="share-2" size={18} color={t.inkMute} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  pointsCard: {
    marginTop: 12,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  pointsGradient: {
    padding: 20,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  pointsUnit: {
    fontSize: 14,
    fontWeight: '600',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tierText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    marginVertical: 15,
  },
  pointsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
  },
  boldText: {
    fontWeight: '600',
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
  },
  categoriesWrapper: {
    marginVertical: 20,
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 1,
  },
  activePill: {
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeCategoryText: {
  },
  listSection: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  experienceCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  redeemButton: {
  },
  redeemButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  vipButton: {
  },
  vipButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  shareButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
