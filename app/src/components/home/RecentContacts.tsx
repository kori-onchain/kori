import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { colors, fonts } from "@theme/tokens";
import { Contact } from "@/data/contacts";
import { PlusIcon } from "@components/layout/icons";

interface RecentContactsProps {
  contacts: Contact[];
  onSeeAll?: () => void;
  onInvite?: () => void;
  onContactPress?: (contact: Contact) => void;
}

export const RecentContacts: React.FC<RecentContactsProps> = ({
  contacts,
  onSeeAll,
  onInvite,
  onContactPress,
}) => (
  <View style={styles.container}>
    <View style={styles.headerRow}>
      <Text style={styles.sectionTitle}>CONTATOS</Text>
      <TouchableOpacity
        style={styles.seeMoreBtn}
        activeOpacity={0.7}
        onPress={onSeeAll}
      >
        <Text style={styles.seeMoreText}>Ver mais</Text>
        <Text style={styles.seeMoreArrow}> →</Text>
      </TouchableOpacity>
    </View>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {contacts.map((contact) => (
        <TouchableOpacity
          key={contact.id}
          style={styles.contactItem}
          activeOpacity={0.7}
          onPress={() => onContactPress?.(contact)}
        >
          <View
            style={[styles.avatar, contact.isFavorite && styles.avatarFavorite]}
          >
            <Text
              style={[
                styles.avatarText,
                contact.isFavorite && styles.avatarTextFavorite,
              ]}
            >
              {contact.initials}
            </Text>
            {contact.isFavorite && <View style={styles.favoriteDot} />}
          </View>
          <Text style={styles.contactName} numberOfLines={1}>
            {contact.name || contact.walletId}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.contactItem}
        activeOpacity={0.7}
        onPress={onInvite}
      >
        <View style={styles.inviteAvatar}>
          <PlusIcon size={22} color={colors.inkDim} strokeWidth={1.6} />
        </View>
        <Text style={styles.contactName} numberOfLines={1}>
          Convidar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.inkMute,
    fontFamily: fonts.mono.medium,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  seeMoreBtn: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  seeMoreText: {
    color: colors.inkMute,
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  seeMoreArrow: {
    color: colors.orange,
    fontFamily: fonts.mono.semibold,
    fontSize: 11,
  },
  scrollContent: {
    gap: 16,
    paddingRight: 24,
  },
  contactItem: {
    alignItems: "center",
    width: 64,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.bgElev,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  avatarFavorite: {
    borderColor: colors.line2,
  },
  inviteAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1.2,
    borderColor: colors.inkFaint,
    borderStyle: "dashed",
  },
  favoriteDot: {
    position: "absolute",
    bottom: 0,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.orange,
    borderWidth: 1.5,
    borderColor: colors.bg,
  },
  avatarText: {
    color: colors.ink,
    fontFamily: fonts.sans.semibold,
    fontWeight: "600",
    fontSize: 15,
  },
  avatarTextFavorite: {
    color: colors.ink,
  },
  contactName: {
    color: colors.inkDim,
    fontFamily: fonts.sans.medium,
    fontSize: 11,
    textAlign: "center",
  },
});
