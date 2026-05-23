import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
import { Feather } from "../icons";
import { useTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/tokens";
import {
  PaymentCard,
  PaymentHeader,
  PaymentPrimaryButton,
  PaymentSecondaryButton,
  PaymentScreenFrame,
} from "./payment/PaymentDS";

const USER_ID = "opedrooz";
const WALLET_ADDRESS = "7nxB2xT8aYqP9mZ1cR5vW4kL3jH6fD9gS8xV1nC4X1a";
const APP_SCHEME = "kora://pay";

type Screen = "menu" | "share_id" | "share_wallet" | "payment_link" | "qrcode";

interface ReceiveDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const useToast = () => {
  const [message, setMessage] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;

  const show = (next: string) => {
    setMessage(next);
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => setMessage(null));
  };

  return { message, opacity, show };
};

const Toast: React.FC<{ message: string | null; opacity: Animated.Value }> = ({
  message,
  opacity,
}) => {
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

const ReceiveAction: React.FC<{
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  tone: string;
  onPress: () => void;
}> = ({ title, description, icon, tone, onPress }) => {
  const { t } = useTheme();
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
      <PaymentCard padding={14} style={styles.actionCard}>
        <View style={styles.actionRow}>
          <View style={[styles.actionIcon, { backgroundColor: t.bgElev }]}>
            <Feather name={icon} size={20} color={tone} />
          </View>
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

const InfoCard: React.FC<{
  icon: React.ComponentProps<typeof Feather>["name"];
  iconColor: string;
  label: string;
  value: string;
  description: string;
  mono?: boolean;
}> = ({ icon, iconColor, label, value, description, mono }) => {
  const { t } = useTheme();
  return (
    <PaymentCard padding={20} style={styles.infoCard}>
      <View style={[styles.infoIcon, { backgroundColor: t.bgElev }]}>
        <Feather name={icon} size={28} color={iconColor} />
      </View>
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
    </PaymentCard>
  );
};

const ShareIdScreen: React.FC<{ onBack: () => void; onClose: () => void }> = ({
  onBack,
  onClose,
}) => {
  const { t } = useTheme();
  const toast = useToast();
  const deepLink = `${APP_SCHEME}?to=${USER_ID}`;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(`@${USER_ID}`);
    toast.show("ID copiado");
  };

  const handleShare = async () => {
    await Share.share({
      message: `Me pague pelo Kora: ${deepLink}`,
      url: deepLink,
    });
  };

  return (
    <PaymentScreenFrame
      title="Compartilhar ID"
      onBack={onBack}
      onClose={onClose}
    >
      <Toast message={toast.message} opacity={toast.opacity} />
      <InfoCard
        icon="at-sign"
        iconColor={t.orange}
        label="Seu ID Kora"
        value={`@${USER_ID}`}
        description="Ideal para receber de contatos dentro da Kora."
      />
      <ReceiveAction
        title="Copiar ID"
        description={`Copia @${USER_ID} para a área de transferência`}
        icon="copy"
        tone={t.sol}
        onPress={handleCopy}
      />
      <ReceiveAction
        title="Compartilhar link"
        description="Abre direto na transferência para você"
        icon="share-2"
        tone={t.green}
        onPress={handleShare}
      />
    </PaymentScreenFrame>
  );
};

const ShareWalletScreen: React.FC<{
  onBack: () => void;
  onClose: () => void;
}> = ({ onBack, onClose }) => {
  const { t } = useTheme();
  const toast = useToast();
  const shortAddress = `${WALLET_ADDRESS.slice(0, 6)}...${WALLET_ADDRESS.slice(-6)}`;
  const deepLink = `${APP_SCHEME}?wallet=${WALLET_ADDRESS}`;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(WALLET_ADDRESS);
    toast.show("Endereço copiado");
  };

  const handleShare = async () => {
    await Share.share({
      message: `Me pague pelo Kora: ${deepLink}`,
      url: deepLink,
    });
  };

  return (
    <PaymentScreenFrame
      title="Wallet address"
      onBack={onBack}
      onClose={onClose}
    >
      <Toast message={toast.message} opacity={toast.opacity} />
      <InfoCard
        icon="shield"
        iconColor={t.sol}
        label="Carteira Solana"
        value={WALLET_ADDRESS}
        description="Use para receber direto na carteira, sem expor identidade."
        mono
      />
      <ReceiveAction
        title="Copiar endereço"
        description={shortAddress}
        icon="copy"
        tone={t.sol}
        onPress={handleCopy}
      />
      <ReceiveAction
        title="Compartilhar link"
        description="Abre direto no pagamento para você"
        icon="share-2"
        tone={t.green}
        onPress={handleShare}
      />
    </PaymentScreenFrame>
  );
};

