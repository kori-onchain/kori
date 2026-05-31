import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class UpdateCreditLimitDto extends createZodDto(
  z.object({
    creditLimitCents: z.number().int().min(0),
  }),
) {}
