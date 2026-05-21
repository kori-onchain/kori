import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const menuItems = [
  { id: 'inicio', title: 'Início', icon: 'home' as const },
  { id: 'cartao', title: 'Cartão', icon: 'credit-card' as const },
  { id: 'investimentos', title: 'Investimentos', icon: 'trending-up' as const },
  { id: 'experiencias', title: 'Experiências', icon: 'compass' as const },
];

interface BottomMenuProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const BottomMenu: React.FC<BottomMenuProps> = ({
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab,
}) => {
  const [internalActiveTab, internalSetActiveTab] = useState('inicio');

  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  const setActiveTab = externalSetActiveTab !== undefined ? externalSetActiveTab : internalSetActiveTab;

  return (
    <View style={styles.container}>
      {menuItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => setActiveTab(item.id)}
            activeOpacity={0.7}
          >
            <Feather name={item.icon} size={22} color={isActive ? '#FFFFFF' : COLORS.textSecondary} />
            <Text style={[styles.menuText, { color: isActive ? '#FFFFFF' : COLORS.textSecondary }]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#161616',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 9,
    marginTop: 6,
    fontWeight: '600',
    textAlign: 'center',
  },
});
