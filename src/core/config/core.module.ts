import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './app.config';

@Global()
@Module({
    imports: [ConfigModule],
    exports: [AppConfig],
    providers: [AppConfig],
})
export class CoreModule {}
