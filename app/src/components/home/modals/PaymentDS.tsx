import React from "react";
import {
  Animated,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  StyleProp,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Feather } from "@/icons";
import { Button } from "@components/layout/Button";
import { SoftCard } from "@components/layout/SoftCard";
import { useTheme } from "@theme/ThemeProvider";
import { fonts, radii } from "@theme/tokens";
import { PaymentRecipient } from "@type/payment";

export const formatPaymentAmount = (value?: string) => {
  if (!value) return "R$ 0,00";
  const number = Number.parseFloat(value.replace(",", "."));
  if (Number.isNaN(number)) return "R$ 0,00";
  return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const getRecipientInitials = (recipient: PaymentRecipient) => {
  if (recipient.isAnonymous) return "?";
  return (recipient.displayName || "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export const getRecipientId = (recipient: PaymentRecipient) => {
  if (recipient.type === "pix") return recipient.pixKey ?? recipient.displayName;
  return recipient.isAnonymous
    ? `${(recipient.walletAddress ?? "").slice(0, 8)}...${(recipient.walletAddress ?? "").slice(-6)}`
    : recipient.userId;
};

export const PaymentHeader: React.FC<{
  title: string;
  onBack?: () => void;
  onClose?: () => void;
  rightIcon?: React.ComponentProps<typeof Feather>["name"];
}> = ({ title, onBack, onClose, rightIcon = "x" }) => {
  const { t } = useTheme();
  return (
    <View style={[styles.header, { borderBottomColor: t.line }]}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onBack ?? onClose}
        style={styles.headerButtonSlot}
      >
        <SoftCard radius={19} padding={0} flat style={styles.headerButtonCard}>
          <View style={styles.headerButton}>
            <Feather
              name={onBack ? "arrow-left" : "x"}
              size={19}
              color={t.ink}
            />
          </View>
        </SoftCard>
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: t.ink }]}>{title}</Text>
      {onClose ? (
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onClose}
          style={styles.headerButtonSlot}
        >
          <SoftCard
            radius={19}
            padding={0}
            flat
            style={styles.headerButtonCard}
          >
            <View style={styles.headerButton}>
              <Feather name={rightIcon} size={19} color={t.inkMute} />
            </View>
          </SoftCard>
        </TouchableOpacity>
      ) : (
        <View style={styles.headerButtonSlot} />
      )}
    </View>
  );
};

export const PaymentScreenFrame: React.FC<{
  title: string;
  onBack?: () => void;
  onClose?: () => void;
  rightIcon?: React.ComponentProps<typeof Feather>["name"];
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, onBack, onClose, rightIcon, children, footer }) => {
  const { t } = useTheme();
  return (
    <View style={[styles.frame, { backgroundColor: t.bg }]}>
      <StatusBar
        barStyle={t.statusBar}
        backgroundColor={t.bg}
        translucent={false}
      />
      <SafeAreaView
        style={[
          styles.safeArea,
          { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
        ]}
      >
        <PaymentHeader
          title={title}
          onBack={onBack}
          onClose={onClose}
          rightIcon={rightIcon}
        />
        <View style={styles.body}>{children}</View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </SafeAreaView>
    </View>
  );
};

export const PaymentPrimaryButton: React.FC<{
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ label, onPress, disabled, icon, full, style }) => (
  <Button
    label={label}
    onPress={disabled ? undefined : onPress}
    icon={icon}
    iconPosition="right"
    full={full}
    style={[disabled && styles.disabled, style]}
  />
);

export const PaymentSecondaryButton: React.FC<{
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ label, onPress, icon, full, style }) => (
  <Button
    label={label}
    onPress={onPress}
    variant="secondary"
    icon={icon}
    iconPosition="right"
    full={full}
    style={style}
  />
);

export const PaymentCard: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
}> = ({ children, style, padding = 16 }) => (
  <SoftCard radius={radii.card} padding={padding} style={style}>
    {children}
  </SoftCard>
);

