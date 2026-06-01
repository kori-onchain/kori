import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PrivyAuthGuard } from '../auth/guards/privy-auth.guard';
import { ReceivablesService } from './receivables.service';

@Controller('receivables')
@UseGuards(PrivyAuthGuard)
export class ReceivablesController {
  constructor(private readonly receivablesService: ReceivablesService) {}

  @Get()
  list(@Req() req: any) {
    return this.receivablesService.list(req.user);
  }

  @Post(':id/advance')
  advance(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { provider?: 'KORI' | 'POOL' | 'P2P' },
  ) {
    return this.receivablesService.advance(req.user, id, body?.provider);
  }

  @Get('advances/:id')
  advanceById(@Req() req: any, @Param('id') id: string) {
    return this.receivablesService.findAdvance(req.user, id);
  }
}
