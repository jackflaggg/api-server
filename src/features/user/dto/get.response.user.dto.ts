import { createZodDto } from 'nestjs-zod';
import { UserGetCommand } from '../../../libs/contracts/commands/user/userGetResponseSchema';

export class GetResponseUserDto extends createZodDto(UserGetCommand.ResponseSchema) {}
