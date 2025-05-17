import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntityWithoutDeletedAt } from '../../../core/domain/base.model';
import { emailConfirmationCreateDto } from '../dto/create.email.confirmation.entity';

@Entity('email_confirmation_to_user')
export class EmailConfirmationToUser extends BaseEntityWithoutDeletedAt {
    @Column({ name: 'confirmation_code', type: 'varchar', length: 255 })
    confirmationCode: string;

    @Column({ name: 'expiration_date', type: 'timestamptz', nullable: true })
    expirationDate: Date | null;

    @Column({ name: 'is_confirmed', type: 'boolean', default: false })
    isConfirmed: boolean;

    @OneToOne(() => User, user => user.emailConfirmation)
    @JoinColumn({ name: 'user_id' })
    user: User;
    @Column({ name: 'user_id' })
    userId: string;

    static buildInstance(dto: emailConfirmationCreateDto, userId: string): EmailConfirmationToUser {
        const result = new EmailConfirmationToUser();

        result.confirmationCode = dto.confirmationCode;
        result.expirationDate = dto.expirationDate;
        result.isConfirmed = dto.isConfirmed;
        // Устанавливаем userId для связанной сущности
        result.userId = userId;
        return result;
    }

    public updateCodeAndConfirmed(isConfirmed: boolean): void {
        this.isConfirmed = isConfirmed;
    }

    public updateUserToCodeAndDate(dto: emailConfirmationCreateDto) {
        this.confirmationCode = dto.confirmationCode;
        this.expirationDate = dto.expirationDate;
        this.isConfirmed = dto.isConfirmed;
    }
}
