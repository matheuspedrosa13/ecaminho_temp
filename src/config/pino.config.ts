import { registerAs } from '@nestjs/config';
import { Level } from 'pino';
import { Environment } from '../shared/enums/environment.enum';

export default registerAs('pino', () => {
  const level: Level = (process.env.PINO_LOG_LEVEL as Level) ?? 'info';
  const isPrettyMode = !!+process.env.PINO_PRETTY_MODE;

  return {
    autoLogging:
      process.env.NODE_ENV == Environment.Test
        ? false
        : !!+process.env.PINO_LOGGING_AUTO,
    level,
    transport: {
      targets: isPrettyMode
        ? [
            {
              level,
              target: 'pino-pretty',
            },
          ]
        : [
            {
              level,
              target: 'pino/file',
              options: { destination: 1 },
            },
          ],
    },
  };
});
