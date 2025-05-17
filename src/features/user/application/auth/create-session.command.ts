import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/session.repository';
import { UserRepository } from '../../infrastructure/user.repository';
import { User } from '../../domain/user.entity';

export class CreateSessionCommand {
    constructor(
        public readonly ip: string,
        public readonly userAgent: string,
        public readonly deviceId: string,
        public readonly userId: string,
        public readonly dateDevice: Date,
    ) {}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionUseCase implements ICommandHandler<CreateSessionCommand> {
    constructor(
        private readonly sessionRepository: SessionsRepository,
        private readonly userRepository: UserRepository,
    ) {}
    async execute(command: CreateSessionCommand): Promise<void> {
        const sessionDate = {
            deviceId: command.deviceId,
            ip: command.ip,
            userAgent: command.userAgent,
            userId: command.userId,
            createdAt: command.dateDevice,
        };

        const findUser: User = await this.userRepository.findUserById(sessionDate.userId);

        await this.sessionRepository.createSession(sessionDate, findUser);
    }
}