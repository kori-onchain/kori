import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { fonts } from "@theme/tokens";
import { useTheme } from "@theme/ThemeProvider";
import { Contact } from "@/data/contacts";
import { Feather, MaterialCommunityIcons, PixIcon } from "@/icons";
import { KoriGlyph, PlusIcon } from "@components/layout/icons";

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
}) => {
  const { t } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: t.inkMute }]}>
          CONTATOS
        </Text>
        <TouchableOpacity
          style={styles.seeMoreBtn}
          activeOpacity={0.7}
          onPress={onSeeAll}
        >
          <Text style={[styles.seeMoreText, { color: t.inkMute }]}>
            Ver mais
          </Text>
          <Text style={[styles.seeMoreArrow, { color: t.orange }]}> →</Text>
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
              style={[
                styles.avatar,
                { backgroundColor: t.bgElev, borderColor: t.line },
                contact.isFavorite && { borderColor: t.line2 },
              ]}
            >
              <Text
                style={[styles.avatarText, { color: t.ink }]}
              >
                {contact.initials}
              </Text>
              {contact.isFavorite && (
                <View
                  style={[
                    styles.favoriteDot,
                    { backgroundColor: t.orange, borderColor: t.bg },
                  ]}
                />
              )}
              {/* Channel badge indicators */}
              {contact.channels && contact.channels.length > 0 && (
                <View style={styles.channelDots}>
                  {contact.channels.includes("pix") && (
                    <View style={[styles.channelDot, { backgroundColor: t.ink, borderColor: t.bg }]}>
                      <PixIcon size={6} color={t.bg} />
                    </View>
                  )}
                  {contact.channels.includes("kori") && (
                    <View style={[styles.channelDot, { backgroundColor: t.orange, borderColor: t.bg }]}>
                      <KoriGlyph size={6} color="#FFF" />
                    </View>
                  )}
                </View>
              )}
            </View>
            <Text style={[styles.contactName, { color: t.inkDim }]} numberOfLines={1}>
              {contact.name || contact.walletId}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.contactItem}
          activeOpacity={0.7}
          onPress={onInvite}
        >
          <View style={[styles.inviteAvatar, { borderColor: t.inkFaint }]}>
            <PlusIcon size={22} color={t.inkDim} strokeWidth={1.6} />
          </View>
          <Text style={[styles.contactName, { color: t.inkDim }]} numberOfLines={1}>
            Convidar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

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
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  seeMoreArrow: {
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
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
    borderStyle: "dashed",
  },
  favoriteDot: {
    position: "absolute",
    bottom: 0,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  channelDots: {
    position: "absolute",
    top: -2,
    right: -4,
    flexDirection: "row",
    gap: 2,
  },
  channelDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  avatarText: {
    fontFamily: fonts.sans.semibold,
    fontWeight: "600",
    fontSize: 15,
  },
  contactName: {
    fontFamily: fonts.sans.medium,
    fontSize: 11,
    textAlign: "center",
  },
});
