import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { LedgerService } from '../ledger/ledger.service';
import {
  CreateMockCardPaymentDto,
  CreateProductDto,
  CreateSaleDto,
  UpdateProductDto,
} from './dto/merchant.dto';

@Injectable()
export class MerchantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ledger: LedgerService,
  ) {}

  async ensureStore(user: any) {
    if (user.accountType !== 'PJ') {
      throw new BadRequestException('Merchant endpoints require a PJ account');
    }
    const store = await (this.prisma as any).store.findFirst({
      where: { ownerUserId: user.id },
      orderBy: { createdAt: 'asc' },
    });
    if (store) return store;

    return (this.prisma as any).store.create({
      data: {
        ownerUserId: user.id,
        name: user.name,
        slug: this.slugify(user.username || user.name),
        settlementWallet: user.walletAddress,
      },
    });
  }

  async listProducts(user: any) {
    const store = await this.ensureStore(user);
    return (this.prisma as any).product.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createProduct(user: any, dto: CreateProductDto) {
    const store = await this.ensureStore(user);
    return (this.prisma as any).product.create({
      data: {
        storeId: store.id,
        ...dto,
      },
    });
  }

  async updateProduct(user: any, id: string, dto: UpdateProductDto) {
    const store = await this.ensureStore(user);
    const product = await this.findProduct(store.id, id);
    return (this.prisma as any).product.update({
      where: { id: product.id },
      data: dto,
    });
  }

  async deleteProduct(user: any, id: string) {
    const store = await this.ensureStore(user);
    const product = await this.findProduct(store.id, id);
    await (this.prisma as any).product.delete({ where: { id: product.id } });
    return { deleted: true };
  }

  async listSales(user: any) {
    const store = await this.ensureStore(user);
    return (this.prisma as any).sale.findMany({
      where: { storeId: store.id },
      include: { items: true, receivables: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSale(user: any, dto: CreateSaleDto) {
    const store = await this.ensureStore(user);
    const amountCents = dto.items.reduce(
      (sum, item) => sum + item.priceCents * item.qty,
      0,
    );
    const netAmountCents = Math.floor(amountCents * 0.97);
    const feeBps = Math.floor(((amountCents - netAmountCents) * 10_000) / amountCents);
    const dueDate = dto.dueDate
      ? new Date(dto.dueDate)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return (this.prisma as any).$transaction(async (tx: any) => {
      const sale = await tx.sale.create({
        data: {
          storeId: store.id,
          buyerUserId: dto.buyerUserId,
          buyerName: dto.buyerName,
          amountCents,
          status: 'PAID',
          txHash: dto.txHash,
          programStatus: dto.programStatus,
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              name: item.name,
              qty: item.qty,
              priceCents: item.priceCents,
            })),
          },
        },
        include: { items: true },
      });

      const receivable = await tx.receivable.create({
        data: {
          storeId: store.id,
          saleId: sale.id,
          description: `Venda ${sale.id}`,
          grossAmountCents: amountCents,
          netAmountCents,
          feeBps,
          installmentsCount: dto.installmentsCount,
          dueDate,
          status: 'REGISTERED',
          txHash: dto.txHash,
          programStatus: dto.programStatus,
        },
      });

      return { ...sale, receivable };
    });
  }

  async createMockCardPayment(user: any, dto: CreateMockCardPaymentDto) {
    const store = await this.ensureStore(user);
    const buyer = await (this.prisma as any).user.findFirst({
      where: { privyId: user.privyId, accountType: 'PF' },
      orderBy: { createdAt: 'asc' },
    });
    if (!buyer) {
      throw new BadRequestException('No PF buyer account found for this mock payment');
    }

    const card = await (this.prisma as any).card.findFirst({
      where: {
        userId: buyer.id,
        status: 'ACTIVE',
        isFrozen: false,
        isOnlineEnabled: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    if (!card) {
      throw new BadRequestException('No active buyer card available for mock payment');
    }

    const used = await this.openPrincipalCents(buyer.id, card.id);
    if (used + dto.amountCents > card.limitTotalCents) {
      throw new BadRequestException('Credit limit exceeded');
    }

    const product = dto.productId
      ? await (this.prisma as any).product.findFirst({
          where: { id: dto.productId, storeId: store.id },
        })
      : null;
    const itemName =
      product?.name || dto.productName || `Venda presencial ${store.name}`;
    const feeBps = 300;

    const result = await (this.prisma as any).$transaction(async (tx: any) => {
      const firstInvoice = await this.ensureInvoiceTx(
        tx,
        buyer.id,
        card.id,
        new Date(),
      );
      const sale = await tx.sale.create({
        data: {
          storeId: store.id,
          buyerUserId: buyer.id,
          buyerName: dto.buyerName || buyer.name || buyer.username,
          amountCents: dto.amountCents,
          status: 'PAID',
          programStatus: 'OFFCHAIN_CARD_MOCK',
          items: {
            create: [
              {
                productId: product?.id,
                name: itemName,
                qty: 1,
                priceCents: dto.amountCents,
              },
            ],
          },
        },
        include: { items: true },
      });

      const transaction = await tx.cardTransaction.create({
        data: {
          userId: buyer.id,
          cardId: card.id,
          invoiceId: firstInvoice.id,
          merchantName: store.name,
          amountCents: dto.amountCents,
          currency: 'BRL',
          installmentsCount: dto.installmentsCount,
          saleId: sale.id,
          programStatus: 'OFFCHAIN_CARD_MOCK',
        },
      });

      let remaining = dto.amountCents;
      const base = Math.floor(dto.amountCents / dto.installmentsCount);
      const installments = [];
      const receivables = [];

      for (let i = 1; i <= dto.installmentsCount; i += 1) {
        const amount =
          i === dto.installmentsCount ? remaining : Math.min(base, remaining);
        remaining -= amount;
        const dueDate = this.addMonths(firstInvoice.dueDate, i - 1);
        const invoice = await this.ensureInvoiceTx(tx, buyer.id, card.id, dueDate);
        const installment = await tx.installment.create({
          data: {
            userId: buyer.id,
            cardTransactionId: transaction.id,
            invoiceId: invoice.id,
            number: i,
            total: dto.installmentsCount,
            principalCents: amount,
            dueDate,
            saleId: sale.id,
            programStatus: 'OFFCHAIN_CARD_MOCK',
          },
        });
        await tx.invoiceItem.create({
          data: {
            invoiceId: invoice.id,
            cardTransactionId: transaction.id,
            installmentId: installment.id,
            description: `${store.name} ${i}/${dto.installmentsCount}`,
            amountCents: amount,
          },
        });
        await tx.invoice.update({
          where: { id: invoice.id },
          data: { totalCents: { increment: amount } },
        });

        const netAmountCents = Math.floor(amount * 0.97);
        const receivable = await tx.receivable.create({
          data: {
            storeId: store.id,
            saleId: sale.id,
            description: `${itemName} - parcela ${i}/${dto.installmentsCount}`,
            grossAmountCents: amount,
            netAmountCents,
            feeBps,
            installmentsCount: dto.installmentsCount,
            installmentNumber: i,
            installmentId: installment.id,
            dueDate,
            status: 'REGISTERED',
            programStatus: 'OFFCHAIN_CARD_MOCK',
          },
        });
        await tx.installment.update({
          where: { id: installment.id },
          data: { receivableId: receivable.id },
        });
        installments.push(installment);
        receivables.push(receivable);
      }

      await this.syncCreditProfileTx(tx, buyer.id);

      return { sale, transaction, installments, receivables };
    });

    await this.ledger.postEntry({
      userId: buyer.id,
      accountType: 'CARD_RECEIVABLE',
      currency: 'BRL',
      direction: 'CREDIT',
      amountCents: dto.amountCents,
      referenceType: 'CARD_TRANSACTION',
      referenceId: result.transaction.id,
      description: `Compra ${store.name}`,
    });

    const lockedLimitCents = await this.openPrincipalCents(buyer.id);

    return {
      status: 'APPROVED',
      card: {
        id: card.id,
        last4: card.last4,
        network: card.network,
      },
      sale: result.sale,
      transaction: result.transaction,
      installments: result.installments,
      receivables: result.receivables,
      credit: {
        limitTotalCents: card.limitTotalCents,
        lockedLimitCents,
        limitAvailableCents: Math.max(card.limitTotalCents - lockedLimitCents, 0),
      },
    };
  }

  private async findProduct(storeId: string, id: string) {
    const product = await (this.prisma as any).product.findFirst({
      where: { id, storeId },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  private slugify(value: string) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48);
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

  private async syncCreditProfileTx(tx: any, userId: string) {
    const cards = await tx.card.findMany({
      where: { userId, status: { not: 'CANCELED' } },
    });
    const creditLimitCents = cards.reduce(
      (sum: number, card: any) => sum + card.limitTotalCents,
      0,
    );
    const result = await tx.installment.aggregate({
      where: { userId, status: 'OPEN' },
      _sum: { principalCents: true },
    });
    const lockedLimitCents = result._sum.principalCents ?? 0;
    await tx.creditProfile.upsert({
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
