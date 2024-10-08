import { Module, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { validate } from './env.validation';
import { LoggerErrorInterceptor, LoggerModule } from 'nestjs-pino';
import { IncomingMessage } from 'node:http';
import loggerConfig from './config/logger.config';
import { TransportTargetOptions } from 'pino';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerBehindProxyGuard } from './shared/guards/throttler-behind-proxy.guard';
import { RedisModule } from './shared/modules/redis/redis.module';
import throttlerConfig from './config/throttler.config';
import redisConfig from './config/redis.config';
import { ThrottlerStorageRedisService } from './shared/modules/redis/throttler-storage-redis.service';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { HttpExceptionFilter } from './shared/filters/http-exception-filter';
import { customExceptionFactory } from './shared/helpers/custom-exception-factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate,
      cache: true,
      load: [appConfig, loggerConfig, throttlerConfig, redisConfig],
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
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: customExceptionFactory,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerErrorInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
