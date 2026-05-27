import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, FontAwesome } from "@/icons";
import { Contact } from "@/data/contacts";
import { PaymentRecipient } from "@type/payment";
import { useTheme } from "@theme/ThemeProvider";
import {
  PaymentCard,
  PaymentPrimaryButton,
  PaymentScreenFrame,
  SectionTitle,
} from "@components/home/modals/PaymentDS";
import { fonts, radii } from "@theme/tokens";
import { SoftCard } from "@components/layout/SoftCard";
import { Button } from "@components/layout/Button";
import { AddContactModal } from "@components/home/modals/AddContactModal";

const WALLET_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

interface ManualEntryScreenProps {
  onContinue: (recipient: PaymentRecipient) => void;
  onBack: () => void;
  onClose: () => void;
  contacts: Contact[];
  onAddContact: (name: string, walletId: string) => void;
}

export const ManualEntryScreen: React.FC<ManualEntryScreenProps> = ({
  onContinue,
  onBack,
  onClose,
  contacts,
  onAddContact,
}) => {
  const { t } = useTheme();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [addContactVisible, setAddContactVisible] = useState(false);

  const isWallet = WALLET_REGEX.test(value.trim());
  const isEmpty = value.trim().length === 0;

  const resolveRecipient = (raw: string): PaymentRecipient | null => {
    const trimmed = raw.trim();
    if (!trimmed) return null;

    if (WALLET_REGEX.test(trimmed)) {
      return {
        type: "wallet",
        displayName: "Anônimo",
        walletAddress: trimmed,
        isAnonymous: true,
        isFavorite: false,
      };
    }

    const handle = trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
    const contact = contacts.find((c) => c.walletId === handle);

    return {
      type: "id",
      displayName: contact?.name ?? trimmed.replace("@", ""),
      userId: handle,
      isAnonymous: false,
      isFavorite: contact?.isFavorite ?? false,
    };
  };

  const handleContinue = () => {
    const recipient = resolveRecipient(value);
    if (!recipient) {
      setError("Digite um ID válido ou endereço de carteira.");
      return;
    }
    setError("");
    onContinue(recipient);
  };

  const handleSelectContact = (contact: Contact) => {
    const recipient: PaymentRecipient = {
      type: "id",
      displayName: contact.name || contact.walletId.replace("@", ""),
      userId: contact.walletId,
      isAnonymous: false,
      isFavorite: contact.isFavorite,
    };
    onContinue(recipient);
  };

  const filteredContacts = contacts.filter((contact) => {
    const query = value.toLowerCase();
    return (
      contact.name?.toLowerCase().includes(query) ||
      contact.walletId.toLowerCase().includes(query)
    );
  });

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={[styles.contactRow, { borderBottomColor: t.line }]}
      activeOpacity={0.7}
      onPress={() => handleSelectContact(item)}
    >
      <SoftCard radius={24} padding={0} flat style={styles.avatarCard}>
        <View style={[styles.avatarInner, { backgroundColor: t.bgElev }]}>
          <Text style={[styles.avatarText, { color: t.ink }]}>
            {item.initials}
          </Text>
          {item.isFavorite ? (
            <View
              style={[
                styles.favoriteBadge,
                { backgroundColor: t.bgElev, borderColor: t.line },
              ]}
            >
              <FontAwesome name="star" size={8} color="#FFD700" />
            </View>
          ) : null}
        </View>
      </SoftCard>

      <View style={styles.contactDetails}>
        <Text style={[styles.contactName, { color: t.ink }]} numberOfLines={1}>
          {item.name || "Usuário sem nome"}
        </Text>
        <Text
          style={[styles.contactWalletId, { color: t.inkMute }]}
          numberOfLines={1}
        >
          {item.walletId}
        </Text>
      </View>

      <Feather name="chevron-right" size={16} color={t.inkMute} />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={[styles.label, { color: t.inkMute }]}>ID ou carteira</Text>
      <PaymentCard padding={14}>
        <View style={styles.inputRow}>
          <Feather
            name={isWallet ? "shield" : "at-sign"}
            size={18}
            color={t.inkDim}
          />
          <TextInput
            style={[styles.input, { color: t.ink }]}
            placeholder="@usuario ou endereço da carteira"
            placeholderTextColor={t.inkMute}
            value={value}
            onChangeText={(next) => {
              setValue(next);
              setError("");
            }}
            autoCorrect={false}
            autoCapitalize="none"
            autoFocus
          />
          {value.length > 0 ? (
            <TouchableOpacity onPress={() => setValue("")} hitSlop={12}>
              <Feather name="x-circle" size={18} color={t.inkMute} />
            </TouchableOpacity>
          ) : null}
        </View>
      </PaymentCard>

      {error ? (
        <Text style={[styles.error, { color: t.orange }]}>{error}</Text>
      ) : null}

      {!isEmpty ? (
        <View
          style={[
            styles.pill,
            { backgroundColor: t.bgElev, borderColor: t.line },
          ]}
        >
          <Feather
            name={isWallet ? "shield" : "at-sign"}
            size={13}
            color={t.inkDim}
          />
          <Text
            style={[styles.pillText, { color: t.inkDim }]}
          >
            {isWallet ? "Carteira anônima" : "ID Kori"}
          </Text>
        </View>
      ) : null}

      {isWallet ? (
        <View style={[styles.anonBanner, { backgroundColor: t.bgElev, borderColor: t.line }]}>
          <Feather name="eye-off" size={16} color={t.inkDim} style={{ marginRight: 2 }} />
          <Text style={[styles.anonText, { color: t.inkDim }]}>
            Transação anônima — nenhum dado de identidade será exposto nessa transferência.
          </Text>
        </View>
      ) : null}

      <View style={styles.contactsHeader}>
        <SectionTitle>Contatos</SectionTitle>
        <TouchableOpacity
          style={[styles.addContactBtn, { backgroundColor: t.bgElev, borderColor: t.line }]}
          onPress={() => setAddContactVisible(true)}
          activeOpacity={0.75}
        >
          <Feather name="user-plus" size={13} color={t.ink} />
          <Text style={[styles.addContactBtnText, { color: t.ink }]}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyComponent = () => {
    if (value.trim().length === 0) return null;
    return (
      <View style={styles.emptyContainer}>
        <Feather
          name="users"
          size={32}
          color={t.inkFaint}
          style={styles.emptyIcon}
        />
        <Text style={[styles.emptyText, { color: t.inkMute }]}>
          Nenhum contato encontrado
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <PaymentScreenFrame
        title="Enviar para"
        onBack={onBack}
        onClose={onClose}
        footer={
          <PaymentPrimaryButton
            label="Continuar"
            onPress={handleContinue}
            disabled={isEmpty}
            icon={
              <Feather name="arrow-right" size={16} color={t.btnPrimaryFg} />
            }
          />
        }
      >
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContactItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </PaymentScreenFrame>

      <AddContactModal
        visible={addContactVisible}
        onClose={() => setAddContactVisible(false)}
        onSave={onAddContact}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: 4,
  },
  label: {
    fontFamily: fonts.mono.semibold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    fontFamily: fonts.sans.medium,
    fontSize: 16,
    paddingVertical: 4,
  },
  error: {
    marginTop: 10,
    fontFamily: fonts.sans.medium,
    fontSize: 12,
  },
  pill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginTop: 14,
  },
  pillText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 12,
  },
  anonBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.card,
    borderWidth: 1,
    marginTop: 16,
  },
  anonText: {
    flex: 1,
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    lineHeight: 17,
  },
  contactsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  addContactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.btn,
    borderWidth: 1,
  },
  addContactBtnText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 12,
  },
  listContent: {
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
    borderRadius: 24,
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
    paddingVertical: 40,
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
