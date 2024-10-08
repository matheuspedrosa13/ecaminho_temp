import { registerAs } from '@nestjs/config';

export default registerAs('throttlers', () => [
  {
    ttl: +process.env.THROTTLER_TTL || 60000,
    limit: +process.env.THROTTLER_LIMIT || 10,
  },
]);
