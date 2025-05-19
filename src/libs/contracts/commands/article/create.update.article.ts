import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const ArticleCreateUpdateRequestSchema = z.object({
    title: z.string().trim().min(3, "Title минимум 3 символа").max(55),
    description: z.string().trim().min(10, "Description минимум 10 символов").max(1000),
});

export namespace ArticleCreateUpdateCommand {
    export const RequestSchema = ArticleCreateUpdateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}

export class CreateUpdateArticleDto extends createZodDto(ArticleCreateUpdateCommand.RequestSchema) {}