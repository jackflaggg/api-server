import { UserRegistrationConfirmationCommand } from '../../../libs/contracts/commands/auth/registration-confirmation.user.command';
import { createZodDto } from 'nestjs-zod';

export class UserRegistrationConfirmationDto extends createZodDto(UserRegistrationConfirmationCommand.RequestSchema) {}
