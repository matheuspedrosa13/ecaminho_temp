import { SetMetadata } from '@nestjs/common';

export const REQUEST_ID_HEADER = 'X-Request-ID';
export const jwtConstants = { secret: "ecaminhojwtsecretkey" }

export const IS_PUBLIC_KEY = 'isPublic';
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);