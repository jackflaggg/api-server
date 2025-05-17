import { z } from 'zod';

export const entitiesSortBy = z.enum(['createdAt', 'title', 'login', 'email', 'name', 'description']);
export type entitiesSortByEnum = z.infer<typeof entitiesSortBy>;
export const sortByValues = entitiesSortBy.options;
