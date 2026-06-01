import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const currencySchema = z.enum(['BRL', 'USD', 'EUR', 'USDC']);
export const networkSchema = z.enum(['VISA', 'MASTERCARD']);

export const createCardSchema = z.object({
  name: z.string().min(2),
  network: networkSchema.default('VISA'),
  currency: currencySchema.default('BRL'),
  limitTotalCents: z.number().int().min(0).default(0),
});

export const updateLimitSchema = z.object({
  limitTotalCents: z.number().int().min(0),
});

export const createPurchaseSchema = z.object({
  merchantName: z.string().min(2),
  amountCents: z.number().int().positive(),
  installmentsCount: z.number().int().min(1).max(32).default(1),
  currency: currencySchema.default('BRL'),
  saleId: z.string().optional(),
  txHash: z.string().optional(),
  programStatus: z.string().optional(),
});

export class CreateCardDto extends createZodDto(createCardSchema) {}
export class UpdateCardLimitDto extends createZodDto(updateLimitSchema) {}
export class CreatePurchaseDto extends createZodDto(createPurchaseSchema) {}
