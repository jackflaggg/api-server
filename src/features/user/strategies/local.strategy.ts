import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../application/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local'){
    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'loginOrEmail' });
    }

    async validate(username: string, password: string){
        username = username.trim();
        password = password.trim();
        return await this.authService.validateUser(username, password);
    }
}