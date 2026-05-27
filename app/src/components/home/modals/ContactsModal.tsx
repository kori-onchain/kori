import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, FontAwesome } from "@/icons";
import { Contact } from "@/data/contacts";
import { useTheme } from "@theme/ThemeProvider";
import { fonts, radii } from "@theme/tokens";
import { SoftCard } from "@components/layout/SoftCard";
import { Button } from "@components/layout/Button";

interface ContactsModalProps {
  visible: boolean;
  contacts: Contact[];
  onClose: () => void;
  onAddPress?: () => void;
  onContactPress?: (contact: Contact) => void;
}

export const ContactsModal: React.FC<ContactsModalProps> = ({
  visible,
  contacts,
  onClose,
  onAddPress,
  onContactPress,
}) => {
  const { t } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter((contact) => {
    const query = searchQuery.toLowerCase();
    return (
      contact.name?.toLowerCase().includes(query) ||
      contact.walletId.toLowerCase().includes(query)
    );
  });

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={[styles.contactRow, { borderBottomColor: t.line }]}
      activeOpacity={0.75}
      onPress={() => onContactPress?.(item)}
    >
      <SoftCard radius={24} padding={0} flat style={styles.avatarCard}>
        <View style={styles.avatarInner}>
          <Text style={[styles.avatarText, { color: t.ink }]}>
            {item.initials}
          </Text>
          {item.isFavorite ? (
            <View
              style={[
                styles.favoriteBadge,
                { backgroundColor: t.orange, borderColor: t.bg },
              ]}
            >
              <FontAwesome name="star" size={8} color={t.btnPrimaryFg} />
            </View>
          ) : null}
        </View>
      </SoftCard>

      <View style={styles.contactDetails}>
        <Text style={[styles.contactName, { color: t.ink }]} numberOfLines={1}>
          {item.name || "Usuario sem nome"}
        </Text>
        <Text
          style={[styles.contactWalletId, { color: t.inkMute }]}
          numberOfLines={1}
        >
          {item.walletId}
        </Text>
      </View>

      <Button
        label="Enviar"
        variant="secondary"
        icon={<Feather name="send" size={14} color={t.ink} />}
        onPress={() => onContactPress?.(item)}
      />
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
          <TouchableOpacity onPress={onClose} activeOpacity={0.75}>
            <SoftCard radius={19} padding={0} flat style={styles.headerButton}>
              <View style={styles.headerButtonInner}>
                <Feather name="arrow-left" size={19} color={t.ink} />
              </View>
            </SoftCard>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: t.ink }]}>Contatos</Text>
          <TouchableOpacity onPress={onAddPress} activeOpacity={0.75}>
            <SoftCard radius={19} padding={0} flat style={styles.headerButton}>
              <View style={styles.headerButtonInner}>
                <Feather name="user-plus" size={18} color={t.ink} />
              </View>
            </SoftCard>
          </TouchableOpacity>
        </View>

        <SoftCard radius={radii.btn} padding={0} style={styles.searchCard}>
          <View style={styles.searchInner}>
            <Feather name="search" size={18} color={t.inkMute} />
            <TextInput
              placeholder="Pesquisar por nome ou username"
              placeholderTextColor={t.inkMute}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[styles.searchInput, { color: t.ink }]}
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Feather name="x" size={16} color={t.inkMute} />
              </TouchableOpacity>
            ) : null}
          </View>
        </SoftCard>

        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContactItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather
                name="users"
                size={44}
                color={t.inkFaint}
                style={styles.emptyIcon}
              />
              <Text style={[styles.emptyText, { color: t.inkMute }]}>
                Nenhum contato encontrado
              </Text>
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
    height: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: Platform.OS === "android" ? 24 : 0,
  },
  headerButton: {
    width: 38,
    height: 38,
  },
  headerButtonInner: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: fonts.sans.semibold,
    fontSize: 17,
    fontWeight: "700",
  },
  searchCard: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 6,
  },
  searchInner: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    paddingVertical: 0,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  avatarCard: {
    width: 48,
    height: 48,
  },
  avatarInner: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontFamily: fonts.sans.bold,
    fontSize: 14,
    fontWeight: "800",
  },
  favoriteBadge: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  contactDetails: {
    flex: 1,
    minWidth: 0,
  },
  contactName: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    fontWeight: "700",
  },
  contactWalletId: {
    fontFamily: fonts.mono.medium,
    fontSize: 11,
    marginTop: 3,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    fontWeight: "700",
  },
});
