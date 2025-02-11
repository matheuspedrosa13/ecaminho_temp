import { Inject, Injectable } from '@nestjs/common';
import { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';
import { ThrottlerStorageRedis } from './throttler-storage-redis.interface';
import { RedisService } from './redis.service';

@Injectable()
export class ThrottlerStorageRedisService implements ThrottlerStorageRedis {
  @Inject(RedisService)
  readonly redis: RedisService;
  private incrementScript = `
      local hitKey = KEYS[1]
      local blockKey = KEYS[2]
      local throttlerName = ARGV[1]
      local ttl = tonumber(ARGV[2])
      local limit = tonumber(ARGV[3])
      local blockDuration = tonumber(ARGV[4])

      if type(throttlerName) ~= "string" then
          return redis.error_reply("throttlerName must be a string")
      end
      if ttl == nil then
          return redis.error_reply("ttl must be a number")
      end
      if limit == nil then
          return redis.error_reply("limit must be a number")
      end
      if blockDuration == nil then
          return redis.error_reply("blockDuration must be a number")
      end

      local totalHits = redis.call('INCR', hitKey)
      local timeToExpire = redis.call('PTTL', hitKey)
      
      if timeToExpire <= 0 then
        redis.call('PEXPIRE', hitKey, ttl)
        timeToExpire = ttl
      end

      local isBlocked = redis.call('GET', blockKey)
      local timeToBlockExpire = 0

      if isBlocked then
        timeToBlockExpire = redis.call('PTTL', blockKey)
      elseif totalHits > limit then
        redis.call('SET', blockKey, 1, 'PX', blockDuration)
        isBlocked = '1'
        timeToBlockExpire = blockDuration
      end

      if isBlocked and timeToBlockExpire <= 0 then
        redis.call('DEL', blockKey)
        redis.call('SET', hitKey, 1, 'PX', ttl)
        totalHits = 1
        timeToExpire = ttl
        isBlocked = false
      end

      return { totalHits, timeToExpire, isBlocked and 1 or 0, timeToBlockExpire }
    `
    .replace(/^\s+/gm, '')
    .trim();

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const hitKey = `${this.redis.options.keyPrefix}{${key}:${throttlerName}}:hits`;
    const blockKey = `${this.redis.options.keyPrefix}{${key}:${throttlerName}}:blocked`;
    const results = (await this.redis.eval(
      this.incrementScript,
      2,
      hitKey,
      blockKey,
      throttlerName,
      ttl,
      limit,
      blockDuration,
    )) as number[];

    if (!Array.isArray(results)) {
      throw new TypeError(
        `Expected result to be array of values, got ${results}`,
      );
    }

    const [totalHits, timeToExpire, isBlocked, timeToBlockExpire] = results;

    if (typeof totalHits != 'number') {
      throw new TypeError('Expected totalHits to be a number');
    }

    if (typeof timeToExpire != 'number') {
      throw new TypeError('Expected timeToExpire to be a number');
    }

    if (typeof isBlocked != 'number') {
      throw new TypeError('Expected isBlocked to be a number');
    }

    if (typeof timeToBlockExpire != 'number') {
      throw new TypeError('Expected timeToBlockExpire to be a number');
    }

    return {
      totalHits,
      timeToExpire: Math.ceil(timeToExpire / 1000),
      isBlocked: isBlocked === 1,
      timeToBlockExpire: Math.ceil(timeToBlockExpire / 1000),
    };
  }
}