const ChargeControls: React.FC<{
  mode: "free" | "fixed";
  amount: string;
  setMode: (mode: "free" | "fixed") => void;
  setAmount: (amount: string) => void;
}> = ({ mode, amount, setMode, setAmount }) => {
  const { t } = useTheme();
  return (
    <>
      <Text style={[styles.sectionLabel, { color: t.inkMute }]}>
        Tipo de cobrança
      </Text>
      <View
        style={[
          styles.segmentRow,
          { backgroundColor: t.bgElev, borderColor: t.cardBorder },
        ]}
      >
        {(["free", "fixed"] as const).map((item) => {
          const active = mode === item;
          return (
            <TouchableOpacity
              key={item}
              activeOpacity={0.75}
              style={[
                styles.segment,
                active && { backgroundColor: t.btnPrimaryBg },
              ]}
              onPress={() => setMode(item)}
            >
              <Text
                style={[
                  styles.segmentText,
                  { color: active ? t.btnPrimaryFg : t.inkMute },
                ]}
              >
                {item === "free" ? "Valor livre" : "Valor fixo"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {mode === "fixed" ? (
        <PaymentCard padding={14} style={styles.amountCard}>
          <View style={styles.amountRow}>
            <Text style={[styles.currencyPrefix, { color: t.inkMute }]}>
              R$
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0,00"
              placeholderTextColor={t.inkMute}
              style={[styles.amountInput, { color: t.ink }]}
            />
          </View>
        </PaymentCard>
      ) : null}
    </>
  );
};

const PaymentLinkScreen: React.FC<{
  onBack: () => void;
  onClose: () => void;
}> = ({ onBack, onClose }) => {
  const { t } = useTheme();
  const toast = useToast();
  const [mode, setMode] = useState<"free" | "fixed">("free");
  const [amount, setAmount] = useState("");
  const [generated, setGenerated] = useState(false);

  const buildLink = () => {
    const base = `${APP_SCHEME}?to=${USER_ID}`;
    return mode === "fixed" && amount
      ? `${base}&amount=${amount.replace(",", ".")}`
      : base;
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(buildLink());
    toast.show("Link copiado");
  };

  const handleShare = async () => {
    const link = buildLink();
    await Share.share({ message: `Me pague pelo Kora: ${link}`, url: link });
  };

  const canGenerate = mode === "free" || !!amount;

  return (
    <PaymentScreenFrame
      title="Link de pagamento"
      onBack={onBack}
      onClose={onClose}
      footer={
        generated ? undefined : (
          <PaymentPrimaryButton
            label="Gerar link"
            onPress={() => setGenerated(true)}
            disabled={!canGenerate}
            icon={<Feather name="link" size={16} color={t.btnPrimaryFg} />}
          />
        )
      }
    >
      <Toast message={toast.message} opacity={toast.opacity} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ChargeControls
          mode={mode}
          amount={amount}
          setMode={(next) => {
            setMode(next);
            setGenerated(false);
          }}
          setAmount={(next) => {
            setAmount(next);
            setGenerated(false);
          }}
        />

        {generated ? (
          <PaymentCard padding={16} style={styles.generatedCard}>
            <Text style={[styles.generatedLabel, { color: t.inkMute }]}>
              Link gerado
            </Text>
            <Text
              style={[styles.generatedValue, { color: t.ink }]}
              numberOfLines={3}
            >
              {buildLink()}
            </Text>
            <View style={styles.splitActions}>
              <PaymentSecondaryButton
                label="Copiar"
                onPress={handleCopy}
                full
                icon={<Feather name="copy" size={16} color={t.ink} />}
              />
              <PaymentPrimaryButton
                label="Compartilhar"
                onPress={handleShare}
                full
                icon={
                  <Feather name="share-2" size={16} color={t.btnPrimaryFg} />
                }
              />
            </View>
          </PaymentCard>
        ) : null}
      </ScrollView>
    </PaymentScreenFrame>
  );
};

const QRCodeScreen: React.FC<{ onBack: () => void; onClose: () => void }> = ({
  onBack,
  onClose,
}) => {
  const { t } = useTheme();
  const [mode, setMode] = useState<"free" | "fixed">("free");
  const [amount, setAmount] = useState("");
  const [generated, setGenerated] = useState(false);

  const buildQRValue = () => {
    const base = `${APP_SCHEME}?to=${USER_ID}`;
    return mode === "fixed" && amount
      ? `${base}&amount=${amount.replace(",", ".")}`
      : base;
  };

  const handleShare = async () => {
    const link = buildQRValue();
    await Share.share({ message: `Me pague pelo Kora: ${link}`, url: link });
  };

  const canGenerate = mode === "free" || !!amount;

  return (
    <PaymentScreenFrame
      title="QR Code"
      onBack={onBack}
      onClose={onClose}
      footer={
        generated ? undefined : (
          <PaymentPrimaryButton
            label="Gerar QR Code"
            onPress={() => setGenerated(true)}
            disabled={!canGenerate}
            icon={<Feather name="grid" size={16} color={t.btnPrimaryFg} />}
          />
        )
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollPad}
      >
        <ChargeControls
          mode={mode}
          amount={amount}
          setMode={(next) => {
            setMode(next);
            setGenerated(false);
          }}
          setAmount={(next) => {
            setAmount(next);
            setGenerated(false);
          }}
        />

        {generated ? (
          <PaymentCard padding={18} style={styles.qrCard}>
            {mode === "fixed" && amount ? (
              <Text style={[styles.qrAmount, { color: t.ink }]}>
                R$ {amount}
              </Text>
            ) : null}
            <View
              style={[
                styles.qrBox,
                { backgroundColor: t.bg2, borderColor: t.cardBorder },
              ]}
            >
              <QRCode
                value={buildQRValue()}
                size={200}
                color={t.ink}
                backgroundColor={t.bg2}
              />
            </View>
            <Text style={[styles.qrCaption, { color: t.inkMute }]}>
              {mode === "free"
                ? "Quem escanear escolhe o valor."
                : `Pagamento de R$ ${amount} ao escanear.`}
            </Text>
            <PaymentPrimaryButton
              label="Compartilhar"
              onPress={handleShare}
              icon={<Feather name="share-2" size={16} color={t.btnPrimaryFg} />}
            />
          </PaymentCard>
        ) : null}
      </ScrollView>
    </PaymentScreenFrame>
  );
};

const MenuScreen: React.FC<{
  onSelect: (screen: Screen) => void;
  onClose: () => void;
}> = ({ onSelect, onClose }) => {
  const { t } = useTheme();
  const options = [
    {
      screen: "share_id" as Screen,
      icon: "at-sign" as const,
      color: t.orange,
      title: "Compartilhar ID",
      desc: "Receba pelo seu @usuário Kora",
    },
    {
      screen: "share_wallet" as Screen,
      icon: "shield" as const,
      color: t.sol,
      title: "Wallet address",
      desc: "Receba direto na carteira",
    },
    {
      screen: "payment_link" as Screen,
      icon: "link" as const,
      color: t.ink,
      title: "Link de pagamento",
      desc: "Valor livre ou cobrança fixa",
    },
    {
      screen: "qrcode" as Screen,
      icon: "grid" as const,
      color: t.green,
      title: "QR Code",
      desc: "Gere uma cobrança escaneável",
    },
  ];

  return (
    <View style={[styles.menuFrame, { backgroundColor: t.bg }]}>
      <PaymentHeader title="Receber" onClose={onClose} />
      <View style={styles.menuBody}>
        <Text style={[styles.menuSubtitle, { color: t.inkMute }]}>
          Escolha como deseja receber.
        </Text>
        {options.map((option) => (
          <ReceiveAction
            key={option.screen}
            title={option.title}
            description={option.desc}
            icon={option.icon}
            tone={option.color}
            onPress={() => onSelect(option.screen)}
          />
        ))}
      </View>
    </View>
  );
};

export const ReceiveDrawer: React.FC<ReceiveDrawerProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTheme();
  const [screen, setScreen] = useState<Screen>("menu");

  const handleClose = () => {
    onClose();
    setTimeout(() => setScreen("menu"), 300);
  };

  const renderScreen = () => {
    switch (screen) {
      case "share_id":
        return (
          <ShareIdScreen
            onBack={() => setScreen("menu")}
            onClose={handleClose}
          />
        );
      case "share_wallet":
        return (
          <ShareWalletScreen
            onBack={() => setScreen("menu")}
            onClose={handleClose}
          />
        );
      case "payment_link":
        return (
          <PaymentLinkScreen
            onBack={() => setScreen("menu")}
            onClose={handleClose}
          />
        );
      case "qrcode":
        return (
          <QRCodeScreen
            onBack={() => setScreen("menu")}
            onClose={handleClose}
          />
        );
      default:
        return <MenuScreen onSelect={setScreen} onClose={handleClose} />;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View
          style={[
            styles.drawer,
            { backgroundColor: t.bg, borderColor: t.line },
          ]}
        >
          <View style={[styles.handleBar, { backgroundColor: t.inkFaint }]} />
          {renderScreen()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
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
    height: "88%",
    overflow: "hidden",
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 6,
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
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  toastText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    fontWeight: "700",
  },
  menuFrame: {
    flex: 1,
  },
  menuBody: {
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  menuSubtitle: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    marginBottom: 16,
  },
  actionCard: {
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
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
  infoCard: {
    marginBottom: 16,
    alignItems: "center",
  },
  infoIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
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
  mono: {
    fontFamily: fonts.mono.medium,
    fontSize: 13,
  },
  infoDescription: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  sectionLabel: {
    fontFamily: fonts.mono.semibold,
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  segmentRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
  },
  segmentText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    fontWeight: "700",
  },
  amountCard: {
    marginBottom: 18,
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
  generatedCard: {
    marginBottom: 20,
  },
  generatedLabel: {
    fontFamily: fonts.mono.semibold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  generatedValue: {
    fontFamily: fonts.mono.medium,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  splitActions: {
    flexDirection: "row",
    gap: 10,
  },
  scrollPad: {
    paddingBottom: 24,
  },
  qrCard: {
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
});
