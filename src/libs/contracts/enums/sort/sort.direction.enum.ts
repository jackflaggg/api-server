import { z } from 'zod';

export const sortDirectionEnum = z.enum(['ASC', 'DESC']);
export type sortDirectionType = z.infer<typeof sortDirectionEnum>;
export const sortDirectionValues = sortDirectionEnum.options;
