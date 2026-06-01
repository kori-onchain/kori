import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { CustomLogger } from '../../shared/providers/my-logger.provider';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new CustomLogger(PrismaService.name);

  constructor(private configService: ConfigService) {
    let databaseUrl = configService.get<string>('DATABASE_URL');

    // Strips outer quotes from DATABASE_URL if present
    if (databaseUrl && typeof databaseUrl === 'string') {
      databaseUrl = databaseUrl.replace(/^["']|["']$/g, '');
    }

    const url = databaseUrl || PrismaService.buildConnectionUrl(configService);

    // PrismaPg 7.x is a factory — pass connectionString or PoolConfig directly
    const adapter = new PrismaPg({ connectionString: url, max: 20, idleTimeoutMillis: 30000 });

    const options: any = {
      adapter,
      log: [{ emit: 'event', level: 'error' }],
    };

    super(options);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('🐘 PostgreSQL conectado com sucesso!');
    } catch (error) {
      this.logger.error('🚨 Erro ao conectar no PostgreSQL:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private static buildConnectionUrl(config: ConfigService): string {
    const user = config.get('POSTGRES_USER');
    const pass = config.get('POSTGRES_PASSWORD');
    const host = config.get('POSTGRES_HOST');
    const port = config.get('POSTGRES_PORT');
    const db = config.get('POSTGRES_DB');

    return `postgresql://${user}:${pass}@${host}:${port}/${db}?schema=public`;
  }
}
