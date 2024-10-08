import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { LoggerErrorInterceptor, Logger as PinoLogger } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { REQUEST_ID_HEADER } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new FastifyAdapter({
      trustProxy: true,
      logger: false,
      requestIdHeader: REQUEST_ID_HEADER,
      genReqId: () => randomUUID(),
    }),
    { bufferLogs: true },
  );

  app.useLogger(app.get(PinoLogger));

  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  const configService = app.get(ConfigService);

  app.enableShutdownHooks();
  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });
  app.enableCors(configService.get('app.cors'));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('/api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  await app.listen(
    configService.get<number>('app.port'),
    configService.get<string>('app.host'),
  );
}

bootstrap();
