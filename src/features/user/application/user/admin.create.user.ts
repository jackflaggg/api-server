import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BcryptService } from '../services/bcrypt.service';
import { UserRepository } from '../../infrastructure/user.repository';
import { emailConfirmationDataAdmin } from '../../utils/user/email.confirmation.ready.data';
import { EmailConfirmationRepository } from '../../infrastructure/email.conf.repository';
import { createUserDto } from '../../dto/create.user.dto';
import { AllExceptionsFilter } from '../../../../core/exceptions/exception.filter';
import { HttpException, HttpStatus } from '@nestjs/common';

export class AdminCreateUserCommand {
    constructor(public readonly payload: createUserDto) {}
}

@CommandHandler(AdminCreateUserCommand)
export class AdminCreateUserUseCase implements ICommandHandler<AdminCreateUserCommand> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly bcryptService: BcryptService,
        private readonly emailConfRepository: EmailConfirmationRepository,
    ) {}
    async execute(command: AdminCreateUserCommand) {
        const existingUser = await this.userRepository.findCheckExistUserEntity(command.payload.login, command.payload.email);

        if (existingUser) {
            throw new HttpException('Данный юзер уже существует!', HttpStatus.BAD_REQUEST);
        }

        const hashPassword = await this.bcryptService.hashPassword(command.payload.password);

        const userDto = {
            login: command.payload.login,
            email: command.payload.email,
            password: hashPassword,
            sentEmailRegistration: true,
        };

        const userId = await this.userRepository.createUser(userDto);

        const emailConfirmationDto = emailConfirmationDataAdmin();

        await this.emailConfRepository.createEmailConfirmationToUser(emailConfirmationDto, userId);
        return userId;
    }
}
