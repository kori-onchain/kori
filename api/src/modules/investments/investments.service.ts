import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma/prisma.service';
import { LedgerService } from '../ledger/ledger.service';

@Injectable()
export class InvestmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ledger: LedgerService,
    private readonly config: ConfigService,
  ) {}

  async poolSummary(userId?: string) {
    const initialLiquidityCents = this.initialLiquidityCents();
    const account = await this.ledger.ensureAccount(null, 'PLATFORM', 'BRL');
    const poolEntries = await (this.prisma as any).ledgerEntry.findMany({
      where: { accountId: account.id },
      orderBy: { createdAt: 'desc' },
    });
    const entries = poolEntries.slice(0, 10);
    const metrics = this.poolMetrics(poolEntries);
    const userInvestedCents = userId ? await this.userInvestedCents(userId) : 0;
    const userYieldCents =
      userId && metrics.totalInvestedCents > 0
        ? Math.floor((metrics.totalYieldCents * userInvestedCents) / metrics.totalInvestedCents)
        : 0;

    return {
      currency: 'BRL',
      initialLiquidityCents,
      deployedCents: metrics.deployedCents,
      availableLiquidityCents: Math.max(
        initialLiquidityCents +
          metrics.totalInvestedCents +
          metrics.totalYieldCents -
          metrics.deployedCents,
        0,
      ),
      accountingBalanceCents: account.balanceCents,
      userInvestedCents,
      userYieldCents,
      totalYieldCents: metrics.totalYieldCents,
      outstandingPrincipalCents: metrics.deployedCents,
      expectedYieldLabel: 'CDI + 3,0% a.a.',
      updatedAt: new Date().toISOString(),
      recentEntries: entries.map((entry: any) => ({
        id: entry.id,
        accountId: entry.accountId,
        direction: entry.direction,
        amountCents: entry.amountCents,
        referenceType: entry.referenceType,
        referenceId: entry.referenceId,
        description: entry.description,
        createdAt: entry.createdAt,
      })),
    };
  }

  async invest(userId: string, amountCents: number) {
    if (!Number.isInteger(amountCents) || amountCents <= 0) {
      throw new BadRequestException('amountCents must be a positive integer');
    }

    const payment = await (this.prisma as any).payment.create({
      data: {
        userId,
        amountCents,
        currency: 'BRL',
        method: 'INTERNAL_LEDGER',
        status: 'COMPLETED',
        recipientType: 'investment_pool',
        recipientId: 'receivables_pool',
        programStatus: 'OFFCHAIN_POOL_INVESTMENT',
      },
    });

    await this.ledger.postEntry({
      userId,
      accountType: 'USER_BALANCE',
      currency: 'BRL',
      direction: 'DEBIT',
      amountCents,
      referenceType: 'POOL_USER_INVESTMENT',
      referenceId: payment.id,
      description: 'Investimento no pool de recebiveis',
    });
    await this.ledger.postEntry({
      userId: null,
      accountType: 'PLATFORM',
      currency: 'BRL',
      direction: 'CREDIT',
      amountCents,
      referenceType: 'POOL_USER_INVESTMENT',
      referenceId: payment.id,
      description: `Investor funding ${userId}`,
    });

    return {
      id: payment.id,
      status: payment.status,
      amountCents,
      currency: payment.currency,
      userInvestedCents: await this.userInvestedCents(userId),
      pool: await this.poolSummary(userId),
    };
  }

  async recordReceivableAdvance(params: {
    advanceId: string;
    amountCents: number;
    protocol: string;
  }) {
    return this.ledger.postEntry({
      userId: null,
      accountType: 'PLATFORM',
      currency: 'BRL',
      direction: 'DEBIT',
      amountCents: params.amountCents,
      referenceType: 'POOL_RECEIVABLE_ADVANCE',
      referenceId: params.advanceId,
      description: `Pool funding ${params.protocol}`,
    });
  }

  async recordInvoicePayment(params: {
    paymentId: string;
    invoiceId: string;
    amountCents: number;
    cycleMonth: string;
  }) {
    const installments = await (this.prisma as any).installment.findMany({
      where: {
        invoiceId: params.invoiceId,
        receivableId: { not: null },
      },
      select: { receivableId: true },
    });
    const receivableIds = Array.from(
      new Set(installments.map((item: any) => item.receivableId).filter(Boolean)),
    );
    if (!receivableIds.length) return [];

    const advances = await (this.prisma as any).receivableAdvance.findMany({
      where: {
        receivableId: { in: receivableIds },
        provider: 'POOL',
        status: 'COMPLETED',
      },
    });

    const entries = [];
    for (const advance of advances) {
      entries.push(
        await this.ledger.postEntry({
          userId: null,
          accountType: 'PLATFORM',
          currency: 'BRL',
          direction: 'CREDIT',
          amountCents: advance.netCents,
          referenceType: 'POOL_RECEIVABLE_REPAYMENT',
          referenceId: advance.id,
          description: `Pool principal repayment ${params.cycleMonth}`,
        }),
      );
      if (advance.feeCents > 0) {
        entries.push(
          await this.ledger.postEntry({
            userId: null,
            accountType: 'PLATFORM',
            currency: 'BRL',
            direction: 'CREDIT',
            amountCents: advance.feeCents,
            referenceType: 'POOL_RECEIVABLE_YIELD',
            referenceId: advance.id,
            description: `Pool yield ${params.cycleMonth}`,
          }),
        );
      }
    }
    return entries;
  }

  private initialLiquidityCents() {
    const raw =
      this.config.get<string>('INVESTMENT_POOL_INITIAL_LIQUIDITY_CENTS') ||
      this.config.get<string>('POOL_INITIAL_LIQUIDITY_CENTS');
    const parsed = raw ? Number.parseInt(raw, 10) : 5_000_000;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 5_000_000;
  }

  private async userInvestedCents(userId: string) {
    const account = await this.ledger.ensureAccount(userId, 'USER_BALANCE', 'BRL');
    const entries = await (this.prisma as any).ledgerEntry.findMany({
      where: {
        accountId: account.id,
        referenceType: 'POOL_USER_INVESTMENT',
      },
    });
    return entries.reduce((sum: number, entry: any) => {
      return sum + (entry.direction === 'DEBIT' ? entry.amountCents : -entry.amountCents);
    }, 0);
  }

  private poolMetrics(entries: any[]) {
    return entries.reduce(
      (acc, entry) => {
        if (entry.referenceType === 'POOL_USER_INVESTMENT') {
          acc.totalInvestedCents += entry.direction === 'CREDIT' ? entry.amountCents : -entry.amountCents;
        }
        if (entry.referenceType === 'POOL_RECEIVABLE_ADVANCE') {
          acc.advancedPrincipalCents += entry.amountCents;
        }
        if (entry.referenceType === 'POOL_RECEIVABLE_REPAYMENT') {
          acc.repaidPrincipalCents += entry.amountCents;
        }
        if (entry.referenceType === 'POOL_RECEIVABLE_YIELD') {
          acc.totalYieldCents += entry.amountCents;
        }
        acc.deployedCents = Math.max(
          acc.advancedPrincipalCents - acc.repaidPrincipalCents,
          0,
        );
        return acc;
      },
      {
        totalInvestedCents: 0,
        advancedPrincipalCents: 0,
        repaidPrincipalCents: 0,
        totalYieldCents: 0,
        deployedCents: 0,
      },
    );
  }
}
