import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ValidationError,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

type ExceptionResponse = { errors?: ValidationError[] };

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const statusCode = exception.getStatus();
    const { errors } = <ExceptionResponse>exception.getResponse();

    response.status(statusCode).send({
      statusCode,
      message:
        statusCode >= HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Internal server error'
          : exception.message,
      errors,
    });
  }
}
