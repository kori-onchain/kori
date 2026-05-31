import { BadRequestException } from '@nestjs/common';
import { ReceivablesService } from './receivables.service';

describe('ReceivablesService', () => {
  const merchant = { id: 'merchant-1', accountType: 'PJ' };
  const receivable = {
    id: 'receivable-1',
    storeId: 'store-1',
    grossAmountCents: 100_000,
    netAmountCents: 97_000,
    status: 'REGISTERED',
    programStatus: null,
  };

  it('requires a PJ account', async () => {
    const service = new ReceivablesService({} as any, { postEntry: jest.fn() } as any);

    await expect(service.list({ id: 'pf-1', accountType: 'PF' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('advances a registered receivable and credits merchant ledger', async () => {
    const ledger = { postEntry: jest.fn() };
    const tx = {
      receivable: { update: jest.fn().mockResolvedValue({}) },
      receivableAdvance: {
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({ id: 'advance-1', ...data }),
        ),
      },
    };
    const prisma = {
      store: { findFirst: jest.fn().mockResolvedValue({ id: 'store-1' }) },
      receivable: { findFirst: jest.fn().mockResolvedValue(receivable) },
      $transaction: jest.fn((cb) => cb(tx)),
    };
    const service = new ReceivablesService(prisma as any, ledger as any);

    const advance = await service.advance(merchant, receivable.id);

    expect(advance.netCents).toBe(97_000);
    expect(tx.receivable.update).toHaveBeenCalledWith({
      where: { id: receivable.id },
      data: { status: 'ANTICIPATED' },
    });
    expect(ledger.postEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        accountType: 'MERCHANT_BALANCE',
        direction: 'CREDIT',
        amountCents: 97_000,
      }),
    );
  });
});
