import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ArticlesRepository } from '../../infrastructure/articles.pg.repository';
import { CreateUpdateArticleDto } from '../../../../libs/contracts/commands/article/create.update.article';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export class UpdateArticleCommand {
    constructor(
        public readonly payload: CreateUpdateArticleDto,
        public readonly idArticle: string,
        public readonly userId: string,
    ) {}
}

@CommandHandler(UpdateArticleCommand)
export class UpdateArticleUseCase implements ICommandHandler<UpdateArticleCommand> {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly articleRepository: ArticlesRepository) {}

    async execute(command: UpdateArticleCommand): Promise<string> {
        const article = await this.articleRepository.findArticleById(command.idArticle);
        if (!article || article.deletedAt) {
            throw new HttpException('Статья не найдена или удалена', HttpStatus.NOT_FOUND);
        }

        if (article.authorId !== command.userId) {
            throw new HttpException('Нет прав на обновление статьи', HttpStatus.FORBIDDEN);
        }

        await this.articleRepository.updateArticle(
            {
                title: command.payload.title,
                description: command.payload.description
            },article
        );
        await this.cacheManager.del(`article:${command.idArticle}`);
        return command.idArticle;
    }
}