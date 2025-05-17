import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import { AppConfig } from '../../../core/config/app.config';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic-admin') {
    constructor(private readonly appConfig: AppConfig) {
        super();
    }
    async validate(username: string, password: string) {
        const adminName = this.appConfig.adminUsername;
        const adminPassword = this.appConfig.adminPassword;

        if (adminName === username && adminPassword === password) {
            return true;
        }
    }
}
