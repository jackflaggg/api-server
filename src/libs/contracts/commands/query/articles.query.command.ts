import { z } from 'zod';
import { sortDirectionEnum } from '../../enums/sort/sort.direction.enum';
import { createZodDto } from 'nestjs-zod';
const preprocessDate = z.preprocess((val) => {
    if (typeof val === 'string' && val.trim() !== '') {
        const d = new Date(val);
        if (!isNaN(d.getTime())) return d.toISOString();
    }
    return undefined;
}, z.string().datetime().optional());

export const ArticleQuerySchema = z.object({
    pageNumber: z.preprocess(val => {
        if (typeof val === 'string' && val.trim() !== '') return Number(val);
        if (typeof val === 'number') return val;
        return undefined;
    }, z.number().int().positive().default(1)).optional(),

    pageSize: z.preprocess(val => {
        if (typeof val === 'string' && val.trim() !== '') return Number(val);
        if (typeof val === 'number') return val;
        return undefined;
    }, z.number().int().positive().max(100).default(10)).optional(),

    authorId: z.string().uuid().optional(),

    dateFrom: preprocessDate.optional().nullable().default(null),

    dateTo: preprocessDate.optional().nullable().default(null),

    searchTitleTerm: z.string().trim().nullable().optional().default(null),

    sortBy: z.enum(['title', 'createdAt']).optional().default('createdAt'),

    sortDirection: z.preprocess(val => {
        if (typeof val === 'string') return val.toUpperCase();
        return val;
    }, sortDirectionEnum).optional().default('DESC'),
});

export namespace ArticleQueryCommand {
    export const RequestSchema = ArticleQuerySchema;
    export type Request = z.infer<typeof RequestSchema>;
}

export class ArticlesQuery extends createZodDto(ArticleQueryCommand.RequestSchema) {}