// apps/backend/src/common/pipes/zod-validation.pipe.ts

import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // This pipe is a fallback; controllers should call zod schemas directly, but
    // if DTO includes a Zod schema in `metadata.metatype` we can validate.
    return value;
  }

  static validateWithSchema<T>(schema: ZodSchema<T>, data: any): T {
    try {
      return schema.parse(data);
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = err.errors.map((e) => `${e.path.join('.')} ${e.message`).join(', ');
        throw new BadRequestException(`Validation failed: ${issues}`);
      }
      throw err;
    }
  }
}
