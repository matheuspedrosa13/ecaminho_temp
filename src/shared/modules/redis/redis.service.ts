import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { MODULE_OPTIONS_TOKEN } from './redis.module-definition';
import { RedisModuleOptions } from './interfaces/redis-module-options.interface';

@Injectable()
export class RedisService extends Redis {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) readonly moduleOptions: RedisModuleOptions,
  ) {
    super(moduleOptions);
  }
}
