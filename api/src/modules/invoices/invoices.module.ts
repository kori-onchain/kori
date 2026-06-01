import { Module } from '@nestjs/common';
import { InvestmentsModule } from '../investments/investments.module';
import { LedgerModule } from '../ledger/ledger.module';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

@Module({
  imports: [LedgerModule, InvestmentsModule],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
