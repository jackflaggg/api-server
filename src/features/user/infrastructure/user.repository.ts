import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { userCreateEntityInterface } from '../dto/create.entity.dto';
import { EmailConfirmationToUser } from '../domain/email.confirmation.entity';

@Injectable()
export class UserRepository {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}
    async findUserByEmailRaw(email: string) {
        const result = await this.userRepository
            .createQueryBuilder('u')
            .select(['u.id as id', 'u.email as email, u', 'em.is_confirmed AS "isConfirmed"', 'em.confirmation_code AS "confirmationCode"'])
            .innerJoin(EmailConfirmationToUser, 'em', 'u.id = em.user_id')
            .where('u.email = :email AND u.deleted_at IS NULL', { email })
            .getRawOne();

        if (!result) {
            return null;
        }
        return result;
    }
    async findUserByLoginOrEmail(search: string) {
        const result = await this.userRepository
            .createQueryBuilder('u')
            .select(['u.id as id', 'u.password_hash as password'])
            .where('u.email = :search OR u.login = :search', { search })
            .getRawOne();

        if (!result) {
            return null;
        }
        return result;
    }
    async findUserToAuth(id: string) {
        const result = await this.userRepository
            .createQueryBuilder('u')
            .select('u.id AS "userId"')
            .innerJoin('email_confirmation_to_user', 'em', 'u.id = em.user_id')
            .where('u.id = :id AND u.deleted_at IS NULL', { id })
            .getRawOne();
        if (!result) {
            throw new HttpException('не авторизован', HttpStatus.UNAUTHORIZED)
        }
        return {
            userId: result.userId,
        };
    }
    async findCheckExistUserEntity(login: string, email: string): Promise<{id: string} | null> {
        const result = await this.userRepository
            .createQueryBuilder('u')
            .select('u.id as id')
            .where('u.email = :email OR u.login = :login', { email, login })
            .getRawOne();

        if (!result) {
            return null;
        }
        return result;
    }
    private async saveUser(entity: User): Promise<string> {
        const result = await this.userRepository.save(entity);
        return result.id;
    }
    async findUserById(id: string) {
        const result = await this.userRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .andWhere('user.deletedAt IS NULL')
            .getOne();

        if (!result) {
            throw new HttpException('юзер не найден!', HttpStatus.NOT_FOUND);
        }

        return result;
    }
    async deleteUser(user: User) {
        user.markDeleted();
        return await this.saveUser(user);
    }
    async createUser(dto: userCreateEntityInterface) {
        const newUser = User.buildInstance(dto);
        return await this.saveUser(newUser);
    }

    async updateUserPassword(entity: User, password: string) {
        entity.updatePassword(password);
        return this.saveUser(entity);
    }

    async updateUserConfirmedSendEmail(entity: User) {
        entity.confirmedSendEmailRegistration();
        return this.saveUser(entity);
    }
}
