import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../infrastructure/user.repository';
import { HttpException, HttpStatus } from '@nestjs/common';

export class DeleteUserCommand {
    constructor(public readonly userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
    constructor(private readonly userRepository: UserRepository) {}
    async execute(command: DeleteUserCommand) {
        const user = await this.userRepository.findUserById(command.userId);

        if (!user) {
            throw new HttpException('юзер не найден', HttpStatus.NOT_FOUND);
        }

        await this.userRepository.deleteUser(user);
    }
}
