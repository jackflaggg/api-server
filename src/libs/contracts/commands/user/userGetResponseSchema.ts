import { z } from 'zod';

export const getUserCommand = {
    id: z.string().trim(),
    login: z.string().trim(),
    email: z.string().trim(),
    createdAt: z.string().trim(),
};

export namespace UserGetCommand {
    export const ResponseSchema = getUserCommand;
    export type Response = z.infer<typeof ResponseSchema>;
}