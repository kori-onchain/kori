import { BadRequestException } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

describe('InvoicesService', () => {
  const userId = 'user-1';
  const invoice = {
    id: 'invoice-1',
    userId,
    cycleMonth: '2026-06',
    totalCents: 50_000,
    paidCents: 0,
    status: 'OPEN',
    items: [],
    installments: [],
    payments: [],
  };

  it('pays an open invoice and writes ledger entries', async () => {
    const ledger = { postEntry: jest.fn() };
    const investments = { recordInvoicePayment: jest.fn() };
    const tx = {
      payment: {
        create: jest.fn().mockResolvedValue({ id: 'payment-1', amountCents: 50_000 }),
      },
      installment: { updateMany: jest.fn().mockResolvedValue({ count: 2 }) },
      invoice: { update: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      invoice: { findFirst: jest.fn().mockResolvedValue(invoice) },
      installment: {
        aggregate: jest.fn().mockResolvedValue({ _sum: { principalCents: 0 } }),
      },
      creditProfile: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      $transaction: jest.fn((cb) => cb(tx)),
    };
    const service = new InvoicesService(prisma as any, ledger as any, investments as any);

    const payment = await service.pay(userId, invoice.id);

    expect(payment.id).toBe('payment-1');
    expect(tx.invoice.update).toHaveBeenCalledWith({
      where: { id: invoice.id },
      data: { paidCents: invoice.totalCents, status: 'PAID' },
    });
    expect(ledger.postEntry).toHaveBeenCalledTimes(2);
    expect(investments.recordInvoicePayment).toHaveBeenCalledWith({
      paymentId: 'payment-1',
      invoiceId: invoice.id,
      amountCents: 50_000,
      cycleMonth: invoice.cycleMonth,
    });
  });

  it('does not pay an already paid invoice', async () => {
    const service = new InvoicesService(
      {
        invoice: {
          findFirst: jest.fn().mockResolvedValue({
            ...invoice,
            paidCents: 50_000,
            status: 'PAID',
          }),
        },
      } as any,
      { postEntry: jest.fn() } as any,
      { recordInvoicePayment: jest.fn() } as any,
    );

    await expect(service.pay(userId, invoice.id)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
