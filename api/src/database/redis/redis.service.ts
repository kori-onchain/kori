import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomLogger } from '../../shared/providers/my-logger.provider';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  private readonly logger = new CustomLogger(RedisService.name);

  constructor(private configService: ConfigService) {
    super({
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
      password: configService.get<string>('REDIS_PASSWORD'),
    });

    this.on('connect', () => {
      this.logger.log('🚀 Redis conectado com sucesso!');
    });

    this.on('error', (err) => {
      this.logger.error('🚨 Erro no Redis:', err.message);
    });
  }

  onModuleDestroy() {
    this.disconnect();
  }
}
