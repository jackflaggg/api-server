import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/user.repository';
import { BcryptService } from './bcrypt.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private bcryptService: BcryptService,
    ) {}

    async validateUser(userName: string, password: string) {

        const user = await this.userRepository.findUserByLoginOrEmail(userName);

        if (!user) {
            throw new HttpException('не авторизован', HttpStatus.UNAUTHORIZED)
        }

        const comparePassword: boolean = await this.bcryptService.comparePassword(password, user.password);

        if (!comparePassword) {
            throw new HttpException('не авторизован', HttpStatus.UNAUTHORIZED)
        }

        return user;
    }
}
