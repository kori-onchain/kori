import { Module } from '@nestjs/common';
import { LedgerModule } from '../ledger/ledger.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { SolanaRelayerService } from './solana-relayer.service';

@Module({
  imports: [LedgerModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, SolanaRelayerService],
})
export class PaymentsModule {}
