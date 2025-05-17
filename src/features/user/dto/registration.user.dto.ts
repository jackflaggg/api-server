import { createZodDto } from 'nestjs-zod';
import { UserRegistrationCommand } from '../../../libs/contracts/commands/auth/registration.user.command';

export class AuthRegistrationUserDto extends createZodDto(UserRegistrationCommand.RequestSchema) {}
