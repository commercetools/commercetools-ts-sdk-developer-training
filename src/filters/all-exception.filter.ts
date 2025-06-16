import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { isSDKError } from 'src/types/error.type';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // 1. commercetools SDK error
    if (isSDKError(exception)) {
      // console.log('SDK error');
      const statusCode = exception.statusCode || 500;
      const message = exception.message || 'Commercetools SDK Error';
      const errors = Array.isArray(exception.body?.errors)
        ? exception.body.errors.map((e: any) => e.message)
        : undefined;

      return response.status(statusCode).json({
        statusCode,
        message,
        errors,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    // 2. NestJS HttpException
    if (exception instanceof HttpException) {
      // console.log('http error');
      const statusCode = exception.getStatus();
      let message = 'Internal Server Error';
      let errors: string[] | undefined;

      const errorResponse = exception.getResponse();
      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (typeof errorResponse === 'object' && errorResponse !== null) {
        message = (errorResponse as any).message || message;
        if (Array.isArray((errorResponse as any).message)) {
          errors = (errorResponse as any).message;
          message = 'Validation failed';
        }
      }

      return response.status(statusCode).json({
        statusCode,
        message,
        errors,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    // 3. Generic error (e.g. throw new Error('...'))
    if (exception instanceof Error) {
      // console.log('generic error');
      return response.status(500).json({
        statusCode: 500,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    // 4. Unknown error type (just to be safe)
    response.status(500).json({
      statusCode: 500,
      message: 'Unexpected error occurred',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
