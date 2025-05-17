import { INestApplication, VersioningType } from '@nestjs/common';
import { AppConfig } from '../config/app.config';
import { setPipes } from './set.pipe';
import { setExceptionFilter } from './set.exception-filter';
import { swaggerSetup } from './set.swagger';

export function installConfig(app: INestApplication, coreConfig: AppConfig) {
    setPipes(app);

    setExceptionFilter(app);
    app.enableVersioning({
        type: VersioningType.HEADER,
        header: 'Custom-Header',
    });
    app.enableCors({
        origin: '*',
        methods: 'GET, PUT, POST, DELETE',
        allowedHeaders: 'Content-Type, Authorization, Custom-Header', // Разрешенные заголовки
    });
    if (coreConfig.isSwaggerEnabled) {
        swaggerSetup(app);
    }
}
