import { z } from 'zod';
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const loginRegex = /^[a-zA-Z0-9.-]+$/;

export const UserLoginRequestSchema = z.object({
    loginOrEmail: z
        .string()
        .refine((value: string | number) => {
            if (typeof value !== 'string' || value.trim() === '') {
                return false;
            }

            const trimmedValue = value.trim();

            if (trimmedValue.length < 3) {
                return false;
            }

            if (trimmedValue.includes('@')) {
                return emailRegex.test(trimmedValue);
            }

            return loginRegex.test(trimmedValue);
        })
        .transform(value => value.trim()),

    password: z
        .string()
        .min(6)
        .max(22)
        .transform(val => val.trim()),
});

export namespace UserLoginCommand {
    export const RequestSchema = UserLoginRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
