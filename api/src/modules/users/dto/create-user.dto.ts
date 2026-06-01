import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createUserSchema = z.object({
  privyId: z.string(),
  name: z.string().min(3),
  email: z.string().email(),
  username: z.string().min(3),
  accountType: z.enum(['PF', 'PJ']),
  storeName: z.string().nullable().optional(),
  businessName: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  walletAddress: z.string().nullable().optional(),
  walletIndex: z.number().int().min(0).optional(),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}
