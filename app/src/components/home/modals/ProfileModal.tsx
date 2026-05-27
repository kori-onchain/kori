import React from "react";
import {
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { Feather } from "@/icons";
import { SoftCard } from "@components/layout/SoftCard";
import { useTheme, ThemePreference } from "@theme/ThemeProvider";
import { ThemeTokens } from "@theme/tokens";
import { fonts, radii } from "@theme/tokens";
import { CreditModal } from "./CreditModal";

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout?: () => void;
  userName?: string;
  username?: string;
  accountType?: "PF" | "PJ";
}

interface ThemeDrawerProps {
  visible: boolean;
  onClose: () => void;
  preference: ThemePreference;
  toggle: (pref: ThemePreference) => void;
  t: ThemeTokens;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const AppearanceIcon = ({ color }: { color: string }) => (
  <View style={styles.appearanceIconWrap}>
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <Path d="M12 2 A 10 10 0 0 1 12 22 Z" fill={color} />
    </Svg>
  </View>
);

const ThemeSelectionDrawer: React.FC<ThemeDrawerProps> = ({
  visible,
  onClose,
  preference,
  toggle,
  t,
}) => {
  const options: { id: ThemePreference; name: string; icon: string; desc: string }[] = [
    { id: "light", name: "Tema Claro", icon: "sun", desc: "Interface clara de alto contraste" },
    { id: "dark", name: "Tema Escuro", icon: "moon", desc: "Interface escura otimizada para leitura" },
    { id: "system", name: "Padrão do Sistema", icon: "smartphone", desc: "Sincroniza com as configurações do dispositivo" },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={drawerStyles.overlay}>
        <TouchableOpacity
          style={drawerStyles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[
            drawerStyles.drawer,
            {
              backgroundColor: t.bg,
              borderColor: t.line,
            },
          ]}
        >
          <View style={[drawerStyles.handleBar, { backgroundColor: t.inkFaint }]} />

          <View style={drawerStyles.body}>
            <Text style={[drawerStyles.title, { color: t.ink }]}>Aparência</Text>
            <Text style={[drawerStyles.subtitle, { color: t.inkDim }]}>
              Selecione o tema preferido para a sua navegação
            </Text>

            <View style={drawerStyles.optionsGroup}>
              {options.map((opt) => {
                const isSelected = preference === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    activeOpacity={0.8}
                    onPress={() => {
                      toggle(opt.id);
                      setTimeout(onClose, 150);
                    }}
                    style={[
                      drawerStyles.optionRow,
                      { borderBottomColor: t.line },
                      isSelected && { backgroundColor: `${t.orange}0a` }
                    ]}
                  >
                    <View style={drawerStyles.optionLeft}>
                      <View style={[drawerStyles.iconCircle, { backgroundColor: t.bg2 }]}>
                        <Feather name={opt.icon} size={16} color={isSelected ? t.orange : t.inkDim} />
                      </View>
                      <View>
                        <Text style={[drawerStyles.optionName, { color: t.ink }]}>{opt.name}</Text>
                        <Text style={[drawerStyles.optionDesc, { color: t.inkMute }]}>{opt.desc}</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        drawerStyles.radioCircle,
                        { borderColor: isSelected ? t.orange : t.inkMute },
                        isSelected && { backgroundColor: t.orange }
                      ]}
                    >
                      {isSelected && (
                        <Feather name="check" size={12} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  onClose,
  onLogout,
  userName = "Pedro Henrique",
  username = "opedrooz",
  accountType = "PF",
}) => {
  const { t, preference, toggle } = useTheme();
  const [creditModalVisible, setCreditModalVisible] = React.useState(false);
  const [themeDrawerVisible, setThemeDrawerVisible] = React.useState(false);

  const handleClose = () => {
    onClose();
  };

  const handleLogout = () => {
    Alert.alert("Sair da Kori?", "Você voltará para a tela de entrada.", [
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

  const handleFeaturePlaceholder = (featureName: string) => {
    Alert.alert("Disponível em breve", `${featureName} estará disponível em breve no app Kori.`);
  };

  const initials = getInitials(userName || "Kori");

  // Account Type Tag Details
  const isPersonal = accountType === "PF";
  const accountLabel = isPersonal ? "Conta Pessoal" : "Conta Empresarial";
  const accountIcon = isPersonal ? "user" : "briefcase";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: t.bg }]}>
        <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} translucent />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleClose}
            style={[styles.headerBtn, { backgroundColor: t.bg2 }]}
            activeOpacity={0.75}
          >
            <Feather name="arrow-left" size={20} color={t.ink} />
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => handleFeaturePlaceholder("Suporte")}
              style={[styles.headerBtn, { backgroundColor: t.bg2 }]}
              activeOpacity={0.75}
            >
              <Feather name="message-square" size={18} color={t.ink} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleFeaturePlaceholder("Notificações")}
              style={[styles.headerBtn, { backgroundColor: t.bg2 }]}
              activeOpacity={0.75}
            >
              <Feather name="bell" size={18} color={t.ink} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* User Info / Avatar Area */}
          <View style={styles.profileSection}>
            <TouchableOpacity
              style={styles.avatarWrap}
              activeOpacity={0.85}
              onPress={() => handleFeaturePlaceholder("Editar Avatar")}
            >
              <View style={[styles.avatar, { backgroundColor: t.bg2, borderColor: t.orange }]}>
                <Text style={[styles.avatarText, { color: t.ink }]}>{initials}</Text>
              </View>
              <View style={[styles.avatarBadge, { backgroundColor: t.bg2, borderColor: t.bg }]}>
                <Feather name="edit-2" size={12} color={t.orange} />
              </View>
            </TouchableOpacity>

            <View style={styles.profileMeta}>
              <View style={styles.badgeContainer}>
                <View style={styles.badgeWrap}>
                  <Feather name={accountIcon} size={12} color={t.ink} style={{ marginRight: 6 }} />
                  <Text style={[styles.badgeText, { color: t.ink }]}>{accountLabel}</Text>
                </View>
              </View>
              <Text style={[styles.profileName, { color: t.ink }]}>{userName}</Text>
            </View>
          </View>

          {/* Standalone Card: Indique e ganhe */}
          <SoftCard radius={radii.card} padding={0} flat style={styles.standaloneCard}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => handleFeaturePlaceholder("Indique e ganhe")}
              style={styles.menuItem}
            >
              <View style={styles.menuItemLeft}>
                <Feather name="gift" size={18} color={t.inkDim} />
                <Text style={[styles.menuItemText, { color: t.ink }]}>Indique e ganhe</Text>
              </View>
              <Feather name="chevron-right" size={16} color={t.inkMute} />
            </TouchableOpacity>
          </SoftCard>

          {/* Section 1: Personalização */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: t.inkDim }]}>Personalização</Text>
            <SoftCard radius={radii.card} padding={0} flat style={styles.cardGroup}>
              {/* Appearance Row with Navigation Arrow */}
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => setThemeDrawerVisible(true)}
                style={styles.menuItem}
              >
                <View style={styles.menuItemLeft}>
                  <AppearanceIcon color={t.inkDim} />
                  <Text style={[styles.menuItemText, { color: t.ink }]}>Aparência</Text>
                </View>
                <Feather name="chevron-right" size={16} color={t.inkMute} />
              </TouchableOpacity>
            </SoftCard>
          </View>

          {/* Section 2: Minha conta */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: t.inkDim }]}>Minha conta</Text>
            <SoftCard radius={radii.card} padding={0} flat style={styles.cardGroup}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => handleFeaturePlaceholder("Dados cadastrais")}
                style={[styles.menuItem, { borderBottomColor: t.line }]}
              >
                <View style={styles.menuItemLeft}>
                  <Feather name="user" size={18} color={t.inkDim} />
                  <Text style={[styles.menuItemText, { color: t.ink }]}>Dados cadastrais</Text>
                </View>
                <Feather name="chevron-right" size={16} color={t.inkMute} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => handleFeaturePlaceholder("Conta Comercial")}
                style={[styles.menuItem, { borderBottomColor: t.line }]}
              >
                <View style={styles.menuItemLeft}>
                  <Feather name="briefcase" size={18} color={t.inkDim} />
                  <Text style={[styles.menuItemText, { color: t.ink }]}>Conta Comercial</Text>
                </View>
                <Feather name="chevron-right" size={16} color={t.inkMute} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => handleFeaturePlaceholder("Encerramento de conta")}
                style={styles.menuItem}
              >
                <View style={styles.menuItemLeft}>
                  <Feather name="x-circle" size={18} color={t.inkDim} />
                  <Text style={[styles.menuItemText, { color: t.ink }]}>Encerramento de conta</Text>
                </View>
                <Feather name="chevron-right" size={16} color={t.inkMute} />
              </TouchableOpacity>
            </SoftCard>
          </View>

          {/* Section 3: Gestão Financeira */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: t.inkDim }]}>Gestão financeira</Text>
            <SoftCard radius={radii.card} padding={0} flat style={styles.cardGroup}>
              {/* Meu Crédito - First Option */}
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => setCreditModalVisible(true)}
                style={[styles.menuItem, { borderBottomColor: t.line }]}
              >
                <View style={styles.menuItemLeft}>
                  <Feather name="trending-up" size={18} color={t.orange} />
                  <Text style={[styles.menuItemText, { color: t.ink }]}>Meu Crédito</Text>
                </View>
                <Feather name="chevron-right" size={16} color={t.inkMute} />
              </TouchableOpacity>

              {/* Contatos Bloqueados */}
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => handleFeaturePlaceholder("Contatos bloqueados")}
                style={styles.menuItem}
              >
                <View style={styles.menuItemLeft}>
                  <Feather name="user-x" size={18} color={t.inkDim} />
                  <Text style={[styles.menuItemText, { color: t.ink }]}>Contatos bloqueados</Text>
                </View>
                <Feather name="chevron-right" size={16} color={t.inkMute} />
              </TouchableOpacity>
            </SoftCard>
          </View>

          {/* Section 4: App Rating Card */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => handleFeaturePlaceholder("Avaliar App")}
            style={styles.ratingSection}
          >
            <SoftCard radius={radii.card} padding={14} style={styles.ratingCard}>
              <View style={styles.ratingRow}>
                <View style={[styles.ratingIconWrap, { backgroundColor: t.bg2 }]}>
                  <Feather name="thumbs-up" size={16} color={t.orange} />
                </View>
                <View style={styles.ratingDetails}>
                  <Text style={[styles.ratingKicker, { color: t.inkMute }]}>Avalie sua experiência</Text>
                  <Text style={[styles.ratingTitle, { color: t.ink }]}>Com o nosso aplicativo</Text>
                </View>
                <Feather name="chevron-right" size={16} color={t.inkMute} />
              </View>
            </SoftCard>
          </TouchableOpacity>

          {/* Sair do App Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogout}
            style={[styles.logoutBtn, { borderColor: t.orange, backgroundColor: "rgba(255, 107, 61, 0.06)" }]}
          >
            <Feather name="log-out" size={18} color={t.orange} />
            <Text style={[styles.logoutBtnText, { color: t.orange }]}>Sair do app</Text>
          </TouchableOpacity>

          {/* App Version */}
          <Text style={[styles.versionText, { color: t.inkMute }]}>Versão do App 4.160.1</Text>
        </ScrollView>
      </SafeAreaView>

      <CreditModal
        visible={creditModalVisible}
        onClose={() => setCreditModalVisible(false)}
      />

      <ThemeSelectionDrawer
        visible={themeDrawerVisible}
        onClose={() => setThemeDrawerVisible(false)}
        preference={preference}
        toggle={toggle}
        t={t}
      />
    </Modal>
  );
};

const drawerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.70)",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  drawer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    zIndex: 2,
    overflow: "hidden",
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  body: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  title: {
    fontFamily: fonts.sans.bold,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    marginBottom: 24,
  },
  optionsGroup: {
    borderRadius: 16,
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  optionName: {
    fontSize: 14.5,
    fontFamily: fonts.sans.bold,
  },
  optionDesc: {
    fontSize: 12,
    fontFamily: fonts.sans.medium,
    marginTop: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});

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
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 26,
    marginTop: 6,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontFamily: fonts.sans.bold,
  },
  avatarBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  profileMeta: {
    flex: 1,
    gap: 4,
  },
  badgeContainer: {
    flexDirection: "row",
  },
  badgeWrap: {
    flexDirection: "row",
    alignItems: "center",
    opacity: 0.6,
  },
  badgeText: {
    fontSize: 11.5,
    fontFamily: fonts.sans.semibold,
  },
  profileName: {
    fontSize: 22,
    fontFamily: fonts.sans.bold,
  },
  standaloneCard: {
    overflow: "hidden",
  },
  cardGroup: {
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  menuItemText: {
    fontSize: 14,
    fontFamily: fonts.sans.semibold,
  },
  appearanceIconWrap: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontFamily: fonts.sans.bold,
    marginBottom: 12,
  },
  ratingSection: {
    marginTop: 22,
    marginBottom: 26,
  },
  ratingCard: {
    overflow: "hidden",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ratingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.cardSm,
    alignItems: "center",
    justifyContent: "center",
  },
  ratingDetails: {
    flex: 1,
    gap: 2,
  },
  ratingKicker: {
    fontSize: 10.5,
    fontFamily: fonts.mono.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  ratingTitle: {
    fontSize: 14,
    fontFamily: fonts.sans.bold,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 52,
    borderRadius: radii.pill,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 20,
  },
  logoutBtnText: {
    fontSize: 15,
    fontFamily: fonts.sans.bold,
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: fonts.mono.medium,
    marginBottom: 20,
  },
});
