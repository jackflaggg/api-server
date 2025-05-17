import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from '../../../../core/config/app.config';

export class RefreshTokenUserCommand {
    constructor(
        public readonly userId: string,
        public readonly deviceId: string,
    ) {}
}

@CommandHandler(RefreshTokenUserCommand)
export class RefreshTokenUserUseCase implements ICommandHandler<RefreshTokenUserCommand> {
    constructor(
        private readonly jwtService: JwtService,
        private readonly coreConfig: AppConfig,
    ) {}
    async execute(command: RefreshTokenUserCommand) {
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

        return {
            jwt: accessToken,
            refresh: refreshToken,
        };
    }
}
