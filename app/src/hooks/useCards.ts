import { useState, useCallback, useEffect } from "react";
import { Card, MOCK_CARDS } from "@/data/cards";
import { KoraCard, KoraInvoice, koraApi, normalizeApiError } from "@/lib/koraApi";
import { OnchainExecutionStatus } from "@/lib/onchainIntents";

const cardTheme = (currency?: string, index = 0) => {
  const themes = [
    { cardBg: "#111", accentColor: "#D4AF37" },
    { cardBg: "#0F2027", accentColor: "#00C9FF" },
    { cardBg: "#1A1A2E", accentColor: "#E94560" },
  ];
  if (currency === "USDC" || currency === "USD") return themes[1];
  if (currency === "EUR") return themes[2];
  return themes[index % themes.length];
};

const formatMoney = (cents?: number, currency = "BRL") =>
  ((cents ?? 0) / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: currency === "USDC" ? "USD" : currency,
  });

const adaptCard = (card: KoraCard, index: number): Card => {
  const theme = cardTheme(card.currency, index);
  const limitTotal = Math.round((card.limitTotalCents ?? 0) / 100);
  const limitUsed = Math.round(
    ((card.openPrincipalCents ?? card.limitUsedCents ?? 0) as number) / 100,
  );
  const cardNumber = card.cardNumber || `•••• •••• •••• ${card.last4 || "0000"}`;

  return {
    id: card.id,
    name: card.name,
    last4: card.last4 || cardNumber.replace(/\s/g, "").slice(-4),
    network: card.network?.toLowerCase() === "visa" ? "visa" : "mastercard",
    currency: card.currency,
    balance: formatMoney(card.availableLimitCents, card.currency),
    balanceBRL: formatMoney(card.availableLimitCents, "BRL"),
    cardBg: theme.cardBg,
    accentColor: theme.accentColor,
    cardNumber,
    expiry: card.expiry || "••/••",
    cvv: card.cvv || "•••",
    isFrozen: card.isFrozen,
    isOnlineEnabled: card.isOnlineEnabled,
    limitUsed,
    limitTotal,
  };
};

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>(MOCK_CARDS);
  const [currentInvoice, setCurrentInvoice] = useState<KoraInvoice | null>(null);
  const [currentInvoices, setCurrentInvoices] = useState<KoraInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onchainStatus, setOnchainStatus] =
    useState<OnchainExecutionStatus>("idle");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [apiCards, invoiceResponse] = await Promise.all([
        koraApi.cards.list(),
        koraApi.invoices.current().catch(() => null),
      ]);
      const invoices = Array.isArray(invoiceResponse)
        ? invoiceResponse
        : invoiceResponse
          ? [invoiceResponse]
          : [];
      const invoice =
        invoices.find((item) => (item.pendingCents ?? item.totalCents - item.paidCents) > 0) ||
        invoices[0] ||
        null;
      setCards(apiCards.length ? apiCards.map(adaptCard) : []);
      setCurrentInvoices(invoices);
      setCurrentInvoice(invoice);
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized.message);
      setCards((prev) => (prev.length ? prev : MOCK_CARDS));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggleFreeze = useCallback(async (id: string) => {
    const current = cards.find((c) => c.id === id);
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFrozen: !c.isFrozen } : c)),
    );
    try {
      if (current) await koraApi.cards.freeze(id, !current.isFrozen);
    } catch (err) {
      setError(normalizeApiError(err).message);
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFrozen: current?.isFrozen ?? c.isFrozen } : c)),
      );
    }
  }, [cards]);

  const toggleOnline = useCallback(async (id: string) => {
    const current = cards.find((c) => c.id === id);
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isOnlineEnabled: !c.isOnlineEnabled } : c,
      ),
    );
    try {
      if (current) await koraApi.cards.online(id, !current.isOnlineEnabled);
    } catch (err) {
      setError(normalizeApiError(err).message);
      setCards((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, isOnlineEnabled: current?.isOnlineEnabled ?? c.isOnlineEnabled } : c,
        ),
      );
    }
  }, [cards]);

  const updateLimit = useCallback(async (id: string, newLimit: number) => {
    const current = cards.find((c) => c.id === id);
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, limitTotal: newLimit } : c)),
    );
    try {
      await koraApi.cards.limit(id, Math.round(newLimit * 100));
    } catch (err) {
      setError(normalizeApiError(err).message);
      if (current) {
        setCards((prev) =>
          prev.map((c) => (c.id === id ? { ...c, limitTotal: current.limitTotal } : c)),
        );
      }
    }
  }, [cards]);

  const regenerateVirtual = useCallback(async (id: string) => {
    try {
      const updated = await koraApi.cards.regenerate(id);
      setCards((prev) =>
        prev.map((c, index) => (c.id === id ? adaptCard(updated, index) : c)),
      );
    } catch (err) {
      setError(normalizeApiError(err).message);
    }
  }, []);

  const payCurrentInvoice = useCallback(async (invoiceId?: string) => {
    const targetInvoiceId = invoiceId ?? currentInvoice?.id;
    if (!targetInvoiceId) return null;
    try {
      const payment = await koraApi.invoices.pay(targetInvoiceId);
      await refresh();
      return payment;
    } catch (err) {
      setOnchainStatus("falhou");
      setError(normalizeApiError(err).message);
      return null;
    }
  }, [currentInvoice?.id, refresh]);

  return {
    cards,
    currentInvoice,
    currentInvoices,
    cardsLoading: isLoading,
    cardsError: error,
    onchainStatus,
    refreshCards: refresh,
    toggleFreeze,
    toggleOnline,
    updateLimit,
    regenerateVirtual,
    payCurrentInvoice,
  };
};
