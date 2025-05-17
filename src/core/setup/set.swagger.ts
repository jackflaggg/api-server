import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GetResponseAPIUserDto } from '../swagger/user/api.get.response.schema'; // импортируем класс DTO
import fs from 'fs';

export function swaggerSetup(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle('API Server')
        .setDescription('Это тестовое задание!')
        .addBearerAuth()
        .setVersion('1.0')
        .build();

    const documentFactory = SwaggerModule.createDocument(app, config, {
        extraModels: [GetResponseAPIUserDto], // передаём класс DTO, а не Zod-схему
    });

    fs.writeFileSync('./docs/swagger.json', JSON.stringify(documentFactory));

    SwaggerModule.setup('api', app, documentFactory, {
        customSiteTitle: 'Api Server Swagger',
    });
}
