import { z } from 'zod';
import { emailRegexp, trimString } from '../../constants/user.constants';

const UserCreateRequestSchema = z.object({
    login: z.string().trim().min(3).max(10),
    password: z.string().min(8).max(22).transform(trimString),
    email: z
        .string()
        .transform(trimString)
        .refine(email => emailRegexp.test(email)),
});

export namespace UserCreateCommand {
    export const RequestSchema = UserCreateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
