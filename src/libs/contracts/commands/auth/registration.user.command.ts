import { z } from 'zod';

export const UserRegistrationRequestSchema = z.object({
    login: z.string(),
    email: z.string(),
    password: z
        .string()
        .min(8)
        .max(22)
        .transform(val => val.trim()),
});

export namespace UserRegistrationCommand {
    export const RequestSchema = UserRegistrationRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
