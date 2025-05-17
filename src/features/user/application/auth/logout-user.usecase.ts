import { UserJwtPayloadDto } from '../../strategies/refresh.strategy';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

export class LogoutUserCommand {
    constructor(public readonly dtoUser: UserJwtPayloadDto) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
    constructor() {}

    async execute(command: LogoutUserCommand) {
        // const currentDevice = await this.sessionRepository.findSessionByDeviceId(command.dtoUser.deviceId);
        //
        // if (!currentDevice) {
        //     throw NotFoundDomainException.create('девайс не найден!');
        // }
        //
        // const isOwner = String(currentDevice.user.id) === command.dtoUser.userId;
        //
        // if (!isOwner) {
        //     throw ForbiddenDomainException.create('этот девайс не ваш!');
        // }
        //
        // await this.sessionRepository.deleteSession(currentDevice);
    }
}
