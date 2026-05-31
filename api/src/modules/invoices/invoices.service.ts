import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { LedgerService } from '../ledger/ledger.service';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ledger: LedgerService,
  ) {}

  async list(userId: string) {
    return (this.prisma as any).invoice.findMany({
      where: { userId },
      include: { items: true, card: true },
      orderBy: { dueDate: 'desc' },
    });
  }

  async current(userId: string) {
    const now = new Date();
    const cycleMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    return (this.prisma as any).invoice.findMany({
      where: { userId, cycleMonth, status: { in: ['OPEN', 'CLOSED', 'OVERDUE'] } },
      include: { items: true, card: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const invoice = await (this.prisma as any).invoice.findFirst({
      where: { id, userId },
      include: {
        items: true,
        card: true,
        installments: true,
        payments: true,
      },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async pay(userId: string, invoiceId: string) {
    const invoice = await this.findOne(userId, invoiceId);
    const remaining = invoice.totalCents - invoice.paidCents;
    if (remaining <= 0 || invoice.status === 'PAID') {
      throw new BadRequestException('Invoice is already paid');
    }

    const payment = await (this.prisma as any).$transaction(async (tx: any) => {
      const created = await tx.payment.create({
        data: {
          userId,
          invoiceId,
          amountCents: remaining,
          currency: 'BRL',
          method: 'INTERNAL_LEDGER',
          status: 'COMPLETED',
        },
      });

      await tx.installment.updateMany({
        where: { invoiceId, userId, status: 'OPEN' },
        data: { status: 'PAID' },
      });

      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          paidCents: invoice.totalCents,
          status: 'PAID',
        },
      });

      return created;
    });

    await this.ledger.postEntry({
      userId,
      accountType: 'USER_BALANCE',
      direction: 'DEBIT',
      amountCents: remaining,
      referenceType: 'INVOICE_PAYMENT',
      referenceId: payment.id,
      description: `Pagamento de fatura ${invoice.cycleMonth}`,
    });
    await this.ledger.postEntry({
      userId,
      accountType: 'CARD_RECEIVABLE',
      direction: 'DEBIT',
      amountCents: remaining,
      referenceType: 'INVOICE_PAYMENT',
      referenceId: payment.id,
      description: `Baixa de fatura ${invoice.cycleMonth}`,
    });

    const locked = await (this.prisma as any).installment.aggregate({
      where: { userId, status: 'OPEN' },
      _sum: { principalCents: true },
    });
    await (this.prisma as any).creditProfile.updateMany({
      where: { userId },
      data: { lockedLimitCents: locked._sum.principalCents ?? 0 },
    });

    return payment;
  }
}
