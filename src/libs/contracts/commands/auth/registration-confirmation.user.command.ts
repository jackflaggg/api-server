import { z } from 'zod';

export const UserRegistrationConfirmationRequestSchema = z.object({
    code: z.string().trim().uuid(),
});

export namespace UserRegistrationConfirmationCommand {
    export const RequestSchema = UserRegistrationConfirmationRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
