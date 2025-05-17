import { UserJwtPayloadDto } from '../../strategies/refresh.strategy';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { SessionsRepository } from '../../infrastructure/session.repository';

export class LogoutUserCommand {
    constructor(public readonly dtoUser: UserJwtPayloadDto) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
    constructor(@Inject() private readonly sessionRepository: SessionsRepository) {}

    async execute(command: LogoutUserCommand) {
        const currentDevice = await this.sessionRepository.findSessionByDeviceId(command.dtoUser.deviceId);

        if (!currentDevice) {
            throw new HttpException('девайс не найден!', HttpStatus.NOT_FOUND);
        }

        const isOwner = String(currentDevice.user.id) === command.dtoUser.userId;

        if (!isOwner) {
            throw new HttpException('этот девайс не ваш!', HttpStatus.FORBIDDEN);
        }

        await this.sessionRepository.deleteSession(currentDevice);
    }
}
