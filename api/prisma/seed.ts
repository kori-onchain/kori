import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = (process.env.DATABASE_URL || '').replace(/^["']|["']$/g, '');

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for seed:demo');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
} as any);

const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

async function main() {
  const privyId = process.env.DEMO_PRIVY_ID || 'demo-privy-user';
  const email = process.env.DEMO_EMAIL || 'demo@kora.local';
  const pfWallet = process.env.DEMO_PF_WALLET || null;
  const pjWallet = process.env.DEMO_PJ_WALLET || null;

  const pf = await (prisma as any).user.upsert({
    where: { privyId_walletIndex: { privyId, walletIndex: 0 } },
    update: { email, walletAddress: pfWallet },
    create: {
      privyId,
      name: 'Demo PF',
      email,
      username: 'demo.kora',
      accountType: 'PF',
      walletIndex: 0,
      walletAddress: pfWallet,
    },
  });

  const pj = await (prisma as any).user.upsert({
    where: { privyId_walletIndex: { privyId, walletIndex: 1 } },
    update: { email, walletAddress: pjWallet },
    create: {
      privyId,
      name: 'Demo PJ',
      email,
      username: 'demo.store',
      accountType: 'PJ',
      walletIndex: 1,
      walletAddress: pjWallet,
    },
  });

  const store = await (prisma as any).store.upsert({
    where: { slug: 'demo-store' },
    update: { name: 'Kora Demo Store', settlementWallet: pjWallet },
    create: {
      ownerUserId: pj.id,
      name: 'Kora Demo Store',
      slug: 'demo-store',
      category: 'Moda',
      settlementWallet: pjWallet,
    },
  });

  await (prisma as any).ledgerAccount.upsert({
    where: { userId_type_currency: { userId: pf.id, type: 'USER_BALANCE', currency: 'BRL' } },
    update: {},
    create: { userId: pf.id, type: 'USER_BALANCE', currency: 'BRL', balanceCents: 750000 },
  });
  await (prisma as any).ledgerAccount.upsert({
    where: { userId_type_currency: { userId: pf.id, type: 'USER_BALANCE', currency: 'SOL' } },
    update: {},
    create: { userId: pf.id, type: 'USER_BALANCE', currency: 'SOL', balanceCents: 0 },
  });

  const card = await (prisma as any).card.create({
    data: {
      userId: pf.id,
      name: 'Kora Demo Card',
      network: 'VISA',
      currency: 'BRL',
      cardNumber: '4532 1098 2345 8847',
      last4: '8847',
      expiry: '12/30',
      cvv: '319',
      isDemo: true,
      limitTotalCents: 1500000,
    },
  });

  await (prisma as any).creditProfile.upsert({
    where: { userId: pf.id },
    update: { creditLimitCents: 1500000, score: 720 },
    create: { userId: pf.id, creditLimitCents: 1500000, score: 720 },
  });

  const invoice = await (prisma as any).invoice.create({
    data: {
      userId: pf.id,
      cardId: card.id,
      cycleMonth: '2026-05',
      closeDate: addDays(10),
      dueDate: addDays(17),
      totalCents: 148290,
      paidCents: 0,
      status: 'OPEN',
    },
  });

  const tx = await (prisma as any).cardTransaction.create({
    data: {
      userId: pf.id,
      cardId: card.id,
      invoiceId: invoice.id,
      merchantName: 'Kora Demo Store',
      amountCents: 148290,
      currency: 'BRL',
      installmentsCount: 3,
      status: 'SETTLED',
    },
  });

  await (prisma as any).invoiceItem.create({
    data: {
      invoiceId: invoice.id,
      cardTransactionId: tx.id,
      description: 'Compra demo parcelada',
      amountCents: 49430,
    },
  });

  const product = await (prisma as any).product.create({
    data: {
      storeId: store.id,
      name: 'Camiseta Kora Premium',
      description: 'Demo Store',
      category: 'Other',
      priceCents: 12990,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400',
    },
  });

  const sale = await (prisma as any).sale.create({
    data: {
      storeId: store.id,
      buyerUserId: pf.id,
      buyerName: 'Demo PF',
      amountCents: 12990,
      status: 'PAID',
      items: {
        create: [{ productId: product.id, name: product.name, qty: 1, priceCents: product.priceCents }],
      },
    },
  });

  await (prisma as any).receivable.create({
    data: {
      storeId: store.id,
      saleId: sale.id,
      description: 'Venda demo antecipavel',
      grossAmountCents: 12990,
      netAmountCents: 12590,
      feeBps: 300,
      installmentsCount: 1,
      dueDate: addDays(30),
      status: 'REGISTERED',
      programStatus: 'OFFCHAIN_READY',
    },
  });

  console.log('Seed demo criado/atualizado.');
  console.log(`PF user: ${pf.username} (${pf.id})`);
  console.log(`PJ store: ${store.name} (${store.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
