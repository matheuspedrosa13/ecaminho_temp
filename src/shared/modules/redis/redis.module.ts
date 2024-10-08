import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './redis.module-definition';
import { RedisService } from './redis.service';
import { ThrottlerStorageRedisService } from './throttler-storage-redis.service';

@Module({
  providers: [RedisService, ThrottlerStorageRedisService],
  exports: [RedisService, ThrottlerStorageRedisService],
})
export class RedisModule extends ConfigurableModuleClass {}
