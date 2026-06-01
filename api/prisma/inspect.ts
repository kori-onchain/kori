import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = (process.env.DATABASE_URL || '').replace(/^["']|["']$/g, '');
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
} as any);

async function main() {
  const kaua = await (prisma as any).user.findUnique({ where: { username: 'kauamigueldev' } });
  console.log('kauamigueldev:', kaua?.id, 'privyId:', kaua?.privyId);

  const siblings = await (prisma as any).user.findMany({
    where: { privyId: kaua.privyId },
    select: { id: true, username: true, accountType: true, walletIndex: true },
  });
  console.log('Accounts under same privyId:', JSON.stringify(siblings, null, 2));

  const ledgers = await (prisma as any).ledgerAccount.findMany({ where: { userId: kaua.id } });
  console.log('Ledger accounts:', JSON.stringify(ledgers, null, 2));

  const cards = await (prisma as any).card.findMany({ where: { userId: kaua.id } });
  console.log('Cards:', cards.map((c: any) => ({ id: c.id, last4: c.last4, status: c.status, limit: c.limitTotalCents })));
}

main().finally(() => prisma.$disconnect());
