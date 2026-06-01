/**
 * mockDemoLedger — ledger mockado compartilhado para o fluxo de demo (vídeo).
 *
 * Quando `MOCK_DEMO` está ligado (ver constants/devConfig.ts), o koraApi delega
 * para este singleton em memória em vez de bater no back-end. Ele modela o loop
 * econômico do Kori entre as 3 personas que vivem no mesmo device:
 *
 *   - Pessoa (PF)  → saldo da conta + cartão de crédito + fatura.
 *   - Investidor   → aba Investimentos da PF (mesmo saldo da pessoa) + pool.
 *   - Loja (PJ)    → cobra a pessoa no cartão e antecipa recebíveis.
 *
 * Loop:
 *   1. Investidor aporta no pool        → saldo PF ↓, liquidez do pool ↑.
 *   2. Loja cobra a pessoa (cartão)     → parcelas na fatura + recebíveis pendentes.
 *   3. Loja antecipa os recebíveis      → saldo da loja ↑ (vindo do pool).
 *   4. Pessoa paga a fatura             → volta ao pool com ágio 2% → rendimento ↑.
 *
 * Todos os métodos devolvem exatamente os shapes esperados pelo koraApi/hooks,
 * então a UI dos painéis não precisa mudar.
 */
import type {
  KoraAccount,
  KoraCard,
  KoraInvestmentOrder,
  KoraInvestmentPool,
  KoraInvoice,
  KoraLedgerAccount,
  KoraLedgerEntry,
  KoraMockCardPayment,
  KoraPayment,
  KoraProduct,
  KoraReceivable,
  KoraReceivableAdvance,
  KoraSale,
} from "./koraApi";

// ─── Constantes de roteiro (ajuste à vontade para o vídeo) ───────────────────
const USER_BALANCE_START = 100000; // R$ 1.000,00 — saldo inicial da Ana Ribeiro
const MERCHANT_BALANCE_START = 0; // R$ 0,00 — saldo inicial da Loja Aurora
const POOL_TOTAL_START = 5000000; // R$ 50.000,00 — tamanho inicial do pool
const POOL_DEPLOYED_START = 2000000; // R$ 20.000,00 — já implantado em recebíveis
// Disponível = total - implantado (R$ 30.000,00)
const CARD_LIMIT_TOTAL = 800000; // R$ 8.000,00 — limite total do cartão

const ADVANCE_FEE_PCT = 0.03; // 3% — taxa de antecipação (provider POOL)
const AGIO_PCT = 0.02; // 2% — ágio que volta ao pool ao pagar a fatura
const EXPECTED_YIELD_LABEL = "~14,8% a.a.";

const MERCHANT_NAME = "Loja Aurora";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const genTxHash = (): string => {
  let out = "";
  for (let i = 0; i < 44; i++) {
    out += BASE58.charAt(Math.floor(Math.random() * BASE58.length));
  }
  return out;
};