export const PaymentToast: React.FC<{
  message: string | null;
  opacity: Animated.Value;
}> = ({ message, opacity }) => {
  const { t } = useTheme();
  if (!message) return null;
  return (
    <Animated.View
      style={[
        styles.toast,
        { opacity, backgroundColor: t.bg2, borderColor: t.cardBorder },
      ]}
    >
      <Feather name="check-circle" size={15} color={t.green} />
      <Text style={[styles.toastText, { color: t.ink }]}>{message}</Text>
    </Animated.View>
  );
};

export const PaymentActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  tone?: string;
  onPress: () => void;
  style?: ViewStyle;
}> = ({ title, description, icon, tone, onPress, style }) => {
  const { t } = useTheme();
  const iconColor = tone ?? t.ink;
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={style}>
      <PaymentCard padding={14}>
        <View style={styles.actionRow}>
          <SoftCard
            radius={radii.cardSm}
            padding={0}
            flat
            style={styles.iconBubble}
          >
            <View style={styles.iconBubbleInner}>
              <Feather name={icon} size={18} color={iconColor} />
            </View>
          </SoftCard>
          <View style={styles.actionText}>
            <Text style={[styles.actionTitle, { color: t.ink }]}>{title}</Text>
            <Text style={[styles.actionDescription, { color: t.inkMute }]}>
              {description}
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color={t.inkMute} />
        </View>
      </PaymentCard>
    </TouchableOpacity>
  );
};

export const PaymentInfoCard: React.FC<{
  icon: React.ComponentProps<typeof Feather>["name"];
  iconColor?: string;
  label: string;
  value: string;
  description: string;
  mono?: boolean;
  style?: ViewStyle;
}> = ({ icon, iconColor, label, value, description, mono, style }) => {
  const { t } = useTheme();
  const resolvedIconColor = iconColor ?? t.ink;
  return (
    <PaymentCard padding={20} style={style}>
      <View style={styles.infoContent}>
        <SoftCard radius={28} padding={0} flat style={styles.infoIcon}>
          <View style={styles.infoIconInner}>
            <Feather name={icon} size={26} color={resolvedIconColor} />
          </View>
        </SoftCard>
        <Text style={[styles.infoLabel, { color: t.inkMute }]}>{label}</Text>
        <Text
          style={[styles.infoValue, mono && styles.mono, { color: t.ink }]}
          numberOfLines={mono ? 1 : undefined}
          ellipsizeMode="middle"
        >
          {value}
        </Text>
        <Text style={[styles.infoDescription, { color: t.inkDim }]}>
          {description}
        </Text>
      </View>
    </PaymentCard>
  );
};

