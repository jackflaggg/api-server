import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from '../../core/config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { EmailConfirmationToUser } from './domain/email.confirmation.entity';
import { UserController } from './api/user.controller';
import { BcryptService } from './application/services/bcrypt.service';
import { UserQueryRepository } from './infrastructure/query/user.query.repository';
import { UserRepository } from './infrastructure/user.repository';
import { EmailConfirmationRepository } from './infrastructure/email.conf.repository';
import { BasicStrategy } from './strategies/basic.strategy';
import { AccessTokenStrategy } from './strategies/jwt.strategy';
import { JwtRefreshAuthPassportStrategy } from './strategies/refresh.strategy';
import { AuthController } from './api/auth.controller';
import { AdminCreateUserUseCase } from './application/user/admin.create.user';
import { DeleteUserUseCase } from './application/user/admin.delete.user';
import { EmailAdapter } from '../notifications/adapter/email.adapter';
import { EmailService } from '../notifications/application/mail.service';
import { RegistrationUserUseCase } from './application/auth/registration-user.usecase';
import { CreateUserUseCase } from './application/auth/create-user.usecase';
import { RegistrationConfirmationUserUseCase } from './application/auth/registration-confirmation-user.usecase';
import { RegistrationEmailResendUserUseCase } from './application/auth/registration-email-resend-user.usecase';
import { LocalStrategy } from './strategies/local.strategy';
import { LoginUserUseCase } from './application/auth/login-user.usecase';
import { AuthService } from './application/services/auth.service';
import { SecurityDeviceToUser } from './domain/device.entity';
import { SessionsRepository } from './infrastructure/session.repository';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [AppConfig],
            useFactory: (coreConfig: AppConfig) => ({
                secret: coreConfig.accessTokenSecret,
                signOptions: { expiresIn: coreConfig.accessTokenExpirationTime },
            }),
        }),
        TypeOrmModule.forFeature([User, EmailConfirmationToUser, SecurityDeviceToUser]),
        PassportModule,
        CqrsModule,
    ],
    providers: [
        EmailService,
        EmailAdapter,
        BcryptService,
        AuthService,

        UserQueryRepository,
        UserRepository,
        EmailConfirmationRepository,
        SessionsRepository,

        BasicStrategy,
        AccessTokenStrategy,
        JwtRefreshAuthPassportStrategy,
        LocalStrategy,

        AdminCreateUserUseCase,
        DeleteUserUseCase,
        RegistrationUserUseCase,
        CreateUserUseCase,
        RegistrationConfirmationUserUseCase,
        RegistrationEmailResendUserUseCase,
        LoginUserUseCase
    ],
    controllers: [UserController, AuthController],
})
export class UserModule {}
