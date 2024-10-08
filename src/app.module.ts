import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { validate } from './env.validation';
import { LoggerModule } from 'nestjs-pino';
import { IncomingMessage } from 'node:http';
import pinoConfig from './config/pino.config';
import { TransportTargetOptions } from 'pino';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerBehindProxyGuard } from './shared/guards/throttler-behind-proxy.guard';
import { RedisModule } from './shared/modules/redis/redis.module';
import throttlersConfig from './config/throttlers.config';
import redisConfig from './config/redis.config';
import { ThrottlerStorageRedisService } from './shared/modules/redis/throttler-storage-redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate,
      cache: true,
      load: [appConfig, pinoConfig, throttlersConfig, redisConfig],
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          autoLogging: configService.get('pino.autoLogging'),
          redact: {
            paths: ['req.headers.authorization', 'req.headers.cookie'],
          },
          customProps: ({ userId }: IncomingMessage & { userId: string }) => ({
            context: 'HTTP',
            userId,
          }),
          level: configService.get<string>('pino.level'),
          transport: {
            targets: configService.get<TransportTargetOptions[]>(
              'pino.transport.targets',
            ),
          },
        },
        exclude: [{ method: RequestMethod.GET, path: 'health' }],
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [
        RedisModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            configService.get('redis'),
        }),
      ],
      useFactory: (
        configService: ConfigService,
        throttlerStorageRedisService: ThrottlerStorageRedisService,
      ) => ({
        throttlers: configService.get('throttlers'),
        storage: throttlerStorageRedisService,
      }),
      inject: [ConfigService, ThrottlerStorageRedisService],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
