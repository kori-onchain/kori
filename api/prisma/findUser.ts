import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = (process.env.DATABASE_URL || '').replace(/^["']|["']$/g, '');
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
} as any);

async function main() {
  const users = await (prisma as any).user.findMany({
    where: {
      OR: [
        { username: { contains: 'kaua' } },
        { email: { contains: 'kauamigueldev' } },
      ],
    },
    include: { cards: true },
  });
  console.log(JSON.stringify(users, null, 2));
}

main().finally(() => prisma.$disconnect());
