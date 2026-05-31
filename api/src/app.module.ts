import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma/prisma.module';
import { RedisModule } from './database/redis/redis.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { LedgerModule } from './modules/ledger/ledger.module';
import { CardsModule } from './modules/cards/cards.module';
import { CreditModule } from './modules/credit/credit.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { MerchantModule } from './modules/merchant/merchant.module';
import { ReceivablesModule } from './modules/receivables/receivables.module';
import { OnchainModule } from './modules/onchain/onchain.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),
    SharedModule,
    PrismaModule,
    RedisModule,
    UsersModule,
    AuthModule,
    LedgerModule,
    CardsModule,
    CreditModule,
    InvoicesModule,
    PaymentsModule,
    MerchantModule,
    ReceivablesModule,
    OnchainModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
