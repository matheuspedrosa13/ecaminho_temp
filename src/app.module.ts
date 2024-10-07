import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { validate } from './env.validation';
import { LoggerModule } from 'nestjs-pino';
import { IncomingMessage } from 'node:http';
import pinoConfig from './config/pino.config';
import { TransportTargetOptions } from 'pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate,
      cache: true,
      load: [appConfig, pinoConfig],
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
  ],
})
export class AppModule {}
