import { ConfigModule } from '@nestjs/config';

export const envModule = ConfigModule.forRoot({
    envFilePath: [`${process.cwd()}/.env`],
    isGlobal: true,
});
