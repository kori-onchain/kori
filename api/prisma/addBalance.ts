import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = (process.env.DATABASE_URL || '').replace(/^["']|["']$/g, '');
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
} as any);

async function main() {
  const user = await (prisma as any).user.findUnique({ where: { username: 'kauamigueldev' } });
  if (!user) throw new Error('User kauamigueldev not found');

  // R$1.000,00 = 100000 cents in the USER_BALANCE (BRL) ledger account
  const account = await (prisma as any).ledgerAccount.upsert({
    where: { userId_type_currency: { userId: user.id, type: 'USER_BALANCE', currency: 'BRL' } },
    update: { balanceCents: 100000 },
    create: { userId: user.id, type: 'USER_BALANCE', currency: 'BRL', balanceCents: 100000 },
  });

  console.log('Saldo atualizado:');
  console.log(JSON.stringify({ userId: user.id, type: account.type, currency: account.currency, balanceCents: account.balanceCents }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
