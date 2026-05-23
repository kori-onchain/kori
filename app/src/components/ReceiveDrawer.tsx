import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
import { Feather } from "../icons";
import { useTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/tokens";
import {
  PaymentActionCard,
  PaymentAmountField,
  PaymentCard,
  PaymentInfoCard,
  PaymentPrimaryButton,
  PaymentQrSurface,
  PaymentSegmentedControl,
  PaymentSecondaryButton,
  PaymentScreenFrame,
  PaymentToast,
  SectionTitle,
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
      <PaymentToast message={toast.message} opacity={toast.opacity} />
      <PaymentInfoCard
        icon="at-sign"
        label="Seu ID Kora"
        value={`@${USER_ID}`}
        description="Ideal para receber de contatos dentro da Kora."
        style={styles.sectionCard}
      />
      <PaymentActionCard
        title="Copiar ID"
        description={`Copia @${USER_ID} para a área de transferência`}
        icon="copy"
        onPress={handleCopy}
        style={styles.actionCard}
      />
      <PaymentActionCard
        title="Compartilhar link"
        description="Abre direto na transferência para você"
        icon="share-2"
        onPress={handleShare}
        style={styles.actionCard}
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
      <PaymentToast message={toast.message} opacity={toast.opacity} />
      <PaymentInfoCard
        icon="shield"
        iconColor={t.sol}
        label="Carteira Solana"
        value={WALLET_ADDRESS}
        description="Use para receber direto na carteira, sem expor identidade."
        mono
        style={styles.sectionCard}
      />
      <PaymentActionCard
        title="Copiar endereço"
        description={shortAddress}
        icon="copy"
        onPress={handleCopy}
        style={styles.actionCard}
      />
      <PaymentActionCard
        title="Compartilhar link"
        description="Abre direto no pagamento para você"
        icon="share-2"
        onPress={handleShare}
        style={styles.actionCard}
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
  return (
    <>
      <SectionTitle>Tipo de cobrança</SectionTitle>
      <PaymentSegmentedControl
        value={mode}
        onChange={setMode}
        style={styles.segmentControl}
        options={[
          { value: "free", label: "Valor livre" },
          { value: "fixed", label: "Valor fixo" },
        ]}
      />

      {mode === "fixed" ? (
        <PaymentAmountField
          value={amount}
          onChangeText={setAmount}
          style={styles.amountCard}
        />
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
      <PaymentToast message={toast.message} opacity={toast.opacity} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.stepContent}
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
          <PaymentCard padding={16} style={styles.generatedCard}>
            <SectionTitle>Link gerado</SectionTitle>
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
        contentContainerStyle={styles.stepContent}
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
          <PaymentQrSurface
            style={styles.generatedCard}
            amount={mode === "fixed" && amount ? `R$ ${amount}` : undefined}
            caption={
              mode === "free"
                ? "Quem escanear escolhe o valor."
                : `Pagamento de R$ ${amount} ao escanear.`
            }
            footer={
              <PaymentPrimaryButton
                label="Compartilhar"
                onPress={handleShare}
                icon={
                  <Feather name="share-2" size={16} color={t.btnPrimaryFg} />
                }
              />
            }
          >
            <QRCode
              value={buildQRValue()}
              size={200}
              color={t.ink}
              backgroundColor={t.bg2}
            />
          </PaymentQrSurface>
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
      title: "Link de pagamento",
      desc: "Valor livre ou cobrança fixa",
    },
    {
      screen: "qrcode" as Screen,
      icon: "grid" as const,
      title: "QR Code",
      desc: "Gere uma cobrança escaneável",
    },
  ];

  return (
    <PaymentScreenFrame title="Receber" onClose={onClose}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuBody}
      >
        <Text style={[styles.menuSubtitle, { color: t.inkMute }]}>
          Escolha como deseja receber.
        </Text>
        {options.map((option) => (
          <PaymentActionCard
            key={option.screen}
            title={option.title}
            description={option.desc}
            icon={option.icon}
            tone={option.color}
            onPress={() => onSelect(option.screen)}
            style={styles.actionCard}
          />
        ))}
      </ScrollView>
    </PaymentScreenFrame>
  );
};

export const ReceiveDrawer: React.FC<ReceiveDrawerProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTheme();
  const [screen, setScreen] = useState<Screen>("menu");
  const stepProgress = useRef(new Animated.Value(1)).current;
  const stepDirection = useRef(1);

  useEffect(() => {
    stepProgress.setValue(0);
    Animated.timing(stepProgress, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [screen, stepProgress]);

  const navigate = (next: Screen, direction = 1) => {
    stepProgress.stopAnimation();
    stepProgress.setValue(0);
    stepDirection.current = direction;
    setScreen(next);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setScreen("menu"), 300);
  };

  const renderScreen = () => {
    switch (screen) {
      case "share_id":
        return (
          <ShareIdScreen
            onBack={() => navigate("menu", -1)}
            onClose={handleClose}
          />
        );
      case "share_wallet":
        return (
          <ShareWalletScreen
            onBack={() => navigate("menu", -1)}
            onClose={handleClose}
          />
        );
      case "payment_link":
        return (
          <PaymentLinkScreen
            onBack={() => navigate("menu", -1)}
            onClose={handleClose}
          />
        );
      case "qrcode":
        return (
          <QRCodeScreen
            onBack={() => navigate("menu", -1)}
            onClose={handleClose}
          />
        );
      default:
        return (
          <MenuScreen
            onSelect={(next) => navigate(next, 1)}
            onClose={handleClose}
          />
        );
    }
  };

  const translateX = stepProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [stepDirection.current * 22, 0],
  });

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
          <Animated.View
            key={screen}
            style={[
              styles.stepShell,
              {
                opacity: stepProgress,
                transform: [{ translateX }],
              },
            ]}
          >
            {renderScreen()}
          </Animated.View>
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
  stepShell: {
    flex: 1,
  },
  menuBody: {
    paddingTop: 4,
    paddingBottom: 24,
  },
  menuSubtitle: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    marginBottom: 18,
  },
  stepContent: {
    paddingBottom: 24,
  },
  actionCard: {
    marginBottom: 10,
  },
  sectionCard: {
    marginBottom: 16,
  },
  segmentControl: {
    marginBottom: 18,
  },
  amountCard: {
    marginBottom: 18,
  },
  generatedCard: {
    marginBottom: 20,
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
});
