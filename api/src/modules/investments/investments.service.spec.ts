import { BadRequestException } from '@nestjs/common';
import { InvestmentsService } from './investments.service';

describe('InvestmentsService', () => {
  const config = { get: jest.fn().mockReturnValue(undefined) };

  it('records a user investment and returns the updated pool', async () => {
    const userAccount = { id: 'user-ledger', balanceCents: 0 };
    const platformAccount = { id: 'platform-ledger', balanceCents: 0 };
    const ledger = {
      ensureAccount: jest.fn((userId: string | null) =>
        Promise.resolve(userId ? userAccount : platformAccount),
      ),
      postEntry: jest.fn().mockResolvedValue({}),
    };
    const prisma = {
      payment: {
        create: jest.fn().mockResolvedValue({
          id: 'payment-1',
          status: 'COMPLETED',
          amountCents: 25_000,
          currency: 'BRL',
        }),
      },
      ledgerEntry: {
        findMany: jest
          .fn()
          .mockResolvedValueOnce([
            {
              direction: 'DEBIT',
              amountCents: 25_000,
              referenceType: 'POOL_USER_INVESTMENT',
              referenceId: 'payment-1',
              description: 'Investimento',
            },
          ])
          .mockResolvedValueOnce([
            {
              direction: 'CREDIT',
              amountCents: 25_000,
              referenceType: 'POOL_USER_INVESTMENT',
              referenceId: 'payment-1',
              description: 'Investimento',
            },
          ])
          .mockResolvedValueOnce([
            {
              direction: 'DEBIT',
              amountCents: 25_000,
              referenceType: 'POOL_USER_INVESTMENT',
              referenceId: 'payment-1',
              description: 'Investimento',
            },
          ]),
      },
    };
    const service = new InvestmentsService(
      prisma as any,
      ledger as any,
      config as any,
    );

    const result = await service.invest('user-1', 25_000);

    expect(result.userInvestedCents).toBe(25_000);
    expect(result.pool.userInvestedCents).toBe(25_000);
    expect(ledger.postEntry).toHaveBeenCalledTimes(2);
    expect(ledger.postEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        accountType: 'USER_BALANCE',
        direction: 'DEBIT',
        referenceType: 'POOL_USER_INVESTMENT',
      }),
    );
  });

  it('rejects invalid investment amounts', async () => {
    const service = new InvestmentsService(
      {} as any,
      {} as any,
      config as any,
    );

    await expect(service.invest('user-1', 0)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('records only principal repayment and spread as pool yield for invoice payment', async () => {
    const ledger = {
      ensureAccount: jest.fn().mockResolvedValue({ id: 'platform-ledger', balanceCents: 0 }),
      postEntry: jest.fn().mockResolvedValue({}),
    };
    const prisma = {
      installment: {
        findMany: jest.fn().mockResolvedValue([{ receivableId: 'receivable-1' }]),
      },
      receivableAdvance: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'advance-1',
            receivableId: 'receivable-1',
            provider: 'POOL',
            status: 'COMPLETED',
            netCents: 97_000,
            feeCents: 3_000,
          },
        ]),
      },
    };
    const service = new InvestmentsService(
      prisma as any,
      ledger as any,
      config as any,
    );

    await service.recordInvoicePayment({
      paymentId: 'payment-1',
      invoiceId: 'invoice-1',
      amountCents: 100_000,
      cycleMonth: '2026-06',
    });

    expect(ledger.postEntry).toHaveBeenCalledTimes(2);
    expect(ledger.postEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        amountCents: 97_000,
        referenceType: 'POOL_RECEIVABLE_REPAYMENT',
      }),
    );
    expect(ledger.postEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        amountCents: 3_000,
        referenceType: 'POOL_RECEIVABLE_YIELD',
      }),
    );
    expect(ledger.postEntry).not.toHaveBeenCalledWith(
      expect.objectContaining({
        amountCents: 100_000,
        referenceType: 'POOL_INVOICE_PAYMENT',
      }),
    );
  });

  it('does not generate pool yield when an invoice has no advanced receivables', async () => {
    const ledger = {
      ensureAccount: jest.fn().mockResolvedValue({ id: 'platform-ledger', balanceCents: 0 }),
      postEntry: jest.fn().mockResolvedValue({}),
    };
    const prisma = {
      installment: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };
    const service = new InvestmentsService(
      prisma as any,
      ledger as any,
      config as any,
    );

    const entries = await service.recordInvoicePayment({
      paymentId: 'payment-1',
      invoiceId: 'invoice-1',
      amountCents: 100_000,
      cycleMonth: '2026-06',
    });

    expect(entries).toEqual([]);
    expect(ledger.postEntry).not.toHaveBeenCalled();
  });
});
