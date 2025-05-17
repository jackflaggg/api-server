import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/user.entity';
import { Brackets, Repository } from 'typeorm';
import { getUsersQuery } from '../../utils/user/get.query.params.user';
import { UserQueryDto } from '../../dto/user.query.dto';
import { GetResponseUserDto } from '../../dto/get.response.user.dto';

@Injectable()
export class UserQueryRepository {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}
    async getUser(id: string): Promise<GetResponseUserDto> {
        const result = await this.userRepository
            .createQueryBuilder('u')
            .select('u.id as id, u.login as login, u.email as email, u.created_at as "createdAt"')
            .where('u.deleted_at IS NULL AND u.id = :id', { id })
            .getRawOne();

        if (!result) {
            throw new HttpException('юзер не найден', HttpStatus.NOT_FOUND);
        }
        return result;
    }
    async getProfile(id: string){
        const result = await this.userRepository.createQueryBuilder('u').select(['u.id as "userId"', 'u.login as "login"', 'u.email as "email"']).where('u.id = :id', {id}).andWhere('u.deleted_at IS NULL').getRawOne();
        if (!result){
            throw new HttpException('Юзер не найден', HttpStatus.NOT_FOUND)
        }
        return result;
    }
    async getAllUsers(queryData: UserQueryDto) {
        const { sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm } = getUsersQuery(queryData);

        const offset = (pageNumber - 1) * pageSize;

        const queryBuilder = this.userRepository.createQueryBuilder('u').where('u.deleted_at IS NULL');
        if (searchEmailTerm || searchLoginTerm) {
            queryBuilder.andWhere(
                new Brackets(qb =>
                    qb
                        .where('u.login ILIKE :login', { login: `%${searchLoginTerm}%` })
                        .orWhere('u.email ILIKE :email', { email: `%${searchEmailTerm}%` }),
                ),
            );
        }

        const [resultUsers, countUsers] = await Promise.all([
            queryBuilder
                .select(['u.id AS id, u.login AS login, u.email AS email, u.created_at AS "createdAt"'])
                .orderBy(`u.${sortBy}`, `${sortDirection}`)
                .skip(offset)
                .take(pageSize)
                .getRawMany(),
            queryBuilder.getCount(),
        ]);

        return {
            items: resultUsers,
            page: pageNumber,
            size: pageSize,
            totalCount: countUsers,
        };
    }
}
