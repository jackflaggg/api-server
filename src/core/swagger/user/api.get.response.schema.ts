import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

extendZodWithOpenApi(z);

export const UserGetAPIResponseSchema = z
    .object({
        id: z.string().trim().openapi({ description: 'User ID' }),
        login: z.string().trim().openapi({ description: 'User login' }),
        email: z.string().trim().openapi({ description: 'User email' }),
        createdAt: z.string().trim().openapi({ description: 'Creation date' }),
    })
    .openapi('UserGetResponse', {
        description: 'User response schema',
    });

export class GetResponseAPIUserDto extends createZodDto(UserGetAPIResponseSchema) {}
