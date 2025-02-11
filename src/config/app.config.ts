import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  host: process.env.APP_HOST || '0.0.0.0',
  port: parseInt(process.env.APP_PORT, 10) || 6767,
  cors: {
    origin: process.env.APP_CORS_ALLOWED_ORIGINS?.split(',') || '*',
    methods: process.env.APP_CORS_ALLOWED_METHODS || '*',
    credentials:
      process.env.APP_CORS_ALLOWED_ORIGINS == '*'
        ? false
        : !!+process.env.APP_CORS_ALLOW_CREDENTIALS,
    allowedHeaders: process.env.APP_CORS_ALLOWED_HEADERS || '*',
    maxAge: 24 * 60 * 60,
  } satisfies CorsOptions,
}));
