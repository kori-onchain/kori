import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
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
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons, PixIcon } from "@/icons";
import { useTheme } from "@theme/ThemeProvider";
import { fonts, radii } from "@theme/tokens";
import {
  PaymentCard,
  PaymentPrimaryButton,
  PaymentQrSurface,
  PaymentSecondaryButton,
  PaymentToast,
  PaymentSegmentedControl,
  PaymentInfoCard,
  PaymentActionCard,
  SectionTitle,
  DetailRow,
} from "@components/home/modals/PaymentDS";
import { mockProducts, Product } from "@/data/merchant";

const USER_ID = "opedrooz";
const WALLET_ADDRESS = "7nxB2xT8aYqP9mZ1cR5vW4kL3jH6fD9gS8xV1nC4X1a";
const APP_SCHEME = "kori://pay";

type Screen = "menu" | "share_id" | "share_wallet" | "payment_link" | "qrcode" | "card" | "amount_entry" | "pix";

interface ReceiveDrawerProps {
  visible: boolean;
  onClose: () => void;
  accountType?: "PF" | "PJ";
}

const KEYPAD_ROWS: [string, string][][] = [
  [["1", ""], ["2", "ABC"], ["3", "DEF"]],
  [["4", "GHI"], ["5", "JKL"], ["6", "MNO"]],
  [["7", "PQRS"], ["8", "TUV"], ["9", "WXYZ"]],
  [[",", ""], ["0", ""], ["⌫", ""]],
];

const useToast = () => {
  const [message, setMessage] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;

  const show = (next: string) => {
    setMessage(next);
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.delay(1500),
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => setMessage(null));
  };

  return { message, opacity, show };
};

/* ── Bottom Sheet Wrapper for dynamic height alignment ── */
const BottomSheetFrame: React.FC<{
  title: string;
  onBack?: () => void;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, onBack, onClose, children, footer }) => {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === "ios" ? 36 : 24);

  return (
    <View style={{ width: "100%", backgroundColor: t.bg, flexShrink: 1 }}>
      <View style={[menuStyles.header, { borderBottomColor: t.line }]}>
        <TouchableOpacity onPress={onBack ?? onClose} activeOpacity={0.7} style={menuStyles.closeBtn}>
          <Feather name={onBack ? "arrow-left" : "x"} size={20} color={t.inkDim} />
        </TouchableOpacity>
        <Text style={[menuStyles.headerTitle, { color: t.ink }]}>{title}</Text>
        {onBack ? (
          <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={menuStyles.closeBtn}>
            <Feather name="x" size={20} color={t.inkDim} />
          </TouchableOpacity>
        ) : (
          <View style={menuStyles.headerLeft} />
        )}
      </View>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: bottomPadding, flexShrink: 1 }}>
        {children}
        {footer ? <View style={{ marginTop: 16 }}>{footer}</View> : null}
      </View>
    </View>
  );
};

/* ── Choice Cards instead of segmented control for free/fixed ── */
const ChoiceCards: React.FC<{
  selected: "free" | "fixed" | null;
  onSelect: (mode: "free" | "fixed") => void;
}> = ({ selected, onSelect }) => {
  const { t } = useTheme();
  return (
    <View style={choiceStyles.row}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onSelect("free")}
        style={[
          choiceStyles.card,
          {
            backgroundColor: t.bg2,
            borderColor: selected === "free" ? t.orange : t.cardBorder,
          },
        ]}
      >
        <View style={[choiceStyles.iconCircle, { backgroundColor: t.bgElev }]}>
          <Feather name="edit-3" size={20} color={selected === "free" ? t.orange : t.inkDim} />
        </View>
        <Text style={[choiceStyles.title, { color: t.ink }]}>Valor Livre</Text>
        <Text style={[choiceStyles.desc, { color: t.inkMute }]}>Quem paga escolhe o valor</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onSelect("fixed")}
        style={[
          choiceStyles.card,
          {
            backgroundColor: t.bg2,
            borderColor: selected === "fixed" ? t.orange : t.cardBorder,
          },
        ]}
      >
        <View style={[choiceStyles.iconCircle, { backgroundColor: t.bgElev }]}>
          <Feather name="dollar-sign" size={20} color={selected === "fixed" ? t.orange : t.inkDim} />
        </View>
        <Text style={[choiceStyles.title, { color: t.ink }]}>Valor Fixo</Text>
        <Text style={[choiceStyles.desc, { color: t.inkMute }]}>Defina o valor cobrado</Text>
      </TouchableOpacity>
    </View>
  );
};

