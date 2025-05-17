import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from '../../../../core/config/app.config';
import { randomUUID } from 'node:crypto';
import { AuthLoginDto } from '../../dto/login.user.dto';
import { UserRepository } from '../../infrastructure/user.repository';

export class LoginUserCommand {
    constructor(
        public readonly dto: AuthLoginDto,
    ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
    constructor(
        @Inject() private readonly jwtService: JwtService,
        private readonly appConfig: AppConfig,
        private readonly userRepository: UserRepository
    ) {}

    async execute(command: LoginUserCommand) {
        const user = await this.userRepository.findUserByLoginOrEmail(command.dto.loginOrEmail);

        if (!user){
            throw new HttpException('Юзер не найден!', HttpStatus.NOT_FOUND)
        }
        // 1. генерирую девайсАйди
        const deviceId: string = randomUUID();

        // 2. генерирую два токена
        const accessToken: string = this.jwtService.sign(
            { userId: user.id, deviceId },
            { expiresIn: this.appConfig.accessTokenExpirationTime, secret: this.appConfig.accessTokenSecret },
        );
        const refreshToken: string = this.jwtService.sign(
            { userId: user.id, deviceId },
            { expiresIn: this.appConfig.refreshTokenExpirationTime, secret: this.appConfig.refreshTokenSecret },
        );

        return {
            jwt: accessToken,
            refresh: refreshToken,
        };
    }
}
