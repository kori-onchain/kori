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
import { Feather, FontAwesome } from '../icons';
import { useTheme } from '../theme/ThemeProvider';
import { Contact } from '../data/contacts';

interface ContactsModalProps {
  visible: boolean;
  contacts: Contact[];
  onClose: () => void;
  onAddPress?: () => void;
  onContactPress?: (contact: Contact) => void;
}

export const ContactsModal: React.FC<ContactsModalProps> = ({ visible, contacts, onClose, onAddPress, onContactPress }) => {
  const { t } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter((contact) => {
    const nameMatch = contact.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const walletMatch = contact.walletId.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || walletMatch;
  });

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity style={[styles.contactRow, { borderBottomColor: t.line }]} activeOpacity={0.7} onPress={() => onContactPress?.(item)}>
      <View style={[styles.avatar, { backgroundColor: t.bg2 }, item.isFavorite && { borderColor: t.orange, backgroundColor: t.bgElev }]}>
        <Text style={[styles.avatarText, { color: item.isFavorite ? t.orange : t.ink }]}>
          {item.initials}
        </Text>
        {item.isFavorite && (
          <View style={[styles.favoriteBadge, { backgroundColor: t.orange, borderColor: t.bg }]}>
            <FontAwesome name="star" size={9} color={t.btnPrimaryFg} />
          </View>
        )}
      </View>

      <View style={styles.contactDetails}>
        <Text style={[styles.contactName, { color: t.ink }]}>
          {item.name || 'Usuário Sem Nome'}
        </Text>
        <Text style={[styles.contactWalletId, { color: t.inkMute }]}>
          {item.walletId}
        </Text>
      </View>

      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: t.bg2, borderColor: t.cardBorder }]} onPress={() => onContactPress?.(item)}>
        <Feather name="send" size={16} color={t.orange} />
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
      <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
        <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />
        
        <View style={[styles.header, { borderBottomColor: t.line }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="arrow-left" size={24} color={t.ink} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: t.ink }]}>Seus Contatos</Text>
          <TouchableOpacity style={styles.addBtn} onPress={onAddPress} activeOpacity={0.7}>
            <Feather name="user-plus" size={22} color={t.orange} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
          <Feather name="search" size={18} color={t.inkMute} />
          <TextInput
            placeholder="Pesquisar por nome ou username..."
            placeholderTextColor={t.inkMute}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: t.ink }]}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color={t.inkMute} />
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
              <Feather name="users" size={48} color={t.inkFaint} style={{ marginBottom: 12 }} />
              <Text style={[styles.emptyText, { color: t.inkMute }]}>Nenhum contato encontrado</Text>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    marginTop: Platform.OS === 'android' ? 24 : 0,
  },
  closeBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  addBtn: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
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
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarFavorite: {
  },
  avatarText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  avatarTextFavorite: {
  },
  favoriteBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  contactDetails: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
  },
  contactWalletId: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
