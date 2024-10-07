import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsIP,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { Environment } from './shared/enums/environment.enum';
import { Level } from 'pino';

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsIP()
  APP_HOST: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  APP_PORT: number;

  @IsString()
  APP_CORS_ORIGINS: string;

  @IsString()
  APP_CORS_METHODS: string;

  @IsString()
  APP_CORS_HEADERS: string;

  @IsIn(['0', '1'])
  APP_CORS_ALLOW_CREDENTIALS: string;

  @IsBoolean()
  PINO_LOGGING_AUTO: boolean;

  @IsString()
  PINO_LOG_LEVEL: Level;

  @IsIn(['0', '1'])
  PINO_PRETTY_MODE: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
