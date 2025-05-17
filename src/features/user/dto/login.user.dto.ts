import { UserLoginCommand } from '../../../libs/contracts/commands/auth/login.user.command';
import { createZodDto } from 'nestjs-zod';

export class AuthLoginDto extends createZodDto(UserLoginCommand.RequestSchema){}