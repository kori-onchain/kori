import { Module } from '@nestjs/common';
import { InvestmentsModule } from '../investments/investments.module';
import { LedgerModule } from '../ledger/ledger.module';
import { ReceivablesController } from './receivables.controller';
import { ReceivablesService } from './receivables.service';

@Module({
  imports: [LedgerModule, InvestmentsModule],
  controllers: [ReceivablesController],
  providers: [ReceivablesService],
})
export class ReceivablesModule {}
