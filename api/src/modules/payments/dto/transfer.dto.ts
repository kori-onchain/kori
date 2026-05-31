import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class TransferDto extends createZodDto(
  z.object({
    amountCents: z.number().int().positive(),
    currency: z.enum(['BRL', 'USD', 'EUR', 'SOL', 'USDC']).default('BRL'),
    recipientType: z.enum(['username', 'wallet', 'pix']),
    recipientId: z.string().min(2),
    txHash: z.string().optional(),
    programStatus: z.string().optional(),
  }),
) {}

export class CreateSolanaTransferIntentDto extends createZodDto(
  z.object({
    recipientType: z.enum(['username', 'wallet']),
    recipient: z.string().min(2),
    lamports: z.number().int().positive(),
    anonymous: z.boolean().default(false),
  }),
) {}

export class SubmitSolanaTransferDto extends createZodDto(
  z.object({
    paymentId: z.string().uuid(),
    signedTransaction: z.string().min(20),
  }),
) {}
