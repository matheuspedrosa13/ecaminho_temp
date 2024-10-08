import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyReply } from 'fastify';

interface Response<T> {
  statusCode?: HttpStatus;
  message?: string;
  data?: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse<FastifyReply>();

    return next.handle().pipe(
      map(({ message, data }) => ({
        statusCode: response.statusCode,
        message,
        data,
      })),
    );
  }
}
