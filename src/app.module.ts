import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envModule } from './env.module';
import { CoreModule } from './core/config/core.module';
import { UserModule } from './features/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from './core/config/app.config';
import { typeOrmDb } from './core/config/typeorm.config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { throttlerConfig } from './core/config/throttler.config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ArticleModule } from './features/article/article.module';

@Module({
    imports: [
        envModule,
        CoreModule,
        JwtModule.registerAsync({
            imports: [CoreModule],
            inject: [AppConfig],
            useFactory: (coreConfig: AppConfig) => ({
                secret: coreConfig.accessTokenSecret,
                signOptions: { expiresIn: coreConfig.accessTokenExpirationTime },
            }),
        }),
        TypeOrmModule.forRootAsync({
            imports: [CoreModule],
            inject: [AppConfig],
            useFactory: async (coreConfig: AppConfig) => {
                return typeOrmDb(coreConfig);
            },
        }),
        ThrottlerModule.forRoot([throttlerConfig]),
        CacheModule.register({
            store: redisStore,
            host: 'localhost',
            port: 6379,
            ttl: 60,
        }),
        UserModule,
        ArticleModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
