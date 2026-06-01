import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { InvestmentsService } from '../investments/investments.service';
import { LedgerService } from '../ledger/ledger.service';

@Injectable()
export class ReceivablesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ledger: LedgerService,
    private readonly investments: InvestmentsService,
  ) {}

  async list(user: any) {
    const store = await this.getStore(user);
    return (this.prisma as any).receivable.findMany({
      where: { storeId: store.id },
      include: { sale: { include: { items: true } }, advance: true },
      orderBy: { dueDate: 'asc' },
    });
  }

  async advance(user: any, id: string, provider: 'KORI' | 'POOL' | 'P2P' = 'POOL') {
    const store = await this.getStore(user);
    const receivable = await (this.prisma as any).receivable.findFirst({
      where: { id, storeId: store.id },
    });
    if (!receivable) throw new NotFoundException('Receivable not found');
    if (receivable.status !== 'REGISTERED') {
      throw new BadRequestException('Receivable cannot be advanced');
    }

    const selectedProvider = ['KORI', 'POOL', 'P2P'].includes(provider)
      ? provider
      : 'POOL';
    const terms = this.providerTerms(selectedProvider as 'KORI' | 'POOL' | 'P2P');
    const protocol = this.protocol();
    const advance = await (this.prisma as any).$transaction(async (tx: any) => {
      if (terms.completed) {
        await tx.receivable.update({
          where: { id: receivable.id },
          data: { status: 'ANTICIPATED' },
        });
      }
      const netCents = terms.netCents(
        receivable.grossAmountCents,
        receivable.netAmountCents,
      );
      return tx.receivableAdvance.create({
        data: {
          storeId: store.id,
          receivableId: receivable.id,
          grossCents: receivable.grossAmountCents,
          netCents,
          feeCents: receivable.grossAmountCents - netCents,
          protocol,
          provider: selectedProvider,
          status: terms.status,
          programStatus: receivable.programStatus,
        },
      });
    });

    if (terms.completed) {
      await this.ledger.postEntry({
      userId: user.id,
      accountType: 'MERCHANT_BALANCE',
      direction: 'CREDIT',
      amountCents: advance.netCents,
      referenceType: 'RECEIVABLE_ADVANCE',
      referenceId: advance.id,
      description: `Antecipação ${protocol}`,
    });
      if (selectedProvider === 'POOL') {
        await this.investments.recordReceivableAdvance({
      advanceId: advance.id,
      amountCents: advance.netCents,
      protocol,
        });
      }
    }

    return advance;
  }

  async findAdvance(user: any, id: string) {
    const store = await this.getStore(user);
    const advance = await (this.prisma as any).receivableAdvance.findFirst({
      where: { id, storeId: store.id },
      include: { receivable: true },
    });
    if (!advance) throw new NotFoundException('Advance not found');
    return advance;
  }

  private async getStore(user: any) {
    if (user.accountType !== 'PJ') {
      throw new BadRequestException('Receivables require a PJ account');
    }
    const store = await (this.prisma as any).store.findFirst({
      where: { ownerUserId: user.id },
      orderBy: { createdAt: 'asc' },
    });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  private protocol() {
    const date = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    return `ANT-${date}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }

  private providerTerms(provider: 'KORI' | 'POOL' | 'P2P') {
    if (provider === 'KORI') {
      return {
        completed: true,
        status: 'COMPLETED',
        netCents: (grossCents: number) => Math.floor(grossCents * 0.955),
      };
    }
    if (provider === 'P2P') {
      return {
        completed: false,
        status: 'PENDING_AUCTION',
        netCents: (_grossCents: number, currentNetCents: number) => currentNetCents,
      };
    }
    return {
      completed: true,
      status: 'COMPLETED',
      netCents: (_grossCents: number, currentNetCents: number) => currentNetCents,
    };
  }
}
