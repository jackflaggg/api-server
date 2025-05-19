import { routerPath } from '../../../core/router.path';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ValidateUUIDPipe } from '../../../core/pipes/uuid.pipe';
import { JwtAuthGuard } from '../../../core/guards/jwt.auth.guard';
import { ArticlesQueryRepository } from '../infrastructure/query/articles.pg.query.repository';
import { CreateArticleCommand } from '../application/usecases/create-article.usecase';
import { DeleteArticleCommand } from '../application/usecases/delete-article.usecase';
import { UpdateArticleCommand } from '../application/usecases/update-article.usecase';
import { ExtractAnyUserFromRequest } from '../../../core/decorators/validate.user';
import { UserJwtPayloadDto } from '../../user/strategies/refresh.strategy';
import { CreateUpdateArticleDto } from '../../../libs/contracts/commands/article/create.update.article';
import { ArticlesQuery } from '../../../libs/contracts/commands/query/articles.query.command';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(routerPath.path.articles)
@Controller(routerPath.path.articles)
export class ArticleController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly articlesQueryRepository: ArticlesQueryRepository
    ) {}

    @Get()
    async getArticles(@Query() query: ArticlesQuery){
        return this.articlesQueryRepository.getAllArticles(query);
    }

    @Get(':id')
    async getArticle(@Param('id', ValidateUUIDPipe) id: string){
        return this.articlesQueryRepository.getArticle(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createArticle(@Body() dto: CreateUpdateArticleDto, @ExtractAnyUserFromRequest() user: UserJwtPayloadDto,){
        const userId = user ? user.userId : '';
        return this.commandBus.execute(new CreateArticleCommand(dto, userId))
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteArticle(@Param('id', ValidateUUIDPipe) id: string, @ExtractAnyUserFromRequest() user: UserJwtPayloadDto,){
        const userId = user ? user.userId : '';
        return this.commandBus.execute(new DeleteArticleCommand(id, userId));
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateArticle(@Param('id', ValidateUUIDPipe) id: string, @Body() dto: CreateUpdateArticleDto, @ExtractAnyUserFromRequest() user: UserJwtPayloadDto,){
        const userId = user ? user.userId : '';
        return this.commandBus.execute(new UpdateArticleCommand(dto, id, userId));
    }
}
