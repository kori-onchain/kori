import { apiClient, ApiClientError } from "./apiClient";

export type KoraCurrency = "BRL" | "USD" | "EUR" | "USDC" | "SOL";

export type ApiError = {
  message: string;
  status?: number;
  path?: string;
  retryable: boolean;
};

export type KoraCard = {
  id: string;
  name: string;
  network: string;
  currency: KoraCurrency;
  last4: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  isFrozen: boolean;
  isOnlineEnabled: boolean;
  limitTotalCents: number;
  limitUsedCents?: number;
  openPrincipalCents?: number;
  availableLimitCents?: number;
};

export type KoraInvoice = {
  id: string;
  cardId?: string | null;
  card?: KoraCard | null;
  status: string;
  currency: KoraCurrency;
  totalCents: number;
  paidCents: number;
  pendingCents?: number;
  dueDate: string;
  closeDate?: string;
  closingDate?: string;
  cycleMonth?: string;
  cycleStart?: string;
  cycleEnd?: string;
  items?: Array<{
    id: string;
    description: string;
    amountCents: number;
    createdAt?: string;
  }>;
};

export type KoraPayment = {
  id: string;
  status: string;
  amountCents?: number;
  currency?: KoraCurrency;
  recipientType?: string;
  recipientId?: string;
  txHash?: string | null;
  programStatus?: string | null;
  createdAt?: string;
};

export type KoraLedgerEntry = {
  id: string;
  accountId: string;
  direction: "DEBIT" | "CREDIT";
  amountCents: number;
  referenceType: string;
  referenceId: string;
  description?: string | null;
  createdAt?: string;
};

export type KoraLedgerAccount = {
  id: string;
  userId?: string | null;
  type: "USER_BALANCE" | "CARD_RECEIVABLE" | "MERCHANT_BALANCE" | "PLATFORM";
  currency: KoraCurrency;
  balanceCents: number;
  entries?: KoraLedgerEntry[];
};

export type KoraStore = {
  id: string;
  name: string;
  username?: string;
  category?: string;
};

export type KoraAccount = {
  id: string;
  name?: string;
  username?: string;
  accountType: "PF" | "PJ";
  walletIndex: number;
  walletAddress?: string;
  businessName?: string;
  store?: KoraStore | null;
};

export type KoraProduct = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  priceCents: number;
  imageUrl?: string | null;
  isNft?: boolean;
  nftLabel?: string | null;
};

export type KoraSale = {
  id: string;
  buyerName: string;
  amountCents: number;
  currency?: KoraCurrency;
  status: string;
  createdAt: string;
  txHash?: string | null;
  items?: Array<{ id: string; qty: number; priceCents: number; product?: KoraProduct }>;
};

export type KoraReceivable = {
  id: string;
  saleId?: string;
  status: string;
  currency: KoraCurrency;
  grossAmountCents: number;
  netAmountCents: number;
  installmentsCount?: number;
  installmentNumber?: number;
  installmentId?: string | null;
  dueDate: string;
  txHash?: string | null;
  programStatus?: string | null;
  sale?: KoraSale;
};

export type KoraReceivableAdvance = {
  id: string;
  receivableId: string;
  status: string;
  provider?: "KORI" | "POOL" | "P2P";
  grossAmountCents: number;
  netAmountCents: number;
  feeCents: number;
  txHash?: string | null;
  programStatus?: string | null;
};

export type KoraMockCardPayment = {
  status: "APPROVED";
  card: {
    id: string;
    last4: string;
    network: string;
  };
  sale: KoraSale;
  transaction: {
    id: string;
    amountCents: number;
    installmentsCount: number;
    merchantName: string;
  };
  installments: Array<{
    id: string;
    number: number;
    total: number;
    principalCents: number;
    dueDate: string;
  }>;
  receivables: KoraReceivable[];
  credit: {
    limitTotalCents: number;
    lockedLimitCents: number;
    limitAvailableCents: number;
  };
};

