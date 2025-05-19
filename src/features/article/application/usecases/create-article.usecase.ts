import { ArticlesRepository } from '../../infrastructure/articles.pg.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUpdateArticleDto } from '../../../../libs/contracts/commands/article/create.update.article';

export class CreateArticleCommand {
    constructor(public readonly payload: CreateUpdateArticleDto, public readonly userId: string) {}
}

@CommandHandler(CreateArticleCommand)
export class CreateArticleUseCase implements ICommandHandler<CreateArticleCommand> {
    constructor(private readonly articleRepository: ArticlesRepository) {}
    async execute(command: any): Promise<string> {
        return await this.articleRepository.createArticle(command.payload.title, command.payload.description, command.userId);
    }
}