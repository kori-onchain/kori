import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { CustomLogger } from './shared/providers/my-logger.provider';

async function bootstrap() {
  console.clear();

  const logger = new CustomLogger();

  const app = await NestFactory.create(
    AppModule,
    { logger },
  );

  app.enableShutdownHooks();
  app.useGlobalPipes(new ZodValidationPipe());
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3333;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Server running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
