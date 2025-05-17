import { z } from 'zod';

export const UserGetResponseSchema = z.object({
    id: z.string().trim(),
    login: z.string().trim(),
    email: z.string().trim(),
    createdAt: z.string().trim(),
});

export namespace UserGetCommand {
    export const ResponseSchema = UserGetResponseSchema;
    export type Response = z.infer<typeof ResponseSchema>;
}
