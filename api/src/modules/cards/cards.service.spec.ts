import { BadRequestException } from '@nestjs/common';
import { CardsService } from './cards.service';

describe('CardsService', () => {
  const userId = 'user-1';
  const card = {
    id: 'card-1',
    userId,
    name: 'BRL Black',
    network: 'VISA',
    currency: 'BRL',
    last4: '1234',
    cardNumber: '4532 1111 2222 1234',
    expiry: '08/30',
    cvv: '123',
    isDemo: true,
    isFrozen: false,
    isOnlineEnabled: true,
    status: 'ACTIVE',
    limitTotalCents: 100_000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  function serviceWith(prisma: any, ledger: any = { postEntry: jest.fn() }) {
    return {
      service: new CardsService(prisma, ledger),
      ledger,
    };
  }

  it('blocks purchases on frozen cards', async () => {
    const { service } = serviceWith({
      card: { findFirst: jest.fn().mockResolvedValue({ ...card, isFrozen: true, status: 'FROZEN' }) },
    });

    await expect(
      service.purchase(userId, card.id, {
        merchantName: 'Netflix',
        amountCents: 5_590,
        installmentsCount: 1,
        currency: 'BRL',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('does not lower the limit below open installments', async () => {
    const { service } = serviceWith({
      card: { findFirst: jest.fn().mockResolvedValue(card) },
      installment: {
        aggregate: jest.fn().mockResolvedValue({ _sum: { principalCents: 80_000 } }),
      },
    });

    await expect(service.updateLimit(userId, card.id, 70_000)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('creates installments and ledger entry for a parcelled purchase', async () => {
    const createdInstallments: any[] = [];
    let invoiceSeq = 0;
    const ledger = { postEntry: jest.fn() };
    const tx = {
      invoice: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({ id: `invoice-${++invoiceSeq}`, ...data }),
        ),
        update: jest.fn().mockResolvedValue({}),
      },
      cardTransaction: {
        create: jest.fn().mockResolvedValue({ id: 'tx-1' }),
      },
      installment: {
        create: jest.fn().mockImplementation(({ data }) => {
          createdInstallments.push(data);
          return Promise.resolve({ id: `installment-${createdInstallments.length}`, ...data });
        }),
      },
      invoiceItem: { create: jest.fn().mockResolvedValue({}) },
    };
    const { service } = serviceWith(
      {
        card: {
          findFirst: jest.fn().mockResolvedValue(card),
          findMany: jest.fn().mockResolvedValue([card]),
        },
        installment: {
          aggregate: jest.fn().mockResolvedValue({ _sum: { principalCents: 0 } }),
        },
        creditProfile: { upsert: jest.fn().mockResolvedValue({}) },
        $transaction: jest.fn((cb) => cb(tx)),
      },
      ledger,
    );

    const result = await service.purchase(userId, card.id, {
      merchantName: 'Amazon',
      amountCents: 12_000,
      installmentsCount: 3,
      currency: 'BRL',
    });

    expect(result.installments).toHaveLength(3);
    expect(createdInstallments.map((item) => item.principalCents)).toEqual([
      4_000,
      4_000,
      4_000,
    ]);
    expect(ledger.postEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        accountType: 'CARD_RECEIVABLE',
        amountCents: 12_000,
        referenceType: 'CARD_TRANSACTION',
      }),
    );
  });
});
