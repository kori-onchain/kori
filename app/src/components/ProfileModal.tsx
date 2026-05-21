import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
  Animated,
  TextInput,
  Image,
} from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants/colors";

const { width } = Dimensions.get("window");

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  userName?: string;
  accountType?: "PF" | "PJ";
}

const SkeletonQuickCard: React.FC = () => {
  const pulseAnim = React.useRef(new Animated.Value(0.15)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.15,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.skeletonQuickCard}>
      <Animated.View style={[styles.skeletonCircle, { opacity: pulseAnim }]} />
      <View style={styles.skeletonQuickLines}>
        <Animated.View
          style={[styles.skeletonLine, { width: "80%", opacity: pulseAnim }]}
        />
        <Animated.View
          style={[
            styles.skeletonLine,
            { width: "50%", opacity: pulseAnim, marginTop: 4 },
          ]}
        />
      </View>
    </View>
  );
};

const SkeletonGridCard: React.FC = () => {
  const pulseAnim = React.useRef(new Animated.Value(0.15)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.15,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.skeletonGridCard}>
      <Animated.View
        style={[styles.skeletonTitleLine, { opacity: pulseAnim }]}
      />
      <Animated.View style={[styles.skeletonSubLine, { opacity: pulseAnim }]} />
      <Animated.View
        style={[styles.skeletonCircleSmall, { opacity: pulseAnim }]}
      />
    </View>
  );
};

const SkeletonListItem: React.FC<{
  iconName: string;
  iconType: "feather" | "ionicons" | "material";
  lineWidth: number | string;
}> = ({ iconName, iconType, lineWidth }) => {
  const pulseAnim = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const renderIcon = () => {
    const size = 22;
    const color = "#FFFFFF";
    if (iconType === "feather") {
      return <Feather name={iconName as any} size={size} color={color} />;
    }
    if (iconType === "ionicons") {
      return <Ionicons name={iconName as any} size={size} color={color} />;
    }
    return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
  };

  return (
    <View style={styles.skeletonListRow}>
      <Animated.View style={[styles.skeletonListIconContainer, { opacity: pulseAnim }]}>
        {renderIcon()}
      </Animated.View>
      
      <View style={styles.skeletonListTextContainer}>
        <Animated.View style={[styles.skeletonListLine, { width: lineWidth, opacity: pulseAnim }]} />
      </View>

      <Feather name="chevron-right" size={16} color="rgba(255, 255, 255, 0.4)" />
    </View>
  );
};