/* ── Amount Entry Screen (like AmountScreen but full overlays inside drawer) ── */
const AmountEntryScreen: React.FC<{
  onConfirm: (val: string, prod: Product | null) => void;
  onBack: () => void;
  initialAmount?: string;
  initialProduct?: Product | null;
  accountType?: "PF" | "PJ";
}> = ({ onConfirm, onBack, initialAmount = "", initialProduct = null, accountType }) => {
  const { t, scheme } = useTheme();
  const [raw, setRaw] = useState(initialAmount);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProduct);
  const [showProductPicker, setShowProductPicker] = useState(false);

  const isZero = !raw || parseFloat(raw.replace(",", ".")) === 0;

  const handleKey = (key: string) => {
    if (key === "⌫") {
      setRaw((prev) => prev.slice(0, -1));
      setSelectedProduct(null);
      return;
    }
    if (key === "," && raw.includes(",")) return;
    if (raw.length >= 10) return;
    setRaw((prev) => prev + key);
    setSelectedProduct(null);
  };

  const handlePreset = (value: string) => {
    setRaw(value);
    setSelectedProduct(null);
  };

  const displayAmount = raw ? `R$ ${raw}` : "R$ 0,00";

  const keyBg = scheme === "dark" ? "#1a1a1e" : "#e4e4e8";
  const keyBgDelete = scheme === "dark" ? "#111114" : "#d4d4d8";

  return (
    <BottomSheetFrame
      title={showProductPicker ? "Vincular Produto" : "Digitar Valor"}
      onBack={showProductPicker ? () => setShowProductPicker(false) : onBack}
      onClose={onBack}
      footer={
        showProductPicker ? undefined : (
          <PaymentPrimaryButton
            label="Confirmar"
            onPress={() => onConfirm(raw, selectedProduct)}
            disabled={isZero}
          />
        )
      }
    >
      {showProductPicker ? (
        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
          <View style={{ gap: 10, paddingBottom: 16 }}>
            {mockProducts.map((p) => (
              <TouchableOpacity
                key={p.id}
                activeOpacity={0.8}
                onPress={() => {
                  setRaw(p.price.toString().replace(".", ","));
                  setSelectedProduct(p);
                  setShowProductPicker(false);
                }}
                style={[
                  styles.productItemRow,
                  {
                    backgroundColor: t.bg2,
                    borderColor: selectedProduct?.id === p.id ? t.orange : t.cardBorder,
                  },
                ]}
              >
                <View style={[styles.productImagePlaceholder, { backgroundColor: t.bgElev }]}>
                  <Feather name="box" size={18} color={t.orange} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.productItemName, { color: t.ink }]}>{p.name}</Text>
                  <Text style={[styles.productItemCategory, { color: t.inkMute }]}>{p.category}</Text>
                </View>
                <Text style={[styles.productItemPrice, { color: t.orange }]}>
                  R$ {p.price.toFixed(2).replace(".", ",")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={{ alignItems: "center" }}>
          {selectedProduct ? (
            <View style={[styles.linkedProductBadge, { backgroundColor: `${t.orange}15` }]}>
              <Feather name="package" size={12} color={t.orange} style={{ marginRight: 6 }} />
              <Text style={[styles.linkedProductText, { color: t.orange }]}>
                Vinculado: {selectedProduct.name}
              </Text>
            </View>
          ) : null}

          <Text style={[styles.amountDisplayLabel, { color: t.inkMute }]}>Valor a ser cobrado</Text>
          <Text style={[styles.amountDisplayVal, { color: isZero ? t.inkFaint : t.ink }]} numberOfLines={1}>
            {displayAmount}
          </Text>

          {/* Product Picker Button (Seller only) */}
          {accountType === "PJ" && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowProductPicker(true)}
              style={[styles.productLinkBtn, { borderColor: t.orange }]}
            >
              <Feather name="package" size={14} color={t.orange} style={{ marginRight: 6 }} />
              <Text style={[styles.productLinkBtnText, { color: t.orange }]}>
                Escolher Produto da Vitrine
              </Text>
            </TouchableOpacity>
          )}

          {/* Presets Row */}
          <View style={styles.presetsRow}>
            {["10", "25", "50", "100"].map((val) => (
              <TouchableOpacity
                key={val}
                activeOpacity={0.75}
                onPress={() => handlePreset(val)}
                style={[styles.presetChip, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}
              >
                <Text style={[styles.presetText, { color: t.inkDim }]}>R$ {val}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Keypad */}
          <View style={styles.keypad}>
            {KEYPAD_ROWS.map((row, rowIdx) => (
              <View key={rowIdx} style={styles.keyRow}>
                {row.map(([digit, sub]) => {
                  const isDelete = digit === "⌫";
                  return (
                    <TouchableOpacity
                      key={digit}
                      activeOpacity={0.55}
                      onPress={() => handleKey(digit)}
                      style={[styles.key, { backgroundColor: isDelete ? keyBgDelete : keyBg }]}
                    >
                      {isDelete ? (
                        <Feather name="delete" size={20} color={t.inkDim} />
                      ) : (
                        <View style={styles.keyInner}>
                          <Text style={[styles.keyDigit, { color: t.ink }]}>{digit}</Text>
                          {sub ? <Text style={[styles.keySub, { color: t.inkMute }]}>{sub}</Text> : null}
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      )}
    </BottomSheetFrame>
  );
};

/* ── Sub-screens ─────────────────────────────────────── */
const ShareIdScreen: React.FC<{ onBack: () => void; onClose: () => void }> = ({ onBack, onClose }) => {
  const toast = useToast();
  const deepLink = `${APP_SCHEME}?to=${USER_ID}`;

  return (
    <BottomSheetFrame title="Compartilhar ID" onBack={onBack} onClose={onClose}>
      <PaymentToast message={toast.message} opacity={toast.opacity} />
      <PaymentInfoCard
        icon="at-sign"
        label="Seu ID Kori"
        value={`@${USER_ID}`}
        description="Ideal para receber de contatos dentro da Kori."
        style={styles.sectionCard}
      />
      <PaymentActionCard
        title="Copiar ID"
        description={`Copia @${USER_ID} para a área de transferência`}
        icon="copy"
        onPress={async () => { await Clipboard.setStringAsync(`@${USER_ID}`); toast.show("ID copiado"); }}
        style={styles.actionCard}
      />
      <PaymentActionCard
        title="Compartilhar link"
        description="Abre direto na transferência para você"
        icon="share-2"
        onPress={async () => { await Share.share({ message: `Me pague pelo Kori: ${deepLink}`, url: deepLink }); }}
        style={styles.actionCard}
      />
    </BottomSheetFrame>
  );
};

const ShareWalletScreen: React.FC<{ onBack: () => void; onClose: () => void }> = ({ onBack, onClose }) => {
  const { t } = useTheme();
  const toast = useToast();
  const shortAddress = `${WALLET_ADDRESS.slice(0, 6)}...${WALLET_ADDRESS.slice(-6)}`;
  const deepLink = `${APP_SCHEME}?wallet=${WALLET_ADDRESS}`;

  return (
    <BottomSheetFrame title="Wallet address" onBack={onBack} onClose={onClose}>
      <PaymentToast message={toast.message} opacity={toast.opacity} />

      <View style={[styles.anonBanner, { backgroundColor: `${t.sol}10`, borderColor: `${t.sol}20` }]}>
        <Feather name="eye-off" size={18} color={t.sol} style={{ marginRight: 8 }} />
        <Text style={[styles.anonText, { color: t.inkDim }]}>
          Transação anônima — nenhum dado pessoal vinculado.
        </Text>
      </View>

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
        onPress={async () => { await Clipboard.setStringAsync(WALLET_ADDRESS); toast.show("Endereço copiado"); }}
        style={styles.actionCard}
      />
      <PaymentActionCard
        title="Compartilhar link"
        description="Abre direto no pagamento para você"
        icon="share-2"
        onPress={async () => { await Share.share({ message: `Me pague pelo Kori: ${deepLink}`, url: deepLink }); }}
        style={styles.actionCard}
      />
    </BottomSheetFrame>
  );
};

const PaymentLinkScreen: React.FC<{
  onBack: () => void;
  onClose: () => void;
  amount: string;
  setAmount: (a: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  mode: "free" | "fixed";
  setMode: (m: "free" | "fixed") => void;
  onOpenAmountEntry: () => void;
  accountType?: "PF" | "PJ";
}> = ({
  onBack,
  onClose,
  amount,
  setAmount,
  selectedProduct,
  setSelectedProduct,
  mode,
  setMode,
  onOpenAmountEntry,
  accountType,
}) => {
  const { t } = useTheme();
  const toast = useToast();
  const [generated, setGenerated] = useState(false);

  const buildLink = () => {
    const base = `${APP_SCHEME}?to=${USER_ID}`;
    return mode === "fixed" && amount ? `${base}&amount=${amount.replace(",", ".")}` : base;
  };

  const canGenerate = mode === "free" || !!amount;
  const displayAmount = amount ? `R$ ${parseFloat(amount.replace(",", ".")).toFixed(2).replace(".", ",")}` : "R$ 0,00";

  return (
    <BottomSheetFrame
      title="Link de pagamento"
      onBack={onBack}
      onClose={onClose}
      footer={generated ? undefined : (
        <PaymentPrimaryButton
          label="Gerar link"
          onPress={() => setGenerated(true)}
          disabled={!canGenerate}
          icon={<Feather name="link" size={16} color={t.btnPrimaryFg} />}
        />
      )}
    >
      <PaymentToast message={toast.message} opacity={toast.opacity} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.stepContent}>
        <SectionTitle>Valor da Cobrança</SectionTitle>
        <ChoiceCards
          selected={mode}
          onSelect={(m) => {
            setMode(m);
            setGenerated(false);
            if (m === "fixed") {
              onOpenAmountEntry();
            } else {
              setAmount("");
              setSelectedProduct(null);
            }
          }}
        />

        {mode === "fixed" && !!amount && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onOpenAmountEntry}
            style={[styles.amountDisplayCard, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.amountDisplayCardLabel, { color: t.inkMute }]}>
                {selectedProduct ? `Produto: ${selectedProduct.name}` : "Valor Definido"}
              </Text>
              <Text style={[styles.amountDisplayCardVal, { color: t.ink }]}>{displayAmount}</Text>
            </View>
            <Feather name="edit" size={16} color={t.orange} />
          </TouchableOpacity>
        )}

        {generated && (
          <PaymentCard padding={16} style={styles.generatedCard}>
            <SectionTitle>Link gerado</SectionTitle>
            <Text style={[styles.generatedValue, { color: t.ink }]} numberOfLines={3}>{buildLink()}</Text>
            <View style={styles.splitActions}>
              <PaymentSecondaryButton label="Copiar" onPress={async () => { await Clipboard.setStringAsync(buildLink()); toast.show("Link copiado"); }} full icon={<Feather name="copy" size={16} color={t.ink} />} />
              <PaymentPrimaryButton label="Compartilhar" onPress={async () => { const l = buildLink(); await Share.share({ message: `Me pague pelo Kori: ${l}`, url: l }); }} full icon={<Feather name="share-2" size={16} color={t.btnPrimaryFg} />} />
            </View>
          </PaymentCard>
        )}
      </ScrollView>
    </BottomSheetFrame>
  );
};

const QRCodeScreen: React.FC<{
  onBack: () => void;
  onClose: () => void;
  amount: string;
  setAmount: (a: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  mode: "free" | "fixed";
  setMode: (m: "free" | "fixed") => void;
  onOpenAmountEntry: () => void;
  accountType?: "PF" | "PJ";
}> = ({
  onBack,
  onClose,
  amount,
  setAmount,
  selectedProduct,
  setSelectedProduct,
  mode,
  setMode,
  onOpenAmountEntry,
  accountType,
}) => {
  const { t } = useTheme();
  const [generated, setGenerated] = useState(false);

  const buildQRValue = () => {
    const base = `${APP_SCHEME}?to=${USER_ID}`;
    return mode === "fixed" && amount ? `${base}&amount=${amount.replace(",", ".")}` : base;
  };

  const canGenerate = mode === "free" || !!amount;
  const displayAmount = amount ? `R$ ${parseFloat(amount.replace(",", ".")).toFixed(2).replace(".", ",")}` : "R$ 0,00";

  return (
    <BottomSheetFrame
      title="QR Code"
      onBack={onBack}
      onClose={onClose}
      footer={generated ? undefined : (
        <PaymentPrimaryButton
          label="Gerar QR Code"
          onPress={() => setGenerated(true)}
          disabled={!canGenerate}
          icon={<Feather name="grid" size={16} color={t.btnPrimaryFg} />}
        />
      )}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.stepContent}>
        <SectionTitle>Valor da Cobrança</SectionTitle>
        <ChoiceCards
          selected={mode}
          onSelect={(m) => {
            setMode(m);
            setGenerated(false);
            if (m === "fixed") {
              onOpenAmountEntry();
            } else {
              setAmount("");
              setSelectedProduct(null);
            }
          }}
        />

        {mode === "fixed" && !!amount && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onOpenAmountEntry}
            style={[styles.amountDisplayCard, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.amountDisplayCardLabel, { color: t.inkMute }]}>
                {selectedProduct ? `Produto: ${selectedProduct.name}` : "Valor Definido"}
              </Text>
              <Text style={[styles.amountDisplayCardVal, { color: t.ink }]}>{displayAmount}</Text>
            </View>
            <Feather name="edit" size={16} color={t.orange} />
          </TouchableOpacity>
        )}

        {generated && (
          <PaymentQrSurface
            style={styles.generatedCard}
            amount={mode === "fixed" && amount ? `R$ ${amount}` : undefined}
            caption={mode === "free" ? "Quem escanear escolhe o valor." : `Pagamento de R$ ${amount} ao escanear.`}
            footer={
              <PaymentPrimaryButton
                label="Compartilhar"
                onPress={async () => { const l = buildQRValue(); await Share.share({ message: `Me pague pelo Kori: ${l}`, url: l }); }}
                icon={<Feather name="share-2" size={16} color={t.btnPrimaryFg} />}
              />
            }
          >
            <QRCode value={buildQRValue()} size={160} color={t.ink} backgroundColor={t.bg2} />
          </PaymentQrSurface>
        )}
      </ScrollView>
    </BottomSheetFrame>
  );
};

/* ── Card Type Cards for Debit/Credit Selection ── */
const CardTypeCards: React.FC<{
  selected: "credit" | "debit";
  onSelect: (type: "credit" | "debit") => void;
}> = ({ selected, onSelect }) => {
  const { t } = useTheme();
  return (
    <View style={choiceStyles.row}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onSelect("debit")}
        style={[
          choiceStyles.card,
          {
            backgroundColor: t.bg2,
            borderColor: selected === "debit" ? t.orange : t.cardBorder,
          },
        ]}
      >
        <View style={[choiceStyles.iconCircle, { backgroundColor: t.bgElev }]}>
          <Feather name="arrow-down-left" size={20} color={selected === "debit" ? t.orange : t.inkDim} />
        </View>
        <Text style={[choiceStyles.title, { color: t.ink }]}>Débito</Text>
        <Text style={[choiceStyles.desc, { color: t.inkMute }]}>À vista, menor taxa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onSelect("credit")}
        style={[
          choiceStyles.card,
          {
            backgroundColor: t.bg2,
            borderColor: selected === "credit" ? t.orange : t.cardBorder,
          },
        ]}
      >
        <View style={[choiceStyles.iconCircle, { backgroundColor: t.bgElev }]}>
          <Feather name="credit-card" size={20} color={selected === "credit" ? t.orange : t.inkDim} />
        </View>
        <Text style={[choiceStyles.title, { color: t.ink }]}>Crédito</Text>
        <Text style={[choiceStyles.desc, { color: t.inkMute }]}>À vista ou parcelado</Text>
      </TouchableOpacity>
    </View>
  );
};

/* ── CardPOS Screen for Seller Tap To Pay ── */
const CardScreen: React.FC<{
  onBack: () => void;
  onClose: () => void;
  amount: string;
  setAmount: (a: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  mode: "free" | "fixed";
  setMode: (m: "free" | "fixed") => void;
  onOpenAmountEntry: () => void;
}> = ({
  onBack,
  onClose,
  amount,
  setAmount,
  selectedProduct,
  setSelectedProduct,
  mode: _mode,
  setMode: _setMode,
  onOpenAmountEntry,
}) => {
  const { t } = useTheme();
  const [step, setStep] = useState<1 | 2 | 3>(() => (amount ? 3 : 1));
  const [cardType, setCardType] = useState<"credit" | "debit">("credit");
  const [installments, setInstallments] = useState(1);
  const [charging, setCharging] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (charging && !success) {
      const timer = setTimeout(() => {
        setSuccess(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [charging, success]);

  useEffect(() => {
    if (!amount && step === 3) {
      setStep(1);
    }
  }, [amount, step]);

  // Dynamic rates logic: debit is 0.5%, credit is 1.5% for 1x, 1.8% for 2-4x, 2.2% for 5-12x
  const feeRate = cardType === "debit" ? 0.005 : installments === 1 ? 0.015 : installments <= 4 ? 0.018 : 0.022;
  const rawValue = parseFloat(amount.replace(",", ".")) || 0;
  const feeValue = rawValue * feeRate;
  const netValue = rawValue - feeValue;

  const displayAmount = `R$ ${rawValue.toFixed(2).replace(".", ",")}`;
  const displayFee = `- R$ ${feeValue.toFixed(2).replace(".", ",")}`;
  const displayNet = `R$ ${netValue.toFixed(2).replace(".", ",")}`;

  if (success) {
    return (
      <BottomSheetFrame title="Pagamento Aprovado" onClose={onClose}>
        <View style={cardStyles.successContainer}>
          <View style={[cardStyles.successCircle, { backgroundColor: `${t.green}15` }]}>
            <Feather name="check" size={48} color={t.green} />
          </View>
          <Text style={[cardStyles.successTitle, { color: t.ink }]}>Transação Autorizada</Text>
          <Text style={[cardStyles.successAmount, { color: t.ink }]}>{displayAmount}</Text>

          <View style={[styles.calcBlock, { backgroundColor: t.bg2, borderColor: t.cardBorder, marginBottom: 24 }]}>
            <DetailRow label="Método" value={cardType === "credit" ? `Crédito em ${installments}x` : "Débito à Vista"} />
            <DetailRow label="Status" value="Aprovado" />
            <DetailRow label="Taxa Aplicada" value={`${(feeRate * 100).toFixed(1)}%`} />
            <DetailRow label="Vendedor" value={`@${USER_ID}`} />
            {selectedProduct && <DetailRow label="Produto" value={selectedProduct.name} />}
            <DetailRow label="Valor Líquido" value={displayNet} />
            <DetailRow label="Data" value={new Date().toLocaleDateString("pt-BR")} />
          </View>

          <PaymentPrimaryButton
            label="Concluído"
            onPress={onClose}
            style={{ width: "100%", marginTop: 8 }}
          />
        </View>
      </BottomSheetFrame>
    );
  }

  if (charging) {
    return (
      <BottomSheetFrame title="Aproxime o Cartão" onBack={() => setCharging(false)} onClose={onClose}>
        <View style={cardStyles.posContainer}>
          <Text style={[cardStyles.posAmount, { color: t.ink }]}>{displayAmount}</Text>
          
          <View style={[cardStyles.terminalIconWrap, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
            <Feather name="rss" size={40} color={t.orange} />
          </View>

          <Text style={[cardStyles.posInstructions, { color: t.ink }]}>
            Aproxime o cartão de crédito ou débito do cliente na parte traseira do aparelho.
          </Text>

          <View style={cardStyles.cardWrapper}>
            <View style={[cardStyles.creditCardMock, { backgroundColor: t.ink }]}>
              <View style={cardStyles.cardHeader}>
                <Feather name="credit-card" size={20} color={t.bg} />
                <Text style={[cardStyles.cardBrand, { color: t.bg }]}>Kori Pay</Text>
              </View>
              <Text style={[cardStyles.cardNumber, { color: t.bg }]}>•••• •••• •••• 8820</Text>
            </View>
          </View>

          <Text style={[cardStyles.loadingText, { color: t.inkMute }]}>
            Aguardando aprovação do banco...
          </Text>
        </View>
      </BottomSheetFrame>
    );
  }

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Selecionar Modalidade";
      default: return "Parcelas & Resumo";
    }
  };

  const renderFooter = () => {
    if (step === 1) {
      return (
        <PaymentPrimaryButton
          label="Continuar"
          onPress={() => {
            if (!amount) {
              onOpenAmountEntry();
            } else {
              setStep(3);
            }
          }}
        />
      );
    }
    if (step === 3) {
      return (
        <PaymentPrimaryButton
          label="Cobrar"
          onPress={() => setCharging(true)}
          disabled={!amount}
          icon={<Feather name="credit-card" size={16} color={t.btnPrimaryFg} />}
        />
      );
    }
    return undefined;
  };

  return (
    <BottomSheetFrame
      title={getStepTitle()}
      onBack={step === 3 ? () => setStep(1) : onBack}
      onClose={onClose}
      footer={renderFooter()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.stepContent}>
        {step === 1 && (
          <View style={{ gap: 6 }}>
            <SectionTitle>Selecione a Modalidade</SectionTitle>
            <CardTypeCards
              selected={cardType}
              onSelect={(type) => {
                setCardType(type);
                if (type === "debit") setInstallments(1);
              }}
            />
            <Text style={{ fontFamily: fonts.sans.medium, fontSize: 12, color: t.inkMute, marginTop: 8, lineHeight: 18, marginBottom: 12 }}>
              Escolha entre Débito para recebimento imediato com a menor taxa ou Crédito para opções de parcelamento.
            </Text>
          </View>
        )}

        {step === 3 && (
          <View style={{ gap: 6 }}>
            {cardType === "credit" ? (
              <>
                <SectionTitle>Opções de Parcelamento</SectionTitle>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 6 }}>
                  {[1, 2, 3, 4, 5, 6, 10, 12].map((idx) => {
                    const active = installments === idx;
                    return (
                      <TouchableOpacity
                        key={idx}
                        activeOpacity={0.8}
                        onPress={() => setInstallments(idx)}
                        style={[
                          styles.installmentChip,
                          {
                            backgroundColor: active ? t.orange : t.bg2,
                            borderColor: active ? t.orange : t.cardBorder,
                          },
                        ]}
                      >
                        <Text style={[styles.installmentChipText, { color: active ? "#FFF" : t.ink }]}>
                          {idx}x
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </>
            ) : (
              <>
                <SectionTitle>Método de Pagamento</SectionTitle>
                <View style={[styles.amountDisplayCard, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.amountDisplayCardLabel, { color: t.inkMute }]}>Modalidade</Text>
                    <Text style={[styles.amountDisplayCardVal, { color: t.ink }]}>Débito à Vista</Text>
                  </View>
                  <Feather name="arrow-down-left" size={20} color={t.orange} />
                </View>
              </>
            )}

            {/* Calculations and Summary */}
            <View style={{ marginTop: 12 }}>
              <SectionTitle>Resumo Financeiro</SectionTitle>
            </View>
            <View style={[styles.calcBlock, { backgroundColor: t.bg2, borderColor: t.cardBorder, marginVertical: 0 }]}>
              <View style={styles.calcRow}>
                <Text style={[styles.calcLabel, { color: t.ink }]}>Cliente Paga</Text>
                <Text style={[styles.calcValue, { color: t.ink, fontFamily: fonts.sans.bold }]}>{displayAmount}</Text>
              </View>
              <View style={styles.calcRow}>
                <Text style={[styles.calcLabel, { color: t.inkMute }]}>Taxa Kori ({(feeRate * 100).toFixed(1)}%)</Text>
                <Text style={[styles.calcValue, { color: "#ef4444" }]}>{displayFee}</Text>
              </View>
              <View style={[styles.calcRow, { borderTopWidth: 1, borderTopColor: t.line, paddingTop: 10, marginTop: 4 }]}>
                <Text style={[styles.calcLabel, { color: t.ink, fontFamily: fonts.sans.bold }]}>Vendedor Recebe</Text>
                <Text style={[styles.calcValue, { color: t.orange, fontSize: 16, fontFamily: fonts.sans.bold }]}>{displayNet}</Text>
              </View>
            </View>

            {/* Dynamic rates note */}
            <View style={[styles.infoBanner, { backgroundColor: `${t.orange}10`, borderColor: `${t.orange}20`, marginTop: 14, marginBottom: 12 }]}>
              <Feather name="info" size={16} color={t.orange} style={{ marginRight: 8 }} />
              <Text style={[styles.infoBannerText, { color: t.inkDim }]}>
                As taxas de recebimento variam de 1% a 2.5% e são dinâmicas, baseadas no índice de adimplência geral da Kori.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </BottomSheetFrame>
  );
};

/* ── PIX Receive Screen ─────────────────────────────── */
const PIX_MOCK_KEY = "opedrooz@kori.com.br";
const PIX_EXPIRY_SECONDS = 15 * 60; // 15 minutes

const formatCountdown = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const PixReceiveScreen: React.FC<{
  onBack: () => void;
  onClose: () => void;
  amount: string;
  setAmount: (a: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  mode: "free" | "fixed";
  setMode: (m: "free" | "fixed") => void;
  onOpenAmountEntry: () => void;
  accountType?: "PF" | "PJ";
}> = ({
  onBack,
  onClose,
  amount,
  setAmount,
  selectedProduct,
  setSelectedProduct,
  mode,
  setMode,
  onOpenAmountEntry,
  accountType,
}) => {
  const { t } = useTheme();
  const toast = useToast();
  const [generated, setGenerated] = useState(false);
  const [remaining, setRemaining] = useState(PIX_EXPIRY_SECONDS);
  const [expired, setExpired] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (generated && !expired) {
      timerRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [generated, expired]);

  const buildPixPayload = () => {
    const val = mode === "fixed" && amount ? amount.replace(",", ".") : "";
    // Mock EMV Pix payload
    return `00020126580014br.gov.bcb.pix0114${PIX_MOCK_KEY}0206Kori${val ? `54${val.length.toString().padStart(2, "0")}${val}` : ""}5303986540${val || "0.00"}5802BR5913KORA PAGAMENTOS6009SAO PAULO62070503***6304ABCD`;
  };

  const buildCopyPaste = () => {
    return buildPixPayload();
  };

  const canGenerate = mode === "free" || !!amount;
  const displayAmount = amount ? `R$ ${parseFloat(amount.replace(",", ".")).toFixed(2).replace(".", ",")}` : "R$ 0,00";

  const handleRegenerate = () => {
    setGenerated(false);
    setExpired(false);
    setRemaining(PIX_EXPIRY_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => setGenerated(true), 100);
  };

  const progressRatio = remaining / PIX_EXPIRY_SECONDS;
  const isUrgent = remaining <= 120; // last 2 minutes

  return (
    <BottomSheetFrame
      title="Pix"
      onBack={onBack}
      onClose={onClose}
      footer={generated ? undefined : (
        <PaymentPrimaryButton
          label="Continuar"
          onPress={() => setGenerated(true)}
          disabled={!canGenerate}
        />
      )}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.stepContent}>
        {!generated && (
          <>
            <SectionTitle>Valor da Cobrança</SectionTitle>
            <ChoiceCards
              selected={mode}
              onSelect={(m) => {
                setMode(m);
                setGenerated(false);
                if (m === "fixed") {
                  onOpenAmountEntry();
                } else {
                  setAmount("");
                  setSelectedProduct(null);
                }
              }}
            />

            {mode === "fixed" && !!amount && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onOpenAmountEntry}
                style={[styles.amountDisplayCard, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.amountDisplayCardLabel, { color: t.inkMute }]}>
                    {selectedProduct ? `Produto: ${selectedProduct.name}` : "Valor Definido"}
                  </Text>
                  <Text style={[styles.amountDisplayCardVal, { color: t.ink }]}>{displayAmount}</Text>
                </View>
                <Feather name="edit" size={16} color={t.orange} />
              </TouchableOpacity>
            )}


          </>
        )}

        {generated && (
          <View style={{ alignItems: "center" }}>
            {/* Timer */}
            <View style={[pixStyles.timerContainer, { backgroundColor: expired ? "#ef444415" : t.bgElev }]}>
              <View style={pixStyles.timerHeaderRow}>
                <Feather name={expired ? "alert-circle" : "clock"} size={14} color={expired ? "#ef4444" : t.ink} />
                <Text style={[pixStyles.timerText, { color: expired ? "#ef4444" : t.ink }]}>
                  {expired ? "Código expirado" : `Expira em ${formatCountdown(remaining)}`}
                </Text>
              </View>
              {!expired && (
                <View style={[pixStyles.progressTrack, { backgroundColor: t.line }]}>
                  <View style={[
                    pixStyles.progressFill,
                    {
                      backgroundColor: isUrgent ? "#ef4444" : t.ink,
                      width: `${progressRatio * 100}%`,
                    },
                  ]} />
                </View>
              )}
            </View>

            {/* Amount display */}
            {mode === "fixed" && amount ? (
              <Text style={[pixStyles.pixAmount, { color: t.ink }]}>{displayAmount}</Text>
            ) : (
              <Text style={[pixStyles.pixFreeLabel, { color: t.inkMute }]}>Valor livre</Text>
            )}

            {/* QR Code */}
            <View style={[
              pixStyles.qrContainer,
              { backgroundColor: "#FFFFFF" },
              expired && { opacity: 0.4 },
            ]}>
              <QRCode value={buildPixPayload()} size={220} color="#000000" backgroundColor="#FFFFFF" />
              <View style={[pixStyles.pixLogoBadge, { backgroundColor: "#32bcad", borderColor: "#FFFFFF", borderWidth: 4 }]}>
                <PixIcon size={20} color="#FFFFFF" />
              </View>
            </View>

            {/* Copia e cola */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={async () => {
                await Clipboard.setStringAsync(buildCopyPaste());
                toast.show("Código Pix copiado");
              }}
              style={[pixStyles.copyPasteTouchable, { backgroundColor: t.bgElev, borderColor: t.line }]}
            >
              <View style={{ flex: 1, overflow: "hidden" }}>
                <Text style={[pixStyles.copyPasteLabelCustom, { color: t.inkMute }]}>Pix Copia e Cola</Text>
                <Text style={[pixStyles.copyPasteTextCustom, { color: t.ink }]} numberOfLines={1}>
                  {buildCopyPaste()}
                </Text>
              </View>
              <View style={[pixStyles.copyIconBox, { backgroundColor: t.bg2 }]}>
                <Feather name="copy" size={16} color={t.ink} />
              </View>
            </TouchableOpacity>

            {/* Actions */}
            {expired ? (
              <PaymentPrimaryButton
                label="Gerar novo QR Code"
                onPress={handleRegenerate}
                icon={<Feather name="refresh-cw" size={16} color={t.btnPrimaryFg} />}
                style={{ marginTop: 16, width: "100%" }}
              />
            ) : (
              <View style={{ marginTop: 16, width: "100%" }}>
                <PaymentPrimaryButton
                  label="Compartilhar código"
                  onPress={async () => {
                    const payload = buildCopyPaste();
                    await Share.share({ message: `Pague via Pix: ${payload}` });
                  }}
                  full
                  icon={<Feather name="share-2" size={16} color={t.btnPrimaryFg} />}
                />
              </View>
            )}


          </View>
        )}
      </ScrollView>
      <PaymentToast message={toast.message} opacity={toast.opacity} />
    </BottomSheetFrame>
  );
};

/* ── Menu item ───────────────────────────────────────── */
interface MenuItemProps {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  desc: string;
  anonBadge?: boolean;
  disabled?: boolean;
  onPress: () => void;
  isLast?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, desc, anonBadge, disabled, onPress, isLast }) => {
  const { t } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={disabled ? undefined : onPress}
      style={[
        menuStyles.row,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.line },
        disabled && { opacity: 0.4 },
      ]}
    >
      <View style={[menuStyles.iconWrap, { backgroundColor: t.bgElev }]}>
        <Feather name={icon} size={18} color={t.inkDim} />
      </View>
      <View style={menuStyles.textWrap}>
        <View style={menuStyles.titleRow}>
          <Text style={[menuStyles.title, { color: t.ink }]}>{title}</Text>
          {disabled ? (
            <View style={[menuStyles.anonBadge, { backgroundColor: t.bgElev }]}>
              <Feather name="lock" size={9} color={t.inkMute} style={{ marginRight: 3 }} />
              <Text style={[menuStyles.anonBadgeText, { color: t.inkMute }]}>PF apenas</Text>
            </View>
          ) : anonBadge ? (
            <View style={[menuStyles.anonBadge, { backgroundColor: t.bgElev }]}>
              <Feather name="eye-off" size={9} color={t.inkMute} style={{ marginRight: 3 }} />
              <Text style={[menuStyles.anonBadgeText, { color: t.inkMute }]}>anônimo</Text>
            </View>
          ) : null}
        </View>
        <Text style={[menuStyles.desc, { color: t.inkMute }]}>{desc}</Text>
      </View>
      <Feather name={disabled ? "lock" : "chevron-right"} size={16} color={t.inkFaint} />
    </TouchableOpacity>
  );
};

/* ── PIX Menu Item (custom styled) ── */
const PixMenuItem: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const { t } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        menuStyles.row,
        { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.line },
      ]}
    >
      <View style={[menuStyles.iconWrap, { backgroundColor: t.bgElev, borderWidth: 1, borderColor: t.line }]}>
        <PixIcon size={18} color={t.ink} />
      </View>
      <View style={menuStyles.textWrap}>
        <View style={menuStyles.titleRow}>
          <Text style={[menuStyles.title, { color: t.ink }]}>Pix</Text>
        </View>
        <Text style={[menuStyles.desc, { color: t.inkMute }]}>QR Code Pix ou Copia e cola</Text>
      </View>
      <Feather name="chevron-right" size={16} color={t.inkFaint} />
    </TouchableOpacity>
  );
};

/* ── Menu Screen ─────────────────────────────────────── */
const MenuScreen: React.FC<{ onSelect: (s: Screen) => void; onClose: () => void; accountType?: "PF" | "PJ" }> = ({
  onSelect,
  onClose,
  accountType,
}) => {
  const { t } = useTheme();
  return (
    <View style={menuStyles.container}>
      {/* Header */}
      <View style={[menuStyles.header, { borderBottomColor: t.line }]}>
        <View style={menuStyles.headerLeft} />
        <Text style={[menuStyles.headerTitle, { color: t.ink }]}>Receber</Text>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={menuStyles.closeBtn}>
          <Feather name="x" size={18} color={t.inkDim} />
        </TouchableOpacity>
      </View>

      {/* Cards */}
      <View style={[menuStyles.cardBlock, { backgroundColor: t.bg2, borderColor: t.line }]}>
        <MenuItem
          icon="at-sign"
          title="Compartilhar ID"
          desc="Receba pelo seu @usuário Kori"
          onPress={() => onSelect("share_id")}
        />
        <MenuItem
          icon="shield"
          title="Wallet address"
          desc="Receba direto na carteira on-chain"
          anonBadge
          disabled={accountType === "PJ"}
          onPress={() => onSelect("share_wallet")}
        />
        <MenuItem
          icon="link"
          title="Link de pagamento"
          desc="Gere um link com valor livre ou fixo"
          onPress={() => onSelect("payment_link")}
        />
        <MenuItem
          icon="grid"
          title="QR Code"
          desc="Mostre o código para quem vai pagar"
          onPress={() => onSelect("qrcode")}
        />
        <PixMenuItem onPress={() => onSelect("pix")} />
        {accountType === "PJ" && (
          <MenuItem
            icon="credit-card"
            title="Receber em Cartão"
            desc="Cobre via cartão usando o celular (Tap to Pay)"
            isLast
            onPress={() => onSelect("card")}
          />
        )}
      </View>
    </View>
  );
};

/* ── Root drawer ─────────────────────────────────────── */
export const ReceiveDrawer: React.FC<ReceiveDrawerProps> = ({ visible, onClose, accountType }) => {
  const { t } = useTheme();
  const [screen, setScreen] = useState<Screen>("menu");
  const [originScreen, setOriginScreen] = useState<"payment_link" | "qrcode" | "card" | "pix" | null>(null);

  // Shared billing states
  const [amount, setAmount] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mode, setMode] = useState<"free" | "fixed">("free");

  const stepProgress = useRef(new Animated.Value(1)).current;
  const stepDirection = useRef(1);

  useEffect(() => {
    stepProgress.setValue(0);
    Animated.timing(stepProgress, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [screen, stepProgress]);

  const navigate = (next: Screen, direction = 1) => {
    stepProgress.stopAnimation();
    stepProgress.setValue(0);
    stepDirection.current = direction;
    setScreen(next);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setScreen("menu");
      setAmount("");
      setSelectedProduct(null);
      setMode("free");
    }, 300);
  };

  const openAmountEntry = (origin: "payment_link" | "qrcode" | "card") => {
    setOriginScreen(origin);
    navigate("amount_entry", 1);
  };

  const handleConfirmAmount = (val: string, prod: Product | null) => {
    setAmount(val);
    setSelectedProduct(prod);
    if (originScreen) {
      navigate(originScreen, -1);
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case "share_id":
        return <ShareIdScreen onBack={() => navigate("menu", -1)} onClose={handleClose} />;
      case "share_wallet":
        return <ShareWalletScreen onBack={() => navigate("menu", -1)} onClose={handleClose} />;
      case "payment_link":
        return (
          <PaymentLinkScreen
            onBack={() => navigate("menu", -1)}
            onClose={handleClose}
            amount={amount}
            setAmount={setAmount}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            mode={mode}
            setMode={setMode}
            onOpenAmountEntry={() => openAmountEntry("payment_link")}
            accountType={accountType}
          />
        );
      case "qrcode":
        return (
          <QRCodeScreen
            onBack={() => navigate("menu", -1)}
            onClose={handleClose}
            amount={amount}
            setAmount={setAmount}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            mode={mode}
            setMode={setMode}
            onOpenAmountEntry={() => openAmountEntry("qrcode")}
            accountType={accountType}
          />
        );
      case "card":
        return (
          <CardScreen
            onBack={() => navigate("menu", -1)}
            onClose={handleClose}
            amount={amount}
            setAmount={setAmount}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            mode={mode}
            setMode={setMode}
            onOpenAmountEntry={() => openAmountEntry("card")}
          />
        );
      case "pix":
        return (
          <PixReceiveScreen
            onBack={() => navigate("menu", -1)}
            onClose={handleClose}
            amount={amount}
            setAmount={setAmount}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            mode={mode}
            setMode={setMode}
            onOpenAmountEntry={() => openAmountEntry("pix")}
            accountType={accountType}
          />
        );
      case "amount_entry":
        return (
          <AmountEntryScreen
            onConfirm={handleConfirmAmount}
            onBack={() => {
              if (originScreen) navigate(originScreen, -1);
            }}
            initialAmount={amount}
            initialProduct={selectedProduct}
            accountType={accountType}
          />
        );
      default:
        return <MenuScreen onSelect={(n) => navigate(n, 1)} onClose={handleClose} accountType={accountType} />;
    }
  };

  const translateX = stepProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [stepDirection.current * 22, 0],
  });

  const isMenu = screen === "menu";

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose} statusBarTranslucent>
      <SafeAreaProvider>
        <View style={drawerStyles.overlay}>
          <TouchableOpacity style={drawerStyles.backdrop} activeOpacity={1} onPress={handleClose} />
          <View
            style={[
              drawerStyles.drawer,
              drawerStyles.drawerAuto,
              { backgroundColor: t.bg, borderColor: t.line },
            ]}
          >
            {isMenu && <View style={[drawerStyles.handle, { backgroundColor: t.inkFaint }]} />}
            <Animated.View
              key={screen}
              style={[
                drawerStyles.shell,
                drawerStyles.shellFlex,
                { opacity: stepProgress, transform: [{ translateX }] },
              ]}
            >
              {renderScreen()}
            </Animated.View>
          </View>
        </View>
      </SafeAreaProvider>
    </Modal>
  );
};