const genId = (prefix: string): string =>
  `${prefix}_${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;

const isoInDays = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

// ─── Estado (singleton de módulo) ───────────────────────────────────────────
interface DemoState {
  userBalanceCents: number;
  merchantBalanceCents: number;
  card: KoraCard;
  invoice: KoraInvoice;
  receivables: KoraReceivable[];
  pool: KoraInvestmentPool;
  sales: KoraSale[];
  products: KoraProduct[];
}

let state: DemoState;

const seedProducts = (): KoraProduct[] => [
  { id: "prod_air", name: "Tênis Air Pro", category: "Calçados", priceCents: 120000 },
  { id: "prod_tee", name: "Camiseta Premium", category: "Moda", priceCents: 24000 },
  { id: "prod_skin", name: "Kit Skincare", category: "Beleza", priceCents: 89000 },
  { id: "prod_bag", name: "Mochila Urban", category: "Acessórios", priceCents: 31000 },
];

const seedPool = (): KoraInvestmentPool => ({
  currency: "BRL",
  initialLiquidityCents: POOL_TOTAL_START,
  deployedCents: POOL_DEPLOYED_START,
  availableLiquidityCents: POOL_TOTAL_START - POOL_DEPLOYED_START,
  accountingBalanceCents: POOL_TOTAL_START,
  userInvestedCents: 0,
  userYieldCents: 0,
  totalYieldCents: 0,
  outstandingPrincipalCents: POOL_DEPLOYED_START,
  expectedYieldLabel: EXPECTED_YIELD_LABEL,
  updatedAt: new Date().toISOString(),
  recentEntries: [],
});

// Fatura começa ZERADA (sem lançamentos). O total da fatura é SEMPRE a soma
// dos itens, então "Total da fatura" bate com "Últimas Compras". Cada cobrança
// feita na Loja adiciona um item aqui e soma o mesmo valor ao total.
const seedInvoiceItems = (): NonNullable<KoraInvoice["items"]> => [];

const sumItems = (items: NonNullable<KoraInvoice["items"]>) =>
  items.reduce((sum, it) => sum + it.amountCents, 0);

// Limite já usado = soma dos itens da fatura (mantém cartão e fatura coerentes).
const SEED_OPEN_CENTS = sumItems(seedInvoiceItems());

const seedCard = (): KoraCard => ({
  id: "card_demo",
  name: "Kori Black",
  network: "mastercard",
  currency: "BRL",
  last4: "8294",
  cardNumber: "5421 7730 4418 8294",
  expiry: "08/29",
  cvv: "507",
  isFrozen: false,
  isOnlineEnabled: true,
  limitTotalCents: CARD_LIMIT_TOTAL,
  limitUsedCents: SEED_OPEN_CENTS,
  openPrincipalCents: SEED_OPEN_CENTS,
  availableLimitCents: CARD_LIMIT_TOTAL - SEED_OPEN_CENTS,
});

const seedInvoice = (): KoraInvoice => {
  const items = seedInvoiceItems();
  const total = sumItems(items);
  return {
    id: "inv_demo",
    cardId: "card_demo",
    status: "OPEN",
    currency: "BRL",
    totalCents: total,
    paidCents: 0,
    pendingCents: total,
    dueDate: isoInDays(12),
    closeDate: isoInDays(5),
    closingDate: isoInDays(5),
    cycleStart: isoInDays(-5),
    cycleEnd: isoInDays(25),
    cycleMonth: new Date().toISOString().slice(0, 7),
    items,
  };
};

const seed = (): DemoState => ({
  userBalanceCents: USER_BALANCE_START,
  merchantBalanceCents: MERCHANT_BALANCE_START,
  card: seedCard(),
  invoice: seedInvoice(),
  receivables: [],
  pool: seedPool(),
  sales: [],
  products: seedProducts(),
});

state = seed();

const pushPoolEntry = (
  direction: "DEBIT" | "CREDIT",
  amountCents: number,
  referenceType: string,
  description: string,
) => {
  const entry: KoraLedgerEntry = {
    id: genId("le"),
    accountId: "pool",
    direction,
    amountCents,
    referenceType,
    referenceId: genId("ref"),
    description,
    createdAt: new Date().toISOString(),
  };
  state.pool.recentEntries = [entry, ...state.pool.recentEntries].slice(0, 8);
  state.pool.updatedAt = entry.createdAt!;
};

// ─── API mockada (consumida pelo koraApi quando MOCK_DEMO) ───────────────────
export const mockDemoLedger = {
  reset() {
    state = seed();
  },

  genTxHash,

  // Saldos: PF (USER_BALANCE) e PJ (MERCHANT_BALANCE)
  ledgerEntries(): KoraLedgerAccount[] {
    return [
      {
        id: "acc_user",
        type: "USER_BALANCE",
        currency: "BRL",
        balanceCents: state.userBalanceCents,
        entries: [],
      },
      {
        id: "acc_merchant",
        type: "MERCHANT_BALANCE",
        currency: "BRL",
        balanceCents: state.merchantBalanceCents,
        entries: [],
      },
    ];
  },

  // Cartão da pessoa
  cardsList(): KoraCard[] {
    return [clone(state.card)];
  },
  card(): KoraCard {
    return clone(state.card);
  },
  freezeCard(isFrozen: boolean): KoraCard {
    state.card.isFrozen = isFrozen;
    return clone(state.card);
  },
  onlineCard(isOnlineEnabled: boolean): KoraCard {
    state.card.isOnlineEnabled = isOnlineEnabled;
    return clone(state.card);
  },
  limitCard(limitTotalCents: number): KoraCard {
    state.card.limitTotalCents = limitTotalCents;
    state.card.availableLimitCents = Math.max(limitTotalCents - (state.card.openPrincipalCents ?? 0), 0);
    return clone(state.card);
  },
  regenerateCard(): KoraCard {
    const n = () => Math.floor(1000 + Math.random() * 9000);
    state.card.cardNumber = `5421 ${n()} ${n()} ${n()}`;
    state.card.last4 = state.card.cardNumber.slice(-4);
    state.card.cvv = String(Math.floor(100 + Math.random() * 900));
    return clone(state.card);
  },

  // Fatura da pessoa
  invoiceCurrent(): KoraInvoice {
    return clone(state.invoice);
  },

  // Pessoa paga a fatura → saldo PF ↓, principal volta ao pool + ágio 2% → rendimento ↑
  payInvoice(): KoraPayment {
    const pending = Math.max(state.invoice.pendingCents ?? 0, 0);
    if (pending > 0) {
      state.userBalanceCents = Math.max(state.userBalanceCents - pending, 0);
      state.invoice.paidCents = (state.invoice.paidCents ?? 0) + pending;
      state.invoice.pendingCents = 0;
      state.invoice.status = "PAID";

      // Limite do cartão é liberado conforme a fatura é quitada.
      const open = Math.max((state.card.openPrincipalCents ?? 0) - pending, 0);
      state.card.openPrincipalCents = open;
      state.card.limitUsedCents = open;
      state.card.availableLimitCents = Math.max((state.card.limitTotalCents ?? 0) - open, 0);

      // Principal antecipado volta ao pool + ágio (2%) sobre o que o pool financiou.
      const returned = Math.min(state.pool.deployedCents, pending);
      const agio = Math.round(returned * AGIO_PCT);
      state.pool.deployedCents = Math.max(state.pool.deployedCents - returned, 0);
      state.pool.outstandingPrincipalCents = Math.max(
        (state.pool.outstandingPrincipalCents ?? 0) - returned,
        0,
      );
      state.pool.availableLiquidityCents += returned + agio;
      state.pool.accountingBalanceCents += agio;
      state.pool.initialLiquidityCents += agio; // ágio aumenta o valor do pool
      state.pool.userYieldCents = (state.pool.userYieldCents ?? 0) + agio;
      state.pool.totalYieldCents = (state.pool.totalYieldCents ?? 0) + agio;
      pushPoolEntry("CREDIT", returned + agio, "INVOICE_PAYMENT", "Fatura paga · ágio 2%");
    }

    return {
      id: genId("pay"),
      status: "COMPLETED",
      amountCents: pending,
      currency: "BRL",
      txHash: genTxHash(),
      programStatus: "CONFIRMED",
      createdAt: new Date().toISOString(),
    };
  },

  // Loja cobra a pessoa no cartão → parcelas na fatura + recebíveis pendentes
  createMockCardPayment(body: {
    amountCents: number;
    installmentsCount: number;
    cardType: "credit";
    productId?: string;
    productName?: string;
    buyerName?: string;
  }): KoraMockCardPayment {
    const amount = body.amountCents;
    const count = Math.max(body.installmentsCount || 1, 1);
    const saleId = genId("sale");
    const buyerName = body.buyerName || "Ana Ribeiro";
    const now = new Date().toISOString();

    // Parcelas (rateio com ajuste de centavos na primeira).
    const base = Math.floor(amount / count);
    const installments = Array.from({ length: count }, (_, i) => {
      const principal = i === 0 ? amount - base * (count - 1) : base;
      return {
        id: genId("inst"),
        number: i + 1,
        total: count,
        principalCents: principal,
        dueDate: isoInDays(30 * (i + 1)),
      };
    });

    const sale: KoraSale = {
      id: saleId,
      buyerName,
      amountCents: amount,
      currency: "BRL",
      status: "APPROVED",
      createdAt: now,
      txHash: genTxHash(),
      items: body.productId
        ? [{ id: genId("si"), qty: 1, priceCents: amount }]
        : undefined,
    };
    state.sales = [sale, ...state.sales];

    // Recebíveis pendentes (um por parcela) para a loja antecipar.
    const newReceivables: KoraReceivable[] = installments.map((inst) => {
      const net = Math.round(inst.principalCents * (1 - ADVANCE_FEE_PCT));
      return {
        id: genId("rec"),
        saleId,
        status: "PENDING",
        currency: "BRL",
        grossAmountCents: inst.principalCents,
        netAmountCents: net,
        installmentsCount: count,
        installmentNumber: inst.number,
        installmentId: inst.id,
        dueDate: inst.dueDate,
        sale,
      };
    });
    state.receivables = [...newReceivables, ...state.receivables];

    // Parcelas entram na fatura da pessoa e travam o limite do cartão.
    state.invoice.totalCents += amount;
    state.invoice.pendingCents = (state.invoice.pendingCents ?? 0) + amount;
    state.invoice.status = "OPEN";
    state.invoice.items = [
      {
        id: genId("it"),
        description: body.productName || `Compra ${MERCHANT_NAME}`,
        amountCents: amount,
        createdAt: now,
        installmentsCount: count,
        logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200",
      },
      ...(state.invoice.items ?? []),
    ];
    const open = (state.card.openPrincipalCents ?? 0) + amount;
    state.card.openPrincipalCents = open;
    state.card.limitUsedCents = open;
    state.card.availableLimitCents = Math.max((state.card.limitTotalCents ?? 0) - open, 0);

    return {
      status: "APPROVED",
      card: { id: state.card.id, last4: state.card.last4, network: state.card.network },
      sale,
      transaction: {
        id: genId("txn"),
        amountCents: amount,
        installmentsCount: count,
        merchantName: MERCHANT_NAME,
      },
      installments,
      receivables: newReceivables,
      credit: {
        limitTotalCents: state.card.limitTotalCents ?? 0,
        lockedLimitCents: open,
        limitAvailableCents: state.card.availableLimitCents ?? 0,
      },
    };
  },

  // Recebíveis pendentes da loja
  receivablesList(): KoraReceivable[] {
    return clone(state.receivables);
  },

  // Loja antecipa um recebível → saldo da loja ↑ (vindo do pool)
  advanceReceivable(id: string, provider: "KORI" | "POOL" | "P2P" = "POOL"): KoraReceivableAdvance {
    const rec = state.receivables.find((r) => r.id === id);
    const gross = rec?.grossAmountCents ?? 0;
    const net = rec?.netAmountCents ?? Math.round(gross * (1 - ADVANCE_FEE_PCT));
    const fee = gross - net;

    if (rec && provider !== "P2P") {
      rec.status = "ANTICIPATED";
      rec.txHash = genTxHash();
      // Loja recebe o líquido; o pool financia a antecipação.
      state.merchantBalanceCents += net;
      state.pool.availableLiquidityCents = Math.max(state.pool.availableLiquidityCents - net, 0);
      state.pool.deployedCents += net;
      state.pool.outstandingPrincipalCents = (state.pool.outstandingPrincipalCents ?? 0) + gross;
      pushPoolEntry("DEBIT", net, "RECEIVABLE_ADVANCE", "Antecipação financiada pelo pool");
    }

    return {
      id: genId("adv"),
      receivableId: id,
      status: provider === "P2P" ? "PENDING_AUCTION" : "COMPLETED",
      provider,
      grossAmountCents: gross,
      netAmountCents: net,
      feeCents: fee,
      txHash: rec?.txHash ?? genTxHash(),
      programStatus: "CONFIRMED",
    };
  },

  // Posição resgatável do usuário (aporte + rendimento)
  redeemablePositionCents(): number {
    return (state.pool.userInvestedCents ?? 0) + (state.pool.userYieldCents ?? 0);
  },

  // Pool do investidor
  pool(): KoraInvestmentPool {
    return clone(state.pool);
  },

  // Investidor resgata do pool → saldo PF ↑, posição/pool ↓
  redeemPool(amountCents: number): KoraInvestmentOrder {
    const position = (state.pool.userInvestedCents ?? 0) + (state.pool.userYieldCents ?? 0);
    const amount = Math.min(Math.max(amountCents, 0), position);

    const fromInvested = Math.min(amount, state.pool.userInvestedCents ?? 0);
    const fromYield = amount - fromInvested;

    state.pool.userInvestedCents = Math.max((state.pool.userInvestedCents ?? 0) - fromInvested, 0);
    state.pool.userYieldCents = Math.max((state.pool.userYieldCents ?? 0) - fromYield, 0);
    state.pool.availableLiquidityCents = Math.max(state.pool.availableLiquidityCents - amount, 0);
    state.pool.accountingBalanceCents = Math.max(state.pool.accountingBalanceCents - amount, 0);
    state.pool.initialLiquidityCents = Math.max(state.pool.initialLiquidityCents - amount, 0);
    state.userBalanceCents += amount;
    pushPoolEntry("DEBIT", amount, "REDEMPTION", "Resgate do pool");

    return {
      id: genId("rdm"),
      status: "COMPLETED",
      amountCents: amount,
      currency: "BRL",
      userInvestedCents: state.pool.userInvestedCents ?? 0,
      pool: clone(state.pool),
    };
  },

  // Investidor aporta no pool → saldo PF ↓, liquidez do pool ↑
  investPool(amountCents: number): KoraInvestmentOrder {
    state.userBalanceCents = Math.max(state.userBalanceCents - amountCents, 0);
    state.pool.availableLiquidityCents += amountCents;
    state.pool.accountingBalanceCents += amountCents;
    state.pool.initialLiquidityCents += amountCents; // o aporte aumenta o tamanho do pool
    state.pool.userInvestedCents = (state.pool.userInvestedCents ?? 0) + amountCents;
    pushPoolEntry("CREDIT", amountCents, "INVESTMENT", "Aporte no pool");

    return {
      id: genId("inv"),
      status: "COMPLETED",
      amountCents,
      currency: "BRL",
      userInvestedCents: state.pool.userInvestedCents ?? amountCents,
      pool: clone(state.pool),
    };
  },

  // Catálogo / vendas da loja
  products(): KoraProduct[] {
    return clone(state.products);
  },
  sales(): KoraSale[] {
    return clone(state.sales);
  },
  createProduct(body: {
    name: string;
    description?: string;
    category?: string;
    priceCents: number;
    imageUrl?: string;
    isNft?: boolean;
    nftLabel?: string;
  }): KoraProduct {
    const product: KoraProduct = {
      id: genId("prod"),
      name: body.name,
      description: body.description ?? null,
      category: body.category ?? null,
      priceCents: body.priceCents,
      imageUrl: body.imageUrl ?? null,
      isNft: body.isNft,
      nftLabel: body.nftLabel ?? null,
    };
    state.products = [product, ...state.products];
    return clone(product);
  },
  updateProduct(id: string, body: Partial<KoraProduct>): KoraProduct {
    const idx = state.products.findIndex((p) => p.id === id);
    if (idx >= 0) state.products[idx] = { ...state.products[idx], ...body };
    return clone(state.products[idx] ?? ({ id, name: "", priceCents: 0 } as KoraProduct));
  },
  deleteProduct(id: string): void {
    state.products = state.products.filter((p) => p.id !== id);
  },

  // Contas (PF/PJ) — usado pelo bootstrap/seletor de conta
  accounts(): KoraAccount[] {
    return [
      {
        id: "demo-pf",
        name: "Ana Ribeiro",
        username: "ana.ribeiro",
        accountType: "PF",
        walletIndex: 0,
        walletAddress: "7nxB2xT8aYqP9mZ1cR5vW4kL3jH6fD9gS8xV1nC4X1a",
      },
      {
        id: "demo-pj",
        name: "Loja Aurora",
        username: "loja.aurora",
        accountType: "PJ",
        walletIndex: 1,
        walletAddress: "Aur0raSt0re5pQ2mZ1cR5vW4kL3jH6fD9gS8xV1nC4Z9b",
        businessName: "Loja Aurora",
        store: { id: "store-aurora", name: "Loja Aurora", username: "loja.aurora", category: "Moda & Acessórios" },
      },
    ];
  },

  // Envio Pix/transferência → saldo PF ↓, retorna comprovante com txHash
  sendPayment(amountCents: number, recipientType = "username", recipientId = ""): KoraPayment {
    if (amountCents > 0) {
      state.userBalanceCents = Math.max(state.userBalanceCents - amountCents, 0);
    }
    return {
      id: genId("pay"),
      status: "COMPLETED",
      amountCents,
      currency: "BRL",
      recipientType,
      recipientId,
      txHash: genTxHash(),
      programStatus: "CONFIRMED",
      createdAt: new Date().toISOString(),
    };
  },
  getPayment(id: string): KoraPayment {
    return {
      id,
      status: "COMPLETED",
      currency: "BRL",
      txHash: genTxHash(),
      programStatus: "CONFIRMED",
      createdAt: new Date().toISOString(),
    };
  },

  // Crédito (perfil/score) — valores ilustrativos para a demo
  creditProfile(): any {
    return {
      status: "ACTIVE",
      limitTotalCents: state.card.limitTotalCents,
      limitUsedCents: state.card.openPrincipalCents ?? 0,
      limitAvailableCents: state.card.availableLimitCents ?? 0,
      score: 782,
    };
  },
  creditScore(): any {
    return { score: 782, max: 900, tier: "A", updatedAt: new Date().toISOString() };
  },

  getAdvance(id: string): KoraReceivableAdvance {
    const rec = state.receivables.find((r) => r.id === id || r.installmentId === id);
    const gross = rec?.grossAmountCents ?? 0;
    const net = rec?.netAmountCents ?? Math.round(gross * (1 - ADVANCE_FEE_PCT));
    return {
      id: genId("adv"),
      receivableId: rec?.id ?? id,
      status: "COMPLETED",
      provider: "POOL",
      grossAmountCents: gross,
      netAmountCents: net,
      feeCents: gross - net,
      txHash: rec?.txHash ?? genTxHash(),
      programStatus: "CONFIRMED",
    };
  },
};

export type MockDemoLedger = typeof mockDemoLedger;
