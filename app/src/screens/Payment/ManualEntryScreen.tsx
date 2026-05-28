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
import { Feather, FontAwesome, PixIcon } from "@/icons";
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
import { AddContactModal } from "@components/home/modals/AddContactModal";
import { KoriGlyph } from "@components/layout/icons";

const WALLET_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

const PIX_KEY_PATTERNS = {
  cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/,
  cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?\d{10,13}$/,
  random: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
};

const detectPixKeyType = (key: string): string | null => {
  const trimmed = key.trim();
  if (PIX_KEY_PATTERNS.cpf.test(trimmed)) return "CPF";
  if (PIX_KEY_PATTERNS.cnpj.test(trimmed)) return "CNPJ";
  if (PIX_KEY_PATTERNS.email.test(trimmed)) return "E-mail";
  if (PIX_KEY_PATTERNS.phone.test(trimmed)) return "Telefone";
  if (PIX_KEY_PATTERNS.random.test(trimmed)) return "Chave aleatória";
  return null;
};

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
  const [method, setMethod] = useState<"kori" | "pix">("kori");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [addContactVisible, setAddContactVisible] = useState(false);

  const trimmed = value.trim();
  const isEmpty = trimmed.length === 0;

  // Kori specific
  const isWallet = method === "kori" && WALLET_REGEX.test(trimmed);
  
  // Pix specific
  const keyType = method === "pix" && trimmed ? detectPixKeyType(trimmed) : null;

  const resolveRecipient = (raw: string): PaymentRecipient | null => {
    const trimmedVal = raw.trim();
    if (!trimmedVal) return null;

    if (method === "pix") {
      if (!keyType) return null;
      return {
        type: "pix",
        displayName: trimmedVal,
        pixKey: trimmedVal,
        isAnonymous: false,
        isFavorite: false,
      };
    }

    if (WALLET_REGEX.test(trimmedVal)) {
      return {
        type: "wallet",
        displayName: "Anônimo",
        walletAddress: trimmedVal,
        isAnonymous: true,
        isFavorite: false,
      };
    }

    const handle = trimmedVal.startsWith("@") ? trimmedVal : `@${trimmedVal}`;
    const contact = contacts.find((c) => c.walletId === handle);

    return {
      type: "id",
      displayName: contact?.name ?? trimmedVal.replace("@", ""),
      userId: handle,
      isAnonymous: false,
      isFavorite: contact?.isFavorite ?? false,
    };
  };

  const handleContinue = () => {
    const recipient = resolveRecipient(value);
    if (!recipient) {
      if (method === "pix") {
        setError("Informe uma chave PIX válida (CPF, e-mail, telefone ou chave aleatória).");
      } else {
        setError("Digite um ID válido ou endereço de carteira.");
      }
      return;
    }
    setError("");
    onContinue(recipient);
  };

  const handleSelectContact = (contact: Contact) => {
    if (method === "pix") {
      onContinue({
        type: "pix",
        displayName: contact.name || contact.walletId.replace("@", ""),
        pixKey: contact.pixKey || contact.walletId,
        userId: contact.walletId,
        isAnonymous: false,
        isFavorite: contact.isFavorite,
        id: contact.id,
      });
    } else {
      onContinue({
        type: "id",
        displayName: contact.name || contact.walletId.replace("@", ""),
        userId: contact.walletId,
        isAnonymous: false,
        isFavorite: contact.isFavorite,
      });
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    if (method === "pix" && !contact.channels?.includes("pix")) return false;
    
    const query = value.toLowerCase();
    return (
      contact.name?.toLowerCase().includes(query) ||
      contact.walletId.toLowerCase().includes(query) ||
      (method === "pix" && contact.pixKey?.toLowerCase().includes(query))
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
          {item.isFavorite && method === "kori" ? (
            <View
              style={[
                styles.favoriteBadge,
                { backgroundColor: t.bgElev, borderColor: t.line },
              ]}
            >
              <FontAwesome name="star" size={8} color="#FFD700" />
            </View>
          ) : null}
          {/* If Pix mode, show pix badge on avatar */}
          {method === "pix" && (
            <View style={[styles.channelBadgeAvatar, { backgroundColor: t.ink, borderColor: t.bg }]}>
              <PixIcon size={8} color={t.bg} />
            </View>
          )}
        </View>
      </SoftCard>

      <View style={styles.contactDetails}>
        <Text style={[styles.contactName, { color: t.ink }]} numberOfLines={1}>
          {item.name || "Usuário sem nome"}
        </Text>
        <Text
          style={[method === "pix" ? styles.contactPixKey : styles.contactWalletId, { color: t.inkMute }]}
          numberOfLines={1}
        >
          {method === "pix" ? (item.pixKey || item.walletId) : item.walletId}
        </Text>
        {/* Channel badges */}
        <View style={styles.badgeRow}>
          {item.channels?.includes("pix") && (
            <View style={[styles.channelBadge, { backgroundColor: t.bgElev, borderColor: t.line, borderWidth: 1 }]}>
              <PixIcon size={10} color={t.ink} />
              <Text style={[styles.channelBadgeText, { color: t.ink }]}>Pix</Text>
            </View>
          )}
          {item.channels?.includes("kori") && (
            <View style={[styles.channelBadge, { backgroundColor: `${t.orange}15` }]}>
              <KoriGlyph size={10} color={t.orange} />
              <Text style={[styles.channelBadgeText, { color: t.orange }]}>Kori</Text>
            </View>
          )}
        </View>
      </View>

      <Feather name="chevron-right" size={16} color={t.inkMute} />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={[styles.label, { color: t.inkMute }]}>
        {method === "pix" ? "Chave Pix" : "ID ou carteira"}
      </Text>
      <PaymentCard padding={14}>
        <View style={styles.inputRow}>
          {method === "pix" ? (
            <PixIcon size={18} color={t.ink} />
          ) : (
            <Feather
              name={isWallet ? "shield" : "at-sign"}
              size={18}
              color={t.inkDim}
            />
          )}
          <TextInput
            style={[styles.input, { color: t.ink }]}
            placeholder={
              method === "pix"
                ? "CPF, e-mail, telefone ou chave aleatória"
                : "@usuario ou endereço da carteira"
            }
            placeholderTextColor={t.inkMute}
            value={value}
            onChangeText={(next) => {
              setValue(next);
              setError("");
            }}
            autoCorrect={false}
            autoCapitalize="none"
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

      {method === "kori" && !isEmpty ? (
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

      {method === "pix" && keyType ? (
        <View style={[styles.pill, { backgroundColor: t.bgElev, borderColor: t.line, borderWidth: 1 }]}>
          <PixIcon size={13} color={t.ink} />
          <Text style={[styles.pillText, { color: t.ink }]}>
            Chave Pix • {keyType}
          </Text>
        </View>
      ) : null}

      {method === "kori" && isWallet ? (
        <View style={[styles.anonBanner, { backgroundColor: t.bgElev, borderColor: t.line }]}>
          <Feather name="eye-off" size={16} color={t.inkDim} style={{ marginRight: 2 }} />
          <Text style={[styles.anonText, { color: t.inkDim }]}>
            Transação anônima — nenhum dado de identidade será exposto nessa transferência.
          </Text>
        </View>
      ) : null}

      {/* Method selector cards */}
      <View style={[styles.methodRow, { marginTop: 24 }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setMethod("kori")}
          style={[
            styles.methodCard,
            method === "kori" ? styles.methodCardActive : null,
            { backgroundColor: t.bg2, borderColor: method === "kori" ? t.orange : t.cardBorder }
          ]}
        >
          <KoriGlyph size={18} color={method === "kori" ? t.orange : t.inkDim} />
          <Text style={[styles.methodCardTitle, { color: method === "kori" ? t.ink : t.inkDim }]}>Kori</Text>
          <Text style={[styles.methodCardDesc, { color: t.inkMute }]}>Transferência interna</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setMethod("pix")}
          style={[
            styles.methodCard,
            method === "pix" ? styles.methodCardActive : null,
            { backgroundColor: t.bg2, borderColor: method === "pix" ? t.ink : t.cardBorder }
          ]}
        >
          <PixIcon size={18} color={method === "pix" ? t.ink : t.inkDim} />
          <Text style={[styles.methodCardTitle, { color: method === "pix" ? t.ink : t.inkDim }]}>Pix</Text>
          <Text style={[styles.methodCardDesc, { color: t.inkMute }]}>Transferência via Pix</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contactsHeader}>
        <SectionTitle>
          {method === "pix" ? "Contatos com Pix" : "Contatos"}
        </SectionTitle>
        {method === "kori" && (
          <TouchableOpacity
            style={[styles.addContactBtn, { backgroundColor: t.bgElev, borderColor: t.line }]}
            onPress={() => setAddContactVisible(true)}
            activeOpacity={0.75}
          >
            <Feather name="user-plus" size={13} color={t.ink} />
            <Text style={[styles.addContactBtnText, { color: t.ink }]}>Adicionar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyComponent = () => {
    if (value.trim().length === 0 && method === "kori") return null;
    return (
      <View style={styles.emptyContainer}>
        {method === "pix" ? (
          <PixIcon size={32} color={t.inkFaint} style={styles.emptyIcon} />
        ) : (
          <Feather
            name="users"
            size={32}
            color={t.inkFaint}
            style={styles.emptyIcon}
          />
        )}
        <Text style={[styles.emptyText, { color: t.inkMute }]}>
          {method === "pix" ? "Nenhum contato com Pix encontrado" : "Nenhum contato encontrado"}
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
        title={method === "pix" ? "Enviar Pix" : "Enviar para"}
        onBack={onBack}
        onClose={onClose}
        footer={
          <PaymentPrimaryButton
            label="Continuar"
            onPress={handleContinue}
            disabled={method === "pix" ? isEmpty : isEmpty}
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
  methodRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  methodCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 2,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minHeight: 90,
  },
  methodCardActive: {},
  methodCardTitle: {
    fontFamily: fonts.sans.bold,
    fontSize: 13,
    marginTop: 2,
  },
  methodCardDesc: {
    fontFamily: fonts.sans.medium,
    fontSize: 10,
    textAlign: "center",
    lineHeight: 14,
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
  channelBadgeAvatar: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
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
  contactPixKey: {
    fontFamily: fonts.mono.medium,
    fontSize: 11,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 5,
  },
  channelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  channelBadgeText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 9,
    letterSpacing: 0.2,
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
