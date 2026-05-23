import React from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Feather, Ionicons } from "../icons";
import { ThemePreference, useTheme } from "../theme/ThemeProvider";

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout?: () => void;
  userName?: string;
  username?: string;
  accountType?: "PF" | "PJ";
}

type ActionItem = {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  tone?: "default" | "danger";
  onPress?: () => void;
};

const THEME_OPTIONS: {
  value: ThemePreference;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof Feather>["name"];
}[] = [
  {
    value: "system",
    label: "Sistema",
    description: "Segue o tema do aparelho",
    icon: "smartphone",
  },
  {
    value: "dark",
    label: "Escuro",
    description: "Visual padrão da Kora",
    icon: "moon",
  },
  {
    value: "light",
    label: "Claro",
    description: "Mais contraste em ambientes claros",
    icon: "sun",
  },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  onClose,
  onLogout,
  userName = "Pedro Henrique",
  username = "opedrooz",
  accountType = "PF",
}) => {
  const { preference, t, toggle } = useTheme();
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const [editedUserName, setEditedUserName] = React.useState(userName);
  const [avatarImage, setAvatarImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (visible) {
      setEditedUserName(userName);
      setIsEditingProfile(false);
    }
  }, [visible, userName]);

  const handleClose = () => {
    if (isEditingProfile) {
      setIsEditingProfile(false);
      return;
    }
    onClose();
  };

  const handleLogout = () => {
    Alert.alert("Sair da Kora?", "Você voltará para a tela de entrada.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          onClose();
          onLogout?.();
        },
      },
    ]);
  };

  const handleAvatarPress = () => {
    setAvatarImage((prev) =>
      prev
        ? null
        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    );
  };

  const profileActions: ActionItem[] = [
    {
      title: "Segurança",
      subtitle: "PIN, biometria e dispositivos conectados",
      icon: "shield",
    },
    {
      title: "Limites e preferências",
      subtitle: "Transferências, notificações e privacidade",
      icon: "sliders",
    },
    {
      title: "Ajuda",
      subtitle: "Suporte, termos e reportar problema",
      icon: "help-circle",
    },
    {
      title: "Sair da conta",
      subtitle: "Encerra esta sessão no aparelho",
      icon: "log-out",
      tone: "danger",
      onPress: handleLogout,
    },
  ];

  const initials = getInitials(editedUserName || userName || "Kora");
  const handle = username.startsWith("@") ? username : `@${username}`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: t.bg }]}>
        <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} translucent />

        <View style={[styles.header, { borderBottomColor: t.line }]}>
          <TouchableOpacity
            onPress={handleClose}
            style={[styles.headerBtn, { backgroundColor: t.bg2 }]}
            activeOpacity={0.75}
          >
            <Feather
              name={isEditingProfile ? "x" : "arrow-left"}
              size={22}
              color={t.ink}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: t.ink }]}>
            {isEditingProfile ? "Editar perfil" : "Perfil"}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View
            style={[
              styles.profileCard,
              {
                backgroundColor: t.bg2,
                borderColor: t.cardBorder,
                shadowColor: "#000",
                elevation: t.cardElev,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.avatarWrap}
              activeOpacity={0.85}
              onPress={handleAvatarPress}
            >
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: t.bgElev, borderColor: t.line2 },
                ]}
              >
                {avatarImage ? (
                  <Image
                    source={{ uri: avatarImage }}
                    style={styles.avatarImg}
                  />
                ) : (
                  <Text style={[styles.avatarText, { color: t.ink }]}>
                    {initials}
                  </Text>
                )}
              </View>
              <View style={[styles.avatarBadge, { backgroundColor: t.orange }]}>
                <Feather name="camera" size={12} color="#fff" />
              </View>
            </TouchableOpacity>

            <View style={styles.profileMain}>
              {isEditingProfile ? (
                <View
                  style={[
                    styles.inputBox,
                    { borderColor: t.line2, backgroundColor: t.bg },
                  ]}
                >
                  <Text style={[styles.inputLabel, { color: t.inkMute }]}>
                    Nome de exibição
                  </Text>
                  <TextInput
                    value={editedUserName}
                    onChangeText={setEditedUserName}
                    placeholder="Seu nome"
                    placeholderTextColor={t.inkMute}
                    keyboardAppearance="dark"
                    autoCapitalize="words"
                    style={[styles.nameInput, { color: t.ink }]}
                  />
                </View>
              ) : (
                <>
                  <Text style={[styles.profileName, { color: t.ink }]}>
                    {editedUserName}
                  </Text>
                  <Text style={[styles.profileHandle, { color: t.inkDim }]}>
                    {handle}
                  </Text>
                </>
              )}

              <View style={styles.metaRow}>
                <View
                  style={[
                    styles.metaPill,
                    { backgroundColor: t.bgElev, borderColor: t.cardBorder },
                  ]}
                >
                  <Ionicons
                    name={
                      accountType === "PF"
                        ? "person-outline"
                        : "business-outline"
                    }
                    size={13}
                    color={t.orange}
                  />
                  <Text style={[styles.metaText, { color: t.ink }]}>
                    {accountType === "PF" ? "Conta pessoal" : "Conta business"}
                  </Text>
                </View>
                <View
                  style={[
                    styles.metaPill,
                    { backgroundColor: t.bgElev, borderColor: t.cardBorder },
                  ]}
                >
                  <View
                    style={[styles.statusDot, { backgroundColor: t.green }]}
                  />
                  <Text style={[styles.metaText, { color: t.ink }]}>
                    Devnet
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setIsEditingProfile((prev) => !prev)}
              style={[styles.editButton, { borderColor: t.line2 }]}
              activeOpacity={0.75}
            >
              <Feather
                name={isEditingProfile ? "check" : "edit-2"}
                size={15}
                color={t.ink}
              />
              <Text style={[styles.editButtonText, { color: t.ink }]}>
                {isEditingProfile ? "Salvar" : "Editar"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionKicker, { color: t.inkMute }]}>
              APARÊNCIA
            </Text>
            <View style={styles.themeGrid}>
              {THEME_OPTIONS.map((option) => {
                const active = preference === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => toggle(option.value)}
                    activeOpacity={0.8}
                    style={[
                      styles.themeCard,
                      {
                        backgroundColor: active ? t.btnPrimaryBg : t.bg2,
                        borderColor: active ? t.btnPrimaryBg : t.cardBorder,
                      },
                    ]}
                  >
                    <View style={styles.themeTop}>
                      <Feather
                        name={option.icon}
                        size={18}
                        color={active ? t.btnPrimaryFg : t.ink}
                      />
                      {active && (
                        <Feather
                          name="check"
                          size={16}
                          color={t.btnPrimaryFg}
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.themeTitle,
                        { color: active ? t.btnPrimaryFg : t.ink },
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={[
                        styles.themeDescription,
                        { color: active ? t.btnPrimaryFg : t.inkMute },
                      ]}
                    >
                      {option.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionKicker, { color: t.inkMute }]}>
              CONTA
            </Text>
            <View
              style={[
                styles.actionList,
                { backgroundColor: t.bg2, borderColor: t.cardBorder },
              ]}
            >
              {profileActions.map((item, index) => {
                const danger = item.tone === "danger";
                const color = danger ? t.orange : t.ink;
                return (
                  <TouchableOpacity
                    key={item.title}
                    activeOpacity={0.75}
                    onPress={item.onPress}
                    style={[
                      styles.actionRow,
                      index < profileActions.length - 1 && {
                        borderBottomColor: t.line,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.actionIcon,
                        {
                          backgroundColor: danger ? `${t.orange}18` : t.bgElev,
                        },
                      ]}
                    >
                      <Feather name={item.icon} size={20} color={color} />
                    </View>
                    <View style={styles.actionText}>
                      <Text style={[styles.actionTitle, { color }]}>
                        {item.title}
                      </Text>
                      <Text
                        style={[styles.actionSubtitle, { color: t.inkMute }]}
                      >
                        {item.subtitle}
                      </Text>
                    </View>
                    <Feather
                      name="chevron-right"
                      size={18}
                      color={danger ? t.orange : t.inkMute}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 44,
  },
  profileCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
  },
  avatarWrap: {
    alignSelf: "flex-start",
    marginBottom: 18,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: 1,
  },
  avatarBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  profileMain: {
    gap: 10,
  },
  profileName: {
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  profileHandle: {
    fontSize: 14,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 2,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "800",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  editButton: {
    position: "absolute",
    top: 18,
    right: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: "800",
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginRight: 90,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  nameInput: {
    fontSize: 19,
    fontWeight: "800",
    padding: 0,
  },
  section: {
    marginTop: 26,
  },
  sectionKicker: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.6,
    marginBottom: 12,
  },
  themeGrid: {
    flexDirection: "row",
    gap: 10,
  },
  themeCard: {
    flex: 1,
    minHeight: 116,
    borderWidth: 1,
    borderRadius: 18,
    padding: 13,
  },
  themeTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  themeTitle: {
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 5,
  },
  themeDescription: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: "600",
  },
  actionList: {
    borderWidth: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    padding: 16,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 3,
  },
  actionSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
  },
});
