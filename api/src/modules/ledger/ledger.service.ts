import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

type Currency = 'BRL' | 'USD' | 'EUR' | 'SOL' | 'USDC';
type LedgerAccountType =
  | 'USER_BALANCE'
  | 'CARD_RECEIVABLE'
  | 'MERCHANT_BALANCE'
  | 'PLATFORM';
type LedgerDirection = 'DEBIT' | 'CREDIT';

@Injectable()
export class LedgerService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureAccount(
    userId: string | null,
    type: LedgerAccountType,
    currency: Currency = 'BRL',
  ) {
    const ledgerAccount = (this.prisma as any).ledgerAccount;
    const existing = await ledgerAccount.findFirst({
      where: { userId, type, currency },
    });
    if (existing) return existing;

    return ledgerAccount.create({
      data: {
        userId,
        type,
        currency,
        balanceCents: 0,
      },
    });
  }

  async postEntry(params: {
    userId: string | null;
    accountType: LedgerAccountType;
    currency?: Currency;
    direction: LedgerDirection;
    amountCents: number;
    referenceType: string;
    referenceId: string;
    description: string;
  }) {
    if (!Number.isInteger(params.amountCents) || params.amountCents <= 0) {
      throw new BadRequestException('amountCents must be a positive integer');
    }

    const account = await this.ensureAccount(
      params.userId,
      params.accountType,
      params.currency ?? 'BRL',
    );

    const delta =
      params.direction === 'CREDIT' ? params.amountCents : -params.amountCents;

    return (this.prisma as any).$transaction(async (tx: any) => {
      const updated = await tx.ledgerAccount.update({
        where: { id: account.id },
        data: { balanceCents: { increment: delta } },
      });

      const entry = await tx.ledgerEntry.create({
        data: {
          accountId: account.id,
          direction: params.direction,
          amountCents: params.amountCents,
          referenceType: params.referenceType,
          referenceId: params.referenceId,
          description: params.description,
        },
      });

      return { account: updated, entry };
    });
  }

  async listEntries(userId: string) {
    const accounts = await (this.prisma as any).ledgerAccount.findMany({
      where: { userId },
      include: {
        entries: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return accounts;
  }

  async findPaymentForUser(userId: string, paymentId: string) {
    const payment = await (this.prisma as any).payment.findFirst({
      where: { id: paymentId, userId },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }
}
