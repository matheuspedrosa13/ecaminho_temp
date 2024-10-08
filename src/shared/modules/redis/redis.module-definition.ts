import { ConfigurableModuleBuilder } from '@nestjs/common';
import { RedisModuleOptions } from './interfaces/redis-module-options.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<RedisModuleOptions>().build();
