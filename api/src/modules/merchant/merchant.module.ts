import { Module } from '@nestjs/common';
import { LedgerModule } from '../ledger/ledger.module';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';

@Module({
  imports: [LedgerModule],
  controllers: [MerchantController],
  providers: [MerchantService],
})
export class MerchantModule {}
