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

    // Check if exception is an instance of HttpException
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const errors = isSDKError(exception)
      ? exception.body?.errors
      : exception.getResponse().message;

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      errors,
    });
  }
}
