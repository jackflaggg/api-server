import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { ApiOperation } from '@nestjs/swagger';
/**
 * Swagger decorator for POST endpoints
 * @swagger
 * @response 201 - Successfully created
 * @response 400 - Bad request
 * @response 401 - Unauthorized (only when authStatus is WithAuth)
 */
export const SwaggerPostCreate = (summary: string, CreatedResponseDto: any, authStatus: string) => {
    const decorators = [ApiOperation({ summary }), ApiCreatedResponse({ type: CreatedResponseDto, description: 'Created' })];

    if (authStatus === 'WithAuth') {
        decorators.push(ApiUnauthorizedResponse({ description: 'Unauthorized' }));
    }
    return applyDecorators(...decorators);
};

/**
 * Swagger decorator for POST endpoints that can return 404 Not Found
 * @swagger
 * @response 201 - Successfully created
 * @response 400 - Bad request
 * @response 401 - Unauthorized (only when authStatus is WithAuth)
 * @response 404 - Not found
 */
export const SwaggerPostCreateWith404 = (summary: string, CreatedResponseDto: any, authStatus: string) => {
    const decorators = [
        ApiOperation({ summary }),
        ApiCreatedResponse({ type: CreatedResponseDto, description: 'Created' }),
        ApiNotFoundResponse({ description: 'Not found' }),
    ];

    if (authStatus === 'WithAuth') {
        decorators.push(ApiUnauthorizedResponse({ description: 'Unauthorized' }));
    }
    return applyDecorators(...decorators);
};
