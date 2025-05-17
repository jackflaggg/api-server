import { typeOrmConfigOptions } from './migration.config';
import { DataSource } from 'typeorm';
import { User } from '../../src/features/user/domain/user.entity';
import { join } from 'path';
import { Article } from '../../src/features/article/domain/article.entity';
import { EmailConfirmationToUser } from '../../src/features/user/domain/email.confirmation.entity';
import { SecurityDeviceToUser } from '../../src/features/user/domain/device.entity';

export default new DataSource({
    ...typeOrmConfigOptions,
    entities: [
        User, Article, EmailConfirmationToUser, SecurityDeviceToUser
    ],
    migrations: [join(__dirname, '../data/*.ts')],
});
