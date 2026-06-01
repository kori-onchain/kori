import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = (process.env.DATABASE_URL || '').replace(/^["']|["']$/g, '');
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
} as any);

async function main() {
  const user = await (prisma as any).user.findUnique({
    where: { username: 'kauamigueldev' },
  });
  if (!user) throw new Error('User kauamigueldev not found');

  const card = await (prisma as any).card.create({
    data: {
      userId: user.id,
      name: 'Kora Card',
      network: 'VISA',
      currency: 'BRL',
      cardNumber: '4532 7711 4023 9156',
      last4: '9156',
      expiry: '11/31',
      cvv: '742',
      isDemo: true,
      limitTotalCents: 1500000,
    },
  });

  await (prisma as any).creditProfile.upsert({
    where: { userId: user.id },
    update: { creditLimitCents: 1500000, score: 720 },
    create: { userId: user.id, creditLimitCents: 1500000, score: 720 },
  });

  console.log('Cartão criado:');
  console.log(JSON.stringify(card, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
