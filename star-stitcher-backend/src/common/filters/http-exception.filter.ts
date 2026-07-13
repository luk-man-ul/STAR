import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const resBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal Server Error' };

    const errorDetails = typeof resBody === 'string' ? { message: resBody } : (resBody as any);

    // Hide sensitive query details in production error responses
    const isProduction = process.env.NODE_ENV === 'production';
    const message = errorDetails.message || exception.message || 'Internal Server Error';
    const errorType = errorDetails.error || (exception.name || 'InternalServerError');

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: status === HttpStatus.INTERNAL_SERVER_ERROR && isProduction ? 'An unexpected error occurred.' : message,
      error: errorType,
    });
  }
}
