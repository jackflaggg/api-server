import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../domain/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticlesRepository {
    constructor(@InjectRepository(Article) private readonly articlesRepository: Repository<Article>) {}
    // private async save(entity: Article) {
    //     const result = await this.articlesRepository.save(entity);
    //     return result.id;
    // }
    // async createArticle(dto: any): Promise<string> {
    //     const articleEntity = Article.buildInstance(dto);
    //     return this.save(articleEntity);
    // }
    // async deleteArticle(article: Article): Promise<string> {
    //     article.makeDeleted();
    //     return this.save(article);
    // }
    // async updateArticle(dto: any, article: Article): Promise<string> {
    //     article.updateContent(dto.title, dto.description);
    //     return this.save(article);
    // }
    //
    // async findArticleById(articleId: string): Promise<Article> {
    //     const result = await this.articlesRepository
    //         .createQueryBuilder('a')
    //         .where('a.deleted_at IS NULL AND a.id = :articleId', { articleId })
    //         .getOne();
    //     // if (!result) {
    //     //     throw NotFoundDomainException.create('блог не найден', 'blogId');
    //     // }
    //     return result;
    // }
}
