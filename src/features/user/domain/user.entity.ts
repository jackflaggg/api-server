import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Base } from '../../../core/domain/base.model';
import { Article } from '../../article/domain/article.entity';
import { EmailConfirmationToUser } from './email.confirmation.entity';
import { userCreateEntityInterface } from '../dto/create.entity.dto';
import { SecurityDeviceToUser } from './device.entity';

export const isNull = (elem: any) => {
    return elem === null;
};

@Entity('users')
export class User extends Base {
    @Column({ type: 'varchar' })
    login: string;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ name: 'password_hash', type: 'varchar', length: 255 })
    passwordHash: string;

    @Column({ name: 'sent_email_registration', type: 'boolean', default: false })
    sentEmailRegistration: boolean;

    @OneToMany(() => Article, article => article.author)
    articles: Article[];

    @OneToOne(() => EmailConfirmationToUser, emailConfirmation => emailConfirmation.user, { cascade: true })
    emailConfirmation: EmailConfirmationToUser;

    @OneToMany(() => SecurityDeviceToUser, device => device.user)
    securityDevices: SecurityDeviceToUser[]

    static buildInstance(dto: userCreateEntityInterface): User {
        const user = new this();
        user.login = dto.login;
        user.email = dto.email;
        user.passwordHash = dto.password;
        user.sentEmailRegistration = dto.sentEmailRegistration;

        return user;
    }

    public markDeleted(): void {
        if (!isNull(this.deletedAt)) throw new Error('Данный объект уже был помечен на удаление');

        this.deletedAt = new Date();
    }

    public updatePassword(newPassword: string): void {
        this.passwordHash = newPassword;
    }

    public confirmedSendEmailRegistration(): void {
        this.sentEmailRegistration = true;
    }
}