/* ── Menu styles ─────────────────────────────────────── */
const menuStyles = StyleSheet.create({
  container: {
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: { width: 32 },
  headerTitle: {
    fontFamily: fonts.sans.bold,
    fontSize: 15,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBlock: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    gap: 13,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 2,
  },
  title: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    fontWeight: "700",
  },
  desc: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  anonBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  anonBadgeText: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    letterSpacing: 0.3,
  },
});

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/* ── Drawer base styles ──────────────────────────────── */
const drawerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  drawer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    zIndex: 2,
    overflow: "hidden",
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  drawerAuto: {
    /* Fits content dynamically */
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 2,
  },
  shell: {
    /* Dynamic height */
    flexShrink: 1,
  },
  shellFlex: {
    width: "100%",
    flexShrink: 1,
  },
});

/* ── Shared sub-screen styles ────────────────────────── */
const styles = StyleSheet.create({
  sectionCard: { marginBottom: 16 },
  actionCard:  { marginBottom: 10 },
  segmentControl: { marginBottom: 14 },
  amountCard: { marginBottom: 14 },
  generatedCard: { marginBottom: 20 },
  stepContent: { paddingBottom: 12 },
  generatedValue: {
    fontFamily: fonts.mono.medium,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  splitActions: { flexDirection: "row", gap: 10 },
  anonBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.card,
    borderWidth: 1,
    marginBottom: 16,
  },
  anonText: {
    flex: 1,
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    lineHeight: 17,
  },
  productChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 125,
  },
  productChipInner: {
    gap: 4,
  },
  productChipName: {
    fontFamily: fonts.sans.semibold,
    fontSize: 12,
  },
  productChipPrice: {
    fontFamily: fonts.sans.bold,
    fontSize: 13,
  },
  presetsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  presetChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 1,
  },
  presetText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 12,
  },

  // Dynamic Amount Display
  amountDisplayCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  amountDisplayCardLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    marginBottom: 4,
  },
  amountDisplayCardVal: {
    fontFamily: fonts.sans.bold,
    fontSize: 22,
    fontWeight: "900",
  },
  installmentChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 50,
    alignItems: "center",
  },
  installmentChipText: {
    fontFamily: fonts.sans.bold,
    fontSize: 12,
  },
  calcBlock: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginVertical: 16,
    gap: 8,
  },
  calcRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  calcLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
  },
  calcValue: {
    fontFamily: fonts.mono.medium,
    fontSize: 13,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 10,
  },
  infoBannerText: {
    flex: 1,
    fontFamily: fonts.sans.medium,
    fontSize: 11,
    lineHeight: 16,
  },

  // Amount Entry Styles
  linkedProductBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    marginBottom: 12,
  },
  linkedProductText: {
    fontFamily: fonts.sans.bold,
    fontSize: 11,
  },
  amountDisplayLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    marginBottom: 6,
  },
  amountDisplayVal: {
    fontFamily: fonts.sans.bold,
    fontSize: 44,
    fontWeight: "900",
    marginBottom: 16,
    letterSpacing: -1.5,
  },
  productLinkBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  productLinkBtnText: {
    fontFamily: fonts.sans.bold,
    fontSize: 12,
  },
  keypad: {
    width: "100%",
    gap: 8,
  },
  keyRow: {
    flexDirection: "row",
    gap: 8,
  },
  key: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  keyInner: {
    alignItems: "center",
  },
  keyDigit: {
    fontFamily: fonts.sans.semibold,
    fontSize: 20,
  },
  keySub: {
    fontFamily: fonts.sans.medium,
    fontSize: 7,
    letterSpacing: 0.5,
  },

  // Product List Row inside Amount Entry
  productItemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  productImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  productItemName: {
    fontFamily: fonts.sans.bold,
    fontSize: 13,
    marginBottom: 2,
  },
  productItemCategory: {
    fontFamily: fonts.sans.medium,
    fontSize: 11,
  },
  productItemPrice: {
    fontFamily: fonts.sans.bold,
    fontSize: 14,
  },
  amountPlaceholderCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E4E4E8",
    marginBottom: 16,
  },
  amountPlaceholderText: {
    fontFamily: fonts.sans.bold,
    fontSize: 14,
    marginBottom: 4,
  },
  amountPlaceholderDesc: {
    fontFamily: fonts.sans.medium,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 15,
  },
});

