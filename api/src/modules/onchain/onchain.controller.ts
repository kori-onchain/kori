import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PrivyAuthGuard } from '../auth/guards/privy-auth.guard';
import {
  CardPurchaseIntentDto,
  CreditLimitIntentDto,
  CreditProfileIntentDto,
  InvoicePaymentIntentDto,
  MerchantRegisterIntentDto,
  ReceivableAdvanceIntentDto,
  ReceivableMintIntentDto,
  SubmitOnchainIntentDto,
} from './dto/onchain.dto';
import { OnchainService } from './onchain.service';

@Controller('onchain')
@UseGuards(PrivyAuthGuard)
export class OnchainController {
  constructor(private readonly onchain: OnchainService) {}

  @Post('intents/credit-profile')
  creditProfile(@Req() req: any, @Body() body: CreditProfileIntentDto) {
    return this.onchain.createCreditProfileIntent(req.user, body);
  }

  @Post('intents/credit-limit')
  creditLimit(@Req() req: any, @Body() body: CreditLimitIntentDto) {
    return this.onchain.createCreditLimitIntent(req.user, body);
  }

  @Post('intents/card-purchase')
  cardPurchase(@Req() req: any, @Body() body: CardPurchaseIntentDto) {
    return this.onchain.createCardPurchaseIntent(req.user, body);
  }

  @Post('intents/invoice-payment')
  invoicePayment(@Req() req: any, @Body() body: InvoicePaymentIntentDto) {
    return this.onchain.createInvoicePaymentIntent(req.user, body);
  }

  @Post('intents/merchant-register')
  merchantRegister(@Req() req: any, @Body() body: MerchantRegisterIntentDto) {
    return this.onchain.createMerchantRegisterIntent(req.user, body);
  }

  @Post('intents/receivable-mint')
  receivableMint(@Req() req: any, @Body() body: ReceivableMintIntentDto) {
    return this.onchain.createReceivableMintIntent(req.user, body);
  }

  @Post('intents/receivable-advance')
  receivableAdvance(@Req() req: any, @Body() body: ReceivableAdvanceIntentDto) {
    return this.onchain.createReceivableAdvanceIntent(req.user, body);
  }

  @Post('submit')
  submit(@Req() req: any, @Body() body: SubmitOnchainIntentDto) {
    return this.onchain.submit(req.user, body);
  }

  @Get('programs/status')
  status() {
    return this.onchain.status();
  }
}
