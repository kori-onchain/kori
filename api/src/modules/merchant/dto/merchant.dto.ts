import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  category: z.string().default('Other'),
  priceCents: z.number().int().positive(),
  imageUrl: z.string().url().optional(),
  isNft: z.boolean().default(false),
  nftLabel: z.string().optional(),
});

export const updateProductSchema = productSchema.partial();

export const createSaleSchema = z.object({
  buyerName: z.string().min(2),
  buyerUserId: z.string().optional(),
  installmentsCount: z.number().int().min(1).max(32).default(1),
  dueDate: z.string().datetime().optional(),
  txHash: z.string().optional(),
  programStatus: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().optional(),
      name: z.string().min(1),
      qty: z.number().int().positive(),
      priceCents: z.number().int().positive(),
    }),
  ).min(1),
});

export const createMockCardPaymentSchema = z.object({
  amountCents: z.number().int().positive(),
  installmentsCount: z.number().int().min(1).max(12).default(1),
  cardType: z.literal('credit').default('credit'),
  productId: z.string().optional(),
  productName: z.string().min(1).optional(),
  buyerName: z.string().min(2).optional(),
});

export class CreateProductDto extends createZodDto(productSchema) {}
export class UpdateProductDto extends createZodDto(updateProductSchema) {}
export class CreateSaleDto extends createZodDto(createSaleSchema) {}
export class CreateMockCardPaymentDto extends createZodDto(createMockCardPaymentSchema) {}
