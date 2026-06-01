import { Module } from '@nestjs/common';
import { LedgerModule } from '../ledger/ledger.module';
import { ReceivablesController } from './receivables.controller';
import { ReceivablesService } from './receivables.service';

@Module({
  imports: [LedgerModule],
  controllers: [ReceivablesController],
  providers: [ReceivablesService],
})
export class ReceivablesModule {}
