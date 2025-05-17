import { AuthRegistrationUserDto } from '../../dto/registration.user.dto';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/user.repository';
import { EmailService } from '../../../notifications/application/mail.service';
import { User } from '../../domain/user.entity';
import { CreateUserCommand } from './create-user.usecase';

export class RegistrationUserCommand {
    constructor(public readonly payload: AuthRegistrationUserDto) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase implements ICommandHandler<RegistrationUserCommand> {
    constructor(
        @Inject() private readonly userRepository: UserRepository,
        private readonly commandBus: CommandBus,
        private readonly mailer: EmailService,
    ) {}
    async execute(command: RegistrationUserCommand): Promise<void> {
        const existingUser = await this.userRepository.findCheckExistUserEntity(command.payload.login, command.payload.email);

        if (existingUser) {
            throw new HttpException('Данный юзер уже существует!', HttpStatus.BAD_REQUEST);
        }

        const emailConfirmation = await this.commandBus.execute<CreateUserCommand, { userId: string; confirmationCode: string }>(
            new CreateUserCommand(command.payload),
        );

        const user: User = await this.userRepository.findUserById(emailConfirmation.userId);

        this.mailer
            .sendEmailRecoveryMessage(command.payload.email, emailConfirmation.confirmationCode)
            .then(() => {
                this.userRepository.updateUserConfirmedSendEmail(user);
            })
            .catch((err: unknown) => {
                console.log(err);
            });
    }
}
