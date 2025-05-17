import { UserRegistrationCommand } from '../../../libs/contracts/commands/auth/registration-email-resending.user.command';
import { createZodDto } from 'nestjs-zod';

export class UserRegistrationEmResendDto extends createZodDto(UserRegistrationCommand.RequestSchema) {}
