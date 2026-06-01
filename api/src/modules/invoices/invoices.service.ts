import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { InvestmentsService } from '../investments/investments.service';
import { LedgerService } from '../ledger/ledger.service';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ledger: LedgerService,
    private readonly investments: InvestmentsService,
  ) {}

  private withPending(invoice: any) {
    if (!invoice) return invoice;
    return {
      ...invoice,
      pendingCents: Math.max((invoice.totalCents ?? 0) - (invoice.paidCents ?? 0), 0),
    };
  }

  async list(userId: string) {
    const invoices = await (this.prisma as any).invoice.findMany({
      where: { userId },
      include: { items: true, card: true },
      orderBy: { dueDate: 'desc' },
    });
    return invoices.map((invoice: any) => this.withPending(invoice));
  }

  async current(userId: string) {
    const now = new Date();
    const cycleMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const invoices = await (this.prisma as any).invoice.findMany({
      where: { userId, cycleMonth, status: { in: ['OPEN', 'CLOSED', 'OVERDUE'] } },
      include: { items: true, card: true },
      orderBy: [{ totalCents: 'desc' }, { createdAt: 'desc' }],
    });
    return invoices.map((invoice: any) => this.withPending(invoice));
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
    return this.withPending(invoice);
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
    await this.investments.recordInvoicePayment({
      paymentId: payment.id,
      invoiceId: invoice.id,
      amountCents: remaining,
      cycleMonth: invoice.cycleMonth,
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