export const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  onClose,
  userName = "Pedro Henrique",
  accountType = "PF",
}) => {
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const [editedUserName, setEditedUserName] = React.useState(userName);
  const [avatarImage, setAvatarImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (visible) {
      setEditedUserName(userName);
    }
  }, [visible, userName]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={isEditingProfile ? () => setIsEditingProfile(false) : onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#121212"
          translucent={true}
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={isEditingProfile ? () => setIsEditingProfile(false) : onClose}
            style={styles.headerBtn}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {!isEditingProfile && (
            <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
              <Feather name="bell" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {isEditingProfile ? (
            /* ================= EDIT PROFILE SCREEN ================= */
            <View>
              {/* Large Title "Perfil" */}
              <Text style={styles.editTitle}>Perfil</Text>

              {/* Avatar + Info Row */}
              <View style={styles.editProfileRow}>
                <TouchableOpacity
                  style={styles.editAvatarWrapper}
                  activeOpacity={0.8}
                  onPress={() => {
                    // Toggle profile image to show interactive adding/changing
                    setAvatarImage((prev) =>
                      prev
                        ? null
                        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                    );
                  }}
                >
                  <View style={styles.editAvatar}>
                    {avatarImage ? (
                      <Image source={{ uri: avatarImage }} style={styles.editAvatarImg} />
                    ) : (
                      <Text style={styles.editAvatarText}>
                        {editedUserName
                          ? editedUserName
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()
                          : "PH"}
                      </Text>
                    )}
                  </View>
                  <View style={styles.editPencilBadge}>
                    <Feather name="edit-2" size={12} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>

                <View style={styles.editProfileInfo}>
                  <Text style={styles.editProfileName}>{editedUserName}</Text>
                  <Text style={styles.editProfileSubtitle}>Exibida apenas para você</Text>
                </View>
              </View>

              {/* Display Name Card Input */}
              <View style={styles.inputCard}>
                <Text style={styles.inputLabel}>Nome de exibição</Text>
                <TextInput
                  style={styles.textInput}
                  value={editedUserName}
                  onChangeText={setEditedUserName}
                  placeholder="Nome de exibição"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  keyboardAppearance="dark"
                  autoCapitalize="words"
                />
              </View>

              {/* Skeletons Section */}
              <View style={styles.skeletonSection}>
                <SkeletonListItem
                  iconName="gift"
                  iconType="feather"
                  lineWidth={140}
                />
                <SkeletonListItem
                  iconName="users"
                  iconType="feather"
                  lineWidth={110}
                />
                <SkeletonListItem
                  iconName="user-check"
                  iconType="feather"
                  lineWidth={160}
                />
              </View>
            </View>
          ) : (
            /* ================= MAIN PROFILE SCREEN ================= */
            <View>
              {/* Perfil Header */}
              <TouchableOpacity
                style={styles.profileRow}
                activeOpacity={0.7}
                onPress={() => setIsEditingProfile(true)}
              >
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    {avatarImage ? (
                      <Image source={{ uri: avatarImage }} style={styles.avatarImg} />
                    ) : (
                      <Text style={styles.avatarText}>
                        {editedUserName
                          ? editedUserName
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()
                          : "PH"}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{editedUserName}</Text>
                  <View style={styles.badgeContainer}>
                    <View style={styles.primeBadge}>
                      <Text style={styles.primeBadgeText}>
                        {accountType === "PF" ? "Personal" : "Business"}
                      </Text>
                    </View>
                  </View>
                </View>

                <Feather
                  name="chevron-right"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.chevronRight}
                />
              </TouchableOpacity>

              {/* Quick Cards Horizontal Scroll */}
              <View style={styles.quickCardsContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.quickCardsScroll}
                >
                  <TouchableOpacity style={styles.quickCard} activeOpacity={0.8}>
                    <View style={styles.quickCardIconContainer}>
                      <Feather name="settings" size={20} color="#FFFFFF" />
                    </View>
                    <Text style={styles.quickCardTitle}>Settings</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.quickCard} activeOpacity={0.8}>
                    <View style={styles.quickCardIconContainer}>
                      <Feather name="sliders" size={20} color="#FFFFFF" />
                    </View>
                    <Text style={styles.quickCardTitle}>Meu{"\n"}Crédito</Text>
                  </TouchableOpacity>

                  <SkeletonQuickCard />
                  <SkeletonQuickCard />
                </ScrollView>
              </View>

              {/* Central de Segurança */}
              <View style={styles.sectionContainer}>
                <TouchableOpacity style={styles.sectionHeader} activeOpacity={0.7}>
                  <Text style={styles.sectionTitle}>Central de Segurança</Text>
                  <Feather name="chevron-right" size={20} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={styles.cardsGrid}>
                  <SkeletonGridCard />
                  <SkeletonGridCard />
                </View>
              </View>

              {/* Benefícios */}
              <View style={styles.sectionContainer}>
                <TouchableOpacity style={styles.sectionHeader} activeOpacity={0.7}>
                  <Text style={styles.sectionTitle}>Benefícios</Text>
                  <Feather name="chevron-right" size={20} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={styles.cardsGrid}>
                  <SkeletonGridCard />
                  <SkeletonGridCard />
                </View>
              </View>

              {/* Bottom Action Rows */}
              <View style={styles.bottomActionsContainer}>
                <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
                  <View style={styles.actionRowIconContainer}>
                    <Feather name="help-circle" size={22} color="#FFFFFF" />
                  </View>
                  <View style={styles.actionRowTextContainer}>
                    <Text style={styles.actionRowTitle}>Central de ajuda</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
                  <View style={styles.actionRowIconContainer}>
                    <MaterialCommunityIcons
                      name="bug-outline"
                      size={22}
                      color="#FFFFFF"
                    />
                  </View>
                  <View style={styles.actionRowTextContainer}>
                    <Text style={styles.actionRowTitle}>Reportar problema</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
                  <View style={styles.actionRowIconContainer}>
                    <Feather name="log-out" size={22} color="#FFFFFF" />
                  </View>
                  <View style={styles.actionRowTextContainer}>
                    <Text style={styles.actionRowTitle}>Sair</Text>
                    <Text style={styles.actionRowSubtitle}>26.7</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212", // Premium charcoal black background
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 8,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1C1C1E", // Lighter premium dark gray circle
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 24,
    letterSpacing: 1.5,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  badgeContainer: {
    flexDirection: "row",
    marginTop: 6,
  },
  primeBadge: {
    backgroundColor: "#1E1E1E", // Dark pill background
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  primeBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  chevronRight: {
    marginLeft: 10,
  },
  quickCardsContainer: {
    marginVertical: 24,
  },
  quickCardsScroll: {
    paddingRight: 20,
  },
  quickCard: {
    width: 120,
    height: 108,
    backgroundColor: "#1C1C1E", // Lighter premium card
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  quickCardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  quickCardTitle: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 14,
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cardsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  gridCard: {
    flex: 1,
    height: 125,
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    padding: 16,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
    position: "relative",
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 18,
  },
  cardSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
    marginTop: 6,
  },
  cardIconBottomRight: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  cardHeaderLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  cardSubtitleSpecial: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 15,
    marginTop: "auto",
  },
  pointsCount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 8,
  },
  assessoriaLogoContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  primeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FF8C00", // Goldish/orange borders matching "inter prime" style
  },
  primeCircleText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  primeCircleSubtext: {
    color: "#FF8C00",
    fontWeight: "700",
    fontSize: 7,
    letterSpacing: 0.2,
    textTransform: "uppercase",
    marginTop: -2,
  },
  loopLogoContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  loopInnerCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF3D00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  loopRingWhite: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    opacity: 0.7,
  },
  loopRingCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  bottomActionsContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    paddingTop: 24,
    gap: 20,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 4,
  },
  actionRowIconContainer: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  actionRowTextContainer: {
    flex: 1,
  },
  actionRowTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  actionRowSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  skeletonQuickCard: {
    width: 115,
    height: 108,
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  skeletonCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  skeletonQuickLines: {
    gap: 4,
  },
  skeletonLine: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  skeletonGridCard: {
    flex: 1,
    height: 125,
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    padding: 16,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  skeletonTitleLine: {
    width: "65%",
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  skeletonSubLine: {
    width: "80%",
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    marginTop: 6,
  },
  skeletonCircleSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    alignSelf: "flex-end",
    marginTop: "auto",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  editTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 8,
    marginBottom: 28,
  },
  editProfileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  editAvatarWrapper: {
    position: "relative",
    width: 90,
    height: 90,
    marginRight: 20,
  },
  editAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#1C1C1E",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  editAvatarImg: {
    width: "100%",
    height: "100%",
    borderRadius: 45,
    resizeMode: "cover",
  },
  editAvatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 28,
    letterSpacing: 1.5,
  },
  editPencilBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#B35D25", // Copper brown matching the image
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#121212",
  },
  editProfileInfo: {
    flex: 1,
  },
  editProfileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  editProfileSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.4)",
    marginTop: 4,
  },
  inputCard: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 12,
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 32,
  },
  inputLabel: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  textInput: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    padding: 0,
  },
  skeletonSection: {
    marginTop: 8,
  },
  skeletonListRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  skeletonListIconContainer: {
    marginRight: 16,
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  skeletonListTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  skeletonListLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.35)", // Highly contrasted white/light gray
  },
  skeletonListBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 12,
  },
  skeletonListBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
});
