import { Module } from '@nestjs/common';
import { LedgerModule } from '../ledger/ledger.module';
import { OnchainController } from './onchain.controller';
import { OnchainService } from './onchain.service';

@Module({
  imports: [LedgerModule],
  controllers: [OnchainController],
  providers: [OnchainService],
})
export class OnchainModule {}
