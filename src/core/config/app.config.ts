import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { configSchema, ConfigType } from './config.schema';

/**
 * Сервис для хранения конфигурации приложения.
 * Загружает настройки из переменных окружения и предоставляет доступ к ним.
 */
@Injectable()
export class AppConfig {
    public port: number;
    public env: string;
    public refreshTokenSecret: string;
    public accessTokenSecret: string;
    public accessTokenExpirationTime: string;
    public refreshTokenExpirationTime: string;
    public ip: string;
    public userAgent: string;
    public adminUsername: string;
    public adminPassword: string;
    public adminEmail: string;
    public adminEmailPassword: string;

    public typeSql: string;
    public hostSql: string;
    public portSql: number;
    public usernameSql: string;
    public passwordSql: string;
    public databaseNameSql: string;
    public includeTestingModule: string;
    public isSwaggerEnabled: boolean;

    constructor(private configService: ConfigService<Record<string, unknown>, true>) {
        const config = {
            port: this.configService.get('PORT') || '9000',
            env: this.configService.getOrThrow('NODE_ENV'),
            refreshTokenSecret: this.configService.get('JWT_REFRESH_SECRET'),
            accessTokenSecret: this.configService.get('JWT_ACCESS_SECRET'),
            accessTokenExpirationTime: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
            refreshTokenExpirationTime: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
            adminUsername: this.configService.getOrThrow('ADMIN_USERNAME'),
            adminPassword: this.configService.getOrThrow('ADMIN_PASS'),
            adminEmail: this.configService.getOrThrow('ADMIN_EMAIL'),
            adminEmailPassword: this.configService.getOrThrow('ADMIN_EMAIL_PASSWORD'),
            ip: this.configService.get('IP'),
            userAgent: this.configService.get('USER_AGENT'),
            typeSql: this.configService.get('TYPE_SQL'),
            hostSql: this.configService.get('HOST_SQL'),
            portSql: this.configService.get('PORT_SQL'),
            usernameSql: this.configService.get('USERNAME_SQL'),
            passwordSql: this.configService.get('PASSWORD_SQL'),
            databaseNameSql: this.configService.get('DATABASE_NAME_SQL'),

            isSwaggerEnabled: this.configService.get('IS_SWAGGER_ENABLED') === 'true',
            // includeTestingModule: this.configService.get('INCLUDE_TESTING_MODULE'),
        };

        try {
            const validatedConfig: ConfigType = configSchema.parse(config);
            Object.assign(this, validatedConfig);
        } catch (error) {
            throw new Error('Ошибка валидации: ' + (error as Error).message);
        }
    }
}
