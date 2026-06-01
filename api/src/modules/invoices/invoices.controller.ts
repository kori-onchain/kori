import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PrivyAuthGuard } from '../auth/guards/privy-auth.guard';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
@UseGuards(PrivyAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  list(@Req() req: any) {
    return this.invoicesService.list(req.user.id);
  }

  @Get('current')
  current(@Req() req: any) {
    return this.invoicesService.current(req.user.id);
  }

  @Get(':id')
  find(@Req() req: any, @Param('id') id: string) {
    return this.invoicesService.findOne(req.user.id, id);
  }

  @Post(':id/pay')
  pay(@Req() req: any, @Param('id') id: string) {
    return this.invoicesService.pay(req.user.id, id);
  }
}
