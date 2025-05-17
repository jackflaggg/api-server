import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';

/**
 * Swagger decorator for GET endpoints
 * @swagger
 * @response 200 - Success
 * @response 401 - Unauthorized (only when authStatus is WithAuth)
 */
export const SwaggerGet = (
    summary: string,
    OkResponseDto: any,
    authStatus: string,
    examples?: Record<string, { summary: string; value: any }>,
) => {
    const decorators = [
        ApiOperation({ summary }),
        ApiOkResponse({ type: OkResponseDto, description: 'Success', ...(examples ? { examples } : {}) }),
    ];

    if (authStatus === 'WithAuth') {
        decorators.push(ApiUnauthorizedResponse({ description: 'Unauthorized' }));
    }
    return applyDecorators(...decorators);
};

/**
 * Swagger decorator for GET endpoints
 * @swagger
 * @response 200 - Success
 * @response 401 - Unauthorized (only when authStatus is WithAuth)
 * @response 404 - Not found
 */
export const SwaggerGetWith404 = (summary: string, OkResponseDto: any, authStatus: string) => {
    const decorators = [
        ApiOperation({ summary }),
        ApiOkResponse({ type: OkResponseDto, description: 'Success' }),
        ApiNotFoundResponse({ description: 'Not Found' }),
    ];

    if (authStatus === 'WithAuth') {
        decorators.push(ApiUnauthorizedResponse({ description: 'Unauthorized' }));
    }
    return applyDecorators(...decorators);
};
