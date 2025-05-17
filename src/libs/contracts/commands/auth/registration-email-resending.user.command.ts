import { z } from 'zod';

export const UserRegistrationEmResendRequestSchema = z.object({
    email: z
        .string()
        .email()
        .transform(value => value.trim()),
});

export namespace UserRegistrationCommand {
    export const RequestSchema = UserRegistrationEmResendRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
