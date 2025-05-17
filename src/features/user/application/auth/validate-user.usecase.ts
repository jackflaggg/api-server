import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/user.repository';

export class ValidateUserCommand {
    constructor(public readonly payload: any) {}
}

@CommandHandler(ValidateUserCommand)
export class ValidateUserUseCase implements ICommandHandler<ValidateUserCommand> {
    constructor(private readonly userRepository: UserRepository) {}
    async execute(command: ValidateUserCommand) {
        const user = await this.userRepository.findUserByLoginOrEmail(command.payload.loginOrEmail);
        if (!user) {
            throw new HttpException('Юзер не найден', HttpStatus.NOT_FOUND);
        }
        return user.id;
    }
}
