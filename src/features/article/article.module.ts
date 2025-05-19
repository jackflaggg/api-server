import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from '../../core/config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { Article } from './domain/article.entity';
import { ArticleController } from './api/article.controller';
import { CreateArticleUseCase } from './application/usecases/create-article.usecase';
import { DeleteArticleUseCase } from './application/usecases/delete-article.usecase';
import { UpdateArticleUseCase } from './application/usecases/update-article.usecase';
import { ArticlesRepository } from './infrastructure/articles.pg.repository';
import { ArticlesQueryRepository } from './infrastructure/query/articles.pg.query.repository';
import { RedisService } from './application/services/redis.service';
import { UserModule } from '../user/user.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [AppConfig],
            useFactory: (coreConfig: AppConfig) => ({
                secret: coreConfig.accessTokenSecret,
                signOptions: { expiresIn: coreConfig.accessTokenExpirationTime },
            }),
        }),
        TypeOrmModule.forFeature([Article]),
        PassportModule,
        CacheModule.register(),
        CqrsModule,
        UserModule,
    ],
    exports: [],
    providers: [
        CreateArticleUseCase, DeleteArticleUseCase, UpdateArticleUseCase, ArticlesRepository, ArticlesQueryRepository, RedisService
    ],
    controllers: [ArticleController],
})
export class ArticleModule {}