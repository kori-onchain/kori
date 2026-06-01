import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PrivyAuthGuard } from '../auth/guards/privy-auth.guard';
import { InvestmentsService } from './investments.service';

@Controller('investments')
@UseGuards(PrivyAuthGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Get('pool')
  pool(@Req() req: any) {
    return this.investmentsService.poolSummary(req.user.id);
  }

  @Post('pool/invest')
  invest(@Req() req: any, @Body() body: { amountCents: number }) {
    return this.investmentsService.invest(req.user.id, body.amountCents);
  }
}
