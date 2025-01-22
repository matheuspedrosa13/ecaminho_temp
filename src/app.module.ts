import { Module, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { validate } from './env.validation';
import { LoggerErrorInterceptor, LoggerModule } from 'nestjs-pino';
import { IncomingMessage } from 'node:http';
import loggerConfig from './config/logger.config';
import { TransportTargetOptions } from 'pino';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { HttpExceptionFilter } from './shared/filters/http-exception-filter';
import { customExceptionFactory } from './shared/helpers/custom-exception-factory';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AuthGuard } from './shared/guards/auth.guard';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate,
      cache: true,
      load: [appConfig, loggerConfig],
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
        }
      }),
    })
  ],
  providers: [
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
      provide: APP_GUARD,
      useClass: AuthGuard
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
    }
  ]
})
export class AppModule {}
