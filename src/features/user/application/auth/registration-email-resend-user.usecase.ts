import { EmailService } from '../../../notifications/application/mail.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/user.repository';
import { EmailConfirmationRepository } from '../../infrastructure/email.conf.repository';
import { emailConfirmationData } from '../../utils/user/email.confirmation.ready.data';

export class RegistrationEmailResendUserCommand {
    constructor(public readonly email: string) {}
}

@CommandHandler(RegistrationEmailResendUserCommand)
export class RegistrationEmailResendUserUseCase implements ICommandHandler<RegistrationEmailResendUserCommand> {
    constructor(
        @Inject() private readonly usersRepository: UserRepository,
        @Inject() private readonly emailConfirmationRepository: EmailConfirmationRepository,
        private readonly mailer: EmailService,
    ) {}
    async execute(command: RegistrationEmailResendUserCommand) {
        const user = await this.usersRepository.findUserByEmailRaw(command.email);

        if (!user) {
            throw new HttpException('данного юзера не существует', HttpStatus.NOT_FOUND);
        }

        if (user.isConfirmed) {
            throw new HttpException('Данный аккаунт был активирован!', HttpStatus.BAD_REQUEST);
        }

        const emailConfirmation = await this.emailConfirmationRepository.findEmailConfirmation(user.id);

        if (!emailConfirmation) {
            throw new HttpException('произошла неожиданная ошибка!', HttpStatus.BAD_REQUEST);
        }

        const emailConfirmDto = emailConfirmationData();

        await this.emailConfirmationRepository.updateToCodeAndDate(emailConfirmDto, emailConfirmation);

        this.mailer.sendEmailRecoveryMessage(user.email, emailConfirmDto.confirmationCode).catch((err: unknown) => {
            console.log(String(err));
        });
    }
}
