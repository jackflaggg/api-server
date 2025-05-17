import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from '../../../../core/config/app.config';
import { randomUUID } from 'node:crypto';
import { AuthLoginDto } from '../../dto/login.user.dto';
import { UserRepository } from '../../infrastructure/user.repository';
import { CreateSessionCommand } from './create-session.command';

export class LoginUserCommand {
    constructor(
        public readonly ip: string,
        public readonly userAgent: string,
        public readonly user: any,
    ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
    constructor(
        @Inject() private readonly jwtService: JwtService,
        private readonly appConfig: AppConfig,
        private readonly commandBus: CommandBus,
        private readonly userRepository: UserRepository
    ) {}

    async execute(command: LoginUserCommand) {
        // 1. генерирую девайсАйди
        const deviceId: string = randomUUID();

        // 2. генерирую два токена
        const accessToken: string = this.jwtService.sign(
            { userId: command.user.id, deviceId },
            { expiresIn: this.appConfig.accessTokenExpirationTime, secret: this.appConfig.accessTokenSecret },
        );
        const refreshToken: string = this.jwtService.sign(
            { userId: command.user.id, deviceId },
            { expiresIn: this.appConfig.refreshTokenExpirationTime, secret: this.appConfig.refreshTokenSecret },
        );

        // 3. декодирую данные, чтобы получить дату протухания токена
        const decodedData = this.jwtService.decode(refreshToken);

        const issuedAtRefreshToken: Date = new Date(Number(decodedData.iat) * 1000);

        // 4. создаю сессию
        await this.commandBus.execute(
            new CreateSessionCommand(command.ip, command.userAgent, deviceId, command.user.id, issuedAtRefreshToken),
        );


        return {
            jwt: accessToken,
            refresh: refreshToken,
        };
    }
}
