import React from "react";
import {
  Platform,
  StyleSheet,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Feather } from "../../icons";
import { Button } from "../ds/Button";
import { SoftCard } from "../ds/SoftCard";
import { useTheme } from "../../theme/ThemeProvider";
import { fonts, radii } from "../../theme/tokens";
import { PaymentRecipient } from "../../types/payment";

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

export const getRecipientId = (recipient: PaymentRecipient) =>
  recipient.isAnonymous
    ? `${(recipient.walletAddress ?? "").slice(0, 8)}...${(recipient.walletAddress ?? "").slice(-6)}`
    : recipient.userId;

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
        style={[styles.headerButton, { backgroundColor: t.bg2 }]}
      >
        <Feather name={onBack ? "arrow-left" : "x"} size={20} color={t.ink} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: t.ink }]}>{title}</Text>
      {onClose ? (
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onClose}
          style={[styles.headerButton, { backgroundColor: t.bg2 }]}
        >
          <Feather name={rightIcon} size={20} color={t.inkMute} />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerButton} />
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
      <PaymentHeader
        title={title}
        onBack={onBack}
        onClose={onClose}
        rightIcon={rightIcon}
      />
      <View style={styles.body}>{children}</View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
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
  style?: ViewStyle;
  padding?: number;
}> = ({ children, style, padding = 16 }) => (
  <SoftCard radius={radii.card} padding={padding} style={style}>
    {children}
  </SoftCard>
);

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
          borderColor: recipient.isAnonymous ? t.line2 : t.sol,
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
  header: {
    height: 62,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
