import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { routerPath } from '../../../core/router.path';
import { CommandBus } from '@nestjs/cqrs';
import { Response, Request } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UserQueryRepository } from '../infrastructure/query/user.query.repository';
import { RefreshAuthGuard } from '../../../core/guards/refresh.auth.guard';
import { JwtAuthGuard } from '../../../core/guards/jwt.auth.guard';
import { AuthRegistrationUserDto } from '../dto/registration.user.dto';
import { RegistrationUserCommand } from '../application/auth/registration-user.usecase';
import { UserRegistrationConfirmationDto } from '../dto/registration-confirmation.user.dto';
import { RegistrationConfirmationUserCommand } from '../application/auth/registration-confirmation-user.usecase';
import { RegistrationEmailResendUserCommand } from '../application/auth/registration-email-resend-user.usecase';
import { UserRegistrationEmResendDto } from '../dto/registration-email-resend.user.dto';
import { LoginUserCommand } from '../application/auth/login-user.usecase';
import { AuthLoginDto } from '../dto/login.user.dto';
import { LocalAuthGuard } from '../../../core/guards/local.auth.guard';
import { UserJwtPayloadDto } from '../strategies/refresh.strategy';
import { ExtractAnyUserFromRequest, ExtractUserFromRequest } from '../../../core/decorators/validate.user';
import { RefreshTokenUserCommand } from '../application/auth/refresh-token.user.usecase';
import { LogoutUserCommand } from '../application/auth/logout-user.usecase';
import { AppConfig } from '../../../core/config/app.config';

@Controller(routerPath.path.auth)
export class AuthController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly userQueryRepository: UserQueryRepository,
        private readonly appConfig: AppConfig
    ) {}

    @UseGuards(ThrottlerGuard, LocalAuthGuard)
    @Post('login')
    async login(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Body() dto: AuthLoginDto) {
        const ipDefault = req.ip ?? this.appConfig.ip;
        const userAgentDefault = req.headers['user-agent'] ?? this.appConfig.userAgent;

        const { jwt, refresh } = await this.commandBus.execute(
            new LoginUserCommand(ipDefault, userAgentDefault, req.user),
        );
        res.cookie('refreshToken', refresh, { httpOnly: true, secure: true });
        return {
            accessToken: jwt,
        };
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(ThrottlerGuard)
    @Post('registration')
    async registration(@Body() dto: AuthRegistrationUserDto) {
        return this.commandBus.execute(new RegistrationUserCommand(dto));
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(ThrottlerGuard)
    @Post('registration-confirmation')
    async registrationConfirmation(@Body() dto: UserRegistrationConfirmationDto) {
        return this.commandBus.execute(new RegistrationConfirmationUserCommand(dto.code));
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(ThrottlerGuard)
    @Post('registration-email-resending')
    async registrationEmailResend(@Body() dto: UserRegistrationEmResendDto) {
        return this.commandBus.execute(new RegistrationEmailResendUserCommand(dto.email));
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@ExtractAnyUserFromRequest() payload: UserJwtPayloadDto) {
        return this.userQueryRepository.getProfile(payload.userId);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RefreshAuthGuard)
    @Post('logout')
    async logout(@Req() req: Request, @ExtractAnyUserFromRequest() dto: UserJwtPayloadDto) {
        return this.commandBus.execute(new LogoutUserCommand(dto));
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshAuthGuard)
    @Post('refresh-token')
    async refreshToken(@ExtractUserFromRequest() user: UserJwtPayloadDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const ipDefault = req.ip ?? this.appConfig.ip;
        const userAgentDefault = req.headers['user-agent'] ?? this.appConfig.userAgent;

        const { jwt, refresh } = await this.commandBus.execute(
            new RefreshTokenUserCommand(user.userId, user.deviceId, ipDefault, userAgentDefault),
        );
        res.cookie('refreshToken', refresh, { httpOnly: true, secure: true });
        return {
            accessToken: jwt,
        };
    }
}