/* ── POS Styles ── */
const cardStyles = StyleSheet.create({
  successContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 12,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontFamily: fonts.sans.bold,
    fontSize: 18,
    marginBottom: 6,
  },
  successAmount: {
    fontFamily: fonts.sans.bold,
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 24,
  },
  receiptCard: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  posContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 16,
  },
  posAmount: {
    fontFamily: fonts.sans.bold,
    fontSize: 38,
    fontWeight: "900",
    marginBottom: 24,
  },
  terminalIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  posInstructions: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  cardWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  creditCardMock: {
    width: 220,
    height: 130,
    borderRadius: 14,
    padding: 16,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardBrand: {
    fontFamily: fonts.sans.bold,
    fontSize: 12,
  },
  cardNumber: {
    fontFamily: fonts.mono.medium,
    fontSize: 14,
    letterSpacing: 2,
  },
  loadingText: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
  },
});

/* ── Choice Cards Styles ── */
const choiceStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 14,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
    gap: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: fonts.sans.bold,
    fontSize: 14,
    textAlign: "center",
  },
  desc: {
    fontFamily: fonts.sans.medium,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 15,
  },
});

/* ── PIX Receive Styles ── */
const pixStyles = StyleSheet.create({
  timerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 20,
    width: "100%",
    gap: 10,
  },
  timerHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  timerText: {
    fontFamily: fonts.mono.semibold,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  progressTrack: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  pixAmount: {
    fontFamily: fonts.sans.bold,
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 16,
  },
  pixFreeLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    marginBottom: 16,
  },
  qrContainer: {
    padding: 24,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  pixLogoBadge: {
    position: "absolute",
    bottom: -20,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  copyPasteTouchable: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  copyPasteLabelCustom: {
    fontFamily: fonts.mono.medium,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  copyPasteTextCustom: {
    fontFamily: fonts.mono.medium,
    fontSize: 13,
  },
  copyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

});
