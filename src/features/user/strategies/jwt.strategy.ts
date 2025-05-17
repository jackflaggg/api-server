import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from '../../../core/config/app.config';
import { UserJwtPayloadDto } from './refresh.strategy';
import { UserRepository } from '../infrastructure/user.repository';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor(
        @Inject() private readonly usersRepository: UserRepository,
        private readonly coreConfig: AppConfig,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: coreConfig.accessTokenSecret,
        });
    }

    async validate(payload: UserJwtPayloadDto) {
        await this.usersRepository.findUserToAuth(payload.userId);
        return payload;
    }
}
