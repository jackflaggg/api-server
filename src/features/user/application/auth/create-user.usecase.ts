import { AuthRegistrationUserDto } from '../../dto/registration.user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../infrastructure/user.repository';
import { EmailConfirmationRepository } from '../../infrastructure/email.conf.repository';
import { User } from '../../domain/user.entity';
import { BcryptService } from '../services/bcrypt.service';
import { userCreateEntityInterface } from '../../dto/create.entity.dto';
import { emailConfirmationData } from '../../utils/user/email.confirmation.ready.data';

export class CreateUserCommand {
    constructor(public readonly dto: AuthRegistrationUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailConfirmationRepository: EmailConfirmationRepository,
        private readonly bcryptService: BcryptService,
    ) {}
    async execute(command: CreateUserCommand) {
        const passwordHash = await this.bcryptService.hashPassword(command.dto.password);

        const updateUserDto: userCreateEntityInterface = {
            login: command.dto.login,
            email: command.dto.email,
            password: passwordHash,
            sentEmailRegistration: false,
        };

        const userId: string = await this.userRepository.createUser(updateUserDto);

        const emailConfirmationDto = emailConfirmationData();
        return await this.emailConfirmationRepository.createEmailConfirmationToUser(emailConfirmationDto, userId);
    }
}