export const PaymentSegmentedControl = <T extends string>({
  value,
  options,
  onChange,
  style,
}: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
  style?: ViewStyle;
}) => {
  const { t } = useTheme();
  return (
    <View
      style={[
        styles.segmentRow,
        { backgroundColor: t.bgElev, borderColor: t.cardBorder },
        style,
      ]}
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            activeOpacity={0.75}
            style={[
              styles.segment,
              active && { backgroundColor: t.btnPrimaryBg },
            ]}
            onPress={() => onChange(option.value)}
          >
            <Text
              style={[
                styles.segmentText,
                { color: active ? t.btnPrimaryFg : t.inkMute },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const PaymentAmountField: React.FC<{
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}> = ({ value, onChangeText, placeholder = "0,00", style }) => {
  const { t } = useTheme();
  return (
    <PaymentCard padding={14} style={style}>
      <View style={styles.amountRow}>
        <Text style={[styles.currencyPrefix, { color: t.inkMute }]}>R$</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          placeholderTextColor={t.inkMute}
          style={[styles.amountInput, { color: t.ink }]}
        />
      </View>
    </PaymentCard>
  );
};

export const PaymentQrSurface: React.FC<{
  children: React.ReactNode;
  amount?: string;
  caption: string;
  footer?: React.ReactNode;
  style?: ViewStyle;
}> = ({ children, amount, caption, footer, style }) => {
  const { t } = useTheme();
  return (
    <PaymentCard padding={18} style={style}>
      <View style={styles.qrContent}>
        {amount ? (
          <Text style={[styles.qrAmount, { color: t.ink }]}>{amount}</Text>
        ) : null}
        <View
          style={[
            styles.qrBox,
            { backgroundColor: t.bg2, borderColor: t.cardBorder },
          ]}
        >
          {children}
        </View>
        <Text style={[styles.qrCaption, { color: t.inkMute }]}>{caption}</Text>
        {footer}
      </View>
    </PaymentCard>
  );
};

export const RecipientAvatar: React.FC<{
  recipient: PaymentRecipient;
  size?: number;
}> = ({ recipient, size = 44 }) => {
  const { t } = useTheme();
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: recipient.isAnonymous ? t.bgElev : t.bg2,
          borderColor: recipient.isAnonymous ? t.line2 : t.orange,
        },
      ]}
    >
      {recipient.isAnonymous ? (
        <Feather
          name="eye-off"
          size={Math.round(size * 0.38)}
          color={t.inkMute}
        />
      ) : (
        <Text style={[styles.avatarText, { color: t.ink }]}>
          {getRecipientInitials(recipient)}
        </Text>
      )}
    </View>
  );
};

export const DetailRow: React.FC<{
  label: string;
  value: string;
  mono?: boolean;
}> = ({ label, value, mono }) => {
  const { t } = useTheme();
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: t.inkMute }]}>{label}</Text>
      <Text
        style={[styles.detailValue, mono && styles.mono, { color: t.ink }]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
};

export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTheme();
  return (
    <Text style={[styles.sectionTitle, { color: t.ink }]}>{children}</Text>
  );
};

const styles = StyleSheet.create({
  frame: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 62,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButtonSlot: {
    width: 38,
    height: 38,
  },
  headerButtonCard: {
    width: 38,
    height: 38,
  },
  headerButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: fonts.sans.semibold,
    fontSize: 16,
    fontWeight: "700",
  },
  body: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 22,
  },
  footer: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: Platform.OS === "ios" ? 36 : 22,
  },
  disabled: {
    opacity: 0.38,
  },
  toast: {
    position: "absolute",
    top: 74,
    alignSelf: "center",
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  toastText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  iconBubble: {
    width: 44,
    height: 44,
  },
  iconBubbleInner: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },
  actionDescription: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  infoContent: {
    alignItems: "center",
  },
  infoIcon: {
    width: 56,
    height: 56,
    marginBottom: 12,
  },
  infoIconInner: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontFamily: fonts.mono.semibold,
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  infoValue: {
    fontFamily: fonts.sans.bold,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  infoDescription: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  segmentRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: radii.btn,
    padding: 4,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    borderRadius: 11,
    paddingVertical: 10,
  },
  segmentText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    fontWeight: "700",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencyPrefix: {
    fontFamily: fonts.sans.bold,
    fontSize: 16,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontFamily: fonts.sans.bold,
    fontSize: 28,
    fontWeight: "800",
    paddingVertical: 2,
  },
  qrContent: {
    alignItems: "center",
  },
  qrAmount: {
    fontFamily: fonts.sans.bold,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.7,
    marginBottom: 18,
  },
  qrBox: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  qrCaption: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    marginBottom: 18,
  },
  avatar: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: fonts.sans.bold,
    fontSize: 13,
    fontWeight: "800",
  },
  detailRow: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  detailLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    fontWeight: "500",
  },
  detailValue: {
    flex: 1,
    textAlign: "right",
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    fontWeight: "700",
  },
  mono: {
    fontFamily: fonts.mono.medium,
    fontSize: 12,
  },
  sectionTitle: {
    fontFamily: fonts.sans.semibold,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
  },
});
