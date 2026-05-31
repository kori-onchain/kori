import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PrivyAuthGuard } from '../auth/guards/privy-auth.guard';
import { LedgerService } from './ledger.service';

@Controller('ledger')
@UseGuards(PrivyAuthGuard)
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get('entries')
  async entries(@Req() req: any) {
    return this.ledgerService.listEntries(req.user.id);
  }
}
