import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ArticlesRepository } from '../../infrastructure/articles.pg.repository';
import { UserRepository } from '../../../user/infrastructure/user.repository';
import { HttpException, HttpStatus } from '@nestjs/common';

export class DeleteArticleCommand {
    constructor(public readonly idArticle: string, public readonly userId: string) {}
}

@CommandHandler(DeleteArticleCommand)
export class DeleteArticleUseCase implements ICommandHandler<DeleteArticleCommand> {
    constructor(private readonly articleRepository: ArticlesRepository, private readonly userRepository: UserRepository) {}
    async execute(command: DeleteArticleCommand) {
        const user = await this.userRepository.findUserById(command.userId);
        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
        }

        const article = await this.articleRepository.findArticleById(command.idArticle);
        if (!article || article.deletedAt) {
            throw new HttpException('Статья не найдена или уже удалена', HttpStatus.NOT_FOUND);
        }

        // Проверка прав: допустим, только автор может удалить статью
        if (article.authorId !== command.userId) {
            throw new HttpException('Нет прав на удаление статьи', HttpStatus.FORBIDDEN);
        }

        // Помечаем статью как удалённую (soft delete)
        await this.articleRepository.deleteArticle(article);
    }
}