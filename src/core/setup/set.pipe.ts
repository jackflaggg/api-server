import { INestApplication } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';

export function setPipes(app: INestApplication) {
    app.useGlobalPipes(new ZodValidationPipe());
}
