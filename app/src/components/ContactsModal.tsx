import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Contact } from '../data/contacts';

interface ContactsModalProps {
  visible: boolean;
  contacts: Contact[];
  onClose: () => void;
  onAddPress?: () => void;
  onContactPress?: (contact: Contact) => void;
}

export const ContactsModal: React.FC<ContactsModalProps> = ({ visible, contacts, onClose, onAddPress, onContactPress }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter((contact) => {
    const nameMatch = contact.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const walletMatch = contact.walletId.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || walletMatch;
  });

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity style={styles.contactRow} activeOpacity={0.7} onPress={() => onContactPress?.(item)}>
      <View style={[styles.avatar, item.isFavorite && styles.avatarFavorite]}>
        <Text style={[styles.avatarText, item.isFavorite && styles.avatarTextFavorite]}>
          {item.initials}
        </Text>
        {item.isFavorite && (
          <View style={styles.favoriteBadge}>
            <FontAwesome name="star" size={9} color="#FFF" />
          </View>
        )}
      </View>

      <View style={styles.contactDetails}>
        <Text style={styles.contactName}>
          {item.name || 'Usuário Sem Nome'}
        </Text>
        <Text style={styles.contactWalletId}>
          {item.walletId}
        </Text>
      </View>

      <TouchableOpacity style={styles.actionBtn} onPress={() => onContactPress?.(item)}>
        <Feather name="send" size={16} color={COLORS.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Seus Contatos</Text>
          <TouchableOpacity style={styles.addBtn} onPress={onAddPress} activeOpacity={0.7}>
            <Feather name="user-plus" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#666" />
          <TextInput
            placeholder="Pesquisar por nome ou username..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContactItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="users" size={48} color="#262626" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyText}>Nenhum contato encontrado</Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#161616',
    marginTop: Platform.OS === 'android' ? 24 : 0,
  },
  closeBtn: {
    padding: 4,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  addBtn: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#262626',
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    marginLeft: 8,
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#161616',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarFavorite: {
    borderColor: COLORS.primary,
    backgroundColor: '#242424',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  avatarTextFavorite: {
    color: COLORS.primary,
  },
  favoriteBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0D0D0D',
  },
  contactDetails: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  contactWalletId: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#161616',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#262626',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
});
