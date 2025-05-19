import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Article } from '../../domain/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getArticlesQuery } from '../../../user/utils/user/get.query.params.user';
import { ArticlesQuery } from '../../../../libs/contracts/commands/query/articles.query.command';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ArticlesQueryRepository {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, @InjectRepository(Article) private readonly articlesRepository: Repository<Article>) {
    }
    async getArticle(id: string) {
        const cacheKey = `article:${id}`;

        // Пытаемся получить из кеша
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }

        const result = await this.articlesRepository
            .createQueryBuilder('a')
            .select([
                'a.id as id',
                'a.created_at as "createdAt"',
                'a.title as title',
                'a.description as description',
                'u.login as "authorName"',
            ])
            .where('a.deleted_at IS NULL AND a.id = :id', { id })
            .leftJoin('a.author', 'u')
            .getRawOne();

        if (!result) {
            throw new HttpException('статья не найдена!', HttpStatus.NOT_FOUND);
        }
        await this.cacheManager.set(cacheKey, result, 60);
        return result;
    }

    async getAllArticles(queryData: ArticlesQuery) {
        const cacheKey = `articles:${JSON.stringify(queryData)}`;

        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }

        const { sortBy, sortDirection, pageNumber, pageSize, searchTitleTerm, authorId, dateFrom, dateTo } = getArticlesQuery(queryData);

        const offset = (pageNumber - 1) * pageSize;

        const queryBuilder = this.articlesRepository.createQueryBuilder('a')
            .where('a.deleted_at IS NULL');

        if (searchTitleTerm) {
            queryBuilder.andWhere('a.title ILIKE :title', { title: `%${searchTitleTerm}%` });
        }

        if (authorId) {
            queryBuilder.andWhere('a.author_id = :authorId', { authorId });
        }

        if (dateFrom) {
            queryBuilder.andWhere('a.created_at >= :dateFrom', { dateFrom });
        }
        if (dateTo) {
            queryBuilder.andWhere('a.created_at <= :dateTo', { dateTo });
        }

        const [resultArticles, countArticles] = await Promise.all([
            queryBuilder
                .select([
                    'a.id AS id',
                    'a.title AS title',
                    'a.description AS description',
                    'a.author_id AS "authorId"',
                    'a.created_at AS "createdAt"',
                ])
                .orderBy(`a.${sortBy}`, sortDirection)
                .skip(offset)
                .take(pageSize)
                .getRawMany(),

            queryBuilder.getCount(),
        ]);

        await this.cacheManager.set(cacheKey, resultArticles, 60);

        return {
            items: resultArticles,
            page: pageNumber,
            size: pageSize,
            totalCount: countArticles,
        };
    }
}