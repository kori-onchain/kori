import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { PrivyAuthGuard } from '../auth/guards/privy-auth.guard';
import { CreditService } from './credit.service';
import { UpdateCreditLimitDto } from './dto/update-credit-limit.dto';

@Controller('credit')
@UseGuards(PrivyAuthGuard)
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @Get('profile')
  profile(@Req() req: any) {
    return this.creditService.getProfile(req.user.id);
  }

  @Put('profile/limit')
  limit(@Req() req: any, @Body() body: UpdateCreditLimitDto) {
    return this.creditService.setLimit(req.user.id, body.creditLimitCents);
  }

  @Get('score')
  score(@Req() req: any) {
    return this.creditService.getScore(req.user.id);
  }
}
