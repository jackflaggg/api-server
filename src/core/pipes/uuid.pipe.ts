import { Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'uuid';

@Injectable()
export class ValidateUUIDPipe implements PipeTransform<string> {
    transform(value: string): string {
        if (!validate(value)) {
            throw new Error('неверный формат uuid');
        }
        return value;
    }
}