export type KoraInvestmentPool = {
  currency: KoraCurrency;
  initialLiquidityCents: number;
  deployedCents: number;
  availableLiquidityCents: number;
  accountingBalanceCents: number;
  userInvestedCents?: number;
  userYieldCents?: number;
  totalYieldCents?: number;
  outstandingPrincipalCents?: number;
  expectedYieldLabel: string;
  updatedAt: string;
  recentEntries: KoraLedgerEntry[];
};

export type KoraInvestmentOrder = {
  id: string;
  status: string;
  amountCents: number;
  currency: KoraCurrency;
  userInvestedCents: number;
  pool: KoraInvestmentPool;
};

export type OnchainIntentKind =
  | "credit-profile"
  | "credit-limit"
  | "card-purchase"
  | "invoice-payment"
  | "merchant-register"
  | "receivable-mint"
  | "receivable-advance";

export type OnchainIntentResponse = {
  intentId: string;
  transaction: string;
  cluster: "localnet" | "devnet";
  feePayer: string;
  instruction: string;
  referenceType: string;
  referenceId: string;
  status: "PENDING_SIGNATURE" | "SUBMITTED" | "CONFIRMED" | "FAILED" | "EXPIRED";
};

export type OnchainSubmitResponse = {
  id: string;
  status: "PENDING_SIGNATURE" | "SUBMITTED" | "CONFIRMED" | "FAILED" | "EXPIRED";
  txHash?: string | null;
  programStatus?: string | null;
  referenceType?: string;
  referenceId?: string;
  error?: string | null;
};

export type OnchainStatus = {
  cluster: "localnet" | "devnet";
  rpcUrl: string;
  payer: string;
  payerSol: number;
  programs: Record<string, string>;
  pdas: Record<string, boolean>;
  env?: {
    required?: Array<{ name: string; configured: boolean }>;
    optionalForDemoFallbacks?: Array<{ name: string; configured: boolean }>;
  };
};

const parseErrorBody = (body?: string) => {
  if (!body) return null;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
};

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiClientError) {
    const parsed = parseErrorBody(error.body);
    const backendMessage =
      typeof parsed?.message === "string"
        ? parsed.message
        : Array.isArray(parsed?.message)
          ? parsed.message.join("\n")
          : undefined;
    const message =
      backendMessage ||
      (error.status === 401
        ? "Sua sessao expirou. Entre novamente."
        : error.status === 403
          ? "Voce nao tem acesso a esse recurso."
          : error.status === 404
            ? "Recurso nao encontrado."
            : error.status && error.status >= 500
              ? "O servidor encontrou um erro. Tente novamente em instantes."
              : error.message.includes("Network request failed")
                ? "Nao foi possivel conectar ao servidor."
                : "Nao foi possivel concluir a operacao.");

    return {
      message,
      status: error.status,
      path: error.path,
      retryable: !error.status || error.status >= 500,
    };
  }

  return {
    message: error instanceof Error ? error.message : "Erro inesperado.",
    retryable: true,
  };
}

const centsFromMoney = (value: string | number) => {
  if (typeof value === "number") return Math.round(value * 100);
  const normalized = value.replace(/\./g, "").replace(",", ".").trim();
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
};

export const formatCents = (cents?: number, currency: KoraCurrency = "BRL") =>
  ((cents ?? 0) / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: currency === "USDC" ? "USD" : currency,
  });

