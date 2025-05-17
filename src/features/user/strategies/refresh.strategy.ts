import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AppConfig } from '../../../core/config/app.config';
import { UserRepository } from '../infrastructure/user.repository';

export class UserJwtPayloadDto {
    userId: string;
    iat: number;
    exp: number;
}

@Injectable()
export class JwtRefreshAuthPassportStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        @Inject() private readonly usersRepository: UserRepository,
        private readonly coreConfig: AppConfig,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                req => {
                    // Extract the JWT from the cookie
                    return req.cookies?.refreshToken; // Ensure that the cookie name matches what you set
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: coreConfig.refreshTokenSecret,
        });
    }

    async validate(payload: UserJwtPayloadDto) {
        await this.usersRepository.findUserToAuth(payload.userId);

        return payload;
    }
}
