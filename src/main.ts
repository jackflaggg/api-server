import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './core/config/app.config';
import cookieParser from 'cookie-parser';
import { installConfig } from './core/setup/set.config';

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const coreConfig = appContext.get<AppConfig>(AppConfig);

    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    installConfig(app, coreConfig);

    await app.listen(coreConfig.port, () => {
        console.log('Сервер запущен на порту! ' + coreConfig.port);
        console.log('ENV:', coreConfig.env);
    });
}
bootstrap().then();
