import { EmailConfirmationToUser } from '../domain/email.confirmation.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { emailConfirmationCreateDto } from '../dto/create.email.confirmation.entity';

@Injectable()
export class EmailConfirmationRepository {
    constructor(
        @InjectRepository(EmailConfirmationToUser) private emailConfirmationRepositoryTypeOrm: Repository<EmailConfirmationToUser>,
    ) {}
    async createEmailConfirmationToUser(dto: emailConfirmationCreateDto, userId: string) {
        const result = EmailConfirmationToUser.buildInstance(dto, userId);
        return this.saveEmailConfirmation(result);
    }
    async updateToCodeAndDate(dto: emailConfirmationCreateDto, entity: EmailConfirmationToUser) {
        entity.updateUserToCodeAndDate(dto);
        return this.saveEmailConfirmation(entity);
    }
    async updateCodeAndIsConfirmed(isConfirmed: boolean, entity: EmailConfirmationToUser) {
        entity.updateCodeAndConfirmed(isConfirmed);
        return this.saveEmailConfirmation(entity);
    }
    async findEmailConfirmation(userId: string) {
        const result = await this.emailConfirmationRepositoryTypeOrm
            .createQueryBuilder('em')
            .where('em.user_id = :userId', { userId })
            .getOne();
        if (!result) {
            return void 0;
        }
        return result;
    }
    async findCodeToEmailRegistration(code: string) {
        const result = await this.emailConfirmationRepositoryTypeOrm
            .createQueryBuilder('em')
            .where('em.confirmation_code = :code', { code })
            .getOne();
        if (!result) {
            throw new HttpException('код не найден', HttpStatus.NOT_FOUND);
        }
        return result;
    }
    private async saveEmailConfirmation(entity: EmailConfirmationToUser) {
        const result = await this.emailConfirmationRepositoryTypeOrm.save(entity);
        return {
            userId: String(result.userId),
            confirmationCode: result.confirmationCode,
        };
    }
}
