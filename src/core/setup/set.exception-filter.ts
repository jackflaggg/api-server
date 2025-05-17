import { INestApplication } from '@nestjs/common';
import { AllExceptionsFilter } from '../exceptions/exception.filter';

export function setExceptionFilter(app: INestApplication) {
    app.useGlobalFilters(new AllExceptionsFilter());
}
