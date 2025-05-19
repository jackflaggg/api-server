import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { HttpException } from '@nestjs/common';
import { UserRepository } from '../../../../src/features/user/infrastructure/user.repository';
import { AuthService } from '../../../../src/features/user/application/services/auth.service';
import { BcryptService } from '../../../../src/features/user/application/services/bcrypt.service';

const newUserOne = {
    id: randomUUID(),
    email: 'test@mail.ru',
    password: '123456789',
    isConfirmed: true,
    confirmationCode: randomUUID(),
};

describe('AuthService', () => {
    let authService: AuthService;
    let userRepository: UserRepository;
    let bcryptService: BcryptService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserRepository,
                    useValue: {
                        findUserById: jest.fn(),
                        findUserAuth: jest.fn(),
                        findUserByEmailRaw: jest.fn(),
                        findUserByEmail: jest.fn(),
                        findUserByLoginOrEmail: jest.fn(),
                    },
                },
                {
                    provide: BcryptService,
                    useValue: {
                        hashPassword: jest.fn(),
                        comparePassword: jest.fn(),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userRepository = module.get<UserRepository>(UserRepository);
        bcryptService = module.get<BcryptService>(BcryptService);
    });

    it('⛔ возвращает ошибку, если юзер не найден', async () => {
        (userRepository.findUserByLoginOrEmail as jest.Mock).mockResolvedValue(null); // Смоделируем ситуацию, когда юзер не найден

        await expect(authService.validateUser('invalid', '00000')).rejects.toThrow(HttpException); // Проверяем, что выбрасывается исключение
    });

    it('⛔ возвращает ошибку, если пароль неверный', async () => {
        (userRepository.findUserByLoginOrEmail as jest.Mock).mockResolvedValue(newUserOne); // Находим пользователя
        (bcryptService.comparePassword as jest.Mock).mockResolvedValue(false); // Моделируем неверный пароль

        await expect(authService.validateUser(newUserOne.email, 'wrongPassword')).rejects.toThrow(HttpException); // Проверяем, что выбрасывается исключение
    });

    it('✅ успешно валидирует пользователя', async () => {
        (userRepository.findUserByLoginOrEmail as jest.Mock).mockResolvedValue(newUserOne); // Находим пользователя
        (bcryptService.comparePassword as jest.Mock).mockResolvedValue(true); // Моделируем успешное сравнение пароля

        const result = await authService.validateUser(newUserOne.email, newUserOne.password); // Вызываем метод

        expect(result).toEqual(newUserOne); // Проверяем, что результат соответствует ожидаемому пользователю
    });
});
