import { routerPath } from '../../../core/router.path';
import { Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ValidateUUIDPipe } from '../../../core/pipes/uuid.pipe';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../../../core/guards/jwt.auth.guard';

@Controller(routerPath.path.articles)
export class ArticleController {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    @Get()
    async getArticles(@Query() query: any){

    }

    @Get(':id')
    async getArticle(@Param('id', ValidateUUIDPipe) id: string){

    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createArticle(){

    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteArticle(@Param('id', ValidateUUIDPipe) id: string){

    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateArticle(@Param('id', ValidateUUIDPipe) id: string){

    }
}
