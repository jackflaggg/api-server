import { UserCreateCommand } from '../../../libs/contracts/commands/user/admin.create.command';
import { createZodDto } from 'nestjs-zod';

export class createUserDto extends createZodDto(UserCreateCommand.RequestSchema) {}
