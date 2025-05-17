import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppConfig } from './app.config';
import { User } from '../../features/user/domain/user.entity';
import { Article } from '../../features/article/domain/article.entity';
import { EmailConfirmationToUser } from '../../features/user/domain/email.confirmation.entity';
import { SecurityDeviceToUser } from '../../features/user/domain/device.entity';

export const typeOrmDb = (coreConfig: AppConfig): TypeOrmModuleAsyncOptions => {
    return {
        type: coreConfig.typeSql,
        host: coreConfig.hostSql,
        port: coreConfig.portSql,
        username: coreConfig.usernameSql,
        password: coreConfig.passwordSql,
        database: coreConfig.databaseNameSql,
        entities: [User, Article, EmailConfirmationToUser, SecurityDeviceToUser],
        synchronize: false,
        autoLoadEntities: true,
        logging: ['warn', 'error'],
        maxQueryExecutionTime: 1000,
        logger: 'simple-console',
    } as TypeOrmModuleAsyncOptions;
};
