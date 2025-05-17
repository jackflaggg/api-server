import { UserQueryCommand } from '../../../libs/contracts/commands/query/user.query.command';
import { createZodDto } from 'nestjs-zod';

export class UserQueryDto extends createZodDto(UserQueryCommand.RequestSchema) {}