export const koraApi = {
  auth: {
    accounts: () => apiClient.get<KoraAccount[]>("/auth/accounts"),
  },
  cards: {
    list: () => apiClient.get<KoraCard[]>("/cards"),
    create: (body: Partial<KoraCard>) => apiClient.post<KoraCard>("/cards", body),
    get: (id: string) => apiClient.get<KoraCard>(`/cards/${id}`),
    details: (id: string) => apiClient.get<KoraCard>(`/cards/${id}/details`),
    freeze: (id: string, isFrozen: boolean) =>
      apiClient.patch<KoraCard>(`/cards/${id}/freeze`, { isFrozen }),
    online: (id: string, isOnlineEnabled: boolean) =>
      apiClient.patch<KoraCard>(`/cards/${id}/online`, { isOnlineEnabled }),
    limit: (id: string, limitTotalCents: number) =>
      apiClient.patch<KoraCard>(`/cards/${id}/limit`, { limitTotalCents }),
    regenerate: (id: string) => apiClient.post<KoraCard>(`/cards/${id}/regenerate`),
    remove: (id: string) => apiClient.delete<void>(`/cards/${id}`),
  },
  invoices: {
    list: () => apiClient.get<KoraInvoice[]>("/invoices"),
    current: () => apiClient.get<KoraInvoice | KoraInvoice[] | null>("/invoices/current"),
    get: (id: string) => apiClient.get<KoraInvoice>(`/invoices/${id}`),
    pay: (id: string) => apiClient.post<KoraPayment>(`/invoices/${id}/pay`),
  },
  payments: {
    transfer: (body: {
      amountCents: number;
      currency: KoraCurrency;
      recipientType: "username" | "wallet" | "pix";
      recipientId: string;
      txHash?: string;
      programStatus?: string;
    }) => apiClient.post<KoraPayment>("/payments/transfer", body),
    solanaIntent: (body: {
      recipientType: "username" | "wallet";
      recipient: string;
      amountCents?: number;
      lamports?: number;
      anonymous?: boolean;
    }) =>
      apiClient.post<
        {
          paymentId: string;
          transaction: string;
          feePayer: string;
          fromWallet: string;
          toWallet: string;
          recipient?: unknown;
        }
      >("/payments/solana/intent", body),
    solanaSubmit: (body: { paymentId: string; signedTransaction: string }) =>
      apiClient.post<KoraPayment>("/payments/solana/submit", body),
    get: (id: string) => apiClient.get<KoraPayment>(`/payments/${id}`),
  },
  ledger: {
    entries: () => apiClient.get<KoraLedgerAccount[]>("/ledger/entries"),
  },
  merchant: {
    products: () => apiClient.get<KoraProduct[]>("/merchant/products"),
    createProduct: (body: {
      name: string;
      description?: string;
      category?: string;
      priceCents: number;
      imageUrl?: string;
      isNft?: boolean;
      nftLabel?: string;
    }) => apiClient.post<KoraProduct>("/merchant/products", body),
    updateProduct: (id: string, body: Partial<KoraProduct>) =>
      apiClient.patch<KoraProduct>(`/merchant/products/${id}`, body),
    deleteProduct: (id: string) => apiClient.delete<void>(`/merchant/products/${id}`),
    sales: () => apiClient.get<KoraSale[]>("/merchant/sales"),
    createSale: (body: unknown) => apiClient.post<KoraSale>("/merchant/sales", body),
    createMockCardPayment: (body: {
      amountCents: number;
      installmentsCount: number;
      cardType: "credit";
      productId?: string;
      productName?: string;
      buyerName?: string;
    }) => apiClient.post<KoraMockCardPayment>("/merchant/card-payments/mock", body),
  },
  receivables: {
    list: () => apiClient.get<KoraReceivable[]>("/receivables"),
    advance: (id: string, provider: "KORI" | "POOL" | "P2P" = "POOL") =>
      apiClient.post<KoraReceivableAdvance>(`/receivables/${id}/advance`, { provider }),
    getAdvance: (id: string) =>
      apiClient.get<KoraReceivableAdvance>(`/receivables/advances/${id}`),
  },
  credit: {
    profile: () => apiClient.get<any>("/credit/profile"),
    score: () => apiClient.get<any>("/credit/score"),
    setLimit: (limitTotalCents: number) =>
      apiClient.put("/credit/profile/limit", { limitTotalCents }),
  },
  investments: {
    pool: () => apiClient.get<KoraInvestmentPool>("/investments/pool"),
    invest: (amountCents: number) =>
      apiClient.post<KoraInvestmentOrder>("/investments/pool/invest", { amountCents }),
  },
  onchain: {
    programStatus: () => apiClient.get<OnchainStatus>("/onchain/programs/status"),
    createIntent: (kind: OnchainIntentKind, payload: Record<string, unknown>) =>
      apiClient.post<OnchainIntentResponse>(`/onchain/intents/${kind}`, payload),
    submit: (body: { intentId: string; signedTransaction: string }) =>
      apiClient.post<OnchainSubmitResponse>("/onchain/submit", body),
  },
  money: {
    centsFromMoney,
    formatCents,
  },
};
