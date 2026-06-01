import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const clusterSchema = z.enum(['localnet', 'devnet']).optional();
const pubkeySchema = z.string().min(32);
const bytes32Schema = z.string().min(32);

const baseIntentSchema = z.object({
  cluster: clusterSchema,
  submitImmediately: z.boolean().optional().default(false),
});

export const creditProfileIntentSchema = baseIntentSchema.extend({
  creditLimit: z.number().int().min(0),
  borrower: pubkeySchema.optional(),
});

export const creditLimitIntentSchema = baseIntentSchema.extend({
  creditLimit: z.number().int().min(0),
  borrower: pubkeySchema.optional(),
});

export const cardPurchaseIntentSchema = baseIntentSchema.extend({
  cardTransactionId: z.string().uuid().optional(),
  cardId: z.string().uuid().optional(),
  merchantWallet: pubkeySchema,
  saleId: z.number().int().min(0),
  principalAmount: z.number().int().positive(),
  interestAmount: z.number().int().min(0).default(0),
  dueDate: z.number().int().optional(),
});

export const invoicePaymentIntentSchema = baseIntentSchema.extend({
  invoiceId: z.string().uuid(),
  saleId: z.number().int().min(0).optional(),
  amount: z.number().int().positive().optional(),
  payerUsdc: pubkeySchema.optional(),
  merchantUsdc: pubkeySchema.optional(),
  poolVaultUsdc: pubkeySchema.optional(),
  receivableRecord: pubkeySchema.optional(),
});

export const merchantRegisterIntentSchema = baseIntentSchema.extend({
  storeId: z.string().uuid().optional(),
  settlementUsdc: pubkeySchema,
});

export const receivableMintIntentSchema = baseIntentSchema.extend({
  receivableId: z.string().uuid(),
  saleId: z.number().int().min(0).optional(),
  metadataUri: z.string().url().or(z.string().min(1)),
  assetId: bytes32Schema.optional(),
});

export const receivableAdvanceIntentSchema = baseIntentSchema.extend({
  receivableId: z.string().uuid(),
  root: bytes32Schema.optional(),
  dataHash: bytes32Schema.optional(),
  creatorHash: bytes32Schema.optional(),
  assetDataHash: bytes32Schema.optional(),
  nonce: z.number().int().min(0).optional(),
  index: z.number().int().min(0).optional(),
  flags: z.number().int().min(0).max(255).default(0),
  merchantUsdc: pubkeySchema.optional(),
  poolVaultUsdc: pubkeySchema.optional(),
});

export const submitOnchainIntentSchema = z.object({
  intentId: z.string().uuid(),
  signedTransaction: z.string().min(20),
});

export class CreditProfileIntentDto extends createZodDto(creditProfileIntentSchema) {}
export class CreditLimitIntentDto extends createZodDto(creditLimitIntentSchema) {}
export class CardPurchaseIntentDto extends createZodDto(cardPurchaseIntentSchema) {}
export class InvoicePaymentIntentDto extends createZodDto(invoicePaymentIntentSchema) {}
export class MerchantRegisterIntentDto extends createZodDto(merchantRegisterIntentSchema) {}
export class ReceivableMintIntentDto extends createZodDto(receivableMintIntentSchema) {}
export class ReceivableAdvanceIntentDto extends createZodDto(receivableAdvanceIntentSchema) {}
export class SubmitOnchainIntentDto extends createZodDto(submitOnchainIntentSchema) {}
