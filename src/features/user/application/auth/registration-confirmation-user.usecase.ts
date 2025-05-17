import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailConfirmationRepository } from '../../infrastructure/email.conf.repository';
import { UserRepository } from '../../infrastructure/user.repository';
import { HttpException, HttpStatus } from '@nestjs/common';

export class RegistrationConfirmationUserCommand {
    constructor(public readonly code: string) {}
}

@CommandHandler(RegistrationConfirmationUserCommand)
export class RegistrationConfirmationUserUseCase implements ICommandHandler<RegistrationConfirmationUserCommand> {
    constructor(
        private readonly usersRepository: UserRepository,
        private readonly emailConfirmationRepository: EmailConfirmationRepository,
    ) {}
    async execute(command: RegistrationConfirmationUserCommand) {
        // 1. ищу данный код в таблице, если его нет, то 404
        const findCode = await this.emailConfirmationRepository.findCodeToEmailRegistration(command.code);

        // 2. проверка на истекание кода
        if (findCode.expirationDate !== null && !findCode.isConfirmed) {
            const currentDate = new Date();
            const expirationDate = new Date(findCode.expirationDate);

            if (expirationDate < currentDate) {
                throw new HttpException('код протух, переобновись!', HttpStatus.BAD_REQUEST);
            }
        }

        // 3. проверяю, что код не подтвержден!
        if (findCode.isConfirmed) {
            throw new HttpException('подтверждение регистрации уже было!', HttpStatus.BAD_REQUEST);
        }

        const isConfirmed = true;

        await this.emailConfirmationRepository.updateCodeAndIsConfirmed(isConfirmed, findCode);
    }
}
