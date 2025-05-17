import { Request, Response } from 'express';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

type ExceptionResponse = {
    message?: string | string[];
    [key: string]: any;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            let message: string | string[] = exception.message;

            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const er = exceptionResponse as ExceptionResponse;

                if (Array.isArray(er.message)) {
                    message = er.message;
                } else if (er.message) {
                    message = er.message;
                }
            }

            response.status(status).json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message,
            });
            return;
        }

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: 'Internal server error',
        });
    }
}
