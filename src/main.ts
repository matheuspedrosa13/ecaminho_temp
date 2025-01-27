import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { RequestMethod, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { Logger as PinoLogger } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { REQUEST_ID_HEADER } from './constants';
//import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

// async function getSwaggerDocumentBuilder(){
//   const config = new DocumentBuilder()
//     .setTitle('API - É Caminho ')
//     .setDescription('"É Caminho" is an app that enables employees to get rides to their destinations! In this api, you can register')
//     .setVersion('1.0')
//     .addTag('ecaminho')
//     .build();
//   return config
// }

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
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  const port = configService.get<number>('app.port') || 6767;
  const host = configService.get<string>('app.host') || '0.0.0.0';
  await app.listen(port, host);

  console.log(`Application is running on: http://${host}:${port}`);
}

bootstrap();


//   const options: SwaggerDocumentOptions =  {
//     operationIdFactory: (
//       controllerKey: string,
//       methodKey: string,
      
//     ) => methodKey
//   };

//   const config = await getSwaggerDocumentBuilder(); 
//   const documentFactory = () => SwaggerModule.createDocument(app, config, options);
//   SwaggerModule.setup('api/v1/swagger', app, documentFactory);

//   await app.listen(
//     configService.get<number>('app.port'),
//     configService.get<string>('app.host'),
//   );

