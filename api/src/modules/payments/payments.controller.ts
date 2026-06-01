import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PrivyAuthGuard } from '../auth/guards/privy-auth.guard';
import {
  CreateSolanaTransferIntentDto,
  SubmitSolanaTransferDto,
  TransferDto,
} from './dto/transfer.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
@UseGuards(PrivyAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('transfer')
  transfer(@Req() req: any, @Body() body: TransferDto) {
    return this.paymentsService.transfer(req.user.id, body);
  }

  @Post('solana/intent')
  solanaIntent(
    @Req() req: any,
    @Body() body: CreateSolanaTransferIntentDto,
  ) {
    return this.paymentsService.createSolanaIntent(req.user, body);
  }

  @Post('solana/submit')
  solanaSubmit(@Req() req: any, @Body() body: SubmitSolanaTransferDto) {
    return this.paymentsService.submitSolanaTransfer(req.user.id, body);
  }

  @Get(':id')
  find(@Req() req: any, @Param('id') id: string) {
    return this.paymentsService.findOne(req.user.id, id);
  }
}
