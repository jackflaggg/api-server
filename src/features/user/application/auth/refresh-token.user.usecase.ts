import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from '../../../../core/config/app.config';
import { SessionsRepository } from '../../infrastructure/session.repository';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateSessionCommand } from './create-session.command';

export class RefreshTokenUserCommand {
    constructor(
        public readonly userId: string,
        public readonly deviceId: string,
        public readonly ip: string,
        public readonly userAgent: string,
    ) {}
}

@CommandHandler(RefreshTokenUserCommand)
export class RefreshTokenUserUseCase implements ICommandHandler<RefreshTokenUserCommand> {
    constructor(
        private readonly jwtService: JwtService,
        private readonly commandBus: CommandBus,
        private readonly sessionRepository: SessionsRepository,
        private readonly coreConfig: AppConfig,
    ) {}
    async execute(command: RefreshTokenUserCommand) {
        const session = await this.sessionRepository.findSessionByDeviceId(command.deviceId);

        if (!session) {
            throw new HttpException('возможно это удаленная сессия!', HttpStatus.UNAUTHORIZED);
        }

        // я не удаляю сессию, я лишь ее обновляю!
        await this.sessionRepository.updateSession(session);

        // генерация новых токенов
        const userId = command.userId;
        const deviceId = command.deviceId;

        const refreshToken = this.jwtService.sign(
            { userId, deviceId },
            { expiresIn: this.coreConfig.refreshTokenExpirationTime, secret: this.coreConfig.refreshTokenSecret },
        );
        const accessToken = this.jwtService.sign(
            { userId, deviceId },
            { expiresIn: this.coreConfig.accessTokenExpirationTime, secret: this.coreConfig.accessTokenSecret },
        );

        const decodedRefreshToken = this.jwtService.decode(refreshToken);
        const issuedAtRefreshToken = new Date(Number(decodedRefreshToken.iat) * 1000);

        await this.commandBus.execute(new CreateSessionCommand(command.ip, command.userAgent, deviceId, userId, issuedAtRefreshToken));
        return {
            jwt: accessToken,
            refresh: refreshToken,
        };
    }
}
