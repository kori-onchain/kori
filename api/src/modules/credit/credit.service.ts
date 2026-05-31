import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class CreditService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await (this.prisma as any).creditProfile.findUnique({
      where: { userId },
    });
    if (profile) return profile;
    return (this.prisma as any).creditProfile.create({
      data: {
        userId,
        creditLimitCents: 0,
        lockedLimitCents: 0,
        score: 650,
      },
    });
  }

  async setLimit(userId: string, creditLimitCents: number) {
    const lockedLimitCents = await this.lockedLimit(userId);
    if (creditLimitCents < lockedLimitCents) {
      throw new BadRequestException('Credit limit cannot be lower than locked limit');
    }
    return (this.prisma as any).creditProfile.upsert({
      where: { userId },
      create: {
        userId,
        creditLimitCents,
        lockedLimitCents,
        score: this.scoreFor(creditLimitCents, lockedLimitCents),
      },
      update: {
        creditLimitCents,
        lockedLimitCents,
        score: this.scoreFor(creditLimitCents, lockedLimitCents),
      },
    });
  }

  async getScore(userId: string) {
    const profile = await this.getProfile(userId);
    return {
      score: profile.score,
      rating:
        profile.score >= 850
          ? 'EXCELLENT'
          : profile.score >= 700
            ? 'GOOD'
            : 'BUILDING',
      factors: [
        'Histórico de faturas',
        'Uso de limite',
        'Atividade da conta',
        'Carteira Privy vinculada',
      ],
    };
  }

  private async lockedLimit(userId: string) {
    const result = await (this.prisma as any).installment.aggregate({
      where: { userId, status: 'OPEN' },
      _sum: { principalCents: true },
    });
    return result._sum.principalCents ?? 0;
  }

  private scoreFor(limit: number, locked: number) {
    if (limit === 0) return 650;
    const usage = locked / limit;
    if (usage < 0.3) return 908;
    if (usage < 0.7) return 760;
    return 680;
  }
}
