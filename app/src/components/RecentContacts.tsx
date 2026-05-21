import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Contact } from '../data/contacts';

interface RecentContactsProps {
  onSeeAll?: () => void;
  onInvite?: () => void;
  onContactPress?: (contact: Contact) => void;
}

export const RecentContacts: React.FC<RecentContactsProps> = ({ contacts, onSeeAll, onInvite, onContactPress }) => (
  <View style={styles.container}>
    <View style={styles.headerRow}>
      <Text style={styles.sectionTitle}>Contatos</Text>
      <TouchableOpacity style={styles.seeMoreBtn} activeOpacity={0.7} onPress={onSeeAll}>
        <Text style={styles.seeMoreText}>Ver mais</Text>
        <Feather name="chevron-right" size={14} color={COLORS.textSecondary} style={{ marginLeft: 2 }} />
      </TouchableOpacity>
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {contacts.map((contact) => (
        <TouchableOpacity key={contact.id} style={styles.contactItem} activeOpacity={0.7} onPress={() => onContactPress?.(contact)}>
          <View style={[styles.avatar, contact.isFavorite && styles.avatarFavorite]}>
            <Text style={[styles.avatarText, contact.isFavorite && styles.avatarTextFavorite]}>
              {contact.initials}
            </Text>
            {contact.isFavorite && (
              <View style={styles.favoriteBadge}>
                <FontAwesome name="star" size={10} color="#FFF" />
              </View>
            )}
          </View>
          <Text style={styles.contactName} numberOfLines={1}>
            {contact.name || contact.walletId}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.contactItem} activeOpacity={0.7} onPress={onInvite}>
        <View style={styles.inviteAvatar}>
          <Feather name="plus" size={22} color={COLORS.textSecondary} />
        </View>
        <Text style={styles.contactName} numberOfLines={1}>Convidar</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  seeMoreText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    gap: 16,
    paddingRight: 24,
  },
  contactItem: {
    alignItems: 'center',
    width: 76,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarFavorite: {
    borderColor: COLORS.primary,
    backgroundColor: '#242424',
  },
  inviteAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  favoriteBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  avatarText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatarTextFavorite: {
    color: COLORS.primary,
  },
  contactName: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
});
