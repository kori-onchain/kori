import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomInt } from 'crypto';
import { PrismaService } from '../../database/prisma/prisma.service';
import { LedgerService } from '../ledger/ledger.service';
import { CreateCardDto, CreatePurchaseDto } from './dto/card.dto';

@Injectable()
export class CardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ledger: LedgerService,
  ) {}

  private generateCard(network: 'VISA' | 'MASTERCARD' = 'VISA') {
    const prefix = network === 'MASTERCARD' ? '5421' : '4532';
    const block = () => randomInt(1000, 9999).toString();
    const cardNumber = `${prefix} ${block()} ${block()} ${block()}`;
    return {
      cardNumber,
      last4: cardNumber.replace(/\s/g, '').slice(-4),
      expiry: `${String(randomInt(1, 13)).padStart(2, '0')}/${String(
        new Date().getFullYear() + 4,
      ).slice(-2)}`,
      cvv: randomInt(100, 999).toString(),
    };
  }

  private publicCard(card: any) {
    const used = card.limitUsedCents ?? 0;
    return {
      id: card.id,
      name: card.name,
      network: card.network,
      currency: card.currency,
      last4: card.last4,
      cardNumber: `•••• •••• •••• ${card.last4}`,
      expiry: card.expiry,
      isDemo: card.isDemo,
      isFrozen: card.isFrozen,
      isOnlineEnabled: card.isOnlineEnabled,
      status: card.status,
      limitTotalCents: card.limitTotalCents,
      limitUsedCents: used,
      limitAvailableCents: Math.max(card.limitTotalCents - used, 0),
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    };
  }

  async create(userId: string, dto: CreateCardDto) {
    const generated = this.generateCard(dto.network);
    const card = await (this.prisma as any).card.create({
      data: {
        userId,
        name: dto.name,
        network: dto.network,
        currency: dto.currency,
        limitTotalCents: dto.limitTotalCents,
        ...generated,
      },
    });
    await this.ensureCreditProfile(userId, dto.limitTotalCents);
    return this.withUsage(card);
  }

  async list(userId: string) {
    const cards = await (this.prisma as any).card.findMany({
      where: { userId, status: { not: 'CANCELED' } },
      orderBy: { createdAt: 'asc' },
    });
    return Promise.all(cards.map((card: any) => this.withUsage(card)));
  }

  async findOwned(userId: string, cardId: string) {
    const card = await (this.prisma as any).card.findFirst({
      where: { id: cardId, userId, status: { not: 'CANCELED' } },
    });
    if (!card) throw new NotFoundException('Card not found');
    return card;
  }

  async get(userId: string, cardId: string) {
    return this.withUsage(await this.findOwned(userId, cardId));
  }

  async getDetails(userId: string, cardId: string) {
    const card = await this.findOwned(userId, cardId);
    const publicCard = await this.withUsage(card);
    return {
      ...publicCard,
      cardNumber: card.cardNumber,
      cvv: card.cvv,
    };
  }

  async toggleFreeze(userId: string, cardId: string) {
    const card = await this.findOwned(userId, cardId);
    const updated = await (this.prisma as any).card.update({
      where: { id: card.id },
      data: {
        isFrozen: !card.isFrozen,
        status: !card.isFrozen ? 'FROZEN' : 'ACTIVE',
      },
    });
    return this.withUsage(updated);
  }

  async toggleOnline(userId: string, cardId: string) {
    const card = await this.findOwned(userId, cardId);
    const updated = await (this.prisma as any).card.update({
      where: { id: card.id },
      data: { isOnlineEnabled: !card.isOnlineEnabled },
    });
    return this.withUsage(updated);
  }

  async updateLimit(userId: string, cardId: string, limitTotalCents: number) {
    const card = await this.findOwned(userId, cardId);
    const used = await this.openPrincipalCents(userId, card.id);
    if (limitTotalCents < used) {
      throw new BadRequestException('Limit cannot be lower than open principal');
    }
    const updated = await (this.prisma as any).card.update({
      where: { id: card.id },
      data: { limitTotalCents },
    });
    await this.syncCreditProfile(userId);
    return this.withUsage(updated);
  }

  async regenerate(userId: string, cardId: string) {
    const card = await this.findOwned(userId, cardId);
    const updated = await (this.prisma as any).card.update({
      where: { id: card.id },
      data: this.generateCard(card.network),
    });
    return this.withUsage(updated);
  }

  async remove(userId: string, cardId: string) {
    const card = await this.findOwned(userId, cardId);
    const used = await this.openPrincipalCents(userId, card.id);
    if (used > 0) {
      throw new BadRequestException('Cannot delete card with open installments');
    }
    await (this.prisma as any).card.update({
      where: { id: card.id },
      data: { status: 'CANCELED' },
    });
    return { deleted: true };
  }

  async purchase(userId: string, cardId: string, dto: CreatePurchaseDto) {
    const card = await this.findOwned(userId, cardId);
    if (card.isFrozen || card.status !== 'ACTIVE') {
      throw new BadRequestException('Card is frozen');
    }
    if (!card.isOnlineEnabled) {
      throw new BadRequestException('Online purchases are disabled');
    }

    const used = await this.openPrincipalCents(userId, card.id);
    if (used + dto.amountCents > card.limitTotalCents) {
      throw new BadRequestException('Credit limit exceeded');
    }

    const result = await (this.prisma as any).$transaction(async (tx: any) => {
      const firstInvoice = await this.ensureInvoiceTx(tx, userId, card.id, new Date());
      const transaction = await tx.cardTransaction.create({
        data: {
          userId,
          cardId: card.id,
          invoiceId: firstInvoice.id,
          merchantName: dto.merchantName,
          amountCents: dto.amountCents,
          currency: dto.currency,
          installmentsCount: dto.installmentsCount,
          saleId: dto.saleId,
          txHash: dto.txHash,
          programStatus: dto.programStatus,
        },
      });

      let remaining = dto.amountCents;
      const base = Math.floor(dto.amountCents / dto.installmentsCount);
      const createdInstallments = [];

      for (let i = 1; i <= dto.installmentsCount; i += 1) {
        const amount =
          i === dto.installmentsCount ? remaining : Math.min(base, remaining);
        remaining -= amount;
        const dueDate = this.addMonths(firstInvoice.dueDate, i - 1);
        const invoice = await this.ensureInvoiceTx(tx, userId, card.id, dueDate);
        const installment = await tx.installment.create({
          data: {
            userId,
            cardTransactionId: transaction.id,
            invoiceId: invoice.id,
            number: i,
            total: dto.installmentsCount,
            principalCents: amount,
            dueDate,
            saleId: dto.saleId,
            txHash: dto.txHash,
            programStatus: dto.programStatus,
          },
        });
        await tx.invoiceItem.create({
          data: {
            invoiceId: invoice.id,
            cardTransactionId: transaction.id,
            installmentId: installment.id,
            description: `${dto.merchantName} ${i}/${dto.installmentsCount}`,
            amountCents: amount,
          },
        });
        await tx.invoice.update({
          where: { id: invoice.id },
          data: { totalCents: { increment: amount } },
        });
        createdInstallments.push(installment);
      }

      return { transaction, installments: createdInstallments };
    });

    await this.ledger.postEntry({
      userId,
      accountType: 'CARD_RECEIVABLE',
      currency: dto.currency,
      direction: 'CREDIT',
      amountCents: dto.amountCents,
      referenceType: 'CARD_TRANSACTION',
      referenceId: result.transaction.id,
      description: `Compra ${dto.merchantName}`,
    });
    await this.syncCreditProfile(userId);
    return result;
  }

  private async withUsage(card: any) {
    const limitUsedCents = await this.openPrincipalCents(card.userId, card.id);
    return this.publicCard({ ...card, limitUsedCents });
  }

  private async openPrincipalCents(userId: string, cardId?: string) {
    const result = await (this.prisma as any).installment.aggregate({
      where: {
        userId,
        status: 'OPEN',
        ...(cardId ? { cardTransaction: { cardId } } : {}),
      },
      _sum: { principalCents: true },
    });
    return result._sum.principalCents ?? 0;
  }

  private async ensureCreditProfile(userId: string, minimumLimitCents = 0) {
    const existing = await (this.prisma as any).creditProfile.findUnique({
      where: { userId },
    });
    if (existing) return existing;
    return (this.prisma as any).creditProfile.create({
      data: {
        userId,
        creditLimitCents: minimumLimitCents,
        lockedLimitCents: 0,
        score: 650,
      },
    });
  }

  private async syncCreditProfile(userId: string) {
    const cards = await (this.prisma as any).card.findMany({
      where: { userId, status: { not: 'CANCELED' } },
    });
    const creditLimitCents = cards.reduce(
      (sum: number, card: any) => sum + card.limitTotalCents,
      0,
    );
    const lockedLimitCents = await this.openPrincipalCents(userId);
    await (this.prisma as any).creditProfile.upsert({
      where: { userId },
      create: {
        userId,
        creditLimitCents,
        lockedLimitCents,
        score: 650,
      },
      update: { creditLimitCents, lockedLimitCents },
    });
  }

  private async ensureInvoiceTx(
    tx: any,
    userId: string,
    cardId: string,
    referenceDate: Date,
  ) {
    const cycleMonth = `${referenceDate.getUTCFullYear()}-${String(
      referenceDate.getUTCMonth() + 1,
    ).padStart(2, '0')}`;
    const existing = await tx.invoice.findUnique({
      where: { userId_cardId_cycleMonth: { userId, cardId, cycleMonth } },
    });
    if (existing) return existing;

    const closeDate = new Date(
      Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), 24),
    );
    const dueDate = new Date(
      Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth() + 1, 10),
    );
    return tx.invoice.create({
      data: {
        userId,
        cardId,
        cycleMonth,
        closeDate,
        dueDate,
      },
    });
  }

  private addMonths(date: Date, months: number) {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, date.getUTCDate()),
    );
  }
}
