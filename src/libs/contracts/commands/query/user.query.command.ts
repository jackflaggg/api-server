import { z } from 'zod';
import { sortDirectionEnum } from '../../enums/sort/sort.direction.enum';

const UserQuerySchema = z.object({
    pageNumber: z
        .preprocess(val => {
            if (typeof val === 'string' && val.trim() !== '') return Number(val);
            if (typeof val === 'number') return val;
            return;
        }, z.number().int().positive().default(1))
        .optional(),
    pageSize: z
        .preprocess(val => {
            if (typeof val === 'string' && val.trim() !== '') return Number(val);
            if (typeof val === 'number') return val;
            return;
        }, z.number().int().positive().default(10))
        .optional(),
    searchLoginTerm: z.string().trim().nullable().optional().default(null),
    searchEmailTerm: z.string().trim().nullable().optional().default(null),
    sortBy: z
        .preprocess(val => {
            if (typeof val === 'string') return val.toUpperCase();
            return val;
        }, sortDirectionEnum)
        .optional(),
});

export namespace UserQueryCommand {
    export const RequestSchema = UserQuerySchema;
    export type Request = z.infer<typeof RequestSchema>;
}
