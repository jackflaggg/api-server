import { routerPath } from '../../../core/router.path';
import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserQueryRepository } from '../infrastructure/query/user.query.repository';
import { BasicAuthGuard } from '../../../core/guards/basic.auth.guard';
import { ValidateUUIDPipe } from '../../../core/pipes/uuid.pipe';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { AdminCreateUserCommand } from '../application/user/admin.create.user';
import { DeleteUserCommand } from '../application/user/admin.delete.user';
import { createUserDto } from '../dto/create.user.dto';
import { SwaggerDelete } from '../../../core/decorators/swagger-delete';
import { SwaggerGet } from '../../../core/decorators/swagger-get';
import { SwaggerPostCreate } from '../../../core/decorators/swagger-post';
import { UserQueryDto } from '../dto/user.query.dto';
import { GetResponseUserDto } from '../dto/get.response.user.dto';
import { GetResponseAPIUserDto } from '../../../core/swagger/user/api.get.response.schema';

@ApiTags(routerPath.path.users)
@UseGuards(BasicAuthGuard)
@Controller(routerPath.path.users)
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly userQueryRepo: UserQueryRepository,
    ) {}

    @SwaggerPostCreate('Create a new user', GetResponseUserDto, 'WithAuth')
    @Post()
    @ApiBasicAuth()
    async createUser(@Body() dto: createUserDto) {
        const userId: string = await this.commandBus.execute(new AdminCreateUserCommand(dto));
        return this.userQueryRepo.getUser(userId);
    }

    @SwaggerDelete('Delete a user by ID', 'User ID')
    @Delete(':id')
    @ApiBasicAuth()
    async deleteUser(@Param('id', ValidateUUIDPipe) id: string) {
        return this.commandBus.execute(new DeleteUserCommand(id));
    }

    @SwaggerGet('Get all users', UserQueryDto, 'WithAuth')
    @Get()
    @ApiBasicAuth()
    async getAllUsers(@Query() query: UserQueryDto) {
        return this.userQueryRepo.getAllUsers(query);
    }

    @SwaggerGet('Get one user', GetResponseAPIUserDto, 'WithAuth', {
        example: {
            summary: 'Example get user',
            value: {
                id: '123...23',
                login: 'jackflagg',
                email: '228@gmail.com',
                created_at: '2024-01-01T00:00:00Z',
            },
        },
    })
    @Get(':id')
    @ApiBasicAuth()
    async getUser(@Param('id', ValidateUUIDPipe) id: string): Promise<GetResponseUserDto> {
        return this.userQueryRepo.getUser(id);
    }
}
